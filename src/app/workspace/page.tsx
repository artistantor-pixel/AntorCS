"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Share2, Upload, Star, Trash2, Calendar, Send, User, Menu,
  Plus, MoreHorizontal, ArrowLeft, Loader2, Lock, ShieldAlert,
  KeyRound, UserPlus, ArrowRight, CheckCircle2, Home, RotateCcw,
  Edit3, LogOut, Link, ImageIcon, X, ImagePlus
} from "lucide-react";

// ─── TYPES ──────────────────────────────────────────────────────────────────
type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type TaskType = "BOSS_TASK" | "CLIENT_WORK" | "GRAPHIC" | "MOTION" | "SOCIAL";
type Status = "TODO" | "IN_PROGRESS" | "COMPLETED";

interface Step { id: string; name: string; isDone: boolean; }
interface Task {
  id: string; title: string; client: string; description?: string;
  priority: Priority; type: TaskType; status: Status; deadline?: string;
  createdAt: string; steps?: Step[]; images?: string[];
  timeSpent?: number; isTimerRunning?: boolean; timerStartedAt?: string;
  recurrence?: "NONE" | "WEEKLY" | "MONTHLY"; tags?: string[]; completedAt?: string;
}
interface UserSession { email: string; name: string; }

// ─── STYLING ─────────────────────────────────────────────────────────────────
const THEMES: Record<TaskType, { bg: string; text: string; line: string }> = {
  BOSS_TASK:   { bg: "bg-[#f2e205]", text: "text-gray-900", line: "bg-gray-900" }, // Bright Yellow
  CLIENT_WORK: { bg: "bg-[#dbd5f8]", text: "text-gray-900", line: "bg-gray-900" }, // Soft Purple
  GRAPHIC:     { bg: "bg-[#f3ccfa]", text: "text-gray-900", line: "bg-gray-900" }, // Soft Pink
  MOTION:      { bg: "bg-[#f4f4f4]", text: "text-gray-900", line: "bg-gray-300" }, // Light Gray
  SOCIAL:      { bg: "bg-white border border-gray-200", text: "text-gray-900", line: "bg-gray-200" }, // White
};

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
  const [isSaving, setIsSaving]     = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Custom Authentication Forms State
  const [authTab, setAuthTab]       = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail]   = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName]     = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMsg, setAuthMsg]       = useState("");

  const [form, setForm] = useState<{
    title: string; client: string; description: string; priority: Priority; type: TaskType; status: Status; deadline: string;
    steps: Step[]; images: string[]; recurrence: "NONE" | "WEEKLY" | "MONTHLY"; tags: string[];
  }>({
    title: "", client: "", description: "", priority: "HIGH", type: "BOSS_TASK", status: "TODO", deadline: "", steps: [], images: [], recurrence: "NONE", tags: []
  });

  // Restore session
  useEffect(() => {
    const stored = localStorage.getItem("workspace_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) setUser(parsed);
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleLogout = () => {
    setUser(null); setTasks([]); localStorage.removeItem("workspace_user");
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
    } catch (e) { console.error(e); } 
    finally { setIsLoading(false); }
  }, [user?.email]);

  useEffect(() => { if (user?.email) fetchTasks(); }, [user?.email, fetchTasks]);

  const saveTasks = async (updated: Task[]) => {
    if (!user?.email) return false;
    const res = await fetch(`/api/calendar?email=${encodeURIComponent(user.email)}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated)
    });
    return res.ok;
  };

  // Auth Handlers
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "boss123") { setIsBossMode(true); setShowAuth(false); setAuthErr(""); setPassword(""); } 
    else { setAuthErr("ভুল পাসওয়ার্ড!"); }
  };

  const handleCustomAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMsg(""); setAuthLoading(true);
    try {
      const res = await fetch("/api/auth/custom", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: authTab, name: authName, email: authEmail, password: authPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (authTab === "signup") {
          setAuthMsg("Account created! Please login."); setAuthTab("login"); setAuthPassword("");
        } else {
          setUser(data.user); localStorage.setItem("workspace_user", JSON.stringify(data.user));
        }
      } else { setAuthMsg(data.error || "Authentication failed."); }
    } catch (err) { setAuthMsg("Connection error."); } 
    finally { setAuthLoading(false); }
  };

  // Task Actions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setIsSaving(true);
    let updated: Task[];
    if (editingTask) {
      updated = tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...form } : t);
    } else {
      updated = [{ id: `task_${Date.now()}`, ...form, createdAt: new Date().toISOString() }, ...tasks];
    }
    if (await saveTasks(updated)) {
      setTasks(updated); setShowForm(false); setEditingTask(null);
      setForm({ title: "", client: "", description: "", priority: "HIGH", type: "BOSS_TASK", status: "TODO", deadline: "", steps: [], images: [], recurrence: "NONE", tags: [] });
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const previous = [...tasks];
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    if (!(await saveTasks(updated))) setTasks(previous);
  };

  const handleStatus = async (task: Task, s: Status) => {
    const previous = [...tasks];
    const updated = tasks.map(t => t.id === task.id ? { ...t, status: s, completedAt: s === "COMPLETED" ? new Date().toISOString() : undefined } : t);
    setTasks(updated);
    if (!(await saveTasks(updated))) setTasks(previous);
  };

  const openEdit = (task: Task) => {
    setForm({ title: task.title, client: task.client, description: task.description || "", priority: task.priority, type: task.type, status: task.status, deadline: task.deadline || "", steps: task.steps || [], images: task.images || [], recurrence: task.recurrence || "NONE", tags: task.tags || [] });
    setEditingTask(task); setShowForm(true);
  };

  // ─── UNAUTHENTICATED RENDER ───────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-[#e2e4e9] flex flex-col justify-center items-center p-6 antialiased font-sans">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#faf9f6] rounded-[2rem] shadow-xl p-10 space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Antor Creative Studio</h1>
            <p className="text-xs text-gray-500">Workspace Authentication</p>
          </div>
          <div className="flex bg-gray-200/50 p-1 rounded-2xl mb-6">
            <button onClick={() => { setAuthTab("login"); setAuthMsg(""); }}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${authTab === "login" ? "bg-white shadow-sm text-black" : "text-gray-400"}`}>Login</button>
            <button onClick={() => { setAuthTab("signup"); setAuthMsg(""); }}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${authTab === "signup" ? "bg-white shadow-sm text-black" : "text-gray-400"}`}>Sign Up</button>
          </div>
          {authMsg && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold">{authMsg}</div>}
          <form onSubmit={handleCustomAuthSubmit} className="space-y-4">
            {authTab === "signup" && (
              <input type="text" required value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Your Name"
                className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-gray-200" />
            )}
            <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="Email Address"
              className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-gray-200" />
            <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="Password"
              className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-gray-200" />
            <button type="submit" disabled={authLoading}
              className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm transition-transform active:scale-95 disabled:opacity-50 mt-4">
              {authLoading ? "Processing..." : (authTab === "login" ? "Enter Workspace" : "Create Account")}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Calculate stats
  const activeTasksCount = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const completedWeek = tasks.filter(t => t.status === "COMPLETED").length; // simplified

  // Render Card
  const renderCard = (task: Task) => {
    const theme = THEMES[task.type];
    const dateStr = task.deadline ? new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: '2-digit' }).replace(/\//g, '.') : "No Date";
    
    return (
      <div key={task.id} className={`${theme.bg} rounded-3xl p-6 ${theme.text} space-y-4 group relative`}>
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-sm leading-tight pr-4">{task.title}</h3>
          <button className="opacity-50 hover:opacity-100"><MoreHorizontal size={16} /></button>
        </div>
        
        <div className={`w-8 h-1 ${theme.line} rounded-full opacity-30`}></div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/50 border border-black/10 flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm">
               <span className="opacity-70">{task.client ? task.client.charAt(0).toUpperCase() : "U"}</span>
            </div>
            <span className="text-[10px] font-semibold opacity-80 truncate max-w-[80px]">{task.client || "Antor CS"}</span>
          </div>
          <span className="text-[10px] font-medium opacity-60 font-mono tracking-tighter">{dateStr}</span>
        </div>
        
        {/* Hover Actions */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 backdrop-blur-md p-1 rounded-xl shadow-sm border border-black/5">
           <button onClick={() => openEdit(task)} className="p-1.5 hover:bg-white rounded-lg"><Edit3 size={12}/></button>
           <button onClick={() => handleDelete(task.id)} className="p-1.5 hover:bg-white rounded-lg text-red-500"><Trash2 size={12}/></button>
           {task.status !== "COMPLETED" && (
             <button onClick={() => handleStatus(task, "COMPLETED")} className="p-1.5 hover:bg-white rounded-lg text-green-600"><CheckCircle2 size={12}/></button>
           )}
           {task.status === "COMPLETED" && (
             <button onClick={() => handleStatus(task, "TODO")} className="p-1.5 hover:bg-white rounded-lg"><RotateCcw size={12}/></button>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#e2e4e9] p-2 md:p-4 lg:p-6 font-sans antialiased flex items-center justify-center">
      {/* ── MAIN APP WINDOW ── */}
      <div className="w-full h-full min-h-[90vh] bg-[#f9f9f7] rounded-[2.5rem] shadow-2xl flex overflow-hidden border border-white/50">
        
        {/* ── LEFT SIDEBAR ── */}
        <aside className="w-20 bg-transparent flex flex-col items-center py-8 shrink-0 border-r border-gray-200/50">
           <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 mb-8 hover:bg-gray-50">
             <ArrowLeft size={18} className="text-gray-600" />
           </button>
           
           <div className="flex flex-col gap-6 flex-1 w-full items-center text-gray-400">
             <button className="hover:text-black transition-colors"><Search size={20} /></button>
             <button className="hover:text-black transition-colors"><Share2 size={20} /></button>
             <button className="hover:text-black transition-colors"><Upload size={20} /></button>
             <button className="hover:text-black transition-colors"><Star size={20} /></button>
             <button className="hover:text-black transition-colors"><Trash2 size={20} /></button>
             <button className="hover:text-black transition-colors"><Calendar size={20} /></button>
             <button className="hover:text-black transition-colors"><Send size={20} /></button>
             <button className="hover:text-black transition-colors relative">
               <MoreHorizontal size={20} />
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
           </div>
           
           <div className="mt-auto flex flex-col items-center gap-4">
             <button onClick={() => setShowAuth(true)} className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100">
               <Lock size={16} />
             </button>
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold cursor-pointer" onClick={handleLogout} title="Log Out">
               {user.name.charAt(0).toUpperCase()}
             </div>
           </div>
        </aside>

        {/* ── CONTENT AREA ── */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
           
           {/* HEADER */}
           <header className="px-10 py-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6 shrink-0">
             
             {/* Left: Branding & Title */}
             <div className="flex flex-col gap-1.5">
               <div className="flex items-center gap-2 text-gray-900 font-bold text-lg mb-1">
                 <div className="bg-black text-white p-1 rounded-md"><ImageIcon size={14} /></div>
                 Antor CS
               </div>
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Task Schedule</div>
               <h1 className="text-3xl font-black text-gray-900 tracking-tight">Daily Operation</h1>
             </div>

             {/* Middle: Controls */}
             <div className="flex items-center gap-4">
               <div className="flex items-center bg-white rounded-full p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
                 <button className="px-5 py-2.5 bg-black text-white rounded-full text-xs font-bold flex items-center gap-2 transition-transform active:scale-95">
                   Still Running <span className="bg-[#f2e205] text-black w-5 h-5 flex items-center justify-center rounded-full text-[9px]">{activeTasksCount}</span>
                 </button>
                 <button className="px-5 py-2.5 text-gray-500 hover:text-gray-900 rounded-full text-xs font-bold flex items-center gap-2 transition-colors">
                   Completed <span className="bg-gray-100 w-5 h-5 flex items-center justify-center rounded-full text-[9px]">{completedWeek}</span>
                 </button>
               </div>
               
               <div className="flex items-center bg-white rounded-full p-2 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 gap-1 text-gray-400">
                 <button className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white"><Menu size={14}/></button>
                 <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 hover:text-black transition-colors"><Link size={14}/></button>
                 <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 hover:text-black transition-colors"><Star size={14}/></button>
                 <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 hover:text-black transition-colors"><ImageIcon size={14}/></button>
                 <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 hover:text-black transition-colors"><Share2 size={14}/></button>
               </div>
             </div>

             {/* Right: Stats & Nav */}
             <div className="flex items-center gap-8 xl:ml-auto">
               <div className="flex gap-8 text-center xl:text-left">
                 <div>
                   <div className="text-[10px] font-bold text-gray-400">Total Tasks</div>
                   <div className="text-xl font-bold text-gray-900">{tasks.length}</div>
                 </div>
                 <div>
                   <div className="text-[10px] font-bold text-gray-400">Pending Approval</div>
                   <div className="text-xl font-bold text-gray-900">0</div>
                 </div>
               </div>
               
               <div className="flex gap-2">
                 <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-gray-300"><Calendar size={16} className="text-gray-600"/></button>
                 <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-gray-300"><Upload size={16} className="text-gray-600"/></button>
                 <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 hover:border-gray-300"><Search size={16} className="text-gray-600"/></button>
               </div>
             </div>
           </header>
           
           <div className="px-10 pb-4 flex justify-end gap-6 text-xs font-bold text-gray-500">
              <button className="text-black bg-white px-4 py-1.5 rounded-full shadow-sm">Pipeline</button>
              <button className="hover:text-black">Activity</button>
              <button className="hover:text-black">Comments</button>
              <button className="hover:text-black">Reports</button>
           </div>

           {/* BOARD SCROLL AREA */}
           <div className="flex-1 overflow-x-auto overflow-y-hidden px-10 pb-20 custom-scrollbar relative z-10">
             <div className="flex gap-6 h-full items-start w-max">
               
               {/* Columns based on Status */}
               {(["TODO", "IN_PROGRESS", "COMPLETED"] as Status[]).map((colStatus) => (
                 <div key={colStatus} className="w-[320px] flex flex-col gap-4 max-h-full overflow-y-auto pr-2 custom-scrollbar-hide">
                    {/* Invisible column header to maintain spacing if needed, but the design has no column headers. */}
                    <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase pl-2 mb-2 flex items-center justify-between">
                      {colStatus.replace("_", " ")}
                      <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{tasks.filter(t => t.status === colStatus).length}</span>
                    </div>
                    {tasks.filter(t => t.status === colStatus).map(renderCard)}
                 </div>
               ))}
               
               {/* Add an empty placeholder column matching the diagonal stripes from the image */}
               <div className="w-[320px] flex flex-col gap-4 max-h-full">
                  <div className="text-[10px] font-bold text-transparent tracking-widest uppercase pl-2 mb-2">.</div>
                  <div className="rounded-3xl p-6 border-2 border-dashed border-gray-200 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#00000005_10px,#00000005_20px)] h-48 flex items-center justify-center">
                    <div className="flex gap-3">
                      <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-black"><Upload size={16}/></button>
                      <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-black"><UserPlus size={16}/></button>
                      <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-black"><Calendar size={16}/></button>
                    </div>
                  </div>
               </div>

             </div>
           </div>

           {/* FLOATING ACTION BAR */}
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white p-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 z-40">
             <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500"><ImageIcon size={18}/></button>
             <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500"><Calendar size={18}/></button>
             <button onClick={() => { setEditingTask(null); setShowForm(true); }} className="w-12 h-12 rounded-full flex items-center justify-center bg-black text-white hover:bg-gray-800 shadow-lg active:scale-95 transition-transform"><Plus size={24}/></button>
             <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500"><Search size={18}/></button>
             <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500"><Menu size={18}/></button>
           </div>
        </main>
      </div>

      {/* ── MODALS (Auth & Form) ── */}
      <AnimatePresence>
        {showAuth && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl space-y-6">
              <div className="text-center">
                <ShieldAlert size={32} className="mx-auto text-red-500 mb-4" />
                <h3 className="font-bold text-xl text-gray-900">Boss Access</h3>
              </div>
              <form onSubmit={handleAuth} className="space-y-4">
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
                  className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm text-center tracking-widest outline-none focus:ring-2 focus:ring-gray-200" />
                {authErr && <p className="text-red-500 text-xs text-center font-bold">{authErr}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowAuth(false)} className="flex-1 py-4 rounded-2xl font-bold text-xs bg-gray-100 hover:bg-gray-200">Cancel</button>
                  <button type="submit" className="flex-1 py-4 rounded-2xl font-bold text-xs bg-black text-white hover:bg-gray-900">Unlock</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl">{editingTask ? "Edit Task" : "New Task"}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={16} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Task Title"
                  className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-gray-200" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))} placeholder="Client / User"
                    className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-gray-200" />
                  <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                    className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-gray-200" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as TaskType }))}
                    className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-gray-200">
                    <option value="BOSS_TASK">Boss Task</option><option value="CLIENT_WORK">Client Work</option>
                    <option value="GRAPHIC">Graphic Design</option><option value="MOTION">Motion</option><option value="SOCIAL">Social</option>
                  </select>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Status }))}
                    className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-gray-200">
                    <option value="TODO">To Do</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Description..."
                  className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-gray-200 resize-none" />
                <button type="submit" disabled={isSaving} className="w-full py-4 rounded-2xl font-bold text-sm bg-black text-white hover:bg-gray-900 disabled:opacity-50">
                  {isSaving ? "Saving..." : "Save Task"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
        .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
