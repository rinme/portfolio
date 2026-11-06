<script lang="ts">
  import type { Project } from '#lib/db/schema';
  import { ArrowUpRight, GithubLogo, Globe } from 'phosphor-svelte';

  let { projects = [] } = $props<{ projects: Project[] }>();

  let selectedCategory = $state<'all' | 'edge' | 'geospatial' | 'web'>('all');

  function parseTags(tagJson: string): string[] {
    try {
      return JSON.parse(tagJson);
    } catch {
      return [];
    }
  }

  let filteredProjects = $derived.by(() => {
    if (selectedCategory === 'all') return projects;
    if (selectedCategory === 'edge') return projects.filter(p => p.slug === 'run' || p.tags.includes('Turso') || p.tags.includes('Edge'));
    if (selectedCategory === 'geospatial') return projects.filter(p => p.slug === 'bkkdmap' || p.slug === 'halfway');
    return projects.filter(p => p.slug !== 'run' && p.slug !== 'bkkdmap');
  });

  const flagshipProjects = $derived(projects.filter(p => p.slug === 'run' || p.slug === 'bkkdmap'));
  const catalogueProjects = $derived(filteredProjects.filter(p => p.slug !== 'run' && p.slug !== 'bkkdmap'));
</script>

<section id="work" class="py-20 sm:py-32 border-b border-[var(--border-subtle)]">
  <div class="max-w-7xl mx-auto px-6">
    <!-- Section Header (Strict 2-Line Headline Ceiling) -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[var(--border-subtle)]">
      <div>
        <h2 class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
          Selected Work
        </h2>
        <p class="text-base sm:text-lg text-[var(--text-secondary)] mt-3 max-w-xl">
          Seven production systems, edge tools, and geospatial platforms built and maintained by Rinme.
        </p>
      </div>

      <!-- Clean Filter Pills -->
      <div class="flex flex-wrap gap-2 text-xs font-mono">
        <button
          type="button"
          onclick={() => (selectedCategory = 'all')}
          class="px-3 py-1.5 rounded border transition-colors {selectedCategory === 'all' ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
        >
          All ({projects.length})
        </button>
        <button
          type="button"
          onclick={() => (selectedCategory = 'edge')}
          class="px-3 py-1.5 rounded border transition-colors {selectedCategory === 'edge' ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
        >
          Low-Latency & Edge
        </button>
        <button
          type="button"
          onclick={() => (selectedCategory = 'geospatial')}
          class="px-3 py-1.5 rounded border transition-colors {selectedCategory === 'geospatial' ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
        >
          Geospatial & Map
        </button>
      </div>
    </div>

    <!-- Tier 1: Flagship Architectural Spreads -->
    <div class="space-y-16 sm:space-y-24 mb-20 sm:mb-28">
      {#each flagshipProjects as project, index}
        <article class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 rounded-lg bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
          <div class="lg:col-span-6 space-y-6 {index % 2 === 1 ? 'lg:order-2' : ''}">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono bg-[var(--surface-card)] text-[var(--accent)] border border-[var(--border-subtle)]">
              <span>{project.impactMetric || 'Flagship Architecture'}</span>
            </div>

            <h3 class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">
              {project.title}
            </h3>

            <p class="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {project.description}
            </p>

            <div class="flex flex-wrap gap-2">
              {#each parseTags(project.tags) as tag}
                <span class="px-2.5 py-1 text-xs font-mono rounded bg-[var(--surface-card)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                  {tag}
                </span>
              {/each}
            </div>

            <div class="flex items-center gap-4 pt-2 font-mono text-xs">
              {#if project.liveUrl}
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  <Globe size={14} />
                  <span>Live Platform</span>
                  <ArrowUpRight size={12} />
                </a>
              {/if}

              {#if project.repoUrl}
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors"
                >
                  <GithubLogo size={14} />
                  <span>Repository</span>
                </a>
              {/if}
            </div>
          </div>

          <div class="lg:col-span-6 {index % 2 === 1 ? 'lg:order-1' : ''}">
            <div class="aspect-[16/10] rounded overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-card)] group">
              <img
                src={project.imageUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80'}
                alt={project.title}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </article>
      {/each}
    </div>

    <!-- Tier 2: The Specimen Index -->
    <div class="border-t border-[var(--border-subtle)] pt-12">
      <div class="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-6">
        Catalogue Index // Shipped Applications ({catalogueProjects.length})
      </div>

      <div class="divide-y divide-[var(--border-subtle)]">
        {#each catalogueProjects as project}
          <div class="py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-[var(--surface-muted)]/40 px-3 rounded transition-colors">
            <div class="space-y-1.5 max-w-xl">
              <div class="flex items-center gap-3">
                <span class="text-xl sm:text-2xl font-bold font-display text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {project.title}
                </span>
                {#if project.impactMetric}
                  <span class="hidden sm:inline-block text-[11px] font-mono text-[var(--text-tertiary)]">
                    // {project.impactMetric}
                  </span>
                {/if}
              </div>
              <p class="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {project.tagline || project.description}
              </p>
              <div class="flex flex-wrap gap-1.5 pt-1">
                {#each parseTags(project.tags) as tag}
                  <span class="text-[11px] font-mono text-[var(--text-tertiary)]">#{tag}</span>
                {/each}
              </div>
            </div>

            <div class="flex items-center gap-3 font-mono text-xs shrink-0">
              {#if project.liveUrl}
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-1.5 rounded bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all flex items-center gap-1"
                >
                  <span>Launch</span>
                  <ArrowUpRight size={12} />
                </a>
              {/if}
              {#if project.repoUrl}
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2 rounded bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors"
                  title="Source Code"
                >
                  <GithubLogo size={14} />
                </a>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
