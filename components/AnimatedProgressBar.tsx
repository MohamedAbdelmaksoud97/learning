"use client";

import { motion } from "framer-motion";

export function AnimatedProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-800">
      <motion.div
        className="h-full rounded-full bg-gradient-to-l from-sky-300 to-blue-600"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 24 }}
      />
    </div>
  );
}
