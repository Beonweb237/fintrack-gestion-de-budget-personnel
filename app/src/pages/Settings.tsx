import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { plans } from '@/data/saasData';
import { cn } from '@/lib/utils';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import {
  User,
  Camera,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Trash2,
  AlertTriangle,
  Save,
  Monitor,
  Smartphone,
  ChevronRight,
  FileText,
} from 'lucide-react';

/* ─── Animations ─── */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } },
};

const tabContentVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.15 } },
};

/* ─── Data ─── */
const languages = [
  { code: 'en', label: 'English', flag: '\uD83C\uDDFA\uD83C\uDDF8' },
  { code: 'fr', label: 'French', flag: '\uD83C\uDDEB\uD83C\uDDF7' },
  { code: 'es', label: 'Spanish', flag: '\uD83C\uDDEA\uD83C\uDDF8' },
];

const currencies = ['USD', 'EUR', 'GBP'];

const dateFormats = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

const timezones = [
  'UTC',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Auckland',
];

const notificationItems = [
  { key: 'budgetAlerts', label: 'Budget alerts', description: 'Get notified when a budget reaches 90%' },
  { key: 'goalReminders', label: 'Goal reminders', description: 'Weekly notifications on your savings goals' },
  { key: 'weeklySummary', label: 'Weekly summary', description: 'Weekly financial recap by email' },
  { key: 'newFeatures', label: 'New features', description: 'Be the first to know about new features' },
  { key: 'billDue', label: 'Bill due', description: 'Reminders when bills are approaching due date' },
  { key: 'securityAlerts', label: 'Account security', description: 'Suspicious login notifications', disabled: true },
];

const mockSessions = [
  { id: 'sess-1', device: 'MacBook Pro', os: 'macOS Sonoma', browser: 'Chrome 125', location: 'Paris, France', ip: '192.168.1.***', lastActive: '2025-05-28T14:30:00Z', isCurrent: true },
  { id: 'sess-2', device: 'iPhone 15', os: 'iOS 17', browser: 'Safari', location: 'Paris, France', ip: '203.45.12.***', lastActive: '2025-05-28T09:15:00Z', isCurrent: false },
  { id: 'sess-3', device: 'iPad Air', os: 'iPadOS 17', browser: 'Chrome', location: 'Lyon, France', ip: '78.210.5.***', lastActive: '2025-05-25T18:00:00Z', isCurrent: false },
];

/* ═══════════════════════════════════════════
   TAB 1 — Profile
   ═══════════════════════════════════════════ */
