const asData = (row) => {
  if (row?.data && typeof row.data === 'object' && !Array.isArray(row.data)) return row.data
  return row && typeof row === 'object' ? row : {}
}

const hasValue = (value) => value !== '' && value !== undefined && value !== null
const sameCode = (left, right) => Boolean(left && right)
  && String(left).trim().toUpperCase() === String(right).trim().toUpperCase()

export const createKeyedTaskQueue = () => {
  const tails = new Map()
  return (key, task, canRun = () => true) => {
    const previous = tails.get(key) || Promise.resolve()
    const current = previous.catch(() => undefined).then(() => canRun() ? task() : undefined)
    tails.set(key, current)
    return current.finally(() => {
      if (tails.get(key) === current) tails.delete(key)
    })
  }
}

export const campaignTimerKey = (country, recordId) => JSON.stringify([
  String(country || '').trim().toUpperCase(),
  String(recordId || ''),
])

export const createCampaignTimerRegistry = (clearTimer = clearTimeout) => {
  const timers = new Map()
  return {
    set(key, timer) {
      if (timers.has(key)) clearTimer(timers.get(key))
      timers.set(key, timer)
    },
    clear(key) {
      if (timers.has(key)) clearTimer(timers.get(key))
      timers.delete(key)
    },
    delete: (key) => timers.delete(key),
    has: (key) => timers.has(key),
  }
}

export const createKeyedClaimSet = () => {
  const claims = new Set()
  return {
    claim(key) {
      if (claims.has(key)) return false
      claims.add(key)
      return true
    },
    release: (key) => claims.delete(key),
    has: (key) => claims.has(key),
  }
}

export const createKeyedCancellationRegistry = () => {
  const currentTokens = new Map()
  return {
    start(key) {
      const token = Symbol(key)
      currentTokens.set(key, token)
      return token
    },
    invalidate: (key) => currentTokens.delete(key),
    isCurrent: (key, token) => currentTokens.has(key) && currentTokens.get(key) === token,
  }
}

export const campaignTimerRegistry = createCampaignTimerRegistry()
export const campaignStartClaims = createKeyedClaimSet()
export const campaignCancellationRegistry = createKeyedCancellationRegistry()

export const localDate = (date = new Date()) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0'),
].join('-')

const CLIENT_COUNTRY_CODES = {
  VIETNAM: 'VN', 'VIET NAM': 'VN', CHINA: 'CN', 'UNITED STATES': 'US', USA: 'US',
  JAPAN: 'JP', 'SOUTH KOREA': 'KR', KOREA: 'KR', SINGAPORE: 'SG', THAILAND: 'TH',
  MALAYSIA: 'MY', INDONESIA: 'ID', PHILIPPINES: 'PH', INDIA: 'IN', 'HONG KONG': 'HK',
  TAIWAN: 'TW', CAMBODIA: 'KH', LAOS: 'LA', MYANMAR: 'MM', AUSTRALIA: 'AU',
  GERMANY: 'DE', FRANCE: 'FR', 'UNITED KINGDOM': 'GB', NETHERLANDS: 'NL', ITALY: 'IT',
  SPAIN: 'ES', CANADA: 'CA', 'UNITED ARAB EMIRATES': 'AE', BANGLADESH: 'BD',
  PAKISTAN: 'PK', TURKEY: 'TR', BELGIUM: 'BE',
}

export const generateClientId = (country, rows = [], date = new Date()) => {
  const countryCode = CLIENT_COUNTRY_CODES[String(country || '').trim().toUpperCase()] || 'XX'
  const stamp = [date.getDate(), date.getMonth() + 1, String(date.getFullYear()).slice(-2)]
    .map((part) => String(part).padStart(2, '0'))
    .join('')
  const prefix = `${countryCode}${stamp}`
  let sequence = 1
  for (const record of rows) {
    const id = String(asData(record).id || record?.id || '')
    if (!id.startsWith(prefix)) continue
    const current = Number.parseInt(id.slice(prefix.length), 10)
    if (current >= sequence) sequence = current + 1
  }
  return `${prefix}${String(sequence).padStart(2, '0')}`
}

export const nextCampaignSequence = (settings) => Math.max(
  0,
  Math.floor(Number(settings?.campaignSeq) || 0),
) + 1

export const campaignFilterValue = (campaign, key) => {
  if (key !== 'batchInterval' && key !== 'interval') return String(campaign?.[key] ?? '')
  const interval = campaign?.batchInterval
  if (!interval) return ''
  return `${interval} ${campaign?.batchUnit === 'hour' ? 'hour' : 'min'}`
}

