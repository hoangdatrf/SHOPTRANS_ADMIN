<template>
  <div class="admin-main">
    <div class="section-head">
      <div>
        <p>Content Management</p>
        <h1>Products Page</h1>
      </div>
      <div class="toolbar" style="gap:8px">
        <button class="primary-btn icon-text-btn" type="button" @click="saveData" :disabled="saving">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div v-if="notice" class="notice success">{{ notice }}</div>
    <div v-if="error" class="notice error">{{ error }}</div>

    <div v-if="loading" style="text-align:center;padding:40px;color:var(--muted);font-weight:700;">Loading data...</div>
    
    <div v-else class="content-sections">
      <!-- Hero Section -->
      <div class="panel">
        <div class="panel-header">
          <h3>Hero Section</h3>
        </div>
        <div class="panel-body form-grid">
          <label class="field" style="grid-column: 1 / -1">
            <span>Title (HTML allowed)</span>
            <input v-model="pageData.hero.title" type="text" />
          </label>
          <label class="field" style="grid-column: 1 / -1">
            <span>Description</span>
            <textarea v-model="pageData.hero.description" rows="3" style="width:100%; border:1px solid var(--line); border-radius:8px; padding:10px; font:inherit; font-size:13px;"></textarea>
          </label>
        </div>
      </div>

      <!-- Services Section -->
      <div class="panel mt-4">
        <div class="panel-header" style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <h3>Services List</h3>
            <button class="primary-btn icon-text-btn" style="min-height:32px; font-size:12px;" type="button" @click="openCreateService">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              Add Service
            </button>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 16px;">
            <div style="display: flex; gap: 8px;">
              <select v-model="selectedServiceType" style="height: 32px; font-size: 12px; border: 1px solid var(--line); border-radius: 6px; padding: 0 10px; background: #fff;">
                <option value="all">All Types</option>
                <option value="fcl">FCL</option>
                <option value="lcl">LCL</option>
                <option value="air">AIR</option>
              </select>
              <select v-model="activeTab" style="height: 32px; font-size: 12px; border: 1px solid var(--line); border-radius: 6px; padding: 0 10px; background: #fff;">
                <option value="all">All Locations</option>
                <option value="origin">Origin</option>
                <option value="freight">Freight</option>
                <option value="destination">Destination</option>
              </select>
            </div>
            <div>
              <input v-model="search" type="text" placeholder="Search title or description..." style="height: 32px; font-size: 12px; border: 1px solid var(--line); border-radius: 6px; padding: 0 10px; min-width: 200px;" />
            </div>
          </div>
        </div>
        <div class="table-wrap compact">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width: 5%">ID</th>
                <th style="width: 27%">TITLE</th>
                <th style="width: 18%">SVC-SUB</th>
                <th style="width: 12%">TAB</th>
                <th style="width: 11%">TYPE</th>
                <th style="width: 10%">STATUS</th>
                <th style="width: 7%">SORT</th>
                <th class="actions-col" style="width: 10%">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredServices" :key="item.id || index" :class="{ 'row-inactive': !item.isActive }">
                <td>{{ item.id }}</td>
                <td><strong>{{ item.title }}</strong></td>
                <td>{{ item.subtitle || '-' }}</td>
                <td><span style="text-transform: capitalize;">{{ item.tab }}</span></td>
                <td><span style="text-transform: uppercase;">{{ item.serviceType }}</span></td>
                <td>
                  <span class="status-pill" :class="item.isActive ? 'active' : 'inactive'">
                    {{ item.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ item.sortOrder }}</td>
                <td class="actions-col">
                  <button class="edit-row-btn" type="button" @click="openEditService(item)" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </button>
                  <button
                    class="edit-row-btn"
                    :class="item.isActive ? 'disable-row-btn' : 'enable-row-btn'"
                    style="margin-left:8px;"
                    type="button"
                    @click="toggleServiceVisibility(item)"
                    :title="item.isActive ? 'Disable on website' : 'Enable on website'"
                  >
                    <svg v-if="item.isActive" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </td>
              </tr>
              <tr v-if="!filteredServices || filteredServices.length === 0">
                <td colspan="8" style="text-align:center; padding:30px; color:var(--muted);">No services found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal for Service -->
    <div v-if="modalOpen" class="modal-backdrop" role="presentation" @click.self="closeModal">
      <section class="account-dialog" role="dialog" aria-modal="true" style="max-width:720px;">
        <div class="modal-head">
          <div>
            <p>{{ modalMode === 'create' ? 'Add New Service' : 'Edit Service' }}</p>
            <h2>{{ form.title || 'Service Details' }}</h2>
          </div>
          <button class="icon-btn" type="button" aria-label="Close" @click="closeModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="modal-form" style="max-height: calc(100vh - 180px); overflow-y: auto;">
          <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
            <label class="field" style="grid-column: 1 / -1">
              <span>Title *</span>
              <input v-model.trim="form.title" type="text" />
            </label>
            <label class="field" style="grid-column: 1 / -1">
              <span>Subtitle / svc-sub</span>
              <input v-model.trim="form.subtitle" type="text" />
            </label>
            <label class="field" style="grid-column: 1 / -1">
              <span>Description</span>
              <textarea v-model="form.description" rows="2" style="width:100%; border:1px solid var(--line); border-radius:8px; padding:10px; font:inherit; font-size:13px;"></textarea>
            </label>
            <label class="field">
              <span>Tab (origin, destination, etc.)</span>
              <select v-model="form.tab">
                <option value="origin">Origin</option>
                <option value="destination">Destination</option>
                <option value="freight">Freight</option>
                <option value="custom">Custom</option>
              </select>
            </label>
            <label class="field">
              <span>Service Type</span>
              <select v-model="form.serviceType">
                <option value="fcl">FCL</option>
                <option value="lcl">LCL</option>
                <option value="air">Air</option>
                <option value="customs">Customs</option>
              </select>
            </label>
            <label class="field">
              <span>Sort Order</span>
              <input v-model.number="form.sortOrder" type="number" />
            </label>
            <label class="field" style="grid-column: 1 / -1">
              <h4 style="margin: 10px 0 5px; font-size: 14px;">Price Box Info</h4>
            </label>
            <label class="field">
              <span>Price Route - From</span>
              <input v-model.trim="form.route.from" type="text" placeholder="Binh Duong - 75000" />
            </label>
            <label class="field">
              <span>Price Route - To</span>
              <input v-model.trim="form.route.to" type="text" placeholder="Cat Lai, HCMC" />
            </label>
            <label class="field">
              <span>Price Value</span>
              <input v-model.trim="form.price.price" type="text" placeholder="$1,250" />
            </label>
            <label class="field">
              <span>Price Unit</span>
              <input v-model.trim="form.price.unit" type="text" placeholder="/ 20GP" />
            </label>
          </div>
          
          <div style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4 style="margin: 0; font-size: 14px;">Scope Items</h4>
              <button class="ghost-btn" style="min-height: 28px; padding: 0 10px; font-size: 11px;" type="button" @click="addScopeItem">
                + Add Item
              </button>
            </div>
            <div v-for="(item, idx) in form.scopeItems" :key="idx" class="scope-row" :class="{ muted: item.isActive === false }">
              <input v-model="item.text" type="text" style="flex:1; height:36px; border:1px solid var(--line); border-radius:6px; padding:0 10px;" placeholder="Item text..." />
              <label style="display:flex; align-items:center; gap:5px; font-size:12px; white-space:nowrap;">
                <input type="checkbox" v-model="item.excluded" /> Excluded?
              </label>
              <button
                class="icon-btn"
                type="button"
                :title="item.isActive === false ? 'Enable scope item' : 'Disable scope item'"
                @click="item.isActive = item.isActive === false"
              >
                <svg v-if="item.isActive !== false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/></svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div v-if="!form.scopeItems || form.scopeItems.length === 0" style="color:var(--muted); font-size:12px;">No scope items defined.</div>
          </div>

          <label class="switch-row" style="margin-top: 20px;">
            <input v-model="form.isActive" type="checkbox" />
            <span>{{ form.isActive ? 'Active' : 'Inactive' }} (Show on website)</span>
          </label>
          
          <div class="modal-actions">
            <button class="ghost-btn" type="button" @click="closeModal">Cancel</button>
            <button class="primary-btn" type="button" :disabled="saving" @click="applyService">
              {{ saving ? 'Saving...' : (modalMode === 'create' ? 'Add & Save' : 'Update & Save') }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '~/store/user'

const API_BASE = useApiBaseUrl('/api')
const userStore = useUserStore()

const loading = ref(true)
const saving = ref(false)
const notice = ref('')
const error = ref('')

const search = ref('')
const activeTab = ref<'origin' | 'freight' | 'destination' | 'all'>('origin')
const selectedServiceType = ref<'fcl' | 'lcl' | 'air' | 'all'>('fcl')

// Default structure
const pageData = reactive({
  hero: { title: '', description: '' },
  services: [] as any[],
  routes: {},
  prices: {}
})

const getProductCode = (title: string) => {
  const t = String(title || '').toLowerCase()
  if (t.includes('exw')) return 'EXW'
  if (t.includes('fca')) return 'FCA'
  if (t.includes('dap')) return 'DAP'
  if (t.includes('ddu')) return 'DDU'
  if (t.includes('ddp')) return 'DDP'
  if (t.includes('customs clearance')) return 'CCL'
  if (t.includes('cargo insurance')) return 'INS'
  if (t.includes('collect/pay charges')) return 'CLP'
  if (t.includes('switch bill of lading')) return 'SBL'
  if (t.includes('offered rate')) return 'OFR'
  if (t.includes('spot rate')) return 'SPT'
  if (t.includes('available booking')) return 'OBK'
  if (t.includes('service contract')) return 'SVC'
  if (t.includes('delivery order')) return 'DOR'
  return 'SVC'
}

const getDefaultSubtitle = (service: any) => {
  const code = getProductCode(service.title)
  const isLcl = service.serviceType === 'lcl'
  const isAir = service.serviceType === 'air'

  if (code === 'EXW') return isAir ? 'Door-to-airport warehouse, customs clearance included' : (isLcl ? 'Door-to-CFS warehouse, customs clearance included' : 'Door-to-port, customs clearance included')
  if (code === 'FCA') return isAir ? 'Door-to-airport warehouse, shipper handles customs' : (isLcl ? 'Door-to-CFS warehouse, shipper handles customs' : 'Door-to-port, shipper handles customs')
  if (code === 'DAP') return isAir ? "From airport warehouse to consignee's door (customs clearance excluded)" : (isLcl ? "From CFS warehouse to consignee's door (customs clearance excluded)" : "From POD to consignee's door (customs clearance excluded)")
  if (code === 'DDP') return isAir ? "From airport warehouse to consignee's door (import duty included)" : (isLcl ? "From CFS warehouse to consignee's door (import duty included)" : "From POD to consignee's door (import duty included)")
  if (code === 'DDU') return isAir ? "From airport warehouse to consignee's door (import duty excluded)" : (isLcl ? "From CFS warehouse to consignee's door (import duty excluded)" : "From POD to consignee's door (import duty excluded)")
  if (code === 'CCL') return 'Customs clearance and duties'
  if (code === 'INS') return 'All-risk marine coverage'
  if (code === 'CLP') return 'Charge collection & disbursement'
  if (code === 'SBL') return 'Multi-country B/L switching'
  if (code === 'DOR') return 'Destination agent role - D/O release'
  if (code === 'OFR') return 'Match your target rate & book instantly'
  if (code === 'SPT') return 'Multi-carrier SPOT under Shoptrans S/C'
  if (code === 'OBK') return 'Shoptrans as your operations agent'
  return 'Operate under Shoptrans S/C or quote'
}

const getDefaultScopeItems = (service: any) => {
  const code = getProductCode(service.title)
  const isLcl = service.serviceType === 'lcl'
  const isAir = service.serviceType === 'air'
  const isDestination = service.tab === 'destination'

  if (code === 'EXW' || code === 'FCA') {
    return [
      { text: (isLcl || isAir) ? 'Cargo pickup and drop off' : 'Empty container pickup & full container drop-off', excluded: false, isActive: true },
      { text: 'Export customs clearance', excluded: code === 'FCA', isActive: true },
      { text: isAir ? 'Trucking to export airport warehouse' : (isLcl ? 'Trucking to export CFS warehouse' : 'Trucking to loading depot or port of loading'), excluded: false, isActive: true }
    ]
  }
  if (code === 'DAP') {
    return [
      { text: 'Import handling at destination', excluded: false, isActive: true },
      { text: (isLcl || isAir) ? "Cargo delivery to the consignee's door" : "Container delivery to consignee's door", excluded: false, isActive: true },
      { text: 'Import customs clearance', excluded: true, isActive: true }
    ]
  }
  if (code === 'DDU' || code === 'DDP') {
    return [
      { text: 'Import handling at destination', excluded: false, isActive: true },
      { text: 'Import customs clearance', excluded: false, isActive: true },
      { text: (isLcl || isAir) ? "Cargo delivery to the consignee's door" : "Container delivery to consignee's door", excluded: false, isActive: true },
      { text: 'Import duty & taxes', excluded: code === 'DDU', isActive: true }
    ]
  }
  if (code === 'CCL') {
    return [
      { text: isDestination ? 'Import customs clearance' : 'Export customs clearance', excluded: false, isActive: true },
      { text: 'Duty & tax facilitation', excluded: false, isActive: true },
      { text: isDestination ? "Delivery to consignee's door" : (isAir ? 'Trucking to export airport warehouse' : (isLcl ? 'Trucking to export CFS warehouse' : 'Trucking to loading depot or port of loading')), excluded: true, isActive: true }
    ]
  }
  const simpleScopes: Record<string, string[]> = {
    INS: ['All-risk policy placement', 'Coverage up to 110% of FOB value', 'Claims handling & support'],
    CLP: ['Charge collection on your behalf', 'Disbursement to nominated parties', 'Invoice reconciliation'],
    SBL: ['Worldwide switching hubs', 'Legal procedures handled', 'Cost-effective routing'],
    DOR: ['Agent-of-record at destination', 'D/O release per instructions', 'Detailed shipment updates'],
    OFR: ['Live published rate cards', 'Instant rate lock', 'Booking placed with carrier'],
    SPT: ['Multi-line SPOT rate comparison', 'Service contract filed under Shoptrans', 'Direct carrier booking'],
    OBK: ['Booking handover & validation', 'Shipper coordination', 'Export documentation'],
    SVC: ['Live market rate', 'Booking placement with carrier(s)', 'Export business handling']
  }
  return (simpleScopes[code] || simpleScopes.SVC).map((text) => ({ text, excluded: false, isActive: true }))
}

const getDefaultPrice = (service: any) => {
  const code = getProductCode(service.title)
  const type = service.serviceType

  if (code === 'EXW') return type === 'fcl' ? { price: '$1,250', unit: '/ 20GP' } : type === 'lcl' ? { price: '$280', unit: '/ CBM' } : { price: '$2.80', unit: '/ kg' }
  if (code === 'FCA') return type === 'fcl' ? { price: '$980', unit: '/ 20GP' } : type === 'lcl' ? { price: '$220', unit: '/ CBM' } : { price: '$2.20', unit: '/ kg' }
  if (code === 'CCL') return type === 'air' ? { price: '$180', unit: '/ CDS' } : { price: '$220', unit: '/ CDS' }
  if (code === 'INS') return { price: '$45', unit: '/ Set' }
  if (code === 'CLP') return { price: '$35', unit: '/ transaction' }
  if (code === 'OFR') return { price: '$850', unit: '/ 20GP' }
  if (code === 'SPT') return { price: '$950', unit: '/ 20GP' }
  if (['OBK', 'SVC'].includes(code)) return { price: '$50', unit: '/ booking' }
  if (code === 'SBL') return { price: '$50', unit: '/ B/L' }
  if (code === 'DAP') return type === 'fcl' ? { price: '$950', unit: '/ 20GP' } : type === 'lcl' ? { price: '$65', unit: '/ CBM' } : { price: '$4.20', unit: '/ kg' }
  if (code === 'DDU') return type === 'fcl' ? { price: '$1,350', unit: '/ 20GP' } : type === 'lcl' ? { price: '$80', unit: '/ CBM' } : { price: '$4.80', unit: '/ kg' }
  if (code === 'DDP') return type === 'fcl' ? { price: '$1,650', unit: '/ 20GP' } : type === 'lcl' ? { price: '$95', unit: '/ CBM' } : { price: '$5.50', unit: '/ kg' }
  if (code === 'DOR') return type === 'fcl' ? { price: '$80', unit: '/ D/O' } : { price: '$50', unit: '/ D/O' }
  return type === 'fcl' ? { price: '$100', unit: '/ 20GP' } : type === 'lcl' ? { price: '$30', unit: '/ CBM' } : { price: '$2.50', unit: '/ kg' }
}

const normalizeServiceForCms = (service: any) => {
  const code = getProductCode(service.title)
  const routeKey = `${service.tab}:${service.serviceType}:${code}`
  return {
    ...service,
    subtitle: service.subtitle || getDefaultSubtitle(service),
    route: service.route && Object.keys(service.route).length ? service.route : (pageData.routes as any)[routeKey] || { type: 'route', from: '', to: '' },
    price: service.price && Object.keys(service.price).length ? service.price : getDefaultPrice(service),
    scopeItems: Array.isArray(service.scopeItems) && service.scopeItems.length ? service.scopeItems : getDefaultScopeItems(service)
  }
}

const normalizeProductServices = () => {
  pageData.services = pageData.services.map((service) => normalizeServiceForCms(service))
}

const filteredServices = computed(() => {
  return pageData.services.filter(service => {
    if (activeTab.value !== 'all' && service.tab !== activeTab.value) return false
    if (selectedServiceType.value !== 'all' && service.serviceType !== selectedServiceType.value) return false
    if (search.value) {
      const q = search.value.toLowerCase()
      if (!service.title?.toLowerCase().includes(q) && !service.description?.toLowerCase().includes(q)) return false
    }
    return true
  })
})

const fetchPageData = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/page-content/admin/products`, {
      headers: { 'Authorization': `Bearer ${userStore.token || ''}` }
    })
    if (!res.ok) {
      const fail = await res.json().catch(() => null)
      throw new Error(fail?.message || 'Failed to load page content')
    }
    const json = await res.json()
    const content = json.data?.data || json.data || json
    if (content && typeof content === 'object') {
      if (content.hero) pageData.hero = { ...pageData.hero, ...content.hero }
      if (Array.isArray(content.services)) pageData.services = JSON.parse(JSON.stringify(content.services))
      if (content.routes) pageData.routes = content.routes
      if (content.prices) pageData.prices = content.prices
      normalizeProductServices()
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load page content'
  } finally {
    loading.value = false
  }
}

const saveData = async () => {
  saving.value = true
  notice.value = ''
  error.value = ''
  try {
    normalizeProductServices()
    const res = await fetch(`${API_BASE}/page-content/admin/products`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token || ''}`
      },
      body: JSON.stringify({
        data: {
          hero: pageData.hero,
          services: pageData.services,
          routes: pageData.routes,
          prices: pageData.prices
        },
        isPublished: true
      })
    })
    if (!res.ok) {
      const fail = await res.json().catch(() => null)
      throw new Error(fail?.message || 'Failed to save')
    }
    notice.value = 'Products page content updated successfully. Changes are now live.'
    setTimeout(() => { notice.value = '' }, 4000)
    return true
  } catch (e: any) {
    error.value = e.message || 'Error saving changes'
    return false
  } finally {
    saving.value = false
  }
}

