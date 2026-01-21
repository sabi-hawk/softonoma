"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IndustryTemplateData } from "@/lib/industry-template";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";

interface IndustryTemplateProps {
  data: IndustryTemplateData;
  industryTitle: string;
}

// Helper to check if icon is a URL
const isIconUrl = (icon?: string): boolean => {
  if (!icon) return false;
  return icon.startsWith("http") || icon.startsWith("/");
};

export default function IndustryTemplate({
  data,
  industryTitle,
}: IndustryTemplateProps) {
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [cardsIndex, setCardsIndex] = useState(0);
  const [techIndex, setTechIndex] = useState(0);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  // Touch handlers for mobile carousels
  const portfolioTouchStartX = useRef<number | null>(null);
  const portfolioTouchEndX = useRef<number | null>(null);
  const cardsTouchStartX = useRef<number | null>(null);
  const cardsTouchEndX = useRef<number | null>(null);
  const techTouchStartX = useRef<number | null>(null);
  const techTouchEndX = useRef<number | null>(null);

  // Auto-slide refs
  const portfolioAutoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cardsAutoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const techAutoSlideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const portfolioIsUserInteractingRef = useRef(false);
  const cardsIsUserInteractingRef = useRef(false);
  const techIsUserInteractingRef = useRef(false);

  // Get background media and opacity from hero
  const backgroundImage = data.hero.backgroundImage;
  const backgroundVideo = data.hero.backgroundVideo;
  const backgroundOpacity = data.hero.backgroundOpacity ?? 0.3;

  // Delay video loading to ensure image is LCP
  useEffect(() => {
    if (backgroundVideo && heroVideoRef.current) {
      // Delay video loading by 100ms to ensure image is LCP
      const timer = setTimeout(() => {
        heroVideoRef.current?.load();
        setHeroVideoReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [backgroundVideo]);

  const itemsToShowCards = 3;
  const mobileItemsToShowCards = 1;
  const totalCardsItems = data.cards?.items?.length || 0;
  const totalCardsSlides = Math.ceil(totalCardsItems / mobileItemsToShowCards);

  const nextCards = () => {
    if (totalCardsItems > 0) {
      setCardsIndex((prev) => (prev + 1) % totalCardsItems);
    }
  };

  const prevCards = () => {
    if (totalCardsItems > 0) {
      setCardsIndex((prev) => (prev - 1 + totalCardsItems) % totalCardsItems);
    }
  };

  // Touch handlers for cards
  const handleCardsTouchStart = (e: React.TouchEvent) => {
    cardsTouchStartX.current = e.touches[0].clientX;
    cardsIsUserInteractingRef.current = true;
    // Pause auto-slide when user interacts
    if (cardsAutoSlideIntervalRef.current) {
      clearInterval(cardsAutoSlideIntervalRef.current);
      cardsAutoSlideIntervalRef.current = null;
    }
  };

  const handleCardsTouchMove = (e: React.TouchEvent) => {
    cardsTouchEndX.current = e.touches[0].clientX;
  };

  const handleCardsTouchEnd = () => {
    if (!cardsTouchStartX.current || !cardsTouchEndX.current) return;
    const distance = cardsTouchStartX.current - cardsTouchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextCards();
    } else if (distance < -minSwipeDistance) {
      prevCards();
    }

    cardsTouchStartX.current = null;
    cardsTouchEndX.current = null;

    // Resume auto-slide after 3 seconds of no interaction
    resumeCardsAutoSlide();
  };

  // Get visible cards items (3 at a time on desktop, 1 on mobile)
  const getVisibleCardsItems = (isMobile: boolean = false) => {
    if (!data.cards?.items) return [];
    const visible = [];
    const items = isMobile ? mobileItemsToShowCards : itemsToShowCards;
    for (let i = 0; i < items; i++) {
      const index = (cardsIndex + i) % totalCardsItems;
      visible.push({
        item: data.cards.items[index],
        originalIndex: index,
      });
    }
    return visible;
  };

  const getCurrentCardsSlideIndex = () => {
    return Math.floor(cardsIndex / mobileItemsToShowCards);
  };

  const itemsToShow = 3;
  const mobileItemsToShow = 1;
  const totalPortfolioItems = data.portfolio?.projects?.length || 0;
  const totalPortfolioSlides = Math.ceil(
    totalPortfolioItems / mobileItemsToShow
  );

  const nextPortfolio = () => {
    if (totalPortfolioItems > 0) {
      setPortfolioIndex((prev) => (prev + 1) % totalPortfolioItems);
    }
  };

  const prevPortfolio = () => {
    if (totalPortfolioItems > 0) {
      setPortfolioIndex(
        (prev) => (prev - 1 + totalPortfolioItems) % totalPortfolioItems
      );
    }
  };

  // Touch handlers for portfolio
  const handlePortfolioTouchStart = (e: React.TouchEvent) => {
    portfolioTouchStartX.current = e.touches[0].clientX;
    portfolioIsUserInteractingRef.current = true;
    // Pause auto-slide when user interacts
    if (portfolioAutoSlideIntervalRef.current) {
      clearInterval(portfolioAutoSlideIntervalRef.current);
      portfolioAutoSlideIntervalRef.current = null;
    }
  };

  const handlePortfolioTouchMove = (e: React.TouchEvent) => {
    portfolioTouchEndX.current = e.touches[0].clientX;
  };

  const handlePortfolioTouchEnd = () => {
    if (!portfolioTouchStartX.current || !portfolioTouchEndX.current) return;
    const distance = portfolioTouchStartX.current - portfolioTouchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextPortfolio();
    } else if (distance < -minSwipeDistance) {
      prevPortfolio();
    }

    portfolioTouchStartX.current = null;
    portfolioTouchEndX.current = null;

    // Resume auto-slide after 3 seconds of no interaction
    resumePortfolioAutoSlide();
  };

  // Get visible portfolio items (3 at a time on desktop, 1 on mobile)
  const getVisiblePortfolioItems = (isMobile: boolean = false) => {
    if (!data.portfolio?.projects) return [];
    const visible = [];
    const items = isMobile ? mobileItemsToShow : itemsToShow;
    for (let i = 0; i < items; i++) {
      const index = (portfolioIndex + i) % totalPortfolioItems;
      visible.push({
        item: data.portfolio.projects[index],
        originalIndex: index,
      });
    }
    return visible;
  };

  const getCurrentPortfolioSlideIndex = () => {
    return Math.floor(portfolioIndex / mobileItemsToShow);
  };

  // Technologies carousel
  const mobileItemsToShowTech = 4;
  const totalTechItems = data.technologies?.items?.length || 0;
  const totalTechSlides = Math.ceil(totalTechItems / mobileItemsToShowTech);
  const maxTechIndex = Math.max(
    0,
    (totalTechSlides - 1) * mobileItemsToShowTech
  );

  const nextTech = () => {
    if (totalTechItems > 0) {
      setTechIndex((prev) => {
        const next = prev + mobileItemsToShowTech;
        return next > maxTechIndex ? maxTechIndex : next;
      });
    }
  };

  const prevTech = () => {
    if (totalTechItems > 0) {
      setTechIndex((prev) => Math.max(prev - mobileItemsToShowTech, 0));
    }
  };

  // Touch handlers for technologies
  const handleTechTouchStart = (e: React.TouchEvent) => {
    techTouchStartX.current = e.touches[0].clientX;
    techIsUserInteractingRef.current = true;
    // Pause auto-slide when user interacts
    if (techAutoSlideIntervalRef.current) {
      clearInterval(techAutoSlideIntervalRef.current);
      techAutoSlideIntervalRef.current = null;
    }
  };

  const handleTechTouchMove = (e: React.TouchEvent) => {
    techTouchEndX.current = e.touches[0].clientX;
  };

  const handleTechTouchEnd = () => {
    if (!techTouchStartX.current || !techTouchEndX.current) return;
    const distance = techTouchStartX.current - techTouchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swipe left - next slide
      nextTech();
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous slide
      prevTech();
    }

    techTouchStartX.current = null;
    techTouchEndX.current = null;

    // Resume auto-slide after 3 seconds of no interaction
    resumeTechAutoSlide();
  };

  const getVisibleTechItems = () => {
    if (!data.technologies?.items) return [];
    const start = techIndex;
    const end = Math.min(start + mobileItemsToShowTech, totalTechItems);
    return data.technologies.items.slice(start, end).map((item, idx) => ({
      item,
      originalIndex: start + idx,
    }));
  };

  const getCurrentTechSlideIndex = () => {
    return Math.floor(techIndex / mobileItemsToShowTech);
  };

  // Resume auto-slide helpers
  const resumePortfolioAutoSlide = () => {
    setTimeout(() => {
      portfolioIsUserInteractingRef.current = false;
      // Restart auto-slide
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 768 &&
        totalPortfolioItems > mobileItemsToShow
      ) {
        if (portfolioAutoSlideIntervalRef.current) {
          clearInterval(portfolioAutoSlideIntervalRef.current);
        }
        portfolioAutoSlideIntervalRef.current = setInterval(() => {
          if (!portfolioIsUserInteractingRef.current) {
            setPortfolioIndex((prev) => (prev + 1) % totalPortfolioItems);
          }
        }, 5000);
      }
    }, 3000);
  };

  const resumeCardsAutoSlide = () => {
    setTimeout(() => {
      cardsIsUserInteractingRef.current = false;
      // Restart auto-slide
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 768 &&
        totalCardsItems > mobileItemsToShowCards
      ) {
        if (cardsAutoSlideIntervalRef.current) {
          clearInterval(cardsAutoSlideIntervalRef.current);
        }
        cardsAutoSlideIntervalRef.current = setInterval(() => {
          if (!cardsIsUserInteractingRef.current) {
            setCardsIndex((prev) => (prev + 1) % totalCardsItems);
          }
        }, 5000);
      }
    }, 3000);
  };

  const resumeTechAutoSlide = () => {
    setTimeout(() => {
      techIsUserInteractingRef.current = false;
      // Restart auto-slide
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 768 &&
        totalTechSlides > 1
      ) {
        if (techAutoSlideIntervalRef.current) {
          clearInterval(techAutoSlideIntervalRef.current);
        }
        techAutoSlideIntervalRef.current = setInterval(() => {
          if (!techIsUserInteractingRef.current) {
            setTechIndex((prev) => {
              const next = prev + mobileItemsToShowTech;
              return next > maxTechIndex ? maxTechIndex : next;
            });
          }
        }, 5000);
      }
    }, 3000);
  };

  // Set up auto-slide for portfolio (mobile only)
  useEffect(() => {
    const startAutoSlide = () => {
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 768 &&
        totalPortfolioItems > mobileItemsToShow
      ) {
        if (portfolioAutoSlideIntervalRef.current) {
          clearInterval(portfolioAutoSlideIntervalRef.current);
        }
        portfolioAutoSlideIntervalRef.current = setInterval(() => {
          if (!portfolioIsUserInteractingRef.current) {
            setPortfolioIndex((prev) => (prev + 1) % totalPortfolioItems);
          }
        }, 5000);
      }
    };

    startAutoSlide();

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        if (portfolioAutoSlideIntervalRef.current) {
          clearInterval(portfolioAutoSlideIntervalRef.current);
          portfolioAutoSlideIntervalRef.current = null;
        }
      } else {
        startAutoSlide();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (portfolioAutoSlideIntervalRef.current) {
        clearInterval(portfolioAutoSlideIntervalRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [portfolioIndex, totalPortfolioItems, mobileItemsToShow]);

  // Set up auto-slide for cards (mobile only)
  useEffect(() => {
    const startAutoSlide = () => {
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 768 &&
        totalCardsItems > mobileItemsToShowCards
      ) {
        if (cardsAutoSlideIntervalRef.current) {
          clearInterval(cardsAutoSlideIntervalRef.current);
        }
        cardsAutoSlideIntervalRef.current = setInterval(() => {
          if (!cardsIsUserInteractingRef.current) {
            setCardsIndex((prev) => (prev + 1) % totalCardsItems);
          }
        }, 5000);
      }
    };

    startAutoSlide();

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        if (cardsAutoSlideIntervalRef.current) {
          clearInterval(cardsAutoSlideIntervalRef.current);
          cardsAutoSlideIntervalRef.current = null;
        }
      } else {
        startAutoSlide();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (cardsAutoSlideIntervalRef.current) {
        clearInterval(cardsAutoSlideIntervalRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [cardsIndex, totalCardsItems, mobileItemsToShowCards]);

  // Set up auto-slide for technologies (mobile only)
  useEffect(() => {
    const startAutoSlide = () => {
      if (
        typeof window !== "undefined" &&
        window.innerWidth < 768 &&
        totalTechSlides > 1
      ) {
        if (techAutoSlideIntervalRef.current) {
          clearInterval(techAutoSlideIntervalRef.current);
        }
        techAutoSlideIntervalRef.current = setInterval(() => {
          if (!techIsUserInteractingRef.current) {
            setTechIndex((prev) => {
              const next = prev + mobileItemsToShowTech;
              return next > maxTechIndex ? maxTechIndex : next;
            });
          }
        }, 5000);
      }
    };

    startAutoSlide();

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        if (techAutoSlideIntervalRef.current) {
          clearInterval(techAutoSlideIntervalRef.current);
          techAutoSlideIntervalRef.current = null;
        }
      } else {
        startAutoSlide();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (techAutoSlideIntervalRef.current) {
        clearInterval(techAutoSlideIntervalRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [techIndex, totalTechSlides, mobileItemsToShowTech, maxTechIndex]);

  // Auto-scroll partners carousel (using transform like PartnersSection)
  const partnersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = partnersRef.current;
    if (
      !container ||
      !data.partners?.partners ||
      data.partners.partners.length === 0
    )
      return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame
    const itemWidth = 200; // Fixed width per item (includes padding)
    const totalWidth = itemWidth * data.partners.partners.length;

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
  }, [data.partners?.partners]);

  // Default section order
  const defaultOrder = [
    "hero",
    "overview",
    "stats",
    "subServices",
    "partners",
    "cards",
    "portfolio",
    "technologies",
  ];

  const sectionOrder = data.sectionOrder || defaultOrder;

  // Helper to check if section should be rendered
  const shouldRenderSection = (sectionKey: string): boolean => {
    switch (sectionKey) {
      case "hero":
        return true; // Always render hero
      case "overview":
        return !!(data.overview && data.overview.isActive !== false);
      case "stats":
        return !!(
          data.stats &&
          data.stats.isActive !== false &&
          data.stats.items &&
          data.stats.items.length > 0
        );
      case "subServices":
        return !!(
          data.subServices &&
          data.subServices.isActive !== false &&
          data.subServices.items &&
          data.subServices.items.length > 0
        );
      case "partners":
        return !!(
          data.partners &&
          data.partners.isActive !== false &&
          data.partners.partners &&
          data.partners.partners.length > 0
        );
      case "cards":
        return !!(
          data.cards &&
          data.cards.isActive !== false &&
          data.cards.items &&
          data.cards.items.length > 0
        );
      case "portfolio":
        return !!(
          data.portfolio &&
          data.portfolio.isActive !== false &&
          data.portfolio.projects &&
          data.portfolio.projects.length > 0
        );
      case "technologies":
        return !!(
          data.technologies &&
          data.technologies.isActive !== false &&
          data.technologies.items &&
          data.technologies.items.length > 0
        );
      default:
        return false;
    }
  };

  // Render functions for each section
  const renderHero = () => (
    <section
      key="hero"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden theme-bg-black"
    >
      {/* Background Image/Video */}
      {(backgroundImage || backgroundVideo) && (
        <div className="absolute inset-0">
          {/* Always render image first for LCP - even if video exists */}
          {backgroundImage && (
            <div className="relative w-full h-full">
              <Image
                src={backgroundImage}
                alt="Hero background"
                fill
                priority
                fetchPriority="high"
                className="object-cover"
                style={{ opacity: backgroundOpacity }}
                sizes="100vw"
                quality={85}
              />
            </div>
          )}
          {/* Video loads after image to ensure image is LCP */}
          {backgroundVideo && (
            <video
              ref={heroVideoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              poster={backgroundImage}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ 
                opacity: heroVideoReady ? backgroundOpacity : 0, 
                zIndex: 1,
                transition: 'opacity 0.3s ease-in'
              }}
            >
              <source src={backgroundVideo} type="video/mp4" />
              <source src={backgroundVideo} type="video/webm" />
            </video>
          )}
        </div>
      )}

      {/* Dark overlay */}
      {(backgroundImage || backgroundVideo) && (
        <div
          className="absolute inset-0 theme-bg-black"
          style={{ opacity: 0.5 }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {data.hero.breadcrumbs && (
            <div className="mb-3 sm:mb-4 text-xs sm:text-sm theme-text-white opacity-80">
              {data.hero.breadcrumbs}
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 theme-text-white">
            {data.hero.title || industryTitle}
          </h1>
          {data.hero.subtitle && (
            <p className="text-lg sm:text-xl md:text-2xl theme-primary-mid-dark mb-3 sm:mb-4">
              {data.hero.subtitle}
            </p>
          )}
          {data.hero.description && (
            <p
              className="text-sm sm:text-base md:text-lg theme-text-white mb-4 sm:mb-6 max-w-3xl leading-relaxed"
              style={{ opacity: 0.9 }}
            >
              {data.hero.description}
            </p>
          )}
          {data.hero.primaryButtonText && (
            <Link
              href={data.hero.primaryButtonLink || "#contact"}
              className="inline-block px-5 py-2.5 sm:px-6 sm:py-3 theme-bg-primary-mid text-white rounded-lg font-semibold text-sm sm:text-base transition-all hover:opacity-90 hover:shadow-lg"
            >
              {data.hero.primaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );

  const sectionsMap: Record<string, () => React.ReactElement | null> = {
    hero: renderHero,
    overview: () =>
      data.overview
        ? (() => {
            const backgroundColor =
              data.overview.backgroundColor || getDefaultBackground("about");
            const background = getBackgroundStyle(backgroundColor);
            return (
              <section
                key="overview"
                id="overview"
                className={`py-12 sm:py-16 md:py-24 ${
                  background.className || ""
                }`}
                style={background.style}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold theme-text-black mb-4 sm:mb-6">
                        {data.overview.title}
                      </h2>
                      <div className="space-y-3 sm:space-y-4">
                        {data.overview.paragraphs.map((para, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 sm:gap-3"
                          >
                            <div className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full theme-bg-primary-mid flex items-center justify-center mt-1">
                              <svg
                                className="w-3 h-3 sm:w-4 sm:h-4 theme-text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <p className="text-base sm:text-lg theme-text-black leading-relaxed">
                              {para.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {data.overview.image && (
                      <div className="relative w-full aspect-video">
                        <Image
                          src={data.overview.image}
                          alt={data.overview.title}
                          fill
                          className="rounded-lg shadow-lg object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })()
        : null,
    stats: () =>
      data.stats && data.stats.items && data.stats.items.length > 0
        ? (() => {
            const backgroundColor =
              data.stats.backgroundColor || getDefaultBackground("stats");
            const background = getBackgroundStyle(backgroundColor);
            return (
              <section
                className={`py-12 sm:py-16 md:py-24 ${
                  background.className || ""
                }`}
                style={background.style}
                key="stats"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-gray-900 rounded-xl p-6 sm:p-8 md:p-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                      {data.stats.items.map((stat, index) => (
                        <div key={index} className="text-center">
                          {stat.icon && (
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl mb-3 sm:mb-4 relative overflow-hidden mx-auto">
                              {isIconUrl(stat.icon) && stat.icon ? (
                                <Image
                                  src={stat.icon}
                                  alt={stat.label || "Stat"}
                                  fill
                                  className="object-contain transition-all duration-300"
                                  unoptimized
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = "none";
                                    const parent = target.parentElement;
                                    if (parent) {
                                      const fallback =
                                        document.createElement("div");
                                      if (stat.icon && !isIconUrl(stat.icon)) {
                                        fallback.className =
                                          "text-xl sm:text-2xl";
                                        fallback.textContent = stat.icon;
                                      } else if (stat.label) {
                                        fallback.className =
                                          "text-xs font-bold text-white text-center";
                                        fallback.textContent = stat.label;
                                      }
                                      parent.appendChild(fallback);
                                    }
                                  }}
                                />
                              ) : stat.icon ? (
                                <div className="text-xl sm:text-2xl">
                                  {stat.icon}
                                </div>
                              ) : null}
                            </div>
                          )}
                          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                            {stat.value}
                          </div>
                          <div className="text-sm sm:text-base md:text-lg text-white opacity-90">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })()
        : null,
    subServices: () =>
      data.subServices &&
      data.subServices.items &&
      data.subServices.items.length > 0
        ? (() => {
            const backgroundColor =
              data.subServices.backgroundColor ||
              getDefaultBackground("industries");
            const background = getBackgroundStyle(backgroundColor);
            return (
              <section
                className={`py-12 sm:py-16 md:py-24 ${
                  background.className || ""
                }`}
                style={background.style}
                key="subServices"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                      {data.subServices.title}
                    </h2>
                    {data.subServices.description && (
                      <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                        {data.subServices.description}
                      </p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {data.subServices.items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 group cursor-pointer"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          {item.icon && (
                            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 theme-bg-primary-mid rounded-lg flex items-center justify-center text-xl sm:text-2xl">
                              {isIconUrl(item.icon) ? (
                                <Image
                                  src={item.icon}
                                  alt={item.title}
                                  width={32}
                                  height={32}
                                  className="object-contain"
                                  unoptimized
                                />
                              ) : (
                                item.icon
                              )}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:theme-text-primary transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {data.subServices.ctaButtonText && (
                    <div className="text-center mt-8 sm:mt-10 md:mt-12">
                      <Link
                        href={data.subServices.ctaButtonLink || "#contact"}
                        className="inline-block px-6 py-2.5 sm:px-8 sm:py-3 theme-bg-primary-mid text-white rounded-lg font-semibold text-sm sm:text-base transition-all hover:opacity-90 hover:shadow-lg"
                      >
                        {data.subServices.ctaButtonText}
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            );
          })()
        : null,
    partners: () =>
      data.partners &&
      data.partners.partners &&
      data.partners.partners.length > 0
        ? (() => {
            const backgroundColor =
              data.partners.backgroundColor || getDefaultBackground("partners");
            const background = getBackgroundStyle(backgroundColor);
            return (
              <section
                className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
                  background.className || ""
                }`}
                style={background.style}
                key="partners"
              >
                <div className="relative z-10 max-w-7xl mx-auto">
                  {data.partners.title && (
                    <div className="text-center mb-8 sm:mb-10 md:mb-12">
                      {/* Split title to show first part in white and second part in theme color */}
                      {(() => {
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

                        const titleParts = getTitleParts(data.partners.title);
                        return (
                          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
                            <span className="theme-text-black">
                              {titleParts.firstPart}
                            </span>
                            {titleParts.rest && (
                              <span className="theme-primary-mid-dark">
                                {" "}
                                {titleParts.rest}
                              </span>
                            )}
                          </h2>
                        );
                      })()}
                      {data.partners.description && (
                        <p
                          className="text-base sm:text-lg theme-text-black max-w-3xl mx-auto px-2"
                          style={{ opacity: 0.8 }}
                        >
                          {data.partners.description}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div
                      ref={partnersRef}
                      className="flex items-center"
                      style={{
                        width: `${data.partners.partners.length * 2 * 200}px`, // Duplicate for seamless loop
                      }}
                    >
                      {/* Render partners twice for seamless loop */}
                      {[
                        ...data.partners.partners,
                        ...data.partners.partners,
                      ].map((partner, index) => (
                        <div
                          key={`partner-${index}-${
                            partner.logo || partner.name || index
                          }`}
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
                              <div className="text-xl font-semibold theme-text-black text-center">
                                {partner.name}
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
          })()
        : null,
    cards: () =>
      data.cards && data.cards.items && data.cards.items.length > 0
        ? (() => {
            const backgroundColor =
              data.cards.backgroundColor || getDefaultBackground("cards");
            const background = getBackgroundStyle(backgroundColor);
            return (
              <section
                className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${
                  background.className || ""
                }`}
                style={background.style}
                key="cards"
              >
                <div className="max-w-7xl mx-auto">
                  {data.cards.title && (
                    <div className="text-center mb-8 sm:mb-10 md:mb-12">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
                        {data.cards.title}
                      </h2>
                      {data.cards.description && (
                        <p className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto opacity-80 px-2">
                          {data.cards.description}
                        </p>
                      )}
                    </div>
                  )}
                  {totalCardsItems > 0 && (
                    <div className="relative">
                      {/* Left Arrow - Desktop Only */}
                      {totalCardsItems > itemsToShowCards && (
                        <button
                          onClick={prevCards}
                          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
                          style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                          aria-label="Previous"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Mobile Carousel */}
                      <div
                        className="md:hidden overflow-hidden"
                        onTouchStart={handleCardsTouchStart}
                        onTouchMove={handleCardsTouchMove}
                        onTouchEnd={handleCardsTouchEnd}
                      >
                        <div className="flex gap-4">
                          {getVisibleCardsItems(true).map(
                            ({ item, originalIndex }, visibleIndex) => (
                              <div
                                key={`card-mobile-${originalIndex}-${visibleIndex}-${
                                  item.author || visibleIndex
                                }`}
                                className="group p-6 theme-bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 shrink-0 mx-auto max-w-sm"
                                style={{
                                  width: "calc(100vw - 2rem)",
                                  borderColor: "rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {data.cards &&
                                  data.cards.showStars !== false && (
                                    <div
                                      className="mb-4 text-lg"
                                      style={{ color: "#FFD700" }}
                                    >
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
                                    <p className="font-semibold text-gray-900">
                                      {item.author}
                                    </p>
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
                            )
                          )}
                        </div>
                        {/* Dot indicators for mobile */}
                        {totalCardsSlides > 1 && (
                          <div className="flex justify-center gap-1.5 mt-6">
                            {Array.from({ length: totalCardsSlides }).map(
                              (_, idx) => (
                                <span
                                  key={idx}
                                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    getCurrentCardsSlideIndex() === idx
                                      ? 'bg-gray-800'
                                      : 'bg-gray-400 opacity-40'
                                  }`}
                                />
                              )
                            )}
                          </div>
                        )}
                      </div>

                      {/* Desktop Grid */}
                      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-8">
                        {getVisibleCardsItems(false).map(
                          ({ item, originalIndex }, visibleIndex) => (
                            <div
                              key={`card-${originalIndex}-${visibleIndex}-${
                                item.author || visibleIndex
                              }`}
                              className="group p-8 theme-bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                              style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                            >
                              {data.cards && data.cards.showStars !== false && (
                                <div
                                  className="mb-4 text-lg"
                                  style={{ color: "var(--color-primary-end)" }}
                                >
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
                                {item.author && (
                                  <p className="font-semibold text-gray-900">
                                    {item.author}
                                  </p>
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
                          )
                        )}
                      </div>

                      {/* Right Arrow - Desktop Only */}
                      {totalCardsItems > itemsToShowCards && (
                        <button
                          onClick={nextCards}
                          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
                          style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                          aria-label="Next"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>
            );
          })()
        : null,
    portfolio: () =>
      data.portfolio &&
      data.portfolio.projects &&
      data.portfolio.projects.length > 0
        ? (() => {
            const backgroundColor =
              data.portfolio.backgroundColor ||
              getDefaultBackground("portfolio");
            const background = getBackgroundStyle(backgroundColor);
            return (
              <section
                className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${
                  background.className || ""
                }`}
                style={background.style}
                key="portfolio"
              >
                <div className="max-w-7xl mx-auto">
                  {data.portfolio.title && (
                    <div className="text-center mb-8 sm:mb-10 md:mb-12">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
                        {data.portfolio.title}
                      </h2>
                      {data.portfolio.description && (
                        <p className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto opacity-80 px-2">
                          {data.portfolio.description}
                        </p>
                      )}
                    </div>
                  )}
                  {totalPortfolioItems > 0 && (
                    <div className="relative">
                      {/* Left Arrow - Desktop Only */}
                      {totalPortfolioItems > itemsToShow && (
                        <button
                          onClick={prevPortfolio}
                          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
                          style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                          aria-label="Previous"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Mobile Carousel */}
                      <div
                        className="md:hidden overflow-hidden"
                        onTouchStart={handlePortfolioTouchStart}
                        onTouchMove={handlePortfolioTouchMove}
                        onTouchEnd={handlePortfolioTouchEnd}
                      >
                        <div
                          className="flex transition-transform duration-500 ease-in-out"
                          style={{
                            transform: `translateX(-${portfolioIndex * 100}%)`,
                          }}
                        >
                          {data.portfolio.projects.map((project, index) => (
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
                                  <span className="inline-block px-3 py-1 text-xs font-semibold theme-bg-primary-mid theme-text-white rounded-full mb-3">
                                    {project.category}
                                  </span>
                                )}
                                <h3 className="text-xl font-bold theme-text-black mb-2">
                                  {project.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                  {project.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Dot indicators for mobile */}
                        {totalPortfolioSlides > 1 && (
                        <div className="flex justify-center gap-1.5 mt-6">
                          {Array.from({ length: totalPortfolioSlides }).map(
                              (_, idx) => (
                                <span
                                  key={idx}
                                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    getCurrentPortfolioSlideIndex() === idx
                                      ? 'bg-gray-800'
                                      : 'bg-gray-400 opacity-40'
                                  }`}
                                />
                              )
                            )}
                          </div>
                        )}
                      </div>

                      {/* Desktop Grid */}
                      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-8">
                        {getVisiblePortfolioItems(false).map(
                          ({ item: project, originalIndex }, visibleIndex) => (
                            <div
                              key={`portfolio-${originalIndex}-${visibleIndex}-${
                                project.title || visibleIndex
                              }`}
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
                                  <span className="inline-block px-3 py-1 text-xs font-semibold theme-bg-primary-mid theme-text-white rounded-full mb-3">
                                    {project.category}
                                  </span>
                                )}
                                <h3 className="text-xl font-bold theme-text-black mb-2">
                                  {project.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                  {project.description}
                                </p>
                                {/* {project.link && (
                            <Link
                              href={project.link}
                              className="inline-flex items-center gap-2 text-sm font-semibold theme-text-primary hover:gap-3 transition-all"
                            >
                              View Project
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </Link>
                          )} */}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {/* Right Arrow - Desktop Only */}
                      {totalPortfolioItems > itemsToShow && (
                        <button
                          onClick={nextPortfolio}
                          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
                          style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                          aria-label="Next"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </section>
            );
          })()
        : null,
    technologies: () =>
      data.technologies &&
      data.technologies.items &&
      data.technologies.items.length > 0
        ? (() => {
            const backgroundColor =
              data.technologies.backgroundColor ||
              getDefaultBackground("technologies");
            const background = getBackgroundStyle(backgroundColor);
            return (
              <section
                className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
                  background.className || ""
                }`}
                style={background.style}
                key="technologies"
              >
                <div className="relative z-10 max-w-7xl mx-auto">
                  {data.technologies.title && (
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                      {/* Split title like TechnologiesSection */}
                      {(() => {
                        const getTitleParts = (title: string) => {
                          const lowerTitle = title.toLowerCase();
                          // Check for "Our Technologies" or "Technologies"
                          if (lowerTitle.includes("technologies")) {
                            const techIndex =
                              lowerTitle.indexOf("technologies");
                            const beforeTech = title
                              .substring(0, techIndex)
                              .trim();
                            const techPart = title.substring(
                              techIndex,
                              techIndex + 12
                            ); // "Technologies"
                            const afterTech = title
                              .substring(techIndex + 12)
                              .trim();

                            return {
                              firstPart: beforeTech
                                ? `${beforeTech} ${techPart}`
                                : techPart,
                              rest: afterTech,
                            };
                          }

                          // Default: split on "and" or "&"
                          const andIndex = lowerTitle.indexOf(" and ");
                          const ampIndex = lowerTitle.indexOf(" & ");
                          const splitIndex =
                            andIndex > 0
                              ? andIndex
                              : ampIndex > 0
                              ? ampIndex
                              : -1;

                          if (splitIndex > 0) {
                            return {
                              firstPart: title.substring(0, splitIndex).trim(),
                              rest: title
                                .substring(splitIndex + (andIndex > 0 ? 5 : 3))
                                .trim(),
                            };
                          }

                          return { firstPart: title, rest: "" };
                        };

                        const titleParts = getTitleParts(
                          data.technologies.title
                        );
                        return (
                          <>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
                              <span className="theme-text-black">
                                {titleParts.firstPart}
                              </span>
                              {titleParts.rest && (
                                <span className="theme-primary-mid-dark">
                                  {" "}
                                  {titleParts.rest}
                                </span>
                              )}
                            </h2>
                            {data.technologies.description && (
                              <p
                                className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2"
                                style={{ opacity: 0.8 }}
                              >
                                {data.technologies.description}
                              </p>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
                    {/* Mobile Carousel */}
                    <div
                      className="md:hidden overflow-hidden px-1"
                      onTouchStart={handleTechTouchStart}
                      onTouchMove={handleTechTouchMove}
                      onTouchEnd={handleTechTouchEnd}
                    >
                      <div className="flex gap-2">
                        {getVisibleTechItems().map(
                          ({ item: tech, originalIndex }) => (
                            <div
                              key={originalIndex}
                              className="group theme-bg-white rounded-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden p-3 shrink-0"
                              style={{
                                width: `calc((100% - ${
                                  (mobileItemsToShowTech - 1) * 8
                                }px) / ${mobileItemsToShowTech})`,
                                aspectRatio: "1/1",
                                minHeight: "60px",
                              }}
                            >
                              {/* Tech Logo/Icon - Only Logo, No Text */}
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
                                        // Fallback to emoji or name if image fails
                                        const target = e.currentTarget;
                                        target.style.display = "none";
                                        const parent = target.parentElement;
                                        if (parent) {
                                          const fallback =
                                            document.createElement("div");
                                          if (
                                            tech.icon &&
                                            !isIconUrl(tech.icon)
                                          ) {
                                            fallback.className = "text-lg";
                                            fallback.textContent = tech.icon;
                                          } else if (tech.name) {
                                            fallback.className =
                                              "text-xs font-bold theme-text-black text-center";
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
                                  <div className="text-xs font-semibold theme-text-black text-center px-1">
                                    {tech.name}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      {/* Dot indicators for mobile */}
                      {totalTechSlides > 1 && (
                        <div className="flex justify-center gap-1.5 mt-4">
                          {Array.from({ length: totalTechSlides }).map(
                            (_, idx) => (
                              <span
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  getCurrentTechSlideIndex() === idx
                                    ? 'bg-gray-800'
                                    : 'bg-gray-400 opacity-40'
                                }`}
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* Desktop Grid */}
                    <div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-3">
                      {data.technologies.items.map((tech, index) => (
                        <div
                          key={index}
                          className="group theme-bg-white rounded-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden p-3"
                          style={{ aspectRatio: "1/1", minHeight: "60px" }}
                        >
                          {/* Tech Logo/Icon - Only Logo, No Text */}
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
                                    // Fallback to emoji or name if image fails
                                    const target = e.currentTarget;
                                    target.style.display = "none";
                                    const parent = target.parentElement;
                                    if (parent) {
                                      const fallback =
                                        document.createElement("div");
                                      if (tech.icon && !isIconUrl(tech.icon)) {
                                        fallback.className =
                                          "text-base md:text-lg";
                                        fallback.textContent = tech.icon;
                                      } else if (tech.name) {
                                        fallback.className =
                                          "text-xs md:text-sm font-bold theme-text-black text-center";
                                        fallback.textContent = tech.name;
                                      }
                                      parent.appendChild(fallback);
                                    }
                                  }}
                                />
                              </div>
                            ) : tech.icon ? (
                              <div className="text-base md:text-base">
                                {tech.icon}
                              </div>
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
          })()
        : null,
  };

  // Render sections in the order specified by sectionOrder
  return (
    <div className="min-h-screen">
      {sectionOrder
        .filter((key) => shouldRenderSection(key))
        .map((sectionKey) => {
          const renderFn = sectionsMap[sectionKey];
          return renderFn ? renderFn() : null;
        })}
    </div>
  );
}
