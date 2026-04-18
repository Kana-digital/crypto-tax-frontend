import { Link } from "react-router-dom";

const articles = [
  {
    slug: "moving-average-vs-total-average",
    title: "移動平均法と総平均法の違いをわかりやすく解説",
    description: "暗号資産の取得原価を計算する2つの方式の仕組みと、どちらを選ぶかによって損益がどう変わるかを具体的な数字で解説します。",
    date: "2026年4月18日",
    readTime: "約5分",
    category: "計算方法",
  },
  {
    slug: "crypto-pnl-basics",
    title: "暗号資産の損益計算の基礎：なぜ複雑になるのか",
    description: "売却益・損失がどのように算出されるかの仕組みを、売買の具体例を交えて丁寧に解説。複数回購入したときに計算が複雑になる理由もわかります。",
    date: "2026年4月18日",
    readTime: "約4分",
    category: "基礎知識",
  },
  {
    slug: "csv-download-guide",
    title: "Coincheck・bitbank・SBI VC Trade のCSVダウンロード手順",
    description: "損益計算に必要な取引履歴CSVを各取引所からエクスポートする具体的な手順をスクリーンショット付きで解説します。",
    date: "2026年4月18日",
    readTime: "約3分",
    category: "使い方ガイド",
  },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  "計算方法": { bg: "#eff6ff", text: "#2563eb" },
  "基礎知識": { bg: "#f0fdf4", text: "#16a34a" },
  "使い方ガイド": { bg: "#fdf4ff", text: "#9333ea" },
};

export default function ArticlesIndex() {
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

      <main style={{ flex: 1, padding: "40px 20px 60px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Page title */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>コラム一覧</h1>
            <p style={{ fontSize: 14, color: "#64748b" }}>
              暗号資産の損益計算に関する基礎知識や、ツールの使い方を解説します。
            </p>
          </div>

          {/* Article cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {articles.map((article) => {
              const cat = categoryColors[article.category] ?? { bg: "#f1f5f9", text: "#475569" };
              return (
                <Link
                  key={article.slug}
                  to={`/articles/${article.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div style={{
                    background: "white",
                    borderRadius: 12,
                    padding: "24px 28px",
                    border: "1px solid #e2e8f0",
                    transition: "box-shadow 0.15s, transform 0.15s",
                    cursor: "pointer",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                      (e.currentTarget as HTMLDivElement).style.transform = "none";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        background: cat.bg,
                        color: cat.text,
                        padding: "2px 10px",
                        borderRadius: 20,
                      }}>{article.category}</span>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{article.date}</span>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>・{article.readTime}</span>
                    </div>
                    <h2 style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#0f172a",
                      marginBottom: 8,
                      lineHeight: 1.5,
                    }}>{article.title}</h2>
                    <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
                      {article.description}
                    </p>
                    <div style={{ marginTop: 14, fontSize: 13, color: "#2563eb", fontWeight: 600 }}>
                      続きを読む →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Tool CTA */}
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
              CSVをアップロードするだけで移動平均法・総平均法どちらでも計算できます（無料）
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
        </div>
      </main>

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
