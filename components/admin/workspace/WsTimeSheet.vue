<template>
  <div class="wsts-root">
    <div class="ws-toolbar">
      <select
        class="ts-sel"
        :disabled="!adminMode"
        style="border:1px solid #d6ddd9;border-radius:7px;padding:6px 8px"
        :value="sel.country"
        @change="onCountryChange"
      >
        <template v-if="countries.length">
          <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
        </template>
        <option v-else value="">— no staff yet —</option>
      </select>
      <input
        type="month"
        class="ts-mon"
        :disabled="!adminMode"
        :value="sel.month"
        style="border:1px solid #d6ddd9;border-radius:7px;padding:6px 8px"
        @change="onMonthChange"
      />
      <label class="ts-tlabel">From<input type="time" :disabled="!adminMode" :value="cset.fromTime || ''" @change="onFromChange" /></label>
      <label class="ts-tlabel">To<input type="time" :disabled="!adminMode" :value="cset.toTime || ''" @change="onToChange" /></label>
      <button type="button" class="ws-btn" :class="adminMode ? 'red' : 'grey'" @click="onAdminBtn">{{ adminMode ? '🔓 Admin Edit ON' : '🔒 Admin Edit' }}</button>
      <button type="button" class="ws-btn grey" style="margin-left:auto" @click="locOpen = true">📍 Locations</button>
      <button type="button" class="ws-btn grey" @click="loadDemo">Load Example Data</button>
    </div>
    <div class="ts-offrow">
      <span class="ts-offrowlbl">Off days</span>
      <button
        v-for="o in DOW_BTN"
        :key="o.v"
        type="button"
        class="ts-offbtn"
        :class="{ active: cset.offDows.indexOf(o.v) >= 0 }"
        @click="toggleOffDow(o.v)"
      >{{ o.t }}</button>
    </div>
    <div class="ws-scroll">
      <table class="ws-tbl ts-tbl">
        <thead>
          <tr>
            <th
              class="ws-sticky1"
              :style="{ width: colW + 'px', minWidth: colW + 'px', maxWidth: colW + 'px', textAlign: 'center', position: 'relative' }"
            >StaffName<div class="ts-colrsz" title="Drag to resize" @mousedown="startResize"></div></th>
            <th
              v-for="col in dayCols"
              :key="col.d"
              :style="col.off ? 'width:32px;padding:4px 2px;background:#f0f3ee' : 'width:32px;padding:4px 2px'"
            >{{ col.d }}<div class="ts-dow">{{ DOW_EN[col.dow] }}</div></th>
            <th style="width:44px">✓</th>
            <th style="width:44px">● L</th>
            <th style="width:44px">● M</th>
            <th style="width:44px">● H</th>
            <th style="width:38px">P</th>
            <th style="width:38px">O</th>
            <th style="width:44px">✗</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.p.id">
            <td
              class="ws-sticky1 ts-name"
              :style="{ width: colW + 'px', minWidth: colW + 'px', maxWidth: colW + 'px', cursor: 'pointer' }"
              :title="nameTitle(row.p)"
              @click="openStats(row.p.id)"
            ><span class="ts-namemain">{{ row.p.name }}</span></td>
            <td
              v-for="cell in row.cells"
              :key="cell.d"
              class="ts-cell"
              :class="cell.classes"
              :title="cell.title"
              @click="onCellClick(row.p.id, cell.d)"
            >{{ cell.txt }}</td>
            <td class="ts-sum" style="color:#1b6b43">{{ row.cnt.ontime }}</td>
            <td class="ts-sum" style="color:#c9a227">{{ row.cnt.low }}</td>
            <td class="ts-sum" style="color:#e67e22">{{ row.cnt.med }}</td>
            <td class="ts-sum" style="color:#c0392b">{{ row.cnt.high }}</td>
            <td class="ts-sum" style="color:#2563eb">{{ row.cnt.pleave }}</td>
            <td class="ts-sum" style="color:#7c3aed">{{ row.cnt.obvious }}</td>
            <td class="ts-sum" :class="{ 'ts-warn': row.cnt.absent }">{{ row.cnt.absent }}</td>
          </tr>
          <tr v-if="!rows.length">
            <td :colspan="daysInMonth + 8" style="text-align:center;color:#8a94a0;padding:16px">No staff in this country. Click “Load Example Data”.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- mark popup (P.Leave / Obvious) -->
    <div v-if="markPop" class="popov" style="z-index:600">
      <div class="popbox">
        <div class="popmsg" style="margin-bottom:16px">Mark attendance for {{ markPop.dstr }}</div>
        <div class="popbtns">
          <button type="button" class="ws-btn" style="background:#2563eb" @click="onMarkPleave">Mark P.Leave</button>
          <button type="button" class="ws-btn" style="background:#7c3aed" @click="onMarkObvious">Mark Obvious</button>
          <button type="button" class="ws-btn grey" @click="markPop = null">Cancel</button>
        </div>
      </div>
    </div>

    <!-- view popup (existing entry) -->
    <div v-if="viewPop" class="popov" style="z-index:600">
      <div class="popbox">
        <div class="popmsg" style="margin-bottom:8px">{{ viewPop.dstr }}</div>
        <div class="popdetail">{{ viewDetail }}<template v-if="viewMapUrl"> · <a :href="viewMapUrl" target="_blank" rel="noopener" style="color:#22a155">map</a></template></div>
        <div class="poplocknote">{{ viewPop.editable ? '' : 'Locked — enable Admin Edit to change.' }}</div>
        <div class="popbtns">
          <button v-if="viewPop.editable" type="button" class="ws-btn red" @click="onViewClear">Clear</button>
          <button type="button" class="ws-btn grey" @click="viewPop = null">Close</button>
        </div>
      </div>
    </div>

    <!-- locations & assignment panel -->
    <div v-if="locOpen" class="popov" style="z-index:620">
      <div style="background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:20px 22px;width:660px;max-width:96vw;max-height:88vh;overflow:auto">
        <button type="button" style="float:right;border:none;background:none;font-size:18px;cursor:pointer;color:#8a94a0" @click="locOpen = false">✕</button>
        <div>
          <div style="font-weight:800;font-size:14px;color:#16241c;margin-bottom:2px">📍 Locations &amp; Assignment</div>
          <div style="font-size:12px;color:#5d7567;margin-bottom:14px">{{ sel.country || '—' }} · check-in is valid within a location’s radius (metres)</div>
          <div style="font-size:11px;font-weight:800;letter-spacing:.5px;color:#5d7567;text-transform:uppercase;margin-bottom:6px">Locations</div>
          <div v-if="!panelLocs.length" style="font-size:12px;color:#8a94a0;padding:4px 0 8px">No location yet. Add one below.</div>
          <div v-for="L in panelLocs" :key="L.id" style="display:flex;gap:6px;align-items:center;margin-bottom:6px;flex-wrap:wrap">
            <input :value="L.name || ''" placeholder="Name" style="flex:1 1 130px;min-width:120px;border:1px solid #d6ddd9;border-radius:6px;padding:5px 7px;font:inherit" @change="onLocField(L, 'name', $event)" />
            <input :value="L.lat != null ? L.lat : ''" placeholder="Lat" style="width:92px;border:1px solid #d6ddd9;border-radius:6px;padding:5px 7px;font:inherit" @change="onLocField(L, 'lat', $event)" />
            <input :value="L.lng != null ? L.lng : ''" placeholder="Lng" style="width:92px;border:1px solid #d6ddd9;border-radius:6px;padding:5px 7px;font:inherit" @change="onLocField(L, 'lng', $event)" />
            <input :value="L.radiusM != null ? L.radiusM : 150" title="Radius (m)" style="width:56px;border:1px solid #d6ddd9;border-radius:6px;padding:5px 7px;font:inherit" @change="onLocField(L, 'radiusM', $event)" />
            <button type="button" class="ws-btn grey" style="padding:5px 8px" title="Use my current GPS as this location" @click="onLocGps(L.id)">GPS</button>
            <button type="button" class="ws-btn red" style="padding:5px 8px" @click="onLocDelete(L.id)">✕</button>
          </div>
          <button type="button" class="ws-btn" style="margin:6px 0 16px" @click="onLocAdd">+ Add location</button>
          <div style="font-size:11px;font-weight:800;letter-spacing:.5px;color:#5d7567;text-transform:uppercase;margin:6px 0 6px">Assign to staff</div>
          <div v-if="!panelStaff.length" style="font-size:12px;color:#8a94a0">No staff in this country. Load or add staff first.</div>
          <div v-else-if="!panelLocs.length" style="font-size:12px;color:#8a94a0">Add a location first.</div>
          <template v-else>
            <div v-for="p in panelStaff" :key="p.id" style="border-top:1px solid #e3e8e5;padding:8px 0">
              <div style="font-weight:700;font-size:12.5px;color:#16241c;margin-bottom:5px">{{ p.name }} <span style="color:#8a94a0;font-weight:400">{{ p.code || '' }}</span></div>
              <div style="display:flex;gap:14px;flex-wrap:wrap">
                <label v-for="L in panelLocs" :key="L.id" style="font-size:12px;color:#33413b;display:flex;gap:5px;align-items:center;cursor:pointer">
                  <input type="checkbox" :checked="(p.locIds || []).indexOf(L.id) >= 0" @change="onAssignToggle(p, L.id, $event)" />{{ L.name || '(unnamed)' }}
                </label>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- stats popup -->
    <div v-if="stats.show" class="ws-qpopov" :class="{ in: statsIn }" @click.self="closeStats">
      <div class="ws-qpopbox" style="max-width:560px">
        <button type="button" class="ws-qpopclose" title="Close" aria-label="Close" @click="closeStats">✕</button>
        <div v-if="statsStaff">
          <div class="ws-qdochd" style="margin-bottom:10px"><span></span><span class="ws-qdoctitle">{{ statsStaff.name }}</span><span></span></div>
          <div class="ws-qsummary">{{ statsSummary }}</div>
          <div class="ws-qmodetabs" style="margin-bottom:10px">
            <button
              v-for="pr in STAT_PERIODS"
              :key="pr.k"
              type="button"
              class="ws-qmodetab"
              :class="{ active: pr.k === stats.period }"
              @click="stats.period = pr.k"
            >{{ pr.t }}</button>
          </div>
          <div class="ts-statsnav">
            <button type="button" class="ts-navbtn" :title="'Previous ' + stats.period" @click="shiftAnchor(-1)">‹</button>
            <span>{{ statsRangeStr }}</span>
            <button type="button" class="ts-navbtn" :title="'Next ' + stats.period" @click="shiftAnchor(1)">›</button>
            <button type="button" class="ws-btn grey" style="margin-left:auto;padding:4px 10px;font-size:11px" @click="statsToday">Today</button>
          </div>
          <div class="ws-qstats-grid">
            <div class="ws-qstat"><span>On time</span><b style="color:#1b6b43">{{ statsResult.counts.ontime }}</b></div>
            <div class="ws-qstat"><span>Low</span><b style="color:#c9a227">{{ statsResult.counts.low }}</b></div>
            <div class="ws-qstat"><span>Med</span><b style="color:#e67e22">{{ statsResult.counts.med }}</b></div>
            <div class="ws-qstat warn"><span>High</span><b>{{ statsResult.counts.high }}</b></div>
            <div class="ws-qstat"><span>P.Leave</span><b style="color:#2563eb">{{ statsResult.counts.pleave }}</b></div>
            <div class="ws-qstat"><span>Obvious</span><b style="color:#7c3aed">{{ statsResult.counts.obvious }}</b></div>
            <div class="ws-qstat warn"><span>Absent</span><b>{{ statsResult.counts.absent }}</b></div>
          </div>
          <div v-if="statsResult.obviousList.length" style="margin-top:14px">
            <div style="font-size:11.5px;font-weight:800;color:#5a6875;margin-bottom:6px">Obvious details</div>
            <div
              v-for="o in statsResult.obviousList"
              :key="o.date"
              style="font-size:12px;color:#5a6875;padding:4px 0;border-top:1px solid #e3e8e5"
            ><b style="color:#16241c">{{ o.date }}</b> — {{ o.reason || '(no reason)' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- confirm modal (matches mockup wsConfirm) -->
    <div v-if="confirmState" class="mov">
      <div class="cfbox">
        <div class="cfmsg">{{ confirmState.msg }}</div>
        <div class="cfbtns">
          <button type="button" class="ws-btn red" @click="confirmYes">YES</button>
          <button type="button" class="ws-btn grey" @click="confirmNo">NO</button>
        </div>
      </div>
    </div>

    <!-- prompt modal (matches mockup wsPrompt) -->
    <div v-if="promptState" class="mov" style="z-index:99">
      <div class="pmbox">
        <div class="pmmsg">{{ promptState.msg }}</div>
        <input
          ref="promptInput"
          v-model="promptState.value"
          class="pminput"
          @keydown.enter="promptOk"
          @keydown.esc="promptCancel"
        />
        <div class="cfbtns">
          <button type="button" class="ws-btn" style="min-width:80px" @click="promptOk">OK</button>
          <button type="button" class="ws-btn grey" style="min-width:80px" @click="promptCancel">Cancel</button>
        </div>
      </div>
    </div>

    <div class="toast" :class="{ on: toastOn }">{{ toastMsg }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ request: (url: string, options?: any) => Promise<any> }>()

interface TsGeo {
  lat?: number
  lng?: number
  acc?: number
  dist?: number
  locId?: string
  locName?: string
  status: 'in' | 'weak' | 'out' | 'denied' | 'none'
  reason?: string
}
interface TsEntry {
  type: 'checkin' | 'pleave' | 'obvious'
  time?: string
  level?: 'ontime' | 'low' | 'med' | 'high'
  reason?: string
  ts?: string
  geo?: TsGeo
}
interface TsStaff {
  id: string
  name: string
  code?: string
  country: string
  position?: string
  company?: string
  locIds?: string[]
}
interface TsLocation {
  id: string
  name: string
  country: string
  lat: number | null
  lng: number | null
  radiusM: number | null
}
interface TsCountrySetting {
  fromTime: string
  toTime: string
  offDows: number[]
}
interface TsDoc {
  __ver: number
  staff: TsStaff[]
  marks: Record<string, Record<string, Record<number, TsEntry>>>
  locations: TsLocation[]
  countrySettings: Record<string, TsCountrySetting>
}

const DOW_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DOW_BTN = [
  { v: 1, t: 'Mon' },
  { v: 2, t: 'Tue' },
  { v: 3, t: 'Wed' },
  { v: 4, t: 'Thu' },
  { v: 5, t: 'Fri' },
  { v: 6, t: 'Sat' },
  { v: 0, t: 'Sun' },
]
const STAT_PERIODS = [
  { k: 'week', t: 'Week' },
  { k: 'month', t: 'Month' },
  { k: 'quarter', t: 'Quarter' },
  { k: 'year', t: 'Year' },
] as const

function pad2(n: number) {
  return (n < 10 ? '0' : '') + n
}
function wsToday() {
  const d = new Date()
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate())
}
function wsUid() {
  return Math.random().toString(36).slice(2, 10)
}

/* ---- geo helpers (attendance geofence) ---- */
function wsHaversine(la1: number, lo1: number, la2: number, lo2: number) {
  const R = 6371000
  const t = Math.PI / 180
  const dLa = (la2 - la1) * t
  const dLo = (lo2 - lo1) * t
  const a = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(la1 * t) * Math.cos(la2 * t) * Math.sin(dLo / 2) * Math.sin(dLo / 2)
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)))
}
interface GeoFix {
  lat: number
  lng: number
  acc: number
}
function wsGeoGet(onOk: (g: GeoFix) => void, onErr: (err: { message?: string }) => void) {
  if (!navigator.geolocation) {
    onErr({ message: 'GPS not supported' })
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      onOk({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy })
    },
    (err) => {
      onErr(err || { message: 'denied' })
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  )
}

