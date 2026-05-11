import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { Plus, X, ChevronDown, Search, Play, Pause, Trash2, Edit3, BarChart2 } from "lucide-react";

const ACTIVE_STRATEGIES = [
  {
    id: 1, name: "Trend Following", pair: "BTC/USDT", status: "active",
    tags: ["Perpetual", "Long-biased", "3x Leverage"],
    metrics: { ret: "+8.2%", retC: "#00D4AA", sharpe: "1.4", dd: "-4.1%", trades: "12" },
    health: { label: "🟢 Healthy", c: "#00D4AA" },
    equity: [100, 103, 102, 105, 107, 104, 108.2].map((v, i) => ({ v }))
  },
  {
    id: 2, name: "Grid Strategy", pair: "ETH/USDT", status: "active",
    tags: ["Spot", "Ranging", "No Leverage"],
    metrics: { ret: "+3.1%", retC: "#00D4AA", sharpe: "0.8", dd: "-1.2%", trades: "34" },
    health: { label: "🟢 Healthy", c: "#00D4AA" },
    equity: [100, 101, 100.5, 102, 101.5, 103, 103.1].map((v, i) => ({ v }))
  },
  {
    id: 3, name: "DCA Strategy", pair: "SOL/USDT", status: "paused",
    tags: ["Spot", "Accumulation"],
    metrics: { ret: "+1.2%", retC: "#00D4AA", sharpe: "0.5", dd: "-0.8%", trades: "8" },
    health: { label: "⏸️ Paused", c: "#848E9C" },
    equity: [100, 100.3, 100.8, 101, 101.2, 101.2, 101.2].map((v, i) => ({ v }))
  },
];

const LIBRARY = [
  { id: "tf", icon: "📈", name: "Trend Following", desc: "Ride momentum with ATR-based stops", best: "Trending markets", ret: "+5.2%", win: "58%", complexity: 2 },
  { id: "grid", icon: "🔲", name: "Grid Trading", desc: "Buy low, sell high in a range", best: "Ranging markets", ret: "+4.1%", win: "72%", complexity: 1 },
  { id: "dca", icon: "💰", name: "Dollar Cost Average", desc: "Accumulate over time regardless of price", best: "Any market", ret: "+3.5%", win: "N/A", complexity: 1 },
  { id: "fund", icon: "⚖️", name: "Funding Rate Arbitrage", desc: "Earn from perpetual funding rate differentials", best: "High funding rate", ret: "+2.8%", win: "89%", complexity: 3 },
  { id: "mean", icon: "🔄", name: "Mean Reversion", desc: "Buy oversold, sell overbought", best: "High volatility, no trend", ret: "+4.6%", win: "61%", complexity: 2 },
];

const FILTER_CATS = ["All", "Trend", "Grid", "DCA", "Arbitrage", "Mean Reversion"];

