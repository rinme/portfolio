<script lang="ts">
  import type { Profile, SocialLink } from '#lib/db/schema';
  import { ArrowUp } from 'phosphor-svelte';
  import SocialIcon from './SocialIcon.svelte';

  let { profile, activeSocials = [] } = $props<{
    profile: Profile;
    activeSocials: SocialLink[];
  }>();

  const currentYear = new Date().getFullYear();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<footer class="py-12 px-6 hairline-t bg-[var(--surface-muted)]/50">
  <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="text-xs font-mono text-[var(--text-secondary)] space-y-1 text-center sm:text-left">
      <div class="font-bold text-[var(--text-primary)]">
        {profile.name} &mdash; {profile.role}
      </div>
      <div>
        Designed under Swiss Editorial Principles. © {currentYear} All rights reserved.
      </div>
    </div>

    <div class="flex items-center gap-4">
      {#each activeSocials as social}
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

      <button
        onclick={scrollToTop}
        type="button"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <span>Top</span>
        <ArrowUp size={12} />
      </button>
    </div>
  </div>
</footer>
