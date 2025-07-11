// src/components/advisor/common/ClaimFilters.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Filter, X } from 'lucide-react'; // Using lucide-react for icons

// Define props for the ClaimFilters component
interface ClaimFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  claimIdFilter: string;
  setClaimIdFilter: (id: string) => void;
  policyNumberFilter: string;
  setPolicyNumberFilter: (policyNumber: string) => void;
  petNameFilter: string;
  setPetNameFilter: (petName: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  // Corrected type for setActiveFilterDropdown to accept functional updates
  activeFilterDropdown: string | null;
  setActiveFilterDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  clearFilters: () => void;
  areFiltersActive: boolean;
  statusOptions: string[]; // e.g., ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSING']
  allStatusesLabel: string; // e.g., "All Claim Statuses"
}

const ClaimFilters: React.FC<ClaimFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  claimIdFilter,
  setClaimIdFilter,
  policyNumberFilter,
  setPolicyNumberFilter,
  petNameFilter,
  setPetNameFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  activeFilterDropdown,
  setActiveFilterDropdown,
  clearFilters,
  areFiltersActive,
  statusOptions,
  allStatusesLabel,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveFilterDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setActiveFilterDropdown]);

  const toggleDropdown = useCallback((dropdownName: string) => {
    // This functional update syntax is now correctly typed due to the prop definition change.
    setActiveFilterDropdown((prevActiveDropdown) =>
      prevActiveDropdown === dropdownName ? null : dropdownName
    );
  }, [setActiveFilterDropdown]); // setActiveFilterDropdown is a stable reference due to being a setter

  return (
    <div className="relative flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-full">
      {/* Status Filter */}
      <div className="relative" ref={activeFilterDropdown === 'status' ? dropdownRef : null}>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => toggleDropdown('status')}
        >
          Status: {statusFilter || allStatusesLabel} <ChevronDown className="h-4 w-4" />
        </Button>
        {activeFilterDropdown === 'status' && (
          <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={(e) => { e.preventDefault(); setStatusFilter(''); setActiveFilterDropdown(null); }}
              >
                {allStatusesLabel}
              </a>
              {statusOptions.map((status) => (
                <a
                  key={status}
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => { e.preventDefault(); setStatusFilter(status); setActiveFilterDropdown(null); }}
                >
                  {status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase())}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Claim ID Filter */}
      <Input
        type="text"
        placeholder="Claim ID"
        value={claimIdFilter}
        onChange={(e) => setClaimIdFilter(e.target.value)}
        className="w-full sm:w-auto flex-grow max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-[#8cc63f] focus:border-[#8cc63f]"
      />

      {/* Policy Number Filter */}
      <Input
        type="text"
        placeholder="Policy Number"
        value={policyNumberFilter}
        onChange={(e) => setPolicyNumberFilter(e.target.value)}
        className="w-full sm:w-auto flex-grow max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-[#8cc63f] focus:border-[#8cc63f]"
      />

      {/* Pet Name Filter */}
      <Input
        type="text"
        placeholder="Pet Name"
        value={petNameFilter}
        onChange={(e) => setPetNameFilter(e.target.value)}
        className="w-full sm:w-auto flex-grow max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:ring-[#8cc63f] focus:border-[#8cc63f]"
      />

      {/* Date Range Filters */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:ring-[#8cc63f] focus:border-[#8cc63f]"
        />
        <Input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:ring-[#8cc63f] focus:border-[#8cc63f]"
        />
      </div>

      {/* Clear Filters Button */}
      {areFiltersActive && (
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-red-600 hover:bg-red-50"
          onClick={clearFilters}
        >
          <X className="h-4 w-4" /> Clear Filters
        </Button>
      )}
    </div>
  );
};

export default ClaimFilters;