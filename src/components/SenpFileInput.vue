<template>
  <div
    :class="{
      [classes?.draggedOver ?? 'drop-zone-active']: draggedOver,
      [classes?.default ?? 'drop-zone-default']: !draggedOver,
      ...$xClass('rounded-2xl overflow-hidden', classes?.wrapper),
    }"
    @dragover="dragover"
    @dragleave="dragleave"
    @drop="drop"
  >
    <input
      :multiple="multiple"
      type="file"
      id="assetsFieldHandle"
      class="sr-only"
      ref="inputRef"
      @change="updateInputHandler"
    />

    <label
      for="assetsFieldHandle"
      :class="
        $xClass(
          'group grid gap-4 rounded-2xl border-2 border-neutral-700 bg-gradient-to-br p-8 transition duration-300 cursor-pointer',
          classes?.dropZone
        )
      "
    >
      <slot name="dropzone" :draggedOver="draggedOver">
        <div class="grid gap-2 text-center">
          <p>Drag and drop to upload</p>
          <p class="text-xs text-neutral-500">or</p>
          <p>
            <span class="text-blue-300 transition duration-200 group-hover:text-blue-400 group-hover:underline"
              >click</span
            >
            to upload your files
          </p>
        </div>
      </slot>
      <slot name="files" :fnames="fnames" :removeFiles="removeFiles">
        <div class="flex flex-col gap-4 items-start pt-3 relative z-30" v-if="fnames?.length && !hideFiles">
          <ul class="p-2 rounded-lg bg-neutral-800/40 space-y-1">
            <li v-for="(name, index) in fnames" :key="name" class="flex items-center gap-4 justify-between w-full">
              <p>
                {{ name }}
              </p>
              <button @click.stop.prevent="() => removeFileByIndex(index)" class="hover:text-orange-400">
                <Icon name="mdi:close"></Icon>
              </button>
            </li>
          </ul>
          <button
            @click.stop.prevent="removeFiles"
            class="hover:text-orange-400 flex gap-4 items-center bg-orange-900/40 p-2 rounded-lg"
          >
            Remove All<Icon name="mdi:close"></Icon>
          </button>
        </div>
      </slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import { XClass } from 'senp-ui/src/plugins/xClass'
const props = withDefaults(
  defineProps<{
    modelValue?: any
    readAs: 'binary-string' | 'data-url' | 'text' | 'array-buffer' | 'file'
    hideFiles?: boolean
    multiple?: boolean
    classes?: {
      wrapper?: XClass
      dropZone?: XClass
      draggedOver?: string
      default?: string
    }
  }>(),
  {
    hideFiles: false,
    multiple: false,
  }
)
const emit = defineEmits<{
  (event: 'update:modelValue', newValue: any): void
}>()
const inputRef = ref(null)
const fnames = ref<string[]>([])
const draggedOver = ref(false)

const processFile = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    const _readAs = {
      'binary-string': () => {
        reader.readAsBinaryString(file)
      },
      'data-url': () => {
        reader.readAsDataURL(file)
      },
      text: () => {
        reader.readAsText(file)
      },
      'array-buffer': () => {
        reader.readAsArrayBuffer(file)
      },
      file: () => {},
    }[props.readAs]()

    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = (error: any) => reject(error)
  })

async function updateInputHandler() {
  if (!inputRef.value) {
    return
  }
  if (props.multiple) {
    const files: FileList = (inputRef.value as any).files
    const _fnames = []
    for (const f of files) {
      _fnames.push(f.name)
    }
    fnames.value = _fnames
    if (props.readAs === 'file') {
      emit('update:modelValue', files)
      return
    } else {
      const res = []
      for (const f of files) {
        const curr = await processFile(f)
        res.push(curr)
      }
      emit('update:modelValue', res)
    }
  } else {
    const file = (inputRef.value as any).files[0]
    fnames.value = [file.name]
    if (props.readAs === 'file') {
      emit('update:modelValue', file)
    } else {
      const res = await processFile(file)
      emit('update:modelValue', res)
    }
  }
}

const removeFileByIndex = (index: number) => {
  const _fnames = []
  const dt = new DataTransfer()
  const { files } = inputRef.value as any
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (index !== i) {
      _fnames.push(file.name)
      dt.items.add(file) // here you exclude the file. thus removing it.
    }
  }
  ;(inputRef.value as any).files = dt.files // Assign the updates list
  fnames.value = _fnames
  updateInputHandler()
}

const removeFiles = () => {
  ;(inputRef.value as any).value = ''
  fnames.value = []
  emit('update:modelValue', null)
}

const dragover = (event: any) => {
  event.preventDefault()
  if (!draggedOver.value) {
    draggedOver.value = true
  }
}
const dragleave = (event: any) => {
  draggedOver.value = false
}
const drop = (event: any) => {
  event.preventDefault()
  ;(inputRef.value as any).files = event.dataTransfer.files
  updateInputHandler()
  draggedOver.value = false
}

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue == null) {
      console.log('SHOULD BE REMOVING')
      removeFiles()
    }
  }
)
</script>

<style lang="postcss">
.drop-zone-default {
  @apply bg-gradient-to-br transition duration-300 bg-neutral-900 from-neutral-800;
}
.drop-zone-active {
  @apply bg-gradient-to-br transition duration-300 bg-blue-900 from-neutral-800;
}
</style>
