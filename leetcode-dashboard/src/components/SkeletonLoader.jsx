/**
 * SkeletonLoader – Shimmer placeholder while data loads
 */
function SkeletonBox({ className = "" }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export default function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Profile card skeleton */}
      <div className="dark:glass-card light-card p-6 md:p-8">
        <div className="flex gap-6 items-start">
          <SkeletonBox className="w-24 h-24 md:w-28 md:h-28 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <SkeletonBox className="h-7 w-48" />
            <SkeletonBox className="h-4 w-32" />
            <div className="flex gap-2 mt-2">
              <SkeletonBox className="h-6 w-20 rounded-full" />
              <SkeletonBox className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-6 pt-5 border-t dark:border-white/10 border-black/8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center space-y-1">
              <SkeletonBox className="h-7 w-14 mx-auto" />
              <SkeletonBox className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="dark:glass-card light-card p-5 space-y-3">
            <SkeletonBox className="w-10 h-10 rounded-xl" />
            <SkeletonBox className="h-8 w-16" />
            <SkeletonBox className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Progress + pie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="dark:glass-card light-card p-6 space-y-4">
          <SkeletonBox className="h-5 w-36" />
          <SkeletonBox className="h-10 rounded-xl" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <SkeletonBox className="h-5 w-12 rounded-full" />
                <SkeletonBox className="h-4 w-20" />
              </div>
              <SkeletonBox className="h-2.5 rounded-full" />
            </div>
          ))}
        </div>
        <div className="dark:glass-card light-card p-6 space-y-4">
          <SkeletonBox className="h-5 w-40" />
          <SkeletonBox className="h-48 rounded-xl" />
        </div>
      </div>

      {/* Charts skeleton */}
      <div className="dark:glass-card light-card p-6 space-y-4">
        <SkeletonBox className="h-5 w-52" />
        <SkeletonBox className="h-64 rounded-xl" />
      </div>

      {/* Heatmap skeleton */}
      <div className="dark:glass-card light-card p-6 space-y-4">
        <SkeletonBox className="h-5 w-44" />
        <SkeletonBox className="h-32 rounded-xl" />
      </div>
    </div>
  );
}
