import { useState } from "react";
import { api } from "../lib/api";
import { PageShell, GlassCard, SectionHeader, Input, Select, PrimaryButton } from "../components/ui";

export default function EmployeesPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    role: "staff",   // 'admin' | 'staff'
    password: "",
    confirm: "",
  });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    // Validaciones rápidas en UI
    if (!form.name || !form.username || !form.password) {
      return setMsg({ type: "error", text: "Nombre, usuario y contraseña son obligatorios." });
    }
    if (form.password.length < 6) {
      return setMsg({ type: "error", text: "La contraseña debe tener al menos 6 caracteres." });
    }
    if (form.password !== form.confirm) {
      return setMsg({ type: "error", text: "Las contraseñas no coinciden." });
    }

    setLoading(true);
    try {
      await api.post("/users", {
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim() || null,
        role: form.role,
        password: form.password,
      });
      setMsg({ type: "ok", text: "Empleado creado correctamente." });
      setForm({ name: "", username: "", email: "", role: "staff", password: "", confirm: "" });
    } catch (err) {
      const error = err?.response?.data?.message || err?.response?.data?.error || "Error al crear empleado.";
      setMsg({ type: "error", text: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell title="Empleados">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <SectionHeader title="Nuevo empleado" subtitle="Crea una cuenta para tu personal." />
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm text-muted">Nombre completo</label>
              <Input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Ej. Cristian Claudio" />
            </div>

            <div>
              <label className="text-sm text-muted">Usuario</label>
              <Input value={form.username} onChange={(e) => onChange("username", e.target.value)} placeholder="Ej. cclaudio" />
            </div>

            <div>
              <label className="text-sm text-muted">Email (opcional)</label>
              <Input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="correo@empresa.com" />
            </div>

            <div>
              <label className="text-sm text-muted">Rol</label>
              <Select value={form.role} onChange={(e) => onChange("role", e.target.value)}>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </Select>
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted">Contraseña</label>
                <Input type="password" value={form.password} onChange={(e) => onChange("password", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-muted">Confirmar contraseña</label>
                <Input type="password" value={form.confirm} onChange={(e) => onChange("confirm", e.target.value)} />
              </div>
            </div>

            <div className="sm:col-span-2">
              <PrimaryButton loading={loading}>Guardar empleado</PrimaryButton>
            </div>

            {msg.text && (
              <p className={`sm:col-span-2 text-sm ${msg.type === "ok" ? "text-emerald-300" : "text-rose-300"}`}>
                {msg.text}
              </p>
            )}
          </form>
        </GlassCard>

        <GlassCard className="p-6">
          <SectionHeader title="Campos guardados" />
          <ul className="text-sm text-muted leading-7">
            <li><strong>name</strong> (text, requerido)</li>
            <li><strong>username</strong> (text, requerido, único)</li>
            <li><strong>email</strong> (text, opcional, único si lo usas)</li>
            <li><strong>role</strong> (text: <code>admin</code> | <code>staff</code>, por defecto <code>staff</code>)</li>
            <li><strong>password</strong> (UI) → se envía y guarda como <strong>passwordHash</strong></li>
          </ul>
        </GlassCard>
      </div>
    </PageShell>
  );
}
