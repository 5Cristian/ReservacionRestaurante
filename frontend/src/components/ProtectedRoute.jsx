// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function ProtectedRoute({ roles, children }) {
  const { isAuth, loading, user } = useAuth();

  if (loading) return <div style={{ padding: 24 }}>Cargando sesión…</div>;
  if (!isAuth) return <Navigate to="/login" replace />;

  // Si se piden roles y el rol actual no está permitido, redirige al inicio
  if (roles && roles.length && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // Soporta dos usos:
  // - Como layout guard (con <Outlet/>)
  // - Como wrapper de un elemento (children)
  return children ?? <Outlet />;
}

