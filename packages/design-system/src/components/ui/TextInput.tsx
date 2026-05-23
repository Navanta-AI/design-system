"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { XIcon } from "@phosphor-icons/react";

/* ─────────────────────────────────────────────
 *  Text Input
 *  Standard single-line text input
 *  Supports both controlled (value + onChange) and
 *  uncontrolled (no value/onChange) usage.
 * ───────────────────────────────────────────── */

interface TextInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Optional label above the input */
  label?: string;
  /** Optional helper text below the input */
  helperText?: string;
  /** Error state — shows red border + error message */
  error?: string;
  type?: "text" | "email" | "password" | "number";
  className?: string;
}

export function TextInput({
  value: controlledValue,
  onChange: controlledOnChange,
  placeholder,
  disabled,
  label,
  helperText,
  error,
  type = "text",
  className = "",
}: TextInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = (next: string) => {
    if (!isControlled) setInternalValue(next);
    controlledOnChange?.(next);
  };

  const borderColor = error ? "var(--text-danger-vivid)" : "var(--border-strong)";
  const focusBorderColor = error ? "var(--text-danger-vivid)" : "#000000";
  const focusShadow = error
    ? "0 0 0 3px rgba(239,68,68,0.1)"
    : "var(--shadow-focus)";

  const inputRef = useRef<HTMLInputElement>(null);
  const showClear = currentValue.length > 0 && !disabled;

  return (
    <div className={`flex flex-col gap-[2px] ${className}`}>
      {label && (
        <label className="text-[12px] text-[var(--text-secondary)] px-[2px]">{label}</label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          value={currentValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] rounded-[8px] outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            height: 32,
            padding: showClear ? "0 30px 0 12px" : "0 12px",
            background: disabled ? "var(--surface-raised)" : "var(--surface-base)",
            border: `1px solid ${borderColor}`,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = focusBorderColor;
            e.currentTarget.style.boxShadow = focusShadow;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = borderColor;
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {showClear && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleChange("");
              inputRef.current?.focus();
            }}
            className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center rounded transition-colors hover:bg-[var(--surface-hover)]"
            style={{ right: 8, width: 18, height: 18 }}
          >
            <XIcon size={12} weight="bold" className="text-[var(--text-secondary)]" />
          </button>
        )}
      </div>
      {error && <span className="text-[12px] text-[var(--text-danger-vivid)]">{error}</span>}
      {helperText && !error && (
        <span className="text-[12px] text-[var(--text-secondary)]">{helperText}</span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
 *  Textarea
 *  Multi-line text input with auto-resize
 * ───────────────────────────────────────────── */

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  rows?: number;
  className?: string;
}

export function Textarea({
  value,
  onChange,
  placeholder,
  disabled,
  label,
  helperText,
  error,
  rows = 3,
  className = "",
}: TextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value]);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-[12px] font-medium text-[var(--text-secondary)]">{label}</label>
      )}
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="w-full text-[14px] leading-[1.5] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] bg-[var(--surface-base)] border border-[var(--border-strong)] rounded-[8px] px-3 py-2.5 resize-none outline-none focus:border-[var(--brand-primary)] focus:shadow-[var(--shadow-focus)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {error && <span className="text-[12px] text-[var(--text-danger-vivid)]">{error}</span>}
      {helperText && !error && (
        <span className="text-[12px] text-[var(--text-secondary)]">{helperText}</span>
      )}
    </div>
  );
}
