<template>
  <!-- Submitted Summary View -->
  <div class="submitted-summary">
    <div style="display: flex; justify-content: flex-end; margin-bottom: 10px; position: relative;" ref="downloadDropdownRef">
      <button class="download-page-btn-top" @click.stop="showDlDropdown = !showDlDropdown">
        <i class="fas fa-download"></i> Download current page
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :style="{ transform: showDlDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <Transition name="dl-fade">
        <div v-if="showDlDropdown" class="dl-dropdown-menu">
          <button class="dl-dropdown-item" @click="downloadCurrentService(); showDlDropdown = false">
            <i class="fas fa-file-pdf" style="color:#e74c3c;"></i>
            <span>
              <strong>Download current service</strong>
              <small>Export only the selected tab</small>
            </span>
          </button>
          <div class="dl-dropdown-divider"></div>
          <button class="dl-dropdown-item" @click="downloadAllServices(); showDlDropdown = false">
            <i class="fas fa-layer-group" style="color:#3b82f6;"></i>
            <span>
              <strong>Download all services</strong>
              <small>Export all services in order</small>
            </span>
          </button>
        </div>
      </Transition>
    </div>
          <!-- ==================== SERVICE TABS BAR ==================== -->
          <div class="service-tabs-bar" v-if="(services.origin.selected.length + services.sea.selected.length + services.dest.selected.length) > 1">
            <!-- AT ORIGIN group -->
            <template v-if="services.origin.selected.length > 0">
              <div class="service-tabs-group">
                <div class="service-tabs-group-header">
                  <div class="tabs-group-icon" style="background: linear-gradient(135deg, #fef3c7, #fed7aa);">🌍</div>
                  <span class="tabs-group-title">AT ORIGIN</span>
                </div>
                <div class="service-tabs-group-items">
                  <button
                    v-for="(svcId, idx) in orderedOriginServices" :key="svcId"
                    class="service-tab-btn"
                    :class="{ active: activeServiceTab === `origin-${svcId}` }"
                    @click="activeServiceTab = `origin-${svcId}`"
                  >
                    <span class="service-tab-num">{{ idx + 1 }}</span>
                    <span class="service-tab-label">{{ allServiceTabs.find(t => t.id === `origin-${svcId}`)?.label }}</span>
                  </button>
                </div>
              </div>
            </template>
            <!-- Divider -->
            <div class="service-tabs-divider" v-if="services.origin.selected.length > 0 && (services.sea.selected.length > 0 || services.dest.selected.length > 0)"></div>
            <!-- SEA FREIGHT group -->
            <template v-if="services.sea.selected.length > 0">
              <div class="service-tabs-group">
                <div class="service-tabs-group-header">
                  <div class="tabs-group-icon" style="background: linear-gradient(135deg, #dbeafe, #bfdbfe);">🚢</div>
                  <span class="tabs-group-title">SEA FREIGHT</span>
                </div>
                <div class="service-tabs-group-items">
                  <button
                    v-for="(svcId, idx) in orderedSeaServices" :key="svcId"
                    class="service-tab-btn"
                    :class="{ active: activeServiceTab === `sea-${svcId}` }"
                    @click="activeServiceTab = `sea-${svcId}`"
                  >
                    <span class="service-tab-num">{{ idx + 1 }}</span>
                    <span class="service-tab-label">{{ allServiceTabs.find(t => t.id === `sea-${svcId}`)?.label }}</span>
                  </button>
                </div>
              </div>
            </template>
            <!-- Divider -->
            <div class="service-tabs-divider" v-if="services.sea.selected.length > 0 && services.dest.selected.length > 0"></div>
            <!-- AT DESTINATION group -->
            <template v-if="services.dest.selected.length > 0">
              <div class="service-tabs-group">
                <div class="service-tabs-group-header">
                  <div class="tabs-group-icon" style="background: linear-gradient(135deg, #dcfce7, #d1fae5);">🌍</div>
                  <span class="tabs-group-title">AT DESTINATION</span>
                </div>
                <div class="service-tabs-group-items">
                  <button
                    v-for="(svcId, idx) in orderedDestServices" :key="svcId"
                    class="service-tab-btn"
                    :class="{ active: activeServiceTab === `dest-${svcId}` }"
                    @click="activeServiceTab = `dest-${svcId}`"
                  >
                    <span class="service-tab-num">{{ idx + 1 }}</span>
                    <span class="service-tab-label">{{ allServiceTabs.find(t => t.id === `dest-${svcId}`)?.label }}</span>
                  </button>
                </div>
              </div>
            </template>
          </div>
          <!-- ==================== AT ORIGIN SECTION ==================== -->
          <template v-for="svcId in services.origin.selected" :key="svcId">
            <div class="origin-service-item" style="margin-bottom: 5px;">

            <!-- Full Summary Content for AT ORIGIN -->
            <div v-show="(services.origin.selected.length + services.sea.selected.length + services.dest.selected.length) === 1 || activeServiceTab === `origin-${svcId}`" class="summary-full-content">

              <!-- ══ INFO CARD (matches ST2-Full EXW.html .info-card) ══ -->
              <div class="st2-info-card">
                <!-- LEFT: Section header + service card -->
                <div class="st2-info-left">
                  <div class="st2-at-origin-header">
                    <div class="st2-origin-icon">🌍</div>
                    <span class="st2-at-origin-label">AT ORIGIN</span>
                    <div class="st2-at-origin-divider"></div>
                  </div>

                  <!-- Service card — icon + name + desc changes per svcId -->
                  <div class="st2-service-card">
                    <div class="st2-svc-top">
                      <span class="st2-truck-icon">
                        <template v-if="svcId === 'fullExw'">🚛</template>
                        <template v-else-if="svcId === 'fullFca'">🚛</template>
                        <template v-else-if="svcId === 'customsOnly'"><svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <!-- Body / uniform --><path d="M7 34 C7 26 11 23 18 23 C25 23 29 26 29 34 Z" fill="#1d4ed8"/>
                            <!-- Tie --><polygon points="18,23 16.5,27 18,29 19.5,27" fill="#1e3a8a"/>
                            <!-- Shirt collar --><path d="M15 23 L18 25.5 L21 23" fill="none" stroke="#e0e7ff" stroke-width="1.2" stroke-linejoin="round"/>
                            <!-- Badge shield --><path d="M14.5 25.5 L14.5 29 Q14.5 31 16.5 31.5 L18 32 L19.5 31.5 Q21.5 31 21.5 29 L21.5 25.5 Q19.8 24.8 18 24.8 Q16.2 24.8 14.5 25.5Z" fill="#fbbf24"/>
                            <text x="18" y="29.5" text-anchor="middle" font-family="sans-serif" font-size="3.5" font-weight="700" fill="#92400e">★</text>
                            <!-- Neck --><rect x="15.5" y="19.5" width="5" height="4" rx="2" fill="#fcd9a0"/>
                            <!-- Head --><circle cx="18" cy="14.5" r="6" fill="#fcd9a0"/>
                            <!-- Ears --><ellipse cx="11.8" cy="14.5" rx="1.2" ry="1.8" fill="#fcd9a0"/><ellipse cx="24.2" cy="14.5" rx="1.2" ry="1.8" fill="#fcd9a0"/>
                            <!-- Hair --><path d="M12 11 Q14 7 18 6.5 Q22 7 24 11 Q22 9.5 18 9.5 Q14 9.5 12 11Z" fill="#78350f"/>
                            <!-- Eyes --><ellipse cx="15.5" cy="14" rx="1.2" ry="1.3" fill="white"/><ellipse cx="20.5" cy="14" rx="1.2" ry="1.3" fill="white"/><circle cx="15.7" cy="14.2" r="0.7" fill="#1e3a8a"/><circle cx="20.7" cy="14.2" r="0.7" fill="#1e3a8a"/>
                            <!-- Eyebrows --><path d="M14.2 12.3 Q15.5 11.5 16.8 12.3" stroke="#78350f" stroke-width="0.8" fill="none" stroke-linecap="round"/><path d="M19.2 12.3 Q20.5 11.5 21.8 12.3" stroke="#78350f" stroke-width="0.8" fill="none" stroke-linecap="round"/>
                            <!-- Mouth --><path d="M16 16.8 Q18 18 20 16.8" stroke="#c2855a" stroke-width="0.9" fill="none" stroke-linecap="round"/>
                            <!-- Cap --><rect x="11" y="8.5" width="14" height="2.5" rx="1.2" fill="#1d4ed8"/><rect x="13" y="5.5" width="10" height="3.5" rx="1" fill="#1d4ed8"/>
                            <!-- Cap badge --><polygon points="18,6 18.7,8 20.7,8 19.2,9.2 19.8,11.2 18,10 16.2,11.2 16.8,9.2 15.3,8 17.3,8" fill="#fbbf24"/>
                          </svg></template>
                        <template v-else-if="svcId === 'collectPay'"><svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <!-- Paper background --><rect x="6" y="3" width="22" height="28" rx="2.5" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
                            <!-- Folded corner --><path d="M22 3 L28 9 L22 9 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1"/>
                            <!-- Lines on invoice --><line x1="10" y1="14" x2="24" y2="14" stroke="#16a34a" stroke-width="1.4" stroke-linecap="round"/><line x1="10" y1="18" x2="24" y2="18" stroke="#d1fae5" stroke-width="1.2" stroke-linecap="round"/><line x1="10" y1="22" x2="20" y2="22" stroke="#d1fae5" stroke-width="1.2" stroke-linecap="round"/>
                            <!-- Dollar sign circle --><circle cx="27" cy="28" r="7" fill="#16a34a"/>
                            <text x="27" y="31.5" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="white">$</text>
                          </svg></template>
                        <template v-else-if="svcId === 'insurance'"><svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <!-- Shield body --><path d="M18 3 L30 8 L30 19 Q30 27 18 33 Q6 27 6 19 L6 8 Z" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
                            <!-- Shield inner fill --><path d="M18 6 L27 10 L27 19 Q27 25 18 30 Q9 25 9 19 L9 10 Z" fill="#dcfce7"/>
                            <!-- Box/cargo inside shield --><rect x="12" y="14" width="12" height="10" rx="1.5" fill="#16a34a"/>
                            <line x1="12" y1="19" x2="24" y2="19" stroke="#f0fdf4" stroke-width="1"/><line x1="18" y1="14" x2="18" y2="24" stroke="#f0fdf4" stroke-width="1"/>
                            <!-- Checkmark overlay --><circle cx="26" cy="27" r="6" fill="#16a34a"/>
                            <polyline points="22.5,27 25,29.5 29.5,24.5" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg></template>
                        <template v-else>📦</template>
                      </span>
                      <div class="st2-svc-name">
                        <template v-if="svcId === 'fullExw'"><span v-html="fmtSvcName('Full EXW service: From shipper\'s warehouse to container yard / port (customs clearance included)')"></span></template>
                        <template v-else-if="svcId === 'fullFca'"><span v-html="fmtSvcName('Full FCA service: From shipper\'s warehouse to container yard / port (customs clearance excluded)')"></span></template>
                        <template v-else-if="svcId === 'customsOnly'"><span v-html="fmtSvcName('Customs clearance service only')"></span></template>
                        <template v-else-if="svcId === 'collectPay'"><span v-html="fmtSvcName('Collect/pay charges as nominated')"></span></template>
                        <template v-else-if="svcId === 'insurance'"><span v-html="fmtSvcName('Buy cargo insurance')"></span></template>
                        <template v-else><span v-html="fmtSvcName('Origin service')"></span></template>
                      </div>
                    </div>
                    <div class="st2-svc-desc">
                      <span class="st2-info-badge">i</span>
                      <span>
                        <template v-if="svcId === 'fullExw'">Shoptrans works with shipper, deliver empty container(s) to shipper's warehouse for stuffing, complete customs clearance procedures and return full container(s) to loading depot or POL.</template>
                        <template v-else-if="svcId === 'fullFca'">Shoptrans works with shipper, deliver empty container(s) to shipper's warehouse for stuffing and return full container(s) to loading depot or POL, customs clearance is done by shipper.</template>
                        <template v-else-if="svcId === 'customsOnly'">Shoptrans works with shipper to complete customs clearance procedures only, other works excluded.</template>
                        <template v-else-if="svcId === 'collectPay'">Shoptrans will collect or disburse transportation service fees or other related charges under the customer's instructions.</template>
                        <template v-else-if="svcId === 'insurance'">Shoptrans provides cargo insurance services, works with shipper to buy insurance for the shipment(s).</template>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- RIGHT: Shipment details + flag route -->
                <div class="st2-info-right">
                  <div class="st2-info-details">
                    <div class="st2-info-row">
                      <div class="st2-info-icon-wrap">📍</div>
                      <span class="st2-info-label">Pickup location</span>
                      <span class="st2-info-colon">:</span>
                      <span class="st2-info-value">{{ summaryPickupLocation }}</span>
                    </div>
                    <div class="st2-info-row">
                      <div class="st2-info-icon-wrap">🏗️</div>
                      <span class="st2-info-label">Port of loading</span>
                      <span class="st2-info-colon">:</span>
                      <span class="st2-info-value">{{ summaryPortOfLoading }}</span>
                    </div>
                    <div class="st2-info-row">
                      <div class="st2-info-icon-wrap">🏗️</div>
                      <span class="st2-info-label">Port of destination</span>
                      <span class="st2-info-colon">:</span>
                      <span class="st2-info-value">{{ summaryPortOfDestination }}</span>
                    </div>
                    <div class="st2-info-row">
                      <div class="st2-info-icon-wrap">📦</div>
                      <span class="st2-info-label">Volume</span>
                      <span class="st2-info-colon">:</span>
                      <span class="st2-info-value">{{ summaryVolume }}</span>
                    </div>
                    <div class="st2-info-row">
                      <div class="st2-info-icon-wrap">🏷️</div>
                      <span class="st2-info-label">Cargo type</span>
                      <span class="st2-info-colon">:</span>
                      <span class="st2-info-value">{{ summaryCargoType }}</span>
                    </div>
                    <div class="st2-info-row">
                      <div class="st2-info-icon-wrap">⏱️</div>
                      <span class="st2-info-label">Handling time</span>
                      <span class="st2-info-colon">:</span>
                      <span class="st2-info-value">2 days</span>
                    </div>
                    <div class="st2-info-row">
                      <div class="st2-info-icon-wrap">📅</div>
                      <span class="st2-info-label">Validity</span>
                      <span class="st2-info-colon">:</span>
                      <span class="st2-info-value">{{ summaryValidityDate }}</span>
                    </div>
                  </div>

                  <!-- Route card with flag images -->
                  <div class="st2-route-card">
                    <div class="st2-route-flags">
                      <div class="st2-flag-wrap">
                        <div class="st2-flag-circle">
                          <img :src="originFlagImage" :alt="summaryOriginCountry" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                        </div>
                        <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                      </div>
                      <div class="st2-route-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </div>
                      <div class="st2-flag-wrap">
                        <div class="st2-flag-circle">
                          <img :src="destFlagImage" :alt="summaryDestCountry" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                        </div>
                        <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ══ CHARGES TABLE (matches ST2-Full EXW.html .charges-wrap) ══ -->
              <div class="st2-charges-wrap">
                <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                  <colgroup>
                    <col class="st2-col-item" />
                    <col class="st2-col-unit" />
                    <col v-if="tableShow20" class="st2-col-20" />
                    <col v-if="tableShow40" class="st2-col-40" />
                    <col v-if="tableShow45" class="st2-col-45" />
                    <col class="st2-col-cur" />
                    <col class="st2-col-total" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th class="th-unit">Unit</th>
                      <th v-if="tableShow20">20' <span v-if="tableQty20 > 1" style="font-weight:400;font-size:11px;">(×{{ tableQty20 }})</span></th>
                      <th v-if="tableShow40">40' <span v-if="tableQty40 > 1" style="font-weight:400;font-size:11px;">(×{{ tableQty40 }})</span></th>
                      <th v-if="tableShow45">45' <span v-if="tableQty45 > 1" style="font-weight:400;font-size:11px;">(×{{ tableQty45 }})</span></th>
                      <th>Currency</th>
                      <th>Total price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- ── PICK-UP CHARGES (fullExw / fullFca) ── -->
                    <template v-if="svcId === 'fullExw' || svcId === 'fullFca'">
                      <tr class="st2-tr-section st2-first-section">
                        <td :colspan="2 + tableActiveCols + 2">💲 <a>PICK-UP CHARGES</a></td>
                      </tr>
                      <tr class="st2-tr-sub st2-confirmed">
                        <td :colspan="2 + tableActiveCols + 2">🔒 Confirmed costs</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Trucking fee</td><td class="td-unit">per Container</td>
                        <td v-if="tableShow20">{{ tblCell(200, tableQty20, tableShow20) }}</td>
                        <td v-if="tableShow40">{{ tblCell(350, tableQty40, tableShow40) }}</td>
                        <td v-if="tableShow45">{{ tblCell(350, tableQty45, tableShow45) }}</td>
                        <td>USD</td><td>{{ tblTotal({ s20: 200, s40: 350, s45: 350 }) }}</td>
                      </tr>
                      <tr class="st2-tr-subtotal">
                        <td class="blank"></td><td class="blank"></td>
                        <td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>{{ tblTotal({ s20: 200, s40: 350, s45: 350 }) }}</td>
                      </tr>
                      <tr class="st2-tr-sub st2-conditional">
                        <td :colspan="2 + tableActiveCols + 2">🔴 Conditional costs (if incurred)</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Trucking standby</td><td class="td-unit">per Truck</td>
                        <td v-if="tableShow20">{{ tblCell(80, tableQty20, tableShow20) }}</td>
                        <td v-if="tableShow40">{{ tblCell(80, tableQty40, tableShow40) }}</td>
                        <td v-if="tableShow45">{{ tblCell(80, tableQty45, tableShow45) }}</td>
                        <td>USD</td><td>{{ tblTotal({ s20: 80, s40: 80, s45: 80 }) }}</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Trucking cancellation fee</td><td class="td-unit">per Truck</td>
                        <td v-if="tableShow20">{{ tblCell(80, tableQty20, tableShow20) }}</td>
                        <td v-if="tableShow40">{{ tblCell(80, tableQty40, tableShow40) }}</td>
                        <td v-if="tableShow45">{{ tblCell(80, tableQty45, tableShow45) }}</td>
                        <td>USD</td><td>{{ tblTotal({ s20: 80, s40: 80, s45: 80 }) }}</td>
                      </tr>
                      <tr class="st2-tr-subtotal">
                        <td class="blank"></td><td class="blank"></td>
                        <td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>{{ tblTotal({ s20: 160, s40: 160, s45: 160 }) }}</td>
                      </tr>
                    </template>

                    <!-- ── CUSTOMS CLEARANCE (fullExw / customsOnly) ── -->
                    <template v-if="svcId === 'fullExw' || svcId === 'customsOnly'">
                      <tr :class="['st2-tr-section', svcId === 'customsOnly' ? 'st2-first-section' : '']">
                        <td :colspan="2 + tableActiveCols + 2">💲 <a>CUSTOMS CLEARANCE</a></td>
                      </tr>
                      <tr class="st2-tr-sub st2-confirmed">
                        <td :colspan="2 + tableActiveCols + 2">🔒 Confirmed charges</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Customs clearance fee</td>
                        <td class="td-unit">per Container</td>
                        <td v-if="tableShow20">{{ tblCell(80, tableQty20, tableShow20) }}</td>
                        <td v-if="tableShow40">{{ tblCell(80, tableQty40, tableShow40) }}</td>
                        <td v-if="tableShow45">{{ tblCell(80, tableQty45, tableShow45) }}</td>
                        <td>USD</td>
                        <td>{{ tblTotal({ s20: 80, s40: 80, s45: 80 }) }}</td>
                      </tr>
                      <tr class="st2-tr-subtotal">
                        <td class="blank"></td><td class="blank"></td>
                        <td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>{{ tblTotal({ s20: 80, s40: 80, s45: 80 }) }}</td>
                      </tr>
                      <tr class="st2-tr-sub st2-conditional">
                        <td :colspan="2 + tableActiveCols + 2">🔴 Conditional charges (if incurred)</td>
                      </tr>
                      <tr class="st2-tr-item st2-tr-item-dim">
                        <td>Inspection service fee</td>
                        <td class="td-unit">per Container</td>
                        <td v-if="tableShow20">{{ tblCell(60, tableQty20, tableShow20) }}</td>
                        <td v-if="tableShow40">{{ tblCell(60, tableQty40, tableShow40) }}</td>
                        <td v-if="tableShow45">{{ tblCell(60, tableQty45, tableShow45) }}</td>
                        <td>USD</td>
                        <td>{{ tblTotal({ s20: 60, s40: 60, s45: 60 }) }}</td>
                      </tr>
                      <tr class="st2-tr-item st2-tr-item-dim">
                        <td>Port fees for inspection</td>
                        <td class="td-unit">per Container</td>
                        <td v-if="tableShow20" style="text-align:center;color:#9ca3af;font-style:italic;">As actual</td>
                        <td v-if="tableShow40" style="text-align:center;color:#9ca3af;font-style:italic;">As actual</td>
                        <td v-if="tableShow45" style="text-align:center;color:#9ca3af;font-style:italic;">As actual</td>
                        <td style="text-align:center;color:#9ca3af;font-style:italic;">As actual</td>
                        <td style="text-align:center;color:#9ca3af;font-style:italic;">As actual</td>
                      </tr>
                      <tr class="st2-tr-subtotal">
                        <td class="blank"></td><td class="blank"></td>
                        <td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>{{ tblTotal({ s20: 60, s40: 60, s45: 60 }) }}++</td>
                      </tr>
                    </template>

                    <!-- ── PORT CHARGES (fullExw / fullFca) ── -->
                    <template v-if="svcId === 'fullExw' || svcId === 'fullFca'">
                      <tr class="st2-tr-section">
                        <td :colspan="2 + tableActiveCols + 2">💲 <a>PORT CHARGES</a></td>
                      </tr>
                      <tr class="st2-tr-sub st2-confirmed">
                        <td :colspan="2 + tableActiveCols + 2">🔒 Confirmed costs</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Lift fee</td><td class="td-unit">per Container</td>
                        <td v-if="tableShow20">{{ tblCell(80, tableQty20, tableShow20) }}</td>
                        <td v-if="tableShow40">{{ tblCell(80, tableQty40, tableShow40) }}</td>
                        <td v-if="tableShow45">{{ tblCell(80, tableQty45, tableShow45) }}</td>
                        <td>USD</td><td>{{ tblTotal({ s20: 80, s40: 80, s45: 80 }) }}</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Infrastructure fee</td><td class="td-unit">per Container</td>
                        <td v-if="tableShow20">{{ tblCell(20, tableQty20, tableShow20) }}</td>
                        <td v-if="tableShow40">{{ tblCell(20, tableQty40, tableShow40) }}</td>
                        <td v-if="tableShow45">{{ tblCell(20, tableQty45, tableShow45) }}</td>
                        <td>USD</td><td>{{ tblTotal({ s20: 20, s40: 20, s45: 20 }) }}</td>
                      </tr>
                      <tr class="st2-tr-subtotal">
                        <td class="blank"></td><td class="blank"></td>
                        <td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>{{ tblTotal({ s20: 100, s40: 100, s45: 100 }) }}</td>
                      </tr>
                      <tr class="st2-tr-sub st2-conditional">
                        <td :colspan="2 + tableActiveCols + 2">🔴 Conditional costs (if incurred)</td>
                      </tr>
                    </template>

                    <!-- ── AGENT HANDLING CHARGES (collectPay) ── -->
                    <template v-if="svcId === 'collectPay'">
                      <tr class="st2-tr-section st2-first-section">
                        <td :colspan="2 + tableActiveCols + 2">💲 <a style="color:#1f2937; text-decoration:underline; text-underline-offset:2px; cursor:pointer;">AGENT HANDLING CHARGES</a></td>
                      </tr>
                      <tr class="st2-tr-sub st2-confirmed">
                        <td :colspan="2 + tableActiveCols + 2">🔒 Confirmed costs</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Agent handling fee</td><td class="td-unit">per Container</td>
                        <td v-if="tableShow20">{{ tblCell(250, tableQty20, tableShow20) }}</td>
                        <td v-if="tableShow40">{{ tblCell(250, tableQty40, tableShow40) }}</td>
                        <td v-if="tableShow45">{{ tblCell(250, tableQty45, tableShow45) }}</td>
                        <td>USD</td>
                        <td>{{ tblTotal({ s20: 250, s40: 250, s45: 250 }) }}</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Banking fee</td><td class="td-unit">per Transaction</td>
                        <td :colspan="tableActiveCols">50.00</td>
                        <td>USD</td>
                        <td>50.00</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>R.O.E deduction</td><td class="td-unit">per Transaction</td>
                        <td :colspan="tableActiveCols">50.00</td>
                        <td>USD</td>
                        <td>50.00</td>
                      </tr>
                      <tr class="st2-tr-subtotal">
                        <td class="blank"></td><td class="blank"></td>
                        <td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td>
                        <td>{{ (parseFloat(tblTotal({ s20: 250, s40: 250, s45: 250 })) + 100).toFixed(2) }}</td>
                      </tr>
                    </template>

                    <!-- ── INSURANCE FEE (insurance) ── -->
                    <!-- Insurance is per B/L (not per container), so size cells are n/a -->
                    <template v-if="svcId === 'insurance'">
                      <tr class="st2-tr-section st2-first-section">
                        <td :colspan="2 + tableActiveCols + 2">💲 <a>INSURANCE FEE</a></td>
                      </tr>
                      <tr class="st2-tr-sub st2-confirmed">
                        <td :colspan="2 + tableActiveCols + 2">🔒 Fixed costs</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Insurance premium (Min: $ 50)</td><td class="td-unit">per B/L</td>
                        <td v-if="tableShow20" class="na">—</td>
                        <td v-if="tableShow40" class="na">—</td>
                        <td v-if="tableShow45">0.1% FOB</td>
                        <td>USD</td><td>50.00</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Handling fee</td><td class="td-unit">per B/L</td>
                        <td v-if="tableShow20" class="na">—</td>
                        <td v-if="tableShow40" class="na">—</td>
                        <td v-if="tableShow45" class="na">—</td>
                        <td>USD</td><td>50.00</td>
                      </tr>
                      <tr class="st2-tr-subtotal">
                        <td class="blank"></td><td class="blank"></td>
                        <td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>100.00</td>
                      </tr>
                      <tr class="st2-tr-sub st2-conditional">
                        <td :colspan="2 + tableActiveCols + 2">🔴 Potential costs (if incurred)</td>
                      </tr>
                    </template>
                  </tbody>
                </table>

                <!-- Total Footer -->
                <div class="st2-total-footer">
                  <span class="st2-total-label">TOTAL PRICE</span>
                  <div class="st2-total-amounts">
                    <div class="st2-total-row">
                      <span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span>
                      <span class="st2-t-amount">USD {{ (() => {
                        let t = 0
                        if (svcId === 'fullExw' || svcId === 'fullFca') t += parseFloat(tblTotal({s20:200,s40:350,s45:350})) + parseFloat(tblTotal({s20:80,s40:80,s45:80})) + parseFloat(tblTotal({s20:20,s40:20,s45:20}))
                        if (svcId === 'fullExw' || svcId === 'customsOnly') t += parseFloat(tblTotal({s20:80,s40:80,s45:80}))
                        if (svcId === 'collectPay') t += parseFloat(tblTotal({s20:250,s40:250,s45:250})) + 100
                        if (svcId === 'insurance') t += 100
                        return t > 0 ? t.toFixed(2) : '0.00'
                      })() }}</span>
                    </div>
                    <div class="st2-total-row">
                      <span class="st2-t-tag st2-conditional">🔴 Conditional:</span>
                      <span class="st2-t-amount">USD {{ (() => {
                        let t = 0
                        if (svcId === 'fullExw' || svcId === 'fullFca') t += parseFloat(tblTotal({s20:160,s40:160,s45:160})) + parseFloat(tblTotal({s20:80,s40:80,s45:80}))
                        if (svcId === 'fullExw' || svcId === 'customsOnly') t += parseFloat(tblTotal({s20:60,s40:60,s45:60}))
                        return t > 0 ? t.toFixed(2) + '+' : '—'
                      })() }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="st2-actions">
              </div>
            </div> <!-- End summary-full-content -->
            </div> <!-- End origin-service-item -->
         </template>

          <!-- ==================== SEA FREIGHT / DESTINATION SECTION ==================== -->

          <!-- ==================== SEA FREIGHT SECTION ==================== -->
          <template v-for="svcId in services.sea.selected" :key="svcId">
            <div class="sea-service-item" style="margin-bottom: 5px;">

            <div v-show="(services.origin.selected.length + services.sea.selected.length + services.dest.selected.length) === 1 || activeServiceTab === `sea-${svcId}`" class="summary-full-content">
              
              <!-- ST2 Format for bookingOffered -->
              <template v-if="svcId === 'bookingOffered'">
                <div class="st2-info-card">
                  <div class="st2-info-left" style="background:#fafafa;">
                    <div class="st2-at-origin-header">
                      <div class="st2-origin-icon" style="background: linear-gradient(135deg, #dbeafe, #bfdbfe);">🚢</div>
                      <span class="st2-at-origin-label">SEA FREIGHT</span>
                      <div class="st2-at-origin-divider"></div>
                    </div>
                    <div class="st2-service-card">
                      <div class="st2-svc-top">
                        <span class="st2-truck-icon">
                          <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 27 Q6 24 10 27 Q14 30 18 27 Q22 24 26 27 Q30 30 34 27 L34 34 L2 34 Z" fill="#bfdbfe"/>
                            <path d="M2 30 Q6 27 10 30 Q14 33 18 30 Q22 27 26 30 Q30 33 34 30 L34 34 L2 34 Z" fill="#93c5fd"/>
                            <path d="M6 26 L8 18 L28 18 L30 26 Z" fill="#1d4ed8"/>
                            <line x1="6" y1="22" x2="30" y2="22" stroke="#3b82f6" stroke-width="1"/>
                            <rect x="11" y="10" width="14" height="8" rx="1.5" fill="#2563eb"/>
                            <rect x="13" y="12" width="3" height="2.5" rx="0.5" fill="#bfdbfe"/>
                            <rect x="17" y="12" width="3" height="2.5" rx="0.5" fill="#bfdbfe"/>
                            <rect x="21" y="12" width="1.5" height="2.5" rx="0.5" fill="#bfdbfe"/>
                            <rect x="17" y="5" width="4" height="6" rx="1" fill="#1e40af"/>
                            <rect x="16.5" y="4" width="5" height="2" rx="0.8" fill="#1e40af"/>
                            <circle cx="17" cy="3.5" r="1" fill="#9ca3af" opacity="0.6"/>
                            <circle cx="19" cy="2.5" r="1.2" fill="#9ca3af" opacity="0.4"/>
                            <circle cx="21" cy="3" r="0.8" fill="#9ca3af" opacity="0.3"/>
                            <line x1="19" y1="5" x2="19" y2="2" stroke="#1e3a8a" stroke-width="1.2"/>
                            <line x1="13" y1="18" x2="13" y2="14" stroke="#93c5fd" stroke-width="1"/>
                            <line x1="23" y1="18" x2="23" y2="14" stroke="#93c5fd" stroke-width="1"/>
                          </svg>
                        </span>
                        <div class="st2-svc-name" v-html="fmtSvcName('Place booking at the offered rate')"></div>
                      </div>
                      <div class="st2-svc-desc" style="margin-top:6px;">
                        <span class="st2-info-badge">i</span>
                        <span style="font-size:11px;">Rates have offered online and which rate is matching with your target or your requirement, use that rate to arrange booking.</span>
                      </div>
                    </div>
                  </div>
                  <div class="st2-info-right" style="background:#fff;">
                    <div class="st2-info-details">
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of loading</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryFromPort }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of destination</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryToPort }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">💳</div><span class="st2-info-label">Freight</span><span class="st2-info-colon">:</span><span class="st2-info-value">PREPAID</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Volume</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedContainerType || '1X20GP' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏷️</div><span class="st2-info-label">Cargo type</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedCommodity?.category || 'General' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">⚖️</div><span class="st2-info-label">Cargo weight</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ cargoWeight || '10,000' }} KGS</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">📅</div><span class="st2-info-label">Validity</span><span class="st2-info-colon">:</span><span class="st2-info-value">30 Sep 2025</span></div>
                    </div>
                    <div class="st2-route-card" style="background:#fafafa;">
                      <div class="st2-route-flags">
                        <div class="st2-flag-wrap">
                          <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag flag-circle" style="width:54px; height:54px; border-radius:50%; object-fit:cover;" :class="{'flag-circle': !['Thailand', 'Vietnam', 'Viet Nam'].includes(summaryOriginCountry)}"/>
                          <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                        </div>
                        <div class="st2-route-arrow" style="color:#9ca3af; padding-bottom: 20px;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </div>
                        <div class="st2-flag-wrap">
                          <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag flag-circle" style="width:54px; height:54px; border-radius:50%; object-fit:cover;" :class="{'flag-circle': !['Thailand', 'Vietnam', 'Viet Nam'].includes(summaryDestCountry)}"/>
                          <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="st2-charges-wrap" style="background:#fff; margin-top:20px;">
                  <div class="st2-carrier-select-wrap">
                    <div class="st2-carrier-select-title">SELECT CARRIER</div>
                    <div class="st2-carrier-select-field">
                      <select id="carrier-select" v-model="offeredCarrierName">
                        <option value="">-- Select a carrier --</option>
                        <option value="MAERSK">MAERSK</option>
                        <option value="EVERGREEN">EVERGREEN</option>
                        <option value="COSCO">COSCO</option>
                        <option value="MSC">MSC</option>
                        <option value="CMA CGM">CMA CGM</option>
                        <option value="HAPAG-LLOYD">HAPAG-LLOYD</option>
                        <option value="ONE">ONE</option>
                        <option value="YANG MING">YANG MING</option>
                        <option value="HMM">HMM</option>
                        <option value="ZIM">ZIM</option>
                      </select>
                      <svg class="st2-sel-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  <div v-show="offeredCarrierName" style="padding: 0 20px 20px;" id="schedule-wrap">
                    <br>
                    <div class="st2-carrier-header">{{ offeredCarrierName }}</div>
                    <div class="st2-carrier-subtitle">These dates and times are estimated and subject to change. All times are local.</div>
                    <div v-if="isFetchingOffered" class="st2-live-status">Loading Maersk live offers...</div>
                    <div v-else-if="selectedCarrierSchedule?.errorMessage" class="st2-live-status is-error">{{ selectedCarrierSchedule.errorMessage }}</div>
                    <div v-else-if="selectedCarrierSchedule?.pricingMessage" class="st2-live-status is-warning">{{ selectedCarrierSchedule.pricingMessage }}</div>
                    <div v-else-if="!groupedSailings.length" class="st2-live-status is-warning">No Maersk live offers were returned for this route.</div>
                    
                    <!-- Loop through grouped sailing dates -->
                    <template v-for="group in groupedSailings" :key="group.date">
                      <div class="st2-sail-date-header">📅 {{ group.date }}</div>

                      <div v-for="(s, idx) in group.list" :key="idx" class="st2-sail-card">
                        <!-- Info row -->
                        <div class="st2-sail-info-row">
                          <div class="st2-sail-info-cell">
                            <span class="st2-sail-info-label">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Departure
                            </span>
                            <span class="st2-sail-info-value">{{ s.departure }}</span>
                          </div>
                          <div class="st2-sail-info-cell">
                            <span class="st2-sail-info-label">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Arrival
                            </span>
                            <span class="st2-sail-info-value">{{ s.arrival }}</span>
                          </div>
                          <div class="st2-sail-info-cell">
                            <span class="st2-sail-info-label">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Gate-in deadline
                            </span>
                            <span class="st2-sail-info-value">{{ s.gateIn }}</span>
                          </div>
                          <div class="st2-sail-info-cell">
                            <span class="st2-sail-info-label">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg> Transit time
                            </span>
                            <span class="st2-sail-info-value">{{ s.transit }}</span>
                          </div>
                          <div class="st2-sail-info-cell">
                            <span class="st2-sail-info-label">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l2-11 7 4 7-4 2 11"/><path d="M3 17h18"/></svg> Vessel/voyage
                            </span>
                            <span class="st2-sail-info-value">{{ s.vessel }}</span>
                          </div>
                          <!-- Route link (disabled if sold out) -->
                          <span v-if="!s.soldOut" class="st2-sail-route-link" @click="toggleOfferedRoute(group.date + '_' + idx)" style="padding-top:10px;">Route &amp; other details{{ offeredSailingState[group.date + '_' + idx]?.showRoute ? ' ∧' : '' }}</span>
                          <span v-else class="st2-sail-route-link" style="opacity:0.35;cursor:not-allowed;pointer-events:none;text-decoration:none;padding-top:10px;">Route &amp; other details</span>
                        </div>

                        <!-- Price / sold-out row -->
                        <div :class="(s.soldOut || s.priceUnavailable) ? 'st2-sail-price-row is-sold-out' : 'st2-sail-price-row has-price'" style="align-items:center;">
                          <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                            <div class="st2-sail-live-badge"><span class="st2-sail-live-dot"></span> {{ s.spotName }}</div>
                            <button v-if="!s.soldOut && !s.priceUnavailable" class="st2-breakdown-toggle" :class="{ open: offeredSailingState[group.date + '_' + idx]?.showBreakdown }" @click="toggleOfferedBreakdown(group.date + '_' + idx)">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;"><polyline points="6 9 12 15 18 9"/></svg>
                              Price breakdown &amp; details
                            </button>
                          </div>

                          <!-- Sold out badge -->
                          <span v-if="s.soldOut" style="display:inline-flex; align-items:center; gap:5px; font-size:12px; color:#94a3b8; font-style:italic; background:#f1f5f9; padding:4px 10px; border-radius:20px; border:1px solid #e2e8f0; margin-left:auto; margin-right:16px;">🚫 Vessel sold out</span>
                          <span v-else-if="s.priceUnavailable" class="st2-price-unavailable">{{ s.priceUnavailableReason || 'Live price unavailable' }}</span>

                          <!-- Price tag (not sold out) -->
                          <div v-if="!s.soldOut && !s.priceUnavailable" class="st2-sail-price-tag">
                            <div class="price-main">{{ s.price }}</div>
                            <div v-if="s.freetime" class="price-sub">🔒 {{ s.freetime }}</div>
                          </div>

                          <!-- Action buttons -->
                          <div class="st2-sail-btns">
                            <button v-show="false" class="st2-sail-btn st2-cart-btn" :disabled="s.soldOut || s.priceUnavailable" :style="(s.soldOut || s.priceUnavailable) ? 'opacity:0.38;cursor:not-allowed;' : ''" @click="addSailingToCart(s, 'offered', offeredCarrierName, group.date + '_' + idx)">🛒 Add cart</button>
                            <button class="st2-sail-btn" :class="offeredSailingState[group.date + '_' + idx]?.selected ? 'st2-selected-active' : 'st2-purchase-active'" :disabled="s.soldOut || s.priceUnavailable" :style="(s.soldOut || s.priceUnavailable) ? 'opacity:0.38;cursor:not-allowed;' : ''" @click="toggleOfferedSelect(group.date + '_' + idx)">{{ offeredSailingState[group.date + '_' + idx]?.selected ? '✔ Selected' : '✔ Select' }}</button>
                          </div>
                        </div>

                        <!-- Price breakdown (only for non-sold-out) -->
                        <div v-if="!s.soldOut && !s.priceUnavailable" v-show="offeredSailingState[group.date + '_' + idx]?.showBreakdown" class="st2-breakdown-body" style="border-top: 1px solid #e2e8f0; border-bottom: none;">
                           <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                               <colgroup>
                                 <col class="st2-col-item" />
                                 <col class="st2-col-unit" />
                                 <col v-if="tableShow20" class="st2-col-20" />
                                 <col v-if="tableShow40" class="st2-col-40" />
                                 <col v-if="tableShow45" class="st2-col-45" />
                                 <col class="st2-col-cur" />
                                 <col class="st2-col-total" />
                               </colgroup>
                               <thead>
                                 <tr>
                                   <th>Item</th>
                                   <th class="th-unit">Unit</th>
                                   <th v-if="tableShow20">20'</th>
                                   <th v-if="tableShow40">40'</th>
                                   <th v-if="tableShow45">45'</th>
                                   <th>Currency</th>
                                   <th>Total price</th>
                                 </tr>
                               </thead>
                              <tbody>
                                <tr class="st2-tr-section st2-first-section"><td :colspan="4 + tableActiveCols">💲 <a style="color:#1f2937; text-decoration:underline; text-underline-offset:2px; cursor:pointer;">OCEAN FREIGHT</a></td></tr>
                                <tr class="st2-tr-sub st2-confirmed"><td :colspan="4 + tableActiveCols">🔒 Confirmed costs</td></tr>
                                <tr class="st2-tr-item">
                                  <td>Ocean freight charge</td><td>per Container</td>
                                  <td v-if="tableShow20">250.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>USD</td><td>250.00</td>
                                </tr>
                                <tr class="st2-tr-item">
                                  <td>Fuel surcharge</td><td>per Container</td>
                                  <td v-if="tableShow20">75.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>USD</td><td>75.00</td>
                                </tr>
                                <tr class="st2-tr-subtotal">
                                  <td class="blank"></td><td class="blank"></td><td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>275.00</td>
                                </tr>
                                <tr class="st2-tr-sub st2-conditional"><td :colspan="4 + tableActiveCols">🔴 Conditional costs (if incurred)</td></tr>
                                <tr class="st2-tr-item">
                                  <td class="st2-tr-item-dim-cell">Booking cancellation fee</td><td class="st2-tr-item-dim-cell">per Container</td>
                                  <td v-if="tableShow20" class="na">250.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">250.00</td>
                                </tr>
                                <tr class="st2-tr-item">
                                  <td class="st2-tr-item-dim-cell">Booking amendment fee</td><td class="st2-tr-item-dim-cell">per Container</td>
                                  <td v-if="tableShow20" class="na">75.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">75.00</td>
                                </tr>
                                <tr class="st2-tr-item">
                                  <td class="st2-tr-item-dim-cell">No show fee</td><td class="st2-tr-item-dim-cell">per Container</td>
                                  <td v-if="tableShow20" class="na">75.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">75.00</td>
                                </tr>
                                <tr class="st2-tr-subtotal">
                                  <td class="blank"></td><td class="blank"></td><td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>290.00</td>
                                </tr>

                                <tr class="st2-tr-section"><td :colspan="4 + tableActiveCols">💲 <a style="color:#1f2937; text-decoration:underline; text-underline-offset:2px; cursor:pointer;">ORIGINAL CHARGES</a></td></tr>
                                <tr class="st2-tr-sub st2-confirmed"><td :colspan="4 + tableActiveCols">🔒 Confirmed costs</td></tr>
                                <tr class="st2-tr-item">
                                  <td>Terminal handling charge</td><td>per Container</td>
                                  <td v-if="tableShow20">250.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>USD</td><td>250.00</td>
                                </tr>
                                <tr class="st2-tr-item">
                                  <td>Original Document fee</td><td>per Container</td>
                                  <td v-if="tableShow20">50.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>USD</td><td>50.00</td>
                                </tr>
                                <tr class="st2-tr-item">
                                  <td>Original misc. fee</td><td>per Container</td>
                                  <td v-if="tableShow20">10.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>USD</td><td>10.00</td>
                                </tr>
                                <tr class="st2-tr-subtotal">
                                  <td class="blank"></td><td class="blank"></td><td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>310.00</td>
                                </tr>
                                <tr class="st2-tr-sub st2-conditional"><td :colspan="4 + tableActiveCols">🔴 Conditional costs (if incurred)</td></tr>
                                <tr class="st2-tr-item">
                                  <td class="st2-tr-item-dim-cell">Telex release fee</td><td class="st2-tr-item-dim-cell">per Container</td>
                                  <td v-if="tableShow20" class="na">40.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">40.00</td>
                                </tr>
                                <tr class="st2-tr-item">
                                  <td class="st2-tr-item-dim-cell">Manifest submission fee</td><td class="st2-tr-item-dim-cell">per Container</td>
                                  <td v-if="tableShow20" class="na">35.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">35.00</td>
                                </tr>
                                <tr class="st2-tr-subtotal">
                                  <td class="blank"></td><td class="blank"></td><td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>75.00</td>
                                </tr>

                                <tr class="st2-tr-section"><td :colspan="4 + tableActiveCols">💲 <a style="color:#1f2937; text-decoration:underline; text-underline-offset:2px; cursor:pointer;">DESTINATION CHARGES</a></td></tr>
                                <tr class="st2-tr-sub st2-confirmed"><td :colspan="4 + tableActiveCols">🔒 Confirmed costs</td></tr>
                                <tr class="st2-tr-item">
                                  <td>Terminal handling charge</td><td>per Container</td>
                                  <td v-if="tableShow20">250.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>USD</td><td>250.00</td>
                                </tr>
                                <tr class="st2-tr-item">
                                  <td>Destination Document fee</td><td>per Container</td>
                                  <td v-if="tableShow20">50.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>USD</td><td>50.00</td>
                                </tr>
                                <tr class="st2-tr-item">
                                  <td>Container cleaning fee</td><td>per Container</td>
                                  <td v-if="tableShow20">10.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>USD</td><td>10.00</td>
                                </tr>
                                <tr class="st2-tr-subtotal">
                                  <td class="blank"></td><td class="blank"></td><td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>310.00</td>
                                </tr>
                                <tr class="st2-tr-sub st2-conditional"><td :colspan="4 + tableActiveCols">🔴 Conditional costs (if incurred)</td></tr>
                                <tr class="st2-tr-item">
                                  <td class="st2-tr-item-dim-cell">Container deposit</td><td class="st2-tr-item-dim-cell">per Container</td>
                                  <td v-if="tableShow20" class="na">40.00</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">40.00</td>
                                </tr>
                                <tr class="st2-tr-subtotal">
                                  <td class="blank"></td><td class="blank"></td><td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Total</td><td>40.00</td>
                                </tr>
                              </tbody>
                           </table>
                        </div>


                         <!-- Route panel (only for non-sold-out) -->

                         <div v-if="!s.soldOut" v-show="offeredSailingState[group.date + '_' + idx]?.showRoute" class="st2-route-panel">

                           <div class="st2-route-panel-inner">

                             <div class="st2-route-panel-subtitle">These dates and times are estimated and subject to change. All times are local.</div>

                             <div class="st2-route-two-col">

                               <div>

                                 <div class="st2-route-col-title">

                                   <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l2-11 7 4 7-4 2 11"/><path d="M3 17h18"/></svg>

                                   Route details

                                 </div>

                                 <!-- Stop 1: Origin departure -->

                                 <div class="st2-route-stop">

                                   <div class="st2-route-stop-left">

                                     <div class="st2-route-stop-port">Haiphong - Lach Huyen</div>

                                     <div class="st2-route-stop-terminal">Hateco Haiphong Intl Cntr Tml</div>

                                   </div>

                                   <div class="st2-route-stop-right">

                                     <div class="st2-route-action">Departing on <strong>GSL ALEXANDRA / 522E</strong></div>

                                     <div class="st2-route-action-time">1 Jun 2025, 09:00</div>

                                     <div class="st2-route-vessel-box">

                                       <span class="st2-route-vessel-label">IMO number</span>

                                       <span class="st2-route-vessel-label">Flag</span>

                                       <span class="st2-route-vessel-label">Service</span>

                                       <span class="st2-route-vessel-label">Call sign</span>

                                       <span class="st2-route-vessel-value">9698654</span>

                                       <span class="st2-route-vessel-value">VN</span>

                                       <span class="st2-route-vessel-value">522E</span>

                                       <span class="st2-route-vessel-value">—</span>

                                     </div>

                                   </div>

                                 </div>

                                 <!-- Stop 2: Transshipment arrival -->

                                 <div class="st2-route-stop">

                                   <div class="st2-route-stop-left">

                                     <div class="st2-route-stop-port">Shanghai</div>

                                     <div class="st2-route-stop-terminal">Yangshan SGH Guandong Terminal</div>

                                   </div>

                                   <div class="st2-route-stop-right">

                                     <div class="st2-route-action">Arrival</div>

                                     <div class="st2-route-action-time">17 Jun 2025, 00:01</div>

                                   </div>

                                 </div>

                                 <!-- Stop 3: Transshipment departure -->

                                 <div class="st2-route-stop">

                                   <div class="st2-route-stop-left">

                                     <div class="st2-route-stop-port">Shanghai</div>

                                     <div class="st2-route-stop-terminal">Yangshan SGH Guandong Terminal</div>

                                   </div>

                                   <div class="st2-route-stop-right">

                                     <div class="st2-route-action">Departing on <strong>MAERSK EUREKA / 526E</strong></div>

                                     <div class="st2-route-action-time">19 Jun 2025, 06:01</div>

                                     <div class="st2-route-vessel-box">

                                       <span class="st2-route-vessel-label">IMO number</span>

                                       <span class="st2-route-vessel-label">Flag</span>

                                       <span class="st2-route-vessel-label">Service</span>

                                       <span class="st2-route-vessel-label">Call sign</span>

                                       <span class="st2-route-vessel-value">9501239</span>

                                       <span class="st2-route-vessel-value">SG</span>

                                       <span class="st2-route-vessel-value">691</span>

                                       <span class="st2-route-vessel-value">—</span>

                                     </div>

                                   </div>

                                 </div>

                                 <!-- Stop 4: Destination arrival -->

                                 <div class="st2-route-stop">

                                   <div class="st2-route-stop-left">

                                     <div class="st2-route-stop-port">Ho Chi Minh</div>

                                     <div class="st2-route-stop-terminal">SSA Vietnam / Cat Lai</div>

                                   </div>

                                   <div class="st2-route-stop-right">

                                     <div class="st2-route-action">Arrival</div>

                                     <div class="st2-route-action-time">6 Jul 2025, 23:00</div>

                                   </div>

                                 </div>

                               </div>


                               <div>

                                 <div class="st2-deadlines-box">

                                   <div class="st2-deadlines-title">

                                     <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>

                                     Deadlines

                                   </div>

                                   <div class="st2-deadline-row"><span class="st2-deadline-label">Container Gate-In Deadline</span><span class="st2-deadline-value">{{ s.gateIn }}</span></div>

                                   <div class="st2-deadline-row"><span class="st2-deadline-label">VGM Submission Deadline</span><span class="st2-deadline-value">3 days before ETD</span></div>

                                   <div class="st2-deadline-row"><span class="st2-deadline-label">Shipping Instructions Deadline</span><span class="st2-deadline-value">2 days before ETD</span></div>

                                   <div class="st2-deadlines-note">

                                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>

                                     Your Shipping Instruction needs to be submitted by the specified deadline, otherwise there is a risk that your container(s) will not be loaded on the planned vessel.

                                   </div>

                                 </div>

                               </div>

                             </div>

                           </div>

                         </div>

                      </div>
                    </template>

                  </div>

                  <div class="st2-total-footer" style="border-top:2px solid #e5e7eb; padding:16px 18px;">
                    <span class="st2-total-label">TOTAL PRICE</span>
                    <div class="st2-total-amounts">
                      <div class="st2-total-row">
                        <span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span>
                        <span class="st2-t-amount">{{ selectedCarrierSchedule?.fixed || 'USD —' }}</span>
                      </div>
                      <div class="st2-total-row">
                        <span class="st2-t-tag st2-conditional">🔴 Conditional:</span>
                        <span class="st2-t-amount">{{ selectedCarrierSchedule?.potential || 'USD —' }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- Search more link — below TOTAL PRICE -->
                  <div v-if="offeredCarrierName" style="text-align:center; padding: 16px 0 20px; border-top: 1px solid #e2e8f0;">
                    <button style="background:linear-gradient(135deg,#0ea5e9,#06b6d4);color:#fff;border:none;padding:12px 36px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(14,165,233,0.3);">
                      🔍 Search more sailing options
                    </button>
                  </div>
                </div>
              </template>

              <!-- ST2 Format for bookingSpot -->
              <template v-else-if="svcId === 'bookingSpot'">
                <div class="st2-info-card">
                  <div class="st2-info-left" style="background:#fafafa;">
                    <div class="st2-at-origin-header">
                      <div class="st2-origin-icon" style="background: linear-gradient(135deg, #dcfce7, #bbf7d0);">🚢</div>
                      <span class="st2-at-origin-label">SEA FREIGHT</span>
                      <div class="st2-at-origin-divider"></div>
                    </div>
                    <div class="st2-service-card">
                      <div class="st2-svc-top">
                        <span class="st2-truck-icon">
                          <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 27 Q6 24 10 27 Q14 30 18 27 Q22 24 26 27 Q30 30 34 27 L34 34 L2 34 Z" fill="#bbf7d0"/>
                            <path d="M2 30 Q6 27 10 30 Q14 33 18 30 Q22 27 26 30 Q30 33 34 30 L34 34 L2 34 Z" fill="#86efac"/>
                            <path d="M6 26 L8 18 L28 18 L30 26 Z" fill="#15803d"/>
                            <line x1="6" y1="22" x2="30" y2="22" stroke="#16a34a" stroke-width="1"/>
                            <rect x="11" y="10" width="14" height="8" rx="1.5" fill="#166534"/>
                            <rect x="13" y="12" width="3" height="2.5" rx="0.5" fill="#bbf7d0"/>
                            <rect x="17" y="12" width="3" height="2.5" rx="0.5" fill="#bbf7d0"/>
                            <rect x="21" y="12" width="1.5" height="2.5" rx="0.5" fill="#bbf7d0"/>
                            <rect x="17" y="5" width="4" height="6" rx="1" fill="#14532d"/>
                            <rect x="16.5" y="4" width="5" height="2" rx="0.8" fill="#14532d"/>
                            <circle cx="17" cy="3.5" r="1" fill="#9ca3af" opacity="0.6"/>
                            <circle cx="19" cy="2.5" r="1.2" fill="#9ca3af" opacity="0.4"/>
                            <line x1="19" y1="5" x2="19" y2="2" stroke="#14532d" stroke-width="1.2"/>
                            <line x1="13" y1="18" x2="13" y2="14" stroke="#86efac" stroke-width="1"/>
                            <line x1="23" y1="18" x2="23" y2="14" stroke="#86efac" stroke-width="1"/>
                          </svg>
                        </span>
                        <div class="st2-svc-name" style="color:#15803d;" v-html="fmtSvcName('Place booking at SPOT rate')"></div>
                      </div>
                      <div class="st2-svc-desc" style="margin-top:6px;">
                        <span class="st2-info-badge">i</span>
                        <span style="font-size:11px;">Shoptrans will show you the actual SPOT rate of multiple shipping lines and service contract is filed directly under Shoptrans name.</span>
                      </div>
                    </div>
                  </div>
                  <div class="st2-info-right" style="background:#fff;">
                    <div class="st2-info-details">
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of loading</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryFromPort }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of destination</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryToPort }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">💳</div><span class="st2-info-label">Freight</span><span class="st2-info-colon">:</span><span class="st2-info-value">PREPAID</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Volume</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedContainerType || '1×20GP' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏷️</div><span class="st2-info-label">Cargo type</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedCommodity?.category || 'General' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">⚖️</div><span class="st2-info-label">Cargo weight</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ cargoWeight || '10,000' }} KGS</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">📅</div><span class="st2-info-label">Validity</span><span class="st2-info-colon">:</span><span class="st2-info-value">30 Sep 2025</span></div>
                    </div>
                    <div class="st2-route-card" style="background:#fafafa;">
                      <div class="st2-route-flags">
                        <div class="st2-flag-wrap">
                          <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag flag-circle" style="width:54px; height:54px; border-radius:50%; object-fit:cover;"/>
                          <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                        </div>
                        <div class="st2-route-arrow" style="color:#9ca3af; padding-bottom: 20px;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </div>
                        <div class="st2-flag-wrap">
                          <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag flag-circle" style="width:54px; height:54px; border-radius:50%; object-fit:cover;"/>
                          <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- SPOT Carrier selector + Schedule -->
                <div class="st2-charges-wrap" style="background:#fff; margin-top:20px;">
                  <div class="st2-carrier-select-wrap">
                    <div class="st2-carrier-select-title">SELECT CARRIER</div>
                    <div class="st2-carrier-select-field">
                      <select id="spot-carrier-select" v-model="spotCarrierName">
                        <option value="">-- Select a carrier --</option>
                        <option value="MAERSK">MAERSK</option>
                        <option value="EVERGREEN">EVERGREEN</option>
                        <option value="COSCO">COSCO</option>
                        <option value="MSC">MSC</option>
                        <option value="CMA CGM">CMA CGM</option>
                        <option value="HAPAG-LLOYD">HAPAG-LLOYD</option>
                        <option value="ONE">ONE</option>
                        <option value="YANG MING">YANG MING</option>
                        <option value="HMM">HMM</option>
                        <option value="ZIM">ZIM</option>
                      </select>
                      <svg class="st2-sel-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>

                  <!-- Schedule results -->
                  <div v-show="spotCarrierName" style="padding: 0 20px 20px;">
                    <br>
                    <!-- SPOT: green gradient header -->
                    <div class="st2-carrier-header" style="background: linear-gradient(135deg, #15803d, #22c55e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">{{ spotCarrierName }}</div>
                    <div class="st2-carrier-subtitle">These dates and times are estimated and subject to change. All times are local.</div>
                    <div v-if="isFetchingSpot" class="st2-live-status">Loading Maersk live SPOT offers...</div>
                    <div v-else-if="spotCarrierSchedule?.errorMessage" class="st2-live-status is-error">{{ spotCarrierSchedule.errorMessage }}</div>
                    <div v-else-if="spotCarrierSchedule?.pricingMessage" class="st2-live-status is-warning">{{ spotCarrierSchedule.pricingMessage }}</div>
                    <div v-else-if="!groupedSpotSailings.length" class="st2-live-status is-warning">No Maersk live SPOT offers were returned for this route.</div>

                    <template v-for="group in groupedSpotSailings" :key="group.date">
                      <div class="st2-sail-date-header">📅 {{ group.date }}</div>

                      <div v-for="(s, idx) in group.list" :key="idx" class="st2-sail-card">
                        <!-- Info row -->
                        <div class="st2-sail-info-row">
                          <div class="st2-sail-info-cell">
                            <span class="st2-sail-info-label">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Departure
                            </span>
                            <span class="st2-sail-info-value">{{ s.departure }}</span>
                          </div>
                          <div class="st2-sail-info-cell">
                            <span class="st2-sail-info-label">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Arrival
                            </span>
                            <span class="st2-sail-info-value">{{ s.arrival }}</span>
                          </div>
                          <div class="st2-sail-info-cell">
                            <span class="st2-sail-info-label">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Gate-in deadline
                            </span>
                            <span class="st2-sail-info-value">{{ s.gateIn }}</span>
                          </div>
                          <div class="st2-sail-info-cell">
                            <span class="st2-sail-info-label">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg> Transit time
                            </span>
                            <span class="st2-sail-info-value">{{ s.transit }}</span>
                          </div>
                          <div class="st2-sail-info-cell">
                            <span class="st2-sail-info-label">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l2-11 7 4 7-4 2 11"/><path d="M3 17h18"/></svg> Vessel/voyage
                            </span>
                            <span class="st2-sail-info-value">{{ s.vessel }}</span>
                          </div>
                          <span v-if="!s.soldOut" class="st2-sail-route-link" @click="toggleSpotRoute(group.date + '_' + idx)" style="padding-top:10px;">Route &amp; other details{{ spotSailingState[group.date + '_' + idx]?.showRoute ? ' ∧' : '' }}</span>
                          <span v-else class="st2-sail-route-link" style="opacity:0.35;cursor:not-allowed;pointer-events:none;text-decoration:none;padding-top:10px;">Route &amp; other details</span>
                        </div>

                        <!-- Price row — SPOT style: green live dot + amber Select button -->
                        <div :class="(s.soldOut || s.priceUnavailable) ? 'st2-sail-price-row is-sold-out' : 'st2-sail-price-row has-price'" style="align-items:center; background: linear-gradient(90deg, #fff 60%, #f0fdf4 100%);">
                          <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                            <!-- SPOT badge: "MAERSK SPOT" green style -->
                            <div class="st2-sail-live-badge">
                              <span class="st2-sail-live-dot" style="background:#16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.2);"></span>
                              <span style="color:#15803d; font-weight:700;">{{ spotCarrierName }} SPOT</span>
                            </div>
                            <button v-if="!s.soldOut && !s.priceUnavailable" class="st2-breakdown-toggle" :class="{ open: spotSailingState[group.date + '_' + idx]?.showBreakdown }" @click="toggleSpotBreakdown(group.date + '_' + idx)">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;"><polyline points="6 9 12 15 18 9"/></svg>
                              Price breakdown &amp; details
                            </button>
                          </div>

                          <span v-if="s.soldOut" style="display:inline-flex; align-items:center; gap:5px; font-size:12px; color:#94a3b8; font-style:italic; background:#f1f5f9; padding:4px 10px; border-radius:20px; border:1px solid #e2e8f0; margin-left:auto; margin-right:16px;">🚫 Vessel sold out</span>
                          <span v-else-if="s.priceUnavailable" class="st2-price-unavailable">{{ s.priceUnavailableReason || 'Live price unavailable' }}</span>

                          <div v-if="!s.soldOut && !s.priceUnavailable" class="st2-sail-price-tag">
                            <div class="price-main">{{ s.price }}</div>
                            <div v-if="s.freetime" class="price-sub">🔒 {{ s.freetime }}</div>
                          </div>

                          <div class="st2-sail-btns">
                            <button v-show="false" class="st2-sail-btn st2-cart-btn" :disabled="s.soldOut || s.priceUnavailable" :style="(s.soldOut || s.priceUnavailable) ? 'opacity:0.38;cursor:not-allowed;' : ''" @click="addSailingToCart(s, 'spot', spotCarrierName, group.date + '_' + idx)">🛒 Add cart</button>
                            <!-- SPOT: amber/yellow Select button -->
                            <button class="st2-sail-btn" :class="spotSailingState[group.date + '_' + idx]?.selected ? 'st2-selected-active' : 'st2-purchase-active'" :disabled="s.soldOut || s.priceUnavailable" :style="(s.soldOut || s.priceUnavailable) ? 'opacity:0.38;cursor:not-allowed;' : ''" @click="toggleSpotSelect(group.date + '_' + idx)">{{ spotSailingState[group.date + '_' + idx]?.selected ? '✔ Selected' : '✔ Select' }}</button>
                          </div>
                        </div>

                        <!-- Price breakdown (non-sold-out) -->
                        <div v-if="!s.soldOut && !s.priceUnavailable" v-show="spotSailingState[group.date + '_' + idx]?.showBreakdown" class="st2-breakdown-body" style="border-top: 1px solid #e2e8f0;">
                           <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                               <colgroup>
                                 <col class="st2-col-item" />
                                 <col class="st2-col-unit" />
                                 <col v-if="tableShow20" class="st2-col-20" />
                                 <col v-if="tableShow40" class="st2-col-40" />
                                 <col v-if="tableShow45" class="st2-col-45" />
                                 <col class="st2-col-cur" />
                                 <col class="st2-col-cur" />
                                 <col class="st2-col-total" />
                               </colgroup>
                               <thead>
                                 <tr>
                                   <th>Item</th>
                                   <th class="th-unit">Unit</th>
                                   <th v-if="tableShow20">20'</th>
                                   <th v-if="tableShow40">40'</th>
                                   <th v-if="tableShow45">45'</th>
                                   <th>B/L</th>
                                   <th>Currency</th>
                                   <th>Total price</th>
                                 </tr>
                               </thead>
                              <tbody>
                                <tr class="st2-tr-section st2-first-section"><td :colspan="5 + tableActiveCols">💲 <a style="color:#1f2937; text-decoration:underline; text-underline-offset:2px; cursor:pointer;">OCEAN FREIGHT</a></td></tr>
                                <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed costs</td></tr>
                                <tr class="st2-tr-item"><td>Ocean freight charge</td><td>per Container</td><td v-if="tableShow20">250.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td>USD</td><td>250.00</td></tr>
                                <tr class="st2-tr-item"><td>Fuel surcharge</td><td>per Container</td><td v-if="tableShow20">75.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td>USD</td><td>75.00</td></tr>
                                <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>275.00</td></tr>
                                <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional costs (if incurred)</td></tr>
                                <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Booking cancellation fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">250.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">250.00</td></tr>
                                <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Booking amendment fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">75.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">75.00</td></tr>
                                <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">No show fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">75.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">75.00</td></tr>
                                <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>290.00</td></tr>

                                <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a style="color:#1f2937; text-decoration:underline; text-underline-offset:2px; cursor:pointer;">ORIGINAL CHARGES</a></td></tr>
                                <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed costs</td></tr>
                                <tr class="st2-tr-item"><td>Terminal handling charge</td><td>per Container</td><td v-if="tableShow20">250.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td>USD</td><td>250.00</td></tr>
                                <tr class="st2-tr-item"><td>Original Document fee</td><td>per Container</td><td v-if="tableShow20">50.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td>USD</td><td>50.00</td></tr>
                                <tr class="st2-tr-item"><td>Original misc. fee</td><td>per Container</td><td v-if="tableShow20">10.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td>USD</td><td>10.00</td></tr>
                                <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>310.00</td></tr>
                                <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional costs (if incurred)</td></tr>
                                <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Telex release fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">40.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">40.00</td></tr>
                                <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Manifest submission fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">35.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">35.00</td></tr>
                                <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>75.00</td></tr>

                                <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a style="color:#1f2937; text-decoration:underline; text-underline-offset:2px; cursor:pointer;">DESTINATION CHARGES</a></td></tr>
                                <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed costs</td></tr>
                                <tr class="st2-tr-item"><td>Terminal handling charge</td><td>per Container</td><td v-if="tableShow20">250.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td>USD</td><td>250.00</td></tr>
                                <tr class="st2-tr-item"><td>Destination Document fee</td><td>per Container</td><td v-if="tableShow20">50.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td>USD</td><td>50.00</td></tr>
                                <tr class="st2-tr-item"><td>Container cleaning fee</td><td>per Container</td><td v-if="tableShow20">10.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td>USD</td><td>10.00</td></tr>
                                <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>310.00</td></tr>
                                <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional costs (if incurred)</td></tr>
                                <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Container deposit</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">40.00×1</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">40.00</td></tr>
                                <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Total</td><td>40.00</td></tr>

                                <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a style="color:#1f2937; text-decoration:underline; text-underline-offset:2px; cursor:pointer;">AGENT HANDLING CHARGES</a></td></tr>
                                <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed costs</td></tr>
                                <tr class="st2-tr-item"><td>Handling fee</td><td>per Container</td><td v-if="tableShow20">50.00×1</td><td v-if="tableShow40">50.00×1</td><td v-if="tableShow45" class="na">—</td><td class="na">—</td><td>USD</td><td>100.00</td></tr>
                                <tr class="st2-tr-item"><td>Banking fee</td><td>per Transaction</td><td v-if="tableShow20" class="na">—</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>30.00</td><td>USD</td><td>30.00</td></tr>
                                <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>130.00</td></tr>
                              </tbody>
                           </table>
                        </div>

                         <!-- Route panel SPOT (only for non-sold-out) -->
                         <div v-if="!s.soldOut" v-show="spotSailingState[group.date + '_' + idx]?.showRoute" class="st2-route-panel">
                           <div class="st2-route-panel-inner">
                             <div class="st2-route-panel-subtitle">These dates and times are estimated and subject to change. All times are local.</div>
                             <div class="st2-route-two-col">
                               <div>
                                 <div class="st2-route-col-title">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l2-11 7 4 7-4 2 11"/><path d="M3 17h18"/></svg>
                                   Route details
                                 </div>
                                 <div class="st2-route-stop">
                                   <div class="st2-route-stop-left"><div class="st2-route-stop-port">Haiphong - Lach Huyen</div><div class="st2-route-stop-terminal">Hateco Haiphong Intl Cntr Tml</div></div>
                                   <div class="st2-route-stop-right">
                                     <div class="st2-route-action">Departing on <strong>GSL ALEXANDRA / 522E</strong></div>
                                     <div class="st2-route-action-time">1 Jun 2025, 09:00</div>
                                     <div class="st2-route-vessel-box">
                                       <span class="st2-route-vessel-label">IMO number</span>
                                       <span class="st2-route-vessel-label">Flag</span>
                                       <span class="st2-route-vessel-label">Service</span>
                                       <span class="st2-route-vessel-label">Call sign</span>
                                       <span class="st2-route-vessel-value">9698654</span>
                                       <span class="st2-route-vessel-value">VN</span>
                                       <span class="st2-route-vessel-value">522E</span>
                                       <span class="st2-route-vessel-value">—</span>
                                     </div>
                                   </div>
                                 </div>
                                 <div class="st2-route-stop">
                                   <div class="st2-route-stop-left"><div class="st2-route-stop-port">Shanghai</div><div class="st2-route-stop-terminal">Yangshan SGH Guandong Terminal</div></div>
                                   <div class="st2-route-stop-right">
                                     <div class="st2-route-action">Arrival</div>
                                     <div class="st2-route-action-time">17 Jun 2025, 00:01</div>
                                   </div>
                                 </div>
                                 <div class="st2-route-stop">
                                   <div class="st2-route-stop-left"><div class="st2-route-stop-port">Shanghai</div><div class="st2-route-stop-terminal">Yangshan SGH Guandong Terminal</div></div>
                                   <div class="st2-route-stop-right">
                                     <div class="st2-route-action">Departing on <strong>MAERSK EUREKA / 526E</strong></div>
                                     <div class="st2-route-action-time">19 Jun 2025, 06:01</div>
                                     <div class="st2-route-vessel-box">
                                       <span class="st2-route-vessel-label">IMO number</span>
                                       <span class="st2-route-vessel-label">Flag</span>
                                       <span class="st2-route-vessel-label">Service</span>
                                       <span class="st2-route-vessel-label">Call sign</span>
                                       <span class="st2-route-vessel-value">9501239</span>
                                       <span class="st2-route-vessel-value">SG</span>
                                       <span class="st2-route-vessel-value">691</span>
                                       <span class="st2-route-vessel-value">—</span>
                                     </div>
                                   </div>
                                 </div>
                                 <div class="st2-route-stop">
                                   <div class="st2-route-stop-left"><div class="st2-route-stop-port">Ho Chi Minh</div><div class="st2-route-stop-terminal">SSA Vietnam / Cat Lai</div></div>
                                   <div class="st2-route-stop-right">
                                     <div class="st2-route-action">Arrival</div>
                                     <div class="st2-route-action-time">6 Jul 2025, 23:00</div>
                                   </div>
                                 </div>
                               </div>
                               <div>
                                 <div class="st2-deadlines-box">
                                   <div class="st2-deadlines-title">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                     Deadlines
                                   </div>
                                   <div class="st2-deadline-row"><span class="st2-deadline-label">Container Gate-In Deadline</span><span class="st2-deadline-value">29 May 2025, 18:30</span></div>
                                   <div class="st2-deadline-row"><span class="st2-deadline-label">VGM Submission Deadline</span><span class="st2-deadline-value">29 May 2025, 04:00</span></div>
                                   <div class="st2-deadline-row"><span class="st2-deadline-label">Latest Container Pick-up Deadline</span><span class="st2-deadline-value">29 May 2025, 06:00</span></div>
                                   <div class="st2-deadline-row"><span class="st2-deadline-label">Shipping Instructions Deadline</span><span class="st2-deadline-value">29 May 2025, 04:00</span></div>
                                   <div class="st2-deadline-row"><span class="st2-deadline-label">SI Deadline (Advance Manifest)</span><span class="st2-deadline-value">27 May 2025, 22:00</span></div>
                                   <div class="st2-deadlines-note">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                     Your Shipping Instruction needs to be submitted by the specified deadline, otherwise there is a risk that your container(s) will not be loaded on the planned vessel.
                                   </div>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </div>
                      </div>
                    </template>

                  </div>

                  <div class="st2-total-footer" style="border-top:2px solid #e5e7eb; padding:16px 18px;">
                    <span class="st2-total-label">TOTAL PRICE</span>
                    <div class="st2-total-amounts">
                      <div class="st2-total-row">
                        <span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span>
                        <span class="st2-t-amount">{{ spotCarrierSchedule?.fixed || 'USD —' }}</span>
                      </div>
                      <div class="st2-total-row">
                        <span class="st2-t-tag st2-conditional">🔴 Conditional:</span>
                        <span class="st2-t-amount">{{ spotCarrierSchedule?.potential || 'USD —' }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- Search more — below TOTAL PRICE -->
                  <div v-if="spotCarrierName" style="text-align:center; padding: 16px 0 20px; border-top: 1px solid #e2e8f0;">
                    <button style="background:linear-gradient(135deg,#0ea5e9,#06b6d4);color:#fff;border:none;padding:12px 36px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(14,165,233,0.3);">
                      🔍 Search more sailing options
                    </button>
                  </div>
                </div>
              </template>

              <!-- ST2 Format for handleUnderAvailable -->
              <template v-else-if="svcId === 'handleUnderAvailable'">
                <div class="st2-info-card">
                  <div class="st2-info-left" style="background:#fafafa;">
                    <div class="st2-at-origin-header">
                      <div class="st2-origin-icon" style="background: linear-gradient(135deg, #dbeafe, #bfdbfe);">🚢</div>
                      <span class="st2-at-origin-label">SEA FREIGHT</span>
                      <div class="st2-at-origin-divider"></div>
                    </div>
                    <div class="st2-service-card">
                      <div class="st2-svc-top">
                        <span class="st2-truck-icon">
                          <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 27 Q6 24 10 27 Q14 30 18 27 Q22 24 26 27 Q30 30 34 27 L34 34 L2 34 Z" fill="#bfdbfe"/>
                            <path d="M2 30 Q6 27 10 30 Q14 33 18 30 Q22 27 26 30 Q30 33 34 30 L34 34 L2 34 Z" fill="#93c5fd"/>
                            <path d="M6 26 L8 18 L28 18 L30 26 Z" fill="#1d4ed8"/>
                            <line x1="6" y1="22" x2="30" y2="22" stroke="#3b82f6" stroke-width="1"/>
                            <rect x="11" y="10" width="14" height="8" rx="1.5" fill="#2563eb"/>
                            <rect x="13" y="12" width="3" height="2.5" rx="0.5" fill="#bfdbfe"/>
                            <rect x="17" y="12" width="3" height="2.5" rx="0.5" fill="#bfdbfe"/>
                            <rect x="21" y="12" width="1.5" height="2.5" rx="0.5" fill="#bfdbfe"/>
                            <rect x="17" y="5" width="4" height="6" rx="1" fill="#1e40af"/>
                            <rect x="16.5" y="4" width="5" height="2" rx="0.8" fill="#1e40af"/>
                            <circle cx="17" cy="3.5" r="1" fill="#9ca3af" opacity="0.6"/>
                            <circle cx="19" cy="2.5" r="1.2" fill="#9ca3af" opacity="0.4"/>
                            <line x1="19" y1="5" x2="19" y2="2" stroke="#1e3a8a" stroke-width="1.2"/>
                            <line x1="13" y1="18" x2="13" y2="14" stroke="#93c5fd" stroke-width="1"/>
                            <line x1="23" y1="18" x2="23" y2="14" stroke="#93c5fd" stroke-width="1"/>
                          </svg>
                        </span>
                        <div class="st2-svc-name" v-html="fmtSvcName('Handle the shipment under an available booking')"></div>
                      </div>
                      <div class="st2-svc-desc" style="margin-top:6px;">
                        <span class="st2-info-badge">i</span>
                        <span style="font-size:11px;">Shoptrans will act as your operation agent, will use your available booking to arrange export business with shipper.</span>
                      </div>
                    </div>
                  </div>
                  <div class="st2-info-right" style="background:#fff;">
                    <div class="st2-info-details">
                      <div class="st2-info-row"><div class="st2-info-icon-wrap"><svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#6b7280" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l2-11 7 4 7-4 2 11"/><path d="M3 17h18"/><path d="M12 6V2"/></svg></div><span class="st2-info-label">Carrier</span><span class="st2-info-colon">:</span><span class="st2-info-value" style="font-weight:700;color:#1f2937;">{{ detailedFormAvailable?.shippingLine?.toUpperCase() || '—' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of loading</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryFromPort }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of destination</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryToPort }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">💳</div><span class="st2-info-label">Freight</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ detailedFormAvailable?.freightTerm?.toUpperCase() || 'PREPAID' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Volume</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedContainerType || '1×20GP' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏷️</div><span class="st2-info-label">Cargo type</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedCommodity?.category || 'General' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">⚖️</div><span class="st2-info-label">Cargo weight</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ cargoWeight || '10,000' }} KGS</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">📅</div><span class="st2-info-label">Validity</span><span class="st2-info-colon">:</span><span class="st2-info-value">30 Sep 2025</span></div>
                    </div>
                    <div class="st2-route-card" style="background:#fafafa;">
                      <div class="st2-route-flags">
                        <div class="st2-flag-wrap">
                          <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag flag-circle" style="width:54px; height:54px; border-radius:50%; object-fit:cover;"/>
                          <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                        </div>
                        <div class="st2-route-arrow" style="color:#9ca3af; padding-bottom: 20px;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </div>
                        <div class="st2-flag-wrap">
                          <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag flag-circle" style="width:54px; height:54px; border-radius:50%; object-fit:cover;"/>
                          <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Charges table (AGENT HANDLING only — ocean/origin/dest paid by client directly) -->
                <div class="st2-charges-wrap" style="background:#fff; margin-top:20px;">
                  <div class="st2-carrier-select-wrap">
                    <div class="st2-carrier-select-title">AGENT HANDLING CHARGES</div>
                  </div>
                  <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                    <colgroup>
                      <col class="st2-col-item" />
                      <col class="st2-col-unit" />
                      <col v-if="tableShow20" class="st2-col-20" />
                      <col v-if="tableShow40" class="st2-col-40" />
                      <col v-if="tableShow45" class="st2-col-45" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-total" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th class="th-unit">Unit</th>
                        <th v-if="tableShow20">20'</th>
                        <th v-if="tableShow40">40'</th>
                        <th v-if="tableShow45">45'</th>
                        <th>Currency</th>
                        <th>Total price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="st2-tr-section st2-first-section"><td :colspan="4 + tableActiveCols">💲 <a style="color:#1f2937; text-decoration:underline; text-underline-offset:2px; cursor:pointer;">AGENT HANDLING CHARGES</a></td></tr>
                      <tr class="st2-tr-sub st2-confirmed"><td :colspan="4 + tableActiveCols">🔒 Confirmed costs</td></tr>
                      <tr class="st2-tr-item"><td>Handling fee</td><td>per Container</td><td v-if="tableShow20">50.00×1</td><td v-if="tableShow40">50.00×1</td><td v-if="tableShow45" class="na">—</td><td>USD</td><td>100.00</td></tr>
                      <tr class="st2-tr-item"><td>Banking fee</td><td>per Transaction</td><td v-if="tableShow20" class="na">—</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>USD</td><td>30.00</td></tr>
                      <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>130.00</td></tr>
                    </tbody>
                  </table>
                  <div class="st2-total-footer" style="border-top:2px solid #e5e7eb; padding:16px 18px;">
                    <span class="st2-total-label">TOTAL PRICE</span>
                    <div class="st2-total-amounts">
                      <div class="st2-total-row">
                        <span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span>
                        <span class="st2-t-amount">USD 130.00</span>
                      </div>
                      <div class="st2-total-row">
                        <span class="st2-t-tag st2-conditional">🔴 Conditional:</span>
                        <span class="st2-t-amount">USD —</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <!-- ST2 Format for serviceContract -->
              <template v-else-if="svcId === 'serviceContract'">
                <div class="st2-info-card">
                  <div class="st2-info-left" style="background:#fafafa;">
                    <div class="st2-at-origin-header">
                      <div class="st2-origin-icon" style="background: linear-gradient(135deg, #dbeafe, #bfdbfe);">🚢</div>
                      <span class="st2-at-origin-label">SEA FREIGHT</span>
                      <div class="st2-at-origin-divider"></div>
                    </div>
                    <div class="st2-service-card">
                      <div class="st2-svc-top">
                        <span class="st2-truck-icon">
                          <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 27 Q6 24 10 27 Q14 30 18 27 Q22 24 26 27 Q30 30 34 27 L34 34 L2 34 Z" fill="#bfdbfe"/>
                            <path d="M2 30 Q6 27 10 30 Q14 33 18 30 Q22 27 26 30 Q30 33 34 30 L34 34 L2 34 Z" fill="#93c5fd"/>
                            <path d="M6 26 L8 18 L28 18 L30 26 Z" fill="#1d4ed8"/>
                            <line x1="6" y1="22" x2="30" y2="22" stroke="#3b82f6" stroke-width="1"/>
                            <rect x="11" y="10" width="14" height="8" rx="1.5" fill="#2563eb"/>
                            <rect x="13" y="12" width="3" height="2.5" rx="0.5" fill="#bfdbfe"/>
                            <rect x="17" y="12" width="3" height="2.5" rx="0.5" fill="#bfdbfe"/>
                            <rect x="21" y="12" width="1.5" height="2.5" rx="0.5" fill="#bfdbfe"/>
                            <rect x="17" y="5" width="4" height="6" rx="1" fill="#1e40af"/>
                            <rect x="16.5" y="4" width="5" height="2" rx="0.8" fill="#1e40af"/>
                            <circle cx="17" cy="3.5" r="1" fill="#9ca3af" opacity="0.6"/>
                            <circle cx="19" cy="2.5" r="1.2" fill="#9ca3af" opacity="0.4"/>
                            <line x1="19" y1="5" x2="19" y2="2" stroke="#1e3a8a" stroke-width="1.2"/>
                            <line x1="13" y1="18" x2="13" y2="14" stroke="#93c5fd" stroke-width="1"/>
                            <line x1="23" y1="18" x2="23" y2="14" stroke="#93c5fd" stroke-width="1"/>
                          </svg>
                        </span>
                        <div class="st2-svc-name" v-html="fmtSvcName('Place booking under available service contract / quotation')"></div>
                      </div>
                      <div class="st2-svc-desc" style="margin-top:6px;">
                        <span class="st2-info-badge">i</span>
                        <span style="font-size:11px;">Shoptrans will act as your operation agent, will use your available contract / quotation to place booking with carrier and arrange export business with shipper.</span>
                      </div>
                    </div>
                  </div>
                  <div class="st2-info-right" style="background:#fff;">
                    <div class="st2-info-details">
                      <div class="st2-info-row"><div class="st2-info-icon-wrap"><svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#6b7280" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l2-11 7 4 7-4 2 11"/><path d="M3 17h18"/><path d="M12 6V2"/></svg></div><span class="st2-info-label">Carrier</span><span class="st2-info-colon">:</span><span class="st2-info-value" style="font-weight:700;color:#1f2937;">{{ detailedFormContract?.shippingLine?.toUpperCase() || detailedFormAvailable?.shippingLine?.toUpperCase() || '—' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of loading</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryFromPort }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of destination</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryToPort }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">💳</div><span class="st2-info-label">Freight</span><span class="st2-info-colon">:</span><span class="st2-info-value">PREPAID</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Volume</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedContainerType || '1×20GP' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏷️</div><span class="st2-info-label">Cargo type</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedCommodity?.category || 'General' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">⚖️</div><span class="st2-info-label">Cargo weight</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ cargoWeight || '10,000' }} KGS</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">📅</div><span class="st2-info-label">Validity</span><span class="st2-info-colon">:</span><span class="st2-info-value">30 Sep 2025</span></div>
                    </div>
                    <div class="st2-route-card" style="background:#fafafa;">
                      <div class="st2-route-flags">
                        <div class="st2-flag-wrap">
                          <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag flag-circle" style="width:54px; height:54px; border-radius:50%; object-fit:cover;"/>
                          <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                        </div>
                        <div class="st2-route-arrow" style="color:#9ca3af; padding-bottom: 20px;">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </div>
                        <div class="st2-flag-wrap">
                          <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag flag-circle" style="width:54px; height:54px; border-radius:50%; object-fit:cover;"/>
                          <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Agent Handling Charges table (no carrier selector needed — contract is already with client's carrier) -->
                <div class="st2-charges-wrap" style="background:#fff; margin-top:20px;">
                  <div class="st2-carrier-select-wrap">
                    <div class="st2-carrier-select-title">AGENT HANDLING CHARGES</div>
                  </div>
                  <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                    <colgroup>
                      <col class="st2-col-item" />
                      <col class="st2-col-unit" />
                      <col v-if="tableShow20" class="st2-col-20" />
                      <col v-if="tableShow40" class="st2-col-40" />
                      <col v-if="tableShow45" class="st2-col-45" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-total" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th class="th-unit">Unit</th>
                        <th v-if="tableShow20">20'</th>
                        <th v-if="tableShow40">40'</th>
                        <th v-if="tableShow45">45'</th>
                        <th>B/L</th>
                        <th>Currency</th>
                        <th>Total price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="st2-tr-section st2-first-section"><td :colspan="5 + tableActiveCols">💲 <a style="color:#1f2937; text-decoration:underline; text-underline-offset:2px; cursor:pointer;">AGENT HANDLING CHARGES</a></td></tr>
                      <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed costs</td></tr>
                      <tr class="st2-tr-item">
                        <td>Handling fee</td>
                        <td>per Container</td>
                        <td v-if="tableShow20">50.00×1</td>
                        <td v-if="tableShow40">50.00×1</td>
                        <td v-if="tableShow45" class="na">—</td>
                        <td class="na">—</td>
                        <td>USD</td>
                        <td>100.00</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Banking fee</td>
                        <td>per Transaction</td>
                        <td v-if="tableShow20" class="na">—</td>
                        <td v-if="tableShow40" class="na">—</td>
                        <td v-if="tableShow45" class="na">—</td>
                        <td>30.00</td>
                        <td>USD</td>
                        <td>30.00</td>
                      </tr>
                      <tr class="st2-tr-subtotal">
                        <td class="blank"></td><td class="blank"></td>
                        <td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td>
                        <td>130.00</td>
                      </tr>
                      <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional costs (if incurred)</td></tr>
                    </tbody>
                  </table>
                  <div class="st2-total-footer" style="border-top:2px solid #e5e7eb; padding:16px 18px;">
                    <span class="st2-total-label">TOTAL PRICE</span>
                    <div class="st2-total-amounts">
                      <div class="st2-total-row">
                        <span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span>
                        <span class="st2-t-amount">USD 130.00</span>
                      </div>
                      <div class="st2-total-row">
                        <span class="st2-t-tag st2-conditional">🔴 Conditional:</span>
                        <span class="st2-t-amount" style="color:#9ca3af;">USD 0.00+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <!-- ST2 Format for switchBill -->
              <template v-else-if="svcId === 'switchBill'">
                <div class="st2-info-card">
                  <div class="st2-info-left" style="background:#fafafa;">
                    <div class="st2-at-origin-header">
                      <div class="st2-origin-icon" style="background: linear-gradient(135deg, #dbeafe, #bfdbfe);">🚢</div>
                      <span class="st2-at-origin-label">SEA FREIGHT</span>
                      <div class="st2-at-origin-divider"></div>
                    </div>
                    <div class="st2-service-card">
                      <div class="st2-svc-top">
                        <span class="st2-truck-icon">
                          <!-- B/L Document icon -->
                          <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="3" width="20" height="26" rx="2.5" fill="#dbeafe"/>
                            <rect x="6" y="3" width="20" height="26" rx="2.5" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
                            <path d="M20 3 L26 9 L20 9 Z" fill="#93c5fd"/>
                            <path d="M20 3 L26 9 L20 9 Z" fill="none" stroke="#3b82f6" stroke-width="1.2"/>
                            <line x1="10" y1="15" x2="22" y2="15" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round"/>
                            <line x1="10" y1="19" x2="22" y2="19" stroke="#93c5fd" stroke-width="1.5" stroke-linecap="round"/>
                            <line x1="10" y1="23" x2="18" y2="23" stroke="#93c5fd" stroke-width="1.5" stroke-linecap="round"/>
                            <rect x="9" y="10" width="10" height="5" rx="1" fill="#2563eb"/>
                            <text x="14" y="14" text-anchor="middle" font-family="sans-serif" font-size="3.8" font-weight="700" fill="#fff">B/L</text>
                          </svg>
                        </span>
                        <div class="st2-svc-name" v-html="fmtSvcName('Switch bill of lading')"></div>
                      </div>
                      <div class="st2-svc-desc" style="margin-top:6px;">
                        <span class="st2-info-badge">i</span>
                        <span style="font-size:11px;">By Shoptrans' network, Shoptrans will help you to arrange switch bill of lading at many countries, where needed by legal procedures and low costs.</span>
                      </div>
                    </div>
                  </div>
                  <div class="st2-info-right" style="background:#fff;">
                    <div class="st2-info-details">
                      <div class="st2-info-row"><div class="st2-info-icon-wrap"><svg width="15" height="15" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#6b7280" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l2-11 7 4 7-4 2 11"/><path d="M3 17h18"/><path d="M12 6V2"/></svg></div><span class="st2-info-label">Carrier</span><span class="st2-info-colon">:</span><span class="st2-info-value" style="font-weight:700;color:#1f2937;">{{ detailedFormAvailable?.shippingLine?.toUpperCase() || '—' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of loading</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryFromPort }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">📍</div><span class="st2-info-label">Place of switch</span><span class="st2-info-colon">:</span><span class="st2-info-value" style="font-weight:600; color:#2563eb;">Singapore, SG</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of destination</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryToPort }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">💳</div><span class="st2-info-label">Freight</span><span class="st2-info-colon">:</span><span class="st2-info-value">PREPAID</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Volume</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedContainerType || '1×20GP' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">🏷️</div><span class="st2-info-label">Cargo type</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedCommodity?.category || 'General' }}</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">⚖️</div><span class="st2-info-label">Cargo weight</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ cargoWeight || '10,000' }} KGS</span></div>
                      <div class="st2-info-row"><div class="st2-info-icon-wrap">📅</div><span class="st2-info-label">Validity</span><span class="st2-info-colon">:</span><span class="st2-info-value">30 Sep 2025</span></div>
                    </div>
                    <!-- Route flags with transit dot (Singapore) -->
                    <div class="st2-route-card" style="background:#fafafa;">
                      <div class="st2-route-flags">
                        <div class="st2-flag-wrap">
                          <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag flag-circle" style="width:54px; height:54px; border-radius:50%; object-fit:cover;"/>
                          <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                        </div>
                        <!-- Arrow with switch port dot -->
                        <div style="display:flex; flex-direction:column; align-items:center; gap:3px; padding-bottom:20px; flex-shrink:0;">
                          <div style="display:flex; align-items:center; gap:3px;">
                            <div style="width:8px; height:8px; border-radius:50%; background:#64748b; flex-shrink:0;"></div>
                            <span style="font-size:10px; color:#64748b; white-space:nowrap;">Singapore</span>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </div>
                        <div class="st2-flag-wrap">
                          <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag flag-circle" style="width:54px; height:54px; border-radius:50%; object-fit:cover;"/>
                          <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Switch Bill of Lading Charges -->
                <div class="st2-charges-wrap" style="background:#fff; margin-top:20px;">
                  <div class="st2-carrier-select-wrap">
                    <div class="st2-carrier-select-title">SWITCH BILL OF LADING CHARGES</div>
                  </div>
                  <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                    <colgroup>
                      <col class="st2-col-item" />
                      <col class="st2-col-unit" />
                      <col v-if="tableShow20" class="st2-col-20" />
                      <col v-if="tableShow40" class="st2-col-40" />
                      <col v-if="tableShow45" class="st2-col-45" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-total" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th class="th-unit">Unit</th>
                        <th v-if="tableShow20">20'</th>
                        <th v-if="tableShow40">40'</th>
                        <th v-if="tableShow45">45'</th>
                        <th>B/L</th>
                        <th>Currency</th>
                        <th>Total price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="st2-tr-section st2-first-section"><td :colspan="5 + tableActiveCols">💲 <a>SWITCH BILL OF LADING CHARGES</a></td></tr>
                      <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed costs</td></tr>
                      <tr class="st2-tr-item">
                        <td>Handling fee</td>
                        <td>per B/L</td>
                        <td v-if="tableShow20" class="na">—</td>
                        <td v-if="tableShow40" class="na">—</td>
                        <td v-if="tableShow45" class="na">—</td>
                        <td>75.00</td>
                        <td>USD</td>
                        <td>75.00</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Switch bill fee</td>
                        <td>per B/L</td>
                        <td v-if="tableShow20" class="na">—</td>
                        <td v-if="tableShow40" class="na">—</td>
                        <td v-if="tableShow45" class="na">—</td>
                        <td>50.00</td>
                        <td>USD</td>
                        <td>50.00</td>
                      </tr>
                      <tr class="st2-tr-item">
                        <td>Document fee</td>
                        <td>per B/L</td>
                        <td v-if="tableShow20" class="na">—</td>
                        <td v-if="tableShow40" class="na">—</td>
                        <td v-if="tableShow45" class="na">—</td>
                        <td>50.00</td>
                        <td>USD</td>
                        <td>50.00</td>
                      </tr>
                      <tr class="st2-tr-subtotal">
                        <td class="blank"></td><td class="blank"></td>
                        <td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td>
                        <td>175.00</td>
                      </tr>
                      <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional costs (if incurred)</td></tr>
                    </tbody>
                  </table>
                  <div class="st2-total-footer" style="border-top:2px solid #e5e7eb; padding:16px 18px;">
                    <span class="st2-total-label">TOTAL PRICE</span>
                    <div class="st2-total-amounts">
                      <div class="st2-total-row">
                        <span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span>
                        <span class="st2-t-amount">USD 175.00</span>
                      </div>
                      <div class="st2-total-row">
                        <span class="st2-t-tag st2-conditional">🔴 Conditional:</span>
                        <span class="st2-t-amount" style="color:#9ca3af;">USD 0.00+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- OLD Format for other Sea Services -->
              <template v-else>
               <div class="summary-layout">
                 <!-- Left Panel: Service Summary -->
                 <div class="summary-card service-summary">
                   <h4 class="main-section-title"><img :src="iconSea" class="title-icon" /> SEA FREIGHT</h4>
                   
                   <!-- Booking Offered -->
                   <template v-if="svcId === 'bookingOffered'">
                    <div class="service-header-section">
                      <div class="service-logo"><img :src="serviceImg21" alt="Service" /></div>
                      <div class="service-title-wrapper"><h3 class="service-card-title"><span class="title-main">Place booking at the offered rate</span></h3></div>
                    </div>
                    <div class="service-description-section">
                      <i class="fas fa-info-circle info-icon"></i>
                      <p class="service-description">Rates have offered online and which rate is matching with your target or your requirement, use that rate to arrange booking.</p>
                    </div>
                    <div class="service-addon-section">
                      <span class="addon-label">Add-on:</span>
                      <div class="addon-buttons">
                        <button class="addon-btn">Service at origin</button>
                        <button class="addon-btn">Service at destination</button>
                      </div>
                    </div>
                   </template>

                   <!-- Booking Spot -->
                   <template v-if="svcId === 'bookingSpot'">
                    <div class="service-header-section">
                      <div class="service-logo"><img :src="serviceImg21" alt="Service" /></div>
                      <div class="service-title-wrapper"><h3 class="service-card-title"><span class="title-main">Place booking at SPOT rate</span></h3></div>
                    </div>
                    <div class="service-description-section">
                      <i class="fas fa-info-circle info-icon"></i>
                      <p class="service-description">Shoptrans will show you the actual SPOT rate of multiple shipping lines and service contract is filed directly under Shoptrans name.</p>
                    </div>
                    <div class="service-addon-section">
                      <span class="addon-label">Add-on:</span>
                      <div class="addon-buttons">
                        <button class="addon-btn">Service at origin</button>
                        <button class="addon-btn">Service at destination</button>
                      </div>
                    </div>
                   </template>

                   <!-- Handle Under Available -->
                   <template v-if="svcId === 'handleUnderAvailable'">
                    <div class="service-header-section">
                      <div class="service-logo"><img :src="serviceImg21" alt="Service" /></div>
                      <div class="service-title-wrapper"><h3 class="service-card-title"><span class="title-main">Handle the shipment under an available booking</span></h3></div>
                    </div>
                    <div class="service-description-section">
                      <i class="fas fa-info-circle info-icon"></i>
                      <p class="service-description">Shoptrans will act as your operation agent, will use your available booking to arrange export bussiness with shipper.</p>
                    </div>
                    <div class="service-addon-section">
                      <span class="addon-label">Add-on:</span>
                      <div class="addon-buttons">
                        <button class="addon-btn">Service at origin</button>
                        <button class="addon-btn">Service at destination</button>
                      </div>
                    </div>
                   </template>

                   <!-- Service Contract -->
                   <template v-if="svcId === 'serviceContract'">
                    <div class="service-header-section">
                      <div class="service-logo"><img :src="serviceImg21" alt="Service" /></div>
                      <div class="service-title-wrapper"><h3 class="service-card-title"><span class="title-main">Place booking under available service<br>contract / quotation</span></h3></div>
                    </div>
                    <div class="service-description-section">
                      <i class="fas fa-info-circle info-icon"></i>
                      <p class="service-description">Shoptrans will act as your operation agent, will use your available booking to arrange export bussiness with shipper.</p>
                    </div>
                    <div class="service-addon-section">
                      <span class="addon-label">Add-on:</span>
                      <div class="addon-buttons">
                        <button class="addon-btn">Service at origin</button>
                        <button class="addon-btn">Service at destination</button>
                      </div>
                    </div>
                   </template>

                   <!-- Switch Bill -->
                   <template v-if="svcId === 'switchBill'">
                    <div class="service-header-section">
                      <div class="service-logo"><img :src="img_129" alt="Service" /></div>
                      <div class="service-title-wrapper"><h3 class="service-card-title"><span class="title-main">Switch bill of lading</span></h3></div>
                    </div>
                    <div class="service-description-section">
                      <i class="fas fa-info-circle info-icon"></i>
                      <p class="service-description">By Shoptrans' network, Shoptrans will help you to arrange switch bill of lading at many countries, where needed by legal procedures and low costs.</p>
                    </div>
                    <div class="service-addon-section">
                      <span class="addon-label">Add-on:</span>
                      <div class="addon-buttons">
                        <button class="addon-btn">Service at origin</button>
                        <button class="addon-btn">Service at destination</button>
                      </div>
                    </div>
                   </template>
                 </div>

                 <!-- Right Panel: Shipment Details -->
                 <div class="summary-card shipment-and-map">
                    <div class="shipment-map-inner">
                      <div class="shipment-details-section">
                        <ul class="details-list">
                          <li><img :src="iconSea" class="detail-icon-img" style="width:20px; height:20px; object-fit:contain;" /> <span class="detail-label"><strong>Shipping line</strong></span><span class="detail-colon">:</span> <span class="detail-value">{{ selectedCarrierName || 'Not selected' }}</span></li>
                          <li><img :src="iconPortLoading" class="detail-icon-img" /> <span class="detail-label"><strong>Port of loading</strong></span><span class="detail-colon">:</span> <span class="detail-value">{{ summaryFromPort }}, {{ summaryOriginCountry }}</span></li>
                          <li><img :src="iconPortDestination" class="detail-icon-img" /> <span class="detail-label"><strong>Port of destination</strong></span><span class="detail-colon">:</span> <span class="detail-value">{{ summaryToPort }}, {{ summaryDestCountry }}</span></li>
                          <li v-if="svcId === 'switchBill'"><i class="fas fa-map-marker-alt detail-icon-img" style="color:#dc3545; width:20px; text-align:center;"></i> <span class="detail-label"><strong>Place of switch</strong></span><span class="detail-colon">:</span> <span class="detail-value">Shanghai, China</span></li>
                          <li><img :src="img_23" class="detail-icon-img" style="width:18px;" /> <span class="detail-label"><strong>Freight</strong></span><span class="detail-colon">:</span> <span class="detail-value">PREPAID</span></li>
                          <li><img :src="iconVolume" class="detail-icon-img" /> <span class="detail-label"><strong>Volume</strong></span><span class="detail-colon">:</span> <span class="detail-value">{{ selectedContainerType || '1X20GP' }}</span></li>
                          <li><img :src="iconCargoType" class="detail-icon-img" /> <span class="detail-label"><strong>Cargo type</strong></span><span class="detail-colon">:</span> <span class="detail-value">{{ selectedCommodity?.category || 'General' }}</span></li>
                          <li><img :src="iconVolume" class="detail-icon-img" /> <span class="detail-label"><strong>Cargo weight</strong></span><span class="detail-colon">:</span> <span class="detail-value">{{ cargoWeight || '10,000' }} KGS</span></li>
                          <li><img :src="iconValidity" class="detail-icon-img" /> <span class="detail-label"><strong>Validity</strong></span><span class="detail-colon">:</span> <span class="detail-value">30 Sep 2025</span></li>
                        </ul>
                      </div>
                      <div class="country-flags-section">
                        <div class="flag-route">
                          <div class="flag-item">
                            <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag" :class="{ 'flag-circle': !['Thailand', 'Vietnam', 'Viet Nam'].includes(summaryOriginCountry) }" />
                            <span class="flag-country-name">{{ summaryOriginCountry }}</span>
                          </div>
                          <div class="route-arrow-simple" style="position:relative;">
                             <span class="dashed-line"></span>
                             <span class="arrow-icon"></span>
                             <div v-if="svcId === 'switchBill'" style="position:absolute; top:-40px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; width:100px;">
                                <i class="fas fa-map-marker-alt" style="color:#dc3545; font-size:16px;"></i><span style="font-size:11px; font-weight:700; white-space:nowrap; margin-top:2px;">Shanghai, China</span>
                             </div>
                          </div>
                          <div class="flag-item">
                            <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag" :class="{ 'flag-circle': !['Thailand', 'Vietnam', 'Viet Nam'].includes(summaryDestCountry) }" />
                            <span class="flag-country-name">{{ summaryDestCountry }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                 </div>
               </div>

               <!-- Helper: Price Tables specific to Sea Service -->
               
               <!-- Spot / Handle Available -->
               <div v-if="svcId === 'bookingSpot' || svcId === 'handleUnderAvailable'" class="price-table-container" style="margin-top: 24px;">
                  <div class="price-table-header">
                    <div class="col-item">Item</div><div class="col-unit">Unit</div><div class="col-qty">Quantity</div><div class="col-unit-price">Unit price</div><div class="col-currency">Currency</div><div class="col-total">Total price</div>
                  </div>
                  <div class="charge-group">
                    <div class="charge-group-title"><span class="charge-icon"><img :src="img_23" alt="" class="charge-icon-img" /></span> AGENT HANDLING CHARGES</div>
                    <div class="cost-category"><img :src="img_109" class="cost-icon" /> Fixed costs</div>
                    <div class="price-row"><div class="col-item">Agent handling fee</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">250.00</div><div class="col-currency">USD</div><div class="col-total">250.00</div></div>
                    <div class="price-row"><div class="col-item">Banking fee</div><div class="col-unit">Transaction</div><div class="col-qty">1</div><div class="col-unit-price">50.00</div><div class="col-currency">USD</div><div class="col-total">50.00</div></div>
                    <div class="price-row"><div class="col-item">R.O.E deduction</div><div class="col-unit">Transaction</div><div class="col-qty">1</div><div class="col-unit-price">50.00</div><div class="col-currency">USD</div><div class="col-total">50.00</div></div>
                    <div class="cost-category"><img :src="img_110" class="cost-icon" /> Potential costs (If Incurred)</div>
                    <div class="subtotal-row"><div class="col-item"></div><div class="col-unit"></div><div class="col-qty"></div><div class="col-unit-price"></div><div class="col-currency"><strong>Subtotal</strong></div><div class="col-total">350.00</div></div>
                  </div>
               </div>

               <!-- Service Contract / Switch Bill -->
               <div v-if="svcId === 'serviceContract' || svcId === 'switchBill'" class="price-table-container" style="margin-top: 24px;">
                 <div class="price-table-header"><div class="col-item">Item</div><div class="col-unit">Unit</div><div class="col-qty">Quantity</div><div class="col-unit-price">Unit price</div><div class="col-currency">Currency</div><div class="col-total">Total price</div></div>
                 <div class="charge-group">
                   <div class="charge-group-title"><span class="charge-icon"><img :src="img_23" alt="" class="charge-icon-img" /></span> AGENT HANDLING CHARGES</div>
                   <div class="cost-category"><img :src="img_109" class="cost-icon" /> Fixed costs</div>
                   <div class="price-row"><div class="col-item">Agent handling fee</div><div class="col-unit">B/L</div><div class="col-qty">1</div><div class="col-unit-price">75.00</div><div class="col-currency">USD</div><div class="col-total">75.00</div></div>
                   <div class="price-row"><div class="col-item">Switch B/L fee</div><div class="col-unit">B/L</div><div class="col-qty">1</div><div class="col-unit-price">50.00</div><div class="col-currency">USD</div><div class="col-total">50.00</div></div>
                   <div class="price-row"><div class="col-item">Document fee</div><div class="col-unit">B/L</div><div class="col-qty">1</div><div class="col-unit-price">50.00</div><div class="col-currency">USD</div><div class="col-total">50.00</div></div>
                   <div class="cost-category"><img :src="img_110" class="cost-icon" /> Potential costs (If Incurred)</div>
                   <div class="subtotal-row"><div class="col-item"></div><div class="col-unit"></div><div class="col-qty"></div><div class="col-unit-price"></div><div class="col-currency"><strong>Subtotal</strong></div><div class="col-total">175.00</div></div>
                 </div>
               </div>

              <!-- Carrier Info for Booking Offered -->
               <div v-if="svcId === 'bookingOffered'">
                 <!-- SELECT CARRIER Section -->
                  <div class="select-carrier-section">
                    <div class="carrier-dropdown-wrapper">
                      <label class="carrier-dropdown-label">SELECT CARRIER</label>
                      <div class="carrier-select-trigger" @click="showCarrierModal = true">
                        <span :class="{ 'placeholder': !selectedCarrierName }">{{ selectedCarrierName || '-- Select a carrier --' }}</span>
                        <i class="fas fa-chevron-down"></i>
                      </div>
                      <!-- Carrier Modal Teleport is globally placed, triggering display with showCarrierModal is fine -->
                    </div>
                  </div>

                  <!-- Carrier Schedule Display -->
                  <div v-if="selectedCarrierForSummary || selectedCarrier" class="carrier-schedule-section">
                    <h3 class="carrier-name-title">{{ selectedCarrierName }}</h3>
                    <p class="carrier-route">{{ summaryFromPort }} - {{ summaryToPort }}, {{ summaryDestCountry }}</p>
                    <p class="schedule-notice">These dates and times are estimated and subject to change. All times are local.</p>
                    <div class="schedule-date-header">{{ selectedCarrierSchedule?.departureDate || '30 May 2025' }}</div>
                    <div class="schedule-details-row">
                      <div class="schedule-item"><span class="schedule-icon">🕐</span><div class="schedule-content"><span class="schedule-label">Departure</span><span class="schedule-value">{{ selectedCarrierSchedule?.departureTime || '30 May 2025, 17:00' }}</span></div></div>
                      <div class="schedule-item"><span class="schedule-icon">🕐</span><div class="schedule-content"><span class="schedule-label">Arrival</span><span class="schedule-value">{{ selectedCarrierSchedule?.arrivalTime || '20 Jul 2025, 23:00' }}</span></div></div>
                      <div class="schedule-item"><span class="schedule-icon">🕐</span><div class="schedule-content"><span class="schedule-label">Gate-in deadline</span><span class="schedule-value">{{ selectedCarrierSchedule?.gateInDeadline || '28 May 2025, 18:30' }}</span></div></div>
                      <div class="schedule-item"><span class="schedule-icon">🕐</span><div class="schedule-content"><span class="schedule-label">Transit time</span><span class="schedule-value">{{ selectedCarrierSchedule?.transitTime || '51 days 20 hours' }}</span></div></div>
                      <div class="schedule-item"><span class="schedule-icon">🚢</span><div class="schedule-content"><span class="schedule-label">Vessel/voyage</span><span class="schedule-value">{{ selectedCarrierSchedule?.vesselVoyage || 'ULSAN / 522S' }}</span></div></div>
                      <div class="schedule-item"><a href="#" class="route-details-link">Route & other details ▼</a></div>
                    </div>
                                       <!-- Spot Rate Container for Booking Offered -->
                     <div class="spot-rate-container">
                      <div class="spot-rate-row">
                        <!-- Left: Title + Breakdown Toggle -->
                        <div class="spot-rate-left" style="display:flex; flex-direction:column; align-items:flex-start; gap:4px;">
                            <span class="spot-rate-name">Maersk Spot</span>
                            <div class="price-breakdown-toggle" @click="showSpotPriceBreakdown = !showSpotPriceBreakdown" style="font-size:13px; margin-top:0; color:#0e5d9d; font-weight:600;">
                                <i class="fas" :class="showSpotPriceBreakdown ? 'fa-chevron-up' : 'fa-chevron-down'" style="font-size:12px; margin-right:4px;"></i> <span>Price breakdown & details</span>
                            </div>
                        </div>
                        
                        <!-- Center: Rolling Option -->
                        <div class="spot-rate-center"><label class="rolled-option"><input type="checkbox" /> <span style="font-weight:700; color:#000;">Get USD 200 per container if rolled</span> <i class="far fa-question-circle" title="Info" style="color:#666; margin-left:4px;"></i></label></div>
                        
                        <!-- Right: Price + Freetime -->
                        <div class="spot-rate-right">
                            <div class="spot-total-price"><span class="currency" style="font-size:16px; color:#333;">USD</span> <span class="amount" style="font-size:20px; font-weight:700; color:#333;">4,530.00</span></div>
                            <div class="spot-note" style="color:#666; font-size:12px; margin-top:2px;">Incl. 7 days of detention freetime</div>
                            <div class="buy-freetime-badge" style="background:#d9edf7; color:#31708f; font-size:11px; padding:2px 8px; border-radius:10px; display:inline-block; margin-top:4px; font-weight:700;">Buy more freetime on next page</div>
                        </div>
                      </div>

                     
                     <!-- Price Breakdown Content -->
                     <div v-if="showSpotPriceBreakdown" class="price-breakdown-details" style="padding:0; border:none; border-top:1px solid #eee; background:transparent;">
                        <div class="price-table-container" style="margin-top: 10px;">
                          <div class="price-table-header">
                            <div class="col-item">Item</div><div class="col-unit">Unit</div><div class="col-qty">Quantity</div><div class="col-unit-price">Unit price</div><div class="col-currency">Currency</div><div class="col-total">Total price</div>
                          </div>

                          <!-- OCEAN FREIGHT -->
                          <div class="charge-group">
                            <div class="charge-group-title"><span class="charge-icon"><img :src="img_23" alt="" class="charge-icon-img" /></span> OCEAN FREIGHT</div>
                            <!-- Fixed -->
                            <div class="cost-category" style="color:#008000; font-weight:700;"><img :src="img_109" class="cost-icon" /> Fixed costs</div>
                            <div class="price-row"><div class="col-item">Ocean freight charge</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">250.00</div><div class="col-currency">USD</div><div class="col-total">250.00</div></div>
                            <div class="price-row"><div class="col-item">Fuel surcharge</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">25.00</div><div class="col-currency">USD</div><div class="col-total">25.00</div></div>
                             <div class="subtotal-row"><div class="col-item"></div><div class="col-unit"></div><div class="col-qty"></div><div class="col-unit-price"></div><div class="col-currency"><strong>Subtotal</strong></div><div class="col-total">275.00</div></div>
                            
                            <!-- Potential -->
                            <div class="cost-category" style="color:#dc3545; font-weight:700;"><img :src="img_110" class="cost-icon" /> Potential costs (If Incurred)</div>
                            <div class="price-row potential" style="color:#999;"><div class="col-item">Booking cancellation fee</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">200.00</div><div class="col-currency">USD</div><div class="col-total">200.00</div></div>
                            <div class="price-row potential" style="color:#999;"><div class="col-item">Booking amendment fee</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">45.00</div><div class="col-currency">USD</div><div class="col-total">45.00</div></div>
                            <div class="price-row potential" style="color:#999;"><div class="col-item">No show fee</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">45.00</div><div class="col-currency">USD</div><div class="col-total">45.00</div></div>
                            <div class="subtotal-row potential" style="color:#999;"><div class="col-item"></div><div class="col-unit"></div><div class="col-qty"></div><div class="col-unit-price"></div><div class="col-currency"><strong>Subtotal</strong></div><div class="col-total">290.00</div></div>
                          </div>
                          
                          <!-- ORIGINAL CHARGES -->
                          <div class="charge-group">
                            <div class="charge-group-title"><span class="charge-icon"><img :src="img_23" alt="" class="charge-icon-img" /></span> ORIGINAL CHARGES</div>
                            <!-- Fixed -->
                            <div class="cost-category" style="color:#008000; font-weight:700;"><img :src="img_109" class="cost-icon" /> Fixed costs</div>
                            <div class="price-row"><div class="col-item">Terminal handling charge</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">250.00</div><div class="col-currency">USD</div><div class="col-total">250.00</div></div>
                            <div class="price-row"><div class="col-item">Original Document fee</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">50.00</div><div class="col-currency">USD</div><div class="col-total">50.00</div></div>
                            <div class="price-row"><div class="col-item">Seal fee</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">10.00</div><div class="col-currency">USD</div><div class="col-total">10.00</div></div>
                            <div class="subtotal-row"><div class="col-item"></div><div class="col-unit"></div><div class="col-qty"></div><div class="col-unit-price"></div><div class="col-currency"><strong>Subtotal</strong></div><div class="col-total">310.00</div></div>
                            
                            <!-- Potential -->
                            <div class="cost-category" style="color:#dc3545; font-weight:700;"><img :src="img_110" class="cost-icon" /> Potential costs (If Incurred)</div>
                            <div class="price-row potential" style="color:#999;"><div class="col-item">Telex release fee</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">40.00</div><div class="col-currency">USD</div><div class="col-total">40.00</div></div>
                            <div class="price-row potential" style="color:#999;"><div class="col-item">Manifest submission fee</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">35.00</div><div class="col-currency">USD</div><div class="col-total">35.00</div></div>
                            <div class="subtotal-row potential" style="color:#999;"><div class="col-item"></div><div class="col-unit"></div><div class="col-qty"></div><div class="col-unit-price"></div><div class="col-currency"><strong>Subtotal</strong></div><div class="col-total">75.00</div></div>
                          </div>
                          
                          <!-- DESTINATION CHARGES -->
                          <div class="charge-group">
                            <div class="charge-group-title"><span class="charge-icon"><img :src="img_23" alt="" class="charge-icon-img" /></span> DESTINATION CHARGES</div>
                            <!-- Fixed -->
                            <div class="cost-category" style="color:#008000; font-weight:700;"><img :src="img_109" class="cost-icon" /> Fixed costs</div>
                            <div class="price-row"><div class="col-item">Terminal handling charge</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">250.00</div><div class="col-currency">USD</div><div class="col-total">250.00</div></div>
                            <div class="price-row"><div class="col-item">Destination Document fee</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">50.00</div><div class="col-currency">USD</div><div class="col-total">50.00</div></div>
                            <div class="price-row"><div class="col-item">Container cleaning fee</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">10.00</div><div class="col-currency">USD</div><div class="col-total">10.00</div></div>
                            <div class="subtotal-row"><div class="col-item"></div><div class="col-unit"></div><div class="col-qty"></div><div class="col-unit-price"></div><div class="col-currency"><strong>Subtotal</strong></div><div class="col-total">310.00</div></div>

                             <!-- Potential -->
                            <div class="cost-category" style="color:#dc3545; font-weight:700;"><img :src="img_110" class="cost-icon" /> Potential costs (If Incurred)</div>
                            <div class="price-row potential" style="color:#999;"><div class="col-item">Container deposit</div><div class="col-unit">Container</div><div class="col-qty">1</div><div class="col-unit-price">40.00</div><div class="col-currency">USD</div><div class="col-total">40.00</div></div>
                            <div class="subtotal-row potential" style="color:#999;"><div class="col-item"></div><div class="col-unit"></div><div class="col-qty"></div><div class="col-unit-price"></div><div class="col-currency"><strong>Total</strong></div><div class="col-total">40.00</div></div>
                          </div>
                        </div>
                     </div>
                     </div>
                  </div>
               </div>
 
              </template>
            </div>
            </div>
          </template>

          <!-- ==================== DESTINATION SECTION ==================== -->
          <template v-for="svcId in services.dest.selected" :key="svcId">
             <div class="dest-service-item" style="margin-bottom: 5px;">

            <div v-show="(services.origin.selected.length + services.sea.selected.length + services.dest.selected.length) === 1 || activeServiceTab === `dest-${svcId}`" class="summary-full-content">
               <div class="summary-layout" v-show="svcId !== 'dap' && svcId !== 'ddp' && svcId !== 'ddu' && svcId !== 'customsOnly' && svcId !== 'collectPay' && svcId !== 'insurance' && svcId !== 'dodRelease'">
                 <!-- Left Panel: Service Summary -->
                 <div class="summary-card service-summary">
                   <h4 class="main-section-title"><img :src="iconDest" class="title-icon" /> AT DESTINATION</h4>

                   <!-- DAP -->
                   <template v-if="svcId === 'dap'">
                    <div class="service-header-section">
                      <div class="service-logo"><img :src="img_20" alt="Service" /></div>
                      <div class="service-title-wrapper"><h3 class="service-card-title"><span class="title-main">Full DAP service: From POD to consignee's door (customs clearance excluded)</span></h3></div>
                    </div>
                    <div class="service-description-section">
                      <i class="fas fa-info-circle info-icon"></i>
                      <p class="service-description">Shoptrans will be destination agent who helps to handle for import procedures at destination, deliver container(s) to consignee’s warehouse, but customs clearance is done by consignee.</p>
                    </div>
                   </template>

                   <!-- DDU -->
                   <template v-if="svcId === 'ddu'">
                    <div class="service-header-section">
                      <div class="service-logo"><img :src="img_20" alt="Service" /></div>
                      <div class="service-title-wrapper"><h3 class="service-card-title"><span class="title-main">Full DDU service: From POD to consignee's door (import duty excluded)</span></h3></div>
                    </div>
                    <div class="service-description-section">
                      <i class="fas fa-info-circle info-icon"></i>
                      <p class="service-description">Shoptrans will be destination agent who helps to handle for import procedures at destination, deliver container(s) to consignee’s warehouse. Including customs clearance but exluding import taxes.</p>
                    </div>
                   </template>

                   <!-- DDP -->
                   <template v-if="svcId === 'ddp'">
                    <div class="service-header-section">
                      <div class="service-logo"><img :src="img_20" alt="Service" /></div>
                      <div class="service-title-wrapper"><h3 class="service-card-title"><span class="title-main">Full DDP service: From POD to consignee's door (import duty included)</span></h3></div>
                    </div>
                    <div class="service-description-section">
                      <i class="fas fa-info-circle info-icon"></i>
                      <p class="service-description">Shoptrans will be destination agent who helps to handle for import procedures at destination, deliver container(s) to consignee’s warehouse. Including customs clearance and import taxes.</p>
                    </div>
                   </template>

                   <!-- Customs Only -->
                   <template v-if="svcId === 'customsOnly'">
                    <div class="service-header-section">
                      <div class="service-logo"><img :src="img_19" alt="Service" /></div>
                      <div class="service-title-wrapper"><h3 class="service-card-title"><span class="title-main" style="color: blue;">Customs clearance service only</span></h3></div>
                    </div>
                    <div class="service-description-section">
                      <i class="fas fa-info-circle info-icon"></i>
                      <p class="service-description">Shoptrans works with shipper to complete customs clearance procedures only, other works excluded.</p>
                    </div>
                   </template>

                   <!-- Collect Pay -->
                   <template v-if="svcId === 'collectPay'">
                    <div class="service-header-section">
                      <div class="service-logo"><img :src="img_17" alt="Service" /></div>
                      <div class="service-title-wrapper"><h3 class="service-card-title"><span class="title-main">Collect/pay charges as nominated</span></h3></div>
                    </div>
                    <div class="service-description-section">
                      <i class="fas fa-info-circle info-icon"></i>
                      <p class="service-description">Shoptrans will collect or disburse transportation service fees or other related charges under the customer's instructions.</p>
                    </div>
                   </template>

                   <!-- Insurance -->
                   <template v-if="svcId === 'insurance'">
                    <div class="service-header-section">
                      <div class="service-logo"><img :src="img_18" alt="Service" /></div>
                      <div class="service-title-wrapper"><h3 class="service-card-title"><span class="title-main">Buy cargo insurance</span></h3></div>
                    </div>
                    <div class="service-description-section">
                      <i class="fas fa-info-circle info-icon"></i>
                      <p class="service-description">Shoptrans provides cargo insurance services, works with consignee to buy insurance for the shipment(s).</p>
                    </div>
                   </template>

                   <!-- D/O Release -->
                   <template v-if="svcId === 'dodRelease'">
                    <div class="service-header-section">
                      <div class="service-logo"><img :src="img_15" alt="Service" /></div>
                      <div class="service-title-wrapper"><h3 class="service-card-title"><span class="title-main" style="color: blue;">Consignee Delivery Order (D/O)<br>Release Service</span></h3></div>
                    </div>
                    <div class="service-description-section">
                      <i class="fas fa-info-circle info-icon"></i>
                      <p class="service-description">Shoptrans or its agent will act as your delivery agent in the importing country, providing continuous and detailed shipment updates.</p>
                    </div>
                   </template>
                 </div>

                 <!-- Right Panel: Shipment Details -->
                 <div class="summary-card shipment-and-map">
                    <div class="shipment-map-inner">
                      <div class="shipment-details-section">
                        <ul class="details-list">
                          <li><img :src="ship4png" class="detail-icon-img" style="width:20px; height:20px; object-fit:contain;" /> <strong>Shipping line:</strong> {{ selectedCarrierName || 'Not selected' }}</li>
                          <li><img :src="iconPortLoading" class="detail-icon-img" /> <strong>Port of loading:</strong> {{ summaryFromPort }}, {{ summaryOriginCountry }}</li>
                          <li><img :src="iconPortDestination" class="detail-icon-img" /> <strong>Port of destination:</strong> {{ summaryToPort }}, {{ summaryDestCountry }}</li>
                          <li v-if="['dap','ddu','ddp'].includes(svcId)"><img :src="iconPickup" class="detail-icon-img" /> <strong>Place of delivery:</strong> {{ (svcId === 'dap' ? detailedFormDap.cargoDeliveryLocation : (svcId === 'ddu' ? detailedFormDdu.cargoDeliveryLocation : detailedFormDdp.cargoDeliveryLocation)) || 'Thu Duc, HCMC' }}</li>
                          <li><img :src="img_23" class="detail-icon-img" style="width:18px;" /> <strong>Freight:</strong> PREPAID</li>
                          <li><img :src="iconVolume" class="detail-icon-img" /> <strong>Volume:</strong> {{ selectedContainerType || '1X20GP' }}</li>
                          <li><img :src="iconCargoType" class="detail-icon-img" /> <strong>Cargo type:</strong> {{ selectedCommodity?.category || 'General' }}</li>
                          <li><img :src="iconVolume" class="detail-icon-img" /> <strong>Cargo weight:</strong> {{ cargoWeight || '10,000' }} KGS</li>
                          <li v-if="svcId === 'customsOnly'"><i class="far fa-clock detail-icon-img" style="color:#007bff; width:20px; text-align:center; display:inline-block;"></i> <strong>Handling time:</strong> 2 days</li>
                          <li><img :src="iconValidity" class="detail-icon-img" /> <strong>Validity:</strong> 30 Sep 2025</li>
                        </ul>
                      </div>
                       <div class="country-flags-section">
                        <div class="flag-route">
                          <div class="flag-item">
                            <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag" :class="{ 'flag-circle': !['Thailand', 'Vietnam', 'Viet Nam'].includes(summaryOriginCountry) }" />
                            <span class="flag-country-name">{{ summaryOriginCountry }}</span>
                          </div>
                          <div class="route-arrow-simple">
                            <span class="dashed-line"></span>
                            <span class="arrow-icon"></span>
                          </div>
                          <div class="flag-item">
                            <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag" :class="{ 'flag-circle': !['Thailand', 'Vietnam', 'Viet Nam'].includes(summaryDestCountry) }" />
                            <span class="flag-country-name">{{ summaryDestCountry }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                 </div>
               </div>

               <!-- Helper: Price Tables specific to Destination Service -->
               
               <!-- DAP -->
               <div v-if="svcId === 'dap'">

                 <!-- ST2 Info Card -->
                 <div class="st2-info-card">
                   <!-- LEFT -->
                   <div class="st2-info-left" style="background:#fafafa;">
                     <div class="st2-at-origin-header">
                       <div class="st2-origin-icon" style="background:linear-gradient(135deg,#fef3c7,#fed7aa);">🌍</div>
                       <span class="st2-at-origin-label">AT DESTINATION</span>
                       <div class="st2-at-origin-divider"></div>
                     </div>
                     <div class="st2-service-card">
                       <div class="st2-svc-top">
                         <span class="st2-truck-icon" style="font-size:28px;flex-shrink:0;line-height:1;">🚛</span>
                         <div class="st2-svc-name" v-html="fmtSvcName('Full DAP service: From POD to consignee\'s door (customs clearance excluded)')"></div>
                       </div>
                       <div class="st2-svc-desc" style="margin-top:6px;">
                         <span class="st2-info-badge">i</span>
                         <span style="font-size:11px;">Shoptrans will be destination agent who helps to handle for import procedures at destination, deliver container(s) to consignee's warehouse, but customs clearance is done by consignee.</span>
                       </div>
                     </div>
                   </div>
                   <!-- RIGHT -->
                   <div class="st2-info-right" style="background:#fff;">
                     <div class="st2-info-details">
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of loading</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryFromPort }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of destination</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryToPort }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Place of delivery</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ detailedFormDap.cargoDeliveryLocation || 'Thu Duc, HCMC' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Volume</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedContainerType || '1×20GP' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏷️</div><span class="st2-info-label">Cargo type</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedCommodity?.category || 'General' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">⏱️</div><span class="st2-info-label">Handling time</span><span class="st2-info-colon">:</span><span class="st2-info-value">2 days</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📅</div><span class="st2-info-label">Validity</span><span class="st2-info-colon">:</span><span class="st2-info-value">30 Sep 2025</span></div>
                     </div>
                     <div class="st2-route-card" style="background:#fafafa;">
                       <div class="st2-route-flags">
                         <div class="st2-flag-wrap">
                           <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                           <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                         </div>
                         <div class="st2-route-arrow" style="color:#9ca3af;padding-bottom:20px;">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                         </div>
                         <div class="st2-flag-wrap">
                           <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                           <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 <!-- Charges Table -->
                 <div class="st2-charges-wrap" style="background:#fff;margin-top:20px;">
                   <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                    <colgroup>
                      <col class="st2-col-item" />
                      <col class="st2-col-unit" />
                      <col v-if="tableShow20" class="st2-col-20" />
                      <col v-if="tableShow40" class="st2-col-40" />
                      <col v-if="tableShow45" class="st2-col-45" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-total" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th class="th-unit">Unit</th>
                        <th v-if="tableShow20">20'</th>
                        <th v-if="tableShow40">40'</th>
                        <th v-if="tableShow45">45'</th>
                        <th>B/L</th>
                        <th>Currency</th>
                        <th>Total price</th>
                      </tr>
                    </thead>
                     <tbody>
                       <!-- ARRIVAL CHARGES -->
                       <tr class="st2-tr-section st2-first-section"><td :colspan="5 + tableActiveCols">💲 <a>ARRIVAL CHARGES</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Terminal handling fee</td><td>per Container</td><td v-if="tableShow20">200.00×1</td><td v-if="tableShow40">250.00×1</td><td v-if="tableShow45">250.00×1</td><td class="na">—</td><td>USD</td><td>450.00</td></tr>
                       <tr class="st2-tr-item"><td>Destination document fee</td><td>per Set</td><td v-if="tableShow20" class="na">—</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>50.00</td><td>USD</td><td>50.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>500.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Container cleaning fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">15.00×1</td><td v-if="tableShow40" class="na">30.00×1</td><td v-if="tableShow45" class="na">30.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">45.00</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Container imbalance fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">50.00×1</td><td v-if="tableShow40" class="na">100.00×1</td><td v-if="tableShow45" class="na">100.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">150.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>195.00</td></tr>

                       <!-- DELIVERY CHARGES -->
                       <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a>DELIVERY CHARGES</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Trucking fee</td><td>per Container</td><td v-if="tableShow20">200.00×1</td><td v-if="tableShow40">250.00×1</td><td v-if="tableShow45">250.00×1</td><td class="na">—</td><td>USD</td><td>450.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>450.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Trucking standby</td><td class="st2-tr-item-dim-cell">per Truck</td><td v-if="tableShow20" class="na">80.00×1</td><td v-if="tableShow40" class="na">80.00×1</td><td v-if="tableShow45" class="na">80.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">160.00</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Trucking cancellation fee</td><td class="st2-tr-item-dim-cell">per Truck</td><td v-if="tableShow20" class="na">80.00×1</td><td v-if="tableShow40" class="na">80.00×1</td><td v-if="tableShow45" class="na">80.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">160.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>320.00</td></tr>

                       <!-- PORT CHARGES -->
                       <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a>PORT CHARGES</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Lift fee</td><td>per Container</td><td v-if="tableShow20">80.00×1</td><td v-if="tableShow40">120.00×1</td><td v-if="tableShow45">120.00×1</td><td class="na">—</td><td>USD</td><td>200.00</td></tr>
                       <tr class="st2-tr-item"><td>Infrastructure fee</td><td>per Container</td><td v-if="tableShow20">20.00×1</td><td v-if="tableShow40">30.00×1</td><td v-if="tableShow45">30.00×1</td><td class="na">—</td><td>USD</td><td>50.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>250.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                     </tbody>
                   </table>

                   <!-- Total Footer -->
                   <div class="st2-total-footer" style="border-top:2px solid #e5e7eb;padding:16px 18px;">
                     <span class="st2-total-label">TOTAL PRICE</span>
                     <div class="st2-total-amounts">
                       <div class="st2-total-row">
                         <span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span>
                         <span class="st2-t-amount">USD 1,265.00</span>
                       </div>
                       <div class="st2-total-row">
                         <span class="st2-t-tag st2-conditional">🔴 Conditional:</span>
                         <span class="st2-t-amount">USD 515.00+</span>
                       </div>
                     </div>
                   </div>
                 </div>

               </div>

               <!-- DDU ST2 Format -->
               <div v-if="svcId === 'ddu'">

                 <!-- ST2 Info Card -->
                 <div class="st2-info-card">
                   <!-- LEFT -->
                   <div class="st2-info-left" style="background:#fafafa;">
                     <div class="st2-at-origin-header">
                       <div class="st2-origin-icon" style="background:linear-gradient(135deg,#fef3c7,#fed7aa);">🌍</div>
                       <span class="st2-at-origin-label">AT DESTINATION</span>
                       <div class="st2-at-origin-divider"></div>
                     </div>
                     <div class="st2-service-card">
                       <div class="st2-svc-top">
                         <span class="st2-truck-icon" style="font-size:28px;flex-shrink:0;line-height:1;">🚛</span>
                         <div class="st2-svc-name" v-html="fmtSvcName('Full DDU service: From POD to consignee\'s door (import duty excluded)')"></div>
                       </div>
                       <div class="st2-svc-desc" style="margin-top:6px;">
                         <span class="st2-info-badge">i</span>
                         <span style="font-size:11px;">Shoptrans will be destination agent who helps to handle for import procedures at destination, deliver container(s) to consignee's warehouse. Including customs clearance but exluding import taxes.</span>
                       </div>
                     </div>
                   </div>
                   <!-- RIGHT -->
                   <div class="st2-info-right" style="background:#fff;">
                     <div class="st2-info-details">
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of loading</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryFromPort }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of destination</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryToPort }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Place of delivery</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ detailedFormDdu.cargoDeliveryLocation || 'Thu Duc, HCMC' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Volume</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedContainerType || '1×20GP' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏷️</div><span class="st2-info-label">Cargo type</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedCommodity?.category || 'General' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">⏱️</div><span class="st2-info-label">Handling time</span><span class="st2-info-colon">:</span><span class="st2-info-value">2 days</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📅</div><span class="st2-info-label">Validity</span><span class="st2-info-colon">:</span><span class="st2-info-value">30 Sep 2025</span></div>
                     </div>
                     <div class="st2-route-card" style="background:#fafafa;">
                       <div class="st2-route-flags">
                         <div class="st2-flag-wrap">
                           <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                           <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                         </div>
                         <div class="st2-route-arrow" style="color:#9ca3af;padding-bottom:20px;">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                         </div>
                         <div class="st2-flag-wrap">
                           <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                           <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 <!-- Charges Table -->
                 <div class="st2-charges-wrap" style="background:#fff;margin-top:20px;">
                   <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                    <colgroup>
                      <col class="st2-col-item" />
                      <col class="st2-col-unit" />
                      <col v-if="tableShow20" class="st2-col-20" />
                      <col v-if="tableShow40" class="st2-col-40" />
                      <col v-if="tableShow45" class="st2-col-45" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-total" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th class="th-unit">Unit</th>
                        <th v-if="tableShow20">20'</th>
                        <th v-if="tableShow40">40'</th>
                        <th v-if="tableShow45">45'</th>
                        <th>B/L</th>
                        <th>Currency</th>
                        <th>Total price</th>
                      </tr>
                    </thead>
                     <tbody>
                       <!-- ARRIVAL CHARGES -->
                       <tr class="st2-tr-section st2-first-section"><td :colspan="5 + tableActiveCols">💲 <a>ARRIVAL CHARGES</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Terminal handling fee</td><td>per Container</td><td v-if="tableShow20">200.00×1</td><td v-if="tableShow40">250.00×1</td><td v-if="tableShow45">250.00×1</td><td class="na">—</td><td>USD</td><td>450.00</td></tr>
                       <tr class="st2-tr-item"><td>Destination document fee</td><td>per Set</td><td v-if="tableShow20" class="na">—</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>50.00</td><td>USD</td><td>50.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>500.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Container cleaning fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">15.00×1</td><td v-if="tableShow40" class="na">30.00×1</td><td v-if="tableShow45" class="na">30.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">45.00</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Container imbalance fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">50.00×1</td><td v-if="tableShow40" class="na">100.00×1</td><td v-if="tableShow45" class="na">100.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">150.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>195.00</td></tr>

                       <!-- CUSTOMS CLEARANCE -->
                       <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a>CUSTOMS CLEARANCE</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Customs clearance fee</td><td>per Container</td><td v-if="tableShow20">15.00×1</td><td v-if="tableShow40">30.00×1</td><td v-if="tableShow45">30.00×1</td><td class="na">—</td><td>USD</td><td>45.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>320.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Inspection service fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">60.00×1</td><td v-if="tableShow40" class="na">60.00×1</td><td v-if="tableShow45" class="na">60.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">60.00</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Port fees for inspection</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na" style="font-style:italic;">As actual</td><td v-if="tableShow40" class="na" style="font-style:italic;">As actual</td><td v-if="tableShow45" class="na" style="font-style:italic;">As actual</td><td class="na" style="font-style:italic;">As actual</td><td class="na" style="font-style:italic;">As actual</td><td style="text-align:center;color:#9ca3af;font-style:italic;">As actual</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>250.00++</td></tr>

                       <!-- DELIVERY CHARGES -->
                       <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a>DELIVERY CHARGES</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Trucking fee</td><td>per Container</td><td v-if="tableShow20">200.00×1</td><td v-if="tableShow40">250.00×1</td><td v-if="tableShow45">250.00×1</td><td class="na">—</td><td>USD</td><td>450.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>450.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Trucking standby</td><td class="st2-tr-item-dim-cell">per Truck</td><td v-if="tableShow20" class="na">80.00×1</td><td v-if="tableShow40" class="na">80.00×1</td><td v-if="tableShow45" class="na">80.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">160.00</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Trucking cancellation fee</td><td class="st2-tr-item-dim-cell">per Truck</td><td v-if="tableShow20" class="na">80.00×1</td><td v-if="tableShow40" class="na">80.00×1</td><td v-if="tableShow45" class="na">80.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">160.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>320.00</td></tr>

                       <!-- PORT CHARGES -->
                       <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a>PORT CHARGES</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Lift fee</td><td>per Container</td><td v-if="tableShow20">80.00×1</td><td v-if="tableShow40">120.00×1</td><td v-if="tableShow45">120.00×1</td><td class="na">—</td><td>USD</td><td>200.00</td></tr>
                       <tr class="st2-tr-item"><td>Infrastructure fee</td><td>per Container</td><td v-if="tableShow20">20.00×1</td><td v-if="tableShow40">30.00×1</td><td v-if="tableShow45">30.00×1</td><td class="na">—</td><td>USD</td><td>50.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>250.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                     </tbody>
                   </table>

                   <!-- Total Footer -->
                   <div class="st2-total-footer" style="border-top:2px solid #e5e7eb;padding:16px 18px;">
                     <span class="st2-total-label">TOTAL PRICE</span>
                     <div class="st2-total-amounts">
                       <div class="st2-total-row">
                         <span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span>
                         <span class="st2-t-amount">USD 1,265.00</span>
                       </div>
                       <div class="st2-total-row">
                         <span class="st2-t-tag st2-conditional">🔴 Conditional:</span>
                         <span class="st2-t-amount" style="color:#9ca3af;">USD 515.00+</span>
                       </div>
                     </div>
                   </div>
                 </div>

               </div>

               <!-- DDP -->
               <div v-if="svcId === 'ddp'">

                 <!-- ST2 Info Card -->
                 <div class="st2-info-card">
                   <!-- LEFT -->
                   <div class="st2-info-left" style="background:#fafafa;">
                     <div class="st2-at-origin-header">
                       <div class="st2-origin-icon" style="background:linear-gradient(135deg,#fef3c7,#fed7aa);">🌍</div>
                       <span class="st2-at-origin-label">AT DESTINATION</span>
                       <div class="st2-at-origin-divider"></div>
                     </div>
                     <div class="st2-service-card">
                       <div class="st2-svc-top">
                         <span class="st2-truck-icon" style="font-size:28px;flex-shrink:0;line-height:1;">🚛</span>
                         <div class="st2-svc-name" v-html="fmtSvcName('Full DDP service: From POD to consignee\'s door (import duty included)')"></div>
                       </div>
                       <div class="st2-svc-desc" style="margin-top:6px;">
                         <span class="st2-info-badge">i</span>
                         <span style="font-size:11px;">Shoptrans will be destination agent who helps to handle for import procedures at destination, deliver container(s) to consignee's warehouse. Including customs clearance and import taxes.</span>
                       </div>
                     </div>
                   </div>
                   <!-- RIGHT -->
                   <div class="st2-info-right" style="background:#fff;">
                     <div class="st2-info-details">
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of loading</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryFromPort }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of destination</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryToPort }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Place of delivery</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ detailedFormDdp.cargoDeliveryLocation || 'Thu Duc, HCMC' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Volume</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedContainerType || '1×20GP' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏷️</div><span class="st2-info-label">Cargo type</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedCommodity?.category || 'General' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">⏱️</div><span class="st2-info-label">Handling time</span><span class="st2-info-colon">:</span><span class="st2-info-value">2 days</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📅</div><span class="st2-info-label">Validity</span><span class="st2-info-colon">:</span><span class="st2-info-value">30 Sep 2025</span></div>
                     </div>
                     <div class="st2-route-card" style="background:#fafafa;">
                       <div class="st2-route-flags">
                         <div class="st2-flag-wrap">
                           <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                           <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                         </div>
                         <div class="st2-route-arrow" style="color:#9ca3af;padding-bottom:20px;">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                         </div>
                         <div class="st2-flag-wrap">
                           <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                           <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 <!-- Charges Table -->
                 <div class="st2-charges-wrap" style="background:#fff;margin-top:20px;">
                   <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                    <colgroup>
                      <col class="st2-col-item" />
                      <col class="st2-col-unit" />
                      <col v-if="tableShow20" class="st2-col-20" />
                      <col v-if="tableShow40" class="st2-col-40" />
                      <col v-if="tableShow45" class="st2-col-45" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-total" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th class="th-unit">Unit</th>
                        <th v-if="tableShow20">20'</th>
                        <th v-if="tableShow40">40'</th>
                        <th v-if="tableShow45">45'</th>
                        <th>B/L</th>
                        <th>Currency</th>
                        <th>Total price</th>
                      </tr>
                    </thead>
                     <tbody>
                       <!-- ARRIVAL CHARGES -->
                       <tr class="st2-tr-section st2-first-section"><td :colspan="5 + tableActiveCols">💲 <a>ARRIVAL CHARGES</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Terminal handling fee</td><td>per Container</td><td v-if="tableShow20">200.00×1</td><td v-if="tableShow40">250.00×1</td><td v-if="tableShow45">250.00×1</td><td class="na">—</td><td>USD</td><td>450.00</td></tr>
                       <tr class="st2-tr-item"><td>Destination document fee</td><td>per Set</td><td v-if="tableShow20" class="na">—</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>50.00</td><td>USD</td><td>50.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>500.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Container cleaning fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">15.00×1</td><td v-if="tableShow40" class="na">30.00×1</td><td v-if="tableShow45" class="na">30.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">45.00</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Container imbalance fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">50.00×1</td><td v-if="tableShow40" class="na">100.00×1</td><td v-if="tableShow45" class="na">100.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">150.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>195.00</td></tr>

                       <!-- CUSTOMS CLEARANCE -->
                       <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a>CUSTOMS CLEARANCE</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Customs clearance fee</td><td>per Container</td><td v-if="tableShow20">15.00×1</td><td v-if="tableShow40">30.00×1</td><td v-if="tableShow45">30.00×1</td><td class="na">—</td><td>USD</td><td>45.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>320.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Inspection service fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">60.00×1</td><td v-if="tableShow40" class="na">60.00×1</td><td v-if="tableShow45" class="na">60.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">60.00</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Port fees for inspection</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na" style="font-style:italic;">As actual</td><td v-if="tableShow40" class="na" style="font-style:italic;">As actual</td><td v-if="tableShow45" class="na" style="font-style:italic;">As actual</td><td class="na" style="font-style:italic;">As actual</td><td class="na" style="font-style:italic;">As actual</td><td style="text-align:center;color:#9ca3af;font-style:italic;">As actual</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>250.00++</td></tr>

                       <!-- DELIVERY CHARGES -->
                       <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a>DELIVERY CHARGES</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Trucking fee</td><td>per Container</td><td v-if="tableShow20">200.00×1</td><td v-if="tableShow40">250.00×1</td><td v-if="tableShow45">250.00×1</td><td class="na">—</td><td>USD</td><td>450.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>450.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Trucking standby</td><td class="st2-tr-item-dim-cell">per Truck</td><td v-if="tableShow20" class="na">80.00×1</td><td v-if="tableShow40" class="na">80.00×1</td><td v-if="tableShow45" class="na">80.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">160.00</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Trucking cancellation fee</td><td class="st2-tr-item-dim-cell">per Truck</td><td v-if="tableShow20" class="na">80.00×1</td><td v-if="tableShow40" class="na">80.00×1</td><td v-if="tableShow45" class="na">80.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">160.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>320.00</td></tr>

                       <!-- PORT CHARGES -->
                       <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a>PORT CHARGES</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Lift fee</td><td>per Container</td><td v-if="tableShow20">80.00×1</td><td v-if="tableShow40">120.00×1</td><td v-if="tableShow45">120.00×1</td><td class="na">—</td><td>USD</td><td>200.00</td></tr>
                       <tr class="st2-tr-item"><td>Infrastructure fee</td><td>per Container</td><td v-if="tableShow20">20.00×1</td><td v-if="tableShow40">30.00×1</td><td v-if="tableShow45">30.00×1</td><td class="na">—</td><td>USD</td><td>50.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>250.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>

                       <!-- TAXES PAYMENT -->
                       <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a>TAXES PAYMENT</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Handling fee</td><td>per Transaction</td><td v-if="tableShow20" class="na">—</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>80.00</td><td>USD</td><td>80.00</td></tr>
                       <tr class="st2-tr-item"><td>Bank fee</td><td>per Transaction</td><td v-if="tableShow20" class="na">—</td><td v-if="tableShow40" class="na">—</td><td v-if="tableShow45" class="na">—</td><td>20.00</td><td>USD</td><td>20.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>100.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                     </tbody>
                   </table>

                   <!-- Total Footer -->
                   <div class="st2-total-footer" style="border-top:2px solid #e5e7eb;padding:16px 18px;">
                     <span class="st2-total-label">TOTAL PRICE</span>
                     <div class="st2-total-amounts">
                       <div class="st2-total-row">
                         <span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span>
                         <span class="st2-t-amount">USD 1,265.00</span>
                       </div>
                       <div class="st2-total-row">
                         <span class="st2-t-tag st2-conditional">🔴 Conditional:</span>
                         <span class="st2-t-amount">USD 515.00+</span>
                       </div>
                     </div>
                   </div>
                 </div>

               </div>

               <!-- Customs Only ST2 Format -->
               <div v-if="svcId === 'customsOnly'">

                 <!-- ST2 Info Card -->
                 <div class="st2-info-card">
                   <!-- LEFT -->
                   <div class="st2-info-left" style="background:#fafafa;">
                     <div class="st2-at-origin-header">
                       <div class="st2-origin-icon" style="background:linear-gradient(135deg,#fef3c7,#fed7aa);">🌍</div>
                       <span class="st2-at-origin-label">AT DESTINATION</span>
                       <div class="st2-at-origin-divider"></div>
                     </div>
                     <div class="st2-service-card">
                       <div class="st2-svc-top">
                         <span class="st2-truck-icon" style="flex-shrink:0;line-height:1;display:flex;align-items:center;">
                           <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                             <path d="M7 34 C7 26 11 23 18 23 C25 23 29 26 29 34 Z" fill="#1d4ed8"/>
                             <polygon points="18,23 16.5,27 18,29 19.5,27" fill="#1e3a8a"/>
                             <path d="M15 23 L18 25.5 L21 23" fill="none" stroke="#e0e7ff" stroke-width="1.2" stroke-linejoin="round"/>
                             <path d="M14.5 25.5 L14.5 29 Q14.5 31 16.5 31.5 L18 32 L19.5 31.5 Q21.5 31 21.5 29 L21.5 25.5 Q19.8 24.8 18 24.8 Q16.2 24.8 14.5 25.5Z" fill="#fbbf24"/>
                             <text x="18" y="29.5" text-anchor="middle" font-family="sans-serif" font-size="3.5" font-weight="700" fill="#92400e">★</text>
                             <rect x="15.5" y="19.5" width="5" height="4" rx="2" fill="#fcd9a0"/>
                             <circle cx="18" cy="14.5" r="6" fill="#fcd9a0"/>
                             <ellipse cx="11.8" cy="14.5" rx="1.2" ry="1.8" fill="#fcd9a0"/>
                             <ellipse cx="24.2" cy="14.5" rx="1.2" ry="1.8" fill="#fcd9a0"/>
                             <path d="M12 11 Q14 7 18 6.5 Q22 7 24 11 Q22 9.5 18 9.5 Q14 9.5 12 11Z" fill="#78350f"/>
                             <ellipse cx="15.5" cy="14" rx="1.2" ry="1.3" fill="white"/>
                             <ellipse cx="20.5" cy="14" rx="1.2" ry="1.3" fill="white"/>
                             <circle cx="15.7" cy="14.2" r="0.7" fill="#1e3a8a"/>
                             <circle cx="20.7" cy="14.2" r="0.7" fill="#1e3a8a"/>
                             <path d="M14.2 12.3 Q15.5 11.5 16.8 12.3" stroke="#78350f" stroke-width="0.8" fill="none" stroke-linecap="round"/>
                             <path d="M19.2 12.3 Q20.5 11.5 21.8 12.3" stroke="#78350f" stroke-width="0.8" fill="none" stroke-linecap="round"/>
                             <path d="M16 16.8 Q18 18 20 16.8" stroke="#c2855a" stroke-width="0.9" fill="none" stroke-linecap="round"/>
                             <rect x="11" y="8.5" width="14" height="2.5" rx="1.2" fill="#1d4ed8"/>
                             <rect x="13" y="5.5" width="10" height="3.5" rx="1" fill="#1d4ed8"/>
                             <polygon points="18,6 18.7,8 20.7,8 19.2,9.2 19.8,11.2 18,10 16.2,11.2 16.8,9.2 15.3,8 17.3,8" fill="#fbbf24"/>
                           </svg>
                         </span>
                         <div class="st2-svc-name" v-html="fmtSvcName('Customs clearance service only')"></div>
                       </div>
                       <div class="st2-svc-desc" style="margin-top:6px;">
                         <span class="st2-info-badge">i</span>
                         <span style="font-size:11px;">Shoptrans works with consignee to complete customs clearance procedures only, other works excluded.</span>
                       </div>
                     </div>
                   </div>
                   <!-- RIGHT -->
                   <div class="st2-info-right" style="background:#fff;">
                     <div class="st2-info-details">
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of loading</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryFromPort }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of destination</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryToPort }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Volume</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedContainerType || '1×20GP' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏷️</div><span class="st2-info-label">Cargo type</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedCommodity?.category || 'General' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">⏱️</div><span class="st2-info-label">Handling time</span><span class="st2-info-colon">:</span><span class="st2-info-value">2 days</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📅</div><span class="st2-info-label">Validity</span><span class="st2-info-colon">:</span><span class="st2-info-value">30 Sep 2025</span></div>
                     </div>
                     <div class="st2-route-card" style="background:#fafafa;">
                       <div class="st2-route-flags">
                         <div class="st2-flag-wrap">
                           <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                           <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                         </div>
                         <div class="st2-route-arrow" style="color:#9ca3af;padding-bottom:20px;">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                         </div>
                         <div class="st2-flag-wrap">
                           <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                           <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 <!-- Charges Table -->
                 <div class="st2-charges-wrap" style="background:#fff;margin-top:20px;">
                   <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                    <colgroup>
                      <col class="st2-col-item" />
                      <col class="st2-col-unit" />
                      <col v-if="tableShow20" class="st2-col-20" />
                      <col v-if="tableShow40" class="st2-col-40" />
                      <col v-if="tableShow45" class="st2-col-45" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-total" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th class="th-unit">Unit</th>
                        <th v-if="tableShow20">20'</th>
                        <th v-if="tableShow40">40'</th>
                        <th v-if="tableShow45">45'</th>
                        <th>B/L</th>
                        <th>Currency</th>
                        <th>Total price</th>
                      </tr>
                    </thead>
                     <tbody>
                       <tr class="st2-tr-section st2-first-section"><td :colspan="5 + tableActiveCols">💲 <a>CUSTOMS CLEARANCE</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item"><td>Customs clearance fee</td><td>per Container</td><td v-if="tableShow20">15.00×1</td><td v-if="tableShow40">30.00×1</td><td v-if="tableShow45">30.00×1</td><td class="na">—</td><td>USD</td><td>45.00</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>320.00</td></tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Inspection service fee</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na">60.00×1</td><td v-if="tableShow40" class="na">60.00×1</td><td v-if="tableShow45" class="na">60.00×1</td><td class="na">—</td><td class="na">USD</td><td style="text-align:center;color:#9ca3af;">60.00</td></tr>
                       <tr class="st2-tr-item"><td class="st2-tr-item-dim-cell">Port fees for inspection</td><td class="st2-tr-item-dim-cell">per Container</td><td v-if="tableShow20" class="na" style="font-style:italic;">As actual</td><td v-if="tableShow40" class="na" style="font-style:italic;">As actual</td><td v-if="tableShow45" class="na" style="font-style:italic;">As actual</td><td class="na" style="font-style:italic;">As actual</td><td class="na" style="font-style:italic;">As actual</td><td style="text-align:center;color:#9ca3af;font-style:italic;">As actual</td></tr>
                       <tr class="st2-tr-subtotal"><td class="blank"></td><td class="blank"></td><td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td><td>250.00++</td></tr>
                     </tbody>
                   </table>

                   <!-- Total Footer -->
                   <div class="st2-total-footer" style="border-top:2px solid #e5e7eb;padding:16px 18px;">
                     <span class="st2-total-label">TOTAL PRICE</span>
                     <div class="st2-total-amounts">
                       <div class="st2-total-row"><span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span><span class="st2-t-amount">USD 320.00</span></div>
                       <div class="st2-total-row"><span class="st2-t-tag st2-conditional">🔴 Conditional:</span><span class="st2-t-amount" style="color:#9ca3af;">USD 250.00+</span></div>
                     </div>
                   </div>
                 </div>

               </div>
               
               <!-- Collect Pay — ST2 Format -->
               <div v-if="svcId === 'collectPay'">

                 <!-- ST2 Info Card -->
                 <div class="st2-info-card">
                   <!-- LEFT -->
                   <div class="st2-info-left" style="background:#fafafa;">
                     <div class="st2-at-origin-header">
                       <div class="st2-origin-icon" style="background:linear-gradient(135deg,#fef3c7,#fed7aa);">🌍</div>
                       <span class="st2-at-origin-label">AT DESTINATION</span>
                       <div class="st2-at-origin-divider"></div>
                     </div>
                     <div class="st2-service-card">
                       <div class="st2-svc-top">
                         <span class="st2-truck-icon" style="flex-shrink:0;line-height:1;display:flex;align-items:center;">
                           <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                             <!-- Paper background --><rect x="6" y="3" width="22" height="28" rx="2.5" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
                             <!-- Folded corner --><path d="M22 3 L28 9 L22 9 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1"/>
                             <!-- Lines on invoice --><line x1="10" y1="14" x2="24" y2="14" stroke="#16a34a" stroke-width="1.4" stroke-linecap="round"/><line x1="10" y1="18" x2="24" y2="18" stroke="#d1fae5" stroke-width="1.2" stroke-linecap="round"/><line x1="10" y1="22" x2="20" y2="22" stroke="#d1fae5" stroke-width="1.2" stroke-linecap="round"/>
                             <!-- Dollar sign circle --><circle cx="27" cy="28" r="7" fill="#16a34a"/>
                             <text x="27" y="31.5" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="white">$</text>
                           </svg>
                         </span>
                         <div class="st2-svc-name" v-html="fmtSvcName('Collect/pay charges as nominated')"></div>
                       </div>
                       <div class="st2-svc-desc" style="margin-top:6px;">
                         <span class="st2-info-badge">i</span>
                         <span style="font-size:11px;">Shoptrans will collect or disburse transportation service fees or other related charges under the customer's instructions.</span>
                       </div>
                     </div>
                   </div>
                   <!-- RIGHT -->
                   <div class="st2-info-right" style="background:#fff;">
                     <div class="st2-info-details">
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of loading</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryFromPort }}, {{ summaryOriginCountry }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of destination</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryToPort }}, {{ summaryDestCountry }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Volume</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedContainerType || '1×20GP' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">💰</div><span class="st2-info-label">Total collection amount</span><span class="st2-info-colon">:</span><span class="st2-info-value">As nominated</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">💸</div><span class="st2-info-label">Total payment amount</span><span class="st2-info-colon">:</span><span class="st2-info-value">As nominated</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">⏱️</div><span class="st2-info-label">Handling time</span><span class="st2-info-colon">:</span><span class="st2-info-value">2 days</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📅</div><span class="st2-info-label">Validity</span><span class="st2-info-colon">:</span><span class="st2-info-value">30 Sep 2025</span></div>
                     </div>
                     <div class="st2-route-card" style="background:#fafafa;">
                       <div class="st2-route-flags">
                         <div class="st2-flag-wrap">
                           <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                           <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                         </div>
                         <div class="st2-route-arrow" style="color:#9ca3af;padding-bottom:20px;">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                         </div>
                         <div class="st2-flag-wrap">
                           <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                           <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 <!-- Charges Table -->
                 <div class="st2-charges-wrap" style="background:#fff;margin-top:20px;">
                   <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                    <colgroup>
                      <col class="st2-col-item" />
                      <col class="st2-col-unit" />
                      <col v-if="tableShow20" class="st2-col-20" />
                      <col v-if="tableShow40" class="st2-col-40" />
                      <col v-if="tableShow45" class="st2-col-45" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-total" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th class="th-unit">Unit</th>
                        <th v-if="tableShow20">20'</th>
                        <th v-if="tableShow40">40'</th>
                        <th v-if="tableShow45">45'</th>
                        <th>Currency</th>
                        <th>Total price</th>
                      </tr>
                    </thead>
                     <tbody>
                       <!-- AGENT HANDLING CHARGES -->
                       <tr class="st2-tr-section st2-first-section"><td :colspan="4 + tableActiveCols">💲 <a style="color:#1f2937;text-decoration:underline;text-underline-offset:2px;cursor:pointer;">AGENT HANDLING CHARGES</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="4 + tableActiveCols">🔒 Confirmed charges</td></tr>
                       <tr class="st2-tr-item">
                         <td>Handling fee</td>
                         <td>per Container</td>
                         <td v-if="tableShow20">50.00×1</td>
                         <td v-if="tableShow40">50.00×1</td>
                         <td v-if="tableShow45" class="na">—</td>
                         <td>USD</td>
                         <td>100.00</td>
                       </tr>
                       <tr class="st2-tr-item">
                         <td>Banking fee</td>
                         <td>per Transaction</td>
                         <td v-if="tableShow20" class="na">—</td>
                         <td v-if="tableShow40" class="na">—</td>
                         <td v-if="tableShow45">30.00</td>
                         <td>USD</td>
                         <td>30.00</td>
                       </tr>
                       <tr class="st2-tr-subtotal">
                         <td class="blank"></td>
                         <td class="blank"></td>
                         <td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td>
                         <td>130.00</td>
                       </tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="4 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                     </tbody>
                   </table>

                   <!-- Total Footer -->
                   <div class="st2-total-footer" style="border-top:2px solid #e5e7eb;padding:16px 18px;">
                     <span class="st2-total-label">TOTAL PRICE</span>
                     <div class="st2-total-amounts">
                       <div class="st2-total-row">
                         <span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span>
                         <span class="st2-t-amount">USD 130.00</span>
                       </div>
                       <div class="st2-total-row">
                         <span class="st2-t-tag st2-conditional">🔴 Conditional:</span>
                         <span class="st2-t-amount" style="color:#9ca3af;">USD 0.00+</span>
                       </div>
                     </div>
                   </div>
                 </div>

               </div>

               <!-- Insurance — ST2 Format -->
               <div v-if="svcId === 'insurance'">

                 <!-- ST2 Info Card -->
                 <div class="st2-info-card">
                   <!-- LEFT -->
                   <div class="st2-info-left" style="background:#fafafa;">
                     <div class="st2-at-origin-header">
                       <div class="st2-origin-icon" style="background:linear-gradient(135deg,#fef3c7,#fed7aa);">🌍</div>
                       <span class="st2-at-origin-label">AT DESTINATION</span>
                       <div class="st2-at-origin-divider"></div>
                     </div>
                     <div class="st2-service-card">
                       <div class="st2-svc-top">
                         <span class="st2-truck-icon" style="flex-shrink:0;line-height:1;display:flex;align-items:center;">
                           <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                             <!-- Shield body --><path d="M18 3 L30 8 L30 19 Q30 27 18 33 Q6 27 6 19 L6 8 Z" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.8"/>
                             <!-- Shield inner fill --><path d="M18 6 L27 10 L27 19 Q27 25 18 30 Q9 25 9 19 L9 10 Z" fill="#dcfce7"/>
                             <!-- Box/cargo inside shield --><rect x="12" y="14" width="12" height="10" rx="1.5" fill="#16a34a"/>
                             <line x1="12" y1="19" x2="24" y2="19" stroke="#f0fdf4" stroke-width="1"/><line x1="18" y1="14" x2="18" y2="24" stroke="#f0fdf4" stroke-width="1"/>
                             <!-- Checkmark overlay --><circle cx="26" cy="27" r="6" fill="#16a34a"/>
                             <polyline points="22.5,27 25,29.5 29.5,24.5" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                           </svg>
                         </span>
                         <div class="st2-svc-name" v-html="fmtSvcName('Buy cargo insurance')"></div>
                       </div>
                       <div class="st2-svc-desc" style="margin-top:6px;">
                         <span class="st2-info-badge">i</span>
                         <span style="font-size:11px;">Shoptrans provides cargo insurance services, works with consignee to buy insurance for the shipment(s).</span>
                       </div>
                     </div>
                   </div>
                   <!-- RIGHT -->
                   <div class="st2-info-right" style="background:#fff;">
                     <div class="st2-info-details">
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of loading</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryFromPort }}, {{ summaryOriginCountry }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of destination</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryToPort }}, {{ summaryDestCountry }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Volume</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedContainerType || '1×20GP' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">🏷️</div><span class="st2-info-label">Cargo type</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedCommodity?.category || 'General' }}</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">⏱️</div><span class="st2-info-label">Handling time</span><span class="st2-info-colon">:</span><span class="st2-info-value">2 days</span></div>
                       <div class="st2-info-row"><div class="st2-info-icon-wrap">📅</div><span class="st2-info-label">Validity</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryValidityDate || '30 Sep 2025' }}</span></div>
                     </div>
                     <div class="st2-route-card" style="background:#fafafa;">
                       <div class="st2-route-flags">
                         <div class="st2-flag-wrap">
                           <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                           <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                         </div>
                         <div class="st2-route-arrow" style="color:#9ca3af;padding-bottom:20px;">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                         </div>
                         <div class="st2-flag-wrap">
                           <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                           <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 <!-- Charges Table -->
                 <div class="st2-charges-wrap" style="background:#fff;margin-top:20px;">
                   <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                    <colgroup>
                      <col class="st2-col-item" />
                      <col class="st2-col-unit" />
                      <col v-if="tableShow20" class="st2-col-20" />
                      <col v-if="tableShow40" class="st2-col-40" />
                      <col v-if="tableShow45" class="st2-col-45" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-total" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th class="th-unit">Unit</th>
                        <th v-if="tableShow20">20'</th>
                        <th v-if="tableShow40">40'</th>
                        <th v-if="tableShow45">45'</th>
                        <th>Currency</th>
                        <th>Total price</th>
                      </tr>
                    </thead>
                     <tbody>
                       <!-- INSURANCE FEE -->
                       <tr class="st2-tr-section st2-first-section"><td :colspan="4 + tableActiveCols">💲 <a style="color:#1f2937;text-decoration:underline;text-underline-offset:2px;cursor:pointer;">INSURANCE FEE</a></td></tr>
                       <tr class="st2-tr-sub st2-confirmed"><td :colspan="4 + tableActiveCols">🔒 Fixed costs</td></tr>
                       <tr class="st2-tr-item">
                         <td>Insurance premium (Min: $ 50)</td>
                         <td>per B/L</td>
                         <td v-if="tableShow20" class="na">—</td>
                         <td v-if="tableShow40" class="na">—</td>
                         <td v-if="tableShow45">0.1% FOB</td>
                         <td>USD</td>
                         <td>50.00</td>
                       </tr>
                       <tr class="st2-tr-item">
                         <td>Handling fee</td>
                         <td>per B/L</td>
                         <td v-if="tableShow20" class="na">—</td>
                         <td v-if="tableShow40" class="na">—</td>
                         <td v-if="tableShow45" class="na">—</td>
                         <td>USD</td>
                         <td>50.00</td>
                       </tr>
                       <tr class="st2-tr-subtotal">
                         <td class="blank"></td>
                         <td class="blank"></td>
                         <td :colspan="tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td>
                         <td>100.00</td>
                       </tr>
                       <tr class="st2-tr-sub st2-conditional"><td :colspan="4 + tableActiveCols">🔴 Potential costs (if incurred)</td></tr>
                     </tbody>
                   </table>

                   <!-- Total Footer -->
                   <div class="st2-total-footer" style="border-top:2px solid #e5e7eb;padding:16px 18px;">
                     <span class="st2-total-label">TOTAL PRICE</span>
                     <div class="st2-total-amounts">
                       <div class="st2-total-row">
                         <span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span>
                         <span class="st2-t-amount">USD 100.00</span>
                       </div>
                       <div class="st2-total-row">
                         <span class="st2-t-tag st2-conditional">🔴 Conditional:</span>
                         <span class="st2-t-amount" style="color:#9ca3af;">USD —</span>
                       </div>
                     </div>
                   </div>
                 </div>

               </div>

                <!-- D/O Release — ST2 Format -->
                <div v-if="svcId === 'dodRelease'">

                  <!-- ST2 Info Card -->
                  <div class="st2-info-card">
                    <!-- LEFT -->
                    <div class="st2-info-left" style="background:#fafafa;">
                      <div class="st2-at-origin-header">
                        <div class="st2-origin-icon" style="background:linear-gradient(135deg,#fef3c7,#fed7aa);">🌍</div>
                        <span class="st2-at-origin-label">AT DESTINATION</span>
                        <div class="st2-at-origin-divider"></div>
                      </div>
                      <div class="st2-service-card">
                        <div class="st2-svc-top">
                          <span class="st2-truck-icon" style="flex-shrink:0;line-height:1;display:flex;align-items:center;">
                            <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                              <!-- Paper background --><rect x="5" y="2" width="26" height="32" rx="2" fill="#fff" stroke="#94a3b8" stroke-width="1.2"/>
                              <!-- Folded corner --><path d="M23 2 L31 10 L23 10 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.8" stroke-linejoin="round"/>
                              <!-- Header bar --><rect x="8" y="12" width="20" height="3.5" rx="0.8" fill="#1d4ed8"/>
                              <!-- Text lines --><rect x="8" y="18" width="16" height="1.8" rx="0.5" fill="#cbd5e1"/><rect x="8" y="21.5" width="20" height="1.8" rx="0.5" fill="#cbd5e1"/><rect x="8" y="25" width="12" height="1.8" rx="0.5" fill="#cbd5e1"/>
                              <!-- Stamp/seal --><circle cx="24" cy="28" r="4" fill="none" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="2 1"/>
                              <text x="24" y="29.5" text-anchor="middle" font-family="sans-serif" font-size="4" font-weight="700" fill="#dc2626">✓</text>
                            </svg>
                          </span>
                          <div class="st2-svc-name" v-html="fmtSvcName('Consignee Delivery Order (D/O) Release Service')"></div>
                        </div>
                        <div class="st2-svc-desc" style="margin-top:6px;">
                          <span class="st2-info-badge">i</span>
                          <span style="font-size:11px;">Shoptrans or its agent will act as your delivery agent in the importing country, providing continuous and detailed shipment updates.</span>
                        </div>
                      </div>
                    </div>
                    <!-- RIGHT -->
                    <div class="st2-info-right" style="background:#fff;">
                      <div class="st2-info-details">
                        <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of loading</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryFromPort }}, {{ summaryOriginCountry }}</span></div>
                        <div class="st2-info-row"><div class="st2-info-icon-wrap">🏗️</div><span class="st2-info-label">Port of destination</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryToPort }}, {{ summaryDestCountry }}</span></div>
                        <div class="st2-info-row"><div class="st2-info-icon-wrap">📦</div><span class="st2-info-label">Volume</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedContainerType || '1×20GP' }}</span></div>
                        <div class="st2-info-row"><div class="st2-info-icon-wrap">🏷️</div><span class="st2-info-label">Cargo type</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ selectedCommodity?.category || 'General' }}</span></div>
                        <div class="st2-info-row"><div class="st2-info-icon-wrap">⏱️</div><span class="st2-info-label">Handling time</span><span class="st2-info-colon">:</span><span class="st2-info-value">2 days</span></div>
                        <div class="st2-info-row"><div class="st2-info-icon-wrap">📅</div><span class="st2-info-label">Validity</span><span class="st2-info-colon">:</span><span class="st2-info-value">{{ summaryValidityDate || '30 Sep 2025' }}</span></div>
                      </div>
                      <div class="st2-route-card" style="background:#fafafa;">
                        <div class="st2-route-flags">
                          <div class="st2-flag-wrap">
                            <img :src="originFlagImage" :alt="summaryOriginCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                            <span class="st2-flag-label">{{ summaryOriginCountry }}</span>
                          </div>
                          <div class="st2-route-arrow" style="color:#9ca3af;padding-bottom:20px;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                          </div>
                          <div class="st2-flag-wrap">
                            <img :src="destFlagImage" :alt="summaryDestCountry" class="round-flag flag-circle" style="width:54px;height:54px;border-radius:50%;object-fit:cover;" />
                            <span class="st2-flag-label">{{ summaryDestCountry }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Charges Table -->
                  <div class="st2-charges-wrap" style="background:#fff;margin-top:20px;">
                    <table class="st2-table" :class="{ 'st2-hide-col-20': !tableShow20, 'st2-hide-col-40': !tableShow40, 'st2-hide-col-45': !tableShow45 }">
                    <colgroup>
                      <col class="st2-col-item" />
                      <col class="st2-col-unit" />
                      <col v-if="tableShow20" class="st2-col-20" />
                      <col v-if="tableShow40" class="st2-col-40" />
                      <col v-if="tableShow45" class="st2-col-45" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-cur" />
                      <col class="st2-col-total" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th class="th-unit">Unit</th>
                        <th v-if="tableShow20">20'</th>
                        <th v-if="tableShow40">40'</th>
                        <th v-if="tableShow45">45'</th>
                        <th>B/L</th>
                        <th>Currency</th>
                        <th>Total price</th>
                      </tr>
                    </thead>
                      <tbody>
                        <!-- ARRIVAL CHARGES -->
                        <tr class="st2-tr-section st2-first-section"><td :colspan="5 + tableActiveCols">💲 <a style="color:#1f2937;text-decoration:underline;text-underline-offset:2px;cursor:pointer;">ARRIVAL CHARGES</a></td></tr>
                        <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                        <tr class="st2-tr-item">
                          <td>Terminal Handling Charge</td>
                          <td>per Container</td>
                          <td v-if="tableShow20">200.00×1</td>
                          <td v-if="tableShow40">250.00×1</td>
                          <td v-if="tableShow45" class="na">—</td>
                          <td class="na">—</td>
                          <td>USD</td>
                          <td>450.00</td>
                        </tr>
                        <tr class="st2-tr-item">
                          <td>Delivery Order Fee</td>
                          <td>per Set</td>
                          <td v-if="tableShow20" class="na">—</td>
                          <td v-if="tableShow40" class="na">—</td>
                          <td v-if="tableShow45" class="na">—</td>
                          <td>40.00</td>
                          <td>USD</td>
                          <td>40.00</td>
                        </tr>
                        <tr class="st2-tr-item">
                          <td>Container Imbalance Charge</td>
                          <td>per Container</td>
                          <td v-if="tableShow20">50.00×1</td>
                          <td v-if="tableShow40">100.00×1</td>
                          <td v-if="tableShow45" class="na">—</td>
                          <td class="na">—</td>
                          <td>USD</td>
                          <td>150.00</td>
                        </tr>
                        <tr class="st2-tr-item">
                          <td>Container Cleaning Charge</td>
                          <td>per Container</td>
                          <td v-if="tableShow20">15.00×1</td>
                          <td v-if="tableShow40">30.00×1</td>
                          <td v-if="tableShow45" class="na">—</td>
                          <td class="na">—</td>
                          <td>USD</td>
                          <td>45.00</td>
                        </tr>
                        <tr class="st2-tr-item">
                          <td>Container Maintenance Charge</td>
                          <td>per Container</td>
                          <td v-if="tableShow20">15.00×1</td>
                          <td v-if="tableShow40">30.00×1</td>
                          <td v-if="tableShow45" class="na">—</td>
                          <td class="na">—</td>
                          <td>USD</td>
                          <td>45.00</td>
                        </tr>
                        <tr class="st2-tr-subtotal">
                          <td class="blank"></td>
                          <td class="blank"></td>
                          <td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td>
                          <td>730.00</td>
                        </tr>
                        <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                        <tr class="st2-tr-item">
                          <td class="st2-tr-item-dim-cell">Container Deposit Charge</td>
                          <td class="st2-tr-item-dim-cell">per Container</td>
                           <td v-if="tableShow20" class="na">—</td>
                           <td v-if="tableShow40" class="na">50.00×1</td>
                           <td v-if="tableShow45" class="na">—</td>
                           <td class="na">—</td>
                           <td class="na">USD</td>
                          <td style="text-align:center;color:#9ca3af;">50.00</td>
                        </tr>
                        <tr class="st2-tr-subtotal">
                          <td class="blank"></td>
                          <td class="blank"></td>
                          <td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td>
                          <td>50.00</td>
                        </tr>

                        <!-- AGENT HANDLING CHARGES -->
                        <tr class="st2-tr-section"><td :colspan="5 + tableActiveCols">💲 <a style="color:#1f2937;text-decoration:underline;text-underline-offset:2px;cursor:pointer;">AGENT HANDLING CHARGES</a></td></tr>
                        <tr class="st2-tr-sub st2-confirmed"><td :colspan="5 + tableActiveCols">🔒 Confirmed charges</td></tr>
                        <tr class="st2-tr-item">
                          <td>Agent Handling Fee</td>
                          <td>B/L</td>
                          <td v-if="tableShow20" class="na">—</td>
                          <td v-if="tableShow40" class="na">—</td>
                          <td v-if="tableShow45" class="na">—</td>
                          <td>75.00</td>
                          <td>USD</td>
                          <td>75.00</td>
                        </tr>
                        <tr class="st2-tr-subtotal">
                          <td class="blank"></td>
                          <td class="blank"></td>
                          <td :colspan="1 + tableActiveCols" class="blank"></td><td class="subtotal-lbl">Subtotal</td>
                          <td>75.00</td>
                        </tr>
                        <tr class="st2-tr-sub st2-conditional"><td :colspan="5 + tableActiveCols">🔴 Conditional charges (if incurred)</td></tr>
                      </tbody>
                    </table>

                    <!-- Total Footer -->
                    <div class="st2-total-footer" style="border-top:2px solid #e5e7eb;padding:16px 18px;">
                      <span class="st2-total-label">TOTAL PRICE</span>
                      <div class="st2-total-amounts">
                        <div class="st2-total-row">
                          <span class="st2-t-tag st2-confirmed">🔒 Confirmed:</span>
                          <span class="st2-t-amount">USD 805.00</span>
                        </div>
                        <div class="st2-total-row">
                          <span class="st2-t-tag st2-conditional">🔴 Conditional:</span>
                          <span class="st2-t-amount" style="color:#9ca3af;">USD 50.00+</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

            </div>
            </div>
          </template>


    <div style="margin-top: 24px; padding-bottom: 24px;">
      <!-- Total Price Section (only shows as GRAND TOTAL when multiple services selected) -->
      <div v-if="(services.origin.selected.length + services.sea.selected.length + services.dest.selected.length) > 1" class="total-price-section" style="border-top: 2px solid #000000ff; margin-top: 0; padding-top: 20px;">
        <div class="total-price-left">
          <span class="total-price-title">GRAND TOTAL</span>
        </div>
        <div class="total-price-right">
          <div class="total-line fixed-total">
            <span class="total-label"><img :src="img_109" alt="" class="cost-icon" /> Fixed:</span>
            <span class="total-value">USD {{ computedFixedTotal }}</span>
          </div>
          <div class="total-line potential-total">
            <span class="total-label"><img :src="img_110" alt="" class="cost-icon" /> Potential:</span>
            <span class="total-value potential-text">USD {{ computedPotentialTotal }}</span>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
        <div class="st2-actions" style="border: none; padding: 0;">
          <button class="st2-btn" @click="handleBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 8 12 12 16"/><line x1="16" y1="12" x2="8" y2="12"/></svg>
            Back
          </button>
          <button v-show="false" class="st2-btn st2-btn-cart" @click="handleAddToCart">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Add cart
          </button>
          <button class="st2-btn st2-btn-purchase" @click="openPurchaseForm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Purchase
          </button>
        </div>
      </div>
    </div>
  </div> <!-- End submitted-summary -->
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Ref, ComputedRef } from 'vue'

