# Subscription Page (`/subscription`)

Full subscription lifecycle management: view current plan, upgrade/downgrade, cancel, renewal settings, and expiration handling. Clean, clear, and frictionless.

---

## Layout

### Page Shell
```
Same sidebar + top bar as dashboard (see dashboard.md)
Main content: bg slate-50, min-height: calc(100vh - 64px)
padding: 32px
max-width: 900px (centered, narrower for focus)
```

### Page Header
```
Margin-bottom: 32px

"Subscription" — heading-1, slate-900
"Manage your plan, billing cycle, and renewal preferences." — body-small, slate-500, mt-4px
```

---

## Section 1: Current Plan Status

```
bg: white
border: 1px solid slate-200
border-radius: 16px
padding: 32px
margin-bottom: 24px
```

### Active Plan Header
```
Flex, align-center, justify-between

Left (flex, align-center, gap: 16px):
  Plan badge: "Pro" / "Premium" — plan-specific style (from design.md badges)
  Text block:
    "Pro Plan — Monthly" — heading-3, slate-900
    "Renews on March 15, 2024" — body-small, slate-500

Right:
  Status badge: "Active" — bg-emerald-50, text-emerald-600, caption, rounded-full
  + small dot indicator (8px, emerald-500, animated pulse)
```

### Plan Details Grid
```
Grid: 4 columns (lg), 2 columns (md), 1 column (sm)
gap: 24px, margin-top: 24px
```

**Detail cards:**
```
Each:
Label: caption, slate-500
Value: body, weight 600, slate-900
```

1. **Monthly Cost** — "$9.99" + "/month" (caption, slate-500)
2. **Next Billing** — "Mar 15, 2024" + "in 23 days" (caption, emerald-600)
3. **Payment Method** — "Visa •••• 4242" + "Change" link (caption, amber-600)
4. **Started On** — "Oct 15, 2023" + "5 months" caption

### Usage Overview (Progress Bars)
```
Margin-top: 24px
border-top: 1px solid slate-100
padding-top: 24px
```

**Each metric:**
```
Flex, justify-between, margin-bottom: 4px
Label: "Transactions" — body-small, slate-600
Value: "342 / Unlimited" — caption, slate-500

Progress bar:
  Height: 6px, bg: slate-100, rounded-full
  Fill: emerald-500 (if < 80%), amber-500 (if 80-95%), rose-500 (if > 95%)
  "Unlimited" shows full emerald bar with "∞" label
```

**Metrics:**
- Transactions: 342 / Unlimited (emerald, full bar)
- Budgets: 3 / 5 (amber, 60%)
- Debts: 4 / 10 (emerald, 40%)
- Goals: 2 / 5 (emerald, 40%)
- Team Members: 1 / 5 (emerald, 20%) — Premium only

### Animation
```
Card: fade up, 400ms, ease-out-expo
Detail cards: stagger 60ms, fade up + translateY(12px→0)
Progress bars: width 0→target%, 800ms ease-out, delay 300ms, stagger 80ms
Status dot: pulse animation (opacity 1→0.3→1), 2s infinite
```

---

## Section 2: Change Plan

```
bg: white
border: 1px solid slate-200
border-radius: 16px
padding: 32px
margin-bottom: 24px
```

### Header
```
"Change Your Plan" — heading-3, slate-900
"Switch between plans at any time. Changes take effect at your next billing cycle." — body-small, slate-500, mt-4px
```

### Billing Cycle Toggle
```
Flex, centered, gap: 16px, margin: 24px 0
"Monthly" | Switch | "Annual"
Annual badge: "Save 20%" — emerald style
```

### Plan Comparison Cards
```
3-column grid (lg), 1-column (mobile)
gap: 16px, margin-top: 24px
```

**Free Card:**
```
bg: slate-50
border: 1px solid slate-200
border-radius: 12px
padding: 24px
opacity: 0.7

Header: "Free" badge (slate)
Price: "$0" — heading-2, slate-900

Features (compact list, caption, slate-500):
  • 50 transactions/month
  • 1 budget
  • Basic analytics

CTA: "Downgrade to Free" — secondary button, full width, mt-16px
  — Warning: "You'll lose Pro features at end of billing cycle"
  — Only visible if on paid plan
```

**Pro Card (Current):**
```
bg: amber-50/50
border: 2px solid amber-500
border-radius: 12px
padding: 24px
position: relative

"Current Plan" badge: absolute top-right
  bg: amber-500, text white, caption, rounded-full

Header: "Pro" badge (amber)
Price: "$9.99" / "$7.99 annual" — heading-2, slate-900

Feature list (with checkmarks for included features)

CTA: "Current Plan" — disabled button, amber bg, opacity 0.6
  — Or: "Renew Early" if approaching expiration
```

**Premium Card:**
```
bg: white
border: 1px solid slate-200
border-radius: 12px
padding: 24px
hover: border-color amber-300

Header: "Premium" badge (premium gradient style)
Price: "$19.99" / "$15.99 annual" — heading-2, slate-900

Feature list (all features, checkmarks)

CTA: "Upgrade to Premium" — primary amber-gradient button, full width
"Upgrade and get 20% off your first month" — caption, amber-600, mt-8px
```

### Change Confirmation Modal
```
Triggered on: downgrade or upgrade click

shadcn Dialog, max-width: 440px

Title: "Change to [Plan]?"
Content:
  — "Your current Pro plan ends on March 15, 2024."
  — "Your new [Plan] will start on March 15, 2024."
  — "You'll be charged $[amount] on March 15, 2024."

CTA: "Confirm Change" — primary amber
Secondary: "Keep Current Plan" — ghost button
```

