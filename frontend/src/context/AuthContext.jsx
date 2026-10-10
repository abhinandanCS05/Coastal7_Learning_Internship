import {createContext,useContext,useEffect,useState} from 'react'
import api from '../services/api'
const C=createContext(null)
export function AuthProvider({children}){
 const [user,setUser]=useState(null)
 const [loading,setLoading]=useState(true)
 useEffect(()=>{if(localStorage.getItem('zetA_token'))api.get('/me').then(r=>setUser(r.data)).catch(()=>localStorage.removeItem('zetA_token')).finally(()=>setLoading(false));else setLoading(false)},[])
 const login=(data)=>{localStorage.setItem('zetA_token',data.access_token);setUser({email:data.email,role:data.role,full_name:data.full_name})}
 const logout=()=>{localStorage.removeItem('zetA_token');setUser(null)}
 return <C.Provider value={{user,loading,login,logout}}>{children}</C.Provider>
}
export const useAuth=()=>useContext(C)
