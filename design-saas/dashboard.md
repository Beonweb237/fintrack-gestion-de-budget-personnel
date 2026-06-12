# Dashboard Page (`/dashboard`)

The main application dashboard enhanced with SaaS features: subscription status widget, feature gating overlays, upgrade nudges, and internationalization support. All existing functionality is preserved and enhanced.

---

## Layout

### Top Bar
```
Height: 64px
bg: white
border-bottom: 1px solid slate-200
padding: 0 32px
display: flex, align-items: center, justify-content: space-between
position: sticky, top: 0, z-40
```

**Left:**
```
Logo mark: 28px
Breadcrumb: "Dashboard" — heading-3, slate-900
```

**Right (flex, gap: 16px, align-center):**
```
Plan badge: "Free" / "Pro" / "Premium" — plan-specific badge style (from design.md)
  — Free: inline upgrade nudge link next to badge
Notification bell: icon button, slate-500, with dot indicator for unread
Language switcher: compact (flag only)
User avatar: 36px circle, border 2px slate-200
```

### Page Layout
```
Sidebar (240px, desktop only) + Main content (flex-1)
Mobile: bottom nav or hamburger
```

### Sidebar Navigation
```
bg: slate-50
border-right: 1px solid slate-200
width: 240px
height: calc(100vh - 64px)
padding: 24px 16px
position: sticky, top: 64px
```

**Nav items:**
```
Each: flex, align-center, gap: 12px
padding: 10px 16px
border-radius: 8px
text: body-small, weight 500

Active: bg amber-50, text amber-700, icon amber-600
Inactive: text slate-600, hover: bg slate-100, hover: text slate-900
Icon: 20px
Transition: all 150ms ease
```

**Items:**
1. Dashboard (LayoutDashboard) — active
2. Transactions (Receipt) — "50/50" badge for Free users
3. Budgets (PieChart) — "1/1" badge for Free users
4. Debts (TrendingDown) — "2/2" badge for Free users
5. Objectifs (Target) — "1/1" badge for Free users
6. Analytics (BarChart3) — lock icon for Free users
7. Billing (CreditCard) — Pro/Premium only, lock for Free
8. Settings (Settings)

**Locked nav items (Free plan):**
```
Opacity: 0.5
Icon: Lock (16px) appended
Click: opens upgrade modal instead of navigating
```

---

## Section 1: Subscription Status Widget

**Position:** Top of dashboard, full width
**Visibility:** Always visible, plan-aware

```
bg: white
border: 1px solid slate-200
border-radius: 12px
padding: 20px 24px
display: flex, align-items: center, justify-content: space-between
margin-bottom: 24px
shadow: 0 1px 3px rgba(0,0,0,0.05)
```

### Free User Version
```
Left (flex, align-center, gap: 16px):
  Sparkles icon (24px, amber-500)
  Text block:
    "Unlock more features with Pro" — body-small, weight 600, slate-900
    "You're using 45 of 50 monthly transactions." — caption, slate-500

Right:
  "Upgrade to Pro" — small primary amber button
  "Maybe later" — ghost button, caption, slate-400
```

**Usage bar:**
```
Margin-top: 12px (full width below)
Height: 6px, bg: slate-100, border-radius: 3px, overflow: hidden
Fill: amber-500, width: 90% (45/50), border-radius: 3px
Transition: width 500ms ease-out on load
```

### Pro/Premium User Version
```
Left (flex, align-center, gap: 16px):
  CheckCircle icon (24px, emerald-500)
  Text block:
    "Pro plan active" / "Premium plan active" — body-small, weight 600, slate-900
    "Next billing: March 15, 2024 — $9.99" — caption, slate-500

Right:
  "Manage" — ghost button, caption → routes to /subscription
```

**Progress ring (optional, Premium):**
```
Circular progress indicator showing days until next billing
48px diameter, strokeWidth: 4px
Track: slate-100, Fill: emerald-500
Percentage: daysRemaining / 30
```

