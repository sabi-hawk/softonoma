import { ISection } from "@/models/Section";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";
import Image from "next/image";
import * as FaIcons from "react-icons/fa";
import * as HiIcons from "react-icons/hi";
import * as MdIcons from "react-icons/md";
import * as IoIcons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import { ComponentType } from "react";
import { getImageUrl } from "@/lib/image-utils";

interface StatsSectionProps {
  readonly section: ISection;
}


interface IconSet {
  readonly [key: string]: ComponentType<{ style?: React.CSSProperties; className?: string }>;
}

// Helper to check if a string is a URL
const isIconUrl = (icon: string | undefined): boolean => {
  if (!icon) return false;
  return icon.startsWith("http://") || icon.startsWith("https://") || icon.startsWith("/");
};

// Helper to get permanent URL for S3 images (uses CDN when configured)
function getDisplayUrl(urlOrKey: string): string {
  return getImageUrl(urlOrKey);
}

// Helper to get React Icon component by name
const getReactIcon = (iconName: string | undefined): ComponentType<{ style?: React.CSSProperties; className?: string }> | null => {
  if (!iconName) return null;
  
  // Check if it's a URL or emoji (not a React icon name)
  if (isIconUrl(iconName) || iconName.length <= 2 || !/^[A-Z]/.test(iconName)) {
    return null;
  }

  // Try to find icon in different icon sets
  const iconSets: Array<{ set: IconSet; prefix: string }> = [
    { set: FaIcons as IconSet, prefix: "Fa" },
    { set: HiIcons as IconSet, prefix: "Hi" },
    { set: MdIcons as IconSet, prefix: "Md" },
    { set: IoIcons as IconSet, prefix: "Io" },
    { set: BsIcons as IconSet, prefix: "Bs" },
    { set: AiIcons as IconSet, prefix: "Ai" },
  ];

  for (const { set, prefix } of iconSets) {
    if (iconName.startsWith(prefix)) {
      const IconComponent = set[iconName];
      if (IconComponent) {
        return IconComponent;
      }
    }
  }

  return null;
};

export default function StatsSection({ section }: StatsSectionProps) {
  const { content } = section;
  const backgroundColor =
    (content.backgroundColor as string) || getDefaultBackground("stats");
  const background = getBackgroundStyle(
    backgroundColor,
    content.backgroundColorOpacity as number
  );

  // Default to light grey-blue background to match the image
  const sectionBackground = backgroundColor === "lightGrey" || !backgroundColor 
    ? "var(--color-bg-secondary)" 
    : background.style?.background || background.className;

  return (
    <section
      className={`py-12 sm:py-16 md:py-20 ${background.className || ""}`}
      style={{
        ...background.style,
        backgroundColor: sectionBackground === "var(--color-bg-secondary)" ? sectionBackground : undefined,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(content.title || content.description) && (
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            {content.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-primary mb-3 sm:mb-4 px-2">
                {content.title}
              </h2>
            )}
            {content.description && (
              <p className="text-base sm:text-lg md:text-xl theme-text-muted max-w-3xl mx-auto px-2">
                {content.description}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
          {content.stats && content.stats.length > 0
            ? content.stats.map((stat, index) => {
                const iconValue = stat.icon || stat.image;
                const displayIconUrl = iconValue && isIconUrl(iconValue) ? getDisplayUrl(iconValue) : null;
                const ReactIcon = getReactIcon(iconValue);
                
                const uniqueKey = `${stat.number}-${stat.title || stat.label || ""}-${index}`;
                return (
                  <div
                    key={uniqueKey}
                    className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-4"
                  >
                    {/* Icon - Grey, at top on mobile, on left on desktop */}
                    {iconValue && (
                      <div className="flex items-center justify-center">
                        {ReactIcon ? (
                          <ReactIcon 
                            style={{ 
                              color: "#A7B1BE", 
                              fontSize: "40px",
                              width: "40px",
                              height: "40px"
                            }}
                          />
                        ) : displayIconUrl ? (
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                            <Image
                              src={displayIconUrl}
                              alt={stat.title || stat.label || "Stat icon"}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                              style={{ 
                                filter: "brightness(0) saturate(100%) invert(65%) sepia(8%) saturate(500%) hue-rotate(180deg) brightness(95%) contrast(90%)",
                                opacity: 0.7
                              }}
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div 
                            className="text-3xl sm:text-4xl"
                            style={{ color: "#A7B1BE" }}
                          >
                            {iconValue}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content - Number and Label */}
                    <div className="flex flex-col items-center justify-center">
                      {/* Number/Value - Orange/gold */}
                      {stat.number && (
                        <div className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-center theme-text-primary">
                          {stat.number}
                        </div>
                      )}

                      {/* Label/Title - Dark grey */}
                      {(stat.title || stat.label) && (
                        <h3 
                          className="text-sm sm:text-base font-semibold mt-1 text-center"
                          style={{ color: "#333333" }}
                        >
                          {stat.title || stat.label}
                        </h3>
                      )}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </section>
  );
}
