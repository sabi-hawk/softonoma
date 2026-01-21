"use client";

import { Fragment } from "react";
import { IndustryTemplateData } from "@/lib/industry-template";
import { useCarousel } from "./templates/hooks/useCarousel";
import { useTechCarousel } from "./templates/hooks/useTechCarousel";
import { usePartnersCarousel } from "./templates/hooks/usePartnersCarousel";
import { useHeroVideo } from "./templates/hooks/useHeroVideo";
import HeroSection from "./templates/sections/industry/HeroSection";
import OverviewSection from "./templates/sections/common/OverviewSection";
import StatsSection from "./templates/sections/common/StatsSection";
import SubServicesSection from "./templates/sections/common/SubServicesSection";
import PartnersSection from "./templates/sections/common/PartnersSection";
import CardsSection from "./templates/sections/common/CardsSection";
import PortfolioSection from "./templates/sections/common/PortfolioSection";
import TechnologiesSection from "./templates/sections/common/TechnologiesSection";

interface IndustryTemplateProps {
  data: IndustryTemplateData;
  industryTitle: string;
}

export default function IndustryTemplate({ data, industryTitle }: IndustryTemplateProps) {
  const backgroundImage = data.hero.backgroundImage;
  const backgroundVideo = data.hero.backgroundVideo;
  const backgroundOpacity = data.hero.backgroundOpacity ?? 0.3;

  const { heroVideoRef, heroSectionRef, heroVideoReady, shouldLoadVideo } = useHeroVideo(backgroundVideo);

  const portfolioCarousel = useCarousel({
    totalItems: data.portfolio?.projects?.length || 0,
    itemsToShow: 3,
    mobileItemsToShow: 1,
  });

  const cardsCarousel = useCarousel({
    totalItems: data.cards?.items?.length || 0,
    itemsToShow: 3,
    mobileItemsToShow: 1,
  });

  const techCarousel = useTechCarousel({
    totalItems: data.technologies?.items?.length || 0,
    mobileItemsToShow: 4,
  });

  const partnersRef = usePartnersCarousel(data.partners?.partners || []);

  const getVisiblePortfolioItems = (isMobile: boolean = false) => {
    if (!data.portfolio?.projects) return [];
    const visible = portfolioCarousel.getVisibleItems(isMobile);
    return visible.map(({ itemIndex }) => ({
      item: data.portfolio!.projects[itemIndex],
      originalIndex: itemIndex,
    }));
  };

  const getVisibleCardsItems = (isMobile: boolean = false) => {
    if (!data.cards?.items) return [];
    const visible = cardsCarousel.getVisibleItems(isMobile);
    return visible.map(({ itemIndex }) => ({
      item: data.cards!.items[itemIndex],
      originalIndex: itemIndex,
    }));
  };

  const getVisibleTechItems = () => {
    if (!data.technologies?.items) return [];
    return techCarousel.getVisibleItems();
  };

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

  const shouldRenderSection = (sectionKey: string): boolean => {
    switch (sectionKey) {
      case "hero":
        return true;
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

  const sectionsMap: Record<string, () => React.ReactElement | null> = {
    hero: () => (
      <HeroSection
        title={data.hero.title || industryTitle}
        subtitle={data.hero.subtitle}
        description={data.hero.description}
        breadcrumbs={data.hero.breadcrumbs}
        primaryButtonText={data.hero.primaryButtonText}
        primaryButtonLink={data.hero.primaryButtonLink}
        backgroundImage={backgroundImage}
        backgroundVideo={backgroundVideo}
        backgroundOpacity={backgroundOpacity}
        heroVideoRef={heroVideoRef}
        heroVideoReady={heroVideoReady}
        shouldLoadVideo={shouldLoadVideo}
        heroSectionRef={heroSectionRef}
      />
    ),
    overview: () =>
      data.overview ? (
        <OverviewSection
          title={data.overview.title}
          paragraphs={data.overview.paragraphs}
          image={data.overview.image}
          backgroundColor={data.overview.backgroundColor}
        />
      ) : null,
    stats: () =>
      data.stats && data.stats.items && data.stats.items.length > 0 ? (
        <StatsSection items={data.stats.items} backgroundColor={data.stats.backgroundColor} />
      ) : null,
    subServices: () =>
      data.subServices &&
      data.subServices.items &&
      data.subServices.items.length > 0 ? (
        <SubServicesSection
          title={data.subServices.title}
          description={data.subServices.description}
          items={data.subServices.items}
          ctaButtonText={data.subServices.ctaButtonText}
          ctaButtonLink={data.subServices.ctaButtonLink}
          backgroundColor={data.subServices.backgroundColor}
        />
      ) : null,
    partners: () =>
      data.partners &&
      data.partners.partners &&
      data.partners.partners.length > 0 ? (
        <PartnersSection
          title={data.partners.title}
          description={data.partners.description}
          partners={data.partners.partners}
          backgroundColor={data.partners.backgroundColor}
          partnersRef={partnersRef}
        />
      ) : null,
    cards: () =>
      data.cards && data.cards.items && data.cards.items.length > 0 ? (
        <CardsSection
          title={data.cards.title}
          description={data.cards.description}
          items={data.cards.items}
          showStars={data.cards.showStars}
          backgroundColor={data.cards.backgroundColor}
          itemsToShow={3}
          mobileItemsToShow={1}
          cardsIndex={cardsCarousel.index}
          totalItems={data.cards.items.length}
          onNext={cardsCarousel.next}
          onPrev={cardsCarousel.prev}
          onTouchStart={cardsCarousel.handleTouchStart}
          onTouchMove={cardsCarousel.handleTouchMove}
          onTouchEnd={cardsCarousel.handleTouchEnd}
          getVisibleItems={getVisibleCardsItems}
          getCurrentSlideIndex={cardsCarousel.getCurrentSlideIndex}
          totalSlides={cardsCarousel.totalSlides}
        />
      ) : null,
    portfolio: () =>
      data.portfolio &&
      data.portfolio.projects &&
      data.portfolio.projects.length > 0 ? (
        <PortfolioSection
          title={data.portfolio.title}
          description={data.portfolio.description}
          projects={data.portfolio.projects}
          backgroundColor={data.portfolio.backgroundColor}
          itemsToShow={3}
          mobileItemsToShow={1}
          portfolioIndex={portfolioCarousel.index}
          totalItems={data.portfolio.projects.length}
          onNext={portfolioCarousel.next}
          onPrev={portfolioCarousel.prev}
          onTouchStart={portfolioCarousel.handleTouchStart}
          onTouchMove={portfolioCarousel.handleTouchMove}
          onTouchEnd={portfolioCarousel.handleTouchEnd}
          getVisibleItems={getVisiblePortfolioItems}
          getCurrentSlideIndex={portfolioCarousel.getCurrentSlideIndex}
          totalSlides={portfolioCarousel.totalSlides}
        />
      ) : null,
    technologies: () =>
      data.technologies &&
      data.technologies.items &&
      data.technologies.items.length > 0 ? (
        <TechnologiesSection
          title={data.technologies.title}
          description={data.technologies.description}
          items={data.technologies.items}
          backgroundColor={data.technologies.backgroundColor}
          mobileItemsToShow={4}
          techIndex={techCarousel.index}
          totalItems={data.technologies.items.length}
          onNext={techCarousel.next}
          onPrev={techCarousel.prev}
          onTouchStart={techCarousel.handleTouchStart}
          onTouchMove={techCarousel.handleTouchMove}
          onTouchEnd={techCarousel.handleTouchEnd}
          getVisibleItems={techCarousel.getVisibleItems}
          getCurrentSlideIndex={techCarousel.getCurrentSlideIndex}
          totalSlides={techCarousel.totalSlides}
        />
      ) : null,
  };

  return (
    <div className="min-h-screen">
      {sectionOrder
        .filter((key) => shouldRenderSection(key))
        .map((sectionKey) => {
          const renderFn = sectionsMap[sectionKey];
          return renderFn ? <Fragment key={sectionKey}>{renderFn()}</Fragment> : null;
        })}
    </div>
  );
}
