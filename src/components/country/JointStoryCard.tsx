"use client";

import { useTranslations, useLocale } from "next-intl";
import type { JointResistanceStory } from "@/lib/types";

interface JointStoryCardProps {
  story: JointResistanceStory;
}

export default function JointStoryCard({ story }: JointStoryCardProps) {
  const t = useTranslations("country");
  const locale = useLocale();

  const title = locale === "es" ? (story.title_es ?? story.title) : story.title;
  const narrative = locale === "es" ? (story.narrative_es ?? story.narrative) : story.narrative;

  return (
    <section className="mb-10" aria-labelledby="joint-story-heading">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-warning" aria-hidden="true" />
        <h2
          id="joint-story-heading"
          className="text-xs font-mono uppercase tracking-[0.2em] text-warning"
        >
          {t("joint_story_label")}
        </h2>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-warning/20 bg-gradient-to-br from-warning/5 to-transparent overflow-hidden">
        <div className="flex flex-col sm:flex-row">

          {/* Photo — left side */}
          <div className="sm:w-64 flex-shrink-0">
            <picture>
              <source srcSet={story.photo_url} type="image/webp" />
              <img
                src={story.photo_url.replace(".webp", ".jpg")}
                alt={story.people.map((p) => p.name).join(" & ")}
                className="w-full h-56 sm:h-full object-cover object-center"
              />
            </picture>
          </div>

          {/* Content — right side */}
          <div className="flex-1 p-5 sm:p-6">
            {/* Names + years */}
            <div className="flex flex-wrap items-baseline gap-2 mb-2">
              <h3 className="font-semibold text-text-primary text-base">
                {story.people.map((p) => p.name).join(" & ")}
              </h3>
              <span className="font-mono text-xs text-text-muted">{story.years}</span>
            </div>

            {/* Role badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {story.people.map((person) => {
                const role = locale === "es" ? (person.role_es ?? person.role) : person.role;
                return (
                  <span
                    key={person.name}
                    className="inline-flex items-center rounded border border-warning/20 bg-warning/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-warning"
                  >
                    {role}
                  </span>
                );
              })}
            </div>

            {/* Title */}
            <p className="text-sm font-medium text-text-primary mb-3 leading-snug">
              {title}
            </p>

            {/* Narrative */}
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {narrative}
            </p>

            {/* Source */}
            <a
              href={story.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-accent transition-colors"
            >
              {t("source_link_label")}
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
