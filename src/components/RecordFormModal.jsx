import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";

export default function RecordFormModal({ open, onOpenChange, title, fields, initial, onSubmit }) {
  const isMobile = useIsMobile();
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(initial || {});
    }
  }, [open, initial]);

  const setField = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field) => {
    const value = values[field.name] ?? (field.type === "boolean" ? false : field.type === "number" ? "" : "");
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.name}
            value={value}
            onChange={(e) => setField(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
          />
        );
      case "select":
        return (
          <Select value={value || ""} onValueChange={(v) => setField(field.name, v)}>
            <SelectTrigger id={field.name}>
              <SelectValue placeholder={field.placeholder || "Selecione..."} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "boolean":
        return (
          <div className="flex items-center gap-2 pt-1">
            <Switch id={field.name} checked={!!value} onCheckedChange={(v) => setField(field.name, v)} />
            <Label htmlFor={field.name} className="text-sm text-muted-foreground">
              {value ? "Sim" : "Não"}
            </Label>
          </div>
        );
      default:
        return (
          <Input
            id={field.name}
            type={field.type || "text"}
            value={value}
            onChange={(e) => setField(field.name, field.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  const formBody = (
    <form id="record-form" onSubmit={handleSubmit} className="space-y-4 px-1">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
            {field.label}
            {field.fk && (
              <span className="ml-2 inline-flex items-center rounded bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                FK
              </span>
            )}
            {field.required && <span className="text-destructive ml-0.5">*</span>}
          </Label>
          {renderField(field)}
        </div>
      ))}
    </form>
  );

  const footer = (
    <>
      <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
        Cancelar
      </Button>
      <Button type="submit" form="record-form" disabled={saving}>
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Salvar
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto scrollbar-thin">{formBody}</div>
          <DrawerFooter className="flex-row justify-end gap-2 border-t border-border pt-3 px-4">
            {footer}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {formBody}
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}