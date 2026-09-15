<template>
  <div class="management-screen charge-screen">
    <header class="mg-header">
      <div>
        <h1>FCL Local Charges</h1>
        <p>Configure origin, port, customs, and destination charges for FCL shipments.</p>
      </div>
      <div class="mg-actions">
        <button class="mg-btn" type="button">Import Excel</button>
        <button class="mg-btn" type="button" @click="api.exportCsv('charge-rules')">Export Excel</button>
        <button class="mg-btn primary" type="button" @click="openCreate">Add Charge</button>
      </div>
    </header>

    <div v-if="notice" class="mg-notice success">{{ notice }}</div>
    <div v-if="error" class="mg-notice error">{{ error }}</div>

    <section class="mg-panel mg-filter-panel">
      <div class="mg-tabs">
        <button v-for="tab in chargeTabs" :key="tab.id" :class="{ active: activeChargeTab === tab.id }" type="button" @click="setChargeTab(tab.id)">{{ tab.label }}</button>
      </div>
      <div class="mg-filterbar charge-filters">
        <label class="mg-field"><span>Country</span><select class="mg-select"><option>All Countries</option><option>Viet Nam</option></select></label>
        <label class="mg-field"><span>Port / Terminal</span><select class="mg-select"><option>All Ports</option><option>Cat Lai Terminal</option></select></label>
        <label class="mg-field"><span>Shipping Line</span><select class="mg-select"><option>All Shipping Lines</option><option>COSCO</option></select></label>
        <label class="mg-field"><span>Charge Group</span><select class="mg-select"><option>All Groups</option><option>Origin Charges</option></select></label>
        <label class="mg-field"><span>Charge Type</span><select class="mg-select"><option>All Types</option></select></label>
        <label class="mg-field"><span>Status</span><select class="mg-select"><option>All Status</option><option>Active</option></select></label>
        <input v-model.trim="search" class="mg-search" type="search" placeholder="Search charges..." />
        <button class="mg-btn" type="button">Reset</button>
      </div>
    </section>

    <section class="mg-grid charge-workspace">
      <article class="mg-panel">
        <div class="mg-panel-head">
          <strong>Saved Views</strong>
          <button class="mg-btn" type="button">Manage Views</button>
        </div>
        <div class="mg-panel-pad" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;">
          <article class="mg-card" style="min-height:72px;padding:14px;">
            <span class="mg-card-icon" style="width:44px;height:44px;">OR</span>
            <div><p class="mg-card-label">Origin Charges</p><div class="mg-card-value" style="font-size:22px;">24</div></div>
          </article>
          <article class="mg-card" style="min-height:72px;padding:14px;">
            <span class="mg-card-icon blue" style="width:44px;height:44px;">CU</span>
            <div><p class="mg-card-label">Customs</p><div class="mg-card-value" style="font-size:22px;">18</div></div>
          </article>
          <article class="mg-card" style="min-height:72px;padding:14px;">
            <span class="mg-card-icon purple" style="width:44px;height:44px;">PT</span>
            <div><p class="mg-card-label">Port Charges</p><div class="mg-card-value" style="font-size:22px;">22</div></div>
          </article>
        </div>
        <div class="mg-table-wrap">
          <table class="mg-table">
            <thead>
              <tr>
                <th>Charge Name</th>
                <th>Charge Code</th>
                <th>Scope</th>
                <th>Unit</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Cost Type</th>
                <th>Validity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="charge in pagedCharges" :key="charge.code" :class="{ 'active-row': selectedCharge?.id === charge.id }" @click="selectCharge(charge)">
                <td><strong>{{ charge.name }}</strong></td>
                <td>{{ charge.code }}</td>
                <td>
                  <span class="mg-badge">{{ charge.applyScope }}</span>
                </td>
                <td>{{ charge.unit }}</td>
                <td>{{ charge.amount ?? 'As actual' }}</td>
                <td>{{ charge.currencyCode }}</td>
                <td>{{ charge.isConfirmed ? 'Confirmed' : 'Conditional' }}</td>
                <td>{{ charge.validityFrom }} - {{ charge.validityTo }}</td>
                <td><span class="mg-badge">{{ charge.status }}</span></td>
                <td>
                  <button class="mg-icon-btn" type="button" aria-label="Duplicate charge" @click.stop="duplicateCharge(charge)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 16H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <footer class="mg-table-footer">
          <span>Showing {{ chargeStart }} to {{ chargeEnd }} of {{ filteredCharges.length }} charges</span>
          <div class="mg-pagination">
            <button class="mg-page" type="button" :disabled="chargePage === 1" @click="chargePage--">&lt;</button>
            <button v-for="page in chargePageCount" :key="page" class="mg-page" :class="{ active: page === chargePage }" type="button" @click="chargePage = page">{{ page }}</button>
            <button class="mg-page" type="button" :disabled="chargePage === chargePageCount" @click="chargePage++">&gt;</button>
          </div>
        </footer>
      </article>

      <article class="mg-panel">
        <div class="mg-panel-head">
          <div class="mg-panel-title">
            <h2>Edit Charge Rule</h2>
          </div>
          <button class="mg-btn" type="button" :disabled="!selectedCharge" @click="selectedCharge && duplicateCharge(selectedCharge)">Duplicate Rule</button>
        </div>

        <section class="mg-form-section">
          <h3>Basic Information</h3>
          <div class="mg-form-grid">
            <label class="mg-field"><span>Charge Name *</span><input v-model.trim="chargeForm.name" class="mg-input" /></label>
            <label class="mg-field"><span>Charge Code *</span><input v-model.trim="chargeForm.code" class="mg-input" /></label>
            <label class="mg-field"><span>Charge Group</span><select v-model="chargeForm.chargeGroup" class="mg-select"><option>CUSTOMS_CLEARANCE</option><option>PICKUP_CHARGES</option><option>PORT_CHARGES</option><option>ORIGIN_CHARGES</option><option>DESTINATION_CHARGES</option></select></label>
            <label class="mg-field"><span>Apply Scope</span><select v-model="chargeForm.applyScope" class="mg-select"><option>GLOBAL</option><option>COUNTRY</option><option>CITY</option><option>PORT</option><option>TERMINAL</option><option>WAREHOUSE</option><option>ROUTE</option></select></label>
            <label class="mg-field"><span>Status</span><select v-model="chargeForm.status" class="mg-select"><option>ACTIVE</option><option>DRAFT</option><option>INACTIVE</option></select></label>
          </div>
        </section>

        <section class="mg-form-section">
          <h3>Apply By</h3>
          <div class="mg-checks">
            <label class="mg-check"><input v-model="chargeForm.isConfirmed" type="checkbox" />Confirmed</label>
            <label class="mg-check"><input v-model="chargeForm.isConditional" type="checkbox" />Conditional</label>
            <label class="mg-check"><input v-model="chargeForm.isDefaultIncluded" type="checkbox" />Default Included</label>
          </div>
        </section>

        <section class="mg-form-section">
          <h3>Amount / Matrix</h3>
          <div class="mg-form-grid">
            <label class="mg-field"><span>Currency *</span><select v-model="chargeForm.currencyCode" class="mg-select"><option>USD</option><option>VND</option><option>CNY</option></select></label>
            <label class="mg-field"><span>Unit *</span><select v-model="chargeForm.unit" class="mg-select"><option>PER_CONTAINER</option><option>PER_TRUCK</option><option>PER_BILL</option><option>PER_WM</option><option>AS_ACTUAL</option></select></label>
            <label class="mg-field"><span>Amount</span><input v-model.number="chargeForm.amount" class="mg-input" type="number" min="0" :disabled="chargeForm.unit === 'AS_ACTUAL'" /></label>
            <label class="mg-field"><span>Valid From</span><input v-model="chargeForm.validityFrom" class="mg-input" type="date" /></label>
            <label class="mg-field"><span>Valid To</span><input v-model="chargeForm.validityTo" class="mg-input" type="date" /></label>
          </div>
        </section>

        <section class="mg-form-section">
          <h3>Conditions</h3>
          <div class="mg-checks">
            <label class="mg-check"><input v-model="chargeForm.isDefaultIncluded" type="checkbox" />Default Included</label>
            <label class="mg-check"><input v-model="chargeForm.isConfirmed" type="checkbox" />Confirmed</label>
            <label class="mg-check"><input :checked="chargeForm.status === 'ACTIVE'" type="checkbox" @change="chargeForm.status = ($event.target as HTMLInputElement).checked ? 'ACTIVE' : 'INACTIVE'" />Active</label>
          </div>
          <label class="mg-field" style="margin-top:14px;">
            <span>Note (Optional)</span>
            <textarea v-model.trim="chargeForm.note" class="mg-input" style="min-height:78px;padding-top:10px;" placeholder="Add internal note or description for this charge..."></textarea>
          </label>
        </section>

        <div class="mg-panel-pad" style="display:flex;justify-content:space-between;gap:10px;">
          <button class="mg-btn" type="button" @click="openCreate">Cancel</button>
          <button class="mg-btn primary" type="button" @click="saveCharge">Save Rule</button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { ChargeRule } from '~/types/logisticsPricing'

