<script lang="ts">
  import type { Profile, SocialLink } from '#lib/db/schema';
  import { ArrowUpRight, EnvelopeSimple, MapPin } from 'phosphor-svelte';
  import SocialIcon from './SocialIcon.svelte';
  import LatencyProbe from './LatencyProbe.svelte';

  let { profile, activeSocials = [] } = $props<{
    profile: Profile;
    activeSocials: SocialLink[];
  }>();
</script>

<section class="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden border-b border-[var(--border-subtle)]">
  <div class="max-w-7xl mx-auto px-6">
    <!-- Top Narrative Asymmetric Split -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12 sm:mb-20">
      <div class="lg:col-span-5">
        <h1 class="text-6xl sm:text-8xl lg:text-9xl font-extrabold font-display leading-none tracking-tight text-[var(--text-primary)]">
          {profile.headline || 'yo'}
        </h1>
        <div class="flex items-center gap-3 text-xs font-mono text-[var(--text-secondary)] mt-4">
          <span class="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
          <span>{profile.role}</span>
          <span>•</span>
          <span class="flex items-center gap-1"><MapPin size={13} /> {profile.location}</span>
        </div>
      </div>

      <div class="lg:col-span-7 lg:pl-8 space-y-6">
        <p class="text-lg sm:text-2xl text-[var(--text-primary)] font-normal leading-relaxed max-w-2xl">
          {profile.bio}
        </p>

        <div class="flex flex-wrap items-center gap-4 text-xs font-mono">
          <a
            href="mailto:{profile.email}"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--surface-muted)] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors border border-[var(--border-subtle)]"
          >
            <EnvelopeSimple size={14} class="text-[var(--accent)]" />
            <span>{profile.email}</span>
          </a>

          {#each activeSocials as social}
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--surface-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-subtle)]"
            >
              <SocialIcon icon={social.icon} size={13} />
              <span>{social.platform}</span>
              <ArrowUpRight size={11} class="opacity-60" />
            </a>
          {/each}
        </div>
      </div>
    </div>

    <!-- The Monument Baseline -->
    <div class="py-6 sm:py-10 border-y border-[var(--border-subtle)] my-8 sm:my-14 overflow-hidden select-none">
      <div class="monument-text font-extrabold text-[15vw] sm:text-[17vw] tracking-tighter text-[var(--text-primary)] text-center leading-[0.8] uppercase pointer-events-none">
        {profile.name}
      </div>
    </div>

    <!-- Bottom Stage: Profile Specimen & Live Edge Latency Probe -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
      <div class="lg:col-span-4 flex items-center gap-5 p-4 rounded bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
        <div class="w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden shrink-0 bg-[var(--surface-card)] border border-[var(--border-subtle)]">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            class="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
          />
        </div>
        <div class="text-xs space-y-1.5">
          <div class="font-mono text-[var(--text-tertiary)] uppercase text-[10px]">OPERATING DISCIPLINE</div>
          <div class="font-bold text-sm text-[var(--text-primary)]">{profile.role}</div>
          <div class="text-[var(--text-secondary)] font-mono text-[11px] leading-tight">
            5+ Years Autonomous Coding • Systems Sympathy
          </div>
        </div>
      </div>

      <div class="lg:col-span-8">
        <LatencyProbe />
      </div>
    </div>
  </div>
</section>
