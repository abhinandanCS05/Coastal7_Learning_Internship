import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const { data } = await api.post("/auth/login", { email: email.trim(), password, role });
      login(data); nav(data.role === "admin" ? "/app/admin" : "/app", { replace: true });
    } catch (error) {
      setErr(error.response?.data?.detail || "Unable to sign in. Check your details and try again.");
    } finally { setBusy(false); }
  };

  return <main className="zeta-auth">
    <section className="zeta-auth-brand">
      <Link to="/login" className="zeta-wordmark">zet<span>A</span></Link>
      <div className="zeta-brand-copy">
        <div className="zeta-eyebrow"><Sparkles size={14}/> YOUR NEXT FAVOURITE THING</div>
        <h1>Good finds.<br/><span>Great feeling.</span></h1>
        <p>A thoughtful shopping experience for the things that make everyday better.</p>
        <div className="zeta-brand-perks"><span><ShoppingBag size={17}/> Curated discovery</span><span><ShieldCheck size={17}/> Secure account access</span></div>
      </div>
      <p className="zeta-brand-foot">A smarter way to shop, every day.</p>
      <div className="zeta-glow one"/><div className="zeta-glow two"/>
    </section>
    <section className="zeta-auth-form-wrap"><form onSubmit={submit} className="zeta-auth-form">
      <Link to="/login" className="zeta-wordmark zeta-mobile-logo">zet<span>A</span></Link>
      <div className="zeta-form-kicker">WELCOME BACK</div><h2>Sign in to zetA</h2>
      <p className="zeta-form-subtitle">Your next great find is just around the corner.</p>
      {err && <div role="alert" className="zeta-error">{err}</div>}
      <label className="zeta-field-label" htmlFor="zeta-email">Email address</label>
      <input id="zeta-email" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="zeta-input"/>
      <label className="zeta-field-label" htmlFor="zeta-password">Password</label>
      <div className="zeta-password-wrap"><input id="zeta-password" type={show?"text":"password"} autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" className="zeta-input"/>
        <button type="button" className="zeta-eye" aria-label={show?"Hide password":"Show password"} onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>
      <div className="zeta-role-label">Continue as</div><div className="zeta-role-picker">
        <button type="button" aria-pressed={role==="user"} onClick={()=>setRole("user")} className={role==="user"?"selected":""}><ShoppingBag size={18}/><span><b>Customer</b><small>Shop and track orders</small></span></button>
        <button type="button" aria-pressed={role==="admin"} onClick={()=>setRole("admin")} className={role==="admin"?"selected":""}><ShieldCheck size={18}/><span><b>Admin</b><small>Manage the store</small></span></button>
      </div><p className="zeta-role-note">Your account's assigned role is verified securely when you sign in.</p>
      <button disabled={busy} type="submit" className="zeta-submit">{busy?"Signing you in…":"Sign in securely"} {!busy&&<ArrowRight size={18}/>}</button>
      <p className="zeta-signup">New to zetA? <Link to="/register">Create an account</Link></p>
      <p className="zeta-legal">By continuing, you agree to use your account responsibly.</p>
    </form></section>
  </main>;
}
