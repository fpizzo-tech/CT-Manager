import React from "react";
import { cn } from "@/lib/utils";

export default function DataTable({ columns, rows, emptyMessage = "Nenhum registro encontrado.", onRowClick }) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center"
                )}
              >
                <div className={cn("inline-flex items-center gap-1.5", col.align === "right" && "justify-end")}>
                  {col.label}
                  {col.badge}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  "border-b border-border/60 transition-colors",
                  onRowClick && "cursor-pointer hover:bg-muted/50"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-foreground align-middle whitespace-nowrap",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center"
                    )}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}