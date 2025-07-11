'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AdvisorFilterSkeleton } from './loading';
import FilterDropdowns from './AdvisorSubmittedApplications/components/FilterDropdowns';
import ApplicationsTable from './AdvisorSubmittedApplications/components/ApplicationsTable';
import PaginationControls from './AdvisorSubmittedApplications/components/PaginationControls';
import ApplicationSummaryModal from './applications/ApplicationSummaryModal';

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

interface SimplifiedApplication {
  id: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'SIGNATURE_PROCESS_PENDING' | 'SIGNATURE_IN_PROCESS';
  ensured: string;
  owners: string[];
  product: 'Medical Care Insurance' | 'Legacy Insurance';
  coverageAmount: number;
  dateStarted: string;
  policyNumber: string;
}

import { ApplicationFormData } from '@/types/formData';

const AdvisorSubmittedApplications: React.FC = () => {
  const [applications, setApplications] = useState<SimplifiedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('SUBMITTED'); // Default to SUBMITTED
  const [productFilter, setProductFilter] = useState<string>('');
  const [minCoverage, setMinCoverage] = useState<string>('');
  const [maxCoverage, setMaxCoverage] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(1);

  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  // New state for modal and selected application
  const [selectedApplicationData, setSelectedApplicationData] = useState<ApplicationFormData | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  // Handlers for modal navigation
  const handleModalPrev = () => {
    // Implement previous logic if needed
  };

  const handleModalNext = () => {
    // Implement next/submit logic if needed
  };

  const fetchApplications = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', itemsPerPage.toString());

      const response = await fetch(`/api/applications?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Error fetching applications: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        const apps: SimplifiedApplication[] = data.data.applications.map((app: any) => ({
          id: app.id,
          status: app.status,
          ensured: app.customer ? `${app.customer.firstName} ${app.customer.lastName}` : 'N/A',
          owners: app.pet ? [app.pet.petName] : [],
          product: app.planType === 'Medical Care Insurance' || app.planType === 'Legacy Insurance' ? app.planType : 'Medical Care Insurance',
          coverageAmount: app.coverageAmount,
          dateStarted: app.startDate ? new Date(app.startDate).toISOString().split('T')[0] : '',
          policyNumber: app.policyNumber || 'N/A',
        }));
        setApplications(apps);
        setTotalPages(data.data.pagination.pages);
      } else {
        setError(data.error || 'Failed to fetch applications');
      }
    } catch {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage, fetchApplications]);

  const filteredApplications = useMemo(() => {
    let filtered = applications;

    if (statusFilter) {
      filtered = filtered.filter(app => app.status === statusFilter);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const clearFilters = () => {
    setStatusFilter('SUBMITTED'); // Reset to SUBMITTED on clear
    setProductFilter('');
    setMinCoverage('');
    setMaxCoverage('');
    setStartDate('');
    setEndDate('');
    setActiveFilterDropdown(null);
  };

  // New function to fetch full application data by id
  const fetchFullApplicationData = async (id: string): Promise<ApplicationFormData | null> => {
    try {
      const response = await fetch(`/api/applications/${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching application data: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.success) {
        return data.data as ApplicationFormData;
      } else {
        setError(data.error || 'Failed to fetch application data');
        return null;
      }
    } catch (error) {
      setError('Failed to fetch application data');
      return null;
    }
  };

  // Updated onSelectApplication handler to fetch full data
  const handleSelectApplication = async (app: SimplifiedApplication) => {
    const fullData = await fetchFullApplicationData(app.id);
    if (fullData) {
      setSelectedApplicationData(fullData);
      setIsSummaryModalOpen(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
          {loading ? (
            <AdvisorFilterSkeleton />
          ) : error ? (
            <div className="text-red-600">Error: {error}</div>
          ) : (
            <FilterDropdowns
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
              areFiltersActive={
                statusFilter !== '' ||
                productFilter !== '' ||
                minCoverage !== '' ||
                maxCoverage !== '' ||
                startDate !== '' ||
                endDate !== ''
              }
            />
          )}
        </div>

        <ApplicationsTable
          currentApplications={currentApplications}
          formatCurrency={formatCurrency}
          loading={loading}
          error={error}
          onSelectApplication={handleSelectApplication}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={(page) => {
            if (page < 1 || page > totalPages) return;
            setCurrentPage(page);
          }}
        />
      </div>

      {/* --- RENDER THE APPLICATION SUMMARY MODAL HERE --- */}
      {selectedApplicationData && (
        <ApplicationSummaryModal
          isOpen={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          formData={selectedApplicationData}
          onPrev={handleModalPrev}
          onNext={handleModalNext}
        />
      )}
    </div>
  );
};

export default AdvisorSubmittedApplications;
