import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ArticleLayoutProps {
  title: string;
  description: string;
  publishDate: string;
  children: ReactNode;
}

export default function ArticleLayout({ title, description, publishDate, children }: ArticleLayoutProps) {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}>
        <div style={{
          maxWidth: 760,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          height: 56,
          gap: 10,
        }}>
          <div style={{
            width: 28,
            height: 28,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            borderRadius: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            flexShrink: 0,
          }}>₿</div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", letterSpacing: "-0.3px" }}>
              暗号資産損益計算ツール
            </span>
          </Link>
          <span style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>/ コラム</span>
        </div>
      </header>

      {/* Article content */}
      <main style={{ flex: 1, padding: "40px 20px 60px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <nav style={{ marginBottom: 24, fontSize: 13, color: "#64748b" }}>
            <Link to="/" style={{ color: "#2563eb", textDecoration: "none" }}>ホーム</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <Link to="/articles" style={{ color: "#2563eb", textDecoration: "none" }}>コラム一覧</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <span>{title}</span>
          </nav>

          {/* Article header */}
          <header style={{ marginBottom: 36 }}>
            <h1 style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.4,
              marginBottom: 12,
              letterSpacing: "-0.5px",
            }}>{title}</h1>
            <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>{description}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <time style={{
                fontSize: 12,
                color: "#94a3b8",
                background: "#f1f5f9",
                padding: "3px 10px",
                borderRadius: 20,
              }}>{publishDate}</time>
            </div>
          </header>

          {/* Article body */}
          <div style={{
            background: "white",
            borderRadius: 12,
            padding: "36px 40px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            fontSize: 15,
            color: "#1e293b",
            lineHeight: 1.85,
          }}>
            {children}
          </div>

          {/* Back to tools CTA */}
          <div style={{
            marginTop: 40,
            padding: "28px 32px",
            background: "linear-gradient(135deg, #eff6ff, #f5f3ff)",
            borderRadius: 12,
            border: "1px solid #e0e7ff",
            textAlign: "center",
          }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
              損益を実際に計算してみる
            </p>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
              取引所のCSVをアップロードするだけで、移動平均法・総平均法どちらでも計算できます
            </p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                color: "white",
                padding: "11px 28px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              無料で計算する →
            </Link>
          </div>

          {/* Related articles */}
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>関連コラム</h2>
            <Link to="/articles" style={{ textDecoration: "none" }}>
              <div style={{
                background: "white",
                borderRadius: 10,
                padding: "16px 20px",
                border: "1px solid #e2e8f0",
                color: "#2563eb",
                fontSize: 14,
                fontWeight: 600,
                transition: "background 0.15s",
              }}>
                コラム一覧を見る →
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: "white",
        borderTop: "1px solid #e2e8f0",
        padding: "24px 20px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 12, color: "#94a3b8" }}>
          © 2026 暗号資産損益計算ツール. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
