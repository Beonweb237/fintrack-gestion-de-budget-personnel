# FinTrack SaaS — Prompts Maitre Sequentiels
## Document de reproduction complete du projet de A a Z
### Chaque prompt est tague avec son document context de reference

---

## PHASE 0 — Fondation du Projet
### Context : [01-SPECIFICATIONS_TECHNIQUES.md](01-SPECIFICATIONS_TECHNIQUES.md) | [05-GUIDE_INSTALLATION.md](05-GUIDE_INSTALLATION.md)

---

### PROMPT 0.1 — Initialisation du projet
```
Initialise un projet React avec TypeScript en utilisant le stack suivant :
- React 19 + TypeScript + Vite 7.2.4
- Tailwind CSS v3.4.19 avec le systeme de theming shadcn/ui
- React Router DOM v7 avec HashRouter
- Framer Motion pour les animations
- Recharts pour les visualisations de donnees
- Lucide React pour les icones
- Sonner pour les notifications toast

Cree la structure de dossiers suivante :
src/
  types/       — Definitions TypeScript
  data/        — Donnees mock et utilitaires de formatage
  contexts/    — Contextes React (Auth, Subscription)
  hooks/       — Hooks personnalises
  components/  — Composants partages (Navbar, Layout, Footer, Guards)
  components/ui/ — Composants shadcn/ui (40+ preinstalles)
  pages/       — Pages de l'application
  lib/         — Utilitaires (cn, etc.)

Configure les alias : @/ → ./src
Configure Tailwind avec les custom properties CSS pour :
- Palette warm : --warm-cream #F5F4F0, --warm-white #F9F9F9, --warm-black #272727, --warm-gray #E8E8E4, --accent-gold #D4A853
- Palette navy SaaS : --navy-950 #0B1121, --navy-900 #111827, --navy-800 #1A2332, --accent-gold #F59E0B
- Semantic : --success #16A34A, --danger #DC2626, --warning #D97706, --info #2563EB

Genere le fichier index.html avec les Google Fonts : Inter, Playfair Display, JetBrains Mono.
Assure-toi que le build fonctionne avec "npm run build".
```

---

## PHASE 1 — Types & Donnees Mock
### Context : [04-MODELE_DONNEES.md](04-MODELE_DONNEES.md) | [02-API_REFERENCE.md](02-API_REFERENCE.md)

---

### PROMPT 1.1 — Types TypeScript fondamentaux
```
Cree le fichier src/types/saas.ts avec les types suivants :

1. Enumerations : PlanTier ('free'|'pro'|'premium'), PlanInterval ('monthly'|'yearly'), PaymentMethod ('stripe'|'crypto'|'mobile_money'), MobileMoneyProvider ('mtn'|'orange'), Language ('en'|'fr'|'es'), Currency ('USD'|'EUR'|'GBP'), SubscriptionStatus ('active'|'cancelled'|'expired'|'trial')

2. Interfaces principales :
   - Plan : id, name, description, priceMonthly, priceYearly, features[], limits (transactions/budgets/goals/debts/analytics/export), popular?, color
   - Subscription : id, planId, interval, status, currentPeriodStart/End, cancelAtPeriodEnd, paymentMethod, createdAt
   - Invoice : id, subscriptionId, amount, currency, status, paidAt?, periodStart/End, paymentMethod, description, createdAt
   - PaymentMethodInfo : id, type, label, last4?, expiryMonth?, expiryYear?, brand?, isDefault
   - AppUser : id, name, email, avatar?, language, currency, timezone, dateFormat, subscription?, createdAt

3. Interfaces financieres :
   - Transaction : id, date, description, amount, category, type ('income'|'expense'), paymentMethod, notes?, createdAt, updatedAt
   - Category : id, name, type, color, icon, budget?, isDefault
   - Budget : id, categoryId, month, limit, spent, alertThreshold
   - SavingsGoal : id, name, description?, targetAmount, currentAmount, deadline?, color, icon, contributions[]
   - Debt : id, personName, personAvatar?, personContact?, description, amount, repaidAmount, type ('i-owe'|'owed-to-me'), status, dueDate?, payments[], note?, reminderEnabled
   - DebtPayment : id, debtId, amount, date, note?, createdAt

Exporte tous les types. Verifie la compilation TypeScript.
```

---

### PROMPT 1.2 — Donnees mock et utilitaires
```
Cree le fichier src/data/saasData.ts :

1. Tableau plans[] avec 3 plans exacts :
   - Free : $0/$0, 50 transactions, 3 budgets, 1 goal, 3 debts, pas d'analytics, pas d'export, couleur #94A3B8
   - Pro : $9.99/$99.99, popular=true, unlimited transactions/budgets, 10 goals, unlimited debts, analytics, export, multi-currency, priorite email, couleur #F59E0B
   - Premium : $19.99/$199.99, tout Pro + unlimited goals, AI insights, crypto payments, 50+ devises, family sharing 5, API access, 24/7 support, couleur linear-gradient(135deg,#F59E0B,#EC4899)

2. Tableau featureComparison[] avec 25 lignes reparties en 6 categories (Core, Data, Payments, Support, Analytics, Security)

3. Mock utilisateur : Alexandre Martin, alexandre@fintrack.app, USD, en, timezone Europe/Paris

4. Mock subscription : planId='pro', interval='monthly', status='active', period 2025-05-01 → 2025-06-01, paymentMethod='stripe'

5. Mock invoices[] : 5 factures avec periodes consecutives de janvier a mai 2025, montants $9.99, status='paid'

6. Mock paymentMethods[] : Visa •••• 4242 (default), Ethereum Wallet, MTN Mobile Money (+233 24 XXX XXXX)

7. Fonctions utilitaires :
   - formatPrice(amount, currency) → "$9.99"
   - formatCurrency(amount, currency) → "$ 1 234.56"
   - formatDateUS(dateStr) → "May 1, 2025"
   - daysUntil(dateStr) → nombre de jours
   - getDebtStatusLabel(status) → "Active"|"Paid"|"Overdue"
   - getDebtStatusColor(status) → code couleur
   - getDebtProgress(debt) → pourcentage rembourse
   - getRemainingAmount(debt) → montant restant

Exporte tout. Verifie la compilation.
```

