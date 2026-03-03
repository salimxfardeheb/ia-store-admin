"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, ChevronDown, Upload, ImagePlus } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/lib/firebase";
import {
  Product,
  SIZE_OPTIONS,
  SHOE_SIZE_OPTIONS,
  SizeEntry,
} from "../variables";

const totalStock = (sizes: SizeEntry[]) =>
  sizes.reduce((sum, s) => sum + s.quantity, 0);

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
  const [uploading, setUploading] = useState(false);
  const isNew = !product;

  // Image previews (local blobs avant upload)
  const [mainPreview, setMainPreview] = useState<string>(product?.mainImage ?? "");
  const [extraPreviews, setExtraPreviews] = useState<string[]>(product?.extraImages ?? []);

  // Fichiers en attente d'upload
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [extraFiles, setExtraFiles] = useState<File[]>([]);

  const mainInputRef = useRef<HTMLInputElement>(null);
  const extraInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Product>(
    product ?? {
      id: "",
      name: "",
      category: categories.find((c) => c !== "Tous") ?? "Costumes",
      price: 0,
      stock: 0,
      sizes: [],
      status: "Brouillon",
      createdAt: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      mainImage: "",
      extraImages: [],
    },
  );

  const toggleSize = (size: string) => {
    setForm((f) => {
      const exists = f.sizes.find((s) => s.size === size);
      const sizes = exists
        ? f.sizes.filter((s) => s.size !== size)
        : [...f.sizes, { size, quantity: 1 }];
      return { ...f, sizes, stock: totalStock(sizes) };
    });
  };

  const updateQuantity = (size: string, quantity: number) => {
    setForm((f) => {
      const sizes = f.sizes.map((s) =>
        s.size === size ? { ...s, quantity: Math.max(0, quantity) } : s,
      );
      return { ...f, sizes, stock: totalStock(sizes) };
    });
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    onAddCategory(trimmed);
    setForm({ ...form, category: trimmed });
    setNewCategoryInput("");
    setShowAddCategory(false);
  };

  // Upload une image vers Firebase Storage et retourne l'URL
  const uploadImage = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainFile(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleExtraImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    // Max 4 images supplémentaires
    const allowed = files.slice(0, 4 - extraFiles.length);
    setExtraFiles((prev) => [...prev, ...allowed]);
    setExtraPreviews((prev) => [
      ...prev,
      ...allowed.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeExtraImage = (index: number) => {
    setExtraFiles((prev) => prev.filter((_, i) => i !== index));
    setExtraPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!mainPreview) return; // image principale obligatoire
    setUploading(true);
    try {
      const timestamp = Date.now();

      // Upload image principale
      let mainImageUrl = form.mainImage;
      if (mainFile) {
        mainImageUrl = await uploadImage(
          mainFile,
          `products/${timestamp}_main_${mainFile.name}`,
        );
      }

      // Upload images supplémentaires
      const extraUrls: string[] = [...(form.extraImages ?? [])];
      for (let i = 0; i < extraFiles.length; i++) {
        const url = await uploadImage(
          extraFiles[i],
          `products/${timestamp}_extra_${i}_${extraFiles[i].name}`,
        );
        extraUrls.push(url);
      }

      onSave({ ...form, mainImage: mainImageUrl, extraImages: extraUrls });
    } catch (err) {
      console.error("Erreur upload :", err);
    } finally {
      setUploading(false);
    }
  };

  const sizeOptions =
    form.category === "Chaussures" ? SHOE_SIZE_OPTIONS : SIZE_OPTIONS;
  const selectedSizes = form.sizes.map((s) => s.size);

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
        className="bg-white w-full max-w-lg mx-4 relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[rgba(0,0,0,0.08)] shrink-0">
          <div>
            <h2 className="text-lg text-black font-serif italic font-light">
              {isNew ? "Nouveau produit" : "Modifier le produit"}
            </h2>
            <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 mt-0.5 font-serif">
              {form.id || "Nouveau"}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-black/5 transition-colors">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Form scrollable */}
        <div className="px-7 py-6 space-y-5 overflow-y-auto">

          {/* ── Images ─────────────────────────────────────────── */}
          <div>
            <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-3 font-serif">
              Images
            </label>

            <div className="flex gap-3">
              {/* Image principale */}
              <div className="flex-1">
                <p className="text-[8px] text-black/30 font-serif mb-1.5">
                  Principale <span className="text-black/50">*</span>
                </p>
                <button
                  type="button"
                  onClick={() => mainInputRef.current?.click()}
                  className={`w-full aspect-square border-2 border-dashed flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                    mainPreview
                      ? "border-transparent"
                      : "border-black/10 hover:border-black/30"
                  }`}
                >
                  {mainPreview ? (
                    <>
                      <img
                        src={mainPreview}
                        alt="main"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center">
                        <Upload size={16} className="text-white opacity-0 group-hover:opacity-100" strokeWidth={1.5} />
                      </div>
                    </>
                  ) : (
                    <>
                      <ImagePlus size={20} strokeWidth={1} className="text-black/20 mb-1" />
                      <span className="text-[8px] text-black/20 font-serif">Ajouter</span>
                    </>
                  )}
                </button>
                <input
                  ref={mainInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleMainImageChange}
                />
              </div>

              {/* Images supplémentaires */}
              <div className="flex-[2]">
                <p className="text-[8px] text-black/30 font-serif mb-1.5">
                  Supplémentaires <span className="text-black/25 italic">(max 4)</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {extraPreviews.map((src, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden border border-[rgba(0,0,0,0.08)]">
                      <img src={src} alt={`extra-${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExtraImage(i)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black p-0.5 transition-colors"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ))}

                  {extraPreviews.length < 4 && (
                    <button
                      type="button"
                      onClick={() => extraInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-black/10 hover:border-black/30 flex flex-col items-center justify-center transition-all"
                    >
                      <ImagePlus size={16} strokeWidth={1} className="text-black/20 mb-1" />
                      <span className="text-[8px] text-black/20 font-serif">Ajouter</span>
                    </button>
                  )}
                </div>
                <input
                  ref={extraInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleExtraImagesChange}
                />
              </div>
            </div>

            {!mainPreview && (
              <p className="mt-1.5 text-[8px] text-red-400/70 font-serif italic">
                L'image principale est obligatoire
              </p>
            )}
          </div>

          {/* ── Nom ────────────────────────────────────────────── */}
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

          {/* ── Category + Status ───────────────────────────────── */}
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
                      setForm({ ...form, category: e.target.value, sizes: [], stock: 0 });
                      setShowAddCategory(false);
                    }
                  }}
                  className="w-full border text-[11px] py-2.5 px-3 focus:outline-none focus:border-black appearance-none bg-[#F7F7F7] transition-colors font-serif border-[rgba(0,0,0,0.08)]"
                >
                  {categories.filter((c) => c !== "Tous").map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                  <option value="__add__">+ Ajouter une catégorie</option>
                </select>
                <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black/30" />
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
                  <button type="button" onClick={handleAddCategory}
                    className="px-3 py-2 bg-black text-white text-[9px] uppercase tracking-widest font-serif hover:bg-black/80 transition-all">
                    OK
                  </button>
                  <button type="button" onClick={() => { setShowAddCategory(false); setNewCategoryInput(""); }}
                    className="px-3 py-2 border text-[9px] text-black/40 font-serif border-[rgba(0,0,0,0.08)] hover:border-black/30 transition-all">
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
                  onChange={(e) => setForm({ ...form, status: e.target.value as Product["status"] })}
                  className="w-full border text-[11px] py-2.5 px-3 focus:outline-none focus:border-black appearance-none bg-[#F7F7F7] transition-colors font-serif border-[rgba(0,0,0,0.08)]"
                >
                  {["Actif", "Brouillon", "Archivé"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black/30" />
              </div>
            </div>
          </div>

          {/* ── Price + Stock ───────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-1.5 font-serif">
                Prix (DA)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full border text-[11px] py-2.5 px-3 focus:outline-none focus:border-black transition-colors bg-[#F7F7F7] border-[rgba(0,0,0,0.08)] font-serif"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-1.5 font-serif">
                Stock total
              </label>
              <div className="w-full border text-[11px] py-2.5 px-3 bg-[#F2F0ED] text-black/40 font-serif italic border-[rgba(0,0,0,0.08)] select-none">
                {form.stock} unité{form.stock !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* ── Sizes + quantities ──────────────────────────────── */}
          <div>
            <div className="flex items-baseline justify-between mb-3">
              <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 font-serif">
                Tailles & quantités
              </label>
              {selectedSizes.length > 0 && (
                <span className="text-[8px] text-black/25 font-serif italic">
                  {selectedSizes.length} taille{selectedSizes.length > 1 ? "s" : ""} sélectionnée{selectedSizes.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((s) => {
                const isSelected = !!form.sizes.find((e) => e.size === s);
                return (
                  <button key={s} type="button" onClick={() => toggleSize(s)}
                    className={`px-3 py-1.5 text-[9px] uppercase tracking-widest border transition-all font-serif ${
                      isSelected
                        ? "bg-black text-white border-black"
                        : "bg-white text-black/40 border-black/10 hover:border-black/30"
                    }`}>
                    {s}
                  </button>
                );
              })}
            </div>

            {form.sizes.length > 0 && (
              <div className="mt-4 border border-[rgba(0,0,0,0.08)] divide-y divide-[rgba(0,0,0,0.05)]">
                {form.sizes.map(({ size, quantity }) => (
                  <div key={size} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-[9px] uppercase tracking-widest text-black/60 font-serif w-10">{size}</span>
                    <div className="flex items-center gap-0">
                      <button type="button" onClick={() => updateQuantity(size, quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-black/30 hover:text-black hover:bg-black/5 transition-colors text-sm font-light">−</button>
                      <input type="number" min={0} value={quantity}
                        onChange={(e) => updateQuantity(size, Number(e.target.value))}
                        className="w-12 text-center text-[11px] font-serif border-x border-[rgba(0,0,0,0.08)] py-1.5 focus:outline-none bg-[#F7F7F7] focus:bg-white transition-colors" />
                      <button type="button" onClick={() => updateQuantity(size, quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-black/30 hover:text-black hover:bg-black/5 transition-colors text-sm font-light">+</button>
                    </div>
                    <span className="text-[8px] text-black/25 font-serif italic w-16 text-right">{quantity} unité{quantity !== 1 ? "s" : ""}</span>
                    <button type="button" onClick={() => toggleSize(size)}
                      className="ml-3 text-black/20 hover:text-black transition-colors">
                      <X size={11} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#F7F7F7]">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-black/30 font-serif">Total</span>
                  <span className="text-[11px] font-serif text-black italic">{form.stock} unité{form.stock !== 1 ? "s" : ""}</span>
                </div>
              </div>
            )}

            {form.sizes.length === 0 && (
              <p className="mt-3 text-[9px] text-black/20 font-serif italic">
                Sélectionnez les tailles disponibles ci-dessus.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t flex justify-end space-x-3 border-[rgba(0,0,0,0.08)] shrink-0">
          <button onClick={onClose}
            className="px-6 py-2.5 border text-[9px] uppercase tracking-widest text-black/50 hover:text-black hover:border-black/30 transition-all font-serif border-[rgba(0,0,0,0.08)]">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!mainPreview || uploading}
            className={`px-6 py-2.5 text-white text-[9px] uppercase tracking-widest transition-all font-serif ${
              !mainPreview || uploading
                ? "bg-black/30 cursor-not-allowed"
                : "bg-black hover:bg-black/80"
            }`}
          >
            {uploading ? "Envoi..." : isNew ? "Créer le produit" : "Enregistrer"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}