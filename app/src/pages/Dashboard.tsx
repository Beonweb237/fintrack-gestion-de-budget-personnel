import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plane,
  Car,
  Shield,
  ChevronRight,
  Calendar,
  ChevronDown,
} from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts'
import { useCountUp } from '@/hooks/useCountUp'

// --- Data ---
const monthlyExpenses = [
  { month: 'Nov', value: 3200 },
  { month: 'Dec', value: 3850 },
  { month: 'Janv', value: 2900 },
  { month: 'Fevr', value: 3100 },
  { month: 'Mars', value: 2650 },
  { month: 'Avr', value: 2830 },
]

const budgets = [
  { name: 'Alimentation', spent: 420, limit: 500, color: '#D97706' },
  { name: 'Transport', spent: 180, limit: 200, color: '#DC2626' },
  { name: 'Loisirs', spent: 95, limit: 150, color: '#D4A853' },
]

const categoryData = [
  { name: 'Alimentation', value: 420, color: '#D4A853' },
  { name: 'Transport', value: 380, color: '#C49A43' },
  { name: 'Logement', value: 850, color: '#B08A3A' },
  { name: 'Loisirs', value: 295, color: '#9C7A32' },
  { name: 'Abonnements', value: 185, color: '#886A2A' },
  { name: 'Autres', value: 700, color: '#E8E8E4' },
]

const goals = [
  { name: 'Vacances ete', icon: Plane, current: 3200, target: 5000, deadline: '15 juillet', color: '#2563EB' },
  { name: 'Nouvelle voiture', icon: Car, current: 8500, target: 15000, deadline: '31 decembre', color: '#16A34A' },
  { name: 'Fonds d\'urgence', icon: Shield, current: 4000, target: 6000, deadline: '30 juin', color: '#DC2626' },
]

const transactions = [
  { date: '15 avr.', desc: 'Carrefour Market', category: 'Alimentation', catColor: '#D4A853', amount: -82.45 },
  { date: '14 avr.', desc: 'Salaire Avril', category: 'Revenus', catColor: '#16A34A', amount: 3200.00 },
  { date: '12 avr.', desc: 'Essence Total', category: 'Transport', catColor: '#2563EB', amount: -65.00 },
  { date: '10 avr.', desc: 'Netflix', category: 'Abonnements', catColor: '#9C7A32', amount: -17.99 },
  { date: '08 avr.', desc: 'Virement Marie', category: 'Transferts', catColor: '#7A7A7A', amount: 150.00 },
]

// --- Number formatter ---
function formatEuro(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value)
}

function formatEuroShort(value: number): string {
  if (value >= 1000) {
    return `€${(value / 1000).toFixed(1)}k`
  }
  return `€${value}`
}

// --- Animation variants ---
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const rowVariant = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
}

// --- KPI Card ---
interface KPICardProps {
  index: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
  label: string
  value: number
  valueColor?: string
  trend: string
  trendUp: boolean
  subInfo: string
  subInfoColor?: string
}

function KPICard({
  index,
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  valueColor = '#272727',
  trend,
  trendUp,
  subInfo,
  subInfoColor = '#7A7A7A',
}: KPICardProps) {
  const count = useCountUp(value, 1200)

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)' }}
      className="bg-warm-white rounded-xl p-5 shadow-card border border-[#F0F0ED] transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 500, damping: 30 }}
          className={`inline-flex items-center gap-1 font-caption px-2.5 py-1 rounded-full ${
            trendUp ? 'bg-success-light text-success' : 'bg-danger-light text-danger'
          }`}
        >
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </motion.span>
      </div>
      <p className="font-overline text-neutral-300 mt-3">{label}</p>
      <p className="font-h1 font-serif mt-1" style={{ color: valueColor }}>
        {formatEuro(count)}
      </p>
      <p className="font-body-sm mt-1" style={{ color: subInfoColor }}>
        {subInfo}
      </p>
    </motion.div>
  )
}

