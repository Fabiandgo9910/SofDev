"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/glass/glass-card";
import { GlassButton } from "@/components/glass/glass-button";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "url" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
};

type Row = Record<string, unknown>;

export function AdminCrudTable({
  table,
  title,
  fields,
  columns,
  defaultValues = {},
  orderBy = "display_order",
}: {
  table: string;
  title: string;
  fields: FieldConfig[];
  columns: string[]; // columnas a mostrar en la tabla (deben existir en fields o ser 'id')
  defaultValues?: Row;
  orderBy?: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function load() {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from(table)
      .select("*")
      .order(orderBy, { ascending: true });
    if (fetchError) setError(fetchError.message);
    setRows(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  function openCreate() {
    setEditing({ ...defaultValues });
    setShowForm(true);
    setError(null);
  }

  function openEdit(row: Row) {
    setEditing({ ...row });
    setShowForm(true);
    setError(null);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("¿Seguro que quieres eliminar este elemento? Esta acción no se puede deshacer.")) return;
    const { error: deleteError } = await supabase.from(table).delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    load();
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setError(null);

    const payload: Row = {};
    fields.forEach((field) => {
      const value = editing[field.name];
      if (field.type === "number") payload[field.name] = value === "" || value === undefined ? 0 : Number(value);
      else if (field.type === "checkbox") payload[field.name] = Boolean(value);
      else payload[field.name] = value ?? "";
    });

    const isNew = !editing.id;
    const { error: saveError } = isNew
      ? await supabase.from(table).insert(payload)
      : await supabase.from(table).update(payload).eq("id", editing.id as string);

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setShowForm(false);
    setEditing(null);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
        <GlassButton onClick={openCreate} className="!px-4 !py-2 text-sm">
          <Plus size={16} /> Añadir
        </GlassButton>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {/* Vista de tarjetas — móvil */}
      <div className="space-y-3 md:hidden">
        {loading && <GlassCard hover={false} className="py-6 text-center opacity-60">Cargando...</GlassCard>}
        {!loading && !rows.length && (
          <GlassCard hover={false} className="py-6 text-center opacity-60">Todavía no hay elementos.</GlassCard>
        )}
        {rows.map((row) => (
          <GlassCard key={row.id as string} hover={false}>
            <div className="space-y-1.5">
              {columns.map((col) => (
                <div key={col} className="flex items-baseline justify-between gap-3">
                  <span className="shrink-0 text-xs font-medium uppercase tracking-wide opacity-60">
                    {fields.find((f) => f.name === col)?.label ?? col}
                  </span>
                  <span className="truncate text-right text-sm">
                    {typeof row[col] === "boolean" ? (row[col] ? "Sí" : "No") : String(row[col] ?? "—")}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2 border-t border-white/10 pt-3">
              <button
                onClick={() => openEdit(row)}
                aria-label="Editar"
                className="focus-ring flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm hover:bg-brand-500/10"
              >
                <Pencil size={14} /> Editar
              </button>
              <button
                onClick={() => handleDelete(row.id as string)}
                aria-label="Eliminar"
                className="focus-ring flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-500/10"
              >
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Vista de tabla — pantallas medianas y superiores */}
      <GlassCard hover={false} className="hidden overflow-x-auto !p-0 md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 font-medium opacity-70">
                  {fields.find((f) => f.name === col)?.label ?? col}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-medium opacity-70">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center opacity-60">
                  Cargando...
                </td>
              </tr>
            )}
            {!loading && !rows.length && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-6 text-center opacity-60">
                  Todavía no hay elementos.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id as string} className="border-b border-white/5">
                {columns.map((col) => (
                  <td key={col} className="max-w-xs truncate px-4 py-3">
                    {typeof row[col] === "boolean" ? (row[col] ? "Sí" : "No") : String(row[col] ?? "—")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEdit(row)}
                    aria-label="Editar"
                    className="focus-ring mr-2 rounded-lg p-2 hover:bg-brand-500/10"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(row.id as string)}
                    aria-label="Eliminar"
                    className="focus-ring rounded-lg p-2 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>

      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <GlassCard className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing.id ? "Editar" : "Añadir"}</h2>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Cerrar"
                className="focus-ring rounded-lg p-1 hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="mb-1 block text-sm font-medium">
                    {field.label}
                  </label>
                  {field.type === "textarea" && (
                    <textarea
                      id={field.name}
                      rows={4}
                      required={field.required}
                      value={(editing[field.name] as string) ?? ""}
                      onChange={(e) => setEditing({ ...editing, [field.name]: e.target.value })}
                      className="focus-ring glass-panel w-full rounded-xl px-4 py-2"
                    />
                  )}
                  {field.type === "checkbox" && (
                    <input
                      id={field.name}
                      type="checkbox"
                      checked={Boolean(editing[field.name])}
                      onChange={(e) => setEditing({ ...editing, [field.name]: e.target.checked })}
                      className="h-5 w-5"
                    />
                  )}
                  {field.type === "select" && (
                    <select
                      id={field.name}
                      required={field.required}
                      value={(editing[field.name] as string) ?? ""}
                      onChange={(e) => setEditing({ ...editing, [field.name]: e.target.value })}
                      className="focus-ring glass-panel w-full rounded-xl px-4 py-2"
                    >
                      <option value="" disabled>
                        Selecciona...
                      </option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {["text", "number", "url"].includes(field.type) && (
                    <input
                      id={field.name}
                      type={field.type === "url" ? "text" : field.type}
                      required={field.required}
                      value={(editing[field.name] as string | number) ?? ""}
                      onChange={(e) => setEditing({ ...editing, [field.name]: e.target.value })}
                      className="focus-ring glass-panel w-full rounded-xl px-4 py-2"
                    />
                  )}
                </div>
              ))}
              <GlassButton type="submit" className="w-full">
                Guardar
              </GlassButton>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
