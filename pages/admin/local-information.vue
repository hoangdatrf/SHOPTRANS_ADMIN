<template>
  <div class="admin-main">
    <div class="section-head">
      <div>
        <p>Content Management</p>
        <h1>Local Information</h1>
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
          <label class="field">
            <span>Eyebrow</span>
            <input v-model="pageData.hero.eyebrow" type="text" />
          </label>
          <label class="field">
            <span>Title</span>
            <input v-model="pageData.hero.title" type="text" />
          </label>
          <label class="field" style="grid-column: 1 / -1">
            <span>Description</span>
            <textarea v-model="pageData.hero.description" rows="3" style="width:100%; border:1px solid var(--line); border-radius:8px; padding:10px; font:inherit; font-size:13px;"></textarea>
          </label>
        </div>
      </div>

      <!-- Countries List Section -->
      <div class="panel mt-4">
        <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center;">
          <h3>Countries Content</h3>
          <button class="primary-btn icon-text-btn" style="min-height:32px; font-size:12px;" type="button" @click="openCreateCountry">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            Add Country
          </button>
        </div>
        <div class="table-wrap compact">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width: 15%">CODE</th>
                <th style="width: 25%">NAME</th>
                <th style="width: 10%">ISO</th>
                <th style="width: 15%">FLAG KEY</th>
                <th style="width: 10%">STATUS</th>
                <th style="width: 10%">SORT</th>
                <th class="actions-col" style="width: 15%">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in pageData.countries" :key="item.code || index" :class="{ 'row-inactive': !item.isActive }">
                <td><code class="icd-code">{{ item.code }}</code></td>
                <td><strong>{{ item.name }}</strong></td>
                <td>{{ item.iso }}</td>
                <td>{{ item.flagKey }}</td>
                <td>
                  <span class="status-pill" :class="item.isActive ? 'active' : 'inactive'">
                    {{ item.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ item.sortOrder }}</td>
                <td class="actions-col">
                  <button class="edit-row-btn" type="button" @click="openEditCountry(index)" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </button>
                  <button
                    class="edit-row-btn"
                    :class="item.isActive ? 'disable-row-btn' : 'enable-row-btn'"
                    style="margin-left:8px;"
                    type="button"
                    @click="toggleCountryVisibility(index)"
                    :title="item.isActive ? 'Disable on website' : 'Enable on website'"
                  >
                    <svg v-if="item.isActive" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </td>
              </tr>
              <tr v-if="!pageData.countries || pageData.countries.length === 0">
                <td colspan="7" style="text-align:center; padding:30px; color:var(--muted);">No countries added yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal for Country -->
    <div v-if="modalOpen" class="modal-backdrop" role="presentation" @click.self="closeModal">
      <section class="account-dialog" role="dialog" aria-modal="true" style="max-width:800px;">
        <div class="modal-head">
          <div>
            <p>{{ modalMode === 'create' ? 'Add New Country' : 'Edit Country' }}</p>
            <h2>{{ form.name || 'Country Details' }}</h2>
          </div>
          <button class="icon-btn" type="button" aria-label="Close" @click="closeModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div class="modal-tabs">
          <button :class="{ active: modalTab === 'general' }" @click="modalTab = 'general'">General</button>
          <button :class="{ active: modalTab === 'import' }" @click="modalTab = 'import'">Import Info</button>
          <button :class="{ active: modalTab === 'export' }" @click="modalTab = 'export'">Export Info</button>
          <button :class="{ active: modalTab === 'payment' }" @click="modalTab = 'payment'">Payment Info</button>
        </div>

        <div class="modal-form" style="max-height: calc(100vh - 230px); overflow-y: auto;">
          <!-- GENERAL TAB -->
          <div v-if="modalTab === 'general'" class="form-grid" style="grid-template-columns: 1fr 1fr;">
            <label class="field">
              <span>Code (e.g. VIET NAM) *</span>
              <input v-model.trim="form.code" type="text" />
            </label>
            <label class="field">
              <span>Name (e.g. Viet Nam) *</span>
              <input v-model.trim="form.name" type="text" />
            </label>
            <label class="field">
              <span>ISO Code (e.g. VN)</span>
              <input v-model.trim="form.iso" type="text" />
            </label>
            <label class="field">
              <span>Flag Key (e.g. vietnam)</span>
              <input v-model.trim="form.flagKey" type="text" />
            </label>
            <label class="field">
              <span>Sort Order</span>
              <input v-model.number="form.sortOrder" type="number" />
            </label>
            <label class="switch-row" style="margin-top:24px;">
              <input v-model="form.isActive" type="checkbox" />
              <span>Active</span>
            </label>
            <label class="field" style="grid-column: 1 / -1">
              <span>Subtitle</span>
              <input v-model.trim="form.subtitle" type="text" />
            </label>
          </div>
          
          <!-- IMPORT TAB -->
          <div v-if="modalTab === 'import'">
            <label class="field" style="margin-bottom:16px;">
              <span>Import Intro</span>
              <textarea v-model="form.importIntro" rows="2" style="width:100%; border:1px solid var(--line); border-radius:6px; padding:10px; font:inherit; font-size:13px;"></textarea>
            </label>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4 style="margin: 0; font-size: 14px;">Import Items (Accordion)</h4>
              <button class="ghost-btn" style="min-height: 28px; padding: 0 10px; font-size: 11px;" type="button" @click="addAccordionItem('import')">
                + Add Item
              </button>
            </div>
            <div v-for="(item, idx) in form.importItems" :key="idx" class="accordion-editor" :class="{ muted: item.isActive === false }">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <input v-model="item.title" type="text" style="flex:1; height:36px; border:1px solid var(--line); border-radius:6px; padding:0 10px; font:inherit; font-weight:700;" placeholder="Item Title..." />
                <button class="icon-btn" style="margin-left:8px;" type="button" @click="item.isActive = item.isActive === false" :title="item.isActive === false ? 'Enable item' : 'Disable item'">
                  <svg v-if="item.isActive !== false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <textarea v-model="item.content" rows="3" style="width:100%; border:1px solid var(--line); border-radius:6px; padding:10px; font:inherit; font-size:13px;" placeholder="Item Content (HTML allowed)"></textarea>
            </div>
            <div v-if="!form.importItems || form.importItems.length === 0" style="color:var(--muted); font-size:12px;">No import items.</div>
          </div>

          <!-- EXPORT TAB -->
          <div v-if="modalTab === 'export'">
            <label class="field" style="margin-bottom:16px;">
              <span>Export Intro</span>
              <textarea v-model="form.exportIntro" rows="2" style="width:100%; border:1px solid var(--line); border-radius:6px; padding:10px; font:inherit; font-size:13px;"></textarea>
            </label>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4 style="margin: 0; font-size: 14px;">Export Items (Accordion)</h4>
              <button class="ghost-btn" style="min-height: 28px; padding: 0 10px; font-size: 11px;" type="button" @click="addAccordionItem('export')">
                + Add Item
              </button>
            </div>
            <div v-for="(item, idx) in form.exportItems" :key="idx" class="accordion-editor" :class="{ muted: item.isActive === false }">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <input v-model="item.title" type="text" style="flex:1; height:36px; border:1px solid var(--line); border-radius:6px; padding:0 10px; font:inherit; font-weight:700;" placeholder="Item Title..." />
                <button class="icon-btn" style="margin-left:8px;" type="button" @click="item.isActive = item.isActive === false" :title="item.isActive === false ? 'Enable item' : 'Disable item'">
                  <svg v-if="item.isActive !== false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <textarea v-model="item.content" rows="3" style="width:100%; border:1px solid var(--line); border-radius:6px; padding:10px; font:inherit; font-size:13px;" placeholder="Item Content (HTML allowed)"></textarea>
            </div>
            <div v-if="!form.exportItems || form.exportItems.length === 0" style="color:var(--muted); font-size:12px;">No export items.</div>
          </div>

          <!-- PAYMENT TAB -->
          <div v-if="modalTab === 'payment'">
            <label class="field" style="margin-bottom:16px;">
              <span>Payment Intro</span>
              <textarea v-model="form.paymentIntro" rows="2" style="width:100%; border:1px solid var(--line); border-radius:6px; padding:10px; font:inherit; font-size:13px;"></textarea>
            </label>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4 style="margin: 0; font-size: 14px;">Payment Items (Accordion)</h4>
              <button class="ghost-btn" style="min-height: 28px; padding: 0 10px; font-size: 11px;" type="button" @click="addAccordionItem('payment')">
                + Add Item
              </button>
            </div>
            <div v-for="(item, idx) in form.paymentItems" :key="idx" class="accordion-editor" :class="{ muted: item.isActive === false }">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <input v-model="item.title" type="text" style="flex:1; height:36px; border:1px solid var(--line); border-radius:6px; padding:0 10px; font:inherit; font-weight:700;" placeholder="Item Title..." />
                <button class="icon-btn" style="margin-left:8px;" type="button" @click="item.isActive = item.isActive === false" :title="item.isActive === false ? 'Enable item' : 'Disable item'">
                  <svg v-if="item.isActive !== false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
              <textarea v-model="item.content" rows="3" style="width:100%; border:1px solid var(--line); border-radius:6px; padding:10px; font:inherit; font-size:13px;" placeholder="Item Content (HTML allowed)"></textarea>
            </div>
            <div v-if="!form.paymentItems || form.paymentItems.length === 0" style="color:var(--muted); font-size:12px;">No payment items.</div>
          </div>
          
          <div class="modal-actions">
            <button class="ghost-btn" type="button" @click="closeModal">Cancel</button>
            <button class="primary-btn" type="button" @click="applyCountry">
              {{ modalMode === 'create' ? 'Add Country' : 'Update Country' }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '~/store/user'

const API_BASE = useApiBaseUrl('/api')
const userStore = useUserStore()

const loading = ref(true)
const saving = ref(false)
const notice = ref('')
const error = ref('')

const pageData = reactive({
  hero: { eyebrow: '', title: '', description: '' },
  countries: [] as any[]
})

const fetchPageData = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/page-content/admin/local-information`, {
      headers: { 'Authorization': `Bearer ${userStore.token || ''}` }
    })
    const json = await res.json()
    const content = json.data?.data || json.data || json
    if (content && typeof content === 'object') {
      if (content.hero) pageData.hero = { ...pageData.hero, ...content.hero }
      if (Array.isArray(content.countries)) pageData.countries = JSON.parse(JSON.stringify(content.countries))
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
    const res = await fetch(`${API_BASE}/page-content/admin/local-information`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token || ''}`
      },
      body: JSON.stringify({
        data: {
          hero: pageData.hero,
          countries: pageData.countries
        },
        isPublished: true
      })
    })
    if (!res.ok) throw new Error('Failed to save')
    notice.value = 'Local Information content updated successfully.'
    setTimeout(() => { notice.value = '' }, 4000)
  } catch (e: any) {
    error.value = e.message || 'Error saving changes'
  } finally {
    saving.value = false
  }
}

