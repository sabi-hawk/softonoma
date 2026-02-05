import Image from "next/image";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";
import { isIconUrl } from "../../utils/helpers";

interface TechItem {
  name: string;
  icon?: string;
  category?: string;
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

  const getTitleParts = (titleText: string) => {
    const lowerTitle = titleText.toLowerCase();
    if (lowerTitle.includes("technologies")) {
      const techIdx = lowerTitle.indexOf("technologies");
      const beforeTech = titleText.substring(0, techIdx).trim();
      const techPart = titleText.substring(techIdx, techIdx + 12);
      const afterTech = titleText.substring(techIdx + 12).trim();
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
        firstPart: titleText.substring(0, splitIndex).trim(),
        rest: titleText.substring(splitIndex + (andIndex > 0 ? 5 : 3)).trim(),
      };
    }
    return { firstPart: titleText, rest: "" };
  };

  const titleParts = getTitleParts(title);
  const visibleIndices = getVisibleItems();

  return (
    <section
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${background.className || ""}`}
      style={background.style}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header - match sections/TechnologiesSection */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            <span className="theme-text-black">{titleParts.firstPart}</span>
            {titleParts.rest && (
              <span className="theme-primary-mid-dark"> {titleParts.rest}</span>
            )}
          </h2>
          {description && (
            <p
              className="text-base sm:text-lg md:text-xl theme-text-muted max-w-3xl mx-auto px-2"
            >
              {description}
            </p>
          )}
        </div>

        {totalItems > 0 && (
          <div className="max-w-6xl mx-auto">
            {/* Mobile - match section card style */}
            <div className="md:hidden">
              <div
                className="relative overflow-hidden px-1"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{ touchAction: "pan-y" }}
              >
                <div className="flex gap-3">
                  {visibleIndices.map((itemIndex) => {
                    const tech = items[itemIndex];
                    if (!tech) return null;
                    return (
                      <div
                        key={itemIndex}
                        className="group bg-white rounded-xl border flex flex-col items-center justify-center transition-all duration-300 shrink-0 hover:shadow-md"
                        style={{
                          width: `calc((100% - ${(mobileItemsToShow - 1) * 12}px) / ${mobileItemsToShow})`,
                          aspectRatio: "1/1",
                          minHeight: "90px",
                          borderColor: "var(--color-border-default-20)",
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center relative p-3">
                          {isIconUrl(tech.icon) && tech.icon ? (
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                              <Image
                                src={getImageUrl(tech.icon)}
                                alt={tech.name || "Technology"}
                                fill
                                className="object-contain transition-all duration-300 group-hover:scale-110"
                                sizes="(max-width: 768px) 80px, 48px"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = "none";
                                  const parent = target.parentElement;
                                  if (parent) {
                                    const fallback = document.createElement("div");
                                    if (tech.icon && !isIconUrl(tech.icon)) {
                                      fallback.className = "text-2xl";
                                      fallback.textContent = tech.icon;
                                    } else if (tech.name) {
                                      fallback.className = "text-xs font-semibold theme-text-primary text-center";
                                      fallback.textContent = tech.name;
                                    }
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            </div>
                          ) : tech.icon ? (
                            <div className="text-2xl">{tech.icon}</div>
                          ) : tech.name ? (
                            <div className="text-xs font-semibold theme-text-primary text-center px-2">
                              {tech.name}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {totalSlides > 1 && (
                <div className="flex justify-center gap-1.5 mt-6">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <span
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        getCurrentSlideIndex() === index
                          ? "theme-bg-primary-end"
                          : "bg-gray-400 opacity-40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop - flex wrap, 120px boxes like sections/TechnologiesSection */}
            <div className="hidden md:flex md:flex-wrap md:justify-center gap-4 lg:gap-6">
              {items.map((tech, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl border flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden p-4 lg:p-5"
                  style={{
                    width: "120px",
                    height: "120px",
                    minHeight: "100px",
                    aspectRatio: "1/1",
                    borderColor: "var(--color-border-default-20)",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center relative">
                    {isIconUrl(tech.icon) && tech.icon ? (
                      <div className="relative w-16 h-16 lg:w-20 lg:h-20">
                        <Image
                          src={getImageUrl(tech.icon)}
                          alt={tech.name || "Technology"}
                          fill
                          sizes="120px"
                          className="object-contain transition-all duration-300 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement("div");
                              if (tech.icon && !isIconUrl(tech.icon)) {
                                fallback.className = "text-3xl";
                                fallback.textContent = tech.icon;
                              } else if (tech.name) {
                                fallback.className = "text-sm font-semibold theme-text-primary text-center px-2";
                                fallback.textContent = tech.name;
                              }
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      </div>
                    ) : tech.icon ? (
                      <div className="text-3xl">{tech.icon}</div>
                    ) : tech.name ? (
                      <div className="text-sm font-semibold theme-text-primary text-center px-2">
                        {tech.name}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalItems === 0 && (
          <div className="text-center py-12">
            <p className="theme-text-muted">No technologies to display yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