const search = ref('')
const api = useLogisticsPricingApi()
const localCharges = ref<ChargeRule[]>([])
const selectedCharge = ref<ChargeRule | null>(null)
const notice = ref('')
const error = ref('')
const activeChargeTab = ref('ORIGIN_ALL')
const chargePage = ref(1)
const chargePageSize = 8
const chargeTabs = [
  { id: 'ORIGIN_ALL', label: 'Origin Charges' },
  { id: 'CUSTOMS_CLEARANCE', label: 'Customs Clearance' },
  { id: 'PICKUP_CHARGES', label: 'Pick-up Charges' },
  { id: 'PORT_CHARGES', label: 'Port Charges' },
  { id: 'DESTINATION_CHARGES', label: 'Destination Charges' },
] as const

const blankCharge = (): Partial<ChargeRule> => ({
  name: '',
  code: '',
  mode: 'FCL',
  chargeGroup: 'PICKUP_CHARGES',
  applyScope: 'GLOBAL',
  unit: 'PER_CONTAINER',
  currencyCode: 'USD',
  amount: 0,
  isConfirmed: true,
  isConditional: false,
  isDefaultIncluded: true,
  validityFrom: '2024-01-01',
  validityTo: '2026-12-31',
  status: 'ACTIVE',
  matrix: [],
})

