'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { AdvisorFilterSkeleton, AdvisorTableSkeleton } from './loading';

import ApplicationFilters from '@/components/advisor/common/ApplicationFilters';
import ApplicationsTable from '@/components/advisor/common/ApplicationsTable';
import PaginationControls from '@/components/advisor/common/PaginationControls';

interface Application {
  id: string;
  status: 'APPROVED' | string;
  ensured: string;
  owners: string[];
  product: string;
  coverageAmount: number;
  dateStarted: string;
  policyNumber: string;
  customerId?: string;
  customer?: {
    firstName: string;
    lastName: string;
  };
  advisorName?: string;
}

const ITEMS_PER_PAGE = 7;

const AdvisorInProgressApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advisorNames, setAdvisorNames] = useState<Record<string, string>>({});
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [minCoverage, setMinCoverage] = useState<string>('');
  const [maxCoverage, setMaxCoverage] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 7;

  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      // Only fetch applications with APPROVED or in-progress statuses
      if (statusFilter && statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      } else {
        // Default to show APPROVED status only
        params.append('status', 'APPROVED');
      }

      if (productFilter) params.append('product', productFilter);
      if (minCoverage) params.append('minCoverage', minCoverage);
      if (maxCoverage) params.append('maxCoverage', maxCoverage);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/applications/in-progress?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Error fetching applications: ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }
      const result = await response.json();
      if (result.success) {
        const apps: Application[] = result.data.applications.map((app: any) => ({
          id: app.id,
          status: app.status || 'UNKNOWN',
          ensured: app.customer ? `${app.customer.firstName || ''} ${app.customer.lastName || ''}`.trim() : 'N/A',
          owners: app.pet && app.pet.petName ? [app.pet.petName] : [],
          product: ['Medical Care Insurance', 'Legacy Insurance'].includes(app.planType) ? app.planType : app.planType || 'N/A',
          coverageAmount: app.coverageAmount || 0,
          dateStarted: app.startDate ? new Date(app.startDate).toISOString().split('T')[0] : 'N/A',
          policyNumber: app.policyNumber || 'N/A',
          customerId: app.customerId,
          customer: app.customer,
          advisorName: app.advisorName || undefined,
        }));
        setApplications(apps);
        setTotalPages(result.data.pagination.pages || 1);
      } else {
        setError(result.error || 'Failed to fetch applications due to an unknown reason.');
        setApplications([]);
      }
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to fetch applications. Please try again.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

  useEffect(() => {
    fetchApplications();
  }, [currentPage, fetchApplications]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

   const updateAdvisor = useCallback(async (applicationId: string, advisorName: string) => {
  try {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    const customerId = application.customerId || undefined;
    if (!customerId) {
      console.error('Customer ID not found for application:', applicationId);
      return;
    }

    const response = await fetch(`/api/clientDetails/${customerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ advisor: advisorName }),
    });

    const result = await response.json();
    if (result.success) {
      setAdvisorNames(prev => ({ ...prev, [applicationId]: advisorName }));

      const statusResponse = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });

      if (statusResponse.ok) {
        setApplications(prevApps => prevApps.filter(app => app.id !== applicationId));
        console.log("Application moved to ACTIVE status successfully.");
      } else {
        console.error('Failed to update application status to ACTIVE');
      }

      fetchApplications();
    } else {
      console.error('Failed to update advisor:', result.error);
    }
  } catch (error) {
    console.error('Error updating advisor:', error);
  }
}, [applications, fetchApplications]);

  // Expose updateAdvisor function globally for ApplicationsTable to call
  useEffect(() => {
    (window as any).updateAdvisor = updateAdvisor;
    return () => {
      delete (window as any).updateAdvisor;
    };
  }, [updateAdvisor]);

  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  }, []);

  const areFiltersActive = useMemo(() => {
    return (
      statusFilter !== '' ||
      productFilter !== '' ||
      minCoverage !== '' ||
      maxCoverage !== '' ||
      startDate !== '' ||
      endDate !== ''
    );
  }, [statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

  const clearFilters = useCallback(() => {
    setStatusFilter('');
    setProductFilter('');
    setMinCoverage('');
    setMaxCoverage('');
    setStartDate('');
    setEndDate('');
    setActiveFilterDropdown(null);
    setCurrentPage(1);
  }, []);

  const paginate = useCallback((pageNumber: number) => setCurrentPage(pageNumber), []);

  const inProgressStatusOptions = [
    'Approved',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6">
        {loading && applications.length === 0 ? (
          <AdvisorFilterSkeleton />
        ) : error ? (
          <div className="text-red-600 font-medium p-4 border border-red-300 bg-red-50 rounded-md">
            <p>Error: {error}</p>
            <p className="text-sm mt-1">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
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
            statusOptions={inProgressStatusOptions}
            allStatusesLabel="All In Progress Statuses"
          />
        )}

        <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
          {loading && applications.length === 0 ? (
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
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default AdvisorInProgressApplications;