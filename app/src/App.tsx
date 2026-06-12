import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import Layout from './components/Layout'
import AuthGuard from './components/AuthGuard'
import PublicOnlyGuard from './components/PublicOnlyGuard'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Pricing from './pages/Pricing'
import Onboarding from './pages/Onboarding'
import Checkout from './pages/Checkout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Dettes from './pages/Dettes'
import Objectifs from './pages/Objectifs'
import Analytics from './pages/Analytics'
import SubscriptionPage from './pages/SubscriptionPage'
import Billing from './pages/Billing'
import Settings from './pages/Settings'

export default function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<PublicOnlyGuard><Auth /></PublicOnlyGuard>} />
        <Route path="/pricing" element={<Pricing />} />

        {/* App routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/transactions" element={<AuthGuard><Transactions /></AuthGuard>} />
          <Route path="/budgets" element={<AuthGuard><Budgets /></AuthGuard>} />
          <Route path="/dettes" element={<AuthGuard><Dettes /></AuthGuard>} />
          <Route path="/objectifs" element={<AuthGuard><Objectifs /></AuthGuard>} />
          <Route path="/analytics" element={<AuthGuard><Analytics /></AuthGuard>} />
          <Route path="/subscription" element={<AuthGuard><SubscriptionPage /></AuthGuard>} />
          <Route path="/billing" element={<AuthGuard><Billing /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
          <Route path="/parametres" element={<AuthGuard><Settings /></AuthGuard>} />
          <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
          <Route path="/checkout/:planId" element={<AuthGuard><Checkout /></AuthGuard>} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  )
}
