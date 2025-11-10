import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { PageShell, SectionHeader, GlassCard, Input, Select, Textarea, PrimaryButton, EmptyState } from '../components/ui'

export default function ReservationsPage(){
  const [tables, setTables] = useState([])
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ customerId:'', tableId:'', date:'', time:'13:00', partySize:2, notes:'' })
  const [message, setMessage] = useState('')

  const load = async () => {
    const t = await api.get('/tables'); setTables(t.data)
    const c = await api.get('/customers'); setCustomers(c.data)
  }
  useEffect(()=>{ load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    try{
      const iso = `${form.date}T${form.time}:00`
      await api.post('/reservations', { ...form, partySize:Number(form.partySize), date: iso })
      setMessage('Reserva creada ✔')
      setForm({ customerId:'', tableId:'', date:'', time:'13:00', partySize:2, notes:'' })
    }catch(err){
      setMessage(err.response?.data?.error || 'Error')
    }
  }

  return (
    <PageShell title="Crear reserva">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <GlassCard className="p-6">
          <SectionHeader title="Nueva reserva" />
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm text-slate-300">Cliente</label>
              <Select value={form.customerId} onChange={e=>setForm({...form, customerId:e.target.value})}>
                <option value="">Seleccione…</option>
                {customers.map(c=> <option key={c.id} value={c.id}>{c.name} {c.email?`(${c.email})`:''}</option>)}
              </Select>
            </div>

            <div>
              <label className="text-sm text-slate-300">Mesa</label>
              <Select value={form.tableId} onChange={e=>setForm({...form, tableId:e.target.value})}>
                <option value="">Seleccione…</option>
                {tables.map(t=> <option key={t.id} value={t.id}>#{t.number} — {t.capacity} personas</option>)}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-300">Fecha</label>
                <Input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required/>
              </div>
              <div>
                <label className="text-sm text-slate-300">Hora</label>
                <Input type="time" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} required/>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-slate-300">Número de personas</label>
              <Input type="number" min="1" value={form.partySize} onChange={e=>setForm({...form, partySize:e.target.value})}/>
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-slate-300">Notas</label>
              <Textarea rows={3} value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>
            </div>

            <div className="sm:col-span-2">
              <PrimaryButton>Crear reserva</PrimaryButton>
            </div>

            {message && <p className="sm:col-span-2 text-sm text-slate-200">{message}</p>}
          </form>
        </GlassCard>

        {/* Alta rápida de cliente */}
        <GlassCard className="p-6">
          <SectionHeader title="Cliente rápido" />
          <QuickCustomer onCreate={load} />
        </GlassCard>
      </div>
    </PageShell>
  )
}

function QuickCustomer({ onCreate }){
  const [form, setForm] = useState({ name:'', email:'', phone:'' })
  const [msg, setMsg] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    try{
      await api.post('/customers', form)
      setMsg('Cliente creado ✔')
      setForm({ name:'', email:'', phone:'' })
      onCreate?.()
    }catch(e){ setMsg('Error') }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm text-slate-300">Nombre</label>
        <Input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
      </div>
      <div>
        <label className="text-sm text-slate-300">Email</label>
        <Input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
      </div>
      <div>
        <label className="text-sm text-slate-300">Teléfono</label>
        <Input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
      </div>
      <PrimaryButton>Guardar cliente</PrimaryButton>
      {msg ? <p className="text-sm">{msg}</p> : null}
    </form>
  )
}

