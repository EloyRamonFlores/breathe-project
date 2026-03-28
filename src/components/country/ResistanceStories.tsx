"use client";

import { useTranslations, useLocale } from "next-intl";
import type { ResistanceStory } from "@/lib/types";

interface ResistanceStoriesProps {
  stories: ResistanceStory[];
}

export default function ResistanceStories({ stories }: ResistanceStoriesProps) {
  const t = useTranslations("country");
  const locale = useLocale();

  if (!stories || stories.length === 0) return null;

  return (
    <section className="mb-10" aria-labelledby="resistance-heading">
      <h2
        id="resistance-heading"
        className="text-lg font-semibold text-text-primary mb-1"
      >
        {t("resistance_title")}
      </h2>
      <p className="text-sm text-text-muted mb-4">
        {t("resistance_subtitle")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stories.map((story) => {
          const role =
            locale === "es" ? (story.role_es ?? story.role) : story.role;
          const achievement =
            locale === "es"
              ? (story.achievement_es ?? story.achievement)
              : story.achievement;

          return (
            <article
              key={story.name}
              className="rounded-lg bg-bg-secondary border border-bg-tertiary p-4 sm:p-6 flex flex-col"
            >
              <div className="mb-2">
                <h3 className="font-semibold text-text-primary">
                  {story.name}
                </h3>
                <span className="font-mono text-xs text-warning">
                  {story.years}
                </span>
              </div>

              <p className="text-sm text-text-muted mb-2">{role}</p>

              <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-3">
                {achievement}
              </p>

              {story.quote && story.quote_source && (
                <blockquote className="border-l-2 border-warning/50 pl-3 mb-3 italic text-sm text-text-secondary">
                  &ldquo;{story.quote}&rdquo;
                  <cite className="block text-xs text-text-muted mt-1 not-italic">
                    — {story.quote_source}
                  </cite>
                </blockquote>
              )}

              <a
                href={story.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-muted hover:text-accent transition-colors mt-auto"
              >
                {t("source_link_label")}
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
