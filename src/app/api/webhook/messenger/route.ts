import { NextResponse } from 'next/server';
import { processAgentMessage } from '@/lib/ai/agent';

// Facebook Webhook Verification (Meta Developer Dashboard)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'antor_cs_agent_verify_token';

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('FB Webhook Verified Successfully');
      return new Response(challenge, { status: 200 });
    } else {
      return new Response('Forbidden: Verification token mismatch', { status: 403 });
    }
  }

  return new Response('Bad Request', { status: 400 });
}

// Facebook Messenger Message Receiver & Auto-Responder
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.object === 'page') {
      // Process each entry in batch
      for (const entry of body.entry || []) {
        const webhookEvent = entry.messaging?.[0];
        if (webhookEvent && webhookEvent.message && webhookEvent.message.text) {
          const senderId = webhookEvent.sender.id;
          const userMessage = webhookEvent.message.text;

          // Process through Agentic AI Engine
          const sessionId = `fb_${senderId}`;
          const agentResponse = await processAgentMessage(sessionId, userMessage, 'MESSENGER', senderId);

          // Reply back to Facebook Messenger via Graph API
          await sendMessengerMessage(senderId, agentResponse.reply);
        }
      }

      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Not a page event' }, { status: 404 });
    }
  } catch (error) {
    console.error('FB Messenger Webhook POST Error:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

// Helper to send reply message back to Facebook User via Graph API
async function sendMessengerMessage(senderPsid: string, textResponse: string) {
  const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

  if (!PAGE_ACCESS_TOKEN) {
    console.warn('FB_PAGE_ACCESS_TOKEN is missing in environment variables. Unable to send FB Messenger reply.');
    return;
  }

  try {
    const requestBody = {
      recipient: { id: senderPsid },
      message: { text: textResponse },
    };

    const res = await fetch(
      `https://graph.facebook.com/v19.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    const data = await res.json();
    if (data.error) {
      console.error('Error sending Messenger message via Graph API:', data.error);
    } else {
      console.log(`Successfully sent Messenger reply to PSID ${senderPsid}`);
    }
  } catch (err) {
    console.error('Failed to post to Facebook Graph API:', err);
  }
}
