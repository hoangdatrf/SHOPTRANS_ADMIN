<template>
  <div class="admin-light-scheme" lang="en-GB">
    <slot />
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en-GB',
  },
})
</script>

<style>
.admin-light-scheme,
.admin-light-scheme input,
.admin-light-scheme select,
.admin-light-scheme textarea,
.admin-light-scheme button,
.admin-light-scheme option,
.admin-light-scheme optgroup,
.admin-light-scheme datalist {
  color-scheme: only light;
}

.admin-light-scheme select,
.admin-light-scheme option,
.admin-light-scheme optgroup {
  background-color: #fff;
  color: #17251d;
}

.admin-light-scheme input::-webkit-calendar-picker-indicator {
  color-scheme: only light;
}
</style>
