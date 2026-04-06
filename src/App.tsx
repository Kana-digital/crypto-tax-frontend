import { useState, useRef, useEffect } from "react";
import "./App.css";
import { createClient, type User } from "@supabase/supabase-js";

// Google AdSense ã®åå®ç¾©
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
          <p className="modal-title">ãã©ã¤ãã·ã¼ããªã·ã¼</p>
          <button className="modal-close" onClick={onClose} aria-label="éãã">â</button>
        </div>
        <div className="modal-body">
          <h3>1. åºæ¬æ¹é</h3>
          <p>æ¬ãµã¼ãã¹ã¯ãå©ç¨èã®ãã©ã¤ãã·ã¼ãå°éããåäººæå ±ã®ä¿è­·ã«åªãã¾ããæ¬ãµã¼ãã¹ã¯æå·è³ç£ã®æçè¨ç®ãè¡ãç¡æãµã¼ãã¹ã§ãã</p>

          <h3>2. ã¢ããã­ã¼ããã¼ã¿ã®åãæ±ã</h3>
          <p>å©ç¨èãã¢ããã­ã¼ãããCSVãã¡ã¤ã«ã¯ãæçè¨ç®ã®å¦çã®ã¿ã«ä½¿ç¨ããã¾ããã¢ããã­ã¼ãããããã¼ã¿ã¯ãµã¼ãã¼ã«ä¿å­ããããå¦çå®äºå¾ã«å³åº§ã«ç ´æ£ããã¾ããæ¬ãµã¼ãã¹ã¯ãå®¢æ§ã®åå¼ãã¼ã¿ãåéã»ä¿ç®¡ã»ç¬¬ä¸èæä¾ãã¾ããã</p>

          <h3>3. ã¢ã¯ã»ã¹è§£æãã¼ã«ï¼Google Analyticsï¼</h3>
          <p>æ¬ãµã¼ãã¹ã¯ãµã¼ãã¹æ¹åã®ãããGoogle Analyticsï¼GA4ï¼ãä½¿ç¨ãã¦ãã¾ããGoogle Analyticsã¯ãã©ãã£ãã¯ãã¼ã¿ã®åéã®ããã«Cookieãä½¿ç¨ãã¦ããããã®ãã¼ã¿ã¯å¿åã§åéããã¾ããåäººãç¹å®ããæå ±ã¯å«ã¾ãã¾ããã</p>
          <p>Cookieã®ä½¿ç¨ãæã¾ãªãå ´åã¯ããã©ã¦ã¶ã®è¨­å®ããCookieãç¡å¹ã«ãããã¨ãã§ãã¾ããè©³ç´°ã¯ <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{color: "#2563eb"}}>Googleã®ãã©ã¤ãã·ã¼ããªã·ã¼</a> ããç¢ºèªãã ããã</p>

          <h3>4. åºåã»ã¢ãã£ãªã¨ã¤ããªã³ã¯ã«ã¤ãã¦</h3>
          <p>æ¬ãµã¼ãã¹ã§ã¯ãæå·è³ç£åå¼æã¸ã®ã¢ãã£ãªã¨ã¤ããªã³ã¯ãæ²è¼ãã¦ãã¾ãï¼ãPRãã¨è¡¨ç¤ºï¼ãã¢ãã£ãªã¨ã¤ããªã³ã¯ãçµç±ãã¦å£åº§éè¨­ãè¡ãããå ´åãæ¬ãµã¼ãã¹ã«å ±é¬ãæ¯æããããã¨ãããã¾ããå©ç¨èããªã³ã¯ãã¯ãªãã¯ããå ´åãååå¼æã®ãã©ã¤ãã·ã¼ããªã·ã¼ãé©ç¨ããã¾ãã</p>

          <h3>5. ææãã©ã³ã¨æ±ºæ¸ã«ã¤ãã¦</h3>
          <p>æ¬ãµã¼ãã¹ã§ã¯ææãã©ã³ãæä¾ãã¦ãã¾ããæ±ºæ¸å¦çã¯Stripe, Inc.ãæä¾ããæ±ºæ¸ãµã¼ãã¹ãå©ç¨ãã¦ãããã¯ã¬ã¸ããã«ã¼ãæå ±ç­ã®æ±ºæ¸æå ±ã¯æ¬ãµã¼ãã¹ã§ã¯ä¸åä¿ç®¡ãã¾ãããæ±ºæ¸ã«é¢ããæå ±ã¯Stripeã®ãã©ã¤ãã·ã¼ããªã·ã¼ã«åºã¥ãã¦ç®¡çããã¾ããææãã©ã³ã®å å¥ç¶æ³ã¯æ¬ãµã¼ãã¹ã®ãã¼ã¿ãã¼ã¹ä¸ã§ç®¡çãã¾ãã</p>

          <h3>6. åè²¬äºé </h3>
          <p>æ¬ãµã¼ãã¹ã®è¨ç®çµæã¯åèå¤ã§ãããç¨åç³åç­ã®æ­£å¼ãªæ¸é¡ã¨ãã¦ãã®ã¾ã¾ä½¿ç¨ãããã¨ã¯ã§ãã¾ãããè¨ç®çµæã®æ­£ç¢ºæ§ã«ã¤ãã¦æ¬ãµã¼ãã¹ã¯ä¸åã®è²¬ä»»ãè² ãã¾ãããç¢ºå®ç³åã«ã¤ãã¦ã¯ç¨åç½²ã¾ãã¯ç¨çå£«ã«ãç¸è«ãã ããã</p>

          <h3>7. ãã©ã¤ãã·ã¼ããªã·ã¼ã®å¤æ´</h3>
          <p>æ¬ãµã¼ãã¹ã¯ãå¿è¦ã«å¿ãã¦æ¬ãã©ã¤ãã·ã¼ããªã·ã¼ãå¤æ´ãããã¨ãããã¾ããå¤æ´å¾ã®ããªã·ã¼ã¯æ¬ãã¼ã¸ã«æ²è¼ããæç¹ããå¹åãçãã¾ãã</p>

          <p className="modal-updated">æçµæ´æ°æ¥ï¼2026å¹´4æ1æ¥</p>
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

  const handleLogin = async () => {
    if (!email || !password) { setError("ã¡ã¼ã«ã¢ãã¬ã¹ã¨ãã¹ã¯ã¼ããå¥åãã¦ãã ãã"); return; }
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("ã¡ã¼ã«ã¢ãã¬ã¹ã¾ãã¯ãã¹ã¯ã¼ããæ­£ããããã¾ãã"); }
    else {
      // ã­ã°ã¤ã³æå â ææä¼å¡ããã§ãã¯
      if (data.user) {
        const { data: profile } = await supabase.from("user_profiles").select("is_paid, paid_until").eq("id", data.user.id).single();
        const isPaidUser = profile && profile.is_paid && profile.paid_until && new Date(profile.paid_until) > new Date();
        if (!isPaidUser) {
          // æªæ±ºæ¸ã¦ã¼ã¶ã¼ â æ±ºæ¸ãã¼ã¸ã¸
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

  const handleSignup = async () => {
    if (!email) { setError("ã¡ã¼ã«ã¢ãã¬ã¹ãå¥åãã¦ãã ãã"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("æ­£ããã¡ã¼ã«ã¢ãã¬ã¹ãå¥åãã¦ãã ãã"); return; }
    setLoading(true); setError("");
    // ã©ã³ãã ãã¹ã¯ã¼ãã§ã¢ã«ã¦ã³ãä½æï¼æ±ºæ¸å¾ã«ãã¹ã¯ã¼ãè¨­å®ã¡ã¼ã«ãéä¿¡ï¼
    const tempPassword = crypto.randomUUID().replace(/-/g, "").slice(0, 16) + "Aa1!";
    const { data, error } = await supabase.auth.signUp({ email, password: tempPassword });
    if (error) { setError(error.message.includes("already") ? "ãã®ã¡ã¼ã«ã¢ãã¬ã¹ã¯æ¢ã«ç»é²ããã¦ãã¾ããã­ã°ã¤ã³ã¿ãããã­ã°ã¤ã³ãã¦ãã ããã" : "ç»é²ã«å¤±æãã¾ãã"); }
    else if (data.user && data.user.identities && data.user.identities.length === 0) {
      setError("ãã®ã¡ã¼ã«ã¢ãã¬ã¹ã¯æ¢ã«ç»é²ããã¦ãã¾ããã­ã°ã¤ã³ã¿ãããã­ã°ã¤ã³ãã¦ãã ããã");
    }
    else {
      // ã¢ã«ã¦ã³ãä½ææå â æ±ºæ¸ãã¼ã¸ã¸ç´æ¥é·ç§»
      const accessToken = data.session?.access_token;
      onClose();
      onSignupAndPay(accessToken);
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <p className="modal-title">{tab === "login" ? "ã­ã°ã¤ã³" : "ææãã©ã³ç»é²ï¼å¹´é980åï¼"}</p>
          <button className="modal-close" onClick={onClose}>â</button>
        </div>
        <div className="modal-body">
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); }}>ã­ã°ã¤ã³</button>
            <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setError(""); }}>æ°è¦ç»é²</button>
          </div>
          <div className="auth-form">
            {/* ===== ã­ã°ã¤ã³ã¿ã ===== */}
            {tab === "login" && (
              <>
                <input className="exchange-input" type="email" placeholder="ã¡ã¼ã«ã¢ãã¬ã¹" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="exchange-input" type="password" placeholder="ãã¹ã¯ã¼ã" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
                {error && <p className="exchange-error">{error}</p>}
                <button className="exchange-submit-btn" style={{ width: "100%" }} onClick={handleLogin} disabled={loading}>
                  {loading ? "å¦çä¸­..." : "ã­ã°ã¤ã³"}
                </button>
              </>
            )}
            {/* ===== æ°è¦ç»é²: ã¡ã¼ã«ã¢ãã¬ã¹ã®ã¿ â å³æ±ºæ¸ ===== */}
            {tab === "signup" && (
              <>
                <input className="exchange-input" type="email" placeholder="ã¡ã¼ã«ã¢ãã¬ã¹" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSignup()} />
                {error && <p className="exchange-error">{error}</p>}
                <button className="exchange-submit-btn" style={{ width: "100%" }} onClick={handleSignup} disabled={loading}>
                  {loading ? "å¦çä¸­..." : "æ±ºæ¸ã«é²ã"}
                </button>
              </>
            )}
          </div>
          {tab === "signup" && (
            <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", marginTop: 12 }}>
              æ±ºæ¸å®äºå¾ããã¹ã¯ã¼ãè¨­å®ã¡ã¼ã«ããéããã¾ã
            </p>
          )}
          {tab === "login" && (
            <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 12 }}>
              ææãã©ã³ã«ç»é²ããã¨åºåãªãã§ãå©ç¨ããã ãã¾ã
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

  // Google AdSense åºåãèª­ã¿è¾¼ã
  useEffect(() => {
    try {
      if (adRef.current && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // AdSense ãã¾ã å¯©æ»ä¸­ã®å ´åã¯ã¨ã©ã¼ãç¡è¦
    }
  }, []);

  return (
    <div className="modal-overlay" style={{ zIndex: 200 }}>
      <div className="ad-modal">
        <p className="ad-modal-label">åºå</p>
        <div className="ad-placeholder" ref={adRef}>
          {/* Google AdSense ãã£ã¹ãã¬ã¤åºå (ã¬ã¹ãã³ã·ã) */}
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
            <span className="ad-countdown-text">{count}ç§å¾ã«ã¹ã­ããã§ãã¾ã</span>
          ) : (
            <button className="ad-skip-btn" onClick={onDone}>çµæãè¦ã â</button>
          )}
        </div>
        <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 8 }}>
          <button className="footer-link" style={{ fontSize: 11 }} onClick={onDone}>
            ææãã©ã³ã«ç»é²ããã¨åºåãªãã§å©ç¨ã§ãã¾ã
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
    { role: "assistant", content: "ããã«ã¡ã¯ï¼ä½¿ãæ¹ã®ãè³ªåãä¸å·åã®ãå ±åã¯ãã¡ãããã©ããð" }
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
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "å¿ç­ãåå¾ã§ãã¾ããã§ããã" }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "æ¥ç¶ã¨ã©ã¼ãçºçãã¾ããããã°ããå¾ã£ã¦ããååº¦ãè©¦ããã ããã" }]);
    }
    setLoading(false);
  };

  return (
    <>
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <span>ð¬ ãµãã¼ãã»ä¸å·åå ±å</span>
            <button className="chat-close-btn" onClick={() => setOpen(false)}>â</button>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble assistant">
                <span className="chat-typing">âââ</span>
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
              placeholder="ã¡ãã»ã¼ã¸ãå¥å..."
              disabled={loading}
            />
            <button className="chat-send-btn" onClick={send} disabled={loading || !input.trim()}>
              éä¿¡
            </button>
          </div>
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen(o => !o)} aria-label="ãµãã¼ããã£ãã">
        {open ? "â" : "ð¬"}
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
      setSubmitError("åå¼æåã¨ã¡ã¼ã«ã¢ãã¬ã¹ãå¥åãã¦ãã ãã");
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
        setSubmitError(data.detail || "éä¿¡ã«å¤±æãã¾ãã");
      } else {
        setSubmitted(true);
        setNewExchange("");
        setEmail("");
        setCsvFile(null);
        fetchExchanges();
      }
    } catch {
      setSubmitError("éä¿¡ã¨ã©ã¼ãçºçãã¾ããããã°ããå¾ã£ã¦ããååº¦ãè©¦ããã ããã");
    }
    setSubmitting(false);
  };

  return (
    <div className="exchange-request-section">
      <h3 className="exchange-request-title">ð¦ å¯¾å¿åå¼æã®ãªã¯ã¨ã¹ã</h3>
      <p className="exchange-request-desc">
        å¸æããåå¼æããªã¯ã¨ã¹ãã§ãã¾ãã<strong>3äºº</strong>ããªã¯ã¨ã¹ãããåå¼æã¯<strong>å¯¾å¿äºå®</strong>ã«è¿½å ããã¾ããåå¼å±¥æ­´CSVãæ·»ä»ãã¦ããã ããã¨å®è£ãã¹ã ã¼ãºã«ãªãã¾ãã
      </p>

      {submitted ? (
        <div className="exchange-request-success">
          â ãªã¯ã¨ã¹ããåãä»ãã¾ããï¼ãããã¨ããããã¾ãã
          <button className="exchange-again-btn" onClick={() => setSubmitted(false)}>å¥ã®åå¼æããªã¯ã¨ã¹ã</button>
        </div>
      ) : (
        <div className="exchange-request-form">
          <input
            className="exchange-input"
            placeholder="åå¼æåï¼ä¾ï¼GMOã³ã¤ã³ï¼"
            value={newExchange}
            onChange={e => setNewExchange(e.target.value)}
          />
          <input
            className="exchange-input"
            type="email"
            placeholder="ã¡ã¼ã«ã¢ãã¬ã¹ï¼éè¤æç¥¨é²æ­¢ç¨ã»éå¬éï¼"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {/* CSVæ·»ä» */}
          <div className="exchange-csv-row">
            <button
              type="button"
              className="exchange-csv-btn"
              onClick={() => csvInputRef.current?.click()}
            >
              ð åå¼å±¥æ­´CSVãæ·»ä»ï¼ä»»æï¼
            </button>
            {csvFile && (
              <span className="exchange-csv-name">
                {csvFile.name}
                <button className="exchange-csv-remove" onClick={() => setCsvFile(null)}>Ã</button>
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
            {submitting ? "éä¿¡ä¸­..." : "ãªã¯ã¨ã¹ããã"}
          </button>
        </div>
      )}

      {exchanges.length > 0 && (
        <div className="exchange-votes">
          <p className="exchange-votes-title">ç¾å¨ã®ãªã¯ã¨ã¹ãç¶æ³</p>
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
              {ex.is_official && <span className="exchange-official-badge">å®è£äºå®â</span>}
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

  const [cancelLoading, setCancelLoading] = useState(false);

  const handleCancelSubscription = async () => {
    if (!confirm("ææãã©ã³ãè§£ç´ãã¾ããï¼\næå¹æéã¾ã§å¼ãç¶ããå©ç¨ããã ãã¾ãã")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { alert("ã­ã°ã¤ã³ãã¦ãã ããã"); return; }
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
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "è§£ç´ãåãä»ãã¾ããã");
      } else {
        alert(data.detail || "è§£ç´å¦çã«å¤±æãã¾ããã");
      }
    } catch {
      alert("ãµã¼ãã¼ã«æ¥ç¶ã§ãã¾ããã§ããã");
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
        alert("æ±ºæ¸ãã¼ã¸ã®åå¾ã«å¤±æãã¾ããããã°ããå¾ã£ã¦ããååº¦ãè©¦ããã ããã");
      }
    } catch {
      alert("ãµã¼ãã¼ã«æ¥ç¶ã§ãã¾ããã§ããã");
    }
    setUpgradeLoading(false);
  };

  // æ±ºæ¸å®äºå¾ã®URLãã©ã¡ã¼ã¿å¦ç
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setPaymentSuccess(true);
      window.history.replaceState({}, "", "/");
      // ææã¹ãã¼ã¿ã¹ãååå¾
      if (user) {
        fetchPaidStatus(user.id);
        // ãã¹ã¯ã¼ãè¨­å®ã¡ã¼ã«ãéä¿¡ï¼æ°è¦ç»é²ã¦ã¼ã¶ã¼åãï¼
        supabase.auth.resetPasswordForEmail(user.email || "", {
          redirectTo: window.location.origin,
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
      setError("CSVãã¡ã¤ã«ã1ã¤ä»¥ä¸é¸æãã¦ãã ãã");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    formData.append("method", method);
    try {
      // èªè¨¼ãã¼ã¯ã³ãããã°ãããã¼ã«ä»ä¸ï¼ããã¯ã¨ã³ãã§show_adå¤å®ã«ä½¿ç¨ï¼
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
        setError(data.detail || "è¨ç®ä¸­ã«ã¨ã©ã¼ãçºçãã¾ãããCSVã®ãã©ã¼ããããç¢ºèªãã¦ãã ããã");
      } else {
        // ããã¯ã¨ã³ãã®show_adãã©ã°ã§åºåè¡¨ç¤ºãå¤å®
        if (data.show_ad === false) {
          // ææã¦ã¼ã¶ã¼ï¼å³åº§ã«çµæè¡¨ç¤º
          setResult(data);
          setIsPaid(true);
          setTimeout(() => {
            document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        } else {
          // ç¡æã¦ã¼ã¶ã¼ï¼åºåãè¦ã¦ããçµæè¡¨ç¤º
          setPendingResult(data);
          setShowAdModal(true);
        }
      }
    } catch {
      setError("ãµã¼ãã¼ã«æ¥ç¶ã§ãã¾ããã§ããããã°ããå¾ã£ã¦ããååº¦ãè©¦ããã ããã");
    }
    setLoading(false);
  };

  // å¹´å¥æçéè¨
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
      alert("åå¼ãã¼ã¿ã®CSVåºåã¯ææãã©ã³ï¼å¹´é980åï¼ã®æ©è½ã§ããã¢ããã°ã¬ã¼ããã¦ãå©ç¨ãã ããã");
      return;
    }
    const header = "åå¼æ¥æ,åå¼æ,å£²è²·,éè²¨,æ°é,åä¾¡(å),ææ°æ";
    const rows = result.raw_trades.map((t: any) =>
      `${t.datetime},${t.exchange},${t.action},${t.currency},${t.amount},${t.price},${t.fee}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "åå¼ãã¼ã¿.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePDFDownload = async () => {
    if (!isPaid) {
      alert("PDFåºåã¯ææãã©ã³ï¼å¹´é980åï¼ã®æ©è½ã§ããã¢ããã°ã¬ã¼ããã¦ãå©ç¨ãã ããã");
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
        alert(data.detail || "PDFåºåã«å¤±æãã¾ããã");
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
      alert("ãµã¼ãã¼ã«æ¥ç¶ã§ãã¾ããã§ããã");
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
          <div className="app-header-logo">â¿</div>
          <span className="app-header-title">æå·è³ç£æçè¨ç®ãã¼ã«</span>
          <span className={`app-header-badge${isPaid ? " badge-premium" : ""}`}>{isPaid ? "Premium" : "ç¡æ"}</span>
          <div style={{ marginLeft: "auto" }}>
            {user ? (
              <div className="header-user">
                <span className="header-user-email">{isPaid ? "ð ææãã©ã³" : "ç¡æãã©ã³"}</span>
                {!isPaid && (
                  <button
                    className="header-upgrade-btn"
                    onClick={() => handleUpgrade()}
                    disabled={upgradeLoading}
                  >
                    {upgradeLoading ? "å¦çä¸­..." : "â¬ï¸ ã¢ããã°ã¬ã¼ã"}
                  </button>
                )}
                <button className="header-logout-btn" onClick={handleLogout}>ã­ã°ã¢ã¦ã</button>
              </div>
            ) : (
              <button className="header-login-btn" onClick={() => setShowAuthModal(true)}>
                ææãã©ã³ã¸ç»é²
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-container">
        {/* æ±ºæ¸æåããã¼ */}
        {paymentSuccess && (
          <div className="payment-success-banner">
            ð ææãã©ã³ã¸ã®ã¢ããã°ã¬ã¼ããå®äºãã¾ããï¼åºåãªãã§ãå©ç¨ããã ãã¾ãã
            <button onClick={() => setPaymentSuccess(false)} className="banner-close">â</button>
          </div>
        )}

        {/* Page Title */}
        <h1 className="page-title">æå·è³ç£ã®æçãããããã·ã¥ãã¬ã¼ã·ã§ã³</h1>
        <p className="page-subtitle">åå¼å±¥æ­´ã®CSVãã¢ããã­ã¼ãããã¨ãæçãã·ã¥ãã¬ã¼ã·ã§ã³ã§ãã¾ã</p>
        <p className="page-subtitle-paid">ãªããææãã©ã³ã«ç»é²ããã ãã¨æçè¨ç®çµæCSVãåºåã§ãã¾ããæçè¨ç®çµæCSVãåãè¾¼ãã§æçè¨ç®ãè¡ããã¨ãã§ãã¾ããã¾ããææãã©ã³ã«ã¯åºåãè¡¨ç¤ºãããªããããã¹ãã¬ã¹ããªã¼ã§ä½æ¥­ã§ãã¾ãã</p>
        <p className="page-exchanges">å¯¾å¿åå¼æï¼Coincheckã»SBI VC Tradeã»bitbank</p>

        {/* Step 1: è¨ç®æ¹æ³ */}
        <div className="card">
          <label className="card-label" htmlFor="method-select">â  è¨ç®æ¹æ³ãé¸ã¶</label>
          <select
            id="method-select"
            className="method-select"
            value={method}
            onChange={e => setMethod(e.target.value)}
          >
            <option value="total_average">ç·å¹³åæ³</option>
            <option value="moving_average">ç§»åå¹³åæ³</option>
          </select>
        </div>

        {/* Step 2: ãã¡ã¤ã«ã¢ããã­ã¼ã */}
        <div className="card">
          <label className="card-label">â¡ CSVãã¡ã¤ã«ãã¢ããã­ã¼ã</label>
          <div
            className={`file-drop-area${dragging ? " dragging" : ""}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <div className="file-drop-icon">ð</div>
            <p className="file-drop-text">
              ã¯ãªãã¯ãã¦ãã¡ã¤ã«ãé¸æ<br />
              ã¾ãã¯ãã©ãã°ï¼ãã­ãã
            </p>
            <p className="file-drop-hint">è¤æ°ã®CSVãã¡ã¤ã«ãä¸åº¦ã«é¸æã§ãã¾ã</p>
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
                  <span>ð {f.name}</span>
                  <button
                    className="file-remove-btn"
                    onClick={() => removeFile(f.name)}
                    aria-label={`${f.name}ãåé¤`}
                  >
                    Ã
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="error-message">
            <span>â ï¸</span>
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />
              è¨ç®ä¸­...
            </>
          ) : (
            "â¢ æçãè¨ç®ãã"
          )}
        </button>

        {/* Notice */}
        <div className="notice-box" style={{ marginTop: 16 }}>
          <p className="notice-box-title">â ï¸ æ³¨æäºé </p>
          <ol>
            <li>æ¬ãµã¼ãã¹ã®è¨ç®çµæã¯åèå¤ã§ãããå®éã®ç¢ºå®ç³åã®æ ¹æ ã¨ãã¦ãã®ã¾ã¾ä½¿ç¨ãããã¨ã¯ã§ãã¾ããã</li>
            <li>åå¼åå®¹ã«ãã£ã¦ã¯æ­£ç¢ºãªè¨ç®ãè¡ããªãå ´åãããã¾ããç¨åç³åã«ã¤ãã¦ã¯ç¨åç½²ã¾ãã¯ç¨çå£«ã«ãç¸è«ãã ããã</li>
            <li>æ¬ãµã¼ãã¹ã®å©ç¨ã«ããçããæå®³ã«ã¤ãã¦ãæ¬ãµã¼ãã¹ã¯ä¸åã®è²¬ä»»ãè² ãã¾ããã</li>
          </ol>
        </div>

        {/* Affiliate */}
        <div className="affiliate-section">
          <div className="affiliate-header">
            <p className="affiliate-title">ããããæå·è³ç£åå¼æ</p>
            <span className="pr-badge">åºåï¼PRï¼</span>
          </div>
          <p className="affiliate-disclosure">â»æ¬ã»ã¯ã·ã§ã³ã¯ã¢ãã£ãªã¨ã¤ãåºåãå«ã¿ã¾ããå£åº§éè¨­ã«ããå ±é¬ãåãåãå ´åãããã¾ãã</p>
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
                <div className="affiliate-desc">å½åæå¤§ç´<br />å£åº§éè¨­ç¡æ</div>
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
                <div className="affiliate-desc">å½åæå¤éè²¨<br />åå®ã®ãã£ã¼ã</div>
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
                <div className="affiliate-desc">SBIã°ã«ã¼ã<br />å®å¿ã»ä¿¡é ¼</div>
              </div>
            </a>
          </div>
        </div>

        {/* Exchange Request */}
        <ExchangeRequestSection />

        {/* Result */}
        {result && (
          <div className="result-section" id="result-section">
            <h2 className="result-section-title">è¨ç®çµæ</h2>

            {/* Summary */}
            <div className="result-summary">
              <p className="result-summary-label">åè¨æç</p>
              <div className="result-grid-header">
                <span></span>
                <span style={{ textAlign: "right" }}>åå¥éé¡</span>
                <span style={{ textAlign: "right" }}>åå¾ä¾¡é¡</span>
                <span style={{ textAlign: "right" }}>æç</span>
              </div>
              {Object.entries(byYear).sort().map(([year, v]: [string, any]) => (
                <div key={year} className="result-grid-row">
                  <span className="result-year">{year}å¹´</span>
                  <span className="result-amount">{Math.round(v.income).toLocaleString("ja-JP")} å</span>
                  <span className="result-amount">{Math.round(v.cost).toLocaleString("ja-JP")} å</span>
                  <span className={`result-profit ${v.profit >= 0 ? "positive" : "negative"}`}>
                    {v.profit >= 0 ? "+" : ""}{Math.round(v.profit).toLocaleString("ja-JP")} å
                  </span>
                </div>
              ))}
              <div className="result-grid-total">
                <span className="result-total-label">åè¨</span>
                <span className="result-amount" style={{ fontSize: 14 }}>
                  {Math.round(result.trades.reduce((s: number, t: any) => s + t.sell_price * t.amount, 0)).toLocaleString("ja-JP")} å
                </span>
                <span className="result-amount" style={{ fontSize: 14 }}>
                  {Math.round(result.trades.reduce((s: number, t: any) => s + t.avg_buy_price * t.amount, 0)).toLocaleString("ja-JP")} å
                </span>
                <span
                  className={`result-total-profit result-profit ${result.total_profit >= 0 ? "positive" : "negative"}`}
                >
                  {result.total_profit >= 0 ? "+" : ""}
                  {Math.round(result.total_profit).toLocaleString("ja-JP")} å
                </span>
              </div>
            </div>

            {/* Download Buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0" }}>
              {isPaid ? (
                <>
                  <button className="csv-btn" onClick={handleCSVDownload}>
                    ð¥ åå¼ãã¼ã¿ãCSVã§åºå
                  </button>
                  <button className="csv-btn" onClick={handlePDFDownload} disabled={loading}>
                    ð æçè¨ç®æ¸ãPDFã§åºå
                  </button>
                </>
              ) : (
                <>
                  <button className="csv-btn csv-btn-locked" onClick={() => handleUpgrade()}>
                    ð åå¼ãã¼ã¿ãCSVã§åºåï¼ææãã©ã³ï¼
                  </button>
                  <button className="csv-btn csv-btn-locked" onClick={() => handleUpgrade()}>
                    ð æçè¨ç®æ¸ãPDFã§åºåï¼ææãã©ã³ï¼
                  </button>
                </>
              )}
            </div>

            {/* Table */}
            <h2 className="result-section-title" style={{ marginTop: 8 }}>åå¼æç´°</h2>
            <div className="table-wrapper">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>åå¼æ</th>
                    <th>æ¥æ</th>
                    <th>éè²¨</th>
                    <th className="right">æ°é</th>
                    <th className="right">å£²å´åä¾¡</th>
                    <th className="right">åå¾åä¾¡</th>
                    <th className="right">æç</th>
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
              ãã©ã¤ãã·ã¼ããªã·ã¼ã»åè²¬äºé 
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
                {cancelLoading ? "å¦çä¸­..." : "ææãã©ã³ãè§£ç´ãã"}
              </button>
            </div>
          )}
          <p className="footer-copy">Â© 2026 æå·è³ç£æçè¨ç®ãã¼ã«. All rights reserved.</p>
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
