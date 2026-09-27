import type { Skill } from "@/lib/db/schema";
import { Cpu, CheckCircle } from "@phosphor-icons/react/dist/ssr";

interface CapabilitiesProps {
  skills: Skill[];
}

export function CapabilitiesSection({ skills }: CapabilitiesProps) {
  // Group by category
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="capabilities" className="py-24 border-b border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono uppercase tracking-[0.18em] text-rose-400 mb-3">
            <Cpu size={14} weight="bold" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Technical Stack &amp; Architectural Focus
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-[60ch]">
            Technologies and paradigms leveraged to build resilient, distributed systems and zero-overhead frontends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const catSkills = skills.filter((s) => s.category === category);
            return (
              <div
                key={category}
                className="p-6 rounded-xl border border-zinc-800 bg-[#121215] flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-wider text-rose-400 font-semibold mb-4 pb-2 border-b border-zinc-800">
                    {category}
                  </h3>

                  <ul className="space-y-3">
                    {catSkills.map((sk) => (
                      <li key={sk.id} className="flex items-center justify-between text-xs">
                        <span className="text-zinc-200 font-mono flex items-center gap-1.5">
                          {sk.isHighlighted && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          )}
                          {sk.name}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            sk.level === "Expert"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                          }`}
                        >
                          {sk.level}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
