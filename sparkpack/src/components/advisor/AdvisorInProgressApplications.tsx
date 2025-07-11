'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { AdvisorFilterSkeleton, AdvisorTableSkeleton } from './loading';
import AdvisorInProgressApplicationsFilters from './AdvisorInProgressApplicationsFilters';
import AdvisorInProgressApplicationsTable from './AdvisorInProgressApplicationsTable';
import AdvisorInProgressApplicationsPagination from './AdvisorInProgressApplicationsPagination';

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

const ITEMS_PER_PAGE = 7;


const AdvisorInProgressApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [advisorNames, setAdvisorNames] = useState<Record<string, string>>({});

  // Handler to update advisor in backend
  const updateAdvisor = async (applicationId: string, advisorName: string) => {
    try {
      // Find the application to get customerId
      const application = applications.find(app => app.id === applicationId);
      if (!application) return;

      // Fix: customer is an object with firstName and lastName, no id property
      // We need to find customerId from the application object itself
      // Assuming application has customerId property, else fallback to undefined
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
        // Optionally refresh applications list or update state
        // For simplicity, update advisorNames state
        setAdvisorNames(prev => ({ ...prev, [applicationId]: advisorName }));
      } else {
        console.error('Failed to update advisor:', result.error);
      }
    } catch (error) {
      console.error('Error updating advisor:', error);
    }
  };

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('APPROVED'); // default to APPROVED and related statuses
  const [productFilter, setProductFilter] = useState<string>('');
  const [minCoverage, setMinCoverage] = useState<string>('');
  const [maxCoverage, setMaxCoverage] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  // Dropdown visibility state for filters
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  // Fetch applications from backend API
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', ITEMS_PER_PAGE.toString());
        const response = await fetch(`/api/applications?${params.toString()}`);
        const result = await response.json();
        if (result.success) {
          setApplications(result.data.applications);
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [currentPage]);

  // Filter applications client-side based on filters
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Filter for multiple in-progress statuses
    const inProgressStatuses = ['APPROVED', 'SIGNATURE_PROCESS_PENDING', 'SIGNATURE_IN_PROCESS'];

    if (statusFilter && !inProgressStatuses.includes(statusFilter)) {
      // If statusFilter is set but not in inProgressStatuses, filter by it
      filtered = filtered.filter(app => app.status === statusFilter);
    } else {
      // Otherwise, filter by all in-progress statuses
      filtered = filtered.filter(app => inProgressStatuses.includes(app.status));
    }

    if (productFilter) {
      filtered = filtered.filter(app => app.product === productFilter);
    }
    if (minCoverage) {
      filtered = filtered.filter(app => app.coverageAmount >= parseFloat(minCoverage));
    }
    if (maxCoverage) {
      filtered = filtered.filter(app => app.coverageAmount <= parseFloat(maxCoverage));
    }
    if (startDate) {
      filtered = filtered.filter(app => new Date(app.dateStarted) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(app => new Date(app.dateStarted) <= new Date(endDate));
    }
    return filtered;
  }, [applications, statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

  // Reset current page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

  // Helper function to format currency to Philippine Peso
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Check if any filter is active
  const areFiltersActive =
    statusFilter !== '' ||
    productFilter !== '' ||
    minCoverage !== '' ||
    maxCoverage !== '' ||
    startDate !== '' ||
    endDate !== '';

  const clearFilters = () => {
    setStatusFilter('APPROVED'); // reset to APPROVED and related statuses on clear
    setProductFilter('');
    setMinCoverage('');
    setMaxCoverage('');
    setStartDate('');
    setEndDate('');
    setActiveFilterDropdown(null);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <AdvisorFilterSkeleton />
        ) : (
          <AdvisorInProgressApplicationsFilters
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

        <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <AdvisorTableSkeleton />
          ) : (
            <AdvisorInProgressApplicationsTable
              applications={filteredApplications}
              activeRowId={null}
              setActiveRowId={() => {}}
              advisorNames={advisorNames}
              setAdvisorNames={setAdvisorNames}
              formatCurrency={formatCurrency}
            />
          )}
        </Card>

        {!loading && filteredApplications.length > ITEMS_PER_PAGE && (
          <AdvisorInProgressApplicationsPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredApplications.length / ITEMS_PER_PAGE)}
            paginate={paginate}
          />
        )}
      </div>
    </div>
  );
};

export default AdvisorInProgressApplications;
