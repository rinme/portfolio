<script lang="ts">
  import type { Experience } from '#lib/db/schema';
  import { ArrowUpRight } from 'phosphor-svelte';

  let { experiences = [] }: { experiences: Experience[] } = $props();

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

<section id="origin" class="py-20 sm:py-32">
  <div class="max-w-7xl mx-auto px-6">
    <div class="max-w-2xl mb-16 animate-reveal">
      <h2 class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
        Origin & Timeline
      </h2>
      <p class="text-base sm:text-lg text-[var(--text-secondary)] mt-3">
        From childhood self-learning to building edge platforms and mission-critical university software.
      </p>
    </div>

    <div class="space-y-10">
      {#each experiences as exp, index}
        <article
          class="p-8 sm:p-10 rounded-2xl bg-[var(--surface-muted)] animate-reveal"
          style="animation-delay: {index * 120}ms;"
        >
          <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-4 pb-4">
            <div>
              <h3 class="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text-primary)]">
                {exp.role}
              </h3>
              <div class="text-sm text-[var(--accent)] mt-1 flex items-center gap-1.5 font-medium">
                {#if exp.companyUrl}
                  <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center gap-1">
                    {exp.company} <ArrowUpRight size={13} />
                  </a>
                {:else}
                  <span>{exp.company}</span>
                {/if}
                <span>•</span>
                <span class="text-[var(--text-secondary)]">{exp.location}</span>
              </div>
            </div>

            <div class="text-sm px-3.5 py-1.5 rounded-full bg-[var(--surface-card)] text-[var(--text-secondary)] shrink-0 font-medium">
              {exp.startDate} — {exp.endDate}
            </div>
          </div>

          <p class="text-base text-[var(--text-primary)] leading-relaxed mb-6">
            {exp.description}
          </p>

          <div class="space-y-2.5">
            {#each parseHighlights(exp.highlights) as item}
              <div class="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 shrink-0"></span>
                <span>{item}</span>
              </div>
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
