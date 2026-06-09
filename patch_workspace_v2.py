import re

file_path = r"c:\Users\User\.gemini\antigravity\scratch\antor-creative-studio\src\app\workspace\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "ImagePlus, FileText, ChevronDown, ChevronUp, Download, AlertCircle",
    "ImagePlus, FileText, ChevronDown, ChevronUp, Download, AlertCircle, Play, Square, Repeat, Tag, GripVertical, Link, LayoutList, LayoutGrid"
)

# 2. Interfaces
content = content.replace(
    """  steps?: Step[];
  images?: string[];
}""",
    """  steps?: Step[];
  images?: string[];
  timeSpent?: number;
  isTimerRunning?: boolean;
  timerStartedAt?: string;
  recurrence?: "NONE" | "WEEKLY" | "MONTHLY";
  tags?: string[];
  completedAt?: string;
}"""
)

# 3. State & Variables
state_block = """  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});"""
new_state_block = """  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"LIST" | "KANBAN">("LIST");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);"""
content = content.replace(state_block, new_state_block)

# 4. Form state
form_state_find = """    steps: Step[]; images: string[];"""
form_state_replace = """    steps: Step[]; images: string[];
    recurrence: "NONE" | "WEEKLY" | "MONTHLY"; tags: string[];"""
content = content.replace(form_state_find, form_state_replace)

form_init_find = """status: "TODO", deadline: "", steps: [], images: []"""
form_init_replace = """status: "TODO", deadline: "", steps: [], images: [], recurrence: "NONE", tags: []"""
content = content.replace(form_init_find, form_init_replace)

form_init_2_find = """status: task.status, deadline: task.deadline || "", steps: task.steps || [], images: task.images || []"""
form_init_2_replace = """status: task.status, deadline: task.deadline || "", steps: task.steps || [], images: task.images || [], recurrence: task.recurrence || "NONE", tags: task.tags || []"""
content = content.replace(form_init_2_find, form_init_2_replace)

# 5. Fetch Tasks Auto-duplicate logic
fetch_block = """        if (Array.isArray(d)) {
          setTasks(d);"""
new_fetch_block = """        if (Array.isArray(d)) {
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
          setTasks(updatedD);"""
content = content.replace(fetch_block, new_fetch_block)

# 6. handleStatus update
handle_status_find = """const updated = tasks.map(t => t.id === task.id ? { ...t, status: s } : t);"""
handle_status_replace = """const updated = tasks.map(t => {
      if (t.id === task.id) {
        if (task.isTimerRunning && s === "COMPLETED") {
           const start = new Date(task.timerStartedAt || new Date().toISOString()).getTime();
           const elapsedSecs = Math.floor((new Date().getTime() - start) / 1000);
           return { ...t, status: s, isTimerRunning: false, timeSpent: (t.timeSpent || 0) + elapsedSecs, timerStartedAt: undefined, completedAt: s === "COMPLETED" ? new Date().toISOString() : undefined };
        }
        return { ...t, status: s, completedAt: s === "COMPLETED" ? new Date().toISOString() : undefined };
      }
      return t;
    });"""
content = content.replace(handle_status_find, handle_status_replace)

# 7. Add Timer & Share functions
extra_funcs = """  const handleStepToggle = async (task: Task, stepId: string) => {"""
new_extra_funcs = """
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
    if (await saveTasks(updatedTasks)) setTasks(updatedTasks);
  };

  const shareTask = (task: Task) => {
    const payload = btoa(JSON.stringify({ email: user?.email, taskId: task.id }));
    const link = `${window.location.origin}/workspace/share/${payload}`;
    navigator.clipboard.writeText(link);
    alert("Client Portal link copied to clipboard!");
  };

  const handleStepToggle = async (task: Task, stepId: string) => {"""
content = content.replace(extra_funcs, new_extra_funcs)

