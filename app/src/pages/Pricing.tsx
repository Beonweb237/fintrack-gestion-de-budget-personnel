import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { plans } from '@/data/saasData';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const comparison = [
  { category: 'Core', feature: 'Monthly transactions', free: '50', pro: 'Unlimited', premium: 'Unlimited' },
  { category: 'Core', feature: 'Budget categories', free: '3', pro: 'Unlimited', premium: 'Unlimited' },
  { category: 'Core', feature: 'Savings goals', free: '1', pro: '10', premium: 'Unlimited' },
  { category: 'Core', feature: 'Debt tracking', free: '3 debts', pro: 'Unlimited', premium: 'Unlimited' },
  { category: 'Core', feature: 'Analytics & reports', free: '\u2014', pro: 'Full', premium: 'Full + AI' },
  { category: 'Data', feature: 'Data export (CSV)', free: '\u2014', pro: '\u2713', premium: '\u2713' },
  { category: 'Data', feature: 'PDF reports', free: '\u2014', pro: '\u2713', premium: '\u2713' },
  { category: 'Data', feature: 'API access', free: '\u2014', pro: '\u2014', premium: '\u2713' },
  { category: 'Payments', feature: 'Multi-currency', free: 'USD only', pro: '3 currencies', premium: '50+' },
  { category: 'Payments', feature: 'Crypto payments', free: '\u2014', pro: '\u2014', premium: '\u2713' },
  { category: 'Payments', feature: 'Mobile Money', free: '\u2014', pro: '\u2713', premium: '\u2713' },
  { category: 'Support', feature: 'Support channel', free: 'Community', pro: 'Email', premium: '24/7 Phone+Chat' },
  { category: 'Support', feature: 'Family sharing', free: '\u2014', pro: '\u2014', premium: '5 members' },
];

