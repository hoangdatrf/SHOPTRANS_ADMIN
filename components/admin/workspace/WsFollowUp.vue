<template>
  <div class="wsfu">
    <div class="ws-subtabbar">
      <button class="ws-subtab" :class="{ on: subTab === 'inquiry' }" @click="subTab = 'inquiry'">Inquiry</button>
      <button class="ws-subtab" :class="{ on: subTab === 'stats' }" @click="subTab = 'stats'">Follow-up</button>
    </div>

    <!-- ===== Inquiry sub-tab ===== -->
    <template v-if="subTab === 'inquiry'">
      <div class="ws-toolbar">
        <button class="ws-btn" @click="addRow">Add+</button>
        <button class="ws-btn grey" :disabled="!anySel" @click="copySelected">Copy</button>
        <button class="ws-btn red" :disabled="!anySel" @click="removeSelected">Remove -</button>
        <span class="fu-fsep"></span>
        <input type="date" v-model="filter.dfrom" class="fu-fin" title="Inquiry date from"> –
        <input type="date" v-model="filter.dto" class="fu-fin" title="Inquiry date to">
        <input v-model="filter.customer" placeholder="Customer…" class="fu-fin" style="width:110px">
        <input v-model="filter.from" placeholder="From" class="fu-fin" style="width:64px">
        <input v-model="filter.to" placeholder="To" class="fu-fin" style="width:64px">
        <select v-model="filter.result" class="fu-fin">
          <option value="">Result</option>
          <option>Dealt</option>
          <option>Lost</option>
        </select>
        <button v-if="filterOn" class="ws-chip on" @click="clearFilter">Clear ✕</button>
        <button class="ws-btn grey" style="margin-left:auto" @click="loadDemo">Load Example Data</button>
      </div>
      <datalist id="wsFuClients">
        <option v-for="n in clientOptions" :key="n" :value="n"></option>
      </datalist>
      <datalist id="wsFuPicDL">
        <option v-for="p in picDlOptions" :key="p" :value="p"></option>
      </datalist>
      <datalist id="wsFuPlatforms">
        <option v-for="n in PLATFORMS" :key="n" :value="n"></option>
      </datalist>
      <div class="ws-scroll">
        <table class="ws-tbl ws-meettbl fu-tbl" style="min-width:1900px">
          <colgroup>
            <col style="width:36px"><col style="width:94px"><col style="width:118px"><col style="width:126px"><col style="width:168px"><col style="width:76px"><col style="width:104px"><col style="width:92px"><col style="width:96px"><col style="width:104px"><col style="width:104px"><col style="width:78px"><col style="width:78px"><col style="width:86px"><col style="width:148px"><col style="width:172px"><col style="width:70px"><col style="width:44px">
          </colgroup>
          <thead>
            <tr>
              <th class="ws-sticky1"><input type="checkbox" title="Select all" @change="toggleAll($event)"></th>
              <th>RFQ No#</th>
              <th>Inquiry Date</th>
              <th>ClientCode <button class="fu-hplus" title="Add new client" @click="openClientAdd">+</button></th>
              <th>FullName</th>
              <th>Type</th>
              <th>ServiceType</th>
              <th>OrgTerm</th>
              <th>DestTerm</th>
              <th>PIC</th>
              <th>From platform</th>
              <th>From</th>
              <th>To</th>
              <th>Details</th>
              <th>QuotedDate</th>
              <th>Result</th>
              <th>Quote Age</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in visibleRows" :key="r.id">
              <td class="ws-sticky1" style="text-align:center"><input type="checkbox" class="fu-sel" v-model="r._sel"></td>
              <td style="font-weight:700;font-size:11.5px">{{ r.rfq }}</td>
              <td><input type="date" class="fu-cellin" v-model="r.inqDate" :disabled="isLocked(r)" @change="persist()"></td>
              <td class="fu-cctd">
                <template v-if="r.clientCode">
                  <span class="fu-cclink" @click="openClientPopup(r.clientCode)">{{ r.clientCode }}</span>
                  <button v-if="!isLocked(r)" class="ws-icobtn fu-ccpen" title="Change client" @click="openClientPick(r)">✎</button>
                </template>
                <span v-else-if="isLocked(r)" style="color:#b7c1ba">—</span>
                <button v-else class="fu-detbtn" @click="openClientPick(r)">ADD+</button>
              </td>
              <td><input class="fu-cellin" v-model="r.fullName" :disabled="isLocked(r)" @change="persist()"></td>
              <td>
                <select class="fu-cellin" v-model="r.type" :disabled="isLocked(r)" @change="persist()">
                  <option>FCL</option><option>LCL</option><option>AIR</option>
                </select>
              </td>
              <td>
                <select class="fu-cellin" :value="r.serviceType" :disabled="isLocked(r)" @change="changeLogisticsTerm(r, 'serviceType', $event)">
                  <option>Single</option><option>Combine</option>
                </select>
              </td>
              <td>
                <select class="fu-cellin" :value="r.orgTerm" :disabled="isLocked(r)" @change="changeLogisticsTerm(r, 'orgTerm', $event)">
                  <option v-for="term in originTermOptions(r)" :key="term">{{ term }}</option>
                </select>
              </td>
              <td>
                <select class="fu-cellin" :value="r.destTerm" :disabled="isLocked(r)" @change="changeLogisticsTerm(r, 'destTerm', $event)">
                  <option v-for="term in destinationTermOptions(r)" :key="term">{{ term }}</option>
                </select>
              </td>
              <td><input class="fu-cellin fu-picin" v-model="r.pic" list="wsFuPicDL" :disabled="isLocked(r)" @focus="picFocusCode = r.clientCode" @change="persist()"></td>
              <td><input class="fu-cellin" v-model="r.platform" list="wsFuPlatforms" :disabled="isLocked(r)" @change="persist()"></td>
              <td><input class="fu-cellin" v-model="r.from" :disabled="isLocked(r)" @change="persist()"></td>
              <td><input class="fu-cellin" v-model="r.to" :disabled="isLocked(r)" @change="persist()"></td>
              <td style="text-align:center">
                <button v-if="hasDet(r)" class="fu-detbtn det" @click="openDet(r)">DETAIL</button>
                <button v-else class="fu-detbtn" @click="openDet(r)">ADD+</button>
              </td>
              <td style="text-align:center">
                <template v-if="r.quotedAt">
                  <span class="fu-qdate">{{ qDateFmt(r) }}</span>
                  <button v-if="!isLocked(r)" class="ws-icobtn" title="Clear" style="color:#c0392b;font-size:10px;padding:1px 3px" @click="clearQuoted(r)">✕</button>
                </template>
                <span v-else-if="isLocked(r)" style="color:#b7c1ba">—</span>
                <button v-else class="fu-detbtn" @click="markQuoted(r)">Mark Quoted</button>
              </td>
              <td>
                <div class="fu-stwrap">
                  <select class="fu-stsel" :class="resultClass(r)" :value="r.result" :disabled="isLocked(r)" @change="onResultChange(r, $event)">
                    <option value=""></option>
                    <option value="Dealt" :selected="r.result === 'Dealt'">Dealt</option>
                    <option value="Lost" :selected="r.result === 'Lost'">Lost</option>
                  </select>
                  <span class="fu-stdate">{{ r.resultAt ? r.resultAt.split('-').reverse().join('/') : '' }}</span>
                  <template v-if="r.result === 'Dealt'">
                    <span v-if="r.sharedAt" class="fu-shared" :title="'Shared ' + r.sharedAt">✓OPS</span>
                    <button v-else class="ws-icobtn" title="Share to OPS" style="color:#0f4c81;font-size:12px;padding:1px 3px" @click="shareRow(r)">⬆</button>
                  </template>
                </div>
              </td>
              <td style="text-align:center;font-weight:700">
                <template v-if="fuDays(r) !== ''">{{ fuDays(r) }}</template>
                <span v-else style="color:#b7c1ba">—</span>
              </td>
              <td style="text-align:center"><button class="ws-icobtn" title="Remove" style="color:#c0392b" @click="delRow(r)">✕</button></td>
            </tr>
            <tr v-if="!visibleRows.length">
              <td colspan="18" style="text-align:center;color:#8a94a0;padding:16px">No inquiry yet. Click “Add+” or “Load Example Data”.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ===== Follow-up (stats) sub-tab ===== -->
    <template v-else>
      <div class="ws-toolbar">
        <input type="date" v-model="statsFilter.from" class="fu-fin" title="From date"> –
        <input type="date" v-model="statsFilter.to" class="fu-fin" title="To date">
        <input v-model="statsFilter.code" placeholder="Filter by NameCode…" class="fu-fin" style="width:170px">
        <button v-if="statsFilter.from || statsFilter.to || statsFilter.code" class="ws-chip on" @click="clearStatsFilter">Clear ✕</button>
        <span style="color:#8a94a0;font-size:12px;margin-left:auto">Click a column header to sort.</span>
      </div>
      <div class="ws-scroll">
        <table class="ws-tbl fu-tbl" style="min-width:900px">
          <colgroup>
            <col style="width:60px"><col style="width:160px"><col style="width:220px"><col style="width:110px"><col style="width:100px"><col style="width:110px"><col style="width:110px"><col style="width:110px">
          </colgroup>
          <thead>
            <tr>
              <th>Order</th>
              <th>ClientCode</th>
              <th>FullName</th>
              <th class="fu-sortth" @click="clickSort('quotes')">Quotations{{ sortArrow('quotes') }}</th>
              <th class="fu-sortth" @click="clickSort('dealt')">Dealt{{ sortArrow('dealt') }}</th>
              <th class="fu-sortth" @click="clickSort('handling')">Handling{{ sortArrow('handling') }}</th>
              <th class="fu-sortth" @click="clickSort('cancel')">Cancelled{{ sortArrow('cancel') }}</th>
              <th class="fu-sortth" @click="clickSort('done')">Completed{{ sortArrow('done') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in statsRows" :key="row.code">
              <td style="text-align:center">{{ i + 1 }}</td>
              <td style="text-align:center"><span class="fu-cclink" @click="openClientPopup(row.code)">{{ row.code }}</span></td>
              <td>{{ row.fullName }}</td>
              <td style="text-align:center">{{ row.quotes }}</td>
              <td style="text-align:center">{{ row.dealt }}</td>
              <td style="text-align:center">{{ row.handling }}</td>
              <td style="text-align:center">{{ row.cancel }}</td>
              <td style="text-align:center">{{ row.done }}</td>
            </tr>
            <tr v-if="!statsRows.length">
              <td colspan="8" style="text-align:center;color:#8a94a0;padding:16px">No data yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ===== Confirm modal (replaces wsConfirm) ===== -->
    <div v-if="confirmModal.open" class="mov">
      <div class="mov-box">
        <div class="mov-msg">{{ confirmModal.msg }}</div>
        <div class="mov-btns">
          <button class="ws-btn red" @click="confirmYes">YES</button>
          <button class="ws-btn grey" @click="confirmModal.open = false">NO</button>
        </div>
      </div>
    </div>

    <!-- ===== Lost-reason modal ===== -->
    <div v-if="lostModal.open" class="mov" style="z-index:99">
      <div style="background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:22px 26px;min-width:320px">
        <div style="font-weight:700;font-size:13.5px;color:#33413b;margin-bottom:12px">Reason for losing this inquiry:</div>
        <select v-model="lostModal.reason" style="width:100%;border:1px solid #d6ddd9;border-radius:7px;padding:7px 9px;margin-bottom:10px">
          <option v-for="x in LOST_REASONS" :key="x">{{ x }}</option>
        </select>
        <input v-model="lostModal.note" placeholder="Note (optional)" style="width:100%;box-sizing:border-box;border:1px solid #d6ddd9;border-radius:7px;padding:7px 9px;margin-bottom:14px">
        <div style="display:flex;gap:10px;justify-content:center">
          <button class="ws-btn red" style="min-width:86px" @click="confirmLost">Confirm Lost</button>
          <button class="ws-btn grey" style="min-width:70px" @click="cancelLost">Cancel</button>
        </div>
      </div>
    </div>

    <!-- ===== Client stats popup ===== -->
    <div v-if="cli.open" class="cliov">
      <div class="cli-mo">
        <button class="cli-x" @click="cli.open = false">✕</button>
        <div style="font-weight:800;font-size:15px;color:#1f2a26;margin-bottom:2px">{{ cli.code }}</div>
        <div style="font-size:12.5px;color:#5a6875;margin-bottom:12px">{{ cliSubline }}</div>
        <div class="ws-toolbar" style="margin-bottom:12px">
          <span style="font-size:12px;color:#5a6875">Filter period:</span>
          <input type="date" v-model="cli.from" style="border:1px solid #d6ddd9;border-radius:6px;padding:4px 7px;font-size:12px"> –
          <input type="date" v-model="cli.to" style="border:1px solid #d6ddd9;border-radius:6px;padding:4px 7px;font-size:12px">
          <button class="ws-chip" @click="cliQuick('m')">This month</button>
          <button class="ws-chip" @click="cliQuick('y')">This year</button>
          <button class="ws-chip" @click="cliQuick('a')">All</button>
        </div>
        <div class="wscli-grid">
          <div class="wscli-tile q"><div class="wscli-num">{{ cliStat.quotes }}</div><div class="wscli-lbl">Quotations</div></div>
          <div class="wscli-tile d"><div class="wscli-num">{{ cliStat.dealt }}</div><div class="wscli-lbl">Dealt</div></div>
          <div class="wscli-tile h"><div class="wscli-num">{{ cliStat.handling }}</div><div class="wscli-lbl">Handling</div></div>
          <div class="wscli-tile c"><div class="wscli-num">{{ cliStat.cancel }}</div><div class="wscli-lbl">Cancelled</div></div>
          <div class="wscli-tile ok"><div class="wscli-num">{{ cliStat.done }}</div><div class="wscli-lbl">Completed</div></div>
        </div>
        <div style="font-size:10.5px;color:#9aa8a0;margin-top:10px">Handling = dealt &amp; shared to OPS, not yet completed · Completed will link with OPS in a later phase.</div>
      </div>
    </div>

    <!-- ===== Client pick/add popup ===== -->
    <div v-if="cp.open" class="cpov">
      <div class="wscp-mo">
        <div class="wscp-hd">
          <span class="wscp-title">{{ cp.view === 'search' ? 'Link CLIENT' : (cp.view === 'detail' ? 'CLIENT detail' : 'New CLIENT') }}</span>
          <span class="x" title="Close" @click="cp.open = false">✕</span>
        </div>
        <!-- search view -->
        <template v-if="cp.view === 'search'">
          <div class="wscp-searchrow">
            <select v-model="cp.field">
              <option value="id">By ID</option>
              <option value="namecode">By NameCode</option>
              <option value="company">By Name</option>
            </select>
            <input v-model="cp.term" placeholder="Search…">
            <button class="ws-btn" @click="cpShowAdd">Add New</button>
          </div>
          <div class="wscp-list">
            <div v-for="r in cpResults" :key="r.id" class="wscp-item" @click="cpShowDetail(r)">
              <b>{{ r.namecode || r.id }}</b><span>{{ r.company }}</span>
            </div>
            <div v-if="!cpResults.length" class="ws-placeholder" style="padding:18px 0">No client found.</div>
          </div>
        </template>
        <!-- detail view -->
        <template v-else-if="cp.view === 'detail' && cp.detail">
          <div class="wscp-detail">
            <div class="wscp-drow"><b>NameCode</b><span>{{ cp.detail.namecode }}</span></div>
            <div class="wscp-drow"><b>Company</b><span>{{ cp.detail.company }}</span></div>
            <div class="wscp-drow"><b>Address</b><span>{{ cp.detail.address }}</span></div>
            <div class="wscp-drow"><b>City / Country</b><span>{{ cp.detail.city }} {{ cp.detail.country }}</span></div>
            <div class="wscp-drow"><b>PIC</b><span>{{ cp.detail.pic }}</span></div>
            <div class="wscp-drow"><b>Phone</b><span>{{ cp.detail.phone }}</span></div>
            <div class="wscp-drow"><b>Email</b><span>{{ cp.detail.email }}</span></div>
          </div>
          <div class="wscp-usebar">
            <button class="ws-btn grey" @click="cp.view = 'search'">‹ Back</button>
            <button class="ws-btn" @click="cpUse">Use this CLIENT</button>
          </div>
        </template>
        <!-- add-new view -->
        <template v-else>
          <div class="wscp-form">
            <div class="wscp-frow"><label>ID<input :value="cp.form.id" readonly placeholder="auto"></label></div>
            <div class="wscp-frow">
              <label>NameCode<input v-model="cp.form.nc" :readonly="cp.locked"></label>
              <label>Company Name<input v-model="cp.form.co" :readonly="cp.locked"></label>
            </div>
            <div class="wscp-frow"><label class="wide">Address<input v-model="cp.form.addr" :readonly="cp.locked"></label></div>
            <div class="wscp-frow">
              <label>City/Province<input v-model="cp.form.city" :readonly="cp.locked"></label>
              <label>Country<input v-model="cp.form.cty" list="wscpDCty" :readonly="cp.locked" @input="cpUpId"></label>
            </div>
            <datalist id="wscpDCty">
              <option v-for="c in CP_COUNTRIES" :key="c" :value="c"></option>
            </datalist>
            <div class="wscp-frow">
              <label>PIC Name<input v-model="cp.form.pic" :readonly="cp.locked"></label>
              <label>Phone<input v-model="cp.form.phone" :readonly="cp.locked"></label>
            </div>
            <div class="wscp-frow"><label class="wide">Email<input v-model="cp.form.email" :readonly="cp.locked" autocomplete="off"></label></div>
          </div>
          <div class="wscp-usebar">
            <button class="ws-btn grey" @click="cp.view = 'search'">‹ Back</button>
            <button v-if="!cp.locked && !cp.saved" class="ws-btn red" @click="cpClearForm">Cancel</button>
            <button v-if="cp.locked" class="ws-btn orange" @click="cp.locked = false">Edit</button>
            <button v-if="!cp.locked" class="ws-btn" @click="cpSave">Save CLIENT</button>
          </div>
        </template>
      </div>
    </div>

    <!-- ===== Inquiry detail popup ===== -->
    <div v-if="det.open" class="detov">
      <div class="mo3">
        <div class="hd3"><span class="x" title="Close" @click="det.open = false">✕</span></div>
        <div class="bd3">
          <div class="dsec"><div class="dlbl">Inquiry information</div><textarea ref="detInquiryEl" v-model="det.inquiry" class="dta dta-sm" :readonly="!det.edit"></textarea></div>
          <div class="dcols">
            <div class="dsec"><div class="dlbl">Cost</div><textarea v-model="det.cost" class="dta dta-lg" :readonly="!det.edit"></textarea></div>
            <div class="dsec"><div class="dlbl">Quotation</div><textarea v-model="det.quote" class="dta dta-lg" :readonly="!det.edit"></textarea></div>
          </div>
          <div class="dsec"><div class="dlbl">Remarks</div><textarea v-model="det.remarks" class="dta dta-sm" :readonly="!det.edit"></textarea></div>
          <div class="dsec dfattach">
            <button class="dlattach" type="button" :disabled="!det.edit" @click="detFileEl?.click()">📎 ATTACH FILES</button>
            <input ref="detFileEl" type="file" multiple hidden @change="detAddFiles">
            <div class="dfiles">
              <div v-for="(f, i) in det.files" :key="i" class="dfrow">
                <span class="dficon">📄</span>
                <input type="text" class="dfname" v-model="f.name" :readonly="!det.edit">
                <button v-if="det.edit" type="button" class="dfx" title="Remove" @click="detRemoveFile(i)">✕</button>
              </div>
            </div>
          </div>
        </div>
        <div class="foot3">
          <button v-if="!det.edit" class="ws-btn orange" @click="detEdit">Edit</button>
          <button class="ws-btn grey" @click="det.open = false">Close</button>
          <button v-if="det.edit" class="ws-btn" @click="detSave">Save</button>
        </div>
      </div>
    </div>

    <!-- ===== Toast ===== -->
    <div v-if="toastState.on" class="fu-toast">{{ toastState.msg }}</div>
  </div>
</template>

<script setup lang="ts">
import { applyTermChange } from '~/utils/adminMassSales.mjs'

type FuFile = { name: string }
type FuDet = { inquiry: string; cost: string; quote: string; remarks: string; files: FuFile[] }
type FuRow = {
  id: string; rfq: string; inqDate: string; clientCode: string; fullName: string; pic: string
  type: string; serviceType: string; orgTerm: string; destTerm: string
  platform: string; from: string; to: string; details?: string; det?: FuDet
  status: string; statusAt: string; quotedAt?: string; result: string; resultAt: string
  lostReason?: string; sharedAt?: string; completedAt?: string; log: string[]; _sel?: boolean
}
type CustRec = {
  id: string; namecode: string; company: string; address: string; city: string
  country: string; pic: string; phone: string; email: string; recdate?: string; status?: string
}
type FuDoc = { rows: FuRow[]; clients: string[]; customers: { rows: CustRec[] } }

const props = defineProps<{ request: (url: string, options?: any) => Promise<any> }>()

const WS_TAB = 'follow'
const LOST_REASONS = ['Price too high', 'Competitor', 'Vessel schedule', 'Transit time', 'Customer cancelled', 'No response', 'Late quotation', 'Other']
const PLATFORMS = ['EMAIL', 'WECHAT', 'WHATSAPP', 'WEBSITE', 'ALIBABA', 'REFERRAL', 'PHONE']
const CP_CCODE: Record<string, string> = { VIETNAM: 'VN', 'VIET NAM': 'VN', CHINA: 'CN', 'UNITED STATES': 'US', USA: 'US', JAPAN: 'JP', 'SOUTH KOREA': 'KR', KOREA: 'KR', SINGAPORE: 'SG', THAILAND: 'TH', MALAYSIA: 'MY', INDONESIA: 'ID', PHILIPPINES: 'PH', INDIA: 'IN', 'HONG KONG': 'HK', TAIWAN: 'TW', CAMBODIA: 'KH', LAOS: 'LA', MYANMAR: 'MM', AUSTRALIA: 'AU', GERMANY: 'DE', FRANCE: 'FR', 'UNITED KINGDOM': 'GB', NETHERLANDS: 'NL', ITALY: 'IT', SPAIN: 'ES', CANADA: 'CA', 'UNITED ARAB EMIRATES': 'AE', BANGLADESH: 'BD', PAKISTAN: 'PK', TURKEY: 'TR', BELGIUM: 'BE' }
const CP_COUNTRIES = ['VIETNAM', 'CHINA', 'UNITED STATES', 'JAPAN', 'SOUTH KOREA', 'SINGAPORE', 'THAILAND', 'MALAYSIA', 'INDONESIA', 'PHILIPPINES', 'INDIA', 'HONG KONG', 'TAIWAN']

/* ---------- helpers (mirror mockup ws* helpers) ---------- */
const p2 = (n: number) => String(n).padStart(2, '0')
function today() { const d = new Date(); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) }
function now() { const d = new Date(); return today() + ' ' + p2(d.getHours()) + ':' + p2(d.getMinutes()) }
function uid() { return Math.random().toString(36).slice(2, 10) }

/* ---------- persisted document ---------- */
const doc = reactive<FuDoc>({ rows: [], clients: [], customers: { rows: [] } })

function normalizeFuRow(row: any): FuRow {
  const detailType = String(row?.details || row?.det?.inquiry || '').trim().match(/^(FCL|LCL|AIR)\b/i)?.[1]?.toUpperCase()
  const type = ['FCL', 'LCL', 'AIR'].includes(String(row?.type || '').toUpperCase())
    ? String(row.type).toUpperCase()
    : detailType || 'FCL'
  const serviceType = row?.serviceType === 'Combine' ? 'Combine' : 'Single'
  return {
    ...row,
    type,
    serviceType,
    orgTerm: ['EXW', 'FCA', 'FCF', '-'].includes(row?.orgTerm) ? row.orgTerm : 'EXW',
    destTerm: ['DO', 'DAP', 'DDU', 'DDP', '-'].includes(row?.destTerm)
      ? row.destTerm
      : serviceType === 'Combine' ? 'DO' : '-',
  } as FuRow
}

async function persist() {
  try {
    await props.request(`/workspace/${WS_TAB}`, { method: 'PUT', body: JSON.parse(JSON.stringify(doc)) })
  } catch (e) { /* keep UI responsive even if save fails */ }
}

onMounted(async () => {
  try {
    const res = await props.request(`/workspace/${WS_TAB}`)
    const d = res?.data
    if (d) {
      doc.rows = Array.isArray(d.rows) ? d.rows.map(normalizeFuRow) : []
      doc.clients = Array.isArray(d.clients) ? d.clients : []
      doc.customers = d.customers && Array.isArray(d.customers.rows) ? d.customers : { rows: [] }
    }
  } catch (e) { /* start empty */ }
})

/* ---------- toast ---------- */
const toastState = reactive({ msg: '', on: false })
let toastTimer: any = null
function toast(msg: string) {
  toastState.msg = msg
  toastState.on = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastState.on = false }, 1900)
}

