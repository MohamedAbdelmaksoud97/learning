import styles from "./LessonPlayer.module.css";

export function LessonPlayer({ driveFileId, title }: { driveFileId: string; title: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl shadow-blue-950/30">
      <iframe
        title={title}
        src={`https://drive.google.com/file/d/${driveFileId}/preview`}
        className={styles.frame}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
