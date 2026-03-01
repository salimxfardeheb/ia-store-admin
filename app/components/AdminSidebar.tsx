"use client";

import { ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS, BOTTOM_NAV } from "../variables";
import Logo from "@/app/components/logo";

function SidebarLink({
  href, icon: Icon, label, active,
}: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center space-x-3 px-4 py-2.5 transition-all duration-150 text-left ${
        active
          ? "bg-black text-white"
          : "text-black/35 hover:bg-black/5 hover:text-black"
      }`}
    >
      <Icon size={18} strokeWidth={1.5} />
      <span className="text-[10px] uppercase tracking-[0.25em] flex-1 font-serif">
        {label}
      </span>
      {active && <ChevronRight size={9} className="opacity-40" />}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  const handleLogout = async () => {
    router.push("/");
  };

  return (
    <aside
      className="w-56 fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-white border-[rgba(0,0,0,0.08)] "
    >
      {/* Brand */}
      <div className="px-6 pt-8 pb-6 border-b border-[rgba(0,0,0,0.08)]">
        <Link href="/" className="flex flex-col">
          <span
            className="mx-auto"
          >
            <Logo />
          </span>
          <span
            className="text-[9px] uppercase tracking-[0.45em] text-black/50 mt-3 font-serif text-center"
          >
            Admin Console
          </span>
        </Link>
      </div>

      {/* Thin rule */}
      <div className="mx-6 h-px" style={{ backgroundColor: "rgba(0,0,0,0.05)" }} />

      {/* Primary nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.id}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
            }
          />
        ))}
      </nav>

      {/* Bottom nav + user */}
      <div className="border-t py-4 px-2 space-y-0.5 border-[rgba(0,0,0,0.08)] " >
        {BOTTOM_NAV.map((item) => (
          <SidebarLink
            key={item.id}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname.startsWith(item.href)}
          />
        ))}

        {/* User row */}
        <div className="px-4 pt-4 mt-2 border-t border-[rgba(0,0,0,0.08)]" >
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-black truncate font-serif">
                {"Admin"}
              </p>
              <p className="text-[8px] text-black/30 truncate mt-0.5">{'AD'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Se déconnecter"
              className="p-1.5 text-black/25 hover:text-black hover:bg-black/6 transition-colors shrink-0"
            >
              <LogOut size={13} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}