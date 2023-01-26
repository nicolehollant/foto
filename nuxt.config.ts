// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['senp-ui'],
  modules: ['@nuxtjs/tailwindcss', 'nuxt-headlessui', '@nuxt/content', 'nuxt-icon', '@sidebase/nuxt-auth'],
  build: {
    transpile: ['trpc-nuxt'],
  },
  srcDir: './src',
  components: {
    global: true,
    dirs: ['~/components'],
  },
  hooks: {
    'vite:extendConfig': (config, { isClient, isServer }) => {
      if (isClient && config?.resolve?.alias) {
        ;(config.resolve.alias as any).vuedraggable = 'vuedraggable/dist/vuedraggable.common.js'
      }
    },
  },
  runtimeConfig: {
    S3_CLIENT_KEY: process.env.S3_CLIENT_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    NUXT_AUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  // auth: { origin: process.env.NODE_ENV === 'production' ? 'https://linkedinb.io' : 'http://localhost:3000' },
  // auth: {
  /* The origin is set to the development origin. Change this when deploying to production by setting `origin` in this config before build-time or by exporting `AUTH_ORIGIN` by running `export AUTH_ORIGIN=...` */
  // origin: 'http://localhost:3000',
  /* Whether to periodically refresh the session. Change this to `true` for a refresh every seconds or set this to a number like `5000` for a refresh every 5000 milliseconds (aka: 5 seconds) */
  // enableSessionRefreshPeriodically: false,
  /* Whether to add a global authentication middleware that will protect all pages without exclusion */
  // enableGlobalAppMiddleware: false,
  /* Configuration of the global auth-middleware (only applies if you set `enableGlobalAppMiddleware: true` above!) */
  // globalMiddlewareOptions: {
  //     // Whether to allow access to 404 pages without authentication. Set this to `false` to force users to sign-in before seeing `404` pages. Setting this to false may lead to vue-router problems (as the target page does not exist)
  //     allow404WithoutAuth: true
  // }
  // },
})
