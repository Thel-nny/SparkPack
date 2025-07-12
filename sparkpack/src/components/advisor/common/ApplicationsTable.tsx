'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card'; // Card is used in the submitted applications table

// Define a comprehensive Application interface that covers all possible fields
// from the different table contexts.
interface Application {
  id: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'SIGNATURE_PROCESS_PENDING' | 'SIGNATURE_IN_PROCESS' | string;
  ensured: string; // This will typically be the customer's full name
  owners: string[]; // This will typically be an array of pet names
  product: string;
  coverageAmount: number;
  dateStarted: string;
  policyNumber: string;
  // Optional fields that might be present depending on the application type or API response
  customer?: { // Used by Active/InProgress tables for owner(s) column
    firstName: string;
    lastName: string;
  };
  advisorName?: string; // Used by Active/InProgress tables for advisor column
}

// Define the props for the consolidated ApplicationsTable component
interface ApplicationsTableProps {
  applications: Application[];
  formatCurrency: (amount: number) => string;
  loading: boolean;
  error: string | null;
  
  // Props specific to the "Advisor Assignment" feature (used by Active/InProgress)
  showAdvisorAssignment?: boolean;
  activeRowId?: string | null; // ID of the row with an active advisor input
  setActiveRowId?: (id: string | null) => void;
  advisorNames?: Record<string, string>; // Map of application ID to advisor name
  setAdvisorNames?: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  // Props specific to the "Status Dropdown" feature (used by Submitted)
  showStatusDropdown?: boolean;
  handleStatusChange?: (appId: string, newStatus: string) => Promise<void>;
  userRole?: string | null; // Role of the current user (e.g., "ADMIN")

  // Prop for general row click, typically for opening a summary modal (used by Submitted)
  onRowClick?: (app: Application) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications: propApplications, // Rename prop to avoid conflict with local state
  formatCurrency,
  loading,
  error,
  showAdvisorAssignment = false, // Default to false
  activeRowId,
  setActiveRowId,
  advisorNames,
  setAdvisorNames,
  showStatusDropdown = false, // Default to false
  handleStatusChange,
  userRole,
  onRowClick,
}) => {
  // Local state to manage applications, primarily for immediate UI updates
  // when status changes (relevant for showStatusDropdown).
  const [localApplications, setLocalApplications] = useState(propApplications);

  // Sync local state when the propApplications change (e.g., after a new fetch)
  useEffect(() => {
    setLocalApplications(propApplications);
  }, [propApplications]);

  // Handle status change for the dropdown (specific to submitted applications)
  const onStatusChange = useCallback(async (appId: string, newStatus: string) => {
    if (handleStatusChange) {
      try {
        await handleStatusChange(appId, newStatus);
        // Optimistically update local state for immediate UI feedback
        setLocalApplications((prevApps) =>
          prevApps.map((app) =>
            app.id === appId ? { ...app, status: newStatus as Application['status'] } : app
          )
        );
        console.log("Status updated successfully."); // Replace with a proper toast/notification
      } catch (err: any) {
        console.error("Error updating status:", err); // Replace with a proper toast/notification
        // Revert local state if update fails (optional, depends on UX)
        setLocalApplications(propApplications); // Revert to prop state on error
      }
    }
  }, [handleStatusChange, propApplications]);

  // Determine if any filters are active.
  const areFiltersActive = useCallback(() => {
    // This function is a placeholder. In a real scenario, this would check
    // the filter states from the parent component (e.g., AdvisorSubmittedApplications)
    // to determine if the "No applications found" message should be more specific.
    // For now, it just checks if there are applications.
    // Changed 'applications.length' to 'localApplications.length' to resolve the TypeScript error.
    return localApplications.length === 0 && !loading && !error;
  }, [localApplications.length, loading, error]);


  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={showAdvisorAssignment ? 8 : 7} className="text-center py-8 text-gray-500">
            Loading applications...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={showAdvisorAssignment ? 8 : 7} className="text-center py-8 text-red-600">
            Error: {error}
          </td>
        </tr>
      );
    }

    if (localApplications.length === 0) {
      return (
        <tr>
          <td colSpan={showAdvisorAssignment ? 8 : 7} className="text-center py-8 text-gray-500">
            No applications found.
          </td>
        </tr>
      );
    }

    return (
      <>
        {localApplications.map((app) => (
          <tr
            key={app.id}
            className={`hover:bg-gray-50 transition-colors duration-150 ${
              activeRowId === app.id && showAdvisorAssignment ? 'bg-gray-100' : ''
            } ${onRowClick ? 'cursor-pointer' : ''}`} // Add cursor-pointer if onRowClick is provided
            onClick={() => {
              if (onRowClick) {
                onRowClick(app);
              } else if (showAdvisorAssignment && setActiveRowId && activeRowId !== undefined) {
                // Toggle active row for advisor assignment
                setActiveRowId(activeRowId === app.id ? null : app.id);
              }
            }}
          >
            {/* Status Column */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {showStatusDropdown && handleStatusChange ? (
                <select
                  value={app.status}
                  onChange={(e) => onStatusChange(app.id, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 bg-white focus:ring-[#8cc63f] focus:border-[#8cc63f]"
                  disabled={userRole !== "ADMIN"} // Disable if not admin
                  onClick={(e) => e.stopPropagation()} // Prevent row click from firing
                >
                  <option value="SUBMITTED">Submitted</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="SIGNATURE_PROCESS_PENDING">Signature Process Pending</option>
                  <option value="SIGNATURE_IN_PROCESS">Signature In Process</option>
                </select>
              ) : (
                <span>{app.status}</span>
              )}
            </td>
            {/* Ensured Column */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.ensured}</td>
            {/* Owner(s) Column - Use owners array if available, otherwise customer names */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {app.owners && app.owners.length > 0
                ? app.owners.join(', ')
                : app.customer
                ? `${app.customer.firstName || ''} ${app.customer.lastName || ''}`.trim()
                : 'N/A'}
            </td>
            {/* Product Column */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.product}</td>
            {/* Coverage Amount Column */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {formatCurrency(app.coverageAmount)}
            </td>
            {/* Date Started Column */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.dateStarted}</td>
            {/* Policy Number Column */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.policyNumber}</td>

            {/* Advisor Column (conditionally rendered) */}
            {showAdvisorAssignment && (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {activeRowId === app.id && setActiveRowId && advisorNames && setAdvisorNames ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={advisorNames[app.id] || ''}
                      onChange={(e) => setAdvisorNames((prev) => ({ ...prev, [app.id]: e.target.value }))}
                      onClick={(e) => e.stopPropagation()} // Prevent row toggle when clicking input
                      autoFocus
                      placeholder="Assign advisor"
                      className="w-full"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row toggle
                        setActiveRowId(null); // Close input
                        // TODO: Implement actual API call to save advisor assignment here
                        console.log(`Advisor for ${app.id} set to: ${advisorNames[app.id]}`);
                        // You might want to trigger a parent callback here to save the advisor
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                ) : advisorNames && advisorNames[app.id] ? (
                  <span title={advisorNames[app.id]} className="inline-block max-w-[10ch] truncate">
                    {advisorNames[app.id]}
                  </span>
                ) : (
                  <span>Click to assign</span>
                )}
              </td>
            )}
          </tr>
        ))}
      </>
    );
  };

  return (
    <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
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
              {showAdvisorAssignment && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                  Advisor
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {renderTableContent()}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ApplicationsTable;
