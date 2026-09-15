<template>
  <div class="ws-notes-tab">
    <div class="ws-toolbar">
      <input v-model="noteDay" type="date" style="border:1px solid #d6ddd9;border-radius:7px;padding:6px 9px" />
      <input
        v-model="newText"
        class="ws-new-note-input"
        placeholder="New note…"
        @keydown.enter="addNote"
      />
      <select v-model="newTag" style="border:1px solid #d6ddd9;border-radius:7px;padding:6px 8px">
        <option>Work</option>
        <option>Personal</option>
        <option>Urgent</option>
      </select>
      <button class="ws-btn" type="button" @click="addNote">Add+</button>
      <span class="ws-cnts">Pending <b>{{ pendAllCount }}</b> · Completed <b>{{ compAllCount }}</b> · Today <b>{{ todayCnt }}</b></span>
    </div>

    <div class="ws-toolbar ws-filterbar">
      <button
        v-for="c in chips"
        :key="c.id"
        type="button"
        class="ws-chip"
        :class="{ on: filter.mode === c.id }"
        @click="filter.mode = c.id"
      >{{ c.label }}</button>
      <span class="ws-rangewrap">
        <input type="date" :value="filter.from" @change="onRange('from', $event)" /> –
        <input type="date" :value="filter.to" @change="onRange('to', $event)" />
      </span>
      <input
        v-model="filter.q"
        placeholder="Search notes…"
        style="border:1px solid #d6ddd9;border-radius:7px;padding:5px 9px;font-size:12px"
      />
    </div>

    <div class="ws-kanban">
      <div class="ws-kcol">
        <div class="ws-khead pendh">PENDING · {{ pend.length }}</div>
        <div class="ws-kbody">
          <div v-if="!pendGroups.length" class="ws-placeholder" style="padding:18px 0">Nothing pending.</div>
          <template v-for="g in pendGroups" :key="g.date">
            <div class="ws-dayhead">
              {{ g.date.split('-').join('/') }}{{ g.date === today ? ' · Today' : '' }}
              <span class="ws-daycnt">{{ g.items.length }}</span>
            </div>
            <div v-for="n in g.items" :key="n.id" class="ws-note" :class="{ done: n.done }">
              <input type="checkbox" :checked="n.done" @change="toggleNote(n, $event)" />
              <span class="ws-notetxt" :title="n.text">{{ n.text }}</span>
              <span v-if="n.from" class="ws-carry">from {{ n.from.slice(5) }}</span>
              <span v-if="n.done && n.doneAt" class="ws-carry">✓ {{ String(n.doneAt).slice(5, 16) }}</span>
              <span class="ws-tag" :class="n.tag || 'Work'">{{ n.tag || 'Work' }}</span>
              <button class="ws-icobtn" type="button" title="Remove" @click="askRemove(n)">✕</button>
            </div>
          </template>
        </div>
      </div>

      <div class="ws-kcol">
        <div class="ws-khead comph">COMPLETED · {{ comp.length }}</div>
        <div class="ws-kbody">
          <div v-if="!comp.length" class="ws-placeholder" style="padding:18px 0">Nothing completed yet.</div>
          <template v-for="g in compRecentGroups" :key="g.date">
            <div class="ws-dayhead">
              {{ g.date.split('-').join('/') }}{{ g.date === today ? ' · Today' : '' }}
              <span class="ws-daycnt">{{ g.items.length }}</span>
            </div>
            <div v-for="n in g.items" :key="n.id" class="ws-note" :class="{ done: n.done }">
              <input type="checkbox" :checked="n.done" @change="toggleNote(n, $event)" />
              <span class="ws-notetxt" :title="n.text">{{ n.text }}</span>
              <span v-if="n.from" class="ws-carry">from {{ n.from.slice(5) }}</span>
              <span v-if="n.done && n.doneAt" class="ws-carry">✓ {{ String(n.doneAt).slice(5, 16) }}</span>
              <span class="ws-tag" :class="n.tag || 'Work'">{{ n.tag || 'Work' }}</span>
              <button class="ws-icobtn" type="button" title="Remove" @click="askRemove(n)">✕</button>
            </div>
          </template>
          <details v-for="m in compMonths" :key="m.mk" class="ws-month">
            <summary>{{ m.mk.split('-').join('/') }} · {{ m.count }} notes</summary>
            <template v-for="g in m.groups" :key="g.date">
              <div class="ws-dayhead">
                {{ g.date.split('-').join('/') }}
                <span class="ws-daycnt">{{ g.items.length }}</span>
              </div>
              <div v-for="n in g.items" :key="n.id" class="ws-note" :class="{ done: n.done }">
                <input type="checkbox" :checked="n.done" @change="toggleNote(n, $event)" />
                <span class="ws-notetxt" :title="n.text">{{ n.text }}</span>
                <span v-if="n.from" class="ws-carry">from {{ n.from.slice(5) }}</span>
                <span v-if="n.done && n.doneAt" class="ws-carry">✓ {{ String(n.doneAt).slice(5, 16) }}</span>
                <span class="ws-tag" :class="n.tag || 'Work'">{{ n.tag || 'Work' }}</span>
                <button class="ws-icobtn" type="button" title="Remove" @click="askRemove(n)">✕</button>
              </div>
            </template>
          </details>
        </div>
      </div>
    </div>

    <!-- confirm modal (mirrors mockup wsConfirm overlay) -->
    <div v-if="confirmMsg" class="wn-overlay" @click.self="closeConfirm">
      <div class="wn-confbox">
        <div class="wn-confmsg">{{ confirmMsg }}</div>
        <div class="wn-confbtns">
          <button class="ws-btn red" type="button" @click="confirmYes">YES</button>
          <button class="ws-btn grey" type="button" @click="closeConfirm">NO</button>
        </div>
      </div>
    </div>

    <!-- toast -->
    <div class="wn-toast" :class="{ on: toastVisible }">{{ toastMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

const props = defineProps<{ request: (url: string, options?: any) => Promise<any> }>()

const WS_TAB = 'notes'

interface WsNote {
  id: string
  date: string
  text: string
  tag?: string
  done: boolean
  doneAt?: string
  from?: string
}
interface WsNotesDoc {
  notes: WsNote[]
  lastCarry: string
}

const doc = reactive<WsNotesDoc>({ notes: [], lastCarry: '' })

/* ---- helpers (mirror mockup wsToday/wsUid) ---- */
function pad2(n: number) { return String(n).padStart(2, '0') }
function wsToday() {
  const d = new Date()
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
}
function wsUid() { return Math.random().toString(36).slice(2, 10) }
function shiftDay(base: string, days: number) {
  const t = new Date(base + 'T00:00')
  return new Date(t.getTime() + days * 86400e3).toISOString().slice(0, 10)
}

/* ---- toast ---- */
const toastMsg = ref('')
const toastVisible = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null
function toast(m: string) {
  toastMsg.value = m
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, 1900)
}

/* ---- confirm modal ---- */
const confirmMsg = ref('')
let confirmCb: (() => void) | null = null
function askConfirm(msg: string, onYes: () => void) {
  confirmMsg.value = msg
  confirmCb = onYes
}
function closeConfirm() {
  confirmMsg.value = ''
  confirmCb = null
}
function confirmYes() {
  const cb = confirmCb
  closeConfirm()
  if (cb) cb()
}

/* ---- persistence (dedicated workspace API) ---- */
let saveTimer: ReturnType<typeof setTimeout> | null = null
function saveDoc() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(persist, 300)
}
async function persist() {
  try {
    await props.request(`/workspace/${WS_TAB}`, {
      method: 'PUT',
      body: JSON.parse(JSON.stringify(doc)),
    })
  } catch (e) {
    // keep UI usable even if the save fails
  }
}

