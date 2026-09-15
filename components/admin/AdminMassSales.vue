<template>
  <div class="ms-wrap">
    <div class="ms-subtabs">
      <button
        v-for="tab in massSalesTabs"
        :key="tab.id"
        type="button"
        :disabled="loading || saving"
        :class="{ active: subTab === tab.id }"
        @click="selectSubTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="backendWarning" class="ms-warning">{{ backendWarning }}</div>

    <section v-if="subTab === 'basic'" class="ms-section">
      <div class="ms-toolbar ms-workspace-toolbar ms-basic-toolbar">
        <button class="ms-btn" type="button" :disabled="loading || saving" @click="addBasic">Add +</button>
        <button class="ms-btn danger" type="button" :disabled="loading || !selected.size || saving" @click="removeSelected('basic')">Remove -</button>
        <span class="ms-separator"></span>
        <select v-model="filters.basicField" class="ms-input compact" :disabled="loading">
          <option value="all">All</option>
          <option v-for="field in basicFields" :key="field.key" :value="field.key">{{ field.label }}</option>
        </select>
        <input v-model.trim="filters.basicTerm" class="ms-input search" :disabled="loading" placeholder="Search&hellip;" />
        <button v-if="filters.basicTerm" class="ms-chip" type="button" :disabled="loading" @click="filters.basicTerm = ''">Clear &#x2715;</button>
        <span class="ms-spacer"></span>
        <button class="ms-btn" type="button" :disabled="loading || !filteredBasic.length" @click="exportBasic">Export File</button>
      </div>
      <div class="ms-tablewrap ms-workspace-scroll">
        <table class="ms-table ms-workspace-table ms-basic-table">
          <colgroup><col style="width:36px"><col style="width:48px"><col style="width:120px"><col style="width:150px"><col style="width:210px"><col style="width:80px"><col style="width:108px"><col style="width:92px"><col style="width:96px"><col style="width:160px"><col style="width:186px"></colgroup>
          <thead>
            <tr>
              <th class="ms-select"><input type="checkbox" :disabled="loading" :checked="allVisibleSelected(filteredBasic)" @change="toggleAllVisible(filteredBasic, $event)" /></th>
              <th>Order</th><th>Date</th><th>ClientCode</th><th>ClientName</th><th>Type</th><th>ServiceType</th><th>OrgTerm</th><th>DestTerm</th><th>Origin/ToPortCode</th><th>Destination/FromPortCode</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="11" class="ms-empty">Loading…</td></tr>
            <tr v-for="(record, index) in filteredBasic" v-else :key="record.id" :class="{ locked: dataOf(record).locked }">
              <td class="ms-select"><input type="checkbox" :disabled="loading" :checked="selected.has(record.id)" @change="toggleSelected(record.id, $event)" /></td>
              <td class="ms-order">{{ index + 1 }}</td>
              <td><input type="date" :value="dataOf(record).date" :disabled="loading || dataOf(record).locked" @change="updateBasic(record, 'date', eventValue($event))" /></td>
              <td class="ms-client-cell">
                <template v-if="dataOf(record).clientCode">
                  <button class="ms-client-link" type="button" :disabled="loading" @click="openClientDetail(dataOf(record).clientCode)">{{ dataOf(record).clientCode }}</button>
                  <button v-if="!dataOf(record).locked" class="ms-client-pencil" type="button" :disabled="loading" title="Change client" @click="openClientPicker(record)">✎</button>
                </template>
                <button v-else-if="!dataOf(record).locked" class="ms-detail" type="button" :disabled="loading" @click="openClientPicker(record)">ADD+</button>
                <span v-else>—</span>
              </td>
              <td><input :value="dataOf(record).clientName" disabled /></td>
              <td><select :value="dataOf(record).type" :disabled="loading || dataOf(record).locked" @change="updateBasic(record, 'type', eventValue($event))"><option v-for="type in transportTypes" :key="type">{{ type }}</option></select></td>
              <td><select :value="dataOf(record).serviceType" :disabled="loading || dataOf(record).locked" @change="updateBasic(record, 'serviceType', eventValue($event))"><option>Single</option><option>Combine</option></select></td>
              <td><select :value="dataOf(record).orgTerm" :disabled="loading || dataOf(record).locked" @change="updateBasic(record, 'orgTerm', eventValue($event))"><option v-for="term in originTermOptions(dataOf(record))" :key="term">{{ term }}</option></select></td>
              <td><select :value="dataOf(record).destTerm" :disabled="loading || dataOf(record).locked" @change="updateBasic(record, 'destTerm', eventValue($event))"><option v-for="term in destinationTermOptions(dataOf(record))" :key="term">{{ term }}</option></select></td>
              <td><input :value="dataOf(record).origin" :list="dataOf(record).type === 'AIR' ? 'ms-airport-codes' : 'ms-port-codes'" :disabled="loading || dataOf(record).locked" @change="updateBasic(record, 'origin', eventValue($event))" /></td>
              <td><input :value="dataOf(record).destination" :list="dataOf(record).type === 'AIR' ? 'ms-airport-codes' : 'ms-port-codes'" :disabled="loading || dataOf(record).locked" @change="updateBasic(record, 'destination', eventValue($event))" /></td>
            </tr>
            <tr v-if="!loading && !filteredBasic.length"><td colspan="11" class="ms-empty">No data yet. Click “Add”.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-else-if="subTab === 'content'" class="ms-section">
      <div class="ms-toolbar ms-workspace-toolbar">
        <button class="ms-btn primary" type="button" :disabled="loading || saving" @click="addContent">Add +</button>
        <button class="ms-btn danger" type="button" :disabled="loading || !selected.size || saving" @click="removeSelected('content')">Remove -</button>
        <button class="ms-btn orange" type="button" :disabled="loading || !selected.size || saving" @click="unlockSelectedContent">Edit</button>
      </div>
      <div class="ms-tablewrap ms-workspace-scroll">
        <table class="ms-table ms-workspace-table ms-content-table">
          <colgroup><col style="width:36px"><col style="width:44px"><col style="width:200px"><col style="width:80px"><col style="width:104px"><col style="width:92px"><col style="width:96px"><col style="width:150px"><col style="width:176px"><col style="width:104px"><col style="width:84px"></colgroup>
          <thead><tr><th class="ms-select"><input type="checkbox" :disabled="loading" :checked="allVisibleSelected(contentRows)" @change="toggleAllVisible(contentRows, $event)" /></th><th>Order</th><th>ContentID</th><th>Type</th><th>ServiceType</th><th>OrgTerm</th><th>DestTerm</th><th>Origin/ToPortCode</th><th>Destination/FromPortCode</th><th>ContentDetail</th><th></th></tr></thead>
          <tbody>
            <tr v-for="(record, index) in contentRows" :key="record.id" :class="{ locked: dataOf(record).locked }">
              <td class="ms-select"><input type="checkbox" :disabled="loading" :checked="selected.has(record.id)" @change="toggleSelected(record.id, $event)" /></td>
              <td class="ms-order">{{ index + 1 }}</td>
              <td class="ms-code">{{ dataOf(record).contentId || '—' }}</td>
              <td><select :value="dataOf(record).type" :disabled="loading || dataOf(record).locked" @change="updateContent(record, 'type', eventValue($event))"><option v-for="type in transportTypes" :key="type">{{ type }}</option></select></td>
              <td><select :value="dataOf(record).serviceType" :disabled="loading || dataOf(record).locked" @change="updateContent(record, 'serviceType', eventValue($event))"><option>Single</option><option>Combine</option></select></td>
              <td><select :value="dataOf(record).orgTerm" :disabled="loading || dataOf(record).locked" @change="updateContent(record, 'orgTerm', eventValue($event))"><option v-for="term in originTermOptions(dataOf(record))" :key="term">{{ term }}</option></select></td>
              <td><select :value="dataOf(record).destTerm" :disabled="loading || dataOf(record).locked" @change="updateContent(record, 'destTerm', eventValue($event))"><option v-for="term in destinationTermOptions(dataOf(record))" :key="term">{{ term }}</option></select></td>
              <td><input :value="dataOf(record).origin" :list="dataOf(record).type === 'AIR' ? 'ms-airport-codes' : 'ms-port-codes'" :disabled="loading || dataOf(record).locked" @change="updateContent(record, 'origin', eventValue($event))" /></td>
              <td><input :value="dataOf(record).destination" :list="dataOf(record).type === 'AIR' ? 'ms-airport-codes' : 'ms-port-codes'" :disabled="loading || dataOf(record).locked" @change="updateContent(record, 'destination', eventValue($event))" /></td>
              <td><button class="ms-detail" :class="{ ready: dataOf(record).contentId }" type="button" :disabled="loading" @click="openContentDetail(record)">DETAIL</button></td>
              <td><button class="ms-detail save" type="button" :disabled="loading || dataOf(record).locked" @click="saveContent(record)">Save</button></td>
            </tr>
            <tr v-if="!contentRows.length"><td colspan="11" class="ms-empty">No content yet. Click “Add +”.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-else-if="subTab === 'signature'" class="ms-section">
      <div class="ms-toolbar ms-workspace-toolbar">
        <button class="ms-btn primary" type="button" :disabled="loading || saving" @click="addSignature">Add +</button>
        <button class="ms-btn danger" type="button" :disabled="loading || !selected.size || saving" @click="removeSelected('signature')">Remove -</button>
      </div>
      <div class="ms-tablewrap ms-workspace-scroll signature-wrap">
        <table class="ms-table ms-workspace-table ms-signature-table">
          <colgroup><col style="width:36px"><col style="width:48px"><col style="width:220px"><col style="width:120px"></colgroup>
          <thead><tr><th class="ms-select"><input type="checkbox" :disabled="loading" :checked="allVisibleSelected(signatureRows)" @change="toggleAllVisible(signatureRows, $event)" /></th><th>Order</th><th>SignID</th><th>SignDetail</th></tr></thead>
          <tbody>
            <tr v-for="(record, index) in signatureRows" :key="record.id">
              <td class="ms-select"><input type="checkbox" :disabled="loading" :checked="selected.has(record.id)" @change="toggleSelected(record.id, $event)" /></td>
              <td class="ms-order">{{ index + 1 }}</td>
              <td class="ms-code">{{ dataOf(record).country || '—' }}</td>
              <td><button class="ms-detail" :class="{ ready: dataOf(record).signId }" type="button" :disabled="loading" @click="openSignatureDetail(record)">DETAIL</button></td>
            </tr>
            <tr v-if="!signatureRows.length"><td colspan="4" class="ms-empty">No signature yet. Click “Add +”.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-else class="ms-section">
      <div class="ms-toolbar ms-workspace-toolbar campaign-toolbar">
        <button class="ms-btn primary" type="button" :disabled="loading || saving" @click="openCampaignForm()">Add Campaign +</button>
        <button class="ms-btn danger" type="button" :disabled="loading || !selected.size || saving" @click="removeSelected('campaign')">Remove -</button>
        <button class="ms-btn orange" type="button" :disabled="loading || selected.size !== 1 || saving" @click="editSelectedCampaign">Edit</button>
        <span class="ms-separator"></span>
        <select v-model="filters.campaignField" class="ms-input compact" :disabled="loading"><option value="all">All</option><option v-for="field in campaignFields" :key="field.key" :value="field.key">{{ field.label }}</option></select>
        <input v-model.trim="filters.campaignTerm" class="ms-input search" :disabled="loading" placeholder="Search…" />
        <button v-if="filters.campaignTerm" class="ms-chip" type="button" :disabled="loading" @click="filters.campaignTerm = ''">Clear ×</button>
        <span class="ms-campaign-actions">
          <input v-model.trim="webhookUrl" class="ms-input webhook" :disabled="loading || saving" placeholder="Webhook URL (n8n)…" title="Where campaigns are POSTed to be actually sent" @change="saveWebhookSetting" />
          <button class="ms-btn" type="button" :disabled="loading || saving" @click="prepareTestEmail">Send a Test</button>
          <button class="ms-btn" type="button" :disabled="loading || saving" @click="startSelectedCampaigns">Start Campaign</button>
          <button class="ms-btn danger" type="button" :disabled="loading || saving" @click="stopSelectedCampaigns">Stop Campaign</button>
        </span>
      </div>
      <div class="ms-tablewrap ms-workspace-scroll">
        <table class="ms-table ms-workspace-table ms-campaign-table">
          <colgroup><col style="width:36px"><col style="width:44px"><col style="width:130px"><col style="width:110px"><col style="width:120px"><col style="width:64px"><col style="width:100px"><col style="width:84px"><col style="width:88px"><col style="width:130px"><col style="width:186px"><col style="width:180px"><col style="width:120px"><col style="width:160px"><col style="width:110px"><col style="width:90px"><col style="width:96px"><col style="width:96px"><col style="width:80px"></colgroup>
          <thead><tr><th class="ms-select"><input type="checkbox" :disabled="loading" :checked="allVisibleSelected(filteredCampaigns)" @change="toggleAllVisible(filteredCampaigns, $event)" /></th><th>Order</th><th>CampaignID</th><th>CampaignDate</th><th>ClientCode</th><th>Type</th><th>ServiceType</th><th>OrgTerm</th><th>DestTerm</th><th>Origin/ToPortCode</th><th>Destination/FromPortCode</th><th>SendingOption</th><th>VolumePerBatch</th><th>ContentID</th><th>SignID</th><th>Preview</th><th>Interval</th><th>Status</th><th>Progress</th></tr></thead>
          <tbody>
            <tr v-for="(record, index) in filteredCampaigns" :key="record.id" :class="{ locked: dataOf(record).locked }">
              <td class="ms-select"><input type="checkbox" :disabled="loading" :checked="selected.has(record.id)" @change="toggleSelected(record.id, $event)" /></td>
              <td class="ms-order">{{ index + 1 }}</td><td class="ms-code">{{ dataOf(record).campaignId }}</td><td>{{ dataOf(record).campaignDate }}</td>
              <td class="ms-code"><button v-if="dataOf(record).clientCode && dataOf(record).clientCode !== 'All'" class="ms-client-link" type="button" :disabled="loading" @click="openClientDetail(dataOf(record).clientCode)">{{ dataOf(record).clientCode }}</button><span v-else-if="dataOf(record).clientCode" class="ms-client-link">{{ dataOf(record).clientCode }}</span><span v-else>—</span></td>
              <td>{{ dataOf(record).type }}</td><td>{{ dataOf(record).serviceType }}</td><td>{{ dataOf(record).orgTerm }}</td><td>{{ dataOf(record).destTerm }}</td><td>{{ dataOf(record).origin }}</td><td>{{ dataOf(record).destination }}</td><td>{{ sendSummary(dataOf(record)) }}</td><td>{{ dataOf(record).volumePerBatch }}</td>
              <td><input :value="dataOf(record).contentId" list="ms-content-ids" :disabled="loading || dataOf(record).locked" placeholder="ContentID" @change="updateCampaignLink(record, 'contentId', eventValue($event))" /></td>
              <td><input :value="dataOf(record).signId" list="ms-sign-ids" :disabled="loading || dataOf(record).locked" placeholder="SignID" @change="updateCampaignLink(record, 'signId', eventValue($event))" /></td>
              <td><button class="ms-detail ready" type="button" :disabled="loading" @click="openPreview(record)">Preview</button></td>
              <td>{{ dataOf(record).batchInterval }} {{ dataOf(record).batchUnit === 'hour' ? 'h' : 'm' }}</td>
              <td><span class="ms-status" :class="`status-${dataOf(record).status || 'Draft'}`">{{ dataOf(record).status || 'Draft' }}</span></td>
              <td class="ms-code">{{ campaignProgress(dataOf(record)) }}</td>
            </tr>
            <tr v-if="!filteredCampaigns.length"><td colspan="19" class="ms-empty">No campaign yet. Click “Add Campaign”.</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <datalist id="ms-port-codes"><option v-for="code in portCodes" :key="code" :value="code"></option></datalist>
    <datalist id="ms-airport-codes"><option v-for="code in airportCodes" :key="code" :value="code"></option></datalist>
    <datalist id="ms-content-ids"><option v-for="content in contentIdOptions" :key="content" :value="content"></option></datalist>
    <datalist id="ms-sign-ids"><option v-for="signature in signIdOptions" :key="signature" :value="signature"></option></datalist>

    <div v-if="clientModal.open" class="ms-overlay" @click.self="closeClientModal">
      <div class="ms-modal client-picker">
        <header><h3>{{ clientModal.view === 'search' ? 'Link CLIENT' : clientModal.view === 'detail' ? 'CLIENT detail' : 'New CLIENT' }}</h3><button type="button" @click="closeClientModal">×</button></header>
        <div v-if="clientModal.view === 'search'" class="ms-modal-body">
          <div class="ms-client-search"><select v-model="clientModal.searchField"><option value="id">By ID</option><option value="namecode">By NameCode</option><option value="company">By Name</option></select><input v-model.trim="clientModal.term" placeholder="Search…" /><button class="ms-btn" type="button" @click="openNewClient">Add New</button></div>
          <button v-for="client in filteredClients" :key="client.record.id" class="ms-client-item" type="button" @click="showClientDetail(client.record)"><b>{{ client.code }}</b><span>{{ client.name }}</span></button>
          <div v-if="!filteredClients.length" class="ms-empty">No client found.</div>
        </div>
        <div v-else-if="clientModal.view === 'detail'" class="ms-modal-body">
          <div v-for="item in clientDetailRows" :key="item.label" class="ms-client-detail"><b>{{ item.label }}</b><span>{{ item.value || '—' }}</span></div>
        </div>
        <div v-else class="ms-modal-body">
          <label>ID<input v-model="clientModal.form.id" readonly placeholder="auto" /></label>
          <div class="ms-form-grid"><label>NameCode<input v-model.trim="clientModal.form.namecode" :readonly="clientModal.locked" /></label><label>Company Name<input v-model.trim="clientModal.form.companyName" :readonly="clientModal.locked" /></label></div>
          <label>Address<input v-model.trim="clientModal.form.address" :readonly="clientModal.locked" /></label>
          <div class="ms-form-grid"><label>City/Province<input v-model.trim="clientModal.form.city" :readonly="clientModal.locked" /></label><label>Country<input v-model.trim="clientModal.form.country" list="ms-client-countries" :readonly="clientModal.locked" @input="updateNewClientId" /></label></div>
          <datalist id="ms-client-countries"><option v-for="country in countryOptions" :key="country.iso2 || country.name" :value="country.name"></option></datalist>
          <div class="ms-form-grid"><label>PIC Name<input v-model.trim="clientModal.form.picName" :readonly="clientModal.locked" /></label><label>Phone<input v-model.trim="clientModal.form.phone" :readonly="clientModal.locked" /></label></div>
          <label>Email<input v-model.trim="clientModal.form.email" type="email" :readonly="clientModal.locked" /></label>
        </div>
        <footer v-if="clientModal.view === 'detail'"><button class="ms-btn" type="button" @click="clientModal.view = 'search'">‹ Back</button><span></span><button v-if="clientModal.recordId" class="ms-btn primary" type="button" @click="useClient">Use this CLIENT</button></footer>
        <footer v-else-if="clientModal.view === 'add'"><button class="ms-btn" type="button" @click="clientModal.view = 'search'">‹ Back</button><span></span><button v-if="!clientModal.locked && !clientModal.savedRecordId" class="ms-btn danger" type="button" @click="clearNewClient">Cancel</button><button v-if="clientModal.locked" class="ms-btn orange" type="button" @click="clientModal.locked = false">Edit</button><button v-if="!clientModal.locked" class="ms-btn primary" type="button" :disabled="saving" @click="saveNewClient">Save CLIENT</button></footer>
      </div>
    </div>

    <div v-if="contentModal.open" class="ms-overlay" @click.self="closeContentModal">
      <div class="ms-modal wide">
        <header><h3>Content Detail <small v-if="contentModal.override">· edited</small></h3><button type="button" @click="closeContentModal">×</button></header>
        <div class="ms-modal-body">
          <label>Subject<input v-model="contentModal.subject" :disabled="contentModal.mode === 'locked'" /></label>
          <label>Content <span v-if="contentModal.mode === 'locked' && !contentModal.override">(auto-aggregated)</span>
            <textarea v-if="contentModal.mode === 'edit'" v-model="contentModal.body" class="ms-content-pad"></textarea>
            <pre v-else class="ms-content-view">{{ contentModal.body || 'No matching fee data for this Type / Terms / Ports.' }}</pre>
          </label>
          <label class="ms-attachment-label">Trucking attachment</label>
          <div class="ms-attachment"><span v-if="contentTruckCount">📎 Trucking_{{ contentModal.contentId || 'content' }}.xlsx · {{ contentTruckCount }} row(s)</span><span v-else>No Trucking Fee attachment for this content.</span><button v-if="contentTruckCount" class="ms-btn" type="button" @click="downloadContentTrucking">Download</button></div>
        </div>
        <footer><button class="ms-btn orange" type="button" :disabled="contentModal.mode !== 'locked'" @click="editContentDetail">Edit</button><span></span><button class="ms-btn grey" type="button" :disabled="contentModal.mode === 'locked'" @click="clearContentDetail">Clear</button><button class="ms-btn primary" type="button" :disabled="contentModal.mode === 'locked' || saving" @click="saveContentDetail">Save</button></footer>
      </div>
    </div>

    <div v-if="signatureModal.open" class="ms-overlay" @click.self="closeSignatureModal">
      <div class="ms-modal signature-form">
        <header><h3>Signature</h3><button type="button" @click="closeSignatureModal">×</button></header>
        <div class="ms-modal-body">
          <label>Country<select v-model="signatureModal.iso2" :disabled="signatureModal.mode === 'locked'"><option value="">— Country —</option><option v-for="country in countryOptions" :key="country.iso2 || country.name" :value="country.iso2">{{ country.name }}{{ country.iso2 ? ` (${country.iso2})` : '' }}</option></select></label>
          <label>Signature<textarea v-model="signatureModal.signature" class="ms-signature-pad" :readonly="signatureModal.mode === 'locked'" placeholder="Enter email signature…"></textarea></label>
        </div>
        <footer><button class="ms-btn grey" type="button" :disabled="signatureModal.mode === 'locked'" @click="clearSignature">Clear</button><button class="ms-btn orange" type="button" :disabled="signatureModal.mode !== 'locked'" @click="signatureModal.mode = 'edit'">Edit</button><button class="ms-btn primary" type="button" :disabled="signatureModal.mode === 'locked' || saving" @click="saveSignature">Save</button></footer>
      </div>
    </div>

    <div v-if="campaignModal.open" class="ms-overlay" @click.self="closeCampaignModal">
      <div class="ms-modal campaign-form">
        <header><h3>{{ campaignModal.id ? 'Edit Campaign' : 'New Campaign' }}</h3><button type="button" @click="closeCampaignModal">×</button></header>
        <div class="ms-modal-body">
          <div class="ms-form-grid"><label>Campaign Date<input v-model="campaignModal.data.campaignDate" type="date" /></label><label>ClientCode<select v-model="campaignModal.data.clientCode"><option>All</option><option v-for="client in basicClientCodes" :key="client">{{ client }}</option></select></label></div>
          <div class="ms-form-grid"><label>Type<select v-model="campaignModal.data.type"><option v-for="type in transportTypes" :key="type">{{ type }}</option></select></label><label>ServiceType<select :value="campaignModal.data.serviceType" @change="updateCampaignTerm('serviceType', eventValue($event))"><option>Single</option><option>Combine</option></select></label></div>
          <div class="ms-form-grid"><label>OrgTerm<select :value="campaignModal.data.orgTerm" @change="updateCampaignTerm('orgTerm', eventValue($event))"><option v-for="term in originTermOptions(campaignModal.data)" :key="term">{{ term }}</option></select></label><label>DestTerm<select :value="campaignModal.data.destTerm" @change="updateCampaignTerm('destTerm', eventValue($event))"><option v-for="term in destinationTermOptions(campaignModal.data)" :key="term">{{ term }}</option></select></label></div>
          <div class="ms-form-grid"><label>Origin/ToPortCode<input v-model.trim="campaignModal.data.origin" :list="campaignModal.data.type === 'AIR' ? 'ms-airport-codes' : 'ms-port-codes'" placeholder="PortCode" /></label><label>Destination/FromPortCode<input v-model.trim="campaignModal.data.destination" :list="campaignModal.data.type === 'AIR' ? 'ms-airport-codes' : 'ms-port-codes'" placeholder="PortCode" /></label></div>
          <div class="ms-form-grid"><label>ContentID<select v-model="campaignModal.data.contentId"><option value="">—</option><option v-for="content in contentIdOptions" :key="content">{{ content }}</option></select></label><label>SignID<select v-model="campaignModal.data.signId"><option value="">—</option><option v-for="signature in signIdOptions" :key="signature">{{ signature }}</option></select></label></div>
          <label>Sending Option<select v-model="campaignModal.data.sendMode"><option value="now">Send now</option><option value="date">On specific date/time</option><option value="weekly">Weekly (weekday)</option><option value="monthly">Monthly (day of month)</option></select></label>
          <label v-if="campaignModal.data.sendMode === 'date'">Send at<input v-model="campaignModal.data.sendConfig.datetime" type="datetime-local" /></label>
          <div v-else-if="campaignModal.data.sendMode === 'weekly'" class="ms-form-grid"><label>Weekday<select v-model="campaignModal.data.sendConfig.weekday"><option v-for="day in weekdays" :key="day">{{ day }}</option></select></label><label>Time<input v-model="campaignModal.data.sendConfig.time" type="time" /></label></div>
          <div v-else-if="campaignModal.data.sendMode === 'monthly'" class="ms-form-grid"><label>Day of month<select v-model="campaignModal.data.sendConfig.day"><option v-for="day in 28" :key="day" :value="String(day)">{{ day }}</option><option value="last">last</option></select></label><label>Time<input v-model="campaignModal.data.sendConfig.time" type="time" /></label></div>
          <div class="ms-form-grid"><label>Volume per batch<input v-model.number="campaignModal.data.volumePerBatch" type="number" min="1" /><small>Emails sent each batch (based on recipient count).</small></label><label>Batch interval<span class="ms-inline"><input v-model.number="campaignModal.data.batchInterval" type="number" min="0" /><select v-model="campaignModal.data.batchUnit"><option value="min">min</option><option value="hour">hour</option></select></span></label></div>
        </div>
        <footer><span></span><button class="ms-btn grey" type="button" @click="closeCampaignModal">Cancel</button><button class="ms-btn primary" type="button" :disabled="saving" @click="saveCampaign">Save</button></footer>
      </div>
    </div>

    <div v-if="previewModal.open" class="ms-overlay" @click.self="previewModal.open = false">
      <div class="ms-modal wide preview-form">
        <header><h3>Preview (email)</h3><button type="button" @click="previewModal.open = false">×</button></header>
        <div class="ms-modal-body">
          <div v-if="previewModal.missing.length" class="ms-error">⚠ Not ready to send — missing: {{ previewModal.missing.join(', ') }}</div>
          <div class="ms-email"><div><b>To:</b> {{ previewRecipientText }}</div><div><b>Subject:</b> {{ previewModal.subject || '(no subject)' }}</div><pre>{{ previewModal.body || '(no content)' }}</pre><div v-if="previewModal.attachment" class="ms-attachment"><span>📎 {{ previewModal.attachment.filename }}</span><button class="ms-btn" type="button" @click="downloadPreviewTrucking">Download</button></div></div>
          <small>ContentID: {{ previewModal.contentId || '—' }} · SignID: {{ previewModal.signId || '—' }}</small>
        </div>
        <footer><span></span><button class="ms-btn grey" type="button" @click="previewModal.open = false">Close</button></footer>
      </div>
    </div>

    <div v-if="testModal.open" class="ms-overlay" @click.self="testModal.open = false">
      <div class="ms-modal small"><header><h3>Send a test email to:</h3><button type="button" @click="testModal.open = false">×</button></header><div class="ms-modal-body"><input v-model.trim="testModal.email" type="email" placeholder="name@example.com" @keydown.enter.prevent="sendTestEmail" /></div><footer><span></span><button class="ms-btn" type="button" @click="testModal.open = false">Cancel</button><button class="ms-btn primary" type="button" :disabled="saving" @click="sendTestEmail">Send</button></footer></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  applyBatchResult,
  applyTermChange,
  batchIntervalMs,
  buildContent,
  buildRecipients,
  campaignFilterValue,
  campaignCode,
  campaignCancellationRegistry,
  campaignStartClaims,
  campaignTimerKey,
  campaignTimerRegistry,
  composeEmail,
  createKeyedTaskQueue,
  generateClientId,
  generateContentId,
  generateSignId,
  localDate,
  missingSendFields,
  nextCampaignSequence,
  sendSummary,
  splitBatches,
  truckAoa,
  truckColumns,
} from '~/utils/adminMassSales.mjs'

