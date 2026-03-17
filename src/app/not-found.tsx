import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en" className="dark">
      <body
        style={{ margin: 0, background: "#0A0F1C", fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            color: "#F9FAFB",
          }}
        >
          {/* Logo */}
          <div style={{ marginBottom: "48px" }}>
            <span style={{ fontSize: "22px", fontWeight: 400 }}>Toxin</span>
            <span style={{ fontSize: "22px", fontWeight: 700, color: "#10B981" }}>Free</span>
          </div>

          {/* 404 */}
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
            Page not found
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
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Links */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            <Link
              href="/en"
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
              ← Home
            </Link>
            <Link
              href="/en/check"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#1E293B",
                border: "1px solid #334155",
                color: "#F1F5F9",
                fontWeight: 500,
                fontSize: "14px",
                padding: "10px 20px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Risk Checker
            </Link>
            <Link
              href="/en/learn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#1E293B",
                border: "1px solid #334155",
                color: "#F1F5F9",
                fontWeight: 500,
                fontSize: "14px",
                padding: "10px 20px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Learn
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
