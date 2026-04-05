import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        color: "#F9FAFB",
      }}
    >
      <p
        style={{
          fontFamily: "monospace",
          fontSize: "14px",
          color: "#475569",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}
      >
        404
      </p>

      <h1
        style={{
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 700,
          color: "#F1F5F9",
          marginBottom: "12px",
          textAlign: "center",
        }}
      >
        {t("not_found_title")}
      </h1>

      <p
        style={{
          fontSize: "16px",
          color: "#64748B",
          marginBottom: "40px",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        {t("not_found_description")}
      </p>

      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "#10B981",
          color: "#0A0F1C",
          fontWeight: 600,
          fontSize: "14px",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        ← {t("not_found_back")}
      </Link>
    </div>
  );
}