### Animation
```
Cards: stagger 80ms, fade up, 400ms
Current plan badge: subtle scale pulse 1→1.05→1, 3s infinite
Hover on upgrade card: translateY(-4px), border-color transition, 200ms
Confirm modal: scale(0.95→1), opacity(0→1), 250ms, ease-bounce
```

---

## Section 3: Renewal & Cancellation

```
bg: white
border: 1px solid slate-200
border-radius: 16px
padding: 32px
margin-bottom: 24px
```

### Header
```
"Renewal Settings" — heading-3, slate-900
```

### Auto-Renew Toggle
```
Flex, align-center, justify-between, padding: 20px 0, border-bottom 1px slate-100

Left:
  "Automatic Renewal" — body-small, weight 600, slate-900
  "Your subscription renews automatically on March 15, 2024" — caption, slate-500

Right: shadcn Switch
  — Checked: emerald bg
  — Unchecked: slate bg
```

### Cancel Subscription (Danger Zone)
```
Margin-top: 24px
padding: 20px
bg: rose-50
border: 1px solid rose-200
border-radius: 12px
```

**Content:**
```
Flex, align-center, justify-between

Left:
  AlertTriangle icon (20px, rose-500)
  Text block:
    "Cancel Subscription" — body-small, weight 600, rose-700
    "Your access continues until March 15, 2024" — caption, rose-500

Right: "Cancel Plan" — small button, bg white, border rose-300, text rose-600
  hover: bg-rose-100
```

### Cancellation Flow

**Step 1: Confirmation Dialog**
```
shadcn Dialog, max-width: 480px
bg: white

AlertTriangle icon (48px, rose-500, mx-auto)

"Are you sure you want to cancel?" — heading-2, slate-900, text-center, mt-16px

"Your Pro plan will remain active until March 15, 2024. After that, you'll be downgraded to the Free plan." — body, slate-500, text-center, mt-12px

Retention offer (if eligible):
  bg: amber-50, border: amber-200, rounded-10px, p-16px, mt-24px
  "Wait! Get 50% off your next 3 months." — body-small, weight 600, amber-800
  "Stay on Pro for just $4.99/month." — body-small, slate-600
  "Claim Offer" — small amber button, mt-8px

Actions (flex, gap: 12px, mt-24px):
  "Keep My Plan" — secondary button (flex-1)
  "Yes, Cancel" — small button, bg-rose-500, text white (flex-1)
```

**Step 2: Feedback Form (optional)**
```
Dialog updates after confirm:
"Help us improve" — heading-3, slate-900
"Why are you leaving?" — body-small, slate-500

Radio group (shadcn):
  • Too expensive
  • Missing features I need
  • Switching to another tool
  • Temporary — I'll be back
  • Other

"Brief feedback (optional)" — textarea, dark style
"Submit & Cancel" — rose button
"Skip" — ghost button
```

**Step 3: Cancellation Confirmed**
```
CheckCircle icon (48px, emerald-500)
"Your subscription has been canceled" — heading-3, slate-900
"You'll have access to Pro until March 15, 2024. You can resubscribe anytime." — body, slate-500

"Resubscribe" — primary amber button
"Go to Dashboard" — ghost button
```

### Animation
```
Section: fade up, 400ms
Toggle: scale(0.95→1) on entrance, 200ms
Cancel button hover: bg rose-100, 150ms
Cancel dialog: scale(0.92→1), 300ms, ease-out-expo
Retention offer: fade in with delay 0.2s after dialog opens
Confirmed state: icon scale(0.8→1), 300ms, ease-bounce
```

---

## Section 4: Billing History Summary

```
bg: white
border: 1px solid slate-200
border-radius: 16px
padding: 24px
```

### Header
```
Flex, justify-between, align-center, mb-16px
"Recent Charges" — heading-3, slate-900
"View All →" — caption, amber-600, routes to /billing
```

### Compact List
```
Flex-col, gap: 0
```

**Each row:**
```
Flex, align-center, justify-between
padding: 12px 0
border-bottom: 1px solid slate-100 (last: none)

Left:
  "Pro Plan — Monthly" — body-small, weight 500, slate-900
  "Feb 15, 2024" — caption, slate-500

Right:
  "$9.99" — body-small, weight 600, slate-900
  "Paid" badge — emerald style, caption
```

### Animation
```
Section: fade up, 400ms
Rows: stagger 50ms, fade up, 300ms
```

---

## Expired Subscription State

When subscription expires (not canceled, just expired):

### Banner (shown at top of page)
```
bg: rose-50
border: 1px solid rose-200
border-radius: 12px
padding: 20px 24px
margin-bottom: 24px
display: flex, align-items: center, gap: 16px
```

**Content:**
```
AlertTriangle icon (24px, rose-500)
Text block:
  "Your Pro subscription has expired" — body-small, weight 600, rose-700
  "Renew now to regain access to Pro features." — caption, rose-500
"Renew Now" — small amber button, ml-auto
```

### Locked Features Preview
```
Cards show "Expired" overlay:
  bg: navy-950/60 backdrop-blur-sm
  Lock icon + "Renew to unlock" text
  "Renew Pro" button (small amber)
```

### Animation
```
Banner: slide down from top, 300ms, ease-out
Lock overlays: fade in, 200ms
Renew button: pulse glow, 2s infinite
```

---

## Component Notes

### Plan Change Logic
- **Upgrade:** Immediate access to new features, prorated charge for remainder of cycle
- **Downgrade:** New features hidden at end of current cycle, no refund
- **Same-tier cycle change:** Price change at next billing date

### Cancellation Grace Period
- Full access until end of paid period
- Can resubscribe anytime (no data loss)
- Retention offer shown once per cancellation attempt

### Responsive
- Desktop: full layout, 3-col plan cards
- Tablet: 2-col plan cards, stacked details
- Mobile: single column, compact plan cards with expandable feature lists
