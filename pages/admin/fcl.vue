<template>
  <div class="admin-main">
      <section v-if="activeTab === 'dashboard'" class="dashboard-view">
        <div class="section-head">
          <div>
            <p>Dashboard</p>
            <h1>Overview</h1>
          </div>
          <button class="primary-btn" type="button" :disabled="isLoadingUsers" @click="reloadAccounts">
            {{ isLoadingUsers ? 'Refreshing...' : 'Refresh data' }}
          </button>
        </div>

        <section class="metric-row" aria-label="Management summary">
          <div class="metric">
            <span>Total accounts</span>
            <strong>{{ users.length }}</strong>
          </div>
          <div class="metric">
            <span>Admins</span>
            <strong>{{ adminCount }}</strong>
          </div>
          <div class="metric">
            <span>Active users</span>
            <strong>{{ activeUserCount }}</strong>
          </div>
          <div class="metric">
            <span>Page records</span>
            <strong>{{ fclRecordCount }}</strong>
          </div>
        </section>

        <div class="dashboard-grid">
          <section class="overview-panel">
            <div class="panel-head">
              <h2>Account Summary</h2>
              <span>{{ activeUserCount }} active</span>
            </div>
            <div class="summary-list">
              <div>
                <span>Administrators</span>
                <strong>{{ adminCount }}</strong>
              </div>
              <div>
                <span>Standard users</span>
                <strong>{{ userCount }}</strong>
              </div>
              <div>
                <span>Inactive accounts</span>
                <strong>{{ inactiveUserCount }}</strong>
              </div>
            </div>
          </section>

          <section class="overview-panel">
            <div class="panel-head">
              <h2>Page Data Summary</h2>
              <span>{{ fclRecordCount }} records</span>
            </div>
            <div class="summary-list">
              <div>
                <span>Locations</span>
                <strong>{{ fclLocations.length }}</strong>
              </div>
              <div>
                <span>Commodities</span>
                <strong>{{ fclCommodities.length }}</strong>
              </div>
              <div>
                <span>Containers</span>
                <strong>{{ fclContainers.length }}</strong>
              </div>
              <div>
                <span>Services</span>
                <strong>{{ fclServiceOptions.length }}</strong>
              </div>
              <div>
                <span>Page modules</span>
                <strong>1/5</strong>
              </div>
            </div>
          </section>

          <section class="overview-panel wide">
            <div class="panel-head">
              <h2>Recent Accounts</h2>
              <button class="text-btn" type="button" @click="activeTab = 'accounts'">View accounts</button>
            </div>
            <div class="mini-list">
              <div v-if="recentUsers.length === 0" class="empty-block">No account data loaded.</div>
              <div v-for="account in recentUsers" :key="account.id" class="mini-row">
                <span class="avatar">{{ accountInitials(account) }}</span>
                <div>
                  <strong>{{ account.fullName || account.username || 'Account' }}</strong>
                  <small>{{ account.email }}</small>
                </div>
                <em :class="{ off: !account.isActive }">{{ account.isActive ? 'Active' : 'Inactive' }}</em>
              </div>
            </div>
          </section>

          <section class="overview-panel wide">
            <div class="panel-head">
              <h2>FCL Master Data</h2>
              <button class="text-btn" type="button" @click="openPageSection('fcl')">Manage FCL</button>
            </div>
            <div class="mini-list">
              <div v-if="fclPreviewRows.length === 0" class="empty-block">No FCL master data loaded.</div>
              <div v-for="row in fclPreviewRows" :key="row.id" class="mini-row">
                <span class="route-dot">{{ row.badge }}</span>
                <div>
                  <strong>{{ row.title }}</strong>
                  <small>{{ row.subtitle }}</small>
                </div>
                <em>{{ row.status }}</em>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section v-else-if="activeTab === 'accounts'" class="workbench">
        <div class="section-head compact">
          <div>
            <p>Accounts</p>
            <h1>Account Permissions</h1>
          </div>
        </div>
        <div class="toolbar">
          <div class="search-box">
            <span aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input v-model="accountSearch" type="search" placeholder="Search name, username, email" />
          </div>
          <select v-model="roleFilter" aria-label="Role filter">
            <option value="all">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
          <select v-model="statusFilter" aria-label="Status filter">
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button class="line-btn" type="button" @click="openCreateAccount">New account</button>
        </div>

        <div v-if="accountNotice" class="notice success">{{ accountNotice }}</div>
        <div v-if="adminStore.authUsersError" class="notice error">{{ adminStore.authUsersError }}</div>

        <div class="table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Contact</th>
                <th>Current role</th>
                <th>Status</th>
                <th>Last login</th>
                <th class="actions-col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoadingUsers">
                <td colspan="6" class="empty-row">Loading accounts...</td>
              </tr>
              <tr v-else-if="filteredUsers.length === 0">
                <td colspan="6" class="empty-row">No accounts match the current filter.</td>
              </tr>
              <template v-else>
                <tr v-for="account in filteredUsers" :key="account.id">
                  <td>
                    <div class="account-cell">
                      <span class="avatar">{{ accountInitials(account) }}</span>
                      <div>
                        <strong>{{ account.fullName || account.username || 'Account' }}</strong>
                        <small>{{ account.username || account.email }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="stacked">
                      <span>{{ account.email }}</span>
                      <small>{{ account.phone || 'No phone' }}</small>
                    </div>
                  </td>
                  <td>
                    <span class="role-badge" :class="account.role.toLowerCase()">{{ account.role }}</span>
                  </td>
                  <td>
                    <span class="status-pill" :class="{ off: !account.isActive }">
                      {{ account.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>{{ formatDateTime(account.lastLoginAt) }}</td>
                  <td class="actions-col">
                    <button
                      v-if="!isDefaultAdmin(account)"
                      class="edit-row-btn"
                      type="button"
                      aria-label="Edit account"
                      title="Edit account"
                      @click="openEditAccount(account)"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </section>

      <section v-else-if="activeTab === 'pages'" class="workbench page-workbench">
        <template v-if="pageSection === 'fcl'">
          <div class="fcl-shell">
            <div class="fcl-data-tabs" aria-label="FCL page data sections">
              <button type="button" :class="{ active: fclDataSection === 'locations', done: fclDataSection !== 'locations' }" @click="setFclDataSection('locations')">
                <strong>
                  <svg v-if="fclDataSection !== 'locations'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span v-else>1</span>
                </strong>
                <span>Location details</span>
                <small>{{ fclLocations.length }} rows</small>
              </button>
              <button type="button" :class="{ active: fclDataSection === 'cargo', done: ['shipping', 'services'].includes(fclDataSection) }" @click="setFclDataSection('cargo')">
                <strong>
                  <svg v-if="['shipping', 'services'].includes(fclDataSection)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span v-else>2</span>
                </strong>
                <span>What do you want to ship?</span>
                <small>{{ fclCommodities.length }} rows</small>
              </button>
              <button type="button" :class="{ active: fclDataSection === 'shipping', done: fclDataSection === 'services' }" @click="setFclDataSection('shipping')">
                <strong>
                  <svg v-if="fclDataSection === 'services'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  <span v-else>3</span>
                </strong>
                <span>How will your cargo be shipped?</span>
                <small>{{ fclContainers.length }} rows</small>
              </button>
              <button type="button" :class="{ active: fclDataSection === 'services' }" @click="setFclDataSection('services')">
                <strong><span>5</span></strong>
                <span>Please choose services range</span>
                <small>{{ fclServiceOptions.length }} rows</small>
              </button>
            </div>

            <div class="dataset-toolbar">
              <div>
                <h1>FCL Data</h1>
                <span>{{ currentFclDataDescription }}</span>
              </div>
              <div class="dataset-actions">
                <button class="ghost-btn icon-text-btn" type="button" @click="triggerFclImport">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M5 21h14"/></svg>
                  Import Excel
                </button>
                <button class="ghost-btn icon-text-btn" type="button" @click="exportFclExcel">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9"/><path d="m7 14 5 5 5-5"/><path d="M5 3h14"/></svg>
                  Export Excel
                </button>
                <button v-if="fclDataSection !== 'services'" class="line-btn icon-text-btn" type="button" @click="openCreateFclModal">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  {{ currentFclAddLabel }}
                </button>
                <button v-if="fclDataSection === 'cargo'" class="ghost-btn icon-text-btn" type="button" @click="openHsImporter">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/></svg>
                  Import HS Codes (Macmap)
                </button>
                <button class="ghost-btn square-btn" type="button" title="Reset data" @click="resetFclData">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v6h6"/></svg>
                </button>
                <input ref="fclImportInput" class="sr-only-file" type="file" accept=".xlsx,.xls,.csv" @change="importFclExcel" />
              </div>
            </div>

            <div class="fcl-filterbar">
              <div class="fcl-filterbar-left">
                <div class="search-box fcl-filterbar-search">
                  <span aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </span>
                  <input v-model="fclSearch" type="search" :placeholder="currentFclSearchPlaceholder" />
                </div>
                <template v-if="showFclFilters">
                  <template v-if="fclDataSection === 'locations'">
                    <select v-model="fclLocationCountryFilter" class="filterbar-select" aria-label="Filter country">
                      <option value="all">All countries</option>
                      <option v-for="c in fclCountryOptions" :key="c" :value="c">{{ c }}</option>
                    </select>
                    <select v-model="fclLocationRegionFilter" class="filterbar-select" aria-label="Filter region">
                      <option value="all">All regions</option>
                      <option v-for="r in fclRegionOptions" :key="r" :value="r">{{ r }}</option>
                    </select>
                    <select v-model="fclLocationTypeFilter" class="filterbar-select" aria-label="Filter type">
                      <option value="all">All types</option>
                      <option v-for="t in fclLocationTypeOptions" :key="t" :value="t">{{ t }}</option>
                    </select>
                    <select v-model="fclStatusFilter" class="filterbar-select" aria-label="Filter status">
                      <option value="all">All status</option>
                      <option value="enabled">Active</option>
                      <option value="disabled">Inactive</option>
                    </select>
                  </template>
                  <template v-else-if="fclDataSection === 'cargo'">
                    <select v-model="fclCargoTypeFilter" class="filterbar-select" aria-label="Filter cargo type">
                      <option value="all">All cargo</option>
                      <option value="normal">Normal</option>
                      <option value="reefer">Reefer</option>
                      <option value="dangerous">Dangerous</option>
                      <option value="both">Reefer &amp; Dangerous</option>
                    </select>
                    <select v-model="fclCargoTempFilter" class="filterbar-select" aria-label="Filter temp control">
                      <option value="all">Temp: All</option>
                      <option value="yes">Reefer</option>
                      <option value="no">Normal</option>
                    </select>
                    <select v-model="fclCargoDangerFilter" class="filterbar-select" aria-label="Filter dangerous">
                      <option value="all">Danger: All</option>
                      <option value="yes">Dangerous</option>
                      <option value="no">Normal</option>
                    </select>
                    <select v-model="fclStatusFilter" class="filterbar-select" aria-label="Filter status">
                      <option value="all">All status</option>
                      <option value="enabled">Active</option>
                      <option value="disabled">Inactive</option>
                      <option value="trashed">Trash</option>
                    </select>
                  </template>
                  <template v-else-if="fclDataSection === 'shipping'">
                    <select v-model="fclShippingGroupFilter" class="filterbar-select" aria-label="Filter group">
                      <option value="all">All groups</option>
                      <option v-for="g in fclShippingGroupOptions" :key="g" :value="g">{{ g }}</option>
                    </select>
                    <select v-model="fclStatusFilter" class="filterbar-select" aria-label="Filter status">
                      <option value="all">All status</option>
                      <option value="enabled">Active</option>
                      <option value="disabled">Inactive</option>
                      <option value="trashed">Trash</option>
                    </select>
                  </template>
                  <template v-else>
                    <select v-model="fclServiceGroupFilter" class="filterbar-select" aria-label="Filter group">
                      <option value="all">All groups</option>
                      <option v-for="g in fclServiceGroupOptions" :key="g" :value="g">{{ g }}</option>
                    </select>
                    <select v-model="fclStatusFilter" class="filterbar-select" aria-label="Filter status">
                      <option value="all">All status</option>
                      <option value="enabled">Visible</option>
                      <option value="disabled">Hidden</option>
                    </select>
                  </template>
                  <button class="filterbar-clear" type="button" @click="resetFclFilters">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    Clear
                  </button>
                </template>
              </div>
              <div class="fcl-filterbar-right">
                <button
                  class="filterbar-toggle"
                  type="button"
                  :class="{ active: showFclFilters }"
                  @click="showFclFilters = !showFclFilters"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
                  Filters
                  <span v-if="activeFclFilterCount" class="filter-count">{{ activeFclFilterCount }}</span>
                </button>
              </div>
            </div>

          <div v-if="fclNotice" class="notice success">{{ fclNotice }}</div>

          <div v-if="fclDataSection === 'locations'" class="data-panel full-panel">
            <div v-if="selectedFclLocations.length > 0" class="bulk-actions-strip">
              <span>{{ selectedFclLocations.length }} selected</span>
              <button type="button" class="danger-text-btn" @click="bulkDeleteFcl('locations')" v-if="fclStatusFilter !== 'trashed'">Move to Trash</button>
              <button type="button" class="text-btn" @click="bulkRestoreFcl('locations')" v-if="fclStatusFilter === 'trashed'">Restore</button>
            </div>

            <div class="table-wrap compact grid-wrap">
              <table class="admin-table data-table">
                <thead>
                  <tr>
                    <th class="select-col"><input v-model="selectAllLocations" class="row-check" type="checkbox" aria-label="Select all locations" /></th>
                    <th>ID</th>
                    <th>Country / Region</th>
                    <th>From/To Port / Location</th>
                    <th>Type</th>
                    <th>Country code</th>
                    <th>Keywords</th>
                    <th class="status-col">Status</th>
                    <th class="actions-col">Action</th>
                  </tr>

                </thead>
                <tbody>
                  <tr v-if="paginatedFclLocations.length === 0">
                    <td colspan="9" class="empty-row">No location records match the current filter.</td>
                  </tr>
                  <tr v-for="item in paginatedFclLocations" :key="item.id" class="data-row">
                    <td class="select-col"><input v-model="selectedFclLocations" :value="item.id" class="row-check" type="checkbox" :aria-label="`Select ${item.id}`" /></td>
                    <td class="mono-cell">{{ item.id }}</td>
                    <td>
                      <div class="country-region-cell">
                        <div class="country-cell">
                          <span class="mini-flag" aria-hidden="true">{{ countryFlag(item) }}</span>
                          <strong>{{ item.country }}</strong>
                          <span class="popular-pill" :class="{ muted: !isPopularFclLocation(item) }">
                            <svg v-if="isPopularFclLocation(item)" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2-4.6-4.4 6.3-.9L12 2.8Z"/></svg>
                            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>
                            {{ isPopularFclLocation(item) ? 'Popular' : 'Standard' }}
                          </span>
                        </div>
                        <small>{{ item.region || '-' }}</small>
                      </div>
                    </td>
                    <td>
                      <div class="stacked-text">
                        <strong>{{ item.city || '—' }}</strong>
                        <small>{{ item.label || '—' }}</small>
                      </div>
                    </td>
                    <td>{{ item.type }}</td>
                    <td class="mono-cell">{{ item.countryCode }}</td>
                    <td>{{ item.keywords.join(', ') || '—' }}</td>
                    <td class="status-col">
                      <span class="status-pill" :class="{ off: !item.enabled }">{{ item.enabled ? 'Active' : 'Inactive' }}</span>
                    </td>
                    <td class="actions-col">
                      <div class="row-action">
                        <button class="kebab-btn" type="button" aria-label="Open location actions" @click="toggleFclActions('locations', item.id)">
                          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>
                        </button>
                        <div v-if="activeFclActionKey === fclActionKey('locations', item.id)" class="row-menu">
                          <template v-if="!item.deleted">
                            <button type="button" @click="openEditFclModal(item)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                              Edit
                            </button>
                            <button type="button" @click="duplicateFclRecord(item)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>
                              Duplicate
                            </button>
                            <button type="button" @click="toggleFclEnabled(item)">
                              <svg v-if="item.enabled" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m5 5 14 14"/></svg>
                              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                              {{ item.enabled ? 'Disable' : 'Enable' }}
                            </button>
                            <button type="button" class="danger" @click="requestDeleteFcl('locations', item.id, `${item.id} - ${item.city || item.label}`)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>
                              Trash
                            </button>
                          </template>
                          <template v-else>
                            <button type="button" @click="restoreFclRecord('locations', item.id)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                              Restore
                            </button>
                            <button type="button" class="danger" @click="requestDeleteFcl('locations', item.id, `${item.id} - ${item.city || item.label}`)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>
                              Delete Permanently
                            </button>
                          </template>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="pagination-bar">
              <select v-model.number="fclPageSize" aria-label="Rows per page">
                <option :value="10">10 per page</option>
                <option :value="25">25 per page</option>
                <option :value="50">50 per page</option>
                <option :value="100">100 per page</option>
              </select>
              <span>{{ fclPageStart }}-{{ fclPageEnd }} of {{ currentFclTotalRows }}</span>
              <button class="page-arrow" type="button" :disabled="fclCurrentPage === 1" @click="fclCurrentPage--" aria-label="Previous page">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button v-for="page in fclPageNumbers" :key="page" class="page-number" type="button" :class="{ active: page === fclCurrentPage }" @click="fclCurrentPage = page">{{ page }}</button>
              <span v-if="fclTotalPages > 4">...</span>
              <button v-if="fclTotalPages > 3" class="page-number" type="button" :class="{ active: fclCurrentPage === fclTotalPages }" @click="fclCurrentPage = fclTotalPages">{{ fclTotalPages }}</button>
              <button class="page-arrow" type="button" :disabled="fclCurrentPage === fclTotalPages" @click="fclCurrentPage++" aria-label="Next page">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div v-else-if="fclDataSection === 'cargo'" class="data-panel full-panel">

            <div v-if="selectedFclCommodities.length > 0" class="bulk-actions-strip">
              <span>{{ selectedFclCommodities.length }} selected</span>
              <button type="button" class="danger-text-btn" @click="bulkDeleteFcl('cargo')" v-if="fclStatusFilter !== 'trashed'">Move to Trash</button>
              <button type="button" class="text-btn" @click="bulkRestoreFcl('cargo')" v-if="fclStatusFilter === 'trashed'">Restore</button>
            </div>

            <div class="table-wrap compact grid-wrap">
              <table class="admin-table data-table">
                <thead>
                  <tr>
                    <th class="select-col"><input v-model="selectAllCommodities" class="row-check" type="checkbox" aria-label="Select all commodities" /></th>
                    <th>Code</th>
                    <th>Commodity</th>
                    <th>HS code</th>
                    <th class="center">Temp control</th>
                    <th class="center">Dangerous</th>
                    <th class="status-col">Status</th>
                    <th class="actions-col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="paginatedFclCommodities.length === 0">
                    <td colspan="8" class="empty-row">No commodity records match the current filter.</td>
                  </tr>
                  <tr v-for="item in paginatedFclCommodities" :key="item.code" class="data-row">
                    <td class="select-col"><input v-model="selectedFclCommodities" :value="item.code" class="row-check" type="checkbox" :aria-label="`Select ${item.code}`" /></td>
                    <td class="mono-cell">{{ item.code }}</td>
                    <td>
                      <span class="commodity-cell">
                        <span class="commodity-icon">{{ commodityIcon(item) }}</span>
                        <strong>{{ item.name }}</strong>
                      </span>
                    </td>
                    <td class="mono-cell">{{ item.hsCode || '—' }}</td>
                    <td class="center">
                      <span class="flag-pill" :class="{ on: item.reefer }">
                        <svg v-if="item.reefer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/></svg>
                        {{ item.reefer ? 'Reefer' : 'Normal' }}
                      </span>
                    </td>
                    <td class="center">
                      <span class="flag-pill danger" :class="{ on: item.dangerous }">
                        <svg v-if="item.dangerous" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5"/></svg>
                        {{ item.dangerous ? 'Dangerous' : 'Normal' }}
                      </span>
                    </td>
                    <td class="status-col">
                      <span class="status-pill" :class="{ off: !item.enabled }">{{ item.enabled ? 'Active' : 'Inactive' }}</span>
                    </td>
                    <td class="actions-col">
                      <div class="row-action">
                        <button class="kebab-btn" type="button" aria-label="Open commodity actions" @click="toggleFclActions('cargo', item.code)">
                          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>
                        </button>
                        <div v-if="activeFclActionKey === fclActionKey('cargo', item.code)" class="row-menu">
                          <template v-if="!item.deleted">
                            <button type="button" @click="openEditFclModal(item)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                              Edit
                            </button>
                            <button type="button" @click="duplicateFclRecord(item)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>
                              Duplicate
                            </button>
                            <button type="button" @click="toggleFclEnabled(item)">
                              <svg v-if="item.enabled" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m5 5 14 14"/></svg>
                              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                              {{ item.enabled ? 'Disable' : 'Enable' }}
                            </button>
                            <button type="button" class="danger" @click="requestDeleteFcl('cargo', item.code, `${item.code} - ${item.name}`)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>
                              Trash
                            </button>
                          </template>
                          <template v-else>
                            <button type="button" @click="restoreFclRecord('cargo', item.code)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                              Restore
                            </button>
                            <button type="button" class="danger" @click="requestDeleteFcl('cargo', item.code, `${item.code} - ${item.name}`)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>
                              Delete Permanently
                            </button>
                          </template>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="pagination-bar">
              <select v-model.number="fclPageSize" aria-label="Rows per page">
                <option :value="10">10 per page</option>
                <option :value="25">25 per page</option>
                <option :value="50">50 per page</option>
                <option :value="100">100 per page</option>
              </select>
              <span>{{ fclPageStart }}-{{ fclPageEnd }} of {{ currentFclTotalRows }}</span>
              <button class="page-arrow" type="button" :disabled="fclCurrentPage === 1" @click="fclCurrentPage--" aria-label="Previous page">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button v-for="page in fclPageNumbers" :key="page" class="page-number" type="button" :class="{ active: page === fclCurrentPage }" @click="fclCurrentPage = page">{{ page }}</button>
              <span v-if="fclTotalPages > 4">...</span>
              <button v-if="fclTotalPages > 3" class="page-number" type="button" :class="{ active: fclCurrentPage === fclTotalPages }" @click="fclCurrentPage = fclTotalPages">{{ fclTotalPages }}</button>
              <button class="page-arrow" type="button" :disabled="fclCurrentPage === fclTotalPages" @click="fclCurrentPage++" aria-label="Next page">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div v-else-if="fclDataSection === 'shipping'" class="data-panel full-panel">

            <div v-if="selectedFclContainers.length > 0" class="bulk-actions-strip">
              <span>{{ selectedFclContainers.length }} selected</span>
              <button type="button" class="danger-text-btn" @click="bulkDeleteFcl('shipping')" v-if="fclStatusFilter !== 'trashed'">Move to Trash</button>
              <button type="button" class="text-btn" @click="bulkRestoreFcl('shipping')" v-if="fclStatusFilter === 'trashed'">Restore</button>
            </div>

            <div class="table-wrap compact grid-wrap">
              <table class="admin-table data-table">
                <thead>
                  <tr>
                    <th class="select-col"><input v-model="selectAllContainers" class="row-check" type="checkbox" aria-label="Select all containers" /></th>
                    <th>Group</th>
                    <th>Value</th>
                    <th>Container type & size</th>
                    <th class="center">Quote only</th>
                    <th class="center">Hide weight</th>
                    <th class="status-col">Status</th>
                    <th class="actions-col">Action</th>
                  </tr>

                </thead>
                <tbody>
                  <tr v-if="paginatedFclContainers.length === 0">
                    <td colspan="8" class="empty-row">No container records match the current filter.</td>
                  </tr>
                  <tr v-for="item in paginatedFclContainers" :key="item.id" class="data-row">
                    <td class="select-col"><input v-model="selectedFclContainers" :value="item.id" class="row-check" type="checkbox" :aria-label="`Select ${item.value}`" /></td>
                    <td><strong>{{ item.group }}</strong></td>
                    <td class="mono-cell">{{ item.value }}</td>
                    <td>{{ item.label }}</td>
                    <td class="center">
                      <span class="status-pill" :class="{ off: !item.quoteOnly }">{{ item.quoteOnly ? 'Yes' : 'No' }}</span>
                    </td>
                    <td class="center">
                      <span class="status-pill" :class="{ off: !item.hideWeight }">{{ item.hideWeight ? 'Yes' : 'No' }}</span>
                    </td>
                    <td class="status-col">
                      <span class="status-pill" :class="{ off: !item.enabled }">{{ item.enabled ? 'Active' : 'Inactive' }}</span>
                    </td>
                    <td class="actions-col">
                      <div class="row-action">
                        <button class="kebab-btn" type="button" aria-label="Open container actions" @click="toggleFclActions('shipping', item.id)">
                          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>
                        </button>
                        <div v-if="activeFclActionKey === fclActionKey('shipping', item.id)" class="row-menu">
                          <template v-if="!item.deleted">
                            <button type="button" @click="openEditFclModal(item)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                              Edit
                            </button>
                            <button type="button" @click="duplicateFclRecord(item)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>
                              Duplicate
                            </button>
                            <button type="button" @click="toggleFclEnabled(item)">
                              <svg v-if="item.enabled" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m5 5 14 14"/></svg>
                              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                              {{ item.enabled ? 'Disable' : 'Enable' }}
                            </button>
                            <button type="button" class="danger" @click="requestDeleteFcl('shipping', item.id, `${item.id} - ${item.label}`)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>
                              Trash
                            </button>
                          </template>
                          <template v-else>
                            <button type="button" @click="restoreFclRecord('shipping', item.id)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                              Restore
                            </button>
                            <button type="button" class="danger" @click="requestDeleteFcl('shipping', item.id, `${item.id} - ${item.label}`)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>
                              Delete Permanently
                            </button>
                          </template>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="pagination-bar">
              <select v-model.number="fclPageSize" aria-label="Rows per page">
                <option :value="10">10 per page</option>
                <option :value="25">25 per page</option>
                <option :value="50">50 per page</option>
                <option :value="100">100 per page</option>
              </select>
              <span>{{ fclPageStart }}-{{ fclPageEnd }} of {{ currentFclTotalRows }}</span>
              <button class="page-arrow" type="button" :disabled="fclCurrentPage === 1" @click="fclCurrentPage--" aria-label="Previous page">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button v-for="page in fclPageNumbers" :key="page" class="page-number" type="button" :class="{ active: page === fclCurrentPage }" @click="fclCurrentPage = page">{{ page }}</button>
              <span v-if="fclTotalPages > 4">...</span>
              <button v-if="fclTotalPages > 3" class="page-number" type="button" :class="{ active: fclCurrentPage === fclTotalPages }" @click="fclCurrentPage = fclTotalPages">{{ fclTotalPages }}</button>
              <button class="page-arrow" type="button" :disabled="fclCurrentPage === fclTotalPages" @click="fclCurrentPage++" aria-label="Next page">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>

          <div v-else class="data-panel full-panel">
            <div class="table-wrap compact grid-wrap">
              <table class="admin-table data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Group</th>
                    <th>Service name</th>
                    <th class="status-col">Status</th>
                    <th class="actions-col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="paginatedFclServiceOptions.length === 0">
                    <td colspan="5" class="empty-row">No service records match the current filter.</td>
                  </tr>
                  <tr v-for="item in paginatedFclServiceOptions" :key="item.id" class="data-row">
                    <td class="mono-cell">{{ item.id }}</td>
                    <td><strong>{{ item.group }}</strong></td>
                    <td>{{ item.label }}</td>
                    <td class="status-col">
                      <span class="status-pill" :class="{ off: !item.enabled }">{{ item.enabled ? 'Visible' : 'Hidden' }}</span>
                    </td>
                    <td class="actions-col">
                      <div class="row-action">
                        <button class="kebab-btn" type="button" aria-label="Open service actions" @click="toggleFclActions('services', item.id)">
                          <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg>
                        </button>
                        <div v-if="activeFclActionKey === fclActionKey('services', item.id)" class="row-menu">
                          <template v-if="!item.deleted">
                            <button type="button" @click="openEditFclModal(item)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                              Edit
                            </button>
                            <button type="button" @click="toggleFclEnabled(item)">
                              <svg v-if="item.enabled" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m5 5 14 14"/></svg>
                              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                              {{ item.enabled ? 'Hide' : 'Unhide' }}
                            </button>
                          </template>
                          <template v-else>
                            <button type="button" @click="restoreFclRecord('services', item.id)">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                              Restore
                            </button>
                          </template>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="pagination-bar">
              <select v-model.number="fclPageSize" aria-label="Rows per page">
                <option :value="10">10 per page</option>
                <option :value="25">25 per page</option>
                <option :value="50">50 per page</option>
                <option :value="100">100 per page</option>
              </select>
              <span>{{ fclPageStart }}-{{ fclPageEnd }} of {{ currentFclTotalRows }}</span>
              <button class="page-arrow" type="button" :disabled="fclCurrentPage === 1" @click="fclCurrentPage--" aria-label="Previous page">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button v-for="page in fclPageNumbers" :key="page" class="page-number" type="button" :class="{ active: page === fclCurrentPage }" @click="fclCurrentPage = page">{{ page }}</button>
              <span v-if="fclTotalPages > 4">...</span>
              <button v-if="fclTotalPages > 3" class="page-number" type="button" :class="{ active: fclCurrentPage === fclTotalPages }" @click="fclCurrentPage = fclTotalPages">{{ fclTotalPages }}</button>
              <button class="page-arrow" type="button" :disabled="fclCurrentPage === fclTotalPages" @click="fclCurrentPage++" aria-label="Next page">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
          </div>
        </template>

        <div v-else class="coming-panel">
          <div class="coming-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13Z"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h4"/></svg>
          </div>
          <strong>{{ currentPageLabel }}</strong>
          <p>This page module will be added after FCL data management.</p>
        </div>
      </section>
    </div>

    <div v-if="fclModalOpen" class="modal-backdrop" role="presentation" @click.self="closeFclModal">
      <section class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="fcl-dialog-title">
        <div class="modal-head">
          <div>
            <p>{{ fclModalMode === 'create' ? 'New record' : 'Edit record' }}</p>
            <h2 id="fcl-dialog-title">
              {{ fclDataSection === 'locations' ? 'Location Data' : fclDataSection === 'cargo' ? 'Commodity Data' : fclDataSection === 'shipping' ? 'Container Data' : 'Service Data' }}
            </h2>
          </div>
          <button class="icon-btn" type="button" aria-label="Close" @click="closeFclModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form class="modal-form" novalidate @submit.prevent="saveFclModal">
          <div v-if="fclModalError" class="notice error">{{ fclModalError }}</div>

          <template v-if="fclDataSection === 'locations'">
            <div class="form-grid">
              <label class="field"><span>ID</span><input v-model.trim="fclLocationForm.id" type="text" :disabled="fclModalMode === 'edit'" /></label>
              <label class="field"><span>Type</span><input v-model.trim="fclLocationForm.type" type="text" /></label>
              <label class="field"><span>Country</span><input v-model.trim="fclLocationForm.country" type="text" /></label>
              <label class="field"><span>Region</span><input v-model.trim="fclLocationForm.region" type="text" /></label>
              <label class="field"><span>Port / Location</span><input v-model.trim="fclLocationForm.city" type="text" @change="syncLocationFormLabel" /></label>
              <label class="field"><span>Display Label</span><input v-model.trim="fclLocationForm.label" type="text" /></label>
              <label class="field"><span>Country Code</span><input v-model.trim="fclLocationForm.countryCode" type="text" /></label>
              <label class="field"><span>Keywords (comma separated)</span><input :value="fclLocationForm.keywords.join(', ')" type="text" @change="updateLocationFormKeywords" /></label>
            </div>
            <div class="form-grid" style="margin-top:16px">
              <label class="switch-row">
                <input v-model="fclLocationForm.popular" type="checkbox" />
                <span>Mark as Popular</span>
              </label>
              <label class="switch-row">
                <input v-model="fclLocationForm.enabled" type="checkbox" />
                <span>Enabled</span>
              </label>
            </div>
          </template>

          <template v-else-if="fclDataSection === 'cargo'">
            <div class="form-grid">
              <label class="field"><span>Code</span><input v-model.trim="fclCommodityForm.code" type="text" :disabled="fclModalMode === 'edit'" /></label>
              <label class="field"><span>Commodity Name</span><input v-model.trim="fclCommodityForm.name" type="text" /></label>
              <label class="field"><span>HS Code</span><input v-model.trim="fclCommodityForm.hsCode" type="text" maxlength="6" @change="sanitizeCommodityFormHsCode" /></label>
            </div>
            <div class="form-grid" style="margin-top:16px">
              <label class="switch-row"><input v-model="fclCommodityForm.reefer" type="checkbox" /><span>Temperature control required</span></label>
              <label class="switch-row"><input v-model="fclCommodityForm.dangerous" type="checkbox" /><span>Dangerous cargo</span></label>
              <label class="switch-row"><input v-model="fclCommodityForm.enabled" type="checkbox" /><span>Enabled</span></label>
            </div>
          </template>

          <template v-else-if="fclDataSection === 'shipping'">
            <div class="form-grid">
              <label class="field"><span>Group</span><input v-model.trim="fclContainerForm.group" type="text" /></label>
              <label class="field"><span>Value</span><input v-model.trim="fclContainerForm.value" type="text" :disabled="fclModalMode === 'edit'" /></label>
              <label class="field" style="grid-column: span 2"><span>Container Type & Size Label</span><input v-model.trim="fclContainerForm.label" type="text" /></label>
            </div>
            <div class="form-grid" style="margin-top:16px">
              <label class="switch-row"><input v-model="fclContainerForm.quoteOnly" type="checkbox" /><span>Quote only</span></label>
              <label class="switch-row"><input v-model="fclContainerForm.hideWeight" type="checkbox" /><span>Hide weight</span></label>
              <label class="switch-row"><input v-model="fclContainerForm.enabled" type="checkbox" /><span>Enabled</span></label>
            </div>
          </template>

          <template v-else>
            <div class="form-grid">
              <label class="field"><span>ID</span><input v-model.trim="fclServiceForm.id" type="text" :disabled="fclModalMode === 'edit'" /></label>
              <label class="field"><span>Group</span><input v-model.trim="fclServiceForm.group" type="text" disabled /></label>
              <label class="field" style="grid-column: span 2"><span>Service name</span><input v-model.trim="fclServiceForm.label" type="text" /></label>
            </div>
            <div class="form-grid" style="margin-top:16px">
              <label class="switch-row"><input v-model="fclServiceForm.enabled" type="checkbox" /><span>Visible</span></label>
            </div>
          </template>

          <div class="modal-actions">
            <button class="ghost-btn" type="button" @click="closeFclModal">Cancel</button>
            <button class="primary-btn" type="submit">Save changes</button>
          </div>
        </form>
      </section>
    </div>

    <div v-if="fclDeleteTarget" class="modal-backdrop subtle-backdrop" role="presentation" @click.self="closeDeleteFclDialog">
      <section class="delete-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-fcl-title">
        <button class="dialog-close" type="button" aria-label="Close" @click="closeDeleteFclDialog">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div class="delete-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        </div>
        <div>
          <h2 id="delete-fcl-title">Delete this {{ fclDeleteTarget.section === 'locations' ? 'location' : fclDeleteTarget.section === 'cargo' ? 'commodity' : fclDeleteTarget.section === 'shipping' ? 'container' : 'service' }}?</h2>
          <p>Are you sure you want to delete "{{ fclDeleteTarget.label }}"? This action cannot be undone.</p>
        </div>
        <div class="modal-actions">
          <button class="ghost-btn" type="button" @click="closeDeleteFclDialog">Cancel</button>
          <button class="danger-solid-btn" type="button" @click="confirmDeleteFcl">Delete</button>
        </div>
      </section>
    </div>

    <!-- HS Code Importer Modal -->
    <div v-if="hsImporterOpen" class="modal-backdrop" role="presentation" @click.self="closeHsImporter">
      <section class="hs-importer-dialog" role="dialog" aria-modal="true" aria-labelledby="hs-importer-title">
        <div class="modal-head">
          <div>
            <p>Macmap.org</p>
            <h2 id="hs-importer-title">Import HS Codes</h2>
          </div>
          <button class="icon-btn" type="button" aria-label="Close" @click="closeHsImporter">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div class="hs-importer-body">
          <div class="hs-importer-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            <span>Nguồn dữ liệu: <strong>Macmap.org</strong> — chỉ hiển thị mã HS 6 chữ số (level 6) chưa có trong danh sách commodity hiện tại.</span>
          </div>

          <div class="hs-importer-controls">
            <div class="search-box">
              <span aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input v-model="hsSearchQuery" type="search" placeholder="Tìm theo mã HS hoặc tên sản phẩm..." />
            </div>
            <button class="ghost-btn icon-text-btn" type="button" :disabled="hsLoading" @click="fetchHsCodes">
              <svg v-if="!hsLoading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v6h6"/></svg>
              <span v-if="hsLoading" class="spinner-sm"></span>
              {{ hsLoading ? 'Đang tải...' : 'Tải dữ liệu Macmap.org' }}
            </button>
            <button v-if="hsSelectedItems.length > 0" class="line-btn icon-text-btn" type="button" @click="importSelectedHsCodes">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              Thêm {{ hsSelectedItems.length }} mã đã chọn
            </button>
          </div>

          <div v-if="hsError" class="notice error" style="margin: 0 0 12px">{{ hsError }}</div>

          <div v-if="hsMappedItems.length > 0" class="hs-summary-bar">
            <span class="hs-sum-chip new">{{ hsNewItems.length }} mã mới</span>
            <span class="hs-sum-chip exists">{{ hsMappedItems.length - hsNewItems.length }} đã có</span>
            <span style="margin-left: auto; font-size: 12px; color: var(--muted)">Hiển thị {{ hsFilteredItems.length }} kết quả</span>
          </div>

          <div class="hs-table-wrap">
            <div v-if="!hsMappedItems.length && !hsLoading" class="hs-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/></svg>
              <p>Nhấn "Tải dữ liệu WCO" để lấy danh sách mã HS từ chuẩn quốc tế.</p>
            </div>
            <div v-else-if="hsLoading" class="hs-empty">
              <span class="spinner-lg"></span>
              <p>Đang tải dữ liệu từ WCO...</p>
            </div>
            <table v-else class="admin-table hs-table">
              <thead>
                <tr>
                  <th class="select-col">
                    <input v-model="hsSelectAll" type="checkbox" class="row-check" aria-label="Select all new HS codes" />
                  </th>
                  <th>HS Code</th>
                  <th>Mô tả sản phẩm</th>
                  <th class="center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="hsFilteredItems.length === 0">
                  <td colspan="4" class="empty-row">Không tìm thấy kết quả phù hợp.</td>
                </tr>
                <tr v-for="item in hsFilteredItems" :key="item.hscode" class="data-row" :class="{ 'hs-exists': item.exists }">
                  <td class="select-col">
                    <input v-model="hsSelectedItems" :value="item.hscode" :disabled="item.exists" type="checkbox" class="row-check" :aria-label="`Select ${item.hscode}`" />
                  </td>
                  <td class="mono-cell"><strong>{{ item.hscode }}</strong></td>
                  <td>{{ item.description }}</td>
                  <td class="center">
                    <span v-if="item.exists" class="status-pill">Đã có</span>
                    <span v-else class="status-pill off">Chưa có</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>

    <div v-if="accountModalOpen" class="modal-backdrop" role="presentation" @click.self="closeAccountModal">
      <section class="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-dialog-title">
        <div class="modal-head">
          <div>
            <p>{{ accountModalMode === 'create' ? 'New account' : 'Edit account' }}</p>
            <h2 id="account-dialog-title">
              {{ accountModalMode === 'create' ? 'Create Account' : accountForm.fullName || 'Account Detail' }}
            </h2>
          </div>
          <button class="icon-btn" type="button" aria-label="Close" @click="closeAccountModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form class="modal-form" novalidate @submit.prevent="saveAccountModal">
          <div v-if="accountFormError" class="notice error">{{ accountFormError }}</div>
          <div v-if="accountModalMode === 'edit' && selectedAccount" class="detail-strip">
            <span>ID</span>
            <strong>{{ selectedAccount.id }}</strong>
            <span>Created</span>
            <strong>{{ formatDateTime(selectedAccount.createdAt) }}</strong>
            <span>Updated</span>
            <strong>{{ formatDateTime(selectedAccount.updatedAt) }}</strong>
          </div>

          <div class="form-grid">
            <label class="field">
              <span>Full name</span>
              <input v-model.trim="accountForm.fullName" type="text" placeholder="Full name" />
            </label>
            <label class="field">
              <span>Username</span>
              <input v-model.trim="accountForm.username" type="text" placeholder="username" :disabled="accountModalMode === 'edit'" />
            </label>
            <label class="field">
              <span>Email</span>
              <input v-model.trim="accountForm.email" type="email" placeholder="name@company.com" :disabled="accountModalMode === 'edit'" />
            </label>
            <label class="field">
              <span>Phone</span>
              <input v-model.trim="accountForm.phone" type="tel" placeholder="Phone number" />
            </label>
            <label class="field">
              <span>Password</span>
              <input v-model="accountForm.password" class="masked-password-input" type="text" name="managed-account-secret" :placeholder="accountModalMode === 'edit' ? 'Leave blank to keep current' : 'Password'" autocomplete="off" data-1p-ignore data-lpignore="true" data-form-type="other" />
            </label>
            <label class="field">
              <span>Role</span>
              <select v-model="accountForm.role">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
          </div>

          <label class="switch-row">
            <input v-model="accountForm.isActive" type="checkbox" />
            <span>{{ accountForm.isActive ? 'Active account' : 'Inactive account' }}</span>
          </label>

          <div class="modal-actions">
            <button class="ghost-btn" type="button" @click="closeAccountModal">Cancel</button>
            <button class="primary-btn" type="submit" :disabled="adminStore.isUpdatingAuthUser">
              {{ adminStore.isUpdatingAuthUser ? 'Saving...' : accountModalMode === 'create' ? 'Create account' : 'Save changes' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import * as XLSX from 'xlsx'
import { useAdminStore } from '~/store/admin'
import type { AuthUser, AuthUserRole } from '~/store/admin'
import { useUserStore } from '~/store/user'
import sourceLocations from '~/data/locations.json'
import sourceCommodities from '~/data/commodities.json'



type StatusFilter = 'all' | 'active' | 'inactive'
type AdminTab = 'dashboard' | 'accounts' | 'pages'
type AccountModalMode = 'create' | 'edit'
type PageSection = 'fcl' | 'products' | 'solutions' | 'local-information'
type FclDataSection = 'locations' | 'cargo' | 'shipping' | 'services'
type MasterStatusFilter = 'all' | 'enabled' | 'disabled' | 'trashed'
type FclSection = 'rates' | 'routes' | 'services'
type FclStatus = 'LIVE' | 'DRAFT' | 'PAUSED'

interface FclRate {
  id: string
  origin: string
  destination: string
  carrier: string
  container: string
  amount: number
  currency: string
  validUntil: string
  status: FclStatus
}

interface FclRoute {
  id: string
  origin: string
  destination: string
  status: 'OPEN' | 'PAUSED'
}

interface FclService {
  id: string
  name: string
  group: string
  enabled: boolean
}

interface FclLocationRecord {
  id: string
  type: string
  city: string
  region: string
  country: string
  countryCode: string
  label: string
  keywords: string[]
  enabled: boolean
  deleted?: boolean
  popular?: boolean
}

interface FclCommodityRecord {
  code: string
  name: string
  hsCode: string
  reefer: boolean
  dangerous: boolean
  enabled: boolean
  deleted?: boolean
}

interface FclOptionRecord {
  id: string
  group: string
  label: string
  enabled: boolean
  deleted?: boolean
}

interface FclContainerRecord {
  id: string
  group: string
  value: string
  label: string
  quoteOnly: boolean
  hideWeight: boolean
  enabled: boolean
  deleted?: boolean
}

interface AccountForm {
  username: string
  email: string
  password: string
  fullName: string
  phone: string
  role: AuthUserRole
  isActive: boolean
}

const FCL_STORAGE_KEY = 'shoptrans-admin-fcl-data'
const FCL_PAGE_STORAGE_KEY = 'shoptrans-admin-fcl-page-data'

const sourceContainerGroups = [
  {
    title: 'GENERAL PURPOSE',
    items: [
      { value: '20GP', label: "20' General Purpose (20GP)" },
      { value: '40GP', label: "40' General Purpose (40GP)" }
    ]
  },
  {
    title: 'HIGH CUBE',
    items: [
      { value: '40HC', label: "40' High Cube (40HC)" },
      { value: '45HC', label: "45' High Cube (45HC)" }
    ]
  },
  {
    title: 'REEFER',
    items: [
      { value: '20RF', label: "20' Reefer (20RF)" },
      { value: '40RF', label: "40' Reefer (40RF)" }
    ]
  },
  {
    title: 'OPEN TOP',
    items: [
      { value: '20OT', label: "20' Open Top (20OT)", hideWeight: true },
      { value: '40OT', label: "40' Open Top (40OT)", hideWeight: true }
    ]
  },
  {
    title: 'FLAT RACK',
    items: [
      { value: '20FR', label: "20' Flat Rack (20FR)", hideWeight: true },
      { value: '40FR', label: "40' Flat Rack (40FR)", hideWeight: true }
    ]
  }
]

const cloneFclPageDefaults = () => ({
  locations: (sourceLocations as any[]).map((item, index) => ({
    id: String(item.id || `location-${index + 1}`),
    type: String(item.type || 'location'),
    city: String(item.city || ''),
    region: String(item.region || item.country || ''),
    country: String(item.country || item.region || ''),
    countryCode: String(item.countryCode || ''),
    label: String(item.label || item.city || ''),
    keywords: Array.isArray(item.keywords) ? item.keywords.map((keyword: any) => String(keyword)) : [],
    enabled: item.enabled !== false
  })) as FclLocationRecord[],
  commodities: (sourceCommodities as any[]).map((item, index) => ({
    code: String(item.code || `COM${String(index + 1).padStart(3, '0')}`),
    name: String(item.name || ''),
    hsCode: String(item.hsCode || ''),
    reefer: Boolean(item.reefer),
    dangerous: Boolean(item.dangerous),
    enabled: item.enabled !== false
  })) as FclCommodityRecord[],
  cargoOptions: [
    { id: 'cargo-condition-new', group: 'Cargo condition', label: '100% new cargo', enabled: true },
    { id: 'cargo-condition-used', group: 'Cargo condition', label: 'Used cargo', enabled: true },
    { id: 'cargo-temp-control', group: 'Cargo flags', label: 'This cargo requires temperature control', enabled: true },
    { id: 'cargo-dangerous', group: 'Cargo flags', label: 'This cargo is considered dangerous', enabled: true }
  ] as FclOptionRecord[],
  containers: sourceContainerGroups.flatMap(group => group.items.map(item => ({
    id: `container-${item.value}`,
    group: group.title,
    value: item.value,
    label: item.label,
    quoteOnly: ['20OT', '40OT', '20FR', '40FR'].includes(item.value),
    hideWeight: Boolean(item.hideWeight),
    enabled: true
  }))) as FclContainerRecord[],
  shippingOptions: [
    { id: 'quantity', group: 'Container controls', label: 'Quantity stepper', enabled: true },
    { id: 'weight-kg', group: 'Cargo weight unit', label: 'kg', enabled: true },
    { id: 'weight-lbs', group: 'Cargo weight unit', label: 'lbs', enabled: true },
    { id: 'soc-container', group: 'Container flags', label: 'It is SOC container (Shipper-Owned Container)', enabled: true },
    { id: 'dangerous-disables-soc', group: 'Container rules', label: 'Disable SOC when dangerous cargo is declared', enabled: true },
    { id: 'reefer-only-temp-control', group: 'Container rules', label: 'Temperature control only allows reefer containers', enabled: true }
  ] as FclOptionRecord[],
  serviceOptions: [
    { id: 'fullExw', group: 'AT ORIGIN', label: 'Full EXW service: Door-to-port, customs clearance included', enabled: true },
    { id: 'fullFca', group: 'AT ORIGIN', label: 'Full FCA service: Door-to-port, customs clearance excluded', enabled: true },
    { id: 'origin-customsOnly', group: 'AT ORIGIN', label: 'Customs clearance service only', enabled: true },
    { id: 'origin-collectPay', group: 'AT ORIGIN', label: 'Collect/pay charges as nominated', enabled: true },
    { id: 'origin-insurance', group: 'AT ORIGIN', label: 'Buy cargo insurance', enabled: true },
    { id: 'bookingOffered', group: 'SEA FREIGHT', label: 'Place booking at the offered rate', enabled: true },
    { id: 'bookingSpot', group: 'SEA FREIGHT', label: 'Place booking at SPOT rate', enabled: true },
    { id: 'handleUnderAvailable', group: 'SEA FREIGHT', label: 'Handle the shipment under an available booking', enabled: true },
    { id: 'serviceContract', group: 'SEA FREIGHT', label: 'Place booking under SC/quotation', enabled: true },
    { id: 'switchBill', group: 'SEA FREIGHT', label: 'Switch bill of lading', enabled: true },
    { id: 'dap', group: 'AT DESTINATION', label: 'Full DAP service: Port-to-door, customs clearance excluded', enabled: true },
    { id: 'ddu', group: 'AT DESTINATION', label: 'Full DDU service: Port-to-door, import duty excluded', enabled: true },
    { id: 'ddp', group: 'AT DESTINATION', label: 'Full DDP service: Port-to-door, import duty included', enabled: true },
    { id: 'dest-customsOnly', group: 'AT DESTINATION', label: 'Customs clearance service only', enabled: true },
    { id: 'dest-collectPay', group: 'AT DESTINATION', label: 'Collect/pay charges as nominated', enabled: true },
    { id: 'dest-insurance', group: 'AT DESTINATION', label: 'Buy cargo insurance', enabled: true },
    { id: 'dodRelease', group: 'AT DESTINATION', label: 'Consignee Delivery Order (D/O) Release Service', enabled: true }
  ] as FclOptionRecord[]
})

const defaultRates: FclRate[] = [
  { id: 'rate-sgn-lax-cosco-40hc', origin: 'Ho Chi Minh', destination: 'Los Angeles', carrier: 'COSCO', container: '40HC', amount: 1850, currency: 'USD', validUntil: '2026-06-30', status: 'LIVE' },
  { id: 'rate-hph-rot-one-40gp', origin: 'Hai Phong', destination: 'Rotterdam', carrier: 'ONE', container: '40GP', amount: 2140, currency: 'USD', validUntil: '2026-06-15', status: 'LIVE' },
  { id: 'rate-sgn-hkg-maersk-20gp', origin: 'Ho Chi Minh', destination: 'Hong Kong', carrier: 'MAERSK', container: '20GP', amount: 420, currency: 'USD', validUntil: '2026-05-31', status: 'DRAFT' }
]

const defaultRoutes: FclRoute[] = [
  { id: 'route-sgn-lax', origin: 'Ho Chi Minh', destination: 'Los Angeles', status: 'OPEN' },
  { id: 'route-hph-rot', origin: 'Hai Phong', destination: 'Rotterdam', status: 'OPEN' },
  { id: 'route-sgn-hkg', origin: 'Ho Chi Minh', destination: 'Hong Kong', status: 'OPEN' }
]

const defaultServices: FclService[] = [
  { id: 'origin-pickup', name: 'Origin pickup', group: 'Origin', enabled: true },
  { id: 'export-customs', name: 'Export customs', group: 'Origin', enabled: true },
  { id: 'ocean-freight', name: 'Ocean freight', group: 'Sea freight', enabled: true },
  { id: 'destination-customs', name: 'Destination customs', group: 'Destination', enabled: true },
  { id: 'door-delivery', name: 'Door delivery', group: 'Destination', enabled: true }
]

const adminStore = useAdminStore()
const userStore = useUserStore()

const activeTab = ref<AdminTab>('pages')
const pageSection = ref<PageSection>('fcl')
const isPageMenuExpanded = ref(true)
const fclDataSection = ref<FclDataSection>('locations')
const fclSection = ref<FclSection>('rates')
const accountSearch = ref('')
const roleFilter = ref<AuthUserRole | 'all'>('all')
const statusFilter = ref<StatusFilter>('all')
const accountNotice = ref('')
const accountFormError = ref('')
const accountModalOpen = ref(false)
const accountModalMode = ref<AccountModalMode>('create')
const selectedAccount = ref<AuthUser | null>(null)
const accountForm = reactive<AccountForm>({
  username: '',
  email: '',
  password: '',
  fullName: '',
  phone: '',
  role: 'USER',
  isActive: true
})

const fclSearch = ref('')
const showFclFilters = ref(false)
const fclLocationCountryFilter = ref('all')
const fclLocationRegionFilter = ref('all')
const fclLocationTypeFilter = ref('all')
const fclCargoTypeFilter = ref('all')
const fclCargoTempFilter = ref('all')
const fclCargoDangerFilter = ref('all')
const fclShippingGroupFilter = ref('all')
const fclServiceGroupFilter = ref('all')
const fclStatusFilter = ref<MasterStatusFilter>('all')
const fclCurrentPage = ref(1)
const fclPageSize = ref(25)
const fclNotice = ref('')
const fclImportInput = ref<HTMLInputElement | null>(null)
const activeFclActionKey = ref('')
const rateError = ref('')
const editingRateId = ref('')
const rates = ref<FclRate[]>([])
const routes = ref<FclRoute[]>([])
const services = ref<FclService[]>([])
const fclLocations = ref<FclLocationRecord[]>([])
const fclCommodities = ref<FclCommodityRecord[]>([])
const fclCargoOptions = ref<FclOptionRecord[]>([])
const fclContainers = ref<FclContainerRecord[]>([])
const fclShippingOptions = ref<FclOptionRecord[]>([])
const fclServiceOptions = ref<FclOptionRecord[]>([])

const selectedFclLocations = ref<string[]>([])
const selectedFclCommodities = ref<string[]>([])
const selectedFclContainers = ref<string[]>([])
const selectedFclServices = ref<string[]>([])

const selectAllLocations = computed({
  get: () => paginatedFclLocations.value.length > 0 && selectedFclLocations.value.length === paginatedFclLocations.value.length,
  set: (val: boolean) => {
    if (val) {
      selectedFclLocations.value = paginatedFclLocations.value.map(i => i.id)
    } else {
      selectedFclLocations.value = []
    }
  }
})

const selectAllCommodities = computed({
  get: () => paginatedFclCommodities.value.length > 0 && selectedFclCommodities.value.length === paginatedFclCommodities.value.length,
  set: (val: boolean) => {
    if (val) {
      selectedFclCommodities.value = paginatedFclCommodities.value.map(i => i.code)
    } else {
      selectedFclCommodities.value = []
    }
  }
})

const selectAllContainers = computed({
  get: () => paginatedFclContainers.value.length > 0 && selectedFclContainers.value.length === paginatedFclContainers.value.length,
  set: (val: boolean) => {
    if (val) {
      selectedFclContainers.value = paginatedFclContainers.value.map(i => i.id)
    } else {
      selectedFclContainers.value = []
    }
  }
})

const selectAllServices = computed({
  get: () => paginatedFclServiceOptions.value.length > 0 && selectedFclServices.value.length === paginatedFclServiceOptions.value.length,
  set: (val: boolean) => {
    if (val) {
      selectedFclServices.value = paginatedFclServiceOptions.value.map(i => i.id)
    } else {
      selectedFclServices.value = []
    }
  }
})

const bulkDeleteFcl = (section: FclDataSection) => {
  if (section === 'locations') {
    fclLocations.value.forEach(item => { if (selectedFclLocations.value.includes(item.id)) item.deleted = true })
    selectedFclLocations.value = []
  } else if (section === 'cargo') {
    fclCommodities.value.forEach(item => { if (selectedFclCommodities.value.includes(item.code)) item.deleted = true })
    selectedFclCommodities.value = []
  } else if (section === 'shipping') {
    fclContainers.value.forEach(item => { if (selectedFclContainers.value.includes(item.id)) item.deleted = true })
    selectedFclContainers.value = []
  } else {
    fclServiceOptions.value.forEach(item => { if (selectedFclServices.value.includes(item.id)) item.deleted = true })
    selectedFclServices.value = []
  }
  persistFclData()
}

const bulkRestoreFcl = (section: FclDataSection) => {
  if (section === 'locations') {
    fclLocations.value.forEach(item => { if (selectedFclLocations.value.includes(item.id)) item.deleted = false })
    selectedFclLocations.value = []
  } else if (section === 'cargo') {
    fclCommodities.value.forEach(item => { if (selectedFclCommodities.value.includes(item.code)) item.deleted = false })
    selectedFclCommodities.value = []
  } else if (section === 'shipping') {
    fclContainers.value.forEach(item => { if (selectedFclContainers.value.includes(item.id)) item.deleted = false })
    selectedFclContainers.value = []
  } else {
    fclServiceOptions.value.forEach(item => { if (selectedFclServices.value.includes(item.id)) item.deleted = false })
    selectedFclServices.value = []
  }
  persistFclData()
}

const restoreFclRecord = (section: FclDataSection, id: string) => {
  if (section === 'locations') {
    const item = fclLocations.value.find(i => i.id === id); if (item) item.deleted = false
  } else if (section === 'cargo') {
    const item = fclCommodities.value.find(i => i.code === id); if (item) item.deleted = false
  } else if (section === 'shipping') {
    const item = fclContainers.value.find(i => i.id === id); if (item) item.deleted = false
  } else {
    const item = fclServiceOptions.value.find(i => i.id === id); if (item) item.deleted = false
  }
  persistFclData()
  activeFclActionKey.value = ''
}

const rateForm = reactive<Omit<FclRate, 'id'>>({
  origin: '',
  destination: '',
  carrier: '',
  container: '40HC',
  amount: 0,
  currency: 'USD',
  validUntil: '',
  status: 'DRAFT'
})

const routeForm = reactive<Omit<FclRoute, 'id'>>({
  origin: '',
  destination: '',
  status: 'OPEN'
})

const users = computed(() => adminStore.authUsers)
const isLoadingUsers = computed(() => adminStore.isLoadingAuthUsers)
const adminCount = computed(() => users.value.filter(user => user.role === 'ADMIN').length)
const userCount = computed(() => users.value.filter(user => user.role === 'USER').length)
const activeUserCount = computed(() => users.value.filter(user => user.isActive).length)
const inactiveUserCount = computed(() => users.value.filter(user => !user.isActive).length)
const currentAdminName = computed(() =>
  userStore.user?.fullName ||
  userStore.user?.PER_DESC ||
  userStore.user?.username ||
  userStore.user?.PER_USER ||
  userStore.user?.PER_CODE ||
  'Admin User'
)
const currentAdminEmail = computed(() =>
  userStore.user?.email ||
  userStore.user?.PER_EMAILADDRESS ||
  'admin@shoptrans.com'
)
const currentAdminInitial = computed(() => accountInitials({
  id: 'current-admin',
  fullName: currentAdminName.value,
  email: currentAdminEmail.value,
  role: 'ADMIN',
  isActive: true,
  createdAt: '',
  updatedAt: ''
}))
const fclRecordCount = computed(() =>
  fclLocations.value.length +
  fclCommodities.value.length +
  fclCargoOptions.value.length +
  fclContainers.value.length +
  fclShippingOptions.value.length +
  fclServiceOptions.value.length
)
const liveRateCount = computed(() => rates.value.filter(rate => rate.status === 'LIVE').length)
const enabledServiceCount = computed(() => services.value.filter(service => service.enabled).length)
const recentUsers = computed(() => users.value.slice(0, 4))
const liveRates = computed(() => rates.value.filter(rate => rate.status === 'LIVE').slice(0, 4))
const fclPreviewRows = computed(() => [
  {
    id: 'preview-locations',
    badge: '1',
    title: 'Location details',
    subtitle: `${fclCountryCount.value} countries, ${fclLocations.value.length} ports / locations`,
    status: 'Loaded'
  },
  {
    id: 'preview-cargo',
    badge: '2',
    title: 'What do you want to ship?',
    subtitle: `${fclCommodities.value.length} commodities and HS codes`,
    status: 'Loaded'
  },
  {
    id: 'preview-shipping',
    badge: '3',
    title: 'How will your cargo be shipped?',
    subtitle: `${fclContainers.value.length} container options`,
    status: 'Loaded'
  },
  {
    id: 'preview-services',
    badge: '5',
    title: 'Please choose services range',
    subtitle: `${fclServiceOptions.value.length} service names`,
    status: 'Loaded'
  }
])
const pageSectionMeta: Record<PageSection, { label: string; description: string }> = {
  fcl: {
    label: 'FCL Data',
    description: 'Manage source dropdown data for the FCL page.'
  },
  products: {
    label: 'Products',
    description: 'Product page display data.'
  },
  solutions: {
    label: 'Solutions',
    description: 'Solutions page display data.'
  },
  'local-information': {
    label: 'Local Information',
    description: 'Local Information page display data.'
  }
}
const currentPageLabel = computed(() => pageSectionMeta[pageSection.value].label)
const currentPageDescription = computed(() => pageSectionMeta[pageSection.value].description)
const fclDataSectionMeta: Record<FclDataSection, { label: string; description: string; placeholder: string }> = {
  locations: {
    label: '1 Location details',
    description: 'Country, Region, From Port / Location, and To Port / Location data imported from the FCL dropdown source.',
    placeholder: 'Search country, region, port, location...'
  },
  cargo: {
    label: '2 What do you want to ship?',
    description: 'Commodity, HS code, cargo condition, temperature control, and dangerous cargo data from the FCL form.',
    placeholder: 'Search commodity, HS code, code...'
  },
  shipping: {
    label: '3 How will your cargo be shipped?',
    description: 'Container type and size, quote-only flags, weight controls, and SOC rules from the FCL form.',
    placeholder: 'Search container, group, value...'
  },
  services: {
    label: '5 Please choose services range',
    description: 'Service names shown in the FCL step 5 service selector.',
    placeholder: 'Search service name, group, id...'
  }
}
const currentFclDataLabel = computed(() => fclDataSectionMeta[fclDataSection.value].label)
const currentFclDataDescription = computed(() => fclDataSectionMeta[fclDataSection.value].description)
const currentFclSearchPlaceholder = computed(() => fclDataSectionMeta[fclDataSection.value].placeholder)
const fclCountryCount = computed(() => new Set(fclLocations.value.map(item => item.country).filter(Boolean)).size)
const fclRegionCount = computed(() => new Set(fclLocations.value.map(item => item.region).filter(Boolean)).size)
const fclReeferCommodityCount = computed(() => fclCommodities.value.filter(item => item.reefer).length)
const fclDangerousCommodityCount = computed(() => fclCommodities.value.filter(item => item.dangerous).length)
const fclReeferDangerousCommodityCount = computed(() => fclCommodities.value.filter(item => item.reefer && item.dangerous).length)
const fclQuoteOnlyContainerCount = computed(() => fclContainers.value.filter(item => item.quoteOnly).length)
const currentFclAddLabel = computed(() => {
  if (fclDataSection.value === 'locations') return 'Add location'
  if (fclDataSection.value === 'cargo') return 'Add commodity'
  if (fclDataSection.value === 'shipping') return 'Add container'
  return 'Add service'
})
const activeFclFilterCount = computed(() => [
  fclSearch.value.trim(),
  fclDataSection.value === 'locations' && fclLocationCountryFilter.value !== 'all',
  fclDataSection.value === 'locations' && fclLocationRegionFilter.value !== 'all',
  fclDataSection.value === 'locations' && fclLocationTypeFilter.value !== 'all',
  fclDataSection.value === 'cargo' && fclCargoTypeFilter.value !== 'all',
  fclDataSection.value === 'cargo' && fclCargoTempFilter.value !== 'all',
  fclDataSection.value === 'cargo' && fclCargoDangerFilter.value !== 'all',
  fclDataSection.value === 'shipping' && fclShippingGroupFilter.value !== 'all',
  fclDataSection.value === 'services' && fclServiceGroupFilter.value !== 'all',
  fclStatusFilter.value !== 'all'
].filter(Boolean).length)
const uniqueSorted = (values: string[]) => Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b))
const popularFclCountries = ['China', 'Japan', 'Vietnam', 'Indonesia']
const countryCodeByName: Record<string, string> = {
  china: 'CN',
  japan: 'JP',
  vietnam: 'VN',
  'viet nam': 'VN',
  indonesia: 'ID',
  laos: 'LA',
  thailand: 'TH',
  singapore: 'SG',
  malaysia: 'MY',
  cambodia: 'KH',
  korea: 'KR',
  'south korea': 'KR',
  india: 'IN',
  germany: 'DE',
  france: 'FR',
  netherlands: 'NL',
  belgium: 'BE',
  'united states': 'US',
  usa: 'US',
  canada: 'CA',
  australia: 'AU'
}
const fclCountryOptions = computed(() => uniqueSorted(fclLocations.value.map(item => item.country)))
const fclRegionOptions = computed(() => uniqueSorted(fclLocations.value.map(item => item.region)))
const fclLocationTypeOptions = computed(() => uniqueSorted(fclLocations.value.map(item => item.type)))
const fclShippingGroupOptions = computed(() => uniqueSorted(fclContainers.value.map(item => item.group)))
const fclServiceGroupOptions = computed(() => uniqueSorted(fclServiceOptions.value.map(item => item.group)))

const normalizedCountryCode = (item: FclLocationRecord) => {
  const directCode = String(item.countryCode || '').trim().toUpperCase()
  if (/^[A-Z]{2}$/.test(directCode)) return directCode
  return countryCodeByName[String(item.country || '').trim().toLowerCase()] || ''
}

const countryFlag = (item: FclLocationRecord) => {
  const code = normalizedCountryCode(item)
  if (!code) return '🏳'
  return String.fromCodePoint(...code.split('').map(char => 127397 + char.charCodeAt(0)))
}

const isPopularFclLocation = (item: FclLocationRecord) => {
  if (item.popular !== undefined) return item.popular
  return popularFclCountries.some(country => country.toLowerCase() === String(item.country || '').toLowerCase())
}

const commodityIcon = (item: FclCommodityRecord) => {
  const text = `${item.name} ${item.hsCode}`.toLowerCase()
  if (text.includes('horse')) return '🐎'
  if (text.includes('bovine') || text.includes('cattle')) return '🐄'
  if (text.includes('beef')) return '🥩'
  if (text.includes('pork')) return '🐖'
  if (text.includes('poultry') || text.includes('chicken')) return '🐓'
  if (text.includes('fish')) return '🐟'
  if (text.includes('shrimp') || text.includes('prawn')) return '🦐'
  if (text.includes('fruit') || text.includes('apple') || text.includes('banana')) return '🍎'
  if (text.includes('rice') || text.includes('grain')) return '🌾'
  if (item.reefer) return '❄️'
  if (item.dangerous) return '⚠️'
  return '📦'
}

const cargoOptionTone = (option: FclOptionRecord) => {
  if (option.id.includes('temp')) return 'blue'
  if (option.id.includes('dangerous')) return 'amber'
  if (option.id.includes('used')) return 'green'
  return 'green'
}

const openPageSection = (section: PageSection) => {
  activeTab.value = 'pages'
  pageSection.value = section
  isPageMenuExpanded.value = true
}

const togglePageMenu = () => {
  if (activeTab.value !== 'pages') {
    openPageSection('fcl')
    return
  }

  isPageMenuExpanded.value = !isPageMenuExpanded.value
}

const setFclDataSection = (section: FclDataSection) => {
  fclDataSection.value = section
  fclCurrentPage.value = 1
  activeFclActionKey.value = ''
}

const resetFclFilters = () => {
  fclSearch.value = ''
  fclLocationCountryFilter.value = 'all'
  fclLocationRegionFilter.value = 'all'
  fclLocationTypeFilter.value = 'all'
  fclCargoTypeFilter.value = 'all'
  fclCargoTempFilter.value = 'all'
  fclCargoDangerFilter.value = 'all'
  fclShippingGroupFilter.value = 'all'
  fclServiceGroupFilter.value = 'all'
  fclStatusFilter.value = 'all'
  fclCurrentPage.value = 1
}

const logoutAdmin = async () => {
  await userStore.logout()
  await navigateTo('/login')
}

type FclModalMode = 'create' | 'edit'
const fclModalOpen = ref(false)
const fclModalMode = ref<FclModalMode>('create')
const fclModalError = ref('')
const selectedFclId = ref<string>('')
const fclDeleteTarget = ref<{ section: FclDataSection; id: string; label: string } | null>(null)

const fclLocationForm = reactive<FclLocationRecord>({
  id: '', type: 'port', city: '', region: '', country: '', countryCode: '', label: '', keywords: [], enabled: true, popular: false
})
const fclCommodityForm = reactive<FclCommodityRecord>({
  code: '', name: '', hsCode: '', reefer: false, dangerous: false, enabled: true
})
const fclContainerForm = reactive<FclContainerRecord>({
  id: '', group: 'GENERAL PURPOSE', value: '', label: '', quoteOnly: false, hideWeight: false, enabled: true
})
const fclServiceForm = reactive<FclOptionRecord>({
  id: '', group: 'AT ORIGIN', label: '', enabled: true
})

const syncLocationFormLabel = () => {
  if (!fclLocationForm.label.trim()) {
    fclLocationForm.label = fclLocationForm.city
  }
}

const updateLocationFormKeywords = (event: Event) => {
  const input = event.target as HTMLInputElement
  fclLocationForm.keywords = input.value
    .split(',')
    .map(keyword => keyword.trim())
    .filter(Boolean)
}

const sanitizeCommodityFormHsCode = () => {
  fclCommodityForm.hsCode = fclCommodityForm.hsCode.replace(/[^0-9]/g, '').slice(0, 6)
}

const openCreateFclModal = () => {
  fclModalMode.value = 'create'
  selectedFclId.value = ''
  fclModalError.value = ''

  if (fclDataSection.value === 'locations') {
    Object.assign(fclLocationForm, { id: `LOC-${Date.now()}`, type: 'port', city: '', region: '', country: '', countryCode: '', label: '', keywords: [], enabled: true, popular: false })
  } else if (fclDataSection.value === 'cargo') {
    Object.assign(fclCommodityForm, { code: `COM-${Date.now()}`, name: '', hsCode: '', reefer: false, dangerous: false, enabled: true })
  } else if (fclDataSection.value === 'shipping') {
    Object.assign(fclContainerForm, { id: `container-${Date.now()}`, group: 'GENERAL PURPOSE', value: '', label: '', quoteOnly: false, hideWeight: false, enabled: true })
  } else {
    Object.assign(fclServiceForm, { id: `service-${Date.now()}`, group: 'AT ORIGIN', label: '', enabled: true })
  }
  
  fclModalOpen.value = true
}

const openEditFclModal = (item: any) => {
  fclModalMode.value = 'edit'
  fclModalError.value = ''
  activeFclActionKey.value = ''

  if (fclDataSection.value === 'locations') {
    selectedFclId.value = item.id
    const dataToAssign = JSON.parse(JSON.stringify(item))
    if (dataToAssign.popular === undefined) {
      dataToAssign.popular = isPopularFclLocation(item as FclLocationRecord)
    }
    Object.assign(fclLocationForm, { id: '', type: 'port', city: '', region: '', country: '', countryCode: '', label: '', keywords: [], enabled: true, popular: false }, dataToAssign)
  } else if (fclDataSection.value === 'cargo') {
    selectedFclId.value = item.code
    Object.assign(fclCommodityForm, JSON.parse(JSON.stringify(item)))
  } else if (fclDataSection.value === 'shipping') {
    selectedFclId.value = item.id
    Object.assign(fclContainerForm, JSON.parse(JSON.stringify(item)))
  } else {
    selectedFclId.value = item.id
    Object.assign(fclServiceForm, JSON.parse(JSON.stringify(item)))
  }

  fclModalOpen.value = true
}

const closeFclModal = () => {
  fclModalOpen.value = false
}

const fclActionKey = (section: FclDataSection, id: string) => `${section}:${id}`

const toggleFclActions = (section: FclDataSection, id: string) => {
  const key = fclActionKey(section, id)
  activeFclActionKey.value = activeFclActionKey.value === key ? '' : key
}

const duplicateFclRecord = (item: FclLocationRecord | FclCommodityRecord | FclContainerRecord | FclOptionRecord) => {
  activeFclActionKey.value = ''
  const suffix = Date.now()

  if (fclDataSection.value === 'locations') {
    const source = item as FclLocationRecord
    fclLocations.value.unshift({
      ...JSON.parse(JSON.stringify(source)),
      id: `${source.id}-copy-${suffix}`
    })
  } else if (fclDataSection.value === 'cargo') {
    const source = item as FclCommodityRecord
    fclCommodities.value.unshift({
      ...JSON.parse(JSON.stringify(source)),
      code: `${source.code}-copy-${suffix}`
    })
  } else if (fclDataSection.value === 'shipping') {
    const source = item as FclContainerRecord
    fclContainers.value.unshift({
      ...JSON.parse(JSON.stringify(source)),
      id: `${source.id}-copy-${suffix}`,
      value: `${source.value}-COPY`
    })
  } else {
    const source = item as FclOptionRecord
    fclServiceOptions.value.unshift({
      ...JSON.parse(JSON.stringify(source)),
      id: `${source.id}-copy-${suffix}`
    })
  }

  fclCurrentPage.value = 1
  persistFclData()
}

// ===== HS CODE IMPORTER =====
interface HsCodeItem {
  hscode: string
  description: string
  exists: boolean
}

const hsImporterOpen = ref(false)
const hsLoading = ref(false)
const hsError = ref('')
const hsSearchQuery = ref('')
const hsMappedItems = ref<HsCodeItem[]>([])
const hsSelectedItems = ref<string[]>([])

const hsNewItems = computed(() => hsMappedItems.value.filter(i => !i.exists))

const hsFilteredItems = computed(() => {
  const q = hsSearchQuery.value.trim().toLowerCase()
  if (!q) return hsMappedItems.value
  return hsMappedItems.value.filter(i =>
    i.hscode.includes(q) || i.description.toLowerCase().includes(q)
  )
})

const hsSelectAll = computed({
  get: () => {
    const selectable = hsFilteredItems.value.filter(i => !i.exists)
    return selectable.length > 0 && selectable.every(i => hsSelectedItems.value.includes(i.hscode))
  },
  set: (val: boolean) => {
    if (val) {
      const newCodes = hsFilteredItems.value.filter(i => !i.exists).map(i => i.hscode)
      hsSelectedItems.value = [...new Set([...hsSelectedItems.value, ...newCodes])]
    } else {
      const visibleCodes = new Set(hsFilteredItems.value.map(i => i.hscode))
      hsSelectedItems.value = hsSelectedItems.value.filter(c => !visibleCodes.has(c))
    }
  }
})

const openHsImporter = () => {
  hsImporterOpen.value = true
  hsSearchQuery.value = ''
  hsSelectedItems.value = []
  hsError.value = ''
}

const closeHsImporter = () => {
  hsImporterOpen.value = false
}

const fetchHsCodes = async () => {
  hsLoading.value = true
  hsError.value = ''
  hsSelectedItems.value = []
  try {
    const url = '/api/macmap-hs'
    const resp = await fetch(url)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const rawItems = await resp.json()
    const existingCodes = new Set(fclCommodities.value.map(c => c.hsCode?.replace(/\D/g, '')))
    const items: HsCodeItem[] = []
    for (const item of rawItems) {
      if (!item.Code || item.Code.length !== 6) continue
      items.push({
        hscode: item.Code,
        description: item.Name.trim(),
        exists: existingCodes.has(item.Code)
      })
    }
    hsMappedItems.value = items
    if (!items.length) hsError.value = 'Không tải được dữ liệu HS Code. Kiểm tra lại API.'
  } catch (e: any) {
    hsError.value = `Không thể tải dữ liệu: ${e.message || e}. Đảm bảo kết nối mạng và API hoạt động.`
  } finally {
    hsLoading.value = false
  }
}

const importSelectedHsCodes = () => {
  const toAdd = hsMappedItems.value.filter(i => hsSelectedItems.value.includes(i.hscode))
  for (const item of toAdd) {
    const code = `HS-${item.hscode}`
    if (!fclCommodities.value.find(c => c.hsCode === item.hscode || c.code === code)) {
      fclCommodities.value.unshift({
        code,
        name: item.description,
        hsCode: item.hscode,
        reefer: false,
        dangerous: false,
        enabled: true
      })
      // mark as existing now
      item.exists = true
    }
  }
  hsSelectedItems.value = []
  persistFclData()
  setNotice('fcl', `Đã thêm ${toAdd.length} mã HS vào danh sách commodity.`)
}
// ===== END HS CODE IMPORTER =====

const toggleFclEnabled = (item: FclLocationRecord | FclCommodityRecord | FclContainerRecord | FclOptionRecord) => {
  item.enabled = !item.enabled
  activeFclActionKey.value = ''
  persistFclData()
}

const fclDuplicate = (candidate: any, currentId = '') => {
  const norm = (value: any) => String(value ?? '').trim().toUpperCase()
  if (fclDataSection.value === 'locations') {
    return fclLocations.value.some(item => item.id !== currentId && norm(item.id) === norm(candidate.id))
  }
  if (fclDataSection.value === 'cargo') {
    return fclCommodities.value.some(item => item.code !== currentId && norm(item.code) === norm(candidate.code)) ||
      (!!norm(candidate.hsCode) && fclCommodities.value.some(item => item.code !== currentId && norm(item.hsCode) === norm(candidate.hsCode)))
  }
  if (fclDataSection.value === 'shipping') {
    return fclContainers.value.some(item => item.id !== currentId && norm(item.group) === norm(candidate.group) && norm(item.value) === norm(candidate.value))
  }
  return fclServiceOptions.value.some(item => item.id !== currentId && (norm(item.id) === norm(candidate.id) || (norm(item.group) === norm(candidate.group) && norm(item.label) === norm(candidate.label))))
}

const saveFclModal = () => {
  fclModalError.value = ''

  if (fclDataSection.value === 'locations') {
    if (!fclLocationForm.id || !fclLocationForm.country) {
      fclModalError.value = 'ID and Country are required.'
      return
    }
    const itemData = JSON.parse(JSON.stringify(fclLocationForm))
    if (fclDuplicate(itemData, fclModalMode.value === 'edit' ? selectedFclId.value : '')) { fclModalError.value = 'Duplicate location already exists.'; return }
    if (fclModalMode.value === 'create') {
      fclLocations.value.unshift(itemData)
    } else {
      const idx = fclLocations.value.findIndex(x => x.id === selectedFclId.value)
      if (idx !== -1) fclLocations.value[idx] = itemData
    }
  } else if (fclDataSection.value === 'cargo') {
    if (!fclCommodityForm.code || !fclCommodityForm.name) {
      fclModalError.value = 'Code and Commodity name are required.'
      return
    }
    const itemData = JSON.parse(JSON.stringify(fclCommodityForm))
    if (fclDuplicate(itemData, fclModalMode.value === 'edit' ? selectedFclId.value : '')) { fclModalError.value = 'Duplicate commodity or HS code already exists.'; return }
    if (fclModalMode.value === 'create') {
      fclCommodities.value.unshift(itemData)
    } else {
      const idx = fclCommodities.value.findIndex(x => x.code === selectedFclId.value)
      if (idx !== -1) fclCommodities.value[idx] = itemData
    }
  } else if (fclDataSection.value === 'shipping') {
    if (!fclContainerForm.group || !fclContainerForm.value) {
      fclModalError.value = 'Group and Value are required.'
      return
    }
    const itemData = JSON.parse(JSON.stringify(fclContainerForm))
    if (fclDuplicate(itemData, fclModalMode.value === 'edit' ? selectedFclId.value : '')) { fclModalError.value = 'Duplicate container option already exists.'; return }
    if (fclModalMode.value === 'create') {
      fclContainers.value.unshift(itemData)
    } else {
      const idx = fclContainers.value.findIndex(x => x.id === selectedFclId.value)
      if (idx !== -1) fclContainers.value[idx] = itemData
    }
  } else {
    if (!fclServiceForm.id || !fclServiceForm.group || !fclServiceForm.label) {
      fclModalError.value = 'ID, Group, and Service name are required.'
      return
    }
    const itemData = JSON.parse(JSON.stringify(fclServiceForm))
    if (fclDuplicate(itemData, fclModalMode.value === 'edit' ? selectedFclId.value : '')) { fclModalError.value = 'Duplicate service option already exists.'; return }
    if (fclModalMode.value === 'create') {
      fclServiceOptions.value.unshift(itemData)
    } else {
      const idx = fclServiceOptions.value.findIndex(x => x.id === selectedFclId.value)
      if (idx !== -1) fclServiceOptions.value[idx] = itemData
    }
  }

  if (fclModalMode.value === 'create') {
    fclStatusFilter.value = 'all'
    fclSearch.value = ''
    fclCurrentPage.value = 1
    if (fclDataSection.value === 'locations') {
      fclLocationCountryFilter.value = 'all'
      fclLocationRegionFilter.value = 'all'
      fclLocationTypeFilter.value = 'all'
    } else if (fclDataSection.value === 'cargo') {
      fclCargoTypeFilter.value = 'all'
      fclCargoTempFilter.value = 'all'
      fclCargoDangerFilter.value = 'all'
    } else if (fclDataSection.value === 'shipping') {
      fclShippingGroupFilter.value = 'all'
    } else {
      fclServiceGroupFilter.value = 'all'
    }
  }

  persistFclData()
  setNotice('fcl', `Data ${fclModalMode.value === 'create' ? 'added' : 'updated'} successfully.`)
  closeFclModal()
}

const requestDeleteFcl = (section: FclDataSection, id: string, label: string) => {
  activeFclActionKey.value = ''
  fclDeleteTarget.value = { section, id, label }
}

const closeDeleteFclDialog = () => {
  fclDeleteTarget.value = null
}

const confirmDeleteFcl = () => {
  if (!fclDeleteTarget.value) return

  if (fclDeleteTarget.value.section === 'locations') {
    deleteFclLocation(fclDeleteTarget.value.id)
  } else if (fclDeleteTarget.value.section === 'cargo') {
    deleteFclCommodity(fclDeleteTarget.value.id)
  } else if (fclDeleteTarget.value.section === 'shipping') {
    deleteFclContainer(fclDeleteTarget.value.id)
  } else {
    deleteFclService(fclDeleteTarget.value.id)
  }

  fclDeleteTarget.value = null
}

const deleteFclLocation = (id: string) => {
  const item = fclLocations.value.find(x => x.id === id)
  if (item) {
    if (item.deleted) {
      fclLocations.value = fclLocations.value.filter(x => x.id !== id)
    } else {
      item.deleted = true
    }
    persistFclData()
  }
}

const deleteFclCommodity = (code: string) => {
  const item = fclCommodities.value.find(x => x.code === code)
  if (item) {
    if (item.deleted) {
      fclCommodities.value = fclCommodities.value.filter(x => x.code !== code)
    } else {
      item.deleted = true
    }
    persistFclData()
  }
}

const deleteFclContainer = (id: string) => {
  const item = fclContainers.value.find(x => x.id === id)
  if (item) {
    if (item.deleted) {
      fclContainers.value = fclContainers.value.filter(x => x.id !== id)
    } else {
      item.deleted = true
    }
    persistFclData()
  }
}

const deleteFclService = (id: string) => {
  const item = fclServiceOptions.value.find(x => x.id === id)
  if (item) {
    if (item.deleted) {
      fclServiceOptions.value = fclServiceOptions.value.filter(x => x.id !== id)
    } else {
      item.deleted = true
    }
    persistFclData()
  }
}

const syncLocationLabel = (item: FclLocationRecord) => {
  if (!item.label.trim()) item.label = item.city
  persistFclData()
}

const updateLocationKeywords = (item: FclLocationRecord, event: Event) => {
  const value = (event.target as HTMLInputElement).value
  item.keywords = value.split(',').map(keyword => keyword.trim()).filter(Boolean)
  persistFclData()
}

const sanitizeCommodityHsCode = (item: FclCommodityRecord) => {
  item.hsCode = item.hsCode.replace(/[^0-9]/g, '').slice(0, 6)
  persistFclData()
}

const filteredUsers = computed(() => {
  const query = accountSearch.value.trim().toLowerCase()

  return users.value.filter(user => {
    const haystack = [user.fullName, user.username, user.email, user.phone].filter(Boolean).join(' ').toLowerCase()
    const matchesSearch = !query || haystack.includes(query)
    const matchesRole = roleFilter.value === 'all' || user.role === roleFilter.value
    const matchesStatus = statusFilter.value === 'all' || (statusFilter.value === 'active' ? user.isActive : !user.isActive)

    return matchesSearch && matchesRole && matchesStatus
  })
})

const filteredFclLocations = computed(() => {
  const query = fclSearch.value.trim().toLowerCase()
  return fclLocations.value.filter(item => {
    const haystack = [
      item.id,
      item.type,
      item.city,
      item.region,
      item.country,
      item.countryCode,
      item.label,
      ...item.keywords
    ].join(' ').toLowerCase()
    const matchesSearch = !query || haystack.includes(query)
    
    if (fclStatusFilter.value === 'trashed') return item.deleted && matchesSearch
    if (item.deleted) return false

    const matchesCountry = fclLocationCountryFilter.value === 'all' || item.country === fclLocationCountryFilter.value
    const matchesRegion = fclLocationRegionFilter.value === 'all' || item.region === fclLocationRegionFilter.value
    const matchesType = fclLocationTypeFilter.value === 'all' || item.type === fclLocationTypeFilter.value
    const matchesStatus = fclStatusFilter.value === 'all' || (fclStatusFilter.value === 'enabled' ? item.enabled : !item.enabled)
    return matchesSearch && matchesCountry && matchesRegion && matchesType && matchesStatus
  })
})

const filteredFclCommodities = computed(() => {
  const query = fclSearch.value.trim().toLowerCase()
  return fclCommodities.value.filter(item => {
    const haystack = [item.code, item.name, item.hsCode, item.reefer ? 'reefer' : '', item.dangerous ? 'dangerous' : ''].join(' ').toLowerCase()
    const matchesSearch = !query || haystack.includes(query)

    if (fclStatusFilter.value === 'trashed') return item.deleted && matchesSearch
    if (item.deleted) return false

    const matchesType =
      fclCargoTypeFilter.value === 'all' ||
      (fclCargoTypeFilter.value === 'normal' && !item.reefer && !item.dangerous) ||
      (fclCargoTypeFilter.value === 'reefer' && item.reefer) ||
      (fclCargoTypeFilter.value === 'dangerous' && item.dangerous) ||
      (fclCargoTypeFilter.value === 'both' && item.reefer && item.dangerous)
    const matchesTemp = fclCargoTempFilter.value === 'all' || (fclCargoTempFilter.value === 'yes' ? item.reefer : !item.reefer)
    const matchesDanger = fclCargoDangerFilter.value === 'all' || (fclCargoDangerFilter.value === 'yes' ? item.dangerous : !item.dangerous)
    const matchesStatus = fclStatusFilter.value === 'all' || (fclStatusFilter.value === 'enabled' ? item.enabled : !item.enabled)
    return matchesSearch && matchesType && matchesTemp && matchesDanger && matchesStatus
  })
})

const filteredFclContainers = computed(() => {
  const query = fclSearch.value.trim().toLowerCase()
  return fclContainers.value.filter(item => {
    const haystack = [item.group, item.value, item.label, item.quoteOnly ? 'quote only' : '', item.hideWeight ? 'hide weight' : ''].join(' ').toLowerCase()
    const matchesSearch = !query || haystack.includes(query)
    
    if (fclStatusFilter.value === 'trashed') return item.deleted && matchesSearch
    if (item.deleted) return false

    const matchesGroup = fclShippingGroupFilter.value === 'all' || item.group === fclShippingGroupFilter.value
    const matchesStatus = fclStatusFilter.value === 'all' || (fclStatusFilter.value === 'enabled' ? item.enabled : !item.enabled)
    return matchesSearch && matchesGroup && matchesStatus
  })
})

const filteredFclServiceOptions = computed(() => {
  const query = fclSearch.value.trim().toLowerCase()
  return fclServiceOptions.value.filter(item => {
    const haystack = [item.id, item.group, item.label].join(' ').toLowerCase()
    const matchesSearch = !query || haystack.includes(query)

    if (item.deleted) return false

    const matchesGroup = fclServiceGroupFilter.value === 'all' || item.group === fclServiceGroupFilter.value
    const matchesStatus = fclStatusFilter.value === 'all' || (fclStatusFilter.value === 'enabled' ? item.enabled : !item.enabled)
    return matchesSearch && matchesGroup && matchesStatus
  })
})

const currentFclTotalRows = computed(() => {
  if (fclDataSection.value === 'locations') return filteredFclLocations.value.length
  if (fclDataSection.value === 'cargo') return filteredFclCommodities.value.length
  if (fclDataSection.value === 'shipping') return filteredFclContainers.value.length
  return filteredFclServiceOptions.value.length
})

const fclTotalPages = computed(() => Math.max(1, Math.ceil(currentFclTotalRows.value / fclPageSize.value)))
const fclPageStartIndex = computed(() => (fclCurrentPage.value - 1) * fclPageSize.value)
const fclPageStart = computed(() => currentFclTotalRows.value === 0 ? 0 : fclPageStartIndex.value + 1)
const fclPageEnd = computed(() => Math.min(currentFclTotalRows.value, fclPageStartIndex.value + fclPageSize.value))
const paginatedFclLocations = computed(() => filteredFclLocations.value.slice(fclPageStartIndex.value, fclPageEnd.value))
const paginatedFclCommodities = computed(() => filteredFclCommodities.value.slice(fclPageStartIndex.value, fclPageEnd.value))
const paginatedFclContainers = computed(() => filteredFclContainers.value.slice(fclPageStartIndex.value, fclPageEnd.value))
const paginatedFclServiceOptions = computed(() => filteredFclServiceOptions.value.slice(fclPageStartIndex.value, fclPageEnd.value))
const fclPageNumbers = computed(() => {
  const total = fclTotalPages.value
  const current = fclCurrentPage.value
  const start = Math.max(1, Math.min(current - 1, total - 2))
  return Array.from({ length: Math.min(3, total) }, (_, index) => start + index).filter(page => page <= total)
})

watch(
  [
    fclDataSection,
    fclSearch,
    fclLocationCountryFilter,
    fclLocationRegionFilter,
    fclLocationTypeFilter,
    fclCargoTypeFilter,
    fclCargoTempFilter,
    fclCargoDangerFilter,
    fclShippingGroupFilter,
    fclServiceGroupFilter,
    fclStatusFilter,
    fclPageSize
  ],
  () => {
    fclCurrentPage.value = 1
  }
)

watch(fclTotalPages, total => {
  if (fclCurrentPage.value > total) fclCurrentPage.value = total
})

const filteredRates = computed(() => {
  const query = fclSearch.value.trim().toLowerCase()
  return rates.value.filter(rate => {
    const haystack = [rate.origin, rate.destination, rate.carrier, rate.container, rate.status].join(' ').toLowerCase()
    return !query || haystack.includes(query)
  })
})

const filteredRoutes = computed(() => {
  const query = fclSearch.value.trim().toLowerCase()
  return routes.value.filter(route => {
    const haystack = [route.origin, route.destination, route.status].join(' ').toLowerCase()
    return !query || haystack.includes(query)
  })
})

const filteredServices = computed(() => {
  const query = fclSearch.value.trim().toLowerCase()
  return services.value.filter(service => {
    const haystack = [service.name, service.group, service.enabled ? 'enabled' : 'disabled'].join(' ').toLowerCase()
    return !query || haystack.includes(query)
  })
})

const cloneDefaults = () => ({
  rates: JSON.parse(JSON.stringify(defaultRates)) as FclRate[],
  routes: JSON.parse(JSON.stringify(defaultRoutes)) as FclRoute[],
  services: JSON.parse(JSON.stringify(defaultServices)) as FclService[]
})

const setNotice = (target: 'account' | 'fcl', message: string) => {
  if (target === 'account') {
    accountNotice.value = message
    window.setTimeout(() => { accountNotice.value = '' }, 2200)
    return
  }

  fclNotice.value = message
  window.setTimeout(() => { fclNotice.value = '' }, 2200)
}

const reloadAccounts = async () => {
  try {
    await adminStore.fetchAuthUsers()
  } catch {
    // Message is stored in adminStore.authUsersError.
  }
}

const resetAccountForm = () => {
  Object.assign(accountForm, {
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'USER',
    isActive: true
  })
  accountFormError.value = ''
}

const isDefaultAdmin = (user: AuthUser) => {
  return (
    String(user.username || '').toLowerCase() === 'admin' ||
    String(user.email || '').toLowerCase() === 'admin@shoptrans.com'
  )
}

const openCreateAccount = () => {
  selectedAccount.value = null
  accountModalMode.value = 'create'
  resetAccountForm()
  accountModalOpen.value = true
}

const openEditAccount = (user: AuthUser) => {
  if (isDefaultAdmin(user)) {
    setNotice('account', 'Default admin account is locked.')
    return
  }

  selectedAccount.value = user
  accountModalMode.value = 'edit'
  Object.assign(accountForm, {
    username: user.username || '',
    email: user.email || '',
    password: '',
    fullName: user.fullName || '',
    phone: user.phone || '',
    role: user.role,
    isActive: user.isActive
  })
  accountFormError.value = ''
  accountModalOpen.value = true
}

const closeAccountModal = () => {
  accountModalOpen.value = false
  selectedAccount.value = null
  resetAccountForm()
}

const validateAccountForm = () => {
  const missingFields = [
    !accountForm.fullName.trim() && 'Full name',
    !accountForm.username.trim() && 'Username',
    !accountForm.email.trim() && 'Email',
    accountModalMode.value === 'create' && !accountForm.password.trim() && 'Password'
  ].filter(Boolean)

  if (missingFields.length) {
    accountFormError.value = `${missingFields.join(', ')} is required.`
    return false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountForm.email.trim())) {
    accountFormError.value = 'Please enter a valid email address.'
    return false
  }

  if (accountModalMode.value === 'create' && accountForm.password.length < 6) {
    accountFormError.value = 'Password must be at least 6 characters.'
    return false
  }

  if (accountModalMode.value === 'edit' && accountForm.password.length > 0 && accountForm.password.length < 6) {
    accountFormError.value = 'New password must be at least 6 characters.'
    return false
  }

  accountFormError.value = ''
  return true
}

const saveAccountModal = async () => {
  if (!validateAccountForm()) return

  try {
    if (accountModalMode.value === 'create') {
      await adminStore.createAuthUser({
        username: accountForm.username.trim(),
        email: accountForm.email.trim(),
        password: accountForm.password,
        fullName: accountForm.fullName.trim(),
        phone: accountForm.phone.trim() || undefined,
        role: accountForm.role,
        isActive: accountForm.isActive
      })
      setNotice('account', 'Account created successfully.')
    } else if (selectedAccount.value) {
      if (isDefaultAdmin(selectedAccount.value)) {
        accountFormError.value = 'The default admin account cannot be edited.'
        return
      }

      await adminStore.updateAuthUser(selectedAccount.value.id, {
        fullName: accountForm.fullName.trim(),
        phone: accountForm.phone.trim() || undefined,
        role: accountForm.role,
        isActive: accountForm.isActive,
        ...(accountForm.password ? { password: accountForm.password } : {})
      })
      setNotice('account', 'Account updated successfully.')
    }

    closeAccountModal()
  } catch (error: any) {
    accountFormError.value = error?.response?.data?.message || error?.message || 'Could not save account.'
    // Message is stored in adminStore.authUsersError.
  }
}

const accountInitials = (user: AuthUser) => {
  const source = user.fullName || user.username || user.email || 'AC'
  const parts = source.trim().split(/\s+/).filter(Boolean)
  if (parts.length > 1) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

const formatDateTime = (value?: string | null) => {
  if (!value) return 'Never'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value || 'Not set'
  return date.toLocaleDateString('en-GB')
}

const formatMoney = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount || 0))
}

