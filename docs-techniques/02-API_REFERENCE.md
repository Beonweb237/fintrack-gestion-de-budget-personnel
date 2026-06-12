# FinTrack — Reference API

## Version 1.0.0 | Juin 2025

---

## Table des matieres

1. [Modeles de donnees](#1-modeles-de-donnees)
2. [API des Contexts](#2-api-des-contexts)
3. [Hooks personnalises](#3-hooks-personnalises)
4. [Fonctions utilitaires](#4-fonctions-utilitaires)
5. [API de donnees mock](#5-api-de-donnees-mock)
6. [Definition des routes](#6-definition-des-routes)
7. [Feature Gates](#7-feature-gates)
8. [Guards de routes](#8-guards-de-routes)

---

## 1. Modeles de donnees

Cette section documente l'integralite des interfaces TypeScript definies dans `src/types/saas.ts`. Ces types constituent le contrat de donnees de l'application.

### 1.1 AppUser

Represente un utilisateur authentifie dans le systeme.

```typescript
interface AppUser {
  /** Identifiant unique de l'utilisateur (UUID v4) */
  id: string;
  
  /** Nom complet affiche dans l'interface */
  name: string;
  
  /** Adresse email utilisee pour la connexion */
  email: string;
  
  /** URL de l'avatar (genere automatiquement ou upload) */
  avatar?: string;
  
  /** Langue preferee de l'utilisateur */
  language: 'en' | 'fr' | 'es';
  
  /** Devise par defaut pour les affichages financiers */
  currency: 'USD' | 'EUR' | 'GBP';
  
  /** Date de creation du compte (ISO 8601) */
  createdAt: string;
  
  /** Date de derniere connexion (ISO 8601) */
  lastLoginAt: string;
  
  /** Methode d'authentification utilisee */
  authProvider: 'email' | 'google' | 'apple' | 'microsoft';
  
  /** Indique si l'onboarding est complete */
  onboardingCompleted: boolean;
}
```

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `id` | `string` | Oui | UUID v4 unique |
| `name` | `string` | Oui | Nom complet (min 2 caracteres) |
| `email` | `string` | Oui | Email valide RFC 5322 |
| `avatar` | `string` | Non | URL de l'image de profil |
| `language` | `enum` | Oui | Langue de l'interface |
| `currency` | `enum` | Oui | Devise par defaut |
| `createdAt` | `string` | Oui | Date de creation ISO 8601 |
| `lastLoginAt` | `string` | Oui | Derniere connexion ISO 8601 |
| `authProvider` | `enum` | Oui | Fournisseur d'authentification |
| `onboardingCompleted` | `boolean` | Oui | Etat de l'onboarding |

### 1.2 PlanTier et PlanInterval

Enumerations definissant les niveaux d'abonnement et les intervalles de paiement.

```typescript
/** Niveaux d'abonnement disponibles */
type PlanTier = 'free' | 'pro' | 'premium';

/** Intervalles de facturation */
type PlanInterval = 'monthly' | 'yearly';
```

### 1.3 Plan

Definit un plan d'abonnement commercial avec ses caracteristiques.

```typescript
interface Plan {
  /** Identifiant unique du plan */
  id: PlanTier;
  
  /** Nom d'affichage du plan */
  name: string;
  
  /** Prix mensuel en USD */
  monthlyPrice: number;
  
  /** Prix annuel en USD (avec remise appliquee) */
  yearlyPrice: number;
  
  /** Description courte pour la page de tarification */
  description: string;
  
  /** Liste des fonctionnalites incluses avec indicateur de disponibilite */
  features: PlanFeature[];
  
  /** Limites d'utilisation associees au plan */
  limits: PlanLimits;
  
  /** Indique si le plan est mis en avant (recommande) */
  highlighted?: boolean;
}

/** Feature individuelle d'un plan */
interface PlanFeature {
  /** Cle d'internationalisation de la feature */
  key: string;
  
  /** Texte d'affichage de la feature */
  label: string;
  
  /** Indique si la feature est disponible dans ce plan */
  included: boolean;
  
  /** Valeur limite (ex: "10", "Illimite") pour les features limitees */
  limit?: string;
}

/** Limites d'utilisation par plan */
interface PlanLimits {
  /** Nombre maximal de transactions mensuelles */
  maxTransactions: number;
  
  /** Nombre maximal de budgets actifs */
  maxBudgets: number;
  
  /** Nombre maximal d'objectifs d'epargne */
  maxGoals: number;
  
  /** Nombre maximal de dettes suivies */
  maxDebts: number;
  
  /** Nombre de devises simultanees */
  maxCurrencies: number;
  
  /** Acces aux rapports PDF */
  canExportPDF: boolean;
  
  /** Acces aux analytics avances */
  advancedAnalytics: boolean;
  
  /** Acces aux previsions financieres */
  forecasting: boolean;
}
```

### 1.4 Subscription

Represente l'etat d'abonnement d'un utilisateur.

```typescript
interface Subscription {
  /** Identifiant unique de l'abonnement */
  id: string;
  
  /** Reference vers l'utilisateur */
  userId: string;
  
  /** Plan actuellement souscrit */
  planId: PlanTier;
  
  /** Intervalle de facturation */
  interval: PlanInterval;
  
  /** Statut de l'abonnement */
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  
  /** Date de debut de l'abonnement (ISO 8601) */
  startDate: string;
  
  /** Date de fin de periode courante (ISO 8601) */
  currentPeriodEnd: string;
  
  /** Date d'annulation si applicable (ISO 8601) */
  cancelledAt?: string;
  
  /** Methode de paiement par defaut */
  defaultPaymentMethodId?: string;
  
  /** Indique si le renouvellement automatique est active */
  autoRenew: boolean;
  
  /** Montant facture pour la periode courante */
  currentPeriodAmount: number;
}
```

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `id` | `string` | Oui | UUID v4 |
| `userId` | `string` | Oui | Reference AppUser.id |
| `planId` | `PlanTier` | Oui | Niveau actuel |
| `interval` | `PlanInterval` | Oui | Mensuel ou annuel |
| `status` | `enum` | Oui | active / cancelled / past_due / trialing |
| `startDate` | `string` | Oui | Date de debut ISO 8601 |
| `currentPeriodEnd` | `string` | Oui | Fin de periode courante |
| `cancelledAt` | `string` | Non | Date d'annulation |
| `defaultPaymentMethodId` | `string` | Non | ID methode de paiement |
| `autoRenew` | `boolean` | Oui | Renouvellement auto |
| `currentPeriodAmount` | `number` | Oui | Montant facture |

### 1.5 Invoice

Represente une facture generee pour un abonnement.

```typescript
interface Invoice {
  /** Identifiant unique de la facture */
  id: string;
  
  /** Reference vers l'abonnement */
  subscriptionId: string;
  
  /** Reference vers l'utilisateur */
  userId: string;
  
  /** Numero de facture affiche (ex: FT-2025-0001) */
  invoiceNumber: string;
  
  /** Periode de facturation - debut */
  periodStart: string;
  
  /** Periode de facturation - fin */
  periodEnd: string;
  
  /** Montant total TTC */
  amount: number;
  
  /** Devise de la facture */
  currency: string;
  
  /** Statut de la facture */
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  
  /** Date de paiement si applicable */
  paidAt?: string;
  
  /** Lignes de detail de la facture */
  lines: InvoiceLine[];
  
  /** PDF de la facture (Blob URL) */
  pdfUrl?: string;
  
  /** Date de creation (ISO 8601) */
  createdAt: string;
}

interface InvoiceLine {
  /** Description de la ligne */
  description: string;
  
  /** Quantite facturee */
  quantity: number;
  
  /** Prix unitaire */
  unitPrice: number;
  
  /** Montant total de la ligne */
  amount: number;
}
```

### 1.6 PaymentMethodInfo

Represente une methode de paiement enregistree.

```typescript
interface PaymentMethodInfo {
  /** Identifiant unique de la methode */
  id: string;
  
  /** Type de methode de paiement */
  type: 'card' | 'crypto' | 'mobile_money';
  
  /** Sous-type specifique */
  subtype: 'visa' | 'mastercard' | 'btc' | 'eth' | 'mtn' | 'orange';
  
  /** Derniers chiffres ou identifiant masque */
  last4: string;
  
  /** Date d'expiration (pour les cartes, MM/AA) */
  expiryDate?: string;
  
  /** Indique si c'est la methode par defaut */
  isDefault: boolean;
  
  /** Libelle personnalise par l'utilisateur */
  label?: string;
  
  /** Date d'ajout */
  addedAt: string;
}
```

### 1.7 Transaction

Represente une operation financiere (revenu ou depense).

```typescript
interface Transaction {
  /** Identifiant unique de la transaction */
  id: string;
  
  /** Reference vers l'utilisateur */
  userId: string;
  
  /** Montant de la transaction (positif = revenu, negatif = depense) */
  amount: number;
  
  /** Devise de la transaction */
  currency: string;
  
  /** Description textuelle */
  description: string;
  
  /** Categorie de la transaction */
  category: string;
  
  /** Date de la transaction (ISO 8601) */
  date: string;
  
  /** Type de transaction */
  type: 'income' | 'expense';
  
  /** Tags associes pour le filtrage */
  tags?: string[];
  
  /** Recurrence si applicable */
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  
  /** Date de creation dans le systeme */
  createdAt: string;
}
```

### 1.8 Category

Categorie de transaction predefinie ou personnalisee.

```typescript
interface Category {
  /** Identifiant unique de la categorie */
  id: string;
  
  /** Nom d'affichage */
  name: string;
  /** Icone Lucide associee */
  icon: string;
  
  /** Couleur associee (hexadecimal) */
  color: string;
  
  /** Type de categorie */
  type: 'income' | 'expense' | 'both';
  
  /** Indique si la categorie est predefinie ou personnalisee */
  isDefault: boolean;
  
  /** Budget associe (optionnel) */
  budgetId?: string;
}
```

### 1.9 Budget

Budget mensuel associe a une categorie.

```typescript
interface Budget {
  /** Identifiant unique du budget */
  id: string;
  
  /** Reference vers l'utilisateur */
  userId: string;
  
  /** Reference vers la categorie */
  categoryId: string;
  
  /** Montant alloue pour la periode */
  allocatedAmount: number;
  
  /** Montant actuellement depense */
  spentAmount: number;
  
  /** Periode du budget (YYYY-MM) */
  period: string;
  
  /** Devise du budget */
  currency: string;
  
  /** Seuil d'alerte (0-1, ex: 0.8 pour 80%) */
  alertThreshold: number;
  
  /** Date de creation */
  createdAt: string;
}
```

### 1.10 SavingsGoal

Objectif d'epargne avec montant cible.

```typescript
interface SavingsGoal {
  /** Identifiant unique de l'objectif */
  id: string;
  
  /** Reference vers l'utilisateur */
  userId: string;
  
  /** Nom de l'objectif */
  name: string;
  
  /** Description optionnelle */
  description?: string;
  
  /** Montant cible a atteindre */
  targetAmount: number;
  
  /** Montant actuellement epargne */
  currentAmount: number;
  
  /** Devise */
  currency: string;
  
  /** Date cible d'atteinte (ISO 8601) */
  targetDate: string;
  
  /** Icone associee */
  icon?: string;
  
  /** Couleur associee */
  color?: string;
  
  /** Date de creation */
  createdAt: string;
}
```

### 1.11 Debt

Dette avec suivi des remboursements.

```typescript
interface Debt {
  /** Identifiant unique de la dette */
  id: string;
  
  /** Reference vers l'utilisateur */
  userId: string;
  
  /** Nom du creancier */
  creditor: string;
  
  /** Description de la dette */
  description?: string;
  
  /** Montant initial emprunte */
  principalAmount: number;
  
  /** Montant total rembourse */
  totalRepaid: number;
  
  /** Taux d'interet annuel (pourcentage) */
  interestRate: number;
  
  /** Montant des interets accumules */
  accruedInterest: number;
  
  /** Solde restant a rembourser */
  remainingBalance: number;
  
  /** Date d'emprunt (ISO 8601) */
  borrowedDate: string;
  
  /** Date d'echeance (ISO 8601) */
  dueDate: string;
  
  /** Devise */
  currency: string;
  
  /** Statut de la dette */
  status: 'active' | 'paid_off' | 'overdue' | 'defaulted';
  
  /** Historique des paiements */
  payments: DebtPayment[];
  
  /** Date de creation */
  createdAt: string;
}
```

### 1.12 DebtPayment

Paiement partiel sur une dette.

```typescript
interface DebtPayment {
  /** Identifiant unique du paiement */
  id: string;
  
  /** Reference vers la dette */
  debtId: string;
  
  /** Montant rembourse */
  amount: number;
  
  /** Part interets dans ce paiement */
  interestAmount: number;
  
  /** Part principal dans ce paiement */
  principalAmount: number;
  
  /** Date du paiement (ISO 8601) */
  paymentDate: string;
  
  /** Methode de paiement utilisee */
  paymentMethod: string;
  
  /** Note optionnelle */
  note?: string;
}
```

---

## 2. API des Contexts

Les Contexts React constituent le coeur de la gestion d'etat de FinTrack. Ils encapsulent la logique metier et fournissent les donnees a l'ensemble de l'arborescence des composants.

### 2.1 AuthContext

**Fichier source :** `src/contexts/AuthContext.tsx`

Le `AuthContext` gere l'integralite du cycle de vie d'authentification : inscription, connexion, deconnexion, et mise a jour du profil utilisateur.

#### Etat expose (`AuthState`)

```typescript
interface AuthState {
  /** Utilisateur actuellement authentifie, null si non connecte */
  user: AppUser | null;
  
  /** Indique si une session est active */
  isAuthenticated: boolean;
  
  /** Indique si la verification de session est en cours */
  isLoading: boolean;
}
```

#### Methodes exposees

##### `login(email: string, password: string): Promise<void>`

Authentifie un utilisateur avec ses identifiants email/mot de passe.

| Parametre | Type | Description |
|-----------|------|-------------|
| `email` | `string` | Adresse email enregistree |
| `password` | `string` | Mot de passe (min 8 caracteres) |

**Retour :** `Promise<void>` — Resout si l'authentification reussit, rejette avec `AuthError` sinon.

**Erreurs possibles :**

| Code | Message | Condition |
|------|---------|-----------|
| `INVALID_CREDENTIALS` | "Email ou mot de passe incorrect" | Email inconnu ou mot de passe errone |
| `ACCOUNT_LOCKED` | "Compte temporairement verrouille" | 5 tentatives echouees consecutivement |
| `NETWORK_ERROR` | "Erreur de connexion" | Indisponibilite temporaire |

**Exemple d'utilisation :**

```typescript
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  
  const handleSubmit = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirection automatique vers /dashboard
    } catch (error) {
      console.error('Erreur de connexion:', error.message);
    }
  };
}
```

##### `register(name: string, email: string, password: string): Promise<void>`

Cree un nouveau compte utilisateur.

| Parametre | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Nom complet (min 2 caracteres) |
| `email` | `string` | Adresse email unique |
| `password` | `string` | Mot de passe (min 8 caracteres, 1 majuscule, 1 chiffre) |

**Retour :** `Promise<void>` — Resout si l'inscription reussit, rejette avec `AuthError` sinon.

**Erreurs possibles :**

| Code | Message | Condition |
|------|---------|-----------|
| `EMAIL_EXISTS` | "Cet email est deja utilise" | Email deja enregistre |
| `WEAK_PASSWORD` | "Mot de passe trop faible" | Ne respecte pas les criteres de securite |
| `INVALID_EMAIL` | "Format d'email invalide" | Email ne respecte pas le format RFC 5322 |

**Exemple d'utilisation :**

```typescript
const { register } = useAuth();

const handleRegister = async () => {
  try {
    await register('Jean Dupont', 'jean@example.com', 'SecurePass123');
    // Redirection automatique vers /onboarding
  } catch (error) {
    // Afficher l'erreur dans le formulaire
  }
};
```

##### `logout(): void`

Termine la session active et supprime les donnees d'authentification du localStorage.

| Parametre | Type | Description |
|-----------|------|-------------|
| Aucun | — | — |

**Retour :** `void` — Effet de bord immediat (deconnexion synchrone).

**Effets secondaires :**
- Suppression du token JWT du localStorage
- Reinitialisation de l'etat `AuthState` a ses valeurs initiales
- Invalidation du `SubscriptionContext` (deconnexion en cascade)
- Redirection automatique vers `/`

##### `updateUser(updates: Partial<AppUser>): void`

Met a jour les proprietes du profil utilisateur.

| Parametre | Type | Description |
|-----------|------|-------------|
| `updates` | `Partial<AppUser>` | Objet contenant uniquement les champs a modifier |

**Retour :** `void` — Mise a jour synchrone de l'etat et persistance dans localStorage.

**Champs modifiables :**

| Champ | Validation |
|-------|-----------|
| `name` | Min 2 caracteres |
| `email` | Format email valide, unicite verifiee |
| `language` | Valeur parmi `en`, `fr`, `es` |
| `currency` | Valeur parmi `USD`, `EUR`, `GBP` |
| `avatar` | URL valide ou Data URI |
| `onboardingCompleted` | `boolean` |

**Exemple d'utilisation :**

```typescript
const { updateUser } = useAuth();

const handleLanguageChange = (lang: 'en' | 'fr' | 'es') => {
  updateUser({ language: lang });
  // i18n mise a jour automatiquement
};
```

#### Hook : `useAuth()`

```typescript
function useAuth(): AuthContextValue;

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<AppUser>) => void;
}
```

---

### 2.2 SubscriptionContext

**Fichier source :** `src/contexts/SubscriptionContext.tsx`

Le `SubscriptionContext` gere l'integralite du cycle de vie de l'abonnement : souscription, modification, annulation, et gestion des methodes de paiement.

#### Etat expose (`SubscriptionState`)

```typescript
interface SubscriptionState {
  /** Abonnement actif de l'utilisateur */
  subscription: Subscription | null;
  
  /** Historique des factures */
  invoices: Invoice[];
  
  /** Methodes de paiement enregistrees */
  paymentMethods: PaymentMethodInfo[];
  
  /** Indique si le chargement initial est en cours */
  isLoading: boolean;
}
```

#### Methodes exposees

##### `upgradePlan(planId: PlanTier, interval: PlanInterval): void`

Souscrit ou met a niveau l'abonnement vers un plan superieur ou different.

| Parametre | Type | Description |
|-----------|------|-------------|
| `planId` | `PlanTier` | Identifiant du plan cible (`free`, `pro`, `premium`) |
| `interval` | `PlanInterval` | Intervalle de facturation (`monthly`, `yearly`) |

**Retour :** `void` — Mise a jour synchrone de l'abonnement (simulation en v1.0).

**Regles metier :**
- Upgrade immediat : facturation au prorata si passage a un plan superieur
- Downgrade differre : prise d'effet a la fin de la periode courante
- Reabonnement : restauration des donnees precedemment limitees

**Exemple d'utilisation :**

```typescript
import { useSubscription } from '@/contexts/SubscriptionContext';

function UpgradeButton() {
  const { upgradePlan } = useSubscription();
  
  const handleUpgrade = () => {
    upgradePlan('pro', 'monthly');
    // Redirection vers /checkout/pro pour le paiement
  };
  
  return <button onClick={handleUpgrade}>Passer a Pro</button>;
}
```

##### `cancelSubscription(): void`

Annule le renouvellement automatique de l'abonnement courant.

| Parametre | Type | Description |
|-----------|------|-------------|
| Aucun | — | — |

**Retour :** `void`

**Comportement :**
- L'abonnement reste actif jusqu'a la fin de la periode courante (`currentPeriodEnd`)
- Le champ `autoRenew` passe a `false`
- Le champ `cancelledAt` est renseigne avec la date courante
- Le statut passe a `cancelled` apres la fin de periode

##### `reactivateSubscription(): void`

Reactive un abonnement precedemment annule (avant la fin de periode).

| Parametre | Type | Description |
|-----------|------|-------------|
| Aucun | — | — |

**Retour :** `void`

**Conditions :** L'abonnement doit avoir le statut `cancelled` avec `autoRenew = false`.

##### `addPaymentMethod(method: PaymentMethodInfo): void`

Ajoute une nouvelle methode de paiement au portefeuille de l'utilisateur.

| Parametre | Type | Description |
|-----------|------|-------------|
| `method` | `PaymentMethodInfo` | Obet complet de la methode de paiement a ajouter |

**Retour :** `void`

**Validation :**
- Le `type` doit etre parmi `card`, `crypto`, `mobile_money`
- Le `subtype` doit correspondre au type
- Le `last4` doit contenir exactement 4 caracteres masques

##### `removePaymentMethod(id: string): void`

Supprime une methode de paiement enregistree.

| Parametre | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Identifiant de la methode a supprimer |

**Retour :** `void`

**Contrainte :** Impossible de supprimer la methode de paiement par defaut sans en designer une autre au prealable.

##### `setDefaultPayment(id: string): void`

Designe une methode de paiement comme methode par defaut.

| Parametre | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Identifiant de la methode a definir par defaut |

**Retour :** `void`

**Effet :** Le champ `isDefault` de l'ancienne methode par defaut passe a `false`, celui de la nouvelle a `true`.

##### `getCurrentPlan(): Plan | undefined`

Retourne la definition complete du plan actuellement souscrit.

**Retour :** `Plan | undefined` — L'objet `Plan` correspondant au `planId` de l'abonnement actif, ou `undefined` si aucun abonnement.

##### `canUseFeature(feature: string): boolean`

Verifie si l'utilisateur a acces a une fonctionnalite donnee selon son plan.

| Parametre | Type | Description |
|-----------|------|-------------|
| `feature` | `string` | Cle identifiant la fonctionnalite (ex: `export-pdf`, `advanced-analytics`) |

**Retour :** `boolean` — `true` si le plan courant inclut la fonctionnalite, `false` sinon.

##### `getFeatureLimit(feature: string): number | boolean`

Retourne la limite d'utilisation associee a une fonctionnalite.

| Parametre | Type | Description |
|-----------|------|-------------|
| `feature` | `string` | Cle identifiant la fonctionnalite limitee |

**Retour :**
- `number` — La limite numerique (ex: `10` pour 10 transactions)
- `boolean` — `true` si illimite, `false` si non disponible

**Fonctionnalites evaluables :**

| Cle | Type de retour | Description |
|-----|---------------|-------------|
| `maxTransactions` | `number` | Nombre maximal de transactions mensuelles |
| `maxBudgets` | `number` | Nombre maximal de budgets |
| `maxGoals` | `number` | Nombre maximal d'objectifs |
| `maxDebts` | `number` | Nombre maximal de dettes |
| `maxCurrencies` | `number` | Nombre de devises simultanees |
| `exportPDF` | `boolean` | Acces a l'export PDF |
| `advancedAnalytics` | `boolean` | Acces aux analytics avances |
| `forecasting` | `boolean` | Acces aux previsions |

#### Hook : `useSubscription()`

```typescript
function useSubscription(): SubscriptionContextValue;

interface SubscriptionContextValue extends SubscriptionState {
  upgradePlan: (planId: PlanTier, interval: PlanInterval) => void;
  cancelSubscription: () => void;
  reactivateSubscription: () => void;
  addPaymentMethod: (method: PaymentMethodInfo) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPayment: (id: string) => void;
  getCurrentPlan: () => Plan | undefined;
  canUseFeature: (feature: string) => boolean;
  getFeatureLimit: (feature: string) => number | boolean;
}
```

---

## 3. Hooks personnalises

### 3.1 useFeatureGate

**Fichier source :** `src/hooks/useFeatureGate.ts`

Hook central pour le controle d'acces aux fonctionnalites base sur le plan d'abonnement. Toutes les fonctionnalites protegees doivent utiliser ce hook.

#### Signature

```typescript
function useFeatureGate(feature: string): FeatureGateResult;

interface FeatureGateResult {
  /** Indique si la fonctionnalite est accessible */
  allowed: boolean;
  
  /** Limite d'utilisation (si applicable) */
  limit: number | boolean;
  
  /** Nom du plan requis pour debloquer la fonctionnalite */
  requiredPlan: PlanTier;
  
  /** Message d'upgrade a afficher si non accessible */
  upgradeMessage: string;
}
```

#### Parameters

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `feature` | `string` | Oui | Cle identifiant la fonctionnalite a verifier |

#### Valeurs retournees

| Propriete | Type | Description |
|-----------|------|-------------|
| `allowed` | `boolean` | `true` si l'utilisateur peut utiliser la fonctionnalite |
| `limit` | `number \| boolean` | Limite numerique ou booleenne de la fonctionnalite |
| `requiredPlan` | `PlanTier` | Plan minimum requis pour l'acces |
| `upgradeMessage` | `string` | Message traduit incitant a l'upgrade |

**Exemple d'utilisation — Blocage d'interface :**

```typescript
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { Lock } from 'lucide-react';

function ExportPDFButton() {
  const { allowed, upgradeMessage } = useFeatureGate('export-pdf');
  
  if (!allowed) {
    return (
      <div className="relative">
        <button disabled className="opacity-50 cursor-not-allowed">
          Exporter PDF
        </button>
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="w-4 h-4" />
          <span className="text-xs ml-1">{upgradeMessage}</span>
        </div>
      </div>
    );
  }
  
  return <button onClick={handleExport}>Exporter PDF</button>;
}
```

**Exemple d'utilisation — Limitation numerique :**

```typescript
function TransactionList() {
  const { allowed, limit } = useFeatureGate('maxTransactions');
  const transactions = useTransactions();
  
  const maxTransactions = typeof limit === 'number' ? limit : Infinity;
  const displayedTransactions = transactions.slice(0, maxTransactions);
  const isLimitReached = transactions.length >= maxTransactions;
  
  return (
    <div>
      {displayedTransactions.map(tx => <TransactionRow key={tx.id} {...tx} />)}
      {isLimitReached && <LimitReachedMessage />}
    </div>
  );
}
```

### 3.2 useAuth

Hook de convenance pour consommer `AuthContext`. Voir section 2.1 pour les details complets.

```typescript
import { useAuth } from '@/contexts/AuthContext';

// Utilisation
const { user, isAuthenticated, isLoading, login, register, logout, updateUser } = useAuth();
```

### 3.3 useSubscription

Hook de convenance pour consommer `SubscriptionContext`. Voir section 2.2 pour les details complets.

```typescript
import { useSubscription } from '@/contexts/SubscriptionContext';

// Utilisation
const { subscription, invoices, paymentMethods, upgradePlan, canUseFeature } = useSubscription();
```

---

## 4. Fonctions utilitaires

Ces fonctions sont definies dans `src/data/saasData.ts` et sont utilisees a travers l'application pour le formatage, les calculs et la manipulation des donnees.

### 4.1 Formatage des prix

#### `formatPrice(amount: number, currency: CurrencyCode, locale?: string): string`

Formate un montant dans la devise et la locale specifiees.

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `amount` | `number` | Oui | Montant a formater |
| `currency` | `CurrencyCode` | Oui | Code devise (`USD`, `EUR`, `GBP`) |
| `locale` | `string` | Non | Locale BCP 47 (defaut: locale courante) |

**Retour :** `string` — Montant formate (ex: "$19.99", "19,99 EUR")

**Exemples :**

```typescript
formatPrice(19.99, 'USD', 'en-US');   // "$19.99"
formatPrice(19.99, 'EUR', 'fr-FR');   // "19,99 EUR"
formatPrice(19.99, 'GBP', 'en-GB');   // "GBP 19.99"
formatPrice(0, 'USD');                 // "$0.00"
formatPrice(-150.50, 'EUR');           // "-150,50 EUR"
```

#### `formatCurrency(amount: number, currency: CurrencyCode): string`

Formate un montant avec le symbole devise uniquement, sans tenir compte de la locale.

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `amount` | `number` | Oui | Montant a formater |
| `currency` | `CurrencyCode` | Oui | Code devise |

**Retour :** `string` — Montant avec symbole (ex: "$ 150.50")

### 4.2 Formatage des dates

#### `formatDate(date: string | Date, locale?: string, options?: Intl.DateTimeFormatOptions): string`

Formate une date selon la locale et les options specifiees.

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `date` | `string \| Date` | Oui | Date a formater (ISO 8601 ou objet Date) |
| `locale` | `string` | Non | Locale BCP 47 (defaut: locale courante) |
| `options` | `Intl.DateTimeFormatOptions` | Non | Options de formatage personnalisees |

**Retour :** `string` — Date formatee

**Exemples :**

```typescript
formatDate('2025-06-15', 'fr-FR');           // "15/06/2025"
formatDate('2025-06-15', 'en-US');           // "6/15/2025"
formatDate(new Date(), 'fr-FR', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}); // "dimanche 15 juin 2025"
```

#### `formatRelativeDate(date: string | Date, locale?: string): string`

Retourne une date relative (ex: "il y a 2 jours", "dans 3 heures").

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `date` | `string \| Date` | Oui | Date de reference |
| `locale` | `string` | Non | Locale BCP 47 (defaut: locale courante) |

**Retour :** `string` — Date relative formatee

### 4.3 Calculs temporels

#### `daysUntil(date: string | Date): number`

Calcule le nombre de jours restants jusqu'a une date donnee.

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `date` | `string \| Date` | Oui | Date cible |

**Retour :** `number` — Nombre de jours (negatif si la date est passee)

**Exemples :**

```typescript
daysUntil('2025-12-31');  // 198 (si on est le 15 juin)
daysUntil('2025-01-01');  // -165 (date passee)
daysUntil(new Date());    // 0 (aujourd'hui)
```

#### `isOverdue(date: string | Date): boolean`

Verifie si une date est depassee.

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `date` | `string \| Date` | Oui | Date a verifier |

**Retour :** `boolean` — `true` si la date est dans le passe

### 4.4 Statuts des dettes

#### `getDebtStatusLabel(status: DebtStatus, locale?: string): string`

Retourne le libelle traduit d'un statut de dette.

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `status` | `DebtStatus` | Oui | Statut (`active`, `paid_off`, `overdue`, `defaulted`) |
| `locale` | `string` | Non | Locale BCP 47 (defaut: locale courante) |

**Retour :** `string` — Libelle traduit

| Statut | EN | FR | ES |
|--------|----|----|-----|
| `active` | "Active" | "Active" | "Activa" |
| `paid_off` | "Paid Off" | "Remboursee" | "Pagada" |
| `overdue` | "Overdue" | "En retard" | "Vencida" |
| `defaulted` | "Defaulted" | "Defaut de paiement" | "Incumplimiento" |

#### `getDebtStatusColor(status: DebtStatus): string`

Retourne la couleur associee a un statut de dette pour l'affichage UI.

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `status` | `DebtStatus` | Oui | Statut de la dette |

**Retour :** `string` — Classe Tailwind CSS de couleur

| Statut | Couleur |
|--------|---------|
| `active` | `text-blue-500` |
| `paid_off` | `text-green-500` |
| `overdue` | `text-orange-500` |
| `defaulted` | `text-red-500` |

### 4.5 Calculs financiers

#### `calculatePercentage(current: number, total: number): number`

Calcule un pourcentage avec protection contre la division par zero.

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `current` | `number` | Oui | Valeur actuelle |
| `total` | `number` | Oui | Valeur totale |

**Retour :** `number` — Pourcentage arrondi a 2 decimales (0-100)

#### `calculateMonthlyInterest(principal: number, annualRate: number): number`

Calcule les interets mensuels sur un capital.

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `principal` | `number` | Oui | Capital initial |
| `annualRate` | `number` | Oui | Taux annuel en pourcentage (ex: 5.5 pour 5.5%) |

**Retour :** `number` — Montant des interets mensuels

#### `calculateRemainingBalance(principal: number, payments: DebtPayment[]): number`

Calcule le solde restant d'une dette apres les paiements.

| Parametre | Type | Requis | Description |
|-----------|------|--------|-------------|
| `principal` | `number` | Oui | Capital initial |
| `payments` | `DebtPayment[]` | Oui | Liste des paiements effectues |

**Retour :** `number` — Solde restant (jamais negatif)

---

## 5. API de donnees mock

Toutes les donnees mock sont exportees depuis `src/data/saasData.ts`. En l'absence de backend, ces donnees servent de source de verite pour le developpement et les demonstrations.

### 5.1 Plans d'abonnement

```typescript
export const PLANS: Plan[];
```

Tableau contenant les 3 plans d'abonnement avec leurs caracteristiques completes.

| Plan | ID | Prix mensuel | Prix annuel | Remise annuelle |
|------|----|-------------|------------|-----------------|
| **Free** | `free` | $0.00 | $0.00 | — |
| **Pro** | `pro` | $9.99 | $99.90 (soit $8.33/mois) | 16% |
| **Premium** | `premium` | $19.99 | $199.90 (soit $16.67/mois) | 17% |

**Acces :**

```typescript
import { PLANS } from '@/data/saasData';

// Recuperer un plan specifique
const proPlan = PLANS.find(p => p.id === 'pro');

// Parcourir tous les plans
PLANS.forEach(plan => {
  console.log(`${plan.name}: $${plan.monthlyPrice}/mois`);
});
```

### 5.2 Transactions mock

```typescript
export const MOCK_TRANSACTIONS: Transaction[];
```

Tableau de 50+ transactions de demonstration couvrant differentes categories, montants et periodes.

```typescript
import { MOCK_TRANSACTIONS } from '@/data/saasData';

// Filtrer les transactions du mois courant
const currentMonth = new Date().toISOString().slice(0, 7);
const thisMonthTransactions = MOCK_TRANSACTIONS.filter(
  tx => tx.date.startsWith(currentMonth)
);

// Calculer le total des depenses
const totalExpenses = MOCK_TRANSACTIONS
  .filter(tx => tx.type === 'expense')
  .reduce((sum, tx) => sum + tx.amount, 0);
```

### 5.3 Categories

```typescript
export const DEFAULT_CATEGORIES: Category[];
```

Tableau des categories predefinies avec icones et couleurs associees.

| Categorie | Icone | Couleur | Type |
|-----------|-------|---------|------|
| Alimentation | `UtensilsCrossed` | `#EF4444` | expense |
| Transport | `Car` | `#F97316` | expense |
| Logement | `Home` | `#8B5CF6` | expense |
| Sante | `Heart` | `#EC4899` | expense |
| Loisirs | `Gamepad2` | `#06B6D4` | expense |
| Shopping | `ShoppingBag` | `#F59E0B` | expense |
| Revenus | `Banknote` | `#10B981` | income |
| Epargne | `PiggyBank` | `#6366F1` | income |

### 5.4 Budgets mock

```typescript
export const MOCK_BUDGETS: Budget[];
```

Tableau de budgets de demonstration avec differentes progressions.

### 5.5 Objectifs d'epargne mock

```typescript
export const MOCK_GOALS: SavingsGoal[];
```

Tableau d'objectifs d'epargne avec differents niveaux de progression.

### 5.6 Dettes mock

```typescript
export const MOCK_DEBTS: Debt[];
```

Tableau de dettes avec historique de paiements inclus.

### 5.7 Factures mock

```typescript
export const MOCK_INVOICES: Invoice[];
```

Tableau de factures de demonstration pour les abonnes.

### 5.8 Utilisateurs mock

```typescript
export const MOCK_USERS: AppUser[];
```

Tableau d'utilisateurs de test avec differents profils et abonnements.

---

## 6. Definition des routes

L'application utilise `HashRouter` de React Router v7. Toutes les routes sont definies dans le composant racine `App.tsx`.

### 6.1 Table des routes

| Route | Composant | Auth requis | Layout | Guard |
|-------|-----------|-------------|--------|-------|
| `/` | `LandingPage` | Non | Public | — |
| `/auth` | `AuthPage` | Non (public only) | Public | `PublicOnlyGuard` |
| `/pricing` | `PricingPage` | Non | Public | — |
| `/onboarding` | `OnboardingPage` | Oui | App | `AuthGuard` |
| `/dashboard` | `DashboardPage` | Oui | App | `AuthGuard` |
| `/transactions` | `TransactionsPage` | Oui | App | `AuthGuard` |
| `/budgets` | `BudgetsPage` | Oui | App | `AuthGuard` |
| `/dettes` | `DettesPage` | Oui | App | `AuthGuard` + FeatureGate |
| `/objectifs` | `ObjectifsPage` | Oui | App | `AuthGuard` |
| `/analytics` | `AnalyticsPage` | Oui | App | `AuthGuard` |
| `/checkout/:planId` | `CheckoutPage` | Oui | App | `AuthGuard` |
| `/subscription` | `SubscriptionPage` | Oui | App | `AuthGuard` |
| `/billing` | `BillingPage` | Oui | App | `AuthGuard` |
| `/settings` | `SettingsPage` | Oui | App | `AuthGuard` |
| `*` | `NotFoundPage` | Non | Public | — |

### 6.2 Parametres de routes dynamiques

| Parametre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `:planId` | `PlanTier` | Identifiant du plan pour le checkout | `/checkout/pro`, `/checkout/premium` |

### 6.3 Navigation programmatique

```typescript
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  // Navigation simple
  navigate('/dashboard');
  
  // Navigation avec etat
  navigate('/checkout/pro', { state: { interval: 'yearly' } });
  
  // Retour arriere
  navigate(-1);
  
  // Remplacement d'historique (pas de bouton retour)
  navigate('/dashboard', { replace: true });
}
```

### 6.4 Lazy loading des routes

Les routes sont chargees dynamiquement pour optimiser le bundle initial :

```typescript
import { lazy, Suspense } from 'react';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));
// ...

// Dans le router
<Route path="/dashboard" element={
  <Suspense fallback={<PageSkeleton />}>
    <DashboardPage />
  </Suspense>
} />
```

---

## 7. Feature Gates

Les Feature Gates controlent l'acces aux fonctionnalites selon le plan d'abonnement de l'utilisateur. Le systeme est extensible et centralise dans `src/hooks/useFeatureGate.ts`.

### 7.1 Matrice des fonctionnalites

| Fonctionnalite | Free | Pro | Premium | Type de limite |
|---------------|------|-----|---------|-----------------|
| **Transactions mensuelles** | 50 | Illimite | Illimite | Numerique |
| **Budgets actifs** | 3 | Illimite | Illimite | Numerique |
| **Objectifs d'epargne** | 1 | Illimite | Illimite | Numerique |
| **Dettes** | 0 | 0 | Illimite | Numerique |
| **Devises simultanees** | 1 | 2 | 3 | Numerique |
| **Export PDF** | Non | Non | Oui | Booleenne |
| **Analytics avances** | Non | Oui | Oui | Booleenne |
| **Previsions financieres** | Non | Non | Oui | Booleenne |
| **Rapports par email** | Non | Non | Oui | Booleenne |
| **Support prioritaire** | Non | Email | Chat + Email | Booleenne |
| **API d'integration** | Non | Non | Oui | Booleenne |
| **Multi-comptes** | Non | Non | Oui | Booleenne |

### 7.2 Implementation des Feature Gates

#### Composant `FeatureGate`

```typescript
interface FeatureGateProps {
  /** Cle de la fonctionnalite a verifier */
  feature: string;
  
  /** Contenu affiche si la fonctionnalite est accessible */
  children: React.ReactNode;
  
  /** Contenu affiche si la fonctionnalite est bloquee (fallback) */
  fallback?: React.ReactNode;
}

// Utilisation
<FeatureGate feature="export-pdf" fallback={<UpgradePrompt />}>  
  <ExportButton />
</FeatureGate>
```

#### Hook `useFeatureGate`

```typescript
function useFeatureGate(feature: string): {
  allowed: boolean;
  limit: number | boolean;
  requiredPlan: PlanTier;
  upgradeMessage: string;
};

// Utilisation dans un composant
const { allowed, limit } = useFeatureGate('maxBudgets');
if (!allowed) return <LockedFeature />;
```

### 7.3 Messages d'upgrade

| Fonctionnalite | Message FR | Message EN |
|---------------|-----------|-----------|
| `export-pdf` | "Passez a Premium pour exporter en PDF" | "Upgrade to Premium for PDF export" |
| `advanced-analytics` | "Passez a Pro pour les analytics avances" | "Upgrade to Pro for advanced analytics" |
| `forecasting` | "Passez a Premium pour les previsions" | "Upgrade to Premium for forecasting" |
| `maxDebts` | "Le suivi des dettes est disponible en Premium" | "Debt tracking is available on Premium" |

---

## 8. Guards de routes

Les guards de routes sont des composants qui controlent l'acces aux pages en fonction de l'etat d'authentification.

### 8.1 AuthGuard

**Fichier source :** `src/components/AuthGuard.tsx`

Bloque l'acces aux pages protegees pour les utilisateurs non authentifies.

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `children` | `React.ReactNode` | Oui | Contenu a afficher si authentifie |

**Comportement :**

| Condition | Action |
|-----------|--------|
| `isAuthenticated === true` | Rend `children` |
| `isAuthenticated === false` | Redirection vers `/auth` |
| `isLoading === true` | Affiche un skeleton loader |

**Exemple d'utilisation :**

```tsx
<Route path="/dashboard" element={
  <AuthGuard>
    <DashboardPage />
  </AuthGuard>
} />
```

### 8.2 PublicOnlyGuard

**Fichier source :** `src/components/PublicOnlyGuard.tsx`

Bloque l'acces aux pages publiques pour les utilisateurs deja authentifies.

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `children` | `React.ReactNode` | Oui | Contenu a afficher si non authentifie |

**Comportement :**

| Condition | Action |
|-----------|--------|
| `isAuthenticated === false` | Rend `children` |
| `isAuthenticated === true` | Redirection vers `/dashboard` |
| `isLoading === true` | Affiche un skeleton loader |

**Exemple d'utilisation :**

```tsx
<Route path="/auth" element={
  <PublicOnlyGuard>
    <AuthPage />
  </PublicOnlyGuard>
} />
```

### 8.3 FeatureGuard

**Fichier source :** Composant interne aux pages protegees

Bloque l'acces a des sections de page en fonction du plan d'abonnement.

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `feature` | `string` | Oui | Cle de la fonctionnalite requise |
| `children` | `React.ReactNode` | Oui | Contenu si la feature est accessible |
| `fallback` | `React.ReactNode` | Non | Contenu alternatif si bloque |

**Exemple d'utilisation :**

```tsx
<FeatureGuard feature="dettes" fallback={<PremiumPrompt />}>
  <DettesList />
</FeatureGuard>
```

---

## Annexes

### A. Types globaux

```typescript
// Alias de type pour les codes de devise
type CurrencyCode = 'USD' | 'EUR' | 'GBP';

// Alias pour les locales supportees
type SupportedLocale = 'en' | 'fr' | 'es';

// Type pour les statuts de dette
type DebtStatus = 'active' | 'paid_off' | 'overdue' | 'defaulted';

// Type pour les types de transaction
type TransactionType = 'income' | 'expense';

// Type pour les methodes d'authentification
type AuthProvider = 'email' | 'google' | 'apple' | 'microsoft';
```

### B. Erreurs personnalisees

```typescript
class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

class PaymentError extends Error {
  constructor(
    message: string,
    public code: string,
    public paymentMethodId?: string
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

class FeatureGateError extends Error {
  constructor(
    message: string,
    public feature: string,
    public requiredPlan: PlanTier
  ) {
    super(message);
    this.name = 'FeatureGateError';
  }
}
```

### C. Constantes de l'application

```typescript
// Limites par plan
const PLAN_LIMITS = {
  free: {
    maxTransactions: 50,
    maxBudgets: 3,
    maxGoals: 1,
    maxDebts: 0,
    maxCurrencies: 1,
  },
  pro: {
    maxTransactions: Infinity,
    maxBudgets: Infinity,
    maxGoals: Infinity,
    maxDebts: 0,
    maxCurrencies: 2,
  },
  premium: {
    maxTransactions: Infinity,
    maxBudgets: Infinity,
    maxGoals: Infinity,
    maxDebts: Infinity,
    maxCurrencies: 3,
  },
} as const;

// Durees de session
const SESSION_DURATION_DAYS = 7;
const INACTIVITY_TIMEOUT_MINUTES = 30;

// Seuils d'alerte budget
const BUDGET_ALERT_THRESHOLD = 0.8; // 80%
const BUDGET_CRITICAL_THRESHOLD = 0.95; // 95%
```

---

*Document genere le 17 juin 2025. Version 1.0.0.*
