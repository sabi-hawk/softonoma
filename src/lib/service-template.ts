import { ServiceTemplateData } from "@/components/ServiceTemplate";

export const defaultServiceTemplateData: ServiceTemplateData = {
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
    title: "Service Overview",
    description:
      "Learn more about our comprehensive service offerings and how we can help your business achieve its goals.",
    image: "",
  },
  features: {
    title: "Key Features",
    description: "Discover what makes our service stand out",
    items: [
      {
        title: "Feature 1",
        description: "Description of feature 1",
      },
      {
        title: "Feature 2",
        description: "Description of feature 2",
      },
      {
        title: "Feature 3",
        description: "Description of feature 3",
      },
    ],
  },
  process: {
    title: "Our Process",
    description: "How we deliver results",
    steps: [
      {
        number: "1",
        title: "Step 1",
        description: "Description of step 1",
      },
      {
        number: "2",
        title: "Step 2",
        description: "Description of step 2",
      },
      {
        number: "3",
        title: "Step 3",
        description: "Description of step 3",
      },
      {
        number: "4",
        title: "Step 4",
        description: "Description of step 4",
      },
    ],
  },
  benefits: {
    title: "Benefits",
    description: "Why choose our service",
    items: [
      {
        title: "Benefit 1",
        description: "Description of benefit 1",
      },
      {
        title: "Benefit 2",
        description: "Description of benefit 2",
      },
    ],
  },
  useCases: {
    title: "Use Cases",
    description: "When and where to use our service",
    items: [
      {
        title: "Use Case 1",
        description: "Description of use case 1",
      },
      {
        title: "Use Case 2",
        description: "Description of use case 2",
      },
    ],
  },
  technologies: {
    title: "Technologies & Tools",
    description: "Technologies we use to deliver results",
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
  caseStudies: {
    title: "Case Studies",
    description: "Real examples of our work",
    items: [
      {
        title: "Case Study 1",
        description: "Description of case study 1",
        result: "Result achieved",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    description: "Common questions about our service",
    items: [
      {
        question: "Question 1?",
        answer: "Answer to question 1",
      },
      {
        question: "Question 2?",
        answer: "Answer to question 2",
      },
    ],
  },
  cta: {
    title: "Ready to Get Started?",
    description: "Let's discuss how we can help your business grow.",
    buttonText: "Contact Us",
    buttonLink: "/contact",
  },
};

export function parseServiceTemplateData(
  content: string
): ServiceTemplateData | null {
  if (!content || content.trim() === "") return null;
  try {
    const parsed = JSON.parse(content);
    // Merge with defaults to ensure all fields exist
    const merged = {
      ...defaultServiceTemplateData,
      ...parsed,
      hero: { ...defaultServiceTemplateData.hero, ...(parsed.hero || {}) },
      overview: {
        ...defaultServiceTemplateData.overview,
        ...(parsed.overview || {}),
      },
      features: {
        ...defaultServiceTemplateData.features,
        ...(parsed.features || {}),
        items:
          parsed.features?.items || defaultServiceTemplateData.features.items,
      },
      process: {
        ...defaultServiceTemplateData.process,
        ...(parsed.process || {}),
        steps:
          parsed.process?.steps || defaultServiceTemplateData.process.steps,
      },
      benefits: {
        ...defaultServiceTemplateData.benefits,
        ...(parsed.benefits || {}),
        items:
          parsed.benefits?.items || defaultServiceTemplateData.benefits.items,
      },
      useCases: parsed.useCases
        ? {
            ...(defaultServiceTemplateData.useCases || {
              title: "",
              description: "",
              items: [],
            }),
            ...parsed.useCases,
            items:
              parsed.useCases.items ||
              defaultServiceTemplateData.useCases?.items ||
              [],
          }
        : defaultServiceTemplateData.useCases || {
            title: "",
            description: "",
            items: [],
          },
      technologies: parsed.technologies
        ? {
            ...(defaultServiceTemplateData.technologies || {
              title: "",
              description: "",
              items: [],
            }),
            ...parsed.technologies,
            items:
              parsed.technologies.items ||
              defaultServiceTemplateData.technologies?.items ||
              [],
          }
        : defaultServiceTemplateData.technologies || {
            title: "",
            description: "",
            items: [],
          },
      caseStudies: parsed.caseStudies
        ? {
            ...(defaultServiceTemplateData.caseStudies || {
              title: "",
              description: "",
              items: [],
            }),
            ...parsed.caseStudies,
            items:
              parsed.caseStudies.items ||
              defaultServiceTemplateData.caseStudies?.items ||
              [],
          }
        : defaultServiceTemplateData.caseStudies || {
            title: "",
            description: "",
            items: [],
          },
      faq: parsed.faq
        ? {
            ...(defaultServiceTemplateData.faq || {
              title: "",
              description: "",
              items: [],
            }),
            ...parsed.faq,
            items:
              parsed.faq.items || defaultServiceTemplateData.faq?.items || [],
          }
        : defaultServiceTemplateData.faq || {
            title: "",
            description: "",
            items: [],
          },
      cta: { ...defaultServiceTemplateData.cta, ...(parsed.cta || {}) },
    };
    return merged;
  } catch (error) {
    console.error("Error parsing service template data:", error);
    console.error("Content that failed to parse:", content?.substring(0, 200));
    return null;
  }
}

export function getDefaultServiceTemplateForTitle(
  title: string
): ServiceTemplateData {
  return {
    hero: {
      title: title,
      subtitle: `Professional ${title} Services`,
      description: `We provide comprehensive ${title.toLowerCase()} solutions tailored to your business needs.`,
      primaryButtonText: "Get Started",
      primaryButtonLink: "/contact",
      secondaryButtonText: "Learn More",
      secondaryButtonLink: "#overview",
      backgroundImage: "",
      backgroundVideo: "",
      backgroundOpacity: 0.3,
    },
    overview: {
      title: `About Our ${title} Services`,
      description: `Our ${title.toLowerCase()} services are designed to help businesses achieve their goals through innovative solutions and expert guidance. We combine industry best practices with cutting-edge technology to deliver results that matter.`,
      image: "",
    },
    features: {
      title: "Key Features",
      description: "Discover what makes our services stand out",
      items: [
        {
          title: "Expert Team",
          description: `Our experienced professionals specialize in ${title.toLowerCase()} and bring years of industry expertise.`,
        },
        {
          title: "Custom Solutions",
          description:
            "We tailor our services to meet your specific business requirements and objectives.",
        },
        {
          title: "Proven Results",
          description:
            "Track record of successful projects and satisfied clients across various industries.",
        },
      ],
    },
    process: {
      title: "Our Process",
      description: "How we deliver results",
      steps: [
        {
          number: "1",
          title: "Consultation",
          description: "We start by understanding your needs and goals.",
        },
        {
          number: "2",
          title: "Planning",
          description:
            "We create a customized plan tailored to your requirements.",
        },
        {
          number: "3",
          title: "Execution",
          description: "We implement the solution with precision and care.",
        },
        {
          number: "4",
          title: "Support",
          description: "We provide ongoing support to ensure your success.",
        },
      ],
    },
    benefits: {
      title: "Benefits",
      description: "Why choose our service",
      items: [
        {
          title: "Increased Efficiency",
          description: "Streamline your operations and improve productivity.",
        },
        {
          title: "Cost Savings",
          description: "Reduce costs while improving quality and performance.",
        },
      ],
    },
    useCases: {
      title: "Use Cases",
      description: "When and where to use our service",
      items: [
        {
          title: "Business Growth",
          description: `Perfect for businesses looking to scale and grow with ${title.toLowerCase()} solutions.`,
        },
        {
          title: "Digital Transformation",
          description:
            "Ideal for companies undergoing digital transformation initiatives.",
        },
      ],
    },
    technologies: {
      title: "Technologies & Tools",
      description: "Technologies we use to deliver results",
      items: [
        { name: "Cloud Computing", icon: "☁️" },
        { name: "AI/ML", icon: "🤖" },
        { name: "DevOps", icon: "⚙️" },
        { name: "Security", icon: "🔒" },
      ],
    },
    caseStudies: {
      title: "Case Studies",
      description: "Real examples of our work",
      items: [
        {
          title: "Client Success Story",
          description: `How we helped a client achieve their goals with ${title.toLowerCase()} services.`,
          result: "Significant improvement in key metrics",
        },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      description: "Common questions about our service",
      items: [
        {
          question: `What is ${title}?`,
          answer: `${title} is a comprehensive service that helps businesses achieve their goals through innovative solutions.`,
        },
        {
          question: "How long does it take?",
          answer:
            "The timeline depends on your specific requirements. We'll provide a detailed timeline during consultation.",
        },
      ],
    },
    cta: {
      title: "Ready to Get Started?",
      description: `Let's discuss how our ${title.toLowerCase()} services can help your business grow.`,
      buttonText: "Contact Us",
      buttonLink: "/contact",
    },
  };
}
