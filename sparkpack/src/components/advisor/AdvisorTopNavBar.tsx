// sparkpack/src/components/advisor/AdvisorTopNavbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href?: string; // Optional href for items that are just parents of dropdowns
  hasDropdown: boolean;
  items?: (
    | { label: string; href: string; type?: 'link' }
    | { label: string; type: 'heading' }
  )[];
}

interface AdvisorTopNavbarProps {
  className?: string;
}

const AdvisorTopNavbar: React.FC<AdvisorTopNavbarProps> = ({ className = '' }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const pathname = usePathname(); // Get the current path

  // --- UPDATED NAVIGATION ITEMS ---
  const navItems: NavItem[] = [
    {
      label: 'Home',
      href: '/advisor/dashboard', // Points to the new dashboard overview page
      hasDropdown: false,
    },
    {
      label: 'Manage Applications', // Consolidated link
      href: '/advisor/applications', // Points to the new tabbed applications page
      hasDropdown: false, // No dropdown directly from this item, tabs are internal
    },
    {
      label: 'Manage Claims', // Consolidated link
      href: '/advisor/claims', // Points to the new tabbed applications page
      hasDropdown: false, // No dropdown directly from this item, tabs are internal
    },
    // Removed 'Submitted Applications', 'Applications in Progress', 'Active Applications'
    // as they are now tabs within '/advisor/applications'
  ];
  // --- END UPDATED NAVIGATION ITEMS ---

  const handleDropdownToggle = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  // Helper function to determine if a link is active based on current pathname
  const isActiveLink = (href: string) => {
    // For 'Manage Applications', check if the path starts with '/advisor/applications'
    // but exclude '/advisor/applications/new' as it's a separate action
    if (href === '/advisor/applications') {
      return pathname.startsWith('/advisor/applications') && !pathname.startsWith('/advisor/applications/new');
    }
    // For other links like 'Home', exact match is usually sufficient
    return pathname === href;
  };


  const handleSignOut = () => {
    localStorage.clear();
    setActiveDropdown(null);
    window.location.href = '/auth/login';
  };

  return (
    <nav className={`bg-[#f5f7f8] shadow-sm border-b border-gray-100 ${className} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/Furrest Logo-02.svg"
                alt="Furrest Logo"
                width={125}
                height={40}
                className="mr-3"
              />
            </Link>
          </div>

          {/* Navigation Items */}
          <div>
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item, index) => {
                // Determine if the current item is active using the new helper
                const isActive = isActiveLink(item.href || ''); // Pass an empty string if href is undefined
                const linkClasses = `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-[#7eb238] border-b-2 border-[#7eb238]' : 'text-[#342d47] hover:text-[#7eb238]'
                }`;

                return (
                  <div key={index} className="relative">
                    {item.hasDropdown ? (
                      <button
                        onClick={() => handleDropdownToggle(index)}
                        className={`flex items-center ${linkClasses}`}
                        aria-expanded={activeDropdown === index}
                        aria-haspopup={item.hasDropdown}
                      >
                        {item.label}
                        <ChevronDown
                          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        href={item.href || '#'}
                        className={linkClasses}
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Dropdown Menu (only if hasDropdown is true) */}
                    {item.hasDropdown && activeDropdown === index && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={handleClickOutside}
                          aria-hidden="true"
                        />
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                          <div className="py-1">
                            {item.items?.map((subItem, subIndex) => (
                              subItem.type === 'heading' ? (
                                <div key={subIndex} className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
                                  {subItem.label}
                                </div>
                              ) : (
                                <Link
                                  key={subIndex}
                                  href={subItem.href}
                                  className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {subItem.label}
                                </Link>
                              )
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Start New Application (Call-to-Action) and Account */}
          <div className="flex items-center space-x-4">
            {/* Start New Application Button */}
            <Link
              href="/advisor/applications/new"
              // Apply active styling if the current path specifically matches the new application path
              className={`flex items-center bg-[#8cc63f] hover:bg-[#7eb238] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                pathname === '/advisor/applications/new' ? 'ring-2 ring-[#7eb238] ring-offset-2' : '' // Add a distinct active style for the button
              }`}
            >
              Start New Application
            </Link>

            {/* Account Dropdown */}
            {/* The index for the Account dropdown needs to be after the last regular nav item's index */}
            <div className="relative">
              <button
                // Use navItems.length for the account dropdown index
                onClick={() => handleDropdownToggle(navItems.length)}
                className="flex items-center text-[#342d47] hover:text-[#7eb238] px-3 py-2 text-sm font-medium transition-colors duration-200"
                aria-expanded={activeDropdown === navItems.length}
                aria-haspopup="true"
              >
                <User className="h-4 w-4 mr-1" />
                Account
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === navItems.length ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeDropdown === navItems.length && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={handleClickOutside}
                    aria-hidden="true"
                  />
                  <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                    <div className="py-1">
                      <Link
                        href="/advisor/account/management"
                        className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Account Management
                      </Link>
                      <Link
                        href="/support/contact"
                        className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Contact Support
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdvisorTopNavbar;