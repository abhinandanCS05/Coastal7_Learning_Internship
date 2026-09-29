import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_role')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

export const productApi = {
  list: () => api.get('/products'),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
  uploadImage: (id, file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/products/${id}/image`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const cartApi = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/items', data),
  clear: () => api.delete('/cart'),
}

export const orderApi = {
  create: (data) => api.post('/orders', data),
  list: () => api.get('/orders'),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, null, { params: { status } }),
}

export const fileUrl = (filename) => `${API_URL}/files/${encodeURIComponent(filename)}`
export const websocketUrl = () => import.meta.env.VITE_WS_URL || API_URL.replace(/^http/, 'ws')
