import { AppShell } from "@/components/AppShell";
import { SuccessStoryCard } from "@/components/SuccessStoryCard";
import { EmptyState } from "@/components/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data";

export default async function SuccessStoriesPage() {
  const profile = await getProfile();
  const supabase = await createClient();
  const { data } = await supabase
    .from("success_stories")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <AppShell profile={profile}>
      <h1 className="text-3xl font-black">قصص النجاح</h1>
      <p className="mt-3 text-slate-400">قصص طلاب منشورة لتحفيز الرحلة التعليمية.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data?.length ? data.map((story) => <SuccessStoryCard key={story.id} story={story} />) : <EmptyState title="لا توجد قصص منشورة" />}
      </div>
    </AppShell>
  );
}
