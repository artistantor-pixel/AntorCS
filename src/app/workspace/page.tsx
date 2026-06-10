"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Lock, Unlock, Plus, Trash2, CheckCircle2,
  Clock, Zap, Coffee, Moon, Sun, Sunset, ArrowRight,
  Flame, Target, Briefcase, ImageIcon, Film, Share2, X,
  ShieldAlert, Home, RotateCcw, Edit3, LogOut, Loader2, KeyRound, UserPlus,
  ImagePlus, FileText, ChevronDown, ChevronUp, ChevronRight, Download, AlertCircle, Play, Square, Repeat, Tag, GripVertical, Link, LayoutList, LayoutGrid, BarChart3, LayoutDashboard, Activity, Palette, Maximize
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ─── TYPES ──────────────────────────────────────────────────────────────────
type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type TaskType = "BOSS_TASK" | "CLIENT_WORK" | "GRAPHIC" | "MOTION" | "SOCIAL";
type Status = "TODO" | "IN_PROGRESS" | "COMPLETED";

interface Step {
  id: string;
  name: string;
  isDone: boolean;
}

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
  steps?: Step[];
  images?: string[];
  timeSpent?: number;
  isTimerRunning?: boolean;
  timerStartedAt?: string;
  recurrence?: "NONE" | "WEEKLY" | "MONTHLY";
  tags?: string[];
  completedAt?: string;
}

