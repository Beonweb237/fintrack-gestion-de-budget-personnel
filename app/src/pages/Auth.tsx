import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Chrome,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'register' | 'forgot';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function Auth() {
  const navigate = useNavigate();
  const { login, updateUser } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [resetSent, setResetSent] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'][passwordStrength - 1] || '';
  const strengthColor = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-emerald-500',
  ][passwordStrength - 1] || 'bg-slate-700';

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const clearErrors = () => setErrors({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const newErrors: FormErrors = {};

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setErrors({ email: 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const newErrors: FormErrors = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) newErrors.terms = 'You must agree to the terms';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Simulate registration by setting user data then logging in
      updateUser({ name, email });
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setErrors({ email: 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const newErrors: FormErrors = {};

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email format';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResetSent(true);
    }, 1500);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    clearErrors();
    setResetSent(false);
    setPassword('');
    setConfirmPassword('');
    setAgreeTerms(false);
  };

  return (
    <div className="min-h-[100dvh] flex bg-[#0B1121]">
      {/* Left panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative flex-col justify-between overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0B1121 0%, #111827 100%)' }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 p-12 pt-16">
          <div className="flex items-center gap-1 mb-6">
            <span
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
            >
              FinTrack
            </span>
            <span className="text-[#F59E0B] text-4xl leading-none">.</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
            Welcome to<br />FinTrack
          </h1>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
            Join 50,000+ users mastering their finances with our intelligent
            budget tracker.
          </p>
        </div>

        <div className="relative z-10 p-12">
          <img
            src="/hero-dashboard.png"
            alt="FinTrack Dashboard"
            className="w-full max-w-lg rounded-xl opacity-60 shadow-2xl border border-white/5"
          />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {/* LOGIN MODE */}
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Mobile logo */}
                <div className="flex items-center gap-1 mb-8 lg:hidden">
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  >
                    FinTrack
                  </span>
                  <span className="text-[#F59E0B] text-3xl leading-none">.</span>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                <p className="text-slate-400 mb-8">
                  Sign in to access your dashboard.
                </p>

                {/* Google OAuth */}
                <Button
                  variant="outline"
                  className="w-full h-11 bg-transparent border-[#1A2332] text-white hover:bg-[#1A2332] hover:text-white mb-6"
                >
                  <Chrome className="size-4 mr-2" />
                  Continue with Google
                </Button>

                <div className="flex items-center gap-4 mb-6">
                  <Separator className="flex-1 bg-[#1A2332]" />
                  <span className="text-slate-500 text-xs uppercase tracking-wider">
                    or
                  </span>
                  <Separator className="flex-1 bg-[#1A2332]" />
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        'h-11 bg-[#111827] border-[#1A2332] text-white placeholder:text-slate-600 focus-visible:ring-[#F59E0B]/30',
                        errors.email && 'border-red-500 focus-visible:ring-red-500/30'
                      )}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn(
                          'h-11 pr-10 bg-[#111827] border-[#1A2332] text-white placeholder:text-slate-600 focus-visible:ring-[#F59E0B]/30',
                          errors.password && 'border-red-500 focus-visible:ring-red-500/30'
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-0"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="size-4 rounded border-[#1A2332] bg-[#111827] accent-[#F59E0B]"
                      />
                      <span className="text-slate-400 text-sm">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-[#F59E0B] text-sm hover:underline cursor-pointer bg-transparent border-0"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#F59E0B] text-[#0B1121] font-semibold hover:bg-[#FBBF24] transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 border-2 border-[#0B1121]/30 border-t-[#0B1121] rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <>
                        <LogIn className="size-4" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-slate-400 text-sm text-center mt-6">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="text-[#F59E0B] font-medium hover:underline cursor-pointer bg-transparent border-0"
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>
            )}

            {/* REGISTER MODE */}
            {mode === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-1 mb-8 lg:hidden">
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  >
                    FinTrack
                  </span>
                  <span className="text-[#F59E0B] text-3xl leading-none">.</span>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">
                  Create Account
                </h2>
                <p className="text-slate-400 mb-8">
                  Get started with your free account.
                </p>

                {/* Google OAuth */}
                <Button
                  variant="outline"
                  className="w-full h-11 bg-transparent border-[#1A2332] text-white hover:bg-[#1A2332] hover:text-white mb-6"
                >
                  <Chrome className="size-4 mr-2" />
                  Continue with Google
                </Button>

                <div className="flex items-center gap-4 mb-6">
                  <Separator className="flex-1 bg-[#1A2332]" />
                  <span className="text-slate-500 text-xs uppercase tracking-wider">
                    or
                  </span>
                  <Separator className="flex-1 bg-[#1A2332]" />
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={cn(
                        'h-11 bg-[#111827] border-[#1A2332] text-white placeholder:text-slate-600 focus-visible:ring-[#F59E0B]/30',
                        errors.name && 'border-red-500 focus-visible:ring-red-500/30'
                      )}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        'h-11 bg-[#111827] border-[#1A2332] text-white placeholder:text-slate-600 focus-visible:ring-[#F59E0B]/30',
                        errors.email && 'border-red-500 focus-visible:ring-red-500/30'
                      )}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn(
                          'h-11 pr-10 bg-[#111827] border-[#1A2332] text-white placeholder:text-slate-600 focus-visible:ring-[#F59E0B]/30',
                          errors.password && 'border-red-500 focus-visible:ring-red-500/30'
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-0"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {password.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-1.5 bg-[#1A2332] rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full transition-all', strengthColor)}
                              style={{
                                width: `${(passwordStrength / 4) * 100}%`,
                              }}
                            />
                          </div>
                          <span className={cn('text-xs font-medium', passwordStrength === 1 ? 'text-red-400' : passwordStrength === 2 ? 'text-orange-400' : passwordStrength === 3 ? 'text-yellow-400' : 'text-emerald-400')}>
                            {strengthLabel}
                          </span>
                        </div>
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm font-medium block mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={cn(
                          'h-11 pr-10 bg-[#111827] border-[#1A2332] text-white placeholder:text-slate-600 focus-visible:ring-[#F59E0B]/30',
                          errors.confirmPassword && 'border-red-500 focus-visible:ring-red-500/30'
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer bg-transparent border-0"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="size-4 mt-0.5 rounded border-[#1A2332] bg-[#111827] accent-[#F59E0B]"
                    />
                    <span className="text-slate-400 text-sm leading-relaxed">
                      I agree to the{' '}
                      <button type="button" className="text-[#F59E0B] hover:underline bg-transparent border-0 cursor-pointer">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-[#F59E0B] hover:underline bg-transparent border-0 cursor-pointer">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-red-400 text-xs -mt-2">{errors.terms}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#F59E0B] text-[#0B1121] font-semibold hover:bg-[#FBBF24] transition-colors"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 border-2 border-[#0B1121]/30 border-t-[#0B1121] rounded-full animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      <>
                        <UserPlus className="size-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-slate-400 text-sm text-center mt-6">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-[#F59E0B] font-medium hover:underline cursor-pointer bg-transparent border-0"
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}

            {/* FORGOT PASSWORD MODE */}
            {mode === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-1 mb-8 lg:hidden">
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-serif), Georgia, serif' }}
                  >
                    FinTrack
                  </span>
                  <span className="text-[#F59E0B] text-3xl leading-none">.</span>
                </div>

                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors cursor-pointer bg-transparent border-0"
                >
                  <ArrowLeft size={16} />
                  Back to sign in
                </button>

                <h2 className="text-3xl font-bold text-white mb-2">
                  Reset Password
                </h2>
                <p className="text-slate-400 mb-8">
                  Enter your email and we'll send you a reset link.
                </p>

                {resetSent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center p-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                      <Check className="size-6 text-emerald-400" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      Check your inbox
                    </h3>
                    <p className="text-slate-400 text-sm">
                      We've sent a password reset link to{' '}
                      <span className="text-white">{email}</span>.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleForgot} className="space-y-4">
                    <div>
                      <label className="text-slate-300 text-sm font-medium block mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn(
                          'h-11 bg-[#111827] border-[#1A2332] text-white placeholder:text-slate-600 focus-visible:ring-[#F59E0B]/30',
                          errors.email && 'border-red-500 focus-visible:ring-red-500/30'
                        )}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 bg-[#F59E0B] text-[#0B1121] font-semibold hover:bg-[#FBBF24] transition-colors"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="size-4 border-2 border-[#0B1121]/30 border-t-[#0B1121] rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
