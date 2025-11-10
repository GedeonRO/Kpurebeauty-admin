export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="flex items-start justify-between">
        <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full"></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-4/6 bg-gray-200 animate-pulse rounded"></div>
      </div>

      <div className="flex items-center justify-between" style={{ paddingTop: '8px' }}>
        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  );
}

interface CardGridSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4;
}

export function CardGridSkeleton({ count = 9, columns = 3 }: CardGridSkeletonProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="flex" style={{ gap: '12px' }}>
          <div className="h-10 w-64 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className={`grid ${gridCols[columns]}`} style={{ gap: '20px' }}>
        {[...Array(count)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
