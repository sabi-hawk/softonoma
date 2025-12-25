"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

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
    isActive?: boolean;
  };
  stats?: {
    items: Array<{
      icon?: string;
      value: string;
      label: string;
    }>;
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
    isActive?: boolean;
  };
  technologies?: {
    title: string;
    description: string;
    items: Array<{
      name: string;
      icon?: string;
    }>;
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
    isActive?: boolean;
  };
  partners?: {
    title: string;
    description?: string;
    partners: Array<{
      name?: string;
      logo?: string;
    }>;
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
    isActive?: boolean;
  };
  faq?: {
    title: string;
    description?: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
    isActive?: boolean;
  };
  cta?: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
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

  // Get background media and opacity from hero
  const backgroundImage = data.hero.backgroundImage;
  const backgroundVideo = data.hero.backgroundVideo;
  const backgroundOpacity = data.hero.backgroundOpacity ?? 0.3;

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

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
            <div className="text-sm text-white mb-4 opacity-90">
              {data.hero.breadcrumbs}
            </div>
          )}

          {data.hero.title && (
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold theme-text-white mb-4 leading-tight">
              {data.hero.title || serviceTitle}
            </h1>
          )}

          {data.hero.description && (
            <p
              className="text-base md:text-lg theme-text-white mb-6 max-w-3xl leading-relaxed"
              style={{ opacity: 0.9 }}
            >
              {data.hero.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {data.hero.primaryButtonText && (
              <Link
                href={data.hero.primaryButtonLink || "#contact"}
                className="inline-block px-8 py-4 bg-[#5c8c24] text-white rounded-lg font-semibold transition-all hover:bg-[#4a7320] hover:shadow-lg"
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
      data.overview ? (
        <section
          key="overview"
          id="overview"
          className="py-16 lg:py-24 bg-gray-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Side - Text with Checkmarks */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                  {data.overview.title}
                </h2>
                {data.overview.paragraphs &&
                  data.overview.paragraphs.map((para, index) => (
                    <div key={index} className="mb-6 flex items-start gap-4">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-[#5c8c24] flex items-center justify-center mt-1">
                        <svg
                          className="w-4 h-4 text-white"
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
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {para.text}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Right Side - Image */}
              <div>
                {data.overview.image && (
                  <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={data.overview.image}
                      alt={data.overview.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null,
    stats: () =>
      data.stats && data.stats.items && data.stats.items.length > 0 ? (
        <section className="py-16 lg:py-24 bg-white" key="stats">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-900 rounded-xl p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {data.stats.items.map((stat, index) => (
                  <div key={index} className="text-center">
                    {stat.icon && (
                      <div className="text-4xl mb-4 text-[#5c8c24] flex justify-center">
                        {stat.icon}
                      </div>
                    )}
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
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
        <section className="py-16 lg:py-24 bg-gray-50" key="subServices">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {data.subServices.items.map((service, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                >
                  {service.icon && (
                    <div className="w-16 h-16 bg-[#5c8c24] rounded-lg flex items-center justify-center text-white text-2xl mb-4">
                      {service.icon}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex justify-end">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            {data.subServices.ctaButtonText && (
              <div className="text-center">
                <Link
                  href={data.subServices.ctaButtonLink || "#contact"}
                  className="inline-block px-8 py-4 bg-[#5c8c24] text-white rounded-lg font-semibold transition-all hover:bg-[#4a7320] hover:shadow-lg"
                >
                  {data.subServices.ctaButtonText}
                </Link>
              </div>
            )}
          </div>
        </section>
      ) : null,
    whyChooseUs: () =>
      data.whyChooseUs ? (
        <section className="py-16 lg:py-24 bg-white" key="whyChooseUs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              {/* Left Side - Text */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {data.whyChooseUs.title}
                </h2>
                {data.whyChooseUs.subtitle && (
                  <p className="text-lg text-gray-600 mb-8">
                    {data.whyChooseUs.subtitle}
                  </p>
                )}
                {data.whyChooseUs.items &&
                  data.whyChooseUs.items.map((item, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                        <div className="shrink-0 w-6 h-6 rounded-full bg-[#5c8c24] flex items-center justify-center mt-1">
                          <svg
                            className="w-4 h-4 text-white"
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
                        <p className="text-lg text-gray-700">{item.text}</p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Right Side - Image */}
              <div>
                {data.whyChooseUs.image && (
                  <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={data.whyChooseUs.image}
                      alt={data.whyChooseUs.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            {data.whyChooseUs.certifications &&
              data.whyChooseUs.certifications.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {data.whyChooseUs.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg flex items-center justify-center"
                    >
                      {cert.image ? (
                        <div className="relative w-full h-20">
                          <Image
                            src={cert.image}
                            alt={cert.name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600 text-center">
                          {cert.name}
                        </span>
                      )}
                    </div>
                  ))}
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
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 theme-bg-white-green-gradient relative overflow-hidden"
          key="technologies"
        >
          <div className="relative z-10 max-w-7xl mx-auto">
            {data.technologies.title && (
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="theme-text-black">
                    {data.technologies.title}
                  </span>
                </h2>
                {data.technologies.description && (
                  <p
                    className="text-xl theme-text-black max-w-3xl mx-auto"
                    style={{ opacity: 0.8 }}
                  >
                    {data.technologies.description}
                  </p>
                )}
              </div>
            )}

            <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-16">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-3">
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
                      className="group theme-bg-white rounded-md flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden p-3 md:p-4"
                      style={{ aspectRatio: "5/3", minHeight: "40px" }}
                    >
                      <div className="w-full h-full flex items-center justify-center relative p-2">
                        {isIconUrl(tech.icon) && tech.icon ? (
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
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null,
    process: () =>
      data.process && data.process.steps && data.process.steps.length > 0 ? (
        <section
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 theme-bg-white"
          key="process"
        >
          <div className="max-w-7xl mx-auto">
            {data.process.title && (
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold theme-text-black mb-4">
                  {data.process.title}
                </h2>
                {data.process.description && (
                  <p
                    className="text-xl theme-text-black max-w-3xl mx-auto"
                    style={{ opacity: 0.8 }}
                  >
                    {data.process.description}
                  </p>
                )}
              </div>
            )}

            <div className="relative">
              {/* Connection Line (for desktop) */}
              <div
                className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 theme-gradient transform -translate-y-1/2"
                style={{ opacity: 0.3 }}
              ></div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
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
                      className="relative flex flex-col items-center text-center group"
                    >
                      {/* Step Number/Icon */}
                      <div className="relative z-10 mb-6">
                        <div className="w-20 h-20 theme-gradient rounded-full flex items-center justify-center theme-text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden relative">
                          {step.icon && isIconUrl(step.icon) ? (
                            <Image
                              src={step.icon}
                              alt={step.title || `Step ${index + 1}`}
                              fill
                              className="object-cover"
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
                                  fallback.className = "text-2xl font-bold";
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          ) : step.icon ? (
                            <span className="text-4xl">{step.icon}</span>
                          ) : (
                            <span>{step.number || index + 1}</span>
                          )}
                        </div>
                      </div>

                      {/* Step Content */}
                      <div
                        className="theme-bg-white rounded-xl p-6 shadow-lg border group-hover:shadow-xl transition-all duration-300 w-full"
                        style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                      >
                        {step.title && (
                          <h3 className="text-xl font-bold theme-text-black mb-3 theme-hover-primary transition-colors">
                            {step.title}
                          </h3>
                        )}
                        {step.description && (
                          <p
                            className="theme-text-black leading-relaxed"
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
      ) : null,
    portfolio: () =>
      data.portfolio &&
      data.portfolio.projects &&
      data.portfolio.projects.length > 0 ? (
        <section
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 theme-bg-white"
          key="portfolio"
        >
          <div className="max-w-7xl mx-auto">
            {data.portfolio.title && (
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold theme-text-black mb-4">
                  {data.portfolio.title}
                </h2>
                {data.portfolio.description && (
                  <p
                    className="text-xl theme-text-black max-w-3xl mx-auto"
                    style={{ opacity: 0.8 }}
                  >
                    {data.portfolio.description}
                  </p>
                )}
              </div>
            )}

            <div className="relative">
              {/* Left Arrow */}
              {totalPortfolioItems > itemsToShow && (
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
              )}

              {/* Carousel Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
                {getVisiblePortfolioItems().map(
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
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          {project.link && (
                            <Link
                              href={project.link}
                              className="theme-text-white font-semibold hover:underline"
                            >
                              View Project →
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Project Content */}
                      <div className="p-6">
                        {project.category && (
                          <span
                            className="inline-block px-3 py-1 text-xs font-semibold theme-primary-end rounded-full mb-3"
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
                                      backgroundColor: "rgba(0, 0, 0, 0.05)",
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

              {/* Right Arrow */}
              {totalPortfolioItems > itemsToShow && (
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
              )}
            </div>
          </div>
        </section>
      ) : null,
    partners: () =>
      data.partners &&
      data.partners.partners &&
      data.partners.partners.length > 0 ? (
        <section
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 theme-bg-white-green-gradient relative overflow-hidden"
          key="partners"
        >
          <div className="relative z-10 max-w-7xl mx-auto">
            {data.partners.title && (
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="theme-text-black">
                    {data.partners.title.split(" ")[0]}
                  </span>
                  {data.partners.title.split(" ").length > 1 && (
                    <span className="theme-primary-end">
                      {" "}
                      {data.partners.title.split(" ").slice(1).join(" ")}
                    </span>
                  )}
                </h2>
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

            <PartnersCarousel partners={data.partners.partners} />
          </div>
        </section>
      ) : null,
    cards: () =>
      data.cards && data.cards.items && data.cards.items.length > 0 ? (
        <section
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 theme-bg-white"
          key="cards"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {data.cards.title && (
                <h2 className="text-4xl md:text-5xl font-bold theme-text-black mb-4">
                  {data.cards.title}
                </h2>
              )}
              {data.cards.description && (
                <p
                  className="text-xl theme-text-black max-w-3xl mx-auto"
                  style={{ opacity: 0.8 }}
                >
                  {data.cards.description}
                </p>
              )}
            </div>
            <div className="relative">
              {/* Left Arrow */}
              {totalCardsItems > itemsToShowCards && (
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
              )}

              {/* Carousel Container */}
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

              {/* Right Arrow */}
              {totalCardsItems > itemsToShowCards && (
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
              )}
            </div>
          </div>
        </section>
      ) : null,
    faq: () =>
      data.faq && data.faq.items && data.faq.items.length > 0 ? (
        <section
          className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 theme-bg-white"
          key="faq"
        >
          <div className="max-w-4xl mx-auto">
            {data.faq.title && (
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold theme-text-black mb-4">
                  {data.faq.title}
                </h2>
                {data.faq.description && (
                  <p
                    className="text-xl theme-text-black max-w-3xl mx-auto"
                    style={{ opacity: 0.8 }}
                  >
                    {data.faq.description}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
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
                      className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl"
                    >
                      <span className="text-lg font-semibold theme-text-black pr-4">
                        {faq.question || `Question ${index + 1}`}
                      </span>
                      <div
                        className={`shrink-0 w-8 h-8 rounded-full bg-transparent border-2 theme-text-black flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                          expandedFaq === index ? "rotate-180" : ""
                        }`}
                        style={{ borderColor: "rgba(0, 0, 0, 0.2)" }}
                      >
                        <svg
                          className="w-5 h-5"
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
                      <div className="px-6 pb-5 pt-0">
                        <p
                          className="theme-text-black leading-relaxed"
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
      ) : null,
    cta: () =>
      data.cta ? (
        <section className="py-16 lg:py-24 bg-gray-900 text-white" key="cta">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {data.cta.title}
            </h2>
            {data.cta.description && (
              <p className="text-lg mb-8 opacity-90">{data.cta.description}</p>
            )}
            {data.cta.buttonText && (
              <Link
                href={data.cta.buttonLink || "#contact"}
                className="inline-block px-8 py-4 bg-[#5c8c24] text-white rounded-lg font-semibold transition-all hover:bg-[#4a7320] hover:shadow-lg"
              >
                {data.cta.buttonText}
              </Link>
            )}
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
