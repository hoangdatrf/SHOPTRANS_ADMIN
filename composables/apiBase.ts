const DEFAULT_API_HOST = 'https://api.shoptrans.net'

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')
const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '')

const isLocalHostname = (hostname: string) => {
  const normalized = hostname.toLowerCase()

  return normalized === 'localhost'
    || normalized === '127.0.0.1'
    || normalized === '0.0.0.0'
    || normalized === '::1'
    || normalized.endsWith('.local')
    || /^10\./.test(normalized)
    || /^192\.168\./.test(normalized)
    || /^172\.(1[6-9]|2\d|3[0-1])\./.test(normalized)
}

export const useApiBaseUrl = (path = '') => {
  const config = useRuntimeConfig()
  const configuredBaseUrl = String(config.public.apiBaseUrl || '').trim()
  const apiPort = String(config.public.apiPort || '5001').trim()

  let baseUrl = configuredBaseUrl

  if (!baseUrl && process.client) {
    const { protocol, hostname } = window.location

    if (isLocalHostname(hostname)) {
      const url = new URL(window.location.origin)
      url.protocol = protocol
      url.hostname = hostname === 'localhost' || hostname === '::1' ? '127.0.0.1' : hostname
      url.port = apiPort
      baseUrl = url.toString()
    }
  }

  if (!baseUrl) {
    baseUrl = DEFAULT_API_HOST
  }

  const normalizedBaseUrl = trimTrailingSlash(baseUrl)
  const normalizedPath = trimSlashes(path)

  return normalizedPath ? `${normalizedBaseUrl}/${normalizedPath}` : normalizedBaseUrl
}
