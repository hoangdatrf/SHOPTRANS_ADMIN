/**
 * Composable for FCL Draft auto-save and restore
 * Handles saving booking progress to backend per user
 */
import { ref } from 'vue'
import { useUserStore } from '~/store/user'

export function useFclDraft() {
  const userStore = useUserStore()
  const API_BASE = useApiBaseUrl('/api')
  const draftLoaded = ref(false)
  const draftSaving = ref(false)
  const draftId = ref<string | null>(null)
  const requireLogin = ref(false)
  let queuedSave: { currentStep: number; formData: Record<string, any> } | null = null
  let queuedSavePromise: Promise<void> | null = null
  let resolveQueuedSave: (() => void) | null = null

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userStore.token || ''}`
  })

  const isLoggedIn = () => !!userStore.token

  /** Load active draft from server */
  const loadDraft = async (): Promise<any | null> => {
    if (!isLoggedIn()) {
      requireLogin.value = true
      return null
    }
    try {
      const res = await fetch(`${API_BASE}/fcl/drafts/active`, { headers: getHeaders() })
      if (!res.ok) return null
      const json = await res.json()
      const draftData = json.data?.data || json.data
      if (draftData) {
        draftId.value = draftData.id
        draftLoaded.value = true
        return draftData
      }
      return null
    } catch (e) {
      console.error('Failed to load draft:', e)
      return null
    }
  }

  /** Save draft to server (debounced externally) */
  const saveDraft = async (currentStep: number, formData: Record<string, any>) => {
    if (!isLoggedIn()) return

    if (draftSaving.value) {
      queuedSave = { currentStep, formData }
      if (!queuedSavePromise) {
        queuedSavePromise = new Promise(resolve => {
          resolveQueuedSave = resolve
        })
      }
      return queuedSavePromise
    }

    draftSaving.value = true
    try {
      const res = await fetch(`${API_BASE}/fcl/drafts`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ currentStep, formData }),
      })
      if (res.ok) {
        const json = await res.json()
        const draftData = json.data?.data || json.data
        if (draftData?.id) draftId.value = draftData.id
      }
    } catch (e) {
      console.error('Failed to save draft:', e)
    } finally {
      draftSaving.value = false
      if (queuedSave) {
        const nextSave = queuedSave
        queuedSave = null
        await saveDraft(nextSave.currentStep, nextSave.formData)
        resolveQueuedSave?.()
        queuedSavePromise = null
        resolveQueuedSave = null
      }
    }
  }

  /** Submit final booking */
  const submitBooking = async () => {
    if (!isLoggedIn()) return null
    try {
      const res = await fetch(`${API_BASE}/fcl/drafts/submit`, {
        method: 'POST',
        headers: getHeaders(),
      })
      const json = await res.json()
      draftId.value = null
      return json
    } catch (e) {
      console.error('Failed to submit booking:', e)
      return null
    }
  }

  /** Discard active draft */
  const discardDraft = async () => {
    if (!isLoggedIn()) return
    try {
      await fetch(`${API_BASE}/fcl/drafts`, {
        method: 'DELETE',
        headers: getHeaders(),
      })
      draftId.value = null
    } catch (e) {
      console.error('Failed to discard draft:', e)
    }
  }

  return {
    draftLoaded,
    draftSaving,
    draftId,
    requireLogin,
    isLoggedIn,
    loadDraft,
    saveDraft,
    submitBooking,
    discardDraft,
  }
}
