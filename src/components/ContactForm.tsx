"use client";

import { useState } from "react";
import { submitContactInquiry } from "@/app/actions";
import { PaperPlaneTilt, CheckCircle, WarningCircle, Envelope } from "@phosphor-icons/react";

interface ContactProps {
  email: string;
}

export function ContactForm({ email }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    budget: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await submitContactInquiry(formData);
      if (res.success) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          company: "",
          subject: "",
          message: "",
          budget: "",
        });
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Submission failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Outreach Context */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Initiate Inquiry
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
              Have a high-scale infrastructure challenge, distributed systems design requirement, or technical leadership role? Send a message directly to my CRM pipeline.
            </p>

            <div className="p-5 rounded-xl border border-zinc-800 bg-[#121215] space-y-4">
              <div className="flex items-center gap-3 text-xs font-mono text-zinc-300">
                <Envelope size={18} className="text-rose-400 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-rose-400 transition-colors break-all"
                >
                  {email}
                </a>
              </div>

              <div className="text-[11px] font-mono text-zinc-500 pt-3 border-t border-zinc-800/80">
                Responses typically dispatched within 24 business hours.
              </div>
            </div>
          </div>

          {/* Right Column: CRM Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-xl border border-zinc-800 bg-[#121215]">
              {status === "success" ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                    <CheckCircle size={28} weight="bold" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Inquiry Received
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-sm mb-6">
                    Your inquiry has been logged into the engineering lead pipeline. I will review and follow up shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="px-4 py-2 rounded-lg text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 hover:text-white"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === "error" && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                      <WarningCircle size={16} weight="bold" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-mono text-zinc-300 mb-1.5"
                      >
                        Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Alex Vance"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-mono text-zinc-300 mb-1.5"
                      >
                        Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-xs font-mono text-zinc-300 mb-1.5"
                      >
                        Company / Organization
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        placeholder="Acme Corp (optional)"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-xs font-mono text-zinc-300 mb-1.5"
                      >
                        Project Scope / Budget
                      </label>
                      <select
                        id="budget"
                        value={formData.budget}
                        onChange={(e) =>
                          setFormData({ ...formData, budget: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-sm text-zinc-300 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      >
                        <option value="">Select scope...</option>
                        <option value="Consulting (<$10k)">Consulting (&lt;$10k)</option>
                        <option value="Project Contract ($10k - $30k)">Project Contract ($10k - $30k)</option>
                        <option value="Enterprise Architecture ($30k+)">Enterprise Architecture ($30k+)</option>
                        <option value="Full-Time Staff/Principal Role">Full-Time Staff / Principal Role</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-xs font-mono text-zinc-300 mb-1.5"
                    >
                      Subject <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="Distributed cache re-architecture..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-mono text-zinc-300 mb-1.5"
                    >
                      Message <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Outline technical context, timelines, and primary goals..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] disabled:opacity-50 transition-all shadow-md shadow-rose-950/40"
                  >
                    <PaperPlaneTilt size={16} weight="bold" />
                    <span>{loading ? "Transmitting..." : "Submit to CRM Pipeline"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
