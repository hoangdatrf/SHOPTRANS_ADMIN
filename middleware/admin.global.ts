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

  // Login already returns the complete admin profile. Avoid immediately
  // requesting the same profile again while navigating to /admin. Existing
  // sessions are still revalidated after this short freshness window, and
  // the first protected API request also rejects an expired/revoked token.
  const profileIsFresh = !!adminStore.admin?.id && Date.now() - Number(adminStore.profileVerifiedAt || 0) < 60_000
  if (profileIsFresh) return

  try {
    await adminStore.fetchProfile()
  } catch {
    await adminStore.logout()
    return navigateTo({ path: '/admin/login', query: { redirect: to.fullPath || '/admin' } })
  }
})
