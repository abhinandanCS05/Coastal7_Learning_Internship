import{Navigate}from"react-router-dom";import{useAuth}from"../context/AuthContext";
export default function ProtectedRoute({children,admin=false}){const{token,role}=useAuth();if(!token)return <Navigate to="/login" replace/>;if(admin&&role!=="admin")return <Navigate to="/app" replace/>;return children}
