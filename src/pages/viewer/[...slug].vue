<template>
  <img
    class="mx-auto max-w-full max-h-[calc(100vh-6rem)]"
    :src="`https://object.nyc3.cdn.digitaloceanspaces.com/${
      Array.isArray($route.params.slug) ? $route.params.slug.join('/') : $route.params.slug
    }`"
    alt=""
  />
</template>

<script setup lang="ts">
const url = process.dev ? 'http://localhost:3000' : 'https://imaj.app'
const route = useRoute()
useCustomHead(
  computed(() => 'Imaj'),
  computed(() => 'Image viewer'),
  computed(() => `${url}/og/${Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug}`)
)
</script>
