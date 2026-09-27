"use client";

import { useState } from "react";
import Link from "next/link";
import { SocialIcon } from "./SocialIcon";
import type { SocialLink } from "@/lib/db/schema";
import { List, X, ArrowUpRight } from "@phosphor-icons/react";

interface NavbarProps {
  name: string;
  availabilityStatus: string;
  activeSocials: SocialLink[];
}

export function Navbar({ name, availabilityStatus, activeSocials }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

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

        {/* Right Strip: Active Socials + Contact CTA + Admin Link */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-white/10 pr-4">
            {activeSocials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.platform}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
              >
                <SocialIcon name={social.icon || social.platform} size={18} />
              </a>
            ))}
          </div>

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

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
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

      {/* Mobile Drawer */}
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
            <div className="flex items-center gap-3">
              {activeSocials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-md transition-colors"
                >
                  <SocialIcon name={social.icon || social.platform} size={18} />
                </a>
              ))}
            </div>
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
    </header>
  );
}
