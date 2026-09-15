<template>
  <div class="ws-page">
    <div class="ws-tabbar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="ws-tabbtn"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="ws-wrap">
      <WsMeeting v-if="activeTab === 'meet'" :request="request" />
      <WsDailyNotes v-else-if="activeTab === 'notes'" :request="request" />
      <WsFollowUp v-else-if="activeTab === 'follow'" :request="request" />
      <WsQuotation v-else-if="activeTab === 'quote'" :request="request" />
      <WsTimeSheet v-else-if="activeTab === 'time'" :request="request" />
    </div>
  </div>
</template>

<script setup lang="ts">
import WsMeeting from '~/components/admin/workspace/WsMeeting.vue'
import WsDailyNotes from '~/components/admin/workspace/WsDailyNotes.vue'
import WsFollowUp from '~/components/admin/workspace/WsFollowUp.vue'
import WsQuotation from '~/components/admin/workspace/WsQuotation.vue'
import WsTimeSheet from '~/components/admin/workspace/WsTimeSheet.vue'

const props = defineProps<{ request: (url: string, options?: any) => Promise<any> }>()

const request = props.request

const tabs = [
  { id: 'meet', label: 'Meeting Reminder' },
  { id: 'notes', label: 'Daily Notes' },
  { id: 'follow', label: 'Client Follow-up' },
  { id: 'quote', label: 'Quotation Builder' },
  { id: 'time', label: 'TimeSheet' },
]
const activeTab = ref('meet')
</script>

<style scoped>
.ws-page{height:100vh;min-height:0;display:flex;flex-direction:column;background:#f5faf6;color:#16241c;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:13px;overflow:hidden}
.ws-tabbar{display:flex;gap:4px;flex:0 0 auto;margin:0 0 6px;border-bottom:1px solid #c4e6d1;padding:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin}
.ws-tabbar::-webkit-scrollbar{height:6px}
.ws-tabbar::-webkit-scrollbar-thumb{background:#c4e6d1;border-radius:3px}
.ws-tabbtn{flex:0 0 auto;white-space:nowrap;display:flex;align-items:center;gap:7px;padding:9px 14px;border:0;background:none;color:#5d7567;border-bottom:2px solid transparent;border-radius:6px 6px 0 0;font:inherit;font-weight:650;font-size:13px;cursor:pointer}
.ws-tabbtn:hover{background:#eef9f1;color:#16241c}
.ws-tabbtn.active{color:#1b7a43;border-bottom-color:#22a155;background:#eef9f1}
.ws-wrap{flex:1;min-height:0;overflow:auto;padding:8px 18px 18px}
</style>
