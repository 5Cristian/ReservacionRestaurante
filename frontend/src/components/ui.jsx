// src/components/ui.jsx
import React from "react";

/* ---------- Tarjeta glass reutilizable ---------- */
export function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl bg-[color:var(--aa-panel)] backdrop-blur-xl shadow-2xl ring-1 ring-[color:var(--aa-ring)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Título de sección ---------- */
export function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-muted">{subtitle}</p>}
      <div className="mt-3 h-px w-full bg-gradient-to-r from-[color:var(--aa-ring)] to-transparent" />
    </div>
  );
}

/* ---------- Layout de página ---------- */
export function PageShell({ title, actions, children }) {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-10">
      <GlassCard className="p-5 md:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">{title}</h1>
            <p className="text-sm text-muted">Panel de administración</p>
          </div>
          {actions}
        </div>
        <div className="mt-6">{children}</div>
      </GlassCard>
    </div>
  );
}

/* ---------- Controles de formulario ---------- */
export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl bg-[color:var(--aa-input)] ring-1 ring-[color:var(--aa-ring)]
                  focus:ring-2 focus:ring-[color:var(--aa-input-ring)]
                  px-4 py-3 outline-none placeholder:text-[color:var(--aa-subtle)]
                  text-[color:var(--aa-text)] ${props.className || ""}`}
    />
  );
}

export function Select({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={`w-full rounded-2xl bg-[color:var(--aa-input)] ring-1 ring-[color:var(--aa-ring)]
                  focus:ring-2 focus:ring-[color:var(--aa-input-ring)]
                  px-4 py-3 outline-none text-[color:var(--aa-text)] ${className}`}
    >
      {children}
    </select>
  );
}

export function Textarea({ className = "", ...rest }) {
  return (
    <textarea
      {...rest}
      className={`w-full min-h-[120px] rounded-2xl bg-[color:var(--aa-input)] ring-1 ring-[color:var(--aa-ring)]
                  focus:ring-2 focus:ring-[color:var(--aa-input-ring)]
                  px-4 py-3 outline-none placeholder:text-[color:var(--aa-subtle)]
                  text-[color:var(--aa-text)] ${className}`}
    />
  );
}

/* ---------- Botones ---------- */
export function PrimaryButton({ loading, className = "", children, ...rest }) {
  return (
    <button
      {...rest}
      className={`rounded-2xl px-4 py-3 text-sm font-medium w-full md:w-auto
                  bg-gradient-to-r from-indigo-500 to-cyan-500
                  hover:opacity-95 active:opacity-90 shadow-lg shadow-indigo-900/30
                  disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? "Procesando..." : children}
    </button>
  );
}

export function SoftButton({ className = "", children, ...rest }) {
  return (
    <button
      {...rest}
      className={`rounded-2xl px-3 py-2 text-sm bg-white/12 hover:bg-white/16
                  ring-1 ring-[color:var(--aa-ring)] ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------- Métricas y estados ---------- */
export function StatCard({ label, value, hint }) {
  return (
    <GlassCard className="p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {hint && <p className="text-xs text-[color:var(--aa-subtle)] mt-1">{hint}</p>}
    </GlassCard>
  );
}

export function EmptyState({ title, desc }) {
  return (
    <GlassCard className="p-8 text-center empty">
      <div className="mx-auto mb-3 h-10 w-10 rounded-2xl bg-white/14 ring-1 ring-[color:var(--aa-ring)]" />
      <p className="font-medium">{title}</p>
      {desc && <p className="text-sm text-muted">{desc}</p>}
    </GlassCard>
  );
}


