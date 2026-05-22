import { Card } from "@/components/Card";

export default function LoadingRecipe() {
  return (
    <div className="grid gap-6">
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[13px] font-black text-dark-rose">
        ← Toutes les recettes
      </span>

      {/* Hero skeleton */}
      <div
        className="relative animate-pulse overflow-hidden rounded-[42px] bg-white/40"
        style={{ minHeight: 440 }}
      >
        <div className="absolute inset-x-0 bottom-0 p-10">
          <div className="mb-3 h-9 w-40 rounded-full bg-cream-2/70" />
          <div className="mb-3 h-16 w-3/4 rounded-2xl bg-cream-2/70" />
          <div className="h-5 w-1/2 rounded-full bg-cream-2/70" />
        </div>
      </div>

      <Card>
        <div className="mb-4 h-4 w-2/3 animate-pulse rounded-full bg-cream-2/70" />
        <div className="mb-4 h-4 w-1/2 animate-pulse rounded-full bg-cream-2/70" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="inline-block h-[36px] w-[110px] animate-pulse rounded-full bg-cream-2/70"
            />
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className="inline-block h-[36px] w-[130px] animate-pulse rounded-full bg-cream-2/70"
            />
          ))}
        </div>
        <div className="grid gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[48px] animate-pulse rounded-[18px] bg-cream-2/70"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
