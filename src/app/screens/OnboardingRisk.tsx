import { useState } from "react";
import { useNavigate } from "react-router";
import { Zap, Info, AlertOctagon, Clock, CheckCircle, Rocket } from "lucide-react";

interface SliderParam {
  id: string;
  label: string;
  min: number;
  max: number;
  default: number;
  value: number;
  unit: string;
  info: string;
}

const INITIAL_PARAMS: SliderParam[] = [
  { id: "loss_per_trade", label: "Max Loss Per Trade", min: 1, max: 5, default: 2, value: 2, unit: "%", info: "If a single trade loses more than 2% of your total capital, AI will automatically stop and notify you." },
  { id: "daily_loss", label: "Max Daily Loss", min: 3, max: 10, default: 5, value: 5, unit: "%", info: "When daily cumulative loss hits this limit, AI stops opening new positions for the rest of the day." },
  { id: "weekly_loss", label: "Max Weekly Loss", min: 5, max: 20, default: 10, value: 10, unit: "%", info: "When weekly loss hits this limit, AI enters close-only mode until the following week." },
  { id: "position_size", label: "Max Position Size", min: 20, max: 80, default: 50, value: 50, unit: "%", info: "No single trade can use more than this percentage of your total capital." },
];

function getValueColor(value: number, min: number, max: number, def: number) {
  if (value === max) return "#F6465D";
  if (value !== def) return "#FCD535";
  return "#00D4AA";
}

