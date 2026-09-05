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

export function LessonPlayer({ driveFileId, title }: { driveFileId: string; title: string }) {
  const normalizedFileId = normalizeDriveFileId(driveFileId);
  const previewUrl = `https://drive.google.com/file/d/${encodeURIComponent(normalizedFileId)}/preview`;

  return (
    <div className="relative aspect-video w-full min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-black shadow-2xl shadow-blue-950/30 sm:rounded-2xl">
      <iframe
        title={title}
        src={previewUrl}
        className="absolute inset-0 block h-full w-full border-0"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
