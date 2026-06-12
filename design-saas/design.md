# FinTrack SaaS — Global Design Document

A premium financial tracking SaaS platform with a warm, trustworthy, and international aesthetic. The design blends Notion/Linear's precision with warm financial branding — sophisticated minimalism with amber-copper accents against a deep navy-charcoal canvas.

---

## Page List

| Page | File | Route | Description |
|------|------|-------|-------------|
| Landing | `landing.md` | `/` | Hero, features, testimonials, pricing tiers, CTA |
| Auth | `auth.md` | `/auth` | Premium login/register with social OAuth |
| Onboarding | `onboarding.md` | `/onboarding` | Post-signup: choose plan → payment → confirmation |
| Dashboard | `dashboard.md` | `/dashboard` | Enhanced with subscription widget & feature gating |
| Billing | `billing.md` | `/billing` | Invoice history, PDF download, payment methods |
| Subscription | `subscription.md` | `/subscription` | Plan management: upgrade/downgrade/cancel/renewal |
| Pricing | `pricing.md` | `/pricing` | Detailed pricing comparison table + FAQ |
| Settings | `settings.md` | `/settings` | Language, currency, locale preferences |

---

## Color Palette

### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--navy-950` | `#0B1121` | Deepest background, hero sections |
| `--navy-900` | `#111827` | Primary dark background |
| `--navy-800` | `#1A2332` | Card backgrounds, elevated surfaces |
| `--navy-700` | `#243447` | Borders, dividers, subtle backgrounds |
| `--navy-600` | `#334155` | Muted UI elements |

### Accent Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--amber-500` | `#F59E0B` | Primary CTA buttons, highlights, active states |
| `--amber-400` | `#FBBF24` | Hover states, secondary accents |
| `--amber-300` | `#FCD34D` | Glow effects, subtle highlights |
| `--amber-600` | `#D97706` | Pressed states, emphasis |
| `--emerald-500` | `#10B981` | Success, positive indicators |
| `--rose-500` | `#F43F5E` | Destructive actions, cancellation, overdue |

### Neutral Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--slate-50` | `#F8FAFC` | Light page backgrounds |
| `--slate-100` | `#F1F5F9` | Subtle backgrounds, input fills |
| `--slate-200` | `#E2E8F0` | Borders on light backgrounds |
| `--slate-300` | `#CBD5E1` | Secondary text, placeholders |
| `--slate-400` | `#94A3B8` | Muted text, disabled states |
| `--slate-500` | `#64748B` | Tertiary text |
| `--slate-600` | `#475569` | Secondary text on dark |
| `--slate-700` | `#334155` | Primary text on dark |
| `--slate-800` | `#1E293B` | Headings on light |
| `--slate-900` | `#0F172A` | Headings, primary dark text |

### Pricing Tier Colors
| Tier | Color | Gradient |
|------|-------|----------|
| Free | `--slate-400` → `--slate-500` | `from-slate-400 to-slate-500` |
| Pro | `--amber-400` → `--amber-600` | `from-amber-400 to-amber-600` |
| Premium | `linear-gradient(135deg, #F59E0B, #EC4899)` | amber to rose gradient |

### Gradients
| Name | Value | Usage |
|------|-------|-------|
| `hero-glow` | `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(245,158,11,0.15) 0%, transparent 100%)` | Hero background glow |
| `amber-vignette` | `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 100%)` | Subtle section highlights |
| `premium-gradient` | `linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)` | Premium tier badges, highlights |
| `dark-elevated` | `linear-gradient(180deg, #111827 0%, #0B1121 100%)` | Elevated dark surfaces |

---

## Typography

### Font Families
| Purpose | Font | Weight | Fallback |
|---------|------|--------|----------|
| Headlines | `Inter` | 700, 800 | system-ui, sans-serif |
| Body | `Inter` | 400, 500 | system-ui, sans-serif |
| Mono (numbers/currency) | `JetBrains Mono` | 400, 500 | monospace |
| Accent (rare, labels) | `Space Grotesk` | 500 | system-ui, sans-serif |

