<template>
  <div class="admin-main">
    <div class="section-head">
      <div>
        <p>FCL Step 2</p>
        <h1>Service Pricing</h1>
      </div>
      <div class="toolbar" style="gap:8px">
        <button class="primary-btn icon-text-btn" type="button" @click="openCreate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Add Charge
        </button>
      </div>
    </div>

    <div v-if="notice" class="notice success">{{ notice }}</div>
    <div v-if="error" class="notice error">{{ error }}</div>

    <!-- Service Type Tabs -->
    <div class="subtabs" style="margin-bottom:16px;">
      <button v-for="t in serviceTypes" :key="t" :class="{ active: activeType === t }" @click="activeType = t">{{ t }}</button>
    </div>

    <div v-if="loading" style="text-align:center;padding:40px;color:var(--muted);font-weight:700;">Loading...</div>

    <template v-else>
      <div v-for="group in groupedByChargeGroup" :key="group.name" style="margin-bottom:20px;">
        <div class="group-header">
          <span :class="'dot ' + (group.name.includes('PICK') ? 'blue' : group.name.includes('CUSTOMS') ? 'amber' : 'green')"></span>
          <strong>{{ group.name }}</strong>
        </div>
        <div class="table-wrap compact">
          <table class="admin-table">
            <colgroup>
              <col class="col-charge-name" />
              <col class="col-unit" />
              <col class="col-amount" />
              <col class="col-currency" />
              <col class="col-type" />
              <col class="col-container" />
              <col class="col-validity" />
              <col class="col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th>CHARGE NAME</th>
                <th>UNIT</th>
                <th>AMOUNT</th>
                <th>CURRENCY</th>
                <th>TYPE</th>
                <th>CONTAINER</th>
                <th>VALIDITY</th>
                <th class="actions-col">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in group.items" :key="item.id">
                <td><strong>{{ item.chargeName }}</strong></td>
                <td>{{ item.unit }}</td>
                <td>
                  <span v-if="item.amount > 0" class="amount">{{ Number(item.amount).toFixed(2) }}</span>
                  <em v-else style="color:var(--muted);font-size:12px;">As actual</em>
                </td>
                <td>{{ item.currency }}</td>
                <td>
                  <span class="cost-badge" :class="item.costType">
                    {{ item.costType === 'confirmed' ? '🟢 Confirmed' : '🟠 Conditional' }}
                  </span>
                </td>
                <td>{{ item.containerType || 'All' }}</td>
                <td class="validity-cell">
                  <div>{{ formatValidityDate(item.validFrom) }} - {{ formatValidityDate(item.validTo) }}</div>
                  <span class="validity-status" :class="getValidityState(item).className">{{ getValidityState(item).label }}</span>
                </td>
                <td class="actions-col">
                  <button class="edit-row-btn" type="button" @click="openEdit(item)" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </button>
                  <button class="del-btn" type="button" @click="deleteCharge(item)" title="Delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="!groupedByChargeGroup.length" style="text-align:center;padding:40px;color:var(--muted);font-weight:700;">
        No pricing data for {{ activeType }}. Use "Add Charge" to create pricing data.
      </div>
    </template>

    <!-- Modal -->
    <div v-if="modalOpen" class="modal-backdrop" role="presentation" @click.self="closeModal">
      <section class="dialog" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div>
            <p>{{ modalMode === 'create' ? 'Add New' : 'Edit' }}</p>
            <h2>{{ modalMode === 'create' ? 'Create Service Charge' : form.chargeName || 'Service Charge' }}</h2>
          </div>
          <button class="icon-btn" type="button" @click="closeModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <form class="modal-form" novalidate @submit.prevent="saveModal">
          <div v-if="formError" class="notice error">{{ formError }}</div>
          <div class="form-grid">
            <label class="field">
              <span>Service Type *</span>
              <select v-model="form.serviceType">
                <option v-for="t in serviceTypes" :key="t" :value="t">{{ t }}</option>
              </select>
            </label>
            <label class="field">
              <span>Charge Group *</span>
              <input v-model.trim="form.chargeGroup" type="text" placeholder="PICK-UP CHARGES" />
            </label>
            <label class="field">
              <span>Charge Name *</span>
              <input v-model.trim="form.chargeName" type="text" placeholder="Trucking fee" />
            </label>
            <label class="field">
              <span>Unit *</span>
              <select v-model="form.unit">
                <option value="per Container">per Container</option>
                <option value="per Truck">per Truck</option>
                <option value="per Shipment">per Shipment</option>
                <option value="per CBM">per CBM</option>
              </select>
            </label>
            <label class="field">
              <span>Amount (USD)</span>
              <input v-model.number="form.amount" type="number" min="0" step="0.01" />
            </label>
            <label class="field">
              <span>Currency</span>
              <select v-model="form.currency">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="VND">VND</option>
                <option value="CNY">CNY</option>
                <option value="JPY">JPY</option>
              </select>
            </label>
            <label class="field">
              <span>Cost Type</span>
              <select v-model="form.costType">
                <option value="confirmed">Confirmed</option>
                <option value="conditional">Conditional</option>
              </select>
            </label>
            <label class="field">
              <span>Container Type (optional)</span>
              <input v-model.trim="form.containerType" type="text" placeholder="All containers" />
            </label>
            <label class="field">
              <span>Valid From</span>
              <input v-model="form.validFrom" type="datetime-local" />
            </label>
            <label class="field">
              <span>Valid To</span>
              <input v-model="form.validTo" type="datetime-local" />
            </label>
            <label class="field" style="grid-column:1/-1;">
              <span>Notes</span>
              <input v-model.trim="form.notes" type="text" placeholder="Notes..." />
            </label>
          </div>
          <div class="modal-actions">
            <button class="ghost-btn" type="button" @click="closeModal">Cancel</button>
            <button class="primary-btn" type="submit" :disabled="saving">
              {{ saving ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </section>
    </div>
    <div v-if="confirmModal.open" class="modal-backdrop" role="presentation" @click.self="resolveConfirm(false)">
      <section class="dialog confirm-dialog" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div>
            <p>{{ confirmModal.title }}</p>
            <h2>Confirm action</h2>
          </div>
          <button class="icon-btn" type="button" @click="resolveConfirm(false)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="confirm-body">{{ confirmModal.message }}</div>
        <div class="modal-actions confirm-actions">
          <button class="ghost-btn" type="button" @click="resolveConfirm(false)">Cancel</button>
          <button class="primary-btn" type="button" @click="resolveConfirm(true)">OK</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useUserStore } from '~/store/user'
import { FCL_PRICING_FALLBACK_WARNING, getFclServiceChargeSeed } from '~/data/fclPricingSeed'

const API_BASE = useApiBaseUrl('/api')
const serviceTypes = ['EXW', 'FCA', 'DAP', 'DDU', 'DDP']
const userStore = useUserStore()

interface ChargeItem {
  id: string; serviceType: string; chargeGroup: string; chargeName: string
  unit: string; costType: string; amount: number; currency: string
  containerType: string | null; notes: string | null; validFrom: string | null; validTo: string | null
  isActive: boolean; sortOrder: number
}

const items = ref<ChargeItem[]>([])
const loading = ref(true)
const saving = ref(false)
const notice = ref('')
const error = ref('')
const activeType = ref('EXW')
const modalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const formError = ref('')
const editingId = ref('')
const confirmModal = reactive({
  open: false,
  title: 'Confirm',
  message: '',
  resolve: null as null | ((value: boolean) => void),
})

const form = reactive({
  serviceType: 'EXW', chargeGroup: '', chargeName: '', unit: 'per Container',
  costType: 'confirmed', amount: 0, currency: 'USD', containerType: '', notes: '',
  validFrom: '', validTo: '',
})

const headers = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${userStore.token || ''}` })

const fallbackCharges = (): ChargeItem[] =>
  getFclServiceChargeSeed().map(charge => ({
    id: charge.id,
    serviceType: charge.serviceType,
    chargeGroup: charge.chargeGroup,
    chargeName: charge.chargeName,
    unit: charge.unit,
    costType: charge.costType,
    amount: Number(charge.amount) || 0,
    currency: charge.currency,
    containerType: charge.containerType || null,
    notes: charge.notes || null,
    validFrom: charge.validFrom || null,
    validTo: charge.validTo || null,
    isActive: charge.isActive !== false,
    sortOrder: charge.sortOrder || 0,
  }))

const fetchItems = async () => {
  loading.value = true; error.value = ''
  try {
    const res = await fetch(`${API_BASE}/fcl/charges`, { headers: headers() })
    const json = await res.json()
    const list = json.data || json || []
    if (Array.isArray(list) && list.length > 0) {
      items.value = list
    } else {
      console.warn(FCL_PRICING_FALLBACK_WARNING)
      items.value = fallbackCharges()
      error.value = FCL_PRICING_FALLBACK_WARNING
    }
  } catch (e: any) {
    console.warn(FCL_PRICING_FALLBACK_WARNING)
    items.value = fallbackCharges()
    error.value = e.message || FCL_PRICING_FALLBACK_WARNING
  }
  finally { loading.value = false }
}

const filtered = computed(() => items.value.filter(i => i.serviceType === activeType.value))

const groupedByChargeGroup = computed(() => {
  const groups: Record<string, ChargeItem[]> = {}
  for (const item of filtered.value) {
    if (!groups[item.chargeGroup]) groups[item.chargeGroup] = []
    groups[item.chargeGroup].push(item)
  }
  return Object.entries(groups).map(([name, items]) => ({ name, items }))
})

const resetForm = () => {
  form.serviceType = activeType.value; form.chargeGroup = ''; form.chargeName = ''
  form.unit = 'per Container'; form.costType = 'confirmed'; form.amount = 0
  form.currency = 'USD'; form.containerType = ''; form.notes = ''
  form.validFrom = ''; form.validTo = ''
  formError.value = ''; editingId.value = ''
}

const openCreate = () => { resetForm(); modalMode.value = 'create'; modalOpen.value = true }

const openEdit = (item: ChargeItem) => {
  modalMode.value = 'edit'; editingId.value = item.id
  Object.assign(form, {
    serviceType: item.serviceType, chargeGroup: item.chargeGroup, chargeName: item.chargeName,
    unit: item.unit, costType: item.costType, amount: Number(item.amount),
    currency: item.currency, containerType: item.containerType || '', notes: item.notes || '',
    validFrom: toDateTimeInput(item.validFrom), validTo: toDateTimeInput(item.validTo),
  })
  formError.value = ''; modalOpen.value = true
}

const closeModal = () => { modalOpen.value = false }

const askConfirm = (message: string, title = 'Delete charge') => new Promise<boolean>((resolve) => {
  confirmModal.title = title
  confirmModal.message = message
  confirmModal.resolve = resolve
  confirmModal.open = true
})

const resolveConfirm = (value: boolean) => {
  const resolve = confirmModal.resolve
  confirmModal.open = false
  confirmModal.resolve = null
  resolve?.(value)
}

const saveModal = async () => {
  formError.value = ''
  if (!form.serviceType || !form.chargeGroup || !form.chargeName || !form.unit) {
    formError.value = 'Please fill in all required fields.'; return
  }
  const validFrom = form.validFrom ? new Date(form.validFrom) : null
  const validTo = form.validTo ? new Date(form.validTo) : null
  if (validFrom && validTo && validFrom.getTime() > validTo.getTime()) {
    formError.value = 'Valid From must be before Valid To.'; return
  }
  saving.value = true
  try {
    const body = {
      ...form,
      containerType: form.containerType || null,
      notes: form.notes || null,
      validFrom: dateTimeInputToIso(form.validFrom),
      validTo: dateTimeInputToIso(form.validTo),
    }
    if (modalMode.value === 'create') {
      await fetch(`${API_BASE}/fcl/charges`, { method: 'POST', headers: headers(), body: JSON.stringify(body) })
    } else {
      await fetch(`${API_BASE}/fcl/charges/${editingId.value}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(body) })
    }
    await fetchItems()
    notice.value = modalMode.value === 'create' ? 'Added successfully.' : 'Updated successfully.'
    setTimeout(() => notice.value = '', 4000)
    closeModal()
  } catch (e: any) { formError.value = e.message }
  finally { saving.value = false }
}

