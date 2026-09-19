import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";

export function useEntityCollection(entityName, { sort = "-updated_date", limit = 200 } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await base44.entities[entityName].list(sort, limit);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      toast({ title: "Erro ao carregar dados", description: e.message, variant: "destructive" });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [entityName, sort, limit]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (data) => {
    const created = await base44.entities[entityName].create(data);
    await load();
    toast({ title: "Registro criado com sucesso" });
    return created;
  };

  const update = async (id, data) => {
    await base44.entities[entityName].update(id, data);
    await load();
    toast({ title: "Registro atualizado" });
  };

  const remove = async (id) => {
    await base44.entities[entityName].delete(id);
    await load();
    toast({ title: "Registro excluído" });
  };

  return { items, loading, reload: load, create, update, remove };
}