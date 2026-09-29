import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cartApi, orderApi, productApi } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, cart: 0, orders: 0 })

  useEffect(() => {
    let active = true
    Promise.all([productApi.list(), cartApi.get(), orderApi.list()]).then(([products, cart, orders]) => {
      if (active) setStats({ products: products.data.length, cart: cart.data.total_items, orders: orders.data.length })
    }).catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <div>
      <div className="hero">
        <div><p className="eyebrow">PROTECTED DASHBOARD</p><h1>Welcome to the React e-commerce client</h1><p className="muted">Router, hooks, Axios interceptors and JWT auth are working together.</p></div>
        <Link className="button-link" to="/app/products">Browse products</Link>
      </div>
      <div className="stats">
        <article><span>Products</span><strong>{stats.products}</strong></article>
        <article><span>Cart items</span><strong>{stats.cart}</strong></article>
        <article><span>Orders</span><strong>{stats.orders}</strong></article>
      </div>
    </div>
  )
}
