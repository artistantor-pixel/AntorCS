"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
const motionImport = motion;
const AnimatePresenceImport = AnimatePresence;

import type { LucideIcon } from "lucide-react";
import {
  Lock, Unlock, Plus, Trash2, CheckCircle2,
  Clock, Zap, Coffee, Moon, Sun, Sunset, ArrowRight,
  Flame, Target, Briefcase, ImageIcon, Film, Share2, X,
  ShieldAlert, Home, RotateCcw, Edit3, ChevronRight, LogOut, Loader2
} from "lucide-react";

// ─── TYPES ──────────────────────────────────────────────────────────────────
type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type TaskType = "BOSS_TASK" | "CLIENT_WORK" | "GRAPHIC" | "MOTION" | "SOCIAL";
type Status = "TODO" | "IN_PROGRESS" | "COMPLETED";

interface Task {
  id: string;
  title: string;
  client: string;
  description?: string;
  priority: Priority;
  type: TaskType;
  status: Status;
  deadline?: string;
  createdAt: string;
}

interface UserSession {
  email: string;
  name: string;
  picture?: string;
}

// ─── TIME THEME ENGINE (light palette) ──────────────────────────────────────
interface TimeTheme {
  name: string; greeting: string;
  pageBg: string; headerBg: string;
  accent: string; accentLight: string; accentText: string;
  icon: LucideIcon; iconClass: string; label: string;
}

