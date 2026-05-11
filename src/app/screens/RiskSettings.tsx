import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, AlertOctagon, Lock, Clock, Info, CheckCircle, X } from "lucide-react";

interface Param {
  id: string;
  label: string;
  min: number;
  max: number;
  default: number;
  value: number;
  unit: string;
  tooltip: string;
}

const INIT_PARAMS: Param[] = [
  { id: "per_trade", label: "Max Loss Per Trade", min: 1, max: 5, default: 2, value: 2, unit: "%", tooltip: "If a single trade loses more than this % of your capital, AI stops and alerts you" },
  { id: "daily", label: "Max Daily Loss", min: 3, max: 10, default: 5, value: 5, unit: "%", tooltip: "When daily cumulative loss hits this limit, AI stops opening new positions" },
  { id: "weekly", label: "Max Weekly Loss", min: 5, max: 20, default: 10, value: 10, unit: "%", tooltip: "When weekly loss hits this limit, AI enters close-only mode" },
  { id: "position", label: "Max Single Position", min: 20, max: 80, default: 50, value: 50, unit: "%", tooltip: "No single token position can exceed this % of total capital" },
];

function getColor(v: number, min: number, max: number, def: number) {
  if (v === max) return "#F6465D";
  if (v !== def) return "#FCD535";
  return "#00D4AA";
}

const AUTO_EXECUTE = [
  "Daily strategy execution",
  "Small-position take-profit/stop-loss",
  "Parameter micro-adjustments (RL)",
  "Routine rebalancing",
];

const ASK_FIRST = [
  "New strategy activation",
  "Large trades (>50% of per-trade limit)",
  "Leverage above default",
  "Strategy architecture switch",
];

const NEVER_ALLOW = [
  "Leverage above hard limit",
  "Simultaneous long+short (non-arbitrage)",
  "Withdrawal operations",
  "Positions without stop-loss",
];

const SYSTEM_ALERTS = [
  { time: "10:45", severity: "⚠️", desc: "Abnormal frequency detected — 6 trades in 3 min", action: "Auto-paused 30 min" },
  { time: "Yesterday", severity: "🔴", desc: "Exchange API timeout rate 8% — Switched to conservative mode", action: "Mode switched" },
];

