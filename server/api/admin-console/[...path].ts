import { defineEventHandler, getRequestURL, proxyRequest } from 'h3'

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const backendBaseUrl = trimTrailingSlash(String(config.backendBaseUrl || 'http://127.0.0.1:5001'))
  const rawPath = event.context.params?.path
  const path = Array.isArray(rawPath) ? rawPath.join('/') : String(rawPath || '')
  const search = getRequestURL(event).search

  return proxyRequest(event, `${backendBaseUrl}/api/admin-console/${path}${search}`)
})

