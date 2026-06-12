import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { plans } from '@/data/saasData';
import type { PlanTier, Plan } from '@/types/saas';

export function useFeatureGate(feature: keyof Plan['limits']) {
  const { canUseFeature, getCurrentPlan, getFeatureLimit } = useSubscription();
  const { state } = useAuth();
  const isAuthenticated = state.isAuthenticated;
  const currentPlan = getCurrentPlan();
  const hasAccess = isAuthenticated && canUseFeature(feature);
  const limit = getFeatureLimit(feature);
  const requiredPlan: PlanTier = 'pro';
  const requiredPlanName = plans.find((p) => p.id === requiredPlan)?.name || 'Pro';
  return {
    canAccess: hasAccess,
    isAuthenticated,
    limit,
    currentPlanId: currentPlan?.id || 'free',
    currentPlanName: currentPlan?.name || 'Free',
    requiredPlan,
    requiredPlanName,
    upgradePrompt: hasAccess ? null : `Upgrade to ${requiredPlanName} to unlock this feature`,
  };
}
