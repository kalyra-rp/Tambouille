"use client";

type MobileTopbarProps = {
  onMenuClick: () => void;
};

export function MobileTopbar({ onMenuClick }: MobileTopbarProps) {
  return (
    <div
      className="mobile-topbar flex items-center justify-between rounded-[28px] p-[18px]"
      style={{
        background: "rgba(255, 255, 255, 0.78)",
        backdropFilter: "blur(14px)",
        boxShadow: "var(--shadow-pop-soft)",
      }}
    >
      <strong className="font-display text-[28px] text-chocolate">
        🍲 Tambouille
      </strong>
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Ouvrir le menu"
        className="cursor-pointer rounded-full border-0 bg-white px-[14px] py-[10px] font-black text-dark-rose"
      >
        Menu
      </button>
    </div>
  );
}
