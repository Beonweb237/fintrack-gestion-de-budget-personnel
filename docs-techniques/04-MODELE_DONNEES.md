# Document Technique 04 — Modele de Donnees

## Projet FinTrack SaaS

**Version:** 1.0.0
**Date:** 2025-06-10
**Auteur:** Architecte Logiciel Senior
**Statut:** Specification Technique Finale

---

## Table des Matieres

1. [Diagramme Entites-Relations](#1-diagramme-entites-relations)
2. [Definitions Completes des Types](#2-definitions-completes-des-types)
3. [Catalogue des Donnees Mock](#3-catalogue-des-donnees-mock)
4. [Matrice des Fonctionnalites par Plan](#4-matrice-des-fonctionnalites-par-plan)
5. [Diagrammes de Flux de Donnees](#5-diagrammes-de-flux-de-donnees)
6. [Alias de Types et Enums](#6-alias-de-types-et-enums)

---

## 1. Diagramme Entites-Relations

Le modele de donnees de FinTrack SaaS comprend 11 entites principales organisees autour de trois domaines metier : l'utilisateur et son abonnement, les donnees financieres, et les parametres de l'application.

### 1.1 Vue Globale des Entites

```
+=======================================================================+
|                    DIAGRAMME ENTITES-RELATIONS                         |
+=======================================================================+
|                                                                        |
|  +-------------+     +-------------+     +----------------------+     |
|  |   AppUser   |-----| Subscription|-----|       Plan           |     |
|  |             | 1:1 |             | N:1 |                      |     |
|  | - id        |<--->| - id        |<----| - id                 |     |
|  | - name      |     | - planId    |     | - name               |     |
|  | - email     |     | - status    |     | - priceMonthly       |     |
|  | - avatar    |     | - interval  |     | - priceYearly        |     |
|  | - language  |     | - periodEnd |     | - features[]         |     |
|  | - currency  |     | - cancelAt  |     | - limits             |     |
|  | - timezone  |     |   PeriodEnd |     | - popular            |     |
|  | - subscription     | - payment   |     | - color              |     |
|  | - createdAt |     |   Method    |     |                      |     |
|  +-------------+     +-------------+     +----------------------+     |
|         |                                                              |
|         | 1:N                                                          |
|         v                                                              |
|  +------------------+                                                  |
|  | PaymentMethodInfo|                                                  |
|  |                  |                                                  |
|  | - id             |                                                  |
|  | - type           |                                                  |
|  | - label          |                                                  |
|  | - last4          |                                                  |
|  | - expiryMonth    |                                                  |
|  | - expiryYear     |                                                  |
|  | - brand          |                                                  |
|  | - isDefault      |                                                  |
|  +------------------+                                                  |
|         |                                                              |
|         | 1:N (via userId implicite)                                   |
|         v                                                              |
|  +-------------+     +-------------+     +----------------------+     |
|  | Transaction |     |   Budget    |     |   SavingsGoal        |     |
|  |             |     |             |     |                      |     |
|  | - id        |     | - id        |     | - id                 |     |
|  | - date      |     | - categoryId|     | - name               |     |
|  | - description     | - month     |     | - description        |     |
|  | - amount    |     | - limit     |     | - targetAmount       |     |
|  | - category  |     | - spent     |     | - currentAmount      |     |
|  | - type      |     | - alert     |     | - deadline           |     |
|  | - payment   |     |   Threshold |     | - color              |     |
|  |   Method    |     |             |     | - icon               |     |
|  | - notes     |     |             |     | - contributions[]    |     |
|  | - createdAt |     |             |     |                      |     |
|  | - updatedAt |     |             |     |                      |     |
|  +-------------+     +-------------+     +----------------------+     |
|                                                                        |
|  +-------------+     +------------------+                             |
|  |   Category  |     |      Debt        |                             |
|  |             |     |                  |                             |
|  | - id        |     | - id             |                             |
|  | - name      |     | - personName     |                             |
|  | - type      |     | - personAvatar   |                             |
|  | - color     |     | - personContact  |                             |
|  | - icon      |     | - description    |                             |
|  | - budget    |     | - amount         |                             |
|  | - isDefault |     | - repaidAmount   |                             |
|  |             |     | - type           |                             |
|  |             |     | - status         |                             |
|  |             |     | - dueDate        |                             |
|  |             |     | - payments[]     |                             |
|  |             |     | - note           |                             |
|  |             |     | - reminderEnabled|                             |
|  +-------------+     +------------------+                             |
|                              |                                         |
|                              | 1:N                                      |
|                              v                                         |
|                       +-------------+                                  |
|                       | DebtPayment |                                  |
|                       |             |                                  |
|                       | - id        |                                  |
|                       | - debtId    |                                  |
|                       | - amount    |                                  |
|                       | - date      |                                  |
|                       | - note      |                                  |
|                       | - createdAt |                                  |
|                       +-------------+                                  |
|                                                                        |
|  +-------------+     +------------------+                             |
|  |   Invoice   |     |  MonthlyData     |                             |
|  |             |     |  (analytics)     |                             |
|  | - id        |     |                  |                             |
|  | - subscriptionId  | - month          |                             |
|  | - amount    |     | - income         |                             |
|  | - currency  |     | - expense        |                             |
|  | - status    |     | - savings        |                             |
|  | - paidAt    |     |                  |                             |
|  | - period    |     |                  |                             |
|  |   Start/End |     |                  |                             |
|  | - payment   |     |                  |                             |
|  |   Method    |     |                  |                             |
|  | - description     |                  |                             |
|  | - createdAt |     |                  |                             |
|  +-------------+     +------------------+                             |
|                                                                        |
+=======================================================================+
```

### 1.2 Relations entre Entites

| Entite Source | Relation | Entite Cible | Cardinalite | Description |
|---------------|----------|-------------|-------------|-------------|
| AppUser | possede | Subscription | 1:1 | Un utilisateur a un abonnement actif |
| Subscription | reference | Plan | N:1 | Plusieurs souscriptions peuvent pointer vers un meme plan |
| AppUser | possede | PaymentMethodInfo | 1:N | Un utilisateur peut avoir plusieurs methodes de paiement |
| AppUser | enregistre | Transaction | 1:N | Un utilisateur a plusieurs transactions |
| AppUser | definit | Budget | 1:N | Un utilisateur definit plusieurs budgets |
| AppUser | fixe | SavingsGoal | 1:N | Un utilisateur a plusieurs objectifs d'epargne |
| AppUser | suit | Debt | 1:N | Un utilisateur suit plusieurs dettes |
| Debt | contient | DebtPayment | 1:N | Une dette a plusieurs paiements associes |
| Transaction | reference | Category | N:1 | Une transaction appartient a une categorie |
| Budget | reference | Category | N:1 | Un budget est lie a une categorie |
| Subscription | genere | Invoice | 1:N | Un abonnement genere plusieurs factures |

---

## 2. Definitions Completes des Types

Toutes les interfaces TypeScript sont definies dans `src/types/saas.ts`. Ce fichier constitue le contrat unique de verite pour toute l'application.

### 2.1 AppUser — Utilisateur

```typescript
interface AppUser {
  /** Identifiant unique (UUID v4) */
  id: string;
  
  /** Nom complet de l'utilisateur */
  name: string;
  
  /** Adresse email (identifiant de connexion) */
  email: string;
  
  /** URL de l'avatar ou identifiant de couleur genere */
  avatar: string;
  
  /** Langue preferee de l'interface */
  language: Language;        // 'fr' | 'en' | 'es'
  
  /** Devise de reference pour les montants */
  currency: Currency;        // 'EUR' | 'USD' | 'GBP' | 'XOF' | 'CAD'
  
  /** Fuseau horaire pour les dates */
  timezone: string;          // ex: 'Europe/Paris', 'America/New_York'
  
  /** Informations d'abonnement (denormalise pour acces rapide) */
  subscription: {
    planId: PlanTier;        // 'free' | 'pro' | 'premium'
    status: SubscriptionStatus;
    currentPeriodEnd: string; // ISO 8601 date string
  };
  
  /** Date de creation du compte */
  createdAt: string;         // ISO 8601 date string
}
```

### 2.2 Plan — Plan d'Abonnement

```typescript
interface Plan {
  /** Identifiant du tier */
  id: PlanTier;              // 'free' | 'pro' | 'premium'
  
  /** Nom d'affichage */
  name: string;              // ex: "Gratuit", "Pro", "Premium"
  
  /** Description marketing courte */
  description: string;
  
  /** Prix mensuel en euros */
  priceMonthly: number;      // ex: 0, 9.99, 19.99
  
  /** Prix annuel en euros (avec remise) */
  priceYearly: number;       // ex: 0, 95.90, 191.90
  
  /** Liste des fonctionnalites incluses (cles de traduction) */
  features: string[];        // ex: ['feature.basic_dashboard', ...]
  
  /** Limites numeriques par fonctionnalite */
  limits: {
    transactions?: number;   // Nombre max de transactions
    budgets?: number;        // Nombre max de budgets
    goals?: number;          // Nombre max d'objectifs
    debts?: number;          // Nombre max de dettes
    categories?: number;     // Nombre max de categories perso
    accounts?: number;       // Nombre max de comptes
    historyMonths?: number;  // Historique accessible en mois
    exports?: string[];      // Types d'export disponibles
  };
  
  /** Plan populaire (badge "Plus populaire") */
  popular: boolean;
  
  /** Couleur thematique du plan */
  color: string;             // ex: '#94A3B8', '#D4A43D', '#7C3AED'
}
```

### 2.3 Subscription — Abonnement Actif

```typescript
interface Subscription {
  /** Identifiant unique de l'abonnement */
  id: string;
  
  /** Reference vers le plan */
  planId: PlanTier;
  
  /** Intervalle de facturation */
  interval: PlanInterval;    // 'monthly' | 'yearly'
  
  /** Statut actuel */
  status: SubscriptionStatus;
  // 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'trialing'
  
  /** Debut de la periode actuelle */
  currentPeriodStart: string;  // ISO 8601
  
  /** Fin de la periode actuelle */
  currentPeriodEnd: string;    // ISO 8601
  
  /** Annulation programmee en fin de periode */
  cancelAtPeriodEnd: boolean;
  
  /** Methode de paiement par defaut */
  paymentMethod: PaymentMethodInfo | null;
  
  /** Date de creation de l'abonnement */
  createdAt: string;           // ISO 8601
}
```

### 2.4 Invoice — Facture

```typescript
interface Invoice {
  /** Identifiant unique de la facture */
  id: string;
  
  /** Reference vers l'abonnement */
  subscriptionId: string;
  
  /** Montant facture */
  amount: number;
  
  /** Devise de la facture */
  currency: Currency;
  
  /** Statut de paiement */
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  
  /** Date de paiement (null si en attente) */
  paidAt: string | null;       // ISO 8601
  
  /** Debut de la periode couverte */
  periodStart: string;         // ISO 8601
  
  /** Fin de la periode couverte */
  periodEnd: string;           // ISO 8601
  
  /** Methode de paiement utilisee */
  paymentMethod: PaymentMethod;
  // 'card' | 'crypto' | 'mobile_money' | 'bank_transfer'
  
  /** Description de la facture */
  description: string;
  
  /** Date d'emission */
  createdAt: string;           // ISO 8601
}
```

### 2.5 PaymentMethodInfo — Methode de Paiement

```typescript
interface PaymentMethodInfo {
  /** Identifiant unique */
  id: string;
  
  /** Type de methode */
  type: PaymentMethod;
  
  /** Libelle d'affichage */
  label: string;               // ex: "Carte Visa finissant par 4242"
  
  /** 4 derniers chiffres (carte uniquement) */
  last4: string;               // ex: "4242"
  
  /** Mois d'expiration (carte uniquement) */
  expiryMonth: number | null;  // 1-12
  
  /** Annee d'expiration (carte uniquement) */
  expiryYear: number | null;   // ex: 2026
  
  /** Marque de la carte */
  brand: string | null;        // 'visa' | 'mastercard' | 'amex' | null
  
  /** Methode par defaut */
  isDefault: boolean;
}
```

### 2.6 Transaction — Operation Financiere

```typescript
interface Transaction {
  /** Identifiant unique */
  id: string;
  
  /** Date de la transaction */
  date: string;                // ISO 8601 (YYYY-MM-DD)
  
  /** Description de l'operation */
  description: string;
  
  /** Montant de la transaction */
  amount: number;              // Positif = revenu, Negatif = depense
  
  /** Categorie de la transaction */
  category: string;            // Reference vers Category.id
  
  /** Type d'operation */
  type: 'income' | 'expense';
  
  /** Methode de paiement */
  paymentMethod: string;       // ex: 'Carte bancaire', 'Virement', 'Espèces'
  
  /** Notes personnelles */
  notes: string;
  
  /** Date de creation de l'enregistrement */
  createdAt: string;           // ISO 8601
  
  /** Date de derniere modification */
  updatedAt: string;           // ISO 8601
}
```

### 2.7 Category — Categorie de Transaction

```typescript
interface Category {
  /** Identifiant unique */
  id: string;
  
  /** Nom de la categorie */
  name: string;                // ex: 'Alimentation', 'Transport', 'Santé'
  
  /** Type de categorie */
  type: 'income' | 'expense';
  
  /** Couleur associee (hex) */
  color: string;               // ex: '#EF4444', '#10B981'
  
  /** Nom de l'icone Lucide */
  icon: string;                // ex: 'ShoppingCart', 'Car', 'Heart'
  
  /** Budget mensuel alloue (optionnel) */
  budget: number | null;
  
  /** Categorie predefinie (non supprimable) */
  isDefault: boolean;
}
```

### 2.8 Budget — Budget Mensuel

```typescript
interface Budget {
  /** Identifiant unique */
  id: string;
  
  /** Reference vers la categorie */
  categoryId: string;
  
  /** Mois concerne (format YYYY-MM) */
  month: string;               // ex: '2025-06'
  
  /** Limite budgetaire */
  limit: number;
  
  /** Montant depense dans ce budget */
  spent: number;
  
  /** Seuil d'alerte (pourcentage) */
  alertThreshold: number;      // ex: 0.8 pour 80%
}
```

### 2.9 SavingsGoal — Objectif d'Epargne

```typescript
interface SavingsGoal {
  /** Identifiant unique */
  id: string;
  
  /** Nom de l'objectif */
  name: string;                // ex: 'Voyage au Japon', 'Nouvelle voiture'
  
  /** Description detaillee */
  description: string;
  
  /** Montant cible */
  targetAmount: number;
  
  /** Montant actuellement epargne */
  currentAmount: number;
  
  /** Date butoir */
  deadline: string;            // ISO 8601 (YYYY-MM-DD)
  
  /** Couleur thematique */
  color: string;               // ex: '#D4A43D'
  
  /** Nom de l'icone Lucide */
  icon: string;                // ex: 'Plane', 'Car'
  
  /** Historique des contributions */
  contributions: Array<{
    id: string;
    amount: number;
    date: string;              // ISO 8601
    note: string;
  }>;
}
```

### 2.10 Debt — Dette

```typescript
interface Debt {
  /** Identifiant unique */
  id: string;
  
  /** Nom de la personne associee */
  personName: string;
  
  /** Avatar de la personne */
  personAvatar: string;        // URL ou identifiant de couleur
  
  /** Coordonnees de la personne */
  personContact: string;       // Email ou telephone
  
  /** Description de la dette */
  description: string;
  
  /** Montant total */
  amount: number;
  
  /** Montant rembourse */
  repaidAmount: number;
  
  /** Type de dette */
  type: DebtType;
  // 'lent' = J'ai prete (on me doit) | 'borrowed' = J'ai emprunte (je dois)
  
  /** Statut actuel */
  status: DebtStatus;
  // 'active' | 'settled' | 'overdue' | 'pending'
  
  /** Date d'echeance */
  dueDate: string;             // ISO 8601 (YYYY-MM-DD)
  
  /** Historique des paiements */
  payments: DebtPayment[];
  
  /** Note personnelle */
  note: string;
  
  /** Rappel active */
  reminderEnabled: boolean;
}
```

### 2.11 DebtPayment — Paiement de Dette

```typescript
interface DebtPayment {
  /** Identifiant unique */
  id: string;
  
  /** Reference vers la dette */
  debtId: string;
  
  /** Montant du paiement */
  amount: number;
  
  /** Date du paiement */
  date: string;                // ISO 8601 (YYYY-MM-DD)
  
  /** Note associee */
  note: string;
  
  /** Date de creation de l'enregistrement */
  createdAt: string;           // ISO 8601
}
```

### 2.12 MonthlyData — Donnees Mensuelles (Analytics)

```typescript
interface MonthlyData {
  /** Mois concerne (format YYYY-MM) */
  month: string;               // ex: '2025-01'
  
  /** Revenus totaux du mois */
  income: number;
  
  /** Depenses totales du mois */
  expense: number;
  
  /** Epargne du mois (income - expense si positif) */
  savings: number;
}
```

### 2.13 CategorySpend — Depenses par Categorie

```typescript
interface CategorySpend {
  /** Nom de la categorie */
  category: string;
  
  /** Montant total depense */
  amount: number;
  
  /** Pourcentage du total des depenses */
  percentage: number;
  
  /** Couleur associee */
  color: string;               // ex: '#EF4444'
}
```

### 2.14 MonthlyDebtData — Evolution Mensuelle des Dettes

```typescript
interface MonthlyDebtData {
  /** Mois concerne (format YYYY-MM) */
  month: string;               // ex: '2025-01'
  
  /** Total des dettes actives ce mois */
  totalDebt: number;
  
  /** Total rembourse ce mois */
  totalRepaid: number;
  
  /** Nombre de dettes actives */
  activeCount: number;
}
```

### 2.15 DebtPersonAnalytics — Statistiques par Personne

```typescript
interface DebtPersonAnalytics {
  /** Nom de la personne */
  personName: string;
  
  /** Nombre de transactions avec cette personne */
  transactionCount: number;
  
  /** Montant total implique */
  totalAmount: number;
  
  /** Montant rembourse */
  repaidAmount: number;
  
  /** Solde restant */
  remainingAmount: number;
  
  /** Derniere activite */
  lastActivity: string;        // ISO 8601
}
```

---

## 3. Catalogue des Donnees Mock

Toutes les donnees mock sont exportees par les modules `src/data/mockData.ts` et `src/data/saasData.ts`. Elles servent a l'initialisation de l'application et a la demonstration.

### 3.1 Plans d'Abonnement (3 Plans)

```typescript
// src/data/saasData.ts

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    description: 'Parfait pour débuter et gérer votre budget personnel.',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      'Tableau de bord basique',
      'Suivi des transactions (30 derniers jours)',
      '2 budgets mensuels',
      '1 objectif d\'épargne',
      '3 dettes suivies',
      '5 catégories personnalisées',
      'Graphiques basiques',
    ],
    limits: {
      transactions: 100,
      budgets: 2,
      goals: 1,
      debts: 3,
      categories: 5,
      accounts: 1,
      historyMonths: 1,
      exports: [],
    },
    popular: false,
    color: '#94A3B8',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pour une gestion financière avancée et sans limites.',
    priceMonthly: 9.99,
    priceYearly: 95.90,
    features: [
      'Tableau de bord avancé',
      'Transactions illimitées (1 an d\'historique)',
      '10 budgets mensuels',
      '5 objectifs d\'épargne',
      '10 dettes suivies',
      '15 catégories personnalisées',
      'Graphiques avancés',
      'Rapports mensuels par email',
      'Export CSV',
      'Multi-devises',
      'Alertes personnalisées',
      'Support email',
    ],
    limits: {
      transactions: Infinity,
      budgets: 10,
      goals: 5,
      debts: 10,
      categories: 15,
      accounts: 3,
      historyMonths: 12,
      exports: ['csv'],
    },
    popular: true,
    color: '#D4A43D',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'L\'expérience complète pour les passionnés de finance.',
    priceMonthly: 19.99,
    priceYearly: 191.90,
    features: [
      'Tout du plan Pro',
      'Historique illimité',
      'Budgets illimités',
      'Objectifs d\'épargne illimités',
      'Dettes illimitées',
      'Catégories illimitées',
      'Rapports personnalisés',
      'Projections financières',
      'Export CSV + PDF',
      'Synchronisation cloud',
      'API d\'accès',
      'Support prioritaire 24/7',
      'Thèmes personnalisés',
      'Sauvegarde automatique',
    ],
    limits: {
      transactions: Infinity,
      budgets: Infinity,
      goals: Infinity,
      debts: Infinity,
      categories: Infinity,
      accounts: Infinity,
      historyMonths: Infinity,
      exports: ['csv', 'pdf'],
    },
    popular: false,
    color: '#7C3AED',
  },
];
```

### 3.2 Dettes (8 Dettes avec 9 Paiements)

```typescript
export const mockDebts: Debt[] = [
  {
    id: 'd1',
    personName: 'Marie Dupont',
    personAvatar: 'rose',
    personContact: 'marie.dupont@email.com',
    description: 'Prêt pour achat ordinateur portable',
    amount: 1200,
    repaidAmount: 400,
    type: 'borrowed',
    status: 'active',
    dueDate: '2025-09-15',
    payments: [
      { id: 'p1', debtId: 'd1', amount: 200, date: '2025-04-10', note: 'Premier remboursement', createdAt: '2025-04-10T10:00:00Z' },
      { id: 'p2', debtId: 'd1', amount: 200, date: '2025-05-15', note: 'Deuxième remboursement', createdAt: '2025-05-15T14:30:00Z' },
    ],
    note: 'Remboursement mensuel de 200€ prévu',
    reminderEnabled: true,
  },
  {
    id: 'd2',
    personName: 'Thomas Martin',
    personAvatar: 'bleu',
    personContact: 'thomas.martin@email.com',
    description: 'Avance pour les vacances d\'été',
    amount: 500,
    repaidAmount: 500,
    type: 'lent',
    status: 'settled',
    dueDate: '2025-07-01',
    payments: [
      { id: 'p3', debtId: 'd2', amount: 300, date: '2025-05-20', note: 'Premier versement', createdAt: '2025-05-20T09:00:00Z' },
      { id: 'p4', debtId: 'd2', amount: 200, date: '2025-06-18', note: 'Solde final', createdAt: '2025-06-18T16:45:00Z' },
    ],
    note: 'Dette entièrement remboursée',
    reminderEnabled: false,
  },
  {
    id: 'd3',
    personName: 'Sophie Bernard',
    personAvatar: 'vert',
    personContact: '06 12 34 56 78',
    description: 'Partage des frais de rénovation',
    amount: 2500,
    repaidAmount: 800,
    type: 'borrowed',
    status: 'active',
    dueDate: '2025-12-31',
    payments: [
      { id: 'p5', debtId: 'd3', amount: 500, date: '2025-03-15', note: 'Acompte', createdAt: '2025-03-15T11:20:00Z' },
      { id: 'p6', debtId: 'd3', amount: 300, date: '2025-06-01', note: 'Deuxième paiement', createdAt: '2025-06-01T13:00:00Z' },
    ],
    note: 'Travaux cuisine + salle de bain',
    reminderEnabled: true,
  },
  {
    id: 'd4',
    personName: 'Lucas Petit',
    personAvatar: 'orange',
    personContact: 'lucas.petit@email.com',
    description: 'Prêt vélo électrique',
    amount: 800,
    repaidAmount: 0,
    type: 'lent',
    status: 'pending',
    dueDate: '2025-08-15',
    payments: [],
    note: 'Aucun remboursement effectué à ce jour',
    reminderEnabled: true,
  },
  {
    id: 'd5',
    personName: 'Emma Richard',
    personAvatar: 'violet',
    personContact: 'emma.richard@email.com',
    description: 'Avance pour cours de langue',
    amount: 350,
    repaidAmount: 150,
    type: 'borrowed',
    status: 'active',
    dueDate: '2025-10-01',
    payments: [
      { id: 'p7', debtId: 'd5', amount: 150, date: '2025-05-10', note: 'Premier remboursement', createdAt: '2025-05-10T08:30:00Z' },
    ],
    note: 'Cours d\'anglais intensif - 3 mois',
    reminderEnabled: false,
  },
  {
    id: 'd6',
    personName: 'Hugo Moreau',
    personAvatar: 'rouge',
    personContact: '07 98 76 54 32',
    description: 'Partage cadeau commun anniversaire',
    amount: 120,
    repaidAmount: 120,
    type: 'lent',
    status: 'settled',
    dueDate: '2025-06-01',
    payments: [
      { id: 'p8', debtId: 'd6', amount: 120, date: '2025-05-25', note: 'Remboursement complet', createdAt: '2025-05-25T19:00:00Z' },
    ],
    note: 'Cadeau pour Claire',
    reminderEnabled: false,
  },
  {
    id: 'd7',
    personName: 'Camille Roux',
    personAvatar: 'turquoise',
    personContact: 'camille.roux@email.com',
    description: 'Emprunt pour dépannage voiture',
    amount: 600,
    repaidAmount: 200,
    type: 'borrowed',
    status: 'overdue',
    dueDate: '2025-05-01',
    payments: [
      { id: 'p9', debtId: 'd7', amount: 200, date: '2025-04-20', note: 'Premier remboursement', createdAt: '2025-04-20T15:10:00Z' },
    ],
    note: 'Date d\'échéance dépassée - relance envoyée',
    reminderEnabled: true,
  },
  {
    id: 'd8',
    personName: 'Nathan Leroy',
    personAvatar: 'jaune',
    personContact: 'nathan.leroy@email.com',
    description: 'Prêt pour inscription marathon',
    amount: 180,
    repaidAmount: 0,
    type: 'lent',
    status: 'active',
    dueDate: '2025-11-30',
    payments: [],
    note: 'Inscription Berlin Marathon 2025',
    reminderEnabled: false,
  },
];
```

### 3.3 Transactions (30 Transactions reparties sur 14 Categories)

```typescript
export const mockTransactions: Transaction[] = [
  // Alimentation (5 transactions)
  { id: 't1', date: '2025-06-01', description: 'Courses hebdomadaires Carrefour', amount: -87.45, category: 'alimentation', type: 'expense', paymentMethod: 'Carte bancaire', notes: '', createdAt: '2025-06-01T10:00:00Z', updatedAt: '2025-06-01T10:00:00Z' },
  { id: 't2', date: '2025-06-05', description: 'Déjeuner restaurant', amount: -24.50, category: 'alimentation', type: 'expense', paymentMethod: 'Carte bancaire', notes: 'Avec collègues', createdAt: '2025-06-05T13:30:00Z', updatedAt: '2025-06-05T13:30:00Z' },
  { id: 't3', date: '2025-06-08', description: 'Boulangerie', amount: -6.30, category: 'alimentation', type: 'expense', paymentMethod: 'Espèces', notes: '', createdAt: '2025-06-08T08:15:00Z', updatedAt: '2025-06-08T08:15:00Z' },
  { id: 't4', date: '2025-06-10', description: 'Drive Super U', amount: -112.80, category: 'alimentation', type: 'expense', paymentMethod: 'Carte bancaire', notes: 'Courses du mois', createdAt: '2025-06-10T18:00:00Z', updatedAt: '2025-06-10T18:00:00Z' },
  { id: 't5', date: '2025-06-15', description: 'Petit déjeuner café', amount: -8.40, category: 'alimentation', type: 'expense', paymentMethod: 'Carte bancaire', notes: '', createdAt: '2025-06-15T09:30:00Z', updatedAt: '2025-06-15T09:30:00Z' },
  
  // Transport (4 transactions)
  { id: 't6', date: '2025-06-02', description: 'Pass Navigo mensuel', amount: -84.10, category: 'transport', type: 'expense', paymentMethod: 'Virement', notes: 'Abonnement Juin', createdAt: '2025-06-02T00:00:00Z', updatedAt: '2025-06-02T00:00:00Z' },
  { id: 't7', date: '2025-06-07', description: 'Essence Station Total', amount: -65.00, category: 'transport', type: 'expense', paymentMethod: 'Carte bancaire', notes: 'Plein réservoir', createdAt: '2025-06-07T11:00:00Z', updatedAt: '2025-06-07T11:00:00Z' },
  { id: 't8', date: '2025-06-12', description: 'Parking centre-ville', amount: -12.50, category: 'transport', type: 'expense', paymentMethod: 'Carte bancaire', notes: '3 heures', createdAt: '2025-06-12T14:20:00Z', updatedAt: '2025-06-12T14:20:00Z' },
  { id: 't9', date: '2025-06-14', description: 'Révision voiture', amount: -189.00, category: 'transport', type: 'expense', paymentMethod: 'Carte bancaire', notes: 'Révision des 30 000km', createdAt: '2025-06-14T10:00:00Z', updatedAt: '2025-06-14T10:00:00Z' },
  
  // Logement (3 transactions)
  { id: 't10', date: '2025-06-01', description: 'Loyer Juin', amount: -850.00, category: 'logement', type: 'expense', paymentMethod: 'Virement', notes: 'Appartement Paris', createdAt: '2025-06-01T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
  { id: 't11', date: '2025-06-05', description: 'EDF Électricité', amount: -72.30, category: 'logement', type: 'expense', paymentMethod: 'Prélèvement', notes: 'Facture mensuelle', createdAt: '2025-06-05T00:00:00Z', updatedAt: '2025-06-05T00:00:00Z' },
  { id: 't12', date: '2025-06-05', description: 'Fournisseur Internet', amount: -29.99, category: 'logement', type: 'expense', paymentMethod: 'Prélèvement', notes: 'Box fibre', createdAt: '2025-06-05T00:00:00Z', updatedAt: '2025-06-05T00:00:00Z' },
  
  // Santé (2 transactions)
  { id: 't13', date: '2025-06-03', description: 'Consultation médecin', amount: -25.00, category: 'sante', type: 'expense', paymentMethod: 'Carte bancaire', notes: 'Dr. Martin - Généraliste', createdAt: '2025-06-03T09:00:00Z', updatedAt: '2025-06-03T09:00:00Z' },
  { id: 't14', date: '2025-06-03', description: 'Pharmacie', amount: -18.75, category: 'sante', type: 'expense', paymentMethod: 'Carte bancaire', notes: 'Médicaments', createdAt: '2025-06-03T10:30:00Z', updatedAt: '2025-06-03T10:30:00Z' },
  
  // Loisirs (3 transactions)
  { id: 't15', date: '2025-06-06', description: 'Cinéma + popcorn', amount: -16.90, category: 'loisirs', type: 'expense', paymentMethod: 'Carte bancaire', notes: 'Avec amis', createdAt: '2025-06-06T20:00:00Z', updatedAt: '2025-06-06T20:00:00Z' },
  { id: 't16', date: '2025-06-08', description: 'Livre Librairie indépendante', amount: -22.50, category: 'loisirs', type: 'expense', paymentMethod: 'Carte bancaire', notes: '', createdAt: '2025-06-08T15:00:00Z', updatedAt: '2025-06-08T15:00:00Z' },
  { id: 't17', date: '2025-06-13', description: 'Concert Bercy', amount: -45.00, category: 'loisirs', type: 'expense', paymentMethod: 'Carte bancaire', notes: 'Place catégorie 2', createdAt: '2025-06-13T00:00:00Z', updatedAt: '2025-06-13T00:00:00Z' },
  
  // Shopping (3 transactions)
  { id: 't18', date: '2025-06-04', description: 'H&M - Vêtements été', amount: -67.80, category: 'shopping', type: 'expense', paymentMethod: 'Carte bancaire', notes: '2 t-shirts + 1 short', createdAt: '2025-06-04T14:00:00Z', updatedAt: '2025-06-04T14:00:00Z' },
  { id: 't19', date: '2025-06-09', description: 'Amazon - Accessoires', amount: -34.99, category: 'shopping', type: 'expense', paymentMethod: 'Carte bancaire', notes: '', createdAt: '2025-06-09T11:00:00Z', updatedAt: '2025-06-09T11:00:00Z' },
  { id: 't20', date: '2025-06-16', description: 'Zara - Robe', amount: -49.95, category: 'shopping', type: 'expense', paymentMethod: 'Carte bancaire', notes: '', createdAt: '2025-06-16T16:30:00Z', updatedAt: '2025-06-16T16:30:00Z' },
  
  // Factures (3 transactions)
  { id: 't21', date: '2025-06-01', description: 'Forfait mobile', amount: -19.99, category: 'factures', type: 'expense', paymentMethod: 'Prélèvement', notes: 'Free 200Go', createdAt: '2025-06-01T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
  { id: 't22', date: '2025-06-01', description: 'Assurance habitation', amount: -32.50, category: 'factures', type: 'expense', paymentMethod: 'Prélèvement', notes: 'MAIF', createdAt: '2025-06-01T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
  { id: 't23', date: '2025-06-01', description: 'Netflix', amount: -13.49, category: 'factures', type: 'expense', paymentMethod: 'Carte bancaire', notes: 'Abonnement Standard', createdAt: '2025-06-01T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
  
  // Éducation (1 transaction)
  { id: 't24', date: '2025-06-02', description: 'Cours en ligne Udemy', amount: -14.99, category: 'education', type: 'expense', paymentMethod: 'Carte bancaire', notes: 'React Avancé', createdAt: '2025-06-02T20:00:00Z', updatedAt: '2025-06-02T20:00:00Z' },
  
  // Cadeaux (1 transaction)
  { id: 't25', date: '2025-06-18', description: 'Cadeau anniversaire maman', amount: -55.00, category: 'cadeaux', type: 'expense', paymentMethod: 'Carte bancaire', notes: '', createdAt: '2025-06-18T12:00:00Z', updatedAt: '2025-06-18T12:00:00Z' },
  
  // Revenus (5 transactions)
  { id: 't26', date: '2025-06-01', description: 'Salaire Juin', amount: 2850.00, category: 'revenus', type: 'income', paymentMethod: 'Virement', notes: 'Net après charges', createdAt: '2025-06-01T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
  { id: 't27', date: '2025-06-05', description: 'Freelance - Projet web', amount: 450.00, category: 'revenus', type: 'income', paymentMethod: 'Virement', notes: 'Client ABC Corp', createdAt: '2025-06-05T09:00:00Z', updatedAt: '2025-06-05T09:00:00Z' },
  { id: 't28', date: '2025-06-10', description: 'Remboursement mutuelle', amount: 45.00, category: 'revenus', type: 'income', paymentMethod: 'Virement', notes: 'Consultation avril', createdAt: '2025-06-10T00:00:00Z', updatedAt: '2025-06-10T00:00:00Z' },
  { id: 't29', date: '2025-06-15', description: 'Vente occasion Leboncoin', amount: 80.00, category: 'revenus', type: 'income', paymentMethod: 'Virement', notes: 'Vélo ancien', createdAt: '2025-06-15T18:00:00Z', updatedAt: '2025-06-15T18:00:00Z' },
  { id: 't30', date: '2025-06-20', description: 'Intérêts livret A', amount: 12.35, category: 'revenus', type: 'income', paymentMethod: 'Virement', notes: '', createdAt: '2025-06-20T00:00:00Z', updatedAt: '2025-06-20T00:00:00Z' },
];
```

### 3.4 Categories (14 Categories)

```typescript
export const mockCategories: Category[] = [
  { id: 'alimentation', name: 'Alimentation', type: 'expense', color: '#EF4444', icon: 'UtensilsCrossed', budget: 400, isDefault: true },
  { id: 'transport', name: 'Transport', type: 'expense', color: '#3B82F6', icon: 'Car', budget: 350, isDefault: true },
  { id: 'logement', name: 'Logement', type: 'expense', color: '#8B5CF6', icon: 'Home', budget: 1000, isDefault: true },
  { id: 'sante', name: 'Santé', type: 'expense', color: '#EC4899', icon: 'Heart', budget: 100, isDefault: true },
  { id: 'loisirs', name: 'Loisirs', type: 'expense', color: '#F59E0B', icon: 'Gamepad2', budget: 150, isDefault: true },
  { id: 'shopping', name: 'Shopping', type: 'expense', color: '#10B981', icon: 'ShoppingBag', budget: 200, isDefault: true },
  { id: 'factures', name: 'Factures', type: 'expense', color: '#6B7280', icon: 'Receipt', budget: 150, isDefault: true },
  { id: 'education', name: 'Éducation', type: 'expense', color: '#06B6D4', icon: 'GraduationCap', budget: 100, isDefault: true },
  { id: 'cadeaux', name: 'Cadeaux', type: 'expense', color: '#F43F5E', icon: 'Gift', budget: 80, isDefault: true },
  { id: 'epargne', name: 'Épargne', type: 'expense', color: '#14B8A6', icon: 'PiggyBank', budget: 300, isDefault: true },
  { id: 'voyages', name: 'Voyages', type: 'expense', color: '#6366F1', icon: 'Plane', budget: 0, isDefault: true },
  { id: 'animaux', name: 'Animaux', type: 'expense', color: '#D97706', icon: 'PawPrint', budget: 50, isDefault: true },
  { id: 'revenus', name: 'Revenus', type: 'income', color: '#22C55E', icon: 'TrendingUp', budget: null, isDefault: true },
  { id: 'autres', name: 'Autres', type: 'expense', color: '#78716C', icon: 'MoreHorizontal', budget: 0, isDefault: true },
];
```

### 3.5 Budgets (10 Budgets)

```typescript
export const mockBudgets: Budget[] = [
  { id: 'b1', categoryId: 'alimentation', month: '2025-06', limit: 400, spent: 229.45, alertThreshold: 0.8 },
  { id: 'b2', categoryId: 'transport', month: '2025-06', limit: 350, spent: 350.60, alertThreshold: 0.75 },
  { id: 'b3', categoryId: 'logement', month: '2025-06', limit: 1000, spent: 952.29, alertThreshold: 0.9 },
  { id: 'b4', categoryId: 'sante', month: '2025-06', limit: 100, spent: 43.75, alertThreshold: 0.8 },
  { id: 'b5', categoryId: 'loisirs', month: '2025-06', limit: 150, spent: 84.40, alertThreshold: 0.8 },
  { id: 'b6', categoryId: 'shopping', month: '2025-06', limit: 200, spent: 152.74, alertThreshold: 0.85 },
  { id: 'b7', categoryId: 'factures', month: '2025-06', limit: 150, spent: 65.98, alertThreshold: 0.9 },
  { id: 'b8', categoryId: 'education', month: '2025-06', limit: 100, spent: 14.99, alertThreshold: 0.8 },
  { id: 'b9', categoryId: 'cadeaux', month: '2025-06', limit: 80, spent: 55.00, alertThreshold: 0.75 },
  { id: 'b10', categoryId: 'epargne', month: '2025-06', limit: 300, spent: 200.00, alertThreshold: 1.0 },
];
```

### 3.6 Objectifs d'Epargne (5 Objectifs)

```typescript
export const mockGoals: SavingsGoal[] = [
  {
    id: 'g1',
    name: 'Voyage au Japon',
    description: 'Séjour de 2 semaines à Tokyo, Kyoto et Osaka',
    targetAmount: 5000,
    currentAmount: 3200,
    deadline: '2026-03-15',
    color: '#D4A43D',
    icon: 'Plane',
    contributions: [
      { id: 'c1', amount: 1000, date: '2025-01-15', note: 'Versement initial' },
      { id: 'c2', amount: 800, date: '2025-02-15', note: 'Économies février' },
      { id: 'c3', amount: 700, date: '2025-03-15', note: 'Prime annuelle' },
      { id: 'c4', amount: 700, date: '2025-04-15', note: 'Économies avril' },
    ],
  },
  {
    id: 'g2',
    name: 'Nouveau MacBook Pro',
    description: 'MacBook Pro 14" M4 pour le développement',
    targetAmount: 2500,
    currentAmount: 1800,
    deadline: '2025-09-01',
    color: '#6366F1',
    icon: 'Laptop',
    contributions: [
      { id: 'c5', amount: 500, date: '2025-03-01', note: 'Début épargne' },
      { id: 'c6', amount: 500, date: '2025-04-01', note: 'Mars-avril' },
      { id: 'c7', amount: 400, date: '2025-05-01', note: 'Mai' },
      { id: 'c8', amount: 400, date: '2025-06-01', note: 'Juin' },
    ],
  },
  {
    id: 'g3',
    name: 'Fonds d\'urgence',
    description: 'Épargne de précaution - 3 mois de charges',
    targetAmount: 8000,
    currentAmount: 5500,
    deadline: '2025-12-31',
    color: '#10B981',
    icon: 'Shield',
    contributions: [
      { id: 'c9', amount: 2000, date: '2025-01-01', note: 'Transfert initial' },
      { id: 'c10', amount: 1500, date: '2025-03-01', note: 'Trimestre 1' },
      { id: 'c11', amount: 1000, date: '2025-05-01', note: 'Trimestre 2' },
      { id: 'c12', amount: 1000, date: '2025-06-01', note: 'Complément' },
    ],
  },
  {
    id: 'g4',
    name: 'Vélo électrique',
    description: 'VAE pour trajets domicile-travail',
    targetAmount: 1800,
    currentAmount: 1200,
    deadline: '2025-08-15',
    color: '#F59E0B',
    icon: 'Bike',
    contributions: [
      { id: 'c13', amount: 400, date: '2025-04-01', note: 'Début' },
      { id: 'c14', amount: 400, date: '2025-05-01', note: 'Mai' },
      { id: 'c15', amount: 400, date: '2025-06-01', note: 'Juin' },
    ],
  },
  {
    id: 'g5',
    name: 'Cours de piano',
    description: 'Année de cours + achat piano numérique',
    targetAmount: 3000,
    currentAmount: 900,
    deadline: '2026-01-15',
    color: '#EC4899',
    icon: 'Music',
    contributions: [
      { id: 'c16', amount: 300, date: '2025-04-15', note: 'Cours avril-juin' },
      { id: 'c17', amount: 300, date: '2025-05-15', note: 'Acompte piano' },
      { id: 'c18', amount: 300, date: '2025-06-15', note: 'Économies' },
    ],
  },
];
```

### 3.7 Donnees Mensuelles d'Analytics (12 Mois)

```typescript
export const mockMonthlyData: MonthlyData[] = [
  { month: '2024-07', income: 2800, expense: 2450, savings: 350 },
  { month: '2024-08', income: 2950, expense: 2600, savings: 350 },
  { month: '2024-09', income: 2800, expense: 2380, savings: 420 },
  { month: '2024-10', income: 3100, expense: 2750, savings: 350 },
  { month: '2024-11', income: 2800, expense: 2900, savings: -100 },
  { month: '2024-12', income: 3500, expense: 3200, savings: 300 },
  { month: '2025-01', income: 2850, expense: 2400, savings: 450 },
  { month: '2025-02', income: 3300, expense: 2550, savings: 750 },
  { month: '2025-03', income: 2850, expense: 2300, savings: 550 },
  { month: '2025-04', income: 3400, expense: 2800, savings: 600 },
  { month: '2025-05', income: 2850, expense: 2480, savings: 370 },
  { month: '2025-06', income: 3437.35, expense: 2431.81, savings: 1005.54 },
];
```

### 3.8 Factures (5 Factures)

```typescript
export const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    subscriptionId: 'sub1',
    amount: 9.99,
    currency: 'EUR',
    status: 'paid',
    paidAt: '2025-06-01T00:00:00Z',
    periodStart: '2025-06-01',
    periodEnd: '2025-06-30',
    paymentMethod: 'card',
    description: 'FinTrack Pro - Juin 2025',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 'inv2',
    subscriptionId: 'sub1',
    amount: 9.99,
    currency: 'EUR',
    status: 'paid',
    paidAt: '2025-05-01T00:00:00Z',
    periodStart: '2025-05-01',
    periodEnd: '2025-05-31',
    paymentMethod: 'card',
    description: 'FinTrack Pro - Mai 2025',
    createdAt: '2025-05-01T00:00:00Z',
  },
  {
    id: 'inv3',
    subscriptionId: 'sub1',
    amount: 9.99,
    currency: 'EUR',
    status: 'paid',
    paidAt: '2025-04-01T00:00:00Z',
    periodStart: '2025-04-01',
    periodEnd: '2025-04-30',
    paymentMethod: 'card',
    description: 'FinTrack Pro - Avril 2025',
    createdAt: '2025-04-01T00:00:00Z',
  },
  {
    id: 'inv4',
    subscriptionId: 'sub1',
    amount: 9.99,
    currency: 'EUR',
    status: 'paid',
    paidAt: '2025-03-01T00:00:00Z',
    periodStart: '2025-03-01',
    periodEnd: '2025-03-31',
    paymentMethod: 'card',
    description: 'FinTrack Pro - Mars 2025',
    createdAt: '2025-03-01T00:00:00Z',
  },
  {
    id: 'inv5',
    subscriptionId: 'sub1',
    amount: 95.90,
    currency: 'EUR',
    status: 'paid',
    paidAt: '2025-01-01T00:00:00Z',
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    paymentMethod: 'card',
    description: 'FinTrack Pro - Annuel 2025',
    createdAt: '2025-01-01T00:00:00Z',
  },
];
```

### 3.9 Methodes de Paiement (3 Methodes)

```typescript
export const mockPaymentMethods: PaymentMethodInfo[] = [
  {
    id: 'pm1',
    type: 'card',
    label: 'Carte Visa finissant par 4242',
    last4: '4242',
    expiryMonth: 8,
    expiryYear: 2027,
    brand: 'visa',
    isDefault: true,
  },
  {
    id: 'pm2',
    type: 'card',
    label: 'Carte Mastercard finissant par 8888',
    last4: '8888',
    expiryMonth: 12,
    expiryYear: 2026,
    brand: 'mastercard',
    isDefault: false,
  },
  {
    id: 'pm3',
    type: 'mobile_money',
    label: 'Orange Money (+33612345678)',
    last4: '5678',
    expiryMonth: null,
    expiryYear: null,
    brand: null,
    isDefault: false,
  },
];
```

---

## 4. Matrice des Fonctionnalites par Plan

La matrice suivante etablit la correspondance complete entre les trois plans d'abonnement et l'ensemble des fonctionnalites de l'application. Cette matrice est le referentiel pour le systeme de feature gating.

```
+===========================================================================+
|                    MATRICE FONCTIONNALITES × PLANS                         |
+===========================================================================+
| # | Fonctionnalite                      | Free    | Pro      | Premium  |
+===========================================================================+
| 1 | Tableau de bord basique             |    ✓    |    ✓     |    ✓     |
| 2 | Transactions - ajout                |    ✓    |    ✓     |    ✓     |
| 3 | Transactions - historique           |  30j    |   1 an   | Illimité |
| 4 | Categories personnalisees           |   5     |   15     | Illimité |
| 5 | Budgets mensuels                    |   2     |   10     | Illimité |
| 6 | Alertes budget (seuil configurable) |    ✓    |    ✓     |    ✓     |
| 7 | Suivi des dettes                    |   3     |   10     | Illimité |
| 8 | Objectifs d'epargne                 |   1     |    5     | Illimité |
| 9 | Graphiques basiques (camembert, barres) | ✓  |    ✓     |    ✓     |
| 10| Graphiques avances (tendances, comparaisons) | ✗ | ✓  |    ✓     |
| 11| Export CSV                          |    ✗    |    ✓     |    ✓     |
| 12| Export PDF                          |    ✗    |    ✗     |    ✓     |
| 13| Rapports mensuels automatiques      |    ✗    |    ✓     |    ✓     |
| 14| Rapports personnalises              |    ✗    |    ✗     |    ✓     |
| 15| Projections financieres             |    ✗    |    ✗     |    ✓     |
| 16| Multi-devises (EUR/USD/GBP/XOF)     |    ✗    |    ✓     |    ✓     |
| 17| Synchronisation cloud               |    ✗    |    ✗     |    ✓     |
| 18| Acces API                           |    ✗    |    ✗     |    ✓     |
| 19| Support par email                   |    ✗    |    ✓     |    ✓     |
| 20| Support prioritaire 24/7            |    ✗    |    ✗     |    ✓     |
| 21| Comptes multiples                   |   1     |    3     | Illimité |
| 22| Alertes personnalisees              |    ✗    |    ✓     |    ✓     |
| 23| Historique complet illimite         |    ✗    |    ✗     |    ✓     |
| 24| Themes personnalises                |    ✗    |    ✗     |    ✓     |
| 25| Sauvegarde automatique              |    ✗    |    ✗     |    ✓     |
+===========================================================================+
```

### 4.1 Detail des Limites Numeriques

| Ressource | Free | Pro | Premium |
|-----------|------|-----|---------|
| Transactions (historique) | 30 jours | 12 mois | ∞ |
| Categories personalisees | 5 | 15 | ∞ |
| Budgets actifs | 2 | 10 | ∞ |
| Objectifs d'epargne | 1 | 5 | ∞ |
| Dettes suivies | 3 | 10 | ∞ |
| Comptes financiers | 1 | 3 | ∞ |
| Types d'export | — | CSV | CSV + PDF |

### 4.2 Codage des Limites dans le Systeme

Les limites sont codées en dur dans les objets `Plan` du fichier `saasData.ts`. Le hook `useFeatureGate` consulte ces limites a chaque verification d'acces.

```typescript
// Extraction des limites pour verification
const plan = plans.find(p => p.id === currentPlanId);
const limit = plan?.limits[featureKey];  // ex: plan.limits.budgets → 10
const currentUsage = getCurrentUsage(featureKey);  // ex: 7 budgets actifs
const allowed = limit === Infinity || currentUsage < limit;
```

---

## 5. Diagrammes de Flux de Donnees

### 5.1 Flux Global Donnees — Contexts, Pages, localStorage

```
+=======================================================================+
|                    FLUX DE DONNEES GLOBAL                              |
+=======================================================================+
|                                                                        |
|   INITIALISATION (main.tsx)                                            |
|   -------------------------                                            |
|                                                                        |
|   localStorage ──lit──> AuthContext ──fournit──> App.tsx              |
|        |                      |                       |                |
|        |                      v                       v                |
|        |               SubscriptionContext      Router (HashRouter)    |
|        |                      |                       |                |
|        |                      v                       v                |
|        |               Guards (Auth/Public)     Composants Page        |
|        |                      |                       |                |
|        |                      v                       v                |
|        |               FeatureGate (hook)        Composants UI         |
|        |                      |                       |                |
|        |                      v                       v                |
|        +───────────persist──────────<────actions──────┘                |
|                                                                        |
+=======================================================================+
```

### 5.2 Flux de Persistance — Cycle CRUD

```
+=======================================================================+
|                    CYCLE CRUD — EXEMPLE: TRANSACTIONS                  |
+=======================================================================+
|                                                                        |
|   CREATE (Ajout)                                                       |
|   --------------                                                       |
|                                                                        |
|   Formulaire Transactions.tsx                                          |
|        |                                                               |
|        | dispatch addTransaction(formData)                             |
|        v                                                               |
|   Mise a jour useState local ──> UI mise a jour immediate              |
|        |                                                               |
|        | localStorage.setItem('fintrack_transactions',                 |
|        |   JSON.stringify([...transactions, newTx]))                   |
|        v                                                               |
|   Persiste dans localStorage                                           |
|        |                                                               |
|        v                                                               |
|   Toast confirmation "Transaction ajoutee"                             |
|                                                                        |
+------------------------------------------------------------------------+
|                                                                        |
|   READ (Lecture)                                                       |
|   --------------                                                       |
|                                                                        |
|   Transactions.tsx monte                                               |
|        |                                                               |
|        | useEffect(() => {                                             |
|        |   const data = localStorage.getItem('fintrack_transactions'); |
|        |   setTransactions(JSON.parse(data || '[]'));                  |
|        | }, []);                                                       |
|        v                                                               |
|   Donnees chargees dans le state local                                 |
|                                                                        |
+------------------------------------------------------------------------+
|                                                                        |
|   UPDATE (Modification)                                                |
|   ---------------------                                                |
|                                                                        |
|   Clic "Modifier" sur transaction                                      |
|        |                                                               |
|        | Ouvre Dialog avec pre-filled form                             |
|        v                                                               |
|   Soumission formulaire                                                |
|        |                                                               |
|        | const updated = transactions.map(t =>                        |
|        |   t.id === id ? { ...t, ...formData } : t                   |
|        | );                                                            |
|        | localStorage.setItem('fintrack_transactions',                 |
|        |   JSON.stringify(updated));                                   |
|        v                                                               |
|   State + localStorage synchronises                                    |
|                                                                        |
+------------------------------------------------------------------------+
|                                                                        |
|   DELETE (Suppression)                                                 |
|   --------------------                                                 |
|                                                                        |
|   Clic "Supprimer"                                                     |
|        |                                                               |
|        | AlertDialog de confirmation                                   |
|        v                                                               |
|   Confirmation                                                         |
|        |                                                               |
|        | const filtered = transactions.filter(t => t.id !== id);      |
|        | localStorage.setItem('fintrack_transactions',                 |
|        |   JSON.stringify(filtered));                                  |
|        v                                                               |
|   Entree supprimee de state + localStorage                             |
|                                                                        |
+=======================================================================+
```

### 5.3 Flux d'Authentification — Donnees

```
+=======================================================================+
|                    FLUX AUTH — CHAINAGE DES CONTEXTS                   |
+=======================================================================+
|                                                                        |
|   Etape 1: Login reussi                                                |
|   -----------------------                                              |
|                                                                        |
|   Auth.tsx                                                             |
|      |                                                                 |
|      | dispatch LOGIN { user }                                         |
|      v                                                                 |
|   AuthContext ──met a jour──> state.user = user                        |
|      |                                                                 |
|      | localStorage.setItem('fintrack_user',                           |
|      |   JSON.stringify(user))                                         |
|      v                                                                 |
|   SubscriptionContext (useEffect ecoute AuthContext)                   |
|      |                                                                 |
|      | Lit fintrack_subscription dans localStorage                     |
|      | Si existe → dispatch UPGRADE avec planId                        |
|      v                                                                 |
|   App.tsx recoit les deux contexts mis a jour                          |
|      |                                                                 |
|      | Route /dashboard rendue (AuthGuard passe)                       |
|      v                                                                 |
|   Dashboard.tsx recoit user + subscription via hooks                   |
|                                                                        |
+=======================================================================+
```

### 5.4 Flux de Feature Gating — Verification en Temps Reel

```
+=======================================================================+
|                    FLUX FEATURE GATE                                   |
+=======================================================================+
|                                                                        |
|   Budgets.tsx veut ajouter un budget                                   |
|        |                                                               |
|        | const { allowed, requiredPlan, limit, usage } =               |
|        |   useFeatureGate('budgets');                                 |
|        |                                                               |
|        v                                                               |
|   useFeatureGate.ts                                                    |
|        |                                                               |
|        | 1. Recupere currentPlan depuis SubscriptionContext           |
|        |    → ex: 'pro'                                               |
|        |                                                               |
|        | 2. Cherche la limite dans le Plan                             |
|        |    → plans.find(p => p.id === 'pro').limits.budgets          |
|        |    → 10                                                      |
|        |                                                               |
|        | 3. Compte l'usage actuel                                     |
|        |    → budgets.length = 10                                     |
|        |                                                               |
|        | 4. Compare: usage (10) >= limit (10) → REFUSE                |
|        v                                                               |
|   Retourne: { allowed: false, requiredPlan: 'premium',                |
|               limit: 10, usage: 10, currentPlan: 'pro' }              |
|        |                                                               |
|        v                                                               |
|   Budgets.tsx affiche:                                                 |
|   - Overlay de blocage OU                                              |
|   - Bouton "Passer a Premium" avec lien /checkout/premium              |
|                                                                        |
+=======================================================================+
```

---

## 6. Alias de Types et Enums

Les types enumeres sont definis comme des unions de chaines litterales TypeScript. Cette approche offre l'avantage du typage fort sans le surcout d'enums JavaScript a l'execution.

### 6.1 Definition des Types Alias

```typescript
// src/types/saas.ts

/** Tiers d'abonnement disponibles */
type PlanTier = 'free' | 'pro' | 'premium';

/** Intervalle de facturation */
type PlanInterval = 'monthly' | 'yearly';

/** Methodes de paiement acceptees */
type PaymentMethod = 'card' | 'crypto' | 'mobile_money' | 'bank_transfer';

/** Type de dette */
type DebtType = 'lent' | 'borrowed';
// 'lent' = J'ai prete de l'argent (on me doit)
// 'borrowed' = J'ai emprunte de l'argent (je dois)

/** Statut d'une dette */
type DebtStatus = 'active' | 'settled' | 'overdue' | 'pending';
// 'active' = En cours de remboursement
// 'settled' = Entierement remboursee
// 'overdue' = Echeance depassee
// 'pending' = En attente de premier paiement

/** Statut d'un abonnement */
type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'trialing';

/** Langues supportees par l'interface */
type Language = 'fr' | 'en' | 'es';

/** Devises supportees pour les montants */
type Currency = 'EUR' | 'USD' | 'GBP' | 'XOF' | 'CAD';
```

### 6.2 Table de Correspondance des Valeurs

| Type Alias | Valeurs Possibles | Description |
|------------|-------------------|-------------|
| `PlanTier` | `'free'`, `'pro'`, `'premium'` | Identifiant du plan d'abonnement |
| `PlanInterval` | `'monthly'`, `'yearly'` | Frequence de facturation |
| `PaymentMethod` | `'card'`, `'crypto'`, `'mobile_money'`, `'bank_transfer'` | Canal de paiement |
| `DebtType` | `'lent'`, `'borrowed'` | Sens de la dette (prete/emprunte) |
| `DebtStatus` | `'active'`, `'settled'`, `'overdue'`, `'pending'` | Etat du remboursement |
| `SubscriptionStatus` | `'active'`, `'cancelled'`, `'past_due'`, `'unpaid'`, `'trialing'` | Etat de l'abonnement |
| `Language` | `'fr'`, `'en'`, `'es'` | Langue de l'interface utilisateur |
| `Currency` | `'EUR'`, `'USD'`, `'GBP'`, `'XOF'`, `'CAD'` | Devise de reference |

### 6.3 Utilisation Typique dans le Code

```typescript
// Exemple d'utilisation des types dans un composant
import type { PlanTier, DebtStatus, Transaction, Currency } from '@/types/saas';

// Typage d'une fonction de filtrage
function filterTransactionsByType(
  transactions: Transaction[],
  type: 'income' | 'expense'
): Transaction[] {
  return transactions.filter(t => t.type === type);
}

// Typage d'un formatteur de devise
function formatAmount(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    XOF: 'FCFA',
    CAD: 'C$',
  };
  return `${amount.toFixed(2)} ${symbols[currency]}`;
}

// Typage d'un guard de fonctionnalite
function canAccessFeature(plan: PlanTier, feature: string): boolean {
  const matrix: Record<PlanTier, string[]> = {
    free: ['dashboard', 'basic_charts'],
    pro: ['dashboard', 'basic_charts', 'advanced_charts', 'csv_export'],
    premium: ['*'],  // Acces a tout
  };
  return matrix[plan].includes('*') || matrix[plan].includes(feature);
}
```

### 6.4 Mappages Constants

```typescript
// Mappages de labels localises pour les types enumeres
export const planTierLabels: Record<PlanTier, string> = {
  free: 'Gratuit',
  pro: 'Pro',
  premium: 'Premium',
};

export const debtTypeLabels: Record<DebtType, string> = {
  lent: 'Prêté',
  borrowed: 'Emprunté',
};

export const debtStatusLabels: Record<DebtStatus, string> = {
  active: 'Actif',
  settled: 'Soldé',
  overdue: 'En retard',
  pending: 'En attente',
};

export const subscriptionStatusLabels: Record<SubscriptionStatus, string> = {
  active: 'Actif',
  cancelled: 'Annulé',
  past_due: 'En retard',
  unpaid: 'Non payé',
  trialing: 'Période d\'essai',
};

export const languageLabels: Record<Language, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
};

export const currencySymbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  XOF: 'FCFA',
  CAD: 'C$',
};
```

---

## Annexes

### A. Resume des Entites et Attributs

| Entite | Nb Attributs | Cle Primaire | Relations |
|--------|-------------|--------------|-----------|
| AppUser | 9 | `id` (string) | 1:1 Subscription, 1:N * |
| Plan | 9 | `id` (PlanTier) | 1:N Subscription |
| Subscription | 9 | `id` (string) | N:1 Plan, 1:N Invoice |
| Invoice | 11 | `id` (string) | N:1 Subscription |
| PaymentMethodInfo | 8 | `id` (string) | N:1 AppUser (implicite) |
| Transaction | 10 | `id` (string) | N:1 Category |
| Category | 7 | `id` (string) | 1:N Transaction, 1:N Budget |
| Budget | 6 | `id` (string) | N:1 Category |
| SavingsGoal | 10 | `id` (string) | N:1 AppUser (implicite) |
| Debt | 14 | `id` (string) | 1:N DebtPayment |
| DebtPayment | 6 | `id` (string) | N:1 Debt |
| MonthlyData | 4 | — | Donnees agreees |
| CategorySpend | 4 | — | Donnees agreees |

### B. Cles localStorage

| Cle | Type Stocke | Module Responsable |
|-----|-------------|-------------------|
| `fintrack_user` | `AppUser` | AuthContext |
| `fintrack_subscription` | `Subscription` | SubscriptionContext |
| `fintrack_transactions` | `Transaction[]` | Transactions.tsx |
| `fintrack_budgets` | `Budget[]` | Budgets.tsx |
| `fintrack_goals` | `SavingsGoal[]` | Objectifs.tsx |
| `fintrack_debts` | `Debt[]` | Dettes.tsx |
| `fintrack_settings` | `Partial<AppUser>` | Settings.tsx |

### C. Fichiers Sources des Types et Donnees

| Fichier | Contenu |
|---------|---------|
| `src/types/saas.ts` | Toutes les interfaces TypeScript, types alias, types utility |
| `src/data/saasData.ts` | Plans, formatters, helpers, payment methods, invoices |
| `src/data/mockData.ts` | Transactions, budgets, categories, goals, debts, monthly data |

---

*Fin du Document 04 — Modele de Donnees*
