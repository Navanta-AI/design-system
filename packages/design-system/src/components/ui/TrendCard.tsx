"use client";

import { TrendUp, TrendDown, Info } from "@phosphor-icons/react";
import { Tooltip } from "../Tooltip";

export function TrendCard({
  label,
  value,
  trend,
  tooltip,
}: {
  label: string;
  value: string;
  trend: { direction: "up" | "down"; text: string; positive?: "up" | "down" };
  tooltip?: string;
}) {
  const isGood = trend.positive
    ? trend.direction === trend.positive
    : trend.direction === "up";

  return (
    <div
      className="flex-1 max-w-[25%] bg-[var(--surface-base)] border border-[var(--border-default)] rounded-lg flex flex-col justify-between"
      style={{ padding: 14, boxShadow: "var(--shadow-card)" }}
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
      <div className="flex items-center h-[30px]">
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
            isGood ? "bg-[var(--surface-success-alt)]" : "bg-[var(--surface-danger-alt)]"
          }`}
        >
          {trend.direction === "up" ? (
            <TrendUp size={16} weight="bold" className={isGood ? "text-emerald-600" : "text-red-500"} />
          ) : (
            <TrendDown size={16} weight="bold" className={isGood ? "text-emerald-600" : "text-red-500"} />
          )}
          <span className="text-sm text-[var(--text-primary)]">{trend.text}</span>
        </div>
      </div>
    </div>
  );
}
