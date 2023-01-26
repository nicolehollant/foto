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
        content: description ?? 'A hub for your sites :)',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@gaybugfeet' },
      { name: 'twitter:title', content: title ?? 'LinkedInB.io' },
      {
        name: 'twitter:description',
        content: description ?? 'A hub for your sites :)',
      },
      { name: 'twitter:image', content: image ?? 'https://linkedinb.io/og.png' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: title ?? 'LinkedInB.io' },
      { property: 'og:url', content: 'https://linkedinb.io/' },
      { property: 'og:image', content: image ?? 'https://linkedinb.io/og.png' },
      { property: 'og:image:secure_url', content: image ?? 'https://linkedinb.io/og.png' },
      { property: 'og:image:type', content: 'image/png' },
      {
        property: 'og:description',
        content: description ?? 'A hub for your sites :)',
      },
    ],
  })
}
