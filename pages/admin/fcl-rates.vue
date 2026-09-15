<template>
  <div class="management-screen rate-screen">
    <header class="mg-header">
      <div>
        <p class="mg-eyebrow">Pricing Management &gt; FCL Rate Workspace</p>
        <h1>FCL Rate Workspace</h1>
        <p>Search, filter, compare, and quickly edit FCL rates.</p>
      </div>
      <div class="mg-actions">
        <button class="mg-btn" type="button">Import Excel</button>
        <button class="mg-btn" type="button" @click="api.exportCsv('fcl-rates')">Export Excel</button>
        <button class="mg-btn primary" type="button" @click="openCreate">Add FCL Rate</button>
      </div>
    </header>

    <div v-if="notice" class="mg-notice success">{{ notice }}</div>
    <div v-if="error" class="mg-notice error">{{ error }}</div>

    <section class="mg-panel mg-filter-panel">
      <div class="mg-toolbar">
        <input v-model.trim="search" class="mg-search" type="search" placeholder="Search by route, country, POL, POD, or shipping line..." />
      </div>
      <div class="mg-filterbar rate-filters">
        <label class="mg-field"><span>Origin Country</span><select class="mg-select"><option>Select country</option><option>Viet Nam</option></select></label>
        <label class="mg-field"><span>Destination Country</span><select class="mg-select"><option>Select country</option><option>China</option></select></label>
        <label class="mg-field"><span>Port</span><select class="mg-select"><option>All ports</option><option>HCM</option></select></label>
        <label class="mg-field"><span>Shipping Line</span><select class="mg-select"><option>Select line</option><option>COSCO</option></select></label>
        <label class="mg-field"><span>Effective Date</span><input class="mg-input" type="date" /></label>
        <label class="mg-field"><span>Status</span><select class="mg-select"><option>All status</option><option>Active</option></select></label>
        <button class="mg-btn primary" type="button">Search</button>
        <button class="mg-btn" type="button">Reset</button>
      </div>
    </section>

    <section class="mg-grid rate-workspace">
      <article class="mg-panel">
        <div class="mg-panel-head">
          <div class="mg-panel-title">
            <h2>FCL Rates</h2>
            <span class="mg-badge blue">{{ filteredRates.length }} records</span>
          </div>
          <div class="mg-actions">
            <button class="mg-btn" type="button">Columns</button>
            <button class="mg-btn" type="button">Filters</button>
          </div>
        </div>
        <div class="mg-table-wrap">
          <table class="mg-table">
            <thead>
              <tr>
                <th>Origin -> Destination</th>
                <th>POL -> POD</th>
                <th>Line</th>
                <th>Type</th>
                <th>Rates (USD)</th>
                <th>Valid From</th>
                <th>Valid To</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rate in pagedRates" :key="rate.id" :class="{ 'active-row': selectedRate?.id === rate.id }" @click="selectRate(rate)">
                <td><span class="mg-route">{{ countryName(rate.originCountryId) }} -> {{ countryName(rate.destinationCountryId) }}</span></td>
                <td><span class="mg-route">{{ portCode(rate.polId) }} -> {{ portCode(rate.podId) }}</span></td>
                <td>{{ lineCode(rate.shippingLineId) }}</td>
                <td><span class="mg-route">{{ rate.details.map((item) => item.containerType).join(', ') }}</span></td>
                <td><span class="mg-money-stack">{{ rate.details.map((item) => `${item.containerType}: ${item.oceanFreight}`).join(' / ') }}</span></td>
                <td>{{ rate.validityFrom }}</td>
                <td>{{ rate.validityTo }}</td>
                <td><span class="mg-badge">{{ rate.status }}</span></td>
                <td>
                  <button class="mg-icon-btn" type="button" aria-label="Edit rate">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.8 2.8 0 0 1 4 4L8 20l-5 1 1-5Z"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <footer class="mg-table-footer">
          <span>Showing {{ rateStart }} to {{ rateEnd }} of {{ filteredRates.length }} FCL rates</span>
          <div class="mg-pagination">
            <button class="mg-page" type="button" :disabled="ratePage === 1" @click="ratePage--">&lt;</button>
            <button v-for="page in ratePageCount" :key="page" class="mg-page" :class="{ active: page === ratePage }" type="button" @click="ratePage = page">{{ page }}</button>
            <button class="mg-page" type="button" :disabled="ratePage === ratePageCount" @click="ratePage++">&gt;</button>
          </div>
        </footer>
      </article>

      <article class="mg-panel">
        <div class="mg-panel-head">
          <div class="mg-panel-title">
            <h2>Editing FCL Rate</h2>
            <span class="mg-badge" :class="{ inactive: rateForm.status !== 'ACTIVE' }">{{ rateForm.status }}</span>
          </div>
          <div class="mg-actions">
            <button class="mg-btn" type="button" @click="duplicateSelected">Copy previous</button>
            <button class="mg-btn" type="button" @click="duplicateSelected">Clone to another line</button>
            <button class="mg-btn danger" type="button" @click="markInactive">Mark inactive</button>
          </div>
        </div>

        <section class="mg-form-section">
          <h3>Basic Info</h3>
          <div class="mg-form-grid three">
            <label class="mg-field"><span>Status</span><select v-model="rateForm.status" class="mg-select"><option>ACTIVE</option><option>DRAFT</option><option>INACTIVE</option></select></label>
            <label class="mg-field"><span>Line *</span><select v-model="rateForm.shippingLineId" class="mg-select"><option v-for="line in shippingLines" :key="line.id" :value="line.id">{{ line.code }}</option></select></label>
            <label class="mg-field"><span>Origin Country *</span><select v-model="rateForm.originCountryId" class="mg-select"><option v-for="country in countries" :key="country.id" :value="country.id">{{ country.name }}</option></select></label>
            <label class="mg-field"><span>Destination Country *</span><select v-model="rateForm.destinationCountryId" class="mg-select"><option v-for="country in countries" :key="country.id" :value="country.id">{{ country.name }}</option></select></label>
            <label class="mg-field"><span>POL *</span><select v-model="rateForm.polId" class="mg-select"><option v-for="port in ports" :key="port.id" :value="port.id">{{ port.name }}</option></select></label>
            <label class="mg-field"><span>POD *</span><select v-model="rateForm.podId" class="mg-select"><option v-for="port in ports" :key="port.id" :value="port.id">{{ port.name }}</option></select></label>
          </div>
        </section>

        <section class="mg-form-section">
          <h3>Rate Values (USD)</h3>
          <div class="mg-form-grid">
            <label v-for="detail in rateForm.details" :key="detail.containerType" class="mg-field">
              <span>{{ detail.containerType }}</span>
              <input v-model.number="detail.oceanFreight" class="mg-input" type="number" min="0" />
            </label>
          </div>
        </section>

        <section class="mg-form-section">
          <h3>Local Charges (USD)</h3>
          <div class="mg-form-grid three">
            <label v-for="detail in rateForm.details" :key="`local-${detail.containerType}`" class="mg-field">
              <span>{{ detail.containerType }} Per Bill</span>
              <input v-model.number="detail.perBillCharge" class="mg-input" type="number" min="0" />
            </label>
          </div>
        </section>

        <section class="mg-form-section">
          <h3>Schedule & Validity</h3>
          <div class="mg-form-grid three">
            <label class="mg-field"><span>Valid From *</span><input v-model="rateForm.validityFrom" class="mg-input" type="date" /></label>
            <label class="mg-field"><span>Valid To *</span><input v-model="rateForm.validityTo" class="mg-input" type="date" /></label>
            <label class="mg-field"><span>Transit Time (days)</span><input v-model.number="rateForm.transitTimeDays" class="mg-input" type="number" min="0" /></label>
            <label class="mg-field"><span>Service Type</span><select v-model="rateForm.serviceType" class="mg-select"><option>CY_CY</option><option>DOOR_CY</option><option>CY_DOOR</option><option>DOOR_DOOR</option></select></label>
            <label class="mg-field"><span>Free Time (days)</span><input v-model.trim="rateForm.freeTime" class="mg-input" /></label>
            <label class="mg-field"><span>Schedule</span><input v-model.trim="rateForm.schedule" class="mg-input" /></label>
          </div>
        </section>

        <div class="mg-panel-pad" style="display:flex;justify-content:flex-end;gap:10px;">
          <button class="mg-btn" type="button" @click="openCreate">Cancel</button>
          <button class="mg-btn success-outline" type="button" @click="saveRate('DRAFT')">Save Draft</button>
          <button class="mg-btn primary" type="button" @click="saveRate('ACTIVE')">Save Rate</button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { Country, FclRate, Port, RecordStatus, ShippingLine } from '~/types/logisticsPricing'

