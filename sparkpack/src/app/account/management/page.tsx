// sparkpack/src/app/account/management/page.tsx
'use client';

import React, { useState } from 'react';
import AdvisorTopNavbar from '@/components/advisor/AdvisorTopNavBar'; // Import the actual AdvisorTopNavbar

// --- MOCK UI COMPONENTS (FOR LAYOUT DEMONSTRATION) ---
// These mocks are self-contained for this file.
// In your actual project, you would import these from '@/components/ui'

interface CardProps extends React.PropsWithChildren {
  className?: string;
}
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

interface CardHeaderProps extends React.PropsWithChildren {
  className?: string;
}
const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

interface CardTitleProps extends React.PropsWithChildren {
  className?: string;
}
const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h2 className={`text-2xl font-bold text-gray-800 ${className}`}>
    {children}
  </h2>
);

interface CardDescriptionProps extends React.PropsWithChildren {
  className?: string;
}
const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => (
  <p className={`text-gray-600 ${className}`}>
    {children}
  </p>
);

interface CardContentProps extends React.PropsWithChildren {
  className?: string;
}
const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

interface ButtonProps extends React.PropsWithChildren {
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'outline';
}
const Button: React.FC<ButtonProps> = ({ children, className = '', onClick, disabled, type = 'button', variant = 'default' }) => {
  let baseClasses = `w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors duration-200`;
  if (variant === 'outline') {
    baseClasses += ` bg-gray-200 text-gray-800 hover:bg-gray-300`;
  } else {
    // Updated button styles here
    baseClasses += ` text-white bg-[#8cc63f] hover:bg-[#7eb238] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7eb238]`;
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

interface InputProps {
  id: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Made optional
  disabled?: boolean;
  type?: string;
  name?: string; // Made optional
  className?: string;
  required?: boolean;
}
const Input: React.FC<InputProps> = ({ id, value, onChange, disabled, type = 'text', name, className = '', required }) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    disabled={disabled}
    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className} ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
    required={required}
  />
);

interface LabelProps extends React.PropsWithChildren {
  htmlFor: string;
  className?: string;
}
const Label: React.FC<LabelProps> = ({ htmlFor, children, className = '' }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
    {children}
  </label>
);

interface SpinnerProps {
  className?: string;
}
const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => (
  <div className={`flex justify-center items-center ${className}`}>
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
  </div>
);

interface MessageModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  type?: 'success' | 'error'; // Made optional for initial state
}
const MessageModal: React.FC<MessageModalProps> = ({ isOpen, message, onClose, type }) => {
  if (!isOpen) return null;

  const bgColor = type === 'success' ? 'bg-green-100' : (type === 'error' ? 'bg-red-100' : 'bg-gray-100'); // Added default
  const textColor = type === 'success' ? 'text-green-800' : (type === 'error' ? 'text-red-800' : 'text-gray-800'); // Added default

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <div className={`p-3 rounded-md ${bgColor} ${textColor}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- REMOVED MOCK FOR AdvisorTopNavBar ---
// The actual AdvisorTopNavbar will be imported from '@/components/advisor/AdvisorTopNavBar'
// and used directly in the return statement.
// --- END MOCK UI COMPONENTS ---

export default function AdvisorAccountManagementPage() {
  // Initialize with mock data for display
  const [userData, setUserData] = useState({
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'advisor@example.com',
    phoneNum: '123-456-7890',
    role: 'ADVISOR', // Display role
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);
  // Initialize type with a valid value or make it explicitly optional in the interface
  const [modalMessage, setModalMessage] = useState({ isOpen: false, message: '', type: undefined as 'success' | 'error' | undefined });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate an async operation for saving
    setTimeout(() => {
      console.log('Simulating advisor profile update:', userData);
      setModalMessage({ isOpen: true, message: 'Profile updated successfully! (Simulated)', type: 'success' });
      setIsSaving(false);
    }, 1000);
  };

  const handleResetPassword = () => {
    setIsResetEmailSent(true);
    // Simulate sending a password reset email
    setTimeout(() => {
      console.log(`Simulating password reset email to: ${userData.email}`);
      setModalMessage({ isOpen: true, message: 'Password reset link has been sent to your email! (Simulated)', type: 'success' });
    }, 1000);
  };

  return (
    <>
      <AdvisorTopNavbar /> {/* The actual AdvisorTopNavbar is imported and used here */}
      {/* Changed background color to bg-[#f5f7f8] and adjusted min-height */}
      <div className="p-4 sm:p-6 lg:p-8 bg-[#f5f7f8] min-h-[calc(100vh-64px)] flex items-start justify-center">
        <div className="container mx-auto px-4 py-8 md:px-6 lg:py-2">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Personal Information Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your contact details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    value={userData.email}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNum">Phone Number</Label>
                  <Input
                    id="phoneNum"
                    name="phoneNum"
                    type="tel"
                    value={userData.phoneNum}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="role">User Role</Label>
                  <Input
                    id="role"
                    name="role"
                    value={userData.role}
                    disabled
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Spinner />
                      <span className="ml-2">Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Account Security Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleResetPassword}
                  className="w-full"
                  disabled={isResetEmailSent}
                >
                  {isResetEmailSent ? 'Reset Email Sent' : 'Change Password'}
                </Button>

                {isResetEmailSent && (
                  <p className="mt-2 text-sm text-green-600">
                    A password reset link has been sent to your email. Please check
                    your inbox.
                  </p>
                )}

                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    Clicking the button above will send a password reset link to
                    your registered email address. Follow the instructions in that
                    email to create a new password.
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>

          <MessageModal
            isOpen={modalMessage.isOpen}
            message={modalMessage.message}
            onClose={() => setModalMessage({ isOpen: false, message: '', type: undefined })}
            type={modalMessage.type}
          />
        </div>
      </div>
    </>
  );
}
