<!-- layouts/homepage.vue -->
<template>
  <div class="homepage-layout" :class="{ 'is-scrollable-page': isScrollablePage }">
    <div class="header-hero-container">
      <HomepageHeader />
    </div>

    <button
      v-if="isLoggedIn && isSidebarCollapsed"
      class="sidebar-floating-toggle hidden-temporarily"
      type="button"
      @click="toggleSidebar"
    >
      <i class="fas fa-bars"></i>
    </button>

    <HomepageSidebar
      v-if="isLoggedIn"
      class="hidden-temporarily"
      :is-collapsed="isSidebarCollapsed"
      @update:is-collapsed="isSidebarCollapsed = $event"
    />

    <div class="main-container">
      <main class="content">
        <slot />
      </main>
      <HomepageFooter />
    </div>

    <HomepageSupportButton />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/store/user'

const route = useRoute()
const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.token)

const DASHBOARD_PATHS = [
  '/fcl',
  '/lcl',
  '/bookings',
  '/shipment-detail',
  '/shipment-journey',
  '/submit-si',
  '/support',
  '/finance-task',
]

const isScrollablePage = computed(() => {
  const path = route.path
  return !DASHBOARD_PATHS.some(prefix => path.startsWith(prefix))
})

const isSidebarCollapsed = ref(true)

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}
</script>

<style scoped>
.homepage-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
  background: #ffffff;
}

.homepage-layout.is-scrollable-page {
  overflow-x: clip;
}

.header-hero-container {
  position: relative;
  z-index: 1;
  width: 100%;
  overflow: visible;
  background: #ffffff;
  contain: none;
}

.main-container {
  position: relative;
  z-index: 0;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.content {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}

.is-scrollable-page .content {
  overflow-y: visible;
}

.hidden-temporarily {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  z-index: -1 !important;
}

.sidebar-floating-toggle {
  position: fixed;
  top: 130px;
  left: 20px;
  z-index: 1002 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 1px solid rgba(0, 195, 255, 0.5);
  border-radius: 8px;
  background: rgba(0, 195, 255, 0.25);
  color: #00c3ff;
  box-shadow: 0 4px 12px rgba(0, 195, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.sidebar-floating-toggle:hover {
  border-color: rgba(0, 195, 255, 0.7);
  background: rgba(0, 195, 255, 0.35);
  box-shadow: 0 6px 16px rgba(0, 195, 255, 0.4);
  transform: scale(1.05);
}

.sidebar-floating-toggle i {
  font-size: 22px;
}
</style>
