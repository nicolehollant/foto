import { inferAsyncReturnType } from '@trpc/server'
import type { H3Event } from 'h3'
import { getServerSession } from '#auth'

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(_event: H3Event) {
  const session = await getServerSession(_event)
  return { prisma: _event.context.prisma, session }
}

export type Context = inferAsyncReturnType<typeof createContext>

export type PrismaAccountSelectFields = Required<
  Required<Parameters<Context['prisma']['account']['findFirst']>>['0']
>['select']

export type PrismaSessionSelectFields = Required<
  Required<Parameters<Context['prisma']['session']['findFirst']>>['0']
>['select']

export type PrismaImageSelectFields = Required<
  Required<Parameters<Context['prisma']['image']['findFirst']>>['0']
>['select']

export type PrismaUserSelectFields = Required<
  Required<Parameters<Context['prisma']['user']['findFirst']>>['0']
>['select']
