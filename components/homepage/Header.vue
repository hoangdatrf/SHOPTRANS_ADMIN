<template>
  <div class="header-placeholder" :class="{ 'on-homepage': isHomepage }"></div>

  <header class="header" :class="{ 'header-scrolled': isScrolled, 'on-homepage': isHomepage }">


    <!-- ===== TOP ROW ===== -->
    <div class="header-top-row">

      <!-- Logo -->
      <NuxtLink to="/" class="logo">
        <img :src="currentLogo" alt="SHOPTRANS" class="logo-img" />
      </NuxtLink>

      <!-- Navigation -->
      <nav class="nav-main">
        <NuxtLink to="/products" class="nav-item" :class="{ active: isProductsPage }">Products</NuxtLink>
        <NuxtLink to="/bookings" class="nav-item" :class="{ active: isBookingsPage }">Bookings</NuxtLink>
        <NuxtLink to="/tracking" class="nav-item" :class="{ active: isTrackingPage }">Tracking</NuxtLink>
        <NuxtLink to="/solutions" class="nav-item" :class="{ active: isSolutionsPage }">Solutions</NuxtLink>
        <NuxtLink to="/schedules" class="nav-item" :class="{ active: isSchedulesPage }">Schedules</NuxtLink>
        <div class="nav-sep"></div>
        <NuxtLink to="/local-information" class="nav-item" :class="{ active: isLocalInfoPage }">Local Information</NuxtLink>
        <NuxtLink to="/quote-request" class="nav-item nav-highlight" :class="{ active: isQuotePage }">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Quote Request
        </NuxtLink>
      </nav>

      <div style="flex:1;"></div>
      <div class="vsep" style="margin:0 16px;"></div>

      <!-- Right: utility pill + auth -->
      <div class="header-right">

        <!-- Hamburger (mobile) -->
        <button class="hamburger-btn" @click="isMobileMenuOpen = true" aria-label="Open menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <!-- Utility pill group -->
        <div class="utility-pill">

          <!-- Language -->
          <div class="language-dropdown" @mouseenter="isLanguageMenuOpen = true" @mouseleave="isLanguageMenuOpen = false">
            <button class="pill-btn" @click.stop="toggleLanguageMenu">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {{ selectedLanguage }}
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
            </button>
            <div v-if="isLanguageMenuOpen" class="language-menu">
              <button v-for="lang in languages" :key="lang.code" class="language-item" @click.stop="selectLanguage(lang.code)">
                <span class="flag">{{ lang.flag }}</span>
                <span class="lang-code">{{ lang.code }}</span>
                <span class="lang-name">{{ lang.label }}</span>
              </button>
            </div>
          </div>

          <!-- Notifications -->
          <button class="pill-btn" style="position:relative;" @click.prevent="handleNotificationsClick">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Notifications
            <span class="notif-dot"></span>
          </button>

          <!-- Support -->
          <button class="pill-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Support
          </button>

          <div class="pill-sep"></div>

          <!-- Cart -->
          <div v-if="isProductsPage || isBookingsPage || isQuotePage || isFclPage || isLclPage" class="cart-wrapper" style="position:relative;">
            <button class="pill-btn" style="position:relative;" @click.stop="toggleCartMenu" title="Cart">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span v-if="cartTotalItems > 0" class="cart-badge-pill">{{ cartTotalItems }}</span>
            </button>
            <div v-if="isCartMenuOpen" class="cart-dropdown" @click.stop>
              <div class="cart-dropdown-header">
                <h3 class="cart-dropdown-title">Shopping Cart</h3>
                <button class="cart-dropdown-close" @click.stop="toggleCartMenu"><i class="fas fa-times"></i></button>
              </div>
              <div class="cart-dropdown-content">
                <div v-if="cartItems.length === 0" class="cart-empty"><p>Your cart is empty</p></div>
                <div v-else class="cart-items">
                  <div v-if="productItems.length > 0" class="cart-group-products">
                    <h4 class="cart-group-title-products">Products Cart</h4>
                    <div v-for="item in productItems" :key="item.id" class="cart-item-products">
                      <div class="cart-item-info">
                        <div style="font-weight:800;margin-bottom:4px;color:#007bff;font-size:15px;">[{{ (item.serviceType||'FCL').toUpperCase() }}]</div>
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                          <h4 class="cart-item-title" style="margin:0;">{{ item.title }}</h4>
                          <button class="cart-item-remove" @click="removeFromCart(item.id)" style="background:none;border:none;cursor:pointer;color:#dc3545;"><i class="fas fa-trash"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="quoteRequestItems.length > 0" class="cart-group-quote">
                    <h4 class="cart-group-title-quote">Quote Request</h4>
                    <div v-for="item in quoteRequestItems" :key="'qr-'+item.id" class="cart-item-quote">
                      <div class="cart-item-info">
                        <h4 class="cart-item-title">{{ item.title }}</h4>
                        <div class="cart-item-services" v-if="item.selectedServices?.length">
                          <span v-for="(svc,idx) in item.selectedServices" :key="idx" class="service-tag">{{ svc }}</span>
                        </div>
                        <div class="cart-item-description-row">
                          <p class="cart-item-description">{{ item.description }}</p>
                          <button class="cart-item-remove" @click="removeFromCart(item.id)"><i class="fas fa-trash"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="fclPageItems.length > 0" class="cart-group-fcl">
                    <h4 class="cart-group-title-fcl">Check Live Price (FCL)</h4>
                    <div v-for="item in fclPageItems" :key="'fcl-'+item.id" class="cart-item-fcl">
                      <div class="cart-item-info">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                          <h4 class="cart-item-title" style="margin:0;font-weight:700;color:#1976d2;">{{ item.title }}</h4>
                          <button class="cart-item-remove" @click="removeFromCart(item.id)" style="background:none;border:none;cursor:pointer;color:#dc3545;"><i class="fas fa-trash"></i></button>
                        </div>
                        <div class="cart-item-services" v-if="item.selectedServices?.length">
                          <div v-for="(svc,idx) in item.selectedServices" :key="idx" style="font-size:13px;color:#333;margin-bottom:2px;padding-left:8px;">• {{ svc }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="cartItems.length > 0" class="cart-dropdown-footer">
                <button class="cart-checkout-btn" @click="handleCheckout">Checkout</button>
              </div>
            </div>
          </div>

        </div><!-- /utility-pill -->

        <div class="vsep"></div>

        <!-- Auth: not logged in -->
        <template v-if="!isLoggedIn">
          <button class="btn-register" @click="navigateTo('/register')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            Register
          </button>
          <button class="btn-login" @click="navigateTo('/login')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Login
          </button>
        </template>

        <!-- Auth: logged in -->
        <div v-else class="user-logged-in-container">
          <div class="user-info-display" :class="{ 'menu-open': isAccountMenuOpen }" @click="toggleAccountMenu">
            <div class="user-avatar">{{ userInitials }}</div>
            <div class="user-details"><div class="user-name">{{ userDisplayName }}</div></div>
            <div class="user-custom-tooltip">
              <div class="tooltip-name">{{ userDisplayName }}</div>
              <div class="tooltip-company">{{ userCompany }}|VN</div>
            </div>
            <div v-if="isAccountMenuOpen" class="account-menu user-info-menu">
              <button class="account-menu-item" @click.stop="openAccountPopup"><i class="fas fa-user-circle"></i><span>Start Center</span></button>
              <button class="account-menu-item account-menu-item-logout" @click.stop="handleLogout"><i class="fas fa-sign-out-alt"></i><span>Logout</span></button>
            </div>
          </div>
        </div>

      </div><!-- /header-right -->
    </div><!-- /header-top-row -->

    <!-- ===== BOTTOM ROW — Check Live Price ===== -->
    <div class="header-bottom-row">
      <div class="bottom-inner">
        <div class="bottom-offset"></div>
        <div class="bottom-content">
        <div class="live-label">
          <span class="live-dot"></span>
          Check Live Price
        </div>
        <div class="mode-tabs">
          <NuxtLink to="/fcl" class="mode-tab" :class="{ active: isFclPage }">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            FCL
          </NuxtLink>
          <NuxtLink to="/lcl" class="mode-tab" :class="{ active: isLclPage }">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            LCL
          </NuxtLink>
          <button class="mode-tab">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16v-2l-8-5V3a1 1 0 0 0-2 0v6l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
            AIR
          </button>
        </div>
        <div class="bottom-right">
          <div class="stat-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Updated <strong>{{ animatedMinutes }} min ago</strong>
          </div>
          <div class="stat-chip">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            <strong>{{ animatedRoutes.toLocaleString() }}</strong> routes live
          </div>
        </div>
        </div>
      </div>
    </div><!-- /header-bottom-row -->

    <!-- ===== MOBILE NAV DRAWER ===== -->
    <div class="mobile-drawer" :class="{ open: isMobileMenuOpen }" @click.self="isMobileMenuOpen = false">
      <div class="mobile-drawer-inner">
        <div class="mobile-drawer-header">
          <NuxtLink to="/" class="logo" @click="isMobileMenuOpen = false">
            <img :src="currentLogo" alt="SHOPTRANS" class="logo-img" style="height:44px;" />
          </NuxtLink>
          <button class="mobile-close-btn" @click="isMobileMenuOpen = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <nav class="mobile-nav">
          <NuxtLink to="/products" class="mobile-nav-item" :class="{ active: isProductsPage }" @click="isMobileMenuOpen = false">Products</NuxtLink>
          <NuxtLink to="/bookings" class="mobile-nav-item" :class="{ active: isBookingsPage }" @click="isMobileMenuOpen = false">Bookings</NuxtLink>
          <NuxtLink to="/tracking" class="mobile-nav-item" :class="{ active: isTrackingPage }" @click="isMobileMenuOpen = false">Tracking</NuxtLink>
          <NuxtLink to="/solutions" class="mobile-nav-item" :class="{ active: isSolutionsPage }" @click="isMobileMenuOpen = false">Solutions</NuxtLink>
          <NuxtLink to="/schedules" class="mobile-nav-item" :class="{ active: isSchedulesPage }" @click="isMobileMenuOpen = false">Schedules</NuxtLink>
          <NuxtLink to="/local-information" class="mobile-nav-item" :class="{ active: isLocalInfoPage }" @click="isMobileMenuOpen = false">Local Information</NuxtLink>
          <NuxtLink to="/quote-request" class="mobile-nav-item mobile-nav-highlight" :class="{ active: isQuotePage }" @click="isMobileMenuOpen = false">Quote Request</NuxtLink>
        </nav>
        <div class="mobile-bottom-actions">
          <div class="mobile-live-bar">
            <span class="live-dot"></span>
            <span class="live-label-text">Check Live Price</span>
          </div>
          <div class="mobile-mode-tabs">
            <NuxtLink to="/fcl" class="mobile-mode-tab" :class="{ active: isFclPage }" @click="isMobileMenuOpen = false">FCL</NuxtLink>
            <NuxtLink to="/lcl" class="mobile-mode-tab" :class="{ active: isLclPage }" @click="isMobileMenuOpen = false">LCL</NuxtLink>
            <button class="mobile-mode-tab">AIR</button>
          </div>
          <div class="mobile-auth-row" v-if="!isLoggedIn">
            <button class="btn-register" style="flex:1;justify-content:center;" @click="navigateTo('/register'); isMobileMenuOpen = false">Register</button>
            <button class="btn-login" style="flex:1;justify-content:center;" @click="navigateTo('/login'); isMobileMenuOpen = false">Login</button>
          </div>
          <div v-else class="mobile-user-row">
            <div class="user-avatar">{{ userInitials }}</div>
            <span class="mobile-user-name">{{ userDisplayName }}</span>
            <button class="mobile-account-btn" @click="navigateTo('/my-account'); isMobileMenuOpen = false">Start Center</button>
            <button class="mobile-logout-btn" @click="handleLogout(); isMobileMenuOpen = false">Logout</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Popup -->
    <div v-if="isAccountPopupOpen" class="account-popup-overlay" @click.stop="closeAccountPopup">
      <div class="account-popup" @click.stop>
        <div class="account-popup-header">
          <h3 class="account-popup-title">Start Center</h3>
          <button class="account-popup-close" @click.stop="closeAccountPopup"><i class="fas fa-times"></i></button>
        </div>
        <div class="account-popup-content">
          <div class="account-info-section">
            <div class="account-info-item"><label>Username:</label><span>{{ userStore.user?.PER_CODE || 'N/A' }}</span></div>
            <div class="account-info-item"><label>Name:</label><span>{{ userStore.user?.PER_DESC || 'N/A' }}</span></div>
            <div class="account-info-item" v-if="userStore.user?.PER_EMAILADDRESS"><label>Email:</label><span>{{ userStore.user.PER_EMAILADDRESS }}</span></div>
            <div class="account-info-item" v-if="userCompany"><label>Organization:</label><span>{{ userCompany }}</span></div>
            <div class="account-info-item" v-if="userStore.user?.PER_CLASS"><label>Class:</label><span>{{ userStore.user.PER_CLASS }}</span></div>
          </div>
        </div>
      </div>
    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/store/user'
import { useCartStore } from '~/store/cart'
import logoWhite from '~/assets/logoshoptrans_white.png'
import logoBlue from '~/assets/logoshoptrans_blue.png'
import cartIcon from '~/assets/img_16.png'

const route = useRoute()
const userStore = useUserStore()
const cartStore = useCartStore()

// Effective path considers login redirects
const effectivePath = computed(() => {
  if (route.path === '/login' && route.query.redirect) {
    return String(route.query.redirect).split('?')[0]
  }
  return route.path
})

// Homepage check
const isHomepage = computed(() => effectivePath.value === '/')
const isProductsPage = computed(() => effectivePath.value === '/products')
const isBookingsPage = computed(() => effectivePath.value === '/bookings' || effectivePath.value === '/finance-task' || effectivePath.value === '/shipment-detail')
const isTrackingPage = computed(() => effectivePath.value === '/tracking')
const isSolutionsPage = computed(() => effectivePath.value === '/solutions')
const isSchedulesPage = computed(() => effectivePath.value.startsWith('/schedules'))
const isLocalInfoPage = computed(() => effectivePath.value === '/local-information')
const isQuotePage = computed(() => effectivePath.value === '/quote-request')
const isFclPage = computed(() => effectivePath.value === '/fcl')
const isLclPage = computed(() => effectivePath.value === '/lcl')

// Bookings filter state
const bookingsFilter = ref<'fcl' | 'lcl' | 'air'>('fcl')

const setBookingsFilter = (filter: 'fcl' | 'lcl' | 'air') => {
  bookingsFilter.value = filter
  // Emit event để bookings page có thể react
  if (process.client) {
    window.dispatchEvent(new CustomEvent('bookings-filter-change', { detail: filter }))
  }
}

// Scroll detection
const isScrolled = ref(false)
const isPastHero = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
  isPastHero.value = window.scrollY > 5
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Use the white logo while the homepage header is blended into the hero.
const currentLogo = computed(() => {
  if (isHomepage.value && !isScrolled.value) {
    return logoWhite
  }

  return logoBlue
})

// Language
const languages = [
  { code: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'CN', label: '中文', flag: '🇨🇳' },
  { code: 'JP', label: '日本語', flag: '🇯🇵' },
  { code: 'VN', label: 'Tiếng Việt', flag: '🇻🇳' }
]

const selectedLanguage = ref('EN')
const isLanguageMenuOpen = ref(false)

const toggleLanguageMenu = () => {
  isLanguageMenuOpen.value = !isLanguageMenuOpen.value
}

const selectLanguage = (code: string) => {
  selectedLanguage.value = code
  isLanguageMenuOpen.value = false
}

// Currency
const currencies = [
  { code: 'USD', label: 'US DOLLAR' },
  { code: 'VND', label: 'VIETNAM DONG' },
  { code: 'RM', label: 'MY RINGGIT' },
  { code: 'CNY', label: 'CHINESE YUAN' },
  { code: 'JPY', label: 'JAPANESE YEN' }
]
const selectedCurrency = ref<{ code: string; label?: string }>({ code: 'USD', label: 'US DOLLAR' })
const isCurrencyMenuOpen = ref(false)

const toggleCurrencyMenu = () => {
  isCurrencyMenuOpen.value = !isCurrencyMenuOpen.value
}

const selectCurrency = (code: string) => {
  const c = currencies.find(x => x.code === code)
  if (c) selectedCurrency.value = { code: c.code, label: c.label }
  isCurrencyMenuOpen.value = false
  // optionally emit event for app
  if (process.client) window.dispatchEvent(new CustomEvent('currency-change', { detail: selectedCurrency.value }))
}

// Account menu & popup
const isAccountMenuOpen = ref(false)
const isAccountPopupOpen = ref(false)

const toggleAccountMenu = () => {
  isAccountMenuOpen.value = !isAccountMenuOpen.value
}

const openAccountPopup = () => {
  isAccountMenuOpen.value = false
  navigateTo('/my-account')
}

const closeAccountPopup = () => {
  isAccountPopupOpen.value = false
}

const handleLogout = async () => {
  isAccountMenuOpen.value = false
  await userStore.logout()
  closeAccountPopup()
  navigateTo('/') // Nuxt global
}

const handleNotificationsClick = () => {
  if (!isLoggedIn.value) {
    navigateTo('/login')
  }
}

// Click outside account menu
const handleClickOutsideAccount = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-info-display')) {
    isAccountMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutsideAccount)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideAccount)
})