---

### PROMPT 1.3 — Donnees financieres mock (transactions, budgets, dettes, objectifs, analytics)
```
Cree le fichier src/data/mockData.ts avec les donnees financieres completes :

1. 14 categories : Alimentation(#E11D48), Transport(#2563EB), Logement(#7C3AED), Loisirs(#D97706), Sante(#059669), Shopping(#DB2777), Factures(#0891B2), Education(#65A30D), Salaire(#16A34A, income), Freelance(#2563EB, income), Investissements(#D4A853, income), Cadeaux(#E11D48, income), Restaurant(#EA580C), Voyages(#0D9488)

2. 30 transactions realistes en francais avec dates avril 2025, descriptions variees (courses, loyer, salaire, freelance, concerts, etc.), types income/expense, paymentMethod card/cash/transfer/check

3. 10 budgets mensuels pour avril 2025 avec limites et montants depenses realistes

4. 5 objectifs d'epargne : Vacances Ete (€5000/€3200), Nouvelle Voiture (€15000/€8500), Fonds d'Urgence (€6000/€4000), MacBook Pro (€2500/€1800), Equipement Photo (€3200/€900) — chacun avec historique de contributions

5. 12 mois de donnees mensuelles (juin 2024 - mai 2025) avec revenus, depenses, solde

6. 8 categories de depenses avec montants, tendances, sous-categories

7. 8 dettes avec personnes, montants, remboursements, statuts (active/paid/overdue), echeances

8. Helpers : formatCurrency, formatCurrencySigned, formatDate, formatDateFull, getCategoryById, getBudgetStatus, getBudgetStatusLabel, getProgressColor, COLOR_PRESETS[], ICON_OPTIONS[]

Exporte toutes les donnees et fonctions. Verifie la compilation TypeScript.
```

---

## PHASE 2 — Contextes & Hooks (Infrastructure SaaS)
### Context : [03-ARCHITECTURE_SYSTEME.md](03-ARCHITECTURE_SYSTEME.md) | [02-API_REFERENCE.md](02-API_REFERENCE.md)

---

### PROMPT 2.1 — Contexte d'authentification
```
Cree src/contexts/AuthContext.tsx avec :

- useReducer pour la gestion d'etat avec etat initial : { user: null, isAuthenticated: false, isLoading: true }
- Actions : LOGIN, LOGOUT, SET_LOADING, UPDATE_USER
- Interface AuthContextValue : { state, login(email,password), register(name,email,password), logout(), updateUser(updates) }
- useEffect au montage : lit localStorage 'fintrack_user', parse et dispatch LOGIN si present
- login() : simule un appel API (setTimeout 800ms), cree un utilisateur avec plan Pro actif, sauvegarde dans localStorage, dispatch LOGIN
- register() : simule un appel API, cree un utilisateur avec plan Free (periode d'essai 14 jours), sauvegarde dans localStorage, dispatch LOGIN
- logout() : supprime localStorage 'fintrack_user' et 'fintrack_subscription', dispatch LOGOUT
- updateUser() : met a jour l'utilisateur partiellement, persiste dans localStorage

Exporte AuthProvider et useAuth hook. Verifie la compilation.
```

---

### PROMPT 2.2 — Contexte de souscription
```
Cree src/contexts/SubscriptionContext.tsx avec :

- useReducer pour etat : { subscription: Subscription|null, invoices: Invoice[], paymentMethods: PaymentMethodInfo[] }
- Actions : SET_SUB, CANCEL, REACTIVATE, UPGRADE, SET_INVOICES, ADD_PAYMENT, REMOVE_PAYMENT, SET_DEFAULT_PAYMENT
- useEffect au montage : lit localStorage 'fintrack_subscription' et 'fintrack_payment_methods', initialise avec mockSubscription et 3 paymentMethods par defaut
- useEffect persistance : synchronise subscription et paymentMethods vers localStorage a chaque changement

Methodes exportees :
- upgradePlan(planId, interval) : calcule le prix selon le plan et l'intervalle, genere une nouvelle periode (1 ou 12 mois), cree une nouvelle invoice, met a jour l'etat
- cancelSubscription() : met cancelAtPeriodEnd=true et status='cancelled'
- reactivateSubscription() : met cancelAtPeriodEnd=false et status='active'
- addPaymentMethod(method) : ajoute a la liste
- removePaymentMethod(id) : filtre par id
- setDefaultPayment(id) : met isDefault=true pour l'id, false pour les autres
- getCurrentPlan() : retourne le plan correspondant a subscription.planId depuis le tableau plans
- canUseFeature(feature) : verifie si la fonctionnalite est disponible dans le plan actuel
- getFeatureLimit(feature) : retourne la limite numerique ou booleenne de la fonctionnalite

Exporte SubscriptionProvider et useSubscription hook. Verifie la compilation.
```

---

### PROMPT 2.3 — Hook de feature gating
```
Cree src/hooks/useFeatureGate.ts :

Importe useSubscription et useAuth.

Le hook accepte un parametre feature (type : 'transactions'|'budgets'|'goals'|'debts'|'analytics'|'export').

Retourne un objet avec :
- canAccess : boolean — l'utilisateur est authentifie ET la fonctionnalite est disponible dans son plan
- isAuthenticated : boolean
- limit : number|boolean — la limite du plan pour cette feature
- currentPlanId : string — id du plan actuel
- currentPlanName : string — nom du plan actuel
- requiredPlan : PlanTier — le plan minimum requis pour cette feature
- requiredPlanName : string — nom du plan requis
- upgradePrompt : string|null — message d'upgrade si canAccess est false

Logique : analytics et export requierent 'pro', le reste aussi 'pro' par defaut.

Exporte le hook. Verifie la compilation.
```

---

