import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Scale,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  monthlyData,
  wealthData,
  categorySpending,
  analyticsKPIs,
  radarData,
  formatCurrency,
  formatCurrencyFull,
  monthlyDebtData,
  debtPersonAnalytics,
  debtAnalyticsKPIs,
} from '@/data/mockData';
import type { CategorySpend } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ReferenceLine,
} from 'recharts';

// ─── Types ───────────────────────────────────────────────────────────

type PeriodTab = '6m' | '1y' | 'custom';

type SortKey = 'name' | 'amount' | 'percentage' | 'previousAmount' | 'evolution';
type SortDir = 'asc' | 'desc';

// ─── KPI Card ────────────────────────────────────────────────────────

function KPICard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  value,
  valueColor,
  trend,
  trendColor,
  extra,
  delay = 0,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string;
  valueColor?: string;
  trend?: string;
  trendColor?: string;
  extra?: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="bg-warm-white rounded-xl shadow-card p-5 flex-1 min-w-[200px]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: iconBg }}>
          <span style={{ color: iconColor, display: 'inline-flex', lineHeight: 1 }}>
            <Icon size={20} />
          </span>
        </div>
        {extra}
      </div>
      <p className="font-caption text-neutral-300 mb-1">{title}</p>
      <p className={cn('font-h3 font-mono', valueColor || 'text-neutral-100')}>{value}</p>
      {trend && (
        <p className={cn('font-body-sm mt-1', trendColor || 'text-neutral-300')}>
          {trend}
        </p>
      )}
    </motion.div>
  );
}

// ─── Mini Doughnut (Savings Rate) ───────────────────────────────────

function MiniDoughnut({ percentage, color = '#D4A853', size = 40 }: { percentage: number; color?: string; size?: number }) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, percentage) / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8E8E4" strokeWidth={4} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
    </svg>
  );
}

// ─── Chart Tooltip ───────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-100 text-white px-4 py-3 rounded-lg shadow-lg border-0">
      <p className="font-body-sm font-medium mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 font-body-sm">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-neutral-400">{p.name}:</span>
          <span className="font-mono font-medium">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Sortable Table Header ──────────────────────────────────────────

function SortHeader({
  label,
  sortKey,
  currentSort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: { key: SortKey; dir: SortDir };
  onSort: (key: SortKey) => void;
}) {
  const active = currentSort.key === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 font-overline text-neutral-300 hover:text-neutral-200 transition-colors uppercase"
    >
      {label}
      {active && (
        currentSort.dir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />
      )}
    </button>
  );
}

// ─── Sparkline Mini Chart ────────────────────────────────────────────

function Sparkline({ data, color, width = 60, height = 20 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (!data.length) return <div style={{ width, height }} />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * height,
  }));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg width={width} height={height}>
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Category Detail Row (Expandable) ───────────────────────────────

