"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { ArrowUpRight, FileText, MapPin, Terminal } from "@phosphor-icons/react";
import type { Profile, SocialLink } from "@/lib/db/schema";
import { SocialIcon } from "./SocialIcon";

interface HeroProps {
  profile: Profile;
  activeSocials: SocialLink[];
}

export function Hero({ profile, activeSocials }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[90dvh] pt-24 pb-16 flex items-center justify-center border-b border-white/5 bg-grid-pattern">
      {/* Subtle radial ambient highlight */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(244,63,94,0.15), transparent 70%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (col-span-7): Core Value Prop */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Eyebrow: exactly 1 for this section */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono uppercase tracking-[0.18em] text-rose-400 mb-6"
            >
              <Terminal size={14} weight="bold" />
              <span>{profile.role}</span>
            </motion.div>

            {/* Headline: strictly max 2 lines, large display */}
            <motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6"
            >
              {profile.headline}
            </motion.h1>

            {/* Subtext: strictly under 20 words & max 3 lines */}
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-[54ch] mb-8"
            >
              {profile.bio.length > 140 ? `${profile.bio.slice(0, 137)}...` : profile.bio}
            </motion.p>

            {/* CTAs: 1 primary + 1 secondary. No wrapping. Tactile push */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap items-center gap-4 mb-8"
            >
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-mono font-medium text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] transition-all shadow-md shadow-rose-950/50 whitespace-nowrap"
              >
                <span>Explore Architecture</span>
                <ArrowUpRight size={16} weight="bold" />
              </a>

              {profile.resumeUrl && profile.resumeUrl !== "#" ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-mono text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  <FileText size={16} />
                  <span>Resume</span>
                </a>
              ) : (
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-mono text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  <span>Initiate Inquiry</span>
                </a>
              )}
            </motion.div>

            {/* Meta Strip: Location & Active Social Connections */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-zinc-800/80 w-full text-xs font-mono text-zinc-400">
              <div className="inline-flex items-center gap-1.5 text-zinc-400">
                <MapPin size={14} className="text-rose-400" />
                <span>{profile.location}</span>
              </div>

              {/* Dynamic Active Socials */}
              <div className="flex items-center gap-3">
                <span className="text-zinc-600">/</span>
                {activeSocials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.platform}
                    className="hover:text-rose-400 transition-colors"
                  >
                    <SocialIcon name={social.icon || social.platform} size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (col-span-5): Real Visual Asset with technical badge */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-[340px] sm:max-w-[380px]"
            >
              {/* Refined single-accent border framing */}
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/90 shadow-2xl p-2.5 group">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-zinc-950">
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    priority
                    className="object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
                </div>

                {/* Overlaid System Spec Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-3.5 rounded-lg bg-zinc-950/90 backdrop-blur-md border border-zinc-800 text-left">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                    <span className="text-rose-400 font-semibold">{profile.name}</span>
                    <span className="text-zinc-500">v2026.4</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono line-clamp-1">
                    Full-Stack &amp; Systems Architecture
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