### PROMPT 2.4 — Guards de routes
```
Cree deux fichiers :

1. src/components/AuthGuard.tsx :
   - Lit useAuth() pour verifier l'authentification
   - Si isLoading : affiche un spinner centre sur fond warm-cream
   - Si !isAuthenticated : redirige vers /auth avec le pathname actuel dans state.from
   - Sinon : rend les children

2. src/components/PublicOnlyGuard.tsx :
   - Si l'utilisateur EST authentifie : redirige vers /dashboard
   - Sinon : rend les children (pages publiques accessibles aux non-connectes)

Exporte les deux composants par defaut. Verifie la compilation.
```

---

## PHASE 3 — Composants Partages
### Context : [03-ARCHITECTURE_SYSTEME.md](03-ARCHITECTURE_SYSTEME.md) | [06-GUIDE_DEVELOPPEUR.md](06-GUIDE_DEVELOPPEUR.md)

---

### PROMPT 3.1 — Layout de l'application
```
Cree src/components/Layout.tsx :

- Utilise Outlet de react-router-dom pour rendre les pages enfants
- Structure : <div> contenant Navbar (sidebar) + <main> contenant Outlet + Footer
- Le main a un padding adapte (px-6 py-8 sur desktop, px-4 py-6 sur mobile)
- Fond warm-cream (#F5F4F0) pour tout le layout app
- Le layout est utilise pour toutes les routes protegees

Exporte par defaut. Verifie la compilation.
```

---

### PROMPT 3.2 — Barre de navigation (Navbar)
```
Cree src/components/Navbar.tsx :

Sidebar de 260px de large (72px en mode collapsé) avec :
- Logo "FinTrack" avec icone ShieldCheck en amber
- Bouton toggle pour collaps/expand
- 12 items de navigation avec icones Lucide :
  * Dashboard (LayoutDashboard)
  * Transactions (Receipt)
  * Budgets (PieChart)
  * Dettes (HandCoins)
  * Objectifs (Target)
  * Analytics (TrendingUp)
  * Subscription (CreditCard)
  * Billing (FileText)
  * Settings (Settings2)
  * Parametres (legacy → redirect Settings)
- Section utilisateur en bas : avatar, nom (depuis useAuth), email, badge du plan actuel (Pro/Premium/Free avec couleur adaptee)
- Bouton de deconnexion (LogOut icon) qui appelle logout() du AuthContext
- Active state : fond amber/10 avec bordure gauche amber pour la page active
- Animations Framer Motion pour le toggle
- Responsive : sidebar se transforme en drawer slide-in sur mobile avec overlay sombre

Exporte par defaut. Verifie la compilation.
```

---

### PROMPT 3.3 — Footer de l'application
```
Cree src/components/Footer.tsx :

Footer minimal pour les pages app :
- Texte "© 2025 FinTrack. All rights reserved."
- Version "v2.0.0 SaaS"
- Liens rapides : Terms, Privacy, Support
- Fond warm-white (#F9F9F9), bordure top warm-gray
- Padding py-4, texte 14px texte gris

Exporte par defaut. Verifie la compilation.
```

---

### PROMPT 3.4 — Navbar publique (Landing)
```
Cree src/components/PublicNavbar.tsx :

Navbar pour les pages publiques (Landing, Pricing) :
- Comportement au scroll : transparent au top, fond navy-900/90 avec backdrop-blur apres 50px de scroll
- Logo : "FinTrack" en Playfair Display avec point amber
- Liens nav : Features (smooth scroll #features), Pricing (/pricing), About (smooth scroll #about)
- Droite : "Log In" (bouton texte blanc), "Start Free" (bouton amber #F59E0B, texte sombre)
- Mobile : bouton hamburger, menu slide-in depuis la droite avec AnimatePresence
- Active link : texte amber

Utilise useLocation et useNavigate de react-router-dom.
Exporte par defaut. Verifie la compilation.
```

---

### PROMPT 3.5 — Footer publique (Landing)
```
Cree src/components/LandingFooter.tsx :

Footer premium pour les pages publiques :
- 5 colonnes :
  * Brand : logo + description courte + icones sociaux (Twitter, GitHub, LinkedIn, Instagram)
  * Product : Features, Pricing, Security, API
  * Resources : Blog, Help Center, Community, Tutorials
  * Company : About, Careers, Contact, Press
  * Legal : Privacy Policy, Terms of Service, Cookie Policy, GDPR
- Ligne inferieure : copyright + selecteur de langue (EN/FR/ES)
- Fond navy-950 (#0B1121), bordure top navy-700
- Texte slate-400, titres en blanc

Exporte par defaut. Verifie la compilation.
```

---

## PHASE 4 — Routing & Entry Point
### Context : [03-ARCHITECTURE_SYSTEME.md](03-ARCHITECTURE_SYSTEME.md)

---

### PROMPT 4.1 — Configuration du router
```
Cree src/App.tsx avec la structure de routes suivante :

Utilise Routes et Route de react-router-dom, et Toaster de sonner.

Structure :
1. Route "/" → Landing (publique, sans layout)
2. Route "/auth" → PublicOnlyGuard → Auth (publique)
3. Route "/pricing" → Pricing (publique, sans layout)

4. Route element={<Layout />} (routes protegees avec sidebar) :
   - "/dashboard" → AuthGuard → Dashboard
   - "/transactions" → AuthGuard → Transactions
   - "/budgets" → AuthGuard → Budgets
   - "/dettes" → AuthGuard → Dettes
   - "/objectifs" → AuthGuard → Objectifs
   - "/analytics" → AuthGuard → Analytics
   - "/subscription" → AuthGuard → SubscriptionPage
   - "/billing" → AuthGuard → Billing
   - "/settings" → AuthGuard → Settings
   - "/parametres" → AuthGuard → Settings (redirect)
   - "/onboarding" → AuthGuard → Onboarding
   - "/checkout/:planId" → AuthGuard → Checkout

Ajoute <Toaster position="top-right" richColors /> en dehors des Routes.
Importe tous les composants de page.
Exporte par defaut. Verifie la compilation.
```

---

### PROMPT 4.2 — Point d'entree avec providers
```
Cree src/main.tsx :

- Importe createRoot depuis react-dom/client
- Importe HashRouter depuis react-router-dom
- Importe AuthProvider et SubscriptionProvider
- Importe index.css et App

- Utilise createRoot sur document.getElementById('root')!
- Rend l'arborescence : HashRouter → AuthProvider → SubscriptionProvider → App

C'est le seul point d'entree. Tous les providers sont ici.
Exporte rien (fichier d'execution). Verifie la compilation.
```

