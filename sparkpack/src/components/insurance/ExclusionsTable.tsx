// src/components/insurance/ExclusionsTable.tsx (UPDATED)
import React from 'react';
import { XCircle } from 'lucide-react';

interface ExclusionItem {
  category: string;
  explanation: string;
  reason: string;
}

interface ExclusionsTableProps {
  exclusions: ExclusionItem[];
}

const ExclusionsTable: React.FC<ExclusionsTableProps> = ({ exclusions }) => {
  if (!exclusions || exclusions.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 bg-red-50 p-6 rounded-lg shadow-inner border border-red-100">
      <h3 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
        <XCircle className="h-6 w-6" /> What We Do Not Cover
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-red-200">
          <thead className="bg-red-100">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-red-800 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-red-800 uppercase tracking-wider">
                What's Not Covered (Examples)
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-red-800 uppercase tracking-wider">
                Why
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-red-100">
            {exclusions.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-4 whitespace-normal text-sm font-medium text-red-700">
                  {item.category}
                </td>
                <td className="px-4 py-4 whitespace-normal text-sm text-red-600">
                  {item.explanation}
                </td>
                <td className="px-4 py-4 whitespace-normal text-sm text-red-600">
                  {item.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExclusionsTable;