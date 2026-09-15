<template>
  <div class="tracking-card" @click="$emit('click')">
    <div class="icon-wrap">
      <img v-if="image" :src="image" :alt="title" class="icon-img" />
      <div v-else class="icon">{{ icon }}</div>
    </div>
    <div class="title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  icon?: string
  image?: string
  title: string
}>()
</script>

<style scoped>
.tracking-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 110px;
  text-align: center;
  cursor: pointer;
  /* ensure all cards occupy the same vertical space so rows align */
  min-height: 120px;
}
.tracking-card .icon-wrap {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tracking-card .icon-wrap .icon {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  background: #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 28px;
}
.tracking-card .icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.tracking-card .title {
  font-size: 12px;
  font-weight: 800;
  color: #05103a;
  /* allow explicit pre-line breaks but clamp to maximum 2 lines to keep card heights consistent */
  white-space: pre-line;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.1;
  min-height: calc(1.1em * 2); /* reserve space for two lines */
}
</style>