# 8. Render Task Card Function
# Extracting the whole render body to a function
task_card_search = re.search(r'(const tm = TYPE_META\[task\.type\];.*?)return \(\s*<motion\.div key=\{task\.id\}(.*?)</motion\.div>\s*\);', content, re.DOTALL)
if task_card_search:
    original_task_card_logic = task_card_search.group(1)
    original_task_card_jsx = task_card_search.group(2)
    
    # We will inject our new stuff into original_task_card_jsx before replacing it.
    
    # Inject Progress Bar
    progress_bar = """
                      {/* Visual Progress Bar */}
                      {task.steps && task.steps.length > 0 && (
                        <div className="w-full bg-gray-100 rounded-full h-1 mt-1 overflow-hidden">
                          <div className="bg-emerald-400 h-1 transition-all duration-500" style={{ width: `${(task.steps.filter(s => s.isDone).length / task.steps.length) * 100}%` }} />
                        </div>
                      )}
"""
    # Insert right after `</h3>`
    original_task_card_jsx = original_task_card_jsx.replace("</h3>", "</h3>" + progress_bar)
    
    # Add Tags and Timer info below Client + Deadline
    meta_tags = """
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
"""
    original_task_card_jsx = original_task_card_jsx.replace("</div>\n\n                      {task.description && (", "</div>" + meta_tags + "\n                      {task.description && (")
    
    # Add Timer and Share buttons in the action strip
    action_btns = """                        <button onClick={() => handleDelete(task.id)}
                          className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer">
                          <Trash2 size={9} />
                        </button>"""
    new_action_btns = """                        <button onClick={() => handleDelete(task.id)}
                          className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer">
                          <Trash2 size={9} />
                        </button>
                        <div className="w-px h-3 bg-gray-200 mx-1" />
                        <button onClick={() => toggleTimer(task)} className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${task.isTimerRunning ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-700"}`}>
                          {task.isTimerRunning ? <Square size={9} /> : <Play size={9} />}
                          <span className="text-[9px] font-mono">{formatTime(getActiveTime(task))}</span>
                        </button>
                        <button onClick={() => shareTask(task)} className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-500 hover:bg-blue-100 transition-all cursor-pointer" title="Client Link">
                          <Link size={9} />
                        </button>"""
    original_task_card_jsx = original_task_card_jsx.replace(action_btns, new_action_btns)
    
    # Add draggable props
    original_task_card_jsx = original_task_card_jsx.replace(
        """className={`group relative bg-white rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md""",
        """draggable
                    onDragStart={(e) => setDraggedTaskId(task.id)}
                    className={`group relative bg-white rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing"""
    )
    
    # Create the renderTaskCard function
    render_func = f"""  const renderTaskCard = (task: Task, idx: number) => {{
    {original_task_card_logic}
    return (
      <motion.div key={{task.id}} {original_task_card_jsx} </motion.div>
    );
  }};"""
    
    # Replace the old mapping with the function call + adding Kanban view
    grid_block_search = re.search(r'<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">.*?<AnimatePresence>.*?</AnimatePresence>\s*\)\}\s*</div>', content, re.DOTALL)
    if grid_block_search:
        full_grid = grid_block_search.group(0)
        
        new_grid_content = f"""
        {render_func}
        
        <div className="pb-16">
          {{isLoading ? (
            <div className="flex items-center justify-center py-20 text-gray-400 font-mono text-xs border border-gray-100 rounded-2xl bg-white shadow-sm">
              <Loader2 className="animate-spin text-brand-red mr-2" size={{16}} />
              লোডিং হচ্ছে...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 font-mono text-xs border border-gray-100 rounded-2xl bg-white shadow-sm">
              কোনো টাস্ক নেই — নতুন টাস্ক যোগ করো!
            </div>
          ) : viewMode === "KANBAN" ? (
             <div className="flex gap-4 overflow-x-auto pb-8 items-start custom-scrollbar">
               {{(["TODO", "IN_PROGRESS", "COMPLETED"] as Status[]).map(colStatus => (
                 <div key={{colStatus}} className="flex-1 min-w-[300px] max-w-[350px] bg-gray-50/50 rounded-2xl p-4 border border-gray-100 shrink-0"
                      onDragOver={{(e) => e.preventDefault()}}
                      onDrop={{async (e) => {{
                        e.preventDefault();
                        if (draggedTaskId) {{
                          const task = tasks.find(t => t.id === draggedTaskId);
                          if (task && task.status !== colStatus) {{
                            await handleStatus(task, colStatus);
                          }}
                          setDraggedTaskId(null);
                        }}
                      }}}}
                 >
                   <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4 flex items-center justify-between">
                     {{colStatus.replace("_", " ")}}
                     <span className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-gray-100 text-[10px] text-gray-600">
                        {{filtered.filter(t => t.status === colStatus).length}}
                     </span>
                   </h3>
                   <div className="space-y-3">
                      <AnimatePresence>
                        {{filtered.filter(t => t.status === colStatus).map((task, idx) => renderTaskCard(task, idx))}}
                      </AnimatePresence>
                   </div>
                 </div>
               ))}}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {{filtered.map((task, idx) => renderTaskCard(task, idx))}}
              </AnimatePresence>
            </div>
          )}}
        </div>
"""
        content = content.replace(full_grid, new_grid_content)


# 9. View Mode Toggle in Toolbar
toolbar_filters = """          <div className="flex items-center gap-1.5 flex-wrap">"""
new_toolbar_filters = """          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 mr-2 shadow-sm">
              <button onClick={() => setViewMode("LIST")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "LIST" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}><LayoutList size={14}/></button>
              <button onClick={() => setViewMode("KANBAN")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "KANBAN" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}><LayoutGrid size={14}/></button>
            </div>
            <div className="w-px h-6 bg-gray-200 mr-2" />"""
content = content.replace(toolbar_filters, new_toolbar_filters)

# 10. Tags & Recurrence in Modal
modal_additions = """                <div className="grid grid-cols-3 gap-3">"""
new_modal_additions = """                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
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
                <div className="grid grid-cols-3 gap-3">"""
content = content.replace(modal_additions, new_modal_additions)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patching V2 successful!")
