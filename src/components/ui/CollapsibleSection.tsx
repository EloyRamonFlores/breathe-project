"use client";

import { useState, type ReactNode } from "react";

interface CollapsibleSectionProps {
  title: string;
  preview?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  sectionId?: string;
}

export default function CollapsibleSection({
  title,
  preview,
  defaultOpen = false,
  children,
  sectionId,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      id={sectionId}
      className="rounded-lg bg-bg-secondary border border-bg-tertiary overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-bg-tertiary/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
        aria-expanded={isOpen}
      >
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          {preview && (
            <p className="mt-1 text-sm text-text-muted">{preview}</p>
          )}
        </div>
        <span
          className={`flex-shrink-0 font-mono text-xs text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div
            className={`px-4 sm:px-5 pb-4 sm:pb-5 pt-4 border-t border-bg-tertiary transition-opacity duration-500 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"}`}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
