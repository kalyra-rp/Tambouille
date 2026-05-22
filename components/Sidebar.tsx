"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { Sparkle } from "./Sparkle";
import { useCauldron } from "@/lib/useCauldron";

const NAV_ITEMS = [
  { href: "/", emoji: "🏠", label: "Accueil" },
  { href: "/recettes", emoji: "📚", label: "Recettes" },
  { href: "/chaudron", emoji: "🍲", label: "Chaudron" },
  { href: "/courses", emoji: "🛒", label: "Courses" },
  { href: "/menus", emoji: "🎉", label: "Menus" },
  { href: "/chouchous", emoji: "❤️", label: "Chouchous" },
  { href: "/garde-manger", emoji: "🧂", label: "Garde-manger" },
] as const;

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { items } = useCauldron();
  const cauldronCount = items.length;

  return (
    <aside
      className="flex h-full flex-col justify-between rounded-[34px] border border-white/65 p-[22px]"
      style={{
        background: "rgba(255, 249, 239, 0.76)",
        backdropFilter: "blur(18px)",
        boxShadow: "var(--shadow-pop-soft)",
      }}
    >
      <div>
        <div className="mb-6">
          <Logo />
        </div>

        <nav aria-label="Navigation principale" className="grid gap-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`nav-item flex items-center gap-3 rounded-[18px] px-[14px] py-[13px] text-[14px] font-extrabold transition ${
                  active ? "nav-item--active" : "text-cocoa"
                }`}
              >
                <span aria-hidden className="nav-item__icon">
                  {item.emoji}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Raccourci création */}
        <Link
          href="/recettes/nouvelle"
          onClick={onNavigate}
          className="sidebar-cta mt-4"
        >
          + Nouvelle recette
        </Link>
      </div>

      <div className="relative">
        {/* Étincelles qui pétillent autour de la carte d'action */}
        <Sparkle className="-left-[6px] -top-[14px]" size={22} delay={0} />
        <Sparkle
          className="-right-[10px] -top-[8px]"
          size={18}
          delay={-1.2}
          glyph="✧"
          color="#ff9fc0"
        />
        <Sparkle
          className="-bottom-[10px] left-[40%]"
          size={16}
          delay={-2}
          glyph="✦"
        />

        <div
          className="relative overflow-hidden rounded-[26px] p-[18px] text-white"
          style={{
            background:
              "linear-gradient(135deg, #ffd447, #ff7a2f 42%, var(--hot-pink) 70%, var(--wine-rose))",
            backgroundSize: "220% 220%",
            animation: "gradientPulse 6s ease infinite",
            boxShadow: "0 18px 36px rgba(233, 38, 85, 0.26)",
          }}
        >
          <span
            aria-hidden
            className="absolute right-[14px] top-[10px] text-[34px] opacity-65"
          >
            ✨
          </span>
          <strong className="mb-2 block font-display text-[22px] leading-none">
            {cauldronCount > 0 ? "Chaos vaincu" : "Chaudron vide"}
          </strong>
          <p className="m-0 mb-3 text-[13px] font-semibold opacity-90">
            {cauldronCount > 0
              ? `${cauldronCount} recette${cauldronCount > 1 ? "s" : ""} dans le chaudron. La liste de courses frémit déjà.`
              : "Ajoute des recettes pour faire bouillir la marmite."}
          </p>
          <Link
            href="/courses"
            className="inline-block cursor-pointer rounded-full bg-white px-[14px] py-[10px] font-black text-dark-rose no-underline"
          >
            Générer ✨
          </Link>
        </div>
      </div>
    </aside>
  );
}
