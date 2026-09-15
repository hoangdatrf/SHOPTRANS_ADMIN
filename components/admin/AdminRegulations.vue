<template>
  <div class="reg-page">
    <header class="workspace-head">
      <button class="toggle" type="button" title="Toggle sidebar" @click="$emit('toggle-sidebar')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      <b>RULES UPDATE</b>
      <div class="spacer"></div>
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
    <section class="reg-card">
      <div class="reg-head">
        <b>Rules Update <span>{{ filtered.length }}</span></b>
        <div class="spacer"></div>
        <label class="search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input v-model="query" placeholder="Search..." />
        </label>
        <button class="add" type="button" @click="open()">+ Add rule</button>
      </div>
      <div class="tabs">
        <button type="button" :class="{ active: tab === 'active' }" @click="tab = 'active'">Active Rules <span>{{ activeRecords.length }}</span></button>
        <button type="button" :class="{ active: tab === 'expired' }" @click="tab = 'expired'">Expired Rules <span>{{ expiredRecords.length }}</span></button>
      </div>
      <div v-if="loading" class="empty">Loading rules...</div>
      <div v-else-if="filtered.length === 0" class="empty">
        <template v-if="tab === 'active'">No rules yet. Click <b>+ Add rule</b> to add the first record.</template>
        <template v-else>No expired rules yet.</template>
      </div>
      <div v-else class="table-wrap">
        <table>
          <thead><tr><th>Field</th><th>Issuing Authority</th><th>Type</th><th>No.</th><th>Title</th><th>Link</th><th>Effective</th><th>Expired Date</th><th>Date</th><th>Notes</th><th>Option</th></tr></thead>
          <tbody>
            <tr v-for="record in filtered" :key="record.id">
              <td>{{ record.data.field }}</td><td>{{ record.data.authority }}</td><td>{{ record.data.dtype }}</td><td class="mono">{{ record.data.docno }}</td>
              <td class="title">{{ record.data.title }}</td><td><a v-if="record.data.link" :href="href(record.data.link)" target="_blank">Open &nearr;</a><span v-else>-</span></td>
              <td class="mono">{{ record.data.eff }}</td><td class="expired-cell"><input type="checkbox" :checked="record.data.expired" @change="toggleExpired(record, $event)" /></td>
              <td><input class="date" type="date" :value="record.data.expDate" @change="setDate(record, $event)" /></td><td>{{ record.data.notes }}</td>
              <td class="actions"><button type="button" title="Edit" @click="open(record)" v-html="icons.edit"></button><button type="button" title="Delete" @click="remove(record)" v-html="icons.close"></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="modal.open" class="modal">
      <button class="backdrop" type="button" @click="modal.open = false"></button>
      <form class="dialog" @submit.prevent="save">
        <header><b>{{ modal.id ? 'Edit rule' : 'Add rule' }}</b><button type="button" @click="modal.open = false">&times;</button></header>
        <div class="form">
          <label>Field<input v-model="form.field" /></label><label>Issuing authority<input v-model="form.authority" /></label>
          <label>Document type<input v-model="form.dtype" /></label><label>Document no.<input v-model="form.docno" /></label>
          <label class="wide">Title<input v-model="form.title" /></label><label class="wide">Link (URL)<input v-model="form.link" placeholder="https://..." /></label>
          <label>Effective date<input v-model="form.eff" type="date" /></label><label class="wide">Notes<textarea v-model="form.notes" rows="3"></textarea></label>
        </div>
        <footer><button type="button" @click="modal.open = false">Cancel</button><button class="save" type="submit">Save</button></footer>
      </form>
    </div>
    <div v-if="confirm.open" class="modal">
      <button class="backdrop" type="button" @click="closeConfirm(false)"></button>
      <div class="dialog confirm-dialog">
        <header><b>{{ confirm.title }}</b><button type="button" @click="closeConfirm(false)">&times;</button></header>
        <div class="confirm-body">{{ confirm.message }}</div>
        <footer><button type="button" @click="closeConfirm(false)">Cancel</button><button class="save" type="button" @click="closeConfirm(true)">OK</button></footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ request: (url: string, options?: any) => Promise<any>; currentCountry: any; countries?: any[]; canSwitchCountry?: boolean }>()
