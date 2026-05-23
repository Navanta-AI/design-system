"use client";

import { createPortal } from "react-dom";
import { CheckCircle, Warning, Info, X } from "@phosphor-icons/react";
import { useToast, type ToastItem } from "../../context/ToastContext";

/* ─────────────────────────────────────────────
 *  Toast styles per type
 * ───────────────────────────────────────────── */
const styles: Record<ToastItem["type"], { bg: string; border: string; icon: typeof CheckCircle; iconColor: string }> = {
  success: { bg: "#f0fdf4", border: "#bbf7d0", icon: CheckCircle, iconColor: "#10b981" },
  warning: { bg: "#fef2f2", border: "#fecaca", icon: Warning, iconColor: "#ef4444" },
  info:    { bg: "#eff6ff", border: "#93c5fd", icon: Info, iconColor: "#3b82f6" },
};

/* ─────────────────────────────────────────────
 *  Single Toast
 * ───────────────────────────────────────────── */
function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const s = styles[item.type];
  const Icon = s.icon;

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-[12px] pointer-events-auto"
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
        minWidth: 320,
        maxWidth: 420,
        animation: item.dismissing
          ? "toast-slide-out 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards"
          : "toast-slide-in 0.3s ease-out both",
      }}
    >
      <Icon size={18} weight="fill" className="shrink-0 mt-[1px]" style={{ color: s.iconColor }} />
      <span className="flex-1 text-[13px] font-medium text-[#333] leading-[1.4]">{item.message}</span>
      <button
        onClick={onDismiss}
        className="shrink-0 p-0.5 rounded-md hover:bg-black/5 transition-colors"
      >
        <X size={14} weight="bold" className="text-[#94a3b8]" />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
 *  Toast Container (portal, top-right)
 * ───────────────────────────────────────────── */
export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed z-[200] flex flex-col gap-2 pointer-events-none"
      style={{ top: 16, right: 16 }}
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>,
    document.body,
  );
}
