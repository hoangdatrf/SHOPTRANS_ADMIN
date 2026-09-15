<template>
  <div class="support-widget-wrapper">
    <!-- Floating FAB -->
    <button class="support-fab" @click="togglePanel" v-show="!isPanelOpen">
      <span class="pulse"></span>
      <span>Online Support</span>
    </button>

    <!-- Panel -->
    <div class="support-panel" :class="{ hidden: !isPanelOpen }">
      
      <!-- Header -->
      <div class="panel-header">
        <div class="header-row">
          <div class="header-title">
            <button class="back-btn" :class="{ show: currentView !== 'main' }" @click="showView('main')" title="Back">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span class="status-dot" v-show="currentView === 'main'"></span>
            <h3>{{ headerTitle }}</h3>
          </div>
          <div class="header-actions">
            <button class="icon-btn" title="Minimize" @click="togglePanel">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <button class="icon-btn" title="Close" @click="togglePanel">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div class="header-meta" v-show="currentView === 'main'">
          <span class="green">● Agent ready</span>
        </div>
      </div>

      <!-- Body -->
      <div class="panel-body">
        
        <!-- MAIN VIEW -->
        <div class="view" :class="{ active: currentView === 'main' }">
          <div class="view-scroll" ref="mainScroll">
            
            <div class="section">
              <div class="sp-section-label">Direct Channels</div>
              <div class="channels">
                <a class="channel" href="https://wa.me/84281234567" target="_blank" rel="noopener">
                  <div class="channel-icon ch-wa">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.86 9.86 0 016.992 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.889 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <span class="channel-name">WhatsApp</span>
                </a>
                <a class="channel" href="https://zalo.me/84281234567" target="_blank" rel="noopener">
                  <div class="channel-icon ch-zalo">
                    <span style="font-family:'Geist Mono'; font-size:9px; font-weight:800; color:#fff; letter-spacing:-0.04em;">Zalo</span>
                  </div>
                  <span class="channel-name">Zalo</span>
                </a>
                <a class="channel" href="https://t.me/shoptrans" target="_blank" rel="noopener">
                  <div class="channel-icon ch-tg">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
                  </div>
                  <span class="channel-name">Telegram</span>
                </a>
                <a class="channel" href="#" @click.prevent="showWeChat">
                  <div class="channel-icon ch-wc">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M8.69 4.13c-3.86 0-7 2.65-7 5.91 0 1.79.95 3.4 2.46 4.49l-.44 1.55 1.74-.97c.62.18 1.27.28 1.94.31.18 0 .35 0 .52-.02-.11-.36-.17-.74-.17-1.13 0-2.83 2.62-5.13 5.85-5.13.18 0 .35.01.52.03-.51-2.83-3.34-5.04-6.42-5.04zm-2.46 2.7c.4 0 .73.32.73.72s-.33.72-.73.72-.73-.32-.73-.72.33-.72.73-.72zm4.92 0c.4 0 .73.32.73.72s-.33.72-.73.72-.73-.32-.73-.72.33-.72.73-.72zm6.34 3.45c-2.74 0-4.96 2.04-4.96 4.55 0 2.51 2.22 4.55 4.96 4.55.55 0 1.08-.09 1.58-.24l1.55.85-.4-1.32c1.16-.84 1.93-2.06 1.93-3.45 0-2.51-2.22-4.94-4.66-4.94zm-1.65 3.07c.27 0 .49.22.49.49s-.22.49-.49.49-.49-.22-.49-.49.22-.49.49-.49zm3.31 0c.27 0 .49.22.49.49s-.22.49-.49.49-.49-.22-.49-.49.22-.49.49-.49z"/></svg>
                  </div>
                  <span class="channel-name">WeChat</span>
                </a>
              </div>
            </div>

            <div class="section">
              <div class="sp-section-label">Hotline · 24/7</div>
              <div class="hotline">
                <div class="hotline-info">
                  <span class="hotline-num">+84 28 7300 8855</span>
                  <span class="hotline-hint">Toll-free in Vietnam</span>
                </div>
                <a href="tel:+842873008855" class="btn-call">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  Call now
                </a>
              </div>
            </div>

            <div class="section">
              <div class="sp-section-label">Quick Actions</div>
              <div class="quick-list">
                <button class="quick-item" @click="showView('track')">
                  <div class="quick-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div class="quick-text">
                    <span class="quick-title">Track a shipment</span>
                    <span class="quick-sub">B/L · Container · REF# NUMBER</span>
                  </div>
                  <svg class="quick-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                <button class="quick-item" @click="showView('newcase')">
                  <div class="quick-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                  </div>
                  <div class="quick-text">
                    <span class="quick-title">Submit a new case</span>
                    <span class="quick-sub">Auto-assign · SLA &lt; 4h</span>
                  </div>
                  <svg class="quick-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                <button class="quick-item" @click="showView('faq')">
                  <div class="quick-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div class="quick-text">
                    <span class="quick-title">FAQ &amp; guides</span>
                    <span class="quick-sub">Incoterms · Customs · Pricing</span>
                  </div>
                  <svg class="quick-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>

            <div class="section">
              <div class="sp-section-label">Active Case</div>
              
              <template v-if="openCases.length > 0">
                <div class="active-case" @click="showView('casedetail', { caseId: openCases[0].id })">
                  <div class="case-info">
                    <div class="case-id">#{{ openCases[0].id }}</div>
                    <div class="case-meta-row">
                      Last reply {{ openCases[0].lastReply }}
                      <span class="unread" v-if="openCases[0].unread > 0">{{ openCases[0].unread }} NEW</span>
                    </div>
                  </div>
                  <button class="btn-open" @click.stop="showView('casedetail', { caseId: openCases[0].id })">Open</button>
                </div>
                <div v-if="openCases.length > 1" style="font-family:Geist Mono,monospace;font-size:9px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.1em;padding:8px 2px 0;">
                  + {{ openCases.length - 1 }} more · <span style="color:var(--green);cursor:pointer;" @click="alert('Would open full case list')">view all</span>
                </div>
              </template>
              <template v-else>
                <div style="font-family:Geist Mono,monospace;font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.1em;padding:8px 0;">No active case</div>
              </template>

            </div>

          </div>
          
          <div class="view-footer">
            <div class="composer-meta">
              <span>Press Enter to send · Shift+Enter for new line</span>
              <span class="green">{{ msgInput.length }} / 2000</span>
            </div>
            <div class="composer-input">
              <textarea class="composer-textarea" v-model="msgInput" placeholder="Describe your issue, paste a B/L number, or ask anything..." @keydown.enter.exact.prevent="sendQuickMsg"></textarea>
              <div class="composer-actions">
                <div class="composer-tools">
                  <label class="tool-btn" :class="{ 'has-file': quickFiles.length > 0 }" title="Attach file">
                    <input type="file" hidden multiple @change="onQuickAttach">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                  </label>
                  <button class="tool-btn" title="Insert shipment ref" @click="insertShipRef">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  </button>
                  <button class="tool-btn" title="Emoji" @click="insertEmoji">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                  </button>
                </div>
                <button class="btn-send" :disabled="!msgInput.trim()" @click="sendQuickMsg">
                  Send
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TRACK VIEW -->
        <div class="view" :class="{ active: currentView === 'track' }">
          <div class="search-bar">
            <input type="text" class="search-input" v-model="trackSearchQuery" placeholder="Enter B/L · Container · REF# NUMBER...">
          </div>
          <div class="view-scroll">
            <div class="result-list">
              <template v-if="filteredShipments.length > 0">
                <div v-for="s in filteredShipments" :key="s.ref" class="ship-card" @click="openShipment(s.ref)">
                  <div class="ship-row">
                    <span class="ship-ref">{{ s.ref }}</span>
                    <span class="ship-type" :class="s.type.toLowerCase()">{{ s.type }}</span>
                  </div>
                  <div class="ship-route">
                    <span>{{ s.from }}</span>
                    <span class="arrow">→</span>
                    <span>{{ s.to }}</span>
                  </div>
                  <div class="ship-status dot">{{ s.status }}</div>
                </div>
              </template>
              <template v-else>
                <div class="result-empty">No shipment found</div>
              </template>
            </div>
          </div>
        </div>

        <!-- NEW CASE VIEW -->
        <div class="view" :class="{ active: currentView === 'newcase' }">
          <div class="view-scroll">
            <div class="form-body">
              <div class="form-group">
                <label class="form-label">Subject <span class="req">*</span></label>
                <input type="text" class="form-input" v-model="caseForm.subject" placeholder="Short summary of the issue">
              </div>
              <div class="form-group">
                <label class="form-label">Category <span class="req">*</span></label>
                <select class="form-select" v-model="caseForm.category">
                  <option value="">Select category...</option>
                  <option value="customs">Customs &amp; clearance</option>
                  <option value="documentation">Documentation (B/L, COO, etc.)</option>
                  <option value="delay">Shipment delay</option>
                  <option value="pricing">Pricing &amp; quotation</option>
                  <option value="damage">Damage / claim</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Related shipment</label>
                <input type="text" class="form-input" v-model="caseForm.shipment" placeholder="B/L, container or REF# NUMBER (optional)">
              </div>
              <div class="form-group">
                <label class="form-label">Description <span class="req">*</span></label>
                <textarea class="form-textarea" v-model="caseForm.desc" placeholder="Provide as much detail as possible..."></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Attachments</label>
                <label class="form-attach" :class="{ 'has-file': caseForm.files.length > 0 }">
                  <input type="file" hidden multiple @change="onCaseAttach">
                  <span>{{ caseForm.files.length > 0 ? ('✓ ' + (caseForm.files.length === 1 ? caseForm.files[0].name : caseForm.files.length + ' files attached')) : '+ Add files (drop or click)' }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="view-footer">
            <button class="btn-submit" :disabled="!isCaseFormValid" @click="submitCase">
              Submit case
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            </button>
          </div>
        </div>

        <!-- FAQ VIEW -->
        <div class="view" :class="{ active: currentView === 'faq' }">
          <div class="search-bar">
            <input type="text" class="search-input" v-model="faqSearchQuery" placeholder="Search FAQ...">
          </div>
          <div class="view-scroll">
            <div class="faq-list">
              <template v-if="Object.keys(filteredFaqGroups).length > 0">
                <template v-for="(items, cat) in filteredFaqGroups" :key="cat">
                  <div class="faq-cat-label">{{ cat }}</div>
                  <div v-for="(f, idx) in items" :key="f.q" class="faq-item" :class="{ open: faqOpenState[f.q] }">
                    <div class="faq-q" @click="faqOpenState[f.q] = !faqOpenState[f.q]">
                      <span>{{ f.q }}</span>
                      <svg class="faq-q-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    <div class="faq-a">{{ f.a }}</div>
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="result-empty">No FAQ matches</div>
              </template>
            </div>
          </div>
        </div>

        <!-- CASE DETAIL VIEW -->
        <div class="view" :class="{ active: currentView === 'casedetail' }" v-if="currentCaseData">
          <div class="case-header-meta">
            <span class="case-status-badge">Open</span>
            <span class="case-agent">Agent: <span class="name">{{ currentCaseData.agent }}</span></span>
          </div>
          <div class="view-scroll" ref="transcriptScroll">
            <div class="transcript">
              <div v-for="(m, i) in currentCaseData.messages" :key="i" class="msg" :class="m.type">
                <template v-if="m.type === 'system'">
                  <div class="msg-bubble">{{ m.text }}</div>
                </template>
                <template v-else>
                  <div class="msg-avatar">{{ m.type === 'agent' ? currentCaseData.agent.charAt(0) : 'U' }}</div>
                  <div>
                    <div class="msg-bubble" style="white-space: pre-wrap;">{{ m.text }}</div>
                    <div class="msg-time">{{ m.time || '' }}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="view-footer">
            <div class="composer-input">
              <textarea class="composer-textarea" v-model="replyInput" placeholder="Reply to the agent..." @keydown.enter.exact.prevent="sendReply"></textarea>
              <div class="composer-actions">
                <div class="composer-tools">
                  <button class="tool-btn" title="Attach file"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg></button>
                </div>
                <button class="btn-send" :disabled="!replyInput.trim()" @click="sendReply">
                  Reply
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Toast -->
      <div class="toast" :class="{ show: toast.show }">
        <div class="toast-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div class="toast-body">
          <div class="toast-title">{{ toast.title }}</div>
          <div class="toast-sub">{{ toast.sub }}</div>
        </div>
        <button class="toast-action" v-if="toast.actionLabel" @click="handleToastAction">{{ toast.actionLabel }}</button>
      </div>

      <!-- QR Overlay -->
      <div class="qr-overlay" :class="{ show: isQrOpen }" @click.self="isQrOpen = false">
        <div class="qr-modal">
          <div class="qr-title">Scan in WeChat</div>
          <div class="qr-image" v-html="qrSvg"></div>
          <div class="qr-id">
            <span class="label">WeChat ID</span>
            shoptrans_support
          </div>
          <button class="qr-close" @click="isQrOpen = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useUIStore } from '~/store/ui'

const uiStore = useUIStore()

const isPanelOpen = ref(false)
const togglePanel = () => { isPanelOpen.value = !isPanelOpen.value }

// Watch for external open trigger (e.g. from Footer Help Center)
watch(() => uiStore.showSupportPanel, (val) => {
  if (val) {
    isPanelOpen.value = true
    uiStore.closeSupportPanel()
  }
})

const currentView = ref('main')
const currentCaseId = ref<string | null>(null)

const headerTitle = computed(() => {
  if (currentView.value === 'track') return 'Track Shipment'
  if (currentView.value === 'newcase') return 'New Case'
  if (currentView.value === 'faq') return 'FAQ & Guides'
  if (currentView.value === 'casedetail') return `#${currentCaseId.value}`
  return 'Support // Online'
})

const showView = (view: string, opts?: any) => {
  currentView.value = view
  if (view === 'casedetail' && opts?.caseId) {
    currentCaseId.value = opts.caseId
    const c = cases.value.find(x => x.id === opts.caseId)
    if (c) c.unread = 0
    nextTick(() => {
      if (transcriptScroll.value) transcriptScroll.value.scrollTop = transcriptScroll.value.scrollHeight
    })
  }
}

// Data
const cases = ref<any[]>([
  {
    id: 'SC-2025-0142',
    subject: 'Customs clearance delay — HCM port',
    status: 'open',
    agent: 'Linh N.',
    lastReply: '14m ago',
    unread: 2,
    messages: [
      { type: 'system', text: 'Case opened · 2 hours ago' },
      { type: 'user', text: 'Container MAEU9821 has been at HCM port for 3 days. Status still shows "awaiting customs". Can you check?', time: '2h ago' },
      { type: 'agent', text: 'Hi, I\'m looking into this now. Can you confirm the B/L number and HS code on the declaration?', time: '1h 50m ago' },
      { type: 'user', text: 'B/L: MAEU-9821-3344. HS code 8471.30 (laptops).', time: '1h 45m ago' },
      { type: 'agent', text: 'Thanks. I\'ve contacted our customs broker. There\'s a missing certificate of origin causing the hold. We\'re preparing a substitute COO now.', time: '14m ago' },
      { type: 'agent', text: 'Expected resolution within 24h. I\'ll keep you updated. Sorry for the delay.', time: '14m ago' }
    ]
  }
])

const openCases = computed(() => cases.value.filter(c => c.status === 'open'))
const currentCaseData = computed(() => cases.value.find(c => c.id === currentCaseId.value))

const shipments = ref([
  { ref: 'MAEU-9821-3344', type: 'FCL', from: 'CNSHA', to: 'VNSGN', status: 'Awaiting customs clearance' },
  { ref: 'CMAU-7745-220', type: 'FCL', from: 'KRPUS', to: 'VNHPH', status: 'In transit · ETA Nov 12' },
  { ref: 'BL-AX-7789201',  type: 'AIR', from: 'JPNRT', to: 'VNSGN', status: 'Out for delivery' },
  { ref: 'CNTU-4421-09',   type: 'LCL', from: 'TWKHH', to: 'VNDAD', status: 'Delivered · Nov 02' },
  { ref: 'BKG-89231-VN',   type: 'FCL', from: 'SGSIN', to: 'VNSGN', status: 'Booking confirmed' }
])

const faqs = ref([
  { cat: 'Incoterms', q: 'What is the difference between FOB and CIF?', a: 'FOB (Free On Board): seller delivers goods on board the vessel at port of shipment; risk and cost transfer to buyer once goods are loaded. CIF (Cost, Insurance, Freight): seller pays cost, freight, and minimum insurance to destination port — but risk still transfers at port of loading. Use FOB if you have your own freight forwarder; CIF if you want the seller to handle everything to destination port.' },
  { cat: 'Incoterms', q: 'When should I use EXW vs DDP?', a: 'EXW (Ex Works): minimum seller responsibility — buyer arranges all transport from seller\'s premises. Best for experienced importers. DDP (Delivered Duty Paid): maximum seller responsibility — seller handles everything including duties at destination. Best for buyers who want a turnkey landed price but expect a higher unit cost.' },
  { cat: 'Customs', q: 'How long does customs clearance take in Vietnam?', a: 'Typical timeline: 1–3 working days for green-channel shipments (low risk), 3–7 days for yellow channel (document check), 5–14 days for red channel (physical inspection). Delays usually come from missing COO, mismatched HS codes, or value declarations under suspicion.' },
  { cat: 'Customs', q: 'What is HS code and why does it matter?', a: 'HS (Harmonized System) code is a 6–10 digit classification used worldwide. It determines duty rate, restrictions, and required permits. Wrong HS code = wrong duty + risk of penalty + clearance delay. Always verify against the official tariff schedule for your destination country.' },
  { cat: 'Documentation', q: 'B/L vs Sea Waybill — which should I use?', a: 'Bill of Lading (B/L): negotiable document of title — original required at destination to release cargo. Use when payment is not yet settled (LC, telex release). Sea Waybill (SWB): non-negotiable, no original needed — cargo released to named consignee. Faster, but only safe when buyer-seller trust is established.' },
  { cat: 'Documentation', q: 'When do I need a Certificate of Origin (COO)?', a: 'Required when claiming preferential duty under FTA (CPTPP, RCEP, EU-VN, etc.) or when destination country mandates it for specific goods. Form C/O type depends on the FTA — Form B for non-preferential, Form D for ASEAN, Form E for ACFTA, etc.' },
  { cat: 'Pricing', q: 'FCL vs LCL — which is cheaper?', a: 'Break-even is roughly 12–14 CBM. Below that → LCL (you pay only your portion of a shared container). Above that → FCL is cheaper because LCL has handling fees per CBM (CFS, THC, documentation) that scale linearly. FCL also avoids LCL deconsolidation delays at destination.' },
  { cat: 'Pricing', q: 'Why are there extra surcharges on my quote?', a: 'Common surcharges: BAF (bunker fuel), CAF (currency), THC (terminal handling), peak season surcharge, war risk, congestion fees. These are passed through from carriers and vary monthly. Always ask for an "all-in" quote to compare apples to apples.' },
  { cat: 'Tracking', q: 'How do I track my shipment?', a: 'Use the Track Shipment shortcut in this support panel and enter your B/L, container number, or booking ref. We aggregate carrier data, port events, and our own milestones into a single timeline.' }
])

// Helpers
const generateCaseId = () => 'SC-2025-' + String(143 + cases.value.length - 1).padStart(4, '0')
const alert = (m: string) => window.alert(m)

// MAIN COMPOSER
const msgInput = ref('')
const quickFiles = ref<File[]>([])
const mainScroll = ref<any>(null)

const onQuickAttach = (e: any) => {
  if (e.target.files) quickFiles.value = Array.from(e.target.files)
}
const insertShipRef = () => {
  const ref = shipments.value[0].ref
  msgInput.value = (msgInput.value + ' [Ref: ' + ref + '] ').trim() + ' '
}
const insertEmoji = () => {
  msgInput.value += '👋 '
}
const sendQuickMsg = () => {
  const text = msgInput.value.trim()
  if (!text) return
  const newId = generateCaseId()
  const subject = text.length > 60 ? text.slice(0, 57) + '...' : text
  cases.value.unshift({
    id: newId,
    subject,
    status: 'open',
    agent: 'Auto-assigning...',
    lastReply: 'just now',
    unread: 0,
    messages: [
      { type: 'system', text: 'Case opened · just now' },
      { type: 'user', text, time: 'just now' },
      { type: 'agent', text: 'Thanks for reaching out. An agent will be with you shortly. Your case has been queued with high priority.', time: 'just now' }
    ]
  })
  msgInput.value = ''
  quickFiles.value = []
  
  if (mainScroll.value) {
    nextTick(() => { mainScroll.value.scrollTop = 0 })
  }
  
  showToast('Case created', '#' + newId, 'View', () => showView('casedetail', { caseId: newId }))
}

// TRACKING
const trackSearchQuery = ref('')
const filteredShipments = computed(() => {
  const q = trackSearchQuery.value.trim().toLowerCase()
  if (!q) return shipments.value
  return shipments.value.filter(s => 
    s.ref.toLowerCase().includes(q) || s.from.toLowerCase().includes(q) ||
    s.to.toLowerCase().includes(q) || s.type.toLowerCase().includes(q)
  )
})
const openShipment = (ref: string) => {
  showToast('Opening tracking', ref + ' · redirect to tracking page', 'OK')
}

// NEW CASE
const caseForm = ref({ subject: '', category: '', shipment: '', desc: '', files: [] as File[] })
const isCaseFormValid = computed(() => caseForm.value.subject && caseForm.value.category && caseForm.value.desc)
const onCaseAttach = (e: any) => {
  if (e.target.files) caseForm.value.files = Array.from(e.target.files)
}
const submitCase = () => {
  const newId = generateCaseId()
  const fullDesc = (caseForm.value.shipment ? `[Ref: ${caseForm.value.shipment}]\n` : '') + caseForm.value.desc
  cases.value.unshift({
    id: newId,
    subject: caseForm.value.subject,
    status: 'open',
    agent: 'Auto-assigning...',
    lastReply: 'just now',
    unread: 0,
    messages: [
      { type: 'system', text: `Case opened · category: ${caseForm.value.category}` },
      { type: 'user', text: fullDesc, time: 'just now' },
      { type: 'agent', text: `Case received. An agent specializing in ${caseForm.value.category} will respond within SLA (4h). You can attach more docs at any time.`, time: 'just now' }
    ]
  })
  caseForm.value = { subject: '', category: '', shipment: '', desc: '', files: [] }
  showView('main')
  showToast('Case submitted', '#' + newId + ' · agent assigning', 'View', () => showView('casedetail', { caseId: newId }))
}

// FAQ
const faqSearchQuery = ref('')
const faqOpenState = ref<Record<string, boolean>>({})
const filteredFaqGroups = computed(() => {
  const q = faqSearchQuery.value.trim().toLowerCase()
  let items = faqs.value
  if (q) {
    items = items.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.cat.toLowerCase().includes(q))
  }
  const groups: Record<string, typeof items> = {}
  items.forEach(f => {
    if (!groups[f.cat]) groups[f.cat] = []
    groups[f.cat].push(f)
  })
  return groups
})

