"use client";

import * as React from "react";
import { ArrowLeft, DotsThreeVertical, GearSix } from "@phosphor-icons/react";
import { cn } from "../../utils/cn";

/* ─────────────────────────────────────────────
 *  SideNav — the standard portal side navigation
 *  (from the HMTX portal Sidebar).
 *
 *  Two-part pattern:
 *   • a 48px collapsed rail that is always visible (md+), showing
 *     icon-only items with tooltips, and
 *   • a 256px expanded panel that slides over it with a backdrop.
 *
 *  Icons follow the Phosphor component contract — pass the component
 *  itself (e.g. `Package`), not an element; the nav renders it `bold`
 *  by default and `fill` when active (tinted with the neutral
 *  900→700 gradient).
 * ───────────────────────────────────────────── */

export interface SideNavIconProps {
  size?: number;
  weight?: "bold" | "fill";
  className?: string;
  color?: string;
}

export interface SideNavItem {
  key: string;
  label: string;
  /** Phosphor-style icon component (rendered bold; fill when active). */
  icon: React.ComponentType<SideNavIconProps>;
  /** Rendered as an <a href> when set; otherwise a <button>. */
  href?: string;
}

export interface SideNavSection {
  /** Uppercase section label (expanded panel only). */
  label?: string;
  items: SideNavItem[];
}

export interface SideNavUser {
  name: string;
  /** Second line under the name (role, email, …). */
  description?: string;
  initials?: string;
  avatarSrc?: string;
  /** Avatar fill behind the initials. */
  color?: string;
}

export interface SideNavProps {
  sections: SideNavSection[];
  /** `key` of the active item. */
  activeKey?: string;
  onNavigate?: (item: SideNavItem) => void;
  /** Controlled expanded state. */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Logo for the expanded panel (full wordmark). */
  logo?: React.ReactNode;
  /** Logo for the collapsed rail (monogram). */
  logoCollapsed?: React.ReactNode;
  user?: SideNavUser;
  onUserClick?: (anchor: "rail" | "panel") => void;
  /** Renders the gear button on the rail when provided. */
  onSettingsClick?: () => void;
  settingsLabel?: string;
  /**
   * Where the expanded panel + backdrop overlay: the viewport (`fixed`,
   * default — app usage) or the nearest positioned ancestor (`absolute` —
   * embedded/demo usage).
   */
  overlayIn?: "viewport" | "container";
  className?: string;
}

