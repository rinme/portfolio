<script lang="ts">
  import type { Skill } from '#lib/db/schema';
  import { Cpu, Globe, Database, Wrench } from 'phosphor-svelte';

  let { skills = [] } = $props<{ skills: Skill[] }>();

  const categories = [
    { name: 'Frontend & Interfaces', icon: Globe },
    { name: 'Systems & Backend', icon: Cpu },
    { name: 'Storage, Edge & DevOps', icon: Database },
    { name: 'Protocols & Tools', icon: Wrench },
  ];

  function getSkillsByCategory(category: string) {
    const key = category.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const firstWord = key.split(/\s+/)[0];
    return skills.filter(s => {
      const cat = s.category.toLowerCase();
      if (cat === category.toLowerCase()) return true;
      if (firstWord === 'storage' && (cat.includes('storage') || cat.includes('devops') || cat.includes('database'))) return true;
      if (firstWord === 'frontend' && (cat.includes('frontend') || cat.includes('ui') || cat.includes('interface'))) return true;
      if (firstWord === 'systems' && (cat.includes('system') || cat.includes('backend'))) return true;
      if (firstWord === 'protocols' && (cat.includes('protocol') || cat.includes('tool'))) return true;
      return cat.includes(firstWord);
    });
  }
</script>

<section id="capabilities" class="py-20 sm:py-32 border-b border-[var(--border-subtle)]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="max-w-2xl mb-16">
      <h2 class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
        Technical Capabilities
      </h2>
      <p class="text-base sm:text-lg text-[var(--text-secondary)] mt-3">
        Disciplines, runtime engines, and core protocols practiced and deployed over 5+ years of autonomous coding.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each categories as category}
        {@const groupSkills = getSkillsByCategory(category.name)}
        <div class="p-6 rounded-lg bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mb-6">
              <category.icon size={16} class="text-[var(--accent)]" />
              <span>{category.name}</span>
            </div>

            <div class="space-y-3">
              {#each groupSkills as skill}
                <div class="flex items-center justify-between text-xs py-1.5 border-b border-[var(--border-subtle)]/60">
                  <div class="flex items-center gap-2">
                    {#if skill.isHighlighted}
                      <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" title="Highlighted Skill"></span>
                    {/if}
                    <span class="font-medium text-[var(--text-primary)]">{skill.name}</span>
                  </div>
                  <span class="font-mono text-[10px] text-[var(--text-tertiary)]">{skill.level}</span>
                </div>
              {/each}
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-tertiary)]">
            {groupSkills.length} Verified Modules
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
