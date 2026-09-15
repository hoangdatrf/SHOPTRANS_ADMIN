<template>
  <div class="sidebar-shell" :class="{ collapsed }">
    <aside class="sidebar">
      <div class="sb-stats">
      <div class="sb-stat sb-tooltip-wrap" data-tip="Active Shipments">
        <div class="sb-stat-num green">3</div>
        <div class="sb-stat-label">Active<br>Shipments</div>
        <div class="sb-tooltip">Active Shipments</div>
      </div>
      <div class="sb-stat sb-tooltip-wrap" data-tip="Pending Tasks">
        <div class="sb-stat-num orange">1</div>
        <div class="sb-stat-label">Pending<br>Tasks</div>
        <div class="sb-tooltip">Pending Tasks</div>
      </div>
      <div class="sb-stat sb-tooltip-wrap" data-tip="Unpaid Invoices">
        <div class="sb-stat-num red">2</div>
        <div class="sb-stat-label">Unpaid<br>Invoices</div>
        <div class="sb-tooltip">Unpaid Invoices</div>
      </div>
      <div class="sb-stat sb-tooltip-wrap" data-tip="Open Tickets">
        <div class="sb-stat-num muted">0</div>
        <div class="sb-stat-label">Open<br>Tickets</div>
        <div class="sb-tooltip">Open Tickets</div>
      </div>
    </div>

    <div class="sb-section">
      <div class="sb-section-label">Operations</div>
      <NuxtLink to="/bookings" class="sb-nav-item" :class="{ active: activeMenu === 'bookings' }" style="text-decoration:none;">
        <span class="sb-nav-icon">📦</span>
        Business Hub
      </NuxtLink>
    </div>
    <div class="sb-section">
      <div class="sb-section-label">Finance</div>
      <NuxtLink to="/finance-task" class="sb-nav-item" :class="{ active: activeMenu === 'finance' }" style="text-decoration:none;">
        <span class="sb-nav-icon">💰</span>
        Financial Status
      </NuxtLink>
    </div>
    <div class="sb-section">
      <div class="sb-section-label">Help</div>
      <NuxtLink to="/support" class="sb-nav-item" :class="{ active: activeMenu === 'support' }" style="text-decoration:none;">
        <span class="sb-nav-icon">🎧</span>
        Instant Support
      </NuxtLink>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  activeMenu: {
    type: String,
    default: 'bookings'
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const collapsed = computed(() => props.modelValue)
</script>

<style scoped>
.sidebar-shell {
  --sb-green: #15803d;
  --sb-green-lt: #f0fdf4;
  --sb-orange: #ea580c;
  --sb-red: #dc2626;
  --sb-gray: #6b7280;
  --sb-gray-lt: #9ca3af;
  --sb-gray-50: #f9fafb;
  --sb-gray-200: #e5e7eb;
  --sb-dark: #111827;
  box-sizing: border-box;
  font-family: 'DM Sans', sans-serif;
  width: var(--sidebar-w, 200px);
  min-width: var(--sidebar-w, 200px);
  flex: 0 0 var(--sidebar-w, 200px);
  align-self: flex-start;
  height: calc(100vh - var(--app-header-h, 112px));
  height: calc(100dvh - var(--app-header-h, 112px));
  min-height: calc(100vh - var(--app-header-h, 112px));
  min-height: calc(100dvh - var(--app-header-h, 112px));
  max-height: calc(100vh - var(--app-header-h, 112px));
  max-height: calc(100dvh - var(--app-header-h, 112px));
  transition: width .22s ease, min-width .22s ease, flex-basis .22s ease;
}

.sidebar {
  box-sizing: border-box;
  font-family: 'DM Sans', sans-serif;
  position: fixed;
  top: var(--app-header-h, 112px);
  left: 0;
  width: var(--sidebar-w, 200px);
  height: calc(100vh - var(--app-header-h, 112px));
  height: calc(100dvh - var(--app-header-h, 112px));
  max-height: calc(100vh - var(--app-header-h, 112px));
  max-height: calc(100dvh - var(--app-header-h, 112px));
  background: #fff;
  border-right: 1px solid var(--sb-gray-200);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  box-shadow: 2px 0 10px rgba(0, 0, 0, .04);
  transition: width .22s ease, padding .22s ease;
  z-index: 1000;
  gap: 8px;
  padding: 10px 0 8px;
}

.sidebar-shell,
.sidebar-shell * {
  font-family: 'DM Sans', sans-serif !important;
}

.sidebar-shell.collapsed {
  width: 0 !important;
  min-width: 0 !important;
  flex-basis: 0 !important;
}

.sidebar-shell.collapsed .sidebar {
  width: 0 !important;
  border-right: none;
  box-shadow: none;
  padding: 0;
  overflow: hidden;
}

.sidebar-shell.collapsed .sidebar > * {
  visibility: hidden;
  pointer-events: none;
}

.sb-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid var(--sb-gray-200);
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  grid-template-rows: repeat(2, 74px);
  margin: 0 10px;
}

.sb-stat {
  position: relative;
  text-align: center;
  padding: 9px 4px;
  border-right: 1px solid var(--sb-gray-200);
  border-bottom: 1px solid var(--sb-gray-200);
  background: #fff;
  cursor: pointer;
  transition: background .15s;
  box-sizing: border-box;
  min-height: 74px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sb-stat:hover {
  background: var(--sb-gray-50);
}

.sb-stat:nth-child(2n) {
  border-right: none;
}

.sb-stat:nth-last-child(-n+2) {
  border-bottom: none;
}

.sb-stat-num {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
}

.sb-stat-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--sb-dark);
  line-height: 1.25;
  white-space: normal;
}

.sb-stat-num.green { color: #15803d; }
.sb-stat-num.orange { color: #ea580c; }
.sb-stat-num.red { color: #dc2626; }
.sb-stat-num.muted { color: #9ca3af; }

.sb-tooltip-wrap {
  overflow: visible !important;
}

.sb-tooltip {
  display: none;
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 5px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .2);
}

.sb-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #1f2937;
}

.sb-tooltip-wrap:hover .sb-tooltip {
  display: block;
}

.sb-section {
  padding: 6px 0 2px;
  flex: 0 0 auto;
}

.sb-section-label {
  font-size: 9px;
  font-weight: 700;
  color: var(--sb-gray-lt);
  letter-spacing: .1em;
  text-transform: uppercase;
  padding: 0 14px 6px;
  min-height: 18px;
  display: flex;
  align-items: center;
}

.sb-nav-item {
  border-radius: 9px;
  display: flex;
  align-items: center;
  gap: 9px;
  width: calc(100% - 0px);
  box-sizing: border-box;
  margin: 0 8px;
  padding: 9px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--sb-gray);
  transition: all .15s;
  white-space: nowrap;
  min-height: 40px;
  flex: 0 0 auto;
}

.sb-nav-item:hover {
  background: var(--sb-green-lt);
  color: var(--sb-green);
}

.sb-nav-item.active {
  background: var(--sb-green);
  color: #fff;
  font-weight: 700;
}

.sb-nav-icon {
  font-size: 15px;
  flex-shrink: 0;
}

.sb-badge {
  min-width: 18px;
  height: 18px;
  border-radius: 999px;
  background: var(--sb-orange);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  padding: 0 5px;
}

.sb-badge.rb {
  background: var(--sb-red);
}
</style>