const deleteCharge = async (item: ChargeItem) => {
  if (!(await askConfirm(`Delete "${item.chargeName}"? This cannot be undone.`))) return
  try {
    await fetch(`${API_BASE}/fcl/charges/${item.id}`, { method: 'DELETE', headers: headers() })
    await fetchItems()
    notice.value = 'Deleted successfully.'
    setTimeout(() => notice.value = '', 4000)
  } catch (e: any) { error.value = e.message }
}

onMounted(fetchItems)

const toDateTimeInput = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 16)
}

const dateTimeInputToIso = (value: string) => value ? new Date(value).toISOString() : null

const formatValidityDate = (value?: string | null) => {
  if (!value) return 'Always'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Invalid date'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const getValidityState = (item: ChargeItem) => {
  const now = Date.now()
  const from = item.validFrom ? new Date(item.validFrom).getTime() : null
  const to = item.validTo ? new Date(item.validTo).getTime() : null
  if (from !== null && Number.isFinite(from) && from > now) return { label: 'Upcoming', className: 'upcoming' }
  if (to !== null && Number.isFinite(to) && to < now) return { label: 'Expired', className: 'expired' }
  if (!item.validFrom && !item.validTo) return { label: 'Always active', className: 'active' }
  return { label: 'Active now', className: 'active' }
}
</script>

