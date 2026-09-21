"use client";

import { AdminTopBar } from "@/components/admin/AdminSidebar";
import { Settings, Key, Mail, Globe, Save } from "lucide-react";
import { useState } from "react";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col h-full">
      <AdminTopBar title="Settings" />
      <div className="p-6 space-y-6 max-w-3xl">

        {/* API Keys */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800">
            <Key className="w-5 h-5 text-[#E0A96D]" />
            <h2 className="text-white font-bold">API Keys & Credentials</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-slate-400 text-sm">
              These environment variables must be set in your <code className="bg-slate-800 text-[#E0A96D] px-1.5 py-0.5 rounded text-xs">.env.local</code> file.
            </p>

            {[
              { label: "Supabase URL", key: "NEXT_PUBLIC_SUPABASE_URL", desc: "Your Supabase project URL" },
              { label: "Supabase Anon Key", key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", desc: "For client-side access" },
              { label: "Supabase Service Key", key: "SUPABASE_SERVICE_ROLE_KEY", desc: "For server-side access (keep secret)" },
              { label: "Resend API Key", key: "RESEND_API_KEY", desc: "For sending confirmation emails" },
              { label: "Twilio Account SID", key: "TWILIO_ACCOUNT_SID", desc: "For WhatsApp forwarding" },
              { label: "Twilio Auth Token", key: "TWILIO_AUTH_TOKEN", desc: "Twilio authentication" },
              { label: "Twilio WhatsApp Number", key: "TWILIO_WHATSAPP_NUMBER", desc: "e.g. whatsapp:+14155238886" },
              { label: "Hotel WhatsApp", key: "HOTEL_OWNER_WHATSAPP", desc: "Your number: whatsapp:+21628580539" },
            ].map(({ label, key, desc }) => (
              <div key={key} className="space-y-1">
                <label className="text-slate-300 text-sm font-medium">{label}</label>
                <p className="text-slate-600 text-xs">{desc}</p>
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5">
                  <code className="text-[#E0A96D] text-xs flex-1">{key}=</code>
                  <span className="text-slate-600 text-xs">Set in .env.local</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800">
            <Globe className="w-5 h-5 text-[#E0A96D]" />
            <h2 className="text-white font-bold">Hotel Information</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: "Hotel Name", defaultValue: "Hotel Karim" },
              { label: "WhatsApp Number", defaultValue: "+21628580539" },
              { label: "Email", defaultValue: "info@hotelkarim.com" },
              { label: "Address", defaultValue: "Tunis, Tunisia" },
            ].map(({ label, defaultValue }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-slate-300 text-sm font-medium">{label}</label>
                <input
                  type="text"
                  defaultValue={defaultValue}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>
            ))}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#0F4C81] hover:bg-[#0F4C81]/80 text-white font-bold px-5 py-2.5 rounded-xl transition"
            >
              <Save className="w-4 h-4" />
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* .env.local Template */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-800">
            <Mail className="w-5 h-5 text-[#E0A96D]" />
            <h2 className="text-white font-bold">.env.local Template</h2>
          </div>
          <div className="p-6">
            <p className="text-slate-400 text-sm mb-4">Copy this template and fill in your values:</p>
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto leading-relaxed">
{`# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (Resend.com)
RESEND_API_KEY=re_xxxxxxxx

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
HOTEL_OWNER_WHATSAPP=whatsapp:+21628580539`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