// CASE DETAIL
const replyInput = ref('')
const transcriptScroll = ref<any>(null)
const sendReply = () => {
  const text = replyInput.value.trim()
  if (!text || !currentCaseData.value) return
  
  currentCaseData.value.messages.push({ type: 'user', text, time: 'just now' })
  currentCaseData.value.lastReply = 'just now'
  replyInput.value = ''
  
  nextTick(() => {
    if (transcriptScroll.value) transcriptScroll.value.scrollTop = transcriptScroll.value.scrollHeight
  })
  
  setTimeout(() => {
    if (currentCaseData.value) {
      currentCaseData.value.messages.push({ type: 'agent', text: 'Got it. Let me check and get back to you shortly.', time: 'just now' })
      if (currentView.value === 'casedetail' && currentCaseId.value === currentCaseData.value.id) {
        nextTick(() => {
          if (transcriptScroll.value) transcriptScroll.value.scrollTop = transcriptScroll.value.scrollHeight
        })
      } else {
        currentCaseData.value.unread += 1
      }
    }
  }, 1500)
}

// TOAST
const toast = ref({ show: false, title: '', sub: '', actionLabel: '', actionFn: null as any })
let toastTimer: any = null
const showToast = (title: string, sub: string, actionLabel = '', actionFn: any = null) => {
  toast.value = { show: true, title, sub, actionLabel, actionFn }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value.show = false }, 4500)
}
const handleToastAction = () => {
  if (toast.value.actionFn) toast.value.actionFn()
  toast.value.show = false
}

