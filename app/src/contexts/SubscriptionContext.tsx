import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Plan, PlanTier, Subscription, SubscriptionStatus } from '@/types/saas';
import { mockSubscription, plans } from '@/data/saasData';

interface SubscriptionContextValue {
  subscription: Subscription;
  upgradePlan: (planId: PlanTier, interval: 'monthly' | 'yearly') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  reactivateSubscription: () => Promise<void>;
  toggleAutoRenew: () => void;
  updatePaymentMethod: () => void;
  canUseFeature: (feature: keyof Plan['limits']) => boolean;
  getCurrentPlan: () => Plan | undefined;
  getFeatureLimit: (feature: keyof Plan['limits']) => number | null;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription>({ ...mockSubscription });

  const upgradePlan = useCallback(async (planId: PlanTier, interval: 'monthly' | 'yearly') => {
    setSubscription((prev) => ({
      ...prev,
      planId,
      interval,
      status: 'active' as SubscriptionStatus,
      cancelAtPeriodEnd: false,
    }));
  }, []);

  const cancelSubscription = useCallback(async () => {
    setSubscription((prev) => ({
      ...prev,
      status: 'cancelled' as SubscriptionStatus,
      cancelAtPeriodEnd: true,
      autoRenew: false,
    }));
  }, []);

  const reactivateSubscription = useCallback(async () => {
    setSubscription((prev) => ({
      ...prev,
      status: 'active' as SubscriptionStatus,
      cancelAtPeriodEnd: false,
      autoRenew: true,
    }));
  }, []);

  const toggleAutoRenew = useCallback(() => {
    setSubscription((prev) => ({
      ...prev,
      autoRenew: !prev.autoRenew,
    }));
  }, []);

  const updatePaymentMethod = useCallback(() => {
    // Mock — in real app would open Stripe modal
  }, []);

  const getCurrentPlan = useCallback(() => {
    return plans.find((p) => p.id === subscription.planId);
  }, [subscription.planId]);

  const canUseFeature = useCallback(
    (feature: keyof Plan['limits']) => {
      const plan = getCurrentPlan();
      if (!plan) return false;
      const featurePlans: Record<string, PlanTier[]> = {
        transactions: ['free', 'pro', 'premium'],
        budgets: ['free', 'pro', 'premium'],
        goals: ['free', 'pro', 'premium'],
        debts: ['free', 'pro', 'premium'],
      };
      const allowed = featurePlans[feature] || ['pro', 'premium'];
      return allowed.includes(plan.id);
    },
    [getCurrentPlan]
  );

  const getFeatureLimit = useCallback(
    (feature: keyof Plan['limits']) => {
      const plan = getCurrentPlan();
      return plan?.limits[feature] ?? null;
    },
    [getCurrentPlan]
  );

  const value = useMemo(
    () => ({
      subscription,
      upgradePlan,
      cancelSubscription,
      reactivateSubscription,
      toggleAutoRenew,
      updatePaymentMethod,
      canUseFeature,
      getCurrentPlan,
      getFeatureLimit,
    }),
    [subscription, upgradePlan, cancelSubscription, reactivateSubscription, toggleAutoRenew, updatePaymentMethod, canUseFeature, getCurrentPlan, getFeatureLimit]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be inside SubscriptionProvider');
  return ctx;
}
