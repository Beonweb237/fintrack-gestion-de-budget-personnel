# Landing Page (`/`)

The premium commercial landing page. Dark, cinematic, warm financial aesthetic. Sells the product, builds trust, and drives conversions.

---

## Section 1: Navigation (Fixed)

### Layout
```
position: fixed, top-0, z-50
width: 100%
height: 72px
Initial: bg-transparent
Scrolled (>50px): bg-navy-950/80 backdrop-blur-xl, border-bottom: 1px solid navy-800
```

### Content
**Left:** Logo (`logo.svg`) + "FinTrack" wordmark
**Center:** Nav links — Features, Pricing, Testimonials, FAQ
**Right:** Language switcher (dropdown: 🇺🇸 EN / 🇫🇷 FR / 🇪🇸 ES) + "Sign In" (ghost) + "Get Started — Free" (primary CTA, amber)

### Mobile (< md)
Hamburger menu (right). Menu opens as full-screen overlay with `bg-navy-950/95 backdrop-blur-xl`. Links stacked vertically, 24px gap.

### Animation
```
Navbar scroll transition: background 300ms ease, border-color 300ms ease
Nav link hover: color slate-300 → white, 150ms ease
CTA button hover: scale(1.03), shadow-lg shadow-amber-500/25, 200ms ease
Mobile menu: opacity 0→1, translateY(-8px→0), 250ms ease-out-expo
```

---

## Section 2: Hero

### Layout
```
min-height: 100vh
bg: navy-950
position: relative
overflow: hidden
```

#### Background Effects (layered)
1. **Base gradient:** `hero-glow` (radial amber glow from top center)
2. **Particle field:** Subtle floating amber dots (30-40 particles, `opacity: 0.3-0.7`, size `2-4px`). Drift slowly upward. Framer Motion `animate={{ y: -20 }}` with `repeat: Infinity`, `duration: 8-15s`, random per particle.
3. **Grid overlay:** `1px` lines, `navy-800/30`, creating a subtle perspective grid that fades to edges. CSS `linear-gradient` pattern.

#### Content Layout
```
Two-column layout (lg+):
Left: 55% — Text content, vertically centered
Right: 45% — Floating dashboard mockup

Single column (mobile): text first, mockup below
```

### Content — Left Column

**Eyebrow badge:**
```
"Trusted by 10,000+ users worldwide"
bg: navy-800, border: navy-700, text: amber-400
border-radius: 9999px
padding: 6px 16px
font: caption
Icon: Globe (14px) left of text
```

**Headline (H1):**
```
"Take Control of Your Finances"
font: display-1, weight 800, color: white
span ("Finances"): bg-gradient-to-r from-amber-300 to-amber-500, bg-clip-text, text-transparent
```

**Subheadline:**
```
"Track expenses, manage budgets, and achieve your financial goals — all in one beautiful, secure platform. Available in 3 languages with global payment support."
font: body-large, color: slate-400
max-width: 520px
margin-top: 24px
```

**CTA Row (flex, gap 16px, margin-top 40px):**
- Primary: "Start Free — No Credit Card" (amber, large)
- Secondary: "Watch Demo" (ghost + Play icon)

**Trust bar (margin-top 48px):**
```
Row of 5 icons: ShieldCheck, Lock, Globe, Users, Award
Each: 20px, slate-500, gap 24px
Label below: "Bank-level security • SOC 2 compliant • 256-bit encryption"
font: caption, color: slate-500
```

### Content — Right Column

**Floating Dashboard Mockup**
```
Image: hero-dashboard-mockup.png
Position: slightly offset right, overlapping edge
Shadow: 0 32px 64px rgba(0,0,0,0.4)
Border: 1px solid navy-700
Border-radius: 16px
Floating animation: translateY oscillation ±12px, 6s ease-in-out infinite
Tilt: perspective(1000px) rotateY(-5deg) rotateX(3deg)
```

**Decorative elements behind mockup:**
- Large blurred amber circle: `w-96 h-96`, `bg-amber-500/10`, `blur-3xl`, `rounded-full`, `absolute`, offset behind mockup
- Smaller rose circle: `w-64 h-64`, `bg-rose-500/5`, `blur-3xl`

