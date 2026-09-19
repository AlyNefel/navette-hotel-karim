"use client";

import { useState } from "react";
import { Gift, Phone, Clock, Trophy, Hash, Users, Plus, Pencil, Trash2, Check, AlertTriangle, Eye, EyeOff } from "lucide-react";
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
  isGrandPrize: boolean;
  isActive: boolean;
};

const EMPTY_GIFT = {
  name: "",
  icon: "🎁",
  color: "#3B82F6",
  isGrandPrize: false,
};

export default function GiftsDashboard({ initialGifts }: { initialGifts: GiftItem[] }) {
  const [gifts, setGifts] = useState<GiftItem[]>(initialGifts);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editGift, setEditGift] = useState<GiftItem | null>(null);
  const [form, setForm] = useState(EMPTY_GIFT);
  const [saving, setSaving] = useState(false);

  // Delete Confirm
  const [deleteTarget, setDeleteTarget] = useState<GiftItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchGifts = async () => {
    try {
      const res = await fetch("/api/gifts");
      const data = await res.json();
      if (Array.isArray(data)) setGifts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openCreate = () => {
    setEditGift(null);
    setForm(EMPTY_GIFT);
    setModalOpen(true);
  };

  const openEdit = (g: GiftItem) => {
    setEditGift(g);
    setForm({ name: g.name, icon: g.icon, color: g.color, isGrandPrize: g.isGrandPrize });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.icon) {
      showToast("Name and Icon are required", "error");
      return;
    }
    setSaving(true);
    try {
      const url = editGift ? `/api/gifts/${editGift._id}` : "/api/gifts";
      const method = editGift ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      showToast(editGift ? "Gift updated!" : "Gift created!");
      setModalOpen(false);
      fetchGifts();
    } catch {
      showToast("Failed to save gift", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (g: GiftItem) => {
    try {
      await fetch(`/api/gifts/${g._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !g.isActive }),
      });
      showToast(`Gift ${g.isActive ? "hidden" : "published"}`);
      fetchGifts();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/gifts/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Gift deleted");
      setDeleteTarget(null);
      fetchGifts();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-900">
      <AdminTopBar title="Roulette Dashboard" />

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl font-medium text-white text-sm flex items-center gap-2 transition-all ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.type === "error" ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Gift className="w-6 h-6 text-[#0F4C81]" /> Lucky Spin System
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage roulette settings, prizes, and winners.</p>
          </div>
        </div>
        {/* Removed Participants Tab */}

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-end">
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81] hover:bg-[#1a6bb5] text-white text-sm font-bold rounded-xl transition shadow-md"
              >
                <Plus className="w-4 h-4" /> New Prize
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gifts.map((g) => (
                <div key={g._id} className={`bg-white dark:bg-slate-800 border rounded-2xl p-5 shadow-sm transition-all ${g.isActive ? "border-slate-200 dark:border-slate-700" : "border-amber-300 opacity-70"}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-white/20 overflow-hidden" style={{ backgroundColor: g.color }}>
                      {g.icon.startsWith('/') ? <img src={g.icon} alt={g.name} className="w-full h-full object-cover" /> : g.icon}
                    </div>
                    {g.isGrandPrize && (
                      <span className="bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Grand Prize
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{g.name}</h3>
                  <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => openEdit(g)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-700 hover:bg-[#0F4C81] hover:text-white text-slate-700 dark:text-slate-200 rounded-lg transition"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(g)}
                      title={g.isActive ? "Hide from wheel" : "Add to wheel"}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 hover:text-amber-700 text-slate-700 dark:text-slate-200 rounded-lg transition"
                    >
                      {g.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(g)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-700 hover:bg-red-100 hover:text-red-600 text-slate-700 dark:text-slate-200 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{editGift ? "Edit Prize" : "New Prize"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <Check className="w-5 h-5 opacity-0" /> {/* Spacer */}
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prize Name</label>
                <input 
                  type="text" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  placeholder="e.g. Free Massage"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-[#0F4C81] dark:text-white"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Emoji Icon</label>
                  <input 
                    type="text" 
                    value={form.icon} 
                    onChange={e => setForm({...form, icon: e.target.value})} 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-[#0F4C81] text-2xl text-center dark:text-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Wheel Color</label>
                  <input 
                    type="color" 
                    value={form.color} 
                    onChange={e => setForm({...form, color: e.target.value})} 
                    className="w-full h-[52px] cursor-pointer rounded-xl border-none outline-none"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input 
                  type="checkbox" 
                  checked={form.isGrandPrize} 
                  onChange={e => setForm({...form, isGrandPrize: e.target.checked})} 
                  className="w-5 h-5 rounded text-[#0F4C81] focus:ring-[#0F4C81]"
                />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">This is a Grand Prize</span>
              </label>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">Cancel</button>
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
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Delete Prize?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">"{deleteTarget.name}" will be removed from the roulette wheel immediately.</p>
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
