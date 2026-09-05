export function LessonPlayer({ driveFileId, title }: { driveFileId: string; title: string }) {
  const videoUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(driveFileId)}&export=view&confirm=t`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl shadow-blue-950/30">
      <video
        title={title}
        src={videoUrl}
        className="block aspect-video w-full bg-black object-contain"
        crossOrigin="anonymous"
        controls
        playsInline
        preload="metadata"
      >
        متصفحك لا يدعم تشغيل الفيديو.
      </video>
    </div>
  );
}
