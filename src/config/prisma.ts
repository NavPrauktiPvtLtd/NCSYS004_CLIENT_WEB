import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default prisma;

prisma.$use(async (params: Prisma.MiddlewareParams, next) => {
  if (params.action === 'create' && params.model === 'Admin') {
    const user = params.args.data;
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  }
  if (params.action === 'create' && params.model === 'KioskClient') {
    const user = params.args.data;
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
  }
  return next(params);
});
