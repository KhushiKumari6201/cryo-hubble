/**
 * ContestRatingChart – Line chart of contest rating history using Recharts
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="custom-tooltip min-w-[180px]">
        <p className="font-semibold text-yellow-400 text-xs mb-1 truncate">{d.title}</p>
        <p className="text-sm">
          Rating: <span className="font-bold text-white">{Math.round(d.rating)}</span>
        </p>
        <p className="text-xs dark:text-gray-400 text-gray-300">
          Rank: #{d.ranking?.toLocaleString()}
        </p>
        <p className="text-xs dark:text-gray-400 text-gray-300">
          Solved: {d.problemsSolved}/{d.totalProblems}
        </p>
      </div>
    );
  }
  return null;
};

export default function ContestRatingChart({ contestHistory, contestRanking }) {
  if (!contestHistory || contestHistory.length === 0) {
    return (
      <div className="dark:glass-card light-card p-6 flex flex-col items-center justify-center h-64 gap-3">
        <span className="text-4xl">🏆</span>
        <p className="dark:text-gray-400 text-gray-500 text-sm text-center">
          No contest history yet. <br />
          <a
            href="https://leetcode.com/contest/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 hover:underline"
          >
            Join a contest →
          </a>
        </p>
      </div>
    );
  }

  // Sort by date and format for chart
  const chartData = [...contestHistory]
    .sort((a, b) => a.contest.startTime - b.contest.startTime)
    .map((h, i) => ({
      idx: i + 1,
      title: h.contest.title,
      rating: h.rating,
      ranking: h.ranking,
      problemsSolved: h.problemsSolved,
      totalProblems: h.totalProblems,
      date: new Date(h.contest.startTime * 1000).toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
    }));

  const minRating = Math.min(...chartData.map((d) => d.rating));
  const maxRating = Math.max(...chartData.map((d) => d.rating));
  const domain = [Math.floor(minRating * 0.97), Math.ceil(maxRating * 1.03)];

  return (
    <div className="dark:glass-card light-card p-5 md:p-6">
      <div className="flex items-start justify-between mb-4 gap-2 flex-wrap">
        <h3 className="font-semibold dark:text-white text-gray-900 flex items-center gap-2">
          <span className="text-lg">📈</span> Contest Rating History
        </h3>
        {contestRanking && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs dark:text-gray-400 text-gray-500">
              {contestHistory.length} contests
            </span>
            <span className="text-xs bg-purple-500/15 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full font-semibold">
              Current: {Math.round(contestRanking.rating)}
            </span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={domain}
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="rating"
            stroke="#A78BFA"
            strokeWidth={2.5}
            fill="url(#ratingGradient)"
            dot={{ fill: "#A78BFA", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: "#A78BFA", stroke: "rgba(167,139,250,0.4)", strokeWidth: 4 }}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
