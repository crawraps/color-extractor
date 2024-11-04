<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 256 256"
    :class="{ active, error: state === 'error' }"
    ref="svg"
  >
    <path
      d="m223.68 66.15l-88-48.15a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03M128 32l80.34 44L128 120L47.66 76ZM40 90l80 43.78v85.79l-80-43.75Zm96 129.57v-85.75L216 90v85.78Z"
    ></path>
  </svg>
</template>

<script lang="ts" setup>
import anime from 'animejs'
import { useTemplateRef, watch, onMounted } from 'vue'

const props = defineProps<{
  active?: boolean
  state?: 'idle' | 'loading' | 'error'
}>()

const svg = useTemplateRef<SVGElement>('svg')

let loadingAnimation: anime.AnimeInstance
onMounted(() => {
  loadingAnimation = anime({
    targets: svg.value,
    scale: [
      {
        value: 0.9,
        duration: 200,
        easing: 'linear',
      },
      {
        value: 1,
        duration: 200,
        delay: 400,
        easing: 'linear',
      },
    ],
    rotate: {
      value: '+=120',
      duration: 800,
      easing: 'easeInOutBack',
    },
    loop: true,
    autoplay: false,
  })
})

watch(
  () => props.state,
  value => {
    switch (value) {
      case 'loading':
        loadingAnimation.play()
        break
      case 'error':
        loadingAnimation.restart()
        loadingAnimation.pause()
        break
      case 'idle':
        loadingAnimation.restart()
        loadingAnimation.pause()
        break
    }
  },
)
</script>

<style scoped lang="scss">
svg {
  path {
    fill: var(--cs-background);
    transition: all var(--cs-transition) ease-in-out;
  }

  &.active {
    path {
      scale: 0.9;
      fill: var(--cs-generated-col2);
      transform-origin: center;
    }
  }

  &.error {
    path {
      fill: var(--cs-error);
    }
  }
}
</style>
