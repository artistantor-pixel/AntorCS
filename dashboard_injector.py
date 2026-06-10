import re

file_path = r"c:\Users\User\.gemini\antigravity\scratch\antor-creative-studio\src\app\workspace\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

def patch():
    global content
    
    # 1. Imports
    if "LayoutDashboard" not in content:
        content = content.replace(
            "LayoutList, LayoutGrid",
            "LayoutList, LayoutGrid, BarChart3, Clock, CheckCircle2, LayoutDashboard, Target, Activity, Palette, ScanSquare"
        )
        print("Patched imports")

    if "ChevronRight" not in content:
        content = content.replace("ChevronDown, ChevronUp,", "ChevronDown, ChevronUp, ChevronRight,")
        print("Patched ChevronRight")

    # 2. Add metrics logic
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
    old_render_comment = "  // ─── AUTHENTICATED COMMAND CENTER RENDER ─────────────────────────────────────"
    if old_render_comment in content and "Dashboard Metrics Calculation" not in content:
        content = content.replace(old_render_comment, metrics_logic + "\n" + old_render_comment)
        print("Patched metrics logic")
    else:
        print("Failed to patch metrics logic or already there")

    # 3. Main layout wrapper
    old_main_start = """  return (
    <div className={`min-h-screen ${theme.pageBg} text-gray-800 antialiased`}>

      {/* ── TOP BAR ── */}"""

    new_main_start = """  return (
    <div className={`min-h-screen ${theme.pageBg} text-gray-800 antialiased flex flex-col lg:flex-row max-w-[1600px] mx-auto`}>

      {/* ── SIDEBAR (DESIGNER TOOLKIT) ── */}
      <aside className="w-full lg:w-72 shrink-0 border-r border-black/5 flex flex-col h-screen sticky top-0 bg-white shadow-xl shadow-black/5 z-50">
        <div className="p-6 border-b border-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm transition-all shadow-md shadow-gray-900/20">
              <Target size={16} /> My Tasks
            </button>
            <button onClick={() => { localStorage.removeItem("workspaceToken"); setUser(null); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-bold text-sm transition-all mt-4 border border-red-100">
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
              <ScanSquare size={12} /> Aspect Ratios
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
              <a href="https://freepik.com" target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm text-xs font-bold text-gray-700 transition-all">Freepik <ChevronRight size={14}/></a>
              <a href="https://elements.envato.com" target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm text-xs font-bold text-gray-700 transition-all">Envato <ChevronRight size={14}/></a>
              <a href="https://pinterest.com" target="_blank" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm text-xs font-bold text-gray-700 transition-all">Pinterest <ChevronRight size={14}/></a>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto custom-scrollbar">

        {/* ── TOP BAR (Now inside main) ── */}"""
    
    if old_main_start in content:
        content = content.replace(old_main_start, new_main_start)
        print("Patched main wrapper")
    else:
        print("Failed to patch main wrapper")

    # 4. Insert Dashboard Stats after </header>
    old_header_end = """      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">"""

    dashboard_content = """      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* DASHBOARD STATS */}
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
        </div>"""
    
    if old_header_end in content:
        content = content.replace(old_header_end, dashboard_content)
        print("Patched dashboard stats")
    else:
        print("Failed to patch dashboard stats")

    # 5. Fix closing </main>
    # We find the </div> right before the BOSS AUTH MODAL
    if re.search(r"</div>\s*</div>\s*\{\/\*\s*──\s*BOSS\s*AUTH\s*MODAL\s*──\s*\*\/\}", content):
        content = re.sub(r"</div>\s*</div>\s*(\{\/\*\s*──\s*BOSS\s*AUTH\s*MODAL\s*──\s*\*\/})", r"  </div>\n      </main>\n    </div>\n\n      \1", content)
        print("Patched closing tags with regex")
    else:
        print("Failed to patch closing tags with regex")

patch()

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
