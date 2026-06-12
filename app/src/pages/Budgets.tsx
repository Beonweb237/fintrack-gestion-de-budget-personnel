import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart,
  Plus,
  Wallet,
  TrendingDown,
  PiggyBank,
  MoreHorizontal,
  Pencil,
  Trash2,
  AlertTriangle,
  X,
  Check,
  Calendar,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  budgets as initialBudgets,
  categories,
  formatCurrency,
  getCategoryById,
  getBudgetStatus,
  getBudgetStatusLabel,
  getProgressColor,
} from '@/data/mockData';
import type { Budget } from '@/data/mockData';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BudgetAlert {
  budget: Budget;
  category: ReturnType<typeof getCategoryById>;
  status: ReturnType<typeof getBudgetStatus>;
  pct: number;
}

/* ------------------------------------------------------------------ */
/*  Budget color map                                                   */
/* ------------------------------------------------------------------ */

const budgetIconBgColors: Record<string, string> = {
  'cat-1': 'rgba(225, 29, 72, 0.12)',
  'cat-2': 'rgba(37, 99, 235, 0.12)',
  'cat-3': 'rgba(124, 58, 237, 0.12)',
  'cat-4': 'rgba(217, 119, 6, 0.12)',
  'cat-5': 'rgba(5, 150, 105, 0.12)',
  'cat-6': 'rgba(219, 39, 119, 0.12)',
  'cat-7': 'rgba(8, 145, 178, 0.12)',
  'cat-8': 'rgba(101, 163, 13, 0.12)',
  'cat-13': 'rgba(234, 88, 12, 0.12)',
  'cat-14': 'rgba(13, 148, 136, 0.12)',
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function Budgets() {
  /* ── state ─────────────────────────────────────────────────────── */
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [month, setMonth] = useState('2025-04');
  const [editModal, setEditModal] = useState<Budget | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<Budget | null>(null);

  /* ── derived data ──────────────────────────────────────────────── */
  const monthBudgets = useMemo(() => budgets.filter((b) => b.month === month), [budgets, month]);

  const totalBudget = monthBudgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = monthBudgets.reduce((s, b) => s + b.spent, 0);
  const remaining = totalBudget - totalSpent;
  const overallPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Alerts for budgets nearing limit or exceeded
  const alerts = useMemo(() => {
    const list: BudgetAlert[] = [];
    monthBudgets.forEach((b) => {
      const cat = getCategoryById(b.categoryId);
      const status = getBudgetStatus(b.spent, b.limit);
      const pct = (b.spent / b.limit) * 100;
      if (status === 'warning' || status === 'critical' || status === 'overspent') {
        list.push({ budget: b, category: cat, status, pct });
      }
    });
    // Sort: overspent first, then critical, then warning
    const order = { overspent: 0, critical: 1, warning: 2, good: 3, healthy: 4 };
    list.sort((a, b) => order[a.status] - order[b.status]);
    return list;
  }, [monthBudgets]);

  /* ── handlers ──────────────────────────────────────────────────── */
  const handleSaveEdit = useCallback(
    (data: { id: string; limit: number; alertThreshold: number }) => {
      setBudgets((prev) =>
        prev.map((b) => (b.id === data.id ? { ...b, limit: data.limit, alertThreshold: data.alertThreshold } : b))
      );
      setEditModal(null);
    },
    []
  );

  const handleAddBudget = useCallback(
    (data: { categoryId: string; limit: number; alertThreshold: number; month: string }) => {
      const newBudget: Budget = {
        id: `bud-${Date.now()}`,
        categoryId: data.categoryId,
        month: data.month,
        limit: data.limit,
        spent: 0,
        alertThreshold: data.alertThreshold,
      };
      setBudgets((prev) => [...prev, newBudget]);
      setAddModal(false);
    },
    []
  );

  const handleDelete = useCallback(() => {
    if (!deleteModal) return;
    setBudgets((prev) => prev.filter((b) => b.id !== deleteModal.id));
    setDeleteModal(null);
  }, [deleteModal]);

  /* ── uncategorized expense categories for add modal ────────────── */
  const usedCategoryIds = useMemo(() => new Set(monthBudgets.map((b) => b.categoryId)), [monthBudgets]);
  const availableCategories = categories.filter(
    (c) => c.type === 'expense' && !usedCategoryIds.has(c.id)
  );

  /* ── animation ─────────────────────────────────────────────────── */
  const pageAnim = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  };

  return (
    <motion.div {...pageAnim}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <PieChart size={24} className="text-accent-gold" />
          <h1 className="font-h2 text-neutral-100">Budgets</h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Month selector */}
          <div className="relative">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="appearance-none h-10 pl-10 pr-8 rounded-[10px] bg-warm-white border border-warm-gray text-sm text-neutral-100 focus:outline-none focus:border-accent-gold cursor-pointer"
            >
              <option value="2025-04">Avril 2025</option>
              <option value="2025-03">Mars 2025</option>
              <option value="2025-02">Février 2025</option>
              <option value="2025-01">Janvier 2025</option>
            </select>
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setAddModal(true)}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-[10px] bg-accent-gold text-[#1A1A1A] text-sm font-semibold hover:bg-[#C49A43] hover:-translate-y-px hover:shadow-card-hover transition-all active:translate-y-0"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>
      </div>

      {/* ── Empty state ─────────────────────────────────────────── */}
      {monthBudgets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 bg-warm-white rounded-xl shadow-card"
        >
          <img src="/empty-budgets.svg" alt="Aucun budget" className="w-48 h-36 mb-6 opacity-60" />
          <h3 className="font-h3 font-serif text-neutral-200 mb-2">Aucun budget défini</h3>
          <p className="font-body text-neutral-300 max-w-sm text-center mb-6">
            Créez votre premier budget pour commencer à suivre vos dépenses par catégorie.
          </p>
          <button
            onClick={() => setAddModal(true)}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-[10px] bg-accent-gold text-[#1A1A1A] text-sm font-semibold hover:bg-[#C49A43] hover:-translate-y-px hover:shadow-card-hover transition-all"
          >
            <Plus size={16} />
            Créer un budget
          </button>
        </motion.div>
      ) : (
        <>
          {/* ── Alerts ──────────────────────────────────────────── */}
          <AnimatePresence>
            {alerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 space-y-2"
              >
                {alerts.slice(0, 3).map((alert) => (
                  <motion.div
                    key={alert.budget.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl border',
                      alert.status === 'overspent'
                        ? 'bg-danger-light border-danger/20'
                        : alert.status === 'critical'
                        ? 'bg-danger-light border-danger/20'
                        : 'bg-warning-light border-warning/20'
                    )}
                  >
                    <AlertCircle
                      size={18}
                      className={cn(
                        'shrink-0',
                        alert.status === 'overspent' || alert.status === 'critical'
                          ? 'text-danger'
                          : 'text-warning'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-neutral-100">
                        {alert.category?.name ?? 'Budget'}
                        <span className="font-normal text-neutral-300 ml-1">
                          — {formatCurrency(alert.budget.spent)} sur {formatCurrency(alert.budget.limit)} ({Math.round(alert.pct)}%)
                        </span>
                      </p>
                    </div>
                    <span
                      className={cn(
                        'font-caption px-2 py-0.5 rounded shrink-0',
                        alert.status === 'overspent'
                          ? 'bg-danger text-white'
                          : alert.status === 'critical'
                          ? 'bg-danger-light text-danger'
                          : 'bg-warning-light text-warning'
                      )}
                    >
                      {getBudgetStatusLabel(alert.status)}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Budget Summary ────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-warm-white rounded-xl shadow-card p-5"
              style={{
                background: 'rgba(212, 168, 83, 0.06)',
                border: '1px solid rgba(212, 168, 83, 0.2)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={18} className="text-accent-gold" />
                <span className="font-overline text-neutral-300">Budget Total</span>
              </div>
              <p className="font-h2 font-mono text-neutral-100">{formatCurrency(totalBudget)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-warm-white rounded-xl shadow-card p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={18} className="text-danger" />
                <span className="font-overline text-neutral-300">Total Dépensé</span>
              </div>
              <p className="font-h2 font-mono text-danger">{formatCurrency(totalSpent)}</p>
              <p className="font-body-sm text-neutral-300 mt-1">{Math.round(overallPct)}% du budget</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-warm-white rounded-xl shadow-card p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank size={18} className="text-success" />
                <span className="font-overline text-neutral-300">Reste à Dépenser</span>
              </div>
              <p className={cn('font-h2 font-mono', remaining >= 0 ? 'text-success' : 'text-danger')}>
                {formatCurrency(Math.abs(remaining))}
              </p>
              <p className="font-body-sm text-neutral-300 mt-1">
                {remaining >= 0 ? 'Budget sous contrôle' : 'Dépassement'}
              </p>
            </motion.div>
          </div>

          {/* ── Overall progress bar ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="bg-warm-white rounded-xl shadow-card p-5 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-neutral-200">Progression globale</span>
              <span className="font-h4 font-mono" style={{ color: getProgressColor(overallPct, 100) }}>
                {Math.round(overallPct)}%
              </span>
            </div>
            <div className="w-full h-3 bg-warm-gray rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(overallPct, 100)}%` }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number], delay: 0.4 }}
                className="h-full rounded-full"
                style={{ backgroundColor: getProgressColor(overallPct, 100) }}
              />
            </div>
          </motion.div>

          {/* ── Budget Cards Grid ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence>
              {monthBudgets.map((budget, i) => {
                const category = getCategoryById(budget.categoryId);
                const pct = (budget.spent / budget.limit) * 100;
                const status = getBudgetStatus(budget.spent, budget.limit);
                const statusLabel = getBudgetStatusLabel(status);
                const progressColor = getProgressColor(pct, 100);

                return (
                  <motion.div
                    key={budget.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                    className="bg-warm-white rounded-xl shadow-card p-5 hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200 min-h-[180px] flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: budgetIconBgColors[budget.categoryId] ?? 'rgba(212,168,83,0.12)' }}
                        >
                          {category && (
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                          )}
                        </div>
                        <h3 className="font-h4 text-neutral-100">{category?.name ?? budget.categoryId}</h3>
                      </div>
                      <BudgetCardMenu
                        budget={budget}
                        onEdit={setEditModal}
                        onDelete={setDeleteModal}
                      />
                    </div>

                    {/* Amount row */}
                    <div className="flex items-end justify-between mb-3">
                      <div className="flex items-baseline gap-1">
                        <span className="font-h3 font-mono text-neutral-100">
                          {formatCurrency(budget.spent)}
                        </span>
                        <span className="font-body font-mono text-neutral-300">
                          / {formatCurrency(budget.limit)}
                        </span>
                      </div>
                      <span
                        className="font-caption font-semibold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: pct > 100 ? '#FEE2E2' : pct > 95 ? '#FEE2E2' : pct > 80 ? '#FEF3C7' : '#F5F4F0',
                          color: progressColor,
                        }}
                      >
                        {Math.round(pct)}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-warm-gray rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(pct, 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + i * 0.08 }}
                        className={cn('h-full rounded-full', status === 'overspent' && 'animate-pulse')}
                        style={{ backgroundColor: progressColor }}
                      />
                    </div>

                    {/* Status badge */}
                    {status !== 'healthy' && status !== 'good' && (
                      <div
                        className={cn(
                          'inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-lg font-caption mb-3',
                          status === 'overspent'
                            ? 'bg-danger-light text-danger font-semibold'
                            : status === 'critical'
                            ? 'bg-danger-light text-danger'
                            : 'bg-warning-light text-warning'
                        )}
                      >
                        {status === 'overspent' && <X size={12} />}
                        {status === 'critical' && <AlertTriangle size={12} />}
                        {status === 'warning' && <AlertTriangle size={12} />}
                        {status === 'overspent'
                          ? `Dépassement de ${formatCurrency(budget.spent - budget.limit)}`
                          : statusLabel}
                      </div>
                    )}
                    {(status === 'healthy' || status === 'good') && (
                      <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-lg font-caption bg-success-light text-success mb-3">
                        <Check size={12} />
                        {statusLabel}
                      </div>
                    )}

                    {/* Spacer to push content to top */}
                    <div className="flex-1" />

                    {/* Bottom info */}
                    <p className="font-body-sm text-neutral-300 mt-2">
                      Reste: {formatCurrency(Math.max(0, budget.limit - budget.spent))}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* ── Edit Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {editModal && (
          <BudgetEditModal
            key="edit-modal"
            budget={editModal}
            onSave={handleSaveEdit}
            onClose={() => setEditModal(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Add Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {addModal && (
          <BudgetAddModal
            key="add-modal"
            availableCategories={availableCategories}
            month={month}
            onSave={handleAddBudget}
            onClose={() => setAddModal(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Delete Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteModal && (
          <BudgetDeleteModal
            key="delete-modal"
            onConfirm={handleDelete}
            onCancel={() => setDeleteModal(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ===================================================================== */
/*  Sub-components                                                       */
/* ===================================================================== */

/* ── BudgetCardMenu ────────────────────────────────────────────────── */

function BudgetCardMenu({
  budget,
  onEdit,
  onDelete,
}: {
  budget: Budget;
  onEdit: (b: Budget) => void;
  onDelete: (b: Budget) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-warm-cream hover:text-neutral-200 transition-colors"
      >
        <MoreHorizontal size={18} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[998]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-1 w-40 bg-warm-white rounded-xl shadow-card-hover border border-warm-gray z-[999] py-1"
            >
              <button
                onClick={() => {
                  onEdit(budget);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-200 hover:bg-warm-cream transition-colors"
              >
                <Pencil size={14} />
                Éditer
              </button>
              <button
                onClick={() => {
                  onDelete(budget);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-danger hover:bg-danger-light transition-colors"
              >
                <Trash2 size={14} />
                Supprimer
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── BudgetEditModal ───────────────────────────────────────────────── */

function BudgetEditModal({
  budget,
  onSave,
  onClose,
}: {
  budget: Budget;
  onSave: (data: { id: string; limit: number; alertThreshold: number }) => void;
  onClose: () => void;
}) {
  const category = getCategoryById(budget.categoryId);
  const [limit, setLimit] = useState(String(budget.limit));
  const [alertThreshold, setAlertThreshold] = useState(Math.round(budget.alertThreshold * 100));
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const num = parseFloat(limit);
    if (!num || num <= 0) {
      setError('Montant invalide');
      return;
    }
    onSave({ id: budget.id, limit: num, alertThreshold: alertThreshold / 100 });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[1000]"
        style={{ background: 'rgba(26, 26, 26, 0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] w-[90vw] max-w-[420px] bg-warm-white rounded-2xl p-6"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-h3 text-neutral-100">Modifier le budget</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-warm-cream transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category display */}
        <div className="flex items-center gap-3 mb-6 p-3 rounded-[10px] bg-warm-cream">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: budgetIconBgColors[budget.categoryId] ?? 'rgba(212,168,83,0.12)' }}
          >
            {category && <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />}
          </div>
          <span className="font-body font-medium text-neutral-100">{category?.name ?? budget.categoryId}</span>
        </div>

        {/* Limit */}
        <div className="mb-5">
          <label className="font-caption uppercase text-neutral-300 mb-2 block">Montant limite *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-neutral-400">€</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                setError('');
              }}
              className={cn(
                'w-full h-11 pl-10 pr-4 rounded-[10px] border bg-warm-white font-mono text-lg text-neutral-100 text-right focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,168,83,0.15)] transition-all',
                error ? 'border-danger' : 'border-neutral-500 focus:border-accent-gold'
              )}
            />
          </div>
          {error && <p className="font-caption text-danger mt-1">{error}</p>}
        </div>

        {/* Alert threshold slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-caption uppercase text-neutral-300">Seuil d&apos;alerte</label>
            <span className="font-body-sm font-mono text-accent-gold">{alertThreshold}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={100}
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(Number(e.target.value))}
            className="w-full h-2 bg-warm-gray rounded-full appearance-none cursor-pointer accent-accent-gold"
          />
          <p className="font-body-sm text-neutral-400 mt-1">M&apos;avertir à {alertThreshold}% du budget</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="h-11 px-5 rounded-[10px] border border-neutral-500 text-sm font-medium text-neutral-200 hover:bg-warm-cream transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 h-11 rounded-[10px] bg-accent-gold text-[#1A1A1A] text-sm font-semibold hover:bg-[#C49A43] hover:-translate-y-px hover:shadow-card-hover transition-all active:translate-y-0"
          >
            Enregistrer
          </button>
        </div>
      </motion.div>
    </>
  );
}

/* ── BudgetAddModal ────────────────────────────────────────────────── */

function BudgetAddModal({
  availableCategories,
  month,
  onSave,
  onClose,
}: {
  availableCategories: typeof categories;
  month: string;
  onSave: (data: { categoryId: string; limit: number; alertThreshold: number; month: string }) => void;
  onClose: () => void;
}) {
  const [categoryId, setCategoryId] = useState(availableCategories[0]?.id ?? '');
  const [limit, setLimit] = useState('');
  const [alertThreshold, setAlertThreshold] = useState(85);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const num = parseFloat(limit);
    if (!num || num <= 0) {
      setError('Montant invalide');
      return;
    }
    if (!categoryId) {
      setError('Sélectionnez une catégorie');
      return;
    }
    onSave({ categoryId, limit: num, alertThreshold: alertThreshold / 100, month: selectedMonth });
  };

  if (availableCategories.length === 0) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000]"
          style={{ background: 'rgba(26, 26, 26, 0.4)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] w-[90vw] max-w-[420px] bg-warm-white rounded-2xl p-8 text-center"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        >
          <Check size={48} className="text-success mx-auto mb-4" />
          <h3 className="font-h3 text-neutral-100 mb-2">Toutes les catégories ont un budget</h3>
          <p className="font-body text-neutral-300 mb-6">
            Vous avez déjà créé un budget pour chaque catégorie de dépenses.
          </p>
          <button
            onClick={onClose}
            className="h-11 px-6 rounded-[10px] bg-accent-gold text-[#1A1A1A] text-sm font-semibold hover:bg-[#C49A43] transition-colors"
          >
            Fermer
          </button>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[1000]"
        style={{ background: 'rgba(26, 26, 26, 0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] w-[90vw] max-w-[420px] bg-warm-white rounded-2xl p-6"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-h3 text-neutral-100">Nouveau budget</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-warm-cream transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="font-caption uppercase text-neutral-300 mb-2 block">Catégorie *</label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setError('');
            }}
            className={cn(
              'w-full h-11 px-4 rounded-[10px] border bg-warm-white text-sm text-neutral-100 focus:outline-none appearance-none cursor-pointer',
              error && !categoryId ? 'border-danger' : 'border-neutral-500 focus:border-accent-gold'
            )}
          >
            {availableCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Limit */}
        <div className="mb-5">
          <label className="font-caption uppercase text-neutral-300 mb-2 block">Montant limite *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-neutral-400">€</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                setError('');
              }}
              placeholder="0,00"
              className={cn(
                'w-full h-11 pl-10 pr-4 rounded-[10px] border bg-warm-white font-mono text-lg text-neutral-100 text-right placeholder:text-neutral-400 focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,168,83,0.15)] transition-all',
                error ? 'border-danger' : 'border-neutral-500 focus:border-accent-gold'
              )}
            />
          </div>
          {error && <p className="font-caption text-danger mt-1">{error}</p>}
        </div>

        {/* Alert threshold */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="font-caption uppercase text-neutral-300">Seuil d&apos;alerte</label>
            <span className="font-body-sm font-mono text-accent-gold">{alertThreshold}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={100}
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(Number(e.target.value))}
            className="w-full h-2 bg-warm-gray rounded-full appearance-none cursor-pointer accent-accent-gold"
          />
          <p className="font-body-sm text-neutral-400 mt-1">M&apos;avertir à {alertThreshold}% du budget</p>
        </div>

        {/* Month */}
        <div className="mb-6">
          <label className="font-caption uppercase text-neutral-300 mb-2 block">Mois</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full h-11 px-4 rounded-[10px] border border-neutral-500 bg-warm-white text-sm text-neutral-100 focus:outline-none appearance-none cursor-pointer focus:border-accent-gold"
          >
            <option value="2025-04">Avril 2025</option>
            <option value="2025-03">Mars 2025</option>
            <option value="2025-02">Février 2025</option>
            <option value="2025-01">Janvier 2025</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="h-11 px-5 rounded-[10px] border border-neutral-500 text-sm font-medium text-neutral-200 hover:bg-warm-cream transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 h-11 rounded-[10px] bg-accent-gold text-[#1A1A1A] text-sm font-semibold hover:bg-[#C49A43] hover:-translate-y-px hover:shadow-card-hover transition-all active:translate-y-0"
          >
            Créer le budget
          </button>
        </div>
      </motion.div>
    </>
  );
}

/* ── BudgetDeleteModal ─────────────────────────────────────────────── */

function BudgetDeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[1000]"
        style={{ background: 'rgba(26, 26, 26, 0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onCancel}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] w-[90vw] max-w-[420px] bg-warm-white rounded-2xl p-8 text-center"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        <AlertTriangle size={48} className="text-danger mx-auto mb-4" />
        <h3 className="font-h3 text-neutral-100 mb-2">Supprimer ce budget ?</h3>
        <p className="font-body text-neutral-300 mb-6">
          Le budget sera supprimé mais les transactions associées seront conservées.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onCancel}
            className="h-11 px-6 rounded-[10px] border border-neutral-500 text-sm font-medium text-neutral-200 hover:bg-warm-cream transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="h-11 px-6 rounded-[10px] bg-danger text-white text-sm font-semibold hover:bg-[#B91C1C] transition-colors"
          >
            Supprimer
          </button>
        </div>
      </motion.div>
    </>
  );
}
