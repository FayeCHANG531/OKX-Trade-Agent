import { useState } from "react";
import { useNavigate } from "react-router";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { ArrowUpRight, ArrowDownRight, ChevronRight, X, TrendingUp, TrendingDown } from "lucide-react";

const sparkData = [
  { v: 43200 }, { v: 43500 }, { v: 43100 }, { v: 43800 }, { v: 44100 }, { v: 44400 }, { v: 44748 }
];

const radarData = [
  { axis: "On-Chain", value: 7 },
  { axis: "Sentiment", value: 6 },
  { axis: "Technical", value: 8 },
  { axis: "Macro", value: 5 },
];

const positions = [
  {
    id: "BTC", name: "Bitcoin", symbol: "BTC", emoji: "₿",
    direction: "Long", dirColor: "#00D4AA", portfolio: "4.2%",
    pnl: "+$312", pnlPct: "+1.4%", pnlColor: "#00D4AA",
    chartData: [{ v: 66200 }, { v: 66500 }, { v: 66800 }, { v: 66600 }, { v: 67100 }, { v: 67250 }]
  },
  {
    id: "ETH", name: "Ethereum", symbol: "ETH", emoji: "Ξ",
    direction: "Long", dirColor: "#00D4AA", portfolio: "2.1%",
    pnl: "+$45", pnlPct: "+0.3%", pnlColor: "#00D4AA",
    chartData: [{ v: 3820 }, { v: 3830 }, { v: 3840 }, { v: 3835 }, { v: 3845 }, { v: 3850 }]
  },
  {
    id: "SOL", name: "Solana", symbol: "SOL", emoji: "◎",
    direction: "Short", dirColor: "#F6465D", portfolio: "1.8%",
    pnl: "-$28", pnlPct: "-0.8%", pnlColor: "#F6465D",
    chartData: [{ v: 172 }, { v: 170 }, { v: 171 }, { v: 169 }, { v: 168 }, { v: 167 }]
  },
];

const decisions = [
  { time: "10:32", action: "BUY", token: "BTC/USDT", confidence: 72, note: "Whale inflow + breakout", status: "open", statusColor: "#00D4AA" },
  { time: "09:15", action: "SELL", token: "SOL/USDT", confidence: 85, note: "Hit +8% take-profit target", status: "completed", statusColor: "#00D4AA" },
  { time: "Yesterday", action: "ADJUST", token: "BTC Stop-Loss", confidence: null, note: "BTC stop-loss $63K→$64.8K — RL optimization", status: "RL", statusColor: "#1E88E5" },
];

