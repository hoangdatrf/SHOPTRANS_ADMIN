import { useAdminConsoleStore } from '~/store/adminConsole'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return
  if (to.path === '/admin/login') return

  const isLegacyAdminChild = to.path !== '/admin'
  if (isLegacyAdminChild) {
    return navigateTo('/admin', { replace: true })
  }

  if (!process.client) return

  const adminStore = useAdminConsoleStore()
  if (!adminStore.token) {
    return navigateTo({ path: '/admin/login', query: { redirect: '/admin' } })
  }

  try {
    await adminStore.fetchProfile()
  } catch {
    await adminStore.logout()
    return navigateTo({ path: '/admin/login', query: { redirect: to.fullPath || '/admin' } })
  }
})
