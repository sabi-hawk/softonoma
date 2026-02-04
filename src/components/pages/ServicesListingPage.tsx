"use client";

import Link from "next/link";
import Image from "next/image";
import { IPageConfig } from "@/models/Page";
import { getImageUrl } from "@/lib/image-utils";

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
  
  const showHero = hero?.showHero !== false;
  const cardsPerRow = display?.cardsPerRow || 3;
  const cardStyle = display?.cardStyle || "elevated";
  const showDescriptions = display?.showDescriptions !== false;
  const showIcons = display?.showIcons !== false;

  // Grid classes based on cardsPerRow
  const getGridClasses = () => {
    switch (cardsPerRow) {
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      default: // 3
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  // Card style classes
  const getCardClasses = () => {
    switch (cardStyle) {
      case "minimal":
        return "border-2 border-gray-200 hover:border-[var(--color-primary-end)]";
      case "outlined":
        return "border-2 border-[var(--color-border-default-20)] bg-transparent hover:bg-white";
      default: // elevated
        return "bg-white border border-[var(--color-border-default-20)] shadow-md hover:shadow-xl";
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      {showHero && (hero?.title || hero?.description) && (
        <section
          className="relative py-24 sm:py-32 md:py-40 px-4 sm:px-6 lg:px-8"
          style={{
            backgroundColor: hero?.backgroundColor || "transparent",
            backgroundImage: hero?.backgroundImage
              ? `url(${getImageUrl(hero.backgroundImage)})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {hero?.backgroundImage && (
            <div className="absolute inset-0 bg-black/20" />
          )}
          <div className="relative max-w-4xl mx-auto text-center">
            {hero.title && (
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 sm:mb-8">
                {hero.title}
              </h1>
            )}
            {hero.description && (
              <p className="text-xl sm:text-2xl md:text-3xl text-white/90 max-w-3xl mx-auto">
                {hero.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {services.length > 0 ? (
            <div className={`grid ${getGridClasses()} gap-6 lg:gap-8`}>
              {services.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service.slug}`}
                  className={`group relative rounded-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${getCardClasses()}`}
                >
                  <div className="relative z-10 p-6 sm:p-8">
                    {showIcons && service.icon && (
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
                    {showDescriptions && service.description && (
                      <p className="theme-text-muted leading-relaxed text-sm sm:text-base line-clamp-3 mb-4">
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

