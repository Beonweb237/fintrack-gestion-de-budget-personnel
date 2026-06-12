// Mock Data - FinTrack Application

// Types
export interface Transaction {
  id: string; date: string; description: string; amount: number;
  category: string; type: 'income' | 'expense'; paymentMethod: 'card' | 'cash' | 'transfer' | 'check';
  notes?: string; createdAt: string; updatedAt: string;
}

export interface Category {
  id: string; name: string; type: 'income' | 'expense';
  color: string; icon: string; budget?: number; isDefault: boolean;
}

export interface Budget {
  id: string; categoryId: string; month: string;
  limit: number; spent: number; alertThreshold: number;
}

export interface SavingsGoal {
  id: string; name: string; description?: string;
  targetAmount: number; currentAmount: number; deadline?: string;
  color: string; icon: string;
  contributions: { date: string; amount: number; note?: string }[];
}

export interface MonthlyData {
  month: string; monthShort: string;
  revenus: number; depenses: number; solde: number;
}

export interface CategorySpend {
  id: string; name: string; amount: number; previousAmount: number;
  color: string; icon: string; percentage: number; evolution: number; trend: number[];
  subCategories?: { name: string; amount: number }[];
}

export interface User {
  id: string; name: string; email: string; avatar?: string; phone?: string;
  currency: 'EUR' | 'USD' | 'GBP' | 'CHF'; language: 'fr' | 'en';
  monthlyIncome?: number; createdAt: string;
}

export interface UserSession {
  id: string; device: string; os: string; browser: string;
  location: string; ip: string; lastActive: string; isCurrent: boolean;
}

export interface NotificationSetting {
  id: string; label: string; description: string;
  enabled: boolean; required?: boolean;
}

// Helpers
export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);
}

