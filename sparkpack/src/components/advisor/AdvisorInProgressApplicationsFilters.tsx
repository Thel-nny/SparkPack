import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, ChevronDown, XCircle } from 'lucide-react';

interface FiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  productFilter: string;
  setProductFilter: (value: string) => void;
  minCoverage: string;
  setMinCoverage: (value: string) => void;
  maxCoverage: string;
  setMaxCoverage: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  activeFilterDropdown: string | null;
  setActiveFilterDropdown: (value: string | null) => void;
  clearFilters: () => void;
  areFiltersActive: boolean;
}

const AdvisorInProgressApplicationsFilters: React.FC<FiltersProps> = ({
  setStatusFilter,
  setProductFilter,
  minCoverage,
  setMinCoverage,
  maxCoverage,
  setMaxCoverage,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  activeFilterDropdown,
  setActiveFilterDropdown,
  clearFilters,
  areFiltersActive,
}) => {
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const coverageDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (dropdownName: string) => {
    setActiveFilterDropdown(activeFilterDropdown === dropdownName ? null : dropdownName);
  };

  React.useEffect(() => {
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
  }, [setActiveFilterDropdown]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
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
            {['Advisor Declaration Pending', 'Signature Process Pending', 'Signature In Process'].map(
              (statusOption) => (
                <div
                  key={statusOption}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f5f8f3] hover:text-[#7eb238] cursor-pointer"
                  onClick={() => { setStatusFilter(statusOption); setActiveFilterDropdown(null); }}
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
                onClick={() => { setProductFilter(productOption); setActiveFilterDropdown(null); }}
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
    </div>
  );
};

export default AdvisorInProgressApplicationsFilters;
