<script lang="ts">
  import type { Profile, SocialLink } from '#lib/db/schema';
  import { ArrowUpRight } from 'phosphor-svelte';
  import SocialIcon from './SocialIcon.svelte';

  let { profile, activeSocials = [] } = $props<{
    profile: Profile;
    activeSocials: SocialLink[];
  }>();
</script>

<footer class="py-16 sm:py-24 bg-[var(--surface-muted)] text-[var(--text-primary)]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
      <div>
        <div class="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-2">ENGINEERING PORTFOLIO</div>
        <div class="text-2xl sm:text-4xl font-extrabold font-display">{profile.name}</div>
        <div class="text-xs font-mono text-[var(--text-secondary)] mt-1">Bangkok, Thailand • UTC+7</div>
      </div>

      <div class="flex flex-wrap items-center gap-4 text-xs font-mono">
        {#each activeSocials as social}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1 hover:text-[var(--accent)] transition-colors"
          >
            <SocialIcon icon={social.icon} size={14} />
            <span>{social.platform}</span>
            <ArrowUpRight size={10} class="opacity-60" />
          </a>
        {/each}
        <a href="/admin" class="hover:text-[var(--accent)] transition-colors text-[var(--text-tertiary)]">
          [Control Plane]
        </a>
      </div>
    </div>

    <!-- Designed Close Monument -->
    <div class="monument-text font-extrabold text-[12vw] sm:text-[14vw] tracking-tighter text-[var(--text-primary)]/10 text-center select-none uppercase pointer-events-none">
      {profile.name}
    </div>

    <div class="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-tertiary)]">
      <div>© {new Date().getFullYear()} Rinme. All rights reserved.</div>
      <div>Built with SvelteKit 2, Bun, Tailwind CSS v4, and LibSQL.</div>
    </div>
  </div>
</footer>
