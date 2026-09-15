<template>
  <div class="management-screen">
    <header class="mg-header">
      <div>
        <h1>Ports, Terminals & Warehouses</h1>
        <p>Manage seaports, terminals, CFS warehouses, and pricing locations used in FCL setup.</p>
      </div>
      <div class="mg-actions">
        <button class="mg-btn" type="button">Import Excel</button>
        <button class="mg-btn" type="button" @click="api.exportCsv('terminals')">Export Excel</button>
        <button class="mg-btn primary" type="button" @click="openTerminalForm()">Add Port / Terminal</button>
      </div>
    </header>

    <div v-if="notice" class="mg-notice success">{{ notice }}</div>
    <div v-if="error" class="mg-notice error">{{ error }}</div>

    <section class="mg-metrics">
      <article class="mg-card">
        <span class="mg-card-icon blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><circle cx="12" cy="5" r="2"/><path d="M5 12h14"/><path d="M5 12c0 4 3 7 7 7s7-3 7-7"/></svg>
        </span>
        <div><p class="mg-card-label">Seaports</p><div class="mg-card-value">48</div><div class="mg-card-meta">Active 44 &nbsp;.&nbsp; Inactive 4</div></div>
      </article>
      <article class="mg-card">
        <span class="mg-card-icon purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/></svg>
        </span>
        <div><p class="mg-card-label">Terminals</p><div class="mg-card-value">132</div><div class="mg-card-meta">Active 118 &nbsp;.&nbsp; Inactive 14</div></div>
      </article>
      <article class="mg-card">
        <span class="mg-card-icon amber">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V8l7-4 7 4v13"/><path d="M8 12h8"/></svg>
        </span>
        <div><p class="mg-card-label">CFS Warehouses</p><div class="mg-card-value">215</div><div class="mg-card-meta">Active 198 &nbsp;.&nbsp; Inactive 17</div></div>
      </article>
      <article class="mg-card">
        <span class="mg-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17h18"/><path d="M7 17V9h10v8"/><path d="M9 9V5h6v4"/></svg>
        </span>
        <div><p class="mg-card-label">Shipping Lines coverage</p><div class="mg-card-value">56</div><div class="mg-card-meta">Lines supported across all locations</div></div>
      </article>
    </section>

    <section class="mg-grid">
      <article class="mg-panel">
        <div class="mg-tabs">
          <button v-for="tab in assetTabs" :key="tab.id" :class="{ active: activeAssetTab === tab.id }" type="button" @click="setAssetTab(tab.id)">{{ tab.label }}</button>
        </div>
        <div class="mg-toolbar">
          <input v-model.trim="query" class="mg-search" type="search" :placeholder="assetSearchPlaceholder" />
          <button class="mg-btn" type="button">Filters</button>
        </div>
        <div class="mg-table-wrap">
          <table v-if="activeAssetTab === 'seaports'" class="mg-table compact">
            <thead>
              <tr>
                <th>Code</th>
                <th>Seaport</th>
                <th>Country</th>
                <th>City</th>
                <th>Default Zip</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pagedPorts" :key="row.code" :class="{ 'active-row': row.code === selectedCode }" @click="selectedCode = row.code">
                <td>{{ row.code }}</td>
                <td><strong>{{ row.name }}</strong></td>
                <td>{{ countryName(row.countryId) }}</td>
                <td>{{ cityName(row.cityId) }}</td>
                <td>{{ row.defaultZipCode }}</td>
                <td><span class="mg-badge" :class="{ inactive: row.status !== 'ACTIVE' }">{{ row.status }}</span></td>
                <td><button class="mg-icon-btn" type="button">...</button></td>
              </tr>
            </tbody>
          </table>
          <table v-else-if="activeAssetTab === 'warehouses'" class="mg-table compact">
            <thead>
              <tr>
                <th>Code</th>
                <th>Warehouse</th>
                <th>Country</th>
                <th>City</th>
                <th>Type</th>
                <th>Zip Code</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pagedWarehouses" :key="row.code" :class="{ 'active-row': row.code === selectedCode }" @click="selectedCode = row.code">
                <td>{{ row.code }}</td>
                <td><strong>{{ row.name }}</strong></td>
                <td>{{ countryName(row.countryId) }}</td>
                <td>{{ cityName(row.cityId) }}</td>
                <td>{{ row.warehouseType }}</td>
                <td>{{ row.zipCode }}</td>
                <td><span class="mg-badge" :class="{ inactive: row.status !== 'ACTIVE' }">{{ row.status }}</span></td>
                <td><button class="mg-icon-btn" type="button">...</button></td>
              </tr>
            </tbody>
          </table>
          <table v-else class="mg-table compact">
            <thead>
              <tr>
                <th>Code</th>
                <th>Port / Terminal</th>
                <th>Country</th>
                <th>City</th>
                <th>Type</th>
                <th>Linked Warehouse</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pagedTerminals" :key="row.code" :class="{ 'active-row': row.code === selectedCode }" @click="selectedCode = row.code">
                <td>{{ row.code }}</td>
                <td><strong>{{ row.name }}</strong></td>
                <td>{{ countryName(row.countryId) }}</td>
                <td>{{ cityName(row.cityId) }}</td>
                <td>{{ row.terminalType }}</td>
                <td>{{ warehouseName(row.linkedWarehouseId) }}</td>
                <td><span class="mg-badge" :class="{ inactive: row.status !== 'ACTIVE' }">{{ row.status }}</span></td>
                <td><button class="mg-icon-btn" type="button">...</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <footer class="mg-table-footer">
          <span>Showing {{ assetStart }} to {{ assetEnd }} of {{ filteredAssetCount }} {{ activeAssetLabel.toLowerCase() }}</span>
          <div class="mg-pagination">
            <button class="mg-page" type="button" :disabled="assetPage === 1" @click="assetPage--">&lt;</button>
            <button v-for="page in assetPageCount" :key="page" class="mg-page" :class="{ active: page === assetPage }" type="button" @click="assetPage = page">{{ page }}</button>
            <button class="mg-page" type="button" :disabled="assetPage === assetPageCount" @click="assetPage++">&gt;</button>
          </div>
        </footer>
      </article>

      <article class="mg-panel">
        <div class="mg-panel-head">
          <div>
            <div class="mg-panel-title">
              <h2>{{ selectedRow.name }}</h2>
              <span class="mg-badge" :class="{ inactive: selectedRow.status !== 'ACTIVE' }">{{ selectedRow.status }}</span>
            </div>
          </div>
          <div class="mg-actions">
            <button class="mg-btn" type="button" @click="activeAssetTab === 'terminals' && openTerminalForm(selectedTerminal)">Edit</button>
            <button class="mg-btn danger" type="button" @click="inactiveTerminal">Inactive</button>
          </div>
        </div>
        <div class="mg-detail-meta">
          <div><span>Code</span><strong>{{ selectedRow.code }}</strong></div>
          <div><span>Country</span><strong>{{ countryName(selectedRow.countryId) }}</strong></div>
          <div><span>City</span><strong>{{ cityName(selectedRow.cityId) }}</strong></div>
          <div><span>Seaport</span><strong>{{ selectedSeaportName }}</strong></div>
          <div><span>Type</span><strong>{{ selectedTypeLabel }}</strong></div>
        </div>
        <div class="mg-tabs">
          <button v-for="tab in detailTabs" :key="tab.id" :class="{ active: activeDetailTab === tab.id }" type="button" @click="activeDetailTab = tab.id">{{ tab.label }}</button>
        </div>
        <div v-if="activeDetailTab === 'overview'" class="mg-panel-pad">
          <div class="mg-detail-meta" style="padding:0;">
            <div><span>Linked Seaport</span><strong>{{ selectedSeaportName }}</strong></div>
            <div><span>Default Zip Code</span><strong>{{ selectedDefaultZip }}</strong></div>
            <div><span>Pickup City</span><strong>{{ cityName(selectedRow.cityId) }}</strong></div>
            <div><span>Return Location</span><strong>Cat Lai Port</strong></div>
            <div><span>Notes</span><strong>Primary terminal for Ho Chi Minh export/import.</strong></div>
          </div>
        </div>
        <div v-if="activeDetailTab === 'warehouses'" class="mg-panel-pad">
          <h3>Connected CFS Warehouses</h3>
          <div class="mg-table-wrap">
            <table class="mg-table compact">
              <thead><tr><th>Warehouse</th><th>Code</th><th>Zip Code</th><th>Operator</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                <tr v-for="warehouse in connectedWarehouses" :key="warehouse.code">
                  <td>{{ warehouse.name }}</td><td>{{ warehouse.code }}</td><td>{{ warehouse.zipCode }}</td><td>{{ warehouse.operatorName }}</td><td><span class="mg-badge">{{ warehouse.status }}</span></td><td><button class="mg-icon-btn" type="button">...</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="activeDetailTab === 'shipping'" class="mg-panel-pad">
          <h3>Supported Shipping Lines</h3>
          <div class="mg-table-wrap">
            <table class="mg-table compact">
              <thead><tr><th>Shipping Line</th><th>Code</th><th>Alliance</th><th>Coverage</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                <tr v-for="line in shippingLines" :key="line.code">
                  <td>{{ line.name }}</td><td>{{ line.code }}</td><td>{{ line.alliance }}</td><td>{{ line.serviceCoverage }}</td><td><span class="mg-badge">{{ line.status }}</span></td><td><button class="mg-icon-btn" type="button">...</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-if="activeDetailTab === 'coverage'" class="mg-panel-pad">
          <div class="mg-empty">FCL rate coverage for this location will appear here after route rates are assigned.</div>
        </div>
      </article>
    </section>

    <div v-if="terminalModalOpen" class="mg-modal-backdrop" @click.self="terminalModalOpen = false">
      <form class="mg-modal" @submit.prevent="saveTerminal">
        <header><h2>{{ terminalForm.id ? 'Edit Terminal' : 'Add Terminal' }}</h2><button type="button" @click="terminalModalOpen = false">x</button></header>
        <div class="mg-form-grid">
          <label class="mg-field"><span>Code *</span><input v-model.trim="terminalForm.code" class="mg-input" required /></label>
          <label class="mg-field"><span>Name *</span><input v-model.trim="terminalForm.name" class="mg-input" required /></label>
          <label class="mg-field"><span>Country</span><select v-model="terminalForm.countryId" class="mg-select"><option v-for="country in countries" :key="country.id" :value="country.id">{{ country.name }}</option></select></label>
          <label class="mg-field"><span>City</span><select v-model="terminalForm.cityId" class="mg-select"><option v-for="location in locations" :key="location.id" :value="location.id">{{ location.name }}</option></select></label>
          <label class="mg-field"><span>Port</span><select v-model="terminalForm.portId" class="mg-select"><option v-for="port in ports" :key="port.id" :value="port.id">{{ port.name }}</option></select></label>
          <label class="mg-field"><span>Warehouse</span><select v-model="terminalForm.linkedWarehouseId" class="mg-select"><option value="">None</option><option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">{{ warehouse.name }}</option></select></label>
          <label class="mg-field"><span>Default Zip</span><input v-model.trim="terminalForm.defaultZipCode" class="mg-input" /></label>
          <label class="mg-field"><span>Status</span><select v-model="terminalForm.status" class="mg-select"><option>ACTIVE</option><option>INACTIVE</option></select></label>
        </div>
        <footer><button class="mg-btn" type="button" @click="terminalModalOpen = false">Cancel</button><button class="mg-btn primary" type="submit">Save</button></footer>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { Country, Location, Port, ShippingLine, Terminal, Warehouse } from '~/types/logisticsPricing'

