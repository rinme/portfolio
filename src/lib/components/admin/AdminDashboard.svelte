<script lang="ts">
  import {
    Users,
    UserCircle,
    ShareNetwork,
    Briefcase,
    GraduationCap,
    Cpu,
    Quotes,
    SignOut,
    ArrowSquareOut,
    Plus,
    Trash,
    PencilSimple,
    Check,
    X,
    UploadSimple,
    ArrowCounterClockwise,
    EnvelopeSimple,
    Buildings,
    CurrencyDollar,
    Eye,
    EyeSlash
  } from 'phosphor-svelte';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import type {
    Profile,
    SocialLink,
    Project,
    Experience,
    Skill,
    Testimonial,
    Inquiry
  } from '#lib/db/schema';
  import SocialIcon from '#lib/components/SocialIcon.svelte';

  let {
    profile: initialProfile,
    socialLinks: initialSocialLinks,
    projects: initialProjects,
    experiences: initialExperiences,
    skills: initialSkills,
    testimonials: initialTestimonials,
    inquiries: initialInquiries
  } = $props<{
    profile: Profile;
    socialLinks: SocialLink[];
    projects: Project[];
    experiences: Experience[];
    skills: Skill[];
    testimonials: Testimonial[];
    inquiries: Inquiry[];
  }>();

  type TabType = 'inquiries' | 'profile' | 'socials' | 'projects' | 'experience' | 'skills' | 'testimonials';
  let activeTab = $state<TabType>('inquiries');

  // Inquiries State
  let inquiries = $state<Inquiry[]>([]);
  let selectedInquiryId = $state<string | null>(null);
  const selectedInquiry = $derived(inquiries.find((inq) => inq.id === selectedInquiryId) || null);
  let internalNotesDraft = $state('');

  $effect(() => {
    inquiries = initialInquiries;
    if (!selectedInquiryId && initialInquiries.length > 0) {
      selectedInquiryId = initialInquiries[0].id;
    }
  });

  $effect(() => {
    if (selectedInquiry) {
      internalNotesDraft = selectedInquiry.internalNotes || '';
    }
  });

  const newInquiriesCount = $derived(inquiries.filter((i) => i.status === 'NEW').length);

  // Status Colors for CRM
  function getStatusBadge(status: string) {
    switch (status) {
      case 'NEW':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'IN_REVIEW':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'CONTACTED':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'CLOSED':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'ARCHIVED':
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30';
      default:
        return 'bg-zinc-500/10 text-zinc-600 border-zinc-500/30';
    }
  }

  // Toast / Status Message
  let message = $state<{ text: string; type: 'success' | 'error' } | null>(null);
  function notify(text: string, type: 'success' | 'error' = 'success') {
    message = { text, type };
    setTimeout(() => {
      if (message?.text === text) message = null;
    }, 3000);
  }

  async function apiCall(action: string, payload: any) {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Request failed');
      await invalidateAll();
      return data;
    } catch (err: any) {
      notify(err.message, 'error');
      throw err;
    }
  }

  // File Upload Helper
  let isUploading = $state(false);
  async function handleFileUpload(file: File): Promise<string> {
    isUploading = true;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Upload failed');
      notify('File uploaded successfully');
      return data.url;
    } catch (err: any) {
      notify(err.message, 'error');
      throw err;
    } finally {
      isUploading = false;
    }
  }

  // --- CRM Leads Actions ---
  async function updateLeadStatus(id: string, status: string) {
    await apiCall('updateInquiryStatus', { id, status, internalNotes: internalNotesDraft });
    inquiries = inquiries.map((i) => (i.id === id ? { ...i, status } : i));
    notify(`Status updated to ${status}`);
  }

  async function saveLeadNotes(id: string) {
    await apiCall('updateInquiryStatus', { id, status: selectedInquiry?.status, internalNotes: internalNotesDraft });
    inquiries = inquiries.map((i) => (i.id === id ? { ...i, internalNotes: internalNotesDraft } : i));
    notify('Internal CRM notes saved');
  }

  async function deleteLead(id: string) {
    if (!confirm('Are you sure you want to permanently delete this lead?')) return;
    await apiCall('deleteInquiry', { id });
    inquiries = inquiries.filter((i) => i.id !== id);
    if (selectedInquiryId === id) {
      selectedInquiryId = inquiries[0]?.id || null;
    }
    notify('Lead removed');
  }

  // --- Profile Actions ---
  let profile = $state<Profile>($state.snapshot(initialProfile));
  $effect(() => {
    profile = $state.snapshot(initialProfile);
  });

  async function saveProfile(e: SubmitEvent) {
    e.preventDefault();
    await apiCall('updateProfile', profile);
    notify('Profile updated');
  }

  // --- Social Links Actions ---
  let socials = $state<SocialLink[]>([]);
  $effect(() => {
    socials = initialSocialLinks;
  });

  let newSocial = $state({
    platform: 'GitHub',
    url: '',
    icon: 'github',
    isActive: true,
    displayOrder: 1
  });

  async function toggleSocialActive(social: SocialLink) {
    const nextState = !social.isActive;
    await apiCall('toggleSocialLink', { id: social.id, isActive: nextState });
    socials = socials.map((s) => (s.id === social.id ? { ...s, isActive: nextState } : s));
    notify(`${social.platform} active visibility: ${nextState ? 'ON' : 'OFF'}`);
  }

  async function addSocialLink(e: SubmitEvent) {
    e.preventDefault();
    const res = await apiCall('addSocialLink', newSocial);
    socials = [...socials, { id: res.id, ...newSocial, createdAt: Date.now() }];
    newSocial = { platform: 'GitHub', url: '', icon: 'github', isActive: true, displayOrder: socials.length + 1 };
    notify('Social channel added');
  }

  async function deleteSocial(id: string) {
    if (!confirm('Delete this social link?')) return;
    await apiCall('deleteSocialLink', { id });
    socials = socials.filter((s) => s.id !== id);
    notify('Social link removed');
  }

  // --- Projects Actions ---
  let projects = $state<Project[]>([]);
  $effect(() => {
    projects = initialProjects;
  });

  let editingProject = $state<any | null>(null);
  let showProjectModal = $state(false);

  function openProjectModal(p?: Project) {
    if (p) {
      editingProject = {
        ...p,
        tagsInput: JSON.parse(p.tags || '[]').join(', ')
      };
    } else {
      editingProject = {
        title: '',
        slug: '',
        tagline: '',
        description: '',
        impactMetric: '',
        tagsInput: '',
        featured: false,
        displayOrder: projects.length + 1,
        imageUrl: '',
        repoUrl: '',
        liveUrl: ''
      };
    }
    showProjectModal = true;
  }

  async function saveProject(e: SubmitEvent) {
    e.preventDefault();
    const tags = editingProject.tagsInput.split(',').map((t: string) => t.trim()).filter(Boolean);
    const res = await apiCall('saveProject', { ...editingProject, tags });
    showProjectModal = false;
    notify('Project saved');
    window.location.reload();
  }

  async function deleteProject(id: string) {
    if (!confirm('Delete this project?')) return;
    await apiCall('deleteProject', { id });
    projects = projects.filter((p) => p.id !== id);
    notify('Project deleted');
  }

  // --- Experience Actions ---
  let experiences = $state<Experience[]>([]);
  $effect(() => {
    experiences = initialExperiences;
  });

  let editingExp = $state<any | null>(null);
  let showExpModal = $state(false);

  function openExpModal(exp?: Experience) {
    if (exp) {
      editingExp = {
        ...exp,
        highlightsInput: JSON.parse(exp.highlights || '[]').join('\n')
      };
    } else {
      editingExp = {
        role: '',
        company: '',
        companyUrl: '',
        location: '',
        startDate: '',
        endDate: 'Present',
        description: '',
        highlightsInput: '',
        displayOrder: experiences.length + 1
      };
    }
    showExpModal = true;
  }

  async function saveExp(e: SubmitEvent) {
    e.preventDefault();
    const highlights = editingExp.highlightsInput.split('\n').map((h: string) => h.trim()).filter(Boolean);
    await apiCall('saveExperience', { ...editingExp, highlights });
    showExpModal = false;
    notify('Experience saved');
    window.location.reload();
  }

  async function deleteExp(id: string) {
    if (!confirm('Delete this career record?')) return;
    await apiCall('deleteExperience', { id });
    experiences = experiences.filter((e) => e.id !== id);
    notify('Career record deleted');
  }

  // --- Skills Actions ---
  let skills = $state<Skill[]>([]);
  $effect(() => {
    skills = initialSkills;
  });

  let newSkill = $state({
    name: '',
    category: 'Systems & Backend',
    level: 'Proficient',
    isHighlighted: false,
    displayOrder: 1
  });

  async function addSkill(e: SubmitEvent) {
    e.preventDefault();
    const res = await apiCall('saveSkill', newSkill);
    skills = [...skills, { id: res.id, ...newSkill }];
    newSkill = { name: '', category: 'Systems & Backend', level: 'Proficient', isHighlighted: false, displayOrder: skills.length + 1 };
    notify('Skill added');
  }

  async function deleteSkill(id: string) {
    if (!confirm('Delete this skill?')) return;
    await apiCall('deleteSkill', { id });
    skills = skills.filter((s) => s.id !== id);
    notify('Skill removed');
  }

  // --- Testimonials Actions ---
  let testimonials = $state<Testimonial[]>([]);
  $effect(() => {
    testimonials = initialTestimonials;
  });

  let newTestimonial = $state({
    author: '',
    role: '',
    company: '',
    content: '',
    avatarUrl: '',
    displayOrder: 1
  });

  async function addTestimonial(e: SubmitEvent) {
    e.preventDefault();
    const res = await apiCall('saveTestimonial', newTestimonial);
    testimonials = [...testimonials, { id: res.id, ...newTestimonial }];
    newTestimonial = { author: '', role: '', company: '', content: '', avatarUrl: '', displayOrder: testimonials.length + 1 };
    notify('Endorsement added');
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    await apiCall('deleteTestimonial', { id });
    testimonials = testimonials.filter((t) => t.id !== id);
    notify('Endorsement removed');
  }
