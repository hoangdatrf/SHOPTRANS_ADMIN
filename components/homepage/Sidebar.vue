<template>
  <aside class="sidebar" :class="{ collapsed: isSidebarCollapsed }">
    <div class="sidebar-title">
      <i class="fas fa-network-wired"></i>
      <span class="sidebar-title-text">HUB MANAGE</span>
      <button class="sidebar-toggle" @click="toggleSidebar">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <nav class="sidebar-nav">
      <NuxtLink to="/" class="sidebar-item" :class="{ active: isHomepage }" data-tooltip="Homepage">
        <i class="fas fa-home"></i>
        <span class="sidebar-item-text">Homepage</span>
      </NuxtLink>
      <NuxtLink to="/products" class="sidebar-item" :class="{ active: isProductsPage }" data-tooltip="Our products">
        <i class="fas fa-boxes"></i>
        <span class="sidebar-item-text">Our products</span>
      </NuxtLink>
      <NuxtLink to="/solutions" class="sidebar-item" :class="{ active: isSolutionsPage }" data-tooltip="Solutions">
        <i class="fas fa-cogs"></i>
        <span class="sidebar-item-text">Solutions</span>
      </NuxtLink>
      <a href="#" class="sidebar-item" data-tooltip="Business hub">
        <i class="fas fa-sync-alt"></i>
        <span class="sidebar-item-text">Business hub</span>
      </a>
      <a href="#" class="sidebar-item" data-tooltip="Track to trace">
        <i class="fas fa-truck"></i>
        <span class="sidebar-item-text">Track to trace</span>
      </a>
      <a href="#" class="sidebar-item" data-tooltip="Finance task">
        <i class="fas fa-coins"></i>
        <span class="sidebar-item-text">Finance task</span>
      </a>
      <NuxtLink to="/local-information" class="sidebar-item" :class="{ active: isLocalInfoPage }" data-tooltip="Local information">
        <i class="fas fa-globe"></i>
        <span class="sidebar-item-text">Local information</span>
      </NuxtLink>
      <a href="#" class="sidebar-item" data-tooltip="Support">
        <i class="fas fa-headset"></i>
        <span class="sidebar-item-text">Support</span>
      </a>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  isCollapsed: boolean
}>()

const emit = defineEmits<{
  'update:isCollapsed': [value: boolean]
}>()

const route = useRoute()

const isSidebarCollapsed = computed({
  get: () => props.isCollapsed,
  set: (value) => emit('update:isCollapsed', value)
})

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const isHomepage = computed(() => route.path === '/')
const isProductsPage = computed(() => route.path === '/products')
const isSolutionsPage = computed(() => route.path === '/solutions')
const isLocalInfoPage = computed(() => route.path === '/local-information')
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 120px;
  left: 0;
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  color: #000000;
  padding: 1.5rem 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0 0 6px 0;
  z-index: 1002 !important;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  transition: opacity 0.25s ease, transform 0.25s ease;
  visibility: visible;
}

.sidebar.collapsed {
  opacity: 0;
  transform: translateX(-100%);
  pointer-events: none;
  visibility: hidden;
}

.sidebar-title {
  padding: 0 1.5rem 1.5rem;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #00c3ff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-title i {
  font-size: 18px;
  color: #00c3ff;
}

.sidebar-toggle {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: #000000;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: auto;
}

.sidebar-toggle:hover {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(0, 0, 0, 0.3);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 1.5rem;
  color: rgba(0, 0, 0, 0.85);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  background: transparent;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.sidebar-item i {
  width: 28px;
  height: 28px;
  text-align: center;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-item:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #000000;
  border-left-color: rgba(0, 0, 0, 0.4);
}

.sidebar-item.active {
  background: rgba(0, 0, 0, 0.1);
  color: #000000;
  font-weight: 600;
  border-left-color: #ff6b35;
}

.sidebar-item.active i {
  color: #ff6b35;
}
</style>

