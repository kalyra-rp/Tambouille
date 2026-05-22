import { Card } from "./Card";
import { Sparkle } from "./Sparkle";

type PagePlaceholderProps = {
  emoji: string;
  title: string;
  tagline: string;
  hint?: string;
};

export function PagePlaceholder({
  emoji,
  title,
  tagline,
  hint,
}: PagePlaceholderProps) {
  return (
    <Card as="section" className="relative overflow-hidden">
      <Sparkle className="left-[18%] top-[20%]" />
      <Sparkle className="right-[14%] top-[30%]" glyph="✧" delay={-1.2} color="#ff9fc0" />
      <Sparkle className="left-[40%] bottom-[20%]" size={20} delay={-2} />

      <div className="relative max-w-[640px]">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-[13px] py-[8px] text-[13px] font-black text-dark-rose">
          {emoji} Tambouille
        </span>
        <h1 className="mb-3 font-display text-[clamp(36px,5vw,56px)] tracking-[-1px] text-chocolate">
          {title}
        </h1>
        <p className="m-0 max-w-[520px] text-[17px] font-semibold leading-[1.6] text-cocoa">
          {tagline}
        </p>
        {hint && (
          <p className="mt-4 inline-block rounded-full bg-vanilla px-4 py-2 text-[12px] font-black uppercase tracking-[0.08em] text-dark-rose">
            {hint}
          </p>
        )}
      </div>
    </Card>
  );
}
