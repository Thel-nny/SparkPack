// src/components/advisor/claims/ManageClaimsPage.tsx
'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

// Import the specific claim list components
import ClaimsQueue from './ClaimsQueue';
import ClaimsHistory from './ClaimsHistory';

// ManageClaimsPage serves as the central hub for advisors to manage claims.
// It provides a tabbed interface to switch between the "Claims Queue"
// (for pending/processing claims) and "Claims History" (for all past claims).
const ManageClaimsPage: React.FC = () => {
  // State to manage the currently active tab.
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Tab Navigation - Styled consistently with ManageApplicationsPage */}
      <div className="flex bg-white rounded-md shadow-sm overflow-hidden mb-6 border border-gray-200">
        {/* Tab for Claims Queue */}
        <div
          className={`flex-1 text-center py-2 px-3 cursor-pointer transition-all duration-200 ease-in-out text-sm font-semibold
                      ${activeTab === 'queue' ? 'bg-[#8cc63f] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('queue')}
        >
          Claims Queue
        </div>

        {/* Tab for Claims History */}
        <div
          className={`flex-1 text-center py-2 px-3 cursor-pointer transition-all duration-200 ease-in-out text-sm font-semibold border-l border-gray-200
                      ${activeTab === 'history' ? 'bg-[#8cc63f] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('history')}
        >
          Claims History
        </div>
      </div>

      {/* Content Area for Tabs - Uses Card component for consistent styling */}
      <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
        {/* Conditionally render the component based on the active tab */}
        {activeTab === 'queue' && <ClaimsQueue />}
        {activeTab === 'history' && <ClaimsHistory />}
      </Card>
    </div>
  );
};

export default ManageClaimsPage;