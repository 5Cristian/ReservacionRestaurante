import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import {
  PageShell,
  SectionHeader,
  GlassCard,
  Input,
  PrimaryButton,
  SoftButton,
  EmptyState,
} from '../components/ui';

export default function TablesPage() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ number: '', capacity: 2, location: '' });
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  // helper: soporta Input que envía evento o valor directo
  const getVal = (eOrVal) => (eOrVal?.target ? eOrVal.target.value : eOrVal);

  const load = async () => {
    const r = await api.get('/tables');
    setItems(r.data);
  };
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    try {
      const payload = {
        number: Number(form.number),
        capacity: Number(form.capacity),
        location: form.location?.trim() || null,
      };
      await api.post('/tables', payload);
      setForm({ number: '', capacity: 2, location: '' });
      await load();
      setMsg({ type: 'ok', text: 'Mesa guardada correctamente.' });
    } catch (err) {
      const res = err?.response;
      let text = res?.data?.message || res?.data?.error || err.message || 'Error al guardar';
      if (Array.isArray(text)) text = text.join(', ');
      if (res?.status === 409 || /duplicate|unique/i.test(text)) text = 'El número de mesa ya existe.';
      if (res?.status === 401 || res?.status === 403) text = 'No autorizado. Inicia sesión como administrador.';
      setMsg({ type: 'error', text });
      console.error('POST /tables failed:', res || err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/tables/${id}`);
      await load();
    } catch (err) {
      const res = err?.response;
      let text = res?.data?.message || res?.data?.error || err.message || 'Error al eliminar';
      setMsg({ type: 'error', text });
      console.error('DELETE /tables failed:', res || err);
    }
  };

  return (
    <PageShell
      title="Mesas"
      actions={isAdmin ? <SoftButton onClick={() => {}}>Acciones</SoftButton> : null}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <SectionHeader title="Listado" />
          {items.length === 0 ? (
            <EmptyState title="Sin mesas registradas" desc="Agrega una mesa para comenzar." />
          ) : (
            <ul className="space-y-3">
              {items.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-2xl p-4 bg-white/6 ring-1 ring-white/10"
                >
                  <div>
                    <div className="font-medium">
                      #{t.number} — {t.capacity} personas
                    </div>
                    <div className="text-xs text-slate-400">{t.location || '—'}</div>
                  </div>
                  {isAdmin && (
                    <SoftButton
                      onClick={() => remove(t.id)}
                      className="bg-rose-500/20 hover:bg-rose-500/30 ring-rose-400/20 text-rose-100"
                    >
                      Eliminar
                    </SoftButton>
                  )}
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        {isAdmin && (
          <GlassCard className="p-6">
            <SectionHeader title="Agregar mesa" />
            <form onSubmit={create} className="space-y-4">
              <div>
                <label className="text-sm text-slate-300">Número</label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={form.number}
                  onChange={(v) =>
                    setForm((s) => ({ ...s, number: String(getVal(v)).replace(/\D+/g, '') }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Capacidad</label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={form.capacity}
                  onChange={(v) =>
                    setForm((s) => ({ ...s, capacity: String(getVal(v)).replace(/\D+/g, '') }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm text-slate-300">Ubicación</label>
                <Input
                  value={form.location}
                  onChange={(v) => setForm((s) => ({ ...s, location: getVal(v) }))}
                />
              </div>

              {msg && (
                <div className={`text-sm ${msg.type === 'error' ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {msg.text}
                </div>
              )}
              <PrimaryButton disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </PrimaryButton>
            </form>
          </GlassCard>
        )}
      </div>
    </PageShell>
  );
}


