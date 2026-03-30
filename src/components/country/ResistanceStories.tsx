"use client";

import { useTranslations, useLocale } from "next-intl";
import type { ResistanceStory } from "@/lib/types";
import { getInitials, getRoleTypeColor } from "@/lib/utils";

interface ResistanceStoriesProps {
  stories: ResistanceStory[];
}

type RoleType = ResistanceStory["role_type"];

function getRoleLabel(
  roleType: RoleType,
  t: ReturnType<typeof useTranslations>
): string | null {
  if (!roleType) return null;
  const map: Record<NonNullable<RoleType>, string> = {
    victim: t("resistance_role_victim"),
    advocate: t("resistance_role_advocate"),
    legal: t("resistance_role_legal"),
    network: t("resistance_role_network"),
    journalist: t("resistance_role_journalist"),
    scientist: t("resistance_role_scientist"),
  };
  return map[roleType];
}

function getRoleBadgeClass(roleType: RoleType): string {
  const map: Record<NonNullable<RoleType>, string> = {
    victim: "text-danger bg-danger/10 border border-danger/20",
    advocate: "text-warning bg-warning/10 border border-warning/20",
    legal: "text-accent bg-accent/10 border border-accent/20",
    network: "text-safe bg-safe/10 border border-safe/20",
    journalist: "text-accent bg-accent/10 border border-accent/20",
    scientist: "text-safe bg-safe/10 border border-safe/20",
  };
  return roleType ? (map[roleType] ?? "text-warning bg-warning/10 border border-warning/20") : "text-warning bg-warning/10 border border-warning/20";
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
      <p className="text-sm text-text-muted mb-6">
        {t("resistance_subtitle")}
      </p>

      {/* Amber left border editorial container */}
      <div className="border-l-2 border-warning pl-4 sm:pl-6 space-y-0">
        {stories.map((story, i) => {
          const role =
            locale === "es" ? (story.role_es ?? story.role) : story.role;
          const achievement =
            locale === "es"
              ? (story.achievement_es ?? story.achievement)
              : story.achievement;

          const initials = getInitials(story.name);
          const avatarClass = getRoleTypeColor(story.role_type);
          const roleLabel = getRoleLabel(story.role_type, t);
          const roleBadgeClass = getRoleBadgeClass(story.role_type);
          const isLast = i === stories.length - 1;

          return (
            <article
              key={story.name}
              className={`flex flex-col sm:flex-row gap-4 py-6 ${!isLast ? "border-b border-bg-tertiary" : ""}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm font-bold ${avatarClass}`}
                  aria-hidden="true"
                >
                  {initials}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Name + role badge + years */}
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <h3 className="font-semibold text-text-primary text-base">
                    {story.name}
                  </h3>
                  {roleLabel && (
                    <span
                      className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${roleBadgeClass}`}
                    >
                      {roleLabel}
                    </span>
                  )}
                  <span className="font-mono text-xs text-text-muted">
                    {story.years}
                  </span>
                </div>

                {/* Role description */}
                <p className="text-sm text-text-muted mb-2">{role}</p>

                {/* Achievement */}
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  {achievement}
                </p>

                {/* Quote */}
                {story.quote && story.quote_source && (
                  <blockquote className="border-l-2 border-warning/50 pl-3 mb-3 italic text-sm text-text-secondary">
                    &ldquo;{story.quote}&rdquo;
                    <cite className="block text-xs text-text-muted mt-1 not-italic">
                      — {story.quote_source}
                    </cite>
                  </blockquote>
                )}

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
            </article>
          );
        })}
      </div>
    </section>
  );
}
