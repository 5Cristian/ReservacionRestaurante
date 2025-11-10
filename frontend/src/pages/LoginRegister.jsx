// src/pages/LoginRegister.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { useAuth } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function LoginRegister() {
  const nav = useNavigate();
  const { setToken, setUser } = useAuth();

  const [tab, setTab] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // login
  const [identifier, setIdentifier] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // register (paso 1)
  const [fullName, setFullName] = useState("");
  const [userSU, setUserSU] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pwdSU, setPwdSU] = useState("");
  const [pwdSU2, setPwdSU2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const strong = (p) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]{8,}$/.test(p);

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    if (!identifier.trim() || !pwd.trim()) {
      setMsg("Por favor ingresa usuario/email y contraseña.");
      return;
    }
    try {
      setLoading(true);
      const r = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: identifier, password: pwd }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "No se pudo iniciar sesión");

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken?.(data.access_token);
      setUser?.(data.user);
      nav("/");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Paso 1: guarda temporal + manda código y navega a /verify-email
  async function handleRegisterStart(e) {
    e.preventDefault();
    setMsg("");

    if (!fullName.trim() || !userSU.trim() || !email.trim() || !pwdSU.trim()) {
      setMsg("Completa todos los campos obligatorios.");
      return;
    }
    if (pwdSU !== pwdSU2) {
      setMsg("Las contraseñas no coinciden.");
      return;
    }
    if (!strong(pwdSU)) {
      setMsg("La contraseña no cumple complejidad.");
      return;
    }
    try {
      setLoading(true);
      const r = await fetch(`${API_URL}/auth/register-start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          username: userSU,
          email,
          phone: phone || null,
          password: pwdSU,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "No se pudo iniciar el registro");

      // ✅ Ir a la pantalla de verificación
      nav(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-bg" />
      <div className="auth-overlay" />
      <main className="auth-content">
        <section className="auth-card" style={{ width: 520 }}>
          {/* Branding */}
          <div className="auth-brand">
            <div className="brand-logo">🍽️</div>
            <div>
              <h1 className="brand-title">Restaurant Reservations</h1>
              <p className="brand-subtitle">Panel de administración</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <button
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
              type="button"
            >
              Iniciar sesión
            </button>
            <button
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => setTab("register")}
              type="button"
            >
              Crear cuenta
            </button>
          </div>

          {msg && <div className="auth-alert">{msg}</div>}

          {tab === "login" ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <label className="auth-label">Usuario o email</label>
              <div className="auth-input-wrap">
                <span className="input-icon">👤</span>
                <input
                  className="auth-input"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="usuario o correo"
                />
              </div>

              <label className="auth-label">Contraseña</label>
              <div className="auth-input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  className="auth-input"
                  type={showPwd ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="Contraseña"
                />
                <button type="button" className="input-action" onClick={() => setShowPwd((s) => !s)}>
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button className="auth-btn" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>

            
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegisterStart}>
              <label className="auth-label">Nombre completo</label>
              <div className="auth-input-wrap">
                <span className="input-icon">🧑</span>
                <input
                  className="auth-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nombre completo"
                />
              </div>

              <label className="auth-label">Usuario</label>
              <div className="auth-input-wrap">
                <span className="input-icon">👤</span>
                <input
                  className="auth-input"
                  value={userSU}
                  onChange={(e) => setUserSU(e.target.value)}
                  placeholder="Usuario"
                />
              </div>

              <label className="auth-label">Email</label>
              <div className="auth-input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <label className="auth-label">Teléfono (opcional)</label>
              <div className="auth-input-wrap">
                <span className="input-icon">📞</span>
                <input
                  className="auth-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Teléfono"
                />
              </div>

              <label className="auth-label">Contraseña</label>
              <div className="auth-input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  className="auth-input"
                  type={show1 ? "text" : "password"}
                  value={pwdSU}
                  onChange={(e) => setPwdSU(e.target.value)}
                  placeholder="Mín. 8 + Mayúscula + número + símbolo"
                />
                <button type="button" className="input-action" onClick={() => setShow1((s) => !s)}>
                  {show1 ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <label className="auth-label">Repite contraseña</label>
              <div className="auth-input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  className="auth-input"
                  type={show2 ? "text" : "password"}
                  value={pwdSU2}
                  onChange={(e) => setPwdSU2(e.target.value)}
                  placeholder="Repite tu contraseña"
                />
                <button type="button" className="input-action" onClick={() => setShow2((s) => !s)}>
                  {show2 ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <small className={strong(pwdSU) ? "ok" : "warn"}>
                Usa mayúscula, minúscula, número y símbolo (mín. 8).
              </small>

              <button className="auth-btn" disabled={loading}>
                {loading ? "Enviando código..." : "Registrarme"}
              </button>

            </form>
          )}
        </section>
      </main>
    </div>
  );
}