export const generateContentId = (row) => {
  const type = String(row?.type || '').slice(0, 1)
  const originTerm = String(row?.orgTerm || '').slice(0, 2)
  const destinationTerm = String(row?.destTerm || '').slice(0, 2)
  return `${type}${originTerm}${destinationTerm}${String(row?.origin || '').trim()}${String(row?.destination || '').trim()}`.toUpperCase()
}

export const generateSignId = (iso2, countryName = '') => {
  const suffix = String(iso2 || '').trim()
    || String(countryName).replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()
  return `Sign${suffix}`
}

export const campaignCode = (date, sequence) => {
  const [year = '', month = '', day = ''] = String(date || '').split('-')
  return `CP_${day.padStart(2, '0')}${month.padStart(2, '0')}${year.slice(-2)}_${sequence}`
}

export const applyTermChange = (row, field, value) => {
  const next = { ...row }
  if (field === 'serviceType') {
    next.serviceType = value
    if (value === 'Combine') {
      if (!['EXW', 'FCA', 'FCF'].includes(next.orgTerm)) next.orgTerm = 'EXW'
      if (!['DO', 'DAP', 'DDU', 'DDP'].includes(next.destTerm)) next.destTerm = 'DO'
    } else if (next.orgTerm && next.orgTerm !== '-') {
      next.destTerm = '-'
    } else if (next.destTerm && next.destTerm !== '-') {
      next.orgTerm = '-'
    } else {
      next.orgTerm = 'EXW'
      next.destTerm = '-'
    }
    return next
  }
  if (field === 'orgTerm') {
    if (next.serviceType === 'Combine') next.orgTerm = value
    else if (value === '-') {
      if (!next.destTerm || next.destTerm === '-') return next
      next.orgTerm = '-'
    } else {
      next.orgTerm = value
      next.destTerm = '-'
    }
    return next
  }
  if (field === 'destTerm') {
    if (next.serviceType === 'Combine') next.destTerm = value
    else if (value === '-') {
      if (!next.orgTerm || next.orgTerm === '-') return next
      next.destTerm = '-'
    } else {
      next.destTerm = value
      next.orgTerm = '-'
    }
    return next
  }
  next[field] = value
  return next
}

export const buildRecipients = (campaign, basicRows, traderRows) => {
  const basics = (basicRows || []).map(asData)
  const traders = (traderRows || []).map(asData)
  const codes = campaign?.clientCode === 'All'
    ? basics.map((row) => row.clientCode)
    : [campaign?.clientCode]
  const fallbackNames = new Map(basics.map((row) => [String(row.clientCode || ''), row.clientName || '']))
  const seen = new Set()
  const recipients = []
  for (const rawCode of codes) {
    const clientCode = String(rawCode || '').trim()
    if (!clientCode || seen.has(clientCode)) continue
    seen.add(clientCode)
    const trader = traders.find((row) => sameCode(row.namecode || row.clientCode || row.code, clientCode))
    recipients.push({
      clientCode,
      clientName: String(trader?.companyName || trader?.company || trader?.clientName || fallbackNames.get(clientCode) || ''),
      email: String(trader?.email || ''),
    })
  }
  return recipients
}

const sectionsFor = (content) => {
  const sections = []
  if (content?.orgTerm && content.orgTerm !== '-') sections.push('At Origin')
  sections.push('Main Freight')
  if (content?.destTerm && content.destTerm !== '-') sections.push('At Destination')
  return sections
}

const rowsForTab = (recordsByPage, tab) => {
  const records = recordsByPage?.[`sm_${tab.id}`] || recordsByPage?.[tab.id] || []
  return records.map(asData)
}

const isTrucking = (tab) => /trucking/i.test(tab.id) || tab.label === 'Trucking Fee'
const valueLabel = (label) => String(label || '').replace(/^\s*(Cost|Sell|Margin)\s*\/\s*/i, '').replace(/\s+/g, ' ').trim()
const validNumber = (value) => {
  if (!hasValue(value)) return false
  const number = Number.parseFloat(String(value).replace(/[, ]/g, ''))
  return Number.isFinite(number) && number !== 0
}

const rowMatches = (section, tab, row, content) => {
  if (section === 'At Origin') return sameCode(row.scope, content.origin)
  if (section === 'At Destination') return sameCode(row.scope, content.destination)
  if (/_origin$/.test(tab.id)) return sameCode(row.portcode, content.origin)
  if (/_dest$/.test(tab.id)) return sameCode(row.portcode, content.destination)
  return sameCode(row.pol, content.origin) && sameCode(row.pod, content.destination)
}

