"use client";

import { useState } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export function LessonPlayer({ driveFileId, title }: { driveFileId: string; title: string }) {
  const [useDrivePreview, setUseDrivePreview] = useState(false);
  const directVideoUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(driveFileId)}&export=download&confirm=t`;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-black shadow-2xl shadow-blue-950/30">
        {useDrivePreview ? (
          <iframe
            title={title}
            src={`https://drive.google.com/file/d/${driveFileId}/preview`}
            className="aspect-video min-h-[220px] w-full bg-black"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <video
            key={driveFileId}
            title={title}
            src={directVideoUrl}
            className="aspect-video min-h-[220px] w-full bg-black object-contain"
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            onError={() => setUseDrivePreview(true)}
          >
            متصفحك لا يدعم تشغيل الفيديو.
          </video>
        )}
      </div>

      {useDrivePreview ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs text-amber-100">
          <p className="inline-flex items-center gap-2 leading-5">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-300" />
            تم تشغيل وضع Google Drive الاحتياطي لأن صيغة المقطع لم تعمل بالمشغل المباشر.
          </p>
          <button
            type="button"
            onClick={() => setUseDrivePreview(false)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 font-bold text-amber-200 transition hover:bg-amber-300/10 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            إعادة محاولة المشغل المباشر
          </button>
        </div>
      ) : null}
    </div>
  );
}
