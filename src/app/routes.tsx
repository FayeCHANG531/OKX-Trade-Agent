import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { OnboardingConnect } from "./screens/OnboardingConnect";
import { OnboardingStrategy } from "./screens/OnboardingStrategy";
import { OnboardingRisk } from "./screens/OnboardingRisk";
import { Dashboard } from "./screens/Dashboard";
import { AIChat } from "./screens/AIChat";
import { PositionDetail } from "./screens/PositionDetail";
import { DecisionLog } from "./screens/DecisionLog";
import { RiskSettings } from "./screens/RiskSettings";
import { MarketPerception } from "./screens/MarketPerception";
import { StrategyManagement } from "./screens/StrategyManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/onboarding/connect" replace />,
  },
  {
    path: "/onboarding/connect",
    Component: OnboardingConnect,
  },
  {
    path: "/onboarding/strategy",
    Component: OnboardingStrategy,
  },
  {
    path: "/onboarding/risk",
    Component: OnboardingRisk,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { path: "dashboard", Component: Dashboard },
      { path: "chat", Component: AIChat },
      { path: "positions/:id", Component: PositionDetail },
      { path: "decisions", Component: DecisionLog },
      { path: "settings/risk", Component: RiskSettings },
      { path: "market", Component: MarketPerception },
      { path: "strategies", Component: StrategyManagement },
    ],
  },
]);
