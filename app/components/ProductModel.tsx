"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import {
  INITIAL_PRODUCTS,
  Product,
  SIZE_OPTIONS,
  SHOE_SIZE_OPTIONS,
} from "../variables";

export default function ProductModel({
  product,
  onClose,
  onSave,
  categories,
  onAddCategory,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
  categories: string[];
  onAddCategory: (cat: string) => void;
}) {
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const isNew = !product;
  const [form, setForm] = useState<Product>(
    product ?? {
      id: `PRD-${String(INITIAL_PRODUCTS.length + 1).padStart(3, "0")}`,
      name: "",
      category: "Costumes",
      price: 0,
      stock: 0,
      sizes: [],
      status: "Brouillon",
      createdAt: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    },
  );

  const toggleSize = (s: string) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s)
        ? f.sizes.filter((x) => x !== s)
        : [...f.sizes, s],
    }));

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    onAddCategory(trimmed);
    setForm({ ...form, category: trimmed });
    setNewCategoryInput("");
    setShowAddCategory(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-lg mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b font-serif">
          <div>
            <h2 className="text-lg text-black font-serif italic font-light">
              {isNew ? "Nouveau produit" : "Modifier le produit"}
            </h2>
            <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 mt-0.5 font-serif">
              {form.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-black/5 transition-colors"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form */}
        <div className="px-7 py-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-1.5 font-serif">
              Nom du produit
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border text-sm py-2.5 px-3 focus:outline-none focus:border-black transition-colors bg-[#F7F7F7] font-serif border-[rgba(0,0,0,0.08)]"
              placeholder="Ex : Costume Trois-Pièces Laine Serge"
            />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-1.5 font-serif">
                Catégorie
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => {
                    if (e.target.value === "__add__") {
                      setShowAddCategory(true);
                    } else {
                      setForm({ ...form, category: e.target.value, sizes: [] });
                      setShowAddCategory(false);
                    }
                  }}
                  className="w-full border text-[11px] py-2.5 px-3 focus:outline-none focus:border-black appearance-none bg-[#F7F7F7] transition-colors font-serif border-[rgba(0,0,0,0.08)]"
                >
                  {categories
                    .filter((c) => c !== "Tous")
                    .map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  <option value="__add__">+ Ajouter une catégorie</option>
                </select>
                <ChevronDown
                  size={11}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black/30"
                />
              </div>

              {showAddCategory && (
                <div className="flex gap-2 mt-2">
                  <input
                    autoFocus
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                    placeholder="Nouvelle catégorie..."
                    className="flex-1 border text-[11px] py-2 px-3 focus:outline-none focus:border-black bg-[#F7F7F7] font-serif border-[rgba(0,0,0,0.08)]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-2 bg-black text-white text-[9px] uppercase tracking-widest font-serif hover:bg-black/80 transition-all"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCategory(false);
                      setNewCategoryInput("");
                    }}
                    className="px-3 py-2 border text-[9px] text-black/40 font-serif border-[rgba(0,0,0,0.08)] hover:border-black/30 transition-all"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-1.5 font-serif">
                Statut
              </label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as Product["status"],
                    })
                  }
                  className="w-full border text-[11px] py-2.5 px-3 focus:outline-none focus:border-black appearance-none bg-[#F7F7F7] transition-colors font-serif border-[rgba(0,0,0,0.08)]"
                >
                  {["Actif", "Brouillon", "Archivé"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown
                  size={11}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black/30"
                />
              </div>
            </div>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-1.5 font-serif">
                Prix (€)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="w-full border text-[11px] py-2.5 px-3 focus:outline-none focus:border-black transition-colors bg-[#F7F7F7] border-[rgba(0,0,0,0.08)] font-serif"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-1.5 font-serif">
                Stock
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
                className="w-full border text-[11px] py-2.5 px-3 focus:outline-none focus:border-black transition-colors bg-[#F7F7F7] font-serif border-[rgba(0,0,0,0.08)]"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-2 font-serif">
              Tailles disponibles
            </label>
            <div className="flex flex-wrap gap-2">
              {(form.category === "Chaussures"
                ? SHOE_SIZE_OPTIONS
                : SIZE_OPTIONS
              ).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`px-3 py-1.5 text-[9px] uppercase tracking-widest border transition-all font-serif ${
                    form.sizes.includes(s)
                      ? "bg-black text-white border-black"
                      : "bg-white text-black/40 border-black/10 hover:border-black/30"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t flex justify-end space-x-3 border-[rgba(0,0,0,0.08)]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border text-[9px] uppercase tracking-widest text-black/50 hover:text-black hover:border-black/30 transition-all font-serif border-[rgba(0,0,0,0.08)]"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-6 py-2.5 bg-black text-white text-[9px] uppercase tracking-widest hover:bg-black/80 transition-all font-serif"
          >
            {isNew ? "Créer le produit" : "Enregistrer"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}