### Type Scale
| Token | Size | Weight | Letter-Spacing | Line-Height | Usage |
|-------|------|--------|----------------|-------------|-------|
| `display-1` | 64px / 4rem | 800 | -0.03em | 1.0 | Hero headline |
| `display-2` | 48px / 3rem | 700 | -0.02em | 1.1 | Section headlines |
| `heading-1` | 36px / 2.25rem | 700 | -0.02em | 1.2 | Page titles |
| `heading-2` | 28px / 1.75rem | 700 | -0.01em | 1.25 | Section sub-headings |
| `heading-3` | 22px / 1.375rem | 600 | -0.01em | 1.3 | Card titles |
| `body-large` | 18px / 1.125rem | 400 | 0 | 1.65 | Lead paragraphs |
| `body` | 16px / 1rem | 400 | 0 | 1.6 | Body text |
| `body-small` | 14px / 0.875rem | 400 | 0 | 1.5 | Secondary text |
| `caption` | 12px / 0.75rem | 500 | 0.02em | 1.4 | Labels, badges |
| `micro` | 10px / 0.625rem | 600 | 0.04em | 1.3 | Status indicators |

### Responsive Type
- `display-1`: 64px → 48px (tablet) → 36px (mobile)
- `display-2`: 48px → 36px (tablet) → 28px (mobile)
- `heading-1`: 36px → 30px (tablet) → 26px (mobile)

---

## Spacing Scale

Based on Tailwind spacing with custom tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `section-py` | `120px` / `7.5rem` | Vertical section padding (desktop) |
| `section-py-sm` | `80px` / `5rem` | Vertical section padding (mobile) |
| `content-max` | `1280px` / `80rem` | Max content width |
| `card-padding` | `32px` / `2rem` | Internal card padding |
| `card-gap` | `24px` / `1.5rem` | Gap between cards |
| `element-gap` | `16px` / `1rem` | Standard element gap |

---

## Component Design

### Buttons

**Primary (CTA)**
```
bg: amber-500
text: navy-950 (dark)
font-weight: 600
padding: 14px 32px
border-radius: 12px
hover: bg-amber-400, scale(1.02), shadow-lg shadow-amber-500/20
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)
```

**Secondary**
```
bg: transparent
border: 1px solid navy-700
text: slate-200
padding: 14px 32px
border-radius: 12px
hover: bg-navy-800, border-amber-500/30
transition: all 200ms ease
```

**Ghost**
```
bg: transparent
text: slate-300
padding: 10px 20px
border-radius: 8px
hover: bg-navy-800, text-white
transition: all 150ms ease
```

**Social Auth (OAuth)**
```
bg: navy-800
border: 1px solid navy-700
text: slate-200
padding: 12px 24px
border-radius: 10px
hover: bg-navy-700, border-slate-600
display: flex, align-center, gap-12px
icon: 20px, left of label
```

### Cards

**Feature Card**
```
bg: navy-800
border: 1px solid navy-700
border-radius: 16px
padding: 32px
hover: border-amber-500/30, translateY(-2px)
shadow: none → 0 8px 32px rgba(0,0,0,0.2) on hover
transition: all 300ms ease
```

**Pricing Card**
```
bg: navy-800
border: 1px solid navy-700
border-radius: 20px
padding: 40px
Pro tier: border-amber-500/40, ring-1 ring-amber-500/20
Premium tier: border-gradient(amber→rose), ring-1 ring-amber-500/30
Popular badge: amber-500 bg, navy-950 text, top-right corner
```

**Dashboard Card**
```
bg: white
border: 1px solid slate-200
border-radius: 12px
padding: 24px
shadow: 0 1px 3px rgba(0,0,0,0.05)
```

### Inputs

**Text Input (Dark)**
```
bg: navy-900
border: 1px solid navy-600
border-radius: 10px
padding: 12px 16px
text: slate-200
placeholder: slate-500
focus: border-amber-500, ring-2 ring-amber-500/20
```

**Text Input (Light)**
```
bg: slate-50
border: 1px solid slate-200
border-radius: 10px
padding: 12px 16px
text: slate-900
placeholder: slate-400
focus: border-amber-500, ring-2 ring-amber-500/20
```

### Badges

**Plan Badge (Free)**
```
bg: slate-800
text: slate-300
font: caption
padding: 4px 12px
border-radius: 9999px
```

