import Image from "next/image";
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
  partnersRef: React.RefObject<HTMLDivElement | null>;
}

export default function PartnersSection({
  title,
  description,
  partners,
  backgroundColor,
  partnersRef,
}: PartnersSectionProps) {
  const bgColor = backgroundColor || getDefaultBackground("partners");
  const background = getBackgroundStyle(bgColor);

  const getTitleParts = (title: string) => {
    const lowerTitle = title.toLowerCase();
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

  return (
    <section
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${background.className || ""}`}
      style={background.style}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {title && (
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            {(() => {
              const titleParts = getTitleParts(title);
              return (
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
                  <span className="theme-text-black">{titleParts.firstPart}</span>
                  {titleParts.rest && (
                    <span className="theme-primary-mid-dark"> {titleParts.rest}</span>
                  )}
                </h2>
              );
            })()}
            {description && (
              <p className="text-base sm:text-lg theme-text-black max-w-3xl mx-auto px-2" style={{ opacity: 0.8 }}>
                {description}
              </p>
            )}
          </div>
        )}
        <div className="overflow-hidden">
          <div
            ref={partnersRef}
            className="flex items-center"
            style={{ width: `${partners.length * 2 * 200}px` }}
          >
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`partner-${index}-${partner.logo || partner.name || index}`}
                className="shrink-0 px-8 flex items-center justify-center"
                style={{ width: "200px" }}
              >
                <div className="w-full h-32 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300">
                  {isIconUrl(partner.logo) && partner.logo ? (
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
                    <div className="text-xl font-semibold theme-text-black text-center">{partner.name}</div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

