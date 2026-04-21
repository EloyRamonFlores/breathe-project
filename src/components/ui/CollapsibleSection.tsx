"use client";

import { useState, type ReactNode } from "react";

interface CollapsibleSectionProps {
  title: string;
  preview?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  sectionId?: string;
  prevId?: string;
  nextId?: string;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CollapsibleSection({
  title,
  preview,
  defaultOpen = false,
  children,
  sectionId,
  prevId,
  nextId,
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
        className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left hover:bg-bg-tertiary/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
        aria-expanded={isOpen}
      >
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          {preview && (
            <p className="mt-1 text-sm text-text-muted">{preview}</p>
          )}
        </div>

        {/* Navigation + expand controls */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {prevId && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); scrollTo(prevId); }}
              className="p-1.5 rounded text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
              aria-label="Ir a sección anterior"
            >
              ↑
            </button>
          )}
          {nextId && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); scrollTo(nextId); }}
              className="p-1.5 rounded text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
              aria-label="Ir a sección siguiente"
            >
              ↓
            </button>
          )}
          <span
            className={`ml-1 font-mono text-xs text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            ▼
          </span>
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-4 border-t border-bg-tertiary">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