// Modal State
const modalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const modalTab = ref<'general' | 'import' | 'export' | 'payment'>('general')
const editingIndex = ref(-1)

const form = reactive({
  code: '',
  name: '',
  iso: '',
  flagKey: '',
  isActive: true,
  sortOrder: 1,
  subtitle: '',
  importIntro: '',
  exportIntro: '',
  paymentIntro: '',
  importItems: [] as { title: string; content: string; isActive?: boolean }[],
  exportItems: [] as { title: string; content: string; isActive?: boolean }[],
  paymentItems: [] as { title: string; content: string; isActive?: boolean }[]
})

const openCreateCountry = () => {
  form.code = ''
  form.name = ''
  form.iso = ''
  form.flagKey = ''
  form.isActive = true
  form.sortOrder = pageData.countries.length + 1
  form.subtitle = ''
  form.importIntro = ''
  form.exportIntro = ''
  form.paymentIntro = ''
  form.importItems = []
  form.exportItems = []
  form.paymentItems = []
  modalTab.value = 'general'
  modalMode.value = 'create'
  modalOpen.value = true
}

const openEditCountry = (index: number) => {
  const item = pageData.countries[index]
  editingIndex.value = index
  form.code = item.code || ''
  form.name = item.name || ''
  form.iso = item.iso || ''
  form.flagKey = item.flagKey || ''
  form.isActive = item.isActive !== false
  form.sortOrder = item.sortOrder || 1
  form.subtitle = item.subtitle || ''
  form.importIntro = item.importIntro || ''
  form.exportIntro = item.exportIntro || ''
  form.paymentIntro = item.paymentIntro || ''
  form.importItems = item.importItems ? JSON.parse(JSON.stringify(item.importItems)) : []
  form.exportItems = item.exportItems ? JSON.parse(JSON.stringify(item.exportItems)) : []
  form.paymentItems = item.paymentItems ? JSON.parse(JSON.stringify(item.paymentItems)) : []
  modalTab.value = 'general'
  modalMode.value = 'edit'
  modalOpen.value = true
}

