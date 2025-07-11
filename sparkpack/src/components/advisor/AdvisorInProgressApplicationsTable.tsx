import React from 'react';
import { Input } from '@/components/ui/input';

interface Application {
  id: string;
  status: string;
  ensured: string;
  customer: {
    firstName: string;
    lastName: string
  }
  product: string;
  coverageAmount: number;
  dateStarted: string;
  policyNumber: string;
}

interface TableProps {
  applications: Application[];
  activeRowId: string | null;
  setActiveRowId: (id: string | null) => void;
  advisorNames: Record<string, string>;
  setAdvisorNames: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  formatCurrency: (amount: number) => string;
  isEditable?: boolean;
}

const AdvisorInProgressApplicationsTable: React.FC<TableProps> = ({
  applications,
  activeRowId,
  setActiveRowId,
  advisorNames,
  setAdvisorNames,
  formatCurrency,
  isEditable = true,
}) => {
  return (
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
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
              Advisor
            </th>
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span>{app.status}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {app.ensured}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {app.customer.firstName} {app.customer.lastName}
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {isEditable ? (
                  activeRowId === app.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={advisorNames[app.id] || ''}
                        onChange={(e) =>
                          setAdvisorNames((prev) => ({
                            ...prev,
                            [app.id]: e.target.value,
                          }))
                        }
                        onClick={(e) => e.stopPropagation()} // Prevent row toggle when clicking input
                        autoFocus
                        placeholder="Assign advisor"
                        className="w-full"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveRowId(null);
                        }}
                        className="text-green-600 hover:text-green-800"
                        aria-label="Submit advisor name"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : advisorNames[app.id] ? (
                    <span
                      title={advisorNames[app.id]}
                      className="inline-block max-w-[10ch] truncate"
                    >
                      {advisorNames[app.id]}
                    </span>
                  ) : (
                    <span>Click to assign</span>
                  )
                ) : (
                  <span>{advisorNames[app.id] || ''}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdvisorInProgressApplicationsTable;
