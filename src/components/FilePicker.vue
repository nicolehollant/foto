<template>
  <section>
    <SenpFileInput
      class="w-full h-full"
      ref="fileInput"
      :multiple="multiple"
      :model-value="modelValue"
      @update:model-value="processFiles"
      read-as="file"
      :classes="{
        dropZone: {
          extend: 'w-full h-full relative overflow-hidden sm:!px-8 sm:!py-24 !py-12 !px-4 !border-neutral-700 !border',
        },
        draggedOver: 'bg-gradient-to-br transition duration-300 bg-blue-900 from-neutral-800',
        default: 'bg-gradient-to-br transition duration-300 bg-neutral-900 from-neutral-800',
      }"
    >
      <template #dropzone="{ draggedOver }">
        <div class="flex flex-col items-center justify-center gap-2 text-center h-full relative z-20">
          <div
            class="max-w-2xl flex flex-col gap-2 items-center justify-center px-4 py-6 rounded-2xl bg-neutral-800/40 shadow-lg border border-neutral-700/40 border-dashed backdrop-blur-[2px]"
          >
            <p class="text-sm text-neutral-200 sm:text-white sm:text-lg leading-relaxed">Drag and drop files</p>
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
    <slot name="upload" :uploadFiles="uploadFiles" :res="res">
      <SenpButton v-if="res.length" class="mt-4 w-1/3 min-w-[5rem] justify-center" @click="uploadFiles"
        >Save Blob</SenpButton
      >
    </slot>
  </section>
</template>

<script setup lang="ts">
import SenpFileInput from './SenpFileInput.vue'

const fileInput = ref(null)
const props = withDefaults(
  defineProps<{
    modelValue?: any
    multiple?: boolean
  }>(),
  {
    multiple: false,
  }
)

const emit = defineEmits<{
  (event: 'update:files', value: { blob: Blob | string; mimetype: string; filename: string | null }[]): void
  (event: 'update:modelValue', newValue: any): void
}>()

const res = ref<{ blob: Blob | string; mimetype: string; filename: string | null }[]>([])

const processFiles = (files: File | FileList) => {
  if (!files) {
    res.value = []
    return
  }
  console.log({ files })
  res.value = []
  if (props.multiple) {
    for (const file of files as FileList) {
      res.value.push({
        filename: file.name,
        mimetype: file.type,
        blob: file,
      })
    }
  } else {
    res.value.push({
      filename: (files as File).name,
      mimetype: (files as File).type,
      blob: files as File,
    })
  }
  emit('update:modelValue', res.value)
}

const uploadFiles = () => {
  emit('update:files', res.value)
}
</script>
