'use client'; 

import AdvisorDashboardHome from '@/components/advisor/AdvisorDashboardHome';
import AdvisorTopNavbar from '@/components/advisor/AdvisorTopNavBar';

export default function AdvisorDashboardPage() {
  return (
    <>
      <AdvisorTopNavbar/>
      <div className="p-4 sm:p-6 lg:p-8">
        <AdvisorDashboardHome />
      </div>
    </>
  );
}