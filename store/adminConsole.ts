import { defineStore } from 'pinia'

export interface AdminConsoleUser {
  id: string
  username: string
  email: string
  displayName: string
  role: string
  country?: string | null
  isActive: boolean
  lastLoginAt?: string | null
  createdAt?: string
  updatedAt?: string
}

const unwrap = (payload: any) => payload?.data ?? payload

export const useAdminConsoleStore = defineStore('adminConsole', {
  state: () => ({
    token: null as string | null,
    admin: null as AdminConsoleUser | null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.admin?.id),
  },
  actions: {
    apiBase() {
      // Admin Console API is bundled with this standalone frontend.
      // Keep it on the current origin instead of sending it to the legacy BE port.
      return '/api'
    },
    headers() {
      return this.token ? { Authorization: `Bearer ${this.token}` } : {}
    },
    async login(username: string, password: string) {
      const response = await $fetch(`${this.apiBase()}/admin-console/auth/login`, {
        method: 'POST',
        body: { username, password },
      })
      const data = unwrap(response)
      this.token = data.access_token
      this.admin = data.admin
      return data
    },
    async fetchProfile() {
      if (!this.token) throw new Error('Missing admin token')
      try {
        const response = await $fetch(`${this.apiBase()}/admin-console/auth/profile`, {
          headers: this.headers(),
        })
        this.admin = unwrap(response)
        return this.admin
      } catch (error) {
        this.token = null
        this.admin = null
        throw error
      }
    },
    async logout() {
      this.token = null
      this.admin = null
    },
  },
  persist: true,
})
