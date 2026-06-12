# Guide du Developpeur — FinTrack SaaS

## Table des matieres

1. [Structure du projet](#1-structure-du-projet)
2. [Conventions de code](#2-conventions-de-code)
3. [Patterns de composants](#3-patterns-de-composants)
4. [Guide de gestion d'etat](#4-guide-de-gestion-detat)
5. [Ajout d'une nouvelle page](#5-ajout-dune-nouvelle-page)
6. [Guide de feature gating](#6-guide-de-feature-gating)
7. [Ajout d'un moyen de paiement](#7-ajout-dun-moyen-de-paiement)
8. [Guide de developpement i18n](#8-guide-de-developpement-i18n)
9. [Strategie de tests](#9-strategie-de-tests)
10. [Directives de contribution](#10-directives-de-contribution)

---

## 1. Structure du projet

L'architecture du projet FinTrack SaaS suit une organisation modulaire et evolutive. Chaque dossier a un role defini pour faciliter la navigation et la maintenance du code.

### Arborescence complete

```
fintrack/
|
|-- public/                          # Assets statiques (favicons, images, fonts)
|   |-- favicon.ico
|   |-- logo.svg
|   |-- og-image.png
|   |-- locales/                     # Fichiers JSON de traduction
|   |   |-- en.json
|   |   |-- fr.json
|   |   |-- es.json
|   |   |-- de.json
|   |   |-- pt.json
|   |   |-- ar.json
|   |   |-- zh.json
|   |   |-- ja.json
|   |   |-- hi.json
|   |   |-- ru.json
|   |   |-- it.json
|   |   |-- nl.json
|   |   |-- ko.json
|   |   |-- tr.json
|   |   |-- pl.json
|   |   |-- vi.json
|   |   |-- th.json
|   |   |-- id.json
|   |   |-- sw.json
|   |   |-- am.json
|   |   |-- ha.json
|   |   |-- ig.json
|   |   |-- yo.json
|   |   |-- zh-TW.json
|   |   |-- bn.json
|   |   |-- ta.json
|   |   |-- ur.json
|   |   |-- fa.json
|   |   |-- ms.json
|   |   |-- fil.json
|   |   |-- ro.json
|   |   |-- el.json
|   |   |-- cs.json
|   |   |-- hu.json
|   |   |-- sv.json
|   |   |-- da.json
|   |   |-- fi.json
|   |   |-- no.json
|   |   |-- he.json
|   |   |-- uk.json
|   |   |-- bg.json
|   |   |-- sr.json
|   |   |-- hr.json
|   |   |-- sk.json
|   |   |-- sl.json
|   |   |-- lt.json
|   |   |-- lv.json
|   |   |-- et.json
|   |   |-- mk.json
|   |   |-- sq.json
|   |   |-- ka.json
|   |   |-- hy.json
|   |   |-- az.json
|   |   |-- uz.json
|   |   |-- kk.json
|   |   |-- ky.json
|   |   |-- mn.json
|   |   |-- my.json
|   |   |-- km.json
|   |   |-- lo.json
|   |   |-- ne.json
|   |   |-- si.json
|   |   |-- ml.json
|   |   |-- te.json
|   |   |-- mr.json
|   |   |-- gu.json
|   |   |-- pa.json
|   |   |-- kn.json
|   |   |-- or.json
|   |   |-- as.json
|   |   |-- bh.json
|   |   |-- mai.json
|   |   |-- sa.json
|   |   |-- sd.json
|   |   |-- ckb.json
|   |   |-- ps.json
|   |-- _redirects                    # Regles de redirection (Netlify)
|   |-- .htaccess                     # Configuration Apache (hebergement autonome)
|
|-- src/
|   |
|   |-- main.tsx                      # Point d'entree React (createRoot)
|   |-- App.tsx                       # Configuration des routes (RouterProvider)
|   |-- index.css                     # Styles globaux + variables CSS + directives Tailwind
|   |
|   |-- pages/                        # Pages de l'application (une par route)
|   |   |-- LandingPage.tsx           # Page d'accueil publique
|   |   |-- DashboardPage.tsx         # Tableau de bord principal
|   |   |-- TransactionsPage.tsx      # Liste des transactions
|   |   |-- ReportsPage.tsx           # Rapports financiers
|   |   |-- BudgetPage.tsx            # Gestion du budget
|   |   |-- SettingsPage.tsx          # Parametres utilisateur
|   |   |-- SubscriptionPage.tsx      # Page d'abonnement
|   |   |-- CheckoutPage.tsx          # Page de paiement
|   |   |-- CryptoPaymentPage.tsx     # Paiement crypto
|   |   |-- LoginPage.tsx             # Authentification
|   |   |-- RegisterPage.tsx          # Inscription
|   |   |-- PricingPage.tsx           # Grille tarifaire
|   |   |-- ProfilePage.tsx           # Profil utilisateur
|   |   |-- CategoriesPage.tsx        # Categories de transactions
|   |   |-- ImportExportPage.tsx      # Import/Export de donnees
|   |   |-- NotFoundPage.tsx          # Page 404
|   |
|   |-- components/                   # Composants React
|   |   |-- ui/                       # Composants shadcn/ui (40+)
|   |   |   |-- button.tsx
|   |   |   |-- card.tsx
|   |   |   |-- dialog.tsx
|   |   |   |-- input.tsx
|   |   |   |-- select.tsx
|   |   |   |-- table.tsx
|   |   |   |-- tabs.tsx
|   |   |   |-- toast.tsx
|   |   |   |-- ... (composants shadcn/ui)
|   |   |
|   |   |-- layout/                   # Composants de mise en page
|   |   |   |-- Navbar.tsx            # Barre de navigation responsive
|   |   |   |-- Sidebar.tsx           # Barre laterale (desktop)
|   |   |   |-- Footer.tsx            # Pied de page
|   |   |   |-- MobileNav.tsx         # Navigation mobile
|   |   |   |-- PageHeader.tsx        # En-tete de page
|   |   |   |-- Breadcrumb.tsx        # Fils d'Ariane
|   |   |
|   |   |-- dashboard/                # Composants du tableau de bord
|   |   |   |-- StatsCards.tsx        # Cartes de statistiques
|   |   |   |-- ChartSection.tsx      # Section graphiques (Recharts)
|   |   |   |-- RecentTransactions.tsx # Liste des transactions recentes
|   |   |   |-- CashFlowChart.tsx     # Graphique de flux de tresorerie
|   |   |   |-- ExpenseBreakdown.tsx  # Repartition des depenses
|   |   |   |-- IncomeVsExpense.tsx   # Revenus vs depenses
|   |   |
|   |   |-- transactions/             # Composants transactions
|   |   |   |-- TransactionList.tsx   # Liste des transactions
|   |   |   |-- TransactionForm.tsx   # Formulaire d'ajout/edition
|   |   |   |-- TransactionFilter.tsx # Filtres avances
|   |   |   |-- TransactionImport.tsx # Import CSV/OFX
|   |   |
|   |   |-- reports/                  # Composants rapports
|   |   |   |-- ReportChart.tsx       # Graphiques de rapport
|   |   |   |-- ReportTable.tsx       # Tableau de donnees
|   |   |   |-- DateRangePicker.tsx   # Selection de periode
|   |   |
|   |   |-- subscription/             # Composants abonnement
|   |   |   |-- PricingCard.tsx       # Carte de tarification
|   |   |   |-- PlanComparison.tsx    # Comparaison des plans
|   |   |   |-- FeatureGate.tsx       # Verrouillage fonctionnalites
|   |   |   |-- UpgradePrompt.tsx     # Incitation a la mise a niveau
|   |   |
|   |   |-- payment/                  # Composants paiement
|   |   |   |-- StripeCheckout.tsx    # Integration Stripe
|   |   |   |-- CryptoPayment.tsx     # Paiement crypto
|   |   |   |-- MobileMoneyForm.tsx   # Formulaire Mobile Money
|   |   |   |-- PaymentMethodCard.tsx # Carte methode de paiement
|   |   |   |-- PaymentHistory.tsx    # Historique des paiements
|   |   |
|   |   |-- auth/                     # Composants authentification
|   |   |   |-- LoginForm.tsx         # Formulaire de connexion
|   |   |   |-- RegisterForm.tsx      # Formulaire d'inscription
|   |   |   |-- AuthGuard.tsx         # Protection des routes
|   |   |   |-- UserMenu.tsx          # Menu utilisateur (header)
|   |   |
|   |   |-- shared/                   # Composants partages transversaux
|   |   |   |-- AnimatedContainer.tsx # Conteneur avec animation (Framer Motion)
|   |   |   |-- LoadingSpinner.tsx    # Indicateur de chargement
|   |   |   |-- ErrorBoundary.tsx     # Gestionnaire d'erreurs
|   |   |   |-- EmptyState.tsx        # Etat vide (liste vide, etc.)
|   |   |   |-- ConfirmDialog.tsx     # Boite de dialogue de confirmation
|   |   |   |-- ThemeToggle.tsx       # Basculeur theme clair/sombre
|   |   |   |-- LanguageSwitcher.tsx  # Selecteur de langue
|   |   |   |-- ExportButton.tsx      # Bouton d'export CSV/PDF
|   |   |   |-- StatusBadge.tsx       # Badge de statut (succes, erreur, etc.)
|   |   |   |-- SearchInput.tsx       # Champ de recherche
|   |   |   |-- DataTable.tsx         # Tableau de donnees reutilisable
|   |   |   |-- Pagination.tsx        # Pagination
|   |   |   |-- FilterDropdown.tsx    # Filtre deroulant
|   |   |   |-- TooltipInfo.tsx       # Tooltip informatif
|   |   |   |-- ScrollToTop.tsx       # Retour en haut de page
|   |   |   |-- SeoHead.tsx           # Gestion des meta tags
|   |   |   |-- WebVitals.tsx         # Monitoring Core Web Vitals
|   |   |
|   |   |-- forms/                    # Composants formulaires reutilisables
|   |       |-- FormField.tsx         # Champ de formulaire avec label + erreur
|   |       |-- FormSelect.tsx        # Select avec validation
|   |       |-- FormDatePicker.tsx    # Date picker avec validation
|   |       |-- FormCurrencyInput.tsx # Saisie montant avec devise
|   |       |-- FormCategorySelect.tsx # Selecteur de categorie
|   |       |-- FormFileUpload.tsx    # Upload de fichier
|   |
|   |-- hooks/                        # Hooks React personnalises
|   |   |-- useAuth.ts                # Gestion de l'authentification
|   |   |-- useLocalStorage.ts        # Persistance localStorage
|   |   |-- useMediaQuery.ts          # Detection responsive
|   |   |-- useDebounce.ts            # Debounce de valeurs
|   |   |-- useFeatureGate.ts         # Verrouillage fonctionnalites
|   |   |-- useCurrency.ts            # Formatage des devises
|   |   |-- useTheme.ts               # Gestion du theme (clair/sombre)
|   |   |-- useApi.ts                 # Appels API (future integration)
|   |   |-- usePagination.ts          # Logique de pagination
|   |   |-- useSearch.ts              # Recherche et filtrage
|   |   |-- useExport.ts              # Export CSV/PDF
|   |   |-- useFormValidation.ts      # Validation de formulaires
|   |   |-- useChartData.ts           # Transformation des donnees pour Recharts
|   |   |-- useToast.ts               # Notifications toast
|   |   |-- useScrollPosition.ts      # Position de defilement
|   |   |-- useOnlineStatus.ts        # Detection de la connexion
|   |   |-- useIdleTimer.ts           # Detection d'inactivite
|   |
|   |-- contexts/                     # Contextes React
|   |   |-- AuthContext.tsx           # Contexte d'authentification
|   |   |-- SubscriptionContext.tsx   # Contexte d'abonnement
|   |   |-- ThemeContext.tsx          # Contexte de theme
|   |   |-- LanguageContext.tsx       # Contexte de langue/i18n
|   |   |-- NotificationContext.tsx   # Contexte de notifications
|   |   |-- CurrencyContext.tsx       # Contexte de devise
|   |
|   |-- lib/                          # Utilitaires et fonctions
|   |   |-- utils.ts                  # Fonctions utilitaires (cn, formatDate, etc.)
|   |   |-- constants.ts              # Constantes globales
|   |   |-- validators.ts             # Schemas Zod de validation
|   |   |-- formatting.ts             # Fonctions de formatage (devise, date, nombre)
|   |   |-- analytics.ts              # Helpers Google Analytics
|   |   |-- export-utils.ts           # Logique d'export CSV/PDF
|   |   |-- chart-helpers.ts          # Helpers pour Recharts
|   |   |-- payment-utils.ts          # Logique de paiement
|   |   |-- crypto-utils.ts           # Helpers cryptomonnaie (checksum, etc.)
|   |   |-- security.ts               # Fonctions de securite (XSS, sanitization)
|   |
|   |-- types/                        # Definitions TypeScript
|   |   |-- index.ts                  # Export centralise des types
|   |   |-- auth.ts                   # Types authentification
|   |   |-- transaction.ts            # Types transactions
|   |   |-- subscription.ts           # Types abonnement
|   |   |-- payment.ts                # Types paiement
|   |   |-- chart.ts                  # Types pour les graphiques
|   |   |-- common.ts                 # Types generiques
|   |   |-- api.ts                    # Types API (future integration)
|   |
|   |-- data/                         # Donnees mock et fixtures
|   |   |-- mockTransactions.ts       # Transactions de test
|   |   |-- mockUsers.ts              # Utilisateurs de test
|   |   |-- mockSubscriptions.ts      # Abonnements de test
|   |   |-- categories.ts             # Categories predefinies
|   |   |-- currencies.ts             # Liste des devises supportees
|   |   |-- countries.ts              # Liste des pays pour i18n
|   |   |-- pricingPlans.ts           # Definition des plans tarifaires
|   |   |-- features.ts               # Matrice des fonctionnalites par plan
|   |
|   |-- i18n/                         # Configuration internationalisation
|   |   |-- i18n.ts                   # Initialisation i18n
|   |   |-- config.ts                 # Configuration des langues
|   |   |-- utils.ts                  # Helpers i18n
|   |
|   |-- assets/                       # Assets compiles par Vite
|       |-- images/                   # Images importees dans les composants
|       |-- icons/                    # Icônes SVG personnalisees
|       |-- fonts/                    # Polices de caracteres
|
|-- index.html                        # Page HTML racine
|-- vite.config.ts                    # Configuration Vite (alias @, base, plugins)
|-- tailwind.config.js                # Configuration Tailwind (theme, colors, plugins)
|-- tsconfig.json                     # Configuration TypeScript (strict, paths)
|-- tsconfig.app.json                 # Configuration TS specifique a l'application
|-- tsconfig.node.json                # Configuration TS pour Vite/Node
|-- postcss.config.js                 # Configuration PostCSS (Tailwind + Autoprefixer)
|-- components.json                   # Configuration shadcn/ui
|-- package.json                      # Dependances et scripts npm
|-- package-lock.json                 # Verrouillage des versions
|-- eslint.config.js                  # Configuration ESLint
|-- .eslintrc.json                    # Regles ESLint (extends recommandes)
|-- .prettierrc                       # Configuration Prettier
|-- .prettierignore                   # Fichiers ignores par Prettier
|-- .env.example                      # Variables d'environnement (exemple)
|-- .env.local                        # Variables locales (ignore par Git)
|-- .gitignore                        # Fichiers ignores par Git
|-- vercel.json                       # Configuration Vercel
|-- netlify.toml                      # Configuration Netlify
|-- firebase.json                     # Configuration Firebase Hosting
```

### Description des dossiers

| Dossier | Role | Regle d'or |
|---------|------|-----------|
| `src/pages/` | Composants associes a une route | Un fichier = une route |
| `src/components/ui/` | Composants shadcn/ui base | Ne jamais modifier directement — utiliser `className` pour surcharger |
| `src/components/layout/` | Composants structuraux | Reutilisables sur toutes les pages |
| `src/components/dashboard/` | Composants specifiques au dashboard | Un dossier par domaine fonctionnel |
| `src/hooks/` | Logique reactive partagee | Prefixe `use` obligatoire |
| `src/contexts/` | Etat global par domaine | Un contexte = un domaine metier |
| `src/lib/` | Fonctions pures sans dependance React | Pas de hooks React ici |
| `src/types/` | Definitions TypeScript | Export centralise via `index.ts` |
| `src/data/` | Donnees statiques et mocks | Isoler du code applicatif |
| `public/locales/` | Traductions JSON | Structure identique pour chaque langue |

---

## 2. Conventions de code

### TypeScript — Mode strict

Le projet utilise TypeScript en mode strict. Les regles suivantes sont activees et doivent etre respectees sans exception :

```json
// tsconfig.json (extrait)
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

**Regles fondamentales :**

- Toutes les fonctions doivent avoir un type de retour explicite
- Le type `any` est interdit — utiliser `unknown` en dernier recours
- Les props de composants doivent etre typees via des interfaces
- Les tableaux et objets doivent avoir des types generiques

```typescript
// CORRECT — Typage explicite
interface TransactionProps {
  id: string;
  amount: number;
  currency: CurrencyCode;
  date: Date;
  category: string;
  description?: string;
}

function formatTransaction(props: TransactionProps): string {
  return `${props.description}: ${props.amount} ${props.currency}`;
}

// INCORRECT — any interdit
function badFormat(data: any): any {
  return data.amount;
}
```

### Convention de nommage

| Element | Convention | Exemple |
|---------|-----------|---------|
| Composants React | PascalCase + export default | `DashboardPage.tsx`, `StatsCards.tsx` |
| Hooks personnalises | camelCase avec prefixe `use` | `useAuth.ts`, `useLocalStorage.ts` |
| Utilitaires | camelCase + kebab-case fichier | `formatCurrency()` dans `formatting.ts` |
| Types/Interfaces | PascalCase avec suffixe optionnel | `Transaction`, `UserProfile` |
| Enums | PascalCase + UPPER_SNAKE valeurs | `enum PaymentStatus { PENDING = 'pending' }` |
| Constants | UPPER_SNAKE_CASE | `const MAX_TRANSACTIONS = 1000` |
| Variables booleennes | Prefixe `is`, `has`, `should` | `isLoading`, `hasError`, `shouldRefresh` |
| Fonctions evenement | Prefixe `handle` | `handleSubmit`, `handleClick` |

### Nommage des fichiers

```
# Composants → PascalCase
src/components/dashboard/StatsCards.tsx
src/pages/DashboardPage.tsx

# Hooks → camelCase
src/hooks/useAuth.ts
src/hooks/useFeatureGate.ts

# Utilitaires → camelCase
src/lib/utils.ts
src/lib/formatting.ts

# Types → camelCase
src/types/transaction.ts
src/types/auth.ts

# Pages → Suffixe Page + PascalCase
src/pages/LandingPage.tsx
src/pages/SubscriptionPage.tsx
```

### Ordre des imports

L'ordre des imports dans chaque fichier doit suivre cette structure :

```tsx
// 1. React et hooks natifs
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Bibliotheques tierces
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

// 3. Composants UI (shadcn/ui)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// 4. Composants metier
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TransactionList } from '@/components/transactions/TransactionList';

// 5. Hooks personnalises
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';

// 6. Contextes
import { useSubscription } from '@/contexts/SubscriptionContext';

// 7. Types
import type { Transaction, CurrencyCode } from '@/types';

// 8. Utilitaires
import { formatDate } from '@/lib/formatting';
import { cn } from '@/lib/utils';

// 9. Assets (derniers)
import logo from '@/assets/images/logo.svg';
```

### Classes CSS — Tailwind

**Principe fondamental :** Utiliser exclusivement les classes Tailwind. Pas de CSS custom sauf cas exceptionnel justifie.

```tsx
// CORRECT — Classes Tailwind uniquement
function StatusBadge({ status }: { status: 'success' | 'error' | 'warning' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        status === 'success' && 'bg-success/10 text-success',
        status === 'error' && 'bg-danger/10 text-danger',
        status === 'warning' && 'bg-warning/10 text-warning'
      )}
    >
      {status}
    </span>
  );
}

// INCORRECT — CSS inline ou custom
function BadBadge() {
  return <span style={{ color: 'green', padding: '4px' }}>OK</span>;
}
```

**Regles d'organisation des classes Tailwind :**

1. **Layout** : `flex`, `grid`, `block`, `hidden`
2. **Box Model** : `p-4`, `m-2`, `w-full`, `h-12`, `border`
3. **Typography** : `text-sm`, `font-bold`, `text-warm-black`
4. **Visual** : `bg-warm-white`, `rounded-lg`, `shadow-md`
5. **Interactive** : `hover:bg-accent-gold`, `focus:ring-2`, `disabled:opacity-50`
6. **Responsive** : `md:flex-row`, `lg:grid-cols-3`

---

## 3. Patterns de composants

### Structure d'une page

Chaque page suit un pattern uniforme pour garantir la coherence :

```tsx
// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { ChartSection } from '@/components/dashboard/ChartSection';
import { useAuth } from '@/hooks/useAuth';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import type { DashboardStats } from '@/types';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { canAccess } = useFeatureGate('advanced_analytics');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Chargement des donnees
    async function loadStats() {
      setIsLoading(true);
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="container mx-auto space-y-6 p-6"
    >
      <PageHeader title="Tableau de bord" subtitle={`Bienvenue, ${user?.name}`} />

      <StatsCards data={stats} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Flux de tresorerie</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartSection type="cashflow" />
          </CardContent>
        </Card>

        {canAccess && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics avancees</CardTitle>
            </CardHeader>
            <CardContent>
              <AdvancedAnalytics />
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
```

### Composant partage — pattern avec forwardRef

```tsx
// src/components/shared/AnimatedContainer.tsx
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const directionOffsets = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
};

export const AnimatedContainer = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps
>(({ children, className, delay = 0, direction = 'up' }, ref) => {
  const offset = directionOffsets[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
});

AnimatedContainer.displayName = 'AnimatedContainer';
```

### Personnalisation shadcn/ui via CVA

```tsx
// Exemple de surcharge du composant Button
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-accent-gold text-white hover:bg-accent-gold/90',
        outline: 'border-2 border-warm-gray bg-transparent hover:bg-warm-gray/50',
        ghost: 'hover:bg-warm-cream text-warm-black',
        destructive: 'bg-danger text-white hover:bg-danger/90',
        premium: 'bg-gradient-to-r from-accent-gold to-amber-500 text-white shadow-lg',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### Animations Framer Motion — Patterns courants

**Apparition en cascade (stagger) :**

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**Animation de liste avec AnimatePresence :**

```tsx
import { AnimatePresence, motion } from 'framer-motion';

<AnimatePresence mode="popLayout">
  {filteredTransactions.map((tx) => (
    <motion.div
      key={tx.id}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <TransactionRow data={tx} />
    </motion.div>
  ))}
</AnimatePresence>
```

**Hover et tap interactifs :**

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ boxShadow: '0 0 0 2px #D4A853' }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
  className="bg-accent-gold text-white px-6 py-3 rounded-lg"
>
  Cliquez-moi
</motion.button>
```

### Formulaires avec react-hook-form et Zod

```tsx
// src/components/transactions/TransactionForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const transactionSchema = z.object({
  amount: z.number().positive('Le montant doit etre positif'),
  description: z.string().min(3, 'Minimum 3 caracteres').max(200),
  category: z.string().min(1, 'Selectionnez une categorie'),
  date: z.string().datetime(),
  type: z.enum(['income', 'expense']),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function TransactionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString(),
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    try {
      await createTransaction(data);
      toast.success('Transaction ajoutee avec succes');
      reset();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="amount">Montant</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="text-sm text-danger mt-1">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register('description')} />
        {errors.description && (
          <p className="text-sm text-danger mt-1">{errors.description.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enregistrement...' : 'Ajouter'}
      </Button>
    </form>
  );
}
```

---

## 4. Guide de gestion d'etat

### Choix de la solution de state

| Situation | Solution | Exemple |
|-----------|----------|---------|
| Etat local a un composant | `useState` | Input controle, toggle |
| Etat complexe avec logique | `useReducer` | Formulaire multi-etapes |
| Etat partage par plusieurs composants | `Context` | Theme, auth, langue |
| Donnees serveur | `fetch + state` | Liste transactions (futur: React Query) |
| Persistance locale | `localStorage + state` | Preferences utilisateur |

### Exemple : useState pour etat simple

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);

  return (
    <div className="flex items-center gap-4">
      <button onClick={decrement} className="p-2 rounded bg-warm-gray">-</button>
      <span className="text-xl font-bold">{count}</span>
      <button onClick={increment} className="p-2 rounded bg-warm-gray">+</button>
    </div>
  );
}
```

### Exemple : useReducer pour etat complexe

```tsx
interface TransactionState {
  items: Transaction[];
  filter: string;
  sortBy: 'date' | 'amount' | 'category';
  isLoading: boolean;
  error: string | null;
}

type TransactionAction =
  | { type: 'SET_ITEMS'; payload: Transaction[] }
  | { type: 'SET_FILTER'; payload: string }
  | { type: 'SET_SORT'; payload: 'date' | 'amount' | 'category' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

function transactionReducer(state: TransactionState, action: TransactionAction): TransactionState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, isLoading: false };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

function TransactionManager() {
  const [state, dispatch] = useReducer(transactionReducer, {
    items: [],
    filter: '',
    sortBy: 'date',
    isLoading: false,
    error: null,
  });

  // Utilisation...
}
```

### AuthContext — Authentification

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthState } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurer la session au chargement
  useEffect(() => {
    const stored = localStorage.getItem('fintrack_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('fintrack_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await mockLogin(email, password);
      setUser(userData);
      localStorage.setItem('fintrack_user', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('fintrack_user');
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register: async (data) => {
      // Implementation...
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook utilitaire
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit etre utilise dans un AuthProvider');
  }
  return context;
}
```

### SubscriptionContext — Gestion des abonnements

```tsx
// src/contexts/SubscriptionContext.tsx
import { createContext, useContext, useState, useCallback } from 'react';
import type { Subscription, SubscriptionPlan } from '@/types';

interface SubscriptionContextValue {
  subscription: Subscription | null;
  currentPlan: SubscriptionPlan;
  isSubscribed: boolean;
  isTrial: boolean;
  daysLeft: number;
  upgradePlan: (plan: SubscriptionPlan) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  hasFeature: (feature: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const currentPlan = subscription?.plan ?? 'free';
  const isSubscribed = subscription?.status === 'active';
  const isTrial = subscription?.status === 'trial';
  const daysLeft = subscription ? calculateDaysLeft(subscription.expiresAt) : 0;

  const hasFeature = useCallback(
    (feature: string): boolean => {
      const planFeatures: Record<SubscriptionPlan, string[]> = {
        free: ['basic_dashboard', 'transactions'],
        basic: ['basic_dashboard', 'transactions', 'reports', 'categories'],
        premium: ['basic_dashboard', 'transactions', 'reports', 'categories', 'analytics', 'export'],
        enterprise: ['all_features', 'api_access', 'priority_support'],
      };
      return planFeatures[currentPlan]?.includes(feature) ?? false;
    },
    [currentPlan]
  );

  const upgradePlan = useCallback(async (plan: SubscriptionPlan) => {
    // Redirection vers la page de paiement
  }, []);

  const value: SubscriptionContextValue = {
    subscription,
    currentPlan,
    isSubscribed,
    isTrial,
    daysLeft,
    hasFeature,
    upgradePlan,
    cancelSubscription: async () => {
      // Implementation...
    },
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription(): SubscriptionContextValue {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription doit etre utilise dans un SubscriptionProvider');
  }
  return context;
}
```

### Ajouter un nouveau Context

Pour creer un nouveau contexte, suivez ce template :

```tsx
// src/contexts/NouveauContext.tsx
import { createContext, useContext, useState } from 'react';

interface NouveauContextValue {
  valeur: string;
  setValeur: (v: string) => void;
}

const NouveauContext = createContext<NouveauContextValue | undefined>(undefined);

export function NouveauProvider({ children }: { children: React.ReactNode }) {
  const [valeur, setValeur] = useState('');

  return (
    <NouveauContext.Provider value={{ valeur, setValeur }}>
      {children}
    </NouveauContext.Provider>
  );
}

export function useNouveau(): NouveauContextValue {
  const context = useContext(NouveauContext);
  if (context === undefined) {
    throw new Error('useNouveau doit etre utilise dans un NouveauProvider');
  }
  return context;
}
```

**N'oubliez pas d'envelopper l'application dans `App.tsx` :**

```tsx
// src/App.tsx
<AuthProvider>
  <SubscriptionProvider>
    <ThemeProvider>
      <NouveauProvider>  {/* Ajouter ici */}
        <RouterProvider router={router} />
      </NouveauProvider>
    </ThemeProvider>
  </SubscriptionProvider>
</AuthProvider>
```

### Synchronisation localStorage

```tsx
// src/hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Erreur localStorage [${key}]:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Erreur sauvegarde localStorage [${key}]:`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    window.localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return [storedValue, setStoredValue, removeValue] as const;
}

// Utilisation
const [theme, setTheme, removeTheme] = useLocalStorage<'light' | 'dark'>('fintrack_theme', 'light');
```

---

## 5. Ajout d'une nouvelle page

Suivez ces etapes pour ajouter une nouvelle page dans l'application.

### Etape 1 — Creer le fichier de la page

```bash
# Creer la page
touch src/pages/AnalyticsPage.tsx
```

```tsx
// src/pages/AnalyticsPage.tsx
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { UpgradePrompt } from '@/components/subscription/UpgradePrompt';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function AnalyticsPage() {
  const { canAccess } = useFeatureGate('advanced_analytics');

  if (!canAccess) {
    return (
      <div className="container mx-auto p-6">
        <PageHeader title="Analytics" subtitle="Analyses avancees" />
        <UpgradePrompt feature="advanced_analytics" />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="container mx-auto space-y-6 p-6"
    >
      <PageHeader title="Analytics" subtitle="Analyses avancees de vos finances" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tendances mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyTrendsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <TopCategoriesChart />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
```

### Etape 2 — Ajouter la route dans App.tsx

```tsx
// src/App.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

// Chargement paresseux des pages
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage')); // AJOUT
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'analytics', element: <AnalyticsPage /> }, // AJOUT
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
```

### Etape 3 — Ajouter l'element de navigation

```tsx
// src/components/layout/Sidebar.tsx
import { LineChart } from 'lucide-react'; // AJOUT

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: Receipt },
  { path: '/analytics', label: 'Analytics', icon: LineChart }, // AJOUT
  // ... autres items
];
```

### Etape 4 — Ajouter les donnees mock

```tsx
// src/data/mockAnalytics.ts
import type { MonthlyTrend, TopCategory } from '@/types';

export const mockMonthlyTrends: MonthlyTrend[] = [
  { month: '2025-01', income: 5000, expense: 3200 },
  { month: '2025-02', income: 5200, expense: 3400 },
  { month: '2025-03', income: 4800, expense: 3100 },
  { month: '2025-04', income: 5500, expense: 3600 },
  { month: '2025-05', income: 5300, expense: 3300 },
  { month: '2025-06', income: 5800, expense: 3500 },
];

export const mockTopCategories: TopCategory[] = [
  { category: 'Alimentation', amount: 850, percentage: 26.5 },
  { category: 'Transport', amount: 420, percentage: 13.1 },
  { category: 'Logement', amount: 1200, percentage: 37.5 },
  { category: 'Loisirs', amount: 350, percentage: 10.9 },
  { category: 'Sante', amount: 380, percentage: 11.9 },
];
```

### Etape 5 — Feature gating (si applicable)

```tsx
// src/data/features.ts
export const featureMatrix: Record<string, SubscriptionPlan[]> = {
  basic_dashboard: ['free', 'basic', 'premium', 'enterprise'],
  transactions: ['free', 'basic', 'premium', 'enterprise'],
  advanced_analytics: ['premium', 'enterprise'], // NOUVEAU
  reports: ['basic', 'premium', 'enterprise'],
  // ...
};
```

---

## 6. Guide de feature gating

Le systeme de feature gating permet de restreindre certaines fonctionnalites selon le plan d'abonnement de l'utilisateur.

### Hook useFeatureGate

```tsx
// src/hooks/useFeatureGate.ts
import { useSubscription } from '@/contexts/SubscriptionContext';
import type { SubscriptionPlan } from '@/types';

const featureTiers: Record<string, SubscriptionPlan[]> = {
  basic_dashboard: ['free', 'basic', 'premium', 'enterprise'],
  transactions: ['free', 'basic', 'premium', 'enterprise'],
  reports: ['basic', 'premium', 'enterprise'],
  categories: ['basic', 'premium', 'enterprise'],
  analytics: ['premium', 'enterprise'],
  export: ['premium', 'enterprise'],
  api_access: ['enterprise'],
  priority_support: ['enterprise'],
};

interface FeatureGateResult {
  canAccess: boolean;
  requiredPlan: SubscriptionPlan;
  currentPlan: SubscriptionPlan;
  upgradeRequired: boolean;
}

export function useFeatureGate(feature: string): FeatureGateResult {
  const { currentPlan } = useSubscription();
  const allowedPlans = featureTiers[feature] ?? [];
  const planHierarchy: SubscriptionPlan[] = ['free', 'basic', 'premium', 'enterprise'];

  const canAccess = allowedPlans.includes(currentPlan);
  const requiredPlan = allowedPlans[allowedPlans.length - 1] ?? 'premium';
  const upgradeRequired = !canAccess;

  return { canAccess, requiredPlan, currentPlan, upgradeRequired };
}
```

### Utilisation dans les composants

```tsx
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { UpgradePrompt } from '@/components/subscription/UpgradePrompt';

function ReportsSection() {
  const { canAccess, upgradeRequired, requiredPlan } = useFeatureGate('reports');

  if (upgradeRequired) {
    return (
      <UpgradePrompt
        feature="reports"
        requiredPlan={requiredPlan}
        description="Generez des rapports detailles de vos finances"
      />
    );
  }

  return <AdvancedReports />;
}
```

### Composant UpgradePrompt

```tsx
// src/components/subscription/UpgradePrompt.tsx
import { Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { SubscriptionPlan } from '@/types';

interface UpgradePromptProps {
  feature: string;
  requiredPlan: SubscriptionPlan;
  description: string;
}

export function UpgradePrompt({ feature, requiredPlan, description }: UpgradePromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-dashed border-2 border-accent-gold/30 bg-accent-gold/5">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="rounded-full bg-accent-gold/10 p-4">
            <Lock className="h-8 w-8 text-accent-gold" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-warm-black">
              Fonctionnalite verrouillee
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <Button className="mt-2 gap-2 bg-accent-gold hover:bg-accent-gold/90">
            Passer au plan {requiredPlan}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

### Tester differents plans

Pour tester le comportement avec differents plans, modifiez la valeur dans `localStorage` :

```tsx
// Console navigateur — changer de plan instantanement
localStorage.setItem('fintrack_subscription', JSON.stringify({
  plan: 'premium',
  status: 'active',
  expiresAt: '2025-12-31T23:59:59Z',
}));
window.location.reload();
```

---

## 7. Ajout d'un moyen de paiement

### Etape 1 — Etendre le type PaymentMethod

```tsx
// src/types/payment.ts
export type PaymentMethod =
  | 'card'
  | 'stripe'
  | 'crypto_usdt'
  | 'crypto_btc'
  | 'mtn_momo'
  | 'orange_money'
  | 'paypal'; // AJOUT

export interface PaymentConfig {
  method: PaymentMethod;
  label: string;
  icon: string;
  currencies: string[];
  feePercentage: number;
  minAmount: number;
  maxAmount: number;
  isActive: boolean;
}
```

### Etape 2 — Ajouter la configuration

```tsx
// src/data/paymentMethods.ts
import type { PaymentConfig } from '@/types';

export const paymentMethods: PaymentConfig[] = [
  {
    method: 'stripe',
    label: 'Carte bancaire',
    icon: 'CreditCard',
    currencies: ['EUR', 'USD', 'GBP'],
    feePercentage: 1.5,
    minAmount: 1,
    maxAmount: 10000,
    isActive: true,
  },
  {
    method: 'crypto_usdt',
    label: 'USDT (TRC-20)',
    icon: 'Bitcoin',
    currencies: ['USDT'],
    feePercentage: 0.5,
    minAmount: 10,
    maxAmount: 50000,
    isActive: true,
  },
  {
    method: 'paypal', // AJOUT
    label: 'PayPal',
    icon: 'Wallet',
    currencies: ['EUR', 'USD', 'GBP'],
    feePercentage: 2.9,
    minAmount: 1,
    maxAmount: 10000,
    isActive: true,
  },
];
```

### Etape 3 — Ajouter l'UI dans la page Checkout

```tsx
// src/pages/CheckoutPage.tsx
import { Wallet } from 'lucide-react'; // AJOUT

const methodIcons: Record<string, React.ComponentType> = {
  CreditCard,
  Bitcoin,
  Smartphone,
  Wallet, // AJOUT pour PayPal
};

// Dans le rendu des methodes de paiement
{paymentMethods.filter((m) => m.isActive).map((method) => {
  const Icon = methodIcons[method.icon] ?? CreditCard;
  return (
    <PaymentMethodCard
      key={method.method}
      method={method}
      icon={<Icon className="h-6 w-6" />}
      selected={selectedMethod === method.method}
      onSelect={() => setSelectedMethod(method.method)}
    />
  );
})}
```

### Etape 4 — Ajouter l'implementation mock

```tsx
// src/lib/payment-utils.ts
async function processPayPalPayment(amount: number, currency: string): Promise<PaymentResult> {
  // Simulation d'un appel API PayPal
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const success = Math.random() > 0.1; // 90% de succes

  if (!success) {
    throw new PaymentError('Le paiement PayPal a ete refuse');
  }

  return {
    transactionId: `PAYPAL_${Date.now()}`,
    status: 'completed',
    amount,
    currency,
    method: 'paypal',
    timestamp: new Date().toISOString(),
  };
}

// Router de paiement
export async function processPayment(
  method: PaymentMethod,
  amount: number,
  currency: string
): Promise<PaymentResult> {
  switch (method) {
    case 'stripe':
      return processStripePayment(amount, currency);
    case 'crypto_usdt':
      return processCryptoPayment(amount, currency, 'USDT');
    case 'mtn_momo':
      return processMobileMoneyPayment(amount, currency, 'mtn');
    case 'orange_money':
      return processMobileMoneyPayment(amount, currency, 'orange');
    case 'paypal': // AJOUT
      return processPayPalPayment(amount, currency);
    default:
      throw new PaymentError(`Methode de paiement non supportee: ${method}`);
  }
}
```

---

## 8. Guide de developpement i18n

### Architecture i18n

Le projet supporte plus de 80 langues via un systeme base sur `react-i18next`.

### Ajouter une nouvelle langue

**Etape 1 — Creer le fichier de traduction :**

```bash
# Copier depuis une langue existante
cp public/locales/en.json public/locales/sw.json
```

**Etape 2 — Traduire le contenu :**

```json
// public/locales/sw.json
{
  "app": {
    "name": "FinTrack",
    "tagline": "Mkufunzi wako wa kifedha"
  },
  "nav": {
    "dashboard": "Dashibodi",
    "transactions": "Shughuli",
    "reports": "Ripoti",
    "settings": "Mipangilio"
  },
  "auth": {
    "login": "Ingia",
    "register": "Jiandikishe",
    "logout": "Toka",
    "email": "Barua pepe",
    "password": "Nenosiri"
  }
}
```

**Etape 3 — Enregistrer la langue :**

```tsx
// src/i18n/config.ts
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'fr', name: 'Francais', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Espanol', flag: '🇪🇸', dir: 'ltr' },
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿', dir: 'ltr' }, // AJOUT
  // ...
] as const;

export type LanguageCode = typeof supportedLanguages[number]['code'];
```

### Formatage des devises

```tsx
// src/lib/formatting.ts
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// Exemples
formatCurrency(1234.56, 'USD', 'en-US');  // "$1,234.56"
formatCurrency(1234.56, 'EUR', 'fr-FR');  // "1 234,56 €"
formatCurrency(1234.56, 'XOF', 'fr-FR');  // "1 234,56 FCFA"
formatCurrency(1234.56, 'NGN', 'en-NG');  // "₦1,234.56"
```

### Considerations RTL (Right-to-Left)

Pour les langues arabes et hebreu :

```tsx
// src/components/layout/MainLayout.tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MainLayout() {
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage.dir === 'rtl';

  return (
    <div
      className={cn('min-h-screen', isRTL && 'rtl')}
      dir={currentLanguage.dir}
    >
      {/* Le contenu s'adapte automatiquement avec Tailwind RTL */}
    </div>
  );
}
```

Configuration Tailwind pour RTL :

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('tailwindcss-rtl'), // npm install tailwindcss-rtl
  ],
};
```

Utilisation des utilitaires RTL :

```html
<!-- ml-4 devient mr-4 automatiquement en RTL -->
<div class="ml-4 rtl:mr-4 rtl:ml-0">Contenu</div>

<!-- ou avec le plugin rtl -->
<div class="ms-4">Margin start (adapte selon la direction)</div>
```

### Workflow de traduction

```bash
# 1. Extraire les cles de traduction
npx i18next-scanner --config i18next-scanner.config.js

# 2. Les nouvelles cles sont ajoutees dans les fichiers JSON

# 3. Traduire les nouvelles cles dans chaque langue

# 4. Verifier l'integrite
npm run lint:i18n
```

---

## 9. Strategie de tests

### Checklist de tests manuels par page

| Page | Tests a effectuer |
|------|-------------------|
| **Landing** | Chargement, animations, CTA, responsive, liens |
| **Dashboard** | Chargement des stats, graphiques, filtres date, responsive |
| **Transactions** | CRUD, filtres, tri, pagination, import CSV, export |
| **Reports** | Selection de periode, graphiques, export PDF |
| **Settings** | Modification profil, changement theme, changement langue |
| **Subscription** | Comparaison plans, feature gating, paiement test |
| **Checkout** | Selection methode paiement, validation formulaire, confirmation |
| **Auth** | Connexion, inscription, deconnexion, messages erreur |

### Matrice de tests navigateurs

| Navigateur | Version minimale | Tests prioritaires |
|-----------|-----------------|-------------------|
| Chrome | 120+ | Moteur de reference — tous les tests |
| Firefox | 120+ | Layout, animations, formulaires |
| Safari | 17+ (macOS), iOS 17+ | Fonts, flexbox, date inputs |
| Edge | 120+ | Compatibilite entreprise |

### Tests de responsive

| Breakpoint | Largeur | Appareils cibles |
|-----------|---------|-----------------|
| `sm` | 640px+ | Grands telephones |
| `md` | 768px+ | Tablettes portrait |
| `lg` | 1024px+ | Tablettes paysage, petits laptops |
| `xl` | 1280px+ | Desktops standards |
| `2xl` | 1536px+ | Grands ecrans |

Commandes Chrome DevTools utiles :

```javascript
// Simuler un appareil mobile
// Ouvrir DevTools > Toggle Device Toolbar (Ctrl+Shift+M)

// Verifier le CLS (Cumulative Layout Shift)
// Performance tab > Record > mesurer le CLS

// Auditer les performances
// Lighthouse tab > Generate report
```

### Accessibilite (a11y)

**Regles obligatoires :**

1. **Contraste** : Ratio minimum 4.5:1 pour le texte normal, 3:1 pour le texte large
2. **Navigation clavier** : Tous les elements interactifs doivent etre accessibles via Tab
3. **Attribut ARIA** : Utiliser les roles et labels appropriés
4. **Focus visible** : Toujours avoir un indicateur de focus visible

```tsx
// CORRECT — Accessibilite
<button
  aria-label="Fermer la boite de dialogue"
  onClick={onClose}
  className="focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:outline-none"
>
  <XIcon aria-hidden="true" />
</button>

// Formulaire accessible
<form onSubmit={handleSubmit}>
  <label htmlFor="email" className="block text-sm font-medium">
    Adresse email
  </label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-describedby="email-error"
    className="mt-1 block w-full"
  />
  {error && (
    <p id="email-error" className="text-sm text-danger" role="alert">
      {error}
    </p>
  )}
</form>
```

**Outils de verification :**

```bash
# axe DevTools — Extension Chrome/Firefox
# WAVE — https://wave.webaim.org/
# Lighthouse > Accessibility > Score > 90
```

---

## 10. Directives de contribution

### Workflow Git

**Nommage des branches :**

```
feature/ajout-analytics-page
feature/gate-reports-premium
fix/correction-export-csv
fix/responsive-mobile-dashboard
chore/mise-a-jour-dependencies
docs/guide-developpeur
refactor/simplification-hooks
```

**Messages de commit (Conventional Commits) :**

```
feat: ajout de la page Analytics avec graphiques
feat: verrouillage des rapports pour les plans Premium+
fix: correction du bug d'export CSV sur Safari
fix: responsive du dashboard sur mobile
chore: mise a jour de React 19.0 vers 19.2
docs: ajout du guide du developpeur
refactor: simplification du hook useFeatureGate
style: formatage avec Prettier
test: ajout des tests manuels pour le checkout
```

### Template de Pull Request

```markdown
## Description
[Breve description de la modification]

## Type de changement
- [ ] Nouvelle fonctionnalite
- [ ] Correction de bug
- [ ] Refactoring
- [ ] Documentation
- [ ] Chore/Maintenance

## Tests effectues
- [ ] Tests manuels sur Chrome
- [ ] Tests manuels sur Firefox
- [ ] Tests responsive (mobile + desktop)
- [ ] npm run build reussi
- [ ] npm run lint sans erreur
- [ ] Verification TypeScript (tsc -b)

## Checklist
- [ ] Le code suit les conventions du projet
- [ ] Les types TypeScript sont complets
- [ ] Les composants sont documentes
- [ ] Pas de console.log oublies
- [ ] Les features gates sont appliques si necessaire

## Captures d'ecran (si applicable)
[Ajouter des captures d'ecran]
```

### Checklist de code review

**Relecture obligatoire avant fusion :**

- [ ] Le code compile sans erreur (`tsc -b`)
- [ ] ESLint ne remonte aucune erreur (`npm run lint`)
- [ ] Le build de production fonctionne (`npm run build`)
- [ ] Les types TypeScript sont corrects et complets
- [ ] Les hooks suivent les regles de React (tableaux de dependances)
- [ ] Les composants sont memoises si necessaire (`React.memo`, `useMemo`, `useCallback`)
- [ ] Les imports suivent l'ordre defini (React → tierces → @/ → relatifs)
- [ ] Le feature gating est applique pour les fonctionnalites payantes
- [ ] Les animations sont conditionnees a `prefers-reduced-motion`
- [ ] L'accessibilite est verifiee (labels, focus, contrastes)

### Exemple de contribution complete

```bash
# 1. Synchroniser la branche principale
git checkout main
git pull origin main

# 2. Creer une branche de fonctionnalite
git checkout -b feature/ajout-page-budget

# 3. Developper la fonctionnalite
# ... coder ...

# 4. Verifier avant commit
npm run lint
npm run build

# 5. Commiter avec conventional commits
git add .
git commit -m "feat: ajout de la page Budget avec graphiques circulaires

- Ajout de la route /budget
- Composants BudgetChart et CategoryBreakdown
- Integration du feature gate pour plan Basic+
- Donnees mock pour la demonstration"

# 6. Pousser et creer une PR
git push origin feature/ajout-page-budget
# Creer la Pull Request sur GitHub

# 7. Apres approbation, fusionner
git checkout main
git merge feature/ajout-page-budget
git push origin main
```

---

*Document version 1.0 — FinTrack SaaS*
*Derniere mise a jour : Juin 2025*
