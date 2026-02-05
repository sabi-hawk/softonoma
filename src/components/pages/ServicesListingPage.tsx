"use client";

import Link from "next/link";
import Image from "next/image";
import { IPageConfig } from "@/models/Page";
import { getImageUrl } from "@/lib/image-utils";
import ListingHero from "./ListingHero";

interface Service {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
}

interface ServicesListingPageProps {
  pageConfig?: IPageConfig;
  services: Service[];
}

// Helper to check if icon is a URL
const isIconUrl = (icon?: string): boolean => {
  if (!icon) return false;
  return icon.startsWith("http") || icon.startsWith("/");
};

export default function ServicesListingPage({ pageConfig, services }: ServicesListingPageProps) {
  const hero = pageConfig?.hero;
  const display = pageConfig?.display;
  
  const showHero = !!(hero && hero.showHero !== false && (hero.title || hero.description));
  const cardStyle = display?.cardStyle || "elevated";
  const showDescriptions = display?.showDescriptions !== false;
  const showIcons = display?.showIcons !== false;

  // Card style classes - solid colors only, no gradient
  const getCardClasses = () => {
    switch (cardStyle) {
      case "minimal":
        return "bg-white border border-gray-200 hover:border-[var(--color-primary-end)] hover:shadow-md";
      case "outlined":
        return "bg-white border-2 border-[var(--color-border-default-20)] hover:border-[var(--color-primary-end)]";
      default: // elevated
        return "bg-white border border-[var(--color-border-default-20)] shadow-md hover:shadow-lg";
    }
  };

  return (
    <main className="min-h-screen">
      <ListingHero hero={hero} subtitle="Our Services" />

      {/* Services cards - flexbox centered with wrapping */}
      <section className={`px-4 sm:px-6 lg:px-8 ${showHero ? "py-12 sm:py-16 md:py-24" : "pt-24 sm:pt-20 md:pt-32 lg:pt-36 pb-12 sm:pb-16 md:pb-24"}`}>
        <div className="max-w-7xl mx-auto">
          {services.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-5 md:gap-6">
              {services.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service.slug}`}
                  className={`group flex flex-col w-[280px] sm:w-[300px] rounded-xl transition-all duration-200 hover:-translate-y-0.5 overflow-hidden ${getCardClasses()}`}
                >
                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    {showIcons && service.icon && (
                      <div
                        className="w-11 h-11 mb-4 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                        style={{ backgroundColor: "var(--color-primary-start-rgba-10)" }}
                      >
                        {isIconUrl(service.icon) ? (
                          <div className="relative w-6 h-6 sm:w-7 sm:h-7">
                            <Image
                              src={getImageUrl(service.icon)}
                              alt={service.title || "Service icon"}
                              fill
                              sizes="56px"
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
                          <span className="text-xl" style={{ color: "var(--color-primary-end)" }}>
                            {service.icon}
                          </span>
                        )}
                      </div>
                    )}
                    {service.title && (
                      <h3 className="text-lg font-bold theme-text-primary mb-2 group-hover:text-[var(--color-primary-end)] transition-colors leading-tight">
                        {service.title}
                      </h3>
                    )}
                    {showDescriptions && service.description && (
                      <p className="theme-text-muted text-sm leading-relaxed line-clamp-3 flex-1">
                        {service.description}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center text-sm font-medium theme-text-primary-end opacity-80 group-hover:opacity-100 transition-opacity">
                      Learn more
                      <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg theme-text-muted">No services available yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

