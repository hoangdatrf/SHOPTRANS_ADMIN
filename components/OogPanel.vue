<template>
  <div class="col-span-1 sm:col-span-4 w-full mt-2">
    <div class="oog-panel-yellow relative">
      <!-- Diamond arrow on top left -->
      <div class="absolute -top-[7.5px] left-[30px] w-[14px] h-[14px] bg-[#fffbeb] border-t-[1.5px] border-l-[1.5px] border-solid border-[#fcd34d] rotate-45"></div>
      
      <div class="oog-head-yellow">
        <span class="badge-brown">{{ isFR ? 'FLAT RACK' : 'OPEN TOP' }}</span>
        <span class="head-text">CARGO & HANDLING SPECIFICATIONS</span>
      </div>
      
      <div class="flex flex-col md:flex-row p-[14px] pt-[10px] gap-[14px]">
        
        <!-- Left: SVG Diagram -->
        <div class="w-[200px] shrink-0 bg-white border-[1px] border-solid border-[#fcd34d] rounded-[6px] flex items-center justify-center p-[14px] h-[200px]" v-html="diagramSvg"></div>
        
        <!-- Right: Form Fields -->
        <div class="flex-1 flex flex-col justify-start">
           <span class="oog-label">Cargo profile</span>
           <div class="oog-mode-row-yellow mb-[14px]" role="tablist">
             <button class="oog-mode-pill-yellow" :class="{active: row.oog.mode === 'ingauge'}" @click="setMode('ingauge')">In-gauge</button>
             <button class="oog-mode-pill-yellow" :class="{active: row.oog.mode === 'oog'}" @click="setMode('oog')">Out-of-gauge</button>
           </div>
           
           <div v-if="isOOG" class="oog-pkg-section">
             <div class="oog-pkg-header">
               <span class="oog-label">Cargo packages per container (L &times; W &times; H &times; WT &times; Qty)</span>
               <button type="button" class="oog-unit-toggle compact" @click="toggleUnit">{{ row.oog.unit }} &#9662;</button>
             </div>

             <div class="oog-pkg-grid-head">
               <span></span><span>Length</span><span>Width</span><span>Height</span><span>Weight (kg)</span><span>Pieces</span><span></span>
             </div>
             <div class="oog-pkg-list">
               <div v-for="(pkg, pkgIdx) in packages" :key="pkgIdx" class="oog-pkg-row">
                 <span class="oog-pkg-label">#{{ pkgIdx + 1 }}</span>
                 <input type="text" inputmode="decimal" pattern="[0-9]*\\.?[0-9]{0,2}" placeholder="L" v-model="pkg.L" @input="clampPackageInput(pkg, 'L')" @change="syncLegacyDims">
                 <input type="text" inputmode="decimal" pattern="[0-9]*\\.?[0-9]{0,2}" placeholder="W" v-model="pkg.W" @input="clampPackageInput(pkg, 'W')" @change="syncLegacyDims">
                 <input type="text" inputmode="decimal" pattern="[0-9]*\\.?[0-9]{0,2}" placeholder="H" v-model="pkg.H" @input="clampPackageInput(pkg, 'H')" @change="syncLegacyDims">
                 <input type="number" min="0" step="0.01" placeholder="kg" v-model="pkg.weight" class="pkg-weight-input">
                 <input type="number" min="1" max="999" placeholder="Qty" v-model.number="pkg.qty" @change="normalizePackageQty(pkg)">
                 <button type="button" class="oog-pkg-remove" :disabled="packages.length <= 1" @click="removePackage(pkgIdx)" title="Remove package">&times;</button>
               </div>
             </div>
             <div class="oog-pkg-footer">
               <button type="button" class="oog-pkg-add" @click="addPackage">+ Add package</button>
               <span class="oog-pkg-total">Total: <strong>{{ totalPieces }}</strong> piece{{ totalPieces === 1 ? '' : 's' }}{{ totalWeightKg > 0 ? ` · ${fmtNum(totalWeightKg)} kg` : '' }} / container</span>
             </div>
              <!-- Weight comparison warning -->
              <div v-if="weightWarn" class="oog-weight-warn" :class="weightWarn.type">
                <span class="ww-icon">{{ weightWarn.type === 'err' ? '⚠' : 'ℹ' }}</span>
                <span v-html="weightWarn.msg"></span>
              </div>

             <div class="oog-dim-hint-yellow compact-hint">
                <div class="w-[18px] h-[18px] shrink-0 text-[#92400e] mt-[2px]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                <span v-html="hintHTMLContent"></span>
             </div>

             <div class="oog-overhang">
                <span class="oog-label">Computed overhang vs {{ containerLabel }} envelope <small>(internal {{ oh.internal.L }} &times; {{ oh.internal.W }} &times; {{ oh.internal.H }} m)</small></span>
                <div class="oog-badge-grid mt-[6px]">
                  <div v-if="isFR" class="oog-badge" :class="{on: oh.overL>0}">
                    <span class="b-axis">Over-length</span>
                    <span class="b-val">{{ fmtM(oh.overL) }}</span>
                    <span class="b-sub">each end</span>
                  </div>
                  <div v-if="isFR" class="oog-badge" :class="{on: oh.overW>0}">
                    <span class="b-axis">Over-width</span>
                    <span class="b-val">{{ fmtM(oh.overW) }}</span>
                    <span class="b-sub">each side</span>
                  </div>
                  <div class="oog-badge" :class="{on: oh.overH>0}">
                    <span class="b-axis">Over-height</span>
                    <span class="b-val">{{ fmtM(oh.overH) }}</span>
                    <span class="b-sub">above roof</span>
                  </div>
                </div>
             </div>
           </div>
           <div v-else>
             <span class="oog-label">Maximum cargo envelope (in-gauge)</span>
             <div class="oog-dim-hint-yellow mt-[4px] mb-[20px]">
                <div class="w-[18px] h-[18px] shrink-0 text-[#92400e] mt-[2px]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                <span v-html="hintHTMLContent"></span>
             </div>
           </div>

           <span class="oog-field-title" v-if="isOT">Cover:</span>
           <span class="oog-field-title" v-else>Lashing & securing by:</span>
           
           <div v-if="isOT" class="mb-[14px] mt-[4px]">
              <select v-model="row.oog.cover" class="w-full select-yellow">
                <option value="tarpaulin">Tarpaulin (provided by carrier)</option>
                <option value="roof_returned">Steel roof returned after loading</option>
                <option value="open">Open / no cover</option>
              </select>
           </div>
           <div v-else class="mb-[14px] mt-[4px]">
              <select v-model="row.oog.lashing" class="w-full select-yellow">
                <option value="carrier">Carrier / port</option>
                <option value="shipper">Shipper</option>
              </select>
           </div>
           
           <div class="mb-[4px]">
              <label class="flex items-center gap-[8px] cursor-pointer">
                <input type="checkbox" v-model="row.oog.heavyLift">
                <span class="oog-check-text">Heavy-lift (per piece > 20 MT)</span>
              </label>
           </div>
        </div>
      </div>
      
      <!-- Warning Banner -->
      <div class="oog-warn-yellow" :class="'oog-warn--' + warnTone">
         <div v-if="warnTone === 'warn'" class="w-[18px] h-[18px] shrink-0 text-[#ea580c]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
         <div v-else-if="warnTone === 'info'" class="w-[18px] h-[18px] shrink-0 text-[#0284c7]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></div>
         <div v-else class="w-[18px] h-[18px] shrink-0 text-[#1d4ed8]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div>
         <span v-html="warnText" style="line-height:1.5"></span>
      </div>
    </div>
  </div>