function getTimeTheme(hour: number): TimeTheme {
  if (hour >= 5 && hour < 9) return {
    name: "Dawn Rush", greeting: "ভোরের শুরু! আজকের মিশন শুরু হোক 🌅",
    pageBg: "bg-gradient-to-br from-amber-50 via-orange-50 to-white",
    headerBg: "bg-amber-50/80",
    accent: "#f59e0b", accentLight: "bg-amber-50", accentText: "text-amber-600",
    icon: Sun, iconClass: "text-amber-500", label: "Dawn Mode"
  };
  if (hour >= 9 && hour < 12) return {
    name: "Morning Sprint", greeting: "গুড মর্নিং! ফুল পাওয়ারে কাজ শুরু করো ☕",
    pageBg: "bg-gradient-to-br from-sky-50 via-blue-50 to-white",
    headerBg: "bg-sky-50/80",
    accent: "#0ea5e9", accentLight: "bg-sky-50", accentText: "text-sky-600",
    icon: Coffee, iconClass: "text-sky-500", label: "Morning Mode"
  };
  if (hour >= 12 && hour < 17) return {
    name: "Midday Grind", greeting: "দুপুরের জোয়ার! আর্জেন্ট কাজ এখনই শেষ করো ⚡",
    pageBg: "bg-gradient-to-br from-red-50 via-rose-50 to-white",
    headerBg: "bg-red-50/80",
    accent: "#ea3f40", accentLight: "bg-red-50", accentText: "text-red-600",
    icon: Zap, iconClass: "text-red-500", label: "Grind Mode"
  };
  if (hour >= 17 && hour < 20) return {
    name: "Golden Hour", greeting: "সন্ধ্যার সোনালী সময়! শেষ ধাপ পার করো 🌇",
    pageBg: "bg-gradient-to-br from-orange-50 via-yellow-50 to-white",
    headerBg: "bg-orange-50/80",
    accent: "#f97316", accentLight: "bg-orange-50", accentText: "text-orange-600",
    icon: Sunset, iconClass: "text-orange-500", label: "Golden Hour"
  };
  return {
    name: "Night Owl", greeting: "রাতের নিঃশব্দতায় সৃষ্টি হয় সেরা কাজ 🌙",
    pageBg: "bg-gradient-to-br from-violet-50 via-purple-50 to-white",
    headerBg: "bg-violet-50/80",
    accent: "#8b5cf6", accentLight: "bg-violet-50", accentText: "text-violet-600",
    icon: Moon, iconClass: "text-violet-500", label: "Night Owl"
  };
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const PRIORITY_ORDER: Record<Priority, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const TYPE_META: Record<TaskType, { label: string; icon: LucideIcon; color: string; bg: string; border: string }> = {
  BOSS_TASK:   { label: "Boss Directive", icon: ShieldAlert,  color: "text-red-600",    bg: "bg-red-50",    border: "border-red-200" },
  CLIENT_WORK: { label: "Client Work",    icon: Briefcase,    color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200" },
  GRAPHIC:     { label: "Graphic Design", icon: ImageIcon,    color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  MOTION:      { label: "Motion",         icon: Film,         color: "text-emerald-600",bg: "bg-emerald-50",border: "border-emerald-200" },
  SOCIAL:      { label: "Social Media",   icon: Share2,       color: "text-pink-600",   bg: "bg-pink-50",   border: "border-pink-200" },
};

const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string; border: string; pulse: boolean }> = {
  CRITICAL: { label: "🔴 Critical",  color: "text-red-700",    bg: "bg-red-100",    border: "border-red-300",    pulse: true },
  HIGH:     { label: "🟠 High",      color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-300", pulse: false },
  MEDIUM:   { label: "🟡 Medium",    color: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-300", pulse: false },
  LOW:      { label: "🟢 Low",       color: "text-green-700",  bg: "bg-green-100",  border: "border-green-300",  pulse: false },
};

function formatDeadline(d?: string) {
  if (!d) return null;
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0)  return { text: `${Math.abs(diff)}d overdue`, urgent: true };
  if (diff === 0) return { text: "Due TODAY!", urgent: true };
  if (diff === 1) return { text: "Due Tomorrow", urgent: true };
  return { text: `${diff} days left`, urgent: false };
}

// ─── DECODE JWT TOKEN SECURELY ────────────────────────────────────────────────
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <span className="font-mono text-xs tabular-nums text-gray-500">
      {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
    </span>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CommandCenter() {
  const [user, setUser]           = useState<UserSession | null>(null);
  const [tasks, setTasks]         = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBossMode, setIsBossMode] = useState(false);
  const [showAuth, setShowAuth]   = useState(false);
  const [password, setPassword]   = useState("");
  const [authErr, setAuthErr]     = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [filter, setFilter]       = useState<Status | "ALL">("ALL");
  const [isSaving, setIsSaving]   = useState(false);
  const [hour, setHour]           = useState(new Date().getHours());
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [form, setForm] = useState({
    title: "", client: "", description: "",
    priority: "HIGH" as Priority, type: "BOSS_TASK" as TaskType,
    status: "TODO" as Status, deadline: ""
  });

  const theme = getTimeTheme(hour);
  const ThemeIcon = theme.icon;

  useEffect(() => {
    const t = setInterval(() => setHour(new Date().getHours()), 60000);
    return () => clearInterval(t);
  }, []);

  // Restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("workspace_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email && parsed.email.endsWith("@gmail.com")) {
          setUser(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Initialize Google Login Client SDK
  useEffect(() => {
    if (user) return; // No need if logged in

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const g = (window as any).google;
      if (g) {
        g.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1058778732684-fallbackgoogleclientid.apps.googleusercontent.com",
          callback: (response: any) => {
            const payload = parseJwt(response.credential);
            if (payload && payload.email) {
              if (payload.email.endsWith("@gmail.com")) {
                const loggedInUser: UserSession = {
                  email: payload.email,
                  name: payload.name || payload.email.split("@")[0],
                  picture: payload.picture
                };
                setUser(loggedInUser);
                localStorage.setItem("workspace_user", JSON.stringify(loggedInUser));
                setAuthErr("");
              } else {
                setAuthErr("প্রবেশাধিকার বঞ্চিত: শুধুমাত্র @gmail.com অ্যাকাউন্ট অনুমোদিত!");
              }
            } else {
              setAuthErr("গুগল সাইন-ইন ব্যর্থ হয়েছে!");
            }
          }
        });

        const btnElement = document.getElementById("google-signin-btn");
        if (btnElement) {
          g.accounts.id.renderButton(btnElement, {

            theme: "outline",
            size: "large",
            width: btnElement.clientWidth || 320,
            shape: "pill"
          });
        }
      }
    };

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    localStorage.removeItem("workspace_user");
  };

  const fetchTasks = useCallback(async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/calendar?email=${encodeURIComponent(user.email)}`, { cache: "no-store" });
      if (res.ok) {
        const d = await res.json();
        if (Array.isArray(d)) setTasks(d);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchTasks();
    }
  }, [user?.email, fetchTasks]);

  const saveTasks = async (updated: Task[]) => {
    if (!user?.email) return false;
    const res = await fetch(`/api/calendar?email=${encodeURIComponent(user.email)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    return res.ok;
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "boss123") {
      setIsBossMode(true);
      setShowAuth(false);
      setAuthErr("");
      setPassword("");
    } else {
      setAuthErr("ভুল পাসওয়ার্ড!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setIsSaving(true);
    let updated: Task[];
    if (editingTask) {
      updated = tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...form } : t);
    } else {
      const nt: Task = { id: `task_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, ...form, createdAt: new Date().toISOString() };
      updated = [nt, ...tasks];
    }
    if (await saveTasks(updated)) {
      setTasks(updated);
      setShowForm(false);
      setEditingTask(null);
      setForm({ title: "", client: "", description: "", priority: "HIGH", type: "BOSS_TASK", status: "TODO", deadline: "" });
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই টাস্কটি মুছে ফেলবো?")) return;
    const updated = tasks.filter(t => t.id !== id);
    if (await saveTasks(updated)) setTasks(updated);
  };

  const handleStatus = async (task: Task, s: Status) => {
    const updated = tasks.map(t => t.id === task.id ? { ...t, status: s } : t);
    if (await saveTasks(updated)) setTasks(updated);
  };

  const openEdit = (task: Task) => {
    setForm({ title: task.title, client: task.client, description: task.description || "", priority: task.priority, type: task.type, status: task.status, deadline: task.deadline || "" });
    setEditingTask(task);
    setShowForm(true);
  };

  const sorted = [...tasks].sort((a, b) => {
    const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pd !== 0) return pd;
    if (a.deadline && b.deadline) return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    return 0;
  });

  const filtered = filter === "ALL" ? sorted : sorted.filter(t => t.status === filter);
  const heroTask = sorted.find(t => t.status !== "COMPLETED");

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === "TODO").length,
    inProgress: tasks.filter(t => t.status === "IN_PROGRESS").length,
    done: tasks.filter(t => t.status === "COMPLETED").length,
    critical: tasks.filter(t => t.priority === "CRITICAL" && t.status !== "COMPLETED").length,
  };

  // ─── UNAUTHENTICATED RENDER (GMAIL LOGIN REQUIRED) ─────────────────────────
  if (!user) {
    return (
      <div className={`min-h-screen ${theme.pageBg} flex flex-col justify-center items-center p-6 antialiased text-gray-800`}>
        <div className="absolute top-4 left-6">
          <a href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-gray-400 text-xs font-bold text-gray-600 hover:text-gray-900 transition-all shadow-sm">
            <Home size={12} /> Home
          </a>
        </div>

        <motionImport.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl p-8 md:p-10 space-y-8 relative overflow-hidden text-center"
        >
          {/* Decorative backdrop glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto bg-brand-red/5 text-brand-red border border-brand-red/10">
              <Lock size={26} className="animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black font-serif tracking-tight text-gray-900 leading-tight">
              Antor Workspace
            </h1>
            <p className="text-xs text-muted leading-relaxed max-w-xs mx-auto">
              প্রাইভেসির স্বার্থে শুধুমাত্র ভেরিফাইড **Gmail** ব্যবহারকারীগণ এই ওয়ার্কস্পেস ব্যবহার করতে পারবেন।
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Error alerts */}
          {authErr && (
            <motionImport.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold text-left flex items-start gap-3"
            >
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{authErr}</span>
            </motionImport.div>
          )}

          {/* Dynamic Google Login Button */}
          <div className="space-y-4">
            <div 
              id="google-signin-btn" 
              className="w-full flex justify-center hoverable min-h-[46px]"
            />
            <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
              Secure Auth matrix
            </p>
          </div>
        </motionImport.div>
      </div>
    );
  }

  // ─── AUTHENTICATED COMMAND CENTER RENDER ─────────────────────────────────────
  return (
    <div className={`min-h-screen ${theme.pageBg} text-gray-800 antialiased`}>

      {/* ── TOP BAR ── */}
      <header className={`sticky top-0 z-40 ${theme.headerBg} backdrop-blur-md border-b border-black/5 shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">

          {/* Left */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-gray-400 text-xs font-bold text-gray-600 hover:text-gray-900 transition-all shadow-sm">
              <Home size={12} /> Home
            </a>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-sm">
              <ThemeIcon size={12} className={theme.iconClass} />
              <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">{theme.label}</span>
              <span className="w-px h-3 bg-gray-200" />
              <LiveClock />
            </div>
          </div>

          {/* Right (Google user & Logout) */}
          <div className="flex items-center gap-3 flex-wrap">
            {stats.critical > 0 && (
              <motionImport.div animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 text-[10px] font-black tracking-wider">
                🔴 {stats.critical} Critical
              </motionImport.div>
            )}

            {/* Google Profile Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="w-5 h-5 rounded-full object-cover border border-gray-100"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center text-[9px] font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-[10px] font-bold text-gray-700 truncate max-w-[120px]">{user.name}</span>
            </div>

            {isBossMode ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 text-[10px] font-black tracking-widest animate-pulse">
                  ⚡ BOSS MODE
                </span>
                <button onClick={() => setIsBossMode(false)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-red-300 text-xs font-bold text-gray-500 hover:text-red-600 transition-all shadow-sm cursor-pointer">
                  <Unlock size={11} /> Exit
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-400 text-xs font-bold text-gray-600 hover:text-gray-900 transition-all shadow-sm cursor-pointer">
                <Lock size={11} /> Boss Access
              </button>
            )}

            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-xs font-bold text-red-600 transition-all shadow-sm cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={12} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── GREETING ── */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <ThemeIcon size={14} className={theme.iconClass} />
            <span className={`text-xs font-black tracking-widest uppercase ${theme.accentText}`}>{theme.name}</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">{theme.greeting}</p>
        </div>

        {/* ── HERO MISSION CARD ── */}
        <AnimatePresenceImport mode="wait">
          {heroTask ? (() => {
            const hpm = PRIORITY_META[heroTask.priority];
            const htm = TYPE_META[heroTask.type];
            const hdl = formatDeadline(heroTask.deadline);
            const HTypeIcon = htm.icon;
            return (
              <motionImport.div key={heroTask.id}
                initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
                style={{ boxShadow: `0 8px 40px ${theme.accent}18` }}
              >
                {/* Color accent strip */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}55)` }} />

                <div className="p-7 md:p-10 space-y-5">
                  {/* Labels */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border"
                        style={{ background: theme.accent + "12", borderColor: theme.accent + "30", color: theme.accent }}>
                        <Target size={9} /> CURRENT MISSION
                      </span>
                      <span className={`px-3 py-1 rounded-full border text-[9px] font-black tracking-widest ${hpm.bg} ${hpm.border} ${hpm.color} ${hpm.pulse ? "animate-pulse" : ""}`}>
                        {hpm.label}
                      </span>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full border text-[9px] font-black tracking-widest ${htm.bg} ${htm.border} ${htm.color}`}>
                        <HTypeIcon size={9} /> {htm.label}
                      </span>
                    </div>
                    {hdl && (
                      <span className={`flex items-center gap-1 text-[10px] font-mono font-bold ${hdl.urgent ? "text-red-600" : "text-gray-400"}`}>
                        <Clock size={10} /> {hdl.text}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <h1 className="text-2xl md:text-4xl font-black font-serif leading-tight text-gray-900">
                      {heroTask.title}
                    </h1>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400 flex-wrap">
                      <span className="px-2 py-0.5 rounded-lg text-xs font-bold" style={{ background: theme.accent + "15", color: theme.accent }}>
                        {heroTask.client || "Studio"}
                      </span>
                      <span>·</span>
                      <span className={heroTask.status === "IN_PROGRESS" ? "text-amber-600 animate-pulse" : "text-gray-400"}>
                        {heroTask.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {heroTask.description && (
                    <p className="text-sm text-gray-500 leading-relaxed bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 max-w-2xl">
                      {heroTask.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2 flex-wrap">
                    {heroTask.status !== "IN_PROGRESS" && heroTask.status !== "COMPLETED" && (
                      <button onClick={() => handleStatus(heroTask, "IN_PROGRESS")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer"
                        style={{ background: theme.accent + "12", borderColor: theme.accent + "30", color: theme.accent }}>
                        <Zap size={12} /> Start Working
                      </button>
                    )}
                    {heroTask.status !== "COMPLETED" && (
                      <button onClick={() => handleStatus(heroTask, "COMPLETED")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer">
                        <CheckCircle2 size={12} /> Mark Done
                      </button>
                    )}
                    {isBossMode && (
                      <>
                        <button onClick={() => openEdit(heroTask)}
                          className="p-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-400 text-gray-400 hover:text-gray-700 transition-all cursor-pointer">
                          <Edit3 size={12} />
                        </button>
                        <button onClick={() => handleDelete(heroTask.id)}
                          className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer">
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motionImport.div>
            );
          })() : (
            <motionImport.div key="empty-hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center space-y-3">
              <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
              <h2 className="text-xl font-black font-serif text-gray-800">সব কাজ শেষ! 🎉</h2>
              <p className="text-xs text-gray-400 font-mono">No pending missions. The studio is clear.</p>
            </motionImport.div>
          )}
        </AnimatePresenceImport>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Tasks",  val: stats.total,      icon: Briefcase,    color: "text-gray-500",   bg: "bg-gray-50",    border: "border-gray-200" },
            { label: "To Do",        val: stats.todo,       icon: Clock,        color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-200" },
            { label: "In Progress",  val: stats.inProgress, icon: Flame,        color: "text-amber-600",  bg: "bg-amber-50",   border: "border-amber-200" },
            { label: "Completed",    val: stats.done,       icon: CheckCircle2, color: "text-emerald-600",bg: "bg-emerald-50", border: "border-emerald-200" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`rounded-2xl ${s.bg} border ${s.border} p-4 flex items-center gap-3 shadow-sm`}>
                <Icon size={16} className={s.color} />
                <div>
                  <div className="text-2xl font-black font-mono text-gray-800">{s.val}</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── TOOLBAR ── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["ALL", "TODO", "IN_PROGRESS", "COMPLETED"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wider uppercase border transition-all cursor-pointer ${filter === f
                  ? "text-white border-transparent shadow-md"
                  : "text-gray-500 bg-white border-gray-200 hover:border-gray-400"}`}
                style={filter === f ? { background: theme.accent, borderColor: theme.accent } : {}}>
                {f.replace("_", " ")}
              </button>
            ))}
          </div>

          <button onClick={() => { setEditingTask(null); setForm({ title: "", client: "", description: "", priority: "HIGH", type: "BOSS_TASK", status: "TODO", deadline: "" }); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all hover:opacity-90 cursor-pointer"
            style={{ background: theme.accent }}>
            <Plus size={14} /> Add Task
          </button>
        </div>

        {/* ── TASK GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">
          {isLoading ? (
            <div className="md:col-span-2 flex items-center justify-center py-20 text-gray-400 font-mono text-xs border border-gray-100 rounded-2xl bg-white shadow-sm">
              <Loader2 className="animate-spin text-brand-red mr-2" size={16} />
              লোডিং হচ্ছে...
            </div>
          ) : filtered.length === 0 ? (
            <div className="md:col-span-2 text-center py-16 text-gray-400 font-mono text-xs border border-gray-100 rounded-2xl bg-white shadow-sm">
              কোনো টাস্ক নেই — নতুন টাস্ক যোগ করো!
            </div>
          ) : (
            <AnimatePresenceImport>
              {filtered.map((task, idx) => {
                const tm = TYPE_META[task.type];
                const pm = PRIORITY_META[task.priority];
                const TIcon = tm.icon;
                const isHero = task.id === heroTask?.id;
                const dl = formatDeadline(task.deadline);

                return (
                  <motionImport.div key={task.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: idx * 0.04 }}
                    className={`group relative bg-white rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md ${
                      task.status === "COMPLETED"
                        ? "opacity-60 border-gray-100"
                        : isHero ? "border-gray-200" : "border-gray-100 hover:border-gray-300"
                    }`}
                    style={isHero && task.status !== "COMPLETED" ? { borderColor: theme.accent + "50", boxShadow: `0 0 0 2px ${theme.accent}18` } : {}}>

                    {/* Hero dot indicator */}
                    {isHero && task.status !== "COMPLETED" && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full animate-ping"
                        style={{ background: theme.accent }} />
                    )}

                    <div className="space-y-3">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap pr-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[8px] font-black tracking-wider uppercase ${tm.bg} ${tm.border} ${tm.color}`}>
                          <TIcon size={8} /> {tm.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-lg border text-[8px] font-black tracking-wider ${pm.bg} ${pm.border} ${pm.color} ${pm.pulse && task.status !== "COMPLETED" ? "animate-pulse" : ""}`}>
                          {pm.label}
                        </span>
                        {task.status === "IN_PROGRESS" && (
                          <span className="px-2 py-0.5 rounded-lg border text-[8px] font-black tracking-wider bg-amber-50 border-amber-200 text-amber-700 animate-pulse">
                            ⚙ IN PROGRESS
                          </span>
                        )}
                        {task.status === "COMPLETED" && (
                          <span className="px-2 py-0.5 rounded-lg border text-[8px] font-black tracking-wider bg-emerald-50 border-emerald-200 text-emerald-700">
                            ✓ DONE
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className={`font-bold text-sm leading-snug font-serif ${task.status === "COMPLETED" ? "line-through text-gray-400" : "text-gray-900"}`}>
                        {task.title}
                      </h3>

                      {/* Client + Deadline */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider truncate">
                          {task.client || "Studio"}
                        </span>
                        {dl && (
                          <span className={`text-[9px] font-mono font-bold flex items-center gap-1 shrink-0 ${dl.urgent ? "text-red-600" : "text-gray-400"}`}>
                            <Clock size={8} /> {dl.text}
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Action buttons ─ visible on hover/tap */}
                      <div className="flex items-center gap-2 pt-1 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {task.status !== "IN_PROGRESS" && task.status !== "COMPLETED" && (
                          <button onClick={() => handleStatus(task, "IN_PROGRESS")}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[9px] font-bold hover:bg-amber-100 transition-all cursor-pointer">
                            Start
                          </button>
                        )}
                        {task.status !== "COMPLETED" && (
                          <button onClick={() => handleStatus(task, "COMPLETED")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold hover:bg-emerald-100 transition-all cursor-pointer">
                            Done ✓
                          </button>
                        )}
                        {task.status === "COMPLETED" && (
                          <button onClick={() => handleStatus(task, "TODO")}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 text-[9px] font-bold hover:bg-gray-100 transition-all cursor-pointer font-bold">
                            <RotateCcw size={8} /> Reopen
                          </button>
                        )}
                        {isBossMode && (
                          <>
                            <button onClick={() => openEdit(task)}
                              className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all cursor-pointer">
                              <Edit3 size={9} />
                            </button>
                            <button onClick={() => handleDelete(task.id)}
                              className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer">
                              <Trash2 size={9} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motionImport.div>
                );
              })}
            </AnimatePresenceImport>
          )}
        </div>
      </div>

      {/* ── BOSS AUTH MODAL ── */}
      <AnimatePresenceImport>
        {showAuth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motionImport.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
              className="bg-white border border-gray-200 rounded-3xl w-full max-w-sm p-7 shadow-2xl space-y-6">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style={{ background: theme.accent + "15" }}>
                  <ShieldAlert size={22} style={{ color: theme.accent }} />
                </div>
                <h3 className="font-black text-lg font-serif text-gray-900">Boss Authorization</h3>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Restricted Access</p>
              </div>
              <form onSubmit={handleAuth} className="space-y-4">
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter boss password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 text-center font-mono tracking-widest placeholder:text-gray-300 focus:border-gray-400 outline-none" />
                {authErr && <p className="text-red-500 text-xs text-center font-bold">{authErr}</p>}
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setShowAuth(false); setAuthErr(""); setPassword(""); }}
                    className="flex-1 py-3 rounded-xl font-bold text-xs text-gray-400 hover:text-gray-700 border border-gray-200 hover:border-gray-400 transition-all bg-white cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-3 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md transition-all hover:opacity-90 cursor-pointer"
                    style={{ background: theme.accent }}>
                    Authorize <ArrowRight size={12} />
                  </button>
                </div>
              </form>
            </motionImport.div>
          </div>
        )}
      </AnimatePresenceImport>

      {/* ── ADD / EDIT TASK MODAL ── */}
      <AnimatePresenceImport>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
            <motionImport.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="bg-white border border-gray-200 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between">
                <h3 className="font-black text-base font-serif text-gray-900 flex items-center gap-2">
                  <Plus size={16} style={{ color: theme.accent }} />
                  {editingTask ? "টাস্ক এডিট করুন" : "নতুন টাস্ক যোগ করুন"}
                </h3>
                <button onClick={() => { setShowForm(false); setEditingTask(null); }}
                  className="p-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-400 text-gray-400 hover:text-gray-700 transition-all cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">কাজের নাম *</label>
                  <input type="text" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="যেমন: Logo design for Lumina Co."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:border-gray-400 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">ক্লায়েন্ট</label>
                    <input type="text" value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))}
                      placeholder="Boss / Client Name"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 placeholder:text-gray-300 focus:border-gray-400 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">ডেডলাইন</label>
                    <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:border-gray-400 outline-none font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "অগ্রাধিকার", key: "priority", opts: [["CRITICAL","🔴 Critical"],["HIGH","🟠 High"],["MEDIUM","🟡 Medium"],["LOW","🟢 Low"]] },
                    { label: "টাইপ",      key: "type",     opts: [["BOSS_TASK","🚨 Boss"],["CLIENT_WORK","💼 Client"],["GRAPHIC","🎨 Graphic"],["MOTION","🎬 Motion"],["SOCIAL","📱 Social"]] },
                    { label: "স্ট্যাটাস", key: "status",   opts: [["TODO","📝 To-Do"],["IN_PROGRESS","⚙️ Progress"],["COMPLETED","✅ Done"]] },
                  ].map(({ label, key, opts }) => (
                    <div key={key}>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{label}</label>
                      <select value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2.5 text-[10px] text-gray-800 focus:border-gray-400 outline-none">
                        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">বিস্তারিত নোট</label>
                  <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="নির্দেশনা, রেফারেন্স লিংক..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-300 focus:border-gray-400 outline-none resize-none animate-none" />
                </div>

                <button type="submit" disabled={isSaving}
                  className="w-full py-3 rounded-xl font-black text-sm text-white transition-all disabled:opacity-50 shadow-md hover:opacity-90 cursor-pointer"
                  style={{ background: theme.accent }}>
                  {isSaving ? "সেভ হচ্ছে..." : editingTask ? "✓ আপডেট করুন" : "✓ টাস্ক যোগ করুন"}
                </button>
              </form>
            </motionImport.div>
          </div>
        )}
      </AnimatePresenceImport>

    </div>
  );
}