interface UserSession {
  email: string;
  name: string;
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
  const [user, setUser]             = useState<UserSession | null>(null);
  const [tasks, setTasks]           = useState<Task[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [isBossMode, setIsBossMode] = useState(false);
  const [showAuth, setShowAuth]     = useState(false);
  const [password, setPassword]     = useState("");
  const [authErr, setAuthErr]       = useState("");
  const [showForm, setShowForm]     = useState(false);
  const [filter, setFilter]         = useState<Status | "ALL">("ALL");
  const [isSaving, setIsSaving]     = useState(false);
  const [hour, setHour]             = useState(new Date().getHours());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dueTasks, setDueTasks]     = useState<Task[]>([]);
  const [showDueModal, setShowDueModal] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"LIST" | "KANBAN">("LIST");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Custom Authentication Forms State
  const [authTab, setAuthTab]       = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail]   = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName]     = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMsg, setAuthMsg]       = useState("");

  const [form, setForm] = useState<{
    title: string; client: string; description: string; priority: Priority; type: TaskType; status: Status; deadline: string;
    steps: Step[]; images: string[];
    recurrence: "NONE" | "WEEKLY" | "MONTHLY"; tags: string[];
  }>({
    title: "", client: "", description: "", priority: "HIGH", type: "BOSS_TASK", status: "TODO", deadline: "", steps: [], images: [], recurrence: "NONE", tags: []
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
        if (Array.isArray(d)) {
          let updatedD = [...d];
          let modified = false;
          const now = Date.now();
          
          updatedD.forEach(t => {
            if (t.status === "COMPLETED" && t.recurrence && t.recurrence !== "NONE" && t.completedAt) {
              const diffDays = (now - new Date(t.completedAt).getTime()) / 86400000;
              if ((t.recurrence === "WEEKLY" && diffDays >= 7) || (t.recurrence === "MONTHLY" && diffDays >= 30)) {
                // Auto duplicate
                modified = true;
                t.recurrence = "NONE"; // Remove recurrence from old so it doesn't duplicate again
                const nt: Task = { 
                  ...t, 
                  id: `task_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
                  status: "TODO",
                  createdAt: new Date().toISOString(),
                  completedAt: undefined,
                  timeSpent: 0,
                  isTimerRunning: false,
                  timerStartedAt: undefined,
                  recurrence: t.recurrence === "NONE" ? "NONE" : (diffDays >= 30 ? "MONTHLY" : "WEEKLY") // Keep new one recurring
                };
                updatedD.push(nt);
              }
            }
          });
          
          if (modified) {
            saveTasks(updatedD);
          }
          setTasks(updatedD);
          const due = d.filter(t => {
            if (t.status === "COMPLETED" || !t.deadline) return false;
            const diff = Math.ceil((new Date(t.deadline).getTime() - Date.now()) / 86400000);
            return diff <= 1;
          });
          if (due.length > 0 && !sessionStorage.getItem("due_alert_shown")) {
            setDueTasks(due);
            setShowDueModal(true);
            sessionStorage.setItem("due_alert_shown", "true");
          }
        }
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

  // Custom Sign Up / Login Submit Handler
  const handleCustomAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMsg("");

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthMsg("সবগুলো তথ্য সঠিকভাবে পূরণ করুন।");
      return;
    }

    if (!authEmail.trim().toLowerCase().endsWith("@gmail.com")) {
      setAuthMsg("শুধুমাত্র @gmail.com ইমেইল অ্যাড্রেস অনুমোদিত!");
      return;
    }

    if (authTab === "signup" && (!authName || !authName.trim())) {
      setAuthMsg("দয়া করে আপনার নাম লিখুন।");
      return;
    }

    setAuthLoading(true);
    try {
      const res = await fetch("/api/auth/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: authTab,
          name: authName,
          email: authEmail,
          password: authPassword
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (authTab === "signup") {
          setAuthMsg("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! এখন লগইন করুন।");
          setAuthTab("login");
          setAuthPassword("");
        } else {
          setUser(data.user);
          localStorage.setItem("workspace_user", JSON.stringify(data.user));
          setAuthMsg("");
        }
      } else {
        setAuthMsg(data.error || "অথেন্টিকেশন ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error(err);
      setAuthMsg("সার্ভারে সংযোগ করা যাচ্ছে না।");
    } finally {
      setAuthLoading(false);
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
      setForm({ title: "", client: "", description: "", priority: "HIGH", type: "BOSS_TASK", status: "TODO", deadline: "", steps: [], images: [], recurrence: "NONE", tags: [] });
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const previousTasks = [...tasks];
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated); // Optimistic Update
    const success = await saveTasks(updated);
    if (!success) setTasks(previousTasks);
  };

  const handleStatus = async (task: Task, s: Status) => {
    const previousTasks = [...tasks];
    const updated = tasks.map(t => {
      if (t.id === task.id) {
        if (task.isTimerRunning && s === "COMPLETED") {
           const start = new Date(task.timerStartedAt || new Date().toISOString()).getTime();
           const elapsedSecs = Math.floor((new Date().getTime() - start) / 1000);
           return { ...t, status: s, isTimerRunning: false, timeSpent: (t.timeSpent || 0) + elapsedSecs, timerStartedAt: undefined, completedAt: s === "COMPLETED" ? new Date().toISOString() : undefined };
        }
        return { ...t, status: s, completedAt: s === "COMPLETED" ? new Date().toISOString() : undefined };
      }
      return t;
    });
    setTasks(updated); // Optimistic Update
    const success = await saveTasks(updated);
    if (!success) setTasks(previousTasks);
  };

  const openEdit = (task: Task) => {
    setForm({ title: task.title, client: task.client, description: task.description || "", priority: task.priority, type: task.type, status: task.status, deadline: task.deadline || "", steps: task.steps || [], images: task.images || [], recurrence: task.recurrence || "NONE", tags: task.tags || [] });
    setEditingTask(task);
    setShowForm(true);
  };


  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
  };

  const getActiveTime = (task: Task) => {
    if (!task.isTimerRunning || !task.timerStartedAt) return task.timeSpent || 0;
    const start = new Date(task.timerStartedAt).getTime();
    return (task.timeSpent || 0) + Math.floor((Date.now() - start) / 1000);
  };

  const toggleTimer = async (task: Task) => {
    const now = new Date().toISOString();
    let updatedTasks: Task[];
    if (task.isTimerRunning) {
      const start = new Date(task.timerStartedAt || now).getTime();
      const elapsedSecs = Math.floor((new Date().getTime() - start) / 1000);
      updatedTasks = tasks.map(t => t.id === task.id ? { ...t, isTimerRunning: false, timeSpent: (t.timeSpent || 0) + elapsedSecs, timerStartedAt: undefined } : t);
    } else {
      updatedTasks = tasks.map(t => t.id === task.id ? { ...t, isTimerRunning: true, timerStartedAt: now } : t);
    }
    
    const previousTasks = [...tasks];
    setTasks(updatedTasks);
    const success = await saveTasks(updatedTasks);
    if (!success) setTasks(previousTasks);
  };

  const shareTask = (task: Task) => {
    const payload = btoa(JSON.stringify({ email: user?.email, taskId: task.id }));
    const link = `${window.location.origin}/workspace/share/${payload}`;
    navigator.clipboard.writeText(link);
    alert("Client Portal link copied to clipboard!");
  };

  const handleStepToggle = async (task: Task, stepId: string) => {
    const previousTasks = [...tasks];
    const updated = tasks.map(t => t.id === task.id ? {
      ...t,
      steps: t.steps?.map(s => s.id === stepId ? { ...s, isDone: !s.isDone } : s)
    } : t);
    setTasks(updated); // Optimistic Update
    const success = await saveTasks(updated);
    if (!success) setTasks(previousTasks);
  };

  const generatePDF = async () => {
    setPdfGenerating(true);
    try {
      const today = new Date().toLocaleDateString();
      const completedToday = tasks.filter(t => t.status === "COMPLETED");
      
      const el = document.createElement("div");
      el.style.padding = "40px";
      el.style.width = "800px";
      el.style.background = "#fff";
      el.style.fontFamily = "sans-serif";
      el.style.color = "#333";
      
      let html = `
        <h1 style="color: #ea3f40; border-bottom: 2px solid #eee; padding-bottom: 10px;">Antor Creative Studio - Daily Report</h1>
        <p style="color: #666; font-size: 12px; margin-bottom: 30px;">Date: ${today}</p>
        <h3 style="margin-bottom: 15px;">Completed Tasks (${completedToday.length})</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr style="background: #f9f9f9;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Task</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Client</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Type</th>
          </tr>
      `;
      
      completedToday.forEach(t => {
        html += `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${t.title}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${t.client || "Studio"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${t.type}</td>
          </tr>
        `;
      });
      html += `</table><p style="margin-top: 30px; font-size: 10px; color: #aaa; text-align: center;">Generated automatically by Antor Workspace</p>`;
      
      el.innerHTML = html;
      document.body.appendChild(el);
      
      const canvas = await html2canvas(el, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ACS_Daily_Report_${today.replace(/\//g, "-")}.pdf`);
      document.body.removeChild(el);
    } catch (e) {
      console.error(e);
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setForm(p => ({ ...p, images: [...(p.images || []), base64] }));
      };
      reader.readAsDataURL(file);
    });
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


        
          const renderTaskCard = (task: Task, idx: number) => {
    const tm = TYPE_META[task.type];
                const pm = PRIORITY_META[task.priority];
                const TIcon = tm.icon;
                const isHero = task.id === heroTask?.id;
                const dl = formatDeadline(task.deadline);

                
    return (
      <motion.div key={task.id} 
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: idx * 0.04 }}
                    draggable
                    onDragStart={(e) => setDraggedTaskId(task.id)}
                    className={`group relative bg-white rounded-2xl border p-5 transition-all duration-300 cursor-grab active:cursor-grabbing ${
                      task.status === "COMPLETED"
                        ? "opacity-60 border-gray-100 shadow-sm"
                        : isHero ? "border-[#ea3f40]/30 shadow-md" : "border-gray-100/50 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#ea3f40]/30"
                    }`}
                    style={isHero && task.status !== "COMPLETED" ? { boxShadow: `0 0 20px rgba(234,63,64,0.15)` } : {}}>

                    {/* Hero dot indicator */}
                    {isHero && task.status !== "COMPLETED" && (
                      <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full animate-ping bg-[#ea3f40]" />
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
                      {/* Visual Progress Bar */}
                      {task.steps && task.steps.length > 0 && (
                        <div className="w-full bg-gray-100 rounded-full h-1 mt-1 overflow-hidden">
                          <div className="bg-emerald-400 h-1 transition-all duration-500" style={{ width: `${(task.steps.filter(s => s.isDone).length / task.steps.length) * 100}%` }} />
                        </div>
                      )}


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
                      {/* Tags & Timer & Share */}
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex gap-1 flex-wrap">
                          {task.tags?.map(tag => (
                            <span key={tag} className="text-[8px] font-bold uppercase tracking-widest text-brand-red bg-brand-red/5 border border-brand-red/10 px-1.5 py-0.5 rounded-md">
                              {tag}
                            </span>
                          ))}
                          {task.recurrence && task.recurrence !== "NONE" && (
                            <span className="text-[8px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              <Repeat size={8} /> {task.recurrence}
                            </span>
                          )}
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      {/* Steps & Images Preview */}
                      {(task.steps?.length || task.images?.length) ? (
                        <div className="pt-2 border-t border-gray-100">
                          <button onClick={() => setExpandedTasks(p => ({ ...p, [task.id]: !p[task.id] }))}
                            className="flex items-center justify-between w-full text-[10px] font-bold text-gray-500 hover:text-gray-800 transition-colors">
                            <span className="flex items-center gap-2">
                              {task.steps && task.steps.length > 0 && <span>{task.steps.filter(s => s.isDone).length}/{task.steps.length} Steps</span>}
                              {task.images && task.images.length > 0 && <span className="flex items-center gap-1"><ImageIcon size={10} /> {task.images.length}</span>}
                            </span>
                            {expandedTasks[task.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                          
                          <AnimatePresence>
                            {expandedTasks[task.id] && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="py-3 space-y-3">
                                  {task.steps && task.steps.length > 0 && (
                                    <div className="space-y-1.5">
                                      {task.steps.map(step => (
                                        <label key={step.id} className="flex items-center gap-2 cursor-pointer group">
                                          <input type="checkbox" checked={step.isDone} onChange={() => handleStepToggle(task, step.id)}
                                            className="w-3 h-3 rounded border-gray-300 text-brand-red focus:ring-brand-red cursor-pointer" />
                                          <span className={`text-[11px] ${step.isDone ? "text-gray-400 line-through" : "text-gray-700 group-hover:text-black"}`}>{step.name}</span>
                                        </label>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {task.images && task.images.length > 0 && (
                                    <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                                      {task.images.map((img, i) => (
                                        <img key={i} src={img} alt="Ref" className="h-12 w-auto object-cover rounded-lg border border-gray-200 shrink-0 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.open(img, "_blank")} />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : null}

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
                        <button onClick={() => openEdit(task)}
                          className="p-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all cursor-pointer">
                          <Edit3 size={9} />
                        </button>
                        <button onClick={() => handleDelete(task.id)}
                          className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer">
                          <Trash2 size={9} />
                        </button>
                        <button onClick={() => shareTask(task)} className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-500 hover:bg-blue-100 transition-all cursor-pointer" title="Client Link">
                          <Link size={9} />
                        </button>
                      </div>
                    </div>
                   </motion.div>
    );
  };
        
        
  // ─── UNAUTHENTICATED RENDER (GMAIL LOG IN / REGISTER COMPONENT) ───────────────
  if (!user) {
    return (
      <div className={`min-h-screen ${theme.pageBg} flex flex-col justify-center items-center p-6 antialiased text-gray-800`}>
        <div className="absolute top-4 left-6">
          <a href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-gray-400 text-xs font-bold text-gray-600 hover:text-gray-900 transition-all shadow-sm">
            <Home size={12} /> Home
          </a>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white border border-gray-100 rounded-[2rem] shadow-2xl p-8 relative overflow-hidden"
        >
          {/* Decorative backdrop glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 text-center mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto bg-brand-red/5 text-brand-red border border-brand-red/10">
              <Lock size={22} className="animate-pulse" />
            </div>
            <h1 className="text-xl md:text-2xl font-black font-serif tracking-tight text-gray-900 leading-tight">
              Antor Workspace
            </h1>
            <p className="text-[10px] text-muted leading-relaxed max-w-xs mx-auto">
              অন্তরের তৈরি workspace টি ব্যবহার করতে আপনার জিমেইল দিয়ে লগিন করুন।
            </p>
          </div>

          {/* Form Tabs */}
          <div className="flex bg-gray-50 border border-gray-100 p-1 rounded-2xl mb-6">
            <button
              onClick={() => { setAuthTab("login"); setAuthMsg(""); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === "login" 
                  ? "bg-white text-brand-red shadow-sm border border-gray-100" 
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <KeyRound size={12} /> লগইন করুন
            </button>
            <button
              onClick={() => { setAuthTab("signup"); setAuthMsg(""); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === "signup" 
                  ? "bg-white text-brand-red shadow-sm border border-gray-100" 
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <UserPlus size={12} /> অ্যাকাউন্ট খুলুন
            </button>
          </div>

          {/* Error & Success Messages */}
          {authMsg && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-4 rounded-2xl text-xs font-bold mb-5 flex items-start gap-2.5 ${
                authMsg.includes("সফলভাবে") || authMsg.includes("তৈরি হয়েছে")
                  ? "bg-emerald-50 border border-emerald-100 text-emerald-600"
                  : "bg-red-50 border border-red-100 text-red-600"
              }`}
            >
              <ShieldAlert size={15} className="shrink-0 mt-0.5" />
              <span>{authMsg}</span>
            </motion.div>
          )}

          {/* Form inputs */}
          <form onSubmit={handleCustomAuthSubmit} className="space-y-4">
            {authTab === "signup" && (
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">আপনার নাম *</label>
                <input 
                  type="text" 
                  required 
                  value={authName} 
                  onChange={e => setAuthName(e.target.value)}
                  placeholder="যেমন: অন্তর কুমার বিশ্বাস"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder:text-gray-300 focus:border-gray-400 outline-none" 
                />
              </div>
            )}

            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">জিমেইল অ্যাড্রেস *</label>
              <input 
                type="email" 
                required 
                value={authEmail} 
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="যেমন: user@gmail.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder:text-gray-300 focus:border-gray-400 outline-none font-mono" 
              />
            </div>

            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">পাসওয়ার্ড *</label>
              <input 
                type="password" 
                required 
                value={authPassword} 
                onChange={e => setAuthPassword(e.target.value)}
                placeholder="আপনার গোপন পাসওয়ার্ড দিন"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder:text-gray-300 focus:border-gray-400 outline-none" 
              />
            </div>

            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full py-3.5 bg-brand-red hover:bg-blood-red text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-xs tracking-wider uppercase disabled:opacity-50 cursor-pointer"
            >
              {authLoading ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  প্রসেসিং হচ্ছে...
                </>
              ) : authTab === "login" ? (
                <>
                  লগইন করুন <ArrowRight size={13} />
                </>
              ) : (
                <>
                  অ্যাকাউন্ট তৈরি করুন <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }


  // Dashboard Metrics Calculation
  const now = new Date();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  
  const tasksCompletedThisWeek = tasks.filter(t => t.status === "COMPLETED" && t.completedAt && new Date(t.completedAt) >= startOfWeek).length;
  const activeProjects = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const totalTimeLoggedSecs = tasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0);
  const totalHoursLogged = (totalTimeLoggedSecs / 3600).toFixed(1);
  const dueTodayTasks = tasks.filter(t => {
    if (t.status === "COMPLETED" || !t.deadline) return false;
    const dl = new Date(t.deadline);
    return dl.getDate() === now.getDate() && dl.getMonth() === now.getMonth() && dl.getFullYear() === now.getFullYear();
  }).length;

  // Chart Data Calculation
  const chartData = Array.from({length: 7}).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
    const count = tasks.filter(t => t.status === "COMPLETED" && t.completedAt && new Date(t.completedAt).toDateString() === d.toDateString()).length;
    return { day: d.toLocaleDateString('en-US', {weekday: 'short'}), count };
  });
  const maxChartCount = Math.max(...chartData.map(d => d.count), 1); // Avoid div by 0

  // ─── AUTHENTICATED COMMAND CENTER RENDER ─────────────────────────────────────
  return (
    <div className={`min-h-screen ${theme.pageBg} text-gray-800 antialiased flex flex-col lg:flex-row max-w-[1600px] mx-auto`}>

      {/* ── SIDEBAR (DESIGNER TOOLKIT) ── */}
      <aside className="w-full lg:w-72 shrink-0 border-r border-white/20 flex flex-col h-screen sticky top-0 bg-white/80 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.05)] z-50">
        <div className="p-6 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ea3f40] to-[#bba28a] flex items-center justify-center text-white shadow-lg shadow-[#ea3f40]/20">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 leading-none">Workspace</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Creative Command</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#ea3f40] to-[#bba28a] text-white font-bold text-sm transition-all shadow-lg shadow-[#ea3f40]/25 hover:shadow-xl hover:scale-[1.02]">
              <Target size={16} /> My Tasks
            </button>
            <button onClick={() => { localStorage.removeItem("workspaceToken"); setUser(null); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-bold text-sm transition-all mt-4 border border-red-100 hover:border-red-200">
              <LogOut size={16} /> Log Out
            </button>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Palette size={12} /> Brand Colors
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {["#000000", "#FFFFFF", "#FF3B30", "#007AFF", "#34C759", "#FF9500", "#AF52DE", "#5856D6"].map(c => (
                <button key={c} onClick={() => { navigator.clipboard.writeText(c); alert(`Copied ${c}`) }} 
                  className="aspect-square rounded-lg border border-gray-100 shadow-sm hover:scale-110 transition-transform cursor-pointer relative group"
                  style={{ backgroundColor: c }}>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Maximize size={12} /> Aspect Ratios
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono font-bold text-gray-500">
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors cursor-pointer">16:9<br/><span className="text-[8px] text-gray-400">1920x1080</span></div>
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors cursor-pointer">9:16<br/><span className="text-[8px] text-gray-400">1080x1920</span></div>
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors cursor-pointer">1:1<br/><span className="text-[8px] text-gray-400">1080x1080</span></div>
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors cursor-pointer">4:5<br/><span className="text-[8px] text-gray-400">1080x1350</span></div>
            </div>
          </div>
          
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Link size={12} /> Quick Assets
            </h3>
            <div className="space-y-2">
              <a href="https://freepik.com" target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-gray-100/50 hover:bg-white hover:border-[#ea3f40]/30 hover:shadow-md hover:text-[#ea3f40] text-xs font-bold text-gray-700 transition-all group">Freepik <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/></a>
              <a href="https://elements.envato.com" target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-gray-100/50 hover:bg-white hover:border-[#ea3f40]/30 hover:shadow-md hover:text-[#ea3f40] text-xs font-bold text-gray-700 transition-all group">Envato <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/></a>
              <a href="https://pinterest.com" target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-gray-100/50 hover:bg-white hover:border-[#ea3f40]/30 hover:shadow-md hover:text-[#ea3f40] text-xs font-bold text-gray-700 transition-all group">Pinterest <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/></a>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto custom-scrollbar">

        {/* ── TOP BAR (Now inside main) ── */}
      <header className={`sticky top-0 z-40 ${theme.headerBg} backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]`}>
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
              <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-700 text-[10px] font-black tracking-wider">
                🔴 {stats.critical} Critical
              </motion.div>
            )}

            {/* Profile Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center text-[9px] font-black border border-brand-red/5">
                {user.name.charAt(0).toUpperCase()}
              </div>
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

        {/* DASHBOARD STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors duration-500"></div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 relative z-10"><CheckCircle2 size={18}/></div>
            <p className="text-3xl font-black text-gray-900 font-mono relative z-10">{tasksCompletedThisWeek}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 relative z-10">Done This Week</p>
          </div>
          <div className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors duration-500"></div>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 relative z-10"><Activity size={18}/></div>
            <p className="text-3xl font-black text-gray-900 font-mono relative z-10">{activeProjects}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 relative z-10">Active Tasks</p>
          </div>
          <div className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full blur-2xl group-hover:bg-purple-100 transition-colors duration-500"></div>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 relative z-10"><Clock size={18}/></div>
            <p className="text-3xl font-black text-gray-900 font-mono relative z-10">{totalHoursLogged}<span className="text-lg text-gray-400">h</span></p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 relative z-10">Time Logged</p>
          </div>
          <div className="group bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
             <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-50 rounded-full blur-2xl group-hover:bg-red-100 transition-colors duration-500"></div>
            <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4 relative z-10"><AlertCircle size={18}/></div>
            <p className="text-3xl font-black text-gray-900 font-mono relative z-10">{dueTodayTasks}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 relative z-10">Due Today</p>
          </div>
        </div>

        {/* PRODUCTIVITY CHART */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-8">
             <div>
               <h3 className="text-lg font-black text-gray-900">Productivity</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Tasks Completed (Last 7 Days)</p>
             </div>
             <BarChart3 className="text-gray-300" size={24} />
           </div>
           
           <div className="h-40 flex items-end justify-between gap-2 sm:gap-4 px-2">
             {chartData.map((d, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-3">
                 <div className="w-full relative flex-1 flex items-end justify-center">
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: `${(d.count / maxChartCount) * 100}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                      className={`w-full max-w-[40px] rounded-t-xl relative group transition-all duration-300 ${d.count > 0 ? "bg-gradient-to-t from-[#ea3f40]/80 to-[#bba28a]/80 hover:from-[#ea3f40] hover:to-[#bba28a] shadow-[0_0_15px_rgba(234,63,64,0.3)]" : "bg-gray-100"}`}>
                        {d.count > 0 && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded-lg pointer-events-none z-10">
                            {d.count}
                          </div>
                        )}
                    </motion.div>
                 </div>
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d.day}</span>
               </div>
             ))}
           </div>
        </div>



        {/* ── GREETING ── */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <ThemeIcon size={14} className={theme.iconClass} />
            <span className={`text-xs font-black tracking-widest uppercase ${theme.accentText}`}>{theme.name}</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">{theme.greeting}</p>
        </div>

        {/* ── HERO MISSION CARD ── */}
        <AnimatePresence mode="wait">
          {heroTask ? (() => {
            const hpm = PRIORITY_META[heroTask.priority];
            const htm = TYPE_META[heroTask.type];
            const hdl = formatDeadline(heroTask.deadline);
            const HTypeIcon = htm.icon;
            return (
              <motion.div key={heroTask.id}
                initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                className="relative bg-white rounded-[2rem] shadow-2xl border border-gray-100/50 overflow-hidden group hover:shadow-[0_20px_60px_rgba(234,63,64,0.15)] transition-shadow duration-500"
              >
                {/* Color accent strip */}
                <div className="h-2 w-full bg-gradient-to-r from-[#ea3f40] to-[#bba28a]" />
                
                {/* Decorative background glow */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br from-[#ea3f40]/5 to-[#bba28a]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#ea3f40]/10 transition-colors duration-700" />

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
                  <div className="flex items-center gap-3 pt-2 flex-wrap relative z-10">
                    {heroTask.status !== "IN_PROGRESS" && heroTask.status !== "COMPLETED" && (
                      <button onClick={() => handleStatus(heroTask, "IN_PROGRESS")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer text-white bg-gradient-to-r from-[#ea3f40] to-[#bba28a]">
                        <Zap size={14} /> Start Working
                      </button>
                    )}
                    {heroTask.status !== "COMPLETED" && (
                      <button onClick={() => handleStatus(heroTask, "COMPLETED")}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer">
                        <CheckCircle2 size={12} /> Mark Done
                      </button>
                    )}
                    <button onClick={() => openEdit(heroTask)}
                      className="p-2 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-400 text-gray-400 hover:text-gray-700 transition-all cursor-pointer">
                      <Edit3 size={12} />
                    </button>
                    <button onClick={() => handleDelete(heroTask.id)}
                      className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })() : (
            <motion.div key="empty-hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center space-y-3">
              <CheckCircle2 size={40} className="mx-auto text-emerald-500" />
              <h2 className="text-xl font-black font-serif text-gray-800">সব কাজ শেষ! 🎉</h2>
              <p className="text-xs text-gray-400 font-mono">No pending missions. The studio is clear.</p>
            </motion.div>
          )}
        </AnimatePresence>

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
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 mr-2 shadow-sm">
              <button onClick={() => setViewMode("LIST")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "LIST" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}><LayoutList size={14}/></button>
              <button onClick={() => setViewMode("KANBAN")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "KANBAN" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}><LayoutGrid size={14}/></button>
            </div>
            <div className="w-px h-6 bg-gray-200 mr-2" />
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

          <button onClick={() => { setEditingTask(null); setForm({ title: "", client: "", description: "", priority: "HIGH", type: "BOSS_TASK", status: "TODO", deadline: "", steps: [], images: [], recurrence: "NONE", tags: [] }); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg shadow-[#ea3f40]/20 transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-[#ea3f40] to-[#bba28a]">
            <Plus size={14} /> Add Task
          </button>
        </div>

        {/* ── TASK GRID ── */}
        <div className="pb-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-gray-400 font-mono text-xs border border-gray-100 rounded-2xl bg-white shadow-sm">
              <Loader2 className="animate-spin text-brand-red mr-2" size={16} />
              লোডিং হচ্ছে...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 font-mono text-xs border border-gray-100 rounded-2xl bg-white shadow-sm">
              কোনো টাস্ক নেই — নতুন টাস্ক যোগ করো!
            </div>
          ) : viewMode === "KANBAN" ? (
             <div className="flex gap-4 overflow-x-auto pb-8 items-start custom-scrollbar">
               {(["TODO", "IN_PROGRESS", "COMPLETED"] as Status[]).map(colStatus => (
                 <div key={colStatus} className="flex-1 min-w-[300px] max-w-[350px] bg-gray-50/50 rounded-2xl p-4 border border-gray-100 shrink-0"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={async (e) => {
                        e.preventDefault();
                        if (draggedTaskId) {
                          const task = tasks.find(t => t.id === draggedTaskId);
                          if (task && task.status !== colStatus) {
                            await handleStatus(task, colStatus);
                          }
                          setDraggedTaskId(null);
                        }
                      }}
                 >
                   <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4 flex items-center justify-between">
                     {colStatus.replace("_", " ")}
                     <span className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-gray-100 text-[10px] text-gray-600">
                        {filtered.filter(t => t.status === colStatus).length}
                     </span>
                   </h3>
                   <div className="space-y-3">
                      <AnimatePresence>
                        {filtered.filter(t => t.status === colStatus).map((task, idx) => renderTaskCard(task, idx))}
                      </AnimatePresence>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filtered.map((task, idx) => renderTaskCard(task, idx))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      </main>

      {/* ── BOSS AUTH MODAL ── */}
      <AnimatePresence>
        {showAuth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── ADD / EDIT TASK MODAL ── */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
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

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "রিপিট", key: "recurrence", opts: [["NONE","একবার (None)"],["WEEKLY","প্রতি সপ্তাহে"],["MONTHLY","প্রতি মাসে"]] },
                  ].map(({ label, key, opts }) => (
                    <div key={key}>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{label}</label>
                      <select value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2.5 text-[10px] text-gray-800 focus:border-gray-400 outline-none font-bold">
                        {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                  <div className="col-span-3">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">ট্যাগস (কমা দিয়ে লিখুন)</label>
                    <input type="text" value={form.tags.join(", ")} onChange={e => setForm(p => ({ ...p, tags: e.target.value.split(",").map(t => t.trim()).filter(t => t) }))}
                      placeholder="e.g. #Urgent, #Missing_Assets"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:border-gray-400 outline-none" />
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
                
                {/* Steps Configurator */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400">কাজের ধাপসমূহ</label>
                    <div className="flex gap-1">
                      {["Concept", "Layout", "Design Process", "Review", "Final"].map(s => (
                        <button key={s} type="button" onClick={() => setForm(p => ({ ...p, steps: [...p.steps, { id: Math.random().toString(), name: s, isDone: false }] }))}
                          className="px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded text-[9px] font-bold cursor-pointer transition-colors">
                          +{s}
                        </button>
                      ))}
                    </div>
                  </div>
                  {form.steps.length > 0 && (
                    <div className="space-y-1.5 mb-2 bg-gray-50 border border-gray-100 rounded-xl p-3">
                      {form.steps.map((step, i) => (
                        <div key={step.id} className="flex items-center gap-2">
                          <input type="text" value={step.name} onChange={e => {
                            const newSteps = [...form.steps];
                            newSteps[i].name = e.target.value;
                            setForm(p => ({ ...p, steps: newSteps }));
                          }} className="flex-1 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-800 outline-none" />
                          <button type="button" onClick={() => setForm(p => ({ ...p, steps: p.steps.filter(s => s.id !== step.id) }))} className="text-red-400 hover:text-red-600 cursor-pointer p-1">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button type="button" onClick={() => setForm(p => ({ ...p, steps: [...p.steps, { id: Math.random().toString(), name: "New Step", isDone: false }] }))}
                    className="w-full py-2 border border-dashed border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all">
                    + Add Custom Step
                  </button>
                </div>
                
                {/* Image Upload */}
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">রেফারেন্স ছবি যুক্ত করুন</label>
                  <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors relative overflow-hidden">
                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                      <ImagePlus size={16} className="text-gray-400 mb-1" />
                      <p className="text-[10px] text-gray-500 font-bold">Click to Upload Images</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                  </label>
                  {form.images.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto pb-2 custom-scrollbar">
                      {form.images.map((img, i) => (
                        <div key={i} className="relative shrink-0 group">
                          <img src={img} alt="preview" className="h-16 w-16 object-cover rounded-xl border border-gray-200" />
                          <button type="button" onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" disabled={isSaving}
                  className="w-full py-3 rounded-xl font-black text-sm text-white transition-all disabled:opacity-50 shadow-md hover:opacity-90 cursor-pointer"
                  style={{ background: theme.accent }}>
                  {isSaving ? "সেভ হচ্ছে..." : editingTask ? "✓ আপডেট করুন" : "✓ টাস্ক যোগ করুন"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DUE TASKS MODAL ── */}
      <AnimatePresence>
        {showDueModal && dueTasks.length > 0 && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl space-y-6 relative overflow-hidden border border-red-100">
              
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-500" />
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                    <AlertCircle size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl font-serif text-gray-900">Attention Required</h3>
                    <p className="text-xs text-red-500 font-bold tracking-wide">You have {dueTasks.length} task(s) due soon!</p>
                  </div>
                </div>
                <button onClick={() => setShowDueModal(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {dueTasks.map(t => (
                  <div key={t.id} className="p-4 rounded-xl border border-red-100 bg-red-50/30 flex justify-between items-center gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 leading-tight">{t.title}</h4>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">{t.client || "Studio"}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-600 text-[10px] font-black tracking-widest flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                      <Clock size={10} />
                      {t.deadline ? (Math.ceil((new Date(t.deadline).getTime() - Date.now())/86400000) === 0 ? "TODAY" : "TOMORROW") : ""}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setShowDueModal(false)}
                className="w-full py-3.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm transition-colors shadow-lg active:scale-[0.98]">
                Let's Get to Work! 🚀
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
