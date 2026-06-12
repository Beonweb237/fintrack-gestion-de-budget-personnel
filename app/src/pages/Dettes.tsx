import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HandCoins,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Scale,
  Calendar,
  Pencil,
  Trash2,
  History,
  CreditCard,
  User,
  Phone,
  Mail,
  FileText,
  Bell,
  BellOff,
  Search,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  debts as initialDebts,
  formatCurrency,
  getDebtStatusLabel,
  getDebtStatusColor,
  getDebtProgress,
  getRemainingAmount,
} from '@/data/mockData';
import type { Debt, DebtPayment, DebtType, DebtStatus } from '@/data/mockData';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    '#E11D48', '#2563EB', '#7C3AED', '#D97706', '#059669',
    '#DB2777', '#0891B2', '#65A30D', '#EA580C', '#0D9488',
    '#D4A853', '#DC2626',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function formatDateLocale(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Dettes() {
  /* ── state ─────────────────────────────────────────────────────── */
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [activeTab, setActiveTab] = useState<DebtType>('i-owe');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DebtStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  // Drawers
  const [addOpen, setAddOpen] = useState(false);
  const [editDebt, setEditDebt] = useState<Debt | null>(null);
  const [payDebt, setPayDebt] = useState<Debt | null>(null);
  const [detailDebt, setDetailDebt] = useState<Debt | null>(null);
  const [deleteDebt, setDeleteDebt] = useState<Debt | null>(null);

  /* ── derived data ──────────────────────────────────────────────── */
  const filteredDebts = useMemo(() => {
    let result = debts.filter((d) => d.type === activeTab);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.personName.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((d) => d.status === statusFilter);
    }

    switch (sortBy) {
      case 'date-desc':
        result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case 'date-asc':
        result.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
        break;
      case 'amount-desc':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        result.sort((a, b) => a.amount - b.amount);
        break;
      case 'name':
        result.sort((a, b) => a.personName.localeCompare(b.personName));
        break;
      default:
        break;
    }

    return result;
  }, [debts, activeTab, search, statusFilter, sortBy]);

  const totalReceivable = useMemo(
    () => debts.filter((d) => d.type === 'owed-to-me').reduce((s, d) => s + getRemainingAmount(d), 0),
    [debts]
  );
  const totalPayable = useMemo(
    () => debts.filter((d) => d.type === 'i-owe').reduce((s, d) => s + getRemainingAmount(d), 0),
    [debts]
  );
  const netBalance = totalReceivable - totalPayable;

  const counts = useMemo(
    () => ({
      iOwe: debts.filter((d) => d.type === 'i-owe').length,
      owedToMe: debts.filter((d) => d.type === 'owed-to-me').length,
    }),
    [debts]
  );

  /* ── CRUD operations ───────────────────────────────────────────── */
  const handleAddDebt = useCallback(
    (data: Omit<Debt, 'id' | 'createdAt' | 'payments' | 'status' | 'repaidAmount'>) => {
      const now = new Date().toISOString();
      const newDebt: Debt = {
        ...data,
        id: `debt-${Date.now()}`,
        createdAt: now,
        payments: [],
        status: data.dueDate && isOverdue(data.dueDate) ? 'overdue' : 'active',
        repaidAmount: 0,
      };
      setDebts((prev) => [...prev, newDebt]);
      setAddOpen(false);
    },
    []
  );

  const handleEditDebt = useCallback(
    (id: string, data: Partial<Debt>) => {
      setDebts((prev) =>
        prev.map((d) => {
          if (d.id !== id) return d;
          const updated = { ...d, ...data };
          if (updated.dueDate && isOverdue(updated.dueDate) && updated.status === 'active') {
            updated.status = 'overdue';
          }
          return updated;
        })
      );
      setEditDebt(null);
    },
    []
  );

  const handleDeleteDebt = useCallback((id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
    setDeleteDebt(null);
    setDetailDebt(null);
  }, []);

  const handleAddPayment = useCallback(
    (debtId: string, amount: number, note?: string) => {
      setDebts((prev) =>
        prev.map((d) => {
          if (d.id !== debtId) return d;
          const newPayment: DebtPayment = {
            id: `pay-${Date.now()}`,
            debtId,
            amount,
            date: new Date().toISOString().split('T')[0],
            note,
            createdAt: new Date().toISOString(),
          };
          const newRepaid = d.repaidAmount + amount;
          const newStatus: DebtStatus = newRepaid >= d.amount ? 'paid' : d.status;
          return {
            ...d,
            repaidAmount: Math.min(newRepaid, d.amount),
            status: newStatus,
            payments: [...d.payments, newPayment],
          };
        })
      );
      setPayDebt(null);
    },
    []
  );

  /* ── render ────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* ═══════ Header ═══════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-warm-black tracking-tight">
            Mes Dettes
          </h1>
          <p className="text-sm text-neutral-300 mt-1">
            Suivez vos prets et emprunts en un seul endroit
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          className="bg-accent-gold hover:bg-accent-gold/90 text-white gap-2 shadow-card"
        >
          <Plus size={18} />
          Nouvelle dette
        </Button>
      </div>

      {/* ═══════ Summary Cards ═══════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-info shadow-card hover:shadow-card-hover transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-300 uppercase tracking-wide">
                  Total a recevoir
                </p>
                <p className="font-mono text-2xl font-bold text-warm-black">
                  {formatCurrency(totalReceivable)}
                </p>
                <p className="text-xs text-success flex items-center gap-1">
                  <ArrowDownLeft size={12} /> On me doit
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <ArrowDownLeft size={20} className="text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-danger shadow-card hover:shadow-card-hover transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-300 uppercase tracking-wide">
                  Total a rembourser
                </p>
                <p className="font-mono text-2xl font-bold text-warm-black">
                  {formatCurrency(totalPayable)}
                </p>
                <p className="text-xs text-danger flex items-center gap-1">
                  <ArrowUpRight size={12} /> Je dois
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center">
                <ArrowUpRight size={20} className="text-danger" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent-gold shadow-card hover:shadow-card-hover transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-300 uppercase tracking-wide">
                  Solde net
                </p>
                <p
                  className={cn(
                    'font-mono text-2xl font-bold',
                    netBalance >= 0 ? 'text-success' : 'text-danger'
                  )}
                >
                  {netBalance >= 0 ? '+' : ''}
                  {formatCurrency(Math.abs(netBalance))}
                </p>
                <p className="text-xs text-neutral-300 flex items-center gap-1">
                  <Scale size={12} /> {netBalance >= 0 ? 'Vous etes crediteur' : 'Vous etes debiteur'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-accent-gold/10 flex items-center justify-center">
                <Scale size={20} className="text-accent-gold" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══════ Tabs & Filters ═══════ */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DebtType)}>
            <TabsList className="bg-warm-gray h-10 p-1">
              <TabsTrigger
                value="i-owe"
                className={cn(
                  'rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-warm-white data-[state=active]:shadow-sm data-[state=active]:text-danger',
                  activeTab === 'i-owe' ? 'text-danger' : 'text-neutral-300'
                )}
              >
                Je dois ({counts.iOwe})
              </TabsTrigger>
              <TabsTrigger
                value="owed-to-me"
                className={cn(
                  'rounded-md px-4 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-warm-white data-[state=active]:shadow-sm data-[state=active]:text-info',
                  activeTab === 'owed-to-me' ? 'text-info' : 'text-neutral-300'
                )}
              >
                On me doit ({counts.owedToMe})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 w-44 bg-warm-white border-warm-gray text-sm"
              />
            </div>

            {/* Status filter */}
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as DebtStatus | 'all')}>
              <SelectTrigger className="h-9 w-40 bg-warm-white border-warm-gray text-sm">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="paid">Rembourses</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 w-40 bg-warm-white border-warm-gray text-sm">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Plus recent</SelectItem>
                <SelectItem value="date-asc">Plus ancien</SelectItem>
                <SelectItem value="amount-desc">Montant decroissant</SelectItem>
                <SelectItem value="amount-asc">Montant croissant</SelectItem>
                <SelectItem value="name">Nom (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ═══════ Debt Grid ═══════ */}
      {filteredDebts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-32 h-32 mb-6 opacity-40">
            <HandCoins size={128} strokeWidth={1} className="text-neutral-300" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-warm-black mb-2">
            Aucune dette
          </h3>
          <p className="text-sm text-neutral-300 mb-6 text-center max-w-sm">
            {search || statusFilter !== 'all'
              ? 'Aucun resultat pour vos filtres actuels.'
              : activeTab === 'i-owe'
              ? "Vous n'avez pas de dettes a rembourser."
              : "Personne ne vous doit d'argent pour le moment."}
          </p>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-accent-gold hover:bg-accent-gold/90 text-white gap-2"
          >
            <Plus size={18} />
            Nouvelle dette
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          key={activeTab + statusFilter + sortBy + search}
        >
          <AnimatePresence mode="popLayout">
            {filteredDebts.map((debt) => (
              <DebtCard
                key={debt.id}
                debt={debt}
                onPay={() => setPayDebt(debt)}
                onDetail={() => setDetailDebt(debt)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ═══════ Add / Edit Sheet ═══════ */}
      <DebtFormSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAddDebt}
        mode="add"
      />
      <DebtFormSheet
        open={editDebt !== null}
        onOpenChange={(open) => !open && setEditDebt(null)}
        onSubmit={(data) => editDebt && handleEditDebt(editDebt.id, data)}
        mode="edit"
        debt={editDebt}
      />

      {/* ═══════ Payment Sheet ═══════ */}
      <PaymentSheet
        open={payDebt !== null}
        onOpenChange={(open) => !open && setPayDebt(null)}
        debt={payDebt}
        onPay={handleAddPayment}
      />

      {/* ═══════ Detail Dialog ═══════ */}
      <DebtDetailDialog
        open={detailDebt !== null}
        onOpenChange={(open) => !open && setDetailDebt(null)}
        debt={detailDebt}
        onEdit={(debt) => {
          setDetailDebt(null);
          setEditDebt(debt);
        }}
        onPay={(debt) => {
          setDetailDebt(null);
          setPayDebt(debt);
        }}
        onDelete={setDeleteDebt}
      />

      {/* ═══════ Delete Confirmation ═══════ */}
      <Dialog open={deleteDebt !== null} onOpenChange={(open) => !open && setDeleteDebt(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg flex items-center gap-2">
              <AlertTriangle size={20} className="text-warning" />
              Supprimer la dette
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-300">
              Etes-vous sur de vouloir supprimer la dette de{' '}
              <span className="font-medium text-warm-black">
                {deleteDebt?.personName}
              </span>{' '}
              de{' '}
              <span className="font-medium text-warm-black">
                {deleteDebt && formatCurrency(deleteDebt.amount)}
              </span>
              ? Cette action est irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDebt(null)}
              className="border-warm-gray"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDebt && handleDeleteDebt(deleteDebt.id)}
              className="gap-2"
            >
              <Trash2 size={16} />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  Debt Card                                                            */
/* ═══════════════════════════════════════════════════════════════════════ */

function DebtCard({
  debt,
  onPay,
  onDetail,
}: {
  debt: Debt;
  onPay: () => void;
  onDetail: () => void;
}) {
  const progress = getDebtProgress(debt);
  const remaining = getRemainingAmount(debt);
  const statusColor = getDebtStatusColor(debt.status);
  const avatarColor = getAvatarColor(debt.personName);
  const overdue = debt.status === 'overdue';

  return (
    <motion.div
      variants={cardVariants}
      layout
      layoutId={debt.id}
      className={cn(
        'bg-warm-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group',
        overdue && 'ring-1 ring-danger/20'
      )}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: statusColor }}
      />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-11 h-11 shrink-0" style={{ backgroundColor: avatarColor + '18' }}>
              <AvatarFallback className="text-sm font-semibold" style={{ color: avatarColor }}>
                {getInitials(debt.personName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-warm-black text-sm truncate">{debt.personName}</p>
              <p className="text-xs text-neutral-300 truncate">{debt.description}</p>
            </div>
          </div>
          <Badge
            className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border-0"
            style={{
              backgroundColor: statusColor + '18',
              color: statusColor,
            }}
          >
            {getDebtStatusLabel(debt.status)}
          </Badge>
        </div>

        {/* Amount & Progress */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xl font-bold text-warm-black">
              {formatCurrency(debt.amount)}
            </span>
            <span className="text-xs text-neutral-300">
              {progress}% rembourse
            </span>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-warm-gray rounded-full"
            style={
              {
                '--progress-indicator-color': statusColor,
              } as React.CSSProperties
            }
          />
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300">
              Rembourse : {formatCurrency(debt.repaidAmount)}
            </span>
            <span
              className={cn(
                'font-mono font-semibold',
                debt.status === 'paid' ? 'text-success' : 'text-warm-black'
              )}
            >
              Reste : {formatCurrency(remaining)}
            </span>
          </div>
        </div>

        {/* Due date */}
        {debt.dueDate && (
          <div className="flex items-center gap-2 text-xs">
            <Calendar size={13} className={overdue ? 'text-danger' : 'text-neutral-300'} />
            <span className={overdue ? 'text-danger font-medium' : 'text-neutral-300'}>
              {overdue
                ? `En retard (echeance ${formatDateLocale(debt.dueDate)})`
                : `Echeance : ${formatDateLocale(debt.dueDate)}`}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {debt.status !== 'paid' && (
            <Button
              size="sm"
              onClick={onPay}
              className="flex-1 h-8 text-xs bg-accent-gold hover:bg-accent-gold/90 text-white gap-1.5"
            >
              <CreditCard size={13} />
              Rembourser
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={onDetail}
            className="flex-1 h-8 text-xs border-warm-gray gap-1.5 hover:bg-warm-cream"
          >
            <History size={13} />
            Voir historique
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  Debt Form Sheet (Add / Edit)                                         */
/* ═══════════════════════════════════════════════════════════════════════ */

function DebtFormSheet({
  open,
  onOpenChange,
  onSubmit,
  mode,
  debt,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  mode: 'add' | 'edit';
  debt?: Debt | null;
}) {
  const [form, setForm] = useState({
    personName: '',
    personContact: '',
    description: '',
    amount: '',
    type: 'i-owe' as DebtType,
    dueDate: '',
    note: '',
    reminderEnabled: false,
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Reset form when opening
  useState(() => {
    if (open && mode === 'edit' && debt) {
      setForm({
        personName: debt.personName,
        personContact: debt.personContact || '',
        description: debt.description,
        amount: String(debt.amount),
        type: debt.type,
        dueDate: debt.dueDate || '',
        note: debt.note || '',
        reminderEnabled: debt.reminderEnabled,
      });
    }
  });

  const resetForm = useCallback(() => {
    setForm({
      personName: '',
      personContact: '',
      description: '',
      amount: '',
      type: 'i-owe',
      dueDate: '',
      note: '',
      reminderEnabled: false,
    });
    setErrors({});
  }, []);

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.personName.trim()) newErrors.personName = true;
    if (!form.description.trim()) newErrors.description = true;
    if (!form.amount || Number(form.amount) <= 0) newErrors.amount = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      personName: form.personName.trim(),
      personContact: form.personContact.trim() || undefined,
      description: form.description.trim(),
      amount: Number(form.amount),
      type: form.type,
      dueDate: form.dueDate || undefined,
      note: form.note.trim() || undefined,
      reminderEnabled: form.reminderEnabled,
    });
    resetForm();
  };

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <Sheet open={open} onOpenChange={(val) => { if (!val) resetForm(); onOpenChange(val); }}>
      <SheetContent className="sm:max-w-md bg-warm-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl text-warm-black">
            {mode === 'add' ? 'Nouvelle dette' : 'Modifier la dette'}
          </SheetTitle>
          <SheetDescription className="text-sm text-neutral-300">
            {mode === 'add'
              ? 'Enregistrez un nouveau pret ou emprunt.'
              : 'Modifiez les informations de la dette.'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-warm-gray rounded-lg">
            <button
              type="button"
              onClick={() => updateField('type', 'i-owe')}
              className={cn(
                'flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all',
                form.type === 'i-owe'
                  ? 'bg-warm-white text-danger shadow-sm'
                  : 'text-neutral-300 hover:text-neutral-200'
              )}
            >
              <ArrowUpRight size={15} />
              Je dois
            </button>
            <button
              type="button"
              onClick={() => updateField('type', 'owed-to-me')}
              className={cn(
                'flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all',
                form.type === 'owed-to-me'
                  ? 'bg-warm-white text-info shadow-sm'
                  : 'text-neutral-300 hover:text-neutral-200'
              )}
            >
              <ArrowDownLeft size={15} />
              On me doit
            </button>
          </div>

          {/* Person name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-warm-black">
              Nom de la personne <span className="text-danger">*</span>
            </Label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
              <Input
                placeholder="ex: Jean Dupont"
                value={form.personName}
                onChange={(e) => updateField('personName', e.target.value)}
                className={cn(
                  'pl-9 bg-warm-white border-warm-gray',
                  errors.personName && 'border-danger ring-1 ring-danger/30'
                )}
              />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-warm-black">Contact (optionnel)</Label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" />
              <Input
                placeholder="Telephone ou email"
                value={form.personContact}
                onChange={(e) => updateField('personContact', e.target.value)}
                className="pl-9 bg-warm-white border-warm-gray"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-warm-black">
              Description <span className="text-danger">*</span>
            </Label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-3 text-neutral-300" />
              <Input
                placeholder="ex: Pret pour achat velo"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                className={cn(
                  'pl-9 bg-warm-white border-warm-gray',
                  errors.description && 'border-danger ring-1 ring-danger/30'
                )}
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-warm-black">
              Montant total <span className="text-danger">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-300 font-mono">
                &euro;
              </span>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={form.amount}
                onChange={(e) => updateField('amount', e.target.value)}
                className={cn(
                  'pl-8 bg-warm-white border-warm-gray font-mono',
                  errors.amount && 'border-danger ring-1 ring-danger/30'
                )}
              />
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-warm-black">Date d'echeance</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 w-full h-10 px-3 rounded-md border border-warm-gray bg-warm-white text-sm hover:border-neutral-300 transition-colors"
                >
                  <Calendar size={16} className="text-neutral-300" />
                  <span className={cn(!form.dueDate && 'text-neutral-300')}>
                    {form.dueDate
                      ? formatDateLocale(form.dueDate)
                      : "Selectionner une date"}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={form.dueDate ? new Date(form.dueDate) : undefined}
                  onSelect={(date) => updateField('dueDate', date ? date.toISOString().split('T')[0] : '')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-warm-black">Note (optionnel)</Label>
            <Textarea
              placeholder="Informations complementaires..."
              value={form.note}
              onChange={(e) => updateField('note', e.target.value)}
              className="bg-warm-white border-warm-gray resize-none min-h-[80px]"
            />
          </div>

          {/* Reminder toggle */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              {form.reminderEnabled ? (
                <Bell size={16} className="text-accent-gold" />
              ) : (
                <BellOff size={16} className="text-neutral-300" />
              )}
              <Label className="text-sm font-medium text-warm-black cursor-pointer">
                Activer les rappels
              </Label>
            </div>
            <Switch
              checked={form.reminderEnabled}
              onCheckedChange={(v) => updateField('reminderEnabled', v)}
            />
          </div>
        </div>

        <SheetFooter>
          <Button
            onClick={handleSubmit}
            className="w-full bg-accent-gold hover:bg-accent-gold/90 text-white gap-2"
          >
            {mode === 'add' ? <Plus size={16} /> : <Pencil size={16} />}
            {mode === 'add' ? 'Ajouter la dette' : 'Enregistrer les modifications'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  Payment Sheet                                                        */
/* ═══════════════════════════════════════════════════════════════════════ */

function PaymentSheet({
  open,
  onOpenChange,
  debt,
  onPay,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debt: Debt | null;
  onPay: (debtId: string, amount: number, note?: string) => void;
}) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState(false);

  const remaining = debt ? getRemainingAmount(debt) : 0;

  const quickAmounts = useMemo(() => {
    if (!remaining) return [];
    return [
      { label: '10%', value: Math.round(remaining * 0.1 * 100) / 100 },
      { label: '25%', value: Math.round(remaining * 0.25 * 100) / 100 },
      { label: '50%', value: Math.round(remaining * 0.5 * 100) / 100 },
      { label: '100%', value: remaining },
    ];
  }, [remaining]);

  const handleQuickAmount = (val: number) => {
    setAmount(String(val));
    setError(false);
  };

  const handleSubmit = () => {
    const num = Number(amount);
    if (!num || num <= 0 || num > remaining) {
      setError(true);
      return;
    }
    if (debt) {
      onPay(debt.id, num, note.trim() || undefined);
      setAmount('');
      setNote('');
      setError(false);
    }
  };

  const remainingAfter = useMemo(() => {
    const num = Number(amount);
    if (!num || num <= 0) return remaining;
    return Math.max(0, remaining - num);
  }, [amount, remaining]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md bg-warm-white">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl text-warm-black flex items-center gap-2">
            <CreditCard size={20} className="text-accent-gold" />
            Remboursement
          </SheetTitle>
          <SheetDescription className="text-sm text-neutral-300">
            {debt && (
              <>
                Dette envers <span className="font-medium text-warm-black">{debt?.personName}</span>
                {' — '}Reste a payer :{' '}
                <span className="font-mono font-medium text-warm-black">{formatCurrency(remaining)}</span>
              </>
            )}
          </SheetDescription>
        </SheetHeader>

        {debt && (
          <div className="space-y-5 py-5">
            {/* Quick amount buttons */}
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((qa) => (
                <button
                  key={qa.label}
                  onClick={() => handleQuickAmount(qa.value)}
                  className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-warm-gray bg-warm-cream/50 hover:border-accent-gold hover:bg-accent-gold/5 transition-all"
                >
                  <span className="text-[10px] font-semibold text-neutral-300 uppercase">
                    {qa.label}
                  </span>
                  <span className="font-mono text-xs font-medium text-warm-black">
                    {formatCurrency(qa.value)}
                  </span>
                </button>
              ))}
            </div>

            {/* Amount input */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-warm-black">
                Montant du remboursement
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-300 font-mono">
                  &euro;
                </span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  max={remaining}
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError(false);
                  }}
                  className={cn(
                    'pl-8 bg-warm-white border-warm-gray font-mono',
                    error && 'border-danger ring-1 ring-danger/30'
                  )}
                />
              </div>
              {error && (
                <p className="text-xs text-danger">Veuillez entrer un montant valide (max {formatCurrency(remaining)})</p>
              )}
            </div>

            {/* Note */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-warm-black">Note (optionnel)</Label>
              <Textarea
                placeholder="ex: Premier versement"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-warm-white border-warm-gray resize-none min-h-[70px]"
              />
            </div>

            {/* Impact preview */}
            {Number(amount) > 0 && (
              <div className="bg-warm-cream rounded-lg p-4 space-y-2">
                <p className="text-xs font-medium text-neutral-300 uppercase tracking-wide">
                  Apercu
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-300">Reste avant :</span>
                  <span className="font-mono font-medium text-warm-black">{formatCurrency(remaining)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-300">Montant paye :</span>
                  <span className="font-mono font-medium text-success">
                    -{formatCurrency(Number(amount) || 0)}
                  </span>
                </div>
                <Separator className="bg-warm-gray" />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-warm-black">Reste apres :</span>
                  <span className={cn(
                    'font-mono font-bold',
                    remainingAfter <= 0 ? 'text-success' : 'text-warm-black'
                  )}>
                    {formatCurrency(remainingAfter)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <SheetFooter>
          <Button
            onClick={handleSubmit}
            className="w-full bg-accent-gold hover:bg-accent-gold/90 text-white gap-2"
          >
            <CheckCircle2 size={16} />
            Valider le paiement
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  Debt Detail Dialog                                                   */
/* ═══════════════════════════════════════════════════════════════════════ */

function DebtDetailDialog({
  open,
  onOpenChange,
  debt,
  onEdit,
  onPay,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debt: Debt | null;
  onEdit: (debt: Debt) => void;
  onPay: (debt: Debt) => void;
  onDelete: (debt: Debt) => void;
}) {
  if (!debt) return null;

  const progress = getDebtProgress(debt);
  const remaining = getRemainingAmount(debt);
  const statusColor = getDebtStatusColor(debt.status);
  const avatarColor = getAvatarColor(debt.personName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[85vh]">
          {/* Header */}
          <div className="relative p-6 pb-4">
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: statusColor }}
            />
            <div className="flex items-start gap-4">
              <Avatar className="w-14 h-14" style={{ backgroundColor: avatarColor + '22' }}>
                <AvatarFallback
                  className="text-lg font-bold"
                  style={{ color: avatarColor }}
                >
                  {getInitials(debt.personName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <DialogTitle className="font-serif text-xl text-warm-black leading-tight">
                  {debt.personName}
                </DialogTitle>
                <p className="text-sm text-neutral-300 mt-0.5">{debt.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full border-0"
                    style={{ backgroundColor: statusColor + '18', color: statusColor }}
                  >
                    {getDebtStatusLabel(debt.status)}
                  </Badge>
                  {debt.reminderEnabled && (
                    <span className="flex items-center gap-1 text-[10px] text-accent-gold">
                      <Bell size={10} /> Rappels actifs
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 space-y-5">
            {/* Financial summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-warm-cream rounded-lg p-3 text-center">
                <p className="text-[10px] text-neutral-300 uppercase tracking-wide mb-1">
                  Montant
                </p>
                <p className="font-mono text-sm font-bold text-warm-black">
                  {formatCurrency(debt.amount)}
                </p>
              </div>
              <div className="bg-warm-cream rounded-lg p-3 text-center">
                <p className="text-[10px] text-neutral-300 uppercase tracking-wide mb-1">
                  Rembourse
                </p>
                <p className="font-mono text-sm font-bold text-success">
                  {formatCurrency(debt.repaidAmount)}
                </p>
              </div>
              <div className="bg-warm-cream rounded-lg p-3 text-center">
                <p className="text-[10px] text-neutral-300 uppercase tracking-wide mb-1">
                  Reste
                </p>
                <p className={cn(
                  'font-mono text-sm font-bold',
                  remaining === 0 ? 'text-success' : 'text-danger'
                )}>
                  {formatCurrency(remaining)}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300">Progression</span>
                <span className="font-mono font-semibold text-warm-black">{progress}%</span>
              </div>
              <Progress
                value={progress}
                className="h-2.5 bg-warm-gray rounded-full"
                style={{ '--progress-indicator-color': statusColor } as React.CSSProperties}
              />
            </div>

            {/* Details */}
            <div className="space-y-3">
              {debt.personContact && (
                <div className="flex items-center gap-3 text-sm">
                  {debt.personContact.includes('@') ? (
                    <Mail size={15} className="text-neutral-300 shrink-0" />
                  ) : (
                    <Phone size={15} className="text-neutral-300 shrink-0" />
                  )}
                  <span className="text-warm-black">{debt.personContact}</span>
                </div>
              )}
              {debt.dueDate && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={15} className="text-neutral-300 shrink-0" />
                  <span className={cn('text-warm-black', debt.status === 'overdue' && 'text-danger font-medium')}>
                    Echeance : {formatDateLocale(debt.dueDate)}
                    {debt.status === 'overdue' && ' (en retard)'}
                  </span>
                </div>
              )}
              {debt.note && (
                <div className="flex items-start gap-3 text-sm">
                  <FileText size={15} className="text-neutral-300 shrink-0 mt-0.5" />
                  <span className="text-warm-black">{debt.note}</span>
                </div>
              )}
            </div>

            <Separator className="bg-warm-gray" />

            {/* Payment history */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-warm-black flex items-center gap-2">
                <History size={15} className="text-neutral-300" />
                Historique des paiements
              </h4>

              {debt.payments.length === 0 ? (
                <p className="text-sm text-neutral-300 italic">
                  Aucun paiement enregistre pour le moment.
                </p>
              ) : (
                <div className="rounded-lg border border-warm-gray overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-warm-cream hover:bg-warm-cream">
                        <TableHead className="text-xs text-neutral-300 font-medium h-8">Date</TableHead>
                        <TableHead className="text-xs text-neutral-300 font-medium h-8">Montant</TableHead>
                        <TableHead className="text-xs text-neutral-300 font-medium h-8">Note</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...debt.payments]
                        .sort((a, b) => +new Date(b.date) - +new Date(a.date))
                        .map((payment) => (
                          <TableRow key={payment.id} className="hover:bg-warm-cream/50">
                            <TableCell className="text-xs text-warm-black py-2">
                              {formatDateLocale(payment.date)}
                            </TableCell>
                            <TableCell className="text-xs font-mono font-semibold text-success py-2">
                              +{formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell className="text-xs text-neutral-300 py-2">
                              {payment.note || '—'}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              {debt.status !== 'paid' && (
                <Button
                  onClick={() => onPay(debt)}
                  className="flex-1 bg-accent-gold hover:bg-accent-gold/90 text-white gap-2"
                >
                  <CreditCard size={15} />
                  Rembourser
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => onEdit(debt)}
                className="flex-1 border-warm-gray gap-2 hover:bg-warm-cream"
              >
                <Pencil size={15} />
                Modifier
              </Button>
              <Button
                variant="outline"
                onClick={() => onDelete(debt)}
                className="border-danger/30 text-danger hover:bg-danger/5 gap-2"
              >
                <Trash2 size={15} />
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
