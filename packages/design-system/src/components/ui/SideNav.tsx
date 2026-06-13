"use client";

import * as React from "react";
import { ArrowLeft, DotsThreeVertical, GearSix } from "@phosphor-icons/react";
import { cn } from "../../utils/cn";
import { Tooltip } from "../Tooltip";

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
 *  outline by default and `fill` when active (tinted with the neutral
 *  900→700 gradient).
 * ───────────────────────────────────────────── */

export interface SideNavIconProps {
  size?: number;
  weight?: "regular" | "bold" | "fill";
  className?: string;
  color?: string;
}

export interface SideNavItem {
  key: string;
  label: string;
  /** Phosphor-style icon component (rendered bold outline; fill when active). */
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
      style={{ borderRadius: radius, backgroundColor: user.color ?? "var(--primary,#232122)" }}
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
            <stop offset="0%" stopColor="var(--foreground,#09090b)" />
            <stop offset="100%" stopColor="var(--text-secondary,#4b5563)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Collapsed rail — always visible (md+) */}
      <aside
        className={cn(
          "relative z-30 hidden h-full w-12 shrink-0 flex-col items-center border-r border-[var(--border-default,#e4e4e7)] bg-[var(--surface-base,#ffffff)] px-1.5 py-2 md:flex",
          className,
        )}
      >
        <div className="flex h-[52px] w-full items-center justify-center">{logoCollapsed}</div>

        <nav className="flex w-full flex-1 flex-col gap-2 py-3">
          {sections.map((section, si) => (
            <div key={section.label ?? si}>
              {si > 0 && <div className="my-1 h-px bg-[var(--border-default,#e4e4e7)]" />}
              <div className="flex flex-col items-center gap-2">
                {section.items.map((item) => {
                  const active = item.key === activeKey;
                  const Icon = item.icon;
                  const itemButton = (
                    <ItemAction
                      item={item}
                      aria-label={item.label}
                      onClick={() => navigate(item)}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg transition-all",
                        active
                          ? "bg-[var(--sidebar-active-bg,#f4f4f5)]"
                          : "hover:bg-[var(--sidebar-hover-bg,#f5f5f5)]",
                      )}
                    >
                      <Icon
                        size={20}
                        weight={active ? "fill" : "bold"}
                        color={active ? `url(#${gradientId})` : undefined}
                        className={
                          active
                            ? undefined
                            : "text-[var(--text-secondary,#4b5563)] transition-colors group-hover:text-[var(--text-primary,#09090b)]"
                        }
                      />
                    </ItemAction>
                  );
                  // Collapsed rail: instant inverse tooltip (JS-mounted — robust to a
                  // consumer's own CSS, unlike a CSS opacity/group-hover reveal). The
                  // `group` marker keeps the icon's hover-darken working.
                  return expanded ? (
                    <span key={item.key} className="group relative inline-flex">
                      {itemButton}
                    </span>
                  ) : (
                    <Tooltip
                      key={item.key}
                      className="group"
                      variant="inverse"
                      side="right"
                      delay={0}
                      content={item.label}
                    >
                      {itemButton}
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex w-full flex-col items-center gap-2 py-2">
          {onSettingsClick && (() => {
            const gearButton = (
              <button
                type="button"
                onClick={onSettingsClick}
                aria-label={settingsLabel}
                className="flex size-9 items-center justify-center rounded-lg transition-all hover:bg-[var(--sidebar-hover-bg,#f5f5f5)]"
              >
                <GearSix
                  size={20}
                  weight="bold"
                  className="text-[var(--text-secondary,#4b5563)] transition-colors group-hover:text-[var(--text-primary,#09090b)]"
                />
              </button>
            );
            return expanded ? (
              <span className="group relative inline-flex">{gearButton}</span>
            ) : (
              <Tooltip className="group" variant="inverse" side="right" delay={0} content={settingsLabel}>
                {gearButton}
              </Tooltip>
            );
          })()}
          {user && (
            <>
              <div className="mb-2 h-px w-full bg-[var(--border-default,#e4e4e7)]" />
              <button
                type="button"
                onClick={() => onUserClick?.("rail")}
                aria-label={user.name}
                className="rounded-[16px] transition-all hover:ring-2 hover:ring-[var(--border-default,#e4e4e7)]"
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
          "left-0 top-0 z-50 flex h-full w-64 flex-col gap-3 border-r border-[var(--border-default,#e4e4e7)] bg-[var(--surface-base,#ffffff)] py-2 transition-transform duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform",
        )}
        style={{
          boxShadow: "var(--shadow-panel, 2px 0px 4px 0px rgba(0,0,0,0.12))",
          transform: expanded ? "translateX(0)" : "translateX(-320px)",
        }}
      >
        <div className="flex h-16 w-full shrink-0 flex-col items-start px-2 py-3">{logo}</div>

        {/* Collapse button */}
        <button
          type="button"
          onClick={() => setExpanded(false)}
          aria-label="Collapse navigation"
          className="absolute -right-5 top-3.5 z-50 flex size-[39px] items-center justify-center rounded-full border border-[var(--border-strong,#71717b)] bg-[var(--surface-base,#ffffff)] transition-colors hover:bg-[var(--sidebar-hover-bg,#f5f5f5)]"
          style={{ boxShadow: "var(--shadow-panel-light, 4px 0px 4px 0px rgba(0,0,0,0.08))" }}
        >
          <ArrowLeft size={18} weight="bold" className="text-[var(--text-primary,#09090b)]" />
        </button>

        <nav className="flex w-full flex-1 flex-col gap-5 overflow-y-auto px-2 pt-3">
          {sections.map((section, si) => (
            <div key={section.label ?? si} className="flex w-full flex-col gap-3">
              {si > 0 && <div className="-mt-2.5 h-px w-full bg-[var(--border-default,#e4e4e7)]" />}
              {section.label && (
                <div className="w-full px-3">
                  <span className="text-[10px] font-semibold uppercase leading-[1.5] tracking-[-0.1px] text-[var(--text-secondary,#4b5563)]">
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
                          ? "bg-[var(--sidebar-active-bg,#f4f4f5)]"
                          : "hover:bg-[var(--sidebar-hover-bg,#f5f5f5)]",
                      )}
                    >
                      <Icon
                        size={16}
                        weight={active ? "fill" : "bold"}
                        color={active ? `url(#${gradientId})` : undefined}
                        className={active ? undefined : "text-[var(--text-secondary,#4b5563)]"}
                      />
                      <span
                        className={cn(
                          "truncate text-[14px] leading-[1.4]",
                          active
                            ? "font-medium text-[var(--text-primary,#09090b)]"
                            : "font-normal text-[var(--text-secondary,#4b5563)]",
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
              className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-[var(--sidebar-hover-bg,#f5f5f5)]"
            >
              <UserAvatar user={user} radius={9} />
              <span className="flex min-w-0 flex-1 items-center justify-between">
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-left text-[14px] font-medium leading-[1.42] tracking-[0.14px] text-[var(--text-primary,#09090b)]">
                    {user.name}
                  </span>
                  {user.description && (
                    <span className="truncate text-left text-[12px] font-light leading-[1.22] tracking-[0.12px] text-[var(--text-primary,#09090b)]">
                      {user.description}
                    </span>
                  )}
                </span>
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong,#71717b)] bg-[var(--surface-base,#ffffff)]">
                  <DotsThreeVertical size={16} weight="bold" className="text-[var(--text-primary,#09090b)]" />
                </span>
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
