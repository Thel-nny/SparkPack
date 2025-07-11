'use client';

import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Assuming Input might be used for some inline editing later

// Define interfaces that closely mirror your Prisma schema for clarity
// These are duplicated here for self-containment, but ideally
// should be imported from a central types file (e.g., '@/types/prisma-models').
interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
}

interface Pet {
  id: string;
  petName: string;
}

interface Application {
  id: string;
  policyNumber: string;
  planType: string;
  customer: User;
  pet: Pet;
}

// Define the Claim interface, mirroring your Prisma Claim model
interface Claim {
  id: string;
  applicationId: string;
  claimNumber: string;
  incidentDate: string; // ISO date string
  claimAmount: number;
  approvedAmount?: number | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING'; // Use enum values
  description?: string | null;
  veterinarianName?: string | null;
  veterinarianContact?: string | null;
  documents: string[]; // Array of document URLs/paths
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  // Include related Application, Customer, and Pet data for display
  application: Application;
}

// Define the props for the ClaimsTable component
interface ClaimsTableProps {
  claims: Claim[];
  formatCurrency: (amount: number) => string;
  loading: boolean;
  error: string | null;
  
  // Props for handling claim status changes (e.g., Approve, Deny, Request Info)
  showStatusActions?: boolean; // Whether to show action buttons/dropdown for status
  handleStatusChange?: (claimId: string, newStatus: 'APPROVED' | 'REJECTED' | 'PROCESSING', adminNotes?: string) => Promise<void>;
  handleRequestMoreInfo?: (claimId: string, notes: string) => Promise<void>;
  userRole?: string | null; // Role of the current user for permissions

  // Prop for general row click, typically for opening a detailed claim view modal
  onRowClick?: (claim: Claim) => Promise<void>;
}

const ClaimsTable: React.FC<ClaimsTableProps> = ({
  claims,
  formatCurrency,
  loading,
  error,
  showStatusActions = false,
  handleStatusChange,
  handleRequestMoreInfo,
  userRole,
  onRowClick,
}) => {

  // Helper function to render table content based on loading/error/data state
  const renderTableContent = useCallback(() => {
    if (loading) {
      return (
        <tr>
          <td colSpan={showStatusActions ? 9 : 8} className="text-center py-8 text-gray-500">
            Loading claims...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={showStatusActions ? 9 : 8} className="text-center py-8 text-red-600">
            Error: {error}
          </td>
        </tr>
      );
    }

    if (claims.length === 0) {
      return (
        <tr>
          <td colSpan={showStatusActions ? 9 : 8} className="text-center py-8 text-gray-500">
            No claims found.
          </td>
        </tr>
      );
    }

    return (
      <>
        {claims.map((claim) => (
          <tr
            key={claim.id}
            className={`hover:bg-gray-50 transition-colors duration-150 ${onRowClick ? 'cursor-pointer' : ''}`}
            onClick={() => onRowClick && onRowClick(claim)}
          >
            {/* Claim ID */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.claimNumber}</td>
            {/* Date Submitted (using createdAt, or incidentDate if preferred) */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {new Date(claim.createdAt).toLocaleDateString()}
            </td>
            {/* Pet Name */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.application.pet.petName}</td>
            {/* Incident Description */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate" title={claim.description || ''}>
              {claim.description || 'N/A'}
            </td>
            {/* Status */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${claim.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${claim.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' : ''}
                ${claim.status === 'APPROVED' ? 'bg-green-100 text-green-800' : ''}
                ${claim.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
              `}>
                {claim.status}
              </span>
            </td>
            {/* Claim Amount */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {formatCurrency(claim.claimAmount)}
            </td>
            {/* Approved Amount */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {claim.approvedAmount !== null && claim.approvedAmount !== undefined
                ? formatCurrency(claim.approvedAmount)
                : 'N/A'}
            </td>
            {/* Policy Number */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.application.policyNumber}</td>

            {/* Actions Column (conditionally rendered for Claims Queue) */}
            {showStatusActions && (
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {/* Example actions - these would typically trigger the modal */}
                <button
                  onClick={(e) => { e.stopPropagation(); onRowClick && onRowClick(claim); }}
                  className="text-[#8cc63f] hover:text-[#7eb238] mr-3"
                  title="Review Claim"
                >
                  Review
                </button>
                {/* More direct actions could be added here if not using a modal for all */}
              </td>
            )}
          </tr>
        ))}
      </>
    );
  }, [claims, loading, error, formatCurrency, showStatusActions, onRowClick]);

  return (
    <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#f5f8f3]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                Claim ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                Date Submitted
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                Pet Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                Incident
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                Claim Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                Approved Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                Policy Number
              </th>
              {showStatusActions && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                  Actions
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

export default ClaimsTable;