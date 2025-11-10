// src/pages/VerifyEmail.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function VerifyEmail() {
  const nav = useNavigate();
  const { setToken, setUser } = useAuth();
  const { search } = useLocation();

  // 1) Lee y decodifica el email de la URL
  const emailFromQuery = useMemo(() => {
    const p = new URLSearchParams(search);
    const raw = p.get("email") || "";
    try {
      // decodeURIComponent por si viene con %40, etc.
      return decodeURIComponent(raw).trim();
    } catch {
      return raw.trim();
    }
  }, [search]);

  // 2) Mantenlo en estado (no hace falta setter)
  const [email] = useState(emailFromQuery);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!email) setMsg("Falta el correo. Vuelve al registro.");
  }, [email]);

  async function handleVerify(e) {
    e.preventDefault();
    setMsg("");

    const payload = { email, code: (code || "").trim() };
    if (!payload.email) return setMsg("Email requerido");
    if (!payload.code)  return setMsg("Ingresa el código de 6 dígitos.");

    try {
      setLoading(true);

      const r = await fetch(`${API_URL}/auth/register-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "No se pudo confirmar");

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setToken?.(data.access_token);
      setUser?.(data.user);
      nav("/", { replace: true });
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) return;
    setMsg("");
    try {
      setResendLoading(true);
      const r = await fetch(`${API_URL}/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "No se pudo reenviar el código");
      setMsg("Te reenviamos un nuevo código. Revisa tu correo.");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-bg" />
      <div className="auth-overlay" />
      <main className="auth-content">
        <section className="auth-card" style={{ width: 520 }}>
          <div className="auth-brand">
            <div className="brand-logo">RR</div>
            <div>
              <h1 className="brand-title">Restaurant Reservations</h1>
              <p className="brand-subtitle">Verificar correo</p>
            </div>
          </div>

          {msg && <div className="auth-alert">{msg}</div>}

          <p style={{ marginTop: 6, color: "#cbd5e1" }}>
            Hemos enviado un código de 6 dígitos a:<br />
            <strong>{email}</strong>
          </p>

          <form className="auth-form" onSubmit={handleVerify}>
            <label className="auth-label">Código de verificación</label>
            <div className="auth-input-wrap">
              <span className="input-icon">🔢</span>
              <input
                className="auth-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                inputMode="numeric"
                maxLength={6}
              />
            </div>

            <button className="auth-btn" disabled={loading || !email}>
              {loading ? "Confirmando..." : "Confirmar"}
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
                fontSize: 13,
                color: "#cbd5e1",
              }}
            >
              <span>¿No te llegó?</span>
              <button
                type="button"
                onClick={handleResend}
                className="auth-link"
                disabled={resendLoading || !email}
              >
                {resendLoading ? "Reenviando..." : "Reenviar código"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}




