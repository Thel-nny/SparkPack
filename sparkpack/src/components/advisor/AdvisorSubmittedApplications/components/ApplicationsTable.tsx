import React from 'react';
import { Card } from '@/components/ui/card';

interface Application {
  id: string;
  status: 'Submitted' | 'Approved' | 'Denied';
  ensured: string;
  owners: string[];
  product: 'Medical Care Insurance' | 'Legacy Insurance';
  coverageAmount: number;
  dateStarted: string;
  policyNumber: string;
}

interface ApplicationsTableProps {
  currentApplications: Application[];
  formatCurrency: (amount: number) => string;
  loading: boolean;
  error: string | null;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  currentApplications,
  formatCurrency,
  loading,
  error,
}) => {
  return (
    <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600 p-4">Error: {error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#f5f8f3]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                  Ensured
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                  Owner(s)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                  Coverage Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                  Date Started
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                  Policy Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.ensured}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.owners.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(app.coverageAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.dateStarted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.policyNumber}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default ApplicationsTable;
