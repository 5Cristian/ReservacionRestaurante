// src/pages/AppLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function AppLayout() {
  const { isAuth, user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const role = user?.role; // 'customer' | 'staff' | 'admin'

  // Enlaces permitidos por rol
  const links = [
    { to: '/',          label: 'Dashboard',  show: true },
    { to: '/reservar',  label: 'Reservar',   show: true },
    { to: '/clientes',  label: 'Clientes',   show: role === 'staff' || role === 'admin' },
    { to: '/mesas',     label: 'Mesas',      show: role === 'admin' },
    { to: '/empleados', label: 'Empleados',  show: role === 'admin' },
  ].filter(l => l.show);

  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

  return (
    <div>
      {/* Header glass */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-3">
          <div className="rounded-3xl bg-[color:var(--aa-panel)] backdrop-blur-xl ring-1 ring-[color:var(--aa-ring)] px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-3">
            {/* Brand */}
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl grid place-items-center text-white
                              bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-900/30">
                🍽️
              </div>
              <div className="text-left">
                <p className="font-semibold leading-tight">Reservaciones Restaurante</p>
                <p className="text-xs text-muted -mt-0.5">
                  {role === 'admin' ? 'Administrador' : role === 'staff' ? 'Staff' : 'Cliente'}
                </p>
              </div>
            </button>

            {/* Nav */}
            <nav className="flex items-center gap-2">
              {isAuth ? (
                <>
                  {links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className={`rounded-2xl px-4 py-2 text-sm ring-1 ring-[color:var(--aa-ring)]
                                  ${isActive(l.to) ? 'bg-white/18' : 'bg-white/12 hover:bg-white/16'}`}
                    >
                      {l.label}
                    </Link>
                  ))}
                  <button
                    onClick={logout}
                    className="rounded-2xl px-4 py-2 text-sm bg-white/12 hover:bg-white/16 ring-1 ring-[color:var(--aa-ring)]"
                  >
                    Salir {user?.name ? `(${user.name})` : ''}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`rounded-2xl px-4 py-2 text-sm ring-1 ring-[color:var(--aa-ring)]
                              ${pathname === '/login' ? 'bg-white/18' : 'bg-white/12 hover:bg-white/16'}`}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}


