// src/components/advisor/claims/ClaimsQueue.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import ClaimsTableSkeleton from './loading/ClaimsTableSkeleton'; // Correct import path
import ClaimsTable from '@/components/advisor/common/ClaimsTable';
import ClaimFilters from '@/components/advisor/common/ClaimFilters';
import PaginationControls from '@/components/advisor/common/PaginationControls';

// Define interfaces that match the ClaimsTable and Prisma schema
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

interface Claim {
  id: string;
  applicationId: string;
  claimNumber: string;
  incidentDate: string; // ISO date string
  claimAmount: number;
  approvedAmount?: number | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING';
  description?: string | null;
  veterinarianName?: string | null;
  veterinarianContact?: string | null;
  documents: string[];
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  application: Application; // Ensure this is included from the API response
}

const ClaimsQueue: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('PENDING'); // Default to PENDING for queue
  const [claimIdFilter, setClaimIdFilter] = useState<string>('');
  const [policyNumberFilter, setPolicyNumberFilter] = useState<string>('');
  const [petNameFilter, setPetNameFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(1);

  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  // Role can be fetched from session if needed for permissions
  const userRole = 'ADMIN'; // Placeholder: Replace with actual session role if available

  // Function to format currency
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Fetch claims based on filters and pagination
  const fetchClaims = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', itemsPerPage.toString());
      // For Claims Queue, we primarily want PENDING and PROCESSING claims
      // If statusFilter is set, it overrides the default queue filter
      if (statusFilter && statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      } else {
        // If no specific status filter is applied, fetch PENDING and PROCESSING
        params.append('status', 'PENDING,PROCESSING');
      }
      
      if (claimIdFilter) params.append('claimNumber', claimIdFilter);
      if (policyNumberFilter) params.append('policyNumber', policyNumberFilter);
      if (petNameFilter) params.append('petName', petNameFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/claims/queue?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Error fetching claims: ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();

      if (data.success) {
        // Ensure the fetched data matches the Claim interface
        const fetchedClaims: Claim[] = data.data.claims.map((claim: any) => ({
          id: claim.id,
          applicationId: claim.applicationId,
          claimNumber: claim.claimNumber,
          incidentDate: claim.incidentDate,
          claimAmount: claim.claimAmount,
          approvedAmount: claim.approvedAmount,
          status: claim.status,
          description: claim.description,
          veterinarianName: claim.veterinarianName,
          veterinarianContact: claim.veterinarianContact,
          documents: claim.documents,
          adminNotes: claim.adminNotes,
          createdAt: claim.createdAt,
          updatedAt: claim.updatedAt,
          application: { // Ensure application details are nested as expected by ClaimsTable
            id: claim.application?.id || '',
            policyNumber: claim.application?.policyNumber || 'N/A',
            planType: claim.application?.planType || 'N/A',
            customer: {
              id: claim.application?.customer?.id || '',
              firstName: claim.application?.customer?.firstName || 'N/A',
              lastName: claim.application?.customer?.lastName || 'N/A',
            },
            pet: {
              id: claim.application?.pet?.id || '',
              petName: claim.application?.pet?.petName || 'N/A',
            },
          },
        }));
        setClaims(fetchedClaims);
        setTotalPages(data.data.pagination.pages || 1);
      } else {
        setError(data.error || 'Failed to fetch claims due to an unknown reason.');
      }
    } catch (err: any) {
      console.error('Fetch claims failed:', err);
      setError(err.message || 'Failed to fetch claims. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, statusFilter, claimIdFilter, policyNumberFilter, petNameFilter, startDate, endDate]);

  useEffect(() => {
    fetchClaims(currentPage);
  }, [currentPage, fetchClaims]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, claimIdFilter, policyNumberFilter, petNameFilter, startDate, endDate]);

  const clearFilters = useCallback(() => {
    setStatusFilter('PENDING'); // Reset to default PENDING
    setClaimIdFilter('');
    setPolicyNumberFilter('');
    setPetNameFilter('');
    setStartDate('');
    setEndDate('');
    setActiveFilterDropdown(null);
    setCurrentPage(1);
  }, []);

  const areFiltersActive = useMemo(() => {
    return (
      statusFilter !== 'PENDING' || // Check against default for queue
      claimIdFilter !== '' ||
      policyNumberFilter !== '' ||
      petNameFilter !== '' ||
      startDate !== '' ||
      endDate !== ''
    );
  }, [statusFilter, claimIdFilter, policyNumberFilter, petNameFilter, startDate, endDate]);

  // Handle status change for a claim (e.g., Approve, Deny, Process)
  const handleClaimStatusChange = useCallback(async (claimId: string, newStatus: 'APPROVED' | 'REJECTED' | 'PROCESSING', adminNotes?: string) => {
    try {
      const response = await fetch(`/api/claims/${claimId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, adminNotes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update claim status.');
      }
      console.log(`Claim ${claimId} status updated to ${newStatus}`);
      fetchClaims(currentPage); // Re-fetch claims to update the list
    } catch (err: any) {
      console.error('Error updating claim status:', err);
      setError(err.message || 'Failed to update claim status. Please try again.');
    }
  }, [fetchClaims, currentPage]);

  // Handle request for more information (would typically open a modal/form)
  const handleRequestMoreInfo = useCallback(async (claimId: string, notes: string) => {
    // This would ideally trigger a modal or a specific API call to send a notification to the client
    // For now, we'll just log it.
    console.log(`Requesting more info for claim ${claimId} with notes: ${notes}`);
    try {
      // Example: Update claim status to 'PENDING' or a custom 'AWAITING_INFO' status
      // and add admin notes.
      const response = await fetch(`/api/claims/${claimId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'PENDING', adminNotes: `Requested more info: ${notes}` }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to request more information.');
      }
      console.log(`More info requested for claim ${claimId}`);
      fetchClaims(currentPage); // Re-fetch claims
    } catch (err: any) {
      console.error('Error requesting more info:', err);
      setError(err.message || 'Failed to request more information. Please try again.');
    }
  }, [fetchClaims, currentPage]);

  // Placeholder for opening claim details modal - will be implemented later
  const handleViewClaimDetails = useCallback(async (claim: Claim) => {
    console.log('Viewing claim details for:', claim.claimNumber);
    // This function would typically open a modal (e.g., ClaimDetailsModal)
    // and pass the selected claim data to it.
    // For now, it just logs.
  }, []);

  const queueStatusOptions = useMemo(() => {
    return [
      'PENDING',
      'PROCESSING',
      'APPROVED', // Include for filtering, even if not default view
      'REJECTED'  // Include for filtering
    ];
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
          {/* Removed conditional rendering of ClaimsTableSkeleton here */}
          <ClaimFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            claimIdFilter={claimIdFilter}
            setClaimIdFilter={setClaimIdFilter}
            policyNumberFilter={policyNumberFilter}
            setPolicyNumberFilter={setPolicyNumberFilter}
            petNameFilter={petNameFilter}
            setPetNameFilter={setPetNameFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            activeFilterDropdown={activeFilterDropdown}
            setActiveFilterDropdown={setActiveFilterDropdown}
            clearFilters={clearFilters}
            areFiltersActive={areFiltersActive}
            statusOptions={queueStatusOptions}
            allStatusesLabel="All Queue Statuses"
          />
        </div>

        {error && !loading && (
          <div className="text-red-600 font-medium p-4 border border-red-300 bg-red-50 rounded-md">
            <p>Error: {error}</p>
            <p className="text-sm mt-1">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        )}

        {/* Conditionally render ClaimsTable or ClaimsTableSkeleton */}
        {loading && claims.length === 0 ? (
          <ClaimsTableSkeleton />
        ) : (
          <ClaimsTable
            claims={claims}
            formatCurrency={formatCurrency}
            loading={loading}
            error={error}
            showStatusActions={true} // Enable actions for Claims Queue
            handleStatusChange={handleClaimStatusChange}
            handleRequestMoreInfo={handleRequestMoreInfo}
            userRole={userRole}
            onRowClick={handleViewClaimDetails} // Enable row click to view details
          />
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ClaimsQueue;