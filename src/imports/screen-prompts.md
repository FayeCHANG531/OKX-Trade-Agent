# OKX AI Trading Agent — Figma Make 逐屏 Prompt 集合

> **生成目标**：通过 Figma Make 生成可交互的高保真 HTML 原型  
> **Prompt 框架**：每屏遵循五要素结构 — Task / Context / Key Design Elements / Expected Behaviors / Constraints  
> **使用方式**：先创建 Make Kit（Screen 00），再按顺序逐屏喂入 Prompt  
> **迭代策略**：每屏生成后检查，最多 2 轮 Follow-up 修正，超出则重写 Prompt 重新生成

---

## Screen 00: Make Kit — 设计系统定义

> ⚠️ 此非 Prompt，而是 Figma Make 的 Make Kit 配置。在生成任何屏幕之前，先用此规范创建 Kit 或在首个 Prompt 中声明。

```
DESIGN SYSTEM SPECIFICATION (inject as context into every screen prompt):

Brand: OKX AI Trading Agent
Theme: Dark mode (primary background #0B0E11, secondary #1E2329, card #2B3139)
Accent Colors: 
  - Primary: #00D4AA (OKX green, for positive P&L and CTAs)
  - Danger: #F6465D (for negative P&L, stop-loss, alerts)
  - Warning: #FCD535 (for caution states, pending orders)
  - Info: #1E88E5 (for links, secondary actions)
  - Neutral text: #EAECEF / #848E9C (primary / secondary)

Typography: 
  - Font: Inter (or system sans-serif)
  - Heading 1: 24px Bold, #EAECEF
  - Heading 2: 18px Semibold, #EAECEF
  - Body: 14px Regular, #EAECEF
  - Caption: 12px Regular, #848E9C
  - Mono (prices/data): 14px 'SF Mono' / 'Roboto Mono', #EAECEF

Spacing: 8px grid (8, 16, 24, 32, 48px)
Border Radius: 8px (cards), 6px (buttons), 4px (inputs)
Shadows: Subtle elevation — 0 2px 8px rgba(0,0,0,0.3) for cards

Components:
  - Button Primary: bg #00D4AA, text #0B0E11, 14px Semibold, 36px height, 6px radius
  - Button Secondary: bg transparent, border 1px #848E9C, text #EAECEF
  - Button Danger: bg #F6465D, text #FFFFFF
  - Card: bg #1E2329, border 1px #2B3139, 8px radius, 16px padding
  - Badge Positive: bg rgba(0,212,170,0.15), text #00D4AA
  - Badge Negative: bg rgba(246,70,93,0.15), text #F6465D
  - Badge Warning: bg rgba(252,213,53,0.15), text #FCD535
  - Input: bg #1E2329, border 1px #2B3139, text #EAECEF, 40px height
  - Sidebar Nav: bg #0B0E11, 64px width (icon-only), active icon #00D4AA

Layout:
  - Desktop: 1440px width
  - Sidebar: 64px (collapsed) / 240px (expanded)
  - Content: max-width 1200px, centered
  - Mobile: 375px (responsive)
```

---

## Screen 01: Onboarding — 连接交易所

```
TASK:
Design the first onboarding screen for a crypto AI trading platform where users connect their OKX exchange account by entering API credentials.

CONTEXT:
This is the very first screen new users see after sign-up. It's Step 1 of a 3-step onboarding flow. Users may be crypto beginners who are nervous about sharing API keys. The screen must build trust immediately.

KEY DESIGN ELEMENTS:
1. Top area:
   - Step indicator: 3 dots/steps, Step 1 highlighted as "Connect Exchange"
   - Small OKX logo at top-left

2. Center card (max-width 480px, centered vertically):
   - Headline: "Connect Your OKX Account" (24px Bold)
   - Subtext: "Link your exchange to let AI start trading for you" (14px, secondary color)

3. Input fields (stacked vertically, 12px gap):
   - API Key field: label "API Key", placeholder "Enter your OKX API Key", show/hide toggle icon on right
   - Secret Key field: label "Secret Key", placeholder "Enter your OKX Secret Key", show/hide toggle icon on right

4. Security trust badge (between inputs and button):
   - Icon: shield with checkmark (green #00D4AA)
   - Text: "We only request Trade & Read permissions. Withdrawal is NEVER enabled." (12px, #00D4AA)
   - Subtle green-tinted background card behind this message

5. Primary button:
   - "Connect & Verify" — full width, #00D4AA background, #0B0E11 text
   - State: disabled (greyed out) when both fields are empty; active when both have content

6. Bottom note:
   - "Don't have an API key?" link text in #1E88E5 → "Learn how to create one"
   - Opens external link icon after text

EXPECTED BEHAVIORS:
- When "Connect & Verify" is clicked: show inline loading spinner on button (text changes to "Verifying...")
- On success: green checkmark animation, auto-advance to next screen after 1 second
- On error: red error message below button: "Verification failed. Please check your API credentials."
- Show/hide toggle on password fields toggles between masked and visible text

CONSTRAINTS:
- Dark theme per design system
- Desktop: centered card layout, 1440px canvas
- Mobile: card takes full width with 16px horizontal padding
- No sidebar navigation (onboarding flow has no nav)
- No footer (keep onboarding focused)
```

---