type AdminRecord = { id: string, data: Record<string, any>, sortOrder: number, [key: string]: any }
type StoreName = 'basic' | 'content' | 'signature' | 'campaign'

const props = defineProps<{
  country: string
  request: (url: string, options?: Record<string, any>) => Promise<any>
  feeTabs: Record<string, Record<string, any[]>>
  notifyUser: (message: string, title?: string) => Promise<any>
  confirmUser: (message: string, title?: string, okText?: string, tone?: string) => Promise<boolean>
}>()

const massSalesTabs = [
  { id: 'basic', label: 'Basic Data' },
  { id: 'campaign', label: 'AutoCampaign' },
  { id: 'content', label: 'SendingContent' },
  { id: 'signature', label: 'Signature' },
]
const transportTypes = ['FCL', 'LCL', 'AIR']
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const basicFields = [
  ['date', 'Date'], ['clientCode', 'ClientCode'], ['clientName', 'ClientName'], ['type', 'Type'],
  ['serviceType', 'ServiceType'], ['orgTerm', 'OrgTerm'], ['destTerm', 'DestTerm'],
  ['origin', 'Origin/ToPortCode'], ['destination', 'Destination/FromPortCode'],
].map(([key, label]) => ({ key, label }))
const campaignFields = [
  ['campaignId', 'CampaignID'], ['campaignDate', 'CampaignDate'], ['clientCode', 'ClientCode'], ['type', 'Type'],
  ['serviceType', 'ServiceType'], ['orgTerm', 'OrgTerm'], ['destTerm', 'DestTerm'], ['origin', 'Origin/ToPortCode'],
  ['destination', 'Destination/FromPortCode'], ['volumePerBatch', 'VolumePerBatch'], ['batchInterval', 'Interval'], ['status', 'Status'],
].map(([key, label]) => ({ key, label }))
const pages: Record<StoreName, string> = {
  basic: 'sm_mass_basic', content: 'sm_mass_content', signature: 'sm_mass_signature', campaign: 'sm_mass_campaign',
}
const kinds: Record<StoreName, string> = {
  basic: 'mass-sales-basic', content: 'mass-sales-content', signature: 'mass-sales-signature', campaign: 'mass-sales-campaign',
}