// User state
const isLoggedIn = computed(() => !!userStore.token)
const userDisplayName = computed(() => {
  if (userStore.user?.PER_DESC) return userStore.user.PER_DESC
  if (userStore.user?.PER_CODE) return userStore.user.PER_CODE
  return 'Account'
})

const userCompany = computed(() => {
  const user = userStore.user || {}
  return user.PER_ORG || user.company || 'Unknown Company'
})

const userInitials = computed(() => {
  const name = userStore.user?.PER_DESC || userStore.user?.PER_CODE || 'NP'
  // Simple initials logic: first letter of first two words, or first 2 letters
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
})

// Cart state
const isCartMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const cartTotalItems = computed(() => cartStore.totalItems)
const cartItems = computed(() => cartStore.cartItems)
const cartItemsByType = computed(() => cartStore.cartItemsByType)
const cartItemsByTypeAndTab = computed(() => cartStore.cartItemsByTypeAndTab)
const quoteRequestItems = computed(() => cartStore.quoteRequestItems)
const fclPageItems = computed(() => cartStore.items.filter(item => item.source === 'fcl'))
const productItems = computed(() => cartStore.productItems)

// Computed property to get freight title based on service type
const getFreightTitle = (serviceType: 'fcl' | 'lcl' | 'air') => {
  return serviceType === 'air' ? 'AIR FREIGHT' : 'OCEAN'
}