const rateMeta = (row) => {
  const days = [
    ['sch_mon', 'Mon'], ['sch_tue', 'Tue'], ['sch_wed', 'Wed'], ['sch_thu', 'Thu'],
    ['sch_fri', 'Fri'], ['sch_sat', 'Sat'], ['sch_sun', 'Sun'],
  ].filter(([key]) => row[key]).map(([, label]) => label)
  const parts = []
  if (days.length) parts.push(`Sailing: ${days.join(', ')}`)
  if (hasValue(row.rtype)) parts.push(`Type: ${row.rtype}`)
  if (hasValue(row.ttdays)) parts.push(`TT: ${row.ttdays} days`)
  if (hasValue(row.dem)) parts.push(`DEM: ${row.dem}`)
  if (hasValue(row.det)) parts.push(`DET: ${row.det}`)
  if (hasValue(row.validity)) parts.push(`Validity: ${row.validity}`)
  return parts.join(' · ')
}

const valuesFor = (tab, row) => {
  const currency = row.currency || ''
  return (tab.columns || [])
    .filter((column) => /_sell$/.test(column.key))
    .filter((column) => validNumber(row[column.key]))
    .map((column) => `${currency ? `${currency} ` : ''}${String(row[column.key]).trim()} / ${valueLabel(column.label)}`)
    .join(', ')
}

const withNotes = (text, row) => hasValue(row.notes) ? `${text} (${String(row.notes).trim()})` : text

export const buildContent = (content, feeTabs, recordsByPage) => {
  const type = content?.type || 'FCL'
  const sections = []
  const truckOrigin = []
  const truckDest = []

  for (const section of sectionsFor(content)) {
    const tabs = feeTabs?.[section]?.[type] || []
    const items = []
    for (const tab of tabs) {
      const rows = rowsForTab(recordsByPage, tab)
      if (isTrucking(tab)) {
        const matches = rows.filter((row) => rowMatches(section, tab, row, content))
        if (matches.length) {
          if (section === 'At Destination') truckDest.push(...matches)
          else truckOrigin.push(...matches)
          items.push({ label: tab.label, values: 'As per attachment' })
        }
        continue
      }

      const isRate = section === 'Main Freight' && /_rate$/.test(tab.id)
      const isMainCharge = section === 'Main Freight' && (/_origin$/.test(tab.id) || /_dest$/.test(tab.id))
      if (isMainCharge) {
        const bullets = rows
          .filter((row) => rowMatches(section, tab, row, content))
          .map((row) => {
            const values = valuesFor(tab, row)
            return values ? withNotes(`${row.chargename || '(charge)'}: ${values}`, row) : ''
          })
          .filter(Boolean)
        if (bullets.length) items.push({
          label: /_origin$/.test(tab.id) ? 'Origin Charges' : 'Destination Charges',
          bullets,
        })
        continue
      }

      for (const row of rows) {
        if (!rowMatches(section, tab, row, content)) continue
        const values = valuesFor(tab, row)
        if (!values) continue
        items.push({
          label: tab.label === 'Inspection Fee' ? 'Inspection Fee (if any)' : tab.label,
          values: withNotes(values, row),
          meta: isRate ? rateMeta(row) : '',
        })
      }
    }
    if (items.length) sections.push({ section, items })
  }

  const lines = []
  const singleSection = sections.length === 1
  sections.forEach(({ section, items }, sectionIndex) => {
    const tag = section === 'At Origin' ? 'AT ORIGIN' : section === 'Main Freight' ? 'MAIN FREIGHT' : 'AT DESTINATION'
    lines.push(`${singleSection ? '' : `${String.fromCharCode(65 + sectionIndex)}. `}${tag}`, '')
    const numbered = items.length > 1
    items.forEach((item, itemIndex) => {
      const prefix = numbered ? `${itemIndex + 1}. ` : ''
      if (item.bullets) {
        lines.push(`${prefix}${item.label}`)
        item.bullets.forEach((bullet) => lines.push(`- ${bullet}`))
      } else {
        lines.push(`${prefix}${item.label}: ${item.values}`)
        if (item.meta) lines.push(`   ${item.meta}`)
      }
    })
    if (sectionIndex < sections.length - 1) lines.push('')
  })

  return { text: lines.join('\n'), truckOrigin, truckDest }
}

