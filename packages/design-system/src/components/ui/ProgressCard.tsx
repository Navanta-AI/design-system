"use client";

import { Info } from "@phosphor-icons/react";
import { Tooltip } from "../Tooltip";

/* ─────────────────────────────────────────────
 *  Built-in progress bar gradient variants
 * ───────────────────────────────────────────── */
const progressVariants = {
  brand: "var(--gradient-brand)",
  green: "var(--gradient-progress-green)",
  amber: "var(--gradient-progress-amber)",
  red:   "var(--gradient-progress-red)",
  blue:  "var(--gradient-progress-blue)",
};

type ProgressVariant = keyof typeof progressVariants;

export function ProgressCard({
  label,
  value,
  subtitle,
  progress,
  tooltip,
}: {
  label: string;
  value: string;
  subtitle: string;
  progress: { percentage: number; variant?: ProgressVariant; color?: string };
  tooltip?: string;
}) {
  const barBackground = progress.color
    ?? progressVariants[progress.variant ?? "brand"];

  return (
    <div
      className="flex-1 max-w-[25%] bg-[var(--surface-base)] border border-[var(--border-default)] rounded-lg flex flex-col"
      style={{ padding: 14, gap: 16, boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-[var(--brand-purple-deep)]">{label}</span>
          {tooltip ? (
            <Tooltip content={tooltip}>
              <span className="group inline-flex">
                <Info size={14} weight="bold" className="text-[var(--text-secondary)] group-hover:hidden" />
                <Info size={14} weight="fill" className="text-[var(--text-secondary)] hidden group-hover:inline-flex" />
              </span>
            </Tooltip>
          ) : (
            <Info size={14} weight="bold" className="text-[var(--text-secondary)]" />
          )}
        </div>
        <span className="text-[22px] gradient-text tracking-[-2%]" style={{ fontWeight: 600, position: "relative", top: -4 }}>
          {value}
        </span>
      </div>
      <div className="flex flex-col gap-[5px]">
        <span className="text-[13px] text-[var(--text-secondary)] tracking-wide">{subtitle}</span>
        <div className="h-[7px] bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${progress.percentage}%`, background: barBackground }}
          />
        </div>
      </div>
    </div>
  );
}
