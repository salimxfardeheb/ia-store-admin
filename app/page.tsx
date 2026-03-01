"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  AlertTriangle, Sun, Plus, TrendingUp, Download, Calendar, MoreVertical,
} from "lucide-react";
import AdminHeader from "./components/AdminHeader";
import { KPICard } from "./components/KpiCard";
import {
 revenueData, categoryData, PIE_COLORS,
  recentOrders, lowStockProducts,
  STATUS_STYLES,
} from "./variables";;

function QuickAction({ icon: Icon, label, dark = false }: { icon: any; label: string; dark?: boolean }) {
  return (
    <button
      className={`flex flex-col items-center justify-center p-5 border transition-all hover:scale-[1.015] duration-200 ${
        dark ? "bg-black text-white border-black" : "bg-white text-black border-black/8 hover:border-black/25"
      }`}
    >
      <Icon size={18} strokeWidth={1.5} className="mb-2.5" />
      <span className="text-[8px] uppercase tracking-tight font-serif">{label}</span>
    </button>
  );
}

const KPIs = [
  { title: "Chiffre d'affaires", value: "128 430 €", trend: "+12.5%", isUp: true,  subtitle: "vs mois dernier" },
  { title: "Commandes",          value: "1 240",      trend: "+8.2%",  isUp: true,  subtitle: "vs mois dernier" },
  { title: "Panier moyen",       value: "103 €",      trend: "-2.1%",  isUp: false, subtitle: "vs mois dernier" },
  { title: "Conversion",         value: "3.42%",      trend: "+0.5%",  isUp: true,  subtitle: "vs mois dernier" },
];

