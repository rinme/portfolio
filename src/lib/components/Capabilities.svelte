<script lang="ts">
  import type { Skill } from '#lib/db/schema';
  import { Sparkle } from 'phosphor-svelte';

  let { skills = [] } = $props<{
    skills: Skill[];
  }>();

  const grouped = $derived(
    skills.reduce<Record<string, Skill[]>>((acc, skill) => {
      acc[skill.category] = acc[skill.category] || [];
      acc[skill.category].push(skill);
      return acc;
    }, {})
  );
</script>

<section id="skills" class="hairline-b py-20 px-6 bg-[var(--surface-muted)]/30">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 hairline-b pb-8">
      <div>
        <div class="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-3">
          <span class="w-2 h-2 bg-[var(--accent)]"></span>
          <span>Section // 03</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-bold font-display tracking-tight">
          Capabilities Matrix
        </h2>
      </div>
      <p class="text-sm font-mono text-[var(--text-secondary)] mt-4 md:mt-0">
        [ Engineering Disciplines & Runtime Stacks ]
      </p>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each Object.entries(grouped) as [category, items], idx}
        <div class="rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs font-mono text-[var(--text-tertiary)] mb-4 pb-3 hairline-b">
              <span>{category.toUpperCase()}</span>
              <span>{(idx + 1).toString().padStart(2, '0')}</span>
            </div>

            <div class="space-y-3">
              {#each items as item}
                <div class="flex items-center justify-between py-1.5 text-sm">
                  <div class="flex items-center gap-2">
                    {#if item.isHighlighted}
                      <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" title="Core Specialty"></span>
                    {:else}
                      <span class="w-1.5 h-1.5 rounded-full bg-[var(--border-subtle)]"></span>
                    {/if}
                    <span class="font-medium {item.isHighlighted ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-secondary)]'}">
                      {item.name}
                    </span>
                  </div>
                  <span class="text-xs font-mono text-[var(--text-tertiary)] px-2 py-0.5 rounded bg-[var(--surface-muted)]">
                    {item.level}
                  </span>
                </div>
              {/each}
            </div>
          </div>

          <div class="pt-6 mt-6 hairline-t text-[11px] font-mono text-[var(--text-tertiary)] flex justify-between">
            <span>INDEX SIZE</span>
            <span>{items.length} TECHNOLOGIES</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
