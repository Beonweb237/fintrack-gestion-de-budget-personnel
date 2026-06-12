import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet,
  BarChart3,
  Target,
  Receipt,
  Shield,
  Globe,
  Check,
  Star,
} from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import PublicNavbar from '@/components/PublicNavbar';
import LandingFooter from '@/components/LandingFooter';

/* ------------------------------------------------------------------ */
/*  Animations                                                        */
/* ------------------------------------------------------------------ */

const EASE_DEFAULT: [number, number, number, number] = [0.4, 0, 0.2, 1];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: EASE_DEFAULT },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

const staggerChild = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: EASE_DEFAULT },
};

/* ------------------------------------------------------------------ */
/*  Animated stat with count-up                                       */
/* ------------------------------------------------------------------ */

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const count = useCountUp(value, 1500, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-white">
        {Math.round(count).toLocaleString()}
        {suffix}
      </div>
      <div className="text-slate-400 text-sm mt-1">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature card                                                      */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: Wallet,
    title: 'Smart Budgeting',
    description:
      'Create custom budgets with intelligent alerts that notify you before you overspend.',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description:
      'Visualize your spending patterns with beautiful charts and actionable insights.',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description:
      'Set savings goals and track your progress with milestone celebrations.',
  },
  {
    icon: Receipt,
    title: 'Receipt Scanner',
    description:
      'Digitize receipts instantly with OCR technology and automatic categorization.',
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description:
      '256-bit encryption, biometric auth, and real-time fraud monitoring.',
  },
  {
    icon: Globe,
    title: 'Multi-Currency',
    description:
      'Track expenses in 150+ currencies with real-time exchange rates.',
  },
];

/* ------------------------------------------------------------------ */
/*  Testimonials                                                      */
/* ------------------------------------------------------------------ */

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer at Figma',
    quote:
      'FinTrack completely transformed how I manage my money. I saved over $3,000 in just three months by identifying hidden subscriptions.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Johnson',
    role: 'Software Engineer',
    quote:
      'The analytics are incredible. I finally understand where every dollar goes. The goal tracking feature helped me buy my first home.',
    avatar: 'MJ',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Freelance Consultant',
    quote:
      'As a freelancer, budgeting was always a struggle. FinTrack made it effortless. The receipt scanner alone saves me hours every month.',
    avatar: 'ER',
  },
];

/* ------------------------------------------------------------------ */
/*  Pricing                                                           */
/* ------------------------------------------------------------------ */