// Inject shared state from parent
const services = inject('fcl-services') as any
const activeServiceTab = inject('fcl-activeServiceTab') as Ref<string>
const allServiceTabs = inject('fcl-allServiceTabs') as ComputedRef<any[]>
const orderedOriginServices = inject('fcl-orderedOriginServices') as ComputedRef<string[]>
const orderedSeaServices = inject('fcl-orderedSeaServices') as ComputedRef<string[]>
const orderedDestServices = inject('fcl-orderedDestServices') as ComputedRef<string[]>
const fmtSvcName = inject('fcl-fmtSvcName') as (s: string) => string
const getServiceName = inject('fcl-getServiceName') as (id: string) => string
const getServiceCostSummary = inject('fcl-getServiceCostSummary') as (id: string) => any
const originExpandedState = inject('fcl-originExpandedState') as any
const seaExpandedState = inject('fcl-seaExpandedState') as any
const destExpandedState = inject('fcl-destExpandedState') as any
const isSeaExpanded = inject('fcl-isSeaExpanded') as Ref<boolean>
const toggleOriginExpand = inject('fcl-toggleOriginExpand') as (id: string) => void
const toggleSeaExpand = inject('fcl-toggleSeaExpand') as (id: string) => void
const toggleDestExpand = inject('fcl-toggleDestExpand') as (id: string) => void
const tableShow20 = inject('fcl-tableShow20') as ComputedRef<boolean>
const tableShow40 = inject('fcl-tableShow40') as ComputedRef<boolean>
const tableShow45 = inject('fcl-tableShow45') as ComputedRef<boolean>
const tableActiveCols = inject('fcl-tableActiveCols') as ComputedRef<number>
const tableQty20 = inject('fcl-tableQty20') as ComputedRef<number>
const tableQty40 = inject('fcl-tableQty40') as ComputedRef<number>
const tableQty45 = inject('fcl-tableQty45') as ComputedRef<number>
const openServiceDetails = inject('fcl-openServiceDetails') as (type: string, id: string) => void
const removeService = inject('fcl-removeService') as (type: string, id: string) => void
const handleBack = inject('fcl-handleBack') as () => void
const handleAddToCart = inject('fcl-handleAddToCart') as () => void
const openPurchaseForm = inject('fcl-openPurchaseForm') as () => void
const showSpotPriceBreakdown = inject('fcl-showSpotPriceBreakdown') as Ref<boolean>
const offeredSailingState = inject('fcl-offeredSailingState') as any
const toggleOfferedRoute = inject('fcl-toggleOfferedRoute') as (key: string) => void
const toggleOfferedBreakdown = inject('fcl-toggleOfferedBreakdown') as (key: string) => void
const toggleOfferedSelect = inject('fcl-toggleOfferedSelect') as (key: string) => void
const offeredCarrierName = inject('fcl-offeredCarrierName') as Ref<string>
const groupedSailings = inject('fcl-groupedSailings') as ComputedRef<any[]>
const selectedCarrierSchedule = inject('fcl-selectedCarrierSchedule') as ComputedRef<any>
const isFetchingOffered = inject('fcl-isFetchingOffered') as Ref<boolean>
const spotCarrierName = inject('fcl-spotCarrierName') as Ref<string>
const groupedSpotSailings = inject('fcl-groupedSpotSailings') as ComputedRef<any[]>
const spotCarrierSchedule = inject('fcl-spotCarrierSchedule') as ComputedRef<any>
const isFetchingSpot = inject('fcl-isFetchingSpot') as Ref<boolean>
const cargoWeight = inject('fcl-cargoWeight') as Ref<string>
const addSailingToCart = inject('fcl-addSailingToCart') as (sailing: any, rateType: string, carrierName: string, sailingKey: string) => void
const spotSailingState = inject('fcl-spotSailingState') as any
const toggleSpotRoute = inject('fcl-toggleSpotRoute') as (key: string) => void
const toggleSpotBreakdown = inject('fcl-toggleSpotBreakdown') as (key: string) => void
const toggleSpotSelect = inject('fcl-toggleSpotSelect') as (key: string) => void
const changeOptionGoToStep2 = inject('fcl-changeOptionGoToStep2') as () => void
const showDlDropdown = inject('fcl-showDlDropdown') as Ref<boolean>
const downloadDropdownRef = inject('fcl-downloadDropdownRef') as Ref<any>
const downloadCurrentService = inject('fcl-downloadCurrentService') as () => void
const downloadAllServices = inject('fcl-downloadAllServices') as () => void
const selectedContainerType = inject('fcl-selectedContainerType') as Ref<string>

