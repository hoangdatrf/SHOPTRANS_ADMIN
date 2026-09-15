type ApiResponse<T> = { data: T; [key: string]: unknown }

export const useLogisticsPricingApi = () => {
  const request = async <T>(url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {})
    if (options.body && !headers.has('content-type')) headers.set('content-type', 'application/json')
    const res = await fetch(url, { ...options, headers })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `${res.status} ${res.statusText}`)
    }
    return res.json() as Promise<T>
  }

  const list = async <T>(resource: string, params: Record<string, string> = {}) => {
    const search = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== ''))
    const suffix = search.toString() ? `?${search}` : ''
    const json = await request<ApiResponse<T[]>>(`/api/${resource}${suffix}`)
    return json.data
  }

  const create = async <T>(resource: string, body: Record<string, unknown>) => {
    const json = await request<ApiResponse<T>>(`/api/${resource}`, { method: 'POST', body: JSON.stringify(body) })
    return json.data
  }

  const update = async <T>(resource: string, id: string, body: Record<string, unknown>) => {
    const json = await request<ApiResponse<T>>(`/api/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(body) })
    return json.data
  }

  const remove = async <T>(resource: string, id: string) => {
    const json = await request<ApiResponse<T>>(`/api/${resource}/${id}`, { method: 'DELETE' })
    return json.data
  }

  const duplicate = async <T>(resource: string, id: string, body: Record<string, unknown> = {}) => {
    const json = await request<ApiResponse<T>>(`/api/${resource}/${id}/duplicate`, { method: 'POST', body: JSON.stringify(body) })
    return json.data
  }

  const patchStatus = async <T>(resource: string, id: string, status: string) => {
    const json = await request<ApiResponse<T>>(`/api/${resource}/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
    return json.data
  }

  const exportCsv = (resource: string) => {
    window.open(`/api/export/${resource}`, '_blank')
  }

  return { request, list, create, update, remove, duplicate, patchStatus, exportCsv }
}