/* ---------- document state (mirrors mockup localStorage wsTs) ---------- */
const wsTs = reactive<TsDoc>({ __ver: 3, staff: [], marks: {}, locations: [], countrySettings: {} })
const sel = reactive({ country: '', month: wsToday().slice(0, 7) })
const colW = ref(150)
const adminMode = ref(false)
const today = wsToday()

const countries = computed(() => {
  const list: string[] = []
  wsTs.staff.forEach((p) => {
    if (list.indexOf(p.country) < 0) list.push(p.country)
  })
  return list
})

watchEffect(() => {
  if (!sel.country && countries.value.length) sel.country = countries.value[0]
})

const cset = computed<TsCountrySetting>(() => {
  const key = sel.country || ''
  return wsTs.countrySettings[key] || { fromTime: '08:30', toTime: '17:00', offDows: [0, 6] }
})

watchEffect(() => {
  const key = sel.country || ''
  if (!wsTs.countrySettings[key]) {
    wsTs.countrySettings[key] = { fromTime: '08:30', toTime: '17:00', offDows: [0, 6] }
  }
})

function isOff(dow: number) {
  return cset.value.offDows.indexOf(dow) >= 0
}

const year = computed(() => +sel.month.slice(0, 4))
const month = computed(() => +sel.month.slice(5, 7))
const daysInMonth = computed(() => new Date(year.value, month.value, 0).getDate())

