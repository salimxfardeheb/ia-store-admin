"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import AdminHeader from "../components/AdminHeader";
import { OrderRow } from "../components/OrderRow";
import { Package } from "lucide-react";
import { Order, OrderStatus, STATUS_CONFIG, STATUS_FLOW } from "../variables";
import { getOrders, updateOrder } from "../firebase/getOrders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    await updateOrder(id, status);
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status } : o
      )
    );
  };

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch =
      !search ||
      o.form.name.toLowerCase().includes(search.toLowerCase()) ||
      o.form.phone.includes(search) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div>
      <AdminHeader title="Commandes" subtitle="Gestion" />

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {(["all", ...STATUS_FLOW] as const).map((s) => {
          const cfg = s === "all" ? null : STATUS_CONFIG[s];
          const count = s === "all" ? orders.length : (counts[s] ?? 0);
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`border p-4 text-left transition-all ${
                filterStatus === s
                  ? "border-black bg-black text-white"
                  : "border-[rgba(0,0,0,0.08)] bg-white hover:border-black/30"
              }`}
            >
              <p
                className={`text-2xl font-serif italic mb-1 ${filterStatus === s ? "text-white" : "text-black"}`}
              >
                {count}
              </p>
              <p
                className={`text-[8px] uppercase tracking-[0.25em] font-serif ${filterStatus === s ? "text-white/60" : "text-black/30"}`}
              >
                {s === "all" ? "Toutes" : cfg!.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Recherche */}
      <div className="mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, téléphone, référence..."
          className="w-full border border-[rgba(0,0,0,0.08)] text-[11px] py-2.5 px-4 bg-white font-serif focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {/* En-tête colonnes */}
      <div className="grid grid-cols-12 px-5 py-2 mb-2">
        {["Client", "Wilaya", "Articles", "Total", "Statut"].map((h, i) => (
          <div
            key={h}
            className={`${i === 0 ? "col-span-3" : i === 4 ? "col-span-2" : "col-span-2"} text-[8px] uppercase tracking-[0.3em] text-black/25 font-serif`}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="text-center py-24">
          <p className="font-serif italic text-black/20">Chargement...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-black/10">
          <Package
            size={32}
            strokeWidth={0.75}
            className="text-black/10 mx-auto mb-4"
          />
          <p className="font-serif italic text-black/20">Aucune commande</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
