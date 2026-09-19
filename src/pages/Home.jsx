import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useEntityCollection } from "@/hooks/useEntityCollection";
import MetricCard from "@/components/MetricCard";
import DataTable from "@/components/DataTable";
import { PKFGBadge, StatusPill } from "@/components/PKFGBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Search,
  Plus,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  ArrowRight,
  Database,
  Link2,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const relations = [
  { from: "Empresa", to: "Aluno", label: "1 : N", desc: "empresa_id (FK)" },
  { from: "Instrutor", to: "Curso", label: "1 : N", desc: "instrutor_id (FK)" },
  { from: "Aluno", to: "Matricula", label: "1 : N", desc: "aluno_id (FK)" },
  { from: "Curso", to: "Matricula", label: "1 : N", desc: "curso_id (FK)" },
  { from: "Empresa", to: "Matricula", label: "1 : N", desc: "empresa_id (FK)" },
];

const entityShortcuts = [
  { name: "Alunos", to: "/alunos", icon: Users, color: "text-indigo-600 bg-indigo-50" },
  { name: "Instrutores", to: "/instrutores", icon: GraduationCap, color: "text-emerald-600 bg-emerald-50" },
  { name: "Cursos", to: "/cursos", icon: BookOpen, color: "text-amber-600 bg-amber-50" },
  { name: "Empresas", to: "/empresas", icon: Building2, color: "text-sky-600 bg-sky-50" },
];