/* ---------- confirm modal (replaces wsConfirm) ---------- */
const confirmModal = reactive<{ open: boolean; msg: string; onYes: (() => void) | null }>({ open: false, msg: '', onYes: null })
function askConfirm(msg: string, onYes: () => void) {
  confirmModal.msg = msg
  confirmModal.onYes = onYes
  confirmModal.open = true
}
function confirmYes() {
  confirmModal.open = false
  const fn = confirmModal.onYes
  confirmModal.onYes = null
  if (fn) fn()
}

/* ---------- sub-tabs & filters ---------- */
const subTab = ref<'inquiry' | 'stats'>('inquiry')
const filter = reactive({ dfrom: '', dto: '', customer: '', from: '', to: '', result: '' })
const statsFilter = reactive({ from: '', to: '', code: '' })
const statsSort = reactive<{ key: string; dir: 'asc' | 'desc' }>({ key: 'quotes', dir: 'desc' })
const picFocusCode = ref('')

const filterOn = computed(() => !!(filter.dfrom || filter.dto || filter.customer || filter.from || filter.to || filter.result))
const anySel = computed(() => doc.rows.some(r => r._sel))
const clientOptions = computed(() => doc.customers.rows.map(r => r.namecode || r.company || '').filter(Boolean).concat(doc.clients))
const picDlOptions = computed(() => picsOf(picFocusCode.value))

