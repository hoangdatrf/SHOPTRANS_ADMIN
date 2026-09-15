type LiveRateQuery = {
  carrier: string
  pol: string
  pod: string
  originCountry?: string
  destinationCountry?: string
  containerType?: string
  volume?: string
  readyDate?: string
  rateType?: string
}

type MaerskConfig = {
  apiBaseUrl: string
  schedulesBaseUrl: string
  tokenUrl: string
  consumerKey: string
  clientId: string
  clientSecret: string
  fclRateUrl: string
}

type MaerskTokenCache = {
  accessToken: string
  expiresAt: number
}

const maerskTokenCache: MaerskTokenCache = {
  accessToken: '',
  expiresAt: 0
}

const toStringValue = (value: unknown, fallback = '') => {
  if (value === undefined || value === null) return fallback
  const text = String(value).trim()
  return text || fallback
}

const toUpperValue = (value: unknown, fallback = '') => toStringValue(value, fallback).toUpperCase()

const pickFirst = (...values: unknown[]) => {
  for (const value of values) {
    const text = toStringValue(value)
    if (text) return text
  }
  return ''
}

const getMaerskConfig = (): MaerskConfig => {
  const env = (process.env.MAERSK_ENV || '').toLowerCase()
  const defaultBaseUrl = env === 'prod' || env === 'production'
    ? 'https://api.maersk.com'
    : 'https://api-stage.maersk.com'
  const apiBaseUrl = (process.env.MAERSK_API_BASE_URL || defaultBaseUrl).replace(/\/+$/, '')
  const consumerKey = process.env.MAERSK_CONSUMER_KEY || process.env.MAERSK_CLIENT_ID || ''

  return {
    apiBaseUrl,
    schedulesBaseUrl: (process.env.MAERSK_SCHEDULES_BASE_URL || `${apiBaseUrl}/ocean/commercial-schedules/dcsa`).replace(/\/+$/, ''),
    tokenUrl: process.env.MAERSK_OAUTH_TOKEN_URL || `${apiBaseUrl}/customer-identity/oauth/v2/access_token`,
    consumerKey,
    clientId: process.env.MAERSK_CLIENT_ID || consumerKey,
    clientSecret: process.env.MAERSK_CLIENT_SECRET || '',
    fclRateUrl: process.env.MAERSK_FCL_RATE_URL || process.env.MAERSK_FCL_PRICING_URL || ''
  }
}

const requireMaerskConsumerKey = (config: MaerskConfig) => {
  if (!config.consumerKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Maersk API is not configured',
      data: {
        code: 'MAERSK_CONSUMER_KEY_MISSING',
        message: 'Set MAERSK_CONSUMER_KEY or MAERSK_CLIENT_ID from an approved Maersk Developer app.'
      }
    })
  }
}

const fetchMaerskToken = async (config: MaerskConfig) => {
  if (!config.clientSecret) return ''
  if (maerskTokenCache.accessToken && maerskTokenCache.expiresAt > Date.now() + 60_000) {
    return maerskTokenCache.accessToken
  }

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'client_credentials'
  })

  const res = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'consumer-key': config.consumerKey
    },
    body
  })

  const json = await res.json().catch(() => null) as any
  if (!res.ok || !json?.access_token) {
    throw createError({
      statusCode: res.status || 502,
      statusMessage: 'Could not authenticate with Maersk',
      data: {
        code: 'MAERSK_AUTH_FAILED',
        message: json?.error_description || json?.error || 'Maersk token request failed.',
        providerStatus: res.status,
        providerResponse: json
      }
    })
  }

  maerskTokenCache.accessToken = json.access_token
  maerskTokenCache.expiresAt = Date.now() + Math.max(60, Number(json.expires_in || 3600) - 120) * 1000
  return maerskTokenCache.accessToken
}

const maerskHeaders = (config: MaerskConfig, token = '', jsonBody = false) => {
  const headers: Record<string, string> = {
    'consumer-key': config.consumerKey
  }
  if (token) headers.authorization = `Bearer ${token}`
  if (jsonBody) headers['content-type'] = 'application/json'
  return headers
}