const chargeForm = reactive<any>(blankCharge())

const filteredCharges = computed(() => {
  const value = search.value.toLowerCase()
  const originGroups = ['ORIGIN_CHARGES', 'CUSTOMS_CLEARANCE', 'PICKUP_CHARGES', 'PORT_CHARGES']
  const scoped = localCharges.value.filter((charge) => activeChargeTab.value === 'ORIGIN_ALL' ? originGroups.includes(charge.chargeGroup) : charge.chargeGroup === activeChargeTab.value)
  if (!value) return scoped
  return scoped.filter((charge) => JSON.stringify(charge).toLowerCase().includes(value))
})
const chargePageCount = computed(() => Math.max(1, Math.ceil(filteredCharges.value.length / chargePageSize)))
const pagedCharges = computed(() => filteredCharges.value.slice((chargePage.value - 1) * chargePageSize, chargePage.value * chargePageSize))
const chargeStart = computed(() => filteredCharges.value.length ? (chargePage.value - 1) * chargePageSize + 1 : 0)
const chargeEnd = computed(() => Math.min(chargePage.value * chargePageSize, filteredCharges.value.length))

const setChargeTab = (tab: string) => {
  activeChargeTab.value = tab
  chargePage.value = 1
  const originGroups = ['ORIGIN_CHARGES', 'CUSTOMS_CLEARANCE', 'PICKUP_CHARGES', 'PORT_CHARGES']
  const first = localCharges.value.find((charge) => tab === 'ORIGIN_ALL' ? originGroups.includes(charge.chargeGroup) : charge.chargeGroup === tab)
  if (first) selectCharge(first)
  else openCreate()
}

const loadData = async () => {
  try {
    error.value = ''
    localCharges.value = await api.list<ChargeRule>('charge-rules', { mode: 'FCL' })
    if (!selectedCharge.value && localCharges.value[0]) selectCharge(localCharges.value[0])
  } catch (err: any) {
    error.value = err.message || 'Cannot load charges'
  }
}

const selectCharge = (charge: ChargeRule) => {
  selectedCharge.value = charge
  Object.assign(chargeForm, JSON.parse(JSON.stringify(charge)))
}

const openCreate = () => {
  selectedCharge.value = null
  Object.assign(chargeForm, blankCharge())
}

const saveCharge = async () => {
  try {
    const body = { ...JSON.parse(JSON.stringify(chargeForm)), mode: 'FCL' }
    const saved = body.id ? await api.update<ChargeRule>('charge-rules', body.id, body) : await api.create<ChargeRule>('charge-rules', body)
    notice.value = 'Charge rule saved.'
    await loadData()
    selectCharge(saved)
  } catch (err: any) {
    error.value = err.message || 'Cannot save charge rule'
  }
}

const duplicateCharge = async (charge: ChargeRule) => {
  const saved = await api.duplicate<ChargeRule>('charge-rules', charge.id, { code: `${charge.code}_COPY` })
  notice.value = 'Charge duplicated as draft.'
  await loadData()
  selectCharge(saved)
}

onMounted(loadData)

watch(search, () => { chargePage.value = 1 })
watch(chargePageCount, (count) => { if (chargePage.value > count) chargePage.value = count })
</script>

<style src="~/assets/css/fcl-admin-management.css"></style>
