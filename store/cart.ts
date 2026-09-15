import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  title: string
  description: string
  serviceType?: 'fcl' | 'lcl' | 'air'
  tab?: 'origin' | 'freight' | 'destination'
  source?: 'products' | 'quote-request' | 'fcl' | 'lcl'
  selectedServices?: string[] // Array of selected service names for quote-request items
}

// Load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (process.client) {
    try {
      const stored = localStorage.getItem('shoptrans_cart')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
  }
  return []
}

// Save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (process.client) {
    try {
      localStorage.setItem('shoptrans_cart', JSON.stringify(items))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadCartFromStorage() as CartItem[]
  }),

  getters: {
    totalItems: (state) => {
      return state.items.length
    },
    cartItems: (state) => state.items,
    cartItemsByType: (state) => {
      const grouped: Record<'fcl' | 'lcl' | 'air', CartItem[]> = {
        fcl: [],
        lcl: [],
        air: []
      }
      state.items.forEach(item => {
        const type = item.serviceType || 'fcl' // Default to fcl if not specified
        if (grouped[type]) {
          grouped[type].push(item)
        }
      })
      return grouped
    },
    cartItemsByTypeAndTab: (state) => {
      const grouped: Record<'fcl' | 'lcl' | 'air', Record<'origin' | 'freight' | 'destination', CartItem[]>> = {
        fcl: { origin: [], freight: [], destination: [] },
        lcl: { origin: [], freight: [], destination: [] },
        air: { origin: [], freight: [], destination: [] }
      }
      state.items.forEach(item => {
        // Skip quote-request items for this grouping
        if (item.source === 'quote-request') return
        const type = item.serviceType || 'fcl'
        const tab = item.tab || 'origin'
        if (grouped[type] && grouped[type][tab]) {
          grouped[type][tab].push(item)
        }
      })
      return grouped
    },
    // Quote Request items getter
    quoteRequestItems: (state) => {
      return state.items.filter(item => item.source === 'quote-request')
    },
    // Products items getter (excludes quote-request and fcl)
    productItems: (state) => {
      return state.items.filter(item => item.source === 'products' || (!item.source && item.source !== 'quote-request' && item.source !== 'fcl'))
    }
  },

  actions: {
    addToCart(item: CartItem) {
      // Không cho thêm nếu item đã có trong cart
      const existingItem = this.items.find(i => i.id === item.id)
      if (!existingItem) {
        this.items.push(item)
        saveCartToStorage(this.items)
      }
    },

    removeFromCart(itemId: number) {
      const index = this.items.findIndex(i => i.id === itemId)
      if (index > -1) {
        this.items.splice(index, 1)
        saveCartToStorage(this.items)
      }
    },

    isInCart(itemId: number): boolean {
      return this.items.some(i => i.id === itemId)
    },

    clearCart() {
      this.items = []
      saveCartToStorage(this.items)
    },

    clearItemsBySource(source: string) {
      this.items = this.items.filter(item => item.source !== source)
      saveCartToStorage(this.items)
    }
  }
})

