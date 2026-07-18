'use client';

/** Skeleton placeholder displayed while dashboard data loads */
export function SkeletonStatCard() {
  return (
    <div
      className="rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 animate-pulse"
      aria-hidden="true"
    >
      <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
    </div>
  );
}

export function SkeletonAnalysisCard() {
  return (
    <div
      className="rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-4 animate-pulse"
      aria-hidden="true"
    >
      <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="space-y-2">
        <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl" />
      </div>
    </div>
  );
}
