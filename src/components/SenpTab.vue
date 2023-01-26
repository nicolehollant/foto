<template>
  <div :class="$xClass('flex flex-wrap gap-2 sticky top-0', classes?.optionsWrapper)" v-if="chips">
    <button
      v-for="option in options"
      @click="
        () => {
          active = option
          $emit('update:modelValue', option)
        }
      "
      class=""
      :class="{
        '!text-sky-300 !border-sky-700 bg-sky-700/30': active === option,
        ...$xClass(
          'px-2.5 py-1 h-max leading-none font-medium border-2 border-neutral-700 rounded-full text-neutral-400 hover:text-sky-500 transition',
          classes?.options
        ),
      }"
      :key="option + ''"
    >
      {{ (option + '').split('_').join(' ') }}
    </button>
  </div>
  <div :class="$xClass('flex sticky top-0', classes?.optionsWrapper)" v-else>
    <button
      v-for="option in options"
      @click="
        () => {
          active = option
          $emit('update:modelValue', option)
        }
      "
      :class="{
        '!text-sky-400 !border-sky-400': active === option,
        ...$xClass(
          'pb-1 px-3 font-semibold border-b-2 border-neutral-400/20 text-neutral-400 hover:text-sky-500 transition',
          classes?.options
        ),
      }"
      :key="option + ''"
    >
      {{ (option + '').split('_').join(' ') }}
    </button>
  </div>
  <template>
    <slot :active="active"></slot>
  </template>
</template>

<script setup lang="ts">
import { XClass } from 'senp-ui/src/plugins/xClass'

const props = defineProps<{
  modelValue?: any
  options: any[]
  chips?: boolean
  classes?: {
    options?: XClass
    optionsWrapper?: XClass
  }
}>()

defineEmits<{
  (event: 'update:modelValue', value: any): void
}>()
const active = ref(props.modelValue ?? props.options[0])
</script>
