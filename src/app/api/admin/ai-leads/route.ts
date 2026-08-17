import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";


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