### Animation
```
Widget entrance: fade up, 400ms, ease-out-expo
Usage bar fill: width 0→90%, 800ms, ease-out, delay 200ms
Upgrade button: subtle pulse glow (amber-500/10), 2s infinite
Dismiss "Maybe later": fade out + collapse height, 200ms
```

---

## Section 2: Stats Overview

### Layout
```
4-column grid (lg), 2-column (md), 1-column (sm)
gap: 16px
margin-bottom: 24px
```

### Stat Cards
```
bg: white
border: 1px solid slate-200
border-radius: 12px
padding: 20px
```

**Each card:**
```
Label: caption, slate-500, uppercase, letter-spacing 0.03em
Value: font: heading-1 (36px), slate-900, weight 700, mt-4px
  — Currency values use JetBrains Mono
Change: flex, align-center, gap: 4px, mt-8px
  — Positive: emerald-500, TrendingUp icon (14px)
  — Negative: rose-500, TrendingDown icon (14px)
  — "+12.5% from last month" — caption
```

**Cards:**
1. **Total Balance** — "$12,450.00" — "+5.2%"
2. **Monthly Income** — "$4,200.00" — "+2.1%"
3. **Monthly Expenses** — "$2,890.00" — "-8.4%" (positive trend)
4. **Savings Rate** — "31.2%" — "+4.3%"

### Animation
```
Cards: stagger 60ms, fade up + translateY(16px→0), 400ms, ease-out-expo
Counter: CountUp from 0, duration 1200ms, delay 200ms after card visible
```

---

## Section 3: Charts Row

### Layout
```
2-column grid (lg), 1-column (sm)
gap: 16px
margin-bottom: 24px
```

### Card 1: Spending Overview (Area Chart)
```
bg: white
border: 1px solid slate-200
border-radius: 12px
padding: 24px
```

**Header:**
```
"Spending Overview" — heading-3, slate-900
Period selector: shadcn Select — "This Month" / "Last 3 Months" / "This Year"
  — caption, slate-500
```

**Chart:**
```
Recharts AreaChart
Height: 280px
Data: monthly spending over 6 months
Gradient fill: amber-500/20 → transparent
Stroke: amber-500, 2px
Grid: slate-100, dashed
Tooltip: white bg, slate-900 text, amber accent
X-axis: month labels (Jan, Feb, Mar...)
Y-axis: currency values
```

### Card 2: Budget Progress (Radial Bars)
```
Same card styling
```

**Header:**
```
"Budget Status" — heading-3, slate-900
"2 of 2 active" — caption, slate-500 (Free user indicator)
```

**Radial bars:**
```
Recharts RadialBarChart
2-3 rings showing budget utilization
Colors: emerald-500 (< 80%), amber-500 (80-95%), rose-500 (> 95%)
Center: total remaining amount
Legend below: category name + percentage
```

**Free user gate:**
```
If Free and at budget limit:
  Overlay at bottom: "Upgrade to Pro for 5 budgets"
  bg: amber-50, border-top: amber-200, p-12px
  text: caption, amber-700
  link: "Upgrade →"
```

### Animation
```
Cards: fade up, 400ms, stagger 100ms
Area chart: draw from left, 1200ms, ease-out
Radial bars: animate from 0, 800ms, ease-out-expo
```

---

## Section 4: Recent Transactions + Quick Actions

### Layout
```
2-column (lg): 2/3 transactions + 1/3 quick actions
1-column (sm): stacked
```

### Recent Transactions Card
```
bg: white
border: 1px solid slate-200
border-radius: 12px
padding: 24px
```

**Header:**
```
"Recent Transactions" — heading-3, slate-900
"View all →" — caption, amber-600, hover: underline
```

**Transaction list:**
```
Flex-col, gap: 0 (divider between items)
Max: 5 items visible, "View all" link if more
```

**Each row:**
```
Flex, align-center, justify-between
padding: 12px 0
border-bottom: 1px solid slate-100 (last: none)

Left (flex, align-center, gap: 12px):
  Category icon: 36px circle, bg slate-100, icon slate-600, centered
  Text block:
    Merchant name — body-small, weight 500, slate-900
    Category + date — caption, slate-500

Right:
  Amount — body-small, weight 600, slate-900 (or rose-500 for expenses)
```