function clearFilter() { filter.dfrom = ''; filter.dto = ''; filter.customer = ''; filter.from = ''; filter.to = ''; filter.result = '' }
function clearStatsFilter() { statsFilter.from = ''; statsFilter.to = ''; statsFilter.code = '' }

function pass(r: FuRow) {
  const f = filter
  if (f.dfrom && (r.inqDate || '') < f.dfrom) return false
  if (f.dto && (r.inqDate || '') > f.dto) return false
  if (f.customer && String(r.clientCode || '').toUpperCase().indexOf(f.customer.toUpperCase()) < 0 && String(r.fullName || '').toUpperCase().indexOf(f.customer.toUpperCase()) < 0) return false
  if (f.from && String(r.from || '').toUpperCase().indexOf(f.from.toUpperCase()) < 0) return false
  if (f.to && String(r.to || '').toUpperCase().indexOf(f.to.toUpperCase()) < 0) return false
  if (f.result && r.result !== f.result) return false
  return true
}
const visibleRows = computed(() =>
  doc.rows.slice()
    .sort((a, b) => (String(b.inqDate || '') + (b.rfq || '')).localeCompare(String(a.inqDate || '') + (a.rfq || '')))
    .filter(pass)
)

/* ---------- row helpers ---------- */
const isLocked = (r: FuRow) => !!r.sharedAt
const qDate = (r: FuRow) => r.quotedAt || ''
function qDateFmt(r: FuRow) {
  if (!r.quotedAt) return ''
  const parts = r.quotedAt.split(' ')
  const dp = parts[0]!.split('-')
  return dp[2] + '/' + dp[1] + '/' + dp[0] + (parts[1] ? (' ' + parts[1]) : '')
}
function fuDays(r: FuRow): string {
  const q = qDate(r)
  if (!q) return ''
  const end = (r.result && r.resultAt) ? r.resultAt : today()
  const dd = Math.round((new Date(end).getTime() - new Date(q.slice(0, 10)).getTime()) / 86400e3)
  return dd >= 0 ? String(dd) : ''
}
function fuLog(r: FuRow, msg: string) { r.log = r.log || []; r.log.push(now() + ' · ' + msg) }
function fuRfq() {
  const d = new Date()
  const pre = 'RFQ' + p2(d.getDate()) + p2(d.getMonth() + 1) + String(d.getFullYear()).slice(2)
  let n = 1
  doc.rows.forEach(r => {
    if ((r.rfq || '').indexOf(pre) === 0) {
      const q = parseInt((r.rfq || '').slice(pre.length), 10)
      if (q >= n) n = q + 1
    }
  })
  return pre + p2(n)
}
function hasDet(r: FuRow) {
  const d = r.det
  return !!((d && (d.inquiry || d.cost || d.quote || d.remarks || (d.files && d.files.length))) || String(r.details || '').trim())
}
function resultClass(r: FuRow) { return (r.result === 'Dealt' ? 'fu-deal' : r.result === 'Lost' ? 'fu-lost' : '') }

