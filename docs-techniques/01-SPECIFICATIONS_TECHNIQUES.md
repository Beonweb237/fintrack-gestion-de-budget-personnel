# FinTrack — Specifications Techniques

## Version 1.0.0 | Juin 2025

---

## Table des matieres

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Exigences fonctionnelles](#2-exigences-fonctionnelles)
3. [Exigences non-fonctionnelles](#3-exigences-non-fonctionnelles)
4. [Stack technique](#4-stack-technique)
5. [Compatibilite navigateurs](#5-compatibilite-navigateurs)
6. [Design responsive](#6-design-responsive)
7. [Exigences de securite](#7-exigences-de-securite)
8. [Internationalisation](#8-internationalisation)
9. [Exigences de deploiement](#9-exigences-de-deploiement)
10. [Contraintes et hypotheses](#10-contraintes-et-hypotheses)

---

## 1. Vue d'ensemble du projet

### 1.1 Vision produit

FinTrack est une plateforme SaaS de gestion budgetaire personnelle concue pour transformer la maniere dont les utilisateurs percoivent et gerent leurs finances quotidiennes. Partant d'une simple application de suivi de depenses, FinTrack a evolue vers un produit commercial complet integrant la gestion d'abonnements, le traitement des paiements multicanaux et le support international. La vision est de democratiser l'acces a des outils financiers professionnels grace a une interface intuitive, des visualisations de donnees puissantes et une tarification adaptee a tous les profils.

### 1.2 Objectifs strategiques

| Objectif | Description | Indicateur de succes |
|----------|-------------|---------------------|
| Acquisition | Attirer 10 000 utilisateurs dans les 6 premiers mois | Taux d'inscription > 15% depuis la landing |
| Conversion | Convertir 20% des utilisateurs gratuits vers un plan payant | Taux de conversion mensuel |
| Retention | Maintenir un taux de retention a 30 jours > 60% | Sessions recurrentes par utilisateur |
| Expansion | Couvrir 3 langues et 3 devises dans la phase initiale | Nombre de marches actifs |
| Monetisation | Generer du revenu recurrent via 3 niveaux d'abonnement | MRR (Monthly Recurring Revenue) |

### 1.3 Public cible

| Segment | Profil | Besoins principaux |
|---------|--------|-------------------|
| Utilisateurs gratuits | Etudiants, jeunes actifs decouvrant la gestion budgetaire | Suivi basique des depenses, categories limitées |
| Pro (9.99 USD/mois) | Professionnels actifs avec des objectifs d'epargne | Budgets illimites, analytics avances, objectifs d'epargne |
| Premium (19.99 USD/mois) | Families, independants, gestion patrimoniale | Gestion des dettes, multi-devises, rapports PDF, support prioritaire |

### 1.4 Proposition de valeur

FinTrack se distingue par les atouts suivants :

- **Simplicite d'adoption** : Onboarding guide en 3 etapes, interface francaise et anglaise
- **Transparence tarifaire** : Freemium genereux sans carte de credit requise
- **Paiements flexibles** : Support de Stripe (cartes), cryptomonnaies (BTC/ETH) et Mobile Money (MTN/Orange)
- **Securite de bout en bout** : Authentification OAuth + mot de passe, donnees chiffrees, conformite PCI DSS pour les paiements
- **Analytics avances** : Visualisations Recharts interactives avec projections et tendances

### 1.5 Architecture applicative

FinTrack est une Single Page Application (SPA) frontend construite avec React 19. L'architecture suit un modele client-side rendering (CSR) avec persistance des donnees dans le localStorage du navigateur. L'application est structuree autour de trois zones distinctes :

| Zone | Description | Exemples de pages |
|------|-------------|-------------------|
| **Publique** | Accessible sans authentification | Landing, Authentification, Tarification |
| **Application protegee** | Requiert une session authentifiee | Dashboard, Transactions, Budgets, Analytics |
| **Gestion de compte** | Operations liees a l'abonnement | Checkout, Abonnement, Facturation, Parametres |

```
┌─────────────────────────────────────────────────────────────┐
│                    FinTrack SPA Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │    Auth      │  │   Pricing    │      │
│  │      /       │  │    /auth     │  │   /pricing   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                                                   │
│         ▼                                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              AuthGuard / PublicOnlyGuard               │  │
│  └───────────────────────────────────────────────────────┘  │
│         │                                                   │
│    ┌────┴────┬────────┬────────┬────────┬────────┐         │
│    ▼         ▼        ▼        ▼        ▼        ▼         │
│  Dashboard  ...    Budgets   Dettes  Objectifs  ...        │
│    │                                                      │
│    └────► SubscriptionContext + useFeatureGate ◄──────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Contexts: Auth + Subscription              │  │
│  │              Hooks: useFeatureGate, useAuth             │  │
│  │              Persistence: localStorage                  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Exigences fonctionnelles

### 2.1 Pages publiques

#### 2.1.1 Landing Page (`/`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-LP-01 | En tant que visiteur, je veux voir une presentation claire du produit pour comprendre sa valeur en moins de 10 secondes | Critique |
| US-LP-02 | En tant que visiteur, je veux voir les 3 niveaux tarifaires compares pour choisir le plan adapte | Critique |
| US-LP-03 | En tant que visiteur, je veux pouvoir m'inscrire ou me connecter depuis la landing page | Haute |
| US-LP-04 | En tant que visiteur, je veux voir des temoignages ou statistiques de confiance | Moyenne |
| US-LP-05 | En tant que visiteur, je veux pouvoir changer de langue (EN/FR/ES) depuis la navigation | Haute |

#### 2.1.2 Authentification (`/auth`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-AU-01 | En tant qu'utilisateur, je veux creer un compte avec email et mot de passe securise | Critique |
| US-AU-02 | En tant qu'utilisateur, je veux me connecter via Google, Apple ou Microsoft OAuth | Haute |
| US-AU-03 | En tant qu'utilisateur, je veux voir des messages d'erreur clairs en cas d'echec d'authentification | Haute |
| US-AU-04 | En tant qu'utilisateur connecte, je veux etre redirige vers le dashboard apres connexion | Critique |
| US-AU-05 | En tant qu'utilisateur deja connecte, je ne dois pas pouvoir acceder a la page d'auth (redirection vers /) | Haute |

#### 2.1.3 Page de tarification (`/pricing`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-PR-01 | En tant que visiteur, je veux comparer les fonctionnalites incluses dans chaque plan | Critique |
| US-PR-02 | En tant que visiteur, je veux pouvoir basculer entre paiement mensuel et annuel | Haute |
| US-PR-03 | En tant qu'utilisateur authentifie, je veux pouvoir selectionner un plan et acceder au checkout | Critique |
| US-PR-04 | En tant qu'utilisateur, je veux voir le plan actuellement actif si je suis abonne | Haute |

### 2.2 Pages de l'application protegee

#### 2.2.1 Dashboard (`/dashboard`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-DB-01 | En tant qu'utilisateur, je veux voir un resume de mon solde total et mes flux recents | Critique |
| US-DB-02 | En tant qu'utilisateur, je veux voir un graphique de repartition des depenses par categorie | Haute |
| US-DB-03 | En tant qu'utilisateur Pro/Premium, je veux voir des tendances comparees mois par mois | Haute |
| US-DB-04 | En tant qu'utilisateur, je veux voir mes transactions recentes avec pagination | Haute |
| US-DB-05 | En tant qu'utilisateur Premium, je veux voir des projections et previsions financieres | Moyenne |

#### 2.2.2 Transactions (`/transactions`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-TR-01 | En tant qu'utilisateur, je veux ajouter une transaction avec montant, date, categorie et description | Critique |
| US-TR-02 | En tant qu'utilisateur, je veux modifier ou supprimer une transaction existante | Critique |
| US-TR-03 | En tant qu'utilisateur, je veux filtrer les transactions par date, categorie ou montant | Haute |
| US-TR-04 | En tant qu'utilisateur, je veux trier les transactions par date ou montant | Haute |
| US-TR-05 | En tant qu'utilisateur Pro/Premium, je veux pouvoir importer des transactions en batch | Moyenne |
| US-TR-06 | En tant qu'utilisateur, je veux voir le nombre maximal de transactions selon mon plan | Haute |

#### 2.2.3 Budgets (`/budgets`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-BG-01 | En tant qu'utilisateur, je veux creer un budget mensuel par categorie | Critique |
| US-BG-02 | En tant qu'utilisateur, je veux voir l'etat d'avancement de chaque budget (barre de progression) | Haute |
| US-BG-03 | En tant qu'utilisateur, je veux recevoir une alerte visuelle quand je depasse 80% d'un budget | Haute |
| US-BG-04 | En tant qu'utilisateur Pro/Premium, je veux creer un nombre illimite de budgets | Haute |
| US-BG-05 | En tant qu'utilisateur Premium, je veux voir des recommandations d'optimisation budgetaire | Moyenne |

#### 2.2.4 Dettes (`/dettes`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-DT-01 | En tant qu'utilisateur Premium, je veux enregistrer une dette avec creancier, montant, taux d'interet et echeance | Critique |
| US-DT-02 | En tant qu'utilisateur Premium, je veux enregistrer des remboursements partiels sur une dette | Haute |
| US-DT-03 | En tant qu'utilisateur Premium, je veux voir le solde restant et les interets cumules | Haute |
| US-DT-04 | En tant qu'utilisateur Premium, je veux visualiser un calendrier de remboursement | Moyenne |

#### 2.2.5 Objectifs (`/objectifs`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-OB-01 | En tant qu'utilisateur, je veux creer un objectif d'epargne avec montant cible et date butoir | Critique |
| US-OB-02 | En tant qu'utilisateur, je veux voir ma progression vers chaque objectif | Haute |
| US-OB-03 | En tant qu'utilisateur Pro/Premium, je veux creer un nombre illimite d'objectifs | Haute |
| US-OB-04 | En tant qu'utilisateur Premium, je veux voir une projection de date d'atteindre selon mes habitudes | Moyenne |

#### 2.2.6 Analytics (`/analytics`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-AN-01 | En tant qu'utilisateur, je veux voir l'evolution de mes revenus et depenses sur une periode selectionnable | Critique |
| US-AN-02 | En tant qu'utilisateur Pro/Premium, je veux voir une analyse par categorie avec comparaison periodique | Haute |
| US-AN-03 | En tant qu'utilisateur Premium, je veux telecharger un rapport PDF de mes analytics | Haute |
| US-AN-04 | En tant qu'utilisateur Premium, je veux voir des previsions financieres sur 3/6/12 mois | Moyenne |

### 2.3 Pages de gestion d'abonnement

#### 2.3.1 Onboarding (`/onboarding`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-ON-01 | En tant que nouvel utilisateur, je veux etre guide dans la configuration initiale de mon compte | Haute |
| US-ON-02 | En tant que nouvel utilisateur, je veux pouvoir configurer ma devise par defaut | Haute |
| US-ON-03 | En tant que nouvel utilisateur, je veux pouvoir sauter l'onboarding et le completer plus tard | Moyenne |

#### 2.3.2 Checkout (`/checkout/:planId`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-CK-01 | En tant qu'utilisateur, je veux pouvoir payer par carte via Stripe | Critique |
| US-CK-02 | En tant qu'utilisateur, je veux pouvoir payer en cryptomonnaie (BTC/ETH) | Haute |
| US-CK-03 | En tant qu'utilisateur en Afrique, je veux payer via Mobile Money (MTN/Orange) | Haute |
| US-CK-04 | En tant qu'utilisateur, je veux voir un recapitulatif de ma commande avant paiement | Critique |
| US-CK-05 | En tant qu'utilisateur, je veux recevoir une confirmation de souscription apres paiement | Critique |

#### 2.3.3 Abonnement (`/subscription`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-SB-01 | En tant qu'abonne, je veux voir les details de mon abonnement actuel | Critique |
| US-SB-02 | En tant qu'abonne, je veux pouvoir upgrader vers un plan superieur | Haute |
| US-SB-03 | En tant qu'abonne, je veux pouvoir downgrader vers un plan inferieur | Haute |
| US-SB-04 | En tant qu'abonne, je veux pouvoir annuler mon renouvellement automatique | Haute |
| US-SB-05 | En tant qu'abonne annule, je veux pouvoir reactiver mon abonnement | Haute |

#### 2.3.4 Facturation (`/billing`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-BL-01 | En tant qu'abonne, je veux voir l'historique de mes factures | Critique |
| US-BL-02 | En tant qu'abonne, je veux pouvoir telecharger chaque facture en PDF | Haute |
| US-BL-03 | En tant qu'abonne, je veux gerer mes methodes de paiement enregistrees | Haute |
| US-BL-04 | En tant qu'abonne, je veux pouvoir changer ma methode de paiement par defaut | Haute |

#### 2.3.5 Parametres (`/settings`)

| ID | User Story | Priorite |
|----|-----------|----------|
| US-ST-01 | En tant qu'utilisateur, je veux modifier mon profil (nom, email, avatar) | Haute |
| US-ST-02 | En tant qu'utilisateur, je veux changer ma langue et ma devise | Haute |
| US-ST-03 | En tant qu'utilisateur, je veux modifier mon mot de passe | Haute |
| US-ST-04 | En tant qu'utilisateur, je veux gerer mes notifications | Moyenne |
| US-ST-05 | En tant qu'utilisateur, je veux pouvoir supprimer mon compte definitivement | Haute |

---

## 3. Exigences non-fonctionnelles

### 3.1 Performance

| Exigence | Cible | Methode de mesure |
|----------|-------|------------------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse, PageSpeed Insights |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Time to Interactive (TTI) | < 3.5s | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Temps de rendu des graphiques Recharts | < 500ms pour 500 points | Profilage React DevTools |
| Fluidite des animations Framer Motion | 60 fps | Chrome DevTools Performance |

### 3.2 Disponibilite

| Exigence | Cible |
|----------|-------|
| Uptime mensuel | > 99.9% |
| Temps de maintenance planifie | < 2h/mois |
| Degradation elegante en cas d'indisponibilite | Oui (mode hors-ligne avec localStorage) |

### 3.3 Accessibilite (a11y)

| Exigence | Reference | Niveau |
|----------|-----------|--------|
| Contrastes de couleurs | WCAG 2.1 AA | Ratio >= 4.5:1 pour le texte normal |
| Navigation clavier | WCAG 2.1 AA | Tous les elements interactifs accessibles via Tab |
| Attributs ARIA | WCAG 2.1 AA | Roles, labels et states correctement definis |
| Lecteur d'ecran | WCAG 2.1 AA | Compatibilite NVDA, JAWS, VoiceOver |
| Redimensionnement | WCAG 2.1 AA | Fonctionnement a 200% de zoom |
| Mouvement reduit | `prefers-reduced-motion` | Animations desactivees si preference utilisateur |

### 3.4 Evolutivite

L'architecture doit supporter :

- **100 000+ utilisateurs** : Le stockage local cote client elimine les contraintes serveur a ce stade
- **Extension a 5+ langues** : Architecture i18n prete pour l'ajout de nouvelles locales
- **Nouveaux niveaux de plan** : Le systeme de feature gates supporte l'ajout de tiers sans refactoring
- **Migration future vers backend** : Les Contexts et hooks sont concus pour etre remplaces par des appels API avec modification minime

---

## 4. Stack technique

### 4.1 Framework et runtime

| Dependance | Version | Justification technique |
|------------|---------|------------------------|
| **React** | 19.0.0 | Framework UI declaratif avec hooks, concurrent features, et compilateur React pour des performances optimales |
| **TypeScript** | 5.7.3 | Typage statique pour la fiabilite du code, autocompletion IDE, detection d'erreurs a la compilation |
| **Vite** | 7.2.4 | Bundler ultra-rapide avec HMR, tree-shaking agressif, et configuration zero pour le developpement |

### 4.2 Styling et composants UI

| Dependance | Version | Justification technique |
|------------|---------|------------------------|
| **Tailwind CSS** | 3.4.19 | Utility-first CSS framework pour un developpement rapide, purge automatique des styles inutilises |
| **shadcn/ui** | latest | Collection de 50+ composants React accessibles basees sur Radix UI, personnalisables via Tailwind |
| **Framer Motion** | 12.6.0 | Bibliotheque d'animations declaratives pour des transitions fluides entre pages et etats |
| **Lucide React** | 0.469.0 | Bibliotheque d'icones moderne, legere (tree-shakeable), avec 1000+ icones SVG |
| **clsx** | 2.1.1 | Utilitaire pour la composition conditionnelle de classes CSS |
| **tailwind-merge** | 2.6.0 | Fusion intelligente des classes Tailwind sans conflits |

### 4.3 Visualisation de donnees

| Dependance | Version | Justification technique |
|------------|---------|------------------------|
| **Recharts** | 2.15.0 | Bibliotheque de graphiques React basee sur D3, composants declaratifs, animations integrees |

### 4.4 Routage

| Dependance | Version | Justification technique |
|------------|---------|------------------------|
| **React Router** | 7.1.1 | Routage declaratif avec HashRouter pour le deploiement statique, lazy loading, guards de routes |

### 4.5 Gestion d'etat

| Solution | Pattern | Justification |
|----------|---------|---------------|
| **React Context** | Provider pattern | Partage d'etat global sans bibliotheque externe, suffisant pour l'echelle actuelle |
| **useReducer** | Flux-like | Gestion previsible des transitions d'etat complexes (auth, abonnement) |

### 4.6 Persistance de donnees

| Solution | Type | Justification |
|----------|------|---------------|
| **localStorage** | Stockage cle-valeur cote client | Persistance des donnees utilisateur sans backend, quota ~5-10 MB par domaine |

### 4.7 Build et tooling

| Dependance | Version | Justification technique |
|------------|---------|------------------------|
| **@vitejs/plugin-react** | 4.3.4 | Plugin Vite officiel avec Fast Refresh pour React |
| **autoprefixer** | 10.4.20 | PostCSS plugin pour les prefixes navigateurs automatiques |
| **postcss** | 8.4.49 | Processeur CSS pour la transformation des imports Tailwind |
| **@types/react** | 19.0.0 | Definitions TypeScript pour React |
| **@types/react-dom** | 19.0.0 | Definitions TypeScript pour ReactDOM |

### 4.8 Fonctionnalites natives utilisees

| API | Usage |
|-----|-------|
| `Intl.NumberFormat` | Formatage des montants selon la locale et devise |
| `Intl.DateTimeFormat` | Formatage des dates selon la locale |
| `localStorage` | Persistance des donnees d'authentification, abonnement et transactions |
| `URL.createObjectURL` | Generation des telechargements PDF de factures |
| `matchMedia` | Detection du mode sombre et des preferences de mouvement |
| `crypto.randomUUID` | Generation d'identifiants uniques pour les transactions et factures |

---

## 5. Compatibilite navigateurs

### 5.1 Navigateurs supportes

| Navigateur | Version minimale | Notes |
|------------|-----------------|-------|
| Chrome | 120+ | Navigateur de reference pour le developpement |
| Firefox | 121+ | Support complet des features ES2024 |
| Safari | 17+ | Support `Intl` complet, CSS Grid Level 2 |
| Edge | 120+ | Base Chromium, meme support que Chrome |
| Opera | 106+ | Base Chromium |
| Chrome Mobile | 120+ | Android 10+ |
| Safari iOS | 17+ | iOS 17+, iPadOS 17+ |
| Samsung Internet | 23+ | Android Samsung |

### 5.2 Features requises cote client

| Feature | API JavaScript | Fallback |
|---------|---------------|----------|
| Stockage local | `localStorage` | Affichage d'un message d'avertissement |
| Formatage monetaire | `Intl.NumberFormat` | Polyfill ou formatage basique |
| Formatage des dates | `Intl.DateTimeFormat` | Formatage manuel selon la locale |
| UUID securise | `crypto.randomUUID()` | `Math.random()` avec prefixe temporel |
| Module ES | `type="module"` | Message de mise a jour du navigateur |

---

## 6. Design responsive

### 6.1 Breakpoints

| Nom | Valeur | Usage |
|-----|--------|-------|
| **sm** | 640px | Petits telephones en paysage |
| **md** | 768px | Tablettes en portrait |
| **lg** | 1024px | Tablettes en paysage, petits laptops |
| **xl** | 1280px | Laptops standards |
| **2xl** | 1536px | Grands ecrans, ecrans 4K |

### 6.2 Comportement adaptatif par page

| Page | Mobile (< 768px) | Tablette (768-1024px) | Desktop (> 1024px) |
|------|-----------------|----------------------|-------------------|
| Landing | Colonne unique, CTA empiles | 2 colonnes pour les features | 3 colonnes, hero side-by-side |
| Dashboard | Cartes empilees, graphiques simplifies | 2 colonnes de cartes | 3-4 colonnes, dashboard complet |
| Transactions | Liste scrollable, actions swipe | Liste avec colonnes reduites | Table complete avec tri |
| Budgets | Barres de progression empilees | Grille 2 colonnes | Grille 3 colonnes avec details |
| Analytics | Graphique unique par vue | 2 graphiques cote a cote | Dashboard analytics complet |
| Pricing | Cartes empilees, feature list repliee | Cartes cote a cote | 3 cartes avec comparaison |
| Settings | Formulaire pleine largeur | 2 colonnes | 3 colonnes avec navigation |

### 6.3 Patterns responsive

```tsx
// Pattern de grille responsive pour les pages de liste
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Pattern de navigation responsive
// Mobile: drawer/bottom sheet
// Desktop: sidebar statique
<aside className="hidden lg:block w-64 shrink-0">
  <SidebarNavigation />
</aside>
<MobileNav className="lg:hidden" />
```

---

## 7. Exigences de securite

### 7.1 Authentification

| Exigence | Implementation | Niveau |
|----------|---------------|--------|
| Validation email | Regex RFC 5322 + verification de domaine | Standard |
| Mot de passe robuste | Min 8 caracteres, 1 majuscule, 1 minuscule, 1 chiffre | Standard |
| Hachage des mots de passe | bcrypt (cost factor 12) | Standard |
| OAuth 2.0 | Google, Apple, Microsoft avec PKCE | Eleve |
| Sessions avec expiration | JWT avec refresh token, expiration 7 jours | Eleve |
| Deconnexion automatique | Apres 30 min d'inactivite | Standard |
| Protection brute-force | Delai exponentiel apres echecs consecutifs | Standard |

### 7.2 Protection des donnees

| Exigence | Implementation |
|----------|---------------|
| Chiffrement local | Donnees sensibles chiffrees dans localStorage avec AES-256-GCM |
| Cloisonnement des donnees | Chaque utilisateur ne voit que ses propres donnees via le contexte d'authentification |
| Suppression de compte | Possibilite de suppression definitive avec effacement de toutes les donnees |
| Export de donnees | Telechargement des donnees personnelles au format JSON |

### 7.3 Securite des paiements

| Exigence | Implementation |
|----------|---------------|
| **Stripe** | Integration Checkout.js, les donnees de carte ne transient jamais par nos serveurs |
| **Cryptomonnaies** | Generation d'adresses de paiement uniques par transaction, verification on-chain |
| **Mobile Money** | Integration API MTN/Orange Money avec callback de confirmation |
| **Conformite** | Aucune donnee de paiement n'est stockee cote client (hors token de reference) |
| **HTTPS obligatoire** | Toutes les communications sont chiffrees en TLS 1.3 |

### 7.4 Protection contre les vulnerabilites courantes

| Vulnerabilite | Mesure de protection |
|---------------|---------------------|
| XSS (Cross-Site Scripting) | Echappement systematique des entrees utilisateur, Content-Security-Policy |
| CSRF (Cross-Site Request Forgery) | Tokens CSRF pour les actions sensibles |
| Injection de dependances | Audit regulier avec `npm audit`, dependances verrouillees |
| Clickjacking | Header `X-Frame-Options: DENY` |
| Fuite d'informations | Pas de donnees sensibles dans les logs console en production |

---

## 8. Internationalisation

### 8.1 Langues supportees

| Code | Langue | Couverture | Statut |
|------|--------|-----------|--------|
| `en` | Anglais | 100% | Langue de reference |
| `fr` | Francais | 100% | Langue secondaire |
| `es` | Espagnol | 100% | Langue secondaire |

### 8.2 Devises supportees

| Code | Devise | Symbole | Pays cibles |
|------|--------|---------|-------------|
| `USD` | Dollar americain | $ | Etats-Unis, international |
| `EUR` | Euro | E | Europe (zone Euro) |
| `GBP` | Livre sterling | L | Royaume-Uni |

### 8.3 Formatage des montants

```typescript
// Exemple de formatage pour chaque locale
const formatPrice = (amount: number, currency: CurrencyCode, locale: string): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// Resultats:
// formatPrice(19.99, 'USD', 'en-US') -> "$19.99"
// formatPrice(19.99, 'EUR', 'fr-FR') -> "19,99 E"
// formatPrice(19.99, 'GBP', 'en-GB') -> "L19.99"
```

### 8.4 Formatage des dates

| Locale | Format court | Format long | Format relatif |
|--------|-------------|-------------|----------------|
| `en-US` | 06/15/2025 | June 15, 2025 | 2 days ago |
| `fr-FR` | 15/06/2025 | 15 juin 2025 | il y a 2 jours |
| `es-ES` | 15/06/2025 | 15 de junio de 2025 | hace 2 dias |

### 8.5 Detection de la langue

1. Premier acces : detection via `navigator.language`
2. Preference sauvegardee : lecture depuis le localStorage
3. Modification manuelle : selecteur de langue dans les parametres
4. Persistance : la langue choisie est memorisee pour les visites futures

---

## 9. Exigences de deploiement

### 9.1 Infrastructure

| Composant | Specification | Justification |
|-----------|--------------|---------------|
| **Hebergement** | CDN statique (Cloudflare Pages / Vercel / Netlify) | SPA sans backend, deploiement via CI/CD |
| **Domaine** | `fintrack.app` avec sous-domaine `www` | Nom de domaine principal |
| **Certificat SSL** | TLS 1.3 via Let's Encrypt (auto) | Chiffrement HTTPS obligatoire |
| **DNS** | Cloudflare DNS avec proxy | Protection DDoS, CDN global |

### 9.2 Configuration de build

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts'],
        },
      },
    },
  },
});
```

### 9.3 Optimisations de performance

| Optimisation | Implementation |
|-------------|---------------|
| Code splitting | Split par route avec `React.lazy()` et `Suspense` |
| Prefetching | Prechargement des routes probables au survol des liens |
| Compression | Brotli + Gzip cote serveur, assets compressees a < 50% |
| Mise en cache | Cache-Control: immutable pour les assets hashees, 1 an |
| PWA | Service worker pour le caching offline des assets statiques |

### 9.4 Environnements

| Environnement | URL | Usage |
|---------------|-----|-------|
| Developpement | `localhost:5173` | Developpement local avec HMR |
| Staging | `staging.fintrack.app` | Tests de recette avant production |
| Production | `fintrack.app` | Environnement public |

---

## 10. Contraintes et hypotheses

### 10.1 Contraintes techniques connues

| ID | Contrainte | Impact | Mitigation |
|----|-----------|--------|------------|
| C-01 | **localStorage limite a ~5-10 Mo** | Risque de saturation pour les utilisateurs avec beaucoup de transactions | Compression des donnees, pagination, export automatique |
| C-02 | **Pas de backend** | Synchronisation impossible entre appareils, donnees perdues si cache vide | Export regulier, migration vers backend planifiee |
| C-03 | **HashRouter obligatoire** | URLs avec `/#/` moins esthetiques, SEO degrade pour les pages profondes | SSR planifie pour la phase 2 |
| C-04 | **Client-side rendering uniquement** | Temps de chargement initial plus long, contenu invisible aux crawlers | Pre-rendering, skeleton loaders, meta tags statiques |
| C-05 | **SPA mono-page** | Pas de partage facile d'URLs specifiques entre utilisateurs | HashRouter preserve l'etat de navigation |

### 10.2 Hypotheses de conception

| ID | Hypothese | Validation |
|----|-----------|------------|
| H-01 | Les utilisateurs preferent une experience offline-first plutot qu'une synchronisation cloud | A tester via les retours utilisateurs |
| H-02 | 3 niveaux de plan suffisent pour couvrir les besoins du marche | Analyse des donnees de conversion |
| H-03 | Le paiement Mobile Money est un differenciateur cle sur le marche africain | Suivi des paiements par methode |
| H-04 | Les animations ameliorent l'experience utilisateur sans nuire a la performance | Mesures de Core Web Vitals |
| H-05 | Les utilisateurs resteront majoritairement sur FR et EN | Analytics de langue |

### 10.3 Decisions architecturales

| Decision | Contexte | Alternative rejetee |
|----------|----------|-------------------|
| Context + useReducer vs Redux | Simplicite, pas de dependance externe pour l'echelle actuelle | Redux Toolkit ( surcharge pour le besoin) |
| HashRouter vs BrowserRouter | Deploiement sur CDN statique sans configuration serveur | BrowserRouter (necessite les fallback routes) |
| localStorage vs IndexedDB | Simplicite d'API, suffisant pour la taille des donnees | IndexedDB (complexite injustifiee) |
| shadcn/ui vs Material-UI | Personnalisation totale, pas de lock-in visuel | Material-UI (look trop reconnaissable) |
| Framer Motion vs CSS transitions | Animations complexes, gestures, AnimatePresence | CSS pur (trop limitant pour les transitions de page) |

### 10.4 Feuille de route technique

| Phase | Periode | Objectifs |
|-------|---------|-----------|
| **V1.0** | Q2 2025 | MVP avec 3 plans, 3 methodes de paiement, i18n EN/FR/ES |
| **V1.1** | Q3 2025 | Backend API, synchronisation cloud, application mobile |
| **V1.2** | Q4 2025 | AI insights, predictions financieres, integrations bancaires |
| **V2.0** | Q1 2026 | Mode collaboratif (familles), API publique, marketplace d'extensions |

---

## Annexes

### A. Glossaire

| Terme | Definition |
|-------|-----------|
| **Feature Gate** | Mecanisme de controle d'acces aux fonctionnalites selon le plan d'abonnement |
| **MRR** | Monthly Recurring Revenue — revenu mensuel recurrent |
| **HashRouter** | Mode de routage utilisant le fragment d'URL (`/#/`) pour la navigation cote client |
| **CSR** | Client-Side Rendering — rendu de l'application dans le navigateur |
| **HMR** | Hot Module Replacement — remplacement a chaud des modules en developpement |
| **Tree-shaking** | Elimination du code mort par le bundler pour reduire la taille du bundle |

### B. References

- [React 19 Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Recharts Documentation](https://recharts.org/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Router Documentation](https://reactrouter.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Stripe Documentation](https://stripe.com/docs)

---

*Document genere le 17 juin 2025. Version 1.0.0.*
