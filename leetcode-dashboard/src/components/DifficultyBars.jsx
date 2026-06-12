/**
 * DifficultyBars – Animated horizontal progress bars
 * Shows Easy / Medium / Hard with solved/total counts
 */
import { useEffect, useRef, useState } from "react";

function Bar({ label, solved, total, color, delay = 0 }) {
  const pct = total > 0 ? Math.min((solved / total) * 100, 100) : 0;
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth(pct), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pct, delay]);

  const colorConfig = {
    green: {
      track: "bg-green-500/20",
      fill: "bg-gradient-to-r from-green-500 to-emerald-400",
      text: "dark:text-green-400 text-green-600",
      badge: "badge-easy",
    },
    yellow: {
      track: "bg-yellow-500/20",
      fill: "bg-gradient-to-r from-yellow-500 to-amber-400",
      text: "dark:text-yellow-400 text-yellow-600",
      badge: "badge-medium",
    },
    red: {
      track: "bg-red-500/20",
      fill: "bg-gradient-to-r from-red-500 to-rose-400",
      text: "dark:text-red-400 text-red-500",
      badge: "badge-hard",
    },
  };

  const c = colorConfig[color];

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${c.badge}`}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <span className={`font-bold ${c.text}`}>{solved}</span>
          <span className="dark:text-gray-500 text-gray-400">/</span>
          <span className="dark:text-gray-400 text-gray-500">{total}</span>
          <span className="dark:text-gray-500 text-gray-400 text-xs ml-1">
            ({pct.toFixed(1)}%)
          </span>
        </div>
      </div>
      <div className={`h-2.5 rounded-full ${c.track} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${c.fill} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function DifficultyBars({ solved, totals }) {
  return (
    <div className="dark:glass-card light-card p-5 md:p-6 space-y-5">
      <h3 className="font-semibold dark:text-white text-gray-900 flex items-center gap-2">
        <span className="text-lg">📊</span> Problem Progress
      </h3>

      {/* Total solved donut-style summary */}
      <div className="flex items-center justify-between py-3 px-4 dark:bg-yellow-500/8 bg-yellow-50 border border-yellow-500/20 rounded-xl">
        <span className="text-sm dark:text-gray-300 text-gray-600">Total Solved</span>
        <span className="text-xl font-extrabold gradient-text">
          {solved.all} <span className="text-sm font-normal dark:text-gray-400 text-gray-500">/ {totals.all}</span>
        </span>
      </div>

      <Bar label="Easy"   solved={solved.easy}   total={totals.easy}   color="green"  delay={0}   />
      <Bar label="Medium" solved={solved.medium} total={totals.medium} color="yellow" delay={150} />
      <Bar label="Hard"   solved={solved.hard}   total={totals.hard}   color="red"    delay={300} />
    </div>
  );
}
