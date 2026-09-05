"use client";

import { Hand, Play } from "lucide-react";
import { useState } from "react";

export function LessonPlayer({ driveFileId, title }: { driveFileId: string; title: string }) {
  const [controlsEnabled, setControlsEnabled] = useState(false);

  return (
    <div className="min-w-0 max-w-full space-y-3 overflow-x-hidden">
      <div className="relative aspect-video w-full touch-pan-y overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl shadow-blue-950/30">
        <iframe
          title={title}
          src={`https://drive.google.com/file/d/${driveFileId}/preview`}
          className={[
            "absolute inset-0 block h-full w-full border-0",
            controlsEnabled ? "pointer-events-auto" : "pointer-events-none md:pointer-events-auto",
          ].join(" ")}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />

        {!controlsEnabled ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center md:hidden">
            <button
              type="button"
              onClick={() => setControlsEnabled(true)}
              className="pointer-events-auto inline-flex touch-pan-y items-center gap-2 rounded-full border border-white/20 bg-slate-950/90 px-4 py-2.5 text-sm font-black text-white shadow-2xl backdrop-blur"
              aria-label="تفعيل التحكم في الفيديو"
            >
              <Play className="h-4 w-4 fill-current" />
              اضغط لتفعيل الفيديو
            </button>
          </div>
        ) : null}
      </div>

      <div className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 md:hidden">
        <p className="min-w-0 flex-1 text-right text-xs leading-5 text-slate-400">
          {controlsEnabled
            ? "تحكم الفيديو مفعّل الآن."
            : "يمكنك تمرير الصفحة بالسحب فوق الفيديو."}
        </p>
        <button
          type="button"
          onClick={() => setControlsEnabled((enabled) => !enabled)}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-sky-400/30 bg-sky-400/10 px-3 py-2 text-xs font-black text-sky-100 transition active:scale-95"
          aria-pressed={controlsEnabled}
        >
          {controlsEnabled ? (
            <>
              <Hand className="h-4 w-4" />
              تفعيل التمرير
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              تفعيل الفيديو
            </>
          )}
        </button>
      </div>
    </div>
  );
}
