import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ChevronDown, ChevronRight, Filter } from "lucide-react";

const DECISIONS = [
  {
    id: 1,
    time: "10:32",
    action: "BUY",
    token: "BTC/USDT",
    strategy: "Trend Following",
    confidence: 72,
    pnl: "+$312",
    pnlColor: "#00D4AA",
    status: "open",
    summary: "Bought BTC spot $2,000 (4% of capital). Rationale: ①Whale addresses net inflow to exchanges $150M within 2h, historically 72% probability of short-term upside; ②BTC broke above 4h Bollinger upper band, momentum signal bullish; ③Fear & Greed Index rose from 25 to 45, sentiment recovering. Combined confidence 72%.",
    signals: [
      { name: "Whale Inflow", weight: 35, score: 8, direction: "Bullish", data: "3 transfers >$50M BTC to Binance within 2h", c: "#00D4AA" },
      { name: "Technical Breakout", weight: 30, score: 7, direction: "Bullish", data: "4h close above Bollinger upper band ($67,200), ATR=1,850", c: "#00D4AA" },
      { name: "Sentiment", weight: 20, score: 5, direction: "Neutral-Bullish", data: "Fear & Greed=45, Twitter sentiment=0.52", c: "#FCD535" },
      { name: "Macro", weight: 15, score: 3, direction: "Neutral", data: "No major releases, DXY stable at 104.2", c: "#848E9C" },
    ],
    execution: [
      { time: "10:32:15", step: "Whale transfer detected" },
      { time: "10:32:18", step: "LLM classifies \"potential bullish\", confidence 65%" },
      { time: "10:32:20", step: "Quant confirms Bollinger breakout, confidence → 72%" },
      { time: "10:32:22", step: "Strategy: Matches \"Trend Following\", calculates entry & size" },
      { time: "10:32:23", step: "Risk Control: Check passed — 4% < 5% limit, risk 1.2% < 2% limit" },
      { time: "10:32:25", step: "Execution: Submit limit buy $67,250" },
      { time: "10:32:31", step: "Execution: Filled $67,248 (slippage 0.003%)" },
    ],
    outcome: { pnl: "+$312 (+1.4%)", winRate: "64%", ratio: "1.8:1" }
  },
  {
    id: 2,
    time: "09:15",
    action: "SELL",
    token: "SOL/USDT",
    strategy: "Trend Following",
    confidence: 85,
    pnl: "✓ +$156",
    pnlColor: "#00D4AA",
    status: "completed",
    summary: "Sold SOL position at +8% take-profit target. Price reached $172.40, triggering automatic take-profit execution. Trade completed with minimal slippage.",
    signals: [
      { name: "Take-Profit Target", weight: 100, score: 10, direction: "Exit Signal", data: "Price +8% from entry $159.62, TP level $172.40 hit", c: "#00D4AA" },
    ],
    execution: [
      { time: "09:15:02", step: "Price reached TP level $172.40" },
      { time: "09:15:04", step: "AI confirms TP exit condition met" },
      { time: "09:15:05", step: "Execution: Submit market sell" },
      { time: "09:15:07", step: "Execution: Filled $172.38 (slippage 0.001%)" },
    ],
    outcome: { pnl: "+$156 (+8.0%)", winRate: "71%", ratio: "2.1:1" }
  },
  {
    id: 3,
    time: "Yesterday",
    action: "ADJUST",
    token: "BTC Stop-Loss",
    strategy: "RL Optimization",
    confidence: null,
    pnl: "Optimization",
    pnlColor: "#1E88E5",
    status: "rl",
    summary: "Reinforcement Learning optimizer adjusted BTC stop-loss from $63,000 to $64,800. Rationale: ATR increased from 1,600 to 1,850, indicating higher volatility. Tighter stop required to maintain risk/reward ratio. No P&L impact — parameter update only.",
    signals: [
      { name: "ATR Signal", weight: 60, score: 8, direction: "Tighten SL", data: "ATR(14) increased from 1,600 to 1,850 (+15.6%)", c: "#FCD535" },
      { name: "RL Policy", weight: 40, score: 9, direction: "Optimize", data: "Policy gradient update: Q-value improvement 3.2%", c: "#1E88E5" },
    ],
    execution: [
      { time: "08:45:00", step: "RL model runs scheduled optimization" },
      { time: "08:45:01", step: "ATR spike detected, SL recalculation triggered" },
      { time: "08:45:02", step: "New SL $64,800 calculated (1.5x ATR from entry)" },
      { time: "08:45:03", step: "Risk Control: Change within permitted auto-adjust range" },
      { time: "08:45:04", step: "BTC stop-loss updated: $63,000 → $64,800" },
    ],
    outcome: { pnl: "N/A (parameter adjustment)", winRate: "N/A", ratio: "N/A" }
  },
];