### Animation
```
Eyebrow: fade up, delay 0.2s, duration 600ms, ease-out-expo
Headline: fade up + slight blur(4px→0), delay 0.3s, duration 800ms
  — "Finances" span: color shifts from white to amber gradient at 0.8s
Subheadline: fade up, delay 0.5s, duration 600ms
CTA buttons: fade up, delay 0.7s, duration 600ms, stagger 100ms
Trust bar: fade in, delay 0.9s, duration 500ms
Mockup: scale(0.92→1) + opacity(0→1) + translateX(40px→0), delay 0.4s, duration 1000ms, ease-out-expo
  — Subtle continuous float: translateY ±12px, 6s infinite
Particles: stagger in with random delays (0-2s), opacity 0→target, duration 1s
```

---

## Section 3: Logo Marquee (Social Proof)

### Layout
```
bg: navy-900
border-top: 1px solid navy-800
border-bottom: 1px solid navy-800
padding: 40px 0
overflow: hidden
```

### Content
**Label:**
```
"Powering financial clarity for individuals and teams worldwide"
text: slate-500, font: caption, text-center, margin-bottom: 24px
```

**Marquee:**
Infinite horizontal scroll of "partner logos" (placeholder styled boxes, 8 items duplicated for seamless loop).
```
height: 48px
item-gap: 64px
speed: 30s linear infinite
opacity: 0.4
hover: pause animation
```

### Animation
```
Marquee: CSS translateX(0→-50%) 30s linear infinite
Entrance: opacity 0→1, duration 600ms, on scroll into view
```

---

## Section 4: Features Showcase

### Layout
```
bg: navy-950
padding: 120px 0
position: relative
overflow: hidden
```

**Background decoration:**
```
world-map.svg positioned absolute, opacity 0.04, centered
```

**Section header:**
```
Eyebrow: "FEATURES" — font: caption, letter-spacing 0.1em, amber-400, text-center
H2: "Everything you need to master your money" — font: display-2, white, text-center, max-width 640px, mx-auto
Subtitle: "From daily expense tracking to predictive analytics — one platform, complete financial control." — font: body-large, slate-400, text-center, max-width 560px, mx-auto, mt-16px
```

### Feature Grid
```
3-column grid (lg), 2-column (md), 1-column (sm)
gap: 24px
margin-top: 64px
```

### Feature Cards (6 cards)

Each card:
```
Icon: 48px, wrapped in 56px circle bg navy-800 border navy-700, text amber-400
Title: font: heading-3, white, mt-20px
Description: font: body-small, slate-400, mt-12px, 3-4 lines
Link: "Learn more →" font: caption, amber-400, mt-16px, hover: underline
```

**Card 1: Smart Expense Tracking**
- Icon: `Receipt`
- "Automatically categorize transactions, attach receipts, and track spending in real-time across all your accounts."

**Card 2: Intelligent Budgeting**
- Icon: `PieChart`
- "Set monthly budgets with smart alerts. Get notified before you overspend with personalized recommendations."

**Card 3: Debt Management**
- Icon: `TrendingDown`
- "Track all your debts in one place. Visualize payoff timelines and discover the fastest route to financial freedom."

**Card 4: Goal Setting**
- Icon: `Target`
- "Set savings goals with visual progress tracking. Watch your milestones come to life with achievement celebrations."

**Card 5: Advanced Analytics**
- Icon: `BarChart3`
- "Dive deep into spending patterns with interactive charts. Export reports and discover insights you never knew existed."

**Card 6: Multi-Currency & Global**
- Icon: `Globe`
- "Support for USD, EUR, and GBP. Track expenses in any currency with real-time exchange rates."

### Animation
```
Section header eyebrow: fade up, trigger at 15% viewport
H2: fade up + blur(4px→0), delay 0.1s
Subtitle: fade up, delay 0.2s
Feature cards: stagger entrance
  — Each card: opacity 0→1, translateY 32px→0, duration 500ms
  — Stagger: 80ms between cards
  — Trigger: grid 10% into viewport
Card hover: translateY(-4px), border-color navy-700→amber-500/30, shadow-lg, 300ms ease
Icon hover: scale(1.08), 200ms ease
```

