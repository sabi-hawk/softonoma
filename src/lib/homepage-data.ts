export interface HomePageData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    backgroundImage?: string;
  };
  services: {
    title: string;
    description: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  about: {
    title: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
    }>;
    image?: string;
  };
  stats: {
    title: string;
    items: Array<{
      number: string;
      label: string;
    }>;
  };
  industries: {
    title: string;
    description: string;
    items: Array<{
      icon: string;
      name: string;
    }>;
  };
  testimonials: {
    title: string;
    description: string;
    items: Array<{
      quote: string;
      author: string;
      company: string;
      role?: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export const defaultHomePageData: HomePageData = {
  hero: {
    title: "Transform Your Business with Cutting-Edge Technology",
    subtitle: "Innovative IT Solutions",
    description:
      "We deliver world-class software development, cloud solutions, and digital transformation services to help your business thrive in the digital age.",
    primaryButtonText: "Get Started",
    primaryButtonLink: "#contact",
    secondaryButtonText: "Learn More",
    secondaryButtonLink: "#about",
  },
  services: {
    title: "Our Services",
    description:
      "Comprehensive IT solutions tailored to your business needs",
    items: [
      {
        icon: "💻",
        title: "Custom Software Development",
        description:
          "Build scalable, robust applications tailored to your specific business requirements.",
      },
      {
        icon: "☁️",
        title: "Cloud Solutions",
        description:
          "Migrate to the cloud and leverage the power of modern cloud infrastructure.",
      },
      {
        icon: "📱",
        title: "Mobile App Development",
        description:
          "Create engaging mobile experiences for iOS and Android platforms.",
      },
    ],
  },
  about: {
    title: "Why Choose Us",
    description:
      "We combine technical expertise with business acumen to deliver solutions that drive real results.",
    features: [
      {
        title: "Expert Team",
        description:
          "Our team of experienced developers and consultants bring years of industry expertise.",
      },
      {
        title: "Proven Track Record",
        description:
          "We've successfully delivered projects for clients across various industries.",
      },
      {
        title: "Agile Methodology",
        description:
          "We follow agile practices to ensure fast delivery and continuous improvement.",
      },
    ],
  },
  stats: {
    title: "Our Impact",
    items: [
      { number: "500+", label: "Projects Completed" },
      { number: "200+", label: "Happy Clients" },
      { number: "50+", label: "Team Members" },
      { number: "10+", label: "Years Experience" },
    ],
  },
  industries: {
    title: "Industries We Serve",
    description: "We provide solutions across diverse industry verticals",
    items: [
      { icon: "🏦", name: "Finance" },
      { icon: "🏥", name: "Healthcare" },
      { icon: "🛒", name: "E-Commerce" },
      { icon: "🎓", name: "Education" },
    ],
  },
  testimonials: {
    title: "What Our Clients Say",
    description: "Testimonials from satisfied clients",
    items: [
      {
        quote:
          "Outstanding service and technical expertise. They transformed our business operations.",
        author: "John Smith",
        company: "Tech Corp",
        role: "CEO",
      },
      {
        quote:
          "Professional, reliable, and results-driven. Highly recommended!",
        author: "Sarah Johnson",
        company: "Innovate Inc",
        role: "CTO",
      },
    ],
  },
  cta: {
    title: "Ready to Transform Your Business?",
    description:
      "Let's discuss how we can help you achieve your digital transformation goals.",
    buttonText: "Contact Us",
    buttonLink: "#contact",
  },
};

export function parseHomePageData(content: string): HomePageData | null {
  try {
    if (!content || content.trim() === "") {
      return defaultHomePageData;
    }
    const parsed = JSON.parse(content);
    // Validate and merge with defaults to ensure all required fields exist
    return {
      ...defaultHomePageData,
      ...parsed,
      hero: {
        ...defaultHomePageData.hero,
        ...parsed.hero,
      },
      services: {
        ...defaultHomePageData.services,
        ...parsed.services,
        items: parsed.services?.items || defaultHomePageData.services.items,
      },
      about: {
        ...defaultHomePageData.about,
        ...parsed.about,
        features: parsed.about?.features || defaultHomePageData.about.features,
      },
      stats: {
        ...defaultHomePageData.stats,
        ...parsed.stats,
        items: parsed.stats?.items || defaultHomePageData.stats.items,
      },
      industries: {
        ...defaultHomePageData.industries,
        ...parsed.industries,
        items:
          parsed.industries?.items || defaultHomePageData.industries.items,
      },
      testimonials: {
        ...defaultHomePageData.testimonials,
        ...parsed.testimonials,
        items:
          parsed.testimonials?.items ||
          defaultHomePageData.testimonials.items,
      },
      cta: {
        ...defaultHomePageData.cta,
        ...parsed.cta,
      },
    };
  } catch (error) {
    console.error("Error parsing homepage data:", error);
    return defaultHomePageData;
  }
}



