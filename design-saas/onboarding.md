# Onboarding Page (`/onboarding`)

Post-signup user journey: Welcome → Choose Plan → Select Payment Method → Payment Details → Confirmation → Dashboard. A guided, multi-step flow with progress tracking and smooth transitions.

---

## Layout

```
min-height: 100vh
bg: navy-950
position: relative
overflow: hidden
```

**Background:** Same particle field + subtle grid as auth page, but more subdued (`opacity: 0.5`).

**Container:**
```
max-width: 720px (steps 1-2), 560px (steps 3-4)
mx-auto, padding-top: 48px (desktop), 24px (mobile)
padding-x: 24px
```

---

## Progress Header (Persistent)

```
Width: 100%, max-width: 480px, mx-auto, margin-bottom: 48px
```

**Step indicators:**
```
Flex row, justify-between, align-center, position: relative
4 steps
```

**Each step:**
```
Circle: 36px, border-radius: 9999px
  — Completed: bg emerald-500, text navy-950, Check icon (16px)
  — Active: bg amber-500, text navy-950, number
  — Pending: bg navy-800, border 1px navy-600, text slate-500, number
Number: font: caption, weight 700

Label below circle (text-center, mt-8px):
  font: micro, uppercase, letter-spacing 0.05em
  Active: text amber-400
  Completed: text emerald-400
  Pending: text slate-500

Connecting lines between steps (absolute, behind circles):
  height: 2px, bg navy-700
  Completed segment: bg emerald-500
  Pending segment: bg navy-700
```

**Steps:**
1. **Plan** — "Choose Plan"
2. **Payment** — "Payment"
3. **Confirm** — "Confirm"
4. **Done** — "Get Started"

### Animation
```
Step transitions:
  — Active circle: scale(0.9→1), opacity(0→1), 300ms, ease-bounce
  — Completed circle: fill animation bg navy-800→emerald-500, 400ms
  — Line fill: scaleX 0→1 from left, 400ms
```

---

## Step 1: Choose Your Plan

### Header
```
H1: "Choose your plan" — heading-1, white, text-center
Subtitle: "Start free or unlock more power with a paid plan." — body, slate-400, text-center
```

### Billing Toggle
```
Flex, centered, gap-16px, margin-top: 24px, margin-bottom: 32px
Same as landing pricing section
```

### Plan Cards
```
3-column grid (lg), 1-column stacked (mobile)
gap: 16px
```

**Card styling:** Same as landing pricing cards but slightly more compact (`padding: 32px`).

**Selection behavior:**
```
Click to select
Selected state: border-2 solid amber-500, ring-2 ring-amber-500/20
Check icon appears top-right of selected card (24px, amber-500 bg, white check)
Non-selected: opacity 0.7, hover: opacity 1
Transition: all 200ms ease
```

**Card contents:** Same features list as landing, abbreviated.

**Free card:**
- Badge: "Free"
- Price: "$0"
- Features: 50 txns/month, 1 budget, basic analytics

**Pro card:**
- Badge: "Pro", popular badge
- Price: "$9.99/mo" ($7.99 annual)
- Features: Unlimited txns, 5 budgets, Stripe payments

**Premium card:**
- Badge: "Premium", best value badge
- Price: "$19.99/mo" ($15.99 annual)
- Features: Unlimited everything, crypto, mobile money, AI insights

### Free Plan CTA
```
"Continue with Free" — secondary button, full width, mt-32px
→ Skips to Step 4 (Done)
```

### Paid Plan CTA
```
"Continue with [Plan]" — primary amber, full width, mt-32px
→ Advances to Step 2 (Payment)
```

### Animation
```
Cards: stagger entrance, opacity 0→1, translateY 24px→0, 400ms, stagger 80ms
Selection: border-color transition 200ms, check icon scale(0→1) with ease-bounce
```

---

## Step 2: Payment Method

