"use client";

import { memo, useMemo } from "react";
import Link from "next/link";

interface FooterProps {
  companyName?: string;
  companyDescription?: string;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  quickLinks?: Array<{
    title: string;
    href: string;
  }>;
  services?: Array<{
    title: string;
    href: string;
  }>;
  industries?: Array<{
    title: string;
    href: string;
  }>;
  copyrightText?: string;
}

function Footer({
  companyName = "IT Solutions",
  companyDescription = "Leading IT solutions provider delivering innovative technology services to businesses worldwide.",
  email = "contact@softonoma.com",
  phone = "+1 (555) 123-4567",
  address = "123 Tech Street, Silicon Valley, CA 94000",
  socialLinks = {},
  quickLinks = [],
  services = [],
  industries = [],
  copyrightText,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} ${companyName}. All rights reserved.`;

  // Limit services and industries to show (for better layout)
  const displayedServices = services.slice(0, 4);
  const displayedIndustries = industries.slice(0, 5);

  return (
    <footer className="theme-bg-black theme-text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <div className="mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4 text-white">
                {companyName}
              </h3>
              <div
                className="w-12 sm:w-16 h-0.5 sm:h-1 rounded-full"
                style={{
                  background: "linear-gradient(to right, #79b246, transparent)",
                }}
              ></div>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm lg:text-base mb-4 sm:mb-8 leading-relaxed max-w-md">
              {companyDescription}
            </p>

            {/* Contact Information */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-8">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 sm:gap-3 group transition-all hover:translate-x-1"
                >
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg shrink-0"
                    style={{ backgroundColor: "rgba(121, 178, 70, 0.15)" }}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: "#79b246" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors text-xs sm:text-sm lg:text-base break-all">
                    {email}
                  </span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 sm:gap-3 group transition-all hover:translate-x-1"
                >
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg shrink-0"
                    style={{ backgroundColor: "rgba(121, 178, 70, 0.15)" }}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: "#79b246" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors text-xs sm:text-sm lg:text-base">
                    {phone}
                  </span>
                </a>
              )}
              {address && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-all"
                    style={{ backgroundColor: "rgba(121, 178, 70, 0.15)" }}
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      style={{ color: "#79b246" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-xs sm:text-sm lg:text-base">
                    {address}
                  </p>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(socialLinks.facebook ||
              socialLinks.twitter ||
              socialLinks.linkedin ||
              socialLinks.github) && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <span className="text-xs sm:text-sm text-gray-400">
                  Follow us:
                </span>
                <div className="flex items-center gap-2 sm:gap-3">
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                      style={{
                        backgroundColor: "rgba(121, 178, 70, 0.2)",
                        border: "1px solid rgba(121, 178, 70, 0.4)",
                      }}
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#79b246" }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                      style={{
                        backgroundColor: "rgba(121, 178, 70, 0.2)",
                        border: "1px solid rgba(121, 178, 70, 0.4)",
                      }}
                      aria-label="Twitter"
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#79b246" }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                      style={{
                        backgroundColor: "rgba(121, 178, 70, 0.2)",
                        border: "1px solid rgba(121, 178, 70, 0.4)",
                      }}
                      aria-label="Facebook"
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#79b246" }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {socialLinks.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                      style={{
                        backgroundColor: "rgba(121, 178, 70, 0.2)",
                        border: "1px solid rgba(121, 178, 70, 0.4)",
                      }}
                      aria-label="GitHub"
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: "#79b246" }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          {quickLinks.length > 0 && (
            <div>
              <h4 className="text-white text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 lg:mb-6 pb-2 border-b border-gray-700 flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: "#79b246" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                Quick Links
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-[#79b246] transition-colors text-xs sm:text-sm lg:text-base group flex items-center gap-2 sm:gap-3"
                    >
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#79b246] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"></div>
                      <span>{link.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services - Hidden on mobile */}
          {displayedServices.length > 0 && (
            <div className="hidden sm:block">
              <h4 className="text-white text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 lg:mb-6 pb-2 border-b border-gray-700 flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: "#79b246" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Our Services
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                {displayedServices.map((service, index) => (
                  <li key={index}>
                    <Link
                      href={service.href}
                      className="text-gray-300 hover:text-[#79b246] transition-colors text-xs sm:text-sm lg:text-base group flex items-center gap-2 sm:gap-3"
                    >
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#79b246] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"></div>
                      <span>{service.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Industries - Hidden on mobile */}
          {displayedIndustries.length > 0 && (
            <div className="hidden sm:block">
              <h4 className="text-white text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 lg:mb-6 pb-2 border-b border-gray-700 flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: "#79b246" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Industries
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3">
                {displayedIndustries.map((industry, index) => (
                  <li key={index}>
                    <Link
                      href={industry.href}
                      className="text-gray-300 hover:text-[#79b246] transition-colors text-xs sm:text-sm lg:text-base group flex items-center gap-2 sm:gap-3"
                    >
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#79b246] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"></div>
                      <span>{industry.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <h4 className="text-white text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 lg:mb-6 pb-2 border-b border-gray-700 flex items-center gap-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: "#79b246" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Newsletter
            </h4>
            <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
              Stay updated with our latest technology insights and industry
              trends.
            </p>
            <form
              className="space-y-2 sm:space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                // Handle newsletter subscription
              }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-gray-900 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all text-xs sm:text-sm lg:text-base"
                style={{
                  borderColor: "rgba(55, 65, 81, 1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#79b246";
                  e.target.style.boxShadow =
                    "0 0 0 2px rgba(121, 178, 70, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(55, 65, 81, 1)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                className="w-full px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-sm lg:text-base"
                style={{ backgroundColor: "#4a6f1c" }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div
          className="border-t pt-6 sm:pt-8 lg:pt-10"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          {/* Copyright and Legal Links */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 lg:gap-6">
            <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              {copyrightText || defaultCopyright}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-400">
              <Link
                href="/privacy"
                className="hover:text-[#79b246] transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/terms"
                className="hover:text-[#79b246] transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/sitemap"
                className="hover:text-[#79b246] transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