function trader(code: string): CustRec | null {
  const rs = doc.customers.rows
  for (let i = 0; i < rs.length; i++) {
    if ((rs[i]!.namecode || '').toUpperCase() === String(code || '').toUpperCase()) return rs[i]!
  }
  return null
}
function fullNameOf(code: string): string {
  const tr = trader(code)
  if (tr) return tr.company || tr.namecode || ''
  const hit = doc.rows.filter(r => (r.clientCode || '').toUpperCase() === String(code || '').toUpperCase() && r.fullName)[0]
  return hit ? hit.fullName : ''
}
function picsOf(code: string): string[] {
  const out: string[] = []
  doc.rows.forEach(r => {
    if ((r.clientCode || '').toUpperCase() === String(code || '').toUpperCase() && r.pic && out.indexOf(r.pic) < 0) out.push(r.pic)
  })
  return out
}

/* ---------- inquiry toolbar actions ---------- */
function addRow() {
  const r: FuRow = { id: uid(), rfq: fuRfq(), inqDate: today(), clientCode: '', fullName: '', pic: '', type: 'FCL', serviceType: 'Single', orgTerm: 'EXW', destTerm: '-', platform: '', from: '', to: '', details: '', status: '', statusAt: '', result: '', resultAt: '', log: [now() + ' · Inquiry created'] }
  doc.rows.push(r)
  void persist()
}
const originTermOptions = (row: FuRow) => row.serviceType === 'Combine' ? ['EXW', 'FCA', 'FCF'] : ['EXW', 'FCA', 'FCF', '-']
const destinationTermOptions = (row: FuRow) => row.serviceType === 'Combine' ? ['DO', 'DAP', 'DDU', 'DDP'] : ['DO', 'DAP', 'DDU', 'DDP', '-']
function changeLogisticsTerm(row: FuRow, field: 'serviceType' | 'orgTerm' | 'destTerm', event: Event) {
  const next = applyTermChange(row, field, (event.target as HTMLSelectElement).value)
  row.serviceType = next.serviceType
  row.orgTerm = next.orgTerm
  row.destTerm = next.destTerm
  void persist()
}
function copySelected() {
  const sel = doc.rows.filter(r => r._sel)
  if (!sel.length) return
  sel.forEach(o => {
    const r: FuRow = JSON.parse(JSON.stringify(o))
    r.id = uid()
    r.rfq = fuRfq()
    r.inqDate = today()
    r.status = ''
    r.statusAt = ''
    r.result = ''
    r.resultAt = ''
    r.lostReason = ''
    delete r.sharedAt
    r._sel = false
    r.log = [now() + ' · Copied from ' + (o.rfq || '')]
    doc.rows.push(r)
  })
  doc.rows.forEach(r => { r._sel = false })
  void persist()
  toast('Copied ' + sel.length + ' inquiry(ies)')
}
function removeSelected() {
  const sel = doc.rows.filter(r => r._sel)
  if (!sel.length) return
  askConfirm('Are you sure to remove ' + sel.length + ' selected row(s)?', () => {
    doc.rows = doc.rows.filter(r => !r._sel)
    void persist()
    toast('Removed ' + sel.length + ' row(s)')
  })
}
function toggleAll(e: Event) {
  const on = (e.target as HTMLInputElement).checked
  doc.rows.forEach(r => { if (pass(r)) r._sel = on })
}
function delRow(r: FuRow) {
  askConfirm('Are you sure to remove?', () => {
    doc.rows = doc.rows.filter(x => x.id !== r.id)
    void persist()
    toast('Removed')
  })
}

/* ---------- quoted / result / share ---------- */
function markQuoted(r: FuRow) {
  r.quotedAt = now()
  fuLog(r, 'Quoted')
  void persist()
  toast('Marked as Quoted')
}
function clearQuoted(r: FuRow) {
  askConfirm('Are you sure to clear?', () => {
    r.quotedAt = ''
    fuLog(r, 'QuotedDate cleared')
    void persist()
  })
}
function shareRow(r: FuRow) {
  askConfirm('Share this shipment line to OPS?', () => {
    r.sharedAt = now()
    fuLog(r, 'Shared to OPS')
    void persist()
    toast('Shared to OPS')
  })
}

/* ---------- lost modal ---------- */
const lostModal = reactive<{ open: boolean; reason: string; note: string; row: FuRow | null }>({ open: false, reason: LOST_REASONS[0]!, note: '', row: null })
function onResultChange(r: FuRow, e: Event) {
  const v = (e.target as HTMLSelectElement).value
  if (v === r.result) return
  if (v === 'Lost') {
    lostModal.reason = LOST_REASONS[0]!
    lostModal.note = ''
    lostModal.row = r
    lostModal.open = true
    return
  }
  r.result = v
  r.resultAt = v ? today() : ''
  fuLog(r, 'Result ' + (v || 'cleared'))
  void persist()
}
function confirmLost() {
  const r = lostModal.row
  lostModal.open = false
  if (!r) return
  const reason = lostModal.reason + (lostModal.note.trim() ? (' — ' + lostModal.note.trim()) : '')
  r.result = 'Lost'
  r.resultAt = today()
  r.lostReason = reason
  fuLog(r, 'Result Lost · ' + reason)
  lostModal.row = null
  void persist()
}
function cancelLost() {
  // mockup leaves the select visually unchanged until the next render; same here
  lostModal.open = false
  lostModal.row = null
}

/* ---------- demo data ---------- */
function loadDemo() {
  const go = () => {
    const t = today()
    const n9 = now()
    doc.clients = ['ABC GARMENT', 'DEF ELECTRONICS', 'GHK TRADING', 'MNP FOODS', 'XYZ CHEMICALS']
    doc.rows = [
      { id: uid(), rfq: 'RFQ16072601', inqDate: t, clientCode: 'ABC GARMENT', fullName: 'ABC GARMENT CO., LTD', pic: 'Ms. Chi', platform: 'EMAIL', from: 'SGN', to: 'LAX', details: 'FCL 2x40HC garment weekly', status: '', statusAt: '', result: '', resultAt: '', log: [n9 + ' · Inquiry created'] },
      { id: uid(), rfq: 'RFQ08072601', inqDate: '2026-07-07', clientCode: 'DEF ELECTRONICS', fullName: 'DEF ELECTRONICS VN', pic: 'Mr. Kim', platform: 'WECHAT', from: 'SGN', to: 'HKG', details: 'AIR 800kg electronics', status: 'Quoted', statusAt: '2026-07-08', quotedAt: '2026-07-08', result: '', resultAt: '', log: ['2026-07-08 10:30 · Status Quoted'] },
      { id: uid(), rfq: 'RFQ12072601', inqDate: '2026-07-12', clientCode: 'GHK TRADING', fullName: 'GHK TRADING (THAILAND)', pic: 'Ms. Mai', platform: 'ALIBABA', from: 'HPH', to: 'BKK', details: 'LCL 8 CBM housewares', status: 'Quoted', statusAt: '2026-07-13', quotedAt: '2026-07-13', result: '', resultAt: '', log: ['2026-07-13 14:00 · Status Quoted'] },
      { id: uid(), rfq: 'RFQ05072601', inqDate: '2026-07-05', clientCode: 'MNP FOODS', fullName: 'MNP FOODS JSC', pic: 'Mr. Nam', platform: 'REFERRAL', from: 'SGN', to: 'TYO', details: 'FCL reefer frozen food', status: 'Quoted', statusAt: '2026-07-06', quotedAt: '2026-07-06', result: 'Dealt', resultAt: '2026-07-09', sharedAt: n9, log: ['2026-07-06 11:00 · Status Quoted', '2026-07-09 15:40 · Result Dealt', '2026-07-16 08:00 · Shared to OPS'] },
      { id: uid(), rfq: 'RFQ02072601', inqDate: '2026-07-02', clientCode: 'MNP FOODS', fullName: 'MNP FOODS JSC', pic: 'Mr. Nam', platform: 'EMAIL', from: 'SGN', to: 'OSA', details: 'FCL 1x40RF trial', status: 'Quoted', statusAt: '2026-07-03', quotedAt: '2026-07-03', result: 'Lost', resultAt: '2026-07-11', lostReason: 'Price too high', log: ['2026-07-03 09:00 · Status Quoted', '2026-07-11 17:00 · Result Lost · Price too high'] },
    ].map(normalizeFuRow)
    void persist()
    toast('Example data loaded')
  }
  if (doc.rows.length) askConfirm('Replace current data with example data?', go)
  else go()
}