## Screen 02: Onboarding — 策略风格选择

```
TASK:
Design the second onboarding screen where AI asks 3 quick questions to recommend a personalized trading strategy.

CONTEXT:
Step 2 of 3-step onboarding. User has just connected their exchange. Now AI needs to understand their risk appetite and preferences to auto-recommend a matching strategy. Must feel conversational, not like filling a form.

KEY DESIGN ELEMENTS:
1. Top area:
   - Step indicator: 3 steps, Step 2 highlighted as "Choose Your Style"
   - Small OKX logo at top-left

2. Chat-style layout (center column, max-width 600px):
   - AI avatar (small circle with robot icon, #00D4AA border) on the left
   - AI message bubble: "Great, your account is connected! Let me find the right strategy for you. Just 3 quick questions:" (dark card bg, 14px, with subtle AI avatar)

3. Question 1 (appears first, others animate in after answer):
   - Question text: "How would you describe your risk appetite?" (16px Semibold)
   - 3 selectable cards in a row:
     - Card A: "🛡️ Conservative" — subtitle "Protect capital, steady growth"
     - Card B: "⚖️ Balanced" — subtitle "Moderate risk, moderate reward"
     - Card C: "🚀 Aggressive" — subtitle "Higher risk, higher potential"
   - Selected card: #00D4AA border, slight glow; unselected: #2B3139 border

4. Question 2 (after Q1 answered):
   - Question text: "Which tokens interest you most?"
   - Token pills/chips (multi-select): BTC, ETH, SOL, AVAX, MATIC, Other
   - Selected pills: #00D4AA bg, #0B0E11 text; unselected: #1E2329 bg, #848E9C text

5. Question 3 (after Q2 answered):
   - Question text: "What's your investment horizon?"
   - 3 selectable cards in a row:
     - "⚡ Short-term" (Intraday) 
     - "📅 Medium-term" (1-4 weeks)
     - "🏔️ Long-term" (Monthly+)

6. AI Strategy Recommendation card (appears after all 3 questions answered):
   - Card with subtle #00D4AA left border accent
   - AI avatar + "Based on your preferences, I recommend:"
   - Strategy name: "BTC Balanced Trend Following" (18px Bold)
   - 4 metric pills in a row:
     - "Style: Medium-term" | "Monthly Trades: 3-8" | "Backtest Annual: +38%" | "Max Drawdown: -12%"
   - Disclaimer text: "⚠️ Past performance does not guarantee future returns" (12px, #FCD535)

7. Primary button:
   - "Next: Set Risk Controls →" — #00D4AA, full width

EXPECTED BEHAVIORS:
- Questions appear one at a time with slide-up animation after previous answer
- Selecting an answer on Q1/Q3 immediately highlights the card and reveals next question
- Token pills (Q2) are multi-select; "Next" hint appears after at least 1 selected
- Strategy recommendation card fades in after Q3 answered
- Cards have hover effect: slight scale-up (1.02), border color change

CONSTRAINTS:
- Dark theme per design system
- Desktop: 1440px, chat-style centered column
- No sidebar navigation (onboarding flow)
- All text in English
- Conversational feel, NOT form-like
```

---

## Screen 03: Onboarding — 风控确认 + 启动

```
TASK:
Design the third and final onboarding screen where users review AI-recommended risk control parameters and launch their first AI trading strategy.

CONTEXT:
Step 3 of 3-step onboarding. User has connected exchange and chosen a strategy. This is the "moment of commitment" — they must feel in control and safe before clicking the final launch button.

KEY DESIGN ELEMENTS:
1. Top area:
   - Step indicator: 3 steps, Step 3 highlighted as "Set Safety Boundaries"

2. Center column (max-width 600px):
   - Headline: "Your AI Safety Net" (24px Bold)
   - Subtext: "Set hard limits that AI can never override. You're always in control." (14px, secondary)

3. Risk parameter cards (stacked, 16px gap between):
   Each card has:
   - Parameter name (left, 14px Semibold)
   - Slider control (center, full width)
   - Current value (right, 14px Mono, #00D4AA)
   
   Parameters:
   a) "Max Loss Per Trade" — slider 1%-5%, default 2%, value shows "2%"
   b) "Max Daily Loss" — slider 3%-10%, default 5%, value shows "5%"
   c) "Max Weekly Loss" — slider 5%-20%, default 10%, value shows "10%"
   d) "Max Position Size" — slider 20%-80%, default 50%, value shows "50%"

4. Explanation toggle for each parameter:
   - Small "ⓘ" icon next to parameter name
   - On click: expands a one-line explanation below the slider
   - Example: "If a single trade loses more than 2% of your total capital, AI will automatically stop and notify you"

5. Emergency stop card (highlighted):
   - Red-tinted card (#F6465D border, subtle red bg)
   - Icon: emergency stop button
   - Text: "Emergency Pause: You can stop all AI trading instantly at any time"
   - This is informational only, not a toggle

6. Cooling period notice:
   - Small text: "Changes to risk limits take effect after 24 hours (cooling period)" (12px, #848E9C)
   - ⓘ icon

7. Primary button (large, prominent):
   - "🚀 Launch AI Trading" — #00D4AA bg, #0B0E11 text, 48px height
   - Subtle pulse animation on the button

8. Secondary link below:
   - "I'll set up risk controls later" (14px, #848E9C, underlined)

EXPECTED BEHAVIORS:
- Sliders: drag to adjust value; value label updates in real-time
- When slider is at default position: value label is #00D4AA (green)
- When slider is moved away from default: value label changes to #FCD535 (yellow) as caution
- When slider is at maximum allowed: value label is #F6465D (red) as warning
- ⓘ info toggles expand/collapse with smooth animation
- "Launch AI Trading" button: on click, show full-screen overlay with success animation:
  - Green checkmark, "AI is now active!"
  - Auto-transition to Main Dashboard after 2 seconds

CONSTRAINTS:
- Dark theme per design system
- Desktop: 1440px, centered column layout
- No sidebar navigation (onboarding flow)
- Must feel reassuring, not intimidating — this is about safety, not restriction
```

