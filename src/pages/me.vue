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
        <NuxtLink to="/" class="text-xl text-neutral-400 hover:text-white">
          <Icon name="mdi:home"></Icon>
        </NuxtLink>
        <h1>Dashboard</h1>
      </div>
      <AccountButton></AccountButton>
    </template>
    <template #content>
      <section v-for="folder in groupedByPrefix">
        <HeadlessDisclosure as="div" class="bg-neutral-900 rounded-lg" v-slot="{ open }">
          <HeadlessDisclosureButton class="w-full text-left p-4 rounded-lg bg-neutral-800 flex items-center gap-2">
            <Icon :name="open ? 'mdi:folder-open' : 'mdi:folder'"></Icon>
            <div class="">
              <span class="text-xs text-neutral-400 mr-1">{{
                folder.prefix.split('/').slice(0, 2).join('/') + '/'
              }}</span>
              <span>{{ folder.prefix.split('/').slice(2).join('/') }}</span>
            </div>
          </HeadlessDisclosureButton>
          <HeadlessDisclosurePanel class="grid auto-rows-max gap-4 grid-cols-4 p-4">
            <NuxtLink v-for="img in folder.values" :to="`/viewer/${[folder.prefix, img].filter((a) => !!a).join('/')}`">
              <SenpCard class="h-full">
                <p class="break-all line-clamp-1">
                  {{ img }}
                </p>
                <div class="w-full h-40 bg-black/20 rounded-lg">
                  <img
                    class="w-full h-full object-contain"
                    :src="`https://object.nyc3.cdn.digitaloceanspaces.com/${[folder.prefix, img]
                      .filter((a) => !!a)
                      .join('/')}`"
                    alt=""
                  />
                </div>
                <button @click.stop.prevent="() => deleteObjByKey([folder.prefix, img].filter((a) => !!a).join('/'))">
                  <Icon name="mdi:trash-can"></Icon>
                </button>
              </SenpCard>
            </NuxtLink>
          </HeadlessDisclosurePanel>
        </HeadlessDisclosure>
      </section>
      <NuxtLink
        to="/upload"
        class="fixed bottom-8 right-8 w-20 h-20 text-4xl rounded-full bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center"
      >
        <Icon name="mdi:plus"></Icon>
      </NuxtLink>
    </template>
  </SenpLayoutBasic>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const useGroupByPrefix = (values: string[], delimiter = '/') => {
  const result: { prefix: string; values: string[] }[] = []
  values.forEach((value) => {
    const prefix = value.split(delimiter)
    const item = prefix.pop()
    if (!item) {
      return
    }
    const existingGroupIndex = result.findIndex((entry) => entry.prefix === prefix.join(delimiter))
    if (existingGroupIndex >= 0) {
      result[existingGroupIndex].values.push(item)
      return
    }
    result.push({
      prefix: prefix.join(delimiter),
      values: [item],
    })
  })
  result.sort((a, b) => a.prefix.localeCompare(b.prefix))
  return result
}

const { $client } = useNuxtApp()
const myImages = $client.getMyObjects.useQuery()

const deleteObjByKey = async (key: string) => {
  await $client.deleteImage.mutate([key])
  myImages.refresh()
}

const groupedByPrefix = computed(() => {
  if (myImages.data.value) {
    return useGroupByPrefix(myImages.data.value.map((image) => image.s3Key))
  }
})
</script>
