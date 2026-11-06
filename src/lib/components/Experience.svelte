<script lang="ts">
  import type { Experience } from '#lib/db/schema';
  import { ArrowUpRight } from 'phosphor-svelte';

  let { experiences = [] } = $props<{ experiences: Experience[] }>();

  function parseHighlights(json: string | null): string[] {
    if (!json) return [];
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
</script>

<section id="origin" class="py-20 sm:py-32 border-b border-[var(--border-subtle)]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="max-w-2xl mb-16">
      <h2 class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
        Origin & Timeline
      </h2>
      <p class="text-base sm:text-lg text-[var(--text-secondary)] mt-3">
        From childhood self-learning to building edge platforms and mission-critical university software.
      </p>
    </div>

    <div class="space-y-12">
      {#each experiences as exp}
        <article class="p-8 rounded-lg bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
          <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-4 pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <h3 class="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-primary)]">
                {exp.role}
              </h3>
              <div class="text-sm font-mono text-[var(--accent)] mt-1 flex items-center gap-1.5">
                {#if exp.companyUrl}
                  <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center gap-1">
                    {exp.company} <ArrowUpRight size={12} />
                  </a>
                {:else}
                  <span>{exp.company}</span>
                {/if}
                <span>•</span>
                <span class="text-[var(--text-secondary)]">{exp.location}</span>
              </div>
            </div>

            <div class="text-xs font-mono px-3 py-1 rounded bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)] shrink-0">
              {exp.startDate} — {exp.endDate}
            </div>
          </div>

          <p class="text-base text-[var(--text-primary)] leading-relaxed mb-6">
            {exp.description}
          </p>

          <div class="space-y-2">
            {#each parseHighlights(exp.highlights) as item}
              <div class="flex items-start gap-2.5 text-xs font-mono text-[var(--text-secondary)]">
                <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0"></span>
                <span>{item}</span>
              </div>
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
