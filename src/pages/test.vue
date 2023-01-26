<template>
  <SenpLayoutBasic
    fixed-header
    :classes="{
      header: {
        extend: 'text-2xl bg-neutral-900/60 backdrop-blur',
      },
      content: {
        extend: '!grid max-w-screen overflow-auto w-full',
      },
      footer: {
        extend: 'hidden',
      },
    }"
  >
    <template #header>
      <p>Test</p>
      <NuxtLink to="/me">me</NuxtLink>
    </template>
    <template #content>
      <ImagePicker class="w-full overflow-auto h-max" full-size saveAs="blob" @update:blob="upload"></ImagePicker>
      <FilePicker @update:files="uploadMany"></FilePicker>
    </template>
  </SenpLayoutBasic>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
const { $client } = useNuxtApp()

const uploadMany = async (files: { blob: Blob | string; filename: string | null; mimetype: string }[]) => {
  const urls = await $client.putObjectUrl.mutate(files.map((file) => [nanoid(), file?.filename].join('-')))
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
      const json = await res.blob()
      return json
    })
  )
}

const upload = async (blob: { blob: Blob | string; filename: string | null; mimetype: string }) => {
  const [url] = await $client.putObjectUrl.mutate([[nanoid(), blob.filename].join('-')])
  const form = blob.blob
  const headers: Record<string, string> = {
    'x-amz-acl': 'public-read',
  }
  if (blob.mimetype) {
    headers['Content-Type'] = blob.mimetype
  }
  await fetch(url, {
    method: 'PUT',
    body: form,
    headers,
  })
}
</script>
