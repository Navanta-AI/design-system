"use client";

import type { ReactNode } from "react";

/* ─────────────────────────────────────────────
 *  Variant color maps
 * ───────────────────────────────────────────── */
const variants = {
  default: {
    dot: "var(--brand-primary)",
    bg: "var(--surface-accent)",
    border: "var(--brand-primary)",
  },
  christy: {
    dot: "#581c87",
    bg: "#faf9ff",
    border: "#581c87",
  },
};

/* ─────────────────────────────────────────────
 *  Radio indicator (SVG circle)
 * ───────────────────────────────────────────── */
function RadioDot({ active, color, size = 14 }: { active: boolean; color: string; size?: number }) {
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      {active ? (
        <>
          <circle cx={c} cy={c} r={c} fill={color} />
          <circle cx={c} cy={c} r={size * 0.22} fill="#fff" />
        </>
      ) : (
        <circle cx={c} cy={c} r={c - 1.5} fill="none" stroke="var(--border-strong)" strokeWidth={1.5} />
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────
 *  RadioCard — reusable selection card
 *
 *  variant:
 *    "default"  — blue (brand primary)
 *    "christy"  — purple (Christy AI theme)
 * ───────────────────────────────────────────── */
export interface RadioCardProps {
  selected: boolean;
  label: string;
  detail?: string;
  badge?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  /** "default" (blue) or "christy" (purple). Default: "default" */
  variant?: "default" | "christy";
}

export function RadioCard({
  selected,
  label,
  detail,
  badge,
  onClick,
  disabled = false,
  className = "",
  variant = "default",
}: RadioCardProps) {
  const colors = variants[variant];
  const hasDetail = !!detail;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex gap-2 ${hasDetail ? "items-start" : "items-center"} text-left transition-all ${
        hasDetail ? "rounded-[12px] px-3 py-2" : "px-1 py-1"
      } ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      style={hasDetail ? {
        background: selected ? colors.bg : "var(--surface-base)",
        border: selected ? `1px solid ${colors.border}` : "1px solid var(--border-default)",
      } : {
        background: "transparent",
        border: "none",
      }}
    >
      <div className={`flex items-center shrink-0 ${hasDetail ? "py-0.5" : ""}`}>
        <RadioDot active={selected} color={colors.dot} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-normal text-[var(--text-primary)] leading-normal">{label}</span>
          {badge}
        </div>
        {detail && (
          <span className="text-[12px] font-normal text-[var(--text-secondary)] leading-normal">{detail}</span>
        )}
      </div>
    </button>
  );
}