export function StrategyManagement() {
  const [tab, setTab] = useState<"mine" | "library">("mine");
  const [strategies, setStrategies] = useState(ACTIVE_STRATEGIES);
  const [expandedPanel, setExpandedPanel] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [librarySearch, setLibrarySearch] = useState("");
  const [libFilter, setLibFilter] = useState("All");
  const [addedStrategy, setAddedStrategy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const toggleStatus = (id: number) => {
    setStrategies(prev => prev.map(s =>
      s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s
    ));
    showToast("Strategy status updated");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filteredLib = LIBRARY.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
      s.desc.toLowerCase().includes(librarySearch.toLowerCase());
    const matchFilter = libFilter === "All" ||
      (libFilter === "Trend" && s.id === "tf") ||
      (libFilter === "Grid" && s.id === "grid") ||
      (libFilter === "DCA" && s.id === "dca") ||
      (libFilter === "Arbitrage" && s.id === "fund") ||
      (libFilter === "Mean Reversion" && s.id === "mean");
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 1200 }}>
      {/* Top Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 4 }}>
          {(["mine", "library"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 20px", borderRadius: 8, border: "none",
              background: tab === t ? "#00D4AA" : "#1E2329",
              color: tab === t ? "#0B0E11" : "#848E9C",
              fontSize: 14, fontWeight: tab === t ? 700 : 400, cursor: "pointer",
              fontFamily: "'Inter', sans-serif", transition: "all 0.2s"
            }}>
              {t === "mine" ? "My Strategies" : "Strategy Library"}
            </button>
          ))}
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 18px",
          borderRadius: 6, border: "none", background: "#00D4AA",
          color: "#0B0E11", fontSize: 14, fontWeight: 600, cursor: "pointer",
          fontFamily: "'Inter', sans-serif"
        }}>
          <Plus size={16} /> New Strategy
        </button>
      </div>

      {/* My Strategies Tab */}
      {tab === "mine" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {strategies.map(s => (
            <div key={s.id} style={{
              background: "#1E2329", border: "1px solid #2B3139", borderRadius: 12,
              overflow: "hidden",
              opacity: s.status === "paused" ? 0.7 : 1, transition: "opacity 0.3s"
            }}>
              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: 5,
                        background: s.status === "active" ? "#00D4AA" : "#848E9C"
                      }} />
                      <span style={{ color: "#EAECEF", fontSize: 16, fontWeight: 700 }}>
                        {s.name} — {s.pair}
                      </span>
                      {s.status === "paused" && (
                        <span style={{ color: "#848E9C", fontSize: 12 }}>⏸️ Paused — User stopped on May 9</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                      {s.tags.map(tag => (
                        <span key={tag} style={{
                          background: "#0B0E11", border: "1px solid #2B3139",
                          color: "#848E9C", fontSize: 12, padding: "3px 10px", borderRadius: 4
                        }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      {[
                        { k: "Return", v: s.metrics.ret, c: s.metrics.retC },
                        { k: "Sharpe", v: s.metrics.sharpe, c: "#EAECEF" },
                        { k: "Max DD", v: s.metrics.dd, c: "#F6465D" },
                        { k: "Trades", v: s.metrics.trades, c: "#EAECEF" },
                      ].map(m => (
                        <div key={m.k}>
                          <div style={{ color: "#848E9C", fontSize: 11, marginBottom: 3 }}>{m.k}</div>
                          <div style={{ color: m.c, fontSize: 16, fontWeight: 700, fontFamily: "'Roboto Mono', monospace" }}>{m.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mini Equity Curve */}
                  <div style={{ width: 120, height: 60, marginLeft: 20 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={s.equity}>
                        <defs>
                          <linearGradient id={`eq${s.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#00D4AA" strokeWidth={1.5}
                          fill={`url(#eq${s.id})`} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                  <span style={{ color: s.health.c, fontSize: 13, fontWeight: 600 }}>{s.health.label}</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => toggleStatus(s.id)}
                      style={{
                        padding: "7px 14px", borderRadius: 6, border: "1px solid #2B3139",
                        background: "transparent", color: s.status === "active" ? "#FCD535" : "#00D4AA",
                        fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      {s.status === "active" ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Resume</>}
                    </button>
                    <button
                      onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                      style={{
                        padding: "7px 14px", borderRadius: 6, border: "1px solid #2B3139",
                        background: "transparent", color: "#EAECEF",
                        fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      <Edit3 size={13} /> Edit Parameters
                    </button>
                    <button style={{
                      padding: "7px 14px", borderRadius: 6, border: "1px solid #2B3139",
                      background: "transparent", color: "#848E9C",
                      fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      <BarChart2 size={13} /> View Backtest
                    </button>
                    {s.status === "paused" && (
                      <button style={{
                        padding: "7px 14px", borderRadius: 6, border: "1px solid rgba(246,70,93,0.4)",
                        background: "transparent", color: "#F6465D",
                        fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                        fontFamily: "'Inter', sans-serif"
                      }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Parameter Editor Panel */}
              {editingId === s.id && (
                <div style={{
                  background: "#0B0E11", borderTop: "1px solid #2B3139",
                  padding: "20px 24px", animation: "fadeIn 0.2s ease-out"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600 }}>Edit: {s.name} Parameters</span>
                    <button onClick={() => setEditingId(null)} style={{ background: "transparent", border: "none", color: "#848E9C", cursor: "pointer" }}>
                      <X size={16} />
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {[
                      { label: "Entry Conditions", items: ["RSI Threshold: 45", "MACD Confirmation: On", "Volume Filter: 1.2x avg"] },
                      { label: "Position Sizing", items: ["Max Position: 4%", "Scaling: Flat"] },
                      { label: "Exit Conditions", items: ["Take-Profit: 7.5%", "Stop-Loss: ATR 1.5x", "Trailing Stop: On"] },
                      { label: "Risk Management", items: ["Max Concurrent: 3", "Max Daily Trades: 5"] },
                    ].map(group => (
                      <div key={group.label}>
                        <div style={{ color: "#848E9C", fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {group.label}
                        </div>
                        {group.items.map(item => (
                          <div key={item} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "8px 12px", background: "#1E2329", borderRadius: 6, marginBottom: 6
                          }}>
                            <span style={{ color: "#848E9C", fontSize: 13 }}>{item.split(":")[0]}</span>
                            <span style={{ color: "#EAECEF", fontSize: 13, fontFamily: "'Roboto Mono', monospace" }}>{item.split(": ")[1]}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(252,213,53,0.08)", borderRadius: 6, marginBottom: 16 }}>
                    <span style={{ color: "#FCD535", fontSize: 12 }}>⚠️ Parameter changes require AI confirmation for safety</span>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button onClick={() => { setEditingId(null); showToast("Parameters saved — AI reviewing changes"); }} style={{
                      padding: "10px 24px", borderRadius: 6, border: "none",
                      background: "#00D4AA", color: "#0B0E11", fontSize: 14, fontWeight: 600,
                      cursor: "pointer", fontFamily: "'Inter', sans-serif"
                    }}>Apply Changes</button>
                    <button style={{
                      background: "transparent", border: "none", color: "#1E88E5",
                      fontSize: 13, cursor: "pointer", fontFamily: "'Inter', sans-serif", textDecoration: "underline"
                    }}>Reset to AI Default</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Strategy Library Tab */}
      {tab === "library" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search size={14} color="#848E9C" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={librarySearch}
                onChange={e => setLibrarySearch(e.target.value)}
                placeholder="Search strategies..."
                style={{
                  width: "100%", height: 38, background: "#1E2329", border: "1px solid #2B3139",
                  borderRadius: 6, color: "#EAECEF", fontSize: 14, paddingLeft: 34, paddingRight: 12,
                  boxSizing: "border-box", outline: "none", fontFamily: "'Inter', sans-serif"
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {FILTER_CATS.map(f => (
                <button key={f} onClick={() => setLibFilter(f)} style={{
                  padding: "6px 14px", borderRadius: 16, border: "none",
                  background: libFilter === f ? "#00D4AA" : "#1E2329",
                  color: libFilter === f ? "#0B0E11" : "#848E9C",
                  fontSize: 13, cursor: "pointer", fontWeight: libFilter === f ? 600 : 400,
                  fontFamily: "'Inter', sans-serif", transition: "all 0.2s", whiteSpace: "nowrap"
                }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {filteredLib.map(s => (
              <div key={s.id} style={{
                background: "#1E2329", border: "1px solid #2B3139",
                borderRadius: 12, padding: 24, transition: "all 0.2s"
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#00D4AA"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#2B3139"}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ color: "#EAECEF", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{s.name}</div>
                <div style={{ color: "#848E9C", fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>{s.desc}</div>

                <div style={{
                  display: "inline-flex", padding: "4px 10px", background: "#0B0E11",
                  borderRadius: 4, marginBottom: 14
                }}>
                  <span style={{ color: "#848E9C", fontSize: 12 }}>Best for: </span>
                  <span style={{ color: "#EAECEF", fontSize: 12, marginLeft: 4 }}>{s.best}</span>
                </div>

                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                  <div>
                    <div style={{ color: "#848E9C", fontSize: 11 }}>Avg Return</div>
                    <div style={{ color: "#00D4AA", fontSize: 14, fontWeight: 600, fontFamily: "'Roboto Mono', monospace" }}>{s.ret}</div>
                  </div>
                  <div>
                    <div style={{ color: "#848E9C", fontSize: 11 }}>Win Rate</div>
                    <div style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600, fontFamily: "'Roboto Mono', monospace" }}>{s.win}</div>
                  </div>
                  <div>
                    <div style={{ color: "#848E9C", fontSize: 11 }}>Complexity</div>
                    <div style={{ color: "#EAECEF", fontSize: 14 }}>
                      {"★".repeat(s.complexity)}{"☆".repeat(3 - s.complexity)}
                    </div>
                  </div>
                </div>

                {addedStrategy === s.id ? (
                  <button style={{
                    width: "100%", padding: "8px 0", borderRadius: 6, border: "none",
                    background: "rgba(0,212,170,0.15)", color: "#00D4AA",
                    fontSize: 13, fontWeight: 600, cursor: "default",
                    fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}>
                    ✓ Added to Portfolio
                  </button>
                ) : (
                  <button
                    onClick={() => { setAddedStrategy(s.id); showToast(`${s.name} added to your strategies`); }}
                    style={{
                      width: "100%", padding: "8px 0", borderRadius: 6, border: "1px solid #00D4AA",
                      background: "transparent", color: "#00D4AA",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'Inter', sans-serif", transition: "all 0.2s"
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#00D4AA";
                      (e.currentTarget as HTMLButtonElement).style.color = "#0B0E11";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = "#00D4AA";
                    }}
                  >
                    Add to Portfolio
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24,
          background: "#1E2329", border: "1px solid #00D4AA", borderRadius: 8,
          padding: "12px 16px", color: "#EAECEF", fontSize: 13,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)", zIndex: 300, animation: "slideIn 0.3s ease-out"
        }}>
          ✓ {toast}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
