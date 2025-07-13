'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { AdvisorFilterSkeleton, AdvisorTableSkeleton } from './loading';

import ApplicationFilters from '@/components/advisor/common/ApplicationFilters';
import ApplicationsTable from '@/components/advisor/common/ApplicationsTable';
import PaginationControls from '@/components/advisor/common/PaginationControls';

import useApplications from './AdvisorActiveApplications/useApplications';

interface Application {
  id: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  ensured: string;
  owners: string[];
  product: string;
  coverageAmount: number;
  dateStarted: string;
  policyNumber: string;
  customer?: {
    firstName: string;
    lastName: string;
  };
  advisorName?: string;
}

const AdvisorActiveApplications: React.FC = () => {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [advisorNames, setAdvisorNames] = useState<Record<string, string>>({});

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [minCoverage, setMinCoverage] = useState<string>('');
  const [maxCoverage, setMaxCoverage] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  const itemsPerPage = 7;

  const {
    applications,
    totalPages,
    loading,
    error,
    setPage,
    currentPage,
    refetch,
  } = useApplications({
    page: 1,
    limit: itemsPerPage,
    statusFilter: statusFilter || 'ACTIVE,INACTIVE', // Default to only show ACTIVE and INACTIVE
    productFilter,
    minCoverage,
    maxCoverage,
    startDate,
    endDate,
  });

  // Handler to update advisor in backend for active applications
  const updateAdvisor = async (applicationId: string, advisorName: string) => {
    try {
      // Find the application to getn customerId
      const application = applications.find(app => app.id === applicationId);
      if (!application) return;

      // Assuming application has customerId property
      const customerId = (application as any).customerId || undefined;
      if (!customerId) {
        console.error('Customer ID not found for application:', applicationId);
        return;
      }

      // Call API to update clientDetails with new advisor
      const response = await fetch(`/api/clientDetails/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advisor: advisorName }),
      });
      const result = await response.json();
      if (result.success) {
        // Update advisorNames state
        setAdvisorNames(prev => ({ ...prev, [applicationId]: advisorName }));
        console.log("Advisor updated successfully for active application.");
        
        // Refresh applications list to reflect changes
        refetch();
      } else {
        console.error('Failed to update advisor:', result.error);
      }
    } catch (error) {
      console.error('Error updating advisor:', error);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate, setPage]);

  const clearFilters = useCallback(() => {
    setStatusFilter('');
    setProductFilter('');
    setMinCoverage('');
    setMaxCoverage('');
    setStartDate('');
    setEndDate('');
    setActiveFilterDropdown(null);
  }, []);

  const areFiltersActive =
    statusFilter !== '' ||
    productFilter !== '' ||
    minCoverage !== '' ||
    maxCoverage !== '' ||
    startDate !== '' ||
    endDate !== '';

  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  }, []);

  const activeStatusOptions = [
    'Active',
    'Inactive'
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
          {loading ? (
            <AdvisorFilterSkeleton />
          ) : (
            <ApplicationFilters
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              productFilter={productFilter}
              setProductFilter={setProductFilter}
              minCoverage={minCoverage}
              setMinCoverage={setMinCoverage}
              maxCoverage={maxCoverage}
              setMaxCoverage={setMaxCoverage}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              activeFilterDropdown={activeFilterDropdown}
              setActiveFilterDropdown={setActiveFilterDropdown}
              clearFilters={clearFilters}
              areFiltersActive={areFiltersActive}
              statusOptions={activeStatusOptions}
              allStatusesLabel="All Active Statuses"
            />
          )}
        </div>

        <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
          {loading && applications.length === 0 ? (
            <AdvisorTableSkeleton />
          ) : error ? (
            <div className="p-4 text-red-600">Error loading applications: {error}</div>
          ) : (
            <ApplicationsTable
              applications={applications as Application[]}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              advisorNames={advisorNames}
              setAdvisorNames={setAdvisorNames}
              formatCurrency={formatCurrency}
              showAdvisorAssignment={true}
              loading={loading}
              error={error}
              updateAdvisor={updateAdvisor}
            />
          )}
        </Card>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={setPage}
        />
      </div>
    </div>
  );
};

export default AdvisorActiveApplications;