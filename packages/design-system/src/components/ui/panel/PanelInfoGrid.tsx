"use client";

import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";

export interface InfoRow {
  label: string;
  value: string | ReactNode;
  /** Optional Phosphor icon on the left */
  icon?: Icon;
  /** Make value a clickable link */
  link?: boolean;
  href?: string;
}

interface PanelInfoGridProps {
  title: string;
  rows: InfoRow[];
}

export function PanelInfoGrid({ title, rows }: PanelInfoGridProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] font-medium text-[var(--text-primary)]">{title}</span>
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--surface-raised)" }}>
        {rows.map((row, idx) => {
          const IconComp = row.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: idx < rows.length - 1 ? "1px solid var(--border-default)" : "none" }}
            >
              <div className="flex items-center gap-2">
                {IconComp && <IconComp size={14} weight="bold" className="text-[var(--text-secondary)] shrink-0" />}
                <span className="text-[13px] text-[var(--text-secondary)]">{row.label}</span>
              </div>
              {typeof row.value === "string" ? (
                row.link && row.href ? (
                  <a
                    href={row.href}
                    className="text-[14px] font-medium text-[var(--text-accent-dark)] hover:underline no-underline"
                  >
                    {row.value}
                  </a>
                ) : (
                  <span
                    className="text-[14px] font-medium text-right"
                    style={{ color: row.link ? "var(--text-accent-dark)" : "var(--text-primary)" }}
                  >
                    {row.value}
                  </span>
                )
              ) : (
                <div className="text-[14px] font-medium text-[var(--text-primary)] text-right">
                  {row.value}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
