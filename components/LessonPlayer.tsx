"use client";

import { useEffect, useRef, useState } from "react";
import { Expand, Minimize, Play, RotateCcw } from "lucide-react";

export function LessonPlayer({ driveFileId, title }: { driveFileId: string; title: string }) {
  const playerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFallbackFullscreen, setIsFallbackFullscreen] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);

  useEffect(() => {
    function syncFullscreenState() {
      const active = document.fullscreenElement === playerRef.current;
      setIsFullscreen(active);
      if (!active) {
        const orientation = screen.orientation as ScreenOrientation & { unlock?: () => void };
        orientation.unlock?.();
      }
    }

    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  useEffect(() => {
    if (!isFallbackFullscreen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsFallbackFullscreen(false);
    }
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isFallbackFullscreen]);

  async function toggleFullscreen() {
    const player = playerRef.current;
    if (!player) return;

    if (isFallbackFullscreen) {
      setIsFallbackFullscreen(false);
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.fullscreenEnabled) {
        await player.requestFullscreen({ navigationUI: "hide" });
        const orientation = screen.orientation as ScreenOrientation & {
          lock?: (mode: "landscape") => Promise<void>;
        };
        await orientation.lock?.("landscape").catch(() => undefined);
      } else {
        setIsFallbackFullscreen(true);
      }
    } catch {
      setIsFallbackFullscreen(true);
    }
  }

  const expanded = isFullscreen || isFallbackFullscreen;

  return (
    <div className="space-y-3">
      <div
        ref={playerRef}
        className={[
          "group relative overflow-hidden rounded-2xl border border-slate-700 bg-black shadow-2xl shadow-blue-950/30 fullscreen:flex fullscreen:h-screen fullscreen:w-screen fullscreen:items-center fullscreen:rounded-none fullscreen:border-0",
          isFallbackFullscreen
            ? "fixed inset-0 z-[100] flex h-[100dvh] w-screen items-center rounded-none border-0"
            : "",
        ].join(" ")}
      >
        <iframe
          key={playerKey}
          title={title}
          src={`https://drive.google.com/file/d/${driveFileId}/preview`}
          className="aspect-video min-h-[220px] w-full bg-black brightness-[1.12] contrast-[1.04]"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />

        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute left-3 top-3 z-10 inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-slate-950/90 px-4 text-sm font-black text-white shadow-xl backdrop-blur transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          aria-label={expanded ? "تصغير مشغل الفيديو" : "تكبير مشغل الفيديو بملء الشاشة"}
        >
          {expanded ? <Minimize className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
          <span>{expanded ? "تصغير" : "ملء الشاشة"}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/55 px-4 py-3 text-xs text-slate-400">
        <p className="inline-flex items-center gap-2 leading-5">
          <Play className="h-4 w-4 shrink-0 text-sky-300" />
          اضغط تشغيل داخل المقطع، واستخدم «ملء الشاشة» لوضوح أفضل على الجوال.
        </p>
        <button
          type="button"
          onClick={() => setPlayerKey((value) => value + 1)}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-bold text-sky-300 transition hover:bg-sky-400/10 hover:text-sky-200"
        >
          <RotateCcw className="h-4 w-4" />
          إعادة تحميل المشغل
        </button>
      </div>
    </div>
  );
}
