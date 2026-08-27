export function LessonPlayer({ driveFileId, title }: { driveFileId: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl shadow-blue-950/30">
      <iframe
        title={title}
        src={`https://drive.google.com/file/d/${driveFileId}/preview`}
        className="aspect-video w-full"
        allow="autoplay; encrypted-media; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
