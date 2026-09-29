import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { cartApi, fileUrl, productApi } from '../services/api'

export default function ProductDetails() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    productApi.get(productId)
      .then((response) => setProduct(response.data))
      .catch((err) => setError(err.response?.data?.detail || 'Product not found'))
  }, [productId])

  const addToCart = async () => {
    try { await cartApi.add({ product_id: Number(productId), quantity: 1 }); navigate('/app/cart') }
    catch (err) { setError(err.response?.data?.detail || 'Could not add to cart') }
  }

  if (error) return <div className="panel"><p className="error">{error}</p><Link to="/app/products">Back to products</Link></div>
  if (!product) return <div className="panel"><p className="muted">Loading product...</p></div>

  return <div className="panel detail-card">
    <Link to="/app/products">← Back to products</Link>
    {product.image_filename && <img className="detail-image" src={fileUrl(product.image_filename)} alt={product.name} />}
    <p className="eyebrow">PRODUCT #{product.id}</p>
    <h1>{product.name}</h1>
    <p>{product.description || 'No description'}</p>
    <h2>₹{product.price.toFixed(2)}</h2>
    <p className="muted">Stock available: {product.stock}</p>
    <button onClick={addToCart} disabled={product.stock < 1}>Add to cart</button>
  </div>
}
