'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { AdvisorFilterSkeleton, AdvisorTableSkeleton } from './loading';
import FilterControls from './AdvisorActiveApplications/FilterControls';
import ApplicationsTable from './AdvisorActiveApplications/ApplicationsTable';
import PaginationControls from './AdvisorActiveApplications/PaginationControls';
import useApplications from './AdvisorActiveApplications/useApplications';

// Define the type for an individual application
interface Application {
  id: string;
  status: 'Advisor Declaration Pending' | 'Signature Process Pending' | 'Signature In Process';
  ensured: string;
  owners: string[];
  product: 'Medical Care Insurance' | 'Legacy Insurance';
  coverageAmount: number; // Stored as a number, formatted for display
  dateStarted: string; // Using string for simplicity, e.g., 'YYYY-MM-DD'
  policyNumber: string; // 'N/A' for in-progress applications
}

const AdvisorActiveApplications: React.FC = () => {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [advisorNames, setAdvisorNames] = useState<Record<string, string>>({});

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [minCoverage, setMinCoverage] = useState<string>('');
  const [maxCoverage, setMaxCoverage] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Dropdown visibility state
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  // Pagination state
  const itemsPerPage = 7;

  const {
    applications,
    totalPages,
    loading,
    error,
    setPage,
    currentPage,
  } = useApplications({
    page: 1,
    limit: itemsPerPage,
    statusFilter,
    productFilter,
    minCoverage,
    maxCoverage,
    startDate,
    endDate,
  });

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate, setPage]);

  const clearFilters = () => {
    setStatusFilter('');
    setProductFilter('');
    setMinCoverage('');
    setMaxCoverage('');
    setStartDate('');
    setEndDate('');
    setActiveFilterDropdown(null);
  };

  const areFiltersActive =
    statusFilter !== '' ||
    productFilter !== '' ||
    minCoverage !== '' ||
    maxCoverage !== '' ||
    startDate !== '' ||
    endDate !== '';

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
          {loading ? (
            <AdvisorFilterSkeleton />
          ) : (
            <FilterControls
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
            />
          )}
        </div>

        <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <AdvisorTableSkeleton />
          ) : error ? (
            <div className="p-4 text-red-600">Error loading applications: {error}</div>
          ) : (
            <ApplicationsTable
              applications={applications}
              activeRowId={activeRowId}
              setActiveRowId={setActiveRowId}
              advisorNames={advisorNames}
              setAdvisorNames={setAdvisorNames}
              formatCurrency={formatCurrency}
            />
          )}
        </Card>

        {!loading && !error && applications.length > itemsPerPage && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default AdvisorActiveApplications;
