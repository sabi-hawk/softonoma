"use client";

import Link from "next/link";
import Image from "next/image";
import { ISection } from "@/models/Section";
import { getImageUrl } from "@/lib/image-utils";

interface IndustriesListingSectionProps {
  readonly section: ISection;
}

// Helper to check if icon is a URL
const isIconUrl = (icon?: string): boolean => {
  if (!icon) return false;
  return icon.startsWith("http") || icon.startsWith("/");
};

export default function IndustriesListingSection({ section }: IndustriesListingSectionProps) {
  const { content } = section;
  const industries = content.industries || [];

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

        {industries.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {industries.map((industry: any, index: number) => (
              <Link
                key={index}
                href={`/industries/${industry.slug}`}
                className="group flex flex-col items-center justify-center p-4 sm:p-6 border rounded-lg transition-all duration-300 theme-bg-white hover:shadow-lg hover:-translate-y-1"
                style={{ borderColor: "var(--color-border-default)" }}
              >
                {industry.icon && (
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 theme-primary-end transform transition-all duration-300 group-hover:scale-110">
                    {isIconUrl(industry.icon) ? (
                      <Image
                        src={getImageUrl(industry.icon)}
                        alt={industry.name || "Icon"}
                        width={64}
                        height={64}
                        sizes="64px"
                        className="object-contain w-12 h-12 sm:w-16 sm:h-16"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      industry.icon
                    )}
                  </div>
                )}
                {industry.name && (
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-center theme-text-black group-hover:text-[var(--color-primary-end)] transition-colors">
                    {industry.name}
                  </h3>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

