/**
 * CompareUsers – Side-by-side user comparison panel
 * Allows searching a second LeetCode user and comparing stats.
 */
import { useState, useEffect } from "react";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import { useLeetCode } from "../hooks/useLeetCode";

function StatRow({ label, a, b, format = (v) => v }) {
  const aVal = typeof a === "number" ? a : 0;
  const bVal = typeof b === "number" ? b : 0;
  const aWins = aVal > bVal;
  const bWins = bVal > aVal;

  return (
    <div className="grid grid-cols-3 gap-2 items-center py-2.5 border-b dark:border-white/5 border-black/4 last:border-0">
      <div
        className={`text-right text-sm font-semibold ${
          aWins ? "text-green-400" : "dark:text-gray-300 text-gray-700"
        }`}
      >
        {format(a ?? "—")}
      </div>
      <div className="text-center text-xs dark:text-gray-500 text-gray-400 font-medium">{label}</div>
      <div
        className={`text-left text-sm font-semibold ${
          bWins ? "text-green-400" : "dark:text-gray-300 text-gray-700"
        }`}
      >
        {format(b ?? "—")}
      </div>
    </div>
  );
}

export default function CompareUsers({ primaryData, primaryUsername }) {
  const [inputVal, setInputVal] = useState("");
  const [compareUsername, setCompareUsername] = useState(null);
  const { data: compareData, loading, error, refresh } = useLeetCode(compareUsername);

  useEffect(() => {
    if (compareUsername) refresh();
  }, [compareUsername]);

  const handleSearch = (e) => {
    e.preventDefault();
    const val = inputVal.trim();
    if (val && val !== primaryUsername) setCompareUsername(val);
  };

  return (
    <div className="dark:glass-card light-card p-5 md:p-6">
      <h3 className="font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-lg">⚔️</span> Compare Users
      </h3>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-gray-400 text-gray-400" />
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Enter LeetCode username..."
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg
              dark:bg-white/6 bg-black/5 border dark:border-white/10 border-black/10
              dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
          />
        </div>
        <button
          type="submit"
          disabled={!inputVal.trim() || loading}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-yellow-500 text-black hover:bg-yellow-400
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Compare"}
        </button>
        {compareUsername && (
          <button
            type="button"
            onClick={() => { setCompareUsername(null); setInputVal(""); }}
            className="p-2 rounded-lg dark:bg-white/6 bg-black/5 dark:text-gray-400 text-gray-500 hover:text-red-400 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Error state */}
      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4">
          ❌ {error}
        </div>
      )}

      {/* Comparison table */}
      {compareData && primaryData ? (
        <div>
          {/* Header */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="text-right">
              <div className="text-sm font-bold text-yellow-500">{primaryUsername}</div>
              <div className="text-xs dark:text-gray-500 text-gray-400">You</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full dark:bg-white/6 bg-black/5 flex items-center justify-center">
                <ArrowRight size={14} className="dark:text-gray-400 text-gray-400" />
              </div>
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-purple-400">{compareUsername}</div>
              <div className="text-xs dark:text-gray-500 text-gray-400">Rival</div>
            </div>
          </div>

          <div className="mt-3">
            <StatRow label="Total Solved"   a={primaryData.solved.all}   b={compareData.solved.all} />
            <StatRow label="Easy"           a={primaryData.solved.easy}  b={compareData.solved.easy} />
            <StatRow label="Medium"         a={primaryData.solved.medium} b={compareData.solved.medium} />
            <StatRow label="Hard"           a={primaryData.solved.hard}  b={compareData.solved.hard} />
            <StatRow label="Accept Rate"    a={parseFloat(primaryData.acceptanceRate)} b={parseFloat(compareData.acceptanceRate)} format={(v) => typeof v === "number" ? `${v}%` : v} />
            <StatRow label="Contest Rating" a={primaryData.contestRanking?.rating ? Math.round(primaryData.contestRanking.rating) : null} b={compareData.contestRanking?.rating ? Math.round(compareData.contestRanking.rating) : null} />
            <StatRow label="Contests"       a={primaryData.contestRanking?.attendedContestsCount} b={compareData.contestRanking?.attendedContestsCount} />
            <StatRow label="Streak"         a={primaryData.streak}        b={compareData.streak} />
            <StatRow label="Global Rank"    a={primaryData.ranking}       b={compareData.ranking} format={(v) => v ? `#${v?.toLocaleString()}` : "—"} />
          </div>

          <p className="text-xs dark:text-gray-500 text-gray-400 mt-3 text-center">
            🟢 Green = higher / better value
          </p>
        </div>
      ) : !compareUsername && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3 opacity-50">⚔️</div>
          <p className="text-sm dark:text-gray-400 text-gray-500">
            Enter a username above to compare stats side-by-side
          </p>
        </div>
      )}
    </div>
  );
}
