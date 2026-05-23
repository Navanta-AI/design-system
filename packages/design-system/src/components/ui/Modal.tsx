"use client";

import { type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Icon } from "@phosphor-icons/react";

type ModalSize = "default" | "wide";

const MODAL_WIDTHS: Record<ModalSize, number> = {
  default: 520,
  wide: 758,
};

interface ModalProps {
  /** Modal title text */
  title: string;
  /** Subtitle shown below the title in the header */
  subtitle?: string;
  /** Phosphor icon rendered in the header (duotone, 16px) */
  icon?: Icon;
  /** Icon color (default --text-primary) */
  iconColor?: string;
  /** Modal width size (default | wide) */
  size?: ModalSize;
  /** Called when backdrop or close button is clicked */
  onClose: () => void;
  /** Modal body */
  children: ReactNode;
  /** Footer content (buttons, summary text) */
  footer?: ReactNode;
}

export function Modal({
  title,
  subtitle,
  icon: HeaderIcon,
  iconColor = "var(--text-primary)",
  size = "default",
  onClose,
  children,
  footer,
}: ModalProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="bg-[var(--surface-base)] rounded-[16px] overflow-hidden flex flex-col"
        style={{
          width: "100%",
          maxWidth: MODAL_WIDTHS[size],
          maxHeight: "80vh",
          boxShadow: "var(--shadow-modal)",
          animation: "christy-fade-up 0.2s ease-out both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
          <div className="flex items-start gap-2">
            {HeaderIcon && (
              <div className="py-[4px] shrink-0">
                <HeaderIcon
                  size={16}
                  weight="duotone"
                  style={{ color: iconColor }}
                />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[18px] font-semibold text-[var(--text-primary)] leading-[1.44]">
                {title}
              </span>
              {subtitle && (
                <span className="text-[14px] text-[var(--text-secondary)]">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5l-10 10"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-default)] bg-[var(--surface-sunken)]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