const fetchMaerskJson = async (url: string, config: MaerskConfig, init: RequestInit = {}) => {
  const token = await fetchMaerskToken(config)
  const res = await fetch(url, {
    ...init,
    headers: {
      ...maerskHeaders(config, token, init.method === 'POST' || init.method === 'PUT' || init.method === 'PATCH'),
      ...(init.headers as Record<string, string> | undefined)
    }
  })
  const text = await res.text()
  const json = text ? tryParseJson(text) : null

  if (!res.ok) {
    throw createError({
      statusCode: res.status || 502,
      statusMessage: 'Maersk API request failed',
      data: {
        code: 'MAERSK_API_ERROR',
        message: getProviderErrorMessage(json) || text || 'Maersk API returned an error.',
        providerStatus: res.status,
        providerResponse: json || text
      }
    })
  }

  return json
}

const tryParseJson = (text: string) => {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

const getProviderErrorMessage = (body: any) => {
  if (!body) return ''
  if (typeof body === 'string') return body
  return pickFirst(
    body.message,
    body.errorMessage,
    body.error_description,
    body.statusMessage,
    body.errors?.[0]?.errorCodeMessage,
    body.detailedErrors?.[0]?.message
  )
}

const formatShortDate = (value: unknown) => {
  const date = parseDate(value)
  if (!date) return 'Date unavailable'
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/^0/, '')
}

