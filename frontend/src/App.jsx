import { useEffect, useState } from 'react'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ReservationsPage from './pages/ReservationsPage.jsx'
import TablesPage from './pages/TablesPage.jsx'
import CustomersPage from './pages/CustomersPage.jsx'


function App(){
  const [page, setPage] = useState('dashboard')
  const [user, setUser] = useState(null)
  const isLogged = !!localStorage.getItem('token')
  const role = user?.role

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])

  const NavButton = ({id,label}) => (
    <button
      onClick={()=>setPage(id)}
      className={`px-4 py-2 rounded-xl ${page===id?'bg-blue-600 text-white':'bg-gray-200'}`}
    >
      {label}
    </button>
  )

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setPage('login')
  }

  return (
    <div>
      <header className="bg-white shadow">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-xl font-bold">🍽️ Reservaciones Restaurante</h1>
          <nav className="space-x-2">
            <NavButton id="dashboard" label="Dashboard" />
            <NavButton id="reservations" label="Reservar" />
            <NavButton id="tables" label="Mesas" />
            <NavButton id="customers" label="Clientes" />

            {!isLogged ? (
              <button
                onClick={()=>setPage('login')}
                className={`px-4 py-2 rounded-xl ${page==='login'?'bg-blue-600 text-white':'bg-gray-200'}`}
              >
                Login
              </button>
            ) : (
              <button onClick={logout} className="px-4 py-2 rounded-xl bg-gray-200">
                Salir {role ? `(${role})` : ''}
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="container py-6">
        {page==='dashboard' && <Dashboard />}
        {page==='reservations' && <ReservationsPage />}
        {page==='tables' && <TablesPage />}
        {page==='customers' && <CustomersPage />}
        {page==='login' && (
          <Login onLogged={(u)=>{
            setUser(u)
            setPage('dashboard')
          }} />
        )}
      </main>
    </div>
  )
}

export default App