### Quick Actions Card
```
bg: white
border: 1px solid slate-200
border-radius: 12px
padding: 24px
```

**Header:**
```
"Quick Actions" — heading-3, slate-900
```

**Action buttons (flex-col, gap: 8px):**
```
Each: flex, align-center, gap: 12px
padding: 12px 16px
border-radius: 8px
hover: bg-slate-50
transition: 150ms

Icon (20px) + Label (body-small, weight 500)
```

1. PlusCircle (emerald-600) + "Add Transaction" — bg emerald-50 on hover
2. PieChart (amber-600) + "Create Budget"
3. Target (amber-600) + "Set a Goal"
4. FileText (slate-600) + "Generate Report" — lock icon for Free
5. Users (slate-600) + "Invite Team Member" — Premium only, lock for others

### Animation
```
Cards: fade up, 400ms
Transaction rows: stagger 40ms, fade right + translateX(-8px→0), 300ms
Action buttons: stagger 50ms, fade up, 300ms
```

---

## Section 5: Feature Gate Modal

Triggered when Free user clicks a locked feature.

### Modal (shadcn Dialog)
```
Overlay: bg-navy-950/70, backdrop-blur-sm
Card: bg-white, border slate-200, rounded-16px, max-width: 420px
```

**Content:**
```
Lock icon (48px) inside 64px circle, bg amber-50, text amber-500, mx-auto

"Upgrade to unlock [Feature Name]" — heading-2, slate-900, text-center, mt-20px

"[Feature Name] is available on Pro and Premium plans. Upgrade now to get access." — body, slate-500, text-center, mt-12px

Feature list (flex-col, gap: 8px, mt-24px, max-width: 280px, mx-auto):
  Each: Check icon (16px, emerald-500) + feature description (body-small, slate-600)
  — Dynamic based on clicked feature

CTA: "Upgrade to Pro — $9.99/mo" — primary amber, full width, mt-24px
Secondary: "Learn more about plans →" — caption, amber-600, text-center, mt-12px
  → routes to /pricing

"No thanks" — ghost button, caption, slate-400, mt-8px
```

### Animation
```
Overlay: opacity 0→1, 200ms
Card: scale(0.92→1), opacity(0→1), 300ms, ease-bounce
Lock icon: subtle shake on open (rotate -5°→5°→0, 400ms)
```

---

## Section 6: Usage Limit Toast

Triggered when Free user hits a limit (e.g., tries to add 51st transaction).

### Toast (shadcn Sonner/Toast)
```
Position: bottom-right
bg: white
border: 1px solid amber-200
border-radius: 12px
padding: 16px 20px
shadow: 0 8px 24px rgba(0,0,0,0.1)
display: flex, align-items: center, gap: 12px
```

**Content:**
```
AlertTriangle icon (20px, amber-500)
Text block:
  "Monthly limit reached" — body-small, weight 600, slate-900
  "Upgrade to Pro for unlimited transactions." — caption, slate-500
"Upgrade" button — small amber, ml-auto
Close: X icon button, slate-400
```

**Auto-dismiss:** 8 seconds

### Animation
```
Enter: translateX(100%→0), opacity 0→1, 300ms, ease-out-expo
Exit: translateX(0→100%), opacity 1→0, 200ms, ease-in
```

---

## Component Notes

### Plan Badge in Top Bar
- Dynamically styled based on current plan
- Free: "Upgrade" text link beside badge
- Pro/Premium: badge only, routes to /subscription on click

### i18n Integration
- All dashboard labels use i18n keys
- Currency formatting via Intl.NumberFormat with selected currency
- Date formatting via Intl.DateTimeFormat with user locale
- "X days ago" relative time for transactions

### Data Fetching
- Stats: aggregated on load
- Transactions: paginated, last 5 shown
- Charts: last 6 months data
- All data refresh on plan change

### Responsive
- Desktop: full sidebar + 2-col grids
- Tablet: collapsed sidebar (icons only) + 2-col grids
- Mobile: bottom tab nav + 1-col stacked, compact padding