// Modal State
const modalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const editingIndex = ref(-1)

const form = reactive({
  id: Date.now(),
  title: '',
  description: '',
  image: '',
  tab: 'origin',
  serviceType: 'fcl',
  isActive: true,
  sortOrder: 1,
  subtitle: '',
  route: { type: 'route', from: '', to: '' },
  price: { price: '', unit: '' },
  scopeItems: [] as { text: string; excluded: boolean; isActive?: boolean }[]
})

const openCreateService = () => {
  form.id = Date.now()
  form.title = ''
  form.description = ''
  form.image = 'serviceImage'
  form.tab = 'origin'
  form.serviceType = 'fcl'
  form.isActive = true
  form.sortOrder = pageData.services.length + 1
  form.subtitle = ''
  form.route = { type: 'route', from: '', to: '' }
  form.price = { price: '', unit: '' }
  form.scopeItems = [
    { text: 'Example included item', excluded: false },
    { text: 'Example excluded item', excluded: true }
  ]
  modalMode.value = 'create'
  modalOpen.value = true
}

const openEditService = (item: any) => {
  const index = pageData.services.findIndex(s => s === item)
  if (index === -1) return
  editingIndex.value = index
  form.id = item.id || Date.now()
  form.title = item.title || ''
  form.description = item.description || ''
  form.image = item.image || ''
  form.tab = item.tab || 'origin'
  form.serviceType = item.serviceType || 'fcl'
  form.isActive = item.isActive !== false
  form.sortOrder = item.sortOrder || 1
  form.subtitle = item.subtitle || ''
  form.route = item.route ? JSON.parse(JSON.stringify(item.route)) : { type: 'route', from: '', to: '' }
  form.price = item.price ? JSON.parse(JSON.stringify(item.price)) : { price: '', unit: '' }
  form.scopeItems = item.scopeItems ? JSON.parse(JSON.stringify(item.scopeItems)) : []
  modalMode.value = 'edit'
  modalOpen.value = true
}

