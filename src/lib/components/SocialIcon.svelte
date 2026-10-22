<script lang="ts">
  import {
    GithubLogo,
    LinkedinLogo,
    InstagramLogo,
    FacebookLogo,
    XLogo,
    DiscordLogo,
    YoutubeLogo,
    Link as LinkIcon
  } from 'phosphor-svelte';

  let { icon = 'link', size = 18, class: className = '' } = $props<{
    icon?: string;
    size?: number;
    class?: string;
  }>();

  const iconLower = $derived(icon?.toLowerCase() || 'link');
</script>

{#if iconLower.includes('github')}
  <GithubLogo {size} class={className} weight="regular" />
{:else if iconLower.includes('linkedin')}
  <LinkedinLogo {size} class={className} weight="regular" />
{:else if iconLower.includes('instagram')}
  <InstagramLogo {size} class={className} weight="regular" />
{:else if iconLower.includes('facebook')}
  <FacebookLogo {size} class={className} weight="regular" />
{:else if iconLower.includes('twitter') || iconLower.includes('x')}
  <XLogo {size} class={className} weight="regular" />
{:else if iconLower.includes('discord')}
  <DiscordLogo {size} class={className} weight="regular" />
{:else if iconLower.includes('youtube')}
  <YoutubeLogo {size} class={className} weight="regular" />
{:else}
  <LinkIcon {size} class={className} weight="regular" />
{/if}