const search = ref('')
const api = useLogisticsPricingApi()
const fclRates = ref<FclRate[]>([])
const countries = ref<Country[]>([])
const ports = ref<Port[]>([])
const shippingLines = ref<ShippingLine[]>([])
const selectedRate = ref<FclRate | null>(null)
const notice = ref('')
const error = ref('')
const ratePage = ref(1)
const ratePageSize = 10

const blankRate = (): Partial<FclRate> => ({
  originCountryId: 'country-vn',
  destinationCountryId: 'country-cn',
  polId: 'port-cli',
  podId: 'port-sha',
  shippingLineId: 'line-cosco',
  cargoType: 'GEN',
  serviceType: 'CY_CY',
  directType: 'DIRECT',
  schedule: 'Weekly',
  transitTimeDays: 4,
  freeTime: '7 / 7',
  validityFrom: '2024-01-01',
  validityTo: '2026-12-31',
  currencyCode: 'USD',
  status: 'DRAFT',
  details: [
    { containerType: '20GP', oceanFreight: 0, currencyCode: 'USD' } as any,
    { containerType: '40GP', oceanFreight: 0, currencyCode: 'USD' } as any,
    { containerType: '40HC', oceanFreight: 0, currencyCode: 'USD' } as any,
  ],
})

const rateForm = reactive<any>(blankRate())

