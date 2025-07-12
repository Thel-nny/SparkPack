"use client";

import React from 'react';
import TopNavbar from '@/components/layout/TopNavbar';
import Tabs from '@/components/ui/Tabs';
import TierComparisonTable from '@/components/insurance/TierComparisonTable';
import ExclusionsTable from '@/components/insurance/ExclusionsTable';
import AddOnsSection from '@/components/insurance/AddOnsSection';
import { insurancePackagesData } from '@/data/insurancePackages';

export default function InsurancePackagesPage() {
  const tabItems = insurancePackagesData.map((packageData) => ({
    id: packageData.id,
    label: packageData.name,
    content: (
      <div className="py-8">
        <h2 className="text-3xl font-bold text-[#342d47] mb-8 text-center">
          {packageData.name} - Plans & Coverage
        </h2>
        <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto mb-12">
          {packageData.description}
        </p>

        {/* Use the general TierComparisonTable for all packages now */}
        <TierComparisonTable 
          tableData={packageData.tierComparisonTable} 
          title={`What We Cover: ${packageData.name} Tiers`} 
        />

        {/* What is NOT Covered */}
        <ExclusionsTable exclusions={packageData.notCovered} />

        {/* Optional Add-Ons */}
        <AddOnsSection addOns={packageData.addOns} />

        <div className="text-center mt-12">
            <button className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg">
                Get Your Pet's Quote Now!
            </button>
        </div>
      </div>
    ),
  }));

  return (
    <>
      <TopNavbar />
      <main className="container mx-auto px-4 py-4">
        <Tabs tabs={tabItems} defaultTabId="medical-care" />
      </main>
    </>
  );
}