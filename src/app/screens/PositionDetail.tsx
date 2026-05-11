import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import {
  AreaChart, Area, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { ArrowLeft, X, Info } from "lucide-react";

const generatePriceData = () => {
  const base = 66000;
  return Array.from({ length: 48 }, (_, i) => ({
    time: `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"}`,
    price: base + Math.sin(i * 0.4) * 800 + Math.random() * 400 + i * 25
  }));
};

const PRICE_DATA = generatePriceData();

const FUNDING_COUNTDOWN = () => {
  const now = new Date();
  const nextFunding = new Date(now);
  nextFunding.setHours(Math.ceil(now.getHours() / 8) * 8, 0, 0, 0);
  const diff = nextFunding.getTime() - now.getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
};

export function PositionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [timeframe, setTimeframe] = useState("4H");
  const [countdown, setCountdown] = useState(FUNDING_COUNTDOWN());
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [slVal, setSlVal] = useState(64800);

  useEffect(() => {
    const t = setInterval(() => setCountdown(FUNDING_COUNTDOWN()), 1000);
    return () => clearInterval(t);
  }, []);

  const ENTRY_PRICE = 66938;
  const MARK_PRICE = 67250;
  const SL_PRICE = 64800;
  const TP_PRICE = 72000;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 1200 }}>
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
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#EAECEF", fontSize: 20, fontWeight: 700 }}>BTC / USDT</span>
          <span style={{
            background: "#1E2329", border: "1px solid #2B3139",
            color: "#848E9C", fontSize: 12, padding: "3px 10px", borderRadius: 6
          }}>Perpetual</span>
          <span style={{
            background: "rgba(0,212,170,0.15)", color: "#00D4AA",
            fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 6
          }}>LONG ↑</span>
        </div>
      </div>

      {/* Hero Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "Unrealized P&L", value: "+$312.00", color: "#00D4AA", large: true },
          { label: "Position Value", value: "$2,102.50", color: "#EAECEF", large: false },
          { label: "Entry Price", value: "$66,938.00", color: "#EAECEF", large: false },
          { label: "Mark Price", value: "$67,250.00", color: "#EAECEF", large: false, sub: "+0.47%" },
        ].map(m => (
          <div key={m.label} style={{
            background: "#1E2329", border: "1px solid #2B3139", borderRadius: 10, padding: 20,
            animation: "fadeUp 0.4s ease-out"
          }}>
            <div style={{ color: "#848E9C", fontSize: 12, marginBottom: 8 }}>{m.label}</div>
            <div style={{
              color: m.color, fontSize: m.large ? 26 : 18, fontWeight: 700,
              fontFamily: "'Roboto Mono', monospace"
            }}>{m.value}</div>
            {m.sub && <div style={{ color: "#00D4AA", fontSize: 12, marginTop: 4 }}>{m.sub}</div>}
          </div>
        ))}
      </div>

      {/* Price Chart */}
      <div style={{
        background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12,
        padding: 24, marginBottom: 20, animation: "fadeUp 0.5s ease-out"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ color: "#EAECEF", fontSize: 15, fontWeight: 600 }}>Price Chart</span>
          <div style={{ display: "flex", gap: 4 }}>
            {["1H", "4H", "1D", "1W", "1M"].map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                style={{
                  padding: "5px 12px", borderRadius: 6, border: "none",
                  background: timeframe === t ? "#00D4AA" : "#0B0E11",
                  color: timeframe === t ? "#0B0E11" : "#848E9C",
                  fontSize: 13, cursor: "pointer", fontWeight: timeframe === t ? 600 : 400,
                  fontFamily: "'Inter', sans-serif", transition: "all 0.2s"
                }}
              >{t}</button>
            ))}
          </div>
        </div>

        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PRICE_DATA} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: "#848E9C", fontSize: 11 }} tickLine={false} axisLine={false} interval={7} />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: "#848E9C", fontSize: 11 }}
                tickLine={false} axisLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(1)}k`}
                width={55}
              />
              <Tooltip
                contentStyle={{ background: "#1E2329", border: "1px solid #2B3139", borderRadius: 8 }}
                labelStyle={{ color: "#848E9C", fontSize: 11 }}
                itemStyle={{ color: "#EAECEF", fontSize: 13 }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Price"]}
              />
              <Area type="monotone" dataKey="price" stroke="#00D4AA" strokeWidth={2} fill="url(#priceGrad)" dot={false} />
              <ReferenceLine y={ENTRY_PRICE} stroke="#00D4AA" strokeDasharray="4 4" strokeWidth={1.5}
                label={{ value: `Entry $${ENTRY_PRICE.toLocaleString()}`, fill: "#00D4AA", fontSize: 11, position: "right" }} />
              <ReferenceLine y={SL_PRICE} stroke="#F6465D" strokeDasharray="4 4" strokeWidth={1.5}
                label={{ value: `SL $${SL_PRICE.toLocaleString()}`, fill: "#F6465D", fontSize: 11, position: "right" }} />
              <ReferenceLine y={TP_PRICE} stroke="#00D4AA" strokeDasharray="4 4" strokeWidth={2}
                label={{ value: `TP $${TP_PRICE.toLocaleString()}`, fill: "#00D4AA", fontSize: 11, position: "right" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 80 }}>
        {/* Risk Metrics */}
        <div style={{
          background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12,
          padding: 24, animation: "fadeUp 0.6s ease-out"
        }}>
          <div style={{ color: "#EAECEF", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Risk Metrics</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { label: "Leverage", value: "3x", color: "#EAECEF" },
              { label: "Liquidation Price", value: "$48,250", color: "#F6465D" },
              { label: "Stop-Loss", value: "$64,800 (-3.2%)", color: "#F6465D" },
              { label: "Take-Profit", value: "$72,000 (+7.6%)", color: "#00D4AA" },
              { label: "Position Size", value: "4.2% of portfolio", color: "#EAECEF" },
              { label: "Funding Rate", value: "+0.012%/8h", color: "#FCD535" },
            ].map(m => (
              <div key={m.label}>
                <div style={{ color: "#848E9C", fontSize: 11, marginBottom: 5 }}>{m.label}</div>
                <div style={{ color: m.color, fontSize: 14, fontFamily: "'Roboto Mono', monospace", fontWeight: 600 }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 12, padding: "8px 12px", background: "#0B0E11", borderRadius: 6,
            display: "flex", gap: 6, alignItems: "center"
          }}>
            <span style={{ color: "#848E9C", fontSize: 12 }}>Next funding payment</span>
            <span style={{ color: "#FCD535", fontSize: 12, fontFamily: "'Roboto Mono', monospace" }}>in {countdown}</span>
          </div>
        </div>

        {/* AI Analysis */}
        <div style={{
          background: "#1E2329", border: "1px solid #2B3139",
          borderLeft: "4px solid #00D4AA", borderRadius: 12,
          padding: 24, animation: "fadeUp 0.6s ease-out"
        }}>
          <div style={{ color: "#EAECEF", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>🤖 AI Analysis for BTC Long</div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ color: "#EAECEF", fontSize: 13 }}>Moderately Bullish</span>
            <span style={{
              background: "rgba(0,212,170,0.15)", color: "#00D4AA",
              fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 6
            }}>Confidence 68%</span>
          </div>

          <p style={{ color: "#848E9C", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>
            Whale inflow pattern suggests short-term upside, but funding rate is elevated. Monitor for potential pullback before new highs.
          </p>

          <div style={{
            background: "rgba(0,212,170,0.06)", border: "1px solid rgba(0,212,170,0.2)",
            borderRadius: 8, padding: "10px 14px", marginBottom: 16
          }}>
            <div style={{ color: "#00D4AA", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>💡 AI Suggestion</div>
            <div style={{ color: "#EAECEF", fontSize: 13 }}>Consider tightening stop-loss to $65,500 (ATR-based)</div>
          </div>

          {/* Confidence Ring */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", width: 64, height: 64 }}>
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#2B3139" strokeWidth="6" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="#00D4AA" strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 28 * 0.68} ${2 * Math.PI * 28 * 0.32}`}
                  strokeDashoffset={2 * Math.PI * 28 * 0.25}
                  strokeLinecap="round" />
              </svg>
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center",
                justifyContent: "center", color: "#00D4AA", fontSize: 13, fontWeight: 700
              }}>68%</div>
            </div>
            <div>
              <div style={{ color: "#848E9C", fontSize: 11, marginBottom: 4 }}>AI Confidence</div>
              <div style={{ color: "#00D4AA", fontSize: 13, fontWeight: 600 }}>Moderately Bullish</div>
            </div>
          </div>

          <button
            onClick={() => navigate("/decisions")}
            style={{
              marginTop: 14, background: "transparent", border: "none",
              color: "#1E88E5", fontSize: 12, cursor: "pointer", padding: 0,
              fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: 4
            }}
          >
            View Full Decision Evidence →
          </button>
        </div>
      </div>

      {/* Sticky Action Buttons */}
      <div style={{
        position: "fixed", bottom: 0, left: 64, right: 0,
        background: "#0B0E11", borderTop: "1px solid #2B3139",
        padding: "16px 24px", display: "flex", gap: 12, zIndex: 30
      }}>
        <button onClick={() => setActiveModal("close")} style={{
          padding: "10px 24px", borderRadius: 6,
          border: "1px solid #F6465D", background: "transparent",
          color: "#F6465D", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif"
        }}>Close Position</button>
        <button onClick={() => setActiveModal("sl")} style={{
          padding: "10px 24px", borderRadius: 6,
          border: "1px solid #FCD535", background: "transparent",
          color: "#FCD535", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif"
        }}>Adjust Stop-Loss</button>
        <button onClick={() => setActiveModal("tp")} style={{
          padding: "10px 24px", borderRadius: 6,
          border: "1px solid #848E9C", background: "transparent",
          color: "#848E9C", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif"
        }}>Modify Take-Profit</button>
        <button onClick={() => setActiveModal("add")} style={{
          padding: "10px 24px", borderRadius: 6, border: "none",
          background: "#00D4AA", color: "#0B0E11", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif"
        }}>Add to Position</button>
      </div>

      {/* Modals */}
      {activeModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }} onClick={() => setActiveModal(null)}>
          <div style={{
            background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12,
            padding: 28, maxWidth: 420, width: "90%"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ color: "#EAECEF", fontSize: 16, fontWeight: 700 }}>
                {activeModal === "close" && "Close Position"}
                {activeModal === "sl" && "Adjust Stop-Loss"}
                {activeModal === "tp" && "Modify Take-Profit"}
                {activeModal === "add" && "Add to Position"}
              </span>
              <button onClick={() => setActiveModal(null)} style={{ background: "transparent", border: "none", color: "#848E9C", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            {activeModal === "sl" && (
              <div>
                <label style={{ display: "block", color: "#848E9C", fontSize: 13, marginBottom: 8 }}>
                  New Stop-Loss Price (current: $64,800)
                </label>
                <input
                  type="number"
                  value={slVal}
                  onChange={e => setSlVal(Number(e.target.value))}
                  style={{
                    width: "100%", height: 42, background: "#0B0E11", border: "1px solid #2B3139",
                    borderRadius: 6, color: "#EAECEF", fontSize: 16, padding: "0 14px",
                    boxSizing: "border-box", outline: "none", fontFamily: "'Roboto Mono', monospace"
                  }}
                />
                <div style={{ color: "#848E9C", fontSize: 12, marginTop: 6 }}>
                  AI recommends: $65,500 (ATR-based)
                </div>
              </div>
            )}

            {activeModal === "close" && (
              <p style={{ color: "#848E9C", fontSize: 14, lineHeight: 1.6 }}>
                Close your BTC Long position at current market price of $67,250? Estimated P&L: <span style={{ color: "#00D4AA" }}>+$312.00</span>
              </p>
            )}

            {activeModal === "add" && (
              <div>
                <label style={{ display: "block", color: "#848E9C", fontSize: 13, marginBottom: 8 }}>
                  Additional Capital (USDT)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  style={{
                    width: "100%", height: 42, background: "#0B0E11", border: "1px solid #2B3139",
                    borderRadius: 6, color: "#EAECEF", fontSize: 16, padding: "0 14px",
                    boxSizing: "border-box", outline: "none", fontFamily: "'Roboto Mono', monospace"
                  }}
                />
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setActiveModal(null)} style={{
                flex: 1, padding: "10px 0", borderRadius: 6, border: "1px solid #848E9C",
                background: "transparent", color: "#848E9C", cursor: "pointer", fontFamily: "'Inter', sans-serif"
              }}>Cancel</button>
              <button onClick={() => setActiveModal(null)} style={{
                flex: 1, padding: "10px 0", borderRadius: 6, border: "none",
                background: activeModal === "close" ? "#F6465D" : "#00D4AA",
                color: activeModal === "close" ? "#fff" : "#0B0E11",
                cursor: "pointer", fontWeight: 600, fontFamily: "'Inter', sans-serif"
              }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
