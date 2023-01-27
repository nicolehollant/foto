import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'
import {
  s3Client,
  getS3Params,
  putObject,
  paramsValidator,
  getPresignedPutUrl,
  getPresignedGetUrl,
  deleteObject,
} from '../s3client'
import { Context, PrismaUserSelectFields } from '../context'

const joinPaths = (...paths: any[]) => {
  return ['imaj', ...paths].filter((a) => !!a).join('/')
}

const getUserFromContextOrThrow = async (ctx: Context, fields?: PrismaUserSelectFields) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'unauthorized' })
  }
  const existingUser = await ctx.prisma.user.findFirst({
    where: {
      email: ctx.session.user.email,
    },
    select: fields ?? {
      id: true,
    },
  })
  if (!existingUser) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found 🤨',
    })
  }
  return existingUser
}

const getUserFromContext = async (ctx: Context, fields?: PrismaUserSelectFields) => {
  try {
    const user = await getUserFromContextOrThrow(ctx, fields)
    return user
  } catch (error) {
    return null
  }
}

export const appRouter = router({
  getMyObjects: protectedProcedure.query(async ({ ctx }) => {
    const user = await getUserFromContextOrThrow(ctx)
    const myObjects = await ctx.prisma.image.findMany({
      where: { userId: user.id },
      select: {
        s3Key: true,
        id: true,
      },
    })
    return myObjects
  }),
  getPublicObjects: publicProcedure.query(async ({ ctx }) => {
    const publicObjects = await ctx.prisma.image.findMany({
      where: { userId: null },
      select: {
        s3Key: true,
        id: true,
      },
    })
    return publicObjects
  }),
  deleteImage: protectedProcedure.input(z.string().array()).mutation(async ({ ctx, input }) => {
    const user = await getUserFromContextOrThrow(ctx, { id: true })
    const myMatchingObjects = await ctx.prisma.image.findMany({
      where: {
        AND: [
          { userId: user.id },
          {
            OR: input.map((s3Key) => ({
              s3Key,
            })),
          },
        ],
      },
      select: {
        s3Key: true,
        id: true,
      },
    })
    await ctx.prisma.image.deleteMany({
      where: {
        OR: myMatchingObjects.map((obj) => ({ id: obj.id })),
      },
    })
    await Promise.all(myMatchingObjects.map((obj) => deleteObject(obj.s3Key)))
    return myMatchingObjects
  }),
  putObjectUrl: publicProcedure.input(z.string().array()).mutation(async ({ input, ctx }) => {
    const user = await getUserFromContext(ctx, { id: true })
    const res = await Promise.all(input.map((slug) => getPresignedPutUrl(joinPaths(user?.id, slug))))
    await Promise.all(
      input.map((slug) => {
        return ctx.prisma.image.create({
          data: {
            userId: user?.id ?? undefined,
            fileName: slug,
            s3Key: joinPaths(user?.id, slug),
          },
        })
      })
    )
    return res
  }),
  getObjectUrl: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const res = await getPresignedGetUrl('imaj/' + input)
    return res
  }),
  putObject: publicProcedure.input(paramsValidator).mutation(async ({ ctx, input }) => {
    const params = getS3Params(input)
    const res = await putObject(params)
    return res
  }),
  whoami: protectedProcedure.query(({ ctx }) => {
    return ctx.session
  }),
  // get account
  getMyAccount: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user?.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'unauthorized' })
    }
    const user = await ctx.prisma.user.findFirst({
      where: {
        email: ctx.session.user.email,
      },
      select: {
        id: true,
        avatar: true,
        username: true,
        image: true,
        name: true,
      },
    })
    return user
  }),
  // update account
  changeUsername: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    if (!ctx.session.user?.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'unauthorized' })
    }
    const existingUser = await ctx.prisma.user.findFirst({
      where: {
        email: ctx.session.user.email,
      },
      select: {
        id: true,
      },
    })
    if (!existingUser) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found 🤨',
      })
    }
    const usernameExists = await ctx.prisma.user.findFirst({
      where: {
        username: input,
      },
      select: {
        id: true,
      },
    })
    if (usernameExists?.id === existingUser.id) {
      return null
    }
    if (usernameExists) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Username exists',
      })
    }
    const user = await ctx.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        username: input,
      },
    })
    return user
  }),
  updateMyAccount: protectedProcedure
    .input(
      z.object({
        avatar: z.string().nullish(),
        bio: z.string().nullish(),
        image: z.string().nullish(),
        name: z.string().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user?.email) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'unauthorized' })
      }
      const existingUser = await ctx.prisma.user.findFirst({
        where: {
          email: ctx.session.user.email,
        },
        select: {
          id: true,
        },
      })
      if (!existingUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found 🤨',
        })
      }
      const user = await ctx.prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          ...input,
        },
      })
      return user
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter
