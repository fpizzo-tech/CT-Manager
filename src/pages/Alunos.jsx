import React from "react";
import EntityListPage from "@/components/EntityListPage";
import { PKFGBadge, StatusPill } from "@/components/PKFGBadge";
import { Users } from "lucide-react";

const columns = [
  { key: "nome", label: "Nome", badge: <PKFGBadge type="pk" label="id" />, render: (r) => <span className="font-medium text-foreground">{r.nome}</span> },
  { key: "email", label: "Email", render: (r) => <span className="text-muted-foreground">{r.email || "—"}</span> },
  { key: "cpf", label: "CPF", render: (r) => <span className="text-muted-foreground tabular-nums">{r.cpf || "—"}</span> },
  { key: "empresa_nome", label: "Empresa", badge: <PKFGBadge type="fk" />, render: (r) => <span className="text-muted-foreground">{r.empresa_nome || "—"}</span> },
  { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
];

const formFields = [
  { name: "nome", label: "Nome Completo", required: true, placeholder: "Nome do aluno" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "email@exemplo.com" },
  { name: "telefone", label: "Telefone", placeholder: "(00) 00000-0000" },
  { name: "cpf", label: "CPF", placeholder: "000.000.000-00" },
  { name: "data_nascimento", label: "Data de Nascimento", type: "date" },
  {
    name: "empresa_id",
    label: "Empresa Vinculada",
    type: "select",
    fk: true,
    fkSource: "empresa_id",
    placeholder: "Selecione a empresa",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "ativo", label: "Ativo" },
      { value: "pendente", label: "Pendente" },
      { value: "inativo", label: "Inativo" },
    ],
  },
];

const fkSources = [{ entity: "Empresa", field: "empresa_id", labelKey: "nome_fantasia", nameField: "empresa_nome" }];

export default function Alunos() {
  return (
    <EntityListPage
      entityName="Aluno"
      title="Alunos"
      description="Gerencie os alunos vinculados às empresas"
      icon={Users}
      accent="indigo"
      columns={columns}
      formFields={formFields}
      fkSources={fkSources}
      searchKeys={["nome", "email", "cpf", "empresa_nome"]}
    />
  );
}