const loadFclData = () => {
  const defaults = cloneDefaults()
  const pageDefaults = cloneFclPageDefaults()

  if (!process.client) {
    rates.value = defaults.rates
    routes.value = defaults.routes
    services.value = defaults.services
    fclLocations.value = pageDefaults.locations
    fclCommodities.value = pageDefaults.commodities
    fclCargoOptions.value = pageDefaults.cargoOptions
    fclContainers.value = pageDefaults.containers
    fclShippingOptions.value = pageDefaults.shippingOptions
    fclServiceOptions.value = pageDefaults.serviceOptions
    return
  }

  try {
    const saved = window.localStorage.getItem(FCL_STORAGE_KEY)
    if (!saved) {
      rates.value = defaults.rates
      routes.value = defaults.routes
      services.value = defaults.services
    } else {
      const parsed = JSON.parse(saved)
      rates.value = Array.isArray(parsed.rates) ? parsed.rates : defaults.rates
      routes.value = Array.isArray(parsed.routes) ? parsed.routes : defaults.routes
      services.value = Array.isArray(parsed.services) ? parsed.services : defaults.services
    }
  } catch {
    rates.value = defaults.rates
    routes.value = defaults.routes
    services.value = defaults.services
  }

  try {
    const savedPageData = window.localStorage.getItem(FCL_PAGE_STORAGE_KEY)
    if (!savedPageData) {
      fclLocations.value = pageDefaults.locations
      fclCommodities.value = pageDefaults.commodities
      fclCargoOptions.value = pageDefaults.cargoOptions
      fclContainers.value = pageDefaults.containers
      fclShippingOptions.value = pageDefaults.shippingOptions
      fclServiceOptions.value = pageDefaults.serviceOptions
      return
    }

    const parsed = JSON.parse(savedPageData)
    fclLocations.value = Array.isArray(parsed.locations) ? parsed.locations : pageDefaults.locations
    fclCommodities.value = Array.isArray(parsed.commodities) ? parsed.commodities : pageDefaults.commodities
    fclCargoOptions.value = Array.isArray(parsed.cargoOptions) ? parsed.cargoOptions : pageDefaults.cargoOptions
    fclContainers.value = Array.isArray(parsed.containers) ? parsed.containers : pageDefaults.containers
    fclShippingOptions.value = Array.isArray(parsed.shippingOptions) ? parsed.shippingOptions : pageDefaults.shippingOptions
    fclServiceOptions.value = Array.isArray(parsed.serviceOptions) ? parsed.serviceOptions : pageDefaults.serviceOptions
  } catch {
    fclLocations.value = pageDefaults.locations
    fclCommodities.value = pageDefaults.commodities
    fclCargoOptions.value = pageDefaults.cargoOptions
    fclContainers.value = pageDefaults.containers
    fclShippingOptions.value = pageDefaults.shippingOptions
    fclServiceOptions.value = pageDefaults.serviceOptions
  }
}

