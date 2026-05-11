import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Send, Mic, Paperclip, Bot, CheckCircle, X, Edit3,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Zap
} from "lucide-react";

type Message = {
  id: number;
  role: "user" | "ai";
  type: "text" | "risk-assessment" | "trade-confirm";
  content?: string;
  tradeData?: {
    title: string;
    current: string;
    post: string;
    plan: string;
    confirmed?: boolean;
    cancelled?: boolean;
  };
};

const QUICK_ACTIONS = [
  { icon: "📈", label: "Open Position", prompt: "I want to open a new position for " },
  { icon: "📉", label: "Close Position", prompt: "I want to close my position in " },
  { icon: "🛡️", label: "Adjust Risk", prompt: "Help me adjust the risk settings for " },
  { icon: "📊", label: "Market Scan", prompt: "Scan the market and tell me the best opportunity right now" },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1, role: "user", type: "text",
    content: "Check BTC risk for me right now"
  },
  {
    id: 2, role: "ai", type: "risk-assessment",
    content: ""
  },
  {
    id: 3, role: "ai", type: "trade-confirm",
    content: "",
    tradeData: {
      title: "✅ Trade Confirmation: Reduce ETH 50%",
      current: "2.1% ($1,050)",
      post: "1.05% ($525)",
      plan: "Limit order @ $3,888 | Slippage <0.05%"
    }
  }
];