function ProfileTab({ user, updateUser }: { user: any; updateUser: (u: any) => void }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleSave = () => {
    updateUser({ name: form.name, email: form.email, bio: form.bio });
    toast.success('Profile updated');
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Personal Information</CardTitle>
            <CardDescription className="font-body-sm text-neutral-300">
              Manage your profile details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-warm-gray border-[3px] border-warm-white shadow-md flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-neutral-400" />
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={16} className="text-white mb-0.5" />
                  <span className="text-[10px] text-white font-medium">Change</span>
                </div>
              </div>
              <div>
                <p className="font-body text-neutral-200 font-medium">{form.name}</p>
                <p className="font-caption text-neutral-400">{form.email}</p>
              </div>
            </div>

            <Separator className="bg-warm-gray" />

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">FULL NAME</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-overline text-neutral-300">EMAIL</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="font-overline text-neutral-300">BIO (OPTIONAL)</Label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell us a little about yourself"
                  className="rounded-lg border-neutral-500 focus:border-accent-gold min-h-[80px]"
                />
              </div>
              <Button
                onClick={handleSave}
                className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold h-11 rounded-lg px-6"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   TAB 2 — Regional
   ═══════════════════════════════════════════ */
function RegionalTab({ user, updateUser }: { user: any; updateUser: (u: any) => void }) {
  const [lang, setLang] = useState(user?.language || 'en');
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [dateFmt, setDateFmt] = useState(user?.dateFormat || 'MM/DD/YYYY');
  const [tz, setTz] = useState(user?.timezone || 'Europe/Paris');

  const previewDate = useMemo(() => {
    const d = new Date(2025, 11, 25);
    if (dateFmt === 'DD/MM/YYYY') return d.toLocaleDateString('en-GB');
    if (dateFmt === 'YYYY-MM-DD') return d.toISOString().split('T')[0];
    return d.toLocaleDateString('en-US');
  }, [dateFmt]);

  const previewCurrency = useMemo(() => {
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang === 'fr' ? 'fr-FR' : 'es-ES', {
      style: 'currency',
      currency,
    }).format(1234.56);
  }, [lang, currency]);

  const handleSave = () => {
    updateUser({ language: lang, currency, dateFormat: dateFmt, timezone: tz });
    toast.success('Regional preferences saved');
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Regional Preferences</CardTitle>
            <CardDescription className="font-body-sm text-neutral-300">
              Language, currency, date format, and timezone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            {/* Language */}
            <div className="space-y-2">
              <Label className="font-overline text-neutral-300">LANGUAGE</Label>
              <div className="grid grid-cols-3 gap-3">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      lang === l.code
                        ? 'border-accent-gold bg-accent-gold/5 text-accent-gold'
                        : 'border-warm-gray bg-warm-cream text-neutral-400 hover:border-neutral-300'
                    )}
                  >
                    <span className="text-2xl">{l.flag}</span>
                    <span className="font-body-sm font-medium">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Currency */}
            <div className="space-y-1.5">
              <Label className="font-overline text-neutral-300">CURRENCY</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Format */}
            <div className="space-y-1.5">
              <Label className="font-overline text-neutral-300">DATE FORMAT</Label>
              <div className="flex gap-2">
                {dateFormats.map((df) => (
                  <button
                    key={df.value}
                    onClick={() => setDateFmt(df.value)}
                    className={cn(
                      'px-4 py-2 rounded-lg border-2 font-body-sm transition-all',
                      dateFmt === df.value
                        ? 'border-accent-gold bg-accent-gold/5 text-accent-gold'
                        : 'border-warm-gray text-neutral-400 hover:border-neutral-300'
                    )}
                  >
                    {df.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
              <Label className="font-overline text-neutral-300">TIMEZONE</Label>
              <Select value={tz} onValueChange={setTz}>
                <SelectTrigger className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold w-full max-w-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Live preview */}
            <div className="bg-warm-cream border border-warm-gray rounded-xl p-4 flex items-center gap-2">
              <Globe size={16} className="text-accent-gold" />
              <span className="font-body-sm text-neutral-300">
                Sample: <strong className="text-neutral-200">{previewDate}</strong> &rarr;{' '}
                <strong className="text-neutral-200">{previewCurrency}</strong>
              </span>
            </div>

            <Button
              onClick={handleSave}
              className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold h-11 rounded-lg px-6"
            >
              <Save size={16} className="mr-2" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   TAB 3 — Notifications
   ═══════════════════════════════════════════ */
function NotificationsTab() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    budgetAlerts: true,
    goalReminders: true,
    weeklySummary: false,
    newFeatures: true,
    billDue: false,
    securityAlerts: true,
  });
  const [frequency, setFrequency] = useState('daily');

  const toggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success('Notification settings saved');
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Notification Preferences</CardTitle>
            <CardDescription className="font-body-sm text-neutral-300">
              Choose what you want to be notified about
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 pt-5">
            {notificationItems.map(({ key, label, description, disabled }) => (
              <div
                key={key}
                className="flex items-center justify-between py-3.5 border-b border-warm-gray last:border-0"
              >
                <div className="space-y-0.5">
                  <Label
                    htmlFor={key}
                    className={cn('font-body text-neutral-200 cursor-pointer', disabled && 'text-neutral-400')}
                  >
                    {label}
                  </Label>
                  <p className={cn('font-caption', disabled ? 'text-neutral-400' : 'text-neutral-300')}>
                    {description}
                  </p>
                </div>
                <Switch
                  id={key}
                  checked={settings[key]}
                  onCheckedChange={() => toggle(key)}
                  disabled={disabled}
                  className="data-[state=checked]:bg-accent-gold"
                />
              </div>
            ))}

            <Separator className="my-4 bg-warm-gray" />

            <div className="space-y-1.5">
              <Label className="font-overline text-neutral-300">EMAIL FREQUENCY</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="daily">Daily digest</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSave}
                className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold h-11 rounded-lg px-6"
              >
                <Save size={16} className="mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   TAB 4 — Security
   ═══════════════════════════════════════════ */
