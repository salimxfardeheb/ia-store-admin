import {
  LayoutDashboard, ShoppingBag, Package, Users, BarChart3,
  Wallet, Calendar, Settings
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────
export const revenueData = [
  { name: "Jan", revenue: 45000, expenses: 32000 },
  { name: "Fév", revenue: 52000, expenses: 34000 },
  { name: "Mar", revenue: 48000, expenses: 31000 },
  { name: "Avr", revenue: 61000, expenses: 38000 },
  { name: "Mai", revenue: 55000, expenses: 35000 },
  { name: "Jun", revenue: 67000, expenses: 40000 },
  { name: "Jul", revenue: 72000, expenses: 42000 },
];

export const categoryData = [
  { name: "Costumes",      value: 45 },
  { name: "Maille",        value: 25 },
  { name: "Manteaux",      value: 20 },
  { name: "Accessoires",   value: 10 },
];

export const PIE_COLORS = ["#0A0A0A", "#3A3A3A", "#7A7A7A", "#CACACA"];

export const recentOrders = [
  { id: "#ORD-7281", customer: "Alexandre Fontaine", date: "2 min",  amount: "850 €",   status: "En attente", priority: "High"   },
  { id: "#ORD-7280", customer: "Julien Vanel",        date: "15 min", amount: "1 220 €", status: "Confirmé",   priority: "Medium" },
  { id: "#ORD-7279", customer: "Marcus Thornier",     date: "1 h",   amount: "340 €",   status: "Expédié",    priority: "Low"    },
  { id: "#ORD-7278", customer: "Sébastien Colette",   date: "3 h",   amount: "580 €",   status: "Livré",      priority: "Low"    },
  { id: "#ORD-7277", customer: "Dominique Westmont",  date: "5 h",   amount: "145 €",   status: "Retardé",    priority: "High"   },
];

export const lowStockProducts = [
  { name: "Costume Soie & Laine",   size: "M", stock: 2, threshold: 5  },
  { name: "Col Roulé Cachemire",    size: "L", stock: 0, threshold: 10 },
  { name: "Chemise Oxford Coton",   size: "S", stock: 4, threshold: 8  },
];

export const STATUS_STYLES: Record<string, string> = {
  "Livré":      "bg-black text-white",
  "En attente": "bg-black/10 text-black",
  "Retardé":    "bg-black text-white border border-black/20",
  "Confirmé":   "bg-black/5 text-black",
  "Expédié":    "bg-black/80 text-white",
};

export const NAV_ITEMS = [
  { id: "overview",   icon: LayoutDashboard, label: "Vue d'ensemble",  href: "/"            },
  { id: "catalog",    icon: Package,         label: "Catalogue",       href: "/catalog"    },
  { id: "orders",     icon: ShoppingBag,     label: "Commandes",       href: "/orders"     },
  { id: "customers",  icon: Users,           label: "Clients",         href: "/customers"  },
  { id: "analytics",  icon: BarChart3,       label: "Analytiques",     href: "/analytics"  },
  { id: "finance",    icon: Wallet,          label: "Finance",         href: "/finance"    },
];

export const BOTTOM_NAV = [
  { id: "planning",  icon: Calendar, label: "Planning",    href: "/planning"  },
  { id: "settings",  icon: Settings, label: "Paramètres",  href: "/settings"  },
];

export interface SizeEntry {
  size: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sizes: SizeEntry[];
  status: "Actif" | "Brouillon" | "Archivé";
  createdAt: string;
  mainImage: string;        // URL Firebase Storage
  extraImages?: string[];   // URLs optionnelles
}

export const CATEGORIES = ["Tous", "Costumes", "Maille", "Manteaux", "Chemises", "Pantalons", "Accessoires", "Chaussures"];

export const INITIAL_PRODUCTS: Product[] = [];

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "Unique"];
export const SHOE_SIZE_OPTIONS = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

export const STATUSES   = ["Tous", "Actif", "Brouillon", "Archivé"];

export const STATUS_STYLE: Record<string, string> = {
  "Actif":    "bg-black text-white",
  "Brouillon":"bg-black/8 text-black",
  "Archivé":  "bg-black/5 text-black/40",
};