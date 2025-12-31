"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  description?: string;
  icon?: string;
}

interface Industry {
  _id: string;
  title: string;
  slug: string;
  order: number;
  navOrder?: number | null;
  description?: string;
  icon?: string;
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
  const router = useRouter();
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [industriesDropdownOpen, setIndustriesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when a link is clicked
  const handleLinkClick = () => {
    setServicesDropdownOpen(false);
    setIndustriesDropdownOpen(false);
  };

  // Helper to check if icon is a URL (not an emoji)
  const isIconUrl = (icon?: string): boolean => {
    if (!icon) return false;
    return icon.startsWith("http") || icon.startsWith("/");
  };

  // Render dropdown item (used for both services and industries)
  const renderDropdownItem = (
    item: Service | Industry,
    baseUrl: "/services" | "/industries"
  ) => (
    <Link
      key={item._id}
      href={`${baseUrl}/${item.slug}`}
      onClick={handleLinkClick}
      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm"
    >
      {/* Icon Circle */}
      <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-white border border-gray-200 shadow-sm group-hover:shadow-md group-hover:border-[#79b246]/30 transition-all duration-200">
        {item.icon ? (
          isIconUrl(item.icon) ? (
            <Image
              src={item.icon}
              alt={item.title}
              width={24}
              height={24}
              className="object-contain"
              unoptimized
            />
          ) : (
            <span className="text-2xl">{item.icon}</span>
          )
        ) : (
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                baseUrl === "/services"
                  ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  : "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              }
            />
          </svg>
        )}
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#79b246] transition-colors">
          {item.title}
        </h3>
      </div>
      {/* Arrow Icon */}
      <div className="shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-4 h-4 text-[#79b246] transform group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );

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

  // Helper to get order for sorting
  const getNavItemOrder = (item: NavItem): number => {
    if (item.type === "page") return item.order;
    if (item.type === "services") return item.services[0]?.navOrder ?? 9999;
    return item.industries[0]?.navOrder ?? 9999;
  };

  // Sort by order/navOrder
  navItems.sort((a, b) => getNavItemOrder(a) - getNavItemOrder(b));

  return (
    <nav className="sticky top-0 z-50 theme-bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo on the left */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center group">
              <span className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-gray-700 transition-colors">
                Softonoma
              </span>
            </Link>
          </div>

          {/* Desktop Navigation items in the center */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                if (item.type === "page") {
                  return (
                    <Link
                      key={item.id}
                      href={`/${item.slug}`}
                      className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 relative group"
                    >
                      {item.title}
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#79b246] group-hover:w-3/4 transition-all duration-200"></span>
                    </Link>
                  );
                } else if (item.type === "services") {
                  return (
                    <div
                      key="services"
                      className="relative"
                      data-dropdown="services"
                      onMouseLeave={() => setServicesDropdownOpen(false)}
                      onMouseEnter={() => {
                        setServicesDropdownOpen(true);
                        setIndustriesDropdownOpen(false);
                      }}
                    >
                      <button
                        onClick={() => {
                          setServicesDropdownOpen(!servicesDropdownOpen);
                          setIndustriesDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-sm font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center gap-1.5 relative group ${
                          servicesDropdownOpen ? "bg-gray-50 text-gray-900" : ""
                        }`}
                      >
                        Services
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
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
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#79b246] group-hover:w-3/4 transition-all duration-200"></span>
                      </button>
                      {servicesDropdownOpen && (
                        <>
                          {/* Invisible bridge to prevent gap */}
                          <div
                            className="absolute top-full left-0 right-0 h-3"
                            onMouseEnter={() => setServicesDropdownOpen(true)}
                          />
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[650px] max-w-[90vw] z-50"
                            onMouseEnter={() => setServicesDropdownOpen(true)}
                            onMouseLeave={() => setServicesDropdownOpen(false)}
                          >
                            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {item.services.map((service) =>
                                  renderDropdownItem(service, "/services")
                                )}
                              </div>
                            </div>
                          </div>
                        </>
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
                      onMouseEnter={() => {
                        setIndustriesDropdownOpen(true);
                        setServicesDropdownOpen(false);
                      }}
                    >
                      <button
                        onClick={() => {
                          setIndustriesDropdownOpen(!industriesDropdownOpen);
                          setServicesDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-sm font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center gap-1.5 relative group ${
                          industriesDropdownOpen
                            ? "bg-gray-50 text-gray-900"
                            : ""
                        }`}
                      >
                        Industries
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
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
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#79b246] group-hover:w-3/4 transition-all duration-200"></span>
                      </button>
                      {industriesDropdownOpen && (
                        <>
                          {/* Invisible bridge to prevent gap */}
                          <div
                            className="absolute top-full left-0 right-0 h-3"
                            onMouseEnter={() => setIndustriesDropdownOpen(true)}
                          />
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[650px] max-w-[90vw] z-50"
                            onMouseEnter={() => setIndustriesDropdownOpen(true)}
                            onMouseLeave={() =>
                              setIndustriesDropdownOpen(false)
                            }
                          >
                            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {item.industries.map((industry) =>
                                  renderDropdownItem(industry, "/industries")
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </div>

          {/* Contact button on the right */}
          <div className="hidden lg:flex items-center shrink-0">
            <Link
              href="/contact"
              className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 bg-[#79b246] text-white hover:bg-[#6a9f3d] shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                if (item.type === "page") {
                  return (
                    <Link
                      key={item.id}
                      href={`/${item.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {item.title}
                    </Link>
                  );
                } else if (item.type === "services") {
                  return (
                    <div key="services" className="space-y-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setServicesDropdownOpen(!servicesDropdownOpen);
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setServicesDropdownOpen(!servicesDropdownOpen);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
                        style={{ touchAction: 'manipulation' }}
                      >
                        <span>Services</span>
                        <svg
                          className={`w-5 h-5 transition-transform pointer-events-none ${
                            servicesDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {servicesDropdownOpen && (
                        <div className="pl-4 space-y-1">
                          {item.services.map((service) => (
                            <button
                              key={service._id}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMobileMenuOpen(false);
                                setServicesDropdownOpen(false);
                                router.push(`/services/${service.slug}`);
                              }}
                              onTouchEnd={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMobileMenuOpen(false);
                                setServicesDropdownOpen(false);
                                router.push(`/services/${service.slug}`);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors cursor-pointer relative z-10"
                              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                            >
                              {service.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div key="industries" className="space-y-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIndustriesDropdownOpen(!industriesDropdownOpen);
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIndustriesDropdownOpen(!industriesDropdownOpen);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
                        style={{ touchAction: 'manipulation' }}
                      >
                        <span>Industries</span>
                        <svg
                          className={`w-5 h-5 transition-transform pointer-events-none ${
                            industriesDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {industriesDropdownOpen && (
                        <div className="pl-4 space-y-1">
                          {item.industries.map((industry) => (
                            <button
                              key={industry._id}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMobileMenuOpen(false);
                                setIndustriesDropdownOpen(false);
                                router.push(`/industries/${industry.slug}`);
                              }}
                              onTouchEnd={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setMobileMenuOpen(false);
                                setIndustriesDropdownOpen(false);
                                router.push(`/industries/${industry.slug}`);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors cursor-pointer relative z-10"
                              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                            >
                              {industry.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
              })}
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-4 mt-4 px-6 py-3 text-sm font-semibold text-center rounded-lg bg-[#79b246] text-white hover:bg-[#6a9f3d] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
