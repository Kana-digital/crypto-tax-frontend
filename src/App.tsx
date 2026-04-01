import { useState, useRef, useEffect } from "react";
import "./App.css";
import { createClient, type User } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

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
          <p>本サービスは、利用者のプライバシーを尊重し、個人情報の保護に努めます。本サービスは暗号資産の損益計算を行う無料サービスです。</p>

          <h3>2. アップロードデータの取り扱い</h3>
          <p>利用者がアップロードするCSVファイルは、損益計算の処理のみに使用されます。アップロードされたデータはサーバーに保存されず、処理完了後に即座に破棄されます。本サービスはお客様の取引データを収集・保管・第三者提供しません。</p>

          <h3>3. アクセス解析ツール（Google Analytics）</h3>
          <p>本サービスはサービス改善のため、Google Analytics（GA4）を使用しています。Google Analyticsはトラフィックデータの収集のためにCookieを使用しており、このデータは匿名で収集されます。個人を特定する情報は含まれません。</p>
          <p>Cookieの使用を望まない場合は、ブラウザの設定からCookieを無効にすることができます。詳細は <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{color: "#2563eb"}}>Googleのプライバシーポリシー</a> をご確認ください。</p>

          <h3>4. 広告・アフィリエイトリンクについて</h3>
          <p>本サービスでは、暗号資産取引所へのアフィリエイトリンクを掲載しています（「PR」と表示）。アフィリエイトリンクを経由して口座開設が行われた場合、本サービスに報酬が支払われることがあります。利用者がリンクをクリックした場合、各取引所のプライバシーポリシーが適用されます。</p>

          <h3>5. 免責事項</h3>
          <p>本サービスの計算結果は参考値であり、税務申告等の正式な書類としてそのまま使用することはできません。計算結果の正確性について本サービスは一切の責任を負いません。確定申告については税務署または税理士にご相談ください。</p>

          <h3>6. プライバシーポリシーの変更</h3>
          <p>本サービスは、必要に応じて本プライバシーポリシーを変更することがあります。変更後のポリシーは本ページに掲載した時点から効力を生じます。</p>

          <p className="modal-updated">最終更新日：2026年4月1日</p>
        </div>
      </div>
    </div>
  );
}

// ==================== Auth Modal ====================
function AuthModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupDone, setSignupDone] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { setError("メールアドレスとパスワードを入力してください"); return; }
    if (password.length < 6) { setError("パスワードは6文字以上にしてください"); return; }
    setLoading(true); setError("");
    if (tab === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError("メールアドレスまたはパスワードが正しくありません"); }
      else { onSuccess(); onClose(); }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message.includes("already") ? "このメールアドレスは既に登録されています" : "登録に失敗しました"); }
      else { setSignupDone(true); }
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <p className="modal-title">ログイン / 新規登録</p>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {signupDone ? (
          <div className="auth-signup-done">
            <p>確認メールを送信しました。</p>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>メール内のリンクをクリックして登録を完了してください。</p>
          </div>
        ) : (
          <div className="modal-body">
            <div className="auth-tabs">
              <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); }}>ログイン</button>
              <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setError(""); }}>新規登録</button>
            </div>
            <div className="auth-form">
              <input className="exchange-input" type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="exchange-input" type="password" placeholder="パスワード（6文字以上）" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              {error && <p className="exchange-error">{error}</p>}
              <button className="exchange-submit-btn" style={{ width: "100%" }} onClick={handleSubmit} disabled={loading}>
                {loading ? "処理中..." : tab === "login" ? "ログイン" : "登録する"}
              </button>
            </div>
            {tab === "login" && (
              <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 12 }}>
                有料プランに登録すると広告なしでご利用いただけます
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Ad Countdown Modal ====================
function AdCountdownModal({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(10);

  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="modal-overlay" style={{ zIndex: 200 }}>
      <div className="ad-modal">
        <p className="ad-modal-label">広告</p>
        <div className="ad-placeholder">
          {/* Google AdSense 広告ユニットをここに配置予定 */}
          <p style={{ color: "#94a3b8", fontSize: 13 }}>広告スペース</p>
        </div>
        <div className="ad-countdown-row">
          {count > 0 ? (
            <span className="ad-countdown-text">{count}秒後にスキップできます</span>
          ) : (
            <button className="ad-skip-btn" onClick={onDone}>結果を見る →</button>
          )}
        </div>
        <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 8 }}>
          <button className="footer-link" style={{ fontSize: 11 }} onClick={onDone}>
            有料プランに登録すると広告なしで利用できます
          </button>
        </p>
      </div>
    </div>
  );
}