const ORIGIN_TRUCK_LEAD = [
  ['', 'Order'], ['district', 'From Ward/Commune'], ['postalcode', 'PostalCode'],
  ['scope', 'ToPortCode'], ['portname', 'PortName'], ['currency', 'Currency'],
]
const DESTINATION_TRUCK_LEAD = [
  ['', 'Order'], ['scope', 'FromPortCode'], ['portname', 'PortName'],
  ['district', 'To Ward/Commune'], ['postalcode', 'PostalCode'], ['currency', 'Currency'],
]
const FCL_TRUCK_VALUES = [
  ['r20gp_sell', '20GP'], ['r40gp_sell', '40GP'], ['r40hc_sell', '40HC'], ['r45hc_sell', '45HC'],
]
const LCL_AIR_TRUCK_VALUES = [
  ['rle1t_sell', '≤1T (PerTruck)'], ['r1_3t_sell', '1–3T (PerTruck)'],
  ['r3_5t_sell', '3–5T (PerTruck)'], ['r5_10t_sell', '5–10T (PerTruck)'],
  ['r10_15t_sell', '10–15T (PerTruck)'], ['r15_25t_sell', '15–25T (PerTruck)'],
]

export const truckColumns = (mode, type) => [
  ...(mode === 'dest' ? DESTINATION_TRUCK_LEAD : ORIGIN_TRUCK_LEAD),
  ...(type === 'FCL' ? FCL_TRUCK_VALUES : LCL_AIR_TRUCK_VALUES),
  ['validity', 'Validity'],
]

export const truckAoa = (columns, rows) => [
  columns.map((column) => column[1]),
  ...(rows || []).map((row, index) => columns.map((column) => column[0] === ''
    ? index + 1
    : (row?.[column[0]] ?? ''))),
]

export const composeEmail = (campaign, contents, signatures, feeTabs, recordsByPage) => {
  const content = (contents || []).map(asData).find((row) => row.contentId && row.contentId === campaign?.contentId)
  const sign = (signatures || []).map(asData).find((row) => row.signId && row.signId === campaign?.signId)
  const built = content ? buildContent(content, feeTabs, recordsByPage) : null
  const subject = String(content?.detail?.subject || '')
  const contentBody = content
    ? String(content.detail?.override ? content.detail?.body || '' : built?.text || '')
    : ''
  const signature = String(sign?.signature || '')
  const body = `${contentBody}${signature ? `\n\n--\n${signature}` : ''}`
  const attachment = built && (built.truckOrigin.length || built.truckDest.length)
    ? {
        filename: `Trucking_${campaign?.contentId || 'content'}.xlsx`,
        type: content?.type || campaign?.type || 'FCL',
        truckOrigin: built.truckOrigin,
        truckDest: built.truckDest,
      }
    : null
  return { subject, contentBody, signature, body, attachment, content, sign }
}

export const missingSendFields = (campaign, composed, recipients) => {
  const missing = []
  if (!campaign?.contentId) missing.push('ContentID')
  else if (!String(composed?.contentBody || '').replace(/\s/g, '')) missing.push('Content')
  if (!campaign?.signId) missing.push('SignID')
  else if (!String(composed?.signature || '').replace(/\s/g, '')) missing.push('Signature')
  if (!String(composed?.subject || '').replace(/\s/g, '')) missing.push('Subject')
  if (!recipients?.length) missing.push('Recipients')
  else if (!recipients.some((recipient) => recipient.email)) missing.push('Recipient email')
  return missing
}

export const sendSummary = (campaign) => {
  const mode = campaign?.sendMode || 'now'
  const config = campaign?.sendConfig || {}
  if (mode === 'now') return 'Send now'
  if (mode === 'date') return `On ${config.datetime || '—'}`
  if (mode === 'weekly') return `Weekly · ${config.weekday || '—'} ${config.time || ''}`
  if (mode === 'monthly') return `Monthly · day ${config.day || '—'} ${config.time || ''}`
  return mode
}

export const splitBatches = (items, requestedSize) => {
  const size = Math.max(1, Number.parseInt(requestedSize, 10) || items.length || 1)
  const batches = []
  for (let index = 0; index < items.length; index += size) batches.push(items.slice(index, index + size))
  return batches
}

export const batchIntervalMs = (campaign) => {
  const interval = Number.parseInt(campaign?.batchInterval, 10) || 0
  return Math.max(1000, campaign?.batchUnit === 'hour' ? interval * 3_600_000 : interval * 60_000)
}

export const applyBatchResult = (campaign, deliveredCount, accepted) => {
  if (!accepted) return campaign
  const totalCount = Math.max(0, Number(campaign?.totalCount) || 0)
  const sentCount = Math.min(totalCount, Math.max(0, Number(campaign?.sentCount) || 0) + Math.max(0, Number(deliveredCount) || 0))
  return { ...campaign, sentCount, status: sentCount >= totalCount ? 'Done' : 'Running' }
}