export function formatCurrencySigned(amount: number, currency = 'EUR'): string {
  const formatted = formatCurrency(Math.abs(amount), currency);
  return amount < 0 ? `- ${formatted}` : `+ ${formatted}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateFull(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(c => c.id === id);
}

export type BudgetStatus = 'healthy' | 'good' | 'warning' | 'critical' | 'overspent';

export function getBudgetStatus(spent: number, limit: number): BudgetStatus {
  const ratio = spent / limit;
  if (ratio > 1) return 'overspent';
  if (ratio > 0.9) return 'critical';
  if (ratio > 0.75) return 'warning';
  if (ratio > 0.5) return 'good';
  return 'healthy';
}

export function getBudgetStatusLabel(status: BudgetStatus): string {
  const labels: Record<BudgetStatus, string> = {
    healthy: 'Excellent', good: 'Bon', warning: 'Attention', critical: 'Critique', overspent: 'Depasse',
  };
  return labels[status];
}

export function getProgressColor(spent: number, limit: number): string {
  const ratio = spent / limit;
  if (ratio > 1 || ratio > 0.9) return '#DC2626';
  if (ratio > 0.75) return '#D97706';
  if (ratio > 0.5) return '#16A34A';
  return '#D4A853';
}

// Categories
export const categories: Category[] = [
  { id: 'cat-1', name: 'Alimentation', type: 'expense', color: '#E11D48', icon: 'UtensilsCrossed', isDefault: true, budget: 500 },
  { id: 'cat-2', name: 'Transport', type: 'expense', color: '#2563EB', icon: 'Car', isDefault: true, budget: 200 },
  { id: 'cat-3', name: 'Logement', type: 'expense', color: '#7C3AED', icon: 'Home', isDefault: true, budget: 800 },
  { id: 'cat-4', name: 'Loisirs', type: 'expense', color: '#D97706', icon: 'Gamepad2', isDefault: true, budget: 150 },
  { id: 'cat-5', name: 'Sante', type: 'expense', color: '#059669', icon: 'HeartPulse', isDefault: true, budget: 100 },
  { id: 'cat-6', name: 'Shopping', type: 'expense', color: '#DB2777', icon: 'ShoppingBag', isDefault: true, budget: 200 },
  { id: 'cat-7', name: 'Factures', type: 'expense', color: '#0891B2', icon: 'Zap', isDefault: true, budget: 250 },
  { id: 'cat-8', name: 'Education', type: 'expense', color: '#65A30D', icon: 'GraduationCap', isDefault: true, budget: 100 },
  { id: 'cat-9', name: 'Salaire', type: 'income', color: '#16A34A', icon: 'Banknote', isDefault: true },
  { id: 'cat-10', name: 'Freelance', type: 'income', color: '#2563EB', icon: 'Laptop', isDefault: true },
  { id: 'cat-11', name: 'Investissements', type: 'income', color: '#D4A853', icon: 'TrendingUp', isDefault: true },
  { id: 'cat-12', name: 'Cadeaux', type: 'income', color: '#E11D48', icon: 'Gift', isDefault: true },
  { id: 'cat-13', name: 'Restaurant', type: 'expense', color: '#EA580C', icon: 'Wine', isDefault: true, budget: 150 },
  { id: 'cat-14', name: 'Voyages', type: 'expense', color: '#0D9488', icon: 'Plane', isDefault: true, budget: 300 },
];

// Transactions
export const transactions: Transaction[] = [
  { id: 'tx-001', date: '2025-04-28', description: 'Salaire mensuel Avril', amount: 3200, category: 'cat-9', type: 'income', paymentMethod: 'transfer', notes: 'Virement employeur', createdAt: '2025-04-28T08:00:00Z', updatedAt: '2025-04-28T08:00:00Z' },
  { id: 'tx-002', date: '2025-04-27', description: 'Courses hebdomadaires Carrefour', amount: -127.5, category: 'cat-1', type: 'expense', paymentMethod: 'card', notes: 'Fruits, legumes, produits frais', createdAt: '2025-04-27T14:30:00Z', updatedAt: '2025-04-27T14:30:00Z' },
  { id: 'tx-003', date: '2025-04-26', description: 'Mission freelance design UI', amount: 850, category: 'cat-10', type: 'income', paymentMethod: 'transfer', notes: 'Projet site e-commerce', createdAt: '2025-04-26T10:00:00Z', updatedAt: '2025-04-26T10:00:00Z' },
  { id: 'tx-004', date: '2025-04-25', description: 'Loyer mensuel Avril', amount: -850, category: 'cat-3', type: 'expense', paymentMethod: 'transfer', notes: 'Loyer studio Paris 11e', createdAt: '2025-04-25T09:00:00Z', updatedAt: '2025-04-25T09:00:00Z' },
  { id: 'tx-005', date: '2025-04-24', description: 'Pass Navigo mensuel', amount: -86.4, category: 'cat-2', type: 'expense', paymentMethod: 'card', notes: 'Abonnement transport', createdAt: '2025-04-24T08:15:00Z', updatedAt: '2025-04-24T08:15:00Z' },
  { id: 'tx-006', date: '2025-04-23', description: 'Diner restaurant Le Petit Bistro', amount: -64, category: 'cat-13', type: 'expense', paymentMethod: 'card', notes: 'Diner avec amis', createdAt: '2025-04-23T20:30:00Z', updatedAt: '2025-04-23T20:30:00Z' },
  { id: 'tx-007', date: '2025-04-22', description: 'Dividendes actions', amount: 125, category: 'cat-11', type: 'income', paymentMethod: 'transfer', notes: 'Versement trimestriel', createdAt: '2025-04-22T09:00:00Z', updatedAt: '2025-04-22T09:00:00Z' },
  { id: 'tx-008', date: '2025-04-21', description: 'Achat Nike Air Max', amount: -149.99, category: 'cat-6', type: 'expense', paymentMethod: 'card', notes: 'Chaussures running', createdAt: '2025-04-21T16:45:00Z', updatedAt: '2025-04-21T16:45:00Z' },
  { id: 'tx-009', date: '2025-04-20', description: 'Facture Electricite Avril', amount: -72.3, category: 'cat-7', type: 'expense', paymentMethod: 'transfer', notes: 'EDF', createdAt: '2025-04-20T10:00:00Z', updatedAt: '2025-04-20T10:00:00Z' },
  { id: 'tx-010', date: '2025-04-19', description: 'Consultation dentiste', amount: -55, category: 'cat-5', type: 'expense', paymentMethod: 'card', notes: 'Couronne dentaire', createdAt: '2025-04-19T14:00:00Z', updatedAt: '2025-04-19T14:00:00Z' },
  { id: 'tx-011', date: '2025-04-18', description: 'Abonnement Netflix', amount: -17.99, category: 'cat-4', type: 'expense', paymentMethod: 'card', notes: 'Mensuel', createdAt: '2025-04-18T08:00:00Z', updatedAt: '2025-04-18T08:00:00Z' },
  { id: 'tx-012', date: '2025-04-17', description: 'Cadeau anniversaire Marie', amount: -45, category: 'cat-12', type: 'expense', paymentMethod: 'cash', notes: '', createdAt: '2025-04-17T12:00:00Z', updatedAt: '2025-04-17T12:00:00Z' },
  { id: 'tx-013', date: '2025-04-16', description: 'Cours en ligne React Avance', amount: -89, category: 'cat-8', type: 'expense', paymentMethod: 'card', notes: 'Udemy', createdAt: '2025-04-16T11:00:00Z', updatedAt: '2025-04-16T11:00:00Z' },
  { id: 'tx-014', date: '2025-04-15', description: 'Remboursement mutuelle', amount: 32.5, category: 'cat-5', type: 'income', paymentMethod: 'transfer', notes: 'Sante', createdAt: '2025-04-15T09:00:00Z', updatedAt: '2025-04-15T09:00:00Z' },
  { id: 'tx-015', date: '2025-04-14', description: 'Station essence Total', amount: -68.5, category: 'cat-2', type: 'expense', paymentMethod: 'card', notes: 'Plein essence', createdAt: '2025-04-14T18:20:00Z', updatedAt: '2025-04-14T18:20:00Z' },
  { id: 'tx-016', date: '2025-04-13', description: 'Courses biologiques Naturalia', amount: -93.2, category: 'cat-1', type: 'expense', paymentMethod: 'card', notes: '', createdAt: '2025-04-13T11:30:00Z', updatedAt: '2025-04-13T11:30:00Z' },
  { id: 'tx-017', date: '2025-04-12', description: 'Vente vieux livres', amount: 35, category: 'cat-12', type: 'income', paymentMethod: 'cash', notes: '', createdAt: '2025-04-12T15:00:00Z', updatedAt: '2025-04-12T15:00:00Z' },
  { id: 'tx-018', date: '2025-04-11', description: 'Concert Olympia', amount: -55, category: 'cat-4', type: 'expense', paymentMethod: 'card', notes: '2 places', createdAt: '2025-04-11T19:00:00Z', updatedAt: '2025-04-11T19:00:00Z' },
  { id: 'tx-019', date: '2025-04-10', description: 'Internet et Telephone Avril', amount: -39.99, category: 'cat-7', type: 'expense', paymentMethod: 'transfer', notes: 'Free', createdAt: '2025-04-10T08:00:00Z', updatedAt: '2025-04-10T08:00:00Z' },
  { id: 'tx-020', date: '2025-04-09', description: 'Retrait DAB', amount: -100, category: 'cat-1', type: 'expense', paymentMethod: 'cash', notes: '', createdAt: '2025-04-09T12:00:00Z', updatedAt: '2025-04-09T12:00:00Z' },
  { id: 'tx-021', date: '2025-04-08', description: 'Mission freelance logo', amount: 450, category: 'cat-10', type: 'income', paymentMethod: 'transfer', notes: 'Client : Startup GreenTech', createdAt: '2025-04-08T09:00:00Z', updatedAt: '2025-04-08T09:00:00Z' },
  { id: 'tx-022', date: '2025-04-07', description: 'Pharmacie', amount: -23.8, category: 'cat-5', type: 'expense', paymentMethod: 'card', notes: '', createdAt: '2025-04-07T17:30:00Z', updatedAt: '2025-04-07T17:30:00Z' },
  { id: 'tx-023', date: '2025-04-06', description: 'Reserve billet train Lyon', amount: -89, category: 'cat-14', type: 'expense', paymentMethod: 'card', notes: 'Week-end', createdAt: '2025-04-06T10:00:00Z', updatedAt: '2025-04-06T10:00:00Z' },
  { id: 'tx-024', date: '2025-04-05', description: 'Restaurant Lyon', amount: -78, category: 'cat-13', type: 'expense', paymentMethod: 'card', notes: 'Diner romantique', createdAt: '2025-04-05T21:00:00Z', updatedAt: '2025-04-05T21:00:00Z' },
  { id: 'tx-025', date: '2025-04-04', description: 'Shopping Zara', amount: -134.5, category: 'cat-6', type: 'expense', paymentMethod: 'card', notes: 'Nouvelle collection', createdAt: '2025-04-04T14:00:00Z', updatedAt: '2025-04-04T14:00:00Z' },
  { id: 'tx-026', date: '2025-04-03', description: 'Abonnement Spotify', amount: -10.99, category: 'cat-4', type: 'expense', paymentMethod: 'card', notes: 'Famille', createdAt: '2025-04-03T08:00:00Z', updatedAt: '2025-04-03T08:00:00Z' },
  { id: 'tx-027', date: '2025-04-02', description: 'Cheque cadeau recu', amount: 50, category: 'cat-12', type: 'income', paymentMethod: 'check', notes: '', createdAt: '2025-04-02T10:00:00Z', updatedAt: '2025-04-02T10:00:00Z' },
  { id: 'tx-028', date: '2025-04-01', description: 'Loyer Avril', amount: -850, category: 'cat-3', type: 'expense', paymentMethod: 'transfer', notes: '', createdAt: '2025-04-01T09:00:00Z', updatedAt: '2025-04-01T09:00:00Z' },
  { id: 'tx-029', date: '2025-03-31', description: 'Salaire mensuel Mars', amount: 3200, category: 'cat-9', type: 'income', paymentMethod: 'transfer', notes: '', createdAt: '2025-03-31T08:00:00Z', updatedAt: '2025-03-31T08:00:00Z' },
  { id: 'tx-030', date: '2025-03-30', description: 'Courses Monoprix', amount: -156.4, category: 'cat-1', type: 'expense', paymentMethod: 'card', notes: '', createdAt: '2025-03-30T16:00:00Z', updatedAt: '2025-03-30T16:00:00Z' },
];

// Budgets
export const budgets: Budget[] = [
  { id: 'bud-1', categoryId: 'cat-1', month: '2025-04', limit: 500, spent: 377.1, alertThreshold: 0.9 },
  { id: 'bud-2', categoryId: 'cat-2', month: '2025-04', limit: 200, spent: 154.9, alertThreshold: 0.85 },
  { id: 'bud-3', categoryId: 'cat-3', month: '2025-04', limit: 850, spent: 850, alertThreshold: 0.9 },
  { id: 'bud-4', categoryId: 'cat-4', month: '2025-04', limit: 150, spent: 132.99, alertThreshold: 0.85 },
  { id: 'bud-5', categoryId: 'cat-5', month: '2025-04', limit: 100, spent: 78.8, alertThreshold: 0.8 },
  { id: 'bud-6', categoryId: 'cat-6', month: '2025-04', limit: 200, spent: 284.49, alertThreshold: 0.8 },
  { id: 'bud-7', categoryId: 'cat-7', month: '2025-04', limit: 250, spent: 112.29, alertThreshold: 0.9 },
  { id: 'bud-8', categoryId: 'cat-8', month: '2025-04', limit: 100, spent: 89, alertThreshold: 0.75 },
  { id: 'bud-9', categoryId: 'cat-13', month: '2025-04', limit: 150, spent: 142, alertThreshold: 0.85 },
  { id: 'bud-10', categoryId: 'cat-14', month: '2025-04', limit: 300, spent: 89, alertThreshold: 0.9 },
];

// Goals
export const mockGoals: SavingsGoal[] = [
  { id: 'goal-1', name: 'Vacances Ete', description: 'Voyage en Italie - Rome, Florence et Venise', targetAmount: 5000, currentAmount: 3200, deadline: '2025-07-15', color: '#D4A853', icon: 'Plane',
    contributions: [{ date: '2024-12-15', amount: 500, note: 'Prime de fin annee' }, { date: '2025-01-10', amount: 400 }, { date: '2025-02-05', amount: 600, note: 'Vente objets occasion' }, { date: '2025-03-01', amount: 500 }, { date: '2025-04-01', amount: 500 }, { date: '2025-05-01', amount: 400 }, { date: '2025-06-01', amount: 300 }] },
  { id: 'goal-2', name: 'Nouvelle Voiture', description: 'Renault Clio hybrid ou equivalent', targetAmount: 15000, currentAmount: 8500, deadline: '2025-12-31', color: '#2563EB', icon: 'Car',
    contributions: [{ date: '2024-10-01', amount: 2000, note: 'Apport initial' }, { date: '2024-11-01', amount: 1000 }, { date: '2024-12-01', amount: 1000 }, { date: '2025-01-01', amount: 1000 }, { date: '2025-02-01', amount: 1000 }, { date: '2025-03-01', amount: 1000 }, { date: '2025-04-01', amount: 800 }, { date: '2025-05-01', amount: 700 }] },
  { id: 'goal-3', name: 'Fonds d\'Urgence', description: 'Coussin de securite pour imprevus', targetAmount: 6000, currentAmount: 4000, deadline: '2025-09-01', color: '#16A34A', icon: 'Shield',
    contributions: [{ date: '2024-08-01', amount: 1000 }, { date: '2024-09-01', amount: 500 }, { date: '2024-10-01', amount: 500 }, { date: '2024-11-01', amount: 500 }, { date: '2024-12-01', amount: 500 }, { date: '2025-01-01', amount: 500 }, { date: '2025-02-01', amount: 300 }, { date: '2025-03-01', amount: 200 }] },
  { id: 'goal-4', name: 'MacBook Pro', description: 'Nouvel ordinateur pour le freelancing', targetAmount: 2500, currentAmount: 1800, deadline: '2025-08-20', color: '#7C3AED', icon: 'Laptop',
    contributions: [{ date: '2025-02-01', amount: 600 }, { date: '2025-03-01', amount: 400 }, { date: '2025-04-01', amount: 300 }, { date: '2025-05-01', amount: 300 }, { date: '2025-06-01', amount: 200 }] },
  { id: 'goal-5', name: 'Equipement Photo', description: 'Appareil Sony A7IV + objectif 35mm', targetAmount: 3200, currentAmount: 900, deadline: '2026-01-15', color: '#E11D48', icon: 'Camera',
    contributions: [{ date: '2025-04-01', amount: 500 }, { date: '2025-05-01', amount: 400 }] },
];

// Monthly data
export const monthlyData: MonthlyData[] = [
  { month: '2024-06', monthShort: 'Juin', revenus: 3850, depenses: 2890, solde: 960 },
  { month: '2024-07', monthShort: 'Juil', revenus: 4100, depenses: 3100, solde: 1000 },
  { month: '2024-08', monthShort: 'Aout', revenus: 3950, depenses: 3400, solde: 550 },
  { month: '2024-09', monthShort: 'Sept', revenus: 4200, depenses: 2750, solde: 1450 },
  { month: '2024-10', monthShort: 'Oct', revenus: 4050, depenses: 2920, solde: 1130 },
  { month: '2024-11', monthShort: 'Nov', revenus: 4300, depenses: 3050, solde: 1250 },
  { month: '2024-12', monthShort: 'Dec', revenus: 4800, depenses: 3500, solde: 1300 },
  { month: '2025-01', monthShort: 'Jan', revenus: 4100, depenses: 2680, solde: 1420 },
  { month: '2025-02', monthShort: 'Fev', revenus: 4200, depenses: 2940, solde: 1260 },
  { month: '2025-03', monthShort: 'Mar', revenus: 4050, depenses: 3100, solde: 950 },
  { month: '2025-04', monthShort: 'Avr', revenus: 4625, depenses: 2890, solde: 1735 },
  { month: '2025-05', monthShort: 'Mai', revenus: 4300, depenses: 2950, solde: 1350 },
];

// Category spending
export const categorySpending: CategorySpend[] = [
  { id: 'cat-1', name: 'Alimentation', amount: 520, previousAmount: 480, color: '#E11D48', icon: 'UtensilsCrossed', percentage: 18, evolution: 8.3, trend: [420, 450, 480, 510, 490, 520], subCategories: [{ name: 'Courses', amount: 350 }, { name: 'Petit-dej', amount: 60 }, { name: 'Snacks', amount: 110 }] },
  { id: 'cat-3', name: 'Logement', amount: 850, previousAmount: 850, color: '#7C3AED', icon: 'Home', percentage: 29, evolution: 0, trend: [850, 850, 850, 850, 850, 850], subCategories: [{ name: 'Loyer', amount: 700 }, { name: 'Charges', amount: 150 }] },
  { id: 'cat-2', name: 'Transport', amount: 210, previousAmount: 180, color: '#2563EB', icon: 'Car', percentage: 7, evolution: 16.7, trend: [150, 160, 180, 200, 190, 210], subCategories: [{ name: 'Essence', amount: 120 }, { name: 'Transport public', amount: 90 }] },
  { id: 'cat-6', name: 'Shopping', amount: 340, previousAmount: 280, color: '#DB2777', icon: 'ShoppingBag', percentage: 12, evolution: 21.4, trend: [200, 220, 280, 260, 310, 340], subCategories: [{ name: 'Vetements', amount: 200 }, { name: 'Electronique', amount: 140 }] },
  { id: 'cat-4', name: 'Loisirs', amount: 175, previousAmount: 150, color: '#D97706', icon: 'Gamepad2', percentage: 6, evolution: 16.7, trend: [120, 130, 150, 140, 165, 175], subCategories: [{ name: 'Streaming', amount: 45 }, { name: 'Sorties', amount: 80 }, { name: 'Hobbies', amount: 50 }] },
  { id: 'cat-7', name: 'Factures', amount: 265, previousAmount: 250, color: '#0891B2', icon: 'Zap', percentage: 9, evolution: 6, trend: [220, 230, 250, 240, 255, 265], subCategories: [{ name: 'Electricite', amount: 75 }, { name: 'Internet', amount: 40 }, { name: 'Telephone', amount: 30 }, { name: 'Eau/Gaz', amount: 120 }] },
  { id: 'cat-5', name: 'Sante', amount: 95, previousAmount: 120, color: '#059669', icon: 'HeartPulse', percentage: 3, evolution: -20.8, trend: [150, 130, 120, 110, 100, 95], subCategories: [{ name: 'Medecin', amount: 50 }, { name: 'Pharmacie', amount: 45 }] },
  { id: 'cat-8', name: 'Education', amount: 120, previousAmount: 80, color: '#65A30D', icon: 'GraduationCap', percentage: 4, evolution: 50, trend: [60, 70, 80, 100, 110, 120], subCategories: [{ name: 'Cours', amount: 90 }, { name: 'Livres', amount: 30 }] },
];

// User settings
export const mockUser: User = {
  id: 'user-1', name: 'Alexandre Martin', email: 'alexandre.martin@email.fr',
  currency: 'EUR', language: 'fr', monthlyIncome: 3200, createdAt: '2024-01-15T08:00:00Z',
};

export const mockSessions: UserSession[] = [
  { id: 'sess-1', device: 'MacBook Pro', os: 'macOS Sonoma', browser: 'Chrome 125', location: 'Paris, France', ip: '192.168.1.***', lastActive: '2025-04-28T14:30:00Z', isCurrent: true },
  { id: 'sess-2', device: 'iPhone 15', os: 'iOS 17', browser: 'Safari', location: 'Paris, France', ip: '203.45.12.***', lastActive: '2025-04-28T09:15:00Z', isCurrent: false },
  { id: 'sess-3', device: 'iPad Air', os: 'iPadOS 17', browser: 'Chrome', location: 'Lyon, France', ip: '78.210.5.***', lastActive: '2025-04-25T18:00:00Z', isCurrent: false },
];

export const mockNotifications: NotificationSetting[] = [
  { id: 'notif-1', label: 'Alertes budget', description: 'Recevoir une alerte quand un budget atteint 90%', enabled: true },
  { id: 'notif-2', label: 'Rappels objectifs', description: 'Notifications hebdomadaires sur vos objectifs d\'epargne', enabled: true },
  { id: 'notif-3', label: 'Resume mensuel', description: 'Recapitulatif financier du mois par email', enabled: false },
  { id: 'notif-4', label: 'Notifications email', description: 'Recevoir les notifications par email', enabled: true },
  { id: 'notif-5', label: 'Notifications push', description: 'Recevoir les notifications push sur votre navigateur', enabled: false },
  { id: 'notif-6', label: 'Alertes securite', description: 'Notifications de connexion suspecte', enabled: true, required: true },
];

// Presets
export const COLOR_PRESETS = [
  '#E11D48', '#2563EB', '#7C3AED', '#D97706', '#059669',
  '#DB2777', '#0891B2', '#65A30D', '#EA580C', '#0D9488',
  '#D4A853', '#16A34A', '#DC2626', '#9333EA', '#0EA5E9',
];

export const ICON_OPTIONS = [
  'Home', 'Car', 'UtensilsCrossed', 'HeartPulse', 'ShoppingBag',
  'Zap', 'GraduationCap', 'Plane', 'Gamepad2', 'Wine',
  'Coffee', 'Smartphone', 'Gift', 'Baby', 'Cat',
  'Dumbbell', 'Music', 'Camera', 'BookOpen', 'Briefcase',
];

// Aliases for compatibility
export const colorPresets = COLOR_PRESETS;
export const iconOptions = ICON_OPTIONS;
export const mockUserProfile = mockUser;
export const mockExpenseCategories = categories.filter(c => c.type === 'expense');
export const mockIncomeCategories = categories.filter(c => c.type === 'income');
export const mockNotificationSettings = mockNotifications;
export const mockActiveSessions = mockSessions;
export const CATEGORY_COLORS = COLOR_PRESETS;
export const CATEGORY_ICONS = ICON_OPTIONS;

// Missing helper functions
export function formatCurrencyFull(amount: number, currency = 'EUR'): string {
  return formatCurrency(amount, currency);
}

export function getMotivationalMessage(progress: number): string {
  if (progress >= 100) return "Objectif atteint ! Felicitations !";
  if (progress >= 75) return "Vous y etes presque, continuez !";
  if (progress >= 50) return "Bonne progression, ne lachez rien !";
  if (progress >= 25) return "Un bon debut, persistez !";
  return "Chaque euro compte, commencez des maintenant !";
}

export function daysUntil(dateStr: string): number {
  const deadline = new Date(dateStr);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getMonthContribution(goal: SavingsGoal): number {
  if (!goal.deadline) return 0;
  const remaining = goal.targetAmount - goal.currentAmount;
  const months = Math.max(1, Math.ceil(daysUntil(goal.deadline) / 30));
  return remaining / months;
}

// Missing data exports for Analytics
export const wealthData = monthlyData.map(d => ({
  month: d.monthShort, solde: d.solde, revenus: d.revenus, depenses: d.depenses,
}));

export const analyticsKPIs = {
  soldeActuel: 8750, soldeTrend: 320,
  totalRevenus: 4625, revenusTrend: 8.2,
  totalDepenses: 2890, depensesTrend: -3.1,
  economies: 1735, tauxEpargne: 37.5,
};

export const radarData = [
  { category: 'Alimentation', Revenus: 0, Depenses: 520 },
  { category: 'Logement', Revenus: 0, Depenses: 850 },
  { category: 'Transport', Revenus: 0, Depenses: 210 },
  { category: 'Shopping', Revenus: 0, Depenses: 340 },
  { category: 'Loisirs', Revenus: 0, Depenses: 175 },
  { category: 'Sante', Revenus: 32.5, Depenses: 95 },
];

// Notification settings record for UI
export interface NotificationSettings {
  budgetAlerts: boolean;
  goalReminders: boolean;
  weeklySummary: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  securityAlerts: boolean;
}

// Default notification settings object
export const defaultNotificationSettings: NotificationSettings = {
  budgetAlerts: true,
  goalReminders: true,
  weeklySummary: false,
  emailNotifications: true,
  pushNotifications: false,
  securityAlerts: true,
};

// ═══════════════════════════════════════════════════════════════════════════════
//  DEBT MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  note?: string;
  createdAt: string;
}

export type DebtType = 'i-owe' | 'owed-to-me';
export type DebtStatus = 'active' | 'paid' | 'overdue';

export interface Debt {
  id: string;
  personName: string;
  personAvatar?: string;
  personContact?: string;
  description: string;
  amount: number;
  repaidAmount: number;
  type: DebtType;
  status: DebtStatus;
  dueDate?: string;
  createdAt: string;
  payments: DebtPayment[];
  note?: string;
  reminderEnabled: boolean;
}

export const debts: Debt[] = [
  {
    id: 'debt-1', personName: 'Thomas Dubois', personContact: 'thomas.dubois@email.fr',
    description: 'Pret pour achat velo electrique', amount: 800, repaidAmount: 500,
    type: 'owed-to-me', status: 'active', dueDate: '2025-06-15', createdAt: '2025-03-01T10:00:00Z',
    reminderEnabled: true, note: 'Remboursement en 4 fois',
    payments: [
      { id: 'pay-1', debtId: 'debt-1', amount: 200, date: '2025-03-15', note: 'Premier versement', createdAt: '2025-03-15T10:00:00Z' },
      { id: 'pay-2', debtId: 'debt-1', amount: 300, date: '2025-04-10', note: 'Deuxieme versement', createdAt: '2025-04-10T10:00:00Z' },
    ],
  },
  {
    id: 'debt-2', personName: 'Sophie Martin', personContact: '06 12 34 56 78',
    description: 'Partage frais voyage Barcelone', amount: 350, repaidAmount: 350,
    type: 'i-owe', status: 'paid', dueDate: '2025-04-30', createdAt: '2025-03-20T14:00:00Z',
    reminderEnabled: false,
    payments: [
      { id: 'pay-3', debtId: 'debt-2', amount: 150, date: '2025-03-25', createdAt: '2025-03-25T10:00:00Z' },
      { id: 'pay-4', debtId: 'debt-2', amount: 200, date: '2025-04-05', note: 'Solde', createdAt: '2025-04-05T10:00:00Z' },
    ],
  },
  {
    id: 'debt-3', personName: 'Lucas Bernard', personContact: 'lucas.bernard@email.fr',
    description: 'Pret urgence demenagement', amount: 1200, repaidAmount: 400,
    type: 'owed-to-me', status: 'overdue', dueDate: '2025-04-15', createdAt: '2025-02-10T09:00:00Z',
    reminderEnabled: true, note: 'Depasse depuis le 15 avril',
    payments: [
      { id: 'pay-5', debtId: 'debt-3', amount: 400, date: '2025-03-01', createdAt: '2025-03-01T10:00:00Z' },
    ],
  },
  {
    id: 'debt-4', personName: 'Emma Petit', personContact: '07 89 01 23 45',
    description: 'Emprunt pour cours de cuisine', amount: 250, repaidAmount: 100,
    type: 'i-owe', status: 'active', dueDate: '2025-07-01', createdAt: '2025-04-01T11:00:00Z',
    reminderEnabled: true,
    payments: [
      { id: 'pay-6', debtId: 'debt-4', amount: 100, date: '2025-04-15', createdAt: '2025-04-15T10:00:00Z' },
    ],
  },
  {
    id: 'debt-5', personName: 'Nicolas Leroy',
    description: 'Partage cadeau depart retraite papa', amount: 60, repaidAmount: 0,
    type: 'owed-to-me', status: 'active', dueDate: '2025-05-30', createdAt: '2025-04-20T16:00:00Z',
    reminderEnabled: false,
    payments: [],
  },
  {
    id: 'debt-6', personName: 'Marie Dupont', personContact: 'marie.dupont@email.fr',
    description: 'Avance pour location gite ete', amount: 500, repaidAmount: 500,
    type: 'i-owe', status: 'paid', dueDate: '2025-05-01', createdAt: '2025-01-15T10:00:00Z',
    reminderEnabled: false,
    payments: [
      { id: 'pay-7', debtId: 'debt-6', amount: 250, date: '2025-02-01', createdAt: '2025-02-01T10:00:00Z' },
      { id: 'pay-8', debtId: 'debt-6', amount: 250, date: '2025-03-01', createdAt: '2025-03-01T10:00:00Z' },
    ],
  },
  {
    id: 'debt-7', personName: 'Julie Moreau',
    description: 'Pret pour reparation voiture', amount: 450, repaidAmount: 150,
    type: 'owed-to-me', status: 'active', dueDate: '2025-08-10', createdAt: '2025-04-10T09:00:00Z',
    reminderEnabled: true,
    payments: [
      { id: 'pay-9', debtId: 'debt-7', amount: 150, date: '2025-04-20', createdAt: '2025-04-20T10:00:00Z' },
    ],
  },
  {
    id: 'debt-8', personName: 'Pierre Roux', personContact: '06 45 67 89 01',
    description: 'Emprunt pour billet concert', amount: 120, repaidAmount: 0,
    type: 'i-owe', status: 'overdue', dueDate: '2025-04-20', createdAt: '2025-03-25T14:00:00Z',
    reminderEnabled: true, note: 'A relancer',
    payments: [],
  },
];

export function getDebtStatusLabel(status: DebtStatus): string {
  const labels: Record<DebtStatus, string> = {
    active: 'En cours', paid: 'Rembourse', overdue: 'En retard',
  };
  return labels[status];
}

export function getDebtStatusColor(status: DebtStatus): string {
  switch (status) {
    case 'active': return '#2563EB';
    case 'paid': return '#16A34A';
    case 'overdue': return '#DC2626';
  }
}

export function getDebtProgress(debt: Debt): number {
  return Math.min(100, Math.round((debt.repaidAmount / debt.amount) * 100));
}

export function getRemainingAmount(debt: Debt): number {
  return Math.max(0, debt.amount - debt.repaidAmount);
}

// Type aliases
export interface UserProfile extends User {}
export interface ActiveSession extends UserSession {}

// ═══════════════════════════════════════════════════════════════════════════════
//  DEBT ANALYTICS DATA
// ═══════════════════════════════════════════════════════════════════════════════

export interface MonthlyDebtData {
  month: string;
  monthShort: string;
  aRecevoir: number;    // total owed-to-me created this month
  aRembourser: number;  // total i-owe created this month
  rembourseRecu: number;  // payments received on owed-to-me debts
  remboursePaye: number;  // payments made on i-owe debts
  soldeNet: number;     // (aRecevoir - rembourseRecu) - (aRembourser - remboursePaye)
}

export const monthlyDebtData: MonthlyDebtData[] = [
  { month: '2024-06', monthShort: 'Juin', aRecevoir: 200, aRembourser: 150, rembourseRecu: 100, remboursePaye: 80, soldeNet: 30 },
  { month: '2024-07', monthShort: 'Juil', aRecevoir: 450, aRembourser: 300, rembourseRecu: 250, remboursePaye: 200, soldeNet: 100 },
  { month: '2024-08', monthShort: 'Aout', aRecevoir: 300, aRembourser: 500, rembourseRecu: 200, remboursePaye: 350, soldeNet: -350 },
  { month: '2024-09', monthShort: 'Sept', aRecevoir: 600, aRembourser: 200, rembourseRecu: 400, remboursePaye: 150, soldeNet: 250 },
  { month: '2024-10', monthShort: 'Oct', aRecevoir: 350, aRembourser: 400, rembourseRecu: 300, remboursePaye: 250, soldeNet: -100 },
  { month: '2024-11', monthShort: 'Nov', aRecevoir: 500, aRembourser: 250, rembourseRecu: 350, remboursePaye: 200, soldeNet: 100 },
  { month: '2024-12', monthShort: 'Dec', aRecevoir: 800, aRembourser: 600, rembourseRecu: 500, remboursePaye: 400, soldeNet: 100 },
  { month: '2025-01', monthShort: 'Jan', aRecevoir: 400, aRembourser: 350, rembourseRecu: 300, remboursePaye: 250, soldeNet: 0 },
  { month: '2025-02', monthShort: 'Fev', aRecevoir: 1200, aRembourser: 500, rembourseRecu: 400, remboursePaye: 300, soldeNet: 400 },
  { month: '2025-03', monthShort: 'Mar', aRecevoir: 600, aRembourser: 850, rembourseRecu: 500, remboursePaye: 600, soldeNet: -350 },
  { month: '2025-04', monthShort: 'Avr', aRecevoir: 1250, aRembourser: 470, rembourseRecu: 700, remboursePaye: 350, soldeNet: 530 },
  { month: '2025-05', monthShort: 'Mai', aRecevoir: 450, aRembourser: 300, rembourseRecu: 350, remboursePaye: 200, soldeNet: 200 },
];

export interface DebtPersonAnalytics {
  personName: string;
  totalLent: number;
  totalBorrowed: number;
  repaidToMe: number;
  repaidByMe: number;
  remainingDue: number;
  remainingOwed: number;
  netBalance: number;
  transactionCount: number;
}

export const debtPersonAnalytics: DebtPersonAnalytics[] = [
  { personName: 'Thomas Dubois', totalLent: 800, totalBorrowed: 0, repaidToMe: 500, repaidByMe: 0, remainingDue: 300, remainingOwed: 0, netBalance: 300, transactionCount: 2 },
  { personName: 'Sophie Martin', totalLent: 0, totalBorrowed: 350, repaidToMe: 0, repaidByMe: 350, remainingDue: 0, remainingOwed: 0, netBalance: 0, transactionCount: 2 },
  { personName: 'Lucas Bernard', totalLent: 1200, totalBorrowed: 0, repaidToMe: 400, repaidByMe: 0, remainingDue: 800, remainingOwed: 0, netBalance: 800, transactionCount: 1 },
  { personName: 'Emma Petit', totalLent: 0, totalBorrowed: 250, repaidToMe: 0, repaidByMe: 100, remainingDue: 0, remainingOwed: 150, netBalance: -150, transactionCount: 1 },
  { personName: 'Nicolas Leroy', totalLent: 60, totalBorrowed: 0, repaidToMe: 0, repaidByMe: 0, remainingDue: 60, remainingOwed: 0, netBalance: 60, transactionCount: 0 },
  { personName: 'Marie Dupont', totalLent: 0, totalBorrowed: 500, repaidToMe: 0, repaidByMe: 500, remainingDue: 0, remainingOwed: 0, netBalance: 0, transactionCount: 2 },
  { personName: 'Julie Moreau', totalLent: 450, totalBorrowed: 0, repaidToMe: 150, repaidByMe: 0, remainingDue: 300, remainingOwed: 0, netBalance: 300, transactionCount: 1 },
  { personName: 'Pierre Roux', totalLent: 0, totalBorrowed: 120, repaidToMe: 0, repaidByMe: 0, remainingDue: 0, remainingOwed: 120, netBalance: -120, transactionCount: 0 },
];

// Debt analytics KPIs derived from debts array
export const debtAnalyticsKPIs = {
  totalARecevoir: 1910,   // sum of remaining owed-to-me
  totalARembourser: 270,  // sum of remaining i-owe
  soldeNetDettes: 1640,   // aRecevoir - aRembourser
  enRetard: 920,          // sum of overdue debts remaining
  tauxRecuperation: 58.3, // % of owed-to-me that has been repaid
  nombreDettes: 8,
  dettesActives: 4,
  dettesRemboursees: 2,
  dettesEnRetard: 2,
};
