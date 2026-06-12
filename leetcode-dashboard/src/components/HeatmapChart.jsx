/**
 * HeatmapChart – GitHub-style submission activity heatmap
 * Renders the last 52 weeks of submission data.
 */
import { useMemo, useState } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

function getColor(count, isDark) {
  if (count === 0) return isDark ? "#1e2235" : "#f0f4f8";
  if (count <= 2)  return "#0e4429";
  if (count <= 5)  return "#006d32";
  if (count <= 9)  return "#26a641";
  return "#39d353";
}

export default function HeatmapChart({ submissionCalendar, totalActiveDays, streak }) {
  const [tooltip, setTooltip] = useState(null);
  const isDark = document.documentElement.classList.contains("dark");

  // Build a 52-week grid (364 days) ending today
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    // Go back 52 weeks from today's Sunday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7 * 52);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const weeks = [];
    const monthLabels = [];
    let lastMonth = -1;

    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + w * 7 + d);

        const ts = Math.floor(date.getTime() / 1000);
        // LeetCode stores timestamps as unix seconds; try both ±1 day
        const count = submissionCalendar?.[ts] ?? submissionCalendar?.[ts - 86400] ?? 0;

        const month = date.getMonth();
        if (month !== lastMonth && d === 0) {
          monthLabels.push({ week: w, label: MONTHS[month] });
          lastMonth = month;
        }

        week.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          count,
          isFuture: date > today,
        });
      }
      weeks.push(week);
    }

    return { weeks, monthLabels };
  }, [submissionCalendar]);

  const CELL = 12;
  const GAP = 2;

  return (
    <div className="dark:glass-card light-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-semibold dark:text-white text-gray-900 flex items-center gap-2">
          <span className="text-lg">🔥</span> Submission Heatmap
        </h3>
        <div className="flex items-center gap-4 text-xs dark:text-gray-400 text-gray-500">
          <span>{totalActiveDays} active days</span>
          <span className="text-orange-400">🔥 {streak} day streak</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="relative" style={{ width: `${weeks.length * (CELL + GAP)}px` }}>
          {/* Month labels */}
          <div className="flex mb-1" style={{ paddingLeft: "20px" }}>
            {monthLabels.map(({ week, label }) => (
              <div
                key={`${week}-${label}`}
                className="absolute text-[10px] dark:text-gray-500 text-gray-400"
                style={{ left: `${20 + week * (CELL + GAP)}px` }}
              >
                {label}
              </div>
            ))}
          </div>

          <div className="flex mt-4">
            {/* Day-of-week labels */}
            <div className="flex flex-col mr-1" style={{ gap: `${GAP}px` }}>
              {DAYS.map((d, i) => (
                <div
                  key={i}
                  className="text-[10px] dark:text-gray-500 text-gray-400 flex items-center"
                  style={{ height: `${CELL}px`, lineHeight: `${CELL}px` }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="flex" style={{ gap: `${GAP}px` }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                  {week.map((cell, di) => (
                    <div
                      key={di}
                      className="heatmap-cell rounded-[3px]"
                      style={{
                        width: CELL,
                        height: CELL,
                        backgroundColor: cell.isFuture
                          ? "transparent"
                          : getColor(cell.count, isDark),
                        opacity: cell.isFuture ? 0 : 1,
                      }}
                      onMouseEnter={(e) =>
                        setTooltip({
                          x: e.clientX,
                          y: e.clientY,
                          text: `${cell.count} submission${cell.count !== 1 ? "s" : ""} on ${cell.date}`,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[10px] dark:text-gray-500 text-gray-400 mr-1">Less</span>
        {[0, 2, 5, 9, 15].map((n) => (
          <div
            key={n}
            className="rounded-[3px]"
            style={{ width: 10, height: 10, backgroundColor: getColor(n, isDark) }}
          />
        ))}
        <span className="text-[10px] dark:text-gray-500 text-gray-400 ml-1">More</span>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-1.5 text-xs rounded-lg custom-tooltip pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 36 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