const orders = [
  { type: "Stop-Loss", token: "BTC", price: "$64,800", status: "Active", statusColor: "#FCD535" },
  { type: "Take-Profit", token: "ETH", price: "$4,200", status: "Pending", statusColor: "#848E9C" },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedPosition, setSelectedPosition] = useState<typeof positions[0] | null>(null);
  const [expandedDecision, setExpandedDecision] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 1200 }}>

      {/* PnL Section */}
      <div style={{
        background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12,
        padding: 24, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between",
        animation: "fadeUp 0.4s ease-out"
      }}>
        <div>
          <div style={{ color: "#848E9C", fontSize: 12, marginBottom: 6 }}>Total Portfolio Value</div>
          <div style={{ color: "#EAECEF", fontSize: 32, fontWeight: 700, fontFamily: "'Roboto Mono', monospace", marginBottom: 8 }}>
            $44,747.50
          </div>
          <div style={{ color: "#00D4AA", fontSize: 16, fontWeight: 600, fontFamily: "'Roboto Mono', monospace", marginBottom: 16 }}>
            +$1,247.50 (+2.8%)
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Today", val: "+$89.30", c: "#00D4AA" },
              { label: "7-Day", val: "+$1,247.50", c: "#00D4AA" },
              { label: "30-Day", val: "+$3,102.00", c: "#00D4AA" },
            ].map(m => (
              <div key={m.label} style={{
                background: "#0B0E11", border: "1px solid #2B3139", borderRadius: 6,
                padding: "6px 12px", display: "flex", gap: 6, alignItems: "center"
              }}>
                <span style={{ color: "#848E9C", fontSize: 12 }}>{m.label}</span>
                <span style={{ color: m.c, fontSize: 13, fontFamily: "'Roboto Mono', monospace", fontWeight: 600 }}>{m.val}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/decisions")}
            style={{
              marginTop: 12, background: "transparent", border: "none",
              color: "#1E88E5", fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4, padding: 0,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            View Detailed Report
            <ChevronRight size={12} />
          </button>
        </div>
        <div style={{ width: 200, height: 80 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#00D4AA" strokeWidth={2} fill="url(#pnlGrad)" dot={false} />
              <Tooltip
                contentStyle={{ background: "#1E2329", border: "1px solid #2B3139", borderRadius: 6 }}
                labelStyle={{ color: "#848E9C", fontSize: 11 }}
                itemStyle={{ color: "#00D4AA", fontSize: 12 }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Value"]}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Positions Section */}
      <div style={{
        background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12,
        padding: 24, marginBottom: 20, animation: "fadeUp 0.5s ease-out"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ color: "#EAECEF", fontSize: 16, fontWeight: 600 }}>Current Positions</span>
          <span style={{
            background: "rgba(0,212,170,0.15)", color: "#00D4AA",
            fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 10
          }}>3</span>
        </div>
        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 4 }}>
          {positions.map(pos => (
            <div
              key={pos.id}
              onClick={() => { setSelectedPosition(pos); navigate(`/positions/${pos.id}`); }}
              style={{
                minWidth: 240, background: "#0B0E11", border: "1px solid #2B3139",
                borderRadius: 10, padding: 16, cursor: "pointer", transition: "all 0.2s",
                flexShrink: 0
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#00D4AA";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#2B3139";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{pos.emoji}</span>
                  <div>
                    <div style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600 }}>{pos.name}</div>
                    <div style={{ color: "#848E9C", fontSize: 11 }}>{pos.symbol}</div>
                  </div>
                </div>
                <span style={{
                  color: pos.dirColor, fontSize: 12, fontWeight: 600,
                  background: `${pos.dirColor}22`, padding: "3px 8px", borderRadius: 4
                }}>
                  {pos.direction} {pos.direction === "Long" ? "↑" : "↓"}
                </span>
              </div>

              <div style={{ color: "#848E9C", fontSize: 12, marginBottom: 8 }}>{pos.portfolio} of portfolio</div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                {pos.pnlColor === "#00D4AA" ? <ArrowUpRight size={14} color="#00D4AA" /> : <ArrowDownRight size={14} color="#F6465D" />}
                <span style={{ color: pos.pnlColor, fontSize: 14, fontWeight: 600, fontFamily: "'Roboto Mono', monospace" }}>
                  {pos.pnl} ({pos.pnlPct})
                </span>
              </div>

              <div style={{ height: 40 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pos.chartData}>
                    <defs>
                      <linearGradient id={`g${pos.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={pos.pnlColor} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={pos.pnlColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke={pos.pnlColor} strokeWidth={1.5}
                      fill={`url(#g${pos.id})`} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Pending Orders */}
        <div style={{
          background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12,
          padding: 24, animation: "fadeUp 0.6s ease-out"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ color: "#EAECEF", fontSize: 15, fontWeight: 600 }}>Pending Orders</span>
            <span style={{
              background: "rgba(252,213,53,0.15)", color: "#FCD535",
              fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 10
            }}>2</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Type", "Token", "Price", "Status"].map(h => (
                    <th key={h} style={{ color: "#848E9C", fontSize: 12, fontWeight: 500, textAlign: "left", paddingBottom: 10 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={i}>
                    <td style={{ color: "#EAECEF", fontSize: 13, padding: "8px 0" }}>{o.type}</td>
                    <td style={{ color: "#EAECEF", fontSize: 13, fontFamily: "'Roboto Mono', monospace" }}>{o.token}</td>
                    <td style={{ color: "#EAECEF", fontSize: 13, fontFamily: "'Roboto Mono', monospace" }}>{o.price}</td>
                    <td>
                      <span style={{
                        color: o.statusColor, fontSize: 12, fontWeight: 600,
                        background: `${o.statusColor}22`, padding: "3px 8px", borderRadius: 4
                      }}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Pulse */}
        <div style={{
          background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12,
          padding: 24, animation: "fadeUp 0.6s ease-out"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ color: "#EAECEF", fontSize: 15, fontWeight: 600 }}>🌍 Market Pulse</span>
            <span style={{
              background: "rgba(0,212,170,0.15)", color: "#00D4AA",
              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10
            }}>Ranging-Bullish</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 160, height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="80%">
                  <PolarGrid stroke="#2B3139" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: "#848E9C", fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="Market" dataKey="value" stroke="#00D4AA" fill="#00D4AA" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#848E9C", fontSize: 12, marginBottom: 12 }}>Signal Scores</div>
              {radarData.map(d => (
                <div key={d.axis} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ color: "#EAECEF", fontSize: 12 }}>{d.axis}</span>
                    <span style={{ color: "#00D4AA", fontSize: 12, fontFamily: "'Roboto Mono', monospace" }}>{d.value}/10</span>
                  </div>
                  <div style={{ height: 4, background: "#2B3139", borderRadius: 2 }}>
                    <div style={{ height: "100%", width: `${d.value * 10}%`, background: "#00D4AA", borderRadius: 2 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
                <div>
                  <div style={{ color: "#848E9C", fontSize: 11 }}>Fear & Greed</div>
                  <div style={{ color: "#FCD535", fontSize: 13, fontWeight: 600 }}>48 (Neutral)</div>
                </div>
                <div>
                  <div style={{ color: "#848E9C", fontSize: 11 }}>BTC Dominance</div>
                  <div style={{ color: "#EAECEF", fontSize: 13, fontWeight: 600 }}>52.3%</div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/market")}
            style={{
              marginTop: 12, background: "transparent", border: "none",
              color: "#1E88E5", fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4, padding: 0, fontFamily: "'Inter', sans-serif"
            }}
          >View Full Market Analysis <ChevronRight size={12} /></button>
        </div>
      </div>

      {/* AI Decision Log */}
      <div style={{
        background: "#1E2329", border: "1px solid #2B3139",
        borderLeft: "4px solid #00D4AA", borderRadius: 12,
        padding: 24, animation: "fadeUp 0.7s ease-out"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#EAECEF", fontSize: 15, fontWeight: 600 }}>🤖 AI Decision Log</span>
            <span style={{ color: "#848E9C", fontSize: 12 }}>Last 24h</span>
          </div>
          <button onClick={() => navigate("/decisions")}
            style={{ background: "transparent", border: "none", color: "#1E88E5", fontSize: 12, cursor: "pointer", fontFamily: "'Inter', sans-serif' " }}>
            View Full Log →
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {decisions.map((d, i) => (
            <div key={i}>
              <div
                onClick={() => setExpandedDecision(expandedDecision === i ? null : i)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", borderRadius: 8, cursor: "pointer",
                  background: expandedDecision === i ? "#0B0E11" : "transparent",
                  transition: "background 0.2s"
                }}
              >
                <span style={{ color: "#848E9C", fontSize: 12, fontFamily: "'Roboto Mono', monospace", minWidth: 64 }}>{d.time}</span>
                <span style={{
                  color: d.action === "BUY" ? "#00D4AA" : d.action === "SELL" ? "#00D4AA" : "#1E88E5",
                  fontSize: 12, fontWeight: 700, minWidth: 50,
                  background: d.action === "BUY" ? "rgba(0,212,170,0.15)" : d.action === "SELL" ? "rgba(0,212,170,0.15)" : "rgba(30,136,229,0.15)",
                  padding: "2px 8px", borderRadius: 4
                }}>{d.action}</span>
                <span style={{ color: "#EAECEF", fontSize: 13, flex: 1 }}>{d.token}</span>
                <span style={{ color: "#848E9C", fontSize: 13 }}>{d.note}</span>
                {d.confidence && (
                  <span style={{
                    background: "rgba(0,212,170,0.15)", color: "#00D4AA",
                    fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                    fontFamily: "'Roboto Mono', monospace"
                  }}>{d.confidence}%</span>
                )}
                {d.status === "completed" && (
                  <span style={{ color: "#00D4AA", fontSize: 12 }}>✓ Done</span>
                )}
                {d.status === "RL" && (
                  <span style={{
                    background: "rgba(30,136,229,0.15)", color: "#1E88E5",
                    fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4
                  }}>RL</span>
                )}
              </div>

              {expandedDecision === i && (
                <div style={{
                  background: "#0B0E11", borderRadius: 8, padding: "12px 16px",
                  margin: "0 0 4px", animation: "fadeIn 0.2s ease-out"
                }}>
                  <p style={{ color: "#848E9C", fontSize: 13, margin: "0 0 8px", lineHeight: 1.6 }}>
                    {i === 0 && "Bought BTC spot $2,000 (4% of capital). Rationale: Whale addresses net inflow to exchanges $150M within 2h; BTC broke above 4h Bollinger upper band. Combined confidence 72%."}
                    {i === 1 && "Sold SOL position at +8% take-profit target. Trade completed successfully. Position closed at $172.40."}
                    {i === 2 && "RL optimization adjusted BTC stop-loss from $63,000 to $64,800 based on updated ATR calculations and market structure analysis."}
                  </p>
                  <button onClick={() => navigate("/decisions")}
                    style={{ background: "transparent", border: "none", color: "#1E88E5", fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "'Inter', sans-serif" }}>
                    View Full Evidence Chain →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
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
