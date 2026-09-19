"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AdminTopBar } from "@/components/admin/AdminSidebar";
import {
  MapPin, Plus, Pencil, Trash2, Search,
  X, Upload, Star, Clock,
  Users, DollarSign, Image as ImageIcon, Check, AlertTriangle, Eye, EyeOff
} from "lucide-react";

type Tour = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  duration: string;
  groupSize: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge: string;
  badgeColor: string;
  isActive: boolean;
  createdAt: string;
};

const EMPTY_FORM = {
  slug: "",
  name: "",
  category: "",
  tagline: "",
  description: "",
  longDescription: "",
  duration: "",
  groupSize: "",
  price: 0,
  priceGroup: 0,
  badge: "",
  badgeColor: "bg-slate-700",
  meetingPoint: "Hotel Karim lobby",
  cancellation: "Free cancellation up to 24 hours before departure",
  includes: "",
  excludes: "",
  highlights: "",
  languages: "English, French, Arabic",
  departureTimes: "08:00 AM",
};

type FormState = typeof EMPTY_FORM;

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filtered, setFiltered] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  // Image upload
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedImagePublicId, setUploadedImagePublicId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Confirm delete
  const [deleteTarget, setDeleteTarget] = useState<Tour | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Saving
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tours/all"); // admin route: fetch all including inactive
      const data = await res.json();
      setTours(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load tours", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTours(); }, [fetchTours]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(tours); return; }
    const q = search.toLowerCase();
    setFiltered(tours.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q)
    ));
  }, [search, tours]);

  const openCreate = () => {
    setEditTour(null);
    setForm(EMPTY_FORM);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setUploadedImagePublicId(null);
    setModalOpen(true);
  };

  const openEdit = (tour: Tour) => {
    setEditTour(tour);
    setForm({
      slug: tour.slug,
      name: tour.name,
      category: tour.category,
      tagline: tour.tagline,
      description: tour.description,
      longDescription: (tour as any).longDescription || "",
      duration: tour.duration,
      groupSize: tour.groupSize,
      price: tour.price,
      priceGroup: (tour as any).priceGroup || 0,
      badge: tour.badge,
      badgeColor: tour.badgeColor,
      meetingPoint: (tour as any).meetingPoint || "Hotel Karim lobby",
      cancellation: (tour as any).cancellation || "Free cancellation up to 24 hours before departure",
      includes: ((tour as any).includes || []).join(", "),
      excludes: ((tour as any).excludes || []).join(", "),
      highlights: ((tour as any).highlights || []).join(", "),
      languages: ((tour as any).languages || []).join(", "),
      departureTimes: ((tour as any).departureTimes || []).join(", "),
    });
    setImagePreview(tour.image);
    setUploadedImageUrl(null);
    setUploadedImagePublicId(null);
    setModalOpen(true);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setImageUploading(true);
      try {
        const res = await fetch("/api/tours/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64 }),
        });
        const data = await res.json();
        if (data.url) {
          setUploadedImageUrl(data.url);
          setUploadedImagePublicId(data.publicId);
          showToast("Image uploaded to Cloudinary!");
        } else {
          showToast("Image upload failed", "error");
        }
      } catch {
        showToast("Image upload failed", "error");
      } finally {
        setImageUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      showToast("Name and slug are required", "error");
      return;
    }
    setSaving(true);
    try {
      const finalImage = uploadedImageUrl || (editTour?.image ?? "/hero-sidi-bou-said.jpg");
      const finalPublicId = uploadedImagePublicId || (editTour as any)?.imagePublicId || null;

      const payload = {
        ...form,
        price: Number(form.price),
        priceGroup: Number(form.priceGroup),
        image: finalImage,
        imagePublicId: finalPublicId,
        includes: form.includes.split(",").map(s => s.trim()).filter(Boolean),
        excludes: form.excludes.split(",").map(s => s.trim()).filter(Boolean),
        highlights: form.highlights.split(",").map(s => s.trim()).filter(Boolean),
        languages: form.languages.split(",").map(s => s.trim()).filter(Boolean),
        departureTimes: form.departureTimes.split(",").map(s => s.trim()).filter(Boolean),
      };

      const url = editTour ? `/api/tours/${editTour._id}` : "/api/tours";
      const method = editTour ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      showToast(editTour ? "Tour updated!" : "Tour created!");
      setModalOpen(false);
      fetchTours();
    } catch (err: any) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (tour: Tour) => {
    try {
      await fetch(`/api/tours/${tour._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !tour.isActive }),
      });
      showToast(`Tour ${tour.isActive ? "hidden" : "published"}!`);
      fetchTours();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/tours/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Tour deleted.");
      setDeleteTarget(null);
      fetchTours();
    } catch {
      showToast("Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminTopBar title="Excursions Manager" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-xl font-medium text-white text-sm flex items-center gap-2 transition-all ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {toast.type === "error" ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-[#0F4C81]" /> Excursions & Tours
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">{tours.length} tours in database</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81] hover:bg-[#1a6bb5] text-white text-sm font-bold rounded-xl transition shadow-md"
            >
              <Plus className="w-4 h-4" /> New Excursion
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, category, or slug..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none transition dark:text-white"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading tours...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p className="font-medium">No tours found.</p>
            <p className="text-sm mt-1">Click "Seed DB" to add the default tours, or create a new one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(tour => (
              <div key={tour._id} className={`bg-white dark:bg-slate-800 rounded-2xl border overflow-hidden shadow-sm transition-all hover:shadow-md ${tour.isActive ? "border-slate-200 dark:border-slate-700" : "border-amber-300 dark:border-amber-600 opacity-70"}`}>
                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {tour.badge && (
                    <span className={`absolute top-3 left-3 text-xs font-bold text-white px-2.5 py-1 rounded-full ${tour.badgeColor}`}>
                      {tour.badge}
                    </span>
                  )}
                  {!tour.isActive && (
                    <span className="absolute top-3 right-3 text-xs font-bold text-white bg-amber-500 px-2.5 py-1 rounded-full">
                      Hidden
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  <p className="text-xs text-[#0F4C81] dark:text-blue-400 font-semibold uppercase tracking-wider mb-1">{tour.category}</p>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base mb-1">{tour.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{tour.tagline}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{tour.duration}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{tour.price > 0 ? `€${tour.price}` : "Custom"}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />{tour.rating}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(tour)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-700 hover:bg-[#0F4C81] hover:text-white text-slate-700 dark:text-slate-200 rounded-lg transition"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(tour)}
                      title={tour.isActive ? "Hide from website" : "Publish to website"}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 hover:text-amber-700 text-slate-700 dark:text-slate-200 rounded-lg transition"
                    >
                      {tour.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(tour)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-700 hover:bg-red-100 hover:text-red-600 text-slate-700 dark:text-slate-200 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- CREATE / EDIT MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {editTour ? `Edit: ${editTour.name}` : "Create New Excursion"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto p-6 space-y-5">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cover Image</label>
                <div
                  className="relative w-full h-40 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-600 cursor-pointer hover:border-[#0F4C81] transition group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <ImageIcon className="w-10 h-10 mb-2" />
                      <p className="text-sm">Click to upload image</p>
                    </div>
                  )}
                  {imageUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                {uploadedImageUrl && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> Uploaded to Cloudinary</p>
                )}
              </div>

              {/* Basic fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "name", label: "Tour Name", placeholder: "e.g. Sidi Bou Said & Carthage" },
                  { key: "slug", label: "Slug (URL)", placeholder: "e.g. sidi-bou-said-carthage" },
                  { key: "category", label: "Category", placeholder: "e.g. Historical Day Trip" },
                  { key: "duration", label: "Duration", placeholder: "e.g. Full Day (8–9 hours)" },
                  { key: "groupSize", label: "Group Size", placeholder: "e.g. Up to 12 people" },
                  { key: "badge", label: "Badge Text", placeholder: "e.g. Most Popular" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</label>
                    <input
                      type="text"
                      value={(form as any)[key]}
                      onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none transition"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Price per person (€)</label>
                  <input type="number" min="0" value={form.price} onChange={e => setForm(prev => ({ ...prev, price: Number(e.target.value) }))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Price per group (€)</label>
                  <input type="number" min="0" value={form.priceGroup} onChange={e => setForm(prev => ({ ...prev, priceGroup: Number(e.target.value) }))} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none transition" />
                </div>
              </div>

              {/* Text areas */}
              {[
                { key: "tagline", label: "Tagline", rows: 2 },
                { key: "description", label: "Short Description", rows: 3 },
                { key: "longDescription", label: "Long Description", rows: 5 },
              ].map(({ key, label, rows }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</label>
                  <textarea
                    rows={rows}
                    value={(form as any)[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none resize-none transition"
                  />
                </div>
              ))}

              {/* Comma-separated fields */}
              <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-3 py-2 rounded-lg">
                Tip: Enter the fields below separated by commas (e.g. "English, French, Arabic")
              </p>
              {[
                { key: "includes", label: "What's Included" },
                { key: "excludes", label: "Not Included" },
                { key: "highlights", label: "Highlights" },
                { key: "languages", label: "Languages" },
                { key: "departureTimes", label: "Departure Times" },
                { key: "meetingPoint", label: "Meeting Point" },
                { key: "cancellation", label: "Cancellation Policy" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</label>
                  <textarea
                    rows={2}
                    value={(form as any)[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none resize-none transition"
                  />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex gap-3 justify-end">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 transition">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || imageUploading}
                className="px-6 py-2 bg-[#0F4C81] hover:bg-[#1a6bb5] text-white text-sm font-bold rounded-xl transition shadow-md disabled:opacity-50"
              >
                {saving ? "Saving..." : editTour ? "Save Changes" : "Create Excursion"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRM --- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white text-center mb-2">Delete Excursion?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
              "<strong>{deleteTarget.name}</strong>" will be permanently removed from the database and its image deleted from Cloudinary.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition disabled:opacity-50">
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
