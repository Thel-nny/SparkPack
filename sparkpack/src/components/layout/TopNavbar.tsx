"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, User, Menu, X, LogOut } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  hasDropdown: boolean;
  items?: (
    | { label: string; href: string; type?: "link" }
    | { label: string; type: "heading" }
  )[];
}

interface TopNavbarProps {
  className?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ className = "" }) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("session");
    setIsLoggedIn(!!session);
  }, []);

  const navItems: NavItem[] = [
    {
      label: "Insurance",
      hasDropdown: true,
      items: [
        { label: "Our Packages", href: "#insurance-packages" },
        { label: "Coverage Details", href: "/insurance/packages" },
      ],
    },
    {
      label: "Memorial Services",
      hasDropdown: true,
      items: [{ label: "Pet Memorials", href: "#memorial-options" }],
    },
    {
      label: "Local Partners",
      hasDropdown: true,
      items: [
        { label: "Partner Veterinarians", href: "#partner-vets" },
        { label: "Pet-Friendly Businesses", href: "#partner-businesses" },
      ],
    },
    {
      label: "About",
      hasDropdown: true,
      items: [
        { label: "Our Story", href: "#our-story" },
        { label: "Why Sparkpack", href: "#why-sparkpack" },
        { label: "Team", href: "#team" },
      ],
    },
    {
      label: "Contact Support",
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=sparkpackteam@gmail.com",
      hasDropdown: false,
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
    setIsLoggedIn(false);
    setActiveDropdown(null);
    window.location.href = "/auth/login";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setActiveDropdown(null);
  };

  return (
    <nav className={`bg-[#f5f7f8] shadow-sm border-b border-gray-100 ${className} sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/Furrest Logo-02.svg"
              alt="Furrest Logo"
              width={125}
              height={40}
              className="mr-3"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex ml-10 items-baseline space-x-8">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => handleDropdownToggle(index)}
                  className="flex items-center text-[#342d47] hover:text-[#7eb238] px-3 py-2 text-base font-medium transition-colors duration-200"
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

                {item.hasDropdown && activeDropdown === index && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={handleClickOutside}
                      aria-hidden="true"
                    />
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 z-20 w-56">
                      <div className="py-1">
                        {item.items?.map((subItem, subIndex) =>
                          "href" in subItem ? (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="block px-4 py-2 text-base text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238]"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {subItem.label}
                            </Link>
                          ) : (
                            <div
                              key={subIndex}
                              className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2"
                            >
                              {subItem.label}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#342d47] hover:text-[#7eb238]"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Account Dropdown (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => handleDropdownToggle(navItems.length)}
                className="flex items-center text-[#342d47] hover:text-[#7eb238] px-3 py-2 text-base font-medium"
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
                  <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                    <div className="py-1">
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-base text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238]"
                        onClick={() => setActiveDropdown(null)}
                      >
                        Policyholder Login
                      </Link>
                      <Link
                        href="/claims/file"
                        className="block px-4 py-2 text-base text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238]"
                        onClick={() => setActiveDropdown(null)}
                      >
                        File a Claim
                      </Link>
                      {isLoggedIn && (
                        <Link
                          href="/account/management"
                          className="block px-4 py-2 text-base text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238]"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Account Management
                        </Link>
                      )}
                      {/* Removed Contact Support link */}
                      {isLoggedIn && (
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left block px-4 py-2 text-base text-red-600 hover:bg-[#f5f8f3] transition-colors duration-150"
                        >
                          <LogOut className="inline mr-1 h-4 w-4" />
                          Sign Out
                        </button>
                      )}
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
                {!item.hasDropdown ? (
                  <Link
                    href={item.href || "#"}
                    className="block px-4 py-2 text-base text-[#342d47] hover:text-[#7eb238]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleDropdownToggle(index)}
                    className="w-full flex justify-between px-4 py-2 text-base text-[#342d47] hover:text-[#7eb238]"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 ${
                        activeDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}

                {item.hasDropdown && activeDropdown === index && (
                  <div className="pl-4 border-l ml-4">
                    {item.items?.map((subItem, subIndex) =>
                      "href" in subItem ? (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className="block px-2 py-1 text-base text-[#342d47] hover:bg-[#f5f8f3] hover:text-[#7eb238]"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ) : (
                        <div
                          key={subIndex}
                          className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase"
                        >
                          {subItem.label}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Account Options */}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <Link
                href="/auth/login"
                className="block px-4 py-2 text-base text-[#342d47]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Policyholder Login
              </Link>
              <Link
                href="/claims/file"
                className="block px-4 py-2 text-base text-[#342d47]"
                onClick={() => setMobileMenuOpen(false)}
              >
                File a Claim
              </Link>
              {isLoggedIn && (
                <Link
                  href="/account/management"
                  className="block px-4 py-2 text-base text-[#342d47]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account Management
                </Link>
              )}
                      {/* Removed Contact Support link */}
              {isLoggedIn && (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-base text-red-600"
                >
                  <LogOut className="inline mr-1 h-4 w-4" />
                  Sign Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavbar;
