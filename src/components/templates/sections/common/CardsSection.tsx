import { getBackgroundStyle, getDefaultBackground } from "@/lib/section-helpers";

interface CardItem {
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
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
  showStars = true,
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
}: CardsSectionProps) {
  const bgColor = backgroundColor || getDefaultBackground("cards");
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
                style={{ transform: `translateX(-${cardsIndex * 100}%)` }}
              >
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="group p-6 theme-bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 shrink-0 w-full px-4"
                    style={{ borderColor: "var(--color-border-default)" }}
                  >
                    {showStars && (
                      <div className="mb-4 text-lg theme-text-primary-end">
                        {"★★★★★".split("").map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                    )}
                    {item.quote && (
                      <p className="text-gray-700 mb-6 leading-relaxed italic text-sm">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    )}
                    <div className="border-t border-gray-200 pt-4">
                      {item.author && (
                        <p className="font-semibold text-gray-900">{item.author}</p>
                      )}
                      {(item.role || item.company) && (
                        <p className="text-sm text-gray-600">
                          {item.role}
                          {item.role && item.company && ", "}
                          {item.company}
                        </p>
                      )}
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
              {getVisibleItems(false).map(({ item, originalIndex }, visibleIndex) => (
                <div
                  key={`card-${originalIndex}-${visibleIndex}-${item.author || visibleIndex}`}
                  className="group p-8 theme-bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                >
                  {showStars && (
                    <div className="mb-4 text-lg" style={{ color: "var(--color-primary-end)" }}>
                      {"★★★★★".split("").map((star, i) => (
                        <span key={i}>{star}</span>
                      ))}
                    </div>
                  )}
                  {item.quote && (
                    <p className="text-gray-700 mb-6 leading-relaxed italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  )}
                  <div className="border-t border-gray-200 pt-4">
                    {item.author && <p className="font-semibold text-gray-900">{item.author}</p>}
                    {(item.role || item.company) && (
                      <p className="text-sm text-gray-600">
                        {item.role}
                        {item.role && item.company && ", "}
                        {item.company}
                      </p>
                    )}
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