const dayCols = computed(() => {
  const cols: { d: number; dow: number; off: boolean }[] = []
  for (let d = 1; d <= daysInMonth.value; d++) {
    const dow = new Date(year.value, month.value - 1, d).getDay()
    cols.push({ d, dow, off: isOff(dow) })
  }
  return cols
})

function dstrOf(d: number) {
  return sel.month + '-' + pad2(d)
}

function cellVisual(entry: TsEntry | undefined, isPastEmpty: boolean): { cls: string; txt: string } {
  if (entry) {
    if (entry.type === 'checkin') {
      if (entry.level === 'ontime') return { cls: 'ts-ontime', txt: '✓' }
      if (entry.level === 'low') return { cls: 'ts-low', txt: '●' }
      if (entry.level === 'med') return { cls: 'ts-med', txt: '●' }
      return { cls: 'ts-high', txt: '●' }
    }
    if (entry.type === 'pleave') return { cls: 'ts-pleave', txt: 'P' }
    if (entry.type === 'obvious') return { cls: 'ts-obvious', txt: 'O' }
  }
  if (isPastEmpty) return { cls: 'ts-absent', txt: '✗' }
  return { cls: 'ts-na', txt: '' }
}

interface RowCnt {
  ontime: number
  low: number
  med: number
  high: number
  pleave: number
  obvious: number
  absent: number
}
interface RowCell {
  d: number
  classes: string[]
  txt: string
  title: string
}
const rows = computed(() => {
  const marks = wsTs.marks[sel.month] || {}
  const staff = wsTs.staff.filter((p) => p.country === sel.country)
  return staff.map((p) => {
    const pm = marks[p.id] || {}
    const cnt: RowCnt = { ontime: 0, low: 0, med: 0, high: 0, pleave: 0, obvious: 0, absent: 0 }
    const cells: RowCell[] = []
    for (let d = 1; d <= daysInMonth.value; d++) {
      const dow = new Date(year.value, month.value - 1, d).getDay()
      if (isOff(dow)) {
        cells.push({ d, classes: ['ts-off'], txt: '', title: '' })
        continue
      }
      const dstr = dstrOf(d)
      const entry = pm[d]
      const isPast = dstr < today
      const isPastEmpty = !entry && isPast
      if (isPastEmpty) cnt.absent++
      else if (entry) {
        if (entry.type === 'checkin') cnt[entry.level || 'ontime']++
        else cnt[entry.type]++
      }
      const vis = cellVisual(entry, isPastEmpty)
      const isToday = dstr === today
      const classes = [vis.cls]
      if (isToday) classes.push('ts-today')
      let title = p.name + ' · ' + dstr
      if (entry && entry.type === 'checkin') title += ' · ' + entry.time
      if (entry && entry.type === 'obvious') title += ' · ' + (entry.reason || '')
      cells.push({ d, classes, txt: vis.txt, title })
    }
    return { p, cells, cnt }
  })
})

