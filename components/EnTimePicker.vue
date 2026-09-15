<template>
  <div class="en-tp-wrap" ref="wrapRef">
    <input
      ref="inputRef"
      :disabled="disabled"
      :placeholder="placeholder || 'HH : MM'"
      :class="[inputClass, dynamicInputClass]"
      :value="displayValue"
      readonly
      @click="togglePicker"
      style="cursor:pointer;"
    />
    <!-- Time spinner popup -->
    <div v-if="pickerOpen" class="en-tp-pop">
      <div class="en-tp-title">Select Time</div>
      <div class="en-tp-row">
        <div class="en-tp-spin">
          <button @click.stop="incH">▲</button>
          <input type="text" :value="String(selH).padStart(2,'0')" maxlength="2" readonly />
          <button @click.stop="decH">▼</button>
        </div>
        <div class="en-tp-sep">:</div>
        <div class="en-tp-spin">
          <button @click.stop="incM">▲</button>
          <input type="text" :value="String(selM).padStart(2,'0')" maxlength="2" readonly />
          <button @click.stop="decM">▼</button>
        </div>
      </div>
      <div class="en-tp-ok-row">
        <button class="en-tp-ok" @click.stop="applyTime">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue:        { type: String,                   default: '' },
  disabled:          { type: Boolean,                  default: false },
  placeholder:       { type: String,                   default: undefined },
  inputClass:        { type: [String, Array],          default: '' },
  dynamicInputClass: { type: [String, Object, Array],  default: undefined },
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'change', val: string): void
}>()

const wrapRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const pickerOpen = ref(false)
const selH = ref(0)
const selM = ref(0)

// Sync spinner state from modelValue
watch(() => props.modelValue, (val) => {
  if (val) {
    const parts = val.split(':')
    selH.value = parseInt(parts[0]) || 0
    selM.value = parseInt(parts[1]) || 0
  }
}, { immediate: true })

const displayValue = ref('')
watch(() => props.modelValue, (val) => {
  if (!val) { displayValue.value = ''; return }
  const parts = val.split(':')
  const h = String(parseInt(parts[0]) || 0).padStart(2, '0')
  const m = String(parseInt(parts[1]) || 0).padStart(2, '0')
  displayValue.value = `${h} : ${m}`
}, { immediate: true })

function incH() { selH.value = (selH.value + 1) % 24 }
function decH() { selH.value = (selH.value + 23) % 24 }
function incM() { selM.value = (selM.value + 5) % 60 }
function decM() { selM.value = (selM.value + 55) % 60 }

function applyTime() {
  const val = `${String(selH.value).padStart(2,'0')}:${String(selM.value).padStart(2,'0')}`
  emit('update:modelValue', val)
  emit('change', val)
  pickerOpen.value = false
}

function togglePicker() {
  if (props.disabled) return
  pickerOpen.value = !pickerOpen.value
}

// Close on click outside
function onDocClick(e: MouseEvent) {
  if (wrapRef.value && !wrapRef.value.contains(e.target as Node)) {
    pickerOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onDocClick, true))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick, true))
</script>

<style>
/* ─── EnTimePicker: custom time spinner popup (dtp-time style) ─── */
.en-tp-wrap { position: relative; display: block; width: 100%; }

/* Main input styling — use > child combinator to avoid styling spinner inputs */
.en-tp-wrap > input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  padding-right: 34px !important;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  color: #1f2937;
  outline: none;
  transition: all .18s;
  background-color: #fff;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%2315803d' d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z'/></svg>");
  background-repeat: no-repeat;
  background-position: calc(100% - 10px) center;
  background-size: 16px 16px;
  cursor: pointer;
}
.en-tp-wrap > input:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22,163,74,.1);
}
.en-tp-wrap > input:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
  border-color: #e5e7eb;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23c8d8ea' d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z'/></svg>") !important;
}
.en-tp-wrap > input::placeholder { color: #9ca3af; }

/* Time spinner popup */
.en-tp-pop {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 9999;
  background: #fff;
  border: 1.5px solid #bbf7d0;
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0,60,120,.15);
  min-width: 200px;
  font-family: 'DM Sans', sans-serif;
  padding: 14px 16px;
  animation: enTpFadeIn .12s ease;
}
@keyframes enTpFadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.en-tp-title {
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.en-tp-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.en-tp-spin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.en-tp-spin button {
  background: none;
  border: none;
  cursor: pointer;
  color: #15803d;
  font-size: 16px;
  line-height: 1;
  padding: 3px 10px;
  border-radius: 4px;
  transition: background .1s;
}
.en-tp-spin button:hover { background: #f0fdf4; }
.en-tp-spin input {
  width: 54px;
  text-align: center;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px 4px;
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  font-family: 'DM Mono', monospace;
  outline: none;
  background: #fff;
  /* Reset — no icon, no extra padding */
  background-image: none !important;
  padding-right: 4px !important;
}

.en-tp-sep {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-top: 4px;
}

.en-tp-ok-row {
  text-align: center;
  margin-top: 10px;
}
.en-tp-ok {
  background: #15803d;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 24px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background .12s;
}
.en-tp-ok:hover { background: #16a34a; }
</style>