---

## PHASE 5 — Pages Publiques (Landing + Auth + Pricing)
### Context : [01-SPECIFICATIONS_TECHNIQUES.md](01-SPECIFICATIONS_TECHNIQUES.md) | [08-DOCUMENTATION_UTILISATEUR.md](08-DOCUMENTATION_UTILISATEUR.md)

---

### PROMPT 5.1 — Landing Page
```
Cree src/pages/Landing.tsx avec les sections suivantes (toutes en anglais, design navy/amber) :

1. HERO : Fond navy-950 (#0B1121) avec radial gradient amber glow au centre-top. Headline "Master Your Money, Own Your Future" (64px blanc gras). Subheadline "The intelligent budget tracker that helps you save more, spend wisely, and achieve your financial goals." Deux boutons CTA : "Start Free" (amber #F59E0B) et "See Pricing" (outline blanc). A droite : img src="/hero-dashboard.png" avec ombre flottante. En dessous : 3 statistiques animees ("50K+ Users", "$2M+ Saved", "4.9 Rating") avec animation de comptage.

2. LOGO MARQUEE : Bande defilante infinie avec 6 logos texte ("Notion", "Stripe", "Figma", "Vercel", "Linear", "Shopify") en texte slate-600 sur fond navy-800. Animation CSS marquee.

3. FEATURES : Titre "Everything you need to master your finances". 6 cartes en grille 3x2 avec icones Lucide (Wallet, BarChart3, Target, Receipt, Shield, Globe). Chaque carte : cercle d'icone amber, titre, description. Hover : translateY(-4px) + ombre.

4. HOW IT WORKS : Titre "How FinTrack Works". 4 etapes horizontales avec numeros cercles connectes par ligne : 1.Sign Up → 2.Connect Accounts → 3.Set Budgets → 4.Track & Save.

5. TESTIMONIALS : Titre "Loved by thousands". 3 cartes avec avatar (initiales colorees), citation, nom, role, etoiles dorees.

6. PRICING PREVIEW : Titre "Simple, transparent pricing". 3 cartes (Free $0, Pro $9.99 avec badge "Most Popular", Premium $19.99). Toggle mensuel/annuel. Liste features avec checkmarks. Boutons CTA.

7. FAQ : 8 questions en accordion shadcn/ui (ex: "Is there a free trial?", "Can I cancel anytime?", "What payment methods?", etc.)

8. CTA BANNER : Fond gradient amber. "Ready to take control of your finances?" + bouton "Start Your Free Trial".

9. FOOTER : Utilise LandingFooter component.

Animations Framer Motion : whileInView avec viewport={{ once: true }} sur chaque section.
Exporte par defaut. Verifie la compilation.
```

---

### PROMPT 5.2 — Page d'authentification
```
Cree src/pages/Auth.tsx :

Layout two-column :
- GAUCHE (hidden mobile) : fond gradient navy-900→navy-950, pattern grille subtile, texte "Welcome to FinTrack" (36px serif blanc), sous-texte "Join 50,000+ users mastering their finances", img src="/hero-dashboard.png" className="opacity-60" en bas.

- DROITE : fond navy-900. Deux modes togglables :

MODE LOGIN :
  * "Sign In" titre (28px blanc)
  * Bouton Google OAuth (outline, icone + "Continue with Google")
  * Boutons Apple et Microsoft OAuth (idem)
  * Separateur "or continue with email"
  * Input Email avec validation format
  * Input Password avec bouton oeil show/hide
  * Checkbox "Remember me"
  * Bouton "Sign In" amber pleine largeur
  * Lien "Forgot password?"
  * Bas : "Don't have an account? Sign up" (lien toggle)

MODE REGISTER :
  * "Create Account" titre
  * Boutons OAuth (idem)
  * Input Full Name
  * Input Email
  * Input Password avec barre de force (Weak rouge / Medium orange / Strong vert)
  * Input Confirm Password avec validation match
  * Checkbox "I agree to Terms and Privacy Policy"
  * Bouton "Create Account" amber
  * Bas : "Already have an account? Sign in"

FORGOT PASSWORD (modal overlay) :
  * Input email + bouton "Send Reset Link"

Validation : required, email regex, password min 8 chars, password match.
Utilise useAuth() : await login(email,password) → navigate('/dashboard')
                  : await register(name,email,password) → navigate('/onboarding')

Animation toggle : Framer Motion AnimatePresence entre login et register.
Exporte par defaut. Verifie la compilation.
```

---

### PROMPT 5.3 — Page de prix (Pricing)
```
Cree src/pages/Pricing.tsx (en anglais, publique) :

HEADER : "Simple, transparent pricing" (48px serif), "Choose the plan that fits your financial journey. No hidden fees."

TOGGLE : Monthly / Yearly. Yearly affiche badge "Save 17%". State useState pour interval.

3 CARTES (responsive grid 1→3 colonnes) :

FREE : Bordure slate (#94A3B8). Prix "$0". 5 features avec checkmarks. Bouton "Get Started Free" outline. Pas de badge.

PRO : Bordure amber (#F59E0B), badge "Most Popular" (pill amber en haut). Prix "$9.99/mo" ou "$8.33/mo" (yearly). 8 features : unlimited transactions, unlimited budgets, 10 goals, full analytics, debt tracking, CSV/PDF export, multi-currency, priority support. Bouton "Start Pro Trial" amber pleine largeur.

PREMIUM : Bordure gradient (amber→rose #EC4899), badge "Best Value". Prix "$19.99/mo" ou "$16.66/mo". Tout Pro + : unlimited goals, AI insights, crypto payments, 50+ currencies, family sharing (5), API access, 24/7 phone support. Bouton "Go Premium" gradient bg.

TABLEAU DE COMPARAISON : 25 lignes, 4 colonnes (Feature | Free | Pro | Premium). Categories : Core, Budgeting, Savings, Analytics, Debt, Data Export, Payments, Support. Utilise ✓, ✗, et texte pour les valeurs.

FAQ : 10 questions pricing-specifiques en accordion.

CTA : "Still have questions? Contact us at support@fintrack.app"

Navigation CTA : utilise useNavigate() pour /checkout/${planId}?interval=${interval}

Animations : whileInView sur chaque section. Exporte par defaut. Verifie.
```