**Plan Badge (Pro)**
```
bg: amber-500/10
border: 1px solid amber-500/30
text: amber-400
font: caption
padding: 4px 12px
border-radius: 9999px
```

**Plan Badge (Premium)**
```
bg: linear-gradient(135deg, amber-500/10, rose-500/10)
border: 1px solid amber-500/30
text: amber-300
font: caption
padding: 4px 12px
border-radius: 9999px
```

### Navigation

**Navbar (Transparent → Blurred on scroll)**
```
Initial: bg-transparent
Scrolled: bg-navy-950/80 backdrop-blur-xl
border-bottom: 1px solid transparent → navy-800 on scroll
height: 72px
position: fixed, top-0, z-50
transition: all 300ms ease
```

**Nav Links**
```
text: slate-300
font: body-small, weight 500
hover: text-white
active: text-amber-400
transition: color 150ms ease
```

**Mobile Menu**
```
bg: navy-900/95 backdrop-blur-lg
border: 1px solid navy-700
border-radius: 16px
padding: 24px
shadow: 0 24px 64px rgba(0,0,0,0.4)
animation: slide-down 300ms ease
```

### Footer
```
bg: navy-950
border-top: 1px solid navy-800
padding: 64px 0 32px
```

---

## Animation & Motion

### Easing Tokens
| Name | Value | Usage |
|------|-------|-------|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard transitions |
| `ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Button press, playful elements |
| `ease-smooth` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Smooth reveals |
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Hero entrances |

### Global Animation Patterns

**Fade Up (Standard entrance)**
```
initial: opacity 0, translateY 24px)
animate: opacity 1, translateY 0)
duration: 600ms
easing: ease-out-expo
trigger: element 15% into viewport
stagger: 100ms between siblings
```

**Scale In (Cards, modals)**
```
initial: opacity 0, scale(0.95), translateY 16px)
animate: opacity 1, scale(1), translateY 0)
duration: 500ms
easing: ease-bounce
trigger: on mount / 10% into viewport
```

**Stagger Children (Lists, grids)**
```
stagger: 60ms per child
duration: 500ms per child
easing: ease-out-expo
trigger: parent 15% into viewport
```

**Counter Animation (Pricing, stats)**
```
Count from 0 to target value
duration: 1500ms
easing: ease-out-expo
trigger: element enters viewport
format: with locale-aware separators
```

### Scroll Behavior
- Native smooth scroll enabled globally
- Lenis for buttery-smooth scrolling on landing page
- Scroll-triggered reveals via IntersectionObserver
- Navbar blur transition at 50px scroll distance

### Page Transitions
```
Exit: opacity 1→0, duration 200ms
Enter: opacity 0→1, translateY 12px→0, duration 300ms, ease-out-expo
```

---

## Responsive Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| `sm` | 640px | Base mobile |
| `md` | 768px | Tablet — 2-col grids, larger padding |
| `lg` | 1024px | Desktop — full nav, 3-col grids |
| `xl` | 1280px | Wide — max content width |

---

## Internationalization (i18n) Architecture

### Supported Languages
- **EN** — English (default)
- **FR** — Français
- **ES** — Español

### Language Switcher
```
Position: Navbar right (before auth buttons)
Style: Dropdown (shadcn/ui Select)
Trigger: Current language flag + code (e.g., "🇺🇸 EN")
Options: All supported languages with flag + native name
```

### Currency Support
| Code | Symbol | Locale Format |
|------|--------|---------------|
| USD | `$` | `en-US` |
| EUR | `€` | `de-DE` |
| GBP | `£` | `en-GB` |

Currency selector in Settings page + quick-switch in billing/subscription pages.

### RTL Considerations
- All layouts use logical properties (`start`/`end` instead of `left`/`right`)
- Text alignment adapts to locale
- Number/date formatting via `Intl.NumberFormat` / `Intl.DateTimeFormat`

---

## Feature Gating System

### Gating Patterns

**Lock Overlay (Full feature block)**
```
Overlay on locked feature
Icon: Lock (16px)
Text: "Upgrade to [Plan] to unlock"
Button: "Upgrade" (small amber)
Opacity: 0.85 background
```

**Inline Upgrade Nudge (Partial block)**
```
Banner at top of restricted section
bg: amber-500/10, border: amber-500/20
text: "You're on the Free plan. Upgrade for unlimited access."
Button: "Upgrade Now" (small amber)
```

**Progressive Teaser (Show sample)**
```
Show feature with sample/demo data
Watermark: "Premium preview"
CTA button at bottom to upgrade
```

### Feature Matrix

| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| Dashboard | ✅ Basic | ✅ Full | ✅ Full + AI Insights |
| Transactions | 50/month | Unlimited | Unlimited + Attachments |
| Budgets | 1 active | 5 active | Unlimited |
| Debts | 2 active | 10 active | Unlimited |
| Objectifs | 1 active | 5 active | Unlimited |
| Analytics | Basic charts | Advanced + Export | Predictive AI |
| Payment Methods | — | Stripe | Stripe + Crypto + Mobile Money |
| Multi-currency | — | — | USD/EUR/GBP |
| Team Sharing | — | — | Up to 5 members |
| Priority Support | — | Email | 24/7 Chat + Phone |

---

## Assets

| Filename | Description | Page | Dimensions | Type |
|----------|-------------|------|------------|------|
| `hero-dashboard-mockup.png` | Floating UI mockup showing FinTrack dashboard with charts, transactions, and budget cards. Dark navy background with amber accent highlights. Isometric perspective, clean shadows. | Landing | 1200×800, 3:2 | Image |
| `testimonial-avatar-1.jpg` | Professional headshot of a young woman, warm lighting, neutral background | Landing | 200×200, 1:1 | Image |
| `testimonial-avatar-2.jpg` | Professional headshot of a middle-aged man in business casual, studio lighting | Landing | 200×200, 1:1 | Image |
| `testimonial-avatar-3.jpg` | Professional headshot of a young man with glasses, modern office background | Landing | 200×200, 1:1 | Image |
| `testimonial-avatar-4.jpg` | Professional headshot of a woman with natural hair, outdoor setting | Landing | 200×200, 1:1 | Image |
| `feature-dashboard.png` | Screenshot-style image of the FinTrack dashboard overview — clean, dark-themed, with charts and cards | Landing | 800×600, 4:3 | Image |
| `feature-analytics.png` | Screenshot of analytics page with colorful charts, spending breakdown pie chart, trend line graph | Landing | 800×600, 4:3 | Image |
| `feature-mobile.png` | Mobile phone mockup showing FinTrack app on iPhone, dark mode, transaction list | Landing | 600×900, 2:3 | Image |
| `payment-stripe.png` | Stripe logo with credit card icons (Visa, Mastercard, Amex) on dark background | Onboarding | 400×120, ~3:1 | Image |
| `payment-crypto.png` | Bitcoin and Ethereum logos side by side, glowing on dark background | Onboarding | 400×120, ~3:1 | Image |
| `payment-mobile-money.png` | MTN Mobile Money and Orange Money logos, African fintech styling | Onboarding | 400×120, ~3:1 | Image |
| `logo.svg` | FinTrack wordmark — "Fin" in amber, "Track" in white, geometric tracking dot accent | All | SVG, scalable | SVG |
| `logo-icon.svg` | FinTrack icon — stylized "F" with upward trending line, amber gradient | All | SVG, 32×32 | SVG |
| `world-map.svg` | Subtle dotted world map illustration, low opacity, decorative | Landing | SVG, 16:9 | SVG |

---

## Dependencies

### Core
- Tailwind CSS v3.4.19
- React 19 + TypeScript
- Vite v7.2.4
- shadcn/ui

### Animation
- Framer Motion — page transitions, micro-interactions, layout animations
- GSAP + ScrollTrigger — scroll-driven storytelling on landing page
- Lenis — smooth scrolling

### Charts & Data
- Recharts — dashboard analytics, billing charts

### Utilities
- `react-countup` — animated number counters
- `react-intersection-observer` — scroll triggers
- `lucide-react` — icon system
- `jspdf` + `html2canvas` — PDF invoice generation
- `qrcode.react` — crypto payment QR codes