/* ---------- stats sub-tab ---------- */
type AggRow = { code: string; fullName: string; quotes: number; dealt: number; handling: number; cancel: number; done: number; [k: string]: any }
const statsRows = computed<AggRow[]>(() => {
  const map: Record<string, AggRow> = {}
  const f = statsFilter
  const hasRange = !!(f.from || f.to)
  const inR = (d: string) => { if (!d) return false; if (f.from && d < f.from) return false; if (f.to && d > f.to) return false; return true }
  doc.rows.forEach(r => {
    const code = r.clientCode
    if (!code) return
    if (!map[code]) map[code] = { code, fullName: fullNameOf(code) || r.fullName || '', quotes: 0, dealt: 0, handling: 0, cancel: 0, done: 0 }
    const e = map[code]!
    const qd = qDate(r)
    if (qd && (!hasRange || inR(qd))) e.quotes++
    if (r.result === 'Dealt' && (!hasRange || inR(r.resultAt))) e.dealt++
    if (r.result === 'Dealt' && r.sharedAt && !r.completedAt && (!hasRange || inR(r.resultAt))) e.handling++
    if (r.result === 'Lost' && /Customer cancelled/.test(r.lostReason || '') && (!hasRange || inR(r.resultAt))) e.cancel++
    if (r.completedAt && (!hasRange || inR(r.completedAt))) e.done++
  })
  let arr = Object.keys(map).map(k => map[k]!)
  if (f.code) {
    const q = f.code.toUpperCase()
    arr = arr.filter(x => x.code.toUpperCase().indexOf(q) >= 0 || x.fullName.toUpperCase().indexOf(q) >= 0)
  }
  const sk = statsSort.key, sd = statsSort.dir
  if (sk) {
    arr.sort((a, b) => {
      const av = a[sk] || 0, bv = b[sk] || 0
      let d = av - bv
      if (d === 0) d = a.code.localeCompare(b.code)
      return sd === 'asc' ? d : -d
    })
  }
  return arr
})
function sortArrow(key: string) {
  if (statsSort.key !== key) return ''
  return statsSort.dir === 'asc' ? ' ↑' : ' ↓'
}
function clickSort(key: string) {
  if (statsSort.key === key) statsSort.dir = statsSort.dir === 'asc' ? 'desc' : 'asc'
  else { statsSort.key = key; statsSort.dir = 'desc' }
}

/* ---------- client stats popup ---------- */
const cli = reactive({ open: false, code: '', from: '', to: '' })
function openClientPopup(code: string) {
  cli.code = code
  cli.from = ''
  cli.to = ''
  cli.open = true
}
const cliSubline = computed(() => {
  const tr = trader(cli.code)
  let s = fullNameOf(cli.code) || '—'
  if (tr) {
    s += ' · ' + (tr.city || '') + ' ' + (tr.country || '')
    if (tr.phone) s += ' · ' + tr.phone
    if (tr.email) s += ' · ' + tr.email
  }
  return s
})
const cliStat = computed(() => {
  const rows = doc.rows.filter(r => (r.clientCode || '').toUpperCase() === cli.code.toUpperCase())
  const noRange = !cli.from && !cli.to
  const inR = (d: string) => { if (!d) return false; if (cli.from && d < cli.from) return false; if (cli.to && d > cli.to) return false; return true }
  return {
    rows,
    quotes: rows.filter(r => qDate(r) && (noRange || inR(qDate(r)))).length,
    dealt: rows.filter(r => r.result === 'Dealt' && (noRange || inR(r.resultAt))).length,
    handling: rows.filter(r => r.result === 'Dealt' && r.sharedAt && !r.completedAt && (noRange || inR(r.resultAt))).length,
    cancel: rows.filter(r => r.result === 'Lost' && /Customer cancelled/.test(r.lostReason || '') && (noRange || inR(r.resultAt))).length,
    done: rows.filter(r => r.completedAt && (noRange || inR(r.completedAt))).length,
  }
})
function cliQuick(q: 'm' | 'y' | 'a') {
  const t = today()
  if (q === 'm') { cli.from = t.slice(0, 8) + '01'; cli.to = t }
  else if (q === 'y') { cli.from = t.slice(0, 5) + '01-01'; cli.to = t }
  else { cli.from = ''; cli.to = '' }
}

/* ---------- client pick/add popup ---------- */
const cp = reactive<{
  open: boolean; view: 'search' | 'detail' | 'add'; field: 'id' | 'namecode' | 'company'; term: string
  detail: CustRec | null; saved: CustRec | null; locked: boolean; onPick: ((rec: CustRec) => void) | null
  form: { id: string; nc: string; co: string; addr: string; city: string; cty: string; pic: string; phone: string; email: string }
}>({
  open: false, view: 'search', field: 'id', term: '', detail: null, saved: null, locked: false, onPick: null,
  form: { id: '', nc: '', co: '', addr: '', city: '', cty: '', pic: '', phone: '', email: '' },
})
function cpGenId(country: string) {
  const cc = CP_CCODE[String(country || '').toUpperCase()] || 'XX'
  const d = new Date()
  const pre = cc + p2(d.getDate()) + p2(d.getMonth() + 1) + String(d.getFullYear()).slice(2)
  let n = 1
  doc.customers.rows.forEach(r => {
    if ((r.id || '').indexOf(pre) === 0) {
      const q = parseInt((r.id || '').slice(pre.length), 10)
      if (q >= n) n = q + 1
    }
  })
  return pre + p2(n)
}
function openClientPickPopup(mode: 'pick' | 'addonly', onPick: (rec: CustRec) => void) {
  cp.onPick = onPick
  cp.term = ''
  cp.field = 'id'
  cp.detail = null
  cp.saved = null
  cp.locked = false
  cp.form = { id: '', nc: '', co: '', addr: '', city: '', cty: '', pic: '', phone: '', email: '' }
  cp.view = mode === 'addonly' ? 'add' : 'search'
  cp.open = true
}
const cpResults = computed(() => {
  const rows = doc.customers.rows
  const term = (cp.term || '').trim().toLowerCase()
  if (!term) return rows.slice(0, 30)
  return rows.filter(r => {
    const v = (cp.field === 'id' ? r.id : (cp.field === 'namecode' ? r.namecode : r.company)) || ''
    return String(v).toLowerCase().indexOf(term) >= 0
  }).slice(0, 30)
})
function cpShowDetail(r: CustRec) { cp.detail = r; cp.view = 'detail' }
function cpShowAdd() {
  cp.saved = null
  cp.locked = false
  cp.form = { id: '', nc: '', co: '', addr: '', city: '', cty: '', pic: '', phone: '', email: '' }
  cp.view = 'add'
}
function cpUse() {
  cp.open = false
  if (cp.onPick && cp.detail) cp.onPick(cp.detail)
}
function cpUpId() { cp.form.id = cp.form.cty ? cpGenId(cp.form.cty) : '' }
function cpClearForm() {
  cp.form = { id: '', nc: '', co: '', addr: '', city: '', cty: '', pic: '', phone: '', email: '' }
}
function cpSave() {
  const nc = cp.form.nc.trim().toUpperCase(), co = cp.form.co.trim(), cty = cp.form.cty.trim()
  if (!nc || !co || !cty) { toast('NameCode, Company and Country are required'); return }
  const vals = { namecode: nc, company: co, address: cp.form.addr.trim(), city: cp.form.city.trim(), country: cty.toUpperCase(), pic: cp.form.pic.trim(), phone: cp.form.phone.trim(), email: cp.form.email.trim() }
  if (!cp.saved) {
    const rec: CustRec = { id: cpGenId(cty), recdate: today(), status: 'Active', ...vals }
    doc.customers.rows.push(rec)
    cp.saved = rec
  } else {
    Object.assign(cp.saved, vals)
  }
  void persist()
  toast('CLIENT saved')
  cp.locked = true
  if (cp.onPick) cp.onPick(cp.saved)
}
function openClientPick(r: FuRow) {
  openClientPickPopup('pick', rec => {
    r.clientCode = rec.namecode || ''
    r.fullName = rec.company || r.fullName || ''
    void persist()
  })
}
function openClientAdd() {
  openClientPickPopup('addonly', rec => {
    if (rec.namecode && doc.clients.indexOf(rec.namecode) < 0) doc.clients.push(rec.namecode)
    void persist()
  })
}

