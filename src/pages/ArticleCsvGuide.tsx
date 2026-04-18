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

const stepBox: CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  padding: "20px 24px",
  marginBottom: 16,
  fontSize: 14,
};

const stepNumberStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 24,
  height: 24,
  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
  color: "white",
  borderRadius: "50%",
  fontSize: 12,
  fontWeight: 700,
  marginRight: 10,
  flexShrink: 0,
};

const exchangeHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: "16px 20px",
  marginBottom: 16,
  marginTop: 24,
};

export default function ArticleCsvGuide() {
  return (
    <ArticleLayout
      title="Coincheck・bitbank・SBI VC Trade のCSVダウンロード手順"
      description="損益計算に必要な取引履歴CSVを各取引所からエクスポートする具体的な手順を解説します。ダウンロードしたCSVはそのまま当ツールに使用できます。"
      publishDate="2026年4月18日"
    >
      <p style={pStyle}>
        当ツールで損益計算を行うには、各取引所からダウンロードした「取引履歴CSV」が必要です。
        本記事では、対応する3つの取引所（Coincheck・bitbank・SBI VC Trade）それぞれのCSVダウンロード手順を解説します。
        ダウンロードしたCSVはそのまま当ツールにアップロードしてお使いいただけます。
      </p>

      <div style={{
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: 10,
        padding: "16px 20px",
        marginBottom: 28,
        fontSize: 14,
      }}>
        <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#1e40af" }}>📌 複数取引所のCSVを同時にアップロード可能</p>
        <p style={{ margin: 0, color: "#334155" }}>
          当ツールでは、複数取引所のCSVファイルを一度に選択してアップロードできます。
          Coincheck と bitbank を両方使っている場合も、まとめて計算することが可能です。
        </p>
      </div>

      {/* Coincheck */}
      <h2 style={h2Style}>Coincheck のCSVダウンロード手順</h2>
      <div style={exchangeHeaderStyle}>
        <div style={{
          width: 40, height: 40,
          background: "#1c4ed8",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 800, fontSize: 14, flexShrink: 0,
        }}>C</div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>Coincheck（コインチェック）</p>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>国内最大級・取引量No.1</p>
        </div>
      </div>

      <div style={stepBox}>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={stepNumberStyle}>1</span>
          <p style={{ margin: 0, color: "#334155" }}>
            Coincheckにログインし、右上のアカウントアイコンから <strong>「取引履歴」</strong> または画面左側のメニューから <strong>「レポート」</strong> を選択します。
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={stepNumberStyle}>2</span>
          <p style={{ margin: 0, color: "#334155" }}>
            「取引履歴」ページで <strong>期間を選択</strong> します。複数年の取引がある場合は年ごとにダウンロードしてください。
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={stepNumberStyle}>3</span>
          <p style={{ margin: 0, color: "#334155" }}>
            <strong>「CSVダウンロード」</strong> ボタンをクリックするとCSVファイルがダウンロードされます。
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <span style={stepNumberStyle}>4</span>
          <p style={{ margin: 0, color: "#334155" }}>
            ダウンロードしたCSVファイルをそのまま当ツールにアップロードしてください。ファイル名の変更は不要です。
          </p>
        </div>
      </div>

      <div style={{
        background: "#fefce8",
        border: "1px solid #fde047",
        borderRadius: 8,
        padding: "12px 16px",
        marginBottom: 24,
        fontSize: 13,
        color: "#854d0e",
      }}>
        <strong>⚠️ 注意：</strong> Coincheckの取引履歴CSVは、通貨ペア（BTC/JPY、ETH/BTC など）ごとに別々に出力される場合があります。全通貨の取引履歴をダウンロードしてください。
      </div>

      {/* bitbank */}
      <h2 style={h2Style}>bitbank のCSVダウンロード手順</h2>
      <div style={exchangeHeaderStyle}>
        <div style={{
          width: 40, height: 40,
          background: "#0f766e",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 800, fontSize: 14, flexShrink: 0,
        }}>B</div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>bitbank（ビットバンク）</p>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>国内最多通貨数・充実のチャート</p>
        </div>
      </div>

      <div style={stepBox}>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={stepNumberStyle}>1</span>
          <p style={{ margin: 0, color: "#334155" }}>
            bitbankにログインし、画面右上のメニューから <strong>「マイページ」</strong> を開きます。
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={stepNumberStyle}>2</span>
          <p style={{ margin: 0, color: "#334155" }}>
            左側メニューの <strong>「取引履歴」</strong> をクリックします。
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={stepNumberStyle}>3</span>
          <p style={{ margin: 0, color: "#334155" }}>
            対象の通貨ペアと <strong>期間（年月）</strong> を選択し、<strong>「CSVダウンロード」</strong> をクリックします。
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <span style={stepNumberStyle}>4</span>
          <p style={{ margin: 0, color: "#334155" }}>
            全ての保有通貨・取引通貨ペアのCSVをダウンロードし、当ツールにまとめてアップロードしてください。
          </p>
        </div>
      </div>

      <div style={{
        background: "#fefce8",
        border: "1px solid #fde047",
        borderRadius: 8,
        padding: "12px 16px",
        marginBottom: 24,
        fontSize: 13,
        color: "#854d0e",
      }}>
        <strong>⚠️ 注意：</strong> bitbankは通貨ペアごとにCSVを出力します。BTC/JPYだけでなく、ETH/JPY、XRP/JPYなど取引した全ての通貨ペアをダウンロードしてください。複数のCSVファイルを当ツールに同時アップロードすることで、まとめて計算できます。
      </div>

      {/* SBI VC Trade */}
      <h2 style={h2Style}>SBI VC Trade のCSVダウンロード手順</h2>
      <div style={exchangeHeaderStyle}>
        <div style={{
          width: 40, height: 40,
          background: "#dc2626",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 800, fontSize: 12, flexShrink: 0,
        }}>SBI</div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>SBI VC Trade</p>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>SBIグループ・安心・信頼</p>
        </div>
      </div>

      <div style={stepBox}>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={stepNumberStyle}>1</span>
          <p style={{ margin: 0, color: "#334155" }}>
            SBI VC Tradeにログインし、上部メニューから <strong>「マイページ」</strong> を選択します。
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={stepNumberStyle}>2</span>
          <p style={{ margin: 0, color: "#334155" }}>
            <strong>「各種履歴照会」</strong> → <strong>「取引履歴」</strong> の順に進みます。
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 16 }}>
          <span style={stepNumberStyle}>3</span>
          <p style={{ margin: 0, color: "#334155" }}>
            対象期間を設定し、<strong>「CSVダウンロード」</strong> をクリックしてファイルを保存します。
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <span style={stepNumberStyle}>4</span>
          <p style={{ margin: 0, color: "#334155" }}>
            ダウンロードしたCSVをそのまま当ツールにアップロードしてください。
          </p>
        </div>
      </div>

      <h2 style={h2Style}>当ツールへのアップロード手順</h2>
      <p style={pStyle}>
        CSVをダウンロードしたら、以下の手順で当ツールに取り込みます。
      </p>
      <div style={stepBox}>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 14 }}>
          <span style={stepNumberStyle}>1</span>
          <p style={{ margin: 0, color: "#334155" }}>
            トップページの <strong>「① 計算方法を選ぶ」</strong> で「移動平均法」または「総平均法」を選択します。
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 14 }}>
          <span style={stepNumberStyle}>2</span>
          <p style={{ margin: 0, color: "#334155" }}>
            <strong>「② CSVファイルをアップロード」</strong> 欄に、ダウンロードしたCSVをドラッグ＆ドロップするか、クリックしてファイルを選択します。複数ファイルを同時に選択することも可能です。
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <span style={stepNumberStyle}>3</span>
          <p style={{ margin: 0, color: "#334155" }}>
            <strong>「③ 損益を計算する」</strong> ボタンを押すと、通貨ごとの損益と取引明細が表示されます。
          </p>
        </div>
      </div>

      <h3 style={h3Style}>よくある質問</h3>
      <div style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "20px 24px",
        fontSize: 14,
      }}>
        {[
          {
            q: "CSVが読み込まれない",
            a: "取引所の形式を当ツールが正しく判定できていない可能性があります。現在はCoincheck・bitbank・SBI VC Tradeの標準CSVフォーマットに対応しています。",
          },
          {
            q: "「対応取引所のリクエスト」から新しい取引所を依頼したい",
            a: "ページ下部の「対応取引所のリクエスト」フォームから依頼できます。取引履歴CSVを添付いただけると対応がスムーズになります。",
          },
          {
            q: "アップロードしたデータは保存・共有される？",
            a: "アップロードされたCSVデータは損益計算の処理にのみ使用され、サーバーには保存されません。ご安心ください。",
          },
        ].map(({ q, a }, i) => (
          <div key={i} style={{ marginBottom: i < 2 ? 20 : 0, paddingBottom: i < 2 ? 20 : 0, borderBottom: i < 2 ? "1px solid #e2e8f0" : "none" }}>
            <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#0f172a" }}>Q. {q}</p>
            <p style={{ margin: 0, color: "#475569" }}>A. {a}</p>
          </div>
        ))}
      </div>
    </ArticleLayout>
  );
}
