"use client";

import { RadioButton } from "@phosphor-icons/react";

export interface TimelineMilestone {
  id: string;
  label: string;
  status: "completed" | "active" | "pending";
  date?: string;
  events: { type: string; date: string; severity: "info" | "warning" | "critical"; note?: string; resolved?: boolean }[];
}

interface PanelTimelineProps {
  title?: string;
  milestones: TimelineMilestone[];
  /** Unique prefix for SVG gradient IDs to avoid collisions */
  idPrefix?: string;
}

export function PanelTimeline({ title = "Delivery Status", milestones, idPrefix = "ptl" }: PanelTimelineProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] font-medium text-[var(--text-primary)]">{title}</span>
      <div className="flex flex-col">
        {milestones.map((ms, idx) => {
          const isCompleted = ms.status === "completed";
          const isActive = ms.status === "active";
          const isPending = ms.status === "pending";
          const hasWarning = ms.events.some((e) => e.severity === "warning" && !e.resolved);
          const hasCritical = ms.events.some((e) => e.severity === "critical" && !e.resolved);
          const isLast = idx === milestones.length - 1;
          const nextCompleted = !isLast && milestones[idx + 1]?.status === "completed";
          const solidLine = isCompleted && (nextCompleted || milestones[idx + 1]?.status === "active");

          return (
            <div key={ms.id} className="flex items-stretch gap-3">
              {/* Icon + connecting line */}
              <div className="flex flex-col items-center" style={{ width: 20 }}>
                <div className="shrink-0 flex items-center justify-center" style={{ width: 20, height: 20 }}>
                  {isCompleted && !hasWarning && !hasCritical && (
                    <svg width={20} height={20} viewBox="0 0 256 256">
                      <defs>
                        <linearGradient id={`${idPrefix}-${idx}`} x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#059669" />
                          <stop offset="1" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" fill={`url(#${idPrefix}-${idx})`} />
                    </svg>
                  )}
                  {(isCompleted && (hasWarning || hasCritical)) && (
                    <RadioButton size={20} weight="fill" style={{ color: hasCritical ? "#ef4444" : "#E87000" }} />
                  )}
                  {isActive && (hasCritical || hasWarning) && (
                    <RadioButton size={20} weight="fill" style={{ color: hasCritical ? "#ef4444" : "#E87000" }} />
                  )}
                  {isActive && !hasCritical && !hasWarning && (
                    <svg width={20} height={20} viewBox="0 0 20 20">
                      <circle cx={10} cy={10} r={8} fill="#3b82f6" />
                      <circle cx={10} cy={10} r={3.5} fill="white" />
                    </svg>
                  )}
                  {isPending && (
                    <svg width={20} height={20} viewBox="0 0 20 20">
                      <circle cx={10} cy={10} r={8} fill="none" stroke="#cbd5e1" strokeWidth={1.5} />
                    </svg>
                  )}
                </div>
                {!isLast && (
                  <div
                    className="flex-1"
                    style={{
                      width: 1.5,
                      marginTop: 4,
                      marginBottom: 4,
                      background: solidLine ? "#cbd5e1" : undefined,
                      backgroundImage: !solidLine ? "repeating-linear-gradient(180deg, #cbd5e1 0, #cbd5e1 4px, transparent 4px, transparent 8px)" : undefined,
                    }}
                  />
                )}
              </div>
              {/* Label + date + events */}
              <div className="flex flex-col pb-4">
                <span className="text-[13px] font-medium text-[var(--text-primary)]">{ms.label}</span>
                <span
                  className="text-[12px]"
                  style={{ color: hasCritical ? "#DE1010" : hasWarning ? "#E87000" : "var(--text-secondary)" }}
                >
                  {ms.date?.replace(/,?\s*\d{4}/, "") ?? ""}
                </span>
                {(hasWarning || hasCritical) && ms.events.filter((e) => !e.resolved && e.type !== "cancelled").map((e, i) => (
                  <span key={i} className="text-[12px] font-medium mt-0.5" style={{ color: hasCritical ? "#DE1010" : "#E87000" }}>
                    {e.note}
                  </span>
                ))}
                {ms.events.some((e) => e.type === "cancelled") && (
                  <div className="flex flex-col mt-1">
                    <span className="text-[13px] font-medium" style={{ color: "#DE1010" }}>Order Cancelled</span>
                    <span className="text-[12px]" style={{ color: "#DE1010" }}>{ms.date?.replace(/,?\s*\d{4}/, "") ?? ""}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
