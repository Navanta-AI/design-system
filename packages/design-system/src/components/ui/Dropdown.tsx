"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback, type ReactNode } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

/* ─────────────────────────────────────────────
 *  Dropdown — 3 modes
 *
 *  "filter"  — Label stays fixed, blue border when active, can deselect.
 *  "select"  — Label replaced by selected item, standard border.
 *  "multi"   — Checkmarks, stays open, toggle on/off.
 * ───────────────────────────────────────────── */

export interface DropdownItem {
  label: string;
  value: string;
  /** Phosphor icon component */
  icon?: Icon;
  /** Pre-rendered icon/node (takes priority over `icon`) */
  iconNode?: ReactNode;
}

/* ── Shared props ── */
interface DropdownBaseProps {
  /** Button label (always shown in filter/multi; shown as placeholder in select) */
  label: string;
  /** Menu items */
  items: DropdownItem[];
  /** Optional icon shown in the trigger button */
  triggerIcon?: Icon;
  /** Align dropdown to "left" or "right" (default right) */
  align?: "left" | "right";
  /** Optional footer — receives a `close` function */
  footer?: ReactNode | ((close: () => void) => ReactNode);
  /** Controlled open state change callback */
  onOpenChange?: (open: boolean) => void;
  /** Minimum width of the dropdown menu (default 180) */
  menuMinWidth?: number;
  /** Height of each menu item (default 40) */
  itemHeight?: number;
  /** Full width trigger (default false) */
  fullWidth?: boolean;
}

/* ── Filter mode (default) ── */
interface FilterDropdownProps extends DropdownBaseProps {
  mode?: "filter";
  value: string;
  onChange: (value: string) => void;
  /** Show active highlight border when a value is selected (default true) */
  activeHighlight?: boolean;
}

/* ── Select mode ── */
interface SelectDropdownProps extends DropdownBaseProps {
  mode: "select";
  value: string;
  onChange: (value: string) => void;
}

/* ── Multi mode ── */
interface MultiDropdownProps extends DropdownBaseProps {
  mode: "multi";
  value: string[];
  onChange: (value: string[]) => void;
}

type DropdownProps = FilterDropdownProps | SelectDropdownProps | MultiDropdownProps;

