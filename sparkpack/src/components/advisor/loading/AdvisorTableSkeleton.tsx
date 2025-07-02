import React from 'react';

const AdvisorTableSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse p-4 rounded-md bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {/* Skeletons for 7 column headers */}
              {[...Array(7)].map((_, i) => (
                <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Skeletons for n rows of table data */}
            {[...Array(7)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {/* Skeletons for 7 cells per row */}
                {[...Array(7)].map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdvisorTableSkeleton;