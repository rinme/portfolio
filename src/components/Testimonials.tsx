import Image from "next/image";
import type { Testimonial } from "@/lib/db/schema";
import { Quotes } from "@phosphor-icons/react/dist/ssr";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <section id="endorsements" className="py-24 border-b border-white/5 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Engineering Endorsements
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-[60ch]">
            Perspectives from engineering leads and architects on collaboration and outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-8 rounded-xl border border-zinc-800 bg-[#121215] flex flex-col justify-between relative group hover:border-zinc-700 transition-colors"
            >
              <Quotes
                size={32}
                weight="fill"
                className="text-rose-500/20 mb-4 group-hover:text-rose-500/40 transition-colors"
              />

              {/* Quote body: max 3 lines per taste-skill */}
              <blockquote className="text-sm sm:text-base text-zinc-200 leading-relaxed italic mb-6">
                “{test.content}”
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80">
                {test.avatarUrl && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0">
                    <Image
                      src={test.avatarUrl}
                      alt={test.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-mono font-bold text-white">
                    {test.author}
                  </h4>
                  <p className="text-[11px] font-mono text-zinc-400">
                    {test.role} • <span className="text-rose-400">{test.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