const query = ref('')
const selectedCode = ref('CLI-T01')
const activeAssetTab = ref<'seaports' | 'terminals' | 'warehouses'>('terminals')
const activeDetailTab = ref<'overview' | 'shipping' | 'warehouses' | 'coverage'>('overview')
const assetPage = ref(1)
const assetPageSize = 10
const api = useLogisticsPricingApi()
const terminalRows = ref<Terminal[]>([])
const countries = ref<Country[]>([])
const locations = ref<Location[]>([])
const ports = ref<Port[]>([])
const warehouses = ref<Warehouse[]>([])
const shippingLines = ref<ShippingLine[]>([])
const notice = ref('')
const error = ref('')
const terminalModalOpen = ref(false)
const terminalForm = reactive<any>({})
const assetTabs = [
  { id: 'seaports', label: 'Seaports' },
  { id: 'terminals', label: 'Terminals' },
  { id: 'warehouses', label: 'Warehouses' },
] as const
const detailTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'shipping', label: 'Shipping Lines' },
  { id: 'warehouses', label: 'CFS Warehouses' },
  { id: 'coverage', label: 'Rate Coverage' },
] as const

const selectedTerminal = computed(() => terminalRows.value.find((row) => row.code === selectedCode.value) || terminalRows.value[0] || {} as Terminal)
const selectedPort = computed(() => ports.value.find((row) => row.code === selectedCode.value) || ports.value[0] || {} as Port)
const selectedWarehouse = computed(() => warehouses.value.find((row) => row.code === selectedCode.value) || warehouses.value[0] || {} as Warehouse)
const selectedRow = computed<any>(() => {
  if (activeAssetTab.value === 'seaports') return selectedPort.value
  if (activeAssetTab.value === 'warehouses') return selectedWarehouse.value
  return selectedTerminal.value
})

