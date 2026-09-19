import React from "react";
import EntityListPage from "@/components/EntityListPage";
import { PKFGBadge } from "@/components/PKFGBadge";
import { Building2 } from "lucide-react";

const columns = [
  { key: "nome_fantasia", label: "Nome Fantasia", badge: <PKFGBadge type="pk" label="id" />, render: (r) => <span className="font-medium text-foreground">{r.nome_fantasia}</span> },
  { key: "razao_social", label: "Razão Social", render: (r) => <span className="text-muted-foreground">{r.razao_social || "—"}</span> },
  { key: "cnpj", label: "CNPJ", render: (r) => <span className="text-muted-foreground tabular-nums">{r.cnpj || "—"}</span> },
  { key: "email", label: "Email", render: (r) => <span className="text-muted-foreground">{r.email || "—"}</span> },
  { key: "cidade", label: "Cidade", render: (r) => <span className="text-muted-foreground">{[r.cidade, r.estado].filter(Boolean).join("/") || "—"}</span> },
  {
    key: "ativo",
    label: "Ativa",
    render: (r) =>
      r.ativo !== false ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Sim</span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" />Não</span>
      ),
  },
];

const formFields = [
  { name: "nome_fantasia", label: "Nome Fantasia", required: true, placeholder: "Nome da empresa" },
  { name: "razao_social", label: "Razão Social", placeholder: "Razão social completa" },
  { name: "cnpj", label: "CNPJ", required: true, placeholder: "00.000.000/0000-00" },
  { name: "email", label: "Email", type: "email", placeholder: "contato@empresa.com" },
  { name: "telefone", label: "Telefone", placeholder: "(00) 0000-0000" },
  { name: "endereco", label: "Endereço", placeholder: "Rua, número, bairro" },
  { name: "cidade", label: "Cidade", placeholder: "Cidade" },
  { name: "estado", label: "Estado", placeholder: "UF" },
  { name: "ativo", label: "Ativa", type: "boolean" },
];

export default function Empresas() {
  return (
    <EntityListPage
      entityName="Empresa"
      title="Empresas"
      description="Empresas vinculadas aos alunos"
      icon={Building2}
      accent="sky"
      columns={columns}
      formFields={formFields}
      searchKeys={["nome_fantasia", "razao_social", "cnpj", "cidade"]}
    />
  );
}