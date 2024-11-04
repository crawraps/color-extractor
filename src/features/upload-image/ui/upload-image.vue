<template>
  <label
    for="image-upload"
    dropzone="copy"
    class="dropzone"
    ref="dropzone"
    @drop.prevent="loadFile"
    @dragenter="dragged = true"
    @dragleave="dragged = false"
    @dragend="dragged = false"
  >
    <CubeIcon class="icon" :active="dragged" :state="state" />
    <TransitionGroup name="title" tag="div" class="title">
      <p v-if="state === 'idle'" key="idle"><strong>Select</strong> or <strong>drop</strong> an image here</p>
      <p v-else-if="state === 'loading'" key="loading">processing...</p>
      <p v-else-if="state === 'error'" key="error">{{ error }}</p>
    </TransitionGroup>
  </label>
  <input type="file" id="image-upload" hidden @input.prevent="loadFile" />
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import CubeIcon from './cube-icon.vue'
import preventGlobalFileOpen from '../model/preventGlobalFileOpen'

defineProps<{
  onFileLoaded?: (file: File) => void
  state?: 'idle' | 'loading' | 'error'
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'uploaded', file?: File): void
}>()

const dropzone = useTemplateRef<HTMLElement>('dropzone')

const dragged = ref(false)
const loadFile = (ev: Event) => {
  dragged.value = false

  let file: File | undefined

  if (ev instanceof DragEvent) {
    file = ev.dataTransfer?.files[0]
  } else {
    file = (ev.target as HTMLInputElement).files?.[0]
  }

  emit('uploaded', file)
}

preventGlobalFileOpen()
</script>

<style scoped lang="scss">
.dropzone {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  gap: 1rem;

  .icon {
    width: 8rem;
    height: 8rem;
  }

  .title {
    height: 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
      position: absolute;
      margin: 0;
      text-align: center;
    }
  }

  &:hover {
    strong {
      font-weight: 800;
    }

    .icon {
      fill: var(--cs-generated-col2);
    }
  }
}

.title-enter-active,
.title-leave-active {
  transition: var(--cs-transition) ease-in-out;
}

.title-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.title-leave-to {
  opacity: 0;
  transform: translateY(-1rem);
}
</style>
