import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import {
  PageShell,
  SectionHeader,
  GlassCard,
  Input,
  Select,
  Textarea,
  PrimaryButton,
} from '../components/ui'

export default function ReservationsPage() {
  const [tables, setTables] = useState([])
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({
    customerId: '',
    tableId: '',
    date: '',
    time: '13:00',
    partySize: 2,
    notes: '',
  })
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  // 🔄 Cargar clientes y mesas
  const load = async () => {
    try {
      const [t, c] = await Promise.all([api.get('/tables'), api.get('/customers')])
      setTables(t.data)
      setCustomers(c.data)
    } catch (err) {
      console.error('Error al cargar datos:', err)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // 💾 Crear reserva
  const submit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)
    try {
      const iso = `${form.date}T${form.time}:00`
      await api.post('/reservations', {
        ...form,
        partySize: Number(form.partySize),
        date: iso,
      })
      setForm({
        customerId: '',
        tableId: '',
        date: '',
        time: '13:00',
        partySize: 2,
        notes: '',
      })
      setMessage({ type: 'ok', text: '✅ Reserva creada correctamente.' })
      load()
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Error al crear la reserva'
      setMessage({ type: 'error', text: msg })
      console.error('POST /reservations error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell title="Crear reserva">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 🧾 Formulario principal */}
        <GlassCard className="p-8">
          <SectionHeader title="Nueva reserva" subtitle="Complete los datos requeridos" />

          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Cliente */}
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-300 mb-1 block">Cliente</label>
              <Select
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                required
              >
                <option value="">Seleccione un cliente…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.email ? `(${c.email})` : ''}
                  </option>
                ))}
              </Select>
            </div>

            {/* Mesa */}
            <div>
              <label className="text-sm text-slate-300 mb-1 block">Mesa</label>
              <Select
                value={form.tableId}
                onChange={(e) => setForm({ ...form, tableId: e.target.value })}
                required
              >
                <option value="">Seleccione una mesa…</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    #{t.number} — {t.capacity} personas
                  </option>
                ))}
              </Select>
            </div>

            {/* Fecha y hora */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Fecha</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-1 block">Hora</label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Número de personas */}
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-300 mb-1 block">
                Número de personas
              </label>
              <Input
                type="number"
                min="1"
                value={form.partySize}
                onChange={(e) => setForm({ ...form, partySize: e.target.value })}
              />
            </div>

            {/* Notas */}
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-300 mb-1 block">Notas</label>
              <Textarea
                rows={3}
                placeholder="Opcional..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            {/* Botón + mensaje */}
            <div className="sm:col-span-2 flex flex-col items-center">
              <PrimaryButton disabled={loading}>
                {loading ? 'Guardando...' : 'Crear reserva'}
              </PrimaryButton>
              {message && (
                <p
                  className={`mt-3 text-sm ${
                    message.type === 'error' ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {message.text}
                </p>
              )}
            </div>
          </form>
        </GlassCard>

        {/* ⚡ Alta rápida de cliente */}
        <GlassCard className="p-8">
          <SectionHeader title="Cliente rápido" subtitle="Agregue un cliente al instante" />
          <QuickCustomer onCreate={load} />
        </GlassCard>
      </div>
    </PageShell>
  )
}

// ✅ Subcomponente: Alta rápida de cliente
function QuickCustomer({ onCreate }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [msg, setMsg] = useState(null)
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null)
    setSaving(true)
    try {
      await api.post('/customers', form)
      setMsg({ type: 'ok', text: 'Cliente creado correctamente ✅' })
      setForm({ name: '', email: '', phone: '' })
      onCreate?.()
    } catch (e) {
      setMsg({ type: 'error', text: 'Error al crear cliente' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 mt-4">
      <div>
        <label className="text-sm text-slate-300 mb-1 block">Nombre</label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm text-slate-300 mb-1 block">Email</label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm text-slate-300 mb-1 block">Teléfono</label>
        <Input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <div className="flex flex-col items-center">
        <PrimaryButton disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar cliente'}
        </PrimaryButton>
        {msg && (
          <p
            className={`mt-3 text-sm ${
              msg.type === 'error' ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {msg.text}
          </p>
        )}
      </div>
    </form>
  )
}


