<template>
  <div class="en-dtp-wrap" :class="wrapClass" ref="wrapRef">
    <input
      ref="inputRef"
      :id="id"
      :disabled="disabled"
      :placeholder="placeholder || 'dd / mm / yyyy'"
      :class="[inputClass, dynamicInputClass]"
      :value="displayValue"
      readonly
      @click="toggleCalendar"
      style="cursor:pointer;"
    />
    <!-- Calendar popup -->
    <div v-if="calOpen" class="en-dtp-pop">
      <div class="en-dtp-head">
        <button class="en-dtp-nav" @click.stop="navMonth(-1)">‹</button>
        <span class="en-dtp-my">{{ monthNames[viewMonth] }} {{ viewYear }}</span>
        <button class="en-dtp-nav" @click.stop="navMonth(1)">›</button>
      </div>
      <div class="en-dtp-grid">
        <div v-for="wd in weekdays" :key="wd" class="en-dtp-wd">{{ wd }}</div>
        <div v-for="n in startDow" :key="'b'+n" class="en-dtp-day other"></div>
        <div v-for="d in daysInMonth" :key="d"
          class="en-dtp-day"
          :class="{ sel: isSel(d), today: isToday(d), disabled: isDayDisabled(d) }"
          @click.stop="!isDayDisabled(d) && pickDay(d)">{{ d }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue:        { type: String,                   default: '' },
  id:                { type: String,                   default: undefined },
  disabled:          { type: Boolean,                  default: false },
  minDate:           { type: String,                   default: undefined },
  maxDate:           { type: String,                   default: undefined },
  placeholder:       { type: String,                   default: undefined },
  inputClass:        { type: [String, Array],          default: '' },
  dynamicInputClass: { type: [String, Object, Array],  default: undefined },
  wrapClass:         { type: [String, Object, Array],  default: undefined },
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'change', val: string): void
}>()

const wrapRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const calOpen = ref(false)

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
const weekdays = ['Su','Mo','Tu','We','Th','Fr','Sa']

// Calendar view state
const now = new Date()
const viewYear = ref(now.getFullYear())
const viewMonth = ref(now.getMonth())

// Init view to selected date when it exists
watch(() => props.modelValue, (val) => {
  if (val) {
    const [y, m] = val.split('-').map(Number)
    if (y && m) { viewYear.value = y; viewMonth.value = m - 1 }
  }
}, { immediate: true })

// Calendar computeds
const startDow = computed(() => new Date(viewYear.value, viewMonth.value, 1).getDay())
const daysInMonth = computed(() => new Date(viewYear.value, viewMonth.value + 1, 0).getDate())

// Display value: "dd / mm / yyyy"
const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const [y, m, d] = props.modelValue.split('-')
  return `${d} / ${m} / ${y}`
})

function navMonth(delta: number) {
  let m = viewMonth.value + delta
  let y = viewYear.value
  if (m > 11) { m = 0; y++ }
  if (m < 0) { m = 11; y-- }
  viewMonth.value = m
  viewYear.value = y
}

function isSel(d: number): boolean {
  if (!props.modelValue) return false
  const [y, m, dd] = props.modelValue.split('-').map(Number)
  return y === viewYear.value && m - 1 === viewMonth.value && dd === d
}

function isToday(d: number): boolean {
  const t = new Date()
  return t.getFullYear() === viewYear.value && t.getMonth() === viewMonth.value && t.getDate() === d
}

function isDayDisabled(d: number): boolean {
  const dateStr = `${viewYear.value}-${String(viewMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  if (props.minDate && dateStr < props.minDate) return true
  if (props.maxDate && dateStr > props.maxDate) return true
  return false
}

function pickDay(d: number) {
  const mm = String(viewMonth.value + 1).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  const val = `${viewYear.value}-${mm}-${dd}`
  emit('update:modelValue', val)
  emit('change', val)
  calOpen.value = false
}

function toggleCalendar() {
  if (props.disabled) return
  calOpen.value = !calOpen.value
}

// Close on click outside
function onDocClick(e: MouseEvent) {
  if (wrapRef.value && !wrapRef.value.contains(e.target as Node)) {
    calOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick, true)
})
</script>

<style>
/* ─── EnDatePicker: custom calendar popup (dtp-wrap style) ─── */
.en-dtp-wrap { position: relative; display: block; width: 100%; }

/* Input base styling — self-contained, doesn't rely on scoped parent CSS */
.en-dtp-wrap input {
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
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%2315803d' d='M7 10h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V9h14v9z'/></svg>");
  background-repeat: no-repeat;
  background-position: calc(100% - 10px) center;
  background-size: 16px 16px;
  cursor: pointer;
}
.en-dtp-wrap input:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22,163,74,.1);
}
.en-dtp-wrap input:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
  border-color: #e5e7eb;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23c8d8ea' d='M7 10h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V9h14v9z'/></svg>") !important;
}
.en-dtp-wrap input::placeholder {
  color: #9ca3af;
}

/* Calendar popup */
.en-dtp-pop {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 9999;
  background: #fff;
  border: 1.5px solid #bbf7d0;
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0,60,120,.15);
  min-width: 248px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  padding: 12px;
  animation: enDtpFadeIn .12s ease;
}
@keyframes enDtpFadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Header: ‹ Month Year › */
.en-dtp-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.en-dtp-nav {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 17px;
  color: #15803d;
  padding: 2px 8px;
  border-radius: 4px;
  line-height: 1;
  transition: background .12s;
}
.en-dtp-nav:hover { background: #f0fdf4; }
.en-dtp-my {
  font-weight: 700;
  font-size: 12.5px;
  color: #1f2937;
}

/* Day grid */
.en-dtp-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.en-dtp-wd {
  font-size: 9.5px;
  font-weight: 700;
  color: #9ca3af;
  text-align: center;
  padding: 2px 0;
  user-select: none;
}
.en-dtp-day {
  text-align: center;
  padding: 5px 2px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 11.5px;
  color: #1f2937;
  transition: all .1s;
  user-select: none;
}
.en-dtp-day:hover:not(.other):not(.disabled) {
  background: #f0fdf4;
  color: #15803d;
}
.en-dtp-day.sel {
  background: #15803d;
  color: #fff;
  font-weight: 700;
}
.en-dtp-day.sel:hover {
  background: #16a34a;
  color: #fff;
}
.en-dtp-day.today:not(.sel) {
  border: 1.5px solid #bbf7d0;
}
.en-dtp-day.other {
  color: transparent;
  pointer-events: none;
}
.en-dtp-day.disabled {
  color: #d1d5db;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
