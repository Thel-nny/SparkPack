"use client"

import AdvisorTopNavbar from "@/components/advisor/AdvisorTopNavBar";
import ManageApplicationsPage from '@/components/advisor/applications/ManageApplicationsPage';

export default function ApplicationsRootPage() {
  return (
    <>
      <AdvisorTopNavbar/>
      <ManageApplicationsPage/>
    </>
  );
}