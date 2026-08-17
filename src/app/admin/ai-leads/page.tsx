'use client';

import React, { useEffect, useState } from 'react';
import {
  Bot,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  RefreshCw,
  Sliders,
  Save,
  CheckCircle2,
  HelpCircle,
  Key,
  BookOpen,
  Zap,
} from 'lucide-react';

interface AiLead {
  id: number;
  clientName: string;
  clientPhone: string | null;
  clientEmail: string | null;
  platform: string;
  serviceType: string;
  estimatedPrice: number | null;
  notes: string | null;
  status: string;
  createdAt: string;
}

interface ServiceItem {
  id: string;
  name: string;
  basePriceBDT: number;
  basePriceUSD: number;
  estimatedDays: string;
}

interface TrainingData {
  agencyName: string;
  founder: string;
  tagline: string;
  customPromptRules: string;
  geminiApiKey?: string;
  openaiApiKey?: string;
  services: ServiceItem[];
}

export default function AiLeadsAdminPage() {
  const [activeTab, setActiveTab] = useState<'leads' | 'training'>('leads');
  const [leads, setLeads] = useState<AiLead[]>([]);
  const [stats, setStats] = useState({ totalLeads: 0, totalConversations: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Training form state
  const [trainingData, setTrainingData] = useState<TrainingData>({
    agencyName: 'Antor Creative Studio',
    founder: 'Antor Kumar Biswas',
    tagline: 'Crafting High-Performance Web Apps, Dynamic 3D Experiences & Custom AI Agents',
    customPromptRules:
      'Be polite and executive. Offer 10% discount for first-time clients if requested. Emphasize fast delivery timelines and high-quality 3D/glassmorphism design.',
    geminiApiKey: '',
    openaiApiKey: '',
    services: [
      {
        id: 'web_landing',
        name: 'Landing Page / Showcase',
        basePriceBDT: 18000,
        basePriceUSD: 180,
        estimatedDays: '3-5 days',
      },
      {
        id: 'web_ecommerce',
        name: 'E-Commerce Online Store',
        basePriceBDT: 45000,
        basePriceUSD: 450,
        estimatedDays: '10-15 days',
      },
      {
        id: 'web_custom_app',
        name: 'Custom Web App / SaaS',
        basePriceBDT: 65000,
        basePriceUSD: 650,
        estimatedDays: '14-25 days',
      },
      {
        id: 'ui_ux_design',
        name: 'UI/UX & Figma Design',
        basePriceBDT: 20000,
        basePriceUSD: 200,
        estimatedDays: '4-8 days',
      },
      {
        id: 'ai_agent_custom',
        name: 'Custom AI Agent & Chatbot',
        basePriceBDT: 35000,
        basePriceUSD: 350,
        estimatedDays: '5-10 days',
      },
    ],
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/ai-leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrainingData = async () => {
    try {
      const res = await fetch('/api/admin/ai-knowledge');
      const data = await res.json();
      if (data.success && data.data) {
        setTrainingData((prev) => ({
          ...prev,
          ...data.data,
        }));
      }
    } catch (err) {
      console.error('Failed to load training knowledge:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchTrainingData();
  }, []);

  const handleSaveKnowledge = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/ai-knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainingData),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save training knowledge:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePriceChange = (id: string, field: 'basePriceBDT' | 'basePriceUSD', val: number) => {
    setTrainingData((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === id ? { ...s, [field]: val } : s)),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Bar Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  AI Agent & Training Control
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                  v2.0
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Manage AI Leads, customize service pricing, and train custom prompt rules
              </p>
            </div>
          </div>

          {/* Navigation Links back to main admin */}
          <div className="flex items-center gap-3">
            <a
              href="/admin"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-all"
            >
              ← Admin Dashboard
            </a>
            <button
              onClick={fetchLeads}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all cursor-pointer shadow-lg shadow-purple-600/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 gap-4">
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'leads'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Captured Leads ({stats.totalLeads})
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`pb-3 px-4 font-semibold text-sm flex items-center gap-2 transition-all border-b-2 cursor-pointer ${
              activeTab === 'training'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" /> AI Training & Pricing Rules 🧠
          </button>
        </div>

        {/* TAB 1: LEADS VIEW */}
        {activeTab === 'leads' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
                <div className="flex justify-between items-center text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Total Leads Captured
                  <Bot className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-white mt-2">{stats.totalLeads}</div>
              </div>

              <div className="bg-slate-900/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
                <div className="flex justify-between items-center text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Active Conversations
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-bold text-white mt-2">{stats.totalConversations}</div>
              </div>

              <div className="bg-slate-900/60 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
                <div className="flex justify-between items-center text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Active Channels
                  <Globe className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-sm font-semibold text-emerald-400 mt-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Website & FB Messenger Sync Active
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
              <div className="p-5 border-b border-white/10 flex justify-between items-center">
                <h2 className="font-semibold text-white text-lg">Inquiries & Price Quotes</h2>
                <span className="text-xs text-slate-400">Auto-captured from AI conversations</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4">Client Contact</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Est. Price Quote</th>
                      <th className="px-6 py-4">Platform</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          No leads captured yet. Send a test message in the website chat or Facebook Messenger!
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{lead.clientName}</div>
                            <div className="text-xs text-slate-400 flex flex-col gap-1 mt-1">
                              {lead.clientPhone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-purple-400" /> {lead.clientPhone}
                                </span>
                              )}
                              {lead.clientEmail && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-cyan-400" /> {lead.clientEmail}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-purple-300">
                            {lead.serviceType}
                          </td>
                          <td className="px-6 py-4 font-bold text-emerald-400">
                            {lead.estimatedPrice ? `৳${lead.estimatedPrice.toLocaleString()}` : 'Custom Quote'}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                lead.platform === 'MESSENGER'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              }`}
                            >
                              {lead.platform === 'MESSENGER' ? 'FB Messenger' : 'Website Widget'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRAINING & PRICING EDITOR */}
        {activeTab === 'training' && (
          <div className="space-y-8">
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" /> Train AI Persona & Instructions
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Set agency identity and custom response rules for your AI Assistant
                  </p>
                </div>

                <button
                  onClick={handleSaveKnowledge}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:brightness-110 text-white font-semibold text-sm transition-all cursor-pointer shadow-lg shadow-purple-600/30"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Training Settings'}
                </button>
              </div>

              {saveSuccess && (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5" /> AI Training rules and pricing updated successfully!
                </div>
              )}

              {/* General Agency Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                    Agency Name
                  </label>
                  <input
                    type="text"
                    value={trainingData.agencyName}
                    onChange={(e) => setTrainingData({ ...trainingData, agencyName: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                    Founder Name
                  </label>
                  <input
                    type="text"
                    value={trainingData.founder}
                    onChange={(e) => setTrainingData({ ...trainingData, founder: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                  Custom AI Prompt Rules / Special Guidelines
                </label>
                <textarea
                  rows={4}
                  value={trainingData.customPromptRules}
                  onChange={(e) =>
                    setTrainingData({ ...trainingData, customPromptRules: e.target.value })
                  }
                  placeholder="Enter custom instructions for how the AI should talk to clients, discounts, or service policies..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-purple-500 outline-none font-mono text-xs leading-relaxed"
                />
              </div>

              {/* API Keys & LLM Configuration */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Key className="w-4 h-4 text-cyan-400" /> LLM API Keys (Gemini & OpenAI)
                  </h3>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Get Free Gemini API Key ↗
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                      Google Gemini API Key
                    </label>
                    <input
                      type="password"
                      value={trainingData.geminiApiKey || ''}
                      onChange={(e) =>
                        setTrainingData({ ...trainingData, geminiApiKey: e.target.value })
                      }
                      placeholder="AIzaSy..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 outline-none font-mono"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Gemini 1.5 Flash (Free tier available at Google AI Studio)
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                      OpenAI API Key (Optional)
                    </label>
                    <input
                      type="password"
                      value={trainingData.openaiApiKey || ''}
                      onChange={(e) =>
                        setTrainingData({ ...trainingData, openaiApiKey: e.target.value })
                      }
                      placeholder="sk-proj-..."
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 outline-none font-mono"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      GPT-4o / GPT-4o-mini key from platform.openai.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Pricing Rate Cards */}
              <div className="border-t border-white/10 pt-6 space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" /> Service Pricing Rate Cards (BDT & USD)
                </h3>
                <p className="text-xs text-slate-400">
                  The AI uses these base prices to calculate client quotes automatically.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  {trainingData.services.map((svc) => (
                    <div
                      key={svc.id}
                      className="bg-slate-950/80 border border-white/10 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="font-semibold text-purple-300 text-sm">{svc.name}</div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">BDT (৳):</span>
                          <input
                            type="number"
                            value={svc.basePriceBDT}
                            onChange={(e) =>
                              handlePriceChange(svc.id, 'basePriceBDT', parseInt(e.target.value, 10) || 0)
                            }
                            className="w-28 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white text-right focus:border-purple-500 outline-none font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">USD ($):</span>
                          <input
                            type="number"
                            value={svc.basePriceUSD}
                            onChange={(e) =>
                              handlePriceChange(svc.id, 'basePriceUSD', parseInt(e.target.value, 10) || 0)
                            }
                            className="w-24 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white text-right focus:border-purple-500 outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
