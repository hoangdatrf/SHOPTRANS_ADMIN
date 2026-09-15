<template>
  <div class="checklist-page">
    <template v-if="isChecklistTab">
    <header class="workspace-head">
      <button class="toggle" type="button" title="Toggle sidebar" @click="$emit('toggle-sidebar')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <b>DOCS CHECKLIST</b>
      <div class="head-spacer"></div>
      <div class="country-dd">
        <button class="country" type="button" :disabled="!canSwitchCountry" @click="toggleCountryMenu">
          <img :src="flagUrl(currentCountry?.flag)" alt="" />
          <span>{{ currentCountry?.name || 'Vietnam' }}</span>
          <svg v-if="canSwitchCountry" class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div v-if="canSwitchCountry && countryOpen" class="country-menu">
          <button v-for="country in countries" :key="country.id" type="button" :class="{ active: country.id === currentCountry?.id }" @click="selectCountry(country.id)">
            <img :src="flagUrl(country.flag)" alt="" /><span>{{ country.name }}</span>
          </button>
        </div>
      </div>
    </header>

    <nav class="tabs">
      <button
        v-for="tab in document.tabs"
        :key="tab.key"
        type="button"
        :class="{ active: tab.key === activeKey }"
        @click="activeKey = tab.key"
      >
        <span>{{ tab.label }}</span>
        <span v-if="canDeleteTab(tab)" class="tab-delete" title="Delete tab" @click.stop="openDeleteTab(tab)">×</span>
      </button>
      <button class="add-tab" type="button" @click="addTab">+ Add tab</button>
    </nav>

    <section class="checklist-card">
      <div class="toolbar">
        <template v-if="editing">
          <button class="edit active" type="button" @click="toggleEdit">✓ Done</button>
          <span class="edit-hint">Editing — changes save automatically</span>
        </template>
        <template v-else>
        <label class="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input v-model="query" placeholder="Filter items..." />
        </label>
        <div class="toolbar-spacer"></div>
        <button class="edit" type="button" @click="toggleEdit">✎ Edit</button>
        <button type="button" @click="resetChecks">↻ Reset</button>
        </template>
      </div>

      <div v-if="loading" class="empty">Loading checklist...</div>
      <div v-else-if="editing" class="edit-list">
        <article v-for="(section, sectionIndex) in activeTab.sections" :key="section.id" class="edit-section">
          <div class="edit-head">
            <span>{{ pad(sectionIndex + 1, 2) }}</span>
            <input v-model="section.title" placeholder="Section title..." @change="saveDocument" />
            <div class="edit-actions">
              <button type="button" title="Move up" @click="moveSection(sectionIndex, -1)">↑</button>
              <button type="button" title="Move down" @click="moveSection(sectionIndex, 1)">↓</button>
              <button class="danger" type="button" title="Delete section" @click="removeSection(sectionIndex)">×</button>
            </div>
          </div>
          <div v-for="(row, rowIndex) in section.rows" :key="row.id" class="edit-row">
            <div class="edit-row-main">
              <input v-model="row.lead" :placeholder="row.kind === 'subhead' ? 'Subheader...' : row.kind === 'intro' ? 'Note...' : 'Item text...'" @change="saveDocument" />
              <input v-if="row.kind === 'item'" v-model="row.detail" class="detail-input" placeholder="Hint / detail (optional)..." @change="saveDocument" />
            </div>
            <div class="edit-row-bar">
              <div class="kind-chips">
                <button type="button" :class="{ active: row.kind === 'item' }" @click="setKind(row, 'item')">Item</button>
                <button type="button" :class="{ active: row.kind === 'subhead' }" @click="setKind(row, 'subhead')">Subhead</button>
                <button type="button" :class="{ active: row.kind === 'intro' }" @click="setKind(row, 'intro')">Note</button>
              </div>
              <button v-if="row.kind === 'intro'" class="hot" type="button" :class="{ active: row.hot }" title="Emphasize" @click="toggleHot(row)">!</button>
              <div class="edit-actions row-actions">
                <button type="button" title="Move up" @click="moveRow(section, rowIndex, -1)">↑</button>
                <button type="button" title="Move down" @click="moveRow(section, rowIndex, 1)">↓</button>
                <button class="danger" type="button" title="Delete item" @click="removeRow(section, rowIndex)">×</button>
              </div>
            </div>
          </div>
          <div class="add-row-group">
            <button type="button" @click="addRow(section, 'item')">+ Item</button>
            <button type="button" @click="addRow(section, 'subhead')">+ Subheader</button>
            <button type="button" @click="addRow(section, 'intro')">+ Note</button>
          </div>
        </article>
        <button class="add-section" type="button" @click="addSection">+ Add section</button>
      </div>
      <div v-else class="columns" :class="{ single: sectionColumns.length === 1 }">
        <div v-for="(column, columnIndex) in sectionColumns" :key="columnIndex" class="checklist-column">
          <template v-for="entry in column" :key="entry.section.id">
            <div class="section-head">
              <span class="badge">{{ pad(entry.index + 1, 2) }}</span>
              <b>{{ entry.section.title }}</b>
              <i></i>
              <span class="section-progress"><i :style="{ width: `${sectionPercent(entry.section)}%` }"></i></span>
              <span>{{ sectionDone(entry.section) }}/{{ sectionTotal(entry.section) }}</span>
            </div>
            <div v-for="row in pinnedNotes(entry.section)" :key="`pin-${row.id}`" class="ckw-noterow pin">{{ row.lead }}</div>
            <template v-for="row in filteredRows(entry.section)" :key="row.id">
              <div v-if="row.kind === 'intro'" class="ckw-noterow" :class="{ hot: row.hot }">{{ row.lead }}</div>
              <div v-else-if="row.kind === 'subhead'" class="checklist-subhead">{{ row.lead }}</div>
              <button v-else class="item" type="button" :class="{ done: isDone(row.id) }" @click="toggleRow(row.id)">
                <span class="number">{{ pad(itemNumber(row.id), 3) }}</span>
                <span class="box">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.7"><path d="M4.5 10.2 8.2 14l7.6-8" /></svg>
                </span>
                <span class="text" :class="{ coded: isCodeRow(row) }">
                  <b :class="{ code: isCodeRow(row) }">{{ row.lead }}</b>
                  <small v-if="row.detail" :class="{ inline: isCodeRow(row) }">{{ row.detail }}</small>
                </span>
              </button>
            </template>
          </template>
        </div>
      </div>
    </section>
    </template>
    <AdminWorkbook
      v-else
      :title="activeTab.label"
      description=""
      group-label="Customs & Legal"
      :sheet-key="activeTab.key"
      :tabs="document.tabs"
      :request="request"
      :countries="countries"
      :current-country="currentCountry"
      :can-switch-country="canSwitchCountry"
      :controlled-tabs="true"
      :protected-tab-keys="protectedTabKeys"
      :show-add-tab="true"
      @toggle-sidebar="$emit('toggle-sidebar')"
      @select-country="$emit('select-country', $event)"
      @select-tab="activeKey = $event"
      @add-tab="addTab"
      @delete-tab="openDeleteTab"
    />
    <div v-if="tabModal.open" class="tab-modal">
      <button class="tab-backdrop" type="button" aria-label="Close" @click="closeTabModal"></button>
      <form class="tab-dialog std-dialog" @submit.prevent="createTab">
        <div class="std-head">Add new tab</div>
        <div class="std-desc">Enter a name for the new list.</div>
        <input ref="tabNameInput" v-model.trim="tabModal.name" class="std-input" type="text" autocomplete="off" @keydown.esc.prevent="closeTabModal" />
        <div class="std-foot"><button class="std-btn" type="button" @click="closeTabModal">Cancel</button><button class="std-btn primary" type="submit">Add</button></div>
      </form>
    </div>
    <div v-if="deleteTabModal.open" class="tab-modal">
      <button class="tab-backdrop" type="button" aria-label="Close" @click="closeDeleteTabModal"></button>
      <div class="tab-dialog std-dialog">
        <div class="std-head">Remove tab: {{ deleteTabModal.label }}</div>
        <div class="std-desc">This will permanently delete this tab and ALL its data. This cannot be undone. Type REMOVE to confirm.</div>
        <input v-model.trim="deleteTabModal.confirmText" class="std-input" type="text" placeholder="Type REMOVE to confirm" autocomplete="off" @keydown.enter.prevent="deleteTabModal.confirmText.toUpperCase() === 'REMOVE' && confirmDeleteTab()" @keydown.esc.prevent="closeDeleteTabModal" />
        <div class="std-foot"><button class="std-btn" type="button" @click="closeDeleteTabModal">Cancel</button><button class="std-btn danger" type="button" :disabled="deleteTabModal.confirmText.toUpperCase() !== 'REMOVE'" @click="confirmDeleteTab">Remove tab</button></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Row = { id: string; kind: 'item' | 'intro' | 'subhead'; lead: string; detail?: string; hot?: boolean }
