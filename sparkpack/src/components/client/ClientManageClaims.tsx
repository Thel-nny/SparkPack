'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

// Import the specific claim list components
import ClaimsPending from './claims/ClaimsPending';
import ClaimsCompleted from './claims/ClaimsCompleted';

const ClientManageClaims: React.FC = () => {
  // State to manage the currently active tab.
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Tab Navigation - Styled consistently with ManageApplicationsPage */}
      <div className="flex bg-white rounded-md shadow-sm overflow-hidden mb-6 border border-gray-200">
        {/* Tab for Claims Queue */}
        <div
          className={`flex-1 text-center py-2 px-3 cursor-pointer transition-all duration-200 ease-in-out text-sm font-semibold
                      ${activeTab === 'pending' ? 'bg-[#8cc63f] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('pending')}
        >
          Claims Submitted
        </div>

        {/* Tab for Claims History */}
        <div
          className={`flex-1 text-center py-2 px-3 cursor-pointer transition-all duration-200 ease-in-out text-sm font-semibold border-l border-gray-200
                      ${activeTab === 'completed' ? 'bg-[#8cc63f] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('completed')}
        >
          Claims Completed
        </div>
      </div>

      {/* Content Area for Tabs - Uses Card component for consistent styling */}
      <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
        {/* Conditionally render the component based on the active tab */}
        {activeTab === 'pending' && <ClaimsPending />}
        {activeTab === 'completed' && <ClaimsCompleted />}
      </Card>
    </div>
  );
};

export default ClientManageClaims;