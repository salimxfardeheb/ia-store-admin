"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit2, Trash2,
 X, ChevronDown, ArrowUpDown, Package,
} from "lucide-react";
import AdminHeader from "../components/AdminHeader";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sizes: string[];
  status: "Actif" | "Brouillon" | "Archivé";
  createdAt: string;
}

// ─── Mock products ────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS: Product[] = [
  { id: "PRD-001", name: "Costume Trois-Pièces Laine Serge",   category: "Costumes",      price: 1850, stock: 12, sizes: ["S","M","L","XL"],    status: "Actif",    createdAt: "12 Jan 2025" },
  { id: "PRD-002", name: "Col Roulé Cachemire Double Fils",    category: "Maille",        price: 420,  stock: 0,  sizes: ["M","L"],              status: "Actif",    createdAt: "18 Jan 2025" },
  { id: "PRD-003", name: "Manteau Oversize Camel Hair",        category: "Manteaux",      price: 2200, stock: 5,  sizes: ["S","M","L"],          status: "Actif",    createdAt: "22 Jan 2025" },
  { id: "PRD-004", name: "Chemise Oxford à Rayures Fines",     category: "Chemises",      price: 185,  stock: 24, sizes: ["S","M","L","XL","XXL"],status: "Actif",    createdAt: "3 Fév 2025"  },
  { id: "PRD-005", name: "Ceinture Cuir Vachette Tressée",     category: "Accessoires",   price: 145,  stock: 8,  sizes: ["85","90","95","100"],  status: "Actif",    createdAt: "8 Fév 2025"  },
  { id: "PRD-006", name: "Pantalon Flanelle Gris Clair",       category: "Pantalons",     price: 320,  stock: 15, sizes: ["M","L","XL"],         status: "Brouillon",createdAt: "14 Fév 2025" },
  { id: "PRD-007", name: "Blazer Tweed Hérringbone Anthracite",category: "Costumes",      price: 890,  stock: 3,  sizes: ["S","M"],              status: "Actif",    createdAt: "1 Mar 2025"  },
  { id: "PRD-008", name: "Écharpe Cachemire Écossais",         category: "Accessoires",   price: 265,  stock: 0,  sizes: ["Unique"],             status: "Archivé",  createdAt: "5 Mar 2025"  },
  { id: "PRD-009", name: "Cardigan Merinos Col V",             category: "Maille",        price: 310,  stock: 18, sizes: ["S","M","L","XL"],    status: "Actif",    createdAt: "10 Mar 2025" },
  { id: "PRD-010", name: "Mocassin Cuir Patiné Bordeaux",      category: "Chaussures",    price: 480,  stock: 7,  sizes: ["40","41","42","43","44"], status: "Actif", createdAt: "15 Mar 2025" },
];

const CATEGORIES = ["Tous", "Costumes", "Maille", "Manteaux", "Chemises", "Pantalons", "Accessoires", "Chaussures"];
const STATUSES   = ["Tous", "Actif", "Brouillon", "Archivé"];

