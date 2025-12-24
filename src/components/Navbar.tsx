"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Page {
  _id: string;
  title: string;
  slug: string;
  order: number;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  order: number;
  navOrder?: number | null;
}

interface Industry {
  _id: string;
  title: string;
  slug: string;
  order: number;
  navOrder?: number | null;
}

type NavItem =
  | { type: "page"; id: string; title: string; slug: string; order: number }
  | { type: "services"; services: Service[] }
  | { type: "industries"; industries: Industry[] };

interface NavbarProps {
  pages: Page[];
  services: Service[];
  industries: Industry[];
}

export default function Navbar({ pages, services, industries }: NavbarProps) {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [industriesDropdownOpen, setIndustriesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest('[data-dropdown="services"]') &&
        !target.closest('[data-dropdown="industries"]')
      ) {
        setServicesDropdownOpen(false);
        setIndustriesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when a link is clicked
  const handleLinkClick = () => {
    setServicesDropdownOpen(false);
    setIndustriesDropdownOpen(false);
  };

  // Build unified navigation items array
  const navItems: NavItem[] = [
    ...pages.map((page) => ({
      type: "page" as const,
      id: page._id,
      title: page.title,
      slug: page.slug,
      order: page.order,
    })),
    ...(services.length > 0 ? [{ type: "services" as const, services }] : []),
    ...(industries.length > 0
      ? [{ type: "industries" as const, industries }]
      : []),
  ];

  // Sort by order/navOrder
  navItems.sort((a, b) => {
    let aOrder: number;
    let bOrder: number;

    if (a.type === "page") {
      aOrder = a.order;
    } else if (a.type === "services") {
      aOrder = a.services[0]?.navOrder ?? 9999;
    } else {
      aOrder = a.industries[0]?.navOrder ?? 9999;
    }

    if (b.type === "page") {
      bOrder = b.order;
    } else if (b.type === "services") {
      bOrder = b.services[0]?.navOrder ?? 9999;
    } else {
      bOrder = b.industries[0]?.navOrder ?? 9999;
    }

    return aOrder - bOrder;
  });

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "theme-bg-white shadow-lg backdrop-blur-md"
          : "theme-bg-black"
      }`}
      style={
        isScrolled
          ? { backgroundColor: "rgba(255, 255, 255, 0.95)" }
          : { backgroundColor: "rgba(0, 0, 0, 0.95)" }
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo on the left */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className={`transition-colors ${
                isScrolled
                  ? "theme-text-black theme-hover-primary"
                  : "theme-text-white theme-hover-primary"
              }`}
            >
              <span className="text-xl font-bold">Softonoma</span>
            </Link>
          </div>

          {/* Navigation items in the center */}
          <div className="flex-1 flex justify-center items-center">
            <div className="flex space-x-1 items-center">
              {navItems.map((item) => {
                if (item.type === "page") {
                  return (
                    <Link
                      key={item.id}
                      href={`/${item.slug}`}
                      className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer uppercase tracking-wide ${
                        isScrolled
                          ? "theme-text-black theme-hover-primary"
                          : "theme-text-white theme-hover-primary"
                      }`}
                    >
                      {item.title}
                    </Link>
                  );
                } else if (item.type === "services") {
                  return (
                    <div
                      key="services"
                      className="relative"
                      data-dropdown="services"
                      onMouseLeave={() => setServicesDropdownOpen(false)}
                    >
                      <button
                        onClick={() => {
                          setServicesDropdownOpen(!servicesDropdownOpen);
                          setIndustriesDropdownOpen(false);
                        }}
                        onMouseEnter={() => {
                          setServicesDropdownOpen(true);
                          setIndustriesDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 uppercase tracking-wide ${
                          isScrolled
                            ? "theme-text-black theme-hover-primary"
                            : "theme-text-white theme-hover-primary"
                        }`}
                      >
                        Services
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            servicesDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      {servicesDropdownOpen && (
                        <div
                          className={`absolute top-full left-0 mt-1 w-48 backdrop-blur-md rounded-md shadow-lg border py-1 z-50 ${
                            isScrolled ? "theme-bg-white" : "theme-bg-black/95"
                          }`}
                          style={
                            isScrolled
                              ? {
                                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                                  borderColor: "rgba(0, 0, 0, 0.1)",
                                }
                              : {
                                  backgroundColor: "rgba(0, 0, 0, 0.95)",
                                  borderColor: "rgba(255, 255, 255, 0.1)",
                                }
                          }
                        >
                          {item.services.map((service) => (
                            <Link
                              key={service._id}
                              href={`/services/${service.slug}`}
                              onClick={handleLinkClick}
                              className={`block px-4 py-2 text-sm transition-colors theme-hover-primary ${
                                isScrolled
                                  ? "theme-text-black hover:bg-gray-100"
                                  : "theme-text-white hover:bg-gray-800"
                              }`}
                            >
                              {service.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key="industries"
                      className="relative"
                      data-dropdown="industries"
                      onMouseLeave={() => setIndustriesDropdownOpen(false)}
                    >
                      <button
                        onClick={() => {
                          setIndustriesDropdownOpen(!industriesDropdownOpen);
                          setServicesDropdownOpen(false);
                        }}
                        onMouseEnter={() => {
                          setIndustriesDropdownOpen(true);
                          setServicesDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 uppercase tracking-wide ${
                          isScrolled
                            ? "theme-text-black theme-hover-primary"
                            : "theme-text-white theme-hover-primary"
                        }`}
                      >
                        Industries
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            industriesDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                      {industriesDropdownOpen && (
                        <div
                          className={`absolute top-full left-0 mt-1 w-48 backdrop-blur-md rounded-md shadow-lg border py-1 z-50 ${
                            isScrolled ? "theme-bg-white" : "theme-bg-black/95"
                          }`}
                          style={
                            isScrolled
                              ? {
                                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                                  borderColor: "rgba(0, 0, 0, 0.1)",
                                }
                              : {
                                  backgroundColor: "rgba(0, 0, 0, 0.95)",
                                  borderColor: "rgba(255, 255, 255, 0.1)",
                                }
                          }
                        >
                          {item.industries.map((industry) => (
                            <Link
                              key={industry._id}
                              href={`/industries/${industry.slug}`}
                              onClick={handleLinkClick}
                              className={`block px-4 py-2 text-sm transition-colors theme-hover-primary ${
                                isScrolled
                                  ? "theme-text-black hover:bg-gray-100"
                                  : "theme-text-white hover:bg-gray-800"
                              }`}
                            >
                              {industry.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </div>

          {/* Contact/Admin button on the right */}
          <div className="flex items-center shrink-0">
            <Link
              href="/contact"
              className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer uppercase tracking-wide ${
                isScrolled
                  ? "theme-text-black theme-hover-primary"
                  : "theme-text-white theme-hover-primary"
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