// WECHAT QR
const isQrOpen = ref(false)
const qrSvg = computed(() => {
  const size = 25
  let svg = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">`
  const seed = 'shoptrans_support'
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  const rng = (x: number, y: number) => {
    let n = (hash + x * 73 + y * 31) & 0xFFFF
    n = (n * 9301 + 49297) % 233280
    return n / 233280
  }
  const drawFinder = (x: number, y: number) => {
    svg += `<rect x="${x}" y="${y}" width="7" height="7" fill="black"/>`
    svg += `<rect x="${x+1}" y="${y+1}" width="5" height="5" fill="white"/>`
    svg += `<rect x="${x+2}" y="${y+2}" width="3" height="3" fill="black"/>`
  }
  drawFinder(0, 0)
  drawFinder(size - 7, 0)
  drawFinder(0, size - 7)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inFinder = (x < 8 && y < 8) || (x >= size - 8 && y < 8) || (x < 8 && y >= size - 8)
      if (inFinder) continue
      if (rng(x, y) > 0.55) {
        svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="black"/>`
      }
    }
  }
  svg += `</svg>`
  return svg
})
const showWeChat = () => { isQrOpen.value = true }
</script>

<style scoped>
.support-widget-wrapper {
  --green: #00A651;
  --green-2: #008F45;
  --green-glow: rgba(0, 166, 81, 0.18);
  --bg: #FFFFFF;
  --bg-2: #F4F7F5;
  --bg-3: #E9ECEB;
  --bg-4: #E0E5E2;
  --border: #E0E5E2;
  --border-2: #D1D9D4;
  --text: #050A07;
  --text-2: #242B28;
  --text-3: #525C57;
  --amber: #FFB300;
  --red: #FF5252;
  font-family: 'Geist', Arial, Helvetica, sans-serif;
  z-index: 10000;
  position: relative;
}

.support-widget-wrapper * {
  box-sizing: border-box;
}

/* === FAB === */
.support-fab {
  position: fixed; bottom: 24px; right: 24px;
  background: var(--bg-2);
  border: 1px solid var(--border-2);
  color: var(--text);
  padding: 12px 18px 12px 14px;
  border-radius: 999px;
  display: flex; align-items: center; gap: 10px;
  cursor: pointer;
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  transition: all 0.2s;
  box-shadow: 0 8px 28px rgba(0,0,0,0.15);
  z-index: 10000;
}
.support-fab:hover {
  border-color: var(--green);
  box-shadow: 0 8px 28px var(--green-glow);
  transform: translateY(-1px);
}
.pulse {
  width: 8px; height: 8px;
  background: var(--green);
  border-radius: 50%;
  animation: support-pulse 2s infinite;
  flex-shrink: 0;
}
@keyframes support-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(0, 166, 81, 0.6); }
  70%  { box-shadow: 0 0 0 8px rgba(0, 166, 81, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 166, 81, 0); }
}

/* === Panel === */
.support-panel {
  position: fixed;
  bottom: 24px; right: 24px;
  width: 400px;
  height: calc(100vh - 48px);
  max-height: 680px;
  background: var(--bg);
  border: 1px solid var(--border-2);
  border-radius: 14px;
  overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: 0 24px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0, 166, 81, 0.04);
  z-index: 10000;
  text-align: left;
}
.support-panel.hidden { display: none; }

/* Header */
.panel-header {
  background: linear-gradient(180deg, #FFFFFF 0%, var(--bg-2) 100%);
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  position: relative;
  flex-shrink: 0;
}
.panel-header::before {
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--green), transparent);
  opacity: 0.45;
}
.header-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 6px;
}
.header-title { display: flex; align-items: center; gap: 10px; min-width: 0; }
.status-dot {
  width: 8px; height: 8px;
  background: var(--green);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--green);
  flex-shrink: 0;
}
.header-title h3 {
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
.back-btn {
  width: 24px; height: 24px;
  background: transparent;
  border: 1px solid var(--border-2);
  border-radius: 6px;
  color: var(--text-2);
  cursor: pointer;
  display: none;
  align-items: center; justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
  padding: 0;
}
.back-btn:hover { color: var(--green); border-color: var(--green); }
.back-btn.show { display: flex; }
.header-actions { display: flex; gap: 4px; flex-shrink: 0; }
.icon-btn {
  width: 28px; height: 28px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--text-2);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  padding: 0;
}
.icon-btn:hover {
  background: var(--bg-3);
  color: var(--text);
  border-color: var(--border);
}
.header-meta {
  display: flex; align-items: center; gap: 8px;
  font-family: 'Geist Mono', monospace;
  font-size: 10px; color: var(--text-2);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.header-meta .sep { color: var(--text-3); }
.header-meta .green { color: var(--green); }

/* Panel body */
.panel-body {
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
}

.view {
  display: none;
  height: 100%;
  width: 100%;
  flex-direction: column;
}
.view.active { display: flex; }

.view-scroll {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-2) transparent;
}
.view-scroll::-webkit-scrollbar { width: 6px; }
.view-scroll::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 3px; }

.view-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--border);
  background: var(--bg-2);
  padding: 12px;
}

.section { padding: 14px 16px; border-bottom: 1px solid var(--border); }
.section:last-child { border-bottom: 0; }

.sp-section-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 10px;
  display: flex; align-items: center; gap: 6px;
}
.sp-section-label::before {
  content: ''; width: 4px; height: 4px;
  background: var(--green); border-radius: 50%;
}

/* Channels */
.channels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.channel {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 4px;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  color: var(--text);
}
.channel:hover {
  border-color: var(--green);
  background: var(--bg-3);
  transform: translateY(-1px);
}
.channel-icon {
  width: 28px; height: 28px;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
}
.channel-name {
  font-family: 'Geist Mono', monospace;
  font-size: 9px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-2);
}
.channel:hover .channel-name { color: var(--text); }
.ch-wa  { background: #25D366; }
.ch-zalo{ background: #0068FF; }
.ch-tg  { background: #229ED9; }
.ch-wc  { background: #07C160; }

/* Hotline */
.hotline {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
}
.hotline-info { display: flex; flex-direction: column; gap: 2px; }
.hotline-num {
  font-family: 'Geist Mono', monospace;
  font-size: 14px; font-weight: 600;
  color: var(--text); letter-spacing: 0.03em;
}
.hotline-hint {
  font-family: 'Geist Mono', monospace;
  font-size: 9px; color: var(--text-3);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.btn-call {
  background: var(--green); color: #fff;
  border: 0; padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Geist Mono', monospace;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  text-decoration: none;
  transition: all 0.15s;
}
.btn-call:hover { background: var(--green-2); color: #fff; }

/* Quick actions */
.quick-list { display: flex; flex-direction: column; gap: 4px; }
.quick-item {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 10px 12px;
  display: flex; align-items: center; gap: 10px;
  cursor: pointer;
  transition: all 0.15s;
  color: var(--text);
  text-align: left; width: 100%;
}
.quick-item:hover {
  border-color: var(--border-2);
  background: var(--bg-2);
}
.quick-item:hover .quick-arrow { color: var(--green); transform: translateX(2px); }
.quick-icon {
  width: 30px; height: 30px;
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  color: var(--green); flex-shrink: 0;
}
.quick-text { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.quick-title { font-size: 13px; font-weight: 500; color: var(--text); }
.quick-sub {
  font-family: 'Geist Mono', monospace;
  font-size: 9px; color: var(--text-3);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.quick-arrow { color: var(--text-3); transition: all 0.15s; flex-shrink: 0; }

/* Active case */
.active-case {
  background: linear-gradient(135deg, rgba(0, 166, 81, 0.07) 0%, transparent 100%);
  border: 1px solid rgba(0, 166, 81, 0.22);
  border-radius: 8px;
  padding: 12px 14px;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  position: relative; overflow: hidden;
  cursor: pointer;
  transition: all 0.15s;
}
.active-case:hover { border-color: var(--green); }
.active-case::before {
  content: ''; position: absolute;
  left: 0; top: 0; bottom: 0; width: 2px;
  background: var(--green);
}
.case-info { flex: 1; min-width: 0; }
.case-id {
  font-family: 'Geist Mono', monospace;
  font-size: 12px; font-weight: 700;
  color: var(--green); letter-spacing: 0.05em;
}
.case-meta-row {
  font-family: 'Geist Mono', monospace;
  font-size: 9px; color: var(--text-2);
  margin-top: 2px;
  text-transform: uppercase; letter-spacing: 0.08em;
  display: flex; align-items: center; gap: 6px;
}
.unread {
  background: var(--green); color: #fff;
  padding: 1px 6px; border-radius: 999px;
  font-weight: 700; font-size: 9px;
}
.btn-open {
  background: var(--bg-3);
  border: 1px solid var(--border-2);
  color: var(--text);
  padding: 7px 12px;
  border-radius: 6px;
  font-family: 'Geist Mono', monospace;
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-open:hover {
  background: var(--green); color: #fff; border-color: var(--green);
}

/* Composer */
.composer-meta {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
  font-family: 'Geist Mono', monospace;
  font-size: 9px; color: var(--text-3);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.composer-meta .green { color: var(--green); }
.composer-input {
  background: var(--bg);
  border: 1px solid var(--border-2);
  border-radius: 8px;
  padding: 10px;
  display: flex; flex-direction: column; gap: 8px;
  transition: border-color 0.15s;
}
.composer-input:focus-within { border-color: var(--green); }
.composer-textarea {
  background: transparent;
  border: 0;
  color: var(--text);
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  resize: none; outline: none;
  width: 100%; min-height: 36px;
  line-height: 1.45;
}
.composer-textarea::placeholder { color: var(--text-3); }
.composer-actions {
  display: flex; align-items: center; justify-content: space-between;
}
.composer-tools { display: flex; gap: 2px; }
.tool-btn {
  width: 28px; height: 28px;
  background: transparent; border: 0;
  border-radius: 5px;
  color: var(--text-3);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  padding: 0;
}
.tool-btn:hover { background: var(--bg-3); color: var(--green); }
.tool-btn.has-file { color: var(--green); }
.btn-send {
  background: var(--green); color: #fff;
  border: 0; padding: 7px 14px;
  border-radius: 6px;
  font-family: 'Geist Mono', monospace;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  transition: all 0.15s;
}
.btn-send:disabled {
  background: var(--bg-3); color: var(--text-3);
  cursor: not-allowed;
}
.btn-send:not(:disabled):hover { background: var(--green-2); color: #fff; }

/* === Sub-view: Track === */
.search-bar {
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-2);
}
.search-input {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border-2);
  border-radius: 8px;
  padding: 10px 12px 10px 36px;
  color: var(--text);
  font-family: 'Geist Mono', monospace;
  font-size: 12px;
  outline: none;
  transition: border-color 0.15s;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%235A625D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
}
.search-input:focus { border-color: var(--green); }
.search-input::placeholder { color: var(--text-3); text-transform: uppercase; letter-spacing: 0.05em; font-size: 11px; }

.result-list { padding: 12px 16px; display: flex; flex-direction: column; gap: 6px; }
.result-empty {
  padding: 32px 16px;
  text-align: center;
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.ship-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.ship-card:hover { border-color: var(--green); background: var(--bg-3); }
.ship-row { display: flex; justify-content: space-between; align-items: center; }
.ship-ref {
  font-family: 'Geist Mono', monospace;
  font-size: 12px; font-weight: 600;
  color: var(--text); letter-spacing: 0.03em;
}
.ship-type {
  font-family: 'Geist Mono', monospace;
  font-size: 9px; font-weight: 700;
  letter-spacing: 0.1em;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--bg-3);
  border: 1px solid var(--border-2);
  color: var(--text-2);
}
.ship-type.fcl { color: var(--green); border-color: rgba(0, 166, 81, 0.3); }
.ship-type.lcl { color: var(--amber); border-color: rgba(255,179,0,0.3); }
.ship-type.air { color: #4FC3F7; border-color: rgba(79,195,247,0.3); }
.ship-route {
  margin-top: 6px;
  font-family: 'Geist Mono', monospace;
  font-size: 11px; color: var(--text-2);
  display: flex; align-items: center; gap: 6px;
}
.ship-route .arrow { color: var(--green); }
.ship-status {
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-2);
}
.ship-status.dot::before {
  content: '●';
  margin-right: 6px;
  color: var(--green);
}

/* === Sub-view: New Case === */
.form-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label {
  font-family: 'Geist Mono', monospace;
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-2);
  display: flex; align-items: center; gap: 6px;
}
.form-label .req { color: var(--green); }
.form-input, .form-select, .form-textarea {
  background: var(--bg-2);
  border: 1px solid var(--border-2);
  border-radius: 7px;
  padding: 10px 12px;
  color: var(--text);
  font-family: 'Geist', sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}
.form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--green); }
.form-textarea { resize: vertical; min-height: 80px; line-height: 1.5; }
.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2300E676' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}
.form-select option {
  background: var(--bg-2);
  color: var(--text);
}
.form-attach {
  background: var(--bg-2);
  border: 1px dashed var(--border-2);
  border-radius: 7px;
  padding: 14px;
  text-align: center;
  cursor: pointer;
  color: var(--text-2);
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: all 0.15s;
}
.form-attach:hover { border-color: var(--green); color: var(--green); }
.form-attach.has-file { border-color: var(--green); color: var(--green); border-style: solid; }
.btn-submit {
  width: 100%;
  background: var(--green); color: #fff;
  border: 0;
  padding: 12px;
  border-radius: 7px;
  font-family: 'Geist Mono', monospace;
  font-size: 12px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.15s;
}
.btn-submit:disabled { background: var(--bg-3); color: var(--text-3); cursor: not-allowed; }
.btn-submit:not(:disabled):hover { background: var(--green-2); color: #fff; }

/* === Sub-view: FAQ === */
.faq-list { padding: 8px 16px 16px; display: flex; flex-direction: column; gap: 6px; }
.faq-cat-label {
  font-family: 'Geist Mono', monospace;
  font-size: 9px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-3);
  padding: 12px 0 4px;
}
.faq-item {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 7px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.faq-item.open { border-color: rgba(0, 166, 81, 0.3); }
.faq-q {
  padding: 11px 12px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  font-size: 13px;
  color: var(--text);
  font-weight: 500;
}
.faq-q:hover { background: var(--bg-3); }
.faq-q-icon {
  color: var(--text-3);
  transition: transform 0.2s;
  flex-shrink: 0;
}
.faq-item.open .faq-q-icon { transform: rotate(180deg); color: var(--green); }
.faq-a {
  padding: 0 12px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s, padding 0.25s;
  font-size: 12.5px;
  color: var(--text-2);
  line-height: 1.55;
  border-top: 1px solid transparent;
}
.faq-item.open .faq-a {
  padding: 10px 12px 12px;
  max-height: 400px;
  border-top-color: var(--border);
}

/* === Sub-view: Case detail === */
.case-header-meta {
  padding: 12px 16px;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 8px;
  flex-shrink: 0;
}
.case-status-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(0, 166, 81, 0.1);
  border: 1px solid rgba(0, 166, 81, 0.3);
  color: var(--green);
  padding: 3px 8px;
  border-radius: 999px;
  font-family: 'Geist Mono', monospace;
  font-size: 9px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
}
.case-status-badge::before {
  content: ''; width: 6px; height: 6px;
  background: var(--green); border-radius: 50%;
}
.case-agent {
  font-family: 'Geist Mono', monospace;
  font-size: 10px; color: var(--text-2);
  text-transform: uppercase; letter-spacing: 0.08em;
}
.case-agent .name { color: var(--text); }

.transcript {
  padding: 14px 16px;
  display: flex; flex-direction: column; gap: 12px;
}
.msg { display: flex; gap: 8px; max-width: 85%; }
.msg.user { align-self: flex-end; flex-direction: row-reverse; }
.msg.system { align-self: center; max-width: 100%; }
.msg-avatar {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: var(--bg-3);
  border: 1px solid var(--border-2);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Geist Mono', monospace;
  font-size: 9px; font-weight: 700;
  color: var(--green);
  flex-shrink: 0;
}
.msg.user .msg-avatar { background: var(--bg-3); color: var(--text); }
.msg-bubble {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 8px 11px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--text);
}
.msg.user .msg-bubble {
  background: rgba(0, 166, 81, 0.08);
  border-color: rgba(0, 166, 81, 0.25);
}
.msg-time {
  font-family: 'Geist Mono', monospace;
  font-size: 9px;
  color: var(--text-3);
  margin-top: 3px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.msg.user .msg-time { text-align: right; }
.msg.system .msg-bubble {
  background: transparent;
  border: 0;
  border-top: 1px dashed var(--border-2);
  border-bottom: 1px dashed var(--border-2);
  border-radius: 0;
  padding: 6px 0;
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  color: var(--text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
}

/* === Toast === */
.toast {
  position: absolute;
  bottom: 12px; left: 12px; right: 12px;
  background: var(--bg-3);
  border: 1px solid var(--green);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15), 0 0 0 1px rgba(0, 166, 81, 0.1);
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s;
  z-index: 50;
}
.toast.show { transform: translateY(0); opacity: 1; }
.toast-icon {
  width: 24px; height: 24px;
  background: var(--green);
  color: #fff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.toast-body { flex: 1; min-width: 0; }
.toast-title { font-size: 12px; font-weight: 600; color: var(--text); }
.toast-sub {
  font-family: 'Geist Mono', monospace;
  font-size: 10px;
  color: var(--text-2);
  margin-top: 1px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.toast-action {
  background: var(--green);
  color: #fff;
  border: 0;
  padding: 5px 10px;
  border-radius: 5px;
  font-family: 'Geist Mono', monospace;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}
.toast-action:hover { background: var(--green-2); color: #fff; }

/* === QR Modal (WeChat) === */
.qr-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  display: none;
  align-items: center; justify-content: center;
  z-index: 200;
  padding: 20px;
}
.qr-overlay.show { display: flex; }
.qr-modal {
  background: var(--bg);
  border: 1px solid var(--green);
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  max-width: 280px;
  text-align: center;
  box-shadow: 0 0 60px rgba(0, 166, 81, 0.2);
}
.qr-title {
  font-family: 'Geist Mono', monospace;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--green);
  margin-bottom: 14px;
}
.qr-image {
  width: 180px; height: 180px;
  margin: 0 auto;
  background: white;
  border-radius: 6px;
  padding: 10px;
  display: flex; align-items: center; justify-content: center;
}
.qr-image :deep(svg) { width: 100%; height: 100%; }
.qr-id {
  font-family: 'Geist Mono', monospace;
  font-size: 11px;
  color: var(--text);
  margin-top: 14px;
  letter-spacing: 0.05em;
}
.qr-id .label { color: var(--text-3); display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 3px; }
.qr-close {
  margin-top: 14px;
  background: var(--bg-3);
  border: 1px solid var(--border-2);
  color: var(--text);
  padding: 8px 16px;
  border-radius: 6px;
  font-family: 'Geist Mono', monospace;
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  cursor: pointer;
}
.qr-close:hover { border-color: var(--green); color: var(--green); }

/* Mobile */
@media (max-width: 480px) {
  .support-panel {
    width: calc(100vw - 16px);
    right: 8px; bottom: 8px;
    height: calc(100vh - 16px);
    max-height: none;
  }
  .support-fab { right: 12px; bottom: 12px; }
}
</style>
