import { readBody, getQuery, getMethod, createError, setHeader } from 'h3'
import type { LogisticsPricingDb, RecordStatus } from '../../types/logisticsPricing'
import {
  calculateQuote,
  ensureUniqueCode,
  listByQuery,
  makeId,
  readPricingDb,
  resetPricingDb,
  touchCreate,
  touchUpdate,
  writePricingDb,
} from '../utils/logisticsPricingStore'

type CollectionName = keyof LogisticsPricingDb

const collectionMap: Record<string, CollectionName> = {
  countries: 'countries',
  locations: 'locations',
  ports: 'ports',
  terminals: 'terminals',
  warehouses: 'warehouses',
  'shipping-lines': 'shippingLines',
  'charge-rules': 'chargeRules',
}

const prefixMap: Record<CollectionName, string> = {
  countries: 'country',
  locations: 'loc',
  ports: 'port',
  terminals: 'terminal',
  warehouses: 'wh',
  shippingLines: 'line',
  fclRates: 'fcl',
  lclRates: 'lcl',
  chargeRules: 'charge',
}

const getPathParts = (event: any) => {
  const raw = event.context.params?.pricing
  const text = Array.isArray(raw) ? raw.join('/') : String(raw || '')
  return text.split('/').filter(Boolean)
}

const findIndexOrThrow = <T extends { id: string }>(items: T[], id: string) => {
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) throw createError({ statusCode: 404, statusMessage: 'Record not found' })
  return index
}

const sendCsv = (event: any, filename: string, rows: any[]) => {
  const columns = Array.from(rows.reduce((set, row) => {
    Object.keys(row || {}).forEach((key) => {
      if (typeof row[key] !== 'object') set.add(key)
    })
    return set
  }, new Set<string>()))
  const escape = (value: any) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const csv = [columns.join(','), ...rows.map((row) => columns.map((column) => escape(row[column])).join(','))].join('\n')
  setHeader(event, 'content-type', 'text/csv; charset=utf-8')
  setHeader(event, 'content-disposition', `attachment; filename="${filename}.csv"`)
  return csv
}

const parseRatesCollection = (type?: string): CollectionName => {
  if (type === 'lcl') return 'lclRates'
  return 'fclRates'
}

const createRate = (type: 'fcl' | 'lcl', body: any) => {
  const id = body.id || makeId(type)
  const at = new Date().toISOString()
  const detailPrefix = type === 'fcl' ? 'fcld' : 'lcld'
  return {
    ...body,
    id,
    status: body.status || 'ACTIVE',
    details: (body.details || []).map((detail: any) => ({
      ...detail,
      id: detail.id || makeId(detailPrefix),
      [`${type}RateId`]: id,
      createdAt: detail.createdAt || at,
      updatedAt: at,
    })),
    createdAt: body.createdAt || at,
    updatedAt: at,
  }
}

const duplicateRate = (type: 'fcl' | 'lcl', source: any, body: any) => {
  const id = makeId(type)
  const at = new Date().toISOString()
  const foreignKey = type === 'fcl' ? 'fclRateId' : 'lclRateId'
  const detailPrefix = type === 'fcl' ? 'fcld' : 'lcld'
  return {
    ...source,
    ...body,
    id,
    status: body.status || 'DRAFT',
    details: (source.details || []).map((detail: any) => ({
      ...detail,
      id: makeId(detailPrefix),
      [foreignKey]: id,
      createdAt: at,
      updatedAt: at,
    })),
    createdAt: at,
    updatedAt: at,
  }
}

