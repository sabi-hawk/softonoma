export interface IndustryTemplateData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    backgroundOpacity?: number;
  };
  overview: {
    title: string;
    description: string;
    image?: string;
  };
  solutions: {
    title: string;
    description: string;
    items: Array<{
      icon?: string;
      title: string;
      description: string;
    }>;
  };
  challenges: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  technologies?: {
    title: string;
    description: string;
    items: Array<{
      name: string;
      icon?: string;
    }>;
  };
  benefits?: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  caseStudies: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      result?: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export const defaultIndustryTemplateData: IndustryTemplateData = {
  hero: {
    title: "",
    subtitle: "",
    description: "",
    primaryButtonText: "Get Started",
    primaryButtonLink: "/contact",
    secondaryButtonText: "Learn More",
    secondaryButtonLink: "#overview",
    backgroundImage: "",
    backgroundVideo: "",
    backgroundOpacity: 0.3,
  },
  overview: {
    title: "Industry Overview",
    description:
      "Learn more about our expertise in this industry and how we help businesses succeed.",
    image: "",
  },
  solutions: {
    title: "Our Solutions",
    description: "Tailored solutions for your industry",
    items: [
      {
        title: "Solution 1",
        description: "Description of solution 1",
      },
      {
        title: "Solution 2",
        description: "Description of solution 2",
      },
      {
        title: "Solution 3",
        description: "Description of solution 3",
      },
    ],
  },
  challenges: {
    title: "Industry Challenges",
    description: "Common challenges we help solve",
    items: [
      {
        title: "Challenge 1",
        description: "Description of challenge 1",
      },
      {
        title: "Challenge 2",
        description: "Description of challenge 2",
      },
    ],
  },
  technologies: {
    title: "Technologies & Tools",
    description: "Technologies we use for this industry",
    items: [
      {
        name: "Technology 1",
        icon: "🚀",
      },
      {
        name: "Technology 2",
        icon: "⚡",
      },
    ],
  },
  benefits: {
    title: "Benefits",
    description: "Why work with us for this industry",
    items: [
      {
        title: "Industry Expertise",
        description:
          "Deep understanding of industry-specific challenges and opportunities.",
      },
      {
        title: "Proven Results",
        description:
          "Track record of successful implementations in this industry.",
      },
    ],
  },
  caseStudies: {
    title: "Success Stories",
    description: "Real results from our clients",
    items: [
      {
        title: "Case Study 1",
        description: "Description of case study 1",
        result: "Result achieved",
      },
      {
        title: "Case Study 2",
        description: "Description of case study 2",
        result: "Result achieved",
      },
    ],
  },
  cta: {
    title: "Ready to Transform Your Industry?",
    description: "Let's discuss how we can help your business succeed.",
    buttonText: "Contact Us",
    buttonLink: "/contact",
  },
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
      },
      solutions: {
        ...defaultIndustryTemplateData.solutions,
        ...(parsed.solutions || {}),
        items:
          parsed.solutions?.items ||
          defaultIndustryTemplateData.solutions.items,
      },
      challenges: {
        ...defaultIndustryTemplateData.challenges,
        ...(parsed.challenges || {}),
        items:
          parsed.challenges?.items ||
          defaultIndustryTemplateData.challenges.items,
      },
      technologies: parsed.technologies
        ? {
            ...(defaultIndustryTemplateData.technologies || {
              title: "",
              description: "",
              items: [],
            }),
            ...parsed.technologies,
            items:
              parsed.technologies.items ||
              defaultIndustryTemplateData.technologies?.items ||
              [],
          }
        : defaultIndustryTemplateData.technologies || {
            title: "",
            description: "",
            items: [],
          },
      benefits: parsed.benefits
        ? {
            ...(defaultIndustryTemplateData.benefits || {
              title: "",
              description: "",
              items: [],
            }),
            ...parsed.benefits,
            items:
              parsed.benefits.items ||
              defaultIndustryTemplateData.benefits?.items ||
              [],
          }
        : defaultIndustryTemplateData.benefits || {
            title: "",
            description: "",
            items: [],
          },
      caseStudies: {
        ...defaultIndustryTemplateData.caseStudies,
        ...(parsed.caseStudies || {}),
        items:
          parsed.caseStudies?.items ||
          defaultIndustryTemplateData.caseStudies.items,
      },
      cta: { ...defaultIndustryTemplateData.cta, ...(parsed.cta || {}) },
    };
    return merged;
  } catch (error) {
    console.error("Error parsing industry template data:", error);
    console.error("Content that failed to parse:", content?.substring(0, 200));
    return null;
  }
}

export function getDefaultIndustryTemplateForTitle(
  title: string
): IndustryTemplateData {
  return {
    hero: {
      title: title,
      subtitle: `Expert Solutions for ${title}`,
      description: `We provide specialized solutions tailored to the unique needs of the ${title.toLowerCase()} industry.`,
      primaryButtonText: "Get Started",
      primaryButtonLink: "/contact",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "#overview",
      backgroundImage: "",
      backgroundVideo: "",
      backgroundOpacity: 0.3,
    },
    overview: {
      title: `About ${title} Industry`,
      description: `The ${title.toLowerCase()} industry faces unique challenges and opportunities. Our team brings deep expertise and innovative solutions to help businesses in this sector thrive and grow.`,
      image: "",
    },
    solutions: {
      title: "Our Solutions",
      description: "Tailored solutions for your industry",
      items: [
        {
          title: "Custom Solutions",
          description: `Specialized solutions designed specifically for the ${title.toLowerCase()} industry.`,
        },
        {
          title: "Industry Expertise",
          description:
            "Deep understanding of industry-specific challenges and opportunities.",
        },
        {
          title: "Proven Results",
          description:
            "Track record of successful implementations and satisfied clients.",
        },
      ],
    },
    challenges: {
      title: "Industry Challenges",
      description: "Common challenges we help solve",
      items: [
        {
          title: "Digital Transformation",
          description:
            "Navigating the complexities of digital transformation in your industry.",
        },
        {
          title: "Efficiency & Optimization",
          description:
            "Streamlining operations and improving efficiency across your organization.",
        },
      ],
    },
    technologies: {
      title: "Technologies & Tools",
      description: "Technologies we use for this industry",
      items: [
        { name: "Cloud Solutions", icon: "☁️" },
        { name: "Data Analytics", icon: "📊" },
        { name: "Automation", icon: "⚙️" },
        { name: "Security", icon: "🔒" },
      ],
    },
    benefits: {
      title: "Benefits",
      description: "Why work with us for this industry",
      items: [
        {
          title: "Industry Expertise",
          description: `Deep understanding of ${title.toLowerCase()} industry challenges and opportunities.`,
        },
        {
          title: "Customized Solutions",
          description:
            "Tailored solutions designed specifically for your industry needs.",
        },
        {
          title: "Proven Track Record",
          description:
            "Successful implementations and satisfied clients in this industry.",
        },
      ],
    },
    caseStudies: {
      title: "Success Stories",
      description: "Real results from our clients",
      items: [
        {
          title: "Client Success Story",
          description: `How we helped a ${title.toLowerCase()} company achieve their goals.`,
          result: "Significant improvement in key metrics",
        },
      ],
    },
    cta: {
      title: "Ready to Transform Your Industry?",
      description: `Let's discuss how we can help your ${title.toLowerCase()} business succeed.`,
      buttonText: "Contact Us",
      buttonLink: "/contact",
    },
  };
}
