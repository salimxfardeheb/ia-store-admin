"use client";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronDown,
  ArrowUpDown,
  Package,
} from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import ProductModel from "../components/ProductModel";
import {
  INITIAL_PRODUCTS,
  Product,
  STATUS_STYLE,
  STATUSES,
  CATEGORIES,
} from "../variables";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [sortKey, setSortKey] = useState<keyof Product>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [categories, setCategories] = useState(CATEGORIES);
  const [editProduct, setEditProduct] = useState<Product | null | undefined>(
    undefined,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [view, setView] = useState<"table" | "grid">("table");

  // Filter + sort
  const filtered = products
    .filter(
      (p) =>
        (categoryFilter === "Tous" || p.category === categoryFilter) &&
        (statusFilter === "Tous" || p.status === statusFilter) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.id.toLowerCase().includes(search.toLowerCase())),
    )
    .sort((a, b) => {
      const av = a[sortKey],
        bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv), undefined, {
        numeric: true,
      });
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleSort = (key: keyof Product) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
  const handleSave = async (product: Product) => {
    try {
      const docRef = await addDoc(collection(db, "products"), product);
      setProducts((prev) => [...prev, { ...product, id: docRef.id }]);
      setEditProduct(undefined);
    } catch (err) {
      console.error("Erreur Firebase :", err);
    }
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "Actif").length,
    outStock: products.filter((p) => p.stock === 0).length,
    draft: products.filter((p) => p.status === "Brouillon").length,
  };

  return (
    <>
      <AdminHeader title="Catalogue" subtitle="Gestion des produits" />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        {[
          { label: "Total produits", value: stats.total },
          { label: "Actifs", value: stats.active },
          { label: "Hors stock", value: stats.outStock },
          { label: "Brouillons", value: stats.draft },
        ].map(({ label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border px-5 py-4 border-[rgba(0,0,0,0.08)] "
          >
            <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 mb-2 font-serif">
              {label}
            </p>
            <p className="text-2xl text-black font-serif font-light italic">
              {value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border mb-4 border-[rgba(0,0,0,0.08)] ">
        <div className="flex flex-wrap items-center gap-3 p-4">
          {/* Search */}
          <div className="relative flex-1 min-w-50">
            <Search
              size={13}
              strokeWidth={1.5}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full border bg-[#F7F7F7] text-[11px] py-2.5 pl-9 pr-4 focus:outline-none focus:border-black/30 transition-colors font-serif border-[rgba(0,0,0,0.08)] "
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border bg-white text-[10px] uppercase tracking-widest py-2.5 pl-3 pr-8 focus:outline-none appearance-none hover:border-black/25 transition-colors font-serif border-[rgba(0,0,0,0.08)] "
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <ChevronDown
              size={10}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black/30"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border bg-white text-[10px] uppercase tracking-widest py-2.5 pl-3 pr-8 focus:outline-none appearance-none hover:border-black/25 transition-colors font-serif border-[rgba(0,0,0,0.08)] "
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown
              size={10}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black/30"
            />
          </div>

          {/* View toggle */}
          <div className="flex border border-[rgba(0,0,0,0.08)] ">
            {(["table", "grid"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2.5 text-[8px] uppercase tracking-widest transition-colors font-serif ${
                  view === v
                    ? "bg-black text-white"
                    : "text-black/35 hover:bg-black/4"
                }`}
              >
                {v === "table" ? "Liste" : "Grille"}
              </button>
            ))}
          </div>

          {/* Add */}
          <button
            onClick={() => setEditProduct(null)}
            className="flex items-center space-x-2 bg-black text-white px-5 py-2.5 text-[9px] uppercase tracking-widest hover:bg-black/80 transition-colors ml-auto font-serif "
          >
            <Plus size={13} strokeWidth={1.5} />
            <span>Nouveau produit</span>
          </button>
        </div>

        {/* Results count */}
        <div className="px-4 py-2 border-t border-[rgba(0,0,0,0.08)] ">
          <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 font-serif">
            {filtered.length} produit{filtered.length !== 1 ? "s" : ""}
            {search && ` · "${search}"`}
          </p>
        </div>
      </div>

      {/* Table view */}
      <AnimatePresence mode="wait">
        {view === "table" && (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border overflow-hidden border-[rgba(0,0,0,0.08)] "
          >
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[rgba(0,0,0,0.08)] ">
                  {[
                    { key: "id", label: "Réf." },
                    { key: "name", label: "Produit" },
                    { key: "category", label: "Catégorie" },
                    { key: "price", label: "Prix" },
                    { key: "stock", label: "Stock" },
                    { key: "status", label: "Statut" },
                    { key: "createdAt", label: "Ajouté le" },
                    { key: null, label: "" },
                  ].map(({ key, label }) => (
                    <th
                      key={label}
                      className="px-5 py-3 font-normal font-serif"
                    >
                      {key ? (
                        <button
                          onClick={() => handleSort(key as keyof Product)}
                          className="flex items-center space-x-1.5 text-[8px] uppercase tracking-[0.25em] text-black/35 hover:text-black transition-colors font-serif"
                        >
                          <span>{label}</span>
                          <ArrowUpDown
                            size={9}
                            strokeWidth={1.5}
                            className={
                              sortKey === key
                                ? "opacity-100 text-black"
                                : "opacity-30"
                            }
                          />
                        </button>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b group hover:bg-black/[0.018] transition-colors border-[rgba(0,0,0,0.08)] "
                    >
                      <td className="px-5 py-3.5 text-[9px] text-black/35 font-serif">
                        {product.id}
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-[11px] text-black font-serif">
                            {product.name}
                          </p>
                          <p className="text-[8px] text-black/30 mt-0.5 font-serif">
                            {product.sizes.join(" · ")}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[9px] text-black/50 uppercase tracking-widest font-serif">
                        {product.category}
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-black font-serif italic">
                        {product.price.toLocaleString("fr-FR")} €
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[11px] font-serif ${product.stock === 0 ? "text-black font-bold" : "text-black/60"}`}
                        >
                          {product.stock === 0 ? "Épuisé" : product.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 text-[7px] uppercase tracking-widest font-serif ${STATUS_STYLE[product.status]}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[9px] text-black/30 font-serif">
                        {product.createdAt}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditProduct(product)}
                            className="p-1.5 text-black/25 hover:text-black hover:bg-black/6 transition-colors"
                            title="Modifier"
                          >
                            <Edit2 size={12} strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="p-1.5 text-black/25 hover:text-black hover:bg-black/6 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={12} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package
                  size={28}
                  strokeWidth={1}
                  className="text-black/15 mb-4"
                />
                <p className="text-sm text-black/30 font-serif italic">
                  Aucun produit trouvé
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Grid view */}
        {view === "grid" && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white border group relative overflow-hidden border-[rgba(0,0,0,0.08)] "
              >
                {/* Placeholder image */}
                <div className="h-48 bg-[#F2F0ED] flex items-center justify-center relative overflow-hidden">
                  <Package
                    size={32}
                    strokeWidth={0.75}
                    className="text-black/10"
                  />
                  {product.stock === 0 && (
                    <div className="absolute top-3 left-3 bg-black text-white text-[7px] uppercase tracking-widest px-2 py-0.5 font-serif">
                      Épuisé
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[7px] uppercase tracking-widest px-2 py-0.5 font-serif ${STATUS_STYLE[product.status]}`}
                    >
                      {product.status}
                    </span>
                  </div>
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setEditProduct(product)}
                      className="p-2 bg-white hover:bg-black hover:text-white transition-colors"
                    >
                      <Edit2 size={13} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setDeleteId(product.id)}
                      className="p-2 bg-white hover:bg-black hover:text-white transition-colors"
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-[8px] uppercase tracking-[0.3em] text-black/25 mb-1 font-serif">
                    {product.id}
                  </p>
                  <h3 className="text-[11px] text-black leading-snug mb-2 font-serif">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-base text-black font-serif italic font-light">
                      {product.price.toLocaleString("fr-FR")} €
                    </span>
                    <span className="text-[8px] uppercase tracking-widest text-black/30 font-serif">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {product.sizes.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="text-[7px] px-1.5 py-0.5 border border-black/10 text-black/40 uppercase tracking-widest font-serif"
                      >
                        {s}
                      </span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="text-[7px] px-1.5 py-0.5 border border-black/10 text-black/30 uppercase tracking-widest font-serif">
                        +{product.sizes.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add new card */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setEditProduct(null)}
              className="border-2 border-dashed border-black/10 h-full min-h-70 flex flex-col items-center justify-center text-black/20 hover:border-black/30 hover:text-black/40 transition-all"
            >
              <Plus size={24} strokeWidth={1} className="mb-2" />
              <span className="text-[8px] uppercase tracking-[0.3em] font-serif">
                Ajouter
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white w-full max-w-sm mx-4 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-5">
                <Trash2 size={16} strokeWidth={1.5} className="text-black" />
                <h3 className="text-lg text-black font-serif italic font-light">
                  Supprimer le produit ?
                </h3>
              </div>
              <p className="text-[11px] text-black/40 mb-7 leading-relaxed font-serif">
                Cette action est irréversible. Le produit{" "}
                <strong className="text-black">{deleteId}</strong> sera
                définitivement supprimé du catalogue.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 border text-[9px] uppercase tracking-widest text-black/50 hover:text-black transition-colors border-[rgba(0,0,0,0.08)]  font-serif"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 bg-black text-white text-[9px] uppercase tracking-widest hover:bg-black/80 transition-colors font-serif"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit modal */}
      <AnimatePresence>
        {editProduct !== undefined && (
          <ProductModel
            product={editProduct}
            onClose={() => setEditProduct(undefined)}
            onSave={handleSave}
            categories={categories}
            onAddCategory={(newCat) => setCategories([...categories, newCat])}
          />
        )}
      </AnimatePresence>
    </>
  );
}