const toggleCartMenu = () => {
  isCartMenuOpen.value = !isCartMenuOpen.value
}

const removeFromCart = (itemId: number) => {
  cartStore.removeFromCart(itemId)
}

const handleCheckout = () => {
  const items = cartStore.items
  if (!items || items.length === 0) return

  // Determine service type from cart items
  // Priority: product-sourced items (numeric IDs) first
  const productItems = items.filter(i => i.source !== 'fcl' && i.source !== 'lcl')
  const fclSourceItems = items.filter(i => i.source === 'fcl')

  let serviceType: 'fcl' | 'lcl' | 'air' | null = null

  if (productItems.length > 0) {
    serviceType = (productItems[0].serviceType as 'fcl' | 'lcl' | 'air') || 'fcl'
  } else if (fclSourceItems.length > 0) {
    serviceType = 'fcl'
  } else if (items.length > 0) {
    serviceType = (items[0].serviceType as 'fcl' | 'lcl' | 'air') || 'fcl'
  }

  if (!serviceType || serviceType === 'air') {
    // Air freight not yet implemented as a separate checkout page
    alert('Air freight checkout is not yet available. Please use Quote Request.')
    return
  }

  // FCL service ID → service key mapping
  const FCL_ID_MAP: Record<number, { group: 'origin' | 'sea' | 'dest'; key: string }> = {
    1:  { group: 'origin', key: 'fullExw' },
    2:  { group: 'origin', key: 'fullFca' },
    3:  { group: 'origin', key: 'customsOnly' },
    4:  { group: 'origin', key: 'insurance' },
    5:  { group: 'origin', key: 'collectPay' },
    16: { group: 'sea', key: 'bookingOffered' },
    17: { group: 'sea', key: 'bookingSpot' },
    18: { group: 'sea', key: 'handleUnderAvailable' },
    19: { group: 'sea', key: 'serviceContract' },
    20: { group: 'sea', key: 'switchBill' },
    28: { group: 'dest', key: 'dap' },
    29: { group: 'dest', key: 'ddu' },
    30: { group: 'dest', key: 'ddp' },
    31: { group: 'dest', key: 'customsOnly' },
    32: { group: 'dest', key: 'insurance' },
    33: { group: 'dest', key: 'collectPay' },
    34: { group: 'dest', key: 'dodRelease' },
  }

  // LCL service ID → service key mapping
  const LCL_ID_MAP: Record<number, { group: 'origin' | 'sea' | 'dest'; key: string }> = {
    6:  { group: 'origin', key: 'fullExw' },
    7:  { group: 'origin', key: 'fullFca' },
    8:  { group: 'origin', key: 'customsOnly' },
    9:  { group: 'origin', key: 'insurance' },
    10: { group: 'origin', key: 'collectPay' },
    21: { group: 'sea', key: 'bookingOffered' },
    22: { group: 'sea', key: 'handleUnderAvailable' },
    23: { group: 'sea', key: 'serviceContract' },
    24: { group: 'sea', key: 'switchBill' },
    35: { group: 'dest', key: 'dap' },
    36: { group: 'dest', key: 'ddu' },
    37: { group: 'dest', key: 'ddp' },
    38: { group: 'dest', key: 'customsOnly' },
    39: { group: 'dest', key: 'insurance' },
    40: { group: 'dest', key: 'collectPay' },
  }

  const idMap = serviceType === 'fcl' ? FCL_ID_MAP : LCL_ID_MAP

  // Collect service keys per group
  const preselected: { origin: string[]; sea: string[]; dest: string[] } = {
    origin: [],
    sea: [],
    dest: [],
  }

  items.forEach(item => {
    if (typeof item.id === 'number' && idMap[item.id]) {
      const { group, key } = idMap[item.id]
      if (!preselected[group].includes(key)) {
        preselected[group].push(key)
      }
    }
  })

  // Store in sessionStorage for the target page to read
  sessionStorage.setItem('checkout_preselected_services', JSON.stringify(preselected))

  // Close cart dropdown
  isCartMenuOpen.value = false

  // Navigate to the appropriate page
  navigateTo(serviceType === 'lcl' ? '/lcl' : '/fcl')
}

