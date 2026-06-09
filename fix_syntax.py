import re

file_path = r"c:\Users\User\.gemini\antigravity\scratch\antor-creative-studio\src\app\workspace\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract renderTaskCard block
match = re.search(r'(\s*const renderTaskCard = \(task: Task, idx: number\) => \{.*?\n  \};\s*)<div className="pb-16">', content, re.DOTALL)
if match:
    render_func = match.group(1)
    
    # Remove it from its current position
    content = content.replace(render_func, "\n        ")
    
    # Insert it right before `return (` of the unauthenticated or authenticated render
    # Actually, we need it inside CommandCenter, so placing it right before `// ─── UNAUTHENTICATED RENDER` is best
    insert_marker = "  // ─── UNAUTHENTICATED RENDER (GMAIL LOG IN / REGISTER COMPONENT) ───────────────"
    
    content = content.replace(insert_marker, render_func + "\n" + insert_marker)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fix applied!")
else:
    print("Could not find renderTaskCard block")
