<template>
  <div class="ws-meet-root">
    <div class="ws-toolbar">
      <button class="ws-btn" type="button" @click="addRow">Add+</button>
      <button class="ws-btn grey" type="button" title="Push meetings to the mail engine" @click="syncToMailEngine">✉ Sync to Mail Engine</button>
      <button class="ws-icobtn" type="button" title="Mail engine URL" @click="openGasCfg">⚙</button>
      <span style="color:#8a94a0;font-size:12px">Set “Notify” per meeting; the mail engine emails participants automatically on schedule.</span>
    </div>

    <div class="ws-scroll">
      <table class="ws-tbl ws-meettbl">
        <colgroup>
          <col style="width:48px"><col style="width:126px"><col style="width:92px"><col style="width:190px"><col style="width:210px"><col style="width:140px"><col style="width:150px"><col style="width:168px"><col style="width:104px"><col style="width:92px">
        </colgroup>
        <thead>
          <tr><th class="ws-sticky1">Order</th><th>Date</th><th>Time</th><th>Title</th><th>Participants</th><th>Location/Link</th><th>Note</th><th>Notify</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-if="!sortedRows.length">
            <td colspan="10" style="text-align:center;color:#8a94a0;padding:16px">No meeting yet. Click “Add+”.</td>
          </tr>
          <tr v-for="(r, i) in sortedRows" :key="r.id" :class="soonClass(r)">
            <td class="ws-sticky1" style="text-align:center">{{ i + 1 }}</td>
            <td><input type="date" v-model="r.date" :disabled="!isEditing(r.id)"></td>
            <td><input type="time" v-model="r.time" :disabled="!isEditing(r.id)"></td>
            <td><input v-model="r.title" :disabled="!isEditing(r.id)"></td>
            <td><input v-model="r.parts" placeholder="emails, comma separated" :disabled="!isEditing(r.id)"></td>
            <td><input v-model="r.loc" :disabled="!isEditing(r.id)"></td>
            <td><input v-model="r.note" :disabled="!isEditing(r.id)"></td>
            <td>
              <div v-if="isEditing(r.id)" class="ws-nfbox">
                <select v-model="r.nfMode">
                  <option value="none">No notify</option>
                  <option value="0">At meeting time</option>
                  <option value="1h">1h before</option>
                  <option value="3h">3h before</option>
                  <option value="1d">1 day before</option>
                  <option value="custom">Custom…</option>
                </select>
                <input v-show="r.nfMode === 'custom'" type="datetime-local" v-model="r.nfCustom">
                <select v-model="r.nfEvery">
                  <option value="0">Once</option>
                  <option value="15">Every 15′</option>
                  <option value="30">Every 30′</option>
                  <option value="60">Every 1h</option>
                  <option value="180">Every 3h</option>
                </select>
              </div>
              <span v-else-if="!r.nfMode || r.nfMode === 'none'" style="color:#b7c1ba">—</span>
              <span v-else class="ws-nfsum">✉ {{ nfSummaryText(r) }}</span>
            </td>
            <td>
              <span v-if="isEditing(r.id)" class="ws-status-select-wrap"><select class="ws-mstsel" :class="statusSelClass(r)" v-model="r.status">
                <option>Upcoming</option>
                <option>Done</option>
                <option>Cancelled</option>
              </select><span class="ws-status-select-arrow">▾</span></span>
              <span v-else class="ws-stat" :class="statusBadgeClass(r)">{{ r.status || 'Upcoming' }} <span class="ws-stat-arrow">▾</span></span>
            </td>
            <td style="text-align:center;white-space:nowrap">
              <button v-if="isEditing(r.id)" class="ws-btn" type="button" style="padding:4px 12px" @click="saveRow(r)">Save</button>
              <button v-else class="ws-icobtn" type="button" title="Edit" @click="startEdit(r.id)">✎</button>
              <button class="ws-icobtn" type="button" title="Remove" style="color:#c0392b" @click="askDelete(r)">✕</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!gasUrl" class="ws-gashint">Mail engine URL is not set — click ⚙ to paste your Apps Script Web App URL.</div>

    <!-- prompt modal (mail engine URL) — mirrors mockup wsPrompt -->
    <div v-if="promptOpen" class="overlay">
      <div class="mbox" style="min-width:320px">
        <div class="mmsg" style="margin-bottom:12px">Apps Script Web App URL:</div>
        <input ref="promptInput" class="minp" v-model="promptVal" @keydown.enter="promptOk" @keydown.esc="promptCancel">
        <div class="mbtns">
          <button class="ws-btn" type="button" style="min-width:80px" @click="promptOk">OK</button>
          <button class="ws-btn grey" type="button" style="min-width:80px" @click="promptCancel">Cancel</button>
        </div>
      </div>
    </div>

    <!-- confirm modal (remove row) — mirrors mockup wsConfirm -->
    <div v-if="confirmOpen" class="overlay">
      <div class="mbox" style="min-width:280px;text-align:center">
        <div class="mmsg">Are you sure to remove?</div>
        <div class="mbtns">
          <button class="ws-btn red" type="button" @click="confirmYes">YES</button>
          <button class="ws-btn grey" type="button" @click="confirmOpen = false">NO</button>
        </div>
      </div>
    </div>

    <div class="ws-toast" :class="{ on: toastOn }">{{ toastMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'

const props = defineProps<{ request: (url: string, options?: any) => Promise<any> }>()

const WS_GAS_KEY = 'shoptrans_ws_gas_url_v1'

interface MeetRow {
  id: string
  date: string
  time: string
  title: string
  parts: string
  loc: string
  note: string
  status: string
  nfMode: string
  nfCustom: string
  nfEvery: string | number
  nfLog: string[]
}
interface MeetDoc { rows: MeetRow[]; lastSync?: string }

const doc = reactive<MeetDoc>({ rows: [] })
const editing = reactive<Record<string, boolean>>({})
const gasUrl = ref('')

/* ---------- helpers (mirror mockup) ---------- */
function today (): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())
}
function uid (): string { return Math.random().toString(36).slice(2, 10) }

