import React from 'react';

const AdvisorFilterSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-4">
      {/* Placeholder for Filter Icon */}
      <div className="h-5 w-5 bg-gray-200 rounded-sm"></div>

      {/* Placeholders for Filter Buttons */}
      <div className="flex space-x-4">
        {/* Status Filter Button */}
        <div className="h-10 w-28 bg-gray-200 rounded-md"></div>
        {/* Product Filter Button */}
        <div className="h-10 w-28 bg-gray-200 rounded-md"></div>
        {/* Coverage Amount Filter Button */}
        <div className="h-10 w-36 bg-gray-200 rounded-md"></div>
        {/* Date Started Filter Button */}
        <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
      </div>

      {/* Placeholder for Clear Filters Button (optional/conditional) */}
      <div className="h-10 w-32 bg-gray-200 rounded-md sm:ml-auto"></div>
    </div>
  );
};

export default AdvisorFilterSkeleton;