const persistFclData = () => {
  if (!process.client) return

  window.localStorage.setItem(FCL_PAGE_STORAGE_KEY, JSON.stringify({
    locations: fclLocations.value,
    commodities: fclCommodities.value,
    cargoOptions: fclCargoOptions.value,
    containers: fclContainers.value,
    shippingOptions: fclShippingOptions.value,
    serviceOptions: fclServiceOptions.value
  }))
  setNotice('fcl', 'FCL data saved.')
}

const triggerFclImport = () => {
  fclImportInput.value?.click()
}

const exportFclExcel = () => {
  const workbook = XLSX.utils.book_new()
  const appendSheet = (name: string, rows: Record<string, any>[]) => {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), name)
  }

  appendSheet('Locations', fclLocations.value.map(item => ({
    ID: item.id,
    Type: item.type,
    Country: item.country,
    Region: item.region,
    City: item.city,
    Label: item.label,
    'Country Code': item.countryCode,
    Keywords: item.keywords.join(', '),
    Enabled: item.enabled ? 'Yes' : 'No'
  })))
  appendSheet('Commodities', fclCommodities.value.map(item => ({
    Code: item.code,
    Commodity: item.name,
    'HS Code': item.hsCode,
    Reefer: item.reefer ? 'Yes' : 'No',
    Dangerous: item.dangerous ? 'Yes' : 'No',
    Enabled: item.enabled ? 'Yes' : 'No'
  })))
  appendSheet('Cargo Options', fclCargoOptions.value.map(item => ({
    ID: item.id,
    Group: item.group,
    Label: item.label,
    Enabled: item.enabled ? 'Yes' : 'No'
  })))
  appendSheet('Containers', fclContainers.value.map(item => ({
    ID: item.id,
    Group: item.group,
    Value: item.value,
    Label: item.label,
    'Quote Only': item.quoteOnly ? 'Yes' : 'No',
    'Hide Weight': item.hideWeight ? 'Yes' : 'No',
    Enabled: item.enabled ? 'Yes' : 'No'
  })))
  appendSheet('Shipping Options', fclShippingOptions.value.map(item => ({
    ID: item.id,
    Group: item.group,
    Label: item.label,
    Enabled: item.enabled ? 'Yes' : 'No'
  })))
  appendSheet('Service Options', fclServiceOptions.value.map(item => ({
    ID: item.id,
    Group: item.group,
    Label: item.label,
    Enabled: item.enabled ? 'Yes' : 'No'
  })))

  XLSX.writeFile(workbook, `shoptrans-fcl-data-${new Date().toISOString().slice(0, 10)}.xlsx`)
  setNotice('fcl', 'FCL data exported to Excel.')
}

const normalizeExcelKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const readExcelCell = (row: Record<string, any>, aliases: string[]) => {
  const normalizedAliases = aliases.map(normalizeExcelKey)
  const key = Object.keys(row).find(item => normalizedAliases.includes(normalizeExcelKey(item)))
  return key ? row[key] : ''
}

const readExcelString = (row: Record<string, any>, aliases: string[], fallback = '') => {
  const value = readExcelCell(row, aliases)
  return value === undefined || value === null ? fallback : String(value).trim()
}

const readExcelBoolean = (row: Record<string, any>, aliases: string[], fallback = false) => {
  const value = readExcelCell(row, aliases)
  if (value === undefined || value === null || value === '') return fallback
  const normalized = String(value).trim().toLowerCase()
  return ['1', 'true', 'yes', 'y', 'active', 'enabled'].includes(normalized)
}

const readExcelKeywords = (row: Record<string, any>) => {
  return readExcelString(row, ['Keywords', 'Keyword'])
    .split(',')
    .map(keyword => keyword.trim())
    .filter(Boolean)
}

const getExcelRows = (workbook: XLSX.WorkBook, names: string[], csvSection?: FclDataSection) => {
  const normalizedNames = names.map(normalizeExcelKey)
  const sheetName = workbook.SheetNames.find(name => normalizedNames.includes(normalizeExcelKey(name)))

  if (sheetName) {
    return XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[sheetName], { defval: '' })
  }

  if (workbook.SheetNames.length === 1 && csvSection && csvSection === fclDataSection.value) {
    return XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[workbook.SheetNames[0]], { defval: '' })
  }

  return null
}

const importFclExcel = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    const locationRows = getExcelRows(workbook, ['Locations', 'Location details'], 'locations')
    const commodityRows = getExcelRows(workbook, ['Commodities', 'Cargo', 'What do you want to ship'], 'cargo')
    const cargoOptionRows = getExcelRows(workbook, ['Cargo Options'])
    const containerRows = getExcelRows(workbook, ['Containers', 'Shipping', 'How will your cargo be shipped'], 'shipping')
    const shippingOptionRows = getExcelRows(workbook, ['Shipping Options'])
    const serviceOptionRows = getExcelRows(workbook, ['Service Options', 'Services', 'Please choose services range'], 'services')

    if (locationRows) {
      fclLocations.value = locationRows.map((row, index) => ({
        id: readExcelString(row, ['ID'], `LOC-${index + 1}`),
        type: readExcelString(row, ['Type'], 'port'),
        country: readExcelString(row, ['Country']),
        region: readExcelString(row, ['Region']),
        city: readExcelString(row, ['City', 'Port', 'Location', 'From/To Port / Location']),
        label: readExcelString(row, ['Label', 'Display Label'], readExcelString(row, ['City', 'Port', 'Location', 'From/To Port / Location'])),
        countryCode: readExcelString(row, ['Country Code', 'Code']),
        keywords: readExcelKeywords(row),
        enabled: readExcelBoolean(row, ['Enabled', 'Status'], true)
      }))
    }

    if (commodityRows) {
      fclCommodities.value = commodityRows.map((row, index) => ({
        code: readExcelString(row, ['Code'], `COM-${index + 1}`),
        name: readExcelString(row, ['Commodity', 'Name']),
        hsCode: readExcelString(row, ['HS Code', 'HS']),
        reefer: readExcelBoolean(row, ['Reefer', 'Temp Control'], false),
        dangerous: readExcelBoolean(row, ['Dangerous'], false),
        enabled: readExcelBoolean(row, ['Enabled', 'Status'], true)
      }))
    }

    if (cargoOptionRows) {
      fclCargoOptions.value = cargoOptionRows.map((row, index) => ({
        id: readExcelString(row, ['ID'], `cargo-option-${index + 1}`),
        group: readExcelString(row, ['Group'], 'Cargo flags'),
        label: readExcelString(row, ['Label', 'Name']),
        enabled: readExcelBoolean(row, ['Enabled', 'Status'], true)
      }))
    }

    if (containerRows) {
      fclContainers.value = containerRows.map((row, index) => ({
        id: readExcelString(row, ['ID'], `container-${index + 1}`),
        group: readExcelString(row, ['Group'], 'GENERAL PURPOSE'),
        value: readExcelString(row, ['Value', 'Container']),
        label: readExcelString(row, ['Label', 'Container Type & Size'], readExcelString(row, ['Value', 'Container'])),
        quoteOnly: readExcelBoolean(row, ['Quote Only'], false),
        hideWeight: readExcelBoolean(row, ['Hide Weight'], false),
        enabled: readExcelBoolean(row, ['Enabled', 'Status'], true)
      }))
    }

    if (shippingOptionRows) {
      fclShippingOptions.value = shippingOptionRows.map((row, index) => ({
        id: readExcelString(row, ['ID'], `shipping-option-${index + 1}`),
        group: readExcelString(row, ['Group'], 'Container controls'),
        label: readExcelString(row, ['Label', 'Name']),
        enabled: readExcelBoolean(row, ['Enabled', 'Status'], true)
      }))
    }

    if (serviceOptionRows) {
      fclServiceOptions.value = serviceOptionRows.map((row, index) => ({
        id: readExcelString(row, ['ID'], `service-option-${index + 1}`),
        group: readExcelString(row, ['Group'], 'AT ORIGIN'),
        label: readExcelString(row, ['Label', 'Name', 'Service name']),
        enabled: readExcelBoolean(row, ['Enabled', 'Status'], true)
      }))
    }

    persistFclData()
    resetFclFilters()
    setNotice('fcl', 'FCL data imported from Excel.')
  } catch (error: any) {
    setNotice('fcl', error?.message || 'Could not import FCL Excel data.')
  } finally {
    input.value = ''
  }
}

