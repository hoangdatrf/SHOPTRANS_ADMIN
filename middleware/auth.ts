import { useUserStore } from '~/store/user'

export default defineNuxtRouteMiddleware((to) => {
  // Only run on client since token is stored in persisted client store
  if (process.client) {
    const userStore = useUserStore()
    // If no token and not already heading to login, redirect
    if (!userStore || !userStore.token) {
      if (to.path !== '/login') return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
    }
  }
})