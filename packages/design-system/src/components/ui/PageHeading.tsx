"use client";

import { AiStar } from "./AiStar";

interface PageHeadingProps {
  title: string;
  subtitle: string;
}

export function PageHeading({ title, subtitle }: PageHeadingProps) {
  return (
    <div className="flex items-start gap-2 ml-[2px] shrink-0">
      <AiStar size={40} className="shrink-0" />
      <div className="flex flex-col gap-1">
        <h2 className="text-[20px] font-semibold text-[var(--text-primary)] tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-[16px] font-normal text-[var(--text-secondary)] leading-[1.3]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
