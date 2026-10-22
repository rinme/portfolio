<script lang="ts">
  import { EnvelopeSimple, PaperPlaneTilt, CheckCircle, WarningCircle } from 'phosphor-svelte';

  let { email = 'contact@example.dev' } = $props<{
    email?: string;
  }>();

  let name = $state('');
  let emailInput = $state('');
  let company = $state('');
  let subject = $state('');
  let message = $state('');
  let budget = $state('');

  let isSubmitting = $state(false);
  let errorMsg = $state('');
  let success = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    isSubmitting = true;
    errorMsg = '';
    success = false;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: emailInput,
          company,
          subject,
          message,
          budget
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Submission failed');
      }

      success = true;
      name = '';
      emailInput = '';
      company = '';
      subject = '';
      message = '';
      budget = '';
    } catch (err: any) {
      errorMsg = err.message || 'An unexpected error occurred. Please reach out via email.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<section id="contact" class="hairline-b py-20 px-6 bg-[var(--surface-muted)]/20">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 hairline-b pb-8">
      <div>
        <div class="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[var(--text-tertiary)] mb-3">
          <span class="w-2 h-2 bg-[var(--accent)]"></span>
          <span>Section // 05</span>
        </div>
        <h2 class="text-3xl sm:text-5xl font-bold font-display tracking-tight">
          Dispatch Inquiry
        </h2>
      </div>
      <p class="text-sm font-mono text-[var(--text-secondary)] mt-4 md:mt-0">
        [ Direct CRM Intake Pipeline ]
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <!-- Left Column: Context & Protocols (5 cols) -->
      <div class="lg:col-span-5 space-y-6">
        <h3 class="text-2xl font-bold font-display">
          Let’s discuss an architecture, system overhaul, or advisory engagement.
        </h3>
        <p class="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
          Inquiries are automatically logged into my personal engineering CRM. You can expect an initial response within 24–48 hours regarding feasibility, schedule alignment, and scope.
        </p>

        <div class="pt-6 hairline-t space-y-3 font-mono text-xs text-[var(--text-secondary)]">
          <div class="flex justify-between py-1.5 hairline-b">
            <span>DIRECT PROTOCOL</span>
            <a href="mailto:{email}" class="text-[var(--accent)] font-semibold hover:underline">
              {email}
            </a>
          </div>
          <div class="flex justify-between py-1.5 hairline-b">
            <span>SLA RESPONSE WINDOW</span>
            <span class="text-[var(--text-primary)] font-medium">≤ 24 Hours</span>
          </div>
          <div class="flex justify-between py-1.5">
            <span>ACCEPTED SCOPES</span>
            <span class="text-[var(--text-primary)] font-medium">Full-Stack / Systems / Edge</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Intake Form (7 cols) -->
      <div class="lg:col-span-7 rounded border border-[var(--border-subtle)] bg-[var(--surface-card)] p-8 sm:p-10">
        {#if success}
          <div class="py-12 text-center space-y-4">
            <div class="w-12 h-12 mx-auto rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center">
              <CheckCircle size={28} weight="bold" />
            </div>
            <h4 class="text-xl font-bold font-display">Transmission Received</h4>
            <p class="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
              Your inquiry has been successfully queued into the lead pipeline. I will review and reply promptly.
            </p>
            <button
              onclick={() => success = false}
              type="button"
              class="mt-4 px-4 py-2 text-xs font-mono rounded border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors"
            >
              Send Another Message
            </button>
          </div>
        {:else}
          <form onsubmit={handleSubmit} class="space-y-6">
            {#if errorMsg}
              <div class="p-3 text-xs font-mono rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-2">
                <WarningCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            {/if}

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  bind:value={name}
                  required
                  placeholder="Ada Lovelace"
                  class="w-full px-3.5 py-2.5 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
                />
              </div>

              <div>
                <label for="email" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  bind:value={emailInput}
                  required
                  placeholder="ada@analytical-engine.io"
                  class="w-full px-3.5 py-2.5 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="company" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">
                  Company / Organization
                </label>
                <input
                  id="company"
                  type="text"
                  bind:value={company}
                  placeholder="Babbage Labs Inc."
                  class="w-full px-3.5 py-2.5 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
                />
              </div>

              <div>
                <label for="budget" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">
                  Target Budget / Range
                </label>
                <select
                  id="budget"
                  bind:value={budget}
                  class="w-full px-3.5 py-2.5 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
                >
                  <option value="">Undisclosed / Advisory</option>
                  <option value="<$10k">&lt; $10k</option>
                  <option value="$10k - $25k">$10k &mdash; $25k</option>
                  <option value="$25k - $50k">$25k &mdash; $50k</option>
                  <option value="$50k+">$50k+</option>
                </select>
              </div>
            </div>

            <div>
              <label for="subject" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">
                Subject Scope *
              </label>
              <input
                id="subject"
                type="text"
                bind:value={subject}
                required
                placeholder="High-throughput distributed pipeline redesign"
                class="w-full px-3.5 py-2.5 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
              />
            </div>

            <div>
              <label for="message" class="block text-xs font-mono uppercase text-[var(--text-secondary)] mb-2">
                Project Narrative / Message *
              </label>
              <textarea
                id="message"
                bind:value={message}
                required
                rows={4}
                placeholder="Provide high-level context on objectives, stack constraints, and target timeline..."
                class="w-full px-3.5 py-2.5 text-sm rounded border border-[var(--border-subtle)] bg-[var(--surface-muted)] focus:outline-none focus:border-[var(--border-strong)] transition-colors"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              class="w-full py-3 px-6 rounded bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {#if isSubmitting}
                <span>Transmitting...</span>
              {:else}
                <PaperPlaneTilt size={16} weight="bold" />
                <span>Submit Transmission</span>
              {/if}
            </button>
          </form>
        {/if}
      </div>
    </div>
  </div>
</section>
