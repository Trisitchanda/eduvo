import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function RoleGuard({ allowedRoles, children }) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}
