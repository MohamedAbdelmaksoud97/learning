import { isLessonUnlocked } from "@/lib/lesson-locks";
import { createClient } from "@/lib/supabase/server";
import { getAllowedLevels } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CHUNK_SIZE = 4 * 1024 * 1024;

function getDriveFileId(value: string) {
  const trimmed = value.trim();
  const pathMatch = trimmed.match(/\/file\/d\/([^/?#]+)/);
  if (pathMatch?.[1]) return pathMatch[1];

  try {
    const id = new URL(trimmed).searchParams.get("id");
    if (id) return id;
  } catch {
    // A plain Drive file ID is the normal stored value.
  }

  return /^[a-zA-Z0-9_-]+$/.test(trimmed) ? trimmed : null;
}

function getUpstreamRange(rangeHeader: string | null) {
  if (!rangeHeader) return `bytes=0-${MAX_CHUNK_SIZE - 1}`;

  const suffixMatch = rangeHeader.match(/^bytes=-(\d+)$/);
  if (suffixMatch) {
    const suffixLength = Number(suffixMatch[1]);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return null;
    return `bytes=-${Math.min(suffixLength, MAX_CHUNK_SIZE)}`;
  }

  const match = rangeHeader.match(/^bytes=(\d+)-(\d*)$/);
  if (!match) return null;

  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : start + MAX_CHUNK_SIZE - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(requestedEnd) || requestedEnd < start) {
    return null;
  }

  return `bytes=${start}-${Math.min(requestedEnd, start + MAX_CHUNK_SIZE - 1)}`;
}

function errorResponse(message: string, status: number) {
  return Response.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

async function fetchVideoChunk(fileId: string, range: string) {
  const driveUrl = new URL("https://drive.usercontent.google.com/download");
  driveUrl.searchParams.set("id", fileId);
  driveUrl.searchParams.set("export", "view");
  driveUrl.searchParams.set("confirm", "t");

  return fetch(driveUrl, {
    headers: { Range: range, "Accept-Encoding": "identity" },
    redirect: "follow",
    cache: "no-store",
  });
}

export async function GET(
  request: Request,
  context: RouteContext<"/api/lessons/[id]/video">,
) {
  const { id: lessonId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return errorResponse("Unauthorized", 401);

  const [{ data: profile }, { data: lesson }] = await Promise.all([
    supabase
      .from("profiles")
      .select("level,is_active")
      .eq("id", user.id)
      .maybeSingle<{ level: string; is_active: boolean }>(),
    supabase
      .from("lessons")
      .select("id,drive_file_id,level,lesson_order")
      .eq("id", lessonId)
      .eq("is_active", true)
      .maybeSingle(),
  ]);

  if (!profile || profile.is_active === false) return errorResponse("Account disabled", 403);
  if (!lesson) return errorResponse("Lesson not found", 404);

  const allowedLevels = getAllowedLevels(profile.level);
  if (!allowedLevels.includes(lesson.level)) return errorResponse("Lesson not found", 404);

  const { data: availableLessons } = await supabase
    .from("lessons")
    .select("id,level,lesson_order,lesson_progress(completed,completed_at)")
    .in("level", allowedLevels)
    .eq("is_active", true)
    .order("level")
    .order("lesson_order");

  if (!isLessonUnlocked(lesson.id, availableLessons ?? [])) {
    return errorResponse("Lesson is locked", 403);
  }

  const fileId = getDriveFileId(lesson.drive_file_id);
  if (!fileId) return errorResponse("Invalid Google Drive file ID", 422);

  const range = getUpstreamRange(request.headers.get("range"));
  if (!range) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": "bytes */*" },
    });
  }

  let upstream: Response;
  try {
    upstream = await fetchVideoChunk(fileId, range);
  } catch {
    return errorResponse("Google Drive is temporarily unavailable", 502);
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  if (!upstream.ok || !upstream.body || !contentType.startsWith("video/")) {
    await upstream.body?.cancel().catch(() => undefined);
    return errorResponse("Google Drive did not return a playable video", 502);
  }

  const responseHeaders = new Headers();
  for (const name of [
    "accept-ranges",
    "content-length",
    "content-range",
    "etag",
    "last-modified",
  ]) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }

  responseHeaders.set("Content-Type", contentType);
  responseHeaders.set("Content-Disposition", 'inline; filename="lesson-video.mp4"');
  responseHeaders.set("Cache-Control", "private, no-store");

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
