import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useEntityCollection } from "@/hooks/useEntityCollection";
import DataTable from "@/components/DataTable";
import RecordFormModal from "@/components/RecordFormModal";
import { PKFGBadge, StatusPill } from "@/components/PKFGBadge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Network, Plus, Pencil, Trash2, Users, GraduationCap, BookOpen, Building2, Link2, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = [
  {
    name: "Empresa",
    icon: Building2,
    color: "sky",
    pk: "id",
    fields: [
      { n: "nome_fantasia", t: "string" },
      { n: "razao_social", t: "string" },
      { n: "cnpj", t: "string" },
      { n: "email", t: "string" },
      { n: "ativo", t: "boolean" },
    ],
  },
  {
    name: "Aluno",
    icon: Users,
    color: "indigo",
    pk: "id",
    fk: [{ n: "empresa_id", ref: "Empresa" }],
    fields: [
      { n: "nome", t: "string" },
      { n: "email", t: "string" },
      { n: "cpf", t: "string" },
      { n: "data_nascimento", t: "date" },
      { n: "status", t: "enum" },
    ],
  },
  {
    name: "Instrutor",
    icon: GraduationCap,
    color: "emerald",
    pk: "id",
    fields: [
      { n: "nome", t: "string" },
      { n: "email", t: "string" },
      { n: "especialidade", t: "string" },
      { n: "ativo", t: "boolean" },
    ],
  },
  {
    name: "Curso",
    icon: BookOpen,
    color: "amber",
    pk: "id",
    fk: [{ n: "instrutor_id", ref: "Instrutor" }],
    fields: [
      { n: "titulo", t: "string" },
      { n: "categoria", t: "string" },
      { n: "carga_horaria", t: "number" },
      { n: "valor", t: "number" },
      { n: "ativo", t: "boolean" },
    ],
  },
  {
    name: "Matricula",
    icon: Link2,
    color: "indigo",
    pk: "id",
    fk: [
      { n: "aluno_id", ref: "Aluno" },
      { n: "curso_id", ref: "Curso" },
      { n: "empresa_id", ref: "Empresa" },
    ],
    fields: [
      { n: "data_matricula", t: "date" },
      { n: "status", t: "enum" },
    ],
  },
];

const colorMap = {
  sky: "bg-sky-50 text-sky-600 ring-sky-200",
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-200",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  amber: "bg-amber-50 text-amber-600 ring-amber-200",
};

