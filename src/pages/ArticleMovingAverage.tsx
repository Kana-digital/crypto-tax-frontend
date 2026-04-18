import type { CSSProperties } from "react";
import ArticleLayout from "./ArticleLayout";

const h2Style: CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  color: "#0f172a",
  marginTop: 40,
  marginBottom: 16,
  paddingBottom: 10,
  borderBottom: "2px solid #e2e8f0",
};

const h3Style: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: "#1e293b",
  marginTop: 28,
  marginBottom: 10,
};

const pStyle: CSSProperties = {
  marginBottom: 16,
  color: "#334155",
};

const boxStyle: CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  padding: "20px 24px",
  marginBottom: 20,
  fontSize: 14,
};

const highlightBox: CSSProperties = {
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  borderRadius: 10,
  padding: "20px 24px",
  marginBottom: 20,
};

export default function ArticleMovingAverage() {
  return (
    <ArticleLayout
      title="移動平均法と総平均法の違いをわかりやすく解説"
      description="暗号資産の取得原価を計算する2つの方式の仕組みと、どちらを選ぶかによって損益がどう変わるかを具体的な数字で解説します。"
      publishDate="2026年4月18日"
    >
      <p style={pStyle}>
        暗号資産の損益を計算するとき、「移動平均法」と「総平均法」という2つの計算方式が出てきます。同じ取引履歴であっても、どちらの方式を使うかによって算出される損益の金額が変わります。本記事では、それぞれの仕組みを数値例とともにわかりやすく説明します。
      </p>

      <h2 style={h2Style}>取得原価とは何か</h2>
      <p style={pStyle}>
        損益を計算するには「いくらで買ったか（取得原価）」を把握する必要があります。1回だけ購入して1回だけ売却するのであれば計算は単純ですが、実際には同じ通貨を複数回にわたって異なる価格で購入することがほとんどです。
      </p>
      <p style={pStyle}>
        たとえばビットコインを「1月に50万円で0.1BTC」「3月に70万円で0.1BTC」と2回に分けて買った場合、その後に0.1BTC売却したとき、「取得原価は50万円分か、70万円分か、それとも平均か」という問題が生じます。この問題を解決するのが、移動平均法と総平均法です。
      </p>

      <h2 style={h2Style}>総平均法とは</h2>
      <p style={pStyle}>
        <strong>総平均法</strong>は、一定期間（通常は1年間）の購入分を全てまとめて平均単価を求める方式です。
      </p>
      <div style={boxStyle}>
        <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#0f172a" }}>計算式</p>
        <p style={{ margin: 0, fontFamily: "monospace", fontSize: 15, color: "#334155" }}>
          平均取得単価 ＝ 年間の購入総額 ÷ 年間の購入総数量
        </p>
      </div>
      <h3 style={h3Style}>具体例</h3>
      <div style={boxStyle}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ textAlign: "left", paddingBottom: 8, color: "#64748b", fontWeight: 600 }}>日付</th>
              <th style={{ textAlign: "right", paddingBottom: 8, color: "#64748b", fontWeight: 600 }}>数量</th>
              <th style={{ textAlign: "right", paddingBottom: 8, color: "#64748b", fontWeight: 600 }}>単価</th>
              <th style={{ textAlign: "right", paddingBottom: 8, color: "#64748b", fontWeight: 600 }}>購入額</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "8px 0" }}>1月</td>
              <td style={{ textAlign: "right" }}>0.1 BTC</td>
              <td style={{ textAlign: "right" }}>500,000円</td>
              <td style={{ textAlign: "right" }}>50,000円</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0" }}>3月</td>
              <td style={{ textAlign: "right" }}>0.1 BTC</td>
              <td style={{ textAlign: "right" }}>700,000円</td>
              <td style={{ textAlign: "right" }}>70,000円</td>
            </tr>
            <tr style={{ borderTop: "1px solid #e2e8f0", fontWeight: 700 }}>
              <td style={{ padding: "8px 0" }}>合計</td>
              <td style={{ textAlign: "right" }}>0.2 BTC</td>
              <td style={{ textAlign: "right" }}>—</td>
              <td style={{ textAlign: "right" }}>120,000円</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12, marginBottom: 0, color: "#1e293b" }}>
          <strong>平均取得単価</strong>：120,000円 ÷ 0.2BTC ＝ <span style={{ color: "#2563eb", fontWeight: 700 }}>600,000円/BTC</span>
        </p>
      </div>
      <p style={pStyle}>
        5月に0.1BTCを800,000円で売却した場合、総平均法での取得原価は 600,000円 × 0.1 = 60,000円。
        したがって損益は 80,000円 − 60,000円 ＝ <strong>+20,000円</strong> になります。
      </p>

      <h2 style={h2Style}>移動平均法とは</h2>
      <p style={pStyle}>
        <strong>移動平均法</strong>は、購入のたびにその時点での平均単価を再計算する方式です。保有コインの残高と新たに購入したコインを合算して、その都度単価を更新します。
      </p>
      <div style={boxStyle}>
        <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#0f172a" }}>計算式</p>
        <p style={{ margin: 0, fontFamily: "monospace", fontSize: 14, color: "#334155" }}>
          新しい平均単価 ＝（既存保有額 + 新規購入額）÷（既存保有数量 + 新規購入数量）
        </p>
      </div>
      <h3 style={h3Style}>具体例（同じ取引で比較）</h3>
      <div style={boxStyle}>
        <p style={{ margin: "0 0 12px", fontWeight: 700, color: "#0f172a" }}>1月の購入後</p>
        <p style={{ margin: "0 0 4px", color: "#334155" }}>保有：0.1BTC、平均単価：500,000円/BTC</p>

        <p style={{ margin: "16px 0 12px", fontWeight: 700, color: "#0f172a" }}>3月の購入後（再計算）</p>
        <p style={{ margin: "0 0 4px", color: "#334155" }}>
          新平均単価 ＝（50,000円 + 70,000円）÷（0.1 + 0.1）BTC ＝ <span style={{ color: "#2563eb", fontWeight: 700 }}>600,000円/BTC</span>
        </p>
      </div>
      <p style={pStyle}>
        この例では偶然、総平均法と同じ結果になりますが、途中で売却が挟まると差が生じます。
      </p>

      <h3 style={h3Style}>売却が挟まるケース（移動平均法と総平均法の差が出る例）</h3>
      <div style={boxStyle}>
        <p style={{ margin: "0 0 8px", color: "#334155" }}>
          ①1月：0.1BTC を 500,000円で購入（平均単価：500,000円）<br />
          ②2月：0.05BTCを 600,000円で売却 → この時点での平均単価 500,000円で計算<br />
          ③3月：0.1BTCを 700,000円で購入
        </p>
        <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>移動平均法での③後の平均単価</p>
        <p style={{ margin: "4px 0 0", color: "#334155" }}>
          残高0.05BTCの保有額：25,000円（②売却後）<br />
          ③購入後：（25,000 + 70,000）÷（0.05 + 0.1）＝ <span style={{ color: "#2563eb", fontWeight: 700 }}>633,333円/BTC</span>
        </p>
      </div>
      <p style={pStyle}>
        一方、<strong>総平均法</strong>では年間の購入を全て合計するため、②の売却タイミングに関わらず年間の平均単価で一律計算されます。このため、売却タイミングや購入頻度が多いほど、2つの方式で異なる結果が生じます。
      </p>

      <h2 style={h2Style}>2つの方式の比較まとめ</h2>
      <div style={{ overflowX: "auto", marginBottom: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 480 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "10px 14px", textAlign: "left", border: "1px solid #e2e8f0", color: "#64748b" }}>比較項目</th>
              <th style={{ padding: "10px 14px", textAlign: "center", border: "1px solid #e2e8f0", color: "#2563eb" }}>移動平均法</th>
              <th style={{ padding: "10px 14px", textAlign: "center", border: "1px solid #e2e8f0", color: "#7c3aed" }}>総平均法</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["平均単価の更新タイミング", "購入のたびに毎回更新", "年末にまとめて1回計算"],
              ["計算の手間", "取引が多いほど複雑", "比較的シンプル"],
              ["売却タイミングの影響", "売却前の取得状況を反映", "年間を通じて均一"],
              ["損益への影響", "相場の動きに敏感", "年間を通じて平準化"],
            ].map(([item, moving, total]) => (
              <tr key={item}>
                <td style={{ padding: "10px 14px", border: "1px solid #e2e8f0", fontWeight: 600, color: "#334155" }}>{item}</td>
                <td style={{ padding: "10px 14px", border: "1px solid #e2e8f0", textAlign: "center", color: "#334155" }}>{moving}</td>
                <td style={{ padding: "10px 14px", border: "1px solid #e2e8f0", textAlign: "center", color: "#334155" }}>{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={h2Style}>どちらを選べばいい？</h2>
      <div style={highlightBox}>
        <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#1e293b" }}>📌 ポイント</p>
        <p style={{ margin: 0, color: "#334155", fontSize: 14 }}>
          どちらの方式が適しているかは、取引の頻度やパターンによって異なります。
          頻繁に売買を繰り返す場合は移動平均法のほうが実態に近い損益を把握しやすく、
          まとめて管理したい場合は総平均法が計算しやすいとされています。
          当ツールは両方の方式に対応しているため、実際に両方で計算してみて比較することも可能です。
        </p>
      </div>
      <p style={pStyle}>
        なお、複数回の購入・売却が絡む実際の計算は非常に複雑になります。当ツールでは取引所のCSVファイルをアップロードするだけで、移動平均法・総平均法どちらの方式でも自動的に計算結果を表示します。
      </p>
    </ArticleLayout>
  );
}
