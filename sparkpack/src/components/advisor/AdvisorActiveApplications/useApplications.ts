import { useState, useEffect, useCallback } from 'react';
import { fetchApplications } from '@/lib/api/applications';

interface UseApplicationsParams {
  page: number;
  limit: number;
  statusFilter?: string;
  productFilter?: string;
  minCoverage?: string;
  maxCoverage?: string;
  startDate?: string;
  endDate?: string;
}

interface Application {
  id: string;
  status: string;
  ensured: string;
  owners: string[];
  product: string;
  coverageAmount: number;
  dateStarted: string;
  policyNumber: string;
}

interface UseApplicationsResult {
  applications: Application[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  currentPage: number;
}

export default function useApplications(params: UseApplicationsParams): UseApplicationsResult {
  const {
    page,
    limit,
    statusFilter,
    productFilter,
    minCoverage,
    maxCoverage,
    startDate,
    endDate,
  } = params;

  const [applications, setApplications] = useState<Application[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(page);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApplications({
        page: currentPage,
        limit,
        statusFilter,
        productFilter,
        minCoverage,
        maxCoverage,
        startDate,
        endDate,
      });
      if (data.success) {
        setApplications(data.data.applications);
        setTotalPages(data.data.pagination.pages);
      } else {
        setError(data.error || 'Failed to fetch applications');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    limit,
    statusFilter,
    productFilter,
    minCoverage,
    maxCoverage,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset currentPage to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    applications,
    totalPages,
    loading,
    error,
    setPage,
    currentPage,
  };
}
