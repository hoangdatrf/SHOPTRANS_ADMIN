<template>
  <div class="admin-main">
    <div class="section-head">
      <div>
        <p>Content Management</p>
        <h1>Solutions Page</h1>
      </div>
      <div class="toolbar" style="gap:8px">
        <button class="primary-btn icon-text-btn" type="button" @click="saveData" :disabled="saving">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>

    <div v-if="notice" class="notice success">{{ notice }}</div>
    <div v-if="error" class="notice error">{{ error }}</div>

    <div v-if="loading" style="text-align:center;padding:40px;color:var(--muted);font-weight:700;">Loading data...</div>
    
    <div v-else class="content-sections">
      <!-- Hero Section -->
      <div class="panel">
        <div class="panel-header">
          <h3>Hero Section</h3>
        </div>
        <div class="panel-body form-grid">
          <label class="field" style="grid-column: 1 / -1">
            <span>Title (HTML allowed)</span>
            <input v-model="pageData.hero.title" type="text" />
          </label>
          <label class="field" style="grid-column: 1 / -1">
            <span>Description</span>
            <textarea v-model="pageData.hero.description" rows="3" style="width:100%; border:1px solid var(--line); border-radius:8px; padding:10px; font:inherit; font-size:13px;"></textarea>
          </label>
        </div>
      </div>

      <!-- Solutions Items Section -->
      <div class="panel mt-4">
        <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center;">
          <h3>Solutions Details</h3>
          <button class="primary-btn icon-text-btn" style="min-height:32px; font-size:12px;" type="button" @click="openCreateDetail">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            Add Solution Item
          </button>
        </div>
        <div class="table-wrap compact">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width: 15%">KEY</th>
                <th style="width: 22%">CATEGORY</th>
                <th style="width: 48%">TITLE</th>
                <th class="actions-col" style="width: 15%">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <!-- Main Keys -->
              <tr v-for="key in pageData.mainKeys" :key="key" :class="{ 'row-inactive': pageData.details[key]?.isActive === false }">
                <td><code class="icd-code">{{ key }}</code></td>
                <td><span class="status-pill active">MAIN LOGISTICS</span></td>
                <td>
                  <div class="detail-title-cell">
                    <img :src="resolveAdminSolutionImage(pageData.details[key]?.thumb || pageData.details[key]?.img)" :alt="pageData.details[key]?.title || key" />
                    <strong>{{ pageData.details[key]?.title }}</strong>
                  </div>
                </td>
                <td class="actions-col">
                  <button class="edit-row-btn" type="button" @click="openEditDetail(key, 'main')" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </button>
                  <button class="edit-row-btn" :class="pageData.details[key]?.isActive === false ? 'enable-row-btn' : 'disable-row-btn'" style="margin-left:8px;" type="button" @click="toggleDetailVisibility(key)" :title="pageData.details[key]?.isActive === false ? 'Enable on website' : 'Disable on website'">
                    <svg v-if="pageData.details[key]?.isActive !== false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </td>
              </tr>
              <!-- Value Keys -->
              <tr v-for="key in pageData.valueKeys" :key="key" :class="{ 'row-inactive': pageData.details[key]?.isActive === false }">
                <td><code class="icd-code">{{ key }}</code></td>
                <td><span class="status-pill active" style="background:#e0e7ff; color:#4338ca; border-color:#c7d2fe;">VALUE ADDED LOGISTICS</span></td>
                <td>
                  <div class="detail-title-cell">
                    <img :src="resolveAdminSolutionImage(pageData.details[key]?.thumb || pageData.details[key]?.img)" :alt="pageData.details[key]?.title || key" />
                    <strong>{{ pageData.details[key]?.title }}</strong>
                  </div>
                </td>
                <td class="actions-col">
                  <button class="edit-row-btn" type="button" @click="openEditDetail(key, 'value')" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </button>
                  <button class="edit-row-btn" :class="pageData.details[key]?.isActive === false ? 'enable-row-btn' : 'disable-row-btn'" style="margin-left:8px;" type="button" @click="toggleDetailVisibility(key)" :title="pageData.details[key]?.isActive === false ? 'Enable on website' : 'Disable on website'">
                    <svg v-if="pageData.details[key]?.isActive !== false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </td>
              </tr>
              <!-- Solution Keys -->
              <tr v-for="key in pageData.solutionKeys" :key="key" :class="{ 'row-inactive': pageData.details[key]?.isActive === false }">
                <td><code class="icd-code">{{ key }}</code></td>
                <td><span class="status-pill active" style="background:#fce7f3; color:#be185d; border-color:#fbcfe8;">VALUE ADDED SOLUTIONS</span></td>
                <td>
                  <div class="detail-title-cell">
                    <img :src="resolveAdminSolutionImage(pageData.details[key]?.thumb || pageData.details[key]?.img)" :alt="pageData.details[key]?.title || key" />
                    <strong>{{ pageData.details[key]?.title }}</strong>
                  </div>
                </td>
                <td class="actions-col">
                  <button class="edit-row-btn" type="button" @click="openEditDetail(key, 'solutions')" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                  </button>
                  <button class="edit-row-btn" :class="pageData.details[key]?.isActive === false ? 'enable-row-btn' : 'disable-row-btn'" style="margin-left:8px;" type="button" @click="toggleDetailVisibility(key)" :title="pageData.details[key]?.isActive === false ? 'Enable on website' : 'Disable on website'">
                    <svg v-if="pageData.details[key]?.isActive !== false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 0 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/></svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </td>
              </tr>
              <tr v-if="pageData.mainKeys.length === 0 && pageData.valueKeys.length === 0 && pageData.solutionKeys.length === 0">
                <td colspan="4" style="text-align:center; padding:30px; color:var(--muted);">No solutions added yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal for Solution Item -->
    <div v-if="modalOpen" class="modal-backdrop" role="presentation" @click.self="closeModal">
      <section class="account-dialog" role="dialog" aria-modal="true" style="max-width:720px;">
        <div class="modal-head">
          <div>
            <p>{{ modalMode === 'create' ? 'Add Solution Item' : 'Edit Solution Item' }}</p>
            <h2>{{ form.title || 'Solution Details' }}</h2>
          </div>
          <button class="icon-btn" type="button" aria-label="Close" @click="closeModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="modal-form" style="max-height: calc(100vh - 180px); overflow-y: auto;">
          <div class="form-grid" style="grid-template-columns: 1fr 1fr;">
            <label class="field">
              <span>Item Key (no spaces, e.g. cross-payment) *</span>
              <input v-model.trim="form.key" type="text" :disabled="modalMode === 'edit'" />
            </label>
            <label class="field">
              <span>Category *</span>
              <select v-model="form.category">
                <option value="main">Main Logistics Services</option>
                <option value="value">Value Added Logistics Services</option>
                <option value="solutions">Value Added Solutions</option>
              </select>
            </label>
            <label class="field" style="grid-column: 1 / -1">
              <span>Title (HTML allowed) *</span>
              <input v-model.trim="form.title" type="text" />
            </label>
            <label class="field" style="grid-column: 1 / -1">
              <span>Grid Title (HTML allowed, e.g. with &lt;br&gt;)</span>
              <input v-model.trim="form.gridTitle" type="text" />
            </label>
            <label class="field">
              <span>Full Image</span>
              <input v-model.trim="form.img" list="solution-image-options" type="text" placeholder="img53 or https://..." />
            </label>
            <label class="field">
              <span>Thumb Image</span>
              <input v-model.trim="form.thumb" list="solution-image-options" type="text" placeholder="img711 or https://..." />
            </label>
            <datalist id="solution-image-options">
              <option v-for="option in solutionImageOptions" :key="option.key" :value="option.key">
                {{ option.label }}
              </option>
            </datalist>
            <div class="image-preview-field">
              <span>Full Image Preview</span>
              <div class="image-preview-box">
                <img :src="resolveAdminSolutionImage(form.img)" :alt="form.img || 'Full image preview'" />
              </div>
            </div>
            <div class="image-preview-field">
              <span>Thumb Preview</span>
              <div class="image-preview-box">
                <img :src="resolveAdminSolutionImage(form.thumb || form.img)" :alt="form.thumb || form.img || 'Thumb preview'" />
              </div>
            </div>
            <label class="switch-row" style="grid-column: 1 / -1">
              <input v-model="form.isActive" type="checkbox" />
              <span>{{ form.isActive ? 'Active' : 'Inactive' }} (Show on website)</span>
            </label>
          </div>
          
          <div style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4 style="margin: 0; font-size: 14px;">Paragraphs</h4>
              <button class="ghost-btn" style="min-height: 28px; padding: 0 10px; font-size: 11px;" type="button" @click="addParagraph">
                + Add Paragraph
              </button>
            </div>
            <div v-for="(p, idx) in form.paragraphs" :key="idx" style="display:flex; gap:10px; margin-bottom: 10px; align-items:flex-start;">
              <textarea v-model="form.paragraphs[idx]" rows="2" style="flex:1; border:1px solid var(--line); border-radius:6px; padding:10px; font:inherit; font-size:13px;" placeholder="Paragraph content (HTML allowed)"></textarea>
              <button class="icon-btn" style="color:var(--red); margin-top:8px;" @click="form.paragraphs.splice(idx, 1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div v-if="!form.paragraphs || form.paragraphs.length === 0" style="color:var(--muted); font-size:12px;">No paragraphs added.</div>
          </div>

          <div style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4 style="margin: 0; font-size: 14px;">Bullets</h4>
              <button class="ghost-btn" style="min-height: 28px; padding: 0 10px; font-size: 11px;" type="button" @click="addBullet">
                + Add Bullet
              </button>
            </div>
            <label class="field" style="margin-bottom: 10px;">
              <span>Show bullets after paragraph index (-1 = do not auto show)</span>
              <input v-model.number="form.bulletsAfterIndex" type="number" min="-1" />
            </label>
            <div v-for="(bullet, idx) in form.bullets" :key="idx" class="bullet-editor-row">
              <label class="field bullet-label-field">
                <span>Label (optional)</span>
                <input v-model.trim="bullet.label" type="text" placeholder="e.g. Loading Supervision" />
              </label>
              <label class="field">
                <span>Text *</span>
                <textarea v-model="bullet.text" rows="2" style="width:100%; border:1px solid var(--line); border-radius:6px; padding:10px; font:inherit; font-size:13px;" placeholder="Bullet content"></textarea>
              </label>
              <button class="icon-btn" style="color:var(--red); margin-top:22px;" type="button" @click="form.bullets.splice(idx, 1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div v-if="!form.bullets || form.bullets.length === 0" style="color:var(--muted); font-size:12px;">No bullets added.</div>
          </div>

          <div style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <h4 style="margin: 0; font-size: 14px;">Options / Steps</h4>
              <button class="ghost-btn" style="min-height: 28px; padding: 0 10px; font-size: 11px;" type="button" @click="addOption">
                + Add Option
              </button>
            </div>
            <div v-for="(option, idx) in form.options" :key="idx" class="bullet-editor-row">
              <label class="field bullet-label-field">
                <span>Label (optional)</span>
                <input v-model.trim="option.label" type="text" placeholder="e.g. You share" />
              </label>
              <label class="field">
                <span>Text *</span>
                <textarea v-model="option.text" rows="2" style="width:100%; border:1px solid var(--line); border-radius:6px; padding:10px; font:inherit; font-size:13px;" placeholder="Option or step content"></textarea>
              </label>
              <button class="icon-btn" style="color:var(--red); margin-top:22px;" type="button" @click="form.options.splice(idx, 1)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
            <div v-if="!form.options || form.options.length === 0" style="color:var(--muted); font-size:12px;">No options or steps added.</div>
          </div>
          
          <div class="modal-actions">
            <button class="ghost-btn" type="button" @click="closeModal">Cancel</button>
            <button class="primary-btn" type="button" @click="applyDetail">
              {{ modalMode === 'create' ? 'Add Item' : 'Update Item' }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '~/store/user'
import img53 from '~/assets/img_53.jpg'
import img53s from '~/assets/img_53.png'
import img130 from '~/assets/img_130.png'
import img55 from '~/assets/img_55.png'
import img56 from '~/assets/img_56.jpg'
import img56s from '~/assets/img_56.png'
import img54 from '~/assets/img_54.png'
import img60 from '~/assets/img_60.jpg'
import img60s from '~/assets/img_60.png'
import img131 from '~/assets/img_131.png'
import img57 from '~/assets/img_57.png'
import img58 from '~/assets/img_58.png'
import img59 from '~/assets/img_59.png'
import img61 from '~/assets/img_61.png'
import img62 from '~/assets/img_62.png'
import img63 from '~/assets/img_63.png'
import img64 from '~/assets/img_64.png'
import img65 from '~/assets/img_65.png'
import img899 from '~/assets/img_899.png'
import img900 from '~/assets/img_900.png'
import img888 from '~/assets/img_888.png'
import img711 from '~/assets/img_711.png'
import img901 from '~/assets/img_901.png'
import img732 from '~/assets/img_732.png'
import img744 from '~/assets/img_744.png'
import img755 from '~/assets/img_755.png'
import img766 from '~/assets/img_766.png'
import img777 from '~/assets/img_777.png'
import img788 from '~/assets/img_788.png'
import img799 from '~/assets/img_799.png'
import img800 from '~/assets/img_800.png'
import img811 from '~/assets/img_811.png'
import img822 from '~/assets/img_822.png'
import img833 from '~/assets/img_833.png'
import img844 from '~/assets/img_844.png'
import img855 from '~/assets/img_855.png'
import img866 from '~/assets/img_866.png'
import img877 from '~/assets/img_877.png'

const API_BASE = useApiBaseUrl('/api')
const userStore = useUserStore()

const loading = ref(true)
const saving = ref(false)
const notice = ref('')
const error = ref('')

const solutionImageMap: Record<string, string> = {
  img53,
  img53s,
  img130,
  img55,
  img56,
  img56s,
  img54,
  img60,
  img60s,
  img131,
  img57,
  img58,
  img59,
  img61,
  img62,
  img63,
  img64,
  img65,
  img899,
  img900,
  img888,
  img711,
  img901,
  img732,
  img744,
  img755,
  img766,
  img777,
  img788,
  img799,
  img800,
  img811,
  img822,
  img833,
  img844,
  img855,
  img866,
  img877
}

const solutionImageOptions = Object.keys(solutionImageMap).map((key) => ({
  key,
  label: key
}))

const resolveAdminSolutionImage = (value: unknown) => {
  const key = String(value || '')
  return solutionImageMap[key] || key || img53
}

const modesTransportAdminDetail = {
  title: 'MODES OF TRANSPORT: SEA, AIR, RAIL, TRUCK',
  gridTitle: 'MODES OF TRANSPORT: </br>SEA, AIR, RAIL, TRUCK',
  img: 'img53',
  thumb: 'img711',
  paragraphs: [
    'SHOPTRANS delivers <strong>international transportation</strong> across every mode - sea, air, rail and road. Wherever your cargo moves, we handle the full chain of procedures so it flows smoothly and safely, end to end.',
    'These services are common in the industry, but we run them differently - <strong>orchestrated on a single integrated IT platform</strong>. Manage cross-border logistics in real time, from your office or home, without relying on traditional channels.'
  ],
  bullets: [
    'Real-time tracking, every leg',
    'Integrated customs & docs',
    'Seamless multimodal handover',
    'Manage from anywhere'
  ],
  bulletsAfterIndex: 1,
  isActive: true
}

const isLegacyModesAdminDetail = (value: any) => {
  if (!value || typeof value !== 'object') return true
  const firstParagraph = Array.isArray(value.paragraphs) ? String(value.paragraphs[0] || '') : ''
  return firstParagraph.includes('Shoptrans specializes in providing global international transportation services across all modes')
}

const termsTransportAdminDetail = {
  title: 'TERMS OF TRANSPORT: EXW, FCA, DAP, DDU, DDP,...',
  gridTitle: 'TERMS OF TRANSPORT:<br>EXW, FCA, DAP, DDU, DDP,...',
  img: 'img130',
  thumb: 'img901',
  paragraphs: [
    'In today\'s trade, partners are <strong>well-informed</strong> about each country\'s export and import regulations. Choosing the right shipping terms, backed by a solid read of the market, is how traders sharpen their competitive edge.',
    'SHOPTRANS tailors transportation to each customer\'s needs - <strong>whatever the term</strong>: EXW, FCA, FOB, DAP, DDU, DDP and beyond. Our next-generation, technology-driven system cuts errors versus manual handling, delivering professional service and a diverse, highly competitive range of logistics solutions.'
  ],
  options: ['EXW', 'FCA', 'FOB', 'DAP', 'DDU', 'DDP', '& more'],
  bullets: [
    'Any Incoterm, fully supported',
    'Export & import handled',
    'Tech-driven, fewer errors',
    'Smooth & safe goods movement'
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const internationalTradingAdminDetail = {
  title: 'INTERNATIONAL TRADING SERVICE',
  img: 'img55',
  thumb: 'img732',
  paragraphs: [
    'Beyond logistics, SHOPTRANS offers <strong>entrusted import-export</strong> and trade-agency services - representing you directly in every partner transaction and handling all export & import procedures. Through our trade agency, you sidestep key risks:'
  ],
  bullets: [
    'Avoids unprofessional transport & import-export handling',
    'Streamlines all related procedures',
    'Protects customer & source confidentiality',
    'Localizes global buying & selling',
    'Simplifies revenue/expense management & international payments'
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const combineSplitAdminDetail = {
  title: 'COMBINE BILLS AT POL / SPLIT D/O AT DESTINATION',
  gridTitle: 'COMBINE BILLS AT POL / SPLIT</br> D/O AT DESTINATION',
  img: 'img899',
  thumb: 'img755',
  paragraphs: [
    'When one vessel carries containers for several customers, issuing one Master B/L instead of many - then splitting House B/Ls per customer - <strong>cuts line charges at origin and unlocks D/O margin at destination</strong>. Worked example below: 1 vessel, 5 containers, 3 customers.'
  ],
  options: [
    { label: 'VN', text: 'Vietnam' },
    { label: 'ID', text: 'Indonesia' },
    { label: 'MY', text: 'Malaysia' },
    { label: 'TH', text: 'Thailand' },
    { label: 'KH', text: 'Cambodia' },
    { label: 'SG', text: 'Singapore' },
    { label: 'PH', text: 'Philippines' },
    { label: 'AE', text: 'UAE' },
    { label: 'KR', text: 'South Korea' },
    { label: '+ more', text: '' }
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const releaseDoAdminDetail = {
  title: 'RELEASE DELIVERY ORDER (D/O) TO CONSIGNEE(S) AT DESTINATION',
  img: 'img900',
  thumb: 'img732',
  paragraphs: [
    'As <strong>destination agent</strong>, SHOPTRANS represents the overseas origin agent to release Delivery Orders to the respective consignees for each nominated shipment - closing the final handover before cargo delivery.'
  ],
  bullets: [
    {
      label: 'D/O Release',
      text: 'Acting on behalf of the origin agent, SHOPTRANS issues the <strong>Delivery Order to each nominated consignee</strong>, matched per shipment.'
    },
    {
      label: 'Charges & Settlement',
      text: 'Coordinates directly with the shipping line to settle <strong>destination local charges</strong> or verify prepaid status, and handles collection & disbursement on the origin agent\'s instruction.'
    },
    {
      label: 'Value-Added Handling',
      text: 'Beyond D/O release - <strong>customs clearance, trucking, container unstuffing supervision</strong> and destination handling for smooth, efficient delivery.'
    }
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const transitServiceAdminDetail = {
  title: 'TRANSIT SERVICE: VIA VIET NAM TO LAOS / CAMBODIA / CHINA; VIA THAILAND TO CAMBODIA / MYANMAR',
  img: 'img131',
  thumb: 'img766',
  paragraphs: [
    'With over 3,000 km of coastline, <strong>Vietnam serves as a vital transit hub</strong>, helping neighboring countries such as Laos and Cambodia handle imports and exports through its seaports. Cross-border road access lets customers choose the route that best <strong>optimizes cost and logistics efficiency</strong>, based on the delivery location:',
    '<strong>SHOPTRANS</strong> guarantees professional service, straightforward procedures and effective solutions - saving time and cost for every customer.'
  ],
  bullets: [
    { label: 'To Laos', text: 'Cargo for <strong>Vientiane</strong> typically transits through <strong>Hai Phong Port</strong>, Vietnam.' },
    { label: 'To Cambodia', text: 'Cargo for <strong>Svay Rieng / Phnom Penh</strong> moves via <strong>Cat Lai Port</strong>, Vietnam.' },
    { label: 'To China', text: 'For <strong>Yunnan or Guangxi</strong>, transiting through <strong>Hai Phong Port</strong> is a cost-effective option.' },
    { label: 'Via Thailand', text: 'Depending on route distance, transit <strong>via Thailand</strong> into <strong>Cambodia or Myanmar</strong> is also viable.' }
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const oversizeServiceAdminDetail = {
  title: 'OVERSIZE / OVERWEIGHT / REEFER CARGO TRANSPORT',
  gridTitle: 'OVERSIZE / OVERWEIGHT / REEFER </br> CARGO TRANSPORT',
  img: 'img53s',
  thumb: 'img777',
  paragraphs: [
    'One of <strong>SHOPTRANS\' key services</strong> is the transport of oversize and overweight cargo - with comprehensive coverage from <strong>road to ocean freight</strong>, accommodating flat-rack, open-top and non-containerized bulk formats.'
  ],
  bullets: [
    {
      label: 'Specialist Handling',
      text: 'Backed by specialists in special cargo types, SHOPTRANS delivers <strong>safe, efficient transport</strong> while minimizing risk and reducing incidental costs.'
    },
    {
      label: 'Reefer Transport',
      text: 'A professional <strong>refrigerated-container</strong> provider for fruits, food, vegetables and other temperature-sensitive goods - a leading partner for smooth, seamless cold-cargo movement.'
    },
    {
      label: 'Cold-Chain Integrity',
      text: 'Strict procedures and regulations preserve cargo quality and value in transit; with deep <strong>cold-chain expertise</strong>, SHOPTRANS is a reliable partner worldwide.'
    }
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const warehousingServiceAdminDetail = {
  title: 'INTERNATIONAL WAREHOUSING',
  img: 'img60',
  thumb: 'img788',
  paragraphs: [
    '<strong>SHOPTRANS</strong> offers a variety of warehousing services to meet diverse needs - including <strong>general goods storage</strong>, <strong>bonded warehousing</strong>, and short-term or long-term storage solutions. Based on each client\'s specific requirements, we arrange the right facilities for <strong>efficient, cost-effective</strong> storage.'
  ],
  bullets: [
    {
      label: 'General Storage',
      text: 'Standard <strong>general goods storage</strong> for both short-term and long-term needs, with flexible space and handling.'
    },
    {
      label: 'Bonded Warehousing',
      text: 'Customs-supervised <strong>bonded facilities</strong> that let importers defer duty and tax until goods are released.'
    },
    {
      label: 'Tailored Facilities',
      text: 'We match the <strong>right warehouse to your cargo and requirements</strong>, keeping storage efficient and cost-effective at every step.'
    }
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const crossPaymentAdminDetail = {
  title: 'CROSS-COUNTRY PAYMENT AND COLLECTION',
  gridTitle: 'CROSS-COUNTRY PAYMENT </br> AND COLLECTION',
  img: 'img56s',
  thumb: 'img799',
  paragraphs: [
    'With an extensive network of branches worldwide, <strong>SHOPTRANS</strong> is a trusted partner for freight forwarding clients. Beyond logistics, we also facilitate <strong>efficient cross-border payment solutions</strong> - clients have two options:',
    'For example, a company in <strong>China</strong> using transport services in <strong>Vietnam</strong> can settle fees in <strong>RMB or USD with SHOPTRANS China</strong> - no need to remit directly to SHOPTRANS Vietnam. Paying Vietnam directly remains an option if preferred.',
    'This approach optimizes efficiency - especially for <strong>short-haul routes or urgent air shipments</strong> - letting clients simplify financial operations while enhancing transport performance. As a trusted partner, <strong>SHOPTRANS</strong> is dedicated to resolving your challenges effectively and efficiently.'
  ],
  bullets: [
    {
      label: 'Direct International Payment',
      text: 'Settle transactions <strong>directly from one country to another</strong>, paying the servicing branch wherever the work is performed.'
    },
    {
      label: 'Localized Payment via Branches',
      text: 'Pay service fees <strong>through a local SHOPTRANS branch</strong> in your own country and currency, without cross-border transfers.'
    }
  ],
  options: [
    'Reduced banking fees',
    'Minimized FX risk',
    'Streamlined documentation'
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const superviseStuffingAdminDetail = {
  title: 'SUPERVISE STUFFING AT ORIGIN AND UNSTUFFING AT DESTINATION',
  img: 'img57',
  thumb: 'img800',
  paragraphs: [
    '<strong>SHOPTRANS</strong> provides loading and unloading supervision to ensure goods are handled <strong>safely and correctly</strong> - verifying cargo condition, quantity and packaging at both ends of the journey.',
    'These services <strong>verify cargo condition, quantities and packaging</strong> while overseeing proper handling - preventing damages and losses throughout transport.'
  ],
  bullets: [
    {
      label: 'Loading Supervision · At Origin',
      text: 'Inspect <strong>goods condition, quantity and packaging</strong>, then oversee the stuffing process to ensure proper handling and <strong>secure stowage</strong>, preventing damage.'
    },
    {
      label: 'Unloading Supervision · At Destination',
      text: 'Monitor the unstuffing process, <strong>verify quantity and quality</strong> of goods, and ensure safe handling during delivery.'
    }
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const policyConsultationAdminDetail = {
  title: 'EXPORT-IMPORT POLICY CONSULTATION SERVICES',
  gridTitle: 'EXPORT-IMPORT POLICY</br> CONSULTATION SERVICES',
  img: 'img58',
  thumb: 'img811',
  paragraphs: [
    'Our consultation service keeps businesses <strong>updated and compliant with international trade regulations</strong>. It includes:',
    'This service helps businesses <strong>enhance efficiency, minimize risks and ensure compliance</strong> with regulations.'
  ],
  bullets: [
    { label: 'Customs & Taxes', text: 'Guidance on <strong>customs procedures, taxes and policies</strong> related to export and import.' },
    { label: 'Permits & Certifications', text: 'Advising on <strong>permits, certifications (C/O, CQ)</strong> and legal requirements for goods.' },
    { label: 'HS Code Classification', text: 'Analysis and application of the <strong>appropriate HS codes</strong>.' },
    { label: 'Risk Assessment', text: 'Assessment and mitigation of <strong>risks tied to taxes and international regulations</strong>.' },
    { label: 'Strategy Planning', text: 'Assistance in planning export-import strategies to <strong>optimize cost and time</strong>.' }
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const inspectionQualityAdminDetail = {
  title: 'INSPECTION AND QUALITY CONTROL SERVICES',
  gridTitle: 'INSPECTION AND QUALITY</br> CONTROL SERVICES',
  img: 'img59',
  thumb: 'img822',
  paragraphs: [
    'Inspection and quality control services ensure that goods <strong>meet all required standards and specifications</strong>. The services include:',
    'These services help businesses <strong>manage risks, enhance reputation, and ensure quality</strong> throughout the supply chain.'
  ],
  bullets: [
    { label: 'Quality Inspection', text: 'Assessing and verifying the <strong>quantity, quality, and specifications</strong> of goods according to the contract.' },
    { label: 'Goods Certification', text: 'Checking the condition, <strong>technical specifications</strong>, and compliance with <strong>international standards</strong>.' },
    { label: 'Quality Certification', text: 'Assisting clients in obtaining necessary certificates such as <strong>CQ, CO</strong>, and other required documents.' }
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const instantQuotationAdminDetail = {
  title: 'INSTANT QUOTATION',
  img: 'img60s',
  thumb: 'img833',
  paragraphs: [
    'The Instant Quotation service lets clients receive shipping cost information <strong>instantly</strong> through SHOPTRANS\' <strong>automated system</strong>.',
    'This service <strong>saves time and optimizes the transaction process</strong>.'
  ],
  bullets: [
    { label: 'Fast & Automated', text: 'Get cost information <strong>instantly</strong> - no waiting, generated by our automated quoting system.' },
    { label: 'Quick & Accurate', text: 'Quickly and <strong>accurately</strong> obtain quotes for international transportation services.' },
    { label: 'All Transport Modes', text: 'Covers <strong>sea freight, air freight, and road transport</strong>.' }
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const securityInfoAdminDetail = {
  title: 'SECURING CUSTOMER INFORMATION',
  img: 'img62',
  thumb: 'img855',
  paragraphs: [
    'With an extensive branch network, <strong>protecting customer information is a top priority</strong>. Our safeguards:',
    'Protecting data from <strong>unauthorized access and cyber threats</strong> - building trust in SHOPTRANS\' services.'
  ],
  bullets: [
    { label: 'Data Encryption', text: 'Personal & shipment data <strong>encrypted in transit and at rest</strong>.' },
    { label: 'Access Control', text: 'Only <strong>authorized personnel</strong> can reach sensitive information.' },
    { label: 'Regular Security Audits', text: 'Frequent <strong>audits & vulnerability assessments</strong> close potential gaps.' },
    { label: 'Employee Training', text: 'Staff regularly trained on <strong>data-protection protocols</strong>.' },
    { label: 'Compliance with Regulations', text: 'Aligned with <strong>GDPR</strong> and industry best practices across all branches.' }
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const minimizeExpensesAdminDetail = {
  title: 'MINIMIZING LOGISTICS EXPENSES',
  img: 'img63',
  thumb: 'img866',
  paragraphs: [
    'With an extensive branch network, SHOPTRANS <strong>effectively minimizes logistics expenses</strong> through:',
    'Thanks to its global network, SHOPTRANS <strong>optimizes transport costs</strong> while ensuring the most efficient logistics solutions.'
  ],
  bullets: [
    { label: 'Optimizing Routes', text: 'Shortest, most cost-effective routes via global branches - less time & fuel.' },
    { label: 'Consolidating Shipments', text: 'Group multiple orders into one shipment - lower cost per customer.' },
    { label: 'Multi-modal Transport', text: 'Combine sea, road & air to optimize cost across regions.' },
    { label: 'Automated Quotation', text: 'Instant optimized pricing - minimal negotiation cost.' },
    { label: 'Cross-border Payments', text: 'Pay via local branches - cut bank fees, FX gaps & paperwork.' }
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const combineStoreAdminDetail = {
  title: "COMBINE FEATURED SERVICES TO SHOPTRANS' STORE",
  img: 'img65',
  thumb: 'img877',
  paragraphs: [
    "SHOPTRANS doesn't have to build every service itself. Instead, we <strong>integrate unique services from trusted partners</strong> into one system for optimal customer solutions.",
    'Clients gain <strong>advanced logistics solutions</strong> that improve operational efficiency and reduce costs.'
  ],
  bullets: [
    { label: 'Integrate Trusted Partners', text: 'Bring <strong>specialized partner services</strong> into our platform instead of building everything in-house.' },
    { label: 'Offered As Our Own', text: "Partner products become part of <strong>SHOPTRANS' own logistics solutions</strong> - unified for the customer." },
    { label: 'Expand & Promote', text: 'Expands our offerings while letting partners <strong>promote their services</strong> to a wider client base.' }
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const nonstopServiceAdminDetail = {
  title: '24/7 NON-STOP SERVICE',
  img: 'img888',
  thumb: 'img888',
  paragraphs: [
    'Shoptrans offers 24/7 logistics services to ensure uninterrupted operations across different time zones. Our experienced team is available at all times to respond quickly to urgent requests, manage unexpected situations, and coordinate closely with partners, shipping lines, and local authorities.',
    'By providing round-the-clock support, Shoptrans helps customers minimize delays, reduce operational risks, and maintain full visibility and control over their shipments - at every stage of the logistics process.'
  ],
  bullets: [
    'Minimizes delays across different time zones',
    'Reduces operational risk on time-sensitive cargo',
    'Full visibility and control over every shipment',
    'Rapid response to schedule changes and last-minute instructions',
    'Live coordination with shipping lines and local authorities'
  ],
  bulletsAfterIndex: -1,
  isActive: true
}

const digitalLogisticsAdminDetail = {
  title: 'DIGITAL LOGISTICS SERVICES',
  img: 'img61',
  thumb: 'img844',
  paragraphs: [
    'SHOPTRANS\' Digital Logistics Services deliver <strong>comprehensive automation</strong> across your supply chain - from quoting to cargo handling, all through one system.',
    'Ideal for businesses aiming to <strong>improve efficiency, ensure transparency</strong>, and deliver the best customer experience across their supply chain.'
  ],
  bullets: [
    { label: 'Automation Solutions', text: 'Automated quotations and efficient cargo handling managed end-to-end through the platform.' },
    { label: 'Instant, Accurate Quotes', text: 'Receive accurate quotes quickly - no traditional procedures - saving time and costs.' },
    { label: 'Smart Handling & Tracking', text: 'The system handles and tracks shipments, optimizing processes and boosting operational effectiveness.' }
  ],
  bulletsAfterIndex: 0,
  isActive: true
}

const applySolutionAdminMigrations = () => {
  const existing = pageData.details.modes
  if (!pageData.mainKeys.includes('modes')) {
    pageData.mainKeys.unshift('modes')
  }
  if (isLegacyModesAdminDetail(existing)) {
    pageData.details.modes = {
      ...modesTransportAdminDetail,
      isActive: existing?.isActive !== false
    }
  }

  const termsTransportKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'terms' || title.startsWith('TERMS OF TRANSPORT')
  }) || 'terms'
  const termsTransportExisting = pageData.details[termsTransportKey]
  if (!pageData.mainKeys.includes(termsTransportKey)) {
    pageData.mainKeys.push(termsTransportKey)
  }
  const termsTransportFirstParagraph = Array.isArray(termsTransportExisting?.paragraphs)
    ? String(termsTransportExisting.paragraphs[0] || '')
    : ''
  if (!termsTransportExisting || termsTransportFirstParagraph.includes('In the modern era, trade between partners has significantly improved')) {
    pageData.details[termsTransportKey] = {
      ...termsTransportAdminDetail,
      isActive: termsTransportExisting?.isActive !== false
    }
  }

  const internationalTradingKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'international-trading' || title === 'INTERNATIONAL TRADING SERVICE'
  }) || 'international-trading'
  const internationalTradingExisting = pageData.details[internationalTradingKey]
  if (!pageData.mainKeys.includes(internationalTradingKey)) {
    pageData.mainKeys.push(internationalTradingKey)
  }
  const internationalTradingFirstParagraph = Array.isArray(internationalTradingExisting?.paragraphs)
    ? String(internationalTradingExisting.paragraphs[0] || '')
    : ''
  if (!internationalTradingExisting || internationalTradingFirstParagraph.includes('Shoptrans not only provides logistics services')) {
    pageData.details[internationalTradingKey] = {
      ...internationalTradingAdminDetail,
      isActive: internationalTradingExisting?.isActive !== false
    }
  }

  const combineSplitKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'combine-bills' || title.startsWith('COMBINE BILLS AT POL')
  }) || 'combine-bills'
  const combineSplitExisting = pageData.details[combineSplitKey]
  if (!pageData.mainKeys.includes(combineSplitKey)) {
    pageData.mainKeys.push(combineSplitKey)
  }
  const combineSplitFirstParagraph = Array.isArray(combineSplitExisting?.paragraphs)
    ? String(combineSplitExisting.paragraphs[0] || '')
    : ''
  if (!combineSplitExisting || combineSplitFirstParagraph.includes('Assume one vessel carries 5 containers')) {
    pageData.details[combineSplitKey] = {
      ...combineSplitAdminDetail,
      isActive: combineSplitExisting?.isActive !== false
    }
  }

  const releaseDoKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'release-do' || title.startsWith('RELEASE DELIVERY ORDER')
  }) || 'release-do'
  const releaseDoExisting = pageData.details[releaseDoKey]
  if (!pageData.mainKeys.includes(releaseDoKey)) {
    pageData.mainKeys.push(releaseDoKey)
  }
  const releaseDoFirstParagraph = Array.isArray(releaseDoExisting?.paragraphs)
    ? String(releaseDoExisting.paragraphs[0] || '')
    : ''
  if (!releaseDoExisting || releaseDoFirstParagraph.includes('Shoptrans acts as the destination agent')) {
    pageData.details[releaseDoKey] = {
      ...releaseDoAdminDetail,
      isActive: releaseDoExisting?.isActive !== false
    }
  }

  const transitServiceKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'transit' || title.startsWith('TRANSIT SERVICE')
  }) || 'transit'
  const transitServiceExisting = pageData.details[transitServiceKey]
  if (!pageData.mainKeys.includes(transitServiceKey)) {
    pageData.mainKeys.push(transitServiceKey)
  }
  const transitServiceFirstParagraph = Array.isArray(transitServiceExisting?.paragraphs)
    ? String(transitServiceExisting.paragraphs[0] || '')
    : ''
  if (!transitServiceExisting || transitServiceFirstParagraph.includes('Vietnam, a coastal nation with over 3,000 km')) {
    pageData.details[transitServiceKey] = {
      ...transitServiceAdminDetail,
      isActive: transitServiceExisting?.isActive !== false
    }
  }

  const oversizeServiceKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'oversize' || title.startsWith('OVERSIZE / OVERWEIGHT / REEFER')
  }) || 'oversize'
  const oversizeServiceExisting = pageData.details[oversizeServiceKey]
  if (!pageData.mainKeys.includes(oversizeServiceKey)) {
    pageData.mainKeys.push(oversizeServiceKey)
  }
  const oversizeServiceFirstParagraph = Array.isArray(oversizeServiceExisting?.paragraphs)
    ? String(oversizeServiceExisting.paragraphs[0] || '')
    : ''
  if (!oversizeServiceExisting || oversizeServiceFirstParagraph.includes("One of Shoptrans' key services is the transportation of oversize and overweight cargo")) {
    pageData.details[oversizeServiceKey] = {
      ...oversizeServiceAdminDetail,
      isActive: oversizeServiceExisting?.isActive !== false
    }
  }

  const warehousingServiceKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'warehousing' || title === 'INTERNATIONAL WAREHOUSING'
  }) || 'warehousing'
  const warehousingServiceExisting = pageData.details[warehousingServiceKey]
  if (!pageData.mainKeys.includes(warehousingServiceKey)) {
    pageData.mainKeys.push(warehousingServiceKey)
  }
  const warehousingServiceFirstParagraph = Array.isArray(warehousingServiceExisting?.paragraphs)
    ? String(warehousingServiceExisting.paragraphs[0] || '')
    : ''
  if (!warehousingServiceExisting || warehousingServiceFirstParagraph.includes('Shoptrans offers a variety of warehousing services to meet diverse needs')) {
    pageData.details[warehousingServiceKey] = {
      ...warehousingServiceAdminDetail,
      isActive: warehousingServiceExisting?.isActive !== false
    }
  }

  const crossPaymentKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'cross-payment' || title === 'CROSS-COUNTRY PAYMENT AND COLLECTION'
  }) || 'cross-payment'
  const crossPaymentExisting = pageData.details[crossPaymentKey]
  if (!pageData.valueKeys.includes(crossPaymentKey)) {
    pageData.valueKeys.push(crossPaymentKey)
  }
  const crossPaymentFirstParagraph = Array.isArray(crossPaymentExisting?.paragraphs)
    ? String(crossPaymentExisting.paragraphs[0] || '')
    : ''
  if (!crossPaymentExisting || crossPaymentFirstParagraph.includes('With an extensive network of branches worldwide, Shoptrans is a trusted partner')) {
    pageData.details[crossPaymentKey] = {
      ...crossPaymentAdminDetail,
      isActive: crossPaymentExisting?.isActive !== false
    }
  }

  const superviseStuffingKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'supervise-stuffing' || title.startsWith('SUPERVISE STUFFING AT ORIGIN')
  }) || 'supervise-stuffing'
  const superviseStuffingExisting = pageData.details[superviseStuffingKey]
  if (!pageData.valueKeys.includes(superviseStuffingKey)) {
    pageData.valueKeys.push(superviseStuffingKey)
  }
  const superviseStuffingFirstParagraph = Array.isArray(superviseStuffingExisting?.paragraphs)
    ? String(superviseStuffingExisting.paragraphs[0] || '')
    : ''
  if (!superviseStuffingExisting || superviseStuffingFirstParagraph.includes('Shoptrans provides loading and unloading supervision services')) {
    pageData.details[superviseStuffingKey] = {
      ...superviseStuffingAdminDetail,
      isActive: superviseStuffingExisting?.isActive !== false
    }
  }

  const policyConsultationKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'export-import-policy' || title === 'EXPORT-IMPORT POLICY CONSULTATION SERVICES'
  }) || 'export-import-policy'
  const policyConsultationExisting = pageData.details[policyConsultationKey]
  if (!pageData.valueKeys.includes(policyConsultationKey)) {
    pageData.valueKeys.push(policyConsultationKey)
  }
  const policyConsultationFirstParagraph = Array.isArray(policyConsultationExisting?.paragraphs)
    ? String(policyConsultationExisting.paragraphs[0] || '')
    : ''
  if (!policyConsultationExisting || policyConsultationFirstParagraph.includes('The export-import policy consultation service supports businesses')) {
    pageData.details[policyConsultationKey] = {
      ...policyConsultationAdminDetail,
      isActive: policyConsultationExisting?.isActive !== false
    }
  }

  const inspectionQualityKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'inspection-quality' || title === 'INSPECTION AND QUALITY CONTROL SERVICES'
  }) || 'inspection-quality'
  const inspectionQualityExisting = pageData.details[inspectionQualityKey]
  if (!pageData.valueKeys.includes(inspectionQualityKey)) {
    pageData.valueKeys.push(inspectionQualityKey)
  }
  const inspectionQualityFirstParagraph = Array.isArray(inspectionQualityExisting?.paragraphs)
    ? String(inspectionQualityExisting.paragraphs[0] || '')
    : ''
  if (!inspectionQualityExisting || inspectionQualityFirstParagraph.includes('Inspection and quality control services ensure that goods meet all required standards')) {
    pageData.details[inspectionQualityKey] = {
      ...inspectionQualityAdminDetail,
      isActive: inspectionQualityExisting?.isActive !== false
    }
  }

  const instantQuotationKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'instant-quotation' || title === 'INSTANT QUOTATION'
  }) || 'instant-quotation'
  const instantQuotationExisting = pageData.details[instantQuotationKey]
  if (!pageData.solutionKeys.includes(instantQuotationKey)) {
    pageData.solutionKeys.push(instantQuotationKey)
  }
  const instantQuotationFirstParagraph = Array.isArray(instantQuotationExisting?.paragraphs)
    ? String(instantQuotationExisting.paragraphs[0] || '')
    : ''
  if (!instantQuotationExisting || instantQuotationFirstParagraph.includes('The Instant Quotation service allows clients to receive shipping cost information instantly')) {
    pageData.details[instantQuotationKey] = {
      ...instantQuotationAdminDetail,
      isActive: instantQuotationExisting?.isActive !== false
    }
  }

  const securityInfoKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'securing-customer-information' || title === 'SECURING CUSTOMER INFORMATION'
  }) || 'securing-customer-information'
  const securityInfoExisting = pageData.details[securityInfoKey]
  if (!pageData.solutionKeys.includes(securityInfoKey)) {
    pageData.solutionKeys.push(securityInfoKey)
  }
  const securityInfoFirstParagraph = Array.isArray(securityInfoExisting?.paragraphs)
    ? String(securityInfoExisting.paragraphs[0] || '')
    : ''
  if (!securityInfoExisting || securityInfoFirstParagraph.includes('With an extensive network of branches, ensuring the security of customer information')) {
    pageData.details[securityInfoKey] = {
      ...securityInfoAdminDetail,
      isActive: securityInfoExisting?.isActive !== false
    }
  }

  const minimizeExpensesKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'minimize-expenses' || title === 'MINIMIZING LOGISTICS EXPENSES'
  }) || 'minimize-expenses'
  const minimizeExpensesExisting = pageData.details[minimizeExpensesKey]
  if (!pageData.solutionKeys.includes(minimizeExpensesKey)) {
    pageData.solutionKeys.push(minimizeExpensesKey)
  }
  const minimizeExpensesFirstParagraph = Array.isArray(minimizeExpensesExisting?.paragraphs)
    ? String(minimizeExpensesExisting.paragraphs[0] || '')
    : ''
  if (!minimizeExpensesExisting || minimizeExpensesFirstParagraph.includes('With an extensive network of branches, Shoptrans can effectively minimize logistics expenses')) {
    pageData.details[minimizeExpensesKey] = {
      ...minimizeExpensesAdminDetail,
      isActive: minimizeExpensesExisting?.isActive !== false
    }
  }

  const combineStoreKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'combine-featured' || title === "COMBINE FEATURED SERVICES TO SHOPTRANS' STORE"
  }) || 'combine-featured'
  const combineStoreExisting = pageData.details[combineStoreKey]
  if (!pageData.solutionKeys.includes(combineStoreKey)) {
    pageData.solutionKeys.push(combineStoreKey)
  }
  const combineStoreFirstParagraph = Array.isArray(combineStoreExisting?.paragraphs)
    ? String(combineStoreExisting.paragraphs[0] || '')
    : ''
  if (!combineStoreExisting || combineStoreFirstParagraph.includes("Shoptrans doesn't necessarily have to create all the logistics services it offers")) {
    pageData.details[combineStoreKey] = {
      ...combineStoreAdminDetail,
      isActive: combineStoreExisting?.isActive !== false
    }
  }

  const nonstopServiceKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'nonstop' || title === '24/7 NON-STOP SERVICE'
  }) || 'nonstop'
  const nonstopServiceExisting = pageData.details[nonstopServiceKey]
  if (!pageData.solutionKeys.includes(nonstopServiceKey)) {
    pageData.solutionKeys.push(nonstopServiceKey)
  }
  const nonstopServiceFirstParagraph = Array.isArray(nonstopServiceExisting?.paragraphs)
    ? String(nonstopServiceExisting.paragraphs[0] || '')
    : ''
  if (!nonstopServiceExisting || nonstopServiceFirstParagraph.includes('Shoptrans offers 24/7 logistics services to ensure uninterrupted operations across different time zones')) {
    pageData.details[nonstopServiceKey] = {
      ...nonstopServiceAdminDetail,
      isActive: nonstopServiceExisting?.isActive !== false
    }
  }

  const digitalLogisticsKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'digital-logistics' || title === 'DIGITAL LOGISTICS SERVICES'
  }) || 'digital-logistics'
  const digitalLogisticsExisting = pageData.details[digitalLogisticsKey]
  if (!pageData.solutionKeys.includes(digitalLogisticsKey)) {
    pageData.solutionKeys.push(digitalLogisticsKey)
  }
  const digitalLogisticsFirstParagraph = Array.isArray(digitalLogisticsExisting?.paragraphs)
    ? String(digitalLogisticsExisting.paragraphs[0] || '')
    : ''
  if (!digitalLogisticsExisting || digitalLogisticsFirstParagraph.includes("Shoptrans' Digital Logistics Services provide comprehensive automation solutions")) {
    pageData.details[digitalLogisticsKey] = {
      ...digitalLogisticsAdminDetail,
      isActive: digitalLogisticsExisting?.isActive !== false
    }
  }

  const overseasBookingKey = Object.keys(pageData.details).find((key) => {
    const title = String(pageData.details[key]?.title || '').replace(/<\/?[^>]+(>|$)/g, '').trim().toUpperCase()
    return key === 'overseas-booking' || title === 'OVERSEAS BOOKING AGENT'
  }) || 'overseas-booking'
  const overseasBookingExisting = pageData.details[overseasBookingKey]
  if (!pageData.mainKeys.includes(overseasBookingKey)) {
    pageData.mainKeys.push(overseasBookingKey)
  }
  const overseasBookingFirstParagraph = Array.isArray(overseasBookingExisting?.paragraphs)
    ? String(overseasBookingExisting.paragraphs[0] || '')
    : ''
  if (!overseasBookingExisting || overseasBookingFirstParagraph.includes('Shoptrans serves as a transportation agent')) {
    pageData.details[overseasBookingKey] = {
      title: 'OVERSEAS BOOKING AGENT',
      img: 'img56',
      thumb: 'img744',
      paragraphs: [
        'SHOPTRANS acts as your transportation agent through a <strong>vast network of branches worldwide</strong> - booking via our own contracted carriers, or using contracts you provide. An efficient origin-side agent for clients everywhere.'
      ],
      options: [
        { label: 'You share', text: 'the pre-established carrier contract details.' },
        { label: 'We liaise', text: 'with the carrier at origin to secure your booking.' },
        { label: 'Procedures handled', text: 'with the shipper promptly - seamless, low-risk.' }
      ],
      bulletsAfterIndex: -1,
      isActive: overseasBookingExisting?.isActive !== false
    }
  }
}

