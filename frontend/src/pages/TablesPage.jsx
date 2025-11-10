import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { PageShell, SectionHeader, GlassCard, Input, PrimaryButton, SoftButton, EmptyState } from '../components/ui'

export default function TablesPage(){
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const isAdmin = user?.role === 'admin'

  const [items, setItems] = useState([])
  const [form, setForm] = useState({ number:'', capacity:2, location:'' })

  const load = async () => {
    const r = await api.get('/tables')
    setItems(r.data)
  }
  useEffect(()=>{ load() }, [])

  const create = async (e)=>{
    e.preventDefault()
    await api.post('/tables', { ...form, number:Number(form.number), capacity:Number(form.capacity) })
    setForm({ number:'', capacity:2, location:'' })
    await load()
  }

  const remove = async (id)=>{
    await api.delete(`/tables/${id}`)
    await load()
  }

  return (
    <PageShell title="Mesas" actions={isAdmin ? <SoftButton onClick={()=>{}}>Acciones</SoftButton> : null}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <SectionHeader title="Listado" />
          {items.length===0 ? (
            <EmptyState title="Sin mesas registradas" desc="Agrega una mesa para comenzar." />
          ) : (
            <ul className="space-y-3">
              {items.map(t => (
                <li key={t.id} className="flex items-center justify-between rounded-2xl p-4 bg-white/6 ring-1 ring-white/10">
                  <div>
                    <div className="font-medium">#{t.number} — {t.capacity} personas</div>
                    <div className="text-xs text-slate-400">{t.location || '—'}</div>
                  </div>
                  {isAdmin && (
                    <SoftButton onClick={()=>remove(t.id)} className="bg-rose-500/20 hover:bg-rose-500/30 ring-rose-400/20 text-rose-100">
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
                <Input value={form.number} onChange={e=>setForm({...form, number:e.target.value})} required/>
              </div>
              <div>
                <label className="text-sm text-slate-300">Capacidad</label>
                <Input type="number" min="1" value={form.capacity} onChange={e=>setForm({...form, capacity:e.target.value})}/>
              </div>
              <div>
                <label className="text-sm text-slate-300">Ubicación</label>
                <Input value={form.location} onChange={e=>setForm({...form, location:e.target.value})}/>
              </div>
              <PrimaryButton>Guardar</PrimaryButton>
            </form>
          </GlassCard>
        )}
      </div>
    </PageShell>
  )
}

