<template>
  <div class="cursor-observer-container" ref="container">
    <slot v-for="(colors, index) in layers" :key="index" name="layer" :colors="colors" />
    <div class="content-layer">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useCrawlCursor } from '../model/crawlCursor'
import { handleEvent } from '../model/handleEvent'
import { HEXColor } from '@/shared/utils'

const container = useTemplateRef('container')
const props = defineProps<{
  layers: HEXColor[][]
  event?: 'mouse' | 'drag'
}>()

const crawler = useCrawlCursor(container, {
  boundingRadius: 800,
  stretchStrength: 0.4,
})

handleEvent(crawler.updateCoords, props.event)

defineExpose({
  crawler,
})
</script>

<style scoped lang="scss">
.cursor-observer-container > * {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.content-layer {
  background-color: var(--cs-accent);
  border-radius: var(--cs-radius);
}
</style>
