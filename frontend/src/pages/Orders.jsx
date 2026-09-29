import { useEffect, useRef, useState } from 'react'
import { orderApi, websocketUrl } from '../services/api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [events, setEvents] = useState([])
  const [error, setError] = useState('')
  const wsRef = useRef(null)

  const load = async () => { try { setOrders((await orderApi.list()).data) } catch (err) { setError(err.response?.data?.detail || 'Could not load orders') } }

  useEffect(() => {
    load()
    const token = localStorage.getItem('access_token')
    if (!token) return undefined
    const ws = new WebSocket(`${websocketUrl()}/ws/orders?token=${encodeURIComponent(token)}`)
    wsRef.current = ws
    ws.onmessage = (event) => {
      try { const data = JSON.parse(event.data); setEvents((current) => [data, ...current].slice(0, 8)); if (data.event === 'order_status') load() } catch { setEvents((current) => [{ event: 'message', message: event.data }, ...current].slice(0, 8)) }
    }
    ws.onerror = () => setError('WebSocket connection failed. Check that FastAPI is running.')
    return () => { ws.close(); wsRef.current = null }
  }, [])

  const updateStatus = async (id, status) => { try { await orderApi.updateStatus(id, status); await load() } catch (err) { setError(err.response?.data?.detail || 'Status update failed') } }

  return (
    <div><div className="section-heading"><div><p className="eyebrow">ORDERS + WEBSOCKET</p><h1>Order history</h1></div><span className="live-badge">● Live updates</span></div>
      {error && <p className="error">{error}</p>}
      <div className="two-panel"><section className="panel"><h2>Orders</h2>{orders.length === 0 ? <p className="muted">No orders yet.</p> : orders.map((order) => <article className="order-card" key={order.id}><div className="order-header"><strong>Order #{order.id}</strong><span className="status">{order.status}</span></div><p>Total: ₹{order.total_amount.toFixed(2)}</p><p className="muted">{new Date(order.created_at).toLocaleString()}</p><ul>{order.items.map((item) => <li key={`${order.id}-${item.product_id}`}>Product #{item.product_id} × {item.quantity} — ₹{item.unit_price.toFixed(2)}</li>)}</ul><div className="actions">{['PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => <button key={status} className="secondary" onClick={() => updateStatus(order.id, status)}>{status}</button>)}</div></article>)}</section>
        <aside className="panel"><h2>Live events</h2>{events.length === 0 ? <p className="muted">Waiting for WebSocket events...</p> : events.map((event, index) => <pre key={index} className="event">{JSON.stringify(event, null, 2)}</pre>)}</aside></div>
    </div>
  )
}
