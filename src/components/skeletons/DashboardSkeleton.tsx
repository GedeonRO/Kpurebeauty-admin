export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow" style={{ padding: '24px' }}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" style={{ marginBottom: '12px' }}></div>
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" style={{ marginBottom: '8px' }}></div>
          <div className="h-3 w-28 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="size-12 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: '20px' }}>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Recent Orders Skeleton */}
      <div className="bg-white rounded-xl border border-gray-100 shadow">
        <div className="border-b border-gray-100" style={{ padding: '20px 24px' }}>
          <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div style={{ padding: '24px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-100 last:border-0" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
              <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 w-48 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert Skeleton */}
      <div className="bg-white rounded-xl border border-gray-100 shadow">
        <div className="border-b border-gray-100" style={{ padding: '20px 24px' }}>
          <div className="h-6 w-40 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
              <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
