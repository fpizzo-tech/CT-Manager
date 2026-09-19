import React, { useState, useMemo, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, Clock, User, Tag } from "lucide-react";
import { PKFGBadge } from "@/components/PKFGBadge";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval,
} from "date-fns";
import { ptBR } from "date-fns/locale";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const CATEGORY_COLORS = [
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

function colorForCategory(category) {
  if (!category) return CATEGORY_COLORS[0];
  let hash = 0;
  for (let i = 0; i < category.length; i++) hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length];
}

function parseDate(value) {
  if (!value) return null;
  try {
    const d = parseISO(value);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

export default function Calendario() {
  const { toast } = useToast();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await base44.entities.Curso.list("-updated_date", 200);
        if (active) setCursos(data);
      } catch (e) {
        if (active)
          toast({ variant: "destructive", title: "Erro ao carregar cursos", description: e.message });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [toast]);

  const scheduled = useMemo(
    () =>
      cursos
        .map((c) => {
          const start = parseDate(c.data_inicio);
          const end = parseDate(c.data_termino) || start;
          return { ...c, _start: start, _end: end };
        })
        .filter((c) => c._start && c._end),
    [cursos]
  );

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const coursesByDay = useMemo(() => {
    const map = new Map();
    for (const day of days) {
      const key = format(day, "yyyy-MM-dd");
      const list = scheduled.filter((c) =>
        isWithinInterval(day, { start: c._start, end: c._end })
      );
      if (list.length) map.set(key, list);
    }
    return map;
  }, [days, scheduled]);

  const monthCourses = useMemo(
    () => scheduled.filter((c) => c._end >= monthStart && c._start <= monthEnd),
    [scheduled, monthStart, monthEnd]
  );

  const today = new Date();

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <CalendarDays size={22} />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl md:text-2xl text-foreground flex items-center gap-2">
              Calendário de Cursos
              <PKFGBadge type="pk" label="Curso.id" />
            </h1>
            <p className="text-sm text-muted-foreground">
              Cursos agendados por data de início e término
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCursor(subMonths(cursor, 1))}
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-input bg-white hover:bg-accent/10 text-foreground"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCursor(new Date())}
            className="h-9 px-3 inline-flex items-center rounded-lg border border-input bg-white hover:bg-accent/10 text-foreground text-sm font-medium"
          >
            Hoje
          </button>
          <button
            onClick={() => setCursor(addMonths(cursor, 1))}
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-input bg-white hover:bg-accent/10 text-foreground"
          >
            <ChevronRight size={18} />
          </button>
          <div className="ml-2 font-heading font-bold text-lg text-foreground capitalize min-w-[170px] text-center">
            {format(cursor, "MMMM 'de' yyyy", { locale: ptBR })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border bg-muted/40">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr">
              {days.map((day) => {
                const key = format(day, "yyyy-MM-dd");
                const inMonth = isSameMonth(day, cursor);
                const isToday = isSameDay(day, today);
                const list = coursesByDay.get(key) || [];
                return (
                  <div
                    key={key}
                    className={`min-h-[84px] md:min-h-[104px] border-b border-r border-border p-1.5 ${
                      inMonth ? "bg-card" : "bg-muted/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                          isToday
                            ? "bg-primary text-primary-foreground"
                            : inMonth
                            ? "text-foreground"
                            : "text-muted-foreground/50"
                        }`}
                      >
                        {format(day, "d")}
                      </span>
                      {list.length > 2 && (
                        <span className="text-[10px] font-medium text-muted-foreground">
                          +{list.length - 2}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      {list.slice(0, 2).map((c) => {
                        const color = colorForCategory(c.categoria);
                        const isStart = isSameDay(day, c._start);
                        return (
                          <button
                            key={c.id}
                            onClick={() => setSelected(c)}
                            className={`group flex items-center gap-1 w-full rounded-md px-1.5 py-1 text-left text-[11px] font-medium text-white hover:opacity-90 transition-opacity ${color} ${
                              isStart ? "ring-2 ring-offset-1 ring-primary/40" : ""
                            }`}
                            title={c.titulo}
                          >
                            <span className="truncate">{c.titulo}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card shadow-sm p-4">
            <h2 className="font-heading font-semibold text-sm text-foreground mb-3">
              Cursos neste mês ({monthCourses.length})
            </h2>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : monthCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Nenhum curso agendado para este mês.
              </p>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
                {monthCourses
                  .sort((a, b) => a._start - b._start)
                  .map((c) => {
                    const color = colorForCategory(c.categoria);
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelected(c)}
                        className="flex items-start gap-3 w-full text-left p-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-accent/5 transition-colors"
                      >
                        <span className={`mt-1 h-8 w-1.5 rounded-full ${color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {c.titulo}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {format(c._start, "dd/MM/yyyy")}
                            {c._termino && !isSameDay(c._start, c._end)
                              ? ` — ${format(c._end, "dd/MM/yyyy")}`
                              : ""}
                          </div>
                          {c.instrutor_nome && (
                            <div className="text-[11px] text-muted-foreground/80 mt-0.5">
                              {c.instrutor_nome}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm p-4">
            <h2 className="font-heading font-semibold text-sm text-foreground mb-3">Legenda</h2>
            <p className="text-xs text-muted-foreground mb-3">
              As cores indicam a categoria do curso. O anel destaca o dia de início.
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(scheduled.map((c) => c.categoria).filter(Boolean))).map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${colorForCategory(cat)}`} />
                  {cat}
                </span>
              ))}
              {scheduled.length === 0 && (
                <span className="text-xs text-muted-foreground">Sem categorias ainda.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-card shadow-xl border border-border p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${colorForCategory(selected.categoria)}`} />
                <h3 className="font-heading font-bold text-lg text-foreground">{selected.titulo}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5 text-foreground">
                <CalendarDays size={16} className="text-muted-foreground" />
                <span>
                  {format(selected._start, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  {selected._end && !isSameDay(selected._start, selected._end)
                    ? ` — ${format(selected._end, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`
                    : ""}
                </span>
              </div>
              {selected.categoria && (
                <div className="flex items-center gap-2.5 text-foreground">
                  <Tag size={16} className="text-muted-foreground" />
                  {selected.categoria}
                </div>
              )}
              {selected.instrutor_nome && (
                <div className="flex items-center gap-2.5 text-foreground">
                  <User size={16} className="text-muted-foreground" />
                  {selected.instrutor_nome}
                </div>
              )}
              {selected.carga_horaria != null && (
                <div className="flex items-center gap-2.5 text-foreground">
                  <Clock size={16} className="text-muted-foreground" />
                  {selected.carga_horaria}h
                </div>
              )}
              {selected.valor != null && (
                <div className="flex items-center gap-2.5 text-foreground">
                  <MapPin size={16} className="text-muted-foreground" />
                  R$ {Number(selected.valor).toFixed(2)}
                </div>
              )}
              {selected.descricao && (
                <p className="text-muted-foreground pt-2 border-t border-border">
                  {selected.descricao}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}