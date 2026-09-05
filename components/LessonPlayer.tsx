"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { useState } from "react";

function normalizeDriveFileId(value: string) {
  const trimmed = value.trim();
  const pathMatch = trimmed.match(/\/file\/d\/([^/?#]+)/);

  if (pathMatch?.[1]) return pathMatch[1];

  try {
    const id = new URL(trimmed).searchParams.get("id");
    if (id) return id;
  } catch {
    // A plain Drive file ID is the normal stored value.
  }

  return trimmed;
}

export function LessonPlayer({
  lessonId,
  driveFileId,
  title,
}: {
  lessonId: string;
  driveFileId: string;
  title: string;
}) {
  const normalizedFileId = normalizeDriveFileId(driveFileId);
  const previewUrl = `https://drive.google.com/file/d/${encodeURIComponent(normalizedFileId)}/preview`;
  const [useDrivePreview, setUseDrivePreview] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);

  return (
    <div className="min-w-0 space-y-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-black shadow-2xl shadow-blue-950/30 sm:rounded-2xl">
        {useDrivePreview ? (
          <iframe
            title={title}
            src={previewUrl}
            className="absolute inset-0 block h-full w-full border-0"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <video
            key={playerKey}
            title={title}
            src={`/api/lessons/${encodeURIComponent(lessonId)}/video`}
            className="block h-full w-full bg-black object-contain"
            controls
            controlsList="nodownload noremoteplayback"
            playsInline
            preload="metadata"
            onError={() => setUseDrivePreview(true)}
          >
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        )}
      </div>

      {useDrivePreview ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-3 py-2.5 text-xs text-amber-100">
          <p className="inline-flex min-w-0 items-start gap-2 leading-5">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
            تعذر تحميل المشغّل المتجاوب؛ تم فتح مشغّل Google Drive الاحتياطي.
          </p>
          <button
            type="button"
            onClick={() => {
              setPlayerKey((value) => value + 1);
              setUseDrivePreview(false);
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 font-bold text-amber-200 transition hover:bg-amber-300/10 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            إعادة المحاولة
          </button>
        </div>
      ) : null}
    </div>
  );
}
