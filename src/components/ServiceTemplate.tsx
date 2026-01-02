"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  getBackgroundStyle,
  getDefaultBackground,
} from "@/lib/section-helpers";

export interface ServiceTemplateData {
  hero: {
    breadcrumbs?: string;
    title: string;
    subtitle?: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    backgroundOpacity?: number;
  };
  overview: {
    title: string;
    paragraphs: Array<{
      text: string;
    }>;
    image?: string;
    backgroundColor?: string;
    isActive?: boolean;
  };
  stats?: {
    items: Array<{
      icon?: string;
      value: string;
      label: string;
    }>;
    backgroundColor?: string;
    isActive?: boolean;
  };
  subServices?: {
    title: string;
    description?: string;
    items: Array<{
      icon?: string;
      title: string;
      description: string;
    }>;
    ctaButtonText?: string;
    ctaButtonLink?: string;
    backgroundColor?: string;
    isActive?: boolean;
  };
  whyChooseUs?: {
    title: string;
    subtitle?: string;
    items: Array<{
      text: string;
    }>;
    image?: string;
    certifications?: Array<{
      name: string;
      image?: string;
    }>;
    backgroundColor?: string;
    isActive?: boolean;
  };
  technologies?: {
    title: string;
    description: string;
    items: Array<{
      name: string;
      icon?: string;
    }>;
    backgroundColor?: string;
    isActive?: boolean;
  };
  process?: {
    title: string;
    description: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
    }>;
    backgroundColor?: string;
    isActive?: boolean;
  };
  portfolio?: {
    title: string;
    description?: string;
    projects: Array<{
      image?: string;
      category?: string;
      title: string;
      description: string;
      link?: string;
      technologies?: string[];
    }>;
    backgroundColor?: string;
    isActive?: boolean;
  };
  partners?: {
    title: string;
    description?: string;
    partners: Array<{
      name?: string;
      logo?: string;
    }>;
    backgroundColor?: string;
    isActive?: boolean;
  };
  cards?: {
    title: string;
    description?: string;
    showStars?: boolean;
    items: Array<{
      quote?: string;
      author?: string;
      role?: string;
      company?: string;
    }>;
    backgroundColor?: string;
    isActive?: boolean;
  };
  faq?: {
    title: string;
    description?: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
    backgroundColor?: string;
    isActive?: boolean;
  };
  cta?: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    backgroundColor?: string;
    isActive?: boolean;
  };
  sectionOrder?: string[]; // Array of section keys to control order
}

interface ServiceTemplateProps {
  data: ServiceTemplateData;
  serviceTitle: string;
}

// Helper to check if icon is a URL
const isIconUrl = (icon?: string): boolean => {
  if (!icon) return false;
  return icon.startsWith("http") || icon.startsWith("/");
};

// Helper to check if image is a URL
const isImageUrl = (image?: string): boolean => {
  if (!image) return false;
  return image.startsWith("http") || image.startsWith("/");
};

// Partners Carousel Component
function PartnersCarousel({
  partners,
}: {
  partners: Array<{ name?: string; logo?: string }>;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [partners.length]);

  return (
    <div className="overflow-hidden">
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
  );
}