const sortedRows = computed(() =>
  doc.rows.slice().sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
)

function isEditing (id: string): boolean { return !!editing[id] }

function soonClass (r: MeetRow): string {
  if (r.status !== 'Upcoming') return ''
  const t = today()
  if (r.date !== t) return ''
  if (!r.time) return 'ws-row-today'
  const now = new Date()
  const hm = r.time.split(':')
  const mt = new Date()
  mt.setHours(+hm[0] || 0, +hm[1] || 0, 0, 0)
  const diff = (mt.getTime() - now.getTime()) / 60000
  if (diff >= 0 && diff <= 30) return 'ws-row-soon'
  return 'ws-row-today'
}

function nfSummaryText (r: MeetRow): string {
  const lbl = ({ '0': 'at meeting time', '1h': 'from 1h before', '3h': 'from 3h before', '1d': 'from 1 day before', custom: 'from ' + (r.nfCustom ? String(r.nfCustom).replace('T', ' ') : '?') } as Record<string, string>)[r.nfMode] || ''
  const ev = +r.nfEvery || 0
  const evTxt = ev ? (' · every ' + (ev >= 60 ? (ev / 60) + 'h' : ev + "'")) : ' · once'
  const log = (r.nfLog && r.nfLog.length) ? (' · sent ' + r.nfLog.length + '×') : ''
  return lbl + evTxt + log
}

function statusSelClass (r: MeetRow): string {
  return r.status === 'Done' ? 'm-done' : (r.status === 'Cancelled' ? 'm-can' : 'm-up')
}
function statusBadgeClass (r: MeetRow): string {
  return r.status === 'Done' ? 'done' : (r.status === 'Cancelled' ? 'can' : 'up')
}

/* ---------- toast ---------- */
const toastMsg = ref('')
const toastOn = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | undefined
function toast (m: string) {
  toastMsg.value = m
  toastOn.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastOn.value = false }, 1900)
}

/* ---------- persistence (dedicated workspace API) ---------- */
async function persist () {
  const body = JSON.parse(JSON.stringify(doc))
  try {
    await props.request('/workspace/meet', { method: 'PUT', body })
  } catch (e) { /* keep UI responsive even if persistence fails */ }
}

