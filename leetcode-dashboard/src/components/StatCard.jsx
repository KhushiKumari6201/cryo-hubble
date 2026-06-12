/**
 * StatCard – Animated counter card for a single metric
 */
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ target, duration = 1400 }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            setCurrent(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{current.toLocaleString()}</span>;
}

export default function StatCard({ icon, label, value, suffix = "", color = "orange", sublabel }) {
  const colorMap = {
    orange: {
      icon: "bg-yellow-500/15 text-yellow-500",
      glow: "hover:shadow-yellow-500/20",
      border: "hover:border-yellow-500/40",
      text: "dark:text-yellow-300 text-yellow-700",
    },
    green: {
      icon: "bg-green-500/15 text-green-500",
      glow: "hover:shadow-green-500/20",
      border: "hover:border-green-500/40",
      text: "dark:text-green-300 text-green-700",
    },
    yellow: {
      icon: "bg-amber-500/15 text-amber-500",
      glow: "hover:shadow-amber-500/20",
      border: "hover:border-amber-500/40",
      text: "dark:text-amber-300 text-amber-700",
    },
    red: {
      icon: "bg-red-500/15 text-red-500",
      glow: "hover:shadow-red-500/20",
      border: "hover:border-red-500/40",
      text: "dark:text-red-300 text-red-700",
    },
    purple: {
      icon: "bg-purple-500/15 text-purple-400",
      glow: "hover:shadow-purple-500/20",
      border: "hover:border-purple-500/40",
      text: "dark:text-purple-300 text-purple-700",
    },
    blue: {
      icon: "bg-blue-500/15 text-blue-400",
      glow: "hover:shadow-blue-500/20",
      border: "hover:border-blue-500/40",
      text: "dark:text-blue-300 text-blue-700",
    },
  };

  const c = colorMap[color] || colorMap.orange;
  const numericValue = typeof value === "number" ? value : parseFloat(value) || 0;
  const isNumeric = typeof value === "number" || !isNaN(parseFloat(value));

  return (
    <div
      className={`dark:glass-card light-card p-5 flex flex-col gap-3 transition-all duration-300
        hover:shadow-lg ${c.glow} border dark:border-white/8 ${c.border} cursor-default group`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon} text-xl transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>

      {/* Value */}
      <div>
        <div className={`text-3xl font-extrabold ${c.text}`}>
          {isNumeric ? (
            <>
              <AnimatedNumber target={numericValue} />
              {suffix}
            </>
          ) : (
            <span>{value}</span>
          )}
        </div>
        <div className="text-sm dark:text-gray-400 text-gray-500 font-medium mt-0.5">{label}</div>
        {sublabel && (
          <div className="text-xs dark:text-gray-500 text-gray-400 mt-0.5">{sublabel}</div>
        )}
      </div>
    </div>
  );
}