const addScopeItem = () => {
  form.scopeItems.push({ text: '', excluded: false, isActive: true })
}

const applyService = async () => {
  const serviceData = normalizeServiceForCms(JSON.parse(JSON.stringify(form)))
  if (modalMode.value === 'create') {
    pageData.services.push(serviceData)
  } else {
    pageData.services[editingIndex.value] = serviceData
  }
  // Optional: Auto-sort by sortOrder
  pageData.services.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0))
  const saved = await saveData()
  if (saved) closeModal()
}

const toggleServiceVisibility = async (item: any) => {
  const index = pageData.services.findIndex(s => s === item)
  if (index !== -1) {
    pageData.services[index].isActive = pageData.services[index].isActive === false
    await saveData()
  }
}

const closeModal = () => {
  modalOpen.value = false
}

onMounted(() => {
  fetchPageData()
})
</script>

<style scoped>
.admin-main { min-height: 100vh; margin-left: 280px; padding: 28px; }
.section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 24px; }
.section-head p { margin: 0 0 6px; color: var(--green-dark); font-size: 12px; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
.section-head h1 { margin: 0; font-size: clamp(28px, 3vw, 42px); line-height: 1; }
.toolbar { display: flex; align-items: center; }

.notice { margin-bottom: 14px; border-radius: 8px; padding: 11px 13px; font-size: 13px; font-weight: 750; }
.notice.success { background: var(--green-soft); color: var(--green-dark); border: 1px solid #bbf7d0; }
.notice.error { background: var(--red-soft); color: var(--red); border: 1px solid #fecaca; }

.panel { background: #fff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
.panel-header { background: #f8fafc; padding: 16px 20px; border-bottom: 1px solid var(--line); }
.panel-header h3 { margin: 0; font-size: 16px; font-weight: 700; color: var(--ink); }
.panel-body { padding: 20px; }
.mt-4 { margin-top: 24px; }

.form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field span { font-size: 12px; font-weight: 800; color: var(--muted); }
.field input, .field select { width: 100%; height: 40px; border: 1px solid var(--line); border-radius: 8px; padding: 0 10px; font: inherit; font-size: 13px; background: #fff; color: var(--ink); outline: none; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(22,163,74,.12); }

.table-wrap { width: 100%; overflow-x: auto; }
.admin-table { width: 100%; min-width: 800px; border-collapse: collapse; table-layout: fixed; }
.admin-table th, .admin-table td { padding: 13px 14px; border-bottom: 1px solid #edf2f7; text-align: left; vertical-align: middle; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.admin-table th { color: #64748b; background: #f8fafc; font-size: 11px; font-weight: 850; letter-spacing: .06em; text-transform: uppercase; }
.admin-table tbody tr:last-child td { border-bottom: 0; }
.actions-col { text-align: right !important; white-space: nowrap; }

.status-pill { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 800; }
.status-pill.active { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.status-pill.inactive { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.row-inactive { opacity: 0.55; }
.scope-row { display: flex; gap: 10px; margin-bottom: 10px; align-items: center; }
.scope-row.muted { opacity: .55; }

.primary-btn, .ghost-btn { min-height: 40px; border-radius: 8px; border: 1px solid transparent; padding: 0 14px; font: inherit; font-size: 13px; font-weight: 750; cursor: pointer; transition: all 0.15s; }
.primary-btn { background: var(--green); border-color: var(--green); color: #fff; }
.primary-btn:hover:not(:disabled) { background: var(--green-dark); border-color: var(--green-dark); }
.ghost-btn { background: #fff; border-color: var(--line); color: var(--ink); }
.ghost-btn:hover { background: #f1f5f9; }

.edit-row-btn { width: 34px; min-height: 34px; display: inline-grid; place-items: center; padding: 0; background: var(--ink); border: 1px solid var(--ink); border-radius: 8px; color: #fff; cursor: pointer; transition: opacity 0.15s; }
.edit-row-btn:hover { opacity: 0.85; }
.edit-row-btn svg { width: 15px; height: 15px; }
.disable-row-btn { background: #f97316; border-color: #f97316; }
.enable-row-btn { background: var(--green); border-color: var(--green); }
.icon-text-btn { display: inline-flex; align-items: center; gap: 6px; }
.icon-text-btn svg { width: 16px; height: 16px; }
.icon-btn { width: 36px; height: 36px; display: grid; place-items: center; border: 0; border-radius: 8px; background: transparent; cursor: pointer; color: var(--muted); }
.icon-btn:hover { background: #f1f5f9; color: var(--ink); }

.modal-backdrop { position: fixed; inset: 0; display: grid; place-items: center; background: rgba(15,23,42,.4); z-index: 1000; padding: 20px; }
.account-dialog { width: 100%; background: #fff; border-radius: 16px; box-shadow: 0 25px 60px rgba(15,23,42,.2); }
.modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 18px 22px 10px; border-bottom: 1px solid var(--line); }
.modal-head p { margin: 0 0 6px; color: var(--green-dark); font-size: 12px; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
.modal-head h2 { margin: 0; font-size: 24px; line-height: 1.2; }
.modal-form { padding: 18px 22px 22px; }
.switch-row { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; cursor: pointer; }
.switch-row input { width: 18px; height: 18px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 16px; margin-top: 20px; border-top: 1px solid var(--line); }
button:disabled { opacity: .55; cursor: not-allowed; }
</style>