export default function Home() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("todos");
  const [pickerOpen, setPickerOpen] = useState(false);

  const alunos = useEntityCollection("Aluno");
  const instrutores = useEntityCollection("Instrutor");
  const cursos = useEntityCollection("Curso");
  const empresas = useEntityCollection("Empresa");
  const matriculas = useEntityCollection("Matricula", { sort: "-created_date" });

  const activeCursos = useMemo(() => cursos.items.filter((c) => c.ativo !== false).length, [cursos.items]);
  const activeInstrutores = useMemo(() => instrutores.items.filter((i) => i.ativo !== false).length, [instrutores.items]);
  const activeEmpresas = useMemo(() => empresas.items.filter((e) => e.ativo !== false).length, [empresas.items]);

  const metrics = [
    { icon: Users, label: "Total de Alunos", value: alunos.items.length, accent: "indigo", relation: "→ Empresas", sub: `${activeEmpresas} empresas vinculadas` },
    { icon: BookOpen, label: "Cursos Ativos", value: activeCursos, accent: "amber", relation: "→ Instrutores", sub: `${cursos.items.length} cursos cadastrados` },
    { icon: GraduationCap, label: "Instrutores", value: activeInstrutores, accent: "emerald", relation: "→ Cursos", sub: `${instrutores.items.length} cadastrados` },
    { icon: Building2, label: "Empresas Vinculadas", value: activeEmpresas, accent: "sky", relation: "→ Alunos", sub: `${alunos.items.length} alunos no total` },
  ];

  const filteredMatriculas = useMemo(() => {
    let list = matriculas.items;
    if (tab === "pendentes") list = list.filter((m) => m.status === "pendente");
    if (tab === "ativo") list = list.filter((m) => m.status === "ativo");
    if (tab === "concluido") list = list.filter((m) => m.status === "concluido");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          (m.aluno_nome || "").toLowerCase().includes(q) ||
          (m.curso_titulo || "").toLowerCase().includes(q) ||
          (m.empresa_nome || "").toLowerCase().includes(q)
      );
    }
    return list.slice(0, 50);
  }, [matriculas.items, tab, search]);

  const columns = [
    {
      key: "aluno_nome",
      label: "Aluno",
      badge: <PKFGBadge type="fk" />,
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-semibold uppercase">
            {(r.aluno_nome || "?").charAt(0)}
          </div>
          <span className="font-medium text-foreground">{r.aluno_nome || "—"}</span>
        </div>
      ),
    },
    {
      key: "curso_titulo",
      label: "Curso",
      badge: <PKFGBadge type="fk" />,
      render: (r) => <span className="text-foreground">{r.curso_titulo || "—"}</span>,
    },
    {
      key: "empresa_nome",
      label: "Empresa",
      badge: <PKFGBadge type="fk" />,
      render: (r) => <span className="text-muted-foreground">{r.empresa_nome || "—"}</span>,
    },
    { key: "data_matricula", label: "Data", render: (r) => <span className="text-muted-foreground tabular-nums">{r.data_matricula ? new Date(r.data_matricula).toLocaleDateString("pt-BR") : "—"}</span> },
    { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
  ];

  const openNew = (path) => {
    setPickerOpen(false);
    navigate(`${path}?new=1`);
  };

  return (
    <div className="space-y-6">
      {/* Command header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar alunos, cursos, empresas..."
            className="pl-9 bg-white"
          />
        </div>
        <Button onClick={() => (isMobile ? setPickerOpen(true) : setPickerOpen(true))} className="bg-primary hover:bg-primary/90 shrink-0">
          <Plus className="h-4 w-4 mr-1.5" />
          Novo Cadastro
        </Button>
      </div>

      {/* Metrics */}
      {isMobile ? (
        <MobileStatsCarousel metrics={metrics} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      )}

      {/* Lower split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Matriculas table */}
        <div className="lg:col-span-2 rounded-xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] ring-1 ring-border/60 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border">
            <div>
              <h2 className="font-heading font-bold text-base text-foreground">Matrículas & Cursos Recentes</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Vínculos aluno ↔ curso ↔ empresa</p>
            </div>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="bg-muted/60">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="ativo">Por Empresa</TabsTrigger>
                <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <DataTable
            columns={columns}
            rows={filteredMatriculas}
            emptyMessage={matriculas.loading ? "Carregando matrículas..." : "Nenhuma matrícula encontrada."}
            onRowClick={(r) => navigate("/relacionamentos")}
          />
        </div>

        {/* Entity overview / schema map */}
        <div className="rounded-xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] ring-1 ring-border/60 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-4 w-4 text-primary" />
            <h2 className="font-heading font-bold text-base text-foreground">Visão Geral de Entidades</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Mapa relacional do banco de dados</p>

          <div className="space-y-2 mb-5">
            {entityShortcuts.map((e) => (
              <button
                key={e.name}
                onClick={() => navigate(e.to)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg ring-1 ring-border/60 hover:ring-primary/40 hover:bg-muted/40 transition-colors text-left"
              >
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", e.color)}>
                  <e.icon size={16} />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">{e.name}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>

          <div className="rounded-lg bg-muted/40 p-3 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Link2 className="h-3.5 w-3.5" /> Relacionamentos
            </div>
            {relations.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="font-medium text-foreground">{r.from}</span>
                <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono font-semibold">{r.label}</span>
                <span className="font-medium text-foreground">{r.to}</span>
                <span className="ml-auto text-muted-foreground font-mono text-[10px]">{r.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile floating button */}
      {isMobile && (
        <button
          onClick={() => setPickerOpen(true)}
          className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* New record picker */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPickerOpen(false)} />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 m-0 sm:m-4 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Users2 className="h-5 w-5 text-primary" />
              <h3 className="font-heading font-bold text-lg">Novo Registro</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {entityShortcuts.map((e) => (
                <button
                  key={e.name}
                  onClick={() => openNew(e.to)}
                  className="flex flex-col items-start gap-2 p-4 rounded-xl ring-1 ring-border hover:ring-primary/40 hover:bg-muted/40 transition-colors text-left"
                >
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", e.color)}>
                    <e.icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{e.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileStatsCarousel({ metrics }) {
  return (
    <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-3 w-max pb-1">
        {metrics.map((m) => (
          <div key={m.label} className="w-40 shrink-0">
            <MetricCard {...m} />
          </div>
        ))}
      </div>
    </div>
  );
}