export default function ServiceTemplate({
  data,
  serviceTitle,
}: ServiceTemplateProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [cardsIndex, setCardsIndex] = useState(0);
  const [techIndex, setTechIndex] = useState(0);

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

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

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

  // Default section order
  const defaultOrder = [
    "hero",
    "overview",
    "stats",
    "subServices",
    "whyChooseUs",
    "technologies",
    "process",
    "portfolio",
    "partners",
    "cards",
    "faq",
    "cta",
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
      case "whyChooseUs":
        return !!(
          data.whyChooseUs &&
          data.whyChooseUs.isActive !== false &&
          data.whyChooseUs.items &&
          data.whyChooseUs.items.length > 0
        );
      case "technologies":
        return !!(
          data.technologies &&
          data.technologies.isActive !== false &&
          data.technologies.items &&
          data.technologies.items.length > 0
        );
      case "process":
        return !!(
          data.process &&
          data.process.isActive !== false &&
          data.process.steps &&
          data.process.steps.length > 0
        );
      case "portfolio":
        return !!(
          data.portfolio &&
          data.portfolio.isActive !== false &&
          data.portfolio.projects &&
          data.portfolio.projects.length > 0
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
      case "faq":
        return !!(
          data.faq &&
          data.faq.isActive !== false &&
          data.faq.items &&
          data.faq.items.length > 0
        );
      case "cta":
        return !!(data.cta && data.cta.isActive !== false);
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
          {backgroundVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ opacity: backgroundOpacity }}
            >
              <source src={backgroundVideo} type="video/mp4" />
              <source src={backgroundVideo} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          ) : backgroundImage ? (
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                opacity: backgroundOpacity,
              }}
            />
          ) : null}
        </div>
      )}

      {/* Dark overlay to ensure content readability */}
      {(backgroundImage || backgroundVideo) && (
        <div
          className="absolute inset-0 theme-bg-black"
          style={{ opacity: 0.5 }}
        ></div>
      )}

      {/* Content - Left Aligned */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl text-left">
          {data.hero.breadcrumbs && (
            <div className="text-xs sm:text-sm text-white mb-3 sm:mb-4 opacity-90">
              {data.hero.breadcrumbs}
            </div>
          )}

          {data.hero.title && (
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-white mb-3 sm:mb-4 leading-tight">
              {data.hero.title || serviceTitle}
            </h1>
          )}

          {data.hero.description && (
            <p
              className="text-sm sm:text-base md:text-lg theme-text-white mb-4 sm:mb-6 max-w-3xl leading-relaxed"
              style={{ opacity: 0.9 }}
            >
              {data.hero.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
            {data.hero.primaryButtonText && (
              <Link
                href={data.hero.primaryButtonLink || "#contact"}
                className="inline-block px-6 py-2.5 sm:px-8 sm:py-4 theme-bg-primary-mid text-white rounded-lg font-semibold text-sm sm:text-base transition-all hover:opacity-90 hover:shadow-lg"
              >
                {data.hero.primaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  // Sections map - maps section keys to their render functions
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
                    {/* Left Side - Text with Checkmarks */}
                    <div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
                        {data.overview.title}
                      </h2>
                      {data.overview.paragraphs &&
                        data.overview.paragraphs.map((para, index) => (
                          <div
                            key={index}
                            className="mb-4 sm:mb-6 flex items-start gap-3 sm:gap-4"
                          >
                            <div className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full theme-bg-primary-mid flex items-center justify-center mt-1">
                              <svg
                                className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                              {para.text}
                            </p>
                          </div>
                        ))}
                    </div>

                    {/* Right Side - Image */}
                    <div>
                      {data.overview.image && (
                        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
                          <Image
                            src={data.overview.image}
                            alt={data.overview.title}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
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
              getDefaultBackground("services");
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
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
                    {data.subServices.items.map((service, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                      >
                        {service.icon && (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl mb-3 sm:mb-4 relative overflow-hidden">
                            {isIconUrl(service.icon) && service.icon ? (
                              <Image
                                src={service.icon}
                                alt={service.title || "Sub Service"}
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
                                    if (
                                      service.icon &&
                                      !isIconUrl(service.icon)
                                    ) {
                                      fallback.className =
                                        "text-xl sm:text-2xl";
                                      fallback.textContent = service.icon;
                                    } else if (service.title) {
                                      fallback.className =
                                        "text-xs font-bold text-white text-center";
                                      fallback.textContent = service.title;
                                    }
                                    parent.appendChild(fallback);
                                  }
                                }}
                              />
                            ) : service.icon ? (
                              <div className="text-xl sm:text-2xl">
                                {service.icon}
                              </div>
                            ) : null}
                          </div>
                        )}
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                          {service.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                          {service.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  {data.subServices.ctaButtonText && (
                    <div className="text-center">
                      <Link
                        href={data.subServices.ctaButtonLink || "#contact"}
                        className="inline-block px-6 py-2.5 sm:px-8 sm:py-4 theme-bg-primary-mid text-white rounded-lg font-semibold text-sm sm:text-base transition-all hover:opacity-90 hover:shadow-lg"
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
    whyChooseUs: () =>
      data.whyChooseUs
        ? (() => {
            const backgroundColor =
              data.whyChooseUs.backgroundColor || getDefaultBackground("about");
            const background = getBackgroundStyle(backgroundColor);
            return (
              <section
                className={`py-12 sm:py-16 md:py-24 ${
                  background.className || ""
                }`}
                style={background.style}
                key="whyChooseUs"
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid md:grid-cols-2 gap-8 sm:gap-12 mb-8 sm:mb-10 md:mb-12">
                    {/* Left Side - Text */}
                    <div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                        {data.whyChooseUs.title}
                      </h2>
                      {data.whyChooseUs.subtitle && (
                        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                          {data.whyChooseUs.subtitle}
                        </p>
                      )}
                      {data.whyChooseUs.items &&
                        data.whyChooseUs.items.map((item, index) => (
                          <div key={index} className="mb-4 sm:mb-6">
                            <div className="flex items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-200">
                              <div className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full theme-bg-primary-mid flex items-center justify-center mt-1">
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                              <p className="text-base sm:text-lg text-gray-700">
                                {item.text}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Right Side - Image */}
                    <div>
                      {data.whyChooseUs.image && (
                        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
                          <Image
                            src={data.whyChooseUs.image}
                            alt={data.whyChooseUs.title}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  {data.whyChooseUs.certifications &&
                    data.whyChooseUs.certifications.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                        {data.whyChooseUs.certifications.map((cert, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-3 sm:p-4 rounded-lg flex items-center justify-center"
                          >
                            {cert.image ? (
                              <div className="relative w-full h-16 sm:h-20">
                                <Image
                                  src={cert.image}
                                  alt={cert.name}
                                  fill
                                  className="object-contain"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <span className="text-xs sm:text-sm text-gray-600 text-center">
                                {cert.name}
                              </span>
                            )}
                          </div>
                        ))}
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
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
                        <span className="theme-text-black">
                          {data.technologies.title}
                        </span>
                      </h2>
                      {data.technologies.description && (
                        <p
                          className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2"
                          style={{ opacity: 0.8 }}
                        >
                          {data.technologies.description}
                        </p>
                      )}
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
                      <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                          transform: `translateX(-${
                            getCurrentTechSlideIndex() * 100
                          }%)`,
                        }}
                      >
                        {Array.from({ length: totalTechSlides }).map(
                          (_, slideIndex) => (
                            <div
                              key={slideIndex}
                              className="flex gap-2 shrink-0 w-full px-1"
                            >
                              {data.technologies &&
                                data.technologies.items &&
                                data.technologies.items
                                  .slice(
                                    slideIndex * mobileItemsToShowTech,
                                    (slideIndex + 1) * mobileItemsToShowTech
                                  )
                                  .map((tech, itemIndex) => (
                                    <div
                                      key={`${slideIndex}-${itemIndex}`}
                                      className="group theme-bg-white rounded-lg flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden p-3 shrink-0"
                                      style={{
                                        width: `calc((100% - ${
                                          (mobileItemsToShowTech - 1) * 8
                                        }px) / ${mobileItemsToShowTech})`,
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
                                              unoptimized
                                              onError={(e) => {
                                                const target = e.currentTarget;
                                                target.style.display = "none";
                                                const parent =
                                                  target.parentElement;
                                                if (parent) {
                                                  const fallback =
                                                    document.createElement(
                                                      "div"
                                                    );
                                                  if (
                                                    tech.icon &&
                                                    !isIconUrl(tech.icon)
                                                  ) {
                                                    fallback.className =
                                                      "text-lg";
                                                    fallback.textContent =
                                                      tech.icon;
                                                  } else if (tech.name) {
                                                    fallback.className =
                                                      "text-xs font-bold theme-text-black text-center";
                                                    fallback.textContent =
                                                      tech.name;
                                                  }
                                                  parent.appendChild(fallback);
                                                }
                                              }}
                                            />
                                          </div>
                                        ) : tech.icon ? (
                                          <div className="text-lg">
                                            {tech.icon}
                                          </div>
                                        ) : tech.name ? (
                                          <div className="text-xs font-semibold theme-text-black text-center px-1">
                                            {tech.name}
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  ))}
                            </div>
                          )
                        )}
                      </div>
                      {/* Dot indicators for mobile */}
                      {totalTechSlides > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                          {Array.from({ length: totalTechSlides }).map(
                            (_, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  setTechIndex(idx * mobileItemsToShowTech)
                                }
                                className={`w-2 h-2 rounded-full transition-all ${
                                  getCurrentTechSlideIndex() === idx
                                    ? "bg-gray-800 w-6"
                                    : "bg-gray-300"
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* Desktop Grid */}
                    <div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-3">
                      {data.technologies.items.map(
                        (
                          tech: {
                            name?: string;
                            icon?: string;
                            category?: string;
                          },
                          index: number
                        ) => (
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
                                        const fallback =
                                          document.createElement("div");
                                        if (
                                          tech.icon &&
                                          !isIconUrl(tech.icon)
                                        ) {
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
                        )
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );
          })()
        : null,
    process: () =>
      data.process && data.process.steps && data.process.steps.length > 0
        ? (() => {
            const backgroundColor =
              data.process.backgroundColor || getDefaultBackground("process");
            const background = getBackgroundStyle(backgroundColor);
            return (
              <section
                className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${
                  background.className || ""
                }`}
                style={background.style}
                key="process"
              >
                <div className="flex flex-col justify-center items-center max-w-7xl mx-auto">
                  {data.process.title && (
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
                        {data.process.title}
                      </h2>
                      {data.process.description && (
                        <p
                          className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2"
                          style={{ opacity: 0.8 }}
                        >
                          {data.process.description}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Dashed Line */}
                    <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300"></div>

                    <div className="space-y-6 sm:space-y-8">
                      {data.process.steps.map(
                        (
                          step: {
                            number?: string;
                            title?: string;
                            description?: string;
                            icon?: string;
                          },
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="relative flex items-start gap-4 sm:gap-6 group"
                          >
                            {/* Square Icon */}
                            <div className="relative z-10 shrink-0">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 theme-bg-primary-mid rounded-lg flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                                {step.icon && isIconUrl(step.icon) ? (
                                  <div className="relative w-6 h-6 sm:w-8 sm:h-8">
                                    <Image
                                      src={step.icon}
                                      alt={step.title || `Step ${index + 1}`}
                                      fill
                                      className="object-contain p-1 sm:p-1.5"
                                      unoptimized
                                      onError={(e) => {
                                        const target = e.currentTarget;
                                        target.style.display = "none";
                                        const parent = target.parentElement;
                                        if (parent) {
                                          const fallback =
                                            document.createElement("span");
                                          fallback.textContent =
                                            step.number || String(index + 1);
                                          fallback.className =
                                            "text-sm sm:text-lg font-bold";
                                          parent.appendChild(fallback);
                                        }
                                      }}
                                    />
                                  </div>
                                ) : step.icon ? (
                                  <span className="text-lg sm:text-xl">
                                    {step.icon}
                                  </span>
                                ) : (
                                  <span className="text-sm sm:text-lg font-bold">
                                    {step.number || index + 1}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 pt-1">
                              {step.title && (
                                <h3 className="text-lg sm:text-xl font-bold theme-text-black mb-2 sm:mb-3 theme-hover-primary-mid transition-colors">
                                  {step.title}
                                </h3>
                              )}
                              {step.description && (
                                <p
                                  className="text-sm sm:text-base theme-text-black leading-relaxed wrap-break-word"
                                  style={{ opacity: 0.8 }}
                                >
                                  {step.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
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
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
                        {data.portfolio.title}
                      </h2>
                      {data.portfolio.description && (
                        <p
                          className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2"
                          style={{ opacity: 0.8 }}
                        >
                          {data.portfolio.description}
                        </p>
                      )}
                    </div>
                  )}

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
                            {/* Project Image */}
                            <div className="relative h-64 overflow-hidden theme-gradient">
                              {isImageUrl(project.image) && project.image ? (
                                <Image
                                  src={project.image}
                                  alt={project.title || "Project"}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="theme-text-white text-6xl animate-float">
                                    {project.image || "💼"}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Project Content */}
                            <div className="p-6">
                              {project.category && (
                                <span
                                  className="inline-block px-3 py-1 text-xs font-semibold theme-primary-mid rounded-full mb-3"
                                  style={{
                                    backgroundColor: "rgba(206, 212, 48, 0.1)",
                                  }}
                                >
                                  {project.category}
                                </span>
                              )}
                              {project.title && (
                                <h3 className="text-xl font-bold theme-text-black mb-3 theme-hover-primary transition-colors">
                                  {project.title}
                                </h3>
                              )}
                              {project.description && (
                                <p
                                  className="theme-text-black mb-4 line-clamp-3"
                                  style={{ opacity: 0.8 }}
                                >
                                  {project.description}
                                </p>
                              )}
                              {Array.isArray(project.technologies) &&
                                project.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {project.technologies.map(
                                      (tech: string, techIndex: number) => (
                                        <span
                                          key={techIndex}
                                          className="px-2 py-1 text-xs font-medium theme-text-black rounded"
                                          style={{
                                            backgroundColor:
                                              "rgba(0, 0, 0, 0.05)",
                                          }}
                                        >
                                          {tech}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Dot indicators for mobile */}
                      {totalPortfolioSlides > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                          {Array.from({ length: totalPortfolioSlides }).map(
                            (_, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  setPortfolioIndex(idx * mobileItemsToShow)
                                }
                                className={`w-2 h-2 rounded-full transition-all ${
                                  getCurrentPortfolioSlideIndex() === idx
                                    ? "bg-gray-800 w-6"
                                    : "bg-gray-300"
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* Desktop Grid */}
                    <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8 px-8">
                      {getVisiblePortfolioItems(false).map(
                        ({ item: project, originalIndex }, visibleIndex) => (
                          <div
                            key={`portfolio-${originalIndex}-${visibleIndex}-${
                              project.title || visibleIndex
                            }`}
                            className="group relative theme-bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                          >
                            {/* Project Image */}
                            <div className="relative h-64 overflow-hidden theme-gradient">
                              {isImageUrl(project.image) && project.image ? (
                                <Image
                                  src={project.image}
                                  alt={project.title || "Project"}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="theme-text-white text-6xl animate-float">
                                    {project.image || "💼"}
                                  </div>
                                </div>
                              )}
                              {/* Overlay on hover */}
                              {/* <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          {project.link && (
                            <Link
                              href={project.link}
                              className="theme-text-white font-semibold hover:underline"
                            >
                              View Project →
                            </Link>
                          )}
                        </div> */}
                            </div>

                            {/* Project Content */}
                            <div className="p-6">
                              {project.category && (
                                <span
                                  className="inline-block px-3 py-1 text-xs font-semibold theme-primary-mid rounded-full mb-3"
                                  style={{
                                    backgroundColor: "rgba(206, 212, 48, 0.1)",
                                  }}
                                >
                                  {project.category}
                                </span>
                              )}
                              {project.title && (
                                <h3 className="text-xl font-bold theme-text-black mb-3 theme-hover-primary transition-colors">
                                  {project.title}
                                </h3>
                              )}
                              {project.description && (
                                <p
                                  className="theme-text-black mb-4 line-clamp-3"
                                  style={{ opacity: 0.8 }}
                                >
                                  {project.description}
                                </p>
                              )}
                              {Array.isArray(project.technologies) &&
                                project.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {project.technologies.map(
                                      (tech: string, techIndex: number) => (
                                        <span
                                          key={techIndex}
                                          className="px-2 py-1 text-xs font-medium theme-text-black rounded"
                                          style={{
                                            backgroundColor:
                                              "rgba(0, 0, 0, 0.05)",
                                          }}
                                        >
                                          {tech}
                                        </span>
                                      )
                                    )}
                                  </div>
                                )}
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
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
                        <span className="theme-text-black">
                          {data.partners.title.split(" ")[0]}
                        </span>
                        {data.partners.title.split(" ").length > 1 && (
                          <span className="theme-primary-mid">
                            {" "}
                            {data.partners.title.split(" ").slice(1).join(" ")}
                          </span>
                        )}
                      </h2>
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

                  <PartnersCarousel partners={data.partners.partners} />
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
                  <div className="text-center mb-8 sm:mb-12 md:mb-16">
                    {data.cards.title && (
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
                        {data.cards.title}
                      </h2>
                    )}
                    {data.cards.description && (
                      <p
                        className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2"
                        style={{ opacity: 0.8 }}
                      >
                        {data.cards.description}
                      </p>
                    )}
                  </div>
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
                      <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{
                          transform: `translateX(-${cardsIndex * 100}%)`,
                        }}
                      >
                        {data.cards.items.map((item, index) => (
                          <div
                            key={index}
                            className="group p-6 theme-bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 shrink-0 w-full px-4"
                            style={{
                              borderColor: "rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            {data.cards && data.cards.showStars !== false && (
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
                              <p
                                className="theme-text-black mb-6 leading-relaxed italic text-sm"
                                style={{ opacity: 0.8 }}
                              >
                                &ldquo;{item.quote}&rdquo;
                              </p>
                            )}
                            <div
                              className="pt-4 border-t"
                              style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                            >
                              {item.author && (
                                <p className="font-bold theme-text-black mb-1">
                                  {item.author}
                                </p>
                              )}
                              {(item.role || item.company) && (
                                <p
                                  className="text-xs theme-text-black"
                                  style={{ opacity: 0.6 }}
                                >
                                  {item.role && `${item.role}`}
                                  {item.role && item.company && ", "}
                                  {item.company}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Dot indicators for mobile */}
                      {totalCardsSlides > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                          {Array.from({ length: totalCardsSlides }).map(
                            (_, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  setCardsIndex(idx * mobileItemsToShowCards)
                                }
                                className={`w-2 h-2 rounded-full transition-all ${
                                  getCurrentCardsSlideIndex() === idx
                                    ? "bg-gray-800 w-6"
                                    : "bg-gray-300"
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
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
                              <p
                                className="theme-text-black mb-6 leading-relaxed italic text-sm"
                                style={{ opacity: 0.8 }}
                              >
                                &ldquo;{item.quote}&rdquo;
                              </p>
                            )}
                            <div
                              className="pt-4 border-t"
                              style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                            >
                              {item.author && (
                                <p className="font-bold theme-text-black mb-1">
                                  {item.author}
                                </p>
                              )}
                              {(item.role || item.company) && (
                                <p
                                  className="text-xs theme-text-black"
                                  style={{ opacity: 0.6 }}
                                >
                                  {item.role && `${item.role}`}
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
                </div>
              </section>
            );
          })()
        : null,
    faq: () =>
      data.faq && data.faq.items && data.faq.items.length > 0
        ? (() => {
            const backgroundColor =
              data.faq.backgroundColor || getDefaultBackground("faq");
            const background = getBackgroundStyle(backgroundColor);
            return (
              <section
                className={`py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 ${
                  background.className || ""
                }`}
                style={background.style}
                key="faq"
              >
                <div className="max-w-4xl mx-auto">
                  {data.faq.title && (
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold theme-text-black mb-3 sm:mb-4 px-2">
                        {data.faq.title}
                      </h2>
                      {data.faq.description && (
                        <p
                          className="text-base sm:text-lg md:text-xl theme-text-black max-w-3xl mx-auto px-2"
                          style={{ opacity: 0.8 }}
                        >
                          {data.faq.description}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-3 sm:space-y-4">
                    {data.faq.items.map(
                      (
                        faq: {
                          question?: string;
                          answer?: string;
                        },
                        index: number
                      ) => (
                        <div
                          key={index}
                          className="theme-bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                          style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                        >
                          {/* Question */}
                          <button
                            onClick={() => toggleFaq(index)}
                            className="w-full px-4 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl"
                          >
                            <span className="text-base sm:text-lg font-semibold theme-text-black pr-3 sm:pr-4">
                              {faq.question || `Question ${index + 1}`}
                            </span>
                            <div
                              className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-transparent border-2 theme-text-black flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                                expandedFaq === index ? "rotate-180" : ""
                              }`}
                              style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                            >
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M19 9l-7 7-7-7"></path>
                              </svg>
                            </div>
                          </button>

                          {/* Answer */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              expandedFaq === index ? "max-h-96" : "max-h-0"
                            }`}
                          >
                            <div className="px-4 pb-4 sm:px-6 sm:pb-5 pt-0">
                              <p
                                className="text-sm sm:text-base theme-text-black leading-relaxed"
                                style={{ opacity: 0.8 }}
                              >
                                {faq.answer || `Answer ${index + 1}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </section>
            );
          })()
        : null,
    cta: () =>
      data.cta
        ? (() => {
            const backgroundColor =
              data.cta.backgroundColor || getDefaultBackground("cta");
            const background = getBackgroundStyle(backgroundColor);
            return (
              <section
                className={`py-12 sm:py-16 md:py-24 text-black ${
                  background.className || ""
                }`}
                style={background.style}
                key="cta"
              >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-black">
                    {data.cta.title}
                  </h2>
                  {data.cta.description && (
                    <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 text-black">
                      {data.cta.description}
                    </p>
                  )}
                  {data.cta.buttonText && (
                    <Link
                      href={data.cta.buttonLink || "#contact"}
                      className="inline-block px-6 py-2.5 sm:px-8 sm:py-4 theme-bg-primary-mid text-white rounded-lg font-semibold text-sm sm:text-base transition-all hover:opacity-90 hover:shadow-lg"
                    >
                      {data.cta.buttonText}
                    </Link>
                  )}
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
