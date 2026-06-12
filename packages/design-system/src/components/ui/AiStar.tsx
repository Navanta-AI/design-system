"use client";

import { useId } from "react";

/* ─────────────────────────────────────────────
 *  AiStar — the standard Navanta / Christy AI mark
 *
 *  Inline (self-contained) version of AI-star-small.svg.
 *  Use this anywhere AI-generated content appears — Christy
 *  suggestions, AI summaries, AI-derived table columns, etc.
 *  so the purple sparkle reads as a consistent "this is AI"
 *  signal across the product.
 *
 *  Unlike `<img src="/AI-star-small.svg">`, this does NOT
 *  depend on the consumer copying an SVG into /public, and
 *  its gradient ids are unique per-instance (via useId) so
 *  multiple stars on one page never collide.
 *
 *  Examples:
 *    <AiStar />                      // 18px, inline default
 *    <AiStar size={40} />            // page heading scale
 *    <AiStar className="shrink-0" /> // inside a flex row / table head
 * ───────────────────────────────────────────── */

export interface AiStarProps extends React.SVGProps<SVGSVGElement> {
  /** Rendered size in px (width & height). Default 18. */
  size?: number;
  /** Accessible label. Defaults to decorative (aria-hidden). */
  title?: string;
  /**
   * `small` (default) — the two-spark inline mark (AI-star-small.svg), for table
   * columns, Christy suggestions and other inline AI signals.
   * `large` — the single four-point spark (Figma AI-star-large.svg, node 1726-5082)
   * with the `--ai-star-from`/`--ai-star-to` gradient; the PageHeading default.
   */
  variant?: "small" | "large";
}

export function AiStar({ size = 18, title, variant = "small", className, ...props }: AiStarProps) {
  const uid = useId();
  const gBig = `${uid}-big`;
  const gSmall = `${uid}-small`;
  const decorative = !title;

  if (variant === "large") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role={decorative ? undefined : "img"}
        aria-hidden={decorative ? true : undefined}
        aria-label={title}
        {...props}
      >
        {title && <title>{title}</title>}
        <path
          d="M14.5067 6.4951C14.5986 5.93678 15.4014 5.93678 15.4934 6.49509L15.6516 7.45539C16.2343 10.993 19.007 13.7658 22.5447 14.3485L23.5049 14.5067C24.0633 14.5986 24.0633 15.4014 23.505 15.4934L22.5447 15.6516C19.007 16.2342 16.2343 19.007 15.6516 22.5447L15.4934 23.505C15.4014 24.0633 14.5986 24.0633 14.5067 23.5049L14.3485 22.5447C13.7658 19.007 10.9931 16.2342 7.45538 15.6516L6.49509 15.4934C5.93677 15.4014 5.93678 14.5986 6.4951 14.5067L7.45538 14.3485C10.9931 13.7658 13.7658 10.993 14.3485 7.45539L14.5067 6.4951Z"
          fill={`url(#${gBig})`}
        />
        <defs>
          <linearGradient
            id={gBig}
            x1="22.4023"
            y1="19.8654"
            x2="6.94287"
            y2="9.40215"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--ai-star-from, #8A49BE)" />
            <stop offset="1" stopColor="var(--ai-star-to, #396EB6)" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={title}
      {...props}
    >
      {title && <title>{title}</title>}
      <path
        d="M11.7692 3.40381L12.3096 6.68451C12.7929 9.61877 15.0927 11.9186 18.0269 12.4019L21.3076 12.9423L18.0269 13.4827C15.0927 13.966 12.7929 16.2658 12.3096 19.2L11.7692 22.4807L11.2288 19.2C10.7455 16.2658 8.44568 13.966 5.51141 13.4827L2.23071 12.9423L5.51141 12.4019C8.44568 11.9186 10.7455 9.61877 11.2288 6.68451L11.7692 3.40381Z"
        fill={`url(#${gBig})`}
      />
      <path
        d="M18.5386 1.51904L18.7652 2.89482C18.9679 4.12532 19.9323 5.08975 21.1628 5.29243L22.5386 5.51904L21.1628 5.74565C19.9323 5.94834 18.9679 6.91277 18.7652 8.14326L18.5386 9.51904L18.312 8.14326C18.1093 6.91277 17.1448 5.94834 15.9144 5.74565L14.5386 5.51904L15.9144 5.29243C17.1448 5.08975 18.1093 4.12532 18.312 2.89482L18.5386 1.51904Z"
        fill={`url(#${gSmall})`}
      />
      <defs>
        <linearGradient
          id={gBig}
          x1="18.9444"
          y1="20.2851"
          x2="1.98801"
          y2="3.99894"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#581C87" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id={gSmall}
          x1="21.5475"
          y1="8.59828"
          x2="14.4368"
          y2="1.76862"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#581C87" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
}
