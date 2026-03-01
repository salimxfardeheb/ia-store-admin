"use client";

import { Bell, Search } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {

  return (
    <header className="flex justify-between items-start mb-10">
      <div>
        {subtitle && (
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-px w-6 bg-black/30" />
            <span className="text-[8px] uppercase tracking-[0.4em] text-black/35 font-serif">
              {subtitle}
            </span>
          </div>
        )}
        <h1
          className="text-black leading-none italic text-4xl font-light font-serif"
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-2.5">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20"
            size={13}
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="Rechercher..."
            className="border bg-white text-[11px] focus:outline-none focus:border-black/30 w-52 py-2.5 pl-9 pr-4 transition-colors border-[rgba(0,0,0,0.08)] font-serif text-[#0A0A0A]"
          />
        </div>

        {/* Bell */}
        <button
          className="relative p-2.5 border bg-white hover:bg-black/4 transition-colors border-[rgba(0,0,0,0.08)]"
        >
          <Bell size={15} strokeWidth={1.5} className="text-black" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full" />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 flex items-center justify-center bg-black text-white text-[9px] uppercase tracking-widest font-serif"
        >
          {"AD"}
        </div>
      </div>
    </header>
  );
}