// Summary helper functions & computed values
const tblCell = inject('fcl-tblCell') as (unitPrice: number, qty: number, show: boolean) => string
const tblTotal = inject('fcl-tblTotal') as (rates: { s20?: number; s40?: number; s45?: number }) => string
const summaryFromPort = inject('fcl-summaryFromPort') as ComputedRef<string>
const summaryToPort = inject('fcl-summaryToPort') as ComputedRef<string>
const summaryOriginCountry = inject('fcl-summaryOriginCountry') as ComputedRef<string>
const summaryDestCountry = inject('fcl-summaryDestCountry') as ComputedRef<string>
const summaryValidityDate = inject('fcl-summaryValidityDate') as ComputedRef<string>
const originFlagImage = inject('fcl-originFlagImage') as ComputedRef<string>
const destFlagImage = inject('fcl-destFlagImage') as ComputedRef<string>
const selectedCommodity = inject('fcl-selectedCommodity') as Ref<any>
const computedFixedTotal = inject('fcl-computedFixedTotal') as ComputedRef<string>
const computedPotentialTotal = inject('fcl-computedPotentialTotal') as ComputedRef<string>
const summaryPickupLocation = inject('fcl-summaryPickupLocation') as ComputedRef<string>
const summaryPortOfLoading = inject('fcl-summaryPortOfLoading') as ComputedRef<string>
const summaryPortOfDestination = inject('fcl-summaryPortOfDestination') as ComputedRef<string>
const summaryVolume = inject('fcl-summaryVolume') as ComputedRef<string>
const summaryCargoType = inject('fcl-summaryCargoType') as ComputedRef<string>
const summaryDeliveryLocation = inject('fcl-summaryDeliveryLocation') as ComputedRef<string>
const selectedCarrier = inject('fcl-selectedCarrier') as Ref<any>
const selectedCarrierForSummary = inject('fcl-selectedCarrierForSummary') as any
const detailedForm = inject('fcl-detailedForm') as any
const detailedFormDdp = inject('fcl-detailedFormDdp') as any
const detailedFormDap = inject('fcl-detailedFormDap') as any
const detailedFormDdu = inject('fcl-detailedFormDdu') as any
const detailedFormAvailable = inject('fcl-availableBooking') as any
const detailedFormContract = inject('fcl-contractBooking') as any
const selectedCarrierName = inject('fcl-selectedCarrierName') as ComputedRef<string>

