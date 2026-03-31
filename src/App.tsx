import { useState, useRef } from "react";

function App() {
  const [method, setMethod] = useState("total_average");
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      const toAdd = Array.from(newFiles).filter(f => !existing.has(f.name));
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
    if (files.length === 0) { setError("CSVファイルを選択してください"); return; }
    setLoading(true);
    setError("");
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    formData.append("method", method);
    try {
      const res = await fetch("http://localhost:8000/calculate", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "エラーが発生しました"); }
      else { setResult(data); }
    } catch (e) {
      setError("サーバーに接続できませんでした。バックエンドが起動しているか確認してください。");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>暗号資産 損益計算ツール</h1>
      <p style={{ color: "#666", marginBottom: 8 }}>取引履歴CSVをアップロードして損益を計算します</p>
      <p style={{ color: "#999", fontSize: 13, marginBottom: 24 }}>対応取引所：Coincheck・SBI VC Trade・bitbank</p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>計算方法</label>
        <select value={method} onChange={e => setMethod(e.target.value)}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", fontSize: 14 }}>
          <option value="total_average">総平均法</option>
          <option value="moving_average">移動平均法</option>
        </select>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: "bold" }}>CSVファイル</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            width: "100%", padding: "24px 12px", borderRadius: 6, fontSize: 14,
            border: `2px dashed ${dragging ? "#2563eb" : "#ccc"}`,
            backgroundColor: dragging ? "#eff6ff" : "#fafafa",
            textAlign: "center", cursor: "pointer", boxSizing: "border-box",
            color: "#999", transition: "all 0.2s",
          }}>
          ファイルを選択又はドラッグ＆ドロップ
        </div>
        <input ref={fileInputRef} type="file" accept=".csv" multiple
          onChange={e => addFiles(e.target.files)}
          style={{ display: "none" }} />
        {files.length > 0 && (
          <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none" }}>
            {files.map(f => (
              <li key={f.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "6px 10px", marginTop: 4, backgroundColor: "#f0f9ff",
                border: "1px solid #bae6fd", borderRadius: 4, fontSize: 13 }}>
                <span>📄 {f.name}</span>
                <button onClick={() => removeFile(f.name)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 16, lineHeight: 1 }}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

      <button onClick={handleSubmit} disabled={loading}
        style={{ width: "100%", padding: "12px", backgroundColor: "#2563eb", color: "white",
          border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer" }}>
        {loading ? "計算中..." : "損益を計算する"}
      </button>

      <div style={{ marginTop: 16, padding: "14px 18px", backgroundColor: "#fffbeb", borderRadius: 6, border: "1px solid #fde68a", fontSize: 12, color: "#78350f", lineHeight: 1.9 }}>
        <p style={{ margin: "0 0 8px", fontWeight: "bold", fontSize: 13 }}>注意事項</p>
        <ol style={{ margin: 0, paddingLeft: 16, listStylePosition: "outside" }}>
          <li style={{ textAlign: "left" }}>本ツールの計算結果は参考値であり、実際の確定申告の根拠としてそのまま使用することはできません。</li>
          <li style={{ textAlign: "left" }}>取引内容によっては、本ツールにより正確な計算が行えない場合があります。税務申告については、税務署又は税理士にご相談ください。</li>
          <li style={{ textAlign: "left" }}>本ツールの利用により生じた損害及び損失について、当ツールは一切の責任を負いません。</li>
        </ol>
      </div>

      {result && (
        <div style={{ marginTop: 32 }}>
          <button
            onClick={() => {
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
            }}
            style={{ marginBottom: 16, padding: "8px 20px", backgroundColor: "#f0fdf4",
              color: "#16a34a", border: "1px solid #86efac", borderRadius: 6,
              fontSize: 14, cursor: "pointer" }}>
            📥 取引データをCSVで出力
          </button>
          <div style={{ padding: 20, backgroundColor: "#f0fdf4", borderRadius: 8, marginBottom: 24, border: "1px solid #86efac" }}>
            <p style={{ margin: "0 0 12px", fontSize: 14, color: "#166534", fontWeight: "bold" }}>合計損益</p>
            {/* ヘッダー行 */}
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr", gap: 8, marginBottom: 6, fontSize: 12, color: "#166534", borderBottom: "1px solid #86efac", paddingBottom: 6 }}>
              <span></span>
              <span style={{ textAlign: "right" }}>収入金額</span>
              <span style={{ textAlign: "right" }}>取得価額</span>
              <span style={{ textAlign: "right" }}>損益</span>
            </div>
            {/* 年別 */}
            {(() => {
              const byYear: Record<string, { income: number; cost: number; profit: number }> = {};
              result.trades.forEach((t: any) => {
                const year = String(t.datetime).slice(0, 4);
                if (!byYear[year]) byYear[year] = { income: 0, cost: 0, profit: 0 };
                byYear[year].income += t.sell_price * t.amount;
                byYear[year].cost += t.avg_buy_price * t.amount;
                byYear[year].profit += t.profit;
              });
              return Object.entries(byYear).sort().map(([year, v]: [string, any]) => (
                <div key={year} style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr", gap: 8, marginBottom: 6, fontSize: 14, alignItems: "center" }}>
                  <span style={{ color: "#166534" }}>{year}年</span>
                  <span style={{ textAlign: "right", color: "#374151" }}>{Math.round(v.income).toLocaleString("ja-JP")} 円</span>
                  <span style={{ textAlign: "right", color: "#374151" }}>{Math.round(v.cost).toLocaleString("ja-JP")} 円</span>
                  <span style={{ textAlign: "right", fontWeight: "bold", color: v.profit >= 0 ? "#16a34a" : "#dc2626" }}>
                    {v.profit >= 0 ? "+" : ""}{Math.round(v.profit).toLocaleString("ja-JP")} 円
                  </span>
                </div>
              ));
            })()}
            {/* 合計行 */}
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr", gap: 8, borderTop: "1px solid #86efac", marginTop: 8, paddingTop: 8, alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#166534", fontWeight: "bold" }}>合計</span>
              <span style={{ textAlign: "right", fontSize: 14, color: "#374151" }}>
                {Math.round(result.trades.reduce((s: number, t: any) => s + t.sell_price * t.amount, 0)).toLocaleString("ja-JP")} 円
              </span>
              <span style={{ textAlign: "right", fontSize: 14, color: "#374151" }}>
                {Math.round(result.trades.reduce((s: number, t: any) => s + t.avg_buy_price * t.amount, 0)).toLocaleString("ja-JP")} 円
              </span>
              <span style={{ textAlign: "right", fontSize: 24, fontWeight: "bold", color: result.total_profit >= 0 ? "#16a34a" : "#dc2626" }}>
                {result.total_profit >= 0 ? "+" : ""}{Math.round(result.total_profit).toLocaleString("ja-JP")} 円
              </span>
            </div>
          </div>

          <h2 style={{ fontSize: 18, marginBottom: 12 }}>取引明細</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #e5e7eb" }}>取引所</th>
                <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #e5e7eb" }}>日時</th>
                <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #e5e7eb" }}>通貨</th>
                <th style={{ padding: "8px 12px", textAlign: "right", border: "1px solid #e5e7eb" }}>数量</th>
                <th style={{ padding: "8px 12px", textAlign: "right", border: "1px solid #e5e7eb" }}>売却単価</th>
                <th style={{ padding: "8px 12px", textAlign: "right", border: "1px solid #e5e7eb" }}>取得単価</th>
                <th style={{ padding: "8px 12px", textAlign: "right", border: "1px solid #e5e7eb" }}>損益</th>
              </tr>
            </thead>
            <tbody>
              {result.trades.map((t: any, i: number) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "white" : "#f9fafb" }}>
                  <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>
                    {{ coincheck: "Coincheck", sbivc: "SBI VC Trade", bitbank: "bitbank" }[t.exchange] ?? t.exchange}
                  </td>
                  <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>{t.datetime}</td>
                  <td style={{ padding: "8px 12px", border: "1px solid #e5e7eb" }}>{t.currency}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", border: "1px solid #e5e7eb" }}>{t.amount}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", border: "1px solid #e5e7eb" }}>{t.sell_price.toLocaleString("ja-JP")}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", border: "1px solid #e5e7eb" }}>{t.avg_buy_price.toLocaleString("ja-JP", { maximumFractionDigits: 0 })}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", border: "1px solid #e5e7eb",
                    color: t.profit >= 0 ? "#16a34a" : "#dc2626", fontWeight: "bold" }}>
                    {t.profit >= 0 ? "+" : ""}{t.profit.toLocaleString("ja-JP", { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