### Header
```
Back button: "← Choose different plan" — ghost, caption, amber-400, mb-16px
H1: "How would you like to pay?" — heading-1, white
Subtitle: "Selected: [Plan Name] — $[Price]/month" — body, amber-400
```

### Payment Method Cards
```
Flex-col, gap: 12px
```

**Card styling:**
```
bg: navy-800
border: 1px solid navy-700
border-radius: 14px
padding: 20px 24px
display: flex, align-items: center, gap: 16px
cursor: pointer
```

**Method 1: Credit/Debit Card (Stripe)**
```
Icon area: payment-stripe.png (120×48, contained)
Text block:
  Title: "Credit or Debit Card" — body-small, weight 600, white
  Sub: "Visa, Mastercard, American Express" — caption, slate-400
Right: Radio indicator (24px circle, border 2px slate-600, selected: bg-amber-500 border-amber-500, white dot inside)
Selected: border-color amber-500/50, bg navy-800
```

**Method 2: Cryptocurrency**
```
Icon area: payment-crypto.png
Title: "Cryptocurrency"
Sub: "Bitcoin (BTC), Ethereum (ETH)"
Radio indicator
```

**Method 3: Mobile Money**
```
Icon area: payment-mobile-money.png
Title: "Mobile Money"
Sub: "MTN Mobile Money, Orange Money"
Radio indicator
```

### Selected Method Details

**If Card selected → expands below card:**
```
Margin-top: 16px
bg: navy-900
border: 1px solid navy-700
border-radius: 12px
padding: 24px
```

**Stripe Card Element form:**
```
Card number: dark input, placeholder "1234 5678 9012 3456", icon: CreditCard
Expiry + CVC row (flex, gap: 12px):
  — Expiry: dark input, placeholder "MM / YY"
  — CVC: dark input, placeholder "123", icon: Lock
Cardholder name: dark input, placeholder "Name on card"
```

**If Crypto selected → expands:**
```
Network selector: shadcn Select — "Bitcoin (BTC)" / "Ethereum (ETH)"
QR Code display: 200×200, centered, bg white padding 12px, border-radius 8px
Address text: mono font, truncated with copy button
"Send exactly $[amount] worth of [crypto] to the address above."
Caption: "Your plan will activate after 1 network confirmation."
```

**If Mobile Money selected → expands:**
```
Provider selector: shadcn Select — "MTN Mobile Money" / "Orange Money"
Phone number input: dark style, placeholder "+233 XX XXX XXXX"
"You will receive a prompt on your phone to complete the payment."
```

### CTA
```
"Pay $[Amount]" — primary amber, full width, mt-24px
  — Card: "Pay $9.99/month"
  — Crypto: "I've Sent the Payment"
  — Mobile: "Request Payment Prompt"
```

### Security Note
```
Flex, align-center, gap: 8px, justify-center, mt-16px
Lock icon (14px, slate-500) + "256-bit encrypted & secure" — caption, slate-500
```

### Animation
```
Step entrance: slide from right
  — opacity 0→1, translateX 30px→0, 400ms, ease-out-expo
Payment method cards: stagger 60ms, fade up
Selected method expand: height 0→auto, opacity 0→1, 300ms ease-default
Radio selection: circle fill 200ms, scale pulse 1→1.1→1 on select
```

---

## Step 3: Confirmation

### Header
```
H1: "Confirm your subscription" — heading-1, white, text-center
```

### Summary Card
```
bg: navy-800
border: 1px solid navy-700
border-radius: 16px
padding: 32px
margin-top: 32px
```

