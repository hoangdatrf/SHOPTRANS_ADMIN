<template>
  <div class="admin-loading-screen" :class="{ compact }" role="status" aria-live="polite">
    <div class="admin-loading-card">
      <div class="admin-loading-mark" aria-hidden="true"><img src="/shoptrans-admin-mark.svg" alt="" /></div>
      <strong>SHOPTRANS</strong>
      <small>{{ message }}</small>
      <span v-if="detail" class="admin-loading-detail">{{ detail }}</span>
      <div class="admin-loading-dots" aria-hidden="true"><i></i><i></i><i></i></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ message?: string; detail?: string; compact?: boolean }>(), {
  message: 'Loading data', detail: '', compact: false,
})
</script>

<style scoped>
.admin-loading-screen{box-sizing:border-box;display:flex;min-height:260px;width:100%;align-items:flex-start;justify-content:center;padding:68px 16px 24px;background:linear-gradient(180deg,rgba(248,252,249,.94),rgba(255,255,255,.88));color:#164c30;cursor:wait}
.admin-loading-screen.compact{min-height:0;height:100%;align-items:center;padding:18px;background:rgba(255,255,255,.97)}
.admin-loading-card{display:flex;min-width:178px;box-sizing:border-box;flex-direction:column;align-items:center;padding:23px 28px 20px;border:1px solid rgba(24,150,80,.14);border-radius:16px;background:rgba(255,255,255,.97);box-shadow:0 16px 38px rgba(22,74,45,.13);text-align:center}
.admin-loading-mark{position:relative;display:grid;width:52px;height:52px;margin-bottom:11px;place-items:center}
.admin-loading-mark::before{content:"";position:absolute;inset:0;border:2px solid #d7f1e2;border-top-color:#0ba85a;border-radius:50%;animation:admin-loading-spin .8s linear infinite}
.admin-loading-mark img{position:relative;z-index:1;width:38px;height:38px;display:block;border-radius:10px;box-shadow:0 6px 14px rgba(9,145,77,.22)}
.admin-loading-card strong{font-size:13px;font-weight:800;letter-spacing:.45px}.admin-loading-card small{margin-top:3px;color:#73847c;font-size:11px}
.admin-loading-detail{max-width:230px;margin-top:4px;color:#8b9891;font-size:10.5px;font-weight:600}
.admin-loading-dots{display:flex;gap:4px;margin-top:12px}.admin-loading-dots i{width:5px;height:5px;border-radius:50%;background:#18ad60;animation:admin-loading-pulse 1s ease-in-out infinite}.admin-loading-dots i:nth-child(2){animation-delay:.14s}.admin-loading-dots i:nth-child(3){animation-delay:.28s}
@keyframes admin-loading-spin{to{transform:rotate(360deg)}}@keyframes admin-loading-pulse{0%,80%,100%{opacity:.28;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
</style>
