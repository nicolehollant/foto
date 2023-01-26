<template>
  <SenpLayoutBasic
    fixed-header
    :classes="{
      header: {
        extend: 'text-2xl bg-neutral-900/60 backdrop-blur',
      },
      content: {
        extend: '!flex flex-col max-w-screen overflow-auto w-full',
      },
      footer: {
        extend: 'hidden',
      },
    }"
  >
    <template #header>
      <div class="flex items-center gap-6">
        <NuxtLink to="/me" class="text-xl text-neutral-400 hover:text-white">
          <Icon name="mdi:arrow-left"></Icon>
        </NuxtLink>
        <p>Upload</p>
      </div>
      <AccountButton></AccountButton>
    </template>
    <template #content>
      <SenpTextInput v-model="folderName" label="Folder" hint="leave blank to upload to root folder"></SenpTextInput>
      <FilePicker multiple v-model="fileList" @update:files="uploadMany"></FilePicker>
    </template>
  </SenpLayoutBasic>
  <div class="fixed top-6 right-6 z-50" v-auto-animate>
    <div class="w-40 p-4 rounded-lg bg-green-900/50 backdrop-blur" v-if="success">Success!</div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
definePageMeta({
  middleware: ['auth'],
})
const { $client } = useNuxtApp()
const fileList = ref(null)
const folderName = ref('')
const success = ref(false)
const loading = ref(false)

const uploadMany = async (files: { blob: Blob | string; filename: string | null; mimetype: string }[]) => {
  try {
    loading.value = true
    const urls = await $client.putObjectUrl.mutate(
      files.map((file) => [folderName.value, [nanoid(), file?.filename].join('-')].filter((a) => !!a).join('/'))
    )
    await Promise.all(
      urls.map(async (url, i) => {
        const file = files[i]
        const form = file.blob
        const headers: Record<string, string> = {
          'x-amz-acl': 'public-read',
        }
        if (file.mimetype) {
          headers['Content-Type'] = file.mimetype
        }
        const res = await fetch(url, {
          method: 'PUT',
          body: form,
          headers,
        })
      })
    )
    loading.value = false
    success.value = true
    fileList.value = null
    console.log({ success })
    setTimeout(() => {
      success.value = false
    }, 2000)
  } catch (error) {
    loading.value = false
    success.value = false
  }
}
</script>
