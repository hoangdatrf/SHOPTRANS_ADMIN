<template>
  <div class="si-form-root">
    <!-- SI Form content -->
    <div v-show="!showSubmitNotice">
    <!-- Header -->
    <div class="si-header">
      <div class="si-title">Shipping Instruction</div>
      <div style="height:28px"></div>
      <div class="si-ref">
        Reference: <a class="si-ref-link">{{ refNo }}</a>
        <span v-if="freightType" :class="freightType === 'LCL' ? 'si-type-badge lcl' : 'si-type-badge fcl'">{{ freightType }}</span>
      </div>
    </div>

    <!-- BL Type tabs (only for mbl-hbl mode) -->
    <div v-if="mode === 'mbl-hbl'" class="doc-tabs-wrap" style="margin-bottom:12px">
      <button type="button" class="doc-tab" :class="{ act: blTab === 'mbl' }" @click="switchBlTab('mbl')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>
        Master Bill of Lading
        <span class="bl-badge" :style="{ background: blTab === 'mbl' ? 'rgba(255,255,255,0.25)' : 'var(--green-dk)' }">MBL</span>
      </button>
      <button type="button" class="doc-tab" :class="{ act: blTab === 'hbl' }" @click="switchBlTab('hbl')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>
        House Bill of Lading
        <span class="bl-badge" :style="{ background: blTab === 'hbl' ? 'rgba(255,255,255,0.25)' : 'var(--green-dk)' }">HBL</span>
      </button>
    </div>

    <!-- Doc submission tabs -->
    <div class="doc-tabs-wrap">
      <button type="button" class="doc-tab" :class="{ act: docMode === 'fill' }" @click="docMode='fill'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Submit by filling in detailed information
      </button>
      <button type="button" class="doc-tab" :class="{ act: docMode === 'attach' }" @click="docMode='attach'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        Submit with attached files
      </button>
    </div>

    <!-- FILL IN PANEL -->
    <div v-show="docMode === 'fill'">
      <!-- Parties card -->
      <div class="si-card">
        <div class="si-card-hd" :class="freightType === 'LCL' ? 'si-card-hd-lcl' : 'si-card-hd-fcl'"><span class="si-card-title">Parties</span></div>
        <div class="party-grid">
          <div class="party-cell">
            <div class="party-lbl">Shipper</div>
            <div class="party-sub">name / address / phone / email / tax ID</div>
            <textarea class="party-ta" v-model="form[blTab].shipper" placeholder="Input content here"></textarea>
          </div>
          <div class="party-cell">
            <div class="party-lbl">Consignee</div>
            <div class="party-sub">name / address / phone / email / tax ID</div>
            <textarea class="party-ta" v-model="form[blTab].consignee" placeholder="Input content here"></textarea>
          </div>
          <div class="party-cell">
            <div class="party-lbl">Notifier</div>
            <div class="party-sub">name / address / phone / email / tax ID</div>
            <textarea class="party-ta" v-model="form[blTab].notifier" placeholder="Input content here"></textarea>
          </div>
          <div class="party-cell">
            <div class="party-lbl">Destination Agent</div>
            <div class="party-sub">name / address / phone / fax / email</div>
            <label v-if="mode === 'mbl-hbl' && blTab === 'hbl'" class="same-mbl-label">
              <input type="checkbox" v-model="sameAsMblConsignee" @change="onSameAsMbl" class="same-mbl-chk"> SAME AS MBL CONSIGNEE
            </label>
            <textarea class="party-ta" v-model="form[blTab].destAgent" placeholder="Input content here"></textarea>
          </div>
        </div>
      </div>

      <!-- Freight type & Routing card -->
      <div class="si-card">
        <div class="si-card-hd" :class="freightType === 'LCL' ? 'si-card-hd-lcl' : 'si-card-hd-fcl'"><span class="si-card-title">Freight type &amp; Routing</span></div>
        <div style="padding:16px 18px 14px;border-bottom:1px solid var(--gray-200)">
          <table class="ft-table">
            <thead><tr>
              <th style="text-align:center;width:20%">Freight type</th>
              <th style="width:20%">Original B/L</th><th style="width:20%">Surrender B/L</th>
              <th style="width:20%">Seaway B/L</th><th style="width:20%">e-B/L</th>
            </tr></thead>
            <tbody><tr>
              <td class="ft-lbl" style="text-align:center">
                <div style="display:inline-flex;flex-direction:column;gap:6px;align-items:flex-start">
                  <label class="ft-radio-label"><input type="radio" :name="'freight-type-'+blTab" value="prepaid" v-model="form[blTab].freightType" class="ft-chk"> Freight Prepaid</label>
                  <label class="ft-radio-label"><input type="radio" :name="'freight-type-'+blTab" value="collect" v-model="form[blTab].freightType" class="ft-chk"> Freight Collect</label>
                </div>
              </td>
              <td><input type="radio" :name="'bl-type-'+blTab" value="original" v-model="form[blTab].blType" class="ft-chk"></td>
              <td><input type="radio" :name="'bl-type-'+blTab" value="surrender" v-model="form[blTab].blType" class="ft-chk"></td>
              <td><input type="radio" :name="'bl-type-'+blTab" value="seaway" v-model="form[blTab].blType" class="ft-chk"></td>
              <td><input type="radio" :name="'bl-type-'+blTab" value="ebl" v-model="form[blTab].blType" class="ft-chk"></td>
            </tr></tbody>
          </table>
        </div>
        <div class="route-grid">
          <div class="route-cell"><div class="route-lbl">Pre-carriage by</div><input class="route-inp" v-model="form[blTab].route[0]" placeholder="Enter vessel/truck…"></div>
          <div class="route-cell"><div class="route-lbl">Place of Receipt</div><input class="route-inp" v-model="form[blTab].route[1]" placeholder="Enter Place of Receipt"></div>
          <div class="route-cell"><div class="route-lbl">Vessel / Voy. No.</div><input class="route-inp" v-model="form[blTab].route[2]" placeholder="Enter Vessel / Voy. No."></div>
          <div class="route-cell"><div class="route-lbl">Port of Loading</div><input class="route-inp" v-model="form[blTab].route[3]" placeholder="Enter Port of Loading"></div>
          <div class="route-cell last-row"><div class="route-lbl">Port of Discharge</div><input class="route-inp" v-model="form[blTab].route[4]" placeholder="Enter Port of Discharge"></div>
          <div class="route-cell last-row"><div class="route-lbl">Place of Delivery</div><input class="route-inp" v-model="form[blTab].route[5]" placeholder="Enter Place of Delivery"></div>
        </div>
      </div>

      <!-- Cargo description card -->
      <div class="si-card">
        <div class="si-card-hd" :class="freightType === 'LCL' ? 'si-card-hd-lcl' : 'si-card-hd-fcl'"><span class="si-card-title">Cargo Description</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 2fr;border-bottom:1.5px solid var(--gray-200)">
          <div class="cargo-col-hd">Marks &amp; Nos.</div>
          <div class="cargo-col-hd">Quantity &amp; Kind of Packages</div>
          <div class="cargo-col-hd" style="border-right:none">Description of Goods</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 2fr">
          <div class="cargo-col-body"><textarea class="cargo-ta" v-model="form[blTab].cargoMarks" placeholder="Enter shipping marks…"></textarea></div>
          <div class="cargo-col-body"><textarea class="cargo-ta" v-model="form[blTab].cargoQty" placeholder="Enter quantity and package type…"></textarea></div>
          <div class="cargo-col-body" style="border-right:none"><textarea class="cargo-ta" v-model="form[blTab].cargoDesc" placeholder="Enter description of goods…"></textarea></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 2fr;border-top:1px solid var(--gray-200)">
          <div class="cargo-footer-cell">Total Gross Weight (KGS)<input class="cargo-inp" v-model="form[blTab].cargoGw" placeholder="0.00"></div>
          <div class="cargo-footer-cell">Total Measurement (M3)<input class="cargo-inp" v-model="form[blTab].cargoM3" placeholder="0.00"></div>
          <div class="cargo-footer-cell" style="border-right:none;justify-content:flex-end;align-items:center;display:flex">
            <button type="button" class="attach-btn" @click="openAttachSheet">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              Attach Sheet
            </button>
          </div>
        </div>
        <!-- Sheet chips -->
        <div v-if="form[blTab].sheetFiles.length" class="sheet-chips-zone">
          <div v-for="(f, i) in form[blTab].sheetFiles" :key="i" class="sheet-chip">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--green-dk)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span class="sheet-chip-name">{{ f }}</span>
            <button class="sheet-chip-x" @click="form[blTab].sheetFiles.splice(i, 1)">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <!-- CNTR section -->
        <div class="cntr-hd">
          <span class="cntr-label">CNTR No. / Seal No.</span>
          <div class="cntr-btns">
            <button type="button" class="cntr-add" @click="addCntrRow">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add
            </button>
            <button type="button" class="cntr-del" :disabled="!hasCheckedCntr" @click="delCntrRows">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg> Del
            </button>
          </div>
        </div>
        <div style="overflow-x:auto">
          <table class="cntr-table">
            <thead><tr>
              <th style="width:32px"><input type="checkbox" v-model="cntrCheckAll" @change="toggleAllCntr" class="cntr-chk-all"></th>
              <th>Size</th><th>Type</th><th>CTNR No.</th><th>Seal No.</th>
              <th>Quantity</th>
              <th style="position:relative">
                Unit
                <button type="button" class="unit-add-hdr-btn" @click.stop="showUnitAddPanel = !showUnitAddPanel">+ Add</button>
                <div v-if="showUnitAddPanel" class="unit-add-panel" @click.stop>
                  <div style="display:flex;align-items:center;gap:7px">
                    <input class="cntr-inp" v-model="newUnitName" placeholder="New unit name" style="width:150px;font-size:11px" @keydown.enter="saveNewUnit">
                    <button class="unit-add-save" @click="saveNewUnit">Save</button>
                    <button class="unit-add-cancel" @click="showUnitAddPanel=false">Cancel</button>
                  </div>
                </div>
              </th>
              <th>G.W (kg)</th><th>Meas. (m³)</th><th>VGM (kg)</th>
            </tr></thead>
            <tbody>
              <tr v-for="(row, i) in form[blTab].cntrRows" :key="i">
                <td><input type="checkbox" v-model="row.checked" class="cntr-row-chk"></td>
                <td><select class="cntr-sel" v-model="row.size"><option value="20">20'</option><option value="40">40'</option><option value="45">45'</option></select></td>
                <td><select class="cntr-sel" v-model="row.type"><option>GP</option><option>HC</option><option>RF</option><option>OT</option><option>FR</option></select></td>
                <td><input class="cntr-inp" v-model="row.ctnr" placeholder="Container No." style="width:200px"></td>
                <td><input class="cntr-inp" v-model="row.seal" placeholder="Seal No." style="width:170px"></td>
                <td><input class="cntr-inp" v-model="row.qty" placeholder="Quantity" style="width:90px"></td>
                <td>
                  <div class="unit-dd" :class="{ open: openUnitDdIdx === i }" @click.stop="toggleUnitDd(i, $event)">
                    <span class="unit-dd-val">{{ getUnitLabel(row.unitIdx, row.qty) }}</span>
                    <span class="unit-dd-arr">▲</span>
                    <div v-if="openUnitDdIdx === i" class="unit-dd-list" :style="unitDdStyle">
                      <div v-for="(u, ui) in allUnits" :key="ui" class="unit-dd-item" @mousedown.prevent.stop="selectUnit(row, ui)">
                        <span style="flex:1">{{ getUnitLabel(ui, row.qty) }}</span>
                        <button v-if="ui >= BASE_UNITS.length" class="unit-dd-item-del" @mousedown.prevent.stop="removeCustomUnit(ui)">✕</button>
                      </div>
                    </div>
                  </div>
                </td>
                <td><input class="cntr-inp" v-model="row.gw" placeholder="G.W" style="width:120px"></td>
                <td><input class="cntr-inp" v-model="row.meas" placeholder="Meas." style="width:105px"></td>
                <td><input class="cntr-inp" v-model="row.vgm" placeholder="VGM" style="width:120px"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Actions -->
      <div class="si-actions">
        <button type="button" class="si-back" @click="$emit('back')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg> Back
        </button>
        <button type="button" class="btn-cancel-si" @click="clearForm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="4.9" y1="4.9" x2="19.1" y2="19.1"/></svg> Cancel
        </button>
        <button type="button" class="btn-submit-si" @click="onSubmit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> SUBMIT
        </button>
      </div>
    </div>

    <!-- ATTACH FILES PANEL -->
    <div v-show="docMode === 'attach'">
      <div class="si-card">
        <div class="si-card-hd" :class="freightType === 'LCL' ? 'si-card-hd-lcl' : 'si-card-hd-fcl'" style="justify-content:space-between">
          <span class="si-card-title">Attach SI Document</span>
          <button type="button" class="attach-add-btn" @click="addAttachFileRow">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add File
          </button>
        </div>
        <div style="padding:0">
          <div class="attach-hdr"><span>Document Name</span><span>File</span><span style="width:60px;text-align:center">Action</span></div>
          <div v-if="form[blTab].attachFiles.length">
            <div v-for="(af, i) in form[blTab].attachFiles" :key="i" class="attach-row">
              <div><input type="text" v-model="af.name" class="attach-name-inp" placeholder="Document name…"></div>
              <div class="attach-file-wrap">
                <button class="attach-choose-btn" @click="pickFile(i)">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> Choose
                </button>
                <span class="attach-file-label" :style="{ color: af.fileName ? 'var(--dark)' : 'var(--gray-lt)' }">{{ af.fileName || 'No file chosen' }}</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:center;width:60px">
                <button class="attach-del-btn" @click="form[blTab].attachFiles.splice(i, 1)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="attach-empty">
            <div style="font-size:28px;margin-bottom:8px">📎</div>
            No files attached. Click <strong>Add File</strong> to begin.
          </div>
        </div>
      </div>
      <div class="si-actions">
        <button type="button" class="si-back" @click="$emit('back')">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg> Back
        </button>
        <button type="button" class="btn-cancel-si" @click="clearForm">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="4.9" y1="4.9" x2="19.1" y2="19.1"/></svg> Cancel
        </button>
        <button type="button" class="btn-submit-si">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> SUBMIT
        </button>
      </div>
    </div>

    </div><!-- /v-show !showSubmitNotice -->

    <!-- SUBMISSION NOTICE (inline, replaces form) -->
    <div v-if="showSubmitNotice" class="sn-wrap">
      <div class="sn-card">
        <div class="sn-header">
          <div class="sn-header-inner">
            <div>
              <div class="sn-pill"><span class="sn-live-dot"></span><span>Submission Confirmed</span></div>
              <div class="sn-title">Shipping Instruction<br>Submission Notice</div>
            </div>
            <div class="sn-icon-box">📦</div>
          </div>
        </div>
        <div class="sn-body">
          <div class="sn-msg-block">
            <div class="sn-check-badge"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
            <div class="sn-msg-text">
              Thank you for submitting the SI for shipment
              <a class="sn-ship-chip">{{ refNo }}</a>.
              The bill of lading for this shipment will be sent to you once it is available.
              Please review the options below for your further action.
              <div class="sn-sub-note">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                Bill of lading will be sent to your registered email automatically.
              </div>
            </div>
          </div>
          <div class="sn-divider"><div class="sn-div-line"></div><div class="sn-div-label">Quick Actions</div><div class="sn-div-line"></div></div>
          <div class="sn-actions-row">
            <NuxtLink to="/fcl" class="sn-action-btn"><div class="sn-icon-wrap sn-icon-red"><div class="sn-q-box">Q</div></div><div class="sn-btn-label">FCL Instant<br>Quotation</div></NuxtLink>
            <NuxtLink to="/lcl" class="sn-action-btn"><div class="sn-icon-wrap sn-icon-red"><div class="sn-q-box">Q</div></div><div class="sn-btn-label">LCL Instant<br>Quotation</div></NuxtLink>
            <NuxtLink to="/quote-request" class="sn-action-btn"><div class="sn-icon-wrap sn-icon-red"><div class="sn-q-box">Q</div></div><div class="sn-btn-label">Air Instant<br>Quotation</div></NuxtLink>
            <NuxtLink to="/products" class="sn-action-btn"><div class="sn-icon-wrap sn-icon-red"><span class="sn-p-letter">P</span></div><div class="sn-btn-label">Products</div></NuxtLink>
            <NuxtLink to="/solutions" class="sn-action-btn"><div class="sn-icon-wrap sn-icon-red-outline"><span class="sn-s-letter">S</span></div><div class="sn-btn-label">Solutions</div></NuxtLink>
          </div>
        </div>
        <div class="sn-footer">
          <div class="sn-footer-right">Submitted · Just now</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const props = defineProps<{ refNo: string; mode?: 'mbl-hbl' | 'mbl-only'; freightType?: 'FCL' | 'LCL' | '' }>()