---

## Screen 04: 主仪表盘（核心屏幕）

```
TASK:
Design the main trading dashboard — the primary screen users see after onboarding. This is the command center showing portfolio performance, positions, AI decisions, and market overview.

CONTEXT:
This is the home screen. Users visit this multiple times daily. Information must be scannable in 5 seconds. Priority: PnL > Positions > Orders > AI Decisions > Market. Left sidebar for navigation.

KEY DESIGN ELEMENTS:

1. Left Sidebar (64px collapsed, icon-only):
   - Logo at top (OKX AI icon)
   - Nav icons (vertical stack, 48px each, with tooltips on hover):
     - 🏠 Dashboard (active, #00D4AA icon)
     - 💬 AI Chat
     - 📊 Positions
     - 📋 Orders
     - ⚙️ Settings
   - Bottom: Emergency Stop button (red circle icon, always visible)
   - User avatar at very bottom

2. Top bar (full width minus sidebar):
   - Left: "Dashboard" page title (18px Semibold)
   - Center: Portfolio selector dropdown "Main Account ▾"
   - Right: Notification bell icon (with red dot if unread alerts), connection status indicator (green dot + "OKX Connected")

3. PnL Section (topmost, full-width card):
   - Large total value: "$44,747.50" (32px Bold Mono)
   - Total return: "+$1,247.50 (+2.8%)" in #00D4AA
   - Three metric pills in a row:
     - "Today +$89.30" | "7-Day +$1,247.50" | "30-Day +$3,102.00"
   - Mini sparkline chart (7-day PnL trend) on the right side of the card
   - "View Detailed Report →" link (12px, #1E88E5)

4. Positions Section (card, below PnL):
   - Section header: "Current Positions" + count badge "3"
   - Horizontal scrollable card row (each position card ~240px wide):
     - Card 1: BTC icon + "Bitcoin" | "Long ↑" (#00D4AA) | "4.2% of portfolio" | "+$312 (+1.4%)" (#00D4AA) | mini price chart
     - Card 2: ETH icon + "Ethereum" | "Long ↑" (#00D4AA) | "2.1% of portfolio" | "+$45 (+0.3%)" (#00D4AA) | mini price chart
     - Card 3: SOL icon + "Solana" | "Short ↓" (#F6465D) | "1.8% of portfolio" | "-$28 (-0.8%)" (#F6465D) | mini price chart
   - Each card clickable, subtle hover elevation

5. Pending Orders Section (card):
   - Section header: "Pending Orders" + count badge "2"
   - Compact table (4 columns):
     - Type | Token | Price | Status
     - Stop-Loss | BTC | $64,800 | 🟡 Active (yellow badge)
     - Take-Profit | ETH | $4,200 | ⚪ Pending (grey badge)

6. AI Decision Summary Section (card, distinctive — left border #00D4AA):
   - Section header: "🤖 AI Decision Log" + "Last 24h"
   - Vertical timeline (3-4 entries):
     - "10:32" — 🟢 BUY BTC — "Whale inflow + breakout, confidence 72%" — confidence badge "72%" (#00D4AA)
     - "09:15" — 🟢 SELL SOL — "Hit +8% take-profit target" — completed badge "✓"
     - "Yesterday" — 🔧 ADJUST — "BTC stop-loss $63K→$64.8K — RL optimization" — info badge "RL"
   - "View Full Decision Log →" link at bottom

7. Market Overview Section (bottom card):
   - Section header: "🌍 Market Pulse"
   - 4-axis radar/spider chart:
     - Axes: On-Chain (7/10), Sentiment (6/10), Technical (8/10), Macro (5/10)
     - Filled area in semi-transparent #00D4AA
   - Overall badge: "Ranging-Bullish" (#00D4AA pill)
   - Two mini info lines:
     - "Fear & Greed: 48 (Neutral)" | "BTC Dominance: 52.3%"

EXPECTED BEHAVIORS:
- Sidebar icons: hover reveals tooltip label, click navigates (simulate with highlight)
- Position cards: click opens a detail slide-in panel from right (400px width)
- AI Decision entries: click expands to show evidence chain (inline expand)
- Radar chart axes: hover shows tooltip with detailed score breakdown
- Notification bell: click opens dropdown with recent alerts
- Emergency Stop: click shows confirmation modal "Pause all AI trading?"
- PnL sparkline: hover shows date/value at cursor position
- All cards have subtle entrance animation (stagger fade-in)

CONSTRAINTS:
- Dark theme per design system (MUST — this is a finance product)
- Desktop: 1440px, sidebar + content layout
- Information-dense but not cluttered — generous card padding (16px)
- Data should feel "live" — use real-looking placeholder numbers, not "Lorem ipsum"
- Professional Bloomberg-meets-modern-SaaS aesthetic
- All numbers in Mono font
```

