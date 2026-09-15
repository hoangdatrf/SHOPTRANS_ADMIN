import { useUserStore } from '~/store/user'

export default defineNuxtRouteMiddleware(() => {
  if (!process.client) return

  const userStore = useUserStore()
  const user = userStore.user || {}
  const role = String(user.role || user.PER_CLASS || '').toUpperCase()
  const username = String(user.PER_CODE || user.PER_USER || user.username || '').toLowerCase()
  const isAdmin = role === 'ADMIN' || username === 'admin'

  if (!isAdmin) {
    return navigateTo('/unauthorized')
  }
})
