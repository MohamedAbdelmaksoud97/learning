import { Card } from "@/components/ui/card";
import type { SuccessStory } from "@/lib/types";

export function SuccessStoryCard({ story }: { story: SuccessStory }) {
  return (
    <Card className="overflow-hidden transition hover:-translate-y-1 hover:border-sky-400/40">
      <div className="h-40 bg-gradient-to-br from-blue-600/30 via-slate-900 to-cyan-400/20">
        {story.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={story.image_url} alt={story.student_name} className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="p-5">
        <p className="text-sm text-sky-200">{story.student_name}</p>
        <h3 className="mt-2 text-xl font-black text-white">{story.title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-400">{story.description}</p>
        {story.score ? (
          <div className="mt-5">
            <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs text-blue-100">{story.score}%</span>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
