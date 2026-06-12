"use client";

import { AiStar } from "./AiStar";

interface PageHeadingProps {
  title: string;
  subtitle: string;
}

export function PageHeading({ title, subtitle }: PageHeadingProps) {
  return (
    // Figma: HMTX-Portal page heading (node 1726-5081) — 30px large star, 8px gap,
    // 14px/1.5 subtitle. Title is the "Heading 4" type token: 20px/600/22.8px (114%),
    // color --text-heading (#1e1e1e light).
    <div className="flex items-start gap-2 ml-[2px] shrink-0">
      <AiStar variant="large" size={30} className="shrink-0" />
      <div className="flex flex-col gap-[var(--text-stack-gap)]">
        <h2 className="text-[20px] font-semibold leading-[22.8px] text-[var(--text-heading,#1e1e1e)]">
          {title}
        </h2>
        <p className="text-[14px] font-normal text-[var(--text-secondary)] leading-[1.5]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
