import { ref, reactive, computed } from 'vue'

const TODAY = new Date('2026-04-29')
const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export function useFinanceTask() {

const SHIPMENTS = reactive([
  {
    ref:'TX-26-04001', bill:'BL26010001', service:'FCL', route:'HCM → LAX',
    vessel:'MAERSK ELBA', voyage:'V.0421E', eta:'2026-05-22',
    fees:{
      origin:[
        {n:'Trucking charge',u:'Container',q:1,p:2500000,who:'you'},
        {n:'Customs clearance',u:'Container',q:1,p:2000000,who:'you'},
        {n:'Lift fee (THC)',u:'Container',q:1,p:1875000,who:'you'},
        {n:'Insurance fee',u:'Container',q:1,p:1875000,who:'you'},
      ],
      freight:[{n:'Ocean freight',u:'Container',q:1,p:12500000,who:'you'}],
      destination:[
        {n:'Customs clearance',u:'Container',q:1,p:2553182,who:'them'},
        {n:'Trucking charge',u:'Container',q:1,p:2553183,who:'them'},
      ]
    },
    workflow:{ chargesIssued:'2026-04-15', chargesConfirmed:null, debitNote:null, invoice:null, payment:null },
    credits:[] as any[]
  },
  {
    ref:'TX-26-04002', bill:'BL26010045', service:'LCL', route:'HAI → SIN',
    vessel:'OOCL HONG KONG', voyage:'V.118W', eta:'2026-05-08',
    fees:{
      origin:[
        {n:'Trucking charge',u:'CBM',q:8.5,p:250000,who:'you'},
        {n:'Handling fee',u:'Shipment',q:1,p:1500000,who:'you'},
      ],
      freight:[{n:'Ocean freight (LCL)',u:'CBM',q:8.5,p:520000,who:'you'}],
      destination:[{n:'D/O fee',u:'Shipment',q:1,p:500000,who:'them'}]
    },
    workflow:{
      chargesIssued:'2026-04-18', chargesConfirmed:'2026-04-19',
      debitNote:{number:'DN-26-04-105',issued:'2026-04-20'}, invoice:null, payment:null
    },
    credits:[] as any[]
  },
  {
    ref:'TX-26-03018', bill:'BL26010088', service:'AIR', route:'SGN → ICN',
    vessel:'VN432 / KE682', voyage:'AWB 988-12345678', eta:'2026-03-12',
    fees:{
      origin:[
        {n:'Pickup charge',u:'Shipment',q:1,p:1200000,who:'you'},
        {n:'AWB fee',u:'AWB',q:1,p:600000,who:'you'},
        {n:'X-ray screening',u:'kg',q:120,p:5000,who:'you'},
      ],
      freight:[{n:'Air freight',u:'kg',q:120,p:95000,who:'you'}],
      destination:[
        {n:'Destination handling',u:'AWB',q:1,p:800000,who:'them'},
        {n:'Customs clearance',u:'Shipment',q:1,p:1600000,who:'them'},
      ]
    },
    workflow:{
      chargesIssued:'2026-03-08', chargesConfirmed:'2026-03-09',
      debitNote:{number:'DN-26-03-088',issued:'2026-03-09'},
      invoice:{number:'INV-26-03-088',issued:'2026-03-10',due:'2026-03-25'}, payment:null
    },
    credits:[] as any[]
  },
  {
    ref:'TX-26-04010', bill:'BL26010120', service:'FCL', route:'HPH → ROT',
    vessel:'MSC GULSUN', voyage:'V.0414W', eta:'2026-05-30',
    fees:{
      origin:[
        {n:'Trucking charge',u:'40HQ',q:2,p:3500000,who:'you'},
        {n:'Customs clearance',u:'Shipment',q:1,p:2500000,who:'you'},
        {n:'Lift fee (THC)',u:'40HQ',q:2,p:3500000,who:'you'},
      ],
      freight:[{n:'Ocean freight',u:'40HQ',q:2,p:14000000,who:'you'}],
      destination:[{n:'D/O fee',u:'Shipment',q:1,p:1150000,who:'them'}]
    },
    workflow:{
      chargesIssued:'2026-03-30', chargesConfirmed:'2026-03-31',
      debitNote:{number:'DN-26-04-120',issued:'2026-04-01'},
      invoice:{number:'INV-26-04-120',issued:'2026-04-01',due:'2026-04-22'}, payment:null
    },
    credits:[] as any[]
  },
  {
    ref:'TX-26-04015', bill:'BL26010135', service:'FCL', route:'HCM → HKG',
    vessel:'EVER GIVEN', voyage:'V.0418E', eta:'2026-05-02',
    fees:{
      origin:[
        {n:'Trucking charge',u:'20DC',q:1,p:2200000,who:'you'},
        {n:'Customs clearance',u:'Shipment',q:1,p:1800000,who:'you'},
      ],
      freight:[{n:'Ocean freight',u:'20DC',q:1,p:12500000,who:'you'}],
      destination:[{n:'Handling fee',u:'Shipment',q:1,p:2250000,who:'them'}]
    },
    workflow:{
      chargesIssued:'2026-04-08', chargesConfirmed:'2026-04-09',
      debitNote:{number:'DN-26-04-135',issued:'2026-04-10'},
      invoice:{number:'INV-26-04-135',issued:'2026-04-10',due:'2026-04-25'}, payment:null
    },
    credits:[] as any[]
  },
  {
    ref:'TX-26-03022', bill:'BL26010098', service:'LCL', route:'DAD → BKK',
    vessel:'WAN HAI 503', voyage:'V.S321', eta:'2026-04-08',
    fees:{
      origin:[{n:'Handling fee',u:'Shipment',q:1,p:1500000,who:'you'}],
      freight:[{n:'Ocean freight (LCL)',u:'CBM',q:6,p:680000,who:'you'}],
      destination:[{n:'D/O fee',u:'Shipment',q:1,p:700000,who:'them'}]
    },
    workflow:{
      chargesIssued:'2026-03-18', chargesConfirmed:'2026-03-19',
      debitNote:{number:'DN-26-03-098',issued:'2026-03-20'},
      invoice:{number:'INV-26-03-098',issued:'2026-03-20',due:'2026-04-04'},
      payment:{uploaded:'2026-04-02',confirmed:'2026-04-03'}
    },
    credits:[
      {number:'CN-26-04-001',amount:300000,reason:'Handling fee adjustment — overcharged',issued:'2026-04-22',status:'available'},
      {number:'CN-26-03-088',amount:450000,reason:'THC duplicate charge — adjusted',issued:'2026-03-25',status:'applied',appliedToInvoice:'INV-26-03-098',appliedDate:'2026-03-26'}
    ]
  },
  {
    ref:'TX-26-04020', bill:'BL26010150', service:'AIR', route:'SGN → NRT',
    vessel:'VN300 / NH832', voyage:'AWB 205-87654321', eta:'2026-04-23',
    fees:{
      origin:[
        {n:'Pickup charge',u:'Shipment',q:1,p:1000000,who:'you'},
        {n:'AWB fee',u:'AWB',q:1,p:500000,who:'you'},
      ],
      freight:[{n:'Air freight',u:'kg',q:80,p:88000,who:'you'}],
      destination:[{n:'Destination handling',u:'AWB',q:1,p:850000,who:'them'}]
    },
    workflow:{
      chargesIssued:'2026-04-20', chargesConfirmed:'2026-04-21',
      debitNote:{number:'DN-26-04-150',issued:'2026-04-22'},
      invoice:{number:'INV-26-04-150',issued:'2026-04-22',due:'2026-05-07'}, payment:null
    },
    credits:[
      {number:'CN-26-04-002',amount:120000,reason:'AWB fee duplicate charge',issued:'2026-04-25',status:'refund_pending',refundRequestDate:'2026-04-26'}
    ]
  },
])

// ── Task type definitions ──
const TASK_TYPES: Record<string, any> = {
  confirm_charges: { name:'Charge Confirmation', code:'TASK.CHG.CONF', color:'#16a34a', action:'Confirm', desc:'Awaiting customer confirmation on issued charge sheet.' },
  request_invoice: { name:'Invoice Request', code:'TASK.INV.REQ', color:'#2563eb', action:'Request', desc:'Charges confirmed. Awaiting invoice or debit note issuance request.' },
  upload_payment:  { name:'Payment Submission', code:'TASK.PAY.UPL', color:'#d97706', action:'Upload', desc:'Invoice issued. Pending payment slip submission for reconciliation.' },
  refund_pending:  { name:'Refund Disbursement', code:'TASK.REF.PEN', color:'#7c3aed', action:'Track', desc:'Refund request submitted. Pending SHOPTRANS finance disbursement.' },
}

const STATUS_LBL: Record<string, string> = {
  draft:'Charges Draft', confirmed:'Confirmed', debited:'Debit Issued',
  invoiced:'Invoiced', paid:'Paid', over7:'Overdue 1-7d', over30:'Overdue 8-30d', over30plus:'Overdue 30d+'
}

// ── State ──
const activeTab = ref('dashboard')
const drawerOpen = ref(false)
const activeDrawer = ref<any>(null)
const filterService = ref('all')
const filterScope = ref('all')
const filterPayer = ref('all')
const searchQ = ref('')
const selectedOverdue = ref<Set<string>>(new Set())
const taskFilter = ref<string|null>(null)
const overdueBucket = ref<string|null>(null)
const invoiceFilter = ref<string|null>(null)
const cnFilter = ref<string|null>(null)
const dateFrom = ref('2026-01-01')
const dateTo = ref('2026-04-30')

// ── Helpers ──
function daysBetween(d1: string, d2: string) {
  return Math.floor((new Date(d2).getTime() - new Date(d1).getTime()) / 86400000)
}
function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr); d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}
function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return `${String(d.getDate()).padStart(2, '0')} ${MONTH_ABBR[d.getMonth()]} ${d.getFullYear()}`
}
function fmtMoney(vnd: number) {
  return 'VND ' + Math.round(vnd).toLocaleString('en-US')
}
function fmtMoneyShort(vnd: number) {
  if (vnd >= 1e9) return (vnd / 1e9).toFixed(1) + 'B'
  if (vnd >= 1e6) return (vnd / 1e6).toFixed(1) + 'M'
  return Math.round(vnd).toLocaleString('en-US')
}

