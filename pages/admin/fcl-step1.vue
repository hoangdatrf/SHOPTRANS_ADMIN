<template>
  <div class="admin-main">
    <div class="section-head">
      <div>
        <p>FCL Step 1</p>
        <h1>ICD / Inland Container Depot</h1>
      </div>
      <div class="toolbar" style="gap:8px">
        <button class="primary-btn icon-text-btn" type="button" @click="openCreate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Add ICD
        </button>
      </div>
    </div>

    <div v-if="notice" class="notice success">{{ notice }}</div>
    <div v-if="error" class="notice error">{{ error }}</div>

    <div class="toolbar">
      <div class="search-box">
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </span>
        <input v-model="search" type="search" placeholder="Search by code, name, city, region..." />
      </div>
      <select v-model="regionFilter" style="min-width:180px;padding:0 10px;height:40px;border:1px solid var(--line);border-radius:8px;font:inherit;font-size:13px;">
        <option value="">All Regions</option>
        <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
      </select>
      <select v-model="statusFilter" style="min-width:130px;padding:0 10px;height:40px;border:1px solid var(--line);border-radius:8px;font:inherit;font-size:13px;">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <div v-if="loading" style="text-align:center;padding:40px;color:var(--muted);font-weight:700;">Loading data...</div>

    <template v-else>
      <div v-for="group in groupedFiltered" :key="group.region" style="margin-bottom:20px;">
        <div class="region-header">
          <span class="region-flag">{{ getFlagEmoji(group.items[0]?.countryCode) }}</span>
          <strong>{{ group.region }}</strong>
          <small>{{ group.items.length }} depot{{ group.items.length > 1 ? 's' : '' }}</small>
        </div>
        <div class="table-wrap compact">
          <table class="admin-table">
            <colgroup>
              <col class="col-code" />
              <col class="col-name" />
              <col class="col-city" />
              <col class="col-country" />
              <col class="col-status" />
              <col class="col-sort" />
              <col class="col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th>CODE</th>
                <th>NAME</th>
                <th>CITY</th>
                <th>COUNTRY</th>
                <th>STATUS</th>
                <th>SORT ORDER</th>
                <th class="actions-col">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in group.items" :key="item.id" :class="{ 'row-inactive': !item.isActive }">
                <td><code class="icd-code">{{ item.code }}</code></td>
                <td><strong>{{ item.name }}</strong></td>
                <td>{{ item.city }}</td>
                <td>{{ item.country }}</td>
                <td>
                  <span class="status-pill" :class="item.isActive ? 'active' : 'inactive'">
                    {{ item.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ item.sortOrder }}</td>
                <td class="actions-col">
                  <button class="edit-row-btn" type="button" @click="openEdit(item)" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="!groupedFiltered.length" style="text-align:center;padding:40px;color:var(--muted);font-weight:700;">
        No matching ICDs found.
      </div>
    </template>

    <!-- Modal Create/Edit -->
    <div v-if="modalOpen" class="modal-backdrop" role="presentation" @click.self="closeModal">
      <section class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="icd-dialog-title" style="max-width:620px;">
        <div class="modal-head">
          <div>
            <p>{{ modalMode === 'create' ? 'Add New' : 'Edit' }}</p>
            <h2 id="icd-dialog-title">{{ modalMode === 'create' ? 'Create ICD Depot' : form.name || 'ICD Depot' }}</h2>
          </div>
          <button class="icon-btn" type="button" aria-label="Close" @click="closeModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <form class="modal-form" novalidate @submit.prevent="saveModal">
          <div v-if="formError" class="notice error">{{ formError }}</div>
          <div class="form-grid">
            <label class="field">
              <span>Depot Code *</span>
              <input v-model.trim="form.code" type="text" placeholder="CNSHA" :disabled="modalMode === 'edit'" />
            </label>
            <label class="field">
              <span>Name *</span>
              <input v-model.trim="form.name" type="text" placeholder="Shanghai Yangshan ICD" />
            </label>
            <label class="field">
              <span>City *</span>
              <input v-model.trim="form.city" type="text" placeholder="Shanghai" />
            </label>
            <label class="field">
              <span>Region *</span>
              <input v-model.trim="form.region" type="text" placeholder="CHINA – EAST" />
            </label>
            <label class="field">
              <span>Country *</span>
              <input v-model.trim="form.country" type="text" placeholder="China" />
            </label>
            <label class="field">
              <span>Country Code (ISO)</span>
              <input v-model.trim="form.countryCode" type="text" placeholder="CN" maxlength="2" />
            </label>
            <label class="field">
              <span>Sort Order</span>
              <input v-model.number="form.sortOrder" type="number" min="0" />
            </label>
          </div>
          <label class="switch-row">
            <input v-model="form.isActive" type="checkbox" />
            <span>{{ form.isActive ? 'Active' : 'Inactive' }}</span>
          </label>
          <div class="modal-actions">
            <button class="ghost-btn" type="button" @click="closeModal">Cancel</button>
            <button class="primary-btn" type="submit" :disabled="saving">
              {{ saving ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useUserStore } from '~/store/user'

const API_BASE = useApiBaseUrl('/api')
const userStore = useUserStore()

interface IcdItem {
  id: string
  code: string
  name: string
  city: string
  region: string
  country: string
  countryCode: string
  isActive: boolean
  sortOrder: number
}

const items = ref<IcdItem[]>([])
const loading = ref(true)
const saving = ref(false)
const notice = ref('')
const error = ref('')
const search = ref('')
const regionFilter = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
const modalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const formError = ref('')
const editingId = ref('')

const form = reactive({
  code: '',
  name: '',
  city: '',
  region: '',
  country: '',
  countryCode: '',
  isActive: true,
  sortOrder: 0,
})

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${userStore.token || ''}`
})

const fetchItems = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/fcl/icd`, { headers: headers() })
    const json = await res.json()
    items.value = json.data || json || []
  } catch (e: any) {
    error.value = e.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
}

