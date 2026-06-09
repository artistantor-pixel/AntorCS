import sys

file_path = r"c:\Users\User\.gemini\antigravity\scratch\antor-creative-studio\src\app\workspace\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "Lock, Unlock, Plus, Trash2, CheckCircle2,\n  Clock, Zap, Coffee, Moon, Sun, Sunset, ArrowRight,\n  Flame, Target, Briefcase, ImageIcon, Film, Share2, X,\n  ShieldAlert, Home, RotateCcw, Edit3, LogOut, Loader2, KeyRound, UserPlus\n} from \"lucide-react\";",
    "Lock, Unlock, Plus, Trash2, CheckCircle2,\n  Clock, Zap, Coffee, Moon, Sun, Sunset, ArrowRight,\n  Flame, Target, Briefcase, ImageIcon, Film, Share2, X,\n  ShieldAlert, Home, RotateCcw, Edit3, LogOut, Loader2, KeyRound, UserPlus,\n  ImagePlus, FileText, ChevronDown, ChevronUp, Download, AlertCircle\n} from \"lucide-react\";\nimport jsPDF from \"jspdf\";\nimport html2canvas from \"html2canvas\";"
)

# 2. Interfaces
content = content.replace(
    """interface Task {
  id: string;
  title: string;
  client: string;
  description?: string;
  priority: Priority;
  type: TaskType;
  status: Status;
  deadline?: string;
  createdAt: string;
}""",
    """interface Step {
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
}"""
)

# 3. State Additions
content = content.replace(
    "const [editingTask, setEditingTask] = useState<Task | null>(null);",
    "const [editingTask, setEditingTask] = useState<Task | null>(null);\n  const [dueTasks, setDueTasks]     = useState<Task[]>([]);\n  const [showDueModal, setShowDueModal] = useState(false);\n  const [pdfGenerating, setPdfGenerating] = useState(false);\n  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});"
)

# 4. Form State
content = content.replace(
    """const [form, setForm] = useState({
    title: "", client: "", description: "",
    priority: "HIGH" as Priority, type: "BOSS_TASK" as TaskType,
    status: "TODO" as Status, deadline: ""
  });""",
    """const [form, setForm] = useState<{
    title: string; client: string; description: string; priority: Priority; type: TaskType; status: Status; deadline: string;
    steps: Step[]; images: string[];
  }>({
    title: "", client: "", description: "", priority: "HIGH", type: "BOSS_TASK", status: "TODO", deadline: "", steps: [], images: []
  });"""
)

# 5. Fetch Tasks Logic
fetch_block = """      if (res.ok) {
        const d = await res.json();
        if (Array.isArray(d)) setTasks(d);
      }"""

new_fetch_block = """      if (res.ok) {
        const d = await res.json();
        if (Array.isArray(d)) {
          setTasks(d);
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
      }"""
content = content.replace(fetch_block, new_fetch_block)

# 6. handleSubmit modifications
content = content.replace(
    """setForm({ title: "", client: "", description: "", priority: "HIGH", type: "BOSS_TASK", status: "TODO", deadline: "" });""",
    """setForm({ title: "", client: "", description: "", priority: "HIGH", type: "BOSS_TASK", status: "TODO", deadline: "", steps: [], images: [] });"""
)

# 7. openEdit modification
content = content.replace(
    """setForm({ title: task.title, client: task.client, description: task.description || "", priority: task.priority, type: task.type, status: task.status, deadline: task.deadline || "" });""",
    """setForm({ title: task.title, client: task.client, description: task.description || "", priority: task.priority, type: task.type, status: task.status, deadline: task.deadline || "", steps: task.steps || [], images: task.images || [] });"""
)

# 8. Extra Methods (handleStepToggle, generatePDF, image logic)
extra_methods = """  const sorted = [...tasks].sort((a, b) => {"""

new_extra_methods = """  const handleStepToggle = async (task: Task, stepId: string) => {
    const updated = tasks.map(t => {
      if (t.id === task.id) {
        const newSteps = (t.steps || []).map(s => s.id === stepId ? { ...s, isDone: !s.isDone } : s);
        return { ...t, steps: newSteps };
      }
      return t;
    });
    if (await saveTasks(updated)) setTasks(updated);
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
      pdf.save(`ACS_Daily_Report_${today.replace(/\\//g, "-")}.pdf`);
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

  const sorted = [...tasks].sort((a, b) => {"""
content = content.replace(extra_methods, new_extra_methods)

# 9. Toolbar Additions (Download PDF Button)
toolbar_block = """          <button onClick={() => { setEditingTask(null); setForm({ title: "", client: "", description: "", priority: "HIGH", type: "BOSS_TASK", status: "TODO", deadline: "" }); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all hover:opacity-90 cursor-pointer"
            style={{ background: theme.accent }}>
            <Plus size={14} /> Add Task
          </button>"""

new_toolbar_block = """          <div className="flex items-center gap-2">
            <button onClick={generatePDF} disabled={pdfGenerating}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-gray-200 hover:border-gray-400 text-gray-700 transition-all shadow-sm cursor-pointer disabled:opacity-50">
              {pdfGenerating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} 
              Daily Summary
            </button>
            <button onClick={() => { setEditingTask(null); setForm({ title: "", client: "", description: "", priority: "HIGH", type: "BOSS_TASK", status: "TODO", deadline: "", steps: [], images: [] }); setShowForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all hover:opacity-90 cursor-pointer"
              style={{ background: theme.accent }}>
              <Plus size={14} /> Add Task
            </button>
          </div>"""
content = content.replace(toolbar_block, new_toolbar_block)

# 10. Task Card Additions (Steps & Images)
task_card_description = """                      {task.description && (
                        <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                          {task.description}
                        </p>
                      )}"""

new_task_card_content = """                      {task.description && (
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
                      ) : null}"""
content = content.replace(task_card_description, new_task_card_content)

# 11. Add/Edit Task Modal Additions
modal_form_description = """                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">বিস্তারিত নোট</label>
                  <textarea rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="নির্দেশনা, রেফারেন্স লিংক..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder:text-gray-300 focus:border-gray-400 outline-none resize-none animate-none" />
                </div>"""

new_modal_form_description = """                <div>
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
                </div>"""
content = content.replace(modal_form_description, new_modal_form_description)

# 12. Due Task Modal logic at the end of the file right before the final closing div
due_modal_html = """      {/* ── DUE TASKS MODAL ── */}
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
      </AnimatePresence>"""

content = content.replace("    </div>\n  );\n}", f"{due_modal_html}\n    </div>\n  );\n}}")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patching successful!")
