import type { Experience } from "@/lib/db/schema";
import { Briefcase, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

interface ExperienceProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceProps) {
  return (
    <section id="experience" className="py-24 border-b border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Engineering Journey
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-[60ch]">
            Track record of shipping mission-critical infrastructure, optimizing systems, and scaling teams.
          </p>
        </div>

        <div className="relative border-l border-zinc-800 ml-3 sm:ml-4 pl-6 sm:pl-8 space-y-12">
          {experiences.map((exp) => {
            let highlights: string[] = [];
            try {
              highlights = JSON.parse(exp.highlights);
            } catch {
              highlights = [exp.highlights];
            }

            return (
              <div key={exp.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-zinc-950 border-2 border-rose-500 group-hover:scale-125 transition-transform" />

                <div className="p-6 sm:p-7 rounded-xl border border-zinc-800/80 bg-[#121215] hover:border-zinc-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-1">
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-300 hover:text-white inline-flex items-center gap-1 font-semibold"
                          >
                            <span>{exp.company}</span>
                            <ArrowUpRight size={12} />
                          </a>
                        ) : (
                          <span className="text-zinc-300 font-semibold">{exp.company}</span>
                        )}
                        <span>•</span>
                        <span>{exp.location}</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center px-3 py-1 rounded-md text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 w-fit">
                      {exp.startDate} — {exp.endDate}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {highlights.length > 0 && (
                    <ul className="space-y-2 mt-4 pt-4 border-t border-zinc-800/60">
                      {highlights.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400/80 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