const filteredRates = computed(() => {
  const value = search.value.toLowerCase()
  if (!value) return fclRates.value
  return fclRates.value.filter((rate) => JSON.stringify(rate).toLowerCase().includes(value))
})
const ratePageCount = computed(() => Math.max(1, Math.ceil(filteredRates.value.length / ratePageSize)))
const pagedRates = computed(() => filteredRates.value.slice((ratePage.value - 1) * ratePageSize, ratePage.value * ratePageSize))
const rateStart = computed(() => filteredRates.value.length ? (ratePage.value - 1) * ratePageSize + 1 : 0)
const rateEnd = computed(() => Math.min(ratePage.value * ratePageSize, filteredRates.value.length))

const countryName = (id: string) => countries.value.find((item) => item.id === id)?.name || id
const portCode = (id: string) => ports.value.find((item) => item.id === id)?.code || id
const lineCode = (id: string) => shippingLines.value.find((item) => item.id === id)?.code || id

const selectRate = (rate: FclRate) => {
  selectedRate.value = rate
  Object.assign(rateForm, JSON.parse(JSON.stringify(rate)))
}

const openCreate = () => {
  selectedRate.value = null
  Object.assign(rateForm, blankRate())
}

const loadData = async () => {
  try {
    error.value = ''
    ;[fclRates.value, countries.value, ports.value, shippingLines.value] = await Promise.all([
      api.list<FclRate>('rates/fcl'),
      api.list<Country>('countries'),
      api.list<Port>('ports'),
      api.list<ShippingLine>('shipping-lines'),
    ])
    if (!selectedRate.value && fclRates.value[0]) selectRate(fclRates.value[0])
  } catch (err: any) {
    error.value = err.message || 'Cannot load rates'
  }
}

const saveRate = async (status: RecordStatus) => {
  try {
    rateForm.status = status
    const body = JSON.parse(JSON.stringify(rateForm))
    const saved = body.id ? await api.update<FclRate>('rates/fcl', body.id, body) : await api.create<FclRate>('rates/fcl', body)
    notice.value = 'Rate saved.'
    await loadData()
    selectRate(saved)
  } catch (err: any) {
    error.value = err.message || 'Cannot save rate'
  }
}

const duplicateSelected = async () => {
  if (!selectedRate.value) return
  const saved = await api.duplicate<FclRate>('rates/fcl', selectedRate.value.id)
  notice.value = 'Rate duplicated as draft.'
  await loadData()
  selectRate(saved)
}

const markInactive = async () => {
  if (!selectedRate.value) return
  const saved = await api.patchStatus<FclRate>('rates/fcl', selectedRate.value.id, 'INACTIVE')
  notice.value = 'Rate marked inactive.'
  await loadData()
  selectRate(saved)
}

onMounted(loadData)

watch(search, () => { ratePage.value = 1 })
watch(ratePageCount, (count) => { if (ratePage.value > count) ratePage.value = count })
</script>

<style src="~/assets/css/fcl-admin-management.css"></style>