---

## Screen 05: AI 对话式交互面板

```
TASK:
Design the AI conversational interface screen where users interact with the AI trading agent through natural language — asking about risks, giving commands, and getting structured responses.

CONTEXT:
This is the "AI Chat" screen, accessed via the 💬 sidebar icon. It's the primary interaction channel for novices and a supplementary tool for pros. The AI acts as a financial advisor with structured, actionable responses.

KEY DESIGN ELEMENTS:

1. Layout: split screen
   - Left panel (60%): Chat conversation area
   - Right panel (40%): Context panel (market data + positions snapshot)

2. Left Panel — Chat Area:
   a) Top bar:
      - "AI Trading Assistant" title + green "Online" dot
      - Mode toggle: "Novice 🌱" / "Expert 🎯" (pill toggle, #1E88E5 when active)
   
   b) Chat messages (scrollable):
      - AI messages: left-aligned, dark card bubble (#1E2329), AI avatar
      - User messages: right-aligned, #00D4AA-tinted bubble, no avatar
      
      Pre-populated conversation example:
      
      User: "帮我看看 BTC 现在的风险"
      
      AI response bubble (structured, NOT free text):
        - Header: "📊 BTC Risk Assessment" (16px Semibold) + badge "Medium-High" (#FCD535)
        - Red section "🔴 Key Risks":
          1. "Funding rate +0.05%/8h → Crowded longs"
          2. "Whale net inflow 2,300 BTC to exchanges"
          3. "BTC-NASDAQ correlation up to 0.75"
        - Green section "🟢 Support":
          1. "7d active addresses at ATH"
          2. "Above ascending channel lower band"
        - Yellow section "⚠️ Suggested Actions":
          • "Tighten stop-loss to $64,800"
          • "Don't open new positions until funding normalizes"
        - Footer: "⚠️ AI advice is for reference only. Investment decisions are at your own risk." (12px, #848E9C)

      Another AI message (trade confirmation card):
        - Card with border: "✅ Trade Confirmation: Reduce ETH 50%"
        - Current position: "2.1% ($1,050)"
        - Post-reduction: "1.05% ($525)"
        - Execution plan: "Limit order @ $3,888 | Slippage <0.05%"
        - Three buttons in a row: [✓ Confirm Execute] [✎ Modify] [✕ Cancel]

   c) Input area (bottom, fixed):
      - Text input: "Ask AI about your portfolio, market, or give a command..." 
      - Attachment icon (📎) on left
      - Send button (arrow icon, #00D4AA) on right
      - Voice input icon (🎤) next to send

3. Right Panel — Context Sidebar:
   a) Portfolio Snapshot card:
      - Total value: "$44,747.50 (+2.8%)"
      - 3 mini position rows: BTC Long +1.4%, ETH Long +0.3%, SOL Short -0.8%
   
   b) Quick Actions card:
      - 4 icon buttons in 2x2 grid:
        - "📈 Open Position" | "📉 Close Position"
        - "🛡️ Adjust Risk" | "📊 Market Scan"
   
   c) Recent AI Alerts card:
      - "🔴 BTC funding rate spike detected" (5 min ago)
      - "🟡 CPI data release in 2 hours" (1h ago)

EXPECTED BEHAVIORS:
- Typing in chat: AI shows "thinking..." indicator (3 bouncing dots) for 1-2 seconds before response
- Trade confirmation cards: "Confirm" button triggers success state (green checkmark), "Cancel" dismisses card
- Mode toggle: switching to Expert mode makes right panel show more data (signal weights, model scores)
- Quick action buttons: insert pre-written prompts into chat input (e.g., "📈" → "I want to open a new position for...")
- Chat input auto-grows for multi-line, max 4 lines before scrolling
- Context panel data updates in real-time (simulate with subtle number transitions)

CONSTRAINTS:
- Dark theme per design system
- Desktop: 1440px, split layout (60/40)
- Mobile: full-screen chat, context panel becomes bottom sheet (swipe up)
- AI responses are ALWAYS structured (headers + bullet points), never free-form paragraphs
- Trade actions ALWAYS require explicit user confirmation button — AI never auto-executes from chat
- Disclaimer footer on every AI recommendation message
```

---

## Screen 06: 持仓详情页

