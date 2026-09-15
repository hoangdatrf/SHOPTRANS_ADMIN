<template>
  <div class="management-screen">
    <header class="mg-header">
      <div>
        <p class="mg-eyebrow">Integrations &gt; API Diagnostics</p>
        <h1>Live Carrier Rates Tester</h1>
        <p>Test real-time spot rates from shipping carriers API. This endpoint connects to the configured third-party aggregator.</p>
      </div>
    </header>

    <section class="mg-panel" style="margin-bottom:18px;">
      <div class="mg-filterbar">
        <label class="mg-field">
          <span>Carrier</span>
          <select v-model="carrier" class="mg-select">
            <option value="MAERSK">MAERSK</option>
            <option value="EVERGREEN">EVERGREEN</option>
            <option value="COSCO">COSCO</option>
            <option value="MSC">MSC</option>
            <option value="CMA CGM">CMA CGM</option>
          </select>
        </label>
        <label class="mg-field">
          <span>Port of Loading</span>
          <input v-model.trim="pol" class="mg-input" placeholder="e.g. VNSGN" />
        </label>
        <label class="mg-field">
          <span>Port of Destination</span>
          <input v-model.trim="pod" class="mg-input" placeholder="e.g. USLAX" />
        </label>
        <button class="mg-btn primary" type="button" :disabled="loading" @click="fetchRates">
          {{ loading ? 'Connecting to API...' : 'Check Live Rates' }}
        </button>
      </div>
    </section>

    <section class="mg-grid" v-if="result">
      <article class="mg-panel">
        <div class="mg-panel-head">
          <div class="mg-panel-title">
            <h2>API Response (Live Data)</h2>
            <span class="mg-badge success">Success (200 OK)</span>
          </div>
        </div>
        <div class="mg-table-wrap" style="padding: 16px;">
          <div style="margin-bottom: 12px">
            <strong>Carrier:</strong> {{ result.carrier }} | 
            <strong>Route:</strong> {{ result.pol }} -> {{ result.pod }}
          </div>
          <table class="mg-table">
            <thead>
              <tr>
                <th>Vessel</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Transit Time</th>
                <th>Gate In</th>
                <th>Spot Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sailing in result.sailings" :key="sailing.departure">
                <td>{{ sailing.vessel }}</td>
                <td>{{ sailing.departure }}</td>
                <td>{{ sailing.arrival }}</td>
                <td>{{ sailing.transit }}</td>
                <td>{{ sailing.gateIn }}</td>
                <td>
                  <strong v-if="!sailing.soldOut" style="color: #10b981">{{ sailing.price }}</strong>
                  <span v-else style="color: #ef4444">Sold Out</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top: 16px; font-family: monospace; background: #f1f5f9; padding: 12px; border-radius: 4px;">
            <pre>{{ JSON.stringify(result, null, 2) }}</pre>
          </div>
        </div>
      </article>
    </section>

    <div v-if="error" class="mg-notice error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const carrier = ref('MAERSK')
const pol = ref('VNSGN')
const pod = ref('USLAX')
const loading = ref(false)
const result = ref<any>(null)
const error = ref('')

const fetchRates = async () => {
  loading.value = true
  error.value = ''
  result.value = null
  try {
    const res = await fetch(`/api/live-rates?carrier=${encodeURIComponent(carrier.value)}&pol=${encodeURIComponent(pol.value)}&pod=${encodeURIComponent(pod.value)}`)
    if (!res.ok) throw new Error('API request failed')
    result.value = await res.json()
  } catch (err: any) {
    error.value = err.message || 'Error connecting to live rates API'
  } finally {
    loading.value = false
  }
}
</script>

<style src="~/assets/css/fcl-admin-management.css"></style>