export default function Relacionamentos() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [cursos, setCursos] = useState([]);

  const { items, loading, create, update, remove } = useEntityCollection("Matricula", { sort: "-created_date" });

  useEffect(() => {
    base44.entities.Aluno.list("-updated_date", 200).then((d) => setAlunos(Array.isArray(d) ? d : []));
    base44.entities.Curso.list("-updated_date", 200).then((d) => setCursos(Array.isArray(d) ? d : []));
  }, []);

  const alunoOptions = useMemo(() => alunos.map((a) => ({ value: a.id, label: a.nome, record: a })), [alunos]);
  const cursoOptions = useMemo(() => cursos.map((c) => ({ value: c.id, label: c.titulo, record: c })), [cursos]);

  const formFields = [
    { name: "aluno_id", label: "Aluno", type: "select", fk: true, required: true, options: alunoOptions.map((o) => ({ value: o.value, label: o.label })) },
    { name: "curso_id", label: "Curso", type: "select", fk: true, required: true, options: cursoOptions.map((o) => ({ value: o.value, label: o.label })) },
    { name: "data_matricula", label: "Data da Matrícula", type: "date", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "pendente", label: "Pendente" },
        { value: "ativo", label: "Ativo" },
        { value: "concluido", label: "Concluído" },
        { value: "cancelado", label: "Cancelado" },
      ],
    },
  ];

  const handleSubmit = async (values) => {
    const aluno = alunoOptions.find((o) => o.value === values.aluno_id);
    const curso = cursoOptions.find((o) => o.value === values.curso_id);
    const payload = {
      ...values,
      aluno_nome: aluno?.label || "",
      curso_titulo: curso?.label || "",
      empresa_id: aluno?.record?.empresa_id || "",
      empresa_nome: aluno?.record?.empresa_nome || "",
    };
    if (editing) await update(editing.id, payload);
    else await create(payload);
  };

  const columns = [
    { key: "aluno_nome", label: "Aluno", badge: <PKFGBadge type="fk" />, render: (r) => <span className="font-medium text-foreground">{r.aluno_nome || "—"}</span> },
    { key: "curso_titulo", label: "Curso", badge: <PKFGBadge type="fk" />, render: (r) => <span className="text-foreground">{r.curso_titulo || "—"}</span> },
    { key: "empresa_nome", label: "Empresa", badge: <PKFGBadge type="fk" />, render: (r) => <span className="text-muted-foreground">{r.empresa_nome || "—"}</span> },
    { key: "data_matricula", label: "Data", render: (r) => <span className="text-muted-foreground tabular-nums">{r.data_matricula ? new Date(r.data_matricula).toLocaleDateString("pt-BR") : "—"}</span> },
    { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
    {
      key: "_actions",
      label: "",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={(e) => { e.stopPropagation(); setEditing(row); setModalOpen(true); }} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5"><Pencil size={15} /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/5"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Network size={18} />
        </div>
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground leading-tight">Relacionamentos</h1>
          <p className="text-sm text-muted-foreground">Estrutura do banco de dados e matrículas</p>
        </div>
      </div>

      {/* Schema map */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Database className="h-4 w-4 text-primary" />
          <h2 className="font-heading font-bold text-base text-foreground">Mapa de Entidades</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schema.map((entity) => (
            <div key={entity.name} className="rounded-xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] ring-1 ring-border/60 p-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg ring-1", colorMap[entity.color])}>
                  <entity.icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-heading font-bold text-sm text-foreground">{entity.name}</div>
                  <div className="text-[11px] text-muted-foreground">tabela</div>
                </div>
                <PKFGBadge type="pk" label={entity.pk} />
              </div>
              <div className="pt-3 space-y-1.5">
                {entity.fk?.map((f) => (
                  <div key={f.n} className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-muted-foreground">{f.n}</span>
                    <PKFGBadge type="fk" label={f.ref} />
                  </div>
                ))}
                {entity.fields.map((f) => (
                  <div key={f.n} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-foreground/80">{f.n}</span>
                    <span className="text-muted-foreground/70 text-[10px] uppercase">{f.t}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relationships diagram */}
      <div className="rounded-xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] ring-1 ring-border/60 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="h-4 w-4 text-primary" />
          <h2 className="font-heading font-bold text-base text-foreground">Conexões Relacionais</h2>
        </div>
        <div className="space-y-2.5">
          {[
            { from: "Empresa", to: "Aluno", fk: "empresa_id", card: "1 : N" },
            { from: "Instrutor", to: "Curso", fk: "instrutor_id", card: "1 : N" },
            { from: "Aluno", to: "Matricula", fk: "aluno_id", card: "1 : N" },
            { from: "Curso", to: "Matricula", fk: "curso_id", card: "1 : N" },
            { from: "Empresa", to: "Matricula", fk: "empresa_id", card: "1 : N" },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/40">
              <span className="font-medium text-sm text-foreground">{r.from}</span>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs font-semibold">{r.card}</span>
              <span className="font-medium text-sm text-foreground">{r.to}</span>
              <span className="ml-auto text-xs text-muted-foreground font-mono">via {r.fk} <PKFGBadge type="fk" /></span>
            </div>
          ))}
        </div>
      </div>

      {/* Matriculas management */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <h2 className="font-heading font-bold text-base text-foreground">Matrículas</h2>
          </div>
          <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-1.5" /> Nova Matrícula
          </Button>
        </div>
        <div className="rounded-xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] ring-1 ring-border/60 overflow-hidden">
          <DataTable columns={columns} rows={items} emptyMessage={loading ? "Carregando..." : "Nenhuma matrícula."} onRowClick={(r) => { setEditing(r); setModalOpen(true); }} />
        </div>
      </div>

      <RecordFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? "Editar Matrícula" : "Nova Matrícula"}
        fields={formFields}
        initial={editing || {}}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir matrícula</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja excluir esta matrícula? Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={async () => { if (deleteTarget) { await remove(deleteTarget.id); setDeleteTarget(null); } }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}