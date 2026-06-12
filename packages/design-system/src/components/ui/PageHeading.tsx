"use client";

import { AiStar } from "./AiStar";

interface PageHeadingProps {
  title: string;
  subtitle: string;
}

export function PageHeading({ title, subtitle }: PageHeadingProps) {
  return (
    // Figma: HMTX-Portal page heading (node 1726-5081) — 30px large star, 8px gap,
    // 22px/1.33 semibold title (-0.44px tracking), 14px/1.5 subtitle.
    <div className="flex items-start gap-2 ml-[2px] shrink-0">
      <AiStar variant="large" size={30} className="shrink-0" />
      <div className="flex flex-col gap-[var(--text-stack-gap)]">
        <h2 className="text-[22px] font-semibold text-[var(--text-primary)] tracking-[-0.44px] leading-[1.33]">
          {title}
        </h2>
        <p className="text-[14px] font-normal text-[var(--text-secondary)] leading-[1.5]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