function shipmentAmount(s: any) {
  return ['origin', 'freight', 'destination'].reduce((sum, scope) =>
    sum + s.fees[scope].filter((f: any) => f.who === 'you').reduce((a: number, f: any) => a + f.q * f.p, 0), 0)
}
function shipmentAmountAll(s: any) {
  return ['origin', 'freight', 'destination'].reduce((sum, scope) =>
    sum + s.fees[scope].reduce((a: number, f: any) => a + f.q * f.p, 0), 0)
}

function shipmentStatus(s: any) {
  const w = s.workflow
  if (w.payment?.confirmed) return 'paid'
  if (w.invoice) {
    const days = daysBetween(w.invoice.due, TODAY.toISOString().slice(0, 10))
    if (days > 30) return 'over30plus'
    if (days >= 8) return 'over30'
    if (days >= 1) return 'over7'
    return 'invoiced'
  }
  if (w.debitNote) return 'debited'
  if (w.chargesConfirmed) return 'confirmed'
  return 'draft'
}

function isOverdue(s: any) { return ['over7', 'over30', 'over30plus'].includes(shipmentStatus(s)) }
function agingBucketOf(s: any) {
  const st = shipmentStatus(s)
  if (st === 'paid') return null
  if (['over7', 'over30', 'over30plus'].includes(st)) return st
  return 'current'
}

