import React from "react";
import EntityListPage from "@/components/EntityListPage";
import { PKFGBadge } from "@/components/PKFGBadge";
import { BookOpen } from "lucide-react";

const columns = [
  { key: "titulo", label: "Título", badge: <PKFGBadge type="pk" label="id" />, render: (r) => <span className="font-medium text-foreground">{r.titulo}</span> },
  { key: "categoria", label: "Categoria", render: (r) => <span className="text-muted-foreground">{r.categoria || "—"}</span> },
  { key: "carga_horaria", label: "Carga Horária", render: (r) => <span className="text-muted-foreground tabular-nums">{r.carga_horaria ? `${r.carga_horaria}h` : "—"}</span> },
  { key: "instrutor_nome", label: "Instrutor", badge: <PKFGBadge type="fk" />, render: (r) => <span className="text-muted-foreground">{r.instrutor_nome || "—"}</span> },
  { key: "valor", label: "Valor", render: (r) => <span className="text-muted-foreground tabular-nums">{r.valor != null ? `R$ ${Number(r.valor).toFixed(2)}` : "—"}</span> },
  {
    key: "ativo",
    label: "Ativo",
    render: (r) =>
      r.ativo !== false ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Sim</span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" />Não</span>
      ),
  },
];

const formFields = [
  { name: "titulo", label: "Título do Curso", required: true, placeholder: "Ex: NR-10 Segurança em Eletricidade" },
  { name: "descricao", label: "Descrição", type: "textarea", placeholder: "Ementa do curso..." },
  { name: "categoria", label: "Categoria", placeholder: "Ex: Segurança, Qualificação" },
  { name: "carga_horaria", label: "Carga Horária (horas)", type: "number", placeholder: "40" },
  {
    name: "instrutor_id",
    label: "Instrutor Responsável",
    type: "select",
    fk: true,
    fkSource: "instrutor_id",
    placeholder: "Selecione o instrutor",
  },
  { name: "data_inicio", label: "Data de Início", type: "date" },
  { name: "data_termino", label: "Data de Término", type: "date" },
  { name: "valor", label: "Valor (R$)", type: "number", placeholder: "0.00" },
  { name: "ativo", label: "Ativo", type: "boolean" },
];

const fkSources = [{ entity: "Instrutor", field: "instrutor_id", labelKey: "nome", nameField: "instrutor_nome" }];

export default function Cursos() {
  return (
    <EntityListPage
      entityName="Curso"
      title="Cursos"
      description="Catálogo de cursos e seus instrutores"
      icon={BookOpen}
      accent="amber"
      columns={columns}
      formFields={formFields}
      fkSources={fkSources}
      searchKeys={["titulo", "categoria", "instrutor_nome"]}
    />
  );
}