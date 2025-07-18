'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, User } from 'lucide-react';
import { usePathname } from 'next/navigation'; 

interface NavItem {
  label: string;
  href?: string;
  hasDropdown: boolean;
  items?: (
    | { label: string; href: string; type?: 'link' }
    | { label: string; type: 'heading' }
  )[];
}

interface ClientTopNavbarProps {
  className?: string;
}

const ClientTopNavBar: React.FC<ClientTopNavbarProps> = ({ className = '' }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const pathname = usePathname(); // Get the current path

  const navItems: NavItem[] = [
    {
      label: 'Home',
      href: '/client/dashboard',
      hasDropdown: false,
    },
    {
      label: 'Manage Claims',
      href: '/client/claims',
      hasDropdown: false,
    }
  ];

  const handleDropdownToggle = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
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
                // Determine if the current item is active
                const isActive = item.href === pathname;
                const linkClasses = `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-[#7eb238] border-b-2 border-[#7eb238]' : 'text-[#342d47] hover:text-[#7eb238]'
                }`;

                return (
                  <div key={index} className="relative">
                    {item.hasDropdown ? (
                      <button
                        onClick={() => handleDropdownToggle(index)}
                        className={`flex items-center ${linkClasses}`} // Apply linkClasses here
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
                        href={item.href || '#'} // Fallback to '#' if href is undefined
                        className={linkClasses} // Apply linkClasses here
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

          {/* Right Side - Submit a Claim and Start New Application Buttons and Account */}
          <div className="flex items-center space-x-4">
            {/* Submit a Claim Button */}
            <Link
              href="/client/claims/submit"
              className="flex items-center bg-[#8cc63f] hover:bg-[#7eb238] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Submit a Claim
            </Link>

            {/* Start New Application Button */}
            <Link
              href="/advisor/applications/new"
              className="flex items-center bg-[#8cc63f] hover:bg-[#7eb238] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Start New Application
            </Link>

            {/* Account Dropdown */}
            <div className="relative">
              <button
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
                        href="/client/account/management"
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

export default ClientTopNavBar;
