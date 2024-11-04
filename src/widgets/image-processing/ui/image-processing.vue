<template>
  <CursorCrawler class="upload-image-container" :layers="layers.length ? layers : initialLayers" event="drag" ref="cursor-crawler">
    <template #layer="{ colors }">
      <ColorLayer :colors="colors" />
    </template>
    <template #default>
      <UploadImage @uploaded="handleUpload" :error="error" :state="state" />
    </template>
  </CursorCrawler>
</template>

<script setup lang="ts">
import { UploadImage } from '@/features/upload-image'
import { CursorCrawler } from '@/features/cursor-crawler'
import { useTemplateRef, computed } from 'vue'
import ColorLayer from './color-layer.vue'
import useExtractColors from '../model/useExtractColors'
import { HEXColor } from '@/shared/utils'

const cursorCrawler = useTemplateRef('cursor-crawler')
const crawler = computed(() => cursorCrawler.value?.crawler)

const initialLayers: HEXColor[][] = [['#434343'], ['#555555'], ['#6d6d6d'], ['#8c8c8c'], ['#b0b0b0'], ['#d9d9d9']]
const { layers, state, handleUpload, error } = useExtractColors({
  minLoadingTime: 800,
  onUploadStart: () => {
    if (!crawler.value) throw new Error('Crawler not initialized')
    crawler.value.updatePosition([0, 0])
  },
  onUploadSuccess: layers => {
    if (!crawler.value) throw new Error('Crawler not initialized')
    crawler.value.updatePosition([0, 0.325 * layers.length])
  },
})
</script>

<style scoped lang="scss">
.upload-image-container {
  position: relative;
  display: flex;
  place-items: center;
  width: 100%;
  aspect-ratio: 3 / 2;
  background-color: var(--cs-generated-background);
  border-radius: var(--cs-radius);
  cursor: pointer;
  transition: background-color var(--cs-transition);
  box-sizing: border-box;
}
</style>
