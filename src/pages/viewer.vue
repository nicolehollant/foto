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
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="text-xl text-neutral-400 hover:text-white">
          <Icon name="mdi:home"></Icon>
        </NuxtLink>
        <h1>Viewer</h1>
      </div>
      <AccountButton></AccountButton>
    </template>
    <template #content>
      <NuxtPage></NuxtPage>
    </template>
  </SenpLayoutBasic>
</template>
