<script lang="ts">
  import type { Skill } from '#lib/db/schema';
  import { Cpu, Globe, Database, Wrench } from 'phosphor-svelte';

  let { skills = [] }: { skills: Skill[] } = $props();

  const categories = [
    { name: 'Frontend & interfaces', icon: Globe },
    { name: 'Systems & backend', icon: Cpu },
    { name: 'Storage, edge & devOps', icon: Database },
    { name: 'Protocols & tools', icon: Wrench },
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

<section id="capabilities" class="py-20 sm:py-32">
  <div class="max-w-7xl mx-auto px-6">
    <div class="max-w-2xl mb-16 animate-reveal">
      <h2 class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
        Technical Capabilities
      </h2>
      <p class="text-base sm:text-lg text-[var(--text-secondary)] mt-3">
        Disciplines, runtime engines, and core protocols practiced and deployed over 5+ years of autonomous coding.
      </p>
    </div>

    <!-- Architectural Disciplines Unboxed Matrix -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      {#each categories as category, index}
        {@const groupSkills = getSkillsByCategory(category.name)}
        <div class="space-y-6 animate-reveal" style="animation-delay: {index * 100}ms;">
          <div class="flex items-center gap-3 text-lg font-bold font-display text-[var(--text-primary)]">
            <category.icon size={22} class="text-[var(--accent)]" />
            <span>{category.name}</span>
          </div>

          <div class="space-y-4">
            {#each groupSkills as skill}
              <div class="flex items-center justify-between text-sm py-1">
                <div class="flex items-center gap-2">
                  {#if skill.isHighlighted}
                    <span class="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" title="Core Specialization"></span>
                  {/if}
                  <span class="font-medium text-[var(--text-primary)]">{skill.name}</span>
                </div>
                <span class="text-sm text-[var(--text-tertiary)]">{skill.level}</span>
              </div>
            {/each}
          </div>

          <div class="pt-3 text-sm text-[var(--text-tertiary)]">
            {groupSkills.length} verified competencies
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