const subTab = ref('basic')
const loading = ref(false)
const saving = ref(false)
const backendWarning = ref('')
const selected = reactive(new Set<string>())
const records = reactive<Record<StoreName, AdminRecord[]>>({ basic: [], content: [], signature: [], campaign: [] })
const clients = ref<any[]>([])
const countryOptions = ref<Array<{ name: string, iso2: string }>>([])
const portCodes = ref<string[]>([])
const airportCodes = ref<string[]>([])
const feeRecords = reactive<Record<string, AdminRecord[]>>({})
const webhookUrl = ref('')
const settingsRecord = ref<AdminRecord | null>(null)
const settingsRecordsByCountry = new Map<string, AdminRecord | null>()
const lastTestEmail = ref('')
const filters = reactive({ basicField: 'all', basicTerm: '', campaignField: 'all', campaignTerm: '' })
const queueRecordUpdate = createKeyedTaskQueue()
const queueSettingsUpdate = createKeyedTaskQueue()
let loadGeneration = 0
let loadedCountry = props.country

const contentModal = reactive<any>({ open: false, recordId: '', mode: 'locked', subject: '', body: '', override: false, autoText: '', contentId: '', built: null })
const signatureModal = reactive<any>({ open: false, recordId: '', mode: 'edit', iso2: '', signature: '' })
const campaignModal = reactive<any>({ open: false, id: '', data: {} })
const previewModal = reactive<any>({ open: false, subject: '', body: '', recipients: [], missing: [], attachment: null, contentId: '', signId: '' })
const testModal = reactive<any>({ open: false, email: '', recordId: '' })
const clientModal = reactive<any>({ open: false, view: 'search', recordId: '', searchField: 'id', term: '', selectedId: '', savedRecordId: '', locked: false, detail: null, form: {} })

const dataOf = (record: AdminRecord | Record<string, any>) => record?.data && typeof record.data === 'object' ? record.data : record || {}
const eventValue = (event: Event) => (event.target as HTMLInputElement | HTMLSelectElement).value
const encode = encodeURIComponent
const pageQuery = (page: string, country = props.country) => `/records?country=${encode(country)}&page=${encode(page)}&limit=1000`
const resultItems = (result: any): AdminRecord[] => Array.isArray(result?.items) ? result.items : []
const loadAllItems = async (url: string) => {
  const separator = url.includes('?') ? '&' : '?'
  const first = await props.request(`${url}${separator}skip=0`)
  const items = [...resultItems(first)]
  const total = Math.max(Number(first?.total) || 0, items.length)
  while (items.length < total) {
    const next = await props.request(`${url}${separator}skip=${items.length}`)
    const nextItems = resultItems(next)
    if (!nextItems.length) break
    items.push(...nextItems)
  }
  return items
}
const errorMessage = (error: any) => error?.data?.message || error?.message || 'Request failed'
const today = () => localDate()

