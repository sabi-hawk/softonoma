"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";
import { isIconUrl } from "../../utils/helpers";

interface Partner {
  name?: string;
  logo?: string;
}

interface PartnersSectionProps {
  title?: string;
  description?: string;
  partners: Partner[];
  backgroundColor?: string;
  partnersRef?: React.RefObject<HTMLDivElement | null>;
}

export default function PartnersSection({
  title,
  description,
  partners,
  backgroundColor,
  partnersRef: _partnersRef, // kept for API compat; template uses internal ref for auto-scroll
}: PartnersSectionProps) {
  const bgColor = backgroundColor || getDefaultBackground("partners");
  const background = getBackgroundStyle(bgColor);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll animation (match sections/PartnersSection)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || partners.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    const itemWidth = 200;
    const totalWidth = itemWidth * partners.length;

    const animate = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= totalWidth) {
        scrollPosition = scrollPosition - totalWidth;
      }
      container.style.transform = `translateX(-${scrollPosition}px)`;
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [partners.length]);

  return (
    <section
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${background.className || ""}`}
      style={background.style}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Rounded container with light grey background - match sections/PartnersSection */}
        <div className="relative rounded-xl sm:rounded-2xl theme-bg-secondary px-2 py-6 sm:py-12 md:py-16 shadow-sm w-full">
          <div className="relative z-10 w-full">
            {title && (
              <div className="text-center mb-6 sm:mb-10 md:mb-12">
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-primary mb-2 sm:mb-4 px-2">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm sm:text-lg theme-text-muted max-w-3xl mx-auto px-1 sm:px-2">
                    {description}
                  </p>
                )}
              </div>
            )}

            {partners.length > 0 ? (
              <div className="overflow-hidden w-full" style={{ width: "100%" }}>
                <div
                  ref={scrollContainerRef}
                  className="flex items-center"
                  style={{
                    width: `${partners.length * 2 * 200}px`,
                  }}
                >
                  {[...partners, ...partners].map((partner, index) => (
                    <div
                      key={`partner-${index}-${partner.logo || partner.name || index}`}
                      className="shrink-0 px-4 sm:px-8 flex items-center justify-center"
                      style={{ width: "200px" }}
                    >
                      <div className="w-full flex items-center justify-center opacity-100 transition-opacity duration-300 max-w-[100px] sm:max-w-[120px]">
                        {isIconUrl(partner.logo) && partner.logo ? (
                          <Image
                            src={getImageUrl(partner.logo)}
                            alt={partner.name || "Partner"}
                            width={120}
                            height={80}
                            sizes="(max-width: 640px) 100px, 120px"
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : partner.logo ? (
                          <div className="text-4xl sm:text-6xl">{partner.logo}</div>
                        ) : partner.name ? (
                          <div className="text-sm font-semibold theme-text-primary text-center">
                            {partner.name}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base theme-text-muted">
                  No partners to display yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
