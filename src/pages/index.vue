<template>
  <SenpLayoutBasic
    fixed-header
    :classes="{
      header: {
        extend: 'text-2xl bg-neutral-900/60 backdrop-blur',
      },
      footer: {
        extend: 'hidden',
      },
    }"
  >
    <template #header>
      <div class="flex items-center gap-6">
        <Icon name="mdi:camera" class="text-xl text-neutral-400 hover:text-white"></Icon>
        <h1>Imaj</h1>
      </div>
      <AccountButton></AccountButton>
    </template>

    <template #content>
      <FilePicker class="w-full h-full" v-model="fileList" @update:model-value="uploadMany" v-if="!image">
        <template #upload><span></span></template>
      </FilePicker>
      <div v-else class="relative w-full h-full">
        <div class="grid grid-rows-[minmax(0,1fr),auto] gap-4">
          <img class="mx-auto max-w-full max-h-[calc(90vh-8rem)]" :src="image" alt="" />
          <div class="flex items-center justify-between gap-4 p-4 rounded-lg bg-neutral-700 font-medium">
            <p class="flex-1 truncate">{{ image }}</p>
            <button class="shrink-0" @click="() => copy.copy(image)">
              <Icon :name="copy.copied.value ? 'mdi:clipboard-check' : 'mdi:clipboard'"></Icon>
            </button>
          </div>
        </div>
        <div class="absolute top-6 right-6 z-50">
          <button
            @click="() => (image = '')"
            class="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-orange-900"
          >
            <Icon name="mdi:close"></Icon>
          </button>
        </div>
      </div>
    </template>
  </SenpLayoutBasic>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { nanoid } from 'nanoid'
const { $client } = useNuxtApp()
const { status, signIn, signOut } = useSession()
const login = async () => {
  return await signIn('auth0') // Sign in the user
}

const fileList = ref(null)
const folderName = ref('')
const success = ref(false)
const loading = ref(false)
const image = ref('')
const copy = useClipboard()

const myAccount = $client.getMyAccount.useQuery()

const uploadMany = async (files: { blob: Blob | string; filename: string | null; mimetype: string }[]) => {
  try {
    loading.value = true
    const s3Keys = files.map((file) =>
      [folderName.value, [nanoid(), file?.filename].join('-')].filter((a) => !!a).join('/')
    )
    const urls = await $client.putObjectUrl.mutate(s3Keys)
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
    if (myAccount.data.value?.id) {
      image.value = `https://object.nyc3.cdn.digitaloceanspaces.com/imaj/${myAccount.data.value.id}/${s3Keys[0]}`
    } else {
      image.value = `https://object.nyc3.cdn.digitaloceanspaces.com/imaj/${s3Keys[0]}`
    }
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
