<script lang="ts">
  import type { PageData } from './$types';
  import Navbar from '#lib/components/Navbar.svelte';
  import Hero from '#lib/components/Hero.svelte';
  import Projects from '#lib/components/Projects.svelte';
  import Experience from '#lib/components/Experience.svelte';
  import Capabilities from '#lib/components/Capabilities.svelte';
  import Testimonials from '#lib/components/Testimonials.svelte';
  import ContactForm from '#lib/components/ContactForm.svelte';
  import Footer from '#lib/components/Footer.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{data.profile ? `${data.profile.name} — ${data.profile.role}` : 'Engineering Portfolio'}</title>
  <meta name="description" content={data.profile?.headline || data.profile?.bio || 'Personal Engineering Portfolio'} />
</svelte:head>

<div class="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-200">
  <Navbar
    name={data.profile?.name || 'Portfolio'}
    availabilityStatus={data.profile?.availabilityStatus || 'Available'}
    activeSocials={data.activeSocials}
  />

  <main class="flex-1">
    {#if data.profile}
      <Hero profile={data.profile} activeSocials={data.activeSocials} />
    {/if}

    <Projects projects={data.projects} />
    <Experience experiences={data.experiences} />
    <Capabilities skills={data.skills} />
    <Testimonials testimonials={data.testimonials} />
    <ContactForm email={data.profile?.email || 'contact@example.dev'} />
  </main>

  {#if data.profile}
    <Footer profile={data.profile} activeSocials={data.activeSocials} />
  {/if}
</div>
