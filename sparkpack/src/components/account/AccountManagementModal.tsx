"use client";

import React, { useEffect, useState } from "react";
import ClientDetailsStep from "@/components/advisor/applications/form-steps/ClientDetailsStep";

interface AccountManagementModalProps {
  userEmail: string | undefined;
  onClose: () => void;
}

export default function AccountManagementModal({
  userEmail,
  onClose,
}: AccountManagementModalProps) {
  const [formData, setFormData] = useState<any>({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    pob: "",
    gender: "",
    email: "",
    phoneNumber: "",
    streetAddress: "",
    country: "Philippines",
    city: "Iloilo City",
    province: "Iloilo",
    postalCode: "5000",
    declarationAccuracy: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

  async function fetchUserData() {
    setLoading(true);
    try {
      const resUserList = await fetch(`/api/users?email=${encodeURIComponent(userEmail || "")}`);
      const userListJson = await resUserList.json();

      if (userListJson.success && userListJson.data.length > 0) {
        const user = userListJson.data[0];

        // Inject basic user registration data directly into formData
        setFormData((prev: any) => ({
          ...prev,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phoneNumber: user.phoneNum || "",
        }));

        if (user.role === "CUSTOMER") {
          const resClient = await fetch(`/api/clientDetails/${user.id}`);
          const clientJson = await resClient.json();

          if (clientJson.success) {
            const clientData = clientJson.data;

            setFormData((prev: any) => ({
              ...prev,
              middleName: clientData.middleName || "",
              dob: clientData.dob ? new Date(clientData.dob).toISOString().substring(0, 10) : "",
              pob: clientData.pob || "",
              gender: clientData.gender || "",
              streetAddress: clientData.streetAddress || "",
              declarationAccuracy: clientData.declarationAccuracy || false,
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = (data: Partial<typeof formData>) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    try {
      const resUserList = await fetch(`/api/users?email=${encodeURIComponent(userEmail || "")}`);
      const userListJson = await resUserList.json();

      if (!(userListJson.success && userListJson.data.length > 0)) {
        alert("User not found.");
        return;
      }

      const user = userListJson.data[0];

      // Update user basic info
      const resUser = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phoneNumber,
          role: user.role,
        }),
      });

      const userUpdate = await resUser.json();

      if (user.role === "CUSTOMER") {
        const resClient = await fetch(`/api/clientDetails/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            dob: formData.dob,
            pob: formData.pob,
            gender: formData.gender,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            streetAddress: formData.streetAddress,
            country: formData.country,
            city: formData.city,
            province: formData.province,
            postalCode: formData.postalCode,
            declarationAccuracy: formData.declarationAccuracy,
          }),
        });

        const clientUpdate = await resClient.json();

        if (clientUpdate.success) {
          alert("Account updated successfully.");
          onClose();
        } else {
          alert("Failed to update client details.");
        }
      } else {
        if (userUpdate.success) {
          alert("Account updated successfully.");
          onClose();
        } else {
          alert("Failed to update user details.");
        }
      }
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Error updating account.");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Account Management</h2>
        <ClientDetailsStep
          key={JSON.stringify(formData)}
          formData={formData}
          onUpdate={handleUpdate}
          onNext={handleSubmit}
        />
      </div>
    </div>
  );
}