export function Dropdown(props: DropdownProps) {
  const {
    label,
    items,
    triggerIcon: TriggerIcon,
    align = "right",
    footer,
    onOpenChange,
    menuMinWidth = 180,
    itemHeight = 40,
    fullWidth = false,
  } = props;

  const mode = props.mode ?? "filter";

  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [alignSide, setAlignSide] = useState(align);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ── Smart positioning ── */
  const reposition = useCallback(() => {
    const trigger = ref.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;

    const tr = trigger.getBoundingClientRect();
    const mr = menu.getBoundingClientRect();
    const gap = 4;

    const spaceBelow = window.innerHeight - tr.bottom - gap;
    const spaceAbove = tr.top - gap;
    setOpenUp(mr.height > spaceBelow && spaceAbove > spaceBelow);

    if (align === "right" && tr.right - mr.width < 0) {
      setAlignSide("left");
    } else if (align === "left" && tr.left + mr.width > window.innerWidth) {
      setAlignSide("right");
    } else {
      setAlignSide(align);
    }
  }, [align]);

  useLayoutEffect(() => {
    if (!open) return;
    reposition();
    const scrollParents: EventTarget[] = [window];
    let el: HTMLElement | null = ref.current;
    while (el) {
      if (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) {
        scrollParents.push(el);
      }
      el = el.parentElement;
    }
    scrollParents.forEach((sp) => sp.addEventListener("scroll", reposition, { passive: true }));
    window.addEventListener("resize", reposition);
    return () => {
      scrollParents.forEach((sp) => sp.removeEventListener("scroll", reposition));
      window.removeEventListener("resize", reposition);
    };
  }, [open, reposition]);

  const updateOpen = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        updateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const close = () => updateOpen(false);

  /* ── Derived state per mode ── */
  const isItemSelected = (itemValue: string) => {
    if (mode === "multi") return (props as MultiDropdownProps).value.includes(itemValue);
    return (props as FilterDropdownProps | SelectDropdownProps).value === itemValue;
  };

  const handleItemClick = (itemValue: string) => {
    if (mode === "filter") {
      const p = props as FilterDropdownProps;
      p.onChange(p.value === itemValue ? "" : itemValue);
      close();
    } else if (mode === "select") {
      const p = props as SelectDropdownProps;
      p.onChange(itemValue);
      close();
    } else {
      const p = props as MultiDropdownProps;
      const next = p.value.includes(itemValue)
        ? p.value.filter((v) => v !== itemValue)
        : [...p.value, itemValue];
      p.onChange(next);
      // stays open
    }
  };

  /* ── Trigger label ── */
  const triggerLabel = () => {
    if (mode === "select") {
      const selected = items.find((i) => i.value === (props as SelectDropdownProps).value);
      return selected ? selected.label : label;
    }
    if (mode === "multi") {
      const count = (props as MultiDropdownProps).value.length;
      return count > 0 ? `${label} (${count})` : label;
    }
    return label;
  };

  /* ── Trigger style ── */
  const hasActiveHighlight = () => {
    if (mode === "filter") {
      const p = props as FilterDropdownProps;
      return (p.activeHighlight ?? true) && p.value !== "";
    }
    if (mode === "multi") {
      return (props as MultiDropdownProps).value.length > 0;
    }
    return false;
  };

  const highlighted = hasActiveHighlight();

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => updateOpen(!open)}
        className={`flex items-center justify-between gap-1.5 px-3 h-[32px] rounded-lg text-sm transition-colors outline-none ${
          fullWidth ? "w-full" : ""
        } ${
          highlighted
            ? "bg-[var(--surface-accent)] border border-[var(--brand-primary)]"
            : "bg-[var(--surface-base)] border border-[var(--border-strong)] hover:bg-[var(--surface-accent)]"
        }`}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          {TriggerIcon && (
            <TriggerIcon size={14} weight={highlighted ? "fill" : "bold"} className="text-[var(--text-primary)] shrink-0" />
          )}
          <span className="truncate">{triggerLabel()}</span>
        </span>
        <CaretDown
          size={12}
          weight="bold"
          className={`text-[var(--text-primary)] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Menu */}
      {open && (
        <div
          ref={menuRef}
          className={`absolute z-50 bg-[var(--surface-base)] border border-[var(--border-strong)] rounded-xl flex flex-col ${
            (mode === "select" ? "left-0" : alignSide === "right" ? "right-0" : "left-0")
          } ${openUp ? "bottom-full" : "top-full"}`}
          style={{
            padding: 8,
            ...(openUp ? { marginBottom: 4 } : { marginTop: 4 }),
            boxShadow: "var(--shadow-menu)",
            minWidth: fullWidth || mode === "select" ? "100%" : menuMinWidth,
          }}
        >
          {items.map((item) => {
            const ItemIcon = item.icon;
            const selected = isItemSelected(item.value);
            return (
              <button
                key={item.value}
                onClick={() => handleItemClick(item.value)}
                className={`flex items-center ${mode === "multi" ? "justify-between" : ""} gap-2 px-2 py-2 rounded-lg text-[14px] font-normal tracking-[0.14px] text-[var(--text-primary)] hover:bg-gray-50 w-full text-left ${
                  selected ? "bg-gray-100" : ""
                }`}
                style={{ height: itemHeight }}
              >
                <span className="flex items-center gap-2">
                  {item.iconNode ?? (ItemIcon && <ItemIcon size={14} className="text-[var(--text-primary)]" />)}
                  {item.label}
                </span>
                {mode === "multi" && selected && (
                  <Check size={14} weight="bold" className="text-[var(--text-accent)]" />
                )}
              </button>
            );
          })}
          {footer && (
            <>
              <div className="border-t border-[var(--surface-sunken)] my-1" />
              {typeof footer === "function" ? footer(close) : footer}
            </>
          )}
        </div>
      )}
    </div>
  );
}
