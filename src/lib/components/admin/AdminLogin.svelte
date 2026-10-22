<script lang="ts">
  import { LockSimple, ArrowLeft, WarningCircle } from 'phosphor-svelte';
  import { enhance } from '$app/forms';

  let password = $state('');
  let isSubmitting = $state(false);
  let { form }: { form?: { error?: string } } = $props();
</script>

<div class="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-canvas)] text-[var(--text-primary)]">
  <div class="w-full max-w-md rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] p-8 sm:p-10 shadow-sm">
    <div class="flex items-center justify-between mb-8 pb-4 hairline-b">
      <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
        <span class="w-2 h-2 bg-[var(--accent)]"></span>
        <span>Admin Security Gate</span>
      </div>
      <a href="/" class="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1">
        <ArrowLeft size={13} />
        <span>Return</span>
      </a>
    </div>

    <div class="mb-8">
      <h1 class="text-2xl font-bold font-display mb-2">Back-Office Control</h1>
      <p class="text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
        Input the master admin key to access the mini-CRM pipeline and content control plane.
      </p>
    </div>

    {#if form?.error}
      <div class="mb-6 p-3 text-xs font-mono rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-2">
        <WarningCircle size={16} />
        <span>{form.error}</span>
      </div>
    {/if}

    <form
      method="POST"
      action="?/login"
      use:enhance={() => {
        isSubmitting = true;
        return async ({ update }) => {
          isSubmitting = false;
          await update();
        };
      }}
      class="space-y-6"
    >
      <div>
        <label for="password" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">
          Master Password
        </label>
        <div class="relative">
          <input
            id="password"
            name="password"
            type="password"
            required
            bind:value={password}
            placeholder="••••••••••••"
            class="w-full pl-3.5 pr-10 py-2.5 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
          />
          <div class="absolute right-3 top-3 text-[var(--text-tertiary)]">
            <LockSimple size={16} />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        class="w-full py-2.5 px-4 text-xs font-mono font-medium rounded bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
      >
        {#if isSubmitting}
          <span>Verifying Authorization...</span>
        {:else}
          <span>Authenticate Session</span>
        {/if}
      </button>
    </form>
  </div>
</div>
