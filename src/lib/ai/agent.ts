import { calculatePriceQuote, QuoteRequestInput, QuoteResult } from './pricing-engine';
import { AGENCY_KNOWLEDGE } from './knowledge';
import prisma from "@/lib/prisma";


export interface AgentResponse {
  reply: string;
  quote?: QuoteResult;
  leadCaptured?: boolean;
  sessionId: string;
}

export async function processAgentMessage(
  sessionId: string,
  userMessage: string,
  platform: 'WEBSITE' | 'MESSENGER' = 'WEBSITE',
  senderId?: string
): Promise<AgentResponse> {
  const cleanMessage = userMessage.trim();
  const lowerMsg = cleanMessage.toLowerCase();

  let conversationContext = '';
  let conversationId: string | null = null;

  // 1. Get or create conversation in DB (if DATABASE_URL is available)
  if (process.env.DATABASE_URL) {
    try {
      let conversation = await prisma.aiConversation.findUnique({
        where: { sessionId },
      });

      if (!conversation) {
        conversation = await prisma.aiConversation.create({
          data: {
            sessionId,
            platform,
            senderId,
          },
        });
      }
      conversationId = conversation.id;

      // Save user message
      await prisma.aiMessage.create({
        data: {
          conversationId: conversation.id,
          sender: 'USER',
          content: cleanMessage,
        },
      });

      // Fetch history context (last 6 messages)
      const history = await prisma.aiMessage.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'desc' },
        take: 6,
      });
      conversationContext = history
        .reverse()
        .map((m) => `${m.sender}: ${m.content}`)
        .join('\n');
    } catch (dbErr) {
      console.warn('Prisma DB skipped or unavailable:', dbErr);
    }
  }

  // 3. LLM API call or Smart Fallback Engine
  let aiReply = '';
  let calculatedQuote: QuoteResult | undefined;
  let leadCaptured = false;
  // 3. Fetch custom knowledge and API keys from DB if available
  let customKnowledge: any = null;
  if (process.env.DATABASE_URL) {
    try {
      const kRecord = await prisma.content.findUnique({
        where: { id: 'ai_knowledge' },
      });
      if (kRecord && kRecord.data) {
        customKnowledge = kRecord.data;
      }
    } catch (e) {
      console.warn('Could not read custom knowledge from DB:', e);
    }
  }

  // Check for LLM API Key (OpenAI / Gemini) from DB or Environment Variables
  const openaiKey = customKnowledge?.openaiApiKey || process.env.OPENAI_API_KEY;
  const geminiKey = customKnowledge?.geminiApiKey || process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const llmResult = await callGemini(geminiKey, cleanMessage, conversationContext, customKnowledge);
      aiReply = llmResult.reply;
      calculatedQuote = llmResult.quote;
    } catch (e) {
      console.warn('Gemini API call error, using agent fallback engine:', e);
    }
  } else if (openaiKey) {
    try {
      const llmResult = await callOpenAI(openaiKey, cleanMessage, conversationContext, customKnowledge);
      aiReply = llmResult.reply;
      calculatedQuote = llmResult.quote;
    } catch (e) {
      console.warn('OpenAI API call error, using agent fallback engine:', e);
    }
  }

  // Smart Fallback Engine if no external LLM key is configured or API failed
  if (!aiReply) {
    const fallback = processFallbackAgent(cleanMessage, lowerMsg);
    aiReply = fallback.reply;
    calculatedQuote = fallback.quote;
  }

  // 4. Lead Capture Check (Detect Phone or Email in user message)
  const phoneMatch = cleanMessage.match(/(?:\+88)?01[3-9]\d{8}/);
  const emailMatch = cleanMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);

  if (phoneMatch || emailMatch) {
    const clientPhone = phoneMatch ? phoneMatch[0] : undefined;
    const clientEmail = emailMatch ? emailMatch[0] : undefined;

    leadCaptured = true;
    if (!aiReply.includes('contact') && !aiReply.includes('ধন্যবাদ')) {
      aiReply += '\n\n✅ আপনার যোগাযোগের তথ্য পাওয়া গেছে! Antor Creative Studio থেকে শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।';
    }

    if (process.env.DATABASE_URL) {
      try {
        await prisma.aiLead.create({
          data: {
            clientName: 'Chat Client',
            clientPhone,
            clientEmail,
            platform,
            serviceType: calculatedQuote ? calculatedQuote.serviceName : 'General Inquiry',
            estimatedPrice: calculatedQuote ? calculatedQuote.estimatedPrice : null,
            notes: `Conversation Session: ${sessionId}\nMessage: ${cleanMessage}`,
          },
        });
      } catch (err) {
        console.warn('Error saving lead to DB:', err);
      }
    }
  }

  // Save AI message to DB if database is available
  if (process.env.DATABASE_URL && conversationId) {
    try {
      await prisma.aiMessage.create({
        data: {
          conversationId,
          sender: 'AI',
          content: aiReply,
          metadata: calculatedQuote ? JSON.parse(JSON.stringify(calculatedQuote)) : undefined,
        },
      });
    } catch (err) {
      console.warn('Error saving AI message to DB:', err);
    }
  }

  return {
    reply: aiReply,
    quote: calculatedQuote,
    leadCaptured,
    sessionId,
  };
}

