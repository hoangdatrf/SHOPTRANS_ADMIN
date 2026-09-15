<template>
  <main class="adm">
    <header v-if="!isWorkspacePage" class="topbar">
      <div class="brand admin-brand-link" role="link" tabindex="0" title="Go to Operations" @click="setPage('wb_efa_fcl')" @keydown.enter.prevent="setPage('wb_efa_fcl')">
        <div class="brand-mark">S</div>
        <div>
          <div class="brand-name">SHOP<span>TRANS</span></div>
          <div class="brand-sub">Management System</div>
        </div>
      </div>
      <div class="spacer"></div>
      <span class="tb-label">Country</span>
      <div class="country-dd" :class="{ open: countryOpen }">
        <button class="cdd-btn" type="button" :class="{ fixed: !canSwitchCountry }" :disabled="!canSwitchCountry" @click="toggleCountryMenu">
          <img :src="flagUrl(currentCountry.flag)" alt="" />
          <span>{{ currentCountry.name }}</span>
          <svg v-if="canSwitchCountry" class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div v-if="canSwitchCountry" class="cdd-menu" :class="{ show: countryOpen }">
          <button
            v-for="country in countries"
            :key="country.id"
            class="cdd-item"
            :class="{ on: country.id === state.country }"
            type="button"
            @click="setCountry(country.id)"
          >
            <img :src="flagUrl(country.flag)" alt="" />
            <span>{{ country.name }}</span>
            <span v-if="country.id === state.country" v-html="icons.check"></span>
          </button>
        </div>
      </div>
    </header>

    <div class="shell" :class="{ 'workbook-shell': isWorkspacePage, 'sidebar-collapsed': sidebarCollapsed }" :style="isWorkspacePage ? { '--sidew': `${sidebarWidth}px` } : undefined">
      <aside class="sidebar" :class="{ edit: state.editMenu }">
        <div v-if="isWorkspacePage" class="workbook-brand admin-brand-link" role="link" tabindex="0" title="Go to Operations" @click="setPage('wb_efa_fcl')" @keydown.enter.prevent="setPage('wb_efa_fcl')">
          <div class="brand-mark">S</div>
          <div>
            <div class="brand-name">SHOP<span style="color:var(--g-500)">TRANS</span></div>
            <div class="brand-sub">Management System</div>
          </div>
        </div>
        <div class="side-top">
          <span class="side-top-label">Menu</span>
          <div class="side-actions">
            <button v-if="state.editMenu" class="edit-toggle icon-only" type="button" title="Reset menu" @click="resetMenu">
              <span v-html="icons.db"></span>
            </button>
            <button class="edit-toggle" type="button" :class="{ on: state.editMenu }" @click="state.editMenu = !state.editMenu">
              <span v-html="icons.edit"></span>
              <span>{{ state.editMenu ? 'Done' : 'Edit' }}</span>
            </button>
          </div>
        </div>

        <div class="sidebar-scroll">
        <section v-for="group in sidebarNav" :key="group.id" class="nav-group" :class="{ open: groupIsOpen(group), salesnav: group.id === 'sales' || group.id === 'salesmkt' }">
          <div class="nav-head" :class="{ active: groupIsActive(group) }" @click="selectGroup(group)">
            <span class="ni" v-html="icons[group.icon] || icons.tag"></span>
            <span class="nh-label">{{ group.label }}</span>
            <span v-if="state.editMenu" class="nh-actions" @click.stop>
              <button class="nh-act" type="button" title="Rename category" @click="renameGroup(group)" v-html="icons.edit"></button>
              <button v-if="!lockedGroupIds.includes(group.id)" class="nh-act del" type="button" title="Delete category" @click="deleteGroup(group)" v-html="icons.trash"></button>
            </span>
            <span v-else v-html="icons.chev"></span>
          </div>
          <div class="nav-items">
            <template v-if="group.sections?.length">
              <section
                v-for="section in group.sections"
                :key="section.id"
                class="nav-subgroup"
                :data-ops-section="group.id === 'operations' ? (section.color || section.id) : null"
              >
                <button class="nav-subhead" :class="{ 'ops-subhead': group.id === 'operations', 'sales-subhead': group.id === 'sales' || group.id === 'salesmkt', active: sectionIsActive(section), exp: sectionIsOpen(section) }" type="button" @click="selectSection(group, section)">
                  <span class="ni" v-html="icons[section.icon] || icons.tag"></span>
                  <span v-if="group.id === 'operations'" class="ops-subtitle">
                    <b>{{ opsSectionCode(section.label) }}</b>
                    <span>{{ opsSectionSuffix(section.label) }}</span>
                  </span>
                  <template v-else>{{ section.label }}</template>
                  <span v-if="group.id === 'operations'" class="ops-chev" v-html="icons.chev"></span>
                </button>
                <template v-if="sectionIsOpen(section)">
                  <div v-for="item in section.items" :key="item.id" class="nav-item-row">
                    <button
                      class="nav-item lvl2"
                      type="button"
                      :class="{ active: isNavItemActive(item), 'sales-leaf': group.id === 'sales' || group.id === 'salesmkt' }"
                      @click="setPage(item.id)"
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </template>
              </section>
            </template>
            <template v-else>
              <div v-for="item in group.items" :key="item.id" class="nav-item-row">
                <button
                  class="nav-item"
                  type="button"
                  :class="{ active: isNavItemActive(item) }"
                  @click="setPage(item.id)"
                >
                  {{ item.label }}
                </button>
                <span v-if="state.editMenu" class="ni-actions">
                  <button class="ni-act" type="button" title="Rename item" @click="renameItem(group, item)" v-html="icons.edit"></button>
                  <button class="ni-act del" type="button" title="Delete item" @click="deleteItem(group, item)" v-html="icons.trash"></button>
                </span>
              </div>
              <button v-if="state.editMenu" class="nav-add" type="button" @click="addItem(group)">
                <span v-html="icons.plus"></span>
                Add item
              </button>
            </template>
          </div>
        </section>

        <button v-if="state.editMenu" class="nav-add-group" type="button" @click="addGroup">
          <span v-html="icons.plus"></span>
          Add category
        </button>
        </div>
        <div v-if="isWorkspacePage" class="side-resizer" aria-hidden="true" @mousedown.prevent="startSidebarResize"></div>
        <div v-if="isWorkspacePage && accountOpen" class="workspace-account-menu" :style="accountMenuStyle">
          <div class="workspace-account-menu-head">
            <span class="workspace-account-avatar"><b>{{ accountInitials }}</b><small>{{ accountCountryCode }}</small></span>
            <span class="workspace-account-head-copy"><strong>{{ accountDisplayName }}</strong><span><i v-for="dept in accountDepartments" :key="dept" :class="`dc-${dept}`">{{ dept }}</i><em>{{ accountCountryCode }}</em></span></span>
          </div>
          <div class="workspace-account-rows">
            <div class="workspace-account-detail"><span>Staff ID</span><b>{{ accountCode }}</b></div>
            <div class="workspace-account-detail"><span>Country</span><b>{{ accountCountryCode }}</b></div>
            <div class="workspace-account-detail"><span>Department</span><b>{{ accountDepartments.join(', ') }}</b></div>
          </div>
          <div class="workspace-account-actions">
            <button type="button" @click="openAccountSettings"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.15.36.36.69.64.96.3.28.68.43 1.09.44H21v4h-.09A1.7 1.7 0 0 0 19.4 15Z"/></svg> Settings</button>
            <button type="button" class="logout" @click="confirmLogoutAdmin"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>Log out</button>
          </div>
        </div>
        <button ref="accountPillEl" v-if="isWorkspacePage" class="workspace-account-pill" :class="{ open: accountOpen }" type="button" title="Account & settings" @click="accountOpen = !accountOpen">
          <span class="workspace-account-top">
            <span class="workspace-account-avatar"><b>{{ accountInitials }}</b><small>{{ accountCountryCode }}</small></span>
            <span class="workspace-account-copy"><strong>{{ accountDisplayName }}</strong><small>{{ accountCode }}</small></span>
          </span>
          <span class="workspace-account-depts"><b v-for="dept in accountDepartments" :key="dept" :class="`dc-${dept}`">{{ dept }}</b></span>
        </button>
      </aside>
      <section class="main" :class="{ 'workbook-main': isWorkspacePage, 'legacy-workspace-main': isWorkspacePage && !isWorkbookCanvasPage, 'fx-workspace-main': currentPage.kind === 'master-fx', 'sales-workspace-main': isSheetGridPage }">
        <template v-if="state.view === 'trash'">
          <div class="crumb">Menu <b>&gt;</b> Dustbin</div>
          <div class="page-head">
            <div>
              <div class="page-title">Dustbin</div>
              <div class="page-desc">Deleted records, fee items and categories are kept here before permanent removal.</div>
            </div>
            <div class="spacer"></div>
            <button class="btn btn-ghost" type="button" :disabled="trashItems.length === 0" @click="emptyTrash">
              <span v-html="icons.trash"></span>
              Empty dustbin
            </button>
          </div>
          <div class="card">
            <div class="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Entry</th>
                    <th>Context</th>
                    <th>Deleted</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loading">
                    <td colspan="5" class="empty">Loading...</td>
                  </tr>
                  <tr v-else-if="trashItems.length === 0">
                    <td colspan="5" class="empty">Dustbin is empty.</td>
                  </tr>
                  <tr v-for="entry in trashItems" :key="entry.id">
                    <td><span class="tag tag-flat">{{ entry.type }}</span></td>
                    <td>
                      <span class="code-cell">{{ entry.label }}</span>
                      <div class="note-text">{{ trashPayloadSummary(entry) }}</div>
                    </td>
                    <td class="note-text">{{ trashContext(entry) }}</td>
                    <td class="entered-cell">{{ shortDate(entry.deletedAt) }}</td>
                    <td>
                      <div class="row-actions">
                        <button class="icon-btn" type="button" title="Restore" @click="restoreTrash(entry)" v-html="icons.refresh"></button>
                        <button class="icon-btn del" type="button" title="Delete forever" @click="purgeTrash(entry)" v-html="icons.trash"></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="tbl-foot">
              <span>{{ trashItems.length }} item(s) in Dustbin</span>
              <span>Restored records return to their original page</span>
            </div>
          </div>
        </template>

        <template v-else>
          <AdminWorkbook
            v-if="currentPage.kind === 'workbook'"
            :title="currentPage.title"
            :description="currentPage.desc"
            :group-label="groupLabel(currentPage.group)"
            :sheet-key="currentPage.sheetKey"
            :tabs="currentPage.tabs"
            :request="apiFetch"
            :countries="countries"
            :current-country="currentCountry"
            :can-switch-country="canSwitchCountry"
            :current-user="adminStore.admin"
            @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
            @select-country="setCountry"
            @select-ops-leaf="navigateOpsLeaf"
          />
          <AdminChecklist
            v-else-if="currentPage.kind === 'checklist'"
            :request="apiFetch"
            :countries="countries"
            :current-country="currentCountry"
            :can-switch-country="canSwitchCountry"
            @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
            @select-country="setCountry"
          />
          <AdminRegulations
            v-else-if="currentPage.kind === 'regulations'"
            :request="apiFetch"
            :countries="countries"
            :current-country="currentCountry"
            :can-switch-country="canSwitchCountry"
            @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed"
            @select-country="setCountry"
          />
          <AdminWorkspace
            v-else-if="currentPage.kind === 'workspace'"
            :request="apiFetch"
          />
          <AdminQualityControl
            v-else-if="currentPage.kind === 'quality-control'"
            :request="apiFetch"
            :current-user="adminStore.admin"
          />
          <div v-else-if="currentPage.kind === 'operations-home'" class="ops-home">
            <div class="ops-empty-card">
              Select <b>FCL</b>, <b>LCL</b>, or <b>AIR</b> in the sidebar to open a sheet.
            </div>
          </div>
          <template v-else-if="isSheetGridPage">
            <div class="sm-page" :class="`sm-kind-${currentPage.kind}`">
              <div v-if="['traders-suppliers', 'reference-data', 'customs-legal', 'internal-directory'].includes(currentPage.kind)" class="sm-directory-topbar">
                <h1>{{ sheetGridHeaderTitle }}</h1>
                <p>{{ currentPage.kind === 'internal-directory' ? internalDirectoryDescription : sheetGridHeaderDesc }}</p>
              </div>
              <div v-if="currentPage.kind === 'traders-suppliers'" class="sm-tabbar sm-top-tabs">
                                <button
                  v-for="tab in traderTabs"
                  :key="tab.id"
                  type="button"
                  class="sm-tab"
                  :class="{ active: state.traderTab === tab.id }"
                  @click="setTraderTab(tab.id)"
                  >
                  {{ tab.label }}
                  <span v-if="tab.custom" class="sm-tab-close" title="Remove tab" @click.stop="removeCustomGridTab('traders', tab)">&times;</span>
                </button>
                <button class="sm-tab sm-tab-add" type="button" title="Add tab" @click="addCustomGridTab('traders')">+</button>
              </div>
              <div v-else-if="currentPage.kind === 'reference-data'" class="sm-tabbar sm-top-tabs">
                                <button
                  v-for="tab in referenceTabs"
                  :key="tab.id"
                  type="button"
                  class="sm-tab"
                  :class="{ active: activeReferenceTab.id === tab.id }"
                  @click="setReferenceTab(tab.id)"
                  >
                  {{ tab.label }}
                  <span v-if="tab.custom" class="sm-tab-close" title="Remove tab" @click.stop="removeCustomGridTab('reference', tab)">&times;</span>
                </button>
                <button class="sm-tab sm-tab-add" type="button" title="Add tab" @click="addCustomGridTab('reference')">+</button>
              </div>
              <div v-else-if="currentPage.kind === 'customs-legal'" class="sm-tabbar sm-top-tabs">
                                <button
                  v-for="tab in legalTabs"
                  :key="tab.id"
                  type="button"
                  class="sm-tab"
                  :class="{ active: state.legalTab === tab.id }"
                  @click="setLegalTab(tab.id)"
                  >
                  {{ tab.label }}
                  <span v-if="tab.custom" class="sm-tab-close" title="Remove tab" @click.stop="removeLegalTab(tab)">&times;</span>
                </button>
                <button class="sm-tab sm-tab-add" type="button" title="Add tab" @click="addLegalTab">+</button>
              </div>
              <div v-else-if="currentPage.kind === 'internal-directory'" class="sm-tabbar sm-top-tabs">
                                <button
                  v-for="tab in internalTabs"
                  :key="tab.id"
                  type="button"
                  class="sm-tab"
                  :class="{ active: state.internalTab === tab.id }"
                  @click="setInternalTab(tab.id)"
                  >
                  {{ tab.label }}
                  <span v-if="tab.custom" class="sm-tab-close" title="Remove tab" @click.stop="removeCustomGridTab('internal', tab)">&times;</span>
                </button>
                <button class="sm-tab sm-tab-add" type="button" title="Add tab" @click="addCustomGridTab('internal')">+</button>
              </div>
              <div v-else-if="currentPage.kind === 'quality-control'" class="sm-tabbar sm-top-tabs">
                <button
                  v-for="tab in qualityTabs"
                  :key="tab.id"
                  type="button"
                  class="sm-tab"
                  :class="{ active: state.qcTab === tab.id }"
                  @click="setQualityTab(tab.id)"
                >
                  {{ tab.label }}
                </button>
              </div>
              <template v-else-if="currentPage.kind === 'analysis-statistics'">
                <div class="sm-tabbar sm-top-tabs">
                  <button
                    v-for="tab in analysisTopTabs"
                    :key="tab"
                    type="button"
                    class="sm-tab"
                    :class="{ active: state.analysisTop === tab }"
                    @click="setAnalysisTop(tab)"
                  >
                    {{ tab }}
                  </button>
                </div>
                <div v-if="analysisSubTabs.length" class="sm-tabbar sm-sub-tabs">
                  <button
                    v-for="tab in analysisSubTabs"
                    :key="tab.id"
                    type="button"
                    class="sm-tab"
                    :class="{ active: state.analysisSub === tab.id }"
                    @click="setAnalysisSub(tab.id)"
                  >
                    {{ tab.label }}
                  </button>
                </div>
              </template>
              <div v-else class="sm-tabbar sm-top-tabs">
                <button
                  v-for="tab in salesMarketingTopTabs"
                  :key="tab"
                  type="button"
                  class="sm-tab"
                  :class="{ active: state.smTop === tab }"
                  @click="setSalesTop(tab)"
                >
                  {{ tab }}
                </button>
              </div>
              <div v-if="isInternalHaulage" class="sm-tabbar sm-sub-tabs haulage-subbar">
                <button
                  v-for="mode in haulageModes"
                  :key="mode.id"
                  type="button"
                  class="sm-tab"
                  :class="{ active: state.haulageMode === mode.id }"
                  @click="setHaulageMode(mode.id)"
                >
                  {{ mode.label }}
                </button>
                <input v-model.trim="haulageOrsKey" class="haulage-ors-key" type="text" name="shoptrans-ors-api-key" autocomplete="off" autocapitalize="none" data-1p-ignore data-lpignore="true" data-form-type="other" placeholder="OpenRouteService API key (auto Distance/TransitTime)" spellcheck="false" @change="saveHaulageSettings" />
                <label class="haulage-buffer" title="Traffic buffer applied to TransitTime only. 1.0 = raw map time.">TT &times;<input v-model.number="haulageTtBuffer" type="number" min="1" step="0.1" @change="saveHaulageSettings" /></label>
              </div>
              <template v-if="currentPage.kind === 'sales-marketing' && state.smTop !== 'MassSales'">
                <div class="sm-modepicker">
                  <button v-for="mode in salesModes" :key="mode" type="button" :class="{ active: state.smMode === mode }" :data-sm-mode="mode" @click="setSalesMode(mode)">{{ mode }}</button>
                </div>
                <div class="sm-tabbar sm-sub-tabs">
                  <button
                    v-for="tab in activeSalesFeeTabs"
                    :key="tab.id"
                    type="button"
                    class="sm-tab"
                    :class="{ active: state.smSub === tab.id }"
                    @click="setSalesSub(tab.id)"
                  >
                    {{ tab.label }}
                  </button>
                </div>
              </template>

              <KeepAlive>
                <AdminMassSales
                  v-if="currentPage.kind === 'sales-marketing' && state.smTop === 'MassSales'"
                  :country="recordCountry"
                  :request="apiFetch"
                  :fee-tabs="salesFeeTabs"
                  :notify-user="notifyAdmin"
                  :confirm-user="confirmAdmin"
                />
              </KeepAlive>

              <div v-if="isLegalChecklist" class="legal-checklistwrap">
                <div class="legal-cl-cols">
                  <div class="legal-cl-col">
                    <section
                      v-for="section in legalChecklistColumns[0]"
                      :key="section.sec"
                      class="legal-cl-sec"
                      :class="{ collapsed: legalChecklistCollapsed[section.sec] }"
                    >
                      <button class="legal-cl-sec-hd" type="button" @click="toggleLegalChecklistSection(section.sec)">
                        <span class="legal-cl-chevron">&#9662;</span>
                        <span class="legal-cl-num">{{ section.sec }}</span>
                        <span class="legal-cl-title">{{ section.title }}</span>
                        <span class="legal-cl-progress" :class="{ done: legalChecklistDone(section) === section.items.length }">{{ legalChecklistDone(section) }}/{{ section.items.length }}</span>
                      </button>
                      <div class="legal-cl-body">
                        <div v-if="section.hint" class="legal-cl-hint">{{ section.hint }}</div>
                        <template v-for="item in section.items" :key="item.no">
                          <div v-if="item.groupLabel" class="legal-cl-grouplabel">{{ item.groupLabel }}</div>
                          <label class="legal-cl-item" :class="{ checked: !!legalChecklistState[item.no] }">
                            <input type="checkbox" :checked="!!legalChecklistState[item.no]" @change="toggleLegalChecklistItem(item.no, legalChecklistEventChecked($event))" />
                            <span class="legal-cl-no">{{ item.no }}</span>
                            <span class="legal-cl-body-txt">
                              <span class="legal-cl-item-title">{{ item.title }}</span>
                              <span v-if="item.note" class="legal-cl-note">{{ item.note }}</span>
                            </span>
                          </label>
                        </template>
                      </div>
                    </section>
                  </div>
                  <div class="legal-cl-col">
                    <section
                      v-for="section in legalChecklistColumns[1]"
                      :key="section.sec"
                      class="legal-cl-sec"
                      :class="{ collapsed: legalChecklistCollapsed[section.sec] }"
                    >
                      <button class="legal-cl-sec-hd" type="button" @click="toggleLegalChecklistSection(section.sec)">
                        <span class="legal-cl-chevron">&#9662;</span>
                        <span class="legal-cl-num">{{ section.sec }}</span>
                        <span class="legal-cl-title">{{ section.title }}</span>
                        <span class="legal-cl-progress" :class="{ done: legalChecklistDone(section) === section.items.length }">{{ legalChecklistDone(section) }}/{{ section.items.length }}</span>
                      </button>
                      <div class="legal-cl-body">
                        <div v-if="section.hint" class="legal-cl-hint">{{ section.hint }}</div>
                        <template v-for="item in section.items" :key="item.no">
                          <div v-if="item.groupLabel" class="legal-cl-grouplabel">{{ item.groupLabel }}</div>
                          <label class="legal-cl-item" :class="{ checked: !!legalChecklistState[item.no] }">
                            <input type="checkbox" :checked="!!legalChecklistState[item.no]" @change="toggleLegalChecklistItem(item.no, legalChecklistEventChecked($event))" />
                            <span class="legal-cl-no">{{ item.no }}</span>
                            <span class="legal-cl-body-txt">
                              <span class="legal-cl-item-title">{{ item.title }}</span>
                              <span v-if="item.note" class="legal-cl-note">{{ item.note }}</span>
                            </span>
                          </label>
                        </template>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
              <div v-if="isLegalChecklist" class="sm-foot">{{ legalChecklistCheckedCount }} of {{ legalChecklistTotal }} items checked</div>

              <div
                v-if="isAnalysisDashboard"
                class="analysis-dashboard-wrap"
                :class="{ 'analysis-source-empty': (analysisSummaryKind === 'newclient' ? analysisNewClientRows.length : analysisGroupRows.length) === 0 }"
              >
                <div v-if="state.analysisSub === 'total_client'" class="analysis-client-switch">
                  <button type="button" :class="{ active: analysisSummaryFilter.clientMode === 'client' }" @click="analysisSummaryFilter.clientMode = 'client'">Total Client</button>
                  <button type="button" :class="{ active: analysisSummaryFilter.clientMode === 'newclient' }" @click="analysisSummaryFilter.clientMode = 'newclient'">Total NewClient</button>
                </div>

                <div class="analysis-filter-row">
                  <label>Client:</label>
                  <div class="analysis-filter-combo">
                    <div
                      class="analysis-filter-input"
                      contenteditable="true"
                      spellcheck="false"
                      autocapitalize="off"
                      autocorrect="off"
                      role="textbox"
                      tabindex="0"
                      data-analysis-filter="client"
                      @focus="focusAnalysisFilterEditable('client', $event)"
                      @input="handleAnalysisFilterTextInput('client', $event)"
                      @blur="blurAnalysisFilterEditable('client', $event)"
                      @keydown.esc="analysisFilterDropdown = ''"
                    >{{ analysisSummaryFilter.client || 'All' }}</div>
                    <button class="analysis-filter-caret" type="button" tabindex="-1" @mousedown.prevent @click="toggleAnalysisFilterDropdown('client')"></button>
                    <div v-if="analysisFilterDropdown === 'client'" class="analysis-filter-options">
                      <button type="button" @mousedown.prevent="chooseAnalysisFilterOption('client', '')">All</button>
                      <button v-for="option in analysisFilterOptionList('client')" :key="option" type="button" @mousedown.prevent="chooseAnalysisFilterOption('client', option)">{{ option }}</button>
                    </div>
                  </div>
                  <label>Sales:</label>
                  <div class="analysis-filter-combo">
                    <div
                      class="analysis-filter-input"
                      contenteditable="true"
                      spellcheck="false"
                      autocapitalize="off"
                      autocorrect="off"
                      role="textbox"
                      tabindex="0"
                      data-analysis-filter="sales"
                      @focus="focusAnalysisFilterEditable('sales', $event)"
                      @input="handleAnalysisFilterTextInput('sales', $event)"
                      @blur="blurAnalysisFilterEditable('sales', $event)"
                      @keydown.esc="analysisFilterDropdown = ''"
                    >{{ analysisSummaryFilter.sales || 'All' }}</div>
                    <button class="analysis-filter-caret" type="button" tabindex="-1" @mousedown.prevent @click="toggleAnalysisFilterDropdown('sales')"></button>
                    <div v-if="analysisFilterDropdown === 'sales'" class="analysis-filter-options dark">
                      <button type="button" @mousedown.prevent="chooseAnalysisFilterOption('sales', '')">All</button>
                      <button v-for="option in analysisFilterOptionList('sales')" :key="option" type="button" @mousedown.prevent="chooseAnalysisFilterOption('sales', option)">{{ option }}</button>
                    </div>
                  </div>
                  <label>BU:</label>
                  <div class="analysis-filter-combo small">
                    <div
                      class="analysis-filter-input"
                      contenteditable="true"
                      spellcheck="false"
                      autocapitalize="off"
                      autocorrect="off"
                      role="textbox"
                      tabindex="0"
                      data-analysis-filter="bu"
                      @focus="focusAnalysisFilterEditable('bu', $event)"
                      @input="handleAnalysisFilterTextInput('bu', $event)"
                      @blur="blurAnalysisFilterEditable('bu', $event)"
                      @keydown.esc="analysisFilterDropdown = ''"
                    >{{ analysisSummaryFilter.bu || 'All' }}</div>
                    <button class="analysis-filter-caret" type="button" tabindex="-1" @mousedown.prevent @click="toggleAnalysisFilterDropdown('bu')"></button>
                    <div v-if="analysisFilterDropdown === 'bu'" class="analysis-filter-options">
                      <button type="button" @mousedown.prevent="chooseAnalysisFilterOption('bu', '')">All</button>
                      <button v-for="option in analysisFilterOptionList('bu')" :key="option" type="button" @mousedown.prevent="chooseAnalysisFilterOption('bu', option)">{{ option }}</button>
                    </div>
                  </div>
                  <input v-model="analysisSummaryFilter.from" class="date" type="date" title="From" @click="openNativeDatePicker($event)" />
                  <span>&rarr;</span>
                  <input v-model="analysisSummaryFilter.to" class="date" type="date" title="To" @click="openNativeDatePicker($event)" />
                  <template v-if="analysisSummaryKind !== 'volume' && analysisSummaryKind !== 'newclient'">
                    <label>Currency:</label>
                    <select v-model="analysisSummaryFilter.baseCur">
                      <option v-for="currency in analysisCurrencyOptions" :key="currency" :value="currency">{{ currency }}</option>
                    </select>
                  </template>
                  <template v-if="analysisSummaryKind === 'volume'">
                    <label>Type:</label>
                    <select v-model="analysisSummaryFilter.volType">
                      <option value="all">All</option>
                      <option value="FCL">FCL</option>
                      <option value="LCL">LCL</option>
                      <option value="AIR">AIR</option>
                    </select>
                    <label>Metric:</label>
                    <select v-model="analysisSummaryFilter.volMetric">
                      <option value="cbm">CBM</option>
                      <option value="gw">GW</option>
                      <option value="teu">TEU</option>
                      <option value="shipment">Shipment</option>
                    </select>
                  </template>
                </div>

                <div v-if="!analysisSummaryRows.length" class="analysis-empty">
                  <b>{{ analysisSummaryTitle }}</b>
                  <span>No data yet. Click "Load Sample Data" or import records in Revenue, Cost, Margin, Volume and NewClient first.</span>
                </div>
                <template v-else>
                  <div class="analysis-cards">
                    <div v-for="card in analysisSummaryCards" :key="card.label" class="analysis-card">
                      <span>{{ card.label }}</span>
                      <b>{{ card.value }}</b>
                    </div>
                  </div>

                  <div class="analysis-rank-grid" :class="{ wide: analysisDashboardRankSections.length > 3 }">
                    <div v-for="section in analysisDashboardRankSections" :key="section.title" class="analysis-rank-section">
                      <h4>{{ section.title }}</h4>
                      <div class="analysis-rank-pair">
                        <table v-for="list in section.lists" :key="list.label" class="analysis-rank-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>{{ list.label }}</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in list.items" :key="`${section.title}-${list.label}-${item.name}`">
                              <td>{{ index + 1 }}</td>
                              <td>
                                <button class="analysis-rank-link" type="button" @click="openAnalysisRankLink(section.kind, item.name, section.target)">
                                  {{ item.name }}
                                </button>
                              </td>
                              <td>{{ item.value }}</td>
                            </tr>
                            <tr v-if="!list.items.length">
                              <td colspan="3" class="empty">No data</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div class="analysis-chart-card">
                    <div class="analysis-chart-tools">
                      <span>Growth chart:</span>
                      <select v-model="analysisSummaryFilter.compareBy">
                        <option value="month">Compare months across years</option>
                        <option value="quarter">Compare quarters across years</option>
                        <option value="year">Compare years (max 5)</option>
                      </select>
                      <label v-for="year in analysisYearsAvailable" :key="year">
                        <input v-model="analysisSummaryFilter.years" type="checkbox" :value="year" />
                        {{ year }}
                      </label>
                    </div>
                    <div class="analysis-chart-stage">
                      <canvas ref="analysisBarCanvas" class="analysis-chart-canvas" :aria-label="`${analysisSummaryTitle} growth`"></canvas>
                    </div>
                  </div>

                  <div class="analysis-pie-row">
                    <div v-if="analysisPieCards[0]" class="analysis-pie-card">
                      <h4>{{ analysisPieCards[0].title }}</h4>
                      <canvas ref="analysisPieCanvas1" class="analysis-pie-canvas" width="260" height="260"></canvas>
                    </div>
                    <div v-if="analysisPieCards[1]" class="analysis-pie-card">
                      <h4>{{ analysisPieCards[1].title }}</h4>
                      <canvas ref="analysisPieCanvas2" class="analysis-pie-canvas" width="260" height="260"></canvas>
                    </div>
                  </div>
                </template>
              </div>

              <div v-if="false" class="analysis-dashboard-wrap">
                <div class="analysis-dashboard-actions">
                  <div class="analysis-filter-row">
                    <label>Client:</label>
                    <input value="All" readonly data-test-analysis="client" />
                    <label>Sales:</label>
                    <input value="All" readonly />
                    <label>BU:</label>
                    <input value="All" readonly />
                    <input class="date" type="date" @click="openNativeDatePicker($event)" />
                    <span>&rarr;</span>
                    <input class="date" type="date" @click="openNativeDatePicker($event)" />
                    <label>Currency:</label>
                    <select value="USD"><option>USD</option></select>
                  </div>
                </div>
                <div class="analysis-main-card">
                  <span>{{ analysisDashboardPrimaryCard.label }}</span>
                  <b>{{ analysisDashboardPrimaryCard.value }}</b>
                </div>
                <div class="analysis-rank-grid">
                  <div v-for="section in analysisDashboardRankSections" :key="section.title" class="analysis-rank-section">
                    <h4>{{ section.title }}</h4>
                    <div class="analysis-rank-pair">
                      <table v-for="list in section.lists" :key="list.label" class="analysis-rank-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>{{ list.label }}</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in list.items" :key="item.name">
                            <td>{{ index + 1 }}</td>
                            <td>
                              <button class="analysis-rank-link" type="button" @click="openAnalysisRankLink(section.kind, item.name)">
                                {{ item.name }}
                              </button>
                            </td>
                            <td>{{ item.value }}</td>
                          </tr>
                          <tr v-if="!list.items.length">
                            <td colspan="3" class="empty">No data</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="analysis-chart-card">
                  <div class="analysis-chart-tools">
                    <span>Growth chart:</span>
                    <select value="Compare months across years"><option>Compare months across years</option></select>
                    <label v-for="year in analysisChartYears" :key="year"><input type="checkbox" checked /> {{ year }}</label>
                  </div>
                  <div class="analysis-chart-title">{{ analysisDashboardPrimaryCard.label }} growth</div>
                  <div class="analysis-chart-legend">
                    <span v-for="year in analysisChartYears" :key="year" :style="{ '--c': analysisChartColor(year) }">{{ year }}</span>
                  </div>
                  <div class="analysis-bar-chart">
                    <div v-for="month in analysisChartMonths" :key="month.month" class="analysis-bar-month">
                      <i
                        v-for="bar in month.bars"
                        :key="bar.year"
                        :style="{ height: `${bar.height}%`, background: analysisChartColor(bar.year) }"
                        :title="`${bar.year}: ${formatAnalysisMoney(bar.value)}`"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="!isSpecialSheetContent" class="sm-toolbar" :class="{ 'sm-tight': currentPage.kind === 'sales-marketing' }">
                <button v-if="!activeSalesTable.readOnly" class="sm-btn primary" type="button" @click="startSalesAddRow">
                  <span v-html="icons.plus"></span>
                  Add Row
                </button>
                <button v-if="!activeSalesTable.readOnly && !isReferenceExRate && !isReferenceWarehouses && currentPage.kind !== 'internal-directory'" class="sm-btn" type="button" :disabled="state.selected.size === 0 || saving" @click="bulkCopy">
                  <span v-html="icons.copy"></span>
                  Copy
                </button>
                <button v-if="!activeSalesTable.readOnly" class="sm-btn danger" type="button" :disabled="state.selected.size === 0" @click="bulkDelete">
                  <span v-html="icons.trash"></span>
                  Remove
                </button>
                <button v-if="currentPage.kind === 'analysis-statistics'" class="sm-btn" type="button" @click="seedAnalysisSampleData">
                  <span v-html="icons.refresh"></span>
                  Load Sample Data
                </button>
                <div class="sm-export-wrap">
                  <button class="sm-btn" type="button" @click="state.smExportOpen = !state.smExportOpen">
                    <span v-html="icons.download"></span>
                    Export
                  </button>
                  <div v-if="state.smExportOpen" class="sm-export-menu">
                    <button type="button" :disabled="state.selected.size === 0" @click="exportSalesRows('selected')">Export selected rows<span v-if="state.selected.size"> ({{ state.selected.size }})</span></button>
                    <button type="button" :disabled="!salesHasFilter" @click="exportSalesRows('filtered')">Export filtered rows<span v-if="salesHasFilter"> ({{ filteredRows.length }})</span></button>
                    <button type="button" @click="exportSalesRows('all')">Export all rows ({{ records.length }})</button>
                  </div>
                </div>
                <button v-if="!activeSalesTable.readOnly && !isReferenceExRate && !isReferenceWarehouses && currentPage.kind !== 'internal-directory'" class="sm-btn" type="button" @click="downloadTemplate">
                  <span v-html="icons.file"></span>
                  Download Template
                </button>
                <button v-if="!activeSalesTable.readOnly && !isReferenceExRate && !isReferenceWarehouses && currentPage.kind !== 'internal-directory'" class="sm-btn" type="button" @click="triggerImport">
                  <span v-html="icons.upload"></span>
                  Import Excel
                </button>
                <div class="spacer"></div>
                <div class="sm-search-group">
                  <select v-model="state.smSearchField" @change="onSearch">
                    <option value="all">All</option>
                    <option v-for="column in tableColumns" :key="column.key" :value="column.key">{{ column.label }}</option>
                  </select>
                  <span class="div"></span>
                  <input v-model.trim="state.search" placeholder="Search&hellip;" @input="onSearch" />
                  <button class="sm-btn primary sm-search-action" type="button" @click="onSearch">Search</button>
                  <button class="sm-btn sm-search-action" type="button" :disabled="!isSalesFeeGrid && !state.search" @click="cancelSalesSearch">Cancel Search</button>
                  <button class="sm-btn sm-search-action" :class="{ active: state.smFilterOpen }" type="button" @click="toggleSalesFilter">+ Filter</button>
                </div>
                <span v-if="showSheetStatusFilter" class="sm-status-label">Status</span>
                <select v-if="showSheetStatusFilter" class="sm-status-select" v-model="state.smStatus" @change="onSearch">
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Cancel</option>
                  <option>All</option>
                </select>
              </div>
              <div v-if="isReferenceExRate" class="sm-exrate-banner">
                <span>Today: <b>{{ exRateToday }}</b></span>
                <a class="sm-btn primary sm-exrate-live" :href="exRateLiveUrl" target="_blank" rel="noopener">Check live rate &#8599;</a>
                <span class="sm-exrate-note">Each column = 1 unit of that currency in USD (e.g. CNY = how many USD per 1 CNY). Look up the real rate above, then add today as a new row.</span>
              </div>
              <div v-if="!isSpecialSheetContent && state.smFilterOpen" class="sm-adv-filter">
                <div v-if="smFilterCollapsed" class="sm-adv-collapsed">
                  <span v-if="activeSalesAdvFilters.length">Filter active — {{ activeSalesAdvFilters.length }} condition{{ activeSalesAdvFilters.length === 1 ? '' : 's' }}</span>
                  <span v-else>No active filter</span>
                  <button type="button" title="Expand" @click="smFilterCollapsed = false">&#9650;</button>
                </div>
                <template v-else>
                  <div class="sm-adv-rows">
                    <div v-for="(filter, index) in smAdvFilters" :key="index" class="sm-adv-row">
                      <select v-model="filter.field" @change="resetSalesAdvFilter(index)">
                        <option value="all">All</option>
                        <option v-for="column in salesFilterableColumns" :key="column.key" :value="column.key">{{ column.label }}</option>
                      </select>
                      <select v-model="filter.op" @change="filter.value = ''; filter.valueTo = ''">
                        <option value="contains">Contains</option>
                        <option value="empty">Is Empty</option>
                        <option value="notempty">Is Not Empty</option>
                        <option v-if="salesFilterColumn(filter.field)?.kind === 'date'" value="between">Between</option>
                      </select>
                      <template v-if="filter.op === 'between'">
                        <input v-model.trim="filter.value" type="date" />
                        <span class="sm-adv-arrow">&rarr;</span>
                        <input v-model.trim="filter.valueTo" type="date" />
                      </template>
                      <input v-else-if="filter.op === 'contains'" v-model.trim="filter.value" type="text" placeholder="Value..." />
                      <button class="sm-adv-remove" type="button" @click="removeSalesAdvFilter(index)">&times;</button>
                    </div>
                    <span v-if="!smAdvFilters.length" class="sm-adv-empty">No conditions yet - click "+ Add condition".</span>
                  </div>
                  <div class="sm-adv-actions">
                    <button class="sm-btn" type="button" @click="addSalesAdvFilter">+ Add condition</button>
                    <button class="sm-btn primary" type="button" @click="applySalesAdvFilters">Apply</button>
                    <button class="sm-btn" type="button" @click="clearSalesFilters">Clear all</button>
                    <button class="sm-adv-collapse" type="button" title="Collapse" @click="smFilterCollapsed = true">&#9660;</button>
                  </div>
                </template>
              </div>

              <div
                v-if="!isSpecialSheetContent"
                class="sm-tablewrap"
                :class="{ 'analysis-tablewrap': currentPage.kind === 'analysis-statistics', 'haulage-tablewrap': isInternalHaulage }"
                @scroll.passive="smLedgeTick++"
                @contextmenu.prevent.stop
              >
                <table class="sm-grid-table" :style="salesTableStyle" @contextmenu.prevent.stop>
                  <colgroup>
                    <col style="width:36px" />
                    <col :style="{ width: `${salesOrderWidth}px` }" />
                    <col v-for="column in tableColumns" :key="column.key" :style="{ width: `${salesColumnWidth(column.key, column.w || 140)}px` }" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="sel-col"><input type="checkbox" :checked="allPageSelected" :disabled="rowSelectionDisabled || pageRows.length === 0" @change="toggleAllPage($event)" /></th>
                      <th class="sm-order-col" @contextmenu.prevent.stop="openSmHeaderMenu({ key: '__order', label: 'Order' }, $event)">
                        <span class="sm-th-label">Order</span>
                        <span class="sm-rsz" @mousedown.prevent="startSalesColumnResize('__order', 70, $event)"></span>
                      </th>
                      <th
                        v-for="column in tableColumns"
                        :key="column.key"
                        :data-key="column.key"
                        @contextmenu.prevent.stop="openSmHeaderMenu(column, $event)"
                      >
                        <span class="sm-th-label">
                          {{ column.label }}
                          <button
                            v-if="column.kind === 'list' && !column.noAdd"
                            class="sm-th-add"
                            type="button"
                            :aria-label="`Add ${column.label}`"
                            @click.stop.prevent="addSalesListValue(column)"
                          >
                            <span class="sm-th-add-plus">+</span>
                          </button>
                        </span>
                        <span class="sm-rsz" @mousedown.prevent="startSalesColumnResize(column.key, column.w || 140, $event)"></span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loading">
                      <td :colspan="tableColumns.length + 2" class="empty">Loading...</td>
                    </tr>
                    <tr v-else-if="!smAdding && filteredRows.length === 0">
                      <td :colspan="tableColumns.length + 2" class="empty">
                        <b v-if="state.search">No matches for &quot;{{ state.search }}&quot;.</b>
                        <b v-else>No {{ activeSalesTableLabel.toLowerCase() }} yet.</b>
                        <span v-if="state.search">Try a different term or press Cancel Search.</span>
                        <span v-else>Click <b style="display:inline">Add Row</b> to create the first record.</span>
                      </td>
                    </tr>
                    <template v-for="(record, rowIndex) in pageRows" :key="`sm-row-${record.id}`">
                      <tr :class="salesRowClass(record)" @dblclick="!activeSalesTable.readOnly && startSalesEdit(record, $event)" @keydown.enter="handleSalesRowEnter('edit', $event)">
                        <td class="sel-col"><input type="checkbox" :checked="state.selected.has(record.id)" :disabled="smEditId === record.id || rowSelectionDisabled" @change="toggleSelected(record.id, $event)" /></td>
                        <td class="sm-order-cell"><div class="viewcell">{{ pageFrom + rowIndex }}</div></td>
                        <td v-for="column in tableColumns" :key="column.key" :data-col-key="column.key">
                          <template v-if="smEditId === record.id">
                            <input v-if="column.kind === 'checkbox'" type="checkbox" class="sm-check" v-model="smEditDraft[column.key]" />
                            <div v-else-if="column.kind === 'computed' && column.key.endsWith('_mgn')" class="viewcell mgncell" :class="{ neg: mgnView(smEditDraft, column.key).neg }">
                              <template v-if="!mgnView(smEditDraft, column.key).empty">
                                <span>{{ mgnView(smEditDraft, column.key).value }}</span>
                                <span v-if="mgnView(smEditDraft, column.key).pctText" class="mgnpct">{{ mgnView(smEditDraft, column.key).pctText }}</span>
                              </template>
                            </div>
                            <div v-else-if="column.kind === 'postal-tree'" class="idcell">{{ postalCountForIso(smEditDraft.iso2) }} postal codes</div>
                            <div v-else-if="column.kind === 'id' || column.kind === 'computed'" class="idcell">{{ smEditDraft[column.key] || 'auto' }}</div>
                            <button v-else-if="column.kind === 'roles'" type="button" class="sm-rolepick" @click.stop="openRolesModal('edit')">
                              <span v-if="smEditDraft[column.key]">{{ smEditDraft[column.key] }}</span>
                              <span v-else class="sm-role-empty">Select…</span>
                              <span class="sm-role-arrow">▾</span>
                            </button>
                            <div v-else-if="column.kind === 'gsdstaff'" class="idcell">{{ smEditDraft[column.key] || '-' }}</div>
                            <button v-else-if="column.kind === 'fulldetail'" class="sm-mini-action ghost" type="button" @click.stop="openTraderFullDetail(smEditDraft)">Detail</button>
                            <button v-else-if="column.kind === 'driverlist'" class="sm-mini-action" type="button">{{ traderDriverLabel(smEditDraft[column.key]) }}</button>
                            <button v-else-if="column.kind === 'coverage'" class="sm-mini-action ghost" type="button" @click.stop="openCoverageDraft('edit')">{{ coverageLabel(smEditDraft[column.key]) }}</button>
                            <div v-else-if="column.kind === 'deplist' || column.kind === 'haulier'" class="haulage-suggest-cell">
                              <input v-model="smEditDraft[column.key]" class="sm-celli" type="text" :list="`haulage-${column.key}-options`" placeholder="Select" autocomplete="off" />
                              <datalist :id="`haulage-${column.key}-options`"><option v-for="option in haulageOptionsFor(column.key)" :key="option" :value="option" /></datalist>
                            </div>
                            <select v-else-if="column.kind === 'stafflist'" v-model="smEditDraft[column.key]" class="sm-celli">
                              <option value="">— Staff —</option><option v-for="staff in haulageStaffOptions" :key="staff" :value="staff">{{ staff }}</option>
                            </select>
                            <div v-else-if="column.kind === 'list'" class="sm-list-cell">
                              <input
                                v-model="smEditDraft[column.key]"
                                class="sm-celli sm-list-input"
                                type="text"
                                :placeholder="salesCellPlaceholder(column)"
                                @focus="openSalesList(column.key, 'edit')"
                                @input="openSalesList(column.key, 'edit')"
                                @keydown.down.prevent="moveSalesList(column.key, 1)"
                                @keydown.up.prevent="moveSalesList(column.key, -1)"
                                @change="syncSalesFeeReferencePair(column.key)"
                                @keydown.enter.stop="handleSalesListEnter(column.key, 'edit', $event)"
                                @keydown.esc.prevent="closeSalesList"
                              />
                              <span class="sm-list-arrow">&#9662;</span>
                              <div v-if="smListPicker.key === column.key" class="sm-list-menu">
                                <button
                                  v-for="option in filteredSalesListOptions(column.key)"
                                  :key="option"
                                  type="button"
                                  class="sm-list-item"
                                  :class="{ active: option === activeSalesListOption(column.key) }"
                                  @mousedown.prevent="chooseSalesList(column.key, option)"
                                >
                                  {{ option }}
                                </button>
                                <div v-if="filteredSalesListOptions(column.key).length === 0" class="sm-list-empty">No options</div>
                              </div>
                            </div>
                            <select v-else-if="column.kind === 'select'" v-model="smEditDraft[column.key]" class="sm-celli">
                              <option v-for="option in column.opts" :key="option" :value="option">{{ option }}</option>
                            </select>
                            <textarea v-else-if="column.kind === 'textarea'" v-model="smEditDraft[column.key]" class="sm-celli haulage-textarea" rows="1" @input="growHaulageTextarea"></textarea>
                            <div v-else-if="isInternalHaulage && column.key === 'distance'" class="haulage-geo-cell">
                              <input v-model="smEditDraft[column.key]" class="sm-celli" type="number" inputmode="decimal" :placeholder="salesCellPlaceholder(column)" />
                              <button type="button" title="Calculate with OpenRouteService" :disabled="haulageCalculating" @click.stop="calculateHaulageRoute(smEditDraft)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.34 5.66M20 4v7h-7" /></svg></button>
                            </div>
                            <input v-else v-model="smEditDraft[column.key]" class="sm-celli" :type="salesInputType(column)" :inputmode="salesInputMode(column)" :placeholder="salesCellPlaceholder(column)" :data-key="column.key" @focusout="formatSalesNumberInput(column.key, $event, 'edit')" />
                          </template>
                          <div v-else class="viewcell">
                            <input v-if="column.kind === 'checkbox'" type="checkbox" class="sm-check" :checked="!!dataOf(record)[column.key]" disabled />
                            <button v-else-if="column.kind === 'postal-tree'" class="postal-open-btn" type="button" @click.stop="togglePostalCountry(record)">
                              <span>{{ postalCountForCountry(record) }}</span>
                              <svg viewBox="0 0 24 24" aria-hidden="true" :class="{ open: postalCountryIsOpen(record) }"><path d="m8 10 4 4 4-4" /></svg>
                            </button>
                            <button v-else-if="column.kind === 'driverlist'" class="sm-mini-action ghost" type="button" @click.stop="openTraderDrivers(record)">{{ traderDriverLabel(dataOf(record)[column.key]) }}</button>
                            <button v-else-if="column.kind === 'coverage'" class="sm-mini-action ghost" type="button" @click.stop="openCoverageRecord(record)">{{ coverageLabel(dataOf(record)[column.key]) }}</button>
                            <div v-else-if="column.kind === 'computed' && column.key.endsWith('_mgn')" class="viewcell mgncell" :class="{ neg: mgnView(dataOf(record), column.key).neg }">
                              <template v-if="!mgnView(dataOf(record), column.key).empty">
                                <span>{{ mgnView(dataOf(record), column.key).value }}</span>
                                <span v-if="mgnView(dataOf(record), column.key).pctText" class="mgnpct">{{ mgnView(dataOf(record), column.key).pctText }}</span>
                              </template>
                            </div>
                            <span v-else-if="column.kind === 'roles'">{{ dataOf(record)[column.key] || '—' }}<template v-if="roleLinkNames(record).length"> <span v-for="name in roleLinkNames(record)" :key="name" class="rolelink">{{ name }}</span></template></span>
                            <span v-else-if="column.kind === 'gsdstaff'">{{ dataOf(record)[column.key] || '-' }}</span>
                            <button v-else-if="column.kind === 'fulldetail'" class="sm-mini-action ghost" type="button" @click.stop="openTraderFullDetail(dataOf(record))">Detail</button>
                            <a v-else-if="column.kind === 'url' && dataOf(record)[column.key]" class="sm-cell-link" :href="externalUrl(dataOf(record)[column.key])" target="_blank" rel="noopener noreferrer" @click.stop>{{ dataOf(record)[column.key] }}</a>
                            <span v-else>{{ cellValue(record, column.key) }}</span>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="isReferenceCountries && postalCountryIsOpen(record)" class="postal-tree-host">
                        <td :colspan="tableColumns.length + 2">
                          <section class="postal-tree-panel">
                            <div class="postal-tree-toolbar">
                              <div><strong>{{ dataOf(record).countryname }}</strong><span>{{ postalCountForCountry(record) }} postal code records</span></div>
                              <button class="sm-btn primary" type="button" @click="startPostalAdd(record)">+ Add location</button>
                              <button class="sm-btn" type="button" :disabled="postalDirectory.loading" @click="openPostalImportForCountry(record)">Import postal codes</button>
                            </div>
                            <div v-if="postalDirectory.loading" class="postal-tree-empty">Loading postal directory...</div>
                            <div v-else class="postal-tree-layout">
                              <div class="postal-tree-list">
                                <div class="postal-tree-head"><span>Location hierarchy</span><span>Zip Code</span><span>Status</span><span></span></div>
                                <div
                                  v-for="node in postalVisibleNodes"
                                  :key="node.key"
                                  class="postal-tree-node"
                                  :class="{ group: node.kind !== 'postal', selected: node.recordId && node.recordId === postalDirectory.editId }"
                                  role="button"
                                  tabindex="0"
                                  @click="selectPostalNode(node)"
                                  @keydown.enter.prevent="selectPostalNode(node)"
                                >
                                  <span class="postal-node-name" :style="{ paddingLeft: `${10 + node.depth * 22}px` }">
                                    <i v-if="node.kind !== 'postal'" class="postal-chevron" :class="{ open: postalNodeExpanded(node.key) }">&#9656;</i>
                                    <i v-else class="postal-pin">&#9679;</i>
                                    <b>{{ node.label }}</b>
                                  </span>
                                  <span>{{ node.zip || '—' }}</span>
                                  <span><em :class="{ inactive: node.status === 'Inactive' }">{{ node.status || 'Active' }}</em></span>
                                  <span><button v-if="node.recordId" class="postal-edit-mini" type="button" @click.stop="editPostalNode(node)">Edit</button></span>
                                </div>
                                <div v-if="!postalVisibleNodes.length" class="postal-tree-empty">No postal codes saved for this country yet.</div>
                              </div>
                              <form class="postal-tree-form" @submit.prevent="savePostalForm">
                                <h3>{{ postalDirectory.editId ? 'Edit postal location' : 'Add postal location' }}</h3>
                                <label><span>Province / State *</span><input v-model.trim="postalDirectory.form.prov" type="text" /></label>
                                <label><span>District / City</span><input v-model.trim="postalDirectory.form.dist" type="text" /></label>
                                <label><span>Ward / Place</span><input v-model.trim="postalDirectory.form.ward" type="text" /></label>
                                <label><span>Zip Code *</span><input v-model.trim="postalDirectory.form.zip" type="text" /></label>
                                <label><span>Status</span><select v-model="postalDirectory.form.status"><option>Active</option><option>Inactive</option></select></label>
                                <p v-if="postalDirectory.error" class="postal-form-error">{{ postalDirectory.error }}</p>
                                <div class="postal-form-actions">
                                  <button v-if="postalDirectory.editId" class="sm-btn danger" type="button" :disabled="postalDirectory.saving" @click="removePostalRecord">Remove</button>
                                  <span></span>
                                  <button class="sm-btn" type="button" @click="resetPostalForm">Clear</button>
                                  <button class="sm-btn primary" type="submit" :disabled="postalDirectory.saving">{{ postalDirectory.saving ? 'Saving...' : 'Save' }}</button>
                                </div>
                              </form>
                            </div>
                          </section>
                        </td>
                      </tr>
                    </template>
                    <template v-if="smAdding">
                      <tr class="sm-editing" @keydown.enter="handleSalesRowEnter('add', $event)">
                        <td class="sel-col"><input type="checkbox" disabled /></td>
                        <td class="sm-order-cell"><div class="viewcell">{{ filteredRows.length + 1 }}</div></td>
                        <td v-for="column in tableColumns" :key="column.key" :data-col-key="column.key">
                          <input v-if="column.kind === 'checkbox'" type="checkbox" class="sm-check" v-model="smDraft[column.key]" />
                          <div v-else-if="column.kind === 'postal-tree'" class="idcell">Saved after country creation</div>
                          <div v-else-if="column.kind === 'id' || column.kind === 'computed'" class="idcell" :class="{ empty: !smDraft[column.key] }">{{ smDraft[column.key] || 'auto' }}</div>
                          <button v-else-if="column.kind === 'roles'" type="button" class="sm-rolepick" @click.stop="openRolesModal('add')">
                            <span v-if="smDraft[column.key]">{{ smDraft[column.key] }}</span>
                            <span v-else class="sm-role-empty">Select…</span>
                            <span class="sm-role-arrow">▾</span>
                          </button>
                          <div v-else-if="column.kind === 'gsdstaff'" class="idcell">{{ smDraft[column.key] || '-' }}</div>
                          <button v-else-if="column.kind === 'fulldetail'" class="sm-mini-action ghost" type="button" @click.stop="openTraderFullDetail(smDraft)">Detail</button>
                          <button v-else-if="column.kind === 'driverlist'" class="sm-mini-action" type="button">No drivers</button>
                          <button v-else-if="column.kind === 'coverage'" class="sm-mini-action ghost" type="button" @click.stop="openCoverageDraft('add')">{{ coverageLabel(smDraft[column.key]) }}</button>
                          <div v-else-if="column.kind === 'deplist' || column.kind === 'haulier'" class="haulage-suggest-cell">
                            <input v-model="smDraft[column.key]" class="sm-celli" type="text" :list="`haulage-${column.key}-options`" placeholder="Select" autocomplete="off" />
                            <datalist :id="`haulage-${column.key}-options`"><option v-for="option in haulageOptionsFor(column.key)" :key="option" :value="option" /></datalist>
                          </div>
                          <select v-else-if="column.kind === 'stafflist'" v-model="smDraft[column.key]" class="sm-celli">
                            <option value="">— Staff —</option><option v-for="staff in haulageStaffOptions" :key="staff" :value="staff">{{ staff }}</option>
                          </select>
                          <div v-else-if="column.kind === 'list'" class="sm-list-cell">
                            <input
                              v-model="smDraft[column.key]"
                              class="sm-celli sm-list-input"
                              type="text"
                              :placeholder="salesCellPlaceholder(column)"
                              @focus="openSalesList(column.key)"
                              @input="openSalesList(column.key)"
                              @keydown.down.prevent="moveSalesList(column.key, 1)"
                              @keydown.up.prevent="moveSalesList(column.key, -1)"
                              @change="syncSalesFeeReferencePair(column.key)"
                              @keydown.enter.stop="handleSalesListEnter(column.key, 'add', $event)"
                              @keydown.esc.prevent="closeSalesList"
                            />
                            <span class="sm-list-arrow">&#9662;</span>
                            <div v-if="smListPicker.key === column.key" class="sm-list-menu">
                              <button
                                v-for="option in filteredSalesListOptions(column.key)"
                                :key="option"
                                type="button"
                                class="sm-list-item"
                                :class="{ active: option === activeSalesListOption(column.key) }"
                                @mousedown.prevent="chooseSalesList(column.key, option)"
                              >
                                {{ option }}
                              </button>
                              <div v-if="filteredSalesListOptions(column.key).length === 0" class="sm-list-empty">No options</div>
                            </div>
                          </div>
                          <select v-else-if="column.kind === 'select'" v-model="smDraft[column.key]" class="sm-celli">
                            <option v-for="option in column.opts" :key="option" :value="option">{{ option }}</option>
                          </select>
                          <textarea v-else-if="column.kind === 'textarea'" v-model="smDraft[column.key]" class="sm-celli haulage-textarea" rows="1" @input="growHaulageTextarea"></textarea>
                          <div v-else-if="isInternalHaulage && column.key === 'distance'" class="haulage-geo-cell">
                            <input v-model="smDraft[column.key]" class="sm-celli" type="number" inputmode="decimal" :placeholder="salesCellPlaceholder(column)" />
                            <button type="button" title="Calculate with OpenRouteService" :disabled="haulageCalculating" @click.stop="calculateHaulageRoute(smDraft)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.34 5.66M20 4v7h-7" /></svg></button>
                          </div>
                          <input v-else v-model="smDraft[column.key]" class="sm-celli" :type="salesInputType(column)" :inputmode="salesInputMode(column)" :placeholder="salesCellPlaceholder(column)" :data-key="column.key" @focusout="formatSalesNumberInput(column.key, $event, 'add')" />
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
                <div v-if="smAdding || smEditId" class="sm-ledge on" :style="smLedgeStyle">
                  <button class="save" type="button" :disabled="saving" @click="smAdding ? saveSalesDraft() : saveSalesEdit()">Save</button>
                  <button class="cancel" type="button" :disabled="saving" @click="smAdding ? cancelSalesDraft() : cancelSalesEdit()">Cancel</button>
                </div>
                <div v-if="smHeaderMenu.open" class="sm-head-menu" :style="{ left: `${smHeaderMenu.x}px`, top: `${smHeaderMenu.y}px` }" @contextmenu.prevent.stop>
                  <button type="button" @click="addSmColumn">+ Add Column</button>
                  <button type="button" :disabled="!canRemoveSmColumn" :title="canRemoveSmColumn ? '' : 'Cannot remove a built-in column'" @click="removeSmColumn">✕ Remove Column</button>
                </div>
              </div>
              <div v-if="!isSpecialSheetContent" class="sm-foot">
                <template v-if="salesHasFilter">{{ filteredRows.length }} of {{ records.length }} {{ activeSalesTableLabel.toLowerCase() }} (filtered)</template>
                <template v-else>{{ records.length }} {{ activeSalesTableLabel.toLowerCase() }}</template>
              </div>
              <div
                v-if="analysisSelectionSummary.visible"
                class="analysis-selection-bar"
                :style="{ left: `${sidebarWidth}px` }"
              >
                <div class="analysis-selection-handle"></div>
                <div class="analysis-selection-content">
                  <span class="analysis-selection-text">{{ analysisSelectionSummary.text }}</span>
                  <div class="analysis-selection-detail">
                    <div v-for="detail in analysisSelectionSummary.details" :key="detail.key" class="analysis-selection-card">
                      <div v-for="field in detail.fields" :key="field.label">
                        <b>{{ field.label }}:</b> {{ field.value }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="analysisGroundPanel.visible"
                class="analysis-ground-bar"
                :style="{ left: `${sidebarWidth}px` }"
              >
                <div class="analysis-selection-handle"></div>
                <h3>{{ analysisGroundPanel.title }}</h3>
                <div class="analysis-ground-grid">
                  <label class="ag-field ag-col-1">
                    <span>Debit No#:</span>
                    <input :value="analysisGroundPanel.debitNo" disabled />
                  </label>
                  <label class="ag-field">
                    <span>Debit Date:</span>
                    <input :value="analysisGroundPanel.debitDate" disabled />
                  </label>
                  <label class="ag-field">
                    <span>Amount:</span>
                    <input :value="analysisGroundPanel.amount" disabled />
                  </label>
                  <label class="ag-field">
                    <span>Currency:</span>
                    <input :value="analysisGroundPanel.currency" disabled />
                  </label>
                  <label class="ag-field ag-col-1">
                    <span>{{ analysisGroundPanel.config.partyLabel }}:</span>
                    <input :value="analysisGroundPanel.party" disabled />
                  </label>
                  <label class="ag-field">
                    <span>NameCode:</span>
                    <input :value="analysisGroundPanel.nameCode" disabled />
                  </label>
                  <label class="ag-field">
                    <span>ID:</span>
                    <input :value="analysisGroundPanel.partyId" disabled />
                  </label>
                  <div class="analysis-ground-break"></div>
                  <label class="ag-field ag-col-1">
                    <span>OwnerBU:</span>
                    <input :value="analysisGroundPanel.ownerBu" disabled />
                  </label>
                  <label class="ag-field">
                    <span>{{ analysisGroundPanel.config.buLabel }}:</span>
                    <input v-model="analysisGroundDraft[analysisGroundPanel.config.buField]" :disabled="analysisGroundLocked" />
                  </label>
                  <label class="ag-field">
                    <span>{{ analysisGroundPanel.config.personLabel }}:</span>
                    <input v-model="analysisGroundDraft[analysisGroundPanel.config.personField]" :disabled="analysisGroundLocked" />
                  </label>
                  <label class="ag-field">
                    <span>{{ analysisGroundPanel.config.atLabel }}:</span>
                    <input v-model="analysisGroundDraft[analysisGroundPanel.config.atField]" :disabled="analysisGroundLocked" />
                  </label>
                  <label class="ag-field ag-col-1">
                    <span>InvoiceNo#:</span>
                    <input v-model="analysisGroundDraft.invoiceno" :disabled="analysisGroundLocked" />
                  </label>
                  <label class="ag-field">
                    <span>InvoiceDate:</span>
                    <input v-model="analysisGroundDraft.invoicedate" type="date" :disabled="analysisGroundLocked" @click="openNativeDatePicker($event)" />
                  </label>
                  <label class="ag-field">
                    <span>{{ analysisGroundPanel.config.afterLabel }}:</span>
                    <div class="analysis-ground-days">
                      <input v-model="analysisGroundDraft[analysisGroundPanel.config.afterField]" type="number" min="0" :disabled="analysisGroundLocked" />
                      <em>days</em>
                    </div>
                  </label>
                  <label class="ag-field">
                    <span>{{ analysisGroundPanel.config.dateLabel }}:</span>
                    <input v-model="analysisGroundDraft[analysisGroundPanel.config.dateField]" type="date" :disabled="analysisGroundLocked" @click="openNativeDatePicker($event)" />
                  </label>
                </div>
                <div class="analysis-ground-actions">
                  <button class="close" type="button" @click="closeAnalysisGround">Close</button>
                  <button class="edit" type="button" :disabled="!analysisGroundLocked" @click="analysisGroundLocked = false">Edit</button>
                  <button class="save" type="button" :disabled="saving || analysisGroundLocked" @click="saveAnalysisGround">Save</button>
                </div>
              </div>
            </div>
          </template>
          <div v-else-if="currentPage.kind === 'blank-home'" class="blank-home"></div>
          <template v-else>
          <div v-if="!hideLegacyCrumbDesc" class="crumb">{{ groupLabel(currentPage.group) }} <b>&gt;</b> {{ cleanTitle(currentPage.title) }}</div>
          <div class="page-head">
            <div>
              <div class="page-title">{{ currentPage.title }}</div>
              <div v-if="!hideLegacyCrumbDesc" class="page-desc">{{ currentPage.desc }}</div>
            </div>
            <div class="spacer"></div>
            <div class="country-dd legacy-country" :class="{ open: countryOpen }">
              <button class="scope-pill" type="button" :class="{ fixed: !canSwitchCountry }" :disabled="!canSwitchCountry" @click="toggleCountryMenu">
                <img :src="flagUrl(scopeCountry.flag)" alt="" />
                <span>{{ scopeCountry.name }}</span>
                <small>- {{ scopeCountry.cur || 'USD' }}</small>
                <svg v-if="canSwitchCountry" class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <div v-if="canSwitchCountry" class="cdd-menu" :class="{ show: countryOpen }">
                <button
                  v-for="country in countries"
                  :key="country.id"
                  class="cdd-item"
                  :class="{ on: country.id === state.country }"
                  type="button"
                  @click="setCountry(country.id)"
                >
                  <img :src="flagUrl(country.flag)" alt="" />
                  <span>{{ country.name }}</span>
                  <span v-if="country.id === state.country" v-html="icons.check"></span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="currentPage.inspect" class="callout">
            <span v-html="icons.info"></span>
            <div><b>Inspection note:</b> Additional costs arising from inspection are billed per actual invoice.</div>
          </div>
          <div v-if="currentPage.kind === 'trucking'" class="callout green">
            <span v-html="icons.info"></span>
            <div>Select the port / CFS, then type a postal code. FCL is per container; LCL is per truck type.</div>
          </div>

          <div v-if="currentPage.kind === 'page-fcl'" class="fcl-tabs">
            <button
              v-for="tab in fclTabs"
              :key="tab.id"
              class="fcl-tab"
              :class="{ active: state.fclTab === tab.id }"
              type="button"
              @click="setFclTab(tab.id)"
            >
              <span class="fcl-step">{{ tab.step }}</span>
              <span class="fcl-tab-text">
                <b>{{ tab.title }}</b>
                <em>{{ fclTabCount(tab) }} rows</em>
              </span>
            </button>
          </div>

          <div v-if="currentPage.kind === 'master-fx'" class="fx-source">
            <span v-html="icons.refresh"></span>
            <b>Source</b>
            <code>{{ exchangeRateSource }}</code>
            <button class="btn btn-ghost" type="button" @click="copyExchangeRateSource">
              <span v-html="icons.copy"></span>
              Copy link
            </button>
          </div>
          <div v-if="currentPage.kind === 'master-fx'" class="toolbar">
            <div class="spacer"></div>
            <button class="btn btn-ghost" type="button" :disabled="importingExternal" @click="fetchAndSaveFxToday">
              <span v-if="!importingExternal" v-html="icons.refresh"></span>
              {{ importingExternal ? 'Fetching...' : 'Fetch & save today' }}
            </button>
            <button class="btn btn-ghost" type="button" :disabled="importingExternal" @click="openFxImportModal">
              <span v-if="!importingExternal" v-html="icons.refresh"></span>
              {{ importingExternal ? 'Importing...' : 'Import Exchange Rates' }}
            </button>
            <button class="btn btn-primary" type="button" @click="openFxModal()">
              <span v-html="icons.plus"></span>
              Add currency
            </button>
          </div>
          <div v-else class="toolbar">
            <div class="search">
              <span v-html="icons.search"></span>
              <input v-model.trim="state.search" placeholder="Search..." @input="onSearch" />
            </div>
            <div v-if="showModeFilter" class="seg">
              <button type="button" :class="{ on: state.modeFilter === 'ALL' }" @click="setMode('ALL')">All</button>
              <button type="button" :class="{ on: state.modeFilter === 'FCL' }" @click="setMode('FCL')">FCL</button>
              <button type="button" :class="{ on: state.modeFilter === 'LCL' }" @click="setMode('LCL')">LCL</button>
            </div>
            <div class="spacer"></div>
            <span class="bulk-tools">
              <span v-if="state.selected.size" class="bb-count">{{ state.selected.size }} selected</span>
              <button class="btn btn-ghost" type="button" :disabled="state.selected.size === 0" @click="bulkCopy">
                <span v-html="icons.copy"></span>
                Copy
              </button>
              <button class="btn bb-del" type="button" :disabled="state.selected.size === 0" @click="bulkDelete">
                <span v-html="icons.trash"></span>
                Delete
              </button>
              <button class="btn btn-ghost" type="button" :disabled="state.selected.size === 0" @click="clearSelected">
                <span v-html="icons.x"></span>
                Clear
              </button>
            </span>
            <button class="btn btn-ghost" type="button" @click="downloadTemplate">
              <span v-html="icons.download"></span>
              Template
            </button>
            <button class="btn btn-ghost" type="button" @click="triggerImport">
              <span v-html="icons.upload"></span>
              Import Excel
            </button>
            <button
              v-if="showMacmapImport"
              class="btn btn-ghost"
              type="button"
              :disabled="importingExternal"
              @click="openHsImportModal"
            >
              <span v-if="!importingExternal" v-html="icons.refresh"></span>
              <span>{{ importingExternal ? 'Importing...' : 'Import HS Codes (Macmap)' }}</span>
            </button>
            <button
              v-if="showPostalImport"
              class="btn btn-ghost"
              type="button"
              :disabled="importingExternal"
              @click="openPostalImportModal"
            >
              <span v-if="!importingExternal" v-html="icons.refresh"></span>
              <span>{{ importingExternal ? 'Importing...' : 'Import Postal Codes' }}</span>
            </button>
            <button
              v-if="showSeaportImport"
              class="btn btn-ghost"
              type="button"
              :disabled="importingExternal"
              @click="openSeaportImportModal"
            >
              <span v-if="!importingExternal" v-html="icons.refresh"></span>
              <span>{{ importingExternal ? 'Importing...' : 'Import UN/LOCODE Seaports' }}</span>
            </button>
            <button
              v-if="showCfsImport"
              class="btn btn-ghost"
              type="button"
              :disabled="importingExternal"
              @click="openCfsImportModal"
            >
              <span v-if="!importingExternal" v-html="icons.refresh"></span>
              <span>{{ importingExternal ? 'Importing...' : 'Import CFS Warehouses' }}</span>
            </button>
            <button class="btn btn-primary" type="button" @click="openRecord()">
              <span v-html="icons.plus"></span>
              Add new
            </button>
          </div>

          <div class="card">
            <template v-if="currentPage.kind === 'master-fx'">
              <div class="tbl-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Currency</th>
                      <th>Symbol</th>
                      <th>Rate (1 USD =)</th>
                      <th>Note</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="currency in fxPageRows" :key="currency.code">
                      <td class="code-cell">{{ currency.code }}</td>
                      <td>{{ currency.name }}</td>
                      <td class="fx-sym">{{ currency.symbol || currency.sym }}</td>
                      <td class="fx-rate">{{ Number(currency.rate || 1).toLocaleString('en-US', { maximumFractionDigits: 6 }) }}</td>
                      <td><span v-if="currency.base" class="fx-base">BASE</span><span v-else class="note-text">manual rate</span></td>
                      <td>
                        <div class="row-actions">
                          <button class="icon-btn" type="button" title="Edit" @click="openFxModal(currency)" v-html="icons.edit"></button>
                          <button v-if="!currency.base" class="icon-btn del" type="button" title="Delete" @click="deleteCurrency(currency)" v-html="icons.trash"></button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="tbl-foot">
                <div class="psel">
                  <span>Rows per page</span>
                  <select v-model="state.pageSize" @change="state.pageIndex = 0">
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                    <option value="all">All</option>
                  </select>
                  <span>{{ currencies.length }} currency(ies) - base USD</span>
                </div>
                <span class="fx-meta">Manual exchange rate catalog</span>
                <div class="pager">
                  <span class="pg-info">{{ fxPageFrom }}-{{ fxPageTo }} of {{ currencies.length }} - page {{ state.pageIndex + 1 }}/{{ fxPageCount }}</span>
                  <div class="pg-nav">
                    <button class="pg-btn" type="button" :disabled="state.pageIndex <= 0" @click="state.pageIndex--" v-html="icons.chevLeft"></button>
                    <button class="pg-btn" type="button" :disabled="state.pageIndex >= fxPageCount - 1" @click="state.pageIndex++" v-html="icons.chevRight"></button>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div v-if="!loading && filteredRows.length === 0" class="empty">
                <span v-html="icons.empty"></span>
                <p>No data yet</p>
                <span>Click "Add new" or "Import Excel" to start entering data for {{ currentCountry.name }}.</span>
              </div>
              <template v-else>
                <div class="tbl-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th class="sel-col"><input type="checkbox" :checked="allPageSelected" :disabled="rowSelectionDisabled || pageRows.length === 0" @change="toggleAllPage($event)" /></th>
                        <th v-for="column in tableColumns" :key="column.key">
                          <button class="th-sort" type="button" :class="{ on: state.sortKey === column.key }" @click="sortBy(column.key)">
                            {{ column.label }}
                            <span class="th-ar">{{ sortMark(column.key) }}</span>
                          </button>
                        </th>
                        <th>
                          <button class="th-sort th-clock" type="button" :class="{ on: state.sortKey === 'entered' }" @click="sortBy('entered')">
                            Entered
                            <span class="th-ar">{{ sortMark('entered') }}</span>
                          </button>
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td :colspan="tableColumns.length + 3" class="empty">Loading...</td>
                      </tr>
                      <tr v-for="record in pageRows" v-else :key="record.id" :class="{ 'row-sel': state.selected.has(record.id) }">
                        <td class="sel-col"><input type="checkbox" :checked="state.selected.has(record.id)" :disabled="rowSelectionDisabled" @change="toggleSelected(record.id, $event)" /></td>
                        <td v-for="column in tableColumns" :key="column.key" :class="cellClass(column.key)">
                          <template v-if="column.key === 'mode'">
                            <span class="tag" :class="modeClass(recordMode(record))">{{ recordMode(record) }}</span>
                          </template>
                          <template v-else-if="column.key === 'rates' || column.key === 'freight'">
                            <div class="rates">
                              <span v-for="chip in rateChips(record)" :key="chip.label" class="rate-chip">
                                {{ chip.label }} <b>{{ chip.value }}</b>
                              </span>
                            </div>
                          </template>
                          <template v-else-if="column.key === 'validity'">
                            <span class="valid" v-html="validCell(record)"></span>
                          </template>
                          <template v-else>
                            {{ cellValue(record, column.key) }}
                          </template>
                        </td>
                        <td class="entered-cell">
                          <span class="ts-date">{{ datePart(record.updatedAt || record.createdAt) }}</span>
                          <span class="ts-time">{{ timePart(record.updatedAt || record.createdAt) }}</span>
                        </td>
                        <td>
                          <div class="row-actions">
                            <button class="icon-btn" type="button" title="Edit" @click="openRecord(record)" v-html="icons.edit"></button>
                            <button class="icon-btn del" type="button" title="Delete" @click="deleteRecord(record)" v-html="icons.trash"></button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="tbl-foot">
                  <div class="psel">
                    Rows per page
                    <select v-model="state.pageSize" @change="state.pageIndex = 0">
                      <option :value="10">10</option>
                      <option :value="25">25</option>
                      <option :value="50">50</option>
                      <option :value="100">100</option>
                      <option value="all">All</option>
                    </select>
                    <span>{{ filteredRows.length }} record(s)</span>
                  </div>
                  <span v-if="state.sortKey" class="sort-status">
                    Sorted by <b>{{ sortLabel }}</b>
                    <button class="sort-clear" type="button" @click="clearSort" v-html="icons.x"></button>
                  </span>
                  <span v-else class="sort-hint">Click a column header to sort</span>
                  <div class="pager">
                    <span class="pg-info">{{ pageFrom }}-{{ pageTo }} of {{ filteredRows.length }} - page {{ state.pageIndex + 1 }}/{{ pageCount }}</span>
                    <div class="pg-nav">
                      <button class="pg-btn" type="button" :disabled="state.pageIndex <= 0" @click="state.pageIndex--" v-html="icons.chevLeft"></button>
                      <button class="pg-btn" type="button" :disabled="state.pageIndex >= pageCount - 1" @click="state.pageIndex++" v-html="icons.chevRight"></button>
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </div>
          </template>
        </template>
      </section>
    </div>

    <div v-if="traderFullDetailModal.open" class="overlay show" @mousedown.self="closeTraderFullDetail">
      <div class="modal trader-full-detail-modal">
        <button class="xbtn" type="button" aria-label="Close" @click="closeTraderFullDetail">&times;</button>
        <div class="trader-full-detail-box">
          <button class="trader-full-detail-copy" type="button" @click="copyTraderFullDetail">{{ traderFullDetailModal.copied ? 'Copied' : 'Copy' }}</button>
          <pre>{{ traderFullDetailModal.text }}</pre>
        </div>
      </div>
    </div>
    <div v-if="accountSettings.open" class="overlay show account-settings-overlay" @mousedown.self="closeAccountSettings">
      <form class="modal account-settings-modal" @submit.prevent="saveAccountSettings" @mousedown="closeAccountDeptOutside">
        <div class="modal-head"><h3>Settings</h3><button class="account-settings-close" type="button" title="Close" @click="closeAccountSettings">&times;</button></div>
        <div class="account-settings-body">
          <div class="settings-section">
            <div class="settings-section-title">Profile</div>
            <div class="account-settings-grid">
              <div class="settings-field"><label>Staff Name</label><input v-model.trim="accountSettings.name" type="text" autocomplete="off" placeholder="e.g. Jane Tran"></div>
              <div class="settings-field"><label>Country Code</label><input v-model.trim="accountSettings.country" maxlength="3" autocomplete="off" placeholder="e.g. VN" @input="accountSettings.country = accountSettings.country.toUpperCase()"></div>
            </div>
            <div class="settings-field"><label>Departments</label><div class="dept-select-wrap" :class="{ focus: accountSettings.deptOpen }" @click="accountSettings.deptOpen = !accountSettings.deptOpen"><span v-for="dept in accountSettings.departments" :key="dept" class="dept-chip" :class="`dept-${dept}`">{{ dept }}<b @click.stop="removeAccountDept(dept)">&times;</b></span><span v-if="!accountSettings.departments.length" class="dept-placeholder">Select departments…</span><span class="dept-caret"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span><div v-if="accountSettings.deptOpen" class="dept-options"><div v-if="!availableAccountDepts.length" class="dept-options-empty">All departments selected</div><button v-for="dept in availableAccountDepts" :key="dept" type="button" @click.stop="toggleAccountDept(dept)"><i class="dept-dot" :class="`dept-${dept}`"></i>{{ dept }}</button></div></div></div>
            <div class="settings-field"><label>Staff ID (auto)</label><input :value="accountSettingsId" readonly></div>
            <p class="settings-hint">Staff ID is generated from Country Code + first name (e.g. VN + Jane → VNJANE).</p>
          </div>
          <div class="settings-section">
            <div class="settings-section-title">Data</div>
            <p class="settings-hint data-copy">All records are stored locally in this browser. Back up regularly — clearing the browser cache or switching device will erase them.</p>
            <div class="settings-data-actions"><button class="btn" type="button" @click="exportAccountBackup">Export backup</button><button class="btn" type="button" @click="importAccountBackup">Import backup</button><button class="btn danger" type="button" @click="resetAccountData">Reset all data</button></div>
          </div>
        </div>
        <div class="account-settings-foot"><button class="btn" type="button" @click="closeAccountSettings">Cancel</button><button class="btn primary" type="submit" :disabled="!accountSettings.name">Save changes</button></div>
      </form>
    </div>
    <div v-if="recordModal.open" class="overlay show" @mousedown.self="closeRecord">
      <form class="modal wide" @submit.prevent="saveRecord">
        <div class="modal-head">
          <div>
            <h3>{{ recordModal.id ? 'Edit' : 'Add' }} {{ cleanTitle(currentPage.title).toLowerCase() }}</h3>
            <p>{{ currentCountry.name }} - {{ currentPage.title }}</p>
          </div>
          <button class="x" type="button" @click="closeRecord" v-html="icons.x"></button>
        </div>
        <div class="modal-body">
          <div class="fgrid three">
            <label v-for="field in formFields" :key="field.key" class="field" :class="{ full: field.full }">
              <span>{{ field.label }}<b v-if="field.required" class="req">*</b></span>
              <select v-if="field.type === 'select'" v-model="recordForm[field.key]">
                <option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
              <textarea v-else-if="field.type === 'textarea'" v-model="recordForm[field.key]" rows="4"></textarea>
              <input v-else v-model="recordForm[field.key]" :type="field.type || 'text'" :placeholder="field.placeholder || ''" />
            </label>
          </div>
          <p v-if="recordModal.error" class="form-error">{{ recordModal.error }}</p>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" @click="closeRecord">Cancel</button>
          <button class="btn btn-primary" type="submit" :disabled="saving">
            <span v-html="icons.check"></span>
            {{ saving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
    <div v-if="traderDriverModal.open" class="overlay show trader-driver-overlay" @mousedown.self="closeTraderDrivers">
      <section class="modal trader-driver-modal">
        <div class="modal-head">
          <h3>DRIVERS &mdash; {{ traderDriverModal.title }}</h3>
          <button class="x" type="button" @click="closeTraderDrivers" v-html="icons.x"></button>
        </div>
        <div class="modal-body">
          <div class="driver-table-wrap">
            <table class="driver-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Phone</th>
                  <th>Truck No#</th>
                  <th>Trailer No#</th>
                  <th class="driver-action-head"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!traderDriverModal.drivers.length">
                  <td colspan="6" class="empty">No drivers yet. Click "+ Add Driver" to create one.</td>
                </tr>
                <tr v-for="driver in traderDriverModal.drivers" :key="driver._uid">
                  <template v-if="traderDriverModal.editId === driver._uid">
                    <td><input v-model="driver.name" class="sm-celli" /></td>
                    <td><input v-model="driver.driverId" class="sm-celli" /></td>
                    <td><input v-model="driver.phone" class="sm-celli" /></td>
                    <td><input v-model="driver.truck" class="sm-celli" /></td>
                    <td><input v-model="driver.trailer" class="sm-celli" /></td>
                    <td class="driver-row-actions">
                      <button class="drvbtn save" type="button" title="Save" @click="saveTraderDriverEdit(driver)">&#10003;</button>
                      <button class="drvbtn cancel" type="button" title="Cancel" @click="cancelTraderDriverEdit">&times;</button>
                    </td>
                  </template>
                  <template v-else>
                    <td @dblclick="editTraderDriver(driver)">{{ driver.name || '-' }}</td>
                    <td @dblclick="editTraderDriver(driver)">{{ driver.driverId || '-' }}</td>
                    <td @dblclick="editTraderDriver(driver)">{{ driver.phone || '-' }}</td>
                    <td @dblclick="editTraderDriver(driver)">{{ driver.truck || '-' }}</td>
                    <td @dblclick="editTraderDriver(driver)">{{ driver.trailer || '-' }}</td>
                    <td class="driver-row-actions">
                      <button class="drvbtn edit" type="button" title="Edit" @click="editTraderDriver(driver)">&#9998;</button>
                      <button class="drvbtn remove" type="button" title="Remove" @click="removeTraderDriver(driver)">&times;</button>
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="driver-actions">
            <button class="sm-btn primary" type="button" @click="addTraderDriver">+ Add Driver</button>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" @click="closeTraderDrivers">Close</button>
        </div>
      </section>
    </div>
    <div v-if="coverageModal.open" class="overlay show coverage-overlay" @mousedown.self="closeCoverageModal">
      <section class="modal coverage-modal">
        <button class="x coverage-x" type="button" title="Exit" @click="closeCoverageModal" v-html="icons.x"></button>
        <div class="modal-head">
          <h3>COVERAGE</h3>
        </div>
        <div class="modal-body">
          <div class="coverage-section-title">Incoterm</div>
          <div class="coverage-grid">
            <div class="coverage-col">
              <div v-for="cluster in coverageClusters.slice(0, 2)" :key="cluster.label" class="coverage-cluster">
                <div class="coverage-cluster-label">{{ cluster.label }}</div>
                <label v-for="option in cluster.opts" :key="option" class="coverage-option" :class="{ on: coverageModal.inco.includes(option), locked: coverageModal.locked }">
                  <input type="checkbox" :value="option" v-model="coverageModal.inco" :disabled="coverageModal.locked" />
                  <span>{{ option }}</span>
                </label>
              </div>
            </div>
            <div class="coverage-col">
              <div v-for="cluster in coverageClusters.slice(2)" :key="cluster.label" class="coverage-cluster">
                <div class="coverage-cluster-label">{{ cluster.label }}</div>
                <label v-for="option in cluster.opts" :key="option" class="coverage-option" :class="{ on: coverageModal.inco.includes(option), locked: coverageModal.locked }">
                  <input type="checkbox" :value="option" v-model="coverageModal.inco" :disabled="coverageModal.locked" />
                  <span>{{ option }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="coverage-section-title coverage-role-title">Role</div>
          <div class="coverage-grid">
            <div class="coverage-col">
              <label v-for="option in coverageRoles.slice(0, 4)" :key="option" class="coverage-option" :class="{ on: coverageModal.role.includes(option), locked: coverageModal.locked }">
                <input type="checkbox" :value="option" v-model="coverageModal.role" :disabled="coverageModal.locked" />
                <span>{{ option }}</span>
              </label>
            </div>
            <div class="coverage-col">
              <label v-for="option in coverageRoles.slice(4)" :key="option" class="coverage-option" :class="{ on: coverageModal.role.includes(option), locked: coverageModal.locked }">
                <input type="checkbox" :value="option" v-model="coverageModal.role" :disabled="coverageModal.locked" />
                <span>{{ option }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" :disabled="saving" @click="coverageModal.locked ? unlockCoverageModal() : closeCoverageModal()">{{ coverageModal.locked ? 'Edit' : 'Cancel' }}</button>
          <button class="btn btn-primary" type="button" :disabled="saving || coverageModal.locked" @click="applyCoverage">Apply</button>
        </div>
      </section>
    </div>

    <div v-if="fxModal.open" class="overlay show" @mousedown.self="closeFxModal">
      <form class="modal" @submit.prevent="saveCurrency">
        <div class="modal-head">
          <div>
            <h3>{{ fxModal.code ? 'Edit' : 'Add' }} currency</h3>
            <p>Exchange rates - base USD</p>
          </div>
          <button class="x" type="button" @click="closeFxModal" v-html="icons.x"></button>
        </div>
        <div class="modal-body">
          <div class="fgrid">
            <label class="field">
              <span>Currency code<b class="req">*</b></span>
              <input v-model.trim="fxForm.code" :disabled="fxForm.base" maxlength="6" placeholder="EUR / CNY / JPY" />
            </label>
            <label class="field">
              <span>Symbol<b class="req">*</b></span>
              <input v-model.trim="fxForm.symbol" maxlength="8" placeholder="$" />
            </label>
            <label class="field">
              <span>Currency name</span>
              <input v-model.trim="fxForm.name" placeholder="US Dollar" />
            </label>
            <label class="field">
              <span>Rate - 1 USD =<b class="req">*</b></span>
              <input v-model="fxForm.rate" :disabled="fxForm.base" type="number" step="0.000001" min="0" />
            </label>
          </div>
          <p v-if="fxModal.error" class="form-error">{{ fxModal.error }}</p>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" @click="closeFxModal">Cancel</button>
          <button class="btn btn-primary" type="submit">
            <span v-html="icons.check"></span>
            Save
          </button>
        </div>
      </form>
    </div>

    <div v-if="fxImportModal.open" class="overlay show" @mousedown.self="closeFxImportModal">
      <section class="modal import-modal">
        <div class="modal-head">
          <div>
            <h3>Import Exchange Rates</h3>
            <p>USD base rates from a live exchange-rate source. Preview first, then select currencies to update.</p>
          </div>
          <button class="x" type="button" @click="closeFxImportModal" v-html="icons.x"></button>
        </div>
        <div class="modal-body">
          <div class="import-tools">
            <label class="field mini">
              <span>Refresh</span>
              <select v-model="fxImportModal.refreshSeconds" @change="restartFxAutoRefresh">
                <option :value="30">30 sec</option>
                <option :value="60">1 min</option>
                <option :value="300">5 min</option>
              </select>
            </label>
            <div class="search import-search">
              <span v-html="icons.search"></span>
              <input v-model.trim="fxImportModal.search" placeholder="Search currency code or name..." />
            </div>
            <label class="toggle-line">
              <input v-model="fxImportModal.autoRefresh" type="checkbox" @change="restartFxAutoRefresh" />
              <span>Auto refresh</span>
            </label>
            <label class="toggle-line">
              <input v-model="fxImportModal.autoSync" type="checkbox" />
              <span>Auto sync</span>
            </label>
            <button class="btn btn-ghost" type="button" :disabled="fxImportModal.loading" @click="loadFxPreview()">
              <span v-html="icons.refresh"></span>
              {{ fxImportModal.loading ? 'Loading...' : 'Reload rates' }}
            </button>
          </div>
          <p v-if="fxImportModal.error" class="form-error">{{ fxImportModal.error }}</p>
          <div class="import-summary">
            <span>{{ fxFilteredItems.length }} visible</span>
            <span>{{ fxChangedCount }} changed/new</span>
            <span>{{ fxSelectedCount }} selected</span>
            <span>Source: {{ fxImportModal.source || '-' }}</span>
            <span>Updated: {{ fxImportModal.updatedAt || '-' }}</span>
            <span>Next: {{ fxImportModal.nextUpdateAt || '-' }}</span>
            <span>Checked: {{ fxImportModal.lastCheckedAt || '-' }}</span>
          </div>
          <div v-if="fxImportModal.syncMessage" class="import-note">{{ fxImportModal.syncMessage }}</div>
          <div class="import-table-wrap">
            <table class="import-table">
              <thead>
                <tr>
                  <th class="sel-col"><input type="checkbox" :checked="fxAllVisibleSelected" @change="toggleAllFxVisible" /></th>
                  <th>Code</th>
                  <th>Currency</th>
                  <th>Symbol</th>
                  <th>Current Rate</th>
                  <th>New Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="fxImportModal.loading"><td colspan="7" class="empty">Loading exchange rates...</td></tr>
                <tr v-else-if="fxFilteredItems.length === 0"><td colspan="7" class="empty">No exchange-rate records loaded.</td></tr>
                <tr v-for="item in fxFilteredItems" v-else :key="item.id" :class="{ muted: item.exists && !item.changed }">
                  <td class="sel-col"><input type="checkbox" :checked="fxImportModal.selected.has(item.id)" :disabled="item.exists && !item.changed" @change="toggleFxSelected(item)" /></td>
                  <td class="code-cell">{{ item.code }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.symbol }}</td>
                  <td>{{ item.currentRate == null ? '-' : Number(item.currentRate).toLocaleString('en-US', { maximumFractionDigits: 6 }) }}</td>
                  <td>{{ Number(item.rate).toLocaleString('en-US', { maximumFractionDigits: 6 }) }}</td>
                  <td><span class="import-status" :class="{ exists: item.exists && !item.changed }">{{ item.exists ? (item.changed ? 'Changed' : 'Current') : 'New' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" @click="closeFxImportModal">Cancel</button>
          <button class="btn btn-primary" type="button" :disabled="importingExternal || fxSelectedCount === 0" @click="importSelectedFxRates">
            <span v-html="icons.plus"></span>
            {{ importingExternal ? 'Importing...' : `Import ${fxSelectedCount} selected` }}
          </button>
        </div>
      </section>
    </div>

    <div v-if="hsImportModal.open" class="overlay show" @mousedown.self="closeHsImportModal">
      <section class="modal import-modal">
        <div class="modal-head">
          <div>
            <h3>Import HS Codes</h3>
            <p>Macmap.org - level 6 commodities not yet added to FCL cargo.</p>
          </div>
          <button class="x" type="button" @click="closeHsImportModal" v-html="icons.x"></button>
        </div>
        <div class="modal-body">
          <div class="import-tools">
            <div class="search import-search">
              <span v-html="icons.search"></span>
              <input v-model.trim="hsImportModal.search" placeholder="Search HS code or product description..." />
            </div>
            <button class="btn btn-ghost" type="button" :disabled="hsImportModal.loading" @click="loadHsPreview">
              <span v-html="icons.refresh"></span>
              {{ hsImportModal.loading ? 'Loading...' : 'Reload Macmap' }}
            </button>
          </div>
          <p v-if="hsImportModal.error" class="form-error">{{ hsImportModal.error }}</p>
          <div class="import-summary">
            <span>{{ hsFilteredItems.length }} visible</span>
            <span>{{ hsNewCount }} new</span>
            <span>{{ hsSelectedCount }} selected</span>
          </div>
          <div class="import-table-wrap">
            <table class="import-table">
              <thead>
                <tr>
                  <th class="sel-col"><input type="checkbox" :checked="hsAllVisibleSelected" @change="toggleAllHsVisible" /></th>
                  <th>HS Code</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="hsImportModal.loading"><td colspan="4" class="empty">Loading Macmap data...</td></tr>
                <tr v-else-if="hsFilteredItems.length === 0"><td colspan="4" class="empty">No HS codes found.</td></tr>
                <tr v-for="item in hsFilteredItems" v-else :key="item.hscode" :class="{ muted: item.exists }">
                  <td class="sel-col"><input type="checkbox" :checked="hsImportModal.selected.has(item.hscode)" :disabled="item.exists" @change="toggleHsSelected(item)" /></td>
                  <td class="code-cell">{{ item.hscode }}</td>
                  <td>{{ item.description }}</td>
                  <td><span class="import-status" :class="{ exists: item.exists }">{{ item.exists ? 'Exists' : 'New' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" @click="closeHsImportModal">Cancel</button>
          <button class="btn btn-primary" type="button" :disabled="importingExternal || hsSelectedCount === 0" @click="importSelectedHsCodes">
            <span v-html="icons.plus"></span>
            {{ importingExternal ? 'Importing...' : `Import ${hsSelectedCount} selected` }}
          </button>
        </div>
      </section>
    </div>

    <div v-if="postalImportModal.open" class="overlay show" @mousedown.self="closePostalImportModal">
      <section class="modal import-modal">
        <div class="modal-head">
          <div>
            <h3>Import Postal Codes</h3>
            <p>Preview records first, then select rows to import into Base Data &gt; Postal Code.</p>
          </div>
          <button class="x" type="button" @click="closePostalImportModal" v-html="icons.x"></button>
        </div>
        <div class="modal-body">
          <div class="import-tools">
            <label class="field mini">
              <span>Country</span>
              <select v-model="postalImportModal.country" @change="loadPostalPreview">
                <option v-for="country in postalImportCountries" :key="country.code" :value="country.code">{{ country.name }}</option>
              </select>
            </label>
            <div class="search import-search">
              <span v-html="icons.search"></span>
              <input v-model.trim="postalImportModal.search" placeholder="Search code, province, ward..." />
            </div>
            <button class="btn btn-ghost" type="button" :disabled="postalImportModal.loading" @click="loadPostalPreview">
              <span v-html="icons.refresh"></span>
              {{ postalImportModal.loading ? 'Loading...' : 'Load data' }}
            </button>
          </div>
          <p v-if="postalImportModal.error" class="form-error">{{ postalImportModal.error }}</p>
          <div class="import-summary">
            <span>{{ postalFilteredItems.length }} visible</span>
            <span>{{ postalNewCount }} new</span>
            <span>{{ postalSelectedCount }} selected</span>
            <span>Source: {{ postalImportModal.source || '-' }}</span>
          </div>
          <div class="import-table-wrap">
            <table class="import-table">
              <thead>
                <tr>
                  <th class="sel-col"><input type="checkbox" :checked="postalAllVisibleSelected" @change="toggleAllPostalVisible" /></th>
                  <th>Postal Code</th>
                  <th>Province / State</th>
                  <th>District</th>
                  <th>Ward / Place</th>
                  <th>Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="postalImportModal.loading"><td colspan="7" class="empty">Loading postal data...</td></tr>
                <tr v-else-if="postalFilteredItems.length === 0"><td colspan="7" class="empty">No postal records loaded.</td></tr>
                <tr v-for="item in postalFilteredItems" v-else :key="item.id" :class="{ muted: item.exists }">
                  <td class="sel-col"><input type="checkbox" :checked="postalImportModal.selected.has(item.id)" :disabled="item.exists" @change="togglePostalSelected(item)" /></td>
                  <td class="code-cell">{{ item.zip }}</td>
                  <td>{{ item.prov }}</td>
                  <td>{{ item.dist || '-' }}</td>
                  <td>{{ item.ward || item.placeName }}</td>
                  <td>{{ item.source }}</td>
                  <td><span class="import-status" :class="{ exists: item.exists }">{{ item.exists ? 'Exists' : 'New' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" @click="closePostalImportModal">Cancel</button>
          <button class="btn btn-primary" type="button" :disabled="importingExternal || postalSelectedCount === 0" @click="importSelectedPostalCodes">
            <span v-html="icons.plus"></span>
            {{ importingExternal ? 'Importing...' : `Import ${postalSelectedCount} selected` }}
          </button>
        </div>
      </section>
    </div>

    <div v-if="seaportImportModal.open" class="overlay show" @mousedown.self="closeSeaportImportModal">
      <section class="modal import-modal">
        <div class="modal-head">
          <div>
            <h3>Import International Seaports</h3>
            <p>UN/LOCODE seaport records filtered by country. Preview first, then select rows to import.</p>
          </div>
          <button class="x" type="button" @click="closeSeaportImportModal" v-html="icons.x"></button>
        </div>
        <div class="modal-body">
          <div class="import-tools">
            <label class="field mini">
              <span>Source</span>
              <select v-model="seaportImportModal.sourceKey" @change="loadSeaportPreview">
                <option v-for="source in seaportImportSources" :key="source.value" :value="source.value">{{ source.label }}</option>
              </select>
            </label>
            <label class="field mini">
              <span>Country</span>
              <select v-model="seaportImportModal.country" @change="loadSeaportPreview">
                <option v-for="country in postalImportCountries" :key="country.code" :value="country.code">{{ country.name }}</option>
              </select>
            </label>
            <div class="search import-search">
              <span v-html="icons.search"></span>
              <input v-model.trim="seaportImportModal.search" placeholder="Search UN/LOCODE, port name, city..." />
            </div>
            <button class="btn btn-ghost" type="button" :disabled="seaportImportModal.loading" @click="loadSeaportPreview">
              <span v-html="icons.refresh"></span>
              {{ seaportImportModal.loading ? 'Loading...' : 'Load UN/LOCODE' }}
            </button>
          </div>
          <p v-if="seaportImportModal.error" class="form-error">{{ seaportImportModal.error }}</p>
          <div class="import-summary">
            <span>{{ seaportFilteredItems.length }} visible</span>
            <span>{{ seaportNewCount }} new</span>
            <span>{{ seaportSelectedCount }} selected</span>
            <span>Source: {{ seaportImportModal.source || '-' }}</span>
          </div>
          <div class="import-table-wrap">
            <table class="import-table">
              <thead>
                <tr>
                  <th class="sel-col"><input type="checkbox" :checked="seaportAllVisibleSelected" @change="toggleAllSeaportVisible" /></th>
                  <th>UN/LOCODE</th>
                  <th>Port Name</th>
                  <th>City</th>
                  <th>Subdivision</th>
                  <th>Function</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="seaportImportModal.loading"><td colspan="7" class="empty">Loading UN/LOCODE seaport data...</td></tr>
                <tr v-else-if="seaportFilteredItems.length === 0"><td colspan="7" class="empty">No seaport records loaded.</td></tr>
                <tr v-for="item in seaportFilteredItems" v-else :key="item.id" :class="{ muted: item.exists }">
                  <td class="sel-col"><input type="checkbox" :checked="seaportImportModal.selected.has(item.id)" :disabled="item.exists" @change="toggleSeaportSelected(item)" /></td>
                  <td class="code-cell">{{ item.code }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.city }}</td>
                  <td>{{ item.subdivision || '-' }}</td>
                  <td>{{ item.function }}</td>
                  <td><span class="import-status" :class="{ exists: item.exists }">{{ item.exists ? 'Exists' : 'New' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" @click="closeSeaportImportModal">Cancel</button>
          <button class="btn btn-primary" type="button" :disabled="importingExternal || seaportSelectedCount === 0" @click="importSelectedSeaports">
            <span v-html="icons.plus"></span>
            {{ importingExternal ? 'Importing...' : `Import ${seaportSelectedCount} selected` }}
          </button>
        </div>
      </section>
    </div>

    <div v-if="cfsImportModal.open" class="overlay show" @mousedown.self="closeCfsImportModal">
      <section class="modal import-modal">
        <div class="modal-head">
          <div>
            <h3>Import CFS Warehouses</h3>
            <p>Container facility records filtered by country. Preview first, then select rows to import.</p>
          </div>
          <button class="x" type="button" @click="closeCfsImportModal" v-html="icons.x"></button>
        </div>
        <div class="modal-body">
          <div class="import-tools">
            <label class="field mini">
              <span>Source</span>
              <select v-model="cfsImportModal.sourceKey" @change="loadCfsPreview">
                <option v-for="source in cfsImportSources" :key="source.value" :value="source.value">{{ source.label }}</option>
              </select>
            </label>
            <label class="field mini">
              <span>Country</span>
              <select v-model="cfsImportModal.country" @change="loadCfsPreview">
                <option v-for="country in postalImportCountries" :key="country.code" :value="country.code">{{ country.name }}</option>
              </select>
            </label>
            <div class="search import-search">
              <span v-html="icons.search"></span>
              <input v-model.trim="cfsImportModal.search" placeholder="Search code, warehouse, address, linked port..." />
            </div>
            <button class="btn btn-ghost" type="button" :disabled="cfsImportModal.loading" @click="loadCfsPreview">
              <span v-html="icons.refresh"></span>
              {{ cfsImportModal.loading ? 'Loading...' : 'Load data' }}
            </button>
          </div>
          <p v-if="cfsImportModal.error" class="form-error">{{ cfsImportModal.error }}</p>
          <div class="import-summary">
            <span>{{ cfsFilteredItems.length }} visible</span>
            <span>{{ cfsNewCount }} new</span>
            <span>{{ cfsSelectedCount }} selected</span>
            <span>Source: {{ cfsImportModal.source || '-' }}</span>
          </div>
          <div class="import-table-wrap">
            <table class="import-table">
              <thead>
                <tr>
                  <th class="sel-col"><input type="checkbox" :checked="cfsAllVisibleSelected" @change="toggleAllCfsVisible" /></th>
                  <th>CFS Code</th>
                  <th>Warehouse Name</th>
                  <th>Address</th>
                  <th>Linked Port</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="cfsImportModal.loading"><td colspan="7" class="empty">Loading CFS warehouse data...</td></tr>
                <tr v-else-if="cfsFilteredItems.length === 0"><td colspan="7" class="empty">No CFS warehouse records loaded.</td></tr>
                <tr v-for="item in cfsFilteredItems" v-else :key="item.id" :class="{ muted: item.exists }">
                  <td class="sel-col"><input type="checkbox" :checked="cfsImportModal.selected.has(item.id)" :disabled="item.exists" @change="toggleCfsSelected(item)" /></td>
                  <td class="code-cell">{{ item.code }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.addr || '-' }}</td>
                  <td class="code-cell">{{ item.port || '-' }}</td>
                  <td>{{ item.type || '-' }}</td>
                  <td><span class="import-status" :class="{ exists: item.exists }">{{ item.exists ? 'Exists' : 'New' }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" @click="closeCfsImportModal">Cancel</button>
          <button class="btn btn-primary" type="button" :disabled="importingExternal || cfsSelectedCount === 0" @click="importSelectedCfs">
            <span v-html="icons.plus"></span>
            {{ importingExternal ? 'Importing...' : `Import ${cfsSelectedCount} selected` }}
          </button>
        </div>
      </section>
    </div>
    <div v-if="confirmModal.open" class="overlay show admin-confirm prompt-overlay" @mousedown.self="resolveConfirm(false)">
      <div class="modal confirm-modal">
        <div class="modal-head">
          <h3>{{ confirmModal.title }}</h3>
        </div>
        <div class="modal-body">
          <p>{{ confirmModal.message }}</p>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" type="button" @click="resolveConfirm(false)">{{ confirmModal.cancelText }}</button>
          <button class="btn" :class="confirmModal.tone === 'danger' ? 'btn-danger' : 'btn-primary'" type="button" @click="resolveConfirm(true)">{{ confirmModal.okText }}</button>
        </div>
      </div>
    </div>
    <div v-if="promptModal.open" class="overlay show admin-confirm prompt-overlay" @mousedown.self="resolvePrompt(null)">
      <div class="modal confirm-modal prompt-modal">
        <div class="prompt-head"><h3>{{ promptModal.title }}</h3></div>
        <div class="prompt-desc">{{ promptModal.desc || promptModal.label }}</div>
        <input
          ref="promptInput"
          v-model.trim="promptModal.value"
          class="prompt-input"
          type="text"
          :placeholder="promptModal.placeholder || promptModal.label"
          autocomplete="off"
          @keydown.enter.prevent="resolvePrompt(promptModal.value)"
        />
        <div class="prompt-foot">
          <button class="prompt-btn" type="button" @click="resolvePrompt(null)">Cancel</button>
          <button class="prompt-btn primary" type="button" @click="resolvePrompt(promptModal.value)">Add</button>
        </div>
      </div>
    </div>
    <div v-if="rolesModal.open" class="overlay show admin-confirm prompt-overlay" @mousedown.self="closeRolesModal">
      <div class="modal confirm-modal prompt-modal roles-modal">
        <div class="prompt-head"><h3>Roles</h3></div>
        <div class="roles-body">
          <div class="rolelist">
            <label
              v-for="option in rolesColumnOpts"
              :key="option"
              class="roleopt"
              :class="{ on: rolesModal.selected.includes(option) }"
            >
              <input
                type="checkbox"
                :checked="rolesModal.selected.includes(option)"
                @change="toggleRoleOption(option)"
              />
              {{ option }}
            </label>
          </div>
          <div v-if="rolesModalDep" class="roles-link">
            <div class="roles-link-title">Depends on CLIENT(s) — add one or more CLIENT IDs:</div>
            <div class="roles-link-row">
              <input
                v-model="rolesModal.clientInput"
                list="roles-client-list"
                placeholder="CLIENT ID"
                autocomplete="off"
                @input="uppercaseRolesClientInput"
                @keydown.enter.prevent="addRoleClientLink"
              />
              <button type="button" class="prompt-btn primary" @click="addRoleClientLink">Add</button>
            </div>
            <datalist id="roles-client-list">
              <option v-for="client in traderClientOptions" :key="client.id" :value="client.id">{{ client.name }}</option>
            </datalist>
            <div class="roles-link-hint" :class="rolesModal.hintKind">{{ rolesModal.hint }}</div>
            <div class="chips">
              <span v-for="id in rolesModal.links" :key="id" class="chip">
                <b>{{ rolesClientNameOf(id) }}</b>
                <span class="cid">{{ id }}</span>
                <span class="x" title="Remove" @click="removeRoleClientLink(id)">×</span>
              </span>
            </div>
          </div>
        </div>
        <div class="prompt-foot">
          <button class="prompt-btn" type="button" @click="closeRolesModal">Cancel</button>
          <button class="prompt-btn primary" type="button" @click="applyRolesModal">Apply</button>
        </div>
      </div>
    </div>
    <div v-if="removeTabModal.open" class="overlay show admin-confirm prompt-overlay" @mousedown.self="resolveRemoveTab(false)">
      <div class="modal confirm-modal prompt-modal">
        <div class="prompt-head"><h3>Remove tab: {{ removeTabModal.label }}</h3></div>
        <div class="prompt-desc">This will permanently delete this tab and ALL its data. This cannot be undone. Type REMOVE to confirm.</div>
        <input
          ref="removeTabInput"
          v-model.trim="removeTabModal.value"
          class="prompt-input"
          type="text"
          placeholder="Type REMOVE to confirm"
          autocomplete="off"
          @keydown.enter.prevent="removeTabModal.value.toUpperCase() === 'REMOVE' && resolveRemoveTab(true)"
        />
        <div class="prompt-foot">
          <button class="prompt-btn" type="button" @click="resolveRemoveTab(false)">Cancel</button>
          <button class="prompt-btn danger" type="button" :disabled="removeTabModal.value.toUpperCase() !== 'REMOVE'" @click="resolveRemoveTab(true)">Remove tab</button>
        </div>
      </div>
    </div>
    <section
      id="aiPanel"
      class="ai-panel"
      :class="{ on: ai.open, 'ai-drop': ai.dragging }"
      :style="{ width: `${ai.panelW}px`, height: `${ai.panelH}px`, bottom: `${ai.bottom + 64}px` }"
      @dragover.prevent="ai.dragging = true"
      @dragleave.prevent="ai.dragging = false"
      @drop.prevent="handleAiDrop"
    >
      <div class="ai-resz" title="Drag to resize" @mousedown.prevent="startAiPanelResize"></div>
      <div class="ai-head" title="Drag up/down" @mousedown.prevent="startAiVerticalDrag">
        <div class="ai-title"><span class="ai-dot"></span>SHOPTRANS AI</div>
        <div class="ai-hbtns">
          <button type="button" title="API key settings" @click="toggleAiSettings">&#9881;</button>
          <button type="button" title="Minimize" @click="ai.open = false">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
      </div>
      <div class="ai-settings" :class="{ on: ai.settingsOpen }">
        <label>Anthropic API Key</label>
        <div class="ai-keyrow">
          <input v-model="ai.apiKeyDraft" class="masked-input" type="text" placeholder="sk-ant-..." autocomplete="off" />
          <button type="button" @click="saveAiKey">Save</button>
        </div>
        <div class="ai-note">Stored only in this browser (localStorage). Use a key with a spend limit.</div>
      </div>
      <div id="aiMsgs" ref="aiMsgsRef">
        <div v-for="message in ai.messages" :key="message.id" class="ai-msg" :class="[message.role, { 'ai-card': message.preview }]">
          <template v-if="message.preview">
            <div class="ai-card-h">
              Insert {{ message.preview.rows.length }} row{{ message.preview.rows.length === 1 ? '' : 's' }} into: {{ message.preview.label }}
              <small>{{ message.preview.path }}</small>
            </div>
            <div class="ai-card-tblwrap">
              <table>
                <thead>
                  <tr>
                    <th v-for="column in message.preview.columns" :key="column.key">{{ column.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in message.preview.rows" :key="rowIndex">
                    <td v-for="column in message.preview.columns" :key="column.key">
                      <select
                        v-if="column.kind === 'select' && column.opts?.length"
                        v-model="row[column.key]"
                        :class="{ 'aiv-bad': aiPreviewBad(message.preview, row, column) }"
                        :disabled="message.preview.applied || message.preview.cancelled || ai.loading"
                      >
                        <option v-for="option in column.opts" :key="option" :value="option">{{ option }}</option>
                      </select>
                      <input
                        v-else-if="column.kind === 'date'"
                        v-model="row[column.key]"
                        type="date"
                        lang="en-ZA"
                        :disabled="message.preview.applied || message.preview.cancelled || ai.loading"
                      />
                      <input
                        v-else-if="column.kind === 'checkbox'"
                        v-model="row[column.key]"
                        type="checkbox"
                        :disabled="message.preview.applied || message.preview.cancelled || ai.loading"
                      />
                      <input
                        v-else
                        v-model="row[column.key]"
                        type="text"
                        :class="{ 'aiv-bad': aiPreviewBad(message.preview, row, column) }"
                        :disabled="message.preview.applied || message.preview.cancelled || ai.loading"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="!message.preview.applied && !message.preview.cancelled" class="ai-card-f">
              <span v-if="message.preview.error" class="ai-q">{{ message.preview.error }}</span>
              <button class="ai-btn red" type="button" :disabled="ai.loading" @click="cancelAiPreview(message.preview)">Cancel</button>
              <button class="ai-btn green" type="button" :disabled="ai.loading || aiPreviewHasErrors(message.preview)" @click="applyAiPreview(message.preview)">Apply</button>
            </div>
            <div v-else class="ai-card-done" :class="{ ok: message.preview.applied, no: message.preview.cancelled }">
              {{ message.preview.applied ? `Inserted ${message.preview.inserted || 0} row${message.preview.inserted === 1 ? '' : 's'} into ${message.preview.label}` : 'Cancelled - nothing was saved' }}
            </div>
          </template>
          <span v-else v-html="aiMessageHtml(message.text)"></span>
        </div>
        <div v-if="ai.loading" class="ai-msg ai"><span class="ai-dots">...</span></div>
      </div>
      <div id="aiThumbs" :class="{ on: ai.images.length }">
        <div v-for="(image, index) in ai.images" :key="`${image.name}-${index}`" class="ai-thumb">
          <img :src="image.url" alt="" />
          <button type="button" @click="removeAiImage(index)">&times;</button>
        </div>
      </div>
      <div class="ai-inrow">
        <div id="aiInpDrag" title="Drag to resize" @mousedown.prevent="startAiInputResize"></div>
        <button id="aiAttach" type="button" title="Attach images" @click="openAiFilePicker">&#128206;</button>
        <textarea
          id="aiInput"
          ref="aiInputRef"
          v-model="ai.input"
          :style="{ height: `${ai.inputH}px` }"
          placeholder="Type a question or command..."
          :disabled="ai.loading"
          @keydown.enter.exact.prevent="sendAiMessage"
          @input="autoSizeAiInput"
        ></textarea>
        <button id="aiSend" type="button" :disabled="ai.loading || (!ai.input.trim() && !ai.images.length)" @click="sendAiMessage">Send</button>
      </div>
      <input ref="aiFileInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple class="hidden-file" @change="handleAiFiles" />
    </section>
    <button id="aiFab" class="ai-fab" title="Kéo để di chuyển lên hoặc xuống" aria-label="SHOPTRANS AI - kéo để di chuyển, bấm để mở" type="button" :style="{ bottom: `${ai.bottom}px` }" @mousedown.prevent="startAiVerticalDrag" @click="toggleAiPanel">
      <span class="ai-fab-hint" aria-hidden="true">Kéo để di chuyển</span>
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5c-1.6 0-3.1-.4-4.4-1.2L3 20l1.2-4.1A8.5 8.5 0 1 1 21 11.5z"/><circle cx="8.5" cy="11.5" r="1" fill="#fff" stroke="none"/><circle cx="12.5" cy="11.5" r="1" fill="#fff" stroke="none"/><circle cx="16.5" cy="11.5" r="1" fill="#fff" stroke="none"/></svg>
    </button>
    <div v-if="adminToast.open" class="admin-toast">{{ adminToast.message }}</div>
    <input ref="importFile" class="hidden-file" type="file" accept=".xlsx,.xls,.csv,.txt" @change="handleImport" />
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import AdminMassSales from '~/components/admin/AdminMassSales.vue'
import { parseOpsKey } from '~/composables/useOpsSheet'
import { useAdminConsoleStore } from '~/store/adminConsole'
import {
  findSalesFeeTabId,
  salesCurrencyOptions,
  salesFeeTabs,
  salesField,
  salesMarketingTopTabs,
  salesModes,
  salesStatusNotesFields,
} from '~/utils/adminSalesMarketing.mjs'

definePageMeta({ layout: false })

type AdminRecord = {
  id: string
  country: string
  page: string
  kind: string
  data: Record<string, any>
  sortOrder: number
  createdAt?: string
  updatedAt: string
}

type AdminTrash = {
  id: string
  type: string
  country?: string | null
  page?: string | null
  kind?: string | null
  label: string
  payload: Record<string, any>
  deletedBy?: string | null
  deletedAt: string
}

type AiImage = {
  name: string
  type: string
  url: string
  data: string
}

type AiPreview = {
  id: string
  tableKey: string
  label: string
  path: string
  country: string
  kind: string
  columns: any[]
  rows: Record<string, any>[]
  applied?: boolean
  cancelled?: boolean
  inserted?: number
  error?: string
}

type AiMessage = {
  id: string
  role: 'user' | 'ai' | 'sys' | 'err'
  text: string
  preview?: AiPreview
}

const icons: Record<string, string> = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg>',
  chevLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  db: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  ship: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 20a3 3 0 0 0 2.5-1 3 3 0 0 1 5 0 3 3 0 0 0 5 0 3 3 0 0 1 5 0 3 3 0 0 0 2.5 1"/><path d="M4 18 2.5 9.5 12 6l9.5 3.5L20 18"/><path d="M12 6V3M8 8.5l8 0"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 6h13v10H1zM14 9h4l3 3v4h-7"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 13.5 13.5 20a2 2 0 0 1-2.8 0L3 12.3V3h9.3L20 10.7a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>',
  empty: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2Z"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15h6M9 11h6"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
  opsSpark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 8l-3 6a4 4 0 0 0 6 0l-3-6zM19 8l-3 6a4 4 0 0 0 6 0l-3-6zM4 8h16M9 3h6"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M9 13h1M14 9h1M14 13h1M9 21v-4h6v4"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18M7 15l4-5 3 3 5-7"/></svg>',
  plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-8-8 18-2-8-8-2z"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
}

const defaultNav = [
  { id: 'operations', label: 'Operations', icon: 'box', sections: [
    { id: 'efa', label: 'EFA · EXW, FCA', icon: 'box', color: 'efa', items: [
      { id: 'wb_efa_fcl', label: 'FCL' },
      { id: 'wb_efa_lcl', label: 'LCL' },
      { id: 'wb_efa_air', label: 'AIR' },
    ]},
    { id: 'fcf', label: 'FCF · FOB, CIF', icon: 'box', color: 'fcf', items: [
      { id: 'wb_fcf_fcl', label: 'FCL' },
      { id: 'wb_fcf_lcl', label: 'LCL' },
      { id: 'wb_fcf_air', label: 'AIR' },
    ]},
    { id: 'do', label: 'DO · RELEASE D/O', icon: 'box', color: 'do', items: [
      { id: 'wb_do_fcl', label: 'FCL' },
      { id: 'wb_do_lcl', label: 'LCL' },
      { id: 'wb_do_air', label: 'AIR' },
    ]},
    { id: 'dup', label: 'DUP · DDU, DAP, DDP', icon: 'box', color: 'dup', items: [
      { id: 'wb_dup_fcl', label: 'FCL' },
      { id: 'wb_dup_lcl', label: 'LCL' },
      { id: 'wb_dup_air', label: 'AIR' },
    ]},
    { id: 'd2d', label: 'OVS · OVERSEAS', icon: 'box', color: 'd2d', items: [
      { id: 'wb_d2d_fcl', label: 'FCL' },
      { id: 'wb_d2d_lcl', label: 'LCL' },
      { id: 'wb_d2d_air', label: 'AIR' },
    ]},
  ]},
  { id: 'sales', label: 'SALES', icon: 'tag', sections: [
    { id: 'sales_master', label: 'BASE DATA', icon: 'db', items: [
      { id: 'ports', label: 'International Seaports' },
      { id: 'cfs', label: 'CFS Warehouses' },
      { id: 'admin', label: 'Postal Code' },
    ] },
    { id: 'sales_origin', label: 'AT ORIGIN', icon: 'pin', items: [
      { id: 'o_customs', label: 'Customs Fee' },
      { id: 'o_inspect', label: 'Inspection Fee' },
      { id: 'o_truck', label: 'Trucking Fee' },
      { id: 'o_demur', label: 'Demurrage Fee' },
      { id: 'o_lift', label: 'Lift On/Off Fee' },
      { id: 'o_infra', label: 'Port Infrastructure Fee' },
    ] },
    { id: 'sales_sea', label: 'SEA FREIGHT', icon: 'ship', items: [
      { id: 'ocean', label: 'Ocean Freight (OFR)' },
      { id: 'surcharge', label: 'Freight Surcharges' },
      { id: 'lc_origin', label: 'Local Charge - Origin' },
      { id: 'lc_dest', label: 'Local Charge - Destination' },
    ] },
    { id: 'sales_dest', label: 'AT DESTINATION', icon: 'layers', items: [
      { id: 'd_handling', label: 'Handling Fee' },
      { id: 'd_customs', label: 'Customs Fee' },
      { id: 'd_inspect', label: 'Inspection Fee' },
      { id: 'd_truck', label: 'Trucking Fee' },
      { id: 'd_demur', label: 'Demurrage Fee' },
      { id: 'd_lift', label: 'Lift On/Off Fee' },
      { id: 'd_infra', label: 'Port Infrastructure Fee' },
    ] },
  ] },
  { id: 'customs_legal', label: 'Customs & Legal', icon: 'shield', items: [{ id: 'customs_legal', label: 'Customs & Legal' }] },
  { id: 'master_data', label: 'Master Data', icon: 'db', items: [{ id: 'wb_staff', label: 'ENTITIES' }, { id: 'fx', label: 'EX RATE' }] },
]

const defaultPages: Record<string, any> = {
  admin_blank: { kind: 'blank-home', title: 'Admin', group: 'operations', desc: '' },
  ops_home: { kind: 'operations-home', title: 'Operations', group: 'operations', desc: 'Select a transport mode from the Operations sidebar.' },
  wb_efa_fcl: { kind: 'workbook', title: 'EFA · EXW, FCA · FCL', group: 'operations', sheetKey: 'EFA::FCL::GSD', desc: 'EFA EXW FCL GSD operations worksheet.' },
  wb_efa_lcl: { kind: 'workbook', title: 'EFA · EXW, FCA · LCL', group: 'operations', sheetKey: 'EFA::LCL::GSD', desc: 'EFA EXW LCL GSD operations worksheet.' },
  wb_efa_air: { kind: 'workbook', title: 'EFA · EXW, FCA · AIR', group: 'operations', sheetKey: 'EFA::AIR::GSD', desc: 'EFA EXW AIR GSD operations worksheet.' },
  wb_fcf_fcl: { kind: 'workbook', title: 'FCF · FOB, CIF · FCL', group: 'operations', sheetKey: 'FCF::FCL::GSD', desc: 'FCF FCL GSD operations worksheet.' },
  wb_fcf_lcl: { kind: 'workbook', title: 'FCF · FOB, CIF · LCL', group: 'operations', sheetKey: 'FCF::LCL::GSD', desc: 'FCF LCL GSD operations worksheet.' },
  wb_fcf_air: { kind: 'workbook', title: 'FCF · FOB, CIF · AIR', group: 'operations', sheetKey: 'FCF::AIR::GSD', desc: 'FCF AIR GSD operations worksheet.' },
  wb_do_fcl: { kind: 'workbook', title: 'DO · RELEASE D/O · FCL', group: 'operations', sheetKey: 'DO::FCL::GSD', desc: 'DO FCL GSD operations worksheet.' },
  wb_do_lcl: { kind: 'workbook', title: 'DO · RELEASE D/O · LCL', group: 'operations', sheetKey: 'DO::LCL::GSD', desc: 'DO LCL GSD operations worksheet.' },
  wb_do_air: { kind: 'workbook', title: 'DO · RELEASE D/O · AIR', group: 'operations', sheetKey: 'DO::AIR::GSD', desc: 'DO AIR GSD operations worksheet.' },
  wb_dup_fcl: { kind: 'workbook', title: 'DUP · DDU, DAP, DDP · FCL', group: 'operations', sheetKey: 'DUP::FCL::GSD', desc: 'DUP FCL GSD operations worksheet.' },
  wb_dup_lcl: { kind: 'workbook', title: 'DUP · DDU, DAP, DDP · LCL', group: 'operations', sheetKey: 'DUP::LCL::GSD', desc: 'DUP LCL GSD operations worksheet.' },
  wb_dup_air: { kind: 'workbook', title: 'DUP · DDU, DAP, DDP · AIR', group: 'operations', sheetKey: 'DUP::AIR::GSD', desc: 'DUP AIR GSD operations worksheet.' },
  wb_d2d_fcl: { kind: 'workbook', title: 'OVS · OVERSEAS · FCL', group: 'operations', sheetKey: 'D2D::FCL::ECD', desc: 'OVS FCL ECD overseas operations worksheet.' },
  wb_d2d_lcl: { kind: 'workbook', title: 'OVS · OVERSEAS · LCL', group: 'operations', sheetKey: 'D2D::LCL::ECD', desc: 'OVS LCL ECD overseas operations worksheet.' },
  wb_d2d_air: { kind: 'workbook', title: 'OVS · OVERSEAS · AIR', group: 'operations', sheetKey: 'D2D::AIR::ECD', desc: 'OVS AIR ECD overseas operations worksheet.' },
  wb_hq: { kind: 'checklist', title: 'DOCS CHECKLIST', group: 'customs_legal', global: true, desc: 'Docs checklist tabs from All in one.html.' },
  wb_hq_ktcn: { kind: 'checklist', title: 'IMEX RULES LIST', group: 'customs_legal', global: true, desc: 'IMEX rules list from All in one.html.' },
  wb_vbpl: { kind: 'regulations', title: 'RULES UPDATE', group: 'customs_legal', global: true, desc: 'Active and expired regulations register from All in one.html.' },
  wb_staff: {
    kind: 'workbook',
    title: 'ENTITIES',
    group: 'master_data',
    sheetKey: 'STAFF',
    tabs: [
      { key: 'STAFF', label: 'STAFF' },
      { key: 'NEW CLIENT', label: 'NEW CLIENT' },
      { key: 'MBL CNEE', label: 'MBL CNEE' },
      { key: 'AGENT', label: 'AGENT' },
      { key: 'EDO', label: 'EDO' },
    ],
    desc: 'Master data worksheet from Operations mockup.',
  },
  wb_new_client: { kind: 'workbook', title: 'NEW CLIENT', group: 'master_data', sheetKey: 'NEW CLIENT', desc: 'Master data worksheet from All in one.html.' },
  wb_mbl_cnee: { kind: 'workbook', title: 'MBL CNEE', group: 'master_data', sheetKey: 'MBL CNEE', desc: 'Master data worksheet from All in one.html.' },
  wb_agent: { kind: 'workbook', title: 'AGENT', group: 'master_data', sheetKey: 'AGENT', desc: 'Master data worksheet from All in one.html.' },
  wb_edo: { kind: 'workbook', title: 'EDO', group: 'master_data', sheetKey: 'EDO', desc: 'Master data worksheet from All in one.html.' },
  page_fcl: { kind: 'page-fcl', title: 'FCL Page Data', group: 'page_data', global: true, desc: 'Page data migrated from the legacy /admin/fcl page.' },
  page_products: { kind: 'page-products', title: 'Products Page Data', group: 'page_data', global: true, desc: 'Products page content migrated from the legacy /admin/products editor.' },
  page_solutions: { kind: 'page-solutions', title: 'Solutions Page Data', group: 'page_data', global: true, desc: 'Solutions page content migrated from the legacy /admin/solutions editor.' },
  page_local_information: { kind: 'page-local-information', title: 'Local-Information Page Data', group: 'page_data', global: true, desc: 'Local Information page content migrated from the legacy /admin/local-information editor.' },
  ports: { kind: 'master-ports', title: 'International Seaports', group: 'master', desc: 'Seaport catalog (UN/LOCODE) used as base data for trucking fees and transport lanes.' },
  cfs: { kind: 'master-cfs', title: 'CFS Warehouses', group: 'master', desc: 'CFS consolidation warehouse catalog per country.' },
  admin: { kind: 'master-admin', title: 'Postal Code', group: 'master', desc: 'Province / District / Ward and international-standard postal codes - the suggestion source for the trucking-fee input.' },
  fx: { kind: 'master-fx', title: 'Exchange Rates', group: 'master_data', desc: 'Currency catalog and exchange rates with USD base.' },
  internal_directory: { kind: 'internal-directory', title: 'Internal Directory', group: 'internal', global: true, desc: 'Manage internal directory records.' },
  quality_control: { kind: 'quality-control', title: 'Quality Control', group: 'quality', global: true, desc: 'Manage incidents and review quality-control history.' },
  analysis_statistics: { kind: 'analysis-statistics', title: 'Analysis & Statistics', group: 'analysis', global: true, desc: 'Shipment analysis and statistics records.' },
  traders_suppliers: { kind: 'traders-suppliers', title: 'Traders', group: 'traders_suppliers', desc: 'Manage your trader directory — add, remove and search records.' },
  reference_data: { kind: 'reference-data', title: 'Reference Data', group: 'reference_data', global: true, desc: 'Manage reference data records.' },
  customs_legal: { kind: 'customs-legal', title: 'Customs & Legal', group: 'customs_legal', global: true, desc: 'Manage customs and legal records.' },
  sales_marketing: { kind: 'sales-marketing', title: 'Sales & Marketing', group: 'sales_marketing', desc: '' },
  workspace: { kind: 'workspace', title: 'Workspace', group: 'workspace', global: true, desc: 'Workspace tabs ported from mockup.' },
  o_customs: { kind: 'fee', title: 'Customs Fee - At Origin', group: 'origin', fcl: true, lclUnit: 'set', scope: 'port', validity: true, desc: 'Fixed fee. FCL charged per container; LCL per set.' },
  o_inspect: { kind: 'fee', title: 'Inspection Fee - At Origin', group: 'origin', fcl: true, lclUnit: 'set', scope: 'port', validity: true, inspect: true, desc: 'Fixed fee. Additional costs arising from actual inspection: per invoice.' },
  o_truck: { kind: 'trucking', title: 'Trucking Fee - At Origin', group: 'origin', validity: true, desc: 'Select a port/CFS + postal code. FCL per container; LCL per truck type.' },
  o_demur: { kind: 'fee', title: 'Demurrage Fee - At Origin', group: 'origin', fcl: true, lclUnit: 'truck/night', scope: 'port', validity: true, desc: 'Fixed fee. FCL per container; LCL per truck/night.' },
  o_lift: { kind: 'fee', title: 'Lift On/Off Fee - At Origin', group: 'origin', fcl: true, lclUnit: null, scope: 'port', validity: true, desc: 'Fixed fee. FCL per container. Not applicable to LCL.' },
  o_infra: { kind: 'fee', title: 'Port Infrastructure Fee - At Origin', group: 'origin', fcl: true, lclUnit: 'tons', scope: 'port', validity: true, desc: 'Fixed fee. FCL per container; LCL per ton.' },
  ocean: { kind: 'ocean', title: 'Ocean Freight', group: 'sea', validity: true, desc: 'FCL per container; LCL per set. Includes sailing schedule, transit time, via and freetime.' },
  surcharge: { kind: 'fee', title: 'Freight Surcharges', group: 'sea', feeTypes: ['BAF', 'YAS', 'RR'], fcl: true, lclUnit: 'W/M', validity: true, desc: 'BAF / YAS / RR. FCL per container; LCL per W/M.' },
  lc_origin: { kind: 'localcharge', title: 'Local Charge - Origin', group: 'sea', validity: true, desc: 'THC, B/L, Seal, Telex and other fees. Unit is auto-set by fee type.' },
  lc_dest: { kind: 'localcharge', title: 'Local Charge - Destination', group: 'sea', validity: true, desc: 'THC, D/O, Cleaning, EMC, CFS and other fees. Unit is auto-set by fee type.' },
  d_handling: { kind: 'flat', title: 'Handling Fee - At Destination', group: 'dest', flatUnit: 'B/L', validity: true, desc: 'Charged per B/L for both FCL and LCL.' },
  d_customs: { kind: 'fee', title: 'Customs Fee - At Destination', group: 'dest', fcl: true, lclUnit: 'set', scope: 'port', validity: true, desc: 'Fixed fee. FCL per container; LCL per set.' },
  d_inspect: { kind: 'fee', title: 'Inspection Fee - At Destination', group: 'dest', fcl: true, lclUnit: 'set', scope: 'port', validity: true, inspect: true, desc: 'Fixed fee. Additional costs from actual inspection: per invoice.' },
  d_truck: { kind: 'trucking', title: 'Trucking Fee - At Destination', group: 'dest', validity: true, desc: 'Same structure as At Origin trucking.' },
  d_demur: { kind: 'fee', title: 'Demurrage Fee - At Destination', group: 'dest', fcl: true, lclUnit: 'truck/night', scope: 'port', validity: true, desc: 'Fixed fee. FCL per container; LCL per truck/night.' },
  d_lift: { kind: 'fee', title: 'Lift On/Off Fee - At Destination', group: 'dest', fcl: true, lclUnit: null, scope: 'port', validity: true, desc: 'Fixed fee. FCL per container. Not applicable to LCL.' },
  d_infra: { kind: 'fee', title: 'Port Infrastructure Fee - At Destination', group: 'dest', fcl: true, lclUnit: 'tons', scope: 'port', validity: true, desc: 'Fixed fee. FCL per container; LCL per ton.' },
}

const mockupGroupIds = ['operations', 'sales', 'customs_legal', 'master_data']
const lockedGroupIds = ['operations', 'sales', 'customs_legal', 'master_data']
const adminStore = useAdminConsoleStore()
const router = useRouter()
// The Admin Console endpoints live in this standalone Nuxt application.
// Other business APIs still use useApiBaseUrl() and the existing backend.
const API_BASE = '/api'
const loading = ref(false)
const saving = ref(false)
const importingExternal = ref(false)
const countryOpen = ref(false)
const sidebarCollapsed = ref(false)
const sidebarWidth = ref(212)
const sidebarResize = reactive({ active: false, x: 0, w: 212 })
const importFile = ref<HTMLInputElement | null>(null)
let recordsLoadToken = 0
let salesFeeReferenceLoadToken = 0
const nav = ref<any[]>([])
const pages = ref<Record<string, any>>({})
const settings = ref<Record<string, any>>({})
const records = ref<AdminRecord[]>([])
const trashItems = ref<AdminTrash[]>([])
const analysisDashboardRecords = ref<AdminRecord[]>([])
const aiMsgsRef = ref<HTMLElement | null>(null)
const aiInputRef = ref<HTMLTextAreaElement | null>(null)
const aiFileInput = ref<HTMLInputElement | null>(null)
let aiSeq = 0
let aiPanelResize: { x: number, y: number, w: number, h: number } | null = null
let aiInputResize: { y: number, h: number } | null = null
let aiVerticalDrag: { y: number, bottom: number } | null = null
let aiVerticalDragMoved = false
let aiVerticalDragSuppress = false

const ai = reactive({
  open: false,
  settingsOpen: false,
  apiKey: '',
  apiKeyDraft: '',
  model: 'claude-sonnet-4-6',
  input: '',
  inputH: 36,
  panelW: 390,
  panelH: 600,
  bottom: 20,
  loading: false,
  dragging: false,
  images: [] as AiImage[],
  pendingNotes: [] as string[],
  messages: [
    {
      id: 'ai-welcome',
      role: 'ai',
      text: 'Hi! I can look up your data or enter new rows for you. Try: "Tong revenue theo customer nam 2025" or attach a booking file and tell me which table to fill.',
    },
  ] as AiMessage[],
  history: [] as any[],
})

const state = reactive({
  country: 'VN',
  page: 'wb_efa_fcl',
  view: 'data' as 'data' | 'trash',
  search: '',
  smTop: 'At Origin',
  smMode: 'FCL',
  smSub: 'origin_fcl_clearance',
  smSearchField: 'all',
  smStatus: 'Active',
  smFilterOpen: false,
  smExportOpen: false,
  traderTab: 'traders',
  refTab: 'vessels',
  legalTab: 'docs_checklist',
  internalTab: 'staff',
  haulageMode: 'fcl',
  qcTab: 'incident',
  analysisTop: 'Summary',
  analysisSub: 'total_revenue',
  modeFilter: 'ALL',
  fclTab: 'locations',
  editMenu: false,
  collapsedGroups: [] as string[],
  collapsedSections: [] as string[],
  selected: new Set<string>(),
  sortKey: '',
  sortDir: 1,
  pageSize: 25 as number | 'all',
  pageIndex: 0,
})
const adminToast = reactive({ open: false, message: '' })
const haulageOrsKey = ref('')
const haulageTtBuffer = ref(1.3)
const haulageCalculating = ref(false)
const haulageStaffOptions = ref<string[]>([])
const haulageLookupOptions = reactive<Record<string, string[]>>({ fromport: [], fromwh: [], haulier: [] })
let adminToastTimer: ReturnType<typeof setTimeout> | null = null

const recordModal = reactive({ open: false, id: '', error: '' })
const traderFullDetailModal = reactive({ open: false, title: '', text: '', copied: false })
const recordForm = reactive<Record<string, any>>({})
const smAdding = ref(false)
const smEditId = ref('')
const smDraft = reactive<Record<string, any>>({})
const smEditDraft = reactive<Record<string, any>>({})
const smListPicker = reactive({ key: '', index: 0 })
const smListDraftMode = ref<'add' | 'edit'>('add')
const smLedgeTick = ref(0)
const smAdvFilters = reactive<Array<{ field: string, op: string, value: string, valueTo: string }>>([])
const smFilterCollapsed = ref(false)
const lastSalesFeeLabel = ref('Clearance Fee')
const salesListRecords = reactive<Record<string, AdminRecord[]>>({ city: [], country: [], cur: [], fromport: [], fromwh: [], haulier: [] })
const salesFeeReferenceRecords = reactive<Record<'ports' | 'airports' | 'postal', AdminRecord[]>>({ ports: [], airports: [], postal: [] })
type PostalTreeNode = { key: string, label: string, kind: 'province' | 'district' | 'ward' | 'postal', depth: number, zip?: string, status?: string, recordId?: string, record?: AdminRecord }
const postalRecordsByCountry = reactive<Record<string, AdminRecord[]>>({})
const postalDirectory = reactive({
  countryIso: '',
  countryRecordId: '',
  loading: false,
  saving: false,
  editId: '',
  error: '',
  expanded: new Set<string>(),
  form: { prov: '', dist: '', ward: '', zip: '', status: 'Active' },
})
const salesFeeReferenceLists: Record<string, { bucket: 'ports' | 'airports' | 'postal', key: string }> = {
  dlPortCode: { bucket: 'ports', key: 'portcode' },
  dlPortName: { bucket: 'ports', key: 'portname' },
  dlAirportCode: { bucket: 'airports', key: 'iata' },
  dlAirportName: { bucket: 'airports', key: 'airportname' },
  dlPostal: { bucket: 'postal', key: 'postalcode' },
  dlWard: { bucket: 'postal', key: 'district' },
}
const smColWidths = reactive<Record<string, Record<string, number>>>({})
const smColResize = reactive({ active: false, page: '', key: '', startX: 0, startW: 0 })
const smCustomColumns = reactive<Record<string, any[]>>({})
const smColumnConfigId = ref('')
const smHeaderMenu = reactive({ open: false, x: 0, y: 0, pageId: '', columnKey: '' })
const traderDriverModal = reactive({
  open: false,
  recordId: '',
  title: '',
  editId: '',
  snapshot: null as null | Record<string, any>,
  drivers: [] as Array<Record<string, any>>,
})
const coverageModal = reactive({
  open: false,
  mode: 'record' as 'record' | 'add' | 'edit',
  recordId: '',
  locked: false,
  inco: [] as string[],
  role: [] as string[],
})
const coverageClusters = [
  { label: 'Cluster 1', opts: ['EXW', 'FCA'] },
  { label: 'Cluster 2', opts: ['FCF'] },
  { label: 'Cluster 3', opts: ['DO'] },
  { label: 'Cluster 4', opts: ['DAP', 'DDU', 'DDP'] },
]
const coverageRoles = ['OPS', 'GSD', 'ECD', 'ICD', 'CCD', 'TCD', 'DCD', 'FCD']
const fxModal = reactive({ open: false, code: '', error: '' })
const fxForm = reactive<Record<string, any>>({ code: '', name: '', symbol: '', rate: 1, base: false })
const confirmModal = reactive({
  open: false,
  title: 'Confirm',
  message: '',
  okText: 'OK',
  cancelText: 'Cancel',
  tone: 'primary',
  resolve: null as null | ((value: boolean) => void),
})
const promptInput = ref<HTMLInputElement | null>(null)
const promptModal = reactive({
  open: false,
  title: 'Input',
  label: '',
  desc: '',
  placeholder: '',
  value: '',
  resolve: null as null | ((value: string | null) => void),
})
const rolesModal = reactive({
  open: false,
  mode: 'add' as 'add' | 'edit',
  selected: [] as string[],
  links: [] as string[],
  clientInput: '',
  hint: '',
  hintKind: '' as '' | 'ok' | 'bad' | 'muted',
})
const removeTabInput = ref<HTMLInputElement | null>(null)
const removeTabModal = reactive({
  open: false,
  label: '',
  value: '',
  resolve: null as null | ((value: boolean) => void),
})
const fxImportModal = reactive({
  open: false,
  loading: false,
  error: '',
  search: '',
  source: '',
  updatedAt: '',
  nextUpdateAt: '',
  lastCheckedAt: '',
  syncMessage: '',
  autoRefresh: false,
  autoSync: false,
  refreshSeconds: 60,
  items: [] as any[],
  selected: new Set<string>(),
})
const hsImportModal = reactive({
  open: false,
  loading: false,
  error: '',
  search: '',
  items: [] as any[],
  selected: new Set<string>(),
})
const postalImportModal = reactive({
  open: false,
  loading: false,
  error: '',
  search: '',
  country: 'US',
  source: '',
  items: [] as any[],
  selected: new Set<string>(),
})
const seaportImportModal = reactive({
  open: false,
  loading: false,
  error: '',
  search: '',
  country: 'VN',
  sourceKey: 'UNLOCODE',
  source: '',
  items: [] as any[],
  selected: new Set<string>(),
})
const cfsImportModal = reactive({
  open: false,
  loading: false,
  error: '',
  search: '',
  country: 'VN',
  sourceKey: 'BIC',
  source: '',
  items: [] as any[],
  selected: new Set<string>(),
})
const postalImportCountries = [
  { code: 'US', name: 'America' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'CN', name: 'China' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'Korea' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Viet Nam' },
]
const seaportImportSources = [
  { value: 'UNLOCODE', label: 'UN/LOCODE' },
  { value: 'ECU360', label: 'ECU360 (API key)' },
]
const cfsImportSources = [
  { value: 'BIC', label: 'BIC Facility Codes (account)' },
]
let fxAutoRefreshTimer: ReturnType<typeof setInterval> | null = null

const headers = () => adminStore.token ? { Authorization: `Bearer ${adminStore.token}` } : {}
const unwrap = (payload: any) => payload?.data ?? payload
const apiFetch = async (url: string, options: any = {}) => {
  try {
    return unwrap(await $fetch(`${API_BASE}/admin-console${url}`, {
      ...options,
      headers: { ...headers(), ...(options.headers || {}) },
    }))
  } catch (error: any) {
    const status = Number(error?.statusCode || error?.status || error?.response?.status || error?.data?.statusCode)
    if (status === 401 || status === 403) {
      await adminStore.logout()
      await router.replace({ path: '/admin/login', query: { redirect: '/admin' } })
    }
    throw error
  }
}

const countries = computed(() => settings.value.countries || [{ id: 'VN', name: 'Vietnam', flag: 'vn', cur: 'USD' }])
const globalAdminRoles = new Set(['ADMIN', 'SUPER_ADMIN', 'SUPER ADMIN', 'ROOT'])
const canSwitchCountry = computed(() => globalAdminRoles.has(String(adminStore.admin?.role || '').trim().toUpperCase()))
const assignedCountry = computed(() => String(adminStore.admin?.country || '').trim().toUpperCase())
const ACCOUNT_DEPTS = ['GSD', 'ECD', 'ICD', 'CCD', 'TCD', 'DCD', 'FCD']
const accountProfile = reactive({ name: '', country: '', department: '', departments: [] as string[] })
const accountDisplayName = computed(() => String(accountProfile.name || adminStore.admin?.displayName || adminStore.admin?.name || adminStore.admin?.fullName || adminStore.admin?.staffName || adminStore.admin?.username || String(adminStore.admin?.email || 'Admin').split('@')[0]).trim())
const accountInitials = computed(() => { const tokens = accountDisplayName.value.split(/\s+/).filter(Boolean); if (!tokens.length) return '?'; if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase(); return (tokens[0][0] + tokens[1][0]).toUpperCase() })
const accountCountryCode = computed(() => String(accountProfile.country || state.country || assignedCountry.value || 'VN').slice(0, 2).toUpperCase())
const accountCode = computed(() => { const first = accountDisplayName.value.split(/\s+/).filter(Boolean)[0] || ''; return (accountCountryCode.value + first).toUpperCase() })
const accountDepartment = computed(() => String(accountProfile.department || adminStore.admin?.department || adminStore.admin?.role || 'GSD').toUpperCase())
const accountDepartments = computed(() => { const list = (accountProfile.departments?.length ? accountProfile.departments : [accountDepartment.value]).filter((dept) => ACCOUNT_DEPTS.includes(dept)); return list.length ? list : ['GSD'] })
const accountOpen = ref(false)
const accountPillEl = ref<HTMLButtonElement | null>(null)
const accountMenuStyle = ref<Record<string, string>>({})
const positionAccountMenu = () => {
  const rect = accountPillEl.value?.getBoundingClientRect()
  if (!rect) return
  accountMenuStyle.value = {
    left: `${Math.max(8, rect.left)}px`,
    bottom: `${window.innerHeight - rect.top + 8}px`,
    width: `${Math.max(rect.width, 250)}px`,
  }
}
watch(accountOpen, async (open) => {
  if (!open) return
  await nextTick()
  positionAccountMenu()
})
watch([sidebarWidth, accountDepartments], () => {
  if (accountOpen.value) void nextTick(positionAccountMenu)
})
const accountSettings = reactive({ open: false, name: '', country: '', department: '', departments: [] as string[], deptOpen: false })
const accountSettingsId = computed(() => { const first = (accountSettings.name || '').trim().split(/\s+/).filter(Boolean)[0] || ''; return (String(accountSettings.country || '').toUpperCase() + first.toUpperCase()) })
const availableAccountDepts = computed(() => ACCOUNT_DEPTS.filter((dept) => !accountSettings.departments.includes(dept)))
const accountProfileKey = 'shoptrans_account_profile_v1'
const currencies = computed(() => settings.value.currencies || [{ code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, base: true }])
const currentCountry = computed(() => countries.value.find((country: any) => country.id === state.country) || countries.value[0])
const currentPage = computed(() => pages.value[state.page] || defaultPages[state.page] || { kind: 'fee', title: 'Data', group: 'master', desc: '' })
const isSheetGridPage = computed(() => ['sales-marketing', 'traders-suppliers', 'reference-data', 'customs-legal', 'internal-directory', 'analysis-statistics'].includes(currentPage.value.kind))
const salesPageIds = new Set(['ports', 'cfs', 'admin', 'o_customs', 'o_inspect', 'o_truck', 'o_demur', 'o_lift', 'o_infra', 'ocean', 'surcharge', 'lc_origin', 'lc_dest', 'd_handling', 'd_customs', 'd_inspect', 'd_truck', 'd_demur', 'd_lift', 'd_infra'])
const hideLegacyCrumbDesc = computed(() => currentPage.value.kind === 'master-fx' || salesPageIds.has(state.page))
const mockSidebarKinds = ['workbook', 'checklist', 'regulations', 'master-fx', 'operations-home', 'blank-home', 'sales-marketing', 'traders-suppliers', 'reference-data', 'customs-legal', 'internal-directory', 'quality-control', 'analysis-statistics', 'workspace', 'fee', 'trucking', 'ocean', 'localcharge', 'flat', 'master-ports', 'master-cfs', 'master-admin']
const isWorkbookCanvasPage = computed(() => ['workbook', 'checklist', 'regulations', 'master-fx', 'operations-home', 'blank-home', 'workspace', 'quality-control'].includes(currentPage.value.kind))
const isWorkspacePage = computed(() => mockSidebarKinds.includes(currentPage.value.kind))
const workspaceNav = [
  { id: 'operations', label: 'Operations', icon: 'opsSpark', targetPage: 'wb_efa_fcl', items: [] },
  { id: 'workspace', label: 'Workspace', icon: 'briefcase', targetPage: 'workspace', items: [] },
  { id: 'traders', label: 'Traders & Suppliers', icon: 'users', targetPage: 'traders_suppliers', items: [] },
  { id: 'refdata', label: 'Reference Data', icon: 'book', targetPage: 'reference_data', items: [] },
  { id: 'legal', label: 'Customs & Legal', icon: 'scale', targetPage: 'customs_legal', items: [] },
  { id: 'internal', label: 'Internal Directory', icon: 'building', targetPage: 'internal_directory', items: [] },
  { id: 'analysis', label: 'Analysis & Statistics', icon: 'chart', targetPage: 'analysis_statistics', items: [] },
  { id: 'salesmkt', label: 'Sales & Marketing', icon: 'plane', targetPage: 'sales_marketing', items: [] },
  { id: 'quality', label: 'Quality Control', icon: 'shield', targetPage: 'quality_control', items: [] },
]
const sidebarNav = computed(() => isWorkspacePage.value ? workspaceNav : nav.value)
const groupIsActive = (group: any) => {
  if (!isWorkspacePage.value) return false
  if (group.id === 'operations') return currentPage.value.group === 'operations'
  if (group.id === 'legal') return state.page === 'customs_legal' || currentPage.value.group === 'customs_legal'
  if (group.id === 'salesmkt') return state.page === 'sales_marketing'
  if (group.id === 'refdata') return state.page === 'reference_data'
  if (group.id === 'traders') return state.page === 'traders_suppliers'
  if (group.id === 'internal') return state.page === 'internal_directory'
  if (group.id === 'quality') return state.page === 'quality_control'
  if (group.id === 'analysis') return state.page === 'analysis_statistics'
  if (group.id === 'workspace') return state.page === 'workspace'
  return false
}
const recordCountry = computed(() => currentPage.value.global ? 'GLOBAL' : state.country)
const recordPage = computed(() => isSheetGridPage.value ? activeSalesPageId.value : state.page)
const scopeCountry = computed(() => currentPage.value.global ? { id: 'GLOBAL', name: 'Global', flag: 'vn', cur: 'USD' } : currentCountry.value)
const showModeFilter = computed(() => ['fee', 'trucking', 'ocean'].includes(currentPage.value.kind) && currentPage.value.lclUnit !== null)
const showMacmapImport = computed(() => currentPage.value.kind === 'page-fcl' && state.fclTab === 'cargo')
const showPostalImport = computed(() => currentPage.value.kind === 'master-admin')
const showSeaportImport = computed(() => currentPage.value.kind === 'master-ports')
const showCfsImport = computed(() => currentPage.value.kind === 'master-cfs')
const hsFilteredItems = computed(() => {
  const query = hsImportModal.search.toLowerCase()
  return hsImportModal.items.filter((item) => !query || `${item.hscode} ${item.description}`.toLowerCase().includes(query))
})
const hsNewCount = computed(() => hsImportModal.items.filter((item) => !item.exists).length)
const hsSelectedCount = computed(() => hsImportModal.selected.size)
const hsAllVisibleSelected = computed(() => {
  const visible = hsFilteredItems.value.filter((item) => !item.exists)
  return visible.length > 0 && visible.every((item) => hsImportModal.selected.has(item.hscode))
})
const postalFilteredItems = computed(() => {
  const query = postalImportModal.search.toLowerCase()
  return postalImportModal.items.filter((item) => !query || JSON.stringify(item).toLowerCase().includes(query))
})
const postalNewCount = computed(() => postalImportModal.items.filter((item) => !item.exists).length)
const postalSelectedCount = computed(() => postalImportModal.selected.size)
const postalAllVisibleSelected = computed(() => {
  const visible = postalFilteredItems.value.filter((item) => !item.exists)
  return visible.length > 0 && visible.every((item) => postalImportModal.selected.has(item.id))
})
const seaportFilteredItems = computed(() => {
  const query = seaportImportModal.search.toLowerCase()
  return seaportImportModal.items.filter((item) => !query || `${item.code} ${item.name} ${item.city} ${item.subdivision || ''}`.toLowerCase().includes(query))
})
const seaportNewCount = computed(() => seaportImportModal.items.filter((item) => !item.exists).length)
const seaportSelectedCount = computed(() => seaportImportModal.selected.size)
const seaportAllVisibleSelected = computed(() => {
  const visible = seaportFilteredItems.value.filter((item) => !item.exists)
  return visible.length > 0 && visible.every((item) => seaportImportModal.selected.has(item.id))
})
const cfsFilteredItems = computed(() => {
  const query = cfsImportModal.search.toLowerCase()
  return cfsImportModal.items.filter((item) => !query || `${item.code} ${item.name} ${item.addr || ''} ${item.port || ''} ${item.type || ''}`.toLowerCase().includes(query))
})
const cfsNewCount = computed(() => cfsImportModal.items.filter((item) => !item.exists).length)
const cfsSelectedCount = computed(() => cfsImportModal.selected.size)
const cfsAllVisibleSelected = computed(() => {
  const visible = cfsFilteredItems.value.filter((item) => !item.exists)
  return visible.length > 0 && visible.every((item) => cfsImportModal.selected.has(item.id))
})
const fxFilteredItems = computed(() => {
  const query = fxImportModal.search.toLowerCase()
  return fxImportModal.items.filter((item) => !query || `${item.code} ${item.name}`.toLowerCase().includes(query))
})
const fxChangedCount = computed(() => fxImportModal.items.filter((item) => item.changed).length)
const fxSelectedCount = computed(() => fxImportModal.selected.size)
const fxAllVisibleSelected = computed(() => {
  const visible = fxFilteredItems.value.filter((item) => item.changed)
  return visible.length > 0 && visible.every((item) => fxImportModal.selected.has(item.id))
})
const groupLabel = (groupId: string) => {
  for (const group of nav.value) {
    if (group.id === groupId) return group.label
    const section = group.sections?.find((item: any) => item.id === groupId)
    if (section) return `${group.label} / ${section.label}`
  }
  return 'Data'
}
const cleanTitle = (title: string) => String(title || '').split(' - ')[0].trim()
const opsSectionCode = (label: string) => String(label || '').split('·')[0].trim()
const opsSectionSuffix = (label: string) => {
  const parts = String(label || '').split('·')
  return parts.length > 1 ? parts.slice(1).join('·').trim() : ''
}
const sameOpsMode = (a?: string, b?: string) => {
  const pa = parseOpsKey(a || '')
  const pb = parseOpsKey(b || '')
  return Boolean(pa && pb && pa.base === pb.base && pa.mode === pb.mode)
}
const isNavItemActive = (item: any) => {
  if (state.view !== 'data') return false
  if (state.page === item.id) return true
  const itemPage = pages.value[item.id] || defaultPages[item.id]
  return sameOpsMode(currentPage.value.sheetKey, itemPage?.sheetKey)
}
const sectionIsActive = (section: any) => Boolean(section?.items?.some((item: any) => isNavItemActive(item)))
const sectionIsOpen = (section: any) => !state.collapsedSections.includes(section.id)
const flagUrl = (flag: string) => `https://flagcdn.com/w40/${flag || 'vn'}.png`
const dataOf = (record: AdminRecord) => record.data || {}
const currencySymbol = (code: string) => {
  const item: any = currencies.value.find((currency: any) => currency.code === code)
  return item?.symbol || item?.sym || (code ? `${code} ` : '')
}

const groupIsOpen = (group: any) => !state.collapsedGroups.includes(group.id)
const selectGroup = (group: any) => {
  if (state.editMenu) return
  if (isWorkspacePage.value && group?.targetPage) {
    if (group.sections?.length) {
      state.collapsedGroups = state.collapsedGroups.filter((id) => id !== group.id)
    }
    if (group.id === 'operations') {
      state.view = 'data'
      state.page = 'wb_efa_fcl'
      state.search = ''
      state.modeFilter = 'ALL'
      records.value = []
      return
    }
    setPage(group.targetPage)
    return
  }
  if (group?.id === 'operations') {
    state.view = 'data'
    state.page = 'wb_efa_fcl'
    state.search = ''
    state.modeFilter = 'ALL'
    records.value = []
  }
  if (state.collapsedGroups.includes(group.id)) {
    state.collapsedGroups = state.collapsedGroups.filter((id) => id !== group.id)
  } else {
    state.collapsedGroups.push(group.id)
  }
  try {
    localStorage.setItem('ST_COLLAPSED_GROUPS', JSON.stringify(state.collapsedGroups))
  } catch (e) {}
}
const selectSection = (group: any, section: any) => {
  if (group?.id === 'operations') {
    state.view = 'data'
    state.page = 'wb_efa_fcl'
    state.search = ''
    state.modeFilter = 'ALL'
    records.value = []
    if (state.collapsedSections.includes(section.id)) {
      state.collapsedSections = state.collapsedSections.filter((id) => id !== section.id)
    } else {
      state.collapsedSections.push(section.id)
    }
    try {
      localStorage.removeItem('ST_COLLAPSED_SECTIONS')
    } catch (e) {}
    return
  }
  if (group?.id === 'sales') {
    if (state.collapsedSections.includes(section.id)) {
      state.collapsedSections = state.collapsedSections.filter((id) => id !== section.id)
    } else {
      state.collapsedSections.push(section.id)
    }
    return
  }
  const first = section.items?.[0]?.id
  if (first) setPage(first)
}

const rateValue = (record: AdminRecord, key = '20GP') => {
  const data = dataOf(record)
  if (data.r && data.r[key] != null) return data.r[key]
  if (key === '20GP') return data.rate20 ?? data.value
  if (key === '40GP') return data.rate40
  return data[key]
}

const recordMode = (record: AdminRecord) => String(dataOf(record).mode || 'FLAT').toUpperCase()
const modeClass = (mode: string) => mode === 'FCL' ? 'tag-fcl' : mode === 'LCL' ? 'tag-lcl' : 'tag-flat'
const fclSectionLabel = (section: string) => ({
  locations: 'Location details',
  cargo: 'What do you want to ship?',
  'cargo-options': 'Cargo options',
  shipping: 'How will your cargo be shipped?',
  'shipping-options': 'Shipping options',
  services: 'Please choose services range',
} as Record<string, string>)[section] || section
const fclTabs = computed(() => [
  { id: 'locations', step: '1', title: 'Location details', section: 'locations' },
  { id: 'cargo', step: '2', title: 'What do you want to ship?', section: 'cargo' },
  { id: 'shipping', step: '3', title: 'How will your cargo be shipped?', section: 'shipping' },
  { id: 'services', step: '5', title: 'Please choose services range', section: 'services' },
])
const traderDefaultTabs = [
  { id: 'traders', label: 'Traders', roleOpts: ['CLIENT', 'SHIPPER', 'CNEE'], dep: true },
  { id: 'ocean_carriers', label: 'Ocean Carriers', roleOpts: ['OCEAN CARRIER'], dep: false },
  { id: 'ocean_agent', label: 'Ocean Agents', roleOpts: ['OCEAN AGENT'], dep: false },
  { id: 'airlines', label: 'Airlines', roleOpts: ['AIRLINE'], dep: false },
  { id: 'air_agent', label: 'Air Agents', roleOpts: ['AIR AGENT'], dep: false },
  { id: 'customs_broker', label: 'Customs Brokers', roleOpts: ['CUSTOMS BROKER'], dep: false },
  { id: 'hauliers', label: 'Hauliers', roleOpts: ['HAULIER'], dep: false, drivers: true },
  { id: 'dest_agent', label: 'Agents', roleOpts: ['DEST. AGENT'], dep: false },
]
const customTraderTabs = ref<any[]>([])
const traderTabs = computed(() => [...traderDefaultTabs, ...customTraderTabs.value])
const activeTraderTab = computed(() => traderTabs.value.find((tab) => tab.id === state.traderTab) || traderTabs.value[0])
const referenceDefaultTabs = [
  { id: 'vessels', label: 'Vessels', columns: [salesField('vname', 'Vessel Name', 220), salesField('imo', 'IMO No#', 140)] },
  { id: 'charges', label: 'Charges', columns: [salesField('cname', 'Charge Name', 220), salesField('ccode', 'Code', 140)] },
  { id: 'currencies', label: 'Currencies', columns: [salesField('curcode', 'Code', 110), salesField('curname', 'Name', 200), salesField('symbol', 'Symbol', 110)] },
  { id: 'routes', label: 'Routes', columns: [
    salesField('pol', 'POL', 170),
    salesField('polCountry', 'COUNTRY/AREA', 170, { kind: 'list' }),
    salesField('polCode', 'CODE', 120),
    salesField('pod', 'POD', 170),
    salesField('podCountry', 'COUNTRY/AREA', 170, { kind: 'list' }),
    salesField('podCode', 'CODE', 120),
  ] },
  { id: 'units', label: 'Units', columns: [salesField('ucode', 'Unit Code', 130), salesField('udesc', 'Description', 220)] },
  { id: 'servicetypes', label: 'Service Types', columns: [salesField('sname', 'Service Name', 200), salesField('scode', 'Code', 130)] },
  { id: 'ports', label: 'Ports', columns: [salesField('portcode', 'Port Code', 130), salesField('portname', 'Port Name', 220), salesField('country', 'Country', 160, { kind: 'list' })] },
  {
    id: 'warehouses',
    label: 'Warehouses',
    columns: [
      salesField('portcode', 'PortCode', 130),
      salesField('whname', 'WHName', 220),
      salesField('city', 'City', 160, { kind: 'list' }),
      salesField('country', 'Country', 150, { kind: 'list' }),
      salesField('whtype', 'Type', 130, { kind: 'select', opts: ['CFS', 'Bonded', 'General', 'CY', 'Cold'] }),
    ],
  },
  { id: 'airports', label: 'Airports', columns: [salesField('iata', 'Airport Code (IATA)', 150), salesField('airportname', 'Airport Name', 220), salesField('country', 'Country', 160, { kind: 'list' })] },
  { id: 'countries', label: 'Countries', columns: [salesField('countryname', 'Country Name', 240), salesField('iso2', 'Code (ISO2)', 120), salesField('postalTree', 'Postal Codes', 150, { kind: 'postal-tree', optional: true })] },
  {
    id: 'ex_rate',
    label: 'Ex. Rate',
    columns: [
      salesField('rdate', 'Date', 130, { kind: 'date' }),
      salesField('usd', 'USD', 100, { optional: true }),
      salesField('cny', 'CNY', 100, { optional: true }),
      salesField('jpy', 'JPY', 100, { optional: true }),
      salesField('eur', 'EUR', 100, { optional: true }),
      salesField('inr', 'INR', 100, { optional: true }),
      salesField('idr', 'IDR', 100, { optional: true }),
      salesField('hkd', 'HKD', 100, { optional: true }),
      salesField('bdt', 'BDT', 100, { optional: true }),
      salesField('myr', 'MYR', 100, { optional: true }),
      salesField('thb', 'THB', 100, { optional: true }),
      salesField('krw', 'KRW', 100, { optional: true }),
      salesField('vnd', 'VND', 100, { optional: true }),
    ],
  },
]
const customReferenceTabs = ref<any[]>([])
const referenceTabs = computed(() => [...referenceDefaultTabs, ...customReferenceTabs.value])
const activeReferenceTab = computed(() => referenceTabs.value.find((tab) => tab.id === state.refTab) || referenceTabs.value[0])
const isReferenceExRate = computed(() => currentPage.value.kind === 'reference-data' && activeReferenceTab.value.id === 'ex_rate')
const isReferenceWarehouses = computed(() => currentPage.value.kind === 'reference-data' && activeReferenceTab.value.id === 'warehouses')
const isReferenceCountries = computed(() => currentPage.value.kind === 'reference-data' && activeReferenceTab.value.id === 'countries')
const postalIsoOf = (record: AdminRecord | Record<string, any>) => String(dataOf(record as AdminRecord)?.iso2 || (record as any)?.iso2 || '').trim().toUpperCase()
const postalCountForIso = (iso: any) => (postalRecordsByCountry[String(iso || '').trim().toUpperCase()] || []).length
const postalCountForCountry = (record: AdminRecord) => postalCountForIso(postalIsoOf(record))
const postalCountryIsOpen = (record: AdminRecord) => postalDirectory.countryRecordId === record.id
const postalNodeExpanded = (key: string) => postalDirectory.expanded.has(key)
const resetPostalForm = () => {
  postalDirectory.editId = ''
  postalDirectory.error = ''
  Object.assign(postalDirectory.form, { prov: '', dist: '', ward: '', zip: '', status: 'Active' })
}
const loadPostalCountryRecords = async (iso: string, force = false) => {
  const code = String(iso || '').trim().toUpperCase()
  if (!code || (!force && postalRecordsByCountry[code])) return postalRecordsByCountry[code] || []
  const result = await apiFetch(`/records?country=${encodeURIComponent(code)}&page=admin&limit=1000`)
  postalRecordsByCountry[code] = Array.isArray(result?.items) ? result.items : []
  return postalRecordsByCountry[code]
}
const loadPostalCountryCounts = async () => {
  if (!isReferenceCountries.value) return
  const codes = records.value.map((record) => postalIsoOf(record)).filter(Boolean)
  await Promise.all(codes.map((code) => loadPostalCountryRecords(code, true).catch(() => [])))
}
const togglePostalCountry = async (record: AdminRecord) => {
  if (postalCountryIsOpen(record)) {
    postalDirectory.countryIso = ''
    postalDirectory.countryRecordId = ''
    resetPostalForm()
    return
  }
  postalDirectory.countryIso = postalIsoOf(record)
  postalDirectory.countryRecordId = record.id
  postalDirectory.loading = true
  resetPostalForm()
  try {
    await loadPostalCountryRecords(postalDirectory.countryIso, true)
    postalDirectory.expanded.clear()
    postalTreeAllNodes.value.filter((node) => node.kind !== 'postal').forEach((node) => postalDirectory.expanded.add(node.key))
  } catch (error: any) {
    postalDirectory.error = error?.data?.message || error?.message || 'Could not load postal codes.'
  } finally {
    postalDirectory.loading = false
  }
}
const postalTreeAllNodes = computed<PostalTreeNode[]>(() => {
  const source = postalRecordsByCountry[postalDirectory.countryIso] || []
  const nodes: PostalTreeNode[] = []
  const provinces = new Map<string, AdminRecord[]>()
  source.forEach((record) => {
    const name = String(dataOf(record).prov || 'Unassigned').trim()
    if (!provinces.has(name)) provinces.set(name, [])
    provinces.get(name)!.push(record)
  })
  Array.from(provinces.entries()).sort(([a], [b]) => a.localeCompare(b)).forEach(([prov, provRows]) => {
    const provKey = `p:${prov}`
    nodes.push({ key: provKey, label: prov, kind: 'province', depth: 0 })
    const districts = new Map<string, AdminRecord[]>()
    provRows.forEach((record) => {
      const name = String(dataOf(record).dist || 'Other areas').trim()
      if (!districts.has(name)) districts.set(name, [])
      districts.get(name)!.push(record)
    })
    Array.from(districts.entries()).sort(([a], [b]) => a.localeCompare(b)).forEach(([dist, distRows]) => {
      const distKey = `${provKey}|d:${dist}`
      nodes.push({ key: distKey, label: dist, kind: 'district', depth: 1 })
      const wards = new Map<string, AdminRecord[]>()
      distRows.forEach((record) => {
        const name = String(dataOf(record).ward || dataOf(record).placeName || 'Postal area').trim()
        if (!wards.has(name)) wards.set(name, [])
        wards.get(name)!.push(record)
      })
      Array.from(wards.entries()).sort(([a], [b]) => a.localeCompare(b)).forEach(([ward, wardRows]) => {
        const wardKey = `${distKey}|w:${ward}`
        nodes.push({ key: wardKey, label: ward, kind: 'ward', depth: 2 })
        wardRows.sort((a, b) => String(dataOf(a).zip || '').localeCompare(String(dataOf(b).zip || ''))).forEach((record) => {
          const data = dataOf(record)
          nodes.push({ key: `${wardKey}|z:${record.id}`, label: String(data.zip || 'No postal code'), kind: 'postal', depth: 3, zip: String(data.zip || ''), status: String(data.status || 'Active'), recordId: record.id, record })
        })
      })
    })
  })
  return nodes
})
const postalVisibleNodes = computed(() => {
  const visible: PostalTreeNode[] = []
  let provinceVisible = true
  let districtVisible = true
  let wardVisible = true
  for (const node of postalTreeAllNodes.value) {
    if (node.kind === 'province') {
      provinceVisible = true
      districtVisible = postalNodeExpanded(node.key)
      wardVisible = false
      visible.push(node)
    } else if (node.kind === 'district') {
      if (!districtVisible) continue
      wardVisible = postalNodeExpanded(node.key)
      visible.push(node)
    } else if (node.kind === 'ward') {
      if (!districtVisible || !wardVisible) continue
      visible.push(node)
    } else {
      const wardKey = node.key.split('|z:')[0]
      if (districtVisible && wardVisible && postalNodeExpanded(wardKey)) visible.push(node)
    }
  }
  return visible
})
const selectPostalNode = (node: PostalTreeNode) => {
  if (node.kind === 'postal') { editPostalNode(node); return }
  if (postalDirectory.expanded.has(node.key)) postalDirectory.expanded.delete(node.key)
  else postalDirectory.expanded.add(node.key)
}
const editPostalNode = (node: PostalTreeNode) => {
  if (!node.record) return
  const data = dataOf(node.record)
  postalDirectory.editId = node.record.id
  postalDirectory.error = ''
  Object.assign(postalDirectory.form, { prov: data.prov || '', dist: data.dist || '', ward: data.ward || data.placeName || '', zip: data.zip || '', status: data.status || 'Active' })
}
const startPostalAdd = (record: AdminRecord) => {
  if (!postalCountryIsOpen(record)) return
  resetPostalForm()
}
const savePostalForm = async () => {
  const form = postalDirectory.form
  if (!String(form.prov || '').trim() || !String(form.zip || '').trim()) {
    postalDirectory.error = 'Province / State and Zip Code are required.'
    return
  }
  const duplicate = (postalRecordsByCountry[postalDirectory.countryIso] || []).some((record) => record.id !== postalDirectory.editId && String(dataOf(record).zip || '').trim().toUpperCase() === String(form.zip).trim().toUpperCase() && String(dataOf(record).ward || '').trim().toUpperCase() === String(form.ward || '').trim().toUpperCase())
  if (duplicate) { postalDirectory.error = 'This postal code already exists for the selected location.'; return }
  postalDirectory.saving = true
  postalDirectory.error = ''
  const data = { prov: form.prov.trim().toUpperCase(), dist: form.dist.trim().toUpperCase(), ward: form.ward.trim().toUpperCase(), placeName: form.ward.trim().toUpperCase(), zip: form.zip.trim().toUpperCase(), status: form.status || 'Active', source: 'Manual' }
  try {
    if (postalDirectory.editId) {
      const current = (postalRecordsByCountry[postalDirectory.countryIso] || []).find((record) => record.id === postalDirectory.editId)
      if (!current) throw new Error('Postal record no longer exists.')
      await apiFetch(`/records/${current.id}`, { method: 'PATCH', body: { country: current.country, page: current.page, kind: current.kind, data: { ...dataOf(current), ...data }, sortOrder: current.sortOrder || 0 } })
    } else {
      await apiFetch('/records', { method: 'POST', body: { country: postalDirectory.countryIso, page: 'admin', kind: 'master-admin', data, sortOrder: postalCountForIso(postalDirectory.countryIso) + 1 } })
    }
    await loadPostalCountryRecords(postalDirectory.countryIso, true)
    resetPostalForm()
  } catch (error: any) {
    postalDirectory.error = error?.data?.message || error?.message || 'Could not save postal location.'
  } finally {
    postalDirectory.saving = false
  }
}
const removePostalRecord = async () => {
  const record = (postalRecordsByCountry[postalDirectory.countryIso] || []).find((item) => item.id === postalDirectory.editId)
  if (!record || !(await confirmAdmin(`Remove postal code "${dataOf(record).zip}"?`, 'Remove postal code', 'Confirm', 'danger'))) return
  postalDirectory.saving = true
  try {
    await apiFetch(`/records/${record.id}`, { method: 'DELETE' })
    await loadPostalCountryRecords(postalDirectory.countryIso, true)
    resetPostalForm()
  } finally {
    postalDirectory.saving = false
  }
}
const openPostalImportForCountry = async (record: AdminRecord) => {
  postalImportModal.open = true
  postalImportModal.search = ''
  postalImportModal.error = ''
  postalImportModal.country = postalIsoOf(record)
  await loadPostalPreview()
}
const exRateLiveUrl = 'https://www.vietcombank.com.vn/en-us/Personal/Foreign-Exchange-Rate'
const exRateToday = computed(() => {
  const date = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`
})
const referenceColumns = computed(() => [
  ...activeReferenceTab.value.columns,
  ...salesStatusNotesFields(),
])
const legalDefaultTabs = [
  {
    id: 'docs_checklist',
    label: 'Docs Checklist',
    custom: false,
    columns: [
      salesField('docname', 'Document Name', 220),
      salesField('requiredfor', 'Required For', 200),
      salesField('mandatory', 'Mandatory', 110, { kind: 'select', opts: ['Yes', 'No'] }),
    ],
  },
  {
    id: 'regulatory_updates',
    label: 'Regulatory Updates',
    custom: false,
    columns: [
      salesField('field', 'Field', 140),
      salesField('authority', 'Issuing Authority', 180),
      salesField('doctype', 'Document Type', 160),
      salesField('docno', 'Document No.', 150),
      salesField('title', 'Title', 220),
      salesField('link', 'Link (URL)', 220, { kind: 'url' }),
      salesField('effdate', 'Effective Date', 150, { kind: 'date' }),
    ],
  },
]
const customLegalTabs = ref<any[]>([])
const legalTabs = computed(() => [...legalDefaultTabs, ...customLegalTabs.value])
const activeLegalTab = computed(() => legalTabs.value.find((tab) => tab.id === state.legalTab) || legalTabs.value[0])
const legalColumns = computed(() => [
  ...activeLegalTab.value.columns,
  ...salesStatusNotesFields(),
])
const makeCustomLegalTab = (label: string, id = '') => {
  const safe = String(label || '').trim()
  const slug = safe.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'tab'
  return {
    id: id || `${slug}_${Date.now().toString(36)}`,
    label: safe,
    custom: true,
    columns: [
      salesField('rdate', 'Date', 130, { kind: 'date' }),
      salesField('content', 'Content', 260),
    ],
  }
}
const legalTabsConfigPage = 'legal_tabs_config'
const legalTabsConfigKind = 'customs-legal-tabs'
const legalTabsConfigId = ref('')
const serializeLegalTabs = () => customLegalTabs.value.map((tab: any) => ({ id: tab.id, label: tab.label, custom: true }))
const loadLegalTabsConfig = async () => {
  try {
    const result = await apiFetch(`/records?country=GLOBAL&page=${encodeURIComponent(legalTabsConfigPage)}&limit=1`)
    const record = Array.isArray(result.items) ? result.items[0] : null
    legalTabsConfigId.value = record?.id || ''
    const tabs = Array.isArray(record?.data?.tabs) ? record.data.tabs : []
    customLegalTabs.value = tabs
      .filter((tab: any) => tab?.custom && String(tab.label || '').trim())
      .map((tab: any) => makeCustomLegalTab(tab.label, tab.id))
    if (!legalTabs.value.some((tab: any) => tab.id === state.legalTab)) state.legalTab = legalTabs.value[0].id
  } catch (error) {
    console.error('Could not load customs legal tabs config', error)
  }
}
const saveLegalTabsConfig = async () => {
  const body = {
    country: 'GLOBAL',
    page: legalTabsConfigPage,
    kind: legalTabsConfigKind,
    data: { type: legalTabsConfigKind, tabs: serializeLegalTabs(), status: 'Active' },
    sortOrder: 1,
  }
  const result = legalTabsConfigId.value
    ? await apiFetch(`/records/${legalTabsConfigId.value}`, { method: 'PATCH', body })
    : await apiFetch('/records', { method: 'POST', body })
  legalTabsConfigId.value = result?.id || legalTabsConfigId.value
}
const addLegalTab = async () => {
  const label = (await promptAdmin('Add new tab', 'Tab name', '', 'Enter a name for the new list.'))?.trim()
  if (!label) return
  if (legalTabs.value.some((tab: any) => String(tab.label).toLowerCase() === label.toLowerCase())) {
    await notifyAdmin('A tab with this name already exists.')
    return
  }
  const tab = makeCustomLegalTab(label)
  customLegalTabs.value.push(tab)
  await saveLegalTabsConfig()
  await setLegalTab(tab.id)
}
const removeLegalTab = async (tab: any) => {
  if (!tab?.custom) {
    await notifyAdmin('Default tabs cannot be removed.')
    return
  }
  if (!(await confirmRemoveTab(tab.label))) return
  const oldId = tab.id
  customLegalTabs.value = customLegalTabs.value.filter((item: any) => item.id !== oldId)
  await saveLegalTabsConfig()
  const rows = await apiFetch(`/records?country=${encodeURIComponent(recordCountry.value)}&page=${encodeURIComponent(`legal_${oldId}`)}&limit=1000`)
  for (const record of Array.isArray(rows.items) ? rows.items : []) {
    await apiFetch(`/records/${record.id}`, { method: 'DELETE' })
  }
  if (state.legalTab === oldId) state.legalTab = legalTabs.value[0].id
  resetSalesViewState()
  await loadRecords()
}
const sheetGridHeaderTitle = computed(() => {
  if (currentPage.value.kind === 'traders-suppliers') return activeTraderTab.value.label
  if (currentPage.value.kind === 'reference-data') return activeReferenceTab.value.label
  if (currentPage.value.kind === 'customs-legal') return activeLegalTab.value.label
  if (currentPage.value.kind === 'internal-directory') return activeInternalTab.value.label
  if (currentPage.value.kind === 'quality-control') return activeQualityTab.value.label
  return currentPage.value.title
})
const sheetGridHeaderDesc = computed(() => {
  if (currentPage.value.kind === 'traders-suppliers') {
    const label = String(activeTraderTab.value.label || '').toLowerCase()
    return `Manage your ${label} directory — add, remove and search records.`
  }
  if (currentPage.value.kind === 'reference-data') {
    const label = String(activeReferenceTab.value.label || '').toLowerCase()
    return `Manage your ${label} directory — add, remove and search records.`
  }
  if (currentPage.value.kind === 'customs-legal') {
    const label = String(activeLegalTab.value.label || '').toLowerCase()
    return `Manage your ${label} directory — add, remove and search records.`
  }
  if (currentPage.value.kind === 'internal-directory') {
    const label = String(activeInternalTab.value.label || '').toLowerCase()
    return `Manage your ${label} directory — add, remove and search records.`
  }
  if (currentPage.value.kind === 'quality-control') {
    return state.qcTab === 'history'
      ? 'Review quality-control activity and incident history.'
      : 'Record incidents, root causes, solutions and completion status.'
  }
  return currentPage.value.desc || ''
})
const internalDefaultTabs = [
  {
    id: 'staff',
    label: 'Staff',
    columns: [
      salesField('recdate', 'Date', 130, { kind: 'date' }),
      salesField('staffid', 'StaffID', 120, { kind: 'computed', readonly: true, optional: true }),
      salesField('country', 'Country', 150, { kind: 'list' }),
      salesField('fullname', 'Full Name', 180),
      salesField('nickname', 'Nick Name', 120, { optional: true }),
      salesField('gender', 'Gender', 100, { kind: 'select', opts: ['Male', 'Female', 'Other'] }),
      salesField('dob', 'Date of Birth', 140, { kind: 'date' }),
      salesField('joined', 'Joined Date', 140, { kind: 'date' }),
      salesField('workingtime', 'Working Time', 140, { kind: 'computed', optional: true }),
      salesField('resigned', 'Resigned Date', 140, { kind: 'date', optional: true }),
      salesField('jobtype', 'Type of Job', 150, { kind: 'select', opts: ['Full-Time', 'Part-Time', 'Internship'] }),
      salesField('department', 'Department', 150, { kind: 'select', opts: ['GSD', 'ECD', 'ICD', 'CCD', 'TCD', 'DCD', 'FCD'] }),
      salesField('coverage', 'Coverage', 220, { kind: 'coverage', optional: true }),
    ],
  },
  {
    id: 'mbl_cnee',
    label: 'MBL Cnee',
    columns: [
      salesField('recdate', 'Date', 130, { kind: 'date' }),
      salesField('country', 'Country', 160, { kind: 'list' }),
      salesField('city', 'City / Province', 160, { kind: 'list' }),
      salesField('details', 'Details', 240),
    ],
  },
  {
    id: 'edo',
    label: 'eDO',
    columns: [
      salesField('recdate', 'Date', 130, { kind: 'date' }),
      salesField('company', 'Company Name', 190),
      salesField('code', 'Company Code', 150),
      salesField('edomail', 'eDO mail', 220, { kind: 'email', placeholder: 'A@X.COM, B@Y.COM' }),
    ],
  },
  {
    id: 'banks',
    label: 'Banks',
    columns: [
      salesField('bankname', 'Bank Name', 180),
      salesField('accname', 'Account Name', 180),
      salesField('accnumber', 'Account Number', 160),
      salesField('currency', 'Currency', 100, { kind: 'select', opts: ['USD', 'VND', 'EUR', 'INR', 'IDR', 'THB', 'TWD', 'JPY', 'CNY', 'MXN', 'KRW'] }),
      salesField('branch', 'Branch', 160),
      salesField('country', 'Country', 150, { kind: 'list' }),
      salesField('swift', 'Swift/BIC Code', 140),
      salesField('bankaddress', 'Bank Address', 220, { optional: true }),
    ],
  },
  { id: 'haulage', label: 'Haulage Rates', columns: [] },
]
const haulageModes = [
  { id: 'fcl', label: 'FCL' },
  { id: 'lclair', label: 'LCL/AIR' },
]
const haulageCommonColumns = () => [
  salesField('createdate', 'CreateDate', 150, { kind: 'computed', readonly: true, optional: true }),
  salesField('creator', 'Creator', 150, { kind: 'stafflist', optional: true }),
  salesField('country', 'Country', 140, { kind: 'list' }),
]
const haulageTailColumns = () => [
  salesField('distance', 'Distance (KM)', 135, { kind: 'number', optional: true }),
  salesField('transittime', 'TransitTime (H)', 135, { kind: 'number', optional: true }),
  salesField('haulier', 'Haulier', 160, { kind: 'haulier', optional: true }),
  salesField('notes', 'Notes', 240, { kind: 'textarea', optional: true }),
  salesField('status', 'Status', 112, { kind: 'select', opts: ['Active', 'Inactive'], optional: true }),
]
const haulageFclColumns = [
  ...haulageCommonColumns(),
  salesField('fromport', 'FromPort', 170, { kind: 'deplist' }),
  salesField('toplace', 'ToPlace', 220, { kind: 'textarea', optional: true }),
  salesField('zipcode', 'ZipCode', 120),
  salesField('cur', 'CUR', 90, { kind: 'list', optional: true }),
  salesField('rate20', 'Rate20', 100, { kind: 'money2', optional: true }),
  salesField('rate40', 'Rate40', 100, { kind: 'money2', optional: true }),
  salesField('rate45', 'Rate45', 100, { kind: 'money2', optional: true }),
  salesField('type', 'Type', 90, { kind: 'select', opts: ['GP', 'FR', 'RF', 'OT'], optional: true }),
  ...haulageTailColumns(),
]
const haulageLclAirColumns = [
  ...haulageCommonColumns(),
  salesField('fromwh', 'FromWH', 170, { kind: 'deplist' }),
  salesField('toplace', 'ToPlace', 220, { kind: 'textarea', optional: true }),
  salesField('zipcode', 'ZipCode', 120),
  salesField('cur', 'CUR', 90, { kind: 'list', optional: true }),
  salesField('w_le1', '<=1T', 90, { kind: 'money2', optional: true }),
  salesField('w_1_3', '1-3T', 90, { kind: 'money2', optional: true }),
  salesField('w_3_5', '3-5T', 90, { kind: 'money2', optional: true }),
  salesField('w_5_10', '5-10T', 95, { kind: 'money2', optional: true }),
  salesField('w_10_15', '10-15T', 100, { kind: 'money2', optional: true }),
  salesField('w_15_25', '15-25T', 100, { kind: 'money2', optional: true }),
  ...haulageTailColumns(),
]
const customInternalTabs = ref<any[]>([])
const internalTabs = computed(() => [...internalDefaultTabs, ...customInternalTabs.value])
const activeInternalTab = computed(() => internalTabs.value.find((tab) => tab.id === state.internalTab) || internalTabs.value[0])
const isInternalHaulage = computed(() => currentPage.value.kind === 'internal-directory' && activeInternalTab.value.id === 'haulage')
const internalDirectoryDescription = computed(() => activeInternalTab.value.id === 'haulage'
  ? `Manage haulage rates (${state.haulageMode === 'fcl' ? 'FCL' : 'LCL/AIR'}) — add, remove and search records.`
  : `Manage your ${String(activeInternalTab.value.label || '').toLowerCase()} directory — add, remove and search records.`)
const internalColumns = computed(() => [
  ...(activeInternalTab.value.id === 'haulage'
    ? (state.haulageMode === 'fcl' ? haulageFclColumns : haulageLclAirColumns)
    : [...activeInternalTab.value.columns, ...salesStatusNotesFields()]),
])
const qualityTabs = [
  {
    id: 'incident',
    label: 'Incident Management',
    columns: [
      salesField('caseid', 'CaseID', 118, { kind: 'computed', readonly: true }),
      salesField('date', 'Date', 134, { kind: 'date' }),
      salesField('staff', 'Staff', 150, { kind: 'stafflist' }),
      salesField('ref', 'Ref#', 92),
      salesField('client', 'ClientCode', 104),
      salesField('shipper', 'ShipperCode', 112),
      salesField('cnee', 'CneeCode', 104),
      salesField('desc', 'Incident Description', 190),
      salesField('rootcause', 'Root Cause', 150),
      salesField('solution', 'Solution', 150),
      salesField('notes', 'Notes', 150, { optional: true }),
      salesField('resulted', 'Resulted', 118, { kind: 'checkbox', optional: true }),
    ],
  },
  {
    id: 'history',
    label: 'History',
    readOnly: true,
    columns: [
      salesField('date', 'Date', 150),
      salesField('dept', 'Dept', 90),
      salesField('staffid', 'StaffID', 120),
      salesField('staffname', 'StaffName', 170),
      salesField('history', 'History', 360),
    ],
  },
]
const activeQualityTab = computed(() => qualityTabs.find((tab) => tab.id === state.qcTab) || qualityTabs[0])
type CustomGridGroup = 'traders' | 'reference' | 'internal'
const customGridTabColumns = () => [
  salesField('rdate', 'Date', 130, { kind: 'date' }),
  salesField('content', 'Content', 260),
]
const makeCustomGridTab = (label: string, id = '') => {
  const safe = String(label || '').trim()
  const slug = safe.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'tab'
  return {
    id: id || `${slug}_${Date.now().toString(36)}`,
    label: safe,
    custom: true,
    columns: customGridTabColumns(),
  }
}
const customGridTabConfigs: Record<CustomGridGroup, {
  page: string
  kind: string
  idRef: { value: string }
  tabsRef: { value: any[] }
  allTabs: () => any[]
  activeId: () => string
  setActive: (id: string) => void
  pagePrefix: string
}> = {
  traders: {
    page: 'traders_tabs_config',
    kind: 'traders-suppliers-tabs',
    idRef: ref(''),
    tabsRef: customTraderTabs,
    allTabs: () => traderTabs.value,
    activeId: () => state.traderTab,
    setActive: (id: string) => { state.traderTab = id },
    pagePrefix: 'traders_',
  },
  reference: {
    page: 'reference_tabs_config',
    kind: 'reference-data-tabs',
    idRef: ref(''),
    tabsRef: customReferenceTabs,
    allTabs: () => referenceTabs.value,
    activeId: () => state.refTab,
    setActive: (id: string) => { state.refTab = id },
    pagePrefix: 'ref_',
  },
  internal: {
    page: 'internal_tabs_config',
    kind: 'internal-directory-tabs',
    idRef: ref(''),
    tabsRef: customInternalTabs,
    allTabs: () => internalTabs.value,
    activeId: () => state.internalTab,
    setActive: (id: string) => { state.internalTab = id },
    pagePrefix: 'internal_',
  },
}
const serializeCustomGridTabs = (group: CustomGridGroup) => customGridTabConfigs[group].tabsRef.value.map((tab: any) => ({ id: tab.id, label: tab.label, custom: true }))
const loadCustomGridTabsConfig = async (group: CustomGridGroup) => {
  const config = customGridTabConfigs[group]
  try {
    const result = await apiFetch(`/records?country=GLOBAL&page=${encodeURIComponent(config.page)}&limit=1`)
    const record = Array.isArray(result.items) ? result.items[0] : null
    config.idRef.value = record?.id || ''
    const tabs = Array.isArray(record?.data?.tabs) ? record.data.tabs : []
    config.tabsRef.value = tabs
      .filter((tab: any) => tab?.custom && String(tab.label || '').trim())
      .map((tab: any) => makeCustomGridTab(tab.label, tab.id))
    if (!config.allTabs().some((tab: any) => tab.id === config.activeId())) config.setActive(config.allTabs()[0]?.id || '')
  } catch (error) {
    console.error(`Could not load ${group} tabs config`, error)
  }
}
const loadAllCustomGridTabsConfig = async () => {
  await Promise.all((['traders', 'reference', 'internal'] as CustomGridGroup[]).map((group) => loadCustomGridTabsConfig(group)))
}
const saveCustomGridTabsConfig = async (group: CustomGridGroup) => {
  const config = customGridTabConfigs[group]
  const body = {
    country: 'GLOBAL',
    page: config.page,
    kind: config.kind,
    data: { type: config.kind, tabs: serializeCustomGridTabs(group), status: 'Active' },
    sortOrder: 1,
  }
  const result = config.idRef.value
    ? await apiFetch(`/records/${config.idRef.value}`, { method: 'PATCH', body })
    : await apiFetch('/records', { method: 'POST', body })
  config.idRef.value = result?.id || config.idRef.value
}
const addCustomGridTab = async (group: CustomGridGroup) => {
  const config = customGridTabConfigs[group]
  const label = (await promptAdmin('Add new tab', 'Tab name', '', 'Enter a name for the new list.'))?.trim()
  if (!label) return
  if (config.allTabs().some((tab: any) => String(tab.label).toLowerCase() === label.toLowerCase())) {
    await notifyAdmin('A tab with this name already exists.')
    return
  }
  const tab = makeCustomGridTab(label)
  config.tabsRef.value.push(tab)
  await saveCustomGridTabsConfig(group)
  if (group === 'traders') await setTraderTab(tab.id)
  else if (group === 'reference') await setReferenceTab(tab.id)
  else await setInternalTab(tab.id)
}
const removeCustomGridTab = async (group: CustomGridGroup, tab: any) => {
  if (!tab?.custom) {
    await notifyAdmin('Default tabs cannot be removed.')
    return
  }
  if (!(await confirmRemoveTab(tab.label))) return
  const config = customGridTabConfigs[group]
  const oldId = tab.id
  config.tabsRef.value = config.tabsRef.value.filter((item: any) => item.id !== oldId)
  await saveCustomGridTabsConfig(group)
  const rows = await apiFetch(`/records?country=${encodeURIComponent(recordCountry.value)}&page=${encodeURIComponent(`${config.pagePrefix}${oldId}`)}&limit=1000`)
  for (const record of Array.isArray(rows.items) ? rows.items : []) {
    await apiFetch(`/records/${record.id}`, { method: 'DELETE' })
  }
  if (config.activeId() === oldId) config.setActive(config.allTabs()[0]?.id || '')
  resetSalesViewState()
  await loadRecords()
}

const analysisTopTabs = ['Summary', 'Revenue', 'Cost', 'Margin', 'Volume', 'NewClient', 'ApprovalList']
const analysisSummaryTabs = [
  { id: 'total_revenue', label: 'Total Revenue' },
  { id: 'total_cost', label: 'Total Cost' },
  { id: 'total_margin', label: 'Total Margin' },
  { id: 'total_volume', label: 'Total Volume' },
  { id: 'total_client', label: 'Total Client' },
]
const typeGroupA = ['EXW', 'FCA', 'FCF']
const typeGroupB = ['DO', 'DAP', 'DDU', 'DDP']
const analysisTypeOptions = [...typeGroupA, ...typeGroupB]
const analysisCommonHead = () => [
  salesField('bu', 'OwnerBU', 90),
  salesField('originbu', 'OriginBU', 100, { kind: 'computed', optional: true }),
  salesField('destinationbu', 'DestinationBU', 120, { kind: 'computed', optional: true }),
  salesField('type', 'Type', 90, { kind: 'select', opts: analysisTypeOptions }),
  salesField('typeplus', 'Type+', 90, { kind: 'select', opts: analysisTypeOptions, optional: true }),
  salesField('ref', 'Ref#', 120),
  salesField('hbl', 'HBL', 130),
  salesField('mbl', 'MBL', 130),
  salesField('clientcode', 'ClientCode', 110, { optional: true }),
  salesField('shippercode', 'ShipperCode', 110, { optional: true }),
  salesField('cneecode', 'CneeCode', 110, { optional: true }),
  salesField('etd', 'ETD', 110, { kind: 'date', optional: true }),
  salesField('eta', 'ETA', 110, { kind: 'date', optional: true }),
  salesField('pol', 'POL', 100),
  salesField('pod', 'POD', 100),
]
const analysisApprovalHead = () => [
  salesField('approveddate', 'ApprovedDate', 130, { kind: 'date' }),
  salesField('type', 'Type', 90, { kind: 'select', opts: analysisTypeOptions }),
  salesField('bu', 'OwnerBU', 90),
  salesField('originbu', 'OriginBU', 100, { kind: 'computed', optional: true }),
  salesField('destinationbu', 'DestinationBU', 120, { kind: 'computed', optional: true }),
  salesField('typeplus', 'Type+', 90, { kind: 'select', opts: analysisTypeOptions, optional: true }),
  salesField('ref', 'Ref#', 120),
  salesField('hbl', 'HBL', 130),
  salesField('mbl', 'MBL', 130),
  salesField('sales', 'Sales', 110),
  salesField('ops', 'OPS', 110),
  salesField('pol', 'POL', 100),
  salesField('pod', 'POD', 100),
  salesField('clientcode', 'ClientCode', 110, { optional: true }),
  salesField('shippercode', 'ShipperCode', 110, { optional: true }),
  salesField('cneecode', 'CneeCode', 110, { optional: true }),
  salesField('vesselvoyage', 'VesselVoyage', 150, { optional: true }),
  salesField('chargename', 'ChargeName', 160),
  salesField('unit', 'Unit', 90, { optional: true }),
  salesField('amount', 'Amount', 110, { kind: 'number', optional: true }),
  salesField('currency', 'Currency', 100, { kind: 'select', opts: salesCurrencyOptions }),
]
const analysisLeafTables = {
  revenue: {
    id: 'revenue',
    label: 'Revenue',
    readOnly: true,
    columns: [
      ...analysisCommonHead(),
      salesField('chargename', 'ChargeName', 160),
      salesField('amount', 'Amount', 110, { kind: 'number', optional: true }),
      salesField('currency', 'Currency', 100, { kind: 'select', opts: salesCurrencyOptions }),
      salesField('payer', 'Payer', 150),
      salesField('payerid', 'PayerID', 120),
      salesField('namecode', 'NameCode', 110),
      salesField('collectat', 'CollectAt', 110),
      salesField('sales', 'Sales', 110),
      salesField('ops', 'OPS', 110),
      salesField('requesteddate', 'RequestedDate', 130, { kind: 'date', optional: true }),
      salesField('approveddate', 'ApprovedDate', 130, { kind: 'date', optional: true }),
    ],
  },
  cost: {
    id: 'cost',
    label: 'Cost',
    readOnly: true,
    columns: [
      ...analysisCommonHead(),
      salesField('chargename', 'ChargeName', 160),
      salesField('amount', 'Amount', 110, { kind: 'number', optional: true }),
      salesField('currency', 'Currency', 100, { kind: 'select', opts: salesCurrencyOptions }),
      salesField('receiver', 'Receiver', 150),
      salesField('receiverid', 'ReceiverID', 120),
      salesField('namecode', 'NameCode', 110),
      salesField('payat', 'PayAt', 110),
      salesField('sales', 'Sales', 110),
      salesField('ops', 'OPS', 110),
      salesField('requesteddate', 'RequestedDate', 130, { kind: 'date', optional: true }),
      salesField('approveddate', 'ApprovedDate', 130, { kind: 'date', optional: true }),
    ],
  },
  margin: {
    id: 'margin',
    label: 'Margin',
    readOnly: true,
    columns: [
      ...analysisCommonHead(),
      salesField('vesselvoyage', 'VesselVoyage', 150, { optional: true }),
      salesField('amount', 'Amount', 110, { kind: 'number', optional: true }),
      salesField('currency', 'Currency', 100, { kind: 'select', opts: salesCurrencyOptions }),
      salesField('sales', 'Sales', 110),
      salesField('ops', 'OPS', 110),
    ],
  },
  newclient: {
    id: 'newclient',
    label: 'NewClient',
    readOnly: true,
    columns: [
      salesField('ndate', 'Date', 120, { kind: 'date' }),
      salesField('bu', 'OwnerBU', 90),
      salesField('originbu', 'OriginBU', 100, { kind: 'computed', optional: true }),
      salesField('destinationbu', 'DestinationBU', 120, { kind: 'computed', optional: true }),
      salesField('type', 'Type', 90, { kind: 'select', opts: analysisTypeOptions }),
      salesField('typeplus', 'Type+', 90, { kind: 'select', opts: analysisTypeOptions, optional: true }),
      salesField('ref', 'Ref#', 120),
      salesField('hbl', 'HBL', 130),
      salesField('mbl', 'MBL', 130),
      salesField('etd', 'ETD', 110, { kind: 'date', optional: true }),
      salesField('eta', 'ETA', 110, { kind: 'date', optional: true }),
      salesField('pol', 'POL', 100),
      salesField('pod', 'POD', 100),
      salesField('fullname', 'ClientName', 170),
      salesField('namecode', 'NameCode', 110),
      salesField('id', 'ID', 100),
      salesField('shippercode', 'ShipperCode', 110, { optional: true }),
      salesField('cneecode', 'CneeCode', 110, { optional: true }),
      salesField('sales', 'Sales', 110),
      salesField('ops', 'OPS', 110),
    ],
  },
}
const analysisVolumeTabs = [
  {
    id: 'volume_fcl',
    label: 'FCL',
    readOnly: true,
    columns: [
      ...analysisCommonHead(),
      salesField('sales', 'Sales', 110),
      salesField('ops', 'OPS', 110),
      salesField('volume', 'Volume', 100, { kind: 'number', optional: true }),
      salesField('teu', 'TEU', 90, { kind: 'number', optional: true }),
      salesField('gw', 'GW/KG', 100, { kind: 'number', optional: true }),
      salesField('cbm', 'CBM', 90, { kind: 'number', optional: true }),
    ],
  },
  {
    id: 'volume_lcl',
    label: 'LCL',
    readOnly: true,
    columns: [
      ...analysisCommonHead(),
      salesField('sales', 'Sales', 110),
      salesField('ops', 'OPS', 110),
      salesField('gw', 'GW/KG', 100, { kind: 'number', optional: true }),
      salesField('cbm', 'CBM', 90, { kind: 'number', optional: true }),
    ],
  },
  {
    id: 'volume_air',
    label: 'AIR',
    readOnly: true,
    columns: [
      ...analysisCommonHead(),
      salesField('sales', 'Sales', 110),
      salesField('ops', 'OPS', 110),
      salesField('gw', 'GW/KG', 100, { kind: 'number', optional: true }),
      salesField('cbm', 'CBM', 90, { kind: 'number', optional: true }),
    ],
  },
]
const analysisApprovalTabs = [
  {
    id: 'paymentlist',
    label: 'PaymentList',
    readOnly: true,
    columns: [
      ...analysisApprovalHead(),
      salesField('payto', 'PayTo', 150),
      salesField('namecode', 'NameCode', 110),
      salesField('id', 'ID', 100),
      salesField('paymentbu', 'PaymentBU', 110, { optional: true }),
      salesField('payer', 'Payer', 150, { optional: true }),
      salesField('payat', 'PayAt', 130, { kind: 'list', optional: true }),
      salesField('debitno', 'DebitNo#', 130, { optional: true }),
      salesField('debitdate', 'DebitDate', 120, { kind: 'date', optional: true }),
      salesField('invoiceno', 'InvoiceNo#', 130, { optional: true }),
      salesField('invoicedate', 'InvoiceDate', 120, { kind: 'date', optional: true }),
      salesField('outstandingdays', 'OutstandingDays', 130, { kind: 'computed', optional: true }),
      salesField('paymentdeadline', 'PaymentDeadline', 130, { kind: 'date', optional: true }),
      salesField('remainingdate', 'RemainingDate', 130, { kind: 'computed', optional: true }),
      salesField('paiddate', 'PaidDate', 120, { kind: 'date', optional: true }),
    ],
  },
  {
    id: 'collectionlist',
    label: 'CollectionList',
    readOnly: true,
    columns: [
      ...analysisApprovalHead(),
      salesField('collectfrom', 'CollectFrom', 150),
      salesField('namecode', 'NameCode', 110),
      salesField('id', 'ID', 100),
      salesField('collectionbu', 'CollectionBU', 120, { optional: true }),
      salesField('receiver', 'Receiver', 150, { optional: true }),
      salesField('collectat', 'CollectAt', 130, { kind: 'list', optional: true }),
      salesField('debitno', 'DebitNo#', 130, { optional: true }),
      salesField('debitdate', 'DebitDate', 120, { kind: 'date', optional: true }),
      salesField('invoiceno', 'InvoiceNo#', 130, { optional: true }),
      salesField('invoicedate', 'InvoiceDate', 120, { kind: 'date', optional: true }),
      salesField('outstandingdays', 'OutstandingDays', 130, { kind: 'computed', optional: true }),
      salesField('collectiondeadline', 'CollectionDeadline', 150, { kind: 'date', optional: true }),
      salesField('remainingdate', 'RemainingDate', 130, { kind: 'computed', optional: true }),
      salesField('receiveddate', 'ReceivedDate', 120, { kind: 'date', optional: true }),
    ],
  },
  {
    id: 'profitshare',
    label: 'ProfitShare',
    readOnly: true,
    columns: [
      salesField('type', 'Type', 90, { kind: 'select', opts: analysisTypeOptions }),
      salesField('typeplus', 'Type+', 90, { kind: 'select', opts: analysisTypeOptions, optional: true }),
      salesField('ref', 'Ref#', 120),
      salesField('hbl', 'HBL', 130),
      salesField('mbl', 'MBL', 130),
      salesField('clientcode', 'ClientCode', 110, { optional: true }),
      salesField('shippercode', 'ShipperCode', 110, { optional: true }),
      salesField('cneecode', 'CneeCode', 110, { optional: true }),
      salesField('pol', 'POL', 100),
      salesField('pod', 'POD', 100),
      salesField('vesselvoyage', 'VesselVoyage', 150, { optional: true }),
      salesField('totalmargin', 'TotalMargin', 120, { kind: 'number', optional: true }),
      salesField('currency', 'Currency', 100, { kind: 'select', opts: salesCurrencyOptions }),
      salesField('ownerbumargin', 'OwnerBUMargin', 130, { kind: 'computed', optional: true }),
      salesField('originbumargin', 'OriginBUMargin', 130, { kind: 'computed', optional: true }),
      salesField('destinationbumargin', 'DestinationBUMargin', 150, { kind: 'computed', optional: true }),
    ],
  },
]
const analysisSubTabs = computed(() => {
  if (state.analysisTop === 'Summary') return analysisSummaryTabs
  if (state.analysisTop === 'Volume') return analysisVolumeTabs
  if (state.analysisTop === 'ApprovalList') return analysisApprovalTabs
  return []
})
const activeAnalysisTable = computed(() => {
  if (state.analysisTop === 'Summary') return { ...(analysisSummaryTabs.find((tab) => tab.id === state.analysisSub) || analysisSummaryTabs[0]), dashboard: true, readOnly: true, columns: [] }
  if (state.analysisTop === 'Revenue') return analysisLeafTables.revenue
  if (state.analysisTop === 'Cost') return analysisLeafTables.cost
  if (state.analysisTop === 'Margin') return analysisLeafTables.margin
  if (state.analysisTop === 'NewClient') return analysisLeafTables.newclient
  if (state.analysisTop === 'Volume') return analysisVolumeTabs.find((tab) => tab.id === state.analysisSub) || analysisVolumeTabs[0]
  if (state.analysisTop === 'ApprovalList') return analysisApprovalTabs.find((tab) => tab.id === state.analysisSub) || analysisApprovalTabs[0]
  return analysisLeafTables.revenue
})
const analysisColumns = computed(() => activeAnalysisTable.value.columns || [])
const analysisSourcePageIds = ['analysis_revenue', 'analysis_cost', 'analysis_margin', 'analysis_volume_fcl', 'analysis_volume_lcl', 'analysis_volume_air', 'analysis_newclient', 'analysis_paymentlist', 'analysis_collectionlist']
const analysisNumber = (value: any) => {
  const num = Number(String(value ?? '').replace(/,/g, ''))
  return Number.isFinite(num) ? num : 0
}
const analysisPortCountry = (port: any) => ({
  SGN: 'VN',
  HAN: 'VN',
  DAD: 'VN',
  HPH: 'VN',
  LAX: 'US',
  HKG: 'HK',
  NRT: 'JP',
  ROT: 'NL',
  SIN: 'SG',
} as Record<string, string>)[String(port || '').toUpperCase()] || ''
const analysisProfitShareData = (row: Record<string, any>) => {
  const originBU = analysisPortCountry(row.pol)
  const destinationBU = analysisPortCountry(row.pod)
  const belongsToVietnam = originBU === 'VN' || destinationBU === 'VN'
  const totalMargin = analysisNumber(row.amount)
  let ownerbumargin = 0
  let originbumargin = 0
  let destinationbumargin = 0

  if (belongsToVietnam && row.type && !row.typeplus) {
    ownerbumargin = totalMargin
  } else if (belongsToVietnam && row.type && row.typeplus) {
    const half = totalMargin / 2
    ownerbumargin = half
    if (typeGroupA.includes(String(row.typeplus))) originbumargin = half
    if (typeGroupB.includes(String(row.typeplus))) destinationbumargin = half
  }
  return {
    type: row.type || '',
    typeplus: row.typeplus || '',
    ref: row.ref || '',
    hbl: row.hbl || '',
    mbl: row.mbl || '',
    clientcode: row.clientcode || '',
    shippercode: row.shippercode || '',
    cneecode: row.cneecode || '',
    pol: row.pol || '',
    pod: row.pod || '',
    vesselvoyage: row.vesselvoyage || '',
    totalmargin: row.amount || '',
    currency: row.currency || '',
    ownerbumargin: belongsToVietnam ? String(ownerbumargin) : '',
    originbumargin: belongsToVietnam ? String(originbumargin) : '',
    destinationbumargin: belongsToVietnam ? String(destinationbumargin) : '',
  }
}
const analysisProfitShareRecord = (record: AdminRecord, index: number): AdminRecord => ({
  ...record,
  id: `profitshare-${record.id}`,
  page: 'analysis_profitshare',
  data: analysisProfitShareData(dataOf(record)),
  sortOrder: index + 1,
})
const formatAnalysisMoney = (value: any) => analysisNumber(value).toLocaleString('en-US', { maximumFractionDigits: 2 })
const loadAnalysisDashboardRecords = async () => {
  if (currentPage.value.kind !== 'analysis-statistics') return
  const results = await Promise.all(analysisSourcePageIds.map(async (page) => {
    const result = await apiFetch(`/records?country=GLOBAL&page=${encodeURIComponent(page)}&limit=1000`)
    return (Array.isArray(result.items) ? result.items : []).map((record: AdminRecord) => ({ ...record, _analysisPage: page }))
  }))
  analysisDashboardRecords.value = results.flat()
}
const analysisDashboardSourceRows = computed(() => analysisDashboardRecords.value.map((record: any) => ({ page: record._analysisPage, ...dataOf(record) })))
const analysisCurrencyOptions = computed(() => Array.from(new Set(['USD', ...salesCurrencyOptions])))
const analysisSummaryFilter = reactive({
  client: '',
  sales: '',
  bu: '',
  from: '',
  to: '',
  compareBy: 'month',
  years: [2022, 2023, 2024, 2025, 2026] as number[],
  baseCur: 'USD',
  volType: 'all',
  volMetric: 'shipment',
  clientMode: 'client',
})
type AnalysisFilterKey = 'client' | 'sales' | 'bu'
const analysisFilterDropdown = ref<AnalysisFilterKey | ''>('')
const analysisFilterOptionList = (key: AnalysisFilterKey) => {
  const source = key === 'client' ? analysisFilterOptions.value.clients : key === 'sales' ? analysisFilterOptions.value.sales : analysisFilterOptions.value.bus
  const needle = String(analysisSummaryFilter[key] || '').trim().toUpperCase()
  if (!needle) return source.slice(0, 80)
  return source.filter((option) => option.toUpperCase().includes(needle)).slice(0, 80)
}
const toggleAnalysisFilterDropdown = (key: AnalysisFilterKey) => {
  analysisFilterDropdown.value = analysisFilterDropdown.value === key ? '' : key
}
const syncAnalysisFilterEditable = (key: AnalysisFilterKey) => {
  const el = document.querySelector<HTMLElement>(`[data-analysis-filter="${key}"]`)
  if (el) el.textContent = analysisSummaryFilter[key] || 'All'
}
const chooseAnalysisFilterOption = (key: AnalysisFilterKey, value: string) => {
  analysisSummaryFilter[key] = value
  analysisFilterDropdown.value = ''
  nextTick(() => syncAnalysisFilterEditable(key))
}
const placeCaretAtEnd = (el: HTMLElement) => {
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}
const focusAnalysisFilterEditable = (key: AnalysisFilterKey, event: FocusEvent) => {
  analysisFilterDropdown.value = key
  const el = event.currentTarget as HTMLElement
  if (!analysisSummaryFilter[key]) el.textContent = ''
  nextTick(() => placeCaretAtEnd(el))
}
const handleAnalysisFilterTextInput = (key: AnalysisFilterKey, event: Event) => {
  const el = event.currentTarget as HTMLElement
  const value = (el.textContent || '').trim()
  analysisSummaryFilter[key] = value === 'All' ? '' : value
  analysisFilterDropdown.value = key
}
const blurAnalysisFilterEditable = (key: AnalysisFilterKey, event: FocusEvent) => {
  const el = event.currentTarget as HTMLElement
  if (!String(analysisSummaryFilter[key] || '').trim()) el.textContent = 'All'
}
const handleAnalysisFilterOutside = (event: MouseEvent) => {
  if (!(event.target as HTMLElement | null)?.closest('.analysis-filter-combo')) {
    analysisFilterDropdown.value = ''
  }
}
const analysisBarCanvas = ref<HTMLCanvasElement | null>(null)
const analysisPieCanvas1 = ref<HTMLCanvasElement | null>(null)
const analysisPieCanvas2 = ref<HTMLCanvasElement | null>(null)
let analysisBarChart: any = null
let analysisPieChart1: any = null
let analysisPieChart2: any = null
let analysisBarChartToken = 0
const analysisDefaultFxRows = [
  { rdate: '2022-01-01', usd: 1, vnd: 0.0000430, cny: 0.148 },
  { rdate: '2023-01-01', usd: 1, vnd: 0.0000423, cny: 0.141 },
  { rdate: '2024-01-01', usd: 1, vnd: 0.0000406, cny: 0.139 },
  { rdate: '2025-01-01', usd: 1, vnd: 0.0000394, cny: 0.137 },
  { rdate: '2026-01-01', usd: 1, vnd: 0.0000390, cny: 0.136 },
]
const analysisFxRateToUsd = (currency: any, dateStr: any) => {
  const cur = String(currency || 'USD').toLowerCase()
  if (cur === 'usd') return 1
  const date = analysisNormalizeDate(dateStr)
  if (!date) return null
  let best: number | null = null
  analysisDefaultFxRows.forEach((row) => {
    if (row.rdate <= date) {
      const value = Number((row as any)[cur])
      if (value > 0) best = value
    }
  })
  return best
}
const analysisToBase = (amount: any, currency: any, dateStr: any) => {
  const fromCur = String(currency || 'USD').toUpperCase()
  const toCur = String(analysisSummaryFilter.baseCur || 'USD').toUpperCase()
  const value = analysisNumber(amount)
  if (!fromCur || fromCur === toCur) return value
  const from = analysisFxRateToUsd(fromCur, dateStr)
  const to = analysisFxRateToUsd(toCur, dateStr)
  if (from == null || to == null) return null
  return value * from / to
}
const analysisNormalizeDate = (value: any) => {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const dmy = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`
  const ymd = raw.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/)
  if (ymd) return `${ymd[1]}-${ymd[2].padStart(2, '0')}-${ymd[3].padStart(2, '0')}`
  const parsed = new Date(raw)
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)
  return raw.slice(0, 10)
}
const analysisRowDate = (row: any) => analysisNormalizeDate(row.etd || row.approveddate || row.ndate || row.requesteddate || row.date || '')
const analysisClientCode = (row: any) => String(row.namecode || row.clientcode || row.clientname || row.fullname || '').trim()
const analysisClientDirectory: Record<string, { name: string, id: string }> = {
  ABCLOG: { name: 'ABC LOGISTICS CO., LTD', id: 'ABCLOG01' },
  GLBTRD: { name: 'GLOBAL TRADE CO., LTD', id: 'GLBTRD01' },
  ORISHP: { name: 'ORIENT SHIPPING JSC', id: 'ORISHP01' },
  PACIMP: { name: 'PACIFIC IMPEX CORP', id: 'PACIMP01' },
  SUNCGO: { name: 'SUNRISE CARGO LTD', id: 'SUNCGO01' },
  DELFRT: { name: 'DELTA FREIGHT INC', id: 'DELFRT01' },
}
const normalizeAnalysisClientCode = (value: any) => String(value || '').trim().toUpperCase()
const analysisKnownClient = (code: any) => analysisClientDirectory[normalizeAnalysisClientCode(code)]
const analysisClientAlias = new Map<string, string>()
Object.entries(analysisClientDirectory).forEach(([code, info]) => {
  analysisClientAlias.set(normalizeAnalysisClientCode(code), code)
  analysisClientAlias.set(normalizeAnalysisClientCode(info.id), code)
  analysisClientAlias.set(normalizeAnalysisClientCode(info.name), code)
})
const analysisSplitClientValues = (value: any) => String(value || '')
  .split(/[,\n;]+/)
  .map((part) => normalizeAnalysisClientCode(part))
  .filter(Boolean)
const analysisCanonicalClientCode = (value: any) => {
  const normalized = normalizeAnalysisClientCode(value)
  if (!normalized) return ''
  if (analysisClientAlias.has(normalized)) return analysisClientAlias.get(normalized) || normalized
  const idMatch = Object.entries(analysisClientDirectory).find(([, info]) => normalized.startsWith(normalizeAnalysisClientCode(info.id)))
  if (idMatch) return idMatch[0]
  return normalized
}
const analysisKeepClientCode = (value: any) => {
  const code = analysisCanonicalClientCode(value)
  if (!code) return ''
  if (analysisClientDirectory[code]) return code
  return /^[A-Z0-9_-]+$/.test(code) ? code : ''
}
const analysisClientCodesFromRow = (row: any) => {
  const splitFields = [
    row.namecode,
    row.namecodes,
    row.clientcode,
    row.clientcodes,
    row.payerid,
    row.receiverid,
    row.clientid,
    row.id,
  ]
  const exactFields = [
    row.clientname,
    row.fullname,
    row.companyname,
    row.payer,
    row.receiver,
  ]
  const candidates = [
    ...splitFields.flatMap((field) => analysisSplitClientValues(field)),
    ...exactFields.map((field) => String(field || '').trim()).filter(Boolean),
  ]
  return Array.from(new Set(candidates.map(analysisKeepClientCode).filter(Boolean)))
}
const analysisGroupRows = computed(() => {
  const groups: Record<string, any> = {}
  analysisDashboardSourceRows.value.forEach((row: any, index: number) => {
    if (row.page === 'analysis_newclient') return
    const key = row.ref || row.hbl || row.mbl || `${row.page}-${index}`
    if (!groups[key]) {
      groups[key] = {
        ref: key,
        etd: analysisRowDate(row),
        namecode: analysisClientCode(row),
        clientcode: row.clientcode || row.namecode || '',
        clientname: row.clientname || row.fullname || '',
        sales: row.sales || '',
        bu: row.bu || row.originbu || '',
        type: row.type || '',
        revenue: 0,
        cost: 0,
        margin: 0,
        cbm: 0,
        cbmFcl: 0,
        cbmLcl: 0,
        cbmAir: 0,
        gw: 0,
        gwFcl: 0,
        gwLcl: 0,
        gwAir: 0,
        teuFcl: 0,
        hasFcl: false,
        hasLcl: false,
        hasAir: false,
        count: 1,
        unconverted: 0,
      }
    }
    const target = groups[key]
    target.etd ||= analysisRowDate(row)
    target.namecode ||= analysisClientCode(row)
    target.sales ||= row.sales || ''
    target.bu ||= row.bu || row.originbu || ''
    if (row.page === 'analysis_revenue' || row.page === 'analysis_cost' || row.page === 'analysis_margin') {
      const converted = analysisToBase(row.amount, row.currency, analysisRowDate(row))
      if (converted == null) target.unconverted += 1
      else if (row.page === 'analysis_revenue') target.revenue += converted
      else if (row.page === 'analysis_cost') target.cost += converted
      else target.margin += converted
    }
    if (String(row.page || '').startsWith('analysis_volume')) {
      const hasCbm = row.cbm !== undefined && row.cbm !== null && String(row.cbm).trim() !== ''
      const volume = analysisNumber(row.volume || 0)
      const cbm = hasCbm ? analysisNumber(row.cbm) : row.page === 'analysis_volume_fcl' ? volume * 12 : volume
      const gw = analysisNumber(row.gw || 0)
      const teu = analysisNumber(row.teu || 0)
      target.cbm += cbm
      target.gw += gw
      if (row.page === 'analysis_volume_fcl') {
        target.hasFcl = true
        target.cbmFcl += cbm
        target.gwFcl += gw
        target.teuFcl += teu
      } else if (row.page === 'analysis_volume_lcl') {
        target.hasLcl = true
        target.cbmLcl += cbm
        target.gwLcl += gw
      } else if (row.page === 'analysis_volume_air') {
        target.hasAir = true
        target.cbmAir += cbm
        target.gwAir += gw
      }
    }
  })
  return Object.values(groups).map((row: any) => ({
    ...row,
    margin: row.margin || row.revenue - row.cost,
  }))
})
const analysisNewClientRows = computed(() => analysisDashboardSourceRows.value
  .filter((row: any) => row.page === 'analysis_newclient')
  .map((row: any) => ({
    ...row,
    etd: analysisRowDate(row),
    namecode: analysisClientCode(row),
    bu: row.bu || row.originbu || '',
    count: 1,
  })))
const analysisFilterOptions = computed(() => {
  const rows = [...analysisGroupRows.value, ...analysisNewClientRows.value]
  const uniqueFrom = (keys: string[], fallback: string[] = []) => {
    const values = rows.flatMap((row: any) => keys.map((key) => String(row[key] || '').trim())).filter(Boolean)
    return Array.from(new Set([...values, ...fallback])).sort()
  }
  return {
    clients: uniqueFrom(['namecode', 'clientcode', 'clientname']),
    sales: uniqueFrom(['sales'], ['JOHN', 'LINH', 'MARY', 'TOM']),
    bus: uniqueFrom(['bu', 'ownerbu', 'originbu', 'destinationbu'], ['DAD', 'HAN', 'SGN']),
  }
})
const analysisYearsAvailable = computed(() => {
  const years = [...analysisGroupRows.value, ...analysisNewClientRows.value]
    .map((row: any) => Number(String(row.etd || '').slice(0, 4)))
    .filter((year: number) => Number.isFinite(year) && year > 1900)
  return Array.from(new Set(years.length ? years : [2022, 2023, 2024, 2025, 2026])).sort((a, b) => a - b)
})
const analysisSummaryTitle = computed(() => {
  if (state.analysisSub === 'total_client' && analysisSummaryFilter.clientMode === 'newclient') return 'Total NewClient'
  return analysisSummaryTabs.find((tab) => tab.id === state.analysisSub)?.label || 'Total Revenue'
})
const analysisSummaryKind = computed(() => {
  if (state.analysisSub === 'total_volume') return 'volume'
  if (state.analysisSub === 'total_client' && analysisSummaryFilter.clientMode === 'newclient') return 'newclient'
  if (state.analysisSub === 'total_client') return 'client'
  return 'money'
})
const analysisMetricKey = computed(() => {
  if (state.analysisSub === 'total_cost') return 'cost'
  if (state.analysisSub === 'total_margin') return 'margin'
  if (state.analysisSub === 'total_volume') return 'volume'
  if (state.analysisSub === 'total_client') return analysisSummaryFilter.clientMode === 'newclient' ? 'newclient' : 'client'
  return 'revenue'
})
const analysisMatchesFilter = (row: any) => {
  const client = analysisSummaryFilter.client.trim().toUpperCase()
  const sales = analysisSummaryFilter.sales.trim().toUpperCase()
  const bu = analysisSummaryFilter.bu.trim().toUpperCase()
  const date = analysisRowDate(row)
  if (client && !String(row.namecode || '').toUpperCase().includes(client)) return false
  if (sales && !String(row.sales || '').toUpperCase().includes(sales)) return false
  if (bu && !String(row.bu || '').toUpperCase().includes(bu)) return false
  if (analysisSummaryFilter.from && date && date < analysisSummaryFilter.from) return false
  if (analysisSummaryFilter.to && date && date > analysisSummaryFilter.to) return false
  return true
}
const analysisVolumeValue = (row: any) => {
  const type = analysisSummaryFilter.volType
  const metric = analysisSummaryFilter.volMetric
  if (type !== 'all') {
    const hasType = type === 'FCL' ? row.hasFcl : type === 'LCL' ? row.hasLcl : row.hasAir
    if (!hasType) return 0
  }
  if (metric === 'shipment') return 1
  if (metric === 'teu') return type === 'LCL' || type === 'AIR' ? 0 : analysisNumber(row.teuFcl)
  if (metric === 'gw') return type === 'FCL' ? analysisNumber(row.gwFcl) : type === 'LCL' ? analysisNumber(row.gwLcl) : type === 'AIR' ? analysisNumber(row.gwAir) : analysisNumber(row.gw)
  return type === 'FCL' ? analysisNumber(row.cbmFcl) : type === 'LCL' ? analysisNumber(row.cbmLcl) : type === 'AIR' ? analysisNumber(row.cbmAir) : analysisNumber(row.cbm)
}
const analysisSummaryRows = computed(() => {
  const rows = analysisSummaryKind.value === 'newclient' ? analysisNewClientRows.value : analysisGroupRows.value
  return rows.filter(analysisMatchesFilter).filter((row: any) => analysisSummaryKind.value !== 'volume' || analysisVolumeValue(row) > 0)
})
const analysisSummaryUnit = computed(() => {
  if (analysisSummaryKind.value === 'client' || analysisSummaryKind.value === 'newclient') return 'client(s)'
  if (analysisSummaryKind.value === 'volume') {
    if (analysisSummaryFilter.volMetric === 'shipment') return 'shipment(s)'
    if (analysisSummaryFilter.volMetric === 'gw') return 'KG'
    if (analysisSummaryFilter.volMetric === 'teu') return 'TEU'
    return 'CBM'
  }
  return analysisSummaryFilter.baseCur || 'USD'
})
const analysisSelectionSummary = computed(() => {
  const empty = { visible: false, text: '', details: [] as Array<{ key: string, fields: Array<{ label: string, value: string }> }> }
  if (!isAnalysisSelectionSummaryTable.value) return empty
  const selected = records.value
    .filter((record) => state.selected.has(record.id))
    .map((record) => dataOf(record))
  if (!selected.length) return empty

  const isVolume = state.analysisTop === 'Volume'
  const metricLabel = isVolume ? 'Total CBM' : 'TotalAmount'
  const nameLabel = state.analysisTop === 'Revenue'
    ? 'Payer'
    : state.analysisTop === 'Cost'
      ? 'Receiver'
      : 'FullName'
  const idLabel = state.analysisTop === 'Revenue'
    ? 'PayerID'
    : state.analysisTop === 'Cost'
      ? 'ReceiverID'
      : 'ID'
  const lookup = new Map<string, { name: string, id: string }>()
  analysisDashboardSourceRows.value.forEach((row: any) => {
    const code = analysisCanonicalClientCode(analysisClientCode(row))
    if (!code || lookup.has(code)) return
    const known = analysisKnownClient(code)
    lookup.set(code, {
      name: String(row.fullname || row.clientname || row.companyname || row.payer || row.receiver || known?.name || ''),
      id: String(row.clientid || row.payerid || row.receiverid || row.id || known?.id || ''),
    })
  })
  if (isVolume) {
    const total = selected.reduce((sum: number, row: any) => sum + analysisNumber(row.cbm || row.volume || row.teu || row.gw || row.amount || 0), 0)
    return {
      visible: true,
      text: `${selected.length} row(s) selected \u00b7 ${metricLabel}: ${formatAnalysisMoney(total)}`,
      details: [{
        key: 'volume-total',
        fields: [
          { label: metricLabel, value: formatAnalysisMoney(total) },
          { label: 'FullName', value: '\u2014' },
          { label: 'NameCode', value: '(none)' },
          { label: idLabel, value: '\u2014' },
        ],
      }],
    }
  }
  if (state.analysisTop === 'Margin') {
    const total = selected.reduce((sum: number, row: any) => sum + analysisNumber(row.amount || row.totalamount || row.total || 0), 0)
    const currency = String(selected[0]?.currency || 'VND').trim() || 'VND'
    return {
      visible: true,
      text: `${selected.length} row(s) selected \u00b7 ${metricLabel}: ${formatAnalysisMoney(total)}`,
      details: [{
        key: 'margin-total',
        fields: [
          { label: metricLabel, value: formatAnalysisMoney(total) },
          { label: 'Currency', value: currency },
          { label: nameLabel, value: '\u2014' },
          { label: 'NameCode', value: '(none)' },
          { label: idLabel, value: '\u2014' },
        ],
      }],
    }
  }
  const groups: Record<string, { amount: number, currency: string, name: string, id: string }> = {}
  selected.forEach((row: any) => {
    const code = normalizeAnalysisClientCode(analysisClientCode(row)) || '(none)'
    if (!groups[code]) {
      const known = lookup.get(code) || analysisKnownClient(code) || { name: '', id: '' }
      groups[code] = {
        amount: 0,
        currency: String(row.currency || analysisSummaryFilter.baseCur || 'USD'),
        name: String(state.analysisTop === 'Revenue'
          ? row.payer || known.name
          : state.analysisTop === 'Cost'
            ? row.receiver || known.name
            : row.fullname || row.clientname || known.name),
        id: String(state.analysisTop === 'Revenue'
          ? row.payerid || known.id
          : state.analysisTop === 'Cost'
            ? row.receiverid || known.id
            : row.id || row.clientid || known.id),
      }
    }
    groups[code].amount += isVolume
      ? analysisNumber(row.cbm || row.volume || row.teu || row.gw || row.amount || 0)
      : analysisNumber(row.amount || row.totalamount || row.total || 0)
  })
  const total = Object.values(groups).reduce((sum, group) => sum + group.amount, 0)
  const details = Object.entries(groups).map(([code, group]) => ({
    key: code,
    fields: [
      { label: metricLabel, value: formatAnalysisMoney(group.amount) },
      ...(!isVolume ? [{ label: 'Currency', value: group.currency || '-' }] : []),
      { label: nameLabel, value: group.name || '-' },
      { label: 'NameCode', value: code },
      { label: idLabel, value: group.id || '-' },
    ],
  }))
  return {
    visible: true,
    text: `${selected.length} row(s) selected \u00b7 ${metricLabel}: ${formatAnalysisMoney(total)}`,
    details,
  }
})
const analysisGroundConfigs: Record<string, {
  title: string
  partyLabel: string
  partyField: string
  buLabel: string
  buField: string
  personLabel: string
  personField: string
  atLabel: string
  atField: string
  dateLabel: string
  dateField: string
  afterLabel: string
  afterField: string
  deadlineField: string
}> = {
  paymentlist: {
    title: 'PAYMENT GROUND',
    partyLabel: 'Receiver',
    partyField: 'payto',
    buLabel: 'PaymentBU',
    buField: 'paymentbu',
    personLabel: 'Payer',
    personField: 'payer',
    atLabel: 'Pay at',
    atField: 'payat',
    dateLabel: 'PaidDate',
    dateField: 'paiddate',
    afterLabel: 'PayAfter',
    afterField: 'payafter',
    deadlineField: 'paymentdeadline',
  },
  collectionlist: {
    title: 'COLLECTION GROUND',
    partyLabel: 'Payer',
    partyField: 'collectfrom',
    buLabel: 'CollectionBU',
    buField: 'collectionbu',
    personLabel: 'Receiver',
    personField: 'receiver',
    atLabel: 'Collect At',
    atField: 'collectat',
    dateLabel: 'ReceivedDate',
    dateField: 'receiveddate',
    afterLabel: 'ReceivedAfter',
    afterField: 'receivedafter',
    deadlineField: 'collectiondeadline',
  },
}
const analysisGroundLocked = ref(false)
const analysisGroundDraft = reactive<Record<string, any>>({})
const analysisGroundKey = computed(() => (
  currentPage.value.kind === 'analysis-statistics'
  && state.analysisTop === 'ApprovalList'
  && analysisGroundConfigs[state.analysisSub]
    ? state.analysisSub
    : ''
))
const analysisGroundRows = computed(() => analysisGroundKey.value
  ? records.value.filter((record) => state.selected.has(record.id))
  : [])
const sameOrMultiple = (rows: any[], key: string) => {
  const values = Array.from(new Set(rows.map((row) => String(row[key] ?? '').trim()).filter(Boolean)))
  if (!values.length) return ''
  return values.length === 1 ? values[0] : '(multiple)'
}
const analysisAddDays = (dateStr: string, days: number) => {
  const date = new Date(analysisNormalizeDate(dateStr))
  if (Number.isNaN(date.getTime())) return ''
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}
const syncAnalysisGroundDraft = () => {
  const key = analysisGroundKey.value
  const config = key ? analysisGroundConfigs[key] : null
  const first = analysisGroundRows.value[0] ? dataOf(analysisGroundRows.value[0]) : {}
  Object.keys(analysisGroundDraft).forEach((field) => delete analysisGroundDraft[field])
  if (!config) return
  ;[
    config.buField,
    config.personField,
    config.atField,
    config.dateField,
    config.afterField,
    'invoiceno',
    'invoicedate',
  ].forEach((field) => {
    analysisGroundDraft[field] = first[field] ?? ''
  })
}
const analysisGroundSelectionKey = computed(() => `${analysisGroundKey.value}:${analysisGroundRows.value.map((record) => record.id).join('|')}`)
watch(analysisGroundSelectionKey, () => {
  analysisGroundLocked.value = false
  syncAnalysisGroundDraft()
})
const analysisGroundPanel = computed(() => {
  const key = analysisGroundKey.value
  const config = key ? analysisGroundConfigs[key] : null
  const selected = analysisGroundRows.value.map((record) => dataOf(record))
  const empty = {
    visible: false,
    title: '',
    config: analysisGroundConfigs.paymentlist,
    debitNo: '',
    debitDate: '',
    amount: '',
    currency: '',
    party: '',
    nameCode: '',
    partyId: '',
    ownerBu: '',
  }
  if (!config || !selected.length) return empty
  const first = selected[0] || {}
  const currency = sameOrMultiple(selected, 'currency') || first.currency || 'USD'
  const total = selected.reduce((sum, row) => sum + analysisNumber(row.amount || row.totalamount || row.total), 0)
  return {
    visible: true,
    title: config.title,
    config,
    debitNo: sameOrMultiple(selected, 'debitno') || '-',
    debitDate: sameOrMultiple(selected, 'debitdate') || '-',
    amount: formatAnalysisMoney(total),
    currency,
    party: sameOrMultiple(selected, config.partyField) || '-',
    nameCode: sameOrMultiple(selected, 'namecode') || '-',
    partyId: sameOrMultiple(selected, 'id') || '-',
    ownerBu: sameOrMultiple(selected, 'bu') || sameOrMultiple(selected, 'ownerbu') || '-',
  }
})
const closeAnalysisGround = () => {
  state.selected.clear()
  analysisGroundLocked.value = false
  syncAnalysisGroundDraft()
}
const saveAnalysisGround = async () => {
  const key = analysisGroundKey.value
  const config = key ? analysisGroundConfigs[key] : null
  const selected = analysisGroundRows.value
  if (!config || !selected.length) return
  saving.value = true
  try {
    for (const record of selected) {
      const data = { ...dataOf(record) }
      ;[
        config.buField,
        config.personField,
        config.atField,
        config.dateField,
        config.afterField,
        'invoiceno',
        'invoicedate',
      ].forEach((field) => {
        data[field] = analysisGroundDraft[field] ?? ''
      })
      const after = Number(analysisGroundDraft[config.afterField] || 0)
      if (analysisGroundDraft.invoicedate && Number.isFinite(after)) {
        data[config.deadlineField] = analysisAddDays(analysisGroundDraft.invoicedate, after)
      }
      await apiFetch(`/records/${record.id}`, {
        method: 'PATCH',
        body: { country: record.country, page: record.page, kind: record.kind, data, sortOrder: record.sortOrder || 0 },
      })
    }
    await loadRecords()
    await loadAnalysisDashboardRecords()
    analysisGroundLocked.value = true
  } finally {
    saving.value = false
  }
}
const analysisSummaryTotals = computed(() => {
  const rows = analysisSummaryRows.value
  const clients = new Set<string>()
  const totals = { revenue: 0, cost: 0, margin: 0, volume: 0, cbm: 0, count: 0, clients: 0, cbmFcl: 0, cbmLcl: 0, cbmAir: 0 }
  rows.forEach((row: any) => {
    if (row.namecode) clients.add(row.namecode)
    totals.revenue += analysisNumber(row.revenue)
    totals.cost += analysisNumber(row.cost)
    totals.margin += analysisNumber(row.margin)
    totals.volume += analysisVolumeValue(row)
    totals.cbm += analysisNumber(row.cbm)
    totals.cbmFcl += analysisNumber(row.cbmFcl)
    totals.cbmLcl += analysisNumber(row.cbmLcl)
    totals.cbmAir += analysisNumber(row.cbmAir)
    totals.count += analysisNumber(row.count || 1)
  })
  totals.clients = clients.size
  return totals
})
const analysisFormatDisplayValue = (value: number, unit = analysisSummaryUnit.value) => {
  if (unit === 'client(s)' || unit === 'shipment(s)') return `${formatAnalysisMoney(value)} ${unit}`
  if (unit === 'CBM' || unit === 'KG' || unit === 'TEU') return `${formatAnalysisMoney(value)} ${unit}`
  return `${formatAnalysisMoney(value)} ${unit || ''}`.trim()
}
const analysisRatio = (a: number, b: number, suffix = '%') => b ? `${(a / b * 100).toFixed(1)}${suffix}` : `0.0${suffix}`
const analysisPerUnit = (a: number, b: number) => b ? (a / b).toFixed(2) : '0.00'
const analysisPerUnit3 = (a: number, b: number) => b ? (a / b).toFixed(3) : '0.000'
const analysisTotalCbm = (totals: any) => analysisNumber(totals.cbm) || analysisNumber(totals.cbmFcl) + analysisNumber(totals.cbmLcl) + analysisNumber(totals.cbmAir)
const analysisSummaryCards = computed(() => {
  const t = analysisSummaryTotals.value
  const totalCbm = analysisTotalCbm(t)
  if (analysisSummaryKind.value === 'client') return [{ label: 'TOTAL CLIENT', value: `${t.clients} client(s)` }]
  if (analysisSummaryKind.value === 'newclient') return [{ label: 'TOTAL NEWCLIENT', value: `${t.count} client(s)` }]
  if (state.analysisSub === 'total_cost') {
    return [
      { label: `TOTAL COST (${analysisSummaryUnit.value})`, value: analysisFormatDisplayValue(t.cost) },
      { label: 'COST/REVENUE', value: analysisRatio(t.cost, t.revenue) },
      { label: 'COST/MARGIN', value: analysisRatio(t.cost, t.margin) },
      { label: 'COST/VOLUME', value: analysisPerUnit(t.cost, totalCbm) },
    ]
  }
  if (state.analysisSub === 'total_margin') {
    return [
      { label: `TOTAL MARGIN (${analysisSummaryUnit.value})`, value: analysisFormatDisplayValue(t.margin) },
      { label: 'MARGIN/REVENUE', value: analysisRatio(t.margin, t.revenue) },
      { label: 'MARGIN/COST', value: analysisRatio(t.margin, t.cost) },
      { label: 'MARGIN/VOLUME', value: analysisPerUnit(t.margin, totalCbm) },
    ]
  }
  if (state.analysisSub === 'total_volume') {
    return [
      { label: `TOTAL ${analysisSummaryUnit.value === 'shipment(s)' ? 'SHIPMENTS' : analysisSummaryUnit.value.toUpperCase()}`, value: analysisFormatDisplayValue(t.volume) },
      { label: 'VOLUME/REVENUE', value: analysisPerUnit3(totalCbm, t.revenue) },
      { label: 'VOLUME/COST', value: analysisPerUnit3(totalCbm, t.cost) },
      { label: 'VOLUME/MARGIN', value: analysisPerUnit3(totalCbm, t.margin) },
    ]
  }
  return [
    { label: `TOTAL REVENUE (${analysisSummaryUnit.value})`, value: analysisFormatDisplayValue(t.revenue) },
    { label: 'REVENUE/COST', value: analysisRatio(t.revenue, t.cost) },
    { label: 'REVENUE/MARGIN', value: analysisRatio(t.revenue, t.margin) },
    { label: 'REVENUE/VOLUME', value: analysisPerUnit(t.revenue, totalCbm) },
  ]
})
const analysisMetricValueFor = (row: any, metric = analysisMetricKey.value) => {
  if (metric === 'cost') return analysisNumber(row.cost)
  if (metric === 'margin') return analysisNumber(row.margin)
  if (metric === 'volume') return analysisVolumeValue(row)
  if (metric === 'client' || metric === 'newclient') return analysisNumber(row.count || 1)
  return analysisNumber(row.revenue)
}
const analysisRankLists = (keyFn: (row: any) => string, metric: string, unit: string, distinctClients = false) => {
  const totals: Record<string, any> = {}
  analysisSummaryRows.value.forEach((row: any) => {
    const name = keyFn(row) || '(none)'
    if (!totals[name]) totals[name] = distinctClients ? new Set<string>() : 0
    if (distinctClients) {
      if (row.namecode) totals[name].add(row.namecode)
    } else {
      totals[name] += analysisMetricValueFor(row, metric)
    }
  })
  const ranked = Object.entries(totals)
    .map(([name, raw]: [string, any]) => {
      const value = raw instanceof Set ? raw.size : raw
      return { name, raw: value, value: analysisFormatDisplayValue(value, unit) }
    })
    .filter((item) => item.raw > 0)
    .sort((a, b) => b.raw - a.raw)
  return [
    { label: 'TOP 3', items: ranked.slice(0, 3) },
    { label: 'BOTTOM 3', items: [...ranked].reverse().slice(0, 3) },
  ]
}
const analysisDashboardRankSections = computed(() => {
  if (analysisSummaryKind.value === 'client') {
    return [
      { title: 'By Margin', kind: 'namecode', target: 'Margin', lists: analysisRankLists((row) => row.namecode, 'margin', analysisSummaryFilter.baseCur) },
      { title: 'By Revenue', kind: 'namecode', target: 'Revenue', lists: analysisRankLists((row) => row.namecode, 'revenue', analysisSummaryFilter.baseCur) },
      { title: 'By Cost', kind: 'namecode', target: 'Cost', lists: analysisRankLists((row) => row.namecode, 'cost', analysisSummaryFilter.baseCur) },
      { title: 'By Volume', kind: 'namecode', target: 'Volume', lists: analysisRankLists((row) => row.namecode, 'volume', 'CBM') },
      { title: 'By Sales', kind: 'sales', target: 'Revenue', lists: analysisRankLists((row) => row.sales, 'client', 'client(s)', true) },
      { title: 'By BU', kind: 'bu', target: 'Revenue', lists: analysisRankLists((row) => row.bu, 'client', 'client(s)', true) },
    ]
  }
  if (analysisSummaryKind.value === 'newclient') {
    return [
      { title: 'By Sales', kind: 'sales', target: 'NewClient', lists: analysisRankLists((row) => row.sales, 'newclient', 'client(s)') },
      { title: 'By BU', kind: 'bu', target: 'NewClient', lists: analysisRankLists((row) => row.bu, 'newclient', 'client(s)') },
    ]
  }
  const target = state.analysisSub === 'total_cost' ? 'Cost' : state.analysisSub === 'total_margin' ? 'Margin' : state.analysisSub === 'total_volume' ? 'Volume' : 'Revenue'
  const metric = analysisMetricKey.value === 'volume' ? 'volume' : target.toLowerCase()
  return [
    { title: 'By Customer', kind: 'namecode', target, lists: analysisRankLists((row) => row.namecode, metric, analysisSummaryUnit.value) },
    { title: 'By Sales', kind: 'sales', target, lists: analysisRankLists((row) => row.sales, metric, analysisSummaryUnit.value) },
    { title: 'By BU', kind: 'bu', target, lists: analysisRankLists((row) => row.bu, metric, analysisSummaryUnit.value) },
  ]
})
const analysisSelectedYears = computed(() => {
  const selected = analysisSummaryFilter.years.filter((year) => analysisYearsAvailable.value.includes(Number(year))).map(Number)
  return selected.length ? selected : analysisYearsAvailable.value.slice(-5)
})
const analysisChartColor = (year: number) => ({ 2022: '#2e7d32', 2023: '#1976d2', 2024: '#e67e22', 2025: '#8e24aa', 2026: '#c0392b' } as Record<number, string>)[year] || '#009688'
const analysisChartSeries = computed(() => analysisSummaryFilter.compareBy === 'year' ? ['Total'] : analysisSelectedYears.value.map(String))
const analysisChartGroups = computed(() => {
  const compare = analysisSummaryFilter.compareBy
  const years = analysisSelectedYears.value
  const labels = compare === 'quarter'
    ? ['Q1', 'Q2', 'Q3', 'Q4']
    : compare === 'year'
      ? years.map(String)
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const distinctClientMode = analysisSummaryKind.value === 'client'
  const bucketValue = (row: any) => analysisMetricValueFor(row)
  const totals: Record<string, Record<string, number | Set<string>>> = {}
  labels.forEach((label) => { totals[label] = {} })
  analysisSummaryRows.value.forEach((row: any) => {
    const date = analysisRowDate(row)
    const year = Number(date.slice(0, 4))
    const month = Number(date.slice(5, 7))
    if (!year || !month || !years.includes(year)) return
    const label = compare === 'quarter' ? `Q${Math.ceil(month / 3)}` : compare === 'year' ? String(year) : labels[month - 1]
    const series = compare === 'year' ? 'Total' : String(year)
    if (distinctClientMode) {
      if (!(totals[label][series] instanceof Set)) totals[label][series] = new Set<string>()
      if (row.namecode) (totals[label][series] as Set<string>).add(row.namecode)
    } else {
      totals[label][series] = Number(totals[label][series] || 0) + bucketValue(row)
    }
  })
  const valueOf = (raw: number | Set<string> | undefined) => raw instanceof Set ? raw.size : Number(raw || 0)
  const max = Math.max(1, ...labels.flatMap((label) => Object.values(totals[label]).map(valueOf)))
  return labels.map((label) => ({
    label,
    bars: analysisChartSeries.value.map((series) => {
      const value = valueOf(totals[label][series])
      return { series, value, height: Math.max(2, value / max * 100) }
    }),
  }))
})
const destroyAnalysisBarChart = () => {
  if (analysisBarChart) {
    try {
      analysisBarChart.destroy()
    } catch (error) {
      console.warn(error)
    }
    analysisBarChart = null
  }
  if (analysisPieChart1) {
    try {
      analysisPieChart1.destroy()
    } catch (error) {
      console.warn(error)
    }
    analysisPieChart1 = null
  }
  if (analysisPieChart2) {
    try {
      analysisPieChart2.destroy()
    } catch (error) {
      console.warn(error)
    }
    analysisPieChart2 = null
  }
}
const renderAnalysisBarChart = async () => {
  const token = ++analysisBarChartToken
  await nextTick()
  if (!process.client || !isAnalysisDashboard.value || !analysisBarCanvas.value) {
    destroyAnalysisBarChart()
    return
  }
  const groups = analysisChartGroups.value
  const series = analysisChartSeries.value
  if (!groups.length || !series.length) {
    destroyAnalysisBarChart()
    return
  }
  const chartModule = await import('chart.js/auto')
  if (token !== analysisBarChartToken || !analysisBarCanvas.value) return
  const Chart = chartModule.default
  destroyAnalysisBarChart()
  const datasets = series.map((name) => ({
    label: name,
    data: groups.map((group) => group.bars.find((bar) => String(bar.series) === String(name))?.value || 0),
    backgroundColor: analysisSummaryFilter.compareBy === 'year'
      ? '#2e7d32'
      : analysisChartColor(Number(name) || 0),
    borderRadius: 5,
    borderSkipped: false,
    maxBarThickness: 36,
    categoryPercentage: 0.72,
    barPercentage: 0.82,
  }))
  analysisBarChart = new Chart(analysisBarCanvas.value, {
    type: 'bar',
    data: {
      labels: groups.map((group) => group.label),
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      layout: {
        padding: { top: 4, right: 8, bottom: 0, left: 4 },
      },
      plugins: {
        legend: {
          display: series.length > 1,
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'rectRounded',
            boxWidth: 10,
            boxHeight: 10,
            padding: 16,
            color: '#355041',
            font: { size: 11, weight: 600 },
          },
        },
        title: {
          display: true,
          text: `${analysisSummaryTitle.value} growth`,
          color: '#15532f',
          padding: { top: 2, bottom: 14 },
          font: { size: 14, weight: 700 },
        },
        tooltip: {
          backgroundColor: '#16241c',
          cornerRadius: 8,
          padding: 10,
          callbacks: {
            label: (context: any) => `${context.dataset.label}: ${analysisFormatDisplayValue(Number(context.raw || 0), analysisSummaryUnit.value)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { color: '#c4e6d1' },
          ticks: {
            autoSkip: true,
            color: '#5d7567',
            font: { size: 11 },
            maxRotation: 0,
            minRotation: 0,
            padding: 6,
          },
        },
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: 'rgba(196, 230, 209, .65)' },
          ticks: {
            color: '#5d7567',
            font: { size: 11 },
            padding: 8,
          },
        },
      },
    },
  })
  const pieCards = analysisPieCards.value
  const slicePalette = ['#2e7d32', '#1976d2', '#e67e22', '#8e24aa', '#c0392b', '#009688', '#94a3a8']
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    animation: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        analysisUnit: pieCards[0]?.unit || '',
        callbacks: {
          label: (context: any) => `${context.label}: ${analysisFormatDisplayValue(Number(context.raw || 0), context.chart.options.plugins.tooltip.analysisUnit)}`,
        },
      },
    },
  } as any
  if (analysisPieCanvas1.value && pieCards[0]) {
    analysisPieChart1 = new Chart(analysisPieCanvas1.value, {
      type: 'pie',
      data: {
        labels: pieCards[0].slices.map((slice) => slice.label),
        datasets: [{ data: pieCards[0].slices.map((slice) => slice.value), backgroundColor: slicePalette }],
      },
      options: { ...pieOptions, plugins: { ...pieOptions.plugins, tooltip: { ...pieOptions.plugins.tooltip, analysisUnit: pieCards[0].unit } } },
    })
  }
  if (analysisPieCanvas2.value && pieCards[1]) {
    analysisPieChart2 = new Chart(analysisPieCanvas2.value, {
      type: 'pie',
      data: {
        labels: pieCards[1].slices.map((slice) => slice.label),
        datasets: [{ data: pieCards[1].slices.map((slice) => slice.value), backgroundColor: slicePalette }],
      },
      options: { ...pieOptions, plugins: { ...pieOptions.plugins, tooltip: { ...pieOptions.plugins.tooltip, analysisUnit: pieCards[1].unit } } },
    })
  }
}
const analysisPieColors = ['#2e7d32', '#1976d2', '#e67e22', '#8e24aa', '#c0392b', '#009688', '#94a3a8']
const analysisPieCard = (title: string, data: Array<{ label: string, value: number }>, unit: string) => {
  const clean = data.filter((item) => item.value > 0)
  const total = clean.reduce((sum, item) => sum + item.value, 0) || 1
  let cursor = 0
  const slices = clean.map((item, index) => {
    const start = cursor
    const end = cursor + item.value / total * 100
    cursor = end
    return { ...item, color: analysisPieColors[index % analysisPieColors.length], start, end }
  })
  const gradient = slices.length
    ? `conic-gradient(${slices.map((slice) => `${slice.color} ${slice.start}% ${slice.end}%`).join(', ')})`
    : '#eef6f1'
  return { title, slices, gradient, unit }
}
const analysisPieCards = computed(() => {
  const t = analysisSummaryTotals.value
  const byKey = (key: string, metric: string) => {
    const totals: Record<string, number> = {}
    analysisSummaryRows.value.forEach((row: any) => {
      const name = row[key] || '(none)'
      totals[name] = (totals[name] || 0) + analysisMetricValueFor(row, metric)
    })
    const ranked = Object.entries(totals).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
    const top = ranked.slice(0, 5)
    const other = ranked.slice(5).reduce((sum, item) => sum + item.value, 0)
    if (other) top.push({ label: 'Others', value: other })
    return top
  }
  const byDistinctClientKey = (key: string) => {
    const totals: Record<string, Set<string>> = {}
    analysisSummaryRows.value.forEach((row: any) => {
      const name = row[key] || '(none)'
      if (!totals[name]) totals[name] = new Set<string>()
      if (row.namecode) totals[name].add(row.namecode)
    })
    const ranked = Object.entries(totals)
      .map(([label, set]) => ({ label, value: set.size }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
    const top = ranked.slice(0, 5)
    const other = ranked.slice(5).reduce((sum, item) => sum + item.value, 0)
    if (other) top.push({ label: 'Others', value: other })
    return top
  }
  if (analysisSummaryKind.value === 'volume') {
    return [
      analysisPieCard('Volume by Mode (FCL/LCL/AIR)', [
        { label: 'FCL', value: t.cbmFcl },
        { label: 'LCL', value: t.cbmLcl },
        { label: 'AIR', value: t.cbmAir },
      ], 'CBM'),
      analysisPieCard('Volume by Customer', byKey('namecode', 'volume'), analysisSummaryUnit.value),
    ]
  }
  if (analysisSummaryKind.value === 'client') {
    return [
      analysisPieCard('Clients by Sales', byDistinctClientKey('sales'), 'client(s)'),
      analysisPieCard('Clients by BU', byDistinctClientKey('bu'), 'client(s)'),
    ]
  }
  if (analysisSummaryKind.value === 'newclient') {
    return [
      analysisPieCard('New Clients by Sales', byKey('sales', 'newclient'), 'client(s)'),
      analysisPieCard('New Clients by BU', byKey('bu', 'newclient'), 'client(s)'),
    ]
  }
  if (state.analysisSub === 'total_cost') return [
    analysisPieCard('Cost / Revenue', [{ label: 'Cost', value: t.cost }, { label: 'Revenue', value: t.revenue }], analysisSummaryUnit.value),
    analysisPieCard('Cost / Margin', [{ label: 'Cost', value: t.cost }, { label: 'Margin', value: t.margin }], analysisSummaryUnit.value),
  ]
  if (state.analysisSub === 'total_margin') return [
    analysisPieCard('Margin / Revenue', [{ label: 'Margin', value: t.margin }, { label: 'Revenue', value: t.revenue }], analysisSummaryUnit.value),
    analysisPieCard('Margin / Cost', [{ label: 'Margin', value: t.margin }, { label: 'Cost', value: t.cost }], analysisSummaryUnit.value),
  ]
  return [
    analysisPieCard('Revenue / Cost', [{ label: 'Revenue', value: t.revenue }, { label: 'Cost', value: t.cost }], analysisSummaryUnit.value),
    analysisPieCard('Revenue / Margin', [{ label: 'Revenue', value: t.revenue }, { label: 'Margin', value: t.margin }], analysisSummaryUnit.value),
  ]
})
const analysisDashboardPrimaryCard = computed(() => analysisSummaryCards.value[0] || { label: analysisSummaryTitle.value, value: analysisSummaryUnit.value })
const analysisChartMonths = computed(() => analysisChartGroups.value.map((group) => ({ month: group.label, bars: group.bars })))
const exportAnalysisSummaryCsv = () => {
  const rows = analysisSummaryRows.value
  if (!rows.length) {
    notifyAdmin('Nothing to export.', 'Export')
    return
  }
  const columns = analysisSummaryKind.value === 'client' || analysisSummaryKind.value === 'newclient'
    ? [
        { key: 'etd', label: 'Date' },
        { key: 'namecode', label: 'Client' },
        { key: 'sales', label: 'Sales' },
        { key: 'bu', label: 'BU' },
        { key: 'count', label: analysisSummaryKind.value === 'newclient' ? 'New Client' : 'Client' },
      ]
    : analysisSummaryKind.value === 'volume'
      ? [
          { key: 'etd', label: 'Date' },
          { key: 'namecode', label: 'Client' },
          { key: 'sales', label: 'Sales' },
          { key: 'bu', label: 'BU' },
          { key: 'volume', label: analysisSummaryFilter.volMetric.toUpperCase() },
        ]
      : [
          { key: 'etd', label: 'Date' },
          { key: 'namecode', label: 'Client' },
          { key: 'sales', label: 'Sales' },
          { key: 'bu', label: 'BU' },
          { key: 'revenue', label: 'Revenue' },
          { key: 'cost', label: 'Cost' },
          { key: 'margin', label: 'Margin' },
        ]
  const lines = [
    ['Summary', analysisSummaryTitle.value].map(csvCell).join(','),
    ['Metric', analysisSummaryKind.value].map(csvCell).join(','),
    ['Value', analysisSummaryUnit.value].map(csvCell).join(','),
    '',
    columns.map((column) => csvCell(column.label)).join(','),
    ...rows.map((row: any) => columns.map((column) => {
      if (column.key === 'volume') return csvCell(analysisVolumeValue(row))
      if (column.key === 'count') return csvCell(analysisSummaryKind.value === 'newclient' ? (row.count || 1) : (row.count || 1))
      if (column.key === 'revenue') return csvCell(analysisNumber(row.revenue))
      if (column.key === 'cost') return csvCell(analysisNumber(row.cost))
      if (column.key === 'margin') return csvCell(analysisNumber(row.margin))
      if (column.key === 'etd') return csvCell(analysisRowDate(row))
      return csvCell(row[column.key] ?? '')
    }).join(',')),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `SHOPTRANS_analysis_${state.analysisSub || 'summary'}_export.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
const legalChecklistData = [
  { sec: '01', title: 'Check Invoice', hint: 'Xin hình ảnh hàng & tem nhãn để đối chiếu:', items: [
    { no: '001', title: 'Tên shipper / seller', note: 'check trên web thuế' },
    { no: '002', title: 'Địa chỉ shipper / seller', note: 'check trên web thuế' },
    { no: '003', title: 'Không phải chữ "Proforma Invoice"' },
    { no: '004', title: 'Tên cnee / buyer', note: 'check trên web thuế' },
    { no: '005', title: 'Địa chỉ mới cnee / buyer', note: 'check trên web thuế' },
    { no: '006', title: 'Số hóa đơn' },
    { no: '007', title: 'Ngày hóa đơn' },
    { no: '008', title: 'Điều kiện Incoterm', note: 'Điều kiện mặc định: Xuất FOB, nhập CIF hoặc CFR. Nếu là các điều kiện khác thì phải tách trị giá ra sao cho thể hiện rõ trị giá FOB (hàng xuất), CIF/CFR (hàng nhập) là bao nhiêu.' },
    { no: '009', title: 'Phương thức thanh toán: LC / TT' },
    { no: '010', title: 'Tuyến đường vận tải' },
    { no: '011', title: 'Tên hàng giống hệt tem nhãn', note: 'Không sai dù 1 ký tự.' },
    { no: '012', title: 'Đơn vị tính' },
    { no: '013', title: 'Tính lại tổng số lượng' },
    { no: '014', title: 'Tính lại tổng trị giá' },
    { no: '015', title: 'Phải có mộc của seller' },
  ] },
  { sec: '02', title: 'Check Vận đơn / Bill', hint: 'Đối chiếu MBL & HBL (hoặc chỉ MBL) với INV, PKL, SC, C/O:', items: [
    { no: '016', title: 'Tên shipper / seller' },
    { no: '017', title: 'Địa chỉ shipper / seller' },
    { no: '018', title: 'Tên cnee / buyer' },
    { no: '019', title: 'Địa chỉ mới cnee / buyer' },
    { no: '020', title: 'Mã số thuế cnee' },
    { no: '021', title: 'Số vận đơn' },
    { no: '022', title: 'POL / POD' },
    { no: '023', title: 'Shipping marks' },
    { no: '024', title: 'Tên hàng giống hệt INV, PKL, SC, C/O & tên trên nhãn mác' },
    { no: '025', title: 'Số lượng & trọng lượng giống hệt INV, PKL, SC, C/O' },
    { no: '026', title: 'Số cont / seal' },
    { no: '027', title: 'Phải có ngày tàu chạy (ON BOARD)' },
    { no: '028', title: 'Loại Bill: ORIGIN / TELEX / SEA WAY' },
  ] },
  { sec: '03', title: 'Check C/O', hint: 'Lấy Invoice ra đối chiếu C/O:', items: [
    { no: '029', title: 'Ô 1, 2', note: 'Tên & địa chỉ shipper / cnee y hệt Invoice' },
    { no: '030', title: 'Ô 3', note: 'Thông tin vận chuyển — giống hệt vận đơn' },
    { no: '031', title: 'Ô 7', note: 'Mô tả hàng — giống hệt Invoice' },
    { no: '032', title: 'Ô 9', note: 'Đề xuất khách hàng thể hiện đơn vị Gross Weight' },
    { no: '033', title: 'Ô 10', note: 'Số & ngày giống hệt Invoice' },
    { no: '034', title: 'Ô 11', note: 'Ký & đóng mộc nhà xuất khẩu' },
    { no: '035', title: 'Ô 12', note: 'Ký & đóng mộc đơn vị cấp C/O' },
    { no: '036', title: 'Ô 13', note: 'Tick ô 1 nếu C/O ký sau 3 ngày tàu chạy' },
    { no: '037', title: 'Ô 1', note: 'Thông tin exporter (khác seller trên Invoice)', groupLabel: 'Lô hàng 3 bên (exporter · seller · buyer)' },
    { no: '038', title: 'Ô 2', note: 'Tên & địa chỉ Importer (lấy trên web thuế)' },
    { no: '039', title: 'Ô 7', note: 'Thêm dòng THIRD PARTY INVOICING / OPERATOR + tên & địa chỉ seller giống Invoice' },
    { no: '040', title: 'Ô 13', note: 'Tick ô cuối (third party invoicing)' },
    { no: '041', title: 'Các ô khác', note: 'Như lô hàng 2 bên' },
  ] },
  { sec: '04', title: 'Bộ chứng từ cần có', hint: 'Hồ sơ nộp Hải quan:', items: [
    { no: '042', title: 'INVOICE' },
    { no: '043', title: 'PACKING LIST' },
    { no: '044', title: 'BILL OF LADING' },
    { no: '045', title: 'ARRIVAL NOTICE (AN)' },
    { no: '046', title: 'C/O (nếu có)' },
  ] },
  { sec: '05', title: 'Check Nhãn mác hàng hóa', items: [
    { no: '047', title: 'Tên nhà sản xuất' },
    { no: '048', title: 'Địa chỉ nhà sản xuất' },
    { no: '049', title: 'Tên hàng khớp B/L, INV, PKL, C/O' },
    { no: '050', title: 'Máy móc' },
    { no: '051', title: 'Thông số kỹ thuật cơ bản' },
    { no: '052', title: 'Xuất xứ hàng hóa: bắt buộc phải có MADE IN / PRODUCT OF / ORIGIN OF…' },
  ] },
]
const legalChecklistState = reactive<Record<string, boolean>>({})
const legalChecklistCollapsed = reactive<Record<string, boolean>>({})
const legalChecklistRecordId = ref('')
const legalChecklistColumns = computed(() => [
  legalChecklistData.filter((section) => section.sec === '01' || section.sec === '02'),
  legalChecklistData.filter((section) => section.sec !== '01' && section.sec !== '02'),
])
const legalChecklistTotal = computed(() => legalChecklistData.reduce((total, section) => total + section.items.length, 0))
const legalChecklistCheckedCount = computed(() => Object.values(legalChecklistState).filter(Boolean).length)
const legalChecklistDone = (section: any) => section.items.filter((item: any) => legalChecklistState[item.no]).length
const isLegalChecklist = computed(() => currentPage.value.kind === 'customs-legal' && state.legalTab === 'docs_checklist')
const isAnalysisDashboard = computed(() => currentPage.value.kind === 'analysis-statistics' && state.analysisTop === 'Summary')
const isSpecialSheetContent = computed(() => isLegalChecklist.value || isAnalysisDashboard.value || (currentPage.value.kind === 'sales-marketing' && state.smTop === 'MassSales'))
watch(
  () => [
    isAnalysisDashboard.value,
    state.analysisSub,
    analysisSummaryTitle.value,
    analysisSummaryUnit.value,
    analysisSummaryKind.value,
    analysisSummaryFilter.compareBy,
    analysisSummaryFilter.clientMode,
    analysisSummaryFilter.client,
    analysisSummaryFilter.sales,
    analysisSummaryFilter.bu,
    analysisSummaryFilter.baseCur,
    analysisSummaryFilter.volType,
    analysisSummaryFilter.volMetric,
    analysisSummaryFilter.from,
    analysisSummaryFilter.to,
    analysisSelectedYears.value.join('|'),
    JSON.stringify(analysisChartGroups.value.map((group) => [group.label, group.bars.map((bar) => [bar.series, bar.value])])),
  ],
  () => { renderAnalysisBarChart() },
  { immediate: true, flush: 'post' },
)
const legalChecklistEventChecked = (event: Event) => Boolean((event.target as HTMLInputElement | null)?.checked)
const resetLegalChecklistState = () => {
  Object.keys(legalChecklistState).forEach((key) => delete legalChecklistState[key])
}
const syncLegalChecklistFromRecords = () => {
  resetLegalChecklistState()
  const record = records.value.find((item) => dataOf(item).type === 'docs_checklist_state') || records.value[0]
  legalChecklistRecordId.value = record?.id || ''
  const checked = record?.data?.checked && typeof record.data.checked === 'object' ? record.data.checked : {}
  Object.entries(checked).forEach(([key, value]) => {
    legalChecklistState[key] = Boolean(value)
  })
}
const saveLegalChecklistState = async () => {
  const checked = Object.fromEntries(Object.entries(legalChecklistState).filter(([, value]) => Boolean(value)))
  const body = {
    country: 'GLOBAL',
    page: 'legal_docs_checklist',
    kind: 'customs-legal',
    data: {
      type: 'docs_checklist_state',
      tab: 'docs_checklist',
      table: 'Docs Checklist',
      checked,
      status: 'Active',
    },
    sortOrder: 1,
  }
  const result = legalChecklistRecordId.value
    ? await apiFetch(`/records/${legalChecklistRecordId.value}`, { method: 'PATCH', body })
    : await apiFetch('/records', { method: 'POST', body })
  legalChecklistRecordId.value = result?.id || legalChecklistRecordId.value
}
const toggleLegalChecklistItem = async (no: string, checked: boolean) => {
  legalChecklistState[no] = checked
  try {
    await saveLegalChecklistState()
  } catch (error: any) {
    console.error('Could not save customs checklist state', error)
    await notifyAdmin(error?.data?.message || error?.message || 'Could not save checklist state.')
  }
}
const toggleLegalChecklistSection = (sec: string) => {
  legalChecklistCollapsed[sec] = !legalChecklistCollapsed[sec]
}
const traderColumns = computed(() => {
  const tab = activeTraderTab.value
  if (tab.custom) return [
    ...(tab.columns || []),
    ...salesStatusNotesFields(),
  ]
  const columns: any[] = [
    salesField('recdate', 'Date', 130, { kind: 'date' }),
    salesField('id', 'ID', 140, { kind: 'id', readonly: true }),
    salesField('namecode', 'NameCode', 112),
  ]
  if (tab.dep) {
    columns.push(salesField('role', 'Role', 130, { kind: 'roles', opts: tab.roleOpts }))
    columns.push(salesField('gsd', 'GSD', 150, { kind: 'gsdstaff' }))
  }
  columns.push(
    salesField('company', 'Company Name', 180),
    salesField('taxid', 'Tax ID', 130),
  )
  if (tab.drivers) columns.push(salesField('drivers', 'Drivers', 120, { kind: 'driverlist', optional: true }))
  columns.push(
    salesField('address', 'Address', 200),
    salesField('city', 'City / Province', 160, { kind: 'list' }),
    salesField('country', 'Country', 140, { kind: 'list' }),
    salesField('pic', 'PIC Name', 140),
    salesField('email', 'Email', 190, { kind: 'email' }),
    salesField('phone', 'Phone', 130),
    salesField('status', 'Status', 112, { kind: 'select', opts: ['Active', 'Inactive'] }),
    salesField('fulldetail', 'FullDetail', 105, { kind: 'fulldetail', readonly: true, optional: true }),
    salesField('notes', 'Notes', 200),
  )
  return columns
})
const activeSalesFeeTabs = computed(() => state.smTop === 'MassSales' ? [] : (salesFeeTabs[state.smTop]?.[state.smMode] || []))
const activeSalesTable = computed<any>(() => {
  if (currentPage.value.kind === 'traders-suppliers') return { ...activeTraderTab.value, columns: traderColumns.value }
  if (currentPage.value.kind === 'reference-data') return { ...activeReferenceTab.value, columns: referenceColumns.value }
  if (currentPage.value.kind === 'customs-legal') return { ...activeLegalTab.value, columns: legalColumns.value }
  if (currentPage.value.kind === 'internal-directory') return { ...activeInternalTab.value, columns: internalColumns.value }
  if (currentPage.value.kind === 'quality-control') return activeQualityTab.value
  if (currentPage.value.kind === 'analysis-statistics') return activeAnalysisTable.value
  if (state.smTop === 'MassSales') return null
  return activeSalesFeeTabs.value.find((tab) => tab.id === state.smSub) || activeSalesFeeTabs.value[0] || null
})
const activeSalesTableLabel = computed(() => activeSalesTable.value?.label || 'MassSales')
const isAnalysisSelectableTable = computed(() => currentPage.value.kind === 'analysis-statistics' && state.analysisTop !== 'Summary')
const isAnalysisSelectionSummaryTable = computed(() => currentPage.value.kind === 'analysis-statistics' && ['Revenue', 'Cost', 'Margin', 'Volume'].includes(state.analysisTop))
const rowSelectionDisabled = computed(() => Boolean(activeSalesTable.value?.readOnly && !isAnalysisSelectableTable.value))
const parseAnalysisDate = (value: any) => {
  const raw = String(value || '').trim()
  if (!raw) return null
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return null
  parsed.setHours(0, 0, 0, 0)
  return parsed
}
const isAnalysisApprovalWarningRow = (record: AdminRecord) => {
  if (currentPage.value.kind !== 'analysis-statistics' || state.analysisTop !== 'ApprovalList') return false
  const tab = activeAnalysisTable.value?.id
  const row = dataOf(record)
  const deadline = tab === 'paymentlist' ? row.paymentdeadline : (tab === 'collectionlist' ? row.collectiondeadline : '')
  if (!deadline) return false
  const completedDate = tab === 'paymentlist' ? row.paiddate : row.receiveddate
  const deadlineDate = parseAnalysisDate(deadline)
  const referenceDate = parseAnalysisDate(completedDate) || (() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })()
  if (!deadlineDate) return false
  return deadlineDate < referenceDate
}
const analysisSelectionGroupKeys = computed(() => {
  if (currentPage.value.kind !== 'analysis-statistics') return [] as string[]
  const tableId = activeAnalysisTable.value?.id
  if (state.analysisTop === 'Revenue') return ['currency', 'payer', 'payerid', 'namecode']
  if (state.analysisTop === 'Cost') return ['currency', 'receiver', 'receiverid', 'namecode']
  if (state.analysisTop === 'Margin') return ['currency']
  if (tableId === 'paymentlist') return ['currency', 'clientcode']
  if (tableId === 'collectionlist') return ['currency', 'clientcode']
  return [] as string[]
})
const selectionKeyValue = (record: AdminRecord, key: string) => String(dataOf(record)[key] ?? '').trim()
const sameAnalysisSelectionGroup = (base: AdminRecord, candidate: AdminRecord, keys: string[]) => keys.every((key) => selectionKeyValue(base, key) === selectionKeyValue(candidate, key))
const showAdminToast = (message: string) => {
  adminToast.message = message
  adminToast.open = true
  if (adminToastTimer) clearTimeout(adminToastTimer)
  adminToastTimer = setTimeout(() => {
    adminToast.open = false
  }, 2800)
}
const selectedRecordList = () => records.value.filter((record) => state.selected.has(record.id))
const canAddSelectedRecord = (record: AdminRecord, showMessage = true) => {
  const keys = analysisSelectionGroupKeys.value
  if (!keys.length) return true
  const selected = selectedRecordList()
  if (!selected.length) return true
  const ref = selected[0]
  if (sameAnalysisSelectionGroup(ref, record, keys)) return true
  const mismatch = keys.filter((key) => selectionKeyValue(ref, key) !== selectionKeyValue(record, key))
  if (showMessage) showAdminToast(`Cannot mix rows with different ${mismatch.join('/')} - selected rows must share the same ${keys.join('/')}`)
  return false
}
const salesRowClass = (record: AdminRecord) => ({
  sel: state.selected.has(record.id),
  'sm-editing': smEditId.value === record.id,
  'analysis-warning-row': isAnalysisApprovalWarningRow(record),
})
const activeSalesPageId = computed(() => {
  if (currentPage.value.kind === 'traders-suppliers') return `traders_${activeTraderTab.value.id}`
  if (currentPage.value.kind === 'reference-data') return `ref_${activeReferenceTab.value.id}`
  if (currentPage.value.kind === 'customs-legal') return `legal_${activeLegalTab.value.id}`
  if (currentPage.value.kind === 'internal-directory') return activeInternalTab.value.id === 'haulage' ? `internal_haulage_${state.haulageMode}` : `internal_${activeInternalTab.value.id}`
  if (currentPage.value.kind === 'quality-control') return `quality_${activeQualityTab.value.id}`
  if (currentPage.value.kind === 'analysis-statistics') return `analysis_${activeAnalysisTable.value.id}`
  if (state.smTop === 'MassSales') return ''
  return `sm_${activeSalesTable.value.id}`
})
const hasSalesStatusColumn = computed(() => tableColumns.value.some((column: any) => column.key === 'status'))
const showSheetStatusFilter = computed(() => hasSalesStatusColumn.value && currentPage.value.kind !== 'sales-marketing')
const salesFilterableColumns = computed(() => tableColumns.value.filter((column: any) => column.kind !== 'order'
  && column.kind !== 'id'
  && (column.kind !== 'computed' || (isSalesFeeGrid.value && column.kind === 'computed' && column.key.endsWith('_mgn')))))
const salesFilterColumn = (key: string) => salesFilterableColumns.value.find((column: any) => column.key === key)
const activeSalesAdvFilters = computed(() => smAdvFilters.filter((filter) => {
  if (filter.op === 'empty' || filter.op === 'notempty') return true
  if (filter.op === 'between') return !!(filter.value || filter.valueTo)
  return !!filter.value
}))
const salesHasFilter = computed(() => !!state.search || (showSheetStatusFilter.value && state.smStatus !== 'Active') || activeSalesAdvFilters.value.length > 0)
const resetSalesDraft = () => {
  Object.keys(smDraft).forEach((key) => delete smDraft[key])
  Object.keys(smEditDraft).forEach((key) => delete smEditDraft[key])
  smListPicker.key = ''
  smListPicker.index = 0
  smListDraftMode.value = 'add'
  smAdding.value = false
  smEditId.value = ''
}
const resetSalesViewState = () => {
  resetSalesDraft()
  state.search = ''
  state.smSearchField = 'all'
  state.pageIndex = 0
  state.selected.clear()
  state.smExportOpen = false
  state.smFilterOpen = false
  smFilterCollapsed.value = false
  smAdvFilters.splice(0)
  records.value = []
  loading.value = true
}
watch(
  () => [
    state.page,
    state.traderTab,
    state.refTab,
    state.legalTab,
    state.internalTab,
    state.haulageMode,
    state.qcTab,
    state.analysisTop,
    state.analysisTab,
    state.smTop,
    state.smMode,
    state.smSub,
  ],
  () => {
    resetSalesDraft()
    state.selected.clear()
    smLedgeTick.value++
  },
)
const setSalesTop = async (tab: string) => {
  const preferredLabel = activeSalesTable.value?.label || lastSalesFeeLabel.value
  if (activeSalesTable.value?.label) lastSalesFeeLabel.value = activeSalesTableLabel.value
  resetSalesViewState()
  state.smTop = tab
  state.smSub = findSalesFeeTabId(tab, state.smMode, preferredLabel)
  if (tab === 'MassSales') {
    loading.value = false
    return
  }
  lastSalesFeeLabel.value = activeSalesTable.value?.label || preferredLabel
  await loadRecords()
}
const setSalesMode = async (mode: string) => {
  const preferredLabel = activeSalesTable.value?.label || lastSalesFeeLabel.value
  state.smMode = mode
  state.smSub = findSalesFeeTabId(state.smTop, mode, preferredLabel)
  lastSalesFeeLabel.value = activeSalesTable.value?.label || preferredLabel
  resetSalesViewState()
  await loadRecords()
}
const setSalesSub = async (id: string) => {
  resetSalesViewState()
  state.smSub = id
  lastSalesFeeLabel.value = activeSalesTable.value?.label || lastSalesFeeLabel.value
  await loadRecords()
}
const setTraderTab = async (id: string) => {
  if (state.traderTab === id) return
  if (id === 'traders') await loadHaulageLookups()
  resetSalesViewState()
  state.traderTab = id
  state.smStatus = 'Active'
  await loadRecords()
}
const setReferenceTab = async (id: string) => {
  if (state.refTab === id) return
  resetSalesViewState()
  state.refTab = id
  state.smStatus = 'Active'
  await loadRecords()
}
const setLegalTab = async (id: string) => {
  if (state.legalTab === id) return
  resetSalesViewState()
  state.legalTab = id
  state.smStatus = 'Active'
  await loadRecords()
}
const setInternalTab = async (id: string) => {
  if (state.internalTab === id) return
  resetSalesViewState()
  state.internalTab = id
  state.smStatus = 'Active'
  if (id === 'haulage') await loadHaulageLookups()
  await loadRecords()
}
const firstAnalysisSubFor = (top: string) => {
  if (top === 'Summary') return analysisSummaryTabs[0].id
  if (top === 'Volume') return analysisVolumeTabs[0].id
  if (top === 'ApprovalList') return analysisApprovalTabs[0].id
  return ''
}
const setAnalysisTop = async (top: string) => {
  if (state.analysisTop === top) return
  resetSalesViewState()
  state.analysisTop = top
  state.analysisSub = firstAnalysisSubFor(top)
  state.smStatus = 'Active'
  await loadRecords()
}
const setAnalysisSub = async (id: string) => {
  if (state.analysisSub === id) return
  resetSalesViewState()
  state.analysisSub = id
  state.smStatus = 'Active'
  await loadRecords()
}
const openAnalysisRankLink = async (kind: string, value: string, targetTop = '') => {
  const top = targetTop || (analysisMetricKey.value === 'cost'
    ? 'Cost'
    : analysisMetricKey.value === 'margin'
      ? 'Margin'
      : analysisMetricKey.value === 'volume'
        ? 'Volume'
        : analysisMetricKey.value === 'client'
          ? 'NewClient'
          : 'Revenue')
  resetSalesViewState()
  state.analysisTop = top
  state.analysisSub = firstAnalysisSubFor(top)
  state.smSearchField = kind === 'sales'
    ? 'sales'
    : kind === 'bu'
      ? 'bu'
      : kind === 'namecode'
        ? 'namecode'
        : 'all'
  state.search = value
  state.smStatus = 'Active'
  await loadRecords()
}
const salesCellPlaceholder = (column: any) => column.placeholder || (isInternalHaulage.value && column.kind === 'money2'
  ? '0.00'
  : isInternalHaulage.value && column.kind === 'number'
    ? '0'
    : column.kind === 'id' || column.kind === 'computed'
      ? 'auto'
      : ['city', 'country'].includes(column.key) || column.kind === 'list'
        ? 'Type to select'
        : '')
const mgnView = (source: Record<string, any>, key: string) => {
  const empty = { empty: true, value: '', pctText: '', neg: false }
  if (!key.endsWith('_mgn')) return empty
  const base = key.slice(0, -4)
  const costRaw = String(source?.[base + '_cost'] ?? '').replace(/,/g, '')
  const sellRaw = String(source?.[base + '_sell'] ?? '').replace(/,/g, '')
  if (costRaw === '' && sellRaw === '') return empty
  const margin = (parseFloat(sellRaw) || 0) - (parseFloat(costRaw) || 0)
  const cost = parseFloat(costRaw) || 0
  const pct = margin !== 0 && cost > 0 ? Math.round((margin / cost) * 1000) / 10 : null
  return { empty: false, value: String(Math.round(margin * 100) / 100), pctText: pct != null ? (pct > 0 ? '+' : '') + pct + '%' : '', neg: margin < 0 }
}
const formatSalesNumberInput = (key: string, event: FocusEvent, mode: 'add' | 'edit') => {
  const column = tableColumns.value.find((item: any) => item.key === key)
  if (!/_(cost|sell)$/.test(key) && column?.kind !== 'money2') return
  const input = event.target as HTMLInputElement
  const raw = String(input.value || '').replace(/,/g, '')
  if (raw === '' || isNaN(parseFloat(raw))) return
  const formatted = column?.kind === 'money2'
    ? parseFloat(raw).toFixed(2)
    : parseFloat(raw).toLocaleString('en-US', { maximumFractionDigits: 2 })
  const draft = mode === 'edit' ? smEditDraft : smDraft
  draft[key] = formatted
  input.value = formatted
}
const salesInputType = (column: any) => column.kind === 'date' ? 'date' : 'text'
const salesInputMode = (column: any) => ['number', 'money2'].includes(column.kind) ? 'decimal' : undefined
const defaultSalesCountries = ['VIETNAM', 'CHINA', 'UNITED STATES', 'JAPAN', 'SOUTH KOREA', 'SINGAPORE', 'THAILAND', 'MALAYSIA', 'INDONESIA', 'PHILIPPINES', 'INDIA', 'HONG KONG', 'TAIWAN', 'CAMBODIA', 'LAOS', 'MYANMAR', 'AUSTRALIA', 'GERMANY', 'FRANCE', 'UNITED KINGDOM', 'NETHERLANDS', 'ITALY', 'SPAIN', 'CANADA', 'UNITED ARAB EMIRATES', 'BANGLADESH', 'PAKISTAN', 'TURKEY', 'BELGIUM']
const traderCountryCodes: Record<string, string> = { VIETNAM: 'VN', 'VIET NAM': 'VN', CHINA: 'CN', 'UNITED STATES': 'US', USA: 'US', JAPAN: 'JP', 'SOUTH KOREA': 'KR', KOREA: 'KR', SINGAPORE: 'SG', THAILAND: 'TH', MALAYSIA: 'MY', INDONESIA: 'ID', PHILIPPINES: 'PH', INDIA: 'IN', 'HONG KONG': 'HK', TAIWAN: 'TW', CAMBODIA: 'KH', LAOS: 'LA', MYANMAR: 'MM', AUSTRALIA: 'AU', GERMANY: 'DE', FRANCE: 'FR', 'UNITED KINGDOM': 'GB', NETHERLANDS: 'NL', ITALY: 'IT', SPAIN: 'ES', CANADA: 'CA', 'UNITED ARAB EMIRATES': 'AE', BANGLADESH: 'BD', PAKISTAN: 'PK', TURKEY: 'TR', BELGIUM: 'BE' }
const compactDate = (value: any) => {
  const date = value ? new Date(value) : new Date()
  const safe = Number.isNaN(date.getTime()) ? new Date() : date
  return `${String(safe.getDate()).padStart(2, '0')}${String(safe.getMonth() + 1).padStart(2, '0')}${String(safe.getFullYear()).slice(-2)}`
}
const traderCountryCode = (value: any) => {
  const key = normalizeSalesOption(value)
  return traderCountryCodes[key] || key.replace(/[^A-Z]/g, '').slice(0, 2) || 'XX'
}
const makeTraderAutoId = (data: Record<string, any>) => {
  const prefix = traderCountryCode(data.country)
  const stamp = compactDate(data.recdate)
  const existing = records.value
    .map((record) => String(dataOf(record).id || ''))
    .filter((id) => id.startsWith(`${prefix}${stamp}`))
  return `${prefix}${stamp}${String(existing.length + 1).padStart(2, '0')}`
}
const makeInternalStaffId = (data: Record<string, any>) => {
  const prefix = 'ST'
  const stamp = compactDate(data.recdate)
  const existing = records.value
    .map((record) => String(dataOf(record).staffid || ''))
    .filter((id) => id.startsWith(`${prefix}${stamp}`))
  return `${prefix}${stamp}${String(existing.length + 1).padStart(2, '0')}`
}
const traderDriverLabel = (drivers: any) => {
  const count = Array.isArray(drivers) ? drivers.length : Number(drivers || 0)
  return count ? `${count} DRIVER${count > 1 ? 'S' : ''}` : 'NO DRIVERS'
}
const makeTraderDriver = () => ({ _uid: `drv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`, name: '', driverId: '', phone: '', truck: '', trailer: '', _new: true })
const openTraderDrivers = (record: AdminRecord) => {
  const data = dataOf(record)
  traderDriverModal.recordId = record.id
  traderDriverModal.title = data.company || data.namecode || data.id || '(no name)'
  traderDriverModal.editId = ''
  traderDriverModal.snapshot = null
  traderDriverModal.drivers = (Array.isArray(data.drivers) ? data.drivers : []).map((driver: any) => ({ _uid: driver._uid || makeTraderDriver()._uid, name: driver.name || '', driverId: driver.driverId || '', phone: driver.phone || '', truck: driver.truck || '', trailer: driver.trailer || '' }))
  traderDriverModal.open = true
}
const closeTraderDrivers = () => {
  traderDriverModal.open = false
  traderDriverModal.recordId = ''
  traderDriverModal.editId = ''
  traderDriverModal.snapshot = null
  traderDriverModal.drivers = []
}
const driverByUid = (uid: string) => traderDriverModal.drivers.find((driver) => driver._uid === uid)
const cancelTraderDriverEdit = () => {
  if (!traderDriverModal.editId) return
  const driver = driverByUid(traderDriverModal.editId)
  if (driver?._new) traderDriverModal.drivers = traderDriverModal.drivers.filter((item) => item !== driver)
  else if (driver && traderDriverModal.snapshot) Object.assign(driver, traderDriverModal.snapshot)
  traderDriverModal.editId = ''
  traderDriverModal.snapshot = null
}
const addTraderDriver = async () => {
  cancelTraderDriverEdit()
  const driver = makeTraderDriver()
  traderDriverModal.drivers.push(driver)
  traderDriverModal.editId = driver._uid
  await nextTick()
  ;(document.querySelector('.trader-driver-modal tbody tr:last-child input') as HTMLInputElement | null)?.focus()
}
const editTraderDriver = async (driver: Record<string, any>) => {
  cancelTraderDriverEdit()
  traderDriverModal.snapshot = { ...driver }
  traderDriverModal.editId = driver._uid
  await nextTick()
  ;(document.querySelector('.trader-driver-modal tbody tr input') as HTMLInputElement | null)?.focus()
}
const saveTraderDriverEdit = async (driver: Record<string, any>) => {
  delete driver._new
  traderDriverModal.editId = ''
  traderDriverModal.snapshot = null
  await saveTraderDrivers(false)
}
const removeTraderDriver = async (driver: Record<string, any>) => {
  if (!(await confirmAdmin(`Remove driver "${driver.name || driver._uid}"? This cannot be undone.`, 'Remove driver', 'Confirm', 'danger'))) return
  traderDriverModal.drivers = traderDriverModal.drivers.filter((item) => item !== driver)
  if (traderDriverModal.editId === driver._uid) {
    traderDriverModal.editId = ''
    traderDriverModal.snapshot = null
  }
  await saveTraderDrivers(false)
}
const saveTraderDrivers = async (closeAfterSave = true) => {
  const record = records.value.find((item) => item.id === traderDriverModal.recordId)
  if (!record) return closeTraderDrivers()
  cancelTraderDriverEdit()
  saving.value = true
  try {
    const data = {
      ...dataOf(record),
      drivers: traderDriverModal.drivers.map((driver) => ({ _uid: driver._uid, name: driver.name || '', driverId: driver.driverId || '', phone: driver.phone || '', truck: driver.truck || '', trailer: driver.trailer || '' })),
    }
    await apiFetch(`/records/${record.id}`, { method: 'PATCH', body: { country: record.country, page: record.page, kind: record.kind, data, sortOrder: record.sortOrder || 0 } })
    if (closeAfterSave) closeTraderDrivers()
    await loadRecords()
  } finally {
    saving.value = false
  }
}
const normalizeCoverage = (value: any) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { inco: [] as string[], role: [] as string[] }
  return {
    inco: Array.isArray(value.inco) ? value.inco.map((item: any) => String(item || '').trim()).filter(Boolean) : [],
    role: Array.isArray(value.role) ? value.role.map((item: any) => String(item || '').trim()).filter(Boolean) : [],
  }
}
const coverageLabel = (value: any) => {
  const coverage = normalizeCoverage(value)
  const selected = [...coverage.inco, ...coverage.role]
  if (!selected.length) return 'SET COVERAGE'
  return selected.length <= 4 ? selected.join(', ') : `${selected.length} selected`
}
const openCoverageWithValue = (mode: 'record' | 'add' | 'edit', value: any, recordId = '') => {
  const coverage = normalizeCoverage(value)
  coverageModal.mode = mode
  coverageModal.recordId = recordId
  coverageModal.inco = coverage.inco.slice()
  coverageModal.role = coverage.role.slice()
  coverageModal.locked = Boolean(coverage.inco.length || coverage.role.length)
  coverageModal.open = true
}
const openCoverageDraft = (mode: 'add' | 'edit') => openCoverageWithValue(mode, mode === 'edit' ? smEditDraft.coverage : smDraft.coverage)
const openCoverageRecord = (record: AdminRecord) => openCoverageWithValue('record', dataOf(record).coverage, record.id)
const closeCoverageModal = () => {
  coverageModal.open = false
  coverageModal.recordId = ''
  coverageModal.locked = false
  coverageModal.inco = []
  coverageModal.role = []
}
const unlockCoverageModal = () => {
  coverageModal.locked = false
}
const applyCoverage = async () => {
  const value = { inco: coverageModal.inco.slice(), role: coverageModal.role.slice() }
  if (coverageModal.mode === 'add') {
    smDraft.coverage = value
    coverageModal.locked = Boolean(value.inco.length || value.role.length)
    return
  }
  if (coverageModal.mode === 'edit') {
    smEditDraft.coverage = value
    coverageModal.locked = Boolean(value.inco.length || value.role.length)
    return
  }
  const record = records.value.find((item) => item.id === coverageModal.recordId)
  if (!record) return closeCoverageModal()
  saving.value = true
  try {
    const data = { ...dataOf(record), coverage: value }
    await apiFetch(`/records/${record.id}`, { method: 'PATCH', body: { country: record.country, page: record.page, kind: record.kind, data, sortOrder: record.sortOrder || 0 } })
    coverageModal.locked = Boolean(value.inco.length || value.role.length)
    await loadRecords()
  } finally {
    saving.value = false
  }
}
const salesOptionPage = (key: string) => `sm_option_${key}`
const normalizeSalesOption = (value: any) => String(value || '').trim().toUpperCase()
const salesFeeReferenceOptions = (key: string) => {
  if (currentPage.value.kind !== 'sales-marketing') return []
  const column = tableColumns.value.find((item: any) => item.key === key)
  const reference = salesFeeReferenceLists[String(column?.listId || '')]
  if (!reference) return []
  return salesFeeReferenceRecords[reference.bucket]
    .map((record) => normalizeSalesOption(dataOf(record)[reference.key]))
    .filter(Boolean)
}
const salesListOptions = (key: string) => {
  const fromDb = (salesListRecords[key] || []).map((record) => normalizeSalesOption(dataOf(record).countryname || dataOf(record).value || dataOf(record).label || dataOf(record).name))
  const fromRows = records.value.map((record) => normalizeSalesOption(dataOf(record)[key]))
  const isCountryField = key === 'country' || key === 'polCountry' || key === 'podCountry'
  const defaults = isCountryField
    ? defaultSalesCountries
    : key === 'cur'
      ? ['USD', 'VND', 'EUR', 'CNY', 'JPY', 'KRW', 'THB', 'SGD', 'INR', 'IDR', 'MYR', 'HKD', 'TWD', 'GBP', 'AUD']
      : []
  return Array.from(new Set([...salesFeeReferenceOptions(key), ...defaults, ...(haulageLookupOptions[key] || []), ...fromDb, ...fromRows].filter(Boolean))).sort((a, b) => a.localeCompare(b))
}
const activeSalesListDraft = () => smListDraftMode.value === 'edit' ? smEditDraft : smDraft
const filteredSalesListOptions = (key: string) => {
  const query = normalizeSalesOption(activeSalesListDraft()[key])
  const options = salesListOptions(key)
  return (query ? options.filter((option) => option.includes(query)) : options).slice(0, 80)
}
const openSalesList = (key: string, mode: 'add' | 'edit' = 'add') => {
  if (smListPicker.key !== key) smListPicker.index = 0
  smListDraftMode.value = mode
  smListPicker.key = key
}
const closeSalesList = () => {
  smListPicker.key = ''
  smListPicker.index = 0
}
const activeSalesListOption = (key: string) => filteredSalesListOptions(key)[smListPicker.index] || ''
const moveSalesList = (key: string, delta: number) => {
  const options = filteredSalesListOptions(key)
  if (!options.length) return
  smListPicker.key = key
  smListPicker.index = (smListPicker.index + delta + options.length) % options.length
}
const salesFeeReferenceMatch = (records: AdminRecord[], key: string, value: any) => {
  const normalized = normalizeSalesOption(value)
  return normalized ? records.find((record) => normalizeSalesOption(dataOf(record)[key]) === normalized) : undefined
}
const syncSalesFeeReferencePair = (key: string) => {
  if (currentPage.value.kind !== 'sales-marketing' || !state.smSub.includes('trucking')) return
  const draft = activeSalesListDraft()
  if (key === 'scope' || key === 'portname') {
    const air = state.smMode === 'AIR'
    const rows = salesFeeReferenceRecords[air ? 'airports' : 'ports']
    const codeKey = air ? 'iata' : 'portcode'
    const nameKey = air ? 'airportname' : 'portname'
    const hit = salesFeeReferenceMatch(rows, key === 'scope' ? codeKey : nameKey, draft[key])
    draft.scope = hit ? normalizeSalesOption(dataOf(hit)[codeKey]) : ''
    draft.portname = hit ? normalizeSalesOption(dataOf(hit)[nameKey]) : ''
    return
  }
  if (key === 'postalcode') {
    const hit = salesFeeReferenceMatch(salesFeeReferenceRecords.postal, 'postalcode', draft.postalcode)
    draft.postalcode = hit ? normalizeSalesOption(dataOf(hit).postalcode) : ''
    draft.district = hit ? normalizeSalesOption(dataOf(hit).district) : ''
    return
  }
  if (key === 'district') {
    const district = normalizeSalesOption(draft.district)
    const matches = salesFeeReferenceRecords.postal.filter((record) => normalizeSalesOption(dataOf(record).district) === district)
    draft.district = matches.length ? normalizeSalesOption(dataOf(matches[0]).district) : ''
    if (!matches.length) draft.postalcode = ''
    else if (matches.length === 1) draft.postalcode = normalizeSalesOption(dataOf(matches[0]).postalcode)
  }
}
const chooseSalesList = (key: string, value: any) => {
  const normalized = normalizeSalesOption(value)
  if (normalized) activeSalesListDraft()[key] = normalized
  syncSalesFeeReferencePair(key)
  closeSalesList()
}
const handleSalesRowEnter = async (mode: 'add' | 'edit', event: KeyboardEvent) => {
  if (currentPage.value.kind !== 'sales-marketing' || saving.value) return
  if (mode === 'add' && !smAdding.value || mode === 'edit' && !smEditId.value) return
  const target = event.target as HTMLElement | null
  if (target?.closest('button, textarea')) return
  event.preventDefault()
  if (mode === 'add') await saveSalesDraft()
  else await saveSalesEdit()
}
const handleSalesListEnter = async (key: string, mode: 'add' | 'edit', event: KeyboardEvent) => {
  event.preventDefault()
  if (smListPicker.key === key) {
    chooseSalesList(key, activeSalesListOption(key) || activeSalesListDraft()[key])
    return
  }
  if (currentPage.value.kind === 'sales-marketing') {
    await handleSalesRowEnter(mode, event)
    return
  }
  chooseSalesList(key, activeSalesListDraft()[key])
}
const handleSalesListOutside = (event: MouseEvent) => {
  const target = event.target as Element | null
  if (smListPicker.key && !target?.closest?.('.sm-list-cell')) closeSalesList()
  if (state.smExportOpen && !target?.closest?.('.sm-export-wrap')) state.smExportOpen = false
  if (smHeaderMenu.open && !target?.closest?.('.sm-head-menu')) closeSmHeaderMenu()
}
const handleSalesGridContextMenu = (event: MouseEvent) => {
  const target = event.target as Element | null
  if (target?.closest?.('.sm-tablewrap') || target?.closest?.('.sm-head-menu')) {
    event.preventDefault()
  }
}
const loadSalesListOptions = async () => {
  const keys = ['city', 'country', 'cur', 'fromport', 'fromwh', 'haulier']
  await Promise.all(keys.map(async (key) => {
    const pages = [apiFetch(`/records?country=GLOBAL&page=${encodeURIComponent(salesOptionPage(key))}&limit=1000`)]
    if (key === 'country') pages.push(apiFetch('/records?country=GLOBAL&page=ref_countries&limit=1000'))
    const results = await Promise.all(pages)
    salesListRecords[key] = results.flatMap((data: any) => Array.isArray(data?.items) ? data.items : [])
  }))
}
const loadSalesFeeReferencePage = async (country: string, page: string) => {
  const url = `/records?country=${encodeURIComponent(country)}&page=${encodeURIComponent(page)}&limit=1000`
  const first = await apiFetch(`${url}&skip=0`)
  const items = Array.isArray(first?.items) ? [...first.items] : []
  const total = Math.max(Number(first?.total) || 0, items.length)
  while (items.length < total) {
    const next = await apiFetch(`${url}&skip=${items.length}`)
    const nextItems = Array.isArray(next?.items) ? next.items : []
    if (!nextItems.length) break
    items.push(...nextItems)
  }
  return items as AdminRecord[]
}
const loadSalesFeeReferenceRecords = async () => {
  const token = ++salesFeeReferenceLoadToken
  const country = state.country
  const [ports, airports, globalPostal, countryPostal] = await Promise.all([
    loadSalesFeeReferencePage('GLOBAL', 'ref_ports'),
    loadSalesFeeReferencePage('GLOBAL', 'ref_airports'),
    loadSalesFeeReferencePage('GLOBAL', 'ref_postalcode'),
    loadSalesFeeReferencePage(country, 'admin'),
  ])
  if (token !== salesFeeReferenceLoadToken || country !== state.country) return
  salesFeeReferenceRecords.ports = ports
  salesFeeReferenceRecords.airports = airports
  const seen = new Set<string>()
  salesFeeReferenceRecords.postal = [...globalPostal, ...countryPostal]
    .map((record) => {
      const data = dataOf(record)
      return {
        ...record,
        data: {
          ...data,
          postalcode: data.postalcode || data.zip || '',
          district: data.district || data.ward || data.dist || data.placeName || '',
        },
      }
    })
    .filter((record) => {
      const data = dataOf(record)
      const key = `${normalizeSalesOption(data.postalcode)}\u0000${normalizeSalesOption(data.district)}`
      if (key === '\u0000' || seen.has(key)) return false
      seen.add(key)
      return true
    })
}
const loadHaulageLookups = async () => {
  try {
    const [staff, ports, warehouses, airports, hauliers] = await Promise.all([
      apiFetch('/records?country=GLOBAL&page=internal_staff&limit=1000'),
      apiFetch('/records?country=GLOBAL&page=ref_ports&limit=1000'),
      apiFetch('/records?country=GLOBAL&page=ref_warehouses&limit=1000'),
      apiFetch('/records?country=GLOBAL&page=ref_airports&limit=1000'),
      apiFetch('/records?country=GLOBAL&page=traders_hauliers&limit=1000'),
    ])
    const items = (result: any) => Array.isArray(result?.items) ? result.items : []
    const values = (records: any[], format: (data: any) => string) => Array.from(new Set(records.map((record) => normalizeSalesOption(format(dataOf(record)))).filter(Boolean)))
    haulageStaffOptions.value = Array.from(new Set(items(staff).map((record: any) => String(dataOf(record).fullname || dataOf(record).nickname || '').trim()).filter(Boolean)))
    haulageLookupOptions.fromport = values(items(ports), (data) => data.portname ? `${data.portname}${data.portcode ? ` (${data.portcode})` : ''}` : data.portcode)
    haulageLookupOptions.fromwh = values([...items(warehouses), ...items(airports)], (data) => {
      const name = data.whname || data.airportname || data.name; const code = data.portcode || data.iata || data.code
      return name ? `${name}${code ? ` (${code})` : ''}` : code
    })
    haulageLookupOptions.haulier = values(items(hauliers), (data) => data.company || data.companyname || data.namecode)
  } catch (e) {
    haulageStaffOptions.value = []
  }
}
const haulageOptionsFor = (key: string) => haulageLookupOptions[key] || []
const salesDefaultValue = (column: any) => {
  if (column.kind === 'checkbox') return false
  if (isInternalHaulage.value && ['money2', 'number'].includes(column.kind)) return ''
  if (currentPage.value.kind === 'sales-marketing' && ['money2', 'number'].includes(column.kind)) return ''
  if (column.kind === 'money2') return '0.00'
  if (column.kind === 'number') return 0
  if (currentPage.value.kind === 'quality-control' && column.key === 'caseid') {
    const date = new Date()
    const stamp = [date.getDate(), date.getMonth() + 1, String(date.getFullYear()).slice(-2)].map((part) => String(part).padStart(2, '0')).join('')
    const prefix = `CS_${stamp}_`
    const next = records.value.reduce((max, record) => {
      const value = String(dataOf(record).caseid || '')
      return value.startsWith(prefix) ? Math.max(max, Number(value.slice(prefix.length)) || 0) : max
    }, 0) + 1
    return `${prefix}${String(next).padStart(2, '0')}`
  }
  if (currentPage.value.kind === 'quality-control' && column.key === 'date') return new Date().toISOString().slice(0, 10)
  if (currentPage.value.kind === 'quality-control' && column.key === 'staff') return adminStore.admin?.name || adminStore.admin?.fullName || adminStore.admin?.email || ''
  if (currentPage.value.kind === 'traders-suppliers' && column.key === 'recdate') return new Date().toISOString().slice(0, 10)
  if (currentPage.value.kind === 'traders-suppliers' && column.key === 'gsd') return accountDisplayName.value
  if (currentPage.value.kind === 'internal-directory' && column.key === 'recdate') return new Date().toISOString().slice(0, 10)
  if (currentPage.value.kind === 'internal-directory' && activeInternalTab.value.id === 'haulage' && column.key === 'createdate') return new Date().toISOString().slice(0, 16).replace('T', ' ')
  if (currentPage.value.kind === 'internal-directory' && activeInternalTab.value.id === 'haulage' && column.key === 'creator') return ''
  if (currentPage.value.kind === 'reference-data' && column.key === 'rdate') return new Date().toISOString().slice(0, 10)
  if (currentPage.value.kind === 'customs-legal' && column.key === 'mandatory') return 'Yes'
  if (column.kind === 'coverage') return { inco: [], role: [] }
  if (currentPage.value.kind === 'traders-suppliers' && column.key === 'role') return activeTraderTab.value.dep ? '' : (activeTraderTab.value.roleOpts?.[0] || '')
  if (currentPage.value.kind === 'traders-suppliers' && column.key === 'drivers') return []
  if (currentPage.value.kind === 'internal-directory' && column.kind === 'computed') return ''
  if (currentPage.value.kind === 'analysis-statistics' && column.kind === 'computed') return ''
  if (column.key === 'status') return 'Active'
  if (column.key === 'ptype') return 'Seaport'
  if (column.kind === 'select') return column.opts?.[0] || ''
  return ''
}
const focusSalesDraftCell = async (columnKey = '') => {
  await nextTick()
  await refreshSmLedge()
  const safeColumnKey = String(columnKey || '').replace(/"/g, '\\"')
  const scopedTarget = safeColumnKey
    ? document.querySelector(`.sm-editing td[data-col-key="${safeColumnKey}"] .sm-celli, .sm-editing td[data-col-key="${safeColumnKey}"] .sm-mini-action`) as HTMLElement | null
    : null
  const target = (scopedTarget || document.querySelector('.sm-editing .sm-celli')) as HTMLInputElement | HTMLSelectElement | HTMLButtonElement | null
  target?.focus?.({ preventScroll: true } as FocusOptions)
  if (target instanceof HTMLInputElement) target.select()
}
const startSalesAddRow = async () => {
  if (smAdding.value) return
  if (currentPage.value.kind === 'sales-marketing') clearSalesFilters()
  cancelSalesEdit()
  Object.keys(smDraft).forEach((key) => delete smDraft[key])
  tableColumns.value.forEach((column: any) => {
    smDraft[column.key] = salesDefaultValue(column)
  })
  smAdding.value = true
  await focusSalesDraftCell()
  await refreshSmLedge()
}
const cancelSalesDraft = () => {
  resetSalesDraft()
  smLedgeTick.value++
}
const startSalesEdit = async (record: AdminRecord, event?: MouseEvent) => {
  if (smAdding.value) resetSalesDraft()
  const cell = (event?.target as HTMLElement | null)?.closest?.('td[data-col-key]') as HTMLElement | null
  const focusColumnKey = cell?.dataset?.colKey || ''
  smEditId.value = record.id
  Object.keys(smEditDraft).forEach((key) => delete smEditDraft[key])
  const data = dataOf(record)
  tableColumns.value.forEach((column: any) => {
    smEditDraft[column.key] = data[column.key] ?? salesDefaultValue(column)
  })
  smEditDraft.clientIds = Array.isArray(data.clientIds) ? [...data.clientIds] : []
  state.selected.delete(record.id)
  await focusSalesDraftCell(focusColumnKey)
  await refreshSmLedge()
}
const cancelSalesEdit = () => {
  smEditId.value = ''
  Object.keys(smEditDraft).forEach((key) => delete smEditDraft[key])
  closeSalesList()
  smListDraftMode.value = 'add'
  smLedgeTick.value++
}
const rolesColumnOpts = computed(() => (tableColumns.value.find((column: any) => column.kind === 'roles')?.opts || []) as string[])
const rolesModalDep = computed(() => rolesModal.selected.includes('SHIPPER') || rolesModal.selected.includes('CNEE'))
const openRolesModal = (mode: 'add' | 'edit') => {
  const draft = mode === 'edit' ? smEditDraft : smDraft
  rolesModal.mode = mode
  rolesModal.selected = String(draft.role || '').split(',').map((item) => item.trim()).filter(Boolean)
  rolesModal.links = Array.isArray(draft.clientIds) ? [...draft.clientIds] : []
  rolesModal.clientInput = ''
  rolesModal.hint = ''
  rolesModal.hintKind = ''
  rolesModal.open = true
}
const closeRolesModal = () => { rolesModal.open = false }
const toggleRoleOption = (option: string) => {
  const index = rolesModal.selected.indexOf(option)
  if (index >= 0) { rolesModal.selected.splice(index, 1); return }
  if (option === 'SHIPPER') {
    const other = rolesModal.selected.indexOf('CNEE')
    if (other >= 0) rolesModal.selected.splice(other, 1)
  }
  if (option === 'CNEE') {
    const other = rolesModal.selected.indexOf('SHIPPER')
    if (other >= 0) rolesModal.selected.splice(other, 1)
  }
  rolesModal.selected.push(option)
}
const recordRoles = (data: any) => (Array.isArray(data?.roles) ? data.roles : String(data?.role || '').split(',').map((item: string) => item.trim()).filter(Boolean)).map((item: any) => String(item).toUpperCase())
const traderClientOptions = computed(() => records.value
  .filter((record) => recordRoles(dataOf(record)).includes('CLIENT') && dataOf(record).id)
  .map((record) => {
    const data = dataOf(record)
    return { id: String(data.id), name: String(data.company || data.namecode || data.id) }
  }))
const rolesClientNameOf = (id: string) => traderClientOptions.value.find((client) => client.id === id)?.name || id
const roleLinkNames = (record: any) => {
  const ids = dataOf(record)?.clientIds
  return (Array.isArray(ids) ? ids : []).map((id: any) => rolesClientNameOf(String(id)))
}
const updateRolesClientHint = () => {
  const value = rolesModal.clientInput.trim().toUpperCase()
  if (!value) { rolesModal.hint = ''; rolesModal.hintKind = ''; return }
  if (rolesModal.links.includes(value)) { rolesModal.hint = 'Already added'; rolesModal.hintKind = 'muted'; return }
  if (traderClientOptions.value.some((client) => client.id === value)) {
    rolesModal.hint = `✓ ${rolesClientNameOf(value)} — press Add`
    rolesModal.hintKind = 'ok'
    return
  }
  rolesModal.hint = 'No CLIENT found with this ID'
  rolesModal.hintKind = 'bad'
}
const uppercaseRolesClientInput = () => {
  rolesModal.clientInput = rolesModal.clientInput.toUpperCase()
  updateRolesClientHint()
}
const addRoleClientLink = () => {
  const value = rolesModal.clientInput.trim().toUpperCase()
  if (!value) return
  if (rolesModal.links.includes(value) || !traderClientOptions.value.some((client) => client.id === value)) {
    updateRolesClientHint()
    return
  }
  rolesModal.links.push(value)
  rolesModal.clientInput = ''
  updateRolesClientHint()
}
const removeRoleClientLink = (id: string) => {
  rolesModal.links = rolesModal.links.filter((item) => item !== id)
}
const applyRolesModal = () => {
  if (rolesModalDep.value && !rolesModal.links.length) {
    rolesModal.hint = 'Add at least one CLIENT ID'
    rolesModal.hintKind = 'bad'
    return
  }
  const draft = rolesModal.mode === 'edit' ? smEditDraft : smDraft
  draft.role = rolesModal.selected.join(', ')
  draft.clientIds = rolesModalDep.value ? [...rolesModal.links] : []
  if (rolesModal.mode === 'add') draft.gsd = accountDisplayName.value
  closeRolesModal()
}
const traderFullDetailValue = (value: any) => {
  if (Array.isArray(value)) return value.join(', ')
  if (value && typeof value === 'object') return Object.values(value).filter(Boolean).join(', ')
  return String(value ?? '').trim() || '-'
}
const openTraderFullDetail = (source: Record<string, any>) => {
  traderFullDetailModal.title = `${activeTraderTab.value.label} Detail`
  traderFullDetailModal.text = traderColumns.value
    .filter((column: any) => !['recdate', 'id', 'fulldetail', 'status', 'notes', 'drivers', 'namecode', 'role', 'gsd'].includes(String(column.key || '').toLowerCase()))
    .map((column: any) => `${String(column.label).toUpperCase()}: ${traderFullDetailValue(source?.[column.key])}`)
    .join('\n')
  traderFullDetailModal.copied = false
  traderFullDetailModal.open = true
}
const closeTraderFullDetail = () => {
  traderFullDetailModal.open = false
  traderFullDetailModal.copied = false
}
const copyTraderFullDetail = async () => {
  await navigator.clipboard.writeText(traderFullDetailModal.text)
  traderFullDetailModal.copied = true
}
const validateTraderGsd = async (draft: Record<string, any>) => {
  if (currentPage.value.kind === 'traders-suppliers' && activeTraderTab.value.id === 'traders' && !smEditId.value) {
    draft.gsd = accountDisplayName.value
  }
  return true
}
const externalUrl = (value: any) => {
  const url = String(value || '').trim()
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}
const duplicateComparableData = (source: Record<string, any>) => {
  const ignored = new Set(['id', 'recdate', 'date', 'createdate', 'status', 'notes', 'fulldetail', 'sortOrder', 'tab', 'table'])
  return Object.fromEntries(Object.entries(source || {})
    .filter(([key, value]) => !ignored.has(key) && value !== '' && value !== null && value !== undefined)
    .map(([key, value]) => [key, typeof value === 'string' ? value.trim().toUpperCase() : value]))
}
const isDuplicateManagementRow = (draft: Record<string, any>, ignoredId = '') => {
  const candidate = duplicateComparableData(salesDraftData(draft))
  const keys = Object.keys(candidate)
  if (!keys.length) return false
  return records.value.some((record) => {
    if (record.id === ignoredId) return false
    const existing = duplicateComparableData(dataOf(record))
    return keys.length === Object.keys(existing).length && keys.every((key) => JSON.stringify(existing[key]) === JSON.stringify(candidate[key]))
  })
}
const salesDraftData = (draft: Record<string, any>) => {
  const data: Record<string, any> = {}
  tableColumns.value.forEach((column: any) => {
    if (column.kind === 'postal-tree') return
    data[column.key] = column.kind === 'list' ? normalizeSalesOption(draft[column.key]) : (draft[column.key] ?? '')
  })
  tableColumns.value.forEach((column: any) => {
    if (typeof column.key === 'string' && column.key.endsWith('_sell')) {
      const base = column.key.slice(0, -5)
      if ((data[column.key] ?? '') === '' && (data[base] ?? '') !== '') data[column.key] = data[base]
    }
  })
  if (currentPage.value.kind === 'traders-suppliers') {
    data.tab = activeTraderTab.value.id
    data.table = activeTraderTab.value.label
    data.role = activeTraderTab.value.dep ? data.role : (activeTraderTab.value.roleOpts?.[0] || data.role || '')
    data.roles = data.role ? String(data.role).split(',').map((item) => item.trim()).filter(Boolean) : []
    data.clientIds = Array.isArray(draft.clientIds) ? [...draft.clientIds] : []
    data.id = data.id || makeTraderAutoId(data)
    data.status = data.status || 'Active'
    if (activeTraderTab.value.id === 'traders') {
      data.gsd = smEditId.value ? String(data.gsd || '').trim() : accountDisplayName.value
    }
    return data
  }
  if (currentPage.value.kind === 'quality-control') {
    data.tab = activeQualityTab.value.id
    data.table = activeQualityTab.value.label
    if (activeQualityTab.value.id === 'incident') {
      const date = new Date()
      const stamp = [date.getDate(), date.getMonth() + 1, String(date.getFullYear()).slice(-2)].map((part) => String(part).padStart(2, '0')).join('')
      data.caseid = data.caseid || `CS_${stamp}_${String(records.value.length + 1).padStart(2, '0')}`
      data.date = data.date || date.toISOString().slice(0, 10)
    }
    return data
  }
  if (currentPage.value.kind === 'reference-data') {
    data.tab = activeReferenceTab.value.id
    data.table = activeReferenceTab.value.label
    data.status = data.status || 'Active'
    return data
  }
  if (currentPage.value.kind === 'customs-legal') {
    data.tab = activeLegalTab.value.id
    data.table = activeLegalTab.value.label
    data.status = data.status || 'Active'
    return data
  }
  if (currentPage.value.kind === 'internal-directory') {
    data.tab = activeInternalTab.value.id
    data.table = activeInternalTab.value.label
    if (activeInternalTab.value.id === 'staff') {
      data.staffid = data.staffid || makeInternalStaffId(data)
      data.workingtime = data.joined ? String(Math.max(0, new Date().getFullYear() - new Date(data.joined).getFullYear())) : data.workingtime || ''
    }
    data.status = data.status || 'Active'
    return data
  }
  if (currentPage.value.kind === 'analysis-statistics') {
    data.top = state.analysisTop
    data.tab = activeAnalysisTable.value.id
    data.table = activeAnalysisTable.value.label
    data.status = data.status || 'Active'
    return data
  }
  data.top = state.smTop
  data.mode = state.smMode
  data.table = activeSalesTableLabel.value
  data.status = data.status || 'Active'
  return data
}
const addSalesListValue = async (column: any) => {
  const label = column.key === 'city' ? 'City / Province' : column.key === 'country' ? 'Country' : column.label
  const value = await promptAdmin(`Add ${label}`, label, '', `Add a new ${label.toLowerCase()} to the suggestion list.`)
  if (!value) return
  const normalized = normalizeSalesOption(value)
  const exists = salesListOptions(column.key).some((item) => item === normalized)
  if (exists) {
    await notifyAdmin(`${label} already exists`)
    return
  }
  if (!exists) {
    await apiFetch('/records', {
      method: 'POST',
      body: {
        country: 'GLOBAL',
        page: salesOptionPage(column.key),
        kind: 'sales-marketing-option',
        data: { key: column.key, value: normalized, label: normalized, table: activeSalesTableLabel.value },
        sortOrder: salesListOptions(column.key).length + 1,
      },
    })
    await loadSalesListOptions()
  }
  if (!smAdding.value) await startSalesAddRow()
  smDraft[column.key] = normalized
}
const logQualityHistory = async (history: string) => {
  const now = new Date()
  const staffName = adminStore.admin?.name || adminStore.admin?.fullName || adminStore.admin?.email || ''
  const staffId = adminStore.admin?.staffId || adminStore.admin?.username || ''
  await apiFetch('/records', {
    method: 'POST',
    body: {
      country: 'GLOBAL',
      page: 'quality_history',
      kind: 'quality-control',
      data: {
        tab: 'history',
        table: 'History',
        date: now.toLocaleString('en-GB', { hour12: false }),
        dept: adminStore.admin?.department || '',
        staffid: staffId,
        staffname: staffName,
        history,
      },
      sortOrder: 0,
    },
  })
}
const saveSalesDraft = async () => {
  if (!(await validateTraderGsd(smDraft))) return
  const firstKey = tableColumns.value[0]?.key
  if (firstKey && !String(smDraft[firstKey] || '').trim()) {
    await notifyAdmin('Required field is missing.')
    return
  }
  if (isDuplicateManagementRow(smDraft)) {
    await notifyAdmin('Duplicate data already exists in this source.')
    return
  }
  saving.value = true
  try {
    const data = salesDraftData(smDraft)
    await apiFetch('/records', { method: 'POST', body: { country: recordCountry.value, page: recordPage.value, kind: currentPage.value.kind, data, sortOrder: records.value.length + 1 } })
    if (currentPage.value.kind === 'quality-control' && state.qcTab === 'incident') {
      await logQualityHistory(`${data.resulted ? 'Created and marked Resulted' : 'Created incident'} ${data.caseid}`)
    }
    resetSalesDraft()
    await loadRecords()
  } catch (error: any) {
    await notifyAdmin(error?.data?.message || error?.message || 'Could not save row.')
  } finally {
    saving.value = false
  }
}
const saveSalesEdit = async () => {
  if (!(await validateTraderGsd(smEditDraft))) return
  const record = records.value.find((item) => item.id === smEditId.value)
  if (!record) {
    cancelSalesEdit()
    await notifyAdmin('Edited row no longer exists.')
    return
  }
  const firstKey = tableColumns.value[0]?.key
  if (firstKey && !String(smEditDraft[firstKey] || '').trim()) {
    await notifyAdmin('Required field is missing.')
    return
  }
  if (isDuplicateManagementRow(smEditDraft, record.id)) {
    await notifyAdmin('Duplicate data already exists in this source.')
    return
  }
  saving.value = true
  try {
    const data = { ...dataOf(record), ...salesDraftData(smEditDraft) }
    await apiFetch(`/records/${record.id}`, { method: 'PATCH', body: { country: record.country, page: record.page, kind: record.kind, data, sortOrder: record.sortOrder || 0 } })
    if (currentPage.value.kind === 'quality-control' && state.qcTab === 'incident') {
      await logQualityHistory(`${data.resulted ? 'Updated and marked Resulted' : 'Edited incident'} ${data.caseid}`)
    }
    cancelSalesEdit()
    await loadRecords()
  } catch (error: any) {
    await notifyAdmin(error?.data?.message || error?.message || 'Could not save row.')
  } finally {
    saving.value = false
  }
}
const activeFclTab = computed(() => fclTabs.value.find((tab) => tab.id === state.fclTab) || fclTabs.value[0])
const fclTabCount = (tab: any) => records.value.filter((record) => dataOf(record).section === tab.section).length
const setFclTab = (tabId: string) => {
  state.fclTab = tabId
  state.pageIndex = 0
  state.sortKey = ''
  state.selected.clear()
}
const baseTableColumns = computed(() => {
  switch (currentPage.value.kind) {
    case 'sales-marketing': return activeSalesTable.value?.columns || []
    case 'traders-suppliers': return traderColumns.value
    case 'reference-data': return referenceColumns.value
    case 'customs-legal': return legalColumns.value
    case 'internal-directory': return internalColumns.value
    case 'quality-control': return activeQualityTab.value.columns
    case 'analysis-statistics': return analysisColumns.value
    case 'page-fcl':
      if (activeFclTab.value.id === 'locations') return [{ key: 'key', label: 'ID' }, { key: 'title', label: 'From / To Port / Location' }, { key: 'type', label: 'Type' }, { key: 'country', label: 'Country / Region' }, { key: 'countryCode', label: 'Country Code' }, { key: 'keywords', label: 'Keywords' }, { key: 'status', label: 'Status' }]
      if (activeFclTab.value.id === 'cargo') return [{ key: 'key', label: 'Code' }, { key: 'title', label: 'Commodity' }, { key: 'hsCode', label: 'HS Code' }, { key: 'flags', label: 'Flags' }, { key: 'status', label: 'Status' }]
      if (activeFclTab.value.id === 'shipping') return [{ key: 'key', label: 'Code' }, { key: 'title', label: 'Container Type & Size' }, { key: 'group', label: 'Group' }, { key: 'value', label: 'Value' }, { key: 'flags', label: 'Flags' }, { key: 'status', label: 'Status' }]
      return [{ key: 'key', label: 'ID' }, { key: 'title', label: 'Service Name' }, { key: 'group', label: 'Group' }, { key: 'status', label: 'Status' }]
    case 'page-products': return [{ key: 'section', label: 'Section' }, { key: 'title', label: 'Title' }, { key: 'subtitle', label: 'Subtitle' }, { key: 'tab', label: 'Tab' }, { key: 'serviceType', label: 'Type' }, { key: 'status', label: 'Status' }, { key: 'sortOrder', label: 'Sort' }]
    case 'page-solutions': return [{ key: 'key', label: 'Key' }, { key: 'category', label: 'Category' }, { key: 'title', label: 'Title' }, { key: 'gridTitle', label: 'Grid Title' }, { key: 'status', label: 'Status' }]
    case 'page-local-information': return [{ key: 'section', label: 'Section' }, { key: 'code', label: 'Code' }, { key: 'title', label: 'Title / Name' }, { key: 'iso', label: 'ISO' }, { key: 'flagKey', label: 'Flag Key' }, { key: 'status', label: 'Status' }, { key: 'sortOrder', label: 'Sort' }]
    case 'master-ports': return [{ key: 'code', label: 'UN/LOCODE' }, { key: 'name', label: 'Port Name' }, { key: 'city', label: 'City' }]
    case 'master-cfs': return [{ key: 'code', label: 'CFS Code' }, { key: 'name', label: 'Warehouse Name' }, { key: 'addr', label: 'Address' }, { key: 'port', label: 'Linked Port' }]
    case 'master-admin': return [{ key: 'zip', label: 'Postal Code' }, { key: 'prov', label: 'Province' }, { key: 'dist', label: 'District' }, { key: 'ward', label: 'Ward' }]
    case 'trucking': return [{ key: 'port', label: 'Port / CFS' }, { key: 'zip', label: 'Postal Code' }, { key: 'mode', label: 'Mode' }, { key: 'rates', label: 'Rate Table' }, { key: 'validity', label: 'Validity' }]
    case 'ocean': return [{ key: 'lane', label: 'POL > POD' }, { key: 'carrier', label: 'Carrier' }, { key: 'mode', label: 'Mode' }, { key: 'freight', label: 'Freight' }, { key: 'schedule', label: 'Schedule / Transit' }, { key: 'freetime', label: 'Freetime O/D' }, { key: 'validity', label: 'Validity' }]
    case 'localcharge': return [{ key: 'feeType', label: 'Fee Type' }, { key: 'mode', label: 'Mode' }, { key: 'rates', label: 'Rate Table' }, { key: 'validity', label: 'Validity' }]
    case 'flat': return [{ key: 'unit', label: 'Unit' }, { key: 'rates', label: 'Rate Table' }, { key: 'validity', label: 'Validity' }]
    default: {
      const cols: any[] = []
      if (currentPage.value.feeTypes) cols.push({ key: 'feeType', label: 'Fee Type' })
      if (currentPage.value.scope) cols.push({ key: 'scope', label: 'Port / Scope' })
      cols.push({ key: 'mode', label: 'Mode' }, { key: 'rates', label: 'Rate Table' }, { key: 'validity', label: 'Validity' })
      if (currentPage.value.inspect) cols.push({ key: 'note', label: 'Notes' })
      return cols
    }
  }
})

const SM_COL_WIDTH_KEY = 'shoptrans_sm_colw_v1'
const loadSalesColumnWidths = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(SM_COL_WIDTH_KEY) || '{}')
    if (saved && typeof saved === 'object') Object.assign(smColWidths, saved)
  } catch (e) {}
}
const ensureSalesColumnWidthPage = (pageId = activeSalesPageId.value) => {
  if (!smColWidths[pageId]) smColWidths[pageId] = {}
  return smColWidths[pageId]
}
const saveSalesColumnWidths = () => {
  try {
    localStorage.setItem(SM_COL_WIDTH_KEY, JSON.stringify(smColWidths))
  } catch (e) {}
}
const salesColumnWidth = (key: string, fallback: number) => {
  const saved = smColWidths[activeSalesPageId.value]?.[key]
  return Math.max(44, Number(saved || fallback || 140))
}
const salesOrderWidth = computed(() => salesColumnWidth('__order', 60))
const salesTableWidth = computed(() => {
  if (!isSheetGridPage.value) return 0
  return 36 + salesOrderWidth.value + tableColumns.value.reduce((sum: number, column: any) => sum + salesColumnWidth(column.key, column.w || 140), 0)
})
const refreshSmLedge = async () => {
  smLedgeTick.value++
  await nextTick()
  smLedgeTick.value++
}
const smLedgeStyle = computed(() => {
  smLedgeTick.value
  if (!smAdding.value && !smEditId.value) return {}
  const wrap = typeof document === 'undefined' ? null : document.querySelector('.sm-tablewrap') as HTMLElement | null
  const table = typeof document === 'undefined' ? null : document.querySelector('.sm-tablewrap table') as HTMLElement | null
  const row = typeof document === 'undefined' ? null : document.querySelector('.sm-tablewrap tbody tr.sm-editing') as HTMLElement | null
  if (!wrap || !table || !row) return {}
  const ledgeWidth = 126
  const emailIndex = tableColumns.value.findIndex((column: any) => column.key === 'email')
  const anchorCell = row.children[emailIndex >= 0 ? emailIndex + 2 : 1] as HTMLElement | undefined
  const cellLeft = table.offsetLeft + (anchorCell?.offsetLeft || 0)
  const cellWidth = anchorCell?.offsetWidth || 0
  const left = cellWidth < ledgeWidth ? cellLeft : Math.max(cellLeft, Math.min(cellLeft + (cellWidth - ledgeWidth) / 2, cellLeft + cellWidth - ledgeWidth))
  const compactRowHeight = 34
  return {
    top: `${table.offsetTop + row.offsetTop + compactRowHeight - 1.5}px`,
    left: `${left}px`,
  }
})
const activeSmCustomColumns = computed(() => smCustomColumns[activeSalesPageId.value] || [])
const mergeSmColumns = (baseColumns: any[], customColumns: any[]) => {
  const output = [...baseColumns]
  const pending = [...customColumns]
  let guard = 0
  while (pending.length && guard++ < 100) {
    const column = pending.shift()
    const afterKey = column?.afterKey
    if (afterKey === '__order') { output.unshift(column); continue }
    const index = afterKey ? output.findIndex((item: any) => item.key === afterKey) : -1
    if (index >= 0) output.splice(index + 1, 0, column)
    else output.push(column)
  }
  return output
}
const tableColumns = computed(() => mergeSmColumns(baseTableColumns.value, activeSmCustomColumns.value))
const salesTableStyle = computed(() => ({
  width: `${salesTableWidth.value}px`,
}))

const AI_KEY_STORE = 'shoptrans_ai_key_v1'
const AI_MODEL_STORE = 'shoptrans_ai_model_v1'
const AI_PANEL_STORE = 'shoptrans_ai_panel_v1'
const AI_TOOLS = [
  { name: 'list_tables', description: 'List every data table available in the current admin app context.', input_schema: { type: 'object', properties: {}, required: [] } },
  { name: 'get_schema', description: 'Get one table schema. Always call this before insert_rows.', input_schema: { type: 'object', properties: { table_key: { type: 'string' } }, required: ['table_key'] } },
  {
    name: 'query_data',
    description: 'Read data from one table. Supports AND filters, sort, limit, and aggregate.',
    input_schema: {
      type: 'object',
      properties: {
        table_key: { type: 'string' },
        filters: { type: 'array', items: { type: 'object', properties: { field: { type: 'string' }, op: { type: 'string', enum: ['eq', 'neq', 'contains', 'gt', 'gte', 'lt', 'lte', 'empty', 'not_empty'] }, value: {} }, required: ['field', 'op'] } },
        sort_by: { type: 'string' },
        sort_dir: { type: 'string', enum: ['asc', 'desc'] },
        limit: { type: 'integer' },
        aggregate: { type: 'object', properties: { group_by: { type: 'string' }, metrics: { type: 'array', items: { type: 'object', properties: { field: { type: 'string' }, fn: { type: 'string', enum: ['sum', 'count', 'avg', 'min', 'max'] } }, required: ['field', 'fn'] } } } },
      },
      required: ['table_key'],
    },
  },
  { name: 'insert_rows', description: 'Show an editable preview of new rows for a writable table. Rows are saved only after the user clicks Apply.', input_schema: { type: 'object', properties: { table_key: { type: 'string' }, rows: { type: 'array', items: { type: 'object' } } }, required: ['table_key', 'rows'] } },
]

const escHtml = (value: any) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[char])

const aiCurrentPath = () => {
  if (currentPage.value.kind === 'sales-marketing') return state.smTop === 'MassSales'
    ? 'Sales & Marketing / MassSales'
    : `Sales & Marketing / ${state.smTop} / ${state.smMode} / ${activeSalesTableLabel.value}`
  if (currentPage.value.kind === 'traders-suppliers') return `Traders & Suppliers / ${activeSalesTableLabel.value}`
  if (currentPage.value.kind === 'reference-data') return `Reference Data / ${activeSalesTableLabel.value}`
  if (currentPage.value.kind === 'customs-legal') return `Customs & Legal / ${activeSalesTableLabel.value}`
  if (currentPage.value.kind === 'internal-directory') return `Internal Directory / ${activeSalesTableLabel.value}`
  if (currentPage.value.kind === 'quality-control') return `Quality Control / ${activeSalesTableLabel.value}`
  if (currentPage.value.kind === 'analysis-statistics') return `Analysis & Statistics / ${state.analysisTop} / ${activeSalesTableLabel.value}`
  return cleanTitle(currentPage.value.title || 'Current page')
}

const aiColumnsFor = (columns: any[]) => columns
  .filter((column) => column?.key && !['order'].includes(column.kind))
  .map((column) => ({
    key: column.key,
    label: column.label || column.key,
    kind: column.kind || (column.type === 'select' ? 'select' : 'text'),
    opts: column.opts || column.options,
    optional: Boolean(column.optional || column.kind === 'computed' || column.kind === 'id'),
    required: Boolean(column.required),
  }))

const aiTableDefs = () => {
  const defs: any[] = []
  const push = (tableKey: string, label: string, path: string, columns: any[], writable = true, country = recordCountry.value, kind = currentPage.value.kind) => {
    if (!tableKey || defs.some((item) => item.table_key === tableKey)) return
    defs.push({
      table_key: tableKey,
      key: tableKey,
      label,
      path,
      country,
      kind,
      writable,
      columns: aiColumnsFor(columns),
    })
  }

  if (isSheetGridPage.value && activeSalesTable.value) push(recordPage.value, activeSalesTableLabel.value, aiCurrentPath(), tableColumns.value, !activeSalesTable.value.readOnly, recordCountry.value, currentPage.value.kind)
  traderTabs.value.forEach((tab: any) => push(`traders_${tab.id}`, tab.label, `Traders & Suppliers / ${tab.label}`, traderColumns.value, true, state.country, 'traders-suppliers'))
  referenceTabs.value.forEach((tab: any) => push(`ref_${tab.id}`, tab.label, `Reference Data / ${tab.label}`, [...(tab.columns || []), ...salesStatusNotesFields()], true, 'GLOBAL', 'reference-data'))
  legalTabs.value.forEach((tab: any) => push(`legal_${tab.id}`, tab.label, `Customs & Legal / ${tab.label}`, [...(tab.columns || []), ...salesStatusNotesFields()], true, 'GLOBAL', 'customs-legal'))
  internalTabs.value.forEach((tab: any) => push(`internal_${tab.id}`, tab.label, `Internal Directory / ${tab.label}`, [...(tab.columns || []), ...salesStatusNotesFields()], true, 'GLOBAL', 'internal-directory'))
  Object.entries(salesFeeTabs).forEach(([top, modes]: any) => {
    Object.entries(modes).forEach(([mode, tabs]: any) => {
      tabs.forEach((tab: any) => push(`sm_${tab.id}`, tab.label, `Sales & Marketing / ${top} / ${mode} / ${tab.label}`, tab.columns || [], true, state.country, 'sales-marketing'))
    })
  })
  Object.values(analysisLeafTables).forEach((tab: any) => push(`analysis_${tab.id}`, tab.label, `Analysis & Statistics / ${tab.label}`, tab.columns || [], false, 'GLOBAL', 'analysis-statistics'))
  analysisVolumeTabs.forEach((tab: any) => push(`analysis_${tab.id}`, tab.label, `Analysis & Statistics / Volume / ${tab.label}`, tab.columns || [], false, 'GLOBAL', 'analysis-statistics'))
  analysisApprovalTabs.forEach((tab: any) => push(`analysis_${tab.id}`, tab.label, `Analysis & Statistics / ApprovalList / ${tab.label}`, tab.columns || [], false, 'GLOBAL', 'analysis-statistics'))
  return defs
}

const aiFindTable = (key: string) => aiTableDefs().find((item) => item.table_key === key || item.key === key)
const aiMessageHtml = (text: string) => escHtml(text).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\n/g, '<br>')
const scrollAiBottom = () => nextTick(() => {
  if (aiMsgsRef.value) aiMsgsRef.value.scrollTop = aiMsgsRef.value.scrollHeight
})
const pushAiMessage = (role: AiMessage['role'], text: string, preview?: AiPreview) => {
  ai.messages.push({ id: `ai-${++aiSeq}`, role, text, preview })
  scrollAiBottom()
}
const saveAiPanelSettings = () => {
  try { localStorage.setItem(AI_PANEL_STORE, JSON.stringify({ w: ai.panelW, h: ai.panelH, b: ai.bottom })) } catch (e) {}
}
const toggleAiPanel = () => {
  if (aiVerticalDragSuppress) {
    aiVerticalDragSuppress = false
    return
  }
  ai.open = !ai.open
  if (ai.open) nextTick(() => aiInputRef.value?.focus())
}
const toggleAiSettings = () => {
  ai.settingsOpen = !ai.settingsOpen
  ai.apiKeyDraft = ai.apiKey
}
const saveAiKey = () => {
  ai.apiKey = ai.apiKeyDraft.trim()
  try {
    if (ai.apiKey) localStorage.setItem(AI_KEY_STORE, ai.apiKey)
    else localStorage.removeItem(AI_KEY_STORE)
  } catch (e) {}
  ai.settingsOpen = false
  pushAiMessage('sys', ai.apiKey ? 'API key saved.' : 'API key cleared.')
}
const saveAiModel = () => {
  ai.model = ai.model.trim() || 'claude-sonnet-4-6'
  try { localStorage.setItem(AI_MODEL_STORE, ai.model) } catch (e) {}
  pushAiMessage('sys', `Model saved: ${ai.model}`)
}
const clearAiChat = () => {
  ai.history = []
  ai.pendingNotes = []
  ai.messages.splice(0, ai.messages.length, {
    id: 'ai-welcome-reset',
    role: 'ai',
    text: 'Hi! I can look up your data or enter new rows for you. Try: "Tong revenue theo customer nam 2025" or attach a booking file and tell me which table to fill.',
  })
}
const aiPreviewBad = (preview: AiPreview, row: Record<string, any>, column: any) => {
  const value = row[column.key]
  if (column.kind === 'select' && column.opts?.length && String(value || '').trim() && !column.opts.includes(value)) return true
  if (column.required && !String(value || '').trim()) return true
  return false
}
const aiPreviewHasErrors = (preview: AiPreview) => preview.rows.some((row) => preview.columns.some((column) => aiPreviewBad(preview, row, column)))
const aiPreviewValid = (preview: AiPreview) => {
  preview.error = ''
  const bad = aiPreviewHasErrors(preview)
  if (bad) preview.error = 'Fix the red fields first'
  return !bad
}
const cancelAiPreview = (preview: AiPreview) => {
  preview.cancelled = true
  ai.pendingNotes.push(`User cancelled insert preview for ${preview.label}; nothing saved`)
}
const applyAiPreview = async (preview: AiPreview) => {
  if (!aiPreviewValid(preview)) return
  ai.loading = true
  try {
    let inserted = 0
    for (const [index, row] of preview.rows.entries()) {
      const data: Record<string, any> = {}
      preview.columns.forEach((column) => {
        if (!['computed', 'id', 'order'].includes(column.kind)) data[column.key] = row[column.key] ?? ''
      })
      if (!data.status && preview.columns.some((column) => column.key === 'status')) data.status = 'Active'
      data.table = preview.label
      await apiFetch('/records', {
        method: 'POST',
        body: {
          country: preview.country,
          page: preview.tableKey,
          kind: preview.kind,
          data,
          sortOrder: records.value.length + index + 1,
        },
      })
      inserted++
    }
    preview.applied = true
    preview.inserted = inserted
    ai.pendingNotes.push(`User clicked Apply: ${inserted} rows inserted into ${preview.label}`)
    if (preview.tableKey === recordPage.value) await loadRecords()
  } catch (error: any) {
    preview.error = error?.message || String(error)
    pushAiMessage('err', `Error: ${preview.error}`)
  } finally {
    ai.loading = false
    scrollAiBottom()
  }
}
const aiCmp = (a: any, b: any) => {
  const na = Number(String(a ?? '').replace(/,/g, ''))
  const nb = Number(String(b ?? '').replace(/,/g, ''))
  if (!Number.isNaN(na) && !Number.isNaN(nb) && String(a ?? '').trim() && String(b ?? '').trim()) return na - nb
  return String(a ?? '').toLowerCase().localeCompare(String(b ?? '').toLowerCase())
}
const aiPlainRows = async (tableKey: string, limit = 1000) => {
  const def = aiFindTable(tableKey)
  if (!def) return []
  const result = await apiFetch(`/records?country=${encodeURIComponent(def.country)}&page=${encodeURIComponent(def.table_key)}&limit=${Math.max(1, Math.min(limit, 1000))}`)
  const items = Array.isArray(result.items) ? result.items : []
  return items.map((record: AdminRecord, index: number) => ({ order: index + 1, ...dataOf(record) }))
}
const aiQueryData = async (input: any = {}) => {
  const def = aiFindTable(input.table_key)
  if (!def) return { error: `Unknown table_key: ${input.table_key}` }
  let rows = await aiPlainRows(def.table_key, 1000)
  ;(input.filters || []).forEach((filter: any) => {
    rows = rows.filter((row: any) => {
      const value = String(row[filter.field] ?? '')
      const target = String(filter.value ?? '')
      if (filter.op === 'eq') return value.toLowerCase() === target.toLowerCase()
      if (filter.op === 'neq') return value.toLowerCase() !== target.toLowerCase()
      if (filter.op === 'contains') return value.toLowerCase().includes(target.toLowerCase())
      if (filter.op === 'gt') return aiCmp(value, target) > 0
      if (filter.op === 'gte') return aiCmp(value, target) >= 0
      if (filter.op === 'lt') return aiCmp(value, target) < 0
      if (filter.op === 'lte') return aiCmp(value, target) <= 0
      if (filter.op === 'empty') return value.trim() === ''
      if (filter.op === 'not_empty') return value.trim() !== ''
      return true
    })
  })
  const matched = rows.length
  if (input.aggregate?.metrics?.length) {
    const grouped: Record<string, any[]> = {}
    rows.forEach((row: any) => {
      const key = input.aggregate.group_by ? String(row[input.aggregate.group_by] ?? '') : 'ALL'
      ;(grouped[key] ||= []).push(row)
    })
    let groups = Object.entries(grouped).map(([key, groupRows]) => {
      const out: Record<string, any> = {}
      if (input.aggregate.group_by) out[input.aggregate.group_by] = key
      input.aggregate.metrics.forEach((metric: any) => {
        const nums = groupRows.map((row: any) => Number(String(row[metric.field] ?? '').replace(/,/g, ''))).filter((num) => !Number.isNaN(num))
        let value: any = null
        if (metric.fn === 'count') value = groupRows.length
        if (metric.fn === 'sum') value = nums.reduce((sum, num) => sum + num, 0)
        if (metric.fn === 'avg') value = nums.length ? nums.reduce((sum, num) => sum + num, 0) / nums.length : 0
        if (metric.fn === 'min') value = nums.length ? Math.min(...nums) : null
        if (metric.fn === 'max') value = nums.length ? Math.max(...nums) : null
        out[`${metric.fn}_${metric.field}`] = typeof value === 'number' ? Math.round(value * 100) / 100 : value
      })
      return out
    })
    if (input.sort_by) groups = groups.sort((a: any, b: any) => (input.sort_dir === 'desc' ? -1 : 1) * aiCmp(a[input.sort_by], b[input.sort_by]))
    return { matched_rows: matched, groups: groups.slice(0, input.limit || 100) }
  }
  if (input.sort_by) rows = rows.sort((a: any, b: any) => (input.sort_dir === 'desc' ? -1 : 1) * aiCmp(a[input.sort_by], b[input.sort_by]))
  return { matched_rows: matched, returned: Math.min(rows.length, input.limit || 50), rows: rows.slice(0, Math.min(input.limit || 50, 200)) }
}
const aiInsertRows = (input: any = {}) => {
  const def = aiFindTable(input.table_key)
  if (!def) return { error: `Unknown table_key: ${input.table_key}` }
  if (!def.writable) return { error: `Table "${def.label}" is read-only` }
  const rows = Array.isArray(input.rows) ? input.rows : []
  if (!rows.length) return { error: 'rows must be a non-empty array' }
  const preview: AiPreview = {
    id: `aip-${++aiSeq}`,
    tableKey: def.table_key,
    label: def.label,
    path: def.path,
    country: def.country,
    kind: def.kind,
    columns: def.columns.filter((column: any) => !['order', 'id', 'computed'].includes(column.kind)),
    rows: rows.slice(0, 200).map((row: any) => {
      const out: Record<string, any> = {}
      def.columns.forEach((column: any) => {
        if (!['order', 'id', 'computed'].includes(column.kind)) out[column.key] = row[column.key] ?? (column.kind === 'select' && column.opts?.length ? column.opts[0] : '')
      })
      return out
    }),
  }
  pushAiMessage('ai', '', preview)
  return { status: 'preview_shown', rows: preview.rows.length, table: def.label, note: 'Rows are NOT saved yet. Ask the user to review the preview and click Apply.' }
}
const runAiTool = async (name: string, input: any = {}) => {
  if (name === 'list_tables') return aiTableDefs().map((def) => ({ table_key: def.table_key, label: def.label, location: def.path, writable: def.writable, country: def.country }))
  if (name === 'get_schema') {
    const def = aiFindTable(input.table_key)
    if (!def) return { error: `Unknown table_key: ${input.table_key}` }
    return { table_key: def.table_key, label: def.label, writable: def.writable, fields: def.columns }
  }
  if (name === 'query_data') return await aiQueryData(input)
  if (name === 'insert_rows') return aiInsertRows(input)
  return { error: `Unknown tool: ${name}` }
}
const aiSystemPrompt = () => {
  const tables = aiTableDefs().map((table) => `${table.table_key} | ${table.label} | ${table.path} | ${table.writable ? 'writable' : 'read-only'}`)
  return [
    'You are the AI assistant embedded in SHOPTRANS MS, a freight-forwarding management app.',
    'All admin data is reached only through your tools. Current implementation saves approved inserts through the backend API/database.',
    `TABLES:\n${tables.join('\n')}`,
    `CURRENT UI CONTEXT: ${aiCurrentPath()}`,
    'RULES:',
    '- Reply in the language the user writes, usually Vietnamese. Be concise.',
    '- Never invent data. If a value is unknown, omit the field or ask one short question.',
    '- Before insert_rows you must call get_schema for the target table and match select options exactly.',
    '- insert_rows only opens a preview; the user must click Apply. Do not say data is saved until a later system note says Apply was clicked.',
    '- Use query_data aggregate for broad questions.',
  ].join('\n')
}
const callAiApi = async () => {
  try {
    return await apiFetch('/ai/chat', {
      method: 'POST',
      body: {
        model: ai.model || 'claude-sonnet-4-6',
        max_tokens: 3000,
        system: aiSystemPrompt(),
        tools: AI_TOOLS,
        messages: ai.history,
        apiKey: ai.apiKey || undefined,
      },
    })
  } catch (error: any) {
    const message = error?.data?.message || error?.statusMessage || error?.message || String(error)
    throw new Error(message)
  }
}
const aiLoop = async (iteration = 0) => {
  const data = await callAiApi()
  ai.history.push({ role: 'assistant', content: data.content })
  const texts = (data.content || []).filter((block: any) => block.type === 'text').map((block: any) => block.text).join('\n').trim()
  if (texts) pushAiMessage('ai', texts)
  const toolUses = (data.content || []).filter((block: any) => block.type === 'tool_use')
  if (data.stop_reason !== 'tool_use' || !toolUses.length) return
  const results = []
  for (const toolUse of toolUses) {
    const result = await runAiTool(toolUse.name, toolUse.input || {})
    results.push({ type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(result) })
  }
  ai.history.push({ role: 'user', content: results })
  if (iteration >= 6) {
    pushAiMessage('sys', 'Stopped: too many tool steps in one turn.')
    return
  }
  await aiLoop(iteration + 1)
}
const sendAiMessage = async () => {
  if (ai.loading) return
  const text = ai.input.trim()
  if (!text && !ai.images.length) return
  if (!ai.apiKey) {
    ai.settingsOpen = true
    ai.apiKeyDraft = ai.apiKey
    pushAiMessage('sys', 'Set your Anthropic API key first (gear icon).')
    return
  }
  const pendingPreviews = ai.messages.filter((message) => message.preview && !message.preview.applied && !message.preview.cancelled)
  if (pendingPreviews.length && !ai.images.length && /^(apply|ap dung|ok|yes|dong y)$/i.test(text)) {
    pushAiMessage('sys', 'Here is the preview - click the green Apply button to save (you can edit the cells first).')
    ai.input = ''
    return
  }
  const content: any[] = ai.images.map((image) => ({ type: 'image', source: { type: 'base64', media_type: image.type, data: image.data } }))
  let outgoing = text || '(see attached image)'
  const notes = ai.pendingNotes.splice(0)
  if (pendingPreviews.length) notes.push(`${pendingPreviews.length} insert preview card(s) are still awaiting Apply or Cancel; nothing from them is saved`)
  if (notes.length) outgoing = `[system note: ${notes.join(' | ')}]\n${outgoing}`
  content.push({ type: 'text', text: outgoing })
  ai.history.push({ role: 'user', content })
  pushAiMessage('user', `${text}${ai.images.length ? `${text ? '\n' : ''}[image] ${ai.images.length} image${ai.images.length === 1 ? '' : 's'}` : ''}`)
  ai.input = ''
  ai.images.splice(0)
  ai.inputH = 36
  ai.loading = true
  try {
    if (ai.history.length > 44) ai.history.splice(0, ai.history.length - 32)
    await aiLoop()
  } catch (error: any) {
    pushAiMessage('err', `Error: ${error?.message || String(error)}`)
  } finally {
    ai.loading = false
    scrollAiBottom()
  }
}
const autoSizeAiInput = () => {
  const el = aiInputRef.value
  if (!el || aiInputResize) return
  ai.inputH = 36
  nextTick(() => { ai.inputH = Math.max(36, Math.min(el.scrollHeight, 200)) })
}
const compressAiImage = (file: File) => new Promise<AiImage>((resolve, reject) => {
  if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) return reject(new Error(`Unsupported image type: ${file.type || 'unknown'}`))
  if (file.size > 12000000) return reject(new Error('Image too large (max 12 MB).'))
  const reader = new FileReader()
  reader.onload = () => {
    const raw = String(reader.result || '')
    const image = new Image()
    image.onload = () => {
      const max = 1568
      const large = raw.length > 1600000 || image.width > max || image.height > max
      if (!large) return resolve({ name: file.name, type: file.type, url: raw, data: raw.split(',')[1] || '' })
      const scale = Math.min(1, max / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(image.width * scale)
      canvas.height = Math.round(image.height * scale)
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      }
      const url = canvas.toDataURL('image/jpeg', 0.85)
      resolve({ name: file.name, type: 'image/jpeg', url, data: url.split(',')[1] || '' })
    }
    image.onerror = () => resolve({ name: file.name, type: file.type, url: raw, data: raw.split(',')[1] || '' })
    image.src = raw
  }
  reader.onerror = () => reject(new Error('Could not read image'))
  reader.readAsDataURL(file)
})
const addAiFiles = async (files: FileList | File[]) => {
  for (const file of Array.from(files)) {
    if (ai.images.length >= 5) {
      pushAiMessage('sys', 'Max 5 images per message.')
      break
    }
    try {
      ai.images.push(await compressAiImage(file))
    } catch (error: any) {
      pushAiMessage('sys', error?.message || String(error))
    }
  }
}
const handleAiFiles = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) await addAiFiles(input.files)
  input.value = ''
}
const handleAiDrop = async (event: DragEvent) => {
  ai.dragging = false
  if (event.dataTransfer?.files?.length) await addAiFiles(event.dataTransfer.files)
}
const removeAiImage = (index: number) => ai.images.splice(index, 1)
const openAiFilePicker = () => aiFileInput.value?.click()
const startAiInputResize = (event: MouseEvent) => {
  aiInputResize = { y: event.clientY, h: ai.inputH }
  document.body.style.userSelect = 'none'
}
const moveAiInputResize = (event: MouseEvent) => {
  if (!aiInputResize) return
  ai.inputH = Math.max(36, Math.min(aiInputResize.h + (aiInputResize.y - event.clientY), Math.round(window.innerHeight * 0.5)))
}
const stopAiInputResize = () => {
  if (!aiInputResize) return
  aiInputResize = null
  document.body.style.userSelect = ''
}
const startAiPanelResize = (event: MouseEvent) => {
  aiPanelResize = { x: event.clientX, y: event.clientY, w: ai.panelW, h: ai.panelH }
  document.body.style.userSelect = 'none'
}
const moveAiPanelResize = (event: MouseEvent) => {
  if (!aiPanelResize) return
  ai.panelW = Math.max(320, Math.min(aiPanelResize.w + (aiPanelResize.x - event.clientX), Math.max(320, window.innerWidth - 30)))
  ai.panelH = Math.max(360, Math.min(aiPanelResize.h + (aiPanelResize.y - event.clientY), Math.max(360, window.innerHeight - 110)))
}
const stopAiPanelResize = () => {
  if (!aiPanelResize) return
  aiPanelResize = null
  document.body.style.userSelect = ''
  saveAiPanelSettings()
}
const startAiVerticalDrag = (event: MouseEvent) => {
  aiVerticalDrag = { y: event.clientY, bottom: ai.bottom }
  aiVerticalDragMoved = false
  document.body.style.userSelect = 'none'
}
const moveAiVerticalDrag = (event: MouseEvent) => {
  if (!aiVerticalDrag) return
  const nextBottom = aiVerticalDrag.bottom + (aiVerticalDrag.y - event.clientY)
  ai.bottom = Math.max(12, Math.min(nextBottom, Math.max(12, window.innerHeight - 96)))
  if (Math.abs(event.clientY - aiVerticalDrag.y) > 3) aiVerticalDragMoved = true
}
const stopAiVerticalDrag = () => {
  if (!aiVerticalDrag) return
  aiVerticalDrag = null
  document.body.style.userSelect = ''
  if (aiVerticalDragMoved) aiVerticalDragSuppress = true
  aiVerticalDragMoved = false
  saveAiPanelSettings()
}
const canRemoveSmColumn = computed(() => {
  const column = activeSmCustomColumns.value.find((item: any) => item.key === smHeaderMenu.columnKey)
  return Boolean(column?.custom)
})
const SM_COLUMN_CONFIG_PAGE = 'sheet_grid_columns_config'
const loadSmColumnConfig = async () => {
  try {
    const result = await apiFetch(`/records?country=GLOBAL&page=${encodeURIComponent(SM_COLUMN_CONFIG_PAGE)}&limit=1`)
    const record = Array.isArray(result.items) ? result.items[0] : null
    smColumnConfigId.value = record?.id || ''
    Object.keys(smCustomColumns).forEach((key) => delete smCustomColumns[key])
    const columns = record?.data?.columns
    if (columns && typeof columns === 'object') {
      Object.entries(columns).forEach(([pageId, items]) => {
        smCustomColumns[pageId] = Array.isArray(items)
          ? items
            .filter((column: any) => column?.custom && column?.key && column?.label)
            .map((column: any) => salesField(String(column.key), String(column.label), Number(column.w || 140), { custom: true, afterKey: column.afterKey || '' }))
          : []
      })
    }
  } catch (error) {
    console.error('Could not load sheet grid column config', error)
  }
}
const saveSmColumnConfig = async () => {
  const body = {
    country: 'GLOBAL',
    page: SM_COLUMN_CONFIG_PAGE,
    kind: 'sheet-grid-columns',
    data: {
      type: 'sheet-grid-columns',
      columns: Object.fromEntries(Object.entries(smCustomColumns).map(([pageId, columns]) => [
        pageId,
        columns.map((column: any) => ({ key: column.key, label: column.label, w: column.w || 140, custom: true, afterKey: column.afterKey || '' })),
      ])),
      status: 'Active',
    },
    sortOrder: 1,
  }
  const result = smColumnConfigId.value
    ? await apiFetch(`/records/${smColumnConfigId.value}`, { method: 'PATCH', body })
    : await apiFetch('/records', { method: 'POST', body })
  smColumnConfigId.value = result?.id || smColumnConfigId.value
}
const openSmHeaderMenu = (column: any, event: MouseEvent) => {
  if (!isSheetGridPage.value) return
  event.preventDefault()
  event.stopPropagation()
  smHeaderMenu.open = true
  smHeaderMenu.pageId = activeSalesPageId.value
  smHeaderMenu.columnKey = column.key
  smHeaderMenu.x = Math.max(8, Math.min(event.clientX, window.innerWidth - 190))
  smHeaderMenu.y = Math.max(8, Math.min(event.clientY, window.innerHeight - 92))
}
const closeSmHeaderMenu = () => {
  smHeaderMenu.open = false
  smHeaderMenu.pageId = ''
  smHeaderMenu.columnKey = ''
}
const ensureSmCustomColumnPage = (pageId = activeSalesPageId.value) => {
  if (!smCustomColumns[pageId]) smCustomColumns[pageId] = []
  return smCustomColumns[pageId]
}
const addSmColumn = async () => {
  const pageId = smHeaderMenu.pageId || activeSalesPageId.value
  const afterKey = smHeaderMenu.columnKey
  closeSmHeaderMenu()
  const label = (await promptAdmin('Add column', '', '', 'Enter a name for the new column.', 'e.g. Contract No#'))?.trim()
  if (!label) return
  const existing = new Set([
    ...baseTableColumns.value.map((column: any) => String(column.label).toLowerCase()),
    ...(smCustomColumns[pageId] || []).map((column: any) => String(column.label).toLowerCase()),
  ])
  if (existing.has(label.toLowerCase())) {
    await notifyAdmin('A column with this name already exists.')
    return
  }
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'column'
  const keys = new Set([...baseTableColumns.value, ...(smCustomColumns[pageId] || [])].map((column: any) => column.key))
  let key = `custom_${slug}`
  let index = 2
  while (keys.has(key)) key = `custom_${slug}_${index++}`
  ensureSmCustomColumnPage(pageId).push(salesField(key, label, 140, { custom: true, afterKey }))
  await saveSmColumnConfig()
}
const removeSmColumn = async () => {
  const pageId = smHeaderMenu.pageId || activeSalesPageId.value
  const key = smHeaderMenu.columnKey
  const columns = smCustomColumns[pageId] || []
  const column = columns.find((item: any) => item.key === key)
  if (!column?.custom) return
  closeSmHeaderMenu()
  if (!(await confirmAdmin('This will permanently delete this column and its data in every row. This cannot be undone.', `Remove column: ${column.label}`, 'Confirm'))) return
  smCustomColumns[pageId] = columns.filter((item: any) => item.key !== key)
  for (const record of records.value) {
    if (record.page !== pageId) continue
    const data = { ...dataOf(record) }
    if (!(key in data)) continue
    delete data[key]
    await apiFetch(`/records/${record.id}`, {
      method: 'PATCH',
      body: { country: record.country, page: record.page, kind: record.kind, data, sortOrder: record.sortOrder || 0 },
    })
  }
  await saveSmColumnConfig()
  await loadRecords()
}
const startSalesColumnResize = (key: string, fallback: number, event: MouseEvent) => {
  if (!isSheetGridPage.value) return
  smColResize.active = true
  smColResize.page = activeSalesPageId.value
  smColResize.key = key
  smColResize.startX = event.clientX
  smColResize.startW = salesColumnWidth(key, fallback)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}
const moveSalesColumnResize = (event: MouseEvent) => {
  if (!smColResize.active) return
  const widths = ensureSalesColumnWidthPage(smColResize.page)
  widths[smColResize.key] = Math.max(44, Math.round(smColResize.startW + event.clientX - smColResize.startX))
}
const stopSalesColumnResize = () => {
  if (!smColResize.active) return
  smColResize.active = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  saveSalesColumnWidths()
}

const formatAdminDateDisplay = (value: any) => {
  if (value == null || value === '') return value
  const raw = String(value).trim()
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:(?:T|\s)(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/)
  if (!match) return value
  const date = `${match[3]}/${match[2]}/${match[1]}`
  return match[4] ? `${date} ${match[4]}:${match[5]}` : date
}

const cellValue = (record: AdminRecord, key: string) => {
  const data = dataOf(record)
  if (key === 'coverage') return coverageLabel(data.coverage)
  if (key.endsWith('_sell')) {
    const base = key.slice(0, -5)
    const value = data[key] ?? ''
    return value !== '' ? value : (data[base] ?? '')
  }
  const map: Record<string, any> = {
    code: data.code || data.primary || '',
    name: data.name || '',
    city: data.city || '',
    addr: data.addr || data.address || '',
    port: data.port || '',
    zip: data.zip || data.postalCode || '',
    prov: data.prov || data.province || '',
    dist: data.dist || data.district || '',
    ward: data.ward || '',
    key: data.key || '',
    section: currentPage.value.kind === 'page-fcl' ? fclSectionLabel(data.section || '') : data.section || '',
    title: data.title || data.name || '',
    subtitle: data.subtitle || '',
    description: data.description || '',
    summary: data.summary || data.description || '',
    group: data.group || '',
    country: data.country || '',
    region: data.region || '',
    countryCode: data.countryCode || '',
    label: data.label || '',
    hsCode: data.hsCode || '',
    value: data.value || '',
    keywords: data.keywords || '',
    flags: data.flags || [
      data.reefer ? 'Temperature control' : '',
      data.dangerous ? 'Dangerous cargo' : '',
      data.quoteOnly ? 'Quote only' : '',
      data.hideWeight ? 'Hide weight' : '',
    ].filter(Boolean).join(', '),
    tab: data.tab || '',
    serviceType: data.serviceType || data.type || '',
    type: data.type || data.serviceType || '',
    category: data.category || '',
    status: data.status || (data.isActive === false ? 'Inactive' : data.isActive === true ? 'Active' : ''),
    sortOrder: data.sortOrder ?? record.sortOrder ?? '',
    flagKey: data.flagKey || '',
    image: data.image || data.thumb || data.img || '',
    feeType: data.feeType || data.charge || '',
    scope: data.scope || 'All ports',
    unit: data.unit || currentPage.value.flatUnit || '',
    note: data.note || '',
    lane: `${data.pol || ''} > ${data.pod || ''}`.trim(),
    carrier: data.carrier || '-',
    schedule: `ETD ${data.etd || '-'} / ${data.transit || '?'}d / via ${data.via || 'Direct'}`,
    freetime: `${data.ftO || '-'} / ${data.ftD || '-'} days`,
  }
  return formatAdminDateDisplay(map[key] ?? data[key] ?? '-')
}

const cellClass = (key: string) => ['code', 'zip', 'feeType', 'lane', 'key'].includes(key) ? 'code-cell' : ''
const validCell = (record: AdminRecord) => {
  const data = dataOf(record)
  const from = data.from || data.validFrom || ''
  const to = data.to || data.validTo || ''
  if (!from && !to) return '<span class="ts-na">-</span>'
  return `<b>${formatAdminDateDisplay(from) || '...'}</b> -> <b>${formatAdminDateDisplay(to) || '...'}</b>`
}

const rateChips = (record: AdminRecord) => {
  const data = dataOf(record)
  const cur = data.cur || data.currency || currentCountry.value.cur || 'USD'
  const sym = currencySymbol(cur)
  if (data.r?.val != null || data.value != null) return [{ label: '', value: `${sym}${Number(data.r?.val ?? data.value).toLocaleString('en-US')} /${data.unit || 'SET'}` }]
  if (recordMode(record) === 'FCL') {
    return ['20GP', '40GP', '40HC', '45HC']
      .map((key) => ({ label: key, value: rateValue(record, key) }))
      .filter((item) => item.value != null && item.value !== '')
      .map((item) => ({ label: item.label, value: `${sym}${Number(item.value).toLocaleString('en-US')}` }))
  }
  const trucks = ['1T', '2.5T', '5T', '8T', '10T', '15T', '18T']
  return trucks
    .map((key) => ({ label: key, value: data.r?.[key] }))
    .filter((item) => item.value != null && item.value !== '')
    .map((item) => ({ label: item.label, value: `${sym}${Number(item.value).toLocaleString('en-US')}` }))
}

const compareSheetRecordOrder = (a: AdminRecord, b: AdminRecord) => {
  const sortOrder = (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0)
  if (sortOrder) return sortOrder
  const createdAt = String(a.createdAt || '').localeCompare(String(b.createdAt || ''))
  if (createdAt) return createdAt
  return String(a.id).localeCompare(String(b.id))
}
const filteredRows = computed(() => {
  const query = state.search.toLowerCase()
  let list = records.value
  if (currentPage.value.kind === 'page-fcl') {
    list = list.filter((record) => dataOf(record).section === activeFclTab.value.section)
  }
  if (isSheetGridPage.value) {
    list = list.slice().sort(compareSheetRecordOrder)
    if (showSheetStatusFilter.value && state.smStatus !== 'All') {
      list = list.filter((record) => String(dataOf(record).status || 'Active').toLowerCase() === String(state.smStatus).toLowerCase())
    }
    if (query) {
      list = list.filter((record) => {
        const data = dataOf(record)
        if (state.smSearchField && state.smSearchField !== 'all') return String(data[state.smSearchField] || '').toLowerCase().includes(query)
        return tableColumns.value.some((column: any) => String(data[column.key] || '').toLowerCase().includes(query))
      })
    }
    if (activeSalesAdvFilters.value.length) {
      list = list.filter((record) => activeSalesAdvFilters.value.every((filter) => salesAdvFilterMatches(record, filter)))
    }
  } else {
    list = list.filter((record) => !query || JSON.stringify(record).toLowerCase().includes(query))
  }
  if (showModeFilter.value && state.modeFilter !== 'ALL') list = list.filter((record) => recordMode(record) === state.modeFilter)
  if (state.sortKey) {
    list = list.slice().sort((a, b) => {
      const av = state.sortKey === 'entered' ? (a.updatedAt || a.createdAt || '') : String(cellValue(a, state.sortKey))
      const bv = state.sortKey === 'entered' ? (b.updatedAt || b.createdAt || '') : String(cellValue(b, state.sortKey))
      return av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' }) * state.sortDir
    })
  }
  return list
})
const isSalesFeeGrid = computed(() => currentPage.value.kind === 'sales-marketing' && state.smTop !== 'MassSales')
const pageCount = computed(() => isSalesFeeGrid.value || currentPage.value.kind === 'analysis-statistics' || state.pageSize === 'all' ? 1 : Math.max(1, Math.ceil(filteredRows.value.length / Number(state.pageSize))))
const pageRows = computed(() => {
  if (isSalesFeeGrid.value || currentPage.value.kind === 'analysis-statistics' || state.pageSize === 'all') return filteredRows.value
  const start = state.pageIndex * Number(state.pageSize)
  return filteredRows.value.slice(start, start + Number(state.pageSize))
})
const pageFrom = computed(() => filteredRows.value.length ? (isSalesFeeGrid.value || currentPage.value.kind === 'analysis-statistics' || state.pageSize === 'all' ? 1 : state.pageIndex * Number(state.pageSize) + 1) : 0)
const pageTo = computed(() => isSalesFeeGrid.value || currentPage.value.kind === 'analysis-statistics' || state.pageSize === 'all' ? filteredRows.value.length : Math.min(filteredRows.value.length, (state.pageIndex + 1) * Number(state.pageSize)))
const fxPageCount = computed(() => state.pageSize === 'all' ? 1 : Math.max(1, Math.ceil(currencies.value.length / Number(state.pageSize))))
const fxPageRows = computed(() => {
  if (state.pageSize === 'all') return currencies.value
  const start = state.pageIndex * Number(state.pageSize)
  return currencies.value.slice(start, start + Number(state.pageSize))
})
const fxPageFrom = computed(() => currencies.value.length ? (state.pageSize === 'all' ? 1 : state.pageIndex * Number(state.pageSize) + 1) : 0)
const fxPageTo = computed(() => state.pageSize === 'all' ? currencies.value.length : Math.min(currencies.value.length, (state.pageIndex + 1) * Number(state.pageSize)))
const selectablePageRowsForBulk = () => {
  if (rowSelectionDisabled.value) return [] as AdminRecord[]
  const keys = analysisSelectionGroupKeys.value
  if (!keys.length) return pageRows.value
  const ref = selectedRecordList()[0] || pageRows.value[0]
  if (!ref) return [] as AdminRecord[]
  return pageRows.value.filter((record) => sameAnalysisSelectionGroup(ref, record, keys))
}
const allPageSelected = computed(() => {
  const selectable = selectablePageRowsForBulk()
  return selectable.length > 0 && selectable.every((record) => state.selected.has(record.id))
})
const sortLabel = computed(() => tableColumns.value.find((column: any) => column.key === state.sortKey)?.label || 'Entered')
const sortMark = (key: string) => state.sortKey !== key ? '+' : (state.sortDir > 0 ? '^' : 'v')

const setMode = (mode: string) => {
  state.modeFilter = mode
  state.pageIndex = 0
}
const onSearch = () => {
  state.pageIndex = 0
}
const salesAdvFilterValue = (data: Record<string, any>, key: string) => key.endsWith('_mgn') ? mgnView(data, key).value : data[key]
const salesAdvFilterMatches = (record: AdminRecord, filter: { field: string, op: string, value: string, valueTo: string }) => {
  const data = dataOf(record)
  const values = filter.field === 'all'
    ? tableColumns.value.map((column: any) => salesAdvFilterValue(data, column.key))
    : [salesAdvFilterValue(data, filter.field)]
  if (filter.op === 'empty') return values.every((value) => !String(value ?? '').trim())
  if (filter.op === 'notempty') return values.some((value) => !!String(value ?? '').trim())
  if (filter.op === 'between') {
    const raw = String(values[0] ?? '')
    const current = raw ? new Date(raw).getTime() : NaN
    if (Number.isNaN(current)) return false
    const from = filter.value ? new Date(filter.value).getTime() : -Infinity
    const to = filter.valueTo ? new Date(filter.valueTo).getTime() : Infinity
    return current >= from && current <= to
  }
  const needle = String(filter.value || '').toLowerCase()
  return values.some((value) => String(value ?? '').toLowerCase().includes(needle))
}
const toggleSalesFilter = () => {
  state.smFilterOpen = !state.smFilterOpen
  if (state.smFilterOpen) {
    smFilterCollapsed.value = false
    if (!smAdvFilters.length) addSalesAdvFilter()
  }
}
const addSalesAdvFilter = () => smAdvFilters.push({ field: 'all', op: 'contains', value: '', valueTo: '' })
const resetSalesAdvFilter = (index: number) => {
  const filter = smAdvFilters[index]
  if (!filter) return
  filter.op = 'contains'
  filter.value = ''
  filter.valueTo = ''
}
const removeSalesAdvFilter = (index: number) => {
  smAdvFilters.splice(index, 1)
  state.pageIndex = 0
  if (!smAdvFilters.length) state.smFilterOpen = false
}
const applySalesAdvFilters = () => {
  for (let index = smAdvFilters.length - 1; index >= 0; index--) {
    const filter = smAdvFilters[index]
    const useful = filter.op === 'empty' || filter.op === 'notempty' || (filter.op === 'between' ? !!(filter.value || filter.valueTo) : !!filter.value)
    if (!useful) smAdvFilters.splice(index, 1)
  }
  state.pageIndex = 0
}
const clearSalesFilters = () => {
  state.search = ''
  state.smSearchField = 'all'
  state.smStatus = currentPage.value.kind === 'sales-marketing' ? 'All' : 'Active'
  smAdvFilters.splice(0)
  state.smFilterOpen = false
  smFilterCollapsed.value = false
  state.pageIndex = 0
}
const cancelSalesSearch = () => {
  if (isSalesFeeGrid.value) {
    clearSalesFilters()
    return
  }
  state.search = ''
  onSearch()
}
const sortBy = (key: string) => {
  if (state.sortKey === key) state.sortDir = state.sortDir > 0 ? -1 : 1
  else {
    state.sortKey = key
    state.sortDir = 1
  }
  state.pageIndex = 0
}
const clearSort = () => {
  state.sortKey = ''
  state.sortDir = 1
}

const toggleSelected = (id: string, event?: Event) => {
  const target = event?.target as HTMLInputElement | null
  const syncTarget = () => {
    if (target) target.checked = state.selected.has(id)
  }
  if (rowSelectionDisabled.value) {
    syncTarget()
    return
  }
  if (state.selected.has(id)) {
    state.selected.delete(id)
    syncTarget()
    return
  }
  const record = records.value.find((item) => item.id === id)
  if (!record || !canAddSelectedRecord(record)) {
    syncTarget()
    return
  }
  state.selected.add(id)
  syncTarget()
}
const toggleAllPage = (event?: Event) => {
  const target = event?.target as HTMLInputElement | null
  const syncTarget = () => {
    if (target) target.checked = allPageSelected.value
  }
  if (rowSelectionDisabled.value) {
    syncTarget()
    return
  }
  const selectable = selectablePageRowsForBulk()
  if (allPageSelected.value) {
    selectable.forEach((record) => state.selected.delete(record.id))
    syncTarget()
    return
  }
  const keys = analysisSelectionGroupKeys.value
  if (!keys.length) {
    pageRows.value.forEach((record) => state.selected.add(record.id))
    syncTarget()
    return
  }
  const selectableIds = new Set(selectable.map((record) => record.id))
  const skipped = pageRows.value.filter((record) => !state.selected.has(record.id) && !selectableIds.has(record.id)).length
  selectable.forEach((record) => state.selected.add(record.id))
  if (skipped) showAdminToast(`Selected only rows matching the first row's ${keys.join('/')} - ${skipped} row(s) with different values were skipped`)
  syncTarget()
}
const clearSelected = () => state.selected.clear()

const datePart = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
const timePart = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
const shortDate = (value: string) => `${datePart(value)} ${timePart(value)}`.trim()
const cloneDefaultNav = () => JSON.parse(JSON.stringify(defaultNav))
const cloneDefaultPages = () => JSON.parse(JSON.stringify(defaultPages))
const operationPageIds = new Set(Object.entries(defaultPages).filter(([, page]) => page.group === 'operations').map(([id]) => id))
const mockupPageIds = new Set<string>()
const collectMockupPageIds = (groups: any[]) => {
  groups.forEach((group) => {
    group.items?.forEach((item: any) => mockupPageIds.add(item.id))
    group.sections?.forEach((section: any) => section.items?.forEach((item: any) => mockupPageIds.add(item.id)))
  })
}
collectMockupPageIds(defaultNav)
const normalizeNav = (storedNav: any[]) => {
  const defaults = cloneDefaultNav()
  const defaultById = new Map(defaults.map((group: any) => [group.id, group]))
  const source = Array.isArray(storedNav) && storedNav.length ? storedNav : defaults
  const next = source
    .filter((group: any) => mockupGroupIds.includes(group?.id))
    .map((group: any) => defaultById.has(group?.id) ? JSON.parse(JSON.stringify(defaultById.get(group.id))) : null)
    .filter(Boolean)
  for (const group of defaults) {
    if (!mockupGroupIds.includes(group.id)) continue
    if (!next.some((item: any) => item.id === group.id)) next.push(group)
  }
  return next
}
const normalizePages = (storedPages: Record<string, any> = {}) => {
  const merged = { ...cloneDefaultPages() }
  Object.entries(storedPages || {}).forEach(([id, page]) => {
    if (mockupPageIds.has(id) || id.startsWith('wb_ops_')) merged[id] = page
  })
  for (const id of operationPageIds) merged[id] = { ...(merged[id] || {}), ...defaultPages[id] }
  merged.wb_staff = { ...(merged.wb_staff || {}), ...defaultPages.wb_staff }
  merged.fx = { ...(merged.fx || {}), ...defaultPages.fx }
  return merged
}

const loadMeta = async () => {
  const meta = await apiFetch('/meta')
  const storedNav = Array.isArray(meta.nav) ? meta.nav : []
  nav.value = normalizeNav(storedNav)
  pages.value = normalizePages(meta.pages || {})
  if (pages.value.wb_vbpl) Object.assign(pages.value.wb_vbpl, defaultPages.wb_vbpl)
  settings.value = meta.settings || {}
  if (!pages.value[state.page]) {
    state.page = 'admin_blank'
  }
}
const collapseSidebarDefaults = () => {
  state.collapsedSections = nav.value.flatMap((group: any) => (group.sections || []).map((section: any) => section.id))
}
const loadRecords = async () => {
  const token = ++recordsLoadToken
  if (currentPage.value.kind === 'master-fx' || isWorkbookCanvasPage.value) {
    records.value = []
    return
  }
  if (currentPage.value.kind === 'sales-marketing' && state.smTop === 'MassSales') {
    records.value = []
    state.selected.clear()
    loading.value = false
    return
  }
  loading.value = true
  records.value = []
  if (isAnalysisDashboard.value) analysisDashboardRecords.value = []
  state.selected.clear()
  if (currentPage.value.kind === 'traders-suppliers' && activeTraderTab.value.id === 'traders' && !haulageStaffOptions.value.length) await loadHaulageLookups()
  try {
    if (currentPage.value.kind === 'analysis-statistics' && state.analysisTop === 'ApprovalList' && activeAnalysisTable.value?.id === 'profitshare') {
      const data = await apiFetch(`/records?country=GLOBAL&page=analysis_margin&limit=1000`)
      if (token !== recordsLoadToken) return
      records.value = (Array.isArray(data.items) ? data.items : []).map((record: AdminRecord, index: number) => analysisProfitShareRecord(record, index))
      state.selected.clear()
      return
    }
    const queryCountry = recordCountry.value
    const queryPage = recordPage.value
    const querySearch = isSalesFeeGrid.value ? '' : state.search
    const recordsUrl = `/records?country=${encodeURIComponent(queryCountry)}&page=${encodeURIComponent(queryPage)}&search=${encodeURIComponent(querySearch)}&limit=1000`
    const data = await apiFetch(`${recordsUrl}&skip=0`)
    if (token !== recordsLoadToken) return
    const items = Array.isArray(data.items) ? [...data.items] : []
    const total = Math.max(Number(data.total) || 0, items.length)
    if (isSalesFeeGrid.value) {
      while (items.length < total) {
        const next = await apiFetch(`${recordsUrl}&skip=${items.length}`)
        if (token !== recordsLoadToken) return
        const nextItems = Array.isArray(next.items) ? next.items : []
        if (!nextItems.length) break
        items.push(...nextItems)
      }
    }
    records.value = items
    if (isReferenceCountries.value) await loadPostalCountryCounts()
    if (isLegalChecklist.value) syncLegalChecklistFromRecords()
    if (isAnalysisDashboard.value) await loadAnalysisDashboardRecords()
    state.selected.clear()
  } finally {
    if (token === recordsLoadToken) loading.value = false
  }
}
const loadTrash = async () => {
  const data = await apiFetch('/trash?limit=500')
  trashItems.value = Array.isArray(data.items) ? data.items : []
}
const refreshAll = async () => {
  state.collapsedSections = []
  try {
    const saved = localStorage.getItem('ST_COLLAPSED_GROUPS')
    if (saved) state.collapsedGroups = JSON.parse(saved)
    localStorage.removeItem('ST_COLLAPSED_SECTIONS')
  } catch (e) {}
  await loadMeta()
  enforceAssignedCountry()

  // Operations worksheets fetch their own active sheet and staff lookup data.
  // Avoid blocking that first paint with configuration and record requests that
  // only belong to the other Admin sections.
  if (currentPage.value.kind === 'workbook') {
    collapseSidebarDefaults()
    return
  }

  await Promise.all([
    loadLegalTabsConfig(),
    loadAllCustomGridTabsConfig(),
    loadSmColumnConfig(),
  ])
  collapseSidebarDefaults()
  await Promise.all([loadRecords(), loadTrash(), loadSalesListOptions(), loadSalesFeeReferenceRecords()])
}

const setCountry = async (country: string) => {
  if (!canSwitchCountry.value && country !== assignedCountry.value) {
    countryOpen.value = false
    return
  }
  state.country = country
  countryOpen.value = false
  state.pageIndex = 0
  await Promise.all([loadRecords(), loadSalesFeeReferenceRecords()])
}
const setHaulageMode = async (id: string) => {
  if (state.haulageMode === id) return
  resetSalesViewState()
  state.haulageMode = id
  state.smStatus = 'Active'
  await loadHaulageLookups()
  await loadRecords()
}
const saveHaulageSettings = async () => {
  const buffer = Number(haulageTtBuffer.value)
  haulageTtBuffer.value = Number.isFinite(buffer) && buffer >= 1 ? buffer : 1
  try {
    localStorage.setItem('shoptrans_ors_key_v1', haulageOrsKey.value.trim())
    localStorage.setItem('shoptrans_ors_ttbuf_v1', String(haulageTtBuffer.value))
  } catch (e) {}
}
const growHaulageTextarea = (event: Event) => {
  const field = event.target as HTMLTextAreaElement
  field.style.height = '30px'
  field.style.height = `${Math.max(30, field.scrollHeight)}px`
}
const haulageCoordinates = (value: any) => {
  const match = String(value || '').trim().match(/^(-?\d{1,2}(?:\.\d+)?)\s*[,;]\s*(-?\d{1,3}(?:\.\d+)?)$/)
  if (!match) return null
  const lat = Number(match[1]); const lon = Number(match[2])
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180 ? [lon, lat] : null
}
const haulageGeocode = async (text: string) => {
  const response = await fetch(`https://api.heigit.org/pelias/v1/search?api_key=${encodeURIComponent(haulageOrsKey.value.trim())}&size=1&text=${encodeURIComponent(text)}`)
  if (!response.ok) throw new Error(`Geocoding failed (${response.status})`)
  const body = await response.json()
  return body?.features?.[0]?.geometry?.coordinates || null
}
const calculateHaulageRoute = async (draft: Record<string, any>) => {
  if (!haulageOrsKey.value.trim()) return showAdminToast('Enter OpenRouteService API key above first')
  const origin = String(state.haulageMode === 'fcl' ? draft.fromport || '' : draft.fromwh || '').trim()
  const destination = [draft.toplace, draft.zipcode, draft.country].map((value) => String(value || '').trim()).filter(Boolean).join(', ')
  if (!origin || !destination) return showAdminToast('Need From + ToPlace/ZipCode to calculate')
  haulageCalculating.value = true
  try {
    const originCoordinates = haulageCoordinates(origin) || await haulageGeocode([origin, draft.country].filter(Boolean).join(', '))
    const destinationCoordinates = haulageCoordinates(draft.toplace) || haulageCoordinates(draft.zipcode) || await haulageGeocode(destination)
    if (!originCoordinates || !destinationCoordinates) throw new Error('Origin or destination was not found')
    const response = await fetch('https://api.heigit.org/openrouteservice/v2/directions/driving-car', {
      method: 'POST',
      headers: { Authorization: haulageOrsKey.value.trim(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ coordinates: [originCoordinates, destinationCoordinates], radiuses: [3500, 3500] }),
    })
    if (!response.ok) throw new Error(`Route lookup failed (${response.status})`)
    const body = await response.json(); const summary = body?.routes?.[0]?.summary
    if (!summary) throw new Error('Route was not found')
    draft.distance = (Number(summary.distance) / 1000).toFixed(1)
    draft.transittime = (Number(summary.duration) / 3600 * haulageTtBuffer.value).toFixed(1)
    showAdminToast(`Distance ${draft.distance} KM · TransitTime ${draft.transittime} H`)
  } catch (error: any) {
    showAdminToast(error?.message || 'Map lookup failed — check key/network')
  } finally {
    haulageCalculating.value = false
  }
}
const setQualityTab = async (id: string) => {
  if (state.qcTab === id) return
  resetSalesViewState()
  state.qcTab = id
  state.smStatus = 'All'
  await loadRecords()
}
const toggleCountryMenu = () => {
  if (!canSwitchCountry.value) return
  countryOpen.value = !countryOpen.value
}
const enforceAssignedCountry = () => {
  if (canSwitchCountry.value) return
  const fallback = assignedCountry.value || String(countries.value[0]?.id || 'VN')
  state.country = countries.value.some((country: any) => country.id === fallback) ? fallback : String(countries.value[0]?.id || 'VN')
  countryOpen.value = false
}
const setPage = async (page: string) => {
  state.page = page
  if (page === 'sales_marketing') {
    resetSalesViewState()
    state.smTop = 'At Origin'
    state.smSub = findSalesFeeTabId('At Origin', state.smMode)
    state.smStatus = 'All'
    lastSalesFeeLabel.value = 'Clearance Fee'
  } else if (['traders_suppliers', 'reference_data', 'customs_legal', 'internal_directory'].includes(page)) {
    state.smStatus = 'Active'
  }
  state.view = 'data'
  state.search = ''
  state.modeFilter = 'ALL'
  state.pageIndex = 0
  if (page === 'fx') state.pageSize = 10
  state.sortKey = ''
  await loadRecords()
}
const navigateOpsLeaf = async (leafKey: string) => {
  // Find a sidebar item whose sheetKey matches the requested ops leaf;
  // otherwise synthesize a pages entry and switch to it.
  const match = nav.value.flatMap((g) => g.sections || []).flatMap((s) => s.items || []).concat(
    nav.value.flatMap((g) => g.items || []),
  ).find((it) => pages.value[it.id]?.sheetKey === leafKey)
  if (match) {
    await setPage(match.id)
    return
  }
  // Synthesize a virtual id and ensure the page exists.
  const virtualId = `ops_${leafKey.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}`
  if (!pages.value[virtualId]) {
    const parsed = parseOpsKey(leafKey)
    const base = parsed?.base || leafKey.split('::')[0]
    const mode = parsed?.mode || leafKey.split('::')[1]
    const type = parsed?.type
    const dept = parsed?.dept || leafKey.split('::').at(-1)
    const status = parsed?.status && parsed.status !== 'active' ? ` · ${parsed.status === 'done' ? 'COMPLETED' : 'PENDING'}` : ''
    pages.value[virtualId] = {
      kind: 'workbook',
      title: `${base === 'D2D' ? 'OVS' : base} · ${mode}${type ? ` · ${type}` : ''} · ${dept}${status}`,
      group: 'operations',
      sheetKey: leafKey,
      desc: `Operations ${base} ${mode}${type ? ` ${type}` : ''} ${dept}.`,
    }
  }
  await setPage(virtualId)
}
const openTrash = async () => {
  state.view = 'trash'
  await loadTrash()
}
const logoutAdmin = async () => {
  await adminStore.logout()
  await router.replace('/admin/login')
}
const openAccountSettings = () => {
  accountSettings.name = accountDisplayName.value
  accountSettings.country = accountCountryCode.value
  accountSettings.department = accountDepartment.value
  accountSettings.departments = [...accountDepartments.value]
  accountSettings.deptOpen = false
  accountOpen.value = false
  accountSettings.open = true
}
const closeAccountSettings = () => { accountSettings.open = false; accountSettings.deptOpen = false }
const closeAccountDeptOutside = (event: MouseEvent) => {
  if ((event.target as HTMLElement | null)?.closest('.dept-select-wrap')) return
  accountSettings.deptOpen = false
}
const closeAccountMenuOutside = (event: Event) => {
  const target = event.target as HTMLElement | null
  if (target?.closest('.workspace-account-menu') || target?.closest('.workspace-account-pill')) return
  accountOpen.value = false
}
const handleAccountKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  if (accountSettings.open) closeAccountSettings()
  else if (accountOpen.value) accountOpen.value = false
}
const saveAccountSettings = () => {
  if (!accountSettings.name.trim()) return
  accountProfile.name = accountSettings.name.trim()
  accountProfile.country = accountSettings.country.trim().toUpperCase() || accountCountryCode.value
  accountProfile.departments = accountSettings.departments.filter((dept) => ACCOUNT_DEPTS.includes(dept))
  accountProfile.department = accountProfile.departments[0] || accountSettings.department || accountDepartment.value
  localStorage.setItem(accountProfileKey, JSON.stringify(accountProfile))
  accountSettings.open = false
}
const toggleAccountDept = (dept: string) => { const i = accountSettings.departments.indexOf(dept); if (i >= 0) accountSettings.departments.splice(i, 1); else accountSettings.departments.push(dept) }
const removeAccountDept = (dept: string) => { const i = accountSettings.departments.indexOf(dept); if (i >= 0) accountSettings.departments.splice(i, 1) }
const exportAccountBackup = () => {
  const dump: Record<string, string | null> = {}
  for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key) dump[key] = localStorage.getItem(key) }
  const url = URL.createObjectURL(new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a'); link.href = url; link.download = `shoptrans-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url)
}
const importAccountBackup = () => {
  const input = document.createElement('input'); input.type = 'file'; input.accept = '.json,application/json'
  input.onchange = () => { const file = input.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const data = JSON.parse(String(reader.result)); if (!data || Array.isArray(data)) throw new Error('invalid'); if (!window.confirm('Restore this backup? It will overwrite all current data and reload the app.')) return; Object.entries(data).forEach(([key, value]) => localStorage.setItem(key, String(value))); location.reload() } catch { window.alert('Invalid backup file.') } }; reader.readAsText(file) }
  input.click()
}
const resetAccountData = () => { if (window.confirm('This will permanently delete ALL SHOPTRANS data stored in this browser. Continue?') && window.confirm('Are you absolutely sure? This action cannot be undone?')) { localStorage.clear(); location.reload() } }
const confirmLogoutAdmin = async () => {
  accountOpen.value = false
  if (await confirmAdmin('Are you sure you want to log out?', 'Log out', 'Log out', 'danger')) await logoutAdmin()
}
const confirmAdmin = (message: string, title = 'Confirm', okText = 'OK', tone = 'primary') => new Promise<boolean>((resolve) => {
  confirmModal.title = title
  confirmModal.message = message
  confirmModal.okText = okText
  confirmModal.cancelText = 'Cancel'
  confirmModal.tone = tone
  confirmModal.resolve = resolve
  confirmModal.open = true
})
const resolveConfirm = (value: boolean) => {
  const resolve = confirmModal.resolve
  confirmModal.open = false
  confirmModal.resolve = null
  resolve?.(value)
}
const notifyAdmin = (message: string, _title = 'Notice') => showAdminToast(message)
const promptAdmin = (title: string, label: string, value = '', desc = '', placeholder = '') => new Promise<string | null>(async (resolve) => {
  promptModal.title = title
  promptModal.label = label
  promptModal.desc = desc
  promptModal.placeholder = placeholder
  promptModal.value = value
  promptModal.resolve = resolve
  promptModal.open = true
  await nextTick()
  promptInput.value?.focus()
  promptInput.value?.select()
})
const resolvePrompt = (value: string | null) => {
  const resolve = promptModal.resolve
  promptModal.open = false
  promptModal.resolve = null
  resolve?.(value && value.trim() ? value.trim() : null)
}
const confirmRemoveTab = (label: string) => new Promise<boolean>(async (resolve) => {
  removeTabModal.label = label
  removeTabModal.value = ''
  removeTabModal.resolve = resolve
  removeTabModal.open = true
  await nextTick()
  removeTabInput.value?.focus()
})
const resolveRemoveTab = (value: boolean) => {
  const resolve = removeTabModal.resolve
  removeTabModal.open = false
  removeTabModal.value = ''
  removeTabModal.resolve = null
  resolve?.(value)
}

const makeId = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
const saveMeta = async () => {
  await apiFetch('/meta', { method: 'PATCH', body: { nav: nav.value, pages: pages.value, settings: settings.value } })
}
const resetMenu = async () => {
  if (!(await confirmAdmin('Reset menu to default?', 'Reset menu'))) return
  nav.value = JSON.parse(JSON.stringify(defaultNav))
  pages.value = JSON.parse(JSON.stringify(defaultPages))
  state.page = 'admin_blank'
  await saveMeta()
  await loadRecords()
}
const addGroup = async () => {
  const label = await promptAdmin('Category name', 'Category name')
  if (!label) return
  const id = makeId(label)
  if (!id || nav.value.some((group: any) => group.id === id)) return notifyAdmin('Category already exists or is invalid.')
  nav.value.push({ id, label, icon: 'tag', items: [] })
  await saveMeta()
}
const renameGroup = async (group: any) => {
  const label = await promptAdmin('Category name', 'Category name', group.label)
  if (!label) return
  group.label = label
  await saveMeta()
}
const deleteGroup = async (group: any) => {
  if (!(await confirmAdmin(`Move category "${group.label}" to Dustbin?`, 'Move to Dustbin'))) return
  await apiFetch('/trash', { method: 'POST', body: { type: 'group', label: group.label, payload: { group, pages: Object.fromEntries(group.items.map((item: any) => [item.id, pages.value[item.id]])) } } })
  nav.value = nav.value.filter((item: any) => item.id !== group.id)
  group.items.forEach((item: any) => delete pages.value[item.id])
  await saveMeta()
  await loadTrash()
}
const addItem = async (group: any) => {
  const label = await promptAdmin('Menu item name', 'Menu item name')
  if (!label) return
  const id = makeId(label)
  if (!id || pages.value[id]) return notifyAdmin('Menu item already exists or is invalid.')
  group.items.push({ id, label })
  pages.value[id] = { kind: 'fee', title: label, group: group.id, fcl: true, lclUnit: 'set', validity: true, desc: 'Custom admin data page.' }
  await saveMeta()
}
const renameItem = async (_group: any, item: any) => {
  const label = await promptAdmin('Menu item name', 'Menu item name', item.label)
  if (!label) return
  item.label = label
  if (pages.value[item.id]) pages.value[item.id].title = label
  await saveMeta()
}
const deleteItem = async (group: any, item: any) => {
  if (!(await confirmAdmin(`Move item "${item.label}" to Dustbin?`, 'Move to Dustbin'))) return
  await apiFetch('/trash', { method: 'POST', body: { type: 'item', label: item.label, page: item.id, kind: pages.value[item.id]?.kind, payload: { groupId: group.id, item, page: pages.value[item.id] } } })
  group.items = group.items.filter((row: any) => row.id !== item.id)
  delete pages.value[item.id]
  await saveMeta()
  await loadTrash()
}

const formFields = computed(() => {
  const modeOptions = [{ value: 'FCL', label: 'FCL' }, { value: 'LCL', label: 'LCL' }, { value: 'FLAT', label: 'FLAT' }]
  const curOptions = currencies.value.map((currency: any) => ({ value: currency.code, label: `${currency.code} (${currency.symbol || currency.sym || ''})` }))
  const statusOptions = [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }, { value: 'Loaded', label: 'Loaded' }]
  const fclSectionOptions = [{ value: 'locations', label: 'Location details' }, { value: 'cargo', label: 'What do you want to ship?' }, { value: 'cargo-options', label: 'Cargo options' }, { value: 'shipping', label: 'How will your cargo be shipped?' }, { value: 'shipping-options', label: 'Shipping options' }, { value: 'services', label: 'Please choose services range' }]
  switch (currentPage.value.kind) {
    case 'sales-marketing': return tableColumns.value.map((column: any) => ({
      key: column.key,
      label: column.label,
      type: column.kind === 'date' ? 'date' : column.kind === 'select' ? 'select' : column.kind === 'number' ? 'number' : column.kind === 'checkbox' ? 'checkbox' : 'text',
      options: column.kind === 'select' ? (column.opts || []).map((option: string) => ({ value: option, label: option })) : undefined,
    }))
    case 'page-fcl': return [{ key: 'section', label: 'Legacy tab', type: 'select', options: fclSectionOptions, required: true }, { key: 'key', label: 'Code / ID', required: true }, { key: 'title', label: 'Name', required: true }, { key: 'group', label: 'Group' }, { key: 'type', label: 'Type' }, { key: 'country', label: 'Country' }, { key: 'region', label: 'Region' }, { key: 'countryCode', label: 'Country code' }, { key: 'label', label: 'Display label' }, { key: 'hsCode', label: 'HS code' }, { key: 'value', label: 'Value' }, { key: 'status', label: 'Status', type: 'select', options: statusOptions }, { key: 'sortOrder', label: 'Sort order', type: 'number' }, { key: 'flags', label: 'Flags', full: true }, { key: 'keywords', label: 'Keywords', type: 'textarea', full: true }, { key: 'summary', label: 'Summary', type: 'textarea', full: true }]
    case 'page-products': return [{ key: 'section', label: 'Section', type: 'select', options: [{ value: 'service', label: 'Service' }, { value: 'hero', label: 'Hero' }] }, { key: 'key', label: 'Key / ID', required: true }, { key: 'title', label: 'Title', required: true }, { key: 'subtitle', label: 'Subtitle', full: true }, { key: 'tab', label: 'Tab', type: 'select', options: [{ value: 'origin', label: 'Origin' }, { value: 'freight', label: 'Freight' }, { value: 'destination', label: 'Destination' }, { value: 'custom', label: 'Custom' }, { value: 'hero', label: 'Hero' }] }, { key: 'serviceType', label: 'Service type', type: 'select', options: [{ value: 'fcl', label: 'FCL' }, { value: 'lcl', label: 'LCL' }, { value: 'air', label: 'AIR' }, { value: 'customs', label: 'Customs' }, { value: '', label: '-' }] }, { key: 'status', label: 'Status', type: 'select', options: statusOptions }, { key: 'sortOrder', label: 'Sort order', type: 'number' }, { key: 'description', label: 'Description', type: 'textarea', full: true }]
    case 'page-solutions': return [{ key: 'section', label: 'Section', type: 'select', options: [{ value: 'detail', label: 'Detail' }, { value: 'hero', label: 'Hero' }] }, { key: 'key', label: 'Key', required: true }, { key: 'category', label: 'Category', type: 'select', options: [{ value: 'main', label: 'Main Logistics' }, { value: 'value', label: 'Value Added Logistics' }, { value: 'solutions', label: 'Value Added Solutions' }] }, { key: 'title', label: 'Title', required: true, full: true }, { key: 'gridTitle', label: 'Grid title', full: true }, { key: 'image', label: 'Image key / URL' }, { key: 'status', label: 'Status', type: 'select', options: statusOptions }, { key: 'sortOrder', label: 'Sort order', type: 'number' }, { key: 'description', label: 'Description / paragraphs', type: 'textarea', full: true }]
    case 'page-local-information': return [{ key: 'section', label: 'Section', type: 'select', options: [{ value: 'country', label: 'Country' }, { value: 'hero', label: 'Hero' }] }, { key: 'code', label: 'Code', required: true }, { key: 'name', label: 'Name' }, { key: 'iso', label: 'ISO' }, { key: 'flagKey', label: 'Flag key' }, { key: 'status', label: 'Status', type: 'select', options: statusOptions }, { key: 'sortOrder', label: 'Sort order', type: 'number' }, { key: 'subtitle', label: 'Subtitle', full: true }, { key: 'description', label: 'Intro / note', type: 'textarea', full: true }]
    case 'master-ports': return [{ key: 'code', label: 'UN/LOCODE', required: true }, { key: 'name', label: 'Port name', required: true }, { key: 'city', label: 'City' }]
    case 'master-cfs': return [{ key: 'code', label: 'CFS code', required: true }, { key: 'name', label: 'Warehouse name', required: true }, { key: 'addr', label: 'Address', full: true }, { key: 'port', label: 'Linked port' }]
    case 'master-admin': return [{ key: 'zip', label: 'Postal code', required: true }, { key: 'prov', label: 'Province', required: true }, { key: 'dist', label: 'District' }, { key: 'ward', label: 'Ward' }]
    case 'trucking': return [{ key: 'port', label: 'Port / CFS', required: true }, { key: 'zip', label: 'Postal code', required: true }, { key: 'adm', label: 'Administrative unit' }, { key: 'mode', label: 'Mode', type: 'select', options: modeOptions }, { key: 'cur', label: 'Currency', type: 'select', options: curOptions }, ...rateFields(), ...validFields()]
    case 'ocean': return [{ key: 'pol', label: 'POL', required: true }, { key: 'pod', label: 'POD', required: true }, { key: 'carrier', label: 'Carrier' }, { key: 'mode', label: 'Mode', type: 'select', options: modeOptions }, { key: 'cur', label: 'Currency', type: 'select', options: curOptions }, ...rateFields(), { key: 'etd', label: 'ETD' }, { key: 'transit', label: 'Transit time days', type: 'number' }, { key: 'via', label: 'Via' }, { key: 'ftO', label: 'Freetime origin', type: 'number' }, { key: 'ftD', label: 'Freetime destination', type: 'number' }, ...validFields()]
    case 'localcharge': return [{ key: 'feeType', label: 'Fee type', required: true }, { key: 'mode', label: 'Mode', type: 'select', options: modeOptions }, { key: 'cur', label: 'Currency', type: 'select', options: curOptions }, ...rateFields(), { key: 'unit', label: 'Unit' }, ...validFields()]
    case 'flat': return [{ key: 'unit', label: 'Unit', required: true }, { key: 'cur', label: 'Currency', type: 'select', options: curOptions }, { key: 'rate20', label: 'Value', type: 'number', required: true }, ...validFields()]
    default: return [{ key: 'feeType', label: currentPage.value.feeTypes ? 'Fee type' : 'Fee name', required: true }, { key: 'scope', label: 'Port / Scope' }, { key: 'mode', label: 'Mode', type: 'select', options: modeOptions }, { key: 'cur', label: 'Currency', type: 'select', options: curOptions }, ...rateFields(), { key: 'unit', label: 'Unit' }, ...validFields(), ...(currentPage.value.inspect ? [{ key: 'note', label: 'Notes', type: 'textarea', full: true }] : [])]
  }
})
const rateFields = () => [{ key: 'rate20', label: '20GP / value', type: 'number' }, { key: 'rate40', label: '40GP', type: 'number' }, { key: 'rate40hc', label: '40HC', type: 'number' }, { key: 'rate45hc', label: '45HC', type: 'number' }]
const validFields = () => [{ key: 'from', label: 'Valid from', type: 'date' }, { key: 'to', label: 'Valid to', type: 'date' }]

const openRecord = (record?: AdminRecord) => {
  Object.keys(recordForm).forEach((key) => delete recordForm[key])
  recordModal.id = record?.id || ''
  recordModal.error = ''
  const data = record?.data || {}
  Object.assign(recordForm, {
    code: data.code || data.primary || '',
    name: data.name || '',
    city: data.city || '',
    addr: data.addr || data.address || '',
    port: data.port || '',
    zip: data.zip || data.postalCode || '',
    prov: data.prov || data.province || '',
    dist: data.dist || data.district || '',
    ward: data.ward || '',
    section: data.section || (currentPage.value.kind === 'page-fcl' ? activeFclTab.value.section : currentPage.value.kind === 'page-products' ? 'service' : currentPage.value.kind === 'page-solutions' ? 'detail' : currentPage.value.kind === 'page-local-information' ? 'country' : ''),
    key: data.key || data.id || data.code || '',
    title: data.title || data.name || '',
    subtitle: data.subtitle || '',
    description: data.description || data.summary || data.payload?.description || '',
    summary: data.summary || '',
    group: data.group || '',
    country: data.country || '',
    region: data.region || '',
    countryCode: data.countryCode || '',
    label: data.label || '',
    hsCode: data.hsCode || '',
    value: data.value || '',
    keywords: data.keywords || '',
    flags: data.flags || '',
    tab: data.tab || '',
    serviceType: data.serviceType || data.type || '',
    type: data.type || data.serviceType || '',
    status: data.status || (data.isActive === false ? 'Inactive' : data.isActive === true ? 'Active' : 'Active'),
    sortOrder: data.sortOrder ?? record?.sortOrder ?? '',
    category: data.category || 'main',
    gridTitle: data.gridTitle || '',
    image: data.image || data.thumb || data.img || '',
    flagKey: data.flagKey || '',
    feeType: data.feeType || data.charge || '',
    scope: data.scope || '',
    mode: data.mode || 'FCL',
    cur: data.cur || data.currency || currentCountry.value.cur || 'USD',
    rate20: data.r?.['20GP'] ?? data.r?.val ?? data.rate20 ?? data.value ?? '',
    rate40: data.r?.['40GP'] ?? data.rate40 ?? '',
    rate40hc: data.r?.['40HC'] ?? '',
    rate45hc: data.r?.['45HC'] ?? '',
    unit: data.unit || currentPage.value.lclUnit || currentPage.value.flatUnit || 'SET',
    from: data.from || data.validFrom || '',
    to: data.to || data.validTo || '',
    note: data.note || '',
    pol: data.pol || '',
    pod: data.pod || '',
    carrier: data.carrier || '',
    etd: data.etd || '',
    transit: data.transit || '',
    via: data.via || '',
    ftO: data.ftO || '',
    ftD: data.ftD || '',
    adm: data.adm || '',
  })
  if (currentPage.value.kind === 'sales-marketing') {
    tableColumns.value.forEach((column: any) => {
      recordForm[column.key] = data[column.key] ?? (column.key === 'status' ? 'Active' : '')
    })
  }
  recordModal.open = true
}
const closeRecord = () => {
  recordModal.open = false
}
const numOrNull = (value: any) => value === '' || value == null ? null : Number(value)
const buildRates = () => {
  const r: Record<string, any> = {}
  if (recordForm.rate20 !== '') r['20GP'] = numOrNull(recordForm.rate20)
  if (recordForm.rate40 !== '') r['40GP'] = numOrNull(recordForm.rate40)
  if (recordForm.rate40hc !== '') r['40HC'] = numOrNull(recordForm.rate40hc)
  if (recordForm.rate45hc !== '') r['45HC'] = numOrNull(recordForm.rate45hc)
  return r
}
const buildRecordData = () => {
  const kind = currentPage.value.kind
  if (kind === 'sales-marketing') {
    const data: Record<string, any> = {}
    tableColumns.value.forEach((column: any) => {
      data[column.key] = recordForm[column.key] ?? ''
    })
    data.top = state.smTop
    data.mode = state.smMode
    data.table = activeSalesTableLabel.value
    data.status = data.status || 'Active'
    return data
  }
  if (kind === 'page-fcl') {
    const payload = {
      id: recordForm.key,
      code: recordForm.key,
      title: recordForm.title,
      label: recordForm.label || recordForm.title,
      group: recordForm.group,
      type: recordForm.type,
      country: recordForm.country,
      region: recordForm.region,
      countryCode: recordForm.countryCode,
      hsCode: recordForm.hsCode,
      value: recordForm.value,
      keywords: String(recordForm.keywords || '').split(',').map((item) => item.trim()).filter(Boolean),
      enabled: recordForm.status !== 'Inactive',
    }
    return { section: recordForm.section, key: recordForm.key, title: recordForm.title, group: recordForm.group, type: recordForm.type, country: recordForm.country, region: recordForm.region, countryCode: recordForm.countryCode, label: recordForm.label, hsCode: recordForm.hsCode, value: recordForm.value, flags: recordForm.flags, keywords: recordForm.keywords, status: recordForm.status, summary: recordForm.summary, sortOrder: Number(recordForm.sortOrder) || 0, payload }
  }
  if (kind === 'page-products') {
    if (recordForm.section === 'hero') return { section: 'hero', key: 'hero', title: recordForm.title, description: recordForm.description, status: recordForm.status, payload: { title: recordForm.title, description: recordForm.description } }
    const isActive = recordForm.status !== 'Inactive'
    const payload = {
      id: recordForm.key,
      title: recordForm.title,
      subtitle: recordForm.subtitle,
      description: recordForm.description,
      tab: recordForm.tab,
      serviceType: recordForm.serviceType,
      sortOrder: Number(recordForm.sortOrder) || 0,
      isActive,
    }
    return { section: recordForm.section || 'service', key: recordForm.key, title: recordForm.title, subtitle: recordForm.subtitle, description: recordForm.description, tab: recordForm.tab, serviceType: recordForm.serviceType, status: recordForm.status, sortOrder: Number(recordForm.sortOrder) || 0, payload }
  }
  if (kind === 'page-solutions') {
    if (recordForm.section === 'hero') return { section: 'hero', key: 'hero', title: recordForm.title, description: recordForm.description, status: recordForm.status, payload: { title: recordForm.title, description: recordForm.description } }
    const paragraphs = String(recordForm.description || '').split('\n').map((line) => line.trim()).filter(Boolean)
    const payload = { title: recordForm.title, gridTitle: recordForm.gridTitle, img: recordForm.image, thumb: recordForm.image, paragraphs, isActive: recordForm.status !== 'Inactive' }
    return { section: 'detail', key: recordForm.key, category: recordForm.category || 'main', title: recordForm.title, gridTitle: recordForm.gridTitle, image: recordForm.image, status: recordForm.status, sortOrder: Number(recordForm.sortOrder) || 0, payload }
  }
  if (kind === 'page-local-information') {
    if (recordForm.section === 'hero') return { section: 'hero', key: 'hero', title: recordForm.title || recordForm.name, description: recordForm.description, eyebrow: recordForm.subtitle, status: recordForm.status, payload: { title: recordForm.title || recordForm.name, description: recordForm.description, eyebrow: recordForm.subtitle } }
    const payload = { code: recordForm.code, name: recordForm.name, iso: recordForm.iso, flagKey: recordForm.flagKey, subtitle: recordForm.subtitle, importIntro: recordForm.description, isActive: recordForm.status !== 'Inactive', sortOrder: Number(recordForm.sortOrder) || 0 }
    return { section: 'country', key: recordForm.code, code: recordForm.code, name: recordForm.name, iso: recordForm.iso, flagKey: recordForm.flagKey, status: recordForm.status, sortOrder: Number(recordForm.sortOrder) || 0, subtitle: recordForm.subtitle, description: recordForm.description, payload }
  }
  if (kind === 'master-ports') return { code: recordForm.code, name: recordForm.name, city: recordForm.city }
  if (kind === 'master-cfs') return { code: recordForm.code, name: recordForm.name, addr: recordForm.addr, port: recordForm.port }
  if (kind === 'master-admin') return { zip: recordForm.zip, prov: recordForm.prov, dist: recordForm.dist, ward: recordForm.ward }
  if (kind === 'flat') return { mode: 'FLAT', unit: recordForm.unit, cur: recordForm.cur, r: { val: numOrNull(recordForm.rate20) }, from: recordForm.from, to: recordForm.to }
  const base: Record<string, any> = { mode: recordForm.mode, cur: recordForm.cur, r: buildRates(), from: recordForm.from, to: recordForm.to }
  if (recordForm.mode !== 'FCL' && recordForm.rate20 !== '') base.r = { val: numOrNull(recordForm.rate20) }
  if (kind === 'trucking') return { ...base, port: recordForm.port, zip: recordForm.zip, adm: recordForm.adm }
  if (kind === 'ocean') return { ...base, pol: recordForm.pol, pod: recordForm.pod, carrier: recordForm.carrier, etd: recordForm.etd, transit: recordForm.transit, via: recordForm.via, ftO: recordForm.ftO, ftD: recordForm.ftD }
  if (kind === 'localcharge') return { ...base, feeType: recordForm.feeType, unit: recordForm.unit }
  return { ...base, feeType: recordForm.feeType, scope: recordForm.scope, unit: recordForm.unit, note: recordForm.note }
}
const saveRecord = async () => {
  recordModal.error = ''
  const requiredKey = currentPage.value.kind === 'sales-marketing' ? tableColumns.value[0]?.key : currentPage.value.kind.startsWith('page-') && recordForm.section === 'hero' ? 'title' : currentPage.value.kind.startsWith('page-') && currentPage.value.kind !== 'page-local-information' ? 'key' : currentPage.value.kind === 'page-local-information' ? 'code' : currentPage.value.kind === 'master-admin' ? 'zip' : currentPage.value.kind === 'ocean' ? 'pol' : currentPage.value.kind === 'trucking' ? 'port' : currentPage.value.kind === 'localcharge' ? 'feeType' : currentPage.value.kind === 'flat' ? 'unit' : (currentPage.value.kind.startsWith('master') ? 'code' : 'feeType')
  if (!recordForm[requiredKey]) {
    recordModal.error = 'Required field is missing.'
    return
  }
  saving.value = true
  try {
    const body = { country: recordCountry.value, page: recordPage.value, kind: currentPage.value.kind, data: buildRecordData(), sortOrder: Number(recordForm.sortOrder) || 0 }
    if (recordModal.id) await apiFetch(`/records/${recordModal.id}`, { method: 'PATCH', body })
    else await apiFetch('/records', { method: 'POST', body })
    closeRecord()
    await loadRecords()
  } catch (error: any) {
    recordModal.error = error?.data?.message || error?.message || 'Could not save record.'
  } finally {
    saving.value = false
  }
}
const deleteRecord = async (record: AdminRecord) => {
  if (!(await confirmAdmin(`Move "${cellValue(record, tableColumns.value[0]?.key || 'code')}" to Dustbin?`, 'Move to Dustbin'))) return
  await apiFetch(`/records/${record.id}`, { method: 'DELETE' })
  await Promise.all([loadRecords(), loadTrash()])
}
const bulkCopy = async () => {
  const selected = filteredRows.value.filter((record) => state.selected.has(record.id))
  if (!selected.length) return
  if (currentPage.value.kind !== 'sales-marketing') {
    for (const [index, record] of selected.entries()) {
      await apiFetch('/records', { method: 'POST', body: { country: record.country, page: record.page, kind: record.kind, data: record.data, sortOrder: records.value.length + index + 1 } })
    }
  } else {
    let sortOrder = 0
    for (const record of records.value.slice().sort(compareSheetRecordOrder)) {
      sortOrder += 1
      if (Number(record.sortOrder) !== sortOrder) {
        await apiFetch(`/records/${record.id}`, { method: 'PATCH', body: { country: record.country, page: record.page, kind: record.kind, data: record.data, sortOrder } })
      }
      if (!state.selected.has(record.id)) continue
      sortOrder += 1
      await apiFetch('/records', { method: 'POST', body: { country: record.country, page: record.page, kind: record.kind, data: record.data, sortOrder } })
    }
  }
  clearSelected()
  await loadRecords()
}
const bulkDelete = async () => {
  const selected = filteredRows.value.filter((record) => state.selected.has(record.id))
  const isSheetGrid = isSheetGridPage.value
  const title = isSheetGrid ? `Remove ${activeSalesTableLabel.value}` : 'Move to Dustbin'
  const message = isSheetGrid
    ? `Remove ${selected.length} selected record${selected.length === 1 ? '' : 's'}? This cannot be undone.`
    : `Move ${selected.length} record(s) to Dustbin?`
  const okText = isSheetGrid ? 'Confirm' : 'OK'
  const tone = isSheetGrid ? 'danger' : 'primary'
  if (!selected.length || !(await confirmAdmin(message, title, okText, tone))) return
  for (const record of selected) await apiFetch(`/records/${record.id}`, { method: 'DELETE' })
  if (currentPage.value.kind === 'quality-control' && state.qcTab === 'incident') {
    for (const record of selected) await logQualityHistory(`Removed incident ${dataOf(record).caseid || record.id}`)
  }
  clearSelected()
  await Promise.all([loadRecords(), loadTrash()])
}

const restoreTrash = async (entry: AdminTrash) => {
  const result = await apiFetch(`/trash/${entry.id}/restore`, { method: 'POST' })
  const restored = result?.restored || {}
  if (entry.type === 'item' && restored.groupId && restored.item) {
    const group = nav.value.find((row: any) => row.id === restored.groupId)
    if (group && !group.items.some((item: any) => item.id === restored.item.id)) group.items.push(restored.item)
    if (restored.page) pages.value[restored.item.id] = restored.page
    await saveMeta()
  }
  if (entry.type === 'group' && restored.group) {
    if (!nav.value.some((row: any) => row.id === restored.group.id)) nav.value.push(restored.group)
    Object.assign(pages.value, restored.pages || {})
    await saveMeta()
  }
  await Promise.all([loadRecords(), loadTrash()])
}
const purgeTrash = async (entry: AdminTrash) => {
  if (!(await confirmAdmin(`Delete "${entry.label}" permanently?`, 'Delete permanently'))) return
  await apiFetch(`/trash/${entry.id}`, { method: 'DELETE' })
  await loadTrash()
}
const emptyTrash = async () => {
  if (!trashItems.value.length || !(await confirmAdmin(`Permanently delete ${trashItems.value.length} item(s)?`, 'Empty Dustbin'))) return
  await apiFetch('/trash', { method: 'DELETE' })
  await loadTrash()
}
const trashContext = (entry: AdminTrash) => [entry.country, entry.page, entry.kind].filter(Boolean).join(' / ') || '-'
const trashPayloadSummary = (entry: AdminTrash) => {
  const data = (entry.payload || {}).data || entry.payload || {}
  return data.name || data.city || data.description || data.pod || data.page || entry.deletedBy || '-'
}

const openFxModal = (currency?: any) => {
  fxModal.code = currency?.code || ''
  fxModal.error = ''
  Object.assign(fxForm, {
    code: currency?.code || '',
    name: currency?.name || '',
    symbol: currency?.symbol || currency?.sym || '',
    rate: currency?.rate || 1,
    base: Boolean(currency?.base),
  })
  fxModal.open = true
}
const closeFxModal = () => {
  fxModal.open = false
}
const saveCurrency = async () => {
  if (!fxForm.code || !fxForm.symbol || !(Number(fxForm.rate) > 0)) {
    fxModal.error = 'Currency code, symbol and rate are required.'
    return
  }
  const list = [...currencies.value]
  const idx = list.findIndex((currency: any) => currency.code === fxModal.code)
  const item = { code: String(fxForm.code).toUpperCase(), name: fxForm.name, symbol: fxForm.symbol, rate: Number(fxForm.rate), base: fxForm.base }
  if (idx >= 0) list[idx] = { ...list[idx], ...item }
  else list.push(item)
  settings.value = { ...settings.value, currencies: list }
  await saveMeta()
  closeFxModal()
}
const deleteCurrency = async (currency: any) => {
  if (!(await confirmAdmin(`Delete currency "${currency.code}"?`, 'Delete currency'))) return
  settings.value = { ...settings.value, currencies: currencies.value.filter((row: any) => row.code !== currency.code) }
  await saveMeta()
}

const exchangeRateSource = 'https://open.er-api.com/v6/latest/USD'
const copyExchangeRateSource = async () => {
  await navigator.clipboard.writeText(exchangeRateSource)
}
const fetchAndSaveFxToday = async () => {
  fxImportModal.error = ''
  try {
    await loadFxPreview(true)
    const changedItems = fxImportModal.items.filter((item) => item.changed)
    if (changedItems.length) await syncFxRateItems(changedItems, true)
    else fxImportModal.syncMessage = 'Exchange rates are already up to date.'
  } catch (error: any) {
    fxImportModal.error = error?.data?.message || error?.message || 'Could not fetch and save exchange rates.'
  }
}

const openFxImportModal = async () => {
  fxImportModal.open = true
  fxImportModal.search = ''
  fxImportModal.error = ''
  if (!fxImportModal.items.length) await loadFxPreview()
  restartFxAutoRefresh()
}
const closeFxImportModal = () => {
  fxImportModal.open = false
  stopFxAutoRefresh()
}
const stopFxAutoRefresh = () => {
  if (fxAutoRefreshTimer) clearInterval(fxAutoRefreshTimer)
  fxAutoRefreshTimer = null
}
const restartFxAutoRefresh = () => {
  stopFxAutoRefresh()
  if (!fxImportModal.open || !fxImportModal.autoRefresh) return
  fxAutoRefreshTimer = setInterval(() => {
    if (!fxImportModal.loading && !importingExternal.value) loadFxPreview(true)
  }, Math.max(30, Number(fxImportModal.refreshSeconds) || 60) * 1000)
}
const syncFxRateItems = async (items: any[], silent = false) => {
  if (!items.length) return null
  importingExternal.value = true
  if (!silent) fxImportModal.error = ''
  try {
    const result = await apiFetch('/import/exchange-rates', { method: 'POST', body: { items } })
    await loadMeta()
    const selectedCodes = new Set(items.map((item) => item.id))
    fxImportModal.items = fxImportModal.items.map((item) => selectedCodes.has(item.id) ? { ...item, exists: true, changed: false, currentRate: item.rate } : item)
    selectedCodes.forEach((code) => fxImportModal.selected.delete(code))
    fxImportModal.syncMessage = `Synced ${result?.created || 0} new / ${result?.updated || 0} updated at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}.`
    return result
  } finally {
    importingExternal.value = false
  }
}
const loadFxPreview = async (silent = false) => {
  fxImportModal.loading = true
  if (!silent) fxImportModal.error = ''
  fxImportModal.selected.clear()
  try {
    const result = await apiFetch('/preview/exchange-rates')
    fxImportModal.source = result?.source || ''
    fxImportModal.updatedAt = result?.updatedAt || ''
    fxImportModal.nextUpdateAt = result?.nextUpdateAt || ''
    fxImportModal.lastCheckedAt = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    fxImportModal.items = Array.isArray(result?.items) ? result.items : []
    fxImportModal.items.filter((item) => item.changed).forEach((item) => fxImportModal.selected.add(item.id))
    if (fxImportModal.autoSync) {
      const changedItems = fxImportModal.items.filter((item) => item.changed)
      if (changedItems.length) await syncFxRateItems(changedItems, true)
      else fxImportModal.syncMessage = `No changes at ${fxImportModal.lastCheckedAt}.`
    }
  } catch (error: any) {
    fxImportModal.source = ''
    fxImportModal.updatedAt = ''
    fxImportModal.nextUpdateAt = ''
    fxImportModal.items = []
    fxImportModal.error = error?.data?.message || error?.message || 'Could not load exchange rates.'
  } finally {
    fxImportModal.loading = false
  }
}
const toggleFxSelected = (item: any) => {
  if (item.exists && !item.changed) return
  if (fxImportModal.selected.has(item.id)) fxImportModal.selected.delete(item.id)
  else fxImportModal.selected.add(item.id)
}
const toggleAllFxVisible = () => {
  const visible = fxFilteredItems.value.filter((item) => item.changed)
  if (fxAllVisibleSelected.value) visible.forEach((item) => fxImportModal.selected.delete(item.id))
  else visible.forEach((item) => fxImportModal.selected.add(item.id))
}
const importSelectedFxRates = async () => {
  const items = fxImportModal.items.filter((item) => fxImportModal.selected.has(item.id) && item.changed)
  if (!items.length) return
  try {
    const result = await syncFxRateItems(items)
    await notifyAdmin(`Imported ${result?.created || 0} new and updated ${result?.updated || 0} exchange-rate record(s).`, 'Import complete')
  } catch (error: any) {
    fxImportModal.error = error?.data?.message || error?.message || 'Could not import selected exchange rates.'
  }
}

const templateColumns = computed(() => isSheetGridPage.value
  ? tableColumns.value.map((column: any) => column.key)
  : formFields.value.map((field: any) => field.key))
const csvCell = (value: any) => {
  const text = String(value ?? '').replace(/\r?\n/g, ' ')
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}
const analysisSampleRows = () => {
  const customers = [
    { name: 'ABC LOGISTICS CO., LTD', code: 'ABCLOG' },
    { name: 'GLOBAL TRADE CO., LTD', code: 'GLBTRD' },
    { name: 'ORIENT SHIPPING JSC', code: 'ORISHP' },
    { name: 'PACIFIC IMPEX CORP', code: 'PACIMP' },
    { name: 'SUNRISE CARGO LTD', code: 'SUNCGO' },
    { name: 'DELTA FREIGHT INC', code: 'DELFRT' },
  ]
  const salesArr = ['JOHN', 'MARY', 'TOM', 'LINH']
  const opsArr = ['ANNA', 'PETER', 'HOA', 'MINH']
  const buArr = ['SGN', 'HAN', 'DAD']
  const routes = [['SGN', 'LAX'], ['SGN', 'HKG'], ['HAN', 'NRT'], ['SGN', 'ROT'], ['HAN', 'LAX'], ['DAD', 'SIN']]
  const modes = ['FCL', 'LCL', 'AIR']
  const currencies = ['USD', 'USD', 'USD', 'VND', 'CNY']
  const portToCountry = (port: string) => ({ SGN: 'VN', HAN: 'VN', DAD: 'VN', HPH: 'VN', LAX: 'US', HKG: 'HK', NRT: 'JP', ROT: 'NL', SIN: 'SG' } as Record<string, string>)[port] || ''
  const addDays = (dateStr: string, days: number) => {
    const date = new Date(dateStr)
    date.setDate(date.getDate() + days)
    return date.toISOString().slice(0, 10)
  }
  const typePlusMap: Record<string, string[]> = { EXW: ['DO', 'DAP', 'DDU', 'DDP'], FCA: ['DO', 'DAP', 'DDU', 'DDP'], FCF: ['DO', 'DAP', 'DDU', 'DDP'], DO: ['EXW', 'FCA', 'FCF'], DAP: ['EXW', 'FCA', 'FCF'], DDU: ['EXW', 'FCA', 'FCF'], DDP: ['EXW', 'FCA', 'FCF'] }
  const base: Record<string, any>[] = []
  const revenue: Record<string, any>[] = []
  const cost: Record<string, any>[] = []
  const margin: Record<string, any>[] = []
  const volFcl: Record<string, any>[] = []
  const volLcl: Record<string, any>[] = []
  const volAir: Record<string, any>[] = []
  const newClient: Record<string, any>[] = []
  let seq = 1
  ;[2022, 2023, 2024, 2025, 2026].forEach((year) => {
    const monthsInYear = year === 2026 ? 7 : 12
    for (let m = 1; m <= monthsInYear; m++) {
      const shipCount = 2 + ((year + m) % 2)
      for (let s = 0; s < shipCount; s++) {
        const idx = (year * 100 + m * 10 + s) % customers.length
        const client = customers[idx]
        const shipper = customers[(idx + 1) % customers.length]
        const cnee = customers[(idx + 2) % customers.length]
        const route = routes[(year + m + s) % routes.length]
        const type = analysisTypeOptions[(year + m + s) % analysisTypeOptions.length]
        const typeplus = ((year + m + s * 3) % 3 === 0) ? '' : (typePlusMap[type]?.[0] || '')
        const day = String(5 + ((s * 7) % 23)).padStart(2, '0')
        const etd = `${year}-${String(m).padStart(2, '0')}-${day}`
        const eta = addDays(etd, 7)
        const ref = `SHP${year}${String(m).padStart(2, '0')}${String(seq).padStart(3, '0')}`
        seq++
        const common = {
          bu: buArr[(year + m + s) % buArr.length],
          originbu: portToCountry(route[0]),
          destinationbu: portToCountry(route[1]),
          type,
          typeplus,
          ref,
          hbl: `HBL${ref}`,
          mbl: `MBL${ref}`,
          clientcode: client.code,
          clientname: client.name,
          shippercode: shipper.code,
          shippername: shipper.name,
          cneecode: cnee.code,
          cneename: cnee.name,
          etd,
          eta,
          pol: route[0],
          pod: route[1],
          sales: salesArr[(year + m + s) % salesArr.length],
          ops: opsArr[(year + m + s + 1) % opsArr.length],
        }
        const baseAmount = 500 + ((year + m + s) % 10) * 150
        const revAmount = baseAmount + 300
        const costAmount = baseAmount
        const currency = currencies[(year + m) % currencies.length]
        const row = { ...common, mode: modes[(year + m + s) % modes.length], amount: revAmount, currency }
        base.push(row)
        revenue.push({ ...common, chargename: 'OCEAN FREIGHT', amount: String(revAmount), currency, payer: client.name, payerid: `${client.code}01`, namecode: client.code, collectat: 'ORIGIN', requesteddate: etd, approveddate: eta })
        cost.push({ ...common, chargename: 'OCEAN FREIGHT', amount: String(costAmount), currency, receiver: 'CARRIER LINE', receiverid: 'CAR01', namecode: client.code, payat: 'DESTINATION', requesteddate: etd, approveddate: eta })
        margin.push({ ...common, vesselvoyage: `MV OCEAN STAR / V.${100 + ((year + m + s) % 50)}`, amount: String(revAmount - costAmount), currency })
        const volumeRow: Record<string, any> = { ...common }
        if (row.mode === 'FCL') {
          volumeRow.volume = String(1 + (s % 3))
          volumeRow.teu = String((1 + (s % 3)) * 2)
          volumeRow.gw = String(8000 + s * 500)
          volumeRow.cbm = String(28 + s * 2)
          volFcl.push(volumeRow)
        } else {
          volumeRow.gw = String(200 + s * 80)
          volumeRow.cbm = String(2 + s * 1.5)
          if (row.mode === 'LCL') volLcl.push(volumeRow)
          else volAir.push(volumeRow)
        }
        if (s === 0 && m % 3 === 0) {
          newClient.push({ ...common, ndate: etd, fullname: client.name, namecode: client.code, id: `${client.code}ID` })
        }
      }
    }
  })
  const makeVolumeRows = (mode: 'FCL' | 'LCL' | 'AIR') => base.slice(0, 46).map((row, index) => {
    const volumeRow: Record<string, any> = { ...row, mode }
    if (mode === 'FCL') {
      const cbm = 28 + (index % 4) + (index === 45 ? 7 : 0)
      volumeRow.volume = String(1 + (index % 3))
      volumeRow.teu = String((1 + (index % 3)) * 2)
      volumeRow.gw = String(8000 + (index % 12) * 500)
      volumeRow.cbm = String(cbm)
    } else {
      volumeRow.gw = String(mode === 'LCL' ? 200 + (index % 10) * 80 : 60 + (index % 10) * 20)
      volumeRow.cbm = String(mode === 'LCL' ? 2 + (index % 5) * 1.5 : 1 + (index % 4) * 0.5)
    }
    return volumeRow
  })
  volFcl.splice(0, volFcl.length, ...makeVolumeRows('FCL'))
  volLcl.splice(0, volLcl.length, ...makeVolumeRows('LCL'))
  volAir.splice(0, volAir.length, ...makeVolumeRows('AIR'))
  const paymentList = cost.map((row, index) => {
    const invoiceDate = addDays(row.etd, 5)
    const afterDays = 25 + (index % 15)
    return { approveddate: row.etd, ...row, vesselvoyage: `MV OCEAN STAR / V.${100 + (index % 50)}`, unit: 'Set', payto: row.receiver, id: row.receiverid, paymentbu: row.bu, payer: `ACCOUNTING - ${row.sales}`, payat: 'VIETNAM', payafter: String(afterDays), paymentdeadline: addDays(invoiceDate, afterDays), debitno: `DBN${row.ref}`, debitdate: row.etd, invoiceno: `INV${row.ref}`, invoicedate: invoiceDate, paiddate: index % 3 !== 0 ? addDays(invoiceDate, 15 + (index % 30)) : '' }
  })
  const collectionList = revenue.map((row, index) => {
    const invoiceDate = addDays(row.etd, 5)
    const afterDays = 25 + ((index + 2) % 15)
    return { approveddate: row.etd, ...row, vesselvoyage: `MV OCEAN STAR / V.${100 + (index % 50)}`, unit: 'Set', collectfrom: row.payer, id: row.payerid, collectionbu: row.bu, receiver: `ACCOUNTING - ${row.sales}`, collectat: 'VIETNAM', receivedafter: String(afterDays), collectiondeadline: addDays(invoiceDate, afterDays), debitno: `DBN${row.ref}`, debitdate: row.etd, invoiceno: `INV${row.ref}`, invoicedate: invoiceDate, receiveddate: index % 3 !== 0 ? addDays(invoiceDate, 15 + (index % 30)) : '' }
  })
  return {
    analysis_revenue: revenue,
    analysis_cost: cost,
    analysis_margin: margin,
    analysis_volume_fcl: volFcl,
    analysis_volume_lcl: volLcl,
    analysis_volume_air: volAir,
    analysis_newclient: newClient,
    analysis_paymentlist: paymentList,
    analysis_collectionlist: collectionList,
  } as Record<string, Record<string, any>[]>
}
const seedAnalysisSampleData = async () => {
  if (!(await confirmAdmin('This will replace current Analysis & Statistics sample records with generated shipment data for 2022-2026. Continue?', 'Load sample data', 'Load sample data', 'danger'))) return
  saving.value = true
  try {
    const samples = analysisSampleRows()
    const shipmentCount = samples.analysis_revenue?.length || 0
    for (const page of Object.keys(samples)) {
      const existing = await apiFetch(`/records?country=GLOBAL&page=${encodeURIComponent(page)}&limit=1000`)
      for (const record of Array.isArray(existing.items) ? existing.items : []) {
        await apiFetch(`/records/${record.id}`, { method: 'DELETE' })
      }
      for (const [index, row] of samples[page].entries()) {
        await apiFetch('/records', {
          method: 'POST',
          body: {
            country: 'GLOBAL',
            page,
            kind: 'analysis-statistics',
            data: { ...row, table: page.replace(/^analysis_/, ''), status: 'Active' },
            sortOrder: index + 1,
          },
        })
      }
    }
    await loadRecords()
    await loadAnalysisDashboardRecords()
    await notifyAdmin(`Analysis sample data saved to database: ${shipmentCount} shipment rows loaded across Revenue, Cost, Margin, Volume, NewClient and ApprovalList.`, 'Load complete')
  } catch (error: any) {
    await notifyAdmin(error?.data?.message || error?.message || 'Could not load analysis sample data.')
  } finally {
    saving.value = false
  }
}
const exportSalesRows = (scope: 'selected' | 'filtered' | 'all' = 'filtered') => {
  const columns = tableColumns.value
  const rows = scope === 'selected'
    ? records.value.filter((record) => state.selected.has(record.id))
    : scope === 'all'
      ? records.value
      : filteredRows.value
  if (!rows.length) {
    notifyAdmin('Nothing to export.', 'Export')
    state.smExportOpen = false
    return
  }
  const lines = [
    columns.map((column: any) => csvCell(column.label)).join(','),
    ...rows.map((record) => {
      const data = dataOf(record)
      return columns.map((column: any) => csvCell(data[column.key] ?? '')).join(',')
    }),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const slug = activeSalesTableLabel.value.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase()
  link.href = url
  link.download = `SHOPTRANS_${slug || 'sales_marketing'}_export.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  state.smExportOpen = false
}
const downloadTemplate = async () => {
  const XLSX = await import('xlsx')
  const sample = Object.fromEntries(templateColumns.value.map((key: string) => [key, '']))
  const ws = XLSX.utils.json_to_sheet([sample], { header: templateColumns.value })
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template')
  XLSX.writeFile(wb, `SHOPTRANS_${state.country}_${recordPage.value}_template.xlsx`)
}
const triggerImport = () => {
  if (!importFile.value) return
  importFile.value.value = ''
  importFile.value.click()
}
const rowValue = (row: Record<string, any>, column: any) => {
  const keys = [column.key, column.label, String(column.label || '').toUpperCase(), String(column.label || '').toLowerCase()]
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(row, key)) return row[key]
  }
  return ''
}
const importSalesRows = async (rows: Record<string, any>[]) => {
  const columns = tableColumns.value.slice()
  const country = recordCountry.value
  const page = recordPage.value
  const kind = currentPage.value.kind
  const baseSortOrder = records.value.length
  const payloads = rows.map((row, index) => {
    const data: Record<string, any> = {}
    columns.forEach((column: any) => {
      const value = rowValue(row, column)
      if (column.kind === 'checkbox') data[column.key] = value === true || String(value).toLowerCase() === 'true' || String(value).toLowerCase() === 'yes' || String(value) === '1'
      else if (column.kind === 'list') data[column.key] = normalizeSalesOption(value)
      else data[column.key] = value ?? ''
    })
    const firstKey = columns[0]?.key
    if (firstKey && !String(data[firstKey] || '').trim()) return null
    return { data: salesDraftData(data), sortOrder: baseSortOrder + index + 1 }
  }).filter(Boolean) as Array<{ data: Record<string, any>; sortOrder: number }>
  let imported = 0
  for (const payload of payloads) {
    await apiFetch('/records', {
      method: 'POST',
      body: {
        country,
        page,
        kind,
        data: payload.data,
        sortOrder: payload.sortOrder,
      },
    })
    imported++
  }
  await loadRecords()
  await notifyAdmin(`Imported ${imported} row(s).`, 'Import complete')
}
const handleImport = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  loading.value = true
  try {
    const XLSX = await import('xlsx')
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(wb.Sheets[wb.SheetNames[0]], { defval: '' })
    if (isSheetGridPage.value) {
      await importSalesRows(rows)
      return
    }
    for (const row of rows) {
      Object.keys(recordForm).forEach((key) => delete recordForm[key])
      Object.assign(recordForm, row)
      await apiFetch('/records', { method: 'POST', body: { country: recordCountry.value, page: recordPage.value, kind: currentPage.value.kind, data: buildRecordData(), sortOrder: Number(recordForm.sortOrder) || 0 } })
    }
    await loadRecords()
  } finally {
    loading.value = false
    input.value = ''
  }
}

const openHsImportModal = async () => {
  hsImportModal.open = true
  hsImportModal.search = ''
  hsImportModal.error = ''
  if (!hsImportModal.items.length) await loadHsPreview()
}
const closeHsImportModal = () => {
  hsImportModal.open = false
}
const loadHsPreview = async () => {
  hsImportModal.loading = true
  hsImportModal.error = ''
  hsImportModal.selected.clear()
  try {
    const result = await apiFetch('/preview/macmap-hs')
    hsImportModal.items = Array.isArray(result?.items) ? result.items : []
  } catch (error: any) {
    hsImportModal.error = error?.data?.message || error?.message || 'Could not load Macmap HS codes.'
  } finally {
    hsImportModal.loading = false
  }
}
const toggleHsSelected = (item: any) => {
  if (item.exists) return
  if (hsImportModal.selected.has(item.hscode)) hsImportModal.selected.delete(item.hscode)
  else hsImportModal.selected.add(item.hscode)
}
const toggleAllHsVisible = () => {
  const visible = hsFilteredItems.value.filter((item) => !item.exists)
  if (hsAllVisibleSelected.value) visible.forEach((item) => hsImportModal.selected.delete(item.hscode))
  else visible.forEach((item) => hsImportModal.selected.add(item.hscode))
}
const importSelectedHsCodes = async () => {
  const items = hsImportModal.items.filter((item) => hsImportModal.selected.has(item.hscode) && !item.exists)
  if (!items.length) return
  importingExternal.value = true
  hsImportModal.error = ''
  try {
    const result = await apiFetch('/import/macmap-hs', { method: 'POST', body: { items } })
    await loadRecords()
    hsImportModal.items = hsImportModal.items.map((item) => hsImportModal.selected.has(item.hscode) ? { ...item, exists: true } : item)
    hsImportModal.selected.clear()
    await notifyAdmin(`Imported ${result?.created || 0} HS code(s) from Macmap.org.`, 'Import complete')
  } catch (error: any) {
    hsImportModal.error = error?.data?.message || error?.message || 'Could not import selected HS codes.'
  } finally {
    importingExternal.value = false
  }
}

const openPostalImportModal = async () => {
  postalImportModal.open = true
  postalImportModal.search = ''
  postalImportModal.error = ''
  const current = state.country === 'VN' ? 'VN' : state.country === 'US' ? 'US' : postalImportCountries.some((item) => item.code === state.country) ? state.country : 'US'
  postalImportModal.country = current
  await loadPostalPreview()
}
const closePostalImportModal = () => {
  postalImportModal.open = false
}
const loadPostalPreview = async () => {
  postalImportModal.loading = true
  postalImportModal.error = ''
  postalImportModal.selected.clear()
  try {
    const result = await apiFetch(`/preview/postal-codes?country=${encodeURIComponent(postalImportModal.country)}&limit=5000`)
    postalImportModal.source = result?.source || ''
    postalImportModal.items = Array.isArray(result?.items) ? result.items : []
  } catch (error: any) {
    postalImportModal.source = ''
    postalImportModal.items = []
    postalImportModal.error = error?.data?.message || error?.message || 'Could not load postal-code data.'
  } finally {
    postalImportModal.loading = false
  }
}
const togglePostalSelected = (item: any) => {
  if (item.exists) return
  if (postalImportModal.selected.has(item.id)) postalImportModal.selected.delete(item.id)
  else postalImportModal.selected.add(item.id)
}
const toggleAllPostalVisible = () => {
  const visible = postalFilteredItems.value.filter((item) => !item.exists)
  if (postalAllVisibleSelected.value) visible.forEach((item) => postalImportModal.selected.delete(item.id))
  else visible.forEach((item) => postalImportModal.selected.add(item.id))
}
const importSelectedPostalCodes = async () => {
  const items = postalImportModal.items.filter((item) => postalImportModal.selected.has(item.id) && !item.exists)
  if (!items.length) return
  importingExternal.value = true
  postalImportModal.error = ''
  try {
    const result = await apiFetch('/import/postal-codes', { method: 'POST', body: { country: postalImportModal.country, items } })
    if (isReferenceCountries.value) {
      await loadPostalCountryRecords(postalImportModal.country, true)
    } else {
      if (postalImportModal.country !== state.country) state.country = postalImportModal.country
      await loadRecords()
    }
    postalImportModal.items = postalImportModal.items.map((item) => postalImportModal.selected.has(item.id) ? { ...item, exists: true } : item)
    postalImportModal.selected.clear()
    await notifyAdmin(`Imported ${result?.created || 0} postal code record(s).`, 'Import complete')
  } catch (error: any) {
    postalImportModal.error = error?.data?.message || error?.message || 'Could not import selected postal codes.'
  } finally {
    importingExternal.value = false
  }
}

const openSeaportImportModal = async () => {
  seaportImportModal.open = true
  seaportImportModal.search = ''
  seaportImportModal.error = ''
  const current = postalImportCountries.some((item) => item.code === state.country) ? state.country : 'VN'
  seaportImportModal.country = current
  await loadSeaportPreview()
}
const closeSeaportImportModal = () => {
  seaportImportModal.open = false
}
const loadSeaportPreview = async () => {
  seaportImportModal.loading = true
  seaportImportModal.error = ''
  seaportImportModal.selected.clear()
  try {
    const result = await apiFetch(`/preview/seaports?country=${encodeURIComponent(seaportImportModal.country)}&source=${encodeURIComponent(seaportImportModal.sourceKey)}&limit=5000`)
    seaportImportModal.source = result?.source || ''
    seaportImportModal.items = Array.isArray(result?.items) ? result.items : []
  } catch (error: any) {
    seaportImportModal.source = ''
    seaportImportModal.items = []
    seaportImportModal.error = error?.data?.message || error?.message || 'Could not load UN/LOCODE seaport data.'
  } finally {
    seaportImportModal.loading = false
  }
}
const toggleSeaportSelected = (item: any) => {
  if (item.exists) return
  if (seaportImportModal.selected.has(item.id)) seaportImportModal.selected.delete(item.id)
  else seaportImportModal.selected.add(item.id)
}
const toggleAllSeaportVisible = () => {
  const visible = seaportFilteredItems.value.filter((item) => !item.exists)
  if (seaportAllVisibleSelected.value) visible.forEach((item) => seaportImportModal.selected.delete(item.id))
  else visible.forEach((item) => seaportImportModal.selected.add(item.id))
}
const importSelectedSeaports = async () => {
  const items = seaportImportModal.items.filter((item) => seaportImportModal.selected.has(item.id) && !item.exists)
  if (!items.length) return
  importingExternal.value = true
  seaportImportModal.error = ''
  try {
    const result = await apiFetch('/import/seaports', { method: 'POST', body: { country: seaportImportModal.country, source: seaportImportModal.sourceKey, items } })
    if (seaportImportModal.country !== state.country) state.country = seaportImportModal.country
    await loadRecords()
    seaportImportModal.items = seaportImportModal.items.map((item) => seaportImportModal.selected.has(item.id) ? { ...item, exists: true } : item)
    seaportImportModal.selected.clear()
    await notifyAdmin(`Imported ${result?.created || 0} seaport record(s) from UN/LOCODE.`, 'Import complete')
  } catch (error: any) {
    seaportImportModal.error = error?.data?.message || error?.message || 'Could not import selected seaports.'
  } finally {
    importingExternal.value = false
  }
}

const openCfsImportModal = async () => {
  cfsImportModal.open = true
  cfsImportModal.search = ''
  cfsImportModal.error = ''
  const current = postalImportCountries.some((item) => item.code === state.country) ? state.country : 'VN'
  cfsImportModal.country = current
  await loadCfsPreview()
}
const closeCfsImportModal = () => {
  cfsImportModal.open = false
}
const loadCfsPreview = async () => {
  cfsImportModal.loading = true
  cfsImportModal.error = ''
  cfsImportModal.selected.clear()
  try {
    const result = await apiFetch(`/preview/cfs-warehouses?country=${encodeURIComponent(cfsImportModal.country)}&source=${encodeURIComponent(cfsImportModal.sourceKey)}&limit=5000`)
    cfsImportModal.source = result?.source || ''
    cfsImportModal.items = Array.isArray(result?.items) ? result.items : []
  } catch (error: any) {
    cfsImportModal.source = ''
    cfsImportModal.items = []
    cfsImportModal.error = error?.data?.message || error?.message || 'Could not load CFS warehouse data.'
  } finally {
    cfsImportModal.loading = false
  }
}
const toggleCfsSelected = (item: any) => {
  if (item.exists) return
  if (cfsImportModal.selected.has(item.id)) cfsImportModal.selected.delete(item.id)
  else cfsImportModal.selected.add(item.id)
}
const toggleAllCfsVisible = () => {
  const visible = cfsFilteredItems.value.filter((item) => !item.exists)
  if (cfsAllVisibleSelected.value) visible.forEach((item) => cfsImportModal.selected.delete(item.id))
  else visible.forEach((item) => cfsImportModal.selected.add(item.id))
}
const importSelectedCfs = async () => {
  const items = cfsImportModal.items.filter((item) => cfsImportModal.selected.has(item.id) && !item.exists)
  if (!items.length) return
  importingExternal.value = true
  cfsImportModal.error = ''
  try {
    const result = await apiFetch('/import/cfs-warehouses', { method: 'POST', body: { country: cfsImportModal.country, source: cfsImportModal.sourceKey, items } })
    if (cfsImportModal.country !== state.country) state.country = cfsImportModal.country
    await loadRecords()
    cfsImportModal.items = cfsImportModal.items.map((item) => cfsImportModal.selected.has(item.id) ? { ...item, exists: true } : item)
    cfsImportModal.selected.clear()
    await notifyAdmin(`Imported ${result?.created || 0} CFS warehouse record(s).`, 'Import complete')
  } catch (error: any) {
    cfsImportModal.error = error?.data?.message || error?.message || 'Could not import selected CFS warehouses.'
  } finally {
    importingExternal.value = false
  }
}

const startSidebarResize = (event: MouseEvent) => {
  sidebarResize.active = true
  sidebarResize.x = event.clientX
  sidebarResize.w = sidebarWidth.value
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}
const moveSidebarResize = (event: MouseEvent) => {
  if (!sidebarResize.active) return
  sidebarWidth.value = Math.max(180, Math.min(360, sidebarResize.w + event.clientX - sidebarResize.x))
}
const stopSidebarResize = () => {
  if (!sidebarResize.active) return
  sidebarResize.active = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  try {
    localStorage.setItem('ST_ADMIN_SIDEW', String(sidebarWidth.value))
  } catch (e) {}
}
const openNativeDatePicker = (event: Event) => {
  const input = event.target as HTMLInputElement | null
  if (!input || input.tagName !== 'INPUT') return
  if (!['date', 'time', 'datetime-local', 'month', 'week'].includes(input.type)) return
  if (input.disabled || input.readOnly) return
  try {
    input.focus({ preventScroll: true })
    ;(input as HTMLInputElement & { showPicker?: () => void }).showPicker?.()
  } catch (e) {}
}
const closeCountryMenuOutside = (event: Event) => {
  if ((event.target as HTMLElement | null)?.closest('.country-dd')) return
  countryOpen.value = false
}

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(accountProfileKey) || '{}')
    accountProfile.name = String(saved?.name || '')
    accountProfile.country = String(saved?.country || '')
    accountProfile.department = String(saved?.department || '')
    accountProfile.departments = Array.isArray(saved?.departments) ? saved.departments : (accountProfile.department ? [accountProfile.department] : [])
  } catch (e) {}
  try {
    haulageOrsKey.value = localStorage.getItem('shoptrans_ors_key_v1') || ''
    const savedBuffer = Number(localStorage.getItem('shoptrans_ors_ttbuf_v1') || '1.3')
    haulageTtBuffer.value = Number.isFinite(savedBuffer) && savedBuffer >= 1 ? savedBuffer : 1.3
  } catch (e) {}
  try {
    const savedSidebarWidth = Number(localStorage.getItem('ST_ADMIN_SIDEW') || '')
    if (savedSidebarWidth) sidebarWidth.value = Math.max(180, Math.min(360, savedSidebarWidth))
  } catch (e) {}
  try {
    ai.apiKey = localStorage.getItem(AI_KEY_STORE) || ''
    ai.apiKeyDraft = ai.apiKey
    ai.model = localStorage.getItem(AI_MODEL_STORE) || ai.model
    const panel = JSON.parse(localStorage.getItem(AI_PANEL_STORE) || 'null')
    if (panel?.w) ai.panelW = Math.max(320, Math.min(Number(panel.w), Math.max(320, window.innerWidth - 30)))
    if (panel?.h) ai.panelH = Math.max(360, Math.min(Number(panel.h), Math.max(360, window.innerHeight - 110)))
    if (panel?.b) ai.bottom = Math.max(12, Math.min(Number(panel.b), Math.max(12, window.innerHeight - 96)))
  } catch (e) {}
  loadSalesColumnWidths()
  window.addEventListener('mousemove', moveSidebarResize)
  window.addEventListener('mouseup', stopSidebarResize)
  window.addEventListener('mousemove', moveSalesColumnResize)
  window.addEventListener('mouseup', stopSalesColumnResize)
  window.addEventListener('mousemove', moveAiPanelResize)
  window.addEventListener('mouseup', stopAiPanelResize)
  window.addEventListener('mousemove', moveAiInputResize)
  window.addEventListener('mouseup', stopAiInputResize)
  window.addEventListener('mousemove', moveAiVerticalDrag)
  window.addEventListener('mouseup', stopAiVerticalDrag)
  window.addEventListener('resize', positionAccountMenu)
  document.addEventListener('mousedown', handleSalesListOutside, true)
  document.addEventListener('mousedown', handleAnalysisFilterOutside, true)
  document.addEventListener('mousedown', closeCountryMenuOutside, true)
  document.addEventListener('mousedown', closeAccountMenuOutside, true)
  document.addEventListener('keydown', handleAccountKeydown, true)
  document.addEventListener('contextmenu', handleSalesGridContextMenu, true)
  document.addEventListener('pointerdown', openNativeDatePicker, true)
  document.addEventListener('focusin', openNativeDatePicker, true)
  refreshAll()
})
onUnmounted(() => {
  window.removeEventListener('mousemove', moveSidebarResize)
  window.removeEventListener('mouseup', stopSidebarResize)
  window.removeEventListener('mousemove', moveSalesColumnResize)
  window.removeEventListener('mouseup', stopSalesColumnResize)
  window.removeEventListener('mousemove', moveAiPanelResize)
  window.removeEventListener('mouseup', stopAiPanelResize)
  window.removeEventListener('mousemove', moveAiInputResize)
  window.removeEventListener('mouseup', stopAiInputResize)
  window.removeEventListener('mousemove', moveAiVerticalDrag)
  window.removeEventListener('mouseup', stopAiVerticalDrag)
  window.removeEventListener('resize', positionAccountMenu)
  document.removeEventListener('mousedown', handleSalesListOutside, true)
  document.removeEventListener('mousedown', handleAnalysisFilterOutside, true)
  document.removeEventListener('mousedown', closeCountryMenuOutside, true)
  document.removeEventListener('mousedown', closeAccountMenuOutside, true)
  document.removeEventListener('keydown', handleAccountKeydown, true)
  document.removeEventListener('contextmenu', handleSalesGridContextMenu, true)
  document.removeEventListener('pointerdown', openNativeDatePicker, true)
  document.removeEventListener('focusin', openNativeDatePicker, true)
  stopSidebarResize()
  stopSalesColumnResize()
  stopAiPanelResize()
  stopAiInputResize()
  stopAiVerticalDrag()
  stopFxAutoRefresh()
  destroyAnalysisBarChart()
})
</script>

<style scoped>
.adm,.adm input,.adm select,.adm textarea,.adm button,.adm option,.adm optgroup,.adm datalist{color-scheme:only light}.adm select,.adm option,.adm optgroup{background-color:#fff;color:#17251d}.adm input::-webkit-calendar-picker-indicator{color-scheme:only light}
.adm{--g0:#fff;--g50:#f7f8f7;--g75:#eef1ee;--g100:#e4e8e4;--g150:#d6dcd6;--g200:#c3ccc4;--g300:#9aa69c;--g400:#6f7d72;--g500:#4a564d;--g600:#323b35;--g700:#1c2420;--g-900:#0f3d23;--g-800:#15532f;--g-700:#1b7a43;--g-600:#22a155;--g-500:#2ec46b;--g-100:#d8f3e2;--g-50:#eef9f1;--g-line:#c4e6d1;--ink:#16241c;--muted:#5d7567;--white:#fff;--bg:#f5faf6;--danger:#c0392b;--danger-bg:#fdecea;--radius:8px;--shadow:0 1px 2px rgba(15,61,35,.06),0 6px 18px rgba(15,61,35,.06);--green:#00C566;--green-d:#16A34A;--green-dd:#0f7a37;--green-l:#e7f9ef;--green-ll:#f1fcf6;--amber:#d97706;--amber-l:#fef3e2;--red:#dc2626;--red-l:#fde8e8;--blue:#2563eb;--blue-l:#e8f0fe;--shadow-sm:0 1px 2px rgba(28,36,32,.05),0 1px 3px rgba(28,36,32,.07);--shadow-lg:0 20px 40px -12px rgba(28,36,32,.22),0 8px 16px -8px rgba(28,36,32,.12);min-height:100vh;color:var(--g700);background:var(--g50);background-image:radial-gradient(var(--g150) 1px,transparent 1px);background-size:22px 22px;font-family:Geist,system-ui,sans-serif;font-size:14px;line-height:1.45}
button,input,select,textarea{font:inherit;color:inherit}button{cursor:pointer;border:0;background:none}button:disabled{opacity:.45;cursor:not-allowed}svg{width:18px;height:18px}.adm :deep(svg){width:18px;height:18px;display:block}.spacer{flex:1}.hidden-file{display:none}
.masked-input{-webkit-text-security:disc}
.ai-fab{position:fixed;right:20px;bottom:20px;width:58px;height:58px;min-width:58px;min-height:58px;border-radius:50%;background:#0f3d23;border:none;cursor:grab;z-index:6001;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(15,61,35,.35);transition:background .15s,transform .15s}.ai-fab:active{cursor:grabbing}.ai-fab:hover{background:#092818;transform:scale(1.05)}.ai-fab svg{width:32px!important;height:32px!important;display:block;flex:0 0 32px}.ai-fab-hint{position:absolute;right:calc(100% + 10px);top:50%;transform:translateY(-50%) translateX(4px);padding:6px 9px;border-radius:6px;background:#16241c;color:#fff;font-size:11px;font-weight:600;line-height:1;white-space:nowrap;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .15s,transform .15s}.ai-fab-hint:after{content:"";position:absolute;left:100%;top:50%;transform:translateY(-50%);border:5px solid transparent;border-left-color:#16241c}.ai-fab:hover .ai-fab-hint,.ai-fab:focus-visible .ai-fab-hint{opacity:1;visibility:visible;transform:translateY(-50%) translateX(0)}
.ai-panel{position:fixed;right:20px;bottom:84px;max-width:calc(100vw - 30px);max-height:calc(100vh - 110px);background:#fff;border:1px solid #c4e6d1;border-radius:12px;box-shadow:0 10px 34px rgba(15,61,35,.25);z-index:6000;display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(14px);pointer-events:none;transition:opacity .18s,transform .18s}.ai-panel.on{opacity:1;transform:translateY(0);pointer-events:auto}.ai-head{background:#0f3d23;color:#fff;padding:9px 12px;display:flex;align-items:center;justify-content:space-between;flex:0 0 auto;cursor:grab}.ai-head:active{cursor:grabbing}.ai-title{font-weight:700;font-size:13.5px;display:flex;align-items:center;gap:7px}.ai-title .ai-dot{width:8px;height:8px;border-radius:50%;background:#22a155;display:inline-block}.ai-hbtns{display:flex;gap:4px}.ai-hbtns button{background:transparent;border:none;color:#fff;cursor:pointer;width:26px;height:26px;min-width:26px;min-height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;padding:0}.ai-hbtns button:hover{background:rgba(255,255,255,.15)}
.ai-settings{display:none;background:#eef9f1;border-bottom:1px solid #c4e6d1;padding:10px 12px;flex:0 0 auto}.ai-settings.on{display:block}.ai-settings label{font-size:11.5px;font-weight:700;color:#16241c;display:block;margin-bottom:4px}.ai-model-label{margin-top:8px}.ai-keyrow{display:flex;gap:6px}.ai-keyrow input{flex:1;border:1px solid #c4e6d1;border-radius:6px;padding:6px 8px;font-size:12px}.ai-keyrow button,.ai-clear{background:#008f4c;color:#fff;border:none;border-radius:6px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer}.ai-keyrow button:hover,.ai-clear:hover{background:#0f3d23}.ai-note{font-size:10.5px;color:#5d7567;margin-top:6px}.ai-clear{margin-top:8px;background:#64748b}
#aiMsgs{flex:1;overflow-y:auto;overflow-x:hidden;padding:12px;background:#f5faf6;display:flex;flex-direction:column;gap:8px}.ai-msg{max-width:85%;flex:0 0 auto;padding:8px 11px;border-radius:10px;font-size:12.5px;line-height:1.45;word-wrap:break-word;white-space:normal}.ai-msg.user{align-self:flex-end;background:#1b7a43;color:#fff;border-bottom-right-radius:3px}.ai-msg.ai{align-self:flex-start;background:#fff;border:1px solid #c4e6d1;color:#16241c;border-bottom-left-radius:3px}.ai-msg.sys{align-self:center;background:transparent;color:#5d7567;font-size:11px;padding:2px 6px;text-align:center}.ai-msg.err{align-self:flex-start;background:#fde8e8;border:1px solid #f0b9b1;color:#dc2626}.ai-msg code{background:#eef9f1;border:1px solid #c4e6d1;border-radius:4px;padding:0 4px;font-size:11.5px}.ai-msg.user code{background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.3);color:#fff}.ai-dots{display:inline-block;letter-spacing:2px;animation:aiblink 1s infinite}@keyframes aiblink{0%,100%{opacity:.25}50%{opacity:1}}
.ai-msg.ai-card{align-self:stretch;max-width:100%;padding:0;background:#fff;border:1px solid #c4e6d1;border-radius:10px;overflow:hidden}.ai-card-h{background:#d8f3e2;padding:7px 10px;font-size:11.5px;font-weight:700;color:#0f3d23}.ai-card-h small{display:block;font-weight:400;color:#5d7567;font-size:10.5px}.ai-card-tblwrap{max-height:210px;overflow:auto}.ai-card table{table-layout:auto;border-collapse:collapse;border-spacing:0;font-size:11px;width:max-content;min-width:100%}.ai-card thead th{background:#eef9f1;color:#16241c;border:1px solid #c4e6d1;padding:4px 6px;font-size:10.5px;font-weight:700;letter-spacing:0;white-space:nowrap;position:sticky;top:0;z-index:1;text-align:left;border-radius:0}.ai-card td{border:1px solid #c4e6d1;padding:2px;background:#fff}.ai-card td input,.ai-card td select{width:110px;min-width:110px;box-sizing:border-box;border:1px solid transparent;border-radius:4px;padding:3px 5px;font-size:11px;background:transparent}.ai-card td input:focus,.ai-card td select:focus{border-color:#22a155;background:#fff;outline:none}.ai-card td select.aiv-bad,.ai-card td input.aiv-bad{border-color:#dc2626;background:#fde8e8}.ai-card-f{display:flex;justify-content:flex-end;gap:8px;padding:8px 10px;border-top:1px solid #c4e6d1;align-items:center}.ai-card-f .ai-q{font-size:11.5px;font-weight:700;color:#dc2626;margin-right:auto}.ai-btn{border:none;border-radius:6px;padding:6px 16px;font-size:12px;font-weight:700;cursor:pointer;color:#fff}.ai-btn.green{background:#008f4c}.ai-btn.green:hover{background:#0f3d23}.ai-btn.red{background:#c0392b}.ai-btn.red:hover{background:#a23227}.ai-btn:disabled{opacity:.45;cursor:not-allowed}.ai-card-done{padding:8px 10px;font-size:11.5px;font-weight:700;border-top:1px solid #c4e6d1}.ai-card-done.ok{color:#008f4c}.ai-card-done.no{color:#5d7567}
#aiThumbs{display:none;gap:6px;padding:6px 10px 0;flex-wrap:wrap;flex:0 0 auto;background:#fff}#aiThumbs.on{display:flex}.ai-thumb{position:relative;width:38px;height:38px;border-radius:6px;overflow:hidden;border:1px solid #c4e6d1}.ai-thumb img{width:100%;height:100%;object-fit:cover}.ai-thumb button{position:absolute;top:1px;right:1px;width:15px;height:15px;border-radius:50%;background:#dc2626;color:#fff;border:none;padding:0;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.18)}.ai-thumb button:hover{background:#a23227}
.ai-inrow{display:flex;gap:6px;padding:9px 10px;border-top:1px solid #c4e6d1;background:#fff;flex:0 0 auto;align-items:flex-end;position:relative}#aiInpDrag{position:absolute;top:-4px;left:0;right:0;height:8px;cursor:ns-resize;z-index:2}#aiInpDrag:hover{background:linear-gradient(to bottom,transparent 2px,#22a155 3px,#22a155 4px,transparent 5px)}#aiInput{flex:1;border:1px solid #c4e6d1;border-radius:8px;padding:7px 9px;font-size:12.5px;resize:none;overflow:auto;min-height:36px;max-height:50vh;font-family:inherit;line-height:1.4;background:#fff}#aiInput:focus{outline:none;border-color:#22a155}#aiAttach{background:#fff;border:1px solid #c4e6d1;border-radius:8px;width:34px;height:34px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;padding:0}#aiAttach:hover{background:#eef9f1}#aiSend{background:#008f4c;color:#fff;border:none;border-radius:8px;padding:0 16px;height:34px;font-size:12.5px;font-weight:700;cursor:pointer;flex:0 0 auto}#aiSend:hover{background:#0f3d23}#aiSend:disabled{opacity:.5;cursor:not-allowed}.ai-resz{position:absolute;top:0;left:0;width:16px;height:16px;cursor:nwse-resize;z-index:3}.ai-resz::before{content:'';position:absolute;top:3px;left:3px;width:8px;height:8px;border-top:2px solid rgba(255,255,255,.55);border-left:2px solid rgba(255,255,255,.55);border-radius:2px 0 0 0}.ai-panel.ai-drop::after{content:'Drop images here';position:absolute;inset:0;background:rgba(34,161,85,.12);border:2px dashed #22a155;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#0f3d23;z-index:5;pointer-events:none}@media (max-width:480px){.ai-panel{right:8px!important;bottom:78px!important;width:calc(100vw - 16px)!important;height:calc(100vh - 100px)!important}}
.topbar{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.88);backdrop-filter:blur(14px);border-bottom:1px solid var(--g100);display:flex;align-items:center;gap:18px;padding:0 24px;height:62px}.brand{display:flex;align-items:center;gap:11px;flex-shrink:0}.brand-mark{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,var(--green),var(--green-d));display:grid;place-items:center;color:#fff;font-weight:800;font-size:17px;box-shadow:0 4px 12px rgba(0,197,102,.35)}.brand-name{font-weight:800;font-size:16px;letter-spacing:0}.brand-name span{color:var(--g-500)}.brand-sub{font-size:10.5px;color:var(--muted);letter-spacing:.04em}.tb-label{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--g400)}
.country-dd{position:relative}.cdd-btn{display:flex;align-items:center;gap:9px;padding:9px 14px;border:1px solid var(--g150);border-radius:11px;background:#fff;font-size:13.5px;font-weight:600;min-width:190px;box-shadow:var(--shadow-sm);transition:.14s}.cdd-btn:hover{border-color:var(--green);box-shadow:0 0 0 3px var(--green-l)}.cdd-btn img,.cdd-item img,.scope-pill img{width:22px;height:15px;object-fit:cover;border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,.08)}.cdd-btn span:nth-child(2){flex:1;text-align:left}.cdd-btn .chev{width:16px;height:16px;color:var(--g300);transition:.2s}.country-dd.open .chev{transform:rotate(180deg)}.cdd-menu{position:absolute;top:calc(100% + 6px);right:0;width:240px;background:#fff;border:1px solid var(--g100);border-radius:13px;box-shadow:var(--shadow-lg);padding:6px;max-height:360px;overflow-y:auto;display:none;z-index:60}.cdd-menu.show{display:block}.cdd-item{display:flex;align-items:center;gap:10px;width:100%;padding:9px 11px;border-radius:9px;font-size:13.5px;font-weight:500;color:var(--g600);text-align:left;transition:.1s}.cdd-item:hover{background:var(--g50)}.cdd-item.on{background:var(--green-l);color:var(--green-dd);font-weight:600}.cdd-item span:nth-child(2){flex:1}.cdd-item svg{color:var(--green-d)}
.shell{display:flex;min-height:calc(100vh - 62px)}.sidebar{width:262px;flex-shrink:0;border-right:1px solid var(--g100);background:rgba(255,255,255,.5);padding:16px 12px;position:sticky;top:62px;height:calc(100vh - 62px);overflow-y:auto;display:flex;flex-direction:column}.sidebar::-webkit-scrollbar{width:6px}.sidebar::-webkit-scrollbar-thumb{background:var(--g150);border-radius:6px}.side-top{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 6px 10px;margin-bottom:6px;border-bottom:1px solid var(--g75)}.side-top-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--g300)}.side-actions{display:flex;gap:6px;align-items:center}.edit-toggle{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:8px;font-size:12px;font-weight:600;color:var(--g500);border:1px solid var(--g150);background:#fff;transition:.12s}.edit-toggle svg{width:13px;height:13px}.edit-toggle.icon-only{width:30px;padding:5px;justify-content:center}.edit-toggle:hover{border-color:var(--green);color:var(--green-dd)}.edit-toggle.on{background:var(--green-d);color:#fff;border-color:var(--green-d)}
.workbook-shell{position:relative;display:grid;grid-template-columns:var(--sidew,212px) minmax(0,1fr);grid-template-rows:100vh;width:100%;height:100vh;min-height:0;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}.workbook-shell.sidebar-collapsed{grid-template-columns:0 minmax(0,1fr)}.workbook-shell .sidebar{position:relative;top:0;width:var(--sidew,212px);height:100vh;padding:0;overflow:hidden;background:#fff;border-right:1px solid #c4e6d1;transition:opacity .15s}.workbook-shell.sidebar-collapsed .sidebar{display:flex;opacity:0;pointer-events:none}.workbook-brand{display:flex;align-items:center;gap:10px;flex:0 0 auto;margin:18px 14px 8px;padding:6px 6px 16px;border-bottom:1px solid #c4e6d1;background:#fff}.workbook-brand .brand-mark{width:34px;height:34px;border-radius:9px;background:#2ec46b;color:#fff;display:grid;place-items:center;font-size:15px;font-weight:800;box-shadow:inset 0 0 0 2px rgba(255,255,255,.25)}.workbook-brand .brand-name{font-size:14px;font-weight:700;line-height:1.1;color:var(--ink);letter-spacing:.4px}.workbook-brand .brand-sub{font-size:10.5px;color:var(--muted);letter-spacing:.4px;text-transform:none}.workbook-shell .side-top{display:none}.sidebar-scroll{flex:1;min-height:0;overflow-y:auto;padding:0 14px 16px;background:#fff}.sidebar-scroll::-webkit-scrollbar{width:6px}.sidebar-scroll::-webkit-scrollbar-track{background:transparent}.sidebar-scroll::-webkit-scrollbar-thumb{background:#c4e6d1;border-radius:6px}.workbook-shell .nav-group{margin:0 0 6px}.workbook-shell .nav-head{display:flex;align-items:center;gap:10px;width:100%;min-height:36px;padding:9px 11px;border-radius:8px;color:#16241c;font-size:13px;font-weight:600;letter-spacing:0;text-transform:none}.workbook-shell .nav-head:hover{background:#eef9f1;color:#16241c;box-shadow:none}.workbook-shell .nav-head.active{background:#22a155;color:#fff}.workbook-shell .nav-head .ni{width:18px;height:18px;flex:0 0 18px;color:currentColor;opacity:.85}.workbook-shell .nav-head.active .ni{opacity:1}.workbook-shell .nav-head .chev{display:none}.workbook-shell .nav-head .nh-label{font-size:12.5px;text-transform:none}.workbook-shell .nav-items{display:none!important}.workbook-shell .nav-item{padding:7px 10px;border-radius:8px;font-size:12.5px;text-transform:uppercase;color:#3a463f}.workbook-shell .nav-item.active{background:linear-gradient(90deg,rgba(0,197,102,.14),rgba(0,197,102,.03));color:#008f4c;box-shadow:inset 2px 0 0 #00c566}.workbook-shell .nav-item.active:before{display:none}.workbook-shell .nav-item.lvl2{padding-left:38px;font-size:11.5px}.mock-saved{flex:0 0 auto;padding:0 10px 14px 50px;color:#869089;font-size:10px;background:#fff}.mock-saved b{color:#008f4c}.side-resizer{position:absolute;top:0;right:-3px;width:6px;height:100%;cursor:col-resize;z-index:4}.side-resizer:hover{background:rgba(34,161,85,.25)}.mock-side-toggle{position:absolute;left:var(--sidew,212px);top:12px;z-index:20;width:28px;height:28px;display:grid;place-items:center;border:1px solid #d3dacf;border-left:0;border-radius:0 8px 8px 0;background:#fff;color:#3a463f;box-shadow:0 1px 2px rgba(14,21,18,.08);transition:left .15s,color .12s,border-color .12s}.mock-side-toggle:hover{color:#008f4c;border-color:#00c566}.mock-side-toggle :deep(svg),.mock-side-toggle svg{width:14px;height:14px}.sidebar-collapsed .mock-side-toggle{left:0}.workbook-main{width:auto;max-width:none;height:100vh;min-width:0;min-height:0;padding:0;overflow:hidden}
.workbook-shell .nav-item{margin-bottom:1px;font-weight:500}.workbook-shell .nav-item.active{font-weight:600}.workbook-shell .nav-subhead{padding:7px 8px 4px 22px;color:#869089;font-size:9px;font-weight:600;letter-spacing:.09em}.workbook-shell .nav-subhead .ni{width:12px;height:12px}.workbook-shell .nav-item.lvl2{margin-bottom:0}.workbook-shell .nav-head{font-weight:600;letter-spacing:0;text-transform:none}.workbook-shell .nav-head .ni{width:18px;height:18px;color:currentColor;opacity:.85}.workbook-shell .nav-head .ni svg{display:block;width:18px;height:18px;stroke-width:2}.workbook-shell .nav-head > span:not(.ni):not(.nh-label):not(.nh-actions){display:none!important}.workbook-shell .nav-head .chev,.workbook-shell .nav-group.open .chev{display:none!important}.workbook-shell .nav-head:hover .ni,.workbook-shell .nav-head.active .ni{color:currentColor}
.workbook-shell .nav-subgroup[data-ops-section]{--opsc:#00c566;--opsc-w:rgba(0,197,102,.1)}.workbook-shell .nav-subgroup[data-ops-section="efa"]{--opsc:#2563eb;--opsc-w:#e9f0fe}.workbook-shell .nav-subgroup[data-ops-section="fcf"]{--opsc:#0d9488;--opsc-w:#e6f6f4}.workbook-shell .nav-subgroup[data-ops-section="do"]{--opsc:#d97706;--opsc-w:#fdf0e0}.workbook-shell .nav-subgroup[data-ops-section="dup"]{--opsc:#db2777;--opsc-w:#fcebf3}.workbook-shell .nav-subgroup[data-ops-section="d2d"]{--opsc:#7c3aed;--opsc-w:#f1ebfe}.workbook-shell .nav-subhead.ops-subhead{margin:1px 0;border-radius:8px;box-shadow:inset 2px 0 0 var(--opsc);color:#0e1512;font-size:11.5px;letter-spacing:0;text-transform:uppercase;padding:7px 8px 7px 10px;gap:7px;min-width:0}.workbook-shell .nav-subhead.ops-subhead:hover,.workbook-shell .nav-subhead.ops-subhead.active{background:linear-gradient(90deg,var(--opsc-w),transparent);color:#0e1512}.workbook-shell .nav-subhead.ops-subhead .ni{display:inline-grid;place-items:center;width:14px;height:14px;flex:0 0 14px;color:#008f4c}.workbook-shell .ops-subtitle{display:inline-flex;gap:4px;min-width:0;flex:1;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.workbook-shell .ops-subtitle b,.workbook-shell .ops-subtitle span{min-width:0;overflow:hidden;text-overflow:ellipsis}.workbook-shell .ops-subtitle b{font-weight:700;color:#0e1512}.workbook-shell .ops-subtitle span{font-weight:500;color:#a3aca5}.workbook-shell .ops-chev{margin-left:auto;color:#3a463f;opacity:.65;display:inline-grid;place-items:center;flex:0 0 12px;transition:transform .18s}.workbook-shell .nav-subhead.exp .ops-chev{transform:rotate(90deg)}.workbook-shell .ops-chev :deep(svg),.workbook-shell .ops-chev svg{width:12px;height:12px}
.workbook-shell .nav-group.salesnav{margin-top:3px}.workbook-shell .salesnav.open .nav-items{display:block!important}.workbook-shell .salesnav .nav-subgroup{padding:0 0 4px}.workbook-shell .nav-subhead.sales-subhead{padding:8px 8px 5px 28px;gap:8px;color:#869089;font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:7px}.workbook-shell .nav-subhead.sales-subhead:hover,.workbook-shell .nav-subhead.sales-subhead.active{background:transparent;color:#008f4c}.workbook-shell .nav-subhead.sales-subhead .ni{width:15px;height:15px;color:#00a85a}.workbook-shell .nav-item.lvl2.sales-leaf{padding:7px 8px 7px 54px;color:#0e1512;font-size:12.5px;font-weight:500;text-transform:uppercase;border-radius:7px}.workbook-shell .nav-item.lvl2.sales-leaf:hover{background:#fff;color:#008f4c}.workbook-shell .nav-item.lvl2.sales-leaf.active{background:linear-gradient(90deg,rgba(0,197,102,.12),rgba(0,197,102,.02));color:#008f4c;box-shadow:inset 2px 0 0 #00c566}.workbook-shell .salesnav .nav-item-row{padding-right:0}.workbook-shell .salesnav .nav-subhead.active .ni{color:#00a85a}.legacy-workspace-main{padding:18px 22px 28px;overflow:auto;background:#f5f7f5;background-image:radial-gradient(#d7dfd5 1px,transparent 1px);background-size:22px 22px}
.ops-home,.blank-home{height:100vh;min-height:0;background:#f5f7f5}.ops-home{display:grid;place-items:center}.ops-empty-card{max-width:440px;text-align:center;font-size:14px;line-height:1.7;color:#4a564d;border:1px dashed #d3dacf;border-radius:14px;padding:30px 34px;background:#fff;box-shadow:0 1px 2px rgba(14,21,18,.04)}.ops-empty-card b{color:#00c566;font-weight:700}
.sm-page{height:100vh;min-height:0;display:flex;flex-direction:column;background:#f5faf6;color:#16241c;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:13px}.sm-page-head{flex:0 0 auto;background:#fff;border-bottom:1px solid #c4e6d1;padding:16px 22px 12px}.sm-page-head h2{margin:0;color:#0f3d23;font-size:18px;font-weight:750;line-height:1.2}.sm-page-head p{margin:3px 0 0;color:#5d7567;font-size:12px;line-height:1.35}.sm-tabbar{display:flex;gap:4px;flex-wrap:nowrap;flex:0 0 auto;margin:0 0 14px;border-bottom:1px solid #c4e6d1;padding:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin}.sm-tabbar::-webkit-scrollbar{height:6px}.sm-tabbar::-webkit-scrollbar-thumb{background:#c4e6d1;border-radius:3px}.sm-tab{flex:0 0 auto;white-space:nowrap;display:flex;align-items:center;gap:7px;padding:9px 14px;border:0;background:transparent;color:#5d7567;border-bottom:2px solid transparent;border-radius:6px 6px 0 0;font:inherit;font-weight:650;font-size:13px;cursor:pointer}.sm-tab:hover{background:#eef9f1;color:#16241c}.sm-tab.active{color:#1b7a43;border-bottom-color:#22a155;background:#eef9f1}.sm-modepicker{display:flex;gap:6px;margin:0 22px 12px;padding:0}.sm-modepicker button{border:1px solid #c4e6d1;background:#fff;color:#15532f;font:inherit;font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px;cursor:pointer}.sm-modepicker button:hover{background:#eef9f1}.sm-modepicker button.active{color:#fff}.sm-modepicker button.active[data-sm-mode=FCL]{background:#2e7d32;border-color:#2e7d32}.sm-modepicker button.active[data-sm-mode=LCL]{background:#1976d2;border-color:#1976d2}.sm-modepicker button.active[data-sm-mode=AIR]{background:#e67e22;border-color:#e67e22}.sm-toolbar{display:flex;align-items:center;gap:8px;flex:0 0 auto;flex-wrap:wrap;padding:12px 22px;background:#fff;border-bottom:1px solid #c4e6d1;margin-bottom:14px}.sm-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid #c4e6d1;background:#fff;color:#15532f;padding:7px 13px;border-radius:8px;font-size:12.5px;font-weight:650;line-height:1;white-space:nowrap;cursor:pointer}.sm-btn:hover:not(:disabled){background:#eef9f1}.sm-btn.primary{background:#1b7a43;border-color:#1b7a43;color:#fff}.sm-btn.primary:hover:not(:disabled){background:#15532f}.sm-btn.danger{color:#c0392b;border-color:#e7b9b3}.sm-btn.danger:hover:not(:disabled){background:#fdecea}.sm-btn:disabled{opacity:.45;cursor:not-allowed}.sm-btn :deep(svg){width:15px;height:15px}.sm-search-group{display:flex;align-items:center;gap:6px;background:#eef9f1;border:1px solid #c4e6d1;border-radius:8px;padding:3px 4px 3px 6px}.sm-search-group select,.sm-search-group input{border:0;background:transparent;font-size:12.5px;color:#16241c;outline:none}.sm-search-group select{font-weight:650;color:#15532f;cursor:pointer;padding:4px 2px}.sm-search-group .div{width:1px;height:18px;background:#c4e6d1}.sm-search-group input{padding:5px 4px;width:170px}.sm-search-group input::placeholder{color:#8aa897}.sm-status-label{color:#5d7567;font-weight:550;font-size:12.5px}.sm-status-select{border:1px solid #c4e6d1;border-radius:6px;background:#fff;padding:5px 8px;font-size:12px}.sm-tablewrap{flex:1;min-height:0;overflow:auto;position:relative;margin:0 22px 22px;border:1px solid #c4e6d1;border-radius:10px;box-shadow:0 1px 2px rgba(15,61,35,.06),0 6px 18px rgba(15,61,35,.06);background:#fff;padding-bottom:40px}.sm-tablewrap table{border-collapse:separate;border-spacing:0;table-layout:fixed;min-width:0}.sm-tablewrap thead th{position:sticky;top:0;z-index:2;background:#d8f3e2;color:#0f3d23;text-align:center;font-size:11px;letter-spacing:.4px;font-weight:750;padding:9px 6px;border-bottom:1px solid #c4e6d1;border-right:1px solid #c4e6d1;white-space:nowrap;overflow:hidden}.sm-tablewrap tbody td{padding:0;height:34px;border-bottom:1px solid #eef3ef;border-right:1px solid #f1f6f2;vertical-align:middle;text-align:center;overflow:hidden}.sm-tablewrap tbody tr:nth-child(even){background:#fafdfb}.sm-tablewrap tbody tr:hover{background:#eef9f1}.sm-tablewrap tbody tr.sel{background:#e7f7ee!important}.sm-tablewrap thead th.sel-col{position:sticky;left:0;z-index:5;background:#d8f3e2;box-shadow:2px 0 4px -2px rgba(15,61,35,.18)}.sm-tablewrap tbody td.sel-col{position:sticky;left:0;z-index:1;background:#fff;box-shadow:2px 0 4px -2px rgba(15,61,35,.14)}.sm-tablewrap tbody tr.sel td.sel-col{background:#e7f7ee!important}.sm-tablewrap tbody tr:nth-child(even) td.sel-col{background:#fafdfb}.sm-tablewrap tbody tr:hover td.sel-col{background:#eef9f1}.sm-tablewrap tbody tr.sm-editing td.sel-col{background:#eefbf3}.sm-tablewrap tbody tr.sm-editing td{background:#eefbf3;border-top:1.5px solid #2ec46b;border-bottom:1.5px solid #2ec46b}.sm-tablewrap tbody tr.sm-editing td:first-child{border-left:1.5px solid #2ec46b}.sm-tablewrap tbody tr.sm-editing td:last-child{border-right:1.5px solid #2ec46b}.sm-tablewrap .viewcell{width:100%;height:32px;display:flex;align-items:center;justify-content:center;text-align:center;text-transform:uppercase;padding:4px 6px;overflow:hidden;white-space:nowrap;text-overflow:clip}.sm-check{width:15px;height:15px;margin:0;accent-color:#1b7a43}.sm-celli{width:100%;height:32px;border:0;background:transparent;font:inherit;color:#16241c;text-align:center;text-transform:uppercase;padding:4px 6px;outline:none}.sm-celli::placeholder{text-transform:none;color:#8aa897;font-style:italic}.sm-celli:focus{box-shadow:inset 0 0 0 2px #2ec46b;background:#fff;border-radius:4px}.sm-ledge-row td{height:0!important;border:0!important;background:transparent!important}.sm-ledge{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1.5px solid #2ec46b;border-top:0;border-radius:0 0 9px 9px;box-shadow:0 7px 16px rgba(15,61,35,.16);padding:5px 7px}.sm-ledge button{border:1px solid #c4e6d1;border-radius:6px;padding:5px 12px;font-size:11.5px;font-weight:700;background:#fff;color:#15532f}.sm-ledge button.save{background:#1b7a43;border-color:#1b7a43;color:#fff}.sm-ledge button.save:hover{background:#15532f}.sm-ledge button.cancel:hover{background:#eef9f1}.sm-foot{flex:0 0 auto;padding:10px 22px;color:#5d7567;font-size:11.5px;border-top:1px solid #c4e6d1;background:#fff}
.nav-group{margin-bottom:6px}.nav-head{display:flex;align-items:center;gap:9px;width:100%;padding:9px 11px;border-radius:8px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--g400);transition:.12s;cursor:pointer}.nav-head:hover{background:var(--green-ll);color:var(--green-dd)}.nav-head .ni{width:16px;height:16px;flex-shrink:0;color:var(--g300)}.nav-head:hover .ni{color:var(--green-d)}.nav-head .chev{margin-left:auto;width:13px;height:13px;color:var(--g300);transition:.2s}.nav-group.open .chev{transform:rotate(90deg)}.nh-label{flex:1;text-align:left}.nav-items{display:none;padding:3px 0 6px}.nav-group.open .nav-items{display:block}.nav-item-row{display:flex;align-items:center;gap:2px;padding-right:6px}.nav-item{display:flex;align-items:center;gap:8px;width:100%;padding:8px 11px 8px 36px;border-radius:7px;font-size:13px;color:var(--g500);font-weight:500;text-align:left;transition:.12s;position:relative}.nav-item:hover:not(.active){background:var(--green-ll);color:var(--green-dd)}.nav-item.active{background:var(--green-l);color:var(--green-dd);font-weight:600}.nav-item.active:before{content:"";position:absolute;left:18px;top:50%;transform:translateY(-50%);width:5px;height:5px;border-radius:50%;background:var(--green-d)}.nh-actions,.ni-actions{display:inline-flex;gap:2px;margin-left:auto}.nh-act,.ni-act{width:24px;height:24px;border-radius:6px;display:grid;place-items:center;color:var(--g400);transition:.12s;flex-shrink:0}.nh-act svg,.ni-act svg{width:13px;height:13px}.nh-act:hover,.ni-act:hover{background:var(--g100);color:var(--g700)}.nh-act.del:hover,.ni-act.del:hover{background:var(--red-l);color:var(--red)}.ni-actions{opacity:0;transition:.12s}.nav-item-row:hover .ni-actions,.sidebar.edit .ni-actions{opacity:1}.nav-add{display:flex;align-items:center;gap:6px;width:calc(100% - 30px);margin:4px 0 6px 30px;padding:7px 10px;border-radius:7px;font-size:12px;font-weight:600;color:var(--green-dd);background:var(--green-ll);border:1px dashed #bfe9cf}.nav-add svg{width:13px;height:13px}.nav-add-group{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;margin-top:12px;padding:11px;border-radius:9px;font-size:12.5px;font-weight:600;color:var(--g500);background:#fff;border:1px dashed var(--g200)}.nav-dust{display:flex;align-items:center;gap:9px;width:100%;margin-top:14px;padding:10px 11px;border-radius:9px;font-size:13px;font-weight:600;color:var(--g500);background:#fff;border:1px solid var(--g100);transition:.12s}.nav-dust svg{width:16px;height:16px;color:var(--g400);flex-shrink:0}.nav-dust span:nth-child(2){flex:1;text-align:left}.nav-dust:hover{border-color:transparent;background:var(--green-l);color:var(--green-dd)}.nav-dust.active{border-color:transparent;background:var(--green-l);color:var(--green-dd);box-shadow:inset 3px 0 0 0 var(--green-d)}.nav-dust:hover svg,.nav-dust.active svg{color:var(--green-d)}.dust-badge{font-size:10.5px;font-weight:700;color:#fff;background:var(--green-d);padding:1px 8px;border-radius:20px}
.nav-subgroup{padding:2px 0 4px}.nav-subhead{display:flex;align-items:center;gap:8px;width:100%;padding:7px 11px 7px 24px;color:var(--g400);font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;text-align:left}.nav-subhead:hover{color:var(--green-dd);background:var(--green-ll)}.nav-subhead .ni{width:14px;height:14px;color:var(--green-d)}.nav-item.lvl2{padding-left:48px;font-size:12px}.nav-item.lvl2.active:before{left:31px}
.main{flex:1;padding:0px;min-width:0}.crumb{font-size:11.5px;color:var(--g400);margin-bottom:6px;font-weight:500}.crumb b{color:var(--green-d)}.page-head{display:flex;align-items:center;gap:16px;margin-bottom:18px;flex-wrap:wrap;min-height:50px}.page-title{font-size:23px;font-weight:800;letter-spacing:0;line-height:1.2}.page-desc{font-size:13px;color:var(--g400);margin-top:3px;max-width:760px}.scope-pill{display:flex;align-items:center;gap:8px;padding:7px 13px;background:#fff;border:1px solid var(--g100);border-radius:30px;box-shadow:var(--shadow-sm);font-size:12.5px;font-weight:600}.scope-pill small{color:var(--g400);font-weight:500}.callout{display:flex;gap:10px;align-items:flex-start;background:var(--amber-l);border:1px solid #f4dca8;border-radius:11px;padding:9px 13px;margin-bottom:10px;font-size:12.5px;color:#8a5a06;line-height:1.45}.callout svg{width:17px;height:17px;flex-shrink:0;margin-top:1px;color:var(--amber)}.callout.green{background:var(--green-ll);border-color:#bfe9cf;color:var(--green-dd)}.callout.green svg{color:var(--green-d)}
.fcl-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin:8px 0 16px;background:#fff;border:1px solid var(--g100);box-shadow:var(--shadow-sm);overflow:hidden}.fcl-tab{min-height:86px;display:flex;align-items:flex-start;gap:18px;padding:16px 22px;border-right:1px solid var(--g100);background:#fff;text-align:left;position:relative;transition:.14s}.fcl-tab:last-child{border-right:0}.fcl-tab:hover{background:var(--green-ll)}.fcl-tab.active{background:var(--green-ll)}.fcl-tab.active:after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:var(--green-d)}.fcl-step{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:var(--g75);color:var(--g700);font-size:13px;font-weight:800;flex-shrink:0}.fcl-tab.active .fcl-step{background:var(--green-d);color:#fff}.fcl-tab-text{display:flex;flex-direction:column;gap:14px;min-width:0}.fcl-tab-text b{font-size:13.5px;line-height:1.25;color:#06110b}.fcl-tab-text em{font-style:normal;font-size:12px;font-weight:800;color:#0d55ff}.toolbar{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap}.search{position:relative;flex:1;min-width:200px;max-width:340px}.search svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--g300);width:15px;height:15px}.search input{width:100%;padding:9px 12px 9px 33px;border:1px solid var(--g100);border-radius:10px;background:#fff;outline:none;transition:.15s}.search input:focus{border-color:var(--green);box-shadow:0 0 0 3px var(--green-l)}.seg{display:inline-flex;background:var(--g75);border-radius:10px;padding:3px}.seg button{padding:6px 14px;border-radius:7px;font-size:12.5px;font-weight:600;color:var(--g400);transition:.12s}.seg button.on{background:#fff;color:var(--green-dd);box-shadow:var(--shadow-sm)}.btn{display:inline-flex;align-items:center;gap:7px;padding:9px 15px;border-radius:10px;font-size:13px;font-weight:600;transition:.14s;border:1px solid transparent}.btn svg{width:15px;height:15px}.btn-primary{background:var(--green-d);color:#fff;box-shadow:0 4px 12px rgba(22,163,74,.28)}.btn-primary:hover{background:var(--green-dd);transform:translateY(-1px)}.btn-danger{background:#fff;color:#dc2626;border-color:#f3c4c0}.btn-danger:hover{background:#fde8e8;border-color:#efaaa4}.btn-ghost{background:#fff;border-color:var(--g100);color:var(--g600)}.btn-ghost:hover{border-color:var(--g200);background:var(--g50)}.bb-count{font-weight:700;font-size:13px;color:var(--green-dd);display:inline-flex;align-items:center;padding:0 4px 0 2px}.btn.bb-del{background:#fdecec;color:#c0392b;border:1px solid #f3c4c0}.bulk-tools{display:contents}
.card{background:#fff;border:1px solid var(--g100);border-radius:18px;box-shadow:var(--shadow-sm);overflow:hidden}.tbl-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13px}thead th{text-align:left;font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--g400);padding:10px 16px;background:var(--g50);border-bottom:1px solid var(--g100);white-space:nowrap}tbody td{padding:10px 16px;border-bottom:1px solid var(--g75);vertical-align:middle}tbody tr:last-child td{border-bottom:none}tbody tr{transition:background .1s}tbody tr:hover{background:var(--green-ll)}.sel-col{width:38px;text-align:center;padding-left:14px!important}table input[type=checkbox]{width:16px;height:16px;cursor:pointer;accent-color:var(--green-d);margin:0;vertical-align:middle}tr.row-sel{background:var(--green-ll)}.th-sort{all:unset;display:inline-flex;align-items:center;gap:4px;cursor:pointer;font:inherit;color:inherit;letter-spacing:inherit;text-transform:inherit;user-select:none;border-radius:6px;padding:1px 3px;transition:.12s}.th-sort:hover,.th-sort.on{color:var(--green-dd)}.th-ar{font-size:9px;line-height:1;color:var(--green-d)}.tag{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;white-space:nowrap}.tag-fcl{background:var(--blue-l);color:var(--blue)}.tag-lcl{background:var(--amber-l);color:var(--amber)}.tag-flat{background:var(--g75);color:var(--g500)}.tag-type{background:var(--green-l);color:var(--green-dd)}.rates{display:flex;flex-wrap:wrap;gap:5px}.rate-chip{font-family:monospace;font-size:11.5px;background:var(--g50);border:1px solid var(--g100);border-radius:6px;padding:2px 7px;white-space:nowrap}.rate-chip b{color:var(--green-dd);font-weight:600}.valid{font-size:11.5px;color:var(--g400);white-space:nowrap}.valid b{color:var(--g600);font-weight:600}.code-cell{font-family:monospace;font-weight:600;color:var(--green-dd)}.row-actions{display:flex;gap:4px;justify-content:flex-end}.icon-btn{width:30px;height:30px;border-radius:7px;display:grid;place-items:center;color:var(--g400);transition:.12s}.icon-btn svg{width:15px;height:15px}.icon-btn:hover{background:var(--g75);color:var(--g700)}.icon-btn.del:hover{background:var(--red-l);color:var(--red)}.note-text{font-size:12px;color:var(--g400);max-width:280px}.empty{padding:60px 20px!important;text-align:center;color:var(--g300)}.empty svg{width:42px;height:42px;margin:0 auto 12px;opacity:.5}.empty p{font-size:14px;font-weight:500;color:var(--g400);margin:0}.tbl-foot{padding:9px 16px;border-top:1px solid var(--g75);display:flex;align-items:center;justify-content:space-between;font-size:12px;color:var(--g400);gap:14px;flex-wrap:wrap}.psel{display:flex;align-items:center;gap:7px}.psel select{font-size:12px;font-weight:600;color:var(--g600);border:1px solid var(--g150);border-radius:8px;padding:4px 8px;background:#fff;outline:none}.pager{display:flex;align-items:center;gap:10px}.pg-info{font-family:monospace;font-size:11.5px;color:var(--g400)}.pg-nav{display:flex;gap:4px}.pg-btn{width:28px;height:28px;border-radius:7px;display:grid;place-items:center;border:1px solid var(--g150);background:#fff;color:var(--g500);transition:.12s}.pg-btn svg{width:14px;height:14px}.sort-status{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:var(--green-dd);background:var(--green-l);border:1px solid #bfe9cf;border-radius:99px;padding:4px 6px 4px 12px;font-weight:600}.sort-clear{all:unset;display:inline-flex;cursor:pointer;color:var(--green-d);background:#fff;border:1px solid #bfe9cf;border-radius:99px;padding:2px 7px}.sort-clear svg{width:11px;height:11px}.sort-hint{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;color:var(--g400);font-weight:600}.entered-cell{white-space:nowrap;font-family:monospace}.ts-date{display:block;font-size:12px;color:var(--g600);font-weight:600}.ts-time{display:block;font-size:11px;color:var(--g400)}.ts-na{color:var(--g300)}.fx-sym{font-size:15px;font-weight:700;color:var(--g600)}.fx-rate{font-family:monospace;font-weight:600;color:var(--g700)}.fx-base{font-size:10.5px;font-weight:700;letter-spacing:.04em;color:var(--green-dd);background:var(--green-l);border:1px solid #bfe9cf;padding:2px 8px;border-radius:99px}.fx-meta{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--g400)}
.fx-source{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--g100);border-radius:12px;padding:8px 10px;margin-bottom:12px}.fx-source>span{color:var(--green-d)}.fx-source b{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--green-dd)}.fx-source code{flex:1;color:var(--g600);font-size:12px;overflow:hidden;text-overflow:ellipsis}.fx-source .btn{padding:7px 11px}
.overlay{position:fixed;inset:0;background:rgba(20,28,24,.42);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:flex-start;justify-content:center;padding:16px;overflow-y:auto}.modal{background:#fff;border-radius:18px;box-shadow:var(--shadow-lg);width:100%;max-width:680px;margin:auto}.modal.wide{max-width:960px}.modal.import-modal{max-width:1180px}.admin-confirm{align-items:center}.confirm-modal{max-width:360px;border-radius:14px;overflow:hidden}.confirm-modal .modal-head{padding:14px 16px}.confirm-modal .modal-body{padding:18px 20px;color:var(--g500);font-size:13px;line-height:1.45}.confirm-modal .modal-foot{padding:12px 16px}.confirm-modal .btn{min-width:64px;justify-content:center}.prompt-overlay{background:rgba(10,30,18,.42);backdrop-filter:none}.prompt-modal{max-width:390px;width:390px;border-radius:12px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.3)}.prompt-modal .prompt-head{padding:16px 18px 4px}.prompt-modal .prompt-head h3{margin:0;font-size:15px;font-weight:750;color:#0f3d23}.prompt-modal .prompt-desc{padding:4px 18px 10px;color:#5d7567;font-size:13px;line-height:1.5}.prompt-modal .prompt-input{display:block;margin:0 18px 12px;padding:9px 11px;border:1px solid #c4e6d1;border-radius:8px;background:#fff;font:inherit;font-size:13px;color:#16241c;width:calc(100% - 36px);outline:none;text-transform:uppercase;box-sizing:border-box}.prompt-modal .prompt-input:focus{box-shadow:inset 0 0 0 2px #2ec46b}.prompt-modal .prompt-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;background:#eef9f1;border-top:1px solid #c4e6d1}.prompt-modal .prompt-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid #c4e6d1;background:#fff;color:#15532f;padding:7px 13px;border-radius:8px;font-size:12.5px;font-weight:650;cursor:pointer;line-height:1}.prompt-modal .prompt-btn:hover{background:#eef9f1}.prompt-modal .prompt-btn.primary{background:#1b7a43;border-color:#1b7a43;color:#fff}.prompt-modal .prompt-btn.primary:hover{background:#15532f}.prompt-modal .prompt-btn.danger{color:#c0392b;border-color:#e7b9b3;background:#fff}.prompt-modal .prompt-btn.danger:hover{background:#fdecea}.prompt-modal .prompt-btn.danger:disabled{opacity:.45;cursor:not-allowed}
.roles-modal .roles-body{padding:4px 18px 10px}.roles-modal .rolelist{display:flex;flex-direction:column;gap:8px;padding:6px 0}.roles-modal .roleopt{display:flex;align-items:center;gap:9px;padding:8px 10px;border:1px solid #c4e6d1;border-radius:8px;cursor:pointer;font-weight:650;color:#16241c;font-size:13px}.roles-modal .roleopt input{width:16px;height:16px;accent-color:#1b7a43}.roles-modal .roleopt.on{background:#eef9f1;border-color:#22a155}.roles-modal .roles-link{margin-top:10px}.roles-modal .roles-link-title{font-weight:650;color:#16241c;margin-bottom:5px;font-size:13px}.roles-modal .roles-link-row{display:flex;gap:6px}.roles-modal .roles-link-row input{flex:1;margin:0;padding:9px 11px;border:1px solid #c4e6d1;border-radius:8px;font:inherit;font-size:13px;color:#16241c;outline:none;text-transform:uppercase;box-sizing:border-box}.roles-modal .roles-link-row input:focus{box-shadow:inset 0 0 0 2px #2ec46b}.roles-modal .roles-link-hint{min-height:15px;margin-top:6px;font-size:11.5px;color:#5d7567}.roles-modal .roles-link-hint.ok{color:#0c6b39}.roles-modal .roles-link-hint.bad{color:#c0392b}.roles-modal .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.roles-modal .chip{display:inline-flex;align-items:center;gap:6px;background:#d8f3e2;border:1px solid #c4e6d1;color:#15532f;border-radius:20px;padding:3px 6px 3px 11px;font-size:11.5px;font-weight:700}.roles-modal .chip .cid{font-weight:600;color:#5d7567}.roles-modal .chip .x{cursor:pointer;width:15px;height:15px;border-radius:50%;background:#22a155;color:#fff;display:grid;place-items:center;font-size:11px;line-height:1}.roles-modal .chip .x:hover{background:#1b7a43}.rolelink{color:#22a155;font-size:9.5px;font-weight:800;vertical-align:super;margin-left:1px;letter-spacing:.3px}.sm-rolepick{width:100%;height:32px;display:flex;align-items:center;justify-content:center;gap:4px;border:0;background:transparent;font:inherit;font-size:11px;color:#16241c;cursor:pointer;text-transform:uppercase;padding:4px 6px}.sm-rolepick .sm-role-empty{color:inherit}
.admin-confirm .confirm-modal:not(.prompt-modal){max-width:390px;width:390px;border-radius:12px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.3)}.admin-confirm .confirm-modal:not(.prompt-modal) .modal-head{padding:16px 18px 4px;border-bottom:0}.admin-confirm .confirm-modal:not(.prompt-modal) .modal-head h3{margin:0;font-size:15px;font-weight:750;color:#0f3d23}.admin-confirm .confirm-modal:not(.prompt-modal) .modal-body{padding:4px 18px 10px;color:#5d7567;font-size:13px;line-height:1.5}.admin-confirm .confirm-modal:not(.prompt-modal) .modal-body p{margin:0}.admin-confirm .confirm-modal:not(.prompt-modal) .modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;background:#eef9f1;border-top:1px solid #c4e6d1;border-radius:0}.admin-confirm .confirm-modal:not(.prompt-modal) .modal-foot .btn{display:inline-flex;align-items:center;gap:6px;border:1px solid #c4e6d1;background:#fff;color:#15532f;padding:7px 13px;border-radius:8px;font-size:12.5px;font-weight:650;cursor:pointer;line-height:1;min-width:0}.admin-confirm .confirm-modal:not(.prompt-modal) .modal-foot .btn:hover{background:#eef9f1}.admin-confirm .confirm-modal:not(.prompt-modal) .modal-foot .btn.btn-primary{background:#1b7a43;border-color:#1b7a43;color:#fff}.admin-confirm .confirm-modal:not(.prompt-modal) .modal-foot .btn.btn-primary:hover{background:#15532f}.admin-confirm .confirm-modal:not(.prompt-modal) .modal-foot .btn.btn-danger{color:#c0392b;border-color:#e7b9b3;background:#fff}.admin-confirm .confirm-modal:not(.prompt-modal) .modal-foot .btn.btn-danger:hover{background:#fdecea}
.prompt-field{display:flex;flex-direction:column;gap:8px}.prompt-field span{font-size:12px;font-weight:800;color:var(--g500)}.prompt-field input{width:100%;border:1px solid var(--g150);border-radius:10px;padding:10px 12px;outline:none}.prompt-field input:focus{border-color:var(--green);box-shadow:0 0 0 3px var(--green-l)}.modal-head{padding:15px 28px 12px;border-bottom:1px solid var(--g100);display:flex;align-items:flex-start;gap:12px}.modal-head h3{font-size:18px;font-weight:700;letter-spacing:0;margin:0}.modal-head p{font-size:12.5px;color:var(--g400);margin:2px 0 0}.modal-head .x{margin-left:auto;width:34px;height:34px;border-radius:9px;display:grid;place-items:center;color:var(--g400)}.modal-body{padding:15px 28px;max-height:80vh;overflow-y:auto}.modal-foot{padding:12px 28px;border-top:1px solid var(--g100);display:flex;gap:10px;justify-content:flex-end;background:var(--g50);border-radius:0 0 18px 18px}.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:13px 16px}.fgrid.three{grid-template-columns:repeat(3,1fr)}.field{display:flex;flex-direction:column;gap:5px}.field.full{grid-column:1/-1}.field.mini{min-width:220px;gap:4px}.field span{font-size:12px;font-weight:700;color:var(--g500)}.field input,.field select,.field textarea{width:100%;padding:10px 12px;border:1px solid var(--g150);border-radius:10px;background:#fff;outline:none;transition:.14s}.field input:focus,.field select:focus,.field textarea:focus{border-color:var(--green);box-shadow:0 0 0 3px var(--green-l)}.field textarea{resize:vertical;font-family:monospace}.req{color:var(--red);margin-left:3px}.form-error{margin:12px 0 0;color:#b91c1c;background:#fff1f2;border:1px solid #fecaca;border-radius:10px;padding:9px 11px;font-size:13px;font-weight:700}.import-tools{display:flex;align-items:flex-end;gap:10px;margin-bottom:10px;flex-wrap:wrap}.import-search{max-width:none;min-width:280px;flex:1}.toggle-line{display:inline-flex;align-items:center;gap:7px;min-height:40px;padding:0 10px;border:1px solid var(--g100);border-radius:10px;background:#fff;font-size:12.5px;font-weight:700;color:var(--g500);white-space:nowrap}.toggle-line input{width:15px;height:15px;accent-color:var(--green-d)}.import-summary{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 12px}.import-summary span{font-size:12px;font-weight:700;color:var(--g500);background:var(--g50);border:1px solid var(--g100);border-radius:99px;padding:5px 10px}.import-note{margin:-2px 0 10px;font-size:12px;font-weight:700;color:var(--green-dd);background:var(--green-ll);border:1px solid #bfe9cf;border-radius:10px;padding:8px 10px}.import-table-wrap{border:1px solid var(--g100);border-radius:12px;overflow:auto;max-height:56vh}.import-table{min-width:820px}.import-table tbody tr.muted{color:var(--g300);background:#fbfbfb}.import-status{display:inline-flex;font-size:11px;font-weight:800;color:var(--green-dd);background:var(--green-l);border:1px solid #bfe9cf;border-radius:999px;padding:2px 8px}.import-status.exists{color:var(--g400);background:var(--g75);border-color:var(--g150)}
.remove-tab-modal{max-width:360px;border-radius:10px;overflow:hidden}.remove-tab-modal .modal-head{padding:20px 18px 0;border-bottom:0}.remove-tab-modal .modal-head h3{font-size:14px;font-weight:800;color:#087a3d}.remove-tab-modal .modal-body{padding:8px 18px 10px;color:#5f7469;font-size:13px;line-height:1.5}.remove-tab-modal .modal-body p{margin:0 0 10px}.remove-tab-modal input{width:100%;height:31px;border:1px solid #7fd7a3;border-radius:6px;padding:0 12px;font-size:13px;outline:none}.remove-tab-modal input:focus{border-color:#00c96b;box-shadow:0 0 0 2px rgba(0,201,107,.14)}.remove-tab-modal .modal-foot{padding:12px 16px;background:#eefaf3;border-top:1px solid #cfeadb;border-radius:0;gap:8px}.remove-tab-modal .btn{height:31px;min-width:72px;border-radius:7px;font-size:12px;font-weight:800}.remove-tab-modal .btn-danger:disabled{background:#f8ece6;border-color:#f3d0c4;color:#d99b8b;opacity:1;cursor:not-allowed}
.search>span:first-child{position:absolute;left:11px;top:50%;transform:translateY(-50%);display:grid;place-items:center;width:15px;height:15px;color:var(--g300);pointer-events:none}.search>span:first-child :deep(svg){width:15px;height:15px}.nav-logout{display:flex;align-items:center;gap:9px;width:100%;margin-top:auto;padding:10px 11px;border-radius:9px;font-size:13px;font-weight:600;color:var(--red);background:#fff;border:1px solid #f3c4c0;transition:.12s}.nav-logout:hover{background:var(--red-l)}.nav-logout span:nth-child(2){flex:1;text-align:left}.nav-logout :deep(svg){width:16px;height:16px;flex-shrink:0}.nav-logout span:nth-child(2){flex:1;text-align:left}.nav-logout :deep(svg){width:16px;height:16px;flex-shrink:0}
.workbook-shell .main.legacy-workspace-main{height:100vh;min-height:0;overflow:auto!important;padding:20px 22px 28px!important;background:#f5f7f5;background-image:radial-gradient(#d7dfd5 1px,transparent 1px);background-size:22px 22px}.legacy-workspace-main .crumb{margin-bottom:2px;color:#4a564d}.legacy-workspace-main .page-head{min-height:0;margin-bottom:18px;align-items:flex-start}.legacy-workspace-main .page-title{font-size:28px;line-height:1.12;letter-spacing:0;color:#06110b}.legacy-workspace-main .page-desc{font-size:14px;color:#5f6c64}.legacy-workspace-main .toolbar{margin-bottom:14px}.legacy-workspace-main .card,.legacy-workspace-main .fx-source{border-color:#d3dacf;border-radius:14px;box-shadow:0 1px 2px rgba(14,21,18,.04);background:#fff}.legacy-workspace-main .fx-source{padding:10px 12px;margin-bottom:14px}.legacy-workspace-main .btn{border-radius:10px}.legacy-workspace-main .tbl-wrap{background:#fff}.legacy-workspace-main thead th{background:#f5f7f5}.legacy-workspace-main tbody tr:hover{background:#eef9f3}.legacy-country{z-index:20}.legacy-country .scope-pill{margin-left:auto;border-color:#d3dacf;border-radius:999px;box-shadow:0 1px 2px rgba(14,21,18,.06);min-width:0}.legacy-country .scope-pill span{font-weight:700}.legacy-country .scope-pill .chev{width:14px;height:14px;color:#869089}.legacy-country .cdd-menu{top:calc(100% + 7px);right:0}.workbook-shell .main.fx-workspace-main{padding:28px 28px 32px!important}.fx-workspace-main .page-head{margin-bottom:18px;align-items:center}.fx-workspace-main .page-title{display:inline-block;padding:0;background:transparent!important;font-size:28px;font-weight:700;line-height:1.15}.fx-workspace-main .fx-source{min-height:50px;margin:0 0 14px;padding:0 12px 0 14px;border-radius:14px;display:flex;align-items:center}.fx-workspace-main .fx-source>span{width:18px;height:18px}.fx-workspace-main .fx-source b{font-size:11px;letter-spacing:.08em}.fx-workspace-main .fx-source code{font-size:13px;color:#0e1512}.fx-workspace-main .fx-source .btn{margin-left:auto;height:34px;padding:0 14px}.fx-workspace-main .toolbar{justify-content:flex-end;gap:8px;margin-bottom:12px}.fx-workspace-main .toolbar .spacer{display:none}.fx-workspace-main .toolbar .btn{height:36px;padding:0 15px;font-size:13px}.fx-workspace-main .card{display:flex;flex-direction:column;max-height:calc(100vh - 260px);min-height:300px;border-radius:16px;overflow:hidden}.fx-workspace-main .tbl-wrap{flex:1;min-height:0;overflow:auto}.fx-workspace-main thead{position:sticky;top:0;z-index:2}.fx-workspace-main thead th{height:42px;padding:0 18px}.fx-workspace-main tbody td{height:50px;padding:0 18px}.fx-workspace-main .fx-rate{font-size:13px}.fx-workspace-main .fx-sym{font-size:16px}.fx-workspace-main .tbl-foot{flex:none;background:#fff}
.workbook-shell .main.sales-workspace-main{padding:0!important;overflow:hidden!important;background:#f5faf6!important}
.sm-th-label{display:inline-flex;align-items:center;justify-content:center;gap:6px;width:100%;vertical-align:middle}.sm-th-add{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:5px;background:#22a155;color:#fff;font-size:13px;font-weight:800;line-height:1;border:0;padding:0;box-shadow:none}.sm-th-add:hover{background:#1b7a43}.sm-th-add-plus{display:inline-flex;align-items:center;justify-content:center;transform:translateY(-1px)}.sm-list-cell{position:relative;width:100%;height:32px}.sm-list-input{padding-right:28px}.sm-list-arrow{position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:12px;color:#173c28;pointer-events:none}.sm-list-menu{position:absolute;left:-4px;top:calc(100% + 1px);z-index:30;width:324px;max-width:min(324px,calc(100vw - 24px));max-height:204px;overflow-y:auto;color-scheme:light;background:#fff;border:0;border-radius:0 0 14px 14px;box-shadow:0 10px 20px rgba(0,0,0,.18);padding:4px 0 9px;text-align:left;scrollbar-width:thin;scrollbar-color:#8b8b8b transparent}.sm-list-menu::-webkit-scrollbar{width:7px}.sm-list-menu::-webkit-scrollbar-track{background:transparent}.sm-list-menu::-webkit-scrollbar-thumb{background:#8b8b8b;border-radius:8px;border:2px solid #fff}.sm-list-item{display:flex;align-items:center;width:100%;height:46px;border:0;background:#fff;color:#111;text-align:left;padding:0 19px;font-size:13px;font-weight:650;letter-spacing:0;text-transform:uppercase;white-space:nowrap}.sm-list-item:hover,.sm-list-item.active{background:#eef9f1;color:#087a3d}.sm-list-empty{padding:14px 19px;background:#fff;color:#71857a;font-size:12px;font-weight:550}.sm-ledge-row td{position:relative!important;text-align:left!important;overflow:visible!important;padding:0!important}.sm-ledge-row .sm-ledge{position:absolute;z-index:4;left:36px;top:-1px;margin:0}
.sm-head-menu{position:fixed;z-index:120;min-width:170px;background:#fff;border:1px solid #c4e6d1;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.18);padding:0;text-align:left;overflow:hidden}.sm-head-menu button{display:block;width:100%;border:0;background:none;color:#16241c;text-align:left;padding:9px 14px;font:inherit;font-size:12.5px;cursor:pointer;text-decoration:none}.sm-head-menu button:hover:not(:disabled){background:#eef9f1}.sm-head-menu button:disabled{color:#5d7567;background:none;cursor:not-allowed;opacity:.5}
.sm-toolbar{overflow:visible}.sm-toolbar .sm-btn{border-radius:8px;padding:7px 13px;font-size:12.5px;font-weight:650}.sm-toolbar .sm-btn.active{background:#eef9f1;border-color:#8dd7a9;color:#0f7a37}.sm-toolbar .sm-btn.primary{background:#1b7a43;border-color:#1b7a43}.sm-toolbar .sm-btn.primary:hover:not(:disabled){background:#15532f}.sm-search-group{height:32px;min-width:285px;border-radius:7px;background:#eef9f1}.sm-search-group select{min-width:78px}.sm-search-group input{height:100%;width:185px}.sm-status-select{height:32px;border-radius:6px;min-width:78px}.sm-export-wrap{position:relative;display:inline-flex}.sm-export-menu{position:absolute;top:calc(100% + 4px);left:0;z-index:45;min-width:180px;background:#fff;border:1px solid #c4e6d1;border-radius:8px;box-shadow:0 12px 28px rgba(15,61,35,.16);padding:4px}.sm-export-menu button{display:block;width:100%;padding:8px 10px;border-radius:6px;color:#16241c;text-align:left;font-size:12px;white-space:nowrap}.sm-export-menu button:hover:not(:disabled){background:#eef9f1}.sm-export-menu button:disabled{opacity:.45;cursor:not-allowed}.sm-adv-filter{flex:0 0 auto;margin:0 22px 12px;padding:8px 12px;background:#eef9f1;border:1px solid #c4e6d1;border-radius:10px}.sm-adv-rows{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center}.sm-adv-row{display:inline-flex;align-items:center;gap:8px}.sm-adv-row select,.sm-adv-row input{height:30px;border:1px solid #c4e6d1;border-radius:8px;background:#fff;color:#16241c;font:inherit;font-size:12px;padding:0 10px;outline:none}.sm-adv-row input{width:150px}.sm-adv-row select:focus,.sm-adv-row input:focus{border-color:#22a155;box-shadow:0 0 0 3px rgba(216,243,226,.75)}.sm-adv-arrow{color:#5d7567;font-size:12px}.sm-adv-remove{height:30px;min-width:34px;border-radius:8px;background:#fdecea;color:#c0392b;font-size:13px;font-weight:800}.sm-adv-empty{color:#5d7567;font-size:12.5px}.sm-adv-actions{display:flex;gap:8px;margin-top:6px}.sm-adv-actions .sm-btn{height:30px;padding:0 11px;border-radius:7px;font-size:12px}
.sm-exrate-banner{display:flex;align-items:center;gap:10px;flex:0 0 auto;margin:0 22px 14px;padding:10px 16px;background:#eef9f1;border:1px solid #c4e6d1;border-radius:10px;color:#2f3b34;font-size:12.5px;line-height:1.35}.sm-exrate-banner b{font-weight:700;color:#0f3d23}.sm-exrate-live{height:28px;padding:0 12px;text-decoration:none}.sm-exrate-note{color:#5d7567}
.sm-tablewrap thead th[data-key$="_cost"]{background:#fdecea!important}
.sm-tablewrap thead th[data-key$="_sell"]{background:#eaf7ef!important}
.sm-tablewrap thead th[data-key$="_mgn"]{background:#eef1f7!important}
.sm-tablewrap input.sm-celli[data-key$="_cost"],.sm-tablewrap input.sm-celli[data-key$="_sell"]{background:#fff;border:1px solid #d9e0dc;border-radius:6px;text-align:center;padding:0 8px;font-variant-numeric:tabular-nums}
.sm-tablewrap input.sm-celli[data-key$="_cost"]{box-shadow:inset 3px 0 0 #e8b4ad}
.sm-tablewrap input.sm-celli[data-key$="_sell"]{box-shadow:inset 3px 0 0 #9ed4b5}
.sm-tablewrap input.sm-celli[data-key$="_sell"]:focus{border-color:#008F4C;box-shadow:inset 3px 0 0 #9ed4b5,0 0 0 3px rgba(0,143,76,.12);outline:none}
.sm-tablewrap input.sm-celli[data-key$="_cost"]:focus{border-color:#c0392b;box-shadow:inset 3px 0 0 #e8b4ad,0 0 0 3px rgba(192,57,43,.10);outline:none}
.sm-tablewrap input.sm-celli[data-key$="_cost"]::placeholder,.sm-tablewrap input.sm-celli[data-key$="_sell"]::placeholder{color:#c3ccc7;font-weight:400}
.sm-tablewrap tbody tr.sm-editing:has(input[data-key$="_cost"]) td{background:#f7fbf8}
.mgncell{font-weight:700;color:#1b6b43;background:#f4f6f8;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2px 8px;line-height:1.15;font-variant-numeric:tabular-nums}
.mgncell.neg{color:#c0392b}
.mgnpct{font-size:10px;font-weight:600;color:#8a94a0}
.mgncell.neg .mgnpct{color:#d98b82}
.sm-tablewrap thead th{position:sticky;background:#d8f3e2;color:#0f3d23;overflow:hidden}.sm-tablewrap thead th:not(.sel-col){color:#0f3d23}.sm-rsz{position:absolute;top:0;right:-3px;width:7px;height:100%;cursor:col-resize;z-index:3}.sm-rsz:hover{background:rgba(34,161,85,.3)}.sm-tablewrap thead th.sm-order-col{background:#d8f3e2;color:#0f3d23;font-weight:750}.sm-tablewrap td.sm-order-cell{color:#5d7567;font-weight:700}
.sm-tablewrap thead th,.sm-tablewrap thead th:not(.sel-col),.sm-tablewrap thead th.sm-order-col{font-weight:750!important}
.sm-tablewrap.analysis-tablewrap thead th,
.sm-tablewrap.analysis-tablewrap thead th.sel-col,
.sm-tablewrap.analysis-tablewrap thead th.sm-order-col{background:#d8f3e2!important;color:#063d25!important;border-color:#bfe8cf!important;font-weight:750!important}
.sm-tablewrap.analysis-tablewrap tbody td.sm-order-cell{background:inherit!important;color:#5d7567!important;font-weight:700}
.sm-tablewrap.analysis-tablewrap tbody tr.sel td{background:#e6f6ee!important}
.sm-tablewrap.analysis-tablewrap tbody tr.analysis-warning-row:not(.sel) td{background:#fdecea!important}
.sm-tablewrap.analysis-tablewrap tbody tr.analysis-warning-row.sel td{background:#e6f6ee!important}
.sm-tab-close{margin-left:8px;display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:50%;color:#5d7567;font-size:12px;line-height:1;cursor:pointer}.sm-tab-close:hover{background:#c0392b;color:#fff}.sm-tab-add{border:1px dashed #c4e6d1;background:none;color:#1b7a43;font-weight:800;font-size:15px;padding:8px 13px;border-radius:6px;align-self:center}.sm-tab-add:hover{background:#eef9f1;color:#1b7a43}
.idcell{height:32px;display:flex;align-items:center;justify-content:center;padding:4px 6px;color:#15532f;font-weight:700;font-style:normal;letter-spacing:.3px;text-transform:uppercase}.idcell.empty{padding:4px 6px!important;color:#a9bdb1;font-weight:600;font-style:italic}.sm-mini-action{display:inline-flex;align-items:center;justify-content:center;min-width:74px;height:20px;border-radius:5px;background:#0f8d4b;color:#fff;font-size:10.5px;font-weight:800;line-height:1;text-transform:none}.sm-mini-action.ghost{background:transparent;color:#0f8d4b;text-decoration:underline}.sm-mini-action:hover{filter:brightness(.96)}.trader-driver-modal{max-width:820px;border-radius:10px;overflow:hidden}.trader-driver-modal .modal-head{padding:16px 18px 8px;border-bottom:0}.trader-driver-modal .modal-head h3{text-transform:uppercase;font-size:14px;font-weight:800;color:#0f3d23}.trader-driver-modal .modal-body{padding:8px 18px 8px}.driver-actions{display:flex;gap:8px;margin:10px 0 0}.driver-table-wrap{border:1px solid #bfe2cb;border-radius:8px;overflow:auto}.driver-table{width:100%;border-collapse:collapse;table-layout:fixed}.driver-table th{height:30px;background:#eef9f1;color:#0f3d23;border:1px solid #bfe2cb;font-size:11px;font-weight:700;padding:0 8px;text-align:left;text-transform:uppercase}.driver-table td{height:36px;border:1px solid #d7eadf;text-align:left;padding:0 8px;color:#27332d}.driver-table .empty{height:56px;text-align:center;color:#6d7f74;font-style:normal}.driver-row-actions{width:74px;text-align:center!important;white-space:nowrap}.driver-action-head{width:76px}.drvbtn{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:999px;margin:0 2px;color:#fff;font-weight:900}.drvbtn.save{background:#0bbf68}.drvbtn.edit{background:#e67e22}.drvbtn.cancel,.drvbtn.remove{background:#c83b31}.driver-table .sm-celli{height:28px;border:1px solid #cbd7cf;border-radius:6px;background:#fff;text-align:left;text-transform:none}.trader-driver-modal .modal-foot{padding:12px 18px;background:#eefaf3;border-top:1px solid #c4e6d1;border-radius:0;justify-content:flex-end}
.sm-tablewrap table{height:auto!important}
.coverage-modal{max-width:640px;width:92vw;border-radius:10px;overflow:hidden}.coverage-modal .modal-head{padding:16px 18px 4px;border-bottom:0}.coverage-modal .modal-head h3{font-size:15px;font-weight:800;color:#0f3d23;text-transform:uppercase}.coverage-modal .modal-body{padding:6px 18px 12px}.coverage-x{position:absolute;right:12px;top:12px}.coverage-section-title{font-size:12px;font-weight:800;color:#34473d;text-transform:uppercase;letter-spacing:.3px;margin:4px 0 8px}.coverage-role-title{margin-top:18px}.coverage-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.coverage-cluster{margin-bottom:12px}.coverage-cluster-label{font-size:11px;font-weight:800;color:#7b8c83;text-transform:uppercase;margin:0 0 4px}.coverage-option{height:34px;border:1px solid #bfe2cb;border-radius:6px;background:#fff;display:flex;align-items:center;gap:10px;padding:0 12px;margin-bottom:8px;color:#28362f;font-size:12px;font-weight:700}.coverage-option.on{background:#eefaf3;border-color:#75d59f}.coverage-option.locked{color:#6d7f74}.coverage-option.locked input{opacity:.55}.coverage-option input{width:15px;height:15px;accent-color:#0ba65b}.coverage-modal .modal-foot{padding:12px 18px;background:#eefaf3;border-top:1px solid #c4e6d1}
.sm-tablewrap table.sm-grid-table{height:auto!important;max-height:none!important}
.sm-tablewrap table.sm-grid-table tbody{height:auto!important;max-height:none!important}
.sm-tablewrap{scrollbar-width:auto;scrollbar-color:#8b8b8b transparent}
.sm-tablewrap::-webkit-scrollbar-thumb{background:#8b8b8b}
.sm-tablewrap th.sel-col,.sm-tablewrap td.sel-col{width:36px!important;padding:0!important;text-align:center!important}
.sm-tablewrap th.sel-col input[type=checkbox],.sm-tablewrap td.sel-col input[type=checkbox]{width:15px!important;height:15px!important;display:block;margin:0 auto!important;accent-color:#1b7a43;cursor:pointer}
.sm-tablewrap th.sel-col input[type=checkbox]:disabled,.sm-tablewrap td.sel-col input[type=checkbox]:disabled{cursor:not-allowed;opacity:.48}
.sm-tablewrap tbody tr.sel td{background:#e7f7ee!important}
.sm-tablewrap tbody{height:auto!important}
.sm-tablewrap tbody tr.sm-editing>td:has(.sm-list-menu){overflow:visible!important}
.sm-tablewrap .sm-ledge{position:absolute;display:none;z-index:5;align-items:center;gap:6px;background:#fff;border:1.5px solid #2ec46b;border-top:none;border-radius:0 0 9px 9px;box-shadow:0 7px 16px rgba(15,61,35,.16);padding:5px 7px}
.sm-tablewrap .sm-ledge.on{display:flex}
.sm-tablewrap .sm-ledge button{border:1px solid #c4e6d1;border-radius:6px;padding:5px 12px;background:#fff;color:#15532f;font-family:Arial,sans-serif;font-size:11.5px;font-weight:700;cursor:pointer}
.sm-tablewrap .sm-ledge button.save{background:#1b7a43;border-color:#1b7a43;color:#fff}
.sm-tablewrap .sm-ledge button.save:hover{background:#15532f}
.sm-tablewrap .sm-ledge button.cancel:hover{background:#eef9f1}
.legal-checklistwrap{flex:1;min-height:0;overflow:auto;padding:14px 22px 40px;background:#f5faf6}
.legal-cl-cols{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
.legal-cl-sec{overflow:hidden;margin-bottom:16px;border:1px solid #c4e6d1;border-radius:10px;background:#fff;box-shadow:0 1px 2px rgba(15,61,35,.06),0 6px 18px rgba(15,61,35,.06)}
.legal-cl-sec-hd{width:100%;display:flex;align-items:center;gap:12px;padding:14px 18px;border:0;border-bottom:1px solid #c4e6d1;background:#eef9f1;color:#16241c;text-align:left;cursor:pointer}
.legal-cl-sec-hd:hover{background:#e5f6ec}
.legal-cl-chevron{color:#5d7567;font-size:12px;transition:transform .15s}
.legal-cl-sec.collapsed .legal-cl-chevron{transform:rotate(-90deg)}
.legal-cl-num{color:#1b7a43;font-size:13px;font-weight:800}
.legal-cl-title{flex:1;color:#16241c;font-size:14.5px;font-weight:750}
.legal-cl-progress{padding:3px 10px;border-radius:20px;background:#d8f3e2;color:#1b7a43;font-size:12px;font-weight:700}
.legal-cl-progress.done{background:#22a155;color:#fff}
.legal-cl-sec.collapsed .legal-cl-body{display:none}
.legal-cl-hint{padding:10px 18px 0;color:#5d7567;font-size:12.5px;font-style:italic}
.legal-cl-grouplabel{padding:12px 18px 4px;color:#15532f;font-size:12.5px;font-weight:750;letter-spacing:.3px;text-transform:uppercase}
.legal-cl-item{display:flex;gap:12px;padding:10px 18px;border-top:1px solid #c4e6d1;cursor:pointer}
.legal-cl-item:hover{background:#eef9f1}
.legal-cl-item:first-of-type{border-top:0}
.legal-cl-item input[type=checkbox]{width:18px;height:18px;flex:none;margin:2px 0 0;accent-color:#22a155;cursor:pointer}
.legal-cl-no{flex:0 0 34px;padding-top:2px;color:#5d7567;font-size:11.5px;font-weight:700}
.legal-cl-body-txt{display:flex;min-width:0;flex:1;flex-direction:column}
.legal-cl-item-title{color:#16241c;font-size:13.5px;font-weight:600;line-height:1.35}
.legal-cl-item.checked .legal-cl-item-title{color:#5d7567;text-decoration:line-through}
.legal-cl-note{margin-top:2px;color:#5d7567;font-size:12px;line-height:1.4}
.analysis-dashboard-wrap{flex:1;min-height:0;overflow:auto;padding:14px 20px 42px;background:#f5faf6;font-size:13px}
.analysis-dashboard-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.analysis-dashboard-actions .sm-btn{height:32px;padding:0 13px;border-radius:7px;font-size:12px;font-weight:700}
.analysis-client-switch{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:0 0 14px}
.analysis-client-switch button{height:32px;padding:0 12px;border:1px solid #c3e6cf;border-radius:8px;background:#fff;color:#375244;font-size:12px;font-weight:700;cursor:pointer}
.analysis-client-switch button.active{background:#0b8f4d;border-color:#0b8f4d;color:#fff}
.analysis-filter-row{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:0 0 14px;width:100%;color:#375244;font-size:12.5px}
.analysis-filter-row label{font-weight:550;color:#4c6255}
.analysis-filter-row input,.analysis-filter-row select{height:34px;border:1px solid #bfe3cb;border-radius:7px;background:#fff;padding:0 10px;color:#163a25;font-size:12.5px}
.analysis-filter-row input{width:116px}.analysis-filter-row input.date{width:132px}.analysis-filter-row select{width:72px}
.analysis-filter-combo{position:relative;flex:0 0 116px;width:116px}
.analysis-filter-combo.small{flex-basis:100px;width:100px}
.analysis-filter-row .analysis-filter-input{box-sizing:border-box;width:100%!important;height:34px!important;border:1px solid #bfe3cb!important;border-radius:7px!important;background:#fff!important;color:#163a25!important;padding:0 28px 0 10px!important;font-size:12.5px!important;line-height:32px!important;outline:none;white-space:nowrap;overflow:hidden;text-overflow:clip;cursor:text;user-select:text}
.analysis-filter-row .analysis-filter-input:empty::before{content:"All";color:#9aa7a0}
.analysis-filter-row .analysis-filter-input:focus{border-color:#121a18!important;box-shadow:0 0 0 1px #121a18}
.analysis-filter-caret{position:absolute;right:0;top:0;width:30px;height:34px;border:0;background:transparent;cursor:pointer}
.analysis-filter-caret::after{content:"";position:absolute;right:10px;top:50%;margin-top:-2px;border-left:4px solid transparent;border-right:4px solid transparent;border-top:6px solid #18251f}
.analysis-filter-options{position:absolute;z-index:500;left:0;top:calc(100% + 6px);width:100%;max-height:210px;overflow:auto;background:#fff;border:1px solid #bfe3cb;border-radius:8px;box-shadow:0 12px 28px rgba(0,50,25,.16);padding:7px 0}
.analysis-filter-options::before{content:"";position:absolute;left:14px;top:-8px;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:8px solid #fff}
.analysis-filter-options::after{content:"";position:absolute;left:13px;top:-9px;border-left:9px solid transparent;border-right:9px solid transparent;border-bottom:9px solid #bfe3cb;z-index:-1}
.analysis-filter-options button{display:block;width:100%;border:0;background:transparent;text-align:left;padding:7px 12px;color:#163a25;font:inherit;font-size:12px;cursor:pointer}
.analysis-filter-options button:hover{background:#e9f8ef;color:#007f3f}
.analysis-filter-options.dark{width:156px;min-width:156px;background:#121a18;border-color:#26332f;border-radius:2px;box-shadow:0 8px 20px rgba(0,0,0,.28);padding:7px 0}
.analysis-filter-options.dark::before{content:"";position:absolute;left:14px;top:-8px;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:8px solid #121a18}
.analysis-filter-options.dark::after{display:none}
.analysis-filter-options.dark button{color:#fff;font-size:12px;font-weight:800;padding:10px 12px}
.analysis-filter-options.dark button:hover{background:#1f2d29;color:#fff}
.analysis-empty{border:1px dashed #c3e6cf;border-radius:10px;background:#fff;padding:18px 20px;margin-bottom:16px;color:#4b6155;display:flex;flex-direction:column;gap:6px}
.analysis-empty b{color:#0d3a23;font-size:14px}
.analysis-cards{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:18px}
.analysis-card{flex:1;min-width:150px;border:1px solid #bfe3cb;border-radius:10px;background:#fff;box-shadow:0 1px 2px rgba(15,61,35,.04),0 8px 16px rgba(15,61,35,.05);padding:14px 16px}
.analysis-card span{display:block;color:#496154;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.25px}
.analysis-card b{display:block;margin-top:6px;color:#050f09;font-size:22px;font-weight:800;line-height:1.15}
.analysis-rank-grid{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:16px}
.analysis-rank-grid.wide{display:flex;flex-wrap:wrap}
.analysis-rank-section{min-width:0}
.analysis-rank-section h4{margin:0 0 7px;color:#0b4f2b;font-size:12.5px;font-weight:700}
.analysis-rank-pair{display:grid;grid-template-columns:repeat(2,minmax(160px,1fr));gap:8px}
.analysis-rank-section{flex:1;min-width:280px}
.analysis-rank-table{width:100%;table-layout:fixed;border-collapse:collapse;overflow:hidden;border-radius:10px;background:#fff;border:1px solid #c4e6d1;box-shadow:none;font-size:13px}
.analysis-rank-table th{height:30px;background:#eef8f1;border-bottom:1px solid #c4e6d1;color:#0f3d23;font-size:10.5px;font-weight:700;text-transform:uppercase;text-align:left;padding:0 10px;letter-spacing:0}
.analysis-rank-table th:first-child,.analysis-rank-table td:first-child{width:34px;text-align:center}
.analysis-rank-table th:last-child,.analysis-rank-table td:last-child{width:130px;text-align:right}
.analysis-rank-table td{height:32px;border-bottom:1px solid #e2efe6;color:#1e3428;font-size:12.5px;padding:0 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.analysis-rank-table tr:last-child td{border-bottom:0}
.analysis-rank-table td:last-child{font-variant-numeric:tabular-nums}
.analysis-rank-link{display:inline;max-width:100%;padding:0;border:0;background:transparent;color:#00874a;font-size:12.5px;font-weight:700;text-decoration:underline;text-underline-offset:2px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle}
.analysis-rank-link:hover{color:#006b38;background:transparent}
.analysis-rank-table .empty{text-align:center!important;color:#7d8d83;font-style:italic;padding:16px}
.analysis-chart-card{border:1px solid #c4e6d1;border-radius:10px;background:#fff;padding:12px 12px 14px;margin-bottom:16px}
.analysis-chart-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px;color:#355041;font-size:12.5px}
.analysis-chart-tools span{font-weight:700}.analysis-chart-tools select{height:34px;border:1px solid #bfe3cb;border-radius:7px;background:#fff;padding:0 10px;min-width:230px}.analysis-chart-tools label{display:inline-flex;align-items:center;gap:4px;font-size:12px}
.analysis-chart-stage{position:relative;width:100%;height:clamp(280px,26vw,360px)}
.analysis-chart-canvas{display:block;width:100%!important;height:100%!important}
.analysis-chart-title{text-align:center;color:#666;font-weight:700;font-size:12px;margin-bottom:8px}
.analysis-chart-legend{display:flex;justify-content:center;gap:18px;margin-bottom:10px;color:#6d756f;font-size:12px}.analysis-chart-legend span{display:inline-flex;align-items:center;gap:5px}.analysis-chart-legend span:before{content:'';width:34px;height:10px;background:var(--c);display:inline-block}
.analysis-bar-chart{height:400px;border-left:1px solid #d9e4dd;border-bottom:1px solid #d9e4dd;background:repeating-linear-gradient(to top,rgba(0,0,0,.07) 0 1px,transparent 1px 64px);display:grid;grid-template-columns:repeat(12,1fr);align-items:end;gap:18px;padding:0 22px 0 18px}
.analysis-bar-month{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px}
.analysis-bars{height:calc(100% - 16px);display:flex;align-items:flex-end;justify-content:center;gap:4px;width:100%}
.analysis-bars i{width:10px;min-height:4px;display:block;border-radius:2px 2px 0 0}
.analysis-bar-month em{font-style:normal;font-size:10px;color:#6d756f}
.analysis-pie-row{display:flex;gap:16px;flex-wrap:wrap;margin-top:2px}
.analysis-pie-card{flex:1;min-width:240px;max-width:360px;border:1px solid #c4e6d1;border-radius:10px;background:#fff;padding:14px;box-shadow:none}
.analysis-pie-card h4{margin:0 0 8px;color:#0b4f2b;font-size:12.5px;font-weight:700}
.analysis-pie-canvas{width:260px!important;height:260px!important;max-width:100%;aspect-ratio:1/1;display:block;margin:0 auto}
.analysis-selection-bar{position:fixed;right:0;bottom:0;z-index:70;display:flex;flex-direction:column;background:#fff;border-top:2px solid #0f8d4b;box-shadow:0 -4px 16px rgba(0,0,0,.12);padding:0 22px 10px;font-size:13px;max-height:180px;overflow:hidden;color:#16241c}
.analysis-selection-handle{height:12px;cursor:ns-resize;display:flex;align-items:flex-start;justify-content:center;flex:0 0 auto}
.analysis-selection-handle::before{content:'';width:44px;height:4px;border-radius:0 0 2px 2px;background:#9fdab7;margin-top:0;display:block}
.analysis-selection-content{display:flex;align-items:center;gap:14px;overflow:hidden;flex:1;min-height:0}
.analysis-selection-text{white-space:nowrap;font-weight:700}
.analysis-selection-detail{display:flex;gap:9px;flex-wrap:wrap;overflow:auto;flex:1;align-content:flex-start;height:100%;min-width:0;padding-right:2px}
.analysis-selection-card{flex:0 0 auto;border:1px solid #bfe2cb;border-radius:8px;background:#fff;padding:5px 11px;white-space:nowrap;font-size:11px;line-height:1.4;display:block}
.analysis-selection-card:only-child{max-width:100%;overflow:auto}
.analysis-selection-card b{font-weight:700;color:#0f3d23}
.admin-toast{position:fixed;left:50%;bottom:58px;transform:translateX(-50%);z-index:220;max-width:calc(100vw - 320px);background:#063d25;color:#fff;border-radius:6px;padding:8px 14px;text-align:center;font-size:11.5px;line-height:1.25;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 10px 24px rgba(0,0,0,.22)}
.analysis-ground-bar{position:fixed;right:0;bottom:0;z-index:72;background:#fff;border-top:2px solid #0f8d4b;box-shadow:0 -4px 16px rgba(0,0,0,.12);padding:0 18px 8px;color:#10231a;max-height:none;overflow:visible}
.analysis-ground-bar h3{margin:0 0 6px;font-size:15px;line-height:1.2;font-weight:800;color:#10231a;text-transform:uppercase}
.analysis-ground-grid{display:grid;grid-template-columns:repeat(4,minmax(150px,1fr));gap:6px 14px}
.analysis-ground-break{grid-column:1/-1;border-top:1px solid #d7eadf;height:0;margin:2px 0 0}
.analysis-ground-grid .ag-col-1{grid-column-start:1}
.analysis-ground-grid label{display:flex;flex-direction:column;gap:4px;min-width:0}
.analysis-ground-grid span{font-size:11px;font-weight:700;color:#52665b}
.analysis-ground-grid input{width:100%;height:26px;border:1px solid #bfe2cb;border-radius:6px;background:#fff;padding:0 10px;font-size:12px;color:#0e2419;outline:none}
.analysis-ground-grid input:disabled{background:#eef7f2;color:#52665b}
.analysis-ground-grid input:focus{border-color:#00c56b;box-shadow:0 0 0 1px #00c56b}
.analysis-ground-days{display:flex;align-items:center;gap:7px}
.analysis-ground-days input{flex:1}
.analysis-ground-days em{font-style:normal;font-size:11px;color:#61766a}
.analysis-ground-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:6px;padding-top:7px;border-top:1px solid #d7eadf}
.analysis-ground-actions button{height:32px;border-radius:7px;border:1px solid transparent;padding:0 16px;font-size:12px;font-weight:700}
.analysis-ground-actions .close{background:#6b7890;color:#fff}
.analysis-ground-actions .edit{background:#f4bd83;color:#fff}
.analysis-ground-actions .save{background:#07964e;color:#fff}
.sm-tablewrap tbody tr.analysis-warning-row:not(.sel) td{background:#fdecea!important}
.sm-tablewrap tbody tr.analysis-warning-row:not(.sel):hover td{background:#fbe0dd!important}
.sm-tablewrap tbody tr.analysis-warning-row:not(.sel) td.sm-order-cell{background:#f8ddd9!important}
.analysis-ground-actions button:disabled{opacity:.5;cursor:not-allowed}
.sm-directory-topbar{flex:0 0 auto;padding:16px 22px 12px;border-bottom:1px solid #c4e6d1;background:#fff}
.sm-directory-topbar h1{margin:0;color:#0f3d23;font-size:18px;font-weight:750}
.sm-directory-topbar p{margin:3px 0 0;color:#5d7567;font-size:12px}
.haulage-subbar{align-items:center;gap:6px;padding:0 20px;margin:2px 0 8px;border-bottom:0;background:#f5faf6;overflow-x:auto}
.haulage-subbar .sm-tab{min-height:32px;padding:6px 16px;border:1px solid #d6ddd9;border-radius:8px;background:#fff;color:#5a6875;font-size:12.5px;font-weight:700}
.haulage-subbar .sm-tab.active{border-color:#008f4c;background:#008f4c;color:#fff}
.haulage-ors-key{width:300px;min-width:300px;margin-left:auto;border:1px solid #c4e6d1;border-radius:7px;background:#fff;padding:6px 10px;color:#16241c;font:inherit;font-size:12px;outline:none;-webkit-text-security:disc}
.haulage-ors-key:focus,.haulage-buffer input:focus{box-shadow:inset 0 0 0 2px #35b66a}
.haulage-buffer{display:inline-flex;align-items:center;gap:5px;flex:0 0 auto;margin-left:8px;color:#5d7567;font-size:12px;white-space:nowrap}
.haulage-buffer input{width:58px;border:1px solid #c4e6d1;border-radius:7px;background:#fff;padding:6px 8px;color:#16241c;font:inherit;font-size:12px;outline:none}
.haulage-geo-cell{display:flex;align-items:center;gap:3px;width:100%;height:100%}
.haulage-suggest-cell{width:100%;height:100%}.haulage-suggest-cell .sm-celli{text-transform:none}.haulage-suggest-cell .sm-celli::placeholder{color:#5d7567;font-style:normal;text-transform:uppercase}
.haulage-geo-cell .sm-celli{min-width:0;flex:1}
.haulage-geo-cell button{flex:0 0 auto;margin-right:3px;border:1px solid #c4e6d1;border-radius:6px;background:#eef9f1;padding:4px 7px;color:#1b7a43;font-size:12px;line-height:1;cursor:pointer}
.haulage-geo-cell button svg{display:block;width:12px;height:12px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.haulage-geo-cell button:hover:not(:disabled){background:#d8f3e2}.haulage-geo-cell button:active:not(:disabled){transform:scale(.94)}.haulage-geo-cell button:disabled{opacity:.5;cursor:wait}
textarea.haulage-textarea{min-height:30px;height:30px;resize:none;overflow:hidden;white-space:normal;text-align:left;line-height:1.35}
.haulage-tablewrap .viewcell{height:auto;min-height:32px;white-space:normal;overflow:visible;text-overflow:clip;word-break:break-word;line-height:1.35}
.haulage-tablewrap .idcell{color:#5d7567;font-size:12.5px;font-weight:400;font-style:normal;text-transform:none}
.haulage-tablewrap tbody td{vertical-align:top}
.admin-brand-link{cursor:pointer;outline:none}.admin-brand-link:focus-visible{box-shadow:0 0 0 2px #22a155;border-radius:8px}
.sm-cell-link{display:block;max-width:100%;overflow:hidden;color:#0876c9;text-decoration:underline;text-overflow:ellipsis;white-space:nowrap;text-transform:none}.sm-cell-link:hover{color:#055b9d}
.workbook-shell .sidebar-scroll{display:flex;flex-direction:column;gap:2px}
.workbook-shell .nav-group,.workbook-shell .nav-group.salesnav{flex:0 0 auto;margin:0}
.workbook-shell .nav-head{height:42px;min-height:42px;padding:0 11px;line-height:1.2}
.workbook-shell .nav-head .nh-label{min-width:0;overflow:hidden;font-size:12.5px;line-height:16px;text-overflow:ellipsis;white-space:nowrap}
.workbook-shell .nav-head .ni{display:grid;place-items:center;width:18px;height:18px;flex:0 0 18px}
.workbook-shell .sidebar .salesnav.open > .nav-items{display:none!important;max-height:0;height:0;margin:0;padding:0;overflow:hidden}
.workspace-account-pill{position:relative;display:flex;flex-direction:column;align-items:center;gap:8px;width:calc(100% - 28px);margin:0 14px 18px;padding:10px 8px 8px;border:0;border-radius:10px;background:transparent;color:#16241c;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:13px;text-align:left;cursor:pointer}
.workspace-account-pill:hover,.workspace-account-pill.open{background:#eef9f1;outline:none}
.workspace-account-pill::before{content:"";position:absolute;left:0;right:0;top:-11px;border-top:1px solid #c4e6d1}
.workspace-account-top{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;max-width:100%}
.workspace-account-menu{position:fixed;left:14px;bottom:110px;z-index:1000;width:250px;border:1px solid #c4e6d1;border-radius:12px;background:#fff;box-shadow:0 8px 30px rgba(15,61,35,.18);overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:13px}
.account-settings-overlay{z-index:1100;align-items:center}.account-settings-modal{display:flex;flex-direction:column;width:520px;max-width:100%;height:auto;min-height:0;max-height:90vh;border-radius:14px;box-shadow:0 20px 60px rgba(15,61,35,.28);overflow:hidden;color:#16241c;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:13px}.account-settings-modal .modal-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #c4e6d1}.account-settings-modal .modal-head h3{margin:0;font-size:16px;color:#0f3d23}.account-settings-close{padding:4px 8px;border:0;border-radius:6px;background:none;color:#5d7567;font-size:20px;line-height:1;cursor:pointer}.account-settings-close:hover{background:#eef9f1;color:#16241c}.account-settings-body{padding:18px 20px;overflow:auto}.settings-section{margin-bottom:22px}.settings-section:last-child{margin-bottom:0}.settings-section-title{margin-bottom:10px;color:#5d7567;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase}.settings-field{margin-bottom:12px}.settings-field>label{display:block;margin-bottom:4px;color:#16241c;font-size:12px;font-weight:700}.settings-field input{width:100%;padding:8px 10px;border:1px solid #c4e6d1;border-radius:8px;background:#fff;color:#16241c;font:inherit}.settings-field input:focus{outline:none;border-color:#22a155;box-shadow:0 0 0 3px rgba(34,161,85,.12)}.settings-field input[readonly]{background:#eef9f1;color:#5d7567;cursor:not-allowed}.account-settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.settings-hint{margin:4px 0 0;color:#5d7567;font-size:11px;font-weight:400;line-height:1.4}.data-copy{margin:0 0 10px}.settings-data-actions{display:flex;flex-wrap:wrap;gap:8px}.account-settings-foot{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid #c4e6d1}.account-settings-modal .btn{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border:1px solid #c4e6d1;border-radius:8px;background:#fff;color:#15532f;font:inherit;font-size:12.5px;font-weight:650;line-height:1;cursor:pointer}.account-settings-modal .btn:hover{background:#eef9f1}.account-settings-modal .btn.primary{background:#1b7a43;border-color:#1b7a43;color:#fff}.account-settings-modal .btn.primary:hover{background:#15532f}.account-settings-modal .btn.danger{color:#c0392b;border-color:#e7b9b3}.account-settings-modal .btn.danger:hover{background:#fdecea}.account-settings-modal .btn:disabled{opacity:.45;cursor:not-allowed}@media(max-width:560px){.account-settings-grid{grid-template-columns:1fr}}
.workspace-account-menu-head{display:flex;align-items:center;gap:12px;padding:14px;background:#eef9f1;border-bottom:1px solid #c4e6d1;color:#16241c}
.workspace-account-head-copy{display:flex;flex:1;min-width:0;flex-direction:column}.workspace-account-head-copy>strong{overflow:hidden;font-size:14px;font-weight:750;line-height:1.15;text-overflow:ellipsis;white-space:nowrap}.workspace-account-head-copy>span{display:flex;align-items:center;flex-wrap:wrap;gap:5px;margin-top:4px;font-style:normal}.workspace-account-head-copy>span i{padding:2px 7px;border:1.5px solid currentColor;border-radius:3px;font-size:9.5px;font-style:normal;font-weight:800;letter-spacing:.3px;line-height:1.3;white-space:nowrap}.workspace-account-head-copy>span em{color:#5d7567;font-size:11px;font-style:normal}
.workspace-account-rows{padding:8px 0}
.workspace-account-detail{display:flex;justify-content:space-between;gap:10px;padding:7px 14px;color:#5d7567;font-size:12.5px}.workspace-account-detail b{color:#16241c;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;font-weight:700;text-align:right}
.workspace-account-actions{border-top:1px solid #c4e6d1;padding:6px}.workspace-account-actions button{display:flex;align-items:center;gap:9px;width:100%;padding:9px 10px;border:0;border-radius:8px;background:none;color:#16241c;font:inherit;font-size:13px;font-weight:600;text-align:left;cursor:pointer}.workspace-account-actions button:hover{background:#eef9f1}.workspace-account-actions button svg{width:16px;height:16px;flex:0 0 16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.workspace-account-actions button.logout{color:#c0392b}.workspace-account-actions button.logout:hover{background:#fdecea}
.workspace-account-avatar{position:relative;display:grid;place-items:center;width:38px;height:38px;flex:0 0 38px;border-radius:10px;background:#d8f3e2;color:#15532f;font-size:13px;font-weight:800;line-height:1}
.workspace-account-menu-head .workspace-account-avatar{width:44px;height:44px;flex-basis:44px;font-size:15px}
.workspace-account-avatar small{position:absolute;bottom:-3px;right:-3px;padding:1px 4px;border:2px solid #fff;border-radius:6px;background:#1b7a43;color:#fff;font-size:8.5px;font-weight:800;letter-spacing:.3px;line-height:1.25}
.workspace-account-copy{display:flex;flex-direction:column;min-width:0;max-width:130px;line-height:1.15;text-align:left}.workspace-account-copy strong{overflow:hidden;color:#16241c;font-size:13px;font-weight:750;text-overflow:ellipsis;white-space:nowrap}.workspace-account-copy small{margin-top:2px;color:#5d7567;font-size:10.5px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.trader-full-detail-modal{position:relative;width:min(720px,calc(100vw - 32px));max-width:720px;height:auto;min-height:0;padding:42px 22px 22px;border-radius:8px;background:#fff}
.trader-full-detail-modal>.xbtn{position:absolute;z-index:2;top:7px;right:22px;display:grid;place-items:center;width:30px;height:30px;padding:0;border:0;border-radius:50%;background:#c0392b;color:#fff;font:700 22px/1 Arial,Helvetica,sans-serif;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.trader-full-detail-modal>.xbtn:hover{background:#a93226;transform:scale(1.04)}
.trader-full-detail-box{position:relative;min-height:260px;border:2px solid #343434;border-radius:11px;background:#fff;padding:42px 128px 26px 18px}
.trader-full-detail-box pre{margin:0;color:#111;white-space:pre-wrap;overflow-wrap:anywhere;font:400 17px/1.32 Arial,Helvetica,sans-serif;letter-spacing:0;text-transform:uppercase}
.trader-full-detail-copy{position:absolute;top:9px;right:9px;min-width:82px;height:45px;border:1px solid #18ae69;border-radius:8px;background:#009b58;color:#fff;font:500 18px/1 Arial,Helvetica,sans-serif;cursor:pointer}
.trader-full-detail-copy:hover{background:#00864c}
.sm-toolbar.sm-tight{flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin}
.sm-toolbar.sm-tight::-webkit-scrollbar{height:6px}.sm-toolbar.sm-tight::-webkit-scrollbar-thumb{background:#c4e6d1;border-radius:3px}.sm-toolbar.sm-tight::-webkit-scrollbar-track{background:transparent}
.sm-toolbar.sm-tight>*{flex:0 0 auto}.sm-toolbar.sm-tight .sm-btn{white-space:nowrap}.sm-toolbar.sm-tight>.spacer{flex:1 1 8px;min-width:8px}.sm-toolbar.sm-tight .sm-search-group{flex:0 1 auto;min-width:150px}.sm-toolbar.sm-tight .sm-search-group input{width:170px;min-width:50px;flex:1 1 60px}.sm-toolbar.sm-tight:has(.sm-export-menu){overflow:visible}
@media(max-width:1300px){.sm-toolbar.sm-tight .sm-btn{padding:7px 9px;font-size:12px}.sm-toolbar.sm-tight{gap:6px}}
@media(max-width:1050px){.sm-toolbar.sm-tight .sm-btn{padding:6px 7px;font-size:11.5px}.sm-toolbar.sm-tight .sm-search-group input{width:120px}}
@media(max-width:640px){.trader-full-detail-modal{padding:42px 12px 12px}.trader-full-detail-modal>.xbtn{right:12px}.trader-full-detail-box{min-height:220px;padding:62px 14px 20px}.trader-full-detail-box pre{font-size:14px}.trader-full-detail-copy{height:40px;font-size:16px}}
@media(max-width:760px){.haulage-ors-key{width:240px;min-width:240px}.sm-directory-topbar{padding:12px 14px}.haulage-subbar{padding:0 12px}}
@media(max-width:900px){.legal-cl-cols{grid-template-columns:1fr}}
@media(max-width:1200px){.analysis-rank-grid,.analysis-cards{grid-template-columns:1fr}.analysis-rank-grid{flex-direction:column}.analysis-bar-chart{height:280px;gap:8px}.analysis-pie-row{flex-direction:column}.analysis-pie-card{max-width:none;width:100%}}
@media(max-width:920px){.sidebar{display:none}.main{padding:20px 16px}.workbook-shell,.workbook-shell.sidebar-collapsed{grid-template-columns:minmax(0,1fr)}.workbook-shell .main.workbook-main{width:100%;min-width:0;padding:0!important;overflow:hidden}.workbook-shell .mock-side-toggle{left:0}.fgrid,.fgrid.three{grid-template-columns:1fr 1fr}.fcl-tabs{grid-template-columns:1fr 1fr}.fcl-tab:nth-child(2){border-right:0}.fcl-tab:nth-child(-n+2){border-bottom:1px solid var(--g100)}}@media(max-width:640px){.topbar{padding:0 14px}.tb-label{display:none}.cdd-btn{min-width:150px}.fgrid,.fgrid.three{grid-template-columns:1fr}.toolbar{align-items:stretch}.search{max-width:none}.page-head{align-items:flex-start}.scope-pill{width:100%;justify-content:flex-start}.fcl-tabs{grid-template-columns:1fr}.fcl-tab{border-right:0;border-bottom:1px solid var(--g100)}.fcl-tab:last-child{border-bottom:0}}
@media(max-width:920px){.analysis-selection-bar,.analysis-ground-bar{left:0!important}.analysis-ground-grid{grid-template-columns:repeat(2,minmax(140px,1fr))}}
.dept-select-wrap{position:relative;display:flex;flex-wrap:wrap;align-items:center;gap:6px;min-height:40px;padding:6px 8px;border:1px solid #c4e6d1;border-radius:8px;background:#fff;cursor:pointer;font-weight:400}
.dept-select-wrap.focus{border-color:#22a155;box-shadow:0 0 0 3px rgba(34,161,85,.12)}
.dept-placeholder{color:#5d7567;font-size:12.5px;font-weight:400}
.dept-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 5px 3px 9px;border-radius:20px;color:#fff;font-size:11px;font-weight:800;letter-spacing:.3px}
.dept-chip b{padding:0 1px;font-size:14px;font-weight:900;line-height:1;opacity:.85;cursor:pointer}
.dept-chip b:hover{opacity:1}
.dept-caret{display:inline-flex;margin-left:auto;color:#5d7567;flex:0 0 auto;pointer-events:none}
.dept-options{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:10;max-height:210px;overflow:auto;padding:4px;border:1px solid #c4e6d1;border-radius:8px;background:#fff;box-shadow:0 1px 2px rgba(15,61,35,.06),0 6px 18px rgba(15,61,35,.06)}
.dept-options button{display:flex;align-items:center;gap:8px;width:100%;padding:7px 9px;border:0;border-radius:6px;background:none;color:#16241c;font:inherit;font-size:12.5px;font-weight:700;text-align:left;cursor:pointer}
.dept-options button:hover{background:#eef9f1}
.dept-options-empty{padding:8px 9px;color:#5d7567;font-size:12px}
.dept-dot{width:9px;height:9px;flex:0 0 9px;border-radius:50%}
.dept-GSD{background:#22a155}.dept-ECD{background:#2f80ed}.dept-ICD{background:#9b51e0}.dept-CCD{background:#e6a700}.dept-TCD{background:#eb5757}.dept-DCD{background:#00a3a3}.dept-FCD{background:#f2994a}.dept-none{background:#94a3a8}
.workspace-account-depts{display:flex;flex-wrap:wrap;justify-content:center;gap:5px;width:100%;padding-top:2px}.workspace-account-depts b{padding:2px 7px;border:1.5px solid currentColor;border-radius:3px;background:transparent;font-size:9.5px;font-weight:800;letter-spacing:.3px;line-height:1.3;white-space:nowrap}
.dc-GSD{color:#22a155}.dc-ECD{color:#2f80ed}.dc-ICD{color:#9b51e0}.dc-CCD{color:#c98a00}.dc-TCD{color:#eb5757}.dc-DCD{color:#00a3a3}.dc-FCD{color:#e07b1a}.dc-none{color:#94a3a8}
.sm-list-menu{max-height:300px}.sm-list-menu .sm-list-item{font-weight:600}

/* Keep the Vue shell aligned with the Main.html desktop workspace. */
.adm{--sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--ink);background:var(--bg);background-image:none;font-family:var(--sans);font-size:13px;line-height:normal}
.adm :deep(button),.adm :deep(input),.adm :deep(select),.adm :deep(textarea){font-family:inherit}
.adm :deep(.workbook){color:var(--ink);background:var(--bg);font-family:var(--sans);font-size:13px;line-height:normal}
.workbook-shell{font-family:var(--sans);font-size:13px;line-height:normal}
.main,.workbook-main{display:flex;flex-direction:column}
.workbook-shell .sidebar-scroll{padding-top:6px;gap:6px}
.workbook-shell .nav-head{height:auto;min-height:36px;padding:9px 11px;line-height:normal}
.workbook-shell .nav-head .nh-label{font-size:13px;line-height:normal}
.ai-fab{width:52px;height:52px;min-width:52px;min-height:52px;background:var(--g-800);cursor:pointer}
.ai-fab:hover{background:var(--g-900)}
.ai-fab svg{width:26px!important;height:26px!important;flex-basis:26px}
.adm :deep(.ops-ms-head){height:38px;min-height:38px;margin-bottom:2px}
.adm :deep(.ops-ms-page .country-btn){height:28px;min-height:28px;line-height:1}
.adm :deep(.ops-ms-tab){height:37px;min-height:0;line-height:normal}
.adm :deep(.ops-btn){font-weight:650}
.adm :deep(.ops-search-group){height:auto;padding:3px 4px 3px 6px}
.adm :deep(.ops-filter-select),.adm :deep(.ops-status-select),.adm :deep(.ops-search){height:auto;font-size:12.5px}
.adm :deep(.ops-filter-select){padding:4px 2px}.adm :deep(.ops-search){padding:5px 4px}.adm :deep(.ops-status-select){height:24px}
.adm :deep(.ops-ms-table){font-size:13px}.adm :deep(.ops-ms-table col:first-child){width:36px!important}
.adm :deep(.ops-ms-table thead th){font-size:11px;font-weight:750;padding:9px 6px}.adm :deep(.ops-ms-table thead th:last-child){border-right:none}
.adm :deep(.ops-ms-table tbody td){height:34px;padding:0}.adm :deep(.ops-ms-table tbody td:last-child){border-right:none}.adm :deep(.ops-ms-table tbody tr:last-child td){border-bottom:none}
.adm :deep(.ops-ms-table td.ops-sel),.adm :deep(.ops-ms-table th.ops-sel){width:36px;padding:0}
.adm :deep(.ops-ms-table thead th.ops-sel){z-index:5;box-shadow:2px 0 4px -2px rgba(15,61,35,.18)}
.adm :deep(.ops-ms-table tbody td.ops-sel){box-shadow:2px 0 4px -2px rgba(15,61,35,.14)}
.adm :deep(.ops-ms-table tbody td.ops-empty){height:auto!important;padding:46px 20px;text-align:center;color:var(--muted);background:#fff}.adm :deep(.ops-empty b){font-size:14px}
.adm :deep(.ops-textcell),.adm :deep(.ops-edit-input),.adm :deep(.ops-time-input){box-sizing:border-box;width:100%;height:32px;padding:4px 6px;font-size:13px}
.adm :deep(.ops-efa-select),.adm :deep(.ops-action-select){box-sizing:border-box;width:100%;height:32px;padding:4px 6px;border:1px solid var(--g-line);border-radius:5px;background:#fff;font-size:13px;text-align-last:center;-webkit-appearance:none;appearance:none}
.adm :deep(.ops-sent-cell){height:32px;min-height:0;gap:1px;padding:1px 0}
.adm :deep(.ops-ms-table tbody td:has(>.ops-sent-cell)){height:34px!important;padding:0!important;overflow:hidden!important}
.adm :deep(.ws-btn){font-family:Arial,sans-serif}
.adm :deep(.ws-tbl){table-layout:fixed}
.adm :deep(.ws-tbl thead th){font-size:11px;font-weight:700;letter-spacing:.4px;text-align:center;white-space:nowrap;overflow:hidden}
.adm :deep(.ws-tbl thead th:first-child){border-top-left-radius:10px}
.adm :deep(.ws-tbl thead th:last-child){border-top-right-radius:10px}
.adm :deep(.ops-btn),.adm .sm-btn,.adm :deep(.qc-btn),.adm :deep(.ws-btn){font-family:Arial,sans-serif!important}
.sm-tablewrap thead th{text-transform:none!important;letter-spacing:.4px!important}.sm-tablewrap thead th:first-child{border-top-left-radius:10px}.sm-tablewrap thead th:last-child{border-top-right-radius:10px}.sm-tablewrap thead th:last-child,.sm-tablewrap tbody td:last-child{border-right:none}.sm-tablewrap tbody tr:last-child td{border-bottom:none}
.sm-tablewrap td.empty{height:auto!important;padding:46px 20px!important;text-align:center;color:#5d7567}.sm-tablewrap td.empty b{display:block;color:#15532f;font-size:14px;margin-bottom:4px}.sm-tablewrap td.empty span{display:block;font-size:12px}

/* Directory tables use the same compact controls and cell chrome as Main.html. */
.sm-search-group{height:auto;min-width:auto;border-radius:8px}.sm-search-group select{min-width:auto}.sm-search-group input{width:170px;height:auto}.sm-search-group>.sm-search-action{padding:6px 12px}
.sm-export-menu{z-index:80;min-width:170px;overflow:hidden;padding:0;box-shadow:0 10px 30px rgba(0,0,0,.18)}.sm-export-menu button{padding:9px 14px;border-radius:0;font-size:12.5px}.sm-export-menu button:disabled{color:#5d7567;opacity:.5}
.sm-celli,.idcell{overflow:hidden;white-space:nowrap;text-overflow:clip}.idcell{width:100%}.sm-celli:focus{background:transparent;border-radius:0;box-shadow:none}.sm-tablewrap select.sm-celli{border:1px solid #c4e6d1;border-radius:5px;background:#fff;text-align-last:center;-webkit-appearance:none;appearance:none;cursor:pointer}
.mgncell{flex-direction:row;gap:4px;padding:2px 6px;line-height:1}.sm-rolepick{font-size:inherit}.sm-tablewrap td.empty span{font-size:inherit}
.sm-page:not(.sm-kind-analysis-statistics) .sm-toolbar{flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;scrollbar-width:none}.sm-page:not(.sm-kind-analysis-statistics) .sm-toolbar::-webkit-scrollbar{display:none}.sm-page:not(.sm-kind-analysis-statistics) .sm-toolbar>*{flex:0 0 auto}.sm-page:not(.sm-kind-analysis-statistics) .sm-toolbar>.spacer{flex:1 1 8px;min-width:8px}.sm-page:not(.sm-kind-analysis-statistics) .sm-toolbar .sm-btn{white-space:nowrap}.sm-page:not(.sm-kind-analysis-statistics) .sm-toolbar:has(.sm-export-menu){overflow:visible}
.sm-page:not(.sm-kind-analysis-statistics) .sm-toolbar.sm-tight .sm-search-group{flex:0 1 auto;min-width:150px}.sm-page:not(.sm-kind-analysis-statistics) .sm-toolbar.sm-tight .sm-search-group select,.sm-page:not(.sm-kind-analysis-statistics) .sm-toolbar.sm-tight .sm-search-group input{font-family:Arial,sans-serif}
.sm-list-input{padding:4px 6px}
.sm-list-arrow{display:none}
.sm-page:not(.sm-kind-analysis-statistics) .sm-toolbar{scrollbar-width:thin}
.sm-page:not(.sm-kind-analysis-statistics) .sm-toolbar::-webkit-scrollbar{display:block;height:6px}
.sm-page:not(.sm-kind-analysis-statistics) .sm-toolbar::-webkit-scrollbar-thumb{background:#c4e6d1;border-radius:3px}
.sm-kind-traders-suppliers .sm-tab-add,.sm-kind-customs-legal .sm-tab-add,.sm-kind-internal-directory .sm-tab-add{height:40px}.sm-kind-reference-data .sm-tab-add{height:37px}.sm-tablewrap:not(:has(.sm-th-add)) .sm-th-label{display:flex}
/* Clear white/green zebra rows for Traders & Suppliers and Reference Data. */
.sm-kind-traders-suppliers .sm-tablewrap tbody tr:not(.sel):not(.sm-editing):nth-child(odd)>td,
.sm-kind-reference-data .sm-tablewrap tbody tr:not(.sel):not(.sm-editing):nth-child(odd)>td{background:#fff}
.sm-kind-traders-suppliers .sm-tablewrap tbody tr:not(.sel):not(.sm-editing):nth-child(even)>td,
.sm-kind-reference-data .sm-tablewrap tbody tr:not(.sel):not(.sm-editing):nth-child(even)>td{background:#eaf3ed}
.sm-kind-traders-suppliers .sm-tablewrap tbody tr:not(.sel):not(.sm-editing):hover>td,
.sm-kind-reference-data .sm-tablewrap tbody tr:not(.sel):not(.sm-editing):hover>td{background:#dff0e5}
@media(max-width:760px){.sm-directory-topbar{padding:16px 22px 12px}}

.analysis-dashboard-wrap{padding:14px 22px 40px}
.analysis-client-switch{flex-wrap:nowrap}.analysis-client-switch button{display:inline-flex;align-items:center;height:auto;padding:6px 14px;border-color:#c4e6d1;border-radius:8px;background:#fff;color:#15532f;font-size:12.5px;font-weight:650;line-height:1}.analysis-client-switch button:hover{background:#eef9f1}.analysis-client-switch button.active{border-color:#1b7a43;background:#1b7a43;color:#fff}.analysis-client-switch button.active:hover{background:#15532f}
.analysis-filter-row{gap:8px;margin:0 0 16px;color:#16241c;font-size:13px}.analysis-filter-row label{color:#5d7567;font-weight:400}.analysis-filter-row>.analysis-filter-combo{flex-basis:120px;width:120px}.analysis-filter-row>.analysis-filter-combo:first-of-type{flex-basis:140px;width:140px}.analysis-filter-row>.analysis-filter-combo.small{flex-basis:100px;width:100px}.analysis-filter-row .analysis-filter-input{height:auto!important;border-color:#c4e6d1!important;border-radius:8px!important;color:#16241c!important;padding:6px 28px 6px 10px!important;font-size:13px!important;line-height:normal!important}.analysis-filter-caret{bottom:0;height:auto}.analysis-filter-row>input.date,.analysis-filter-row>select{width:auto;height:auto;border-color:#c4e6d1;border-radius:8px;padding:7px 10px;color:#16241c;cursor:pointer}
.analysis-dashboard-wrap.analysis-source-empty .analysis-filter-row{display:none}
.analysis-empty{display:block;margin:0;padding:60px 20px;border:0;border-radius:0;background:transparent;color:#5d7567;text-align:center}.analysis-empty b,.analysis-empty span{display:block;margin:0;color:inherit;font-size:inherit}
.analysis-card{border-color:#c4e6d1;box-shadow:0 1px 2px rgba(15,61,35,.06),0 6px 18px rgba(15,61,35,.06)}.analysis-card span{color:#5d7567;letter-spacing:.3px}.analysis-card b{margin-top:4px;color:#16241c;line-height:normal}
.analysis-rank-grid,.analysis-rank-grid.wide{gap:16px;margin-bottom:18px}.analysis-rank-section{flex:1;min-width:260px}.analysis-rank-section h4{margin:0 0 6px;color:#15532f}.analysis-rank-pair{display:flex;grid-template-columns:none;gap:10px;flex-wrap:wrap}.analysis-rank-table{flex:1 1 0%;width:auto;min-width:200px;border-collapse:collapse;box-shadow:none}.analysis-rank-table th{position:sticky;top:0;z-index:2;height:auto;padding:9px 12px;background:#eef9f1;color:#15532f;font-weight:750;letter-spacing:.4px;border-right:1px solid #c4e6d1;white-space:nowrap;overflow:hidden}.analysis-rank-table th:nth-child(2){border-right:0}.analysis-rank-table td{height:34px;padding:8px 12px;border-bottom-color:#c4e6d1;border-right:1px solid #f1f6f2;color:#16241c;font-size:13px;white-space:normal;overflow:hidden;text-overflow:clip}.analysis-rank-table th:first-child,.analysis-rank-table td:first-child{width:34px;text-align:left}.analysis-rank-table th:last-child,.analysis-rank-table td:last-child{width:auto;text-align:left;border-right:0}.analysis-rank-table thead th:first-child{border-top-left-radius:10px}.analysis-rank-table thead th:last-child{border-top-right-radius:10px}.analysis-rank-table tbody tr{transition:none}.analysis-rank-table tbody tr:nth-child(even){background:#fafdfb}.analysis-rank-table tbody tr:hover{background:#eef9f1}.analysis-rank-table .empty{padding:8px 12px!important;color:#5d7567;font-style:normal;text-align:center!important}.analysis-rank-link{max-width:none;color:#1b7a43;font-size:13px;white-space:normal;overflow:visible;text-overflow:clip;vertical-align:baseline;text-underline-offset:auto}.analysis-rank-link:hover{color:#1b7a43}
.analysis-chart-card{padding:14px}.analysis-chart-tools{color:#5d7567}.analysis-chart-tools select{height:auto;min-width:0;border-color:#c4e6d1;border-radius:8px;padding:7px 10px}.analysis-chart-tools label{gap:3px}.analysis-chart-tools input[type=checkbox]{cursor:pointer}
@media(max-width:760px){.analysis-chart-stage{height:260px}}
.analysis-pie-row{margin-top:0}.analysis-pie-card{min-width:220px;max-width:320px}.analysis-pie-card h4{color:#15532f}.analysis-pie-canvas{width:100%!important;height:auto!important;max-width:none;aspect-ratio:1/1;margin:0}
@media(max-width:1200px){.analysis-rank-grid{flex-direction:row}.analysis-pie-row{flex-direction:row}.analysis-pie-card{width:auto;max-width:320px}}

.adm :deep(.qc-page){min-height:0;display:flex;flex-direction:column;padding-bottom:18px;scrollbar-gutter:auto;line-height:normal}
.adm :deep(.qc-tabs){position:sticky;top:0;z-index:10;gap:4px;flex:0 0 auto;margin:0 0 6px;overflow-y:hidden;scrollbar-width:thin}
.adm :deep(.qc-tabs>button){display:flex;align-items:center;gap:7px;min-height:0;padding:9px 14px;border-radius:6px 6px 0 0;color:#5d7567;font-weight:650;white-space:nowrap}
.adm :deep(.qc-tabs>button:hover){background:#eef9f1;color:#16241c}.adm :deep(.qc-tabs>button.active){border-bottom-color:#22a155;background:#eef9f1;color:#1b7a43}
.adm :deep(.qc-tabs .qc-tab-add){padding:6px 12px;color:#1b7a43;font-size:16px;font-weight:700}.adm :deep(.qc-tab-x){padding:1px 4px;border-radius:50%;color:#5d7567}.adm :deep(.qc-tab-x:hover){background:#c0392b;color:#fff}
.adm :deep(.qc-toolbar){flex:0 0 auto;align-items:center;flex-wrap:wrap;margin:8px 18px 12px;padding:0}
.adm :deep(.qc-btn){display:inline-flex;align-items:center;gap:6px;height:auto;padding:7px 13px;border-radius:8px;font-size:12.5px;font-weight:650;line-height:1}.adm :deep(.qc-btn:not(.primary):not(.danger):not(.danger-solid):hover:not(:disabled)){background:#eef9f1}.adm :deep(.qc-btn.primary){border-color:#1b7a43;background:#1b7a43}.adm :deep(.qc-btn.primary:hover:not(:disabled)){border-color:#15532f;background:#15532f}.adm :deep(.qc-btn.danger){border-color:#e7b9b3;color:#c0392b}.adm :deep(.qc-btn.danger:hover:not(:disabled)){border-color:#e7b9b3;background:#fdecea;color:#c0392b}.adm :deep(.qc-btn:disabled){opacity:.45}
.adm :deep(.qc-tablewrap){flex:0 0 auto;margin:0 18px;scrollbar-gutter:auto;background:transparent}.adm :deep(.qc-note){margin:8px 18px 0}
.adm :deep(.qc-table th){position:sticky;top:0;z-index:1;height:auto;padding:8px;line-height:normal}.adm :deep(.qc-column-head:has(.qc-column-menu)){z-index:6}.adm :deep(.qc-table th:first-child){border-top-left-radius:10px}.adm :deep(.qc-table th:last-child){border-top-right-radius:10px;border-right:0}.adm :deep(.qc-table td){height:34px;min-height:0}.adm :deep(.qc-table td:last-child){border-right:0}.adm :deep(.qc-table tbody tr:last-child td){border-bottom:0}.adm :deep(.qc-table tbody tr:nth-child(even)){background:#fafdfb}
.adm :deep(.qc-table:not(.history) th:first-child),.adm :deep(.qc-table:not(.history) td:first-child){position:sticky;left:0}.adm :deep(.qc-table:not(.history) th:first-child){z-index:5;background:#eaf6ee}.adm :deep(.qc-table:not(.history) td:first-child){z-index:2;background:#fff;box-shadow:1px 0 0 #edf3ef}.adm :deep(.qc-table:not(.history) tbody tr:hover td:first-child){background:#f6fbf8}.adm :deep(.qc-table:not(.history) tr.locked td:first-child){background:#f2f6f4}
.adm :deep(.qc-cell-input){min-height:29px;padding:6px 8px}.adm :deep(.qc-text){font-size:12.5px}.adm :deep(.qc-text:focus){outline:2px solid #2ec46b;outline-offset:-2px;box-shadow:none;background:#fffdf3}.adm :deep(.qc-date){width:calc(100% - 10px);height:auto;min-height:0;margin:3px 5px;padding:5px}.adm :deep(.qc-staff){width:calc(100% - 12px);height:auto;min-height:0;margin:3px 6px;padding:5px 6px}.adm :deep(.qc-date:focus),.adm :deep(.qc-staff:focus){outline:0;border-color:#c4e6d1;box-shadow:inset 0 0 0 2px #2ec46b;background:#fff}.adm :deep(.qc-resulted){min-height:29px}.adm :deep(.qc-empty){height:auto!important;padding:18px!important;color:#5d7567}
.adm :deep(.qc-table tr:not(.locked) td.readonly){background:transparent}.adm :deep(.qc-table tr:not(.locked):hover td.readonly){background:#f6fbf8}.adm :deep(.qc-readonly-cell){color:#1b7a43;font-size:inherit}.adm :deep(.qc-table tr.locked .qc-readonly-cell){color:#5d7567}.adm :deep(.qc-table.custom td:nth-child(2) .qc-text){color:#16241c;font-family:inherit;font-weight:400;text-align:left}
.adm :deep(.qc-history-filter){flex:0 0 auto;align-items:center;margin:8px 18px 12px;padding:0 0 2px}.adm :deep(.qc-history-filter input),.adm :deep(.qc-history-filter select){height:auto;padding:7px 9px;font-weight:400;line-height:normal;outline:0}.adm :deep(.qc-history-filter input:focus),.adm :deep(.qc-history-filter select:focus){box-shadow:inset 0 0 0 2px #2ec46b}.adm :deep(.qc-history-filter label:nth-child(1) select){width:auto;min-width:108px}.adm :deep(.qc-history-filter label:nth-child(2) input),.adm :deep(.qc-history-filter label:nth-child(3) input){width:126px}.adm :deep(.qc-history-filter label:nth-child(4) select){width:auto;min-width:62px}.adm :deep(.qc-history-filter label:nth-child(5) input),.adm :deep(.qc-history-filter label:nth-child(6) input){width:104px}.adm :deep(.qc-history-filter label:nth-child(7) input){width:132px}.adm :deep(.qc-table.history td){padding:6px 8px}
.sm-adv-collapsed{display:flex;align-items:center;justify-content:space-between;color:#15532f;font-size:12.5px;font-weight:700}.sm-adv-collapsed button,.sm-adv-collapse{margin-left:auto;border:0;background:transparent;color:#15532f;font-size:13px;cursor:pointer}.sm-adv-collapse{padding:4px 7px}
.admin-confirm{z-index:1700}
@media(max-width:700px){.adm :deep(.ops-ms-tab){min-height:38px}.adm :deep(.ops-search-group){height:36px}.adm :deep(.ops-filter-select),.adm :deep(.ops-search){height:28px}.adm :deep(.ops-status-select){width:96px;height:32px}.adm :deep(.ops-ms-table tbody td){height:38px}}

/* Reference Data / Countries postal-code hierarchy */
.postal-open-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-width:86px;height:26px;padding:0 10px;border:1px solid #9bd6b4;border-radius:7px;background:#effaf4;color:#087d4b;font:inherit;font-weight:750;cursor:pointer}.postal-open-btn:hover{border-color:#22a155;background:#e3f6eb}.postal-open-btn svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.2;transition:transform .15s}.postal-open-btn svg.open{transform:rotate(180deg)}
.postal-tree-host>td{padding:0!important;border-bottom:1px solid #9bd6b4!important;background:#f9fcfa!important}.postal-tree-panel{margin:8px 12px 12px;border:1px solid #b9dfc8;border-radius:10px;background:#fff;box-shadow:0 4px 16px rgba(20,90,52,.08);overflow:hidden}.postal-tree-toolbar{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid #dcebe2;background:#f1faf5}.postal-tree-toolbar>div{display:flex;flex-direction:column;margin-right:auto;text-align:left}.postal-tree-toolbar strong{color:#15532f;font-size:13px}.postal-tree-toolbar span{color:#698076;font-size:11px}
.postal-tree-layout{display:grid;grid-template-columns:minmax(520px,1.35fr) minmax(300px,.65fr);min-height:250px}.postal-tree-list{border-right:1px solid #dcebe2;overflow:auto}.postal-tree-head,.postal-tree-node{display:grid;grid-template-columns:minmax(260px,1fr) 110px 86px 58px;align-items:center}.postal-tree-head{min-height:34px;border-bottom:1px solid #cddfd4;background:#edf5f0;color:#53685e;font-size:11px;font-weight:800;text-transform:uppercase}.postal-tree-head>span,.postal-tree-node>span{padding:6px 9px;text-align:left}.postal-tree-node{min-height:33px;border-bottom:1px solid #edf3ef;color:#33443b;font-size:12px;cursor:pointer}.postal-tree-node:hover,.postal-tree-node.selected{background:#eef9f2}.postal-tree-node.group{background:#fbfdfc;color:#15532f}.postal-tree-node.group:hover{background:#eef9f2}.postal-node-name{display:flex;align-items:center;gap:7px}.postal-node-name b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.postal-chevron{display:inline-block;width:12px;color:#087d4b;font-style:normal;transition:transform .15s}.postal-chevron.open{transform:rotate(90deg)}.postal-pin{width:12px;color:#e58b08;font-size:9px;font-style:normal}.postal-tree-node em{display:inline-flex;padding:2px 7px;border-radius:10px;background:#e5f7ed;color:#087d4b;font-size:10px;font-style:normal;font-weight:750}.postal-tree-node em.inactive{background:#f1f2f2;color:#7f8c86}.postal-edit-mini{border:0;background:transparent;color:#087d4b;font-size:11px;font-weight:750;cursor:pointer}.postal-edit-mini:hover{text-decoration:underline}.postal-tree-empty{padding:32px;color:#73847c;text-align:center;font-size:12px}
.postal-tree-form{display:flex;flex-direction:column;gap:9px;padding:14px}.postal-tree-form h3{margin:0 0 3px;color:#15532f;font-size:14px}.postal-tree-form label{display:grid;grid-template-columns:118px 1fr;align-items:center;gap:8px;color:#475a50;font-size:11px;font-weight:700}.postal-tree-form input,.postal-tree-form select{width:100%;height:31px;box-sizing:border-box;border:1px solid #cbd9d1;border-radius:6px;background:#fff;padding:5px 8px;color:#27372f;font:inherit;outline:0}.postal-tree-form input:focus,.postal-tree-form select:focus{border-color:#22a155;box-shadow:0 0 0 2px rgba(34,161,85,.12)}.postal-form-error{margin:0;color:#c0392b;font-size:11px}.postal-form-actions{display:grid;grid-template-columns:auto 1fr auto auto;gap:7px;margin-top:auto;padding-top:8px;border-top:1px solid #edf3ef}
@media(max-width:1000px){.postal-tree-layout{grid-template-columns:1fr}.postal-tree-list{border-right:0;border-bottom:1px solid #dcebe2}.postal-tree-toolbar{flex-wrap:wrap}}
</style>