// --- Budget Progress Bar ---
function BudgetProgress({ budget, index }: { budget: typeof budgets[0]; index: number }) {
  const pct = Math.min((budget.spent / budget.limit) * 100, 100)
  const barColor = pct < 60 ? '#D4A853' : pct <= 85 ? '#D97706' : '#DC2626'

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="mb-4 last:mb-0"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-body font-medium text-neutral-100">{budget.name}</span>
        <span className="font-body-sm text-neutral-300">
          €{budget.spent} / €{budget.limit}
        </span>
      </div>
      <div className="h-1.5 bg-warm-gray rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
        />
      </div>
    </motion.div>
  )
}

// --- Goal Progress Ring ---
function GoalRing({ goal, index }: { goal: typeof goals[0]; index: number }) {
  const pct = Math.round((goal.current / goal.target) * 100)
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference
  const Icon = goal.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.12, duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="flex items-center gap-4 py-3 border-b border-warm-gray last:border-0"
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${goal.color}20` }}
      >
        <Icon size={18} style={{ color: goal.color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-body font-semibold text-neutral-100 truncate">{goal.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-body-sm text-neutral-300">
            €{goal.current.toLocaleString('fr-FR')} / €{goal.target.toLocaleString('fr-FR')}
          </span>
          <span className="font-caption bg-warning-light text-warning px-2 py-0.5 rounded">
            {goal.deadline}
          </span>
        </div>
      </div>

      {/* Ring */}
      <div className="relative w-12 h-12 shrink-0">
        <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
          <circle cx="24" cy="24" r={radius} fill="none" stroke="#E8E8E4" strokeWidth="3" />
          <motion.circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="#D4A853"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ delay: 0.5 + index * 0.12, duration: 1, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-caption font-semibold text-neutral-200">
          {pct}%
        </span>
      </div>
    </motion.div>
  )
}

// --- Custom Tooltip for Charts ---
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-neutral-100 text-warm-cream rounded-lg px-3 py-2 shadow-lg font-body-sm">
      {label && <span className="font-caption text-neutral-400 block mb-0.5">{label}</span>}
      <span className="font-mono">{formatEuro(payload[0].value)}</span>
    </div>
  )
}

// --- Main Dashboard ---
export default function Dashboard() {
  const [chartPeriod, setChartPeriod] = useState<'6M' | '1A' | 'Tout'>('6M')

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-h2 text-neutral-100">Tableau de bord</h1>
          <p className="font-body-sm text-neutral-300 mt-1">Vue d&apos;ensemble de vos finances</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 h-9 px-3 bg-warm-white border border-warm-gray rounded-lg font-body-sm text-neutral-200 hover:border-accent-gold transition-colors">
            <Calendar size={16} className="text-neutral-300" />
            Avril 2025
            <ChevronDown size={14} className="text-neutral-400" />
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6">
        <KPICard
          index={0}
          icon={Wallet}
          iconBg="rgba(37, 99, 235, 0.1)"
          iconColor="#2563EB"
          label="SOLDE ACTUEL"
          value={12450}
          trend="+12,5%"
          trendUp={true}
          subInfo="vs. mois dernier : € 11 080,00"
        />
        <KPICard
          index={1}
          icon={TrendingUp}
          iconBg="rgba(22, 163, 74, 0.1)"
          iconColor="#16A34A"
          label="REVENUS (AVRIL)"
          value={4200}
          valueColor="#16A34A"
          trend="+8,2%"
          trendUp={true}
          subInfo="vs. budget : € 4 000,00"
        />
        <KPICard
          index={2}
          icon={TrendingDown}
          iconBg="rgba(220, 38, 38, 0.1)"
          iconColor="#DC2626"
          label="DEPENSES (AVRIL)"
          value={2830.5}
          valueColor="#DC2626"
          trend="-5,1%"
          trendUp={false}
          subInfo="vs. budget : € 3 200,00"
          subInfoColor="#16A34A"
        />
      </div>

      {/* Charts Row - Top */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4 lg:gap-6 mb-6">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className="bg-warm-white rounded-xl p-4 sm:p-6 shadow-card"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="font-h4 text-neutral-100">Depenses mensuelles</h3>
              <p className="font-body-sm text-neutral-300 mt-0.5">6 derniers mois</p>
            </div>
            <div className="inline-flex bg-warm-gray rounded-lg p-0.5">
              {(['6M', '1A', 'Tout'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={`px-3 py-1 rounded-md font-caption transition-all ${
                    chartPeriod === p
                      ? 'bg-warm-white text-neutral-100 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[240px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyExpenses} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4A853" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#D4A853" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#E8E8E4" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#7A7A7A' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#7A7A7A' }}
                  tickFormatter={formatEuroShort}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#D4A853"
                  strokeWidth={2.5}
                  fill="url(#goldGradient)"
                  dot={{ fill: '#D4A853', stroke: '#F9F9F9', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#D4A853', stroke: '#F9F9F9', strokeWidth: 2 }}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Budgets Mini */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className="bg-warm-white rounded-xl p-4 sm:p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-h4 text-neutral-100">Budgets du mois</h3>
            <Link
              to="/budgets"
              className="inline-flex items-center gap-1 font-body-sm text-accent-gold hover:underline transition-all"
            >
              Voir tout
              <ChevronRight size={14} />
            </Link>
          </div>
          {budgets.map((b, i) => (
            <BudgetProgress key={b.name} budget={b} index={i} />
          ))}
        </motion.div>
      </div>

      {/* Charts Row - Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-4 lg:gap-6 mb-6">
        {/* Doughnut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className="bg-warm-white rounded-xl p-4 sm:p-6 shadow-card"
        >
          <div className="mb-4">
            <h3 className="font-h4 text-neutral-100">Repartition des depenses</h3>
            <p className="font-body-sm text-neutral-300 mt-0.5">Avril 2025</p>
          </div>
          <div className="h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="90%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-h3 font-serif text-neutral-100">€2 830</span>
              <span className="font-caption text-neutral-300">ce mois</span>
            </div>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
            {categoryData.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}
                className="flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="font-body-sm text-neutral-300">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className="bg-warm-white rounded-xl p-4 sm:p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-h4 text-neutral-100">Objectifs d&apos;epargne</h3>
            <Link
              to="/objectifs"
              className="inline-flex items-center gap-1 font-body-sm text-accent-gold hover:underline transition-all"
            >
              Voir tout
              <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-warm-gray">
            {goals.map((g, i) => (
              <GoalRing key={g.name} goal={g} index={i} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        className="bg-warm-white rounded-xl p-4 sm:p-6 shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-h4 text-neutral-100">Dernieres transactions</h3>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1 font-body-sm text-accent-gold hover:underline transition-all"
          >
            Voir tout
            <ChevronRight size={14} />
          </Link>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Table Header */}
          <div className="hidden sm:grid sm:grid-cols-[100px_1fr_140px_120px] gap-4 px-4 pb-2 border-b border-warm-gray">
            <span className="font-overline text-neutral-300">DATE</span>
            <span className="font-overline text-neutral-300">DESCRIPTION</span>
            <span className="font-overline text-neutral-300">CATEGORIE</span>
            <span className="font-overline text-neutral-300 text-right">MONTANT</span>
          </div>

          {/* Rows */}
          {transactions.map((t, i) => (
            <motion.div
              key={`${t.date}-${t.desc}-${i}`}
              variants={rowVariant}
              whileHover={{ backgroundColor: 'rgba(212,168,83,0.03)' }}
              className="grid grid-cols-[1fr_auto] sm:grid-cols-[100px_1fr_140px_120px] gap-2 sm:gap-4 px-4 py-3 border-b border-[#F0F0ED] last:border-0 cursor-pointer transition-colors"
            >
              <span className="font-body-sm text-neutral-300 self-center">{t.date}</span>
              <span className="font-body font-medium text-neutral-100 self-center truncate">{t.desc}</span>
              <div className="hidden sm:flex items-center gap-2 self-center">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: t.catColor }} />
                <span className="font-body-sm text-neutral-200">{t.category}</span>
              </div>
              <span
                className={`font-body font-mono font-semibold text-right self-center ${
                  t.amount >= 0 ? 'text-success' : 'text-danger'
                }`}
              >
                {t.amount >= 0 ? '+' : ''}
                {formatEuro(t.amount)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
