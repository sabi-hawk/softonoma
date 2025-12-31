"use client";

import Image from "next/image";
import { ISection } from "@/models/Section";
import { useEffect, useRef } from "react";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";

interface PartnersSectionProps {
  section: ISection;
}

// Helper to check if logo is a URL
const isLogoUrl = (logo?: string): boolean => {
  if (!logo) return false;
  return logo.startsWith("http") || logo.startsWith("/");
};

export default function PartnersSection({ section }: PartnersSectionProps) {
  const { content } = section;
  const backgroundColor =
    (content.backgroundColor as string) || getDefaultBackground("partners");
  const background = getBackgroundStyle(
    backgroundColor,
    content.backgroundColorOpacity as number
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const partners = Array.isArray(content.partners) ? content.partners : [];

  // Auto-scroll animation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || partners.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame
    const itemWidth = 200; // Fixed width per item (includes padding)
    const totalWidth = itemWidth * partners.length;

    const animate = () => {
      scrollPosition += scrollSpeed;

      // Reset position seamlessly when we've scrolled through all items (first set)
      if (scrollPosition >= totalWidth) {
        scrollPosition = scrollPosition - totalWidth;
      }

      container.style.transform = `translateX(-${scrollPosition}px)`;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [partners.length]);

  // Split title to show first part in white and second part in theme color
  const getTitleParts = (title: string) => {
    const lowerTitle = title.toLowerCase();
    // Check for common separators
    const andIndex = lowerTitle.indexOf(" and ");
    const spaceIndex = title.indexOf(" ");

    if (andIndex > 0) {
      return {
        firstPart: title.substring(0, andIndex).trim(),
        rest: title.substring(andIndex + 5).trim(),
      };
    }

    if (spaceIndex > 0) {
      return {
        firstPart: title.substring(0, spaceIndex).trim(),
        rest: title.substring(spaceIndex + 1).trim(),
      };
    }

    return { firstPart: title, rest: "" };
  };

  const titleParts = content.title ? getTitleParts(content.title) : null;

  return (
    <section
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        background.className || ""
      }`}
      style={background.style}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {content.title && (
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
              {titleParts ? (
                <>
                  <span className="theme-text-black">
                    {titleParts.firstPart}
                  </span>
                  {titleParts.rest && (
                    <span className="theme-primary-mid">
                      {" "}
                      {titleParts.rest}
                    </span>
                  )}
                </>
              ) : (
                <span className="theme-text-black">{content.title}</span>
              )}
            </h2>
            {content.description && (
              <p
                className="text-base sm:text-lg theme-text-black max-w-3xl mx-auto px-2"
                style={{ opacity: 0.8 }}
              >
                {content.description}
              </p>
            )}
          </div>
        )}

        {partners.length > 0 && (
          <div className="overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="flex items-center"
              style={{
                width: `${partners.length * 2 * 200}px`, // Duplicate for seamless loop
              }}
            >
              {/* Render partners twice for seamless loop */}
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={`partner-${index}-${
                    partner.logo || partner.name || index
                  }`}
                  className="shrink-0 px-8 flex items-center justify-center"
                  style={{ width: "200px" }}
                >
                  <div className="w-full h-32 flex items-center justify-center opacity-100 transition-opacity duration-300">
                    {isLogoUrl(partner.logo) && partner.logo ? (
                      <Image
                        src={partner.logo}
                        alt={partner.name || "Partner"}
                        width={200}
                        height={120}
                        className="max-w-full max-h-full object-contain"
                        unoptimized
                      />
                    ) : partner.logo ? (
                      <div className="text-5xl">{partner.logo}</div>
                    ) : partner.name ? (
                      <div className="text-xl font-semibold theme-text-black text-center">
                        {partner.name}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {partners.length === 0 && (
          <div className="text-center py-12">
            <p className="theme-text-black" style={{ opacity: 0.7 }}>
              No partners to display yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
