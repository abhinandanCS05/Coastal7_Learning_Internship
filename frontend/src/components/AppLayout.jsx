import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AppLayout() {
  const { role, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <strong>Day 11 E-Commerce</strong>
          <span className="muted">React + FastAPI</span>
        </div>
        <nav>
          <NavLink to="/app" end>Dashboard</NavLink>
          <NavLink to="/app/products">Products</NavLink>
          <NavLink to="/app/cart">Cart</NavLink>
          <NavLink to="/app/orders">Orders</NavLink>
        </nav>
        <div className="user-actions">
          <span className="role-badge">{role}</span>
          <button className="secondary" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="page-container">
        <Outlet />
      </main>
    </div>
  )
}
