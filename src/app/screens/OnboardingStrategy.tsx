import { useState } from "react";
import { useNavigate } from "react-router";
import { Zap, Bot, ChevronRight, AlertTriangle } from "lucide-react";

const RISK_OPTIONS = [
  { id: "conservative", emoji: "🛡️", label: "Conservative", sub: "Protect capital, steady growth" },
  { id: "balanced", emoji: "⚖️", label: "Balanced", sub: "Moderate risk, moderate reward" },
  { id: "aggressive", emoji: "🚀", label: "Aggressive", sub: "Higher risk, higher potential" },
];

const TOKENS = ["BTC", "ETH", "SOL", "AVAX", "MATIC", "Other"];

const HORIZON_OPTIONS = [
  { id: "short", emoji: "⚡", label: "Short-term", sub: "Intraday" },
  { id: "medium", emoji: "📅", label: "Medium-term", sub: "1-4 weeks" },
  { id: "long", emoji: "🏔️", label: "Long-term", sub: "Monthly+" },
];

export function OnboardingStrategy() {
  const navigate = useNavigate();
  const [risk, setRisk] = useState<string | null>(null);
  const [tokens, setTokens] = useState<string[]>([]);
  const [horizon, setHorizon] = useState<string | null>(null);
  const [hoveredRisk, setHoveredRisk] = useState<string | null>(null);
  const [hoveredHorizon, setHoveredHorizon] = useState<string | null>(null);

  const showQ2 = risk !== null;
  const showQ3 = showQ2 && tokens.length > 0;
  const showRec = showQ3 && horizon !== null;

  const toggleToken = (t: string) => {
    setTokens(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
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
          <span style={{ color: "#EAECEF", fontSize: 16, fontWeight: 700 }}>OKX AI</span>
        </div>

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
                  background: n === 1 ? "rgba(0,212,170,0.2)" : n === 2 ? "#00D4AA" : "#1E2329",
                  border: `2px solid ${n === 1 ? "#00D4AA" : n === 2 ? "#00D4AA" : "#2B3139"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: n === 2 ? "#0B0E11" : n === 1 ? "#00D4AA" : "#848E9C",
                  fontSize: 13, fontWeight: 600
                }}>
                  {n === 1 ? "✓" : n}
                </div>
                <span style={{
                  color: n === 2 ? "#EAECEF" : "#848E9C", fontSize: 13,
                  fontWeight: n === 2 ? 600 : 400
                }}>{label}</span>
              </div>
              {i < 2 && <div style={{ width: 32, height: 1, background: "#2B3139" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Column */}
      <div style={{
        width: "100%", maxWidth: 640, padding: "0 16px 80px",
        display: "flex", flexDirection: "column", gap: 24
      }}>
        {/* AI Greeting */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 18, background: "#1E2329",
            border: "2px solid #00D4AA", display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0
          }}>
            <Bot size={18} color="#00D4AA" />
          </div>
          <div style={{
            background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12,
            padding: "14px 16px", maxWidth: 480
          }}>
            <p style={{ color: "#EAECEF", fontSize: 14, margin: 0, lineHeight: 1.7 }}>
              Great, your account is connected! 🎉 Let me find the right strategy for you. Just 3 quick questions:
            </p>
          </div>
        </div>

        {/* Q1 */}
        <div>
          <p style={{ color: "#EAECEF", fontSize: 16, fontWeight: 600, marginBottom: 12, marginTop: 0 }}>
            1. How would you describe your risk appetite?
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {RISK_OPTIONS.map(opt => (
              <div
                key={opt.id}
                onClick={() => setRisk(opt.id)}
                onMouseEnter={() => setHoveredRisk(opt.id)}
                onMouseLeave={() => setHoveredRisk(null)}
                style={{
                  background: "#1E2329",
                  border: `2px solid ${risk === opt.id ? "#00D4AA" : hoveredRisk === opt.id ? "#848E9C" : "#2B3139"}`,
                  borderRadius: 10, padding: "16px 12px", cursor: "pointer",
                  textAlign: "center", transition: "all 0.2s",
                  transform: hoveredRisk === opt.id ? "scale(1.02)" : "scale(1)",
                  boxShadow: risk === opt.id ? "0 0 16px rgba(0,212,170,0.2)" : "none"
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{opt.emoji}</div>
                <div style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{opt.label}</div>
                <div style={{ color: "#848E9C", fontSize: 12 }}>{opt.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Q2 */}
        {showQ2 && (
          <div style={{ animation: "slideUp 0.3s ease-out" }}>
            <p style={{ color: "#EAECEF", fontSize: 16, fontWeight: 600, marginBottom: 12, marginTop: 0 }}>
              2. Which tokens interest you most?
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TOKENS.map(t => (
                <button
                  key={t}
                  onClick={() => toggleToken(t)}
                  style={{
                    padding: "8px 18px", borderRadius: 20, border: "none", cursor: "pointer",
                    background: tokens.includes(t) ? "#00D4AA" : "#1E2329",
                    color: tokens.includes(t) ? "#0B0E11" : "#848E9C",
                    fontSize: 14, fontWeight: 500, transition: "all 0.2s",
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            {tokens.length > 0 && (
              <p style={{ color: "#00D4AA", fontSize: 12, marginTop: 8, marginBottom: 0 }}>
                ✓ {tokens.length} token{tokens.length > 1 ? "s" : ""} selected — scroll down to continue
              </p>
            )}
          </div>
        )}

        {/* Q3 */}
        {showQ3 && (
          <div style={{ animation: "slideUp 0.3s ease-out" }}>
            <p style={{ color: "#EAECEF", fontSize: 16, fontWeight: 600, marginBottom: 12, marginTop: 0 }}>
              3. What's your investment horizon?
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {HORIZON_OPTIONS.map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setHorizon(opt.id)}
                  onMouseEnter={() => setHoveredHorizon(opt.id)}
                  onMouseLeave={() => setHoveredHorizon(null)}
                  style={{
                    background: "#1E2329",
                    border: `2px solid ${horizon === opt.id ? "#00D4AA" : hoveredHorizon === opt.id ? "#848E9C" : "#2B3139"}`,
                    borderRadius: 10, padding: "16px 12px", cursor: "pointer",
                    textAlign: "center", transition: "all 0.2s",
                    transform: hoveredHorizon === opt.id ? "scale(1.02)" : "scale(1)",
                    boxShadow: horizon === opt.id ? "0 0 16px rgba(0,212,170,0.2)" : "none"
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{opt.emoji}</div>
                  <div style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{opt.label}</div>
                  <div style={{ color: "#848E9C", fontSize: 12 }}>{opt.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {showRec && (
          <div style={{
            animation: "fadeIn 0.5s ease-out",
            background: "#1E2329",
            border: "1px solid #2B3139",
            borderLeft: "4px solid #00D4AA",
            borderRadius: 12, padding: 24
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 16, background: "#1E2329",
                border: "2px solid #00D4AA", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Bot size={16} color="#00D4AA" />
              </div>
              <span style={{ color: "#848E9C", fontSize: 13 }}>Based on your preferences, I recommend:</span>
            </div>

            <h2 style={{ color: "#EAECEF", fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}>
              BTC Balanced Trend Following
            </h2>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {[
                { label: "Style: Medium-term" },
                { label: "Monthly Trades: 3–8" },
                { label: "Backtest Annual: +38%", color: "#00D4AA" },
                { label: "Max Drawdown: -12%", color: "#F6465D" },
              ].map(m => (
                <div key={m.label} style={{
                  padding: "6px 12px", borderRadius: 6,
                  background: "#0B0E11", border: "1px solid #2B3139",
                  color: m.color || "#EAECEF", fontSize: 12, fontFamily: "'Roboto Mono', monospace"
                }}>
                  {m.label}
                </div>
              ))}
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(252,213,53,0.08)", borderRadius: 6, padding: "8px 12px", marginBottom: 20
            }}>
              <AlertTriangle size={13} color="#FCD535" />
              <span style={{ color: "#FCD535", fontSize: 12 }}>
                Past performance does not guarantee future returns
              </span>
            </div>

            <button
              onClick={() => navigate("/onboarding/risk")}
              style={{
                width: "100%", height: 44, borderRadius: 6, border: "none",
                background: "#00D4AA", color: "#0B0E11", fontSize: 15, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Next: Set Risk Controls
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
