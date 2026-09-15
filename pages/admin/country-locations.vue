<template>
  <div class="management-screen">
    <header class="mg-header">
      <div>
        <h1>Country & Location Management</h1>
        <p>Manage countries, provinces / cities, post codes and pricing locations.</p>
      </div>
      <div class="mg-actions">
        <button class="mg-btn" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 21h14"/></svg>
          Import Excel
        </button>
        <button class="mg-btn" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9"/><path d="m7 16 5 5 5-5"/><path d="M5 3h14"/></svg>
          Export Excel
        </button>
        <button class="mg-btn primary" type="button" @click="openCountryForm()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Add Country
        </button>
      </div>
    </header>

    <div v-if="notice" class="mg-notice success">{{ notice }}</div>
    <div v-if="error" class="mg-notice error">{{ error }}</div>

    <section class="mg-metrics with-next">
      <article class="mg-card">
        <span class="mg-card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3 3.4 3 14.6 0 18"/><path d="M12 3c-3 3.4-3 14.6 0 18"/></svg>
        </span>
        <div>
          <p class="mg-card-label">Countries</p>
          <div class="mg-card-value">32</div>
          <div class="mg-card-meta">Active 28 &nbsp;.&nbsp; Inactive 4</div>
        </div>
      </article>
      <article class="mg-card">
        <span class="mg-card-icon blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/><path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01"/></svg>
        </span>
        <div>
          <p class="mg-card-label">Provinces / Cities</p>
          <div class="mg-card-value">486</div>
          <div class="mg-card-meta">Active 451 &nbsp;.&nbsp; Inactive 35</div>
        </div>
      </article>
      <article class="mg-card">
        <span class="mg-card-icon purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><circle cx="12" cy="5" r="2"/><path d="M5 12h14"/><path d="M5 12c0 4 3 7 7 7s7-3 7-7"/><path d="M5 12l-2-2M19 12l2-2"/></svg>
        </span>
        <div>
          <p class="mg-card-label">Ports & Terminals</p>
          <div class="mg-card-value">128</div>
          <div class="mg-card-meta">Active 118 &nbsp;.&nbsp; Inactive 10</div>
        </div>
      </article>
      <article class="mg-card">
        <span class="mg-card-icon amber">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V8l7-4 7 4v13"/><path d="M9 21v-8h6v8"/><path d="M8 10h8"/></svg>
        </span>
        <div>
          <p class="mg-card-label">Warehouses</p>
          <div class="mg-card-value">215</div>
          <div class="mg-card-meta">Active 198 &nbsp;.&nbsp; Inactive 17</div>
        </div>
      </article>
      <article class="mg-next">
        <span class="mg-badge">Next Step</span>
        <strong>Set up FCL Pricing</strong>
        <small>Create rate records for your locations to start quoting.</small>
        <NuxtLink class="mg-btn success-outline" to="/admin/fcl-rates">Go to FCL Rates</NuxtLink>
      </article>
    </section>

    <section class="mg-grid">
      <article class="mg-panel">
        <div class="mg-toolbar">
          <input v-model.trim="countryQuery" class="mg-search" type="search" placeholder="Search country, code, region..." />
          <button class="mg-btn" type="button">Filters</button>
        </div>
        <div class="mg-table-wrap">
          <table class="mg-table compact">
            <thead>
              <tr>
                <th>Code</th>
                <th>Country</th>
                <th>Region</th>
                <th>Currency</th>
                <th>Ports</th>
                <th>Warehouses</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="country in pagedCountries" :key="country.code" :class="{ 'active-row': country.code === selectedCountry.code }" @click="selectCountry(country.code)">
                <td>{{ country.code }}</td>
                <td><span class="mg-flag">{{ countryFlag(country.code) }}</span> <strong>{{ country.name }}</strong></td>
                <td>{{ country.region }}</td>
                <td>{{ country.currencyCode }}</td>
                <td>{{ portsByCountry(country.id).length }}</td>
                <td>{{ warehousesByCountry(country.id).length }}</td>
                <td><span class="mg-badge" :class="{ inactive: country.status !== 'ACTIVE' }">{{ country.status }}</span></td>
                <td><button class="mg-icon-btn" type="button" aria-label="More actions">...</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <footer class="mg-table-footer">
          <span>Showing {{ countryStart }} to {{ countryEnd }} of {{ filteredCountries.length }} countries</span>
          <div class="mg-pagination">
            <button class="mg-page" type="button" :disabled="countryPage === 1" @click="countryPage--">&lt;</button>
            <button v-for="page in countryPageCount" :key="page" class="mg-page" :class="{ active: page === countryPage }" type="button" @click="countryPage = page">{{ page }}</button>
            <button class="mg-page" type="button" :disabled="countryPage === countryPageCount" @click="countryPage++">&gt;</button>
          </div>
        </footer>
      </article>

      <article class="mg-panel">
        <div class="mg-panel-head">
          <div class="mg-panel-title">
            <span class="mg-flag">{{ countryFlag(selectedCountry.code) }}</span>
            <h2>{{ selectedCountry.name }}</h2>
            <span class="mg-badge" :class="{ inactive: selectedCountry.status !== 'ACTIVE' }">{{ selectedCountry.status }}</span>
          </div>
          <div class="mg-actions">
            <button class="mg-btn" type="button" @click="openCountryForm(selectedCountry)">Edit</button>
            <button class="mg-btn danger" type="button" @click="inactiveCountry">Inactive</button>
          </div>
        </div>
        <div class="mg-detail-meta">
          <div><span>Code</span><strong>{{ selectedCountry.code }}</strong></div>
          <div><span>Region</span><strong>{{ selectedCountry.region }}</strong></div>
          <div><span>Currency</span><strong>{{ selectedCountry.currencyCode }}</strong></div>
          <div><span>Ports</span><strong>{{ selectedPorts.length }}</strong></div>
          <div><span>Warehouses</span><strong>{{ selectedWarehouses.length }}</strong></div>
        </div>
        <div class="mg-tabs">
          <button v-for="tab in countryTabs" :key="tab.id" :class="{ active: activeCountryTab === tab.id }" type="button" @click="setCountryTab(tab.id)">{{ tab.label }}</button>
        </div>
        <div v-if="activeCountryTab === 'locations'" class="mg-toolbar">
          <input v-model.trim="locationQuery" class="mg-search" type="search" placeholder="Search province, city or zip code..." />
          <button class="mg-btn" type="button">Import Excel</button>
          <button class="mg-btn primary" type="button" @click="openLocationForm()">Add Province / City</button>
        </div>
        <div v-if="activeCountryTab === 'locations'" class="mg-table-wrap">
          <table class="mg-table compact">
            <thead>
              <tr>
                <th>No.</th>
                <th>Province / City</th>
                <th>Zip Code</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(location, index) in pagedLocations" :key="location.code">
                <td>{{ locationStart + index }}</td>
                <td>{{ location.name }}</td>
                <td>{{ location.zipCode }}</td>
                <td>{{ location.type }}</td>
                <td><span class="mg-badge">{{ location.status }}</span></td>
                <td>
                  <button class="mg-icon-btn" type="button" aria-label="Edit location" @click="openLocationForm(location)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.8 2.8 0 0 1 4 4L8 20l-5 1 1-5Z"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="activeCountryTab === 'ports'" class="mg-table-wrap">
          <table class="mg-table compact">
            <thead>
              <tr><th>Code</th><th>Port / Terminal</th><th>City</th><th>Type</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedPortTerminalRows" :key="item.key">
                <td>{{ item.code }}</td><td><strong>{{ item.name }}</strong></td><td>{{ item.city }}</td><td>{{ item.type }}</td><td><span class="mg-badge" :class="{ inactive: item.status !== 'ACTIVE' }">{{ item.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="activeCountryTab === 'warehouses'" class="mg-table-wrap">
          <table class="mg-table compact">
            <thead>
              <tr><th>Code</th><th>Warehouse</th><th>City</th><th>Type</th><th>Zip Code</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-for="warehouse in selectedWarehouses" :key="warehouse.id">
                <td>{{ warehouse.code }}</td><td><strong>{{ warehouse.name }}</strong></td><td>{{ cityName(warehouse.cityId) }}</td><td>{{ warehouse.warehouseType }}</td><td>{{ warehouse.zipCode }}</td><td><span class="mg-badge" :class="{ inactive: warehouse.status !== 'ACTIVE' }">{{ warehouse.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="activeCountryTab === 'shipping'" class="mg-table-wrap">
          <table class="mg-table compact">
            <thead>
              <tr><th>Code</th><th>Shipping Line</th><th>Alliance</th><th>Coverage</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr v-for="line in shippingLines" :key="line.id">
                <td>{{ line.code }}</td><td><strong>{{ line.name }}</strong></td><td>{{ line.alliance || '-' }}</td><td>{{ line.serviceCoverage }}</td><td><span class="mg-badge" :class="{ inactive: line.status !== 'ACTIVE' }">{{ line.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="mg-panel-pad">
          <div class="mg-empty">FCL rate coverage will be shown here after rates are assigned to this country.</div>
        </div>
        <footer v-if="activeCountryTab === 'locations'" class="mg-table-footer">
          <span>Showing {{ locationStart }} to {{ locationEnd }} of {{ filteredLocations.length }} provinces / cities</span>
          <div class="mg-pagination">
            <button class="mg-page" type="button" :disabled="locationPage === 1" @click="locationPage--">&lt;</button>
            <button v-for="page in locationPageCount" :key="page" class="mg-page" :class="{ active: page === locationPage }" type="button" @click="locationPage = page">{{ page }}</button>
            <button class="mg-page" type="button" :disabled="locationPage === locationPageCount" @click="locationPage++">&gt;</button>
          </div>
        </footer>
      </article>
    </section>

    <div v-if="countryModalOpen" class="mg-modal-backdrop" @click.self="countryModalOpen = false">
      <form class="mg-modal" @submit.prevent="saveCountry">
        <header><h2>{{ countryForm.id ? 'Edit Country' : 'Add Country' }}</h2><button type="button" @click="countryModalOpen = false">x</button></header>
        <div class="mg-form-grid">
          <label class="mg-field"><span>Code *</span><input v-model.trim="countryForm.code" class="mg-input" required /></label>
          <label class="mg-field"><span>Name *</span><input v-model.trim="countryForm.name" class="mg-input" required /></label>
          <label class="mg-field"><span>Region</span><input v-model.trim="countryForm.region" class="mg-input" /></label>
          <label class="mg-field"><span>Currency</span><input v-model.trim="countryForm.currencyCode" class="mg-input" /></label>
          <label class="mg-field"><span>Status</span><select v-model="countryForm.status" class="mg-select"><option>ACTIVE</option><option>INACTIVE</option></select></label>
          <label class="mg-field" style="grid-column:1/-1;"><span>Note</span><input v-model.trim="countryForm.note" class="mg-input" /></label>
        </div>
        <footer><button class="mg-btn" type="button" @click="countryModalOpen = false">Cancel</button><button class="mg-btn primary" type="submit">Save</button></footer>
      </form>
    </div>

    <div v-if="locationModalOpen" class="mg-modal-backdrop" @click.self="locationModalOpen = false">
      <form class="mg-modal" @submit.prevent="saveLocation">
        <header><h2>{{ locationForm.id ? 'Edit Location' : 'Add Location' }}</h2><button type="button" @click="locationModalOpen = false">x</button></header>
        <div class="mg-form-grid">
          <label class="mg-field"><span>Code *</span><input v-model.trim="locationForm.code" class="mg-input" required /></label>
          <label class="mg-field"><span>Name *</span><input v-model.trim="locationForm.name" class="mg-input" required /></label>
          <label class="mg-field"><span>Type</span><select v-model="locationForm.type" class="mg-select"><option>CITY</option><option>PROVINCE</option></select></label>
          <label class="mg-field"><span>Zip / Post Code</span><input v-model.trim="locationForm.zipCode" class="mg-input" /></label>
          <label class="mg-field"><span>Status</span><select v-model="locationForm.status" class="mg-select"><option>ACTIVE</option><option>INACTIVE</option></select></label>
        </div>
        <div class="mg-checks" style="margin-top:16px;">
          <label class="mg-check"><input v-model="locationForm.isPickupLocation" type="checkbox" />Pickup</label>
          <label class="mg-check"><input v-model="locationForm.isPolPodLocation" type="checkbox" />POL/POD</label>
          <label class="mg-check"><input v-model="locationForm.isCfsLocation" type="checkbox" />CFS</label>
          <label class="mg-check"><input v-model="locationForm.isReturnLocation" type="checkbox" />Return Location</label>
        </div>
        <footer><button class="mg-btn" type="button" @click="locationModalOpen = false">Cancel</button><button class="mg-btn primary" type="submit">Save</button></footer>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { watch } from 'vue'
import type { Country, Location, Port, ShippingLine, Terminal, Warehouse } from '~/types/logisticsPricing'

const countryQuery = ref('')
const locationQuery = ref('')
const selectedCode = ref('VN')
const countries = ref<Country[]>([])
const locations = ref<Location[]>([])
const ports = ref<Port[]>([])
const terminals = ref<Terminal[]>([])
const warehouses = ref<Warehouse[]>([])
const shippingLines = ref<ShippingLine[]>([])
const notice = ref('')
const error = ref('')
const countryModalOpen = ref(false)
const locationModalOpen = ref(false)
const api = useLogisticsPricingApi()
const countryPage = ref(1)
const countryPageSize = 8
const locationPage = ref(1)
const locationPageSize = 6
const activeCountryTab = ref('locations')

const countryTabs = [
  { id: 'locations', label: 'Provinces / Cities' },
  { id: 'ports', label: 'Ports & Terminals' },
  { id: 'warehouses', label: 'Warehouses' },
  { id: 'shipping', label: 'Shipping Lines' },
  { id: 'coverage', label: 'Rate Coverage' },
] as const

const countryForm = reactive<Partial<Country>>({ status: 'ACTIVE' })
const locationForm = reactive<Partial<Location>>({ type: 'CITY', status: 'ACTIVE', isPickupLocation: true, isPolPodLocation: true, isCfsLocation: false, isReturnLocation: true })

const selectedCountry = computed(() => countries.value.find((country) => country.code === selectedCode.value) || countries.value[0] || {} as Country)

const filteredCountries = computed(() => {
  const query = countryQuery.value.toLowerCase()
  if (!query) return countries.value
  return countries.value.filter((country) =>
    [country.code, country.name, country.region, country.currencyCode].some((value) => value.toLowerCase().includes(query)),
  )
})

const countryPageCount = computed(() => Math.max(1, Math.ceil(filteredCountries.value.length / countryPageSize)))
const pagedCountries = computed(() => filteredCountries.value.slice((countryPage.value - 1) * countryPageSize, countryPage.value * countryPageSize))
const countryStart = computed(() => filteredCountries.value.length ? (countryPage.value - 1) * countryPageSize + 1 : 0)
const countryEnd = computed(() => Math.min(countryPage.value * countryPageSize, filteredCountries.value.length))

const filteredLocations = computed(() => {
  const query = locationQuery.value.toLowerCase()
  const source = locations.value.filter((location) => location.countryId === selectedCountry.value.id)
  if (!query) return source
  return source.filter((location) =>
    [location.name, location.code, location.zipCode, location.type].some((value) => value.toLowerCase().includes(query)),
  )
})

const locationPageCount = computed(() => Math.max(1, Math.ceil(filteredLocations.value.length / locationPageSize)))
const pagedLocations = computed(() => filteredLocations.value.slice((locationPage.value - 1) * locationPageSize, locationPage.value * locationPageSize))
const locationStart = computed(() => filteredLocations.value.length ? (locationPage.value - 1) * locationPageSize + 1 : 0)
const locationEnd = computed(() => Math.min(locationPage.value * locationPageSize, filteredLocations.value.length))

const countryFlag = (code?: string) => {
  const normalized = String(code || '').trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(normalized)) return normalized || '-'
  return String.fromCodePoint(...normalized.split('').map((char) => 127397 + char.charCodeAt(0)))
}

const selectCountry = (code: string) => {
  selectedCode.value = code
  locationPage.value = 1
}

const setCountryTab = (tab: string) => {
  activeCountryTab.value = tab
}

const portsByCountry = (countryId?: string) => ports.value.filter((port) => port.countryId === countryId)
const warehousesByCountry = (countryId?: string) => warehouses.value.filter((warehouse) => warehouse.countryId === countryId)
const cityName = (id?: string) => locations.value.find((location) => location.id === id)?.name || '-'
const selectedPorts = computed(() => portsByCountry(selectedCountry.value.id))
const selectedWarehouses = computed(() => warehousesByCountry(selectedCountry.value.id))
const selectedPortTerminalRows = computed(() => [
  ...selectedPorts.value.map((port) => ({ key: `port-${port.id}`, code: port.code, name: port.name, city: cityName(port.cityId), type: port.type, status: port.status })),
  ...terminals.value.filter((terminal) => terminal.countryId === selectedCountry.value.id).map((terminal) => ({ key: `terminal-${terminal.id}`, code: terminal.code, name: terminal.name, city: cityName(terminal.cityId), type: terminal.terminalType, status: terminal.status })),
])

const loadData = async () => {
  try {
    error.value = ''
    ;[countries.value, locations.value, ports.value, terminals.value, warehouses.value, shippingLines.value] = await Promise.all([
      api.list<Country>('countries'),
      api.list<Location>('locations'),
      api.list<Port>('ports'),
      api.list<Terminal>('terminals'),
      api.list<Warehouse>('warehouses'),
      api.list<ShippingLine>('shipping-lines'),
    ])
    if (!countries.value.some((country) => country.code === selectedCode.value)) selectedCode.value = countries.value[0]?.code || ''
  } catch (err: any) {
    error.value = err.message || 'Cannot load country data'
  }
}

const openCountryForm = (item?: Country) => {
  Object.assign(countryForm, item ? { ...item } : { id: undefined, code: '', name: '', region: 'Asia', currencyCode: 'USD', status: 'ACTIVE', note: '' })
  countryModalOpen.value = true
}

const saveCountry = async () => {
  try {
    const saved = countryForm.id
      ? await api.update<Country>('countries', countryForm.id, countryForm as Record<string, unknown>)
      : await api.create<Country>('countries', countryForm as Record<string, unknown>)
    selectedCode.value = saved.code
    countryModalOpen.value = false
    notice.value = 'Country saved.'
    await loadData()
  } catch (err: any) {
    error.value = err.message || 'Cannot save country'
  }
}

const inactiveCountry = async () => {
  if (!selectedCountry.value.id) return
  await api.remove<Country>('countries', selectedCountry.value.id)
  notice.value = 'Country marked inactive.'
  await loadData()
}

const openLocationForm = (item?: Location) => {
  Object.assign(locationForm, item ? { ...item } : { id: undefined, countryId: selectedCountry.value.id, code: '', name: '', type: 'CITY', zipCode: '', status: 'ACTIVE', isPickupLocation: true, isPolPodLocation: true, isCfsLocation: false, isReturnLocation: true, note: '' })
  locationModalOpen.value = true
}

const saveLocation = async () => {
  try {
    locationForm.countryId = selectedCountry.value.id
    locationForm.zipCode = locationForm.zipCode || ''
    const body = locationForm as Record<string, unknown>
    locationForm.id ? await api.update<Location>('locations', locationForm.id, body) : await api.create<Location>('locations', body)
    locationModalOpen.value = false
    notice.value = 'Location saved.'
    await loadData()
  } catch (err: any) {
    error.value = err.message || 'Cannot save location'
  }
}

onMounted(loadData)

watch(countryQuery, () => { countryPage.value = 1 })
watch(locationQuery, () => { locationPage.value = 1 })
watch(countryPageCount, (count) => { if (countryPage.value > count) countryPage.value = count })
watch(locationPageCount, (count) => { if (locationPage.value > count) locationPage.value = count })
</script>

<style src="~/assets/css/fcl-admin-management.css"></style>
