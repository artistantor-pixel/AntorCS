import { NextResponse } from 'next/server';
import { processAgentMessage } from '@/lib/ai/agent';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, sessionId, platform } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message content is required.' },
        { status: 400 }
      );
    }

    const activeSessionId = sessionId || `web_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const agentResult = await processAgentMessage(
      activeSessionId,
      message,
      platform || 'WEBSITE'
    );

    return NextResponse.json({
      success: true,
      sessionId: activeSessionId,
      reply: agentResult.reply,
      quote: agentResult.quote,
      leadCaptured: agentResult.leadCaptured,
    });
  } catch (error: unknown) {
    console.error('AI Chat Route Error:', error);
    const errMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Failed to process message', details: errMessage },
      { status: 500 }
    );
  }
}
