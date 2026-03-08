"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

interface SwipeAd {
  id: string;
  format: string;
  hook: string;
  body: string;
  cta: string | null;
  imageUrl: string | null;
  brand: { name: string; url: string };
}

interface AdSwipeProps {
  ads: SwipeAd[];
}

export function AdSwipe({ ads }: AdSwipeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );
  const startX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const swipeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessingRef = useRef(false);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (swipeTimeoutRef.current) clearTimeout(swipeTimeoutRef.current);
    };
  }, []);

  const SWIPE_THRESHOLD = 100;

  const currentAd = ads[currentIndex] ?? null;
  const isFinished = currentIndex >= ads.length;

  const submitFeedback = useCallback(
    async (adId: string, feedback: number) => {
      try {
        await fetch(`/api/ads/${adId}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedback }),
        });
      } catch {
        // Silent fail — feedback is best-effort
      }
    },
    []
  );

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!currentAd || isFinished || isProcessingRef.current) return;
      isProcessingRef.current = true;
      const feedback = direction === "right" ? 1 : -1;

      setExitDirection(direction);

      // Submit feedback
      void submitFeedback(currentAd.id, feedback);

      // Animate out then advance
      swipeTimeoutRef.current = setTimeout(() => {
        if (feedback === 1) {
          setLiked((prev) => prev + 1);
        } else {
          setSkipped((prev) => prev + 1);
        }
        setCurrentIndex((prev) => prev + 1);
        setOffset(0);
        setExitDirection(null);
        isProcessingRef.current = false;
      }, 300);
    },
    [currentAd, isFinished, submitFeedback]
  );

  // Touch handlers
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const diff = e.touches[0].clientX - startX.current;
      setOffset(diff);
    },
    [isDragging]
  );

  const onTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (Math.abs(offset) > SWIPE_THRESHOLD) {
      handleSwipe(offset > 0 ? "right" : "left");
    } else {
      setOffset(0);
    }
  }, [offset, handleSwipe]);

  // Mouse handlers
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const diff = e.clientX - startX.current;
      setOffset(diff);
    },
    [isDragging]
  );

  const onMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(offset) > SWIPE_THRESHOLD) {
      handleSwipe(offset > 0 ? "right" : "left");
    } else {
      setOffset(0);
    }
  }, [isDragging, offset, handleSwipe]);

  const onMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setOffset(0);
    }
  }, [isDragging]);

  // Finished state
  if (isFinished) {
    const total = liked + skipped;
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center max-w-sm w-full">
          <h2 className="text-xl font-bold mb-6">Fertig!</h2>
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">{liked}</p>
              <p className="text-sm text-zinc-500">Geliked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">{skipped}</p>
              <p className="text-sm text-zinc-500">Uebersprungen</p>
            </div>
          </div>
          <p className="text-sm text-zinc-500">
            {total} Ads bewertet — dein Feedback verbessert zukuenftige Ads.
          </p>
        </div>
      </div>
    );
  }

  if (!currentAd) return null;

  // Calculate card transform
  const rotation = offset * 0.1;
  const exitX = exitDirection === "right" ? 500 : exitDirection === "left" ? -500 : 0;
  const exitRotation = exitDirection === "right" ? 20 : exitDirection === "left" ? -20 : 0;

  const cardStyle: React.CSSProperties = exitDirection
    ? {
        transform: `translateX(${exitX}px) rotate(${exitRotation}deg)`,
        transition: "transform 0.3s ease-out",
        opacity: 0,
      }
    : {
        transform: `translateX(${offset}px) rotate(${rotation}deg)`,
        transition: isDragging ? "none" : "transform 0.2s ease-out",
      };

  // Swipe indicator opacity
  const likeOpacity = Math.max(0, Math.min(1, offset / SWIPE_THRESHOLD));
  const skipOpacity = Math.max(0, Math.min(1, -offset / SWIPE_THRESHOLD));

  return (
    <div className="flex flex-col items-center">
      {/* Progress */}
      <div className="mb-4 text-sm text-zinc-500">
        {currentIndex + 1} / {ads.length}
      </div>

      {/* Card Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-sm mx-auto select-none"
        style={{ minHeight: "420px" }}
      >
        {/* Swipe Indicators */}
        <div
          className="absolute top-4 left-4 z-10 px-3 py-1 rounded-lg bg-emerald-500/90 text-white font-bold text-sm pointer-events-none"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </div>
        <div
          className="absolute top-4 right-4 z-10 px-3 py-1 rounded-lg bg-red-500/90 text-white font-bold text-sm pointer-events-none"
          style={{ opacity: skipOpacity }}
        >
          SKIP
        </div>

        {/* Card */}
        <div
          style={cardStyle}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
        >
          {/* Image */}
          {currentAd.imageUrl && (
            <div className="relative aspect-video bg-zinc-800">
              <Image
                src={currentAd.imageUrl}
                alt={currentAd.hook}
                fill
                className="object-cover pointer-events-none"
                unoptimized
              />
            </div>
          )}

          <div className="p-6">
            {/* Format Badge + Brand */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-emerald-400 uppercase tracking-wider font-medium">
                {currentAd.format}
              </span>
              <span className="text-xs text-zinc-600">
                {currentAd.brand.name}
              </span>
            </div>

            {/* Hook */}
            <h3 className="font-bold text-white text-lg mb-3 leading-tight">
              {currentAd.hook}
            </h3>

            {/* Body */}
            <p className="text-sm text-zinc-400 whitespace-pre-line leading-relaxed line-clamp-6">
              {currentAd.body}
            </p>

            {/* CTA */}
            {currentAd.cta && (
              <p className="text-sm text-emerald-400 mt-3 font-medium">
                {currentAd.cta}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-6 mt-6">
        <button
          onClick={() => handleSwipe("left")}
          className="w-14 h-14 rounded-full border-2 border-red-500/50 text-red-400 flex items-center justify-center text-2xl hover:bg-red-500/10 transition-colors"
          title="Skip"
        >
          &#x2715;
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="w-14 h-14 rounded-full border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center text-2xl hover:bg-emerald-500/10 transition-colors"
          title="Like"
        >
          &#x2713;
        </button>
      </div>

      {/* Hint */}
      <p className="text-xs text-zinc-600 mt-4">
        Wische nach rechts zum Liken, links zum Ueberspringen
      </p>
    </div>
  );
}