```
TASK:
Design the position detail page showing comprehensive information about a single crypto position — including PnL breakdown, risk metrics, and AI's analysis of this position.

CONTEXT:
Accessed by clicking a position card on the Main Dashboard. Users check this when they want to understand a specific position deeply — "How is my BTC trade doing? What does AI think about it?"

KEY DESIGN ELEMENTS:

1. Top bar:
   - Back arrow "← Back to Dashboard"
   - Page title: "BTC / USDT" + "Perpetual" badge
   - Position direction badge: "LONG ↑" (#00D4AA pill)

2. Hero metrics row (4 cards in a row):
   - Card 1: "Unrealized P&L" → "+$312.00" (#00D4AA, 24px Bold Mono)
   - Card 2: "Position Value" → "$2,102.50" (14px Mono)
   - Card 3: "Entry Price" → "$66,938.00" (14px Mono)
   - Card 4: "Mark Price" → "$67,250.00" (14px Mono, with +0.47% change)

3. Large price chart (full-width card, 300px height):
   - Candlestick-style chart area (placeholder — use area chart with gradient fill)
   - Time range selector pills: "1H | 4H | 1D | 1W | 1M" (4H active)
   - Entry price line drawn on chart as dashed horizontal (#00D4AA)
   - Current stop-loss line as dashed red (#F6465D)
   - Current take-profit line as dashed green (#00D4AA, brighter)

4. Risk Metrics card (2x2 grid):
   - "Leverage" → "3x" 
   - "Liquidation Price" → "$48,250" (#F6465D, danger)
   - "Stop-Loss" → "$64,800 (-3.2%)" (#F6465D)
   - "Take-Profit" → "$72,000 (+7.6%)" (#00D4AA)
   - "Position Size" → "4.2% of portfolio"
   - "Funding Rate" → "+0.012%/8h" (next payment countdown "in 3h 22m")

5. AI Analysis card (distinctive #00D4AA left border):
   - Header: "🤖 AI Analysis for BTC Long"
   - Sentiment: "Moderately Bullish — Confidence 68%"
   - Key signal: "Whale inflow pattern suggests short-term upside, but funding rate is elevated"
   - AI Suggestion: "Consider tightening stop-loss to $65,500 (ATR-based)" 
   - Confidence gauge: circular progress ring, 68% filled, #00D4AA
   - "View Full Decision Evidence →" link

6. Action buttons row (bottom, sticky):
   - [Close Position] — #F6465D outlined button
   - [Adjust Stop-Loss] — #FCD535 outlined button
   - [Modify Take-Profit] — secondary outlined button
   - [Add to Position] — #00D4AA solid button

EXPECTED BEHAVIORS:
- Time range selector on chart: click changes chart period, chart re-renders
- Chart hover: shows crosshair with price/date tooltip
- Action buttons: click opens a modal/panel for that action (e.g., "Adjust Stop-Loss" opens input with current value pre-filled)
- AI Analysis card: "View Full Decision Evidence" navigates to Decision Log screen filtered for this position
- Entry/SL/TP lines on chart: hover shows label with exact price
- Funding rate countdown timer ticks in real-time

CONSTRAINTS:
- Dark theme per design system
- Desktop: 1440px, full content area (sidebar still visible)
- Price chart is the visual hero — takes up significant vertical space
- Numbers in Mono font throughout
- Risk metrics must be scannable at a glance — don't hide in expandable sections
```

---

## Screen 07: AI 决策日志（证据链页面）

```
TASK:
Design the AI decision log screen showing the complete evidence chain for every AI trading decision — providing full transparency into why AI made each trade.

CONTEXT:
This is the transparency engine of the product. Accessed from "View Full Decision Log" on dashboard or from any position detail. Users come here when they want to understand "Why did AI buy BTC?" — it must be both comprehensive and accessible.

KEY DESIGN ELEMENTS:

1. Top bar:
   - Back arrow "← Dashboard"
   - Title: "AI Decision Log"
   - Filter row: date range picker + token filter dropdown + strategy filter dropdown

2. Decision timeline (vertical, left-aligned):

   Each decision entry is an expandable card:
   
   COLLAPSED STATE (default):
   ┌─────────────────────────────────────────────┐
   │ 10:32  🟢 BUY  BTC/USDT  │  Confidence: 72% │
   │ Trend Following Strategy  │  +$312 unrealized │
   └─────────────────────────────────────────────┘
   - Timestamp (12px Mono) | Action icon+label | Token | Confidence badge | Current P&L

   EXPANDED STATE (on click):
   
   a) Natural Language Summary:
      "Bought BTC spot $2,000 (4% of capital). Rationale: ①Whale addresses net inflow to exchanges $150M within 2h, historically 72% probability of short-term upside; ②BTC broke above 4h Bollinger upper band, momentum signal bullish; ③Fear & Greed Index rose from 25 to 45, sentiment recovering. Combined confidence 72%."
   
   b) Signal Evidence Chain (tree structure):
      - Signal 1: Whale Inflow [Weight 35%] → Bullish (8/10)
        └─ Data: "3 transfers >$50M BTC to Binance within 2h"
      - Signal 2: Technical Breakout [Weight 30%] → Bullish (7/10)
        └─ Data: "4h close above Bollinger upper band ($67,200), ATR=1,850"
      - Signal 3: Sentiment [Weight 20%] → Neutral-Bullish (5/10)
        └─ Data: "Fear & Greed=45, Twitter sentiment=0.52"
      - Signal 4: Macro [Weight 15%] → Neutral (3/10)
        └─ Data: "No major releases, DXY stable at 104.2"
      - FUSION RESULT: Bullish | Confidence 72% | Suggested Position 4%
   
   c) Execution Timeline:
      [10:32:15] Market Perception: Whale transfer detected
      [10:32:18] Analysis: LLM classifies "potential bullish", confidence 65%
      [10:32:20] Analysis: Quant confirms Bollinger breakout, confidence → 72%
      [10:32:22] Strategy: Matches "Trend Following", calculates entry & size
      [10:32:23] Risk Control: Check passed — 4% < 5% limit, risk 1.2% < 2% limit
      [10:32:25] Execution: Submit limit buy $67,250
      [10:32:31] Execution: Filled $67,248 (slippage 0.003%)
   
   d) Outcome section:
      - "Current P&L: +$312 (+1.4%)" with sparkline
      - "This signal pattern's 30-day win rate: 64%" 
      - "Avg win/loss ratio for this pattern: 1.8:1"

3. Second decision entry (collapsed):
   "09:15  🟢 SELL  SOL/USDT  │  Confidence: 85%  │  ✓ Completed +$156"

4. Third decision entry (collapsed):
   "Yesterday  🔧 ADJUST  BTC Stop-Loss  │  RL Optimization  │  $63K → $64.8K"

EXPECTED BEHAVIORS:
- Clicking a collapsed entry smoothly expands it (pushes content below down)
- Clicking an expanded entry collapses it
- Only one entry expanded at a time (accordion behavior)
- Signal evidence tree: each signal node can be further expanded to see raw data
- Execution timeline: animated line connecting steps, step-by-step reveal
- Filter controls: filtering updates the timeline in real-time
- Outcome section shows live P&L for open positions, final P&L for closed ones

CONSTRAINTS:
- Dark theme per design system
- Desktop: 1440px, full content area with sidebar
- Timeline must feel like a "story" — not a data dump
- Tree structure uses connecting lines (like a file explorer)
- Confidence badges color-coded: >70% green, 50-70% yellow, <50% grey
- This screen is THE trust-building mechanism — it must feel thorough and honest
```