function nameTitle(p: TsStaff) {
  return (
    (p.code || '') +
    (p.position ? ' · ' + p.position : '') +
    (p.company ? ' · ' + p.company : '') +
    ' — click for stats'
  )
}

/* ---------- persistence (dedicated workspace API) ---------- */
let saveTimer: ReturnType<typeof setTimeout> | null = null

async function load() {
  try {
    const res = await props.request('/workspace/timesheet')
    const d = res?.data
    if (d && typeof d === 'object') {
      wsTs.staff = Array.isArray(d.staff) ? d.staff : []
      wsTs.marks = d.marks && typeof d.marks === 'object' ? d.marks : {}
      wsTs.countrySettings = d.countrySettings && typeof d.countrySettings === 'object' ? d.countrySettings : {}
      wsTs.__ver = 2
      if (d.__ver !== 2) wsTs.marks = {}
      /* upgrade to __ver 3: locations + staff locIds */
      wsTs.locations = Array.isArray(d.locations) ? d.locations : []
      wsTs.staff.forEach((p) => {
        p.locIds = Array.isArray(p.locIds) ? p.locIds : []
      })
      wsTs.__ver = 3
    }
  } catch (e) {
    console.error('WsTimeSheet load failed', e)
  }
}

function saveDoc() {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(doSave, 300)
}

async function doSave() {
  try {
    await props.request('/workspace/timesheet', {
      method: 'PUT',
      body: JSON.parse(JSON.stringify(wsTs)),
    })
  } catch (e) {
    console.error('WsTimeSheet save failed', e)
  }
}

onMounted(load)

/* ---------- toast ---------- */
const toastMsg = ref('')
const toastOn = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null
function toast(m: string) {
  toastMsg.value = m
  toastOn.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastOn.value = false
  }, 1900)
}

/* ---------- confirm / prompt modals ---------- */
const confirmState = ref<{ msg: string; onYes: () => void } | null>(null)
function openConfirm(msg: string, onYes: () => void) {
  confirmState.value = { msg, onYes }
}
function confirmYes() {
  const fn = confirmState.value?.onYes
  confirmState.value = null
  if (fn) fn()
}
function confirmNo() {
  confirmState.value = null
}

const promptState = ref<{ msg: string; value: string; onOk: (v: string) => void } | null>(null)
const promptInput = ref<HTMLInputElement | null>(null)
function openPrompt(msg: string, defVal: string, onOk: (v: string) => void) {
  promptState.value = { msg, value: defVal || '', onOk }
  nextTick(() => {
    setTimeout(() => {
      promptInput.value?.focus()
      promptInput.value?.select()
    }, 30)
  })
}
function promptOk() {
  const st = promptState.value
  promptState.value = null
  if (st) st.onOk(st.value)
}
function promptCancel() {
  promptState.value = null
}

/* ---------- toolbar handlers ---------- */
function onCountryChange(e: Event) {
  sel.country = (e.target as HTMLSelectElement).value
}
function onMonthChange(e: Event) {
  sel.month = (e.target as HTMLInputElement).value || wsToday().slice(0, 7)
}
function onFromChange(e: Event) {
  cset.value.fromTime = (e.target as HTMLInputElement).value
  saveDoc()
}
function onToChange(e: Event) {
  cset.value.toTime = (e.target as HTMLInputElement).value
  saveDoc()
}
function onAdminBtn() {
  if (adminMode.value) {
    adminMode.value = false
    return
  }
  openConfirm('Enable Admin Edit mode?', () => {
    adminMode.value = true
  })
}
function toggleOffDow(v: number) {
  const i = cset.value.offDows.indexOf(v)
  if (i >= 0) cset.value.offDows.splice(i, 1)
  else cset.value.offDows.push(v)
  saveDoc()
}