const resetFclData = () => {
  const defaults = cloneFclPageDefaults()
  fclLocations.value = defaults.locations
  fclCommodities.value = defaults.commodities
  fclCargoOptions.value = defaults.cargoOptions
  fclContainers.value = defaults.containers
  fclShippingOptions.value = defaults.shippingOptions
  fclServiceOptions.value = defaults.serviceOptions
  persistFclData()
}

const clearRateForm = () => {
  editingRateId.value = ''
  rateError.value = ''
  Object.assign(rateForm, {
    origin: '',
    destination: '',
    carrier: '',
    container: '40HC',
    amount: 0,
    currency: 'USD',
    validUntil: '',
    status: 'DRAFT'
  })
}

const saveRate = () => {
  rateError.value = ''

  if (!rateForm.origin.trim() || !rateForm.destination.trim() || !rateForm.carrier.trim()) {
    rateError.value = 'Origin, destination, and carrier are required.'
    return
  }

  const payload: FclRate = {
    id: editingRateId.value || `rate-${Date.now()}`,
    origin: rateForm.origin.trim(),
    destination: rateForm.destination.trim(),
    carrier: rateForm.carrier.trim().toUpperCase(),
    container: rateForm.container,
    amount: Number(rateForm.amount || 0),
    currency: rateForm.currency,
    validUntil: rateForm.validUntil,
    status: rateForm.status
  }

  if (editingRateId.value) {
    const index = rates.value.findIndex(rate => rate.id === editingRateId.value)
    if (index >= 0) rates.value[index] = payload
  } else {
    rates.value.unshift(payload)
  }

  persistFclData()
  clearRateForm()
}