type Section = { id: string; title: string; rows: Row[] }
type Tab = { key: string; label: string; sections: Section[]; checked: Record<string, boolean>; kind?: 'checklist' | 'workbook' }

const props = defineProps<{ request: (url: string, options?: any) => Promise<any>; currentCountry: any; countries?: any[]; canSwitchCountry?: boolean }>()
const emit = defineEmits<{ (event: 'toggle-sidebar'): void; (event: 'select-country', country: string): void }>()

const rid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
const item = (lead: string, detail = ''): Row => ({ id: rid(), kind: 'item', lead, detail })
const intro = (lead: string): Row => ({ id: rid(), kind: 'intro', lead, hot: true })
const subhead = (lead: string): Row => ({ id: rid(), kind: 'subhead', lead })
const defaults = (): { tabs: Tab[] } => ({
  tabs: [
    { key: 'HQ', label: 'DOCS CHECKLIST', checked: {}, sections: [
      { id: rid(), title: 'Check Invoice', rows: [intro('Xin hình ảnh hàng & tem nhãn để đối chiếu:'), item('Tên shipper / seller', 'check trên web thuế'), item('Địa chỉ shipper / seller', 'check trên web thuế'), item('Không phải chữ “Proforma Invoice”'), item('Tên cnee / buyer', 'check trên web thuế'), item('Địa chỉ mới cnee / buyer', 'check trên web thuế'), item('Số hóa đơn'), item('Ngày hóa đơn'), item('Điều kiện Incoterm', 'Điều kiện mặc định: Xuất FOB, nhập CIF hoặc CFR. Nếu là các điều kiện khác thì phải tách trị giá ra sao cho thể hiện rõ trị giá FOB (hàng xuất), CIF/CFR (hàng nhập) là bao nhiêu.'), item('Phương thức thanh toán: LC / TT'), item('Tuyến đường vận tải'), item('Tên hàng giống hệt tem nhãn', 'Không sai dù 1 ký tự.'), item('Đơn vị tính'), item('Tính lại tổng số lượng'), item('Tính lại tổng trị giá'), item('Phải có mộc của seller')] },
      { id: rid(), title: 'Check Vận đơn / Bill', rows: [intro('Đối chiếu MBL & HBL (hoặc chỉ MBL) với INV, PKL, SC, C/O:'), item('Tên shipper / seller'), item('Địa chỉ shipper / seller'), item('Tên cnee / buyer'), item('Địa chỉ mới cnee / buyer'), item('Mã số thuế cnee'), item('Số vận đơn'), item('POL / POD'), item('Shipping marks'), item('Tên hàng giống hệt INV, PKL, SC, C/O & tên trên nhãn mác'), item('Số lượng & trọng lượng giống hệt INV, PKL, SC, C/O'), item('Số cont / seal'), item('Phải có ngày tàu chạy (ON BOARD)'), item('Loại Bill: ORIGIN / TELEX / SEA WAY')] },
      { id: rid(), title: 'Check C/O', rows: [intro('Lấy Invoice ra đối chiếu C/O:'), item('Ô 1, 2', 'Tên & địa chỉ shipper / cnee y hệt Invoice'), item('Ô 3', 'Thông tin vận chuyển — giống hệt vận đơn'), item('Ô 7', 'Mô tả hàng — giống hệt Invoice'), item('Ô 9', 'Đề xuất khách hàng thể hiện đơn vị Gross Weight'), item('Ô 10', 'Số & ngày giống hệt Invoice'), item('Ô 11', 'Ký & đóng mộc nhà xuất khẩu'), item('Ô 12', 'Ký & đóng mộc đơn vị cấp C/O'), item('Ô 13', 'Tick ô 1 nếu C/O ký sau 3 ngày tàu chạy'), subhead('Lô hàng 3 bên (exporter · seller · buyer)'), item('Ô 1', 'Thông tin exporter (khác seller trên Invoice)'), item('Ô 2', 'Tên & địa chỉ Importer (lấy trên web thuế)'), item('Ô 7', 'Thêm dòng THIRD PARTY INVOICING / OPERATOR + tên & địa chỉ seller giống Invoice'), item('Ô 13', 'Tick ô cuối (third party invoicing)'), item('Các ô khác', 'Như lô hàng 2 bên')] },
      { id: rid(), title: 'Bộ chứng từ cần có', rows: [intro('Hồ sơ nộp Hải quan:'), item('INVOICE'), item('PACKING LIST'), item('BILL OF LADING'), item('ARRIVAL NOTICE (AN)'), item('C/O (nếu có)')] },
      { id: rid(), title: 'Check Nhãn mác hàng hóa', rows: [item('Tên nhà sản xuất'), item('Địa chỉ nhà sản xuất'), item('Tên hàng khớp B/L, INV, PKL, C/O'), item('Máy móc'), item('Thông số kỹ thuật cơ bản'), item('Xuất xứ hàng hóa: bắt buộc phải có MADE IN / PRODUCT OF / ORIGIN OF…')] },
    ] },
    { key: 'HQ-KTCN', label: 'IMEX RULES LIST', checked: {}, sections: [
      { id: rid(), title: 'Quy trình kiểm tra chuyên ngành', rows: [item('Kiểm tra chuyên ngành của bộ nào?'), item('Quy định nào? Còn hiệu lực không?'), item('Liên hệ người mua hàng: đã nhập bao giờ chưa?'), item('Xác định đơn vị làm dịch vụ kiểm tra chuyên ngành', 'VIETNAMCONTROL, VINACONTROL, QUATEST 3…'), item('Kiểm tra các phí họ thu & báo khách theo thực tế'), item('Hỏi khách đã có tài khoản 1 cửa (VNSW) hoặc dịch vụ công chưa?'), item('Khách chưa có tài khoản thì đăng ký sẵn.'), item('Hỏi bên kiểm tra cần chứng từ gì & chuẩn bị đầy đủ trước khi tàu về'), item('Chủ động gia hạn nếu thời gian làm không kịp.'), item('Nộp lại / upload chứng thư cho cơ quan nhà nước quản lý.')] },
    ] },
  ],
})

