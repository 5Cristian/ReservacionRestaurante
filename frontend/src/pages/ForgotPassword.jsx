// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function ForgotPassword() {
  const nav = useNavigate();

  const [step, setStep] = useState("request"); // request | verify | reset
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const strong = (p) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]{8,}$/.test(p);

  async function sendCode(e) {
    e.preventDefault();
    setMsg("");
    if (!email.trim()) return setMsg("Ingresa tu correo.");

    try {
      setLoading(true);
      const r = await fetch(`${API_URL}/auth/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "No se pudo enviar el código.");
      setMsg("Si el correo existe, enviamos un código de verificación.");
      setStep("verify");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e) {
    e.preventDefault();
    setMsg("");
    if (!code.trim()) return setMsg("Ingresa el código recibido.");

    try {
      setLoading(true);
      const r = await fetch(`${API_URL}/auth/password/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Código inválido o expirado.");
      setMsg("Código verificado. Ahora cambia tu contraseña.");
      setStep("reset");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e) {
    e.preventDefault();
    setMsg("");
    if (pwd !== pwd2) return setMsg("Las contraseñas no coinciden.");
    if (!strong(pwd)) return setMsg("La contraseña no cumple complejidad.");

    try {
      setLoading(true);
      const r = await fetch(`${API_URL}/auth/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword: pwd }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "No se pudo cambiar la contraseña.");
      setMsg("¡Listo! Contraseña actualizada. Inicia sesión.");
      setTimeout(() => nav("/login"), 1000);
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
          <div className="auth-brand">
            <div className="brand-logo">🔐</div>
            <div>
              <h1 className="brand-title">Recuperar contraseña</h1>
              <p className="brand-subtitle">Sigue los pasos para restablecerla</p>
            </div>
          </div>

          {msg && <div className="auth-alert">{msg}</div>}

          {step === "request" && (
            <form className="auth-form" onSubmit={sendCode}>
              <label className="auth-label">Correo</label>
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
              <button className="auth-btn" disabled={loading}>
                {loading ? "Enviando..." : "Enviar código"}
              </button>
              <button
                type="button"
                className="text-indigo-300 hover:text-white text-sm mt-2"
                onClick={() => nav("/login")}
              >
                Volver a iniciar sesión
              </button>
            </form>
          )}

          {step === "verify" && (
            <form className="auth-form" onSubmit={verifyCode}>
              <p className="text-sm text-gray-300">
                Te enviamos un código a <b>{email}</b>. Revísalo e ingrésalo aquí:
              </p>
              <label className="auth-label">Código</label>
              <div className="auth-input-wrap">
                <span className="input-icon">📮</span>
                <input
                  className="auth-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6 dígitos"
                />
              </div>
              <button className="auth-btn" disabled={loading}>
                {loading ? "Verificando..." : "Verificar código"}
              </button>
              <button
                type="button"
                className="text-indigo-300 hover:text-white text-sm mt-2"
                onClick={sendCode}
              >
                Reenviar código
              </button>
            </form>
          )}

          {step === "reset" && (
            <form className="auth-form" onSubmit={resetPassword}>
              <label className="auth-label">Nueva contraseña</label>
              <div className="auth-input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  className="auth-input"
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="Mín. 8 + Mayúscula + número + símbolo"
                />
              </div>

              <label className="auth-label">Repite la contraseña</label>
              <div className="auth-input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  className="auth-input"
                  type="password"
                  value={pwd2}
                  onChange={(e) => setPwd2(e.target.value)}
                  placeholder="Repite tu contraseña"
                />
              </div>

              <small className={strong(pwd) ? "ok" : "warn"}>
                Usa mayúscula, minúscula, número y símbolo (mín. 8).
              </small>

              <button className="auth-btn" disabled={loading}>
                {loading ? "Actualizando..." : "Cambiar contraseña"}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
