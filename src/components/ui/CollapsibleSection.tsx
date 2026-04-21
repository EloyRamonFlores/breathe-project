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
      {/* Header row: toggle button + nav buttons as siblings (not nested) */}
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex-1 flex items-center gap-3 p-4 sm:p-5 text-left hover:bg-bg-tertiary/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
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

        {/* Nav buttons — siblings of toggle, not children */}
        {(prevId || nextId) && (
          <div className="flex flex-col justify-center gap-0.5 px-2 border-l border-bg-tertiary">
            {prevId && (
              <button
                type="button"
                onClick={() => scrollTo(prevId)}
                className="p-1.5 rounded text-text-muted hover:text-accent hover:bg-accent/10 transition-colors text-sm leading-none"
                aria-label="Ir a sección anterior"
              >
                ↑
              </button>
            )}
            {nextId && (
              <button
                type="button"
                onClick={() => scrollTo(nextId)}
                className="p-1.5 rounded text-text-muted hover:text-accent hover:bg-accent/10 transition-colors text-sm leading-none"
                aria-label="Ir a sección siguiente"
              >
                ↓
              </button>
            )}
          </div>
        )}
      </div>

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
