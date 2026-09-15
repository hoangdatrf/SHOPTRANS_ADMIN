<template>
      <!-- ==================== STEP 6: BOOKING CONFIRMATION ==================== -->
      <div class="s6-wrap">
        <div class="s6-container">

          <!-- Animated success checkmark -->
          <div class="s6-check-wrap">
            <div class="s6-check-ring">
              <svg class="s6-check-svg" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="s6-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#22c55e" />
                    <stop offset="100%" stop-color="#15803d" />
                  </linearGradient>
                  <filter id="s6-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <!-- Circle bg -->
                <circle class="s6-check-circle" cx="70" cy="70" r="62" />
                <!-- Checkmark -->
                <path class="s6-check-tick" d="M42 72 L60 90 L98 52" filter="url(#s6-glow)" />
              </svg>
            </div>
          </div>

          <p class="s6-message">
            Thanks for booking with Shoptrans. Your booking reference is:
            <a href="#" class="s6-ref-link">{{ bookingReference }}</a>.
            Your booking confirmation will be sent to your mail.
          </p>
          <div class="s6-divider"></div>
          <p class="s6-sub-message">At the same time, you can also perform other related actions through the buttons below:</p>
          <div class="s6-actions">
            <!-- FCL INSTANT QUOTATION -->
            <div class="s6-action-item" @click="reloadFcl">
              <div class="s6-icon-wrap">
                <img :src="imgQuotation" alt="FCL Instant Quotation" class="s6-icon-img" />
              </div>
              <span class="s6-action-label">FCL INSTANT QUOTATION</span>
            </div>
            <!-- LCL INSTANT QUOTATION -->
            <div class="s6-action-item" @click="$router.push('/lcl')">
              <div class="s6-icon-wrap">
                <img :src="imgQuotation" alt="LCL Instant Quotation" class="s6-icon-img" />
              </div>
              <span class="s6-action-label">LCL INSTANT QUOTATION</span>
            </div>
            <!-- AIR INSTANT QUOTATION -->
            <div class="s6-action-item">
              <div class="s6-icon-wrap">
                <img :src="imgQuotation" alt="AIR Instant Quotation" class="s6-icon-img" />
              </div>
              <span class="s6-action-label">AIR INSTANT QUOTATION</span>
            </div>
            <!-- PRODUCTS -->
            <div class="s6-action-item" @click="$router.push('/products')">
              <div class="s6-icon-wrap">
                <img :src="imgProducts" alt="Products" class="s6-icon-img" />
              </div>
              <span class="s6-action-label">PRODUCTS</span>
            </div>
            <!-- SOLUTIONS -->
            <div class="s6-action-item" @click="$router.push('/solutions')">
              <div class="s6-icon-wrap">
                <img :src="imgSolutions" alt="Solutions" class="s6-icon-img" />
              </div>
              <span class="s6-action-label">SOLUTIONS</span>
            </div>
          </div>
        </div>
      </div><!-- end step6 -->
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Ref } from 'vue'

import imgQuotation from '~/assets/img_26.png'
import imgProducts from '~/assets/img_27.png'
import imgSolutions from '~/assets/img_28.png'

const bookingReference = inject('fcl-bookingReference') as Ref<string>

const reloadFcl = () => {
  window.location.href = '/fcl?reset=1'
}
</script>

<style scoped>
.s6-wrap { display: flex; align-items: center; justify-content: center; min-height: 50vh; padding: 40px 24px; font-family: 'DM Sans', sans-serif; }
.s6-container { max-width: 780px; width: 100%; text-align: center; }
.s6-message { font-size: 15px; color: #1a1a1a; line-height: 1.7; margin-bottom: 16px; }
.s6-ref-link { color: #16a34a; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
.s6-divider { width: 480px; max-width: 100%; height: 1.5px; background: #1a1a1a; margin: 0 auto 32px; }
.s6-sub-message { font-size: 15px; color: #1a1a1a; margin-bottom: 36px; }
.s6-actions { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; }
.s6-action-item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: transform .18s; width: 110px; text-align: center; min-height: 120px; }
.s6-action-item:hover { transform: translateY(-3px); }
.s6-icon-wrap { width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; }
.s6-icon-img { width: 100%; height: 100%; object-fit: contain; }
.s6-action-label { font-size: 12px; font-weight: 800; color: #05103a; text-align: center; line-height: 1.1; letter-spacing: .03em; text-transform: uppercase; max-width: 100px; white-space: pre-line; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: calc(1.1em * 2); }

/* ── Animated Success Checkmark ── */
.s6-check-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.s6-check-ring {
  position: relative;
  width: 70px;
  height: 70px;
  animation: s6-pop 0.4s cubic-bezier(.175,.885,.32,1.275) 1.2s both;
}

/* Outer glow ring */
.s6-check-ring::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(22,163,74,.18) 0%, transparent 70%);
  animation: s6-glow-pulse 2s ease-in-out 1.6s infinite;
}

.s6-check-svg {
  width: 70px;
  height: 70px;
  position: relative;
  z-index: 1;
}

/* Circle: draws itself then fills */
.s6-check-circle {
  fill: none;
  stroke: url(#s6-grad);
  stroke-width: 5;
  stroke-linecap: round;
  stroke-dasharray: 390;
  stroke-dashoffset: 390;
  animation:
    s6-draw-circle 0.7s ease-out 0.15s forwards,
    s6-fill-circle 0.4s ease-out 1.2s forwards;
}

@keyframes s6-draw-circle {
  to { stroke-dashoffset: 0; }
}

@keyframes s6-fill-circle {
  to { fill: url(#s6-grad); }
}

/* Tick: draws left to right, then turns white */
.s6-check-tick {
  fill: none;
  stroke: #22c55e;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation:
    s6-draw-tick 0.5s ease-out 0.8s forwards,
    s6-tick-white 0.4s ease-out 1.2s forwards;
}

@keyframes s6-draw-tick {
  to { stroke-dashoffset: 0; }
}

@keyframes s6-tick-white {
  to { stroke: #fff; }
}

/* Scale bounce at the end */
@keyframes s6-pop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.15); }
  70%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}

/* Continuous soft glow pulse */
@keyframes s6-glow-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.5; transform: scale(1.08); }
}
</style>
