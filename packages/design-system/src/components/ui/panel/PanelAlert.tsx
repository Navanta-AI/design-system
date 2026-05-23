"use client";

import { CheckCircle, Warning, Package, Prohibit } from "@phosphor-icons/react";

const alertStyles = {
  danger:    { bg: "#fef2f2", iconColor: "#ef4444" },
  warning:   { bg: "#fffbeb", iconColor: "#f59e0b" },
  info:      { bg: "#eff6ff", iconColor: "#3b82f6" },
  success:   { bg: "#f0fdf4", iconColor: "#10b981" },
  cancelled: { bg: "#ffeded", iconColor: "#DE1010" },
};

interface PanelAlertProps {
  type: "danger" | "warning" | "info" | "success" | "cancelled";
  title: string;
  badge?: string;
  description: string;
  details?: string[];
  boldText?: string;
}

export function PanelAlert({ type, title, badge, description, details, boldText }: PanelAlertProps) {
  const style = alertStyles[type] ?? alertStyles.info;

  if (type === "cancelled") {
    return (
      <div className="flex flex-col gap-1 rounded-[12px] px-4 py-2" style={{ background: style.bg }}>
        <div className="flex items-start gap-2">
          <div className="py-1 shrink-0">
            <Package size={14} weight="duotone" style={{ color: style.iconColor }} />
          </div>
          <span className="text-[14px] font-semibold leading-[1.5] text-[#333]">{title}</span>
        </div>
        <p className="text-[14px] text-[#333] leading-[1.5]">{description}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-[12px] px-4 py-3" style={{ background: style.bg }}>
      {/* Title row */}
      <div className="flex items-center gap-2">
        <div className="flex items-center shrink-0">
          {type === "success" ? (
            <CheckCircle size={14} weight="duotone" style={{ color: style.iconColor }} />
          ) : (
            <Warning size={14} weight="duotone" style={{ color: style.iconColor }} />
          )}
        </div>
        <span className="text-[14px] font-semibold leading-[1.3] text-[#333]">{title}</span>
        {badge && (
          <span
            className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: `${style.iconColor}18`, color: style.iconColor }}
          >
            {badge}
          </span>
        )}
      </div>
      {/* Description */}
      <p className="text-[13px] text-[#555] leading-[1.4]">{description}</p>
      {/* Stacked detail lines */}
      {details?.map((line, i) => (
        <span key={i} className="text-[12px] text-[#777] leading-[1.3]">{line}</span>
      ))}
      {/* Legacy boldText */}
      {!details && boldText && (
        <p className="text-[13px] text-[#555] leading-[1.4]">
          <span className="font-medium">{boldText}</span>
        </p>
      )}
    </div>
  );
}