export function OnboardingRisk() {
  const navigate = useNavigate();
  const [params, setParams] = useState(INITIAL_PARAMS);
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  const updateParam = (id: string, value: number) => {
    setParams(prev => prev.map(p => p.id === id ? { ...p, value } : p));
  };

  const handleLaunch = async () => {
    setLaunching(true);
    await new Promise(r => setTimeout(r, 2000));
    setLaunched(true);
    await new Promise(r => setTimeout(r, 2000));
    navigate("/dashboard");
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
                  background: n < 3 ? "rgba(0,212,170,0.2)" : "#00D4AA",
                  border: `2px solid #00D4AA`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: n === 3 ? "#0B0E11" : "#00D4AA",
                  fontSize: 13, fontWeight: 600
                }}>
                  {n < 3 ? "✓" : n}
                </div>
                <span style={{
                  color: n === 3 ? "#EAECEF" : "#848E9C", fontSize: 13,
                  fontWeight: n === 3 ? 600 : 400
                }}>{label}</span>
              </div>
              {i < 2 && <div style={{ width: 32, height: 1, background: n < 2 ? "#00D4AA" : "#2B3139" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ width: "100%", maxWidth: 600, padding: "0 16px 80px" }}>
        <h1 style={{ color: "#EAECEF", fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: "center" }}>
          Your AI Safety Net
        </h1>
        <p style={{ color: "#848E9C", fontSize: 14, textAlign: "center", marginBottom: 32, lineHeight: 1.6 }}>
          Set hard limits that AI can never override. You're always in control.
        </p>

        {/* Sliders */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {params.map(p => {
            const pct = ((p.value - p.min) / (p.max - p.min)) * 100;
            const color = getValueColor(p.value, p.min, p.max, p.default);
            const infoOpen = openInfo === p.id;
            return (
              <div key={p.id} style={{
                background: "#1E2329", border: "1px solid #2B3139",
                borderRadius: 8, padding: 20
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600 }}>{p.label}</span>
                    <button
                      onClick={() => setOpenInfo(infoOpen ? null : p.id)}
                      style={{ background: "transparent", border: "none", color: "#848E9C", cursor: "pointer", display: "flex", padding: 2 }}
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  <span style={{ color, fontSize: 16, fontWeight: 700, fontFamily: "'Roboto Mono', monospace" }}>
                    {p.value}{p.unit}
                  </span>
                </div>

                <div style={{ position: "relative", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ color: "#848E9C", fontSize: 11 }}>{p.min}{p.unit}</span>
                    <span style={{ color: "#848E9C", fontSize: 11 }}>{p.max}{p.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={p.min}
                    max={p.max}
                    value={p.value}
                    onChange={e => updateParam(p.id, Number(e.target.value))}
                    style={{
                      width: "100%", appearance: "none", height: 6, borderRadius: 3,
                      background: `linear-gradient(to right, ${color} ${pct}%, #2B3139 ${pct}%)`,
                      outline: "none", cursor: "pointer"
                    }}
                  />
                </div>

                {infoOpen && (
                  <div style={{
                    background: "rgba(0,0,0,0.3)", borderRadius: 6, padding: "10px 12px",
                    marginTop: 8, animation: "fadeIn 0.2s ease-out"
                  }}>
                    <span style={{ color: "#848E9C", fontSize: 12, lineHeight: 1.6 }}>{p.info}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Emergency Stop Card */}
        <div style={{
          background: "rgba(246,70,93,0.06)", border: "1px solid #F6465D",
          borderRadius: 8, padding: 20, marginBottom: 16,
          display: "flex", alignItems: "flex-start", gap: 14
        }}>
          <AlertOctagon size={24} color="#F6465D" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ color: "#F6465D", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              Emergency Pause
            </div>
            <div style={{ color: "#848E9C", fontSize: 13, lineHeight: 1.6 }}>
              You can stop all AI trading instantly at any time from the Settings page or the red button in the sidebar.
            </div>
          </div>
        </div>

        {/* Cooling Period */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginBottom: 32,
          padding: "10px 14px", background: "#1E2329", borderRadius: 6
        }}>
          <Clock size={14} color="#848E9C" />
          <span style={{ color: "#848E9C", fontSize: 12 }}>
            Changes to risk limits take effect after 24 hours (cooling period)
          </span>
        </div>

        {/* Launch Button */}
        <button
          onClick={handleLaunch}
          disabled={launching}
          style={{
            width: "100%", height: 52, borderRadius: 8, border: "none",
            background: "#00D4AA", color: "#0B0E11", fontSize: 17, fontWeight: 700,
            cursor: launching ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            animation: launching ? "none" : "pulse 2s ease-in-out infinite",
            fontFamily: "'Inter', sans-serif", marginBottom: 16
          }}
        >
          <Rocket size={20} />
          {launching ? "Launching..." : "🚀 Launch AI Trading"}
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          style={{
            width: "100%", background: "transparent", border: "none",
            color: "#848E9C", fontSize: 14, cursor: "pointer", textDecoration: "underline",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          I'll set up risk controls later
        </button>
      </div>

      {/* Launch Overlay */}
      {(launching || launched) && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999, animation: "fadeIn 0.3s ease-out"
        }}>
          <div style={{ textAlign: "center" }}>
            {launched ? (
              <>
                <div style={{
                  width: 80, height: 80, borderRadius: 40, background: "rgba(0,212,170,0.2)",
                  border: "3px solid #00D4AA", display: "flex", alignItems: "center",
                  justifyContent: "center", margin: "0 auto 20px",
                  animation: "scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                }}>
                  <CheckCircle size={40} color="#00D4AA" />
                </div>
                <h2 style={{ color: "#EAECEF", fontSize: 28, fontWeight: 700, margin: "0 0 8px" }}>
                  AI is now active!
                </h2>
                <p style={{ color: "#848E9C", fontSize: 16 }}>Redirecting to dashboard...</p>
              </>
            ) : (
              <>
                <div style={{
                  width: 60, height: 60, borderRadius: 30,
                  border: "3px solid #00D4AA", borderTopColor: "transparent",
                  animation: "spin 1s linear infinite", margin: "0 auto 20px"
                }} />
                <p style={{ color: "#EAECEF", fontSize: 18, fontWeight: 600 }}>Launching AI Trading...</p>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,212,170,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(0,212,170,0); }
        }
        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        input[type=range]::-webkit-slider-thumb {
          appearance: none; width: 18px; height: 18px; border-radius: 9px;
          background: #EAECEF; cursor: pointer; border: 2px solid #0B0E11;
        }
      `}</style>
    </div>
  );
}
