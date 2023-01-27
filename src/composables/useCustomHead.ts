import { ComputedRef } from 'vue'

export const useCustomHead = (
  title?: string | ComputedRef<string>,
  description?: string | ComputedRef<string>,
  image?: string | ComputedRef<string>
) => {
  useHead({
    title,
    meta: [
      {
        name: 'description',
        content: description ?? 'A hub for your photos :)',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@gaybugfeet' },
      { name: 'twitter:title', content: title ?? 'imaj.app' },
      {
        name: 'twitter:description',
        content: description ?? 'A hub for your photos :)',
      },
      { name: 'twitter:image', content: image ?? 'https://imaj.app/og.png' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title ?? 'imaj.app' },
      { property: 'og:url', content: 'https://imaj.app/' },
      { property: 'og:image', content: image ?? 'https://imaj.app/og.png' },
      { property: 'og:image:secure_url', content: image ?? 'https://imaj.app/og.png' },
      { property: 'og:image:type', content: 'image/png' },
      {
        property: 'og:description',
        content: description ?? 'A hub for your photos :)',
      },
    ],
  })
}