export function AIChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [mode, setMode] = useState<"novice" | "expert">("novice");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", type: "text", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    await new Promise(r => setTimeout(r, 1500));
    setThinking(false);
    const aiMsg: Message = {
      id: Date.now() + 1, role: "ai", type: "text",
      content: "I've analyzed your request. Based on current market conditions, BTC is showing moderate bullish signals with a confidence of 68%. The technical indicators suggest maintaining your current position while monitoring the $64,800 support level closely."
    };
    setMessages(prev => [...prev, aiMsg]);
  };

  const confirmTrade = (msgId: number) => {
    setMessages(prev => prev.map(m =>
      m.id === msgId && m.tradeData ? { ...m, tradeData: { ...m.tradeData, confirmed: true } } : m
    ));
  };

  const cancelTrade = (msgId: number) => {
    setMessages(prev => prev.map(m =>
      m.id === msgId && m.tradeData ? { ...m, tradeData: { ...m.tradeData, cancelled: true } } : m
    ));
  };

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      display: "flex", gap: 0, height: "calc(100vh - 108px)", minHeight: 600
    }}>
      {/* Left Chat Panel */}
      <div style={{
        flex: "0 0 60%", display: "flex", flexDirection: "column",
        background: "#1E2329", borderRadius: "12px 0 0 12px", border: "1px solid #2B3139",
        overflow: "hidden"
      }}>
        {/* Chat Top Bar */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid #2B3139",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18, background: "#0B0E11",
              border: "2px solid #00D4AA", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Bot size={18} color="#00D4AA" />
            </div>
            <div>
              <div style={{ color: "#EAECEF", fontSize: 15, fontWeight: 600 }}>AI Trading Assistant</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: "#00D4AA" }} />
                <span style={{ color: "#00D4AA", fontSize: 12 }}>Online</span>
              </div>
            </div>
          </div>

          {/* Mode Toggle */}
          <div style={{
            display: "flex", background: "#0B0E11",
            borderRadius: 20, padding: 3, gap: 2
          }}>
            {(["novice", "expert"] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: "5px 14px", borderRadius: 16, border: "none",
                  background: mode === m ? "#1E88E5" : "transparent",
                  color: mode === m ? "#fff" : "#848E9C",
                  fontSize: 13, cursor: "pointer", fontWeight: 500,
                  fontFamily: "'Inter', sans-serif", transition: "all 0.2s"
                }}
              >
                {m === "novice" ? "Novice 🌱" : "Expert 🎯"}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 20, gap: 10
            }}>
              {msg.role === "ai" && (
                <div style={{
                  width: 32, height: 32, borderRadius: 16, background: "#0B0E11",
                  border: "1.5px solid #00D4AA", display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0, marginTop: 4
                }}>
                  <Bot size={14} color="#00D4AA" />
                </div>
              )}

              <div style={{ maxWidth: "80%" }}>
                {msg.type === "text" && (
                  <div style={{
                    background: msg.role === "user" ? "rgba(0,212,170,0.12)" : "#0B0E11",
                    border: `1px solid ${msg.role === "user" ? "rgba(0,212,170,0.3)" : "#2B3139"}`,
                    borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                    padding: "12px 16px"
                  }}>
                    <p style={{ color: "#EAECEF", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{msg.content}</p>
                  </div>
                )}

                {msg.type === "risk-assessment" && (
                  <div style={{
                    background: "#0B0E11", border: "1px solid #2B3139",
                    borderRadius: "12px 12px 12px 4px", padding: 20, minWidth: 360
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <span style={{ color: "#EAECEF", fontSize: 16, fontWeight: 700 }}>📊 BTC Risk Assessment</span>
                      <span style={{
                        background: "rgba(252,213,53,0.15)", color: "#FCD535",
                        fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6
                      }}>Medium-High</span>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ color: "#F6465D", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>🔴 Key Risks</div>
                      {[
                        "Funding rate +0.05%/8h → Crowded longs",
                        "Whale net inflow 2,300 BTC to exchanges",
                        "BTC-NASDAQ correlation up to 0.75"
                      ].map((r, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                          <span style={{ color: "#F6465D", flexShrink: 0 }}>•</span>
                          <span style={{ color: "#EAECEF", fontSize: 13 }}>{r}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ color: "#00D4AA", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>🟢 Support</div>
                      {[
                        "7d active addresses at ATH",
                        "Above ascending channel lower band"
                      ].map((r, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                          <span style={{ color: "#00D4AA", flexShrink: 0 }}>•</span>
                          <span style={{ color: "#EAECEF", fontSize: 13 }}>{r}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      background: "rgba(252,213,53,0.06)", border: "1px solid rgba(252,213,53,0.2)",
                      borderRadius: 8, padding: "12px 14px", marginBottom: 12
                    }}>
                      <div style={{ color: "#FCD535", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>⚠️ Suggested Actions</div>
                      {[
                        "Tighten stop-loss to $64,800",
                        "Don't open new positions until funding normalizes"
                      ].map((a, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                          <span style={{ color: "#FCD535" }}>•</span>
                          <span style={{ color: "#EAECEF", fontSize: 13 }}>{a}</span>
                        </div>
                      ))}
                    </div>

                    <p style={{ color: "#848E9C", fontSize: 11, margin: 0, lineHeight: 1.5 }}>
                      ⚠️ AI advice is for reference only. Investment decisions are at your own risk.
                    </p>
                  </div>
                )}

                {msg.type === "trade-confirm" && msg.tradeData && (
                  <div style={{
                    background: "#0B0E11", border: `1px solid ${msg.tradeData.cancelled ? "#2B3139" : msg.tradeData.confirmed ? "#00D4AA" : "#2B3139"}`,
                    borderRadius: "12px 12px 12px 4px", padding: 20, minWidth: 340,
                    opacity: msg.tradeData.cancelled ? 0.6 : 1
                  }}>
                    <div style={{ color: "#EAECEF", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                      {msg.tradeData.confirmed ? "✅ " : ""}{msg.tradeData.title}
                    </div>

                    <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                      <div>
                        <div style={{ color: "#848E9C", fontSize: 11, marginBottom: 3 }}>Current Position</div>
                        <div style={{ color: "#EAECEF", fontSize: 14, fontFamily: "'Roboto Mono', monospace" }}>{msg.tradeData.current}</div>
                      </div>
                      <div style={{ color: "#848E9C", fontSize: 18, alignSelf: "flex-end" }}>→</div>
                      <div>
                        <div style={{ color: "#848E9C", fontSize: 11, marginBottom: 3 }}>Post-Reduction</div>
                        <div style={{ color: "#FCD535", fontSize: 14, fontFamily: "'Roboto Mono', monospace" }}>{msg.tradeData.post}</div>
                      </div>
                    </div>

                    <div style={{
                      background: "#1E2329", borderRadius: 6, padding: "8px 12px", marginBottom: 16
                    }}>
                      <span style={{ color: "#848E9C", fontSize: 12 }}>Execution: </span>
                      <span style={{ color: "#EAECEF", fontSize: 12, fontFamily: "'Roboto Mono', monospace" }}>{msg.tradeData.plan}</span>
                    </div>

                    {!msg.tradeData.confirmed && !msg.tradeData.cancelled && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => confirmTrade(msg.id)}
                          style={{
                            flex: 1, padding: "8px 0", borderRadius: 6, border: "none",
                            background: "#00D4AA", color: "#0B0E11", fontSize: 13, fontWeight: 600,
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                            fontFamily: "'Inter', sans-serif"
                          }}
                        >
                          <CheckCircle size={14} /> Confirm
                        </button>
                        <button
                          onClick={() => {}}
                          style={{
                            flex: 1, padding: "8px 0", borderRadius: 6,
                            border: "1px solid #FCD535", background: "transparent",
                            color: "#FCD535", fontSize: 13, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                            fontFamily: "'Inter', sans-serif"
                          }}
                        >
                          <Edit3 size={14} /> Modify
                        </button>
                        <button
                          onClick={() => cancelTrade(msg.id)}
                          style={{
                            flex: 1, padding: "8px 0", borderRadius: 6,
                            border: "1px solid #848E9C", background: "transparent",
                            color: "#848E9C", fontSize: 13, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                            fontFamily: "'Inter', sans-serif"
                          }}
                        >
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    )}

                    {msg.tradeData.confirmed && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#00D4AA", fontSize: 13 }}>
                        <CheckCircle size={14} /> Order submitted successfully
                      </div>
                    )}
                    {msg.tradeData.cancelled && (
                      <div style={{ color: "#848E9C", fontSize: 13 }}>Trade cancelled</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {thinking && (
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 16, background: "#0B0E11",
                border: "1.5px solid #00D4AA", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0
              }}>
                <Bot size={14} color="#00D4AA" />
              </div>
              <div style={{
                background: "#0B0E11", border: "1px solid #2B3139",
                borderRadius: "12px 12px 12px 4px", padding: "14px 18px",
                display: "flex", gap: 4, alignItems: "center"
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: 3, background: "#00D4AA",
                    animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite`
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: "16px 20px", borderTop: "1px solid #2B3139",
          display: "flex", gap: 10, alignItems: "flex-end"
        }}>
          <button style={{ background: "transparent", border: "none", color: "#848E9C", cursor: "pointer", padding: 8 }}>
            <Paperclip size={18} />
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Ask AI about your portfolio, market, or give a command..."
            rows={1}
            style={{
              flex: 1, background: "#0B0E11", border: "1px solid #2B3139",
              borderRadius: 8, color: "#EAECEF", fontSize: 14, padding: "10px 14px",
              outline: "none", resize: "none", maxHeight: 96,
              fontFamily: "'Inter', sans-serif", lineHeight: 1.5
            }}
          />
          <button style={{ background: "transparent", border: "none", color: "#848E9C", cursor: "pointer", padding: 8 }}>
            <Mic size={18} />
          </button>
          <button
            onClick={sendMessage}
            style={{
              width: 40, height: 40, borderRadius: 8, border: "none",
              background: input.trim() ? "#00D4AA" : "#2B3139",
              color: input.trim() ? "#0B0E11" : "#848E9C",
              cursor: input.trim() ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", flexShrink: 0
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Right Context Panel */}
      <div style={{
        flex: "0 0 40%", background: "#1E2329",
        borderRadius: "0 12px 12px 0", borderTop: "1px solid #2B3139",
        borderRight: "1px solid #2B3139", borderBottom: "1px solid #2B3139",
        borderLeft: "1px solid #2B3139", padding: 20,
        overflowY: "auto", display: "flex", flexDirection: "column", gap: 16
      }}>
        {/* Portfolio Snapshot */}
        <div style={{
          background: "#0B0E11", border: "1px solid #2B3139", borderRadius: 10, padding: 16
        }}>
          <div style={{ color: "#848E9C", fontSize: 12, marginBottom: 10 }}>Portfolio Snapshot</div>
          <div style={{ color: "#EAECEF", fontSize: 20, fontWeight: 700, fontFamily: "'Roboto Mono', monospace", marginBottom: 3 }}>
            $44,747.50
          </div>
          <div style={{ color: "#00D4AA", fontSize: 14, fontFamily: "'Roboto Mono', monospace", marginBottom: 14 }}>+2.8%</div>
          {[
            { sym: "BTC", dir: "Long", pct: "+1.4%", c: "#00D4AA" },
            { sym: "ETH", dir: "Long", pct: "+0.3%", c: "#00D4AA" },
            { sym: "SOL", dir: "Short", pct: "-0.8%", c: "#F6465D" },
          ].map(p => (
            <div key={p.sym} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ color: "#EAECEF", fontSize: 13, fontWeight: 600 }}>{p.sym}</span>
                <span style={{
                  fontSize: 11, color: p.dir === "Long" ? "#00D4AA" : "#F6465D",
                  background: p.dir === "Long" ? "rgba(0,212,170,0.1)" : "rgba(246,70,93,0.1)",
                  padding: "1px 6px", borderRadius: 3
                }}>{p.dir}</span>
              </div>
              <span style={{ color: p.c, fontSize: 13, fontFamily: "'Roboto Mono', monospace" }}>{p.pct}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          background: "#0B0E11", border: "1px solid #2B3139", borderRadius: 10, padding: 16
        }}>
          <div style={{ color: "#848E9C", fontSize: 12, marginBottom: 12 }}>Quick Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {QUICK_ACTIONS.map(a => (
              <button
                key={a.label}
                onClick={() => setInput(a.prompt)}
                style={{
                  padding: "10px 12px", borderRadius: 8, border: "1px solid #2B3139",
                  background: "#1E2329", color: "#EAECEF", fontSize: 13, cursor: "pointer",
                  textAlign: "left", fontFamily: "'Inter', sans-serif", transition: "border-color 0.2s"
                }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "#00D4AA"}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "#2B3139"}
              >
                <div style={{ fontSize: 18, marginBottom: 4 }}>{a.icon}</div>
                <div style={{ fontSize: 12 }}>{a.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div style={{
          background: "#0B0E11", border: "1px solid #2B3139", borderRadius: 10, padding: 16
        }}>
          <div style={{ color: "#848E9C", fontSize: 12, marginBottom: 12 }}>Recent AI Alerts</div>
          {[
            { icon: "🔴", text: "BTC funding rate spike detected", time: "5 min ago" },
            { icon: "🟡", text: "CPI data release in 2 hours", time: "1h ago" },
          ].map((a, i) => (
            <div key={i} style={{
              display: "flex", gap: 10, alignItems: "flex-start",
              paddingBottom: i === 0 ? 12 : 0,
              borderBottom: i === 0 ? "1px solid #2B3139" : "none",
              marginBottom: i === 0 ? 12 : 0
            }}>
              <span style={{ fontSize: 14 }}>{a.icon}</span>
              <div>
                <div style={{ color: "#EAECEF", fontSize: 13, lineHeight: 1.4 }}>{a.text}</div>
                <div style={{ color: "#848E9C", fontSize: 11, marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {mode === "expert" && (
          <div style={{
            background: "#0B0E11", border: "1px solid #2B3139", borderRadius: 10, padding: 16
          }}>
            <div style={{ color: "#848E9C", fontSize: 12, marginBottom: 12 }}>Signal Weights (Expert)</div>
            {[
              { sig: "Whale Flow", weight: 35, score: 8, c: "#00D4AA" },
              { sig: "Technical", weight: 30, score: 7, c: "#00D4AA" },
              { sig: "Sentiment", weight: 20, score: 5, c: "#FCD535" },
              { sig: "Macro", weight: 15, score: 3, c: "#848E9C" },
            ].map(s => (
              <div key={s.sig} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#EAECEF", fontSize: 12 }}>{s.sig}</span>
                  <span style={{ color: s.c, fontSize: 12, fontFamily: "'Roboto Mono', monospace" }}>{s.weight}% · {s.score}/10</span>
                </div>
                <div style={{ height: 3, background: "#2B3139", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${s.score * 10}%`, background: s.c, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
