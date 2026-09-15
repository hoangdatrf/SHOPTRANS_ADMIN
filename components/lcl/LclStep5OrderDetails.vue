<template>
<div class="s5-root">
        <!-- ── STEP 5 Tab bar (only when >1 service) ── -->
        <div class="service-tabs-bar s5-tab-bar" v-if="step5TabList.length > 1">
          <!-- AT ORIGIN group -->
          <template v-if="step5TabList.filter(t => t.group === 'origin').length > 0">
            <div class="service-tabs-group">
              <div class="service-tabs-group-header">
                <div class="tabs-group-icon" style="background: linear-gradient(135deg, #fef3c7, #fed7aa);">🌍</div>
                <span class="tabs-group-title">AT ORIGIN</span>
              </div>
              <div class="service-tabs-group-items">
                <button
                  v-for="(tab, idx) in step5TabList.filter(t => t.group === 'origin')" :key="tab.id"
                  class="service-tab-btn"
                  :class="{ active: activeStep5Tab === tab.id }"
                  @click="activeStep5Tab = tab.id"
                >
                  <span class="service-tab-num">{{ idx + 1 }}</span>
                  <span class="service-tab-label">{{ tab.label }}</span>
                </button>
              </div>
            </div>
          </template>
          <!-- Divider origin/sea -->
          <div class="service-tabs-divider"
            v-if="step5TabList.filter(t => t.group === 'origin').length > 0 && step5TabList.filter(t => t.group === 'sea').length > 0"
          ></div>
          <!-- LCL FREIGHT group -->
          <template v-if="step5TabList.filter(t => t.group === 'sea').length > 0">
            <div class="service-tabs-group">
              <div class="service-tabs-group-header">
                <div class="tabs-group-icon" style="background: linear-gradient(135deg, #dbeafe, #bfdbfe);">🚢</div>
                <span class="tabs-group-title">LCL FREIGHT</span>
              </div>
              <div class="service-tabs-group-items">
                <button
                  v-for="(tab, idx) in step5TabList.filter(t => t.group === 'sea')" :key="tab.id"
                  class="service-tab-btn"
                  :class="{ active: activeStep5Tab === tab.id }"
                  @click="activeStep5Tab = tab.id"
                >
                  <span class="service-tab-num">{{ idx + 1 }}</span>
                  <span class="service-tab-label">{{ tab.label }}</span>
                </button>
              </div>
            </div>
          </template>
          <!-- Divider sea/dest -->
          <div class="service-tabs-divider"
            v-if="step5TabList.filter(t => t.group === 'sea').length > 0 && step5TabList.filter(t => t.group === 'dest').length > 0"
          ></div>
          <!-- AT DESTINATION group -->
          <template v-if="step5TabList.filter(t => t.group === 'dest').length > 0">
            <div class="service-tabs-group">
              <div class="service-tabs-group-header">
                <div class="tabs-group-icon" style="background: linear-gradient(135deg, #fef3c7, #fed7aa);">🌍</div>
                <span class="tabs-group-title">AT DESTINATION</span>
              </div>
              <div class="service-tabs-group-items">
                <button
                  v-for="(tab, idx) in step5TabList.filter(t => t.group === 'dest')" :key="tab.id"
                  class="service-tab-btn"
                  :class="{ active: activeStep5Tab === tab.id }"
                  @click="activeStep5Tab = tab.id"
                >
                  <span class="service-tab-num">{{ idx + 1 }}</span>
                  <span class="service-tab-label">{{ tab.label }}</span>
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- ══ Full EXW STEP 5 ══ -->
        <div v-show="activeStep5Tab === 's5-fullExw'" class="s5-page">

          <!-- Service badge -->
          <div class="s5-stag">
            <span class="s5-stag-icon">🚛</span>
            <div class="s5-stag-text">
              <span class="s5-stag-label">Full EXW service</span>
              <span class="s5-stag-desc">From shipper's warehouse to CFS warehouse (customs clearance included)</span>
            </div>
          </div>

          <!-- Main card -->
          <div class="s5-mc">

            <!-- ── SHIPPING BOOKING (only when Handle Under Available is selected) ── -->
            <template v-if="services.sea.selected.includes('handleUnderAvailable')">
            <div class="s5-sd">
              <div class="s5-si">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6-.5 1.2-1 2.5-1 2.5 0 2.5 2 5 2 1.3 0 1.9-.5 2.5-1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 1v4"/><path d="M12 9v3"/></svg>
              </div>
              <span class="s5-st">Shipping Booking</span>
            </div>
            <div class="s5-sb"><div class="s5-fg">

              <div class="s5-row-ship">
                <div class="s5-ff">
                  <span class="s5-fl">Coloader <span class="s5-rq">*</span></span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" :class="{ 's5-inv': step5Errors.has('shippingLine') }" v-model="exwBooking.shippingLine" @change="step5Errors.delete('shippingLine')">
                    <option value="">— Select —</option>
                    <option>ECU LINE</option>
                    <option>SHIPCO</option>
                    <option>AWS</option>
                    <option>CHARTER LINK</option>
                    <option>SGL</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Booking number <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('bookingNumber') }" v-model="exwBooking.bookingNumber" @input="step5Errors.delete('bookingNumber')" placeholder="Input booking number" maxlength="20" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Vessel name <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('vesselName') }" v-model="exwBooking.vesselName" @input="step5Errors.delete('vesselName')" placeholder="Input vessel name" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Vessel voyage <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('vesselVoyage') }" v-model="exwBooking.vesselVoyage" @input="step5Errors.delete('vesselVoyage')" placeholder="Input vessel voyage" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Est. departure <span class="s5-rq">*</span></span>
                  <div class="s5-date-wrap">
                    <EnDatePicker :min-date="minDate" v-model="exwBooking.estDepartureTime" input-class="s5-fi" :dynamic-input-class="{ 's5-inv': step5Errors.has('estDepartureTime') }" @change="step5Errors.delete('estDepartureTime')" />
                  </div>
                </div>
              </div>

            </div></div>
            </template><!-- end shipping booking block -->

            <!-- ── PICKUP ARRANGEMENT ── -->
            <div class="s5-sd">
              <div class="s5-si">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 12 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <span class="s5-st">Pickup Arrangement</span>
            </div>
            <div class="s5-sb"><div class="s5-fg">

              <!-- Same as shipper toggle -->
              <div class="s5-sar" :class="{ act: exwBooking.sameAsShipper }" @click="exwBooking.sameAsShipper = !exwBooking.sameAsShipper; if(exwBooking.sameAsShipper){ exwBooking.pickupCompany=shipperInfo.companyName; exwBooking.pickupAddress=shipperInfo.companyAddress; exwBooking.picName=shipperInfo.picName; exwBooking.picTitle=shipperInfo.picTitle; exwBooking.email=shipperInfo.email; exwBooking.phone=shipperInfo.phone } else { exwBooking.pickupCompany=''; exwBooking.pickupAddress=''; exwBooking.zipCode=''; exwBooking.picName=''; exwBooking.email=''; exwBooking.phone='' }">
                <span class="s5-sc"></span>
                <span class="s5-sal">SAME AS SHIPPER</span>
              </div>

              <div class="s5-ff">
                <span class="s5-fl">Pickup from company <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('pickupCompany'), 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.pickupCompany" :disabled="exwBooking.sameAsShipper" @input="step5Errors.delete('pickupCompany')" placeholder="Enter company name" />
              </div>

              <div class="s5-row-addr-zip">
                <div class="s5-ff">
                  <span class="s5-fl">Company address <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('pickupAddress'), 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.pickupAddress" :disabled="exwBooking.sameAsShipper" @input="step5Errors.delete('pickupAddress')" placeholder="Full pickup address including city, state, country" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Zip code <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('zipCode'), 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.zipCode" :disabled="exwBooking.sameAsShipper" @input="step5Errors.delete('zipCode')" placeholder="e.g. 700000" maxlength="10" />
                </div>
              </div>

              <div class="s5-row-pic">
                <div class="s5-ff">
                  <span class="s5-fl">Title</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" :class="{ 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.picTitle" :disabled="exwBooking.sameAsShipper">
                    <option>Mr.</option><option>Mrs.</option><option>Ms.</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">PIC name <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('picName'), 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.picName" :disabled="exwBooking.sameAsShipper" @input="step5Errors.delete('picName')" placeholder="Contact person in charge" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Email <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('picEmail'), 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.email" :disabled="exwBooking.sameAsShipper" @input="step5Errors.delete('picEmail')" placeholder="email@company.com" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Phone <span class="s5-rq">*</span></span>
                  <input type="tel" class="s5-fi" :class="{ 's5-inv': step5Errors.has('picPhone'), 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.phone" :disabled="exwBooking.sameAsShipper" @input="step5Errors.delete('picPhone')" placeholder="e.g. +84 28 1234 567" maxlength="18" />
                </div>
              </div>

              <div class="s5-row-date">
                <div class="s5-ff">
                  <span class="s5-fl">Pickup date <span class="s5-rq">*</span></span>
                  <div class="s5-date-wrap">
                    <EnDatePicker :min-date="minDate" v-model="exwBooking.pickupDate" input-class="s5-fi" :dynamic-input-class="{ 's5-inv': step5Errors.has('pickupDate') }" @change="step5Errors.delete('pickupDate')" />
                  </div>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Pickup time</span>
                  <div class="s5-date-wrap">
                    <EnTimePicker v-model="exwBooking.pickupTime" />
                  </div>
                </div>
              </div>

              <!-- Confirm no restriction -->
              <div class="s5-cr" :class="{ act: exwBooking.isRestricted }" @click="exwBooking.isRestricted = !exwBooking.isRestricted">
                <span class="s5-crc"></span>
                <span class="s5-crt">
                  Confirm the pickup location is not restricted
                  <span class="s5-tip-wrap">
                    <span class="s5-tip-i">i</span>
                    <span class="s5-tip-box">Please ensure the pickup address is not located on a road restricted to container trucks or heavy vehicles.</span>
                  </span>
                </span>
              </div>

            </div></div>

            <!-- ── CUSTOMS CLEARANCE ── -->
            <div class="s5-sd">
              <div class="s5-si">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <span class="s5-st">Customs Clearance</span>
            </div>
            <div class="s5-sb"><div class="s5-fg">

              <!-- 3 customs options -->
              <div class="s5-co">
                <div class="s5-cop" :class="{ sel: exwBooking.contactShipper && !exwBooking.providedAfterStuffing && !exwBooking.declareCustomsBasedOnDocs }" @click="exwBooking.contactShipper=true; exwBooking.providedAfterStuffing=false; exwBooking.declareCustomsBasedOnDocs=false">
                  <span class="s5-cop-num">1</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Contact shipper for documents</div>
                    <div class="s5-cop-hint">We will reach out to the shipper directly to collect the required customs documents</div>
                  </div>
                </div>
                <div class="s5-cop" :class="{ sel: exwBooking.providedAfterStuffing && !exwBooking.contactShipper && !exwBooking.declareCustomsBasedOnDocs }" @click="exwBooking.contactShipper=false; exwBooking.providedAfterStuffing=true; exwBooking.declareCustomsBasedOnDocs=false">
                  <span class="s5-cop-num">2</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Documents provided after cargo stuffing</div>
                    <div class="s5-cop-hint">Documents will be submitted once cargo loading is complete</div>
                  </div>
                  <div class="s5-cop-pb" v-if="exwBooking.providedAfterStuffing && !exwBooking.contactShipper && !exwBooking.declareCustomsBasedOnDocs">
                    <span>Provided by:</span>
                    <select class="s5-fi s5-fi-select custom-caret-svg" v-model="exwBooking.providedBy" @click.stop style="width:auto;padding:6px 32px 6px 10px;font-size:12px;">
                      <option>Shipper</option><option>Our company</option><option>Third party</option>
                    </select>
                  </div>
                </div>
                <div class="s5-cop" :class="{ sel: exwBooking.declareCustomsBasedOnDocs && !exwBooking.contactShipper && !exwBooking.providedAfterStuffing }" @click="exwBooking.contactShipper=false; exwBooking.providedAfterStuffing=false; exwBooking.declareCustomsBasedOnDocs=true">
                  <span class="s5-cop-num">3</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Declare customs based on uploaded documents</div>
                    <div class="s5-cop-hint">Upload your documents below for customs declaration processing</div>
                  </div>
                </div>
              </div>

              <!-- Expanded upload panel (only option 3) -->
              <div v-if="exwBooking.declareCustomsBasedOnDocs && !exwBooking.contactShipper && !exwBooking.providedAfterStuffing" class="s5-cex">

                <!-- Step ①: Doc allocation -->
                <div class="s5-upload-step">
                  <div class="s5-upload-step-num">①</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dal-label">Document Set Allocation</div>
                    <div class="s5-dal-chips">
                      <div class="s5-dal-chip" :class="{ act: exwBooking.docAllocation === 'same' }" @click="exwBooking.docAllocation = 'same'">
                        <span class="s5-dal-chip-r"></span>
                        <div>
                          <div class="s5-dal-chip-t">Single document set</div>
                          <div class="s5-dal-chip-h">One set covers the entire shipment</div>
                        </div>
                      </div>
                      <div class="s5-dal-chip" :class="{ act: exwBooking.docAllocation === 'multi' }" @click="exwBooking.docAllocation = 'multi'">
                        <span class="s5-dal-chip-r"></span>
                        <div>
                          <div class="s5-dal-chip-t">Multiple document sets</div>
                          <div class="s5-dal-chip-h">Shipment uses more than one document set</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step ②: Upload mode -->
                <div class="s5-upload-step">
                  <div class="s5-upload-step-num">②</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dal-label">Upload documents</div>
                    <div class="s5-ut">
                      <div class="s5-uo" :class="{ act: exwBooking.uploadType === 'compressed' }" @click="exwBooking.uploadType = 'compressed'">
                        <span class="s5-uor"></span>
                        <div class="s5-uo-body">
                          <span class="s5-uot">All in one compressed file</span>
                          <span class="s5-uoh">.rar, .zip, .7z</span>
                        </div>
                      </div>
                      <div class="s5-uo" :class="{ act: exwBooking.uploadType === 'separate' }" @click="exwBooking.uploadType = 'separate'">
                        <span class="s5-uor"></span>
                        <div class="s5-uo-body">
                          <span class="s5-uot">Upload each separately</span>
                          <span class="s5-uoh">PDF, XLSX, DOCX</span>
                        </div>
                      </div>
                    </div>

                    <!-- File upload zone — Compressed mode -->
                    <div v-if="exwBooking.uploadType === 'compressed'" class="s5-upload-zone">
                      <div v-for="(row, ri) in exwCompressedRows" :key="'exw-c-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerExwUpload('compressed', ri)">
                        <span class="s5-fri">📦</span>
                        <div class="s5-frn">
                          <div class="s5-frn-t">
                            <button class="s5-fre" @click.stop="startEditExwRowName('compressed', ri)" type="button">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <input type="text" :value="row.name" :readonly="exwEditingRow !== 'c-'+ri" :class="{ editing: exwEditingRow === 'c-'+ri }" @click.stop @blur="finishEditExwRowName('compressed', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                          </div>
                          <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                        </div>
                        <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                        <button v-if="!row.required" class="s5-frx" @click.stop="removeExwRow('compressed', ri)" type="button">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                        <input :ref="(el: any) => { if(el) exwFileInputRefs['c-'+ri] = el }" type="file" style="display:none" accept=".rar,.zip,.7z" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                      </div>
                      <button v-if="exwBooking.docAllocation !== 'same'" class="s5-afb" @click="addExwRow('compressed')" type="button">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add more
                      </button>
                    </div>

                    <!-- File upload zone — Separate mode -->
                    <div v-else class="s5-upload-zone">
                      <div v-for="(row, ri) in exwSeparateRows" :key="'exw-s-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerExwUpload('separate', ri)">
                        <span class="s5-fri">{{ row.icon || '📄' }}</span>
                        <div class="s5-frn">
                          <div class="s5-frn-t">
                            <button class="s5-fre" @click.stop="startEditExwRowName('separate', ri)" type="button">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <input type="text" :value="row.name" :readonly="exwEditingRow !== 's-'+ri" :class="{ editing: exwEditingRow === 's-'+ri }" @click.stop @blur="finishEditExwRowName('separate', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                          </div>
                          <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                        </div>
                        <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                        <button v-if="!row.required" class="s5-frx" @click.stop="removeExwRow('separate', ri)" type="button">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                        <input :ref="(el: any) => { if(el) exwFileInputRefs['s-'+ri] = el }" type="file" style="display:none" accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                      </div>
                      <button class="s5-afb" @click="addExwRow('separate')" type="button">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add more
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Step ③: Checklist -->
                <div class="s5-upload-step">
                  <div class="s5-upload-step-num">③</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dcl" :class="{ chk: exwBooking.ensureDocSet }" @click="exwBooking.ensureDocSet = !exwBooking.ensureDocSet">
                      <span class="s5-dcb"></span>
                      <span class="s5-dct">Make sure the document set includes <strong>Commercial Invoice</strong>, <strong>Packing List</strong>, <strong>Sales Contract</strong>, and <strong>Cargo Photos</strong>.</span>
                    </div>
                  </div>
                </div>

              </div><!-- end cex -->

            </div></div>

            <!-- ── REMARKS ── -->
            <div class="s5-sd">
              <div class="s5-si">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <span class="s5-st">Remarks (if any)</span>
            </div>
            <div class="s5-sb">
              <textarea class="s5-fta" v-model="exwBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea>
            </div>

          </div><!-- end s5-mc -->

          <!-- Bottom actions -->
          <div class="s5-ba">
            <button class="s5-btn" @click="goBackStep5Tab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <button class="s5-btn s5-btn-next" :disabled="exwBooking.declareCustomsBasedOnDocs && !exwBooking.ensureDocSet" @click="validateStep5">
              Continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

        </div><!-- end s5-page Full EXW -->

        <!-- ── Full FCA STEP 5 ── -->
        <div v-show="activeStep5Tab === 's5-fullFca'" class="s5-page">

        <!-- Service badge -->
        <div class="s5-stag">
          <span class="s5-stag-icon">📦</span>
          <div class="s5-stag-text">
            <span class="s5-stag-label">Full FCA service</span>
            <span class="s5-stag-desc">From shipper's warehouse to CFS warehouse (customs clearance excluded)</span>
          </div>
        </div>

        <!-- Main card -->
        <div class="s5-mc">

          <!-- ── SHIPPING BOOKING (only when Place Booking at Offered Rate IS also selected — KO DÙNG SHOPTRANS) ── -->
          <template v-if="services.sea.selected.includes('handleUnderAvailable')">
          <div class="s5-sd">
            <div class="s5-si">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6-.5 1.2-1 2.5-1 2.5 0 2.5 2 5 2 1.3 0 1.9-.5 2.5-1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 1v4"/><path d="M12 9v3"/></svg>
            </div>
            <span class="s5-st">Shipping Booking</span>
          </div>
          <div class="s5-sb"><div class="s5-fg">

            <div class="s5-row-ship">
              <div class="s5-ff">
                <span class="s5-fl">Coloader <span class="s5-rq">*</span></span>
                <select class="s5-fi s5-fi-select custom-caret-svg" :class="{ 's5-inv': step5Errors.has('fca.shippingLine') }" v-model="fcaBooking.shippingLine" @change="step5Errors.delete('fca.shippingLine')">
                  <option value="">— Select —</option>
                  <option>ECU LINE</option>
                  <option>SHIPCO</option>
                  <option>AWS</option>
                  <option>CHARTER LINK</option>
                  <option>SGL</option>
                </select>
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Booking number <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('fca.bookingNumber') }" v-model="fcaBooking.bookingNumber" @input="step5Errors.delete('fca.bookingNumber')" placeholder="Input booking number" maxlength="20" />
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Vessel name <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('fca.vesselName') }" v-model="fcaBooking.vesselName" @input="step5Errors.delete('fca.vesselName')" placeholder="Input vessel name" />
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Vessel voyage <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('fca.vesselVoyage') }" v-model="fcaBooking.vesselVoyage" @input="step5Errors.delete('fca.vesselVoyage')" placeholder="Input vessel voyage" />
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Est. departure <span class="s5-rq">*</span></span>
                <div class="s5-date-wrap">
                  <EnDatePicker :min-date="minDate" v-model="fcaBooking.estDepartureTime" input-class="s5-fi" :dynamic-input-class="{ 's5-inv': step5Errors.has('fca.estDepartureTime') }" @change="step5Errors.delete('fca.estDepartureTime')" />
                </div>
              </div>
            </div>

          </div></div>
          </template><!-- end shipping booking block -->

          <!-- ── PICKUP ARRANGEMENT ── -->
          <div class="s5-sd">
            <div class="s5-si">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 12 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <span class="s5-st">Pickup Arrangement</span>
          </div>
          <div class="s5-sb"><div class="s5-fg">

            <!-- Same as shipper toggle -->
            <div class="s5-sar" :class="{ act: fcaBooking.sameAsShipper }" @click="fcaBooking.sameAsShipper = !fcaBooking.sameAsShipper; if(fcaBooking.sameAsShipper){ fcaBooking.pickupCompany=shipperInfo.companyName; fcaBooking.pickupAddress=shipperInfo.companyAddress; fcaBooking.picName=shipperInfo.picName; fcaBooking.picTitle=shipperInfo.picTitle; fcaBooking.email=shipperInfo.email; fcaBooking.phone=shipperInfo.phone } else { fcaBooking.pickupCompany=''; fcaBooking.pickupAddress='';fcaBooking.zipCode='';fcaBooking.picName='';fcaBooking.email='';fcaBooking.phone='' }">
              <span class="s5-sc"></span>
              <span class="s5-sal">SAME AS SHIPPER</span>
            </div>

            <div class="s5-ff">
              <span class="s5-fl">Pickup from company <span class="s5-rq">*</span></span>
              <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('fca.pickupCompany'), 's5-disabled': fcaBooking.sameAsShipper }" v-model="fcaBooking.pickupCompany" :disabled="fcaBooking.sameAsShipper" @input="step5Errors.delete('fca.pickupCompany')" placeholder="Enter company name" />
            </div>

            <div class="s5-row-addr-zip">
              <div class="s5-ff">
                <span class="s5-fl">Company address <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('fca.pickupAddress'), 's5-disabled': fcaBooking.sameAsShipper }" v-model="fcaBooking.pickupAddress" :disabled="fcaBooking.sameAsShipper" @input="step5Errors.delete('fca.pickupAddress')" placeholder="Full pickup address including city, state, country" />
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Zip code <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('fca.zipCode'), 's5-disabled': fcaBooking.sameAsShipper }" v-model="fcaBooking.zipCode" :disabled="fcaBooking.sameAsShipper" @input="step5Errors.delete('fca.zipCode')" placeholder="e.g. 700000" maxlength="10" />
              </div>
            </div>

            <div class="s5-row-pic">
              <div class="s5-ff">
                <span class="s5-fl">Title</span>
                <select class="s5-fi s5-fi-select custom-caret-svg" :class="{ 's5-disabled': fcaBooking.sameAsShipper }" v-model="fcaBooking.picTitle" :disabled="fcaBooking.sameAsShipper">
                  <option>Mr.</option><option>Mrs.</option><option>Ms.</option>
                </select>
              </div>
              <div class="s5-ff">
                <span class="s5-fl">PIC name <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('fca.picName'), 's5-disabled': fcaBooking.sameAsShipper }" v-model="fcaBooking.picName" :disabled="fcaBooking.sameAsShipper" @input="step5Errors.delete('fca.picName')" placeholder="Contact person in charge" />
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Email <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('fca.picEmail'), 's5-disabled': fcaBooking.sameAsShipper }" v-model="fcaBooking.email" :disabled="fcaBooking.sameAsShipper" @input="step5Errors.delete('fca.picEmail')" placeholder="email@company.com" />
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Phone <span class="s5-rq">*</span></span>
                <input type="tel" class="s5-fi" :class="{ 's5-inv': step5Errors.has('fca.picPhone'), 's5-disabled': fcaBooking.sameAsShipper }" v-model="fcaBooking.phone" :disabled="fcaBooking.sameAsShipper" @input="step5Errors.delete('fca.picPhone')" placeholder="e.g. +84 28 1234 567" maxlength="18" />
              </div>
            </div>

            <div class="s5-row-date">
              <div class="s5-ff">
                <span class="s5-fl">Pickup date <span class="s5-rq">*</span></span>
                <div class="s5-date-wrap">
                  <EnDatePicker :min-date="minDate" v-model="fcaBooking.pickupDate" input-class="s5-fi" :dynamic-input-class="{ 's5-inv': step5Errors.has('fca.pickupDate') }" @change="step5Errors.delete('fca.pickupDate')" />
                </div>
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Pickup time</span>
                <div class="s5-date-wrap">
                  <EnTimePicker v-model="fcaBooking.pickupTime" />
                </div>
              </div>
            </div>

            <!-- Confirm no restriction -->
            <div class="s5-cr" :class="{ act: fcaBooking.isRestricted }" @click="fcaBooking.isRestricted = !fcaBooking.isRestricted">
              <span class="s5-crc"></span>
              <span class="s5-crt">
                Confirm the pickup location is not restricted
                <span class="s5-tip-wrap">
                  <span class="s5-tip-i">i</span>
                  <span class="s5-tip-box">Please ensure the pickup address is not located on a road restricted to container trucks or heavy vehicles.</span>
                </span>
              </span>
            </div>

          </div></div>



          <!-- ── REMARKS ── -->
          <div class="s5-sd">
            <div class="s5-si">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span class="s5-st">Remarks (if any)</span>
          </div>
          <div class="s5-sb">
            <textarea class="s5-fta" v-model="fcaBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea>
          </div>

        </div><!-- end s5-mc -->

        <!-- Bottom actions -->
        <div class="s5-ba">
          <button class="s5-btn" @click="goBackStep5Tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </button>
          <button class="s5-btn s5-btn-next" @click="validateStep5">
            Continue
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

        </div><!-- end s5-page Full FCA -->

        <!-- ══ Customs Clearance Only (AT ORIGIN) STEP 5 ══ -->
        <div v-show="activeStep5Tab === 's5-customsOnly'" class="s5-page">

          <!-- Service badge -->
          <div class="s5-stag">
            <span class="s5-stag-icon">📋</span>
            <div class="s5-stag-text">
              <span class="s5-stag-label">Customs clearance service only</span>
            </div>
          </div>

          <!-- ── SHIPPING BOOKING (only when Place Booking at Offered Rate IS also selected — KO DÙNG SHOPTRANS) ── -->
          <template v-if="services.sea.selected.includes('handleUnderAvailable')">
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd">
              <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4a11.6 11.6 0 0 0 1.62 6"/><path d="M12 10V2"/><path d="M12 2 9 6"/><path d="M12 2l3 4"/></svg></div>
              <span class="s5-st">Shipping Booking</span>
            </div>
            <div class="s5-sb"><div class="s5-fg">
              <div class="s5-row-ship">
                <div class="s5-ff">
                  <span class="s5-fl">Coloader <span class="s5-rq">*</span></span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" :class="{ 's5-inv': step5Errors.has('customs.shippingLine') }" v-model="customsBooking.shippingLine" @change="step5Errors.delete('customs.shippingLine')">
                    <option value="">— Select —</option>
                    <option>ECU LINE</option>
                    <option>SHIPCO</option>
                    <option>AWS</option>
                    <option>CHARTER LINK</option>
                    <option>SGL</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Booking number <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('customs.bookingNumber') }" v-model="customsBooking.bookingNumber" @input="step5Errors.delete('customs.bookingNumber')" placeholder="Input booking number" maxlength="20" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Vessel name <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('customs.vesselName') }" v-model="customsBooking.vesselName" @input="step5Errors.delete('customs.vesselName')" placeholder="Input vessel name" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Vessel voyage <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('customs.vesselVoyage') }" v-model="customsBooking.vesselVoyage" @input="step5Errors.delete('customs.vesselVoyage')" placeholder="Input vessel voyage" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Est. departure <span class="s5-rq">*</span></span>
                  <div class="s5-date-wrap">
                    <EnDatePicker :min-date="minDate" v-model="customsBooking.estDepartureTime" input-class="s5-fi" :dynamic-input-class="{ 's5-inv': step5Errors.has('customs.estDepartureTime') }" @change="step5Errors.delete('customs.estDepartureTime')" />
                  </div>
                </div>
              </div>
            </div></div>
          </div>
          </template>

          <!-- ── CUSTOMS CLEARANCE ── -->
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                <span class="s5-st">Customs Clearance</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">

              <!-- 3 customs options -->
              <div class="s5-co">
                <div class="s5-cop" :class="{ sel: customsBooking.contactShipper && !customsBooking.providedAfterStuffing && !customsBooking.declareCustomsBasedOnDocs }" @click="customsBooking.contactShipper=true; customsBooking.providedAfterStuffing=false; customsBooking.declareCustomsBasedOnDocs=false">
                  <span class="s5-cop-num">1</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Contact shipper for documents</div>
                    <div class="s5-cop-hint">We will reach out to the shipper directly to collect the required customs documents</div>
                  </div>
                </div>
                <div class="s5-cop" :class="{ sel: customsBooking.providedAfterStuffing && !customsBooking.contactShipper && !customsBooking.declareCustomsBasedOnDocs }" @click="customsBooking.contactShipper=false; customsBooking.providedAfterStuffing=true; customsBooking.declareCustomsBasedOnDocs=false">
                  <span class="s5-cop-num">2</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Documents provided after cargo stuffing</div>
                    <div class="s5-cop-hint">Documents will be submitted once cargo loading is complete</div>
                  </div>
                  <div class="s5-cop-pb" v-if="customsBooking.providedAfterStuffing && !customsBooking.contactShipper && !customsBooking.declareCustomsBasedOnDocs">
                    <span>Provided by:</span>
                    <select class="s5-fi s5-fi-select custom-caret-svg" v-model="customsBooking.providedBy" @click.stop style="width:auto;padding:6px 32px 6px 10px;font-size:12px;">
                      <option>Shipper</option><option>Our company</option><option>Third party</option>
                    </select>
                  </div>
                </div>
                <div class="s5-cop" :class="{ sel: customsBooking.declareCustomsBasedOnDocs && !customsBooking.contactShipper && !customsBooking.providedAfterStuffing }" @click="customsBooking.contactShipper=false; customsBooking.providedAfterStuffing=false; customsBooking.declareCustomsBasedOnDocs=true">
                  <span class="s5-cop-num">3</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Declare customs based on uploaded documents</div>
                    <div class="s5-cop-hint">Upload your documents below for customs declaration processing</div>
                  </div>
                </div>
              </div>

              <!-- Expanded upload panel (only option 3) -->
              <div v-if="customsBooking.declareCustomsBasedOnDocs && !customsBooking.contactShipper && !customsBooking.providedAfterStuffing" class="s5-cex">

                <!-- Step ①: Doc allocation -->
                <div class="s5-upload-step">
                  <div class="s5-upload-step-num">①</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dal-label">Document Set Allocation</div>
                    <div class="s5-dal-chips">
                      <div class="s5-dal-chip" :class="{ act: customsBooking.docAllocation === 'same' }" @click="customsBooking.docAllocation = 'same'">
                        <span class="s5-dal-chip-r"></span>
                        <div>
                          <div class="s5-dal-chip-t">Single document set</div>
                          <div class="s5-dal-chip-h">One set covers the entire shipment</div>
                        </div>
                      </div>
                      <div class="s5-dal-chip" :class="{ act: customsBooking.docAllocation === 'multi' }" @click="customsBooking.docAllocation = 'multi'">
                        <span class="s5-dal-chip-r"></span>
                        <div>
                          <div class="s5-dal-chip-t">Multiple document sets</div>
                          <div class="s5-dal-chip-h">Shipment uses more than one document set</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step ②: Upload mode -->
                <div class="s5-upload-step">
                  <div class="s5-upload-step-num">②</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dal-label">Upload documents</div>
                    <div class="s5-ut">
                      <div class="s5-uo" :class="{ act: customsBooking.uploadType === 'compressed' }" @click="customsBooking.uploadType = 'compressed'">
                        <span class="s5-uor"></span>
                        <div class="s5-uo-body">
                          <span class="s5-uot">All in one compressed file</span>
                          <span class="s5-uoh">.rar, .zip, .7z</span>
                        </div>
                      </div>
                      <div class="s5-uo" :class="{ act: customsBooking.uploadType === 'separate' }" @click="customsBooking.uploadType = 'separate'">
                        <span class="s5-uor"></span>
                        <div class="s5-uo-body">
                          <span class="s5-uot">Upload each separately</span>
                          <span class="s5-uoh">PDF, XLSX, DOCX</span>
                        </div>
                      </div>
                    </div>

                    <!-- File upload zone — Compressed mode -->
                    <div v-if="customsBooking.uploadType === 'compressed'" class="s5-upload-zone">
                      <div v-for="(row, ri) in coCompressedRows" :key="'co-c-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerCoUpload('compressed', ri)">
                        <span class="s5-fri">📦</span>
                        <div class="s5-frn">
                          <div class="s5-frn-t">
                            <button class="s5-fre" @click.stop="startEditCoRowName('compressed', ri)" type="button">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <input type="text" :value="row.name" :readonly="coEditingRow !== 'c-'+ri" :class="{ editing: coEditingRow === 'c-'+ri }" @click.stop @blur="finishEditCoRowName('compressed', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                          </div>
                          <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                        </div>
                        <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                        <button v-if="!row.required" class="s5-frx" @click.stop="removeCoRow('compressed', ri)" type="button">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                        <input :ref="(el: any) => { if(el) coFileInputRefs['c-'+ri] = el }" type="file" style="display:none" accept=".rar,.zip,.7z" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                      </div>
                      <button v-if="customsBooking.docAllocation !== 'same'" class="s5-afb" @click="addCoRow('compressed')" type="button">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add more
                      </button>
                    </div>

                    <!-- File upload zone — Separate mode -->
                    <div v-else class="s5-upload-zone">
                      <div v-for="(row, ri) in coSeparateRows" :key="'co-s-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerCoUpload('separate', ri)">
                        <span class="s5-fri">{{ row.icon || '📄' }}</span>
                        <div class="s5-frn">
                          <div class="s5-frn-t">
                            <button class="s5-fre" @click.stop="startEditCoRowName('separate', ri)" type="button">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <input type="text" :value="row.name" :readonly="coEditingRow !== 's-'+ri" :class="{ editing: coEditingRow === 's-'+ri }" @click.stop @blur="finishEditCoRowName('separate', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                          </div>
                          <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                        </div>
                        <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                        <button v-if="!row.required" class="s5-frx" @click.stop="removeCoRow('separate', ri)" type="button">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                        <input :ref="(el: any) => { if(el) coFileInputRefs['s-'+ri] = el }" type="file" style="display:none" accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                      </div>
                      <button class="s5-afb" @click="addCoRow('separate')" type="button">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add more
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Step ③: Checklist -->
                <div class="s5-upload-step">
                  <div class="s5-upload-step-num">③</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dcl" :class="{ chk: customsBooking.ensureDocSet }" @click="customsBooking.ensureDocSet = !customsBooking.ensureDocSet">
                      <span class="s5-dcb"></span>
                      <span class="s5-dct">Make sure the document set includes <strong>Commercial Invoice</strong>, <strong>Packing List</strong>, <strong>Sales Contract</strong>, and <strong>Cargo Photos</strong>.</span>
                    </div>
                  </div>
                </div>

              </div><!-- end cex -->

            </div></div>
          </div>

          <!-- ── REMARKS ── -->
          <div class="s5-mc">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <span class="s5-st">Remarks (if any)</span>
              </div>
            </div>
            <div class="s5-sb"><textarea class="s5-fta" v-model="customsBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
          </div>

          <!-- Bottom actions -->
          <div class="s5-ba">
            <button class="s5-btn" @click="goBackStep5Tab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <button class="s5-btn s5-btn-next" :disabled="customsBooking.declareCustomsBasedOnDocs && !customsBooking.ensureDocSet" @click="validateStep5">
              Continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

        </div><!-- end s5-page Customs Only (origin) -->

        <!-- ── Collect/Pay STEP 5 ── -->
        <div v-show="activeStep5Tab === 's5-collectPay'" class="s5-page">

        <!-- Service badge -->
        <div class="s5-stag">
          <span class="s5-stag-icon">💰</span>
          <div class="s5-stag-text">
            <span class="s5-stag-label">Collect/pay charges as nominated</span>
          </div>
        </div>

        <!-- ── COLLECTION (GREEN) ── -->
        <div class="s5-mc s5-mc-col">
          <div class="s5-sd s5-sd-flex">
            <div class="s5-sd-left">
              <div class="s5-si">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              </div>
              <span class="s5-st">Collect/Receipt charges</span>
            </div>
            <span class="s5-cp-badge s5-cp-badge-green">COLLECTION</span>
          </div>
          <div class="s5-sb">
            <div class="s5-cp-tab-label">How to submit charges:</div>
            <div class="s5-cp-tabs">
              <button class="s5-cp-tab" :class="{ 'act-green': collectPayBooking.collectionSubmitType === 'UPLOAD' }" @click="collectPayBooking.collectionSubmitType = 'UPLOAD'">Upload Debit Note</button>
              <button class="s5-cp-tab" :class="{ 'act-green': collectPayBooking.collectionSubmitType === 'MANUAL' }" @click="collectPayBooking.collectionSubmitType = 'MANUAL'">Input Fees Manually</button>
              <button class="s5-cp-tab" :class="{ 'act-green': collectPayBooking.collectionSubmitType === 'LATER' }" @click="collectPayBooking.collectionSubmitType = 'LATER'">Submit Later</button>
            </div>

            <!-- Upload Debit Note -->
            <div v-if="collectPayBooking.collectionSubmitType === 'UPLOAD'" class="s5-cp-upload-box">
              <div class="s5-cp-upload-label">Upload Debit Note:</div>
              <div class="s5-cp-upload-hint">(support: PDF, XLSX, DOCX, ...)</div>
              <div v-for="(row, ri) in cpColFileRows" :key="'cpf-c-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerCpFileUpload('col', ri)">
                <span class="s5-fri">📎</span>
                <div class="s5-frn">
                  <div class="s5-frn-t">
                    <button class="s5-fre" @click.stop="startEditCpFileName('col', ri)" type="button">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                    </button>
                    <input type="text" :value="row.name" :readonly="cpEditingFile !== 'col-'+ri" :class="{ editing: cpEditingFile === 'col-'+ri }" @click.stop @blur="finishEditCpFileName('col', ri)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                  </div>
                  <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                </div>
                <span class="s5-frt s5-frt-op">Optional</span>
                <button class="s5-frx" @click.stop="cpColFileRows.splice(ri,1)" type="button">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <input :ref="(el: any) => { if(el) cpFileInputRefs['col-'+ri] = el }" type="file" style="display:none" accept=".rar,.zip,.7z,.pdf,.xlsx,.xls,.docx,.doc" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
              </div>
              <button class="s5-afb" @click="addCpFileRow('col')" type="button">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add file
              </button>
            </div>

            <!-- Input Fees Manually -->
            <div v-if="collectPayBooking.collectionSubmitType === 'MANUAL'" class="s5-cp-fee-wrap">
              <div class="s5-cp-fee-actions">
                <button class="s5-cp-fee-btn s5-cp-fee-add" @click="collectPayBooking.collectionFees.push({ chargeName:'Ocean Freight', unit:'CNT', quantity:'', unitPrice:'', currency:'USD', total:'', receiveFrom:'Shipper' })">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> ADD
                </button>
              </div>
              <div class="s5-cp-table-wrap">
                <table class="s5-cp-table">
                  <thead><tr>
                    <th><div class="s5-cp-th-inner">Charge name <span class="s5-cp-manage-link" @click="openCpManage('chargeName')">Manage</span></div></th>
                    <th><div class="s5-cp-th-inner">Unit <span class="s5-cp-manage-link" @click="openCpManage('unit')">Manage</span></div></th>
                    <th>Quantity</th>
                    <th>Unit price</th><th>Currency</th><th>Total</th>
                    <th>Receive from</th><th></th>
                  </tr></thead>
                  <tbody>
                    <tr v-for="(row, i) in collectPayBooking.collectionFees" :key="i">
                      <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.chargeName"><option v-for="cn in cpChargeNameOpts" :key="cn" :value="cn">{{ cn }}</option></select></td>
                      <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.unit"><option v-for="u in cpUnitOpts" :key="u" :value="u">{{ u }}</option></select></td>
                      <td><input type="number" class="s5-cp-tc" v-model="row.quantity" placeholder="1" min="0.01" step="any" /></td>
                      <td><input type="number" class="s5-cp-tc" v-model="row.unitPrice" placeholder="0.00" min="0" step="0.01" /></td>
                      <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.currency"><option>USD</option><option>EUR</option><option>VND</option><option>CNY</option><option>JPY</option><option>GBP</option></select></td>
                      <td><div class="s5-cp-tc-total">{{ row.quantity && row.unitPrice ? (parseFloat(row.quantity)*parseFloat(row.unitPrice)).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+row.currency : '—' }}</div></td>
                      <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.receiveFrom"><option>Shipper</option><option>3rd Party</option></select></td>
                      <td><button class="s5-cp-row-del" @click="collectPayBooking.collectionFees.splice(i,1)">×</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Submit Later -->
            <div v-if="collectPayBooking.collectionSubmitType === 'LATER'" class="s5-cp-later-note">
              <span style="font-size:20px;flex-shrink:0">🕐</span>
              <div class="s5-cp-later-text">You can submit the charges later. The order will be saved and you can return to complete the charge information at any time.</div>
            </div>

            <!-- Payment party (PIC) — hidden when Submit Later -->
            <div v-if="collectPayBooking.collectionSubmitType !== 'LATER'" class="s5-cp-pic-section s5-cp-pic-green">
              <div class="s5-cp-pic-label">Payment party (PIC):</div>
              <div v-for="(pic, pi) in cpColPics" :key="'cpic-c-'+pi" class="s5-cp-pic-row" :style="pi > 0 ? 'margin-top:8px' : ''">
                <div class="s5-cp-pic-field">
                  <label class="s5-cp-pic-fl">Title</label>
                  <select class="s5-cp-pic-fi custom-caret-svg" v-model="pic.title"><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Dr.</option></select>
                </div>
                <div class="s5-cp-pic-field">
                  <label class="s5-cp-pic-fl">PIC name</label>
                  <input class="s5-cp-pic-fi" type="text" v-model="pic.name" placeholder="Input PIC name" />
                </div>
                <div class="s5-cp-pic-field">
                  <label class="s5-cp-pic-fl">Email</label>
                  <input class="s5-cp-pic-fi" type="text" v-model="pic.email" placeholder="Input Email address" />
                </div>
                <div class="s5-cp-pic-field">
                  <label class="s5-cp-pic-fl">Phone</label>
                  <input class="s5-cp-pic-fi" type="text" v-model="pic.phone" placeholder="Input phone number" />
                </div>
                <div class="s5-cp-pic-field s5-cp-pic-btn-cell">
                  <button v-if="pi === 0" class="s5-cp-pic-add-btn" @click="cpColPics.push({ title:'Mr.', name:'', email:'', phone:'' })" type="button">+</button>
                  <button v-else class="s5-cp-pic-rem-btn" @click="cpColPics.splice(pi,1)" type="button">×</button>
                </div>
              </div>
            </div>
          </div>
        </div><!-- end collection card -->

        <!-- ── PAYMENT (RED) ── -->
        <div class="s5-mc s5-mc-pay">
          <div class="s5-sd-red">
            <div class="s5-sd-left">
              <div class="s5-si-red">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
              </div>
              <span class="s5-st-red">Pay/Disburse charges</span>
            </div>
            <span class="s5-cp-badge s5-cp-badge-red">PAYMENT</span>
          </div>
          <div class="s5-sb">
            <div class="s5-cp-tab-label">How to submit charges:</div>
            <div class="s5-cp-tabs">
              <button class="s5-cp-tab" :class="{ 'act-red': collectPayBooking.paymentSubmitType === 'UPLOAD' }" @click="collectPayBooking.paymentSubmitType = 'UPLOAD'">Upload Credit Note</button>
              <button class="s5-cp-tab" :class="{ 'act-red': collectPayBooking.paymentSubmitType === 'MANUAL' }" @click="collectPayBooking.paymentSubmitType = 'MANUAL'">Input Fees Manually</button>
              <button class="s5-cp-tab" :class="{ 'act-red': collectPayBooking.paymentSubmitType === 'LATER' }" @click="collectPayBooking.paymentSubmitType = 'LATER'">Submit Later</button>
            </div>

            <!-- Upload Credit Note -->
            <div v-if="collectPayBooking.paymentSubmitType === 'UPLOAD'" class="s5-cp-upload-box s5-cp-upload-red">
              <div class="s5-cp-upload-label">Upload Credit Note:</div>
              <div class="s5-cp-upload-hint">(support: PDF, XLSX, DOCX, ...)</div>
              <div v-for="(row, ri) in cpPayFileRows" :key="'cpf-p-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerCpFileUpload('pay', ri)">
                <span class="s5-fri">📎</span>
                <div class="s5-frn">
                  <div class="s5-frn-t">
                    <button class="s5-fre" @click.stop="startEditCpFileName('pay', ri)" type="button">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                    </button>
                    <input type="text" :value="row.name" :readonly="cpEditingFile !== 'pay-'+ri" :class="{ editing: cpEditingFile === 'pay-'+ri }" @click.stop @blur="finishEditCpFileName('pay', ri)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                  </div>
                  <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                </div>
                <span class="s5-frt s5-frt-op">Optional</span>
                <button class="s5-frx" @click.stop="cpPayFileRows.splice(ri,1)" type="button">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <input :ref="(el: any) => { if(el) cpFileInputRefs['pay-'+ri] = el }" type="file" style="display:none" accept=".rar,.zip,.7z,.pdf,.xlsx,.xls,.docx,.doc" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
              </div>
              <button class="s5-afb s5-afb-red" @click="addCpFileRow('pay')" type="button">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add file
              </button>
            </div>

            <!-- Input Fees Manually -->
            <div v-if="collectPayBooking.paymentSubmitType === 'MANUAL'" class="s5-cp-fee-wrap">
              <div class="s5-cp-fee-actions">
                <button class="s5-cp-fee-btn s5-cp-fee-add" @click="collectPayBooking.paymentFees.push({ chargeName:'Ocean Freight', unit:'CNT', quantity:'', unitPrice:'', currency:'USD', total:'', payTo:'Shipper' })">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> ADD
                </button>
              </div>
              <div class="s5-cp-table-wrap">
                <table class="s5-cp-table">
                  <thead><tr>
                    <th><div class="s5-cp-th-inner">Charge name <span class="s5-cp-manage-link" @click="openCpManage('chargeName')">Manage</span></div></th>
                    <th><div class="s5-cp-th-inner">Unit <span class="s5-cp-manage-link" @click="openCpManage('unit')">Manage</span></div></th>
                    <th>Quantity</th>
                    <th>Unit price</th><th>Currency</th><th>Total</th>
                    <th>Pay to</th><th></th>
                  </tr></thead>
                  <tbody>
                    <tr v-for="(row, i) in collectPayBooking.paymentFees" :key="i">
                      <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.chargeName"><option v-for="cn in cpChargeNameOpts" :key="cn" :value="cn">{{ cn }}</option></select></td>
                      <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.unit"><option v-for="u in cpUnitOpts" :key="u" :value="u">{{ u }}</option></select></td>
                      <td><input type="number" class="s5-cp-tc" v-model="row.quantity" placeholder="1" min="0.01" step="any" /></td>
                      <td><input type="number" class="s5-cp-tc" v-model="row.unitPrice" placeholder="0.00" min="0" step="0.01" /></td>
                      <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.currency"><option>USD</option><option>EUR</option><option>VND</option><option>CNY</option><option>JPY</option><option>GBP</option></select></td>
                      <td><div class="s5-cp-tc-total">{{ row.quantity && row.unitPrice ? (parseFloat(row.quantity)*parseFloat(row.unitPrice)).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+row.currency : '—' }}</div></td>
                      <td>
                        <span v-if="['Customs Fee','Inspection Fee','Fumigation Fee'].includes(row.chargeName)" class="s5-cp-locked">🔒 3rd Party</span>
                        <select v-else class="s5-cp-tc-sel custom-caret-svg" v-model="row.payTo"><option>Shipper</option><option>3rd Party</option></select>
                      </td>
                      <td><button class="s5-cp-row-del" @click="collectPayBooking.paymentFees.splice(i,1)">×</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Submit Later -->
            <div v-if="collectPayBooking.paymentSubmitType === 'LATER'" class="s5-cp-later-note">
              <span style="font-size:20px;flex-shrink:0">🕐</span>
              <div class="s5-cp-later-text">You can submit the charges later. The order will be saved and you can return to complete the charge information at any time.</div>
            </div>

            <!-- Collection party (PIC) — hidden when Submit Later -->
            <div v-if="collectPayBooking.paymentSubmitType !== 'LATER'" class="s5-cp-pic-section s5-cp-pic-red">
              <div class="s5-cp-pic-label">Collection party (PIC):</div>
              <div v-for="(pic, pi) in cpPayPics" :key="'cpic-p-'+pi" class="s5-cp-pic-row" :style="pi > 0 ? 'margin-top:8px' : ''">
                <div class="s5-cp-pic-field">
                  <label class="s5-cp-pic-fl">Title</label>
                  <select class="s5-cp-pic-fi custom-caret-svg" v-model="pic.title"><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Dr.</option></select>
                </div>
                <div class="s5-cp-pic-field">
                  <label class="s5-cp-pic-fl">PIC name</label>
                  <input class="s5-cp-pic-fi" type="text" v-model="pic.name" placeholder="Input PIC name" />
                </div>
                <div class="s5-cp-pic-field">
                  <label class="s5-cp-pic-fl">Email</label>
                  <input class="s5-cp-pic-fi" type="text" v-model="pic.email" placeholder="Input Email address" />
                </div>
                <div class="s5-cp-pic-field">
                  <label class="s5-cp-pic-fl">Phone</label>
                  <input class="s5-cp-pic-fi" type="text" v-model="pic.phone" placeholder="Input phone number" />
                </div>
                <div class="s5-cp-pic-field s5-cp-pic-btn-cell">
                  <button v-if="pi === 0" class="s5-cp-pic-add-btn" @click="cpPayPics.push({ title:'Mr.', name:'', email:'', phone:'' })" type="button">+</button>
                  <button v-else class="s5-cp-pic-rem-btn" @click="cpPayPics.splice(pi,1)" type="button">×</button>
                </div>
              </div>
            </div>
          </div>
        </div><!-- end payment card -->

        <!-- ── REMARKS ── -->
        <div class="s5-mc">
          <div class="s5-sd s5-sd-flex">
            <div class="s5-sd-left">
              <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <span class="s5-st">Remarks (if any)</span>
            </div>
          </div>
          <div class="s5-sb"><textarea class="s5-fta" v-model="collectPayBooking.collectPayRemarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
        </div>

        <!-- Bottom actions -->
        <div class="s5-ba">
          <button class="s5-btn" @click="goBackStep5Tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </button>
          <button class="s5-btn s5-btn-next" @click="validateStep5">
            Continue
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

        <!-- ── Manage Options Modal ── -->
        <Teleport to="body">
          <div v-if="cpManageShow" class="s5-cp-modal-overlay" @click.self="cpManageShow = false">
            <div class="s5-cp-modal">
              <div class="s5-cp-modal-title">{{ cpManageKey === 'chargeName' ? 'Manage Charge Names' : 'Manage Units' }}</div>
              <div class="s5-cp-opt-list">
                <div v-for="(opt, oi) in cpManageList" :key="oi" class="s5-cp-opt-item">
                  <input type="text" v-model="cpManageList[oi]" />
                  <button class="s5-cp-opt-del" @click="cpManageList.splice(oi, 1)" type="button">×</button>
                </div>
              </div>
              <button class="s5-cp-opt-add-btn" @click="cpManageList.push('New option')" type="button">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add option
              </button>
              <div class="s5-cp-modal-footer">
                <button class="s5-cp-modal-btn" @click="cpManageShow = false" type="button">Cancel</button>
                <button class="s5-cp-modal-btn s5-cp-modal-btn-ok" @click="saveCpManage" type="button">Save</button>
              </div>
            </div>
          </div>
        </Teleport>

        </div><!-- end s5-page Collect/Pay -->

        <!-- ── Buy Cargo Insurance STEP 5 ── -->
        <div v-show="activeStep5Tab === 's5-insurance'" class="s5-page">

        <!-- Service badge -->
        <div class="s5-stag">
          <span class="s5-stag-icon">🛡️</span>
          <div class="s5-stag-text">
            <span class="s5-stag-label">Buy cargo insurance</span>
          </div>
        </div>

        <!-- Main card -->
        <div class="s5-mc">

          <!-- Section 1: Document Submission Tabs -->
          <div class="s5-ins-section">
            <div class="s5-ins-section-label">Document submission</div>
            <div class="s5-cp-tabs" style="margin-bottom:0">
              <button class="s5-cp-tab" :class="{ 'act-green': insuranceBooking.submitType === 'NOW' }" @click="insuranceBooking.submitType = 'NOW'">Submit Now</button>
              <button class="s5-cp-tab" :class="{ 'act-green': insuranceBooking.submitType === 'LATER' }" @click="insuranceBooking.submitType = 'LATER'">Submit Later</button>
            </div>
          </div>

          <!-- Section 2: Submit Now content -->
          <template v-if="insuranceBooking.submitType === 'NOW'">

            <!-- Application Form -->
            <div class="s5-ins-section">
              <div class="s5-ins-section-label">Application Form</div>
              <div class="s5-ins-row">
                <span class="s5-ins-dl-label">Download Application Form:</span>
                <button class="s5-ins-dl-btn" @click="downloadInsuranceForm">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download
                </button>
              </div>
            </div>

            <!-- Documents to use -->
            <div class="s5-ins-section">
              <div class="s5-ins-section-label">Documents to use:</div>

              <div class="s5-ins-doc-modes">
                <!-- Mode A: Compressed -->
                <div class="s5-ins-doc-mode" :class="{ active: insuranceBooking.uploadType === 'compressed' }" @click="insuranceBooking.uploadType = 'compressed'">
                  <div class="s5-ins-doc-mode-header">
                    <span class="s5-ins-doc-radio" :class="{ act: insuranceBooking.uploadType === 'compressed' }"></span>
                    <div>
                      <div class="s5-ins-doc-mode-title">Upload all documents in one compressed file</div>
                      <div class="s5-ins-doc-mode-hint">(support: .rar, .zip, .7z):</div>
                    </div>
                  </div>
                  <div class="s5-ins-choose-row">
                    <label class="s5-ins-choose-zone" @click.stop>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Choose File
                      <input type="file" style="display:none" accept=".rar,.zip,.7z" @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ insuranceBooking.compressedFiles=[{file:f, displayName:f.name.replace(/\.[^.]+$/,'')}]; insuranceBooking.uploadType='compressed' } }" />
                    </label>
                  </div>
                  <div class="s5-ins-doc-preview" :class="{ 'has-file': insuranceBooking.compressedFiles.length > 0 }">
                    <div v-if="!insuranceBooking.compressedFiles.length" class="s5-ins-doc-preview-empty">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span>No file selected</span>
                    </div>
                    <div v-else class="s5-ins-doc-file-row">
                      <span class="s5-ins-doc-file-icon">📦</span>
                      <div class="s5-ins-doc-file-info" style="flex:1;min-width:0;">
                        <div class="s5-frn-t" style="display:flex;align-items:center;gap:6px;">
                          <button class="s5-fre" @click.stop="insCompEditIdx = insCompEditIdx === 0 ? -1 : 0" type="button">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                          </button>
                          <input type="text" v-model="insuranceBooking.compressedFiles[0].displayName" :readonly="insCompEditIdx !== 0" :class="{ editing: insCompEditIdx === 0 }" @click.stop @blur="insCompEditIdx = -1" @keydown.enter="($event.target as HTMLInputElement).blur()" style="border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#1f2937;outline:none;flex:1;min-width:0;padding:0;" />
                        </div>
                        <div class="s5-ins-doc-file-size">{{ (insuranceBooking.compressedFiles[0].file.size / 1024).toFixed(1) }} KB</div>
                      </div>
                      <button class="s5-ins-doc-file-del" @click.stop="insuranceBooking.compressedFiles = []">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Mode B: Separate files -->
                <div class="s5-ins-doc-mode" :class="{ active: insuranceBooking.uploadType === 'separated' }" @click="insuranceBooking.uploadType = 'separated'">
                  <div class="s5-ins-doc-mode-header">
                    <span class="s5-ins-doc-radio" :class="{ act: insuranceBooking.uploadType === 'separated' }"></span>
                    <div>
                      <div class="s5-ins-doc-mode-title">Upload each document separately</div>
                      <div class="s5-ins-doc-mode-hint">(support: PDF, XLSX, DOCX,...):</div>
                    </div>
                  </div>
                  <div class="s5-ins-choose-row">
                    <label class="s5-ins-choose-zone" @click.stop>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Choose File
                      <input type="file" style="display:none" accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" multiple @change="(e: Event) => { const files=(e.target as HTMLInputElement).files; if(files){ [...files].forEach(f=>{ if(!insuranceBooking.separatedFiles.find(x=>x.file.name===f.name&&x.file.size===f.size)) insuranceBooking.separatedFiles.push({file:f, displayName:f.name.replace(/\.[^.]+$/,'')}) }); insuranceBooking.uploadType='separated' }; (e.target as HTMLInputElement).value='' }" />
                    </label>
                  </div>
                  <div class="s5-ins-doc-preview" :class="{ 'has-file': insuranceBooking.separatedFiles.length > 0 }">
                    <div v-if="!insuranceBooking.separatedFiles.length" class="s5-ins-doc-preview-empty">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span>No files selected</span>
                    </div>
                    <div v-else class="s5-ins-doc-files-grid">
                      <div class="s5-ins-doc-file-chip" v-for="(item, i) in insuranceBooking.separatedFiles" :key="i">
                        <div :class="['s5-ins-doc-file-chip-icon', (() => { const e = item.file.name.split('.').pop()?.toLowerCase()||''; return ['pdf'].includes(e) ? 'pdf' : ['xlsx','xls'].includes(e) ? 'xlsx' : ['docx','doc'].includes(e) ? 'docx' : ['jpg','jpeg','png'].includes(e) ? 'img' : ''; })()]">
                          {{ (() => { const e = item.file.name.split('.').pop()?.toLowerCase()||''; return ['pdf'].includes(e) ? '📄' : ['xlsx','xls'].includes(e) ? '📊' : ['docx','doc'].includes(e) ? '📝' : ['jpg','jpeg','png'].includes(e) ? '🖼️' : '📎'; })() }}
                        </div>
                        <div class="s5-ins-chip-name-wrap">
                          <input class="s5-ins-chip-name-inp" type="text" v-model="item.displayName" title="Click to rename" @click.stop @keydown.enter="($event.target as HTMLInputElement).blur()" />
                          <span class="s5-ins-chip-pencil">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                          </span>
                        </div>
                        <button class="s5-ins-doc-file-chip-del" @click.stop="insuranceBooking.separatedFiles.splice(i,1)">×</button>
                      </div>
                      <label style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer">
                        <div class="s5-ins-doc-add-chip">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </div>
                        <div style="font-size:9px;color:#9ca3af">Add more</div>
                        <input type="file" style="display:none" accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" multiple @change="(e: Event) => { const files=(e.target as HTMLInputElement).files; if(files){ [...files].forEach(f=>{ if(!insuranceBooking.separatedFiles.find(x=>x.file.name===f.name&&x.file.size===f.size)) insuranceBooking.separatedFiles.push({file:f, displayName:f.name.replace(/\.[^.]+$/,'')}) }) }; (e.target as HTMLInputElement).value='' }" />
                      </label>
                    </div>
                  </div>
                </div>
              </div><!-- end doc-modes -->

              <!-- Checklist -->
              <div class="s5-ins-doc-checklist" :class="{ chk: insuranceBooking.ensureDocSet }" @click="insuranceBooking.ensureDocSet = !insuranceBooking.ensureDocSet">
                <span class="s5-ins-doc-chk-box"></span>
                <span class="s5-ins-doc-chk-text">Make sure the document set includes
                  <span class="s5-ins-doc-chk-link">Application Form</span>,
                  <span class="s5-ins-doc-chk-link">Commercial Invoice</span>,
                  <span class="s5-ins-doc-chk-link">Packing List</span>,
                  <span class="s5-ins-doc-chk-link">Bill of Lading</span>.
                </span>
              </div>

            </div><!-- end ins-section docs -->
          </template>

          <!-- Section: Submit Later -->
          <div v-if="insuranceBooking.submitType === 'LATER'" class="s5-ins-section">
            <div class="s5-cp-later-note">
              <span style="font-size:20px;flex-shrink:0">🕐</span>
              <div class="s5-cp-later-text">You can submit the documents later. The order will be saved and you can return to upload at any time.</div>
            </div>
          </div>

        </div><!-- end main card -->

        <!-- Remarks -->
        <div class="s5-mc">
          <div class="s5-sd s5-sd-flex">
            <div class="s5-sd-left">
              <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <span class="s5-st">Remarks (if any)</span>
            </div>
          </div>
          <div class="s5-sb"><textarea class="s5-fta" v-model="insuranceBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
        </div>

        <!-- Bottom actions -->
        <div class="s5-ba">
          <button class="s5-btn" @click="goBackStep5Tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </button>
          <button class="s5-btn s5-btn-next" :disabled="!insuranceBooking.ensureDocSet" @click="validateStep5">
            Continue
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

        </div><!-- end s5-page Insurance -->

        <!-- Duplicate Full EXW template disabled; the canonical block is above. -->
        <div v-if="false" class="s5-page">

        <!-- Service badge -->
        <div class="s5-stag">
          <span class="s5-stag-icon">🚛</span>
          <div class="s5-stag-text">
            <span class="s5-stag-label">Full EXW service</span>
            <span class="s5-stag-desc">From shipper's warehouse to CFS warehouse (customs clearance included)</span>
          </div>
        </div>

        <!-- Main card -->
        <div class="s5-mc">

          <!-- ── SHIPPING BOOKING (only when Place Booking at Offered Rate IS also selected — KO DÙNG SHOPTRANS) ── -->
          <template v-if="services.sea.selected.includes('handleUnderAvailable')">
          <div class="s5-sd">
            <div class="s5-si">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6-.5 1.2-1 2.5-1 2.5 0 2.5 2 5 2 1.3 0 1.9-.5 2.5-1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 1v4"/><path d="M12 9v3"/></svg>
            </div>
            <span class="s5-st">Shipping Booking</span>
          </div>
          <div class="s5-sb"><div class="s5-fg">

            <div class="s5-row-ship">
              <div class="s5-ff">
                <span class="s5-fl">Coloader <span class="s5-rq">*</span></span>
                <select class="s5-fi s5-fi-select custom-caret-svg" :class="{ 's5-inv': step5Errors.has('shippingLine') }" v-model="exwBooking.shippingLine" @change="step5Errors.delete('shippingLine')">
                  <option value="">— Select —</option>
                  <option>ECU LINE</option>
                  <option>SHIPCO</option>
                  <option>AWS</option>
                  <option>CHARTER LINK</option>
                  <option>SGL</option>
                </select>
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Booking number <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('bookingNumber') }" v-model="exwBooking.bookingNumber" @input="step5Errors.delete('bookingNumber')" placeholder="Input booking number" maxlength="20" />
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Vessel name <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('vesselName') }" v-model="exwBooking.vesselName" @input="step5Errors.delete('vesselName')" placeholder="Input vessel name" />
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Vessel voyage <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('vesselVoyage') }" v-model="exwBooking.vesselVoyage" @input="step5Errors.delete('vesselVoyage')" placeholder="Input vessel voyage" />
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Est. departure <span class="s5-rq">*</span></span>
                <div class="s5-date-wrap">
                  <EnDatePicker :min-date="minDate" v-model="exwBooking.estDepartureTime" input-class="s5-fi" :dynamic-input-class="{ 's5-inv': step5Errors.has('estDepartureTime') }" @change="step5Errors.delete('estDepartureTime')" />
                </div>
              </div>
            </div>

          </div></div>
          </template><!-- end shipping booking block -->

          <!-- ── PICKUP ARRANGEMENT ── -->
          <div class="s5-sd">
            <div class="s5-si">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 12 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <span class="s5-st">Pickup Arrangement</span>
          </div>
          <div class="s5-sb"><div class="s5-fg">

            <!-- Same as shipper toggle -->
            <div class="s5-sar" :class="{ act: exwBooking.sameAsShipper }" @click="exwBooking.sameAsShipper = !exwBooking.sameAsShipper; if(exwBooking.sameAsShipper){ exwBooking.pickupCompany=shipperInfo.companyName; exwBooking.pickupAddress=shipperInfo.companyAddress; exwBooking.picName=shipperInfo.picName; exwBooking.picTitle=shipperInfo.picTitle; exwBooking.email=shipperInfo.email; exwBooking.phone=shipperInfo.phone } else { exwBooking.pickupCompany=''; exwBooking.pickupAddress='';exwBooking.zipCode='';exwBooking.picName='';exwBooking.email='';exwBooking.phone='' }">
              <span class="s5-sc"></span>
              <span class="s5-sal">SAME AS SHIPPER</span>
            </div>

            <div class="s5-ff">
              <span class="s5-fl">Pickup from company <span class="s5-rq">*</span></span>
              <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('pickupCompany'), 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.pickupCompany" :disabled="exwBooking.sameAsShipper" @input="step5Errors.delete('pickupCompany')" placeholder="Enter company name" />
            </div>

            <div class="s5-row-addr-zip">
              <div class="s5-ff">
                <span class="s5-fl">Company address <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('pickupAddress'), 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.pickupAddress" :disabled="exwBooking.sameAsShipper" @input="step5Errors.delete('pickupAddress')" placeholder="Full pickup address including city, state, country" />
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Zip code <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('zipCode'), 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.zipCode" :disabled="exwBooking.sameAsShipper" @input="step5Errors.delete('zipCode')" placeholder="e.g. 700000" maxlength="10" />
              </div>
            </div>

            <div class="s5-row-pic">
              <div class="s5-ff">
                <span class="s5-fl">Title</span>
                <select class="s5-fi s5-fi-select custom-caret-svg" :class="{ 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.picTitle" :disabled="exwBooking.sameAsShipper">
                  <option>Mr.</option><option>Mrs.</option><option>Ms.</option>
                </select>
              </div>
              <div class="s5-ff">
                <span class="s5-fl">PIC name <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('picName'), 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.picName" :disabled="exwBooking.sameAsShipper" @input="step5Errors.delete('picName')" placeholder="Contact person in charge" />
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Email <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('picEmail'), 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.email" :disabled="exwBooking.sameAsShipper" @input="step5Errors.delete('picEmail')" placeholder="email@company.com" />
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Phone <span class="s5-rq">*</span></span>
                <input type="tel" class="s5-fi" :class="{ 's5-inv': step5Errors.has('picPhone'), 's5-disabled': exwBooking.sameAsShipper }" v-model="exwBooking.phone" :disabled="exwBooking.sameAsShipper" @input="step5Errors.delete('picPhone')" placeholder="e.g. +84 28 1234 567" maxlength="18" />
              </div>
            </div>

            <div class="s5-row-date">
              <div class="s5-ff">
                <span class="s5-fl">Pickup date <span class="s5-rq">*</span></span>
                <div class="s5-date-wrap">
                  <EnDatePicker :min-date="minDate" v-model="exwBooking.pickupDate" input-class="s5-fi" :dynamic-input-class="{ 's5-inv': step5Errors.has('pickupDate') }" @change="step5Errors.delete('pickupDate')" />
                </div>
              </div>
              <div class="s5-ff">
                <span class="s5-fl">Pickup time</span>
                <div class="s5-date-wrap">
                  <EnTimePicker v-model="exwBooking.pickupTime" />
                </div>
              </div>
            </div>

            <!-- Confirm no restriction -->
            <div class="s5-cr" :class="{ act: exwBooking.isRestricted }" @click="exwBooking.isRestricted = !exwBooking.isRestricted">
              <span class="s5-crc"></span>
              <span class="s5-crt">
                Confirm the pickup location is not restricted
                <span class="s5-tip-wrap">
                  <span class="s5-tip-i">i</span>
                  <span class="s5-tip-box">Please ensure the pickup address is not located on a road restricted to container trucks or heavy vehicles.</span>
                </span>
              </span>
            </div>

          </div></div>

          <!-- ── CUSTOMS CLEARANCE ── -->
          <div class="s5-sd">
            <div class="s5-si">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <span class="s5-st">Customs Clearance</span>
          </div>
          <div class="s5-sb"><div class="s5-fg">

            <div class="s5-co">
              <!-- Option 1 -->
              <div class="s5-cop" :class="{ sel: exwBooking.contactShipper && !exwBooking.providedAfterStuffing && !exwBooking.declareCustomsBasedOnDocs }" @click="exwBooking.contactShipper=true; exwBooking.providedAfterStuffing=false; exwBooking.declareCustomsBasedOnDocs=false">
                <span class="s5-cop-num">1</span>
                <div class="s5-cop-body">
                  <div class="s5-cop-title">Contact shipper for documents</div>
                  <div class="s5-cop-hint">We will reach out to the shipper directly to collect the required customs documents</div>
                </div>
              </div>
              <!-- Option 2 -->
              <div class="s5-cop" :class="{ sel: exwBooking.providedAfterStuffing }" @click="exwBooking.contactShipper=false; exwBooking.providedAfterStuffing=true; exwBooking.declareCustomsBasedOnDocs=false">
                <span class="s5-cop-num">2</span>
                <div class="s5-cop-body">
                  <div class="s5-cop-title">Documents provided after cargo stuffing</div>
                  <div class="s5-cop-hint">Documents will be submitted once cargo loading is complete</div>
                </div>
                <div class="s5-cop-pb">
                  <span>Provided by:</span>
                  <select class="s5-pb-select custom-caret-svg" v-model="exwBooking.providedBy" @click.stop>
                    <option>Shipper</option><option>Our company</option><option>Third party</option>
                  </select>
                </div>
              </div>
              <!-- Option 3 -->
              <div class="s5-cop" :class="{ sel: exwBooking.declareCustomsBasedOnDocs }" @click="exwBooking.contactShipper=false; exwBooking.providedAfterStuffing=false; exwBooking.declareCustomsBasedOnDocs=true">
                <span class="s5-cop-num">3</span>
                <div class="s5-cop-body">
                  <div class="s5-cop-title">Declare customs based on uploaded documents</div>
                  <div class="s5-cop-hint">Upload your documents below for customs declaration processing</div>
                </div>
              </div>
            </div>

            <!-- Expanded upload panel (only option 3) -->
            <div v-if="exwBooking.declareCustomsBasedOnDocs" class="s5-cex">

              <!-- Step ①: Doc allocation -->
              <div class="s5-upload-step">
                <div class="s5-upload-step-num">①</div>
                <div class="s5-upload-step-body">
                  <div class="s5-dal-label">Document Set Allocation</div>
                  <div class="s5-dal-chips">
                  <div class="s5-dal-chip" :class="{ act: exwBooking.docAllocation === 'same' }" @click="exwBooking.docAllocation = 'same'">
                      <span class="s5-dal-chip-r"></span>
                      <div>
                        <div class="s5-dal-chip-t">Single document set</div>
                        <div class="s5-dal-chip-h">One set covers the entire shipment</div>
                      </div>
                    </div>
                    <div class="s5-dal-chip" :class="{ act: exwBooking.docAllocation === 'multi' }" @click="exwBooking.docAllocation = 'multi'">
                      <span class="s5-dal-chip-r"></span>
                      <div>
                        <div class="s5-dal-chip-t">Multiple document sets</div>
                        <div class="s5-dal-chip-h">Shipment uses more than one document set</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step ②: Upload mode -->
              <div class="s5-upload-step">
                <div class="s5-upload-step-num">②</div>
                <div class="s5-upload-step-body">
                  <div class="s5-dal-label">Upload documents</div>
                  <div class="s5-ut">
                    <div class="s5-uo" :class="{ act: exwBooking.uploadType === 'compressed' }" @click="exwBooking.uploadType = 'compressed'">
                      <span class="s5-uor"></span>
                      <div class="s5-uo-body">
                        <span class="s5-uot">All in one compressed file</span>
                        <span class="s5-uoh">.rar, .zip, .7z</span>
                      </div>
                    </div>
                    <div class="s5-uo" :class="{ act: exwBooking.uploadType === 'separate' }" @click="exwBooking.uploadType = 'separate'">
                      <span class="s5-uor"></span>
                      <div class="s5-uo-body">
                        <span class="s5-uot">Upload each separately</span>
                        <span class="s5-uoh">PDF, XLSX, DOCX</span>
                      </div>
                    </div>
                  </div>

                  <!-- File upload zone — Compressed mode -->
                  <div v-if="exwBooking.uploadType === 'compressed'" class="s5-upload-zone">
                    <div v-for="(row, ri) in exwCompressedRows" :key="'exw-c-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerExwUpload('compressed', ri)">
                      <span class="s5-fri">📦</span>
                      <div class="s5-frn">
                        <div class="s5-frn-t">
                          <button class="s5-fre" @click.stop="startEditExwRowName('compressed', ri)" type="button">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                          </button>
                          <input type="text" :value="row.name" :readonly="exwEditingRow !== 'c-'+ri" :class="{ editing: exwEditingRow === 'c-'+ri }" @click.stop @blur="finishEditExwRowName('compressed', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                        </div>
                        <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                      </div>
                      <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                      <button v-if="!row.required" class="s5-frx" @click.stop="removeExwRow('compressed', ri)" type="button">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                      <input :ref="(el: any) => { if(el) exwFileInputRefs['c-'+ri] = el }" type="file" style="display:none" accept=".rar,.zip,.7z" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                    </div>
                    <button v-if="exwBooking.docAllocation !== 'same'" class="s5-afb" @click="addExwRow('compressed')" type="button">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add more
                    </button>
                  </div>

                  <!-- File upload zone — Separate mode -->
                  <div v-else class="s5-upload-zone">
                    <div v-for="(row, ri) in exwSeparateRows" :key="'exw-s-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerExwUpload('separate', ri)">
                      <span class="s5-fri">{{ row.icon || '📄' }}</span>
                      <div class="s5-frn">
                        <div class="s5-frn-t">
                          <button class="s5-fre" @click.stop="startEditExwRowName('separate', ri)" type="button">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                          </button>
                          <input type="text" :value="row.name" :readonly="exwEditingRow !== 's-'+ri" :class="{ editing: exwEditingRow === 's-'+ri }" @click.stop @blur="finishEditExwRowName('separate', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                        </div>
                        <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                      </div>
                      <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                      <button v-if="!row.required" class="s5-frx" @click.stop="removeExwRow('separate', ri)" type="button">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                      <input :ref="(el: any) => { if(el) exwFileInputRefs['s-'+ri] = el }" type="file" style="display:none" accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                    </div>
                    <button class="s5-afb" @click="addExwRow('separate')" type="button">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add more
                    </button>
                  </div>
                </div>
              </div>

              <!-- Step ③: Checklist -->
              <div class="s5-upload-step">
                <div class="s5-upload-step-num">③</div>
                <div class="s5-upload-step-body">
                  <div class="s5-dcl" :class="{ chk: exwBooking.ensureDocSet }" @click="exwBooking.ensureDocSet = !exwBooking.ensureDocSet">
                    <span class="s5-dcb"></span>
                    <span class="s5-dct">Make sure the document set includes <strong>Commercial Invoice</strong>, <strong>Packing List</strong>, <strong>Sales Contract</strong>, and <strong>Cargo Photos</strong>.</span>
                  </div>
                </div>
              </div>

            </div><!-- end cex -->

          </div></div>

          <!-- ── REMARKS ── -->
          <div class="s5-sd">
            <div class="s5-si">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span class="s5-st">Remarks (if any)</span>
          </div>
          <div class="s5-sb">
            <textarea class="s5-fta" v-model="exwBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea>
          </div>

        </div><!-- end s5-mc -->

        <!-- Bottom actions -->
        <div class="s5-ba">
          <button class="s5-btn" @click="goBackStep5Tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </button>
          <button class="s5-btn s5-btn-next" :disabled="exwBooking.declareCustomsBasedOnDocs && !exwBooking.ensureDocSet" @click="validateStep5">
            Continue
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

        </div><!-- end s5-page Full EXW -->

        <!-- ── Place Booking at Offered Rate STEP 5 ── -->
        <div v-show="activeStep5Tab === 's5-bookingOffered'" class="s5-page">

        <!-- Service badge -->
        <div class="s5-stag">
          <span class="s5-stag-icon">🚢</span>
          <div class="s5-stag-text">
            <span class="s5-stag-label">Place booking at the offered rate</span>
            <span class="s5-stag-desc">LCL FREIGHT booking with confirmed rate</span>
          </div>
        </div>

        <!-- Card 1: Spot Rate Summary -->
        <div class="s5-mc">
          <div class="s5-sd s5-sd-flex">
            <div class="s5-sd-left">
              <div class="s5-si">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
              </div>
              <span class="s5-st">Spot Rate</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span class="s5-or-badge">CONFIRMED</span>
              <button class="s5-or-change-btn" @click="changeOptionGoToStep2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Change option
              </button>
            </div>
          </div>
          <!-- Row 1: Carrier · Rate · Route · Transit Time · Validity -->
          <div class="s5-or-rate-grid">
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Coloader</div>
              <div class="s5-or-rate-val">Evergreen Line</div>
              <div class="s5-or-rate-sub">AEX Service</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Rate</div>
              <div class="s5-or-rate-val">USD 1,250 / 20'</div>
              <div class="s5-or-rate-sub">USD 1,850 / 40' · USD 1,950 / 40'HC</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Route</div>
              <div class="s5-or-rate-val" style="display:flex;align-items:center;gap:6px">
                HCM
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                SHA
              </div>
              <div class="s5-or-rate-sub">Ho Chi Minh → Shanghai</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Transit Time</div>
              <div class="s5-or-rate-val">5 days</div>
              <div class="s5-or-rate-sub">Dep + 5 days</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Validity</div>
              <div class="s5-or-rate-val">Until 31 Mar 2026</div>
              <div class="s5-or-rate-sub" style="color:#d97706">⚠ Expires in 26 days</div>
            </div>
          </div>

          <!-- Divider -->
          <div style="border-top:1px solid #e5e7eb;margin:4px 24px;"></div>

          <!-- Row 2: Departure Date · Vessel · Voyage · Freetime · Arrival -->
          <div class="s5-or-rate-grid">
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Departure Date</div>
              <div class="s5-or-rate-val">15 Apr 2026</div>
              <div class="s5-or-rate-sub">ETD Ho Chi Minh</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Vessel Name</div>
              <div class="s5-or-rate-val">EVER GIVEN</div>
              <div class="s5-or-rate-sub">Evergreen Line</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Voyage Name</div>
              <div class="s5-or-rate-val">0123E</div>
              <div class="s5-or-rate-sub">Eastbound</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Free Storage</div>
              <div class="s5-or-rate-val">DEM 14 · DET 3 (days)</div>
              <div class="s5-or-rate-sub">As offered</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Arrival Date</div>
              <div class="s5-or-rate-val" style="color:#15803d">20 Apr 2026</div>
              <div class="s5-or-rate-sub">ETA Shanghai</div>
            </div>
          </div>

        </div>

        <!-- Card 2: Bill of lading -->
        <div class="s5-mc">
          <div class="s5-or-section-hd">Bill of lading</div>
          <div class="s5-or-section-body">

            <!-- BL header tabs -->
            <div class="s5-or-bl-header">
              <div class="s5-or-bl-header-label">Issue Bill of lading according to:</div>
              <div class="s5-or-bl-tabs">
                <button class="s5-or-bl-tab" :class="{ 's5-or-bl-tab-act': offeredBooking.issueAccordingTo === 'Shipper\'s instructions' }" @click="offeredBooking.issueAccordingTo = 'Shipper\'s instructions'">Shipper's instructions</button>
                <button class="s5-or-bl-tab" :class="{ 's5-or-bl-tab-act': offeredBooking.issueAccordingTo === 'Our instructions below' }" @click="offeredBooking.issueAccordingTo = 'Our instructions below'">Our instructions below</button>
              </div>
            </div>

            <!-- BL Options -->
            <div :class="{ 's5-or-bl-opts-disabled': offeredBooking.issueAccordingTo === 'Shipper\'s instructions' }">

              <!-- Row 1: Direct MBL -->
              <div class="s5-or-bl-opt-row">
                <div class="s5-or-bl-radio-cell">
                  <label class="s5-or-bl-radio-lbl">
                    <input type="radio" name="or-bl-type" value="MBL" v-model="offeredBooking.blMode">
                    <span class="s5-or-bl-radio-dot"></span>
                    Issue direct Master bill of lading (MBL)
                  </label>
                </div>
                <div class="s5-or-bl-badge-cell">
                  <div class="s5-or-bl-badge mbl">MBL:</div>
                </div>
                <div class="s5-or-bl-fields-cell">
                  <div class="s5-or-bl-fields-row">
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Bill Type</div>
                      <select class="s5-or-bk-sel" v-model="offeredBooking.mblOnlyType" :disabled="offeredBooking.blMode !== 'MBL'">
                        <option>ORIGINAL B/L</option>
                        <option>TELEX RELEASE</option>
                        <option>SEAWAY B/L</option>
                      </select>
                    </div>
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Place of issue</div>
                      <select class="s5-or-bk-sel" v-model="offeredBooking.mblOnlyPlace" :disabled="offeredBooking.blMode !== 'MBL'">
                        <option>At origin</option>
                        <option>At destination</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Row 2: MBL + HBL -->
              <div class="s5-or-bl-opt-row">
                <div class="s5-or-bl-radio-cell">
                  <label class="s5-or-bl-radio-lbl">
                    <input type="radio" name="or-bl-type" value="MBL_HBL" v-model="offeredBooking.blMode">
                    <span class="s5-or-bl-radio-dot"></span>
                    Issue Master bill of lading (MBL) and House bill of lading (HBL)
                  </label>
                </div>
                <div class="s5-or-bl-badge-cell">
                  <div class="s5-or-bl-badge mbl">MBL:</div>
                  <div class="s5-or-bl-badge hbl">HBL:</div>
                </div>
                <div class="s5-or-bl-fields-cell">
                  <!-- MBL row -->
                  <div class="s5-or-bl-fields-row">
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Bill Type</div>
                      <select class="s5-or-bk-sel" v-model="offeredBooking.mblDualType" :disabled="offeredBooking.blMode !== 'MBL_HBL'">
                        <option>ORIGINAL B/L</option>
                        <option>TELEX RELEASE</option>
                        <option>SEAWAY B/L</option>
                      </select>
                    </div>
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Place of issue</div>
                      <select class="s5-or-bk-sel" v-model="offeredBooking.mblDualPlace" :disabled="offeredBooking.blMode !== 'MBL_HBL'">
                        <option>At origin</option>
                        <option>At destination</option>
                      </select>
                    </div>
                  </div>
                  <!-- HBL row -->
                  <div class="s5-or-bl-fields-row">
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Bill Type</div>
                      <select class="s5-or-bk-sel" v-model="offeredBooking.hblType" :disabled="offeredBooking.blMode !== 'MBL_HBL'">
                        <option>ORIGINAL B/L</option>
                        <option>TELEX RELEASE</option>
                        <option>SEAWAY B/L</option>
                      </select>
                    </div>
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Bill form of</div>
                      <select class="s5-or-bk-sel" v-model="offeredBooking.hblForm" :disabled="offeredBooking.blMode !== 'MBL_HBL'">
                        <option>Our company bill's form</option>
                        <option>Shoptrans B/L form</option>
                      </select>
                    </div>
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Place of issue</div>
                      <select class="s5-or-bk-sel" v-model="offeredBooking.hblPlace" :disabled="offeredBooking.blMode !== 'MBL_HBL'">
                        <option>At origin</option>
                        <option>At destination</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

            </div><!-- end bl-options -->
          </div>
        </div>

        <!-- Card 3: Freetime request — REMOVED per reference template -->
        <div class="s5-mc" style="display:none;">
          <div class="s5-or-section-hd">Freetime request</div>
          <div style="padding:16px 32px;">
            <div style="display:flex;align-items:flex-start;gap:24px;">

              <!-- Toggle button -->
              <div style="flex-shrink:0;display:flex;align-items:flex-start;padding-top:2px;">
                <button @click="offeredBooking.freetimeExpanded = !offeredBooking.freetimeExpanded"
                  style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;border:1.5px solid #bbf7d0;background:#f0fdf4;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#15803d;cursor:pointer;transition:all .2s;outline:none;">
                  <svg :style="{ transform: offeredBooking.freetimeExpanded ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform .25s' }"
                    width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span style="letter-spacing:.05em;text-transform:uppercase;">{{ offeredBooking.freetimeExpanded ? 'Cancel request' : 'Request extra freetime' }}</span>
                </button>
              </div>

              <!-- Spinners slide in -->
              <div v-show="offeredBooking.freetimeExpanded" style="flex:1;">
                <div class="s5-or-ft-grid" style="padding:0;">

                  <!-- DEM -->
                  <div class="s5-or-ft-row">
                    <span class="s5-or-ft-label">Free Demurrage (DEM):</span>
                    <div class="s5-or-ft-input-wrap">
                      <button class="s5-or-ft-minus" @click="offeredBooking.freeDemurrage = Math.max(0, offeredBooking.freeDemurrage - 1)">−</button>
                      <input class="s5-or-ft-inp" type="number" v-model.number="offeredBooking.freeDemurrage" min="0">
                      <button class="s5-or-ft-plus" @click="offeredBooking.freeDemurrage = offeredBooking.freeDemurrage + 1">+</button>
                    </div>
                    <span class="s5-or-ft-unit">days</span>
                  </div>

                  <!-- DET -->
                  <div class="s5-or-ft-row">
                    <span class="s5-or-ft-label">Free Detention (DET):</span>
                    <div class="s5-or-ft-input-wrap">
                      <button class="s5-or-ft-minus" @click="offeredBooking.freeDetention = Math.max(0, offeredBooking.freeDetention - 1)">−</button>
                      <input class="s5-or-ft-inp" type="number" v-model.number="offeredBooking.freeDetention" min="0">
                      <button class="s5-or-ft-plus" @click="offeredBooking.freeDetention = offeredBooking.freeDetention + 1">+</button>
                    </div>
                    <span class="s5-or-ft-unit">days</span>
                  </div>

                  <!-- Combine -->
                  <div class="s5-or-ft-row">
                    <span class="s5-or-ft-label">Free Combine (DEM &amp; DET):</span>
                    <div class="s5-or-ft-input-wrap">
                      <button class="s5-or-ft-minus" @click="offeredBooking.freeCombine = Math.max(0, (offeredBooking.freeCombine ?? 0) - 1)">−</button>
                      <input class="s5-or-ft-inp" type="number" :value="offeredBooking.freeCombine ?? ''" @input="(e: Event) => { const v = (e.target as HTMLInputElement).value; offeredBooking.freeCombine = v === '' ? null : parseInt(v) }" min="0" placeholder="—">
                      <button class="s5-or-ft-plus" @click="offeredBooking.freeCombine = (offeredBooking.freeCombine ?? 0) + 1">+</button>
                    </div>
                    <span class="s5-or-ft-unit">days</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Card 4: Charge arrangement -->
        <div class="s5-mc">
          <div class="s5-or-section-hd">Charge arrangement</div>
          <div class="s5-or-section-body">
            <div class="s5-or-ca-list">

              <!-- Ocean Freight -->
              <div class="s5-or-ca-row">
                <div class="s5-or-ca-num">1</div>
                <div class="s5-or-ca-name">Ocean Freight</div>
                <div class="s5-or-ca-pp-toggle">
                  <button class="s5-or-ca-pp-opt" :class="{ active: offeredBooking.oceanFreightTerms === 'PREPAID' }" @click="setChargeTerms(offeredBooking, 'oceanFreightTerms', 'oceanFreightPayer', 'PREPAID')">Prepaid</button>
                  <button class="s5-or-ca-pp-opt" :class="{ active: offeredBooking.oceanFreightTerms === 'COLLECT' }" @click="setChargeTerms(offeredBooking, 'oceanFreightTerms', 'oceanFreightPayer', 'COLLECT')">Collect</button>
                </div>
                <div class="s5-or-ca-payer-wrap">
                  <span class="s5-or-ca-payer-lbl">Payer:</span>
                  <select class="s5-or-ca-payer-sel" v-model="offeredBooking.oceanFreightPayer">
                    <option value="">— Select —</option>
                    <option v-if="offeredBooking.oceanFreightTerms !== 'COLLECT'">Shipper</option>
                    <option v-if="offeredBooking.oceanFreightTerms !== 'PREPAID'">Consignee</option>
                    <option>Our company</option>
                    <option>The 3rd party</option>
                  </select>
                </div>
              </div>

              <!-- Original Charges -->
              <div class="s5-or-ca-row">
                <div class="s5-or-ca-num">2</div>
                <div class="s5-or-ca-name">Original Charges</div>
                <div class="s5-or-ca-pp-toggle">
                  <button class="s5-or-ca-pp-opt" :class="{ active: offeredBooking.originChargesTerms === 'PREPAID' }" @click="setChargeTerms(offeredBooking, 'originChargesTerms', 'originChargesPayer', 'PREPAID')">Prepaid</button>
                  <button class="s5-or-ca-pp-opt" :class="{ active: offeredBooking.originChargesTerms === 'COLLECT' }" @click="setChargeTerms(offeredBooking, 'originChargesTerms', 'originChargesPayer', 'COLLECT')">Collect</button>
                </div>
                <div class="s5-or-ca-payer-wrap">
                  <span class="s5-or-ca-payer-lbl">Payer:</span>
                  <select class="s5-or-ca-payer-sel" v-model="offeredBooking.originChargesPayer">
                    <option value="">— Select —</option>
                    <option v-if="offeredBooking.originChargesTerms !== 'COLLECT'">Shipper</option>
                    <option v-if="offeredBooking.originChargesTerms !== 'PREPAID'">Consignee</option>
                    <option>Our company</option>
                    <option>The 3rd party</option>
                  </select>
                </div>
              </div>

              <!-- Destination Charges -->
              <div class="s5-or-ca-row">
                <div class="s5-or-ca-num">3</div>
                <div class="s5-or-ca-name">Destination Charges</div>
                <div class="s5-or-ca-pp-toggle">
                  <button class="s5-or-ca-pp-opt" :class="{ active: offeredBooking.destChargesTerms === 'PREPAID' }" @click="setChargeTerms(offeredBooking, 'destChargesTerms', 'destChargesPayer', 'PREPAID')">Prepaid</button>
                  <button class="s5-or-ca-pp-opt" :class="{ active: offeredBooking.destChargesTerms === 'COLLECT' }" @click="setChargeTerms(offeredBooking, 'destChargesTerms', 'destChargesPayer', 'COLLECT')">Collect</button>
                </div>
                <div class="s5-or-ca-payer-wrap">
                  <span class="s5-or-ca-payer-lbl">Payer:</span>
                  <select class="s5-or-ca-payer-sel" v-model="offeredBooking.destChargesPayer">
                    <option value="">— Select —</option>
                    <option v-if="offeredBooking.destChargesTerms !== 'COLLECT'">Shipper</option>
                    <option v-if="offeredBooking.destChargesTerms !== 'PREPAID'">Consignee</option>
                    <option>Our company</option>
                    <option>The 3rd party</option>
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Card 5: Remarks -->
        <div class="s5-mc">
          <div class="s5-sd s5-sd-flex">
            <div class="s5-sd-left">
              <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <span class="s5-st">Remarks (if any)</span>
            </div>
          </div>
          <div class="s5-sb"><textarea class="s5-fta" v-model="offeredBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
        </div>

        <!-- Bottom actions -->
        <div class="s5-ba">
          <button class="s5-btn" @click="goBackStep5Tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </button>
          <button class="s5-btn s5-btn-next" @click="validateStep5">
            Continue
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

        </div><!-- end s5-page Offered Rate -->

        <!-- ── Place Booking at SPOT Rate STEP 5 ── -->
        <div v-show="activeStep5Tab === 's5-bookingSpot'" class="s5-page">

        <!-- Service badge -->
        <div class="s5-stag">
          <span class="s5-stag-icon">📊</span>
          <div class="s5-stag-text">
            <span class="s5-stag-label">Place booking at SPOT rate</span>
            <span class="s5-stag-desc">Market spot rate booking</span>
          </div>
        </div>

        <!-- Card 1: SPOT Rate Summary -->
        <div class="s5-mc">
          <div class="s5-sd s5-sd-flex">
            <div class="s5-sd-left">
              <div class="s5-si">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-4 0v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
              </div>
              <span class="s5-st">SPOT Rate</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span class="s5-or-badge">CONFIRMED</span>
              <button class="s5-or-change-btn" @click="changeOptionGoToStep2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Change option
              </button>
            </div>
          </div>
          <!-- Row 1: Carrier · Rate · Route · Transit Time · Validity -->
          <div class="s5-or-rate-grid">
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Carrier</div>
              <div class="s5-or-rate-val">Evergreen Line</div>
              <div class="s5-or-rate-sub">AEX Service</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Rate</div>
              <div class="s5-or-rate-val">USD 1,250 / 20'</div>
              <div class="s5-or-rate-sub">USD 1,850 / 40' · USD 1,950 / 40'HC</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Route</div>
              <div class="s5-or-rate-val" style="display:flex;align-items:center;gap:6px">
                HCM
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                SHA
              </div>
              <div class="s5-or-rate-sub">Ho Chi Minh → Shanghai</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Transit Time</div>
              <div class="s5-or-rate-val">5 days</div>
              <div class="s5-or-rate-sub">Dep + 5 days</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Validity</div>
              <div class="s5-or-rate-val">Until 31 Mar 2026</div>
              <div class="s5-or-rate-sub" style="color:#d97706">⚠ Expires in 26 days</div>
            </div>
          </div>

          <!-- Divider -->
          <div style="border-top:1px solid #e5e7eb;margin:4px 24px;"></div>

          <!-- Row 2: Departure Date · Vessel · Voyage · Freetime · Arrival -->
          <div class="s5-or-rate-grid">
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Departure Date</div>
              <div class="s5-or-rate-val">15 Apr 2026</div>
              <div class="s5-or-rate-sub">ETD Ho Chi Minh</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Vessel Name</div>
              <div class="s5-or-rate-val">EVER GIVEN</div>
              <div class="s5-or-rate-sub">Evergreen Line</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Voyage Name</div>
              <div class="s5-or-rate-val">0123E</div>
              <div class="s5-or-rate-sub">Eastbound</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Free Storage</div>
              <div class="s5-or-rate-val">DEM 14 · DET 3 (days)</div>
              <div class="s5-or-rate-sub">As offered</div>
            </div>
            <div class="s5-or-rate-item">
              <div class="s5-or-rate-label">Arrival Date</div>
              <div class="s5-or-rate-val" style="color:#15803d">20 Apr 2026</div>
              <div class="s5-or-rate-sub">ETA Shanghai</div>
            </div>
          </div>

        </div>

        <!-- Card 2: Bill of lading -->
        <div class="s5-mc">
          <div class="s5-or-section-hd">Bill of lading</div>
          <div class="s5-or-section-body">
            <div class="s5-or-bl-header">
              <div class="s5-or-bl-header-label">Issue Bill of lading according to:</div>
              <div class="s5-or-bl-tabs">
                <button class="s5-or-bl-tab" :class="{ 's5-or-bl-tab-act': spotBooking.issueAccordingTo === 'Shipper\'s instructions' }" @click="spotBooking.issueAccordingTo = 'Shipper\'s instructions'">Shipper's instructions</button>
                <button class="s5-or-bl-tab" :class="{ 's5-or-bl-tab-act': spotBooking.issueAccordingTo === 'Our instructions below' }" @click="spotBooking.issueAccordingTo = 'Our instructions below'">Our instructions below</button>
              </div>
            </div>
            <div :class="{ 's5-or-bl-opts-disabled': spotBooking.issueAccordingTo === 'Shipper\'s instructions' }">
              <!-- Row 1: Direct MBL -->
              <div class="s5-or-bl-opt-row">
                <div class="s5-or-bl-radio-cell">
                  <label class="s5-or-bl-radio-lbl">
                    <input type="radio" name="sp-bl-type" value="MBL" v-model="spotBooking.blMode">
                    <span class="s5-or-bl-radio-dot"></span>
                    Issue direct Master bill of lading (MBL)
                  </label>
                </div>
                <div class="s5-or-bl-badge-cell"><div class="s5-or-bl-badge mbl">MBL:</div></div>
                <div class="s5-or-bl-fields-cell">
                  <div class="s5-or-bl-fields-row">
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Bill Type</div>
                      <select class="s5-or-bk-sel" v-model="spotBooking.mblOnlyType" :disabled="spotBooking.blMode !== 'MBL'">
                        <option>ORIGINAL B/L</option><option>TELEX RELEASE</option><option>SEAWAY B/L</option>
                      </select>
                    </div>
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Place of issue</div>
                      <select class="s5-or-bk-sel" v-model="spotBooking.mblOnlyPlace" :disabled="spotBooking.blMode !== 'MBL'">
                        <option>At origin</option><option>At destination</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Row 2: MBL + HBL -->
              <div class="s5-or-bl-opt-row">
                <div class="s5-or-bl-radio-cell">
                  <label class="s5-or-bl-radio-lbl">
                    <input type="radio" name="sp-bl-type" value="MBL_HBL" v-model="spotBooking.blMode">
                    <span class="s5-or-bl-radio-dot"></span>
                    Issue Master bill of lading (MBL) and House bill of lading (HBL)
                  </label>
                </div>
                <div class="s5-or-bl-badge-cell">
                  <div class="s5-or-bl-badge mbl">MBL:</div>
                  <div class="s5-or-bl-badge hbl">HBL:</div>
                </div>
                <div class="s5-or-bl-fields-cell">
                  <div class="s5-or-bl-fields-row">
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Bill Type</div>
                      <select class="s5-or-bk-sel" v-model="spotBooking.mblDualType" :disabled="spotBooking.blMode !== 'MBL_HBL'">
                        <option>ORIGINAL B/L</option><option>TELEX RELEASE</option><option>SEAWAY B/L</option>
                      </select>
                    </div>
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Place of issue</div>
                      <select class="s5-or-bk-sel" v-model="spotBooking.mblDualPlace" :disabled="spotBooking.blMode !== 'MBL_HBL'">
                        <option>At origin</option><option>At destination</option>
                      </select>
                    </div>
                  </div>
                  <div class="s5-or-bl-fields-row">
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Bill Type</div>
                      <select class="s5-or-bk-sel" v-model="spotBooking.hblType" :disabled="spotBooking.blMode !== 'MBL_HBL'">
                        <option>ORIGINAL B/L</option><option>TELEX RELEASE</option><option>SEAWAY B/L</option>
                      </select>
                    </div>
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Bill form of</div>
                      <select class="s5-or-bk-sel" v-model="spotBooking.hblForm" :disabled="spotBooking.blMode !== 'MBL_HBL'">
                        <option>Our company bill's form</option><option>Shoptrans B/L form</option>
                      </select>
                    </div>
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Place of issue</div>
                      <select class="s5-or-bk-sel" v-model="spotBooking.hblPlace" :disabled="spotBooking.blMode !== 'MBL_HBL'">
                        <option>At origin</option><option>At destination</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3: Freetime request (collapsible) -->
        <div class="s5-mc">
          <div class="s5-or-section-hd">Freetime request</div>
          <div style="padding:16px 32px;">
            <div style="display:flex;align-items:flex-start;gap:24px;">

              <!-- Toggle button -->
              <div style="flex-shrink:0;display:flex;align-items:flex-start;padding-top:2px;">
                <button @click="spotBooking.freetimeExpanded = !spotBooking.freetimeExpanded"
                  style="display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;border:1.5px solid #bbf7d0;background:#f0fdf4;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;color:#15803d;cursor:pointer;transition:all .2s;outline:none;">
                  <svg :style="{ transform: spotBooking.freetimeExpanded ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform .25s' }"
                    width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span style="letter-spacing:.05em;text-transform:uppercase;">{{ spotBooking.freetimeExpanded ? 'Cancel request' : 'Request extra freetime' }}</span>
                </button>
              </div>

              <!-- Spinners slide in -->
              <div v-show="spotBooking.freetimeExpanded" style="flex:1;">
                <div class="s5-or-ft-grid" style="padding:0;">

                  <!-- DEM -->
                  <div class="s5-or-ft-row">
                    <span class="s5-or-ft-label">Free Demurrage (DEM):</span>
                    <div class="s5-or-ft-input-wrap">
                      <button class="s5-or-ft-minus" @click="spotBooking.freeDemurrage = Math.max(0, spotBooking.freeDemurrage - 1)">−</button>
                      <input class="s5-or-ft-inp" type="number" v-model.number="spotBooking.freeDemurrage" min="0">
                      <button class="s5-or-ft-plus" @click="spotBooking.freeDemurrage = spotBooking.freeDemurrage + 1">+</button>
                    </div>
                    <span class="s5-or-ft-unit">days</span>
                  </div>

                  <!-- DET -->
                  <div class="s5-or-ft-row">
                    <span class="s5-or-ft-label">Free Detention (DET):</span>
                    <div class="s5-or-ft-input-wrap">
                      <button class="s5-or-ft-minus" @click="spotBooking.freeDetention = Math.max(0, spotBooking.freeDetention - 1)">−</button>
                      <input class="s5-or-ft-inp" type="number" v-model.number="spotBooking.freeDetention" min="0">
                      <button class="s5-or-ft-plus" @click="spotBooking.freeDetention = spotBooking.freeDetention + 1">+</button>
                    </div>
                    <span class="s5-or-ft-unit">days</span>
                  </div>

                  <!-- Combine -->
                  <div class="s5-or-ft-row">
                    <span class="s5-or-ft-label">Free Combine (DEM &amp; DET):</span>
                    <div class="s5-or-ft-input-wrap">
                      <button class="s5-or-ft-minus" @click="spotBooking.freeCombine = Math.max(0, (spotBooking.freeCombine ?? 0) - 1)">−</button>
                      <input class="s5-or-ft-inp" type="number" :value="spotBooking.freeCombine ?? ''" @input="(e: Event) => { const v = (e.target as HTMLInputElement).value; spotBooking.freeCombine = v === '' ? null : parseInt(v) }" min="0" placeholder="—">
                      <button class="s5-or-ft-plus" @click="spotBooking.freeCombine = (spotBooking.freeCombine ?? 0) + 1">+</button>
                    </div>
                    <span class="s5-or-ft-unit">days</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Card 4: Charge arrangement -->
        <div class="s5-mc">
          <div class="s5-or-section-hd">Charge arrangement:</div>
          <div class="s5-or-section-body">
            <div class="s5-or-ca-list">
              <!-- 1. Ocean Freight -->
              <div class="s5-or-ca-row">
                <div class="s5-or-ca-num">1</div>
                <div class="s5-or-ca-name">Ocean Freight</div>
                <div class="s5-or-ca-pp-toggle">
                  <button class="s5-or-ca-pp-opt" :class="{ active: spotBooking.oceanFreightTerms === 'PREPAID' }" @click="setChargeTerms(spotBooking, 'oceanFreightTerms', 'oceanFreightPayer', 'PREPAID')">Prepaid</button>
                  <button class="s5-or-ca-pp-opt" :class="{ active: spotBooking.oceanFreightTerms === 'COLLECT' }" @click="setChargeTerms(spotBooking, 'oceanFreightTerms', 'oceanFreightPayer', 'COLLECT')">Collect</button>
                </div>
                <div class="s5-or-ca-payer-wrap">
                  <span class="s5-or-ca-payer-lbl">Payer:</span>
                  <select class="s5-or-ca-payer-sel" v-model="spotBooking.oceanFreightPayer">
                    <option value="">— Select —</option><option v-if="spotBooking.oceanFreightTerms !== 'COLLECT'">Shipper</option><option v-if="spotBooking.oceanFreightTerms !== 'PREPAID'">Consignee</option><option>Our company</option><option>The 3rd party</option>
                  </select>
                </div>
              </div>
              <!-- 2. Original Charges -->
              <div class="s5-or-ca-row">
                <div class="s5-or-ca-num">2</div>
                <div class="s5-or-ca-name">Original Charges</div>
                <div class="s5-or-ca-pp-toggle">
                  <button class="s5-or-ca-pp-opt" :class="{ active: spotBooking.originChargesTerms === 'PREPAID' }" @click="setChargeTerms(spotBooking, 'originChargesTerms', 'originChargesPayer', 'PREPAID')">Prepaid</button>
                  <button class="s5-or-ca-pp-opt" :class="{ active: spotBooking.originChargesTerms === 'COLLECT' }" @click="setChargeTerms(spotBooking, 'originChargesTerms', 'originChargesPayer', 'COLLECT')">Collect</button>
                </div>
                <div class="s5-or-ca-payer-wrap">
                  <span class="s5-or-ca-payer-lbl">Payer:</span>
                  <select class="s5-or-ca-payer-sel" v-model="spotBooking.originChargesPayer">
                    <option value="">— Select —</option><option v-if="spotBooking.originChargesTerms !== 'COLLECT'">Shipper</option><option v-if="spotBooking.originChargesTerms !== 'PREPAID'">Consignee</option><option>Our company</option><option>The 3rd party</option>
                  </select>
                </div>
              </div>
              <!-- 3. Destination Charges -->
              <div class="s5-or-ca-row">
                <div class="s5-or-ca-num">3</div>
                <div class="s5-or-ca-name">Destination Charges</div>
                <div class="s5-or-ca-pp-toggle">
                  <button class="s5-or-ca-pp-opt" :class="{ active: spotBooking.destChargesTerms === 'PREPAID' }" @click="setChargeTerms(spotBooking, 'destChargesTerms', 'destChargesPayer', 'PREPAID')">Prepaid</button>
                  <button class="s5-or-ca-pp-opt" :class="{ active: spotBooking.destChargesTerms === 'COLLECT' }" @click="setChargeTerms(spotBooking, 'destChargesTerms', 'destChargesPayer', 'COLLECT')">Collect</button>
                </div>
                <div class="s5-or-ca-payer-wrap">
                  <span class="s5-or-ca-payer-lbl">Payer:</span>
                  <select class="s5-or-ca-payer-sel" v-model="spotBooking.destChargesPayer">
                    <option value="">— Select —</option><option v-if="spotBooking.destChargesTerms !== 'COLLECT'">Shipper</option><option v-if="spotBooking.destChargesTerms !== 'PREPAID'">Consignee</option><option>Our company</option><option>The 3rd party</option>
                  </select>
                </div>
              </div>
              <!-- 4. Handling charge (SPOT only) -->
              <div class="s5-or-ca-row">
                <div class="s5-or-ca-num">4</div>
                <div class="s5-or-ca-name">Handling charge</div>
                <div class="s5-or-ca-pp-toggle">
                  <button class="s5-or-ca-pp-opt" :class="{ active: spotBooking.agentHandlingTerms === 'PREPAID' }" @click="setChargeTerms(spotBooking, 'agentHandlingTerms', 'agentHandlingPayer', 'PREPAID')">Prepaid</button>
                  <button class="s5-or-ca-pp-opt" :class="{ active: spotBooking.agentHandlingTerms === 'COLLECT' }" @click="setChargeTerms(spotBooking, 'agentHandlingTerms', 'agentHandlingPayer', 'COLLECT')">Collect</button>
                </div>
                <div class="s5-or-ca-payer-wrap">
                  <span class="s5-or-ca-payer-lbl">Payer:</span>
                  <select class="s5-or-ca-payer-sel" v-model="spotBooking.agentHandlingPayer">
                    <option value="">— Select —</option><option v-if="spotBooking.agentHandlingTerms !== 'COLLECT'">Shipper</option><option v-if="spotBooking.agentHandlingTerms !== 'PREPAID'">Consignee</option><option>Our company</option><option>The 3rd party</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 5: Remarks -->
        <div class="s5-mc">
          <div class="s5-sd s5-sd-flex">
            <div class="s5-sd-left">
              <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <span class="s5-st">Remarks (if any)</span>
            </div>
          </div>
          <div class="s5-sb"><textarea class="s5-fta" v-model="spotBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
        </div>

        <!-- Bottom actions -->
        <div class="s5-ba">
          <button class="s5-btn" @click="goBackStep5Tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </button>
          <button class="s5-btn s5-btn-next" @click="validateStep5">
            Continue
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

        </div><!-- end s5-page SPOT Rate -->

        <!-- ── Handle the Shipment Under an Available Booking STEP 5 ── -->
        <div v-show="activeStep5Tab === 's5-handleUnderAvailable'" class="s5-page">

        <!-- Service badge -->
        <div class="s5-stag">
          <span class="s5-stag-icon">📝</span>
          <div class="s5-stag-text">
            <span class="s5-stag-label">Handle the shipment under an available booking</span>
          </div>
        </div>

        <!-- Card 1: Booking Information -->
        <div class="s5-mc" style="margin-bottom:16px">
          <div class="s5-sd s5-sd-flex">
            <div class="s5-sd-left">
              <div class="s5-si">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <span class="s5-st">Booking information</span>
            </div>
            <button class="s5-or-change-btn" @click="changeOptionGoToStep2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Change option
            </button>
          </div>
          <div class="s5-av-bk-grid">
            <!-- Shipping line -->
            <div class="s5-av-bk-field">
              <div class="s5-or-bk-fl">Shipping line</div>
              <select class="s5-or-bk-sel" v-model="availableBooking.shippingLine">
                <option value="">Select carrier</option>
                <option>Ecu Line</option>
                <option>COSCO</option>
                <option>MSC</option>
                <option>CMA CGM</option>
                <option>Hapag-Lloyd</option>
                <option>ONE</option>
                <option>Yang Ming</option>
                <option>HMM</option>
                <option>ZIM</option>
              </select>
            </div>
            <!-- Booking number -->
            <div class="s5-av-bk-field">
              <div class="s5-or-bk-fl">Booking number</div>
              <input class="s5-av-bk-inp" type="text" v-model="availableBooking.bookingNumber" placeholder="Input booking number">
            </div>
            <!-- Attach Booking Confirmation -->
            <div class="s5-av-bk-field">
              <div class="s5-or-bk-fl">Attach Booking Confirmation</div>
              <div class="s5-av-chip-zone">
                <template v-for="(item, idx) in availableBooking.confirmFiles" :key="idx">
                  <div class="s5-bk-chip" :class="{ 'up': item.file }" @click="!item.file ? ($event.currentTarget as HTMLElement).querySelector('input')?.click() : null" :style="!item.file ? 'cursor:pointer' : ''">
                    <!-- Hidden file input for this specific slot -->
                    <input type="file" style="display:none" @click.stop @change="(e: Event) => { const files = (e.target as HTMLInputElement).files; if(files && files[0]) { item.file = files[0]; if(idx > 0 && !item.displayName) item.displayName = files[0].name.replace(/\.[^.]+$/,''); } (e.target as HTMLInputElement).value = '' }" accept=".rar,.zip,.7z,.pdf,.xlsx,.xls,.docx,.doc,.png,.jpg">
                    <!-- Tick icon (uploaded) -->
                    <svg v-if="item.file" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;pointer-events:none"><polyline points="20 6 9 17 4 12"/></svg>
                    <!-- File outline icon (empty) -->
                    <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;pointer-events:none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <!-- Editable name input -->
                    <input type="text" class="s5-bk-chip-inp" v-model="item.displayName" :class="{ first: idx === 0 }" @click.stop @keydown.enter="($event.target as HTMLInputElement).blur()" :title="item.file?.name" :readonly="idx === 0 || !item.file" />
                    <!-- Green tick circle -->
                    <span v-if="item.file" class="s5-bk-tick-circle">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <!-- Delete (Clear file if first, else splice) -->
                    <button class="s5-bk-chip-del" @click.stop="idx === 0 ? (item.file = null) : availableBooking.confirmFiles.splice(idx,1)">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </template>
                <div class="s5-av-add-row">
                  <label class="s5-av-add-btn">
                    <input type="file" multiple accept=".rar,.zip,.7z,.pdf,.xlsx,.xls,.docx,.doc,.png,.jpg" style="display:none" @change="(e: Event) => { const files = (e.target as HTMLInputElement).files; if(files) Array.from(files).forEach(f => availableBooking.confirmFiles.push({file:f, displayName: f.name.replace(/\.[^.]+$/,'')})); (e.target as HTMLInputElement).value = '' }">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add file
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Bill of lading -->
        <div class="s5-mc">
          <div class="s5-or-section-hd">Bill of lading</div>
          <div class="s5-or-section-body">
            <div class="s5-or-bl-header">
              <div class="s5-or-bl-header-label">Issue Bill of lading according to:</div>
              <div class="s5-or-bl-tabs">
                <button class="s5-or-bl-tab" :class="{ 's5-or-bl-tab-act': availableBooking.issueAccordingTo === 'Shipper\'s instructions' }" @click="availableBooking.issueAccordingTo = 'Shipper\'s instructions'">Shipper's instructions</button>
                <button class="s5-or-bl-tab" :class="{ 's5-or-bl-tab-act': availableBooking.issueAccordingTo === 'Our instructions below' }" @click="availableBooking.issueAccordingTo = 'Our instructions below'">Our instructions below</button>
              </div>
            </div>
            <div :class="{ 's5-or-bl-opts-disabled': availableBooking.issueAccordingTo === 'Shipper\'s instructions' }">
              <!-- Row 1: Direct MBL -->
              <div class="s5-or-bl-opt-row">
                <div class="s5-or-bl-radio-cell">
                  <label class="s5-or-bl-radio-lbl">
                    <input type="radio" name="av-bl-type" value="MBL" v-model="availableBooking.blMode">
                    <span class="s5-or-bl-radio-dot"></span>
                    Issue direct Master bill of lading (MBL)
                  </label>
                </div>
                <div class="s5-or-bl-badge-cell"><div class="s5-or-bl-badge mbl">MBL:</div></div>
                <div class="s5-or-bl-fields-cell">
                  <div class="s5-or-bl-fields-row">
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Bill Type</div>
                      <select class="s5-or-bk-sel" v-model="availableBooking.mblOnlyType" :disabled="availableBooking.blMode !== 'MBL'">
                        <option>ORIGINAL B/L</option><option>TELEX RELEASE</option><option>SEAWAY B/L</option>
                      </select>
                    </div>
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Place of issue</div>
                      <select class="s5-or-bk-sel" v-model="availableBooking.mblOnlyPlace" :disabled="availableBooking.blMode !== 'MBL'">
                        <option>At origin</option><option>At destination</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Row 2: MBL + HBL -->
              <div class="s5-or-bl-opt-row">
                <div class="s5-or-bl-radio-cell">
                  <label class="s5-or-bl-radio-lbl">
                    <input type="radio" name="av-bl-type" value="MBL_HBL" v-model="availableBooking.blMode">
                    <span class="s5-or-bl-radio-dot"></span>
                    Issue Master bill of lading (MBL) and House bill of lading (HBL)
                  </label>
                </div>
                <div class="s5-or-bl-badge-cell">
                  <div class="s5-or-bl-badge mbl">MBL:</div>
                  <div class="s5-or-bl-badge hbl">HBL:</div>
                </div>
                <div class="s5-or-bl-fields-cell">
                  <div class="s5-or-bl-fields-row">
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Bill Type</div>
                      <select class="s5-or-bk-sel" v-model="availableBooking.mblDualType" :disabled="availableBooking.blMode !== 'MBL_HBL'">
                        <option>ORIGINAL B/L</option><option>TELEX RELEASE</option><option>SEAWAY B/L</option>
                      </select>
                    </div>
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Place of issue</div>
                      <select class="s5-or-bk-sel" v-model="availableBooking.mblDualPlace" :disabled="availableBooking.blMode !== 'MBL_HBL'">
                        <option>At origin</option><option>At destination</option>
                      </select>
                    </div>
                  </div>
                  <div class="s5-or-bl-fields-row">
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Bill Type</div>
                      <select class="s5-or-bk-sel" v-model="availableBooking.hblType" :disabled="availableBooking.blMode !== 'MBL_HBL'">
                        <option>ORIGINAL B/L</option><option>TELEX RELEASE</option><option>SEAWAY B/L</option>
                      </select>
                    </div>
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Bill form of</div>
                      <select class="s5-or-bk-sel" v-model="availableBooking.hblForm" :disabled="availableBooking.blMode !== 'MBL_HBL'">
                        <option>Our company bill's form</option><option>Shoptrans B/L form</option>
                      </select>
                    </div>
                    <div class="s5-or-bk-field-group">
                      <div class="s5-or-bk-fl">Place of issue</div>
                      <select class="s5-or-bk-sel" v-model="availableBooking.hblPlace" :disabled="availableBooking.blMode !== 'MBL_HBL'">
                        <option>At origin</option><option>At destination</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3: Freetime request — REMOVED per reference template -->
        <div class="s5-mc" style="display:none;">
          <div class="s5-or-section-hd">Freetime request</div>
          <div class="s5-or-section-body">
            <div class="s5-or-ft-wrap">
              <div class="s5-or-ft-grid">
                <div class="s5-or-ft-row">
                  <span class="s5-or-ft-label">Free Demurrage (DEM):</span>
                  <div class="s5-or-ft-input-wrap">
                    <button class="s5-or-ft-minus" @click="availableBooking.freeDemurrage = Math.max(0, availableBooking.freeDemurrage - 1)">−</button>
                    <input class="s5-or-ft-inp" type="number" v-model.number="availableBooking.freeDemurrage" min="0">
                    <button class="s5-or-ft-plus" @click="availableBooking.freeDemurrage = availableBooking.freeDemurrage + 1">+</button>
                  </div>
                  <span class="s5-or-ft-unit">days</span>
                </div>
                <div class="s5-or-ft-row">
                  <span class="s5-or-ft-label">Free Detention (DET):</span>
                  <div class="s5-or-ft-input-wrap">
                    <button class="s5-or-ft-minus" @click="availableBooking.freeDetention = Math.max(0, availableBooking.freeDetention - 1)">−</button>
                    <input class="s5-or-ft-inp" type="number" v-model.number="availableBooking.freeDetention" min="0">
                    <button class="s5-or-ft-plus" @click="availableBooking.freeDetention = availableBooking.freeDetention + 1">+</button>
                  </div>
                  <span class="s5-or-ft-unit">days</span>
                </div>
                <div class="s5-or-ft-row">
                  <span class="s5-or-ft-label">Free Combine (DEM &amp; DET):</span>
                  <div class="s5-or-ft-input-wrap">
                    <button class="s5-or-ft-minus" @click="availableBooking.freeCombine = Math.max(0, (availableBooking.freeCombine ?? 0) - 1)">−</button>
                    <input class="s5-or-ft-inp" type="number" :value="availableBooking.freeCombine ?? ''" @input="(e: Event) => { const v = (e.target as HTMLInputElement).value; availableBooking.freeCombine = v === '' ? null : parseInt(v) }" min="0" placeholder="—">
                    <button class="s5-or-ft-plus" @click="availableBooking.freeCombine = (availableBooking.freeCombine ?? 0) + 1">+</button>
                  </div>
                  <span class="s5-or-ft-unit">days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 4: Charge arrangement -->
        <div class="s5-mc">
          <div class="s5-or-section-hd">Charge arrangement</div>
          <div class="s5-or-section-body">
            <div class="s5-or-ca-list">
              <div class="s5-or-ca-row">
                <div class="s5-or-ca-num">1</div>
                <div class="s5-or-ca-name">Ocean Freight</div>
                <div class="s5-or-ca-pp-toggle">
                  <button class="s5-or-ca-pp-opt" :class="{ active: availableBooking.oceanFreightTerms === 'PREPAID' }" @click="setChargeTerms(availableBooking, 'oceanFreightTerms', 'oceanFreightPayer', 'PREPAID')">Prepaid</button>
                  <button class="s5-or-ca-pp-opt" :class="{ active: availableBooking.oceanFreightTerms === 'COLLECT' }" @click="setChargeTerms(availableBooking, 'oceanFreightTerms', 'oceanFreightPayer', 'COLLECT')">Collect</button>
                </div>
                <div class="s5-or-ca-payer-wrap">
                  <span class="s5-or-ca-payer-lbl">Payer:</span>
                  <select class="s5-or-ca-payer-sel" v-model="availableBooking.oceanFreightPayer">
                    <option value="">— Select —</option><option v-if="availableBooking.oceanFreightTerms !== 'COLLECT'">Shipper</option><option v-if="availableBooking.oceanFreightTerms !== 'PREPAID'">Consignee</option><option>Our company</option><option>The 3rd party</option>
                  </select>
                </div>
              </div>
              <div class="s5-or-ca-row">
                <div class="s5-or-ca-num">2</div>
                <div class="s5-or-ca-name">Original Charges</div>
                <div class="s5-or-ca-pp-toggle">
                  <button class="s5-or-ca-pp-opt" :class="{ active: availableBooking.originChargesTerms === 'PREPAID' }" @click="setChargeTerms(availableBooking, 'originChargesTerms', 'originChargesPayer', 'PREPAID')">Prepaid</button>
                  <button class="s5-or-ca-pp-opt" :class="{ active: availableBooking.originChargesTerms === 'COLLECT' }" @click="setChargeTerms(availableBooking, 'originChargesTerms', 'originChargesPayer', 'COLLECT')">Collect</button>
                </div>
                <div class="s5-or-ca-payer-wrap">
                  <span class="s5-or-ca-payer-lbl">Payer:</span>
                  <select class="s5-or-ca-payer-sel" v-model="availableBooking.originChargesPayer">
                    <option value="">— Select —</option><option v-if="availableBooking.originChargesTerms !== 'COLLECT'">Shipper</option><option v-if="availableBooking.originChargesTerms !== 'PREPAID'">Consignee</option><option>Our company</option><option>The 3rd party</option>
                  </select>
                </div>
              </div>
              <div class="s5-or-ca-row">
                <div class="s5-or-ca-num">3</div>
                <div class="s5-or-ca-name">Destination Charges</div>
                <div class="s5-or-ca-pp-toggle">
                  <button class="s5-or-ca-pp-opt" :class="{ active: availableBooking.destChargesTerms === 'PREPAID' }" @click="setChargeTerms(availableBooking, 'destChargesTerms', 'destChargesPayer', 'PREPAID')">Prepaid</button>
                  <button class="s5-or-ca-pp-opt" :class="{ active: availableBooking.destChargesTerms === 'COLLECT' }" @click="setChargeTerms(availableBooking, 'destChargesTerms', 'destChargesPayer', 'COLLECT')">Collect</button>
                </div>
                <div class="s5-or-ca-payer-wrap">
                  <span class="s5-or-ca-payer-lbl">Payer:</span>
                  <select class="s5-or-ca-payer-sel" v-model="availableBooking.destChargesPayer">
                    <option value="">— Select —</option><option v-if="availableBooking.destChargesTerms !== 'COLLECT'">Shipper</option><option v-if="availableBooking.destChargesTerms !== 'PREPAID'">Consignee</option><option>Our company</option><option>The 3rd party</option>
                  </select>
                </div>
              </div>
              <div class="s5-or-ca-row">
                <div class="s5-or-ca-num">4</div>
                <div class="s5-or-ca-name">Handling charge</div>
                <div class="s5-or-ca-pp-toggle">
                  <button class="s5-or-ca-pp-opt" :class="{ active: availableBooking.agentHandlingTerms === 'PREPAID' }" @click="setChargeTerms(availableBooking, 'agentHandlingTerms', 'agentHandlingPayer', 'PREPAID')">Prepaid</button>
                  <button class="s5-or-ca-pp-opt" :class="{ active: availableBooking.agentHandlingTerms === 'COLLECT' }" @click="setChargeTerms(availableBooking, 'agentHandlingTerms', 'agentHandlingPayer', 'COLLECT')">Collect</button>
                </div>
                <div class="s5-or-ca-payer-wrap">
                  <span class="s5-or-ca-payer-lbl">Payer:</span>
                  <select class="s5-or-ca-payer-sel" v-model="availableBooking.agentHandlingPayer">
                    <option value="">— Select —</option><option v-if="availableBooking.agentHandlingTerms !== 'COLLECT'">Shipper</option><option v-if="availableBooking.agentHandlingTerms !== 'PREPAID'">Consignee</option><option>Our company</option><option>The 3rd party</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 5: Remarks -->
        <div class="s5-mc">
          <div class="s5-sd s5-sd-flex">
            <div class="s5-sd-left">
              <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <span class="s5-st">Remarks (if any)</span>
            </div>
          </div>
          <div class="s5-sb"><textarea class="s5-fta" v-model="availableBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
        </div>

        <!-- Bottom actions -->
        <div class="s5-ba">
          <button class="s5-btn" @click="goBackStep5Tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </button>
          <button class="s5-btn s5-btn-next" @click="validateStep5">
            Continue
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>

        </div><!-- end s5-page Available Booking -->

        <!-- ── Place Booking Under Available Service Contract/Quotation STEP 5 ── -->
        <div v-show="activeStep5Tab === 's5-serviceContract'" class="s5-page">

          <!-- Service badge -->
          <div class="s5-stag">
            <span class="s5-stag-icon">📑</span>
            <div class="s5-stag-text">
              <span class="s5-stag-label">Place booking on an available service contract / Quotation number</span>
            </div>
          </div>

          <!-- Card 1: Booking Information -->
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd s5-sd-flex">
              <div class="s5-sd-left">
                <div class="s5-si">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <span class="s5-st">Booking information</span>
              </div>
              <button class="s5-or-change-btn" @click="changeOptionGoToStep2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Change option
              </button>
            </div>
            <div style="padding:16px 24px;display:flex;flex-direction:column;gap:16px;">

              <!-- Row 1: Contract / Quotation checkboxes (radio-style) -->
              <div style="display:flex;flex-direction:column;gap:10px;">

                <!-- Contract number row -->
                <div class="s5-sc-row">
                  <label class="s5-sc-chk-lbl" @click="contractBooking.numberType = contractBooking.numberType === 'contract' ? '' : 'contract'">
                    <div class="s5-sc-chk-box" :class="{ 'on': contractBooking.numberType === 'contract' }">
                      <svg v-if="contractBooking.numberType === 'contract'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span class="s5-sc-chk-txt">It is a contract number</span>
                  </label>
                  <input class="s5-sc-num-inp" type="text" v-model="contractBooking.contractNumber" placeholder="Enter contract number" :disabled="contractBooking.numberType !== 'contract'" :class="{ 'disabled': contractBooking.numberType !== 'contract' }">
                  <div class="s5-or-bk-fl" style="text-align:right;white-space:nowrap;">Date of Expiry:</div>
                  <div class="s5-date-wrap"><EnDatePicker :min-date="minDate" v-model="contractBooking.contractExpiry" input-class="s5-fi" :dynamic-input-class="{ 's5-disabled': contractBooking.numberType !== 'contract' }" :disabled="contractBooking.numberType !== 'contract'" /></div>
                </div>

                <!-- Quotation number row -->
                <div class="s5-sc-row">
                  <label class="s5-sc-chk-lbl" @click="contractBooking.numberType = contractBooking.numberType === 'quotation' ? '' : 'quotation'">
                    <div class="s5-sc-chk-box" :class="{ 'on': contractBooking.numberType === 'quotation' }">
                      <svg v-if="contractBooking.numberType === 'quotation'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span class="s5-sc-chk-txt">It is a quotation number</span>
                  </label>
                  <input class="s5-sc-num-inp" type="text" v-model="contractBooking.quotationNumber" placeholder="Enter quotation number" :disabled="contractBooking.numberType !== 'quotation'" :class="{ 'disabled': contractBooking.numberType !== 'quotation' }">
                  <div class="s5-or-bk-fl" style="text-align:right;white-space:nowrap;">Date of Expiry:</div>
                  <div class="s5-date-wrap"><EnDatePicker :min-date="minDate" v-model="contractBooking.quotationExpiry" input-class="s5-fi" :dynamic-input-class="{ 's5-disabled': contractBooking.numberType !== 'quotation' }" :disabled="contractBooking.numberType !== 'quotation'" /></div>
                </div>

              </div>

              <!-- Divider -->
              <div style="border-top:1px solid #e5e7eb;margin:0 -24px;"></div>

              <!-- Row 2: Shipping line / Vessel name / Voyage number / Departure time -->
              <div class="s5-sc-info-grid">
                <div class="s5-av-bk-field">
                  <div class="s5-or-bk-fl">Coloader</div>
                  <select class="s5-or-bk-sel" v-model="contractBooking.shippingLine">
                    <option value="">Select coloader</option>
                    <option>Ecu Line</option>
                    <option>Charter Link</option>
                    <option>AWS</option>
                    <option>Shipco</option>
                  </select>
                </div>
                <div class="s5-av-bk-field">
                  <div class="s5-or-bk-fl">Vessel name</div>
                  <input class="s5-av-bk-inp" type="text" v-model="contractBooking.vesselName" placeholder="Input vessel name">
                </div>
                <div class="s5-av-bk-field">
                  <div class="s5-or-bk-fl">Voyage number</div>
                  <input class="s5-av-bk-inp" type="text" v-model="contractBooking.voyageNumber" placeholder="Input voyage number">
                </div>
                <div class="s5-av-bk-field">
                  <div class="s5-or-bk-fl">Departure time</div>
                  <div class="s5-date-wrap"><EnDatePicker :min-date="minDate" v-model="contractBooking.departureDate" input-class="s5-fi" /></div>
                </div>
              </div>

              <!-- Row 3: Attach Booking Confirmation -->
              <div class="s5-av-bk-field">
                <div class="s5-or-bk-fl">Attach Booking Confirmation</div>
                <div class="s5-av-chip-zone">
                  <template v-for="(item, idx) in contractBooking.confirmFiles" :key="idx">
                    <div class="s5-bk-chip up">
                      <!-- Tick icon (uploaded) -->
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;pointer-events:none"><polyline points="20 6 9 17 4 12"/></svg>
                      <!-- Editable name input -->
                      <input type="text" class="s5-bk-chip-inp" v-model="item.displayName" @click.stop @keydown.enter="($event.target as HTMLInputElement).blur()" :title="item.file.name" />
                      <!-- Green tick circle -->
                      <span class="s5-bk-tick-circle">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                      <!-- Delete -->
                      <button class="s5-bk-chip-del" @click.stop="contractBooking.confirmFiles.splice(idx,1)">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  </template>
                  <div class="s5-av-add-row">
                    <label class="s5-av-add-btn">
                      <input type="file" multiple accept=".rar,.zip,.7z,.pdf,.xlsx,.xls,.docx,.doc,.png,.jpg" style="display:none" @change="(e: Event) => { const files = (e.target as HTMLInputElement).files; if(files) Array.from(files).forEach(f => contractBooking.confirmFiles.push({file:f, displayName: f.name.replace(/\.[^.]+$/,'')})); (e.target as HTMLInputElement).value = '' }">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add file
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Card 2: Bill of lading -->
          <div class="s5-mc">
            <div class="s5-or-section-hd">Bill of lading</div>
            <div class="s5-or-section-body">
              <div class="s5-or-bl-header">
                <div class="s5-or-bl-header-label">Issue Bill of lading according to:</div>
                <div class="s5-or-bl-tabs">
                  <button class="s5-or-bl-tab" :class="{ 's5-or-bl-tab-act': contractBooking.issueAccordingTo === 'Shipper\'s instructions' }" @click="contractBooking.issueAccordingTo = 'Shipper\'s instructions'">Shipper's instructions</button>
                  <button class="s5-or-bl-tab" :class="{ 's5-or-bl-tab-act': contractBooking.issueAccordingTo === 'Our instructions below' }" @click="contractBooking.issueAccordingTo = 'Our instructions below'">Our instructions below</button>
                </div>
              </div>
              <div :class="{ 's5-or-bl-opts-disabled': contractBooking.issueAccordingTo === 'Shipper\'s instructions' }">
                <div class="s5-or-bl-opt-row">
                  <div class="s5-or-bl-radio-cell">
                    <label class="s5-or-bl-radio-lbl">
                      <input type="radio" name="sc-bl-type" value="MBL" v-model="contractBooking.blMode">
                      <span class="s5-or-bl-radio-dot"></span>
                      Issue direct Master bill of lading (MBL)
                    </label>
                  </div>
                  <div class="s5-or-bl-badge-cell"><div class="s5-or-bl-badge mbl">MBL:</div></div>
                  <div class="s5-or-bl-fields-cell">
                    <div class="s5-or-bl-fields-row">
                      <div class="s5-or-bk-field-group">
                        <div class="s5-or-bk-fl">Bill Type</div>
                        <select class="s5-or-bk-sel" v-model="contractBooking.mblOnlyType" :disabled="contractBooking.blMode !== 'MBL'">
                          <option>ORIGINAL B/L</option><option>TELEX RELEASE</option><option>SEAWAY B/L</option>
                        </select>
                      </div>
                      <div class="s5-or-bk-field-group">
                        <div class="s5-or-bk-fl">Place of issue</div>
                        <select class="s5-or-bk-sel" v-model="contractBooking.mblOnlyPlace" :disabled="contractBooking.blMode !== 'MBL'">
                          <option>At origin</option><option>At destination</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="s5-or-bl-opt-row">
                  <div class="s5-or-bl-radio-cell">
                    <label class="s5-or-bl-radio-lbl">
                      <input type="radio" name="sc-bl-type" value="MBL_HBL" v-model="contractBooking.blMode">
                      <span class="s5-or-bl-radio-dot"></span>
                      Issue Master bill of lading (MBL) and House bill of lading (HBL)
                    </label>
                  </div>
                  <div class="s5-or-bl-badge-cell">
                    <div class="s5-or-bl-badge mbl">MBL:</div>
                    <div class="s5-or-bl-badge hbl">HBL:</div>
                  </div>
                  <div class="s5-or-bl-fields-cell">
                    <div class="s5-or-bl-fields-row">
                      <div class="s5-or-bk-field-group">
                        <div class="s5-or-bk-fl">Bill Type</div>
                        <select class="s5-or-bk-sel" v-model="contractBooking.mblDualType" :disabled="contractBooking.blMode !== 'MBL_HBL'">
                          <option>ORIGINAL B/L</option><option>TELEX RELEASE</option><option>SEAWAY B/L</option>
                        </select>
                      </div>
                      <div class="s5-or-bk-field-group">
                        <div class="s5-or-bk-fl">Place of issue</div>
                        <select class="s5-or-bk-sel" v-model="contractBooking.mblDualPlace" :disabled="contractBooking.blMode !== 'MBL_HBL'">
                          <option>At origin</option><option>At destination</option>
                        </select>
                      </div>
                    </div>
                    <div class="s5-or-bl-fields-row">
                      <div class="s5-or-bk-field-group">
                        <div class="s5-or-bk-fl">Bill Type</div>
                        <select class="s5-or-bk-sel" v-model="contractBooking.hblType" :disabled="contractBooking.blMode !== 'MBL_HBL'">
                          <option>ORIGINAL B/L</option><option>TELEX RELEASE</option><option>SEAWAY B/L</option>
                        </select>
                      </div>
                      <div class="s5-or-bk-field-group">
                        <div class="s5-or-bk-fl">Bill form of</div>
                        <select class="s5-or-bk-sel" v-model="contractBooking.hblForm" :disabled="contractBooking.blMode !== 'MBL_HBL'">
                          <option>Our company bill's form</option><option>Shoptrans B/L form</option>
                        </select>
                      </div>
                      <div class="s5-or-bk-field-group">
                        <div class="s5-or-bk-fl">Place of issue</div>
                        <select class="s5-or-bk-sel" v-model="contractBooking.hblPlace" :disabled="contractBooking.blMode !== 'MBL_HBL'">
                          <option>At origin</option><option>At destination</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 3: Freetime request — REMOVED per reference template -->
          <div class="s5-mc" style="display:none;">
            <div class="s5-or-section-hd">Freetime request</div>
            <div class="s5-or-section-body">
              <div class="s5-or-ft-wrap">
                <div class="s5-or-ft-grid">
                  <div class="s5-or-ft-row">
                    <span class="s5-or-ft-label">Free Demurrage (DEM):</span>
                    <div class="s5-or-ft-input-wrap">
                      <button class="s5-or-ft-minus" @click="contractBooking.freeDemurrage = Math.max(0, contractBooking.freeDemurrage - 1)">−</button>
                      <input class="s5-or-ft-inp" type="number" v-model.number="contractBooking.freeDemurrage" min="0">
                      <button class="s5-or-ft-plus" @click="contractBooking.freeDemurrage++">+</button>
                    </div>
                    <span class="s5-or-ft-unit">days</span>
                  </div>
                  <div class="s5-or-ft-row">
                    <span class="s5-or-ft-label">Free Detention (DET):</span>
                    <div class="s5-or-ft-input-wrap">
                      <button class="s5-or-ft-minus" @click="contractBooking.freeDetention = Math.max(0, contractBooking.freeDetention - 1)">−</button>
                      <input class="s5-or-ft-inp" type="number" v-model.number="contractBooking.freeDetention" min="0">
                      <button class="s5-or-ft-plus" @click="contractBooking.freeDetention++">+</button>
                    </div>
                    <span class="s5-or-ft-unit">days</span>
                  </div>
                  <div class="s5-or-ft-row">
                    <span class="s5-or-ft-label">Free Combine (DEM &amp; DET):</span>
                    <div class="s5-or-ft-input-wrap">
                      <button class="s5-or-ft-minus" @click="contractBooking.freeCombine = Math.max(0, (contractBooking.freeCombine ?? 0) - 1)">−</button>
                      <input class="s5-or-ft-inp" type="number" :value="contractBooking.freeCombine ?? ''" @input="(e: Event) => { const v = (e.target as HTMLInputElement).value; contractBooking.freeCombine = v === '' ? null : parseInt(v) }" min="0" placeholder="—">
                      <button class="s5-or-ft-plus" @click="contractBooking.freeCombine = (contractBooking.freeCombine ?? 0) + 1">+</button>
                    </div>
                    <span class="s5-or-ft-unit">days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 4: Charge arrangement -->
          <div class="s5-mc">
            <div class="s5-or-section-hd">Charge arrangement</div>
            <div class="s5-or-section-body">
              <div class="s5-or-ca-list">
                <div class="s5-or-ca-row">
                  <div class="s5-or-ca-num">1</div>
                  <div class="s5-or-ca-name">Ocean Freight</div>
                  <div class="s5-or-ca-pp-toggle">
                    <button class="s5-or-ca-pp-opt" :class="{ active: contractBooking.oceanFreightTerms === 'PREPAID' }" @click="setChargeTerms(contractBooking, 'oceanFreightTerms', 'oceanFreightPayer', 'PREPAID')">Prepaid</button>
                    <button class="s5-or-ca-pp-opt" :class="{ active: contractBooking.oceanFreightTerms === 'COLLECT' }" @click="setChargeTerms(contractBooking, 'oceanFreightTerms', 'oceanFreightPayer', 'COLLECT')">Collect</button>
                  </div>
                  <div class="s5-or-ca-payer-wrap">
                    <span class="s5-or-ca-payer-lbl">Payer:</span>
                    <select class="s5-or-ca-payer-sel" v-model="contractBooking.oceanFreightPayer">
                      <option value="">— Select —</option><option v-if="contractBooking.oceanFreightTerms !== 'COLLECT'">Shipper</option><option v-if="contractBooking.oceanFreightTerms !== 'PREPAID'">Consignee</option><option>Our company</option><option>The 3rd party</option>
                    </select>
                  </div>
                </div>
                <div class="s5-or-ca-row">
                  <div class="s5-or-ca-num">2</div>
                  <div class="s5-or-ca-name">Original Charges</div>
                  <div class="s5-or-ca-pp-toggle">
                    <button class="s5-or-ca-pp-opt" :class="{ active: contractBooking.originChargesTerms === 'PREPAID' }" @click="setChargeTerms(contractBooking, 'originChargesTerms', 'originChargesPayer', 'PREPAID')">Prepaid</button>
                    <button class="s5-or-ca-pp-opt" :class="{ active: contractBooking.originChargesTerms === 'COLLECT' }" @click="setChargeTerms(contractBooking, 'originChargesTerms', 'originChargesPayer', 'COLLECT')">Collect</button>
                  </div>
                  <div class="s5-or-ca-payer-wrap">
                    <span class="s5-or-ca-payer-lbl">Payer:</span>
                    <select class="s5-or-ca-payer-sel" v-model="contractBooking.originChargesPayer">
                      <option value="">— Select —</option><option v-if="contractBooking.originChargesTerms !== 'COLLECT'">Shipper</option><option v-if="contractBooking.originChargesTerms !== 'PREPAID'">Consignee</option><option>Our company</option><option>The 3rd party</option>
                    </select>
                  </div>
                </div>
                <div class="s5-or-ca-row">
                  <div class="s5-or-ca-num">3</div>
                  <div class="s5-or-ca-name">Destination Charges</div>
                  <div class="s5-or-ca-pp-toggle">
                    <button class="s5-or-ca-pp-opt" :class="{ active: contractBooking.destChargesTerms === 'PREPAID' }" @click="setChargeTerms(contractBooking, 'destChargesTerms', 'destChargesPayer', 'PREPAID')">Prepaid</button>
                    <button class="s5-or-ca-pp-opt" :class="{ active: contractBooking.destChargesTerms === 'COLLECT' }" @click="setChargeTerms(contractBooking, 'destChargesTerms', 'destChargesPayer', 'COLLECT')">Collect</button>
                  </div>
                  <div class="s5-or-ca-payer-wrap">
                    <span class="s5-or-ca-payer-lbl">Payer:</span>
                    <select class="s5-or-ca-payer-sel" v-model="contractBooking.destChargesPayer">
                      <option value="">— Select —</option><option v-if="contractBooking.destChargesTerms !== 'COLLECT'">Shipper</option><option v-if="contractBooking.destChargesTerms !== 'PREPAID'">Consignee</option><option>Our company</option><option>The 3rd party</option>
                    </select>
                  </div>
                </div>
                <div class="s5-or-ca-row">
                  <div class="s5-or-ca-num">4</div>
                  <div class="s5-or-ca-name">Handling charge</div>
                  <div class="s5-or-ca-pp-toggle">
                    <button class="s5-or-ca-pp-opt" :class="{ active: contractBooking.agentHandlingTerms === 'PREPAID' }" @click="setChargeTerms(contractBooking, 'agentHandlingTerms', 'agentHandlingPayer', 'PREPAID')">Prepaid</button>
                    <button class="s5-or-ca-pp-opt" :class="{ active: contractBooking.agentHandlingTerms === 'COLLECT' }" @click="setChargeTerms(contractBooking, 'agentHandlingTerms', 'agentHandlingPayer', 'COLLECT')">Collect</button>
                  </div>
                  <div class="s5-or-ca-payer-wrap">
                    <span class="s5-or-ca-payer-lbl">Payer:</span>
                    <select class="s5-or-ca-payer-sel" v-model="contractBooking.agentHandlingPayer">
                      <option value="">— Select —</option><option v-if="contractBooking.agentHandlingTerms !== 'COLLECT'">Shipper</option><option v-if="contractBooking.agentHandlingTerms !== 'PREPAID'">Consignee</option><option>Our company</option><option>The 3rd party</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 5: Remarks -->
          <div class="s5-mc">
            <div class="s5-sd s5-sd-flex">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <span class="s5-st">Remarks (if any)</span>
              </div>
            </div>
            <div class="s5-sb"><textarea class="s5-fta" v-model="contractBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
          </div>

          <!-- Bottom actions -->
          <div class="s5-ba">
            <button class="s5-btn" @click="goBackStep5Tab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <button class="s5-btn s5-btn-next" @click="validateStep5">
              Continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

        </div><!-- end s5-page Service Contract/Quotation -->

        <!-- ── Switch Bill of Lading STEP 5 ── -->
        <div v-show="activeStep5Tab === 's5-switchBill'" class="s5-page">

          <!-- Service badge -->
          <div class="s5-stag">
            <span class="s5-stag-icon">🔄</span>
            <div class="s5-stag-text">
              <span class="s5-stag-label">Switch Bill of Lading</span>
            </div>
          </div>

          <!-- Card 1: Master B/L Information (only when COMBINED with handleUnderAvailable) -->
          <div class="s5-mc" style="margin-bottom:16px" v-if="services.sea.selected.includes('handleUnderAvailable')">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                <span class="s5-st">Master B/L information</span>
              </div>
            </div>
            <div style="padding:20px 24px;">
              <div class="s5-sbl-mbl-grid">
                <div class="s5-av-bk-field">
                  <div class="s5-or-bk-fl">Coloader</div>
                  <select class="s5-or-bk-sel" v-model="switchBillBooking.coloader">
                    <option value="">Select coloader</option>
                    <option>Ecu Line</option><option>Charter Link</option><option>AWS</option>
                    <option>Shipco</option>
                  </select>
                </div>
                <div class="s5-av-bk-field">
                  <div class="s5-or-bk-fl">Master B/L number</div>
                  <input class="s5-sbl-inp" type="text" v-model="switchBillBooking.mblNumber" placeholder="Input Master B/L number" style="text-transform:uppercase">
                </div>
                <div class="s5-av-bk-field">
                  <div class="s5-or-bk-fl">Vessel name</div>
                  <input class="s5-sbl-inp" type="text" v-model="switchBillBooking.vesselName" placeholder="Input vessel name">
                </div>
                <div class="s5-av-bk-field">
                  <div class="s5-or-bk-fl">Voyage number</div>
                  <input class="s5-sbl-inp" type="text" v-model="switchBillBooking.voyageNumber" placeholder="Input voyage number" style="text-transform:uppercase">
                </div>
                <div class="s5-av-bk-field">
                  <div class="s5-or-bk-fl">Departure time</div>
                  <div class="s5-date-wrap"><EnDatePicker :min-date="minDate" v-model="switchBillBooking.departureDate" input-class="s5-fi" /></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Initial B/L Information (only when COMBINED with handleUnderAvailable) -->
          <div class="s5-mc" style="margin-bottom:16px" v-if="services.sea.selected.includes('handleUnderAvailable')">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="10 9 9 9 8 9"/><line x1="12" y1="13" x2="8" y2="13"/><line x1="12" y1="17" x2="8" y2="17"/></svg></div>
                <span class="s5-st">Initial B/L information</span>
              </div>
            </div>
            <div style="padding:20px 24px;">
              <div class="s5-sbl-ibl-grid">
                <div class="s5-or-bk-fl">Place of first B/L issuance</div>
                <div class="s5-or-bk-fl">B/L type</div>
                <div class="s5-or-bk-fl">Upload B/L</div>
                <select class="s5-or-bk-sel" v-model="switchBillBooking.iblCountry">
                  <option value="">Select country</option>
                  <option>Vietnam</option><option>China</option><option>South Korea</option>
                  <option>Japan</option><option>Singapore</option><option>Thailand</option>
                  <option>Malaysia</option><option>United States</option><option>Germany</option>
                  <option>Netherlands</option>
                </select>
                <select class="s5-or-bk-sel" v-model="switchBillBooking.iblType">
                  <option value="">— Select —</option>
                  <option>ORIGINAL B/L</option><option>TELEX RELEASE</option><option>SEAWAY B/L</option>
                </select>
                <div style="display:flex;flex-direction:column;gap:6px;">
                  <template v-for="(f, i) in switchBillBooking.iblFiles" :key="i">
                    <div class="s5-sbl-frow">
                      <span style="font-size:18px">{{ f.name.endsWith('.pdf') ? '📄' : f.name.match(/xlsx?$/i) ? '📊' : f.name.match(/docx?$/i) ? '📝' : '📎' }}</span>
                      <div class="s5-sbl-fname">{{ f.name }}</div>
                      <button class="s5-sbl-fdel" @click="switchBillBooking.iblFiles.splice(i,1)">×</button>
                    </div>
                  </template>
                  <label class="s5-av-add-btn" style="height:38px;box-sizing:border-box;">
                    <input type="file" style="display:none" accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" @change="(e: Event) => { const f = (e.target as HTMLInputElement).files; if(f) Array.from(f).forEach(x => switchBillBooking.iblFiles.push(x)); (e.target as HTMLInputElement).value='' }">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add file
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 3: Switch Bill of Lading -->
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <span class="s5-st">Switch Bill of Lading</span>
              </div>
            </div>
            <div style="padding:24px 28px;display:flex;flex-direction:column;gap:20px;">

              <!-- Provide Now / Later pills (only standalone / CÓ DÙNG mode) -->
              <div v-if="!services.sea.selected.includes('handleUnderAvailable')" class="s5-sbl-provide-pills">
                <button class="s5-sbl-provide-pill" :class="{ selected: switchBillBooking.provideMode === 'now' }" @click="switchBillBooking.provideMode = 'now'">
                  <span class="s5-sbl-provide-dot"></span>Provide now
                </button>
                <button class="s5-sbl-provide-pill" :class="{ selected: switchBillBooking.provideMode === 'later', 'later': switchBillBooking.provideMode === 'later' }" @click="switchBillBooking.provideMode = 'later'">
                  <span class="s5-sbl-provide-dot"></span>Provide later
                </button>
              </div>

              <!-- Blockable content area -->
              <div :class="{ 's5-sbl-blocked': !services.sea.selected.includes('handleUnderAvailable') && switchBillBooking.provideMode === 'later' }">

                <!-- Document type selection -->
                <div>
                  <div class="s5-sbl-label" style="margin-bottom:10px">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Document type
                  </div>
                  <div class="s5-sbl-doctype-grid">
                    <div class="s5-sbl-doctype-card" :class="{ selected: switchBillBooking.docType === 'swbl' }" @click="switchBillBooking.docType = 'swbl'; switchBillBooking.uploadVisible = true">
                      <span class="s5-sbl-doctype-radio" :class="{ selected: switchBillBooking.docType === 'swbl' }"></span>
                      <div class="s5-sbl-doctype-body">
                        <div class="s5-sbl-doctype-title">This is the Switch B/L</div>
                        <div class="s5-sbl-doctype-hint">Attach the issued switched bill of lading</div>
                      </div>
                    </div>
                    <div class="s5-sbl-doctype-card" :class="{ selected: switchBillBooking.docType === 'si' }" @click="switchBillBooking.docType = 'si'; switchBillBooking.uploadVisible = true">
                      <span class="s5-sbl-doctype-radio" :class="{ selected: switchBillBooking.docType === 'si' }"></span>
                      <div class="s5-sbl-doctype-body">
                        <div class="s5-sbl-doctype-title">SI for Switch Bill issuance</div>
                        <div class="s5-sbl-doctype-hint">Attach the shipping instruction for Switch B/L</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- File upload (visible after type selected) -->
                <div v-if="switchBillBooking.uploadVisible" style="display:flex;flex-direction:column;gap:0;margin-top:8px;">
                  <div class="s5-sbl-label" style="margin-bottom:10px;">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {{ switchBillBooking.docType === 'swbl' ? 'Switch B/L attachments' : 'SI attachments' }}
                  </div>
                  <div style="display:flex;flex-direction:column;gap:7px;margin-bottom:10px;">
                    <template v-for="(item, idx) in switchBillBooking.sblFiles" :key="idx">
                      <div class="s5-sbl-frow" style="border-radius:9px 9px 0 0;border-bottom:none;">
                        <span style="font-size:20px">{{ item.file.name.endsWith('.pdf') ? '📄' : item.file.name.match(/xlsx?$/i) ? '📊' : item.file.name.match(/docx?$/i) ? '📝' : '📎' }}</span>
                        <div class="s5-sbl-frow-info">
                          <div class="s5-frn-t">
                            <button class="s5-fre" @click.stop="sblEditingIdx = sblEditingIdx === idx ? -1 : idx" type="button">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <input type="text" v-model="item.name" :readonly="sblEditingIdx !== idx" :class="{ editing: sblEditingIdx === idx }" @click.stop @blur="sblEditingIdx = -1" @keydown.enter="($event.target as HTMLInputElement).blur()" style="flex:1;min-width:0;" />
                          </div>
                          <div style="font-size:10px;color:#9ca3af;">{{ (item.file.size / 1024).toFixed(1) }} KB</div>
                        </div>
                        <div style="display:flex;gap:6px;flex-shrink:0;">
                          <button class="s5-sbl-fbtn" @click="switchBillBooking.sblFiles.splice(idx,1)" style="border-color:#fecaca;color:#dc2626;">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          </button>
                        </div>
                      </div>
                      <!-- Bill form of row -->
                      <div class="s5-sbl-bf-row">
                        <div class="s5-sbl-label" style="margin:0;white-space:nowrap;flex-shrink:0;">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/></svg>
                          Bill form of
                        </div>
                        <select class="s5-or-bk-sel" v-model="item.billForm" style="max-width:240px;">
                          <option value="">— Select —</option>
                          <option>Shoptrans B/L form</option><option>Our own B/L form</option>
                        </select>
                      </div>
                    </template>
                  </div>
                  <label class="s5-av-add-btn">
                    <input type="file" style="display:none" accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" @change="(e: Event) => { const ft = (e.target as HTMLInputElement).files; if(ft) Array.from(ft).forEach(f => switchBillBooking.sblFiles.push({ file: f, name: f.name.replace(/\.[^.]+$/,''), billForm: '' })); (e.target as HTMLInputElement).value='' }">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add file
                  </label>
                </div>

              </div><!-- /blockable area -->

              <!-- Provide Later note -->
              <div v-if="!services.sea.selected.includes('handleUnderAvailable') && switchBillBooking.provideMode === 'later'" class="s5-sbl-later-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                File will be provided later. You can attach it at any time before submission.
              </div>

            </div>
          </div>

          <!-- Card 4: Remarks -->
          <div class="s5-mc">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <span class="s5-st">Remarks (if any)</span>
              </div>
            </div>
            <div class="s5-sb"><textarea class="s5-fta" v-model="switchBillBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
          </div>

          <!-- Bottom actions -->
          <div class="s5-ba">
            <button class="s5-btn" @click="goBackStep5Tab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <button class="s5-btn s5-btn-next" @click="validateStep5">
              Continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

        </div><!-- end s5-page Switch B/L -->

        <!-- ══ Full DAP STEP 5 ══ -->
        <div v-show="activeStep5Tab === 's5-dest-dap'" class="s5-page">

          <!-- Service badge -->
          <div class="s5-stag">
            <span class="s5-stag-icon">📦</span>
            <div class="s5-stag-text">
              <span class="s5-stag-label">Full DAP service</span>
              <span class="s5-stag-desc">From CFS warehouse to consignee's door (customs clearance excluded)</span>
            </div>
          </div>

          <!-- ── BILL ISSUANCE INSTRUCTION (KO DÙNG SHOPTRANS only) ── -->
          <template v-if="services.sea.selected.includes('handleUnderAvailable')">
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                <span class="s5-st">Bill Issuance Instruction</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">
              <div style="display:flex;gap:10px;">
                <div class="s5-uo" :class="{ 's5-uo-act': dapBooking.blMode === 'master' }" @click="dapBooking.blMode = 'master'" style="flex:1;">
                  <span class="s5-uor"></span>
                  <div class="s5-uo-body">
                    <span class="s5-uot">Only Master B/L</span>
                    <span class="s5-uoh">Issue Master B/L only</span>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/></svg>
                </div>
                <div class="s5-uo" :class="{ 's5-uo-act': dapBooking.blMode === 'house' }" @click="dapBooking.blMode = 'house'" style="flex:1;">
                  <span class="s5-uor"></span>
                  <div class="s5-uo-body">
                    <span class="s5-uot">Master B/L and House B/L</span>
                    <span class="s5-uoh">Issue both Master and House B/L</span>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/><rect x="7" y="7" width="14" height="14" rx="2" style="fill:none;"/></svg>
                </div>
              </div>
            </div></div>
          </div>
          </template><!-- end Bill Issuance (KO DÙNG) -->

          <!-- ── DELIVERY ARRANGEMENT ── -->
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 12 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div>
                <span class="s5-st">Delivery Arrangement</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">

              <!-- Same as consignee toggle -->
              <div class="s5-sar" :class="{ 's5-sar-act': dapBooking.sameAsConsignee }" @click="dapBooking.sameAsConsignee = !dapBooking.sameAsConsignee">
                <span class="s5-sc"></span>
                <span class="s5-sal">SAME AS CONSIGNEE</span>
              </div>

              <div class="s5-ff">
                <span class="s5-fl">Receiving company <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('dap.receivingCompany') }" v-model="dapBooking.receivingCompany" :disabled="dapBooking.sameAsConsignee" @input="step5Errors.delete('dap.receivingCompany')" placeholder="Enter company name" />
              </div>

              <div class="s5-row-addr-zip">
                <div class="s5-ff">
                  <span class="s5-fl">Company address <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('dap.companyAddress') }" v-model="dapBooking.companyAddress" :disabled="dapBooking.sameAsConsignee" @input="step5Errors.delete('dap.companyAddress')" placeholder="Full delivery address including city, state, country" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Zip code <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('dap.zipCode') }" v-model="dapBooking.zipCode" :disabled="dapBooking.sameAsConsignee" @input="step5Errors.delete('dap.zipCode')" placeholder="e.g. 700000" maxlength="10" />
                </div>
              </div>

              <div class="s5-row-pic">
                <div class="s5-ff">
                  <span class="s5-fl">Title</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="dapBooking.picTitle" :disabled="dapBooking.sameAsConsignee">
                    <option>Mr.</option><option>Mrs.</option><option>Ms.</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">PIC name <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('dap.picName') }" v-model="dapBooking.picName" :disabled="dapBooking.sameAsConsignee" @input="step5Errors.delete('dap.picName')" placeholder="Contact person in charge" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Email <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('dap.email') }" v-model="dapBooking.email" :disabled="dapBooking.sameAsConsignee" @input="step5Errors.delete('dap.email')" placeholder="email@company.com" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Phone <span class="s5-rq">*</span></span>
                  <input type="tel" class="s5-fi" :class="{ 's5-inv': step5Errors.has('dap.phone') }" v-model="dapBooking.phone" :disabled="dapBooking.sameAsConsignee" @input="step5Errors.delete('dap.phone')" placeholder="e.g. +84 28 1234 567" maxlength="18" />
                </div>
              </div>

              <div class="s5-row-date">
                <div class="s5-ff">
                  <span class="s5-fl">Delivery date <span class="s5-rq">*</span></span>
                  <div class="s5-date-wrap"><EnDatePicker :min-date="minDate" v-model="dapBooking.deliveryDate" input-class="s5-fi" :dynamic-input-class="{ 's5-inv': step5Errors.has('dap.deliveryDate') }" @change="step5Errors.delete('dap.deliveryDate')" /></div>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Delivery time</span>
                  <div class="s5-date-wrap">
                    <EnTimePicker v-model="dapBooking.deliveryTime" />
                  </div>
                </div>
              </div>

              <!-- Confirm delivery location not restricted -->
              <div class="s5-cr" :class="{ 's5-cr-act': dapBooking.locationNotRestricted }" @click="dapBooking.locationNotRestricted = !dapBooking.locationNotRestricted">
                <span class="s5-crc"></span>
                <span class="s5-crt">
                  Confirm the delivery location is not restricted
                  <span class="s5-tip-wrap">
                    <span class="s5-tip-i">i</span>
                    <span class="s5-tip-box">Please ensure the delivery address is not located on a road restricted to container trucks or heavy vehicles.</span>
                  </span>
                </span>
              </div>

              <!-- Cargo Release Instruction -->
              <div>
                <div class="s5-fl" style="margin-bottom:8px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="1"/><circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/></svg>
                  Cargo Release Instruction
                </div>
                <div style="display:flex;gap:10px;">
                  <div class="s5-uo" :class="{ 's5-uo-act': dapBooking.cargoRelease === 'immediate' }" @click="dapBooking.cargoRelease = 'immediate'" style="flex:1;">
                    <span class="s5-uor"></span>
                    <div class="s5-uo-body">
                      <span class="s5-uot">Immediate Release</span>
                      <span class="s5-uoh">Goods released right after clearance</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div class="s5-uo" :class="dapBooking.cargoRelease === 'hold' ? 's5-uo-act-red' : ''" @click="dapBooking.cargoRelease = 'hold'" style="flex:1;">
                    <span class="s5-uor"></span>
                    <div class="s5-uo-body">
                      <span class="s5-uot">Hold for Confirmation</span>
                      <span class="s5-uoh">Await your approval before releasing</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
              </div>

            </div></div>
          </div>

          <!-- ── ARRIVAL INSTRUCTION (KO DÙNG SHOPTRANS only) ── -->
          <template v-if="services.sea.selected.includes('handleUnderAvailable')">
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6-.5 1.2-1 2.5-1 2.5 0 2.5 2 5 2 1.3 0 1.9-.5 2.5-1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 1v4"/><path d="M12 9v3"/></svg></div>
                <span class="s5-st">Arrival Instruction</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">
              <!-- Row 1: Coloader / B/L number / Vessel name / Voyage number / Est. Arrival time -->
              <div style="display:grid;grid-template-columns:140px 1fr 1.4fr 1.2fr 160px;gap:10px;align-items:end;">
                <div class="s5-ff">
                  <span class="s5-fl">Coloader</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="dapBooking.arrShippingLine">
                    <option value="">Select coloader</option>
                    <option>Ecu Line</option><option>Charter Link</option><option>AWS</option>
                    <option>Shipco</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">B/L number{{ dapBooking.blMode === 'house' ? ' (Master)' : '' }}</span>
                  <input type="text" class="s5-fi" v-model="dapBooking.arrBlNumber" placeholder="Input B/L number" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Vessel name</span>
                  <input type="text" class="s5-fi" v-model="dapBooking.arrVesselName" placeholder="Input vessel name" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Voyage number</span>
                  <input type="text" class="s5-fi" v-model="dapBooking.arrVoyageNumber" placeholder="Input voyage number" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Es. Arrival time</span>
                  <div class="s5-date-wrap"><EnDatePicker :min-date="minDate" v-model="dapBooking.arrEstArrival" input-class="s5-fi" /></div>
                </div>
              </div>
              <!-- Row 2: Destination charges / Payment party -->
              <div style="display:grid;grid-template-columns:160px 280px 1fr;gap:10px;align-items:start;">
                <div class="s5-ff">
                  <span class="s5-fl">Destination charges</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="dapBooking.arrDestCharges" style="font-size:11px;">
                    <option>PREPAID / COLLECT</option><option>PREPAID</option><option>COLLECT</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Payment party</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="dapBooking.arrPaymentParty">
                    <option>Shoptrans pays on our behalf</option>
                    <option>Consignee shall pay the carrier directly</option>
                    <template v-if="dapBooking.blMode === 'house'"><option>Shoptrans pays on consignee's behalf</option></template>
                  </select>
                </div>
                <!-- Freetime application — REMOVED for KO DÙNG -->
                <div style="display:none;"></div>
              </div>
            </div></div>
          </div>
          </template><!-- end Arrival Instruction (KO DÙNG) -->

          <!-- ── ATTACHMENTS (KO DÙNG SHOPTRANS only) ── -->
          <div class="s5-mc" style="margin-bottom:16px" v-if="services.sea.selected.includes('handleUnderAvailable')">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></div>
                <span class="s5-st">Attachments</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">

              <!-- Upload mode -->
              <div class="s5-ut">
                <div class="s5-uo" :class="{ act: dapBooking.uploadMode === 'compressed' }" @click="dapBooking.uploadMode = 'compressed'">
                  <span class="s5-uor"></span>
                  <div class="s5-uo-body">
                    <span class="s5-uot">All in one compressed file</span>
                    <span class="s5-uoh">.rar, .zip, .7z</span>
                  </div>
                </div>
                <div class="s5-uo" :class="{ act: dapBooking.uploadMode === 'separate' }" @click="dapBooking.uploadMode = 'separate'">
                  <span class="s5-uor"></span>
                  <div class="s5-uo-body">
                    <span class="s5-uot">Upload each separately</span>
                    <span class="s5-uoh">PDF, XLSX, DOCX</span>
                  </div>
                </div>
              </div>

              <!-- File upload zone — Compressed mode -->
              <div v-if="dapBooking.uploadMode === 'compressed'" class="s5-upload-zone">
                <div v-for="(row, ri) in dapCompressedRows" :key="'dap-c-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerDapUpload('compressed', ri)">
                  <span class="s5-fri">📦</span>
                  <div class="s5-frn">
                    <div class="s5-frn-t">
                      <button class="s5-fre" @click.stop="startEditDapRowName('compressed', ri)" type="button">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                      </button>
                      <input type="text" :value="row.name" :readonly="dapEditingRow !== 'c-'+ri" :class="{ editing: dapEditingRow === 'c-'+ri }" @click.stop @blur="finishEditDapRowName('compressed', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                    </div>
                    <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                  </div>
                  <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                  <button v-if="!row.required" class="s5-frx" @click.stop="removeDapRow('compressed', ri)" type="button">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <input :ref="(el: any) => { if(el) dapFileInputRefs['c-'+ri] = el }" type="file" style="display:none" accept=".rar,.zip,.7z" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                </div>
              </div>

              <!-- File upload zone — Separate mode -->
              <div v-else class="s5-upload-zone">
                <div v-for="(row, ri) in dapSeparateRows" :key="'dap-s-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerDapUpload('separate', ri)">
                  <span class="s5-fri">{{ row.icon || '📄' }}</span>
                  <div class="s5-frn">
                    <div class="s5-frn-t">
                      <button class="s5-fre" @click.stop="startEditDapRowName('separate', ri)" type="button">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                      </button>
                      <input type="text" :value="row.name" :readonly="dapEditingRow !== 's-'+ri" :class="{ editing: dapEditingRow === 's-'+ri }" @click.stop @blur="finishEditDapRowName('separate', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                    </div>
                    <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                  </div>
                  <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                  <button v-if="!row.required" class="s5-frx" @click.stop="removeDapRow('separate', ri)" type="button">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <input :ref="(el: any) => { if(el) dapFileInputRefs['s-'+ri] = el }" type="file" style="display:none" accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                </div>
                <button class="s5-afb" @click="addDapRow('separate')" type="button">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add more
                </button>
              </div>

            </div></div>
          </div>


          <!-- ── REMARKS ── -->
          <div class="s5-mc">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <span class="s5-st">Remarks (if any)</span>
              </div>
            </div>
            <div class="s5-sb"><textarea class="s5-fta" v-model="dapBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
          </div>

          <!-- Bottom actions -->
          <div class="s5-ba">
            <button class="s5-btn" @click="goBackStep5Tab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <button class="s5-btn s5-btn-next" @click="validateStep5">
              Continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

        </div><!-- end s5-page Full DAP -->

        <!-- ══ Full DDU (AT DESTINATION) STEP 5 ══ -->
        <div v-show="activeStep5Tab === 's5-dest-ddu'" class="s5-page">


          <!-- Service badge -->
          <div class="s5-stag">
            <span class="s5-stag-icon">📦</span>
            <div class="s5-stag-text">
              <span class="s5-stag-label">Full DDU service</span>
              <span class="s5-stag-desc">From CFS warehouse to consignee's door (import duty excluded)</span>
            </div>
          </div>

          <!-- ── BILL ISSUANCE INSTRUCTION (KO DÙNG SHOPTRANS only) ── -->
          <template v-if="services.sea.selected.includes('handleUnderAvailable')">
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                <span class="s5-st">Bill Issuance Instruction</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">
              <div style="display:flex;gap:10px;">
                <div class="s5-uo" :class="{ 's5-uo-act': dduBooking.blMode === 'master' }" @click="dduBooking.blMode = 'master'" style="flex:1;">
                  <span class="s5-uor"></span>
                  <div class="s5-uo-body">
                    <span class="s5-uot">Only Master B/L</span>
                    <span class="s5-uoh">Issue Master B/L only</span>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/></svg>
                </div>
                <div class="s5-uo" :class="{ 's5-uo-act': dduBooking.blMode === 'house' }" @click="dduBooking.blMode = 'house'" style="flex:1;">
                  <span class="s5-uor"></span>
                  <div class="s5-uo-body">
                    <span class="s5-uot">Master B/L and House B/L</span>
                    <span class="s5-uoh">Issue both Master and House B/L</span>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/><rect x="7" y="7" width="14" height="14" rx="2" style="fill:none;"/></svg>
                </div>
              </div>
            </div></div>
          </div>
          </template><!-- end Bill Issuance (KO DÙNG) -->

          <!-- ── DELIVERY ARRANGEMENT ── -->
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 12 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div>
                <span class="s5-st">Delivery Arrangement</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">

              <div class="s5-sar" :class="{ 's5-sar-act': dduBooking.sameAsConsignee }" @click="dduBooking.sameAsConsignee = !dduBooking.sameAsConsignee">
                <span class="s5-sc"></span>
                <span class="s5-sal">SAME AS CONSIGNEE</span>
              </div>

              <div class="s5-ff">
                <span class="s5-fl">Receiving company <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('ddu.receivingCompany') }" v-model="dduBooking.receivingCompany" :disabled="dduBooking.sameAsConsignee" @input="step5Errors.delete('ddu.receivingCompany')" placeholder="Enter company name" />
              </div>

              <div class="s5-row-addr-zip">
                <div class="s5-ff">
                  <span class="s5-fl">Company address <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('ddu.companyAddress') }" v-model="dduBooking.companyAddress" :disabled="dduBooking.sameAsConsignee" @input="step5Errors.delete('ddu.companyAddress')" placeholder="Full delivery address including city, state, country" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Zip code <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('ddu.zipCode') }" v-model="dduBooking.zipCode" :disabled="dduBooking.sameAsConsignee" @input="step5Errors.delete('ddu.zipCode')" placeholder="e.g. 700000" maxlength="10" />
                </div>
              </div>

              <div class="s5-row-pic">
                <div class="s5-ff">
                  <span class="s5-fl">Title</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="dduBooking.picTitle" :disabled="dduBooking.sameAsConsignee">
                    <option>Mr.</option><option>Mrs.</option><option>Ms.</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">PIC name <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('ddu.picName') }" v-model="dduBooking.picName" :disabled="dduBooking.sameAsConsignee" @input="step5Errors.delete('ddu.picName')" placeholder="Contact person in charge" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Email <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" :class="{ 's5-inv': step5Errors.has('ddu.email') }" v-model="dduBooking.email" :disabled="dduBooking.sameAsConsignee" @input="step5Errors.delete('ddu.email')" placeholder="email@company.com" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Phone <span class="s5-rq">*</span></span>
                  <input type="tel" class="s5-fi" :class="{ 's5-inv': step5Errors.has('ddu.phone') }" v-model="dduBooking.phone" :disabled="dduBooking.sameAsConsignee" @input="step5Errors.delete('ddu.phone')" placeholder="e.g. +84 28 1234 567" maxlength="18" />
                </div>
              </div>

              <div class="s5-row-date">
                <div class="s5-ff">
                  <span class="s5-fl">Delivery date <span class="s5-rq">*</span></span>
                  <div class="s5-date-wrap"><EnDatePicker :min-date="minDate" v-model="dduBooking.deliveryDate" input-class="s5-fi" :dynamic-input-class="{ 's5-inv': step5Errors.has('ddu.deliveryDate') }" @change="step5Errors.delete('ddu.deliveryDate')" /></div>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Delivery time</span>
                  <div class="s5-date-wrap">
                    <EnTimePicker v-model="dduBooking.deliveryTime" />
                  </div>
                </div>
              </div>

              <div class="s5-cr" :class="{ 's5-cr-act': dduBooking.locationNotRestricted }" @click="dduBooking.locationNotRestricted = !dduBooking.locationNotRestricted">
                <span class="s5-crc"></span>
                <span class="s5-crt">
                  Confirm the delivery location is not restricted
                  <span class="s5-tip-wrap">
                    <span class="s5-tip-i">i</span>
                    <span class="s5-tip-box">Please ensure the delivery address is not located on a road restricted to container trucks or heavy vehicles.</span>
                  </span>
                </span>
              </div>

              <!-- Cargo Release Instruction -->
              <div>
                <div class="s5-fl" style="margin-bottom:8px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="1"/><circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/></svg>
                  Cargo Release Instruction
                </div>
                <div style="display:flex;gap:10px;">
                  <div class="s5-uo" :class="{ 's5-uo-act': dduBooking.cargoRelease === 'immediate' }" @click="dduBooking.cargoRelease = 'immediate'" style="flex:1;">
                    <span class="s5-uor"></span>
                    <div class="s5-uo-body">
                      <span class="s5-uot">Immediate Release</span>
                      <span class="s5-uoh">Goods released right after clearance</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div class="s5-uo" :class="dduBooking.cargoRelease === 'hold' ? 's5-uo-act-red' : ''" @click="dduBooking.cargoRelease = 'hold'" style="flex:1;">
                    <span class="s5-uor"></span>
                    <div class="s5-uo-body">
                      <span class="s5-uot">Hold for Confirmation</span>
                      <span class="s5-uoh">Await your approval before releasing</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
              </div>

            </div></div>
          </div>

          <!-- ── ARRIVAL INSTRUCTION (KO DÙNG SHOPTRANS only) ── -->
          <template v-if="services.sea.selected.includes('handleUnderAvailable')">
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6-.5 1.2-1 2.5-1 2.5 0 2.5 2 5 2 1.3 0 1.9-.5 2.5-1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 1v4"/><path d="M12 9v3"/></svg></div>
                <span class="s5-st">Arrival Instruction</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">
              <!-- Row 1: Coloader / B/L number / Vessel name / Voyage number / Est. Arrival time -->
              <div style="display:grid;grid-template-columns:140px 1fr 1.4fr 1.2fr 160px;gap:10px;align-items:end;">
                <div class="s5-ff">
                  <span class="s5-fl">Coloader</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="dduBooking.arrShippingLine">
                    <option value="">Select coloader</option>
                    <option>Ecu Line</option><option>Charter Link</option><option>AWS</option>
                    <option>Shipco</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">B/L number{{ dduBooking.blMode === 'house' ? ' (Master)' : '' }}</span>
                  <input type="text" class="s5-fi" v-model="dduBooking.arrBlNumber" placeholder="Input B/L number" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Vessel name</span>
                  <input type="text" class="s5-fi" v-model="dduBooking.arrVesselName" placeholder="Input vessel name" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Voyage number</span>
                  <input type="text" class="s5-fi" v-model="dduBooking.arrVoyageNumber" placeholder="Input voyage number" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Es. Arrival time</span>
                  <div class="s5-date-wrap"><EnDatePicker :min-date="minDate" v-model="dduBooking.arrEstArrival" input-class="s5-fi" /></div>
                </div>
              </div>
              <!-- Row 2: Destination charges / Payment party -->
              <div style="display:grid;grid-template-columns:160px 280px 1fr;gap:10px;align-items:start;">
                <div class="s5-ff">
                  <span class="s5-fl">Destination charges</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="dduBooking.arrDestCharges" style="font-size:11px;">
                    <option>PREPAID / COLLECT</option><option>PREPAID</option><option>COLLECT</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Payment party</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="dduBooking.arrPaymentParty">
                    <option>Shoptrans pays on our behalf</option>
                    <option>Consignee shall pay the carrier directly</option>
                    <template v-if="dduBooking.blMode === 'house'"><option>Shoptrans pays on consignee's behalf</option></template>
                  </select>
                </div>
                <!-- Freetime application — REMOVED for KO DÙNG -->
                <div style="display:none;"></div>
              </div>
            </div></div>
          </div>
          </template><!-- end Arrival Instruction (KO DÙNG) -->

          <!-- ── CUSTOMS CLEARANCE ── -->
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                <span class="s5-st">Customs Clearance</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">

              <!-- 3 options -->
              <div class="s5-co">
                <div class="s5-cop" :class="{ 's5-cop-sel': dduBooking.customsOption === 0 }" @click="dduBooking.customsOption = 0">
                  <span class="s5-cop-num">1</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Contact consignee for documents</div>
                    <div class="s5-cop-hint">We will reach out to the consignee directly to collect the required customs documents</div>
                  </div>
                </div>
                <div class="s5-cop" :class="{ 's5-cop-sel': dduBooking.customsOption === 1 }" @click="dduBooking.customsOption = 1">
                  <span class="s5-cop-num">2</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Documents provided at later stage</div>
                    <div class="s5-cop-hint">Documents will be submitted at a later stage before customs processing</div>
                  </div>
                  <div class="s5-cop-pb" v-if="dduBooking.customsOption === 1">
                    <span>Provided by:</span>
                    <select class="s5-fi s5-fi-select custom-caret-svg" v-model="dduBooking.customsProvidedBy" @click.stop style="width:auto;padding:6px 32px 6px 10px;font-size:12px;">
                      <option>Consignee</option><option>Our company</option>
                    </select>
                  </div>
                </div>
                <div class="s5-cop" :class="{ 's5-cop-sel': dduBooking.customsOption === 2 }" @click="dduBooking.customsOption = 2">
                  <span class="s5-cop-num">3</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Declare customs based on uploaded documents</div>
                    <div class="s5-cop-hint">Upload your documents below for customs declaration processing</div>
                  </div>
                </div>
              </div>

              <!-- Expanded upload panel (only when option 3 selected) -->
              <div v-if="dduBooking.customsOption === 2" style="margin-top:4px;">

                <!-- Step 1: Doc allocation -->
                <div class="s5-upload-step">
                  <div class="s5-upload-step-num">①</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dal-label">Document Set Allocation</div>
                    <div class="s5-dal-chips">
                      <div class="s5-dal-chip" :class="{ 'act': dduBooking.docAlloc === 'same' }" @click="dduBooking.docAlloc = 'same'">
                        <span class="s5-dal-chip-r"></span>
                        <div><div class="s5-dal-chip-t">Single document set</div><div class="s5-dal-chip-h">One set covers the entire shipment</div></div>
                      </div>
                      <div class="s5-dal-chip" :class="{ 'act': dduBooking.docAlloc === 'multi' }" @click="dduBooking.docAlloc = 'multi'">
                        <span class="s5-dal-chip-r"></span>
                        <div><div class="s5-dal-chip-t">Multiple document sets</div><div class="s5-dal-chip-h">Shipment uses more than one document set</div></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Upload mode + files -->
                <div class="s5-upload-step">
                  <div class="s5-upload-step-num">②</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dal-label">Upload documents</div>
                    <div class="s5-ut">
                      <div class="s5-uo" :class="{ act: dduBooking.uploadMode === 'compressed' }" @click="dduBooking.uploadMode = 'compressed'">
                        <span class="s5-uor"></span>
                        <div class="s5-uo-body">
                          <span class="s5-uot">All in one compressed file</span>
                          <span class="s5-uoh">.rar, .zip, .7z</span>
                        </div>
                      </div>
                      <div class="s5-uo" :class="{ act: dduBooking.uploadMode === 'separate' }" @click="dduBooking.uploadMode = 'separate'">
                        <span class="s5-uor"></span>
                        <div class="s5-uo-body">
                          <span class="s5-uot">Upload each separately</span>
                          <span class="s5-uoh">PDF, XLSX, DOCX</span>
                        </div>
                      </div>
                    </div>

                    <!-- File upload zone — Compressed mode -->
                    <div v-if="dduBooking.uploadMode === 'compressed'" class="s5-upload-zone">
                      <div v-for="(row, ri) in dduCompressedRows" :key="'ddu-c-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerDduUpload('compressed', ri)">
                        <span class="s5-fri">📦</span>
                        <div class="s5-frn">
                          <div class="s5-frn-t">
                            <button class="s5-fre" @click.stop="startEditDduRowName('compressed', ri)" type="button">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <input type="text" :value="row.name" :readonly="dduEditingRow !== 'c-'+ri" :class="{ editing: dduEditingRow === 'c-'+ri }" @click.stop @blur="finishEditDduRowName('compressed', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                          </div>
                          <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                        </div>
                        <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                        <button v-if="!row.required" class="s5-frx" @click.stop="removeDduRow('compressed', ri)" type="button">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                        <input :ref="(el: any) => { if(el) dduFileInputRefs['c-'+ri] = el }" type="file" style="display:none" accept=".rar,.zip,.7z" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                      </div>
                    </div>

                    <!-- File upload zone — Separate mode -->
                    <div v-else class="s5-upload-zone">
                      <div v-for="(row, ri) in dduSeparateRows" :key="'ddu-s-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerDduUpload('separate', ri)">
                        <span class="s5-fri">{{ row.icon || '📄' }}</span>
                        <div class="s5-frn">
                          <div class="s5-frn-t">
                            <button class="s5-fre" @click.stop="startEditDduRowName('separate', ri)" type="button">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <input type="text" :value="row.name" :readonly="dduEditingRow !== 's-'+ri" :class="{ editing: dduEditingRow === 's-'+ri }" @click.stop @blur="finishEditDduRowName('separate', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                          </div>
                          <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                        </div>
                        <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                        <button v-if="!row.required" class="s5-frx" @click.stop="removeDduRow('separate', ri)" type="button">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                        <input :ref="(el: any) => { if(el) dduFileInputRefs['s-'+ri] = el }" type="file" style="display:none" accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                      </div>
                      <button class="s5-afb" @click="addDduRow('separate')" type="button">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add more
                      </button>
                    </div>
                  </div>
                </div>
                <!-- Step 3: Checklist -->
                <div class="s5-upload-step" style="border-bottom:none;">
                  <div class="s5-upload-step-num">③</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dcl" :class="{ 'chk': dduBooking.checkDocs }" @click="dduBooking.checkDocs = !dduBooking.checkDocs">
                      <span class="s5-dcb"></span>
                      <span class="s5-dct">
                        Make sure the document set includes
                        <template v-if="services.sea.selected.includes('handleUnderAvailable')"><strong>Master B/L</strong>, </template>
                        <template v-if="services.sea.selected.includes('handleUnderAvailable') && dduBooking.blMode === 'house'"><strong>House B/L</strong>, </template>
                        <strong>Commercial Invoice</strong>, <strong>Packing List</strong>, <strong>Sales Contract</strong>, and <strong>Cargo Photos</strong>.
                      </span>
                    </div>
                    <div class="s5-dcl" :class="{ 'chk': dduBooking.checkCO }" @click="dduBooking.checkCO = !dduBooking.checkCO" style="margin-top:8px">
                      <span class="s5-dcb"></span>
                      <span class="s5-dct">The shipment has a <strong>Certificate of Origin (C/O)</strong></span>
                    </div>
                  </div>
                </div>

              </div><!-- end customs expanded -->

            </div></div>
          </div>

          <!-- ── REMARKS ── -->
          <div class="s5-mc">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <span class="s5-st">Remarks (if any)</span>
              </div>
            </div>
            <div class="s5-sb"><textarea class="s5-fta" v-model="dduBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
          </div>

          <!-- Bottom actions -->
          <div class="s5-ba">
            <button class="s5-btn" @click="goBackStep5Tab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <button class="s5-btn s5-btn-next" :disabled="dduBooking.customsOption === 2 && !dduBooking.checkDocs" @click="validateStep5">
              Continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

        </div><!-- end s5-page Full DDU -->

        <!-- ══ Full DDP STEP 5 ══ -->
        <div v-show="activeStep5Tab === 's5-dest-ddp'" class="s5-page">

          <!-- Service badge -->
          <div class="s5-stag">
            <span class="s5-stag-icon">📦</span>
            <div class="s5-stag-text">
              <span class="s5-stag-label">Full DDP service</span>
              <span class="s5-stag-desc">From CFS warehouse to consignee's door (import duty included)</span>
            </div>
          </div>

          <!-- ── BILL ISSUANCE INSTRUCTION ── -->
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                <span class="s5-st">Bill Issuance Instruction</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">
              <div style="display:flex;gap:10px;">
                <div class="s5-uo" :class="{ 's5-uo-act': ddpBooking.blMode === 'master' }" @click="ddpBooking.blMode = 'master'" style="flex:1;">
                  <span class="s5-uor"></span>
                  <div class="s5-uo-body">
                    <span class="s5-uot">Only Master B/L</span>
                    <span class="s5-uoh">Issue Master B/L only</span>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/></svg>
                </div>
                <div class="s5-uo" :class="{ 's5-uo-act': ddpBooking.blMode === 'house' }" @click="ddpBooking.blMode = 'house'" style="flex:1;">
                  <span class="s5-uor"></span>
                  <div class="s5-uo-body">
                    <span class="s5-uot">Master B/L and House B/L</span>
                    <span class="s5-uoh">Issue both Master and House B/L</span>
                  </div>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/><rect x="7" y="7" width="14" height="14" rx="2" style="fill:none;"/></svg>
                </div>
              </div>
            </div></div>
          </div>

          <!-- ── DELIVERY ARRANGEMENT ── -->
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 12 16 16"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg></div>
                <span class="s5-st">Delivery Arrangement</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">

              <div class="s5-sar" :class="{ 's5-sar-act': ddpBooking.sameAsConsignee }" @click="ddpBooking.sameAsConsignee = !ddpBooking.sameAsConsignee">
                <span class="s5-sc"></span>
                <span class="s5-sal">SAME AS CONSIGNEE</span>
              </div>

              <div class="s5-ff">
                <span class="s5-fl">Receiving company <span class="s5-rq">*</span></span>
                <input type="text" class="s5-fi" v-model="ddpBooking.receivingCompany" :disabled="ddpBooking.sameAsConsignee" placeholder="Enter company name" />
              </div>

              <div class="s5-row-addr-zip">
                <div class="s5-ff">
                  <span class="s5-fl">Company address <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" v-model="ddpBooking.companyAddress" :disabled="ddpBooking.sameAsConsignee" placeholder="Full delivery address including city, state, country" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Zip code <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" v-model="ddpBooking.zipCode" :disabled="ddpBooking.sameAsConsignee" placeholder="e.g. 700000" maxlength="10" />
                </div>
              </div>

              <div class="s5-row-pic">
                <div class="s5-ff">
                  <span class="s5-fl">Title</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="ddpBooking.picTitle" :disabled="ddpBooking.sameAsConsignee">
                    <option>Mr.</option><option>Mrs.</option><option>Ms.</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">PIC name <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" v-model="ddpBooking.picName" :disabled="ddpBooking.sameAsConsignee" placeholder="Contact person in charge" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Email <span class="s5-rq">*</span></span>
                  <input type="text" class="s5-fi" v-model="ddpBooking.email" :disabled="ddpBooking.sameAsConsignee" placeholder="email@company.com" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Phone <span class="s5-rq">*</span></span>
                  <input type="tel" class="s5-fi" v-model="ddpBooking.phone" :disabled="ddpBooking.sameAsConsignee" placeholder="e.g. +84 28 1234 567" maxlength="18" />
                </div>
              </div>

              <div class="s5-row-date">
                <div class="s5-ff">
                  <span class="s5-fl">Delivery date <span class="s5-rq">*</span></span>
                  <div class="s5-date-wrap"><EnDatePicker :min-date="minDate" v-model="ddpBooking.deliveryDate" input-class="s5-fi" /></div>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Delivery time</span>
                  <div class="s5-date-wrap">
                    <EnTimePicker v-model="ddpBooking.deliveryTime" />
                  </div>
                </div>
              </div>

              <div class="s5-cr" :class="{ 's5-cr-act': ddpBooking.locationNotRestricted }" @click="ddpBooking.locationNotRestricted = !ddpBooking.locationNotRestricted">
                <span class="s5-crc"></span>
                <span class="s5-crt">
                  Confirm the delivery location is not restricted
                  <span class="s5-tip-wrap">
                    <span class="s5-tip-i">i</span>
                    <span class="s5-tip-box">Please ensure the delivery address is not located on a road restricted to container trucks or heavy vehicles.</span>
                  </span>
                </span>
              </div>

              <!-- Cargo Release Instruction -->
              <div>
                <div class="s5-fl" style="margin-bottom:8px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="1"/><circle cx="12" cy="16" r="1"/><circle cx="20" cy="16" r="1"/></svg>
                  Cargo Release Instruction
                </div>
                <div style="display:flex;gap:10px;">
                  <div class="s5-uo" :class="{ 's5-uo-act': ddpBooking.cargoRelease === 'immediate' }" @click="ddpBooking.cargoRelease = 'immediate'" style="flex:1;">
                    <span class="s5-uor"></span>
                    <div class="s5-uo-body">
                      <span class="s5-uot">Immediate Release</span>
                      <span class="s5-uoh">Goods released right after clearance</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div class="s5-uo" :class="ddpBooking.cargoRelease === 'hold' ? 's5-uo-act-red' : ''" @click="ddpBooking.cargoRelease = 'hold'" style="flex:1;">
                    <span class="s5-uor"></span>
                    <div class="s5-uo-body">
                      <span class="s5-uot">Hold for Confirmation</span>
                      <span class="s5-uoh">Await your approval before releasing</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
              </div>

            </div></div>
          </div>



          <!-- ── CUSTOMS CLEARANCE ── -->
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                <span class="s5-st">Customs Clearance</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">

              <!-- 3 options -->
              <div class="s5-co">
                <div class="s5-cop" :class="{ 's5-cop-sel': ddpBooking.customsOption === 0 }" @click="ddpBooking.customsOption = 0">
                  <span class="s5-cop-num">1</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Contact consignee for documents</div>
                    <div class="s5-cop-hint">We will reach out to the consignee directly to collect the required customs documents</div>
                  </div>
                </div>
                <div class="s5-cop" :class="{ 's5-cop-sel': ddpBooking.customsOption === 1 }" @click="ddpBooking.customsOption = 1">
                  <span class="s5-cop-num">2</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Documents provided at later stage</div>
                    <div class="s5-cop-hint">Documents will be submitted at a later stage before customs processing</div>
                  </div>
                  <div class="s5-cop-pb" v-if="ddpBooking.customsOption === 1">
                    <span>Provided by:</span>
                    <select class="s5-fi s5-fi-select custom-caret-svg" v-model="ddpBooking.customsProvidedBy" @click.stop style="width:auto;padding:6px 32px 6px 10px;font-size:12px;">
                      <option>Consignee</option><option>Our company</option>
                    </select>
                  </div>
                </div>
                <div class="s5-cop" :class="{ 's5-cop-sel': ddpBooking.customsOption === 2 }" @click="ddpBooking.customsOption = 2">
                  <span class="s5-cop-num">3</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Declare customs based on the documents below</div>
                    <div class="s5-cop-hint">Upload your documents below for customs declaration processing</div>
                  </div>
                </div>
              </div>

              <!-- Expanded upload panel (only when option 3 selected) -->
              <div v-if="ddpBooking.customsOption === 2" style="margin-top:4px;">

                <!-- Step 1: Doc allocation -->
                <div class="s5-upload-step">
                  <div class="s5-upload-step-num">①</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dal-label">Document Set Allocation</div>
                    <div class="s5-dal-chips">
                      <div class="s5-dal-chip" :class="{ 'act': ddpBooking.docAlloc === 'single' }" @click="ddpBooking.docAlloc = 'single'">
                        <span class="s5-dal-chip-r"></span>
                        <div><div class="s5-dal-chip-t">Single document set</div><div class="s5-dal-chip-h">One set covers the entire shipment</div></div>
                      </div>
                      <div class="s5-dal-chip" :class="{ 'act': ddpBooking.docAlloc === 'multi' }" @click="ddpBooking.docAlloc = 'multi'">
                        <span class="s5-dal-chip-r"></span>
                        <div><div class="s5-dal-chip-t">Multiple document sets</div><div class="s5-dal-chip-h">Shipment uses more than one document set</div></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Upload mode + files -->
                <div class="s5-upload-step">
                  <div class="s5-upload-step-num">②</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dal-label">Upload documents</div>
                    <div class="s5-ut">
                      <div class="s5-uo" :class="{ act: ddpBooking.uploadMode === 'compressed' }" @click="ddpBooking.uploadMode = 'compressed'">
                        <span class="s5-uor"></span>
                        <div class="s5-uo-body">
                          <span class="s5-uot">All in one compressed file</span>
                          <span class="s5-uoh">.rar, .zip, .7z</span>
                        </div>
                      </div>
                      <div class="s5-uo" :class="{ act: ddpBooking.uploadMode === 'separate' }" @click="ddpBooking.uploadMode = 'separate'">
                        <span class="s5-uor"></span>
                        <div class="s5-uo-body">
                          <span class="s5-uot">Upload each separately</span>
                          <span class="s5-uoh">PDF, XLSX, DOCX</span>
                        </div>
                      </div>
                    </div>

                    <!-- File upload zone — Compressed mode -->
                    <div v-if="ddpBooking.uploadMode === 'compressed'" class="s5-upload-zone">
                      <div v-for="(row, ri) in ddpCompressedRows" :key="'ddp-c-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerDdpUpload('compressed', ri)">
                        <span class="s5-fri">📦</span>
                        <div class="s5-frn">
                          <div class="s5-frn-t">
                            <button class="s5-fre" @click.stop="startEditDdpRowName('compressed', ri)" type="button">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <input type="text" :value="row.name" :readonly="ddpEditingRow !== 'c-'+ri" :class="{ editing: ddpEditingRow === 'c-'+ri }" @click.stop @blur="finishEditDdpRowName('compressed', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                          </div>
                          <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                        </div>
                        <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                        <button v-if="!row.required" class="s5-frx" @click.stop="removeDdpRow('compressed', ri)" type="button">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                        <input :ref="(el: any) => { if(el) ddpFileInputRefs['c-'+ri] = el }" type="file" style="display:none" accept=".rar,.zip,.7z" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                      </div>
                    </div>

                    <!-- File upload zone — Separate mode -->
                    <div v-else class="s5-upload-zone">
                      <div v-for="(row, ri) in ddpSeparateRows" :key="'ddp-s-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerDdpUpload('separate', ri)">
                        <span class="s5-fri">{{ row.icon || '📄' }}</span>
                        <div class="s5-frn">
                          <div class="s5-frn-t">
                            <button class="s5-fre" @click.stop="startEditDdpRowName('separate', ri)" type="button">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <input type="text" :value="row.name" :readonly="ddpEditingRow !== 's-'+ri" :class="{ editing: ddpEditingRow === 's-'+ri }" @click.stop @blur="finishEditDdpRowName('separate', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                          </div>
                          <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                        </div>
                        <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                        <button v-if="!row.required" class="s5-frx" @click.stop="removeDdpRow('separate', ri)" type="button">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                        <input :ref="(el: any) => { if(el) ddpFileInputRefs['s-'+ri] = el }" type="file" style="display:none" accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                      </div>
                      <button class="s5-afb" @click="addDdpRow('separate')" type="button">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add more
                      </button>
                    </div>
                  </div>
                </div>
                <!-- Step 3: Checklist + Import Duty Payment (DDP unique) -->
                <div class="s5-upload-step" style="border-bottom:none;">
                  <div class="s5-upload-step-num">③</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dcl" :class="{ 'chk': ddpBooking.checkDocs }" @click="ddpBooking.checkDocs = !ddpBooking.checkDocs">
                      <span class="s5-dcb"></span>
                      <span class="s5-dct">
                        Make sure the document set includes
                        <template v-if="services.sea.selected.includes('handleUnderAvailable')"><strong>Master B/L</strong>, </template>
                        <strong>Commercial Invoice</strong>, <strong>Packing List</strong>, <strong>Sales Contract</strong>, and <strong>Cargo Photos</strong>.
                      </span>
                    </div>
                    <div class="s5-dcl" :class="{ 'chk': ddpBooking.checkCO }" @click="ddpBooking.checkCO = !ddpBooking.checkCO" style="margin-top:8px">
                      <span class="s5-dcb"></span>
                      <span class="s5-dct">The shipment has a <strong>Certificate of Origin (C/O)</strong></span>
                    </div>
                    <!-- Import Duty Payment — DDP exclusive -->
                    <div style="margin-top:14px;padding-top:14px;border-top:1px solid #f3f4f6;">
                      <div class="s5-fl" style="margin-bottom:8px;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                        Import Duty Payment
                      </div>
                      <div class="s5-duty-pills">
                        <div class="s5-duty-pill" :class="{ 's5-duty-pill-act': ddpBooking.dutyPayer === 'shoptrans' }" @click="ddpBooking.dutyPayer = 'shoptrans'">
                          <span class="s5-dp"></span> Shoptrans shall pay on our behalf
                        </div>
                        <div class="s5-duty-pill" :class="{ 's5-duty-pill-act': ddpBooking.dutyPayer === 'third' }" @click="ddpBooking.dutyPayer = 'third'">
                          <span class="s5-dp"></span> The third party shall pay on our behalf
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div><!-- end customs expanded -->

            </div></div>
          </div>

          <!-- ── ARRIVAL INSTRUCTION (only when combined with handleUnderAvailable) ── -->
          <div class="s5-mc" style="margin-bottom:16px" v-if="services.sea.selected.includes('handleUnderAvailable')">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6-.5 1.2-1 2.5-1 2.5 0 2.5 2 5 2 1.3 0 1.9-.5 2.5-1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 1v4"/><path d="M12 9v3"/></svg></div>
                <span class="s5-st">Arrival Instruction</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">
              <div style="display:grid;grid-template-columns:140px 1fr 1.4fr 1.2fr 160px;gap:10px;align-items:end;">
                <div class="s5-ff">
                  <span class="s5-fl">Coloader</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="ddpBooking.arrShippingLine">
                    <option value="">Select coloader</option>
                    <option>Ecu Line</option><option>Charter Link</option><option>AWS</option>
                    <option>Shipco</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">B/L number{{ ddpBooking.blMode === 'house' ? ' (Master)' : '' }}</span>
                  <input type="text" class="s5-fi" v-model="ddpBooking.arrBlNumber" placeholder="Input B/L number" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Vessel name</span>
                  <input type="text" class="s5-fi" v-model="ddpBooking.arrVesselName" placeholder="Input vessel name" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Voyage number</span>
                  <input type="text" class="s5-fi" v-model="ddpBooking.arrVoyageNumber" placeholder="Input voyage number" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Es. Arrival time</span>
                  <div class="s5-date-wrap"><EnDatePicker :min-date="minDate" v-model="ddpBooking.arrEstArrival" input-class="s5-fi" /></div>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:160px 280px 1fr;gap:10px;align-items:start;">
                <div class="s5-ff">
                  <span class="s5-fl">Destination charges</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="ddpBooking.arrDestCharges" style="font-size:11px;">
                    <option>PREPAID / COLLECT</option><option>PREPAID</option><option>COLLECT</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Payment party</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="ddpBooking.arrPaymentParty">
                    <option>Shoptrans pays on our behalf</option>
                    <option>Consignee shall pay the carrier directly</option>
                    <template v-if="ddpBooking.blMode === 'house'"><option>Shoptrans pays on consignee's behalf</option></template>
                  </select>
                </div>
                <div style="display:none;"></div>
              </div>
            </div></div>
          </div>

          <!-- ── REMARKS ── -->
          <div class="s5-mc">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <span class="s5-st">Remarks (if any)</span>
              </div>
            </div>
            <div class="s5-sb"><textarea class="s5-fta" v-model="ddpBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
          </div>

          <!-- Bottom actions -->
          <div class="s5-ba">
            <button class="s5-btn" @click="goBackStep5Tab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <button class="s5-btn s5-btn-next" :disabled="ddpBooking.customsOption === 2 && !ddpBooking.checkDocs" @click="validateStep5">
              Continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

        </div><!-- end s5-page Full DDP -->

        <!-- ══ Customs Clearance Only (AT DEST) STEP 5 ══ -->
        <div v-show="activeStep5Tab === 's5-dest-customsOnly'" class="s5-page">

          <!-- Service badge -->
          <div class="s5-stag">
            <span class="s5-stag-icon">📋</span>
            <div class="s5-stag-text">
              <span class="s5-stag-label">Customs clearance service only</span>
            </div>
          </div>

          <!-- ── BILL ISSUANCE INSTRUCTION ── -->
          <div v-if="services.sea.selected.includes('handleUnderAvailable')" class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                <span class="s5-st">Bill Issuance Instruction</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">
              <div style="display:flex;gap:10px;">
                <div class="s5-uo" :class="{ 's5-uo-act': destCustomsOnlyBooking.blMode === 'master' }" @click="destCustomsOnlyBooking.blMode = 'master'" style="flex:1;">
                  <span class="s5-uor"></span>
                  <div class="s5-uo-body"><span class="s5-uot">Only Master B/L</span><span class="s5-uoh">Issue Master B/L only</span></div>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/></svg>
                </div>
                <div class="s5-uo" :class="{ 's5-uo-act': destCustomsOnlyBooking.blMode === 'house' }" @click="destCustomsOnlyBooking.blMode = 'house'" style="flex:1;">
                  <span class="s5-uor"></span>
                  <div class="s5-uo-body"><span class="s5-uot">Master B/L and House B/L</span><span class="s5-uoh">Issue both Master and House B/L</span></div>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:.35;flex-shrink:0;"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/><rect x="7" y="7" width="14" height="14" rx="2" style="fill:none;"/></svg>
                </div>
              </div>
            </div></div>
          </div>

          <!-- ── ARRIVAL INSTRUCTION ── -->
          <div v-if="services.sea.selected.includes('handleUnderAvailable')" class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6-.5 1.2-1 2.5-1 2.5 0 2.5 2 5 2 1.3 0 1.9-.5 2.5-1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 1v4"/><path d="M12 9v3"/></svg></div>
                <span class="s5-st">Arrival Instruction</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">
              <div style="display:grid;grid-template-columns:140px 1fr 1.4fr 1.2fr 160px;gap:10px;align-items:end;">
                <div class="s5-ff">
                  <span class="s5-fl">Coloader</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="destCustomsOnlyBooking.arrShippingLine">
                    <option value="">Select coloader</option>
                    <option>Ecu Line</option><option>Charter Link</option><option>AWS</option>
                    <option>Shipco</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">B/L number{{ destCustomsOnlyBooking.blMode === 'house' ? ' (Master)' : '' }}</span>
                  <input type="text" class="s5-fi" v-model="destCustomsOnlyBooking.arrBlNumber" placeholder="Input B/L number" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Vessel name</span>
                  <input type="text" class="s5-fi" v-model="destCustomsOnlyBooking.arrVesselName" placeholder="Input vessel name" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Voyage number</span>
                  <input type="text" class="s5-fi" v-model="destCustomsOnlyBooking.arrVoyageNumber" placeholder="Input voyage number" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Es. Arrival time</span>
                  <div class="s5-date-wrap"><EnDatePicker :min-date="minDate" v-model="destCustomsOnlyBooking.arrEstArrival" input-class="s5-fi" /></div>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:160px 280px 1fr;gap:10px;align-items:start;">
                <div class="s5-ff">
                  <span class="s5-fl">Destination charges</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="destCustomsOnlyBooking.arrDestCharges" style="font-size:11px;">
                    <option>PREPAID / COLLECT</option><option>PREPAID</option><option>COLLECT</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Payment party</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="destCustomsOnlyBooking.arrPaymentParty">
                    <option>Shoptrans pays on our behalf</option>
                    <option>Consignee shall pay the carrier directly</option>
                    <template v-if="destCustomsOnlyBooking.blMode === 'house'"><option>Shoptrans pays on consignee's behalf</option></template>
                  </select>
                </div>
                <div style="display:none;"></div>
              </div>
            </div></div>
          </div>

          <!-- ── CUSTOMS CLEARANCE ── -->
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                <span class="s5-st">Customs Clearance</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">

              <!-- 3 options -->
              <div class="s5-co">
                <div class="s5-cop" :class="{ 's5-cop-sel': destCustomsOnlyBooking.customsOption === 0 }" @click="destCustomsOnlyBooking.customsOption = 0">
                  <span class="s5-cop-num">1</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Contact consignee for documents</div>
                    <div class="s5-cop-hint">We will reach out to the consignee directly to collect the required customs documents</div>
                  </div>
                </div>
                <div class="s5-cop" :class="{ 's5-cop-sel': destCustomsOnlyBooking.customsOption === 1 }" @click="destCustomsOnlyBooking.customsOption = 1">
                  <span class="s5-cop-num">2</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Documents provided at later stage</div>
                    <div class="s5-cop-hint">Documents will be submitted at a later stage before customs processing</div>
                  </div>
                  <div class="s5-cop-pb" v-if="destCustomsOnlyBooking.customsOption === 1">
                    <span>Provided by:</span>
                    <select class="s5-fi s5-fi-select custom-caret-svg" v-model="destCustomsOnlyBooking.customsProvidedBy" @click.stop style="width:auto;padding:6px 32px 6px 10px;font-size:12px;">
                      <option>Consignee</option><option>Our company</option>
                    </select>
                  </div>
                </div>
                <div class="s5-cop" :class="{ 's5-cop-sel': destCustomsOnlyBooking.customsOption === 2 }" @click="destCustomsOnlyBooking.customsOption = 2">
                  <span class="s5-cop-num">3</span>
                  <div class="s5-cop-body">
                    <div class="s5-cop-title">Declare customs based on the documents below</div>
                    <div class="s5-cop-hint">Upload your documents below for customs declaration processing</div>
                  </div>
                </div>
              </div>

              <!-- Expanded upload panel (option 3) -->
              <div v-if="destCustomsOnlyBooking.customsOption === 2" style="margin-top:4px;">

                <!-- Step 1: Doc allocation -->
                <div class="s5-upload-step">
                  <div class="s5-upload-step-num">①</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dal-label">Document Set Allocation</div>
                    <div class="s5-dal-chips" v-if="!services.sea.selected.includes('handleUnderAvailable')">
                      <div class="s5-dal-chip" :class="{ 'act': destCustomsOnlyBooking.docAlloc === 'same' }" @click="destCustomsOnlyBooking.docAlloc = 'same'">
                        <span class="s5-dal-chip-r"></span>
                        <div><div class="s5-dal-chip-t">Same document set</div><div class="s5-dal-chip-h">All containers share one set</div></div>
                      </div>
                      <div class="s5-dal-chip" :class="{ 'act': destCustomsOnlyBooking.docAlloc === 'each' }" @click="destCustomsOnlyBooking.docAlloc = 'each'">
                        <span class="s5-dal-chip-r"></span>
                        <div><div class="s5-dal-chip-t">Separate per container</div><div class="s5-dal-chip-h">Each container has its own document set</div></div>
                      </div>
                      <div class="s5-dal-chip" :class="{ 'act': destCustomsOnlyBooking.docAlloc === 'multi' }" @click="destCustomsOnlyBooking.docAlloc = 'multi'">
                        <span class="s5-dal-chip-r"></span>
                        <div><div class="s5-dal-chip-t">Other scenarios</div><div class="s5-dal-chip-h">One or more containers use multiple document sets</div></div>
                      </div>
                    </div>
                    <div class="s5-dal-chips" v-else>
                      <div class="s5-dal-chip" :class="{ 'act': destCustomsOnlyBooking.docAlloc === 'single' }" @click="destCustomsOnlyBooking.docAlloc = 'single'">
                        <span class="s5-dal-chip-r"></span>
                        <div><div class="s5-dal-chip-t">Single document set</div><div class="s5-dal-chip-h">One set covers the entire shipment</div></div>
                      </div>
                      <div class="s5-dal-chip" :class="{ 'act': destCustomsOnlyBooking.docAlloc === 'multi' }" @click="destCustomsOnlyBooking.docAlloc = 'multi'">
                        <span class="s5-dal-chip-r"></span>
                        <div><div class="s5-dal-chip-t">Multiple document sets</div><div class="s5-dal-chip-h">Shipment uses more than one document set</div></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Upload mode + files -->
                <div class="s5-upload-step">
                  <div class="s5-upload-step-num">②</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dal-label">Upload documents</div>
                    <div class="s5-ut">
                      <div class="s5-uo" :class="{ act: destCustomsOnlyBooking.uploadMode === 'compressed' }" @click="destCustomsOnlyBooking.uploadMode = 'compressed'">
                        <span class="s5-uor"></span>
                        <div class="s5-uo-body">
                          <span class="s5-uot">All in one compressed file</span>
                          <span class="s5-uoh">.rar, .zip, .7z</span>
                        </div>
                      </div>
                      <div class="s5-uo" :class="{ act: destCustomsOnlyBooking.uploadMode === 'separate' }" @click="destCustomsOnlyBooking.uploadMode = 'separate'">
                        <span class="s5-uor"></span>
                        <div class="s5-uo-body">
                          <span class="s5-uot">Upload each separately</span>
                          <span class="s5-uoh">PDF, XLSX, DOCX</span>
                        </div>
                      </div>
                    </div>

                    <!-- File upload zone — Compressed mode -->
                    <div v-if="destCustomsOnlyBooking.uploadMode === 'compressed'" class="s5-upload-zone">
                      <div v-for="(row, ri) in dcoCompressedRows" :key="'dco-c-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerDcoUpload('compressed', ri)">
                        <span class="s5-fri">📦</span>
                        <div class="s5-frn">
                          <div class="s5-frn-t">
                            <button class="s5-fre" @click.stop="startEditDcoRowName('compressed', ri)" type="button">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <input type="text" :value="row.name" :readonly="dcoEditingRow !== 'c-'+ri" :class="{ editing: dcoEditingRow === 'c-'+ri }" @click.stop @blur="finishEditDcoRowName('compressed', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                          </div>
                          <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                        </div>
                        <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                        <button v-if="!row.required" class="s5-frx" @click.stop="removeDcoRow('compressed', ri)" type="button">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                        <input :ref="(el: any) => { if(el) dcoFileInputRefs['c-'+ri] = el }" type="file" style="display:none" accept=".rar,.zip,.7z" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                      </div>
                      <button v-if="destCustomsOnlyBooking.docAlloc !== 'same'" class="s5-afb" @click="addDcoRow('compressed')" type="button">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add more
                      </button>
                    </div>

                    <!-- File upload zone — Separate mode -->
                    <div v-else class="s5-upload-zone">
                      <div v-for="(row, ri) in dcoSeparateRows" :key="'dco-s-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerDcoUpload('separate', ri)">
                        <span class="s5-fri">{{ row.icon || '📄' }}</span>
                        <div class="s5-frn">
                          <div class="s5-frn-t">
                            <button class="s5-fre" @click.stop="startEditDcoRowName('separate', ri)" type="button">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <input type="text" :value="row.name" :readonly="dcoEditingRow !== 's-'+ri" :class="{ editing: dcoEditingRow === 's-'+ri }" @click.stop @blur="finishEditDcoRowName('separate', ri, $event)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                          </div>
                          <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                        </div>
                        <span class="s5-frt" :class="row.required ? 's5-frt-rq' : 's5-frt-op'">{{ row.required ? 'Required' : 'Optional' }}</span>
                        <button v-if="!row.required" class="s5-frx" @click.stop="removeDcoRow('separate', ri)" type="button">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                        <input :ref="(el: any) => { if(el) dcoFileInputRefs['s-'+ri] = el }" type="file" style="display:none" accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                      </div>
                      <button class="s5-afb" @click="addDcoRow('separate')" type="button">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add more
                      </button>
                    </div>
                  </div>
                </div>
                <!-- Step 3: Checklist + Import Duty Payment -->
                <div class="s5-upload-step" style="border-bottom:none;">
                  <div class="s5-upload-step-num">③</div>
                  <div class="s5-upload-step-body">
                    <div class="s5-dcl" :class="{ 'chk': destCustomsOnlyBooking.checkDocs }" @click="destCustomsOnlyBooking.checkDocs = !destCustomsOnlyBooking.checkDocs">
                      <span class="s5-dcb"></span>
                      <span class="s5-dct">
                        Make sure the document set includes
                        <template v-if="services.sea.selected.includes('handleUnderAvailable')"><strong>Master B/L</strong><template v-if="destCustomsOnlyBooking.blMode === 'house'">, <strong>House B/L</strong></template>, </template>
                        <strong>Commercial Invoice</strong>, <strong>Packing List</strong>, <strong>Sales Contract</strong>, and <strong>Cargo Photos</strong>.
                      </span>
                    </div>
                    <div class="s5-dcl" :class="{ 'chk': destCustomsOnlyBooking.checkCO }" @click="destCustomsOnlyBooking.checkCO = !destCustomsOnlyBooking.checkCO" style="margin-top:8px">
                      <span class="s5-dcb"></span>
                      <span class="s5-dct">The shipment has a <strong>Certificate of Origin (C/O)</strong></span>
                    </div>
                    <!-- Import Duty Payment — only without handleUnderAvailable -->
                    <div style="margin-top:14px;padding-top:14px;border-top:1px solid #f3f4f6;" v-if="!services.sea.selected.includes('handleUnderAvailable')">
                      <div class="s5-fl" style="margin-bottom:8px;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                        Import Duty Payment
                      </div>
                      <div class="s5-duty-pills">
                        <div class="s5-duty-pill" :class="{ 's5-duty-pill-act': destCustomsOnlyBooking.dutyPayer === 'shoptrans' }" @click="destCustomsOnlyBooking.dutyPayer = 'shoptrans'">
                          <span class="s5-dp"></span> Shoptrans shall pay on our behalf
                        </div>
                        <div class="s5-duty-pill" :class="{ 's5-duty-pill-act': destCustomsOnlyBooking.dutyPayer === 'consignee' }" @click="destCustomsOnlyBooking.dutyPayer = 'consignee'">
                          <span class="s5-dp"></span> Consignee shall pay directly
                        </div>
                        <div class="s5-duty-pill" :class="{ 's5-duty-pill-act': destCustomsOnlyBooking.dutyPayer === 'third' }" @click="destCustomsOnlyBooking.dutyPayer = 'third'">
                          <span class="s5-dp"></span> The third party shall pay on our behalf
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div><!-- end customs expanded -->

            </div></div>
          </div>

          <!-- ── REMARKS ── -->
          <div class="s5-mc">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <span class="s5-st">Remarks (if any)</span>
              </div>
            </div>
            <div class="s5-sb"><textarea class="s5-fta" v-model="destCustomsOnlyBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
          </div>

          <!-- Bottom actions -->
          <div class="s5-ba">
            <button class="s5-btn" @click="goBackStep5Tab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <button class="s5-btn s5-btn-next" :disabled="destCustomsOnlyBooking.customsOption === 2 && !destCustomsOnlyBooking.checkDocs" @click="validateStep5">
              Continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

        </div><!-- end s5-page Customs Only (AT DEST) -->

        <!-- ══ D/O Release (AT DEST) STEP 5 ══ -->
        <div v-show="activeStep5Tab === 's5-dest-dodRelease'" class="s5-page">

          <!-- Service badge -->
          <div class="s5-stag">
            <span class="s5-stag-icon">📄</span>
            <div class="s5-stag-text">
              <span class="s5-stag-label">Consignee Delivery Order (D/O) Release Service</span>
            </div>
          </div>

          <!-- ── ARRIVAL INSTRUCTION (KO DÙNG SHOPTRANS only) ── -->
          <div class="s5-mc" style="margin-bottom:16px" v-if="services.sea.selected.includes('handleUnderAvailable')">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 8 12 12 16"/><line x1="16" y1="12" x2="8" y2="12"/></svg></div>
                <span class="s5-st">Arrival Instruction</span>
              </div>
            </div>
            <div class="s5-sb"><div class="s5-fg">
              <div style="display:grid;grid-template-columns:max-content 1.7fr 1.7fr 1.4fr 155px;gap:10px;align-items:end;">
                <div class="s5-ff">
                  <span class="s5-fl">Coloader</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="doReleaseBooking.arrShippingLine">
                    <option value="">Select coloader</option>
                    <option>Ecu Line</option><option>Charter Link</option><option>AWS</option>
                    <option>Shipco</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Master B/L number</span>
                  <input type="text" class="s5-fi" v-model="doReleaseBooking.arrMasterBL" placeholder="Input B/L number" style="font-size:12px;" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Vessel name</span>
                  <input type="text" class="s5-fi" v-model="doReleaseBooking.arrVesselName" placeholder="Input vessel name" style="font-size:12px;" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Voyage number</span>
                  <input type="text" class="s5-fi" v-model="doReleaseBooking.arrVoyageNumber" placeholder="Input voyage number" style="font-size:12px;" />
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Es. Arrival time</span>
                  <div class="s5-date-wrap">
                    <EnDatePicker :min-date="minDate" v-model="doReleaseBooking.arrEstArrival" input-class="s5-fi" />
                  </div>
                </div>
              </div>
            </div></div>
          </div>

          <!-- ── CHARGES ARRANGEMENT (KO DÙNG SHOPTRANS only) ── -->
          <div class="s5-mc" style="margin-bottom:16px" v-if="services.sea.selected.includes('handleUnderAvailable')">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg></div>
                <span class="s5-st">Charges arrangement</span>
              </div>
            </div>
            <div class="s5-sb">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 40px;max-width:600px;margin:0 auto;">
                <div class="s5-ff">
                  <span class="s5-fl">Master arrival charges</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="doReleaseBooking.masterArrivalCharges">
                    <option>PREPAID</option><option>COLLECT</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Payment party</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="doReleaseBooking.masterPaymentParty">
                    <option>Our company</option><option>Shoptrans</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">House arrival charges</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="doReleaseBooking.houseArrivalCharges">
                    <option>PREPAID</option><option>COLLECT</option>
                  </select>
                </div>
                <div class="s5-ff">
                  <span class="s5-fl">Payment party</span>
                  <select class="s5-fi s5-fi-select custom-caret-svg" v-model="doReleaseBooking.housePaymentParty">
                    <option>Our company</option><option>Consignee</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- ── PRE-ALERT (KO DÙNG SHOPTRANS only) ── -->
          <div class="s5-mc" style="margin-bottom:16px" v-if="services.sea.selected.includes('handleUnderAvailable')">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></div>
                <span class="s5-st">Pre-Alert</span>
              </div>
            </div>
            <div class="s5-sb" style="padding:0;">
              <div style="display:grid;grid-template-columns:1fr 1px 1fr;">
                <!-- Master B/L zone -->
                <div style="padding:22px 24px;">
                  <div class="s5-fl" style="margin-bottom:10px;font-size:12px;font-weight:700;">Master B/L:</div>
                  <div style="display:flex;flex-direction:column;gap:6px;">
                    <!-- Locked required row -->
                    <div class="s5-frow-v2" :class="{ 'up': doReleaseBooking.preAlertMasterFile }" @click="($refs.paMasterInput as HTMLInputElement)?.click()">
                      <span class="s5-fri">📎</span>
                      <div class="s5-frn">
                        <div class="s5-frn-t">
                          <span style="font-size:12px;font-weight:600;color:#1f2937;">MASTER B/L</span>
                        </div>
                        <div class="s5-frn-s">{{ doReleaseBooking.preAlertMasterFile ? '✓ ' + doReleaseBooking.preAlertMasterFile.name : 'Click anywhere to upload' }}</div>
                      </div>
                      <span class="s5-frt s5-frt-rq">Required</span>
                      <input ref="paMasterInput" type="file" style="display:none" accept=".rar,.zip,.7z,.pdf,.xlsx,.xls,.docx,.doc" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f) doReleaseBooking.preAlertMasterFile=f; (e.target as HTMLInputElement).value='' }" />
                    </div>
                    <!-- Optional extra rows -->
                    <div v-for="(row, ri) in doReleaseBooking.preAlertMasterExtra" :key="'pam-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerPaFileInput('master', ri)">
                      <span class="s5-fri">📎</span>
                      <div class="s5-frn">
                        <div class="s5-frn-t">
                          <button class="s5-fre" @click.stop="row.editing=!row.editing" type="button"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
                          <input type="text" v-model="row.name" :readonly="!row.editing" :class="{ editing: row.editing }" @click.stop @blur="row.editing=false" @keydown.enter="($event.target as HTMLInputElement).blur()" />
                        </div>
                        <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                      </div>
                      <span class="s5-frt">Optional</span>
                      <button class="s5-frx" @click.stop="doReleaseBooking.preAlertMasterExtra.splice(ri,1)" type="button"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                      <input :ref="(el: any) => { if(el) paFileInputRefs['master-'+ri]=el }" type="file" style="display:none" accept=".rar,.zip,.7z,.pdf,.xlsx,.xls,.docx,.doc" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f) row.file=f; (e.target as HTMLInputElement).value='' }" />
                    </div>
                    <button class="s5-afb" @click="doReleaseBooking.preAlertMasterExtra.push({ name: 'Document_'+(doReleaseBooking.preAlertMasterExtra.length+1), file: null, editing: false })" type="button">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add file
                    </button>
                  </div>
                </div>
                <!-- Vertical divider -->
                <div style="background:#e5e7eb;"></div>
                <!-- House B/L zone -->
                <div style="padding:22px 24px;">
                  <div class="s5-fl" style="margin-bottom:10px;font-size:12px;font-weight:700;">House B/L:</div>
                  <div style="display:flex;flex-direction:column;gap:6px;">
                    <!-- Locked required row -->
                    <div class="s5-frow-v2" :class="{ 'up': doReleaseBooking.preAlertHouseFile }" @click="($refs.paHouseInput as HTMLInputElement)?.click()">
                      <span class="s5-fri">📎</span>
                      <div class="s5-frn">
                        <div class="s5-frn-t">
                          <span style="font-size:12px;font-weight:600;color:#1f2937;">HOUSE B/L</span>
                        </div>
                        <div class="s5-frn-s">{{ doReleaseBooking.preAlertHouseFile ? '✓ ' + doReleaseBooking.preAlertHouseFile.name : 'Click anywhere to upload' }}</div>
                      </div>
                      <span class="s5-frt s5-frt-rq">Required</span>
                      <input ref="paHouseInput" type="file" style="display:none" accept=".rar,.zip,.7z,.pdf,.xlsx,.xls,.docx,.doc" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f) doReleaseBooking.preAlertHouseFile=f; (e.target as HTMLInputElement).value='' }" />
                    </div>
                    <!-- Optional extra rows -->
                    <div v-for="(row, ri) in doReleaseBooking.preAlertHouseExtra" :key="'pah-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerPaFileInput('house', ri)">
                      <span class="s5-fri">📎</span>
                      <div class="s5-frn">
                        <div class="s5-frn-t">
                          <button class="s5-fre" @click.stop="row.editing=!row.editing" type="button"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
                          <input type="text" v-model="row.name" :readonly="!row.editing" :class="{ editing: row.editing }" @click.stop @blur="row.editing=false" @keydown.enter="($event.target as HTMLInputElement).blur()" />
                        </div>
                        <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                      </div>
                      <span class="s5-frt">Optional</span>
                      <button class="s5-frx" @click.stop="doReleaseBooking.preAlertHouseExtra.splice(ri,1)" type="button"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                      <input :ref="(el: any) => { if(el) paFileInputRefs['house-'+ri]=el }" type="file" style="display:none" accept=".rar,.zip,.7z,.pdf,.xlsx,.xls,.docx,.doc" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f) row.file=f; (e.target as HTMLInputElement).value='' }" />
                    </div>
                    <button class="s5-afb" @click="doReleaseBooking.preAlertHouseExtra.push({ name: 'Document_'+(doReleaseBooking.preAlertHouseExtra.length+1), file: null, editing: false })" type="button">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add file
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── D/O RELEASE INSTRUCTION ── -->
          <div class="s5-mc" style="margin-bottom:16px">
            <div class="s5-sd" style="border-radius:14px 14px 0 0;border-bottom:none;">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                <span class="s5-st">D/O Release Instruction</span>
              </div>
            </div>
            <div class="s5-sb">
              <div style="display:flex;gap:10px;">
                <div class="s5-uo" :class="{ 's5-uo-act': doReleaseBooking.doInstruction === 'release' }" @click="doReleaseBooking.doInstruction = 'release'" style="flex:1;align-items:flex-start;padding:12px 14px;">
                  <span class="s5-uor" style="margin-top:2px;flex-shrink:0;"></span>
                  <div class="s5-uo-body">
                    <span class="s5-uot">Release D/O after receiving OBL / Telex Release / SWB</span>
                    <span class="s5-uoh">D/O will be released once the required documents are received from consignee</span>
                  </div>
                </div>
                <div class="s5-uo" :class="{ 's5-uo-act': doReleaseBooking.doInstruction === 'reconfirm' }" @click="doReleaseBooking.doInstruction = 'reconfirm'" style="flex:1;align-items:flex-start;padding:12px 14px;">
                  <span class="s5-uor" style="margin-top:2px;flex-shrink:0;"></span>
                  <div class="s5-uo-body">
                    <span class="s5-uot">Reconfirm with us before releasing the D/O</span>
                    <span class="s5-uoh">Our team will contact you for final approval before any D/O is issued</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── REMARKS ── -->
          <div class="s5-mc">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <span class="s5-st">Remarks (if any)</span>
              </div>
            </div>
            <div class="s5-sb"><textarea class="s5-fta" v-model="doReleaseBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
          </div>

          <!-- Bottom actions -->
          <div class="s5-ba">
            <button class="s5-btn" @click="goBackStep5Tab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <button class="s5-btn s5-btn-next" @click="validateStep5">
              Continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

        </div><!-- end s5-page D/O Release (AT DEST) -->

        <!-- ══ Collect/Pay Charges (AT DEST) STEP 5 ══ -->
        <div v-show="activeStep5Tab === 's5-dest-collectPay'" class="s5-page">

          <!-- Service badge -->
          <div class="s5-stag">
            <span class="s5-stag-icon">💰</span>
            <div class="s5-stag-text">
              <span class="s5-stag-label">Collect/pay charges as nominated</span>
            </div>
          </div>

          <!-- ── COLLECTION (GREEN) ── -->
          <div class="s5-mc s5-mc-col">
            <div class="s5-sd s5-sd-flex">
              <div class="s5-sd-left">
                <div class="s5-si">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <span class="s5-st">Collect/Receipt charges</span>
              </div>
              <span class="s5-cp-badge s5-cp-badge-green">COLLECTION</span>
            </div>
            <div class="s5-sb">
              <div class="s5-cp-tab-label">How to submit charges:</div>
              <div class="s5-cp-tabs">
                <button class="s5-cp-tab" :class="{ 'act-green': destCollectPayBooking.colTab === 'debit' }" @click="destCollectPayBooking.colTab = 'debit'">Upload Debit Note</button>
                <button class="s5-cp-tab" :class="{ 'act-green': destCollectPayBooking.colTab === 'manual' }" @click="destCollectPayBooking.colTab = 'manual'">Input Fees Manually</button>
                <button class="s5-cp-tab" :class="{ 'act-green': destCollectPayBooking.colTab === 'later' }" @click="destCollectPayBooking.colTab = 'later'">Submit Later</button>
              </div>

              <!-- Upload Debit Note -->
              <div v-if="destCollectPayBooking.colTab === 'debit'" class="s5-cp-upload-box">
                <div class="s5-cp-upload-label">Upload documents</div>
                <div v-for="(row, ri) in dcpColFileRows" :key="'dcpf-c-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerDcpFileUpload('col', ri)">
                  <span class="s5-fri">📎</span>
                  <div class="s5-frn">
                    <div class="s5-frn-t">
                      <button class="s5-fre" @click.stop="startEditDcpFileName('col', ri)" type="button">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                      </button>
                      <input type="text" :value="row.name" :readonly="dcpEditingFile !== 'col-'+ri" :class="{ editing: dcpEditingFile === 'col-'+ri }" @click.stop @blur="finishEditDcpFileName('col', ri)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                    </div>
                    <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                  </div>
                  <span class="s5-frt s5-frt-op">Optional</span>
                  <button class="s5-frx" @click.stop="dcpColFileRows.splice(ri,1)" type="button">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <input :ref="(el: any) => { if(el) dcpFileInputRefs['col-'+ri] = el }" type="file" style="display:none" accept=".rar,.zip,.7z,.pdf,.xlsx,.xls,.docx,.doc" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                </div>
                <button class="s5-afb" @click="addDcpFileRow('col')" type="button">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add file
                </button>
              </div>

              <!-- Input Fees Manually -->
              <div v-if="destCollectPayBooking.colTab === 'manual'" class="s5-cp-fee-wrap">
                <div class="s5-cp-fee-actions">
                  <button class="s5-cp-fee-btn s5-cp-fee-add" @click="destCollectPayBooking.colRows.push({ chargeName:'Ocean Freight', unit:'CNT', quantity:'', unitPrice:'', currency:'USD', total:'', receiveFrom:'Shipper' })">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> ADD
                  </button>
                </div>
                <div class="s5-cp-table-wrap">
                  <table class="s5-cp-table">
                    <thead><tr>
                      <th><div class="s5-cp-th-inner">Charge name <span class="s5-cp-manage-link" @click="openCpManage('chargeName')">Manage</span></div></th>
                      <th><div class="s5-cp-th-inner">Unit <span class="s5-cp-manage-link" @click="openCpManage('unit')">Manage</span></div></th>
                      <th>Quantity</th>
                      <th>Unit price</th><th>Currency</th><th>Total</th>
                      <th>Receive from</th><th></th>
                    </tr></thead>
                    <tbody>
                      <tr v-for="(row, i) in destCollectPayBooking.colRows" :key="i">
                        <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.chargeName"><option v-for="cn in cpChargeNameOpts" :key="cn" :value="cn">{{ cn }}</option></select></td>
                        <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.unit"><option v-for="u in cpUnitOpts" :key="u" :value="u">{{ u }}</option></select></td>
                        <td><input type="number" class="s5-cp-tc" v-model="row.quantity" placeholder="1" min="0.01" step="any" /></td>
                        <td><input type="number" class="s5-cp-tc" v-model="row.unitPrice" placeholder="0.00" min="0" step="0.01" /></td>
                        <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.currency"><option>USD</option><option>EUR</option><option>VND</option><option>CNY</option><option>JPY</option><option>GBP</option></select></td>
                        <td><div class="s5-cp-tc-total">{{ row.quantity && row.unitPrice ? (parseFloat(row.quantity)*parseFloat(row.unitPrice)).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+row.currency : '—' }}</div></td>
                        <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.receiveFrom"><option>Shipper</option><option>3rd Party</option></select></td>
                        <td><button class="s5-cp-row-del" @click="destCollectPayBooking.colRows.splice(i,1)">×</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Submit Later -->
              <div v-if="destCollectPayBooking.colTab === 'later'" class="s5-cp-later-note">
                <span style="font-size:20px;flex-shrink:0">🕐</span>
                <div class="s5-cp-later-text">You can submit the charges later. The order will be saved and you can return to complete the charge information at any time.</div>
              </div>

              <!-- Payment party (PIC) — hidden when Submit Later -->
              <div v-if="destCollectPayBooking.colTab !== 'later'" class="s5-cp-pic-section s5-cp-pic-green">
                <div class="s5-cp-pic-label">Payment party (PIC):</div>
                <div v-for="(pic, pi) in dcpColPics" :key="'dcpic-c-'+pi" class="s5-cp-pic-row" :style="pi > 0 ? 'margin-top:8px' : ''">
                  <div class="s5-cp-pic-field">
                    <label class="s5-cp-pic-fl">Title</label>
                    <select class="s5-cp-pic-fi custom-caret-svg" v-model="pic.title"><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Dr.</option></select>
                  </div>
                  <div class="s5-cp-pic-field">
                    <label class="s5-cp-pic-fl">PIC name</label>
                    <input class="s5-cp-pic-fi" type="text" v-model="pic.name" placeholder="Input PIC name" />
                  </div>
                  <div class="s5-cp-pic-field">
                    <label class="s5-cp-pic-fl">Email</label>
                    <input class="s5-cp-pic-fi" type="text" v-model="pic.email" placeholder="Input Email address" />
                  </div>
                  <div class="s5-cp-pic-field">
                    <label class="s5-cp-pic-fl">Phone</label>
                    <input class="s5-cp-pic-fi" type="text" v-model="pic.phone" placeholder="Input phone number" />
                  </div>
                  <div class="s5-cp-pic-field s5-cp-pic-btn-cell">
                    <button v-if="pi === 0" class="s5-cp-pic-add-btn" @click="dcpColPics.push({ title:'Mr.', name:'', email:'', phone:'' })" type="button">+</button>
                    <button v-else class="s5-cp-pic-rem-btn" @click="dcpColPics.splice(pi,1)" type="button">×</button>
                  </div>
                </div>
              </div>
            </div>
          </div><!-- end collection card -->

          <!-- ── PAYMENT (RED) ── -->
          <div class="s5-mc s5-mc-pay">
            <div class="s5-sd-red">
              <div class="s5-sd-left">
                <div class="s5-si-red">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
                </div>
                <span class="s5-st-red">Pay/Disburse charges</span>
              </div>
              <span class="s5-cp-badge s5-cp-badge-red">PAYMENT</span>
            </div>
            <div class="s5-sb">
              <div class="s5-cp-tab-label">How to submit charges:</div>
              <div class="s5-cp-tabs">
                <button class="s5-cp-tab" :class="{ 'act-red': destCollectPayBooking.payTab === 'credit' }" @click="destCollectPayBooking.payTab = 'credit'">Upload Credit Note</button>
                <button class="s5-cp-tab" :class="{ 'act-red': destCollectPayBooking.payTab === 'manual' }" @click="destCollectPayBooking.payTab = 'manual'">Input Fees Manually</button>
                <button class="s5-cp-tab" :class="{ 'act-red': destCollectPayBooking.payTab === 'later' }" @click="destCollectPayBooking.payTab = 'later'">Submit Later</button>
              </div>

              <!-- Upload Credit Note -->
              <div v-if="destCollectPayBooking.payTab === 'credit'" class="s5-cp-upload-box s5-cp-upload-red">
                <div class="s5-cp-upload-label">Upload documents</div>
                <div v-for="(row, ri) in dcpPayFileRows" :key="'dcpf-p-'+ri" class="s5-frow-v2" :class="{ 'up': row.file }" @click="triggerDcpFileUpload('pay', ri)">
                  <span class="s5-fri">📎</span>
                  <div class="s5-frn">
                    <div class="s5-frn-t">
                      <button class="s5-fre" @click.stop="startEditDcpFileName('pay', ri)" type="button">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                      </button>
                      <input type="text" :value="row.name" :readonly="dcpEditingFile !== 'pay-'+ri" :class="{ editing: dcpEditingFile === 'pay-'+ri }" @click.stop @blur="finishEditDcpFileName('pay', ri)" @keydown.enter="($event.target as HTMLInputElement).blur()" @input="(e: Event) => { row.name = (e.target as HTMLInputElement).value }" />
                    </div>
                    <div class="s5-frn-s">{{ row.file ? '✓ ' + row.file.name : 'Click anywhere to upload' }}</div>
                  </div>
                  <span class="s5-frt s5-frt-op">Optional</span>
                  <button class="s5-frx" @click.stop="dcpPayFileRows.splice(ri,1)" type="button">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  <input :ref="(el: any) => { if(el) dcpFileInputRefs['pay-'+ri] = el }" type="file" style="display:none" accept=".rar,.zip,.7z,.pdf,.xlsx,.xls,.docx,.doc" @click.stop @change="(e: Event) => { const f=(e.target as HTMLInputElement).files?.[0]; if(f){ row.file=f }; (e.target as HTMLInputElement).value='' }" />
                </div>
                <button class="s5-afb s5-afb-red" @click="addDcpFileRow('pay')" type="button">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add file
                </button>
              </div>

              <!-- Input Fees Manually -->
              <div v-if="destCollectPayBooking.payTab === 'manual'" class="s5-cp-fee-wrap">
                <div class="s5-cp-fee-actions">
                  <button class="s5-cp-fee-btn s5-cp-fee-add" @click="destCollectPayBooking.payRows.push({ chargeName:'Ocean Freight', unit:'CNT', quantity:'', unitPrice:'', currency:'USD', total:'', payTo:'Shipper' })">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> ADD
                  </button>
                </div>
                <div class="s5-cp-table-wrap">
                  <table class="s5-cp-table">
                    <thead><tr>
                      <th><div class="s5-cp-th-inner">Charge name <span class="s5-cp-manage-link" @click="openCpManage('chargeName')">Manage</span></div></th>
                      <th><div class="s5-cp-th-inner">Unit <span class="s5-cp-manage-link" @click="openCpManage('unit')">Manage</span></div></th>
                      <th>Quantity</th>
                      <th>Unit price</th><th>Currency</th><th>Total</th>
                      <th>Pay to</th><th></th>
                    </tr></thead>
                    <tbody>
                      <tr v-for="(row, i) in destCollectPayBooking.payRows" :key="i">
                        <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.chargeName"><option v-for="cn in cpChargeNameOpts" :key="cn" :value="cn">{{ cn }}</option></select></td>
                        <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.unit"><option v-for="u in cpUnitOpts" :key="u" :value="u">{{ u }}</option></select></td>
                        <td><input type="number" class="s5-cp-tc" v-model="row.quantity" placeholder="1" min="0.01" step="any" /></td>
                        <td><input type="number" class="s5-cp-tc" v-model="row.unitPrice" placeholder="0.00" min="0" step="0.01" /></td>
                        <td><select class="s5-cp-tc-sel custom-caret-svg" v-model="row.currency"><option>USD</option><option>EUR</option><option>VND</option><option>CNY</option><option>JPY</option><option>GBP</option></select></td>
                        <td><div class="s5-cp-tc-total">{{ row.quantity && row.unitPrice ? (parseFloat(row.quantity)*parseFloat(row.unitPrice)).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+row.currency : '—' }}</div></td>
                        <td>
                          <span v-if="['Customs Fee','Inspection Fee','Fumigation Fee'].includes(row.chargeName)" class="s5-cp-locked">🔒 3rd Party</span>
                          <select v-else class="s5-cp-tc-sel custom-caret-svg" v-model="row.payTo"><option>Shipper</option><option>3rd Party</option></select>
                        </td>
                        <td><button class="s5-cp-row-del" @click="destCollectPayBooking.payRows.splice(i,1)">×</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Submit Later -->
              <div v-if="destCollectPayBooking.payTab === 'later'" class="s5-cp-later-note">
                <span style="font-size:20px;flex-shrink:0">🕐</span>
                <div class="s5-cp-later-text">You can submit the charges later. The order will be saved and you can return to complete the charge information at any time.</div>
              </div>

              <!-- Collection party (PIC) — hidden when Submit Later -->
              <div v-if="destCollectPayBooking.payTab !== 'later'" class="s5-cp-pic-section s5-cp-pic-red">
                <div class="s5-cp-pic-label">Collection party (PIC):</div>
                <div v-for="(pic, pi) in dcpPayPics" :key="'dcpic-p-'+pi" class="s5-cp-pic-row" :style="pi > 0 ? 'margin-top:8px' : ''">
                  <div class="s5-cp-pic-field">
                    <label class="s5-cp-pic-fl">Title</label>
                    <select class="s5-cp-pic-fi custom-caret-svg" v-model="pic.title"><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Dr.</option></select>
                  </div>
                  <div class="s5-cp-pic-field">
                    <label class="s5-cp-pic-fl">PIC name</label>
                    <input class="s5-cp-pic-fi" type="text" v-model="pic.name" placeholder="Input PIC name" />
                  </div>
                  <div class="s5-cp-pic-field">
                    <label class="s5-cp-pic-fl">Email</label>
                    <input class="s5-cp-pic-fi" type="text" v-model="pic.email" placeholder="Input Email address" />
                  </div>
                  <div class="s5-cp-pic-field">
                    <label class="s5-cp-pic-fl">Phone</label>
                    <input class="s5-cp-pic-fi" type="text" v-model="pic.phone" placeholder="Input phone number" />
                  </div>
                  <div class="s5-cp-pic-field s5-cp-pic-btn-cell">
                    <button v-if="pi === 0" class="s5-cp-pic-add-btn" @click="dcpPayPics.push({ title:'Mr.', name:'', email:'', phone:'' })" type="button">+</button>
                    <button v-else class="s5-cp-pic-rem-btn" @click="dcpPayPics.splice(pi,1)" type="button">×</button>
                  </div>
                </div>
              </div>
            </div>
          </div><!-- end payment card -->

          <!-- ── REMARKS ── -->
          <div class="s5-mc">
            <div class="s5-sd s5-sd-flex">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <span class="s5-st">Remarks (if any)</span>
              </div>
            </div>
            <div class="s5-sb"><textarea class="s5-fta" v-model="destCollectPayBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
          </div>

          <!-- Bottom actions -->
          <div class="s5-ba">
            <button class="s5-btn" @click="goBackStep5Tab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <button class="s5-btn s5-btn-next" @click="validateStep5">
              Continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

        </div><!-- end s5-page Collect/Pay (AT DEST) -->


        <!-- ══ Buy Cargo Insurance (AT DEST) STEP 5 ══ -->
        <div v-show="activeStep5Tab === 's5-dest-insurance'" class="s5-page">

          <!-- Service badge -->
          <div class="s5-stag">
            <span class="s5-stag-icon">🛡️</span>
            <div class="s5-stag-text">
              <span class="s5-stag-label">Buy cargo insurance</span>
            </div>
          </div>

          <!-- ── Main card ── -->
          <div class="s5-mc">

            <!-- Document Submission tabs -->
            <div class="s5-ins-section">
              <div class="s5-ins-section-label">Document submission</div>
              <div class="s5-cp-tabs" style="margin-bottom:0">
                <button class="s5-cp-tab" :class="destInsuranceBooking.submitType==='NOW' ? 'act-green' : ''" @click="destInsuranceBooking.submitType='NOW'">Submit Now</button>
                <button class="s5-cp-tab" :class="destInsuranceBooking.submitType==='LATER' ? 'act-green' : ''" @click="destInsuranceBooking.submitType='LATER'">Submit Later</button>
              </div>
            </div>

            <!-- Submit Now content -->
            <template v-if="destInsuranceBooking.submitType==='NOW'">
              <!-- Application Form -->
              <div class="s5-ins-section">
                <div class="s5-ins-section-label">Application Form</div>
                <div class="s5-ins-row">
                  <span class="s5-ins-dl-label">Download Application Form:</span>
                  <button class="s5-ins-dl-btn" @click="downloadInsuranceForm">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </button>
                </div>
              </div>

              <!-- Documents to use -->
              <div class="s5-ins-section">
                <div class="s5-ins-section-label">Documents to use:</div>

                <div class="s5-ins-doc-modes">
                  <!-- Mode A: Compressed -->
                  <div class="s5-ins-doc-mode" :class="destInsuranceBooking.uploadType==='compressed' ? 'active' : ''" @click="destInsuranceBooking.uploadType='compressed'">
                    <div class="s5-ins-doc-mode-header">
                      <span class="s5-ins-doc-radio" :class="destInsuranceBooking.uploadType==='compressed' ? 'act' : ''"></span>
                      <div>
                        <div class="s5-ins-doc-mode-title">Upload all documents in one compressed file</div>
                        <div class="s5-ins-doc-mode-hint">(support: .rar, .zip, .7z):</div>
                      </div>
                    </div>
                    <div class="s5-ins-choose-row">
                      <label class="s5-ins-choose-zone" @click.stop>
                        <input type="file" style="display:none" accept=".rar,.zip,.7z" @change="(e:Event)=>{ const f=(e.target as HTMLInputElement).files?.[0]; if(f){ destInsuranceBooking.uploadType='compressed'; destInsuranceBooking.compressedFiles=[{file:f, displayName:f.name.replace(/\.[^.]+$/,'')}] } (e.target as HTMLInputElement).value='' }" />
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Choose File
                      </label>
                    </div>
                    <div class="s5-ins-doc-preview">
                      <div v-if="!destInsuranceBooking.compressedFiles.length" class="s5-ins-doc-preview-empty">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span>No file selected</span>
                      </div>
                      <div v-else style="display:flex;align-items:center;gap:10px;width:100%;padding:6px 4px;">
                        <span style="font-size:26px;flex-shrink:0;">📦</span>
                        <div style="flex:1;min-width:0;">
                          <div class="s5-frn-t" style="display:flex;align-items:center;gap:6px;">
                            <button class="s5-fre" @click.stop="destInsCompEditIdx = destInsCompEditIdx === 0 ? -1 : 0" type="button">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </button>
                            <input type="text" v-model="destInsuranceBooking.compressedFiles[0].displayName" :readonly="destInsCompEditIdx !== 0" :class="{ editing: destInsCompEditIdx === 0 }" @click.stop @blur="destInsCompEditIdx = -1" @keydown.enter="($event.target as HTMLInputElement).blur()" style="border:none;background:transparent;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;color:#15803d;outline:none;flex:1;min-width:0;padding:0;" />
                          </div>
                          <div style="font-size:10px;color:#9ca3af;">{{ (destInsuranceBooking.compressedFiles[0].file.size/1024).toFixed(1) }} KB</div>
                        </div>
                        <button style="width:22px;height:22px;border-radius:50%;border:1px solid #fecaca;background:#fff5f5;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;" @click.stop="destInsuranceBooking.compressedFiles=[]">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Mode B: Separate files -->
                  <div class="s5-ins-doc-mode" :class="destInsuranceBooking.uploadType==='separated' ? 'active' : ''" @click="destInsuranceBooking.uploadType='separated'">
                    <div class="s5-ins-doc-mode-header">
                      <span class="s5-ins-doc-radio" :class="destInsuranceBooking.uploadType==='separated' ? 'act' : ''"></span>
                      <div>
                        <div class="s5-ins-doc-mode-title">Upload each document separately</div>
                        <div class="s5-ins-doc-mode-hint">(support: PDF, XLSX, DOCX,...):</div>
                      </div>
                    </div>
                    <div class="s5-ins-choose-row">
                      <label class="s5-ins-choose-zone" @click.stop>
                        <input type="file" style="display:none" multiple accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" @change="(e:Event)=>{ const ft=(e.target as HTMLInputElement).files; if(ft){ destInsuranceBooking.uploadType='separated'; Array.from(ft).forEach(f=>{ if(!destInsuranceBooking.separatedFiles.find(x=>x.file.name===f.name&&x.file.size===f.size)) destInsuranceBooking.separatedFiles.push({file:f, displayName:f.name.replace(/\.[^.]+$/,'')}) }) }; (e.target as HTMLInputElement).value='' }" />
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Choose File
                      </label>
                    </div>
                    <div class="s5-ins-doc-preview">
                      <div v-if="!destInsuranceBooking.separatedFiles.length" class="s5-ins-doc-preview-empty">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <span>No files selected</span>
                      </div>
                      <div v-else class="s5-ins-doc-files-grid">
                        <div class="s5-ins-doc-file-chip" v-for="(item,i) in destInsuranceBooking.separatedFiles" :key="i">
                          <div :class="['s5-ins-doc-file-chip-icon', (() => { const e = item.file.name.split('.').pop()?.toLowerCase()||''; return ['pdf'].includes(e) ? 'pdf' : ['xlsx','xls'].includes(e) ? 'xlsx' : ['docx','doc'].includes(e) ? 'docx' : ['jpg','jpeg','png'].includes(e) ? 'img' : ''; })()]">
                            {{ (() => { const e = item.file.name.split('.').pop()?.toLowerCase()||''; return ['pdf'].includes(e) ? '📄' : ['xlsx','xls'].includes(e) ? '📊' : ['docx','doc'].includes(e) ? '📝' : ['jpg','jpeg','png'].includes(e) ? '🖼️' : '📎'; })() }}
                          </div>
                          <div class="s5-ins-chip-name-wrap">
                            <input class="s5-ins-chip-name-inp" type="text" v-model="item.displayName" title="Click to rename" @click.stop @keydown.enter="($event.target as HTMLInputElement).blur()" />
                            <span class="s5-ins-chip-pencil">
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                            </span>
                          </div>
                          <button class="s5-ins-doc-file-chip-del" @click.stop="destInsuranceBooking.separatedFiles.splice(i,1)">×</button>
                        </div>
                        <label style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer">
                          <div class="s5-ins-doc-add-chip">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          </div>
                          <div style="font-size:9px;color:#9ca3af">Add more</div>
                          <input type="file" style="display:none" multiple accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png" @change="(e:Event)=>{ const ft=(e.target as HTMLInputElement).files; if(ft){ destInsuranceBooking.uploadType='separated'; Array.from(ft).forEach(f=>{ if(!destInsuranceBooking.separatedFiles.find(x=>x.file.name===f.name&&x.file.size===f.size)) destInsuranceBooking.separatedFiles.push({file:f, displayName:f.name.replace(/\.[^.]+$/,'')}) }) }; (e.target as HTMLInputElement).value='' }" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Checklist -->
                <div class="s5-dcl" :class="{ 'chk': destInsuranceBooking.ensureDocSet }" @click="destInsuranceBooking.ensureDocSet=!destInsuranceBooking.ensureDocSet">
                  <span class="s5-dcb"></span>
                  <span class="s5-dct">Make sure the document set includes
                    <strong>Application Form</strong>,
                    <strong>Commercial Invoice</strong>,
                    <strong>Packing List</strong>,
                    <strong>Bill of Lading</strong>.
                  </span>
                </div>
              </div>
            </template>

            <!-- Submit Later panel -->
            <div v-if="destInsuranceBooking.submitType==='LATER'" class="s5-ins-section">
              <div class="s5-cp-later-note">
                <span style="font-size:20px;flex-shrink:0">🕐</span>
                <div class="s5-cp-later-text">You can submit the documents later. The order will be saved and you can return to upload at any time.</div>
              </div>
            </div>

          </div><!-- end main card -->

          <!-- Remarks -->
          <div class="s5-mc">
            <div class="s5-sd" style="border-radius:14px 14px 0 0">
              <div class="s5-sd-left">
                <div class="s5-si"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                <span class="s5-st">Remarks (if any)</span>
              </div>
            </div>
            <div class="s5-sb"><textarea class="s5-fta" v-model="destInsuranceBooking.remarks" placeholder="Special instructions, additional details, or any notes for the operations team..."></textarea></div>
          </div>

          <!-- Bottom actions -->
          <div class="s5-ba">
            <button class="s5-btn" @click="goBackStep5Tab">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
            <button class="s5-btn s5-btn-next" :disabled="!destInsuranceBooking.ensureDocSet" @click="validateStep5">
              Continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>

        </div><!-- end s5-page Buy Insurance (AT DEST) -->

</div><!-- end s5-root -->
</template>

<script setup lang="ts">
import { inject, ref, reactive, watch, nextTick } from 'vue'
import type { Ref, ComputedRef } from 'vue'

// Inject all shared state from parent
const services = inject('lcl-services') as any
const shipperInfo = inject('lcl-shipperInfo') as any
const consigneeInfo = inject('lcl-consigneeInfo') as any
const fcaBooking = inject('lcl-fcaBooking') as any
const exwBooking = inject('lcl-exwBooking') as any
const customsBooking = inject('lcl-customsBooking') as any
const collectPayBooking = inject('lcl-collectPayBooking') as any
const insuranceBooking = inject('lcl-insuranceBooking') as any
const insCompEditIdx = ref(-1)
const insSepEditIdx = ref(-1)
const destInsuranceBooking = inject('lcl-destInsuranceBooking') as any
const destInsCompEditIdx = ref(-1)
const destInsSepEditIdx = ref(-1)
const offeredBooking = inject('lcl-offeredBooking') as any
const spotBooking = inject('lcl-spotBooking') as any
const availableBooking = inject('lcl-availableBooking') as any
const contractBooking = inject('lcl-contractBooking') as any
const switchBillBooking = inject('lcl-switchBillBooking') as any
const sblEditingIdx = ref(-1)
const dapBooking = inject('lcl-dapBooking') as any
const dduBooking = inject('lcl-dduBooking') as any
const ddpBooking = inject('lcl-ddpBooking') as any
const customsOnlyBooking = inject('lcl-customsOnlyBooking') as any
const destCustomsOnlyBooking = inject('lcl-destCustomsOnlyBooking') as any
const destCollectPayBooking = inject('lcl-destCollectPayBooking') as any


const step5TabList = inject('lcl-step5TabList') as ComputedRef<any[]>
const activeStep5Tab = inject('lcl-activeStep5Tab') as Ref<string>
const step5Errors = inject('lcl-step5Errors') as Set<string>

const validateStep5 = inject('lcl-validateStep5') as () => void
const goBackStep5Tab = inject('lcl-goBackStep5Tab') as () => void
const fmtSvcName = inject('lcl-fmtSvcName') as (s: string) => string
const selectedContainerType = inject('lcl-selectedContainerType') as Ref<string>
const doReleaseBooking = inject('lcl-doReleaseBooking') as any
const changeOptionGoToStep2 = inject('lcl-changeOptionGoToStep2') as () => void
const minDate = inject('lcl-minDate') as ComputedRef<string>

// ── Pre-Alert file input refs (for extra optional rows) ─────────────────────
const paFileInputRefs = reactive<Record<string, HTMLInputElement>>({})
const triggerPaFileInput = (zone: 'master' | 'house', idx: number) => {
  const inp = paFileInputRefs[zone + '-' + idx]
  if (inp) inp.click()
}

// ── EXW Upload rows management ──────────────────────────────────────────────
type UploadRow = { name: string; icon: string; required: boolean; file: File | null }

const exwCompressedRows = reactive<UploadRow[]>([])
const exwSeparateRows = reactive<UploadRow[]>([])
const exwEditingRow = ref('')
const exwFileInputRefs = reactive<Record<string, HTMLInputElement>>({})

// Build default compressed rows based on docAllocation
const buildCompressedDefaults = (alloc: string): UploadRow[] => {
  if (alloc === 'same' || alloc === 'single') {
    return [{ name: 'All_Documents.zip', icon: '📦', required: true, file: null }]
  } else if (alloc === 'each') {
    return [{ name: 'Container_1_Documents.zip', icon: '📦', required: true, file: null }]
  } else {
    return [{ name: 'Upload_All_Documents.zip', icon: '📦', required: true, file: null }]
  }
}

// Build default separate rows based on docAllocation
const buildSeparateDefaults = (alloc: string): UploadRow[] => {
  if (alloc === 'same' || alloc === 'single') {
    return [
      { name: 'Commercial_Invoice', icon: '📄', required: true, file: null },
    ]
  } else if (alloc === 'each') {
    return [{ name: 'Container_1_Documents', icon: '📦', required: true, file: null }]
  } else {
    return [
      { name: 'Document_Set_1', icon: '📄', required: true, file: null },
      { name: 'Document_Set_2', icon: '📄', required: true, file: null },
    ]
  }
}

// Initialize rows
const resetExwRows = () => {
  const alloc = exwBooking.docAllocation
  exwCompressedRows.splice(0, exwCompressedRows.length, ...buildCompressedDefaults(alloc))
  exwSeparateRows.splice(0, exwSeparateRows.length, ...buildSeparateDefaults(alloc))
}
resetExwRows()

// Watch docAllocation changes → reset rows
watch(() => exwBooking.docAllocation, () => { resetExwRows() })

// Trigger file input for a specific row
const triggerExwUpload = (mode: 'compressed' | 'separate', idx: number) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  const inp = exwFileInputRefs[key]
  if (inp) inp.click()
}

// Add a new row
const addExwRow = (mode: 'compressed' | 'separate') => {
  const rows = mode === 'compressed' ? exwCompressedRows : exwSeparateRows
  const count = rows.length + 1
  if (mode === 'compressed') {
    const alloc = exwBooking.docAllocation
    const name = alloc === 'each' ? `Container_${count}_Documents.zip` : `Document_${count}.zip`
    rows.push({ name, icon: '📦', required: false, file: null })
  } else {
    rows.push({ name: `Document_${count}`, icon: '📎', required: false, file: null })
  }
}

// Remove a row
const removeExwRow = (mode: 'compressed' | 'separate', idx: number) => {
  const rows = mode === 'compressed' ? exwCompressedRows : exwSeparateRows
  rows.splice(idx, 1)
}

// Start editing a row name
const startEditExwRowName = (mode: 'compressed' | 'separate', idx: number) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  exwEditingRow.value = key
  nextTick(() => {
    const row = document.querySelector(`.s5-frow-v2:nth-child(${idx + 1}) .s5-frn-t input`) as HTMLInputElement
    if (row) {
      row.removeAttribute('readonly')
      row.focus()
      row.select()
    }
  })
}

// Finish editing a row name
const finishEditExwRowName = (mode: 'compressed' | 'separate', idx: number, event: Event) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  if (exwEditingRow.value === key) {
    exwEditingRow.value = ''
  }
}

// ── Customs Origin (CO) Upload rows management ─────────────────────────────
const coCompressedRows = reactive<UploadRow[]>([])
const coSeparateRows = reactive<UploadRow[]>([])
const coEditingRow = ref('')
const coFileInputRefs = reactive<Record<string, HTMLInputElement>>({})

const resetCoRows = () => {
  const alloc = customsBooking.docAllocation
  coCompressedRows.splice(0, coCompressedRows.length, ...buildCompressedDefaults(alloc))
  coSeparateRows.splice(0, coSeparateRows.length, ...buildSeparateDefaults(alloc))
}
resetCoRows()

watch(() => customsBooking.docAllocation, () => { resetCoRows() })

const triggerCoUpload = (mode: 'compressed' | 'separate', idx: number) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  const inp = coFileInputRefs[key]
  if (inp) inp.click()
}

const addCoRow = (mode: 'compressed' | 'separate') => {
  const rows = mode === 'compressed' ? coCompressedRows : coSeparateRows
  const count = rows.length + 1
  if (mode === 'compressed') {
    const alloc = customsBooking.docAllocation
    const name = alloc === 'each' ? `Container_${count}_Documents.zip` : `Document_${count}.zip`
    rows.push({ name, icon: '📦', required: false, file: null })
  } else {
    rows.push({ name: `Document_${count}`, icon: '📎', required: false, file: null })
  }
}

const removeCoRow = (mode: 'compressed' | 'separate', idx: number) => {
  const rows = mode === 'compressed' ? coCompressedRows : coSeparateRows
  rows.splice(idx, 1)
}

const startEditCoRowName = (mode: 'compressed' | 'separate', idx: number) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  coEditingRow.value = key
  nextTick(() => {
    const row = document.querySelector(`.s5-frow-v2:nth-child(${idx + 1}) .s5-frn-t input`) as HTMLInputElement
    if (row) {
      row.removeAttribute('readonly')
      row.focus()
      row.select()
    }
  })
}

const finishEditCoRowName = (mode: 'compressed' | 'separate', idx: number, event: Event) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  if (coEditingRow.value === key) {
    coEditingRow.value = ''
  }
}

// ── DAP Upload rows management ──────────────────────────────────────────────
const dapCompressedRows = reactive<UploadRow[]>([])
const dapSeparateRows = reactive<UploadRow[]>([])
const dapEditingRow = ref('')
const dapFileInputRefs = reactive<Record<string, HTMLInputElement>>({})

const resetDapRows = () => {
  const alloc = dapBooking.docAlloc
  const isKoDung = services.sea.selected.includes('handleUnderAvailable')

  // Compressed: always a single Attachments.zip
  const compBase: UploadRow[] = [
    { name: 'Attachments.zip', icon: '📦', required: false, file: null },
  ]

  // Separate: base rows + B/L rows when KO DÙNG
  const sepBase = buildSeparateDefaults(alloc)
  if (isKoDung) {
    const blRows: UploadRow[] = [
      { name: 'Master_BL', icon: '📄', required: true, file: null },
    ]
    if (dapBooking.blMode === 'house') {
      blRows.push({ name: 'House_BL', icon: '📄', required: true, file: null })
    }
    sepBase.unshift(...blRows)
  }

  dapCompressedRows.splice(0, dapCompressedRows.length, ...compBase)
  dapSeparateRows.splice(0, dapSeparateRows.length, ...sepBase)
}
resetDapRows()

watch(() => dapBooking.docAlloc, () => { resetDapRows() })
watch(() => dapBooking.blMode, () => { resetDapRows() })

const triggerDapUpload = (mode: 'compressed' | 'separate', idx: number) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  const inp = dapFileInputRefs[key]
  if (inp) inp.click()
}

const addDapRow = (mode: 'compressed' | 'separate') => {
  const rows = mode === 'compressed' ? dapCompressedRows : dapSeparateRows
  const count = rows.length + 1
  if (mode === 'compressed') {
    const alloc = dapBooking.docAlloc
    const name = alloc === 'each' ? `Container_${count}_Documents.zip` : `Document_${count}.zip`
    rows.push({ name, icon: '📦', required: false, file: null })
  } else {
    rows.push({ name: `Document_${count}`, icon: '📎', required: false, file: null })
  }
}

const removeDapRow = (mode: 'compressed' | 'separate', idx: number) => {
  const rows = mode === 'compressed' ? dapCompressedRows : dapSeparateRows
  rows.splice(idx, 1)
}

const startEditDapRowName = (mode: 'compressed' | 'separate', idx: number) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  dapEditingRow.value = key
  nextTick(() => {
    const row = document.querySelector(`.s5-frow-v2:nth-child(${idx + 1}) .s5-frn-t input`) as HTMLInputElement
    if (row) { row.removeAttribute('readonly'); row.focus(); row.select() }
  })
}

const finishEditDapRowName = (mode: 'compressed' | 'separate', idx: number, event: Event) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  if (dapEditingRow.value === key) { dapEditingRow.value = '' }
}

// ── DDU Upload rows management ──────────────────────────────────────────────
const dduCompressedRows = reactive<UploadRow[]>([])
const dduSeparateRows = reactive<UploadRow[]>([])
const dduEditingRow = ref('')
const dduFileInputRefs = reactive<Record<string, HTMLInputElement>>({})

const resetDduRows = () => {
  const alloc = dduBooking.docAlloc
  const isKoDung = services.sea.selected.includes('handleUnderAvailable')

  // Compressed: always a single Attachments.zip
  const compBase: UploadRow[] = [
    { name: 'Attachments.zip', icon: '📦', required: false, file: null },
  ]

  // Separate: base rows + B/L rows when KO DÙNG
  const sepBase = buildSeparateDefaults(alloc)
  if (isKoDung) {
    const blRows: UploadRow[] = [
      { name: 'Master_BL', icon: '📄', required: true, file: null },
    ]
    if (dduBooking.blMode === 'house') {
      blRows.push({ name: 'House_BL', icon: '📄', required: true, file: null })
    }
    sepBase.unshift(...blRows)
  }

  dduCompressedRows.splice(0, dduCompressedRows.length, ...compBase)
  dduSeparateRows.splice(0, dduSeparateRows.length, ...sepBase)
}
resetDduRows()

watch(() => dduBooking.docAlloc, () => { resetDduRows() })
watch(() => dduBooking.blMode, () => { resetDduRows() })

const triggerDduUpload = (mode: 'compressed' | 'separate', idx: number) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  const inp = dduFileInputRefs[key]
  if (inp) inp.click()
}

const addDduRow = (mode: 'compressed' | 'separate') => {
  const rows = mode === 'compressed' ? dduCompressedRows : dduSeparateRows
  const count = rows.length + 1
  if (mode === 'compressed') {
    const alloc = dduBooking.docAlloc
    const name = alloc === 'each' ? `Container_${count}_Documents.zip` : `Document_${count}.zip`
    rows.push({ name, icon: '📦', required: false, file: null })
  } else {
    rows.push({ name: `Document_${count}`, icon: '📎', required: false, file: null })
  }
}

const removeDduRow = (mode: 'compressed' | 'separate', idx: number) => {
  const rows = mode === 'compressed' ? dduCompressedRows : dduSeparateRows
  rows.splice(idx, 1)
}

const startEditDduRowName = (mode: 'compressed' | 'separate', idx: number) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  dduEditingRow.value = key
  nextTick(() => {
    const row = document.querySelector(`.s5-frow-v2:nth-child(${idx + 1}) .s5-frn-t input`) as HTMLInputElement
    if (row) { row.removeAttribute('readonly'); row.focus(); row.select() }
  })
}

const finishEditDduRowName = (mode: 'compressed' | 'separate', idx: number, event: Event) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  if (dduEditingRow.value === key) { dduEditingRow.value = '' }
}

// ── DDP Upload rows management ──────────────────────────────────────────────
const ddpCompressedRows = reactive<UploadRow[]>([])
const ddpSeparateRows = reactive<UploadRow[]>([])
const ddpEditingRow = ref('')
const ddpFileInputRefs = reactive<Record<string, HTMLInputElement>>({})

const resetDdpRows = () => {
  const alloc = ddpBooking.docAlloc
  const isKoDung = services.sea.selected.includes('handleUnderAvailable')

  // Compressed: always a single Attachments.zip
  const compBase: UploadRow[] = [
    { name: 'Attachments.zip', icon: '📦', required: false, file: null },
  ]

  // Separate: base rows + B/L rows when KO DÙNG
  const sepBase = buildSeparateDefaults(alloc)
  if (isKoDung) {
    const blRows: UploadRow[] = [
      { name: 'Master_BL', icon: '📄', required: true, file: null },
    ]
    if (ddpBooking.blMode === 'house') {
      blRows.push({ name: 'House_BL', icon: '📄', required: true, file: null })
    }
    sepBase.unshift(...blRows)
  }

  // Update without losing references
  ddpCompressedRows.splice(0, ddpCompressedRows.length, ...compBase)
  ddpSeparateRows.splice(0, ddpSeparateRows.length, ...sepBase)
}
resetDdpRows()

watch([
  () => ddpBooking.docAlloc, 
  () => ddpBooking.blMode,
  () => services.sea.selected
], () => { resetDdpRows() }, { deep: true })

const triggerDdpUpload = (mode: 'compressed' | 'separate', idx: number) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  const inp = ddpFileInputRefs[key]
  if (inp) inp.click()
}

const addDdpRow = (mode: 'compressed' | 'separate') => {
  if (mode === 'compressed') return // Single file mode only
  const rows = ddpSeparateRows
  const count = rows.length + 1
  rows.push({ name: `Document_${count}`, icon: '📎', required: false, file: null })
}

const removeDdpRow = (mode: 'compressed' | 'separate', idx: number) => {
  const rows = mode === 'compressed' ? ddpCompressedRows : ddpSeparateRows
  rows.splice(idx, 1)
}

const startEditDdpRowName = (mode: 'compressed' | 'separate', idx: number) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  ddpEditingRow.value = key
  nextTick(() => {
    const row = document.querySelector(`.s5-frow-v2:nth-child(${idx + 1}) .s5-frn-t input`) as HTMLInputElement
    if (row) { row.removeAttribute('readonly'); row.focus(); row.select() }
  })
}

const finishEditDdpRowName = (mode: 'compressed' | 'separate', idx: number, event: Event) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  if (ddpEditingRow.value === key) { ddpEditingRow.value = '' }
}

// ── Customs Destination Upload rows management ──────────────────────────────
const dcoCompressedRows = reactive<UploadRow[]>([])
const dcoSeparateRows = reactive<UploadRow[]>([])
const dcoEditingRow = ref('')
const dcoFileInputRefs = reactive<Record<string, HTMLInputElement>>({})

const resetDcoRows = () => {
  const alloc = destCustomsOnlyBooking.docAlloc
  const compBase = buildCompressedDefaults(alloc)
  const sepBase = buildSeparateDefaults(alloc)

  const isKoDung = services.sea.selected.includes('handleUnderAvailable')

  const blRows: UploadRow[] = [
    { name: 'Master_BL', icon: '📄', required: true, file: null }
  ]
  
  if (isKoDung && destCustomsOnlyBooking.blMode === 'house') {
    blRows.push({ name: 'House_BL', icon: '📄', required: true, file: null })
  }
  
  sepBase.unshift(...blRows)

  dcoCompressedRows.splice(0, dcoCompressedRows.length, ...compBase)
  dcoSeparateRows.splice(0, dcoSeparateRows.length, ...sepBase)
}
resetDcoRows()

watch([
  () => destCustomsOnlyBooking.docAlloc, 
  () => destCustomsOnlyBooking.blMode,
  () => services.sea.selected
], () => { 
  const isKoDung = services.sea.selected.includes('handleUnderAvailable');
  if (isKoDung && (destCustomsOnlyBooking.docAlloc === 'same' || destCustomsOnlyBooking.docAlloc === 'each')) {
    destCustomsOnlyBooking.docAlloc = 'single';
  } else if (!isKoDung && destCustomsOnlyBooking.docAlloc === 'single') {
    destCustomsOnlyBooking.docAlloc = 'same';
  }
  resetDcoRows();
}, { deep: true })

const triggerDcoUpload = (mode: 'compressed' | 'separate', idx: number) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  const inp = dcoFileInputRefs[key]
  if (inp) inp.click()
}

const addDcoRow = (mode: 'compressed' | 'separate') => {
  const rows = mode === 'compressed' ? dcoCompressedRows : dcoSeparateRows
  const count = rows.length + 1
  if (mode === 'compressed') {
    if (dcoCompressedRows.length > 0) return // Single mode
  } else {
    rows.push({ name: `Document_${count}`, icon: '📎', required: false, file: null })
  }
}

const removeDcoRow = (mode: 'compressed' | 'separate', idx: number) => {
  const rows = mode === 'compressed' ? dcoCompressedRows : dcoSeparateRows
  rows.splice(idx, 1)
}

const startEditDcoRowName = (mode: 'compressed' | 'separate', idx: number) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  dcoEditingRow.value = key
  nextTick(() => {
    const row = document.querySelector(`.s5-frow-v2:nth-child(${idx + 1}) .s5-frn-t input`) as HTMLInputElement
    if (row) { row.removeAttribute('readonly'); row.focus(); row.select() }
  })
}

const finishEditDcoRowName = (mode: 'compressed' | 'separate', idx: number, event: Event) => {
  const key = (mode === 'compressed' ? 'c-' : 's-') + idx
  if (dcoEditingRow.value === key) { dcoEditingRow.value = '' }
}

// ── Collect/Pay (CP) file rows & PIC management ────────────────────────────
interface CpFileRow { name: string; file: File | null }
interface CpPicRow { title: string; name: string; email: string; phone: string }

const cpColFileRows = reactive<CpFileRow[]>([{ name: 'Document_1', file: null }])
const cpPayFileRows = reactive<CpFileRow[]>([{ name: 'Document_1', file: null }])
const cpEditingFile = ref('')
const cpFileInputRefs = reactive<Record<string, HTMLInputElement>>({})

const cpColPics = reactive<CpPicRow[]>([{ title: 'Mr.', name: '', email: '', phone: '' }])
const cpPayPics = reactive<CpPicRow[]>([{ title: 'Mr.', name: '', email: '', phone: '' }])

const triggerCpFileUpload = (panel: 'col' | 'pay', idx: number) => {
  const key = panel + '-' + idx
  const inp = cpFileInputRefs[key]
  if (inp) inp.click()
}

const addCpFileRow = (panel: 'col' | 'pay') => {
  const rows = panel === 'col' ? cpColFileRows : cpPayFileRows
  const count = rows.length + 1
  rows.push({ name: `Document_${count}`, file: null })
}

const startEditCpFileName = (panel: 'col' | 'pay', idx: number) => {
  const key = panel + '-' + idx
  cpEditingFile.value = key
  nextTick(() => {
    const inp = document.querySelector(`.s5-frow-v2 .s5-frn-t input.editing`) as HTMLInputElement
    if (inp) {
      inp.removeAttribute('readonly')
      inp.focus()
      inp.select()
    }
  })
}

const finishEditCpFileName = (panel: 'col' | 'pay', idx: number) => {
  const key = panel + '-' + idx
  if (cpEditingFile.value === key) {
    cpEditingFile.value = ''
  }
}

// ── Manage Options modal (Collect/Pay) ──────────────────────────────────────
const cpChargeNameOpts = reactive(['Ocean Freight','THC','Documentation Fee','CFS Charge','Customs Fee','Handling Fee','Inspection Fee','Fumigation Fee','Storage Fee','Seal Fee'])
const cpUnitOpts = reactive(['BL','CNT','Shipment','KG','CBM','Set'])

const cpManageShow = ref(false)
const cpManageKey = ref<'chargeName' | 'unit'>('chargeName')
const cpManageList = reactive<string[]>([])

const openCpManage = (key: 'chargeName' | 'unit') => {
  cpManageKey.value = key
  const source = key === 'chargeName' ? cpChargeNameOpts : cpUnitOpts
  cpManageList.splice(0, cpManageList.length, ...source)
  cpManageShow.value = true
}

const saveCpManage = () => {
  const cleaned = cpManageList.filter(v => v.trim())
  const target = cpManageKey.value === 'chargeName' ? cpChargeNameOpts : cpUnitOpts
  target.splice(0, target.length, ...cleaned)
  cpManageShow.value = false
}

// ── Dest Collect/Pay (DCP) file rows & PIC management ───────────────────────
const dcpColFileRows = reactive<CpFileRow[]>([{ name: 'Upload_debit_note', file: null }])
const dcpPayFileRows = reactive<CpFileRow[]>([{ name: 'Upload_credit_note', file: null }])
const dcpEditingFile = ref('')
const dcpFileInputRefs = reactive<Record<string, HTMLInputElement>>({})

const dcpColPics = reactive<CpPicRow[]>([{ title: 'Mr.', name: '', email: '', phone: '' }])
const dcpPayPics = reactive<CpPicRow[]>([{ title: 'Mr.', name: '', email: '', phone: '' }])

const triggerDcpFileUpload = (panel: 'col' | 'pay', idx: number) => {
  const key = panel + '-' + idx
  const inp = dcpFileInputRefs[key]
  if (inp) inp.click()
}

const addDcpFileRow = (panel: 'col' | 'pay') => {
  const rows = panel === 'col' ? dcpColFileRows : dcpPayFileRows
  const count = rows.length + 1
  rows.push({ name: `Document_${count}`, file: null })
}

const startEditDcpFileName = (panel: 'col' | 'pay', idx: number) => {
  const key = panel + '-' + idx
  dcpEditingFile.value = key
  nextTick(() => {
    const inp = document.querySelector(`.s5-frow-v2 .s5-frn-t input.editing`) as HTMLInputElement
    if (inp) { inp.removeAttribute('readonly'); inp.focus(); inp.select() }
  })
}

const finishEditDcpFileName = (panel: 'col' | 'pay', idx: number) => {
  const key = panel + '-' + idx
  if (dcpEditingFile.value === key) { dcpEditingFile.value = '' }
}

// ── Download Insurance Application Form ─────────────────────────────────────
const downloadInsuranceForm = () => {
  const a = document.createElement('a')
  a.href = '/Application_Form_Template.docx'
  a.download = 'Application_Form_Template.docx'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// ── Charge Arrangement: auto-set payer on Prepaid/Collect toggle ─────────────
const setChargeTerms = (booking: any, termsKey: string, payerKey: string, value: 'PREPAID' | 'COLLECT') => {
  booking[termsKey] = value
  booking[payerKey] = value === 'PREPAID' ? 'Shipper' : 'Consignee'
}
</script>

<style>
.s5-page { padding: 4px 0 32px; font-family: 'DM Sans', sans-serif; }
.s5-stag { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 20px; padding: 10px 18px; border-radius: 10px; background: #f0fdf4; border: 1px solid #bbf7d0; }
@keyframes s5-ring-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,.45)} 50%{box-shadow:0 0 0 5px rgba(22,163,74,0)} }
.s5-stag-icon { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; background: #dcfce7; border: 2px solid #bbf7d0; font-size: 14px; flex-shrink: 0; animation: s5-ring-pulse 2s ease-in-out infinite; }
.s5-stag-text { display: flex; flex-direction: column; gap: 2px; padding-top: 4px; }
.s5-stag-label { font-size: 13px; font-weight: 700; color: #15803d; line-height: 1.4; }
.s5-stag-desc { font-size: 11px; font-weight: 400; color: #6b7280; line-height: 1.3; }
.s5-sdot { width: 8px; height: 8px; border-radius: 50%; background: #15803d; flex-shrink: 0; }
.s5-stxt { font-size: 13px; font-weight: 400; color: #15803d; line-height: 1.4; }
.s5-stxt :deep(strong) { font-family: 'DM Sans', sans-serif; font-weight: 700; }
.s5-mc { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; box-shadow: 0 2px 10px rgba(0,0,0,.04); overflow: visible; position: relative; }
.s5-sd { display: flex; align-items: center; gap: 10px; padding: 14px 24px; background: linear-gradient(135deg, #f0fdf4, #fff); border-bottom: 1px solid #bbf7d0; border-radius: 14px 14px 0 0; }
.s5-si { width: 30px; height: 30px; border-radius: 50%; background: #15803d; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.s5-st { font-size: 13px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #1f2937; }
.s5-sb { padding: 22px 24px; }
.s5-fg { display: flex; flex-direction: column; gap: 16px; }
.s5-ff { display: flex; flex-direction: column; gap: 5px; }
.s5-fl { font-size: 12px; font-weight: 600; color: #6b7280; display: flex; align-items: center; gap: 4px; }
.s5-rq { color: #dc2626; }
.s5-fi {
  padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 8px;
  font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1f2937;
  outline: none; transition: all .18s; background: #fff; width: 100%;
}
.s5-fi:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,.1); }
.s5-fi::placeholder { color: #9ca3af; }
.s5-inv { border-color: #dc2626 !important; box-shadow: 0 0 0 3px rgba(220,38,38,.08) !important; }
.s5-disabled { background: #f3f4f6 !important; color: #9ca3af !important; cursor: not-allowed !important; }
.s5-fi-select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
.s5-fta { padding: 12px 14px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1f2937; outline: none; transition: all .18s; resize: vertical; min-height: 80px; width: 100%; }
.s5-fta:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,.1); }
.s5-fta::placeholder { color: #9ca3af; }
.s5-row-ship { display: grid; grid-template-columns: 115px 1.7fr 1fr 1.7fr 145px; gap: 10px; align-items: end; }
.s5-row-addr-zip { display: grid; grid-template-columns: 1fr 195px; gap: 16px; }
.s5-row-pic { display: grid; grid-template-columns: 64px 1fr 1fr 195px; gap: 10px; align-items: end; }
.s5-row-date { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 768px) {
  .s5-row-ship { grid-template-columns: 1fr 1fr; }
  .s5-row-pic { grid-template-columns: 64px 1fr; }
  .s5-row-addr-zip { grid-template-columns: 1fr; }
}
.s5-date-wrap { position: relative; }
.s5-date-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #15803d; z-index: 2; }
input[type="date"].s5-fi, input[type="time"].s5-fi { cursor: pointer; }
input[type="date"].s5-fi::-webkit-calendar-picker-indicator,
input[type="time"].s5-fi::-webkit-calendar-picker-indicator { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: auto; height: auto; opacity: 0; cursor: pointer; }
.s5-sar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 9px; background: #f0fdf4; border: 1.5px solid #bbf7d0; cursor: pointer; transition: all .18s; user-select: none; }
.s5-sar:hover { background: #dcfce7; }
.s5-sar.act { border-color: #16a34a; }
.s5-sc { width: 22px; height: 22px; border-radius: 6px; border: 2px solid #bbf7d0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .18s; background: #fff; }
.s5-sar.act .s5-sc { background: #15803d; border-color: #15803d; }
.s5-sar.act .s5-sc::after { content: '✓'; color: #fff; font-size: 13px; font-weight: 700; }
.s5-sal { font-size: 13px; font-weight: 600; color: #15803d; }
.s5-cr { display: flex; align-items: center; gap: 10px; padding: 10px 0; cursor: pointer; user-select: none; }
.s5-crc { width: 20px; height: 20px; border-radius: 5px; border: 2px solid #e5e7eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .18s; background: #fff; }
.s5-cr.act .s5-crc { background: #15803d; border-color: #15803d; }
.s5-cr.act .s5-crc::after { content: '✓'; color: #fff; font-size: 11px; font-weight: 700; }
.s5-crt { font-size: 13px; color: #1f2937; }
.s5-tip-wrap { position: relative; display: inline-flex; align-items: center; }
.s5-tip-i { display: inline-flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; background: #3b82f6; color: #fff; font-size: 9px; font-weight: 700; margin-left: 6px; cursor: help; }
.s5-tip-box { display: none; position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: #1f2937; color: #fff; font-size: 12px; padding: 10px 14px; border-radius: 8px; width: 280px; line-height: 1.5; box-shadow: 0 4px 20px rgba(0,0,0,.2); z-index: 10; font-weight: 400; }
.s5-tip-box::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 6px solid transparent; border-top-color: #1f2937; }
.s5-tip-wrap:hover .s5-tip-box { display: block; }
.s5-co { display: flex; flex-direction: column; gap: 10px; }
.s5-cop { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border: 1.5px solid #e5e7eb; border-radius: 12px; cursor: pointer; transition: all .18s; user-select: none; }
.s5-cop:hover { border-color: #bbf7d0; background: #f0fdf4; }
.s5-cop.sel { border-color: #16a34a; background: #f0fdf4; box-shadow: 0 0 0 3px rgba(22,163,74,.06); }
.s5-cop-num { width: 26px; height: 26px; border-radius: 50%; border: 2px solid #e5e7eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 12px; font-weight: 700; color: #9ca3af; transition: all .18s; }
.s5-cop.sel .s5-cop-num { border-color: #15803d; background: #15803d; color: #fff; }
.s5-cop-body { flex: 1; min-width: 0; }
.s5-cop-title { font-size: 13px; font-weight: 600; color: #1f2937; margin-bottom: 2px; }
.s5-cop-hint { font-size: 11px; color: #9ca3af; display: none; }
.s5-cop.sel .s5-cop-hint { display: block; }
.s5-cop-pb { display: none; align-items: center; gap: 8px; font-size: 12px; color: #6b7280; margin-left: auto; flex-shrink: 0; }
.s5-cop.sel .s5-cop-pb { display: flex; }
.s5-pb-select { padding: 6px 28px 6px 10px; border: 1.5px solid #e5e7eb; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #1f2937; outline: none; cursor: pointer; appearance: none; background: #fff; }
.s5-cex { padding-top: 16px; }
.s5-upload-step { display: flex; gap: 14px; padding: 16px 0; border-bottom: 1px solid #f3f4f6; }
.s5-upload-step:last-child { border-bottom: none; padding-bottom: 0; }
.s5-upload-step:first-child { padding-top: 0; }
.s5-upload-step-num { font-size: 16px; font-weight: 700; color: #15803d; flex-shrink: 0; width: 24px; text-align: center; padding-top: 1px; }
.s5-upload-step-body { flex: 1; min-width: 0; }
.s5-dal-label { font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 8px; }
.s5-duty-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.s5-duty-pill { display: inline-flex; align-items: center; gap: 7px; padding: 7px 16px; border: 1.5px solid #e5e7eb; border-radius: 20px; font-size: 12px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all .18s; user-select: none; background: #fff; }
.s5-duty-pill:hover { border-color: #bbf7d0; color: #1f2937; background: #f0fdf4; }
.s5-duty-pill-act { border-color: #15803d !important; background: #15803d !important; color: #fff !important; }
.s5-dp { width: 7px; height: 7px; border-radius: 50%; background: currentColor; opacity: .5; flex-shrink: 0; }
.s5-duty-pill-act .s5-dp { opacity: 1; }
.s5-dal-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.s5-dal-chip { flex: 1; min-width: 140px; display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; cursor: pointer; transition: all .18s; user-select: none; }
.s5-dal-chip:hover { border-color: #bbf7d0; background: #f0fdf4; }
.s5-dal-chip.act { border-color: #16a34a; background: #f0fdf4; }
.s5-dal-chip-r { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #e5e7eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .18s; }
.s5-dal-chip.act .s5-dal-chip-r { border-color: #15803d; background: #15803d; }
.s5-dal-chip.act .s5-dal-chip-r::after { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #fff; }
.s5-dal-chip-t { font-size: 12px; font-weight: 600; color: #1f2937; }
.s5-dal-chip-h { font-size: 11px; color: #9ca3af; }
.s5-ut { display: flex; gap: 10px; margin-bottom: 10px; }
.s5-uo { flex: 1; display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 9px; cursor: pointer; transition: all .18s; user-select: none; }
.s5-uo:hover { border-color: #bbf7d0; background: #f0fdf4; }
.s5-uo.act { border-color: #16a34a; background: #f0fdf4; }
.s5-uor { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #e5e7eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .18s; }
.s5-uo.act .s5-uor { border-color: #15803d; background: #15803d; }
.s5-uo.act .s5-uor::after { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #fff; }
.s5-uo-body { display: flex; flex-direction: column; }
.s5-uot { font-size: 12px; font-weight: 600; color: #1f2937; }
.s5-uoh { font-size: 10px; color: #9ca3af; }
.s5-upload-zone { display: flex; flex-direction: column; gap: 6px; }
.s5-frow { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 8px; background: #fff; cursor: pointer; transition: all .18s; }
.s5-frow:hover { border-color: #bbf7d0; background: #f0fdf4; }
.s5-fri { font-size: 18px; flex-shrink: 0; }
.s5-frn { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.s5-frn-t { font-size: 12px; font-weight: 600; color: #1f2937; }
.s5-frn-s { font-size: 10px; color: #9ca3af; }
.s5-frt { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 4px; white-space: nowrap; }
.s5-frt-rq { background: #fee2e2; color: #dc2626; }
.s5-frt-op { background: #f3f4f6; color: #9ca3af; }
/* v2 file rows with editable names */
.s5-frow-v2 { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border: 1.5px solid #e5e7eb; border-radius: 8px; background: #fff; margin-bottom: 6px; transition: all .18s; cursor: pointer; }
.s5-frow-v2:hover { border-color: #bbf7d0; background: #f0fdf4; }
.s5-frow-v2.up { border-color: #bbf7d0; background: #f0fdf4; }
.s5-frow-v2.up .s5-frn-s { color: #15803d; font-weight: 500; }
.s5-frow-v2 .s5-frn-t { display: flex; align-items: center; gap: 6px; }
.s5-frow-v2 .s5-frn-t input { border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; color: #1f2937; outline: none; flex: 1; min-width: 0; padding: 0; cursor: text; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.s5-frow-v2 .s5-frn-t input[readonly] { cursor: default; pointer-events: none; }
.s5-frow-v2 .s5-frn-t input.editing { background: #fff; border: 1px solid #16a34a; border-radius: 4px; padding: 4px 6px; pointer-events: auto; }
.s5-frow-v2 .s5-frn-t input::placeholder { color: #9ca3af; font-weight: 400; }
.s5-fre { width: 22px; height: 22px; border-radius: 50%; border: 1px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; flex-shrink: 0; }
.s5-fre:hover { background: #f0fdf4; border-color: #bbf7d0; }
.s5-frx { width: 22px; height: 22px; border-radius: 50%; border: 1px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; flex-shrink: 0; }
.s5-frx:hover { background: #fee2e2; border-color: #fecaca; }
.s5-afb { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1.5px dashed #bbf7d0; border-radius: 7px; background: #f0fdf4; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; color: #15803d; cursor: pointer; transition: all .15s; margin-top: 2px; }
.s5-afb:hover { border-color: #16a34a; background: #dcfce7; }
.s5-dcl { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 9px; background: #f3f4f6; cursor: pointer; user-select: none; margin-top: 4px; }
.s5-dcl.chk { border-color: #bbf7d0; background: #f0fdf4; }
.s5-dcb { width: 18px; height: 18px; border-radius: 4px; border: 2px solid #e5e7eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; transition: all .18s; }
.s5-dcl.chk .s5-dcb { background: #15803d; border-color: #15803d; }
.s5-dcl.chk .s5-dcb::after { content: '✓'; color: #fff; font-size: 11px; font-weight: 700; }
.s5-dct { font-size: 11px; color: #6b7280; line-height: 1.5; }
.s5-dct strong { color: #15803d; }
.s5-ba { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 18px; border-top: 1px solid #e5e7eb; }
.s5-btn { display: flex; align-items: center; gap: 8px; padding: 11px 26px; border-radius: 9px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .18s; border: 1.5px solid #e5e7eb; background: #fff; color: #1f2937; }
.s5-btn:hover { background: #f9fafb; }
.s5-btn-next { border-color: #16a34a; background: #15803d; color: #fff; font-weight: 700; }
.s5-btn-next:hover { background: #16a34a; }
.s5-mc-col { margin-bottom: 16px; }
.s5-mc-pay { border-color: #fecaca; margin-bottom: 16px; }
.s5-sd-flex { display: flex; align-items: center; justify-content: space-between; }
.s5-sd-left { display: flex; align-items: center; gap: 10px; }
.s5-sd-red { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 24px; background: linear-gradient(135deg, #fff5f5, #fff); border-bottom: 1px solid #fecaca; }
.s5-sd-red .s5-sd-left { display: flex; align-items: center; gap: 10px; }
.s5-si-red { width: 30px; height: 30px; border-radius: 50%; background: #b91c1c; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.s5-st-red { font-size: 13px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #1f2937; }
.s5-cp-badge { font-size: 11px; font-weight: 700; letter-spacing: .08em; padding: 4px 12px; border-radius: 6px; }
.s5-cp-badge-green { background: #15803d; color: #fff; }
.s5-cp-badge-red { background: #b91c1c; color: #fff; }
.s5-cp-tab-label { font-size: 12px; font-weight: 700; color: #6b7280; margin-bottom: 10px; }
.s5-cp-tabs { display: flex; border: 1.5px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin-bottom: 18px; }
.s5-cp-tab { flex: 1; padding: 11px 8px; text-align: center; font-size: 12px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; cursor: pointer; transition: all .18s; color: #6b7280; background: #fff; border: none; border-right: 1px solid #e5e7eb; font-family: 'DM Sans', sans-serif; }
.s5-cp-tab:last-child { border-right: none; }
.s5-cp-tab:hover { background: #f3f4f6; color: #1f2937; }
.s5-cp-tab.act-green { background: #15803d; color: #fff; }
.s5-cp-tab.act-red { background: #b91c1c; color: #fff; }
.s5-cp-upload-box { display: flex; flex-direction: column; gap: 8px; padding: 18px 20px; border: 1.5px solid #e5e7eb; border-radius: 10px; background: #f3f4f6; }
.s5-cp-upload-red { border-color: #fecaca !important; background: #fff5f5 !important; }
.s5-cp-upload-label { font-size: 12px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
.s5-cp-upload-hint { font-size: 11px; color: #9ca3af; margin-bottom: 8px; }
.s5-cp-afb { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1.5px dashed #bbf7d0; border-radius: 7px; background: #f0fdf4; font-size: 11px; font-weight: 600; color: #15803d; cursor: pointer; transition: all .15s; margin-top: 2px; }
.s5-cp-afb:hover { border-color: #16a34a; background: #dcfce7; }
.s5-cp-afb-red { border-color: #fecaca !important; background: #fff5f5 !important; color: #b91c1c !important; }
.s5-cp-afb-red:hover { border-color: #dc2626 !important; background: #fee2e2 !important; }
.s5-cp-frx { width: 22px; height: 22px; border-radius: 50%; border: 1px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; font-weight: 700; color: #dc2626; flex-shrink: 0; }
.s5-cp-frx:hover { background: #fee2e2; border-color: #fecaca; }
.s5-cp-fee-wrap { display: flex; flex-direction: column; gap: 10px; }
.s5-cp-fee-actions { display: flex; gap: 8px; }
.s5-cp-fee-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; border: 1.5px solid; transition: all .15s; }
.s5-cp-fee-add { border-color: #bbf7d0; background: #f0fdf4; color: #15803d; }
.s5-cp-fee-add:hover { border-color: #16a34a; background: #dcfce7; }
.s5-cp-table-wrap { border: 1.5px solid #e5e7eb; border-radius: 10px; overflow: hidden; overflow-x: auto; }
.s5-cp-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.s5-cp-table thead tr { background: #f3f4f6; }
.s5-cp-table thead th { padding: 9px 10px; text-align: left; font-size: 11px; font-weight: 700; color: #6b7280; letter-spacing: .04em; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; white-space: nowrap; }
.s5-cp-table tbody tr { border-bottom: 1px solid #e5e7eb; }
.s5-cp-table tbody tr:last-child { border-bottom: none; }
.s5-cp-table tbody tr:hover { background: #fafafa; }
.s5-cp-table tbody td { padding: 6px 8px; vertical-align: middle; }
.s5-cp-tc { width: 100%; border: 1.5px solid transparent; border-radius: 6px; padding: 5px 8px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #1f2937; outline: none; background: transparent; transition: all .15s; }
.s5-cp-tc:hover { border-color: #e5e7eb; background: #fff; }
.s5-cp-tc:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 2px rgba(22,163,74,.1); }
.s5-cp-tc-sel { width: 100%; border: 1.5px solid transparent; border-radius: 6px; padding: 5px 24px 5px 8px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #1f2937; outline: none; cursor: pointer; transition: all .15s; appearance: none; background: transparent; }
.s5-cp-tc-sel:hover { border-color: #e5e7eb; background: #fff; }
.s5-cp-tc-sel:focus { border-color: #16a34a; background: #fff; box-shadow: 0 0 0 2px rgba(22,163,74,.1); }
.s5-cp-tc-total { background: #f3f4f6; border-radius: 6px; padding: 5px 8px; font-size: 12px; color: #6b7280; font-weight: 600; white-space: nowrap; }
.s5-cp-locked { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; color: #d97706; background: #fef3c7; border: 1px solid #fde68a; border-radius: 5px; padding: 3px 8px; white-space: nowrap; }
.s5-cp-row-del { width: 22px; height: 22px; border-radius: 50%; border: 1px solid #fecaca; background: #fff5f5; color: #b91c1c; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.s5-cp-row-del:hover { background: #fee2e2; }
.s5-cp-later-note { display: flex; align-items: flex-start; gap: 10px; padding: 14px 18px; border: 1.5px dashed #e5e7eb; border-radius: 10px; background: #f3f4f6; }
.s5-cp-later-text { font-size: 13px; color: #6b7280; line-height: 1.6; }
.s5-cp-pic-section { margin-top: 16px; padding: 16px 18px; border: 1.5px solid #e5e7eb; border-radius: 10px; }
.s5-cp-pic-green { border-color: #bbf7d0; background: #f0fdf4; }
.s5-cp-pic-red { border-color: #fecaca; background: #fff5f5; }
.s5-cp-pic-label { font-size: 12px; font-weight: 700; color: #1f2937; margin-bottom: 12px; }
.s5-cp-pic-row { display: flex !important; flex-wrap: nowrap !important; gap: 8px !important; align-items: flex-end !important; }
.s5-cp-pic-field { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.s5-cp-pic-field:nth-child(1) { flex: 0 0 66px !important; }
.s5-cp-pic-field:nth-child(2) { flex: 1 1 0 !important; }
.s5-cp-pic-field:nth-child(3) { flex: 0.8 1 0 !important; }
.s5-cp-pic-field:nth-child(4) { flex: 0 0 120px !important; }
.s5-cp-pic-field:nth-child(5) { flex: 0 0 36px !important; }
.s5-cp-pic-fl { font-size: 11px; font-weight: 600; color: #6b7280; }
.s5-cp-pic-fi { padding: 6px 8px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #1f2937; outline: none; background: #fff; width: 100%; min-width: 0; transition: all .18s; box-sizing: border-box; }
.s5-cp-pic-fi:focus { border-color: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,.1); }
.s5-cp-pic-fi::placeholder { color: #9ca3af; }
select.s5-cp-pic-fi { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; }
.s5-cp-pic-add-btn { width: 32px; height: 32px; border-radius: 50%; background: #15803d; color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 300; flex-shrink: 0; transition: all .15s; }
.s5-cp-pic-add-btn:hover { background: #16a34a; }
.s5-cp-pic-rem-btn { width: 26px; height: 26px; border-radius: 50%; background: #fff5f5; border: 1px solid #fecaca; color: #b91c1c; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.s5-cp-pic-rem-btn:hover { background: #fee2e2; }
.s5-cp-pic-btn-cell { flex-direction: row !important; align-items: flex-end !important; justify-content: center; gap: 0 !important; align-self: end; padding-bottom: 4px; }
.s5-afb-red { border-color: #fecaca !important; background: #fff5f5 !important; color: #b91c1c !important; }
.s5-afb-red:hover { border-color: #dc2626 !important; background: #fee2e2 !important; }
.s5-cp-th-inner { display: flex; align-items: center; gap: 4px; }
.s5-cp-manage-link { font-size: 10px; font-weight: 600; color: #3b82f6; cursor: pointer; text-decoration: underline; white-space: nowrap; }
.s5-cp-manage-link:hover { color: #2563eb; }
/* Manage modal */
.s5-cp-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 200; display: flex; align-items: center; justify-content: center; }
.s5-cp-modal { background: #fff; border-radius: 14px; padding: 24px; width: 380px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,.2); font-family: 'DM Sans', sans-serif; }
.s5-cp-modal-title { font-size: 15px; font-weight: 800; color: #1f2937; margin-bottom: 16px; }
.s5-cp-opt-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.s5-cp-opt-item { display: flex; align-items: center; gap: 8px; }
.s5-cp-opt-item input { flex: 1; padding: 7px 10px; border: 1.5px solid #e5e7eb; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; color: #1f2937; }
.s5-cp-opt-item input:focus { border-color: #16a34a; }
.s5-cp-opt-del { width: 26px; height: 26px; border-radius: 50%; border: 1px solid #fecaca; background: #fff5f5; color: #b91c1c; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; font-size: 14px; font-weight: 700; }
.s5-cp-opt-del:hover { background: #fee2e2; }
.s5-cp-opt-add-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1.5px dashed #bbf7d0; border-radius: 7px; background: #f0fdf4; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; color: #15803d; cursor: pointer; }
.s5-cp-opt-add-btn:hover { border-color: #16a34a; }
.s5-cp-modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; border-top: 1px solid #e5e7eb; padding-top: 16px; }
.s5-cp-modal-btn { padding: 8px 20px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; border: 1.5px solid #e5e7eb; background: #fff; color: #1f2937; }
.s5-cp-modal-btn:hover { background: #f9fafb; }
.s5-cp-modal-btn-ok { border-color: #16a34a; background: #15803d; color: #fff; }
.s5-cp-modal-btn-ok:hover { background: #16a34a; }
@media (max-width: 640px) { .s5-cp-pic-row { grid-template-columns: 1fr 1fr; } }
.s5-ins-section { padding: 18px 24px; border-bottom: 1.5px dashed #e5e7eb; }
.s5-ins-section:last-child { border-bottom: none; }
.s5-ins-section-label { font-size: 12px; font-weight: 700; color: #6b7280; letter-spacing: .04em; margin-bottom: 12px; }
.s5-ins-row { display: flex; align-items: center; gap: 16px; }
.s5-ins-dl-label { font-size: 13px; font-weight: 600; color: #1f2937; }
.s5-ins-dl-btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 20px; border-radius: 8px; border: 1.5px solid #bbf7d0; background: #15803d; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .18s; }
.s5-ins-dl-btn:hover { background: #16a34a; }
.s5-ins-doc-modes { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
.s5-ins-doc-mode { border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 14px 16px; cursor: pointer; transition: all .18s; }
.s5-ins-doc-mode:hover { border-color: #bbf7d0; background: #f0fdf4; }
.s5-ins-doc-mode.active { border-color: #16a34a; background: #f0fdf4; }
.s5-ins-doc-mode-header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 2px; }
.s5-ins-doc-radio { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #e5e7eb; flex-shrink: 0; margin-top: 2px; transition: all .18s; background: #fff; display: flex; align-items: center; justify-content: center; }
.s5-ins-doc-radio.act { border-color: #15803d; background: #15803d; }
.s5-ins-doc-radio.act::after { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #fff; display: block; }
.s5-ins-doc-mode-title { font-size: 12px; font-weight: 700; color: #1f2937; }
.s5-ins-doc-mode-hint { font-size: 10px; color: #9ca3af; margin-top: 2px; }
.s5-ins-choose-row { display: flex; justify-content: center; margin: 10px 0 8px; }
.s5-ins-choose-zone { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 10px 18px; border-radius: 8px; border: 1.5px dashed #3b82f6; background: #eff6ff; cursor: pointer; transition: all .18s; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; color: #3b82f6; user-select: none; }
.s5-ins-choose-zone:hover { background: #dbeafe; border-color: #2563eb; color: #1d4ed8; }
.s5-ins-doc-mode.active .s5-ins-choose-zone { background: #dbeafe; border-color: #2563eb; }
.s5-ins-doc-preview { min-height: 72px; border: 1.5px dashed #e5e7eb; border-radius: 9px; background: #fff; margin-top: 8px; display: flex; align-items: center; justify-content: center; transition: all .18s; overflow: hidden; padding: 8px; }
.s5-ins-doc-mode.active .s5-ins-doc-preview { border-color: #bbf7d0; background: #f0fdf4; }
.s5-ins-doc-preview-empty { display: flex; flex-direction: column; align-items: center; gap: 6px; color: #9ca3af; font-size: 11px; }
.s5-ins-doc-file-row { display: flex; align-items: center; gap: 10px; width: 100%; padding: 6px 4px; }
.s5-ins-doc-file-row input[readonly], .s5-ins-doc-file-chip input[readonly] { cursor: default; pointer-events: none; }
.s5-ins-doc-file-row input.editing, .s5-ins-doc-file-chip input.editing { background: #fff !important; border: 1px solid #16a34a !important; border-radius: 4px; padding: 4px 6px !important; pointer-events: auto; }
.s5-ins-doc-file-icon { font-size: 26px; flex-shrink: 0; }
.s5-ins-doc-file-info { flex: 1; min-width: 0; }
.s5-ins-doc-file-name { font-size: 12px; font-weight: 700; color: #15803d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.s5-ins-doc-file-size { font-size: 10px; color: #9ca3af; }
.s5-ins-doc-file-del { width: 22px; height: 22px; border-radius: 50%; border: 1px solid #fecaca; background: #fff5f5; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all .15s; }
.s5-ins-doc-file-del:hover { background: #fee2e2; }
.s5-ins-doc-files-grid { display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-start; width: 100%; padding: 4px; }
.s5-ins-doc-file-chip { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 58px; position: relative; cursor: default; }
.s5-ins-doc-file-chip-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 22px; background: #f3f4f6; border: 1px solid #e5e7eb; }
.s5-ins-doc-file-chip-icon.pdf { background: #fff1f0; border-color: #fecaca; }
.s5-ins-doc-file-chip-icon.xlsx { background: #f0fdf4; border-color: #bbf7d0; }
.s5-ins-doc-file-chip-icon.docx { background: #eff6ff; border-color: #bfdbfe; }
.s5-ins-doc-file-chip-icon.img { background: #fdf4ff; border-color: #e9d5ff; }
.s5-ins-doc-file-chip-name { font-size: 9px; color: #6b7280; text-align: center; line-height: 1.3; max-width: 58px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.s5-ins-chip-name-wrap { position: relative; display: flex; flex-direction: column; align-items: center; width: 58px; }
.s5-ins-chip-name-inp { border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 9px; color: #6b7280; text-align: center; width: 52px; outline: none; padding: 1px 2px; border-radius: 3px; cursor: text; transition: all .15s; overflow: hidden; text-overflow: ellipsis; }
.s5-ins-chip-name-inp:hover { background: rgba(0,0,0,.05); }
.s5-ins-chip-name-inp:focus { background: #fff; box-shadow: 0 0 0 2px rgba(22,163,74,.2); width: 72px; }
.s5-ins-chip-pencil { display: flex; align-items: center; justify-content: center; color: #9ca3af; opacity: 1; transition: color .15s; pointer-events: none; line-height: 1; }
.s5-ins-doc-file-chip:hover .s5-ins-chip-pencil { color: #15803d; }
.s5-ins-doc-file-chip-del { position: absolute; top: -5px; right: -5px; width: 16px; height: 16px; border-radius: 50%; background: #b91c1c; color: #fff; border: none; font-size: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .15s; }
.s5-ins-doc-file-chip:hover .s5-ins-doc-file-chip-del { opacity: 1; }
.s5-ins-doc-add-chip { width: 40px; height: 40px; border-radius: 8px; border: 1.5px dashed #bbf7d0; background: #f0fdf4; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; color: #15803d; }
.s5-ins-doc-add-chip:hover { border-color: #16a34a; background: #dcfce7; }
.s5-ins-doc-checklist { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border: 1.5px solid #e5e7eb; border-radius: 9px; background: #f3f4f6; cursor: pointer; user-select: none; transition: all .18s; }
.s5-ins-doc-checklist:hover { border-color: #bbf7d0; background: #f0fdf4; }
.s5-ins-doc-checklist.chk { border-color: #bbf7d0; background: #f0fdf4; }
.s5-ins-doc-chk-box { width: 18px; height: 18px; border-radius: 4px; border: 2px solid #e5e7eb; flex-shrink: 0; display: flex; align-items: center; justify-content: center; margin-top: 1px; transition: all .18s; background: #fff; }
.s5-ins-doc-checklist.chk .s5-ins-doc-chk-box { background: #15803d; border-color: #15803d; }
.s5-ins-doc-checklist.chk .s5-ins-doc-chk-box::after { content: '\2713'; color: #fff; font-size: 11px; font-weight: 700; }
.s5-ins-doc-chk-text { font-size: 12px; color: #6b7280; line-height: 1.6; }
.s5-ins-doc-chk-link { color: #15803d; font-weight: 600; text-decoration: underline; text-underline-offset: 2px; }
@media (max-width: 600px) { .s5-ins-doc-modes { grid-template-columns: 1fr; } }
.s5-or-badge { font-size: 11px; font-weight: 700; letter-spacing: .08em; padding: 4px 12px; border-radius: 6px; background: #15803d; color: #fff; }
.s5-or-change-btn { display: inline-flex; align-items: center; gap: 6px; padding: 5px 13px; border-radius: 7px; border: 1.5px solid #e5e7eb; background: #fff; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; color: #6b7280; cursor: pointer; transition: all .15s; }
.s5-or-change-btn:hover { border-color: #fde68a; background: #fffbeb; color: #d97706; }
.s5-or-rate-grid { display: grid; grid-template-columns: repeat(5,1fr) !important; gap: 12px; padding: 16px 24px; }
.s5-or-rate-item { display: flex; flex-direction: column; gap: 4px; }
.s5-or-rate-label { font-size: 10px; font-weight: 700; color: #6b7280; letter-spacing: .05em; text-transform: uppercase; }
.s5-or-rate-val { font-size: 13px; font-weight: 700; color: #1f2937; }
.s5-or-rate-sub { font-size: 11px; color: #9ca3af; }
.s5-or-section-hd { font-size: 11px; font-weight: 700; color: #6b7280; letter-spacing: .07em; text-transform: uppercase; padding: 16px 32px 0; }
.s5-or-section-body { padding: 16px 32px 24px; }
.s5-or-bk-fl { font-size: 10px; font-weight: 700; color: #6b7280; letter-spacing: .05em; text-transform: uppercase; margin-bottom: 5px; }
.s5-or-bk-field-group { display: flex; flex-direction: column; min-width: 130px; flex: 1; }
.s5-or-bk-sel { padding: 8px 26px 8px 10px; border: 1.5px solid #e5e7eb; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #1f2937; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 8px center; appearance: none; outline: none; cursor: pointer; transition: all .15s; width: 100%; }
.s5-or-bk-sel:focus { border-color: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,.1); }
.s5-or-bk-sel:disabled { background-color: #f3f4f6; color: #9ca3af; opacity: .65; cursor: not-allowed; }
.s5-or-bl-header { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 20px; }
.s5-or-bl-header-label { font-size: 12px; font-weight: 600; color: #6b7280; text-align: center; }
.s5-or-bl-tabs { display: flex; border: 1.5px solid #e5e7eb; border-radius: 9px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
.s5-or-bl-tab { padding: 9px 22px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; border: none; cursor: pointer; background: #fff; color: #6b7280; transition: all .18s; }
.s5-or-bl-tab + .s5-or-bl-tab { border-left: 1px solid #e5e7eb; }
.s5-or-bl-tab:hover { background: #f3f4f6; color: #1f2937; }
.s5-or-bl-tab-act { background: #15803d !important; color: #fff !important; }
.s5-or-bl-opts-disabled { opacity: .35; pointer-events: none; }
.s5-or-bl-opt-row { display: grid; grid-template-columns: 230px 54px 1fr; border: 1.5px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin-bottom: 10px; min-height: 56px; }
.s5-or-bl-opt-row:last-child { margin-bottom: 0; }
.s5-or-bl-radio-cell { display: flex; align-items: center; padding: 14px 16px; background: #f3f4f6; border-right: 1.5px solid #e5e7eb; }
.s5-or-bl-radio-lbl { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 12px; font-weight: 600; color: #1f2937; line-height: 1.45; }
.s5-or-bl-radio-lbl input[type="radio"] { display: none; }
.s5-or-bl-radio-dot { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #9ca3af; flex-shrink: 0; background: #fff; transition: all .15s; display: flex; align-items: center; justify-content: center; }
.s5-or-bl-radio-lbl input:checked + .s5-or-bl-radio-dot { border-color: #15803d; background: #15803d; }
.s5-or-bl-radio-lbl input:checked + .s5-or-bl-radio-dot::after { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #fff; display: block; }
.s5-or-bl-badge-cell { display: flex; flex-direction: column; border-right: 1.5px solid #e5e7eb; }
.s5-or-bl-badge { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #fff; letter-spacing: .05em; }
.s5-or-bl-badge.mbl { background: #15803d; }
.s5-or-bl-badge.hbl { background: #16a34a; border-top: 1px solid rgba(255,255,255,.25); }
.s5-or-bl-fields-cell { display: flex; flex-direction: column; justify-content: center; gap: 10px; padding: 12px 16px; }
.s5-or-bl-fields-row { display: flex; gap: 10px; flex-wrap: wrap; }
.s5-or-ft-wrap { display: flex; justify-content: center; align-items: center; width: 100%; padding: 6px 0; }
.s5-or-ft-grid { display: flex; flex-direction: column; gap: 14px; width: max-content; }
.s5-or-ft-row { display: flex; align-items: center; gap: 14px; }
.s5-or-ft-label { font-size: 13px; font-weight: 600; color: #1f2937; min-width: 210px; text-align: right; }
.s5-or-ft-input-wrap { display: flex; align-items: stretch; border: 1.5px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #fff; transition: border-color .15s; }
.s5-or-ft-input-wrap:focus-within { border-color: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,.1); }
.s5-or-ft-inp { width: 66px; padding: 8px 10px; border: none; outline: none; text-align: center; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700; color: #1f2937; background: transparent; }
.s5-or-ft-inp::-webkit-inner-spin-button, .s5-or-ft-inp::-webkit-outer-spin-button { -webkit-appearance: none; }
.s5-or-ft-plus, .s5-or-ft-minus { width: 34px; border: none; background: #f3f4f6; cursor: pointer; font-size: 18px; font-weight: 300; color: #6b7280; transition: all .15s; display: flex; align-items: center; justify-content: center; }
.s5-or-ft-plus { border-left: 1.5px solid #e5e7eb; }
.s5-or-ft-minus { border-right: 1.5px solid #e5e7eb; }
.s5-or-ft-plus:hover { background: #dcfce7; color: #15803d; border-color: #bbf7d0; }
.s5-or-ft-minus:hover { background: #fee2e2; color: #b91c1c; border-color: #fecaca; }
.s5-or-ft-unit { font-size: 13px; color: #6b7280; width: 32px; }
.s5-or-ca-list { display: flex; flex-direction: column; gap: 10px; padding: 0 40px; }
.s5-or-ca-row { display: grid; grid-template-columns: 28px 200px 190px 1fr; align-items: center; gap: 14px; padding: 14px 20px; border: 1.5px solid #e5e7eb; border-radius: 10px; background: #fafafa; transition: all .18s; }
.s5-or-ca-row:hover { background: #f0fdf4; border-color: #bbf7d0; }
.s5-or-ca-num { width: 26px; height: 26px; border-radius: 50%; background: #15803d; color: #fff; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.s5-or-ca-name { font-size: 12px; font-weight: 700; color: #1f2937; letter-spacing: .04em; text-transform: uppercase; }
.s5-or-ca-pp-toggle { display: flex; border: 1.5px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
.s5-or-ca-pp-opt { flex: 1; padding: 8px 12px; text-align: center; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; cursor: pointer; border: none; background: #fff; color: #6b7280; transition: all .15s; }
.s5-or-ca-pp-opt + .s5-or-ca-pp-opt { border-left: 1px solid #e5e7eb; }
.s5-or-ca-pp-opt:hover:not(.active) { background: #f3f4f6; color: #1f2937; }
.s5-or-ca-pp-opt.active { background: #15803d; color: #fff; }
.s5-or-ca-payer-wrap { display: flex; align-items: center; gap: 8px; }
.s5-or-ca-payer-lbl { font-size: 10px; font-weight: 700; color: #15803d; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; }
.s5-or-ca-payer-sel { flex: 1; padding: 8px 26px 8px 10px; border: 1.5px solid #bbf7d0; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; color: #1f2937; background: #f0fdf4 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2315803d' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 8px center; appearance: none; outline: none; cursor: pointer; transition: all .15s; }
.s5-or-ca-payer-sel:focus { border-color: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,.12); }
@media (max-width: 700px) { .s5-or-rate-grid { grid-template-columns: 1fr 1fr !important; } .s5-or-ca-row { grid-template-columns: 28px 1fr; } }
.s5-av-bk-grid { display: grid; grid-template-columns: 1fr 1fr auto; gap: 16px; align-items: start; padding: 16px 24px; }
.s5-av-bk-field { display: flex; flex-direction: column; gap: 5px; }
.s5-av-bk-inp { padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #1f2937; outline: none; transition: all .15s; width: 100%; }
.s5-av-bk-inp:focus { border-color: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,.1); }
.s5-av-bk-inp::placeholder { color: #9ca3af; }
.s5-av-chip-zone { display: flex; flex-direction: column; gap: 5px; min-height: 36px; padding: 6px 10px; border: 1.5px solid #e5e7eb; border-radius: 8px; background: #fff; transition: border-color .15s; }
.s5-av-chip-row { display: flex; align-items: center; }
.s5-av-add-row { display: flex; align-items: center; }
.s5-av-chip-zone:focus-within { border-color: #bbf7d0; }
.s5-av-chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 6px 4px 10px; border: 1.5px solid #e5e7eb; border-radius: 20px; background: #f9fafb; font-size: 11px; font-weight: 600; color: #1f2937; transition: all .15s; max-width: 200px; }
.s5-av-chip:hover { border-color: #bbf7d0; background: #f0fdf4; }
.s5-av-chip-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0; }
.s5-av-chip-del { width: 16px; height: 16px; border-radius: 50%; border: 1px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; font-size: 12px; line-height: 1; color: #6b7280; transition: all .15s; }
.s5-av-chip-del:hover { background: #fee2e2; border-color: #fecaca; color: #b91c1c; }
.s5-av-add-btn { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border: 1.5px dashed #bbf7d0; border-radius: 7px; background: #f0fdf4; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; color: #15803d; cursor: pointer; transition: all .15s; user-select: none; }
.s5-av-add-btn:hover { border-color: #16a34a; background: #dcfce7; }
@media (max-width: 700px) { .s5-av-bk-grid { grid-template-columns: 1fr; } }
.s5-tab-bar { margin-bottom: 20px; }
.s5-tab-bar .service-tab-btn { font-size: 11px; }
.s5-sc-row { display: grid; grid-template-columns: 220px 1fr 130px 1fr; gap: 12px; align-items: center; }
.s5-sc-chk-lbl { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
.s5-sc-chk-box { width: 18px; height: 18px; border-radius: 4px; border: 2px solid #d1d5db; background: #fff; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all .18s; }
.s5-sc-chk-box.on { background: #16a34a; border-color: #16a34a; }
.s5-sc-chk-txt { font-size: 13px; font-weight: 600; color: #1f2937; }
.s5-sc-num-inp { padding: 7px 11px; border: 1.5px solid #e5e7eb; border-radius: 7px; font-family: 'DM Sans', sans-serif; font-size: 12px; color: #1f2937; outline: none; transition: all .15s; width: 100%; background: #fff; }
.s5-sc-num-inp:focus { border-color: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,.1); }
.s5-sc-num-inp.disabled { background: #f3f4f6; color: #9ca3af; cursor: not-allowed; }
/* Fix disabled date picker icon in contract/quotation rows */
.s5-sc-row .en-dtp-wrap input:disabled { background-image: none !important; padding-right: 14px !important; }
/* Booking confirmation file chip */
.s5-bk-chip { display: flex; align-items: center; gap: 5px; padding: 4px 8px 4px 10px; border: 1.5px solid #e5e7eb; border-radius: 20px; background: #f9fafb; font-size: 11px; font-weight: 600; color: #1f2937; cursor: default; transition: all .15s; width: fit-content; max-width: 100%; }
.s5-bk-chip:hover { border-color: #bbf7d0; background: #f0fdf4; }
.s5-bk-chip.up { border-color: #bbf7d0; background: #f0fdf4; }
.s5-bk-chip-inp { border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 600; color: inherit; outline: none; min-width: 40px; max-width: 160px; padding: 0 2px 1px; cursor: text; border-bottom: 1.5px dashed #bbf7d0; transition: all .15s; width: 120px; }
.s5-bk-chip-inp.first { border-bottom: none; cursor: inherit; pointer-events: none; width: 140px; }
.s5-bk-chip-inp:focus { border-bottom-color: #16a34a; }
.s5-bk-tick-circle { display: flex; align-items: center; justify-content: center; width: 16px; height: 16px; border-radius: 50%; background: #15803d; flex-shrink: 0; }
.s5-bk-chip-del { width: 16px; height: 16px; border-radius: 50%; border: 1px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; padding: 0; transition: all .15s; }
.s5-bk-chip-del:hover { background: #fee2e2; border-color: #fecaca; }
.s5-sc-info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 14px; align-items: end; }
@media (max-width: 700px) { .s5-sc-row { grid-template-columns: 1fr 1fr; } .s5-sc-info-grid { grid-template-columns: 1fr 1fr; } }
.s5-sbl-mbl-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; align-items: end; }
.s5-sbl-ibl-grid { display: grid; grid-template-columns: 1.2fr 1fr 1.3fr; grid-template-rows: auto auto; gap: 0 16px; align-items: start; }
.s5-sbl-ibl-grid .s5-or-bk-fl { align-self: start; padding-bottom: 6px; }
.s5-sbl-inp { width: 100%; height: 38px; padding: 8px 11px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: #1f2937; background: #fff; outline: none; transition: all .18s; }
.s5-sbl-inp::placeholder { color: #9ca3af; font-weight: 400; }
.s5-sbl-inp:hover { border-color: #bbf7d0; }
.s5-sbl-inp:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,.1); }
.s5-sbl-label { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #6b7280; letter-spacing: .05em; text-transform: uppercase; }
.s5-sbl-label svg { color: #15803d; flex-shrink: 0; }
.s5-sbl-doctype-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.s5-sbl-doctype-card { display: flex; align-items: flex-start; gap: 11px; padding: 13px 15px; border: 1.5px solid #e5e7eb; border-radius: 10px; background: #fff; cursor: pointer; transition: all .18s; user-select: none; }
.s5-sbl-doctype-card:hover { border-color: #bbf7d0; background: #f0fdf4; }
.s5-sbl-doctype-card.selected { border-color: #16a34a; background: #f0fdf4; }
.s5-sbl-doctype-radio { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #9ca3af; background: #fff; flex-shrink: 0; margin-top: 2px; transition: all .18s; display: flex; align-items: center; justify-content: center; }
.s5-sbl-doctype-radio.selected { border-color: #15803d; background: #15803d; }
.s5-sbl-doctype-radio.selected::after { content: ''; width: 5px; height: 5px; border-radius: 50%; background: #fff; }
.s5-sbl-doctype-body { display: flex; flex-direction: column; gap: 3px; }
.s5-sbl-doctype-title { font-size: 13px; font-weight: 700; color: #1f2937; }
.s5-sbl-doctype-hint { font-size: 11px; color: #9ca3af; line-height: 1.4; }
.s5-sbl-doctype-card.selected .s5-sbl-doctype-hint { color: #15803d; opacity: .7; }
.s5-sbl-provide-pills { display: inline-flex; gap: 8px; }
.s5-sbl-provide-pill { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: #fff; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all .18s; }
.s5-sbl-provide-pill:hover { border-color: #bbf7d0; color: #1f2937; }
.s5-sbl-provide-pill.selected { border-color: #15803d; background: #15803d; color: #fff; }
.s5-sbl-provide-pill.later.selected { border-color: #d97706; background: #d97706; color: #fff; }
.s5-sbl-provide-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; opacity: .5; flex-shrink: 0; transition: opacity .15s; }
.s5-sbl-provide-pill.selected .s5-sbl-provide-dot { opacity: 1; background: #fff; }
.s5-sbl-blocked { opacity: .38; pointer-events: none; user-select: none; transition: opacity .2s; }
.s5-sbl-frow { display: flex; align-items: center; gap: 10px; padding: 9px 13px; border: 1.5px solid #e5e7eb; border-radius: 9px; background: #fff; transition: all .18s; }
.s5-sbl-frow:hover { border-color: #bbf7d0; background: #f0fdf4; }
.s5-sbl-frow-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.s5-sbl-frow .s5-frn-t { display: flex; align-items: center; gap: 6px; }
.s5-sbl-frow .s5-frn-t input { border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; color: #1f2937; outline: none; flex: 1; min-width: 0; padding: 0; cursor: text; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.s5-sbl-frow .s5-frn-t input[readonly] { cursor: default; pointer-events: none; }
.s5-sbl-frow .s5-frn-t input.editing { background: #fff; border: 1px solid #16a34a; border-radius: 4px; padding: 4px 6px; pointer-events: auto; }
.s5-sbl-fname { font-size: 12px; font-weight: 600; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.s5-sbl-fdel { width: 22px; height: 22px; border-radius: 50%; border: 1px solid #fecaca; background: #fff5f5; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; font-size: 14px; color: #dc2626; transition: all .15s; }
.s5-sbl-fdel:hover { background: #fee2e2; }
.s5-sbl-fbtn { width: 26px; height: 26px; border-radius: 50%; border: 1.5px solid #e5e7eb; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; flex-shrink: 0; }
.s5-sbl-bf-row { display: flex; align-items: center; gap: 14px; padding: 9px 13px; border: 1.5px solid #bbf7d0; border-top: none; border-radius: 0 0 9px 9px; background: #f0fdf4; margin-bottom: 7px; }
.s5-sbl-later-note { display: flex; align-items: flex-start; gap: 9px; padding: 12px 16px; border-radius: 9px; background: #fffbeb; border: 1.5px dashed #fde68a; font-size: 12px; color: #d97706; font-weight: 500; line-height: 1.5; }
.s5-sbl-later-note svg { flex-shrink: 0; margin-top: 1px; }
@media (max-width: 900px) { .s5-sbl-mbl-grid { grid-template-columns: repeat(3, 1fr); } .s5-sbl-ibl-grid { grid-template-columns: 1fr 1fr; } }
.s5-uo-act { border-color: #16a34a !important; background: #f0fdf4 !important; }
.s5-uo-act .s5-uor { border-color: #15803d !important; background: #15803d !important; }
.s5-uo-act .s5-uor::after { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #fff; }
.s5-uo-act .s5-uot { color: #15803d !important; }
.s5-sar-act { border-color: #16a34a !important; background: #dcfce7 !important; }
.s5-sar-act .s5-sc { background: #15803d !important; border-color: #15803d !important; }
.s5-sar-act .s5-sc::after { content: '✓'; color: #fff; font-size: 13px; font-weight: 700; }
.s5-cr-act .s5-crc { background: #15803d !important; border-color: #15803d !important; }
.s5-cr-act .s5-crc::after { content: '✓'; color: #fff; font-size: 11px; font-weight: 700; }
.s5-uo-act-red { border-color: #dc2626 !important; background: #fff5f5 !important; }
.s5-uo-act-red .s5-uor { border-color: #dc2626 !important; background: #dc2626 !important; }
.s5-uo-act-red .s5-uor::after { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #fff; }
.s5-uo-act-red .s5-uot { color: #dc2626 !important; }
.s5-ins-mode-row { display: flex; gap: 10px; }
.s5-ins-mode { flex: 1; display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1.5px solid #e5e7eb; border-radius: 9px; cursor: pointer; transition: all .18s; user-select: none; }
.s5-ins-mode:hover { border-color: #bbf7d0; background: #f0fdf4; }
.s5-ins-mode-act { border-color: #16a34a !important; background: #f0fdf4; }
.s5-ins-mode-radio { width: 16px; height: 16px; border-radius: 50%; border: 2px solid #e5e7eb; flex-shrink: 0; transition: all .18s; }
.s5-ins-mode-act .s5-ins-mode-radio { border-color: #15803d; background: #15803d; box-shadow: inset 0 0 0 3px #f0fdf4; }
.s5-ins-mode-label { font-size: 12px; font-weight: 600; color: #1f2937; }
.s5-ins-mode-hint { font-size: 10px; color: #9ca3af; }
.s5-ins-upload-zone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 110px; border: 2px dashed #bbf7d0; border-radius: 10px; background: #f0fdf4; cursor: pointer; transition: all .18s; padding: 16px; }
.s5-ins-upload-zone:hover { border-color: #16a34a; background: #dcfce7; }
.s5-ins-upload-title { font-size: 13px; font-weight: 600; color: #15803d; text-align: center; }
.s5-ins-upload-hint { font-size: 11px; color: #9ca3af; text-align: center; }
.s5-cop-sel { border-color: #16a34a !important; background: #f0fdf4 !important; box-shadow: 0 0 0 3px rgba(22,163,74,.06) !important; }
.s5-cop-sel .s5-cop-num { border-color: #15803d !important; background: #15803d !important; color: #fff !important; }
.s5-cop-sel .s5-cop-hint { display: block !important; }
.s5-cop-sel .s5-cop-pb { display: flex !important; }
.s5-cop-pb { display: none; align-items: center; gap: 8px; font-size: 12px; color: #6b7280; margin-left: auto; flex-shrink: 0; }
.s5-upload-step { display: flex; gap: 14px; padding: 16px 0; border-bottom: 1px solid #f3f4f6; }
.s5-upload-step:last-child { border-bottom: none; padding-bottom: 0; }
.s5-upload-step:first-child { padding-top: 0; }
.s5-upload-step-num { font-size: 16px; font-weight: 700; color: #15803d; flex-shrink: 0; width: 24px; text-align: center; padding-top: 1px; }
.s5-upload-step-body { flex: 1; min-width: 0; }
.s5-dal-label { font-size: 12px; font-weight: 600; color: #6b7280; margin-bottom: 8px; }
</style>
