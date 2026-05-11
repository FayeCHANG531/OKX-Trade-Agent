import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Shield, ExternalLink, Loader2, CheckCircle, XCircle, Zap } from "lucide-react";

export function OnboardingConnect() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const isDisabled = !apiKey.trim() || !secretKey.trim();

  const handleConnect = async () => {
    if (isDisabled) return;
    setState("loading");
    await new Promise(r => setTimeout(r, 1800));
    setState("success");
    await new Promise(r => setTimeout(r, 1000));
    navigate("/onboarding/strategy");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0B0E11", display: "flex", flexDirection: "column",
      alignItems: "center", fontFamily: "'Inter', sans-serif"
    }}>
      {/* Top Bar */}
      <div style={{
        width: "100%", padding: "20px 40px", display: "flex", alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, background: "#00D4AA", borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Zap size={18} color="#0B0E11" strokeWidth={2.5} />
          </div>
          <span style={{ color: "#EAECEF", fontSize: 16, fontWeight: 700, letterSpacing: "-0.3px" }}>OKX AI</span>
        </div>

        {/* Step Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[
            { n: 1, label: "Connect Exchange" },
            { n: 2, label: "Choose Your Style" },
            { n: 3, label: "Set Safety Boundaries" }
          ].map(({ n, label }, i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  background: n === 1 ? "#00D4AA" : "#1E2329",
                  border: `2px solid ${n === 1 ? "#00D4AA" : "#2B3139"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: n === 1 ? "#0B0E11" : "#848E9C", fontSize: 13, fontWeight: 600
                }}>
                  {n}
                </div>
                <span style={{
                  color: n === 1 ? "#EAECEF" : "#848E9C", fontSize: 13,
                  fontWeight: n === 1 ? 600 : 400
                }}>{label}</span>
              </div>
              {i < 2 && <div style={{ width: 32, height: 1, background: "#2B3139" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Center Card */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 16px", width: "100%"
      }}>
        <div style={{
          width: "100%", maxWidth: 480,
          background: "#1E2329", border: "1px solid #2B3139", borderRadius: 16,
          padding: 40, boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
        }}>
          {/* Header */}
          <h1 style={{ color: "#EAECEF", fontSize: 24, fontWeight: 700, marginBottom: 8, marginTop: 0 }}>
            Connect Your OKX Account
          </h1>
          <p style={{ color: "#848E9C", fontSize: 14, marginBottom: 32, marginTop: 0, lineHeight: 1.6 }}>
            Link your exchange to let AI start trading for you
          </p>

          {/* API Key */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: "#EAECEF", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
              API Key
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Enter your OKX API Key"
                style={{
                  width: "100%", height: 40, background: "#0B0E11",
                  border: `1px solid ${apiKey ? "#00D4AA" : "#2B3139"}`,
                  borderRadius: 4, color: "#EAECEF", fontSize: 14,
                  paddingLeft: 12, paddingRight: 44, boxSizing: "border-box",
                  outline: "none", transition: "border-color 0.2s",
                  fontFamily: "'Inter', sans-serif"
                }}
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "transparent", border: "none", color: "#848E9C",
                  cursor: "pointer", display: "flex", alignItems: "center"
                }}
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Secret Key */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", color: "#EAECEF", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
              Secret Key
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showSecretKey ? "text" : "password"}
                value={secretKey}
                onChange={e => setSecretKey(e.target.value)}
                placeholder="Enter your OKX Secret Key"
                style={{
                  width: "100%", height: 40, background: "#0B0E11",
                  border: `1px solid ${secretKey ? "#00D4AA" : "#2B3139"}`,
                  borderRadius: 4, color: "#EAECEF", fontSize: 14,
                  paddingLeft: 12, paddingRight: 44, boxSizing: "border-box",
                  outline: "none", transition: "border-color 0.2s",
                  fontFamily: "'Inter', sans-serif"
                }}
              />
              <button
                onClick={() => setShowSecretKey(!showSecretKey)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "transparent", border: "none", color: "#848E9C",
                  cursor: "pointer", display: "flex", alignItems: "center"
                }}
              >
                {showSecretKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Security Badge */}
          <div style={{
            background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)",
            borderRadius: 8, padding: "12px 16px", marginBottom: 24,
            display: "flex", alignItems: "flex-start", gap: 10
          }}>
            <Shield size={16} color="#00D4AA" style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ color: "#00D4AA", fontSize: 12, lineHeight: 1.6 }}>
              We only request <strong>Trade &amp; Read</strong> permissions. Withdrawal is <strong>NEVER</strong> enabled.
            </span>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={isDisabled || state === "loading" || state === "success"}
            style={{
              width: "100%", height: 44, borderRadius: 6, border: "none",
              background: isDisabled ? "#2B3139" : state === "success" ? "#00D4AA" : "#00D4AA",
              color: isDisabled ? "#848E9C" : "#0B0E11",
              fontSize: 15, fontWeight: 600, cursor: isDisabled ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s", marginBottom: 16
            }}
          >
            {state === "loading" && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
            {state === "success" && <CheckCircle size={16} />}
            {state === "loading" ? "Verifying..." : state === "success" ? "Connected!" : "Connect & Verify"}
          </button>

          {/* Error */}
          {state === "error" && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
              color: "#F6465D", fontSize: 13
            }}>
              <XCircle size={14} />
              Verification failed. Please check your API credentials.
            </div>
          )}

          {/* Bottom Note */}
          <div style={{ textAlign: "center" }}>
            <span style={{ color: "#848E9C", fontSize: 13 }}>Don't have an API key? </span>
            <a
              href="#"
              style={{ color: "#1E88E5", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              Learn how to create one
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
