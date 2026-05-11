import { useState, useEffect } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, LineChart, Line, Tooltip
} from "recharts";

const radarData = [
  { axis: "On-Chain", value: 7 },
  { axis: "Sentiment", value: 6 },
  { axis: "Technical", value: 8 },
  { axis: "Macro", value: 5 },
];

const EVENTS = [
  { time: "Tomorrow 14:00", icon: "📋", desc: "FOMC Minutes Release", impact: "High", impactColor: "#F6465D" },
  { time: "In 3 days", icon: "📊", desc: "CPI Data Release", impact: "High", impactColor: "#F6465D" },
  { time: "In 5 days", icon: "🏦", desc: "Fed Chair Speech", impact: "Medium", impactColor: "#FCD535" },
  { time: "In 7 days", icon: "📈", desc: "ETH ETF Decision", impact: "High", impactColor: "#F6465D" },
  { time: "In 10 days", icon: "💰", desc: "BTC Halving +365", impact: "Low", impactColor: "#00D4AA" },
];

function CorrelationChart() {
  const data = [0.62, 0.65, 0.70, 0.68, 0.72, 0.71, 0.75].map((v, i) => ({ d: `D-${6 - i}`, v }));
  return (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke="#1E88E5" strokeWidth={1.5} dot={false} />
        <Tooltip
          contentStyle={{ background: "#1E2329", border: "1px solid #2B3139", borderRadius: 6, fontSize: 11 }}
          itemStyle={{ color: "#1E88E5" }}
          labelStyle={{ color: "#848E9C" }}
          formatter={(v: number) => [v.toFixed(2), "Correlation"]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MarketPerception() {
  const [timeMode, setTimeMode] = useState("Live");
  const [liveValues, setLiveValues] = useState({
    btcPrice: 67250, ethPrice: 3848, fg: 48, btcDom: 52.3, twitterSent: 0.52, rsi: 62
  });

  useEffect(() => {
    if (timeMode !== "Live") return;
    const t = setInterval(() => {
      setLiveValues(prev => ({
        btcPrice: prev.btcPrice + (Math.random() - 0.5) * 50,
        ethPrice: prev.ethPrice + (Math.random() - 0.5) * 5,
        fg: Math.max(30, Math.min(70, prev.fg + (Math.random() - 0.5) * 2)),
        btcDom: Math.max(50, Math.min(55, prev.btcDom + (Math.random() - 0.5) * 0.1)),
        twitterSent: Math.max(0.3, Math.min(0.7, prev.twitterSent + (Math.random() - 0.5) * 0.02)),
        rsi: Math.max(55, Math.min(70, prev.rsi + (Math.random() - 0.5) * 1)),
      }));
    }, 2000);
    return () => clearInterval(t);
  }, [timeMode]);

  const fearColor = liveValues.fg < 30 ? "#F6465D" : liveValues.fg < 50 ? "#FCD535" : liveValues.fg < 70 ? "#00D4AA" : "#F6465D";
  const fearLabel = liveValues.fg < 30 ? "Fear" : liveValues.fg < 50 ? "Neutral" : liveValues.fg < 70 ? "Greed" : "Extreme Greed";

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 1200 }}>
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "#EAECEF", fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Market Perception</h1>
          <p style={{ color: "#848E9C", fontSize: 13, margin: 0 }}>What AI is watching right now</p>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["Live", "1H", "4H", "1D"].map(m => (
            <button
              key={m}
              onClick={() => setTimeMode(m)}
              style={{
                padding: "6px 14px", borderRadius: 6, border: "none",
                background: timeMode === m ? "#00D4AA" : "#1E2329",
                color: timeMode === m ? "#0B0E11" : "#848E9C",
                fontSize: 13, cursor: "pointer", fontWeight: timeMode === m ? 600 : 400,
                fontFamily: "'Inter', sans-serif", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 4
              }}
            >
              {m === "Live" && timeMode === "Live" && (
                <div style={{ width: 6, height: 6, borderRadius: 3, background: "#0B0E11", animation: "pulse 1.5s infinite" }} />
              )}
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Top Section: Radar + Overall */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Radar Chart */}
        <div style={{
          background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12,
          padding: 24, display: "flex", flexDirection: "column", alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, alignSelf: "flex-start" }}>
            <span style={{ color: "#EAECEF", fontSize: 15, fontWeight: 600 }}>Market Radar</span>
            <span style={{
              background: "rgba(0,212,170,0.15)", color: "#00D4AA",
              fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20
            }}>Ranging-Bullish</span>
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#2B3139" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#EAECEF", fontSize: 13 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                <Radar name="Market" dataKey="value" stroke="#00D4AA" fill="#00D4AA" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {radarData.map(d => (
              <div key={d.axis} style={{ textAlign: "center" }}>
                <div style={{ color: "#848E9C", fontSize: 11 }}>{d.axis}</div>
                <div style={{ color: "#00D4AA", fontSize: 14, fontWeight: 700, fontFamily: "'Roboto Mono', monospace" }}>{d.value}/10</div>
              </div>
            ))}
          </div>
        </div>

        {/* Signal Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignContent: "start" }}>
          {/* On-Chain */}
          <div style={{ background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>🟢</span>
              <span style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600 }}>On-Chain</span>
              <span style={{ color: "#00D4AA", fontSize: 11, marginLeft: "auto" }}>7/10</span>
            </div>
            {[
              { label: "Whale Alert", val: "3 transfers >$50M (2h)", dot: "🟢" },
              { label: "Exchange Flow", val: "+2,300 BTC net inflow", dot: "🔴" },
              { label: "Active Addr (7d)", val: "1.02M — ATH ↑", dot: "🟢" },
              { label: "DEX TVL", val: "Uniswap +2.3% / Curve -0.8%", dot: "🟡" },
            ].map(i => (
              <div key={i.label} style={{ marginBottom: 6, display: "flex", gap: 6 }}>
                <span style={{ fontSize: 10, marginTop: 4 }}>{i.dot}</span>
                <div>
                  <div style={{ color: "#848E9C", fontSize: 11 }}>{i.label}</div>
                  <div style={{ color: "#EAECEF", fontSize: 12 }}>{i.val}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: "4px 8px", background: "rgba(0,212,170,0.1)", borderRadius: 4, display: "inline-flex" }}>
              <span style={{ color: "#00D4AA", fontSize: 11 }}>Used by AI ✓</span>
            </div>
          </div>

          {/* Sentiment */}
          <div style={{ background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>🟡</span>
              <span style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600 }}>Sentiment</span>
              <span style={{ color: "#FCD535", fontSize: 11, marginLeft: "auto" }}>6/10</span>
            </div>

            {/* Fear & Greed Gauge */}
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <svg width="100" height="54" viewBox="0 0 100 54">
                  <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="#2B3139" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke={fearColor} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${141.4 * (liveValues.fg / 100)} 141.4`}
                  />
                </svg>
                <div style={{
                  position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                  color: fearColor, fontSize: 15, fontWeight: 700, fontFamily: "'Roboto Mono', monospace"
                }}>{Math.round(liveValues.fg)}</div>
              </div>
              <div style={{ color: fearColor, fontSize: 11 }}>{fearLabel}</div>
            </div>

            {[
              { label: "X Sentiment", val: `${liveValues.twitterSent.toFixed(2)} (slightly bullish)` },
              { label: "KOL Trend", val: "'BTC breakout' trending 🔥" },
              { label: "News", val: "SEC delays ETF — [Neutral]" },
            ].map(i => (
              <div key={i.label} style={{ marginBottom: 6 }}>
                <div style={{ color: "#848E9C", fontSize: 11 }}>{i.label}</div>
                <div style={{ color: "#EAECEF", fontSize: 12 }}>{i.val}</div>
              </div>
            ))}
          </div>

          {/* Technical */}
          <div style={{ background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>🔵</span>
              <span style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600 }}>Technical</span>
              <span style={{ color: "#1E88E5", fontSize: 11, marginLeft: "auto" }}>8/10</span>
            </div>
            {[
              { label: `RSI (4H): ${Math.round(liveValues.rsi)}`, val: "approaching overbought", c: "#FCD535" },
              { label: "MACD", val: "Bullish crossover (4H)", c: "#00D4AA" },
              { label: "Bollinger", val: "Near upper band, ATR=1,850", c: "#FCD535" },
              { label: "Open Interest", val: "+12% (4h) — new positions", c: "#00D4AA" },
            ].map(i => (
              <div key={i.label} style={{ marginBottom: 8 }}>
                <div style={{ color: "#848E9C", fontSize: 11 }}>{i.label}</div>
                <div style={{ color: i.c, fontSize: 12 }}>{i.val}</div>
              </div>
            ))}
            <div style={{ marginTop: 4, padding: "4px 8px", background: "rgba(0,212,170,0.1)", borderRadius: 4, display: "inline-flex" }}>
              <span style={{ color: "#00D4AA", fontSize: 11 }}>Used by AI ✓</span>
            </div>
          </div>

          {/* Macro */}
          <div style={{ background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 16 }}>⚪</span>
              <span style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600 }}>Macro</span>
              <span style={{ color: "#848E9C", fontSize: 11, marginLeft: "auto" }}>5/10</span>
            </div>
            {[
              { label: "FOMC Minutes", val: "Tomorrow 14:00 ET", c: "#F6465D" },
              { label: "CPI Data", val: "Next release in 3 days", c: "#FCD535" },
              { label: "BTC-NASDAQ Corr", val: "0.75 (elevated)", c: "#F6465D" },
              { label: "DXY", val: `104.2 (stable, -0.1%)`, c: "#00D4AA" },
            ].map(i => (
              <div key={i.label} style={{ marginBottom: 8 }}>
                <div style={{ color: "#848E9C", fontSize: 11 }}>{i.label}</div>
                <div style={{ color: i.c, fontSize: 12 }}>{i.val}</div>
              </div>
            ))}
            <div style={{ height: 40, marginTop: 4 }}>
              <CorrelationChart />
            </div>
          </div>
        </div>
      </div>

      {/* Event Timeline */}
      <div style={{
        background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12, padding: 24
      }}>
        <div style={{ color: "#EAECEF", fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
          📅 Upcoming Market Events
        </div>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
          {EVENTS.map((e, i) => (
            <div key={i} style={{
              minWidth: 200, background: "#0B0E11", border: "1px solid #2B3139",
              borderRadius: 10, padding: 16, flexShrink: 0
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{e.icon}</div>
              <div style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{e.desc}</div>
              <div style={{ color: "#848E9C", fontSize: 12, marginBottom: 10 }}>{e.time}</div>
              <span style={{
                background: `${e.impactColor}22`, color: e.impactColor,
                fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4
              }}>
                Impact: {e.impact}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
