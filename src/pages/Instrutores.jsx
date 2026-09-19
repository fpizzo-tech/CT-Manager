import React from "react";
import EntityListPage from "@/components/EntityListPage";
import { PKFGBadge } from "@/components/PKFGBadge";
import { GraduationCap } from "lucide-react";

const columns = [
  { key: "nome", label: "Nome", badge: <PKFGBadge type="pk" label="id" />, render: (r) => <span className="font-medium text-foreground">{r.nome}</span> },
  { key: "email", label: "Email", render: (r) => <span className="text-muted-foreground">{r.email || "—"}</span> },
  { key: "especialidade", label: "Especialidade", render: (r) => <span className="text-muted-foreground">{r.especialidade || "—"}</span> },
  { key: "telefone", label: "Telefone", render: (r) => <span className="text-muted-foreground tabular-nums">{r.telefone || "—"}</span> },
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
  { name: "nome", label: "Nome Completo", required: true, placeholder: "Nome do instrutor" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "email@exemplo.com" },
  { name: "telefone", label: "Telefone", placeholder: "(00) 00000-0000" },
  { name: "cpf", label: "CPF", placeholder: "000.000.000-00" },
  { name: "especialidade", label: "Especialidade", placeholder: "Ex: Segurança do Trabalho" },
  { name: "biografia", label: "Biografia", type: "textarea", placeholder: "Breve currículo..." },
  { name: "ativo", label: "Ativo", type: "boolean" },
];

export default function Instrutores() {
  return (
    <EntityListPage
      entityName="Instrutor"
      title="Instrutores"
      description="Cadastre os instrutores dos cursos"
      icon={GraduationCap}
      accent="emerald"
      columns={columns}
      formFields={formFields}
      searchKeys={["nome", "email", "especialidade"]}
    />
  );
}