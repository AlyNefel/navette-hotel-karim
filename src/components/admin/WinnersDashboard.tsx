"use client";

import { useState } from "react";
import { Users, Phone, Clock, Hash, Check, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { AdminTopBar } from "@/components/admin/AdminSidebar";

type Participant = {
  _id: string;
  name: string;
  phone: string;
  prizeWon: string;
  createdAt: string;
};

type GiftItem = {
  _id: string;
  name: string;
  icon: string;
  color: string;
};

export default function WinnersDashboard({ initialParticipants, gifts }: { initialParticipants: Participant[], gifts: GiftItem[] }) {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Participant | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", prizeWon: "" });
  const [saving, setSaving] = useState(false);

  // Delete Confirm
  const [deleteTarget, setDeleteTarget] = useState<Participant | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchParticipants = async () => {
    try {
      const res = await fetch("/api/roulette/participants");
      const data = await res.json();
      if (Array.isArray(data)) setParticipants(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (p: Participant) => {
    setEditTarget(p);
    setForm({ name: p.name, phone: p.phone, prizeWon: p.prizeWon });
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      showToast("Name and Phone are required", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/roulette/participants/${editTarget!._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      showToast("Winner updated!");
      setEditModalOpen(false);
      fetchParticipants();
    } catch {
      showToast("Failed to update winner", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/roulette/participants/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Winner deleted");
      setDeleteTarget(null);
      fetchParticipants();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-900">
      <AdminTopBar title="Winners Management" />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl font-medium text-white text-sm flex items-center gap-2 transition-all ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.type === "error" ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-[#0F4C81]" /> Winners List
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage roulette winners, update phone numbers or delete records.</p>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Total Winners: {participants.length}</h3>
          </div>

          {participants.length === 0 ? (
            <div className="p-16 text-center text-slate-400">
              <Users className="w-14 h-14 text-slate-200 dark:text-slate-600 mx-auto mb-4" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">No winners found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Prize Won</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {participants.map((p, idx) => {
                    const prize = gifts.find(g => g._id === p.prizeWon);
                    return (
                      <tr key={p._id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-6 py-4 text-slate-400 font-medium text-xs">{participants.length - idx}</td>
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{p.name}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          <a href={`tel:${p.phone}`} className="flex items-center gap-1.5 hover:text-[#0F4C81] dark:hover:text-blue-400 transition-colors">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {p.phone}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          {prize ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${prize.color}20`, color: prize.color, border: `1px solid ${prize.color}40` }}>
                              {prize.icon.startsWith('/') ? <img src={prize.icon} alt={prize.name} className="w-4 h-4 object-cover rounded-sm" /> : prize.icon}
                              {prize.name}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Unknown Prize</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(p.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              className="p-2 text-slate-400 hover:text-[#0F4C81] transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(p)}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* EDIT MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Edit Winner</h2>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <Check className="w-5 h-5 opacity-0" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-[#0F4C81] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={form.phone} 
                  onChange={e => setForm({...form, phone: e.target.value})} 
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-[#0F4C81] dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prize Won</label>
                <select
                  value={form.prizeWon}
                  onChange={e => setForm({...form, prizeWon: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-[#0F4C81] dark:text-white"
                >
                  {gifts.map(g => (
                    <option key={g._id} value={g._id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
              <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#0F4C81] text-white text-sm font-bold rounded-xl hover:bg-[#1a6bb5] transition">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Delete Winner?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">"{deleteTarget.name}" will be removed completely.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border rounded-xl">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2 bg-red-500 text-white font-bold rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
