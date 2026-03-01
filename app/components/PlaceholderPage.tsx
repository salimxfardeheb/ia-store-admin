"use client";

import { motion } from "framer-motion";
import AdminHeader from "./AdminHeader";
import { C, serif } from "../variables";

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export default function PlaceholderPage({ title, subtitle, icon }: PlaceholderPageProps) {
  return (
    <>
      <AdminHeader title={title} subtitle={subtitle} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-[60vh] text-center"
      >
        <div
          className="w-16 h-16 flex items-center justify-center mb-8 border bg-white"
          style={{ borderColor: C.border }}
        >
          <span className="text-black/15">{icon}</span>
        </div>

        <h2
          className="text-black mb-4"
          style={{ ...serif, fontSize: "2rem", fontStyle: "italic", fontWeight: 300 }}
        >
          {title}
        </h2>

        <div className="flex items-center space-x-4 mb-5">
          <div className="h-px w-8 bg-black/15" />
          <p className="text-[8px] uppercase tracking-[0.4em] text-black/30" style={serif}>
            Module en préparation
          </p>
          <div className="h-px w-8 bg-black/15" />
        </div>

        <p className="text-black/35 text-sm max-w-sm leading-relaxed" style={serif}>
          Ce module sera alimenté par les données en temps réel de votre boutique.
        </p>
      </motion.div>
    </>
  );
}