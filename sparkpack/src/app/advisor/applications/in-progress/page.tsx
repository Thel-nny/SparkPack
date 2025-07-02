'use client';

import AdvisorTopNavbar from "@/components/advisor/AdvisorTopNavBar";
import AdvisorInProgressApplications from "@/components/advisor/AdvisorInProgressApplications";

export default function ApplicationsInProgress() {
  return (
    <>
      <AdvisorTopNavbar/>
      <AdvisorInProgressApplications />
    </>
  );
}