function SecurityTab() {
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const passwordStrength = useMemo(() => {
    const pwd = passwordForm.new;
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 8) s += 25;
    if (/[A-Z]/.test(pwd)) s += 25;
    if (/[0-9]/.test(pwd)) s += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) s += 25;
    return s;
  }, [passwordForm.new]);

  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthIdx = Math.min(3, Math.floor(passwordStrength / 25));

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordStrength < 50) {
      toast.error('Password is too weak');
      return;
    }
    toast.success('Password updated successfully');
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-5">
      {/* Change Password */}
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Change Password</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <Label className="font-overline text-neutral-300">CURRENT PASSWORD</Label>
                <Input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))}
                  className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-overline text-neutral-300">NEW PASSWORD</Label>
                <Input
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, new: e.target.value }))}
                  className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold"
                />
                {passwordForm.new && (
                  <div className="space-y-1 pt-1">
                    <Progress value={passwordStrength} className="h-1.5 bg-warm-gray" />
                    <p className={cn('font-caption', strengthIdx >= 2 ? 'text-green-600' : 'text-orange-500')}>
                      {strengthLabel[strengthIdx]}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="font-overline text-neutral-300">CONFIRM PASSWORD</Label>
                <Input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
                  className="h-11 rounded-lg border-neutral-500 focus:border-accent-gold"
                />
              </div>
              <Button
                type="submit"
                className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold h-11 rounded-lg px-6"
              >
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two-Factor Auth */}
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="font-h3 text-neutral-100">Two-Factor Authentication</CardTitle>
              <Switch
                checked={tfaEnabled}
                onCheckedChange={(v) => {
                  setTfaEnabled(v);
                  setShowQr(v);
                  if (v) toast.success('2FA enabled — scan the QR code');
                }}
                className="data-[state=checked]:bg-accent-gold"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {showQr && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-col items-center gap-3 p-5 bg-warm-cream rounded-xl border border-warm-gray"
              >
                <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center border border-warm-gray">
                  {/* QR placeholder */}
                  <div className="grid grid-cols-5 grid-rows-5 gap-0.5 w-24 h-24">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'bg-neutral-800',
                          [0, 1, 2, 5, 6, 7, 10, 11, 12, 16, 17, 22].includes(i) ? 'opacity-100' : 'opacity-30'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="font-caption text-neutral-400">Scan with your authenticator app</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Sessions */}
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {mockSessions.map((sess) => (
              <div
                key={sess.id}
                className="flex items-center justify-between rounded-xl border border-warm-gray bg-warm-cream p-4"
              >
                <div className="flex items-center gap-3">
                  {sess.isCurrent ? (
                    <Monitor size={18} className="text-accent-gold" />
                  ) : (
                    <Smartphone size={18} className="text-neutral-400" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-body-sm text-neutral-200 font-medium">{sess.device}</p>
                      {sess.isCurrent && (
                        <Badge
                          variant="outline"
                          className="border-accent-gold text-accent-gold font-caption text-[10px]"
                        >
                          This device
                        </Badge>
                      )}
                    </div>
                    <p className="font-caption text-neutral-400">
                      {sess.os} &middot; {sess.browser} &middot; {sess.location} &middot;{' '}
                      {new Date(sess.lastActive).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                {!sess.isCurrent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.success('Session revoked')}
                    className="text-neutral-400 hover:text-danger hover:bg-danger-light rounded-lg h-8 font-body-sm"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   TAB 5 — Billing
   ═══════════════════════════════════════════ */
function BillingTab({ subscription }: { subscription: any }) {
  const navigate = useNavigate();
  const currentPlan = plans.find((p) => p.id === subscription.planId)!;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={item}>
        <Card className="shadow-card border-warm-gray bg-warm-white">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-neutral-100">Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent-gold/15 flex items-center justify-center">
                  <CreditCard size={22} className="text-accent-gold" />
                </div>
                <div>
                  <p className="font-h4 text-neutral-100">{currentPlan.name}</p>
                  <p className="font-caption text-neutral-400">
                    {currentPlan.monthlyPrice === 0
                      ? 'Free plan'
                      : `$${currentPlan.monthlyPrice}/month`}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'font-caption',
                  subscription.status === 'active'
                    ? 'border-green-500 text-green-600'
                    : 'border-orange-400 text-orange-500'
                )}
              >
                {subscription.status === 'active' ? 'Active' : subscription.status}
              </Badge>
            </div>

            <Separator className="bg-warm-gray" />

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate('/subscription')}
                className="bg-accent-gold hover:bg-accent-gold/90 text-neutral-100 font-semibold rounded-lg h-10 px-5"
              >
                Manage Subscription
                <ChevronRight size={14} className="ml-1" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/billing')}
                className="border-neutral-500 text-neutral-200 hover:border-accent-gold hover:bg-warm-white rounded-lg h-10 px-5"
              >
                <FileText size={14} className="mr-1.5" />
                View Invoices
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   TAB 6 — Danger Zone
   ═══════════════════════════════════════════ */
function DangerZoneTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    setDialogOpen(false);
    setConfirmText('');
    toast.success('Account deletion requested');
  };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={item}>
        <Card className="shadow-card border-red-200 bg-red-50/30">
          <CardHeader className="pb-0">
            <CardTitle className="font-h3 text-danger flex items-center gap-2">
              <AlertTriangle size={20} />
              Danger Zone
            </CardTitle>
            <CardDescription className="font-body-sm text-neutral-300">
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-body text-neutral-200 font-medium">Delete Account</p>
                <p className="font-caption text-neutral-400 max-w-md">
                  This will permanently delete all your data, transactions, categories, and goals.
                  This action cannot be undone.
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setDialogOpen(true)}
                className="bg-danger/10 text-danger hover:bg-danger hover:text-white rounded-lg h-10 font-semibold px-5"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete confirmation dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-warm-white border-red-200 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-h3 text-danger flex items-center gap-2">
              <AlertTriangle size={20} />
              Delete your account?
            </DialogTitle>
            <DialogDescription className="font-body-sm text-neutral-300">
              All data will be permanently removed within 30 days per our data deletion policy.
              Type <strong className="text-danger">DELETE</strong> to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="h-11 rounded-lg border-red-300 focus:border-danger focus:ring-danger/15"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setConfirmText('');
              }}
              className="border-neutral-500 text-neutral-200 hover:bg-warm-cream rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-danger hover:bg-danger/90 text-white font-semibold rounded-lg"
            >
              I understand, delete my account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN — Settings Page
   ═══════════════════════════════════════════ */
export default function Settings() {
  const { user, updateUser } = useAuth();
  const { subscription } = useSubscription();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="font-body text-neutral-300">Please sign in to access settings.</p>
      </div>
    );
  }

  const tabs = [
    { value: 'profile', label: 'Profile', Icon: User },
    { value: 'regional', label: 'Regional', Icon: Globe },
    { value: 'notifications', label: 'Notifications', Icon: Bell },
    { value: 'security', label: 'Security', Icon: Shield },
    { value: 'billing', label: 'Billing', Icon: CreditCard },
    { value: 'danger', label: 'Danger', Icon: AlertTriangle },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="font-h2 text-neutral-100" style={{ fontSize: 28 }}>
          Settings
        </h1>
        <p className="font-body text-neutral-300 mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-warm-cream border border-warm-gray p-1 rounded-xl h-auto flex flex-wrap gap-1">
            {tabs.map(({ value, label, Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className={cn(
                  'rounded-lg px-4 py-2 font-body-sm transition-all data-[state=active]:shadow-sm',
                  value === 'danger'
                    ? 'data-[state=active]:bg-danger/10 data-[state=active]:text-danger data-[state=active]:font-medium text-neutral-400'
                    : 'data-[state=active]:bg-accent-gold data-[state=active]:text-neutral-100 text-neutral-400'
                )}
              >
                <Icon size={15} className="mr-1.5" />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <TabsContent value="profile" className="mt-0">
                  <ProfileTab user={user} updateUser={updateUser} />
                </TabsContent>
                <TabsContent value="regional" className="mt-0">
                  <RegionalTab user={user} updateUser={updateUser} />
                </TabsContent>
                <TabsContent value="notifications" className="mt-0">
                  <NotificationsTab />
                </TabsContent>
                <TabsContent value="security" className="mt-0">
                  <SecurityTab />
                </TabsContent>
                <TabsContent value="billing" className="mt-0">
                  <BillingTab subscription={subscription} />
                </TabsContent>
                <TabsContent value="danger" className="mt-0">
                  <DangerZoneTab />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
