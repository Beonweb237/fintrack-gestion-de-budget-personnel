# Pricing Page (`/pricing`)

A dedicated, comprehensive pricing page with detailed feature comparison table, FAQ, and currency switching. Serves as the deep-dive pricing destination linked from the landing page and upgrade prompts.

---

## Layout

```
Same navbar as landing page (fixed, transparent→blurred)
No sidebar — this is a public/marketing page
bg: navy-950
padding-top: 72px (navbar offset)
```

---

## Section 1: Page Hero

```
min-height: 40vh
bg: navy-950
position: relative
padding: 80px 0 48px
text-center
```

**Background:**
```
hero-glow gradient (subtler than landing)
Fewer particles (15-20)
```

### Content
```
Eyebrow: "PRICING" — caption, amber-400, letter-spacing 0.1em, uppercase

H1: "Choose the plan that's right for you" — display-2, white
  — max-width: 640px, mx-auto

Subtitle: "Start free and upgrade as you grow. All plans include our core security features and multi-language support." — body-large, slate-400, max-width: 520px, mx-auto, mt-16px
```

### Currency & Billing Toggle Row
```
Flex, centered, gap: 32px, margin-top: 32px

Left: Currency selector
  shadcn Select
  Trigger: "🇺🇸 USD $" — bg navy-800, border navy-700, text slate-200
  Options: 🇺🇸 USD ($), 🇪🇺 EUR (€), 🇬🇧 GBP (£)

Right: Billing cycle toggle
  "Monthly" | Switch (amber) | "Annual"
  "Save 20%" badge — emerald style
```

### Animation
```
Eyebrow: fade up, 400ms, ease-out-expo
H1: fade up + blur(4px→0), delay 0.1s, 600ms
Subtitle: fade up, delay 0.2s, 400ms
Toggles: scale in, delay 0.3s, ease-bounce
```

---

## Section 2: Pricing Cards

```
bg: navy-950
padding-bottom: 80px
```

### Cards Layout
```
3-column grid (lg), 1-column stacked (mobile)
gap: 24px, max-width: 1100px, mx-auto
```

### Card Design (same as landing pricing, but more detailed)

Each card:
```
bg: navy-800
border-radius: 20px
padding: 40px
```

**Free Card:**
```
border: 1px solid navy-700

Badge: "Free" — slate style
Price: "$0" — display-2, white
Period: "/month, forever free" — body, slate-500

Divider: 1px navy-700, my-24px

Feature list (flex-col, gap: 12px):
  Each: Check icon (16px, emerald-500) + text (body-small, slate-300)
  ✓ Up to 50 transactions/month
  ✓ 1 active budget
  ✓ 2 active debts
  ✓ 1 savings goal
  ✓ Basic analytics dashboard
  ✓ Email support
  ✓ 256-bit encryption
  ✓ Multi-language support

Missing features (with X icon, slate-600):
  ✗ Unlimited transactions
  ✗ Advanced analytics
  ✗ Payment integrations
  ✗ Multi-currency
  ✗ Team sharing

CTA: "Get Started Free" — secondary button, full width, mt-32px
Subtext: "No credit card required" — caption, slate-500, text-center, mt-12px
```

**Pro Card (Featured):**
```
border: 2px solid amber-500/40
ring: 1px amber-500/20
transform: scale(1.03)
position: relative

Popular badge: "Most Popular" — amber bg, navy-950 text, absolute top-center

Badge: "Pro" — amber style
Price: "$9.99" — display-2, white
  — Annual: "$7.99" crossed-out "$9.99", then "/month billed annually"
Period: "/month" — body, slate-500

Divider

Features (all included, emerald checks):
  ✓ Unlimited transactions
  ✓ 5 active budgets
  ✓ 10 active debts
  ✓ 5 savings goals
  ✓ Advanced analytics + CSV/PDF export
  ✓ Stripe payment integration
  ✓ Priority email support
  ✓ Everything in Free

CTA: "Start 14-Day Free Trial" — primary amber, full width
Subtext: "Cancel anytime, no questions asked" — caption, slate-500
```