const pageData = reactive({
  hero: { title: '', description: '' },
  mainKeys: [] as string[],
  valueKeys: [] as string[],
  solutionKeys: [] as string[],
  details: {} as Record<string, any>
})

const fetchPageData = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/page-content/admin/solutions`, {
      headers: { 'Authorization': `Bearer ${userStore.token || ''}` }
    })
    const json = await res.json()
    const content = json.data?.data || json.data || json
    if (content && typeof content === 'object') {
      if (content.hero) pageData.hero = { ...pageData.hero, ...content.hero }
      if (Array.isArray(content.mainKeys)) pageData.mainKeys = [...content.mainKeys]
      if (Array.isArray(content.valueKeys)) pageData.valueKeys = [...content.valueKeys]
      if (Array.isArray(content.solutionKeys)) pageData.solutionKeys = [...content.solutionKeys]
      if (content.details) pageData.details = JSON.parse(JSON.stringify(content.details))
    }
    applySolutionAdminMigrations()
  } catch (e: any) {
    error.value = e.message || 'Failed to load page content'
  } finally {
    loading.value = false
  }
}

const saveData = async () => {
  saving.value = true
  notice.value = ''
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/page-content/admin/solutions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.token || ''}`
      },
      body: JSON.stringify({
        data: {
          hero: pageData.hero,
          mainKeys: pageData.mainKeys,
          valueKeys: pageData.valueKeys,
          solutionKeys: pageData.solutionKeys,
          details: pageData.details
        },
        isPublished: true
      })
    })
    if (!res.ok) throw new Error('Failed to save')
    notice.value = 'Solutions page content updated successfully.'
    setTimeout(() => { notice.value = '' }, 4000)
  } catch (e: any) {
    error.value = e.message || 'Error saving changes'
  } finally {
    saving.value = false
  }
}

