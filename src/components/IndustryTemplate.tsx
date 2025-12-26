"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IndustryTemplateData } from "@/lib/industry-template";

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

  // Get background media and opacity from hero
  const backgroundImage = data.hero.backgroundImage;
  const backgroundVideo = data.hero.backgroundVideo;
  const backgroundOpacity = data.hero.backgroundOpacity ?? 0.3;

  const itemsToShowCards = 3;
  const totalCardsItems = data.cards?.items?.length || 0;

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

  // Get visible cards items (3 at a time with infinite loop)
  const getVisibleCardsItems = () => {
    if (!data.cards?.items) return [];
    const visible = [];
    for (let i = 0; i < itemsToShowCards; i++) {
      const index = (cardsIndex + i) % totalCardsItems;
      visible.push({
        item: data.cards.items[index],
        originalIndex: index,
      });
    }
    return visible;
  };

  const itemsToShow = 3;
  const totalPortfolioItems = data.portfolio?.projects?.length || 0;

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

  // Get visible portfolio items (3 at a time with infinite loop)
  const getVisiblePortfolioItems = () => {
    if (!data.portfolio?.projects) return [];
    const visible = [];
    for (let i = 0; i < itemsToShow; i++) {
      const index = (portfolioIndex + i) % totalPortfolioItems;
      visible.push({
        item: data.portfolio.projects[index],
        originalIndex: index,
      });
    }
    return visible;
  };

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
      className="relative py-16 md:py-20 lg:py-24 overflow-hidden theme-bg-black"
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
            <div className="mb-4 text-sm theme-text-white opacity-80">
              {data.hero.breadcrumbs}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 theme-text-white">
            {data.hero.title || industryTitle}
          </h1>
          {data.hero.subtitle && (
            <p className="text-xl md:text-2xl theme-primary-mid mb-4">
              {data.hero.subtitle}
            </p>
          )}
          {data.hero.description && (
            <p
              className="text-base md:text-lg theme-text-white mb-6 max-w-3xl leading-relaxed"
              style={{ opacity: 0.9 }}
            >
              {data.hero.description}
            </p>
          )}
          {data.hero.primaryButtonText && (
            <Link
              href={data.hero.primaryButtonLink || "#contact"}
              className="inline-block px-6 py-3 theme-bg-primary-mid text-white rounded-lg font-semibold transition-all hover:opacity-90 hover:shadow-lg"
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
      data.overview ? (
        <section
          key="overview"
          id="overview"
          className="py-16 md:py-24 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold theme-text-black mb-6">
                  {data.overview.title}
                </h2>
                <div className="space-y-4">
                  {data.overview.paragraphs.map((para, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="shrink-0 w-6 h-6 rounded-full theme-bg-primary-mid flex items-center justify-center mt-1">
                        <svg
                          className="w-4 h-4 theme-text-white"
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
                      <p className="text-lg theme-text-black leading-relaxed">
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
      ) : null,
    stats: () =>
      data.stats && data.stats.items && data.stats.items.length > 0 ? (
        <section className="py-16 md:py-24 bg-white" key="stats">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-900 rounded-xl p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {data.stats.items.map((stat, index) => (
                  <div key={index} className="text-center">
                    {stat.icon && (
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-2xl mb-4 relative overflow-hidden mx-auto">
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
                                const fallback = document.createElement("div");
                                if (stat.icon && !isIconUrl(stat.icon)) {
                                  fallback.className = "text-2xl";
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
                          <div className="text-2xl">{stat.icon}</div>
                        ) : null}
                      </div>
                    )}
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-lg text-white opacity-90">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null,
    subServices: () =>
      data.subServices &&
      data.subServices.items &&
      data.subServices.items.length > 0 ? (
        <section className="py-16 md:py-24 bg-gray-50" key="subServices">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {data.subServices.title}
              </h2>
              {data.subServices.description && (
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {data.subServices.description}
                </p>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.subServices.items.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {item.icon && (
                      <div className="shrink-0 w-12 h-12 theme-bg-primary-mid rounded-lg flex items-center justify-center text-2xl">
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:theme-text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="shrink-0 theme-text-primary">
                      <svg
                        className="w-5 h-5"
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {data.subServices.ctaButtonText && (
              <div className="text-center mt-12">
                <Link
                  href={data.subServices.ctaButtonLink || "#contact"}
                  className="inline-block px-8 py-3 theme-bg-primary-mid text-white rounded-lg font-semibold transition-all hover:opacity-90 hover:shadow-lg"
                >
                  {data.subServices.ctaButtonText}
                </Link>
              </div>
            )}
          </div>
        </section>
      ) : null,
    partners: () =>
      data.partners &&
      data.partners.partners &&
      data.partners.partners.length > 0 ? (
        <section
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 theme-bg-white-green-gradient relative overflow-hidden"
          key="partners"
        >
          <div className="relative z-10 max-w-7xl mx-auto">
            {data.partners.title && (
              <div className="text-center mb-12">
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
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      <span className="theme-text-black">
                        {titleParts.firstPart}
                      </span>
                      {titleParts.rest && (
                        <span className="theme-primary-mid">
                          {" "}
                          {titleParts.rest}
                        </span>
                      )}
                    </h2>
                  );
                })()}
                {data.partners.description && (
                  <p
                    className="text-lg theme-text-black max-w-3xl mx-auto"
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
                {[...data.partners.partners, ...data.partners.partners].map(
                  (partner, index) => (
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
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null,
    cards: () =>
      data.cards && data.cards.items && data.cards.items.length > 0 ? (
        <section
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 theme-bg-white"
          key="cards"
        >
          <div className="max-w-7xl mx-auto">
            {data.cards.title && (
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold theme-text-black mb-4">
                  {data.cards.title}
                </h2>
                {data.cards.description && (
                  <p className="text-xl theme-text-black max-w-3xl mx-auto opacity-80">
                    {data.cards.description}
                  </p>
                )}
              </div>
            )}
            {totalCardsItems > 0 && (
              <div className="relative">
                {totalCardsItems > itemsToShowCards && (
                  <>
                    <button
                      onClick={prevCards}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
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
                    <button
                      onClick={nextCards}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
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
                  </>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-8">
                  {getVisibleCardsItems().map(
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
              </div>
            )}
          </div>
        </section>
      ) : null,
    portfolio: () =>
      data.portfolio &&
      data.portfolio.projects &&
      data.portfolio.projects.length > 0 ? (
        <section
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 theme-bg-white"
          key="portfolio"
        >
          <div className="max-w-7xl mx-auto">
            {data.portfolio.title && (
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold theme-text-black mb-4">
                  {data.portfolio.title}
                </h2>
                {data.portfolio.description && (
                  <p className="text-xl theme-text-black max-w-3xl mx-auto opacity-80">
                    {data.portfolio.description}
                  </p>
                )}
              </div>
            )}
            {totalPortfolioItems > 0 && (
              <div className="relative">
                {totalPortfolioItems > itemsToShow && (
                  <>
                    <button
                      onClick={prevPortfolio}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
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
                    <button
                      onClick={nextPortfolio}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-transparent border-2 theme-text-black rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all backdrop-blur-sm"
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
                  </>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-8">
                  {getVisiblePortfolioItems().map(
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
                              unoptimized
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
                          {project.link && (
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
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null,
    technologies: () =>
      data.technologies &&
      data.technologies.items &&
      data.technologies.items.length > 0 ? (
        <section
          className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 theme-bg-white-green-gradient relative overflow-hidden"
          key="technologies"
        >
          <div className="relative z-10 max-w-7xl mx-auto">
            {data.technologies.title && (
              <div className="text-center mb-16">
                {/* Split title like TechnologiesSection */}
                {(() => {
                  const getTitleParts = (title: string) => {
                    const lowerTitle = title.toLowerCase();
                    // Check for "Our Technologies" or "Technologies"
                    if (lowerTitle.includes("technologies")) {
                      const techIndex = lowerTitle.indexOf("technologies");
                      const beforeTech = title.substring(0, techIndex).trim();
                      const techPart = title.substring(
                        techIndex,
                        techIndex + 12
                      ); // "Technologies"
                      const afterTech = title.substring(techIndex + 12).trim();

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
                      andIndex > 0 ? andIndex : ampIndex > 0 ? ampIndex : -1;

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

                  const titleParts = getTitleParts(data.technologies.title);
                  return (
                    <>
                      <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="theme-text-black">
                          {titleParts.firstPart}
                        </span>
                        {titleParts.rest && (
                          <span className="theme-primary-mid">
                            {" "}
                            {titleParts.rest}
                          </span>
                        )}
                      </h2>
                      {data.technologies.description && (
                        <p
                          className="text-xl theme-text-black max-w-3xl mx-auto"
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
            <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-16">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-3">
                {data.technologies.items.map((tech, index) => (
                  <div
                    key={index}
                    className="group theme-bg-white rounded-md flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden p-3 md:p-4"
                    style={{ aspectRatio: "5/3", minHeight: "40px" }}
                  >
                    {/* Tech Logo/Icon - Only Logo, No Text */}
                    <div className="w-full h-full flex items-center justify-center relative p-2">
                      {isIconUrl(tech.icon) && tech.icon ? (
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
                              const fallback = document.createElement("div");
                              if (tech.icon && !isIconUrl(tech.icon)) {
                                fallback.className = "text-xl md:text-2xl";
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
                      ) : tech.icon ? (
                        <div className="text-xl md:text-2xl">{tech.icon}</div>
                      ) : tech.name ? (
                        <div className="text-xs md:text-sm font-semibold theme-text-black text-center">
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
      ) : null,
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