**Plan summary:**
```
Flex between, align-center:
  Left:
    Plan badge: [Plan Name]
    "Billed: Monthly" / "Billed: Annually (save 20%)" — caption, slate-400
  Right:
    "$9.99/month" — heading-3, white

Divider: 1px navy-700, my-20px

Payment method row:
  Icon: method icon (20px)
  "Visa ending in 4242" / "Bitcoin (BTC)" / "MTN Mobile Money (+233...)"
  caption, slate-300

Divider: 1px navy-700, my-20px

Total row:
  "Total today" — body-small, slate-400
  "$9.99" — heading-2, white
  "+ applicable taxes" — caption, slate-500

Free trial note (if applicable):
  "Your 14-day free trial starts today. You won't be charged until [date]."
  bg: emerald-500/10, border: emerald-500/20, rounded-8px, p-12px
  text: caption, emerald-400
```

### Terms
```
Margin-top: 20px
Checkbox + "I agree to the subscription terms and authorize recurring billing."
  — "subscription terms" as amber-400 link
```

### CTA Row (flex, gap: 12px, mt-24px)
```
"← Back" — secondary button (flex-1)
"Confirm & Subscribe" — primary amber (flex-2)
```

### Animation
```
Summary card: scale(0.95→1), opacity(0→1), 400ms, ease-bounce
Total price: counter animation $0→$9.99, 600ms, ease-out-expo
```

---

## Step 4: Done / Welcome

### Content
```
Text-center
```

**Celebration:**
```
PartyPopper icon (64px, amber-400, mx-auto)
Or: animated confetti burst (Framer Motion particles, 30 pieces, amber/white/emerald colors)
```

**Headline:**
```
"Welcome to FinTrack [Plan]!"
heading-1, white
span [Plan]: amber-400
```

**Subtext:**
```
"Your subscription is active. Here's what's next:"
body, slate-400, mt-12px
```

**Quick-start checklist (margin-top: 32px):**
```
Flex-col, gap: 16px, max-width: 400px, mx-auto
```

**Each item:**
```
bg: navy-800
border: 1px solid navy-700
border-radius: 12px
padding: 16px 20px
display: flex, align-items: center, gap: 16px
```

1. **"Set up your first budget"** — icon: Wallet (20px, amber-400) + arrow link
2. **"Add a transaction"** — icon: PlusCircle (20px, emerald-400) + arrow link
3. **"Explore the dashboard"** — icon: LayoutDashboard (20px, amber-400) + arrow link
4. **"Download the mobile app"** — icon: Smartphone (20px, slate-400) + "Coming soon" badge

**Primary CTA:**
```
"Go to Dashboard" — primary amber, large, mt-40px
ArrowRight icon
Routes to: /dashboard
```

**Secondary link:**
```
"Manage subscription →" — caption, amber-400, mt-16px
Routes to: /subscription
```

### Animation
```
Confetti: burst from center, particles radiate outward, gravity applied, 2-3s duration
Headline: fade up, delay 0.3s
Checklist items: stagger 0.12s, slide from right + fade
  — opacity 0→1, translateX 20px→0, 400ms
CTA: scale in, delay 1s, ease-bounce
```

---

## State Management

### Plan Selection State
```typescript
interface OnboardingState {
  step: 1 | 2 | 3 | 4;
  selectedPlan: 'free' | 'pro' | 'premium';
  billingCycle: 'monthly' | 'annual';
  paymentMethod: 'card' | 'crypto' | 'mobile-money' | null;
  paymentDetails: {
    cardToken?: string;
    cryptoNetwork?: 'btc' | 'eth';
    cryptoAddress?: string;
    mobileProvider?: 'mtn' | 'orange';
    phoneNumber?: string;
  };
  confirmed: boolean;
}
```

### Navigation Guards
- Unauthenticated users → redirect to /auth
- Users with active subscription → redirect to /dashboard
- Step 2-4 without plan selection → redirect to step 1
- Step 3-4 without payment method → redirect to step 2

---

## Responsive Notes

**Desktop:** Side-by-side plan cards, expanded payment forms
**Tablet:** Stacked plan cards (2-col for plans), full-width payment forms
**Mobile:** Single column everything, compact padding, payment methods as full-width cards