const emit = defineEmits<{ (e: 'back'): void }>()

const blTab = ref<'mbl' | 'hbl'>('mbl')
const docMode = ref<'fill' | 'attach'>('fill')
const sameAsMblConsignee = ref(false)
const cntrCheckAll = ref(false)
const showSubmitNotice = ref(false)

function onSubmit() {
  showSubmitNotice.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
// Unit dropdown system (matching reference HTML)
const BASE_UNITS = [
  { s: 'PALLET',  p: 'PALLETS'  },
  { s: 'CARTON',  p: 'CARTONS'  },
  { s: 'PACKAGE', p: 'PACKAGES' },
  { s: 'BAG',     p: 'BAGS'     },
  { s: 'BOX',     p: 'BOXES'    },
]
const customUnits = ref<{ s: string; p: string }[]>([])
const allUnits = computed(() => [...BASE_UNITS, ...customUnits.value])
const openUnitDdIdx = ref<number | null>(null)
const unitDdStyle = ref<Record<string, string>>({})
const showUnitAddPanel = ref(false)
const newUnitName = ref('')

function getUnitLabel(unitIdx: number, qty: string) {
  const u = allUnits.value[unitIdx] || allUnits.value[0]
  const n = parseFloat(qty)
  return (isNaN(n) || n !== 1) ? u.p : u.s
}

function toggleUnitDd(rowIdx: number, e: MouseEvent) {
  if (openUnitDdIdx.value === rowIdx) {
    openUnitDdIdx.value = null
    return
  }
  openUnitDdIdx.value = rowIdx
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  unitDdStyle.value = {
    position: 'fixed',
    left: rect.left + 'px',
    minWidth: rect.width + 'px',
    top: (rect.top - 4) + 'px',
    transform: 'translateY(-100%)',
  }
}

function selectUnit(row: any, unitIdx: number) {
  row.unitIdx = unitIdx
  openUnitDdIdx.value = null
}

function removeCustomUnit(idx: number) {
  customUnits.value.splice(idx - BASE_UNITS.length, 1)
}

function saveNewUnit() {
  const val = newUnitName.value.trim().toUpperCase()
  if (!val) return
  const plural = val.endsWith('S') ? val : val + 'S'
  if (!customUnits.value.some(u => u.s === val || u.p === val)) {
    customUnits.value.push({ s: val, p: plural })
  }
  newUnitName.value = ''
  showUnitAddPanel.value = false
}

import { onMounted, onUnmounted } from 'vue'
function onDocClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.unit-dd')) openUnitDdIdx.value = null
  if (!(e.target as HTMLElement).closest('.unit-add-panel') && !(e.target as HTMLElement).closest('.unit-add-hdr-btn')) showUnitAddPanel.value = false
}
onMounted(() => document.addEventListener('mousedown', onDocClick))
onUnmounted(() => document.removeEventListener('mousedown', onDocClick))

