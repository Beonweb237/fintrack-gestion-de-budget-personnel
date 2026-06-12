# Auth Page (`/auth`)

Premium authentication interface with social OAuth providers, multi-language support, and seamless transitions between login and register modes. The page doubles as both the standalone auth entry point and a modal overlay for in-app authentication flows.

---

## Layout

### Page Structure
```
min-height: 100vh
bg: navy-950
Two-column layout (lg+):
  Left: 50% — Visual panel with brand imagery and tagline
  Right: 50% — Auth form card
Mobile: single column, form only with minimal header
```

### Left Panel (Desktop Only, ≥ lg)
```
bg: gradient from navy-900 to navy-950
position: relative
overflow: hidden
```

**Background effects:**
1. `hero-glow` gradient — amber radial glow from top-left
2. Floating particles — 20 amber dots, slow drift
3. Subtle grid pattern — `navy-800/20`

**Content (centered vertically):**
```
Logo: logo-icon.svg (48px) + "FinTrack" (display-2, white)
Tagline: "Your finances, beautifully organized." — body-large, slate-400, max-width 360px
margin-top: 24px

Feature bullets (flex-col, gap-20px, margin-top: 48px):
  Each: Icon (20px, amber-400) + text (body, slate-300)
  ✓ Bank-level 256-bit encryption
  ✓ SOC 2 Type II compliant
  ✓ Available in 3 languages
  ✓ Trusted by 10,000+ users

Testimonial mini-card (bg navy-800/60, border navy-700, rounded-16px, p-24px, mt-64px):
  Quote: "The best financial app I've ever used. Worth every penny." — body-small, slate-300, italic
  Author: "— Sarah M." — caption, amber-400
```

### Right Panel (Auth Form Area)
```
bg: navy-950 (mobile) / transparent (desktop)
display: flex, align-items: center, justify-content: center
padding: 48px 32px
```

---

## Auth Card

```
bg: navy-800
border: 1px solid navy-700
border-radius: 20px
padding: 40px (desktop), 28px (mobile)
max-width: 440px
width: 100%
shadow: 0 24px 64px rgba(0,0,0,0.3)
```

### Card Header
```
Language switcher: absolute top-right
  — shadcn Select, compact trigger (flag only)
  — Options: 🇺🇸, 🇫🇷, 🇪🇸

H1: "Welcome back" (login mode) / "Create account" (register mode)
font: heading-1, white

Subtitle: "Sign in to your account" / "Start your financial journey"
font: body-small, slate-400, mt-8px
```

### Social Auth Buttons (OAuth)

```
Flex-col, gap: 12px, margin-top: 24px
```

**Google:**
```
bg: navy-900
border: 1px solid navy-600
text: slate-200
padding: 12px 20px
border-radius: 10px
font: body-small, weight 500
Icon: Google "G" logo SVG (20px, left)
Label: "Continue with Google"
hover: bg-navy-800, border-navy-500
transition: all 150ms ease
```

**Apple:**
```
Same structure
Icon: Apple logo SVG (20px, white)
Label: "Continue with Apple"
```

**Microsoft:**
```
Same structure
Icon: Microsoft 4-square logo SVG (20px)
Label: "Continue with Microsoft"
```

### Divider
```
Flex row, align-center, gap: 16px, margin: 24px 0
Line: 1px navy-700, flex-1
Text: "or continue with email" — caption, slate-500
```

### Email Form

**Name field (register only):**
```
Label: "Full name" — caption, slate-400, weight 500, margin-bottom: 6px
Input: dark style, placeholder "John Doe"
margin-bottom: 16px
```

**Email field:**
```
Label: "Email address" — caption, slate-400, weight 500
Input: dark style, placeholder "you@example.com"
Icon-left: Mail (16px, slate-500, inside input left padding)
margin-bottom: 16px
```

**Password field:**
```
Label: "Password" — caption, slate-400, weight 500
Input: dark style, type="password", placeholder "••••••••"
Icon-left: Lock (16px, slate-500)
Icon-right: Eye / EyeOff toggle (16px, slate-500, clickable)
margin-bottom: 8px
```

