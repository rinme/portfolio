"use client";

import { useState } from "react";
import { loginAdminAction } from "@/app/actions";
import { LockKey, ShieldCheck, ArrowRight, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAdminAction(password);
      if (res.success) {
        window.location.reload();
      } else {
        setError(res.error || "Authentication failed");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 selection:bg-rose-500/30 selection:text-white">
      <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-800 bg-[#121215] shadow-2xl relative">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
            <LockKey size={24} weight="bold" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Portfolio CRM &amp; CMS
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Enter master secret password to manage content &amp; leads
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-mono">
            <WarningCircle size={16} weight="bold" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-mono text-zinc-400 mb-1.5"
            >
              Master Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] disabled:opacity-50 transition-all shadow-md shadow-rose-950/40"
          >
            <span>{loading ? "Authenticating..." : "Access Back-Office"}</span>
            <ArrowRight size={14} weight="bold" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center flex items-center justify-between text-xs font-mono text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            ← Return to Portfolio
          </Link>
          <div className="flex items-center gap-1 text-[11px] text-zinc-600">
            <ShieldCheck size={14} />
            <span>Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
