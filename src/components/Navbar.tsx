"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { getImageUrl } from "@/lib/image-utils";
import { useState, useEffect, memo, useMemo, useCallback } from "react";

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
  readonly pages: Page[];
  readonly services: Service[];
  readonly industries: Industry[];
}

function Navbar({ pages, services, industries }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
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
  const handleLinkClick = useCallback(() => {
    setServicesDropdownOpen(false);
    setIndustriesDropdownOpen(false);
  }, []);

  // Helper to check if icon is a URL (not an emoji)
  const isIconUrl = useCallback((icon?: string): boolean => {
    if (!icon) return false;
    return icon.startsWith("http") || icon.startsWith("/");
  }, []);

  // Render dropdown item (used for both services and industries) - desktop, theme-aligned
  const renderDropdownItem = (
    item: Service | Industry,
    baseUrl: "/services" | "/industries"
  ) => (
    <Link
      key={item._id}
      href={`${baseUrl}/${item.slug}`}
      prefetch={true}
      onClick={handleLinkClick}
      className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-[var(--color-primary-end-rgba-30)]"
      style={{
        backgroundColor: "rgba(255,255,255,0.06)",
        color: "var(--color-text-secondary)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
      }}
    >
      {/* Icon */}
      <div
        className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200"
        style={{
          color: "var(--color-primary-end)",
          filter: "grayscale(100%) brightness(0.7) sepia(100%) saturate(1800%) hue-rotate(20deg) brightness(1.25) contrast(1.05)"
        }}
      >
        {item.icon ? (
          isIconUrl(item.icon) ? (
            <Image
              src={getImageUrl(item.icon)}
              alt={item.title}
              width={22}
              height={22}
              sizes="22px"
              className="object-contain"
            />
          ) : (
            <span className="text-xl">{item.icon}</span>
          )
        ) : (
          <svg
            className="w-5 h-5"
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
        <span className="text-sm font-semibold text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary-end)] transition-colors block">
          {item.title}
        </span>
        {item.description && (
          <span className="text-xs mt-0.5 line-clamp-2 block" style={{ color: "rgba(255,255,255,0.7)" }}>
            {item.description}
          </span>
        )}
      </div>
      <svg
        className="w-4 h-4 shrink-0 transition-all opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5"
        style={{ color: "var(--color-primary-end)" }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );

  // Build unified navigation items array (memoized)
  const navItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = [
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
    items.sort((a, b) => getNavItemOrder(a) - getNavItemOrder(b));
    return items;
  }, [pages, services, industries]);

  // Check if a path is active
  const isActive = useCallback((slug: string) => {
    if (slug === "home" || slug === "") {
      return pathname === "/" || pathname === "";
    }
    return pathname === `/${slug}` || pathname?.startsWith(`/${slug}/`);
  }, [pathname]);

  return (
    <nav className="relative z-50 h-0" style={{ backgroundColor: "transparent" }}>
      {/* Main Navigation Bar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div 
          className="rounded-2xl px-6 py-4 flex justify-between items-center backdrop-blur-md"
          style={{
            backgroundColor: "transparent",
            border: "1px solid var(--color-border-white-30)",
            boxShadow: "0 4px 6px -1px var(--color-text-primary-rgba-10), 0 2px 4px -1px var(--color-text-primary-rgba-10)"
          }}
        >
          {/* Logo on the left */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center group gap-2">
              {/* Logo Icon - Abstract geometric shapes */}
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div 
                  className="absolute w-6 h-6 rounded"
                  style={{ 
                    backgroundColor: "var(--color-primary-mid)",
                    transform: "rotate(-10deg)"
                  }}
                />
                <div 
                  className="absolute w-5 h-5 rounded-sm"
                  style={{ 
                    backgroundColor: "var(--color-primary-end)",
                    top: "-2px",
                    right: "-2px",
                    transform: "rotate(15deg)"
                  }}
                />
              </div>
              <span 
                className="text-xl font-bold tracking-tight"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Softonoma
              </span>
            </Link>
          </div>

          {/* Desktop Navigation items in the center */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                if (item.type === "page") {
                  const active = isActive(item.slug);
                  return (
                    <Link
                      key={item.id}
                      href={`/${item.slug === "home" ? "" : item.slug}`}
                      prefetch={true}
                      className="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative"
                      style={{
                        color: active ? "var(--color-primary-end)" : "var(--color-text-secondary)"
                      }}
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
                      onMouseEnter={() => {
                        setServicesDropdownOpen(true);
                        setIndustriesDropdownOpen(false);
                      }}
                    >
                      <div className="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5"
                        style={{ 
                          backgroundColor: servicesDropdownOpen ? "var(--color-primary-start-rgba-20)" : "transparent"
                        }}
                      >
                        <Link
                          href="/services"
                          className="flex-1"
                          style={{ 
                            color: "var(--color-text-secondary)"
                          }}
                        >
                          Services
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setServicesDropdownOpen(!servicesDropdownOpen);
                            setIndustriesDropdownOpen(false);
                          }}
                          className="flex items-center justify-center"
                          style={{ 
                            color: "var(--color-text-secondary)"
                          }}
                        >
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
                        </button>
                      </div>
                      {servicesDropdownOpen && (
                        <>
                          <div
                            className="absolute top-full left-0 right-0 h-2"
                            onMouseEnter={() => setServicesDropdownOpen(true)}
                          />
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[580px] max-w-[90vw] z-50"
                            onMouseEnter={() => setServicesDropdownOpen(true)}
                            onMouseLeave={() => setServicesDropdownOpen(false)}
                          >
                            <div
                              className="rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
                              style={{
                                backgroundColor: "var(--color-primary-start)",
                                border: "1px solid var(--color-border-white-30)",
                              }}
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
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
                      <div className="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5"
                        style={{ 
                          backgroundColor: industriesDropdownOpen ? "var(--color-primary-start-rgba-20)" : "transparent"
                        }}
                      >
                        <Link
                          href="/industries"
                          className="flex-1"
                          style={{ 
                            color: "var(--color-text-secondary)"
                          }}
                        >
                          Industries
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIndustriesDropdownOpen(!industriesDropdownOpen);
                            setServicesDropdownOpen(false);
                          }}
                          className="flex items-center justify-center"
                          style={{ 
                            color: "var(--color-text-secondary)"
                          }}
                        >
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
                        </button>
                      </div>
                      {industriesDropdownOpen && (
                        <>
                          <div
                            className="absolute top-full left-0 right-0 h-2"
                            onMouseEnter={() => setIndustriesDropdownOpen(true)}
                          />
                          <div
                            className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[580px] max-w-[90vw] z-50"
                            onMouseEnter={() => setIndustriesDropdownOpen(true)}
                            onMouseLeave={() =>
                              setIndustriesDropdownOpen(false)
                            }
                          >
                            <div
                              className="rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl max-h-[75vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
                              style={{
                                backgroundColor: "var(--color-primary-start)",
                                border: "1px solid var(--color-border-white-30)",
                              }}
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
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

          {/* CTA button on the right */}
          <div className="hidden lg:flex items-center shrink-0">
            <Link
              href="/contact"
              className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              style={{
                background: "var(--color-primary-gradient)",
                color: "var(--color-text-secondary)"
              }}
            >
              Get started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                color: "var(--color-text-secondary)",
                backgroundColor: "var(--color-primary-start-rgba-20)"
              }}
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
          <div
            className="lg:hidden animate-in slide-in-from-top duration-200 rounded-2xl -mx-1 -mb-1 overflow-hidden backdrop-blur-md"
            style={{
              borderTop: "1px solid var(--color-border-white-30)",
              backgroundColor: "rgba(42, 68, 94, 0.8)",
              boxShadow: "0 20px 40px -12px rgba(0,0,0,0.35)",
            }}
          >
            <div className="px-3 py-4 flex flex-col gap-1">
              {navItems.map((item) => {
                if (item.type === "page") {
                  const active = isActive(item.slug);
                  return (
                    <Link
                      key={item.id}
                      href={`/${item.slug === "home" ? "" : item.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3.5 text-[15px] font-medium rounded-xl transition-colors active:scale-[0.98]"
                      style={{
                        color: active ? "var(--color-primary-end)" : "var(--color-text-secondary)",
                        backgroundColor: active ? "rgba(255,255,255,0.12)" : "transparent",
                      }}
                    >
                      {item.title}
                    </Link>
                  );
                } else if (item.type === "services") {
                  return (
                    <div key="services" className="rounded-xl overflow-hidden">
                      <div className="w-full flex items-center justify-between px-4 py-3.5 text-[15px] font-medium rounded-xl transition-colors"
                        style={{
                          backgroundColor: servicesDropdownOpen ? "rgba(255,255,255,0.12)" : "transparent",
                        }}
                      >
                        <Link
                          href="/services"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 active:scale-[0.98]"
                          style={{
                            touchAction: "manipulation",
                            WebkitTapHighlightColor: "transparent",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          Services
                        </Link>
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
                          className="flex items-center justify-center active:scale-[0.98]"
                          style={{
                            touchAction: "manipulation",
                            WebkitTapHighlightColor: "transparent",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          <svg
                            className={`w-5 h-5 opacity-80 transition-transform duration-200 ${
                              servicesDropdownOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      {servicesDropdownOpen && (
                        <div className="pl-4 pr-2 pb-2 space-y-0.5 border-l-2 border-[var(--color-primary-end-rgba-30)] ml-4">
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
                              className="block w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
                              style={{
                                touchAction: "manipulation",
                                WebkitTapHighlightColor: "transparent",
                                color: "rgba(255,255,255,0.9)",
                              }}
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
                    <div key="industries" className="rounded-xl overflow-hidden">
                      <div className="w-full flex items-center justify-between px-4 py-3.5 text-[15px] font-medium rounded-xl transition-colors"
                        style={{
                          backgroundColor: industriesDropdownOpen ? "rgba(255,255,255,0.12)" : "transparent",
                        }}
                      >
                        <Link
                          href="/industries"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 active:scale-[0.98]"
                          style={{
                            touchAction: "manipulation",
                            WebkitTapHighlightColor: "transparent",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          Industries
                        </Link>
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
                          className="flex items-center justify-center active:scale-[0.98]"
                          style={{
                            touchAction: "manipulation",
                            WebkitTapHighlightColor: "transparent",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          <svg
                            className={`w-5 h-5 opacity-80 transition-transform duration-200 ${
                              industriesDropdownOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      {industriesDropdownOpen && (
                        <div className="pl-4 pr-2 pb-2 space-y-0.5 border-l-2 border-[var(--color-primary-end-rgba-30)] ml-4">
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
                              className="block w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer active:scale-[0.98]"
                              style={{
                                touchAction: "manipulation",
                                WebkitTapHighlightColor: "transparent",
                                color: "rgba(255,255,255,0.9)",
                              }}
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
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--color-border-white-30)" }}>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full px-5 py-3.5 text-[15px] font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
                  style={{
                    backgroundColor: "var(--color-primary-end)",
                    color: "var(--color-text-primary)",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                  }}
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default memo(Navbar);