function shipmentTasks(s: any) {
  const w = s.workflow, list: any[] = []
  const status = shipmentStatus(s)
  if (!w.chargesConfirmed) {
    list.push({ type: 'confirm_charges', pri: 'med', deadline: addDays(w.chargesIssued, 15) })
  }
  if (w.chargesConfirmed && !w.debitNote && !w.invoice) {
    list.push({ type: 'request_invoice', pri: 'high', deadline: addDays(w.chargesConfirmed, 7) })
  }
  if (w.invoice && !w.payment) {
    const pri = status === 'over30plus' ? 'high' : status === 'over30' ? 'high' : status === 'over7' ? 'med' : 'low'
    list.push({ type: 'upload_payment', pri, deadline: w.invoice.due })
  }
  s.credits.filter((c: any) => c.status === 'refund_pending').forEach((c: any) => {
    list.push({ type: 'refund_pending', pri: 'med', deadline: addDays(c.refundRequestDate || c.issued, 30), credit: c })
  })
  return list
}

function inDateRange(dateStr: string | null) {
  if (!dateFrom.value && !dateTo.value) return true
  if (!dateStr) return false
  const d = new Date(dateStr)
  if (dateFrom.value && d < new Date(dateFrom.value)) return false
  if (dateTo.value && d > new Date(dateTo.value)) return false
  return true
}
function matchesSearch(s: any) {
  if (!inDateRange(s.workflow.chargesIssued)) return false
  const q = searchQ.value.trim().toLowerCase()
  if (!q) return true
  const inv = s.workflow.invoice?.number || '', dn = s.workflow.debitNote?.number || ''
  return [s.ref, s.bill, inv, dn].some((f: string) => f.toLowerCase().includes(q))
}

