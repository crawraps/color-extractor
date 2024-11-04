<template>
  <ImageProcessing class="image-processing" />
</template>

<script setup lang="ts">
import { ImageProcessing } from '@/widgets/image-processing'
import { usePreferencesStore } from '@/shared/store'

const prefs = usePreferencesStore()
</script>

<style scoped lang="scss">
.image-processing {
  margin-top: 12rem;
}
</style>
