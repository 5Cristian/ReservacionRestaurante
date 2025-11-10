import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { PageShell, SectionHeader, GlassCard, Input, SoftButton, EmptyState } from '../components/ui'

export default function CustomersPage(){
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])

  const load = async () => {
    const r = await api.get('/customers'); setItems(r.data)
  }
  useEffect(()=>{ load() }, [])

  const openHistory = async (id) => {
    const r = await api.get(`/customers/${id}/history`)
    setSelected(r.data.customer)
    setHistory(r.data.history)
  }

  return (
    <PageShell title="Clientes">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista */}
        <GlassCard className="p-6 lg:col-span-1">
          <div className="mb-4">
            <Input placeholder="Buscar cliente…" />
          </div>
          {items.length===0 ? (
            <EmptyState title="Sin clientes" desc="Agrega tu primer cliente." />
          ) : (
            <div className="space-y-3">
              {items.map(c => (
                <div key={c.id} className="rounded-2xl p-4 bg-white/6 ring-1 ring-white/10 hover:bg-white/10 transition">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-slate-300">{c.email || '—'}{c.phone? ` • ${c.phone}`:''}</p>
                  <div className="mt-2">
                    <SoftButton onClick={()=>openHistory(c.id)}>Historial</SoftButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Panel de historial */}
        <GlassCard className="p-6 lg:col-span-2">
          <SectionHeader title="Historial" />
          {!selected ? (
            <EmptyState title="Selecciona un cliente" />
          ) : (
            <>
              <p className="font-medium mb-3">{selected.name}</p>
              {history.length===0 ? (
                <EmptyState title="Sin historial" />
              ) : (
                <ul className="space-y-3">
                  {history.map(h => (
                    <li key={h.id} className="rounded-2xl p-3 bg-white/6 ring-1 ring-white/10">
                      <div className="text-sm text-slate-300">{new Date(h.date).toLocaleString()} — Mesa #{h.table.number}</div>
                      <div className="text-sm">{h.partySize} personas — {h.status}</div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </GlassCard>
      </div>
    </PageShell>
  )
}