function ConfidenceBadge({ value }: { value: number | null }) {
  if (!value) return <span style={{ background: "rgba(30,136,229,0.15)", color: "#1E88E5", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4 }}>RL</span>;
  const c = value >= 70 ? "#00D4AA" : value >= 50 ? "#FCD535" : "#848E9C";
  const bg = value >= 70 ? "rgba(0,212,170,0.15)" : value >= 50 ? "rgba(252,213,53,0.15)" : "rgba(132,142,156,0.15)";
  return <span style={{ background: bg, color: c, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, fontFamily: "'Roboto Mono', monospace" }}>{value}%</span>;
}

export function DecisionLog() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<number | null>(1);
  const [expandedSignal, setExpandedSignal] = useState<number | null>(null);
  const [tokenFilter, setTokenFilter] = useState("All");

  const filtered = tokenFilter === "All" ? DECISIONS : DECISIONS.filter(d => d.token.includes(tokenFilter));

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 960 }}>
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
        <h1 style={{ color: "#EAECEF", fontSize: 20, fontWeight: 700, margin: 0, flex: 1 }}>AI Decision Log</h1>
      </div>

      {/* Filters */}
      <div style={{
        background: "#1E2329", border: "1px solid #2B3139", borderRadius: 10,
        padding: "14px 20px", marginBottom: 24,
        display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Filter size={14} color="#848E9C" />
          <span style={{ color: "#848E9C", fontSize: 13 }}>Filter:</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "BTC", "ETH", "SOL"].map(t => (
            <button key={t} onClick={() => setTokenFilter(t)} style={{
              padding: "5px 14px", borderRadius: 16, border: "none",
              background: tokenFilter === t ? "#00D4AA" : "#0B0E11",
              color: tokenFilter === t ? "#0B0E11" : "#848E9C",
              fontSize: 13, cursor: "pointer", fontWeight: tokenFilter === t ? 600 : 400,
              fontFamily: "'Inter', sans-serif", transition: "all 0.2s"
            }}>{t}</button>
          ))}
        </div>
        <select style={{
          background: "#0B0E11", border: "1px solid #2B3139", color: "#EAECEF",
          borderRadius: 6, padding: "5px 12px", fontSize: 13, cursor: "pointer"
        }}>
          <option>All Strategies</option>
          <option>Trend Following</option>
          <option>Grid Trading</option>
        </select>
        <input type="date" style={{
          background: "#0B0E11", border: "1px solid #2B3139", color: "#848E9C",
          borderRadius: 6, padding: "5px 12px", fontSize: 13
        }} />
      </div>

      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((d, di) => (
          <div key={d.id} style={{ position: "relative" }}>
            {/* Collapsed Header */}
            <div
              onClick={() => setExpanded(expanded === d.id ? null : d.id)}
              style={{
                background: "#1E2329", border: "1px solid #2B3139",
                borderLeft: expanded === d.id ? "4px solid #00D4AA" : "4px solid #2B3139",
                borderRadius: 10, padding: "16px 20px",
                cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 16
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderLeftColor = "#00D4AA"}
              onMouseLeave={e => {
                if (expanded !== d.id) (e.currentTarget as HTMLDivElement).style.borderLeftColor = "#2B3139";
              }}
            >
              <span style={{ color: "#848E9C", fontSize: 12, fontFamily: "'Roboto Mono', monospace", minWidth: 70 }}>{d.time}</span>

              <span style={{
                fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 4, minWidth: 60, textAlign: "center",
                background: d.action === "BUY" ? "rgba(0,212,170,0.15)" : d.action === "SELL" ? "rgba(0,212,170,0.15)" : "rgba(30,136,229,0.15)",
                color: d.action === "BUY" ? "#00D4AA" : d.action === "SELL" ? "#00D4AA" : "#1E88E5"
              }}>{d.action}</span>

              <span style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600, flex: 1 }}>{d.token}</span>
              <span style={{ color: "#848E9C", fontSize: 13, flex: 2 }}>{d.strategy}</span>
              <ConfidenceBadge value={d.confidence} />
              <span style={{ color: d.pnlColor, fontSize: 13, fontFamily: "'Roboto Mono', monospace", fontWeight: 600, minWidth: 80, textAlign: "right" }}>{d.pnl}</span>
              <div style={{ color: "#848E9C", transition: "transform 0.2s", transform: expanded === d.id ? "rotate(180deg)" : "none" }}>
                <ChevronDown size={16} />
              </div>
            </div>

            {/* Expanded Content */}
            {expanded === d.id && (
              <div style={{
                background: "#0B0E11", border: "1px solid #2B3139", borderTop: "none",
                borderRadius: "0 0 10px 10px", padding: 24, animation: "fadeIn 0.2s ease-out"
              }}>
                {/* Summary */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ color: "#848E9C", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
                    Natural Language Summary
                  </div>
                  <p style={{ color: "#EAECEF", fontSize: 14, lineHeight: 1.7, margin: 0, padding: "14px 16px", background: "#1E2329", borderRadius: 8 }}>
                    {d.summary}
                  </p>
                </div>

                {/* Signal Evidence */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ color: "#848E9C", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
                    Signal Evidence Chain
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {d.signals.map((sig, si) => (
                      <div key={si}>
                        <div
                          onClick={() => setExpandedSignal(expandedSignal === si * 10 + di ? null : si * 10 + di)}
                          style={{
                            display: "flex", gap: 12, alignItems: "center",
                            padding: "12px 16px", background: "#1E2329", borderRadius: 8, cursor: "pointer"
                          }}
                        >
                          <div style={{
                            width: 10, height: 10, borderRadius: 5,
                            background: sig.c, flexShrink: 0
                          }} />
                          <span style={{ color: "#EAECEF", fontSize: 13, fontWeight: 600, flex: 1 }}>{sig.name}</span>
                          <span style={{ color: "#848E9C", fontSize: 12 }}>Weight: <span style={{ color: "#EAECEF" }}>{sig.weight}%</span></span>
                          <span style={{ color: sig.c, fontSize: 12, fontWeight: 600 }}>{sig.direction}</span>
                          <span style={{ color: sig.c, fontSize: 12, fontFamily: "'Roboto Mono', monospace" }}>{sig.score}/10</span>
                          <ChevronRight size={14} color="#848E9C" style={{
                            transition: "transform 0.2s",
                            transform: expandedSignal === si * 10 + di ? "rotate(90deg)" : "none"
                          }} />
                        </div>
                        {expandedSignal === si * 10 + di && (
                          <div style={{
                            marginLeft: 32, padding: "10px 16px", background: "#1E2329",
                            borderLeft: "2px solid #2B3139", marginBottom: 4,
                            borderRadius: "0 0 8px 8px"
                          }}>
                            <span style={{ color: "#848E9C", fontSize: 13 }}>Raw Data: </span>
                            <span style={{ color: "#EAECEF", fontSize: 13 }}>{sig.data}</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Fusion Result */}
                    <div style={{
                      padding: "12px 16px", background: "rgba(0,212,170,0.08)",
                      border: "1px solid rgba(0,212,170,0.2)", borderRadius: 8,
                      display: "flex", gap: 16, flexWrap: "wrap"
                    }}>
                      <span style={{ color: "#00D4AA", fontSize: 13, fontWeight: 700 }}>⚡ FUSION RESULT</span>
                      <span style={{ color: "#EAECEF", fontSize: 13 }}>Bullish</span>
                      {d.confidence && <span style={{ color: "#00D4AA", fontSize: 13, fontFamily: "'Roboto Mono', monospace" }}>Confidence: {d.confidence}%</span>}
                      {d.confidence && <span style={{ color: "#EAECEF", fontSize: 13 }}>Suggested Position: 4%</span>}
                    </div>
                  </div>
                </div>

                {/* Execution Timeline */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ color: "#848E9C", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
                    Execution Timeline
                  </div>
                  <div style={{ position: "relative", paddingLeft: 20 }}>
                    <div style={{ position: "absolute", left: 7, top: 0, bottom: 0, width: 2, background: "#2B3139" }} />
                    {d.execution.map((e, ei) => (
                      <div key={ei} style={{ display: "flex", gap: 16, marginBottom: 12, position: "relative" }}>
                        <div style={{
                          position: "absolute", left: -20, top: 4, width: 8, height: 8,
                          borderRadius: 4, background: ei === d.execution.length - 1 ? "#00D4AA" : "#2B3139",
                          border: "2px solid " + (ei === d.execution.length - 1 ? "#00D4AA" : "#848E9C")
                        }} />
                        <span style={{ color: "#848E9C", fontSize: 12, fontFamily: "'Roboto Mono', monospace", minWidth: 72 }}>{e.time}</span>
                        <span style={{ color: "#EAECEF", fontSize: 13 }}>{e.step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcome */}
                <div style={{
                  background: "#1E2329", borderRadius: 8, padding: 16,
                  display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center"
                }}>
                  <div>
                    <div style={{ color: "#848E9C", fontSize: 11, marginBottom: 4 }}>Current P&L</div>
                    <div style={{ color: d.pnlColor, fontSize: 16, fontWeight: 700, fontFamily: "'Roboto Mono', monospace" }}>{d.outcome.pnl}</div>
                  </div>
                  <div>
                    <div style={{ color: "#848E9C", fontSize: 11, marginBottom: 4 }}>Pattern 30-day Win Rate</div>
                    <div style={{ color: "#EAECEF", fontSize: 15, fontWeight: 600 }}>{d.outcome.winRate}</div>
                  </div>
                  <div>
                    <div style={{ color: "#848E9C", fontSize: 11, marginBottom: 4 }}>Avg Win/Loss Ratio</div>
                    <div style={{ color: "#EAECEF", fontSize: 15, fontWeight: 600 }}>{d.outcome.ratio}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
