<script lang="ts">
  import type { Profile, SocialLink } from '#lib/db/schema';
  import { ArrowUpRight } from 'phosphor-svelte';
  import SocialIcon from './SocialIcon.svelte';

  let { profile, activeSocials = [] }: {
    profile: Profile;
    activeSocials: SocialLink[];
  } = $props();
</script>

<footer class="py-16 sm:py-24 bg-[var(--surface-muted)] text-[var(--text-primary)]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-reveal">
      <div>
        <div class="text-sm font-medium text-[var(--text-tertiary)] mb-2">Engineering portfolio</div>
        <div class="text-2xl sm:text-4xl font-extrabold font-display">{profile.name}</div>
        <div class="text-sm text-[var(--text-secondary)] mt-1">Bangkok, Thailand • UTC+7</div>
      </div>

      <div class="flex flex-wrap items-center gap-6 text-sm">
        {#each activeSocials as social}
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors"
          >
            <SocialIcon icon={social.icon} size={16} />
            <span>{social.platform}</span>
            <ArrowUpRight size={12} class="opacity-60" />
          </a>
        {/each}
        <a href="/admin" class="hover:text-[var(--accent)] transition-colors text-[var(--text-tertiary)]">
          Control Plane
        </a>
      </div>
    </div>

    <!-- Designed Close Monument (wrapped in data-ui to mark as presentation artifact) -->
    <div data-ui aria-hidden="true" class="monument-text font-extrabold text-[12vw] sm:text-[14vw] tracking-tighter text-[var(--text-primary)]/10 text-center select-none uppercase pointer-events-none my-12">
      {profile.name}
    </div>

    <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-tertiary)]">
      <div>© {new Date().getFullYear()} Rinme. All rights reserved.</div>
      <div>Built with SvelteKit 2, Bun, Tailwind CSS v4, and LibSQL.</div>
    </div>
  </div>
</footer>
