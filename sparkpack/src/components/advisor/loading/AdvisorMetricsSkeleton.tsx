import React from 'react';

export const AdvisorFilterSkeleton: React.FC = () => (
  <div className="flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-2 animate-pulse">
    <div className="h-5 w-5 bg-gray-200 rounded"></div> {/* Filter Icon Placeholder */}
    <div className="h-9 w-28 bg-gray-200 rounded-md"></div> {/* Button Placeholder */}
    <div className="h-9 w-28 bg-gray-200 rounded-md"></div> {/* Button Placeholder */}
    <div className="h-9 w-36 bg-gray-200 rounded-md"></div> {/* Button Placeholder */}
    <div className="h-9 w-36 bg-gray-200 rounded-md"></div> {/* Button Placeholder */}
  </div>
);

export const AdvisorTableSkeleton: React.FC = () => (
  <div className="animate-pulse p-4">
    {/* Table Header Placeholder */}
    <div className="h-8 bg-gray-200 rounded mb-4"></div>
    {/* Table Rows Placeholder */}
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-10 bg-gray-100 rounded mb-2"></div>
    ))}
  </div>
);

// NEW SKELETON FOR DASHBOARD METRICS
export const AdvisorMetricsSkeleton: React.FC = () => (
  <>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="p-4 flex items-center justify-between shadow-sm border border-gray-200 rounded-md animate-pulse bg-gray-50">
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div> {/* Title Placeholder */}
          <div className="h-6 w-16 bg-gray-300 rounded"></div> {/* Value Placeholder */}
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div> {/* Icon Placeholder */}
      </div>
    ))}
  </>
);