onMounted(async () => {
  try {
    const res = await props.request(`/workspace/${WS_TAB}`)
    const d = (res && res.data) || {}
    doc.notes = Array.isArray(d.notes) ? d.notes : []
    doc.lastCarry = d.lastCarry || ''
  } catch (e) {
    // start with an empty document
  }
  /* carry-over: undone past notes roll to today (once per day) */
  const t = wsToday()
  if (doc.lastCarry !== t) {
    doc.notes.forEach((n) => {
      if (!n.done && n.date < t) {
        if (!n.from) n.from = n.date
        n.date = t
      }
    })
    doc.lastCarry = t
    saveDoc()
  }
})

/* ---- toolbar state ---- */
const today = computed(() => wsToday())
const noteDay = ref(wsToday())
const newText = ref('')
const newTag = ref('Work')
const filter = reactive<{ mode: string; from: string; to: string; q: string }>({ mode: '7d', from: '', to: '', q: '' })
const chips = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: 'all', label: 'All' },
]

function onRange(which: 'from' | 'to', e: Event) {
  filter[which] = (e.target as HTMLInputElement).value
  filter.mode = 'range'
}

/* ---- filtering (mirror wsNoteRange/wsNotePass) ---- */
function noteRange() {
  const t = wsToday()
  if (filter.mode === 'today') return { from: t, to: t }
  if (filter.mode === '7d') return { from: shiftDay(t, -6), to: t }
  if (filter.mode === '30d') return { from: shiftDay(t, -29), to: t }
  if (filter.mode === 'range') return { from: filter.from || '', to: filter.to || '9999-12-31' }
  return { from: '', to: '9999-12-31' }
}
function notePass(n: WsNote) {
  const rg = noteRange()
  if (rg.from && n.date < rg.from) return false
  if (rg.to && n.date > rg.to) return false
  if (filter.q && String(n.text || '').toLowerCase().indexOf(filter.q.toLowerCase()) < 0) return false
  return true
}

