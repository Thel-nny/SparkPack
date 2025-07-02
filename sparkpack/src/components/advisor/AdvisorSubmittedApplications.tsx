'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AdvisorFilterSkeleton, AdvisorTableSkeleton } from './loading';
import { Filter, ChevronDown, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// Define the type for an individual application
interface Application {
  id: string;
  status: 'Submitted' | 'Approved' | 'Denied';
  ensured: string;
  owners: string[];
  product: 'Medical Care Insurance' | 'Legacy Insurance';
  coverageAmount: number; // Stored as a number, formatted for display
  dateStarted: string; // Using string for simplicity, e.g., 'YYYY-MM-DD'
  policyNumber: string; // 'N/A' for in-progress applications
}

// Mock data for in-progress applications (increased for pagination demonstration)
const mockApplications: Application[] = [
  {
    id: 'sub-011',
    status: 'Approved',
    ensured: 'Pippin the Ferret',
    owners: ['Frodo Baggins'],
    product: 'Medical Care Insurance',
    coverageAmount: 40000, // PHP
    dateStarted: '2024-01-05',
    policyNumber: 'MCP-2024-0011',
  },
  {
    id: 'sub-012',
    status: 'Denied',
    ensured: 'Gandalf the Grey',
    owners: ['Bilbo Baggins'],
    product: 'Legacy Insurance',
    coverageAmount: 150000, // PHP
    dateStarted: '2024-01-10',
    policyNumber: 'N/A',
  },
  {
    id: 'sub-013',
    status: 'Denied',
    ensured: 'Legolas Greenleaf',
    owners: ['Elrond Half-elven'],
    product: 'Medical Care Insurance',
    coverageAmount: 70000, // PHP
    dateStarted: '2024-01-15',
    policyNumber: 'N/A',
  },
  {
    id: 'sub-014',
    status: 'Approved',
    ensured: 'Aragorn Strider',
    owners: ['Arwen Evenstar'],
    product: 'Legacy Insurance',
    coverageAmount: 200000, // PHP
    dateStarted: '2024-01-20',
    policyNumber: 'LGY-2024-0003',
  },
  {
    id: 'sub-015',
    status: 'Approved',
    ensured: 'Gimli Son of Glóin',
    owners: ['Thorin Oakenshield'],
    product: 'Medical Care Insurance',
    coverageAmount: 65000, // PHP
    dateStarted: '2024-01-25',
    policyNumber: 'MCP-2024-0012',
  },
  {
    id: 'sub-016',
    status: 'Denied',
    ensured: 'Sauron the Dark Lord',
    owners: ['Melkor Bauglir'],
    product: 'Legacy Insurance',
    coverageAmount: 1000000, // PHP
    dateStarted: '2024-02-01',
    policyNumber: 'N/A',
  },
  {
    id: 'sub-017',
    status: 'Denied',
    ensured: 'Smaug the Dragon',
    owners: ['Bard the Bowman'],
    product: 'Medical Care Insurance',
    coverageAmount: 500000, // PHP
    dateStarted: '2024-02-05',
    policyNumber: 'N/A',
  },
  {
    id: 'sub-018',
    status: 'Approved',
    ensured: 'Treebeard the Ent',
    owners: ['Saruman the White'],
    product: 'Legacy Insurance',
    coverageAmount: 300000, // PHP
    dateStarted: '2024-02-10',
    policyNumber: 'LGY-2024-0004',
  },
  {
    id: 'sub-019',
    status: 'Approved',
    ensured: 'Shelob the Spider',
    owners: ['Gollum'],
    product: 'Medical Care Insurance',
    coverageAmount: 10000, // PHP
    dateStarted: '2024-02-15',
    policyNumber: 'MCP-2024-0013',
  },
  {
    id: 'sub-020',
    status: 'Approved',
    ensured: 'Shadowfax the Horse',
    owners: ['Theoden King'],
    product: 'Legacy Insurance',
    coverageAmount: 180000, // PHP
    dateStarted: '2024-02-20',
    policyNumber: 'LGY-2024-0005',
  }
];

const AdvisorInProgressApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<Application['status'] | ''>('');
  const [productFilter, setProductFilter] = useState<Application['product'] | ''>('');
  const [minCoverage, setMinCoverage] = useState<string>('');
  const [maxCoverage, setMaxCoverage] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // You can adjust items per page

  // Dropdown visibility states
  const [activeFilterDropdown, setActiveFilterDropdown] = useState<string | null>(null);

  // Refs for dropdowns to handle clicks outside
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const coverageDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  // Simulate data fetching with a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1500); // Simulate a 1.5-second loading time

    return () => clearTimeout(timer);
  }, []);

  // Memoized filtered applications
  const filteredApplications = useMemo(() => {
    let filtered = mockApplications;

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
  }, [statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

  // Reset current page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, productFilter, minCoverage, maxCoverage, startDate, endDate]);

  // Calculate applications for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node) &&
        productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node) &&
        coverageDropdownRef.current && !coverageDropdownRef.current.contains(event.target as Node) &&
        dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveFilterDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper function to format currency to Philippine Peso
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2, // Ensure two decimal places
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

  const toggleDropdown = (dropdownName: string) => {
    setActiveFilterDropdown(activeFilterDropdown === dropdownName ? null : dropdownName);
  };

  const clearFilters = () => {
    setStatusFilter('');
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
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
          {loading ? (
            <AdvisorFilterSkeleton />
          ) : (
            <>
              <Filter className="h-5 w-5 text-gray-600" /> {/* Filter Icon */}

              {/* Status Filter Dropdown */}
              <div className="relative" ref={statusDropdownRef}>
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
                          onClick={() => { setStatusFilter(statusOption as Application['status']); setActiveFilterDropdown(null); }}
                        >
                          {statusOption}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Product Filter Dropdown */}
              <div className="relative" ref={productDropdownRef}>
                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                  onClick={() => toggleDropdown('product')}
                >
                  <span>Product</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeFilterDropdown === 'product' ? 'rotate-180' : ''}`} />
                </Button>
                {activeFilterDropdown === 'product' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1">
                    <div
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f5f8f3] hover:text-[#7eb238] cursor-pointer"
                      onClick={() => { setProductFilter(''); setActiveFilterDropdown(null); }}
                    >
                      All Products
                    </div>
                    {['Medical Care Insurance', 'Legacy Insurance'].map((productOption) => (
                      <div
                        key={productOption}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f5f8f3] hover:text-[#7eb238] cursor-pointer"
                        onClick={() => { setProductFilter(productOption as Application['product']); setActiveFilterDropdown(null); }}
                      >
                        {productOption}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coverage Amount Filter Dropdown */}
              <div className="relative" ref={coverageDropdownRef}>
                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                  onClick={() => toggleDropdown('coverage')}
                >
                  <span>Coverage Amount</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeFilterDropdown === 'coverage' ? 'rotate-180' : ''}`} />
                </Button>
                {activeFilterDropdown === 'coverage' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20 p-4">
                    <div className="flex flex-col space-y-2">
                      <Input
                        type="number"
                        placeholder="Min Amount"
                        value={minCoverage}
                        onChange={(e) => setMinCoverage(e.target.value)}
                        className="w-full text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Max Amount"
                        value={maxCoverage}
                        onChange={(e) => setMaxCoverage(e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Date Started Filter Dropdown */}
              <div className="relative" ref={dateDropdownRef}>
                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                  onClick={() => toggleDropdown('date')}
                >
                  <span>Date Started</span>
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

              {/* Clear Filters Button (conditionally rendered) */}
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

        {/* Applications Table - displays skeleton when loading, otherwise the actual table */}
        <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <AdvisorTableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f5f8f3]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Ensured
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Owner(s)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Coverage Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Date Started
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Policy Number
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.ensured}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.owners.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(app.coverageAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.dateStarted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.policyNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Pagination Controls */}
        {!loading && filteredApplications.length > itemsPerPage && (
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

export default AdvisorInProgressApplications;