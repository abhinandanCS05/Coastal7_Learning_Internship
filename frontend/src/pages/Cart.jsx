import { useEffect, useState } from 'react'
import { cartApi, orderApi, productApi } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const [cart, setCart] = useState({ items: [], total_items: 0 })
  const [products, setProducts] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const load = async () => {
    try { const [cartResponse, productResponse] = await Promise.all([cartApi.get(), productApi.list()]); setCart(cartResponse.data); setProducts(productResponse.data) } catch (err) { setError(err.response?.data?.detail || 'Could not load cart') }
  }
  useEffect(() => { load() }, [])

  const placeOrder = async () => {
    try { await orderApi.create({ items: cart.items }); setMessage('Order placed successfully'); await load(); setTimeout(() => navigate('/app/orders'), 500) } catch (err) { setError(err.response?.data?.detail || 'Order failed') }
  }

  const clear = async () => { try { await cartApi.clear(); await load(); setMessage('Cart cleared') } catch (err) { setError('Could not clear cart') } }

  const total = cart.items.reduce((sum, item) => sum + (products.find((p) => p.id === item.product_id)?.price || 0) * item.quantity, 0)

  return (
    <div><div className="section-heading"><div><p className="eyebrow">REDIS CART</p><h1>Shopping cart</h1></div></div>
      {message && <p className="success">{message}</p>}{error && <p className="error">{error}</p>}
      <div className="panel">
        {cart.items.length === 0 ? <p className="muted">Your cart is empty.</p> : <>
          {cart.items.map((item) => { const product = products.find((p) => p.id === item.product_id); return <div className="cart-row" key={item.product_id}><div><strong>{product?.name || `Product #${item.product_id}`}</strong><span>Quantity: {item.quantity}</span></div><strong>₹{((product?.price || 0) * item.quantity).toFixed(2)}</strong></div> })}
          <div className="cart-total"><span>Total</span><strong>₹{total.toFixed(2)}</strong></div>
          <div className="actions"><button onClick={placeOrder}>Place order</button><button className="secondary" onClick={clear}>Clear cart</button></div>
        </>}
      </div>
    </div>
  )
}
