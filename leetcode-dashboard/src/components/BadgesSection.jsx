/**
 * BadgesSection – Visual grid of earned LeetCode badges
 */
export default function BadgesSection({ badges, activeBadge }) {
  if (!badges || badges.length === 0) {
    return (
      <div className="dark:glass-card light-card p-6 flex flex-col items-center justify-center gap-3 h-40">
        <span className="text-4xl opacity-40">🎖️</span>
        <p className="dark:text-gray-400 text-gray-500 text-sm">No badges earned yet.</p>
      </div>
    );
  }

  return (
    <div className="dark:glass-card light-card p-5 md:p-6">
      <h3 className="font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-lg">🏅</span> Badges Earned
        <span className="ml-auto text-xs dark:bg-yellow-500/15 bg-yellow-50 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">
          {badges.length}
        </span>
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {badges.map((badge) => {
          const isActive = activeBadge?.displayName === badge.displayName;
          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 cursor-default
                ${isActive
                  ? "dark:bg-yellow-500/15 bg-yellow-50 border border-yellow-500/40 glow-orange"
                  : "dark:bg-white/4 bg-black/4 border dark:border-white/8 border-black/6 dark:hover:bg-white/8 hover:bg-black/6"
                }`}
              title={badge.displayName}
            >
              {badge.icon ? (
                <img
                  src={badge.icon}
                  alt={badge.displayName}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
              ) : null}
              <span className="text-2xl hidden">🏅</span>
              <span className="text-[10px] dark:text-gray-400 text-gray-500 text-center leading-tight line-clamp-2">
                {badge.displayName}
              </span>
              {isActive && (
                <span className="text-[9px] text-yellow-500 font-semibold">Active</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
