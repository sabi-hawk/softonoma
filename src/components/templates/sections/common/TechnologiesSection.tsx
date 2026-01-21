import Image from "next/image";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";
import { isIconUrl } from "../../utils/helpers";

interface TechItem {
  name: string;
  icon?: string;
}

interface TechnologiesSectionProps {
  title: string;
  description?: string;
  items: TechItem[];
  backgroundColor?: string;
  mobileItemsToShow: number;
  techIndex: number;
  totalItems: number;
  onNext: () => void;
  onPrev: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  getVisibleItems: () => number[];
  getCurrentSlideIndex: () => number;
  totalSlides: number;
}

export default function TechnologiesSection({
  title,
  description,
  items,
  backgroundColor,
  mobileItemsToShow,
  techIndex,
  totalItems,
  onNext,
  onPrev,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  getVisibleItems,
  getCurrentSlideIndex,
  totalSlides,
}: TechnologiesSectionProps) {
  const bgColor = backgroundColor || getDefaultBackground("technologies");
  const background = getBackgroundStyle(bgColor);

  const getTitleParts = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("technologies")) {
      const techIndex = lowerTitle.indexOf("technologies");
      const beforeTech = title.substring(0, techIndex).trim();
      const techPart = title.substring(techIndex, techIndex + 12);
      const afterTech = title.substring(techIndex + 12).trim();

      return {
        firstPart: beforeTech ? `${beforeTech} ${techPart}` : techPart,
        rest: afterTech,
      };
    }

    const andIndex = lowerTitle.indexOf(" and ");
    const ampIndex = lowerTitle.indexOf(" & ");
    const splitIndex = andIndex > 0 ? andIndex : ampIndex > 0 ? ampIndex : -1;

    if (splitIndex > 0) {
      return {
        firstPart: title.substring(0, splitIndex).trim(),
        rest: title.substring(splitIndex + (andIndex > 0 ? 5 : 3)).trim(),
      };
    }

    return { firstPart: title, rest: "" };
  };

  const titleParts = getTitleParts(title);
  const visibleIndices = getVisibleItems();

  return (
    <section
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${background.className || ""}`}
      style={background.style}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            <span className="theme-text-black">{titleParts.firstPart}</span>
            {titleParts.rest && <span className="theme-primary-mid-dark"> {titleParts.rest}</span>}
          </h2>
          {description && (
            <p className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2" style={{ opacity: 0.8 }}>
              {description}
            </p>
          )}
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <div
            className="md:hidden overflow-hidden px-1"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="flex gap-2">
              {visibleIndices.map((itemIndex) => {
                const tech = items[itemIndex];
                if (!tech) return null;
                return (
                  <div
                    key={itemIndex}
                    className="group theme-bg-white rounded-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden p-3 shrink-0"
                    style={{
                      width: `calc((100% - ${(mobileItemsToShow - 1) * 8}px) / ${mobileItemsToShow})`,
                      aspectRatio: "1/1",
                      minHeight: "60px",
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center relative">
                      {isIconUrl(tech.icon) && tech.icon ? (
                        <div className="relative w-10 h-10">
                          <Image
                            src={tech.icon}
                            alt={tech.name || "Technology"}
                            fill
                            className="object-contain transition-all duration-300 group-hover:scale-105"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = "none";
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement("div");
                                if (tech.icon && !isIconUrl(tech.icon)) {
                                  fallback.className = "text-lg";
                                  fallback.textContent = tech.icon;
                                } else if (tech.name) {
                                  fallback.className = "text-xs font-bold theme-text-black text-center";
                                  fallback.textContent = tech.name;
                                }
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        </div>
                      ) : tech.icon ? (
                        <div className="text-lg">{tech.icon}</div>
                      ) : tech.name ? (
                        <div className="text-xs font-semibold theme-text-black text-center px-1">{tech.name}</div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
            {totalSlides > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      getCurrentSlideIndex() === idx ? "bg-gray-800" : "bg-gray-400 opacity-40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map((tech, index) => (
              <div
                key={index}
                className="group theme-bg-white rounded-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden p-3"
                style={{ aspectRatio: "1/1", minHeight: "60px" }}
              >
                <div className="w-full h-full flex items-center justify-center relative">
                  {isIconUrl(tech.icon) && tech.icon ? (
                    <div className="relative w-12 h-12 md:w-14 md:h-14">
                      <Image
                        src={tech.icon}
                        alt={tech.name || "Technology"}
                        fill
                        className="object-contain transition-all duration-300 group-hover:scale-105"
                        unoptimized
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement("div");
                            if (tech.icon && !isIconUrl(tech.icon)) {
                              fallback.className = "text-base md:text-lg";
                              fallback.textContent = tech.icon;
                            } else if (tech.name) {
                              fallback.className = "text-xs md:text-sm font-bold theme-text-black text-center";
                              fallback.textContent = tech.name;
                            }
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                  ) : tech.icon ? (
                    <div className="text-base md:text-base">{tech.icon}</div>
                  ) : tech.name ? (
                    <div className="text-xs md:text-sm font-semibold theme-text-black text-center px-1">
                      {tech.name}
                    </div>
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

