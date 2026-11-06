<script lang="ts">
  import { EnvelopeSimple, PaperPlaneTilt, CheckCircle, WarningCircle } from 'phosphor-svelte';

  let { email = 'rin@rinme.me' } = $props<{ email?: string }>();

  let name = $state('');
  let senderEmail = $state('');
  let commissionType = $state('Full-Stack Web Application');
  let message = $state('');

  let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
  let errorMessage = $state('');

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!name || !senderEmail || !message) return;

    status = 'submitting';
    errorMessage = '';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: senderEmail,
          company: commissionType,
          subject: commissionType,
          budget: 'Commission',
          message,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Submission failed');
      }

      status = 'success';
      name = '';
      senderEmail = '';
      message = '';
    } catch (err: any) {
      status = 'error';
      errorMessage = err.message || 'Failed to submit inquiry. Please email directly.';
    }
  }
</script>

<section id="contact" class="py-20 sm:py-32 border-b border-[var(--border-subtle)]">
  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div class="lg:col-span-5 space-y-6">
        <h2 class="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-[var(--text-primary)]">
          Initiate Commission
        </h2>
        <p class="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
          Open for full-stack web application development, edge tools, and low-latency consulting. Tell me what you're building.
        </p>

        <div class="pt-4">
          <div class="text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-2 flex items-center gap-1.5">
            <EnvelopeSimple size={14} class="text-[var(--accent)]" />
            <span>Direct Mailbox</span>
          </div>
          <a
            href="mailto:{email}"
            class="text-2xl sm:text-3xl font-bold font-display text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors underline decoration-[var(--border-subtle)]"
          >
            {email}
          </a>
        </div>
      </div>

      <div class="lg:col-span-7">
        <form onsubmit={handleSubmit} class="p-8 rounded-lg bg-[var(--surface-muted)] border border-[var(--border-subtle)] space-y-5">
          {#if status === 'success'}
            <div class="p-4 rounded bg-[var(--accent-subtle)] border border-[var(--accent)]/40 text-[var(--text-primary)] flex items-center gap-3 text-sm font-mono">
              <CheckCircle size={20} class="text-[var(--accent)] shrink-0" />
              <span>Inquiry received! I will review your message and reply promptly.</span>
            </div>
          {/if}

          {#if status === 'error'}
            <div class="p-4 rounded bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-3 text-sm font-mono">
              <WarningCircle size={20} class="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          {/if}

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="contact-name" class="block text-xs font-mono text-[var(--text-secondary)] mb-1.5 uppercase">Your Name</label>
              <input
                id="contact-name"
                type="text"
                bind:value={name}
                required
                placeholder="Name or Organization"
                class="w-full px-3.5 py-2.5 rounded bg-[var(--surface-card)] text-sm border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label for="contact-email" class="block text-xs font-mono text-[var(--text-secondary)] mb-1.5 uppercase">Your Email</label>
              <input
                id="contact-email"
                type="email"
                bind:value={senderEmail}
                required
                placeholder="email@example.com"
                class="w-full px-3.5 py-2.5 rounded bg-[var(--surface-card)] text-sm border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label for="contact-type" class="block text-xs font-mono text-[var(--text-secondary)] mb-1.5 uppercase">Inquiry Type</label>
            <select
              id="contact-type"
              bind:value={commissionType}
              class="w-full px-3.5 py-2.5 rounded bg-[var(--surface-card)] text-sm border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            >
              <option>Full-Stack Web Application</option>
              <option>Edge Architecture & Low-Latency Systems</option>
              <option>Geospatial / Interactive Map Tool</option>
              <option>Technical Consultation / Other</option>
            </select>
          </div>

          <div>
            <label for="contact-message" class="block text-xs font-mono text-[var(--text-secondary)] mb-1.5 uppercase">Project Brief</label>
            <textarea
              id="contact-message"
              bind:value={message}
              required
              rows={4}
              placeholder="What are the goals, timeline, and scope of your commission?"
              class="w-full px-3.5 py-2.5 rounded bg-[var(--surface-card)] text-sm border border-[var(--border-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            class="w-full sm:w-auto px-6 py-3 rounded bg-[var(--accent)] text-white font-mono text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <PaperPlaneTilt size={14} />
            <span>{status === 'submitting' ? 'Transmitting Ingest...' : 'Send Commission Brief'}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
