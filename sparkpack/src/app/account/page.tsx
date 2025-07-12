'use client';

import React from 'react';
import Link from 'next/link'; // Assuming Next.js Link for navigation

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Account</h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to your account portal. Please select an option below.
        </p>
        <div className="space-y-4">
          {/* Link to Advisor Account Management */}
          <Link href="/account/management" passHref>
            <button className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
              Manage Advisor Profile
            </button>
          </Link>
          {/* Placeholder for Customer Account Management link (will be added later) */}
          <button
            className="w-full py-3 px-6 bg-gray-200 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200 cursor-not-allowed"
            disabled
          >
            Manage Customer Profile (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
