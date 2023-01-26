import pkg, { PrismaClient } from '@prisma/client'

var prisma: PrismaClient | undefined
declare global {
  var prisma: PrismaClient | undefined
}
if (process.env.NODE_ENV === 'production') {
  const { PrismaClient } = pkg
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
