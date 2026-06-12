# Billing Page (`/billing`)

Complete billing management: invoice history with PDF download, payment methods, billing information, and tax settings. Clean, professional, and internationally aware.

---

## Layout

### Page Shell
```
Same sidebar + top bar as dashboard (see dashboard.md)
Main content area: bg slate-50, min-height: calc(100vh - 64px)
padding: 32px
```

### Page Header
```
Flex, align-center, justify-between, margin-bottom: 32px

Left:
  "Billing" — heading-1, slate-900
  "Manage your invoices, payment methods, and billing details." — body-small, slate-500, mt-4px

Right:
  Currency selector: shadcn Select, compact
    — "$ USD", "€ EUR", "£ GBP"
    — bg white, border slate-200
```

---

## Section 1: Billing Summary Card

```
bg: white
border: 1px solid slate-200
border-radius: 12px
padding: 32px
margin-bottom: 24px
display: grid, grid-cols: 3 (lg), 1 (mobile), gap: 32px
```

### Column 1: Current Plan
```
Label: "Current Plan" — caption, slate-500, uppercase
Value: "Pro" — heading-2, slate-900, mt-4px
Badge: "Monthly" — bg slate-100, text slate-600, caption, rounded-full, mt-8px
Price: "$9.99/month" — body-small, slate-500, mt-4px
```

### Column 2: Next Payment
```
Label: "Next Payment" — caption, slate-500, uppercase
Value: "Mar 15, 2024" — heading-3, slate-900, mt-4px
Amount: "$9.99" — body, amber-600, weight 600, mt-4px
Status badge: "Active" — bg emerald-50, text emerald-600, caption, rounded-full, mt-8px
```

### Column 3: Payment Method
```
Label: "Payment Method" — caption, slate-500, uppercase
Card display: flex, align-center, gap: 12px, mt-4px
  — Card icon (32px, Visa/Mastercard SVG)
  — "•••• 4242" — body-small, weight 600, slate-900
  — "Expires 12/25" — caption, slate-500
"Update" — caption link, amber-600, mt-8px, hover: underline
```

### CTA Row (full width below columns, border-top slate-100, pt-24px, mt-24px)
```
Flex, gap: 12px
"Download All Invoices" — secondary button (FileDown icon)
"Manage Subscription" — ghost button (routes to /subscription)
```

### Animation
```
Card: fade up, 400ms, ease-out-expo
Columns: stagger 80ms, fade up + translateY(12px→0)
```

---

## Section 2: Invoice History

```
bg: white
border: 1px solid slate-200
border-radius: 12px
padding: 0 (table padding handles this)
overflow: hidden
```

### Table Header
```
bg: slate-50
padding: 16px 24px
grid: 5 columns (flex between)
border-bottom: 1px solid slate-200

Columns:
  "Invoice" — caption, slate-500, weight 600
  "Date" — caption, slate-500
  "Amount" — caption, slate-500
  "Status" — caption, slate-500
  "Actions" — caption, slate-500, text-right
```

### Invoice Rows
```
Each: padding: 16px 24px, border-bottom: 1px solid slate-100
grid: same 5 columns
hover: bg-slate-50
transition: 150ms
```

**Sample data:**

| Invoice | Date | Amount | Status | Actions |
|---------|------|--------|--------|---------|
| #INV-2024-0012 | Feb 15, 2024 | $9.99 | Paid | View ↓ PDF ↓ |
| #INV-2024-0011 | Jan 15, 2024 | $9.99 | Paid | View ↓ PDF ↓ |
| #INV-2024-0010 | Dec 15, 2023 | $9.99 | Paid | View ↓ PDF ↓ |
| #INV-2023-0009 | Nov 15, 2023 | $7.99 | Paid | View ↓ PDF ↓ |
| #INV-2023-0008 | Oct 15, 2023 | $7.99 | Refunded | View ↓ PDF ↓ |

**Status badges:**
```
Paid: bg-emerald-50, text-emerald-600, caption, rounded-full, px-8px
Refunded: bg-amber-50, text-amber-600, caption, rounded-full
Failed: bg-rose-50, text-rose-600, caption, rounded-full
Pending: bg-slate-100, text-slate-600, caption, rounded-full
```

**Actions:**
```
Flex, gap: 8px, justify-end
"View" — ghost button, micro, slate-500
"PDF" — ghost button, micro, amber-600, FileDown icon (16px)
```

### Pagination
```
Flex, justify-between, align-center, padding: 16px 24px

Left: "Showing 1-5 of 12 invoices" — caption, slate-500
Right: shadcn Pagination component
  — Previous / page numbers / Next
  — Active: bg amber-500, text white
  — Inactive: bg white, text slate-600, border slate-200
```

### Animation
```
Table: fade up, 400ms
Rows: stagger 40ms, fade up, 300ms
Status badges: scale(0.9→1) on entrance, 200ms, ease-bounce
```

---

## Section 3: Invoice Detail Modal

Triggered by "View" button on any invoice row.

### Modal (shadcn Dialog)
```
Overlay: bg-navy-950/60, backdrop-blur-sm
Card: bg-white, rounded-16px, max-width: 640px, max-height: 85vh, overflow-y: auto
```

### Invoice Content
```
Padding: 40px
```

**Header:**
```
Flex, justify-between

Left:
  "FinTrack" logo wordmark
  "123 Finance Street, Suite 100" — caption, slate-500
  "New York, NY 10001" — caption, slate-500
  "billing@fintrack.app" — caption, slate-500

Right:
  "INVOICE" — caption, slate-500, letter-spacing 0.1em
  "#INV-2024-0012" — heading-3, slate-900
  "Date: Feb 15, 2024" — body-small, slate-600
  "Due: Feb 15, 2024" — body-small, slate-600
```

