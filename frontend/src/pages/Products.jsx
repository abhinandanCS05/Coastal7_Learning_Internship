import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { cartApi, fileUrl, productApi } from '../services/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const fileRefs = useRef({})

  const loadProducts = async () => {
    try { setProducts((await productApi.list()).data) } catch (err) { setError(err.response?.data?.detail || 'Could not load products') }
  }

  useEffect(() => { loadProducts() }, [])

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault(); setError(''); setMessage('')
    const payload = { name: form.name, description: form.description, price: Number(form.price), stock: Number(form.stock) }
    try {
      if (editingId) await productApi.update(editingId, payload)
      else await productApi.create(payload)
      setForm({ name: '', description: '', price: '', stock: '' }); setEditingId(null); setMessage('Product saved'); await loadProducts()
    } catch (err) { setError(err.response?.data?.detail || 'Product save failed') }
  }

  const edit = (product) => setForm({ name: product.name, description: product.description, price: product.price, stock: product.stock }) || setEditingId(product.id)

  const remove = async (id) => {
    try { await productApi.remove(id); setMessage('Product deleted'); await loadProducts() } catch (err) { setError(err.response?.data?.detail || 'Delete failed') }
  }

  const upload = async (id) => {
    const file = fileRefs.current[id]?.files?.[0]
    if (!file) return
    try { await productApi.uploadImage(id, file); setMessage('Image uploaded'); await loadProducts() } catch (err) { setError(err.response?.data?.detail || 'Image upload failed') }
  }

  const addToCart = async (id) => {
    try { await cartApi.add({ product_id: id, quantity: 1 }); setMessage('Added to cart') } catch (err) { setError(err.response?.data?.detail || 'Could not add to cart') }
  }

  return (
    <div>
      <div className="section-heading"><div><p className="eyebrow">PRODUCTS</p><h1>Catalog</h1></div><Link className="button-link secondary-link" to="/app/cart">Open cart</Link></div>
      <form className="panel form-grid" onSubmit={submit}>
        <h2>{editingId ? `Edit product #${editingId}` : 'Create product'}</h2>
        <div className="two-col"><label>Name<input name="name" required value={form.name} onChange={change} /></label><label>Description<input name="description" value={form.description} onChange={change} /></label></div>
        <div className="two-col"><label>Price<input name="price" type="number" step="0.01" min="0.01" required value={form.price} onChange={change} /></label><label>Stock<input name="stock" type="number" min="0" required value={form.stock} onChange={change} /></label></div>
        <div className="actions"><button>{editingId ? 'Update product' : 'Create product'}</button>{editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', stock: '' }) }}>Cancel</button>}</div>
      </form>
      {message && <p className="success">{message}</p>}{error && <p className="error">{error}</p>}
      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            {product.image_filename ? <img src={fileUrl(product.image_filename)} alt={product.name} /> : <div className="image-placeholder">No image</div>}
            <div className="product-body"><p className="muted">Product #{product.id}</p><h2><Link to={`/app/products/${product.id}`}>{product.name}</Link></h2><p>{product.description || 'No description'}</p><strong>₹{product.price.toFixed(2)}</strong><p className="muted">Stock: {product.stock}</p>
              <div className="actions"><button onClick={() => addToCart(product.id)} disabled={product.stock < 1}>Add to cart</button><button className="secondary" onClick={() => { setEditingId(product.id); setForm({ name: product.name, description: product.description, price: product.price, stock: product.stock }) }}>Edit</button><button className="danger" onClick={() => remove(product.id)}>Delete</button></div>
              <div className="upload-row"><input ref={(el) => { fileRefs.current[product.id] = el }} type="file" accept="image/*" /><button className="secondary" onClick={() => upload(product.id)}>Upload image</button></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