// Modal State
const modalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')

const form = reactive({
  key: '',
  category: 'main' as 'main'|'value'|'solutions',
  title: '',
  gridTitle: '',
  img: '',
  thumb: '',
  paragraphs: [] as string[],
  bullets: [] as Array<{ label: string; text: string }>,
  bulletsAfterIndex: -1,
  options: [] as Array<{ label: string; text: string }>,
  isActive: true
})
let originalCategory = 'main'

const toBulletFormRows = (items: any[]) => items.map((item) => {
  if (item && typeof item === 'object') {
    return { label: String(item.label || ''), text: String(item.text || '') }
  }
  return { label: '', text: String(item || '') }
})

const toDetailBullets = () => form.bullets
  .map((item) => ({ label: item.label.trim(), text: item.text.trim() }))
  .filter((item) => item.label || item.text)
  .map((item) => item.label ? { label: item.label, text: item.text } : item.text)

const toDetailOptions = () => form.options
  .map((item) => ({ label: item.label.trim(), text: item.text.trim() }))
  .filter((item) => item.label || item.text)
  .map((item) => item.label ? { label: item.label, text: item.text } : item.text)

const openCreateDetail = () => {
  form.key = ''
  form.category = 'main'
  form.title = ''
  form.gridTitle = ''
  form.img = ''
  form.thumb = ''
  form.paragraphs = ['']
  form.bullets = []
  form.bulletsAfterIndex = -1
  form.options = []
  form.isActive = true
  modalMode.value = 'create'
  modalOpen.value = true
}

