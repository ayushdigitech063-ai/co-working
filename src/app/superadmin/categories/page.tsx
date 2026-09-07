"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { showSuccessAlert, showErrorAlert } from "@/utils/swal";
import { Layers, Plus, Upload, Trash2, Loader2, CheckCircle2, Building2, Image as ImageIcon } from "lucide-react";

export default function SuperAdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    api.get("/workspace-types")
      .then((res) => {
        const data = res.data.data;
        if (Array.isArray(data)) setCategories(data);
        else setCategories([]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, imageUrl: res.data.url }));
      showSuccessAlert("Image Uploaded! 📸", "Category banner image attached.");
    } catch (err: any) {
      showErrorAlert("Upload Failed", err?.response?.data?.message || "Failed to upload category image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSubmitting(true);
    try {
      await api.post("/workspace-types", form);
      showSuccessAlert("Category Published! 🎉", "New Workspace Category is now live on the homepage.");
      setForm({ name: "", description: "", imageUrl: "" });
      fetchCategories();
      setIsModalOpen(false);
    } catch (err: any) {
      showErrorAlert("Creation Failed", err?.response?.data?.message || "Failed to create category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/workspace-types/${id}`);
      showSuccessAlert("Category Deleted", "Removed from database.");
      fetchCategories();
    } catch (err: any) {
      showErrorAlert("Delete Failed", err?.response?.data?.message || "Failed to delete category.");
    }
  };

  return (
    <div className="space-y-8 w-full font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 font-mono">HOMEPAGE CATEGORIES</span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">Workspace Solutions &amp; Categories</h1>
          <p className="text-xs text-slate-500 mt-1">Manage live homepage categories with Cloudinary images &amp; descriptions.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          + Add New Category
        </button>
      </div>

      {/* CATEGORIES GRID */}
      {loading ? (
        <div className="py-24 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
          Loading Live Categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-800">No Categories Added Yet</h3>
          <p className="text-xs text-slate-400 mt-1">Click '+ Add New Category' to publish your first live workspace solution.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={cat.imageUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="p-2 rounded-xl bg-black/60 text-rose-400 hover:bg-rose-600 hover:text-white transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-lg text-slate-900 font-serif">{cat.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{cat.description || "Flexible seating and private spaces."}</p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px] font-bold text-amber-600">
                <span>● Live On Homepage</span>
                <span className="text-slate-400 font-normal">Updated Live</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest font-mono">HOMEPAGE MANAGED CATEGORY</span>
                <h3 className="text-xl font-serif font-bold mt-0.5">Add Workspace Category</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Dedicated Desk, Executive Cabin, Virtual Office"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Short Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Flexible seating and premium workspace amenities."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* CLOUDINARY CATEGORY IMAGE UPLOAD */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Card Image (Cloudinary)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2">
                    <Upload className="w-4 h-4 text-amber-400" />
                    {uploadingImage ? "Uploading..." : "Upload Category Image"}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {form.imageUrl && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Banner Ready
                    </span>
                  )}
                </div>
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Category Banner" className="mt-2 h-28 w-full object-cover rounded-xl border border-slate-200" />
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <Plus className="w-4 h-4 text-amber-400" />}
                Publish Category Live
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