const addAccordionItem = (type: 'import'|'export'|'payment') => {
  if (type === 'import') form.importItems.push({ title: '', content: '', isActive: true })
  else if (type === 'export') form.exportItems.push({ title: '', content: '', isActive: true })
  else if (type === 'payment') form.paymentItems.push({ title: '', content: '', isActive: true })
}

const applyCountry = async () => {
  if (!form.code || !form.name) {
    error.value = 'Code and Name are required.'
    return
  }
  
  const countryData = JSON.parse(JSON.stringify(form))
  if (modalMode.value === 'create') {
    pageData.countries.push(countryData)
  } else {
    pageData.countries[editingIndex.value] = countryData
  }
  
  pageData.countries.sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0))
  await saveData()
  closeModal()
}

const toggleCountryVisibility = async (index: number) => {
  if (pageData.countries[index]) {
    pageData.countries[index].isActive = pageData.countries[index].isActive === false
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

.icd-code { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 700; color: #16a34a; background: #f0fdf4; padding: 3px 8px; border-radius: 6px; border: 1px solid #bbf7d0; }
.status-pill { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 800; }
.status-pill.active { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.status-pill.inactive { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.row-inactive { opacity: 0.55; }

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

.modal-tabs { display: flex; padding: 0 22px; border-bottom: 1px solid var(--line); background: #f8fafc; }
.modal-tabs button { background: transparent; border: none; border-bottom: 2px solid transparent; padding: 12px 16px; font: inherit; font-size: 13px; font-weight: 700; color: var(--muted); cursor: pointer; transition: all 0.15s; }
.modal-tabs button:hover { color: var(--ink); }
.modal-tabs button.active { color: var(--green-dark); border-bottom-color: var(--green); }

.modal-form { padding: 18px 22px 22px; }
.switch-row { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; cursor: pointer; }
.switch-row input { width: 18px; height: 18px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 16px; margin-top: 20px; border-top: 1px solid var(--line); }

.accordion-editor { border: 1px solid var(--line); border-radius: 8px; padding: 12px; margin-bottom: 12px; background: #fafafa; }
.accordion-editor.muted { opacity: .55; }
button:disabled { opacity: .55; cursor: not-allowed; }
</style>
