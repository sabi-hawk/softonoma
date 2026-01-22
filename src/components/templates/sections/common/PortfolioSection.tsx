import Image from "next/image";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";

interface Project {
  image?: string;
  category?: string;
  title: string;
  description: string;
  link?: string;
  technologies?: string[];
}

interface PortfolioSectionProps {
  title?: string;
  description?: string;
  projects: Project[];
  backgroundColor?: string;
  itemsToShow: number;
  mobileItemsToShow: number;
  portfolioIndex: number;
  totalItems: number;
  onNext: () => void;
  onPrev: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  getVisibleItems: (isMobile: boolean) => Array<{ item: Project; originalIndex: number }>;
  getCurrentSlideIndex: () => number;
  totalSlides: number;
}

const isImageUrl = (image?: string): boolean => {
  if (!image) return false;
  return image.startsWith("http") || image.startsWith("/");
};

export default function PortfolioSection({
  title,
  description,
  projects,
  backgroundColor,
  itemsToShow,
  mobileItemsToShow,
  portfolioIndex,
  totalItems,
  onNext,
  onPrev,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  getVisibleItems,
  getCurrentSlideIndex,
  totalSlides,
}: PortfolioSectionProps) {
  const bgColor = backgroundColor || getDefaultBackground("portfolio");
  const background = getBackgroundStyle(bgColor);

  return (
    <section
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${background.className || ""}`}
      style={background.style}
    >
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
              {title}
            </h2>
            {description && (
              <p className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto opacity-80 px-2">
                {description}
              </p>
            )}
          </div>
        )}
        {totalItems > 0 && (
          <div className="relative">
            {totalItems > itemsToShow && (
              <button
                onClick={onPrev}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
                style={{ borderColor: "var(--color-border-default-20)" }}
                aria-label="Previous"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div
              className="md:hidden overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${portfolioIndex * 100}%)` }}
              >
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="group relative theme-bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 shrink-0 w-full px-4"
                  >
                    {project.image && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {project.category && (
                        <span className="inline-block px-3 py-1 text-xs font-semibold theme-bg-primary-mid-dark theme-text-white rounded-full mb-3">
                          {project.category}
                        </span>
                      )}
                      <h3 className="text-xl font-bold theme-text-black mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {totalSlides > 1 && (
                <div className="flex justify-center gap-1.5 mt-6">
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

            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-8">
              {getVisibleItems(false).map(({ item: project, originalIndex }, visibleIndex) => (
                <div
                  key={`portfolio-${originalIndex}-${visibleIndex}-${project.title || visibleIndex}`}
                  className="group relative theme-bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {project.image && (
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {project.category && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold theme-bg-primary-mid-dark theme-text-white rounded-full mb-3">
                        {project.category}
                      </span>
                    )}
                    <h3 className="text-xl font-bold theme-text-black mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {totalItems > itemsToShow && (
              <button
                onClick={onNext}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
                style={{ borderColor: "var(--color-border-default-20)" }}
                aria-label="Next"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

