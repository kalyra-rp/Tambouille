import { Card } from "@/components/Card";

export default function LoadingRecettes() {
  return (
    <Card as="section" className="relative overflow-hidden">
      <header className="mb-6">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-[13px] py-[8px] text-[13px] font-black text-dark-rose">
          📚 Ta bibliothèque gourmande
        </span>
        <h1 className="m-0 font-display text-[clamp(36px,5vw,52px)] tracking-[-1px] text-chocolate">
          Recettes à croquer
        </h1>
        <p className="mt-2 max-w-[560px] text-cocoa font-semibold">
          Le chaudron consulte le grimoire…
        </p>
      </header>

      {/* Chips skeleton */}
      <div className="mb-6 flex flex-wrap gap-[9px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="inline-block h-[36px] w-[110px] animate-pulse rounded-full bg-white/60"
          />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1180px]:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[30px] bg-white/70 p-[10px]"
            style={{ boxShadow: "0 16px 34px rgba(115, 42, 24, 0.08)" }}
          >
            <div className="h-[160px] animate-pulse rounded-[24px] bg-cream-2/80" />
            <div className="px-[10px] pb-[10px] pt-[14px]">
              <div className="mb-3 h-5 w-3/4 animate-pulse rounded-full bg-cream-2/80" />
              <div className="mb-3 h-3 w-1/2 animate-pulse rounded-full bg-cream-2/80" />
              <div className="h-[42px] w-full animate-pulse rounded-[18px] bg-cream-2/80" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
