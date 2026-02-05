"use client";

import Link from "next/link";
import Image from "next/image";
import { IPageConfig } from "@/models/Page";
import { getImageUrl } from "@/lib/image-utils";
import ListingHero from "./ListingHero";

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
  
  const showHero = !!(hero && hero.showHero !== false && (hero.title || hero.description));
  const cardStyle = display?.cardStyle || "minimal";
  const showIcons = display?.showIcons !== false;

  // Card style classes - solid colors, shadow and border
  const getCardClasses = () => {
    const base = "bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-200";
    switch (cardStyle) {
      case "elevated":
        return `${base} border-[var(--color-border-default-20)] hover:shadow-lg`;
      case "outlined":
        return `${base} border-2 border-[var(--color-border-default-20)] hover:border-[var(--color-primary-end)]`;
      default: // minimal
        return `${base} border-gray-200 hover:border-[var(--color-primary-end)]`;
    }
  };

  return (
    <main className="min-h-screen">
      <ListingHero hero={hero} subtitle="Our Industries" />

      {/* Industries cards - flexbox centered with wrapping */}
      <section className={`px-4 sm:px-6 lg:px-8 ${showHero ? "py-10 sm:py-12 md:py-16" : "pt-24 sm:pt-20 md:pt-32 lg:pt-36 pb-10 sm:pb-12 md:pb-16"}`}>
        <div className="max-w-7xl mx-auto">
          {industries.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6 max-w-[872px] mx-auto">
              {industries.map((industry) => (
                <Link
                  key={industry._id}
                  href={`/industries/${industry.slug}`}
                  className={`group flex flex-col items-center justify-center w-[180px] sm:w-[200px] rounded-xl transition-all duration-200 hover:-translate-y-0.5 p-4 sm:p-5 ${getCardClasses()}`}
                >
                  {showIcons && industry.icon && (
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 mb-3 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                      style={{ backgroundColor: "var(--color-primary-start-rgba-10)" }}
                    >
                      {isIconUrl(industry.icon) ? (
                        <Image
                          src={getImageUrl(industry.icon)}
                          alt={industry.title || "Icon"}
                          width={32}
                          height={32}
                          sizes="56px"
                          className="object-contain w-8 h-8 sm:w-9 sm:h-9"
                          style={{
                            filter: "grayscale(100%) brightness(0.7) sepia(100%) saturate(1800%) hue-rotate(20deg) brightness(1.25) contrast(1.05)"
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-2xl" style={{ color: "var(--color-primary-end)" }}>
                          {industry.icon}
                        </span>
                      )}
                    </div>
                  )}
                  {industry.title && (
                    <h3 className="text-sm sm:text-base font-semibold text-center theme-text-primary group-hover:text-[var(--color-primary-end)] transition-colors leading-tight">
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

