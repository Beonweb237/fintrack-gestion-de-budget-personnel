import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { plans, formatPrice, formatDateUS, daysUntil, getTotalDaysInPeriod } from '@/data/saasData';
import type { PlanTier } from '@/types/saas';
import { cn } from '@/lib/utils';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

import {
  CreditCard,
  AlertTriangle,
  Check,
  Zap,
  Crown,
  Sparkles,
  CalendarDays,
  Timer,
  RefreshCw,
  ChevronRight,
  X,
} from 'lucide-react';

/* ─── Animations ─── */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

/* ─── Usage data (mock) ─── */
const usageData = [
  { label: 'Transactions', used: 45, limit: 50, color: 'bg-amber-500', warning: true },
  { label: 'Budgets', used: 8, limit: null, color: 'bg-green-500', warning: false },
  { label: 'Goals', used: 3, limit: 10, color: 'bg-amber-500', warning: false },
  { label: 'Debts', used: 2, limit: null, color: 'bg-green-500', warning: false },
];

/* ─── Plan icon map ─── */
const planIcons: Record<PlanTier, typeof Zap> = {
  free: Sparkles,
  pro: Zap,
  premium: Crown,
};

const planBadgeClass: Record<PlanTier, string> = {
  free: 'bg-neutral-500 text-white',
  pro: 'bg-amber-500 text-white',
  premium: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white',
};

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { subscription, toggleAutoRenew, upgradePlan, reactivateSubscription, cancelSubscription } =
    useSubscription();

  /* ─── Local state ─── */
  const [confirmPlan, setConfirmPlan] = useState<PlanTier | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelStep, setCancelStep] = useState(1);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelDetails, setCancelDetails] = useState('');

  const currentPlan = plans.find((p) => p.id === subscription.planId)!;
  const remainingDays = daysUntil(subscription.currentPeriodEnd);
  const totalDays = getTotalDaysInPeriod(
    subscription.currentPeriodStart,
    subscription.currentPeriodEnd
  );
  const progressPct = Math.round((remainingDays / totalDays) * 100);

  const handleConfirmSwitch = async () => {
    if (!confirmPlan) return;
    await upgradePlan(confirmPlan, 'monthly');
    toast.success(`Successfully switched to ${plans.find((p) => p.id === confirmPlan)?.name} plan`);
    setConfirmPlan(null);
  };

  const handleConfirmCancel = async () => {
    await cancelSubscription();
    toast.success('Subscription cancelled. You keep access until period end.');
    setCancelDialogOpen(false);
    setCancelStep(1);
    setCancelReason('');
    setCancelDetails('');
  };

  const handleReactivate = async () => {
    await reactivateSubscription();
    toast.success('Subscription reactivated!');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="font-body text-neutral-300">Please sign in to manage your subscription.</p>
      </div>
    );
  }

  const featuresLost = currentPlan.features.slice(0, 4);

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* ═══════ Header ═══════ */}
      <motion.div variants={item}>
        <h1 className="font-h2 text-neutral-100" style={{ fontSize: 28 }}>
          Subscription
        </h1>
        <p className="font-body text-neutral-300 mt-1">
          Manage your plan, usage, and billing preferences
        </p>
      </motion.div>

      {/* ═══════ Current Plan ═══════ */}
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Badge className={cn('font-caption px-2.5 py-0.5', planBadgeClass[currentPlan.id])}>
                  {currentPlan.name}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    'font-caption px-2.5 py-0.5',
                    subscription.status === 'active' && 'border-green-500 text-green-600',
                    subscription.status === 'cancelled' && 'border-orange-400 text-orange-500',
                    subscription.status === 'expired' && 'border-red-500 text-red-600'
                  )}
                >
                  {subscription.status === 'active'
                    ? 'Active'
                    : subscription.status === 'cancelled'
                      ? 'Cancelled'
                      : 'Expired'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <RefreshCw size={14} />
                <span className="font-caption">Auto-renew</span>
                <Switch
                  checked={subscription.autoRenew}
                  onCheckedChange={toggleAutoRenew}
                  className="data-[state=checked]:bg-accent-gold"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Price & period */}
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <p className="font-overline text-neutral-300">PRICE</p>
                <p className="font-h3 text-neutral-100 mt-0.5">
                  {subscription.planId === 'free'
                    ? 'Free'
                    : `${formatPrice(currentPlan.monthlyPrice)}/month`}
                </p>
              </div>
              <div>
                <p className="font-overline text-neutral-300">CURRENT PERIOD</p>
                <div className="flex items-center gap-1.5 mt-0.5 text-neutral-200">
                  <CalendarDays size={14} className="text-neutral-400" />
                  <span className="font-body">
                    {formatDateUS(subscription.currentPeriodStart)} &rarr;{' '}
                    {formatDateUS(subscription.currentPeriodEnd)}
                  </span>
                </div>
              </div>
            </div>

            {/* Days remaining */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-neutral-300">
                  <Timer size={14} />
                  <span className="font-caption">Days remaining</span>
                </div>
                <span className="font-caption text-neutral-200">
                  {remainingDays} of {totalDays} days
                </span>
              </div>
              <Progress value={progressPct} className="h-2 bg-warm-gray" />
            </div>

            {/* Cancelled warning */}
            {subscription.cancelAtPeriodEnd && (
              <div className="flex items-start gap-3 bg-warning-light border border-warning/20 rounded-xl p-4">
                <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-body-sm text-neutral-200">
                    Your subscription ends on{' '}
                    <strong>{formatDateUS(subscription.currentPeriodEnd)}</strong>. Renew to keep
                    your features.
                  </p>
                </div>
                <Button
                  onClick={handleReactivate}
                  className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold rounded-lg h-9 px-4 shrink-0"
                >
                  Reactivate
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════ Usage ═══════ */}
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-3">
            <CardTitle className="font-h3 text-neutral-100">Usage</CardTitle>
            <CardDescription className="font-body-sm text-neutral-300">
              Your current plan usage this billing period
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {usageData.map((u) => (
              <div key={u.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-body-sm text-neutral-200">{u.label}</span>
                  <span className="font-caption text-neutral-300">
                    {u.used}
                    {u.limit !== null ? ` / ${u.limit}` : ' / \u221E'}
                  </span>
                </div>
                <Progress
                  value={u.limit ? (u.used / u.limit) * 100 : 10}
                  className="h-2 bg-warm-gray"
                />
                {u.limit && u.used / u.limit >= 0.9 && (
                  <p className="font-caption text-red-500">At limit — upgrade recommended</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════ Change Plan ═══════ */}
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-3">
            <CardTitle className="font-h3 text-neutral-100">Change Plan</CardTitle>
            <CardDescription className="font-body-sm text-neutral-300">
              Upgrade, downgrade, or switch billing interval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => {
                const Icon = planIcons[plan.id];
                const isCurrent = plan.id === subscription.planId;
                const isDowngrade =
                  plans.findIndex((p) => p.id === plan.id) <
                  plans.findIndex((p) => p.id === subscription.planId);

                return (
                  <div
                    key={plan.id}
                    className={cn(
                      'relative rounded-xl border p-5 transition-all',
                      isCurrent
                        ? 'border-accent-gold bg-accent-gold/5'
                        : 'border-warm-gray bg-warm-cream hover:border-neutral-300 hover:shadow-card-hover'
                    )}
                  >
                    {isCurrent && (
                      <Badge className="absolute top-3 right-3 bg-accent-gold text-white font-caption">
                        Current
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center',
                          plan.id === 'premium'
                            ? 'bg-gradient-to-br from-amber-500 to-yellow-400'
                            : 'bg-accent-gold/15'
                        )}
                      >
                        <Icon size={18} className={plan.id === 'premium' ? 'text-white' : 'text-accent-gold'} />
                      </div>
                      <div>
                        <p className="font-h4 text-neutral-100">{plan.name}</p>
                        <p className="font-caption text-neutral-400">{plan.description}</p>
                      </div>
                    </div>

                    <p className="font-h3 text-neutral-100 mb-3">
                      {formatPrice(plan.monthlyPrice)}
                      <span className="font-caption text-neutral-400">/mo</span>
                    </p>

                    <ul className="space-y-1.5 mb-4">
                      {plan.features.slice(0, 5).map((f) => (
                        <li key={f} className="flex items-start gap-2 font-body-sm text-neutral-200">
                          <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => !isCurrent && setConfirmPlan(plan.id)}
                      variant={isCurrent ? 'ghost' : 'default'}
                      disabled={isCurrent}
                      className={cn(
                        'w-full rounded-lg h-10 font-semibold',
                        isCurrent && 'text-neutral-400 cursor-default',
                        !isCurrent &&
                          (isDowngrade
                            ? 'border border-neutral-500 bg-transparent text-neutral-200 hover:bg-warm-white'
                            : 'bg-accent-gold hover:bg-accent-gold/90 text-neutral-100')
                      )}
                    >
                      {isCurrent
                        ? 'Current Plan'
                        : isDowngrade
                          ? `Switch to ${plan.name}`
                          : `Upgrade to ${plan.name}`}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════ Payment Method ═══════ */}
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-3">
            <CardTitle className="font-h3 text-neutral-100">Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-gold/15 flex items-center justify-center">
                  <CreditCard size={18} className="text-accent-gold" />
                </div>
                <div>
                  <p className="font-body text-neutral-200 font-medium">Visa &bull;&bull;&bull;&bull; 4242</p>
                  <p className="font-caption text-neutral-400">Expires 12/26</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-neutral-500 text-neutral-200 hover:border-accent-gold hover:bg-warm-white rounded-lg h-10"
                onClick={() => {
                  toast.info('Stripe checkout would open here');
                }}
              >
                Update Payment Method
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════ Cancellation ═══════ */}
      <motion.div variants={item}>
        <Card className="shadow-card border-red-200 bg-red-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="font-h3 text-danger">Cancellation</CardTitle>
            <CardDescription className="font-body-sm text-neutral-300">
              End your subscription and lose access to premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              onClick={() => {
                setCancelDialogOpen(true);
                setCancelStep(1);
              }}
              className="text-danger hover:text-danger hover:bg-danger-light rounded-lg h-10 font-semibold"
            >
              <X size={16} className="mr-2" />
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* ════════════════════════════════ DIALOGS ════════════════════════════════ */}

      {/* Switch plan confirmation */}
      <Dialog open={!!confirmPlan} onOpenChange={() => setConfirmPlan(null)}>
        <DialogContent className="bg-warm-white border-warm-gray rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-h3 text-neutral-100">
              Switch to {confirmPlan ? plans.find((p) => p.id === confirmPlan)?.name : ''}?
            </DialogTitle>
            <DialogDescription className="font-body-sm text-neutral-300">
              {confirmPlan && (
                <div className="mt-3 space-y-2">
                  {(() => {
                    const target = plans.find((p) => p.id === confirmPlan)!;
                    const current = currentPlan;
                    const gained = target.features.filter(
                      (f) => !current.features.includes(f)
                    );
                    const lost = current.features.filter(
                      (f) => !target.features.includes(f)
                    );
                    return (
                      <>
                        {gained.length > 0 && (
                          <div>
                            <p className="font-caption text-green-600 mb-1">You will gain:</p>
                            <ul className="space-y-0.5">
                              {gained.map((f) => (
                                <li key={f} className="flex items-center gap-1.5 font-body-sm text-neutral-200">
                                  <Check size={12} className="text-green-500" /> {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {lost.length > 0 && (
                          <div>
                            <p className="font-caption text-red-500 mb-1">You will lose:</p>
                            <ul className="space-y-0.5">
                              {lost.map((f) => (
                                <li key={f} className="flex items-center gap-1.5 font-body-sm text-neutral-200">
                                  <X size={12} className="text-red-400" /> {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {gained.length === 0 && lost.length === 0 && (
                          <p>No feature changes. Billing amount will be updated.</p>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmPlan(null)}
              className="border-neutral-500 text-neutral-200 hover:bg-warm-cream rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSwitch}
              className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold rounded-lg"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancellation flow */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="bg-warm-white border-warm-gray rounded-2xl max-w-md">
          {cancelStep === 1 && (
            <>
              <DialogHeader>
                <DialogTitle className="font-h3 text-neutral-100">
                  We&apos;re sorry to see you go
                </DialogTitle>
                <DialogDescription className="font-body-sm text-neutral-300">
                  Why are you leaving? Your feedback helps us improve.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <RadioGroup value={cancelReason} onValueChange={setCancelReason} className="space-y-2">
                  {['Too expensive', 'Missing features', 'Found alternative', 'Other'].map((r) => (
                    <div key={r} className="flex items-center gap-2">
                      <RadioGroupItem value={r} id={r} className="border-neutral-400" />
                      <Label htmlFor={r} className="font-body-sm text-neutral-200 cursor-pointer">
                        {r}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <Textarea
                  value={cancelDetails}
                  onChange={(e) => setCancelDetails(e.target.value)}
                  placeholder="Tell us more (optional)"
                  className="rounded-lg border-neutral-500 focus:border-accent-gold min-h-[80px]"
                />
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCancelDialogOpen(false)}
                  className="border-neutral-500 text-neutral-200 hover:bg-warm-cream rounded-lg"
                >
                  Keep Subscription
                </Button>
                <Button
                  onClick={() => setCancelStep(2)}
                  disabled={!cancelReason}
                  className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold rounded-lg"
                >
                  Continue
                  <ChevronRight size={14} className="ml-1" />
                </Button>
              </DialogFooter>
            </>
          )}

          {cancelStep === 2 && (
            <>
              <DialogHeader>
                <DialogTitle className="font-h3 text-neutral-100">Wait — special offer!</DialogTitle>
                <DialogDescription className="font-body-sm text-neutral-300">
                  Get <strong className="text-accent-gold">50% off</strong> your next 3 months. Stay
                  with us and keep all your premium features.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 flex justify-center">
                <div className="bg-accent-gold/10 border-2 border-accent-gold/30 rounded-xl px-8 py-4 text-center">
                  <p className="font-h2 text-accent-gold" style={{ fontSize: 36 }}>
                    50% OFF
                  </p>
                  <p className="font-caption text-neutral-300">Next 3 months</p>
                </div>
              </div>
              <DialogFooter className="gap-2 flex-col">
                <Button
                  onClick={() => {
                    toast.success('Offer applied! Enjoy 50% off for 3 months.');
                    setCancelDialogOpen(false);
                    setCancelStep(1);
                  }}
                  className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold rounded-lg w-full"
                >
                  Accept Offer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCancelStep(3)}
                  className="border-neutral-500 text-neutral-300 hover:bg-warm-cream rounded-lg w-full"
                >
                  Continue Cancelling
                </Button>
              </DialogFooter>
            </>
          )}

          {cancelStep === 3 && (
            <>
              <DialogHeader>
                <DialogTitle className="font-h3 text-danger flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Are you sure?
                </DialogTitle>
                <DialogDescription className="font-body-sm text-neutral-300">
                  You will lose access to these features at period end:
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <ul className="space-y-1.5">
                  {featuresLost.map((f) => (
                    <li key={f} className="flex items-center gap-2 font-body-sm text-neutral-200">
                      <X size={14} className="text-red-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCancelDialogOpen(false)}
                  className="border-neutral-500 text-neutral-200 hover:bg-warm-cream rounded-lg"
                >
                  Keep Subscription
                </Button>
                <Button
                  onClick={handleConfirmCancel}
                  className="bg-danger hover:bg-danger/90 text-white font-semibold rounded-lg"
                >
                  Confirm Cancellation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
