import Link from "next/link";
import type { Profile, SocialLink } from "@/lib/db/schema";
import { SocialIcon } from "./SocialIcon";

interface FooterProps {
  profile: Profile;
  activeSocials: SocialLink[];
}

export function Footer({ profile, activeSocials }: FooterProps) {
  return (
    <footer className="border-t border-white/5 bg-[#070709] py-12 text-xs font-mono text-zinc-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="text-zinc-300 font-semibold">{profile.name}</span>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        {/* Dynamic Active Social Links */}
        <div className="flex items-center gap-4">
          {activeSocials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              title={social.platform}
              className="text-zinc-400 hover:text-rose-400 transition-colors p-1"
            >
              <SocialIcon name={social.icon || social.platform} size={16} />
            </a>
          ))}

          <span className="text-zinc-800">|</span>

          <Link
            href="/admin"
            className="hover:text-zinc-300 transition-colors underline decoration-zinc-800 underline-offset-4"
          >
            CRM Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
