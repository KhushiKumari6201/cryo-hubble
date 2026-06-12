/**
 * ProfileCard – Hero card with avatar, stats, and social links
 */
import { MapPin, Building2, GraduationCap, ExternalLink, Trophy, Star } from "lucide-react";

export default function ProfileCard({ data }) {
  const { username, avatar, realName, ranking, country, company, school, aboutMe, contestRanking, activeBadge, streak } = data;

  const lcUrl = `https://leetcode.com/u/${username}/`;

  return (
    <div className="glass-card dark:glass-card light-card p-6 md:p-8 animate-slide-up">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden ring-4 ring-yellow-500/30 glow-orange">
            {avatar ? (
              <img src={avatar} alt={username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white">
                {username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          {activeBadge && (
            <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-1 text-xs" title={activeBadge.displayName}>
              🏆
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap justify-center sm:justify-start">
            <h1 className="text-2xl md:text-3xl font-extrabold dark:text-white text-gray-900">
              {realName || username}
            </h1>
            <a
              href={lcUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-yellow-500 hover:text-yellow-400 text-sm font-medium transition-colors"
            >
              @{username} <ExternalLink size={12} />
            </a>
          </div>

          {aboutMe && (
            <p className="mt-2 text-sm dark:text-gray-400 text-gray-600 max-w-lg line-clamp-2">
              {aboutMe}
            </p>
          )}

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
            {country && (
              <span className="inline-flex items-center gap-1 text-xs dark:text-gray-300 text-gray-600 dark:bg-white/5 bg-black/5 px-2.5 py-1 rounded-full">
                <MapPin size={11} /> {country}
              </span>
            )}
            {company && (
              <span className="inline-flex items-center gap-1 text-xs dark:text-gray-300 text-gray-600 dark:bg-white/5 bg-black/5 px-2.5 py-1 rounded-full">
                <Building2 size={11} /> {company}
              </span>
            )}
            {school && (
              <span className="inline-flex items-center gap-1 text-xs dark:text-gray-300 text-gray-600 dark:bg-white/5 bg-black/5 px-2.5 py-1 rounded-full">
                <GraduationCap size={11} /> {school}
              </span>
            )}
          </div>
        </div>

        {/* Ranking pill */}
        <div className="flex flex-col items-center gap-1">
          {ranking && ranking < 9999999 ? (
            <div className="text-center dark:bg-yellow-500/10 bg-yellow-50 border border-yellow-500/30 rounded-xl px-4 py-3">
              <div className="text-xs dark:text-yellow-400 text-yellow-600 font-medium mb-0.5">Global Rank</div>
              <div className="text-xl font-extrabold dark:text-yellow-300 text-yellow-700">
                #{ranking?.toLocaleString()}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t dark:border-white/10 border-black/8">
        {/* Streak */}
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">{streak || 0}</div>
          <div className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">Current Streak</div>
        </div>
        {/* Contest rating */}
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {contestRanking?.rating ? Math.round(contestRanking.rating) : "N/A"}
          </div>
          <div className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">Contest Rating</div>
        </div>
        {/* Contests attended */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {contestRanking?.attendedContestsCount ?? "—"}
          </div>
          <div className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">Contests</div>
        </div>
        {/* Top % */}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {contestRanking?.topPercentage ? `${contestRanking.topPercentage.toFixed(1)}%` : "—"}
          </div>
          <div className="text-xs dark:text-gray-400 text-gray-500 mt-0.5">Top %</div>
        </div>
      </div>
    </div>
  );
}
