"use client";

import { useState } from "react";
import Link from "next/link";
import {
  logoutAdminAction,
  updateProfileAction,
  addSocialLinkAction,
  updateSocialLinkAction,
  toggleSocialLinkActiveAction,
  deleteSocialLinkAction,
  saveProjectAction,
  deleteProjectAction,
  saveExperienceAction,
  deleteExperienceAction,
  saveSkillAction,
  deleteSkillAction,
  saveTestimonialAction,
  deleteTestimonialAction,
  updateInquiryStatusAction,
  deleteInquiryAction,
} from "@/app/actions";
import type {
  Profile,
  SocialLink,
  Project,
  Experience,
  Skill,
  Testimonial,
  Inquiry,
} from "@/lib/db/schema";
import { SocialIcon } from "@/components/SocialIcon";
import {
  Users,
  ShareNetwork,
  UserCircle,
  Folder,
  Briefcase,
  Cpu,
  Quotes,
  SignOut,
  ArrowSquareOut,
  Plus,
  Trash,
  Check,
  ToggleLeft,
  ToggleRight,
  UploadSimple,
  PencilSimple,
  FloppyDisk,
  Warning,
} from "@phosphor-icons/react";

interface AdminDashboardProps {
  initialProfile: Profile;
  initialSocials: SocialLink[];
  initialProjects: Project[];
  initialExperiences: Experience[];
  initialSkills: Skill[];
  initialTestimonials: Testimonial[];
  initialInquiries: Inquiry[];
}

type TabType =
  | "leads"
  | "socials"
  | "profile"
  | "projects"
  | "experiences"
  | "skills"
  | "testimonials";