---

## Screen 08: 风控设置页

```
TASK:
Design the risk control settings page where users configure their safety boundaries — the hard limits that AI can never override.

CONTEXT:
Accessed via ⚙️ Settings sidebar → "Risk Controls" tab. This is where users manage their financial safety net. Must feel empowering (you're in control) not restrictive (these are constraints).

KEY DESIGN ELEMENTS:

1. Top bar:
   - Back arrow "← Settings"
   - Title: "Risk Control Center"
   - Status indicator: "🟢 All Protections Active" or "🔴 AI Trading Paused"

2. Emergency Stop card (topmost, prominent):
   - Full-width card with #F6465D left border
   - Large icon: emergency stop button
   - "Emergency Stop: Pause All AI Trading"
   - Toggle switch (currently OFF = AI running, green)
   - When ON (AI paused): card turns red-tinted, text changes to "AI Trading is PAUSED — Only manual close of existing positions allowed"
   - Subtext: "Existing positions are preserved. No new trades will be opened."

3. User-Level Risk Parameters section:
   Section header: "Your Safety Boundaries" + lock icon + "AI cannot bypass these"
   
   4 parameter rows, each containing:
   - Parameter name + ⓘ tooltip icon (left)
   - Visual slider (center)
   - Current value display (right, Mono, large)
   - Min/Max labels at slider ends
   
   a) Max Loss Per Trade: slider 1%-5%, default 2%, showing "2%"
      - Tooltip: "If a single trade loses more than this % of your capital, AI stops and alerts you"
   
   b) Max Daily Loss: slider 3%-10%, default 5%, showing "5%"
      - Tooltip: "When daily cumulative loss hits this limit, AI stops opening new positions"
   
   c) Max Weekly Loss: slider 5%-20%, default 10%, showing "10%"
      - Tooltip: "When weekly loss hits this limit, AI enters close-only mode"
   
   d) Max Single Position: slider 20%-80%, default 50%, showing "50%"
      - Tooltip: "No single token position can exceed this % of total capital"

4. Cooling Period notice card:
   - ⏳ icon + "All risk limit changes take effect after 24-hour cooling period"
   - Subtext: "This prevents emotionally loosening limits during market stress"

5. Operation Authorization section:
   Section header: "What Can AI Do Without Asking You?"
   
   3-column layout:
   
   Column 1 — "🟢 Auto-Execute" (#00D4AA header):
   - ✓ Daily strategy execution
   - ✓ Small-position take-profit/stop-loss
   - ✓ Parameter micro-adjustments (RL)
   - ✓ Routine rebalancing
   
   Column 2 — "🟡 Ask First" (#FCD535 header):
   - ! New strategy activation
   - ! Large trades (>50% of per-trade limit)
   - ! Leverage above default
   - ! Strategy architecture switch
   
   Column 3 — "🔴 Never Allow" (#F6465D header):
   - ✕ Leverage above hard limit
   - ✕ Simultaneous long+short (non-arbitrage)
   - ✕ Withdrawal operations
   - ✕ Positions without stop-loss

6. System-Level Alerts section:
   - Table of recent system-level risk events:
     - "10:45 | ⚠️ Abnormal frequency detected — 6 trades in 3 min — Auto-paused 30 min" 
     - "Yesterday | 🔴 Exchange API timeout rate 8% — Switched to conservative mode"
   - Each row: timestamp | severity icon | description | action taken

EXPECTED BEHAVIORS:
- Emergency Stop toggle: flipping it shows confirmation modal "Are you sure? This will pause all AI trading."
- Slider changes: value label updates in real-time with color coding (green at default, yellow when moved, red at extreme)
- After slider change: small toast notification "Changes saved. Takes effect in 24h (cooling period)"
- ⓘ tooltips: hover reveals explanation, click pins it open
- Operation authorization columns: items are informational only (not editable toggles) — these are system design constants
- System alerts table: scrollable, newest first

CONSTRAINTS:
- Dark theme per design system
- Desktop: 1440px, full content area with sidebar
- Emergency Stop is the MOST prominent element — must be visible without scrolling
- Sliders must feel precise — not fiddly
- The page should feel like a "control room" — calm, powerful, clear
```