const emit = defineEmits<{ (event: 'toggle-sidebar'): void; (event: 'select-country', country: string): void }>()
const records = ref<any[]>([])
const countryOpen = ref(false)
const canSwitchCountry = computed(() => props.canSwitchCountry !== false)
const loading = ref(true)
const query = ref('')
const tab = ref<'active' | 'expired'>('active')
const modal = reactive({ open: false, id: '' })
const confirm = reactive({ open: false, title: 'Confirm', message: '', resolve: null as null | ((value: boolean) => void) })
const blank = () => ({ field: '', authority: '', dtype: '', docno: '', title: '', link: '', eff: '', notes: '', expired: false, expDate: '' })
const form = reactive(blank())
const icons = {
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
}
const activeRecords = computed(() => records.value.filter(record => !record.data.expired))
const expiredRecords = computed(() => records.value.filter(record => record.data.expired))
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return (tab.value === 'active' ? activeRecords.value : expiredRecords.value).filter(record => !q || JSON.stringify(record.data).toLowerCase().includes(q))
})
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
const href = (value: string) => /^https?:/i.test(value) ? value : `https://${value}`
const load = async () => {
  loading.value = true
  try {
    const data = await props.request(`/records?country=${encodeURIComponent(props.currentCountry?.id || 'VN')}&page=wb_vbpl&limit=1000`)
    records.value = data.items || []
  } finally { loading.value = false }
}
const open = (record?: any) => {
  modal.id = record?.id || ''
  Object.assign(form, blank(), record?.data || {})
  modal.open = true
}
const body = (data: any) => ({ country: props.currentCountry?.id || 'VN', page: 'wb_vbpl', kind: 'rule', data, sortOrder: 0 })
const save = async () => {
  if (!form.title && !form.docno) return
  if (modal.id) await props.request(`/records/${modal.id}`, { method: 'PATCH', body: body({ ...form }) })
  else await props.request('/records', { method: 'POST', body: body({ ...form }) })
  modal.open = false
  await load()
}
const update = async (record: any, patch: any) => {
  await props.request(`/records/${record.id}`, { method: 'PATCH', body: body({ ...record.data, ...patch }) })
  await load()
}
const toggleExpired = (record: any, event: Event) => update(record, { expired: (event.target as HTMLInputElement).checked })
const setDate = (record: any, event: Event) => {
  const expDate = (event.target as HTMLInputElement).value
  return update(record, { expDate, expired: Boolean(expDate) || record.data.expired })
}
const askConfirm = (message: string, title = 'Confirm') => new Promise<boolean>((resolve) => {
  confirm.title = title
  confirm.message = message
  confirm.resolve = resolve
  confirm.open = true
})
const closeConfirm = (value: boolean) => {
  const resolve = confirm.resolve
  confirm.open = false
  confirm.resolve = null
  resolve?.(value)
}
const remove = async (record: any) => {
  if (!(await askConfirm('Delete this rule? This cannot be undone.', 'Delete regulation'))) return
  await props.request(`/records/${record.id}`, { method: 'DELETE' })
  await load()
}
onMounted(load)
watch(() => props.currentCountry?.id, (country, previousCountry) => {
  if (country && country !== previousCountry) load()
})
</script>

