<template>
  <div class="admin-main">
    <div class="section-head">
      <div>
        <p>{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <span>{{ description }}</span>
      </div>
      <div class="toolbar">
        <NuxtLink class="ghost-btn" :to="publicPath" target="_blank">Preview</NuxtLink>
        <button class="ghost-btn" type="button" @click="loadSample">Load template</button>
        <button class="primary-btn" type="button" :disabled="saving" @click="saveContent">
          {{ saving ? 'Saving...' : 'Save content' }}
        </button>
      </div>
    </div>

    <div v-if="notice" class="notice success">{{ notice }}</div>
    <div v-if="error" class="notice error">{{ error }}</div>

    <section class="editor-shell">
      <div class="editor-meta">
        <label class="field">
          <span>Page title</span>
          <input v-model.trim="contentTitle" type="text" />
        </label>
        <label class="switch-row">
          <input v-model="isPublished" type="checkbox" />
          <span>{{ isPublished ? 'Published' : 'Draft only' }}</span>
        </label>
      </div>

      <div class="editor-help">
        <strong>Editable page data</strong>
        <span>Update the JSON below, then save. Public pages read this data immediately and fall back to the current hardcoded data if no content has been saved.</span>
      </div>

      <textarea
        v-model="jsonText"
        class="json-editor"
        spellcheck="false"
        :disabled="loading"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '~/store/user'

const props = defineProps<{
  pageSlug: string
  title: string
  description: string
  publicPath: string
  sampleData: Record<string, unknown>
  eyebrow?: string
}>()

const API_BASE = useApiBaseUrl('/api')
const userStore = useUserStore()

const eyebrow = computed(() => props.eyebrow || 'Page Content')
const loading = ref(false)
const saving = ref(false)
const notice = ref('')
const error = ref('')
const contentTitle = ref(props.title)
const isPublished = ref(true)
const jsonText = ref(JSON.stringify(props.sampleData, null, 2))

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${userStore.token || ''}`,
})

const loadSample = () => {
  jsonText.value = JSON.stringify(props.sampleData, null, 2)
  notice.value = 'Template loaded. Review and save when ready.'
  error.value = ''
}

const fetchContent = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/page-content/admin/${encodeURIComponent(props.pageSlug)}`, {
      headers: headers(),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => null)
      throw new Error(json?.message || 'Unable to load content.')
    }
    const json = await res.json()
    const data = json.data || json
    if (data?.id) {
      contentTitle.value = data.title || props.title
      isPublished.value = data.isPublished !== false
      jsonText.value = JSON.stringify(data.data || {}, null, 2)
    }
  } catch (e: any) {
    error.value = e.message || 'Unable to load content.'
  } finally {
    loading.value = false
  }
}

const saveContent = async () => {
  error.value = ''
  notice.value = ''
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(jsonText.value)
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
      throw new Error('Root JSON must be an object.')
    }
  } catch (e: any) {
    error.value = e.message || 'Invalid JSON.'
    return
  }

  saving.value = true
  try {
    const res = await fetch(`${API_BASE}/page-content/admin/${encodeURIComponent(props.pageSlug)}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({
        title: contentTitle.value,
        data: parsed,
        isPublished: isPublished.value,
      }),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => null)
      throw new Error(json?.message || 'Save failed.')
    }
    notice.value = 'Saved successfully. Public page will use this data on reload.'
    setTimeout(() => { notice.value = '' }, 4000)
  } catch (e: any) {
    error.value = e.message || 'Save failed.'
  } finally {
    saving.value = false
  }
}

onMounted(fetchContent)
</script>

<style scoped>
.admin-main { min-height: 100vh; margin-left: 280px; padding: 28px; }
.section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 18px; }
.section-head p { margin: 0 0 6px; color: var(--green-dark); font-size: 12px; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
.section-head h1 { margin: 0; font-size: clamp(28px, 3vw, 42px); line-height: 1; }
.section-head span { display: block; margin-top: 8px; color: var(--muted); font-size: 14px; max-width: 720px; }
.toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.primary-btn, .ghost-btn { min-height: 40px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; border: 1px solid transparent; padding: 0 14px; font: inherit; font-size: 13px; font-weight: 750; cursor: pointer; text-decoration: none; }
.primary-btn { background: var(--green); border-color: var(--green); color: #fff; }
.primary-btn:hover:not(:disabled) { background: var(--green-dark); }
.ghost-btn { background: #fff; border-color: var(--line); color: var(--ink); }
button:disabled { opacity: .55; cursor: not-allowed; }
.notice { margin-bottom: 14px; border-radius: 8px; padding: 11px 13px; font-size: 13px; font-weight: 750; }
.notice.success { background: var(--green-soft); color: var(--green-dark); border: 1px solid #bbf7d0; }
.notice.error { background: var(--red-soft); color: var(--red); border: 1px solid #fecaca; }
.editor-shell { border: 1px solid var(--line); border-radius: 8px; background: #fff; overflow: hidden; }
.editor-meta { display: grid; grid-template-columns: minmax(260px, 1fr) auto; gap: 16px; align-items: end; padding: 16px; border-bottom: 1px solid var(--line); background: #f8fafc; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field span { font-size: 12px; font-weight: 800; color: var(--muted); }
.field input { width: 100%; height: 40px; border: 1px solid var(--line); border-radius: 8px; padding: 0 10px; font: inherit; font-size: 13px; background: #fff; color: var(--ink); outline: none; }
.switch-row { height: 40px; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 750; color: var(--ink); }
.editor-help { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 12px 16px; border-bottom: 1px solid var(--line); color: var(--muted); font-size: 13px; }
.editor-help strong { color: var(--ink); }
.json-editor { width: 100%; min-height: calc(100vh - 280px); display: block; border: 0; resize: vertical; padding: 18px; outline: none; color: #0f172a; background: #fff; font: 13px/1.55 "DM Mono", Consolas, monospace; tab-size: 2; }
@media (max-width: 900px) {
  .admin-main { margin-left: 0; padding: 18px; }
  .section-head { align-items: flex-start; flex-direction: column; }
  .editor-meta { grid-template-columns: 1fr; }
  .editor-help { align-items: flex-start; flex-direction: column; }
}
</style>