---

## Section 5: How It Works

### Layout
```
bg: navy-900
padding: 120px 0
position: relative
```

**Section header:**
```
H2: "Get started in minutes" — font: display-2, white, text-center
Subtitle: "No complex setup. No financial expertise required." — font: body-large, slate-400, text-center
```

### Steps (Horizontal on desktop, vertical on mobile)
```
4 steps, connected by horizontal line (desktop) / vertical line (mobile)
Line: 2px, dashed, navy-700
Container: flex, justify-between, max-width: 960px, mx-auto, mt-64px
```

**Each step:**
```
Number circle: 48px, bg navy-800, border 2px amber-500/50, text amber-400, font: heading-3, centered
Connector line: to next step
Title: font: heading-3, white, mt-20px, text-center
Description: font: body-small, slate-400, mt-8px, text-center, max-width 200px
```

**Step 1:** "1" — "Create Account" — "Sign up in seconds with email or social login. No credit card required."
**Step 2:** "2" — "Connect Accounts" — "Link your bank accounts or add transactions manually. You're in control."
**Step 3:** "3" — "Track & Budget" — "Watch your financial picture come to life with real-time dashboards."
**Step 4:** "4" — "Achieve Goals" — "Set targets, track progress, and celebrate every financial milestone."

### Animation
```
Section header: fade up, trigger 15%
Step numbers: scale(0.8→1) + opacity(0→1), stagger 150ms, duration 400ms, ease-bounce
  — Trigger: steps container 10% into viewport
Connector line: draw-on effect (scaleX 0→1 from left), duration 600ms, delay after numbers appear
Step titles/descriptions: fade up, stagger 150ms, delay 0.3s after numbers
Step hover: number scale(1.1), 200ms ease
```

---

## Section 6: Testimonials

### Layout
```
bg: navy-950
padding: 120px 0
```

**Section header:**
```
Eyebrow: "TESTIMONIALS" — caption, amber-400, text-center, letter-spacing 0.1em
H2: "Loved by thousands" — display-2, white, text-center
Subtitle: "See what our users around the world are saying about FinTrack." — body-large, slate-400, text-center
```

### Testimonial Grid
```
3-column grid (lg), 2-column (md), 1-column (sm)
gap: 24px
margin-top: 64px
```

### Testimonial Cards (6 cards)

```
bg: navy-800
border: 1px solid navy-700
border-radius: 16px
padding: 32px
```

**Card content:**
```
Stars: 5 × Star icon (16px), amber-400 fill, flex, gap-4px
Quote: font: body, slate-300, italic, mt-16px
  — Opening/closing quotation marks: text amber-500/30, font-size 48px, decorative
Author row (flex, align-center, gap-12px, mt-24px):
  Avatar: 44px circle, border 2px navy-600
  Name: font: body-small, weight 600, white
  Role: font: caption, slate-400
    — Country flag emoji before role (e.g., "🇺🇸 United States")
```

**Testimonial 1:**
- Stars: 5
- "FinTrack completely changed how I manage my money. I finally understand where every dollar goes. The budgeting feature alone saved me $200 in the first month."
- Sarah Mitchell, Freelance Designer — 🇺🇸 United States
- Avatar: `testimonial-avatar-1.jpg`

**Testimonial 2:**
- Stars: 5
- "As a small business owner, I needed something simple yet powerful. FinTrack delivers exactly that. The analytics dashboard is incredibly insightful."
- Marcus Chen, Startup Founder — 🇬🇧 United Kingdom
- Avatar: `testimonial-avatar-2.jpg`

**Testimonial 3:**
- Stars: 5
- "The debt tracking feature helped me visualize my payoff plan. I'm now 6 months ahead of schedule. Absolutely worth the Premium plan."
- Aisha Johnson, Marketing Manager — 🇨🇦 Canada
- Avatar: `testimonial-avatar-3.jpg`