---

## PHASE 6 — Parcours d'achat (Onboarding + Checkout)
### Context : [01-SPECIFICATIONS_TECHNIQUES.md](01-SPECIFICATIONS_TECHNIQUES.md) | [08-DOCUMENTATION_UTILISATEUR.md](08-DOCUMENTATION_UTILISATEUR.md)

---

### PROMPT 6.1 — Wizard d'onboarding
```
Cree src/pages/Onboarding.tsx :

Page protegee. Fond warm-cream. Wizard en 4 etapes avec barre de progression (4 cercles + ligne connectante en haut).

ETAPE 0 (Welcome) :
- "Welcome to FinTrack!" titre (36px serif)
- "Let's get you set up in just a few steps" sous-titre
- Deux boutons : "Choose a Plan" → navigate('/pricing'), "Continue with Free" → setStep(1)

ETAPE 1 (Profile Setup) :
- "Set Up Your Profile" titre
- Form : Full Name (pre-filled depuis useAuth().state.user?.name), Currency (USD/EUR/GBP dropdown), Language (English/Francais/Espanol dropdown), Monthly Income (input numerique avec prefixe $)
- Bouton "Continue" amber

ETAPE 2 (Quick Tour) :
- "Take a Quick Tour" titre
- Carousel de 3 cartes :
  * "Your Dashboard" — div placeholder amber 180x120 avec "Dashboard preview"
  * "Track Transactions" — div placeholder bleu 180x120
  * "Set Budgets" — div placeholder vert 180x120
- Boutons "Previous" / "Next", lien "Skip tour"
- Indicateurs de slide (3 dots)

ETAPE 3 (Done) :
- Cercle vert anime avec checkmark (Check icon, scale animation)
- "You're all set!" titre
- "Your financial journey starts now." sous-titre
- Bouton "Go to Dashboard" amber → navigate('/dashboard')

Logique : useState pour step (0-3). Framer Motion AnimatePresence pour transitions entre etapes. Exporte par defaut. Verifie.
```

---

### PROMPT 6.2 — Page de paiement (Checkout)
```
Cree src/pages/Checkout.tsx :

Route : /checkout/:planId. Protegee. Fond warm-cream. Layout deux colonnes.

COLONNE GAUCHE (Order Summary) :
- Lit planId depuis useParams(), interval depuis URLSearchParams
- Valide planId contre le tableau plans
- Nom du plan + badge couleur (amber Pro, gradient Premium, gray Free)
- Prix : "$9.99/month" ou "$99.99/year" avec badge "Save 17%" si yearly
- Liste 5 features cles du plan
- "Total today: $X.XX" en gras
- "You can cancel anytime" avec icone info
- Lien "← Back to pricing"

COLONNE DROITE (Payment Methods — Tabs shadcn/ui) :

TAB "Credit Card" :
- Icone CreditCard + titre "Pay with Card"
- Input Card Number (16 chiffres, formatte avec espaces)
- Row : Input Expiry (MM/YY) + Input CVV (3 chiffres)
- Input Cardholder Name
- Checkbox "Remember this card"
- Bouton "Pay $X.XX" amber
- Au clic : etat loading 1.5s, puis toast "Payment successful!" via sonner, appelle upgradePlan(planId, interval), navigate('/dashboard')
- Texte "🔒 Secured by Stripe" avec Lock icon

TAB "Cryptocurrency" :
- Section Bitcoin : QR placeholder (180x180 carre noir avec "BTC QR"), adresse "bc1q...xyz" avec bouton Copy
- Section Ethereum : idem avec "ETH QR"
- "Amount: ~0.00017 BTC (~$9.99)"
- Bouton "I've sent the payment" amber
- Disclaimer : "Crypto payments are processed within 24 hours"

TAB "Mobile Money" :
- Selection provider : bouton MTN (fond #FFCC00, texte sombre) et bouton Orange (fond #FF6600, texte blanc)
- Input Phone Number avec select country code : +1, +44, +233 (Ghana), +225 (CI), +237 (Cameroon), +256 (Uganda)
- Bouton "Request Payment" amber
- Texte : "You will receive a USSD prompt on your phone to confirm payment"
- "Available in Ghana, Ivory Coast, Cameroon, Uganda, and more"

Apres paiement reussi : utilise useSubscription().upgradePlan() puis navigate('/dashboard')

Utilise Tabs, TabsList, TabsTrigger, TabsContent de shadcn/ui.
Exporte par defaut. Verifie la compilation.
```

---

## PHASE 7 — Application Core (Dashboard + Transactions + Budgets)
### Context : [04-MODELE_DONNEES.md](04-MODELE_DONNEES.md) | [08-DOCUMENTATION_UTILISATEUR.md](08-DOCUMENTATION_UTILISATEUR.md)

---

### PROMPT 7.1 — Dashboard
```
Cree src/pages/Dashboard.tsx :

Page principale avec fond warm-cream. Design premium inspire des montres suisses.

HEADER : "Dashboard" (h2 serif 28px) + date du jour formattee.

KPI CARDS (3 cartes en ligne) :
- "Balance" : montant actuel depuis mockData, icone Wallet, tendance +2.3% en vert
- "Income" : total revenus du mois, icone TrendingUp, fond vert clair
- "Expenses" : total depenses du mois, icone TrendingDown, fond rouge clair
- Animation : compteur numerique anime avec useCountUp

AREA CHART (depenses mensuelles) :
- Recharts AreaChart avec 12 mois de donnees
- Gradient gold sous la courbe (defini dans <defs>)
- Selecteur de periode : 6M / 1Y / All
- Tooltip personnalise avec format currency

BUDGET PROGRESS (mini section) :
- 3 barres de progression pour les budgets les plus utilises
- Couleurs : gold < 75%, orange < 90%, rouge > 90%
- "View all" lien vers /budgets

DOUGHNUT CHART (repartition depenses) :
- Recharts PieChart avec 6 segments (categories principales)
- Centre : texte "Total" + montant
- Legende a droite avec couleurs

GOALS PREVIEW (3 objectifs) :
- Anneaux de progression SVG avec stroke-dashoffset anime
- Icone, nom, montant actuel / cible, pourcentage, date butoir
- "View all" lien vers /objectifs

RECENT TRANSACTIONS (tableau 5 lignes) :
- Colonnes : Date, Description, Category (avec dot coloree), Amount (vert pour income, rouge pour expense)
- "View all" lien vers /transactions

Animations Framer Motion : stagger pour les cartes, whileInView pour les graphiques.
Utilise les donnees depuis @/data/mockData.
Exporte par defaut. Verifie la compilation.
```

