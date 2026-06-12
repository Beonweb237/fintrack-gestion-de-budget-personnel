# Settings Page (`/settings`)

Enhanced settings page with internationalization preferences, account management, and locale configuration. Builds on the existing Parametres page with SaaS-specific additions.

---

## Layout

### Page Shell
```
Same sidebar + top bar as dashboard (see dashboard.md)
Main content: bg slate-50, min-height: calc(100vh - 64px)
padding: 32px
```

### Page Header
```
"Settings" — heading-1, slate-900
"Manage your account, preferences, and regional settings." — body-small, slate-500, mt-4px
margin-bottom: 32px
```

### Settings Navigation (Horizontal Tabs)
```
bg: white
border: 1px solid slate-200
border-radius: 10px
padding: 4px
display: inline-flex
gap: 4px
margin-bottom: 32px
```

**Tab items:**
```
padding: 8px 16px
border-radius: 8px
font: body-small, weight 500
transition: 150ms

Active: bg-slate-900, text white
Inactive: text slate-600, hover: bg-slate-100
```

**Tabs:**
1. **Profile** — UserCircle icon
2. **Account** — Shield icon
3. **Regional** — Globe icon (new - i18n/locale)
4. **Notifications** — Bell icon
5. **Security** — Lock icon
6. **Billing** — CreditCard icon (links to /billing)

---

## Tab 1: Profile

```
bg: white
border: 1px solid slate-200
border-radius: 12px
padding: 32px
margin-bottom: 16px
```

### Avatar Section
```
Flex, align-center, gap: 20px, margin-bottom: 32px

Avatar: 80px circle, border 3px slate-200
Edit overlay: absolute, bottom-0, right-0, 28px circle, bg-amber-500, Camera icon (14px, white)

Text block:
  "Profile Photo" — body-small, weight 600, slate-900
  "JPG, PNG or GIF. Max 2MB." — caption, slate-500
  "Upload new" — caption, amber-600 + "Remove" — caption, slate-400
```

### Form Fields (2-column grid, gap: 20px)
```
Full Name: input, "John Doe"
Email: input, disabled, "john@example.com", verified badge
Phone: input, "+1 (555) 123-4567"
Company: input, "Acme Inc." (optional)
Job Title: input, "Finance Manager" (optional)
Bio: textarea, 3 rows, "Personal finance enthusiast..."
```

### Timezone
```
Label: "Timezone" — caption, slate-500, mt-20px
shadcn Select: full timezone list, "America/New_York"
"All times displayed in this timezone." — caption, slate-400, mt-4px
```

### Actions
```
Flex, gap: 12px, margin-top: 32px, border-top: 1px solid slate-100, pt-24px
"Save Changes" — primary amber button
"Cancel" — ghost button
```

---

## Tab 2: Account

```
Same card styling
```

### Account Information
```
Label sections with caption headers
```

**User ID:**
```
Label: "User ID" — caption, slate-500
Value: "usr_2vPqN5wL8xR9" — mono font, body-small, slate-700
"Copy" button — ghost, micro
```

**Member Since:**
```
"January 15, 2024" — body-small, slate-700
```

**Current Plan:**
```
"Pro" badge (amber style) + "$9.99/month"
"Manage →" link — amber-600, routes to /subscription
```

### Danger Zone
```
Margin-top: 32px
border-top: 2px solid rose-200
padding-top: 24px
```

**Log Out All Devices:**
```
Flex, justify-between, align-center
Left:
  "Log out all devices" — body-small, weight 600, slate-900
  "End all active sessions across all devices." — caption, slate-500
Right: "Log Out All" — small button, bg-white, border slate-300
```

**Delete Account:**
```
Flex, justify-between, align-center, margin-top: 16px
Left:
  "Delete account" — body-small, weight 600, rose-700
  "Permanently delete your account and all data. This cannot be undone." — caption, slate-500
Right: "Delete Account" — small button, bg-rose-50, border-rose-200, text-rose-600

Click → confirmation dialog:
  Title: "Delete your account?"
  Warning text + "type DELETE to confirm" input
  "Permanently Delete" — rose button (disabled until typed)
```

---

## Tab 3: Regional & Language (New)

```
Same card styling
```

This is the core internationalization settings tab.

### Language Section
```
"Language" — heading-3, slate-900, margin-bottom: 20px

Language options (flex-col, gap: 12px):
  Each: radio-card style
```

**Language Option Card:**
```
bg: slate-50
border: 1px solid slate-200
border-radius: 10px
padding: 16px 20px
display: flex, align-items: center, gap: 16px
cursor: pointer
hover: border-slate-300

Selected: border-amber-500, bg-amber-50/30, ring-1 ring-amber-500/20

Flag: 24px emoji flag
Native name: "English" / "Français" / "Español" — body-small, weight 600, slate-900
English name: "English" / "French" / "Spanish" — caption, slate-500
Check: CheckCircle icon (20px, amber-500) — selected only, right side
```

**Options:**
- 🇺🇸 English (en) — default
- 🇫🇷 Français (fr)
- 🇪🇸 Español (es)

**Note below:**
```
"Language changes apply immediately across the entire app."
caption, slate-500, mt-12px
```

### Currency Section
```
Margin-top: 32px
border-top: 1px solid slate-100
padding-top: 24px

"Currency" — heading-3, slate-900, margin-bottom: 20px

Currency options (flex-col, gap: 12px):
  Same radio-card pattern
```

**Currency Option Card:**
```
Symbol: "$" / "€" / "£" — 24px, weight 700, amber-600, in 40px circle bg-amber-50
Code: "USD" / "EUR" / "GBP" — body-small, weight 600, slate-900
Name: "US Dollar" / "Euro" / "British Pound" — caption, slate-500
Exchange rate note: "1 USD = 0.92 EUR" — micro, slate-400 (relative to base)
CheckCircle — selected
```