// Smart Local Agent Rule & Calculation Engine
function processFallbackAgent(cleanMsg: string, lowerMsg: string): { reply: string; quote?: QuoteResult } {
  const isBangla = /[\u0980-\u09FF]/.test(cleanMsg);
  const isBanglish = /koto|kamon|lagbe|cai|chai|dorkar|dam|dam koto|ki ki|apnara|taka|amar|korben|lagbe/.test(lowerMsg);

  // Intent parsing
  const isGreeting = /hi|hello|hey|assalamu|slm|kamon|hoe|greeting/i.test(lowerMsg) || lowerMsg.startsWith('নমস্কার') || lowerMsg.startsWith('সালাম');
  const isPriceQuery = /price|cost|rate|pricing|dam|taka|koto|খরচ|দাম|টাকা|কত/i.test(lowerMsg);
  const isLandingPage = /landing|one page|single page|ল্যান্ডিং/i.test(lowerMsg);
  const isEcommerce = /e-commerce|ecommerce|online shop|store|ই-কমার্স|দোকান/i.test(lowerMsg);
  const isUiUx = /ui|ux|figma|design|ইউআই|ডিজাইন/i.test(lowerMsg);
  const isAiAgent = /ai|agent|bot|chatbot|messenger|এআই|বট|চ্যাটবট/i.test(lowerMsg);
  const is3D = /3d|threejs|motion|render|থ্রিডি/i.test(lowerMsg);

  // Page extraction
  const pageMatch = lowerMsg.match(/(\d+)\s*(?:page|pages|পেজ)/);
  const pageCount = pageMatch ? parseInt(pageMatch[1], 10) : 1;

  let quoteInput: QuoteRequestInput = {};
  if (isEcommerce) quoteInput.serviceId = 'web_ecommerce';
  else if (isLandingPage) quoteInput.serviceId = 'web_landing';
  else if (isUiUx) quoteInput.serviceId = 'ui_ux_design';
  else if (isAiAgent) quoteInput.serviceId = 'ai_agent_custom';
  else if (is3D) quoteInput.serviceId = '3d_branding';
  else quoteInput.serviceId = 'web_custom_app';

  if (pageCount > 1) quoteInput.pageCount = pageCount;
  if (lowerMsg.includes('payment') || lowerMsg.includes('bkash') || lowerMsg.includes('পেমেন্ট')) quoteInput.hasPaymentGateway = true;
  if (lowerMsg.includes('urgent') || lowerMsg.includes('জরুরি') || lowerMsg.includes('তাড়াতাড়ি')) quoteInput.isUrgent = true;

  const quote = calculatePriceQuote(quoteInput);

  if (isGreeting && !isPriceQuery) {
    if (isBangla) {
      return {
        reply: `হ্যালো! 👋 **Antor Creative Studio**-এ আপনাকে স্বাগতম। আমি আন্তর স্টুডিওর এআই অ্যাসিস্ট্যান্ট।\n\nআমরা ওয়েব ডেভেলপমেন্ট, ই-কমার্স, UI/UX ডিজাইন, ৩ডি ডিজাইন এবং কাস্টম AI Agent নিয়ে কাজ করি। আপনার কোনো প্রজেক্টের বাজেট বা প্রাইস জানতে চাইলে আমাকে সরাসরি জানান!`,
      };
    } else if (isBanglish) {
      return {
        reply: `Hello! 👋 **Antor Creative Studio** te apnake swagotom. Ami Antor Studio er Agentic AI Assistant.\n\nAmra Web Development, E-Commerce, UI/UX Design, 3D Visuals and Custom AI Agents baniye thaki. Apnar project er price projection ba cost jante caile amake bolun!`,
      };
    } else {
      return {
        reply: `Hello! 👋 Welcome to **Antor Creative Studio**. I am the AI Assistant of Antor Studio.\n\nWe craft high-performance Web Apps, E-Commerce platforms, UI/UX designs, 3D interactive graphics, and Custom AI Agents. Let me know what service you need to get an instant price quotation!`,
      };
    }
  }

  if (isPriceQuery || isLandingPage || isEcommerce || isUiUx || isAiAgent || is3D) {
    if (isBangla) {
      return {
        reply: `আপনার চাহিদা অনুযায়ী অনুমানিক খরচ ও সময় নিচে দেওয়া হলো:\n\n📌 **সার্ভিস:** ${quote.serviceName}\n💰 **বাজেট (আনুমানিক):** ${quote.formattedPrice}\n⏱️ **সময়কাল:** ${quote.estimatedDays}\n\n**যেসব ফিচার অন্তর্ভুক্ত:**\n${quote.breakdown.map((b) => `- ${b}`).join('\n')}\n\nআপনার প্রজেক্ট সম্পর্কিত বিস্তারিত কথা বলতে আপনার **ফোন নম্বর** বা **ইমেইল** দিন, আমরা দ্রুত যোগাযোগ করব!`,
        quote,
      };
    } else if (isBanglish) {
      return {
        reply: `Apnar demand onujayi estimated cost & timeline niche dewa holo:\n\n📌 **Service:** ${quote.serviceName}\n💰 **Estimated Price:** ${quote.formattedPrice}\n⏱️ **Timeline:** ${quote.estimatedDays}\n\n**Included Items:**\n${quote.breakdown.map((b) => `- ${b}`).join('\n')}\n\nProject niye further kotha bolte apnar **Phone Number** ba **Email** share korun, amra sate sate contact korbo!`,
        quote,
      };
    } else {
      return {
        reply: `Here is the estimated cost and timeline based on your requirements:\n\n📌 **Service:** ${quote.serviceName}\n💰 **Estimated Budget:** ${quote.formattedPrice}\n⏱️ **Timeline:** ${quote.estimatedDays}\n\n**Scope Breakdown:**\n${quote.breakdown.map((b) => `- ${b}`).join('\n')}\n\nTo proceed with formal proposal or custom scope, please leave your **Phone Number** or **Email** and our team will get in touch immediately!`,
        quote,
      };
    }
  }

  // General fallback
  if (isBangla) {
    return {
      reply: `ধন্যবাদ আপনার বার্তার জন্য! Antor Creative Studio আপনার চাহিদামতো যেকোনো ওয়েব ডেভেলপমেন্ট, ই-কমার্স, UI/UX এবং কাস্টম AI এজেন্ট সার্ভিস প্রদান করে।\n\nআপনি কী ধরনের প্রজেক্ট করতে চাচ্ছেন তা বিস্তারিত জানালে আমি এখনই উপযুক্ত প্রাইস এবং সময় হিসেব করে দিতে পারি!`,
    };
  } else if (isBanglish) {
    return {
      reply: `Dhonnobad message er jonno! Antor Creative Studio apnar demand onujayi Web Development, E-Commerce, UI/UX ebong AI Agents provide kore.\n\nApni ki dhoroner project banate caccen bolle ami akhoni price projection ebong time bolte parbo!`,
    };
  } else {
    return {
      reply: `Thank you for reaching out to Antor Creative Studio! We specialize in Web Apps, E-Commerce, UI/UX Design, and Custom AI Agents.\n\nPlease describe your project requirements and I will provide an instant price estimate and timeline!`,
    };
  }
}

