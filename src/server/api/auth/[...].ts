import Auth0Provider from 'next-auth/providers/auth0'
import GithubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../db/client'

export default NuxtAuthHandler({
  debug: true,
  secret: useRuntimeConfig().NUXT_AUTH_SECRET,
  // TODO: ADD YOUR OWN AUTHENTICATION PROVIDER HERE, READ THE DOCS FOR MORE: https://sidebase.io/nuxt-auth
  adapter: PrismaAdapter(prisma!),
  pages: {
    // Change the default behavior to use `/login` as the path for the sign-in page
    signIn: '/auth/login',
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    Auth0Provider.default({
      clientId: useRuntimeConfig().AUTH0_CLIENT_ID,
      clientSecret: useRuntimeConfig().AUTH0_CLIENT_SECRET,
      issuer: useRuntimeConfig().AUTH0_DOMAIN,
    }),
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    GithubProvider.default({
      clientId: useRuntimeConfig().GITHUB_CLIENT_ID,
      clientSecret: useRuntimeConfig().GITHUB_CLIENT_SECRET,
    }),
  ],
})
