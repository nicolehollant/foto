<template>
  <section v-if="stage === 'upload'">
    <SenpFileInput
      @update:model-value="processFile"
      read-as="file"
      :classes="{
        dropZone: {
          extend: 'w-full h-full relative overflow-hidden sm:!px-8 sm:!py-24 !py-12 !px-4 !border-neutral-700 !border',
        },
        draggedOver: 'bg-gradient-to-br transition duration-300 bg-blue-900 from-neutral-800',
        default: 'bg-gradient-to-br transition duration-300 bg-neutral-900 from-neutral-800',
      }"
      hide-files
    >
      <template #dropzone="{ draggedOver }">
        <div class="flex flex-col items-center justify-center gap-2 text-center h-full relative z-20">
          <div
            class="max-w-2xl flex flex-col gap-2 items-center justify-center px-4 py-6 rounded-2xl bg-neutral-800/40 shadow-lg border border-neutral-700/40 border-dashed backdrop-blur-[2px]"
          >
            <p class="text-sm text-neutral-200 sm:text-white sm:text-lg leading-relaxed">Drag and drop an image</p>
            <p class="text-xs text-neutral-500">or</p>
            <p>
              <span class="text-blue-300 transition duration-200 group-hover:text-blue-400 group-hover:underline"
                >click</span
              >
              to upload
            </p>
          </div>
        </div>
        <div class="absolute -inset-2 z-10">
          <img
            src="@/assets/upload.png"
            alt=""
            :class="{ 'blur-sm scale-150 translate-y-4 saturate-100': draggedOver }"
            class="opacity-30 object-cover object-[25%_25%] w-full h-full filter brightness-75 saturate-[0.75] transition-all duration-500 transform -translate-x-16 scale-125"
          />
        </div>
      </template>
    </SenpFileInput>
  </section>
  <section v-else>
    <div class="flex items-center p-2">
      <button
        @click="
          () => {
            img = null
            stage = 'upload'
          }
        "
      >
        <Icon name="mdi:arrow-left"></Icon> Back
      </button>
    </div>
    <div class="relative pl-16 flex p-2 rounded-lg bg-black overflow-hidden">
      <div class="absolute inset-y-0 left-0 w-16 items-center flex flex-col gap-2 p-2 bg-neutral-900">
        <button
          class="text-xl w-12 h-12 rounded-md bg-neutral-900 text-neutral-300 hover:text-sky-400 hover:bg-neutral-800 transition"
          @click="() => rotate(90)"
        >
          <Icon name="mdi:rotate-right"></Icon>
        </button>
        <button
          class="text-xl w-12 h-12 rounded-md bg-neutral-900 text-neutral-300 hover:text-sky-400 hover:bg-neutral-800 transition"
          @click="() => rotate(-90)"
        >
          <Icon name="mdi:rotate-left"></Icon>
        </button>
        <button
          class="text-xl w-12 h-12 rounded-md bg-neutral-900 text-neutral-300 hover:text-sky-400 hover:bg-neutral-800 transition"
          @click="() => flip(true, false)"
        >
          <Icon name="mdi:flip-horizontal"></Icon>
        </button>
        <button
          class="text-xl w-12 h-12 rounded-md bg-neutral-900 text-neutral-300 hover:text-sky-400 hover:bg-neutral-800 transition"
          @click="() => flip(false, true)"
        >
          <Icon name="mdi:flip-vertical"></Icon>
        </button>
      </div>
      <cropper v-if="fullSize" class="h-[400px]" ref="cropperRef" :src="img" :defaultSize="defaultSize" />
      <cropper
        v-else
        class="h-[400px]"
        ref="cropperRef"
        :src="img"
        :auto-zoom="true"
        :stencil-size="{
          width: 300,
          height: 300,
        }"
        :canvas="{
          height: size,
          width: size,
        }"
        image-restriction="stencil"
      />
    </div>
    <SenpButton class="mt-4 w-1/3 min-w-[5rem] justify-center" v-if="saveAs === 'dataurl'" @click="getResult"
      >Save</SenpButton
    >
    <SenpButton class="mt-4 w-1/3 min-w-[5rem] justify-center" v-else @click="uploadImage">Save Blob</SenpButton>
  </section>
</template>

<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import 'vue-advanced-cropper/dist/theme.compact.css'

import SenpFileInput from './SenpFileInput.vue'

withDefaults(
  defineProps<{
    size?: number
    fullSize?: boolean
    saveAs?: 'blob' | 'dataurl'
  }>(),
  {
    fullSize: false,
    size: 64,
    saveAs: 'dataurl',
  }
)

const emit = defineEmits<{
  (event: 'update:image', value: string | null): void
  (event: 'update:blob', value: { blob: Blob | string; mimetype: string; filename: string | null }): void
}>()

const fileName = ref('')
const mimeType = ref('')

const stage = ref<'upload' | 'crop'>('upload')

const img = ref<string | null>(null)

const defaultSize = ({
  imageSize,
  visibleArea,
}: {
  imageSize: { width: number; height: number }
  visibleArea: { width: number; height: number }
}) => ({
  width: (visibleArea || imageSize).width,
  height: (visibleArea || imageSize).height,
})

const processFile = (file: any) => {
  console.log({ file })
  mimeType.value = file.type ?? ''
  fileName.value = file.name ?? ''
  img.value = URL.createObjectURL(file)
  stage.value = 'crop'
}

const flip = (x: boolean, y: boolean) => {
  const { image } = (cropperRef.value as any)?.getResult?.()
  if (image.transforms.rotate % 180 !== 0) {
    ;(cropperRef.value as any)?.flip?.(!x, !y)
  } else {
    ;(cropperRef.value as any)?.flip?.(x, y)
  }
}
const rotate = (angle: 90 | -90) => {
  ;(cropperRef.value as any)?.rotate?.(angle)
}

const cropperRef = ref(null)
const result = ref<null | string>(null)
const getResult = () => {
  const { canvas } = (cropperRef.value as any)?.getResult?.()
  if (canvas) {
    result.value = canvas.toDataURL()
  }
  emit('update:image', result.value)
}

const uploadImage = () => {
  const { canvas } = (cropperRef.value as any)?.getResult()
  if (canvas) {
    canvas.toBlob((blob: any) => {
      emit('update:blob', { blob, filename: fileName.value, mimetype: mimeType.value })
    }, mimeType.value)
  }
}
</script>
