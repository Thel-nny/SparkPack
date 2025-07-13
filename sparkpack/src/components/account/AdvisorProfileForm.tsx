"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Define a type for the advisor's profile data
interface AdvisorProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
}

export default function AdvisorProfileForm() {
  // Mock advisor data for frontend display
  const [advisorData, setAdvisorData] = useState<AdvisorProfile>({
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '123-456-7890',
    email: 'john.doe@example.com',
    role: 'Advisor',
  });

  // State for form fields (can be used for controlled inputs)
  const [formData, setFormData] = useState<AdvisorProfile>(advisorData);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle save changes (frontend only for now)
  const handleSaveChanges = () => {
    console.log('Saving advisor profile changes:', formData);
    // In a real application, you would send this data to your API
    // e.g., await fetch('/api/users/update', { method: 'PUT', body: JSON.stringify(formData) });
    alert('Profile changes saved (frontend mock)!'); // Using alert for demonstration, replace with MessageModal
  };

  // Handle change password (frontend only for now)
  const handleChangePassword = () => {
    console.log('Sending password reset link...');
    // In a real application, you would call an API to send a reset link
    // e.g., await fetch('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ email: advisorData.email }) });
    alert('Password reset link sent to your email (frontend mock)!'); // Using alert for demonstration, replace with MessageModal
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Profile Information */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Profile Information</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">Role</Label>
                <Input
                  id="role"
                  type="text"
                  value={formData.role}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              <Button
                onClick={handleSaveChanges} //flex items-center bg-[#8cc63f] hover:bg-[#7eb238] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8cc63f] hover:bg-[#7eb238] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8cc63f] transition duration-150 ease-in-out"
              > 
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Card: Account Security */}
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Account Security</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Manage your password and security settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Manage Your Password</h3>
              <Button
                onClick={handleChangePassword}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8cc63f] hover:bg-[#7eb238] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8cc63f] transition duration-150 ease-in-out"
              >
                Change Password
              </Button>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Clicking the button above will send a password reset link to your registered email address. Follow the instructions in that email to create a new password.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}