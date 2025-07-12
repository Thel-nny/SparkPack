"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopNavbar from '@/components/layout/TopNavbar';
import Tabs from '@/components/ui/Tabs';
import TierComparisonTable from '@/components/insurance/TierComparisonTable';
import ExclusionsTable from '@/components/insurance/ExclusionsTable';
import AddOnsSection from '@/components/insurance/AddOnsSection';
import { insurancePackagesData } from '@/data/insurancePackages';
import MedicalCareQuoteCalculator from '@/components/insurance/MedicalCareQuoteCalculator';
import LegacyInsuranceQuoteCalculator from '@/components/insurance/LegacyInsuranceQuoteCalculator';
import MedicalCareLegacyQuoteCalculator from '@/components/insurance/MedicalCareLegacyQuoteCalculator'; // Import the new combined calculator

export default function InsurancePackagesPage() {
  const router = useRouter();
  const [activeTabId, setActiveTabId] = useState('medical-care'); // State to control active tab

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const tabIdFromHash = hash.substring(1);
      const foundPackage = insurancePackagesData.find(
        (pkg) => pkg.id === tabIdFromHash
      );

      if (foundPackage) {
        setActiveTabId(foundPackage.id);
      } else {
        const parentTabMatch = insurancePackagesData.find(pkg =>
          tabIdFromHash.startsWith(pkg.id)
        );
        if (parentTabMatch) {
            setActiveTabId(parentTabMatch.id);
        }
      }
    }
  }, []);

  const handleTabChange = (newTabId: string) => {
    setActiveTabId(newTabId);
    router.push(`#${newTabId}`, { scroll: false });
  };

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

        {/* Conditionally render the appropriate Quote Calculator */}
        {packageData.id === 'medical-care' && (
            <MedicalCareQuoteCalculator initialTierId="basic-care-essential" />
        )}
        {packageData.id === 'legacy-insurance' && (
            <LegacyInsuranceQuoteCalculator initialTierId="legacy-standard" />
        )}
        {packageData.id === 'medicare-legacy' && ( // <--- NEW CONDITION FOR MEDICAL CARE & LEGACY
            <MedicalCareLegacyQuoteCalculator initialTierId="complete-care" />
        )}


        {/* What we COVER section */}
        <TierComparisonTable
          tableData={packageData.tierComparisonTable}
          title={`What We Cover: ${packageData.name} Tiers`}
        />

        {/* What is NOT Covered section */}
        <ExclusionsTable exclusions={packageData.notCovered} />

        {/* Add-On Services section - Give it an ID for direct linking */}
        <div id={`${packageData.id}-addons`} className="mt-12">
          <AddOnsSection addOns={packageData.addOns} />
        </div>

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
        <Tabs tabs={tabItems} defaultTabId={activeTabId} onTabChange={handleTabChange} />
      </main>
    </>
  );
}