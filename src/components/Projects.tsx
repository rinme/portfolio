"use client";

import Image from "next/image";
import { ArrowUpRight, GithubLogo, Lightning } from "@phosphor-icons/react";
import type { Project } from "@/lib/db/schema";

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="py-24 border-b border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header: Focused headline + body stack (No eyebrow) */}
        <div className="mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Selected Architecture &amp; Systems
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-[60ch]">
            Production software engineered for low latency, zero downtime, and mechanical sympathy.
          </p>
        </div>

        {/* Bento Rhythm Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {projects.map((proj, idx) => {
            let tags: string[] = [];
            try {
              tags = JSON.parse(proj.tags);
            } catch {
              tags = [proj.tags];
            }

            // Rhythm variation: 1st project spans 12 cols (Hero Bento), next span 6 cols each
            const isFullWidth = idx === 0;

            return (
              <div
                key={proj.id}
                className={`group relative rounded-xl border border-zinc-800 bg-[#121215] hover:border-zinc-700 transition-all duration-300 overflow-hidden flex flex-col ${
                  isFullWidth ? "lg:col-span-12" : "lg:col-span-6"
                }`}
              >
                <div
                  className={`grid grid-cols-1 ${
                    isFullWidth ? "lg:grid-cols-12" : ""
                  } h-full`}
                >
                  {/* Visual Asset side */}
                  {proj.imageUrl && (
                    <div
                      className={`relative min-h-[240px] sm:min-h-[280px] bg-zinc-950 overflow-hidden ${
                        isFullWidth ? "lg:col-span-7" : "w-full"
                      }`}
                    >
                      <Image
                        src={proj.imageUrl}
                        alt={proj.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-transparent to-transparent opacity-90 lg:opacity-60" />
                    </div>
                  )}

                  {/* Content side */}
                  <div
                    className={`p-6 sm:p-8 flex flex-col justify-between ${
                      isFullWidth && proj.imageUrl ? "lg:col-span-5" : "flex-1"
                    }`}
                  >
                    <div>
                      {/* Metric Callout Pill if available */}
                      {proj.impactMetric && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono mb-4">
                          <Lightning size={14} weight="fill" />
                          <span>{proj.impactMetric}</span>
                        </div>
                      )}

                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-rose-400 transition-colors">
                        {proj.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                        {proj.tagline}
                      </p>

                      <p className="text-xs text-zinc-400 leading-relaxed mb-6 line-clamp-3">
                        {proj.description}
                      </p>
                    </div>

                    <div>
                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center gap-4 pt-4 border-t border-zinc-800/80 text-xs font-mono">
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-white hover:text-rose-400 transition-colors font-medium"
                          >
                            <span>Live Demo</span>
                            <ArrowUpRight size={14} weight="bold" />
                          </a>
                        )}
                        {proj.repoUrl && (
                          <a
                            href={proj.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
                          >
                            <GithubLogo size={15} />
                            <span>Repository</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
