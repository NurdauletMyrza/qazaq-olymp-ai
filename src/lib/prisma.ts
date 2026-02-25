import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'], // (Қаласаңыз бұл жолды өшіріп тастауға болады, ол тек консольге лог шығарады)
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;