const filteredTerminals = computed(() => {
  const value = query.value.toLowerCase()
  if (!value) return terminalRows.value
  return terminalRows.value.filter((row) => [row.code, row.name, countryName(row.countryId), cityName(row.cityId), row.terminalType].some((item) => String(item || '').toLowerCase().includes(value)))
})
const filteredPorts = computed(() => {
  const value = query.value.toLowerCase()
  if (!value) return ports.value
  return ports.value.filter((row) => [row.code, row.name, countryName(row.countryId), cityName(row.cityId), row.type].some((item) => String(item || '').toLowerCase().includes(value)))
})
const filteredWarehouses = computed(() => {
  const value = query.value.toLowerCase()
  if (!value) return warehouses.value
  return warehouses.value.filter((row) => [row.code, row.name, countryName(row.countryId), cityName(row.cityId), row.warehouseType].some((item) => String(item || '').toLowerCase().includes(value)))
})
const activeAssetItems = computed(() => {
  if (activeAssetTab.value === 'seaports') return filteredPorts.value
  if (activeAssetTab.value === 'warehouses') return filteredWarehouses.value
  return filteredTerminals.value
})
const assetPageCount = computed(() => Math.max(1, Math.ceil(activeAssetItems.value.length / assetPageSize)))
const pagedTerminals = computed(() => filteredTerminals.value.slice((assetPage.value - 1) * assetPageSize, assetPage.value * assetPageSize))
const pagedPorts = computed(() => filteredPorts.value.slice((assetPage.value - 1) * assetPageSize, assetPage.value * assetPageSize))
const pagedWarehouses = computed(() => filteredWarehouses.value.slice((assetPage.value - 1) * assetPageSize, assetPage.value * assetPageSize))
const filteredAssetCount = computed(() => activeAssetItems.value.length)
const assetStart = computed(() => filteredAssetCount.value ? (assetPage.value - 1) * assetPageSize + 1 : 0)
const assetEnd = computed(() => Math.min(assetPage.value * assetPageSize, filteredAssetCount.value))
const activeAssetLabel = computed(() => assetTabs.find((tab) => tab.id === activeAssetTab.value)?.label || 'Items')
const assetSearchPlaceholder = computed(() => `Search ${activeAssetLabel.value.toLowerCase()}, city, country...`)