const editRate = (rate: FclRate) => {
  editingRateId.value = rate.id
  Object.assign(rateForm, {
    origin: rate.origin,
    destination: rate.destination,
    carrier: rate.carrier,
    container: rate.container,
    amount: rate.amount,
    currency: rate.currency,
    validUntil: rate.validUntil,
    status: rate.status
  })
}

const deleteRate = (id: string) => {
  rates.value = rates.value.filter(rate => rate.id !== id)
  if (editingRateId.value === id) clearRateForm()
  persistFclData()
}

const addRoute = () => {
  const origin = routeForm.origin.trim()
  const destination = routeForm.destination.trim()
  if (!origin || !destination) return

  routes.value.unshift({
    id: `route-${Date.now()}`,
    origin,
    destination,
    status: routeForm.status
  })

  routeForm.origin = ''
  routeForm.destination = ''
  routeForm.status = 'OPEN'
  persistFclData()
}

const deleteRoute = (id: string) => {
  routes.value = routes.value.filter(route => route.id !== id)
  persistFclData()
}

onMounted(() => {
  loadFclData()
  reloadAccounts()
})
</script>

<style scoped>
.admin-page {
  --ink: #0f172a;
  --muted: #64748b;
  --line: #e2e8f0;
  --surface: #ffffff;
  --bg: #f8fafc;
  --green: #16a34a;
  --green-dark: #15803d;
  --green-soft: #f0fdf4;
  --blue: #2563eb;
  --blue-soft: #eff6ff;
  --amber: #d97706;
  --amber-soft: #fffbeb;
  --red: #dc2626;
  --red-soft: #fef2f2;

  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Geist', system-ui, sans-serif;
}

.admin-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 22px 18px;
  background: #ffffff;
  border-right: 1px solid var(--line);
  box-shadow: 10px 0 30px rgba(15, 23, 42, .04);
  z-index: 20;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 4px 16px;
  border-bottom: 1px solid #edf2f7;
}

.sidebar-brand > span {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: var(--green);
  color: #fff;
  font-weight: 850;
}

.sidebar-brand strong,
.sidebar-brand small,
.sidebar-item strong,
.sidebar-item small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-brand strong {
  font-size: 16px;
  line-height: 1.25;
}

.sidebar-brand small {
  margin-top: 2px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.sidebar-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-label {
  margin: 0 8px 6px;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.sidebar-item {
  width: 100%;
  min-height: 62px;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background .15s, border-color .15s, color .15s;
}

.sidebar-item:hover {
  background: #f8fafc;
  border-color: var(--line);
  color: var(--ink);
}

.sidebar-item.active {
  background: var(--green-soft);
  border-color: #bbf7d0;
  color: var(--green-dark);
}

.sidebar-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #f1f5f9;
  color: #64748b;
}

.sidebar-icon svg {
  width: 18px;
  height: 18px;
}

.sidebar-item.active .sidebar-icon {
  background: #dcfce7;
  color: var(--green-dark);
}

.sidebar-chevron {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  color: var(--muted);
  transition: transform .16s ease, color .16s ease;
}

.sidebar-chevron svg {
  width: 15px;
  height: 15px;
}

.sidebar-chevron.open {
  color: var(--green-dark);
  transform: rotate(90deg);
}

.sidebar-children {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 48px;
  padding-left: 10px;
  border-left: 1px solid #e2e8f0;
}

.sidebar-children button {
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  text-align: left;
  cursor: pointer;
  padding: 0 10px;
}

.sidebar-children button:hover,
.sidebar-children button.active {
  background: #f0fdf4;
  color: var(--green-dark);
}

.sidebar-children small {
  color: inherit;
  font-size: 11px;
  font-weight: 850;
}

.sidebar-item strong {
  color: var(--ink);
  font-size: 14px;
  line-height: 1.25;
}

.sidebar-item small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 650;
}

.sidebar-user {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 34px;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding: 14px 4px 0;
  border-top: 1px solid #e2e8f0;
}

.sidebar-avatar {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #f1f5f9;
  color: var(--ink);
  font-weight: 850;
}

.sidebar-user strong,
.sidebar-user small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-user strong {
  color: var(--ink);
  font-size: 13px;
}

.sidebar-user small {
  margin-top: 3px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
}

.sidebar-logout {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
}

.sidebar-logout:hover {
  background: var(--red-soft);
  color: var(--red);
}

.sidebar-logout svg {
  width: 16px;
  height: 16px;
}

.admin-main {
  min-height: 100vh;
  margin-left: 280px;
  padding: 28px;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.section-head.compact {
  margin-bottom: 14px;
}

.section-head p {
  margin: 0 0 6px;
  color: var(--green-dark);
  font-size: 12px;
  font-weight: 850;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.section-head h1 {
  margin: 0;
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1;
  letter-spacing: 0;
}

.toolbar,
.form-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.primary-btn,
.ghost-btn,
.line-btn,
.edit-row-btn,
.text-btn {
  min-height: 40px;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0 14px;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

.primary-btn {
  background: var(--green);
  border-color: var(--green);
  color: #fff;
}

.primary-btn:hover:not(:disabled) {
  background: var(--green-dark);
  border-color: var(--green-dark);
}

.primary-btn.slim,
.line-btn {
  min-height: 36px;
}

.ghost-btn {
  background: #fff;
  border-color: var(--line);
  color: var(--ink);
}

.line-btn {
  background: var(--green-soft);
  border-color: #bbf7d0;
  color: var(--green-dark);
}

.edit-row-btn {
  width: 34px;
  min-height: 34px;
  display: inline-grid;
  place-items: center;
  padding: 0;
  background: var(--ink);
  border-color: var(--ink);
  color: #fff;
}

.edit-row-btn svg {
  width: 15px;
  height: 15px;
}

.text-btn {
  min-height: 30px;
  padding: 0 8px;
  background: transparent;
  color: var(--blue);
}

.text-btn.danger {
  color: var(--red);
}

button:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.metric-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.metric,
.overview-panel,
.workbench {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, .04);
}

.metric {
  padding: 16px;
}

.metric span {
  display: block;
  color: var(--muted);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .07em;
  text-transform: uppercase;
}

.metric strong {
  display: block;
  margin-top: 8px;
  font-size: 28px;
  line-height: 1;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.overview-panel {
  padding: 16px;
}

.overview-panel.wide {
  min-width: 0;
}

.summary-list,
.mini-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-list div,
.mini-row,
.service-row {
  border: 1px solid #edf2f7;
  border-radius: 8px;
  background: #fbfdff;
}

.summary-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
}

.summary-list span {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

.summary-list strong {
  font-size: 18px;
}

.mini-row {
  min-height: 58px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
}

.mini-row em {
  color: var(--green-dark);
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
  white-space: nowrap;
}

.mini-row em.off {
  color: var(--red);
}

.route-dot {
  min-width: 44px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: var(--blue-soft);
  color: var(--blue);
  font-size: 11px;
  font-weight: 850;
}

.subtabs {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: #eef2f7;
  border: 1px solid var(--line);
  border-radius: 8px;
}

.subtabs button {
  min-width: 110px;
  height: 36px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

.subtabs button.active {
  background: #fff;
  color: var(--ink);
  box-shadow: 0 1px 2px rgba(15, 23, 42, .08);
}

.workbench {
  padding: 16px;
}

.toolbar {
  justify-content: space-between;
  margin-bottom: 14px;
}

.search-box {
  flex: 1 1 320px;
  min-width: 240px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  padding: 0 12px;
}

.search-box svg {
  width: 16px;
  height: 16px;
  color: #94a3b8;
}

.search-box input,
.toolbar select,
.field input,
.field select,
.editor-form input,
.editor-form select,
.quick-form input,
.quick-form select {
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--ink);
  font: inherit;
  font-size: 13px;
  outline: none;
}

.search-box input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  appearance: none;
  -webkit-appearance: none;
}

.search-box:focus-within {
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, .12);
}

.toolbar select,
.field select {
  padding: 0 10px;
}

.field input,
.field select,
.editor-form input,
.editor-form select,
.quick-form input,
.quick-form select {
  width: 100%;
  padding: 0 10px;
}

input:focus,
select:focus {
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, .12);
}

.search-box input:focus {
  border-color: transparent;
  box-shadow: none;
}

.notice {
  margin-bottom: 14px;
  border-radius: 8px;
  padding: 11px 13px;
  font-size: 13px;
  font-weight: 750;
}

.notice.success {
  background: var(--green-soft);
  color: var(--green-dark);
  border: 1px solid #bbf7d0;
}

.notice.error {
  background: var(--red-soft);
  color: var(--red);
  border: 1px solid #fecaca;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 8px;
}

.table-wrap.compact {
  margin-top: 12px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 920px;
}

.admin-table th,
.admin-table td {
  padding: 13px 14px;
  border-bottom: 1px solid #edf2f7;
  text-align: left;
  vertical-align: middle;
  font-size: 13px;
}

.admin-table th {
  color: #64748b;
  background: #f8fafc;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.admin-table tbody tr:last-child td {
  border-bottom: 0;
}

.actions-col {
  text-align: right !important;
  white-space: nowrap;
}

.account-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--green-soft);
  border: 1px solid #bbf7d0;
  color: var(--green-dark);
  font-size: 12px;
  font-weight: 850;
  flex: 0 0 auto;
}

.account-cell strong,
.stacked strong,
.mini-row strong {
  display: block;
  color: var(--ink);
  line-height: 1.35;
}

.account-cell small,
.stacked small,
.mini-row small,
.service-row small {
  display: block;
  margin-top: 2px;
  color: var(--muted);
  font-size: 12px;
}

.role-badge,
.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: .04em;
}

.role-badge.admin {
  background: var(--blue-soft);
  color: var(--blue);
}

.role-badge.user {
  background: var(--green-soft);
  color: var(--green-dark);
}

.status-pill {
  background: var(--green-soft);
  color: var(--green-dark);
}

.status-pill.off {
  background: var(--red-soft);
  color: var(--red);
}

.status-pill.live,
.status-pill.open {
  background: var(--green-soft);
  color: var(--green-dark);
}

.status-pill.draft {
  background: var(--blue-soft);
  color: var(--blue);
}

.status-pill.paused {
  background: var(--amber-soft);
  color: var(--amber);
}

.status-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink);
  font-size: 12px;
  font-weight: 700;
}

.status-toggle input {
  width: 15px;
  height: 15px;
  accent-color: var(--green);
}

.sr-only-file {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.empty-row,
.empty-block {
  color: var(--muted);
  text-align: center !important;
  padding: 28px !important;
}

.page-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
  padding: 12px;
  border: 1px solid #edf2f7;
  border-radius: 8px;
  background: #fbfdff;
}

.page-header-row strong,
.coming-panel strong {
  display: block;
  color: var(--ink);
  font-size: 15px;
  line-height: 1.25;
}

.page-header-row span {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.page-tabs {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #eef2f7;
}

.page-tabs button {
  min-width: 92px;
  height: 34px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  padding: 0 10px;
}

.page-tabs button.active {
  background: #fff;
  color: var(--ink);
  box-shadow: 0 1px 2px rgba(15, 23, 42, .08);
}

.fcl-data-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.fcl-data-tabs button {
  min-height: 70px;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--muted);
  font: inherit;
  text-align: left;
  cursor: pointer;
  padding: 12px;
}

.fcl-data-tabs button.active {
  border-color: #99f6e4;
  background: var(--green-soft);
  color: var(--green-dark);
}

.fcl-data-tabs strong {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e2e8f0;
  color: #475569;
  font-size: 12px;
}

.fcl-data-tabs button.active strong {
  background: var(--green);
  color: #fff;
}

.fcl-data-tabs span {
  min-width: 0;
  overflow: hidden;
  color: var(--ink);
  font-size: 13px;
  font-weight: 850;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fcl-data-tabs small {
  grid-column: 2;
  color: inherit;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.dataset-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 12px;
}

.dataset-toolbar > div:first-child {
  min-width: 0;
}

.dataset-toolbar strong {
  display: block;
  color: var(--ink);
  font-size: 15px;
  line-height: 1.25;
}

.dataset-toolbar span {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.dataset-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex: 1 1 560px;
  flex-wrap: wrap;
}

.compact-search {
  flex: 1 1 320px;
  max-width: 560px;
}

.dataset-actions select,
.pagination-bar select {
  height: 40px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--ink);
  font: inherit;
  font-size: 13px;
  outline: none;
  padding: 0 10px;
}

.full-panel {
  padding: 12px;
}

.data-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.data-stats div,
.option-row {
  border: 1px solid #edf2f7;
  border-radius: 8px;
  background: #fbfdff;
}

.data-stats div {
  padding: 12px 14px;
}

.data-stats span {
  display: block;
  color: var(--muted);
  font-size: 11px;
  font-weight: 850;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.data-stats strong {
  display: block;
  margin-top: 6px;
  color: var(--ink);
  font-size: 22px;
  line-height: 1;
}

.option-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 8px;
  margin: 10px 0 14px;
}

.option-row {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px;
}

.option-row strong {
  display: block;
  color: var(--ink);
  font-size: 12px;
  line-height: 1.3;
}

.option-row small {
  display: block;
  margin-top: 2px;
  color: var(--muted);
  font-size: 10.5px;
  font-weight: 700;
}

.data-table {
  min-width: 1180px;
}

.data-table td {
  max-width: 320px;
  overflow-wrap: anywhere;
}

.grid-wrap {
  background: #fff;
}

.grid-wrap .admin-table th {
  position: sticky;
  top: 0;
  z-index: 1;
}

.grid-input {
  width: 100%;
  min-width: 100px;
  min-height: 34px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 13px;
  outline: none;
  padding: 6px 8px;
  transition: all 0.2s ease;
}

.grid-input:hover {
  background: rgba(15, 23, 42, 0.03);
  border-color: #e2e8f0;
}

.grid-input:focus {
  background: #fff;
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
}

.grid-input.subtle {
  margin-top: 4px;
  color: var(--muted);
  font-size: 12px;
}

.stacked-input {
  display: flex;
  flex-direction: column;
}

.wide-input {
  min-width: 260px;
}

.grid-check {
  width: 18px;
  height: 18px;
  accent-color: var(--green);
  cursor: pointer;
}

.data-row {
  transition: background-color 0.15s;
}

.data-row:hover {
  background-color: #f8fafc;
}

.col-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.col-header.center {
  align-items: center;
}

.header-filter {
  width: 100%;
  height: 28px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  color: var(--ink);
  font-size: 11px;
  font-weight: 600;
  padding: 0 6px;
  outline: none;
  transition: all 0.2s;
}

.header-filter:focus {
  border-color: var(--green);
  box-shadow: 0 0 0 2px rgba(22, 163, 74, .12);
}

.status-col {
  width: 80px;
  text-align: center !important;
}

.center {
  text-align: center !important;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: inline-grid;
  place-items: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.status-btn {
  color: var(--red);
  background: var(--red-soft);
}

.status-btn:hover {
  background: #fecaca;
}

.status-btn.is-active {
  color: var(--green-dark);
  background: var(--green-soft);
}

.status-btn.is-active:hover {
  background: #dcfce7;
}

.action-buttons {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.edit-btn {
  color: var(--blue);
  background: var(--blue-soft);
}

.edit-btn:hover {
  background: #dbeafe;
}

.stacked-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stacked-text strong {
  color: var(--ink);
  font-weight: 700;
  font-size: 13px;
}

.stacked-text small {
  color: var(--muted);
  font-size: 12px;
}

.data-row td {
  color: var(--ink);
  font-size: 13px;
}

.data-row td strong {
  font-weight: 700;
}

.danger-btn {
  color: var(--muted);
}

.danger-btn:hover {
  color: var(--red);
  background: var(--red-soft);
}

.pagination-bar {
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  border: 1px solid var(--line);
  border-top: 0;
  border-radius: 0 0 8px 8px;
  background: #fbfdff;
  padding: 8px 10px;
}

.pagination-bar span,
.pagination-bar strong {
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.mono-cell {
  font-family: 'Geist Mono', 'Consolas', monospace;
  font-size: 12px;
}

.coming-panel {
  min-height: 320px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  background: #fbfdff;
  text-align: center;
  padding: 28px;
}

.coming-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: var(--green-soft);
  color: var(--green-dark);
}

.coming-icon svg {
  width: 24px;
  height: 24px;
}

.coming-panel p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

.fcl-grid {
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  gap: 16px;
}

.editor-panel,
.data-panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
}

.editor-panel {
  padding: 16px;
}

.data-panel {
  padding: 14px;
  min-width: 0;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.panel-head h2 {
  margin: 0;
  font-size: 17px;
}

.panel-head span {
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  border-radius: 999px;
  background: #f1f5f9;
  color: var(--muted);
  font-size: 11px;
  font-weight: 850;
}

.editor-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.editor-form label,
.quick-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.editor-form label span {
  color: #94a3b8;
  font-size: 11px;
  font-weight: 850;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.two-cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.form-error {
  margin: 0;
  color: var(--red);
  font-size: 12px;
  font-weight: 750;
}

.quick-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 130px auto;
  gap: 10px;
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.service-row {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 14px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, .38);
}

.account-dialog {
  width: min(720px, 100%);
  max-height: min(760px, calc(100vh - 48px));
  overflow: auto;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, .22);
}

.modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px 16px;
  border-bottom: 1px solid var(--line);
}

