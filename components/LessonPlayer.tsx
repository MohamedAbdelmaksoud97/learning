"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

export function LessonPlayer({ lessonId, title }: { lessonId: string; title: string }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl shadow-blue-950/30">
        <video
          title={title}
          src={`/api/lessons/${encodeURIComponent(lessonId)}/video`}
          className="block aspect-video w-full bg-black object-contain"
          controls
          controlsList="nodownload noremoteplayback"
          playsInline
          preload="auto"
          onCanPlay={() => setHasError(false)}
          onError={() => setHasError(true)}
        >
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      </div>

      {hasError ? (
        <p className="flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          تعذر قراءة الفيديو من Google Drive. تأكد أن صلاحية الملف مضبوطة على «أي شخص لديه الرابط»، ثم أعد تحميل الصفحة.
        </p>
      ) : null}
    </div>
  );
}