**Options:**
- $ USD — US Dollar
- € EUR — Euro
- £ GBP — British Pound

**Note:**
```
"Prices and amounts will be displayed in your selected currency. Exchange rates are updated daily."
caption, slate-500, mt-12px
```

### Date & Number Format Section
```
Margin-top: 32px
border-top: 1px solid slate-100
padding-top: 24px

"Date & Number Format" — heading-3, slate-900, margin-bottom: 20px
```

**Date format selector:**
```
shadcn Select
Label: "Date format" — caption, slate-500, mb-6px
Options:
  — "MM/DD/YYYY" (02/15/2024) — US
  — "DD/MM/YYYY" (15/02/2024) — UK/EU
  — "YYYY-MM-DD" (2024-02-15) — ISO
Default: matches selected language
```

**Number format selector:**
```
shadcn Select
Label: "Number format" — caption, slate-500, mb-6px
Options:
  — "1,234.56" — US/UK
  — "1.234,56" — EU
  — "1 234,56" — FR
Default: matches selected language
```

**Preview:**
```
bg: slate-50, border slate-200, rounded-8px, p-16px, mt-16px
Label: "Preview" — caption, slate-500, mb-8px

"Date: February 15, 2024" — body-small, slate-700
"Amount: $1,234.56" — body-small, slate-700 (uses mono font)
"Number: 1,234.56" — body-small, slate-700

Updates live as selections change
```

### First Day of Week
```
Margin-top: 20px
shadcn Select
Label: "First day of week" — caption, slate-500
Options: "Sunday" / "Monday"
Default: Sunday for EN, Monday for FR/ES
```

### Save Button
```
Margin-top: 32px
"Save Regional Settings" — primary amber button
Resets to saved: "Settings saved ✓" — emerald text, replaces button briefly
```

### Animation
```
Language/currency cards: stagger 60ms, fade up, 300ms
Selection: border-color transition 200ms, check icon scale(0→1) ease-bounce
Preview: fade transition on content change, 150ms
```

---

## Tab 4: Notifications

```
Same card styling
```

### Notification Channels
```
Flex-col, gap: 20px
```

**Each channel:**
```
Flex, justify-between, align-center
padding: 16px 0
border-bottom: 1px solid slate-100

Left:
  Icon (20px, slate-500)
  Text block:
    Channel name — body-small, weight 600, slate-900
    Description — caption, slate-500

Right: shadcn Switch
```

**Channels:**
1. **Email** (Mail icon) — "Receive updates and alerts via email" — default: ON
2. **Push** (Bell icon) — "Browser push notifications" — default: ON
3. **SMS** (MessageSquare icon) — "Text message alerts for critical events" — Premium only
4. **In-App** (LayoutDashboard icon) — "Dashboard notification center" — default: ON, locked ON

### Notification Events
```
Margin-top: 32px
border-top: 1px solid slate-100
padding-top: 24px

"Notify me about:" — heading-3, slate-900
```

**Event toggles:**
```
Same row pattern as channels
```

1. **Budget alerts** — "When I'm near or over budget" — default: ON
2. **Bill reminders** — "Upcoming bill payments" — default: ON
3. **Weekly summary** — "Weekly financial digest" — default: ON
4. **New features** — "Product updates and new features" — default: ON
5. **Security alerts** — "Suspicious activity and login attempts" — default: ON, locked ON
6. **Marketing** — "Tips, offers, and partner content" — default: OFF

### Animation
```
Toggles: scale(0.95→1) on entrance, stagger 40ms
Switch flip: spring animation via shadcn
```

---

## Tab 5: Security

```
Same card styling
```

### Password
```
"Password" — heading-3, slate-900
"Last changed: 30 days ago" — caption, slate-500, mt-4px

"Change Password" — secondary button, mt-16px
→ Opens modal with current + new + confirm fields
```

### Two-Factor Authentication
```
Margin-top: 32px
border-top: 1px solid slate-100
padding-top: 24px

Flex, justify-between, align-center

Left:
  "Two-Factor Authentication" — body-small, weight 600, slate-900
  "Add an extra layer of security to your account." — caption, slate-500

Right:
  Status: "Disabled" — bg-slate-100, text-slate-600, caption, rounded-full
  "Enable" — small amber button

Enabled state:
  Status: "Enabled" — bg-emerald-50, text-emerald-600
  "Manage" — small ghost button
```

### Active Sessions
```
Margin-top: 32px
border-top: 1px solid slate-100
padding-top: 24px

"Active Sessions" — heading-3, slate-900
```

**Session rows:**
```
Flex, align-center, justify-between
padding: 12px 0
border-bottom: 1px solid slate-100

Left:
  Device icon (20px, slate-500)
  Text:
    "Chrome on macOS" — body-small, slate-900
    "New York, USA • IP 192.168.1.1" — caption, slate-500
    "Current session" badge (if current) — emerald style

Right:
  "Revoke" — ghost button, micro, rose-500 (non-current only)
```

### Animation
```
Sections: stagger 80ms, fade up
Session rows: stagger 40ms, fade right + translateX(-8px→0)
2FA enable: modal slides up, 300ms
```

---

## Responsive Notes

### Desktop
- Sidebar visible, horizontal tabs, 2-column form grids
- Full comparison and preview sections

### Tablet
- Collapsed sidebar (icons only)
- Tabs may wrap to 2 rows
- Single column forms

### Mobile
- Bottom tab nav instead of sidebar
- Vertical tab list (scrollable) or dropdown
- Single column everything
- Sticky save button at bottom
- Regional preview collapses to single line
