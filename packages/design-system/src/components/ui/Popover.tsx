"use client";

import * as React from "react";
import { cn } from "../../utils/cn";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export interface PopoverTriggerProps {
  open: boolean;
  toggle: () => void;
  close: () => void;
  /** Spread onto your trigger <button>. */
  triggerProps: {
    ref: React.Ref<HTMLButtonElement>;
    "aria-haspopup": "dialog";
    "aria-expanded": boolean;
    onClick: () => void;
  };
}

export interface PopoverProps {
  /** Render the trigger button. Spread `triggerProps` onto your <button>. */
  trigger: (props: PopoverTriggerProps) => React.ReactNode;
  /** Panel content. Receives `close` so items can dismiss the popover. */
  children: React.ReactNode | ((props: { close: () => void }) => React.ReactNode);
  /** Horizontal alignment of the panel relative to the trigger. */
  align?: "start" | "end";
  /** Accessible label for the dialog panel. */
  label?: string;
  className?: string;
  panelClassName?: string;
}

/**
 * Minimal, dependency-free popover primitive: focuses the panel on open, traps
 * Tab within it, closes on Escape (returning focus to the trigger) and on
 * outside click. Non-modal (role="dialog"); the trigger owns aria-expanded.
 */
export function Popover({
  trigger,
  children,
  align = "end",
  label,
  className,
  panelClassName,
}: PopoverProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => setOpen(false), []);
  const toggle = React.useCallback(() => setOpen((o) => !o), []);

  // Focus the first focusable element when the panel opens.
  React.useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel).focus();
  }, [open]);

  // Close on outside click (mousedown so it beats focus moves).
  React.useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      // Spare clicks landing in portaled menus/listboxes (e.g. a nested Select's
      // body-portaled options) so choosing a value doesn't dismiss the popover.
      if (target instanceof Element && target.closest('[role="listbox"],[role="menu"],[role="dialog"]')) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Escape closes + returns focus to the trigger; Tab is trapped inside the panel.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      // Defer to an open nested control (e.g. a Select listbox): its trigger keeps
      // focus as an expanded combobox, so let the first Escape close that instead.
      const ae = document.activeElement;
      if (ae?.getAttribute("role") === "combobox" && ae.getAttribute("aria-expanded") === "true") return;
      e.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (e.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;
    const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
    if (items.length === 0) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {trigger({
        open,
        toggle,
        close,
        triggerProps: {
          ref: triggerRef,
          "aria-haspopup": "dialog",
          "aria-expanded": open,
          onClick: toggle,
        },
      })}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={label}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className={cn(
            "absolute z-50 mt-2 min-w-[240px] rounded-[10px] border border-[var(--border-default)] bg-[var(--surface-base)] p-2 shadow-[var(--shadow-menu)] focus:outline-none",
            align === "end" ? "right-0" : "left-0",
            panelClassName,
          )}
        >
          {typeof children === "function" ? children({ close }) : children}
        </div>
      )}
    </div>
  );
}