onMounted(async () => {
  if (import.meta.client) gasUrl.value = localStorage.getItem(WS_GAS_KEY) || ''
  try {
    const res = await props.request('/workspace/meet')
    const data = (res && res.data) || {}
    doc.rows = Array.isArray(data.rows) ? data.rows : []
    if (data.lastSync) doc.lastSync = data.lastSync
  } catch (e) { /* start with empty doc */ }
})

/* ---------- row actions ---------- */
function addRow () {
  const r: MeetRow = { id: uid(), date: today(), time: '', title: '', parts: '', loc: '', note: '', status: 'Upcoming', nfMode: 'none', nfCustom: '', nfEvery: 0, nfLog: [] }
  doc.rows.push(r)
  editing[r.id] = true
}
function startEdit (id: string) { editing[id] = true }
async function saveRow (r: MeetRow) {
  if (!String(r.title || '').trim()) { toast('Title is required'); return }
  if (r.nfMode && r.nfMode !== 'none' && !r.date) { toast('Notify needs a meeting date'); return }
  delete editing[r.id]
  await persist()
  toast('Saved')
}

/* ---------- confirm modal (delete) ---------- */
const confirmOpen = ref(false)
let pendingDeleteId = ''
function askDelete (r: MeetRow) {
  pendingDeleteId = r.id
  confirmOpen.value = true
}
async function confirmYes () {
  confirmOpen.value = false
  doc.rows = doc.rows.filter(x => x.id !== pendingDeleteId)
  delete editing[pendingDeleteId]
  await persist()
  toast('Removed')
}

/* ---------- prompt modal (mail engine URL) ---------- */
const promptOpen = ref(false)
const promptVal = ref('')
const promptInput = ref<HTMLInputElement | null>(null)
function openGasCfg () {
  promptVal.value = gasUrl.value
  promptOpen.value = true
  nextTick(() => {
    if (promptInput.value) { promptInput.value.focus(); promptInput.value.select() }
  })
}
function promptOk () {
  const url = promptVal.value.trim()
  gasUrl.value = url
  if (import.meta.client) localStorage.setItem(WS_GAS_KEY, url)
  promptOpen.value = false
  toast(url ? 'Mail engine URL saved' : 'Mail engine URL cleared')
}
function promptCancel () { promptOpen.value = false }

/* ---------- sync to mail engine ---------- */
async function syncToMailEngine () {
  const url = gasUrl.value
  if (!url) { toast('Set the mail engine URL first (⚙)'); return }
  const payload = JSON.stringify({ meetings: doc.rows })
  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: payload })
    doc.lastSync = new Date().toISOString()
    await persist()
    toast('Synced to mail engine')
  } catch (e) {
    toast('Sync failed — check the URL / connection')
  }
}
</script>