---

## Screen 09: 市场感知仪表盘

```
TASK:
Design the market perception dashboard showing multi-dimensional market data — on-chain activity, social sentiment, technical indicators, and macro events in a unified view.

CONTEXT:
Accessed via a "Market" tab or from the market overview section on the main dashboard. This is for users who want to see what AI is "seeing" — the raw signals that feed into AI's decisions.

KEY DESIGN ELEMENTS:

1. Top bar:
   - Title: "Market Perception"
   - Subtitle: "What AI is watching right now"
   - Time selector: "Live" (green dot) | "1H" | "4H" | "1D"

2. Market Radar (center, prominent):
   - Large 4-axis radar/spider chart (400x400px)
   - Axes: On-Chain (7/10) | Sentiment (6/10) | Technical (8/10) | Macro (5/10)
   - Filled area with gradient (#00D4AA)
   - Hover on axis: shows detailed breakdown tooltip
   - Overall assessment badge: "Ranging-Bullish" (#00D4AA pill)

3. Four signal dimension cards (2x2 grid below radar):

   a) On-Chain card (🟢 icon):
      - "Whale Alert: 3 transfers >$50M to Binance (2h)" — with source address truncated
      - "Exchange Net Flow: +2,300 BTC (24h)" — inflow arrow
      - "Active Addresses (7d avg): 1.02M — ATH" — with mini trend arrow ↑
      - "DEX TVL Change: Uniswap +2.3%, Curve -0.8%" — red/green

   b) Sentiment card (🟡 icon):
      - "Fear & Greed Index: 48 (Neutral)" — with gauge visualization (half-circle)
      - "Twitter/X Sentiment: 0.52 (slightly bullish)" — with emoji indicator
      - "Top KOL Mentions: 'BTC breakout' trending (2h)" — with frequency bar
      - "News Alert: CoinDesk — 'SEC delays ETF decision'" — with sentiment tag [Neutral]

   c) Technical card (🔵 icon):
      - "RSI (4H): 62 — approaching overbought zone" — with RSI gauge
      - "MACD: Bullish crossover confirmed (4H)" — with mini MACD chart
      - "Bollinger: Price near upper band, ATR=1,850" — with band position indicator
      - "OI Change: +12% (4h) — new positions opening" — with OI mini chart

   d) Macro card (⚪ icon):
      - "FOMC Minutes Release: Tomorrow 14:00 ET" — countdown timer
      - "CPI Data: Next release in 3 days" — calendar icon
      - "BTC-NASDAQ Correlation: 0.75 (elevated)" — with correlation chart
      - "DXY: 104.2 (stable, -0.1% today)" — with mini chart

4. Event Timeline (bottom, full-width card):
   - Horizontal scrollable timeline of upcoming macro events
   - Each event: time | icon | description | expected impact (Low/Medium/High)
   - Example: "Tomorrow 14:00 | 📋 FOMC Minutes | Impact: High" (red badge)

EXPECTED BEHAVIORS:
- Radar chart axes: click to expand that dimension's card with more detail
- "Live" mode: numbers subtly update every few seconds (simulate with CSS transitions)
- Signal items: hover highlights the source, click shows full detail panel
- Fear & Greed gauge: animated fill based on value
- Event timeline: auto-scrolls to nearest upcoming event
- Each signal item has a relevance indicator: "Used by AI ✓" or "Not in current strategy"

CONSTRAINTS:
- Dark theme per design system
- Desktop: 1440px, full content area with sidebar
- Information-dense but organized — each card is self-contained
- Radar chart is the visual anchor — largest element on screen
- Real data feel — use realistic crypto values and terminology
```

---

## Screen 10: 策略管理页

