"use client";

import type { ReactNode } from "react";

/* ─────────────────────────────────────────────
 *  EmptyState — standardized "nothing here" screen.
 *
 *  Two situations (see the TableShell + Table.Empty recipe):
 *    • First-time / empty — there's genuinely no data yet (offer a CTA / link).
 *    • No results — a search/filter matched nothing (offer "clear").
 *
 *  Neutral by default (per the color standard). Centered content with a
 *  nested-ring icon, matching the HMTX Portal empty design (Figma node 802:4802):
 *  136×139 / 102×103 / 66×66 concentric rounded rings around a 32px duotone icon,
 *  an 18px title, and a 14px description with an optional inline link directly
 *  beneath it.
 * ───────────────────────────────────────────── */

export interface EmptyStateProps {
  /** Optional icon shown inside concentric rings (pass a sized node, e.g. <Star weight="duotone" />). */
  icon?: ReactNode;
  /** Headline. */
  title: string;
  /** Supporting line(s) below the title. */
  description?: ReactNode;
  /**
   * A text link rendered directly under the description (Figma: 14px medium,
   * underlined, `--text-link`). Use for "search instead" affordances. For a
   * Button CTA use `action` instead.
   */
  link?: { label: string; onClick?: () => void; href?: string };
  /** Optional separated action area below — typically a Button (primary CTA). */
  action?: ReactNode;
  /** Vertical padding scale (default "md"). */
  size?: "sm" | "md";
  className?: string;
}

const linkClasses =
  "font-medium leading-[22px] text-[var(--text-link)] underline transition-opacity hover:opacity-80";

export function EmptyState({
  icon,
  title,
  description,
  link,
  action,
  size = "md",
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center text-center ${
        size === "sm" ? "gap-3 px-6 py-8" : "gap-4 px-6 py-10"
      } ${className}`}
    >
      {icon && (
        <div
          className="flex items-center justify-center rounded-[52px] border"
          style={{ width: 136, height: 139, borderColor: "rgba(192,203,224,0.31)" }}
        >
          <div
            className="flex items-center justify-center rounded-[38px] border"
            style={{ width: 102, height: 103, borderColor: "rgba(173,182,205,0.41)" }}
          >
            <div
              className="flex items-center justify-center rounded-[24px] border text-[var(--text-neutral)] [&>svg]:size-8"
              style={{ width: 66, height: 66, borderColor: "rgba(159,172,189,0.65)" }}
            >
              {icon}
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full max-w-sm flex-col items-center gap-2">
        <span className="text-[18px] font-semibold leading-[1.44] text-[var(--text-primary)]">{title}</span>
        {(description != null || link) && (
          <div className="flex w-full flex-col items-center text-[14px] leading-[22px] text-[var(--text-primary)]">
            {description != null && <p className="w-full">{description}</p>}
            {link &&
              (link.href ? (
                <a href={link.href} className={linkClasses}>
                  {link.label}
                </a>
              ) : (
                <button type="button" onClick={link.onClick} className={linkClasses}>
                  {link.label}
                </button>
              ))}
          </div>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
