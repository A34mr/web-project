import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export default function Login() {
  const [form, setForm] = useState({ identifier: "", password: "", remember: false });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.identifier.trim()) newErrors.identifier = "Email or username is required";
    else if (form.identifier.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.identifier))
      newErrors.identifier = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast("Please fix the errors before continuing.", "error");
      return;
    }
    
    setLoading(true);
    try {
      // Try to login with email
      await login(form.identifier, form.password);
      setErrors({});
      showToast("Login successful! Welcome back 😊", "success");
      
      // Redirect based on role (will be handled by AuthContext)
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed. Please check your credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"'Segoe UI', sans-serif", background:"#f0f6ff" }}>

      {/* Left Panel */}
      <div style={{
        flex:1, background:"linear-gradient(160deg, #1d6fa4 0%, #2196f3 60%, #64b5f6 100%)",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding:"48px 40px", color:"white", position:"relative", overflow:"hidden"
      }}>
        <div style={{ position:"absolute", top:-60, left:-60, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
        <div style={{ position:"absolute", bottom:-80, right:-60, width:300, height:300, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
        <div style={{ zIndex:1, textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🦷</div>
          <div style={{ fontSize:28, fontWeight:800, letterSpacing:1, marginBottom:12 }}>Dent Al</div>
          <div style={{ fontSize:18, fontStyle:"italic", fontWeight:300, opacity:0.92, lineHeight:1.6, marginBottom:36 }}>
            "Your smile, our responsibility."
          </div>
          <img
            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&q=80"
            alt="Dental clinic"
            style={{ width:"100%", height:"350px", objectFit:"cover", borderRadius:20, boxShadow:"0 8px 32px rgba(0,0,0,0.18)", marginTop:24 }}
          />
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 32px" }}>
        <div style={{ width:"100%", maxWidth:420 }}>

          {toast && (
            <div style={{
              padding:"14px 20px", borderRadius:12, marginBottom:20, fontWeight:600, fontSize:14,
              background: toast.type==="success" ? "#e8f5e9" : "#fdecea",
              color: toast.type==="success" ? "#2e7d32" : "#c62828",
              border:`1px solid ${toast.type==="success" ? "#a5d6a7" : "#ef9a9a"}`,
              display:"flex", alignItems:"center", gap:10
            }}>
              {toast.type==="success" ? "✅" : "❌"} {toast.msg}
            </div>
          )}

          <h2 style={{ fontSize:28, fontWeight:800, color:"#1a2a3a", marginBottom:6 }}>Welcome back 👋</h2>
          <p style={{ color:"#7a8fa6", marginBottom:32, fontSize:15 }}>Sign in to your account to continue</p>

          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#3a5068", marginBottom:6 }}>Email Address</label>
            <input type="email" placeholder="Enter your registered email" value={form.identifier}
              onChange={e => setForm({...form, identifier:e.target.value})}
              style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:`1.5px solid ${errors.identifier?"#e53935":"#c9d8e8"}`, fontSize:15, outline:"none", background:"#f7faff", color:"#1a2a3a", boxSizing:"border-box" }}
            />
            {errors.identifier && <p style={{ color:"#e53935", fontSize:12, marginTop:4 }}>{errors.identifier}</p>}
          </div>

          <div style={{ marginBottom:8 }}>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#3a5068", marginBottom:6 }}>Password</label>
            <div style={{ position:"relative" }}>
              <input type={showPass?"text":"password"} placeholder="Enter your password" value={form.password}
                onChange={e => setForm({...form, password:e.target.value})}
                style={{ width:"100%", padding:"12px 44px 12px 16px", borderRadius:10, border:`1.5px solid ${errors.password?"#e53935":"#c9d8e8"}`, fontSize:15, outline:"none", background:"#f7faff", color:"#1a2a3a", boxSizing:"border-box" }}
              />
              <button onClick={() => setShowPass(!showPass)}
                style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#7a8fa6" }}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <p style={{ color:"#e53935", fontSize:12, marginTop:4 }}>{errors.password}</p>}
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28, marginTop:12 }}>
            <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:"#3a5068", cursor:"pointer" }}>
              <input type="checkbox" checked={form.remember} onChange={e => setForm({...form, remember:e.target.checked})} style={{ accentColor:"#1d6fa4", width:16, height:16 }}/>
              Remember me
            </label>
            <a href="#" style={{ fontSize:14, color:"#1d6fa4", fontWeight:600, textDecoration:"none" }}>Forgot Password?</a>
          </div>

          <button onClick={handleSubmit} disabled={loading} style={{
            width:"100%", padding:"14px", borderRadius:12,
            background: loading ? "#999" : "linear-gradient(90deg, #1d6fa4, #2196f3)",
            color:"white", fontWeight:700, fontSize:16, border:"none", cursor: loading ? "not-allowed" : "pointer",
            boxShadow:"0 4px 16px rgba(29,111,164,0.25)"
          }}>
            {loading ? "Logging in..." : "Login →"}
          </button>

          <p style={{ textAlign:"center", marginTop:24, fontSize:14, color:"#7a8fa6" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color:"#1d6fa4", fontWeight:700, textDecoration:"none" }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}