/* ---------- column resize ---------- */
function startResize(e: MouseEvent) {
  e.preventDefault()
  const startX = e.clientX
  const startW = colW.value
  const onMove = (e2: MouseEvent) => {
    colW.value = Math.max(90, Math.min(320, startW + (e2.clientX - startX)))
  }
  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

/* ---------- mark mutations ---------- */
function ensureMarks(sid: string) {
  if (!wsTs.marks[sel.month]) wsTs.marks[sel.month] = {}
  if (!wsTs.marks[sel.month][sid]) wsTs.marks[sel.month][sid] = {}
  return wsTs.marks[sel.month][sid]
}
function recordCheckin(sid: string, d: number, geo?: TsGeo) {
  const now = new Date()
  const hh = now.getHours()
  const mi = now.getMinutes()
  const timeStr = pad2(hh) + ':' + pad2(mi)
  const fp = (cset.value.fromTime || '08:30').split(':').map(Number)
  const fromMin = fp[0] * 60 + fp[1]
  const nowMin = hh * 60 + mi
  const diffH = (nowMin - fromMin) / 60
  let level: 'ontime' | 'low' | 'med' | 'high'
  if (diffH <= 0) level = 'ontime'
  else if (diffH <= 3) level = 'low'
  else if (diffH <= 6) level = 'med'
  else level = 'high'
  const pm = ensureMarks(sid)
  pm[d] = { type: 'checkin', time: timeStr, level, ts: now.toISOString(), geo: geo || { status: 'none' } }
  saveDoc()
  let m = 'Checked in at ' + timeStr
  if (geo) {
    if (geo.status === 'in') m += ' · 📍 ' + (geo.locName || '') + ' ' + geo.dist + 'm'
    else if (geo.status === 'weak') m += ' · 📍 ~' + geo.dist + 'm (weak)'
    else if (geo.status === 'out') m += ' · ⚠ out of range ' + geo.dist + 'm'
  }
  toast(m)
}
function doCheckin(sid: string, d: number) {
  const p = wsTs.staff.filter((x) => x.id === sid)[0]
  if (!p) return
  const myLocs = (wsTs.locations || []).filter((L) => (p.locIds || []).indexOf(L.id) >= 0 && L.lat != null && L.lng != null)
  if (!myLocs.length) {
    openConfirm('No verified location assigned to ' + p.name + '. Check in WITHOUT GPS?', () => {
      recordCheckin(sid, d, { status: 'none' })
    })
    return
  }
  toast('Getting your location…')
  wsGeoGet(
    (g) => {
      let best: { loc: TsLocation; dist: number } | null = null
      myLocs.forEach((L) => {
        const dd = wsHaversine(g.lat, g.lng, L.lat as number, L.lng as number)
        if (!best || dd < best.dist) best = { loc: L, dist: dd }
      })
      const b = best as { loc: TsLocation; dist: number }
      const rad = b.loc.radiusM || 150
      let status: 'in' | 'weak' | 'out'
      if (b.dist <= rad) status = 'in'
      else if (b.dist - g.acc <= rad) status = 'weak'
      else status = 'out'
      const geo: TsGeo = {
        lat: +g.lat.toFixed(6),
        lng: +g.lng.toFixed(6),
        acc: Math.round(g.acc),
        dist: Math.round(b.dist),
        locId: b.loc.id,
        locName: b.loc.name,
        status,
      }
      if (status === 'in') {
        recordCheckin(sid, d, geo)
      } else if (status === 'weak') {
        openConfirm('GPS weak (±' + geo.acc + 'm). Nearest “' + b.loc.name + '” ~' + geo.dist + 'm. Accept check-in?', () => {
          recordCheckin(sid, d, geo)
        })
      } else {
        openPrompt('OUT of range: ' + geo.dist + 'm from “' + b.loc.name + '” (allowed ' + rad + 'm). Enter reason to check in anyway, or Cancel:', '', (reason) => {
          geo.reason = reason
          recordCheckin(sid, d, geo)
        })
      }
    },
    (err) => {
      openConfirm('Location error: ' + (err.message || 'denied') + '. Check in WITHOUT GPS verification?', () => {
        recordCheckin(sid, d, { status: 'denied' })
      })
    }
  )
}
function setMark(sid: string, d: number, type: 'pleave' | 'obvious', reason?: string) {
  const pm = ensureMarks(sid)
  pm[d] = { type, reason: reason || '', ts: new Date().toISOString() }
  saveDoc()
}
function clearMark(sid: string, d: number) {
  const pm = ensureMarks(sid)
  delete pm[d]
  saveDoc()
}

/* ---------- mark / view popups ---------- */
const markPop = ref<{ sid: string; d: number; dstr: string } | null>(null)
function onMarkPleave() {
  const pop = markPop.value
  markPop.value = null
  if (pop) setMark(pop.sid, pop.d, 'pleave')
}
function onMarkObvious() {
  const pop = markPop.value
  markPop.value = null
  if (!pop) return
  openPrompt('Reason for Obvious leave:', '', (reason) => {
    setMark(pop.sid, pop.d, 'obvious', reason)
  })
}

const viewPop = ref<{ sid: string; d: number; dstr: string; entry: TsEntry; editable: boolean } | null>(null)
const viewDetail = computed(() => {
  const pop = viewPop.value
  if (!pop) return ''
  const entry = pop.entry
  if (entry.type === 'checkin') {
    let det = 'Check-in at ' + entry.time + ' — ' + (entry.level || '').toUpperCase()
    const g = entry.geo
    if (g) {
      if (g.status === 'in') det += ' · 📍 ' + (g.locName || '') + ' ' + g.dist + 'm'
      else if (g.status === 'weak') det += ' · 📍 ' + (g.locName || '') + ' ~' + g.dist + 'm (weak ±' + g.acc + 'm)'
      else if (g.status === 'out') det += ' · ⚠ OUT ' + g.dist + 'm from ' + (g.locName || '') + (g.reason ? ' · ' + g.reason : '')
      else if (g.status === 'denied') det += ' · GPS not verified'
      else if (g.status === 'none') det += ' · no location assigned'
    }
    return det
  }
  if (entry.type === 'pleave') return 'P.Leave (approved)'
  return 'Obvious — ' + (entry.reason || '(no reason given)')
})
const viewMapUrl = computed(() => {
  const pop = viewPop.value
  if (!pop || pop.entry.type !== 'checkin') return null
  const g = pop.entry.geo
  if (g && g.lat != null) return 'https://maps.google.com/?q=' + g.lat + ',' + g.lng
  return null
})
function onViewClear() {
  const pop = viewPop.value
  viewPop.value = null
  if (!pop) return
  openConfirm('Are you sure to clear this entry?', () => {
    clearMark(pop.sid, pop.d)
  })
}

function onCellClick(sid: string, d: number) {
  const dow = new Date(year.value, month.value - 1, d).getDay()
  if (isOff(dow)) return
  const dstr = dstrOf(d)
  const isToday = dstr === today
  const isPast = dstr < today
  const isFuture = dstr > today
  const entry = (wsTs.marks[sel.month] || {})[sid]?.[d]
  if (entry) {
    const editable = isFuture || adminMode.value
    viewPop.value = { sid, d, dstr, entry, editable }
    return
  }
  if (isPast) {
    if (adminMode.value) markPop.value = { sid, d, dstr }
    else toast('Past entries are locked. Enable Admin Edit to correct.')
    return
  }
  if (isToday) {
    doCheckin(sid, d)
    return
  }
  if (isFuture) {
    markPop.value = { sid, d, dstr }
  }
}

/* ---------- locations & assignment panel ---------- */
const locOpen = ref(false)
const panelLocs = computed(() => (wsTs.locations || []).filter((L) => L.country === (sel.country || '')))
const panelStaff = computed(() => wsTs.staff.filter((p) => p.country === sel.country))

function onLocField(L: TsLocation, f: 'name' | 'lat' | 'lng' | 'radiusM', e: Event) {
  const v = (e.target as HTMLInputElement).value
  if (f === 'name') L.name = v
  else (L as any)[f] = v === '' ? null : +v
  saveDoc()
}
function onLocGps(id: string) {
  toast('Reading GPS…')
  wsGeoGet(
    (g) => {
      const L = (wsTs.locations || []).filter((x) => x.id === id)[0]
      if (!L) return
      L.lat = +g.lat.toFixed(6)
      L.lng = +g.lng.toFixed(6)
      saveDoc()
      toast('Captured ±' + Math.round(g.acc) + 'm')
    },
    (err) => {
      toast('GPS error: ' + (err.message || 'denied'))
    }
  )
}
function onLocDelete(id: string) {
  openConfirm('Delete this location?', () => {
    wsTs.locations = (wsTs.locations || []).filter((x) => x.id !== id)
    wsTs.staff.forEach((p) => {
      if (p.locIds) p.locIds = p.locIds.filter((x) => x !== id)
    })
    saveDoc()
  })
}
function onLocAdd() {
  wsTs.locations = wsTs.locations || []
  wsTs.locations.push({ id: wsUid(), name: 'New location', country: sel.country || '', lat: null, lng: null, radiusM: 150 })
  saveDoc()
}
function onAssignToggle(p: TsStaff, lid: string, e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  p.locIds = p.locIds || []
  const i = p.locIds.indexOf(lid)
  if (checked) {
    if (i < 0) p.locIds.push(lid)
  } else if (i >= 0) p.locIds.splice(i, 1)
  saveDoc()
}

/* ---------- stats popup ---------- */
const stats = reactive<{ show: boolean; sid: string; period: 'week' | 'month' | 'quarter' | 'year'; anchorTs: number }>({
  show: false,
  sid: '',
  period: 'month',
  anchorTs: Date.now(),
})
const statsIn = ref(false)

const statsStaff = computed(() => wsTs.staff.filter((x) => x.id === stats.sid)[0] || null)

function openStats(sid: string) {
  const p = wsTs.staff.filter((x) => x.id === sid)[0]
  if (!p) return
  stats.sid = sid
  stats.period = 'month'
  stats.anchorTs = Date.now()
  stats.show = true
  statsIn.value = false
  requestAnimationFrame(() => {
    statsIn.value = true
  })
}
function closeStats() {
  statsIn.value = false
  setTimeout(() => {
    stats.show = false
  }, 220)
}

const statsSummary = computed(() => {
  const p = statsStaff.value
  if (!p) return ''
  return (
    (p.code || '') +
    (p.position ? ' · ' + p.position : '') +
    (p.company ? ' · ' + p.company : '') +
    ' · ' +
    (p.country || '')
  )
})

function dateRangeFor(period: string, anchor: number) {
  const d = new Date(anchor)
  if (period === 'week') {
    const day = d.getDay()
    const diffToMon = day === 0 ? -6 : 1 - day
    const start = new Date(d)
    start.setDate(d.getDate() + diffToMon)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return { start, end }
  }
  if (period === 'month') {
    return { start: new Date(d.getFullYear(), d.getMonth(), 1), end: new Date(d.getFullYear(), d.getMonth() + 1, 0) }
  }
  if (period === 'quarter') {
    const q = Math.floor(d.getMonth() / 3)
    return { start: new Date(d.getFullYear(), q * 3, 1), end: new Date(d.getFullYear(), q * 3 + 3, 0) }
  }
  return { start: new Date(d.getFullYear(), 0, 1), end: new Date(d.getFullYear(), 11, 31) }
}
function monthKeyOf(d: Date) {
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1)
}

