"use client";

import { useState } from "react";
import Image from "next/image";

interface AdMockupProps {
  headline: string;
  body: string;
  imageUrl?: string | null;
  brandName?: string;
  ctaText?: string;
}

/* ------------------------------------------------------------------ */
/* Instagram Post Mockup                                               */
/* ------------------------------------------------------------------ */
export function InstagramPostMockup({
  headline,
  body,
  imageUrl,
  brandName = "Brand",
  ctaText,
}: AdMockupProps) {
  return (
    <div className="bg-black rounded-xl overflow-hidden border border-zinc-800 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center text-white text-xs font-bold">
          {brandName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {brandName.toLowerCase().replace(/\s+/g, "")}
          </p>
          <p className="text-[10px] text-zinc-500">Sponsored</p>
        </div>
        <div className="ml-auto text-zinc-500 text-lg">...</div>
      </div>

      {/* Image Area */}
      <div className="aspect-square bg-zinc-900 relative flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={headline}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="text-center px-6">
            <p className="text-lg font-bold text-white">{headline}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex items-center gap-4 text-white">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </div>

      {/* Caption */}
      <div className="px-4 pb-4">
        <p className="text-sm text-white">
          <span className="font-semibold">
            {brandName.toLowerCase().replace(/\s+/g, "")}
          </span>{" "}
          {body}
        </p>
        {ctaText && (
          <p className="text-sm text-blue-400 mt-1">{ctaText}</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Facebook Ad Mockup                                                  */
/* ------------------------------------------------------------------ */
export function FacebookAdMockup({
  headline,
  body,
  imageUrl,
  brandName = "Brand",
  ctaText = "Mehr erfahren",
}: AdMockupProps) {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
          {brandName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{brandName}</p>
          <p className="text-xs text-zinc-500">
            Sponsored &middot; <span className="inline-block w-3 h-3 align-middle">&#127760;</span>
          </p>
        </div>
      </div>

      {/* Post Text */}
      <div className="px-4 pb-3">
        <p className="text-sm text-zinc-300 whitespace-pre-line">{body}</p>
      </div>

      {/* Image Area */}
      <div className="aspect-video bg-zinc-800 relative flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={headline}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="text-center px-6">
            <p className="text-xl font-bold text-white">{headline}</p>
          </div>
        )}
      </div>

      {/* Link Preview Bar */}
      <div className="bg-zinc-800/50 px-4 py-3 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">
            {brandName.toLowerCase().replace(/\s+/g, "")}.com
          </p>
          <p className="text-sm font-semibold text-white truncate">
            {headline}
          </p>
        </div>
        <button className="ml-4 shrink-0 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-semibold px-4 py-2 rounded transition-colors">
          {ctaText}
        </button>
      </div>

      {/* Engagement Bar */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800">
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full text-[8px] text-white">&#x1F44D;</span>
          <span>42</span>
        </div>
        <div className="flex gap-3">
          <span>3 Kommentare</span>
          <span>1 Mal geteilt</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LinkedIn Ad Mockup                                                  */
/* ------------------------------------------------------------------ */
export function LinkedInAdMockup({
  headline,
  body,
  imageUrl,
  brandName = "Brand",
  ctaText = "Mehr erfahren",
}: AdMockupProps) {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-12 h-12 rounded bg-blue-700 flex items-center justify-center text-white text-sm font-bold">
          {brandName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{brandName}</p>
          <p className="text-xs text-zinc-500">
            1.234 Follower
          </p>
          <p className="text-xs text-zinc-600">Gesponsert</p>
        </div>
        <div className="text-zinc-500 text-lg">...</div>
      </div>

      {/* Post Text */}
      <div className="px-4 pb-3">
        <p className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed">
          {body}
        </p>
      </div>

      {/* Image Area */}
      <div className="aspect-video bg-zinc-800 relative flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={headline}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="text-center px-6">
            <p className="text-xl font-bold text-white">{headline}</p>
          </div>
        )}
      </div>

      {/* Headline + CTA */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-800">
        <p className="text-sm font-semibold text-white flex-1 truncate mr-3">
          {headline}
        </p>
        <button className="shrink-0 border border-blue-500 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-blue-500/10 transition-colors">
          {ctaText}
        </button>
      </div>

      {/* Engagement Bar */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <span className="text-blue-400">&#x1F44D;</span>
          <span className="text-red-400">&#10084;</span>
          <span className="text-yellow-400">&#128161;</span>
          <span className="ml-1">28</span>
        </div>
        <span>4 Kommentare</span>
      </div>

      {/* Action Bar */}
      <div className="px-4 py-2 flex items-center justify-around border-t border-zinc-800 text-xs text-zinc-500">
        <button className="flex items-center gap-1 hover:text-zinc-300 transition-colors py-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-.632-.103l-3.114-1.038a2 2 0 00-.632-.103H4.5A2.5 2.5 0 012 17.5v-5A2.5 2.5 0 014.5 10H7l3-4 1 1v3z" />
          </svg>
          Empfehlen
        </button>
        <button className="flex items-center gap-1 hover:text-zinc-300 transition-colors py-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Kommentieren
        </button>
        <button className="flex items-center gap-1 hover:text-zinc-300 transition-colors py-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Senden
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Platform Tabs Selector                                              */
/* ------------------------------------------------------------------ */

type Platform = "instagram" | "facebook" | "linkedin";

interface PlatformMockupSelectorProps {
  headline: string;
  body: string;
  imageUrl?: string | null;
  brandName?: string;
  ctaText?: string;
}

export function PlatformMockupSelector({
  headline,
  body,
  imageUrl,
  brandName,
  ctaText,
}: PlatformMockupSelectorProps) {
  const [activePlatform, setActivePlatform] = useState<Platform>("instagram");

  const platforms: { key: Platform; label: string }[] = [
    { key: "instagram", label: "Instagram" },
    { key: "facebook", label: "Facebook" },
    { key: "linkedin", label: "LinkedIn" },
  ];

  const commonProps: AdMockupProps = {
    headline,
    body,
    imageUrl,
    brandName,
    ctaText,
  };

  return (
    <div>
      {/* Platform Tabs */}
      <div className="flex gap-1 mb-4">
        {platforms.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActivePlatform(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activePlatform === key
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                : "text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mockup */}
      {activePlatform === "instagram" && (
        <InstagramPostMockup {...commonProps} />
      )}
      {activePlatform === "facebook" && (
        <FacebookAdMockup {...commonProps} />
      )}
      {activePlatform === "linkedin" && (
        <LinkedInAdMockup {...commonProps} />
      )}
    </div>
  );
}

