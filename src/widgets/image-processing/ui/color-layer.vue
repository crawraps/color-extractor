<template>
  <div class="color-layer" :style="{ backgroundColor: mainColor }" @click="handleLayerClick">
    <div class="color-block" v-for="(color, index) in colors" :key="color" :data-color="color" :style="{
      backgroundColor: color,
      transform: `translateX(-${100 * (index + 1)}%)`,
      transitionDuration: `${Math.min((index + 1) * 0.2, 1)}s`,
      zIndex: colors.length - index,
      color: rgbToHsl(hexToRgb(color))[2] > 0.75 ? 'black' : 'white',
    }">
      {{ colors.length <= 10 ? color : null }} </div>
    </div>
</template>

<script setup lang="ts">
import { HEXColor, hexToRgb, rgbToHsl } from '@/shared/utils'
import { computed } from 'vue'
import handleLayerClick from '../model/handleColorLayerClick'

const props = defineProps<{
  colors: HEXColor[]
}>()
const mainColor = computed(() => props.colors[Math.floor(props.colors.length / 2)])
</script>

<style scoped lang="scss">
.color-layer {
  width: 100%;
  height: 100%;
  border-radius: var(--cs-radius);
  display: flex;
  overflow: hidden;

  .color-block {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 0.5rem;
    box-sizing: border-box;
    transition: transform;
    overflow: hidden;

    &:hover {
      font-weight: 700;
    }
  }

  &:hover {
    .color-block {
      transform: translateX(0) !important;
    }
  }
}
</style>