</template><script setup lang="ts">
import { computed, watch, onMounted } from 'vue'

const props = defineProps<{ row: any }>()

const isFR = computed(() => /FR$/.test(props.row.selectedContainer?.value))
const isOT = computed(() => /OT$/.test(props.row.selectedContainer?.value))
const isOOG = computed(() => props.row.oog.mode === 'oog')
const containerLabel = computed(() => isFR.value ? 'Flat Rack' : 'Open Top')
const packages = computed(() => props.row.oog.packages || [])
const totalPieces = computed(() => packages.value.reduce((sum: number, pkg: any) => sum + (parseInt(pkg.qty) || 0), 0))
const totalWeightKg = computed(() => packages.value.reduce((sum: number, pkg: any) => sum + ((parseFloat(pkg.weight) || 0) * (parseInt(pkg.qty) || 0)), 0))
function fmtNum(v: number) { return v % 1 === 0 ? v.toLocaleString() : v.toLocaleString(undefined, { maximumFractionDigits: 2 }) }

const weightWarn = computed(() => {
  if (totalWeightKg.value <= 0) return null
  const declaredStr = props.row.weightValue
  const declared = parseFloat(declaredStr)
  if (!isFinite(declared) || declared <= 0) return null
  // Convert declared to kg if unit is lbs
  const declaredKg = props.row.unitValue === 'lbs' ? declared * 0.453592 : declared
  const sum = totalWeightKg.value
  if (sum > declaredKg) {
    const diff = sum - declaredKg
    return { type: 'err', msg: `Total piece weight <strong>${fmtNum(sum)} kg</strong> exceeds declared container weight by <strong>${fmtNum(+(diff.toFixed(2)))} kg</strong> (declared: <strong>${fmtNum(+(declaredKg.toFixed(2)))} kg</strong>). Adjust quantities, piece weight, or container weight.` }
  }
  if (sum < declaredKg) {
    const diff = declaredKg - sum
    return { type: 'info', msg: `Total piece weight <strong>${fmtNum(sum)} kg</strong> is <strong>${fmtNum(+(diff.toFixed(2)))} kg</strong> less than declared container weight (<strong>${fmtNum(+(declaredKg.toFixed(2)))} kg</strong>). Add missing pieces or revise the container weight.` }
  }
  return null
})