const statsResult = computed(() => {
  const p = statsStaff.value
  const counts: RowCnt = { ontime: 0, low: 0, med: 0, high: 0, pleave: 0, obvious: 0, absent: 0 }
  const obviousList: { date: string; reason: string }[] = []
  const range = dateRangeFor(stats.period, stats.anchorTs)
  if (!p) return { counts, obviousList, range }
  const pcset = wsTs.countrySettings[p.country] || { offDows: [0, 6] }
  const cur = new Date(range.start)
  while (cur <= range.end) {
    const dstr = cur.getFullYear() + '-' + pad2(cur.getMonth() + 1) + '-' + pad2(cur.getDate())
    if (dstr > today) {
      cur.setDate(cur.getDate() + 1)
      continue
    }
    const dow = cur.getDay()
    if ((pcset.offDows || [0, 6]).indexOf(dow) >= 0) {
      cur.setDate(cur.getDate() + 1)
      continue
    }
    const mkk = monthKeyOf(cur)
    const entry = ((wsTs.marks[mkk] || {})[p.id] || {})[cur.getDate()]
    if (entry) {
      if (entry.type === 'checkin') counts[entry.level || 'ontime']++
      else {
        counts[entry.type]++
        if (entry.type === 'obvious') obviousList.push({ date: dstr, reason: entry.reason || '' })
      }
    } else counts.absent++
    cur.setDate(cur.getDate() + 1)
  }
  return { counts, obviousList, range }
})

const statsRangeStr = computed(() => {
  const r = statsResult.value.range
  return r.start.toLocaleDateString('en-GB') + ' – ' + r.end.toLocaleDateString('en-GB')
})

function shiftAnchor(dir: number) {
  const d = new Date(stats.anchorTs)
  if (stats.period === 'week') d.setDate(d.getDate() + 7 * dir)
  else if (stats.period === 'month') d.setMonth(d.getMonth() + dir)
  else if (stats.period === 'quarter') d.setMonth(d.getMonth() + 3 * dir)
  else d.setFullYear(d.getFullYear() + dir)
  stats.anchorTs = d.getTime()
}
function statsToday() {
  stats.anchorTs = Date.now()
}

