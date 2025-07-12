import React from 'react';

import AdvisorTopNavbar from '@/components/advisor/AdvisorTopNavBar';
import ManageClaimsPage from '@/components/advisor/claims/ManageClaimsPage';

export default function AdvisorClaimsPage() {
  return (
    <>
      <AdvisorTopNavbar/>
      <ManageClaimsPage />
    </>
  );
}