export default function OverviewPage() {
  return (
    <>
      <AdminHeader title="Tableau de bord" subtitle="Vue d'ensemble" />

      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIs.map((kpi, i) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <KPICard {...kpi} />
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Area chart */}
          <div className="lg:col-span-2 bg-white border p-7 border-[rgba(0,0,0,0.08)] " >
            <div className="flex justify-between items-center mb-7">
              <h3 className="text-lg text-black italic font-light font-serif">
                Aperçu des revenus
              </h3>
              <div className="flex">
                {["Mensuel", "Hebdo"].map((l, i) => (
                  <button
                    key={l}
                    className="px-3 py-1 text-[8px] uppercase tracking-widest transition-colors"
                    style={{ backgroundColor: i === 0 ? "#0A0A0A" : "transparent", color: i === 0 ? "#FFF" : "rgba(0,0,0,0.35)" }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="gDark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#0A0A0A" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#0A0A0A" stopOpacity={0}   />
                    </linearGradient>
                    <linearGradient id="gMid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7A7A7A" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#7A7A7A" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "rgba(0,0,0,0.35)", fontFamily: "'Cormorant Garamond',Georgia,serif" }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "rgba(0,0,0,0.35)", fontFamily: "'Cormorant Garamond',Georgia,serif" }} />
                  <Tooltip contentStyle={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 0, backgroundColor: "#fff", fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 11 }} />
                  <Area type="monotone" dataKey="revenue"  stroke="#0A0A0A" strokeWidth={1.5} fillOpacity={1} fill="url(#gDark)" />
                  <Area type="monotone" dataKey="expenses" stroke="#7A7A7A" strokeWidth={1.5} fillOpacity={1} fill="url(#gMid)" strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center space-x-5 mt-4">
              {[{ label: "Revenus", dark: true }, { label: "Dépenses", dark: false }].map(({ label, dark }) => (
                <div key={label} className="flex items-center space-x-2">
                  <div className="w-5 h-px" style={{ backgroundColor: dark ? "#0A0A0A" : "#7A7A7A" }} />
                  <span className="text-[8px] uppercase tracking-widest text-black/40 font-serif">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie */}
          <div className="bg-white border p-7 border-[rgba(0,0,0,0.08)] " >
            <h3 className="text-lg text-black mb-7 font-serif italic font-light">
              Par catégorie
            </h3>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={68} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 0, backgroundColor: "#fff", fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.map((cat, i) => (
                <div key={cat.name} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-2 h-2" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-[9px] uppercase tracking-widest text-black/50 font-serif">{cat.name}</span>
                  </div>
                  <span className="text-[9px] text-black italic font-serif">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Orders + Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Orders table */}
          <div className="lg:col-span-2 bg-white border overflow-hidden border-[rgba(0,0,0,0.08)] ">
            <div className="px-7 py-5 border-b flex justify-between items-center border-[rgba(0,0,0,0.08)] ">
              <h3 className="text-lg text-black font-serif italic font-light">Commandes récentes</h3>
              <button className="text-[8px] uppercase tracking-widest border-b border-black pb-0.5 text-black hover:opacity-50 transition-opacity font-serif">
                Tout voir
              </button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-[8px] uppercase tracking-[0.25em] text-black/30 border-[rgba(0,0,0,0.08)] ">
                  {["N° Commande", "Client", "Statut", "Montant", ""].map((h) => (
                    <th key={h} className="px-6 py-3 font-normal font-serif">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b hover:bg-black/2 transition-colors border-[rgba(0,0,0,0.08)] "
                  >
                    <td className="px-6 py-3.5 text-[9px] text-black/40 font-serif">{order.id}</td>
                    <td className="px-6 py-3.5 text-[10px] text-black font-serif" >{order.customer}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-0.5 text-[7px] uppercase tracking-widest font-serif ${STATUS_STYLES[order.status] ?? "bg-black/5 text-black"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-[10px] text-black font-serif italic">{order.amount}</td>
                    <td className="px-6 py-3.5">
                      <button className="p-1 text-black/20 hover:text-black hover:bg-black/5 transition-colors">
                        <MoreVertical size={12} strokeWidth={1.5} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stock alerts */}
          <div className="bg-white border p-6 border-[rgba(0,0,0,0.08)] ">
            <div className="flex items-center space-x-2 mb-6">
              <AlertTriangle size={14} strokeWidth={1.5} className="text-black/50" />
              <h3 className="text-lg text-black font-serif italic font-light">Alertes stock</h3>
            </div>
            <div className="space-y-3">
              {lowStockProducts.map((item) => (
                <div key={`${item.name}-${item.size}`} className="p-4 border border-[rgba(0,0,0,0.08)] ">
                  <div className="flex justify-between items-start mb-2.5">
                    <h4 className="text-[10px] text-black pr-2 leading-snug font-serif">{item.name}</h4>
                    <span className="text-[7px] uppercase tracking-widest bg-black text-white px-2 py-0.5 shrink-0 font-serif">{item.size}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[7px] uppercase tracking-[0.3em] text-black/30 mb-0.5 font-serif">En stock</p>
                      <p className="text-xl font-serif italic font-light " style={{ color: item.stock === 0 ? "#000" : "#555" }}>
                        {item.stock}
                      </p>
                    </div>
                    <button className="text-[8px] uppercase tracking-widest border-b border-black text-black pb-0.5 hover:opacity-50 transition-opacity font-serif">
                      Restock
                    </button>
                  </div>
                  <div className="mt-2.5 h-px w-full bg-black/8">
                    <div className="h-full bg-black transition-all" style={{ width: `${Math.min((item.stock / item.threshold) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 border border-black/10 text-[8px] uppercase tracking-[0.25em] text-black hover:bg-black hover:text-white transition-all font-serif">
              Rapport complet 
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Seasonal */}
          <div className="bg-black p-8 relative overflow-hidden flex flex-col justify-between min-h-55">
            <div className="relative z-10">
              <div className="flex items-center space-x-2.5 mb-4">
                <Sun size={14} strokeWidth={1.5} className="text-white/50" />
                <span className="text-[8px] uppercase tracking-[0.4em] text-white/40 font-serif">Analyse saisonnière</span>
              </div>
              <h3 className="text-white mb-3 font-serif text-[1.5rem] italic font-light leading-5">
                Transition printemps<br />approche
              </h3>
              <p className="text-white/40 text-sm mb-6 max-w-xs leading-relaxed font-serif">
                La demande en lin et soie légère devrait augmenter de 40% la semaine prochaine.
              </p>
            </div>
            <button className="self-start px-6 py-2.5 bg-white text-black text-[8px] uppercase tracking-[0.25em] hover:bg-white/80 transition-all font-serif">
              Mettre à jour la vitrine
            </button>
            <div className="absolute -right-6 -bottom-6 pointer-events-none opacity-[0.04]">
              <Sun size={160} />
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white border p-7 border-[rgba(0,0,0,0.08)] ">
            <h3 className="text-lg text-black mb-5 font-serif italic font-light">Actions rapides</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon={Plus}       label="Ajouter produit" dark />
              <QuickAction icon={TrendingUp} label="Créer une promo" />
              <QuickAction icon={Download}   label="Exporter ventes" />
              <QuickAction icon={Calendar}   label="Plan campagne"   />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}