const loading = ref(true)
const countryOpen = ref(false)
const canSwitchCountry = computed(() => props.canSwitchCountry !== false)
const editing = ref(false)
const query = ref('')
const recordId = ref('')
const activeKey = ref('HQ')
const tabNameInput = ref<HTMLInputElement | null>(null)
const tabModal = reactive({ open: false, name: '' })
const deleteTabModal = reactive({ open: false, key: '', label: '', confirmText: '' })
const protectedTabKeys = ['HQ', 'HQ-KTCN']
const document = reactive(defaults())
const activeTab = computed<Tab>(() => document.tabs.find(tab => tab.key === activeKey.value) || document.tabs[0]!)
const isChecklistTab = computed(() => protectedTabKeys.includes(activeTab.value.key))
const allItemIds = computed(() => activeTab.value.sections.flatMap(section => section.rows.filter(row => row.kind === 'item').map(row => row.id)))
const itemNumber = (id: string) => allItemIds.value.indexOf(id) + 1
const isCodeRow = (row: Row) => /^Ô\s/i.test(row.lead)
const pad = (value: number, size: number) => String(value).padStart(size, '0')
const flagUrl = (flag: string) => `https://flagcdn.com/20x15/${flag || 'vn'}.png`
const selectCountry = (country: string) => {
  if (!canSwitchCountry.value) return
  countryOpen.value = false
  emit('select-country', country)
}
const toggleCountryMenu = () => {
  if (!canSwitchCountry.value) return
  countryOpen.value = !countryOpen.value
}
const isDone = (id: string) => Boolean(activeTab.value.checked[id])
const sectionTotal = (section: Section) => section.rows.filter(row => row.kind === 'item').length
const sectionDone = (section: Section) => section.rows.filter(row => row.kind === 'item' && isDone(row.id)).length
const sectionPercent = (section: Section) => {
  const total = sectionTotal(section)
  return total ? Math.round(sectionDone(section) / total * 100) : 0
}
const filteredRows = (section: Section) => {
  const q = query.value.trim().toLowerCase()
  const rows = section.rows.filter(row => !isPinnedNote(row))
  return q ? rows.filter(row => `${row.lead} ${row.detail || ''}`.toLowerCase().includes(q)) : rows
}
const isPinnedNote = (row: Row) => row.kind === 'intro' && Boolean(row.hot)
const pinnedNotes = (section: Section) => {
  const q = query.value.trim().toLowerCase()
  return section.rows.filter(row => isPinnedNote(row) && (!q || `${row.lead} ${row.detail || ''}`.toLowerCase().includes(q)))
}
const sectionColumns = computed(() => {
  const entries = activeTab.value.sections.map((section, index) => ({ section, index }))
  if (entries.length <= 1) return [entries]
  return [entries.slice(0, 2), entries.slice(2)]
})
const saveDocument = async () => {
  const body = { country: props.currentCountry?.id || 'VN', page: 'wb_checklist', kind: 'checklist-document', data: JSON.parse(JSON.stringify(document)), sortOrder: 0 }
  const result = recordId.value
    ? await props.request(`/records/${recordId.value}`, { method: 'PATCH', body })
    : await props.request('/records', { method: 'POST', body })
  recordId.value = result.id || recordId.value
}
const toggleRow = async (id: string) => {
  activeTab.value.checked[id] = !activeTab.value.checked[id]
  await saveDocument()
}
const resetChecks = async () => {
  activeTab.value.checked = {}
  await saveDocument()
}
const toggleEdit = async () => {
  editing.value = !editing.value
  if (!editing.value) await saveDocument()
}
const addTab = async () => {
  tabModal.name = `Sheet ${document.tabs.length + 1}`
  tabModal.open = true
  await nextTick()
  tabNameInput.value?.focus()
  tabNameInput.value?.select()
}
const closeTabModal = () => {
  tabModal.open = false
}
const createTab = async () => {
  const label = tabModal.name.trim()
  if (!label) return
  const tab: Tab = { key: `CKL_${rid()}`.toUpperCase(), label, checked: {}, sections: [], kind: 'workbook' }
  await props.request('/workbook/sheets', {
    method: 'POST',
    body: {
      key: tab.key,
      label,
      group: 'Customs & Legal',
      rows: [Array.from({ length: 8 }, (_, index) => `Column ${index + 1}`), ...Array.from({ length: 27 }, () => Array(8).fill(''))],
    },
  })
  document.tabs.push(tab)
  activeKey.value = tab.key
  tabModal.open = false
  await saveDocument()
}
const canDeleteTab = (tab: Tab) => !protectedTabKeys.includes(tab.key)
const openDeleteTab = (tab: Pick<Tab, 'key' | 'label'>) => {
  deleteTabModal.key = tab.key
  deleteTabModal.label = tab.label
  deleteTabModal.confirmText = ''
  deleteTabModal.open = true
}
const closeDeleteTabModal = () => {
  deleteTabModal.open = false
}
const confirmDeleteTab = async () => {
  const index = document.tabs.findIndex(tab => tab.key === deleteTabModal.key)
  if (index < 0 || protectedTabKeys.includes(deleteTabModal.key)) return
  await props.request(`/workbook/sheets/${encodeURIComponent(deleteTabModal.key)}`, { method: 'DELETE' })
  document.tabs.splice(index, 1)
  if (activeKey.value === deleteTabModal.key) activeKey.value = document.tabs[0]?.key || 'HQ'
  deleteTabModal.open = false
  await saveDocument()
}
const addSection = async () => {
  activeTab.value.sections.push({ id: rid(), title: 'New section', rows: [] })
  await saveDocument()
}
const removeSection = async (index: number) => {
  activeTab.value.sections.splice(index, 1)
  await saveDocument()
}
const moveSection = async (index: number, direction: number) => {
  const target = index + direction
  if (target < 0 || target >= activeTab.value.sections.length) return
  const [section] = activeTab.value.sections.splice(index, 1)
  activeTab.value.sections.splice(target, 0, section!)
  await saveDocument()
}
const addRow = async (section: Section, kind: Row['kind']) => {
  section.rows.push({ id: rid(), kind, lead: '', detail: '', hot: false })
  await saveDocument()
}
const removeRow = async (section: Section, index: number) => {
  section.rows.splice(index, 1)
  await saveDocument()
}
const moveRow = async (section: Section, index: number, direction: number) => {
  const target = index + direction
  if (target < 0 || target >= section.rows.length) return
  const [row] = section.rows.splice(index, 1)
  section.rows.splice(target, 0, row!)
  await saveDocument()
}
const setKind = async (row: Row, kind: Row['kind']) => {
  row.kind = kind
  if (kind !== 'item') row.detail = ''
  if (kind !== 'intro') row.hot = false
  await saveDocument()
}
const toggleHot = async (row: Row) => {
  row.hot = !row.hot
  await saveDocument()
}

