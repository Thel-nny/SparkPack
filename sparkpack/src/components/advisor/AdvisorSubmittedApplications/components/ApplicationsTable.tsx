import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useSession } from "next-auth/react";

interface Application {
  id: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'SIGNATURE_PROCESS_PENDING' | 'SIGNATURE_IN_PROCESS';
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
  onSelectApplication?: (app: Application) => void;
}


const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  currentApplications,
  formatCurrency,
  loading,
  error,
}) => {
  // Local state to track status updates for UI responsiveness
  const [applications, setApplications] = useState(currentApplications);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { data: session } = useSession();

  // Sync local state when currentApplications prop changes
  useEffect(() => {
    setApplications(currentApplications);
  }, [currentApplications]);

  // Read userRole from cookies on mount
useEffect(() => {
  console.log("session in Application table: ", session);
  if (session?.user?.role) {
    setUserRole(session.user.role);
  }
}, [session]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }
      // Update local state to reflect the new status
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === appId ? { ...app, status: newStatus as Application['status'] } : app
        )
      );
      alert("Status updated successfully");
    } catch {
      alert("Error updating status: ");
    }
  };

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
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <select
                      value={app.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        await handleStatusChange(app.id, newStatus);
                      }}
                      className="border border-gray-300 rounded px-2 py-1"
                      disabled={userRole !== "ADMIN"}
                    >
                      <option value="SUBMITTED">Submitted</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="SIGNATURE_PROCESS_PENDING">Signature Process Pending</option>
                      <option value="SIGNATURE_IN_PROCESS">Signature In Process</option>
                    </select>
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