// Close cart menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.cart-wrapper')) {
    isCartMenuOpen.value = false
  }
}
// Animated stat values for bottom bar
const animatedRoutes = ref(0)
const animatedMinutes = ref(0)

const animateStats = () => {
  const duration = 2000;
  // Random routes between 1200 and 1300
  const targetRoutes = Math.floor(Math.random() * (1300 - 1200 + 1)) + 1200;
  // Random minutes between 1 and 4
  const targetMinutes = Math.floor(Math.random() * 4) + 1;
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // easeOutExpo for smoother slowdown at the end
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

    animatedRoutes.value = Math.floor(targetRoutes * easeProgress);
    animatedMinutes.value = Math.floor(targetMinutes * easeProgress);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      animatedRoutes.value = targetRoutes;
      animatedMinutes.value = targetMinutes;
    }
  };

  window.requestAnimationFrame(step);
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  animateStats()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>


<style scoped>
/* ===========================
   HEADER WRAPPER
=========================== */
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap');

.header-placeholder { height: 112px; width: 100%; }
.header-placeholder.on-homepage { height: 0; }

.header,
.header :not(i):not(.fas):not(.fa):not(.fab):not(.far) {
  font-family: 'Geist', sans-serif !important;
}

.header.on-homepage .live-label,
.header.on-homepage .mode-tab,
.header.on-homepage .stat-chip {
  font-family: 'Geist Mono', monospace !important;
}

