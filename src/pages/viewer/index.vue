<template>
  <div class="grid auto-rows-max gap-4 grid-cols-4">
    <NuxtLink v-for="img in publicImages.data.value" :to="`/viewer/${img.s3Key}`">
      <SenpCard class="h-full">
        <p class="break-all">
          {{ img.s3Key }}
        </p>
        <img :src="`https://object.nyc3.cdn.digitaloceanspaces.com/${img.s3Key}`" alt="" />
      </SenpCard>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { $client } = useNuxtApp()
const publicImages = $client.getPublicObjects.useQuery()
</script>