function CategoryDetailRow({
  category,
  index,
}: {
  category: CategorySpend;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div
        className="flex items-center gap-4 py-3 px-4 hover:bg-accent-gold/[0.03] transition-colors cursor-pointer border-b border-warm-gray last:border-0"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Category name */}
        <div className="flex items-center gap-3 min-w-[160px] flex-1">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
          <span className="font-body-sm font-medium text-neutral-200">{category.name}</span>
        </div>

        {/* Amount */}
        <div className="min-w-[100px] text-right">
          <span className="font-body-sm font-mono text-neutral-100">{formatCurrency(category.amount)}</span>
        </div>

        {/* Percentage with bar */}
        <div className="min-w-[120px] flex items-center gap-2">
          <div className="w-[60px] h-1.5 bg-warm-gray rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.min(100, category.percentage)}%`, backgroundColor: category.color }}
            />
          </div>
          <span className="font-caption text-neutral-300">{category.percentage.toFixed(1)}%</span>
        </div>

        {/* Previous period */}
        <div className="min-w-[100px] text-right hidden md:block">
          <span className="font-body-sm font-mono text-neutral-300">{formatCurrency(category.previousAmount)}</span>
        </div>

        {/* Evolution */}
        <div className="min-w-[80px] text-right hidden sm:block">
          <span className={cn('font-body-sm font-medium inline-flex items-center gap-0.5', category.evolution <= 0 ? 'text-success' : 'text-danger')}>
            {category.evolution <= 0 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
            {Math.abs(category.evolution).toFixed(1)}%
          </span>
        </div>

        {/* Sparkline */}
        <div className="min-w-[60px] hidden lg:block">
          <Sparkline data={category.trend} color={category.color} />
        </div>
      </div>

      {/* Expanded sub-categories */}
      {expanded && category.subCategories && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-warm-cream/50 border-b border-warm-gray"
        >
          {category.subCategories.map((sub, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-4 pl-10">
              <span className="font-body-sm text-neutral-300">{sub.name}</span>
              <span className="font-body-sm font-mono text-neutral-300">{formatCurrency(sub.amount)}</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Main Analytics Page ─────────────────────────────────────────────

export default function Analytics() {
  const [periodTab, setPeriodTab] = useState<PeriodTab>('1y');
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'amount', dir: 'desc' });
  const [showCustomDate, setShowCustomDate] = useState(false);

  const handleSort = useCallback((key: SortKey) => {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc',
    }));
  }, []);

  const sortedCategories = useMemo(() => {
    const sorted = [...categorySpending].sort((a, b) => {
      const aVal = a[sort.key];
      const bVal = b[sort.key];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sort.dir === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      }
      return sort.dir === 'desc' ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
    });
    return sorted;
  }, [sort]);

  const chartData = useMemo(() => {
    if (periodTab === '6m') return monthlyData.slice(-6);
    return monthlyData;
  }, [periodTab]);

  // Average income and expense
  const avgRevenus = useMemo(() => {
    const total = chartData.reduce((s, d) => s + d.revenus, 0);
    return total / chartData.length;
  }, [chartData]);

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
          <BarChart3 size={24} className="text-accent-gold" />
          <h1 className="font-h2 text-neutral-100">Analyses</h1>
        </div>
        <Button
          variant="secondary"
          className="h-10 rounded-[10px] gap-2 text-neutral-200 border border-neutral-500 hover:border-accent-gold"
        >
          <Download size={16} />
          Exporter
        </Button>
      </div>

      {/* Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <div className="inline-flex bg-warm-gray rounded-[10px] p-[3px] h-10">
          {[
            { key: '6m' as PeriodTab, label: '6 derniers mois' },
            { key: '1y' as PeriodTab, label: 'Cette annee' },
            { key: 'custom' as PeriodTab, label: 'Personnalise' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setPeriodTab(tab.key);
                setShowCustomDate(tab.key === 'custom');
              }}
              className={cn(
                'px-4 py-1.5 rounded-[8px] font-body-sm font-medium transition-all duration-200',
                periodTab === tab.key
                  ? 'bg-warm-white text-neutral-100 shadow-sm'
                  : 'text-neutral-300 hover:text-neutral-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Custom date range */}
        {showCustomDate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 flex flex-wrap items-center gap-3"
          >
            <span className="font-body-sm text-neutral-300">Du</span>
            <input
              type="date"
              className="h-9 px-3 rounded-lg border border-neutral-500 bg-warm-white font-body-sm text-neutral-200 focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/15 outline-none"
            />
            <span className="font-body-sm text-neutral-300">au</span>
            <input
              type="date"
              className="h-9 px-3 rounded-lg border border-neutral-500 bg-warm-white font-body-sm text-neutral-200 focus:border-accent-gold focus:ring-2 focus:ring-accent-gold/15 outline-none"
            />
            <div className="flex gap-1.5 ml-2">
              {['7 jours', '30 jours', '3 mois', '6 mois', '1 an'].map((preset) => (
                <button
                  key={preset}
                  className="px-2.5 py-1 rounded-md bg-warm-cream text-neutral-300 font-caption hover:bg-warm-gray hover:text-neutral-200 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          icon={Wallet}
          iconBg="rgba(37,99,235,0.1)"
          iconColor="#2563EB"
          title="Solde actuel"
          value={formatCurrencyFull(analyticsKPIs.soldeActuel)}
          trend={`+${formatCurrency(analyticsKPIs.soldeTrend)} vs periode precedente`}
          trendColor="text-success"
          delay={0}
        />
        <KPICard
          icon={TrendingUp}
          iconBg="rgba(22,163,74,0.1)"
          iconColor="#16A34A"
          title="Total revenus"
          value={formatCurrencyFull(analyticsKPIs.totalRevenus)}
          valueColor="text-success"
          trend={`+${analyticsKPIs.revenusTrend}% vs periode precedente`}
          trendColor="text-success"
          delay={0.1}
        />
        <KPICard
          icon={TrendingDown}
          iconBg="rgba(220,38,38,0.1)"
          iconColor="#DC2626"
          title="Total depenses"
          value={formatCurrencyFull(analyticsKPIs.totalDepenses)}
          valueColor="text-danger"
          trend={`${analyticsKPIs.depensesTrend}% vs periode precedente`}
          trendColor="text-success"
          delay={0.2}
        />
        <KPICard
          icon={PiggyBank}
          iconBg="rgba(212,168,83,0.1)"
          iconColor="#D4A853"
          title="Economies"
          value={formatCurrencyFull(analyticsKPIs.economies)}
          valueColor="text-accent-gold"
          trend={`${analyticsKPIs.tauxEpargne}% d'economies`}
          trendColor="text-accent-gold"
          extra={
            <div className="not-rotate-90">
              <MiniDoughnut percentage={analyticsKPIs.tauxEpargne} color="#D4A853" size={40} />
            </div>
          }
          delay={0.3}
        />
      </div>

      {/* ─── DEBT KPI CARDS ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="mb-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Scale size={20} className="text-accent-gold" />
          <h3 className="font-h3 text-neutral-100">Dettes</h3>
          <span className="font-caption text-neutral-300 ml-2">Vue d'ensemble</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={TrendingUp}
            iconBg="rgba(37,99,235,0.1)"
            iconColor="#2563EB"
            title="A recevoir"
            value={formatCurrencyFull(debtAnalyticsKPIs.totalARecevoir)}
            trend={`${debtAnalyticsKPIs.dettesActives} dettes actives`}
            trendColor="text-info"
            delay={0}
          />
          <KPICard
            icon={TrendingDown}
            iconBg="rgba(220,38,38,0.1)"
            iconColor="#DC2626"
            title="A rembourser"
            value={formatCurrencyFull(debtAnalyticsKPIs.totalARembourser)}
            trend={`${debtAnalyticsKPIs.tauxRecuperation}% recupere`}
            trendColor="text-neutral-300"
            delay={0.1}
          />
          <KPICard
            icon={Wallet}
            iconBg="rgba(212,168,83,0.1)"
            iconColor="#D4A853"
            title="Solde net dettes"
            value={formatCurrencyFull(debtAnalyticsKPIs.soldeNetDettes)}
            valueColor="text-accent-gold"
            trend={debtAnalyticsKPIs.soldeNetDettes >= 0 ? "Vous etes crediteur" : "Vous etes debiteur"}
            trendColor={debtAnalyticsKPIs.soldeNetDettes >= 0 ? "text-success" : "text-danger"}
            delay={0.2}
          />
          <KPICard
            icon={BarChart3}
            iconBg="rgba(220,38,38,0.1)"
            iconColor="#DC2626"
            title="En retard"
            value={formatCurrencyFull(debtAnalyticsKPIs.enRetard)}
            trend={`${debtAnalyticsKPIs.dettesEnRetard} dette(s) en retard`}
            trendColor="text-danger"
            delay={0.3}
          />
        </div>
      </motion.div>

      {/* Charts Row: Debt Evolution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Area Chart: Dettes - A recevoir vs A rembourser */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-warm-white rounded-xl shadow-card p-6"
        >
          <div className="mb-5">
            <h4 className="font-h4 text-neutral-100">Evolution des dettes</h4>
            <p className="font-body-sm text-neutral-300 mt-0.5">A recevoir vs A rembourser (cumule)</p>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span className="font-caption text-neutral-300">A recevoir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
              <span className="font-caption text-neutral-300">A rembourser</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyDebtData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRecevoir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRembourser" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E4" vertical={false} />
              <XAxis dataKey="monthShort" tick={{ fontSize: 11, fill: '#7A7A7A' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#7A7A7A' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="aRecevoir" name="A recevoir" stroke="#2563EB" strokeWidth={2.5} fill="url(#gradRecevoir)" dot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2, fill: '#fff' }} animationDuration={1200} animationEasing="ease-out" />
              <Area type="monotone" dataKey="aRembourser" name="A rembourser" stroke="#DC2626" strokeWidth={2.5} fill="url(#gradRembourser)" dot={{ r: 4, fill: '#DC2626', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#DC2626', strokeWidth: 2, fill: '#fff' }} animationDuration={1200} animationBegin={200} animationEasing="ease-out" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart: Solde net des dettes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-warm-white rounded-xl shadow-card p-6"
        >
          <div className="mb-5">
            <h4 className="font-h4 text-neutral-100">Solde net mensuel</h4>
            <p className="font-body-sm text-neutral-300 mt-0.5">Position crediteur (+) ou debiteur (-)</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyDebtData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barCategoryGap={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E4" vertical={false} />
              <XAxis dataKey="monthShort" tick={{ fontSize: 11, fill: '#7A7A7A' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#7A7A7A' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={0} stroke="#7A7A7A" strokeDasharray="4 4" />
              <Bar dataKey="soldeNet" name="Solde net" radius={[4, 4, 0, 0]} barSize={28} animationDuration={800} animationEasing="ease-out">
                {monthlyDebtData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.soldeNet >= 0 ? '#16A34A' : '#DC2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 1: Line Chart + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Line Chart: Revenus vs Depenses */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-warm-white rounded-xl shadow-card p-6 lg:col-span-3"
        >
          <div className="mb-5">
            <h4 className="font-h4 text-neutral-100">Revenus vs Depenses</h4>
            <p className="font-body-sm text-neutral-300 mt-0.5">Comparaison mensuelle</p>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="font-caption text-neutral-300">Revenus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-danger" />
              <span className="font-caption text-neutral-300">Depenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E4" vertical={false} />
              <XAxis
                dataKey="monthShort"
                tick={{ fontSize: 11, fill: '#7A7A7A' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: '#7A7A7A' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={avgRevenus}
                stroke="#B0B0B0"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <Area
                type="monotone"
                dataKey="revenus"
                name="Revenus"
                stroke="#16A34A"
                strokeWidth={2.5}
                fill="url(#gradRev)"
                dot={{ r: 4, fill: '#16A34A', strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: '#16A34A', strokeWidth: 2, fill: '#fff' }}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="depenses"
                name="Depenses"
                stroke="#DC2626"
                strokeWidth={2.5}
                fill="url(#gradDep)"
                dot={{ r: 4, fill: '#DC2626', strokeWidth: 0 }}
                activeDot={{ r: 6, stroke: '#DC2626', strokeWidth: 2, fill: '#fff' }}
                animationDuration={1200}
                animationBegin={200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Horizontal Bar Chart: Top Categories */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-warm-white rounded-xl shadow-card p-6 lg:col-span-2"
        >
          <div className="mb-5">
            <h4 className="font-h4 text-neutral-100">Top categories</h4>
            <p className="font-body-sm text-neutral-300 mt-0.5">Depenses par categorie</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[...categorySpending].sort((a, b) => b.amount - a.amount).slice(0, 8)}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
              barCategoryGap={12}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E4" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 10, fill: '#7A7A7A' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#4A4A4A' }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="amount"
                name="Montant"
                radius={[0, 4, 4, 0]}
                barSize={22}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {categorySpending.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2: Area Chart + Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Area Chart: Evolution du Patrimoine */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-warm-white rounded-xl shadow-card p-6"
        >
          <div className="mb-5">
            <h4 className="font-h4 text-neutral-100">Evolution du patrimoine</h4>
            <p className="font-body-sm text-neutral-300 mt-0.5">Cumul des actifs sur la periode</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={wealthData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="patrimoineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4A853" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#D4A853" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E4" vertical={false} />
              <XAxis
                dataKey="monthShort"
                tick={{ fontSize: 11, fill: '#7A7A7A' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: '#7A7A7A' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="patrimoine"
                name="Patrimoine"
                stroke="#D4A853"
                strokeWidth={2.5}
                fill="url(#patrimoineGradient)"
                dot={{ r: 3, fill: '#D4A853', strokeWidth: 0 }}
                activeDot={{ r: 5, stroke: '#D4A853', strokeWidth: 2, fill: '#fff' }}
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar Chart: Repartition Mensuelle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-warm-white rounded-xl shadow-card p-6"
        >
          <div className="mb-5">
            <h4 className="font-h4 text-neutral-100">Repartition mensuelle</h4>
            <p className="font-body-sm text-neutral-300 mt-0.5">Comparaison des mois</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#E8E8E4" />
              <PolarAngleAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#7A7A7A' }}
              />
              <PolarRadiusAxis
                tick={{ fontSize: 9, fill: '#B0B0B0' }}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              />
              <Radar
                name="Revenus"
                dataKey="Revenus"
                stroke="#16A34A"
                strokeWidth={2}
                fill="rgba(22, 163, 74, 0.1)"
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <Radar
                name="Depenses"
                dataKey="Depenses"
                stroke="#DC2626"
                strokeWidth={2}
                fill="rgba(220, 38, 38, 0.1)"
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Detailed Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="bg-warm-white rounded-xl shadow-card p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h4 className="font-h4 text-neutral-100">Detail par categorie</h4>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-[10px] gap-2 text-neutral-200 border border-neutral-500 hover:border-accent-gold"
          >
            <Download size={14} />
            CSV
          </Button>
        </div>

        {/* Table Header */}
        <div className="flex items-center gap-4 py-2.5 px-4 border-b border-warm-gray bg-warm-cream/50 rounded-t-lg">
          <div className="min-w-[160px] flex-1">
            <SortHeader label="Categorie" sortKey="name" currentSort={sort} onSort={handleSort} />
          </div>
          <div className="min-w-[100px] text-right">
            <SortHeader label="Montant" sortKey="amount" currentSort={sort} onSort={handleSort} />
          </div>
          <div className="min-w-[120px]">
            <span className="font-overline text-neutral-300 uppercase">% du total</span>
          </div>
          <div className="min-w-[100px] text-right hidden md:block">
            <SortHeader label="Periode prec." sortKey="previousAmount" currentSort={sort} onSort={handleSort} />
          </div>
          <div className="min-w-[80px] text-right hidden sm:block">
            <SortHeader label="Evolution" sortKey="evolution" currentSort={sort} onSort={handleSort} />
          </div>
          <div className="min-w-[60px] hidden lg:block">
            <span className="font-overline text-neutral-300 uppercase">Tendance</span>
          </div>
        </div>

        {/* Table Rows */}
        <div>
          {sortedCategories.map((cat, i) => (
            <CategoryDetailRow key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </motion.div>

      {/* ─── Debt by Person Table ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="bg-warm-white rounded-xl shadow-card p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h4 className="font-h4 text-neutral-100">Dettes par personne</h4>
          <Button variant="secondary" size="sm" className="rounded-[10px] gap-2 text-neutral-200 border border-neutral-500 hover:border-accent-gold">
            <Download size={14} />
            CSV
          </Button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 py-2.5 px-4 border-b border-warm-gray bg-warm-cream/50 rounded-t-lg font-overline text-neutral-300 uppercase text-xs">
          <div className="col-span-3">Personne</div>
          <div className="col-span-2 text-right">Prete</div>
          <div className="col-span-2 text-right">Emprunte</div>
          <div className="col-span-2 text-right">Recu</div>
          <div className="col-span-2 text-right">Paye</div>
          <div className="col-span-1 text-right">Solde</div>
        </div>

        {/* Table Rows */}
        {debtPersonAnalytics.sort((a, b) => b.netBalance - a.netBalance).map((person, i) => (
          <motion.div
            key={person.personName}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
            className="grid grid-cols-12 gap-2 py-3 px-4 border-b border-warm-gray last:border-0 hover:bg-accent-gold/[0.03] transition-colors"
          >
            <div className="col-span-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-accent-gold/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-accent-gold">{person.personName.charAt(0)}</span>
              </div>
              <span className="font-body-sm font-medium text-neutral-200 truncate">{person.personName}</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="font-body-sm font-mono text-neutral-200">{formatCurrency(person.totalLent)}</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="font-body-sm font-mono text-neutral-200">{formatCurrency(person.totalBorrowed)}</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="font-body-sm font-mono text-success">{formatCurrency(person.repaidToMe)}</span>
            </div>
            <div className="col-span-2 text-right">
              <span className="font-body-sm font-mono text-danger">{formatCurrency(person.repaidByMe)}</span>
            </div>
            <div className="col-span-1 text-right">
              <span className={cn('font-body-sm font-mono font-medium', person.netBalance >= 0 ? 'text-success' : 'text-danger')}>
                {formatCurrency(person.netBalance)}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Totals Row */}
        <div className="grid grid-cols-12 gap-2 py-3 px-4 bg-warm-cream/50 rounded-b-lg mt-1 font-body-sm font-semibold">
          <div className="col-span-3 text-neutral-200">Total</div>
          <div className="col-span-2 text-right font-mono text-neutral-200">
            {formatCurrency(debtPersonAnalytics.reduce((s, p) => s + p.totalLent, 0))}
          </div>
          <div className="col-span-2 text-right font-mono text-neutral-200">
            {formatCurrency(debtPersonAnalytics.reduce((s, p) => s + p.totalBorrowed, 0))}
          </div>
          <div className="col-span-2 text-right font-mono text-success">
            {formatCurrency(debtPersonAnalytics.reduce((s, p) => s + p.repaidToMe, 0))}
          </div>
          <div className="col-span-2 text-right font-mono text-danger">
            {formatCurrency(debtPersonAnalytics.reduce((s, p) => s + p.repaidByMe, 0))}
          </div>
          <div className="col-span-1 text-right font-mono text-accent-gold">
            {formatCurrency(debtPersonAnalytics.reduce((s, p) => s + p.netBalance, 0))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