const basicRows = computed(() => records.basic)
const contentRows = computed(() => records.content)
const signatureRows = computed(() => records.signature)
const campaignRows = computed(() => records.campaign)
const matchesFilter = (record: AdminRecord, fields: Array<{ key: string }>, field: string, term: string) => {
  const query = term.trim().toLowerCase()
  if (!query) return true
  const data = dataOf(record)
  const keys = field === 'all' ? fields.map((item) => item.key) : [field]
  return keys.some((key) => String(data[key] ?? '').toLowerCase().includes(query))
}
const filteredBasic = computed(() => basicRows.value.filter((record) => matchesFilter(record, basicFields, filters.basicField, filters.basicTerm)))
const filteredCampaigns = computed(() => campaignRows.value.filter((record) => {
  const query = filters.campaignTerm.trim().toLowerCase()
  if (!query) return true
  const data = dataOf(record)
  const keys = filters.campaignField === 'all' ? campaignFields.map((item) => item.key) : [filters.campaignField]
  return keys.some((key) => campaignFilterValue(data, key).toLowerCase().includes(query))
}))
const clientOptions = computed(() => clients.value.map((record) => {
  const row = dataOf(record)
  return { record, row, code: String(row.namecode || row.clientCode || row.code || ''), name: String(row.companyName || row.company || row.clientName || '') }
}).filter((client) => client.code))
const filteredClients = computed(() => {
  const term = clientModal.term.trim().toLowerCase()
  if (!term) return clientOptions.value.slice(0, 30)
  return clientOptions.value.filter((client) => String(clientModal.searchField === 'id'
    ? (client.row.id || client.record.entityId)
    : client.row[clientModal.searchField] || '').toLowerCase().includes(term)).slice(0, 30)
})
const clientDetailRows = computed(() => {
  const record = clientModal.detail || {}
  const row = dataOf(record)
  const rows = [
    ['ID', row.id || record.entityId], ['NameCode', row.namecode], ['Company', row.companyName || row.company],
    ['Address', row.address], ['City / Country', `${row.city || ''} ${row.country || ''}`.trim()],
    ['PIC', row.picName || row.pic], ['Phone', row.phone], ['Email', row.email], ['Status', row.status],
  ]
  return (clientModal.recordId ? rows.slice(1, -1) : rows).map(([label, value]) => ({ label, value }))
})
const basicClientCodes = computed(() => [...new Set(basicRows.value.map((record) => String(dataOf(record).clientCode || '')).filter(Boolean))])
const contentIdOptions = computed(() => contentRows.value.map((record) => String(dataOf(record).contentId || '')).filter(Boolean))
const signIdOptions = computed(() => signatureRows.value.map((record) => String(dataOf(record).signId || '')).filter(Boolean))
const contentTruckCount = computed(() => (contentModal.built?.truckOrigin?.length || 0) + (contentModal.built?.truckDest?.length || 0))
const previewRecipientText = computed(() => {
  const list = previewModal.recipients || []
  if (!list.length) return '(no recipients)'
  const first = list.slice(0, 5).map((recipient: any) => `${recipient.clientName || recipient.clientCode}${recipient.email ? ` <${recipient.email}>` : ' (no email)'}`).join(', ')
  return `${first}${list.length > 5 ? ` +${list.length - 5} more` : ''}`
})

const originTermOptions = (row: Record<string, any>) => row.serviceType === 'Combine' ? ['EXW', 'FCA', 'FCF'] : ['EXW', 'FCA', 'FCF', '-']
const destinationTermOptions = (row: Record<string, any>) => row.serviceType === 'Combine' ? ['DO', 'DAP', 'DDU', 'DDP'] : ['DO', 'DAP', 'DDU', 'DDP', '-']
const selectedRecords = (name: StoreName) => records[name].filter((record) => selected.has(record.id))
const toggleSelected = (id: string, event: Event) => (event.target as HTMLInputElement).checked ? selected.add(id) : selected.delete(id)
const allVisibleSelected = (rows: AdminRecord[]) => Boolean(rows.length && rows.every((record) => selected.has(record.id)))
const toggleAllVisible = (rows: AdminRecord[], event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  rows.forEach((record) => checked ? selected.add(record.id) : selected.delete(record.id))
}
const closeClientModal = () => { clientModal.open = false }
const showClientDetail = (record: any) => Object.assign(clientModal, { view: 'detail', detail: record, selectedId: record.entityId || record.id })
const openClientDetail = (code: string) => {
  const client = clientOptions.value.find((item) => item.code.toUpperCase() === String(code || '').trim().toUpperCase())
  const basic = basicRows.value.find((record) => String(dataOf(record).clientCode || '').toUpperCase() === String(code || '').trim().toUpperCase())
  Object.assign(clientModal, { open: true, view: 'detail', recordId: '', detail: client?.record || { namecode: code, companyName: dataOf(basic || {}).clientName || '' }, selectedId: client?.record.entityId || '' })
}
const emptyClientForm = () => ({ id: '', namecode: '', companyName: '', address: '', city: '', country: '', picName: '', phone: '', email: '' })
const openClientPicker = (record: AdminRecord) => Object.assign(clientModal, { open: true, view: 'search', recordId: record.id, searchField: 'id', term: '', selectedId: '', savedRecordId: '', locked: false, detail: null })
const openNewClient = () => Object.assign(clientModal, { view: 'add', savedRecordId: '', locked: false, form: emptyClientForm() })
const updateNewClientId = () => { clientModal.form.id = clientModal.form.country ? generateClientId(clientModal.form.country, clients.value) : '' }
const clearNewClient = () => { clientModal.form = emptyClientForm() }
const useClient = async () => {
  const record = basicRows.value.find((item) => item.id === clientModal.recordId)
  const client = dataOf(clientModal.detail || {})
  if (!record || !client.namecode) return
  await updateRecord('basic', record, (current) => current.locked ? null : { ...current, clientCode: client.namecode, clientName: client.companyName || client.company || current.clientName || '' })
  closeClientModal()
}
const saveNewClient = async () => {
  const form = clientModal.form || {}
  const namecode = String(form.namecode || '').trim().toUpperCase()
  const companyName = String(form.companyName || '').trim()
  const countryName = String(form.country || '').trim().toUpperCase()
  if (!namecode || !companyName || !countryName) return props.notifyUser('NameCode, Company and Country are required')
  const country = props.country
  const generation = loadGeneration
  const existing = clients.value.find((client) => client.entityId === clientModal.savedRecordId)
  const body = {
    id: String(form.id || generateClientId(countryName, clients.value)),
    namecode,
    companyName,
    address: String(form.address || '').trim(),
    city: String(form.city || '').trim(),
    country: countryName,
    picName: String(form.picName || '').trim(),
    phone: String(form.phone || '').trim(),
    email: String(form.email || '').trim(),
    status: String(existing?.status || 'ACTIVE'),
  }
  saving.value = true
  try {
    const record = existing
      ? await props.request(`/mass-sales/clients/${encode(existing.entityId)}`, { method: 'PATCH', body })
      : await props.request('/mass-sales/clients', { method: 'POST', body })
    if (!isCurrentGeneration(country, generation)) return
    const index = clients.value.findIndex((client) => client.entityId === record.entityId)
    if (index >= 0) clients.value[index] = record
    else clients.value.push(record)
    const basicRecord = basicRows.value.find((item) => item.id === clientModal.recordId)
    if (basicRecord) await updateRecord('basic', basicRecord, (current) => current.locked ? null : { ...current, clientCode: record.namecode, clientName: record.companyName || current.clientName || '' })
    Object.assign(clientModal, { savedRecordId: record.entityId, locked: true, detail: record, form: { ...body, ...record } })
    await props.notifyUser('CLIENT saved')
  } finally { saving.value = false }
}

const isCurrentGeneration = (country: string, generation: number) => {
  if (generation !== loadGeneration) return false
  return country === props.country
}
const campaignRecordCountry = (record: AdminRecord, fallbackCountry = props.country) => String(record.country || fallbackCountry)
const campaignRecordKey = (record: AdminRecord, fallbackCountry = props.country) => campaignTimerKey(campaignRecordCountry(record, fallbackCountry), record.id)
const cancelCampaignRun = (record: AdminRecord, fallbackCountry = props.country) => {
  const key = campaignRecordKey(record, fallbackCountry)
  campaignCancellationRegistry.invalidate(key)
  campaignTimerRegistry.clear(key)
}
const feeCacheKey = (country: string, page: string) => `${country.toUpperCase()}::${page}`
const settingsCountryKey = (country: string) => country.trim().toUpperCase()
const feeRecordsFor = (country: string) => Object.fromEntries(Object.entries(feeRecords)
  .filter(([key]) => key.startsWith(`${country.toUpperCase()}::`))
  .map(([key, rows]) => [key.slice(key.indexOf('::') + 2), rows]))
const resetLoadedState = () => {
  records.campaign.forEach((record) => cancelCampaignRun(record, loadedCountry))
  ;(Object.keys(pages) as StoreName[]).forEach((name) => { records[name] = [] })
  selected.clear()
  Object.keys(feeRecords).forEach((key) => delete feeRecords[key])
  clients.value = []
  countryOptions.value = []
  portCodes.value = []
  airportCodes.value = []
  settingsRecord.value = null
  webhookUrl.value = ''
  lastTestEmail.value = ''
  contentModal.open = false
  signatureModal.open = false
  campaignModal.open = false
  previewModal.open = false
  testModal.open = false
  clientModal.open = false
}
const loadStore = async (name: StoreName, country = props.country, generation = loadGeneration) => {
  const items = await loadAllItems(pageQuery(pages[name], country))
  if (isCurrentGeneration(country, generation)) records[name] = items
  return items
}
const loadReferenceRows = async (page: string, country: string) => {
  const globalRows = await loadAllItems(pageQuery(page, 'GLOBAL'))
  if (globalRows.length || country === 'GLOBAL') return globalRows
  return loadAllItems(pageQuery(page, country))
}
const loadReferences = async (country: string, generation: number) => {
  const [clientRows, countries, ports, airports] = await Promise.all([
    loadAllItems('/mass-sales/clients?limit=1000'),
    loadReferenceRows('ref_countries', country),
    loadReferenceRows('ref_ports', country),
    loadReferenceRows('ref_airports', country),
  ])
  if (!isCurrentGeneration(country, generation)) return
  clients.value = clientRows
  countryOptions.value = countries.map(dataOf).map((row) => ({ name: String(row.countryname || row.name || ''), iso2: String(row.iso2 || row.code || '').toUpperCase() })).filter((row) => row.name)
  portCodes.value = ports.map(dataOf).map((row) => String(row.portcode || row.code || '')).filter(Boolean)
  airportCodes.value = airports.map(dataOf).map((row) => String(row.iata || row.airportcode || row.code || '')).filter(Boolean)
}
const loadSettings = async (country: string, generation: number) => {
  const rows = await loadAllItems(pageQuery('sm_mass_settings', country))
  if (!isCurrentGeneration(country, generation)) return
  settingsRecord.value = rows[0] || null
  settingsRecordsByCountry.set(settingsCountryKey(country), settingsRecord.value)
  const settings = dataOf(rows[0] || {})
  webhookUrl.value = String(settings.webhookUrl || '')
  lastTestEmail.value = String(settings.lastTestEmail || '')
}
const syncFollowUp = async (country = props.country, generation = loadGeneration) => {
  try {
    await props.request('/mass-sales/sync-follow-up', { method: 'POST', body: { country } })
    await loadStore('basic', country, generation)
    if (isCurrentGeneration(country, generation)) backendWarning.value = ''
  } catch (error: any) {
    if (isCurrentGeneration(country, generation)) backendWarning.value = `FollowUp sync unavailable until the updated backend is restarted: ${errorMessage(error)}`
  }
}
const loadAll = async () => {
  const generation = ++loadGeneration
  const country = props.country
  resetLoadedState()
  loadedCountry = country
  loading.value = true
  backendWarning.value = ''
  try {
    await Promise.all((Object.keys(pages) as StoreName[]).map((name) => loadStore(name, country, generation)))
    await Promise.all([loadReferences(country, generation), loadSettings(country, generation)])
    await syncFollowUp(country, generation)
  } catch (error: any) {
    if (isCurrentGeneration(country, generation)) backendWarning.value = errorMessage(error)
  } finally {
    if (isCurrentGeneration(country, generation)) loading.value = false
  }
}

