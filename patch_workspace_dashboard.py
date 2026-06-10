import re

file_path = r"c:\Users\User\.gemini\antigravity\scratch\antor-creative-studio\src\app\workspace\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "LayoutList, LayoutGrid",
    "LayoutList, LayoutGrid, BarChart3, Clock, CheckCircle2, LayoutDashboard, Target, Activity, Palette, Type, ScanSquare"
)

# 2. Inside CommandCenter, before return: Add metrics logic
metrics_logic = """
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

"""

# Find where to inject metrics
content = content.replace("  // ─── AUTHENTICATED RENDER ───────────────", metrics_logic + "\n  // ─── AUTHENTICATED RENDER ───────────────")

# 3. Restructure the main return
old_main_start = """  // ─── AUTHENTICATED RENDER ───────────────
  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 md:px-12 bg-gray-50 pb-20">"""

new_main_start = """  // ─── AUTHENTICATED RENDER ───────────────
  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 pb-20 max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* ── SIDEBAR (DESIGNER TOOLKIT) ── */}
      <aside className="w-full lg:w-72 shrink-0 space-y-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 leading-none">Workspace</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Creative Command</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm transition-all shadow-md shadow-gray-900/20">
              <Target size={16} /> My Tasks
            </button>
            <button onClick={generatePDF} disabled={isPdfGenerating} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-bold text-sm transition-all disabled:opacity-50">
              <Download size={16} /> {isPdfGenerating ? "Generating..." : "Daily Report"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-6">
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
              <ScanSquare size={12} /> Aspect Ratios
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono font-bold text-gray-500">
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">16:9<br/><span className="text-[8px] text-gray-400">1920x1080</span></div>
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">9:16<br/><span className="text-[8px] text-gray-400">1080x1920</span></div>
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">1:1<br/><span className="text-[8px] text-gray-400">1080x1080</span></div>
              <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">4:5<br/><span className="text-[8px] text-gray-400">1080x1350</span></div>
            </div>
          </div>
          
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Link size={12} /> Quick Assets
            </h3>
            <div className="space-y-2">
              <a href="https://freepik.com" target="_blank" className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors">Freepik <ChevronRight size={14}/></a>
              <a href="https://elements.envato.com" target="_blank" className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors">Envato <ChevronRight size={14}/></a>
              <a href="https://pinterest.com" target="_blank" className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 transition-colors">Pinterest <ChevronRight size={14}/></a>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN DASHBOARD ── */}
      <main className="flex-1 space-y-8 min-w-0">
        
        {/* STAT CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4"><CheckCircle2 size={16}/></div>
            <p className="text-3xl font-black text-gray-900 font-mono">{tasksCompletedThisWeek}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Done This Week</p>
          </div>
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4"><Activity size={16}/></div>
            <p className="text-3xl font-black text-gray-900 font-mono">{activeProjects}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Active Tasks</p>
          </div>
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-4"><Clock size={16}/></div>
            <p className="text-3xl font-black text-gray-900 font-mono">{totalHoursLogged}<span className="text-lg text-gray-400">h</span></p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Time Logged</p>
          </div>
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4"><AlertCircle size={16}/></div>
            <p className="text-3xl font-black text-gray-900 font-mono">{dueTodayTasks}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Due Today</p>
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
                      className="w-full max-w-[40px] bg-gradient-to-t from-gray-100 to-gray-200 rounded-t-xl relative group">
                        {d.count > 0 && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded-lg pointer-events-none">
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
"""

content = content.replace(old_main_start, new_main_start)

# Ensure ChevronRight is imported
if "ChevronRight" not in content:
    content = content.replace("ChevronDown, ChevronUp,", "ChevronDown, ChevronUp, ChevronRight,")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patching Dashboard successful!")
