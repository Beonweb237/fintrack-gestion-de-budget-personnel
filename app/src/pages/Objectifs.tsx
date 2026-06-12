import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Flag,
  TrendingUp,
  Clock,
  Plus,
  MoreHorizontal,
  Calendar,
  History,
  Check,
  Plane,
  Car,
  Shield,
  Laptop,
  Home,
  Heart,
  Gift,
  BookOpen,
  Camera,
  Bike,
  Coffee,
  Music,
  Zap,
  Sun,
  Moon,
  Star,
  Briefcase,
  GraduationCap,
  Trash2,
  Pencil,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  mockGoals,
  colorPresets,
  iconOptions,
  getMotivationalMessage,
  formatCurrency,
  formatDate,
  daysUntil,
  getMonthContribution,
} from '@/data/mockData';
import type { SavingsGoal } from '@/data/mockData';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// ─── Icon Map ────────────────────────────────────────────────────────

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Plane, Car, Shield, Laptop, Home, Heart,
  Gift, BookOpen, Camera, Bike, Coffee, Music,
  Zap, Sun, Moon, Star, Briefcase, GraduationCap,
};

function GoalIcon({ icon, size = 20, className, color }: { icon: string; size?: number; className?: string; color?: string }) {
  const Icon = iconMap[icon] || Target;
  return (
    <span style={color ? { color, display: 'inline-flex', lineHeight: 1 } : undefined}>
      <Icon size={size} className={className} />
    </span>
  );
}

// ─── Animated Circular Progress Ring ─────────────────────────────────

function ProgressRing({
  progress,
  color,
  size = 140,
  strokeWidth = 6,
  showPercentage = true,
  delay = 0,
}: {
  progress: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  delay?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const offset = circumference - (clampedProgress / 100) * circumference;

  const [animatedOffset, setAnimatedOffset] = useState(circumference);
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedOffset(offset);
    }, delay);
    return () => clearTimeout(timer);
  }, [offset, delay]);

  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - start - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(animate);
        return;
      }
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayPercent(Math.round(eased * clampedProgress));
      if (t < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [clampedProgress, delay]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8E8E4"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-h2" style={{ color }}>
            {displayPercent}%
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Summary Stat Card ──────────────────────────────────────────────

function SummaryCard({
  icon: Icon,
  iconColor,
  iconBg,
  value,
  label,
  valueColor,
  bottomBar,
  delay = 0,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  iconBg: string;
  value: string;
  label: string;
  valueColor?: string;
  bottomBar?: { progress: number; color: string };
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="bg-warm-white rounded-xl shadow-card p-4 flex-1 min-w-[180px]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: iconBg }}>
          <span style={{ color: iconColor, display: 'inline-flex', lineHeight: 1 }}>
            <Icon size={20} />
          </span>
        </div>
      </div>
      <div className={cn('font-h2 font-mono', valueColor)} style={valueColor ? {} : { color: '#272727' }}>
        {value}
      </div>
      <div className="font-overline text-neutral-300 mt-1">{label}</div>
      {bottomBar && (
        <div className="mt-3 h-1 bg-warm-gray rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: bottomBar.color }}
            initial={{ width: 0 }}
            animate={{ width: `${bottomBar.progress}%` }}
            transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
          />
        </div>
      )}
    </motion.div>
  );
}

// ─── Goal Card ───────────────────────────────────────────────────────

function GoalCard({
  goal,
  index,
  onContribute,
  onViewDetails,
}: {
  goal: SavingsGoal;
  index: number;
  onContribute: (goal: SavingsGoal) => void;
  onViewDetails: (goal: SavingsGoal) => void;
}) {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const monthContribution = getMonthContribution(goal);
  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      }}
      whileHover={{ y: -3, boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)' }}
      className="bg-warm-white rounded-2xl shadow-card p-7 cursor-pointer transition-shadow duration-250"
      style={{ borderLeft: `4px solid ${goal.color}` }}
      onClick={() => onViewDetails(goal)}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${goal.color}26` }}
          >
            <GoalIcon icon={goal.icon} size={20} color={goal.color} />
          </div>
          <div>
            <h3 className="font-h3 text-neutral-100">{goal.name}</h3>
            {goal.description && (
              <p className="font-body-sm text-neutral-300 mt-0.5">{goal.description}</p>
            )}
          </div>
        </div>
        <button
          className="text-neutral-400 hover:text-neutral-200 transition-colors p-1"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Progress Ring */}
      <div className="flex flex-col items-center mt-6">
        <ProgressRing progress={progress} color={goal.color} size={140} delay={index * 100 + 300} />
        <div className="flex items-baseline gap-1 mt-4">
          <span className="font-h3 font-mono text-neutral-100">{formatCurrency(goal.currentAmount)}</span>
          <span className="font-body text-neutral-400"> / </span>
          <span className="font-body-lg font-mono text-neutral-300">{formatCurrency(goal.targetAmount)}</span>
        </div>
        <p className="font-body-sm mt-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#F5F4F0', color: goal.color }}>
          {getMotivationalMessage(progress)}
        </p>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-2 mt-5">
        {goal.deadline && (
          <div className="flex items-center gap-1.5 bg-warm-cream rounded-lg px-3 py-1.5">
            <Calendar size={14} className="text-neutral-300" />
            <span className="font-body-sm text-neutral-200">Echeance : {formatDate(goal.deadline)}</span>
          </div>
        )}
        {monthContribution > 0 && (
          <div className="flex items-center gap-1.5 bg-success-light rounded-lg px-3 py-1.5">
            <TrendingUp size={14} className="text-success" />
            <span className="font-body-sm text-success">+{formatCurrency(monthContribution)} ce mois</span>
          </div>
        )}
        {goal.deadline && (
          <div className="flex items-center gap-1.5 bg-warm-cream rounded-lg px-3 py-1.5">
            <Clock size={14} className="text-neutral-300" />
            <span className="font-body-sm text-neutral-300">{daysUntil(goal.deadline)} jours restants</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-5">
        <Button
          className="flex-1 h-10 bg-accent-gold text-neutral-100 hover:bg-accent-gold/90 rounded-[10px] font-semibold gap-2"
          onClick={(e) => {
            e.stopPropagation();
            onContribute(goal);
          }}
        >
          <Plus size={16} />
          Contribuer
        </Button>
        <Button
          variant="ghost"
          className="flex-1 h-10 rounded-[10px] gap-2 text-neutral-200 hover:bg-warm-cream"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(goal);
          }}
        >
          <History size={16} />
          Historique
        </Button>
      </div>

      {/* Mini progress bar */}
      <div className="mt-4">
        <div className="h-1 bg-warm-gray rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(100, progress)}%`, backgroundColor: goal.color }}
          />
        </div>
        <p className="font-caption text-neutral-400 mt-1.5 text-right">
          Reste {formatCurrency(remaining)}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Contribute Drawer ──────────────────────────────────────────────