const createRecord = async (name: StoreName, data: Record<string, any>, country = props.country, generation = loadGeneration) => {
  saving.value = true
  try {
    const record = await props.request('/records', { method: 'POST', body: { country, page: pages[name], kind: kinds[name], data, sortOrder: records[name].length + 1 } })
    if (isCurrentGeneration(country, generation)) records[name].push(record)
    return record
  } finally { saving.value = false }
}
const updateRecord = (
  name: StoreName,
  record: AdminRecord,
  change: Record<string, any> | ((current: Record<string, any>) => Record<string, any> | null),
  canRun: () => boolean = () => true,
) => queueRecordUpdate(record.id, async () => {
  saving.value = true
  try {
    const generation = loadGeneration
    const operationCountry = String(record.country || props.country)
    const currentRecord = records[name].find((item) => item.id === record.id && String(item.country || props.country) === operationCountry) || record
    const data = typeof change === 'function' ? change(dataOf(currentRecord)) : change
    if (!data) return currentRecord
    const updated = await props.request(`/records/${record.id}`, { method: 'PATCH', body: { country: currentRecord.country || props.country, page: currentRecord.page || pages[name], kind: currentRecord.kind || kinds[name], data, sortOrder: currentRecord.sortOrder || Math.max(1, records[name].indexOf(currentRecord) + 1) } })
    const index = isCurrentGeneration(operationCountry, generation) ? records[name].findIndex((item) => item.id === record.id) : -1
    if (index >= 0) records[name][index] = updated
    return updated
  } finally { saving.value = false }
}, canRun)
const removeSelected = async (name: StoreName) => {
  const rows = selectedRecords(name)
  if (!rows.length || !(await props.confirmUser(`Remove ${rows.length} row(s)?`, 'Confirm', 'Confirm', 'danger'))) return
  const country = props.country
  const generation = loadGeneration
  saving.value = true
  try {
    for (const record of rows) {
      if (name === 'campaign') {
        cancelCampaignRun(record)
        if (dataOf(record).status === 'Running' && webhookUrl.value) {
          try { await sendWebhook({ action: 'stop', campaignId: record.id }, webhookUrl.value) } catch { /* deletion still follows the Main.html fire-and-forget stop */ }
        }
      }
      await props.request(`/records/${record.id}`, { method: 'DELETE' })
      records[name] = records[name].filter((item) => item.id !== record.id)
      selected.delete(record.id)
    }
    if (name === 'basic') await syncFollowUp(country, generation)
  } finally { saving.value = false }
}
const selectSubTab = async (id: string) => {
  subTab.value = id
  selected.clear()
  if (id === 'basic') await syncFollowUp()
}

const addBasic = () => createRecord('basic', { date: today(), clientCode: '', clientName: '', type: 'FCL', serviceType: 'Single', orgTerm: 'EXW', destTerm: '-', origin: '', destination: '', locked: false })
const updateBasic = async (record: AdminRecord, field: string, value: string) => {
  const current = dataOf(record)
  if (current.locked) return
  const applyChange = (latest: Record<string, any>) => {
    let next = ['serviceType', 'orgTerm', 'destTerm'].includes(field) ? applyTermChange(latest, field, value) : { ...latest, [field]: value }
    if (field === 'clientCode') {
      const client = clientOptions.value.find((item) => item.code === value)
      if (client) next = { ...next, clientName: client.name }
    }
    return next
  }
  const next = applyChange(current)
  const duplicateKeys = ['date', 'clientCode', 'clientName', 'type', 'serviceType', 'orgTerm', 'destTerm', 'origin', 'destination']
  const duplicate = basicRows.value.some((item) => item.id !== record.id && duplicateKeys.every((key) => String(dataOf(item)[key] || '') === String(next[key] || '')))
  if (duplicate) return props.notifyUser('Duplicate row — reverted')
  await updateRecord('basic', record, (latest) => applyChange(latest))
}
const exportBasic = async () => {
  const rows = filteredBasic.value.map(dataOf)
  if (!rows.length) return props.notifyUser('Nothing to export')
  const headers = basicFields.map((field) => field.label)
  const values = rows.map((row) => basicFields.map((field) => row[field.key] || ''))
  try {
    const XLSX = await import('xlsx')
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([headers, ...values]), 'BasicData')
    XLSX.writeFile(workbook, `MassSales_BasicData_${today().replaceAll('-', '')}.xlsx`)
  } catch {
    const csv = [headers, ...values].map((line) => line.map(csvCell).join(',')).join('\r\n')
    downloadText(csv, `MassSales_BasicData_${today().replaceAll('-', '')}.csv`, 'text/csv;charset=utf-8')
  }
}
const addContent = () => createRecord('content', { contentId: '', type: 'FCL', serviceType: 'Single', orgTerm: 'EXW', destTerm: '-', origin: '', destination: '', locked: false, detail: { subject: '', body: '', override: false } })
const updateContent = async (record: AdminRecord, field: string, value: string) => {
  const current = dataOf(record)
  if (current.locked) return
  await updateRecord('content', record, (current) => current.locked
    ? null
    : (['serviceType', 'orgTerm', 'destTerm'].includes(field) ? applyTermChange(current, field, value) : { ...current, [field]: value }))
}
const unlockSelectedContent = async () => {
  const rows = selectedRecords('content')
  for (const record of rows) await updateRecord('content', record, (current) => ({ ...current, locked: false }))
  selected.clear()
  await props.notifyUser(`Unlocked ${rows.length} row(s)`)
}
const saveContent = async (record: AdminRecord) => {
  let contentId = ''
  await updateRecord('content', record, (current) => {
    if (!current.origin || !current.destination) return null
    contentId = generateContentId(current)
    return { ...current, contentId, locked: true }
  })
  if (!contentId) return props.notifyUser('Fill Origin & Destination first')
  await props.notifyUser(`ContentID: ${contentId} · row locked`)
}
const contentSections = (content: Record<string, any>) => [
  ...(content.orgTerm && content.orgTerm !== '-' ? ['At Origin'] : []), 'Main Freight',
  ...(content.destTerm && content.destTerm !== '-' ? ['At Destination'] : []),
]
const loadFeesForContent = async (content: Record<string, any>, country = props.country, generation = loadGeneration) => {
  const tabs = contentSections(content).flatMap((section) => props.feeTabs?.[section]?.[content.type || 'FCL'] || [])
  await Promise.all(tabs.map(async (tab: any) => {
    const page = `sm_${tab.id}`
    const key = feeCacheKey(country, page)
    if (feeRecords[key]) return
    const rows = await loadAllItems(pageQuery(page, country))
    if (isCurrentGeneration(country, generation)) feeRecords[key] = rows
  }))
}
const openContentDetail = async (record: AdminRecord) => {
  const country = String(record.country || props.country)
  const generation = loadGeneration
  const data = dataOf(record)
  await loadFeesForContent(data, country, generation)
  if (!isCurrentGeneration(country, generation)) return
  const built = buildContent(data, props.feeTabs, feeRecordsFor(country))
  const override = Boolean(data.detail?.override)
  Object.assign(contentModal, { open: true, recordId: record.id, mode: 'locked', subject: data.detail?.subject || '', body: override ? data.detail?.body || '' : built.text, override, autoText: built.text, contentId: data.contentId || '', built })
}
const closeContentModal = () => { contentModal.open = false }
const editContentDetail = () => { contentModal.mode = 'edit'; contentModal.override = true }
const clearContentDetail = () => { contentModal.subject = ''; contentModal.body = contentModal.autoText; contentModal.override = false }
const saveContentDetail = async () => {
  const record = contentRows.value.find((item) => item.id === contentModal.recordId)
  if (!record) return
  await updateRecord('content', record, (current) => ({ ...current, detail: { subject: contentModal.subject, body: contentModal.body, override: contentModal.override } }))
  contentModal.mode = 'locked'
}

const addSignature = () => createRecord('signature', { country: '', iso2: '', signId: '', signature: '' })
const openSignatureDetail = (record: AdminRecord) => Object.assign(signatureModal, { open: true, recordId: record.id, mode: dataOf(record).signId ? 'locked' : 'edit', iso2: dataOf(record).iso2 || '', signature: dataOf(record).signature || '' })
const closeSignatureModal = () => { signatureModal.open = false }
const clearSignature = () => { signatureModal.iso2 = ''; signatureModal.signature = '' }
const saveSignature = async () => {
  const record = signatureRows.value.find((item) => item.id === signatureModal.recordId)
  const country = countryOptions.value.find((item) => item.iso2 === signatureModal.iso2)
  if (!record || !country) return props.notifyUser('Select a country')
  const signId = generateSignId(country.iso2, country.name)
  await updateRecord('signature', record, { country: country.name, iso2: country.iso2, signId, signature: signatureModal.signature })
  signatureModal.mode = 'locked'
  await props.notifyUser(`Saved ${signId} · locked`)
}

const defaultCampaign = () => ({ campaignDate: today(), clientCode: 'All', type: 'FCL', serviceType: 'Single', orgTerm: 'EXW', destTerm: '-', origin: '', destination: '', contentId: '', signId: '', sendMode: 'now', sendConfig: { weekday: 'Mon', time: '09:00', day: '1', datetime: '' }, volumePerBatch: 50, batchInterval: 10, batchUnit: 'min', status: 'Draft', sentCount: 0, totalCount: 0 })
const openCampaignForm = (record?: AdminRecord) => Object.assign(campaignModal, { open: true, id: record?.id || '', data: JSON.parse(JSON.stringify(record ? dataOf(record) : defaultCampaign())) })
const closeCampaignModal = () => { campaignModal.open = false }
const updateCampaignTerm = (field: string, value: string) => { campaignModal.data = applyTermChange(campaignModal.data, field, value) }
const editSelectedCampaign = () => { const row = selectedRecords('campaign')[0]; if (row) openCampaignForm(row) }
const saveCampaign = async () => {
  const country = props.country
  const generation = loadGeneration
  const data = { ...campaignModal.data, volumePerBatch: Number(campaignModal.data.volumePerBatch) || 1, batchInterval: Number(campaignModal.data.batchInterval) || 0, locked: true }
  if (campaignModal.id) {
    const record = campaignRows.value.find((item) => item.id === campaignModal.id)
    if (record) await updateRecord('campaign', record, data)
  } else {
    const sequence = await reserveCampaignSequence(country, generation)
    if (!isCurrentGeneration(country, generation)) return
    data.campaignId = campaignCode(today(), sequence)
    data.status = 'Draft'
    await createRecord('campaign', data, country, generation)
  }
  closeCampaignModal()
  await props.notifyUser(campaignModal.id ? 'Campaign updated · locked' : 'Campaign added · locked')
}
const campaignProgress = (campaign: Record<string, any>) => ['Running', 'Done'].includes(campaign.status) ? `${campaign.sentCount || 0}/${campaign.totalCount || buildRecipients(campaign, basicRows.value, clients.value).length}` : '—'
const updateCampaignLink = (record: AdminRecord, field: 'contentId' | 'signId', value: string) => updateRecord('campaign', record, (current) => current.locked ? null : { ...current, [field]: value.trim() })

