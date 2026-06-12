export type PlanTier = 'free' | 'pro' | 'premium';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

export type BillingInterval = 'monthly' | 'yearly';

export interface Plan {
  id: PlanTier;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: {
    transactions: number | null;
    budgets: number | null;
    goals: number | null;
    debts: number | null;
  };
}

export interface Subscription {
  planId: PlanTier;
  status: SubscriptionStatus;
  interval: BillingInterval;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'crypto' | 'mobile';
  label: string;
  last4: string;
  expiry?: string;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod: string;
  pdfUrl?: string;
}

export interface BillingInfo {
  fullName: string;
  email: string;
  company?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  taxId?: string;
}
