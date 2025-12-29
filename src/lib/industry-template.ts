export interface IndustryTemplateData {
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
  technologies?: {
    title: string;
    description: string;
    items: Array<{
      name: string;
      icon?: string;
    }>;
    isActive?: boolean;
  };
  sectionOrder?: string[]; // Array of section keys to control order
}

export const defaultIndustryTemplateData: IndustryTemplateData = {
  hero: {
    title: "",
    description: "",
    primaryButtonText: "Get Started",
    primaryButtonLink: "/contact",
    backgroundImage: "",
    backgroundVideo: "",
    backgroundOpacity: 0.3,
  },
  overview: {
    title: "Industry Overview",
    paragraphs: [
      {
        text: "Learn more about our expertise in this industry and how we help businesses succeed.",
      },
    ],
    image: "",
    isActive: true,
  },
  stats: {
    items: [
      {
        icon: "👥",
        value: "400+",
        label: "Software Developers",
      },
      {
        icon: "📅",
        value: "13+",
        label: "Years in Business",
      },
      {
        icon: "✅",
        value: "800+",
        label: "Projects Successfully Delivered",
      },
      {
        icon: "⭐",
        value: "4.8",
        label: "Star Rating on Clutch",
      },
    ],
    isActive: true,
  },
  subServices: {
    title: "Our Solutions",
    description: "Tailored solutions for your industry",
    items: [
      {
        icon: "⚡",
        title: "Solution 1",
        description: "Description of solution 1",
      },
      {
        icon: "🖥️",
        title: "Solution 2",
        description: "Description of solution 2",
      },
      {
        icon: "💬",
        title: "Solution 3",
        description: "Description of solution 3",
      },
    ],
    ctaButtonText: "Reach Out to Our Specialists",
    ctaButtonLink: "/contact",
    isActive: true,
  },
  partners: {
    title: "Our Partners",
    description: "Trusted by leading companies worldwide",
    partners: [
      { name: "Partner 1", logo: "🚀" },
      { name: "Partner 2", logo: "⚡" },
    ],
    isActive: true,
  },
  cards: {
    title: "What Our Clients Say",
    description: "Testimonials from satisfied customers",
    showStars: true,
    items: [
      {
        quote: "Great service and excellent results!",
        author: "John Doe",
        role: "CEO",
        company: "Company Inc.",
      },
    ],
    isActive: true,
  },
  portfolio: {
    title: "Our Portfolio",
    projects: [
      {
        title: "Project 1",
        description: "Description of project 1",
        category: "Industry Solutions",
        link: "#",
        technologies: ["React", "Node.js"],
      },
    ],
    isActive: true,
  },
  technologies: {
    title: "Technologies & Tools",
    description: "Technologies we use for this industry",
    items: [
      { name: "Technology 1", icon: "🚀" },
      { name: "Technology 2", icon: "⚡" },
    ],
    isActive: true,
  },
  sectionOrder: [
    "hero",
    "overview",
    "stats",
    "subServices",
    "partners",
    "cards",
    "portfolio",
    "technologies",
  ],
};

export function parseIndustryTemplateData(
  content: string
): IndustryTemplateData | null {
  if (!content || content.trim() === "") return null;
  try {
    const parsed = JSON.parse(content);
    // Merge with defaults to ensure all fields exist
    const merged = {
      ...defaultIndustryTemplateData,
      ...parsed,
      hero: { ...defaultIndustryTemplateData.hero, ...(parsed.hero || {}) },
      overview: {
        ...defaultIndustryTemplateData.overview,
        ...(parsed.overview || {}),
        paragraphs:
          parsed.overview?.paragraphs ||
          defaultIndustryTemplateData.overview.paragraphs,
      },
      stats: parsed.stats
        ? {
            ...defaultIndustryTemplateData.stats,
            ...parsed.stats,
            items:
              parsed.stats.items ||
              defaultIndustryTemplateData.stats?.items ||
              [],
          }
        : defaultIndustryTemplateData.stats,
      subServices: parsed.subServices
        ? {
            ...defaultIndustryTemplateData.subServices,
            ...parsed.subServices,
            items:
              parsed.subServices.items ||
              defaultIndustryTemplateData.subServices?.items ||
              [],
          }
        : defaultIndustryTemplateData.subServices,
      partners: parsed.partners
        ? {
            ...defaultIndustryTemplateData.partners,
            ...parsed.partners,
            partners:
              parsed.partners.partners ||
              defaultIndustryTemplateData.partners?.partners ||
              [],
          }
        : defaultIndustryTemplateData.partners,
      cards: parsed.cards
        ? {
            ...defaultIndustryTemplateData.cards,
            ...parsed.cards,
            items:
              parsed.cards.items ||
              defaultIndustryTemplateData.cards?.items ||
              [],
          }
        : defaultIndustryTemplateData.cards,
      portfolio: parsed.portfolio
        ? {
            ...defaultIndustryTemplateData.portfolio,
            ...parsed.portfolio,
            projects:
              parsed.portfolio.projects ||
              defaultIndustryTemplateData.portfolio?.projects ||
              [],
          }
        : defaultIndustryTemplateData.portfolio,
      technologies: parsed.technologies
        ? {
            ...defaultIndustryTemplateData.technologies,
            ...parsed.technologies,
            items:
              parsed.technologies.items ||
              defaultIndustryTemplateData.technologies?.items ||
              [],
          }
        : defaultIndustryTemplateData.technologies,
      sectionOrder:
        parsed.sectionOrder && Array.isArray(parsed.sectionOrder)
          ? parsed.sectionOrder
          : defaultIndustryTemplateData.sectionOrder || [
              "hero",
              "overview",
              "stats",
              "subServices",
              "partners",
              "cards",
              "portfolio",
              "technologies",
            ],
    };
    return merged;
  } catch (error) {
    console.error("Error parsing industry template data:", error);
    console.error("Content that failed to parse:", content?.substring(0, 200));
    return null;
  }
}

