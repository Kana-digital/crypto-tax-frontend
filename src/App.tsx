import { useState, useRef } from "react";
import "./App.css";

// ==================== Privacy Policy Modal ====================
function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <p className="modal-title">プライバシーポリシー</p>
          <button className="modal-close" onClick={onClose} aria-label="閉じる">✕</button>
        </div>
        <div className="modal-body">
          <h3>1. 基本方針</h3>
          <p>本ツール（以下「当ツール」）は、利用者のプライバシーを尊重し、個人情報の保護に努めます。当ツールは暗号資産の損益計算を行う無料サービスです。</p>

          <h3>2. アップロードデータの取り扱い</h3>
          <p>利用者がアップロードするCSVファイルは、損益計算の処理のみに使用されます。アップロードされたデータはサーバーに保存されず、処理完了後に即座に破棄されます。当ツールはお客様の取引データを収集・保管・第三者提供しません。</p>

          <h3>3. アクセス解析ツール（Google Analytics）</h3>
          <p>当ツールはサービス改善のため、Google Analytics（GA4）を使用しています。Google Analyticsはトラフィックデータの収集のためにCookieを使用しており、このデータは匿名で収集されます。個人を特定する情報は含まれません。</p>
          <p>Cookieの使用を望まない場合は、ブラウザの設定からCookieを無効にすることができます。詳細は <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{color: "#2563eb"}}>Googleのプライバシーポリシー</a> をご確認ください。</p>

          <h3>4. 広告・アフィリエイトリンクについて</h3>
          <p>当ツールでは、暗号資産取引所へのアフィリエイトリンクを掲載しています（「PR」と表示）。アフィリエイトリンクを経由して口座開設が行われた場合、当ツールに報酬が支払われることがあります。利用者がリンクをクリックした場合、各取引所のプライバシーポリシーが適用されます。</p>

          <h3>5. 免責事項</h3>
          <p>本ツールの計算結果は参考値であり、税務申告等の正式な書類としてそのまま使用することはできません。計算結果の正確性について当ツールは一切の責任を負いません。確定申告については税務署または税理士にご相談ください。</p>

          <h3>6. プライバシーポリシーの変更</h3>
          <p>当ツールは、必要に応じて本プライバシーポリシーを変更することがあります。変更後のポリシーは本ページに掲載した時点から効力を生じます。</p>

          <p className="modal-updated">最終更新日：2026年4月1日</p>
        </div>
      </div>
    </div>
  );
}

