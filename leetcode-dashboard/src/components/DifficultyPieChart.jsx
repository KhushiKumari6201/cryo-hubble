/**
 * DifficultyPieChart – Radial chart using Recharts
 */
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  Easy: "#00B8A3",
  Medium: "#FFB800",
  Hard: "#EF4743",
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="custom-tooltip">
        <p className="font-semibold" style={{ color: COLORS[name] }}>
          {name}
        </p>
        <p className="text-sm">
          {value} solved
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DifficultyPieChart({ solved }) {
  const data = [
    { name: "Easy",   value: solved.easy   },
    { name: "Medium", value: solved.medium },
    { name: "Hard",   value: solved.hard   },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="dark:glass-card light-card p-6 flex items-center justify-center h-64">
        <p className="dark:text-gray-400 text-gray-500 text-sm">No solved problems yet</p>
      </div>
    );
  }

  return (
    <div className="dark:glass-card light-card p-5 md:p-6">
      <h3 className="font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-lg">🥧</span> Difficulty Distribution
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
            animationBegin={200}
            animationDuration={1200}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            formatter={(value) => (
              <span className="dark:text-gray-300 text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="text-center -mt-2">
        <span className="text-xs dark:text-gray-400 text-gray-500">
          Total: {solved.all} solved
        </span>
      </div>
    </div>
  );
}