// Industry-specific content templates
import { IndustryContentTemplate } from "./industry-templates/types";
import { getFintechTemplate } from "./industry-templates/fintech";
import { getMedicalTemplate } from "./industry-templates/medical";
import { getEcommerceTemplate } from "./industry-templates/ecommerce";
import { getEducationTemplate } from "./industry-templates/education";
import { getRealEstateTemplate } from "./industry-templates/real-estate";
import { getManufacturingTemplate } from "./industry-templates/manufacturing";
import { getGenericIndustryTemplate } from "./industry-templates/generic";

function detectIndustryType(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (
    lowerTitle.includes("fintech") ||
    lowerTitle.includes("financial") ||
    lowerTitle.includes("banking") ||
    lowerTitle.includes("finance")
  ) {
    return "fintech";
  }
  if (
    lowerTitle.includes("medical") ||
    lowerTitle.includes("healthcare") ||
    lowerTitle.includes("health") ||
    lowerTitle.includes("hospital")
  ) {
    return "medical";
  }
  if (
    lowerTitle.includes("ecommerce") ||
    lowerTitle.includes("e-commerce") ||
    lowerTitle.includes("retail") ||
    lowerTitle.includes("shopping")
  ) {
    return "ecommerce";
  }
  if (
    lowerTitle.includes("education") ||
    lowerTitle.includes("edtech") ||
    lowerTitle.includes("learning") ||
    lowerTitle.includes("school")
  ) {
    return "education";
  }
  if (
    lowerTitle.includes("real estate") ||
    lowerTitle.includes("realestate") ||
    lowerTitle.includes("property") ||
    lowerTitle.includes("realtor")
  ) {
    return "real-estate";
  }
  if (
    lowerTitle.includes("manufacturing") ||
    lowerTitle.includes("industrial") ||
    lowerTitle.includes("factory") ||
    lowerTitle.includes("production")
  ) {
    return "manufacturing";
  }

  return "generic";
}

function getIndustryContentTemplate(
  industryType: string,
  title: string
): IndustryContentTemplate {
  switch (industryType) {
    case "fintech":
      return getFintechTemplate(title);
    case "medical":
      return getMedicalTemplate(title);
    case "ecommerce":
      return getEcommerceTemplate(title);
    case "education":
      return getEducationTemplate(title);
    case "real-estate":
      return getRealEstateTemplate(title);
    case "manufacturing":
      return getManufacturingTemplate(title);
    default:
      return getGenericIndustryTemplate(title);
  }
}

export function getDefaultIndustryTemplateForTitle(
  title: string
): IndustryTemplateData {
  const industryType = detectIndustryType(title);
  const template = getIndustryContentTemplate(industryType, title);

  return {
    hero: {
      title: template.hero.title,
      description: template.hero.description,
      primaryButtonText: template.hero.primaryButtonText,
      primaryButtonLink: "/contact",
      backgroundImage: "",
      backgroundVideo: "",
      backgroundOpacity: 0.3,
    },
    overview: {
      title: template.overview.title,
      paragraphs: template.overview.paragraphs.map((text) => ({ text })),
      image: template.overview.image,
      isActive: true,
    },
    stats: {
      items: template.stats,
      isActive: true,
    },
    subServices: {
      title: "Our Solutions",
      description: "Tailored solutions for your industry",
      items: template.subServices,
      ctaButtonText: "Reach Out to Our Specialists",
      ctaButtonLink: "/contact",
      isActive: true,
    },
    partners: {
      title: "Our Partners",
      description: "Trusted by leading companies worldwide",
      partners: template.partners,
      isActive: true,
    },
    cards: {
      title: "What Our Clients Say",
      description: "Testimonials from satisfied customers",
      showStars: true,
      items: template.cards,
      isActive: true,
    },
    portfolio: {
      title: "Our Portfolio",
      projects: [
        {
          title: `${title} Success Story`,
          description: `How we helped a ${title.toLowerCase()} company achieve their goals.`,
          category: "Industry Solutions",
          link: "#",
          technologies: ["React", "Node.js"],
        },
      ],
      isActive: true,
    },
    technologies: {
      title: "Technologies & Tools",
      description: "Technologies we use for this industry",
      items: template.technologies,
      isActive: true,
    },
    sectionOrder: [
      "hero",
      "overview",
      "stats",
      "subServices",
      "partners",
      "cards",
      "portfolio",
      "technologies",
    ],
  };
}
