<template>
  <div class="p-8 sm:p-[16vmin]">
    <div class="m-auto grid max-w-sm gap-4 rounded-xl bg-slate-900 py-6 px-8">
      <h2 class="pb-2 text-2xl">LinkedInB.io Sign In</h2>
      <button @click="() => signIn('auth0')" class="rounded bg-blue-600 p-2">Auth0</button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ auth: false })
const { signIn, status } = useSession()
const router = useRouter()
watch(
  () => status.value,
  () => {
    if (status.value === 'authenticated') {
      router.replace('/')
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (status.value == 'unauthenticated') {
    signIn('auth0')
  }
})
</script>
