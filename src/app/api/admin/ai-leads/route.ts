import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
  let leads: any[] = [];
  let conversationsCount = 0;
  let leadsCount = 0;

  try {
    leads = await prisma.aiLead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    conversationsCount = await prisma.aiConversation.count();
    leadsCount = await prisma.aiLead.count();
  } catch (error: unknown) {
    console.warn('Prisma DB unavailable for AI leads list:', error);
  }

  return NextResponse.json({
    success: true,
    stats: {
      totalLeads: leadsCount,
      totalConversations: conversationsCount,
    },
    leads,
  });
}
