/**
 * ShareableCard – Styled profile card with Export PNG button
 * Uses html2canvas to capture the card as a downloadable PNG.
 */
import { useRef, useState } from "react";
import { Download, Share2, Loader2 } from "lucide-react";

export default function ShareableCard({ data }) {
  const cardRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  const {
    username, avatar, realName, ranking, country,
    solved, totals, acceptanceRate,
    contestRanking, badges, streak,
  } = data;

  const exportPNG = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#1A1A2E",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `leetcode-${username}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Make sure the backend is running.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="dark:glass-card light-card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold dark:text-white text-gray-900 flex items-center gap-2">
          <span className="text-lg">🪪</span> Shareable Profile Card
        </h3>
        <button
          onClick={exportPNG}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg
            bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400
            disabled:opacity-60 transition-all duration-200 shadow-lg shadow-yellow-500/20"
        >
          {exporting ? (
            <><Loader2 size={14} className="animate-spin" /> Exporting…</>
          ) : (
            <><Download size={14} /> Export PNG</>
          )}
        </button>
      </div>

      {/* The card itself (captured by html2canvas) */}
      <div
        ref={cardRef}
        id="shareable-card"
        className="rounded-2xl p-6 md:p-8"
        style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-5 mb-6">
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              crossOrigin="anonymous"
              className="w-20 h-20 rounded-2xl ring-4 ring-yellow-500/40"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
              {username?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-white font-extrabold text-2xl">{realName || username}</div>
            <div className="text-yellow-400 text-sm mt-0.5">@{username}</div>
            {country && <div className="text-gray-400 text-xs mt-0.5">📍 {country}</div>}
          </div>
          {/* LeetCode logo watermark */}
          <div className="ml-auto text-right">
            <div className="text-yellow-500 font-black text-lg">LC</div>
            <div className="text-gray-500 text-[10px]">Analytics</div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Solved", value: solved.all, color: "#FFA116" },
            { label: "Easy",   value: solved.easy,   color: "#00B8A3" },
            { label: "Medium", value: solved.medium, color: "#FFB800" },
            { label: "Hard",   value: solved.hard,   color: "#EF4743" },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center bg-white/5 rounded-xl p-3">
              <div className="font-extrabold text-xl" style={{ color }}>{value}</div>
              <div className="text-gray-400 text-[11px] mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Contest & Streak */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center bg-white/5 rounded-xl p-3">
            <div className="font-bold text-purple-400 text-lg">
              {contestRanking?.rating ? Math.round(contestRanking.rating) : "N/A"}
            </div>
            <div className="text-gray-400 text-[11px] mt-0.5">Rating</div>
          </div>
          <div className="text-center bg-white/5 rounded-xl p-3">
            <div className="font-bold text-blue-400 text-lg">
              {ranking && ranking < 9999999 ? `#${ranking.toLocaleString()}` : "—"}
            </div>
            <div className="text-gray-400 text-[11px] mt-0.5">Global Rank</div>
          </div>
          <div className="text-center bg-white/5 rounded-xl p-3">
            <div className="font-bold text-orange-400 text-lg">🔥 {streak}</div>
            <div className="text-gray-400 text-[11px] mt-0.5">Streak</div>
          </div>
        </div>

        {/* Difficulty mini bars */}
        <div className="space-y-2">
          {[
            { label: "Easy",   solved: solved.easy,   total: totals.easy,   color: "#00B8A3" },
            { label: "Medium", solved: solved.medium, total: totals.medium, color: "#FFB800" },
            { label: "Hard",   solved: solved.hard,   total: totals.hard,   color: "#EF4743" },
          ].map(({ label, solved: s, total, color }) => {
            const pct = total > 0 ? ((s / total) * 100).toFixed(0) : 0;
            return (
              <div key={label} className="flex items-center gap-3">
                <span className="text-gray-400 text-xs w-12">{label}</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-gray-400 text-xs w-16 text-right">{s}/{total}</span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-gray-500 text-[10px]">
            Accept Rate: <span className="text-gray-300">{acceptanceRate}%</span>
            {badges.length > 0 && (
              <span className="ml-3">Badges: <span className="text-gray-300">{badges.length}</span></span>
            )}
          </div>
          <div className="text-gray-600 text-[10px]">
            leetcode.com/u/{username}
          </div>
        </div>
      </div>
    </div>
  );
}
