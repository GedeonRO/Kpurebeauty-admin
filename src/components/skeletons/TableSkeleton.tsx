interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 10, columns = 5 }: TableSkeletonProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow overflow-hidden">
      {/* Table Header Skeleton */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '16px', padding: '16px' }}>
          {[...Array(columns)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 animate-pulse rounded"></div>
          ))}
        </div>
      </div>

      {/* Table Body Skeleton */}
      <div className="divide-y divide-gray-100">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '16px', padding: '16px' }}>
            {[...Array(columns)].map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
