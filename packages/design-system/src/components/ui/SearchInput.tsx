"use client";

import { useState, useRef, useEffect } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";

/* ─────────────────────────────────────────────
 *  Search Input
 *  Expandable search with icon, keyboard shortcut (/), and clear button
 * ───────────────────────────────────────────── */

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Width in px when blurred (default 320) */
  width?: number;
  /** Width in px when focused (default 400) */
  focusWidth?: number;
  /** Show "/" keyboard hint (default true) */
  showKeyHint?: boolean;
  /** Enable "/" keyboard shortcut to focus (default true) */
  enableShortcut?: boolean;
  /** Called when user presses Enter */
  onSubmit?: () => void;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  width = 320,
  focusWidth = 400,
  showKeyHint = true,
  enableShortcut = true,
  onSubmit,
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!enableShortcut) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        ref.current?.focus();
      }
      if (e.key === "Escape" && focused) {
        ref.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [focused, enableShortcut]);

  return (
    <div
      className="relative transition-all duration-200 ease-out"
      style={{ width: focused ? focusWidth : width }}
    >
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && onSubmit) { e.preventDefault(); onSubmit(); } }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] rounded-lg outline-none transition-all duration-200"
        style={{
          height: 32,
          paddingLeft: 13,
          paddingRight: value ? 60 : 42,
          background: "var(--surface-base)",
          border: focused ? "1px solid var(--brand-primary)" : "1px solid var(--border-strong)",
          boxShadow: focused ? "var(--shadow-focus)" : "none",
        }}
      />

      {/* Clear button */}
      {value && (
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onChange("");
            ref.current?.focus();
          }}
          className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded transition-colors hover:bg-gray-100"
          style={{ right: 30, width: 18, height: 18 }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M9 3L3 9M3 3L9 9"
              stroke="var(--text-secondary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Search icon */}
      <MagnifyingGlass
        size={16}
        weight="bold"
        className="absolute top-1/2 -translate-y-1/2 text-[var(--text-accent)]"
        style={{ right: 13 }}
      />

      {/* Keyboard hint */}
      {showKeyHint && !value && !focused && (
        <kbd
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none select-none flex items-center justify-center transition-opacity duration-200"
          style={{
            right: 35,
            height: 20,
            width: 19,
            fontSize: 12,
            fontFamily: "inherit",
            color: "var(--text-secondary)",
            background: "var(--surface-sunken)",
            border: "1px solid var(--border-strong)",
            borderRadius: 4,
          }}
        >
          /
        </kbd>
      )}
    </div>
  );
}