export function RiskSettings() {
  const navigate = useNavigate();
  const [params, setParams] = useState(INIT_PARAMS);
  const [aiPaused, setAiPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pinnedTooltip, setPinnedTooltip] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const updateParam = (id: string, value: number) => {
    setParams(prev => prev.map(p => p.id === id ? { ...p, value } : p));
    setToast("Changes saved. Takes effect in 24h (cooling period)");
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = () => {
    if (!aiPaused) {
      setShowPauseModal(true);
    } else {
      setAiPaused(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 1000 }}>
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "transparent", border: "none", color: "#848E9C",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0,
            fontFamily: "'Inter', sans-serif", fontSize: 14
          }}
        >
          <ArrowLeft size={16} /> Dashboard
        </button>
        <h1 style={{ color: "#EAECEF", fontSize: 20, fontWeight: 700, margin: 0, flex: 1 }}>Risk Control Center</h1>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 20,
          background: aiPaused ? "rgba(246,70,93,0.12)" : "rgba(0,212,170,0.12)"
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: aiPaused ? "#F6465D" : "#00D4AA" }} />
          <span style={{ color: aiPaused ? "#F6465D" : "#00D4AA", fontSize: 13, fontWeight: 600 }}>
            {aiPaused ? "🔴 AI Trading Paused" : "🟢 All Protections Active"}
          </span>
        </div>
      </div>

      {/* Emergency Stop Card */}
      <div style={{
        background: aiPaused ? "rgba(246,70,93,0.08)" : "#1E2329",
        border: "1px solid #F6465D",
        borderRadius: 12, padding: 24, marginBottom: 24,
        display: "flex", alignItems: "center", gap: 20
      }}>
        <AlertOctagon size={40} color="#F6465D" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: aiPaused ? "#F6465D" : "#EAECEF", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
            {aiPaused ? "AI Trading is PAUSED" : "Emergency Stop: Pause All AI Trading"}
          </div>
          <div style={{ color: "#848E9C", fontSize: 13 }}>
            {aiPaused
              ? "Only manual close of existing positions allowed. No new trades will be opened."
              : "Existing positions are preserved. No new trades will be opened."}
          </div>
        </div>
        {/* Toggle Switch */}
        <div
          onClick={handleToggle}
          style={{
            width: 52, height: 28, borderRadius: 14,
            background: aiPaused ? "#F6465D" : "#00D4AA",
            position: "relative", cursor: "pointer", flexShrink: 0,
            transition: "background 0.3s"
          }}
        >
          <div style={{
            position: "absolute", top: 3,
            left: aiPaused ? "calc(100% - 25px)" : 3,
            width: 22, height: 22, borderRadius: 11,
            background: "#EAECEF", transition: "left 0.3s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
          }} />
        </div>
      </div>

      {/* Safety Boundaries */}
      <div style={{
        background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12,
        padding: 24, marginBottom: 20
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <Lock size={16} color="#848E9C" />
          <span style={{ color: "#EAECEF", fontSize: 16, fontWeight: 600 }}>Your Safety Boundaries</span>
          <span style={{ color: "#848E9C", fontSize: 13 }}>— AI cannot bypass these</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {params.map(p => {
            const pct = ((p.value - p.min) / (p.max - p.min)) * 100;
            const color = getColor(p.value, p.min, p.max, p.default);
            const pinned = pinnedTooltip === p.id;
            return (
              <div key={p.id} style={{
                background: "#0B0E11", borderRadius: 8, padding: "18px 20px"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600 }}>{p.label}</span>
                    <button
                      onClick={() => setPinnedTooltip(pinned ? null : p.id)}
                      style={{ background: "transparent", border: "none", color: pinned ? "#00D4AA" : "#848E9C", cursor: "pointer", display: "flex", padding: 2 }}
                    >
                      <Info size={14} />
                    </button>
                  </div>
                  <span style={{ color, fontSize: 22, fontWeight: 700, fontFamily: "'Roboto Mono', monospace" }}>
                    {p.value}{p.unit}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#848E9C", fontSize: 11 }}>{p.min}{p.unit}</span>
                  <span style={{ color: "#848E9C", fontSize: 11 }}>Default: {p.default}{p.unit}</span>
                  <span style={{ color: "#848E9C", fontSize: 11 }}>{p.max}{p.unit}</span>
                </div>
                <input
                  type="range" min={p.min} max={p.max} value={p.value}
                  onChange={e => updateParam(p.id, Number(e.target.value))}
                  style={{
                    width: "100%", appearance: "none", height: 8, borderRadius: 4,
                    background: `linear-gradient(to right, ${color} ${pct}%, #2B3139 ${pct}%)`,
                    outline: "none", cursor: "pointer"
                  }}
                />

                {pinned && (
                  <div style={{
                    marginTop: 12, background: "#1E2329", borderRadius: 6, padding: "10px 14px"
                  }}>
                    <span style={{ color: "#848E9C", fontSize: 13, lineHeight: 1.6 }}>{p.tooltip}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cooling Period */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20,
        background: "#1E2329", border: "1px solid #2B3139", borderRadius: 10, padding: "14px 18px"
      }}>
        <Clock size={18} color="#848E9C" style={{ marginTop: 1, flexShrink: 0 }} />
        <div>
          <div style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
            All risk limit changes take effect after 24-hour cooling period
          </div>
          <div style={{ color: "#848E9C", fontSize: 13 }}>
            This prevents emotionally loosening limits during market stress
          </div>
        </div>
      </div>

      {/* Authorization Matrix */}
      <div style={{
        background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12,
        padding: 24, marginBottom: 20
      }}>
        <div style={{ color: "#EAECEF", fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
          What Can AI Do Without Asking You?
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { title: "🟢 Auto-Execute", color: "#00D4AA", items: AUTO_EXECUTE, icon: "✓" },
            { title: "🟡 Ask First", color: "#FCD535", items: ASK_FIRST, icon: "!" },
            { title: "🔴 Never Allow", color: "#F6465D", items: NEVER_ALLOW, icon: "✕" },
          ].map(col => (
            <div key={col.title} style={{
              background: "#0B0E11", borderRadius: 10, padding: 16
            }}>
              <div style={{ color: col.color, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{col.title}</div>
              {col.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ color: col.color, fontSize: 13, flexShrink: 0, fontWeight: 700, minWidth: 12 }}>{col.icon}</span>
                  <span style={{ color: "#848E9C", fontSize: 13, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      <div style={{
        background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12, padding: 24
      }}>
        <div style={{ color: "#EAECEF", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>System-Level Risk Events</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #2B3139" }}>
                {["Time", "Severity", "Event", "Action Taken"].map(h => (
                  <th key={h} style={{ color: "#848E9C", fontSize: 12, fontWeight: 500, textAlign: "left", paddingBottom: 10, paddingRight: 16 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SYSTEM_ALERTS.map((a, i) => (
                <tr key={i} style={{ borderBottom: i < SYSTEM_ALERTS.length - 1 ? "1px solid #2B3139" : "none" }}>
                  <td style={{ color: "#848E9C", fontSize: 13, padding: "12px 16px 12px 0", fontFamily: "'Roboto Mono', monospace" }}>{a.time}</td>
                  <td style={{ fontSize: 16, padding: "12px 16px 12px 0" }}>{a.severity}</td>
                  <td style={{ color: "#EAECEF", fontSize: 13, padding: "12px 16px 12px 0" }}>{a.desc}</td>
                  <td style={{ color: "#FCD535", fontSize: 13, padding: "12px 0" }}>{a.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }}>
          <div style={{
            background: "#1E2329", border: "1px solid #F6465D", borderRadius: 12, padding: 32, maxWidth: 420, width: "90%"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <AlertOctagon size={28} color="#F6465D" />
              <span style={{ color: "#EAECEF", fontSize: 18, fontWeight: 700 }}>Are you sure?</span>
            </div>
            <p style={{ color: "#848E9C", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              This will pause all AI trading. Existing positions will be preserved. No new trades will be opened until you resume.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowPauseModal(false)} style={{
                flex: 1, padding: "10px 0", borderRadius: 6, border: "1px solid #848E9C",
                background: "transparent", color: "#848E9C", cursor: "pointer", fontFamily: "'Inter', sans-serif"
              }}>Cancel</button>
              <button onClick={() => { setAiPaused(true); setShowPauseModal(false); }} style={{
                flex: 1, padding: "10px 0", borderRadius: 6, border: "none",
                background: "#F6465D", color: "#fff", cursor: "pointer", fontWeight: 600, fontFamily: "'Inter', sans-serif"
              }}>Yes, Pause AI</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          background: "#1E2329", border: "1px solid #00D4AA", borderRadius: 8,
          padding: "12px 16px", display: "flex", gap: 10, alignItems: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)", zIndex: 300, animation: "slideIn 0.3s ease-out"
        }}>
          <CheckCircle size={16} color="#00D4AA" />
          <span style={{ color: "#EAECEF", fontSize: 13 }}>{toast}</span>
        </div>
      )}

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none; width: 20px; height: 20px; border-radius: 10px;
          background: #EAECEF; cursor: pointer; border: 2px solid #0B0E11;
        }
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
