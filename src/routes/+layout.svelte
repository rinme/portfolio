<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { theme } from '#lib/theme.svelte';

  let { children } = $props();

  onMount(() => {
    theme.init();
  });
</script>

<svelte:head>
  <meta name="color-scheme" content="dark light" />
</svelte:head>

{@render children?.()}
