import { defineEventHandler, getRequestURL, proxyRequest } from 'h3'

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const backendBaseUrl = trimTrailingSlash(String(config.backendBaseUrl || 'http://127.0.0.1:5001'))
  const rawPath = event.context.params?.path
  const path = Array.isArray(rawPath) ? rawPath.join('/') : String(rawPath || '')
  const search = getRequestURL(event).search

  // Stream the request body instead of buffering it here. Attachment uploads are
  // up to 30 MB; without this the whole file is read into memory before the
  // backend request even starts, which doubles the wait on every upload.
  return proxyRequest(event, `${backendBaseUrl}/api/admin-console/${path}${search}`, { streamRequest: true })
})
