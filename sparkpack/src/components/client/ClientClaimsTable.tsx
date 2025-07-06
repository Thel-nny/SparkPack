'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, ChevronDown, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// Define the type for an individual claim
interface Claim {
  id: string;
  status: 'Submitted' | 'Approved' | 'Denied';
  incidentDate: string; // e.g., 'YYYY-MM-DD'
  claimAmount: number; // Stored as a number, formatted for display
}

// Mock data for claims
const mockClaims: Claim[] = [
  { id: 'claim-001', status: 'Submitted', incidentDate: '2024-03-01', claimAmount: 5000 },
  { id: 'claim-002', status: 'Approved', incidentDate: '2024-02-15', claimAmount: 12000 },
  { id: 'claim-003', status: 'Denied', incidentDate: '2024-01-20', claimAmount: 8000 },
  { id: 'claim-004', status: 'Approved', incidentDate: '2024-01-10', claimAmount: 15000 },
  { id: 'claim-005', status: 'Submitted', incidentDate: '2024-03-05', claimAmount: 7000 },
  { id: 'claim-006', status: 'Denied', incidentDate: '2024-02-25', claimAmount: 3000 },
  { id: 'claim-007', status: 'Approved', incidentDate: '2024-02-28', claimAmount: 10000 },
];

const ClientClaimsTable: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<Claim['status'] | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  // Dropdown visibility state
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  // Simulate data fetching with a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setClaims(mockClaims);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter claims based on filters
  const filteredClaims = useMemo(() => {
    let filtered = mockClaims;

    if (statusFilter) {
      filtered = filtered.filter(claim => claim.status === statusFilter);
    }
    if (startDate) {
      filtered = filtered.filter(claim => new Date(claim.incidentDate) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(claim => new Date(claim.incidentDate) <= new Date(endDate));
    }
    return filtered;
  }, [statusFilter, startDate, endDate]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, startDate, endDate]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClaims = filteredClaims.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);

  const toggleDropdown = (dropdownName: string) => {
    setActiveFilterDropdown(activeFilterDropdown === dropdownName ? null : dropdownName);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setStartDate('');
    setEndDate('');
    setActiveFilterDropdown(null);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format currency to PHP
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const areFiltersActive = statusFilter !== '' || startDate !== '' || endDate !== '';

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
          {loading ? (
            <div>Loading filters...</div>
          ) : (
            <>
              <Filter className="h-5 w-5 text-gray-600" />

              {/* Status Filter Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                  onClick={() => toggleDropdown('status')}
                >
                  <span>Status</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeFilterDropdown === 'status' ? 'rotate-180' : ''}`} />
                </Button>
                {activeFilterDropdown === 'status' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1">
                    <div
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f5f8f3] hover:text-[#7eb238] cursor-pointer"
                      onClick={() => { setStatusFilter(''); setActiveFilterDropdown(null); }}
                    >
                      All Statuses
                    </div>
                    {['Submitted', 'Approved', 'Denied'].map(
                      (statusOption) => (
                        <div
                          key={statusOption}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f5f8f3] hover:text-[#7eb238] cursor-pointer"
                          onClick={() => { setStatusFilter(statusOption as Claim['status']); setActiveFilterDropdown(null); }}
                        >
                          {statusOption}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Date Filter Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                  onClick={() => toggleDropdown('date')}
                >
                  <span>Incident Date</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeFilterDropdown === 'date' ? 'rotate-180' : ''}`} />
                </Button>
                {activeFilterDropdown === 'date' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20 p-4">
                    <div className="flex flex-col space-y-2">
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full text-sm"
                      />
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Clear Filters Button */}
              {areFiltersActive && (
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                  onClick={clearFilters}
                >
                  <XCircle className="h-4 w-4" />
                  <span>Clear Filters</span>
                </Button>
              )}
            </>
          )}
        </div>

        {/* Claims Table */}
        <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div>Loading claims...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f5f8f3]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Incident Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Claim Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {claim.incidentDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(claim.claimAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {claim.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Pagination Controls */}
        {!loading && filteredClaims.length > itemsPerPage && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => paginate(page)}
                className={currentPage === page ? 'bg-[#7eb238] hover:bg-[#8cc63f] text-white' : ''}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientClaimsTable;