**Premium Card:**
```
border: 2px solid transparent
border-image: premium-gradient (amber→rose)
position: relative

Best Value badge: gradient bg (amber→rose), white text, absolute top-center

Badge: "Premium" — gradient border, amber text
Price: "$19.99" — display-2, white
  — Annual: "$15.99" crossed-out "$19.99"
Period: "/month" — body, slate-500

Divider

Features (all included, amber checks):
  ✓ Everything in Pro
  ✓ Unlimited budgets, debts, goals
  ✓ AI-powered insights & predictions
  ✓ Multi-currency (USD, EUR, GBP)
  ✓ Cryptocurrency payments (BTC, ETH)
  ✓ Mobile Money (MTN, Orange)
  ✓ Team sharing (up to 5 members)
  ✓ 24/7 live chat + phone support
  ✓ Custom reports & white-label exports
  ✓ Dedicated account manager

CTA: "Start 14-Day Free Trial" — gradient button (amber→rose), text white, full width
Subtext: "Best value for power users" — caption, amber-400
```

### Animation
```
Cards: stagger 120ms, fade up + translateY(40px→0), 600ms, ease-out-expo
  — Pro card has slight delay emphasis (+80ms)
Card hover: translateY(-6px), shadow increase, 300ms ease
Pro card border: subtle glow pulse, 3s infinite
```

---

## Section 3: Detailed Feature Comparison

```
bg: navy-900
padding: 80px 0
```

### Section Header
```
H2: "Compare all features" — display-2, white, text-center
"See exactly what you get with each plan." — body-large, slate-400, text-center
```

### Comparison Table
```
max-width: 960px, mx-auto, margin-top: 48px
bg: navy-800
border: 1px solid navy-700
border-radius: 16px
overflow: hidden
```

**Table Header:**
```
bg: navy-900/80
grid: 4 columns (feature name + 3 plans)
padding: 16px 24px
border-bottom: 2px solid navy-700

Columns:
  "Feature" — caption, slate-400, weight 600
  "Free" — caption, slate-400, text-center
  "Pro" — caption, amber-400, text-center
  "Premium" — caption, amber-300, text-center
```

**Category Rows (grouped):**
```
Category header: bg navy-900/50, padding: 12px 24px
Text: caption, weight 600, amber-400, uppercase, letter-spacing 0.05em
```

**Feature Rows:**
```
grid: same 4 columns
padding: 14px 24px
border-bottom: 1px solid navy-700/50
hover: bg-navy-700/30

Col 1: Feature name — body-small, slate-300
Col 2-4: Check / X / Value — text-center, body-small
  — Check: Check icon (16px, emerald-500) or "✓"
  — X: X icon (16px, slate-600) or "—"
  — Value: "50/mo", "5", "Unlimited" etc.
```

### Feature Categories & Rows

**Core Tracking:**
| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| Monthly transactions | 50 | Unlimited | Unlimited |
| Bank account connections | 2 | 10 | Unlimited |
| Receipt attachments | — | ✓ | ✓ + OCR |
| Transaction categories | Basic | Advanced | Custom |
| Recurring transactions | — | ✓ | ✓ + AI detect |

**Budgeting:**
| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| Active budgets | 1 | 5 | Unlimited |
| Budget alerts | ✓ | ✓ | ✓ + SMS |
| Rollover budgets | — | ✓ | ✓ |
| Shared budgets | — | — | ✓ (team) |

**Debt & Goals:**
| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| Active debts | 2 | 10 | Unlimited |
| Payoff calculator | Basic | Advanced | ✓ + scenarios |
| Savings goals | 1 | 5 | Unlimited |
| Goal projections | — | ✓ | ✓ + AI forecast |

**Analytics:**
| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| Dashboard charts | Basic | Advanced | ✓ + custom |
| Spending insights | — | ✓ | ✓ + AI |
| Export reports | — | CSV/PDF | ✓ + white-label |
| Data history | 6 months | 2 years | Unlimited |

**Payments:**
| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| Stripe (cards) | — | ✓ | ✓ |
| Cryptocurrency (BTC/ETH) | — | — | ✓ |
| Mobile Money (MTN/Orange) | — | — | ✓ |
| Multi-currency (USD/EUR/GBP) | — | — | ✓ |