// Image imports
const img_109 = inject('fcl-img_109') as string
const img_110 = inject('fcl-img_110') as string
const carriertemp = inject('fcl-carriertemp') as string
const iconOrigin = inject('fcl-iconOrigin') as string
const iconSea = inject('fcl-iconSea') as string
const iconDest = inject('fcl-iconDest') as string
const goBackImg = inject('fcl-goBackImg') as string
const cartIcon = inject('fcl-cartIcon') as string
const purchaseBtnIcon = inject('fcl-purchaseBtnIcon') as string
const iconPickup = inject('fcl-iconPickup') as string
const iconPortLoading = inject('fcl-iconPortLoading') as string
const iconPortDestination = inject('fcl-iconPortDestination') as string
const iconVolume = inject('fcl-iconVolume') as string
const iconCargoType = inject('fcl-iconCargoType') as string
const iconValidity = inject('fcl-iconValidity') as string
const img_23 = inject('fcl-img_23') as string
const img_20 = inject('fcl-img_20') as string
const ship4png = inject('fcl-ship4png') as string
const serviceImg21 = inject('fcl-serviceImg21') as string
const img_129 = inject('fcl-img_129') as string
const img_19 = inject('fcl-img_19') as string
const img_17 = inject('fcl-img_17') as string
const img_18 = inject('fcl-img_18') as string
const img_15 = inject('fcl-img_15') as string
const showCarrierModal = inject('fcl-showCarrierModal') as import('vue').Ref<boolean>
</script>