const regions = computed(() => {
  const set = new Set(items.value.map(i => i.region))
  return [...set].sort()
})

const filtered = computed(() => {
  let list = items.value
  if (statusFilter.value === 'active') list = list.filter(i => i.isActive)
  if (statusFilter.value === 'inactive') list = list.filter(i => !i.isActive)
  if (regionFilter.value) list = list.filter(i => i.region === regionFilter.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(i =>
      i.code.toLowerCase().includes(q) ||
      i.name.toLowerCase().includes(q) ||
      i.city.toLowerCase().includes(q) ||
      i.region.toLowerCase().includes(q) ||
      i.country.toLowerCase().includes(q)
    )
  }
  return list
})

const groupedFiltered = computed(() => {
  const groups: Record<string, IcdItem[]> = {}
  for (const item of filtered.value) {
    if (!groups[item.region]) groups[item.region] = []
    groups[item.region].push(item)
  }
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([region, items]) => ({ region, items }))
})

const getFlagEmoji = (code: string) => {
  if (!code || code.length < 2) return '🏳️'
  const upper = code.toUpperCase()
  return String.fromCodePoint(...[...upper].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))
}

const resetForm = () => {
  form.code = ''
  form.name = ''
  form.city = ''
  form.region = ''
  form.country = ''
  form.countryCode = ''
  form.isActive = true
  form.sortOrder = 0
  formError.value = ''
  editingId.value = ''
}

const openCreate = () => {
  resetForm()
  modalMode.value = 'create'
  modalOpen.value = true
}

const openEdit = (item: IcdItem) => {
  modalMode.value = 'edit'
  editingId.value = item.id
  form.code = item.code
  form.name = item.name
  form.city = item.city
  form.region = item.region
  form.country = item.country
  form.countryCode = item.countryCode
  form.isActive = item.isActive
  form.sortOrder = item.sortOrder
  formError.value = ''
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
}

const saveModal = async () => {
  formError.value = ''
  if (!form.code || !form.name || !form.city || !form.region || !form.country) {
    formError.value = 'Code, name, city, region and country are required.'
    return
  }
  saving.value = true
  try {
    if (modalMode.value === 'create') {
      await fetch(`${API_BASE}/fcl/icd`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(form),
      })
    } else {
      const { code, ...rest } = form
      await fetch(`${API_BASE}/fcl/icd/${editingId.value}`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify(rest),
      })
    }
    await fetchItems()
    notice.value = modalMode.value === 'create' ? 'New ICD added.' : 'Updated successfully.'
    setTimeout(() => notice.value = '', 4000)
    closeModal()
  } catch (e: any) {
    formError.value = e.message || 'Failed to save'
  } finally {
    saving.value = false
  }
}

onMounted(fetchItems)
</script>

<style scoped>
.admin-main {
  min-height: 100vh;
  margin-left: 280px;
  padding: 28px;
}

.region-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0 6px;
  font-size: 14px;
  font-weight: 800;
}

.region-flag {
  font-size: 20px;
}

.region-header small {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.icd-code {
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  color: #16a34a;
  background: #f0fdf4;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid #bbf7d0;
}

.status-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 800;
}