// ==================== Chat Support Widget ====================
interface ChatMsg { role: "user" | "assistant"; content: string; }

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "こんにちは！使い方のご質問や不具合のご報告はこちらからどうぞ😊" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages }),
        }
      );
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "応答を取得できませんでした。" }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "接続エラーが発生しました。しばらく待ってから再度お試しください。" }]);
    }
    setLoading(false);
  };

  return (
    <>
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <span>💬 サポート・不具合報告</span>
            <button className="chat-close-btn" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble assistant">
                <span className="chat-typing">●●●</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="メッセージを入力..."
              disabled={loading}
            />
            <button className="chat-send-btn" onClick={send} disabled={loading || !input.trim()}>
              送信
            </button>
          </div>
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen(o => !o)} aria-label="サポートチャット">
        {open ? "✕" : "💬"}
      </button>
    </>
  );
}

// ==================== Exchange Request ====================
interface ExchangeData {
  exchange_name: string;
  count: number;
  is_official: boolean;
}

function ExchangeRequestSection() {
  const [exchanges, setExchanges] = useState<ExchangeData[]>([]);
  const [newExchange, setNewExchange] = useState("");
  const [email, setEmail] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const csvInputRef = useRef<HTMLInputElement>(null);

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const fetchExchanges = () => {
    fetch(`${API}/exchange-requests`)
      .then(r => r.json())
      .then(data => setExchanges(data.exchanges || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const handleSubmit = async () => {
    if (!newExchange.trim() || !email.trim()) {
      setSubmitError("取引所名とメールアドレスを入力してください");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append("exchange_name", newExchange.trim());
      formData.append("email", email.trim());
      if (csvFile) formData.append("csv_file", csvFile);

      const res = await fetch(`${API}/request-exchange`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.detail || "送信に失敗しました");
      } else {
        setSubmitted(true);
        setNewExchange("");
        setEmail("");
        setCsvFile(null);
        fetchExchanges();
      }
    } catch {
      setSubmitError("通信エラーが発生しました。しばらく待ってから再度お試しください。");
    }
    setSubmitting(false);
  };

  return (
    <div className="exchange-request-section">
      <h3 className="exchange-request-title">🏦 対応取引所のリクエスト</h3>
      <p className="exchange-request-desc">
        希望する取引所をリクエストできます。<strong>3人</strong>がリクエストした取引所は<strong>対応予定</strong>に追加されます。取引履歴CSVを添付していただけると実装がスムーズになります。
      </p>

      {submitted ? (
        <div className="exchange-request-success">
          ✅ リクエストを受け付けました！ありがとうございます。
          <button className="exchange-again-btn" onClick={() => setSubmitted(false)}>別の取引所もリクエスト</button>
        </div>
      ) : (
        <div className="exchange-request-form">
          <input
            className="exchange-input"
            placeholder="取引所名（例：GMOコイン）"
            value={newExchange}
            onChange={e => setNewExchange(e.target.value)}
          />
          <input
            className="exchange-input"
            type="email"
            placeholder="メールアドレス（重複投票防止用・非公開）"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {/* CSV添付 */}
          <div className="exchange-csv-row">
            <button
              type="button"
              className="exchange-csv-btn"
              onClick={() => csvInputRef.current?.click()}
            >
              📎 取引履歴CSVを添付（任意）
            </button>
            {csvFile && (
              <span className="exchange-csv-name">
                {csvFile.name}
                <button className="exchange-csv-remove" onClick={() => setCsvFile(null)}>×</button>
              </span>
            )}
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={e => setCsvFile(e.target.files?.[0] || null)}
            />
          </div>
          {submitError && <p className="exchange-error">{submitError}</p>}
          <button className="exchange-submit-btn" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "送信中..." : "リクエストする"}
          </button>
        </div>
      )}

      {exchanges.length > 0 && (
        <div className="exchange-votes">
          <p className="exchange-votes-title">現在のリクエスト状況</p>
          {exchanges.map(ex => (
            <div key={ex.exchange_name} className="exchange-vote-row">
              <span className="exchange-vote-name">{ex.exchange_name}</span>
              <div className="exchange-vote-bar-wrap">
                <div
                  className="exchange-vote-bar"
                  style={{
                    width: `${Math.min(100, (ex.count / 3) * 100)}%`,
                    background: ex.is_official ? "#16a34a" : "#2563eb",
                  }}
                />
              </div>
              <span className="exchange-vote-count">{ex.count}/3</span>
              {ex.is_official && <span className="exchange-official-badge">実装予定✓</span>}
            </div>
          ))}
        </div>
      )}
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

  // Auth
  const [user, setUser] = useState<User | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [pendingResult, setPendingResult] = useState<any>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchPaidStatus(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchPaidStatus(session.user.id);
      else setIsPaid(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchPaidStatus = async (userId: string) => {
    const { data } = await supabase.from("user_profiles").select("is_paid, paid_until").eq("id", userId).single();
    if (data) {
      const validUntil = data.paid_until ? new Date(data.paid_until) > new Date() : false;
      setIsPaid(data.is_paid && validUntil);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleUpgrade = async () => {
    if (!user) { setShowAuthModal(true); return; }
    setUpgradeLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, email: user.email }),
        }
      );
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert("決済ページの取得に失敗しました。しばらく待ってから再度お試しください。");
      }
    } catch {
      alert("サーバーに接続できませんでした。");
    }
    setUpgradeLoading(false);
  };

  // 決済完了後のURLパラメータ処理
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setPaymentSuccess(true);
      window.history.replaceState({}, "", "/");
      // 有料ステータスを再取得
      if (user) fetchPaidStatus(user.id);
    }
  }, [user]);

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
        if (user && isPaid) {
          // 有料ユーザー：即座に結果表示
          setResult(data);
          setTimeout(() => {
            document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        } else {
          // 無料ユーザー：広告を見てから結果表示
          setPendingResult(data);
          setShowAdModal(true);
        }
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
          <div style={{ marginLeft: "auto" }}>
            {user ? (
              <div className="header-user">
                <span className="header-user-email">{isPaid ? "👑 有料プラン" : "無料プラン"}</span>
                {!isPaid && (
                  <button
                    className="header-upgrade-btn"
                    onClick={handleUpgrade}
                    disabled={upgradeLoading}
                  >
                    {upgradeLoading ? "処理中..." : "⬆️ アップグレード"}
                  </button>
                )}
                <button className="header-logout-btn" onClick={handleLogout}>ログアウト</button>
              </div>
            ) : (
              <button className="header-login-btn" onClick={() => setShowAuthModal(true)}>
                有料プランへ登録
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-container">
        {/* 決済成功バナー */}
        {paymentSuccess && (
          <div className="payment-success-banner">
            🎉 有料プランへのアップグレードが完了しました！広告なしでご利用いただけます。
            <button onClick={() => setPaymentSuccess(false)} className="banner-close">✕</button>
          </div>
        )}

        {/* Page Title */}
        <h1 className="page-title">暗号資産の損益をかんたんシュミレーション</h1>
        <p className="page-subtitle">取引履歴のCSVをアップロードすると、損益をシュミレーションできます</p>
        <p className="page-subtitle-paid">なお、有料プランに登録いただくと損益計算結果CSVを出力できます。損益計算結果CSVを取り込んで損益計算を行うことができます。また、有料プランには広告が表示されないため、ストレスフリーで作業できます。</p>
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
            <option value="total_average">総平均法</option>
            <option value="moving_average">移動平均法</option>
          </select>
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
            <li>本サービスの計算結果は参考値であり、実際の確定申告の根拠としてそのまま使用することはできません。</li>
            <li>取引内容によっては正確な計算が行えない場合があります。税務申告については税務署または税理士にご相談ください。</li>
            <li>本サービスの利用により生じた損害について、本サービスは一切の責任を負いません。</li>
          </ol>
        </div>

        {/* Affiliate */}
        <div className="affiliate-section">
          <div className="affiliate-header">
            <p className="affiliate-title">おすすめ暗号資産取引所</p>
            <span className="pr-badge">広告（PR）</span>
          </div>
          <p className="affiliate-disclosure">※本セクションはアフィリエイト広告を含みます。口座開設により報酬を受け取る場合があります。</p>
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

        {/* Exchange Request */}
        <ExchangeRequestSection />

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
            {isPaid ? (
              <button className="csv-btn" onClick={handleCSVDownload}>
                📥 取引データをCSVで出力
              </button>
            ) : (
              <button className="csv-btn" onClick={() => setShowAdModal(true)}>
                📥 取引データをCSVで出力（有料プランで利用可能）
              </button>
            )}

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
              プライバシーポリシー・免責事項
            </button>
          </div>
          <p className="footer-copy">© 2026 暗号資産損益計算ツール. All rights reserved.</p>
        </div>
      </footer>

      {/* Privacy Modal */}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}

      {/* Ad Countdown Modal */}
      {showAdModal && (
        <AdCountdownModal
          onDone={() => {
            setShowAdModal(false);
            setResult(pendingResult);
            setPendingResult(null);
            setTimeout(() => {
              document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          }}
        />
      )}

      {/* Chat Support Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
