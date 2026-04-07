import { useState, useRef, useEffect } from "react";
import "./App.css";
import { createClient, type User } from "@supabase/supabase-js";

// Google AdSense の型定義
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

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

          <h3>5. 有料プランと決済について</h3>
          <p>本サービスでは有料プランを提供しています。決済処理はStripe, Inc.が提供する決済サービスを利用しており、クレジットカード情報等の決済情報は本サービスでは一切保管しません。決済に関する情報はStripeのプライバシーポリシーに基づいて管理されます。有料プランの加入状況は本サービスのデータベース上で管理します。</p>

          <h3>6. 免責事項</h3>
          <p>本サービスの計算結果は参考値であり、税務申告等の正式な書類としてそのまま使用することはできません。計算結果の正確性について本サービスは一切の責任を負いません。確定申告については税務署または税理士にご相談ください。</p>

          <h3>7. プライバシーポリシーの変更</h3>
          <p>本サービスは、必要に応じて本プライバシーポリシーを変更することがあります。変更後のポリシーは本ページに掲載した時点から効力を生じます。</p>

          <p className="modal-updated">最終更新日：2026年4月1日</p>
        </div>
      </div>
    </div>
  );
}

// ==================== Auth Modal ====================
function AuthModal({ onClose, onSuccess, onSignupAndPay }: { onClose: () => void; onSuccess: () => void; onSignupAndPay: (token?: string) => void }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) { setError("パスワードリセット用のメールアドレスを入力してください"); return; }
    setResetLoading(true); setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/forgot-password`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "メール送信に失敗しました。");
      } else {
        setResetSent(true);
      }
    } catch {
      setError("サーバーに接続できませんでした。しばらく待ってから再度お試しください。");
    }
    setResetLoading(false);
  };

  const handleLogin = async () => {
    if (!email || !password) { setError("メールアドレスとパスワードを入力してください"); return; }
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("メールアドレスまたはパスワードが正しくありません"); }
    else {
      // ログイン成功 → 有料会員かチェック
      if (data.user) {
        const { data: profile } = await supabase.from("user_profiles").select("is_paid, paid_until").eq("id", data.user.id).single();
        const isPaidUser = profile && profile.is_paid && profile.paid_until && new Date(profile.paid_until) > new Date();
        if (!isPaidUser) {
          // 未決済ユーザー → 決済ページへ
          onClose();
          onSignupAndPay(data.session?.access_token);
          setLoading(false);
          return;
        }
      }
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  const [signupDone, setSignupDone] = useState(false);

  const handleSignup = async () => {
    if (!email) { setError("メールアドレスを入力してください"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("正しいメールアドレスを入力してください"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "登録に失敗しました");
      } else {
        setSignupDone(true);
      }
    } catch {
      setError("サーバーに接続できませんでした。しばらく待ってから再度お試しください。");
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <p className="modal-title">{tab === "login" ? (showResetForm ? "パスワード再設定" : "ログイン") : "有料プラン登録（年間980円）"}</p>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {!showResetForm && (
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); }}>ログイン</button>
            <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setError(""); }}>新規登録</button>
          </div>
          )}
          <div className="auth-form">
            {/* ===== ログインタブ ===== */}
            {tab === "login" && !showResetForm && (
              <>
                <input className="exchange-input" type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="exchange-input" type="password" placeholder="パスワード" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                {error && <p className="exchange-error">{error}</p>}
                <button className="exchange-submit-btn" style={{ width: "100%" }} onClick={handleLogin} disabled={loading}>
                  {loading ? "処理中..." : "ログイン"}
                </button>
                <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 8 }}>
                  <button
                    onClick={() => { setShowResetForm(true); setError(""); setResetSent(false); }}
                    style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 12, textDecoration: "underline", padding: 0 }}
                  >
                    パスワードを忘れた場合
                  </button>
                </p>
              </>
            )}
            {/* ===== パスワードリセット画面 ===== */}
            {tab === "login" && showResetForm && (
              <>
                {resetSent ? (
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#16a34a", marginBottom: 8 }}>再設定メールを送信しました</p>
                    <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
                      <strong>{email}</strong> 宛にパスワード再設定メールを送信しました。<br />
                      メール内のリンクから新しいパスワードを設定してください。
                    </p>
                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 12 }}>メールが届かない場合は、迷惑メールフォルダをご確認ください。</p>
                    <button
                      className="exchange-submit-btn"
                      style={{ width: "100%", marginTop: 16, background: "#64748b" }}
                      onClick={() => { setShowResetForm(false); setResetSent(false); setError(""); }}
                    >
                      ログインに戻る
                    </button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 14, color: "#475569", marginBottom: 12, lineHeight: 1.6 }}>
                      登録済みのメールアドレスを入力してください。<br />パスワード再設定用のリンクをお送りします。
                    </p>
                    <input className="exchange-input" type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleForgotPassword()} />
                    {error && <p className="exchange-error">{error}</p>}
                    <button className="exchange-submit-btn" style={{ width: "100%" }} onClick={handleForgotPassword} disabled={resetLoading}>
                      {resetLoading ? "送信中..." : "再設定メールを送信"}
                    </button>
                    <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 8 }}>
                      <button
                        onClick={() => { setShowResetForm(false); setError(""); }}
                        style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 12, textDecoration: "underline", padding: 0 }}
                      >
                        ログインに戻る
                      </button>
                    </p>
                  </>
                )}
              </>
            )}
            {/* ===== 新規登録: メールアドレス入力 → 確認メール送信 ===== */}
            {tab === "signup" && (
              <>
                {signupDone ? (
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#16a34a", marginBottom: 8 }}>✅ 確認メールを送信しました</p>
                    <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>
                      <strong>{email}</strong> 宛にメールを送信しました。<br />
                      メール内のリンクからお支払いを完了すると、パスワード設定メールが届きます。
                    </p>
                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 12 }}>メールが届かない場合は、迷惑メールフォルダをご確認ください。</p>
                  </div>
                ) : (
                  <>
                    <input className="exchange-input" type="email" placeholder="メールアドレス" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSignup()} />
                    {error && <p className="exchange-error">{error}</p>}
                    <button className="exchange-submit-btn" style={{ width: "100%" }} onClick={handleSignup} disabled={loading}>
                      {loading ? "処理中..." : "登録する（確認メールを送信）"}
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          {tab === "signup" && !signupDone && (
            <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", marginTop: 12 }}>
              メールアドレスに決済リンクをお送りします
            </p>
          )}
          {tab === "login" && (
            <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 12 }}>
              有料プランに登録すると広告なしでご利用いただけます
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== Ad Countdown Modal ====================
function AdCountdownModal({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(10);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  // Google AdSense 広告を読み込む
  useEffect(() => {
    try {
      if (adRef.current && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // AdSense がまだ審査中の場合はエラーを無視
    }
  }, []);

  return (
    <div className="modal-overlay" style={{ zIndex: 200 }}>
      <div className="ad-modal">
        <p className="ad-modal-label">広告</p>
        <div className="ad-placeholder" ref={adRef}>
          {/* Google AdSense ディスプレイ広告 (レスポンシブ) */}
          <ins className="adsbygoogle"
            style={{ display: "block", width: "100%", minHeight: 250 }}
            data-ad-client="ca-pub-1593750663073581"
            data-ad-slot="auto"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
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
  const [escalated, setEscalated] = useState(false);
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
      if (res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply || "応答を取得できませんでした。" }]);
      } else {
        console.error("[Chat] Server error:", data);
        setMessages(prev => [...prev, { role: "assistant", content: data.detail || "サーバーエラーが発生しました。しばらく待ってから再度お試しください。" }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "接続エラーが発生しました。しばらく待ってから再度お試しください。" }]);
    }
    setLoading(false);
  };

  const escalate = async () => {
    if (escalated || messages.length < 2) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email || null;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/escalate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: messages,
            user_email: userEmail,
            category: "chat_escalation",
          }),
        }
      );
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.message || "開発者に報告しました。ご連絡ありがとうございます。"
      }]);
      setEscalated(true);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "送信に失敗しました。しばらく待ってから再度お試しください。"
      }]);
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
          {!escalated && messages.length >= 3 && (
            <div className="chat-escalate-row">
              <button
                className="chat-escalate-btn"
                onClick={escalate}
                disabled={loading}
              >
                📩 解決しない場合：開発者に連絡
              </button>
            </div>
          )}
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

// ==================== Password Reset Modal ====================
function PasswordResetModal({ onClose }: { onClose: () => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (!newPassword) { setError("新しいパスワードを入力してください"); return; }
    if (newPassword.length < 8) { setError("パスワードは8文字以上にしてください"); return; }
    if (newPassword !== confirmPassword) { setError("パスワードが一致しません"); return; }
    setLoading(true); setError("");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError("パスワードの更新に失敗しました。リンクの有効期限が切れている可能性があります。");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <p className="modal-title">パスワード設定</p>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ fontSize: 16, color: "#16a34a", fontWeight: 600, marginBottom: 12 }}>パスワードを設定しました</p>
              <p style={{ fontSize: 13, color: "#64748b" }}>このままサービスをご利用いただけます。</p>
              <button className="exchange-submit-btn" style={{ width: "100%", marginTop: 16 }} onClick={onClose}>
                閉じる
              </button>
            </div>
          ) : (
            <div className="auth-form">
              <input className="exchange-input" type="password" placeholder="新しいパスワード（8文字以上）" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <input className="exchange-input" type="password" placeholder="パスワード（確認）" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleReset()} />
              {error && <p className="exchange-error">{error}</p>}
              <button className="exchange-submit-btn" style={{ width: "100%" }} onClick={handleReset} disabled={loading}>
                {loading ? "処理中..." : "パスワードを設定"}
              </button>
            </div>
          )}
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

  // Auth
  const [user, setUser] = useState<User | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [paidUntil, setPaidUntil] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [pendingResult, setPendingResult] = useState<any>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchPaidStatus(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchPaidStatus(session.user.id);
      else setIsPaid(false);
      // パスワードリセットリンクからのリダイレクトを検知
      if (event === "PASSWORD_RECOVERY") {
        setShowPasswordReset(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchPaidStatus = async (userId: string) => {
    const { data } = await supabase.from("user_profiles").select("is_paid, paid_until").eq("id", userId).single();
    if (data) {
      const validUntil = data.paid_until ? new Date(data.paid_until) > new Date() : false;
      setIsPaid(data.is_paid && validUntil);
      setPaidUntil(data.paid_until || null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const [cancelLoading, setCancelLoading] = useState(false);

  const handleCancelSubscription = async () => {
    if (!confirm("有料プランを解約しますか？\n有効期限まで引き続きご利用いただけます。")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { alert("ログインしてください。"); return; }
    setCancelLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/cancel-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        alert(data.message || "解約を受け付けました。");
      } else {
        try {
          const data = await res.json();
          alert(data.detail || "解約処理に失敗しました。");
        } catch {
          alert(`解約処理に失敗しました。(${res.status})`);
        }
      }
    } catch {
      alert("サーバーに接続できませんでした。しばらく待ってから再度お試しください。");
    }
    setCancelLoading(false);
  };

  const handleUpgrade = async (tokenOverride?: string) => {
    let token = tokenOverride;
    if (!token) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setShowAuthModal(true); return; }
      token = session.access_token;
    }
    setUpgradeLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
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
      if (user) {
        fetchPaidStatus(user.id);
        // パスワード設定メールを送信（新規登録ユーザー向け）
        supabase.auth.resetPasswordForEmail(user.email || "", {
          redirectTo: window.location.origin,
        }).then(({ error }) => {
          if (error) {
            console.error("パスワード設定メール送信失敗:", error.message);
          } else {
            console.log("パスワード設定メール送信成功:", user.email);
          }
        });
      }
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
      // 認証トークンがあればヘッダーに付与（バックエンドでshow_ad判定に使用）
      const headers: Record<string, string> = {};
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/calculate`,
        { method: "POST", body: formData, headers }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "計算中にエラーが発生しました。CSVのフォーマットを確認してください。");
      } else {
        // バックエンドのshow_adフラグで広告表示を判定
        if (data.show_ad === false) {
          // 有料ユーザー：即座に結果表示
          setResult(data);
          setIsPaid(true);
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
    if (!isPaid) {
      alert("取引データのCSV出力は有料プラン（年間980円）の機能です。アップグレードしてご利用ください。");
      return;
    }
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

  const handlePDFDownload = async () => {
    if (!isPaid) {
      alert("PDF出力は有料プラン（年間980円）の機能です。アップグレードしてご利用ください。");
      return;
    }
    if (files.length === 0) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formData = new FormData();
      files.forEach(f => formData.append("files", f));
      formData.append("method", method);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/calculate/pdf`,
        {
          method: "POST",
          body: formData,
          headers: session?.access_token ? { "Authorization": `Bearer ${session.access_token}` } : {},
        }
      );
      if (!res.ok) {
        const data = await res.json();
        alert(data.detail || "PDF出力に失敗しました。");
      } else {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "crypto_tax_report.pdf";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      alert("サーバーに接続できませんでした。");
    }
    setLoading(false);
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
          <span className={`app-header-badge${isPaid ? " badge-premium" : ""}`}>{isPaid ? "Premium" : "無料"}</span>
          <div style={{ marginLeft: "auto" }}>
            {user ? (
              <div className="header-user">
                <span className="header-user-email">{isPaid ? `👑 有料プラン${paidUntil ? `（${new Date(paidUntil).toLocaleDateString("ja-JP")}まで）` : ""}` : "無料プラン"}</span>
                {!isPaid && (
                  <button
                    className="header-upgrade-btn"
                    onClick={() => handleUpgrade()}
                    disabled={upgradeLoading}
                  >
                    {upgradeLoading ? "処理中..." : "⬆️ アップグレード"}
                  </button>
                )}
                <button className="header-logout-btn" onClick={handleLogout}>ログアウト</button>
              </div>
            ) : (
              <button className="header-login-btn" onClick={() => setShowAuthModal(true)}>
                有料プランにログイン / 新規登録
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

            {/* Download Buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
              {isPaid ? (
                <>
                  <button className="csv-btn" onClick={handleCSVDownload}>
                    📥 取引データをCSVで出力
                  </button>
                  <button className="csv-btn" onClick={handlePDFDownload} disabled={loading}>
                    📄 損益計算書をPDFで出力
                  </button>
                </>
              ) : (
                <>
                  <button className="csv-btn csv-btn-locked" onClick={() => handleUpgrade()}>
                    🔒 取引データをCSVで出力（有料プラン）
                  </button>
                  <button className="csv-btn csv-btn-locked" onClick={() => handleUpgrade()}>
                    🔒 損益計算書をPDFで出力（有料プラン）
                  </button>
                </>
              )}
            </div>

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
          {user && isPaid && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #e2e8f0" }}>
              <button
                className="footer-link"
                style={{ fontSize: 11, color: "#94a3b8" }}
                onClick={handleCancelSubscription}
                disabled={cancelLoading}
              >
                {cancelLoading ? "処理中..." : "有料プランを解約する"}
              </button>
            </div>
          )}
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
          onSignupAndPay={handleUpgrade}
        />
      )}

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <PasswordResetModal onClose={() => setShowPasswordReset(false)} />
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
