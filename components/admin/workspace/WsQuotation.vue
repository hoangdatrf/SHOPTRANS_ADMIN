<template>
  <div class="ws-quote-root">
    <div class="ws-qmodetabs">
      <button class="ws-qmodetab" :class="{ active: mode === 'auto' }" type="button" @click="switchMode('auto')">AutoCal</button>
      <button class="ws-qmodetab" :class="{ active: mode === 'manu' }" type="button" @click="switchMode('manu')">ManuCal</button>
    </div>
    <div class="ws-qsection">
      <div class="ws-qcard ws-qoptbar">
        <div class="ws-qfbar">
          <label class="ws-qf-wide">Country
            <select v-model="opt.country">
              <option value="">—</option>
              <option v-for="c in COUNTRIES" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>
          <label>Term
            <select v-model="opt.term">
              <option value="">—</option>
              <option v-for="t in TERMS" :key="t" :value="t">{{ t }}</option>
            </select>
          </label>
          <label>Type
            <select v-model="opt.mode" @change="onOptModeChange">
              <option value="">—</option>
              <option v-for="m in ['FCL', 'LCL', 'AIR']" :key="m" :value="m">{{ m }}</option>
            </select>
          </label>
          <label>ContType
            <select v-model="opt.contType" :disabled="opt.mode !== 'FCL'">
              <option v-for="o in CT_OPTS" :key="o.v" :value="o.v">{{ o.t }}</option>
            </select>
          </label>
          <label>Cur.
            <select v-model="opt.curCommon">
              <option value="">—</option>
              <option v-for="c in CUR_PRESETS" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>
          <label>Lang
            <select v-model="opt.lang">
              <option value="">—</option>
              <option value="EN">ENG</option>
              <option value="CN">CHI</option>
            </select>
          </label>
          <label>Validity
            <input type="date" v-model="opt.validity" />
          </label>
          <div class="ws-qfbar-actions">
            <button class="ws-btn" type="button" @click="addQuote">Add+</button>
          </div>
        </div>
      </div>
      <div class="ws-qtplwrap">
        <div v-for="g in TPL_GROUPS" :key="g.mode + g.lang" class="ws-qtplgroup">
          <div class="ws-qtplhead">{{ g.label }}</div>
          <div class="ws-qtpltags">
            <span
              v-for="tag in tplTags(g)"
              :key="tag.term + '|' + tag.contType"
              class="ws-qtpltag"
              :class="['ws-qtpltag-' + tag.term.toLowerCase(), { 'ws-qtpltag-filled': !!tag.existing, 'ws-qtpltag-active': tag.isActive }]"
              :title="tag.existing ? 'Open existing quotation' : undefined"
              @click="onTagClick(g, tag)"
            >
              <b>{{ tag.term }}</b>
              <span v-if="tag.ctLabel">{{ tag.ctLabel }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="popupItem" class="ws-qpopov" :class="{ in: popupIn }" @click.self="closePopup">
      <div class="ws-qpopbox">
        <button class="ws-qpopclose" type="button" title="Close" aria-label="Close" @click="closePopup">✕</button>
        <div class="ws-qcard">
          <div class="ws-qfromto">
            <label>From
              <select v-model="popupItem.fromCompany" @input="onLockedFieldInput">
                <option v-for="c in FROM_COMPANIES" :key="c" :value="c">{{ c }}</option>
              </select>
            </label>
            <label>To
              <input list="wsQClientDL" v-model="popupItem.toClient" placeholder="Client full name" @input="onLockedFieldInput" />
              <datalist id="wsQClientDL">
                <option v-for="n in clientNames" :key="n" :value="n"></option>
              </datalist>
            </label>
          </div>
          <div class="ws-qdochd">
            <span></span>
            <span class="ws-qdoctitle">{{ popupItem.mode || '' }} QUOTATION</span>
            <div class="ws-qdocmeta">
              <div>TERM: {{ popupItem.term || '—' }}</div>
              <div>QuoteNo#: {{ popupItem.quoteNo || '—' }}</div>
              <div>GSD: Rul</div>
            </div>
          </div>
          <div class="ws-qsummary">{{ popupItem.country || '' }} · {{ popupItem.contType ? ('ContType ' + popupItem.contType) : '' }} · {{ popupItem.lang === 'CN' ? 'CHI' : 'ENG' }} · {{ popupItem.curCommon || 'USD' }} · Valid: {{ popupItem.validity || '—' }}</div>

          <template v-if="mode === 'manu'">
            <div v-if="popupLocked" class="ws-qmanuview">
              <template v-if="popupItem.manualContent">{{ popupItem.manualContent }}</template>
              <span v-else style="color:#8a94a0">No content yet.</span>
            </div>
            <textarea v-else class="ws-qmanutxt" v-model="popupItem.manualContent" placeholder="Type the quotation content here..."></textarea>
          </template>
          <template v-else>
            <div v-if="popupLocked" class="ws-qgrid3ro">
              <template v-for="(p, pi) in lockedVolParts(popupItem)" :key="pi"><template v-if="pi > 0"> · </template>{{ p.label }}: <b>{{ p.value }}</b></template>
            </div>
            <div v-else class="ws-qgrid3">
              <template v-if="popupItem.mode === 'FCL'">
                <label v-for="ty in typesOf(popupItem)" :key="ty">Vol/{{ ty }}
                  <input :value="(popupItem.volByType || {})[ty] || ''" @input="setVolByType(popupItem, ty, ($event.target as HTMLInputElement).value)" />
                </label>
                <label>Vol/BL <input v-model="popupItem.volBl" /></label>
              </template>
              <template v-else-if="popupItem.mode === 'LCL'">
                <label>Mea. <input v-model="popupItem.mea" /></label>
                <label>GW/Ton <input v-model="popupItem.gwTon" /></label>
                <label>Vol/BL <input v-model="popupItem.volBl" /></label>
              </template>
              <template v-else-if="popupItem.mode === 'AIR'">
                <label>Mea. <input v-model="popupItem.mea" /></label>
                <label>GW/kgs <input v-model="popupItem.gwKg" /></label>
                <label>Vol/BL <input v-model="popupItem.volBl" /></label>
              </template>
            </div>
            <div class="ws-qtblwrap">
              <table class="ws-tbl ws-qtbl2">
                <thead>
                  <tr>
                    <th style="width:56px">Order</th>
                    <th>ChargeName</th>
                    <th v-for="u in chargeUnits(popupItem)" :key="u.key" style="width:90px">{{ u.label }}</th>
                    <th style="width:90px">Rate/BL</th>
                    <th style="width:70px">CUR</th>
                    <th style="width:100px">TotalRate</th>
                    <th v-if="!popupLocked" style="width:40px"></th>
                  </tr>
                </thead>
                <tbody class="ws-qlines">
                  <tr v-if="!(popupItem.lines || []).length">
                    <td :colspan="6 + chargeUnits(popupItem).length" style="text-align:center;color:#8a94a0;padding:12px">No charge lines yet.</td>
                  </tr>
                  <tr v-for="(line, li) in popupItem.lines" :key="li">
                    <td style="text-align:center">{{ li + 1 }}</td>
                    <td>
                      <span v-if="popupLocked">{{ line.name || '' }}</span>
                      <input v-else class="ws-qcin" v-model="line.name" />
                    </td>
                    <td v-for="u in chargeUnits(popupItem)" :key="u.key">
                      <span v-if="popupLocked">{{ (line.rateByType || {})[u.key] || '0.00' }}</span>
                      <input v-else class="ws-qcin" :value="(line.rateByType || {})[u.key] || ''" placeholder="0.00" @input="setLineRate(line, u.key, ($event.target as HTMLInputElement).value)" />
                    </td>
                    <td>
                      <span v-if="popupLocked">{{ line.rateBl || '0.00' }}</span>
                      <input v-else class="ws-qcin" v-model="line.rateBl" placeholder="0.00" />
                    </td>
                    <td>{{ popupItem.curCommon || 'USD' }}</td>
                    <td class="ws-qtotal">{{ fmtNum(qTotal(line, popupItem)) }}</td>
                    <td v-if="!popupLocked" style="text-align:center">
                      <button class="ws-icobtn" type="button" style="color:#c0392b" @click="removeLine(popupItem, li)">✕</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="!popupLocked" class="ws-toolbar" style="justify-content:flex-start">
              <button class="ws-btn grey ws-qlineadd" type="button" @click="addLine(popupItem)">Line+</button>
            </div>
          </template>

          <div class="ws-qterms">
            <label>Terms</label>
            <textarea class="ws-qtermstxt" v-model="popupItem.terms" :disabled="popupLocked"></textarea>
          </div>
          <div class="ws-qsig">
            <div class="ws-qsigblank"></div>
            <span class="ws-qsiglabel">Prepared by</span>
            <span class="ws-qsigdate">Date: {{ createdStr(popupItem) }}</span>
          </div>
          <div class="ws-toolbar" style="justify-content:flex-end">
            <button class="ws-btn grey ws-qpdf" type="button" style="margin-right:auto" @click="exportQuotePdf(popupItem)">Export PDF</button>
            <button class="ws-btn red ws-qremove" type="button" :disabled="!popupLocked" @click="askRemove">Remove</button>
            <button class="ws-btn orange ws-qedit" type="button" :disabled="!popupLocked" @click="editQuote">Edit</button>
            <button class="ws-btn ws-qsave" type="button" :disabled="popupLocked" @click="saveQuote">Save</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="confirmState.open" class="wsq-modalov">
      <div class="wsq-confirmbox">
        <div class="wsq-cfmsg">{{ confirmState.msg }}</div>
        <div class="wsq-cfbtns">
          <button class="ws-btn red" type="button" @click="confirmYes">YES</button>
          <button class="ws-btn grey" type="button" @click="confirmNo">NO</button>
        </div>
      </div>
    </div>

    <div class="wsq-toast" :class="{ on: toastState.on }">{{ toastState.msg }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'

const props = defineProps<{ request: (url: string, options?: any) => Promise<any> }>()

interface QuoteLine { name: string; rateByType: Record<string, string>; rateBl: string }
interface Quote {
  id: string; country: string; term: string; mode: string; contType: string; lang: string
  curCommon: string; validity: string; volBl?: string; terms?: string; fromCompany?: string
  toClient?: string; createdAt?: string; quoteNo?: string; lines?: QuoteLine[]
  volByType?: Record<string, string>; mea?: string; gwTon?: string; gwKg?: string
  manualContent?: string
}
interface QuoteStore { countries: string[]; quotes: Quote[]; quoteSeq?: Record<string, number> }
interface WsQuoteDoc { auto: QuoteStore; manu: QuoteStore }

const PAGE_KEY = 'quote'
const CTYPES = ['20', '40']
const CT_OPTS = [{ v: '', t: '—' }, { v: '20', t: '20' }, { v: '40', t: '40' }, { v: '20/40', t: '20+40' }]
const TERMS = ['EXW', 'FCA', 'DAP', 'DUP']
const COUNTRIES = ['CHINA', 'JAPAN', 'VIETNAM', 'INDONESIA', 'INDIA', 'THAILAND', 'SOUTH KOREA', 'MALAYSIA', 'BANGLADESH', 'USA', 'MEXICO', 'TAIWAN', 'HONG KONG']
const CUR_PRESETS = ['USD', 'CNY', 'JPY', 'VND', 'INR', 'IDR', 'THB', 'KRW', 'MYR', 'BDT', 'MXP', 'TWD', 'HKD']
const TPL_GROUPS = [
  { mode: 'FCL', lang: 'EN', label: 'FCL · ENG' }, { mode: 'FCL', lang: 'CN', label: 'FCL · CHI' },
  { mode: 'LCL', lang: 'EN', label: 'LCL · ENG' }, { mode: 'LCL', lang: 'CN', label: 'LCL · CHI' },
  { mode: 'AIR', lang: 'EN', label: 'AIR · ENG' }, { mode: 'AIR', lang: 'CN', label: 'AIR · CHI' }
]
const FROM_COMPANIES = ['TX LOGISTICS VIETNAM CO., LTD', 'SHOPTRANS VIETNAM CO., LTD']

const defaultStore = (): QuoteStore => ({ countries: ['VIETNAM', 'THAILAND', 'HONG KONG'], quotes: [] })
const normalizeStore = (raw: any): QuoteStore => {
  const s: QuoteStore = { countries: Array.isArray(raw?.countries) ? raw.countries : ['VIETNAM', 'THAILAND', 'HONG KONG'], quotes: Array.isArray(raw?.quotes) ? raw.quotes : [] }
  if (raw?.quoteSeq) s.quoteSeq = raw.quoteSeq
  s.quotes.forEach(q => {
    q.lines = Array.isArray(q.lines) ? q.lines : []
    q.lines.forEach(l => { l.rateByType = l.rateByType || {} })
    q.volByType = q.volByType || {}
  })
  return s
}

const doc = reactive<WsQuoteDoc>({ auto: defaultStore(), manu: defaultStore() })
const mode = ref<'auto' | 'manu'>('auto')
const opt = reactive({ country: '', term: '', mode: '', contType: '', lang: '', curCommon: '', validity: '' })
const editId = ref<string | null>(null)
const popupId = ref<string | null>(null)
const popupIn = ref(false)
const working = reactive<Record<string, Quote>>({})
const clientNames = ref<string[]>([])

const store = computed<QuoteStore>(() => (mode.value === 'manu' ? doc.manu : doc.auto))

const list = computed<Quote[]>(() => {
  const l = store.value.quotes.map(x => (editId.value && x.id === editId.value && working[x.id]) ? working[x.id]! : x)
  if (editId.value && working[editId.value] && !l.some(x => x.id === editId.value)) return [working[editId.value]!, ...l]
  return l
})
const popupItem = computed<Quote | null>(() => (popupId.value ? list.value.filter(x => x.id === popupId.value)[0] || null : null))
const popupLocked = computed(() => !!popupItem.value && popupItem.value.id !== editId.value)

/* ---------- persistence ---------- */
let saveTimer: ReturnType<typeof setTimeout> | null = null
const saveNow = async () => {
  try {
    await props.request(`/workspace/${PAGE_KEY}`, { method: 'PUT', body: JSON.parse(JSON.stringify(doc)) })
  } catch (e) { /* keep silent like localStorage wsSave */ }
}
const scheduleSave = () => {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(saveNow, 400)
}

const seedCountries = (s: QuoteStore): boolean => {
  let chg = false
  COUNTRIES.forEach(c => { if (s.countries.indexOf(c) < 0) { s.countries.push(c); chg = true } })
  return chg
}

onMounted(async () => {
  try {
    const res = await props.request(`/workspace/${PAGE_KEY}`)
    const d = res?.data
    if (d) {
      doc.auto = normalizeStore(d.auto)
      doc.manu = normalizeStore(d.manu)
    }
  } catch (e) { /* start with defaults */ }
  let chg = seedCountries(doc.auto)
  chg = seedCountries(doc.manu) || chg
  if (chg) scheduleSave()
  // client names for the "To" datalist (same source as mockup)
  try {
    const raw = JSON.parse(localStorage.getItem('shoptrans_customers_v1') || 'null')
    const rs = (raw && raw.rows) || raw || []
    clientNames.value = rs.map((r: any) => r.namecode || r.company || '').filter(Boolean)
  } catch (e) { clientNames.value = [] }
  loadJsPdf()
})

/* ---------- helpers (ported from mockup) ---------- */
function wsUid () { return Math.random().toString(36).slice(2, 10) }
function pad2 (n: number) { return (n < 10 ? '0' : '') + n }
function typesOf (item: Quote) { const s2 = item.contType || ''; return s2 ? s2.split('/').filter(x => CTYPES.indexOf(x) >= 0) : [] }
function chargeUnits (item: Quote) {
  if (item.mode === 'FCL') return typesOf(item).map(ty => ({ key: ty, label: 'Rate/' + ty }))
  if (item.mode === 'LCL') return [{ key: 'WM', label: 'Rate/WM' }]
  if (item.mode === 'AIR') return [{ key: 'KG', label: 'Rate/Kg' }]
  return [] as { key: string; label: string }[]
}
function effVol (item: Quote, unitKey: string) {
  if (item.mode === 'FCL') return parseFloat((item.volByType || {})[unitKey] || '') || 0
  if (item.mode === 'LCL') return Math.max(parseFloat(item.mea || '') || 0, parseFloat(item.gwTon || '') || 0)
  if (item.mode === 'AIR') return Math.max((parseFloat(item.mea || '') || 0) * 167, parseFloat(item.gwKg || '') || 0)
  return 0
}
function qTotal (l: QuoteLine, item: Quote) {
  const units = chargeUnits(item); let t = 0
  units.forEach(u => { const rt = parseFloat(String((l.rateByType || {})[u.key] || '').replace(/,/g, '')) || 0; t += rt * effVol(item, u.key) })
  const rb = parseFloat(String(l.rateBl || '').replace(/,/g, '')) || 0; const vb = parseFloat(item.volBl || '') || 0; t += rb * vb
  return t
}
function fmtNum (n: number) { return isFinite(n) ? (Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00' }
function assignQuoteNo (item: Quote) {
  if (item.quoteNo) return item.quoteNo
  const d = new Date(); const ymd = d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate())
  const s = store.value
  s.quoteSeq = s.quoteSeq || {}
  const next = (s.quoteSeq[ymd] || 0) + 1
  s.quoteSeq[ymd] = next
  item.quoteNo = ymd + '-' + pad2(next)
  scheduleSave()
  return item.quoteNo
}
function createdStr (item: Quote) {
  const createdDt = item.createdAt ? new Date(item.createdAt) : null
  return (createdDt && !isNaN(createdDt.getTime())) ? (pad2(createdDt.getDate()) + '/' + pad2(createdDt.getMonth() + 1) + '/' + createdDt.getFullYear() + ' ' + pad2(createdDt.getHours()) + ':' + pad2(createdDt.getMinutes())) : '—'
}
function lockedVolParts (item: Quote) {
  if (item.mode === 'FCL') {
    const parts = typesOf(item).map(ty => ({ label: 'Vol/' + ty, value: (item.volByType || {})[ty] || '0' }))
    parts.push({ label: 'Vol/BL', value: item.volBl || '1' })
    return parts
  }
  if (item.mode === 'LCL') return [{ label: 'Mea.', value: item.mea || '0' }, { label: 'GW/Ton', value: item.gwTon || '0' }, { label: 'Vol/BL', value: item.volBl || '1' }]
  if (item.mode === 'AIR') return [{ label: 'Mea.', value: item.mea || '0' }, { label: 'GW/kgs', value: item.gwKg || '0' }, { label: 'Vol/BL', value: item.volBl || '1' }]
  return [] as { label: string; value: string }[]
}
function findSavedQuote (country: string, qmode: string, term: string, contType: string, lang: string) {
  return store.value.quotes.filter(q => q.country === country && q.mode === qmode && q.term === term && (q.contType || '') === (contType || '') && q.lang === lang)[0] || null
}

/* ---------- toast & confirm ---------- */
const toastState = reactive({ msg: '', on: false })
let toastTimer: ReturnType<typeof setTimeout> | null = null
function toast (m: string) {
  toastState.msg = m
  toastState.on = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastState.on = false }, 1900)
}
const confirmState = reactive<{ open: boolean; msg: string; onYes: (() => void) | null }>({ open: false, msg: '', onYes: null })
function wsConfirm (msg: string, onYes: () => void) { confirmState.msg = msg; confirmState.onYes = onYes; confirmState.open = true }
function confirmYes () { confirmState.open = false; if (confirmState.onYes) confirmState.onYes(); confirmState.onYes = null }
function confirmNo () { confirmState.open = false; confirmState.onYes = null }

/* ---------- template tags ---------- */
interface TplGroup { mode: string; lang: string; label: string }
interface TplTag { term: string; contType: string; ctLabel: string; existing: Quote | null; isActive: boolean }
function tplTags (g: TplGroup): TplTag[] {
  const combos: { term: string; contType: string }[] = []
  if (g.mode === 'FCL') { TERMS.forEach(t => { ['20', '40', '20/40'].forEach(ct => { combos.push({ term: t, contType: ct }) }) }) } else { TERMS.forEach(t => { combos.push({ term: t, contType: '' }) }) }
  const popup = popupItem.value
  return combos.map(c => {
    const ctLabel = c.contType ? (c.contType === '20/40' ? "20'+40'" : (c.contType + "'")) : ''
    const existing = opt.country ? findSavedQuote(opt.country, g.mode, c.term, c.contType, g.lang) : null
    const isActive = !!popup && popup.country === opt.country && popup.mode === g.mode && popup.term === c.term && (popup.contType || '') === (c.contType || '') && popup.lang === g.lang
    return { term: c.term, contType: c.contType, ctLabel, existing, isActive }
  })
}

/* ---------- interactions ---------- */
function switchMode (m: 'auto' | 'manu') {
  if (m === mode.value) return
  mode.value = m
  popupId.value = null
  editId.value = null
  if (seedCountries(store.value)) scheduleSave()
}
function onOptModeChange () { if (opt.mode !== 'FCL') opt.contType = '' }
function openPopup (animate: boolean) {
  if (animate) {
    popupIn.value = false
    nextTick(() => { requestAnimationFrame(() => { popupIn.value = true }) })
  } else {
    popupIn.value = true
  }
}
function closePopup () {
  popupIn.value = false
  setTimeout(() => { popupId.value = null }, 220)
}
function onTagClick (g: TplGroup, tag: TplTag) {
  if (!opt.country) { toast('Select a Country first'); return }
  if (tag.existing) { popupId.value = tag.existing.id; openPopup(true); return }
  const id = wsUid()
  const base: Quote = { id, country: opt.country, term: tag.term, mode: g.mode, contType: tag.contType, lang: g.lang, curCommon: opt.curCommon || 'USD', validity: opt.validity || '', volBl: '1', terms: '', fromCompany: FROM_COMPANIES[0], toClient: '', createdAt: new Date().toISOString(), lines: [{ name: '', rateByType: {}, rateBl: '' }] }
  if (mode.value === 'manu') { base.manualContent = '' } else if (g.mode === 'FCL') { base.volByType = {} } else if (g.mode === 'LCL') { base.mea = ''; base.gwTon = '' } else if (g.mode === 'AIR') { base.mea = ''; base.gwKg = '' }
  working[id] = base
  editId.value = id
  popupId.value = id
  openPopup(true)
}
function addQuote () {
  if (!opt.country || !opt.mode) { toast('Country and Type are required'); return }
  if (opt.mode === 'FCL' && !opt.contType) { toast('ContType is required for FCL'); return }
  const id = wsUid()
  const base: Quote = { id, country: opt.country, term: opt.term || 'EXW', mode: opt.mode, contType: opt.mode === 'FCL' ? (opt.contType || '') : '', lang: opt.lang || 'EN', curCommon: opt.curCommon || 'USD', validity: opt.validity || '', volBl: '1', terms: '', fromCompany: FROM_COMPANIES[0], toClient: '', createdAt: new Date().toISOString(), lines: [{ name: '', rateByType: {}, rateBl: '' }] }
  if (mode.value === 'manu') { base.manualContent = '' } else if (opt.mode === 'FCL') { base.volByType = {} } else if (opt.mode === 'LCL') { base.mea = ''; base.gwTon = '' } else if (opt.mode === 'AIR') { base.mea = ''; base.gwKg = '' }
  working[id] = base
  editId.value = id
  popupId.value = id
  openPopup(false)
}
function setVolByType (item: Quote, ty: string, v: string) {
  item.volByType = item.volByType || {}
  item.volByType[ty] = v
}
function setLineRate (line: QuoteLine, ty: string, v: string) {
  line.rateByType = line.rateByType || {}
  line.rateByType[ty] = v
}
function addLine (item: Quote) {
  item.lines = item.lines || []
  item.lines.push({ name: '', rateByType: {}, rateBl: '' })
}
function removeLine (item: Quote, i: number) {
  if (!item.lines) return
  item.lines.splice(i, 1)
  if (!item.lines.length) item.lines.push({ name: '', rateByType: {}, rateBl: '' })
}
function onLockedFieldInput () { if (popupLocked.value) scheduleSave() }
function editQuote () {
  const item = popupItem.value
  if (!item) return
  working[item.id] = JSON.parse(JSON.stringify(item))
  editId.value = item.id
}
function askRemove () {
  const item = popupItem.value
  if (!item) return
  const id = item.id
  wsConfirm('Are you sure to remove?', () => {
    store.value.quotes = store.value.quotes.filter(x => x.id !== id)
    scheduleSave()
    popupId.value = null
    toast('Removed')
  })
}
function saveQuote () {
  const data = popupItem.value
  if (!data) return
  if (mode.value === 'manu') {
    if (!String(data.manualContent || '').trim()) { toast('Please enter quotation content'); return }
  } else {
    if (!(data.lines || []).some(l => String(l.name || '').trim())) { toast('Add at least one charge line'); return }
    data.lines = (data.lines || []).filter(l => String(l.name || '').trim())
  }
  const id = data.id
  store.value.quotes = store.value.quotes.filter(x => x.id !== id)
  store.value.quotes.push(data)
  scheduleSave()
  delete working[id]
  editId.value = null
  popupId.value = id
  toast('Quotation saved')
}

/* ---------- jsPDF loading (same CDN chain as mockup) ---------- */
function loadJsPdf () {
  if (typeof window === 'undefined') return
  if ((window as any).jspdf && (window as any).jspdf.jsPDF) return
  const cdns = [
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
    'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js'
  ]
  let j = 0
  const tryLoadPdf = () => {
    if (j >= cdns.length) return
    const s = document.createElement('script')
    s.src = cdns[j]!
    s.onerror = () => { j++; tryLoadPdf() }
    document.head.appendChild(s)
  }
  tryLoadPdf()
}

/* ---------- PDF export (ported from mockup) ---------- */
function exportQuotePdf (src: Quote | null) {
  if (!src) { toast('Select or add a quotation first'); return }
  if (!((window as any).jspdf && (window as any).jspdf.jsPDF)) { toast('PDF library still loading, try again in a moment'); return }
  assignQuoteNo(src)
  const docPdf = new (window as any).jspdf.jsPDF({ unit: 'mm', format: 'a4' })
  const pw = docPdf.internal.pageSize.getWidth(); const ph = docPdf.internal.pageSize.getHeight()
  const margin = 18; let y = 20
  function ensureSpace (need: number) { if (y + need > ph - 16) { docPdf.addPage(); y = 20 } }
  const colX = pw / 2 + 4
  docPdf.setFont('helvetica', 'bold'); docPdf.setFontSize(8.5); docPdf.setTextColor(90, 104, 117)
  docPdf.text('FROM', margin, y)
  docPdf.text('TO', colX, y)
  y += 5
  docPdf.setFont('helvetica', 'bold'); docPdf.setFontSize(10.5); docPdf.setTextColor(31, 42, 38)
  docPdf.text(src.fromCompany || FROM_COMPANIES[0]!, margin, y)
  docPdf.text(src.toClient || '—', colX, y)
  y += 8
  docPdf.setDrawColor(207, 216, 210); docPdf.line(margin, y, pw - margin, y); y += 9
  docPdf.setFont('helvetica', 'bold'); docPdf.setFontSize(14); docPdf.setTextColor(31, 42, 38)
  docPdf.text((src.mode || '') + ' QUOTATION', pw / 2, y, { align: 'center' })
  docPdf.setFont('helvetica', 'bold'); docPdf.setFontSize(9.5); docPdf.setTextColor(90, 104, 117)
  docPdf.text('TERM: ' + (src.term || ''), pw - margin, y, { align: 'right' })
  docPdf.text('QuoteNo#: ' + (src.quoteNo || '—'), pw - margin, y + 4.2, { align: 'right' })
  docPdf.text('GSD: Rul', pw - margin, y + 8.4, { align: 'right' })
  y += 13
  docPdf.setFont('helvetica', 'normal'); docPdf.setFontSize(10); docPdf.setTextColor(90, 104, 117)
  const metaParts = [src.country || '']; if (src.contType) metaParts.push('ContType ' + src.contType)
  docPdf.text(metaParts.join(' · '), pw / 2, y, { align: 'center' })
  y += 6
  const tableW = pw - 2 * margin
  if (mode.value === 'manu') {
    y += 4
    docPdf.setTextColor(31, 42, 38); docPdf.setFontSize(10); docPdf.setFont('helvetica', 'normal')
    const contentLines = docPdf.splitTextToSize(String(src.manualContent || '—'), tableW)
    contentLines.forEach((line: string) => { ensureSpace(6); docPdf.text(line, margin, y); y += 5.6 })
  } else {
    const units = chargeUnits(src)
    let volParts: string[]
    if (src.mode === 'FCL') { const types = typesOf(src); volParts = types.map(ty => 'Vol/' + ty + ': ' + ((src.volByType && src.volByType[ty]) || '0')); volParts.push('Vol/BL: ' + (src.volBl || '1')) } else if (src.mode === 'LCL') { volParts = ['Mea.: ' + (src.mea || '0'), 'GW/Ton: ' + (src.gwTon || '0'), 'Vol/BL: ' + (src.volBl || '1')] } else if (src.mode === 'AIR') { volParts = ['Mea.: ' + (src.mea || '0'), 'GW/kgs: ' + (src.gwKg || '0'), 'Vol/BL: ' + (src.volBl || '1')] } else { volParts = [] }
    docPdf.text(volParts.join(' · '), pw / 2, y, { align: 'center' })
    y += 10
    docPdf.setTextColor(31, 42, 38)
    const cols: any[] = [{ label: 'Order', w: 14, align: 'center' }, { label: 'ChargeName', w: 0, align: 'left' }]
    units.forEach(u => { cols.push({ label: u.label, w: 20, align: 'right', key: u.key }) })
    cols.push({ label: 'Rate/BL', w: 20, align: 'right' }); cols.push({ label: 'CUR.', w: 16, align: 'center' }); cols.push({ label: 'TotalRate', w: 24, align: 'right' })
    let fixedW = 0; cols.forEach(c => { if (c.w) fixedW += c.w })
    cols[1].w = tableW - fixedW
    const rowH = 8; docPdf.setFontSize(9)
    function drawRow (vals: any[], opts?: any) {
      opts = opts || {}
      if (opts.headerBg) { docPdf.setFillColor(240, 243, 238); docPdf.rect(margin, y, tableW, rowH, 'F') }
      docPdf.setDrawColor(207, 216, 210); docPdf.setFont('helvetica', opts.bold ? 'bold' : 'normal')
      let x = margin
      cols.forEach((c, i) => {
        docPdf.rect(x, y, c.w, rowH)
        const txt = String(vals[i] == null ? '' : vals[i]); let tx
        if (c.align === 'right') { tx = x + c.w - 3 } else if (c.align === 'center') { tx = x + c.w / 2 } else { tx = x + 3 }
        docPdf.text(txt, tx, y + rowH / 2 + 1.2, { align: c.align })
        x += c.w
      })
      y += rowH
    }
    drawRow(cols.map(c => c.label), { headerBg: true, bold: true });
    (src.lines || []).forEach((l, i) => {
      ensureSpace(rowH)
      const vals: any[] = [i + 1, l.name || '']
      units.forEach(u => { vals.push(fmtNum(parseFloat(String((l.rateByType || {})[u.key] || '').replace(/,/g, '')) || 0)) })
      vals.push(fmtNum(parseFloat(String(l.rateBl || '').replace(/,/g, '')) || 0))
      vals.push(src.curCommon || 'USD')
      vals.push(fmtNum(qTotal(l, src)))
      drawRow(vals)
    })
  }
  y += 8; ensureSpace(14)
  docPdf.setFont('helvetica', 'bold'); docPdf.setFontSize(10); docPdf.setTextColor(31, 42, 38)
  docPdf.text('Valid until: ' + (src.validity || '—'), margin, y)
  if (src.terms) {
    const termItems = String(src.terms).split('\n').map(t => t.trim()).filter(Boolean)
    if (termItems.length) {
      y += 8; ensureSpace(6 + termItems.length * 4.5)
      docPdf.setFont('helvetica', 'bold'); docPdf.setFontSize(9.5); docPdf.setTextColor(31, 42, 38)
      docPdf.text('Terms', margin, y)
      y += 5.5
      docPdf.setFont('helvetica', 'normal'); docPdf.setFontSize(9); docPdf.setTextColor(90, 104, 117)
      termItems.forEach(t => {
        const wrapped = docPdf.splitTextToSize('• ' + t, tableW - 4)
        ensureSpace(wrapped.length * 4.2)
        docPdf.text(wrapped, margin + 2, y)
        y += wrapped.length * 4.2
      })
    }
  }
  ensureSpace(30); y += 18
  const createdStrPdf = createdStr(src)
  const sigW = 60
  docPdf.setDrawColor(140, 148, 144)
  docPdf.line(margin, y, margin + sigW, y)
  docPdf.setFont('helvetica', 'normal'); docPdf.setFontSize(8.5); docPdf.setTextColor(90, 104, 117)
  docPdf.text('Prepared by', margin + sigW / 2, y + 5, { align: 'center' })
  docPdf.setFontSize(9); docPdf.text('Date: ' + createdStrPdf, pw - margin, y, { align: 'right' })
  const blob = docPdf.output('blob')
  const url = URL.createObjectURL(blob)
  const previewWin = window.open(url, '_blank')
  if (!previewWin) { toast('Popup blocked — please allow popups to preview the PDF') }
  setTimeout(() => { URL.revokeObjectURL(url) }, 60000)
}
</script>

<style scoped>
.ws-toolbar{display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap}
.ws-btn{border:none;border-radius:8px;padding:7px 16px;font-weight:700;font-size:12.5px;color:#fff;cursor:pointer;background:#008F4C}
.ws-btn:hover{background:#04793f}
.ws-btn.grey{background:#64748b}.ws-btn.grey:hover{background:#51606e}
.ws-btn.orange{background:#e67e22}.ws-btn.orange:hover{background:#cf6f1c}
.ws-btn.red{background:#c0392b}.ws-btn.red:hover{background:#a23227}
.ws-btn:disabled{opacity:.45;cursor:not-allowed}
.ws-tbl{width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px}
.ws-tbl th{background:#f0f3ee;font-weight:700;color:#42504b;border:1px solid #dfe5ea;padding:8px 10px;position:sticky;top:0}
.ws-tbl td{border:1px solid #e4e9ee;padding:6px 8px;vertical-align:middle;background:#fff}
.ws-tbl input,.ws-tbl select{width:100%;border:1px solid #d6ddd9;border-radius:6px;padding:5px 8px;font:inherit;box-sizing:border-box;background:#fff}
.ws-tbl input:disabled,.ws-tbl select:disabled{background:#f1f4f2;color:#6b7680;border-color:#e2e8ee;cursor:not-allowed}
.ws-icobtn{border:none;background:transparent;cursor:pointer;font-size:14px;padding:3px 6px}
.ws-qterms{display:flex;flex-direction:column;align-items:stretch;gap:6px;margin:16px 0 14px}
.ws-qterms label{flex:0 0 auto;font-size:11.5px;font-weight:700;color:#5a6875;white-space:nowrap;text-align:left}
.ws-qterms textarea{flex:0 0 auto;width:100%;box-sizing:border-box;border:1px solid #d6ddd9;border-radius:7px;padding:7px 10px;font:inherit;min-height:38px;resize:vertical;white-space:pre-wrap;overflow-wrap:break-word;line-height:1.4;text-align:left}
.ws-qterms textarea:disabled{background:#f4f6f5;color:#5a6875}
.ws-qcard{background:#fff;border:1px solid #d9e0dc;border-radius:12px;padding:18px 22px;margin:0;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.ws-qmodetabs{display:flex;gap:8px;margin-bottom:14px}
.ws-qmodetab{padding:7px 18px;border-radius:8px;border:1px solid #d9e0dc;background:#fff;font-size:12.5px;font-weight:700;color:#5a6875;cursor:pointer}
.ws-qmodetab:hover{border-color:#9ed4b5}
.ws-qmodetab.active{background:#1b6b43;border-color:#1b6b43;color:#fff}
.ws-qmanutxt{width:100%;min-height:320px;box-sizing:border-box;border:1px solid #d6ddd9;border-radius:10px;padding:14px;font:inherit;font-size:13px;line-height:1.6;resize:vertical;margin-bottom:4px}
.ws-qmanuview{min-height:320px;border:1px solid #e3e8e5;border-radius:10px;padding:14px;font-size:13px;line-height:1.6;color:#16241c;white-space:pre-wrap;margin-bottom:4px}
.ws-qtblwrap{border:1px solid #dfe5ea;border-radius:8px;overflow:hidden;margin-bottom:4px}
.ws-qtblwrap table{border:none;margin:0}
.ws-qtblwrap table th,.ws-qtblwrap table td{border-left:none;border-right:none;border-top:none}
.ws-qtblwrap table tr:last-child td{border-bottom:none}
.ws-qtblwrap table th:first-child,.ws-qtblwrap table td:first-child{border-left:none}
.ws-qgrid3{display:flex;flex-wrap:nowrap;gap:10px;margin-bottom:14px;overflow-x:auto;justify-content:flex-start}
.ws-qgrid3 label{display:flex;flex-direction:column;gap:5px;font-size:11px;font-weight:700;color:#5a6875;text-align:center;flex:0 0 96px}
.ws-qgrid3 input{width:100%;box-sizing:border-box;border:1px solid #d6ddd9;border-radius:7px;padding:6px 8px;font:inherit;text-align:center;text-align-last:center;-moz-text-align-last:center}
.ws-qgrid3 input:disabled{background:#f4f6f5;color:#5a6875;cursor:not-allowed}
.ws-qtbl2 th,.ws-qtbl2 td{text-align:center}
.ws-qcin{width:100%;box-sizing:border-box;border:1px solid #d6ddd9;border-radius:6px;padding:5px 7px;font:inherit;text-align:center}
.ws-qtotal{font-weight:800;color:#1b6b43}
.ws-qsummary{font-size:12px;font-weight:700;color:#5a6875;text-align:center;background:#f7f9f8;border-radius:7px;padding:8px 10px;margin-bottom:12px}
.ws-qfromto{display:flex;gap:20px;margin-bottom:16px;flex-wrap:wrap}
.ws-qfromto label{display:flex;flex-direction:column;gap:4px;font-size:11px;font-weight:700;color:#5a6875;flex:1 1 220px;min-width:200px}
.ws-qfromto select,.ws-qfromto input{width:100%;box-sizing:border-box;border:1px solid #d6ddd9;border-radius:7px;padding:6px 8px;font:inherit;font-size:12.5px}
.ws-qsig{margin-top:22px;padding-top:14px;border-top:1px solid #e3e8e5}
.ws-qsigblank{width:210px;height:34px;border-bottom:1px solid #8a94a0;margin-bottom:6px}
.ws-qsiglabel{display:block;font-size:11px;font-weight:700;color:#5a6875}
.ws-qsigdate{display:block;font-size:12px;color:#5a6875;font-weight:600;margin-top:3px}
.ws-qgrid3ro{text-align:left;font-size:12px;color:#5a6875;margin-bottom:12px;white-space:nowrap;overflow-x:auto}
.ws-qfbar{display:flex;align-items:flex-end;gap:10px;flex-wrap:wrap;margin-bottom:10px;justify-content:flex-start}
.ws-qfbar-actions{display:flex;gap:8px;align-items:center;flex:0 0 auto}
.ws-qoptbar{background:#f7f9f8}
.ws-qdochd{display:grid;grid-template-columns:1fr auto 1fr;align-items:start;margin-bottom:6px}
.ws-qdoctitle{text-align:center;font-weight:800;font-size:14px;color:#1f2a26;padding-top:2px}
.ws-qdocmeta{text-align:right;font-weight:700;font-size:11.5px;color:#5a6875;line-height:1.55}
.ws-qtplwrap{margin-top:18px;display:flex;flex-direction:column;gap:14px;background:#fff;border:1px solid #d9e0dc;border-radius:12px;padding:18px 22px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.ws-qtplgroup{display:flex;gap:14px;align-items:flex-start}
.ws-qtplhead{flex:0 0 82px;font-size:11px;font-weight:800;color:#5a6875;text-transform:uppercase;letter-spacing:.3px;padding-top:9px}
.ws-qtpltags{display:flex;flex-wrap:nowrap;overflow-x:auto;gap:6px;flex:1;padding-bottom:2px}
.ws-qtpltag{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-width:62px;flex:1 1 0;padding:6px 8px;border:1px solid #d9e0dc;border-radius:8px;background:#fff;cursor:pointer;text-align:center}
.ws-qtpltag:hover{filter:brightness(.97)}
.ws-qtpltag b{font-size:12px;font-weight:800}
.ws-qtpltag span{font-size:11px;color:#5a6875}
.ws-qtpltag-exw{border-color:#bcd3f7;background:#eaf1fd}
.ws-qtpltag-exw b{color:#2563eb}
.ws-qtpltag-fca{border-color:#d9c8f5;background:#f3ecfd}
.ws-qtpltag-fca b{color:#7c3aed}
.ws-qtpltag-dap{border-color:#a9dcd4;background:#e6f7f5}
.ws-qtpltag-dap b{color:#0d9488}
.ws-qtpltag-dup{border-color:#e8cb9a;background:#fdf3e3}
.ws-qtpltag-dup b{color:#b45309}
.ws-qtpltag-filled{box-shadow:0 0 0 1px currentColor inset}
.ws-qtpltag-active{box-shadow:0 0 0 3px #16241c}
.ws-qtpltag-active.ws-qtpltag-filled{box-shadow:0 0 0 1px currentColor inset,0 0 0 3px #16241c}
.ws-qtpltag-filled.ws-qtpltag-exw{background:#2563eb;border-color:#2563eb}
.ws-qtpltag-filled.ws-qtpltag-exw b,.ws-qtpltag-filled.ws-qtpltag-exw span{color:#fff}
.ws-qtpltag-filled.ws-qtpltag-fca{background:#7c3aed;border-color:#7c3aed}
.ws-qtpltag-filled.ws-qtpltag-fca b,.ws-qtpltag-filled.ws-qtpltag-fca span{color:#fff}
.ws-qtpltag-filled.ws-qtpltag-dap{background:#0d9488;border-color:#0d9488}
.ws-qtpltag-filled.ws-qtpltag-dap b,.ws-qtpltag-filled.ws-qtpltag-dap span{color:#fff}
.ws-qtpltag-filled.ws-qtpltag-dup{background:#b45309;border-color:#b45309}
.ws-qtpltag-filled.ws-qtpltag-dup b,.ws-qtpltag-filled.ws-qtpltag-dup span{color:#fff}
.ws-qpopov{position:fixed;inset:0;background:rgba(15,23,20,.45);display:flex;align-items:center;justify-content:center;z-index:500;opacity:0;transition:opacity .2s ease;padding:20px}
.ws-qpopov.in{opacity:1}
.ws-qpopbox{position:relative;background:#fff;border-radius:14px;max-width:980px;width:100%;max-height:90vh;overflow:auto;padding:48px 28px 26px;transform:scale(.92);opacity:0;transition:transform .22s cubic-bezier(.34,1.56,.64,1),opacity .18s ease;box-shadow:0 12px 40px rgba(0,0,0,.25)}
.ws-qpopov.in .ws-qpopbox{transform:scale(1);opacity:1}
.ws-qpopbox .ws-qcard{border:none;box-shadow:none;padding:0;max-width:none}
.ws-qpopclose{position:absolute;top:14px;right:14px;width:26px;height:26px;border-radius:50%;border:none;background:#c0392b;color:#fff;font-size:12.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.18)}
.ws-qpopclose:hover{background:#a23227}
.ws-qfbar label{display:flex;flex-direction:column;gap:4px;font-size:11px;font-weight:700;color:#5a6875;flex:1 1 100px;min-width:100px}
.ws-qfbar label.ws-qf-wide{flex:1.6 1 150px;min-width:150px}
.ws-qfbar select,.ws-qfbar input{width:100%;box-sizing:border-box;border:1px solid #d6ddd9;border-radius:7px;padding:6px 8px;font:inherit;font-size:12px}

/* confirm modal (mirrors mockup wsConfirm, SaveAdmin.html line 4062) */
.wsq-modalov{position:fixed;inset:0;background:rgba(10,30,18,.42);display:flex;align-items:center;justify-content:center;z-index:600;padding:24px}
.wsq-confirmbox{background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:22px 26px;min-width:280px;text-align:center}
.wsq-cfmsg{font-weight:700;font-size:13.5px;color:#33413b;margin-bottom:16px}
.wsq-cfbtns{display:flex;gap:10px;justify-content:center}

/* toast */
.wsq-toast{position:fixed;left:50%;bottom:20px;background:#0f3d23;color:#fff;border-radius:8px;padding:10px 16px;font-size:12.5px;font-weight:600;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;transform:translateX(-50%) translateY(20px);z-index:700;box-shadow:0 8px 24px rgba(0,0,0,.25)}
.wsq-toast.on{opacity:1;transform:translateX(-50%) translateY(0)}
.ws-qpopclose{width:24px;height:24px;padding:0;color:transparent;font-size:0;line-height:0;display:grid;place-items:center}
.ws-qpopclose::before{content:"";width:10px;height:10px;grid-area:1/1;transform:translateY(3px);background:linear-gradient(45deg,transparent 42%,#fff 42% 58%,transparent 58%),linear-gradient(-45deg,transparent 42%,#fff 42% 58%,transparent 58%)}
</style>
