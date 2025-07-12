'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AdvisorFilterSkeleton } from './loading';

import ApplicationFilters from '@/components/advisor/common/ApplicationFilters';
import ApplicationsTable from '@/components/advisor/common/ApplicationsTable';
import PaginationControls from '@/components/advisor/common/PaginationControls';

import ApplicationSummaryModal from './applications/ApplicationSummaryModal';
import { ApplicationFormData } from '@/types/formData';
import { useSession } from "next-auth/react";

interface Application {
  id: string;
  status: 'SUBMITTED' | 'DECLINED' | string;
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

const AdvisorSubmittedApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [productFilter, setProductFilter] = useState<string>('');
  const [minCoverage, setMinCoverage] = useState<string>('');
  const [maxCoverage, setMaxCoverage] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [totalPages, setTotalPages] = useState(1);

  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  const [selectedApplicationData, setSelectedApplicationData] = useState<ApplicationFormData | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const { data: session } = useSession();
  const userRole = session?.user?.role || null;

  const handleModalPrev = useCallback(() => {
    console.log("Modal Previous button clicked (no action defined)");
  }, []);

  const handleModalNext = useCallback(() => {
    console.log("Modal Next button clicked (no action defined)");
  }, []);

  const fetchApplications = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', itemsPerPage.toString());
      if (statusFilter && statusFilter !== 'ALL') params.append('status', statusFilter);
      if (productFilter) params.append('product', productFilter);
      if (minCoverage) params.append('minCoverage', minCoverage);
      if (maxCoverage) params.append('maxCoverage', maxCoverage);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/applications?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Error fetching applications: ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();

      if (data.success) {
        const apps: Application[] = data.data.applications.map((app: any) => ({
          id: app.id,
          status: app.status || 'UNKNOWN',
          ensured: app.customer ? `${app.customer.firstName || ''} ${app.customer.lastName || ''}`.trim() : 'N/A',
          owners: app.pet && app.pet.petName ? [app.pet.petName] : [],
          product: ['Medical Care Insurance', 'Legacy Insurance'].includes(app.planType) ? app.planType : app.planType || 'N/A',
          coverageAmount: app.coverageAmount || 0,
          dateStarted: app.startDate ? new Date(app.startDate).toISOString().split('T')[0] : 'N/A',
          policyNumber: app.policyNumber || 'N/A',
          customer: app.customer,
          advisorName: app.advisorName || undefined,
        }));
        setApplications(apps);
        setTotalPages(data.data.pagination.pages || 1);
      } else {
        setError(data.error || 'Failed to fetch applications due to an unknown reason.');
      }
    } catch (err: any) {
      console.error('Fetch applications failed:', err);
      setError(err.message || 'Failed to fetch applications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage, statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage, fetchApplications]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  }, []);

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

  const fetchFullApplicationData = useCallback(async (id: string): Promise<ApplicationFormData | null> => {
    try {
      const response = await fetch(`/api/applications/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error fetching full application data for ID ${id}:`, errorData);
        throw new Error(`Error fetching application data: ${response.statusText} - ${errorData.message || 'Unknown error'}`);
      }
      const data = await response.json();
      if (data.success) {
        return data.data as ApplicationFormData;
      } else {
        setError(data.error || 'Failed to fetch application data.');
        return null;
      }
    } catch (err: any) {
      console.error('Fetch full application data failed:', err);
      setError(err.message || 'Failed to fetch application data. Please try again.');
      return null;
    }
  }, []);

  const handleSelectApplication = useCallback(async (app: Application) => {
    setLoading(true);
    const fullData = await fetchFullApplicationData(app.id);
    if (fullData) {
      setSelectedApplicationData(fullData);
      setIsSummaryModalOpen(true);
    }
    setLoading(false);
  }, [fetchFullApplicationData]);

  const handleStatusChange = useCallback(async (appId: string, newStatus: string) => {
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
      console.log("Status updated successfully");
      fetchApplications(currentPage);
    } catch (err: any) {
      console.error("Error updating status:", err);
      setError(err.message || "Error updating status");
    }
  }, [fetchApplications, currentPage]);

  const submittedStatusOptions = useMemo(() => {
    if (userRole === 'ADVISOR') {
      return ['Submitted', 'Declined'];
    }
    return ['Submitted', 'Declined'];
  }, [userRole]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
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
              statusOptions={submittedStatusOptions}
              allStatusesLabel="All Submitted Statuses"
            />
          )}
        </div>

        <ApplicationsTable
          applications={applications}
          formatCurrency={formatCurrency}
          loading={loading}
          error={error}
          showStatusDropdown={true}
          handleStatusChange={handleStatusChange}
          userRole={userRole}
          onRowClick={handleSelectApplication}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={setCurrentPage}
        />
      </div>

      {selectedApplicationData && (
        <ApplicationSummaryModal
          isOpen={isSummaryModalOpen}
          onClose={() => {
            setIsSummaryModalOpen(false);
            setSelectedApplicationData(null);
          }}
          formData={selectedApplicationData}
          onPrev={handleModalPrev}
          onNext={handleModalNext}
        />
      )}
    </div>
  );
};

export default AdvisorSubmittedApplications;