// ── Computed ──
const filteredShipments = computed(() => SHIPMENTS.filter(matchesSearch))

const dashboardKpis = computed(() => {
  const all = filteredShipments.value
  const outstanding = all.filter(s => !['paid', 'draft'].includes(shipmentStatus(s))).reduce((sum, s) => sum + shipmentAmount(s), 0)
  const paidYTD = all.filter(s => s.workflow.payment?.confirmed && new Date(s.workflow.payment.confirmed).getFullYear() === 2026).reduce((sum, s) => sum + shipmentAmount(s), 0)
  const overdueTotal = all.filter(isOverdue).reduce((sum, s) => sum + shipmentAmount(s), 0)
  const taskCount = all.reduce((sum, s) => sum + shipmentTasks(s).length, 0)
  return { outstanding, paidYTD, overdueTotal, taskCount,
    unpaidCount: all.filter(s => !['paid', 'draft'].includes(shipmentStatus(s))).length,
    paidCount: all.filter(s => shipmentStatus(s) === 'paid').length,
    overdueCount: all.filter(isOverdue).length }
})

const agingData = computed(() => {
  const all = filteredShipments.value
  const buckets: Record<string, any[]> = { current: [], over7: [], over30: [], over30plus: [] }
  all.forEach(s => { const b = agingBucketOf(s); if (b) buckets[b].push(s) })
  const max = Math.max(1, ...Object.values(buckets).map(arr => arr.reduce((a, s) => a + shipmentAmount(s), 0)))
  return [
    { key: 'current', label: 'Current', sub: 'Within terms', color: '#16a34a' },
    { key: 'over7', label: '1-7 days', sub: 'Mild overdue', color: '#d97706' },
    { key: 'over30', label: '8-30 days', sub: 'Action needed', color: '#ea580c' },
    { key: 'over30plus', label: '30+ days', sub: 'Critical', color: '#dc2626' },
  ].map(row => {
    const arr = buckets[row.key]
    const sum = arr.reduce((a, s) => a + shipmentAmount(s), 0)
    return { ...row, count: arr.length, sum, pct: Math.round(sum / max * 100) }
  })
})

const svcMix = computed(() => {
  const all = filteredShipments.value
  const svc: Record<string, number> = { FCL: 0, LCL: 0, AIR: 0 }
  all.forEach(s => svc[s.service]++)
  const tot = Math.max(1, svc.FCL + svc.LCL + svc.AIR)
  return { svc, tot, fclP: svc.FCL / tot, lclP: svc.LCL / tot, airP: svc.AIR / tot, C: 2 * Math.PI * 64 }
}),

recentActivity = computed(() =>
  [...filteredShipments.value].sort((a, b) => new Date(b.workflow.chargesIssued).getTime() - new Date(a.workflow.chargesIssued).getTime()).slice(0, 5)
)