const openEditDetail = (key: string, category: 'main'|'value'|'solutions') => {
  const item = pageData.details[key] || {}
  form.key = key
  form.category = category
  originalCategory = category
  form.title = item.title || ''
  form.gridTitle = item.gridTitle || ''
  form.img = item.img || ''
  form.thumb = item.thumb || ''
  form.paragraphs = Array.isArray(item.paragraphs) ? [...item.paragraphs] : []
  form.bullets = Array.isArray(item.bullets) ? toBulletFormRows(item.bullets) : []
  form.bulletsAfterIndex = Number.isFinite(Number(item.bulletsAfterIndex)) ? Number(item.bulletsAfterIndex) : -1
  form.options = Array.isArray(item.options) ? toBulletFormRows(item.options) : []
  form.isActive = item.isActive !== false
  modalMode.value = 'edit'
  modalOpen.value = true
}

const addParagraph = () => {
  form.paragraphs.push('')
}

const addBullet = () => {
  form.bullets.push({ label: '', text: '' })
}

const addOption = () => {
  form.options.push({ label: '', text: '' })
}

const applyDetail = async () => {
  if (!form.key) {
    error.value = 'Item Key is required.'
    return
  }
  
  if (modalMode.value === 'create' && pageData.details[form.key]) {
    error.value = 'This Key already exists. Please use a unique key.'
    return
  }

  const existingDetail = pageData.details[form.key] || {}
  const nextBullets = toDetailBullets()
  const nextOptions = toDetailOptions()

  // Update or set details while preserving advanced fields like bullets/options.
  pageData.details[form.key] = {
    ...existingDetail,
    title: form.title,
    gridTitle: form.gridTitle,
    img: form.img,
    thumb: form.thumb,
    paragraphs: [...form.paragraphs],
    bullets: nextBullets.length ? nextBullets : undefined,
    bulletsAfterIndex: nextBullets.length ? Number(form.bulletsAfterIndex) : undefined,
    options: nextOptions.length ? nextOptions : undefined,
    isActive: form.isActive
  }

  // Handle category placement
  if (modalMode.value === 'create') {
    if (form.category === 'main') pageData.mainKeys.push(form.key)
    else if (form.category === 'value') pageData.valueKeys.push(form.key)
    else if (form.category === 'solutions') pageData.solutionKeys.push(form.key)
  } else {
    // If category changed, move it
    if (form.category !== originalCategory) {
      if (originalCategory === 'main') pageData.mainKeys = pageData.mainKeys.filter(k => k !== form.key)
      else if (originalCategory === 'value') pageData.valueKeys = pageData.valueKeys.filter(k => k !== form.key)
      else if (originalCategory === 'solutions') pageData.solutionKeys = pageData.solutionKeys.filter(k => k !== form.key)

      if (form.category === 'main') pageData.mainKeys.push(form.key)
      else if (form.category === 'value') pageData.valueKeys.push(form.key)
      else if (form.category === 'solutions') pageData.solutionKeys.push(form.key)
    }
  }

  await saveData()
  closeModal()
}