const CONTAINER_INTERNAL_DIMS: any = {
  '20OT': {L:5.89,  W:2.35, H:2.35},
  '40OT': {L:12.03, W:2.35, H:2.35},
  '20FR': {L:5.94,  W:2.35, H:2.34},
  '40FR': {L:12.13, W:2.40, H:2.34},
}

const maxM = computed(() => {
  const type = props.row.selectedContainer?.value
  const dims = CONTAINER_INTERNAL_DIMS[type]
  if(!dims) return {L:0, W:0, H:0, hardLW:false}
  if(/OT$/.test(type)) return {L:dims.L, W:dims.W, H:6.0, hardLW:true}
  if(type === '20FR') return {L:9.50, W:4.0, H:6.0, hardLW:false}
  if(type === '40FR') return {L:19.00, W:4.0, H:6.0, hardLW:false}
  return {L:0, W:0, H:0, hardLW:false}
})

const maxU = computed(() => {
  const m = maxM.value
  const f = props.row.oog.unit === 'cm' ? 100 : 1
  return { L:+(m.L*f).toFixed(2), W:+(m.W*f).toFixed(2), H:+(m.H*f).toFixed(2), hardLW:m.hardLW }
})

const oh = computed(() => {
  const type = props.row.selectedContainer?.value
  const dims = CONTAINER_INTERNAL_DIMS[type]
  if(!dims) return {overH:0, overL:0, overW:0, anyDimEntered:false, exceeds:false, internal:{L:0,W:0,H:0}}
  
  const toM = (v: any) => {
    const x = parseFloat(v);
    if(!isFinite(x) || x<=0) return 0;
    return props.row.oog.unit === 'cm' ? x/100 : x;
  }
  let overH = 0, overL = 0, overW = 0, anyDimEntered = false;
  packages.value.forEach((pkg: any) => {
    const L = toM(pkg.L), W = toM(pkg.W), H = toM(pkg.H);
    overH = Math.max(overH, Math.max(0, +(H - dims.H).toFixed(2)));
    overL = Math.max(overL, Math.max(0, +((L - dims.L) / 2).toFixed(2)));
    overW = Math.max(overW, Math.max(0, +((W - dims.W) / 2).toFixed(2)));
    if (L > 0 || W > 0 || H > 0) anyDimEntered = true;
  });
  const exceeds = overH>0 || overL>0 || overW>0;
  
  return { overH, overL, overW, anyDimEntered, exceeds, internal:dims }
})

const hintHTMLContent = computed(() => {
  if (maxU.value.hardLW) {
    return `${containerLabel.value} walls limit cargo to <strong style="color:#92400e">L &le; ${oh.value.internal.L} m</strong> and <strong style="color:#92400e">W &le; ${oh.value.internal.W} m</strong>. Larger pieces require Flat Rack.`;
  }
  return `${containerLabel.value} platform (${oh.value.internal.L} &times; ${oh.value.internal.W} m) allows cargo up to <strong style="color:#92400e">L &le; ${maxM.value.L.toFixed(2)} m</strong> and <strong style="color:#92400e">W &le; ${maxM.value.W.toFixed(2)} m</strong> incl. overhang. Larger pieces require break-bulk / RoRo.`;
})