const pendAllCount = computed(() => doc.notes.filter((n) => !n.done).length)
const compAllCount = computed(() => doc.notes.filter((n) => n.done).length)
const todayCnt = computed(() => doc.notes.filter((n) => n.date === today.value && !n.done).length)
const pend = computed(() => doc.notes.filter((n) => !n.done && notePass(n)))
const comp = computed(() => doc.notes.filter((n) => n.done && notePass(n)))

interface DayGroup { date: string; items: WsNote[] }
function dayGroups(list: WsNote[]): DayGroup[] {
  const g: Record<string, WsNote[]> = {}
  list.forEach((n) => { (g[n.date] = g[n.date] || []).push(n) })
  return Object.keys(g).sort().reverse().map((d) => ({ date: d, items: g[d] }))
}
const pendGroups = computed(() => dayGroups(pend.value))
const compRecentGroups = computed(() => {
  const lim = shiftDay(wsToday(), -6)
  return dayGroups(comp.value.filter((n) => n.date >= lim))
})
const compMonths = computed(() => {
  const lim = shiftDay(wsToday(), -6)
  const byMonth: Record<string, WsNote[]> = {}
  comp.value.forEach((n) => {
    if (n.date >= lim) return
    const mk = n.date.slice(0, 7)
    ;(byMonth[mk] = byMonth[mk] || []).push(n)
  })
  return Object.keys(byMonth).sort().reverse().map((mk) => ({
    mk,
    count: byMonth[mk].length,
    groups: dayGroups(byMonth[mk]),
  }))
})

/* ---- mutations ---- */
function addNote() {
  const txt = newText.value.trim()
  if (!txt) { toast('Enter the note first'); return }
  doc.notes.push({ id: wsUid(), date: noteDay.value || wsToday(), text: txt, tag: newTag.value, done: false })
  newText.value = ''
  saveDoc()
}
function toggleNote(n: WsNote, e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  n.done = checked
  if (n.done) {
    const d = new Date()
    n.doneAt = d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) + ' ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes())
  } else {
    n.doneAt = ''
  }
  saveDoc()
}
function askRemove(n: WsNote) {
  askConfirm('Are you sure to remove?', () => {
    doc.notes = doc.notes.filter((x) => x.id !== n.id)
    saveDoc()
    toast('Removed')
  })
}
</script>