.status-pill.active {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.status-pill.inactive {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.row-inactive {
  opacity: 0.5;
}

/* Inherit shared styles from admin.vue parent */
.section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 18px; }
.section-head p { margin: 0 0 6px; color: var(--green-dark); font-size: 12px; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
.section-head h1 { margin: 0; font-size: clamp(28px, 3vw, 42px); line-height: 1; }
.toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: space-between; margin-bottom: 14px; }
.section-head > .toolbar { flex: 0 0 auto; justify-content: flex-end; margin-bottom: 0; }
.search-box { flex: 1 1 320px; min-width: 240px; height: 40px; display: flex; align-items: center; gap: 8px; border: 1px solid var(--line); border-radius: 8px; background: #fff; padding: 0 12px; }
.search-box svg { width: 16px; height: 16px; color: #94a3b8; }
.search-box input { flex: 1; min-width: 0; height: 100%; border: 0; padding: 0; background: transparent; font: inherit; font-size: 13px; outline: none; }
.search-box:focus-within { border-color: var(--green); box-shadow: 0 0 0 3px rgba(22,163,74,.12); }
.notice { margin-bottom: 14px; border-radius: 8px; padding: 11px 13px; font-size: 13px; font-weight: 750; }
.notice.success { background: var(--green-soft); color: var(--green-dark); border: 1px solid #bbf7d0; }
.notice.error { background: var(--red-soft); color: var(--red); border: 1px solid #fecaca; }
.table-wrap { width: 100%; overflow-x: auto; border: 1px solid var(--line); border-radius: 8px; }
.table-wrap.compact { margin-top: 0; }
.admin-table { width: 100%; min-width: 1120px; border-collapse: collapse; table-layout: fixed; }
.admin-table .col-code { width: 11%; }
.admin-table .col-name { width: 27%; }
.admin-table .col-city { width: 12%; }
.admin-table .col-country { width: 12%; }
.admin-table .col-status { width: 12%; }
.admin-table .col-sort { width: 14%; }
.admin-table .col-actions { width: 12%; }
.admin-table th, .admin-table td { padding: 13px 14px; border-bottom: 1px solid #edf2f7; text-align: left; vertical-align: middle; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.admin-table th { color: #64748b; background: #f8fafc; font-size: 11px; font-weight: 850; letter-spacing: .06em; text-transform: uppercase; }
.admin-table tbody tr:last-child td { border-bottom: 0; }
.actions-col { text-align: right !important; white-space: nowrap; }
.primary-btn, .ghost-btn { min-height: 40px; border-radius: 8px; border: 1px solid transparent; padding: 0 14px; font: inherit; font-size: 13px; font-weight: 750; cursor: pointer; }
.primary-btn { background: var(--green); border-color: var(--green); color: #fff; }
.primary-btn:hover:not(:disabled) { background: var(--green-dark); border-color: var(--green-dark); }
.ghost-btn { background: #fff; border-color: var(--line); color: var(--ink); }
.edit-row-btn { width: 34px; min-height: 34px; display: inline-grid; place-items: center; padding: 0; background: var(--ink); border: 1px solid var(--ink); border-radius: 8px; color: #fff; cursor: pointer; }
.edit-row-btn svg { width: 15px; height: 15px; }
.icon-text-btn { display: inline-flex; align-items: center; gap: 6px; }
.icon-text-btn svg { width: 16px; height: 16px; }
.icon-btn { width: 36px; height: 36px; display: grid; place-items: center; border: 0; border-radius: 8px; background: transparent; cursor: pointer; color: var(--muted); }
.icon-btn:hover { background: #f1f5f9; color: var(--ink); }
.icon-btn svg { width: 18px; height: 18px; }
.modal-backdrop { position: fixed; inset: 0; display: grid; place-items: center; background: rgba(15,23,42,.4); z-index: 1000; padding: 20px; }
.account-dialog { width: min(620px, 100%); max-height: min(760px, calc(100vh - 48px)); background: #fff; border-radius: 16px; box-shadow: 0 25px 60px rgba(15,23,42,.2); overflow-y: auto; }
.modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 18px 22px 0; }
.modal-head p { margin: 0 0 6px; color: var(--green-dark); font-size: 12px; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
.modal-head h2 { margin: 0; font-size: 24px; line-height: 1.2; }
.modal-form { padding: 18px 22px 22px; }
.form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; margin-bottom: 14px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field span { font-size: 12px; font-weight: 800; color: var(--muted); }
.field input, .field select { width: 100%; height: 40px; border: 1px solid var(--line); border-radius: 8px; padding: 0 10px; font: inherit; font-size: 13px; background: #fff; color: var(--ink); outline: none; }
.field input:focus, .field select:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(22,163,74,.12); }
.switch-row { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; font-size: 13px; font-weight: 700; cursor: pointer; }
.switch-row input { width: 18px; height: 18px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 10px; border-top: 1px solid var(--line); }
button:disabled { opacity: .55; cursor: not-allowed; }
.spinner-sm { width: 16px; height: 16px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: spin .5s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
