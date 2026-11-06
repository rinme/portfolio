<script lang="ts">
  import { onMount } from 'svelte';
  import { Lightning, ArrowClockwise } from 'phosphor-svelte';

  interface Cluster {
    id: string;
    city: string;
    country: string;
    flag: string;
    endpoint: string;
    latency: number | null;
    status: 'idle' | 'measuring' | 'success' | 'fallback';
  }

  let clusters = $state<Cluster[]>([
    {
      id: 'sin',
      city: 'Singapore',
      country: 'SIN',
      flag: '🇸🇬',
      endpoint: 'https://1.1.1.1/cdn-cgi/trace',
      latency: null,
      status: 'idle',
    },
    {
      id: 'nrt',
      city: 'Tokyo',
      country: 'NRT',
      flag: '🇯🇵',
      endpoint: 'https://1.0.0.1/cdn-cgi/trace',
      latency: null,
      status: 'idle',
    },
    {
      id: 'sfo',
      city: 'San Francisco',
      country: 'SFO',
      flag: '🇺🇸',
      endpoint: 'https://cloudflare-dns.com/cdn-cgi/trace',
      latency: null,
      status: 'idle',
    },
  ]);

  let isMeasuring = $state(false);

  async function pingCluster(cluster: Cluster) {
    cluster.status = 'measuring';
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      await fetch(cluster.endpoint, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const end = performance.now();
      cluster.latency = Math.round(end - start);
      cluster.status = 'success';
    } catch {
      cluster.latency = null;
      cluster.status = 'fallback';
    }
  }

  async function runAllPings() {
    if (isMeasuring) return;
    isMeasuring = true;
    await Promise.all(clusters.map(pingCluster));
    isMeasuring = false;
  }

  onMount(() => {
    runAllPings();
  });
</script>

<div data-ui class="p-5 rounded-lg bg-[var(--surface-muted)] text-[var(--text-primary)]">
  <div class="flex items-center justify-between gap-4 mb-4 pb-3">
    <div class="flex items-center gap-2 text-sm text-[var(--text-secondary)] font-medium">
      <Lightning size={16} class="text-[var(--accent)]" />
      <span>Edge latency probe</span>
    </div>
    <button
      type="button"
      onclick={runAllPings}
      disabled={isMeasuring}
      class="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-[var(--surface-card)] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors disabled:opacity-50 cursor-pointer"
      aria-label="Re-ping edge clusters"
    >
      <ArrowClockwise size={12} class={isMeasuring ? 'animate-spin text-[var(--accent)]' : ''} />
      <span>{isMeasuring ? 'Probing...' : 'Re-ping'}</span>
    </button>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    {#each clusters as cluster}
      <div class="flex items-center justify-between p-3 rounded bg-[var(--surface-card)]">
        <div class="flex items-center gap-2.5">
          <span class="text-base">{cluster.flag}</span>
          <div>
            <div class="text-xs font-semibold leading-tight">{cluster.city}</div>
            <div class="text-[11px] text-[var(--text-tertiary)]">{cluster.country}</div>
          </div>
        </div>
        <div class="text-right">
          {#if cluster.latency !== null}
            <samp class="font-mono font-bold text-xs text-[var(--text-primary)]">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] mr-1 align-middle"></span>{cluster.latency}ms
            </samp>
          {:else if cluster.status === 'fallback'}
            <samp class="font-mono text-xs text-[var(--text-tertiary)]">--ms (offline)</samp>
          {:else}
            <span class="text-[var(--text-tertiary)] animate-pulse text-xs">...</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>