<style scoped>
/* --- ws-* rules copied verbatim from the mockup <style> block --- */
.ws-toolbar{display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap}
.ws-new-note-input{flex:1;min-width:180px;border:2px solid #607168;border-radius:7px;padding:6px 10px;background:#fff;outline:none}
.ws-new-note-input:focus{border-color:#008f4c;box-shadow:0 0 0 2px rgba(0,143,76,.12)}
.ws-btn{border:none;border-radius:8px;padding:7px 16px;font-weight:700;font-size:12.5px;color:#fff;cursor:pointer;background:#008F4C}
.ws-btn:hover{background:#04793f}
.ws-btn.grey{background:#64748b}.ws-btn.grey:hover{background:#51606e}
.ws-btn.red{background:#c0392b}.ws-btn.red:hover{background:#a23227}
.ws-btn:disabled{opacity:.45;cursor:not-allowed}
.ws-icobtn{border:none;background:transparent;cursor:pointer;font-size:14px;padding:3px 6px}
.ws-daycnt{background:#008F4C;color:#fff;border-radius:9px;font-size:10.5px;font-weight:800;padding:1px 7px}
.ws-note{display:flex;align-items:center;gap:8px;border:none;border-bottom:1px solid #eef2f0;border-radius:0;padding:4px 6px;margin:0;background:transparent;min-height:30px}
.ws-note:hover{background:#f4f8f5}
.ws-note.done .ws-notetxt{color:#8a94a0}
.ws-note .ws-icobtn{opacity:0;color:#c0392b;padding:1px 4px;font-size:12px}
.ws-note:hover .ws-icobtn{opacity:1}
.ws-note input[type=checkbox]{width:14px;height:14px;flex:none}
.ws-notetxt{flex:1;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.ws-chip{border:1px solid #d6ddd9;background:#fff;border-radius:14px;padding:3px 12px;font-size:11.5px;font-weight:700;color:#5a6875;cursor:pointer}
.ws-chip.on{background:#008F4C;border-color:#008F4C;color:#fff}
.ws-filterbar{margin:-4px 0 10px;gap:6px}
.ws-rangewrap{font-size:11.5px;color:#8a94a0;display:inline-flex;align-items:center;gap:4px}
.ws-rangewrap input{border:1px solid #d6ddd9;border-radius:6px;padding:3px 6px;font-size:11.5px}
.ws-month{margin:6px 0}
.ws-month summary{cursor:pointer;font-size:11.5px;font-weight:800;color:#5a6875;padding:5px 6px;background:#eef1f0;border-radius:7px}
.ws-month[open] summary{margin-bottom:4px}
.ws-tag{font-size:9.5px;font-weight:800;border-radius:8px;padding:1px 7px;flex:none}
.ws-tag.Work{background:#e3efe8;color:#1b6b43}.ws-tag.Personal{background:#e8ecf2;color:#41506b}.ws-tag.Urgent{background:#fbd5d0;color:#a23227}
.ws-carry{font-size:10px;color:#b08950;font-weight:700}
.ws-placeholder{color:#8a94a0;text-align:center;padding:48px 0;font-size:13px}
.ws-cnts{margin-left:auto;font-size:12.5px;color:#5a6875}
.ws-kanban{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.ws-kcol{border:1px solid #e4e9ee;border-radius:12px;background:#fbfcfb;overflow:hidden;display:flex;flex-direction:column}
.ws-khead{font-weight:800;font-size:12px;letter-spacing:.5px;padding:10px 14px}
.ws-khead.pendh{background:#fdf3e7;color:#9a6b1f}
.ws-khead.comph{background:#eaf7ef;color:#1b6b43}
.ws-kbody{padding:10px 12px;overflow-y:auto;max-height:62vh}
.ws-dayhead{font-size:11px;font-weight:800;color:#5a6875;margin:8px 0 6px;display:flex;align-items:center;gap:8px}

/* --- confirm modal (mirrors mockup wsConfirm overlay at SaveAdmin.html:4062) --- */
.wn-overlay{position:fixed;inset:0;background:rgba(10,30,18,.42);display:flex;align-items:center;justify-content:center;z-index:600;padding:24px}
.wn-confbox{background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:22px 26px;min-width:280px;text-align:center}
.wn-confmsg{font-weight:700;font-size:13.5px;color:#33413b;margin-bottom:16px}
.wn-confbtns{display:flex;gap:10px;justify-content:center}

/* --- toast: bottom-left dark pill --- */
.wn-toast{position:fixed;bottom:20px;left:50%;background:#0f3d23;color:#fff;padding:10px 16px;border-radius:8px;font-size:12.5px;font-weight:600;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:700;box-shadow:0 8px 24px rgba(0,0,0,.25);transform:translateX(-50%) translateY(20px)}
.wn-toast.on{opacity:1;transform:translateX(-50%) translateY(0)}
</style>