const warnText = computed(() => {
  if(!oh.value.anyDimEntered){
    if(isOOG.value) return `<strong>Out-of-gauge declared</strong> &mdash; enter cargo dimensions above to compute overhang.`;
    return `<strong style="color:#1d4ed8">In-gauge selected</strong> &mdash; cargo will fit within the ${containerLabel.value} envelope. Switch to <strong style="color:#1d4ed8">Out-of-gauge</strong> if your cargo exceeds the limits above.`;
  } else if(isOOG.value && !oh.value.exceeds){
    return `<strong>Cargo fits within ${containerLabel.value} envelope</strong> &mdash; select <em>In-gauge</em> above to avoid OOG surcharge.`;
  } else if(!isOOG.value && oh.value.exceeds){
    return `<strong>Cargo exceeds ${containerLabel.value} envelope</strong> &mdash; switch to <em>Out-of-gauge</em>; carrier approval required.`;
  } else if(isOOG.value && oh.value.exceeds){
    return `<strong>OOG surcharge applies</strong> &mdash; carrier will review dimensions before providing a binding quote.`;
  }
  return '';
})

const warnTone = computed(() => {
  if(!oh.value.anyDimEntered) return isOOG.value ? 'warn' : 'ok';
  if(isOOG.value && !oh.value.exceeds) return 'ok';
  if(!isOOG.value && oh.value.exceeds) return 'alert';
  if(isOOG.value && oh.value.exceeds) return 'warn';
  return 'ok';
})

function fmtM(v: number){ return v>0 ? `+${v.toFixed(2)} m` : '-'; }

function setMode(m: string) {
  props.row.oog.mode = m;
  if(m === 'ingauge') {
    props.row.oog.L = ''; props.row.oog.W = ''; props.row.oog.H = '';
    props.row.oog.packages = [{ L: '', W: '', H: '', qty: 1 }];
  } else {
    ensurePackages();
  }
}

function sanitizeDecimal(value: any, max: number) {
  let v = String(value ?? '').replace(/[^0-9.]/g,'');
  const firstDot = v.indexOf('.');
  if(firstDot !== -1) v = v.slice(0, firstDot+1) + v.slice(firstDot+1).replace(/\./g,'');
  const parts = v.split('.');
  if(parts.length === 2 && parts[1].length > 2) v = parts[0] + '.' + parts[1].slice(0,2);
  const num = parseFloat(v);
  if(isFinite(num) && num > max) v = String(max);
  return v;
}

function clampPackageInput(pkg: any, k: 'L'|'W'|'H') {
  pkg[k] = sanitizeDecimal(pkg[k], maxU.value[k]);
}

function normalizePackageQty(pkg: any) {
  const n = parseInt(pkg.qty);
  pkg.qty = isFinite(n) && n > 0 ? Math.min(n, 999) : 1;
}

function syncLegacyDims() {
  const first = packages.value[0] || { L: '', W: '', H: '' };
  props.row.oog.L = first.L || '';
  props.row.oog.W = first.W || '';
  props.row.oog.H = first.H || '';
}

function ensurePackages() {
  if (!Array.isArray(props.row.oog.packages) || props.row.oog.packages.length === 0) {
    props.row.oog.packages = [{
      L: props.row.oog.L || '',
      W: props.row.oog.W || '',
      H: props.row.oog.H || '',
      weight: '',
      qty: 1
    }];
  }
  props.row.oog.packages.forEach((pkg: any) => normalizePackageQty(pkg));
  syncLegacyDims();
}

function addPackage() {
  ensurePackages();
  if (packages.value.length >= 20) return;
  props.row.oog.packages.push({ L: '', W: '', H: '', weight: '', qty: 1 });
}

function removePackage(idx: number) {
  ensurePackages();
  if (packages.value.length <= 1) return;
  props.row.oog.packages.splice(idx, 1);
  syncLegacyDims();
}

function clampInput(k: 'L'|'W'|'H') {
  let v = props.row.oog[k];
  v = String(v).replace(/[^0-9.]/g,'');
  const firstDot = v.indexOf('.');
  if(firstDot !== -1) v = v.slice(0, firstDot+1) + v.slice(firstDot+1).replace(/\./g,'');
  const parts = v.split('.');
  if(parts.length === 2 && parts[1].length > 2) v = parts[0] + '.' + parts[1].slice(0,2);
  const num = parseFloat(v);
  const m = maxU.value[k];
  if(isFinite(num) && num > m) v = String(m);
  
  props.row.oog[k] = v;
}

