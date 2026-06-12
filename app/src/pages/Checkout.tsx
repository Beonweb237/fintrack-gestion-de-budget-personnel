import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Bitcoin,
  Smartphone,
  Lock,
  Copy,
  Check,
  ChevronLeft,
} from 'lucide-react';
import { plans } from '@/data/saasData';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { cn } from '@/lib/utils';

export default function Checkout() {
  const { planId } = useParams<{ planId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { upgradePlan } = useSubscription();

  const interval = (searchParams.get('interval') as 'monthly' | 'yearly') || 'monthly';

  const plan = plans.find((p) => p.id === (planId as string));

  // Payment state
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<'btc' | 'eth'>('btc');
  const [copied, setCopied] = useState(false);
  const [mobileProvider, setMobileProvider] = useState<'mtn' | 'orange'>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');

  const price = plan
    ? interval === 'monthly'
      ? plan.monthlyPrice
      : plan.yearlyPrice
    : 0;

  const planName = plan?.name || 'Unknown';
  const isFree = planId === 'free';

  const handleCardPayment = async () => {
    if (!planId) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success('Payment successful!');
    await upgradePlan(planId as import('@/types/saas').PlanTier, interval);
    navigate('/dashboard');
  };

  const handleCryptoPayment = async () => {
    if (!planId) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success('Payment confirmed! Your subscription is now active.');
    await upgradePlan(planId as import('@/types/saas').PlanTier, interval);
    navigate('/dashboard');
  };

  const handleMobilePayment = async () => {
    if (!planId || !phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success('Payment request sent! Confirm via USSD prompt.');
    await upgradePlan(planId as import('@/types/saas').PlanTier, interval);
    navigate('/dashboard');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return digits.slice(0, 2) + '/' + digits.slice(2);
    }
    return digits;
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Plan not found</h2>
          <Button onClick={() => navigate('/pricing')} variant="outline">
            Back to Pricing
          </Button>
        </div>
      </div>
    );
  }

  const cryptoAmount = selectedCrypto === 'btc' ? '~0.00017 BTC' : '~0.0028 ETH';

  const countryCodes = [
    { value: '+1', label: '+1 (US)' },
    { value: '+44', label: '+44 (UK)' },
    { value: '+233', label: '+233 (Ghana)' },
    { value: '+225', label: '+225 (CI)' },
    { value: '+237', label: '+237 (Cameroon)' },
    { value: '+256', label: '+256 (Uganda)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center">
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <span className="mx-auto font-semibold text-gray-900 pr-8">Checkout</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-900">{planName}</span>
                  {planId === 'pro' && (
                    <Badge className="bg-amber-500 text-white hover:bg-amber-600">Pro</Badge>
                  )}
                  {planId === 'premium' && (
                    <Badge
                      className="text-white hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #F59E0B, #EC4899)' }}
                    >
                      Premium
                    </Badge>
                  )}
                  {planId === 'free' && (
                    <Badge variant="secondary" className="bg-gray-200 text-gray-700">Free</Badge>
                  )}
                </div>
              </div>

              <p className="text-3xl font-bold text-gray-900 mb-1">
                {isFree ? '$0' : `$${price.toFixed(2)}`}
                {!isFree && (
                  <span className="text-base font-normal text-gray-500">
                    /{interval === 'monthly' ? 'month' : 'year'}
                  </span>
                )}
              </p>

              {interval === 'yearly' && !isFree && (
                <p className="text-sm text-amber-600 font-medium mb-4">Save 17% with yearly billing</p>
              )}

              <Separator className="my-4" />

              {/* Key features */}
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">What&apos;s included:</p>
                {plan.features.slice(0, 5).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Total today</span>
                <span className="text-xl font-bold text-gray-900">
                  {isFree ? '$0' : `$${price.toFixed(2)}`}
                </span>
              </div>

              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Check className="w-3 h-3 text-green-600" />
                Cancel anytime. No hidden fees.
              </p>
            </div>
          </motion.div>

          {/* Right - Payment Methods */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {isFree ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#DCFCE7' }}
                >
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start for Free
                </h3>
                <p className="text-gray-600 mb-6">
                  No payment required. Get started with the Free plan and upgrade anytime.
                </p>
                <Button
                  onClick={async () => {
                    await upgradePlan('free', interval);
                    navigate('/dashboard');
                  }}
                  className="w-full py-5 text-sm font-medium text-gray-900"
                  style={{ backgroundColor: '#F59E0B' }}
                >
                  Get Started Free
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="card" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="hidden sm:inline">Card</span>
                  </TabsTrigger>
                  <TabsTrigger value="crypto" className="flex items-center gap-2">
                    <Bitcoin className="w-4 h-4" />
                    <span className="hidden sm:inline">Crypto</span>
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Mobile</span>
                  </TabsTrigger>
                </TabsList>

                {/* Credit Card Tab */}
                <TabsContent value="card">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Card Number
                        </label>
                        <Input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="4242 4242 4242 4242"
                          className="w-full font-mono"
                          maxLength={19}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Expiry (MM/YY)
                          </label>
                          <Input
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="12/26"
                            className="w-full font-mono"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            CVV
                          </label>
                          <Input
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="123"
                            className="w-full font-mono"
                            maxLength={4}
                            type="password"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Cardholder Name
                        </label>
                        <Input
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full"
                        />
                      </div>

                      <Button
                        onClick={handleCardPayment}
                        disabled={isLoading}
                        className="w-full py-5 text-sm font-medium text-gray-900 mt-2"
                        style={{ backgroundColor: '#F59E0B' }}
                      >
                        {isLoading ? 'Processing...' : `Pay $${price.toFixed(2)}`}
                      </Button>

                      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mt-2">
                        <Lock className="w-3 h-3" />
                        Secured by Stripe
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Crypto Tab */}
                <TabsContent value="crypto">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    {/* BTC / ETH toggle */}
                    <div className="flex gap-2 mb-6">
                      <button
                        onClick={() => setSelectedCrypto('btc')}
                        className={cn(
                          'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border',
                          selectedCrypto === 'btc'
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        <Bitcoin className="w-4 h-4 inline mr-1.5" />
                        Bitcoin
                      </button>
                      <button
                        onClick={() => setSelectedCrypto('eth')}
                        className={cn(
                          'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border',
                          selectedCrypto === 'eth'
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        <span className="inline mr-1.5 font-bold text-xs">{'\u039E'}</span>
                        Ethereum
                      </button>
                    </div>

                    {/* QR Code placeholder */}
                    <div className="flex flex-col items-center mb-6">
                      <div
                        className="w-[180px] h-[180px] rounded-xl flex items-center justify-center mb-3"
                        style={{ backgroundColor: '#111827' }}
                      >
                        <span className="text-white font-bold text-2xl tracking-wider">
                          {selectedCrypto.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Send exactly:</p>
                      <p className="text-lg font-bold text-gray-900">
                        {cryptoAmount} (~${price.toFixed(2)})
                      </p>
                    </div>

                    {/* Wallet address */}
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between mb-4">
                      <code className="text-xs text-gray-600 font-mono truncate mr-2">
                        {selectedCrypto === 'btc'
                          ? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
                          : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            selectedCrypto === 'btc'
                              ? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
                              : '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
                          )
                        }
                        className="p-1.5 rounded-md hover:bg-gray-200 transition-colors shrink-0"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>

                    <Button
                      onClick={handleCryptoPayment}
                      disabled={isLoading}
                      className="w-full py-5 text-sm font-medium text-gray-900"
                      style={{ backgroundColor: '#F59E0B' }}
                    >
                      {isLoading ? 'Confirming...' : "I've sent the payment"}
                    </Button>

                    <p className="text-xs text-gray-400 text-center mt-3">
                      Crypto payments processed within 24h
                    </p>
                  </div>
                </TabsContent>

                {/* Mobile Money Tab */}
                <TabsContent value="mobile">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    {/* Provider selection */}
                    <div className="flex gap-3 mb-6">
                      <button
                        onClick={() => setMobileProvider('mtn')}
                        className={cn(
                          'flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2',
                          mobileProvider === 'mtn'
                            ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        )}
                        style={mobileProvider === 'mtn' ? {} : {}}
                      >
                        MTN
                      </button>
                      <button
                        onClick={() => setMobileProvider('orange')}
                        className={cn(
                          'flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2',
                          mobileProvider === 'orange'
                            ? 'border-orange-500 bg-orange-50 text-orange-800'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        Orange
                      </button>
                    </div>

                    {/* Country code + Phone */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shrink-0"
                        >
                          {countryCodes.map((cc) => (
                            <option key={cc.value} value={cc.value}>
                              {cc.label}
                            </option>
                          ))}
                        </select>
                        <Input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="20 123 4567"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleMobilePayment}
                      disabled={isLoading}
                      className="w-full py-5 text-sm font-medium text-gray-900"
                      style={{ backgroundColor: '#F59E0B' }}
                    >
                      {isLoading ? 'Requesting...' : 'Request Payment'}
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-3">
                      You will receive a USSD prompt to confirm
                    </p>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700 text-center">
                        Available in Ghana, Ivory Coast, Cameroon, Uganda
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
