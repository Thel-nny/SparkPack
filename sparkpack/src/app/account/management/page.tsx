"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import AccountManagementModal from "@/components/account/AccountManagementModal";

export default function AccountManagementPage() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(true); // Open modal by default on this page

  // Fix type error by ensuring userEmail is string or undefined (not null)
  const userEmail = session?.user?.email ?? undefined;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Account Management</h1>
      {modalOpen && (
        <AccountManagementModal
          userEmail={userEmail}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
