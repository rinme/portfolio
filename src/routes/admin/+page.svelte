<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import AdminLogin from '#lib/components/admin/AdminLogin.svelte';
  import AdminDashboard from '#lib/components/admin/AdminDashboard.svelte';

  let { data, form }: { data: PageData; form?: ActionData } = $props();
</script>

<svelte:head>
  <title>Admin Control Plane & Mini-CRM</title>
</svelte:head>

{#if !data.authenticated}
  <AdminLogin {form} />
{:else}
  <AdminDashboard
    profile={data.profile!}
    socialLinks={data.socialLinks!}
    projects={data.projects!}
    experiences={data.experiences!}
    skills={data.skills!}
    testimonials={data.testimonials!}
    inquiries={data.inquiries!}
  />
{/if}