function makeCntrRow() {
  return { checked: false, size: '20', type: 'GP', ctnr: '', seal: '', qty: '', unitIdx: 0, gw: '', meas: '', vgm: '' }
}
function makeFormData() {
  return {
    shipper: '', consignee: '', notifier: '', destAgent: '',
    freightType: 'prepaid', blType: 'original',
    route: ['', '', '', '', '', ''],
    cargoMarks: '', cargoQty: '', cargoDesc: '', cargoGw: '', cargoM3: '',
    sheetFiles: [] as string[], cntrRows: [makeCntrRow()],
    attachFiles: [] as { name: string; fileName: string }[],
  }
}

const form = reactive({ mbl: makeFormData(), hbl: makeFormData() })
const hasCheckedCntr = computed(() => form[blTab.value].cntrRows.some(r => r.checked))

function switchBlTab(tab: 'mbl' | 'hbl') {
  if (tab === blTab.value) return
  blTab.value = tab
  if (tab === 'hbl') syncHblFromMbl()
}
function syncHblFromMbl() {
  const m = form.mbl; const h = form.hbl
  for (let i = 0; i < 6; i++) { if (!h.route[i]) h.route[i] = m.route[i] }
  if (!h.cargoMarks) h.cargoMarks = m.cargoMarks
  if (!h.cargoQty) h.cargoQty = m.cargoQty
  if (!h.cargoDesc) h.cargoDesc = m.cargoDesc
  if (!h.cargoGw) h.cargoGw = m.cargoGw
  if (!h.cargoM3) h.cargoM3 = m.cargoM3
}
function onSameAsMbl() { if (sameAsMblConsignee.value) form.hbl.destAgent = form.mbl.consignee }
function addCntrRow() { form[blTab.value].cntrRows.push(makeCntrRow()) }
function delCntrRows() {
  form[blTab.value].cntrRows = form[blTab.value].cntrRows.filter(r => !r.checked)
  if (!form[blTab.value].cntrRows.length) form[blTab.value].cntrRows.push(makeCntrRow())
  cntrCheckAll.value = false
}
function toggleAllCntr() { form[blTab.value].cntrRows.forEach(r => r.checked = cntrCheckAll.value) }
function openAttachSheet() {
  const fi = document.createElement('input')
  fi.type = 'file'; fi.accept = '.pdf,.xlsx,.xls,.docx,.doc,.png,.jpg'; fi.style.display = 'none'
  fi.onchange = () => { if (fi.files?.[0]) form[blTab.value].sheetFiles.push(fi.files[0].name); fi.remove() }
  document.body.appendChild(fi); fi.click()
}
function addAttachFileRow() { form[blTab.value].attachFiles.push({ name: '', fileName: '' }) }
function pickFile(idx: number) {
  const fi = document.createElement('input')
  fi.type = 'file'; fi.accept = '.pdf,.docx,.doc,.xlsx,.xls,.png,.jpg'; fi.style.display = 'none'
  fi.onchange = () => {
    if (fi.files?.[0]) { const af = form[blTab.value].attachFiles[idx]; af.fileName = fi.files[0].name; if (!af.name) af.name = fi.files[0].name.replace(/\.[^.]+$/, '') }
    fi.remove()
  }
  document.body.appendChild(fi); fi.click()
}
function clearForm() { form[blTab.value] = makeFormData() as any }
</script>