</script>

<div class="min-h-screen flex flex-col md:flex-row bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans antialiased">
  <!-- Toast Notification -->
  {#if message}
    <div class="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded border shadow-lg text-xs font-mono flex items-center gap-2 {message.type === 'error' ? 'bg-red-500 text-white border-red-600' : 'bg-[var(--text-primary)] text-[var(--bg-canvas)] border-[var(--border-strong)]'}">
      <span>{message.text}</span>
    </div>
  {/if}

  <!-- Split Sidebar (Fixed width on desktop) -->
  <aside class="w-full md:w-64 hairline-r flex flex-col justify-between bg-[var(--surface-card)]">
    <div>
      <!-- Brand & Admin Title -->
      <div class="p-6 hairline-b">
        <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-1">
          <span class="w-2 h-2 bg-[var(--accent)]"></span>
          <span>Control Plane</span>
        </div>
        <div class="font-display font-bold text-lg tracking-tight">Admin CRM</div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="p-3 space-y-1 font-mono text-xs">
        <button
          onclick={() => activeTab = 'inquiries'}
          type="button"
          class="w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors {activeTab === 'inquiries' ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'}"
        >
          <div class="flex items-center gap-2.5">
            <Users size={16} />
            <span>CRM Leads</span>
          </div>
          {#if newInquiriesCount > 0}
            <span class="px-1.5 py-0.5 text-[10px] rounded-full {activeTab === 'inquiries' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--accent-subtle)] text-[var(--accent)] font-bold'}">
              {newInquiriesCount}
            </span>
          {/if}
        </button>

        <button
          onclick={() => activeTab = 'profile'}
          type="button"
          class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors {activeTab === 'profile' ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'}"
        >
          <UserCircle size={16} />
          <span>Profile & Bio</span>
        </button>

        <button
          onclick={() => activeTab = 'socials'}
          type="button"
          class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors {activeTab === 'socials' ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'}"
        >
          <ShareNetwork size={16} />
          <span>Social Channels</span>
        </button>

        <button
          onclick={() => activeTab = 'projects'}
          type="button"
          class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors {activeTab === 'projects' ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'}"
        >
          <Briefcase size={16} />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onclick={() => activeTab = 'experience'}
          type="button"
          class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors {activeTab === 'experience' ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'}"
        >
          <GraduationCap size={16} />
          <span>Experience</span>
        </button>

        <button
          onclick={() => activeTab = 'skills'}
          type="button"
          class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors {activeTab === 'skills' ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'}"
        >
          <Cpu size={16} />
          <span>Capabilities</span>
        </button>

        <button
          onclick={() => activeTab = 'testimonials'}
          type="button"
          class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors {activeTab === 'testimonials' ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-semibold' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]'}"
        >
          <Quotes size={16} />
          <span>Testimonials</span>
        </button>
      </nav>
    </div>

    <!-- Bottom Actions: View Public & Logout -->
    <div class="p-4 hairline-t space-y-2">
      <a
        href="/"
        class="w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
      >
        <span>View Public Site</span>
        <ArrowSquareOut size={14} />
      </a>

      <form method="POST" action="?/logout">
        <button
          type="submit"
          class="w-full flex items-center justify-between px-3 py-2 text-xs font-mono rounded text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <span>End Session</span>
          <SignOut size={14} />
        </button>
      </form>
    </div>
  </aside>

  <!-- Main Content Workspace -->
  <main class="flex-1 flex flex-col min-h-screen overflow-x-hidden">
    <!-- Top Action Bar -->
    <div class="h-16 hairline-b px-8 flex items-center justify-between bg-[var(--surface-card)]">
      <div class="flex items-center gap-3">
        <h2 class="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">
          {activeTab}
        </h2>
      </div>

      <div class="text-xs font-mono text-[var(--text-tertiary)]">
        Bun + SvelteKit Runes Engine
      </div>
    </div>

    <!-- View: CRM Leads Pipeline (Master-Detail) -->
    {#if activeTab === 'inquiries'}
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
        <!-- Master List (5 cols) -->
        <div class="lg:col-span-5 hairline-r overflow-y-auto divide-y divide-[var(--border-subtle)] bg-[var(--surface-card)]">
          {#if inquiries.length === 0}
            <div class="p-12 text-center text-xs font-mono text-[var(--text-tertiary)]">
              No inquiries recorded yet.
            </div>
          {:else}
            {#each inquiries as item}
              <button
                onclick={() => selectedInquiryId = item.id}
                type="button"
                class="w-full text-left p-4 hover:bg-[var(--surface-muted)] transition-colors flex flex-col gap-1.5 {selectedInquiryId === item.id ? 'bg-[var(--surface-muted)] border-l-2 border-l-[var(--accent)]' : ''}"
              >
                <div class="flex items-center justify-between text-xs font-mono">
                  <span class="font-bold text-[var(--text-primary)] truncate max-w-[180px]">{item.name}</span>
                  <span class="px-2 py-0.5 text-[10px] rounded border font-medium uppercase {getStatusBadge(item.status)}">
                    {item.status}
                  </span>
                </div>
                <div class="text-xs font-medium text-[var(--text-secondary)] truncate">
                  {item.subject}
                </div>
                <div class="flex items-center justify-between text-[11px] font-mono text-[var(--text-tertiary)]">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  {#if item.budget}
                    <span>{item.budget}</span>
                  {/if}
                </div>
              </button>
            {/each}
          {/if}
        </div>

        <!-- Detail Pane (7 cols) -->
        <div class="lg:col-span-7 p-6 sm:p-8 overflow-y-auto bg-[var(--bg-canvas)]">
          {#if selectedInquiry}
            <div class="space-y-6 max-w-2xl">
              <!-- Header / Actions -->
              <div class="flex flex-wrap items-center justify-between gap-4 pb-4 hairline-b">
                <div>
                  <div class="text-xs font-mono text-[var(--text-tertiary)] uppercase">Lead Dossier</div>
                  <h3 class="text-xl font-bold font-display">{selectedInquiry.name}</h3>
                </div>

                <div class="flex items-center gap-3">
                  <!-- Status Changer -->
                  <select
                    value={selectedInquiry.status}
                    onchange={(e) => updateLeadStatus(selectedInquiry.id, (e.target as HTMLSelectElement).value)}
                    class="px-2.5 py-1.5 text-xs font-mono rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]"
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_REVIEW">IN_REVIEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>

                  <button
                    onclick={() => deleteLead(selectedInquiry.id)}
                    type="button"
                    class="p-2 text-red-600 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete lead"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>

              <!-- Metadata Grid -->
              <div class="grid grid-cols-2 gap-4 text-xs font-mono">
                <div class="p-3 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]">
                  <div class="text-[var(--text-tertiary)] mb-1">EMAIL</div>
                  <a href="mailto:{selectedInquiry.email}" class="text-[var(--accent)] font-semibold hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div class="p-3 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]">
                  <div class="text-[var(--text-tertiary)] mb-1">COMPANY</div>
                  <div class="font-medium text-[var(--text-primary)]">{selectedInquiry.company || '&mdash;'}</div>
                </div>
                <div class="p-3 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]">
                  <div class="text-[var(--text-tertiary)] mb-1">BUDGET ESTIMATE</div>
                  <div class="font-medium text-[var(--text-primary)]">{selectedInquiry.budget || 'Undisclosed'}</div>
                </div>
                <div class="p-3 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]">
                  <div class="text-[var(--text-tertiary)] mb-1">SUBMITTED ON</div>
                  <div class="font-medium text-[var(--text-primary)]">{new Date(selectedInquiry.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <!-- Message Body -->
              <div class="p-5 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] space-y-2">
                <div class="text-xs font-mono text-[var(--text-tertiary)] uppercase">SUBJECT: {selectedInquiry.subject}</div>
                <p class="text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </p>
              </div>

              <!-- Internal CRM Notes -->
              <div class="space-y-3 pt-4 hairline-t">
                <label for="crm-notes" class="block text-xs font-mono uppercase text-[var(--text-secondary)]">
                  Internal CRM Notes
                </label>
                <textarea
                  id="crm-notes"
                  rows={4}
                  bind:value={internalNotesDraft}
                  placeholder="Record call logs, scope notes, proposal follow-up dates..."
                  class="w-full p-3 text-xs font-mono rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] focus:outline-none focus:border-[var(--border-strong)]"
                ></textarea>
                <div class="flex justify-end">
                  <button
                    onclick={() => saveLeadNotes(selectedInquiry.id)}
                    type="button"
                    class="px-4 py-2 text-xs font-mono rounded bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-opacity"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          {:else}
            <div class="h-full flex items-center justify-center text-xs font-mono text-[var(--text-tertiary)]">
              Select an inquiry from the list to view transmission details.
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- View: Profile & Bio -->
    {#if activeTab === 'profile'}
      <div class="p-8 max-w-3xl overflow-y-auto">
        <form onsubmit={saveProfile} class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="prof-name" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">Display Name</label>
              <input id="prof-name" type="text" bind:value={profile.name} class="w-full px-3.5 py-2 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]" required />
            </div>
            <div>
              <label for="prof-role" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">Role Title</label>
              <input id="prof-role" type="text" bind:value={profile.role} class="w-full px-3.5 py-2 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]" required />
            </div>
          </div>

          <div>
            <label for="prof-headline" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">Headline</label>
            <input id="prof-headline" type="text" bind:value={profile.headline} class="w-full px-3.5 py-2 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]" required />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="prof-loc" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">Location</label>
              <input id="prof-loc" type="text" bind:value={profile.location} class="w-full px-3.5 py-2 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]" required />
            </div>
            <div>
              <label for="prof-avail" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">Availability Status Tag</label>
              <input id="prof-avail" type="text" bind:value={profile.availabilityStatus} class="w-full px-3.5 py-2 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]" required />
            </div>
          </div>

          <div>
            <label for="prof-bio" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">Biography Narrative</label>
            <textarea id="prof-bio" rows={4} bind:value={profile.bio} class="w-full px-3.5 py-2 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]" required></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="prof-avatar" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">Avatar URL</label>
              <input id="prof-avatar" type="text" bind:value={profile.avatarUrl} class="w-full px-3.5 py-2 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]" required />
            </div>
            <div>
              <label for="prof-email" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">Contact Email</label>
              <input id="prof-email" type="email" bind:value={profile.email} class="w-full px-3.5 py-2 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]" required />
            </div>
          </div>

          <div class="flex justify-end pt-4 hairline-t">
            <button type="submit" class="px-6 py-2.5 text-xs font-mono font-medium rounded bg-[var(--accent)] text-white hover:opacity-95 transition-opacity">
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    {/if}

    <!-- View: Social Channels with Active Tag Switch -->
    {#if activeTab === 'socials'}
      <div class="p-8 max-w-4xl space-y-8 overflow-y-auto">
        <!-- New Channel Form -->
        <div class="p-6 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]">
          <div class="text-xs font-mono uppercase text-[var(--text-tertiary)] mb-4">Add Connected Channel</div>
          <form onsubmit={addSocialLink} class="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label for="soc-plat" class="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">Platform</label>
              <input id="soc-plat" type="text" bind:value={newSocial.platform} class="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
            </div>
            <div>
              <label for="soc-url" class="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">Profile URL</label>
              <input id="soc-url" type="url" bind:value={newSocial.url} class="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
            </div>
            <div>
              <label for="soc-icon" class="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">Icon Key</label>
              <select id="soc-icon" bind:value={newSocial.icon} class="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]">
                <option value="github">github</option>
                <option value="linkedin">linkedin</option>
                <option value="twitter">x / twitter</option>
                <option value="discord">discord</option>
                <option value="youtube">youtube</option>
                <option value="instagram">instagram</option>
                <option value="facebook">facebook</option>
                <option value="link">generic link</option>
              </select>
            </div>
            <button type="submit" class="px-4 py-2 text-xs font-mono rounded bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 flex items-center justify-center gap-1.5">
              <Plus size={14} /> Add Channel
            </button>
          </form>
        </div>

        <!-- Channels Table -->
        <div class="rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] overflow-hidden">
          <div class="p-4 hairline-b text-xs font-mono uppercase text-[var(--text-tertiary)] flex justify-between">
            <span>Configured Platforms</span>
            <span>Public Site Visibility Rule: Only Active Tag = ON Shows</span>
          </div>
          <table class="w-full text-left text-xs font-mono">
            <thead class="bg-[var(--surface-muted)]/50 hairline-b">
              <tr>
                <th class="p-3">Platform</th>
                <th class="p-3">Target URL</th>
                <th class="p-3 text-center">Active Tag Switch</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--border-subtle)]">
              {#each socials as social}
                <tr class="hover:bg-[var(--surface-muted)]/30">
                  <td class="p-3 flex items-center gap-2">
                    <SocialIcon icon={social.icon} size={15} />
                    <span class="font-bold">{social.platform}</span>
                  </td>
                  <td class="p-3 text-[var(--text-secondary)] truncate max-w-[200px]">
                    <a href={social.url} target="_blank" rel="noopener noreferrer" class="hover:underline">{social.url}</a>
                  </td>
                  <td class="p-3 text-center">
                    <button
                      onclick={() => toggleSocialActive(social)}
                      type="button"
                      class="px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors inline-flex items-center gap-1.5 {social.isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/30'}"
                    >
                      {#if social.isActive}
                        <Eye size={13} /> Active (ON)
                      {:else}
                        <EyeSlash size={13} /> Hidden (OFF)
                      {/if}
                    </button>
                  </td>
                  <td class="p-3 text-right">
                    <button onclick={() => deleteSocial(social.id)} type="button" class="p-1.5 text-red-600 hover:bg-red-500/10 rounded">
                      <Trash size={14} />
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}

    <!-- View: Projects CRUD -->
    {#if activeTab === 'projects'}
      <div class="p-8 space-y-6 overflow-y-auto">
        <div class="flex items-center justify-between">
          <div class="text-xs font-mono uppercase text-[var(--text-tertiary)]">Case Studies & Systems</div>
          <button onclick={() => openProjectModal()} type="button" class="px-4 py-2 text-xs font-mono rounded bg-[var(--text-primary)] text-[var(--bg-canvas)] flex items-center gap-1.5">
            <Plus size={14} /> New Project
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each projects as project}
            <div class="p-6 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between text-xs font-mono text-[var(--text-tertiary)] mb-2">
                  <span>{project.slug}</span>
                  {#if project.featured}
                    <span class="text-[var(--accent)] font-bold">FEATURED</span>
                  {/if}
                </div>
                <h3 class="text-lg font-bold font-display mb-1">{project.title}</h3>
                <p class="text-xs text-[var(--text-secondary)] mb-3">{project.tagline}</p>
                {#if project.impactMetric}
                  <div class="text-xs font-mono text-[var(--accent)] mb-3 font-semibold">{project.impactMetric}</div>
                {/if}
              </div>

              <div class="pt-4 hairline-t flex items-center justify-between text-xs font-mono">
                <button onclick={() => openProjectModal(project)} type="button" class="text-[var(--text-primary)] hover:underline flex items-center gap-1">
                  <PencilSimple size={13} /> Edit
                </button>
                <button onclick={() => deleteProject(project.id)} type="button" class="text-red-600 hover:underline flex items-center gap-1">
                  <Trash size={13} /> Delete
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- View: Experience CRUD -->
    {#if activeTab === 'experience'}
      <div class="p-8 space-y-6 overflow-y-auto">
        <div class="flex items-center justify-between">
          <div class="text-xs font-mono uppercase text-[var(--text-tertiary)]">Career Tenures</div>
          <button onclick={() => openExpModal()} type="button" class="px-4 py-2 text-xs font-mono rounded bg-[var(--text-primary)] text-[var(--bg-canvas)] flex items-center gap-1.5">
            <Plus size={14} /> New Career Record
          </button>
        </div>

        <div class="space-y-4">
          {#each experiences as exp}
            <div class="p-5 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] flex items-center justify-between">
              <div>
                <div class="text-xs font-mono text-[var(--text-tertiary)]">{exp.startDate} &mdash; {exp.endDate}</div>
                <div class="font-bold text-sm text-[var(--text-primary)]">{exp.role} @ {exp.company}</div>
                <div class="text-xs text-[var(--text-secondary)]">{exp.location}</div>
              </div>

              <div class="flex items-center gap-3 text-xs font-mono">
                <button onclick={() => openExpModal(exp)} type="button" class="p-2 hover:bg-[var(--surface-muted)] rounded">
                  <PencilSimple size={15} />
                </button>
                <button onclick={() => deleteExp(exp.id)} type="button" class="p-2 text-red-600 hover:bg-red-500/10 rounded">
                  <Trash size={15} />
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- View: Skills CRUD -->
    {#if activeTab === 'skills'}
      <div class="p-8 max-w-4xl space-y-8 overflow-y-auto">
        <div class="p-6 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]">
          <div class="text-xs font-mono uppercase text-[var(--text-tertiary)] mb-4">Add Capability / Skill</div>
          <form onsubmit={addSkill} class="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label for="sk-name" class="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">Skill Name</label>
              <input id="sk-name" type="text" bind:value={newSkill.name} class="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
            </div>
            <div>
              <label for="sk-cat" class="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">Category</label>
              <select id="sk-cat" bind:value={newSkill.category} class="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]">
                <option value="Systems & Backend">Systems & Backend</option>
                <option value="Frontend & UI">Frontend & UI</option>
                <option value="Storage & Databases">Storage & Databases</option>
                <option value="DevOps & Infra">DevOps & Infra</option>
                <option value="Tools & Protocols">Tools & Protocols</option>
              </select>
            </div>
            <div>
              <label for="sk-lvl" class="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">Level</label>
              <select id="sk-lvl" bind:value={newSkill.level} class="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]">
                <option value="Expert">Expert</option>
                <option value="Proficient">Proficient</option>
                <option value="Familiar">Familiar</option>
              </select>
            </div>
            <button type="submit" class="px-4 py-2 text-xs font-mono rounded bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 flex items-center justify-center gap-1.5">
              <Plus size={14} /> Add Skill
            </button>
          </form>
        </div>

        <div class="rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] divide-y divide-[var(--border-subtle)]">
          {#each skills as s}
            <div class="p-3 px-4 flex items-center justify-between text-xs font-mono">
              <div class="flex items-center gap-3">
                <span class="font-bold">{s.name}</span>
                <span class="text-[var(--text-tertiary)]">({s.category})</span>
                <span class="px-2 py-0.5 rounded bg-[var(--surface-muted)]">{s.level}</span>
              </div>
              <button onclick={() => deleteSkill(s.id)} type="button" class="text-red-600 hover:bg-red-500/10 p-1.5 rounded">
                <Trash size={14} />
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- View: Testimonials CRUD -->
    {#if activeTab === 'testimonials'}
      <div class="p-8 max-w-4xl space-y-8 overflow-y-auto">
        <div class="p-6 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)]">
          <div class="text-xs font-mono uppercase text-[var(--text-tertiary)] mb-4">Add Endorsement</div>
          <form onsubmit={addTestimonial} class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label for="t-author" class="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">Author</label>
                <input id="t-author" type="text" bind:value={newTestimonial.author} class="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
              </div>
              <div>
                <label for="t-role" class="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">Role</label>
                <input id="t-role" type="text" bind:value={newTestimonial.role} class="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
              </div>
              <div>
                <label for="t-company" class="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">Company</label>
                <input id="t-company" type="text" bind:value={newTestimonial.company} class="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
              </div>
            </div>
            <div>
              <label for="t-quote" class="block text-[11px] font-mono text-[var(--text-secondary)] mb-1">Quote Statement (Max 3 lines)</label>
              <textarea id="t-quote" rows={3} bind:value={newTestimonial.content} class="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required></textarea>
            </div>
            <div class="flex justify-end">
              <button type="submit" class="px-4 py-2 text-xs font-mono rounded bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 flex items-center gap-1.5">
                <Plus size={14} /> Add Endorsement
              </button>
            </div>
          </form>
        </div>

        <div class="space-y-4">
          {#each testimonials as t}
            <div class="p-5 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] flex items-start justify-between gap-4">
              <div>
                <p class="text-xs italic text-[var(--text-primary)] mb-2">"{t.content}"</p>
                <div class="text-xs font-mono text-[var(--text-secondary)] font-bold">{t.author} &mdash; {t.role} @ {t.company}</div>
              </div>
              <button onclick={() => deleteTestimonial(t.id)} type="button" class="text-red-600 hover:bg-red-500/10 p-1.5 rounded">
                <Trash size={14} />
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </main>
</div>

<!-- Modal: Project Edit/Create -->
{#if showProjectModal}
  <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="w-full max-w-2xl rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] p-8 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-4 hairline-b mb-6">
        <h3 class="font-display font-bold text-lg">{editingProject.id ? 'Edit Case Study' : 'Create Case Study'}</h3>
        <button onclick={() => showProjectModal = false} type="button" class="p-1 hover:bg-[var(--surface-muted)] rounded"><X size={18} /></button>
      </div>

      <form onsubmit={saveProject} class="space-y-4 text-xs font-mono">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="m-title" class="block text-[var(--text-secondary)] mb-1">Title</label>
            <input id="m-title" type="text" bind:value={editingProject.title} class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
          </div>
          <div>
            <label for="m-slug" class="block text-[var(--text-secondary)] mb-1">Slug</label>
            <input id="m-slug" type="text" bind:value={editingProject.slug} class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
          </div>
        </div>

        <div>
          <label for="m-tagline" class="block text-[var(--text-secondary)] mb-1">Tagline</label>
          <input id="m-tagline" type="text" bind:value={editingProject.tagline} class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
        </div>

        <div>
          <label for="m-desc" class="block text-[var(--text-secondary)] mb-1">Description</label>
          <textarea id="m-desc" rows={3} bind:value={editingProject.description} class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="m-metric" class="block text-[var(--text-secondary)] mb-1">Impact Metric (e.g. -68% latency)</label>
            <input id="m-metric" type="text" bind:value={editingProject.impactMetric} class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" />
          </div>
          <div>
            <label for="m-tags" class="block text-[var(--text-secondary)] mb-1">Tags (comma separated)</label>
            <input id="m-tags" type="text" bind:value={editingProject.tagsInput} placeholder="SvelteKit, Turso, Edge" class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="m-img" class="block text-[var(--text-secondary)] mb-1">Screenshot URL</label>
            <input id="m-img" type="text" bind:value={editingProject.imageUrl} class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" />
          </div>
          <div class="flex items-center gap-2 pt-5">
            <input id="m-feat" type="checkbox" bind:checked={editingProject.featured} class="rounded" />
            <label for="m-feat">Featured on Public Portfolio</label>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="m-live" class="block text-[var(--text-secondary)] mb-1">Live URL</label>
            <input id="m-live" type="url" bind:value={editingProject.liveUrl} class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" />
          </div>
          <div>
            <label for="m-repo" class="block text-[var(--text-secondary)] mb-1">Repo URL</label>
            <input id="m-repo" type="url" bind:value={editingProject.repoUrl} class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 hairline-t">
          <button onclick={() => showProjectModal = false} type="button" class="px-4 py-2 rounded border border-[var(--border-subtle)]">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded bg-[var(--text-primary)] text-[var(--bg-canvas)]">Save Project</button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Modal: Experience Edit/Create -->
{#if showExpModal}
  <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="w-full max-w-2xl rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] p-8 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-4 hairline-b mb-6">
        <h3 class="font-display font-bold text-lg">{editingExp.id ? 'Edit Career Record' : 'New Career Record'}</h3>
        <button onclick={() => showExpModal = false} type="button" class="p-1 hover:bg-[var(--surface-muted)] rounded"><X size={18} /></button>
      </div>

      <form onsubmit={saveExp} class="space-y-4 text-xs font-mono">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="e-role" class="block text-[var(--text-secondary)] mb-1">Role Title</label>
            <input id="e-role" type="text" bind:value={editingExp.role} class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
          </div>
          <div>
            <label for="e-company" class="block text-[var(--text-secondary)] mb-1">Company</label>
            <input id="e-company" type="text" bind:value={editingExp.company} class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label for="e-loc" class="block text-[var(--text-secondary)] mb-1">Location</label>
            <input id="e-loc" type="text" bind:value={editingExp.location} class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
          </div>
          <div>
            <label for="e-start" class="block text-[var(--text-secondary)] mb-1">Start Date</label>
            <input id="e-start" type="text" bind:value={editingExp.startDate} placeholder="2022" class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
          </div>
          <div>
            <label for="e-end" class="block text-[var(--text-secondary)] mb-1">End Date</label>
            <input id="e-end" type="text" bind:value={editingExp.endDate} placeholder="Present" class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required />
          </div>
        </div>

        <div>
          <label for="e-desc" class="block text-[var(--text-secondary)] mb-1">Summary</label>
          <textarea id="e-desc" rows={2} bind:value={editingExp.description} class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]" required></textarea>
        </div>

        <div>
          <label for="e-hl" class="block text-[var(--text-secondary)] mb-1">Highlights (One bullet per line)</label>
          <textarea id="e-hl" rows={4} bind:value={editingExp.highlightsInput} placeholder="Scaled traffic 10x&#10;Built real-time telemetry" class="w-full p-2 rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)]"></textarea>
        </div>

        <div class="flex justify-end gap-3 pt-4 hairline-t">
          <button onclick={() => showExpModal = false} type="button" class="px-4 py-2 rounded border border-[var(--border-subtle)]">Cancel</button>
          <button type="submit" class="px-5 py-2 rounded bg-[var(--text-primary)] text-[var(--bg-canvas)]">Save Record</button>
        </div>
      </form>
    </div>
  </div>
{/if}
