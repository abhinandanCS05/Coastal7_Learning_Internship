import {useEffect,useState} from 'react';import {Link} from 'react-router-dom';import {Heart,ShoppingCart} from 'lucide-react';import api from '../services/api'
export default function Wishlist(){const [items,setItems]=useState([]);const load=()=>api.get('/wishlist').then(async r=>{const ps=await Promise.all(r.data.product_ids.map(id=>api.get(`/products/${id}`)));setItems(ps.map(x=>x.data))});useEffect(() => {
    load();
  }, []);const remove=async id=>{await api.post(`/wishlist/${id}`);load()};const add=async id=>{await api.post('/cart/items',{product_id:id,quantity:1});alert('Added to cart')};return <main className="py-8"><h1 className="text-3xl font-black">Wishlist</h1>{!items.length?<div className="py-20 text-center text-slate-500">Your wishlist is empty.</div>:<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{items.map(p=><div key={p.id} className="overflow-hidden rounded-2xl border bg-white dark:border-slate-800 dark:bg-slate-900"><img src={mediaUrl(p.image_url)} className="aspect-square w-full object-cover"/><div className="p-4"><Link to={`/app/products/${p.id}`} className="font-bold">{p.name}</Link><p className="mt-2 font-black">₹{p.price.toLocaleString('en-IN')}</p><div className="mt-3 flex gap-2"><button onClick={()=>add(p.id)} className="flex-1 rounded-lg bg-indigo-600 py-2 text-xs font-bold text-white"><ShoppingCart size={14} className="mr-1 inline"/>Cart</button><button onClick={()=>remove(p.id)} className="rounded-lg border px-3"><Heart className="fill-red-500 text-red-500" size={16}/></button></div></div></div>)}</div>}</main>}




