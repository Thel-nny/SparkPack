"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import AccountManagementModal from "@/components/account/AccountManagementModal";

export default function AccountPage() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);

  // Fix type error by ensuring userEmail is string or undefined (not null)
  const userEmail = session?.user?.email ?? undefined;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Account Management</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Edit Account Details
      </button>
      {modalOpen && (
        <AccountManagementModal
          userEmail={userEmail}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
