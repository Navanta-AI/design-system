"use client";

import { type ReactNode } from "react";
import { CheckCircle, CircleNotch } from "@phosphor-icons/react";
import { RadioCard } from "../RadioCard";
import { ChristyButton } from "../Button";

/* ─────────────────────────────────────────────
 *  Christy Suggestions — 3 states
 *
 *  1. Selection: RadioCards with options, user picks one
 *  2. Static: recommendation text, no selection needed
 *  3. Confirmed: post-confirm success card
 * ───────────────────────────────────────────── */

export interface SuggestionOption {
  label: string;
  detail: string;
  credit?: string;
  creditColor?: string;
  selected?: boolean;
  reasoning?: string[];
}

interface BaseProps {
  /** Optional Christy reasoning lines shown below the recommendation */
  reasoning?: string[];
  /** Summary text for the recommendation */
  summary?: string;
}

/* ── Selection state ── */
interface SelectionProps extends BaseProps {
  mode: "selection";
  options: SuggestionOption[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
  confirmLabel?: string;
  onConfirm: () => void;
  /** Recommended option index (highlighted) */
  recommendedIdx?: number;
  /** Confirm phase */
  phase?: "idle" | "confirming" | "confirmed";
}

/* ── Static state (no selection) ── */
interface StaticProps extends BaseProps {
  mode: "static";
  /** Static recommendation content */
  children?: ReactNode;
}

/* ── Confirmed state ── */
interface ConfirmedProps extends BaseProps {
  mode: "confirmed";
  /** What was confirmed */
  confirmedLabel: string;
  /** Additional detail */
  detail?: string;
}

type ChristySuggestionsProps = SelectionProps | StaticProps | ConfirmedProps;

export function ChristySuggestions(props: ChristySuggestionsProps) {
  return (
    <div
      className="bg-[var(--surface-base)] rounded-[12px] overflow-hidden flex flex-col"
      style={{ border: "1px solid var(--border-default)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#f0f2f5]">
        <img src="/AI-star-small.svg" alt="" className="w-[18px] h-[19px] shrink-0" />
        <span className="text-[14px] font-medium text-[#3b0764] leading-[1.5]">Christy Suggestions</span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-3">
        {props.mode === "selection" && <SelectionBody {...props} />}
        {props.mode === "static" && <StaticBody {...props} />}
        {props.mode === "confirmed" && <ConfirmedBody {...props} />}
      </div>
    </div>
  );
}

/* ── Selection Body ── */
function SelectionBody({ options, selectedIdx, onSelect, confirmLabel = "Confirm Selection", onConfirm, recommendedIdx, phase = "idle", reasoning, summary }: SelectionProps) {
  const isConfirming = phase === "confirming";
  const isConfirmed = phase === "confirmed";

  if (isConfirmed) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <CheckCircle size={28} weight="fill" className="text-[#10b981]" />
        <span className="text-[14px] font-semibold text-[var(--text-primary)]">Selection confirmed</span>
        {selectedIdx >= 0 && options[selectedIdx] && (
          <span className="text-[13px] text-[var(--text-secondary)]">{options[selectedIdx].label}</span>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Recommendation summary */}
      {summary && (
        <p className="text-[13px] text-[var(--text-secondary)] leading-[1.4]">{summary}</p>
      )}

      {/* Option cards */}
      {options.map((opt, idx) => (
        <RadioCard
          key={idx}
          variant="christy"
          selected={selectedIdx === idx}
          label={opt.label}
          detail={opt.detail}
          onClick={() => onSelect(idx)}
          className="w-full"
          badge={opt.credit ? (
            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded" style={{ color: opt.creditColor ?? "#333", background: `${opt.creditColor ?? "#333"}15` }}>
              {opt.credit}
            </span>
          ) : undefined}
        />
      ))}

      {/* Reasoning */}
      {reasoning && reasoning.length > 0 && selectedIdx >= 0 && (
        <div className="flex flex-col gap-2 rounded-[12px] px-3 py-2.5" style={{ backgroundColor: "var(--surface-info)" }}>
          {reasoning.map((r, i) => (
            <div key={i} className="flex items-start gap-1">
              <div className="flex items-center py-0.5 shrink-0">
                <CheckCircle size={14} weight="duotone" className="text-[var(--brand-purple-deep)]" />
              </div>
              <span className="text-[13px] font-normal text-[var(--text-primary)] leading-normal">{r}</span>
            </div>
          ))}
        </div>
      )}

      {/* Confirm button */}
      <ChristyButton
        onClick={onConfirm}
        disabled={selectedIdx < 0 || isConfirming}
        fullWidth
      >
        {isConfirming ? (
          <span className="flex items-center gap-2">
            <CircleNotch size={14} weight="bold" className="animate-spin" />
            Processing...
          </span>
        ) : (
          confirmLabel
        )}
      </ChristyButton>
    </>
  );
}

/* ── Static Body ── */
function StaticBody({ children, reasoning, summary }: StaticProps) {
  return (
    <>
      {summary && (
        <p className="text-[13px] text-[var(--text-secondary)] leading-[1.4]">{summary}</p>
      )}
      {children}
      {reasoning && reasoning.length > 0 && (
        <div className="flex flex-col gap-2 rounded-[12px] px-3 py-2.5" style={{ backgroundColor: "var(--surface-info)" }}>
          {reasoning.map((r, i) => (
            <div key={i} className="flex items-start gap-1">
              <div className="flex items-center py-0.5 shrink-0">
                <CheckCircle size={14} weight="duotone" className="text-[var(--brand-purple-deep)]" />
              </div>
              <span className="text-[13px] font-normal text-[var(--text-primary)] leading-normal">{r}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ── Confirmed Body ── */
function ConfirmedBody({ confirmedLabel, detail, reasoning }: ConfirmedProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <CheckCircle size={28} weight="fill" className="text-[#10b981]" />
      <span className="text-[14px] font-semibold text-[var(--text-primary)]">{confirmedLabel}</span>
      {detail && <span className="text-[13px] text-[var(--text-secondary)] text-center">{detail}</span>}
      {reasoning && reasoning.length > 0 && (
        <div className="flex flex-col gap-1 mt-1 w-full px-1">
          {reasoning.map((r, i) => (
            <span key={i} className="text-[12px] text-[var(--text-secondary)] leading-[1.4]">• {r}</span>
          ))}
        </div>
      )}
    </div>
  );
}
