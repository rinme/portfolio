<script lang="ts">
  import type { Project } from '#lib/db/schema';
  import { ArrowUpRight, GithubLogo, Sparkle } from 'phosphor-svelte';

  let { projects = [] } = $props<{
    projects: Project[];
  }>();

  function parseTags(tagsJson: string): string[] {
    try {
      const parsed = JSON.parse(tagsJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
</script>

<section id="projects" class="hairline-b py-20 px-6">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 hairline-b pb-8">
      <div>
        <div class="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-3">
          <span class="w-2 h-2 bg-[var(--accent)]"></span>
          <span>Section // 01</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-bold font-display tracking-tight">
          Selected Engineering Work
        </h2>
      </div>
      <p class="text-sm font-mono text-[var(--text-secondary)] mt-4 md:mt-0">
        [ {projects.length} Verified Systems & Case Studies ]
      </p>
    </div>

    <!-- Projects Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {#each projects as project, i}
        {@const tags = parseTags(project.tags)}
        <article class="group rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] hover:border-[var(--border-strong)] transition-all flex flex-col justify-between overflow-hidden">
          <!-- Card Top: Image / Specimen Preview -->
          {#if project.imageUrl}
            <div class="aspect-video w-full overflow-hidden hairline-b bg-[var(--surface-muted)] relative">
              <img
                src={project.imageUrl}
                alt={project.title}
                class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-300"
              />
              {#if project.featured}
                <div class="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-[var(--accent)] text-white rounded font-medium flex items-center gap-1 shadow-sm">
                  <Sparkle size={11} weight="fill" /> Featured
                </div>
              {/if}
            </div>
          {/if}

          <!-- Content Body -->
          <div class="p-6 sm:p-8 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-xs font-mono text-[var(--text-tertiary)] mb-3">
                <span>{(i + 1).toString().padStart(2, '0')} // CASE</span>
                {#if project.impactMetric}
                  <span class="text-[var(--accent)] font-semibold">{project.impactMetric}</span>
                {/if}
              </div>

              <h3 class="text-2xl font-bold font-display mb-2 text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                {project.title}
              </h3>

              <p class="text-sm font-medium text-[var(--text-secondary)] mb-4">
                {project.tagline}
              </p>

              <p class="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                {project.description}
              </p>
            </div>

            <!-- Tags & Action Links -->
            <div class="pt-6 hairline-t">
              <div class="flex flex-wrap gap-1.5 mb-6">
                {#each tags as tag}
                  <span class="px-2 py-0.5 text-xs font-mono rounded bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                    {tag}
                  </span>
                {/each}
              </div>

              <div class="flex items-center gap-4 text-xs font-mono">
                {#if project.liveUrl}
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-1.5 text-[var(--text-primary)] hover:text-[var(--accent)] font-semibold transition-colors"
                  >
                    <span>Inspect Live</span>
                    <ArrowUpRight size={14} />
                  </a>
                {/if}
                {#if project.repoUrl}
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <GithubLogo size={14} />
                    <span>Source Code</span>
                  </a>
                {/if}
              </div>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
