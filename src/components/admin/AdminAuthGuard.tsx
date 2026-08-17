"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Eye, EyeOff, ArrowLeft, ShieldAlert, Loader2 } from "lucide-react";
import Link from "next/link";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [unlocking, setUnlocking] = useState<boolean>(false);

  useEffect(() => {
    // Check session on mount
    const isSessionAuth = sessionStorage.getItem("admin_auth_session") === "true";
    const isLocalAuth = localStorage.getItem("admin_auth_local") === "true";

    if (isSessionAuth || isLocalAuth) {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    
    if (!password.trim()) {
      setAuthError("অনুগ্রহ করে পাসওয়ার্ডটি প্রদান করুন।");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUnlocking(true);
        // Delay to allow unlock animation to play out
        setTimeout(() => {
          if (rememberMe) {
            localStorage.setItem("admin_auth_local", "true");
          }
          sessionStorage.setItem("admin_auth_session", "true");
          setIsAuthenticated(true);
          setLoading(false);
          setUnlocking(false);
        }, 800);
      } else {
        setAuthError(data.error || "ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।");
        setLoading(false);
      }
    } catch (err) {
      console.error("Authentication request failed:", err);
      setAuthError("সার্ভারে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#ea3f40]" size={36} />
          <p className="text-xs tracking-widest uppercase text-zinc-500 font-mono">Verifying Console Security...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Dynamic Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#ea3f40]/10 to-[#bba28a]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs font-semibold backdrop-blur-md"
        >
          <ArrowLeft size={14} /> প্রধান ওয়েবসাইট
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/[0.03] border border-white/[0.08] rounded-[2.5rem] p-8 md:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl relative z-10"
      >
        {/* Glow borders using pseudo elements or inline css */}
        <div className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-[#ea3f40]/50 to-transparent" />
        
        {/* Logo / Lock Indicator */}
        <div className="text-center mb-8 relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 flex items-center justify-center mx-auto shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#ea3f40]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <AnimatePresence mode="wait">
              {unlocking ? (
                <motion.div
                  key="unlocked"
                  initial={{ rotate: -45, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                >
                  <Unlock size={26} />
                </motion.div>
              ) : (
                <motion.div
                  key="locked"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-[#ea3f40] drop-shadow-[0_0_10px_rgba(234,63,64,0.4)]"
                >
                  <Lock size={26} className="animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <h1 className="text-xl md:text-2xl font-black mt-5 tracking-tight text-white">
            অ্যাডমিন প্যানেল লকড
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1.5 font-mono">
            AntorStudio Control Console
          </p>
        </div>

        {/* Error Notification */}
        <AnimatePresence>
          {authError && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="bg-[#ea3f40]/10 border border-[#ea3f40]/20 p-4 rounded-2xl mb-6 flex items-start gap-3 text-xs text-red-200"
            >
              <ShieldAlert size={16} className="shrink-0 mt-0.5 text-[#ea3f40]" />
              <span className="leading-relaxed">{authError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2 font-mono">
              সিক্রেট পাসকোড
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পাসকোডটি লিখুন"
                disabled={loading || unlocking}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 pr-12 text-sm text-white placeholder:text-zinc-600 focus:border-[#ea3f40]/50 focus:shadow-[0_0_20px_rgba(234,63,64,0.05)] outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Option */}
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-800 text-[#ea3f40] focus:ring-[#ea3f40] focus:ring-offset-zinc-900 w-4 h-4 cursor-pointer"
              />
              <span>পাসওয়ার্ড মনে রাখুন</span>
            </label>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading || unlocking}
            className="w-full py-4 bg-gradient-to-r from-[#ea3f40] to-[#ea3f40]/80 hover:from-[#ea3f40]/90 hover:to-[#ea3f40]/70 text-white rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-[0_4px_20px_rgba(234,63,64,0.2)] hover:shadow-[0_4px_25px_rgba(234,63,64,0.35)] active:scale-[0.98] text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer"
          >
            {loading || unlocking ? (
              <>
                <Loader2 className="animate-spin text-white" size={16} />
                {unlocking ? "সিস্টেম আনলক হচ্ছে..." : "যাচাই করা হচ্ছে..."}
              </>
            ) : (
              "কনসোলে প্রবেশ করুন"
            )}
          </button>
        </form>
      </motion.div>
      
      {/* Footer copyright */}
      <div className="absolute bottom-6 text-[10px] text-zinc-600 font-mono tracking-wider">
        &copy; {new Date().getFullYear()} ANTOR CREATIVE STUDIO. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}