const countryName = (id?: string) => countries.value.find((item) => item.id === id)?.name || ''
const cityName = (id?: string) => locations.value.find((item) => item.id === id)?.name || ''
const warehouseName = (id?: string) => warehouses.value.find((item) => item.id === id)?.name || '-'
const portName = (id?: string) => ports.value.find((item) => item.id === id)?.name || '-'
const selectedSeaportName = computed(() => activeAssetTab.value === 'terminals' ? portName(selectedTerminal.value.portId) : activeAssetTab.value === 'seaports' ? selectedPort.value.name : portName(terminals.value.find((terminal) => terminal.id === selectedWarehouse.value.terminalId)?.portId))
const selectedTypeLabel = computed(() => selectedRow.value.terminalType || selectedRow.value.type || selectedRow.value.warehouseType || '-')
const selectedDefaultZip = computed(() => selectedRow.value.defaultZipCode || selectedRow.value.zipCode || '-')

const connectedWarehouses = computed(() => warehouses.value.filter((item) => item.terminalId === selectedRow.value.id || item.id === selectedRow.value.linkedWarehouseId))

const setAssetTab = (tab: 'seaports' | 'terminals' | 'warehouses') => {
  activeAssetTab.value = tab
  assetPage.value = 1
  activeDetailTab.value = 'overview'
  if (tab === 'seaports') selectedCode.value = filteredPorts.value[0]?.code || ''
  else if (tab === 'warehouses') selectedCode.value = filteredWarehouses.value[0]?.code || ''
  else selectedCode.value = filteredTerminals.value[0]?.code || ''
}

