// src/components/insurance/TierComparisonTable.tsx (FINAL FIX FOR split() ERROR)

import React from 'react';

interface TierComparisonTableData {
  headers: string[];
  rows: { [key: string]: string | undefined | null }[]; // Allow undefined/null values in rows
  notes?: string[];
}

interface TierComparisonTableProps {
  tableData: TierComparisonTableData;
  title: string;
}

const TierComparisonTable: React.FC<TierComparisonTableProps> = ({ tableData, title }) => {
  if (!tableData || !tableData.headers || !tableData.rows || tableData.rows.length === 0) {
    return <p className="text-gray-500 text-center">Coverage details coming soon.</p>;
  }

  return (
    <div className="mt-12 overflow-x-auto bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-2xl font-bold text-[#342d47] mb-6 text-center">{title}</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {tableData.headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                  header === 'Category' ? 'w-1/4' : 'w-1/4'
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {tableData.headers.map((header, colIndex) => {
                // IMPORTANT CHANGE HERE: Provide a fallback to an empty string
                const content = row[header] || ''; // If row[header] is undefined/null, use ''
                return (
                  <td
                    key={colIndex}
                    className={`px-4 py-4 whitespace-pre-wrap text-sm text-gray-800 ${
                      header === 'Category' ? 'font-medium text-[#342d47]' : ''
                    }`}
                  >
                    {content.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className={pIdx > 0 ? 'mt-2' : ''}>{paragraph}</p>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {tableData.notes && tableData.notes.length > 0 && (
        <div className="mt-6 text-sm text-gray-500">
          {tableData.notes.map((note, index) => (
            <p key={index} className="mb-1">{note}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default TierComparisonTable;