const composeForCampaign = async (record: AdminRecord) => {
  const country = String(record.country || props.country)
  const generation = loadGeneration
  const campaign = dataOf(record)
  const content = contentRows.value.find((item) => dataOf(item).contentId === campaign.contentId)
  if (content) await loadFeesForContent(dataOf(content), country, generation)
  if (!isCurrentGeneration(country, generation)) return null
  const composed = composeEmail(campaign, contentRows.value, signatureRows.value, props.feeTabs, feeRecordsFor(country))
  const recipients = buildRecipients(campaign, basicRows.value, clients.value)
  return { campaign, composed, recipients, missing: missingSendFields(campaign, composed, recipients) }
}
const openPreview = async (record: AdminRecord) => {
  const prepared = await composeForCampaign(record)
  if (!prepared) return
  const { campaign, composed, recipients, missing } = prepared
  Object.assign(previewModal, { open: true, subject: composed.subject, body: composed.body, recipients, missing, attachment: composed.attachment, contentId: campaign.contentId, signId: campaign.signId })
}
const prepareTestEmail = async () => {
  const rows = selectedRecords('campaign')
  if (rows.length !== 1) return props.notifyUser('Select exactly 1 campaign to send a test')
  const record = rows[0]
  const prepared = await composeForCampaign(record)
  if (!prepared) return
  const { campaign, composed } = prepared
  const missing = missingSendFields(campaign, composed, [{ email: 'test@example.com' }]).filter((item: string) => !['Recipients', 'Recipient email'].includes(item))
  if (missing.length) return props.notifyUser(`Not ready to test: missing ${missing.join(', ')}`)
  Object.assign(testModal, { open: true, recordId: record.id, email: lastTestEmail.value })
}
const webhookEmail = async (campaign: Record<string, any>, composed: any) => ({ subject: composed.subject, body: composed.body, contentId: campaign.contentId, signId: campaign.signId, attachment: await attachmentPayload(composed.attachment) })
const sendWebhook = (payload: Record<string, any>, url = webhookUrl.value) => {
  if (!url) throw new Error('Set the Webhook URL first (top-right).')
  return props.request('/mass-sales/webhook', { method: 'POST', body: { url, payload } })
}
const sendTestEmail = async () => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testModal.email)) return props.notifyUser('Invalid email')
  const record = campaignRows.value.find((item) => item.id === testModal.recordId)
  if (!record) return
  saving.value = true
  try {
    const prepared = await composeForCampaign(record)
    if (!prepared) return
    const { campaign, composed } = prepared
    lastTestEmail.value = testModal.email
    await updateSettings((current) => ({ ...current, lastTestEmail: lastTestEmail.value }))
    await sendWebhook({ action: 'test', test: true, campaignId: record.id, campaignName: campaign.campaignId, meta: campaignMeta(campaign), email: { ...(await webhookEmail(campaign, composed)), subject: `[TEST] ${composed.subject}` }, recipients: [{ clientCode: 'TEST', clientName: 'Test', email: testModal.email }] })
    testModal.open = false
    await props.notifyUser(`Test email → ${testModal.email} (via webhook)`)
  } catch (error: any) { await props.notifyUser(errorMessage(error)) } finally { saving.value = false }
}
const campaignMeta = (campaign: Record<string, any>) => ({ campaignDate: campaign.campaignDate, type: campaign.type, serviceType: campaign.serviceType, orgTerm: campaign.orgTerm, destTerm: campaign.destTerm, origin: campaign.origin, destination: campaign.destination })
const startSelectedCampaigns = async () => {
  const rows = selectedRecords('campaign')
  if (!rows.length) return props.notifyUser('Select campaign(s) to start')
  for (const record of rows) await startCampaign(record)
}
const startCampaign = async (record: AdminRecord) => {
  const country = campaignRecordCountry(record)
  const key = campaignTimerKey(country, record.id)
  if (!campaignStartClaims.claim(key)) return
  try {
    if (dataOf(record).status === 'Running') return
    const token = campaignCancellationRegistry.start(key)
    const canRun = () => campaignCancellationRegistry.isCurrent(key, token)
    const prepared = await composeForCampaign(record)
    if (!campaignCancellationRegistry.isCurrent(key, token)) return
    if (!prepared) return
    const { campaign, composed, recipients, missing } = prepared
    if (campaign.status === 'Running') return
    const targetWebhookUrl = webhookUrl.value
    if (!targetWebhookUrl) return props.notifyUser('Set the Webhook URL first (top-right).')
    if (missing.length) return props.notifyUser(`Not ready to send (${campaign.campaignId || ''}): missing ${missing.join(', ')}`)
    const email = await webhookEmail(campaign, composed)
    if (!campaignCancellationRegistry.isCurrent(key, token)) return
    const running = { ...campaign, totalCount: recipients.length, sentCount: 0, status: 'Running', startedAt: new Date().toISOString() }
    if ((campaign.sendMode || 'now') !== 'now') {
      try {
        const result = await sendWebhook({ action: 'schedule', campaign: { id: record.id, meta: campaignMeta(campaign), email, schedule: { mode: campaign.sendMode, config: campaign.sendConfig }, batch: { volumePerBatch: campaign.volumePerBatch, interval: campaign.batchInterval, unit: campaign.batchUnit } }, recipients }, targetWebhookUrl)
        if (!campaignCancellationRegistry.isCurrent(key, token)) return
        if (!result?.accepted) {
          campaignTimerRegistry.delete(key)
          await updateRecord('campaign', record, { ...running, status: 'Paused' }, canRun)
          if (!campaignCancellationRegistry.isCurrent(key, token)) return
          await props.notifyUser('Campaign paused: webhook rejected the schedule')
          return
        }
        await updateRecord('campaign', record, running, canRun)
        if (!campaignCancellationRegistry.isCurrent(key, token)) return
        await props.notifyUser('Campaign scheduled → sent to webhook (n8n handles delivery)')
      } catch (error: any) {
        if (!campaignCancellationRegistry.isCurrent(key, token)) return
        campaignTimerRegistry.delete(key)
        await updateRecord('campaign', record, { ...running, status: 'Paused' }, canRun)
        if (!campaignCancellationRegistry.isCurrent(key, token)) return
        await props.notifyUser(`Campaign paused: ${errorMessage(error)}`)
      }
      return
    }
    const updated = await updateRecord('campaign', record, running, canRun)
    if (!campaignCancellationRegistry.isCurrent(key, token)) return
    const batches = splitBatches(recipients, campaign.volumePerBatch)
    await deliverBatch(updated, email, batches, 0, targetWebhookUrl, country, token)
  } finally {
    campaignStartClaims.release(key)
  }
}
const deliverBatch = async (record: AdminRecord, email: any, batches: any[][], index: number, targetWebhookUrl: string, country: string, token: symbol) => {
  const key = campaignTimerKey(country, record.id)
  const canRun = () => campaignCancellationRegistry.isCurrent(key, token)
  if (!campaignCancellationRegistry.isCurrent(key, token)) return
  const current = campaignRows.value.find((item) => item.id === record.id && campaignRecordCountry(item) === country) || record
  if (dataOf(current).status !== 'Running' || index >= batches.length) {
    campaignTimerRegistry.delete(key)
    return
  }
  const campaign = dataOf(current)
  try {
    const result = await sendWebhook({ campaignId: current.id, batchIndex: index, batches: batches.length, meta: campaignMeta(campaign), email, recipients: batches[index] }, targetWebhookUrl)
    if (!campaignCancellationRegistry.isCurrent(key, token)) return
    if (!result?.accepted) {
      campaignTimerRegistry.delete(key)
      await updateRecord('campaign', current, { ...campaign, status: 'Paused' }, canRun)
      if (!campaignCancellationRegistry.isCurrent(key, token)) return
      await props.notifyUser('Campaign paused: webhook rejected the batch')
      return
    }
    const next = applyBatchResult(campaign, batches[index].length, true)
    const updated = await updateRecord('campaign', current, next, canRun)
    if (!campaignCancellationRegistry.isCurrent(key, token)) return
    if (next.status === 'Done') {
      campaignTimerRegistry.delete(key)
      await props.notifyUser(`Campaign done · ${next.sentCount} sent`)
      return
    }
    const timer = setTimeout(() => {
      if (!campaignCancellationRegistry.isCurrent(key, token)) return
      campaignTimerRegistry.delete(key)
      void deliverBatch(updated, email, batches, index + 1, targetWebhookUrl, country, token)
    }, batchIntervalMs(campaign))
    campaignTimerRegistry.set(key, timer)
  } catch (error: any) {
    if (!campaignCancellationRegistry.isCurrent(key, token)) return
    campaignTimerRegistry.delete(key)
    await updateRecord('campaign', current, { ...campaign, status: 'Paused' }, canRun)
    if (!campaignCancellationRegistry.isCurrent(key, token)) return
    await props.notifyUser(`Campaign paused: ${errorMessage(error)}`)
  }
}
const stopSelectedCampaigns = async () => {
  const rows = selectedRecords('campaign')
  if (!rows.length) return props.notifyUser('Select campaign(s) to stop')
  for (const record of rows) {
    cancelCampaignRun(record)
    const data = dataOf(record)
    if (data.status === 'Running') {
      try { if (webhookUrl.value) await sendWebhook({ action: 'stop', campaignId: record.id }) } catch { /* status still pauses locally, matching mockup */ }
      await updateRecord('campaign', record, { ...data, status: 'Paused' })
    }
  }
  await props.notifyUser('Stopped')
}

const updateSettings = (
  change: Record<string, any> | ((current: Record<string, any>) => Record<string, any>),
  country = props.country,
  generation = loadGeneration,
) => queueSettingsUpdate(settingsCountryKey(country), async () => {
  const key = settingsCountryKey(country)
  const existing = settingsRecordsByCountry.has(key)
    ? settingsRecordsByCountry.get(key)
    : (isCurrentGeneration(country, generation) ? settingsRecord.value : null)
  const current = dataOf(existing || {})
  const data = typeof change === 'function' ? change(current) : { ...current, ...change }
  const body = { country, page: 'sm_mass_settings', kind: 'mass-sales-settings', data, sortOrder: existing?.sortOrder || 1 }
  const updated = existing
    ? await props.request(`/records/${existing.id}`, { method: 'PATCH', body })
    : await props.request('/records', { method: 'POST', body })
  settingsRecordsByCountry.set(key, updated)
  if (isCurrentGeneration(country, generation)) settingsRecord.value = updated
  return updated
})
const reserveCampaignSequence = async (country = props.country, generation = loadGeneration) => {
  let sequence = 0
  await updateSettings((current) => {
    sequence = nextCampaignSequence(current)
    return { ...current, campaignSeq: sequence }
  }, country, generation)
  return sequence
}
const saveWebhookSetting = () => updateSettings({ webhookUrl: webhookUrl.value })