/* ---------- inquiry detail popup ---------- */
const det = reactive<{ open: boolean; row: FuRow | null; inquiry: string; cost: string; quote: string; remarks: string; files: FuFile[]; edit: boolean }>({
  open: false, row: null, inquiry: '', cost: '', quote: '', remarks: '', files: [], edit: false,
})
const detInquiryEl = ref<HTMLTextAreaElement | null>(null)
const detFileEl = ref<HTMLInputElement | null>(null)
function openDet(r: FuRow) {
  if (r.details && !r.det) {
    r.det = { inquiry: r.details, cost: '', quote: '', remarks: '', files: [] }
    delete r.details
  }
  const d = r.det || ({} as Partial<FuDet>)
  det.row = r
  det.inquiry = d.inquiry || ''
  det.cost = d.cost || ''
  det.quote = d.quote || ''
  det.remarks = d.remarks || ''
  det.files = (d.files || []).map(f => ({ name: f.name }))
  det.edit = !hasDet(r)
  det.open = true
  if (det.edit) nextTick(() => detInquiryEl.value?.focus())
}
function detEdit() {
  det.edit = true
  nextTick(() => detInquiryEl.value?.focus())
}
function detSave() {
  const r = det.row
  if (!r) return
  r.det = { inquiry: det.inquiry, cost: det.cost, quote: det.quote, remarks: det.remarks, files: det.files.slice() }
  void persist()
  det.edit = false
  toast('Saved')
}
function detAddFiles(e: Event) {
  const input = e.target as HTMLInputElement
  const fs = input.files
  if (fs) for (let i = 0; i < fs.length; i++) det.files.push({ name: fs[i]!.name })
  input.value = ''
}
function detRemoveFile(i: number) {
  askConfirm('Are you sure to remove?', () => { det.files.splice(i, 1) })
}
</script>

