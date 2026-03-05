import { useState } from "react";
import { formatDate, Order, OrderStatus, STATUS_CONFIG, STATUS_FLOW } from "../variables";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

export function OrderRow({
  order,
  onStatusChange,
}: {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const cfg = STATUS_CONFIG[order.status];

  const handleStatus = async (status: OrderStatus) => {
    setChangingStatus(true);
    await onStatusChange(order.id, status);
    setChangingStatus(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-[rgba(0,0,0,0.08)] bg-white"
    >
      {/* Row principale */}
      <div
        className="grid grid-cols-12 items-center px-5 py-4 cursor-pointer hover:bg-black/1.5 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Réf */}
        <div className="col-span-3">
          <p className="text-[9px] uppercase tracking-[0.3em] text-black/30 font-serif mb-0.5">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-[11px] font-serif text-black">{order.form.fullName}</p>
          <p className="text-[9px] text-black/30 font-serif">{order.form.phone}</p>
        </div>

        {/* Wilaya */}
        <div className="col-span-2">
          <p className="text-[10px] font-serif text-black/70">{order.form.city}</p>
          <p className="text-[9px] text-black/30 font-serif capitalize">
            {order.form.deliveryType === "home" ? "À domicile" : "Bureau"}
          </p>
        </div>

        {/* Articles */}
        <div className="col-span-2">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item, i) => (
              <div key={i} className="w-8 h-8 border border-white bg-[#f5f5f5] overflow-hidden shrink-0">
                <img src={item.mainImage} alt={item.name} className="w-full h-full object-cover" />
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-8 h-8 border border-white bg-black/5 flex items-center justify-center">
                <span className="text-[8px] font-serif text-black/40">+{order.items.length - 3}</span>
              </div>
            )}
          </div>
          <p className="text-[9px] text-black/30 font-serif mt-1">
            {order.items.reduce((s, i) => s + i.quantity, 0)} article{order.items.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Total */}
        <div className="col-span-2">
          <p className="font-serif italic text-sm">{order.total.toLocaleString("fr-FR")} DA</p>
          <p className="text-[9px] text-black/30 font-serif uppercase tracking-widest">
            {order.form.paymentMethod === "cash" ? "Cash" : "Carte"}
          </p>
        </div>

        {/* Status */}
        <div className="col-span-2 flex items-center justify-between">
          <span className={`text-[8px] uppercase tracking-widest px-2.5 py-1 font-serif ${cfg.color} ${cfg.bg}`}>
            {cfg.label}
          </span>
          <div className="flex items-center gap-2 text-black/20">
            <span className="text-[8px] font-serif">{formatDate(order.createdAt)}</span>
            {expanded
              ? <ChevronUp size={12} strokeWidth={1.5} />
              : <ChevronDown size={12} strokeWidth={1.5} />
            }
          </div>
        </div>
      </div>

      {/* Détail expandé */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[rgba(0,0,0,0.06)]"
          >
            <div className="px-5 py-6 grid grid-cols-2 gap-8">

              {/* Articles */}
              <div>
                <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 font-serif mb-4">
                  Articles commandés
                </p>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#f5f5f5] overflow-hidden shrink-0">
                        <img src={item.mainImage} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="grow">
                        <p className="font-serif text-[11px] italic">{item.name}</p>
                        <p className="text-[9px] text-black/30 uppercase tracking-widest">x{item.quantity}</p>
                      </div>
                      <span className="font-serif text-[11px] italic shrink-0">
                        {(item.price * item.quantity).toLocaleString("fr-FR")} DA
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adresse + changer statut */}
              <div className="space-y-6">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 font-serif mb-3">
                    Adresse de livraison
                  </p>
                  <p className="font-serif text-[11px] text-black">{order.form.fullName}</p>
                  <p className="font-serif text-[11px] text-black/50">{order.form.adress}</p>
                  <p className="font-serif text-[11px] text-black/50">
                    {order.form.postalCode} — {order.form.city}
                  </p>
                  <p className="font-serif text-[11px] text-black/50 mt-1">{order.form.phone}</p>
                </div>

                {/* Changer le statut */}
                <div>
                  <p className="text-[8px] uppercase tracking-[0.3em] text-black/30 font-serif mb-3">
                    Changer le statut
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_FLOW.map((s) => {
                      const c = STATUS_CONFIG[s];
                      const isActive = order.status === s;
                      return (
                        <button
                          key={s}
                          disabled={isActive || changingStatus}
                          onClick={(e) => { e.stopPropagation(); handleStatus(s); }}
                          className={`px-3 py-1.5 text-[8px] uppercase tracking-widest font-serif transition-all border ${
                            isActive
                              ? `${c.bg} ${c.color} border-transparent`
                              : "border-black/8 text-black/40 hover:border-black/30 hover:text-black"
                          } disabled:cursor-not-allowed`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}