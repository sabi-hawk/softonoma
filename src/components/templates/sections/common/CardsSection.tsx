import Image from "next/image";
import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";
import { getImageUrl } from "@/lib/image-utils";

interface CardItem {
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
  image?: string;
}

interface CardsSectionProps {
  title?: string;
  description?: string;
  items: CardItem[];
  showStars?: boolean;
  backgroundColor?: string;
  itemsToShow: number;
  mobileItemsToShow: number;
  cardsIndex: number;
  totalItems: number;
  onNext: () => void;
  onPrev: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  getVisibleItems: (isMobile: boolean) => Array<{ item: CardItem; originalIndex: number }>;
  getCurrentSlideIndex: () => number;
  totalSlides: number;
}

export default function CardsSection({
  title,
  description,
  items,
  backgroundColor,
  itemsToShow,
  mobileItemsToShow,
  cardsIndex,
  totalItems,
  onNext,
  onPrev,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  getVisibleItems,
  getCurrentSlideIndex,
  totalSlides,
  showStars: _showStars, // kept for API compat; design matches section (no stars)
}: CardsSectionProps) {
  const bgColor = backgroundColor || getDefaultBackground("cards");
  const background = getBackgroundStyle(bgColor);

  return (
    <section
      className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${background.className || ""}`}
      style={background.style}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Aligned with sections/CardsSection */}
        <div className="mb-8 sm:mb-10 md:mb-12 text-left px-6 sm:px-8 md:px-8">
          <div className="mb-4 sm:mb-5">
            <Image
              src="/Left-quote-traced.png"
              alt="Quote icon"
              width={60}
              height={60}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
            />
          </div>
          {title && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold theme-text-primary mb-3 sm:mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p
              className="text-sm sm:text-base md:text-lg theme-text-muted leading-relaxed"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {description}
            </p>
          )}
        </div>

        {totalItems > 0 && (
          <div className="relative">
            {totalItems > itemsToShow && (
              <button
                onClick={onPrev}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 w-12 h-12 bg-white border-2 theme-text-primary rounded-full items-center justify-center shadow-md hover:scale-110 transition-all"
                style={{ borderColor: "var(--color-border-default-20)" }}
                aria-label="Previous"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div
              className="relative overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{ touchAction: "pan-y" }}
            >
              {/* Mobile: 1 item at a time */}
              <div className="md:hidden overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${cardsIndex * 100}%)` }}
                >
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="group p-6 sm:p-8 theme-bg-secondary rounded-2xl border shrink-0 shadow-sm transition-all duration-300 mx-2"
                      style={{
                        width: "calc(100% - 1rem)" as string,
                        borderColor: "var(--color-border-default-20)",
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      {item.author && (
                        <p className="text-lg sm:text-xl font-bold theme-text-primary mb-1">
                          {item.author}
                        </p>
                      )}
                      {(item.role || item.company) && (
                        <p
                          className="text-xs sm:text-sm theme-text-muted mb-4 sm:mb-6 uppercase tracking-wide"
                          style={{ fontFamily: "var(--font-inter), sans-serif" }}
                        >
                          {item.role && `${item.role}`}
                          {item.role && item.company && " "}
                          {item.company}
                        </p>
                      )}
                      {item.quote && (
                        <p
                          className="theme-text-muted mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base"
                          style={{ fontFamily: "var(--font-inter), sans-serif" }}
                        >
                          {item.quote}
                        </p>
                      )}
                      {item.image && (
                        <div className="mt-6">
                          <Image
                            src={getImageUrl(item.image)}
                            alt={item.author || "Client"}
                            width={48}
                            height={48}
                            sizes="48px"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: 3 items */}
              <div className="hidden md:flex md:gap-6 lg:gap-8 px-8">
                {getVisibleItems(false).map(({ item, originalIndex }) => (
                  <div
                    key={originalIndex}
                    className="group shrink-0 p-6 sm:p-8 theme-bg-secondary rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md"
                    style={{
                      width: "calc(33.333% - 1rem)",
                      borderColor: "var(--color-border-default-20)",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    {item.author && (
                      <p className="text-lg sm:text-xl font-bold theme-text-primary mb-1">
                        {item.author}
                      </p>
                    )}
                    {(item.role || item.company) && (
                      <p
                        className="text-xs sm:text-sm theme-text-muted mb-4 sm:mb-6 uppercase tracking-wide"
                        style={{ fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {item.role && `${item.role}`}
                        {item.role && item.company && " "}
                        {item.company}
                      </p>
                    )}
                    {item.quote && (
                      <p
                        className="theme-text-muted mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base"
                        style={{ fontFamily: "var(--font-inter), sans-serif" }}
                      >
                        {item.quote}
                      </p>
                    )}
                    {item.image && (
                      <div className="mt-6">
                        <Image
                          src={getImageUrl(item.image)}
                          alt={item.author || "Client"}
                          width={48}
                          height={48}
                          sizes="48px"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {totalItems > itemsToShow && (
              <button
                onClick={onNext}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 w-12 h-12 bg-white border-2 theme-text-primary rounded-full items-center justify-center shadow-md hover:scale-110 transition-all"
                style={{ borderColor: "var(--color-border-default-20)" }}
                aria-label="Next"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {totalSlides > 1 && (
              <div className="flex justify-center gap-1.5 mt-8 md:hidden">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <span
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      getCurrentSlideIndex() === index ? "theme-bg-primary-end" : "bg-gray-400 opacity-40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
