import type { Plan, Invoice, BillingInfo, PaymentMethod, Subscription } from '@/types/saas';

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'For personal use',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '50 transactions/month',
      'Unlimited budgets',
      '3 savings goals',
      'Unlimited debts',
      'Basic reports',
      'Email support',
    ],
    limits: { transactions: 50, budgets: null, goals: 3, debts: null },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For power users',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    features: [
      'Unlimited transactions',
      'Unlimited budgets',
      '10 savings goals',
      'Unlimited debts',
      'Advanced analytics',
      'Priority support',
      'Custom categories',
      'Export data (CSV, PDF)',
    ],
    limits: { transactions: null, budgets: null, goals: 10, debts: null },
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For families & teams',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    features: [
      'Everything in Pro',
      'Unlimited goals',
      'Family sharing (5 members)',
      'AI insights & predictions',
      'Investment tracking',
      'API access',
      'Dedicated support',
      'White-label exports',
    ],
    limits: { transactions: null, budgets: null, goals: null, debts: null },
  },
];

export const mockSubscription: Subscription = {
  planId: 'pro',
  status: 'active',
  interval: 'monthly',
  currentPeriodStart: '2025-05-01T00:00:00Z',
  currentPeriodEnd: '2025-06-01T00:00:00Z',
  autoRenew: true,
  cancelAtPeriodEnd: false,
};

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'card',
    label: 'Visa',
    last4: '4242',
    expiry: '12/26',
    isDefault: true,
  },
  {
    id: 'pm-2',
    type: 'crypto',
    label: 'Bitcoin Wallet',
    last4: 'a3f9',
    isDefault: false,
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    date: '2025-05-01',
    description: 'Pro Plan - Monthly',
    amount: 9.99,
    status: 'paid',
    paymentMethod: 'pm-1',
  },
  {
    id: 'inv-2',
    date: '2025-04-01',
    description: 'Pro Plan - Monthly',
    amount: 9.99,
    status: 'paid',
    paymentMethod: 'pm-1',
  },
  {
    id: 'inv-3',
    date: '2025-03-01',
    description: 'Pro Plan - Monthly',
    amount: 9.99,
    status: 'paid',
    paymentMethod: 'pm-1',
  },
  {
    id: 'inv-4',
    date: '2025-02-01',
    description: 'Pro Plan - Monthly',
    amount: 9.99,
    status: 'paid',
    paymentMethod: 'pm-1',
  },
  {
    id: 'inv-5',
    date: '2025-01-01',
    description: 'Pro Plan - Monthly',
    amount: 9.99,
    status: 'failed',
    paymentMethod: 'pm-1',
  },
];

export const mockBillingInfo: BillingInfo = {
  fullName: 'Alexandre Martin',
  email: 'alexandre.martin@email.fr',
  company: 'Freelance',
  address: '42 Rue de la Paix',
  city: 'Paris',
  postalCode: '75002',
  country: 'France',
  taxId: 'FR12345678901',
};

export function formatPrice(amount: number, interval?: string): string {
  if (amount === 0) return 'Free';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
  return interval ? `${formatted}/${interval === 'monthly' ? 'mo' : 'yr'}` : formatted;
}

export function formatDateUS(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function daysUntil(dateStr: string): number {
  const deadline = new Date(dateStr);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getTotalDaysInPeriod(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
}

export const monthlySpending = [
  { month: 'Jan', amount: 9.99 },
  { month: 'Feb', amount: 9.99 },
  { month: 'Mar', amount: 9.99 },
  { month: 'Apr', amount: 9.99 },
  { month: 'May', amount: 9.99 },
];