.modal-head p {
  margin: 0 0 6px;
  color: var(--green-dark);
  font-size: 11px;
  font-weight: 850;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.modal-head h2 {
  margin: 0;
  font-size: 24px;
  line-height: 1.1;
}

.icon-btn {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--muted);
  cursor: pointer;
}

.icon-btn:hover {
  color: var(--ink);
  border-color: #cbd5e1;
}

.icon-btn svg {
  width: 17px;
  height: 17px;
}

.modal-form {
  padding: 18px 22px 22px;
}

.detail-strip {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 6px 12px;
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid #edf2f7;
  border-radius: 8px;
  background: #fbfdff;
}

.detail-strip span {
  color: var(--muted);
  font-size: 11px;
  font-weight: 850;
  text-transform: uppercase;
}

.detail-strip strong {
  min-width: 0;
  color: var(--ink);
  font-size: 12px;
  overflow-wrap: anywhere;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field span {
  color: var(--muted);
  font-size: 11px;
  font-weight: 850;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.field input:disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.switch-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: var(--ink);
  font-size: 13px;
  font-weight: 750;
}

.switch-row input {
  width: 18px;
  height: 18px;
  accent-color: var(--green);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.page-workbench {
  padding: 0;
  overflow: visible;
  background: #f8fafc;
  border: 0;
  box-shadow: none;
}

.fcl-shell {
  overflow: visible;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, .06);
}

.fcl-shell .notice {
  margin: 0 20px 14px;
}

.fcl-data-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  margin: 0;
  border-bottom: 1px solid #e2e8f0;
}

.fcl-data-tabs button {
  position: relative;
  min-height: 72px;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  border: 0;
  border-right: 1px solid #eef2f7;
  border-radius: 0;
  background: #fff;
  color: var(--muted);
  padding: 14px 22px;
}

.fcl-data-tabs button::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  background: transparent;
}

.fcl-data-tabs button.active {
  background: linear-gradient(90deg, #fff 0%, #f0fdf4 100%);
  color: var(--green-dark);
}

.fcl-data-tabs button.active::after {
  background: var(--green);
}

.fcl-data-tabs button.done strong,
.fcl-data-tabs button.active strong {
  background: var(--green);
  color: #fff;
}

.fcl-data-tabs strong {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #eef2f7;
  color: #334155;
}

.fcl-data-tabs strong svg {
  width: 16px;
  height: 16px;
}

.fcl-data-tabs span {
  font-size: 13px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fcl-data-tabs small {
  grid-column: 2;
  color: #2563eb;
  font-size: 11px;
}

.dataset-toolbar {
  padding: 22px 20px 12px;
  margin: 0;
}

.dataset-toolbar h1 {
  margin: 0;
  color: var(--ink);
  font-size: 24px;
  line-height: 1.1;
}

.dataset-toolbar span {
  max-width: 760px;
  margin-top: 7px;
  font-size: 13px;
}

.dataset-actions {
  flex: 0 0 auto;
}

.icon-text-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 112px;
  background: #fff;
}

.icon-text-btn svg,
.square-btn svg {
  width: 16px;
  height: 16px;
}

.square-btn {
  width: 46px;
  min-width: 46px;
  padding: 0;
}

/* ── FCL Filter Bar ──────────────────────────────────── */
.fcl-filterbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 0 20px 14px;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  flex-wrap: wrap;
}

.fcl-filterbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 0;
  min-width: 0;
  flex-wrap: wrap;
}

.fcl-filterbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.fcl-filterbar-search {
  flex: 1 1 240px;
  max-width: 320px;
  min-width: 180px;
  height: 36px;
}

.filterbar-select {
  height: 36px;
  border: 1px solid #dbe3ef;
  border-radius: 7px;
  background: #f8fafc;
  color: var(--ink);
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  padding: 0 10px;
  outline: none;
  cursor: pointer;
  transition: border-color .15s, background .15s;
}

.filterbar-select:focus {
  border-color: var(--green);
  background: #fff;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, .1);
}

.filterbar-clear {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 36px;
  border: 1px solid #fecaca;
  border-radius: 7px;
  background: var(--red-soft);
  color: var(--red);
  font: inherit;
  font-size: 12px;
  font-weight: 750;
  padding: 0 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: background .15s;
}

.filterbar-clear:hover {
  background: #fecaca;
}

.filterbar-clear svg {
  width: 13px;
  height: 13px;
}

.filterbar-toggle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  border: 1px solid #dbe3ef;
  border-radius: 7px;
  background: #fff;
  color: var(--ink);
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  padding: 0 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: all .15s;
}

.filterbar-toggle:hover {
  border-color: #bbf7d0;
  background: var(--green-soft);
  color: var(--green-dark);
}

.filterbar-toggle.active {
  border-color: #bbf7d0;
  background: var(--green-soft);
  color: var(--green-dark);
}

.filterbar-toggle svg {
  width: 15px;
  height: 15px;
}

.filter-count {
  min-width: 20px;
  height: 20px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: var(--green);
  color: #fff;
  font-size: 11px;
  font-weight: 900;
}

.filters-btn {
  min-height: 44px;
  min-width: 0;
}

.filters-btn.active {
  border-color: #bbf7d0;
  background: var(--green-soft);
  color: var(--green-dark);
}

.table-filters-btn {
  min-height: 40px;
  min-width: 132px;
  margin-right: auto;
  background: #fff;
}

.table-filter-row th {
  height: auto;
  padding-top: 8px;
  padding-bottom: 8px;
  background: #fff;
  text-transform: none;
  letter-spacing: 0;
}

.grid-wrap .admin-table .table-filter-row th {
  top: 44px;
  z-index: 2;
  background: #fff;
}

.header-filter-stack {
  display: grid;
  gap: 6px;
}

.table-filter-row .header-filter {
  height: 32px;
  min-width: 110px;
  font-size: 12px;
  font-weight: 750;
}

.header-clear-btn {
  min-width: 64px;
  height: 32px;
  border: 1px solid #dbe3ef;
  border-radius: 7px;
  background: #fff;
  color: var(--ink);
  font: inherit;
  font-size: 12px;
  font-weight: 850;
  cursor: pointer;
}

.header-clear-btn:hover {
  border-color: #bbf7d0;
  background: var(--green-soft);
  color: var(--green-dark);
}

.full-panel {
  padding: 0 20px 20px;
  border: 0;
  background: transparent;
}

.data-stats {
  gap: 14px;
  margin-bottom: 18px;
}

.data-stats div {
  min-height: 78px;
  padding: 18px 22px;
  border-radius: 8px;
  background: linear-gradient(110deg, #f0fdf4, #ffffff);
  box-shadow: inset 0 0 0 1px #e2e8f0;
}

.data-stats div:nth-child(2) {
  background: linear-gradient(110deg, #eff6ff, #ffffff);
}

.data-stats div:nth-child(3) {
  background: linear-gradient(110deg, #faf5ff, #ffffff);
}

.data-stats span {
  color: #334155;
  font-size: 13px;
  letter-spacing: 0;
  text-transform: none;
}

.data-stats strong {
  display: inline-block;
  margin-top: 6px;
  font-size: 24px;
}

.cargo-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}

.cargo-stat-card {
  min-height: 92px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 16px;
}

.cargo-stat-card.green { background: linear-gradient(110deg, #f0fdf4, #fff); }
.cargo-stat-card.blue { background: linear-gradient(110deg, #eff6ff, #fff); }
.cargo-stat-card.amber { background: linear-gradient(110deg, #fff7ed, #fff); }
.cargo-stat-card.purple { background: linear-gradient(110deg, #faf5ff, #fff); }

.cargo-stat-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(22, 163, 74, .1);
  color: var(--green);
}

.cargo-stat-card.blue .cargo-stat-icon {
  background: rgba(37, 99, 235, .1);
  color: var(--blue);
}

.cargo-stat-card.amber .cargo-stat-icon {
  background: rgba(217, 119, 6, .11);
  color: var(--amber);
}

.cargo-stat-card.purple .cargo-stat-icon {
  background: rgba(124, 58, 237, .1);
  color: #7c3aed;
}

.cargo-stat-icon svg {
  width: 24px;
  height: 24px;
}

.cargo-stat-card span {
  color: #334155;
  font-size: 12px;
  font-weight: 850;
}

.cargo-stat-card strong {
  display: block;
  margin-top: 4px;
  color: var(--ink);
  font-size: 25px;
  line-height: 1;
}

.cargo-stat-card small {
  display: block;
  margin-top: 5px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.cargo-option-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}

.cargo-option-card {
  min-height: 66px;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) 46px;
  align-items: center;
  gap: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 12px;
}

.cargo-option-icon {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--green-soft);
  color: var(--green);
}

.cargo-option-icon.blue {
  background: var(--blue-soft);
  color: var(--blue);
}

.cargo-option-icon.amber {
  background: var(--amber-soft);
  color: var(--amber);
}

.cargo-option-icon svg {
  width: 17px;
  height: 17px;
}

.cargo-option-copy strong,
.cargo-option-copy small {
  display: block;
}

.cargo-option-copy strong {
  color: var(--ink);
  font-size: 12px;
  line-height: 1.25;
}

.cargo-option-copy small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 11px;
  font-weight: 750;
}

.switch-toggle {
  justify-self: end;
  cursor: pointer;
}

.switch-toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.switch-toggle span {
  width: 38px;
  height: 22px;
  position: relative;
  display: block;
  border-radius: 999px;
  background: #cbd5e1;
  transition: background .16s ease;
}

.switch-toggle span::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(15, 23, 42, .2);
  transition: transform .16s ease;
}

.switch-toggle input:checked + span {
  background: var(--green);
}

.switch-toggle input:checked + span::after {
  transform: translateX(16px);
}

.commodity-cell {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.commodity-icon {
  width: 26px;
  height: 26px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: #f8fafc;
  box-shadow: inset 0 0 0 1px #e2e8f0;
  font-size: 16px;
}

.flag-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 78px;
  min-height: 26px;
  border-radius: 999px;
  background: #f1f5f9;
  color: var(--muted);
  font-size: 11px;
  font-weight: 850;
}

.flag-pill.on {
  background: var(--blue-soft);
  color: var(--blue);
}

.flag-pill.danger.on {
  background: var(--amber-soft);
  color: var(--amber);
}

.flag-pill svg {
  width: 12px;
  height: 12px;
}

.bulk-actions-strip {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 14px;
}

.bulk-actions-strip span {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
  margin-right: auto;
}

.grid-wrap {
  max-height: 480px;
  overflow: auto;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 8px 30px rgba(15, 23, 42, .04);
}

/* HS Code Importer Modal */
.hs-importer-dialog {
  background: #fff;
  border-radius: 16px;
  width: 900px;
  max-width: 95vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 64px rgba(15,23,42,.18);
  overflow: hidden;
}

.hs-importer-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 24px 24px;
  overflow: hidden;
}

.hs-importer-info {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  background: #eff6ff;
  border-radius: 8px;
  border: 1px solid #bfdbfe;
  font-size: 13px;
  color: #1e40af;
}

.hs-importer-info svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 1px;
  color: #3b82f6;
}

.hs-importer-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hs-importer-controls .search-box {
  flex: 1;
  min-width: 220px;
}

.hs-summary-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.hs-sum-chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.hs-sum-chip.new {
  background: #d1fae5;
  color: #065f46;
}

.hs-sum-chip.exists {
  background: #f1f5f9;
  color: #64748b;
}

.hs-table-wrap {
  flex: 1;
  overflow: auto;
  max-height: 420px;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.hs-table {
  min-width: 640px;
}

.hs-table thead th {
  position: sticky;
  top: 0;
  background: #f8fafc;
  z-index: 2;
}

.hs-exists td {
  opacity: 0.45;
}

.hs-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 24px;
  color: var(--muted);
  text-align: center;
}

.hs-empty svg {
  width: 48px;
  height: 48px;
  opacity: 0.3;
}

.hs-empty p {
  font-size: 14px;
  margin: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }
.spinner-sm {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.spinner-lg {
  display: inline-block;
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.grid-wrap .admin-table {
  min-width: 1160px;
}

.grid-wrap .admin-table th {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 44px;
  background: #fbfdff;
  color: #53627c;
  font-size: 11px;
}

.grid-wrap .admin-table td {
  height: 48px;
  background: #fff;
}

.grid-wrap .admin-table tbody tr:hover td {
  background: #f4fbf7;
}

.grid-wrap .admin-table tbody tr:has(.row-menu) td {
  position: relative;
  z-index: 30;
}

.select-col {
  width: 42px;
  text-align: center !important;
}

.row-check {
  width: 16px;
  height: 16px;
  accent-color: var(--green);
}

.country-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.country-region-cell {
  display: grid;
  gap: 5px;
}

.country-region-cell small {
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
}

.mini-flag {
  width: 24px;
  height: 24px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 0 0 1px #e2e8f0;
  font-size: 16px;
  line-height: 1;
}

.popular-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 20px;
  border-radius: 999px;
  background: #dcfce7;
  color: var(--green-dark);
  font-size: 10px;
  font-weight: 900;
  padding: 2px 7px;
}

.popular-pill.muted {
  background: #f1f5f9;
  color: var(--muted);
}

.popular-pill svg {
  width: 11px;
  height: 11px;
}

.row-action {
  position: relative;
  display: inline-flex;
  justify-content: flex-end;
  z-index: 1;
}

.kebab-btn {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #fff;
  color: var(--ink);
  cursor: pointer;
}

.kebab-btn svg {
  width: 16px;
  height: 16px;
}

.row-menu {
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 80;
  width: 182px;
  overflow: visible;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 18px 40px rgba(15, 23, 42, .16);
  padding: 6px;
}

.row-menu button {
  width: 100%;
  min-height: 34px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  text-align: left;
  cursor: pointer;
  padding: 0 10px;
}

.row-menu button svg {
  width: 15px;
  height: 15px;
  flex: 0 0 auto;
}

.row-menu button:hover {
  background: #f8fafc;
}

.row-menu button.danger {
  color: var(--red);
}

.pagination-bar {
  margin-top: 0;
  border-radius: 0 0 8px 8px;
  background: #fff;
}

.page-arrow,
.page-number {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 13px;
  font-weight: 850;
  cursor: pointer;
}

.page-arrow svg {
  width: 16px;
  height: 16px;
}

.page-number.active {
  background: var(--green);
  color: #fff;
}

.page-arrow:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}

.delete-dialog {
  position: relative;
  width: min(460px, calc(100vw - 32px));
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 28px 70px rgba(15, 23, 42, .2);
  padding: 26px 26px 20px;
}

.delete-dialog h2 {
  margin: 0;
  color: var(--ink);
  font-size: 18px;
}

.delete-dialog p {
  margin: 9px 0 0;
  color: #475569;
  font-size: 13px;
  line-height: 1.55;
}

.dialog-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.dialog-close svg {
  width: 16px;
  height: 16px;
}

.delete-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
  border-radius: 999px;
  background: var(--red-soft);
  color: var(--red);
}

.delete-icon svg {
  width: 22px;
  height: 22px;
}

.danger-solid-btn {
  min-height: 40px;
  min-width: 110px;
  border: 1px solid var(--red);
  border-radius: 8px;
  background: var(--red);
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 850;
  cursor: pointer;
}

@media (max-width: 1180px) {
  .metric-row,
  .dashboard-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .fcl-grid {
    grid-template-columns: 1fr;
  }

  .cargo-stats,
  .cargo-option-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .admin-sidebar {
    position: static;
    width: auto;
    min-height: auto;
  }

  .admin-main {
    margin-left: 0;
    padding: 18px;
  }

  .metric-row,
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .section-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .toolbar {
    width: 100%;
    justify-content: flex-start;
  }

  .fcl-data-tabs,
  .data-stats,
  .cargo-stats,
  .cargo-option-grid,
  .option-strip {
    grid-template-columns: 1fr;
  }

  .fcl-filterbar {
    align-items: stretch;
    flex-direction: column;
  }

  .fcl-filterbar-left,
  .fcl-filterbar-right {
    width: 100%;
  }

  .fcl-filterbar-search {
    max-width: none;
  }

  .grid-wrap {
    overflow-x: auto;
  }

  .dataset-toolbar,
  .dataset-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .compact-search {
    max-width: none;
  }

  .subtabs {
    width: 100%;
  }

  .page-header-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .page-tabs {
    width: 100%;
    overflow-x: auto;
  }

  .page-tabs button {
    flex: 1 0 auto;
  }

  .subtabs button {
    flex: 1;
    min-width: 0;
  }

  .quick-form {
    grid-template-columns: 1fr;
  }

  .modal-backdrop {
    padding: 14px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions button {
    width: 100%;
  }
}
.masked-password-input{-webkit-text-security:disc}
.admin-main button{transition:background-color .16s ease,border-color .16s ease,color .16s ease,box-shadow .16s ease,transform .16s ease}.admin-main button:hover:not(:disabled){filter:none;box-shadow:0 2px 7px rgba(230,126,34,.22);transform:translateY(-1px)}.admin-main button:focus-visible,.admin-main button:active:not(:disabled){background:#e67e22!important;border-color:#d96f16!important;color:#fff!important;box-shadow:0 0 0 3px rgba(230,126,34,.24),0 3px 8px rgba(230,126,34,.25)!important;outline:none}.admin-main .fcl-data-tabs button.active{background:#e67e22!important;color:#fff!important}.admin-main .fcl-data-tabs button.active::after{background:#c85f0c}
</style>
