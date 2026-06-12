/**
 * RecentSubmissions – Table of last 20 accepted submissions
 */
import { ExternalLink, Clock } from "lucide-react";

const LANG_COLORS = {
  python3: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  python: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  java: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  cpp: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  c: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  javascript: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  typescript: "bg-blue-600/20 text-blue-300 border-blue-600/30",
  rust: "bg-red-600/20 text-red-400 border-red-600/30",
  golang: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  kotlin: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  swift: "bg-orange-600/20 text-orange-300 border-orange-600/30",
};

function LangBadge({ lang }) {
  const cls = LANG_COLORS[lang?.toLowerCase()] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30";
  const display = lang === "python3" ? "Python3" : lang === "cpp" ? "C++" : lang?.charAt(0).toUpperCase() + lang?.slice(1);
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-mono font-medium ${cls}`}>
      {display}
    </span>
  );
}

function timeAgo(timestamp) {
  const now = Date.now() / 1000;
  const diff = now - parseInt(timestamp);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(timestamp * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RecentSubmissions({ submissions }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="dark:glass-card light-card p-6 flex items-center justify-center h-40">
        <p className="dark:text-gray-400 text-gray-500 text-sm">No recent submissions found.</p>
      </div>
    );
  }

  return (
    <div className="dark:glass-card light-card p-5 md:p-6">
      <h3 className="font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-lg">✅</span> Recent Accepted Submissions
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="dark:text-gray-500 text-gray-400 text-xs border-b dark:border-white/8 border-black/6">
              <th className="text-left pb-3 font-medium">#</th>
              <th className="text-left pb-3 font-medium">Problem</th>
              <th className="text-left pb-3 font-medium hidden sm:table-cell">Language</th>
              <th className="text-right pb-3 font-medium hidden md:table-cell">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-white/5 divide-black/4">
            {submissions.map((sub, i) => (
              <tr
                key={sub.id}
                className="dark:hover:bg-white/3 hover:bg-black/3 transition-colors group"
              >
                <td className="py-3 pr-3 dark:text-gray-500 text-gray-400 font-mono text-xs w-8">
                  {i + 1}
                </td>
                <td className="py-3 pr-3">
                  <a
                    href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dark:text-gray-200 text-gray-800 hover:text-yellow-500 dark:hover:text-yellow-400 font-medium transition-colors flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
                  >
                    {sub.title}
                    <ExternalLink size={11} className="opacity-0 group-hover:opacity-70 transition-opacity flex-shrink-0" />
                  </a>
                </td>
                <td className="py-3 pr-3 hidden sm:table-cell">
                  <LangBadge lang={sub.lang} />
                </td>
                <td className="py-3 text-right hidden md:table-cell">
                  <span className="dark:text-gray-500 text-gray-400 text-xs flex items-center gap-1 justify-end">
                    <Clock size={10} />
                    {timeAgo(sub.timestamp)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
