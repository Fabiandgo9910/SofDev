"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/glass/glass-card";

type Lead = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: "new" | "contacted" | "archived";
  created_at: string;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    setLeads((data as Lead[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(id: string, status: Lead["status"]) {
    await supabase.from("contact_submissions").update({ status }).eq("id", id);
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Mensajes de contacto</h1>
      {loading && <p className="opacity-60">Cargando...</p>}
      <div className="space-y-4">
        {leads.map((lead) => (
          <GlassCard key={lead.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {lead.full_name} — <span className="opacity-70">{lead.email}</span>
                </p>
                {lead.company && <p className="text-sm opacity-70">{lead.company}</p>}
                {lead.phone && <p className="text-sm opacity-70">{lead.phone}</p>}
              </div>
              <select
                value={lead.status}
                onChange={(e) => updateStatus(lead.id, e.target.value as Lead["status"])}
                className="focus-ring glass-panel rounded-xl px-3 py-1 text-sm"
              >
                <option value="new">Nuevo</option>
                <option value="contacted">Contactado</option>
                <option value="archived">Archivado</option>
              </select>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm opacity-90">{lead.message}</p>
            <p className="mt-2 text-xs opacity-50">{new Date(lead.created_at).toLocaleString()}</p>
          </GlassCard>
        ))}
        {!loading && !leads.length && <p className="opacity-60">Todavía no hay mensajes.</p>}
      </div>
    </div>
  );
}
