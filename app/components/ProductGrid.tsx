import { motion } from "framer-motion";
import { Edit2, Trash2, Package, Plus } from "lucide-react";
import { Product, STATUS_STYLE } from "../variables";

interface ProductGridProps {
  filtered: Product[];
  setEditProduct: (product: Product | null) => void;
  setDeleteId: (id: string) => void;
}

export default function ProductGrid({
  filtered,
  setEditProduct,
  setDeleteId,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filtered.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="bg-white border group relative overflow-hidden border-[rgba(0,0,0,0.08)]"
        >
          {/* Placeholder image */}
          <div className="h-48 bg-[#F2F0ED] flex items-center justify-center relative overflow-hidden">
            <Package size={32} strokeWidth={0.75} className="text-black/10" />
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
    </div>
  );
}