// src/components/layout/TopNavbar.tsx (REVISED)
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, User, Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href?: string; // Optional href for top-level items that don't directly navigate (e.g., just open a dropdown)
  hasDropdown: boolean;
  items?: (
    | { label: string; href: string; type?: "link" }
    | { label: string; type: "heading" }
  )[]; // Simplified to a single array for all dropdowns
}

interface TopNavbarProps {
  className?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ className = "" }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define navItems directly within the component or import from a data file
  // For this example, I'm defining them here for clarity of changes.
  const navItems: NavItem[] = [
    {
      label: "Insurance",
      hasDropdown: true,
      items: [
        { label: "Our Packages", href: "#insurance-packages" },
        { label: "Coverage Details", href: "/insurance/packages" },
        { label: "Add-On Services", href: "/insurance/packages" },
        { label: "Our Plans", href: "/insurance/packages" },
      ],
    },
    {
      label: "Memorial Services",
      hasDropdown: true,
      items: [
        { label: "Cremation Services", href: "/memorial-services#cremation-services" }, // Use full paths with section IDs
        { label: "Tree Planting Ceremony", href: "/memorial-services#tree-planting" },
        { label: "Memorial Options", href: "/memorial-services#memorial-options" },
        { label: "Tree Care & Maintenance", href: "/memorial-services#tree-care" },
        { label: "Memorial Gallery", href: "/memorial-services#gallery" },
        { label: "Grief Support", href: "/memorial-services#grief-support" },
      ],
    },
    {
      label: "Local Partners",
      hasDropdown: true,
      items: [
        { label: "Partner Veterinarians", href: "/local-partners#partner-vets" },
        { label: "Pet-Friendly Businesses", href: "/local-partners#partner-businesses" },
        { label: "Community Impact", href: "/local-partners#community-impact" },
        { label: "Local Events", href: "/local-partners#local-events" },
        { label: "Adoption Partners", href: "/local-partners#adoption-partners" },
      ],
    },
    {
      label: "About",
      hasDropdown: true,
      items: [
        { label: "Our Story", href: "/about#our-story" },
        { label: "Why Sparkpack", href: "/about#why-sparkpack" },
        { label: "Team", href: "/about#team" },
      ],
    },
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
    // Use Next.js router for navigation if available and preferred
    window.location.href = "/auth/login"; // Direct reload for sign out for simplicity
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveDropdown(null); // Close any open dropdown when mobile menu toggles
  };

  // Helper to determine if the path is active for styling, if needed
  // const isLinkActive = (href: string) => {
  //   if (!href) return false;
  //   const currentPath = window.location.pathname + window.location.hash;
  //   return currentPath === href;
  // };

  return (
    <nav
      className={`bg-[#f5f7f8] shadow-sm border-b border-gray-100 ${className} sticky top-0 z-50`}
    >
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

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex ml-10 items-baseline space-x-8">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => handleDropdownToggle(index)}
                  className="flex items-center text-[#342d47] hover:text-[#7eb238] px-3 py-2 text-sm font-medium transition-colors duration-200"
                  aria-expanded={activeDropdown === index}
                  aria-haspopup={item.hasDropdown}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown Menu (Desktop) */}
                {item.hasDropdown && activeDropdown === index && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={handleClickOutside}
                      aria-hidden="true"
                    />
                    <div
                      className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-20 w-56" // Removed conditional width
                    >
                      <div className="py-1"> {/* Removed grid classes, default to single column */}
                        {/* Render dropdown items */}
                        {(item.items as (
                          | { label: string; href: string; type?: "link" }
                          | { label: string; type: "heading" }
                        )[]).map((subItem, subIndex) =>
                          subItem.type === "heading" ? (
                            <div
                              key={subIndex}
                              className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2"
                            >
                              {subItem.label}
                            </div>
                          ) : (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                              onClick={() => setActiveDropdown(null)} // Close dropdown on link click
                            >
                              {subItem.label}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#342d47] hover:text-[#7eb238] hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#7eb238]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Right Side - Get Quote and Login/Account */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/get-quote"
              className="flex items-center bg-[#8cc63f] hover:bg-[#7eb238] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Get Quote
            </Link>

            <div className="relative">
              <button
                onClick={() => handleDropdownToggle(navItems.length)} // Use a unique index for this dropdown
                className="flex items-center text-[#342d47] hover:text-[#7eb238] px-3 py-2 text-sm font-medium transition-colors duration-200"
                aria-expanded={activeDropdown === navItems.length}
                aria-haspopup="true"
              >
                <User className="h-4 w-4 mr-1" />
                Login/Account
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === navItems.length ? "rotate-180" : ""
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
                  <div
                    className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20"
                    onClick={(e) => e.stopPropagation()} // Prevent closing dropdown when clicking inside it
                  >
                    <div className="py-1">
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Policyholder Login
                      </Link>
                      <Link
                        href="/claims/file"
                        className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                        onClick={() => setActiveDropdown(null)}
                      >
                        File a Claim
                      </Link>
                      <Link
                        href="/account/management"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                {/* Top-level mobile menu item (button or link) */}
                {!item.hasDropdown ? (
                    <Link
                        href={item.href || '#'} // Fallback href for non-dropdown items
                        className="w-full flex items-center justify-between text-[#342d47] hover:text-[#7eb238] px-4 py-2 text-sm font-medium transition-colors duration-200"
                        onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); }}
                    >
                        {item.label}
                    </Link>
                ) : (
                    <button
                        onClick={() => handleDropdownToggle(index)}
                        className="w-full flex items-center justify-between text-[#342d47] hover:text-[#7eb238] px-4 py-2 text-sm font-medium transition-colors duration-200"
                        aria-expanded={activeDropdown === index}
                        aria-haspopup={item.hasDropdown}
                    >
                        {item.label}
                        <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                                activeDropdown === index ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                )}


                {/* Dropdown Menu for Mobile */}
                {item.hasDropdown && activeDropdown === index && (
                  <div className="pl-4 border-l border-gray-200 ml-4"> {/* Indent and add border for hierarchy */}
                    {(item.items as (
                      | { label: string; href: string; type?: "link" }
                      | { label: string; type: "heading" }
                    )[]).map((subItem, subIndex) =>
                      subItem.type === "heading" ? (
                        <div
                          key={subIndex}
                          className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2"
                        >
                          {subItem.label}
                        </div>
                      ) : (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className="block px-2 py-1.5 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                          onClick={() => {
                            setActiveDropdown(null);
                            setMobileMenuOpen(false); // Close mobile menu when a sub-link is clicked
                          }}
                        >
                          {subItem.label}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile-specific Login/Account/Quote links consolidated at the bottom */}
            <div className="border-t border-gray-200 mt-2 pt-2">
                <Link
                  href="/get-quote"
                  className="block w-full text-center bg-[#8cc63f] hover:bg-[#7eb238] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 mt-2"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveDropdown(null);
                  }}
                >
                  Get Quote
                </Link>
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveDropdown(null);
                  }}
                >
                  Policyholder Login
                </Link>
                <Link
                  href="/claims/file"
                  className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveDropdown(null);
                  }}
                >
                  File a Claim
                </Link>
                <Link
                  href="/account/management"
                  className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveDropdown(null);
                  }}
                >
                  Account Management
                </Link>
                <Link
                  href="/support/contact"
                  className="block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveDropdown(null);
                  }}
                >
                  Contact Support
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false); // Close mobile menu after sign out
                  }}
                  className="w-full text-left block px-4 py-2 text-sm text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238] transition-colors duration-150"
                >
                  Sign Out
                </button>
              </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavbar;