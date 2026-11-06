<script lang="ts">
  import type { PageData } from './$types';
  import Navbar from '#lib/components/Navbar.svelte';
  import Hero from '#lib/components/Hero.svelte';
  import Projects from '#lib/components/Projects.svelte';
  import Capabilities from '#lib/components/Capabilities.svelte';
  import Experience from '#lib/components/Experience.svelte';
  import ContactForm from '#lib/components/ContactForm.svelte';
  import Footer from '#lib/components/Footer.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.profile ? `${data.profile.name} — ${data.profile.role}` : 'Rinme — Self-Taught Full-Stack Engineer'}</title>
  <meta name="description" content="Self-taught full-stack engineer in Bangkok, TH focusing on low-latency web applications and edge tools." />
</svelte:head>

<div class="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-200">
  <Navbar
    name={data.profile?.name || 'Rinme'}
    availabilityStatus={data.profile?.availabilityStatus || 'Open for full-stack commission.'}
    activeSocials={data.activeSocials}
  />

  <main class="flex-1">
    {#if data.profile}
      <Hero profile={data.profile} activeSocials={data.activeSocials} />
    {/if}

    <Projects projects={data.projects} />
    <Capabilities skills={data.skills} />
    <Experience experiences={data.experiences} />
    <ContactForm email={data.profile?.email || 'rin@rinme.me'} />
  </main>

  {#if data.profile}
    <Footer profile={data.profile} activeSocials={data.activeSocials} />
  {/if}
</div>