**Password strength (register only):**
```
Margin-top: 8px
4 segments, flex, gap: 4px
Each segment: 25% width, height: 4px, border-radius: 2px
Colors: slate-700 (empty) → slate-500 (weak) → amber-500 (medium) → emerald-500 (strong)
Label below: "Weak" / "Medium" / "Strong" — caption matching segment color
Criteria checklist (caption, slate-500):
  ✓ 8+ characters
  ✓ 1 uppercase letter
  ✓ 1 number
  ✓ 1 special character
```

**Remember me + Forgot password row (login only):**
```
Flex between, margin-top: 16px
Left: Checkbox (shadcn) + "Remember me" — caption, slate-400
Right: "Forgot password?" — caption, amber-400, hover: underline
```

**Terms checkbox (register only):**
```
Margin-top: 16px
Checkbox (shadcn) + "I agree to the Terms of Service and Privacy Policy"
  — "Terms of Service" and "Privacy Policy" as amber-400 links
```

**Submit button:**
```
Margin-top: 24px
Width: 100%
Padding: 14px
bg: amber-500
text: navy-950, weight 600
border-radius: 12px
hover: bg-amber-400, shadow-lg shadow-amber-500/20
transition: all 200ms ease
Loading state: spinner inside button, disabled
```

**Submit labels:**
- Login: "Sign In"
- Register: "Create Account"

### Mode Toggle
```
Text-center, margin-top: 24px
"Don't have an account? Create one" / "Already have an account? Sign in"
"Create one" / "Sign in" → amber-400 link, hover: underline
Switch triggers: slide transition between login/register content
  — Outgoing: opacity 1→0, translateX 0→-16px, 200ms
  — Incoming: opacity 0→1, translateX 16px→0, 200ms, delay 100ms
```

---

## States & Interactions

### Form Validation
```
Error state: Input border → rose-500, rose-500 ring-2
Error message: caption, rose-400, mt-4px below input
Shake animation on error: translateX 0→-4→4→-4→4→0, 400ms
```

### Loading State
```
Submit button: spinner replaces text, bg darkens slightly
Form inputs: opacity 0.6, pointer-events: none
Spinner: 20px, border-2 amber-500, animate-spin
```

### Success State (Registration)
```
Card content transitions to:
  CheckCircle icon (48px, emerald-500, mx-auto)
  "Account created!" — heading-2, white, text-center
  "Welcome to FinTrack. Let's set up your first budget." — body, slate-400, text-center
  "Get Started" button (primary amber) → routes to /onboarding
```

### Forgot Password Flow
```
Modal overlay (shadcn Dialog):
  bg: navy-900/95 backdrop-blur-lg
  Card: same styling as auth card, centered
  Title: "Reset your password"
  Input: "Email address" (dark style)
  Button: "Send reset link" (primary)
  Back link: "← Back to sign in" (caption, amber-400)
```

---

## Animations

```
Card entrance (page load):
  opacity 0→1, translateY 20px→0, scale 0.97→1
  duration: 500ms, ease: ease-out-expo

Left panel content (desktop):
  Logo: fade in, delay 0.1s
  Tagline: fade up, delay 0.2s
  Feature bullets: stagger 0.08s, fade up + translateX(-12px→0), delay 0.3s
  Testimonial: fade up, delay 0.7s

Form mode switch:
  Outgoing fields: opacity 1→0, translateX 0→-12px, 150ms
  Incoming fields: opacity 0→1, translateX 12px→0, 150ms, stagger 30ms

Input focus: border-color transition 150ms, ring appears 100ms
Social button hover: bg shift + border-color, 150ms
```

---

## Responsive

**Desktop (≥ 1024px):** Full two-column layout, card max-width 440px
**Tablet (768–1023px):** Single column, centered card, minimal header with logo
**Mobile (< 768px):** Full-width card with reduced padding, stacked social buttons

---

## Component Notes

### i18n Integration
- All labels, placeholders, and button text use i18n keys
- Language switcher persists selection to localStorage + URL param (`?lang=fr`)
- Form validation messages localized

### Accessibility
- All inputs have associated `<label>` elements
- Password toggle has `aria-label="Toggle password visibility"`
- Focus trap within auth card when used as modal
- `aria-live="polite"` on error/success message containers
- Social auth buttons have clear provider names for screen readers
