"use client";

import Link from "next/link";
import Image from "next/image";
import { ISection } from "@/models/Section";
import { getImageUrl } from "@/lib/image-utils";

interface ServicesListingSectionProps {
  readonly section: ISection;
}

// Helper to check if icon is a URL
const isIconUrl = (icon?: string): boolean => {
  if (!icon) return false;
  return icon.startsWith("http") || icon.startsWith("/");
};

export default function ServicesListingSection({ section }: ServicesListingSectionProps) {
  const { content } = section;
  const services = content.services || [];

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {content.title && (
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
              {content.title}
            </h2>
            {content.description && (
              <p className="text-base sm:text-lg md:text-xl theme-text-muted max-w-3xl mx-auto px-2">
                {content.description}
              </p>
            )}
          </div>
        )}

        {services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service: any, index: number) => (
              <Link
                key={index}
                href={`/services/${service.slug}`}
                className="group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                style={{ 
                  borderColor: "var(--color-border-default-20)",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                }}
              >
                <div className="relative z-10 p-6 sm:p-8">
                  {service.icon && (
                    <div className="w-14 h-14 mb-5 sm:mb-6 rounded-lg theme-bg-secondary flex items-center justify-center transform transition-all duration-300 group-hover:scale-105">
                      {isIconUrl(service.icon) ? (
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                          <Image
                            src={getImageUrl(service.icon)}
                            alt={service.title || "Service icon"}
                            fill
                            sizes="80px"
                            className="object-contain"
                            style={{
                              filter: "grayscale(100%) brightness(0.7) sepia(100%) saturate(1800%) hue-rotate(20deg) brightness(1.25) contrast(1.05)"
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <span 
                          className="text-2xl sm:text-3xl"
                          style={{ color: "var(--color-primary-end)" }}
                        >
                          {service.icon}
                        </span>
                      )}
                    </div>
                  )}
                  {service.title && (
                    <h3 className="text-xl sm:text-2xl font-bold theme-text-primary mb-3 group-hover:text-[var(--color-primary-end)] transition-colors">
                      {service.title}
                    </h3>
                  )}
                  {service.description && (
                    <p className="theme-text-muted leading-relaxed text-sm sm:text-base line-clamp-3">
                      {service.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-sm font-medium theme-text-primary-end opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more
                    <svg
                      className="w-4 h-4 ml-2"
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

