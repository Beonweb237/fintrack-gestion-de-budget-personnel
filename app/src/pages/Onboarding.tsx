import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, Wallet, BarChart3, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();

  // Profile form state
  const [fullName, setFullName] = useState('Alexandre Martin');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const [monthlyIncome, setMonthlyIncome] = useState('');

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const goToPricing = () => {
    navigate('/pricing');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const currencies = ['USD', 'EUR', 'GBP'];
  const languages = ['English', 'Francais', 'Espanol'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i <= step ? '#F59E0B' : '#D1D5DB',
              transform: i === step ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Card container */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 min-h-[420px] relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 && (
            <motion.div
              key="step0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center h-full"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: '#FEF3C7' }}
              >
                <Wallet className="w-10 h-10" style={{ color: '#F59E0B' }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to FinTrack!
              </h2>
              <p className="text-gray-600 mb-8 max-w-sm">
                Let&apos;s get you set up in just a few steps
              </p>
              <div className="flex flex-col gap-3 w-full max-w-xs mt-auto">
                <Button
                  onClick={goToPricing}
                  variant="outline"
                  className="w-full py-5 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Choose a Plan
                </Button>
                <Button
                  onClick={nextStep}
                  className="w-full py-5 text-sm font-medium text-gray-900"
                  style={{ backgroundColor: '#F59E0B' }}
                >
                  Continue with Free
                </Button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
                Your Profile
              </h2>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Personalize your FinTrack experience
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {languages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Monthly Income (optional)
                  </label>
                  <Input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 py-5 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1 py-5 text-sm font-medium text-gray-900"
                  style={{ backgroundColor: '#F59E0B' }}
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
                Quick Tour
              </h2>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Here&apos;s what you can do with FinTrack
              </p>

              <div className="grid grid-cols-1 gap-4 mb-6">
                {/* Dashboard card */}
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                  <div
                    className="h-28 flex items-center justify-center"
                    style={{ backgroundColor: '#D4A853' }}
                  >
                    <BarChart3 className="w-12 h-12 text-white/80" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-4 h-4 text-amber-600" />
                      <h3 className="font-semibold text-gray-900">Your Dashboard</h3>
                    </div>
                    <p className="text-xs text-gray-500">
                      Get a complete overview of your finances at a glance
                    </p>
                  </div>
                </div>

                {/* Transactions card */}
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                  <div
                    className="h-28 flex items-center justify-center"
                    style={{ backgroundColor: '#2563EB' }}
                  >
                    <Wallet className="w-12 h-12 text-white/80" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Track Transactions</h3>
                    </div>
                    <p className="text-xs text-gray-500">
                      Log income and expenses with categories and tags
                    </p>
                  </div>
                </div>

                {/* Budgets card */}
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                  <div
                    className="h-28 flex items-center justify-center"
                    style={{ backgroundColor: '#16A34A' }}
                  >
                    <Target className="w-12 h-12 text-white/80" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Set Budgets</h3>
                    </div>
                    <p className="text-xs text-gray-500">
                      Create budgets and get alerts when you&apos;re close to limits
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1 py-5 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1 py-5 text-sm font-medium text-gray-900"
                  style={{ backgroundColor: '#F59E0B' }}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center h-full justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: 0.1,
                }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: '#DCFCE7', border: '3px solid #16A34A' }}
              >
                <Check className="w-10 h-10" style={{ color: '#16A34A' }} />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                You&apos;re all set!
              </h2>
              <p className="text-gray-600 mb-8 max-w-sm">
                Your account is ready. Start tracking your finances and reach your goals.
              </p>

              <Button
                onClick={goToDashboard}
                className="w-full max-w-xs py-5 text-sm font-medium text-gray-900"
                style={{ backgroundColor: '#F59E0B' }}
              >
                Start using FinTrack
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Step indicator text */}
      <p className="text-xs text-gray-400 mt-4">
        Step {step + 1} of 4
      </p>
    </div>
  );
}
