export function LessonPlayer({ driveFileId, title }: { driveFileId: string; title: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl shadow-blue-950/30">
      <iframe
        title={title}
        src={`https://drive.google.com/file/d/${driveFileId}/preview`}
        className="absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 border-0 sm:h-full sm:w-full sm:scale-100"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