const loadData = async () => {
  try {
    error.value = ''
    ;[terminalRows.value, countries.value, locations.value, ports.value, warehouses.value, shippingLines.value] = await Promise.all([
      api.list<Terminal>('terminals'),
      api.list<Country>('countries'),
      api.list<Location>('locations'),
      api.list<Port>('ports'),
      api.list<Warehouse>('warehouses'),
      api.list<ShippingLine>('shipping-lines'),
    ])
    if (!terminalRows.value.some((item) => item.code === selectedCode.value)) selectedCode.value = terminalRows.value[0]?.code || ''
  } catch (err: any) {
    error.value = err.message || 'Cannot load terminals'
  }
}

const openTerminalForm = (item?: Terminal) => {
  Object.assign(terminalForm, item ? { ...item } : { id: undefined, code: '', name: '', terminalType: 'SEA', countryId: countries.value[0]?.id || '', cityId: locations.value[0]?.id || '', portId: ports.value[0]?.id || '', linkedWarehouseId: '', defaultZipCode: '', status: 'ACTIVE' })
  terminalModalOpen.value = true
}

const saveTerminal = async () => {
  try {
    const body = { ...terminalForm, terminalType: 'SEA' }
    const saved = body.id ? await api.update<Terminal>('terminals', body.id, body) : await api.create<Terminal>('terminals', body)
    selectedCode.value = saved.code
    terminalModalOpen.value = false
    notice.value = 'Terminal saved.'
    await loadData()
  } catch (err: any) {
    error.value = err.message || 'Cannot save terminal'
  }
}

const inactiveTerminal = async () => {
  if (!selectedRow.value.id) return
  if (activeAssetTab.value === 'terminals') await api.remove<Terminal>('terminals', selectedRow.value.id)
  else if (activeAssetTab.value === 'seaports') await api.remove<Port>('ports', selectedRow.value.id)
  else await api.remove<Warehouse>('warehouses', selectedRow.value.id)
  notice.value = `${activeAssetLabel.value.slice(0, -1)} marked inactive.`
  await loadData()
}

onMounted(loadData)

watch(query, () => { assetPage.value = 1 })
watch(assetPageCount, (count) => { if (assetPage.value > count) assetPage.value = count })
</script>

<style src="~/assets/css/fcl-admin-management.css"></style>
