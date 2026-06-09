import re

file_path = r"c:\Users\User\.gemini\antigravity\scratch\antor-creative-studio\src\app\workspace\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update handleStatus
status_func_pattern = r'const handleStatus = async \(task: Task, s: Status\) => \{([\s\S]*?)\};'
status_func_match = re.search(status_func_pattern, content)
if status_func_match:
    old_body = status_func_match.group(1)
    new_body = """
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
  """
    content = content.replace(status_func_match.group(0), f"const handleStatus = async (task: Task, s: Status) => {{{new_body}}};")


# 2. Update handleDelete
delete_func_pattern = r'const handleDelete = async \(id: string\) => \{([\s\S]*?)\};'
delete_func_match = re.search(delete_func_pattern, content)
if delete_func_match:
    new_body = """
    if (!confirm("Are you sure?")) return;
    const previousTasks = [...tasks];
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated); // Optimistic Update
    const success = await saveTasks(updated);
    if (!success) setTasks(previousTasks);
  """
    content = content.replace(delete_func_match.group(0), f"const handleDelete = async (id: string) => {{{new_body}}};")


# 3. Update handleStepToggle
step_func_pattern = r'const handleStepToggle = async \(task: Task, stepId: string\) => \{([\s\S]*?)\};'
step_func_match = re.search(step_func_pattern, content)
if step_func_match:
    new_body = """
    const previousTasks = [...tasks];
    const updated = tasks.map(t => t.id === task.id ? {
      ...t,
      steps: t.steps?.map(s => s.id === stepId ? { ...s, isDone: !s.isDone } : s)
    } : t);
    setTasks(updated); // Optimistic Update
    const success = await saveTasks(updated);
    if (!success) setTasks(previousTasks);
  """
    content = content.replace(step_func_match.group(0), f"const handleStepToggle = async (task: Task, stepId: string) => {{{new_body}}};")


# 4. Update Checkbox UI
old_checkbox_ui = """                                      <label key={step.id} className="flex items-center gap-2">
                                        <input type="checkbox" checked={step.isDone} onChange={() => handleStepToggle(task, step.id)}
                                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                                        <span className={`text-sm ${step.isDone ? "line-through text-gray-400" : "text-gray-700"}`}>
                                          {step.name}
                                        </span>
                                      </label>"""
                                      
new_checkbox_ui = """                                      <button key={step.id} onClick={() => handleStepToggle(task, step.id)} className="flex items-center gap-3 w-full text-left py-1.5 px-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group/step">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${step.isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 text-transparent group-hover/step:border-emerald-200"}`}>
                                          <CheckCircle2 size={16} />
                                        </div>
                                        <span className={`text-sm font-medium transition-all ${step.isDone ? "line-through text-gray-400" : "text-gray-700"}`}>
                                          {step.name}
                                        </span>
                                      </button>"""
                                      
content = content.replace(old_checkbox_ui, new_checkbox_ui)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patching V3 successful!")