function updateDim(k: 'L'|'W'|'H') {
  clampInput(k);
}

function toggleUnit() {
  ensurePackages();
  const fromCm = props.row.oog.unit === 'cm';
  const factor = fromCm ? 0.01 : 100;
  packages.value.forEach((pkg: any) => {
    ['L','W','H'].forEach(k => {
      const v = parseFloat(pkg[k]);
      if(isFinite(v) && v>0){
        pkg[k] = (fromCm ? (v*factor).toFixed(2) : (v*factor).toFixed(0));
      }
    });
  });
  props.row.oog.unit = fromCm ? 'm' : 'cm';
  syncLegacyDims();
}

watch(() => props.row.oog.mode, () => ensurePackages(), { immediate: true })
onMounted(() => ensurePackages())

const diagramSvg = computed(() => {
  const overH = oh.value.overH;
  const overL = isFR.value ? oh.value.overL : 0;
  const overW = isFR.value ? oh.value.overW : 0;

  const W=200, H=130;
  const cx=W/2, cy=80;
  const cw=120, ch=42;
  const cLeft=cx-cw/2, cTop=cy-ch, cRight=cLeft+cw, cBottom=cy;

  let cargoW = cw*0.7, cargoH = ch*0.78;
  if(overH>0) cargoH = ch * 1.4;
  if(overL>0) cargoW = cw * 1.18;
  const carLeft = cx - cargoW/2;
  const carTop  = cBottom - cargoH;

  const showSideShade = isFR.value && overW>0;

  const lashLines = isFR.value ? `
    <line x1="${cLeft+10}" y1="${cTop}" x2="${cLeft+cw-10}" y2="${cTop}" stroke="#92400e" stroke-width="0.8" stroke-dasharray="3 2" opacity=".55"/>
  ` : '';

  const overHLine = (overH>0) ? `
    <line x1="${cLeft-4}" y1="${cTop}" x2="${cRight+4}" y2="${cTop}" stroke="#dc2626" stroke-width="1.1" stroke-dasharray="4 3"/>
    <text x="${cRight+8}" y="${cTop+3}" font-family="DM Mono, monospace" font-size="8" fill="#dc2626">roof</text>
  ` : '';

  const containerShape = isFR.value ? `
    <line x1="${cLeft}" y1="${cBottom}" x2="${cRight}" y2="${cBottom}" stroke="#1a3a5c" stroke-width="2"/>
    <line x1="${cLeft}" y1="${cBottom}" x2="${cLeft}" y2="${cTop+6}" stroke="#1a3a5c" stroke-width="2"/>
    <line x1="${cRight}" y1="${cBottom}" x2="${cRight}" y2="${cTop+6}" stroke="#1a3a5c" stroke-width="2"/>
  ` : `
    <path d="M ${cLeft} ${cTop+2} L ${cLeft} ${cBottom} L ${cRight} ${cBottom} L ${cRight} ${cTop+2}"
          stroke="#1a3a5c" stroke-width="2" fill="none"/>
    <line x1="${cLeft-2}" y1="${cTop}" x2="${cLeft+8}" y2="${cTop}" stroke="#1a3a5c" stroke-width="1.5"/>
    <line x1="${cRight-8}" y1="${cTop}" x2="${cRight+2}" y2="${cTop}" stroke="#1a3a5c" stroke-width="1.5"/>
  `;

  const exceeds = overH>0 || overL>0 || overW>0;
  const cargoFill   = exceeds ? 'rgba(239,68,68,.25)' : 'rgba(26,179,160,.22)';
  const cargoStroke = exceeds ? '#dc2626' : '#129e8d';

  const sideShade = showSideShade ? `
    <rect x="${cLeft-12}" y="${cBottom-4}" width="12" height="4" fill="#dc2626" opacity=".35"/>
    <rect x="${cRight}"   y="${cBottom-4}" width="12" height="4" fill="#dc2626" opacity=".35"/>
  ` : '';

  // E.g. "20OT" or "40FR"
  let match = (props.row.selectedContainer?.value || '').match(/^(20|40)(OT|FR)$/);
  const typeLabel = match ? match[0] : '-';
  const labelTxt = `${typeLabel} · ${exceeds ? 'OOG' : 'IN-GAUGE'}`;

  return `
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;max-height:130px;display:block">
  <line x1="6" y1="${cBottom+2}" x2="${W-6}" y2="${cBottom+2}" stroke="#92400e" stroke-width="0.8" opacity=".4" stroke-dasharray="2 3"/>
  ${containerShape}
  ${lashLines}
  ${sideShade}
  <rect x="${carLeft}" y="${carTop}" width="${cargoW}" height="${cargoH}"
        fill="${cargoFill}" stroke="${cargoStroke}" stroke-width="1.4" rx="2"/>
  ${overHLine}
  <text x="${cx}" y="${H-6}" text-anchor="middle"
        font-family="DM Mono, monospace" font-size="9" font-weight="700"
        fill="#92400e" letter-spacing="0.5">${labelTxt}</text>
</svg>
  `;
})

