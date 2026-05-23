"use client";

import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";

/* ─────────────────────────────────────────────
 *  Shared types
 * ───────────────────────────────────────────── */
type ButtonSize = "sm" | "md";

const sizeStyles: Record<ButtonSize, { height: string; px: string; plIcon: number; pl: number; pr: number }> = {
  sm: { height: "h-[28px]", px: "px-3", plIcon: 10, pl: 12, pr: 12 },
  md: { height: "h-[32px]", px: "px-4", plIcon: 14, pl: 16, pr: 16 },
};

interface ButtonBaseProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  /** Phosphor icon rendered to the LEFT of text */
  iconLeft?: Icon;
  /** Phosphor icon rendered to the RIGHT of text */
  iconRight?: Icon;
  /** Icon size in px (default 14) */
  iconSize?: number;
  /** Full width (default false) */
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  /** "sm" (28px) or "md" (32px). Default: "md" */
  size?: ButtonSize;
}

/* ─────────────────────────────────────────────
 *  Primary Button
 *  Solid dark outline style — the default action button
 * ───────────────────────────────────────────── */
export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = "",
  iconLeft: IconLeft,
  iconRight: IconRight,
  iconSize = 14,
  fullWidth,
  type = "button",
  size = "md",
}: ButtonBaseProps) {
  const s = sizeStyles[size];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-1
        ${s.height} text-[14px] font-medium text-[var(--btn-primary-text)] tracking-[-0.28px]
        rounded-[8px] transition-all active:scale-[0.97]
        disabled:cursor-not-allowed
        ${fullWidth ? "w-full" : ""}
        ${className}
      `.trim()}
      style={{
        paddingLeft: IconLeft ? s.plIcon : s.pl,
        paddingRight: s.pr,
        background: disabled
          ? "var(--btn-primary-disabled-bg)"
          : "var(--btn-primary-bg)",
        color: disabled ? "var(--btn-primary-disabled-text)" : undefined,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "var(--btn-primary-bg-hover)"; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = "var(--btn-primary-bg)"; }}
    >
      {IconLeft && <IconLeft size={iconSize} weight="bold" className="shrink-0" />}
      {children}
      {IconRight && <IconRight size={iconSize} weight="bold" className="shrink-0" />}
    </button>
  );
}

/* ─────────────────────────────────────────────
 *  Secondary Button
 *  Lighter outline — used for dismissive / less prominent actions
 * ───────────────────────────────────────────── */
export function SecondaryButton({
  children,
  onClick,
  disabled,
  className = "",
  iconLeft: IconLeft,
  iconRight: IconRight,
  iconSize = 14,
  fullWidth,
  type = "button",
  size = "md",
}: ButtonBaseProps) {
  const s = sizeStyles[size];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        ${s.height} ${s.px} text-[13px] font-normal text-[var(--text-primary)]
        bg-[var(--btn-secondary-bg)] border border-[var(--btn-secondary-border)] rounded-[8px]
        hover:bg-[var(--btn-secondary-hover-bg)] hover:border-[var(--brand-primary)] hover:text-[var(--text-accent)]
        transition-all active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--btn-secondary-bg)] disabled:hover:border-[var(--btn-secondary-border)] disabled:hover:text-[var(--text-primary)]
        ${fullWidth ? "w-full" : ""}
        ${className}
      `.trim()}
    >
      {IconLeft && <IconLeft size={iconSize} weight="bold" className="shrink-0" />}
      {children}
      {IconRight && <IconRight size={iconSize} weight="bold" className="shrink-0" />}
    </button>
  );
}

/* ─────────────────────────────────────────────
 *  Christy Button (Gradient CTA)
 *  Uses .christy-btn-primary from globals.css
 * ───────────────────────────────────────────── */
export function ChristyButton({
  children,
  onClick,
  disabled,
  className = "",
  iconLeft: IconLeft,
  iconRight: IconRight,
  iconSize = 14,
  fullWidth,
  type = "button",
  size = "md",
}: ButtonBaseProps) {
  const s = sizeStyles[size];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        ${s.height} ${size === "sm" ? "px-4" : "px-5"} text-[13px] font-medium text-[var(--btn-primary-text)] tracking-[-0.28px]
        rounded-[8px] christy-btn-primary
        disabled:!bg-[#e2e8f0] disabled:text-[#64748b] disabled:cursor-not-allowed disabled:!background-none
        ${fullWidth ? "w-full" : ""}
        ${className}
      `.trim()}
    >
      {IconLeft && <IconLeft size={iconSize} weight="bold" className="shrink-0" />}
      {children}
      {IconRight && <IconRight size={iconSize} weight="bold" className="shrink-0" />}
    </button>
  );
}

/* ─────────────────────────────────────────────
 *  Disabled Button (explicit visual)
 *  Grey background, muted text, no interactions
 * ───────────────────────────────────────────── */
export function DisabledButton({
  children,
  className = "",
  iconLeft: IconLeft,
  iconRight: IconRight,
  iconSize = 14,
  fullWidth,
  size = "md",
}: Omit<ButtonBaseProps, "onClick" | "disabled" | "type">) {
  const s = sizeStyles[size];
  return (
    <button
      disabled
      className={`
        inline-flex items-center justify-center gap-2
        ${s.height} ${s.px} text-[13px] font-medium text-[#64748b] tracking-[-0.26px]
        bg-[#e2e8f0] rounded-[8px] cursor-not-allowed
        ${fullWidth ? "w-full" : ""}
        ${className}
      `.trim()}
    >
      {IconLeft && <IconLeft size={iconSize} weight="bold" className="shrink-0 text-[#64748b]" />}
      {children}
      {IconRight && <IconRight size={iconSize} weight="bold" className="shrink-0 text-[#64748b]" />}
    </button>
  );
}