function ContributeDrawer({
  goal,
  open,
  onClose,
  onContribute,
}: {
  goal: SavingsGoal | null;
  open: boolean;
  onClose: () => void;
  onContribute: (amount: number, note: string) => void;
}) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setAmount('');
      setNote('');
    }
  }, [open]);

  if (!goal) return null;

  const currentProgress = (goal.currentAmount / goal.targetAmount) * 100;
  const contributionAmount = parseFloat(amount.replace(',', '.')) || 0;
  const newAmount = goal.currentAmount + contributionAmount;
  const newProgress = Math.min(100, (newAmount / goal.targetAmount) * 100);

  const quickAmounts = [10, 50, 100, 500];

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-[420px] bg-warm-white p-0 border-l border-warm-gray">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-warm-gray">
          <SheetTitle className="font-h3 text-neutral-100">
            Contribuer a {goal.name}
          </SheetTitle>
        </SheetHeader>
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Current info mini ring */}
          <div className="flex items-center gap-4 p-4 bg-warm-cream rounded-xl">
            <ProgressRing progress={currentProgress} color={goal.color} size={60} strokeWidth={4} showPercentage={false} delay={0} />
            <div>
              <p className="font-body-sm text-neutral-300">Actuel</p>
              <p className="font-h4 font-mono text-neutral-100">{formatCurrency(goal.currentAmount)}</p>
            </div>
          </div>

          {/* Amount input */}
          <div className="space-y-2">
            <Label className="font-overline text-neutral-300">Montant</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-neutral-300">EUR</span>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
                className="h-11 pl-12 rounded-[10px] border-neutral-500 focus:border-accent-gold focus:ring-accent-gold/15 font-mono text-lg"
              />
            </div>
          </div>

          {/* Quick amounts */}
          <div className="flex gap-2">
            {quickAmounts.map((qa) => (
              <Button
                key={qa}
                variant="secondary"
                size="sm"
                className="flex-1 h-9 rounded-lg text-neutral-200 border border-neutral-500 hover:border-accent-gold hover:bg-warm-white"
                onClick={() => setAmount(qa.toString())}
              >
                {formatCurrency(qa)}
              </Button>
            ))}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label className="font-overline text-neutral-300">Note (optionnel)</Label>
            <Textarea
              placeholder="Ajouter une note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-[10px] border-neutral-500 focus:border-accent-gold focus:ring-accent-gold/15 min-h-[80px] resize-none"
            />
          </div>

          {/* Impact preview */}
          {contributionAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-warm-cream rounded-lg"
            >
              <p className="font-body-sm text-neutral-200">
                Apres cette contribution :{' '}
                <span className="font-mono font-semibold text-neutral-100">{formatCurrency(newAmount)}</span>
                {' '} / {formatCurrency(goal.targetAmount)} ({Math.round(newProgress)}%)
              </p>
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1 h-11 rounded-[10px]"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 h-11 bg-accent-gold text-neutral-100 hover:bg-accent-gold/90 rounded-[10px] font-semibold"
              disabled={contributionAmount <= 0}
              onClick={() => {
                onContribute(contributionAmount, note);
                onClose();
              }}
            >
              Contribuer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Create Goal Modal ──────────────────────────────────────────────

function CreateGoalModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (goal: SavingsGoal) => void;
}) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorPresets[0]);
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);

  useEffect(() => {
    if (open) {
      setName('');
      setTargetAmount('');
      setDeadline('');
      setDescription('');
      setSelectedColor(colorPresets[0]);
      setSelectedIcon(iconOptions[0]);
    }
  }, [open]);

  const monthlyNeeded = useMemo(() => {
    const target = parseFloat(targetAmount.replace(',', '.'));
    if (!target || !deadline) return null;
    const months = Math.max(1, Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
    return Math.ceil(target / months);
  }, [targetAmount, deadline]);

  const canSubmit = name.trim() && parseFloat(targetAmount.replace(',', '.')) > 0;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[520px] bg-warm-white border-0 rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-warm-gray">
          <DialogTitle className="font-h3 text-neutral-100">Nouvel objectif d&apos;epargne</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div className="space-y-2">
            <Label className="font-overline text-neutral-300">Nom</Label>
            <Input
              placeholder="Ex: Vacances au Japon"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-[10px] border-neutral-500 focus:border-accent-gold focus:ring-accent-gold/15"
            />
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <Label className="font-overline text-neutral-300">Montant cible</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-neutral-300">EUR</span>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
                className="h-11 pl-12 rounded-[10px] border-neutral-500 focus:border-accent-gold focus:ring-accent-gold/15 font-mono"
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label className="font-overline text-neutral-300">Date cible (optionnel)</Label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="h-11 rounded-[10px] border-neutral-500 focus:border-accent-gold focus:ring-accent-gold/15"
            />
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <Label className="font-overline text-neutral-300">Couleur</Label>
            <div className="flex flex-wrap gap-2">
              {colorPresets.map((color: string) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'w-9 h-9 rounded-full border-2 transition-all',
                    selectedColor === color ? 'border-neutral-100 scale-110' : 'border-transparent hover:scale-105'
                  )}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && <Check size={16} className="text-white mx-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon selector */}
          <div className="space-y-2">
            <Label className="font-overline text-neutral-300">Icone</Label>
            <div className="grid grid-cols-6 gap-2">
              {iconOptions.map((icon: string) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center transition-all border',
                    selectedIcon === icon
                      ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                      : 'border-neutral-500 text-neutral-300 hover:border-neutral-300'
                  )}
                >
                  <GoalIcon icon={icon} size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="font-overline text-neutral-300">Description (optionnel)</Label>
            <Textarea
              placeholder="Ajouter une description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-[10px] border-neutral-500 focus:border-accent-gold focus:ring-accent-gold/15 min-h-[80px] resize-none"
            />
          </div>

          {/* Monthly suggestion */}
          {monthlyNeeded && (
            <div className="p-3 bg-warm-cream rounded-lg">
              <p className="font-body-sm text-neutral-200">
                <span className="font-mono font-semibold">{formatCurrency(monthlyNeeded)}/mois</span>{' '}
                pour atteindre votre objectif a temps
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="px-6 py-4 border-t border-warm-gray flex gap-3">
          <Button variant="ghost" className="flex-1 h-11 rounded-[10px]" onClick={onClose}>
            Annuler
          </Button>
          <Button
            className="flex-1 h-11 bg-accent-gold text-neutral-100 hover:bg-accent-gold/90 rounded-[10px] font-semibold"
            disabled={!canSubmit}
            onClick={() => {
              const newGoal: SavingsGoal = {
                id: `goal-${Date.now()}`,
                name: name.trim(),
                description: description.trim() || undefined,
                targetAmount: parseFloat(targetAmount.replace(',', '.')),
                currentAmount: 0,
                deadline: deadline || undefined,
                color: selectedColor,
                icon: selectedIcon,
                contributions: [],
              };
              onCreate(newGoal);
              onClose();
            }}
          >
            Creer l&apos;objectif
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Goal Detail Modal ──────────────────────────────────────────────

function GoalDetailModal({
  goal,
  open,
  onClose,
  onDelete,
}: {
  goal: SavingsGoal | null;
  open: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!open) setShowDeleteConfirm(false);
  }, [open]);

  if (!goal) return null;

  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[640px] bg-warm-white border-0 rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-warm-gray">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-h3 text-neutral-100">{goal.name}</DialogTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-neutral-300 hover:text-neutral-100">
                <Pencil size={15} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-danger hover:text-danger hover:bg-danger-light"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={15} />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
          {showDeleteConfirm ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6"
            >
              <div className="w-14 h-14 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-danger" />
              </div>
              <h4 className="font-h4 text-neutral-100 mb-2">Supprimer cet objectif ?</h4>
              <p className="font-body text-neutral-300 mb-6">
                L&apos;objectif et tout l&apos;historique de contributions seront supprimes.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="ghost" className="h-10 rounded-[10px]" onClick={() => setShowDeleteConfirm(false)}>
                  Annuler
                </Button>
                <Button
                  className="h-10 bg-danger text-white hover:bg-danger/90 rounded-[10px]"
                  onClick={() => {
                    onDelete(goal.id);
                    onClose();
                  }}
                >
                  Supprimer
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex flex-col items-center">
                <ProgressRing progress={progress} color={goal.color} size={120} delay={100} />
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="font-h3 font-mono text-neutral-100">{formatCurrency(goal.currentAmount)}</span>
                  <span className="font-body text-neutral-400"> / </span>
                  <span className="font-body-lg font-mono text-neutral-300">{formatCurrency(goal.targetAmount)}</span>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-3">
                {goal.deadline && (
                  <div className="bg-warm-cream rounded-lg p-3">
                    <p className="font-caption text-neutral-300">Echeance</p>
                    <p className="font-body-sm font-medium text-neutral-200">{formatDate(goal.deadline)}</p>
                  </div>
                )}
                <div className="bg-warm-cream rounded-lg p-3">
                  <p className="font-caption text-neutral-300">Progression</p>
                  <p className="font-body-sm font-medium text-neutral-200">{Math.round(progress)}%</p>
                </div>
                <div className="bg-warm-cream rounded-lg p-3">
                  <p className="font-caption text-neutral-300">Reste a epargner</p>
                  <p className="font-body-sm font-medium text-neutral-200">
                    {formatCurrency(goal.targetAmount - goal.currentAmount)}
                  </p>
                </div>
                {goal.deadline && (
                  <div className="bg-warm-cream rounded-lg p-3">
                    <p className="font-caption text-neutral-300">Jours restants</p>
                    <p className="font-body-sm font-medium text-neutral-200">{daysUntil(goal.deadline)}</p>
                  </div>
                )}
              </div>

              {/* Contribution History */}
              {goal.contributions.length > 0 && (
                <div>
                  <h4 className="font-h4 text-neutral-100 mb-3">Historique des contributions</h4>
                  <div className="space-y-2">
                    {[...goal.contributions].reverse().map((c, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-3 bg-warm-cream rounded-lg"
                      >
                        <div>
                          <p className="font-body-sm font-medium text-neutral-200">{formatDate(c.date)}</p>
                          {c.note && <p className="font-caption text-neutral-400">{c.note}</p>}
                        </div>
                        <span className="font-body-sm font-mono font-semibold text-success">
                          +{formatCurrency(c.amount)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-warm-white rounded-xl shadow-card p-12 text-center col-span-full"
    >
      <img src="/empty-objectifs.svg" alt="Aucun objectif" className="w-48 h-36 mx-auto mb-6 opacity-60" />
      <h3 className="font-h3 text-neutral-200 mb-2">Aucun objectif defini</h3>
      <p className="font-body text-neutral-300 max-w-sm mx-auto mb-6">
        Fixez-vous un objectif d&apos;epargne et suivez votre progression pas a pas.
      </p>
      <Button
        className="h-11 px-6 bg-accent-gold text-neutral-100 hover:bg-accent-gold/90 rounded-[10px] font-semibold gap-2"
        onClick={onCreate}
      >
        <Target size={18} />
        Creer un objectif
      </Button>
    </motion.div>
  );
}

// ─── Main Objectifs Page ─────────────────────────────────────────────

export default function Objectifs() {
  const [goals, setGoals] = useState<SavingsGoal[]>(mockGoals);
  const [contributeGoal, setContributeGoal] = useState<SavingsGoal | null>(null);
  const [detailGoal, setDetailGoal] = useState<SavingsGoal | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const summary = useMemo(() => {
    const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
    const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
    const remaining = totalTarget - totalSaved;
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
    return { totalTarget, totalSaved, remaining, overallProgress, count: goals.length };
  }, [goals]);

  const handleContribute = useCallback((goal: SavingsGoal) => {
    setContributeGoal(goal);
    setDrawerOpen(true);
  }, []);

  const handleViewDetails = useCallback((goal: SavingsGoal) => {
    setDetailGoal(goal);
    setDetailOpen(true);
  }, []);

  const handleAddContribution = useCallback((amount: number, _note: string) => {
    if (!contributeGoal) return;
    setGoals((prev) =>
      prev.map((g) =>
        g.id === contributeGoal.id
          ? {
              ...g,
              currentAmount: g.currentAmount + amount,
              contributions: [
                ...g.contributions,
                { date: new Date().toISOString().slice(0, 10), amount, note: _note || undefined },
              ],
            }
          : g
      )
    );
    setContributeGoal(null);
  }, [contributeGoal]);

  const handleCreateGoal = useCallback((newGoal: SavingsGoal) => {
    setGoals((prev) => [...prev, newGoal]);
  }, []);

  const handleDeleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Target size={24} className="text-accent-gold" />
          <h1 className="font-h2 text-neutral-100">Objectifs d&apos;epargne</h1>
        </div>
        <Button
          className="h-10 px-5 bg-accent-gold text-neutral-100 hover:bg-accent-gold/90 rounded-[10px] font-semibold gap-2 shadow-card"
          onClick={() => setShowCreate(true)}
        >
          <Plus size={16} />
          Nouvel objectif
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState onCreate={() => setShowCreate(true)} />
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            <SummaryCard
              icon={Target}
              iconColor="#D4A853"
              iconBg="rgba(212,168,83,0.1)"
              value={summary.count.toString()}
              label="Objectifs"
              delay={0}
            />
            <SummaryCard
              icon={Flag}
              iconColor="#2563EB"
              iconBg="rgba(37,99,235,0.1)"
              value={formatCurrency(summary.totalTarget)}
              label="Total a atteindre"
              delay={0.08}
            />
            <SummaryCard
              icon={TrendingUp}
              iconColor="#16A34A"
              iconBg="rgba(22,163,74,0.1)"
              value={formatCurrency(summary.totalSaved)}
              label="Total epargne"
              valueColor="text-success"
              bottomBar={{ progress: summary.overallProgress, color: '#16A34A' }}
              delay={0.16}
            />
            <SummaryCard
              icon={Clock}
              iconColor="#D97706"
              iconBg="rgba(217,119,6,0.1)"
              value={formatCurrency(summary.remaining)}
              label="Reste a epargner"
              valueColor="text-warning"
              delay={0.24}
            />
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {goals.map((goal, index) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={index}
                  onContribute={handleContribute}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Modals & Drawers */}
      <ContributeDrawer
        goal={contributeGoal}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setContributeGoal(null);
        }}
        onContribute={handleAddContribution}
      />

      <GoalDetailModal
        goal={detailGoal}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailGoal(null);
        }}
        onDelete={handleDeleteGoal}
      />

      <CreateGoalModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreateGoal}
      />
    </motion.div>
  );
}
