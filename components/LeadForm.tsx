"use client";

import { useState } from "react";
import { supabase, type Lead } from "@/lib/supabase";

type Props = {
  extractedData: Record<string, string>;
  onSuccess: () => void;
};

export default function LeadForm({ extractedData, onSuccess }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const lead: Lead = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      situation_type: extractedData.situation_type || "",
      key_problem: extractedData.key_problem || "",
      urgency_level: extractedData.urgency_level || "",
      user_intent: extractedData.user_intent || "",
      additional_notes: extractedData.additional_notes || "",
    };

    const { error: dbError } = await supabase.from("leads").insert(lead);

    if (dbError) {
      setError("Failed to save. Please try again.");
      setLoading(false);
      return;
    }

    onSuccess();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        Let&apos;s stay in touch
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Enter your details and we&apos;ll follow up shortly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email address"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
