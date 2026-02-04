"use client";

import Link from "next/link";
import Image from "next/image";
import { IPageConfig } from "@/models/Page";
import { getImageUrl } from "@/lib/image-utils";

interface Industry {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
}

interface IndustriesListingPageProps {
  pageConfig?: IPageConfig;
  industries: Industry[];
}

// Helper to check if icon is a URL
const isIconUrl = (icon?: string): boolean => {
  if (!icon) return false;
  return icon.startsWith("http") || icon.startsWith("/");
};

export default function IndustriesListingPage({ pageConfig, industries }: IndustriesListingPageProps) {
  const hero = pageConfig?.hero;
  const display = pageConfig?.display;
  
  const showHero = hero?.showHero !== false;
  const cardsPerRow = display?.cardsPerRow || 4;
  const cardStyle = display?.cardStyle || "minimal";
  const showIcons = display?.showIcons !== false;

  // Grid classes based on cardsPerRow
  const getGridClasses = () => {
    switch (cardsPerRow) {
      case 3:
        return "grid-cols-2 sm:grid-cols-3";
      case 5:
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-5";
      default: // 4
        return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";
    }
  };

  // Card style classes
  const getCardClasses = () => {
    switch (cardStyle) {
      case "elevated":
        return "bg-white border border-[var(--color-border-default-20)] shadow-md hover:shadow-lg";
      case "outlined":
        return "border-2 border-[var(--color-border-default-20)] bg-transparent hover:bg-white/50";
      default: // minimal
        return "border border-gray-200 hover:border-[var(--color-primary-end)] bg-white/50 hover:bg-white";
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

      {/* Industries Grid - Compact, Icon-Focused */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {industries.length > 0 ? (
            <div className={`grid ${getGridClasses()} gap-4 sm:gap-6`}>
              {industries.map((industry) => (
                <Link
                  key={industry._id}
                  href={`/industries/${industry.slug}`}
                  className={`group flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 ${getCardClasses()}`}
                >
                  {showIcons && industry.icon && (
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 transform transition-all duration-300 group-hover:scale-110">
                      {isIconUrl(industry.icon) ? (
                        <Image
                          src={getImageUrl(industry.icon)}
                          alt={industry.title || "Icon"}
                          width={64}
                          height={64}
                          sizes="64px"
                          className="object-contain w-12 h-12 sm:w-16 sm:h-16 mx-auto"
                          style={{
                            filter: "grayscale(100%) brightness(0.7) sepia(100%) saturate(1800%) hue-rotate(20deg) brightness(1.25) contrast(1.05)"
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span
                          className="block"
                          style={{ color: "var(--color-primary-end)" }}
                        >
                          {industry.icon}
                        </span>
                      )}
                    </div>
                  )}
                  {industry.title && (
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-center theme-text-black group-hover:text-[var(--color-primary-end)] transition-colors">
                      {industry.title}
                    </h3>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg theme-text-muted">No industries available yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

