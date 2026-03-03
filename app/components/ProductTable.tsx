import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, Edit2, Trash2, Package } from "lucide-react";
import { Product, STATUS_STYLE } from "../variables";

interface ProductTableProps {
  filtered: Product[];
  sortKey: keyof Product;
  sortDir: "asc" | "desc";
  handleSort: (key: keyof Product) => void;
  setEditProduct: (product: Product | null) => void;
  setDeleteId: (id: string) => void;
}

export default function ProductTable({
  filtered,
  sortKey,
  handleSort,
  setEditProduct,
  setDeleteId,
}: ProductTableProps) {
  return (
    <div className="bg-white border overflow-hidden border-[rgba(0,0,0,0.08)]">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[rgba(0,0,0,0.08)]">
            {[
              { key: "name", label: "Produit" },
              { key: "category", label: "Catégorie" },
              { key: "price", label: "Prix" },
              { key: "stock", label: "Stock" },
              { key: "status", label: "Statut" },
              { key: "createdAt", label: "Ajouté le" },
              { key: null, label: "" },
            ].map(({ key, label }) => (
              <th key={label} className="px-5 py-3 font-normal font-serif">
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
                className="border-b group hover:bg-black/[0.018] transition-colors border-[rgba(0,0,0,0.08)]"
              >
                <td className="px-5 py-3.5">
                  <div>
                    <p className="text-[11px] text-black font-serif">
                      {product.name}
                    </p>
                    <p className="text-[8px] text-black/30 mt-0.5 font-serif">
                      {product.sizes.map((s) => s.size).join(" · ")}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[9px] text-black/50 uppercase tracking-widest font-serif">
                  {product.category}
                </td>
                <td className="px-5 py-3.5 text-[11px] text-black font-serif italic">
                  {product.price.toLocaleString("fr-FR")} DA
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`text-[11px] font-serif ${
                      product.stock === 0
                        ? "text-black font-bold"
                        : "text-black/60"
                    }`}
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
          <Package size={28} strokeWidth={1} className="text-black/15 mb-4" />
          <p className="text-sm text-black/30 font-serif italic">
            Aucun produit trouvé
          </p>
        </div>
      )}
    </div>
  );
}