const toggleDetailVisibility = async (key: string) => {
  if (pageData.details[key]) {
    pageData.details[key].isActive = pageData.details[key].isActive === false
    await saveData()
  }
}

const closeModal = () => {
  modalOpen.value = false
}

onMounted(() => {
  fetchPageData()
})
</script>

<style scoped>
.admin-main { min-height: 100vh; margin-left: 280px; padding: 28px; }
.section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 24px; }
.section-head p { margin: 0 0 6px; color: var(--green-dark); font-size: 12px; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
.section-head h1 { margin: 0; font-size: clamp(28px, 3vw, 42px); line-height: 1; }
.toolbar { display: flex; align-items: center; }

.notice { margin-bottom: 14px; border-radius: 8px; padding: 11px 13px; font-size: 13px; font-weight: 750; }
.notice.success { background: var(--green-soft); color: var(--green-dark); border: 1px solid #bbf7d0; }
.notice.error { background: var(--red-soft); color: var(--red); border: 1px solid #fecaca; }

.panel { background: #fff; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
.panel-header { background: #f8fafc; padding: 16px 20px; border-bottom: 1px solid var(--line); }
.panel-header h3 { margin: 0; font-size: 16px; font-weight: 700; color: var(--ink); }
.panel-body { padding: 20px; }
.mt-4 { margin-top: 24px; }

.form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field span { font-size: 12px; font-weight: 800; color: var(--muted); }
.field input, .field select { width: 100%; height: 40px; border: 1px solid var(--line); border-radius: 8px; padding: 0 10px; font: inherit; font-size: 13px; background: #fff; color: var(--ink); outline: none; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(22,163,74,.12); }

.table-wrap { width: 100%; overflow-x: auto; }
.admin-table { width: 100%; min-width: 700px; border-collapse: collapse; table-layout: fixed; }
.admin-table th, .admin-table td { padding: 13px 14px; border-bottom: 1px solid #edf2f7; text-align: left; vertical-align: middle; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.admin-table th { color: #64748b; background: #f8fafc; font-size: 11px; font-weight: 850; letter-spacing: .06em; text-transform: uppercase; }
.admin-table tbody tr:last-child td { border-bottom: 0; }
.actions-col { text-align: right !important; white-space: nowrap; }

.icd-code { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 700; color: #16a34a; background: #f0fdf4; padding: 3px 8px; border-radius: 6px; border: 1px solid #bbf7d0; }
.status-pill { display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 800; }
.status-pill.active { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.row-inactive { opacity: .55; }
.detail-title-cell { display: grid; grid-template-columns: 48px minmax(0, 1fr); align-items: center; gap: 10px; }
.detail-title-cell img { width: 48px; height: 34px; object-fit: cover; border-radius: 6px; border: 1px solid var(--line); background: #f8fafc; }
.detail-title-cell strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.image-preview-field { display: flex; flex-direction: column; gap: 6px; }
.image-preview-field > span { font-size: 12px; font-weight: 800; color: var(--muted); }
.image-preview-box { height: 120px; border: 1px solid var(--line); border-radius: 8px; background: #f8fafc; overflow: hidden; display: grid; place-items: center; }
.image-preview-box img { width: 100%; height: 100%; object-fit: cover; }
.bullet-editor-row { display: grid; grid-template-columns: minmax(160px, 220px) minmax(0, 1fr) 36px; gap: 10px; margin-bottom: 10px; align-items: start; }
.bullet-label-field { min-width: 0; }

.primary-btn, .ghost-btn { min-height: 40px; border-radius: 8px; border: 1px solid transparent; padding: 0 14px; font: inherit; font-size: 13px; font-weight: 750; cursor: pointer; transition: all 0.15s; }
.primary-btn { background: var(--green); border-color: var(--green); color: #fff; }
.primary-btn:hover:not(:disabled) { background: var(--green-dark); border-color: var(--green-dark); }
.ghost-btn { background: #fff; border-color: var(--line); color: var(--ink); }
.ghost-btn:hover { background: #f1f5f9; }

.edit-row-btn { width: 34px; min-height: 34px; display: inline-grid; place-items: center; padding: 0; background: var(--ink); border: 1px solid var(--ink); border-radius: 8px; color: #fff; cursor: pointer; transition: opacity 0.15s; }
.edit-row-btn:hover { opacity: 0.85; }
.edit-row-btn svg { width: 15px; height: 15px; }
.disable-row-btn { background: #f97316; border-color: #f97316; }
.enable-row-btn { background: var(--green); border-color: var(--green); }
.icon-text-btn { display: inline-flex; align-items: center; gap: 6px; }
.icon-text-btn svg { width: 16px; height: 16px; }
.icon-btn { width: 36px; height: 36px; display: grid; place-items: center; border: 0; border-radius: 8px; background: transparent; cursor: pointer; color: var(--muted); }
.icon-btn:hover { background: #f1f5f9; color: var(--ink); }

.modal-backdrop { position: fixed; inset: 0; display: grid; place-items: center; background: rgba(15,23,42,.4); z-index: 1000; padding: 20px; }
.account-dialog { width: 100%; background: #fff; border-radius: 16px; box-shadow: 0 25px 60px rgba(15,23,42,.2); }
.modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 18px 22px 10px; border-bottom: 1px solid var(--line); }
.modal-head p { margin: 0 0 6px; color: var(--green-dark); font-size: 12px; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
.modal-head h2 { margin: 0; font-size: 24px; line-height: 1.2; }
.modal-form { padding: 18px 22px 22px; }
.switch-row { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; cursor: pointer; }
.switch-row input { width: 18px; height: 18px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 16px; margin-top: 20px; border-top: 1px solid var(--line); }
button:disabled { opacity: .55; cursor: not-allowed; }
</style>