<style scoped>
.admin-main { min-height: 100vh; margin-left: 280px; padding: 28px; }
.group-header { display: flex; align-items: center; gap: 10px; padding: 10px 0 6px; font-size: 14px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.blue { background: #2563eb; }
.dot.amber { background: #d97706; }
.dot.green { background: #16a34a; }
.amount { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 700; }
.cost-badge { font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px; }
.cost-badge.confirmed { background: #f0fdf4; color: #16a34a; }
.cost-badge.conditional { background: #fffbeb; color: #d97706; }
.validity-cell { min-width: 190px; color: var(--ink); line-height: 1.35; }
.validity-status { display: inline-flex; align-items: center; margin-top: 5px; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 850; }
.validity-status.active { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.validity-status.upcoming { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.validity-status.expired { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.del-btn { width: 34px; min-height: 34px; display: inline-grid; place-items: center; padding: 0; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #dc2626; cursor: pointer; margin-left: 4px; }
.del-btn svg { width: 15px; height: 15px; }

.section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 18px; }
.section-head p { margin: 0 0 6px; color: var(--green-dark); font-size: 12px; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
.section-head h1 { margin: 0; font-size: clamp(28px, 3vw, 42px); line-height: 1; }
.toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.subtabs { display: inline-flex; align-items: center; gap: 4px; padding: 4px; background: #eef2f7; border: 1px solid var(--line); border-radius: 8px; }
.subtabs button { min-width: 80px; height: 36px; border: 0; border-radius: 6px; background: transparent; color: var(--muted); font: inherit; font-size: 13px; font-weight: 750; cursor: pointer; }
.subtabs button.active { background: #fff; color: var(--ink); box-shadow: 0 1px 2px rgba(15,23,42,.08); }
.notice { margin-bottom: 14px; border-radius: 8px; padding: 11px 13px; font-size: 13px; font-weight: 750; }
.notice.success { background: var(--green-soft); color: var(--green-dark); border: 1px solid #bbf7d0; }
.notice.error { background: var(--red-soft); color: var(--red); border: 1px solid #fecaca; }
.table-wrap { width: 100%; overflow-x: auto; border: 1px solid var(--line); border-radius: 8px; }
.table-wrap.compact { margin-top: 0; }
.admin-table { width: 100%; min-width: 1180px; border-collapse: collapse; table-layout: fixed; }
.col-charge-name { width: 20%; }
.col-unit { width: 12%; }
.col-amount { width: 9%; }
.col-currency { width: 9%; }
.col-type { width: 15%; }
.col-container { width: 10%; }
.col-validity { width: 17%; }
.col-actions { width: 8%; }
.admin-table th, .admin-table td { padding: 13px 14px; border-bottom: 1px solid #edf2f7; text-align: left; vertical-align: middle; font-size: 13px; }
.admin-table th { color: #64748b; background: #f8fafc; font-size: 11px; font-weight: 850; letter-spacing: .06em; text-transform: uppercase; }
.admin-table th, .admin-table td:nth-child(2), .admin-table td:nth-child(3), .admin-table td:nth-child(4), .admin-table td:nth-child(6) { white-space: nowrap; }
.admin-table tbody tr:last-child td { border-bottom: 0; }
.actions-col { text-align: right !important; white-space: nowrap; }
.primary-btn, .ghost-btn { min-height: 40px; border-radius: 8px; border: 1px solid transparent; padding: 0 14px; font: inherit; font-size: 13px; font-weight: 750; cursor: pointer; }
.primary-btn { background: var(--green); border-color: var(--green); color: #fff; }
.primary-btn:hover:not(:disabled) { background: var(--green-dark); }
.ghost-btn { background: #fff; border-color: var(--line); color: var(--ink); }
.edit-row-btn { width: 34px; min-height: 34px; display: inline-grid; place-items: center; padding: 0; background: var(--ink); border: 1px solid var(--ink); border-radius: 8px; color: #fff; cursor: pointer; }
.edit-row-btn svg { width: 15px; height: 15px; }
.icon-text-btn { display: inline-flex; align-items: center; gap: 6px; }
.icon-text-btn svg { width: 16px; height: 16px; }
.icon-btn { width: 36px; height: 36px; display: grid; place-items: center; border: 0; border-radius: 8px; background: transparent; cursor: pointer; color: var(--muted); }
.icon-btn:hover { background: #f1f5f9; color: var(--ink); }
.icon-btn svg { width: 18px; height: 18px; }
.modal-backdrop { position: fixed; inset: 0; display: grid; place-items: center; background: rgba(15,23,42,.4); z-index: 1000; padding: 20px; }
.dialog { width: min(720px, 100%); max-height: min(760px, calc(100vh - 48px)); background: #fff; border-radius: 16px; box-shadow: 0 25px 60px rgba(15,23,42,.2); overflow-y: auto; }
.modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 18px 22px 0; }
.modal-head p { margin: 0 0 6px; color: var(--green-dark); font-size: 12px; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
.modal-head h2 { margin: 0; font-size: 24px; line-height: 1.2; }
.modal-form { padding: 18px 22px 22px; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-bottom: 14px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field span { font-size: 12px; font-weight: 800; color: var(--muted); }
.field input, .field select { width: 100%; height: 40px; border: 1px solid var(--line); border-radius: 8px; padding: 0 10px; font: inherit; font-size: 13px; background: #fff; color: var(--ink); outline: none; }
.field input:focus, .field select:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(22,163,74,.12); }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 10px; border-top: 1px solid var(--line); }
button:disabled { opacity: .55; cursor: not-allowed; }
.spinner-sm { width: 16px; height: 16px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: spin .5s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
