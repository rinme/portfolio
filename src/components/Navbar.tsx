"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SocialIcon } from "./SocialIcon";
import type { SocialLink } from "@/lib/db/schema";
import { List, X, ArrowUpRight, ShareNetwork } from "@phosphor-icons/react";

interface NavbarProps {
  name: string;
  availabilityStatus: string;
  activeSocials: SocialLink[];
}

export function Navbar({ name, availabilityStatus, activeSocials }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [socialDrawerOpen, setSocialDrawerOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSocialDrawerOpen(false);
      }
    };
    if (socialDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [socialDrawerOpen]);

  const navLinks = [
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Endorsements", href: "#endorsements" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#09090b]/85 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Live Status */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-mono text-sm tracking-wider font-semibold text-white group-hover:text-rose-400 transition-colors">
            {name}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {availabilityStatus}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-mono tracking-wide text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Strip: Socials Drawer Trigger + Contact CTA + Admin Link */}
        <div className="hidden md:flex items-center gap-3">
          {activeSocials.length > 0 && (
            <button
              type="button"
              onClick={() => setSocialDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all active:scale-[0.98]"
              title="Open Social Profiles Drawer"
            >
              <ShareNetwork size={15} className="text-rose-400" />
              <span>Socials</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400 font-semibold">
                {activeSocials.length}
              </span>
            </button>
          )}

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] transition-all shadow-sm shadow-rose-950/40"
          >
            Initiate Inquiry
            <ArrowUpRight size={14} weight="bold" />
          </a>

          <Link
            href="/admin"
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1 rounded border border-zinc-800 hover:border-zinc-700"
            title="CRM & CMS Admin Back-office"
          >
            Admin
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {activeSocials.length > 0 && (
            <button
              type="button"
              onClick={() => setSocialDrawerOpen(true)}
              className="p-1.5 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-md"
              title="Open Socials Drawer"
              aria-label="Open Socials Drawer"
            >
              <ShareNetwork size={18} className="text-rose-400" />
            </button>
          )}
          <a
            href="#contact"
            className="px-2.5 py-1 text-xs font-mono font-medium text-white bg-rose-600 rounded-md"
          >
            Contact
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-zinc-400 hover:text-white focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0c0c0e] border-b border-white/10 px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-mono text-zinc-300 hover:text-rose-400 py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            {activeSocials.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSocialDrawerOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-400 hover:text-rose-300 py-1"
              >
                <ShareNetwork size={16} />
                <span>View Socials ({activeSocials.length})</span>
              </button>
            )}
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="text-xs font-mono text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded border border-zinc-800"
            >
              CMS / CRM
            </Link>
          </div>
        </div>
      )}

      {/* Slide-over Right Drawer for Socials */}
      {socialDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setSocialDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-[#0e0e11] border-l border-zinc-800 h-full p-6 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-300 ease-out">
            {/* Drawer Header & Content */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <ShareNetwork size={18} weight="bold" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white font-mono">
                      Social Channels &amp; Network
                    </h2>
                    <p className="text-[11px] font-mono text-zinc-400">
                      {activeSocials.length} verified connection points
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSocialDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Close social drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Profiles List */}
              <div className="mt-6 space-y-2.5 max-h-[calc(100vh-210px)] overflow-y-auto pr-1">
                {activeSocials.length === 0 ? (
                  <div className="p-8 text-center rounded-xl border border-dashed border-zinc-800 text-zinc-500 text-xs font-mono">
                    No active social links published yet.
                  </div>
                ) : (
                  activeSocials.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-rose-400 shrink-0 group-hover:scale-105 transition-transform">
                          <SocialIcon name={social.icon || social.platform} size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-mono font-bold text-white group-hover:text-rose-400 transition-colors">
                            {social.platform}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-400 truncate max-w-[200px] sm:max-w-[240px]">
                            {social.url.replace(/^https?:\/\/(www\.)?/, "")}
                          </div>
                        </div>
                      </div>

                      <div className="text-zinc-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all shrink-0">
                        <ArrowUpRight size={16} weight="bold" />
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-zinc-800/80">
              <a
                href="#contact"
                onClick={() => setSocialDrawerOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] transition-all shadow-md shadow-rose-950/40"
              >
                <span>Initiate Direct Inquiry</span>
                <ArrowUpRight size={14} weight="bold" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