const attachmentPayload = async (attachment: any) => {
  if (!attachment) return null
  const XLSX = await import('xlsx')
  const workbook = XLSX.utils.book_new()
  if (attachment.truckOrigin.length) XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(truckAoa(truckColumns('origin', attachment.type), attachment.truckOrigin)), 'Origin Trucking')
  if (attachment.truckDest.length) XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(truckAoa(truckColumns('dest', attachment.type), attachment.truckDest)), 'Destination Trucking')
  return { filename: attachment.filename, base64: XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' }), mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
}
const downloadAttachment = async (attachment: any) => {
  if (!attachment) return
  const XLSX = await import('xlsx')
  const workbook = XLSX.utils.book_new()
  if (attachment.truckOrigin.length) XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(truckAoa(truckColumns('origin', attachment.type), attachment.truckOrigin)), 'Origin Trucking')
  if (attachment.truckDest.length) XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(truckAoa(truckColumns('dest', attachment.type), attachment.truckDest)), 'Destination Trucking')
  XLSX.writeFile(workbook, attachment.filename)
}
const downloadContentTrucking = () => downloadAttachment({ filename: `Trucking_${contentModal.contentId || 'content'}.xlsx`, type: dataOf(contentRows.value.find((item) => item.id === contentModal.recordId) || {}).type || 'FCL', truckOrigin: contentModal.built.truckOrigin, truckDest: contentModal.built.truckDest })
const downloadPreviewTrucking = () => downloadAttachment(previewModal.attachment)
const csvCell = (value: any) => { const text = String(value ?? ''); return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text }
const downloadText = (text: string, filename: string, type: string) => { const blob = new Blob(['\ufeff', text], { type }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url) }

watch(() => props.country, loadAll)
onMounted(loadAll)
</script>