**Testimonial 4:**
- Stars: 5
- "I love the multi-currency support. As someone who travels frequently between Europe and the US, this is a game-changer."
- Pierre Dubois, Consultant — 🇫🇷 France
- Avatar: `testimonial-avatar-4.jpg`

**Testimonial 5:**
- Stars: 5
- "Switched from three different apps to just FinTrack. Everything I need is here — budgets, goals, and beautiful reports I can share with my accountant."
- Elena Rodriguez, Entrepreneur — 🇪🇸 Spain
- Avatar: `testimonial-avatar-1.jpg` (reused)

**Testimonial 6:**
- Stars: 5
- "The crypto payment option for Premium was the final touch. A truly modern financial platform for the global citizen."
- Kwame Asante, Developer — 🇬🇭 Ghana
- Avatar: `testimonial-avatar-2.jpg` (reused)

### Animation
```
Section header: fade up, trigger 15%
Cards: stagger entrance
  — opacity 0→1, translateY 24px→0, duration 500ms
  — Stagger: 80ms
  — Trigger: grid 10% into viewport
Card hover: translateY(-4px), border-color→amber-500/20, shadow-lg shadow-black/20, 300ms ease
```

---

## Section 7: Pricing

### Layout
```
bg: navy-900
padding: 120px 0
position: relative
```

**Background:**
```
Subtle amber vignette gradient centered behind pricing cards
```

**Section header:**
```
Eyebrow: "PRICING" — caption, amber-400, text-center, letter-spacing 0.1em
H2: "Simple, transparent pricing" — display-2, white, text-center
Subtitle: "Start free. Upgrade when you need more power. No hidden fees, cancel anytime." — body-large, slate-400, text-center, max-width 520px, mx-auto
```

### Billing Toggle
```
Flex, centered, gap-16px, margin-top: 32px
Label left: "Monthly"
Toggle switch: shadcn/ui Switch, amber when active
Label right: "Annual" + badge "Save 20%"
Badge: bg-emerald-500/10, text-emerald-400, border-emerald-500/20, caption, rounded-full
```

### Pricing Cards
```
3-column grid (lg), 1-column stacked (mobile)
gap: 24px, max-width: 1100px, mx-auto
margin-top: 48px
```

#### Free Tier Card
```
bg: navy-800
border: 1px solid navy-700
border-radius: 20px
padding: 40px
```

**Content:**
```
Plan badge: "Free" — bg slate-800, text slate-300, caption, rounded-full
Price: "$0" — font: display-2 (48px), white, weight 700
Period: "/month" — font: body, slate-500
Divider: 1px navy-700, my-24px
Features list (flex-col, gap-12px):
  Each: Check icon (16px, emerald-500) + text (body-small, slate-300)
  ✓ Up to 50 transactions/month
  ✓ 1 active budget
  ✓ 2 active debts
  ✓ 1 savings goal
  ✓ Basic analytics dashboard
  ✓ Email support
CTA: "Get Started — Free" — secondary button (full width), mt-32px
```

#### Pro Tier Card (Featured)
```
bg: navy-800
border: 2px solid amber-500/40
ring: 1px amber-500/20
border-radius: 20px
padding: 40px
position: relative
transform: scale(1.03) on desktop (slightly larger)
```

**Popular badge (absolute, top of card):**
```
"Most Popular"
bg: amber-500
text: navy-950
font: caption, weight 600
padding: 4px 16px
border-radius: 9999px
position: absolute, top: -14px, left: 50%, -translate-x-1/2
```

**Content:**
```
Plan badge: "Pro" — bg-amber-500/10, border border-amber-500/30, text-amber-400
Price: "$9.99" — font: display-2, white
Period: "/month" — font: body, slate-500
  — Annual: "$7.99/month billed annually"
Divider: 1px navy-700
Features list:
  ✓ Unlimited transactions
  ✓ 5 active budgets
  ✓ 10 active debts
  ✓ 5 savings goals
  ✓ Advanced analytics + export
  ✓ Stripe payment integration
  ✓ Priority email support
CTA: "Start Pro Trial" — primary amber button (full width)
Subtext below CTA: "14-day free trial, cancel anytime" — caption, slate-500, text-center
```

