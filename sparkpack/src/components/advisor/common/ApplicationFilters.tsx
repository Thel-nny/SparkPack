'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Corrected import syntax from '=>' to 'from'
import { Filter, ChevronDown, XCircle } from 'lucide-react';

// Define the props for the consolidated ApplicationFilters component
interface ApplicationFiltersProps {
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
  
  // New prop to specify the status options for this particular filter instance
  statusOptions: string[];
  // Optional prop for the default 'All Statuses' label, if it varies
  allStatusesLabel?: string;
}

const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  statusFilter, // Kept for display/highlighting purposes, though not directly used in dropdown logic here
  setStatusFilter,
  productFilter,
  setProductFilter,
  minCoverage,
  setMinCoverage,
  maxCoverage,
  setMaxCoverage,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  activeFilterDropdown, // Destructure activeFilterDropdown to use its current value
  setActiveFilterDropdown,
  clearFilters,
  areFiltersActive,
  statusOptions, // Destructure the new prop
  allStatusesLabel = 'All Statuses', // Default label for 'All Statuses' option
}) => {
  // Refs for each dropdown to detect clicks outside
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const coverageDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Toggles the visibility of a specific filter dropdown.
   * If the clicked dropdown is already active, it closes it. Otherwise, it opens it.
   * @param dropdownName The name of the dropdown to toggle ('status', 'product', 'coverage', 'date').
   */
  const toggleDropdown = useCallback((dropdownName: string) => {
    // Directly use the current activeFilterDropdown prop to determine the next state
    setActiveFilterDropdown(activeFilterDropdown === dropdownName ? null : dropdownName);
  }, [activeFilterDropdown, setActiveFilterDropdown]); // Add activeFilterDropdown to dependencies

  /**
   * Handles the selection of a filter option within a dropdown.
   * Sets the filter value and closes the dropdown.
   * @param setter The state setter function for the filter (e.g., setStatusFilter).
   * @param value The value to set the filter to.
   */
  const handleOptionSelect = useCallback((setter: (value: string) => void, value: string) => {
    setter(value);
    setActiveFilterDropdown(null);
  }, [setActiveFilterDropdown]);

  // Effect hook to handle clicks outside of any open dropdown to close it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click occurred outside all dropdowns
      if (
        statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node) &&
        productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node) &&
        coverageDropdownRef.current && !coverageDropdownRef.current.contains(event.target as Node) &&
        dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setActiveFilterDropdown(null); // Close all dropdowns
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setActiveFilterDropdown]); // Dependency array includes setActiveFilterDropdown

  return (
    // The main container for all filter controls.
    // Adjusted to use a div with flex properties, consistent with AdvisorActiveApplications/FilterControls.tsx
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
              onClick={() => handleOptionSelect(setStatusFilter, '')} // Pass empty string for 'All'
            >
              {allStatusesLabel}
            </div>
            {statusOptions.map((option) => (
              <div
                key={option}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f5f8f3] hover:text-[#7eb238] cursor-pointer"
                onClick={() => handleOptionSelect(setStatusFilter, option)}
              >
                {option}
              </div>
            ))}
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
              onClick={() => handleOptionSelect(setProductFilter, '')}
            >
              All Products
            </div>
            {['Medical Care Insurance', 'Legacy Insurance'].map((productOption) => (
              <div
                key={productOption}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#f5f8f3] hover:text-[#7eb238] cursor-pointer"
                onClick={() => handleOptionSelect(setProductFilter, productOption)}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinCoverage(e.target.value)} // Explicitly typed 'e'
                className="w-full text-sm"
              />
              <Input
                type="number"
                placeholder="Max Amount"
                value={maxCoverage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxCoverage(e.target.value)} // Explicitly typed 'e'
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} // Explicitly typed 'e'
                className="w-full text-sm"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} // Explicitly typed 'e'
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

export default ApplicationFilters;