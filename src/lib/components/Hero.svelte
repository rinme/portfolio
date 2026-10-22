<script lang="ts">
  import type { Profile, SocialLink } from '#lib/db/schema';
  import { ArrowUpRight, MapPin, EnvelopeSimple, FileText } from 'phosphor-svelte';
  import SocialIcon from './SocialIcon.svelte';

  let { profile, activeSocials = [] } = $props<{
    profile: Profile;
    activeSocials: SocialLink[];
  }>();
</script>

<section class="hairline-b relative overflow-hidden">
  <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
    <!-- Left Column: Typography & Intent (8 cols) -->
    <div class="lg:col-span-8 p-8 sm:p-12 lg:p-16 flex flex-col justify-between lg:hairline-r">
      <div>
        <!-- Section Marker -->
        <div class="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-8">
          <span class="w-2 h-2 bg-[var(--accent)]"></span>
          <span>Index // 00 &mdash; Profile & Intent</span>
        </div>

        <!-- Headline & Role -->
        <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display leading-[1.05] tracking-tight mb-8">
          {profile.headline || profile.role}
        </h1>

        <!-- Narrative Bio -->
        <p class="text-lg sm:text-xl text-[var(--text-secondary)] font-normal max-w-2xl leading-relaxed mb-10">
          {profile.bio}
        </p>
      </div>

      <!-- Bottom Meta Strip & CTAs -->
      <div class="pt-8 hairline-t flex flex-wrap items-center justify-between gap-6">
        <div class="flex flex-wrap items-center gap-6 text-sm font-mono text-[var(--text-secondary)]">
          <div class="flex items-center gap-2">
            <MapPin size={16} class="text-[var(--accent)]" />
            <span>{profile.location}</span>
          </div>
          <div class="flex items-center gap-2">
            <EnvelopeSimple size={16} />
            <a href="mailto:{profile.email}" class="hover:text-[var(--text-primary)] underline decoration-[var(--border-subtle)]">
              {profile.email}
            </a>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <a
            href="#contact"
            class="px-5 py-2.5 text-sm font-medium rounded bg-[var(--accent)] text-white hover:opacity-95 transition-all shadow-sm"
          >
            Initiate Contact
          </a>
          {#if profile.resumeUrl}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="px-4 py-2.5 text-sm font-mono flex items-center gap-2 rounded border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors"
            >
              <FileText size={16} />
              <span>Resume</span>
            </a>
          {/if}
        </div>
      </div>
    </div>

    <!-- Right Column: Visual Specimen & Meta (4 cols) -->
    <div class="lg:col-span-4 p-8 sm:p-12 flex flex-col justify-between bg-[var(--surface-muted)]/50">
      <!-- Avatar & Specimen Box -->
      <div class="space-y-6">
        <div class="aspect-square w-full max-w-[280px] mx-auto rounded border border-[var(--border-subtle)] overflow-hidden bg-[var(--surface-card)] p-2">
          <img
            src={profile.avatarUrl || '/uploads/default-avatar.png'}
            alt={profile.name}
            class="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300 rounded-sm"
          />
        </div>

        <div class="space-y-3 font-mono text-xs">
          <div class="flex justify-between py-2 hairline-b text-[var(--text-secondary)]">
            <span>DISCIPLINE</span>
            <span class="font-bold text-[var(--text-primary)]">{profile.role}</span>
          </div>
          <div class="flex justify-between py-2 hairline-b text-[var(--text-secondary)]">
            <span>DEPLOYMENT STATUS</span>
            <span class="text-[var(--accent)] font-semibold uppercase">{profile.availabilityStatus}</span>
          </div>
          <div class="flex justify-between py-2 hairline-b text-[var(--text-secondary)]">
            <span>PRIMARY REPO</span>
            {#if profile.githubUrl}
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" class="hover:text-[var(--accent)] flex items-center gap-1">
                GitHub <ArrowUpRight size={12} />
              </a>
            {:else}
              <span>PRIVATE</span>
            {/if}
          </div>
        </div>
      </div>

      <!-- Active Social Network Channels -->
      {#if activeSocials.length > 0}
        <div class="pt-6 hairline-t mt-6">
          <div class="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
            Connected Channels ({activeSocials.length})
          </div>
          <div class="flex flex-wrap gap-2">
            {#each activeSocials as social}
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all"
              >
                <SocialIcon icon={social.icon} size={14} />
                <span>{social.platform}</span>
                <ArrowUpRight size={12} class="opacity-50" />
              </a>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>
