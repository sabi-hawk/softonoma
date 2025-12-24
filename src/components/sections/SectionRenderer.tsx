import { ISection } from "@/models/Section";
import HeroSection from "./HeroSection";
import ServicesSection from "./ServicesSection";
import StatsSection from "./StatsSection";
import IndustriesSection from "./IndustriesSection";
import AboutSection from "./AboutSection";
import PartnershipsSection from "./PartnershipsSection";
import CTASection from "./CTASection";
import FooterSection from "./FooterSection";
import FeaturesSection from "./FeaturesSection";
import CardsSection from "./CardsSection";
import PortfolioSection from "./PortfolioSection";
import TechnologiesSection from "./TechnologiesSection";
import BlogSection from "./BlogSection";
import ProcessSection from "./ProcessSection";
import FAQSection from "./FAQSection";
import PartnersSection from "./PartnersSection";

interface SectionRendererProps {
  section: ISection;
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} />;
    case "services":
      return <ServicesSection section={section} />;
    case "stats":
      return <StatsSection section={section} />;
    case "industries":
      return <IndustriesSection section={section} />;
    case "about":
      return <AboutSection section={section} />;
    case "partnerships":
      return <PartnershipsSection section={section} />;
    case "cta":
      return <CTASection section={section} />;
    case "footer":
      return <FooterSection section={section} />;
    case "features":
      return <FeaturesSection section={section} />;
    case "cards":
      return <CardsSection section={section} />;
    case "portfolio":
      return <PortfolioSection section={section} />;
    case "technologies":
      return <TechnologiesSection section={section} />;
    case "blog":
      return <BlogSection section={section} />;
    case "process":
      return <ProcessSection section={section} />;
    case "faq":
      return <FAQSection section={section} />;
    case "partners":
      return <PartnersSection section={section} />;
    default:
      return null;
  }
}
