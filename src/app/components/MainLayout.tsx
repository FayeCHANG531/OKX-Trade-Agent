import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, MessageSquare, BarChart2, ClipboardList,
  Settings, AlertOctagon, Bell, ChevronDown, TrendingUp, Globe,
  User, Zap
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: MessageSquare, label: "AI Chat", path: "/chat" },
  { icon: BarChart2, label: "Positions", path: "/positions/BTC" },
  { icon: ClipboardList, label: "Decision Log", path: "/decisions" },
  { icon: Globe, label: "Market", path: "/market" },
  { icon: TrendingUp, label: "Strategies", path: "/strategies" },
  { icon: Settings, label: "Risk Settings", path: "/settings/risk" },
];

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "BTC funding rate spike detected", time: "5 min ago", type: "danger" },
    { id: 2, text: "CPI data release in 2 hours", time: "1h ago", type: "warning" },
    { id: 3, text: "SOL take-profit executed: +$156", time: "3h ago", type: "success" },
  ]);

  const pageTitle = NAV_ITEMS.find(i => location.pathname.startsWith(i.path.replace("/positions/BTC", "/positions")))?.label || "Dashboard";

  return (
    <div style={{ background: "#0B0E11", minHeight: "100vh", display: "flex", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: 64, background: "#0B0E11", borderRight: "1px solid #2B3139",
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: 16, paddingBottom: 16, position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 24, cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          <div style={{
            width: 36, height: 36, background: "#00D4AA", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Zap size={20} color="#0B0E11" strokeWidth={2.5} />
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
            const basePath = path.replace("/positions/BTC", "/positions");
            const isActive = location.pathname.startsWith(basePath);
            return (
              <div key={path} style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                <button
                  onClick={() => navigate(path)}
                  title={label}
                  style={{
                    width: 44, height: 44, borderRadius: 8, border: "none",
                    background: isActive ? "rgba(0,212,170,0.12)" : "transparent",
                    color: isActive ? "#00D4AA" : "#848E9C",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "#EAECEF";
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "#848E9C";
                  }}
                >
                  <Icon size={20} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Emergency Stop */}
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={() => setShowEmergencyModal(true)}
            title="Emergency Stop"
            style={{
              width: 44, height: 44, borderRadius: 22, border: "2px solid #F6465D",
              background: "rgba(246,70,93,0.1)", color: "#F6465D",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s"
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(246,70,93,0.2)"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "rgba(246,70,93,0.1)"}
          >
            <AlertOctagon size={18} />
          </button>
        </div>

        {/* User Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: 18, background: "#1E2329",
          border: "2px solid #2B3139", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer"
        }}>
          <User size={16} color="#848E9C" />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: 64, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Top Bar */}
        <div style={{
          height: 60, background: "#0B0E11", borderBottom: "1px solid #2B3139",
          display: "flex", alignItems: "center", paddingLeft: 24, paddingRight: 24,
          justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40
        }}>
          <span style={{ color: "#EAECEF", fontSize: 18, fontWeight: 600 }}>{pageTitle}</span>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select style={{
              background: "#1E2329", border: "1px solid #2B3139", color: "#EAECEF",
              borderRadius: 6, padding: "6px 12px", fontSize: 13, cursor: "pointer"
            }}>
              <option>Main Account</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Connection Status */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: "#00D4AA" }} />
              <span style={{ color: "#848E9C", fontSize: 13 }}>OKX Connected</span>
            </div>

            {/* Notifications */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: "transparent", border: "none", color: "#848E9C",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  padding: 6, borderRadius: 6, position: "relative"
                }}
              >
                <Bell size={20} />
                <div style={{
                  position: "absolute", top: 4, right: 4, width: 8, height: 8,
                  borderRadius: 4, background: "#F6465D", border: "1.5px solid #0B0E11"
                }} />
              </button>

              {showNotifications && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 8px)",
                  background: "#1E2329", border: "1px solid #2B3139", borderRadius: 8,
                  width: 320, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 100
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #2B3139" }}>
                    <span style={{ color: "#EAECEF", fontSize: 14, fontWeight: 600 }}>Alerts</span>
                  </div>
                  {notifications.map(n => (
                    <div key={n.id} style={{
                      padding: "12px 16px", borderBottom: "1px solid #2B3139",
                      display: "flex", gap: 10, alignItems: "flex-start"
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: 4, marginTop: 5,
                        background: n.type === "danger" ? "#F6465D" : n.type === "warning" ? "#FCD535" : "#00D4AA",
                        flexShrink: 0
                      }} />
                      <div>
                        <div style={{ color: "#EAECEF", fontSize: 13 }}>{n.text}</div>
                        <div style={{ color: "#848E9C", fontSize: 12, marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          <Outlet />
        </div>
      </div>

      {/* Emergency Stop Modal */}
      {showEmergencyModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200
        }} onClick={() => setShowEmergencyModal(false)}>
          <div style={{
            background: "#1E2329", border: "1px solid #F6465D", borderRadius: 12,
            padding: 32, maxWidth: 420, width: "90%"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <AlertOctagon size={32} color="#F6465D" />
              <span style={{ color: "#EAECEF", fontSize: 18, fontWeight: 700 }}>Pause All AI Trading?</span>
            </div>
            <p style={{ color: "#848E9C", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              This will immediately pause all AI trading activity. Existing positions will be preserved. No new trades will be opened.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowEmergencyModal(false)}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 6, border: "1px solid #848E9C",
                  background: "transparent", color: "#EAECEF", cursor: "pointer", fontSize: 14
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowEmergencyModal(false); navigate("/settings/risk"); }}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 6, border: "none",
                  background: "#F6465D", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600
                }}
              >
                Yes, Pause AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
