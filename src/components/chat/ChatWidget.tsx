'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Calculator,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Globe,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  quote?: {
    serviceName: string;
    formattedPrice: string;
    estimatedDays: string;
    breakdown: string[];
  };
  timestamp: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [leadCaptured, setLeadCaptured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or restore session ID
  useEffect(() => {
    let sid = localStorage.getItem('antor_ai_session');
    if (!sid) {
      sid = `web_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('antor_ai_session', sid);
    }
    setSessionId(sid);

    // Initial greeting
    setMessages([
      {
        id: 'init-1',
        sender: 'AI',
        text: `👋 **হ্যালো! Antor Creative Studio-তে আপনাকে স্বাগতম!**\n\nআমি আন্তর স্টুডিওর **Agentic AI Assistant**। আপনার প্রজেক্টের বাজেট, সার্ভিস সম্পর্কে জানতে বা প্রাইস প্রজেকশন দেখতে সরাসরি মেসেজ দিন!\n\n(I support **Bangla**, **Banglish**, and **English**).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'USER',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId,
          platform: 'WEBSITE',
        }),
      });

      const data = await res.json();
      if (data.success) {
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'AI',
          text: data.reply,
          quote: data.quote,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (data.leadCaptured) setLeadCaptured(true);
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'AI',
          text: 'দুঃখিত, কোনো একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন অথবা সরাসরি হোয়াটসঅ্যাপে বার্তা দিন!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickOption = (promptText: string) => {
    handleSendMessage(promptText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white px-5 py-4 rounded-full shadow-2xl hover:shadow-cyan-500/20 border border-white/20 backdrop-blur-md cursor-pointer transition-all duration-300"
          >
            <div className="relative">
              <Bot className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <span className="font-semibold text-sm tracking-wide hidden sm:inline-block">
              AI Agent Quote
            </span>
            <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-slate-950/90 text-slate-100 rounded-3xl shadow-2xl border border-white/10 flex flex-col backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-slate-900/80 p-4 px-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base tracking-tight">Antor Studio AI</h3>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Agentic
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Multilingual Price Bot
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Suggestion Pills */}
            <div className="bg-slate-900/50 p-2.5 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
              <button
                onClick={() => handleQuickOption('ওয়েব ডেভেলপমেন্টের প্রাইস কত?')}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Calculator className="w-3.5 h-3.5" /> 💡 Web Dev Price
              </button>
              <button
                onClick={() => handleQuickOption('UI/UX Design price range?')}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" /> 🎨 UI/UX Design
              </button>
              <button
                onClick={() => handleQuickOption('Messenger agent chatbot cost')}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Bot className="w-3.5 h-3.5" /> 🤖 AI Agent
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'AI' && (
                    <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-purple-300" />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2`}>
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'USER'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-md'
                          : 'bg-slate-900/90 text-slate-200 border border-white/10 rounded-tl-none shadow-inner'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>

                    {/* Dynamic Price Quote Card if returned */}
                    {msg.quote && (
                      <div className="bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-purple-500/30 p-3.5 rounded-xl shadow-lg space-y-2">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                            Estimated Quote
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                            {msg.quote.estimatedDays}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm font-medium text-slate-200">{msg.quote.serviceName}</span>
                          <span className="text-base font-bold text-cyan-400">{msg.quote.formattedPrice}</span>
                        </div>
                        <button
                          onClick={() =>
                            handleQuickOption(`I want to order ${msg.quote?.serviceName}. My phone: `)
                          }
                          className="w-full mt-1 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-semibold rounded-lg hover:brightness-110 flex items-center justify-center gap-1 cursor-pointer transition-all"
                        >
                          Book Proposal <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div
                      className={`text-[10px] text-slate-500 px-1 ${
                        msg.sender === 'USER' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'USER' && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-purple-300 animate-spin" />
                  </div>
                  <div className="bg-slate-900/90 border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-900/80 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask pricing or project requirement (Bangla/English)..."
                className="flex-1 bg-slate-950 border border-white/10 focus:border-purple-500/50 text-slate-200 text-xs sm:text-sm px-4 py-2.5 rounded-xl outline-none transition-all placeholder:text-slate-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 disabled:opacity-50 text-white flex items-center justify-center flex-shrink-0 cursor-pointer transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
