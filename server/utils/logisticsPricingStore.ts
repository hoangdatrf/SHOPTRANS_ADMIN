import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createError } from 'h3'
import type {
  ChargeRule,
  ChargeScope,
  ContainerType,
  FclRate,
  LogisticsPricingDb,
  QuoteCalculateInput,
  RecordStatus,
} from '../../types/logisticsPricing'
import { createLogisticsPricingSeed } from './logisticsPricingSeed'

const dbPath = resolve(process.cwd(), 'server/data/logistics-pricing-db.json')

const nowIso = () => new Date().toISOString()
export const makeId = (prefix: string) => `${prefix}-${randomUUID()}`

const normalizeCode = (value: unknown) => String(value || '').trim().toUpperCase()
const asDateOnly = (value?: string) => String(value || new Date().toISOString().slice(0, 10)).slice(0, 10)

export const readPricingDb = async (): Promise<LogisticsPricingDb> => {
  try {
    const raw = await readFile(dbPath, 'utf8')
    return JSON.parse(raw) as LogisticsPricingDb
  } catch {
    const seed = createLogisticsPricingSeed()
    await writePricingDb(seed)
    return seed
  }
}

export const writePricingDb = async (db: LogisticsPricingDb) => {
  await mkdir(dirname(dbPath), { recursive: true })
  await writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`, 'utf8')
}

export const resetPricingDb = async () => {
  const seed = createLogisticsPricingSeed()
  await writePricingDb(seed)
  return seed
}

export const listByQuery = <T extends Record<string, any>>(items: T[], query: Record<string, any>) => {
  const keyword = String(query.search || query.keyword || '').trim().toLowerCase()
  const status = String(query.status || '').trim().toUpperCase()
  const activeAt = String(query.activeAt || query.effectiveDate || '').slice(0, 10)

  return items.filter((item) => {
    if (status && item.status !== status) return false
    if (activeAt && item.validityFrom && item.validityTo && !isActiveOn(item, activeAt)) return false
    if (query.countryId && item.countryId !== query.countryId) return false
    if (query.originCountryId && item.originCountryId !== query.originCountryId) return false
    if (query.destinationCountryId && item.destinationCountryId !== query.destinationCountryId) return false
    if (query.polId && item.polId !== query.polId) return false
    if (query.podId && item.podId !== query.podId) return false
    if (query.shippingLineId && item.shippingLineId !== query.shippingLineId) return false
    if (query.chargeGroup && item.chargeGroup !== query.chargeGroup) return false
    if (query.mode && item.mode && item.mode !== query.mode && item.mode !== 'BOTH') return false
    if (query.containerType && Array.isArray(item.details) && !item.details.some((detail: any) => detail.containerType === query.containerType)) return false
    if (!keyword) return true
    return JSON.stringify(item).toLowerCase().includes(keyword)
  })
}

export const isActiveOn = (item: { status?: RecordStatus; validityFrom?: string; validityTo?: string }, date: string) => {
  const activeDate = asDateOnly(date)
  return item.status === 'ACTIVE' && (!item.validityFrom || item.validityFrom <= activeDate) && (!item.validityTo || item.validityTo >= activeDate)
}

export const touchCreate = <T extends Record<string, any>>(prefix: string, body: T) => {
  const at = nowIso()
  return {
    ...body,
    id: body.id || makeId(prefix),
    code: body.code ? normalizeCode(body.code) : body.code,
    status: body.status || 'ACTIVE',
    createdAt: at,
    updatedAt: at,
  }
}

export const touchUpdate = <T extends Record<string, any>>(existing: T, body: Partial<T>) => ({
  ...existing,
  ...body,
  code: body.code ? normalizeCode(body.code) : existing.code,
  id: existing.id,
  createdAt: existing.createdAt,
  updatedAt: nowIso(),
})

export const ensureUniqueCode = <T extends { id: string; code?: string }>(items: T[], body: Partial<T>, currentId?: string) => {
  if (!body.code) return
  const code = normalizeCode(body.code)
  const duplicate = items.find((item) => item.id !== currentId && normalizeCode(item.code) === code)
  if (duplicate) {
    throw createError({ statusCode: 409, statusMessage: `Code ${code} already exists` })
  }
}

const scopeRank: Record<ChargeScope, number> = {
  GLOBAL: 1,
  COUNTRY: 2,
  CITY: 3,
  PORT: 4,
  TERMINAL: 5,
  WAREHOUSE: 5,
  ROUTE: 6,
}

const matchesCharge = (rule: ChargeRule, input: QuoteCalculateInput, date: string) => {
  if (!isActiveOn(rule, date)) return false
  if (rule.mode !== input.mode && rule.mode !== 'BOTH') return false
  if (rule.originCountryId && rule.originCountryId !== input.originCountryId) return false
  if (rule.destinationCountryId && rule.destinationCountryId !== input.destinationCountryId) return false
  if (rule.cityId && rule.cityId !== input.pickupLocationId) return false
  if (rule.portId && rule.portId !== input.polId && rule.portId !== input.podId) return false
  if (rule.terminalId && rule.terminalId !== input.terminalId) return false
  if (rule.warehouseId && rule.warehouseId !== input.warehouseId) return false
  if (rule.shippingLineId && rule.shippingLineId !== input.shippingLineId) return false
  return true
}

const amountForRule = (rule: ChargeRule, containerType?: ContainerType) => {
  if (rule.unit === 'AS_ACTUAL') return null
  const matrix = containerType ? rule.matrix.find((row) => row.enabled && row.containerType === containerType) : undefined
  return matrix?.amount ?? rule.amount ?? 0
}

const selectBestChargeRules = (rules: ChargeRule[], input: QuoteCalculateInput, date: string) => {
  const byCode = new Map<string, ChargeRule>()
  for (const rule of rules.filter((item) => matchesCharge(item, input, date))) {
    const current = byCode.get(rule.code)
    if (!current || scopeRank[rule.applyScope] > scopeRank[current.applyScope] || rule.updatedAt > current.updatedAt) {
      byCode.set(rule.code, rule)
    }
  }
  return Array.from(byCode.values())
}

export const calculateQuote = (db: LogisticsPricingDb, input: QuoteCalculateInput) => {
  const mode = input.mode || 'FCL'
  const effectiveDate = asDateOnly(input.effectiveDate)
  const quantity = Number(input.quantity || 1)

  if (mode === 'FCL') {
    const rate = db.fclRates.find((item) =>
      isActiveOn(item, effectiveDate)
      && (!input.originCountryId || item.originCountryId === input.originCountryId)
      && (!input.destinationCountryId || item.destinationCountryId === input.destinationCountryId)
      && (!input.polId || item.polId === input.polId)
      && (!input.podId || item.podId === input.podId)
      && (!input.shippingLineId || item.shippingLineId === input.shippingLineId),
    )

    if (!rate) {
      return { ok: false, message: 'No active rate found for selected route', input, createRateUrl: '/admin/fcl-rates' }
    }

    const containerType = input.containerType || '40GP'
    const detail = rate.details.find((item) => item.containerType === containerType) || rate.details[0]
    const selectedRules = selectBestChargeRules(db.chargeRules, { ...input, mode }, effectiveDate)
    const chargeItems = selectedRules.map((rule) => {
      const amount = amountForRule(rule, containerType)
      const total = amount === null ? null : amount * quantity
      return {
        id: rule.id,
        code: rule.code,
        name: rule.name,
        group: rule.chargeGroup,
        scope: rule.applyScope,
        unit: rule.unit,
        currencyCode: rule.currencyCode,
        amount,
        quantity,
        total,
        confirmed: rule.isConfirmed,
        conditional: rule.isConditional,
      }
    })

    const seaFreightTotal = detail.oceanFreight * quantity
    const confirmedCharges = chargeItems.filter((item) => item.confirmed && typeof item.total === 'number')
    const conditionalCharges = chargeItems.filter((item) => item.conditional)
    const groups = ['PICKUP_CHARGES', 'CUSTOMS_CLEARANCE', 'PORT_CHARGES', 'ORIGIN_CHARGES', 'DESTINATION_CHARGES'].map((group) => {
      const items = chargeItems.filter((item) => item.group === group)
      return {
        group,
        items,
        subtotalConfirmed: items.reduce((sum, item) => sum + (item.confirmed && typeof item.total === 'number' ? item.total : 0), 0),
        subtotalConditional: items.reduce((sum, item) => sum + (item.conditional && typeof item.total === 'number' ? item.total : 0), 0),
      }
    }).filter((group) => group.items.length)

    return {
      ok: true,
      mode,
      route: {
        originCountry: db.countries.find((item) => item.id === rate.originCountryId),
        destinationCountry: db.countries.find((item) => item.id === rate.destinationCountryId),
        pol: db.ports.find((item) => item.id === rate.polId),
        pod: db.ports.find((item) => item.id === rate.podId),
        shippingLine: db.shippingLines.find((item) => item.id === rate.shippingLineId),
      },
      rate,
      selectedDetail: detail,
      seaFreight: { amount: detail.oceanFreight, quantity, total: seaFreightTotal, currencyCode: detail.currencyCode },
      groups,
      confirmedCharges,
      conditionalCharges,
      totalConfirmed: seaFreightTotal + confirmedCharges.reduce((sum, item) => sum + Number(item.total || 0), 0),
      totalConditional: conditionalCharges.reduce((sum, item) => sum + (typeof item.total === 'number' ? item.total : 0), 0),
      currencyCode: rate.currencyCode,
    }
  }

  const lclRate = db.lclRates.find((item) =>
    isActiveOn(item, effectiveDate)
    && (!input.originCountryId || item.originCountryId === input.originCountryId)
    && (!input.destinationCountryId || item.destinationCountryId === input.destinationCountryId)
    && (!input.pickupLocationId || item.pickupLocationId === input.pickupLocationId)
    && (!input.warehouseId || item.cfsWarehouseId === input.warehouseId)
    && (!input.shippingLineId || item.shippingLineId === input.shippingLineId),
  )

  if (!lclRate) {
    return { ok: false, message: 'No active rate found for selected route', input, createRateUrl: '/admin/fcl-rates' }
  }

  return { ok: true, mode, rate: lclRate, currencyCode: lclRate.currencyCode, groups: [], totalConfirmed: 0, totalConditional: 0 }
}
