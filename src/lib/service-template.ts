import { ServiceTemplateData } from "@/components/ServiceTemplate";

export const defaultServiceTemplateData: ServiceTemplateData = {
  hero: {
    breadcrumbs: "Home > Services",
    title: "",
    description: "",
    primaryButtonText: "Let's discuss your needs",
    primaryButtonLink: "/contact",
    backgroundImage: "",
    backgroundVideo: "",
    backgroundOpacity: 0.3,
  },
  overview: {
    title: "Machine Learning & AI Development Services",
    paragraphs: [
      {
        text: "Saigon Technology, headquartered in Ho Chi Minh City, Vietnam, and with representative offices in Singapore and the United States, provides a broad range of qualified technical expertise in machine learning, deep learning, computer vision, classification tools, data analytics, natural language processing, and other areas.",
      },
      {
        text: "If you're looking for an AI development firm, we've got a team of data scientists, machine learning engineers, and software developers that are well versed in cutting-edge AI (Artificial Intelligence), ML (Machine Learning), and Big Data tool-sets to help you solve your business challenges.",
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
    title: "Our AI Development Services",
    items: [
      {
        icon: "⚡",
        title: "Machine Learning",
        description: "Use Machine Learning to build cognitive technology frameworks that will help you",
      },
      {
        icon: "🖥️",
        title: "Computer Vision",
        description: "With computer vision development services, we assist companies in improving the",
      },
      {
        icon: "💬",
        title: "Natural Language Processing (NLP)",
        description: "With our NLP software solutions, you may teach computers to grasp and interpret data",
      },
      {
        icon: "📱",
        title: "Image Recognition",
        description: "With computer vision capabilities for picture recognition and object identification, custom",
      },
      {
        icon: "🤖",
        title: "AI Assisted Chatbot Development",
        description: "Our AI chatbot creation services may help you improve your customer service by",
      },
      {
        icon: "📊",
        title: "AI and Business Intelligence",
        description: "Deep knowledge in the creation of Artificial Intelligence software employing advanced",
      },
    ],
    ctaButtonText: "Reach Out to Our Specialists",
    ctaButtonLink: "/contact",
    isActive: true,
  },
  whyChooseUs: {
    title: "Why Choose Saigon Technology?",
    subtitle: "Choose us for your AI development needs. Here's why we stand out.",
    items: [
      {
        text: "Pioneering AI Solutions",
      },
      {
        text: "Driving Innovation and Talent Development",
      },
      {
        text: "Global Expertise and ISO-Certified Excellence",
      },
    ],
    image: "",
    certifications: [],
    isActive: true,
  },
  technologies: {
    title: "Technologies & Tools",
    description: "Technologies we use to deliver results",
    items: [
      { name: "Technology 1", icon: "🚀" },
      { name: "Technology 2", icon: "⚡" },
    ],
    isActive: true,
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
    isActive: true,
  },
  portfolio: {
    title: "Our Portfolio",
    projects: [
      {
        title: "Project 1",
        description: "Description of project 1",
        category: "AI and ML",
        link: "#",
        technologies: ["React", "Node.js"],
      },
    ],
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
  faq: {
    title: "FAQs",
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
    isActive: true,
  },
  cta: {
    title: "Ready to Get Started?",
    description: "Let's discuss how we can help your business grow.",
    buttonText: "Contact Us",
    buttonLink: "/contact",
    isActive: true,
  },
  sectionOrder: [
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
  ],
};

export function parseServiceTemplateData(
  content: string
): ServiceTemplateData | null {
  if (!content || content.trim() === "") return null;
  try {
    const parsed = JSON.parse(content);
    // Merge with defaults to ensure all fields exist
    const merged: ServiceTemplateData = {
      hero: {
        ...defaultServiceTemplateData.hero,
        ...(parsed.hero || {}),
      },
      overview: {
        ...defaultServiceTemplateData.overview,
        ...(parsed.overview || {}),
        paragraphs:
          parsed.overview?.paragraphs ||
          defaultServiceTemplateData.overview.paragraphs,
      },
      stats: parsed.stats
        ? {
            ...defaultServiceTemplateData.stats,
            ...parsed.stats,
            items: parsed.stats.items || defaultServiceTemplateData.stats?.items || [],
          }
        : defaultServiceTemplateData.stats,
      subServices: parsed.subServices
        ? {
            ...defaultServiceTemplateData.subServices,
            ...parsed.subServices,
            items:
              parsed.subServices.items ||
              defaultServiceTemplateData.subServices?.items ||
              [],
          }
        : defaultServiceTemplateData.subServices,
      whyChooseUs: parsed.whyChooseUs
        ? {
            ...defaultServiceTemplateData.whyChooseUs,
            ...parsed.whyChooseUs,
            items:
              parsed.whyChooseUs.items ||
              defaultServiceTemplateData.whyChooseUs?.items ||
              [],
            certifications:
              parsed.whyChooseUs.certifications ||
              defaultServiceTemplateData.whyChooseUs?.certifications ||
              [],
          }
        : defaultServiceTemplateData.whyChooseUs,
      technologies: parsed.technologies
        ? {
            ...defaultServiceTemplateData.technologies,
            ...parsed.technologies,
            items:
              parsed.technologies.items ||
              defaultServiceTemplateData.technologies?.items ||
              [],
          }
        : defaultServiceTemplateData.technologies,
      process: parsed.process
        ? {
            ...defaultServiceTemplateData.process,
            ...parsed.process,
            steps:
              parsed.process.steps || defaultServiceTemplateData.process?.steps || [],
          }
        : defaultServiceTemplateData.process,
      portfolio: parsed.portfolio
        ? {
            ...defaultServiceTemplateData.portfolio,
            ...parsed.portfolio,
            projects:
              parsed.portfolio.projects ||
              defaultServiceTemplateData.portfolio?.projects ||
              [],
          }
        : defaultServiceTemplateData.portfolio,
      partners: parsed.partners
        ? {
            ...defaultServiceTemplateData.partners,
            ...parsed.partners,
            partners:
              parsed.partners.partners ||
              defaultServiceTemplateData.partners?.partners ||
              [],
          }
        : defaultServiceTemplateData.partners,
      cards: parsed.cards
        ? {
            ...defaultServiceTemplateData.cards,
            ...parsed.cards,
            items:
              parsed.cards.items || defaultServiceTemplateData.cards?.items || [],
          }
        : defaultServiceTemplateData.cards,
      faq: parsed.faq
        ? {
            ...defaultServiceTemplateData.faq,
            ...parsed.faq,
            items: parsed.faq.items || defaultServiceTemplateData.faq?.items || [],
          }
        : defaultServiceTemplateData.faq,
      cta: parsed.cta
        ? { ...defaultServiceTemplateData.cta, ...parsed.cta }
        : defaultServiceTemplateData.cta,
      sectionOrder:
        parsed.sectionOrder && Array.isArray(parsed.sectionOrder)
          ? parsed.sectionOrder
          : defaultServiceTemplateData.sectionOrder || [
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
            ],
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
      breadcrumbs: `Home > Services > ${title}`,
      title: title,
      description: `We provide comprehensive ${title.toLowerCase()} solutions tailored to your business needs.`,
      primaryButtonText: "Let's discuss your needs",
      primaryButtonLink: "/contact",
      backgroundImage: "",
      backgroundVideo: "",
      backgroundOpacity: 0.3,
    },
    overview: {
      title: `${title} Services`,
      paragraphs: [
        {
          text: `Our ${title.toLowerCase()} services are designed to help businesses achieve their goals through innovative solutions and expert guidance. We combine industry best practices with cutting-edge technology to deliver results that matter.`,
        },
        {
          text: `If you're looking for a ${title.toLowerCase()} development firm, we've got a team of experienced professionals that are well versed in cutting-edge technologies and methodologies to help you solve your business challenges.`,
        },
      ],
      image: "",
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
    },
    subServices: {
      title: `Our ${title} Services`,
      items: [
        {
          icon: "🚀",
          title: "Service 1",
          description: `Description of ${title.toLowerCase()} service 1`,
        },
        {
          icon: "⚡",
          title: "Service 2",
          description: `Description of ${title.toLowerCase()} service 2`,
        },
        {
          icon: "💡",
          title: "Service 3",
          description: `Description of ${title.toLowerCase()} service 3`,
        },
      ],
      ctaButtonText: "Reach Out to Our Specialists",
      ctaButtonLink: "/contact",
    },
    whyChooseUs: {
      title: "Why Choose Us?",
      subtitle: `Choose us for your ${title.toLowerCase()} needs. Here's why we stand out.`,
      items: [
        {
          text: "Expert Team",
        },
        {
          text: "Proven Track Record",
        },
        {
          text: "Custom Solutions",
        },
      ],
      image: "",
      certifications: [],
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
    portfolio: {
      title: "Our Portfolio",
      projects: [
        {
          title: "Client Success Story",
          description: `How we helped a client achieve their goals with ${title.toLowerCase()} services.`,
          category: "Success",
          link: "#",
          technologies: ["React", "Node.js"],
        },
      ],
    },
    partners: {
      title: "Our Partners",
      description: "Trusted by leading companies worldwide",
      partners: [
        { name: "Partner 1", logo: "🚀" },
        { name: "Partner 2", logo: "⚡" },
        { name: "Partner 3", logo: "💼" },
        { name: "Partner 4", logo: "🌟" },
      ],
    },
    cards: {
      title: "What Our Clients Say",
      description: "Testimonials from satisfied customers",
      showStars: true,
      items: [
        {
          quote: `"Working with this team on our ${title.toLowerCase()} project was an excellent experience. They delivered exactly what we needed."`,
          author: "John Doe",
          role: "CEO",
          company: "Company Inc.",
        },
        {
          quote: `"The ${title.toLowerCase()} services exceeded our expectations. Highly recommended!"`,
          author: "Jane Smith",
          role: "CTO",
          company: "Tech Corp",
        },
        {
          quote: `"Professional, reliable, and results-driven. Our ${title.toLowerCase()} project was a success."`,
          author: "Mike Johnson",
          role: "Director",
          company: "Business Solutions",
        },
      ],
    },
    faq: {
      title: "FAQs",
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
    sectionOrder: [
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
    ],
  };
}