/* ---------- demo data ---------- */
function loadDemo() {
  const go = () => {
    const t = wsToday()
    const mk = t.slice(0, 7)
    wsTs.staff = [
      { id: 'st1', name: 'NGUYEN HUU PHUOC', code: 'VN001', country: 'VIETNAM', position: 'Manager', company: 'TX LOGISTICS VIETNAM CO., LTD' },
      { id: 'st2', name: 'MS. LAN', code: 'VN002', country: 'VIETNAM', position: 'Sales', company: 'TX LOGISTICS VIETNAM CO., LTD' },
      { id: 'st3', name: 'MR. TUAN', code: 'VN003', country: 'VIETNAM', position: 'Ops', company: 'SHOPTRANS VIETNAM CO., LTD' },
      { id: 'st4', name: 'SOMCHAI P.', code: 'TH001', country: 'THAILAND', position: 'Sales', company: 'TX LOGISTICS VIETNAM CO., LTD' },
      { id: 'st5', name: 'WONG K.M.', code: 'HK001', country: 'HONG KONG', position: 'Ops', company: 'SHOPTRANS VIETNAM CO., LTD' },
    ]
    wsTs.locations = [
      { id: 'loc_vn_hq', name: 'VN HQ - District 1', country: 'VIETNAM', lat: 10.7769, lng: 106.7009, radiusM: 150 },
      { id: 'loc_vn_port', name: 'Cat Lai Port', country: 'VIETNAM', lat: 10.75, lng: 106.79, radiusM: 300 },
      { id: 'loc_th', name: 'Bangkok Office', country: 'THAILAND', lat: 13.7563, lng: 100.5018, radiusM: 150 },
      { id: 'loc_hk', name: 'Hong Kong Office', country: 'HONG KONG', lat: 22.3193, lng: 114.1694, radiusM: 150 },
    ]
    const LMAP: Record<string, string[]> = { st1: ['loc_vn_hq', 'loc_vn_port'], st2: ['loc_vn_hq'], st3: ['loc_vn_hq'], st4: ['loc_th'], st5: ['loc_hk'] }
    wsTs.staff.forEach((p) => {
      p.locIds = LMAP[p.id] || []
    })
    wsTs.countrySettings = {
      VIETNAM: { fromTime: '08:30', toTime: '17:00', offDows: [0, 6] },
      THAILAND: { fromTime: '08:00', toTime: '17:00', offDows: [0, 6] },
      'HONG KONG': { fromTime: '09:00', toTime: '18:00', offDows: [0, 6] },
    }
    const mm: Record<string, Record<number, TsEntry>> = {}
    const todayD = +wsToday().slice(8, 10)
    ;['st1', 'st2', 'st3', 'st4', 'st5'].forEach((sid, si) => {
      mm[sid] = {}
      for (let d = 1; d < Math.min(todayD, 28); d++) {
        const wd = new Date(+mk.slice(0, 4), +mk.slice(5, 7) - 1, d).getDay()
        if (wd === 0 || wd === 6) continue
        const r = (d * 7 + si * 3) % 10
        if (r < 5) mm[sid][d] = { type: 'checkin', time: '08:1' + (r % 5), level: 'ontime', ts: mk + '-' + String(d).padStart(2, '0') + 'T08:15:00.000Z' }
        else if (r < 7) mm[sid][d] = { type: 'checkin', time: '10:45', level: 'low', ts: mk + '-' + String(d).padStart(2, '0') + 'T10:45:00.000Z' }
        else if (r < 8) mm[sid][d] = { type: 'checkin', time: '13:20', level: 'med', ts: mk + '-' + String(d).padStart(2, '0') + 'T13:20:00.000Z' }
        else if (r < 9) mm[sid][d] = { type: 'pleave', ts: mk + '-' + String(d).padStart(2, '0') + 'T00:00:00.000Z' }
      }
    })
    mm['st3'][2] = { type: 'obvious', reason: 'Family emergency', ts: mk + '-02T00:00:00.000Z' }
    wsTs.marks = {}
    wsTs.marks[mk] = mm
    sel.month = mk
    sel.country = 'VIETNAM'
    saveDoc()
  }
  if (wsTs.staff.length) {
    openConfirm('Replace current data with example data?', () => {
      go()
      toast('Example data loaded')
    })
  } else {
    go()
    toast('Example data loaded')
  }
}
</script>

