'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const tableData = [
  { feature: "Onset Time", whiteRabbit: "15-20 mins", traditional: "45-90 mins" },
  { feature: "Nausea", whiteRabbit: "None", traditional: "Common" },
  { feature: "Taste", whiteRabbit: "Premium Flavors", traditional: "Earthy / Unpleasant" },
  { feature: "Duration", whiteRabbit: "4-6 Hours", traditional: "6-8 Hours" },
  { feature: "Dosing", whiteRabbit: "Precision (500mg/10mL)", traditional: "Variable / Estimates" },
  { feature: "Shelf Life", whiteRabbit: "High Stability", traditional: "Loss of Potency" }
];

export default function ComparisonTable() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 border-t border-white/5 bg-black/50">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.2em] text-acid-green uppercase mb-4">The Benchmark</h2>
          <h3 className="text-4xl md:text-5xl font-serif">A New Standard</h3>
        </div>

        <div className="overflow-x-auto pb-8">
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-6 px-4 font-normal text-white/50 w-1/3">Feature</th>
                <th className="py-6 px-4 font-serif text-2xl text-white neon-glow-blue w-1/3 bg-white/5 rounded-tl-xl rounded-tr-xl border-x border-t border-white/10">WHITE RABBIT</th>
                <th className="py-6 px-4 font-normal text-white/50 w-1/3">Traditional Methods</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <motion.tr 
                  key={row.feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-5 px-4 font-light text-white/80">{row.feature}</td>
                  <td className="py-5 px-4 font-medium text-electric-blue bg-white/5 border-x border-white/10">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-acid-green" /> 
                      {row.whiteRabbit}
                    </div>
                  </td>
                  <td className="py-5 px-4 font-light text-white/40">
                    <div className="flex items-center gap-3">
                      <X className="w-5 h-5 opacity-50" />
                      {row.traditional}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <div className="h-4 bg-white/5 border-x border-b border-white/10 rounded-bl-xl rounded-br-xl w-1/3 ml-[33.333333%]" />
        </div>

      </div>
    </section>
  );
}