```
TASK:
Design the strategy management page where users can view active strategies, browse strategy templates, and configure strategy parameters.

CONTEXT:
Accessed via a "Strategies" tab or sidebar. This is where intermediate and pro users spend time customizing their trading approach. Novices rarely visit this page — they rely on AI's auto-selection.

KEY DESIGN ELEMENTS:

1. Top bar:
   - Title: "Strategy Center"
   - Two tab pills: "My Strategies" (active) | "Strategy Library"
   - "+ New Strategy" button (#00D4AA, top-right)

2. Active Strategies section (under "My Strategies" tab):
   
   Strategy card 1 (Active):
   - Left: colored status dot (#00D4AA) + "Trend Following — BTC/USDT" (16px Semibold)
   - Tags row: "Perpetual" badge | "Long-biased" badge | "3x Leverage" badge
   - Performance metrics (4 items in a row):
     - "Return: +8.2%" (#00D4AA) | "Sharpe: 1.4" | "Max DD: -4.1%" | "Trades: 12"
   - Mini equity curve (100px tall sparkline)
   - Strategy health badge: "🟢 Healthy" or "🟡 Decaying — Sharpe declining 2 weeks"
   - Action buttons: [Pause] [Edit Parameters] [View Backtest]
   
   Strategy card 2 (Active):
   - "Grid Strategy — ETH/USDT"
   - Tags: "Spot" | "Ranging" | "No Leverage"
   - "Return: +3.1%" | "Sharpe: 0.8" | "Max DD: -1.2%" | "Trades: 34"
   - Health: "🟢 Healthy"
   - Actions: [Pause] [Edit Parameters] [View Backtest]

   Strategy card 3 (Paused):
   - "DCA Strategy — SOL/USDT"
   - Tags: "Spot" | "Accumulation"
   - Dimmed/greyed out appearance (opacity 0.6)
   - Status: "⏸️ Paused — User stopped on May 9"
   - Actions: [Resume] [Edit] [Delete]

3. Strategy Library tab (when clicked):
   - Search bar: "Search strategies..." with filter pills: "All | Trend | Grid | DCA | Arbitrage | Mean Reversion"
   
   - Strategy template cards (3-column grid):
     Each card:
     - Strategy name + icon
     - One-line description
     - "Best for" label: e.g., "Ranging markets"
     - Key metrics: "Avg Return: +5.2% | Win Rate: 58% | Complexity: ★★☆"
     - [Add to Portfolio] button
   
   Cards:
     a) "Trend Following" — 📈 — "Ride momentum with ATR-based stops" — "Trending markets"
     b) "Grid Trading" — 🔲 — "Buy low, sell high in a range" — "Ranging markets"  
     c) "Dollar Cost Average" — 💰 — "Accumulate over time regardless of price" — "Any market"
     d) "Funding Rate Arbitrage" — ⚖️ — "Earn from perpetual funding rate differentials" — "High funding rate environments"
     e) "Mean Reversion" — 🔄 — "Buy oversold, sell overbought" — "High volatility, no clear trend"

4. Strategy Parameter Editor (slide-in panel from right, 480px):
   Triggered by "Edit Parameters" on an active strategy.
   - Strategy name at top
   - Parameter groups (collapsible sections):
     - "Entry Conditions": RSI threshold slider, MACD toggle, Volume filter input
     - "Position Sizing": Max position %, Scaling method dropdown
     - "Exit Conditions": Take-profit %, Stop-loss method (ATR multiple / fixed %), Trailing stop toggle
     - "Risk Management": Max concurrent positions, Max daily trades
   - "Apply Changes" button (#00D4AA) + "Reset to AI Default" link
   - Note: "Parameter changes require AI confirmation for safety"

EXPECTED BEHAVIORS:
- Active strategy cards: click to expand performance details inline
- Health badge: clicking "Decaying" shows a mini chart of declining Sharpe over 2 weeks
- "Edit Parameters": opens the right-side panel with current values pre-filled
- "View Backtest": navigates to a backtest results view (separate screen, can be simplified)
- Strategy Library search: filters template cards in real-time as user types
- "Add to Portfolio": shows confirmation card "Add [Strategy] to your active strategies?"
- Parameter sliders: real-time preview of how changes affect historical performance (mini chart updates)
- Pause/Resume: toggle with confirmation toast

CONSTRAINTS:
- Dark theme per design system
- Desktop: 1440px, full content area with sidebar
- Active strategies section is the default view — most users manage existing strategies
- Strategy Library is for discovery — browse-friendly, visually appealing cards
- Parameter editor must feel powerful but not overwhelming — progressive disclosure
- All performance numbers in Mono font
```

---

## 使用指南：如何将这些 Prompt 喂给 Figma Make

### 推荐执行顺序

```
Step 1: 新建 Figma 文件 → 安装 Figma Make 插件
Step 2: 将 Screen 00 (Make Kit 设计系统) 的内容作为首条 Prompt 的前缀
Step 3: 按 Screen 01 → 02 → 03 → 04 → 05... 的顺序逐屏生成
Step 4: 每屏生成后检查，必要时用 Follow-up Prompt 微调
Step 5: 全部屏幕生成后，用 Figma Make 的交互模式连接屏幕跳转
Step 6: 导出为可分享的原型链接
```

### Follow-up Prompt 模板

当生成结果需要微调时，使用以下模板：

```
[屏幕编号] needs the following adjustments:
1. [具体问题描述，如 "The PnL section is too small and gets lost"]
2. [期望修正，如 "Make the PnL value 32px and the section span full width"]

Keep everything else the same. Do not change the color scheme, layout structure, or other elements.
```

### 常见问题修正 Prompt

| 问题 | Follow-up Prompt |
|------|------------------|
| 布局太窄 | "Expand the content area to use the full 1440px width. Reduce sidebar to 64px icon-only." |
| 颜色不对 | "All backgrounds must be #0B0E11 (page) and #1E2329 (cards). Accent color is #00D4AA only." |
| 数据看起来假 | "Replace placeholder text with realistic crypto trading data. Use actual price levels for BTC ($67,000 range), ETH ($3,800 range)." |
| 交互不工作 | "Make the [element] clickable. On click, show [specific behavior]. Use CSS transitions for smooth animation." |
| 信息层次不对 | "The [element] should be the most visually prominent on this screen. Increase its font size and give it more vertical space." |