<style scoped>
/* HEADER */
.si-header { position: relative; display: flex; align-items: flex-start; flex-direction: column; gap: 4px; margin-bottom: 14px; }
.si-title { position: absolute; left: 50%; transform: translateX(-50%); white-space: nowrap; font-size: 20px; font-weight: 800; color: var(--dark); letter-spacing: .06em; text-transform: uppercase; }
.si-ref { font-size: 20px; font-weight: 800; color: var(--dark); }
.si-ref-link { color: var(--green-dk); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }


/* DOC TABS */
.doc-tabs-wrap { background: #fff; border: 1.5px solid var(--gray-200); border-radius: 10px; overflow: hidden; display: flex; margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
.doc-tab { flex: 1; padding: 11px 20px; font-size: 13px; font-weight: 700; text-align: center; cursor: pointer; transition: all .2s; color: var(--gray); background: #fff; border: none; font-family: inherit; line-height: 1.5; margin: 0; }
.doc-tab.act { background: var(--green-dk); color: #fff; }
.doc-tab:not(.act):hover { background: var(--green-lt); color: var(--green-dk); }
.bl-badge { margin-left: 8px; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 800; color: #fff; letter-spacing: .04em; }

/* SI CARD */
.si-card { background: #fff; border: 1.5px solid var(--gray-200); border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.05); margin-bottom: 14px; }
.si-card-title { font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }

/* Freight type badge next to reference number */
.si-type-badge { display: inline-block; margin-left: 10px; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; vertical-align: middle; letter-spacing: .06em; }
.si-type-badge.fcl { background: var(--green-dk); color: #fff; }
.si-type-badge.lcl { background: #0284c7; color: #fff; }

/* Card header variants */
.si-card-hd { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; }
.si-card-hd-fcl { background: var(--green); }
.si-card-hd-fcl .si-card-title { color: #fff; }
.si-card-hd-lcl { background: var(--green-lt); border-bottom: 1.5px solid var(--green-200); }
.si-card-hd-lcl .si-card-title { color: #2d8653; }

/* Parties */
.party-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.party-cell { padding: 14px 18px; border-right: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200); }
.party-cell:nth-child(2n) { border-right: none; }
.party-cell:nth-last-child(-n+2) { border-bottom: none; }
.party-lbl { font-size: 10px; font-weight: 800; color: #2d8653; letter-spacing: .07em; text-transform: uppercase; margin-bottom: 6px; }
.party-sub { font-size: 9px; color: var(--gray-lt); font-weight: 500; margin-bottom: 8px; }
.party-ta { width: 100%; min-height: 70px; border: 1.5px solid var(--gray-200); border-radius: 7px; padding: 8px 10px; font-family: inherit; font-size: 12px; color: var(--dark); resize: vertical; outline: none; transition: border-color .15s; background: var(--gray-50); line-height: 1.55; }
.party-ta:focus { border-color: var(--green-200); background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,.08); }
.party-ta::placeholder { color: var(--gray-lt); font-size: 11px; }
.same-mbl-label { display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px 2px; font-size: 10px; font-weight: 700; color: var(--green-dk); cursor: pointer; user-select: none; }
.same-mbl-chk { width: 13px; height: 13px; accent-color: var(--green-dk); cursor: pointer; }

/* Freight table */
.ft-table { width: 100%; border-collapse: collapse; }
.ft-table th { background: var(--gray-50); border: 1px solid var(--gray-200); padding: 8px 12px; font-size: 11px; font-weight: 800; color: var(--gray); text-align: center; letter-spacing: .06em; text-transform: uppercase; vertical-align: middle; }
.ft-table td { border: 1px solid var(--gray-200); padding: 10px 12px; font-size: 11px; font-weight: 700; text-align: center; vertical-align: middle; }
.ft-table td.ft-lbl { text-align: left; background: var(--gray-50); font-size: 10px; color: var(--dark); }
.ft-chk { width: 16px; height: 16px; accent-color: var(--green-dk); cursor: pointer; vertical-align: middle; }
.ft-radio-label { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 11px; font-weight: 700; }

/* Routing */
.route-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.route-cell { padding: 12px 18px; border-right: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200); display: flex; flex-direction: column; gap: 6px; }
.route-cell:nth-child(2n) { border-right: none; }
.route-cell.last-row { border-bottom: none; }
.route-lbl { font-size: 9px; font-weight: 700; color: var(--gray-lt); text-transform: uppercase; letter-spacing: .06em; white-space: nowrap; }
.route-inp { width: 100%; border: 1.5px solid var(--gray-200); border-radius: 6px; background: var(--gray-50); font-family: inherit; font-size: 13px; font-weight: 700; color: var(--dark); outline: none; padding: 6px 9px; transition: border-color .15s, background .15s; }
.route-inp:hover { border-color: var(--green-200); background: #fff; }
.route-inp:focus { border-color: var(--green-dk); background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,.08); }
.route-inp::placeholder { color: var(--gray-lt); font-weight: 400; font-size: 12px; }

/* Cargo */
.cargo-col-hd { padding: 10px 14px; background: var(--gray-50); border-right: 1px solid var(--gray-200); font-size: 11px; font-weight: 800; color: var(--gray); letter-spacing: .06em; text-transform: uppercase; }
.cargo-col-body { padding: 10px 14px; border-right: 1px solid var(--gray-200); min-height: 110px; }
.cargo-ta { width: 100%; min-height: 100px; border: 1.5px solid var(--gray-200); border-radius: 0; background: var(--gray-50); font-family: inherit; font-size: 12px; color: var(--dark); resize: vertical; outline: none; line-height: 1.55; padding: 8px 10px; transition: border-color .15s, background .15s; }
.cargo-ta:hover { border-color: var(--green-200); background: #fff; }
.cargo-ta:focus { border-color: var(--green-dk); background: #fff; }
.cargo-ta::placeholder { color: var(--gray-lt); font-size: 11px; }
.cargo-footer-cell { padding: 10px 14px; border-right: 1px solid var(--gray-200); font-size: 10px; font-weight: 700; color: var(--gray); text-transform: uppercase; letter-spacing: .04em; }
.cargo-inp { width: 100%; border: 1.5px solid var(--gray-200); border-radius: 6px; background: var(--gray-50); font-family: inherit; font-size: 13px; font-weight: 600; color: var(--dark); outline: none; padding: 5px 8px; margin-top: 5px; }
.cargo-inp:hover { border-color: var(--green-200); background: #fff; }
.cargo-inp:focus { border-color: var(--green-dk); background: #fff; box-shadow: 0 0 0 3px rgba(22,163,74,.08); }
.attach-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 7px; border: 1.5px solid var(--green-200); background: var(--green-lt); font-family: inherit; font-size: 11px; font-weight: 700; color: var(--green-dk); cursor: pointer; transition: all .15s; }
.attach-btn:hover { background: var(--green-100); border-color: var(--green); }

/* Sheet chips */
.sheet-chips-zone { padding: 8px 16px 10px; border-top: 1px solid var(--gray-200); background: var(--gray-50); display: flex; flex-wrap: wrap; gap: 6px; }
.sheet-chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px 4px 10px; border: 1.5px solid var(--green-200); border-radius: 20px; background: var(--green-lt); font-size: 11px; font-weight: 600; color: var(--green-dk); }
.sheet-chip-name { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sheet-chip-x { width: 16px; height: 16px; border-radius: 50%; border: 1px solid var(--green-200); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; color: var(--gray); }

/* CNTR */
.cntr-hd { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-top: 1px solid var(--gray-200); background: var(--gray-50); }
.cntr-label { font-size: 10px; font-weight: 800; color: var(--dark); letter-spacing: .06em; text-transform: uppercase; }
.cntr-btns { display: flex; gap: 6px; }
.cntr-add { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 6px; border: 1.5px solid var(--green-200); background: var(--green-lt); font-family: inherit; font-size: 11px; font-weight: 700; color: var(--green-dk); cursor: pointer; }
.cntr-add:hover { background: var(--green-100); }
.cntr-del { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 6px; border: 1.5px solid var(--red-100); background: var(--red-lt); font-family: inherit; font-size: 11px; font-weight: 700; color: var(--red); cursor: pointer; }
.cntr-del:hover { background: var(--red-100); }
.cntr-del:disabled { opacity: 0.38; cursor: not-allowed; pointer-events: none; }
.cntr-table { width: 100%; border-collapse: collapse; }
.cntr-table th { padding: 8px 10px; background: var(--gray-50); border: 1px solid var(--gray-200); font-size: 11px; font-weight: 800; color: var(--gray); text-align: center; letter-spacing: .05em; text-transform: uppercase; white-space: nowrap; }
.cntr-table td { padding: 9px 10px; border: 1px solid var(--gray-200); font-size: 12px; color: var(--dark); text-align: center; vertical-align: middle; }
.cntr-inp { border: 1px solid var(--gray-200); border-radius: 4px; background: var(--gray-50); font-family: inherit; font-size: 12px; color: var(--dark); text-align: center; outline: none; width: 100%; min-width: 60px; padding: 5px 6px; }
.cntr-inp:hover { border-color: var(--green-200); background: #fff; }
.cntr-inp:focus { border-color: var(--green-dk); background: #fff; box-shadow: 0 0 0 2px rgba(22,163,74,.1); }
.cntr-sel { border: 1px solid var(--gray-200); border-radius: 4px; background: var(--gray-50); font-family: inherit; font-size: 12px; color: var(--dark); outline: none; cursor: pointer; text-align: center; padding: 5px 6px; }
.cntr-sel:hover { border-color: var(--green-200); background: #fff; }
.cntr-chk-all, .cntr-row-chk { width: 13px; height: 13px; accent-color: var(--green-dk); cursor: pointer; }

/* Unit custom dropdown */
.unit-dd { position:relative; display:inline-flex; align-items:center; justify-content:space-between; border:1px solid var(--gray-200); border-radius:4px; background:var(--gray-50); font-family:inherit; font-size:12px; font-weight:600; color:var(--dark); padding:5px 8px; cursor:pointer; min-width:120px; user-select:none; transition:border-color .15s,background .15s; gap:6px; }
.unit-dd:hover { border-color:var(--green-200); background:#fff; }
.unit-dd.open { border-color:var(--green-dk); background:#fff; box-shadow:0 0 0 3px rgba(22,163,74,.08); }
.unit-dd-val { flex:1; text-align:center; }
.unit-dd-arr { font-size:8px; color:var(--gray-lt); flex-shrink:0; transition:transform .15s; }
.unit-dd.open .unit-dd-arr { transform:rotate(180deg); }
.unit-dd-list { min-width:150px; background:#fff; border:1.5px solid var(--green-200); border-radius:8px; box-shadow:0 4px 16px rgba(0,0,0,.15); z-index:9999; display:flex; flex-direction:column; }
.unit-dd-item { display:flex; align-items:center; justify-content:space-between; padding:9px 13px; font-size:12px; font-weight:600; color:var(--dark); cursor:pointer; white-space:nowrap; gap:8px; }
.unit-dd-item:hover { background:var(--green-lt); color:var(--green-dk); }
.unit-dd-item-del { width:15px; height:15px; border-radius:50%; border:1px solid var(--gray-200); background:#fff; display:flex; align-items:center; justify-content:center; font-size:8px; color:var(--gray-lt); cursor:pointer; flex-shrink:0; padding:0; line-height:1; transition:all .12s; }
.unit-dd-item-del:hover { border-color:var(--red); color:var(--red); background:var(--red-lt); }
.unit-add-hdr-btn { display:inline-flex; align-items:center; gap:3px; margin-left:5px; padding:2px 8px; background:var(--green-dk); color:#fff; border:none; border-radius:4px; font-family:inherit; font-size:9px; font-weight:800; cursor:pointer; letter-spacing:.04em; text-transform:uppercase; vertical-align:middle; }
.unit-add-panel { position:absolute; top:calc(100% + 4px); left:0; z-index:200; background:#fff; border:1.5px solid var(--green-200); border-radius:8px; box-shadow:0 4px 16px rgba(0,0,0,.13); padding:8px 10px; white-space:nowrap; }
.unit-add-save { padding:3px 11px; background:var(--green-dk); color:#fff; border:none; border-radius:5px; font-family:inherit; font-size:11px; font-weight:700; cursor:pointer; }
.unit-add-cancel { padding:3px 11px; background:#fff; color:var(--gray); border:1.5px solid var(--gray-200); border-radius:5px; font-family:inherit; font-size:11px; font-weight:700; cursor:pointer; }

/* Actions */
.si-actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding: 18px 0 4px; }
.si-back { display: inline-flex; align-items: center; gap: 7px; padding: 10px 24px; border: 1.5px solid var(--gray-200); border-radius: 8px; background: #fff; font-family: inherit; font-size: 13px; font-weight: 700; color: var(--gray); cursor: pointer; text-transform: uppercase; }
.si-back:hover { border-color: var(--green-200); color: var(--green-dk); background: var(--green-lt); }
.btn-cancel-si { display: inline-flex; align-items: center; gap: 7px; padding: 10px 24px; border: 1.5px solid var(--gray-200); border-radius: 8px; background: #fff; font-family: inherit; font-size: 13px; font-weight: 700; color: var(--gray); cursor: pointer; text-transform: uppercase; }
.btn-cancel-si:hover { border-color: var(--red-100); color: var(--red); background: var(--red-lt); }
.btn-submit-si { display: inline-flex; align-items: center; gap: 7px; padding: 10px 32px; border: none; border-radius: 8px; background: var(--green-dk); font-family: inherit; font-size: 13px; font-weight: 800; color: #fff; cursor: pointer; letter-spacing: .04em; box-shadow: 0 2px 8px rgba(22,163,74,.3); }
.btn-submit-si:hover { background: var(--green); box-shadow: 0 4px 14px rgba(22,163,74,.4); transform: translateY(-1px); }

/* Attach files */
.attach-add-btn { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; background: var(--green-dk); border: 1.5px solid var(--green-dk); border-radius: 6px; font-family: inherit; font-size: 11px; font-weight: 800; color: #fff; cursor: pointer; }
.attach-hdr { display: grid; grid-template-columns: 1fr 1fr auto; padding: 8px 18px; background: var(--gray-50); border-bottom: 1px solid var(--gray-200); font-size: 11px; font-weight: 800; color: var(--gray); text-transform: uppercase; letter-spacing: .06em; }
.attach-row { display: grid; grid-template-columns: 1fr 1fr auto; align-items: center; padding: 10px 18px; border-bottom: 1px solid var(--gray-200); gap: 12px; }
.attach-row:hover { background: var(--gray-50); }
.attach-name-inp { border: none; border-bottom: 1.5px dashed var(--gray-200); background: transparent; font-family: inherit; font-size: 12px; font-weight: 600; color: var(--dark); outline: none; width: 180px; padding: 2px 4px; }
.attach-name-inp:focus { border-bottom-color: var(--green-dk); }
.attach-file-wrap { display: flex; align-items: center; gap: 8px; }
.attach-choose-btn { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border: 1.5px solid var(--green-200); border-radius: 6px; background: var(--green-lt); font-family: inherit; font-size: 11px; font-weight: 700; color: var(--green-dk); cursor: pointer; white-space: nowrap; }
.attach-file-label { font-size: 11px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px; }
.attach-del-btn { width: 26px; height: 26px; border-radius: 6px; border: 1.5px solid var(--gray-200); background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--gray-lt); padding: 0; }
.attach-del-btn:hover { border-color: var(--red); color: var(--red); background: var(--red-lt); }
.attach-empty { padding: 10px 24px; text-align: center; color: var(--gray-lt); font-size: 12px; font-weight: 600; }

/* ── SUBMISSION NOTICE (inline) ── */
.sn-wrap { display:flex; align-items:flex-start; justify-content:center; padding:40px 0; }
.sn-card { background:#fff; border-radius:20px; max-width:640px; width:100%; box-shadow:0 4px 6px rgba(0,0,0,.04),0 12px 40px rgba(0,0,0,.07); overflow:hidden; animation:snSlideUp .6s cubic-bezier(.16,1,.3,1) both; }
@keyframes snSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

.sn-header { background:linear-gradient(130deg,#2d8653 0%,#3aaa6a 100%); padding:32px 36px 28px; position:relative; overflow:hidden; }
.sn-header::after { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 85% 50%,rgba(255,255,255,.12) 0%,transparent 65%); }
.sn-header::before { content:''; position:absolute; inset:0; background-image:radial-gradient(circle,rgba(255,255,255,.15) 1px,transparent 1px); background-size:22px 22px; pointer-events:none; }
.sn-header-inner { position:relative; z-index:1; display:flex; align-items:center; justify-content:space-between; gap:16px; }
.sn-pill { display:inline-flex; align-items:center; gap:7px; background:rgba(255,255,255,.18); border:1px solid rgba(255,255,255,.28); border-radius:100px; padding:4px 12px; margin-bottom:12px; }
.sn-live-dot { width:7px; height:7px; border-radius:50%; background:#a8f0c0; box-shadow:0 0 0 3px rgba(168,240,192,.3); animation:snPulse 2.2s ease-in-out infinite; }
@keyframes snPulse { 0%,100%{box-shadow:0 0 0 3px rgba(168,240,192,.3)} 50%{box-shadow:0 0 0 6px rgba(168,240,192,.1)} }
.sn-pill span { font-size:11px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:rgba(255,255,255,.9); }
.sn-title { font-family:'Manrope','DM Sans',sans-serif; font-size:22px; font-weight:800; color:#fff; line-height:1.25; letter-spacing:-.02em; }
.sn-icon-box { flex-shrink:0; width:62px; height:62px; background:rgba(255,255,255,.18); border:1.5px solid rgba(255,255,255,.28); border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:28px; }

.sn-body { padding:28px 36px 24px; }
.sn-msg-block { display:flex; gap:14px; align-items:flex-start; background:#f4fbf7; border:1px solid #c6e9d4; border-radius:14px; padding:18px 20px; margin-bottom:24px; animation:snFadeIn .5s .25s both; }
@keyframes snFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.sn-check-badge { flex-shrink:0; width:36px; height:36px; background:linear-gradient(135deg,#2d8653,#3aaa6a); border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 10px rgba(58,170,106,.3); }
.sn-check-badge svg { width:18px; height:18px; }
.sn-msg-text { flex:1; font-size:14px; line-height:1.7; color:#374151; }
.sn-ship-chip { display:inline-flex; align-items:center; gap:5px; font-weight:700; color:#2d8653; background:rgba(45,134,83,.09); border:1px solid rgba(45,134,83,.2); border-radius:6px; padding:0 7px; font-size:14px; text-decoration:none; cursor:pointer; transition:background .15s; }
.sn-ship-chip:hover { background:rgba(45,134,83,.15); }
.sn-sub-note { margin-top:8px; font-size:12px; color:#6b9b7d; display:flex; align-items:center; gap:5px; }

.sn-divider { display:flex; align-items:center; gap:12px; margin-bottom:20px; animation:snFadeIn .5s .35s both; }
.sn-div-line { flex:1; height:1px; background:#e5efe9; }
.sn-div-label { font-size:11px; font-weight:600; letter-spacing:.09em; text-transform:uppercase; color:#8ab89a; }

.sn-actions-row { display:flex; gap:10px; flex-wrap:wrap; animation:snFadeIn .5s .45s both; }
.sn-action-btn { flex:1; min-width:90px; display:flex; flex-direction:column; align-items:center; gap:9px; padding:16px 10px 13px; border-radius:14px; border:1.5px solid #e8f0eb; background:#fafcfb; cursor:pointer; text-decoration:none; transition:all .22s cubic-bezier(.34,1.56,.64,1); }
.sn-action-btn:hover { border-color:#b8d9c4; background:#f2faf5; transform:translateY(-3px); box-shadow:0 8px 22px rgba(45,134,83,.1); }
.sn-icon-wrap { width:48px; height:48px; border-radius:13px; display:flex; align-items:center; justify-content:center; }
.sn-icon-red { background:linear-gradient(145deg,#e53535,#c41f1f); box-shadow:0 4px 14px rgba(220,38,38,.3); }
.sn-action-btn:hover .sn-icon-red { box-shadow:0 6px 18px rgba(220,38,38,.4); }
.sn-icon-red-outline { background:#fff; border:2px solid #dc2626; box-shadow:0 4px 12px rgba(220,38,38,.12); }
.sn-q-box { width:28px; height:28px; border-radius:7px; background:rgba(255,255,255,.22); border:1.5px solid rgba(255,255,255,.45); display:flex; align-items:center; justify-content:center; font-family:'Manrope','DM Sans',sans-serif; font-weight:800; font-size:16px; color:#fff; }
.sn-p-letter { font-family:'Manrope','DM Sans',sans-serif; font-weight:800; font-size:22px; color:#fff; }
.sn-s-letter { font-family:'Manrope','DM Sans',sans-serif; font-weight:800; font-size:22px; color:#dc2626; }
.sn-btn-label { font-size:10.5px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; text-align:center; line-height:1.35; color:#4b6659; }

.sn-footer { background:#f7faf8; border-top:1px solid #e8f0eb; padding:14px 36px; display:flex; align-items:center; justify-content:flex-end; }
.sn-footer-right { font-size:11.5px; color:#9ab8a4; font-weight:500; }
</style>

<style>
/* Unscoped reset — must be class-gated to avoid leaking */
.si-form-root, .si-form-root *, .si-form-root *::before, .si-form-root *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Tailwind preflight sets svg { display: block } which breaks inline SVG icons */
.si-form-root svg {
  display: inline;
  vertical-align: middle;
}
</style>