const chargesFiltered = computed(() => {
  let list = filteredShipments.value.filter(s => filterService.value === 'all' || s.service === filterService.value)
  return list.map(s => {
    const scopes = filterScope.value === 'all' ? ['origin', 'freight', 'destination'] : [filterScope.value]
    let chargeCount = 0, subtotal = 0
    const scopeBreakdown: Record<string, number> = { origin: 0, freight: 0, destination: 0 }
    scopes.forEach(scope => {
      s.fees[scope].forEach((f: any) => {
        if (filterPayer.value !== 'all' && filterPayer.value !== f.who) return
        chargeCount++; subtotal += f.q * f.p; scopeBreakdown[scope] += f.q * f.p
      })
    })
    return { shipment: s, chargeCount, subtotal, scopeBreakdown }
  }).filter(r => r.chargeCount > 0)
})

const overdueShipments = computed(() => {
  let all = filteredShipments.value.filter(isOverdue)
  if (overdueBucket.value) all = all.filter(s => shipmentStatus(s) === overdueBucket.value)
  return all
})
const overdueBucketStats = computed(() => {
  const all = filteredShipments.value.filter(isOverdue)
  const b7 = all.filter(s => shipmentStatus(s) === 'over7')
  const b30 = all.filter(s => shipmentStatus(s) === 'over30')
  const b30p = all.filter(s => shipmentStatus(s) === 'over30plus')
  return { b7, b30, b30p }
})

const invoiceDocs = computed(() => {
  const all = filteredShipments.value.filter(s => s.workflow.invoice || s.workflow.debitNote)
  let docs = all.map(s => ({ shipment: s, status: shipmentStatus(s) }))
  if (invoiceFilter.value === 'paid') docs = docs.filter(d => d.status === 'paid')
  else if (invoiceFilter.value === 'outstanding') docs = docs.filter(d => ['debited', 'invoiced'].includes(d.status))
  else if (invoiceFilter.value === 'overdue') docs = docs.filter(d => ['over7', 'over30', 'over30plus'].includes(d.status))
  return docs
})
const invoiceStats = computed(() => {
  const all = filteredShipments.value.filter(s => s.workflow.invoice || s.workflow.debitNote).map(s => ({ shipment: s, status: shipmentStatus(s) }))
  return {
    paid: all.filter(d => d.status === 'paid'),
    outstanding: all.filter(d => ['debited', 'invoiced'].includes(d.status)),
    overdue: all.filter(d => ['over7', 'over30', 'over30plus'].includes(d.status)),
  }
})

const allCredits = computed(() => {
  const list: any[] = []
  SHIPMENTS.forEach(s => s.credits.forEach((c: any) => list.push({ ...c, shipment: s })))
  return list
})
const creditsByFilter = computed(() => {
  if (!cnFilter.value) return allCredits.value
  return allCredits.value.filter(c => c.status === cnFilter.value)
})
const creditStats = computed(() => ({
  available: allCredits.value.filter(c => c.status === 'available'),
  applied: allCredits.value.filter(c => c.status === 'applied'),
  pending: allCredits.value.filter(c => c.status === 'refund_pending'),
}))

const allTasks = computed(() => {
  const list: any[] = []
  filteredShipments.value.forEach(s => shipmentTasks(s).forEach(t => list.push({ ...t, shipment: s })))
  list.sort((a, b) => {
    const p: Record<string, number> = { high: 0, med: 1, low: 2 }
    return (p[a.pri] ?? 2) - (p[b.pri] ?? 2) || new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  })
  return list
})
const filteredTasks = computed(() => taskFilter.value ? allTasks.value.filter(t => t.type === taskFilter.value) : allTasks.value)
const taskGrouped = computed(() => {
  const grouped: Record<string, { count: number; amount: number }> = {}
  Object.keys(TASK_TYPES).forEach(k => grouped[k] = { count: 0, amount: 0 })
  allTasks.value.forEach(t => {
    if (grouped[t.type]) {
      grouped[t.type].count++
      grouped[t.type].amount += t.credit ? t.credit.amount : shipmentAmount(t.shipment)
    }
  })
  return grouped
})

