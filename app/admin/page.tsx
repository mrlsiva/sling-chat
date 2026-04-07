import { supabase, type Lead } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Failed to load leads: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin — Leads</h1>
        <p className="text-gray-500 text-sm mt-1">
          {leads?.length ?? 0} lead{leads?.length !== 1 ? "s" : ""} captured
        </p>
      </div>

      {!leads || leads.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No leads yet.</div>
      ) : (
        <div className="space-y-4">
          {(leads as Lead[]).map((lead) => (
            <div
              key={lead.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-gray-800 text-lg">{lead.name}</p>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                  {lead.phone && (
                    <p className="text-sm text-gray-500">{lead.phone}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {lead.created_at
                    ? new Date(lead.created_at).toLocaleString()
                    : ""}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {lead.situation_type && (
                  <Tag label="Situation" value={lead.situation_type} />
                )}
                {lead.key_problem && (
                  <Tag label="Problem" value={lead.key_problem} />
                )}
                {lead.urgency_level && (
                  <Tag label="Urgency" value={lead.urgency_level} />
                )}
                {lead.user_intent && (
                  <Tag label="Intent" value={lead.user_intent} />
                )}
                {lead.additional_notes && (
                  <div className="col-span-full">
                    <Tag label="Notes" value={lead.additional_notes} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-gray-700 mt-0.5">{value}</p>
    </div>
  );
}
