"use client";

import { useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, ArrowSquareOut } from "@phosphor-icons/react";
import { Tooltip } from "../../Tooltip";

interface DetailPanelShellProps {
  open: boolean;
  onClose: () => void;
  /** Panel title (e.g., "ORD-1847") */
  title: string;
  /** Subtitle line (e.g., "Delivery Tracking · $4,980.00") */
  subtitle?: string;
  /** External link href — shows ArrowSquareOut icon in header */
  externalHref?: string;
  /** Width in px (default 400) */
  width?: number;
  /** Action buttons rendered below header */
  actions?: ReactNode;
  /** Compact status row below actions (e.g., stepper dots) */
  statusRow?: ReactNode;
  /** Main scrollable content */
  children: ReactNode;
  /** Sticky footer (e.g., confirm button) */
  footer?: ReactNode;
}

export function DetailPanelShell({
  open,
  onClose,
  title,
  subtitle,
  externalHref,
  width = 400,
  actions,
  statusRow,
  children,
  footer,
}: DetailPanelShellProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90]"
        onClick={onClose}
        style={{
          background: "rgba(0,0,0,0.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 250ms ease",
        }}
      />

      {/* Panel */}
      <div
        className="fixed z-[95] flex flex-col bg-[var(--surface-base)] overflow-hidden border-l border-[var(--brand-primary)]"
        style={{
          width,
          top: 16,
          right: 24,
          bottom: 16,
          borderRadius: 16,
          boxShadow: "var(--shadow-sm)",
          transform: open ? "translateX(0)" : "translateX(calc(100% + 24px))",
          transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between shrink-0 px-4 py-3">
          <div className="flex flex-col gap-1">
            <span className="text-[16px] font-semibold text-[var(--text-primary)] leading-[1.5]">{title}</span>
            {subtitle && <span className="text-[14px] text-[var(--text-secondary)]">{subtitle}</span>}
          </div>
          <div className="flex items-center gap-1">
            {externalHref && (
              <Tooltip content="Open full details" side="bottom">
                <a
                  href={externalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <ArrowSquareOut size={14} weight="bold" className="text-[var(--text-secondary)]" />
                </a>
              </Tooltip>
            )}
            <button onClick={onClose} className="p-1 rounded-xl hover:bg-[var(--surface-hover)] transition-colors">
              <X size={14} weight="bold" className="text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>

        {/* Actions + Status row */}
        {(actions || statusRow) && (
          <div className="shrink-0 px-4 pb-2 flex flex-col gap-2">
            {actions}
            {statusRow}
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 pb-2 px-2">
          <div className="border border-[var(--border-default)] rounded-2xl h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto hide-scrollbar px-3 py-4">
              <div className="flex flex-col gap-6">
                {children}
              </div>
            </div>
            {/* Footer */}
            {footer && (
              <div className="shrink-0 px-4 py-3 border-t border-[var(--border-default)]">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
