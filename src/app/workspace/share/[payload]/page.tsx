"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Loader2, ImageIcon, Briefcase, FileText } from "lucide-react";

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
  priority: string;
  type: string;
  status: string;
  deadline?: string;
  createdAt: string;
  steps?: Step[];
  images?: string[];
  timeSpent?: number;
}

export default function ClientSharePortal() {
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const payload = params.payload as string;
        if (!payload) throw new Error("Invalid Link");

        const decoded = JSON.parse(atob(payload));
        const { email, taskId } = decoded;

        if (!email || !taskId) throw new Error("Invalid Data");

        const res = await fetch(`/api/calendar?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("Failed to load data");

        const tasks: Task[] = await res.json();
        const found = tasks.find(t => t.id === taskId);

        if (!found) {
          throw new Error("Task not found or has been deleted.");
        }

        setTask(found);
      } catch (e: any) {
        setError(e.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [params.payload]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const progress = task.steps?.length 
    ? Math.round((task.steps.filter(s => s.isDone).length / task.steps.length) * 100) 
    : (task.status === "COMPLETED" ? 100 : (task.status === "IN_PROGRESS" ? 50 : 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 antialiased">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Header Strip */}
        <div className={`h-2 w-full ${progress === 100 ? "bg-emerald-500" : "bg-blue-500"}`} />

        <div className="p-8 sm:p-10 space-y-8">
          
          {/* Header Info */}
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <Briefcase size={10} /> {task.client || "Studio Project"}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  task.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" :
                  task.status === "IN_PROGRESS" ? "bg-amber-100 text-amber-700 animate-pulse" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {task.status.replace("_", " ")}
                </span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 font-serif leading-tight">
                {task.title}
              </h1>
            </div>
            
            {task.deadline && (
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Deadline</p>
                <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Clock size={14} /> {new Date(task.deadline).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          {/* Overall Progress */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Project Progress</h3>
              <span className="text-2xl font-black text-gray-900 font-mono">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }}
                className={`h-2.5 rounded-full ${progress === 100 ? "bg-emerald-500" : "bg-blue-500"}`} 
              />
            </div>
          </div>

          {/* Steps Detail */}
          {task.steps && task.steps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <FileText size={14} /> Workflow Steps
              </h3>
              <div className="grid gap-2">
                {task.steps.map(step => (
                  <div key={step.id} className={`flex items-center gap-3 p-3 rounded-xl border ${step.isDone ? "bg-emerald-50/50 border-emerald-100" : "bg-white border-gray-100"}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${step.isDone ? "bg-emerald-500 text-white" : "bg-gray-100 border border-gray-200"}`}>
                      {step.isDone && <CheckCircle2 size={12} />}
                    </div>
                    <span className={`text-sm font-bold ${step.isDone ? "text-gray-500 line-through" : "text-gray-800"}`}>
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reference Images */}
          {task.images && task.images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={14} /> Reference Assets
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {task.images.map((img, i) => (
                  <a key={i} href={img} target="_blank" rel="noreferrer" className="block aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity">
                    <img src={img} alt={`Ref ${i+1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Powered by Antor Creative Studio
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
