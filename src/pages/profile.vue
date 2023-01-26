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
      content: {
        extend: 'h-full',
      },
    }"
  >
    <template #header>
      <h1>LinkedInB.io</h1>
      <AccountButton></AccountButton>
    </template>

    <template #content>
      <section class="flex flex-col gap-8 p-4 overflow-auto editor" v-auto-animate>
        <div class="flex flex-col gap-4">
          <SenpTextInput label="Display Name" v-model="profileData.name"></SenpTextInput>
          <SenpTextInput label="Bio" v-model="profileData.bio"></SenpTextInput>
          <SenpButton
            @click="
              () => {
                modals.username = true
              }
            "
            >Change Username
          </SenpButton>
          <SenpButton
            v-if="!profileData.avatar"
            @click="
              () => {
                modals.image = true
              }
            "
            >Add Image
          </SenpButton>
          <SenpButton
            v-else
            @click="
              () => {
                profileData.avatar = ''
              }
            "
            >Remove Image
          </SenpButton>
          <div class="py-8">
            <hr class="border-neutral-800" />
          </div>
          <div
            class="flex flex-col items-center gap-4 max-w-2xl w-full mx-auto p-4 border-4 rounded-xl border-black bg-neutral-900"
          >
            <figure class="h-24 w-24 rounded-full bg-neutral-800">
              <img class="h-full w-full rounded-full" :src="profileData.avatar" alt="" v-if="profileData.avatar" />
              <div
                class="h-full w-full rounded-full uppercase flex items-center justify-center text-3xl font-semibold"
                v-else-if="profileData.username?.charAt?.(0)"
              >
                {{ profileData.username.charAt(0) }}
              </div>
              <div class="h-full w-full rounded-full flex items-center justify-center" v-else>
                <Icon name="mdi:account" />
              </div>
            </figure>
            <p class="text-xl font-bold" v-if="profileData.name ?? profileData.username">
              {{ profileData.name ?? profileData.username }}
            </p>
            <p class="text-lg" v-if="profileData.bio">
              {{ profileData.bio }}
            </p>
          </div>
        </div>
      </section>
      <SenpDrawer
        v-model:open="modals.image"
        title="Add Image"
        side="left"
        :classes="{
          maxSize: { base: 'w-full max-h-full max-w-[90vw] md:max-w-3xl h-full' },
        }"
      >
        <ImagePicker
          :size="192"
          @update:image="
            (src) => {
              profileData.avatar = src ?? null
              modals.image = false
            }
          "
        ></ImagePicker>
      </SenpDrawer>
      <SenpDrawer
        v-model:open="modals.username"
        title="Change Username"
        side="left"
        :classes="{
          maxSize: { base: 'w-full max-h-full max-w-[90vw] md:max-w-3xl h-full' },
        }"
      >
        <SenpTextInput
          v-model="profileData.username"
          :error="username === 'username exists' ? 'Username is taken' : ''"
        ></SenpTextInput>
        <p class="text-green-500" v-if="username !== null && username !== 'username exists' && username?.id">
          changed to {{ username?.username }}
        </p>
      </SenpDrawer>
    </template>
  </SenpLayoutBasic>
</template>

<script setup lang="ts">
import pkg from 'lodash'

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~/server/trpc/routers'
const { debounce } = pkg

type RouterInput = inferRouterInputs<AppRouter>
type RouterOutput = inferRouterOutputs<AppRouter>
type PostCreateInput = RouterOutput['changeUsername']

definePageMeta({
  middleware: ['auth'],
})
const { signIn, signOut, data } = useSession()

const modals = reactive({
  username: false,
  image: false,
})
const { $client } = useNuxtApp()
const myAccount = await $client.getMyAccount.useQuery()
const profileData = ref({
  avatar: '' as string | null,
  image: '' as string | null,
  name: '' as string,
  username: '' as string,
  bio: '' as string,
})
const updateProfile = () =>
  $client.updateMyAccount.mutate({
    ...profileData.value,
  })
const updateProfileDebounced = debounce(updateProfile, 4000)

const username = ref<null | PostCreateInput | 'username exists'>(null)
const updateUsername = () =>
  $client.changeUsername
    .mutate(profileData.value.username)
    .then((v) => {
      username.value = v
      setTimeout(() => {
        username.value = null
      }, 2000)
    })
    .catch((err) => (username.value = 'username exists'))
const updateUsernameDebounced = debounce(updateUsername, 1000)

watch(
  profileData,
  () => {
    updateProfileDebounced()
  },
  {
    deep: true,
  }
)

watch(
  () => profileData.value.username,
  () => {
    updateUsernameDebounced()
  }
)

watch(
  () => myAccount.data.value,
  () => {
    if (myAccount.data.value) {
      profileData.value = myAccount.data.value as any
    }
  }
)

onMounted(() => {
  if (myAccount.data.value) {
    profileData.value = myAccount.data.value as any
  }
})
</script>