<style scoped>
.ws-toolbar{display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap}
.ws-btn{border:none;border-radius:8px;padding:7px 16px;font-weight:700;font-size:12.5px;color:#fff;cursor:pointer;background:#008F4C}
.ws-btn:hover{background:#04793f}
.ws-btn.grey{background:#64748b}.ws-btn.grey:hover{background:#51606e}
.ws-btn.red{background:#c0392b}.ws-btn.red:hover{background:#a23227}
.ws-btn:disabled{opacity:.45;cursor:not-allowed}
.ws-scroll{overflow-x:auto}
.ws-tbl{width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px}
.ws-tbl th{background:#f0f3ee;font-weight:700;color:#42504b;border:1px solid #dfe5ea;padding:8px 10px;position:sticky;top:0}
.ws-tbl td{border:1px solid #e4e9ee;padding:6px 8px;vertical-align:middle;background:#fff}
.ws-sticky1{position:sticky;left:0;z-index:3;background:#fff}
th.ws-sticky1{background:#f0f3ee;z-index:4}
.ts-tbl{min-width:1280px}
.ts-tbl th,.ts-tbl td{text-align:center}
.ts-cell{cursor:pointer;font-weight:800;font-size:12px;padding:4px 1px!important;user-select:none}
.ts-cell:hover{outline:2px solid #9ed4b5;outline-offset:-2px}
.ts-cell.ts-off{background:#f7f9f8;cursor:default}
.ts-cell.ts-na{cursor:pointer}
.ts-cell.ts-na:hover{background:#eef9f1}
.ts-cell.ts-ontime{color:#1b6b43;font-size:14px}
.ts-cell.ts-low{color:#c9a227;font-size:36px;line-height:1}
.ts-cell.ts-med{color:#e67e22;font-size:36px;line-height:1}
.ts-cell.ts-high{color:#c0392b;font-size:36px;line-height:1}
.ts-cell.ts-pleave{color:#2563eb}
.ts-cell.ts-obvious{color:#7c3aed}
.ts-cell.ts-absent{color:#c0392b}
.ts-dow{font-size:8.5px;font-weight:700;color:#8a94a0;margin-top:1px}
.ts-colrsz{position:absolute;top:0;right:0;width:6px;height:100%;cursor:col-resize;z-index:4}
.ts-colrsz:hover,.ts-colrsz:active{background:rgba(27,107,67,.25)}
.ts-tlabel{display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;color:#5a6875}
.ts-tlabel input,.ts-tlabel select{border:1px solid #d6ddd9;border-radius:7px;padding:6px 8px;font:inherit;font-size:12.5px}
.ts-sel:disabled,.ts-mon:disabled,.ts-tlabel input:disabled{background:#f1f4f2;color:#9aa5a0;border-color:#e2e8ee;cursor:not-allowed;opacity:.75}
.ts-offrow{display:flex;align-items:center;gap:8px;margin:10px 0;flex-wrap:wrap}
.ts-offrowlbl{font-size:11.5px;font-weight:700;color:#5a6875}
.ts-offbtn{padding:5px 12px;border-radius:7px;border:1px solid #d9e0dc;background:#fff;font-size:11.5px;font-weight:700;color:#5a6875;cursor:pointer}
.ts-offbtn:hover{border-color:#9ed4b5}
.ts-offbtn.active{background:#1b6b43;border-color:#1b6b43;color:#fff}
.ts-statsnav{display:flex;align-items:center;gap:10px;margin-bottom:14px;font-size:12px;color:#5a6875;font-weight:700}
.ts-navbtn{width:26px;height:26px;border-radius:6px;border:1px solid #d9e0dc;background:#fff;font-size:15px;font-weight:800;color:#5a6875;cursor:pointer;line-height:1}
.ts-navbtn:hover{border-color:#9ed4b5;background:#eef9f1}
.ts-today{box-shadow:inset 0 0 0 2px #008F4C}
.ts-name{text-align:left!important;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;height:36px}
.ts-namemain{text-decoration:underline;text-decoration-style:dotted;text-underline-offset:2px}
.ts-tbl tbody td{height:36px;box-sizing:border-box}
.ts-sum{font-size:11.5px;color:#41506b;background:#f7f9f8}
.ts-sum.ts-warn{color:#c0392b;font-weight:800}
.ws-qpopov{position:fixed;inset:0;background:rgba(15,23,20,.45);display:flex;align-items:center;justify-content:center;z-index:500;opacity:0;transition:opacity .2s ease;padding:20px}
.ws-qpopov.in{opacity:1}
.ws-qpopbox{position:relative;background:#fff;border-radius:14px;max-width:980px;width:100%;max-height:90vh;overflow:auto;padding:48px 28px 26px;transform:scale(.92);opacity:0;transition:transform .22s cubic-bezier(.34,1.56,.64,1),opacity .18s ease;box-shadow:0 12px 40px rgba(0,0,0,.25)}
.ws-qpopov.in .ws-qpopbox{transform:scale(1);opacity:1}
.ws-qpopclose{position:absolute;top:14px;right:14px;width:26px;height:26px;border-radius:50%;border:none;background:#c0392b;color:#fff;font-size:12.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.18)}
.ws-qpopclose:hover{background:#a23227}
.ws-qdochd{display:grid;grid-template-columns:1fr auto 1fr;align-items:start;margin-bottom:6px}
.ws-qdoctitle{text-align:center;font-weight:800;font-size:14px;color:#1f2a26;padding-top:2px}
.ws-qsummary{font-size:12px;font-weight:700;color:#5a6875;text-align:center;background:#f7f9f8;border-radius:7px;padding:8px 10px;margin-bottom:12px}
.ws-qmodetabs{display:flex;gap:8px;margin-bottom:14px}
.ws-qmodetab{padding:7px 18px;border-radius:8px;border:1px solid #d9e0dc;background:#fff;font-size:12.5px;font-weight:700;color:#5a6875;cursor:pointer}
.ws-qmodetab:hover{border-color:#9ed4b5}
.ws-qmodetab.active{background:#1b6b43;border-color:#1b6b43;color:#fff}
.ws-qstats-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.ws-qstat{background:#f7f9f8;border:1px solid #e3e8e5;border-radius:8px;padding:10px 12px;text-align:center}
.ws-qstat span{display:block;font-size:10.5px;color:#5a6875;font-weight:700;text-transform:uppercase;letter-spacing:.3px}
.ws-qstat b{display:block;font-size:18px;color:#1b6b43;margin-top:2px;font-weight:800}
.ws-qstat.warn b{color:#c0392b}
/* mark / view popups (inline styles in mockup) */
.popov{position:fixed;inset:0;background:rgba(10,30,18,.42);display:flex;align-items:center;justify-content:center;padding:24px}
.popbox{background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:22px 26px;min-width:280px;text-align:center}
.popmsg{font-weight:700;font-size:13.5px;color:#33413b}
.popdetail{font-size:12.5px;color:#5a6875;margin-bottom:16px}
.poplocknote{font-size:11.5px;color:#8a94a0;margin-bottom:12px}
.popbtns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
/* confirm / prompt modals (match mockup wsConfirm / wsPrompt) */
.mov{position:fixed;inset:0;background:rgba(10,30,18,.42);display:flex;align-items:center;justify-content:center;z-index:600;padding:24px}
.cfbox,.pmbox{background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:22px 26px;min-width:280px;text-align:center}
.pmbox{min-width:320px}
.cfmsg,.pmmsg{font-weight:700;font-size:13.5px;color:#33413b;margin-bottom:16px}
.pmmsg{margin-bottom:12px}
.pminput{width:100%;box-sizing:border-box;border:1px solid #d6ddd9;border-radius:7px;padding:8px 10px;font:inherit;margin-bottom:14px}
.cfbtns{display:flex;gap:10px;justify-content:center}
/* toast */
.toast{position:fixed;bottom:20px;left:50%;background:#0f3d23;color:#fff;padding:10px 16px;border-radius:8px;font-size:12.5px;font-weight:600;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;transform:translateX(-50%) translateY(20px);z-index:800;box-shadow:0 8px 24px rgba(0,0,0,.25)}
.toast.on{opacity:1;transform:translateX(-50%) translateY(0)}
.ws-qpopclose{width:24px;height:24px;padding:0;color:transparent;font-size:0;line-height:0;display:grid;place-items:center}
.ws-qpopclose::before{content:"";width:10px;height:10px;grid-area:1/1;transform:translateY(3px);background:linear-gradient(45deg,transparent 42%,#fff 42% 58%,transparent 58%),linear-gradient(-45deg,transparent 42%,#fff 42% 58%,transparent 58%)}
</style>
