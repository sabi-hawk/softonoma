import Image from "next/image";
import { ISection } from "@/models/Section";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";

interface IndustriesSectionProps {
  section: ISection;
}

// Helper to check if icon is a URL
const isIconUrl = (icon?: string): boolean => {
  if (!icon) return false;
  return icon.startsWith("http") || icon.startsWith("/");
};

export default function IndustriesSection({ section }: IndustriesSectionProps) {
  const { content } = section;
  const backgroundColor = (content.backgroundColor as string) || getDefaultBackground("industries");
  const background = getBackgroundStyle(backgroundColor, content.backgroundColorOpacity as number);

  return (
    <section
      className={`py-10 sm:py-12 md:py-14 ${background.className || ""}`}
      style={background.style}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 theme-text-black">
              {content.title}
              {content.titleUnderline && (
                <span className="block w-24 sm:w-32 h-1 theme-gradient mx-auto mt-2"></span>
              )}
            </h2>
          </div>
        )}

        {content.industries && content.industries.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {content.industries.map((industry, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-4 sm:p-6 border rounded-lg transition-colors theme-bg-white"
                style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
              >
                {industry.icon && (
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 theme-primary-end">
                    {isIconUrl(industry.icon) ? (
                      <Image
                        src={industry.icon}
                        alt={industry.name || "Icon"}
                        width={64}
                        height={64}
                        className="object-contain w-12 h-12 sm:w-16 sm:h-16"
                        unoptimized
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
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-center theme-text-black">
                    {industry.name}
                  </h3>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