#### Premium Tier Card
```
bg: navy-800
border: 2px solid transparent
  — border-image: premium-gradient (amber→rose)
border-radius: 20px
padding: 40px
position: relative
```

**Premium badge (absolute, top of card):**
```
"Best Value"
bg: premium-gradient (amber→rose)
text: white
font: caption, weight 600
padding: 4px 16px
border-radius: 9999px
position: absolute, top: -14px, left: 50%, -translate-x-1/2
```

**Content:**
```
Plan badge: "Premium" — bg-gradient-to-r from-amber-500/10 to-rose-500/10, border amber-500/30, text-amber-300
Price: "$19.99" — font: display-2, white
Period: "/month" — font: body, slate-500
  — Annual: "$15.99/month billed annually"
Divider: 1px navy-700
Features list:
  ✓ Everything in Pro
  ✓ Unlimited everything
  ✓ AI-powered insights & predictions
  ✓ Multi-currency (USD, EUR, GBP)
  ✓ Crypto payments (BTC, ETH)
  ✓ Mobile Money (MTN, Orange)
  ✓ Team sharing (up to 5)
  ✓ 24/7 priority support
CTA: "Go Premium" — bg: premium-gradient (amber→rose), text white, font-weight 600, full width
Subtext: "14-day free trial, cancel anytime" — caption, slate-500
```

### Animation
```
Section header: fade up, trigger 15%
Toggle: scale in, delay 0.2s, duration 400ms, ease-bounce
Pricing cards: stagger entrance
  — opacity 0→1, translateY 40px→0, duration 600ms
  — Stagger: 120ms (Free → Pro → Premium)
  — Pro card has slight delay emphasis (extra 80ms)
  — Trigger: cards 10% into viewport
Card hover (all): translateY(-6px), enhanced shadow, 300ms ease
Pro card: subtle amber glow pulse on border (box-shadow oscillate 0→8px→0 amber-500/20, 3s infinite)
```

---

## Section 8: FAQ

### Layout
```
bg: navy-950
padding: 120px 0
```

**Section header:**
```
H2: "Frequently asked questions" — display-2, white, text-center
Subtitle: "Everything you need to know about FinTrack." — body-large, slate-400, text-center
```

### FAQ Accordion
```
max-width: 720px, mx-auto, mt-64px
shadcn/ui Accordion component
```

**Each item:**
```
bg: navy-800
border: 1px solid navy-700
border-radius: 12px
padding: 20px 24px
margin-bottom: 12px
Trigger: flex between, question text + ChevronDown icon
  — Icon rotates 180° when open
Content: body-small, slate-400, padding-top 12px
```

**Questions (8 items):**

1. **"Is there really a free plan?"**
   "Yes! Our Free plan gives you up to 50 transactions per month, 1 budget, 2 debts, and 1 savings goal. It's perfect for getting started with personal finance tracking. No credit card required."

2. **"Can I switch plans at any time?"**
   "Absolutely. Upgrade or downgrade your plan at any time from your subscription settings. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at your next billing cycle."

3. **"What payment methods do you accept?"**
   "We accept all major credit and debit cards through Stripe (Visa, Mastercard, American Express). Premium users can also pay with cryptocurrency (Bitcoin and Ethereum) or Mobile Money (MTN Mobile Money, Orange Money)."

4. **"Is my financial data secure?"**
   "Your security is our top priority. We use 256-bit AES encryption, are SOC 2 Type II compliant, and never store your bank credentials. All data is encrypted in transit and at rest."

5. **"Do you support multiple currencies?"**
   "Yes! Pro and Premium plans support transactions in USD, EUR, and GBP with real-time exchange rates. Premium users get automatic currency conversion and multi-currency reporting."

6. **"Can I cancel my subscription?"**
   "You can cancel anytime from your subscription page. After cancellation, you'll continue to have access until the end of your current billing period. No refunds for partial months."

7. **"Do you offer refunds?"**
   "We offer a 14-day free trial on all paid plans so you can explore FinTrack risk-free. If you're not satisfied, you can cancel during the trial and pay nothing."

8. **"How do I get support?"**
   "Free users have access to our knowledge base and community forums. Pro users get priority email support. Premium users enjoy 24/7 live chat and phone support."