<style scoped>
.ws-meet-root{min-height:100%}
input[type="date"],input[type="time"],input[type="datetime-local"]{cursor:pointer}
input[type="date"]::-webkit-calendar-picker-indicator,input[type="time"]::-webkit-calendar-picker-indicator,input[type="datetime-local"]::-webkit-calendar-picker-indicator{cursor:pointer}
input[type="date"]:disabled,input[type="time"]:disabled{cursor:not-allowed}
.ws-toolbar{display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap}
.ws-btn{border:none;border-radius:8px;padding:7px 16px;font-weight:700;font-size:12.5px;color:#fff;cursor:pointer;background:#008F4C}
.ws-btn:hover{background:#04793f}
.ws-btn.grey{background:#64748b}.ws-btn.grey:hover{background:#51606e}
.ws-btn.red{background:#c0392b}.ws-btn.red:hover{background:#a23227}
.ws-btn:disabled{opacity:.45;cursor:not-allowed}
.ws-tbl{width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px}
.ws-tbl th{background:#f0f3ee;font-weight:700;color:#42504b;border:1px solid #dfe5ea;padding:8px 10px;position:sticky;top:0}
.ws-tbl td{border:1px solid #e4e9ee;padding:6px 8px;vertical-align:middle;background:#fff}
.ws-tbl input,.ws-tbl select{width:100%;border:1px solid #d6ddd9;border-radius:6px;padding:5px 8px;font:inherit;box-sizing:border-box;background:#fff}
.ws-tbl input:disabled,.ws-tbl select:disabled{background:#f1f4f2;color:#6b7680;border-color:#e2e8ee;cursor:not-allowed}
.ws-row-today td{background:#eaf7ef}
.ws-row-soon td{background:#fdecea}
.ws-stat{display:inline-block;padding:2px 9px;border-radius:10px;font-size:11px;font-weight:700}
.ws-stat.up{background:#e3efe8;color:#1b6b43}.ws-stat.done{background:#e8ecf2;color:#5a6875}.ws-stat.can{background:#fbd5d0;color:#a23227}
.ws-icobtn{border:none;background:transparent;cursor:pointer;font-size:14px;padding:3px 6px}
.ws-scroll{overflow-x:auto}
.ws-meettbl{min-width:1380px}
.ws-meettbl td{text-align:center}
.ws-meettbl input,.ws-meettbl select{text-align:center}
.ws-tbl select{cursor:pointer}
.ws-mstsel{box-sizing:border-box;border:1px solid #d6ddd9;border-radius:6px;padding:5px 22px 5px 8px;font:inherit;font-weight:700;width:100%;cursor:pointer;appearance:none;-webkit-appearance:none;-moz-appearance:none;text-align:center;text-align-last:center;-moz-text-align-last:center;display:inline-flex;align-items:center;justify-content:center;background-repeat:no-repeat;background-position:right 8px center;background-size:9px 6px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235a6875' stroke-width='1.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")}
.ws-mstsel.m-up{background-color:#e3efe8;border-color:#9ed4b5;color:#1b6b43}
.ws-mstsel.m-done{background-color:#e8ecf2;border-color:#c7cfd6;color:#5a6875}
.ws-mstsel.m-can{background-color:#fbd5d0;border-color:#e5a49c;color:#a23227}
.ws-stat-arrow{display:inline-block;margin-left:4px;color:currentColor;font-size:9px;vertical-align:1px}
.ws-status-select-wrap{position:relative;display:block;width:100%}.ws-status-select-wrap .ws-mstsel{padding-right:28px}.ws-status-select-arrow{position:absolute;right:9px;top:50%;transform:translateY(-50%);pointer-events:none;color:#5a6875;font-size:15px;font-weight:800;line-height:1}
.ws-sticky1{position:sticky;left:0;z-index:3;background:#fff}
th.ws-sticky1{background:#f0f3ee;z-index:4}
.ws-nfbox{display:flex;flex-direction:column;gap:4px}
.ws-nfsum{font-size:11.5px;color:#1b6b43;font-weight:700;white-space:normal;line-height:1.35;display:inline-block}
.ws-nfbox select,.ws-nfbox input{width:148px}
.ws-gashint{margin-top:10px;background:#fff3e6;border:1px solid #eac083;color:#9a6b1f;border-radius:8px;padding:8px 12px;font-size:12px;font-weight:700}

/* modals (styled like the mockup's wsPrompt / wsConfirm overlays) */
.overlay{position:fixed;inset:0;background:rgba(10,30,18,.42);display:flex;align-items:center;justify-content:center;z-index:600;padding:24px}
.mbox{background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:22px 26px;min-width:280px;text-align:center}
.mmsg{font-weight:700;font-size:13.5px;color:#33413b;margin-bottom:16px}
.minp{width:100%;box-sizing:border-box;border:1px solid #d6ddd9;border-radius:7px;padding:8px 10px;font:inherit;margin-bottom:14px}
.mbtns{display:flex;gap:10px;justify-content:center}

/* toast (bottom-left dark pill) */
.ws-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(20px);background:#0f3d23;color:#fff;padding:10px 16px;border-radius:8px;font-size:12.5px;font-weight:600;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:700;box-shadow:0 8px 24px rgba(0,0,0,.25)}
.ws-toast.on{opacity:1;transform:translateX(-50%) translateY(0)}
</style>
