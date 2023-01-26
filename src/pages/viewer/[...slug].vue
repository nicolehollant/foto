<template>
  <img
    class="mx-auto max-w-full max-h-[calc(100vh-6rem)]"
    :src="`https://object.nyc3.cdn.digitaloceanspaces.com/${
      Array.isArray($route.params.slug) ? $route.params.slug.join('/') : $route.params.slug
    }`"
    alt=""
  />
</template>
