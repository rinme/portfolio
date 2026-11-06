<script lang="ts">
  import type { Project } from '#lib/db/schema';
  import { ArrowUpRight, GithubLogo, Globe } from 'phosphor-svelte';

  let { projects = [] }: { projects: Project[] } = $props();

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

  const flagshipProjects = $derived(projects.filter(p => p.featured));
  const catalogueProjects = $derived(filteredProjects.filter(p => !p.featured));
</script>

<section id="work" class="py-20 sm:py-32">
  <div class="max-w-7xl mx-auto px-6">
    <!-- Section Header (Strict 2-Line Headline Ceiling) -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 animate-reveal">
      <div>
        <h2 class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
          Selected Work
        </h2>
        <p class="text-base sm:text-lg text-[var(--text-secondary)] mt-3 max-w-xl">
          Seven production systems, edge tools, and geospatial platforms built and maintained by Rinme.
        </p>
      </div>

      <!-- Clean Filter Pills -->
      <div class="flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          onclick={() => (selectedCategory = 'all')}
          class="px-4 py-2 rounded-full transition-colors cursor-pointer {selectedCategory === 'all' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
        >
          All ({projects.length})
        </button>
        <button
          type="button"
          onclick={() => (selectedCategory = 'edge')}
          class="px-4 py-2 rounded-full transition-colors cursor-pointer {selectedCategory === 'edge' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
        >
          Low-Latency & Edge
        </button>
        <button
          type="button"
          onclick={() => (selectedCategory = 'geospatial')}
          class="px-4 py-2 rounded-full transition-colors cursor-pointer {selectedCategory === 'geospatial' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}"
        >
          Geospatial & Map
        </button>
      </div>
    </div>

    <!-- Tier 1: Flagship Architectural Spreads (Unboxed editorial layout) -->
    <div class="space-y-24 sm:space-y-36 mb-24 sm:mb-36">
      {#each flagshipProjects as project, index}
        <article
          class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-reveal"
          style="animation-delay: {index * 100}ms;"
        >
          <div class="lg:col-span-6 space-y-6 {index % 2 === 1 ? 'lg:order-2' : ''}">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--surface-muted)] text-[var(--accent)] text-sm font-semibold">
              <span>{project.impactMetric || 'Flagship Architecture'}</span>
            </div>

            <h3 class="text-3xl sm:text-5xl font-extrabold font-display text-[var(--text-primary)] tracking-tight">
              {project.title}
            </h3>

            <p class="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl">
              {project.description}
            </p>

            <div class="flex flex-wrap gap-2">
              {#each parseTags(project.tags) as tag}
                <span class="px-3 py-1 text-sm rounded bg-[var(--surface-muted)] text-[var(--text-secondary)]">
                  {tag}
                </span>
              {/each}
            </div>

            <div class="flex items-center gap-4 pt-3 text-sm">
              {#if project.liveUrl}
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  <Globe size={16} />
                  <span>Live Platform</span>
                  <ArrowUpRight size={14} />
                </a>
              {/if}

              {#if project.repoUrl}
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--surface-muted)] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                >
                  <GithubLogo size={16} />
                  <span>Repository</span>
                </a>
              {/if}
            </div>
          </div>

          <div class="lg:col-span-6 {index % 2 === 1 ? 'lg:order-1' : ''}">
            <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-[var(--surface-muted)] group">
              <img
                src={project.imageUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80'}
                alt={project.title}
                width="640"
                height="400"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </article>
      {/each}
    </div>

    <!-- Tier 2: The Specimen Index (Clean unboxed catalogue) -->
    <div class="pt-8">
      <div class="text-base font-semibold text-[var(--text-tertiary)] mb-8">
        Shipped applications catalogue ({catalogueProjects.length})
      </div>

      <div class="space-y-6">
        {#each catalogueProjects as project}
          <div class="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group transition-colors">
            <div class="space-y-2 max-w-2xl">
              <div class="flex items-center gap-3">
                <span class="text-2xl sm:text-3xl font-bold font-display text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {project.title}
                </span>
                {#if project.impactMetric}
                  <span class="hidden sm:inline-block text-sm text-[var(--text-tertiary)]">
                    // {project.impactMetric}
                  </span>
                {/if}
              </div>
              <p class="text-base text-[var(--text-secondary)] leading-relaxed">
                {project.tagline || project.description}
              </p>
              <div class="flex flex-wrap gap-2 pt-1">
                {#each parseTags(project.tags) as tag}
                  <span class="text-sm text-[var(--text-tertiary)] bg-[var(--surface-muted)] px-3 py-1 rounded">#{tag}</span>
                {/each}
              </div>
            </div>

            <div class="flex items-center gap-4 text-sm shrink-0">
              {#if project.liveUrl}
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-4 py-2 rounded-full bg-[var(--surface-muted)] text-[var(--text-primary)] hover:text-[var(--accent)] transition-all flex items-center gap-1.5 font-medium"
                >
                  <span>Launch</span>
                  <ArrowUpRight size={14} />
                </a>
              {/if}
              {#if project.repoUrl}
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-2.5 rounded-full bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  title="Source Code"
                >
                  <GithubLogo size={18} />
                </a>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