---

### PROMPT 7.2 — Transactions
```
Cree src/pages/Transactions.tsx :

Page CRUD complete avec fond warm-cream.

HEADER : "Transactions" + bouton "Add Transaction" (amber) + bouton "Export CSV"

FILTRES (barre horizontale) :
- Search input (debounced, 300ms)
- Type filter : All / Income / Expense
- Category filter : dropdown multi-select avec dots colorees
- Date range : DatePicker (shadcn/ui Calendar)
- Sort : Date / Amount / Description (asc/desc toggle)

SUMMARY BAR : Total Income (vert), Total Expenses (rouge), Count

DATA TABLE (sortable) :
- Colonnes : Select checkbox, Date, Description, Category (dot + nom), Type badge, Payment Method, Amount (signe colore), Actions
- 30 transactions paginees (10/25/50 par page)
- Row selection : checkboxes avec select-all, bulk actions bar (Export selected, Delete selected)
- Pagination : numeros de page, items per page selector

ADD/EDIT DRAWER (Sheet shadcn/ui, slide depuis droite) :
- Toggle Type : Income / Expense
- Amount input avec format numerique
- Description input
- Category dropdown (coloree)
- Date picker
- Payment Method : grid d'icones (Card, Cash, Transfer, Check)
- Notes textarea
- Bouton Save (validation requise)

DELETE MODAL : Dialog de confirmation avec warning

EMPTY STATE : illustration + "No transactions yet" + CTA

Animations : staggered row entrance, drawer slide, modal scale.
Utilise @/data/mockData pour les donnees et categories.
Exporte par defaut. Verifie.
```

---

### PROMPT 7.3 — Budgets
```
Cree src/pages/Budgets.tsx :

Page de gestion des budgets avec fond warm-cream.

HEADER : "Budgets" + selecteur de mois + bouton "Add Budget"

ALERTS SECTION : Budgets proches de la limite ou depasses, badges de severite

SUMMARY CARDS (3) : Total Budget, Total Spent, Remaining (avec couleur selon signe)

GLOBAL PROGRESS BAR : Barre horizontale montrant la repartition globale

BUDGET CARDS GRID (2 colonnes) :
Chaque carte : icone categorie, nom, Spent/Limit avec badge pourcentage, barre de progression coloree (gold <75%, orange <90%, rouge >100%), badge statut (Excellent/Bon/Attention/Critique/Depasse), "Reste : €XX"

EDIT MODAL : Champ limit input + slider threshold 50-100%
ADD MODAL : Dropdown categorie non-budgetisee + limit input + threshold slider + mois

Utilise @/data/mockData pour budgets et categories.
Exporte par defaut. Verifie.
```

---

## PHASE 8 — Dettes + Objectifs + Analytics
### Context : [04-MODELE_DONNEES.md](04-MODELE_DONNEES.md) | [07-PLAN_TEST.md](07-PLAN_TEST.md)

---

### PROMPT 8.1 — Gestion des dettes
```
Cree src/pages/Dettes.tsx :

Page de gestion des dettes entre particuliers. Fond warm-cream.

HEADER : "My Debts" + bouton "New Debt"

SUMMARY CARDS (3) :
- "Total to Receive" : somme des dettes 'owed-to-me' restantes, icone bleu
- "Total to Repay" : somme des dettes 'i-owe' restantes, icone rouge
- "Net Balance" : receivable - payable, vert si positif, rouge si negatif

TABS : "I Owe" / "Owed to Me" avec indicateurs de compte

FILTRES : Search by person, Status filter (All/Active/Paid/Overdue), Sort (date/amount/name)

DEBT CARDS (grid) :
Chaque carte : Avatar cercle avec initiales (couleur selon lettre), nom personne, description, montant total, barre de progression SVG coloree (gold=active, green=paid, red=overdue), badge statut pill, due date, "Remaining : €XX", bouton "Pay" (pour actives) + "View History"

ADD/EDIT DEBT DRAWER (Sheet) :
- Person name, contact, description
- Amount input
- Type toggle : "I Owe" / "Owed to Me"
- Due date picker (Calendar shadcn/ui)
- Note textarea
- Reminder toggle (Switch)

PAYMENT DRAWER (Sheet) :
- Quick amount buttons : 10%, 25%, 50%, 100% du montant restant
- Amount input libre
- Note textarea
- Preview : "Remaining after payment : €XX"
- "Confirm Payment" bouton

DETAIL MODAL (Dialog) :
- Info personne avec avatar
- Debt details : amount, repaid, remaining, status, due date
- Barre de progression
- Historique complet des paiements (table : date, amount, note)
- Boutons Edit/Delete

EMPTY STATE : illustration + "No debts yet" + CTA

Utilise @/data/mockData pour les dettes (export const debts).
Exporte par defaut. Verifie la compilation.
```

---