</script>

<style scoped>
.oog-panel-yellow {
  background: #fffbeb;
  border-radius: 8px;
  border: 1.5px solid #fcd34d;
  font-family: 'Sora', sans-serif !important;
  margin-top: 10px;
}
.oog-panel-yellow :where(div, span, label, button, input, select, option, small, strong, em) {
  font-family: 'Sora', sans-serif !important;
}
.oog-panel-yellow :where(.oog-unit-toggle.compact, .oog-pkg-label, .oog-pkg-row input, .oog-pkg-total strong, .b-val) {
  font-family: 'DM Mono', monospace !important;
}
.oog-head-yellow {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px 4px 16px;
}
.badge-brown {
  background: #92400e;
  color: #fef3c7;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  text-transform: uppercase;
}
.head-text {
  color: #92400e;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.oog-label {
  display: block;
  font-size: 10.5px;
  font-weight: 700;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 5px;
}
.oog-mode-row-yellow {
  display: inline-flex;
  background: #fff;
  border-radius: 6px;
  width: fit-content;
  border: 1.5px solid #fde68a;
  padding: 3px;
  gap: 2px;
}
.oog-mode-pill-yellow {
  border: none;
  background: transparent;
  color: #607890;
  font-weight: 600;
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all .15s;
  letter-spacing: 0.02em;
}
.oog-mode-pill-yellow.active {
  background: #92400e;
  color: #fef3c7;
  box-shadow: 0 1px 4px rgba(146,64,14,.3);
}
.oog-mode-pill-yellow:not(.active):hover {
  background: #f8fafc;
  color: #0f2233;
}
.oog-dim-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  gap: 8px;
  align-items: center;
}
.oog-dim-grid input {
  width: 100%;
  padding: 8px 12px;
  border: 1.5px solid #c8d8ea;
  border-radius: 6px;
  font-family: 'DM Mono', monospace;
  font-size: 14px;
  color: #0f2233;
  transition: all .15s;
}
.oog-dim-grid input:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245,158,11,.18);
}
.oog-unit-toggle {
  height: 100%;
  padding: 0 14px;
  background: #92400e;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: background .15s;
}
.oog-unit-toggle:hover { background: #78350f; }
.oog-unit-toggle.compact {
  height: 32px;
  padding: 0 12px;
  font-family: 'DM Mono', monospace;
  font-size: 11.5px;
}

.oog-pkg-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.oog-pkg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.oog-pkg-grid-head {
  display: grid;
  grid-template-columns: 34px 1fr 1fr 1fr 1fr 70px 28px;
  gap: 6px;
  padding: 0 2px;
  font-size: 9.5px;
  font-weight: 700;
  color: #92400e;
  letter-spacing: .06em;
  text-transform: uppercase;
}
.oog-pkg-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.oog-pkg-row {
  display: grid;
  grid-template-columns: 34px 1fr 1fr 1fr 1fr 70px 28px;
  gap: 6px;
  align-items: center;
}
.oog-pkg-label {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #92400e;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 5px;
  padding: 6px 0;
  text-align: center;
}
.oog-pkg-row input {
  width: 100%;
  padding: 7px 10px;
  border: 1.5px solid #fde68a;
  border-radius: 6px;
  background: #fff;
  color: #0f2233;
  outline: none;
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  transition: border-color .15s, box-shadow .15s;
}
.oog-pkg-row input:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245,158,11,.18);
}
.oog-pkg-row input::placeholder {
  color: #d4a574;
  font-style: italic;
}
.oog-pkg-remove {
  width: 26px;
  height: 31px;
  border-radius: 5px;
  border: 1px solid #fde68a;
  background: #fff;
  color: #dc2626;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .15s;
  padding: 0;
}
.oog-pkg-remove:hover:not(:disabled) {
  background: #fee2e2;
  border-color: #dc2626;
}
.oog-pkg-remove:disabled {
  opacity: .25;
  cursor: not-allowed;
}
.oog-pkg-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.oog-pkg-add {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Sora', sans-serif;
  font-size: 11.5px;
  font-weight: 700;
  background: transparent;
  color: #92400e;
  border: 1.5px dashed #f59e0b;
  border-radius: 6px;
  padding: 7px 12px;
  cursor: pointer;
  letter-spacing: .04em;
  transition: all .15s;
}
.oog-pkg-add:hover {
  background: #fef3c7;
  border-style: solid;
}
.oog-pkg-total {
  color: #78350f;
  font-size: 11.5px;
}
.oog-pkg-total strong {
  color: #92400e;
  font-family: 'DM Mono', monospace;
  font-size: 13px;
}
.oog-overhang {
  border: 1px dashed #f59e0b;
  border-radius: 6px;
  padding: 9px 10px;
  background: rgba(255,255,255,.42);
}
.oog-overhang small {
  color: #607890;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
}

