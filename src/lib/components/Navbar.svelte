<script lang="ts">
  import type { SocialLink } from '#lib/db/schema';
  import { theme } from '#lib/theme.svelte';
  import { Sun, Moon, ArrowUpRight } from 'phosphor-svelte';
  import SocialIcon from './SocialIcon.svelte';

  let {
    name = 'Rinme',
    availabilityStatus = 'Open for full-stack commission.',
    activeSocials = [],
  } = $props<{
    name?: string;
    availabilityStatus?: string;
    activeSocials?: SocialLink[];
  }>();
</script>

<header class="sticky top-0 z-50 bg-[var(--bg-canvas)]/95 backdrop-blur-md transition-colors border-b border-[var(--border-subtle)]">
  <div class="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
    <!-- Brand Wordmark & Availability -->
    <div class="flex items-center gap-5">
      <a href="/" class="font-display font-extrabold text-xl tracking-tight hover:opacity-80 transition-opacity">
        {name}
      </a>
      <div class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[var(--accent-subtle)] text-[var(--text-primary)]">
        <span class="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
        <span>{availabilityStatus}</span>
      </div>
    </div>

    <!-- Navigation Anchors -->
    <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
      <a href="#work" class="hover:text-[var(--text-primary)] transition-colors">Work</a>
      <a href="#capabilities" class="hover:text-[var(--text-primary)] transition-colors">Capabilities</a>
      <a href="#origin" class="hover:text-[var(--text-primary)] transition-colors">Origin</a>
      <a href="#contact" class="hover:text-[var(--text-primary)] transition-colors">Inquiry</a>
    </nav>

    <!-- Socials & Actions -->
    <div class="flex items-center gap-3">
      <div class="hidden lg:flex items-center gap-1.5 mr-1">
        {#each activeSocials as social}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] rounded hover:bg-[var(--surface-muted)] transition-colors"
            title={social.platform}
          >
            <SocialIcon icon={social.icon} size={16} />
          </a>
        {/each}
      </div>

      <!-- Daylight / Obsidian Theme Switcher -->
      <button
        type="button"
        onclick={() => theme.toggle()}
        class="p-2 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors"
        aria-label="Toggle theme"
      >
        {#if theme.current === 'dark'}
          <Sun size={18} class="text-[var(--accent)]" />
        {:else}
          <Moon size={18} />
        {/if}
      </button>

      <a
        href="#contact"
        class="hidden sm:inline-flex px-4 py-2 text-xs font-mono font-medium rounded bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:bg-[var(--accent)] hover:text-white transition-all"
      >
        Initiate Commission
      </a>
    </div>
  </div>
</header>
