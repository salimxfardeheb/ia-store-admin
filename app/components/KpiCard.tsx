import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  trend: string;
  isUp: boolean;
  subtitle: string;
}

export function KPICard({ title, value, trend, isUp, subtitle }: KPICardProps) {
  return (
    <div
      className="bg-white border p-6 relative overflow-hidden border-[rgba(0,0,0,0.08)] "
    >
      {/* Top accent */}
      <div className={`absolute top-0 left-0 right-0 h-px ${isUp ? "bg-black" : "bg-black/20"}`} />

      <p className="text-[8px] uppercase tracking-[0.35em] text-black/35 mb-5 font-serif" >
        {title}
      </p>

      <div className="flex items-end justify-between">
        <div>
          <h4
            className="text-[2rem] text-black leading-none mb-1.5 font-serif font-light italic"
          >
            {value}
          </h4>
          <p className="text-[8px] text-black/30 uppercase tracking-widest font-serif">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex items-center space-x-1 px-2.5 py-1 text-[8px] uppercase tracking-widest border font-serif ${
            isUp
              ? "bg-black text-white border-black"
              : "bg-white text-black border-black/15"
          }`}
        >
          {isUp ? <TrendingUp size={10} strokeWidth={1.5} /> : <TrendingDown size={10} strokeWidth={1.5} />}
          <span>{trend}</span>
        </div>
      </div>
    </div>
  );
}