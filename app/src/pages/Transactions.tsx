import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  Plus,
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  ArrowLeftRight,
  FileText,
  AlertTriangle,
  X,
  ArrowUpDown,
  Check,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  transactions as initialTransactions,
  categories,
  formatCurrency,
  formatCurrencySigned,
  formatDate,
  getCategoryById,
} from '@/data/mockData';
import type { Transaction } from '@/data/mockData';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SortConfig {
  key: 'date' | 'amount' | 'description';
  direction: 'asc' | 'desc';
}

/* ------------------------------------------------------------------ */
/*  Payment method icon mapping                                        */
/* ------------------------------------------------------------------ */

const paymentIcons = {
  card: CreditCard,
  cash: Banknote,
  transfer: ArrowLeftRight,
  check: FileText,
};

const paymentLabels: Record<string, string> = {
  card: 'Carte',
  cash: 'Espèces',
  transfer: 'Virement',
  check: 'Chèque',
};

/* ------------------------------------------------------------------ */
/*  CSV Export helper                                                  */
/* ------------------------------------------------------------------ */

function exportToCSV(items: Transaction[]) {
  const headers = ['Date', 'Description', 'Categorie', 'Type', 'Methode', 'Montant', 'Notes'];
  const rows = items.map((t) => {
    const cat = getCategoryById(t.category);
    return [
      t.date,
      t.description,
      cat?.name ?? '',
      t.type === 'income' ? 'Revenu' : 'Depense',
      paymentLabels[t.paymentMethod] ?? t.paymentMethod,
      String(t.amount).replace('.', ','),
      t.notes ?? '',
    ];
  });
  const csv = [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function Transactions() {
  /* ── state ─────────────────────────────────────────────────────── */
  const [txs, setTxs] = useState<Transaction[]>(initialTransactions);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [catFilter, setCatFilter] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deleteModal, setDeleteModal] = useState<Transaction | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  /* ── derived data ──────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let data = [...txs];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          (t.notes ?? '').toLowerCase().includes(q)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      data = data.filter((t) => t.type === typeFilter);
    }

    // Category filter
    if (catFilter.length > 0) {
      data = data.filter((t) => catFilter.includes(t.category));
    }

    // Date range
    if (dateFrom) data = data.filter((t) => t.date >= dateFrom);
    if (dateTo) data = data.filter((t) => t.date <= dateTo);

    // Sort
    data.sort((a, b) => {
      const dir = sort.direction === 'asc' ? 1 : -1;
      if (sort.key === 'date') return (a.date > b.date ? 1 : -1) * dir;
      if (sort.key === 'amount') return (a.amount - b.amount) * dir;
      return a.description.localeCompare(b.description) * dir;
    });

    return data;
  }, [txs, search, typeFilter, catFilter, dateFrom, dateTo, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageSafe = Math.min(page, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * perPage, pageSafe * perPage);

  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);

  /* ── handlers ──────────────────────────────────────────────────── */
  const toggleSort = useCallback(
    (key: SortConfig['key']) => {
      setSort((prev) => ({
        key,
        direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
      }));
    },
    []
  );

  const toggleSelectAll = useCallback(() => {
    const pageIds = new Set(paginated.map((t) => t.id));
    const allSelected = [...pageIds].every((id) => selected.has(id));
    if (allSelected) {
      const next = new Set(selected);
      pageIds.forEach((id) => next.delete(id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      pageIds.forEach((id) => next.add(id));
      setSelected(next);
    }
  }, [paginated, selected]);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleDelete = useCallback(() => {
    if (!deleteModal) return;
    setTxs((prev) => prev.filter((t) => t.id !== deleteModal.id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(deleteModal.id);
      return next;
    });
    setDeleteModal(null);
  }, [deleteModal]);

  const handleBulkDelete = useCallback(() => {
    setTxs((prev) => prev.filter((t) => !selected.has(t.id)));
    setSelected(new Set());
  }, [selected]);

  const handleSave = useCallback(
    (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
      const now = new Date().toISOString();
      if (data.id) {
        // Edit
        setTxs((prev) =>
          prev.map((t) =>
            t.id === data.id
              ? { ...t, ...data, updatedAt: now } as Transaction
              : t
          )
        );
      } else {
        // Add
        const newTx: Transaction = {
          ...data,
          id: `tx-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        setTxs((prev) => [newTx, ...prev]);
        setHighlightId(newTx.id);
        setTimeout(() => setHighlightId(null), 2000);
      }
      setDrawerOpen(false);
      setEditingTx(null);
    },
    []
  );

  const openEdit = useCallback((tx: Transaction) => {
    setEditingTx(tx);
    setDrawerOpen(true);
  }, []);

  const openAdd = useCallback(() => {
    setEditingTx(null);
    setDrawerOpen(true);
  }, []);

  /* ── reset page on filter change ───────────────────────────────── */
  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, catFilter, dateFrom, dateTo, perPage]);

  /* ── derived UI ────────────────────────────────────────────────── */
  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  /* ── animation variants ────────────────────────────────────────── */
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
          <Receipt size={24} className="text-accent-gold" />
          <h1 className="font-h2 text-neutral-100">Transactions</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV(filtered)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] border border-neutral-500 text-neutral-200 text-sm font-medium hover:bg-warm-white hover:border-accent-gold transition-colors"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-[10px] bg-accent-gold text-[#1A1A1A] text-sm font-semibold hover:bg-[#C49A43] hover:-translate-y-px hover:shadow-card-hover transition-all active:translate-y-0"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-warm-white rounded-xl p-3 sm:p-4 mb-5 flex flex-wrap items-center gap-3"
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une transaction..."
            className="w-full h-10 pl-10 pr-4 rounded-[10px] bg-warm-white border border-neutral-500 text-sm text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(212,168,83,0.15)] transition-all"
          />
        </div>

        {/* Type filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
            className="appearance-none h-10 pl-9 pr-8 rounded-[10px] bg-warm-white border border-neutral-500 text-sm text-neutral-200 focus:outline-none focus:border-accent-gold cursor-pointer"
          >
            <option value="all">Tous les types</option>
            <option value="income">Revenus</option>
            <option value="expense">Dépenses</option>
          </select>
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>

        {/* Category filter */}
        <CategoryFilterDropdown
          selected={catFilter}
          onChange={setCatFilter}
          expenseCats={expenseCategories}
          incomeCats={incomeCategories}
        />

        {/* Date range */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="Du"
              className="h-9 pl-8 pr-2 rounded-[10px] bg-warm-white border border-neutral-500 text-sm text-neutral-200 focus:outline-none focus:border-accent-gold"
            />
          </div>
          <span className="text-neutral-400 text-sm">→</span>
          <div className="relative">
            <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 pl-8 pr-2 rounded-[10px] bg-warm-white border border-neutral-500 text-sm text-neutral-200 focus:outline-none focus:border-accent-gold"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="relative ml-auto">
          <select
            value={`${sort.key}-${sort.direction}`}
            onChange={(e) => {
              const [key, dir] = e.target.value.split('-');
              setSort({ key: key as SortConfig['key'], direction: dir as 'asc' | 'desc' });
            }}
            className="appearance-none h-10 pl-9 pr-8 rounded-[10px] bg-warm-white border border-neutral-500 text-sm text-neutral-200 focus:outline-none focus:border-accent-gold cursor-pointer"
          >
            <option value="date-desc">Plus récent</option>
            <option value="date-asc">Plus ancien</option>
            <option value="amount-asc">Montant croissant</option>
            <option value="amount-desc">Montant décroissant</option>
            <option value="description-asc">Description A-Z</option>
            <option value="description-desc">Description Z-A</option>
          </select>
          <ArrowUpDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
      </motion.div>

      {/* Active category filter pills */}
      <AnimatePresence>
        {catFilter.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-4"
          >
            {catFilter.map((catId) => {
              const cat = getCategoryById(catId);
              return (
                <motion.span
                  key={catId}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-warm-cream border border-warm-gray text-xs font-medium text-neutral-200"
                >
                  {cat?.name ?? catId}
                  <button
                    onClick={() => setCatFilter((prev) => prev.filter((c) => c !== catId))}
                    className="ml-1 text-neutral-400 hover:text-neutral-200"
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Summary Bar ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="flex items-center gap-3 rounded-[10px] px-4 py-3"
          style={{ background: 'rgba(22, 163, 74, 0.06)' }}
        >
          <TrendingUp size={16} className="text-success" />
          <div>
            <p className="font-overline text-neutral-300">Total revenus</p>
            <p className="font-h4 font-mono text-success">{formatCurrency(totalIncome)}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 rounded-[10px] px-4 py-3"
          style={{ background: 'rgba(220, 38, 38, 0.06)' }}
        >
          <TrendingDown size={16} className="text-danger" />
          <div>
            <p className="font-overline text-neutral-300">Total dépenses</p>
            <p className="font-h4 font-mono text-danger">{formatCurrency(totalExpense)}</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="flex items-center gap-3 rounded-[10px] px-4 py-3 bg-warm-white border border-warm-gray"
        >
          <Receipt size={16} className="text-neutral-300" />
          <div>
            <p className="font-overline text-neutral-300">Transactions</p>
            <p className="font-h4 text-neutral-100">{filtered.length}</p>
          </div>
        </motion.div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <div className="bg-warm-white rounded-xl shadow-card overflow-hidden">
        {/* Table header */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-warm-gray">
                <th className="px-3 py-3 w-10">
                  <button
                    onClick={toggleSelectAll}
                    className={cn(
                      'w-5 h-5 rounded border transition-colors flex items-center justify-center',
                      paginated.length > 0 && paginated.every((t) => selected.has(t.id))
                        ? 'bg-accent-gold border-accent-gold'
                        : 'border-neutral-400 hover:border-accent-gold'
                    )}
                  >
                    {paginated.length > 0 && paginated.every((t) => selected.has(t.id)) && (
                      <Check size={12} className="text-[#1A1A1A]" />
                    )}
                  </button>
                </th>
                <SortHeader label="Date" sortKey="date" sort={sort} onToggle={toggleSort} />
                <SortHeader label="Description" sortKey="description" sort={sort} onToggle={toggleSort} />
                <th className="px-4 py-3 text-left">
                  <span className="font-overline text-neutral-300">Catégorie</span>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="font-overline text-neutral-300">Type</span>
                </th>
                <th className="px-4 py-3 text-center">
                  <span className="font-overline text-neutral-300">Méthode</span>
                </th>
                <SortHeader label="Montant" sortKey="amount" sort={sort} onToggle={toggleSort} align="right" />
                <th className="px-4 py-3 w-[60px]" />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginated.map((tx, i) => {
                  const cat = getCategoryById(tx.category);
                  const PaymentIcon = paymentIcons[tx.paymentMethod];
                  const isSelected = selected.has(tx.id);
                  const isHighlighted = highlightId === tx.id;

                  return (
                    <motion.tr
                      key={tx.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        backgroundColor: isHighlighted
                          ? 'rgba(212, 168, 83, 0.1)'
                          : isSelected
                          ? 'rgba(212, 168, 83, 0.08)'
                          : 'transparent',
                      }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className={cn(
                        'border-b border-[#F0F0ED] h-14 transition-colors hover:bg-[rgba(212,168,83,0.04)]',
                      )}
                    >
                      <td className="px-3">
                        <button
                          onClick={() => toggleSelect(tx.id)}
                          className={cn(
                            'w-5 h-5 rounded border transition-colors flex items-center justify-center',
                            isSelected
                              ? 'bg-accent-gold border-accent-gold'
                              : 'border-neutral-400 hover:border-accent-gold'
                          )}
                        >
                          {isSelected && <Check size={12} className="text-[#1A1A1A]" />}
                        </button>
                      </td>
                      <td className="px-4">
                        <span className="font-body-sm text-neutral-300">{formatDate(tx.date)}</span>
                      </td>
                      <td className="px-4 max-w-[240px]">
                        <span className="font-body text-[15px] font-medium text-neutral-100 truncate block" title={tx.description}>
                          {tx.description}
                        </span>
                      </td>
                      <td className="px-4">
                        {cat && (
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: cat.color }}
                            />
                            <span className="font-body-sm text-neutral-200">{cat.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded font-caption',
                            tx.type === 'income'
                              ? 'bg-success-light text-success'
                              : 'bg-danger-light text-danger'
                          )}
                        >
                          {tx.type === 'income' ? 'Revenu' : 'Dépense'}
                        </span>
                      </td>
                      <td className="px-4 text-center">
                        {PaymentIcon && (
                          <span title={paymentLabels[tx.paymentMethod]}>
                            <PaymentIcon size={18} className="text-neutral-400 mx-auto" />
                          </span>
                        )}
                      </td>
                      <td className="px-4 text-right">
                        <span
                          className={cn(
                            'font-body font-semibold font-mono',
                            tx.type === 'income' ? 'text-success' : 'text-danger'
                          )}
                        >
                          {formatCurrencySigned(tx.amount)}
                        </span>
                      </td>
                      <td className="px-4">
                        <TxActionsMenu tx={tx} onEdit={openEdit} onDelete={setDeleteModal} />
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <img src="/empty-transactions.svg" alt="Aucune transaction" className="w-48 h-36 mb-6 opacity-60" />
            <h3 className="font-h4 text-neutral-200 mb-2">Aucune transaction</h3>
            <p className="font-body-sm text-neutral-300 max-w-sm text-center mb-6">
              Ajoutez votre première transaction ou modifiez vos filtres.
            </p>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-[10px] bg-accent-gold text-[#1A1A1A] text-sm font-semibold hover:bg-[#C49A43] hover:-translate-y-px hover:shadow-card-hover transition-all"
            >
              <Plus size={16} />
              Ajouter une transaction
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-warm-gray">
            <div className="flex items-center gap-3">
              <span className="font-body-sm text-neutral-300">
                Affichage {(pageSafe - 1) * perPage + 1}-{Math.min(pageSafe * perPage, filtered.length)} sur {filtered.length}
              </span>
              <select
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="h-8 px-2 rounded-lg bg-warm-cream border border-warm-gray text-xs text-neutral-300 focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageSafe <= 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-300 hover:bg-warm-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pageSafe <= 3) {
                  pageNum = i + 1;
                } else if (pageSafe >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = pageSafe - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors',
                      pageNum === pageSafe
                        ? 'bg-accent-gold text-[#1A1A1A]'
                        : 'text-neutral-300 hover:bg-warm-cream'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageSafe >= totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-300 hover:bg-warm-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bulk Actions Bar ──────────────────────────────────────── */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            className="fixed bottom-4 left-4 right-4 lg:left-[276px] lg:right-8 z-[100] rounded-xl px-5 py-3 flex items-center justify-between"
            style={{ background: '#1A1A1A', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
          >
            <span className="font-body text-[15px] font-medium text-warm-cream">
              {selected.size} sélectionnée{selected.size > 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => exportToCSV(txs.filter((t) => selected.has(t.id)))}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] border border-white/20 text-warm-cream text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Download size={14} />
                Exporter
              </button>
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-[10px] text-danger-light text-sm font-medium hover:bg-danger/20 transition-colors"
              >
                <Trash2 size={14} />
                Supprimer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add/Edit Drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <TxDrawer
            key="drawer"
            editing={editingTx}
            categories={categories}
            onSave={handleSave}
            onClose={() => {
              setDrawerOpen(false);
              setEditingTx(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ─────────────────────────────── */}
      <AnimatePresence>
        {deleteModal && (
          <DeleteModal
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

/* ── SortHeader ─────────────────────────────────────────────────────── */

function SortHeader({
  label,
  sortKey,
  sort,
  onToggle,
  align = 'left',
}: {
  label: string;
  sortKey: SortConfig['key'];
  sort: SortConfig;
  onToggle: (k: SortConfig['key']) => void;
  align?: 'left' | 'right';
}) {
  const active = sort.key === sortKey;
  return (
    <th
      className={cn('px-4 py-3 cursor-pointer select-none group', align === 'right' && 'text-right')}
      onClick={() => onToggle(sortKey)}
    >
      <span className={cn('inline-flex items-center gap-1 font-overline', active ? 'text-accent-gold' : 'text-neutral-300 group-hover:text-neutral-200')}>
        {label}
        {active &&
          (sort.direction === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />)}
      </span>
    </th>
  );
}

/* ── CategoryFilterDropdown ────────────────────────────────────────── */

function CategoryFilterDropdown({
  selected,
  onChange,
  expenseCats,
  incomeCats,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
  expenseCats: typeof categories;
  incomeCats: typeof categories;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((c) => c !== id) : [...selected, id]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-2 h-10 px-4 rounded-[10px] border text-sm font-medium transition-colors',
          selected.length > 0
            ? 'border-accent-gold bg-accent-gold/5 text-neutral-100'
            : 'border-neutral-500 text-neutral-200 hover:bg-warm-white'
        )}
      >
        <Filter size={16} />
        Catégorie{selected.length > 0 && ` (${selected.length})`}
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[998]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-56 bg-warm-white rounded-xl shadow-card-hover border border-warm-gray z-[999] p-2 max-h-72 overflow-y-auto"
            >
              <div className="px-2 py-1.5">
                <span className="font-caption text-neutral-400 uppercase">Dépenses</span>
              </div>
              {expenseCats.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggle(cat.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors',
                    selected.includes(cat.id) ? 'bg-accent-gold/10 text-neutral-100' : 'text-neutral-200 hover:bg-warm-cream'
                  )}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                  {selected.includes(cat.id) && <Check size={14} className="ml-auto text-accent-gold" />}
                </button>
              ))}
              <div className="px-2 py-1.5 mt-1 border-t border-warm-gray">
                <span className="font-caption text-neutral-400 uppercase">Revenus</span>
              </div>
              {incomeCats.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggle(cat.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors',
                    selected.includes(cat.id) ? 'bg-accent-gold/10 text-neutral-100' : 'text-neutral-200 hover:bg-warm-cream'
                  )}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                  {selected.includes(cat.id) && <Check size={14} className="ml-auto text-accent-gold" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── TxActionsMenu ─────────────────────────────────────────────────── */

function TxActionsMenu({
  tx,
  onEdit,
  onDelete,
}: {
  tx: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
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
                  onEdit(tx);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-200 hover:bg-warm-cream transition-colors"
              >
                <Pencil size={14} />
                Éditer
              </button>
              <button
                onClick={() => {
                  onDelete(tx);
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

/* ── TxDrawer ──────────────────────────────────────────────────────── */

function TxDrawer({
  editing,
  categories,
  onSave,
  onClose,
}: {
  editing: Transaction | null;
  categories: typeof import('@/data/mockData').categories;
  onSave: (data: any) => void;
  onClose: () => void;
}) {
  const [type, setType] = useState<'expense' | 'income'>(editing?.type ?? 'expense');
  const [amount, setAmount] = useState(editing ? String(Math.abs(editing.amount)) : '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [category, setCategory] = useState(editing?.category ?? '');
  const [date, setDate] = useState(editing?.date ?? new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer' | 'check'>(
    editing?.paymentMethod ?? 'card'
  );
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const expenseCats = categories.filter((c) => c.type === 'expense');
  const incomeCats = categories.filter((c) => c.type === 'income');

  // Update category when type changes
  useEffect(() => {
    const valid = categories.filter((c) => c.type === type);
    if (!valid.some((c) => c.id === category)) {
      setCategory(valid[0]?.id ?? '');
    }
  }, [type, categories, category]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Montant requis';
    if (!description.trim()) e.description = 'Description requise';
    if (!category) e.category = 'Catégorie requise';
    if (!date) e.date = 'Date requise';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const numAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));
    onSave({
      id: editing?.id,
      date,
      description: description.trim(),
      amount: numAmount,
      category,
      type,
      paymentMethod,
      notes: notes.trim() || undefined,
    });
  };

  const paymentOptions: { key: typeof paymentMethod; icon: typeof CreditCard; label: string }[] = [
    { key: 'card', icon: CreditCard, label: 'Carte' },
    { key: 'cash', icon: Banknote, label: 'Espèces' },
    { key: 'transfer', icon: ArrowLeftRight, label: 'Virement' },
    { key: 'check', icon: FileText, label: 'Chèque' },
  ];

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[1000]"
        style={{ background: 'rgba(26, 26, 26, 0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        className="fixed top-0 right-0 h-full w-full sm:w-[440px] z-[1001] bg-warm-white flex flex-col"
        style={{ borderRadius: '16px 0 0 16px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-warm-gray">
          <h2 className="font-h3 text-neutral-100">
            {editing ? 'Modifier la transaction' : 'Nouvelle transaction'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-warm-cream hover:text-neutral-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {/* Type toggle */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="flex rounded-[10px] border border-neutral-500 overflow-hidden">
              <button
                onClick={() => setType('expense')}
                className={cn(
                  'flex-1 h-11 text-sm font-semibold transition-colors',
                  type === 'expense' ? 'bg-danger-light text-danger border-b-2 border-danger' : 'text-neutral-300 hover:bg-warm-cream'
                )}
              >
                Dépense
              </button>
              <button
                onClick={() => setType('income')}
                className={cn(
                  'flex-1 h-11 text-sm font-semibold transition-colors',
                  type === 'income' ? 'bg-success-light text-success border-b-2 border-success' : 'text-neutral-300 hover:bg-warm-cream'
                )}
              >
                Revenu
              </button>
            </div>
          </motion.div>

          {/* Amount */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className="font-caption uppercase text-neutral-300 mb-2 block">Montant *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-neutral-400">€</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                autoFocus
                className={cn(
                  'w-full h-14 pl-10 pr-4 rounded-[10px] border bg-warm-white font-mono text-2xl text-neutral-100 text-right placeholder:text-neutral-400 focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,168,83,0.15)] transition-all',
                  errors.amount ? 'border-danger' : 'border-neutral-500 focus:border-accent-gold'
                )}
              />
            </div>
            {errors.amount && <p className="font-caption text-danger mt-1">{errors.amount}</p>}
          </motion.div>

          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <label className="font-caption uppercase text-neutral-300 mb-2 block">Description *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Courses hebdomadaires"
              className={cn(
                'w-full h-11 px-4 rounded-[10px] border bg-warm-white text-sm text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,168,83,0.15)] transition-all',
                errors.description ? 'border-danger' : 'border-neutral-500 focus:border-accent-gold'
              )}
            />
            {errors.description && <p className="font-caption text-danger mt-1">{errors.description}</p>}
          </motion.div>

          {/* Category */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <label className="font-caption uppercase text-neutral-300 mb-2 block">Catégorie *</label>
            <div className={cn('rounded-[10px] border bg-warm-white overflow-hidden', errors.category ? 'border-danger' : 'border-neutral-500')}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-4 bg-transparent text-sm text-neutral-100 focus:outline-none appearance-none cursor-pointer"
              >
                {type === 'expense' && (
                  <optgroup label="Dépenses">
                    {expenseCats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                {type === 'income' && (
                  <optgroup label="Revenus">
                    {incomeCats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
            {errors.category && <p className="font-caption text-danger mt-1">{errors.category}</p>}
          </motion.div>

          {/* Date */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <label className="font-caption uppercase text-neutral-300 mb-2 block">Date *</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={cn(
                  'w-full h-11 pl-10 pr-4 rounded-[10px] border bg-warm-white text-sm text-neutral-100 focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,168,83,0.15)] transition-all',
                  errors.date ? 'border-danger' : 'border-neutral-500 focus:border-accent-gold'
                )}
              />
            </div>
            {errors.date && <p className="font-caption text-danger mt-1">{errors.date}</p>}
          </motion.div>

          {/* Payment method */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <label className="font-caption uppercase text-neutral-300 mb-2 block">Méthode de paiement</label>
            <div className="grid grid-cols-4 gap-2">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setPaymentMethod(opt.key)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 py-3 rounded-[10px] border text-xs font-medium transition-all',
                      paymentMethod === opt.key
                        ? 'border-accent-gold bg-accent-gold/10 text-neutral-100'
                        : 'border-neutral-500 text-neutral-300 hover:bg-warm-cream'
                    )}
                  >
                    <Icon size={18} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Notes */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <label className="font-caption uppercase text-neutral-300 mb-2 block">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Détails additionnels..."
              rows={3}
              className="w-full px-4 py-3 rounded-[10px] border border-neutral-500 bg-warm-white text-sm text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(212,168,83,0.15)] transition-all resize-none"
            />
          </motion.div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-warm-gray bg-warm-white flex items-center gap-3">
          <button
            onClick={onClose}
            className="h-11 px-5 rounded-[10px] text-sm font-medium text-neutral-200 hover:bg-warm-cream transition-colors"
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

/* ── DeleteModal ───────────────────────────────────────────────────── */

function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
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
        <h3 className="font-h3 text-neutral-100 mb-2">Supprimer cette transaction ?</h3>
        <p className="font-body text-neutral-300 mb-6">
          Cette action est irréversible. La transaction sera définitivement supprimée.
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
