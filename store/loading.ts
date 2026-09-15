import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    clearErrorWatcher: false,
  }),
  actions: {
    setLoading(status: boolean) {
      this.isLoading = status
    },
    clearErrorWatch() {
      this.clearErrorWatcher = !this.clearErrorWatcher
    }
  }
}) 