### Animation
```
Section header: fade up, trigger 15%
Accordion items: stagger entrance
  — opacity 0→1, translateY 16px→0, duration 400ms
  — Stagger: 60ms
Accordion open: content height 0→auto, 300ms ease-default
  — Chevron: rotate 0→180°, 200ms ease
Item hover: border-color navy-700→navy-600, 150ms ease
```

---

## Section 9: CTA Banner

### Layout
```
bg: navy-900
padding: 96px 0
position: relative
overflow: hidden
```

**Background:**
```
Large amber gradient blob, blurred, positioned behind text
radial-gradient(ellipse 50% 40% at 50% 50%, rgba(245,158,11,0.12) 0%, transparent 100%)
```

### Content
```
Text-center
```

**Headline:**
```
"Ready to take control?"
font: display-2, white, text-center
span: "Get started for free today." — color: amber-400
```

**Subtext:**
```
"Join 10,000+ users who trust FinTrack with their financial future."
font: body-large, slate-400, text-center, max-width 480px, mx-auto, mt-16px
```

**CTA Button:**
```
"Create Free Account" — primary amber, large, mt-32px, mx-auto
ArrowRight icon, animates → right 4px on hover
```

**Fine print:**
```
"No credit card required • 14-day trial on paid plans • Cancel anytime"
font: caption, slate-500, text-center, mt-16px
```

### Animation
```
Headline: fade up, trigger 20%
Subtext: fade up, delay 0.1s
CTA: scale in, delay 0.2s, ease-bounce
Background blob: subtle scale pulse (1→1.05→1), 8s infinite
Arrow icon on button hover: translateX 0→4px, 200ms ease
```

---

## Section 10: Footer

### Layout
```
bg: navy-950
border-top: 1px solid navy-800
padding: 64px 0 32px
```

### Content Structure
```
5-column grid (lg), 2-column (md), stacked (sm)
max-width: 1100px, mx-auto
```

**Column 1 — Brand:**
```
Logo: logo-icon.svg (24px) + "FinTrack" (heading-3, white)
Tagline: "Smart financial tracking for everyone." — body-small, slate-400, mt-12px
Social icons row (flex, gap-16px, mt-20px):
  Twitter/X, LinkedIn, GitHub, Instagram — 20px, slate-500, hover: amber-400
```

**Column 2 — Product:**
```
Header: "Product" — caption, weight 600, slate-300, uppercase, letter-spacing 0.05em
Links: Features, Pricing, Security, Changelog, API
Each: body-small, slate-400, hover: white
```

**Column 3 — Resources:**
```
Header: "Resources"
Links: Blog, Help Center, Community, Tutorials, Webinars
```

**Column 4 — Company:**
```
Header: "Company"
Links: About, Careers, Press, Partners, Contact
```

**Column 5 — Legal:**
```
Header: "Legal"
Links: Privacy Policy, Terms of Service, Cookie Policy, GDPR, SOC 2
```

### Bottom Bar
```
border-top: 1px solid navy-800, margin-top: 48px, padding-top: 24px
flex between (md), stacked (sm)
Left: "© 2024 FinTrack. All rights reserved." — caption, slate-500
Right: "Made with care for the global financial community." — caption, slate-500
Language + Currency mini-selectors: inline flex, gap-8px
  — "🇺🇸 EN | $ USD" dropdown
```

### Animation
```
Footer columns: stagger fade up, 80ms, trigger 10%
Social icons hover: color→amber-400, scale(1.1), 150ms ease
Links hover: color slate-400→white, 150ms ease
```

---

## Component Notes

### Language Switcher (Global)
```
shadcn/ui Select dropdown
Trigger: flag emoji + language code (compact)
Options: 🇺🇸 English, 🇫🇷 Français, 🇪🇸 Español
On change: updates i18n context, persists to localStorage
```

### Currency Quick-Select (Pricing section)
```
Inline segment toggle below pricing cards
Options: $ USD, € EUR, £ GBP
On change: re-renders prices with converted values
Uses static conversion rates (no live API needed for display)
```