<style scoped>
.ms-wrap{padding:0 0 16px;color:#16241c;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:13px}.ms-subtabs{display:flex;gap:4px;flex-wrap:nowrap;flex:0 0 auto;padding:0;margin:0 0 14px;border-bottom:1px solid #c4e6d1;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin}.ms-subtabs::-webkit-scrollbar{height:6px}.ms-subtabs::-webkit-scrollbar-thumb{background:#c4e6d1;border-radius:3px}.ms-subtabs button{display:flex;align-items:center;gap:7px;flex:0 0 auto;padding:9px 14px;border:0;border-bottom:2px solid transparent;border-radius:6px 6px 0 0;background:transparent;color:#5d7567;font:inherit;font-weight:650;font-size:13px;white-space:nowrap;cursor:pointer}.ms-subtabs button:hover{background:#eef9f1;color:#16241c}.ms-subtabs button.active{border-bottom-color:#22a155;background:#eef9f1;color:#1b7a43}.ms-warning,.ms-error{margin:10px 22px;padding:9px 12px;border:1px solid #eab7ae;border-radius:8px;background:#fdecea;color:#a93226}.ms-section{min-width:0}.ms-toolbar{display:flex;align-items:center;gap:7px;margin:10px 22px 12px;min-height:34px;overflow-x:auto}.campaign-toolbar{overflow:visible;flex-wrap:wrap}.ms-btn{display:inline-flex;align-items:center;justify-content:center;min-height:31px;padding:7px 12px;border:1px solid #b9d9c4;border-radius:7px;background:#fff;color:#15532f;font-weight:700;white-space:nowrap;cursor:pointer}.ms-btn:hover:not(:disabled){background:#eef9f1}.ms-btn.primary{border-color:#1b7a43;background:#1b7a43;color:#fff}.ms-btn.primary:hover:not(:disabled){background:#15532f}.ms-btn.danger{border-color:#e7b9b3;color:#c0392b}.ms-btn.danger:hover:not(:disabled){background:#fdecea}.ms-btn.orange{border-color:#f0b27a;color:#d35400}.ms-btn:disabled{opacity:.45;cursor:default}.ms-separator{width:1px;height:24px;background:#d7e9dd}.ms-spacer{flex:1}.ms-input,.ms-modal input,.ms-modal select,.ms-modal textarea{box-sizing:border-box;min-height:32px;padding:7px 9px;border:1px solid #c4e6d1;border-radius:7px;background:#fff;color:#16241c;outline:0}.ms-input:focus,.ms-modal input:focus,.ms-modal select:focus,.ms-modal textarea:focus{border-color:#22a155;box-shadow:0 0 0 3px rgba(34,161,85,.12)}.ms-input.compact{width:145px}.ms-input.search{width:170px}.ms-input.webhook{width:230px}.ms-chip{padding:6px 9px;border:1px solid #b9d9c4;border-radius:16px;background:#eef9f1;color:#1b7a43;cursor:pointer}.ms-tablewrap{margin:0 22px;overflow:auto;border:1px solid #c4e6d1;border-radius:10px;background:#fff}.ms-table{width:100%;min-width:1180px;border-collapse:separate;border-spacing:0;table-layout:fixed}.ms-content-table{min-width:1420px}.ms-campaign-table{min-width:2016px}.ms-signature-table{min-width:420px}.signature-wrap{max-width:680px}.ms-table th{position:sticky;top:0;z-index:2;height:36px;padding:7px 6px;border-right:1px solid #c4e6d1;border-bottom:1px solid #b9d9c4;background:#eaf6ee;color:#15532f;font-size:11px;letter-spacing:.25px;text-align:center;white-space:nowrap}.ms-table td{height:34px;padding:0 5px;border-right:1px solid #edf3ef;border-bottom:1px solid #edf3ef;text-align:center;overflow:hidden}.ms-table th:last-child,.ms-table td:last-child{border-right:0}.ms-table tr:last-child td{border-bottom:0}.ms-table tbody tr:nth-child(even){background:#fafdfb}.ms-table tbody tr:hover{background:#eef9f1}.ms-table tr.locked td{background:#f7f9f8}.ms-table input:not([type=checkbox]),.ms-table select{box-sizing:border-box;width:100%;height:30px;padding:4px 5px;border:0;background:transparent;color:#16241c;text-align:center;outline:0}.ms-table input:focus,.ms-table select:focus{box-shadow:inset 0 0 0 2px #2ec46b;background:#fff}.ms-table input:disabled,.ms-table select:disabled{color:#5d7567;opacity:1}.ms-select{position:sticky!important;left:0;z-index:3!important;width:36px;min-width:36px;max-width:36px;padding:0!important;background:#fff!important}.ms-table th.ms-select{z-index:5!important;background:#eaf6ee!important}.ms-order{width:48px;color:#8a94a0;font-weight:700}.ms-code{font-size:11.5px;font-weight:700}.ms-empty{height:auto!important;padding:28px!important;color:#8a94a0}.ms-detail{padding:5px 8px;border:1px solid #b9d9c4;border-radius:6px;background:#fff;color:#5d7567;font-size:11px;font-weight:800;cursor:pointer}.ms-detail.ready{border-color:#7fcf9c;background:#eef9f1;color:#1b7a43}.ms-detail.save{border-color:#1b7a43;color:#1b7a43}.ms-detail:disabled{opacity:.4}.ms-status{display:inline-flex;padding:3px 8px;border-radius:12px;background:#edf2f0;color:#5d7567;font-size:11px;font-weight:800}.status-Running{background:#e8f3ff;color:#1769aa}.status-Paused{background:#fff4dd;color:#b66a00}.status-Done{background:#e7f7ed;color:#1b7a43}.status-Draft{background:#edf2f0;color:#5d7567}.ms-overlay{position:fixed;inset:0;z-index:1600;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(16,36,25,.42)}.ms-modal{width:min(640px,calc(100vw - 40px));max-height:calc(100vh - 40px);overflow:auto;border-radius:12px;background:#fff;box-shadow:0 24px 70px rgba(0,0,0,.25)}.ms-modal.wide{width:min(780px,calc(100vw - 40px))}.ms-modal.small{width:min(420px,calc(100vw - 40px))}.ms-modal.campaign-form{width:min(560px,calc(100vw - 40px))}.ms-modal header{display:flex;align-items:center;padding:14px 17px;border-bottom:1px solid #e5eee8}.ms-modal header h3{margin:0;color:#15532f;font-size:16px}.ms-modal header small{color:#d35400}.ms-modal header button{margin-left:auto;border:0;background:transparent;color:#5d7567;font-size:25px;cursor:pointer}.ms-modal-body{display:flex;flex-direction:column;gap:12px;padding:16px 18px}.ms-modal-body label{display:flex;flex-direction:column;gap:6px;color:#40584a;font-size:12px;font-weight:700}.ms-modal-body label>span{font-weight:400}.ms-modal-body input,.ms-modal-body select,.ms-modal-body textarea{width:100%}.ms-modal footer{display:flex;gap:8px;align-items:center;padding:12px 18px;border-top:1px solid #e5eee8}.ms-modal footer>span{flex:1}.ms-content-pad,.ms-signature-pad{min-height:230px;resize:vertical;font:12.5px/1.55 ui-monospace,Menlo,Consolas,monospace}.ms-content-view{min-height:200px;max-height:340px;margin:0;padding:11px 12px;overflow:auto;border:1px solid #e3e8ee;border-radius:8px;background:#f7f9fb;color:#16241c;white-space:pre-wrap;font:12.5px/1.6 ui-monospace,Menlo,Consolas,monospace}.ms-attachment{display:flex;align-items:center;gap:12px;padding-top:10px;border-top:1px solid #eef1f4;color:#40584a}.ms-attachment span{flex:1}.ms-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.ms-inline{display:flex;gap:6px}.ms-inline input{flex:1}.ms-inline select{width:86px}.ms-email{overflow:hidden;border:1px solid #d6ddd9;border-radius:10px;background:#fff}.ms-email>div{padding:10px 14px;border-bottom:1px solid #eef1f4}.ms-email>pre{min-height:130px;margin:0;padding:15px;white-space:pre-wrap;font:13px/1.55 Arial,sans-serif}.ms-email .ms-attachment{border-top:1px solid #eef1f4;border-bottom:0}.ms-modal-body>small{color:#8a94a0}.ms-basic-table th:nth-child(2){width:50px}.ms-basic-table th:nth-child(3){width:120px}.ms-basic-table th:nth-child(4){width:130px}.ms-basic-table th:nth-child(5){width:180px}.ms-basic-table th:nth-child(6){width:80px}.ms-basic-table th:nth-child(7){width:100px}.ms-basic-table th:nth-child(8),.ms-basic-table th:nth-child(9){width:90px}.ms-basic-table th:nth-child(10),.ms-basic-table th:nth-child(11){width:180px}@media(max-width:760px){.ms-toolbar,.ms-tablewrap,.ms-warning,.ms-error{margin-left:12px;margin-right:12px}.ms-form-grid{grid-template-columns:1fr}}
.client-picker{width:min(460px,calc(100vw - 40px))}
.ms-client-cell{white-space:nowrap}
.ms-client-link{padding:0;border:0;background:transparent;color:#1f4ed8;font-size:12.5px;font-weight:700;text-decoration:underline;cursor:pointer}
.ms-client-pencil{padding:1px 3px;border:0;background:transparent;color:#5d7567;font-size:11px;opacity:.55;cursor:pointer}.ms-client-cell:hover .ms-client-pencil{opacity:1}
.ms-client-search{display:flex;gap:8px}.ms-client-search select{width:112px}.ms-client-search input{flex:1;min-width:0}
.ms-client-item{display:flex;justify-content:space-between;gap:10px;padding:7px 11px;border:1px solid #e4e9ee;border-radius:8px;background:#fff;color:#16241c;font:12.5px Arial,sans-serif;cursor:pointer}.ms-client-item:hover{border-color:#9ed4b5;background:#f4f8f5}.ms-client-item span{color:#5a6875}
.ms-client-detail{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid #f0f3ee;font-size:12.5px}.ms-client-detail b{color:#5a6875}.ms-client-detail span{text-align:right}
.ms-workspace-toolbar{gap:8px;min-height:28px;margin:0 22px 12px;overflow:visible;flex-wrap:wrap}
.ms-workspace-toolbar .ms-btn{min-height:28px;padding:7px 16px;border:0;border-radius:8px;background:#008f4c;color:#fff;font-size:12.5px;font-weight:700;line-height:1}
.ms-workspace-toolbar .ms-btn:hover:not(:disabled){background:#04793f}.ms-workspace-toolbar .ms-btn.primary{background:#008f4c}.ms-workspace-toolbar .ms-btn.danger{background:#c0392b;color:#fff}.ms-workspace-toolbar .ms-btn.danger:hover:not(:disabled){background:#a23227}.ms-workspace-toolbar .ms-btn.orange{background:#e67e22;color:#fff}.ms-workspace-toolbar .ms-btn.orange:hover:not(:disabled){background:#cf6f1c}.ms-workspace-toolbar .ms-btn:disabled{opacity:.45;cursor:not-allowed}
.ms-workspace-toolbar .ms-separator{width:1px;height:22px;margin:0 2px;background:#dfe5ea}.ms-workspace-toolbar .ms-input{box-sizing:border-box;min-height:0;height:28px;padding:5px 8px;border:1px solid #d6ddd9;border-radius:7px;background:#fff;color:#16241c;font:12px Arial;box-shadow:none}.ms-workspace-toolbar .ms-input.compact{width:181px}.ms-workspace-toolbar .ms-input.search{width:170px}.ms-workspace-toolbar .ms-input.webhook{width:230px}.ms-workspace-toolbar .ms-chip{padding:3px 12px;border:1px solid #008f4c;border-radius:14px;background:#008f4c;color:#fff;font-size:11.5px;font-weight:700}.ms-campaign-actions{display:flex;align-items:center;gap:8px;margin-left:auto}
.ms-workspace-scroll{margin:0 22px;overflow-x:auto;border:0;border-radius:0;background:transparent}.ms-workspace-table{width:100%;border-collapse:separate;border-spacing:0;table-layout:fixed;color:#16241c;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:12.5px}.ms-workspace-table th,.ms-workspace-table td{text-align:center}.ms-workspace-table th{height:37px;padding:8px 10px!important;border:1px solid #dfe5ea;background:#f0f3ee;color:#42504b;font-size:11px;font-weight:700;letter-spacing:0}.ms-workspace-table td{height:34px;padding:6px 8px;border:1px solid #e4e9ee;background:#fff;vertical-align:middle}.ms-workspace-table tbody tr:nth-child(even),.ms-workspace-table tbody tr:hover{background:transparent}.ms-workspace-table tbody tr:nth-child(even) td,.ms-workspace-table tbody tr:hover td{background:#fff}.ms-workspace-table tr.locked td{background:#f7f9f8}.ms-workspace-table input:not([type=checkbox]),.ms-workspace-table select{height:100%;min-height:30px;padding:7px 8px;border:0;border-radius:0;background:transparent;color:#16241c;font:inherit;text-align:center}.ms-workspace-table select{text-align-last:center}.ms-workspace-table input:focus,.ms-workspace-table select:focus{background:#fff;box-shadow:inset 0 0 0 2px #008f4c}.ms-workspace-table .ms-select{background:#fff!important}.ms-workspace-table th.ms-select{background:#f0f3ee!important}.ms-workspace-table .ms-detail{border:0;border-radius:7px;padding:4px 12px;background:#008f4c;color:#fff;font-size:10.5px;font-weight:800}.ms-workspace-table .ms-detail.ready{background:#0f4c81;color:#fff}.ms-workspace-table .ms-detail.save{background:#008f4c;color:#fff}.signature-wrap{max-width:none}
.ms-subtabs{margin-bottom:10px}.ms-btn.primary{border-color:#008f4c;background:#008f4c}.ms-btn.primary:hover:not(:disabled){background:#04793f}.ms-btn.orange{border-color:#e67e22;background:#e67e22;color:#fff}.ms-btn.grey{border-color:#5a6875;background:#5a6875;color:#fff}.ms-workspace-toolbar .ms-input{line-height:16px}.ms-workspace-table td:has(>input:not([type=checkbox])),.ms-workspace-table td:has(>select){padding:0}
.ms-overlay{background:rgba(15,36,28,.42)}.ms-modal{display:flex;flex-direction:column;max-height:90vh;overflow:hidden;border-radius:14px;box-shadow:0 20px 60px rgba(15,61,35,.28)}.ms-modal header{justify-content:space-between;padding:16px 20px;border-bottom-color:#c4e6d1}.ms-modal header h3{color:#16241c}.ms-modal header small{color:#e67e22;font-size:12px}.ms-modal header button{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;margin-left:auto;padding:0;border-radius:50%;background:#c0392b;color:#fff;font-size:15px;font-weight:800;line-height:1;box-shadow:0 1px 2px rgba(0,0,0,.18)}.ms-modal-body{padding:18px 20px;overflow:auto}.ms-modal footer{justify-content:flex-end;padding:14px 20px;border-top-color:#c4e6d1}
.ms-content-table{min-width:1200px}.ms-modal-body label{gap:4px;margin-bottom:0;color:#16241c}.ms-modal-body input,.ms-modal-body select{min-height:35px;padding:8px 10px;border-radius:8px;font-size:13px;font-weight:400}.ms-modal-body input,.ms-modal-body select,.ms-modal-body textarea{color:#000}.ms-modal-body select{min-height:37px}.ms-modal footer .ms-btn{min-height:28px;padding:7px 13px;border-radius:8px;line-height:1}.campaign-form .ms-form-grid:last-child>label{margin-bottom:12px}.campaign-form .ms-form-grid:last-child small{color:#5d7567;font-size:11px;font-weight:400}
.ms-modal.wide.preview-form{width:min(680px,calc(100vw - 40px))}
.signature-form .ms-modal-body{display:block}.signature-form .ms-modal-body label{display:block;margin-bottom:12px}.signature-form .ms-modal-body label>select,.signature-form .ms-modal-body label>textarea{margin-top:4px}.ms-modal .ms-signature-pad{display:inline-block;min-height:220px;padding:12px;border-color:#d6ddd9;border-radius:8px;color:#000;font:13px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-weight:400}.ms-modal .ms-signature-pad[readonly]{background:#f7f9f8;color:#5a6875}
.ms-workspace-toolbar .ms-btn{font-family:Arial,sans-serif}.ms-workspace-table thead th:first-child{border-top-left-radius:10px}.ms-workspace-table thead th:last-child{border-top-right-radius:10px}
.ms-table thead th,.ms-workspace-table thead th{letter-spacing:.4px}
.ms-modal header h3{color:#0f3d23;font-weight:700}.ms-attachment-label{font-size:12px;font-weight:700}.ms-attachment{padding-top:0;border-top:0;color:#33475b;font-size:12.5px}
.client-picker{width:min(460px,calc(100vw - 40px));border-radius:12px;max-height:88vh;overflow-y:auto}
.client-picker header{padding:14px 16px}
.client-picker header h3{font-size:13.5px;font-weight:800;color:#1f2a26}
.client-picker.ms-modal header button{width:24px;height:24px;font-size:12.5px;font-weight:700}
.client-picker .ms-modal-body{display:flex;padding:14px 16px;gap:6px}
.client-picker .ms-client-search{margin:0 0 2px}
.client-picker .ms-client-search select{width:auto;min-width:88px;min-height:0;padding:6px 7px;font-size:12px}
.client-picker .ms-client-search input{min-height:0;padding:6px 9px;font-size:12.5px}
.client-picker .ms-client-search .ms-btn{padding:7px 16px;border:0;background:#008f4c;color:#fff}
.client-picker footer{padding:12px 16px;border-top-color:#e4e9ee;background:#f7f9f8}
.ms-workspace-table td{white-space:nowrap}
.ms-workspace-table td.ms-select{padding:6px 8px!important}
.ms-workspace-table tr.locked td.ms-select{background:#f7f9f8!important}
.ms-workspace-table tbody tr:nth-child(even){background:#fafdfb}
.ms-workspace-table input:not([type=checkbox]),.ms-workspace-table select{min-height:0;padding:5px 8px;color:#000;white-space:nowrap}
.ms-workspace-table input:not([type=checkbox]){background:#fff}
.ms-campaign-table input[list="ms-content-ids"],.ms-campaign-table input[list="ms-sign-ids"]{text-align:center!important;appearance:none;-webkit-appearance:none}
.ms-campaign-table input[list="ms-content-ids"]::placeholder,.ms-campaign-table input[list="ms-sign-ids"]::placeholder{text-align:center!important}
.ms-campaign-table input[list="ms-content-ids"]::-webkit-list-button,.ms-campaign-table input[list="ms-sign-ids"]::-webkit-list-button{display:none!important}
.ms-workspace-table .ms-order{text-align:center!important}
.ms-workspace-table select{padding-right:16px;appearance:none;-webkit-appearance:none;-moz-appearance:none;background-color:transparent;background-repeat:no-repeat;background-position:right 5px center;background-size:9px 6px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235a6875' stroke-width='1.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");cursor:pointer}
.ms-workspace-table input:disabled,.ms-workspace-table select:disabled{background:#f1f4f2;color:#6b7680;border-color:#e2e8ee;cursor:not-allowed}
.ms-workspace-table select:disabled{opacity:.7;background-image:none}
.ms-workspace-table input[type=checkbox]{background:#fff;color:#000;text-align:center;white-space:nowrap}
.ms-workspace-table .ms-client-link{display:inline;height:auto;line-height:normal;white-space:nowrap}
.ms-workspace-table .ms-detail{font-family:Arial,sans-serif;white-space:nowrap}
.ms-workspace-table .ms-status{display:inline-block;padding:2px 9px;border-radius:11px;font-size:10.5px;font-weight:800;white-space:nowrap}
.ms-workspace-table .status-Draft{background:#e8ecf2;color:#5a6875}.ms-workspace-table .status-Running{background:#e3efe8;color:#1b6b43}.ms-workspace-table .status-Paused{background:#fff3cd;color:#8a6d00}.ms-workspace-table .status-Done{background:#d8f3e2;color:#0c6b39}
.ms-signature-table .ms-code{font-size:12.5px}
</style>
