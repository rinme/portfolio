<script lang="ts">
  import { theme } from '#lib/theme.svelte';
  import { Sun, Moon, ArrowUpRight } from 'phosphor-svelte';
  import type { SocialLink } from '#lib/db/schema';
  import SocialIcon from './SocialIcon.svelte';

  let { name = 'Portfolio', availabilityStatus = 'Available', activeSocials = [] } = $props<{
    name?: string;
    availabilityStatus?: string;
    activeSocials?: SocialLink[];
  }>();
</script>

<header class="sticky top-0 z-50 hairline-b backdrop-blur-md bg-[var(--bg-canvas)]/90 transition-colors">
  <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <!-- Brand & Status -->
    <div class="flex items-center gap-4">
      <a href="/" class="font-display font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
        {name}
      </a>
      <div class="hidden sm:flex items-center gap-2 px-2.5 py-1 text-xs font-mono rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--text-secondary)]">
        <span class="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
        <span>{availabilityStatus}</span>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
      <a href="#projects" class="hover:text-[var(--text-primary)] transition-colors">Work</a>
      <a href="#experience" class="hover:text-[var(--text-primary)] transition-colors">Career</a>
      <a href="#skills" class="hover:text-[var(--text-primary)] transition-colors">Capabilities</a>
      <a href="#testimonials" class="hover:text-[var(--text-primary)] transition-colors">Endorsements</a>
      <a href="#contact" class="hover:text-[var(--text-primary)] transition-colors">Contact</a>
    </nav>

    <!-- Actions: Theme toggle & Socials & Admin -->
    <div class="flex items-center gap-3">
      <!-- Active Social Quick Links -->
      <div class="hidden lg:flex items-center gap-2 mr-2">
        {#each activeSocials.slice(0, 3) as social}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors"
            title={social.platform}
          >
            <SocialIcon icon={social.icon} size={15} />
          </a>
        {/each}
      </div>

      <!-- Theme Switcher -->
      <button
        onclick={() => theme.toggle()}
        type="button"
        class="p-2 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
        aria-label="Toggle theme"
      >
        {#if theme.current === 'dark'}
          <Sun size={17} weight="bold" />
        {:else}
          <Moon size={17} weight="bold" />
        {/if}
      </button>

      <a
        href="/admin"
        class="px-3.5 py-1.5 text-xs font-mono font-medium rounded border border-[var(--border-strong)] bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-opacity"
      >
        Admin / CRM
      </a>
    </div>
  </div>
</header>