// ==================== Main App ====================
function App() {
  const [method, setMethod] = useState("total_average");
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      const toAdd = Array.from(newFiles).filter(f => {
        if (!f.name.endsWith(".csv")) return false;
        return !existing.has(f.name);
      });
      return [...prev, ...toAdd];
    });
  };

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("CSVファイルを1つ以上選択してください");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    formData.append("method", method);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/calculate`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "計算中にエラーが発生しました。CSVのフォーマットを確認してください。");
      } else {
        setResult(data);
        // 結果までスクロール
        setTimeout(() => {
          document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch {
      setError("サーバーに接続できませんでした。しばらく待ってから再度お試しください。");
    }
    setLoading(false);
  };

  // 年別損益集計
  const byYear: Record<string, { income: number; cost: number; profit: number }> = {};
  if (result) {
    result.trades.forEach((t: any) => {
      const year = String(t.datetime).slice(0, 4);
      if (!byYear[year]) byYear[year] = { income: 0, cost: 0, profit: 0 };
      byYear[year].income += t.sell_price * t.amount;
      byYear[year].cost += t.avg_buy_price * t.amount;
      byYear[year].profit += t.profit;
    });
  }

  const handleCSVDownload = () => {
    const header = "取引日時,取引所,売買,通貨,数量,単価(円),手数料";
    const rows = result.raw_trades.map((t: any) =>
      `${t.datetime},${t.exchange},${t.action},${t.currency},${t.amount},${t.price},${t.fee}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "取引データ.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const EXCHANGE_LABELS: Record<string, string> = {
    coincheck: "Coincheck",
    sbivc: "SBI VC Trade",
    bitbank: "bitbank",
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-header-logo">₿</div>
          <span className="app-header-title">暗号資産損益計算ツール</span>
          <span className="app-header-badge">無料</span>
        </div>
      </header>

      <main className="app-container">
        {/* Page Title */}
        <h1 className="page-title">暗号資産の損益を<br />かんたん計算</h1>
        <p className="page-subtitle">取引履歴CSVをアップロードするだけで損益を自動計算します</p>
        <p className="page-exchanges">対応取引所：Coincheck・SBI VC Trade・bitbank</p>

        {/* Step 1: 計算方法 */}
        <div className="card">
          <label className="card-label" htmlFor="method-select">① 計算方法を選ぶ</label>
          <select
            id="method-select"
            className="method-select"
            value={method}
            onChange={e => setMethod(e.target.value)}
          >
            <option value="total_average">総平均法（一般的な方法）</option>
            <option value="moving_average">移動平均法</option>
          </select>
          <p className="method-hint">
            {method === "total_average"
              ? "年間を通じた平均取得単価で計算します。確定申告でよく使われる方法です。"
              : "取引のたびに平均取得単価を更新する方法です。"}
          </p>
        </div>

        {/* Step 2: ファイルアップロード */}
        <div className="card">
          <label className="card-label">② CSVファイルをアップロード</label>
          <div
            className={`file-drop-area${dragging ? " dragging" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <div className="file-drop-icon">📂</div>
            <p className="file-drop-text">
              クリックしてファイルを選択<br />
              またはドラッグ＆ドロップ
            </p>
            <p className="file-drop-hint">複数のCSVファイルを一度に選択できます</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            multiple
            onChange={e => addFiles(e.target.files)}
            style={{ display: "none" }}
          />
          {files.length > 0 && (
            <ul className="file-list">
              {files.map(f => (
                <li key={f.name} className="file-list-item">
                  <span>📄 {f.name}</span>
                  <button
                    className="file-remove-btn"
                    onClick={() => removeFile(f.name)}
                    aria-label={`${f.name}を削除`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              計算中...
            </>
          ) : (
            "③ 損益を計算する"
          )}
        </button>

        {/* Notice */}
        <div className="notice-box" style={{ marginTop: 16 }}>
          <p className="notice-box-title">⚠️ 注意事項</p>
          <ol>
            <li>本ツールの計算結果は参考値であり、実際の確定申告の根拠としてそのまま使用することはできません。</li>
            <li>取引内容によっては正確な計算が行えない場合があります。税務申告については税務署または税理士にご相談ください。</li>
            <li>本ツールの利用により生じた損害について、当ツールは一切の責任を負いません。</li>
          </ol>
        </div>

        {/* Affiliate */}
        <div className="affiliate-section">
          <div className="affiliate-header">
            <p className="affiliate-title">おすすめ暗号資産取引所</p>
            <span className="pr-badge">PR</span>
          </div>
          <div className="affiliate-grid">
            <a
              href="COINCHECK_AFFILIATE_URL"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="affiliate-card"
            >
              <div className="affiliate-icon" style={{ backgroundColor: "#00b9ae" }}>C</div>
              <div className="affiliate-info">
                <div className="affiliate-name">Coincheck</div>
                <div className="affiliate-desc">国内最大級<br />口座開設無料</div>
              </div>
            </a>
            <a
              href="BITBANK_AFFILIATE_URL"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="affiliate-card"
            >
              <div className="affiliate-icon" style={{ backgroundColor: "#1c2b4b" }}>B</div>
              <div className="affiliate-info">
                <div className="affiliate-name">bitbank</div>
                <div className="affiliate-desc">国内最多通貨<br />充実のチャート</div>
              </div>
            </a>
            <a
              href="SBIVC_AFFILIATE_URL"
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="affiliate-card"
            >
              <div className="affiliate-icon" style={{ backgroundColor: "#0057b7", fontSize: 11 }}>SBI</div>
              <div className="affiliate-info">
                <div className="affiliate-name">SBI VC Trade</div>
                <div className="affiliate-desc">SBIグループ<br />安心・信頼</div>
              </div>
            </a>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="result-section" id="result-section">
            <h2 className="result-section-title">計算結果</h2>

            {/* Summary */}
            <div className="result-summary">
              <p className="result-summary-label">合計損益</p>
              <div className="result-grid-header">
                <span></span>
                <span style={{ textAlign: "right" }}>収入金額</span>
                <span style={{ textAlign: "right" }}>取得価額</span>
                <span style={{ textAlign: "right" }}>損益</span>
              </div>
              {Object.entries(byYear).sort().map(([year, v]: [string, any]) => (
                <div key={year} className="result-grid-row">
                  <span className="result-year">{year}年</span>
                  <span className="result-amount">{Math.round(v.income).toLocaleString("ja-JP")} 円</span>
                  <span className="result-amount">{Math.round(v.cost).toLocaleString("ja-JP")} 円</span>
                  <span className={`result-profit ${v.profit >= 0 ? "positive" : "negative"}`}>
                    {v.profit >= 0 ? "+" : ""}{Math.round(v.profit).toLocaleString("ja-JP")} 円
                  </span>
                </div>
              ))}
              <div className="result-grid-total">
                <span className="result-total-label">合計</span>
                <span className="result-amount" style={{ fontSize: 14 }}>
                  {Math.round(result.trades.reduce((s: number, t: any) => s + t.sell_price * t.amount, 0)).toLocaleString("ja-JP")} 円
                </span>
                <span className="result-amount" style={{ fontSize: 14 }}>
                  {Math.round(result.trades.reduce((s: number, t: any) => s + t.avg_buy_price * t.amount, 0)).toLocaleString("ja-JP")} 円
                </span>
                <span
                  className={`result-total-profit result-profit ${result.total_profit >= 0 ? "positive" : "negative"}`}
                >
                  {result.total_profit >= 0 ? "+" : ""}
                  {Math.round(result.total_profit).toLocaleString("ja-JP")} 円
                </span>
              </div>
            </div>

            {/* CSV Download */}
            <button className="csv-btn" onClick={handleCSVDownload}>
              📥 取引データをCSVで出力
            </button>

            {/* Table */}
            <h2 className="result-section-title" style={{ marginTop: 8 }}>取引明細</h2>
            <div className="table-wrapper">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>取引所</th>
                    <th>日時</th>
                    <th>通貨</th>
                    <th className="right">数量</th>
                    <th className="right">売却単価</th>
                    <th className="right">取得単価</th>
                    <th className="right">損益</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trades.map((t: any, i: number) => (
                    <tr key={i}>
                      <td>{EXCHANGE_LABELS[t.exchange] ?? t.exchange}</td>
                      <td>{t.datetime}</td>
                      <td>{t.currency}</td>
                      <td className="right">{t.amount}</td>
                      <td className="right">{t.sell_price.toLocaleString("ja-JP")}</td>
                      <td className="right">{t.avg_buy_price.toLocaleString("ja-JP", { maximumFractionDigits: 0 })}</td>
                      <td className={`right td-profit ${t.profit >= 0 ? "positive" : "negative"}`}>
                        {t.profit >= 0 ? "+" : ""}{t.profit.toLocaleString("ja-JP", { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="app-footer-inner">
          <div className="footer-links">
            <button className="footer-link" onClick={() => setShowPrivacy(true)}>
              プライバシーポリシー
            </button>
            <a
              className="footer-link"
              href="https://crypto-tax-frontend.vercel.app/"
              target="_self"
            >
              使い方
            </a>
          </div>
          <p className="footer-copy">© 2026 暗号資産損益計算ツール. All rights reserved.</p>
        </div>
      </footer>

      {/* Privacy Modal */}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </div>
  );
}

export default App;
