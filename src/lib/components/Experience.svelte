<script lang="ts">
  import type { Experience } from '#lib/db/schema';
  import { ArrowUpRight, Buildings, MapPin } from 'phosphor-svelte';

  let { experiences = [] } = $props<{
    experiences: Experience[];
  }>();

  function parseHighlights(json: string): string[] {
    try {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
</script>

<section id="experience" class="hairline-b py-20 px-6">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 hairline-b pb-8">
      <div>
        <div class="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-3">
          <span class="w-2 h-2 bg-[var(--accent)]"></span>
          <span>Section // 02</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-bold font-display tracking-tight">
          Career Record & History
        </h2>
      </div>
      <p class="text-sm font-mono text-[var(--text-secondary)] mt-4 md:mt-0">
        [ Industry & Engineering Tenures ]
      </p>
    </div>

    <!-- Editorial Ledger List -->
    <div class="divide-y divide-[var(--border-subtle)]">
      {#each experiences as exp, i}
        {@const highlights = parseHighlights(exp.highlights)}
        <div class="py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group">
          <!-- Left Column: Chronology & Org (4 cols) -->
          <div class="lg:col-span-4 space-y-2 font-mono">
            <div class="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">
              {exp.startDate} &mdash; {exp.endDate}
            </div>

            <div class="text-xl font-bold font-display text-[var(--text-primary)]">
              {#if exp.companyUrl}
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:text-[var(--accent)] inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>{exp.company}</span>
                  <ArrowUpRight size={15} />
                </a>
              {:else}
                <span>{exp.company}</span>
              {/if}
            </div>

            <div class="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <MapPin size={13} />
              <span>{exp.location}</span>
            </div>
          </div>

          <!-- Right Column: Role & Impact (8 cols) -->
          <div class="lg:col-span-8 space-y-4">
            <h3 class="text-xl font-bold font-display text-[var(--text-primary)] flex items-center justify-between">
              <span>{exp.role}</span>
              <span class="text-xs font-mono text-[var(--text-tertiary)]">{(i + 1).toString().padStart(2, '0')}</span>
            </h3>

            <p class="text-[var(--text-secondary)] leading-relaxed text-sm sm:text-base">
              {exp.description}
            </p>

            {#if highlights.length > 0}
              <ul class="space-y-2 pt-2">
                {#each highlights as item}
                  <li class="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                    <span class="text-[var(--accent)] font-mono font-bold mt-0.5">&mdash;</span>
                    <span>{item}</span>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
