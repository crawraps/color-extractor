<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import useAutoSyncTitle from './model/useAutoSyncTitle'

useAutoSyncTitle()
</script>

<style scoped lang="scss">
.container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 1024px) {
    max-width: 768px;
  }

  @media (max-width: 768px) {
    max-width: 512px;
  }

  @media (max-width: 512px) {
    max-width: 100%;
  }
}
</style>