const formatDateTime = (value: unknown) => {
  const date = parseDate(value)
  if (!date) return 'Date unavailable'
  const day = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/^0/, '')
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${day}, ${time}`
}

const parseDate = (value: unknown) => {
  const text = toStringValue(value)
  if (!text) return null
  const date = new Date(text)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatTransit = (days: unknown, departure: unknown, arrival: unknown) => {
  const numericDays = Number(days)
  if (Number.isFinite(numericDays) && numericDays > 0) return `${numericDays} days`

  const departureDate = parseDate(departure)
  const arrivalDate = parseDate(arrival)
  if (!departureDate || !arrivalDate) return 'Transit unavailable'

  const totalHours = Math.max(0, Math.round((arrivalDate.getTime() - departureDate.getTime()) / 3_600_000))
  const d = Math.floor(totalHours / 24)
  const h = totalHours % 24
  return h ? `${d} days ${h} hours` : `${d} days`
}

const isoEquipmentCode = (containerType: string) => {
  const normalized = containerType.toUpperCase()
  if (normalized.includes('45')) return 'L5G1'
  if (normalized.includes('40') && (normalized.includes('HC') || normalized.includes('HQ'))) return '45G1'
  if (normalized.includes('40')) return '42G1'
  if (normalized.includes('20')) return '22G1'
  return ''
}

const findFclCutOff = (route: any) => {
  const cutOffs = [
    ...(Array.isArray(route?.cutOffTimes) ? route.cutOffTimes : []),
    ...(Array.isArray(route?.legs) ? route.legs.flatMap((leg: any) => [
      ...(Array.isArray(leg?.transport?.cutOffTimes) ? leg.transport.cutOffTimes : []),
      ...(Array.isArray(leg?.departure?.cutOffTimes) ? leg.departure.cutOffTimes : [])
    ]) : [])
  ]
  const fclCutOff = cutOffs.find((item: any) => ['FCO', 'PCO', 'EFC'].includes(toUpperValue(item?.cutOffDateTimeCode)))
  return fclCutOff?.cutOffDateTime
}

const getVesselLabel = (leg: any) => {
  const transport = leg?.transport || {}
  const vesselName = pickFirst(transport?.vessel?.name, transport?.vesselName, 'MAERSK vessel')
  const partner = Array.isArray(transport?.servicePartners) ? transport.servicePartners[0] : null
  const voyage = pickFirst(
    partner?.carrierExportVoyageNumber,
    transport?.carrierExportVoyageNumber,
    transport?.universalExportVoyageReference,
    partner?.carrierImportVoyageNumber,
    transport?.carrierImportVoyageNumber,
    transport?.universalImportVoyageReference
  )
  return voyage ? `${vesselName} / ${voyage}` : vesselName
}

const normalizeScheduleRoutes = (routes: any[], query: LiveRateQuery, pricingMessage: string) => {
  return routes.map((route, index) => {
    const legs = Array.isArray(route?.legs)
      ? [...route.legs].sort((a: any, b: any) => Number(a?.sequenceNumber || 0) - Number(b?.sequenceNumber || 0))
      : []
    const firstLeg = legs[0] || {}
    const lastLeg = legs[legs.length - 1] || firstLeg
    const oceanLeg = legs.find((leg: any) => toUpperValue(leg?.transport?.modeOfTransport) === 'VESSEL') || firstLeg
    const departure = pickFirst(firstLeg?.departure?.dateTime, route?.placeOfReceipt?.dateTime)
    const arrival = pickFirst(lastLeg?.arrival?.dateTime, route?.placeOfDelivery?.dateTime)

    return {
      id: pickFirst(route?.routingReference, route?.solutionNumber, `maersk-route-${index + 1}`),
      date: formatShortDate(departure),
      departure: formatDateTime(departure),
      arrival: formatDateTime(arrival),
      gateIn: formatDateTime(findFclCutOff(route)),
      transit: formatTransit(route?.transitTime, departure, arrival),
      vessel: getVesselLabel(oceanLeg),
      spotName: query.rateType === 'spot' ? 'Maersk SPOT' : 'Maersk live schedule',
      price: null,
      soldOut: false,
      priceUnavailable: true,
      priceUnavailableReason: pricingMessage,
      freetime: null,
      routeReference: route?.routingReference || null,
      raw: route
    }
  })
}

const fetchMaerskSchedules = async (query: LiveRateQuery, config: MaerskConfig, pricingMessage: string) => {
  const params = new URLSearchParams({
    placeOfReceipt: query.pol,
    placeOfDelivery: query.pod,
    receiptTypeAtOrigin: 'CY',
    deliveryTypeAtDestination: 'CY'
  })
  const equipmentCode = isoEquipmentCode(query.containerType || query.volume || '')
  if (equipmentCode) params.set('ISOEquipmentCode', equipmentCode)
  if (query.readyDate) params.set('departureStartDate', query.readyDate)

  const url = `${config.schedulesBaseUrl}/v1/point-to-point-routes?${params}`
  const routes = await fetchMaerskJson(url, config)
  return Array.isArray(routes) ? normalizeScheduleRoutes(routes, query, pricingMessage) : []
}

const normalizeMoney = (amount: unknown, currency = 'USD') => {
  const number = Number(amount)
  if (!Number.isFinite(number)) return ''
  return `${currency} ${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const normalizeConfiguredRateResponse = (body: any, query: LiveRateQuery) => {
  const items = Array.isArray(body?.sailings)
    ? body.sailings
    : Array.isArray(body?.offers)
      ? body.offers
      : Array.isArray(body?.rates)
        ? body.rates
        : []

  const currency = pickFirst(body?.currency, body?.currencyCode, 'USD')
  const sailings = items.map((item: any, index: number) => {
    const departure = pickFirst(item.departure, item.departureDateTime, item.etd, item.departureDate)
    const arrival = pickFirst(item.arrival, item.arrivalDateTime, item.eta, item.arrivalDate)
    const price = pickFirst(item.price, item.totalPrice, normalizeMoney(item.amount || item.totalAmount, currency))
    return {
      id: pickFirst(item.id, item.offerId, item.routingReference, `maersk-rate-${index + 1}`),
      date: item.date || formatShortDate(departure),
      departure: departure ? formatDateTime(departure) : toStringValue(item.departure, 'Date unavailable'),
      arrival: arrival ? formatDateTime(arrival) : toStringValue(item.arrival, 'Date unavailable'),
      gateIn: item.gateIn ? formatDateTime(item.gateIn) : toStringValue(item.gateInDeadline, 'Date unavailable'),
      transit: item.transit || formatTransit(item.transitTime, departure, arrival),
      vessel: pickFirst(item.vessel, item.vesselName, item.vesselVoyage, 'MAERSK vessel'),
      spotName: pickFirst(item.spotName, query.rateType === 'spot' ? 'Maersk SPOT' : 'Maersk live offer'),
      price: price || null,
      soldOut: Boolean(item.soldOut),
      priceUnavailable: !price,
      priceUnavailableReason: price ? '' : 'Maersk returned this sailing without a price.',
      freetime: item.freetime || item.freeTime || null,
      routeReference: item.routingReference || null,
      raw: item
    }
  })

  return {
    fixed: pickFirst(body?.fixed, normalizeMoney(body?.fixedAmount, currency), 'USD -'),
    potential: pickFirst(body?.potential, normalizeMoney(body?.potentialAmount, currency), 'USD -'),
    sailings
  }
}

const fetchConfiguredMaerskRates = async (query: LiveRateQuery, config: MaerskConfig) => {
  if (!config.fclRateUrl) return null

  const url = config.fclRateUrl.startsWith('http')
    ? config.fclRateUrl
    : `${config.apiBaseUrl}${config.fclRateUrl.startsWith('/') ? '' : '/'}${config.fclRateUrl}`

  const body = {
    carrier: query.carrier,
    origin: {
      country: query.originCountry,
      unLocationCode: query.pol
    },
    destination: {
      country: query.destinationCountry,
      unLocationCode: query.pod
    },
    equipment: {
      containerType: query.containerType,
      isoEquipmentCode: isoEquipmentCode(query.containerType || query.volume || ''),
      volume: query.volume
    },
    readyDate: query.readyDate,
    rateType: query.rateType
  }

  const response = await fetchMaerskJson(url, config, {
    method: 'POST',
    body: JSON.stringify(body)
  })
  return normalizeConfiguredRateResponse(response, query)
}

export default defineEventHandler(async (event) => {
  const rawQuery = getQuery(event)
  const query: LiveRateQuery = {
    carrier: toUpperValue(rawQuery.carrier, 'MAERSK'),
    pol: toUpperValue(rawQuery.pol),
    pod: toUpperValue(rawQuery.pod),
    originCountry: toStringValue(rawQuery.originCountry),
    destinationCountry: toStringValue(rawQuery.destinationCountry),
    containerType: toStringValue(rawQuery.containerType),
    volume: toStringValue(rawQuery.volume),
    readyDate: toStringValue(rawQuery.readyDate),
    rateType: toStringValue(rawQuery.rateType, 'offered')
  }

  if (query.carrier !== 'MAERSK') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Live carrier API is not configured',
      data: {
        code: 'CARRIER_NOT_CONFIGURED',
        message: `No live API connector is configured for ${query.carrier}.`
      }
    })
  }

  if (!query.pol || !query.pod || query.pol === 'POL' || query.pod === 'POD') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Route is incomplete',
      data: {
        code: 'ROUTE_REQUIRED',
        message: 'Select valid POL and POD UN/LOCODE values before requesting Maersk live rates.'
      }
    })
  }

  const config = getMaerskConfig()
  requireMaerskConsumerKey(config)

  const pricingMessage = config.fclRateUrl
    ? ''
    : 'Maersk Developer catalogue does not expose a public FCL spot-price API. Configure MAERSK_FCL_RATE_URL after Maersk approves a pricing/rate endpoint.'

  const configuredRates = await fetchConfiguredMaerskRates(query, config)
  const rateSailings = configuredRates?.sailings || []
  const scheduleSailings = rateSailings.length ? [] : await fetchMaerskSchedules(query, config, pricingMessage)
  const sailings = rateSailings.length ? rateSailings : scheduleSailings
  const hasPricedSailing = sailings.some((sailing: any) => sailing?.price && !sailing?.priceUnavailable)
  const responsePricingMessage = hasPricedSailing
    ? ''
    : pricingMessage || 'Maersk returned no priced FCL offers for this request.'

  return {
    carrier: 'MAERSK',
    pol: query.pol,
    pod: query.pod,
    originCountry: query.originCountry,
    destinationCountry: query.destinationCountry,
    source: rateSailings.length ? 'maersk-fcl-rate-api' : 'maersk-commercial-schedules-api',
    fixed: configuredRates?.fixed || 'USD -',
    potential: configuredRates?.potential || 'USD -',
    pricingUnavailable: !hasPricedSailing,
    pricingMessage: responsePricingMessage,
    sailings
  }
})