function ItemAction({
  item,
  className,
  style,
  onClick,
  children,
  "aria-label": ariaLabel,
}: {
  item: SideNavItem;
  className?: string;
  style?: React.CSSProperties;
  onClick: () => void;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  return item.href ? (
    <a href={item.href} className={className} style={style} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </a>
  ) : (
    <button type="button" className={className} style={style} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

/**
 * The rail's hover tooltip (HMTX portal style): instant (pure CSS group-hover,
 * no delay), inverse surface, with the curved arrow pointing at the item.
 * Hidden while the expanded panel is open.
 */
function RailTooltip({ label }: { label: string }) {
  return (
    <span
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-[15px] -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
      aria-hidden="true"
    >
      {/* z-[1] paints the arrow above the bubble's drop shadow, and the 2px-right
          nudge tucks it under the bubble — otherwise the shadow shows through the
          joint as a thin gap. */}
      <svg
        className="absolute left-[-9px] top-1/2 z-[1] -translate-y-1/2"
        width="13"
        height="26"
        viewBox="0 0 13 26"
        fill="none"
      >
        <path
          d="M12.0179 0V25.8169L8.88842 21.0921C6.75085 17.8649 3.81579 15.2446 0.367753 13.4853C-0.113524 13.2397 -0.124773 12.5561 0.348165 12.2948L0.496595 12.2128C4.13714 10.2017 7.22982 7.32962 9.50446 3.84762L12.0179 0Z"
          fill="var(--surface-inverse)"
        />
      </svg>
      <span
        className="block whitespace-nowrap rounded-lg bg-[var(--surface-inverse)] pb-[7px] pl-4 pr-[18px] pt-2 text-sm font-medium text-white"
        style={{ boxShadow: "var(--shadow-dropdown)" }}
      >
        {label}
      </span>
    </span>
  );
}

function UserAvatar({ user, radius }: { user: SideNavUser; radius: number }) {
  if (user.avatarSrc) {
    return (
      <img
        src={user.avatarSrc}
        alt={user.name}
        className="size-8 shrink-0 object-cover select-none"
        style={{ borderRadius: radius }}
      />
    );
  }
  return (
    <span
      className="flex size-8 shrink-0 items-center justify-center text-[13px] font-semibold text-white select-none"
      style={{ borderRadius: radius, backgroundColor: user.color ?? "var(--primary)" }}
    >
      {user.initials}
    </span>
  );
}

export function SideNav({
  sections,
  activeKey,
  onNavigate,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  logo,
  logoCollapsed,
  user,
  onUserClick,
  onSettingsClick,
  settingsLabel = "Account Settings",
  overlayIn = "viewport",
  className,
}: SideNavProps) {
  const [expandedState, setExpandedState] = React.useState(defaultExpanded);
  const expanded = expandedProp ?? expandedState;
  const setExpanded = (next: boolean) => {
    setExpandedState(next);
    onExpandedChange?.(next);
  };

  // Unique per-instance gradient id — the active icon's neutral 900→700 fill.
  const gradientId = `${React.useId().replace(/:/g, "")}-sidenav-icon`;
  const overlayPosition = overlayIn === "viewport" ? "fixed" : "absolute";

  const navigate = (item: SideNavItem) => {
    onNavigate?.(item);
    if (expanded) setExpanded(false);
  };

  return (
    <>
      {/* Gradient definition for active (fill) icons */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--foreground)" />
            <stop offset="100%" stopColor="var(--text-secondary)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Collapsed rail — always visible (md+) */}
      <aside
        className={cn(
          "relative z-30 hidden h-full w-12 shrink-0 flex-col items-center border-r border-[var(--border-default)] bg-[var(--surface-base)] px-1.5 py-2 md:flex",
          className,
        )}
      >
        <div className="flex h-[52px] w-full items-center justify-center">{logoCollapsed}</div>

        <nav className="flex w-full flex-1 flex-col gap-2 py-3">
          {sections.map((section, si) => (
            <div key={section.label ?? si}>
              {si > 0 && <div className="my-1 h-px bg-[var(--border-default)]" />}
              <div className="flex flex-col items-center gap-2">
                {section.items.map((item) => {
                  const active = item.key === activeKey;
                  const Icon = item.icon;
                  return (
                    <span key={item.key} className="group relative">
                      <ItemAction
                        item={item}
                        aria-label={item.label}
                        onClick={() => navigate(item)}
                        className={cn(
                          "flex size-9 items-center justify-center rounded-lg transition-all",
                          active
                            ? "bg-[var(--sidebar-active-bg)]"
                            : "hover:bg-[var(--sidebar-hover-bg)]",
                        )}
                      >
                        <Icon
                          size={20}
                          weight={active ? "fill" : "bold"}
                          color={active ? `url(#${gradientId})` : undefined}
                          className={
                            active
                              ? undefined
                              : "text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]"
                          }
                        />
                      </ItemAction>
                      {!expanded && <RailTooltip label={item.label} />}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex w-full flex-col items-center gap-2 py-2">
          {onSettingsClick && (
            <span className="group relative">
              <button
                type="button"
                onClick={onSettingsClick}
                aria-label={settingsLabel}
                className="flex size-9 items-center justify-center rounded-lg transition-all hover:bg-[var(--sidebar-hover-bg)]"
              >
                <GearSix
                  size={20}
                  weight="bold"
                  className="text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]"
                />
              </button>
              {!expanded && <RailTooltip label={settingsLabel} />}
            </span>
          )}
          {user && (
            <>
              <div className="mb-2 h-px w-full bg-[var(--border-default)]" />
              <button
                type="button"
                onClick={() => onUserClick?.("rail")}
                aria-label={user.name}
                className="rounded-[16px] transition-all hover:ring-2 hover:ring-[var(--border-default)]"
              >
                <UserAvatar user={user} radius={16} />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Backdrop */}
      <div
        className={cn(overlayPosition, "inset-0 z-40 bg-black/20 transition-opacity duration-250")}
        style={{ opacity: expanded ? 1 : 0, pointerEvents: expanded ? "auto" : "none" }}
        onClick={() => setExpanded(false)}
      />

      {/* Expanded panel — slides over the rail */}
      <div
        className={cn(
          overlayPosition,
          "left-0 top-0 z-50 flex h-full w-64 flex-col gap-3 border-r border-[var(--border-default)] bg-[var(--surface-base)] py-2 transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform",
        )}
        style={{
          boxShadow: "var(--shadow-panel)",
          transform: expanded ? "translateX(0)" : "translateX(-320px)",
        }}
      >
        <div className="flex h-16 w-full shrink-0 flex-col items-start px-2 py-3">{logo}</div>

        {/* Collapse button */}
        <button
          type="button"
          onClick={() => setExpanded(false)}
          aria-label="Collapse navigation"
          className="absolute -right-5 top-3.5 z-50 flex size-[39px] items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-base)] transition-colors hover:bg-[var(--sidebar-hover-bg)]"
          style={{ boxShadow: "var(--shadow-panel-light)" }}
        >
          <ArrowLeft size={18} weight="bold" className="text-[var(--text-primary)]" />
        </button>

        <nav className="flex w-full flex-1 flex-col gap-5 overflow-y-auto px-2 pt-3">
          {sections.map((section, si) => (
            <div key={section.label ?? si} className="flex w-full flex-col gap-3">
              {si > 0 && <div className="-mt-2.5 h-px w-full bg-[var(--border-default)]" />}
              {section.label && (
                <div className="w-full px-3">
                  <span className="text-[10px] font-semibold uppercase leading-[1.5] tracking-[-0.1px] text-[var(--text-secondary)]">
                    {section.label}
                  </span>
                </div>
              )}
              <div className="flex w-full flex-col gap-2">
                {section.items.map((item) => {
                  const active = item.key === activeKey;
                  const Icon = item.icon;
                  return (
                    <ItemAction
                      key={item.key}
                      item={item}
                      onClick={() => navigate(item)}
                      className={cn(
                        "flex h-9 w-full items-center gap-3 rounded-lg px-3 py-2 transition-all",
                        active
                          ? "bg-[var(--sidebar-active-bg)]"
                          : "hover:bg-[var(--sidebar-hover-bg)]",
                      )}
                    >
                      <Icon
                        size={16}
                        weight={active ? "fill" : "bold"}
                        color={active ? `url(#${gradientId})` : undefined}
                        className={active ? undefined : "text-[var(--text-secondary)]"}
                      />
                      <span
                        className={cn(
                          "truncate text-[14px] leading-[1.4]",
                          active
                            ? "font-medium text-[var(--text-primary)]"
                            : "font-normal text-[var(--text-secondary)]",
                        )}
                      >
                        {item.label}
                      </span>
                    </ItemAction>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {user && (
          <div className="mx-auto flex w-60 shrink-0 items-center py-2">
            <button
              type="button"
              onClick={() => onUserClick?.("panel")}
              className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-[var(--sidebar-hover-bg)]"
            >
              <UserAvatar user={user} radius={9} />
              <span className="flex min-w-0 flex-1 items-center justify-between">
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-left text-[14px] font-medium leading-[1.42] tracking-[0.14px] text-[var(--text-primary)]">
                    {user.name}
                  </span>
                  {user.description && (
                    <span className="truncate text-left text-[12px] font-light leading-[1.22] tracking-[0.12px] text-[var(--text-primary)]">
                      {user.description}
                    </span>
                  )}
                </span>
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-base)]">
                  <DotsThreeVertical size={16} weight="bold" className="text-[var(--text-primary)]" />
                </span>
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
