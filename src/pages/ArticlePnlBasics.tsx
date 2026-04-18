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

const formulaBox: CSSProperties = {
  background: "#1e293b",
  borderRadius: 10,
  padding: "20px 24px",
  marginBottom: 20,
  textAlign: "center",
};

export default function ArticlePnlBasics() {
  return (
    <ArticleLayout
      title="暗号資産の損益計算の基礎：なぜ複雑になるのか"
      description="売却益・損失がどのように算出されるかの仕組みを、売買の具体例を交えて丁寧に解説。複数回購入したときに計算が複雑になる理由もわかります。"
      publishDate="2026年4月18日"
    >
      <p style={pStyle}>
        暗号資産を売却したとき、「いくら儲かったか（または損したか）」を正確に把握したいと思う方は多いはずです。
        しかし実際に計算しようとすると、思った以上に複雑であることに気づきます。
        本記事では、損益計算の基本的な仕組みと、なぜ複雑になるのかをわかりやすく解説します。
      </p>

      <h2 style={h2Style}>損益の基本的な考え方</h2>
      <p style={pStyle}>
        損益の計算自体はシンプルです。「売ったときの金額」から「買ったときの金額（取得原価）」を引いた差額が損益になります。
      </p>
      <div style={formulaBox}>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>損益の計算式</p>
        <p style={{ margin: 0, color: "white", fontSize: 18, fontWeight: 700, fontFamily: "monospace" }}>
          損益 ＝ 売却金額 − 取得原価
        </p>
      </div>

      <h3 style={h3Style}>シンプルなケース（1回だけ買って1回だけ売る）</h3>
      <div style={boxStyle}>
        <p style={{ margin: "0 0 8px", color: "#334155" }}>
          例：ビットコインを<strong>500,000円</strong>で0.1BTC購入し、後日<strong>800,000円</strong>で0.1BTC全て売却した場合
        </p>
        <p style={{ margin: 0, fontWeight: 700, color: "#2563eb" }}>
          損益 ＝ 80,000円 − 50,000円 ＝ +30,000円（利益）
        </p>
      </div>
      <p style={pStyle}>
        1回買って1回売る場合はシンプルです。問題は、同じ通貨を複数回に分けて購入したときに生じます。
      </p>

      <h2 style={h2Style}>なぜ複数回購入すると複雑になるのか</h2>
      <p style={pStyle}>
        実際の取引では「安い時期に少しずつ買い増し」や「積み立て感覚で定期購入」をする方が多いです。すると、同じ通貨でも購入価格がバラバラになります。
      </p>
      <div style={boxStyle}>
        <p style={{ margin: "0 0 12px", fontWeight: 700, color: "#0f172a" }}>複数回購入の例</p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <th style={{ textAlign: "left", paddingBottom: 8, color: "#64748b", fontWeight: 600 }}>購入日</th>
              <th style={{ textAlign: "right", paddingBottom: 8, color: "#64748b", fontWeight: 600 }}>数量</th>
              <th style={{ textAlign: "right", paddingBottom: 8, color: "#64748b", fontWeight: 600 }}>購入単価</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1月", "0.1 BTC", "500,000円"],
              ["2月", "0.05 BTC", "600,000円"],
              ["3月", "0.1 BTC", "400,000円"],
              ["4月", "0.05 BTC", "750,000円"],
            ].map(([date, qty, price]) => (
              <tr key={date}>
                <td style={{ padding: "7px 0" }}>{date}</td>
                <td style={{ textAlign: "right" }}>{qty}</td>
                <td style={{ textAlign: "right" }}>{price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={pStyle}>
        この状態で「5月に0.2BTCを売却した」とき、「どのBTCを売ったのか」という問題が生じます。
        1月に買ったものを売ったのか、4月に買ったものを売ったのか、それとも全体の平均なのか——これを明確に定義するための計算方式が必要です。
      </p>

      <h2 style={h2Style}>計算を複雑にする3つの要因</h2>

      <h3 style={h3Style}>① 購入のタイミングと価格がバラバラ</h3>
      <p style={pStyle}>
        同じ通貨でも複数の「購入ロット」が存在するため、どのロットを売ったのかを計算ルールで定義する必要があります。
        日本では主に「移動平均法」または「総平均法」という2つの方式を使って平均取得単価を求めます。
      </p>

      <h3 style={h3Style}>② 複数の通貨を保有している</h3>
      <p style={pStyle}>
        ビットコイン・イーサリアム・リップルなど、複数の通貨を取引している場合は、通貨ごとに別々に計算が必要です。
        通貨ペア（ETH/BTCなど）の取引も絡むと、さらに計算が複雑になります。
      </p>

      <h3 style={h3Style}>③ 手数料や取引所ごとのデータ形式の違い</h3>
      <p style={pStyle}>
        取引手数料も取得原価に含まれるため、厳密に計算するには各取引の手数料も加味する必要があります。
        また、取引所によってCSVファイルの形式が異なるため、データの統合にも手間がかかります。
      </p>

      <h2 style={h2Style}>当ツールが解決すること</h2>
      <div style={{
        background: "#f0fdf4",
        border: "1px solid #86efac",
        borderRadius: 10,
        padding: "20px 24px",
        marginBottom: 20,
        fontSize: 14,
        color: "#166534",
      }}>
        <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 15 }}>✅ 当ツールが自動で処理すること</p>
        <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 2 }}>
          <li>複数回購入した場合の取得原価の自動計算（移動平均法 / 総平均法）</li>
          <li>Coincheck・bitbank・SBI VC Trade の CSV データ自動解析</li>
          <li>通貨ごとの損益の個別集計</li>
          <li>取引明細の一覧表示（売却単価・取得単価・損益を一目で確認）</li>
        </ul>
      </div>
      <p style={pStyle}>
        CSVファイルをアップロードして計算方式を選ぶだけで、複雑な計算を自動で処理します。
        複数の取引所のCSVを同時にアップロードして、まとめて計算することも可能です。
      </p>

      <h2 style={h2Style}>まとめ</h2>
      <p style={pStyle}>
        暗号資産の損益計算の基本は「売却金額 − 取得原価」というシンプルな式ですが、複数回の購入・複数通貨・手数料など、実際の取引が絡むと計算は一気に複雑になります。
        移動平均法と総平均法のどちらを使うかによって損益の数字も変わるため、正確に把握するには各方式の特性を理解しておくことが重要です。
      </p>
      <p style={pStyle}>
        当ツールはこうした計算を自動化し、取引所のCSVデータさえあれば誰でも簡単に損益を把握できるように設計しています。ぜひ一度お試しください。
      </p>
    </ArticleLayout>
  );
}
