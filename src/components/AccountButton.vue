<template>
  <div class="text-sm shrink-0 flex items-center">
    <div class="w-8 h-8 bg-neutral-600 rounded-full animate-pulse" v-if="status === 'loading'"></div>
    <button
      v-else-if="status === 'unauthenticated'"
      @click="login"
      class="text-neutral-200 hover:text-blue-400 transition block"
    >
      Sign In
    </button>
    <SenpMenu
      v-else
      :options="([
              { label: 'Dashboard', emits: 'dashboard' },
              { label: 'Sign Out', emits: 'signOut' },
            ].filter(a => !!a) as any)"
      @select="
      (emitKey) => ({
        signOut: ()=> {
          signOut()
        },
        dashboard: ()=> {
          $router.push('/me')
        },
      }[emitKey as 'signOut']())
      "
    >
      <template #trigger>
        <img
          class="h-10 w-10 rounded-full cursor-pointer ring-2 ring-neutral-700 shadow-inner"
          v-if="myAccount.data.value?.avatar"
          :src="myAccount.data.value?.avatar"
        />
        <div
          v-else
          class="border-2 border-transparent ring-2 ring-neutral-700 bg-neutral-700 rounded-full flex items-center"
        >
          <div
            class="h-8 w-8 rounded-full uppercase flex items-center justify-center text-lg font-semibold"
            v-if="data?.user?.name?.charAt?.(0)"
          >
            {{ data.user.name.charAt(0) }}
          </div>
          <div class="h-8 w-8 rounded-full" v-else>
            <Icon name="mdi:account" />
          </div>
        </div>
      </template>
    </SenpMenu>
  </div>
</template>

<script setup lang="ts">
const { status, signIn, signOut, data } = useSession()
const login = async () => {
  return await signIn('auth0') // Sign in the user
}

const { $client } = useNuxtApp()
const myAccount = await $client.getMyAccount.useQuery()
</script>
