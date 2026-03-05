"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, ChevronDown, Trash2 } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import ProductModel from "../components/ProductModel";
import ProductTable from "../components/ProductTable";
import ProductGrid from "../components/ProductGrid";
import { Product, STATUSES } from "../variables";
import { addProduct } from "../firebase/addProduct";
import { updateProduct } from "../firebase/updateProduct";
import { getAllProducts, getCategories } from "../firebase/getProduct";
import { deleteProduct } from "../firebase/deleteProduct";

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [sortKey, setSortKey] = useState<keyof Product>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [categories, setCategories] = useState<string[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null | undefined>(
    undefined,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [view, setView] = useState<"table" | "grid">("table");
  

  // Fetch products from Firestore on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

    useEffect(() => {
    const getCategoriesProducts = async () => {
      setLoading(true);
      const data = await getCategories();
      setCategories(["Tous", ...data]);
      setLoading(false);
    };

    getCategoriesProducts();
  }, []);
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
    const isNew = !products.find((p) => p.id === product.id);
    try {
      if (isNew) {
        await addProduct(product);
        setProducts((prev) => [...prev, product]);
      } else {
        await updateProduct(product, product.id);
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? product : p)),
        );
      }
      setEditProduct(undefined);
    } catch (err) {
      console.error("Erreur Firebase :", err);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
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
            className="bg-white border px-5 py-4 border-[rgba(0,0,0,0.08)]"
          >
            <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 mb-2 font-serif">
              {label}
            </p>
            <p className="text-2xl text-black font-serif font-light italic">
              {loading ? "—" : value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border mb-4 border-[rgba(0,0,0,0.08)]">
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
              className="w-full border bg-[#F7F7F7] text-[11px] py-2.5 pl-9 pr-4 focus:outline-none focus:border-black/30 transition-colors font-serif border-[rgba(0,0,0,0.08)]"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border bg-white text-[10px] uppercase tracking-widest py-2.5 pl-3 pr-8 focus:outline-none appearance-none hover:border-black/25 transition-colors font-serif border-[rgba(0,0,0,0.08)]"
            >
              {categories.map((c) => (
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
              className="border bg-white text-[10px] uppercase tracking-widest py-2.5 pl-3 pr-8 focus:outline-none appearance-none hover:border-black/25 transition-colors font-serif border-[rgba(0,0,0,0.08)]"
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
          <div className="flex border border-[rgba(0,0,0,0.08)]">
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
            className="flex items-center space-x-2 bg-black text-white px-5 py-2.5 text-[9px] uppercase tracking-widest hover:bg-black/80 transition-colors ml-auto font-serif"
          >
            <Plus size={13} strokeWidth={1.5} />
            <span>Nouveau produit</span>
          </button>
        </div>

        {/* Results count */}
        <div className="px-4 py-2 border-t border-[rgba(0,0,0,0.08)]">
          <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 font-serif">
            {loading
              ? "Chargement..."
              : `${filtered.length} produit${filtered.length !== 1 ? "s" : ""}${search ? ` · "${search}"` : ""}`}
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white border border-[rgba(0,0,0,0.08)] flex items-center justify-center py-24">
          <p className="text-[9px] uppercase tracking-[0.3em] text-black/25 font-serif animate-pulse">
            Chargement des produits…
          </p>
        </div>
      ) : (
        /* Table / Grid views */
        <AnimatePresence mode="wait">
          {view === "table" && (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductTable
                filtered={filtered}
                sortKey={sortKey}
                sortDir={sortDir}
                handleSort={handleSort}
                setEditProduct={setEditProduct}
                setDeleteId={setDeleteId}
              />
            </motion.div>
          )}

          {view === "grid" && (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductGrid
                filtered={filtered}
                setEditProduct={setEditProduct}
                setDeleteId={setDeleteId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

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
                  className="flex-1 py-2.5 border text-[9px] uppercase tracking-widest text-black/50 hover:text-black transition-colors border-[rgba(0,0,0,0.08)] font-serif"
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
