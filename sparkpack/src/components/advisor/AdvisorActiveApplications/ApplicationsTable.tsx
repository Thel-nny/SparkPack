import React from 'react';
import { Input } from '@/components/ui/input';

interface Application {
  id: string;
  status: string;
  ensured: string;
  owners: string[];
  product: string;
  coverageAmount: number;
  dateStarted: string;
  policyNumber: string;
  advisorName?: string;
  customer: {
    firstName: string;
    lastName: string;
  };
}

interface ApplicationsTableProps {
  applications: Application[];
  activeRowId: string | null;
  setActiveRowId: (id: string | null) => void;
  advisorNames: Record<string, string>;
  setAdvisorNames: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  formatCurrency: (amount: number) => string;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  activeRowId,
  setActiveRowId,
  advisorNames,
  setAdvisorNames,
  formatCurrency,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#f5f8f3]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">Ensured</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">Owner(s)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">Coverage Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">Date Started</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">Policy Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">Advisor</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((app) => (
            <tr
              key={app.id}
              className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                activeRowId === app.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => setActiveRowId(activeRowId === app.id ? null : app.id)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.ensured}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.customer.firstName} {app.customer.lastName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.product}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(app.coverageAmount)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.dateStarted}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.policyNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {advisorNames[app.id] ? (
                  <span title={advisorNames[app.id]} className="inline-block max-w-[10ch] truncate">
                    {advisorNames[app.id]}
                  </span>
                ) : (
                  <span>N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsTable;
