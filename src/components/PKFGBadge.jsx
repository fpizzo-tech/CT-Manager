import React from "react";
import { cn } from "@/lib/utils";

export function PKFGBadge({ type, label }) {
  const isPK = type === "pk";
  const isFK = type === "fk";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide font-body",
        isPK && "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
        isFK && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        !isPK && !isFK && "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
      )}
      title={isPK ? "Primary Key" : isFK ? "Foreign Key" : label}
    >
      <span className="font-mono">{isPK ? "PK" : isFK ? "FK" : "•"}</span>
      {label && <span className="hidden sm:inline">{label}</span>}
    </span>
  );
}

export function StatusPill({ status }) {
  const map = {
    ativo: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    pendente: "bg-amber-50 text-amber-700 ring-amber-200",
    concluido: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    cancelado: "bg-rose-50 text-rose-700 ring-rose-200",
    inativo: "bg-slate-100 text-slate-500 ring-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1",
        map[status] || "bg-slate-100 text-slate-600 ring-slate-200"
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}