**Billed to:**
```
Margin-top: 32px
Label: "Billed To" — caption, slate-500, uppercase
Name: "John Doe" — body-small, weight 600, slate-900
Email: "john@example.com" — caption, slate-500
```

**Invoice table:**
```
Margin-top: 32px
width: 100%
border-collapse: collapse

Header row: bg-slate-50, border-top/bottom 1px slate-200
  — "Description" | "Qty" | "Unit Price" | "Amount" (text-align: right for numbers)

Data row:
  — "FinTrack Pro — Monthly Subscription" | "1" | "$9.99" | "$9.99"
  
Tax row (if applicable):
  — "VAT (20%)" | — | — | "$2.00"

Total row: border-top 2px slate-900, font-weight 700
  — "Total" (colspan 3) | "$11.99"
```

**Payment info:**
```
Margin-top: 32px
Label: "Payment Method" — caption, slate-500
"Visa ending in 4242" — body-small, slate-700
"Paid on Feb 15, 2024" — caption, slate-500
```

**Footer:**
```
Margin-top: 40px, border-top 1px slate-200, pt-16px
"Thank you for your business!" — caption, slate-400, text-center
```

### Modal Actions
```
Flex, gap: 12px, justify-end, border-top 1px slate-200, pt-20px, mt-24px
"Close" — secondary button
"Download PDF" — primary amber, FileDown icon
```

### Animation
```
Modal: scale(0.94→1), opacity(0→1), 300ms, ease-out-expo
Invoice content: stagger 50ms, fade up, 300ms
```

---

## Section 4: Payment Methods

```
bg: white
border: 1px solid slate-200
border-radius: 12px
padding: 24px
margin-top: 24px
```

### Header
```
Flex, justify-between, align-center, margin-bottom: 20px
"Payment Methods" — heading-3, slate-900
"+ Add Method" — small primary amber button
```

### Payment Method Cards
```
Flex-col, gap: 12px
```

**Each card:**
```
bg: slate-50
border: 1px solid slate-200
border-radius: 10px
padding: 16px 20px
display: flex, align-items: center, gap: 16px

Left: Card brand icon (36px)
Middle:
  "•••• 4242" — body-small, weight 600, slate-900
  "Expires 12/25" — caption, slate-500
Right:
  "Default" badge (if default) — bg-emerald-50, text-emerald-600, caption
  Actions dropdown: shadcn DropdownMenu
    — "Set as default"
    — "Edit"
    — "Remove" (rose-500 text)
```

**Crypto wallets (Premium only):**
```
Same card structure
Icon: BTC/ETH logo
Label: "Bitcoin Wallet" / "Ethereum Wallet"
Address: truncated (0x1234...5678)
"Verified" badge: bg-emerald-50, text-emerald-600
```

### Add Payment Method Modal
```
shadcn Dialog
Title: "Add Payment Method"
Tabs: "Card" | "Crypto" (Premium only) | "Mobile Money" (Premium only)

Card tab: Stripe card element form (same as onboarding)
Crypto tab: Network selector + wallet address input
Mobile Money tab: Provider selector + phone input
```

### Animation
```
Section: fade up, 400ms
Method cards: stagger 60ms, fade up, 300ms
Add modal: scale(0.95→1), 300ms, ease-bounce
```

---

## Section 5: Billing Information

```
bg: white
border: 1px solid slate-200
border-radius: 12px
padding: 24px
margin-top: 24px
```

### Header
```
Flex, justify-between, align-center, mb-20px
"Billing Information" — heading-3, slate-900
"Edit" — ghost button, Pencil icon (16px)
```

### Fields (2-column grid, gap: 16px)
```
Name: "John Doe" (disabled input style)
Email: "john@example.com"
Company: "—" (empty state)
Address: "123 Main Street"
City: "New York"
Postal Code: "10001"
Country: "United States" (shadcn Select, full country list)
Tax ID / VAT: "—"
```

### Edit Mode
```
All fields become editable
"Save Changes" — primary amber
"Cancel" — ghost button
```

---

## PDF Generation Spec

### Triggered by: "Download PDF" button (invoice row or modal)

**Library:** jspdf + html2canvas

**Process:**
1. Render invoice content to hidden DOM element
2. Capture with html2canvas at 2x scale
3. Generate PDF via jspdf (A4, portrait)
4. Auto-download: `FinTrack_Invoice_INV-2024-0012.pdf`

**PDF Styling:**
- Fonts: Helvetica (embedded)
- Colors: Black text, amber accent for logo
- Layout: Matches modal invoice view
- Page size: A4
- Margins: 20mm all sides

### Animation
```
Button click: spinner replaces icon, 200ms
Success: check icon briefly, then download starts
Toast: "Invoice downloaded" — emerald, bottom-right, 3s
```

---

## Component Notes

### Currency Display
- All amounts formatted via `Intl.NumberFormat` with selected currency
- Currency selector in page header affects all displayed amounts
- Invoice amounts stored in USD, converted at display time

### Tax Calculation
- VAT/GST applied based on billing country
- Rates: US (0%), UK (20%), EU (varies by country)
- Shown as separate line item on invoices

### Responsive
- Desktop: full table with all columns visible
- Tablet: table with horizontal scroll if needed
- Mobile: card-style invoice list (no table), each invoice as a card
- Summary card stacks vertically on mobile