export function AdminDashboard({
  initialProfile,
  initialSocials,
  initialProjects,
  initialExperiences,
  initialSkills,
  initialTestimonials,
  initialInquiries,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("leads");
  const [notice, setNotice] = useState<string | null>(null);

  // Entities state
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [socials, setSocials] = useState<SocialLink[]>(initialSocials);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleLogout = async () => {
    await logoutAdminAction();
    window.location.reload();
  };

  // Upload helper
  const handleFileUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) return data.url;
      alert(data.error || "Upload failed");
      return null;
    } catch {
      alert("Error uploading file");
      return null;
    }
  };

  const newLeadsCount = inquiries.filter((i) => i.status === "NEW").length;
  const activeSocialsCount = socials.filter((s) => s.isActive).length;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-white">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 h-16 bg-[#121215]/90 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-mono font-bold text-white text-sm">
            CRM
          </div>
          <div>
            <h1 className="text-sm font-mono font-bold text-white tracking-wide">
              Portfolio Control Plane
            </h1>
            <p className="text-[11px] font-mono text-zinc-400">
              Live Bun + Turso Runtime Back-Office
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <span>View Public Site</span>
            <ArrowSquareOut size={14} />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <SignOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("leads")}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono transition-colors text-left ${
              activeTab === "leads"
                ? "bg-rose-600 text-white font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Users size={16} />
              <span>CRM Leads Pipeline</span>
            </span>
            {newLeadsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-400 text-zinc-950 font-bold">
                {newLeadsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("socials")}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono transition-colors text-left ${
              activeTab === "socials"
                ? "bg-rose-600 text-white font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <ShareNetwork size={16} />
              <span>Social Links</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              {activeSocialsCount}/{socials.length} active
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-mono transition-colors text-left ${
              activeTab === "profile"
                ? "bg-rose-600 text-white font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <UserCircle size={16} />
            <span>Profile &amp; Bio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono transition-colors text-left ${
              activeTab === "projects"
                ? "bg-rose-600 text-white font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Folder size={16} />
              <span>Projects (CMS)</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              {projects.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("experiences")}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono transition-colors text-left ${
              activeTab === "experiences"
                ? "bg-rose-600 text-white font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Briefcase size={16} />
              <span>Experience Timeline</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              {experiences.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("skills")}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono transition-colors text-left ${
              activeTab === "skills"
                ? "bg-rose-600 text-white font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Cpu size={16} />
              <span>Skills Matrix</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              {skills.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("testimonials")}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono transition-colors text-left ${
              activeTab === "testimonials"
                ? "bg-rose-600 text-white font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <span className="flex items-center gap-2">
              <Quotes size={16} />
              <span>Testimonials</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              {testimonials.length}
            </span>
          </button>

          <div className="mt-8 p-4 rounded-xl border border-zinc-800 bg-[#121215] text-[11px] font-mono text-zinc-400">
            <div className="text-zinc-200 font-bold mb-1">Architecture</div>
            <p className="text-zinc-400 leading-relaxed">
              No hardcoded content. All modifications update Turso / SQLite live and invalidate Next.js caches automatically.
            </p>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 min-w-0">
          {notice && (
            <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
              <Check size={16} weight="bold" />
              <span>{notice}</span>
            </div>
          )}

          {/* TAB 1: LEADS / CRM PIPELINE */}
          {activeTab === "leads" && (
            <LeadsTab
              inquiries={inquiries}
              setInquiries={setInquiries}
              showNotification={showNotification}
            />
          )}

          {/* TAB 2: SOCIAL LINKS (WITH EXPLICIT ACTIVE TAG TOGGLE) */}
          {activeTab === "socials" && (
            <SocialsTab
              socials={socials}
              setSocials={setSocials}
              showNotification={showNotification}
            />
          )}

          {/* TAB 3: PROFILE & BIO */}
          {activeTab === "profile" && (
            <ProfileTab
              profile={profile}
              setProfile={setProfile}
              showNotification={showNotification}
              onUpload={handleFileUpload}
            />
          )}

          {/* TAB 4: PROJECTS */}
          {activeTab === "projects" && (
            <ProjectsTab
              projects={projects}
              setProjects={setProjects}
              showNotification={showNotification}
              onUpload={handleFileUpload}
            />
          )}

          {/* TAB 5: EXPERIENCES */}
          {activeTab === "experiences" && (
            <ExperiencesTab
              experiences={experiences}
              setExperiences={setExperiences}
              showNotification={showNotification}
            />
          )}

          {/* TAB 6: SKILLS */}
          {activeTab === "skills" && (
            <SkillsTab
              skills={skills}
              setSkills={setSkills}
              showNotification={showNotification}
            />
          )}

          {/* TAB 7: TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <TestimonialsTab
              testimonials={testimonials}
              setTestimonials={setTestimonials}
              showNotification={showNotification}
              onUpload={handleFileUpload}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-TAB 1: LEADS / CRM PIPELINE
// -------------------------------------------------------------
function LeadsTab({
  inquiries,
  setInquiries,
  showNotification,
}: {
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  showNotification: (msg: string) => void;
}) {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [notesDraft, setNotesDraft] = useState("");

  const handleStatusChange = async (id: string, newStatus: string) => {
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    await updateInquiryStatusAction(id, newStatus);
    showNotification(`Lead status updated to ${newStatus}`);
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === selectedInquiry.id
          ? { ...item, internalNotes: notesDraft }
          : item
      )
    );
    await updateInquiryStatusAction(selectedInquiry.id, selectedInquiry.status, notesDraft);
    setSelectedInquiry(null);
    showNotification("Internal CRM notes saved");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    setInquiries((prev) => prev.filter((item) => item.id !== id));
    await deleteInquiryAction(id);
    showNotification("Lead removed from pipeline");
  };

  const statusColors: Record<string, string> = {
    NEW: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    IN_REVIEW: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    CONTACTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    CLOSED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    ARCHIVED: "bg-zinc-800 text-zinc-400 border-zinc-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Inquiries &amp; Lead Pipeline</h2>
          <p className="text-xs text-zinc-400 font-mono">
            Track inquiries dispatched via the public contact form
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-zinc-800 bg-[#121215] text-zinc-400 text-xs font-mono">
          No inquiries submitted yet. Submit a test message on the public site!
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="p-5 rounded-xl border border-zinc-800 bg-[#121215] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-sm">{inq.name}</span>
                  <a
                    href={`mailto:${inq.email}`}
                    className="text-xs font-mono text-rose-400 hover:underline"
                  >
                    {inq.email}
                  </a>
                  {inq.company && (
                    <span className="text-xs font-mono text-zinc-400">
                      • {inq.company}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Dropdown */}
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-md border focus:outline-none ${
                      statusColors[inq.status] || "bg-zinc-900 text-zinc-300"
                    }`}
                  >
                    <option value="NEW">NEW</option>
                    <option value="IN_REVIEW">IN_REVIEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDelete(inq.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Delete inquiry"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>

              {/* Subject & Budget */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-zinc-200 font-semibold">{inq.subject}</span>
                {inq.budget && (
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
                    Scope: {inq.budget}
                  </span>
                )}
              </div>

              {/* Message */}
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80">
                {inq.message}
              </p>

              {/* Internal Notes */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                  <span className="text-zinc-500">
                    Logged: {new Date(inq.createdAt).toLocaleString()}
                  </span>
                  {inq.internalNotes && (
                    <span className="text-rose-400 italic">
                      Notes: {inq.internalNotes}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedInquiry(inq);
                    setNotesDraft(inq.internalNotes || "");
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white"
                >
                  <PencilSimple size={13} />
                  <span>{inq.internalNotes ? "Edit Notes" : "Add Note"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Internal Notes Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-xl bg-[#121215] border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono">
              Internal CRM Notes — {selectedInquiry.name}
            </h3>
            <textarea
              rows={4}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="e.g. Dispatched proposal on Slack, scheduled follow-up for Tuesday..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-mono"
            />
            <div className="flex justify-end gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white border border-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-1.5 rounded-lg text-white bg-rose-600 hover:bg-rose-500"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// SUB-TAB 2: SOCIAL LINKS (WITH INSTANT ACTIVE TOGGLE)
// -------------------------------------------------------------
function SocialsTab({
  socials,
  setSocials,
  showNotification,
}: {
  socials: SocialLink[];
  setSocials: React.Dispatch<React.SetStateAction<SocialLink[]>>;
  showNotification: (msg: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [platform, setPlatform] = useState("GitHub");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("github");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(socials.length + 1);

  // Pre-configured platform options
  const platforms = [
    { label: "GitHub", icon: "github" },
    { label: "LinkedIn", icon: "linkedin" },
    { label: "Instagram", icon: "instagram" },
    { label: "Facebook", icon: "facebook" },
    { label: "X / Twitter", icon: "twitter" },
    { label: "Discord", icon: "discord" },
    { label: "YouTube", icon: "youtube" },
    { label: "Custom Link", icon: "link" },
  ];

  const handlePlatformChange = (val: string) => {
    setPlatform(val);
    const matched = platforms.find((p) => p.label === val);
    if (matched) setIcon(matched.icon);
  };

  const startEdit = (soc: SocialLink) => {
    setEditingId(soc.id);
    setPlatform(soc.platform);
    setUrl(soc.url);
    setIcon(soc.icon);
    setIsActive(soc.isActive);
    setDisplayOrder(soc.displayOrder);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPlatform("GitHub");
    setUrl("");
    setIcon("github");
    setIsActive(true);
    setDisplayOrder(socials.length + 1);
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    const nextVal = !currentActive;
    setSocials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: nextVal } : item))
    );
    await toggleSocialLinkActiveAction(id, nextVal);
    showNotification(
      `Social link set to ${nextVal ? "ACTIVE (visible on public site)" : "INACTIVE (hidden)"}`
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) return;
    setSocials((prev) => prev.filter((item) => item.id !== id));
    await deleteSocialLinkAction(id);
    if (editingId === id) cancelEdit();
    showNotification("Social link deleted");
  };

  const handleAddSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    if (editingId) {
      const res = await updateSocialLinkAction(editingId, {
        platform,
        url: url.trim(),
        icon,
        isActive,
        displayOrder,
      });

      if (res.success) {
        setSocials((prev) =>
          prev.map((s) =>
            s.id === editingId
              ? {
                  ...s,
                  platform,
                  url: url.trim(),
                  icon,
                  isActive,
                  displayOrder,
                }
              : s
          )
        );
        cancelEdit();
        showNotification("Social link updated successfully");
      }
      return;
    }

    const res = await addSocialLinkAction({
      platform,
      url: url.trim(),
      icon,
      isActive,
      displayOrder,
    });

    if (res.success && res.id) {
      setSocials((prev) => [
        ...prev,
        {
          id: res.id!,
          platform,
          url: url.trim(),
          icon,
          isActive,
          displayOrder,
          createdAt: Date.now(),
        },
      ]);
      setUrl("");
      showNotification(`Added ${platform} link successfully`);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-white">Social Links &amp; Profiles</h2>
        <p className="text-xs text-zinc-400 font-mono">
          Only links with the <span className="text-rose-400 font-semibold">Active Tag ON</span> are displayed on the public site (Navbar, Hero, and Footer).
        </p>
      </div>

      {/* Active Links Table */}
      <div className="p-6 rounded-xl border border-zinc-800 bg-[#121215] space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
          Configured Profiles ({socials.length})
        </h3>

        <div className="space-y-3">
          {socials.map((soc) => (
            <div
              key={soc.id}
              className={`p-3.5 rounded-lg border transition-all flex items-center justify-between gap-4 ${
                soc.isActive
                  ? "bg-zinc-900/90 border-zinc-700/80"
                  : "bg-zinc-950/40 border-zinc-800/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-rose-400 shrink-0">
                  <SocialIcon name={soc.icon || soc.platform} size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">
                      {soc.platform}
                    </span>
                    {soc.isActive ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-500">
                        HIDDEN
                      </span>
                    )}
                  </div>
                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-zinc-400 hover:text-rose-400 truncate block max-w-sm"
                  >
                    {soc.url}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {/* Instant Active Tag Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggle(soc.id, soc.isActive)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-colors ${
                    soc.isActive
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white"
                  }`}
                  title="Toggle visibility on public site"
                >
                  {soc.isActive ? (
                    <>
                      <ToggleRight size={18} weight="fill" />
                      <span>Active Tag ON</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={18} />
                      <span>Inactive</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => startEdit(soc)}
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors"
                  title="Edit social link"
                >
                  <PencilSimple size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(soc.id)}
                  className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Delete social link"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Form */}
      <div className={`p-6 rounded-xl border transition-colors ${editingId ? "border-rose-500/50 bg-[#16161a]" : "border-zinc-800 bg-[#121215]"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            {editingId ? <PencilSimple size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
            <span>{editingId ? "Edit Social Channel" : "Add New Social Channel"}</span>
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1 rounded bg-zinc-800"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleAddSocial} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => handlePlatformChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
              >
                {platforms.map((p) => (
                  <option key={p.label} value={p.label}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Profile URL
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://instagram.com/yourhandle or https://facebook.com/..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500 placeholder-zinc-600"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-zinc-800 text-rose-500 focus:ring-rose-500"
                />
                <span>Set Active Tag ON</span>
              </label>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span>Display Order:</span>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  className="w-16 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] transition-all"
            >
              {editingId ? <FloppyDisk size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
              <span>{editingId ? "Update Social Channel" : "Add Social Channel"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-TAB 3: PROFILE & BIO
// -------------------------------------------------------------
function ProfileTab({
  profile,
  setProfile,
  showNotification,
  onUpload,
}: {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  showNotification: (msg: string) => void;
  onUpload: (file: File) => Promise<string | null>;
}) {
  const [formData, setFormData] = useState<Profile>(profile);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfileAction(formData);
    setProfile(formData);
    setSaving(false);
    showNotification("Profile and bio updated successfully");
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await onUpload(file);
    if (url) {
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
      showNotification("Avatar uploaded");
    }
  };

  return (
    <div className="p-6 rounded-xl border border-zinc-800 bg-[#121215] space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Profile &amp; Personal Identity</h2>
        <p className="text-xs text-zinc-400 font-mono">
          Update your headline, role, availability status, and bio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Professional Role
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1.5">
            Hero Headline
          </label>
          <input
            type="text"
            required
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Location
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Availability Status Pill
            </label>
            <input
              type="text"
              required
              value={formData.availabilityStatus}
              onChange={(e) =>
                setFormData({ ...formData, availabilityStatus: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1.5">
            Bio / Philosophy (Concise, high-craft)
          </label>
          <textarea
            rows={3}
            required
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Avatar Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.avatarUrl}
                onChange={(e) =>
                  setFormData({ ...formData, avatarUrl: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
              />
              <label className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono cursor-pointer flex items-center justify-center shrink-0">
                <UploadSimple size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1.5">
            Resume / CV Link (or &quot;#&quot; to hide button)
          </label>
          <input
            type="text"
            value={formData.resumeUrl || ""}
            onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.98] disabled:opacity-50 transition-all shadow-md shadow-rose-950/40"
          >
            <FloppyDisk size={16} />
            <span>{saving ? "Saving Changes..." : "Save Profile Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-TAB 4: PROJECTS (CMS)
// -------------------------------------------------------------
function ProjectsTab({
  projects,
  setProjects,
  showNotification,
  onUpload,
}: {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  showNotification: (msg: string) => void;
  onUpload: (file: File) => Promise<string | null>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [impactMetric, setImpactMetric] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(1);

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setSlug("");
    setTagline("");
    setDescription("");
    setImpactMetric("");
    setTagsInput("");
    setImageUrl("");
    setRepoUrl("");
    setLiveUrl("");
    setFeatured(false);
    setDisplayOrder(projects.length + 1);
  };

  const startEdit = (proj: Project) => {
    setIsEditing(true);
    setEditingId(proj.id);
    setTitle(proj.title);
    setSlug(proj.slug);
    setTagline(proj.tagline);
    setDescription(proj.description);
    setImpactMetric(proj.impactMetric || "");
    try {
      setTagsInput(JSON.parse(proj.tags).join(", "));
    } catch {
      setTagsInput(proj.tags);
    }
    setImageUrl(proj.imageUrl || "");
    setRepoUrl(proj.repoUrl || "");
    setLiveUrl(proj.liveUrl || "");
    setFeatured(proj.featured);
    setDisplayOrder(proj.displayOrder);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const projectData = {
      id: editingId || undefined,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tagline,
      description,
      impactMetric,
      tags,
      featured,
      displayOrder,
      imageUrl,
      repoUrl,
      liveUrl,
    };

    const res = await saveProjectAction(projectData);
    if (res.success) {
      if (editingId) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  ...projectData,
                  id: editingId,
                  tags: JSON.stringify(tags),
                }
              : p
          )
        );
        showNotification("Project updated");
      } else {
        setProjects((prev) => [
          ...prev,
          {
            ...projectData,
            id: res.id!,
            tags: JSON.stringify(tags),
            createdAt: Date.now(),
          },
        ]);
        showNotification("Project added");
      }
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await deleteProjectAction(id);
    showNotification("Project deleted");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Project Case Studies</h2>
          <p className="text-xs text-zinc-400 font-mono">
            Manage projects, architecture write-ups, tags, and impact metrics
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-500"
          >
            <Plus size={14} weight="bold" />
            <span>Add Project</span>
          </button>
        )}
      </div>

      {/* Editor Modal/Panel */}
      {isEditing && (
        <div className="p-6 rounded-xl border border-rose-500/30 bg-[#121215] space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              {editingId ? "Edit Project" : "Create New Project"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-mono text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. kestrel-db"
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Tagline (Single punchy line)
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Description / Engineering Details
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Impact Metric Callout
                </label>
                <input
                  type="text"
                  value={impactMetric}
                  onChange={(e) => setImpactMetric(e.target.value)}
                  placeholder="e.g. Reduced p99 latency by 68%"
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Go, Rust, Next.js, Redis"
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Image URL / Upload
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Live URL
                </label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Repository URL
                </label>
                <input
                  type="url"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <label className="inline-flex items-center gap-2 text-xs font-mono text-zinc-300">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span>Featured Project</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-500"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-xl border border-zinc-800 bg-[#121215] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-sm">{proj.title}</h3>
                {proj.featured && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    FEATURED
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 line-clamp-1">{proj.tagline}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => startEdit(proj)}
                className="p-1.5 text-zinc-400 hover:text-white"
                title="Edit project"
              >
                <PencilSimple size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(proj.id)}
                className="p-1.5 text-zinc-500 hover:text-rose-400"
                title="Delete project"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-TAB 5: EXPERIENCES
// -------------------------------------------------------------
function ExperiencesTab({
  experiences,
  setExperiences,
  showNotification,
}: {
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
  showNotification: (msg: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("Present");
  const [description, setDescription] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setRole("");
    setCompany("");
    setCompanyUrl("");
    setLocation("");
    setStartDate("");
    setEndDate("Present");
    setDescription("");
    setHighlightsInput("");
  };

  const startEdit = (exp: Experience) => {
    setIsEditing(true);
    setEditingId(exp.id);
    setRole(exp.role);
    setCompany(exp.company);
    setCompanyUrl(exp.companyUrl || "");
    setLocation(exp.location);
    setStartDate(exp.startDate);
    setEndDate(exp.endDate);
    setDescription(exp.description);
    try {
      setHighlightsInput(JSON.parse(exp.highlights).join("\n"));
    } catch {
      setHighlightsInput(exp.highlights);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const highlights = highlightsInput
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean);

    const data = {
      id: editingId || undefined,
      role,
      company,
      companyUrl,
      location,
      startDate,
      endDate,
      description,
      highlights,
      displayOrder: editingId
        ? experiences.find((e) => e.id === editingId)?.displayOrder || 1
        : experiences.length + 1,
    };

    const res = await saveExperienceAction(data);
    if (res.success) {
      if (editingId) {
        setExperiences((prev) =>
          prev.map((e) =>
            e.id === editingId
              ? {
                  ...e,
                  ...data,
                  id: editingId,
                  highlights: JSON.stringify(highlights),
                }
              : e
          )
        );
        showNotification("Experience updated successfully");
      } else {
        setExperiences((prev) => [
          ...prev,
          {
            ...data,
            id: res.id!,
            highlights: JSON.stringify(highlights),
          },
        ]);
        showNotification("Experience added successfully");
      }
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this position?")) return;
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    await deleteExperienceAction(id);
    if (editingId === id) resetForm();
    showNotification("Experience deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Experience Timeline</h2>
          <p className="text-xs text-zinc-400 font-mono">
            Track career milestones and achievements
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-500"
          >
            <Plus size={14} weight="bold" />
            <span>Add Position</span>
          </button>
        )}
      </div>

      {isEditing && (
        <form
          onSubmit={handleSave}
          className="p-6 rounded-xl border border-rose-500/30 bg-[#121215] space-y-4"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              {editingId ? <PencilSimple size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
              <span>{editingId ? "Edit Position" : "Add Position"}</span>
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Role
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Staff Infrastructure Engineer"
                className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Company
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Cloud"
                className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Start Date
              </label>
              <input
                type="text"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="2023"
                className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                End Date
              </label>
              <input
                type="text"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Present"
                className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Highlights (one per line)
            </label>
            <textarea
              rows={3}
              value={highlightsInput}
              onChange={(e) => setHighlightsInput(e.target.value)}
              placeholder="Reduced latency by 40%&#10;Scaled cluster to 200 nodes"
              className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1.5 rounded text-xs font-mono text-zinc-400 border border-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-500"
            >
              {editingId ? "Update Position" : "Save Experience"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-4 rounded-xl border border-zinc-800 bg-[#121215] flex items-center justify-between"
          >
            <div>
              <h4 className="text-sm font-bold text-white">
                {exp.role} • <span className="text-rose-400">{exp.company}</span>
              </h4>
              <p className="text-xs text-zinc-400 font-mono">
                {exp.startDate} — {exp.endDate} ({exp.location})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => startEdit(exp)}
                className="p-1.5 text-zinc-400 hover:text-white"
                title="Edit position"
              >
                <PencilSimple size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(exp.id)}
                className="p-1.5 text-zinc-500 hover:text-rose-400"
                title="Delete position"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-TAB 6: SKILLS
// -------------------------------------------------------------
function SkillsTab({
  skills,
  setSkills,
  showNotification,
}: {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  showNotification: (msg: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Languages & Core");
  const [level, setLevel] = useState("Expert");
  const [isHighlighted, setIsHighlighted] = useState(false);

  const startEdit = (sk: Skill) => {
    setEditingId(sk.id);
    setName(sk.name);
    setCategory(sk.category);
    setLevel(sk.level);
    setIsHighlighted(sk.isHighlighted);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setCategory("Languages & Core");
    setLevel("Expert");
    setIsHighlighted(false);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      const res = await saveSkillAction({
        id: editingId,
        name: name.trim(),
        category,
        level,
        isHighlighted,
        displayOrder: skills.find((s) => s.id === editingId)?.displayOrder || 1,
      });

      if (res.success) {
        setSkills((prev) =>
          prev.map((s) =>
            s.id === editingId
              ? {
                  ...s,
                  name: name.trim(),
                  category,
                  level,
                  isHighlighted,
                }
              : s
          )
        );
        cancelEdit();
        showNotification("Skill updated successfully");
      }
      return;
    }

    const res = await saveSkillAction({
      name: name.trim(),
      category,
      level,
      isHighlighted,
      displayOrder: skills.length + 1,
    });

    if (res.success && res.id) {
      setSkills((prev) => [
        ...prev,
        {
          id: res.id!,
          name: name.trim(),
          category,
          level,
          isHighlighted,
          displayOrder: skills.length + 1,
        },
      ]);
      setName("");
      showNotification("Skill added successfully");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    setSkills((prev) => prev.filter((s) => s.id !== id));
    await deleteSkillAction(id);
    if (editingId === id) cancelEdit();
    showNotification("Skill deleted");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Technical Skills Matrix</h2>
        <p className="text-xs text-zinc-400 font-mono">
          Categorize technical proficiencies across stacks
        </p>
      </div>

      <form
        onSubmit={handleAddSkill}
        className={`p-5 rounded-xl border transition-colors flex flex-wrap items-end gap-3 ${
          editingId ? "border-rose-500/50 bg-[#16161a]" : "border-zinc-800 bg-[#121215]"
        }`}
      >
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            {editingId ? "Edit Skill Name" : "Skill Name"}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. ClickHouse"
            className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
          >
            <option value="Languages & Core">Languages &amp; Core</option>
            <option value="Frontend & UI">Frontend &amp; UI</option>
            <option value="Storage & Databases">Storage &amp; Databases</option>
            <option value="DevOps & Cloud">DevOps &amp; Cloud</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            Level
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
          >
            <option value="Expert">Expert</option>
            <option value="Proficient">Proficient</option>
            <option value="Familiar">Familiar</option>
          </select>
        </div>

        <label className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 pb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isHighlighted}
            onChange={(e) => setIsHighlighted(e.target.checked)}
          />
          <span>Highlight</span>
        </label>

        <div className="flex items-center gap-2">
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-white border border-zinc-800"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-500"
          >
            {editingId ? "Update Skill" : "Add Skill"}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((sk) => (
          <div
            key={sk.id}
            className="p-3 rounded-lg border border-zinc-800 bg-[#121215] flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-1">
                {sk.isHighlighted && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                )}
                {sk.name}
              </div>
              <div className="text-[10px] font-mono text-zinc-400">
                {sk.category} • {sk.level}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => startEdit(sk)}
                className="text-zinc-400 hover:text-white p-1"
                title="Edit skill"
              >
                <PencilSimple size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(sk.id)}
                className="text-zinc-500 hover:text-rose-400 p-1"
                title="Delete skill"
              >
                <Trash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SUB-TAB 7: TESTIMONIALS
// -------------------------------------------------------------
function TestimonialsTab({
  testimonials,
  setTestimonials,
  showNotification,
  onUpload,
}: {
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  showNotification: (msg: string) => void;
  onUpload: (file: File) => Promise<string | null>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const startEdit = (test: Testimonial) => {
    setEditingId(test.id);
    setAuthor(test.author);
    setRole(test.role);
    setCompany(test.company);
    setContent(test.content);
    setAvatarUrl(test.avatarUrl || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setAuthor("");
    setRole("");
    setCompany("");
    setContent("");
    setAvatarUrl("");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    if (editingId) {
      const res = await saveTestimonialAction({
        id: editingId,
        author: author.trim(),
        role: role.trim(),
        company: company.trim(),
        content: content.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        displayOrder: testimonials.find((t) => t.id === editingId)?.displayOrder || 1,
      });

      if (res.success) {
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === editingId
              ? {
                  ...t,
                  author: author.trim(),
                  role: role.trim(),
                  company: company.trim(),
                  content: content.trim(),
                  avatarUrl: avatarUrl.trim() || null,
                }
              : t
          )
        );
        cancelEdit();
        showNotification("Testimonial updated successfully");
      }
      return;
    }

    const res = await saveTestimonialAction({
      author: author.trim(),
      role: role.trim(),
      company: company.trim(),
      content: content.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
      displayOrder: testimonials.length + 1,
    });

    if (res.success && res.id) {
      setTestimonials((prev) => [
        ...prev,
        {
          id: res.id!,
          author: author.trim(),
          role: role.trim(),
          company: company.trim(),
          content: content.trim(),
          avatarUrl: avatarUrl.trim() || null,
          displayOrder: testimonials.length + 1,
        },
      ]);
      setAuthor("");
      setRole("");
      setCompany("");
      setContent("");
      setAvatarUrl("");
      showNotification("Testimonial added successfully");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    await deleteTestimonialAction(id);
    if (editingId === id) cancelEdit();
    showNotification("Testimonial deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Client &amp; Peer Testimonials</h2>
          <p className="text-xs text-zinc-400 font-mono">
            Quotes endorsing your engineering architecture (max 3 lines recommended)
          </p>
        </div>
      </div>

      <form
        onSubmit={handleAdd}
        className={`p-5 rounded-xl border transition-colors space-y-4 ${
          editingId ? "border-rose-500/50 bg-[#16161a]" : "border-zinc-800 bg-[#121215]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            {editingId ? <PencilSimple size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
            <span>{editingId ? "Edit Testimonial" : "Add Testimonial"}</span>
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Author
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Elena Rostova"
              className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Role
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="VP of Engineering"
              className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">
              Company
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Veloce Cloud"
              className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            Quote Content
          </label>
          <textarea
            rows={2}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Alex is a rare engineer who can architect distributed systems in the morning and polish frontends in the afternoon..."
            className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            Avatar URL (optional)
          </label>
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-white font-mono"
          />
        </div>

        <div className="flex justify-end gap-2">
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-white border border-zinc-800"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-mono font-medium text-white bg-rose-600 hover:bg-rose-500"
          >
            {editingId ? "Update Testimonial" : "Add Testimonial"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {testimonials.map((test) => (
          <div
            key={test.id}
            className="p-4 rounded-xl border border-zinc-800 bg-[#121215] flex items-start justify-between gap-4"
          >
            <div>
              <p className="text-xs text-zinc-200 italic mb-2">
                &ldquo;{test.content}&rdquo;
              </p>
              <div className="text-xs font-mono text-zinc-400">
                <span className="font-bold text-white">{test.author}</span> •{" "}
                {test.role} at <span className="text-rose-400">{test.company}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => startEdit(test)}
                className="p-1.5 text-zinc-400 hover:text-white"
                title="Edit testimonial"
              >
                <PencilSimple size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(test.id)}
                className="p-1.5 text-zinc-500 hover:text-rose-400"
                title="Delete testimonial"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
