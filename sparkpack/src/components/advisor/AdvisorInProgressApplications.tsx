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
  status: 'Pending Review' | 'Underwriting' |'Advisor Declaration Pending' | 'Interview' ;
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
    id: 'app-001',
    status: 'Pending Review',
    ensured: 'Raven the Dog',
    owners: ['Raine Christine Perez'],
    product: 'Medical Care Insurance',
    coverageAmount: 50000, // PHP
    dateStarted: '2023-01-15',
    policyNumber: 'N/A',
  },
  {
    id: 'app-002',
    status: 'Underwriting',
    ensured: 'Guri the Cat',
    owners: ['Thelanny Maguillano'],
    product: 'Legacy Insurance',
    coverageAmount: 100000, // PHP
    dateStarted: '2023-02-01',
    policyNumber: 'N/A',
  },
  {
    id: 'app-003',
    status: 'Interview',
    ensured: 'Shawn the Sheep',
    owners: ['Shawn Barza', 'Timothy Barza'],
    product: 'Medical Care Insurance',
    coverageAmount: 25000, // PHP
    dateStarted: '2023-02-10',
    policyNumber: 'N/A',
  },
  {
    id: 'app-004',
    status: 'Interview',
    ensured: 'Bacon the Cat',
    owners: ['Althea Diaz'],
    product: 'Legacy Insurance',
    coverageAmount: 75000, // PHP
    dateStarted: '2023-03-01',
    policyNumber: 'N/A',
  },
  {
    id: 'app-005',
    status: 'Advisor Declaration Pending',
    ensured: 'Feline the Cat',
    owners: ['Lani Agapito Ledesma'],
    product: 'Medical Care Insurance',
    coverageAmount: 120000, // PHP
    dateStarted: '2023-03-15',
    policyNumber: 'N/A',
  },
  {
    id: 'app-006',
    status: 'Advisor Declaration Pending',
    ensured: 'Ted the Senior Dog',
    owners: ['Chescka So'],
    product: 'Medical Care Insurance',
    coverageAmount: 30000, // PHP
    dateStarted: '2023-04-01',
    policyNumber: 'N/A',
  },
  {
    id: 'app-007',
    status: 'Underwriting',
    ensured: 'Milo the Ulugtasan Dog',
    owners: ['Abigail Sotoy'],
    product: 'Legacy Insurance',
    coverageAmount: 90000, // PHP
    dateStarted: '2023-04-20',
    policyNumber: 'N/A',
  },
  {
    id: 'app-008',
    status: 'Advisor Declaration Pending',
    ensured: 'Mocha the Dog',
    owners: ['Joevany Aliguin Jr.'],
    product: 'Medical Care Insurance',
    coverageAmount: 45000, // PHP
    dateStarted: '2023-05-01',
    policyNumber: 'N/A',
  },
  {
    id: 'app-009',
    status: 'Pending Review',
    ensured: 'Kafeslak the Dog',
    owners: ['Vee Aliguin'],
    product: 'Legacy Insurance',
    coverageAmount: 110000, // PHP
    dateStarted: '2023-05-10',
    policyNumber: 'N/A',
  },
  {
    id: 'app-010',
    status: 'Underwriting',
    ensured: 'Ccino the Dog',
    owners: ['Joeb Aliguin'],
    product: 'Medical Care Insurance',
    coverageAmount: 60000, // PHP
    dateStarted: '2023-05-20',
    policyNumber: 'N/A',
  },
];

const AdvisorInProgressApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [advisorNames, setAdvisorNames] = useState<Record<string, string>>({});

  // State to track which row is currently active/editing
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<Application['status'] | ''>('');
  const [productFilter, setProductFilter] = useState<Application['product'] | ''>('');
  const [minCoverage, setMinCoverage] = useState<string>('');
  const [maxCoverage, setMaxCoverage] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // You can adjust items per page

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
                    {['Pending Review', 'Underwriting', 'Advisor Declaration Pending', 'Interview'].map(
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#7eb238] uppercase tracking-wider">
                      Advisor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentApplications.map((app) => (
                    <tr
                      key={app.id}
                      className={`hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                        activeRowId === app.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setActiveRowId(activeRowId === app.id ? null : app.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span>{app.status}</span>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activeRowId === app.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="text"
                              value={advisorNames[app.id] || ''}
                              onChange={(e) =>
                                setAdvisorNames((prev) => ({
                                  ...prev,
                                  [app.id]: e.target.value,
                                }))
                              }
                              onClick={(e) => e.stopPropagation()} // Prevent row toggle when clicking input
                              autoFocus
                              placeholder="Assign advisor"
                              className="w-full"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveRowId(null);
                              }}
                              className="text-green-600 hover:text-green-800"
                              aria-label="Submit advisor name"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                          </div>
                          ) : (
                            advisorNames[app.id] ? (
                              <span
                                title={advisorNames[app.id]}
                                className="inline-block max-w-[10ch] truncate"
                              >
                                {advisorNames[app.id]}
                              </span>
                            ) : (
                              <span>Click to assign</span>
                            )
                          )}
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