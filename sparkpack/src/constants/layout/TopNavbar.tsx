'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import the Image component from Next.js
import { ChevronDown, Search, User } from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  hasDropdown: boolean;
  items?: (
    | { label: string; href: string; type?: 'link' }
    | { label: string; type: 'heading' }
  )[];
}

interface TopNavbarProps {
  className?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ className = '' }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const navItems: NavItem[] = [
    {
      label: 'Insurance',
      hasDropdown: true,
      items: [
        { label: 'Medical Care Insurance', type: 'heading' }, 
        { label: 'Our Packages', href: '/insurance/medical/packages' },
        { label: 'Coverage Details', href: '/insurance/medical/coverage' },
        { label: 'Add-On Services', href: '/insurance/medical/addons' },
        { label: 'Compare Plans', href: '/insurance/medical/compare' },
        { label: 'Legacy Insurance', type: 'heading' }, 
        { label: 'Our Packages', href: '/insurance/legacy/packages' },
        { label: 'Coverage Details', href: '/insurance/legacy/coverage' },
        { label: 'Compare Plans', href: '/insurance/legacy/compare' },
        { label: 'Claims Process', href: '/insurance/claims' }, 
      ],
    },
    {
      label: 'Memorial Services',
      hasDropdown: true,
      items: [
        { label: 'Cremation Services', href: '/memorial/cremation' },
        { label: 'Tree Planting Ceremony', href: '/memorial/tree-planting' },
        { label: 'Memorial Options', href: '/memorial/options' },
        { label: 'Tree Care & Maintenance', href: '/memorial/care' },
        { label: 'Memorial Gallery', href: '/memorial/gallery' },
        { label: 'Grief Support', href: '/memorial/grief-support' }, 
      ],
    },
    {
      label: 'Local Partners', 
      hasDropdown: true,
      items: [
        { label: 'Partner Veterinarians', href: '/partners/vets' },
        { label: 'Pet-Friendly Businesses', href: '/partners/businesses' },
        { label: 'Community Impact', href: '/partners/community-impact' },
        { label: 'Local Events', href: '/partners/events' },
        { label: 'Adoption Partners', href: '/partners/adoption' },
      ],
    },
    {
      label: 'About',
      hasDropdown: true,
      items: [
        { label: 'Our Story', href: '/about/story' },
        { label: 'Why Sparkpack', href: '/about/why-sparkpack' },
        { label: 'Team', href: '/about/team' },
      ],
    },
  ];

  const handleDropdownToggle = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleClickOutside = () => {
    setActiveDropdown(null);
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
              {navItems.map((item, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => handleDropdownToggle(index)}
                    className="flex items-center text-[#342d47] hover:text-[#8ba77d] px-3 py-2 text-sm font-medium transition-colors duration-200"
                    aria-expanded={activeDropdown === index}
                    aria-haspopup={item.hasDropdown}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === index ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Dropdown Menu */}
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
                                className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#8ba77d] transition-colors duration-150"
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
              ))}
            </div>
          </div>

          {/* Right Side - Get Quote (Call-to-Action) and Login/Account */}
          <div className="flex items-center space-x-4">
            {/* Get Quote Button */}
            <Link
              href="/get-quote" 
              className="flex items-center bg-[#abc896] hover:bg-[#8ba77d] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Get Quote
            </Link>

            {/* Login/Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle(navItems.length)} 
                className="flex items-center text-[#342d47] hover:text-[#8ba77d] px-3 py-2 text-sm font-medium transition-colors duration-200"
                aria-expanded={activeDropdown === navItems.length}
                aria-haspopup="true"
              >
                <User className="h-4 w-4 mr-1" /> {/* Smaller margin for icon */}
                Login/Account
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
                        href="/auth/login"
                        className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#8ba77d] transition-colors duration-150"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Policyholder Login
                      </Link>
                      <Link
                        href="/claims/file"
                        className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#8ba77d] transition-colors duration-150"
                        onClick={() => setActiveDropdown(null)}
                      >
                        File a Claim
                      </Link>
                      <Link
                        href="/account/management"
                        className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#8ba77d] transition-colors duration-150"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Account Management
                      </Link>
                      <Link
                        href="/support/contact"
                        className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#8ba77d] transition-colors duration-150"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Contact Support
                      </Link>
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

export default TopNavbar;