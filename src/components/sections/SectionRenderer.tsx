import { ISection } from "@/models/Section";
import dynamic from "next/dynamic";
import HeroSection from "./HeroSection";

// Lazy load section components (HeroSection is static for LCP)
const ServicesSection = dynamic(() => import("./ServicesSection"));
const StatsSection = dynamic(() => import("./StatsSection"));
const IndustriesSection = dynamic(() => import("./IndustriesSection"));
const AboutSection = dynamic(() => import("./AboutSection"));
const PartnershipsSection = dynamic(() => import("./PartnershipsSection"));
const CTASection = dynamic(() => import("./CTASection"));
const FeaturesSection = dynamic(() => import("./FeaturesSection"));
const CardsSection = dynamic(() => import("./CardsSection"));
const PortfolioSection = dynamic(() => import("./PortfolioSection"));
const TechnologiesSection = dynamic(() => import("./TechnologiesSection"));
const BlogSection = dynamic(() => import("./BlogSection"));
const ProcessSection = dynamic(() => import("./ProcessSection"));
const FAQSection = dynamic(() => import("./FAQSection"));
const PartnersSection = dynamic(() => import("./PartnersSection"));

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
