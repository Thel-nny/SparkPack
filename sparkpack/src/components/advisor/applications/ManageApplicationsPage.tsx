'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card'; 

// Import the refined application table components
import AdvisorSubmittedApplications from '@/components/advisor/AdvisorSubmittedApplications';
import AdvisorInProgressApplications from '@/components/advisor/AdvisorInProgressApplications';
import AdvisorActiveApplications from '@/components/advisor/AdvisorActiveApplications';

const ManageApplicationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submitted' | 'inProgress' | 'active'>('submitted');

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="flex bg-white rounded-md shadow-sm overflow-hidden mb-6 border border-gray-200">
        {/* Tab for Submitted */}
        <div
          className={`flex-1 text-center py-2 px-3 cursor-pointer transition-all duration-200 ease-in-out text-sm font-semibold
                      ${activeTab === 'submitted' ? 'bg-[#8cc63f] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('submitted')}
        >
          Submitted
        </div>

        {/* Tab for In Progress */}
        <div
          className={`flex-1 text-center py-2 px-3 cursor-pointer transition-all duration-200 ease-in-out text-sm font-semibold border-l border-gray-200
                      ${activeTab === 'inProgress' ? 'bg-[#8cc63f] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('inProgress')}
        >
          In Progress
        </div>

        {/* Tab for Active Policies */}
        <div
          className={`flex-1 text-center py-2 px-3 cursor-pointer transition-all duration-200 ease-in-out text-sm font-semibold border-l border-gray-200
                      ${activeTab === 'active' ? 'bg-[#8cc63f] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          onClick={() => setActiveTab('active')}
        >
          Active Policies
        </div>
      </div>

      {/* Content Area for Tabs */}
      <Card className="p-0 rounded-lg shadow-sm overflow-hidden">
        {activeTab === 'submitted' && <AdvisorSubmittedApplications />}
        {activeTab === 'inProgress' && <AdvisorInProgressApplications />}
        {activeTab === 'active' && <AdvisorActiveApplications />}
      </Card>
    </div>
  );
};

export default ManageApplicationsPage;