<style scoped>
/* ===== copied verbatim from mockup style: ws, fu, wscp, wscli rules ===== */
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
.ws-chip{border:1px solid #d6ddd9;background:#fff;border-radius:14px;padding:3px 12px;font-size:11.5px;font-weight:700;color:#5a6875;cursor:pointer}
.ws-chip.on{background:#008F4C;border-color:#008F4C;color:#fff}
.fu-deal{background:#e3efe8;color:#1b6b43}.fu-lost{background:#fbd5d0;color:#a23227}
.fu-shared{font-size:11px;font-weight:800;color:#1b6b43}
.fu-qdate{font-size:11.5px;font-weight:700;color:#33413b}
.ws-subtabbar{display:flex;gap:6px;margin:2px 0 10px}
.ws-subtab{border:1px solid #d6ddd9;background:#fff;border-radius:8px;padding:6px 16px;font-size:12.5px;font-weight:700;color:#5a6875;cursor:pointer}
.ws-subtab.on{background:#008F4C;border-color:#008F4C;color:#fff}
.fu-sortth{cursor:pointer;user-select:none}
.fu-sortth:hover{color:#008F4C}
.wscp-mo{background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.3);width:460px;max-width:94vw;max-height:88vh;overflow-y:auto}
.wscp-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #e4e9ee}
.wscp-title{font-weight:800;font-size:13.5px;color:#1f2a26}
.wscp-hd .x{cursor:pointer;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;color:#fff;background:#c0392b;font-size:12.5px;font-weight:700;box-shadow:0 1px 2px rgba(0,0,0,.18)}
.wscp-searchrow{display:flex;gap:8px;padding:14px 16px 8px}
.wscp-searchrow select{border:1px solid #d6ddd9;border-radius:7px;padding:6px 7px;font-size:12px}
.wscp-searchrow input{flex:1;border:1px solid #d6ddd9;border-radius:7px;padding:6px 9px;font-size:12.5px}
.wscp-list{padding:0 16px 14px;display:flex;flex-direction:column;gap:6px;max-height:280px;overflow-y:auto}
.wscp-item{border:1px solid #e4e9ee;border-radius:8px;padding:7px 11px;cursor:pointer;display:flex;justify-content:space-between;gap:10px;font-size:12.5px}
.wscp-item:hover{background:#f4f8f5;border-color:#9ed4b5}
.wscp-item span{color:#5a6875}
.wscp-detail{padding:14px 16px}
.wscp-drow{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid #f0f3ee;font-size:12.5px}
.wscp-drow b{color:#5a6875;font-weight:700}
.wscp-usebar{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid #e4e9ee;background:#f7f9f8}
.wscp-form{padding:14px 16px}
.wscp-frow{display:flex;gap:10px;margin-bottom:10px}
.wscp-frow label{flex:1;font-size:11px;color:#5a6875;font-weight:700;display:flex;flex-direction:column;gap:4px}
.wscp-frow label.wide{flex:1 1 100%}
.wscp-frow input{border:1px solid #d6ddd9;border-radius:7px;padding:6px 9px;font:inherit;font-size:12.5px}
.wscp-frow input[readonly]{background:#f4f6f5;color:#5a6875}
.fu-hplus{width:18px;height:18px;border-radius:50%;border:none;background:#008F4C;color:#fff;font-weight:800;font-size:12px;cursor:pointer;padding:0;margin:0;vertical-align:middle;display:inline-flex;align-items:center;justify-content:center;line-height:1}
.fu-hplus:hover{background:#04793f}
.fu-sel{width:15px;height:15px}
.fu-cellin{border:none!important;background:transparent;width:100%;height:100%;box-sizing:border-box;padding:7px 8px;font:inherit;font-size:12.5px;outline:none;border-radius:0}
.fu-cellin:focus{background:#fff;box-shadow:inset 0 0 0 2px #008F4C}
.fu-cellin:disabled{background:#f4f6f5;color:#8a94a0;cursor:not-allowed}
.ws-meettbl td:has(> .fu-cellin){padding:0}
.fu-tbl th,.fu-tbl td{text-align:center}
.fu-tbl .fu-cellin{text-align:center}
.fu-cclink{color:#1f4ed8;text-decoration:underline;cursor:pointer;font-weight:700;font-size:12.5px}
.fu-ccpen{font-size:11px;opacity:.55;padding:1px 3px}
.fu-cctd:hover .fu-ccpen{opacity:1}
.fu-detbtn{border:none;border-radius:7px;padding:4px 12px;font-weight:800;font-size:10.5px;cursor:pointer;background:#008F4C;color:#fff}
.fu-detbtn:hover{background:#04793f}
.fu-detbtn.det{background:#0f4c81}
.fu-detbtn.det:hover{background:#0c3d68}
.fu-stwrap{display:flex;align-items:center;justify-content:flex-start;gap:6px;white-space:nowrap;padding:0 6px;min-height:30px}
.fu-stsel{box-sizing:border-box;border:1px solid #d6ddd9;border-radius:7px;padding:5px 16px 5px 8px;font-size:11.5px;font-weight:700;background-color:#fff;width:86px;height:26px;line-height:normal;flex:0 0 86px;display:inline-flex;align-items:center;text-align:center;text-align-last:center;-moz-text-align-last:center;appearance:none;-webkit-appearance:none;-moz-appearance:none;cursor:pointer;background-repeat:no-repeat;background-position:right 7px center;background-size:9px 6px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235a6875' stroke-width='1.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")}
.fu-stsel.fu-deal{background-color:#e3efe8;border-color:#9ed4b5;color:#1b6b43}
.fu-stsel.fu-lost{background-color:#fbd5d0;border-color:#e5a49c;color:#a23227}
.fu-stdate{font-size:10.5px;font-weight:700;color:#5a6875}
.fu-fin{border:1px solid #d6ddd9;border-radius:7px;padding:5px 8px;font-size:12px}
.fu-fsep{width:1px;height:22px;background:#dfe5ea;margin:0 2px}
.wscli-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.wscli-tile{border:1px solid #e4e9ee;border-radius:10px;padding:12px 8px;text-align:center;background:#fbfcfb}
.wscli-num{font-size:20px;font-weight:800;color:#1f2a26}
.wscli-lbl{font-size:10.5px;font-weight:700;color:#5a6875;margin-top:3px}
.wscli-tile.q{background:#fdf3e7}.wscli-tile.d{background:#e3efe8}.wscli-tile.h{background:#e9f1fd}.wscli-tile.c{background:#fbd5d0}.wscli-tile.ok{background:#eef1f7}
.ws-placeholder{color:#8a94a0;text-align:center;padding:48px 0;font-size:13px}
.ws-scroll{overflow-x:auto}
.ws-meettbl{min-width:1380px}
.ws-meettbl td{text-align:center}
.ws-meettbl input,.ws-meettbl select{text-align:center}
.ws-tbl select{cursor:pointer}
.ws-sticky1{position:sticky;left:0;z-index:3;background:#fff}
th.ws-sticky1{background:#f0f3ee;z-index:4}

/* ===== detail popup (mockup #wsFuDetOv rules, id selectors → classes) ===== */
.detov{position:fixed;inset:0;background:rgba(10,30,18,.42);display:flex;align-items:center;justify-content:center;z-index:98;padding:24px;overflow:auto}
.detov .mo3{background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.3);width:1040px;max-width:94vw;max-height:calc(100vh - 56px);display:flex;flex-direction:column}
.detov .hd3{display:flex;justify-content:flex-end;padding:10px 12px 0}
.detov .hd3 .x{cursor:pointer;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;color:#fff;background:#c0392b;font-size:17px;line-height:1;box-shadow:0 1px 3px rgba(0,0,0,.25)}
.detov .bd3{padding:2px 20px 8px;overflow:auto}
.detov .dsec{margin-bottom:16px}
.detov .dcols{display:flex;gap:16px}
.detov .dcols .dsec{flex:1}
.detov .dlbl{font-size:12px;font-weight:750;color:#1f2a26;letter-spacing:.02em;margin-bottom:6px}
.detov .dta{width:100%;box-sizing:border-box;border:1px solid #cfd8d2;border-radius:8px;padding:9px 11px;font:inherit;font-size:13px;color:#33413b;outline:none;resize:vertical;background:#fff}
.detov .dta[readonly]{background:#f6f8f7;color:#5a6875}
.detov .dta-sm{height:84px}
.detov .dta-lg{height:230px}
.detov .foot3{display:flex;justify-content:flex-end;gap:8px;padding:12px 18px;border-top:1px solid #e4e9ee;background:#f7f9f8}
.detov .dlattach{display:inline-flex;align-items:center;gap:7px;background:#008F4C;color:#fff;border:1px solid #008F4C;border-radius:7px;padding:7px 14px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}
.detov .dlattach:hover{background:#007a40;border-color:#007a40}
.detov .dlattach:disabled{opacity:.45;pointer-events:none}
.detov .dfattach{display:block;margin-top:2px}
.detov .dfiles{display:flex;flex-direction:column;gap:6px;margin-top:9px}
.detov .dfrow{display:flex;align-items:center;gap:9px;background:#f7f9f8;border:1px solid #e4e9ee;border-radius:7px;padding:5px 7px 5px 10px}
.detov .dficon{font-size:14px;flex:0 0 auto}
.detov .dfname{flex:1;min-width:0;border:1px solid #cfd8d2;border-radius:6px;padding:5px 9px;font:inherit;font-size:12.5px;color:#1f2a26;background:#fff;outline:none}
.detov .dfname:focus{box-shadow:inset 0 0 0 2px #008F4C}
.detov .dfname[readonly]{background:#f7f9f8;color:#5a6875;cursor:default;box-shadow:none}
.detov .dfx{width:22px;height:22px;flex:0 0 auto;border:none;border-radius:50%;background:#c0392b;color:#fff;font-size:11px;font-weight:700;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px rgba(0,0,0,.18)}
.detov .dfx:hover{background:#a23227}

/* ===== overlays (mockup inline overlay styles) ===== */
.cliov{position:fixed;inset:0;background:rgba(10,30,18,.42);display:flex;align-items:center;justify-content:center;z-index:98;padding:24px}
.cli-mo{background:#fff;border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:22px 26px;width:640px;max-width:94vw;max-height:90vh;overflow-y:auto;position:relative}
.cli-x{position:absolute;top:12px;right:12px;width:24px;height:24px;border-radius:50%;border:none;background:#c0392b;color:#fff;font-weight:700;font-size:12.5px;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.18)}
.cpov{position:fixed;inset:0;background:rgba(10,30,18,.42);display:flex;align-items:center;justify-content:center;z-index:99;padding:24px}

/* ===== confirm modal (mockup wsConfirm, line 4062) ===== */
.mov{position:fixed;inset:0;background:rgba(10,30,18,.42);display:flex;align-items:center;justify-content:center;z-index:600;padding:24px}
.mov-box{background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.3);padding:22px 26px;min-width:280px;text-align:center}
.mov-msg{font-weight:700;font-size:13.5px;color:#33413b;margin-bottom:16px}
.mov-btns{display:flex;gap:10px;justify-content:center}

/* ===== toast ===== */
.fu-toast{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#0f3d23;color:#fff;padding:10px 16px;border-radius:8px;font-size:12.5px;font-weight:600;z-index:700;box-shadow:0 8px 24px rgba(0,0,0,.25)}
</style>