.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 9999;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  width: 100%;
  transition: box-shadow 0.3s ease;
}
.header.on-homepage:not(.header-scrolled) { background: transparent; border-bottom: none; box-shadow: none; }
.header.header-scrolled { background: #ffffff; box-shadow: 0 2px 16px rgba(0,0,0,0.1); border-bottom: 1px solid #e2e8f0; }

/* ===========================
   TOP ROW
=========================== */
.header-top-row {
  display: flex; align-items: center;
  padding: 0 40px; height: 70px; gap: 0;
  max-width: 1600px; margin: 0 auto; width: 100%;
}

/* Logo */
.logo { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; margin-right: 20px; }
.logo-img { height: 68px; width: auto; object-fit: contain; cursor: pointer; }

/* Nav */
.nav-main { display: flex; align-items: center; gap: 0; }
.nav-item {
  display: flex; align-items: center; gap: 3px;
  padding: 6px 8px; border-radius: 7px;
  font-size: 13px; font-weight: 500; color: #475569;
  text-decoration: none; cursor: pointer;
  border: none; background: none; white-space: nowrap;
  transition: all 0.15s; font-family: inherit;
}
.nav-item:hover { background: #f0fdf4; color: #15803d; }
.nav-item.active { color: #16a34a; font-weight: 700; background: #f0fdf4; }
.nav-item.nav-highlight {
  color: #15803d; font-weight: 700; background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
}
.nav-item.nav-highlight:hover { background: #dcfce7; }
.header.on-homepage:not(.header-scrolled) .nav-item { color: rgba(255,255,255,0.86); }
.header.on-homepage:not(.header-scrolled) .nav-item:hover { background: rgba(255,255,255,0.15); color: #fff; }
.header.on-homepage:not(.header-scrolled) .nav-item.active { background: rgba(255,255,255,0.2); color: #fff; }
.header.on-homepage:not(.header-scrolled) .nav-item.nav-highlight { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.4); color: #fff; }

.nav-sep { width: 1px; height: 18px; background: #e2e8f0; margin: 0 4px; flex-shrink: 0; }

/* Separators */
.vsep { width: 1px; height: 22px; background: #e2e8f0; flex-shrink: 0; }

/* Header right */
.header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

/* Utility pill */
.utility-pill {
  display: flex; align-items: center; gap: 0;
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 9px; padding: 3px 4px;
}
.pill-btn {
  display: flex; align-items: center; gap: 4px;
  padding: 5px 7px; border-radius: 6px;
  font-size: 12px; font-weight: 500; color: #475569;
  background: none; border: none; cursor: pointer;
  white-space: nowrap; transition: all 0.15s; position: relative;
  font-family: inherit;
}
.pill-btn:hover { background: #f0fdf4; color: #15803d; }
.pill-sep { width: 1px; height: 14px; background: #e2e8f0; flex-shrink: 0; margin: 0 2px; }

/* Notif dot */
.notif-dot {
  position: absolute; top: 4px; right: 4px;
  width: 7px; height: 7px; border-radius: 50%;
  background: #ef4444; border: 2px solid #f8fafc;
}

/* Cart badge in pill */
.cart-badge-pill {
  position: absolute; top: 3px; right: 3px;
  min-width: 15px; height: 15px; padding: 0 3px;
  border-radius: 8px; background: #f97316;
  color: #fff; font-size: 9px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #f8fafc;
}

/* Auth buttons */
.btn-register {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px;
  border: 1.5px solid #e2e8f0; background: #fff;
  font-size: 13px; font-weight: 600; color: #0f172a;
  cursor: pointer; white-space: nowrap; transition: all 0.15s;
  font-family: inherit;
}
.btn-register:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }
.btn-login {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 20px; border-radius: 8px;
  border: none; background: #16a34a;
  font-size: 13px; font-weight: 700; color: #fff;
  cursor: pointer; white-space: nowrap; transition: all 0.18s;
  box-shadow: 0 2px 10px rgba(22,163,74,0.28);
  font-family: inherit;
}
.btn-login:hover { background: #15803d; box-shadow: 0 4px 16px rgba(22,163,74,0.38); transform: translateY(-1px); }

/* on-homepage overrides for auth */
.header.on-homepage:not(.header-scrolled) .btn-register { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.5); color: #fff; }
.header.on-homepage:not(.header-scrolled) .btn-register:hover { background: rgba(255,255,255,0.25); }
.header.on-homepage:not(.header-scrolled) .utility-pill { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
.header.on-homepage:not(.header-scrolled) .pill-btn { color: rgba(255,255,255,0.86); }
.header.on-homepage:not(.header-scrolled) .pill-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
.header.on-homepage:not(.header-scrolled) .pill-sep { background: rgba(255,255,255,0.2); }
.header.on-homepage:not(.header-scrolled) .vsep { background: rgba(255,255,255,0.2); }

/* ===========================
   BOTTOM ROW
=========================== */
.header-bottom-row {
  background: #f0fdf4; border-top: 1px solid #bbf7d0;
  overflow: hidden; /* prevents content spilling on zoom-out */
}
.header.on-homepage:not(.header-scrolled) .header-bottom-row { background: transparent; border-top: 1px solid rgba(255,255,255,0.12); }

.bottom-inner {
  display: flex; align-items: center;
  padding: 0 40px; height: 42px;
  max-width: 1600px; margin: 0 auto; width: 100%;
  box-sizing: border-box;
}

.bottom-offset { flex-shrink: 0; width: 64px; }
.bottom-content { display: flex; align-items: center; gap: 18px; flex: 1; min-width: 0; overflow: hidden; }

.live-label {
  display: flex; align-items: center; gap: 7px;
  font-size: 11.5px; font-weight: 700; color: #15803d;
  text-transform: uppercase; letter-spacing: 0.06em;
  white-space: nowrap; flex-shrink: 0;
  padding-left: 6px;
}
.live-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.22);
  animation: livepulse 2s ease-in-out infinite; flex-shrink: 0;
}
@keyframes livepulse { 0%,100% { box-shadow: 0 0 0 3px rgba(22,163,74,0.22); } 50% { box-shadow: 0 0 0 7px rgba(22,163,74,0.07); } }

.mode-tabs { display: flex; align-items: center; gap: 4px; }
.mode-tab {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 16px; border-radius: 6px;
  font-size: 12.5px; font-weight: 600;
  border: 1.5px solid transparent; cursor: pointer;
  transition: all 0.15s; white-space: nowrap;
  font-family: inherit; text-decoration: none;
  background: #fff; color: #475569; border-color: #bbf7d0;
}
.mode-tab.active { background: #16a34a; color: #fff; border-color: #15803d; box-shadow: 0 2px 8px rgba(22,163,74,0.3); }
.mode-tab:not(.active):hover { border-color: #16a34a; color: #15803d; background: #dcfce7; }
.header.on-homepage:not(.header-scrolled) .mode-tab { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); color: #fff; }
.header.on-homepage:not(.header-scrolled) .mode-tab.active { background: rgba(255,255,255,0.9); color: #15803d; border-color: #fff; }

.bottom-right { margin-left: auto; display: flex; align-items: center; gap: 20px; }
.stat-chip { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #475569; }
.stat-chip strong { color: #15803d; font-weight: 700; }
.header.on-homepage:not(.header-scrolled) .stat-chip { color: rgba(255,255,255,0.8); }
.header.on-homepage:not(.header-scrolled) .stat-chip strong { color: #fff; }

/* ===========================
   LANGUAGE DROPDOWN
=========================== */
.language-dropdown { position: relative; }
.language-menu {
  position: absolute; top: 100%; left: 0; min-width: 170px;
  background: rgba(255,255,255,0.97); border-radius: 8px;
  border: 1px solid #e2e8f0; box-shadow: 0 8px 18px rgba(0,0,0,0.15);
  padding: 4px 0; z-index: 1200; display: flex; flex-direction: column;
}
.language-item {
  width: 100%; padding: 8px 12px; display: flex; align-items: center; gap: 8px;
  background: transparent; border: none; color: #1e293b; font-size: 13px;
  text-align: left; cursor: pointer; transition: background 0.15s; white-space: nowrap;
  font-family: inherit;
}
.language-item:hover { background: #f0fdf4; }
.language-item .flag { width: 18px; }
.language-item .lang-code { font-weight: 600; }
.language-item .lang-name { opacity: 0.75; font-size: 12px; }

/* ===========================
   CART DROPDOWN
=========================== */
.cart-wrapper { position: relative; }
.cart-dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  width: 400px; max-width: 90vw; max-height: 520px;
  background: #fff; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18); border: 1px solid #e2e8f0;
  z-index: 1300; display: flex; flex-direction: column; overflow: hidden;
}
.cart-dropdown-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid #e2e8f0; }
.cart-dropdown-title { font-size: 16px; font-weight: 700; color: #1a1a1a; margin: 0; }
.cart-dropdown-close { background: none; border: none; color: #666; font-size: 16px; cursor: pointer; padding: 4px; display: flex; align-items: center; }
.cart-dropdown-close:hover { color: #000; }
.cart-dropdown-content { flex: 1; overflow-y: auto; padding: 14px; }
.cart-empty { text-align: center; padding: 36px 20px; color: #94a3b8; }
.cart-items { display: flex; flex-direction: column; gap: 14px; }
.cart-group-products { border-left: 3px solid #28a745; padding: 10px 0; margin-bottom: 10px; }
.cart-group-title-products { font-size: 13px; font-weight: 700; color: #28a745; padding: 0 14px 8px; margin: 0; border-bottom: 1px solid #d4edda; }
.cart-item-products { background: #f0fdf4; border-radius: 6px; padding: 10px; margin: 6px 14px; }
.cart-group-quote { border-left: 3px solid #6366f1; padding: 10px 0; margin-bottom: 10px; }
.cart-group-title-quote { font-size: 13px; font-weight: 700; color: #6366f1; padding: 0 14px 8px; margin: 0; border-bottom: 1px solid #e8e7ff; }
.cart-item-quote { background: #f8f7ff; border-radius: 6px; padding: 10px; margin: 6px 14px; }
.cart-group-fcl { border-left: 3px solid #1976d2; padding: 10px 0; margin-bottom: 10px; }
.cart-group-title-fcl { font-size: 13px; font-weight: 700; color: #1976d2; padding: 0 14px 8px; margin: 0; border-bottom: 1px solid #e3f2fd; }
.cart-item-fcl { background: #e3f2fd; border-radius: 6px; padding: 10px; margin: 6px 14px; }
.cart-item-info { margin-bottom: 6px; }
.cart-item-title { font-size: 14px; font-weight: 600; color: #1a1a1a; margin: 0 0 4px; line-height: 1.4; }
.cart-item-description-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.cart-item-description { font-size: 12px; color: #64748b; margin: 0; flex: 1; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; }
.cart-item-services { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 6px; }
.service-tag { display: inline-block; padding: 2px 8px; background: #6366f1; color: #fff; font-size: 11px; font-weight: 500; border-radius: 12px; }
.cart-item-remove { background: none; border: none; color: #dc3545; font-size: 14px; cursor: pointer; padding: 4px; flex-shrink: 0; }
.cart-item-remove:hover { color: #b91c1c; }
.cart-dropdown-footer { padding: 14px 18px; border-top: 1px solid #e2e8f0; }
.cart-checkout-btn { width: 100%; padding: 11px; background: #16a34a; color: #fff; border: none; border-radius: 7px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.cart-checkout-btn:hover { background: #15803d; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(22,163,74,0.3); }

/* ===========================
   USER / AUTH
=========================== */
.user-logged-in-container { display: flex; align-items: center; gap: 14px; }
.user-info-display { display: flex; align-items: center; gap: 7px; cursor: pointer; position: relative; padding: 4px 6px; border-radius: 8px; transition: background 0.2s; }
.user-info-display:hover { background: #f1f5f9; }
.header.on-homepage:not(.header-scrolled) .user-info-display:hover { background: rgba(255,255,255,0.12); }
.user-avatar { width: 30px; height: 30px; background: #dcfce7; color: #15803d; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; border: 1px solid #bbf7d0; }
.user-details { display: flex; flex-direction: column; line-height: 1.2; }
.user-name { font-weight: 700; font-size: 13px; color: #1e293b; text-transform: uppercase; }
.header.on-homepage:not(.header-scrolled) .user-name { color: #fff; }
.user-info-menu { top: 100%; right: 0; margin-top: 6px; }
.user-custom-tooltip {
  visibility: hidden; opacity: 0; position: absolute;
  top: calc(100% + 10px); right: 0;
  background: #fff; border: 1px solid #e2e8f0; border-left: 4px solid #16a34a;
  border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  padding: 10px 14px; min-width: 200px; z-index: 1500;
  transform: translateY(6px); transition: all 0.2s; pointer-events: none;
}
.user-info-display:hover .user-custom-tooltip { visibility: visible; opacity: 1; transform: translateY(0); }
.user-info-display.menu-open .user-custom-tooltip { visibility: hidden; opacity: 0; }
.tooltip-name { font-size: 13px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tooltip-company { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-top: 1px solid #f1f5f9; padding-top: 5px; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Account menu */
.account-menu {
  position: absolute; top: 110%; right: 0; min-width: 180px;
  background: #fff; border-radius: 8px; border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12); padding: 4px 0; z-index: 1200; display: flex; flex-direction: column;
}
.account-menu-item { width: 100%; padding: 9px 16px; display: flex; align-items: center; gap: 10px; background: transparent; border: none; color: #334155; font-size: 14px; text-align: left; cursor: pointer; transition: background 0.15s; white-space: nowrap; font-family: inherit; }
.account-menu-item i { width: 16px; font-size: 15px; }
.account-menu-item:hover { background: #f8fafc; }
.account-menu-item-logout { border-top: 1px solid #f1f5f9; margin-top: 4px; padding-top: 11px; color: #dc2626; }
.account-menu-item-logout:hover { background: #fef2f2; }

/* Account popup */
.account-popup-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 2000; animation: fadeIn 0.2s ease; }
.account-popup { position: fixed; top: 0; right: 0; width: 400px; max-width: 90vw; height: 100vh; background: #fff; box-shadow: -4px 0 20px rgba(0,0,0,0.2); display: flex; flex-direction: column; animation: slideInRight 0.3s ease; overflow-y: auto; }
@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.account-popup-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; background: #fff; z-index: 1; }
.account-popup-title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }
.account-popup-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 6px; background: transparent; border: none; color: #64748b; font-size: 18px; cursor: pointer; transition: background 0.2s; }
.account-popup-close:hover { background: #f1f5f9; }
.account-popup-content { flex: 1; padding: 24px; }
.account-info-section { display: flex; flex-direction: column; gap: 18px; }
.account-info-item { display: flex; flex-direction: column; gap: 4px; }
.account-info-item label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.6px; }
.account-info-item span { font-size: 15px; color: #1e293b; font-weight: 500; }

/* ===========================
   HAMBURGER (hidden on desktop)
=========================== */
.hamburger-btn {
  display: none;
  align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: 8px;
  background: none; border: none; cursor: pointer;
  color: #334155; transition: background 0.15s;
  flex-shrink: 0;
}
.hamburger-btn:hover { background: #f0fdf4; }
.header.on-homepage:not(.header-scrolled) .hamburger-btn { color: #fff; }
.header.on-homepage:not(.header-scrolled) .hamburger-btn:hover { background: rgba(255,255,255,0.15); }

/* ===========================
   MOBILE DRAWER
=========================== */
.mobile-drawer {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(0,0,0,0.45);
  opacity: 0; pointer-events: none;
  transition: opacity 0.25s ease;
}
.mobile-drawer.open { opacity: 1; pointer-events: auto; }

.mobile-drawer-inner {
  position: absolute; top: 0; right: 0;
  width: min(360px, 85vw); height: 100%;
  background: #fff; display: flex; flex-direction: column;
  transform: translateX(100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
  overflow-y: auto;
}
.mobile-drawer.open .mobile-drawer-inner { transform: translateX(0); }

.mobile-drawer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid #e2e8f0;
}

.mobile-close-btn {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 8px;
  background: #f1f5f9; border: none; cursor: pointer; color: #475569;
  transition: background 0.15s;
}
.mobile-close-btn:hover { background: #e2e8f0; }

.mobile-nav {
  display: flex; flex-direction: column;
  padding: 12px 0; flex: 1;
}
.mobile-nav-item {
  display: flex; align-items: center;
  padding: 13px 24px; font-size: 15px; font-weight: 500;
  color: #334155; text-decoration: none;
  border-left: 3px solid transparent;
  transition: all 0.15s;
}
.mobile-nav-item:hover { background: #f8fafc; color: #16a34a; border-left-color: #16a34a; }
.mobile-nav-item.active { color: #16a34a; font-weight: 700; border-left-color: #16a34a; background: #f0fdf4; }
.mobile-nav-highlight {
  color: #15803d; font-weight: 700;
  background: #f0fdf4; border-left-color: #16a34a;
  margin: 4px 16px; border-radius: 8px; border-left: none;
  padding: 12px 20px;
}

.mobile-bottom-actions {
  padding: 16px 20px 28px;
  border-top: 1px solid #e2e8f0;
  display: flex; flex-direction: column; gap: 14px;
}
.mobile-live-bar {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 700; color: #15803d;
  text-transform: uppercase; letter-spacing: 0.06em;
}
.live-label-text { /* reuse in mobile */ }
.mobile-mode-tabs { display: flex; align-items: center; gap: 8px; }
.mobile-mode-tab {
  padding: 8px 18px; border-radius: 7px;
  font-size: 13px; font-weight: 600;
  border: 1.5px solid #bbf7d0; background: #fff; color: #475569;
  cursor: pointer; text-decoration: none; transition: all 0.15s;
  font-family: inherit;
}
.mobile-mode-tab.active { background: #16a34a; color: #fff; border-color: #15803d; }
.mobile-auth-row { display: flex; gap: 10px; }
.mobile-user-row { display: flex; align-items: center; gap: 10px; }
.mobile-user-name { flex: 1; font-size: 14px; font-weight: 600; color: #334155; }
.mobile-account-btn {
  padding: 8px 12px; border-radius: 7px;
  background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d;
  font-size: 13px; font-weight: 700; cursor: pointer;
  transition: background 0.15s; font-family: inherit;
}
.mobile-account-btn:hover { background: #dcfce7; }
.mobile-logout-btn {
  padding: 8px 14px; border-radius: 7px;
  background: #fee2e2; border: none; color: #dc2626;
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: background 0.15s; font-family: inherit;
}
.mobile-logout-btn:hover { background: #fecaca; }

/* ===========================
   RESPONSIVE BREAKPOINTS
=========================== */

/* --- Tablet: 768px - 1199px --- */
@media (max-width: 1199px) {
  .header-top-row { padding: 0 24px; }
  .bottom-inner { padding: 0 24px; }

  /* Hide less-important nav items on tablet */
  .nav-main .nav-sep { display: none; }
  .nav-item { padding: 5px 6px; font-size: 12.5px; }

  /* Shrink utility pill labels */
  .pill-btn { font-size: 11.5px; padding: 5px 6px; }
  .btn-register, .btn-login { padding: 6px 12px; font-size: 12px; }

  /* Hide stat chips when space is tight */
  .stat-chip { display: none; }
  .bottom-offset { width: 40px; }
}

/* --- Mobile: up to 767px --- */
@media (max-width: 767px) {
  .header-placeholder { height: 100px; }
  .header-top-row { padding: 0 16px; height: 58px; }

  /* Show hamburger, hide desktop nav + desktop pills + auth */
  .hamburger-btn { display: flex; }
  .nav-main { display: none; }
  .utility-pill { display: none; }
  .vsep { display: none; }
  .btn-register, .btn-login { display: none; }
  .user-logged-in-container { display: none; }
  /* spacer div between nav and header-right */
  .header-top-row > div[style*="flex:1"] { display: none; }

  /* Bottom bar compact */
  .bottom-inner { padding: 0 16px; height: 38px; }
  .bottom-offset { display: none; }
  .bottom-content { gap: 10px; }
  .stat-chip { display: none; }
  .live-label { font-size: 10.5px; }
  .mode-tab { padding: 4px 10px; font-size: 11.5px; }

  /* Logo size on mobile */
  .logo-img { height: 44px; }
}

/* --- Small mobile: up to 480px --- */
@media (max-width: 480px) {
  .header-top-row { padding: 0 12px; }
  .bottom-inner { padding: 0 12px; }
  .live-label { display: none; } /* save space, keep tabs */
  .mode-tabs { gap: 3px; }
  .mode-tab { padding: 4px 8px; font-size: 11px; }
}
</style>