<style scoped>
.reg-page{height:100%;display:flex;flex-direction:column;background:#f3f6f3;color:#0e1512;font-family:'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;-webkit-font-smoothing:antialiased;overflow:hidden}.workspace-head{display:flex;align-items:center;gap:9px;padding:16px 22px 14px;border-bottom:1px solid #e4e9e2;background:#fff;flex:none}.workspace-head b{font-size:17px;font-weight:600;letter-spacing:-.01em}.toggle{width:28px;height:28px;display:grid;place-items:center;padding:6px;border:1px solid #e4e9e2;border-radius:8px;background:#fff;color:#3a463f}.toggle svg{width:15px;height:15px}.spacer{flex:1}.country-dd{position:relative}.country{display:flex;gap:8px;align-items:center;border:1px solid #d3dacf;background:#fff;border-radius:9px;padding:6px 10px;color:#0e1512;font-size:12.5px;font-weight:600}.country:hover{border-color:#00c566}.country img,.country-menu img{width:20px;height:14px;object-fit:cover;border-radius:2px}.country .caret{width:14px;height:14px;color:#9aa69c}.country-menu{position:absolute;right:0;top:calc(100% + 5px);z-index:30;width:210px;max-height:340px;overflow:auto;padding:6px;background:#fff;border:1px solid #d6dcd6;border-radius:10px;box-shadow:0 10px 28px rgba(28,36,32,.16)}.country-menu button{display:flex;align-items:center;gap:9px;width:100%;padding:7px 9px;border:0;border-radius:7px;background:#fff;color:#4a564d;text-align:left;font-size:12.5px}.country-menu button:hover,.country-menu button.active{background:#e7f9ef;color:#0f7a37}.country-menu span{flex:1}.reg-card{margin:0 22px 18px;border:1px solid #d3dacf;background:#fff;box-shadow:0 1px 2px rgba(14,21,18,.05),0 10px 30px rgba(14,21,18,.06);display:flex;flex-direction:column;min-height:0;flex:1}.reg-head{display:flex;align-items:center;gap:14px;padding:14px 18px;border-bottom:1px solid #e4e9e2;background:#fafbf9}.reg-head b{font-size:14px}.reg-head b span,.tabs span{font:600 10.5px 'Geist Mono',ui-monospace,monospace;color:#008f4c;background:#e8f8ef;border-radius:99px;padding:2px 9px}.search{display:flex;align-items:center;gap:7px;border:1px solid #e4e9e2;border-radius:9px;padding:7px 11px;background:#fff}.search svg{width:14px;height:14px;flex:none;color:#7a847d}.search input{border:0;outline:0;width:190px;padding:0;background:transparent;font-size:12.5px}.add{border:0;border-radius:9px;background:#00c566;color:#fff;padding:8px 15px;font-size:12.5px;font-weight:600}.tabs{display:flex;align-items:end;gap:6px;padding:8px 18px 0;border-bottom:1px solid #d3dacf}.tabs button{margin-bottom:-1px;border:1px solid transparent;border-bottom:0;background:transparent;border-radius:8px 8px 0 0;color:#7a847d;font-size:12.5px;font-weight:600;padding:8px 16px}.tabs button.active{color:#008f4c;border-color:#d3dacf;background:#fafbf9}.empty{padding:64px 24px;text-align:center;color:#7a847d}.empty b{color:#008f4c}.table-wrap{overflow:auto;flex:1}table{border-collapse:collapse;table-layout:fixed;width:100%;min-width:0;font-size:12.2px}th{position:sticky;top:0;background:#fff;z-index:2;padding:10px 8px;border-bottom:1px solid #d3dacf;color:#7a847d;font-size:9.8px;letter-spacing:.04em;text-transform:uppercase;white-space:normal}td{padding:10px 8px;border-bottom:1px solid #e4e9e2;text-align:center;color:#3a463f;overflow:hidden;text-overflow:ellipsis;vertical-align:middle}th:nth-child(1),td:nth-child(1){width:7%}th:nth-child(2),td:nth-child(2){width:12%}th:nth-child(3),td:nth-child(3){width:8%}th:nth-child(4),td:nth-child(4){width:7%}th:nth-child(5),td:nth-child(5){width:13%}th:nth-child(6),td:nth-child(6){width:7%}th:nth-child(7),td:nth-child(7){width:9%}th:nth-child(8),td:nth-child(8){width:7%}th:nth-child(9),td:nth-child(9){width:10%}th:nth-child(10),td:nth-child(10){width:13%}th:nth-child(11),td:nth-child(11){width:7%}td.title{font-weight:600;color:#0e1512;white-space:normal;line-height:1.35}td.mono{font-family:'Geist Mono',ui-monospace,monospace;font-size:11.5px}td a{color:#008f4c;font-weight:600}.date{width:100%;min-width:0;border:1px solid #e4e9e2;border-radius:7px;padding:5px 6px;font-family:'Geist Mono',ui-monospace,monospace;font-size:11px}.actions{white-space:nowrap}.actions button{width:25px;height:25px;border:1px solid #e4e9e2;background:#fff;border-radius:7px;margin-left:3px}.modal{position:fixed;inset:0;z-index:200;display:grid;place-items:center}.backdrop{position:absolute;inset:0;border:0;background:#0e15126b}.dialog{position:relative;width:min(770px,calc(100vw - 40px));background:#fff;border-radius:18px;box-shadow:0 24px 70px #0e151247;overflow:hidden}.dialog header,.dialog footer{display:flex;align-items:center;padding:20px;border-bottom:1px solid #e4e9e2}.dialog header b{font-size:16px}.dialog header button{margin-left:auto;border:0;background:transparent;font-size:24px;line-height:1}.form{padding:22px 20px;display:grid;grid-template-columns:1fr 1fr;gap:17px 16px}.form label{display:flex;flex-direction:column;gap:8px;color:#7a847d;font-size:12px;font-weight:700;text-transform:uppercase}.form .wide{grid-column:1/-1}.form input,.form textarea{border:1px solid #dbe2dc;border-radius:11px;padding:0 14px;background:#fafcfb;font-family:inherit;font-size:14px;outline:0}.form input{height:45px}.form textarea{min-height:84px;padding-top:12px;resize:vertical}.form input:focus,.form textarea:focus{border-color:#00c566;box-shadow:0 0 0 3px #e8f8ef;background:#fff}.dialog footer{justify-content:flex-end;gap:12px;border-top:1px solid #e4e9e2;border-bottom:0;background:#fafbf9}.dialog footer button{border:1px solid #e4e9e2;border-radius:11px;background:#fff;padding:12px 22px;font-size:14px}.dialog footer .save{background:#00c566;color:#fff;border-color:#00c566;font-weight:700}.expired-cell input{width:16px;height:16px;accent-color:#00c566}.actions button{display:inline-grid;place-items:center;color:#6f7d72}.actions button :deep(svg){width:14px;height:14px}.actions button:hover{border-color:#00c566;color:#008f4c;background:#f1fcf6}@media(max-width:900px){table{min-width:1100px}.table-wrap{overflow:auto}}@media(max-width:700px){.form{grid-template-columns:1fr}.form .wide{grid-column:auto}}
.confirm-dialog{width:min(340px,calc(100vw - 40px));border-radius:14px}
.confirm-dialog header{padding:14px 16px}
.confirm-dialog header b{font-size:14px}
.confirm-dialog .confirm-body{padding:20px;color:#4a564d;font-size:13px;line-height:1.45}
.confirm-dialog footer{padding:12px 16px}
.confirm-dialog footer button{min-width:64px;padding:8px 14px;font-size:12.5px}
</style>