// OpenAI API Direct Call
async function callOpenAI(apiKey: string, userMsg: string, context: string, customKnowledge?: any): Promise<{ reply: string; quote?: QuoteResult }> {
  const customRules = customKnowledge?.customPromptRules || '';
  const systemPrompt = `You are Antor AI, executive AI assistant for Antor Creative Studio (founded by Antor Kumar Biswas).
Special Guidelines: ${customRules}
Your capabilities:
1. Detect user's language automatically (Bangla / Banglish / English) and respond in that exact language/style.
2. Quote service prices accurately based on rate cards.
3. Be proactive, polite, high-converting, and clear.
4. Encourage users to leave their Phone Number or Email for a formal quotation.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Context:\n${context}\n\nCurrent User Input: ${userMsg}` },
      ],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  return { reply: text };
}

// Gemini API Direct Call
async function callGemini(apiKey: string, userMsg: string, context: string, customKnowledge?: any): Promise<{ reply: string; quote?: QuoteResult }> {
  const customRules = customKnowledge?.customPromptRules || '';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `You are Antor AI, the agentic assistant for Antor Creative Studio.
Special Admin Guidelines: ${customRules}

Respond in the exact language the user used (Bangla, Banglish, or English).
Give accurate service pricing estimates based on agency knowledge.
Prompt user for contact details if interested.

Context:
${context}

User: ${userMsg}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API returned status ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) {
    throw new Error('Gemini API returned empty response');
  }
  return { reply: text };
}