const loadChecklist = async () => {
  loading.value = true
  recordId.value = ''
  const initial = defaults()
  document.tabs.splice(0, document.tabs.length, ...initial.tabs)
  activeKey.value = document.tabs[0]?.key || 'HQ'
  try {
    const data = await props.request(`/records?country=${encodeURIComponent(props.currentCountry?.id || 'VN')}&page=wb_checklist&limit=1`)
    const record = data.items?.[0]
    if (record?.data?.tabs?.length) {
      recordId.value = record.id
      document.tabs.splice(0, document.tabs.length, ...record.data.tabs)
      const workbookData = await props.request('/workbook/sheets')
      const workbookKeys = new Set((workbookData.items || []).map((sheet: any) => String(sheet.key).toUpperCase()))
      for (const tab of document.tabs.filter(tab => !protectedTabKeys.includes(tab.key) && !workbookKeys.has(tab.key.toUpperCase()))) {
          await props.request('/workbook/sheets', {
            method: 'POST',
            body: {
              key: tab.key,
              label: tab.label,
              group: 'Customs & Legal',
              rows: [Array.from({ length: 8 }, (_, index) => `Column ${index + 1}`), ...Array.from({ length: 27 }, () => Array(8).fill(''))],
            },
          })
      }
      activeKey.value = document.tabs[0].key
    } else {
      await saveDocument()
    }
  } finally {
    loading.value = false
  }
}
onMounted(loadChecklist)
watch(() => props.currentCountry?.id, (country, previousCountry) => {
  if (country && country !== previousCountry) loadChecklist()
})
</script>

