import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function PublicOnlyGuard({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();
  if (state.isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