const tabCounts = computed(() => {
  const f = filteredShipments.value
  return {
    charges: f.length,
    overdue: f.filter(isOverdue).length,
    invoices: f.filter(s => s.workflow.invoice || s.workflow.debitNote).length,
    credits: allCredits.value.length,
    tasks: allTasks.value.length,
  }
})

// ── Actions ──
function setTab(t: string) { activeTab.value = t }
function openDrawer(ref: string) {
  const s = SHIPMENTS.find(x => x.ref === ref)
  if (!s) return
  activeDrawer.value = s
  drawerOpen.value = true
}
function closeDrawer() { drawerOpen.value = false; activeDrawer.value = null }
function toggleOverdueSelect(ref: string) {
  const s = new Set(selectedOverdue.value)
  s.has(ref) ? s.delete(ref) : s.add(ref)
  selectedOverdue.value = s
}
function toggleTaskFilter(k: string) { taskFilter.value = taskFilter.value === k ? null : k }
function toggleOverdueBucket(b: string) { overdueBucket.value = overdueBucket.value === b ? null : b }
function toggleInvoiceFilter(f: string) { invoiceFilter.value = invoiceFilter.value === f ? null : f }
function toggleCnFilter(f: string) { cnFilter.value = cnFilter.value === f ? null : f }
function clearFilters() { filterService.value = 'all'; filterScope.value = 'all'; filterPayer.value = 'all' }
function hasActiveFilters() { return filterService.value !== 'all' || filterScope.value !== 'all' || filterPayer.value !== 'all' }

function drawerSteps() {
  if (!activeDrawer.value) return []
  const w = activeDrawer.value.workflow
  return [
    { name: 'Charges Issued', date: w.chargesIssued, done: !!w.chargesIssued },
    { name: 'Confirmed', date: w.chargesConfirmed, done: !!w.chargesConfirmed },
    { name: w.invoice ? 'Invoice' : 'Debit/Invoice', date: w.invoice?.issued || w.debitNote?.issued, done: !!(w.invoice || w.debitNote) },
    { name: 'Paid', date: w.payment?.confirmed, done: !!w.payment?.confirmed },
  ]
}
function drawerFillPct() {
  const steps = drawerSteps()
  const idx = steps.findIndex(s => !s.done)
  const pi = idx === -1 ? steps.length - 1 : idx
  return (pi / (steps.length - 1)) * 100
}
function scopeSum(scope: string, who?: string) {
  if (!activeDrawer.value) return 0
  const fees = activeDrawer.value.fees[scope]
  return fees.filter((f: any) => !who || f.who === who).reduce((a: number, f: any) => a + f.q * f.p, 0)
}

function taskDeadlineDays(t: any) {
  return daysBetween(TODAY.toISOString().slice(0, 10), t.deadline)
}

return {
  SHIPMENTS, TASK_TYPES, STATUS_LBL, TODAY,
  activeTab, drawerOpen, activeDrawer,
  filterService, filterScope, filterPayer, searchQ,
  selectedOverdue, taskFilter, overdueBucket, invoiceFilter, cnFilter,
  dateFrom, dateTo,
  // computed
  filteredShipments, dashboardKpis, agingData, svcMix, recentActivity,
  chargesFiltered, overdueShipments, overdueBucketStats,
  invoiceDocs, invoiceStats, allCredits, creditsByFilter, creditStats,
  allTasks, filteredTasks, taskGrouped, tabCounts,
  // methods
  setTab, openDrawer, closeDrawer, toggleOverdueSelect,
  toggleTaskFilter, toggleOverdueBucket, toggleInvoiceFilter, toggleCnFilter,
  clearFilters, hasActiveFilters,
  shipmentAmount, shipmentAmountAll, shipmentStatus, isOverdue,
  fmtDate, fmtMoney, fmtMoneyShort,
  drawerSteps, drawerFillPct, scopeSum, taskDeadlineDays, daysBetween,
}
}