**Support & Collaboration:**
| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| Support | Community | Priority email | 24/7 chat + phone |
| Team members | — | — | Up to 5 |
| API access | — | Read-only | Full |
| Custom integrations | — | — | ✓ |

### Animation
```
Section header: fade up, trigger 15%
Table: fade up, 400ms, delay 0.1s
Rows: stagger 15ms, opacity 0→1, 200ms
  — Trigger: table enters viewport
Category headers: fade in with slight translateX(-8px→0), 300ms
Hover: bg color transition 100ms
```

---

## Section 4: FAQ (Pricing-Specific)

```
bg: navy-950
padding: 80px 0
```

### Section Header
```
H2: "Pricing questions?" — heading-1, white, text-center
"Everything you need to know about our pricing and billing." — body, slate-400, text-center
```

### Accordion
```
max-width: 720px, mx-auto, margin-top: 48px
shadcn Accordion
```

**Questions (10 items):**

1. **"Is there a free trial for paid plans?"**
   "Yes! Both Pro and Premium plans include a 14-day free trial. No credit card required for Pro trial. Premium trial requires a payment method but you won't be charged until the trial ends, and you can cancel anytime."

2. **"Can I change my plan at any time?"**
   "Absolutely. You can upgrade or downgrade your plan at any time from your subscription settings. Upgrades take effect immediately; downgrades take effect at your next billing cycle."

3. **"What happens if I hit my Free plan limits?"**
   "You'll see upgrade prompts when approaching limits. Once a limit is reached, you'll need to upgrade to add more. Your existing data is never deleted — you just can't add new items beyond your plan's limits."

4. **"Do you offer refunds?"**
   "We offer a 14-day free trial so you can explore risk-free. We don't provide refunds for partial months, but if you cancel, you'll keep access until the end of your billing period."

5. **"What payment methods do you accept?"**
   "Pro plans can be paid via credit/debit card through Stripe (Visa, Mastercard, Amex). Premium plans additionally support Bitcoin (BTC), Ethereum (ETH), MTN Mobile Money, and Orange Money."

6. **"Are there any setup fees or hidden charges?"**
   "No. The price you see is the price you pay. Local taxes (VAT/GST) may apply based on your billing country and are shown clearly at checkout."

7. **"Can I pay in my local currency?"**
   "We display prices in USD, EUR, and GBP. Your card will be charged in your selected currency. For crypto payments, we calculate the equivalent amount at current exchange rates."

8. **"What is your cancellation policy?"**
   "Cancel anytime from your subscription page. After cancellation, your paid features remain active until the end of your current billing period. No partial refunds. You can resubscribe anytime."

9. **"Do you offer discounts for nonprofits or students?"**
   "Yes! We offer 50% off for verified nonprofits and students. Contact our support team with your verification documents to apply the discount."

10. **"What if I need more than 5 team members?"**
    "Our Premium plan includes up to 5 team members. For larger teams, contact us for a custom Enterprise plan with unlimited members, SSO, and dedicated support."

### Animation
```
Section header: fade up, trigger 15%
Accordion items: stagger 50ms, fade up, 300ms
```

---

## Section 5: CTA Banner

```
bg: navy-900
padding: 64px 0
```

### Content
```
Text-center

H2: "Still have questions?" — heading-1, white
"Our team is here to help you choose the right plan." — body-large, slate-400, mt-12px

Buttons (flex, gap: 16px, centered, mt-32px):
  "Contact Sales" — secondary button
  "Start Free" — primary amber button
```

### Animation
```
Fade up, trigger 20%
Buttons: stagger 100ms, scale in, ease-bounce
```

---

## Section 6: Footer

```
Same footer as landing page
```

---

## Component Notes

### Currency Switching
- Currency selector updates all prices on the page
- Uses static conversion rates (no live API for display)
- Selected currency persisted to localStorage

### Annual Toggle
- Switches between monthly and annual prices
- All cards update simultaneously with Framer Motion layout animation
- "Save 20%" badge pulses briefly on toggle

### Sticky Compare Button (Mobile)
```
On mobile, a sticky bottom bar appears:
  bg: navy-900/95 backdrop-blur
  border-top: 1px solid navy-700
  padding: 16px
  "Compare Plans" — amber button, full width

Tapping opens a bottom sheet with the comparison table
```