<style>
.summary-full-content {
  font-family: 'DM Sans', sans-serif;
}
/* ===== ST2: Full EXW summary layout (matches 1.ST2-Full EXW.html) ===== */
.st2-info-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 310px 1fr;
  margin-bottom: 16px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  overflow: hidden;
}
.st2-info-left {
  border-right: 1px solid #e5e7eb;
  padding: 18px 16px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.st2-at-origin-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.st2-origin-icon {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fef3c7, #fed7aa);
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; flex-shrink: 0;
}
.st2-at-origin-label {
  font-size: 12px; font-weight: 700;
  color: #1f2937; letter-spacing: 0.08em; text-transform: uppercase;
}
.st2-at-origin-divider {
  flex: 1; height: 1px; background: #e5e7eb;
}
.st2-service-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
  display: flex; flex-direction: column; gap: 8px;
}
.st2-svc-top {
  display: flex; align-items: flex-start; gap: 10px;
}
.st2-truck-icon {
  font-size: 28px; flex-shrink: 0; line-height: 1;
}
.st2-svc-name {
  font-size: 12px; font-weight: 400;
  color: #15803d; line-height: 1.45;
}
.st2-svc-name :deep(strong) {
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
}
.st2-svc-desc {
  font-size: 11px; color: #6b7280;
  line-height: 1.5; display: flex; gap: 6px;
}
.st2-info-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 14px; height: 14px; background: #3b82f6; color: #fff;
  border-radius: 50%; font-size: 9px; font-weight: 700;
  flex-shrink: 0; margin-top: 1px;
}
.st2-info-right {
  padding: 18px 18px 18px 22px;
  display: flex; gap: 16px; align-items: center;
}
.st2-info-details {
  flex: 1; display: flex; flex-direction: column; gap: 7px;
}
.st2-info-row {
  display: flex; align-items: flex-start;
  font-size: 13px; line-height: 1.4;
}
.st2-info-icon-wrap {
  width: 22px; flex-shrink: 0; font-size: 13px; padding-top: 1px;
}
.st2-info-label {
  color: #6b7280; white-space: nowrap; width: 140px; flex-shrink: 0;
}
.st2-info-colon {
  color: #9ca3af; margin-right: 5px;
}
.st2-info-value {
  color: #1f2937; font-weight: 500;
}
.st2-route-card {
  flex-shrink: 0; width: 190px;
  border: 1px solid #e5e7eb; border-radius: 10px;
  background: #fafafa;
  display: flex; align-items: center; justify-content: center;
  padding: 16px 12px;
}
.st2-route-flags {
  display: flex; align-items: center; gap: 5px;
}
.st2-flag-wrap {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.st2-flag-circle {
  width: 54px; height: 54px; border-radius: 50%; overflow: hidden;
  flex-shrink: 0; border: 1.5px solid #e5e7eb;
}
.st2-flag-label {
  font-size: 12px; font-weight: 600; color: #1f2937;
}
.st2-route-arrow {
  color: #9ca3af; padding-bottom: 20px; flex-shrink: 0;
}
.st2-charges-wrap {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  overflow: hidden;
  margin-bottom: 16px;
}
.st2-table {
  width: 100%; border-collapse: collapse; table-layout: fixed;
}
.st2-col-item  { width: 20%; }
.st2-table thead tr { border-bottom: 2px solid #e5e7eb; }
.st2-table thead th {
  padding: 11px 12px; font-size: 12px; font-weight: 600; color: #6b7280;
  background: #fafafa; text-align: center; white-space: nowrap;
}
.st2-table thead th:first-child { text-align: left; }
.st2-table thead th.th-unit { text-align: center; }
.st2-tr-section td {
  padding: 11px 12px 4px; font-size: 12px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase; color: #1f2937;
  border-top: 2px solid #e5e7eb;
}
.st2-first-section td { border-top: none; padding-top: 10px; }
.st2-tr-section td a { color: #1f2937; text-decoration: underline; text-underline-offset: 2px; cursor: pointer; }
.st2-tr-sub td { padding: 5px 12px; font-size: 12px; font-weight: 700; }
.st2-confirmed td  { color: #15803d; background: #f0fdf4; border-top: 1px solid #bbf7d0; border-bottom: 1px solid #bbf7d0; }
.st2-conditional td { color: #dc2626; background: #fff5f5; border-top: 1px solid #fecaca; border-bottom: 1px solid #fecaca; }
.st2-tr-item td {
  padding: 9px 12px; font-size: 13px; color: #1f2937;
  border-bottom: 1px solid #f3f4f6; text-align: center;
}
.st2-tr-item td:first-child { text-align: left; }
.st2-tr-item td.td-unit { text-align: center; }
.st2-tr-item td.na { color: #9ca3af; text-align: center; }
.st2-tr-item-dim td { color: #9ca3af; }
.st2-tr-item td.st2-tr-item-dim-cell { color: #9ca3af; }
.st2-tr-subtotal td {
  padding: 6px 12px; font-size: 13px; font-weight: 700;
  background: #f9fafb; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; text-align: center;
}
.st2-tr-subtotal td.blank { visibility: hidden; }
.st2-tr-subtotal td.subtotal-lbl { text-align: center; color: #1f2937; }
.st2-total-footer {
  border-top: 2px solid #e5e7eb;
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 16px 18px; background: #fff;
}
.st2-total-label {
  font-size: 15px; font-weight: 700; letter-spacing: 0.04em; color: #1f2937;
}
.st2-total-amounts { display: flex; flex-direction: column; gap: 5px; }
.st2-total-row { display: flex; align-items: center; }
.st2-t-tag {
  font-size: 13px; font-weight: 600; width: 130px;
  text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 5px;
}
.st2-t-tag.st2-confirmed  { color: #15803d; }
.st2-t-tag.st2-conditional { color: #dc2626; }
.st2-t-amount {
  font-size: 16px; font-weight: 700; color: #1f2937;
  min-width: 130px; text-align: right;
}
.st2-actions {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 18px; padding-top: 16px; border-top: 1px solid #e5e7eb;
}
.st2-btn { display: flex; align-items: center; gap: 8px; padding: 10px 22px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; border: 1px solid #e5e7eb; background: #fff; color: #1f2937; }
.st2-btn:hover { background: #f9fafb; }
.st2-btn-cart { background: #fff7ed; color: #ea580c; border-color: #fed7aa; }
.st2-btn-cart:hover { background: #ffedd5; }
.st2-btn-purchase { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; font-weight: 700; }
.st2-btn-purchase:hover { background: #dcfce7; }
.st2-carrier-select-wrap { padding: 24px 20px 20px; display: flex; flex-direction: column; align-items: center; gap: 14px; border-bottom: 1px solid #e5e7eb; }
.st2-carrier-select-title { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #1f2937; }
.st2-carrier-select-field { position: relative; width: 380px; }
.st2-carrier-select-field select { width: 100%; padding: 10px 40px 10px 16px; border: 1px solid #e5e7eb; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1f2937; background: #fff; appearance: none; -webkit-appearance: none; cursor: pointer; outline: none; transition: border-color 0.18s; }
.st2-carrier-select-field select:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.1); }
.st2-sel-arrow { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; }
.st2-carrier-header { font-size: 22px; font-weight: 700; background: linear-gradient(135deg, #1d4ed8, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: 0.03em; margin-bottom: 2px; }
.st2-carrier-subtitle { font-size: 11px; color: #9ca3af; margin-bottom: 16px; }
.st2-sail-date-header { font-size: 13px; font-weight: 700; color: #1e40af; margin: 20px 0 8px; padding: 5px 12px; background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 0 6px 6px 0; display: inline-block; }
.st2-live-status { margin: 14px 0 4px; padding: 10px 12px; border: 1px solid #dbeafe; border-radius: 8px; background: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 600; }
.st2-live-status.is-warning { border-color: #fde68a; background: #fffbeb; color: #92400e; }
.st2-live-status.is-error { border-color: #fecaca; background: #fef2f2; color: #b91c1c; }
.st2-sail-card { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
.st2-sail-info-row { display: grid; grid-template-columns: repeat(5, 1fr) auto; gap: 0; padding: 14px 18px; background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%); border-bottom: 1px solid #e2e8f0; align-items: start; }
.st2-sail-info-cell { display: flex; flex-direction: column; gap: 5px; }
.st2-sail-info-label { font-size: 11px; color: #64748b; display: flex; align-items: center; gap: 5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
.st2-sail-info-value { font-size: 12.5px; font-weight: 700; color: #0f172a; }
.st2-sail-route-link { font-size: 11.5px; color: #2563eb; text-decoration: underline; cursor: pointer; white-space: nowrap; padding-top: 2px; text-align: right; font-weight: 600; }
.st2-sail-price-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; background: linear-gradient(90deg, #fff 60%, #f0fdf4 100%); }
.st2-price-unavailable { display: inline-flex; align-items: center; max-width: 360px; margin-left: auto; margin-right: 16px; padding: 5px 10px; border: 1px solid #fde68a; border-radius: 18px; background: #fffbeb; color: #92400e; font-size: 12px; font-weight: 600; line-height: 1.35; }
.st2-sail-live-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: #0f172a; }
.st2-sail-live-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.25); flex-shrink: 0; animation: pulse-dot 1.8s ease-in-out infinite; }
.st2-sail-price-tag { text-align: right; margin-right: 16px; }
.st2-sail-price-tag .price-main { font-size: 17px; font-weight: 700; color: #0f172a; }
.st2-sail-price-tag .price-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
.st2-sail-price-tag .price-link { font-size: 11px; color: #2563eb; text-decoration: underline; cursor: pointer; }
.st2-sail-btns { display: flex; flex-direction: column; gap: 6px; min-width: 114px; }
.st2-sail-btn { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 14px; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.18s; border: 1px solid #e2e8f0; background: #fff; color: #374151; white-space: nowrap; }
.st2-sail-btn:hover { background: #f1f5f9; }
.st2-sail-btn.st2-cart-btn { border-color: #e2e8f0; color: #374151; }
.st2-sail-btn.st2-purchase-active { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; border-color: #fbbf24; font-weight: 700; box-shadow: 0 2px 6px rgba(251,191,36,0.3); }
.st2-sail-btn.st2-purchase-active:hover { background: linear-gradient(135deg, #fde68a, #fcd34d); }
.st2-sail-btn.st2-selected-active { background: linear-gradient(135deg, #16a34a, #22c55e); color: #fff; border-color: #15803d; font-weight: 700; box-shadow: 0 2px 6px rgba(22,163,74,0.35); }
.st2-sail-btn.st2-selected-active:hover { background: linear-gradient(135deg, #15803d, #16a34a); }
.st2-breakdown-toggle { display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; font-size: 11px; color: #2563eb; cursor: pointer; text-decoration: underline; text-underline-offset: 2px; font-weight: 600; background: none; border: none; padding: 0; }
.st2-breakdown-toggle svg { transition: transform 0.2s; }
.st2-breakdown-toggle.open svg { transform: rotate(180deg); }
.st2-breakdown-body { display: block; border-top: 1px solid #e2e8f0; background: #fff; font-size: 12px; }
.st2-route-panel { border-top: 1px solid #e2e8f0; background: #f8fafc; }
.st2-route-panel-inner { padding: 16px 20px 20px; }
.st2-route-panel-subtitle { font-size: 11px; color: #94a3b8; margin-bottom: 16px; font-style: italic; }
.st2-route-two-col { display: grid; grid-template-columns: 46% 50%; gap: 0 4%; align-items: start; }
.st2-route-col-title { font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
.st2-route-stop { display: flex; gap: 0; margin-bottom: 0; }
.st2-route-stop-left { width: 140px; min-width: 140px; text-align: right; flex-shrink: 0; padding-right: 14px; padding-top: 2px; }
.st2-route-stop-port { font-size: 12px; font-weight: 700; color: #0f172a; white-space: nowrap; }
.st2-route-stop-terminal { font-size: 10px; color: #64748b; line-height: 1.4; text-transform: uppercase; letter-spacing: 0.02em; margin-top: 2px; }
.st2-route-stop-right { flex: 1; padding-left: 16px; border-left: 2px solid #cbd5e1; padding-bottom: 20px; position: relative; }
.st2-route-stop-right::before { content: ''; position: absolute; left: -5px; top: 5px; width: 8px; height: 8px; border-radius: 50%; background: #fff; border: 2px solid #3b82f6; box-shadow: 0 0 0 2px #eff6ff; }
.st2-route-stop:last-child .st2-route-stop-right { border-left: 2px solid #cbd5e1; padding-bottom: 4px; }
.st2-route-stop:last-child .st2-route-stop-right::before { border-color: #10b981; box-shadow: 0 0 0 2px #f0fdf4; }
.st2-route-action { font-size: 12px; color: #374151; line-height: 1.4; }
.st2-route-action strong { color: #0f172a; font-weight: 700; }
.st2-route-action-time { font-size: 11.5px; color: #64748b; margin-top: 3px; margin-bottom: 6px; }
.st2-route-vessel-box { margin-top: 6px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 5px; padding: 7px 12px; display: inline-grid; grid-template-columns: auto auto auto auto; gap: 2px 20px; margin-bottom: 4px; }
.st2-route-vessel-label { font-size: 10px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
.st2-route-vessel-value { font-size: 11.5px; color: #0f172a; font-weight: 600; }
.st2-deadlines-box { border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; overflow: hidden; }
.st2-deadlines-title { font-size: 12px; font-weight: 700; color: #0f172a; padding: 11px 16px 9px; display: flex; align-items: center; gap: 7px; border-bottom: 1px solid #e2e8f0; background: #fff; }
.st2-deadline-row { display: flex; justify-content: space-between; align-items: baseline; padding: 9px 16px; border-bottom: 1px solid #f1f5f9; gap: 16px; }
.st2-deadline-label { font-size: 11.5px; color: #374151; flex: 1; line-height: 1.4; }
.st2-deadline-value { font-size: 11.5px; font-weight: 700; color: #0f172a; white-space: nowrap; }
.st2-deadlines-note { margin: 8px 12px 12px; padding: 10px 12px; background: #eff6ff; border-radius: 6px; font-size: 11px; color: #1d4ed8; line-height: 1.55; display: flex; gap: 8px; align-items: flex-start; }
.submitted-summary {
  padding: 20px;
  background: #fff;
  margin-top: 0px;
  max-width: 1250px;
  margin-left: auto;
  margin-right: auto;
}
.download-page-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #fff;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  color: #e74c3c;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.download-page-btn:hover {
  background: #e74c3c;
  color: #fff;
}
.download-page-btn i {
  font-size: 14px;
}
.download-page-btn-inline {
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  background: #f8f9fa;
  border: 1px dashed #0b3b66;
  border-radius: 6px;
  color: #0b3b66;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}
.download-page-btn-inline:hover {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
}
.service-tabs-bar {
  display: flex;
  align-items: stretch;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 16px;
  gap: 0;
}
.service-tabs-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 0 6px;
}
.service-tabs-group-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 4px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 6px;
}
.tabs-group-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  flex-shrink: 0;
}
.tabs-group-title {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
}
.service-tabs-group-items {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.service-tabs-divider {
  width: 2px;
  background: #b0b6bf;
  margin: 0 6px;
  align-self: stretch;
  flex-shrink: 0;
}
.service-tab-btn {
  display: flex;
  align-items: center;
  padding: 7px 12px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  white-space: normal;
  word-break: break-word;
}
.service-tab-btn:hover {
  background: #e8edf3;
  border-color: #b0bec5;
}
.service-tab-btn.active {
  background: #16a34a;
  border-color: #16a34a;
  box-shadow: 0 2px 6px rgba(11, 59, 102, 0.25);
}
.service-tab-label {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}
.service-tab-btn.active .service-tab-label {
  color: #fff;
}
.service-tab-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  border-radius: 50%;
  background: #e8f5e9;
  border: 1.5px solid #16a34a;
  color: #15803d;
  font-size: 11px;
  font-weight: 700;
  margin-right: 7px;
  flex-shrink: 0;
  line-height: 1;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.service-tab-btn.active .service-tab-num {
  background: rgba(255,255,255,0.25);
  border-color: rgba(255,255,255,0.7);
  color: #fff;
}
.download-page-btn-top {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  color: #e74c3c;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}
.download-page-btn-top:hover {
  background: #e74c3c;
  color: #fff;
}
.download-page-btn-top i {
  font-size: 12px;
}
.dl-split-btn {
  display: inline-flex;
  align-items: center;
  border-radius: 7px;
  overflow: hidden;
  border: 1.5px solid #e74c3c;
  background: #fff;
  box-shadow: 0 1px 5px rgba(231,76,60,0.10);
}
.dl-main-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 15px;
  background: transparent;
  border: none;
  color: #e74c3c;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
}
.dl-main-btn:hover {
  background: #e74c3c;
  color: #fff;
}
.dl-caret-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  padding: 0 8px;
  background: transparent;
  border: none;
  border-left: 1.5px solid #f9c5be;
  color: #e74c3c;
  cursor: pointer;
  height: 100%;
  min-height: 36px;
  transition: background 0.2s, color 0.2s;
}
.dl-caret-btn:hover {
  background: #e74c3c;
  color: #fff;
}
.dl-dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  min-width: 240px;
  z-index: 9999;
  overflow: hidden;
  padding: 6px;
}
.dl-dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}
.dl-dropdown-item:hover {
  background: #f9fafb;
}
.dl-dropdown-item i {
  font-size: 16px;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}
.dl-dropdown-item span {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.dl-dropdown-item strong {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}
.dl-dropdown-item small {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 400;
}
.dl-dropdown-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 4px 0;
}
.dl-fade-enter-active,
.dl-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dl-fade-enter-from,
.dl-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.sp-price-body .summary-full-content {
  display: block !important;
  border: none; padding: 0; margin: 0; background: transparent;
}
.sp-price-body .summary-full-content {
  padding: 0;
}
.summary-full-content .shipment-map-inner{
  padding-top: 5px;
}
.s5-tab-bar .service-tab-btn { font-size: 11px; }
</style>
