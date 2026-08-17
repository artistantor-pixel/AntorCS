import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { AGENCY_KNOWLEDGE } from '@/lib/ai/knowledge';


let memoryKnowledgeStore: any = null;

export async function GET() {
  let customKnowledge = memoryKnowledgeStore;

  if (process.env.DATABASE_URL) {
    try {
      const record = await prisma.content.findUnique({
        where: { id: 'ai_knowledge' },
      });
      if (record && record.data) {
        customKnowledge = record.data;
      }
    } catch (e) {
      console.warn('Could not read AI knowledge from DB, using fallback/memory store:', e);
    }
  }

  return NextResponse.json({
    success: true,
    data: customKnowledge || AGENCY_KNOWLEDGE,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    memoryKnowledgeStore = body;

    if (process.env.DATABASE_URL) {
      try {
        await prisma.content.upsert({
          where: { id: 'ai_knowledge' },
          update: { data: body },
          create: { id: 'ai_knowledge', data: body },
        });
      } catch (err) {
        console.warn('Could not save AI knowledge to DB, updated in-memory store:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'AI Knowledge base & training settings saved successfully!',
      data: body,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Error saving knowledge';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