export default defineEventHandler(async (event) => {
  const parts = getPathParts(event)
  const method = getMethod(event)

  if (!parts.length) return

  const db = await readPricingDb()
  const query = getQuery(event)

  if (parts[0] === 'pricing-seed' && method === 'POST') {
    return { data: await resetPricingDb() }
  }

  if (parts[0] === 'quote' && (parts[1] === 'calculate' || parts[1] === 'preview') && method === 'POST') {
    const body = await readBody(event)
    return calculateQuote(db, body)
  }

  if (parts[0] === 'export' && method === 'GET') {
    const key = parts[1]
    const collection = key === 'fcl-rates' ? 'fclRates'
      : key === 'lcl-rates' ? 'lclRates'
        : key === 'charge-rules' ? 'chargeRules'
          : collectionMap[key]
    if (!collection) throw createError({ statusCode: 404, statusMessage: 'Export target not found' })
    return sendCsv(event, key, listByQuery(db[collection] as any[], query))
  }

  if (parts[0] === 'import' && method === 'POST') {
    const key = parts[1]
    const collection = key === 'fcl-rates' ? 'fclRates'
      : key === 'lcl-rates' ? 'lclRates'
        : key === 'charge-rules' ? 'chargeRules'
          : collectionMap[key]
    if (!collection) throw createError({ statusCode: 404, statusMessage: 'Import target not found' })
    const body = await readBody(event)
    const rows = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : []
    ;(db[collection] as any[]).push(...rows.map((row) => touchCreate(prefixMap[collection], row)))
    await writePricingDb(db)
    return { data: db[collection], imported: rows.length }
  }

  if (parts[0] === 'rates') {
    const type = parts[1] === 'lcl' ? 'lcl' : 'fcl'
    const collection = parts[1] ? parseRatesCollection(parts[1]) : undefined

    if (method === 'GET' && !parts[1]) {
      return { data: [...db.fclRates, ...db.lclRates] }
    }

    if (!collection) throw createError({ statusCode: 404, statusMessage: 'Rate endpoint not found' })
    const items = db[collection] as any[]

    if (method === 'GET' && parts.length === 2) return { data: listByQuery(items, query) }

    if (method === 'POST' && parts.length === 2) {
      const body = await readBody(event)
      const item = createRate(type, body)
      items.push(item)
      await writePricingDb(db)
      return { data: item }
    }

    const id = parts[2]
    const index = findIndexOrThrow(items, id)

    if (method === 'GET' && parts.length === 3) return { data: items[index] }

    if ((method === 'PUT' || method === 'PATCH') && parts.length === 3) {
      const body = await readBody(event)
      items[index] = createRate(type, { ...items[index], ...body, id: items[index].id, createdAt: items[index].createdAt })
      await writePricingDb(db)
      return { data: items[index] }
    }

    if (method === 'POST' && parts[3] === 'duplicate') {
      const body = await readBody(event)
      const item = duplicateRate(type, items[index], body || {})
      items.push(item)
      await writePricingDb(db)
      return { data: item }
    }

    if (method === 'PATCH' && parts[3] === 'status') {
      const body = await readBody(event)
      items[index] = touchUpdate(items[index], { status: String(body.status || 'INACTIVE').toUpperCase() as RecordStatus })
      await writePricingDb(db)
      return { data: items[index] }
    }

    if (method === 'DELETE' && parts.length === 3) {
      items[index] = touchUpdate(items[index], { status: 'INACTIVE' })
      await writePricingDb(db)
      return { data: items[index] }
    }
  }

  const collection = collectionMap[parts[0]]

  if (collection) {
    const items = db[collection] as any[]

    if (method === 'GET' && parts.length === 1) return { data: listByQuery(items, query) }

    if (method === 'POST' && parts.length === 1) {
      const body = await readBody(event)
      ensureUniqueCode(items, body)
      const item = collection === 'chargeRules'
        ? { ...touchCreate(prefixMap[collection], body), matrix: body.matrix || [] }
        : touchCreate(prefixMap[collection], body)
      items.push(item)
      await writePricingDb(db)
      return { data: item }
    }

    const id = parts[1]

    if (parts[0] === 'countries' && parts[2] === 'locations' && method === 'GET') {
      return { data: db.locations.filter((item) => item.countryId === id) }
    }

    const index = findIndexOrThrow(items, id)

    if (method === 'GET' && parts.length === 2) return { data: items[index] }

    if ((method === 'PUT' || method === 'PATCH') && parts.length === 2) {
      const body = await readBody(event)
      ensureUniqueCode(items, body, id)
      items[index] = collection === 'chargeRules'
        ? { ...touchUpdate(items[index], body), matrix: body.matrix || items[index].matrix || [] }
        : touchUpdate(items[index], body)
      await writePricingDb(db)
      return { data: items[index] }
    }

    if (method === 'POST' && parts[2] === 'duplicate' && collection === 'chargeRules') {
      const body = await readBody(event)
      const item = touchCreate(prefixMap[collection], { ...items[index], ...body, id: undefined, code: body.code || `${items[index].code}_COPY`, status: 'DRAFT' })
      item.matrix = (items[index].matrix || []).map((row: any) => ({ ...row, id: makeId('matrix'), chargeRuleId: item.id }))
      items.push(item)
      await writePricingDb(db)
      return { data: item }
    }

    if (method === 'DELETE' && parts.length === 2) {
      items[index] = touchUpdate(items[index], { status: 'INACTIVE' })
      await writePricingDb(db)
      return { data: items[index] }
    }
  }

  throw createError({ statusCode: 404, statusMessage: 'API endpoint not found' })
})