### PROMPT 8.2 — Objectifs d'epargne
```
Cree src/pages/Objectifs.tsx :

Page d'objectifs d'epargne. Fond warm-cream.

HEADER : "Savings Goals" + bouton "New Goal"

SUMMARY STATS (4 cartes) : Active Goals, Total Target, Total Saved (avec barre), Remaining

GOALS GRID (2 colonnes) :
Chaque carte : bordure gauche coloree, icone cercle, titre, description, anneau de progression SVG anime (stroke-dashoffset), montant actuel / cible, pourcentage, info pills (deadline, monthly contribution, days remaining), boutons "Contribute" + "History", barre de progression en bas

CONTRIBUTION DRAWER (Sheet) :
- Quick amount buttons : €10, €50, €100, €500
- Amount input
- Note textarea
- Live preview : impact sur le pourcentage

CREATE GOAL MODAL (Dialog) :
- Name input
- Target amount
- Date picker deadline
- Color picker (8 presets)
- Icon selector (18 Lucide icons en grille)
- Description textarea
- Monthly suggestion auto-calculee

DETAIL MODAL : Vue elargie avec historique contributions, edit/delete

Motivational messages selon le progres (0-25% : "Every dollar counts", 25-50% : "Good start", 50-75% : "Great progress", 75-100% : "Almost there!", 100% : "Goal reached! Congratulations!")

EMPTY STATE : illustration + CTA

Utilise @/data/mockData (export const mockGoals).
Exporte par defaut. Verifie.
```

---

### PROMPT 8.3 — Analytics
```
Cree src/pages/Analytics.tsx :

Page d'analytics detaillee. Fond warm-cream.

PERIOD SELECTOR : 6 mois / Cette annee / Personnalise (avec date range)

4 KPI CARDS : Balance actuelle, Total revenus, Total depenses, Economies (taux d'epargne)

CHARTS ROW 1 (2 colonnes) :
- AreaChart "Revenus vs Depenses" : dual line avec gradients vert/rouge, ligne moyenne
- Horizontal BarChart "Top Categories" : categories triees par montant, couleurs personnalisees

CHARTS ROW 2 (2 colonnes) :
- AreaChart "Evolution du Patrimoine" : gradient gold fill
- RadarChart "Repartition Mensuelle" : 6 axes pour les categories principales

DEBT ANALYTICS SECTION (tague [04-MODELE_DONNEES.md]) :
- 4 KPI Cards : A recevoir / A rembourser / Solde net / En retard
- AreaChart "Evolution des dettes" : dual line (aRecevoir bleu, aRembourser rouge)
- BarChart "Solde net mensuel" : barres vertes (positif) / rouges (negatif) avec ReferenceLine y=0

DETAIL TABLE : Categories avec dots colorees, montants, pourcentages, barres de progression, fleches d'evolution, sparklines mini, sous-categories extensibles

Export button (CSV) en haut a droite.

Utilise @/data/mockData pour monthlyData, categorySpending, monthlyDebtData, debtPersonAnalytics.
Exporte par defaut. Verifie.
```

---

## PHASE 9 — SaaS Management (Subscription + Billing + Settings)
### Context : [02-API_REFERENCE.md](02-API_REFERENCE.md) | [08-DOCUMENTATION_UTILISATEUR.md](08-DOCUMENTATION_UTILISATEUR.md)

---

### PROMPT 9.1 — Gestion d'abonnement
```
Cree src/pages/SubscriptionPage.tsx :

Route /subscription. Protegee. Fond warm-cream.

CURRENT PLAN SECTION :
- Plan badge (amber=Pro, gradient=Premium, gray=Free)
- Status badge : "Active" vert, "Cancelled" orange, "Expired" rouge
- Prix : "$9.99/month"
- Periode : "May 1, 2025 → Jun 1, 2025"
- Barre de progression : jours restants / total jours
- Toggle "Auto-renew" (Switch shadcn/ui)
- Si cancelled : banner warning "Your subscription ends on [date]. Renew to keep your features." + bouton "Reactivate" qui appelle reactivateSubscription()

USAGE SECTION :
- 4 barres de progression : Transactions (45/50), Budgets (8/unlimited), Goals (3/10), Debts (2/unlimited)
- Couleur : amber=bon, orange=attention, rouge=limite atteinte

CHANGE PLAN SECTION :
- 3 cartes plans cote a cote (Free/Pro/Premium)
- Plan actuel surligne avec bordure
- Bouton "Switch to [Plan]" sur chaque carte
- Au clic : Dialog de confirmation expliquant les changements (features gagnees/perdues)
- Sur confirm : appelle upgradePlan(planId, 'monthly')

CANCELLATION SECTION (carte danger, bordure rouge) :
- Bouton "Cancel Subscription" texte rouge
- Au clic : Dialog retention 3-etapes :
  * Etape 1 : "We're sorry to see you go. Why are you leaving?" Radio options (Too expensive, Missing features, Found alternative, Other) + textarea
  * Etape 2 : Retention offer ! "Get 50% off your next 3 months — just $4.99/mo" avec boutons "Accept Offer" (amber) / "Continue Cancelling" (outline)
  * Etape 3 : "Are you sure?" + liste des features perdues. "Confirm Cancellation" (rouge) / "Keep Subscription" (amber)
- Sur confirm : appelle cancelSubscription()

PAYMENT METHOD : Carte actuelle (Visa •••• 4242) + bouton "Update"

Utilise useSubscription() pour toutes les actions.
Exporte par defaut. Verifie la compilation.
```

---

### PROMPT 9.2 — Facturation
```
Cree src/pages/Billing.tsx :

Route /billing. Protegee. Fond warm-cream.

HEADER : "Billing" (h2 serif) + "Manage your payments and invoices"

PAYMENT METHODS SECTION :
- Carte par methode : icone (CreditCard/Bitcoin/Smartphone), label, details (last4, expiry), badge "Default" si defaut
- Bouton "Add Payment Method" → Dialog avec 3 options : Credit Card, Crypto Wallet, Mobile Money
- Bouton "Remove" pour les methodes non-defaut
- Bouton "Set as Default"

INVOICE HISTORY TABLE :
- Colonnes : Date, Description, Amount, Status, Payment Method, Actions
- 5 factures depuis mockInvoices
- Status badge : "Paid" vert, "Pending" jaune, "Failed" rouge
- Methode : icone adaptee (CreditCard, Bitcoin, Smartphone)
- Action : bouton "Download PDF" → toast "PDF downloaded"

BILLING INFORMATION SECTION :
- Form : Full Name, Email, Company (optional), Address, City, Postal Code, Country
- Tax ID / VAT Number (optional)
- Bouton "Save" amber
- Pre-rempli avec donnees mock

TOTAL SPENT CARD : "You've spent $49.95 with FinTrack" + petit bar chart mensuel

Utilise useSubscription() pour les methodes de paiement et les factures.
Exporte par defaut. Verifie.
```