const pricingPlans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'For personal use',
    features: [
      '50 transactions/month',
      'Unlimited budgets',
      '3 savings goals',
      'Basic reports',
      'Email support',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    description: 'For power users',
    features: [
      'Unlimited transactions',
      'Unlimited budgets',
      '10 savings goals',
      'Advanced analytics',
      'Priority support',
      'Custom categories',
      'Export data (CSV, PDF)',
    ],
    popular: true,
  },
  {
    name: 'Premium',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    description: 'For families & teams',
    features: [
      'Everything in Pro',
      'Unlimited goals',
      'Family sharing (5 members)',
      'AI insights & predictions',
      'Investment tracking',
      'API access',
      'Dedicated support',
    ],
    popular: false,
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ                                                               */
/* ------------------------------------------------------------------ */

const faqs = [
  {
    question: 'Is there a free trial for paid plans?',
    answer:
      'Yes! Both Pro and Premium plans come with a 14-day free trial. You can cancel anytime during the trial and you will not be charged.',
  },
  {
    question: 'Can I cancel my subscription at any time?',
    answer:
      'Absolutely. You can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing period.',
  },
  {
    question: 'How secure is my financial data?',
    answer:
      'We use bank-level 256-bit AES encryption for all data at rest and TLS 1.3 for data in transit. We are SOC 2 Type II certified and never sell your data to third parties.',
  },
  {
    question: 'Can I export my data?',
    answer:
      'Pro and Premium users can export data in CSV, PDF, and Excel formats. All users can export their data in CSV format at any time.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'We offer a 30-day money-back guarantee for all paid plans. If you are not satisfied, contact our support team for a full refund.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, and cryptocurrency for annual plans.',
  },
  {
    question: 'Is there a discount for annual billing?',
    answer:
      'Yes! You save approximately 17% with annual billing compared to monthly. That is like getting 2 months free every year.',
  },
  {
    question: 'Can I switch plans later?',
    answer:
      'Yes, you can upgrade or downgrade your plan at any time from your account settings. Prorated charges or credits will be applied automatically.',
  },
];

/* ================================================================== */
/*  MAIN LANDING PAGE                                                */
/* ================================================================== */

export default function Landing() {
  const navigate = useNavigate();
  const [pricingInterval, setPricingInterval] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-[100dvh] bg-[#0B1121] text-white">
      <PublicNavbar />

      {/* ============================================================ */}
      {/*  HERO                                                       */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
        {/* Radial amber glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(245,158,11,0.12) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_DEFAULT }}
            >
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                Master Your Money,
                <br />
                Own Your{' '}
                <span className="text-[#F59E0B]">Future</span>
              </h1>
              <p className="text-slate-400 text-lg lg:text-xl leading-relaxed mb-8 max-w-lg">
                The intelligent budget tracker that helps you save more, spend
                wisely, and achieve your financial goals.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <Button
                  size="lg"
                  className="bg-[#F59E0B] text-[#0B1121] font-semibold hover:bg-[#FBBF24] px-8"
                  onClick={() => navigate('/auth')}
                >
                  Start Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#1A2332] text-white hover:bg-[#1A2332] bg-transparent px-8"
                  onClick={() => {
                    const el = document.querySelector('#pricing');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  See Pricing
                </Button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 sm:gap-12">
                <AnimatedStat value={50} suffix="K+" label="Users" />
                <div className="w-px h-10 bg-[#1A2332]" />
                <AnimatedStat value={2} suffix="M+" label="Saved" />
                <div className="w-px h-10 bg-[#1A2332]" />
                <AnimatedStat value={4.9} suffix="" label="Rating" />
              </div>
            </motion.div>

            {/* Right: Dashboard image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_DEFAULT }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#1A2332]">
                <img
                  src="/hero-dashboard.png"
                  alt="FinTrack Dashboard"
                  className="w-full"
                />
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1121]/30 to-transparent pointer-events-none" />
              </div>
              {/* Floating decoration */}
              <div
                className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-20 blur-2xl"
                style={{ background: '#F59E0B' }}
              />
              <div
                className="absolute -top-4 -right-4 w-32 h-32 rounded-full opacity-15 blur-3xl"
                style={{ background: '#F59E0B' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  LOGO MARQUEE                                               */}
      {/* ============================================================ */}
      <section className="py-10 border-y border-[#1A2332] overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">
            Trusted by innovative teams
          </span>
        </motion.div>
        <div className="relative">
          <div className="flex animate-marquee gap-16 items-center justify-center">
            {['Notion', 'Stripe', 'Figma', 'Vercel', 'Linear', 'Shopify'].map(
              (name) => (
                <span
                  key={name}
                  className="text-slate-600 text-lg font-semibold tracking-tight whitespace-nowrap select-none"
                >
                  {name}
                </span>
              )
            )}
            {['Notion', 'Stripe', 'Figma', 'Vercel', 'Linear', 'Shopify'].map(
              (name) => (
                <span
                  key={`${name}-dup`}
                  className="text-slate-600 text-lg font-semibold tracking-tight whitespace-nowrap select-none"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURES                                                   */}
      {/* ============================================================ */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              Everything you need to master your finances
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Powerful tools designed to give you complete control over your
              financial life.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                {...staggerChild}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group p-6 rounded-2xl bg-[#1A2332] border border-white/5 hover:shadow-xl hover:shadow-[#F59E0B]/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center mb-4 group-hover:bg-[#F59E0B]/25 transition-colors">
                  <f.icon className="size-6 text-[#F59E0B]" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                               */}
      {/* ============================================================ */}
      <section className="py-20 lg:py-28 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              How it Works
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Get started in minutes and take control of your finances today.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-[28px] left-[16%] right-[16%] h-0.5 bg-[#1A2332]" />

            <motion.div
              {...staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
            >
              {[
                {
                  step: 1,
                  title: 'Sign Up',
                  desc: 'Create your free account in seconds.',
                },
                {
                  step: 2,
                  title: 'Connect Accounts',
                  desc: 'Link your bank accounts securely.',
                },
                {
                  step: 3,
                  title: 'Set Budgets',
                  desc: 'Create budgets for your spending.',
                },
                {
                  step: 4,
                  title: 'Track & Save',
                  desc: 'Watch your savings grow over time.',
                },
              ].map((item) => (
                <motion.div key={item.step} {...staggerChild} className="text-center">
                  <div className="w-14 h-14 rounded-full bg-[#F59E0B] text-[#0B1121] font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#F59E0B]/20">
                    {item.step}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm max-w-[200px] mx-auto">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TESTIMONIALS                                               */}
      {/* ============================================================ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              Loved by thousands
            </h2>
            <p className="text-slate-400 text-lg">
              See what our users have to say about FinTrack.
            </p>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                {...staggerChild}
                className="p-6 rounded-2xl bg-[#1A2332] border border-white/5"
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-[#F59E0B] text-[#F59E0B]"
                    />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] font-semibold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PRICING PREVIEW                                            */}
      {/* ============================================================ */}
      <section id="pricing" className="py-20 lg:py-28 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              Simple, transparent pricing
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Choose the plan that fits your needs.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-[#0B1121] border border-[#1A2332]">
              <button
                onClick={() => setPricingInterval('monthly')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border-0',
                  pricingInterval === 'monthly'
                    ? 'bg-[#1A2332] text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingInterval('yearly')}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border-0',
                  pricingInterval === 'yearly'
                    ? 'bg-[#1A2332] text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                Yearly
                <Badge
                  variant="secondary"
                  className="ml-2 bg-[#F59E0B]/15 text-[#F59E0B] text-[10px] border-0"
                >
                  Save 17%
                </Badge>
              </button>
            </div>
          </motion.div>

          <motion.div
            {...staggerContainer}
            className="grid md:grid-cols-3 gap-6 lg:gap-8"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                {...staggerChild}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'relative p-6 lg:p-8 rounded-2xl border transition-all duration-300',
                  plan.popular
                    ? 'bg-[#1A2332] border-[#F59E0B]/30 shadow-lg shadow-[#F59E0B]/5'
                    : 'bg-[#0B1121] border-[#1A2332]'
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-[#0B1121] font-semibold text-xs px-3 py-1 border-0">
                    Most Popular
                  </Badge>
                )}
                <h3 className="text-white font-semibold text-xl mb-1">
                  {plan.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    ${
                      pricingInterval === 'monthly'
                        ? plan.monthlyPrice
                        : plan.yearlyPrice
                    }
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-slate-400 text-sm">
                      /{pricingInterval === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <Check className="size-4 text-[#F59E0B] shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={cn(
                    'w-full h-11 font-semibold',
                    plan.popular
                      ? 'bg-[#F59E0B] text-[#0B1121] hover:bg-[#FBBF24]'
                      : 'bg-[#1A2332] text-white hover:bg-[#1A2332]/80 border border-[#1A2332]'
                  )}
                  onClick={() => navigate('/auth')}
                >
                  {plan.monthlyPrice === 0 ? 'Get Started' : 'Start Free Trial'}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FAQ                                                        */}
      {/* ============================================================ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-lg">
              Everything you need to know about FinTrack.
            </p>
          </motion.div>

          <motion.div {...fadeUp}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-xl bg-[#1A2332] border border-white/5 px-5 data-[state=open]:border-[#F59E0B]/20"
                >
                  <AccordionTrigger className="text-white text-sm font-medium hover:no-underline py-4 [&>svg]:text-slate-400">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 text-sm leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA BANNER                                                 */}
      {/* ============================================================ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            className="relative rounded-3xl p-10 lg:p-16 text-center overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #F59E0B 100%)',
            }}
          >
            <div className="relative z-10">
              <h2
                className="text-3xl sm:text-4xl font-bold text-[#0B1121] mb-4"
                style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
              >
                Ready to take control?
              </h2>
              <p className="text-[#0B1121]/70 text-lg max-w-lg mx-auto mb-8">
                Join 50,000+ users who are already mastering their finances
                with FinTrack.
              </p>
              <Button
                size="lg"
                className="bg-[#0B1121] text-white font-semibold hover:bg-[#111827] px-8 h-12"
                onClick={() => navigate('/auth')}
              >
                Start Your Free Trial
              </Button>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                     */}
      {/* ============================================================ */}
      <LandingFooter />
    </div>
  );
}
