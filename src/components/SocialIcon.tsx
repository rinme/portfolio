"use client";

import React from "react";
import {
  GithubLogo,
  LinkedinLogo,
  InstagramLogo,
  FacebookLogo,
  XLogo,
  DiscordLogo,
  YoutubeLogo,
  Link as LinkIcon,
  Globe,
  Envelope,
} from "@phosphor-icons/react";

interface SocialIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function SocialIcon({ name, className = "w-5 h-5", size = 20 }: SocialIconProps) {
  const normalized = name.toLowerCase().trim();

  if (normalized.includes("github")) {
    return <GithubLogo size={size} weight="regular" className={className} />;
  }
  if (normalized.includes("linkedin")) {
    return <LinkedinLogo size={size} weight="regular" className={className} />;
  }
  if (normalized.includes("instagram")) {
    return <InstagramLogo size={size} weight="regular" className={className} />;
  }
  if (normalized.includes("facebook")) {
    return <FacebookLogo size={size} weight="regular" className={className} />;
  }
  if (normalized.includes("twitter") || normalized === "x" || normalized.includes("x.com")) {
    return <XLogo size={size} weight="regular" className={className} />;
  }
  if (normalized.includes("discord")) {
    return <DiscordLogo size={size} weight="regular" className={className} />;
  }
  if (normalized.includes("youtube")) {
    return <YoutubeLogo size={size} weight="regular" className={className} />;
  }
  if (normalized.includes("email") || normalized.includes("mail")) {
    return <Envelope size={size} weight="regular" className={className} />;
  }
  if (normalized.includes("web") || normalized.includes("site") || normalized.includes("globe")) {
    return <Globe size={size} weight="regular" className={className} />;
  }

  return <LinkIcon size={size} weight="regular" className={className} />;
}