---

### PROMPT 9.3 — Parametres (Settings)
```
Cree src/pages/Settings.tsx :

Route /settings. Protegee. Fond warm-cream. 6 onglets via shadcn/ui Tabs.

TAB 1 — Profile :
- Zone upload avatar (cercle avec avatar actuel + overlay camera)
- Input Full Name
- Input Email
- Textarea Bio (optional)
- Bouton "Save Changes" amber → toast + updateUser()

TAB 2 — Regional (i18n) :
- Language : 3 cartes radio (🇺🇸 English, 🇫🇷 Francais, 🇪🇸 Espanol)
- Currency : dropdown USD/EUR/GBP
- Date Format : 3 options (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)
- Timezone : dropdown avec zones communes
- LIVE PREVIEW : "Sample: December 25, 2025 → $1,234.56" qui se met a jour en temps reel
- Bouton "Save Preferences" amber

TAB 3 — Notifications :
- 6 toggles (Switch) : Budget alerts, Goal reminders, Weekly summary, New features, Bill due, Account security
- Chaque : label + description
- "Email frequency" dropdown : Real-time, Daily digest, Weekly
- Bouton "Save"

TAB 4 — Security :
- Change Password : Current, New, Confirm + strength meter (barre coloree Weak→Strong)
- Two-Factor Auth : Toggle Enable/Disable + QR code placeholder quand enabled
- Active Sessions : liste avec device, location, last active, badge "This device", bouton "Revoke"

TAB 5 — Billing (link) :
- Carte resume du plan actuel
- Bouton "Manage Subscription" → /subscription
- Bouton "View Invoices" → /billing

TAB 6 — Danger Zone (carte bordure rouge) :
- "Delete Account" bouton rouge
- Dialog : input "type DELETE to confirm" + texte explicatif suppression
- "I understand, delete my account" (rouge) / "Cancel"

Utilise useAuth().updateUser() pour sauvegarder.
Exporte par defaut. Verifie la compilation.
```

---

## PHASE 10 — Build & Deploiement
### Context : [05-GUIDE_INSTALLATION.md](05-GUIDE_INSTALLATION.md) | [06-GUIDE_DEVELOPPEUR.md](06-GUIDE_DEVELOPPEUR.md)

---

### PROMPT 10.1 — Build et verification
```
Execute les commandes suivantes pour verifier le projet :

1. "npm run build" — doit completer sans erreur TypeScript
2. Si erreurs de type : corrige les imports manquants, les types implicites 'any', et les variables non utilisees
3. Verifie que le dossier dist/ contient : index.html + assets/ (JS + CSS bundles)
4. "npm run preview" pour tester localement le build de production

Commandes de build :
```bash
cd <project-path>
npm run build
# Sortie attendue : dist/index.html + dist/assets/*.js + dist/assets/*.css
```
```

---

### PROMPT 10.2 — Deploiement
```
Deploie l'application comme site statique :

1. Le build genere un dossier dist/ avec des chemins relatifs (base: './' dans vite.config.ts)
2. Copie le contenu du dossier dist/ vers le serveur de publication
3. Deploie comme site statique

Options de deploiement recommandees :

A. Vercel (recommande) :
```bash
npm i -g vercel
vercel --prod
```

B. Netlify :
- Build command : npm run build
- Publish directory : dist
- Deploy

C. GitHub Pages :
```bash
npm run build
git add dist -f
git commit -m 'deploy'
git subtree push --prefix dist origin gh-pages
```

L'application utilise HashRouter, donc toutes les routes fonctionnent comme un SPA avec #/ dans l'URL.
```

---

## INDEX DES PROMPTS PAR PHASE

| Phase | Prompts | Context Document | Description |
|-------|---------|------------------|-------------|
| **0** | 0.1 | [01-SPECIFICATIONS_TECHNIQUES.md](01-SPECIFICATIONS_TECHNIQUES.md) | Initialisation projet |
| **1** | 1.1–1.3 | [04-MODELE_DONNEES.md](04-MODELE_DONNEES.md) | Types et donnees mock |
| **2** | 2.1–2.4 | [03-ARCHITECTURE_SYSTEME.md](03-ARCHITECTURE_SYSTEME.md) | Contextes et hooks |
| **3** | 3.1–3.5 | [03-ARCHITECTURE_SYSTEME.md](03-ARCHITECTURE_SYSTEME.md) | Composants partages |
| **4** | 4.1–4.2 | [03-ARCHITECTURE_SYSTEME.md](03-ARCHITECTURE_SYSTEME.md) | Routing et entry point |
| **5** | 5.1–5.3 | [08-DOCUMENTATION_UTILISATEUR.md](08-DOCUMENTATION_UTILISATEUR.md) | Pages publiques |
| **6** | 6.1–6.2 | [01-SPECIFICATIONS_TECHNIQUES.md](01-SPECIFICATIONS_TECHNIQUES.md) | Parcours d'achat |
| **7** | 7.1–7.3 | [04-MODELE_DONNEES.md](04-MODELE_DONNEES.md) | Application core |
| **8** | 8.1–8.3 | [07-PLAN_TEST.md](07-PLAN_TEST.md) | Dettes, Objectifs, Analytics |
| **9** | 9.1–9.3 | [02-API_REFERENCE.md](02-API_REFERENCE.md) | SaaS management |
| **10** | 10.1–10.2 | [05-GUIDE_INSTALLATION.md](05-GUIDE_INSTALLATION.md) | Build et deploiement |

---

## TOTALS

| Metrique | Valeur |
|----------|--------|
| Phases | 11 |
| Prompts | 29 |
| Pages crees | 15 |
| Documents context | 8 (01–08) |
| Stack | React 19 + TypeScript + Vite + Tailwind v3 + shadcn/ui |
