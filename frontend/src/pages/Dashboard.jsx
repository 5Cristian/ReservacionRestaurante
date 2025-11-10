import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { PageShell, SectionHeader, StatCard, EmptyState, Input, SoftButton, GlassCard } from '../components/ui'

export default function Dashboard(){
  const [date, setDate] = useState(()=> new Date().toISOString().slice(0,10))
  const [today, setToday] = useState([])
  const [time, setTime] = useState('13:00')
  const [availability, setAvailability] = useState({available:[],occupied:[]})

  const load = async () => {
    const a = await api.get('/reports/reservations/today', { params:{ date } })
    setToday(a.data)
    const b = await api.get('/availability', { params:{ date, time } })
    setAvailability(b.data)
  }
  useEffect(()=>{ load(); const id = setInterval(load, 10000); return ()=>clearInterval(id) },[date, time])

  return (
    <PageShell title="Dashboard" actions={<SoftButton onClick={load}>Actualizar</SoftButton>}>
      {/* Filtros */}
      <GlassCard className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-300">Fecha</label>
            <Input type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-slate-300">Hora</label>
            <Input type="time" value={time} onChange={e=>setTime(e.target.value)} />
          </div>
          <div className="flex items-end">
            <SoftButton onClick={load} className="w-full">Refrescar</SoftButton>
          </div>
        </div>
      </GlassCard>

      {/* Métricas */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Reservas del día" value={String(today.length)} hint="Se actualiza cada 10s" />
        <StatCard label="Mesas disponibles" value={String(availability.available.length || 0)} />
        <StatCard label="Mesas ocupadas" value={String(availability.occupied.length || 0)} />
      </div>

      {/* Listas */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <GlassCard className="p-5 md:col-span-1">
          <SectionHeader title="Reservas del día" />
          {today.length===0 ? (
            <EmptyState title="Sin reservas" />
          ) : (
            <ul className="space-y-3">
              {today.map(r=> (
                <li key={r.id} className="rounded-2xl p-3 bg-white/6 ring-1 ring-white/10">
                  <div className="text-sm text-slate-300">{new Date(r.date).toLocaleString()}</div>
                  <div className="font-medium mt-1">Mesa #{r.table.number} — {r.partySize} personas</div>
                  <div className="text-sm">{r.customer?.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{r.status}</div>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <SectionHeader title="Mesas disponibles" />
          {availability.available.length===0 ? (
            <EmptyState title="Ninguna disponible" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {availability.available.map(t=> (
                <span key={t.id} className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-sm ring-1 ring-emerald-400/20">
                  #{t.number} ({t.capacity})
                </span>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <SectionHeader title="Mesas ocupadas" />
          {availability.occupied.length===0 ? (
            <EmptyState title="Ninguna ocupada" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {availability.occupied.map(t=> (
                <span key={t.id} className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-sm ring-1 ring-rose-400/20">
                  #{t.number}
                </span>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </PageShell>
  )
}
