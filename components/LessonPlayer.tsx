export function LessonPlayer({ driveFileId, title }: { driveFileId: string; title: string }) {
  const previewUrl = `https://drive.google.com/file/d/${encodeURIComponent(driveFileId)}/preview`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl shadow-blue-950/30">
      <iframe
        title={title}
        src={previewUrl}
        className="block aspect-video w-full border-0"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