<style scoped>
.checklist-page{
  --bg:#f3f6f3;--surface:#fff;--surface-2:#fafbf9;--ink:#0e1512;--ink-soft:#3a463f;
  --muted:#7a847d;--faint:#a3aca5;--line:#e4e9e2;--line-strong:#d3dacf;
  --green:#00c566;--green-d:#008f4c;--green-t:#009e54;--green-wash:#e8f8ef;
  --shadow:0 1px 2px rgba(14,21,18,.05),0 10px 30px rgba(14,21,18,.06);
  height:100%;display:flex;flex-direction:column;overflow:hidden;background:var(--bg);color:var(--ink);
  font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;
  -webkit-font-smoothing:antialiased
}
.checklist-page *{box-sizing:border-box}
.checklist-page button,.checklist-page input,.checklist-page select{font-family:inherit}
.workspace-head{padding:16px 22px 14px;border-bottom:1px solid var(--line);background:var(--surface);display:flex;align-items:center;gap:9px;flex:none}
.workspace-head b{font-size:17px;font-weight:600;letter-spacing:-.01em}
.toggle{width:28px;height:28px;display:grid;place-items:center;padding:6px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink-soft)}
.toggle:hover{border-color:var(--line-strong);background:var(--surface-2)}
.toggle svg{width:15px;height:15px}.head-spacer,.toolbar-spacer{flex:1}
.country-dd{position:relative}.country{display:flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid var(--line-strong);border-radius:9px;background:var(--surface);color:var(--ink);font-size:12.5px;font-weight:600}.country:hover{border-color:var(--green)}.country img,.country-menu img{width:20px;height:14px;object-fit:cover;border-radius:2px}.country .caret{width:14px;height:14px;color:#9aa69c}.country-menu{position:absolute;right:0;top:calc(100% + 5px);z-index:30;width:210px;max-height:340px;overflow:auto;padding:6px;background:#fff;border:1px solid #d6dcd6;border-radius:10px;box-shadow:0 10px 28px rgba(28,36,32,.16)}.country-menu button{display:flex;align-items:center;gap:9px;width:100%;padding:7px 9px;border:0;border-radius:7px;background:#fff;color:#4a564d;text-align:left;font-size:12.5px}.country-menu button:hover,.country-menu button.active{background:#e7f9ef;color:#0f7a37}.country-menu span{flex:1}
.tabs{display:flex;gap:6px;align-items:flex-end;padding:8px 14px 0;border-bottom:1px solid var(--line-strong);background:var(--surface);flex:none}
.tabs button{display:inline-flex;align-items:center;gap:5px;margin-bottom:-1px;padding:8px 16px;border:1px solid transparent;border-bottom:0;border-radius:8px 8px 0 0;background:transparent;color:#869089;font-size:12.5px;font-weight:600}
.tabs button:hover{color:var(--green-d);background:#fff}
.tabs button.active{color:var(--green-d);border-color:var(--line-strong);border-bottom:1px solid #fff;background:#fff}
.tabs .add-tab{padding:8px 14px;border:1px dashed var(--line-strong);border-bottom:0;color:var(--green-d);font-size:12px}
.tab-delete{width:15px;height:15px;display:inline-grid;place-items:center;margin-left:2px;border-radius:4px;color:var(--faint);font-size:10px;line-height:1}.tab-delete:hover{background:#fdeeee;color:#d63a3a}
.checklist-card{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;margin:0 22px 18px;border:1px solid var(--line-strong);border-radius:16px;background:var(--surface);box-shadow:var(--shadow)}
.toolbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 20px;border-bottom:1px solid var(--line);background:var(--surface)}
.toolbar button{padding:7px 13px;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--muted);font-size:12.5px;font-weight:500}
.toolbar button:hover{border-color:var(--line-strong);color:var(--ink)}
.toolbar .edit{padding:7px 14px;border-color:transparent;background:var(--green-wash);color:var(--green-d);font-weight:600}
.toolbar .edit.active{padding:8px 16px;border-radius:10px;background:var(--green);color:#fff;box-shadow:0 4px 16px rgba(0,158,84,.32)}
.edit-hint{display:inline-flex;align-items:center;gap:8px;margin-left:12px;color:var(--green-d);font-size:11.5px;font-weight:600;letter-spacing:.02em}.edit-hint::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 0 0 rgba(0,197,102,.5);animation:editPulse 1.6s infinite}@keyframes editPulse{70%{box-shadow:0 0 0 7px rgba(0,197,102,0)}100%{box-shadow:0 0 0 0 rgba(0,197,102,0)}}
.search{display:flex;align-items:center;gap:7px;flex:1;min-width:150px;max-width:300px;padding:6px 10px;border:1px solid var(--line);border-radius:9px;background:var(--surface-2)}
.search svg{width:14px;height:14px;flex:none;color:var(--muted)}
.search input{width:100%;padding:0;border:0;outline:0;background:none;color:var(--ink);font-size:12.5px}
.columns{display:grid;grid-template-columns:1fr 1fr;overflow-y:auto;flex:1;min-height:0}
.columns.single{grid-template-columns:minmax(0,1fr)}
.columns.single .checklist-column:first-child{border-right:0}
.checklist-column{display:block;min-width:0;width:100%}.checklist-column:first-child{border-right:1px solid var(--line)}
.section-head{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:11px;padding:13px 20px 9px;border-bottom:1px solid var(--line);background:var(--surface)}
.section-head .badge{flex:none;padding:3px 8px;border-radius:6px;background:var(--green);color:#fff;font-family:'Geist Mono',ui-monospace,Menlo,monospace;font-size:11px;font-weight:700;letter-spacing:.02em}
.section-head b{flex:none;max-width:50%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--ink);font-size:12.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.section-head>i{flex:1;min-width:14px;height:0;border-top:1px dashed var(--line-strong)}
.section-progress{width:58px;height:5px;overflow:hidden;flex:none;border-radius:99px;background:var(--line)}
.section-progress i{display:block;height:100%;border:0;background:var(--green);border-radius:99px}
.section-head span:last-child{min-width:42px;text-align:right;color:var(--muted);font-family:'Geist Mono',ui-monospace,Menlo,monospace;font-size:11px;font-weight:600}
.item{position:relative;width:100%;display:grid;grid-template-columns:46px 28px 1fr;align-items:start;padding:0;border:0;border-bottom:1px solid var(--line);outline:0;background:var(--surface);text-align:left;cursor:pointer;transition:background .12s}
.item::before{content:"";position:absolute;inset:0 auto 0 0;width:3px;background:transparent}.item:hover{background:var(--surface-2)}.item.done{background:rgba(0,197,102,.05)}.item.done::before{background:var(--green)}
.number{padding:11px 0 11px 20px;color:var(--faint);font-family:'Geist Mono',ui-monospace,Menlo,monospace;font-size:10.5px;font-variant-numeric:tabular-nums}
.box{position:relative;width:17px;height:17px;margin-top:9px;margin-left:2px;border:2px solid var(--line-strong);border-radius:5px;background:var(--surface)}
.box svg{position:absolute;left:50%;top:50%;display:block;width:12px;height:12px;opacity:0;color:#fff;stroke-linecap:round;stroke-linejoin:round;transform:translate(-50%,-50%)}.item.done .box{border-color:var(--green);background:var(--green)}.item.done .box svg{opacity:1}.item.done .number{color:var(--green-t)}
.text{min-width:0;padding:9px 20px 9px 8px;color:var(--ink);font-size:13px;line-height:1.45}.text b{font-weight:500}.text small{display:block;margin-top:2px;color:var(--muted);font-size:11.5px;line-height:1.4}.text.coded{display:flex;align-items:baseline;gap:6px;flex-wrap:wrap}.text b.code{flex:none;padding:1px 7px;border-radius:5px;background:var(--green-wash);color:var(--green-d);font-family:'Geist Mono',ui-monospace,Menlo,monospace;font-size:12px;font-weight:600}.text small.inline{display:inline;margin:0;color:var(--ink);font-size:13px;font-weight:500;line-height:1.45}
.ckw-noterow,.checklist-subhead{display:block;width:100%;min-width:0;border-bottom:1px solid var(--line)}.ckw-noterow{padding:9px 20px 9px 76px;color:var(--muted);font-size:11.5px;font-style:italic;line-height:1.45;white-space:normal;word-break:normal}.ckw-noterow.hot{color:var(--green-d);background:var(--green-wash);font-style:normal;font-weight:600}.ckw-noterow.pin{padding:11px 20px;color:#d63939;background:#fff5f5;border-left:3px solid #d63939;font-style:normal;font-weight:700}.checklist-subhead{padding:11px 20px 4px 76px;color:var(--green-t);font-family:'Geist Mono',ui-monospace,Menlo,monospace;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.empty{padding:48px 20px;text-align:center;color:var(--muted);font-size:13px}
.edit-list{overflow:auto;padding:12px 16px 28px;background:var(--surface-2)}.edit-section{overflow:hidden;margin-bottom:14px;border:1px solid var(--line);border-left:3px solid var(--green);border-radius:12px;background:var(--surface)}.edit-head{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--line);background:var(--surface-2)}.edit-head>span{width:24px;height:24px;display:grid;place-items:center;flex:none;border-radius:7px;background:var(--green-wash);color:var(--green-d);font:700 12px 'Geist Mono',monospace}.edit-head>input{flex:1;min-width:0;padding:6px 9px;border:1px solid var(--line);border-radius:9px;background:var(--surface-2);color:var(--ink);font-size:12.5px;font-weight:600;letter-spacing:.02em;text-transform:uppercase}.edit-head>input:focus,.edit-row input:focus{outline:0;border-color:var(--green);box-shadow:0 0 0 3px var(--green-wash);background:var(--surface)}.edit-actions{display:flex;gap:4px;flex:none}.edit-actions button{width:24px;height:24px;display:grid;place-items:center;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--muted);font-size:13px}.edit-actions button:hover{border-color:var(--line-strong);background:var(--surface-2);color:var(--ink);transform:translateY(-1px)}.edit-actions button.danger:hover{border-color:#f0c2c2;background:#fdeeee;color:#d63a3a}.edit-row{margin:8px 12px;padding:9px 11px;border:1px solid var(--line);border-left:3px solid #00e676;border-radius:11px;background:var(--surface);box-shadow:0 1px 2px rgba(14,21,18,.04)}.edit-row-main{display:flex;flex-direction:column;gap:5px}.edit-row-main input{width:100%;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink-soft);font-size:12.8px}.edit-row-main .detail-input{color:var(--faint);font-size:11.5px}.edit-row-bar{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:9px;padding-top:8px;border-top:1px dashed var(--line)}.kind-chips{display:flex;gap:2px;padding:2px;border:1px solid var(--line);border-radius:9px;background:var(--surface-2)}.kind-chips button{padding:5px 11px;border:0;border-radius:7px;background:transparent;color:var(--muted);font-size:11px;font-weight:500}.kind-chips button:hover{background:rgba(0,158,84,.07);color:var(--ink)}.kind-chips button.active{background:var(--surface);color:var(--green-d);font-weight:600;box-shadow:0 1px 3px rgba(14,21,18,.12)}.hot{width:24px;height:24px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--muted);font-weight:700}.hot.active{border-color:#f0c2c2;background:#fdeeee;color:#d63a3a}.row-actions{margin-left:auto}.add-row-group{display:flex;gap:7px;flex-wrap:wrap;margin:6px 12px 12px;padding:9px 2px 5px;border-top:1px dashed var(--line)}.add-row-group button{padding:6px 12px;border:1px solid transparent;border-radius:9px;background:var(--green-wash);color:var(--green-d);font-size:11.5px;font-weight:600}.add-row-group button:hover{transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,158,84,.16)}.add-section{width:100%;padding:12px;border:1.5px dashed var(--line-strong);border-radius:12px;background:var(--surface-2);color:var(--green-d);font-family:'Geist Mono',monospace;font-size:12px;font-weight:600}.add-section:hover{border-color:var(--green);background:var(--green-wash)}
.tab-modal{position:fixed;inset:0;z-index:300;display:grid;place-items:center}.tab-backdrop{position:absolute;inset:0;border:0;background:rgba(14,21,18,.42)}.tab-dialog{position:relative;width:min(420px,calc(100vw - 40px));overflow:hidden;border:1px solid var(--line-strong);border-radius:16px;background:var(--surface);box-shadow:0 24px 70px rgba(14,21,18,.28)}.tab-dialog header{display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid var(--line);font-size:14.5px;font-weight:700}.tab-dialog header button{margin-left:auto;width:28px;height:28px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--muted);font-size:13px}.tab-dialog label{display:flex;flex-direction:column;gap:6px;padding:18px 20px}.tab-dialog label span{color:var(--muted);font-size:11px;font-weight:600;letter-spacing:.03em;text-transform:uppercase}.tab-dialog input{padding:10px 11px;border:1px solid var(--line);border-radius:9px;outline:0;background:var(--surface-2);color:var(--ink);font-size:13.5px}.tab-dialog input:focus{border-color:var(--green);background:var(--surface);box-shadow:0 0 0 3px var(--green-wash)}.tab-dialog footer{display:flex;justify-content:flex-end;gap:9px;padding:14px 20px;border-top:1px solid var(--line);background:var(--surface-2)}.tab-dialog footer button{padding:9px 18px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--muted);font-size:13px;font-weight:600}.tab-dialog footer .create{border-color:var(--green);background:var(--green);color:#fff}
.confirm-dialog p{padding:18px 20px;color:var(--ink-soft);font-size:13.5px;line-height:1.55}.tab-dialog footer .delete{border-color:#e5484d;background:#e5484d;color:#fff}
.tab-backdrop{background:rgba(10,30,18,.42)}.std-dialog{width:390px;max-width:92vw;border:0;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.3)}.std-head{padding:16px 18px 4px;font-size:15px;font-weight:750;color:#0f3d23}.std-desc{padding:4px 18px 10px;color:#5d7567;font-size:13px;line-height:1.5}.std-input{display:block;margin:0 18px 12px;padding:9px 11px;border:1px solid #c4e6d1;border-radius:8px;background:#fff;font:inherit;font-size:13px;color:#16241c;width:calc(100% - 36px);outline:none;text-transform:uppercase;box-sizing:border-box}.std-input:focus{box-shadow:inset 0 0 0 2px #2ec46b}.std-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;background:#eef9f1;border-top:1px solid #c4e6d1}.std-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid #c4e6d1;background:#fff;color:#15532f;padding:7px 13px;border-radius:8px;font-size:12.5px;font-weight:650;cursor:pointer;line-height:1}.std-btn:hover{background:#eef9f1}.std-btn.primary{background:#1b7a43;border-color:#1b7a43;color:#fff}.std-btn.primary:hover{background:#15532f}.std-btn.danger{color:#c0392b;border-color:#e7b9b3;background:#fff}.std-btn.danger:hover{background:#fdecea}.std-btn.danger:disabled{opacity:.45;cursor:not-allowed}
@media(max-width:900px){.columns{grid-template-columns:1fr}.checklist-column:first-child{border-right:0;border-bottom:1px solid var(--line)}.section-progress{display:none}}
</style>
