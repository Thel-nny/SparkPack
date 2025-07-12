'use client';

import ClientTopNavBar from '@/components/client/ClientTopNavBar';
import ClientManageClaimsComponent from '@/components/client/ClientManageClaims';

export default function ClientManageClaims() {
  return (
    <>
      <ClientTopNavBar />
      <ClientManageClaimsComponent />
    </>
  );
}