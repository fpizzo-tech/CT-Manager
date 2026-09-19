import React from "react";
import { cn } from "@/lib/utils";

export default function MetricCard({ icon: Icon, label, value, accent = "indigo", sub, relation }) {
  const accents = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    sky: "bg-sky-50 text-sky-600",
  };
  return (
    <div className="rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.04)] ring-1 ring-border/60">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accents[accent])}>
          {Icon && <Icon size={20} />}
        </div>
        {relation && (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
            {relation}
          </span>
        )}
      </div>
      <div className="mt-4">
        <div className="font-heading text-3xl font-bold text-foreground tabular-nums">{value}</div>
        <div className="mt-1 text-sm font-medium text-muted-foreground">{label}</div>
        {sub && <div className="mt-2 text-xs text-muted-foreground/80">{sub}</div>}
      </div>
    </div>
  );
}