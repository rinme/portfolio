<script lang="ts">
  import type { Testimonial } from '#lib/db/schema';
  import { Quotes } from 'phosphor-svelte';

  let { testimonials = [] } = $props<{
    testimonials: Testimonial[];
  }>();
</script>

<section id="testimonials" class="hairline-b py-20 px-6">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 hairline-b pb-8">
      <div>
        <div class="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-3">
          <span class="w-2 h-2 bg-[var(--accent)]"></span>
          <span>Section // 04</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-bold font-display tracking-tight">
          Engineering Endorsements
        </h2>
      </div>
      <p class="text-sm font-mono text-[var(--text-secondary)] mt-4 md:mt-0">
        [ Colleague & Leadership Attestations ]
      </p>
    </div>

    <!-- Testimonials Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each testimonials as t, i}
        <div class="rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] p-8 flex flex-col justify-between hover:border-[var(--border-strong)] transition-all">
          <div class="mb-6">
            <div class="text-[var(--accent)] mb-4">
              <Quotes size={28} weight="fill" />
            </div>
            <p class="text-base text-[var(--text-primary)] leading-relaxed italic">
              "{t.content}"
            </p>
          </div>

          <div class="pt-6 hairline-t flex items-center gap-3">
            {#if t.avatarUrl}
              <img
                src={t.avatarUrl}
                alt={t.author}
                class="w-10 h-10 rounded-full object-cover border border-[var(--border-subtle)] grayscale"
              />
            {:else}
              <div class="w-10 h-10 rounded-full bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex items-center justify-center font-mono font-bold text-xs text-[var(--text-secondary)]">
                {t.author.slice(0, 2).toUpperCase()}
              </div>
            {/if}

            <div>
              <div class="font-bold text-sm text-[var(--text-primary)]">{t.author}</div>
              <div class="text-xs font-mono text-[var(--text-secondary)]">
                {t.role} &mdash; <span class="text-[var(--text-tertiary)]">{t.company}</span>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