const faqs = [
  { question: 'Can I switch plans at any time?', answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, changes take effect at the end of your billing period.' },
  { question: 'Is there a free trial for paid plans?', answer: 'Yes, both Pro and Premium plans come with a 14-day free trial. No credit card required to start your trial.' },
  { question: 'What happens when I hit the free plan limits?', answer: 'You\'ll be notified when approaching limits. You can upgrade anytime to continue tracking without interruption, or wait until the next billing cycle for counters to reset.' },
  { question: 'Can I cancel my subscription anytime?', answer: 'Absolutely. You can cancel anytime from your billing settings. You\'ll continue to have access until the end of your current billing period.' },
  { question: 'How does yearly billing save me money?', answer: 'Yearly billing gives you 2 months free compared to monthly billing \u2014 that\'s a 17% discount on Pro and Premium plans.' },
  { question: 'What payment methods do you accept?', answer: 'We accept credit/debit cards via Stripe, Bitcoin and Ethereum cryptocurrency, and Mobile Money (MTN, Orange) in supported African countries.' },
  { question: 'Is my financial data secure?', answer: 'Yes. We use bank-level 256-bit encryption, and your data is stored in secure, SOC 2 compliant data centers. We never sell your data to third parties.' },
  { question: 'Do you offer refunds?', answer: 'We offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied, contact our support team for a full refund.' },
];

const freeFeatures = [
  { text: 'Up to 50 transactions/mo', included: true },
  { text: '3 budgets', included: true },
  { text: '1 savings goal', included: true },
  { text: 'Basic tracking', included: true },
  { text: 'Community support', included: true },
];

const proFeatures = [
  { text: 'Unlimited transactions', included: true },
  { text: 'Unlimited budgets', included: true },
  { text: '10 savings goals', included: true },
  { text: 'Full analytics', included: true },
  { text: 'Debt tracking', included: true },
  { text: 'CSV/PDF export', included: true },
  { text: 'Multi-currency', included: true },
  { text: 'Priority email support', included: true },
];

const premiumFeatures = [
  { text: 'Unlimited goals', included: true },
  { text: 'AI insights', included: true },
  { text: 'Crypto payments', included: true },
  { text: '50+ currencies', included: true },
  { text: 'Family sharing (5)', included: true },
  { text: 'API access', included: true },
  { text: '24/7 phone support', included: true },
];

function FeatureItem({ included, text }: { included: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2.5 py-1">
      {included ? (
        <Check className="h-4 w-4 text-green-600 shrink-0" />
      ) : (
        <X className="h-4 w-4 text-gray-400 shrink-0" />
      )}
      <span className={cn('text-sm', included ? 'text-gray-800' : 'text-gray-400 line-through')}>
        {text}
      </span>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function Pricing() {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  const freePlan = plans.find((p) => p.id === 'free')!;
  const proPlan = plans.find((p) => p.id === 'pro')!;
  const premiumPlan = plans.find((p) => p.id === 'premium')!;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-20 pb-12 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-[48px] font-serif text-gray-900 mb-4"
        >
          Simple, transparent pricing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-600 max-w-xl mx-auto"
        >
          Choose the plan that fits your financial journey.
        </motion.p>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mt-8"
        >
          <button
            onClick={() => setInterval('monthly')}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-medium transition-all',
              interval === 'monthly'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('yearly')}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-medium transition-all relative',
              interval === 'yearly'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Save 17%
            </span>
          </button>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6 flex flex-col"
            style={{
              border: '2px solid #94A3B8',
              backgroundColor: '#F9F9F9',
            }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{freePlan.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{freePlan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$0</span>
            </div>
            <div className="flex-1 space-y-1 mb-6">
              {freeFeatures.map((f) => (
                <FeatureItem key={f.text} included={f.included} text={f.text} />
              ))}
            </div>
            <button
              onClick={() => navigate(`/checkout/free?interval=${interval}`)}
              className="w-full py-3 rounded-xl border-2 border-gray-900 text-gray-900 font-medium text-sm hover:bg-gray-900 hover:text-white transition-colors"
            >
              Get Started Free
            </button>
          </motion.div>

          {/* Pro */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6 flex flex-col relative"
            style={{
              border: '2px solid #F59E0B',
              backgroundColor: '#F9F9F9',
            }}
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">
              Most Popular
            </span>
            <h3 className="text-xl font-semibold text-gray-900 mb-1 mt-2">{proPlan.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{proPlan.description}</p>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">
                ${interval === 'monthly' ? '9.99' : '8.33'}
              </span>
              <span className="text-gray-500 text-sm">/mo</span>
              {interval === 'yearly' && (
                <p className="text-xs text-amber-600 font-medium mt-1">Save 17% with yearly</p>
              )}
            </div>
            <div className="flex-1 space-y-1 mb-6">
              {proFeatures.map((f) => (
                <FeatureItem key={f.text} included={f.included} text={f.text} />
              ))}
            </div>
            <button
              onClick={() => navigate(`/checkout/pro?interval=${interval}`)}
              className="w-full py-3 rounded-xl font-medium text-sm text-gray-900 transition-colors"
              style={{ backgroundColor: '#F59E0B' }}
            >
              Start Pro Trial
            </button>
          </motion.div>

          {/* Premium */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-2xl p-6 flex flex-col relative"
            style={{
              background: 'linear-gradient(#F9F9F9, #F9F9F9) padding-box, linear-gradient(135deg, #F59E0B, #EC4899) border-box',
              border: '2px solid transparent',
            }}
          >
            <span
              className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1 rounded-full"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #EC4899)' }}
            >
              Best Value
            </span>
            <h3 className="text-xl font-semibold text-gray-900 mb-1 mt-2">{premiumPlan.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{premiumPlan.description}</p>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">
                ${interval === 'monthly' ? '19.99' : '16.66'}
              </span>
              <span className="text-gray-500 text-sm">/mo</span>
              {interval === 'yearly' && (
                <p className="text-xs text-amber-600 font-medium mt-1">Save 17% with yearly</p>
              )}
            </div>
            <div className="flex-1 space-y-1 mb-6">
              {premiumFeatures.map((f) => (
                <FeatureItem key={f.text} included={f.included} text={f.text} />
              ))}
            </div>
            <button
              onClick={() => navigate(`/checkout/premium?interval=${interval}`)}
              className="w-full py-3 rounded-xl font-medium text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #EC4899)' }}
            >
              Go Premium
            </button>
          </motion.div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-center text-gray-900 mb-8"
        >
          Feature Comparison
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-x-auto"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Feature</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500">Free</th>
                <th className="text-center py-3 px-4 font-semibold text-amber-600">Pro</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: '#EC4899' }}>Premium</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, idx) => (
                <tr
                  key={`${row.feature}-${idx}`}
                  className={cn(
                    'border-b border-gray-100',
                    idx > 0 && comparison[idx - 1].category !== row.category && 'border-t-2 border-t-gray-200'
                  )}
                >
                  <td className="py-3 px-4 text-gray-800">
                    {idx === 0 || comparison[idx - 1].category !== row.category ? (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                          {row.category}
                        </span>
                        {row.feature}
                      </div>
                    ) : (
                      row.feature
                    )}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.free}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.pro}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-2xl mx-auto px-4 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-center text-gray-900 mb-8"
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion type="single" collapsible>
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-left text-gray-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>
    </div>
  );
}