.oog-dim-hint-yellow {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 8px 10px;
  background: #fefce8;
  border: 1.5px solid #fde68a;
  border-radius: 6px;
}
.oog-dim-hint-yellow.compact-hint {
  padding: 8px 10px;
}
.oog-dim-hint-yellow.compact-hint span {
  font-size: 11.5px;
}
.oog-dim-hint-yellow span {
  font-size: 11.5px;
  color: #451a03;
  line-height: 1.45;
}
.oog-field-title {
  display: block;
  color: #92400e;
  font-size: 12px;
  font-weight: 700;
  margin-top: 2px;
}
.oog-check-text {
  color: #607890;
  font-size: 12px;
}
.select-yellow {
  padding: 7px 10px;
  border: 1.5px solid #c8d8ea;
  border-radius: 6px;
  font-family: 'Sora', sans-serif;
  font-size: 12px;
  color: #0f2233;
  outline: none;
  background: #fff;
  cursor: pointer;
}
.select-yellow:focus {
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245,158,11,.18);
}

.oog-badge-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.oog-badge {
  background: #fff;
  border: 1px solid #e2eaf3;
  border-radius: 6px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  opacity: 0.72;
  filter: grayscale(1);
}
.oog-badge.on {
  opacity: 1;
  filter: none;
  border-color: #f59e0b;
  box-shadow: 0 2px 8px rgba(245,158,11,.15);
}
.b-axis { font-size: 10px; color: #92400e; font-weight: 700; text-transform: uppercase; }
.b-val { font-size: 13px; font-weight: 700; color: #607890; font-family: 'DM Mono', monospace; margin: 2px 0; }
.oog-badge.on .b-val { color: #dc2626; }
.b-sub { font-size: 10px; color: #90a8c0; }

.oog-warn-yellow {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 0 0 8px 8px;
}
.oog-warn-yellow span {
  font-size: 12px;
  line-height: 1.5;
}
.oog-warn--ok { background: #eff6ff; color: #1e3a8a; border-top: 1.5px solid #bfdbfe; }
.oog-warn--info { background: #eff6ff; color: #1e3a8a; border-top: 1.5px solid #bfdbfe; }
.oog-warn--warn { background: #fff7ed; color: #9a3412; border-top: 1.5px solid #fed7aa; }
.oog-warn--alert { background: #fef2f2; color: #991b1b; border-top: 1.5px solid #fecaca; }

/* Weight comparison warning */
.oog-weight-warn {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 11.5px;
  line-height: 1.5;
  margin-top: 4px;
}
.oog-weight-warn .ww-icon {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}
.oog-weight-warn.err {
  background: #fef2f2;
  border: 1.5px solid #fecaca;
  color: #991b1b;
}
.oog-weight-warn.info {
  background: #eff6ff;
  border: 1.5px solid #bfdbfe;
  color: #1e3a8a;
}
.pkg-weight-input {
  -moz-appearance: textfield;
}
.pkg-weight-input::-webkit-outer-spin-button,
.pkg-weight-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
