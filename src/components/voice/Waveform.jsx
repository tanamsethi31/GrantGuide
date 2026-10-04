import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Small animated sound wave shown while listening. */
export default function Waveform({ color = "#15803D" }) {
  const reduce = useReducedMotion();
  return (
    <span className="flex items-center gap-1 h-6" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ height: 6 }}
          animate={reduce ? { height: 12 } : { height: [6, 22 - (i % 3) * 5, 8, 18, 6] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}
