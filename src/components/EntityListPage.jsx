import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useEntityCollection } from "@/hooks/useEntityCollection";
import DataTable from "@/components/DataTable";
import RecordFormModal from "@/components/RecordFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EntityListPage({
  entityName,
  title,
  description,
  icon: Icon,
  accent = "indigo",
  columns,
  formFields,
  searchKeys = [],
  fkSources = [],
  extraActions,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [fkOptions, setFkOptions] = useState({});

  const { items, loading, create, update, remove } = useEntityCollection(entityName);

  // Open form when ?new=1 present
  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditing(null);
      setModalOpen(true);
      searchParams.delete("new");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  // Load FK source options
  useEffect(() => {
    let active = true;
    Promise.all(
      fkSources.map(async (src) => {
        const data = await base44.entities[src.entity].list("-updated_date", 200);
        return [src.field, (Array.isArray(data) ? data : []).map((d) => ({ value: d.id, label: d[src.labelKey], record: d }))];
      })
    ).then((results) => {
      if (!active) return;
      const map = {};
      results.forEach(([field, opts]) => (map[field] = opts));
      setFkOptions(map);
    });
    return () => {
      active = false;
    };
  }, [fkSources]);

  const resolvedFields = useMemo(() => {
    return formFields.map((f) => {
      if (f.type === "select" && f.fkSource) {
        const opts = fkOptions[f.fkSource] || [];
        return { ...f, options: opts.map((o) => ({ value: o.value, label: o.label })) };
      }
      return f;
    });
  }, [formFields, fkOptions]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((item) =>
      searchKeys.some((k) => String(item[k] ?? "").toLowerCase().includes(q))
    );
  }, [items, search, searchKeys]);

  const handleOpenNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    // For FK fields, resolve the display name from selected option
    const payload = { ...values };
    fkSources.forEach((src) => {
      if (values[src.field]) {
        const opt = (fkOptions[src.field] || []).find((o) => o.value === values[src.field]);
        if (opt) {
          payload[src.nameField] = opt.label;
        }
      }
    });
    if (editing) {
      await update(editing.id, payload);
    } else {
      await create(payload);
    }
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const accentMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    sky: "bg-sky-50 text-sky-600",
  };

  const tableColumns = [
    ...columns,
    {
      key: "_actions",
      label: "",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }} className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5">
            <Pencil size={15} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/5">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", accentMap[accent])}>
                <Icon size={18} />
              </div>
            )}
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground leading-tight">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9 bg-white" />
          </div>
          {extraActions}
          <Button onClick={handleOpenNew} className="bg-primary hover:bg-primary/90 shrink-0">
            <Plus className="h-4 w-4 mr-1.5" /> Novo
          </Button>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] ring-1 ring-border/60 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando...
          </div>
        ) : (
          <DataTable columns={tableColumns} rows={filtered} emptyMessage="Nenhum registro encontrado." onRowClick={handleEdit} />
        )}
      </div>

      <RecordFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? `Editar ${title}` : `Novo ${title}`}
        fields={resolvedFields}
        initial={editing || {}}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir registro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}