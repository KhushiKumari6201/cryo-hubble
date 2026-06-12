/**
 * App.jsx – Root component
 * ─────────────────────────
 * Assembles all dashboard sections, handles theme toggle,
 * refresh button, and error states.
 */
import { useEffect, useState } from "react";
import { Moon, Sun, RefreshCw, Code2, AlertTriangle, Wifi, ExternalLink } from "lucide-react";
import { useTheme } from "./context/ThemeContext";
import { useLeetCode } from "./hooks/useLeetCode";
import ProfileCard from "./components/ProfileCard";
import StatCard from "./components/StatCard";
import DifficultyBars from "./components/DifficultyBars";
import DifficultyPieChart from "./components/DifficultyPieChart";
import ContestRatingChart from "./components/ContestRatingChart";
import HeatmapChart from "./components/HeatmapChart";
import RecentSubmissions from "./components/RecentSubmissions";
import BadgesSection from "./components/BadgesSection";
import CompareUsers from "./components/CompareUsers";
import ShareableCard from "./components/ShareableCard";
import SkeletonLoader from "./components/SkeletonLoader";

const DEFAULT_USER = "brs9Vhbczx";

function Navbar({ onRefresh, refreshing, lastUpdated }) {
  const { isDark, toggle } = useTheme();

  return (
    <nav className="sticky top-0 z-50 dark:bg-[#0F0F23]/90 bg-white/90 backdrop-blur-xl border-b dark:border-white/8 border-black/8 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
            <Code2 size={16} className="text-black" />
          </div>
          <div>
            <div className="font-extrabold dark:text-white text-gray-900 text-sm leading-tight">
              LeetCode Analytics
            </div>
            <div className="text-[10px] dark:text-gray-500 text-gray-400 leading-tight">
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString()}`
                : "Live dashboard"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={`https://leetcode.com/u/${DEFAULT_USER}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
              dark:bg-yellow-500/10 bg-yellow-50 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30
              hover:bg-yellow-500/20 transition-colors"
          >
            <ExternalLink size={11} /> {DEFAULT_USER}
          </a>

          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg
              dark:bg-white/6 bg-black/5 dark:text-gray-300 text-gray-600
              border dark:border-white/10 border-black/10
              hover:border-yellow-500/40 hover:text-yellow-500 transition-all
              disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>

          <button
            onClick={toggle}
            className="p-2 rounded-lg dark:bg-white/6 bg-black/5 border dark:border-white/10 border-black/10
              dark:text-gray-300 text-gray-600 hover:text-yellow-500 hover:border-yellow-500/40 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

function ErrorState({ error, onRetry }) {
  const isNetwork = error?.toLowerCase().includes("network") || error?.toLowerCase().includes("fetch");
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="dark:glass-card light-card p-8 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto">
            {isNetwork ? <Wifi size={28} className="text-red-400" /> : <AlertTriangle size={28} className="text-red-400" />}
          </div>
          <div>
            <h2 className="text-lg font-bold dark:text-white text-gray-900 mb-2">
              {isNetwork ? "Connection Error" : "Failed to Load Data"}
            </h2>
            <p className="text-sm dark:text-gray-400 text-gray-500 leading-relaxed">{error}</p>
            {isNetwork && (
              <p className="text-xs dark:text-gray-500 text-gray-400 mt-3 p-3 dark:bg-white/4 bg-black/4 rounded-lg">
                💡 Make sure the backend proxy is running:<br />
                <code className="font-mono text-yellow-500">cd backend && npm start</code>
              </p>
            )}
          </div>
          <button
            onClick={onRetry}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold hover:from-yellow-400 hover:to-orange-400 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { data, loading, error, refresh, lastUpdated } = useLeetCode(DEFAULT_USER);

  // Fetch on mount
  useEffect(() => { refresh(); }, []);

  return (
    <div className="min-h-screen dark:bg-[#0F0F23] bg-gray-50 transition-colors duration-300">
      {/* Subtle bg glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-500/4 rounded-full blur-3xl" />
      </div>

      <Navbar onRefresh={refresh} refreshing={loading} lastUpdated={lastUpdated} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Loading state */}
        {loading && !data && <SkeletonLoader />}

        {/* Error state */}
        {error && !data && <ErrorState error={error} onRetry={refresh} />}

        {/* Dashboard */}
        {data && (
          <div className="space-y-6">
            {/* ── Profile card ───────────────────────────── */}
            <ProfileCard data={data} />

            {/* ── Stat cards ─────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard
                icon="✅"
                label="Total Solved"
                value={data.solved.all}
                color="orange"
                sublabel={`of ${data.totals.all} total`}
              />
              <StatCard
                icon="🟢"
                label="Easy Solved"
                value={data.solved.easy}
                color="green"
                sublabel={`/ ${data.totals.easy}`}
              />
              <StatCard
                icon="🟡"
                label="Medium Solved"
                value={data.solved.medium}
                color="yellow"
                sublabel={`/ ${data.totals.medium}`}
              />
              <StatCard
                icon="🔴"
                label="Hard Solved"
                value={data.solved.hard}
                color="red"
                sublabel={`/ ${data.totals.hard}`}
              />
              <StatCard
                icon="🎯"
                label="Acceptance Rate"
                value={parseFloat(data.acceptanceRate)}
                suffix="%"
                color="blue"
              />
            </div>

            {/* ── Progress bars + Pie chart ───────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DifficultyBars solved={data.solved} totals={data.totals} />
              <DifficultyPieChart solved={data.solved} />
            </div>

            {/* ── Contest rating chart ────────────────────── */}
            <ContestRatingChart
              contestHistory={data.contestHistory}
              contestRanking={data.contestRanking}
            />

            {/* ── Submission heatmap ──────────────────────── */}
            <HeatmapChart
              submissionCalendar={data.submissionCalendar}
              totalActiveDays={data.totalActiveDays}
              streak={data.streak}
            />

            {/* ── Recent submissions ──────────────────────── */}
            <RecentSubmissions submissions={data.recentSubmissions} />

            {/* ── Badges ─────────────────────────────────── */}
            <BadgesSection badges={data.badges} activeBadge={data.activeBadge} />

            {/* ── Compare + Shareable card ────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CompareUsers primaryData={data} primaryUsername={DEFAULT_USER} />
              <ShareableCard data={data} />
            </div>

            {/* Footer */}
            <div className="text-center text-xs dark:text-gray-600 text-gray-400 pb-4">
              Data fetched live from LeetCode's GraphQL API · Not affiliated with LeetCode
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