const STATUS_STYLE: Record<string, string> = {
  "Actif":    "bg-black text-white",
  "Brouillon":"bg-black/8 text-black",
  "Archivé":  "bg-black/5 text-black/40",
};

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function ProductModal({
  product, onClose, onSave,
}: { product: Product | null; onClose: () => void; onSave: (p: Product) => void }) {
  const isNew = !product;
  const [form, setForm] = useState<Product>(
    product ?? {
      id: `PRD-${String(INITIAL_PRODUCTS.length + 1).padStart(3, "0")}`,
      name: "", category: "Costumes", price: 0, stock: 0,
      sizes: [], status: "Brouillon", createdAt: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
    }
  );

  const toggleSize = (s: string) =>
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));

  const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Unique"];

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
            <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 mt-0.5 font-serif" >
              {form.id}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-black/5 transition-colors">
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
              className="w-full border text-sm py-2.5 px-3 focus:outline-none focus:border-black transition-colors bg-[#F7F7F7] font-serif border-[rgba(0,0,0,0.08)] "
              placeholder="Ex : Costume Trois-Pièces Laine Serge"
            />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-1.5 font-serif" >Catégorie</label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border text-[11px] py-2.5 px-3 focus:outline-none focus:border-black appearance-none bg-[#F7F7F7] transition-colors font-serif border-[rgba(0,0,0,0.08)] "
                >
                  {CATEGORIES.filter((c) => c !== "Tous").map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black/30" />
              </div>
            </div>
            <div>
              <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-1.5 font-serif">Statut</label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Product["status"] })}
                  className="w-full border text-[11px] py-2.5 px-3 focus:outline-none focus:border-black appearance-none bg-[#F7F7F7] transition-colors font-serif border-[rgba(0,0,0,0.08)]"
                >
                  {["Actif", "Brouillon", "Archivé"].map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black/30" />
              </div>
            </div>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-1.5 font-serif ">Prix (€)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full border text-[11px] py-2.5 px-3 focus:outline-none focus:border-black transition-colors bg-[#F7F7F7] border-[rgba(0,0,0,0.08)]  font-serif"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-1.5 font-serif" >Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                className="w-full border text-[11px] py-2.5 px-3 focus:outline-none focus:border-black transition-colors bg-[#F7F7F7] font-serif border-[rgba(0,0,0,0.08)] "
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-[8px] uppercase tracking-[0.3em] text-black/40 mb-2 font-serif">Tailles disponibles</label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((s) => (
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
        <div className="px-7 py-5 border-t flex justify-end space-x-3 border-[rgba(0,0,0,0.08)] ">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border text-[9px] uppercase tracking-widest text-black/50 hover:text-black hover:border-black/30 transition-all font-serif border-[rgba(0,0,0,0.08)] "
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const [products, setProducts]         = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch]             = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [sortKey, setSortKey]           = useState<keyof Product>("id");
  const [sortDir, setSortDir]           = useState<"asc" | "desc">("asc");
  const [editProduct, setEditProduct]   = useState<Product | null | undefined>(undefined);
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const [view, setView]                 = useState<"table" | "grid">("table");

  // Filter + sort
  const filtered = products
    .filter((p) =>
      (categoryFilter === "Tous" || p.category === categoryFilter) &&
      (statusFilter   === "Tous" || p.status   === statusFilter)   &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.id.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleSort = (key: keyof Product) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleSave = (p: Product) => {
    setProducts((prev) =>
      prev.find((x) => x.id === p.id)
        ? prev.map((x) => (x.id === p.id ? p : x))
        : [...prev, p]
    );
    setEditProduct(undefined);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const stats = {
    total:    products.length,
    active:   products.filter((p) => p.status === "Actif").length,
    outStock: products.filter((p) => p.stock === 0).length,
    draft:    products.filter((p) => p.status === "Brouillon").length,
  };

  return (
    <>
      <AdminHeader title="Catalogue" subtitle="Gestion des produits" />

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        {[
          { label: "Total produits",  value: stats.total    },
          { label: "Actifs",          value: stats.active   },
          { label: "Hors stock",      value: stats.outStock },
          { label: "Brouillons",      value: stats.draft    },
        ].map(({ label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border px-5 py-4 border-[rgba(0,0,0,0.08)] "
          >
            <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 mb-2 font-serif"  >{label}</p>
            <p className="text-2xl text-black font-serif font-light italic">{value}</p>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border mb-4 border-[rgba(0,0,0,0.08)] ">
        <div className="flex flex-wrap items-center gap-3 p-4">
          {/* Search */}
          <div className="relative flex-1 min-w-50">
            <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" />
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
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black/30" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border bg-white text-[10px] uppercase tracking-widest py-2.5 pl-3 pr-8 focus:outline-none appearance-none hover:border-black/25 transition-colors font-serif border-[rgba(0,0,0,0.08)] "
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black/30" />
          </div>

          {/* View toggle */}
          <div className="flex border border-[rgba(0,0,0,0.08)] ">
            {(["table", "grid"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2.5 text-[8px] uppercase tracking-widest transition-colors font-serif ${
                  view === v ? "bg-black text-white" : "text-black/35 hover:bg-black/4"
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
          <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 font-serif"  >
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
                    { key: "id",       label: "Réf."       },
                    { key: "name",     label: "Produit"    },
                    { key: "category", label: "Catégorie"  },
                    { key: "price",    label: "Prix"       },
                    { key: "stock",    label: "Stock"      },
                    { key: "status",   label: "Statut"     },
                    { key: "createdAt",label: "Ajouté le"  },
                    { key: null,       label: ""           },
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
                          <ArrowUpDown size={9} strokeWidth={1.5} className={sortKey === key ? "opacity-100 text-black" : "opacity-30"} />
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
                      <td className="px-5 py-3.5 text-[9px] text-black/35 font-serif"  >{product.id}</td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-[11px] text-black font-serif"  >{product.name}</p>
                          <p className="text-[8px] text-black/30 mt-0.5 font-serif"  >
                            {product.sizes.join(" · ")}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[9px] text-black/50 uppercase tracking-widest font-serif"  >
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
                      <td className="px-5 py-3.5 text-[9px] text-black/30 font-serif"  >{product.createdAt}</td>
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
                <Package size={28} strokeWidth={1} className="text-black/15 mb-4" />
                <p className="text-sm text-black/30 font-serif italic">Aucun produit trouvé</p>
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
                  <Package size={32} strokeWidth={0.75} className="text-black/10" />
                  {product.stock === 0 && (
                    <div className="absolute top-3 left-3 bg-black text-white text-[7px] uppercase tracking-widest px-2 py-0.5 font-serif"  >
                      Épuisé
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[7px] uppercase tracking-widest px-2 py-0.5 font-serif ${STATUS_STYLE[product.status]}`}  >
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
                  <p className="text-[8px] uppercase tracking-[0.3em] text-black/25 mb-1 font-serif"  >{product.id}</p>
                  <h3 className="text-[11px] text-black leading-snug mb-2 font-serif"  >{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-base text-black font-serif italic font-light">
                      {product.price.toLocaleString("fr-FR")} €
                    </span>
                    <span className="text-[8px] uppercase tracking-widest text-black/30 font-serif"  >
                      {product.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {product.sizes.slice(0, 4).map((s) => (
                      <span key={s} className="text-[7px] px-1.5 py-0.5 border border-black/10 text-black/40 uppercase tracking-widest font-serif"  >{s}</span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="text-[7px] px-1.5 py-0.5 border border-black/10 text-black/30 uppercase tracking-widest font-serif"  >
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
              <span className="text-[8px] uppercase tracking-[0.3em] font-serif"  >Ajouter</span>
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
              <p className="text-[11px] text-black/40 mb-7 leading-relaxed font-serif"  >
                Cette action est irréversible. Le produit <strong className="text-black">{deleteId}</strong> sera définitivement supprimé du catalogue.
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
          <ProductModal
            product={editProduct}
            onClose={() => setEditProduct(undefined)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </>
  );
}