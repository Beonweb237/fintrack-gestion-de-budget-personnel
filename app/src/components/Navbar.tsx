import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  HandCoins,
  Target,
  BarChart3,
  CreditCard,
  FileText,
  Settings2,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: Receipt },
  { path: '/budgets', label: 'Budgets', icon: PieChart },
  { path: '/dettes', label: 'Debts', icon: HandCoins },
  { path: '/objectifs', label: 'Goals', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/subscription', label: 'Subscription', icon: CreditCard },
  { path: '/billing', label: 'Billing', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings2 },
]

export default function Navbar() {
  const location = useLocation()
  const { state, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (path: string) => location.pathname === path || (path === '/settings' && location.pathname === '/parametres')

  const toggleMobile = () => setMobileOpen(!mobileOpen)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-[1100] lg:hidden bg-warm-white p-2 rounded-lg shadow-card border border-warm-gray"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        className={cn(
          'fixed top-0 left-0 h-full z-[999] dark-gradient transition-all duration-300 flex flex-col',
          collapsed ? 'w-[72px]' : 'w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
          <img src="/logo-icon.svg" alt="FinTrack" className="w-9 h-9 shrink-0" />
          {!collapsed && (
            <span className="font-serif text-lg font-semibold text-warm-cream tracking-tight">
              FinTrack<span className="text-accent-gold">.</span>
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path)
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 h-11 px-3 rounded-lg transition-all duration-200 group',
                  active
                    ? 'bg-accent-gold text-neutral-100'
                    : 'text-neutral-400 hover:bg-accent-gold/10 hover:text-warm-cream'
                )}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span className="font-body text-sm font-medium flex-1">{item.label}</span>
                    {active && <ChevronRight size={14} className="shrink-0 opacity-60" />}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full h-9 rounded-lg text-neutral-400 hover:bg-accent-gold/10 hover:text-warm-cream transition-colors mb-3"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} className={cn('transition-transform', collapsed && 'rotate-180')} />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <img src="/avatar-default.svg" alt="User" className="w-8 h-8 rounded-full shrink-0" />
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-warm-cream truncate">{state.user?.name || 'User'}</p>
                  <p className="font-caption text-neutral-400 truncate">{state.user?.email || 'user@email.com'}</p>
                </div>
                <button onClick={logout} className="text-neutral-400 hover:text-warm-cream transition-colors">
                  <LogOut size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
