# Document Technique 03 — Architecture Systeme

## Projet FinTrack SaaS

**Version:** 1.0.0
**Date:** 2025-06-10
**Auteur:** Architecte Logiciel Senior
**Statut:** Specification Technique Finale

---

## Table des Matieres

1. [Vue d'Ensemble du Systeme](#1-vue-densemble-du-systeme)
2. [Patterns Architecturaux](#2-patterns-architecturaux)
3. [Architecture des Composants](#3-architecture-des-composants)
4. [Architecture de la Gestion d'Etat](#4-architecture-de-la-gestion-detat)
5. [Architecture du Routage](#5-architecture-du-routage)
6. [Architecture du Design System](#6-architecture-du-design-system)
7. [Architecture du Feature Gating](#7-architecture-du-feature-gating)
8. [Architecture des Paiements](#8-architecture-des-paiements)
9. [Architecture i18n](#9-architecture-i18n)
10. [Architecture de Securite](#10-architecture-de-securite)

---

## 1. Vue d'Ensemble du Systeme

### 1.1 Description de l'Architecture de Haut Niveau

FinTrack SaaS est une application web monopage (SPA — Single Page Application) construite avec React 19 et TypeScript. L'architecture suit un modele client-only dans lequel toute la logique metier, la persistance des donnees et la gestion d'etat s'executent dans le navigateur. Le backend est simule par des modules de donnees mock et le stockage local (`localStorage`) assure la persistance entre les sessions.

L'application adopte une architecture modulaire basee sur les fonctionnalites (feature-based) avec une separation claire entre les pages publiques (marketing) et les pages protegees de l'application. Deux systemes de design coexistent pour offrir une experience distincte aux visiteurs anonymes et aux utilisateurs authentifies.

### 1.2 Diagramme des Composants (Vue de Haut Niveau)

```
+========================================================================+
|                          NAVIGATEUR WEB                                 |
|  +==================================================================+  |
|  |                        REACT 19 SPA                               |  |
|  |                                                                   |  |
|  |  +------------------+  +------------------+  +------------------+ |  |
|  |  |   PAGES PUBLIQUES |  |  PAGES SECURISEES |  |   FOURNISSEURS   |  |
|  |  |                  |  |                  |  |                  |  |
|  |  |  Landing.tsx     |  |  Dashboard.tsx   |  |  AuthContext     |  |
|  |  |  Auth.tsx        |  |  Transactions.tsx|  |  SubscriptionCtx |  |
|  |  |  Pricing.tsx     |  |  Budgets.tsx     |  |                  |  |
|  |  |                  |  |  Dettes.tsx      |  |  +------------+  |  |
|  |  |  PublicNavbar    |  |  Objectifs.tsx   |  |  | localStorage|  |  |
|  |  |  LandingFooter   |  |  Analytics.tsx   |  |  | Persistance |  |
|  |  |                  |  |  Settings.tsx    |  |  +------------+  |  |
|  |  |  Design: Navy/   |  |  ... 12 pages    |  |                  |  |
|  |  |        Amber     |  |                  |  |                  |  |
|  |  +------------------+  +------------------+  +------------------+ |  |
|  |                              |                                    |  |
|  |  +---------------------------+----------------------------------+ |  |
|  |  |                   COMPOSANTS PARTAGES                        | |  |
|  |  |  Layout.tsx  |  Navbar.tsx  |  Footer.tsx  |  Guards        | |  |
|  |  +-------------------------------------------------------------+ |  |
|  |                              |                                    |  |
|  |  +---------------------------+----------------------------------+ |  |
|  |  |                   BIBLIOTHEQUE UI (shadcn/ui)                | |  |
|  |  |  50+ composants: Button, Dialog, Table, Chart, Card, ...     | |  |
|  |  +-------------------------------------------------------------+ |  |
|  |                                                                   |  |
|  |  +------------------+  +------------------+  +------------------+ |  |
|  |  |   STYLING        |  |   ANIMATIONS     |  |   GRAPHIQUES     | |  |
|  |  |  Tailwind CSS v3 |  |  Framer Motion   |  |  Recharts        | |  |
|  |  |  CSS Variables   |  |  useCountUp      |  |  Custom tooltips | |  |
|  |  |  Dual theme      |  |  Transitions     |  |  Responsive      | |  |
|  |  +------------------+  +------------------+  +------------------+ |  |
|  |                                                                   |  |
|  +==================================================================+  |
|                                                                         |
|  +------------------+  +------------------+  +------------------+       |
|  |  DONNEES MOCK    |  |  MODULES UTILS   |  |  CROCHETS (HOOKS)|       |
|  |  mockData.ts     |  |  formatters.ts   |  |  useFeatureGate  |       |
|  |  saasData.ts     |  |  saasData.ts     |  |  useCountUp      |       |
|  |  (transactions,  |  |  (intl, date,    |  |  use-mobile      |       |
|  |   budgets, etc.) |  |   currency)      |  |                  |       |
|  +------------------+  +------------------+  +------------------+       |
|                                                                         |
+========================================================================+
```

### 1.3 Stack Technique Complet

| Couche | Technologie | Version | Role |
|--------|-------------|---------|------|
| Framework UI | React | 19.x | Rendu composants, hooks, Context API |
| Langage | TypeScript | 5.x | Typage statique, interfaces, enums |
| Bundler | Vite | 6.x | Build, HMR, optimisation |
| Styling | Tailwind CSS | 3.x | Utilitaires CSS, responsive design |
| Composants UI | shadcn/ui | latest | Bibliotheque de 50+ composants accessibles |
| Animations | Framer Motion | 11.x | Transitions, animations de page |
| Graphiques | Recharts | 2.x | Graphiques financiers interactifs |
| Routage | React Router | 7.x | HashRouter, navigation declaratif |
| Persistance | localStorage | API native | Stockage cote client |

### 1.4 Architecture en Couches

```
+-------------------------------------------+
|           COUCHE PRESENTATION              |
|  Pages (15) | Composants Layout | UI Lib   |
+-------------------------------------------+
|           COUCHE LOGIQUE METIER            |
|  Contexts (Auth/Sub) | Hooks | Guards      |
+-------------------------------------------+
|           COUCHE DONNEES                   |
|  Mock Data | Formatters | Feature Gates    |
+-------------------------------------------+
|           COUCHE PERSISTANCE               |
|  localStorage | Session Storage            |
+-------------------------------------------+
```

---

## 2. Patterns Architecturaux

### 2.1 Architecture Basee sur les Composants (React)

L'application suit le pattern de composition de React ou chaque page est un assemblage de composants reutilisables. La hierarchie respecte le principe de responsabilite unique (SRP) : chaque composant a un role bien defini.

**Principes fondamentaux :**
- **Composition over inheritance** : Les composants sont assembles par props et children
- **Unidirectional data flow** : Les donnees descendent via les props, remontent via les callbacks
- **Props drilling minimal** : Les Contexts eliminent le passage explicite de props a travers plusieurs niveaux

```
Pattern de composition :

<Layout>                              // Coquille de l'application
  <Navbar />                          // Navigation laterale
  <main>
    <PageHeader />                    // Titre + actions
    <ContentGrid>                     // Grille responsive
      <StatCard />                    // Carte statistique
      <StatCard />
      <ChartCard>                     // Carte avec graphique
        <RechartsLineChart />
      </ChartCard>
    </ContentGrid>
  </main>
  <Footer />
</Layout>
```

### 2.2 Pattern Context API pour la Gestion d'Etat

FinTrack utilise le pattern Context API de React pour partager l'etat global entre les composants sans props drilling. Deux contexts principaux sont definis :

- **AuthContext** : Etat d'authentification de l'utilisateur
- **SubscriptionContext** : Etat de l'abonnement et des paiements

Chaque context suit le pattern Provider/Consumer avec un hook personnalise pour faciliter l'acces.

```typescript
// Pattern Context standardise
const MonContext = createContext<State | null>(null);
const MonDispatchContext = createContext<Dispatch | null>(null);

function MonProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <MonContext.Provider value={state}>
      <MonDispatchContext.Provider value={dispatch}>
        {children}
      </MonDispatchContext.Provider>
    </MonContext.Provider>
  );
}

// Hook consommateur
function useMonContext() {
  const context = useContext(MonContext);
  if (!context) throw new Error("Provider manquant");
  return context;
}
```

### 2.3 Pattern useReducer pour la Logique d'Etat Complexe

Les contexts avec etat complexe utilisent `useReducer` au lieu de `useState` pour centraliser la logique de transitions. Chaque reducer est une machine a etats finie avec des actions typees.

**Avantages de useReducer dans FinTrack :**
- **Predictabilite** : Les transitions d'etat sont explicites et typees
- **Testabilite** : Les reducers sont des fonctions pures, facilement testables
- **Traçabilite** : Chaque action est loggee avec son type et son payload
- **Centralisation** : La logique metier est concentree, pas dispersee dans les composants

```
Pattern useReducer :

Action ----> Dispatch ----> Reducer ----> Nouvel Etat
               |                |
               v                v
          { type, payload }  switch(action.type)
                               case 'LOGIN':
                                 return { ...state, user }
                               case 'LOGOUT':
                                 return initialState
```

### 2.4 Pattern de Composition pour les Composants UI

Les composants shadcn/ui suivent le pattern de composition avec separation des responsabilites :

- **Root** : Conteneur avec context interne (ex: `Dialog`)
- **Trigger** : Element declencheur (ex: `DialogTrigger`)
- **Content** : Contenu affiche (ex: `DialogContent`)
- **Primitives** : Composants de base reutilisables

Ce pattern permet une flexibilite maximale dans l'assemblage des interfaces sans modifier le code source des composants.

### 2.5 Organisation du Code par Fonctionnalites

Le codebase est organise par domaine fonctionnel plutot que par type de fichier :

```
src/
  types/           → Definitions de types centralisees
  data/            → Donnees mock et formatters
  contexts/        → Etat global (Auth, Subscription)
  hooks/           → Logique reutilisable
  components/      → Composants partages et UI
  pages/           → Composants page (routables)
```

Cette organisation facilite :
- La localisation du code (tout ce qui concerne une fonctionnalite est proche)
- Le decouplage (les modules peuvent etre extraits independamment)
- La scalabilite (ajout de nouvelles fonctionnalites sans reorganisation)

---

## 3. Architecture des Composants

### 3.1 Architecture des Pages (15 Pages)

Chaque page est un composant React fonctionnel exporte par defaut, potentiellement enveloppe par un Guard ou un Layout.

| # | Page | Route | Guard | Design System | Responsabilite Principale |
|---|------|-------|-------|---------------|---------------------------|
| 1 | `Landing.tsx` | `/` | PublicOnlyGuard | Navy/Amber | Page marketing, conversion visiteurs |
| 2 | `Auth.tsx` | `/auth` | PublicOnlyGuard | Navy/Amber | Authentification (login/register) |
| 3 | `Pricing.tsx` | `/pricing` | — | Navy/Amber | Comparaison des plans d'abonnement |
| 4 | `Checkout.tsx` | `/checkout/:planId` | AuthGuard | Warm/Gold | Processus de paiement |
| 5 | `Onboarding.tsx` | `/onboarding` | AuthGuard | Warm/Gold | Assistant post-inscription |
| 6 | `Dashboard.tsx` | `/dashboard` | AuthGuard | Warm/Gold | Vue d'ensemble financiere |
| 7 | `Transactions.tsx` | `/transactions` | AuthGuard | Warm/Gold | CRUD des transactions |
| 8 | `Budgets.tsx` | `/budgets` | AuthGuard | Warm/Gold | Gestion des budgets |
| 9 | `Dettes.tsx` | `/dettes` | AuthGuard | Warm/Gold | Suivi des dettes |
| 10 | `Objectifs.tsx` | `/objectifs` | AuthGuard | Warm/Gold | Objectifs d'epargne |
| 11 | `Analytics.tsx` | `/analytics` | AuthGuard | Warm/Gold | Analyses financieres avancees |
| 12 | `SubscriptionPage.tsx` | `/subscription` | AuthGuard | Warm/Gold | Gestion de l'abonnement |
| 13 | `Billing.tsx` | `/billing` | AuthGuard | Warm/Gold | Historique des factures |
| 14 | `Settings.tsx` | `/settings` | AuthGuard | Warm/Gold | Preferences utilisateur |
| 15 | `Parametres.tsx` | `/parametres` | AuthGuard | Warm/Gold | Redirection vers Settings |

### 3.2 Composants Partages

#### Layout.tsx — Coquille de l'Application

```
+-------------------------------------------------------------+
|  Layout (App Shell)                                         |
|  +----------------------+----------------------------------+ |
|  |  Navbar (Sidebar)    |  <main> Contenu principal        | |
|  |  - Logo              |  - PageHeader                    | |
|  |  - Navigation        |  - Contenu de la page            | |
|  |  - Section SaaS      |  </main>                         | |
|  |  - Deconnexion       |  <Footer />                      | |
|  +----------------------+----------------------------------+ |
+-------------------------------------------------------------+
```

Le composant `Layout` enveloppe toutes les pages securisees. Il fournit :
- Une barre de navigation laterale responsive (collapsible sur mobile)
- La zone de contenu principale avec scroll independant
- Le pied de page
- Les variables CSS du theme Warm/Gold activees

#### Navbar.tsx — Navigation Laterale

- **Logo** : Lien vers le tableau de bord
- **Navigation principale** : Liens vers Dashboard, Transactions, Budgets, Dettes, Objectifs, Analytics
- **Section SaaS** : Liens vers Subscription, Billing
- **Parametres** : Lien vers Settings
- **Deconnexion** : Bouton de deconnexion avec confirmation
- **Indicateur de plan** : Badge montrant le tier actuel (Free/Pro/Premium)

#### Footer.tsx — Pied de Page Application

- Copyright et annee
- Liens rapides
- Version de l'application

#### PublicNavbar.tsx — Barre de Navigation Landing

- Design transparent qui evolue au scroll
- Liens vers les sections de la landing page
- Boutons Login / Get Started
- Design system Navy/Amber

#### LandingFooter.tsx — Pied de Page Landing

- Multi-colonnes avec liens de navigation
- Informations de contact
- Reseaux sociaux
- Design system Navy/Amber

#### AuthGuard.tsx — Garde d'Authentification

- Verifie la presence d'un token utilisateur dans AuthContext
- Redirige vers `/auth` si non authentifie
- Affiche un etat de chargement pendant la verification
- Pattern : Render prop / Wrapper component

#### PublicOnlyGuard.tsx — Garde de Routes Publiques

- Verifie l'absence d'authentification
- Redirige vers `/dashboard` si deja authentifie
- Empeche les utilisateurs connectes d'acceder a Login/Register

### 3.3 Bibliotheque de Composants UI (shadcn/ui)

Plus de 50 composants accessibles basees sur Radix UI primitives :

**Composants de Layout :** `Card`, `Sheet`, `Tabs`, `Accordion`, `Collapsible`, `Separator`, `ScrollArea`

**Composants de Formulaire :** `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `Label`, `Form`

**Composants de Feedback :** `Alert`, `AlertDialog`, `Dialog`, `Toast` (sonner), `Progress`, `Skeleton`

**Composants de Donnees :** `Table`, `DataTable`, `Badge`, `Avatar`, `Calendar`, `Chart`

**Composants de Navigation :** `DropdownMenu`, `NavigationMenu`, `Command`, `Breadcrumb`, `Pagination`

**Composants de Surcouche :** `Popover`, `Tooltip`, `HoverCard`, `Drawer`, `Modal`

Chaque composant suit la structure :
```
components/ui/button.tsx    → Logique + styles Tailwind
components/ui/button.css    → Variables CSS specifiques (optionnel)
```

### 3.4 Hierarchie des Composants (Arbre ASCII)

```
<HashRouter>
  └── <App>
       ├── <Providers>  (AuthProvider + SubscriptionProvider)
       │    │
       │    ├── Route "/"            → <PublicOnlyGuard>
       │    │                         └── <Landing>
       │    │                              ├── <PublicNavbar />
       │    │                              ├── <HeroSection />
       │    │                              ├── <FeaturesSection />
       │    │                              ├── <PricingPreview />
       │    │                              └── <LandingFooter />
       │    │
       │    ├── Route "/auth"        → <PublicOnlyGuard>
       │    │                         └── <Auth>
       │    │                              ├── <AuthForm /> (login/register)
       │    │                              └── <OAuthButtons />
       │    │
       │    ├── Route "/pricing"     → <Pricing>
       │    │                         ├── <PublicNavbar />
       │    │                         ├── <PlanComparison />
       │    │                         └── <LandingFooter />
       │    │
       │    └── Route "/*"           → <AuthGuard>
       │                              └── <Layout>
       │                                   ├── <Navbar />
       │                                   │    ├── <NavSection label="Principal">
       │                                   │    │    ├── <NavLink to="/dashboard" />
       │                                   │    │    ├── <NavLink to="/transactions" />
       │                                   │    │    ├── <NavLink to="/budgets" />
       │                                   │    │    ├── <NavLink to="/dettes" />
       │                                   │    │    ├── <NavLink to="/objectifs" />
       │                                   │    │    └── <NavLink to="/analytics" />
       │                                   │    ├── <NavSection label="Abonnement">
       │                                   │    │    ├── <NavLink to="/subscription" />
       │                                   │    │    └── <NavLink to="/billing" />
       │                                   │    └── <NavSection label="Compte">
       │                                   │         ├── <NavLink to="/settings" />
       │                                   │         └── <LogoutButton />
       │                                   │
       │                                   ├── <main>
       │                                   │    ├── Route "/dashboard"     → <Dashboard />
       │                                   │    │                            ├── <KpiCards />
       │                                   │    │                            ├── <RechartsCharts />
       │                                   │    │                            └── <RecentActivity />
       │                                   │    ├── Route "/transactions"  → <Transactions />
       │                                   │    ├── Route "/budgets"       → <Budgets />
       │                                   │    ├── Route "/dettes"        → <Dettes />
       │                                   │    ├── Route "/objectifs"     → <Objectifs />
       │                                   │    ├── Route "/analytics"     → <Analytics />
       │                                   │    ├── Route "/checkout/:planId" → <Checkout />
       │                                   │    ├── Route "/onboarding"    → <Onboarding />
       │                                   │    ├── Route "/subscription"  → <SubscriptionPage />
       │                                   │    ├── Route "/billing"       → <Billing />
       │                                   │    ├── Route "/settings"      → <Settings />
       │                                   │    └── Route "/parametres"    → <Parametres /> (redirect)
       │                                   │
       │                                   └── <Footer />
       │
       └── <Toaster /> (notifications globales)
```

---

## 4. Architecture de la Gestion d'Etat

### 4.1 Vue d'Ensemble des Flux d'Etat

FinTrack utilise une architecture de gestion d'etat hybride avec trois niveaux :

1. **Etat local** (`useState`) : Etat ephemere des composants (formulaires, UI state)
2. **Etat global par domaine** (`useReducer + Context`) : Auth, Subscription
3. **Etat persiste** (`localStorage`) : Donnees utilisateur, transactions, preferences

```
FLUX DE DONNEES GLOBAL :

+------------------+        +------------------+        +------------------+
|   localStorage   |<------>|    Contexts      |<------>|    Composants    |
|                  |        |                  |        |                  |
|  user_token      |        |  AuthContext     |        |  Pages           |
|  subscription    |<------>|  (useReducer)    |<------>|  Composants UI   |
|  transactions[]  |        |                  |        |  Hooks           |
|  budgets[]       |<------>|  SubscriptionCtx |        |                  |
|  settings        |        |  (useReducer)    |        |                  |
|  ...             |        |                  |        |                  |
+------------------+        +------------------+        +------------------+
         ^                                                       |
         |                                                       |
         +------------------ Actions utilisateur -----------------+
```

### 4.2 AuthContext — Machine a Etats

L'AuthContext implemente une machine a etats avec trois etats principaux et cinq actions.

#### Diagramme d'Etats AuthContext

```
                    +-------------------+
                    |      ANONONYME    |
                    |  (user: null)     |
                    +---------+---------+
                              |
              LOGIN action    |   LOGIN action
              (credentials)   |   (OAuth)
                              v
                    +---------+---------+
                    |   AUTHENTIFIE     |
      +------------>|  (user: AppUser)  |<-------------+
      |             +---------+---------+              |
      |                       |                        |
      |                       | UPDATE action          |
      |                       | (profile changes)      |
      |                       v                        |
      |             +---------+---------+              |
      |             |  AUTHENTIFIE      |              |
      |             |  (user updated)   |              |
      |             +---------+---------+              |
      |                       |                        |
      |                       |                        |
      |                       |                        |
      |    +------------------+------------------+     |
      |    |                                     |     |
      |    | LOGOUT action                       |     |
      |    |                                     |     |
      |    v                                     |     |
      +----+  (redirection vers /auth)            +-----+
```

#### Actions AuthContext

| Action | Type | Payload | Description |
|--------|------|---------|-------------|
| `LOGIN` | `{ type: 'LOGIN'; payload: AppUser }` | Utilisateur complet | Authentifie l'utilisateur, stocke le token |
| `LOGOUT` | `{ type: 'LOGOUT' }` | — | Deconnecte l'utilisateur, nettoie le stockage |
| `UPDATE` | `{ type: 'UPDATE'; payload: Partial<AppUser> }` | Champs a mettre a jour | Met a jour le profil utilisateur |

#### Sequence d'Authentification

```
Utilisateur                     AuthContext                    localStorage
    |                               |                               |
    |-- saisie credentials -------->|                               |
    |                               |-- validation ---------------->|
    |                               |<-- token genere --------------|
    |                               |                               |
    |                               |-- dispatch LOGIN ------------>|
    |                               |   { user: AppUser }           |
    |                               |                               |
    |<-- auth reussie --------------|                               |
    |                               |-- setItem('fintrack_user') -->|
    |                               |   (serialise JSON)            |
    |                               |                               |
    |-- navigation dashboard ------>|-- AuthGuard: OK ------------->|
    |                               |                               |
```

### 4.3 SubscriptionContext — Transitions d'Etat

Le SubscriptionContext gere le cycle de vie complet d'un abonnement SaaS.

#### Diagramme de Transitions SubscriptionContext

```
                     +---------------------+
                     |      INACTIF        |
                     |  (plan: null)       |
                     +----------+----------+
                                |
                    UPGRADE      | UPGRADE
                    (Free→Pro)   | (Free→Premium)
                    (Pro→Prem.)  |
                                v
                     +----------+----------+
      +------------->|      ACTIF          |<-------------+
      |              |  (plan: PlanTier)   |              |
      |              |  status: 'active'   |              |
      |              +----------+----------+              |
      |                         |                          |
      |    +--------------------+--------------------+     |
      |    |                                         |     |
      |    | CANCEL action                           |     |
      |    | (cancelAtPeriodEnd: true)               |     |
      |    v                                         |     |
      |    +--------------------+                    |     |
      |    |   ANNULATION       |                    |     |
      |    |   PLANIFIEE        |  UPGRADE (change)  |     |
      |    |   (statut: active  |  plan / reactiver  |     |
      |    |    mais pending    |                    |     |
      |    |    cancel)        |                    |     |
      |    +--------+---------+                    |     |
      |             |                                |     |
      |             | Periode se termine             |     |
      |             v                                |     |
      |    +--------+---------+                     |     |
      |    |    EXPIRE        |  REACTIVATE action  |     |
      |    | (statut:         |---------------------+     |
      |    |  cancelled)      |                          |
      +----+                  |                          |
           +------------------+                          |
           |                                             |
           | UPGRADE depuis expire                       |
           +---------------------------------------------+
```

#### Actions SubscriptionContext

| Action | Type | Payload | Description |
|--------|------|---------|-------------|
| `UPGRADE` | `{ type: 'UPGRADE'; payload: { planId, interval } }` | Nouveau plan | Change le plan d'abonnement |
| `CANCEL` | `{ type: 'CANCEL' }` | — | Programme l'annulation en fin de periode |
| `REACTIVATE` | `{ type: 'REACTIVATE' }` | — | Annule la programmation d'annulation |
| `ADD_PAYMENT` | `{ type: 'ADD_PAYMENT'; payload: PaymentMethodInfo }` | Methode de paiement | Ajoute une methode de paiement |

### 4.4 Communication Inter-Contexts

Les deux contexts communiquent indirectement via le localStorage et les effets de bord React :

```
+-------------------------------------------------------------------+
|                     COMMUNICATION INTER-CONTEXTS                   |
+-------------------------------------------------------------------+
|                                                                    |
|   AuthContext                                    SubscriptionCtx   |
|   +---------+                                    +---------+       |
|   | user    |                                    | planId  |       |
|   | token   |                                    | status  |       |
|   +----+----+                                    +----+----+       |
|        |                                              |             |
|        | Effect: on LOGIN                             | Effect: on UPGRADE |
|        | → initialise Subscription                    | → update AuthContext.user.subscription |
|        |   depuis localStorage                       |   via dispatch UPDATE                   |
|        |                                              |             |
|        v                                              v             |
|   +----+----+-----------------------------------+----+----+       |
|   |         localStorage (fintrack_* keys)      |         |       |
|   |  fintrack_user = { ..., subscription: {...} }         |       |
|   |  fintrack_subscription = { planId, status, ... }      |       |
|   +-------------------------------------------------------+       |
|                                                                    |
+-------------------------------------------------------------------+
```

### 4.5 Strategie de Persistance localStorage

Toutes les donnees sont serialisees en JSON et stockees dans `localStorage` avec le prefixe `fintrack_`.

| Cle localStorage | Type | Description | Synchronisation |
|------------------|------|-------------|-----------------|
| `fintrack_user` | `AppUser` | Profil utilisateur + token | AuthContext |
| `fintrack_subscription` | `Subscription` | Etat d'abonnement | SubscriptionContext |
| `fintrack_transactions` | `Transaction[]` | Liste des transactions | Transactions page |
| `fintrack_budgets` | `Budget[]` | Budgets mensuels | Budgets page |
| `fintrack_goals` | `SavingsGoal[]` | Objectifs d'epargne | Objectifs page |
| `fintrack_debts` | `Debt[]` | Dettes et paiements | Dettes page |
| `fintrack_settings` | `Partial<AppUser>` | Preferences | Settings page |

**Strategie de chargement :**
```
Initialisation de l'application :
1. main.tsx monte les Providers
2. AuthProvider lit fintrack_user dans localStorage
3. Si token valide → etat AUTHENTIFIE
4. SubscriptionProvider lit fintrack_subscription
5. Si abonnement present → etat ACTIF avec le plan
6. Les pages lisent leurs donnees specifiques dans useEffect
```

**Strategie de sauvegarde :**
```
Modification des donnees :
1. Action utilisateur (ex: ajout transaction)
2. Mise a jour de l'etat local (useState)
3. Persistance dans localStorage (JSON.stringify)
4. Notification UI (toast de confirmation)
```

---

## 5. Architecture du Routage

### 5.1 Structure des Routes

L'application utilise `HashRouter` pour la compatibilite avec les serveurs statiques. Le routage est configure dans `App.tsx` avec une structure imbriquee.

```typescript
// Structure du routage
<HashRouter>
  <Routes>
    {/* Routes publiques */}
    <Route element={<PublicOnlyGuard />}>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
    </Route>
    
    <Route path="/pricing" element={<Pricing />} />
    
    {/* Routes protegees */}
    <Route element={<AuthGuard />}>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/dettes" element={<Dettes />} />
        <Route path="/objectifs" element={<Objectifs />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/checkout/:planId" element={<Checkout />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/parametres" element={<Parametres />} />
      </Route>
    </Route>
  </Routes>
</HashRouter>
```

### 5.2 Routes Publiques vs Protegees

```
+--------------------------------------------------------------------+
|                    ARCHITECTURE DE ROUTAGE                          |
+--------------------------------------------------------------------+
|                                                                     |
|   URL arrivante                                                     |
|        |                                                            |
|        v                                                            |
|   +----+----+                                                       |
|   |  Parse  |                                                       |
|   |  Route  |                                                       |
|   +----+----+                                                       |
|        |                                                            |
|        v                                                            |
|   +----+----+-----------+-----------+-----------+                   |
|   | Route    | /, /auth | /pricing | /* protege |                   |
|   +----------+----------+----------+------------+                   |
|        |              |           |                                 |
|        v              v           v                                 |
|   PublicOnlyGuard    -      AuthGuard                               |
|        |                      |                                     |
|        v                      v                                     |
|   [Auth?] --> redirect    [Auth?] --> redirect                      |
|        |                      |                                     |
|        v                      v                                     |
|   Page publique           Layout + Page                             |
|   (Navy/Amber theme)      (Warm/Gold theme)                         |
|                                                                     |
+--------------------------------------------------------------------+
```

### 5.3 Diagramme de Flux de Routage

```
Utilisateur saisit URL
       |
       v
+------+------+
| HashRouter  |
| decode le   |
| hash path   |
+------+------+
       |
       v
+------+------+     Oui      +------------------+
| Route dans  |------------->| Guard approprie    |
| la table ?  |              | (Auth/PublicOnly)  |
+------+------+              +--------+---------+
  | Non                                 |
  v                                     | Verification
+------+------+                         | auth state
| Route 404   |                         v
| (fallback)  |              +----------+----------+
+-------------+              | Autorise ?          |
                             +----------+----------+
                                | Oui         | Non
                                v             v
                        +-------+---+   +-----+-------+
                        | Render    |   | Redirect    |
                        | Page      |   | (/auth ou   |
                        |           |   |  /dashboard)|
                        +-----------+   +-------------+
```

### 5.4 Integration des Guards

Les composants Guard utilisent le pattern `Outlet` de React Router pour rendre conditionnellement les routes enfants :

```typescript
// AuthGuard.tsx — Pattern de protection
function AuthGuard() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/auth" replace />;
  
  return <Outlet />;  // Rend les routes enfants
}

// PublicOnlyGuard.tsx — Pattern inverse
function PublicOnlyGuard() {
  const { user } = useAuth();
  
  if (user) return <Navigate to="/dashboard" replace />;
  
  return <Outlet />;
}
```

---

## 6. Architecture du Design System

### 6.1 Dual Design System

FinTrack implemente deux systemes de design complets et independants pour servir deux audiences distinctes.

```
+========================================================================+
|                    DUAL DESIGN SYSTEM ARCHITECTURE                     |
+========================================================================+
|                                                                         |
|   +-------------------------+    +-------------------------+           |
|   |   PUBLIC THEME          |    |   APP THEME             |           |
|   |   (Navy / Amber)        |    |   (Warm-Cream / Gold)   |           |
|   |                         |    |                         |           |
|   |   Landing page          |    |   Application pages     |           |
|   |   Auth page             |    |   Dashboard             |           |
|   |   Pricing page          |    |   Transactions          |           |
|   |                         |    |   All protected routes  |           |
|   +-------------------------+    +-------------------------+           |
|                                                                         |
|   Selection du theme par le composant racine :                          |
|   - Public pages : racine avec classe .theme-public                    |
|   - App pages : racine avec classe .theme-app                          |
|                                                                         |
+========================================================================+
```

### 6.2 Variables CSS du Design System

Les variables CSS sont definies dans `index.css` et scopeces par classe thematique.

#### Theme Public (Navy / Amber)

```css
.theme-public {
  /* Couleurs primaires — Navy profond */
  --primary: 222 47% 18%;           /* #18233A */
  --primary-foreground: 48 100% 53%; /* Amber dore */
  
  /* Couleurs de fond */
  --background: 0 0% 100%;
  --foreground: 222 47% 18%;
  --muted: 220 20% 96%;
  --muted-foreground: 220 10% 45%;
  
  /* Accent — Amber dore */
  --accent: 48 100% 53%;
  --accent-foreground: 222 47% 18%;
  
  /* Bordures */
  --border: 220 13% 88%;
  --ring: 48 100% 53%;
  
  /* Cartes */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 18%;
  
  /* Degrades */
  --gradient-hero: linear-gradient(135deg, #18233A 0%, #243B61 100%);
  --gradient-accent: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}
```

#### Theme Application (Warm-Cream / Gold)

```css
.theme-app {
  /* Couleurs primaires — Creme chaude */
  --primary: 36 33% 97%;            /* #FBF9F6 */
  --primary-foreground: 35 25% 25%; /* Brun doux */
  
  /* Couleurs de fond */
  --background: 35 30% 96%;         /* #FBF9F6 */
  --foreground: 35 25% 25%;
  --muted: 35 20% 92%;
  --muted-foreground: 35 10% 45%;
  
  /* Accent — Gold */
  --accent: 43 74% 49%;             /* #D4A43D */
  --accent-foreground: 35 25% 25%;
  
  /* Bordures */
  --border: 35 20% 85%;
  --ring: 43 74% 49%;
  
  /* Cartes */
  --card: 0 0% 100%;
  --card-foreground: 35 25% 25%;
  
  /* Degrades */
  --gradient-warm: linear-gradient(135deg, #FBF9F6 0%, #F5F0E8 100%);
  --gradient-gold: linear-gradient(135deg, #D4A43D 0%, #B8831A 100%);
}
```

### 6.3 Configuration Tailwind

Le fichier `tailwind.config.ts` etend le theme par defaut avec les variables CSS du design system.

```typescript
// Configuration simplifiee
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### 6.4 Theming des Composants

Chaque composant shadcn/ui utilise les variables CSS, permettant le theming automatique :

```tsx
// Exemple : Button avec theming automatique
<Button variant="default">   // Utilise --primary / --primary-foreground
<Button variant="secondary"> // Utilise --secondary / --secondary-foreground
<Button variant="accent">    // Utilise --accent / --accent-foreground
<Button variant="outline">   // Bordure + fond transparent
<Button variant="ghost">     // Transparent, hover colore
```

Le switch de theme est effectue en appliquant la classe CSS racine appropriee (`theme-public` ou `theme-app`) sur le conteneur principal.

---

## 7. Architecture du Feature Gating

### 7.1 Fonctionnement de useFeatureGate

Le hook `useFeatureGate` est le mecanisme central de controle d'acces aux fonctionnalites. Il verifie si l'utilisateur actuel a le droit d'acceder a une fonctionnalite donnee en fonction de son plan d'abonnement.

```
ARCHITECTURE DU FEATURE GATING :

+-------------------------------------------------------------------+
|                                                                    |
|   Composant/Page                                                    |
|        |                                                           |
|        v                                                           |
|   useFeatureGate(featureName)                                      |
|        |                                                           |
|        v                                                           |
|   +----+----+                                                      |
|   |  Lookup   |  →  Feature dans la matrice ?                     |
|   |  Matrix   |     Si non → { allowed: true } (feature libre)    |
|   +----+----+     Si oui → Verifier le plan                       |
|        |                                                           |
|        v                                                           |
|   +----+----+                                                      |
|   |  Plan     |  →  Recuperer le tier actuel                      |
|   |  Tier     |     (Free / Pro / Premium)                        |
|   +----+----+                                                      |
|        |                                                           |
|        v                                                           |
|   +----+----+                                                      |
|   |  Compare  |  →  Le plan requis <= plan actuel ?               |
|   |  Limit    |                                                    |
|   +----+----+                                                      |
|        |                                                           |
|   +----+----+-----------+-----------+                              |
|   | Oui                   | Non       |                             |
|   v                       v                                         |
| { allowed: true }    { allowed: false,                             |
|                       requiredPlan: 'pro',                         |
|                       upgradeUrl: '/pricing' }                     |
|                                                                    |
+-------------------------------------------------------------------+
```

### 7.2 Implementation du Hook

```typescript
// Signature du hook
function useFeatureGate(feature: string): FeatureGateResult;

// Type de retour
interface FeatureGateResult {
  allowed: boolean;           // Acces autorise ?
  requiredPlan?: PlanTier;    // Plan requis si refuse
  currentPlan: PlanTier;      // Plan actuel
  limit?: number;             // Limite numerique si applicable
  usage?: number;             // Utilisation actuelle
}
```

### 7.3 Matrice des Fonctionnalites

```
+=======================================================================+
|                       FEATURE GATE MATRIX                              |
+=======================================================================+
| Fonctionnalite              | Free | Pro | Premium | Type    | Limite |
+=======================================================================+
| Tableau de bord             |  ✓   |  ✓  |   ✓    | Boolean |   —    |
| Transactions (ajout)        |  ✓   |  ✓  |   ✓    | Boolean |   —    |
| Transactions (historique)   |  30j |  1a |   ∞    | Limit   |  —     |
| Categories personnalisees   |  5   |  15 |   ∞    | Limit   |  —     |
| Budgets                     |  2   |  10 |   ∞    | Limit   |  —     |
| Alertes budget              |  ✓   |  ✓  |   ✓    | Boolean |   —    |
| Dettes (suivi)              |  3   |  10 |   ∞    | Limit   |  —     |
| Objectifs d'epargne         |  1   |  5  |   ∞    | Limit   |   —    |
| Graphiques basiques         |  ✓   |  ✓  |   ✓    | Boolean |   —    |
| Graphiques avances          |  ✗   |  ✓  |   ✓    | Boolean |   —    |
| Export CSV                  |  ✗   |  ✓  |   ✓    | Boolean |   —    |
| Export PDF                  |  ✗   |  ✗  |   ✓    | Boolean |   —    |
| Rapports mensuels           |  ✗   |  ✓  |   ✓    | Boolean |   —    |
| Rapports personnalises      |  ✗   |  ✗  |   ✓    | Boolean |   —    |
| Projection financiere       |  ✗   |  ✗  |   ✓    | Boolean |   —    |
| Multi-devises               |  ✗   |  ✓  |   ✓    | Boolean |   —    |
| Synchronisation cloud       |  ✗   |  ✗  |   ✓    | Boolean |   —    |
| API access                  |  ✗   |  ✗  |   ✓    | Boolean |   —    |
| Support email               |  ✗   |  ✓  |   ✓    | Boolean |   —    |
| Support prioritaire         |  ✗   |  ✗  |   ✓    | Boolean |   —    |
| Comptes multiples           |  1   |  3  |   ∞    | Limit   |   —    |
| Alertes personnalisees      |  ✗   |  ✓  |   ✓    | Boolean |   —    |
| Historique complet          |  ✗   |  ✗  |   ✓    | Boolean |   —    |
| Themes personnalises        |  ✗   |  ✗  |   ✓    | Boolean |   —    |
| Backup automatique          |  ✗   |  ✗  |   ✓    | Boolean |   —    |
+=======================================================================+
```

### 7.4 Systeme d'Upgrade Prompt

Lorsqu'une fonctionnalite est refusee, le systeme affiche un composant d'upgrade :

```
+------------------------------------------+
|   Feature Blocked Overlay                |
|                                          |
|   [Icone cadenas]                        |
|   Fonctionnalite Premium                 |
|                                          |
|   Passez a Premium pour debloquer        |
|   les projections financieres.           |
|                                          |
|   [  Voir les plans  ] [  Fermer  ]      |
|        (navigue vers                    |
|         /checkout/premium)               |
+------------------------------------------+
```

---

## 8. Architecture des Paiements

### 8.1 Trois Flux de Paiement

FinTrack supporte trois methodes de paiement avec des flux distincts.

```
+===================================================================+
|                    ARCHITECTURE DES PAIEMENTS                      |
+===================================================================+
|                                                                     |
|  +------------------+  +------------------+  +------------------+  |
|  |   PAIEMENT       |  |   PAIEMENT       |  |   PAIEMENT       |  |
|  |   CARTE (Stripe) |  |   CRYPTO         |  |   MOBILE MONEY   |  |
|  |                  |  |                  |  |                  |  |
|  |  1. Saisie       |  |  1. Selection    |  |  1. Selection    |  |
|  |     carte        |  |     crypto       |  |     operateur    |  |
|  |  2. Validation   |  |  2. Generation   |  |  2. Saisie       |  |
|  |     client       |  |     QR/adresse   |  |     telephone    |  |
|  |  3. Token Stripe |  |  3. Scan/        |  |  3. Validation   |  |
|  |  4. Appel API    |  |     copie        |  |     PUSH USSD    |  |
|  |  5. Webhook      |  |  4. Monitoring   |  |  4. Callback     |  |
|  |     confirmation |  |     blockchain   |  |     operateur    |  |
|  |  6. Maj abonnement|  |  5. Confirmation|  |  5. Maj          |  |
|  |                  |  |  6. Maj abonn.   |  |     abonnement   |  |
|  +------------------+  +------------------+  +------------------+  |
|                                                                     |
+===================================================================+
```

### 8.2 Machine a Etats du Paiement

```
                    +-------------------+
                    |     INITIAL       |
                    | (formulaire vierge)|
                    +---------+---------+
                              |
                    Submit    |
                              v
                    +---------+---------+
                    |    VALIDATING     |
                    | (verification     |
                    |  des champs)      |
                    +---------+---------+
                              |
                    Valide    |
                              v
                    +---------+---------+
       +----------->|    PROCESSING     |<-------------+
       |            | (appel API paiement)|              |
       |            +---------+---------+              |
       |                      |                        |
       |    +-----------------+------------------+     |
       |    |                 |                  |     |
       |    v                 v                  v     |
       |  Succes           Echec            Timeout    |
       |    |                 |                  |     |
       |    v                 v                  +-----+
       | +--+---+       +----+----+                  |
       | |SUCCESS|       |  FAILED |                  |
       | |       |       | (retry) |                  |
       | +---+---+       +----+----+                  |
       |     |                |                       |
       |     | Reactiver      | Retry                 |
       |     +----------------+                       |
       |                                              |
       |     +----------------------------------------+ 
       |     |
       |     v
       | +---+----------+
       | | SUBSCRIPTION |
       | |   ACTIVED    |
       | +--------------+
       |
       +-----> Met a jour SubscriptionContext
               dispatch UPGRADE
               Sauvegarde localStorage
               Redirection /dashboard
```

### 8.3 Implementation Mock vs Production

| Aspect | Implementation Mock (Actuelle) | Production (Futur) |
|--------|--------------------------------|---------------------|
| Gateway | Simulation delai + succes | Integration Stripe/Crypto API reelle |
| Validation | Validation client-side uniquement | Validation client + serveur |
| Securite | Aucune (donnees en clair) | Tokenization, chiffrement HTTPS |
| Webhooks | Simulation setTimeout | Endpoints securises serveur |
| Stockage | localStorage | Base de donnees PostgreSQL |
| Conformite | N/A | PCI-DSS, RGPD |

---

## 9. Architecture i18n

### 9.1 Mecanisme de Changement de Langue

L'application supporte le multilinguisme via un systeme base sur React Context avec detection automatique de la langue du navigateur.

```
ARCHITECTURE i18n :

+-------------------------------------------------------------------+
|                                                                    |
|  Navigateur                                                        |
|     |                                                              |
|     v                                                              |
|  +--+-----------+                                                 |
|  | Detect       |  navigator.language → 'fr-FR', 'en-US', etc.   |
|  | Language     |                                                 |
|  +--+-----------+                                                 |
|     |                                                              |
|     v                                                              |
|  +--+-----------+        +------------------+                     |
|  | I18nProvider |<------>|  Dictionnaires   |                     |
|  |              |        |  fr.ts, en.ts    |                     |
|  |  useI18n()   |        |  (cles → values) |                     |
|  +--+-----------+        +------------------+                     |
|     |                                                              |
|     v                                                              |
|  Composants utilisent t('cle') → chaine traduite                   |
|                                                                    |
|  Chaine de fallback : langue selectionnee → 'fr' (defaut)          |
|                                                                    |
+-------------------------------------------------------------------+
```

### 9.2 Formatage des Devises par Locale

Le formatage monetaire utilise `Intl.NumberFormat` avec la locale et la devise de l'utilisateur.

```typescript
// Exemple de formatage
function formatCurrency(amount: number, currency: Currency, locale: Language): string {
  const localeMap = { fr: 'fr-FR', en: 'en-US', es: 'es-ES' };
  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency: currency,  // 'EUR', 'USD', 'XOF', etc.
  }).format(amount);
}

// Resultats :
// formatCurrency(1500.50, 'EUR', 'fr') → "1 500,50 €"
// formatCurrency(1500.50, 'USD', 'en') → "$1,500.50"
// formatCurrency(1500.50, 'XOF', 'fr') → "1 500,50 FCFA"
```

### 9.3 Adaptation des Formats Date/Nombre

| Locale | Format Date | Format Nombre | Separateur decimal |
|--------|-------------|---------------|-------------------|
| `fr` | DD/MM/YYYY | 1 234,56 | Virgule |
| `en` | MM/DD/YYYY | 1,234.56 | Point |
| `es` | DD/MM/YYYY | 1.234,56 | Virgule |

### 9.4 Structure des Dictionnaires

```typescript
// types/saas.ts — Types i18n
interface I18nDictionary {
  // Navigation
  nav: { dashboard: string; transactions: string; ... };
  // Pages
  pages: { dashboard: { title: string; subtitle: string; ... }; ... };
  // Composants
  components: { button: { save: string; cancel: string; ... }; ... };
  // Messages
  messages: { success: { saved: string; deleted: string; ... }; ... };
}

type Language = 'fr' | 'en' | 'es';
type Currency = 'EUR' | 'USD' | 'GBP' | 'XOF' | 'CAD';
```

---

## 10. Architecture de Securite

### 10.1 Flux d'Authentification

```
+===================================================================+
|                    FLUX D'AUTHENTIFICATION                         |
+===================================================================+
|                                                                     |
|  INSCRIPTION (Register)                                             |
|  -----------+                                                       |
|             |                                                       |
|             v                                                       |
|  +----------+-----------+                                          |
|  | 1. Formulaire        |  Nom, email, mot de passe                |
|  |    d'inscription     |                                          |
|  +----------+-----------+                                          |
|             |                                                       |
|             v                                                       |
|  +----------+-----------+                                          |
|  | 2. Validation        |  Email valide, password > 8 chars        |
|  |    client-side       |  Password strength meter                 |
|  +----------+-----------+                                          |
|             |                                                       |
|             v                                                       |
|  +----------+-----------+                                          |
|  | 3. Generation token  |  JWT simule (uid + timestamp)            |
|  |    mock              |                                          |
|  +----------+-----------+                                          |
|             |                                                       |
|             v                                                       |
|  +----------+-----------+                                          |
|  | 4. Stockage          |  localStorage: fintrack_user             |
|  |    localStorage      |  + token, profil, preferences            |
|  +----------+-----------+                                          |
|             |                                                       |
|             v                                                       |
|  +----------+-----------+                                          |
|  | 5. Redirection       |  /onboarding (premiere visite)           |
|  |                      |  /dashboard (visites suivantes)          |
|  +----------------------+                                          |
|                                                                     |
+===================================================================+
|                                                                     |
|  CONNEXION (Login)                                                  |
|  ----------+                                                        |
|            |                                                        |
|            v                                                        |
|  +---------+------------+                                          |
|  | 1. Formulaire login  |  Email + mot de passe                    |
|  +---------+------------+                                          |
|            |                                                        |
|            v                                                        |
|  +---------+------------+                                          |
|  | 2. Verification      |  Recherche dans les comptes mock         |
|  |    credentials       |  (email → user match)                    |
|  +---------+------------+                                          |
|            |                                                        |
|            v                                                        |
|  +---------+------------+                                          |
|  | 3. Token restore     |  Recuperation du token existant          |
|  |                      |  Generation si necessaire                |
|  +---------+------------+                                          |
|            |                                                        |
|            v                                                        |
|  +---------+------------+                                          |
|  | 4. AuthContext       |  dispatch LOGIN                          |
|  |    update            |  { user: AppUser }                       |
|  +---------+------------+                                          |
|            |                                                        |
|            v                                                        |
|  +---------+------------+                                          |
|  | 5. Redirection       |  /dashboard                              |
|  +----------------------+                                          |
|                                                                     |
+===================================================================+
```

### 10.2 OAuth (Simule)

```
+-------------------------------------------------------------------+
|   AUTHENTIFICATION OAUTH (Mock)                                    |
+-------------------------------------------------------------------+
|                                                                    |
|   [Bouton Google]  [Bouton GitHub]                                |
|        |                |                                          |
|        +----------------+                                          |
|                     |                                              |
|                     v                                              |
|            +--------+--------+                                     |
|            | Popup simulee   |                                     |
|            | (delai 1.5s)    |                                     |
|            +--------+--------+                                     |
|                     |                                              |
|                     v                                              |
|            +--------+--------+                                     |
|            | Profil genere   |  Nom: "User [random]"               |
|            | automatiquement |  Email: "user@example.com"          |
|            +--------+--------+                                     |
|                     |                                              |
|                     v                                              |
|            dispatch LOGIN with generated profile                   |
|                                                                    |
+-------------------------------------------------------------------+
```

### 10.3 Protection des Routes

```
+===================================================================+
|                    PROTECTION DES ROUTES                           |
+===================================================================+
|                                                                     |
|   Niveau 1 : Guard React (Composant)                                |
|   ----------------------------------                                |
|   AuthGuard : Verifie user !== null                                 |
|   PublicOnlyGuard : Verifie user === null                           |
|                                                                     |
|   Niveau 2 : Feature Gate (Hook)                                    |
|   ------------------------------                                    |
|   useFeatureGate : Verifie le plan requis                           |
|   Bloque l'acces aux features premium pour les comptes free         |
|                                                                     |
|   Niveau 3 : Context Check (Inline)                                 |
|   ---------------------------------                                 |
|   Verification conditionnelle dans le composant                     |
|   Ex: if (!user) return <LoginPrompt />                             |
|                                                                     |
+===================================================================+
```

### 10.4 Validation des Donnees

| Couche | Methode | Exemple |
|--------|---------|---------|
| Client (formulaire) | HTML5 validation + Regex | `type="email"`, `pattern` |
| Client (logique) | Validation TypeScript | Verification des types, guards |
| Stockage | Schema JSON | Structure typee des donnees localStorage |

### 10.5 Considerations XSS et CSRF

**Etat actuel (client-only) :**
- Aucun risque CSRF (pas de requetes cross-origin vers un backend)
- Risque XSS minimal (pas de donnees utilisateur rendues comme HTML)
- Toutes les donnees sont stockees localement

**Mesures de protection implementees :**
- Le contenu textuel est echappe via React (auto-escaping JSX)
- Les entrees utilisateur sont nettoyees avant stockage
- Aucun usage de `dangerouslySetInnerHTML`
- Les tokens sont stockes avec le prefixe `fintrack_` pour eviter les collisions

**Recommandations pour production :**
- Implementer Content Security Policy (CSP) headers
- Ajouter une validation serveur pour toutes les entrees
- Utiliser des cookies `HttpOnly` / `Secure` pour les tokens
- Implementer une protection rate-limiting

---

## Annexes

### A. Glossaire des Termes

| Terme | Definition |
|-------|------------|
| **SPA** | Single Page Application — Application web qui charge une seule page HTML |
| **Context API** | API React pour partager des donnees entre composants sans props drilling |
| **useReducer** | Hook React pour gerer l'etat complexe via un reducer fonctionnel |
| **Feature Gate** | Mecanisme de controle d'acces base sur le plan d'abonnement |
| **HashRouter** | Type de routage utilisant le fragment d'URL (/#/route) |
| **shadcn/ui** | Bibliotheque de composants UI basee sur Radix UI et Tailwind |
| **HMR** | Hot Module Replacement — Rechargement a chaud des modules en dev |
| **Mock** | Simulation de donnees/services pour le developpement |

### B. Fichiers Cles de l'Architecture

| Fichier | Role dans l'Architecture |
|---------|--------------------------|
| `src/main.tsx` | Point d'entree, montage des Providers |
| `src/App.tsx` | Configuration du routage, structure de l'app |
| `src/contexts/AuthContext.tsx` | Etat global d'authentification |
| `src/contexts/SubscriptionContext.tsx` | Etat global de l'abonnement |
| `src/hooks/useFeatureGate.ts` | Controle d'acces aux fonctionnalites |
| `src/types/saas.ts` | Contrats de types TypeScript |
| `src/data/saasData.ts` | Donnees de reference (plans, formatters) |
| `src/data/mockData.ts` | Donnees de demonstration |
| `src/index.css` | Variables CSS des deux design systems |

---

*Fin du Document 03 — Architecture Systeme*
