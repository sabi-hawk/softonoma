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
        description:
          "Use Machine Learning to build cognitive technology frameworks that will help you",
      },
      {
        icon: "🖥️",
        title: "Computer Vision",
        description:
          "With computer vision development services, we assist companies in improving the",
      },
      {
        icon: "💬",
        title: "Natural Language Processing (NLP)",
        description:
          "With our NLP software solutions, you may teach computers to grasp and interpret data",
      },
      {
        icon: "📱",
        title: "Image Recognition",
        description:
          "With computer vision capabilities for picture recognition and object identification, custom",
      },
      {
        icon: "🤖",
        title: "AI Assisted Chatbot Development",
        description:
          "Our AI chatbot creation services may help you improve your customer service by",
      },
      {
        icon: "📊",
        title: "AI and Business Intelligence",
        description:
          "Deep knowledge in the creation of Artificial Intelligence software employing advanced",
      },
    ],
    ctaButtonText: "Reach Out to Our Specialists",
    ctaButtonLink: "/contact",
    isActive: true,
  },
  whyChooseUs: {
    title: "Why Choose Saigon Technology?",
    subtitle:
      "Choose us for your AI development needs. Here's why we stand out.",
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
            items:
              parsed.stats.items ||
              defaultServiceTemplateData.stats?.items ||
              [],
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
              parsed.process.steps ||
              defaultServiceTemplateData.process?.steps ||
              [],
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
              parsed.cards.items ||
              defaultServiceTemplateData.cards?.items ||
              [],
          }
        : defaultServiceTemplateData.cards,
      faq: parsed.faq
        ? {
            ...defaultServiceTemplateData.faq,
            ...parsed.faq,
            items:
              parsed.faq.items || defaultServiceTemplateData.faq?.items || [],
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

// Service-specific content templates
interface ServiceContentTemplate {
  hero: {
    title: string;
    description: string;
    primaryButtonText: string;
  };
  overview: {
    title: string;
    paragraphs: string[];
  };
  stats: Array<{ icon: string; value: string; label: string }>;
  subServices: Array<{ icon: string; title: string; description: string }>;
  whyChooseUs: {
    subtitle: string;
    items: string[];
  };
  technologies: Array<{ name: string; icon: string }>;
  process: Array<{ number: string; title: string; description: string }>;
  faq: Array<{ question: string; answer: string }>;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
  }>;
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
}

function detectServiceType(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (
    lowerTitle.includes("custom software") ||
    lowerTitle.includes("software development")
  ) {
    return "custom-software";
  }
  if (lowerTitle.includes("devops") || lowerTitle.includes("dev ops")) {
    return "devops";
  }
  if (
    lowerTitle.includes("front end") ||
    lowerTitle.includes("frontend") ||
    lowerTitle.includes("front-end")
  ) {
    return "frontend";
  }
  if (
    lowerTitle.includes("back end") ||
    lowerTitle.includes("backend") ||
    lowerTitle.includes("back-end")
  ) {
    return "backend";
  }
  if (
    lowerTitle.includes("mobile app") ||
    lowerTitle.includes("mobile application")
  ) {
    return "mobile";
  }
  if (
    lowerTitle.includes("web development") ||
    lowerTitle.includes("web app")
  ) {
    return "web";
  }
  if (
    lowerTitle.includes("cloud") ||
    lowerTitle.includes("aws") ||
    lowerTitle.includes("azure")
  ) {
    return "cloud";
  }
  if (
    lowerTitle.includes("ui/ux") ||
    lowerTitle.includes("ui ") ||
    lowerTitle.includes("ux ")
  ) {
    return "uiux";
  }

  return "generic";
}

function getServiceContentTemplate(
  serviceType: string,
  title: string
): ServiceContentTemplate {
  const templates: Record<string, ServiceContentTemplate> = {
    "custom-software": {
      hero: {
        title: `${title} Tailored to Your Business Needs`,
        description:
          "Build scalable, secure, and high-performance software solutions that solve real business challenges. From strategy to deployment, we deliver custom applications designed to accelerate growth, improve efficiency, and create outstanding digital experiences.",
        primaryButtonText: "Get a Free Consultation",
      },
      overview: {
        title: "End-to-End Custom Software Development Services",
        paragraphs: [
          "We design and develop custom software solutions that align with your business goals, workflows, and future growth plans. Whether you need a powerful web application, enterprise software, mobile app, or a complex system integration, our team ensures reliability, scalability, and exceptional performance.",
          "Our development approach focuses on innovation, usability, and long-term value. We blend industry expertise with modern technologies to deliver software that enhances productivity, reduces operational costs, and transforms how you work.",
        ],
      },
      stats: [
        { icon: "👥", value: "50+", label: "Skilled Software Developers" },
        { icon: "✅", value: "120+", label: "Successful Projects Delivered" },
        {
          icon: "📅",
          value: "8+ Years",
          label: "Experience in Software Development",
        },
        { icon: "⭐", value: "95%", label: "Client Satisfaction Rate" },
      ],
      subServices: [
        {
          icon: "🌐",
          title: "Web Application Development",
          description:
            "We build secure, high-performance, and scalable web applications tailored to your business objectives.",
        },
        {
          icon: "📱",
          title: "Mobile Application Development",
          description:
            "Native, hybrid, and cross-platform mobile apps designed for performance, usability, and growth.",
        },
        {
          icon: "🏢",
          title: "Enterprise Software Solutions",
          description:
            "Custom enterprise platforms to streamline workflows, integrate systems, and enhance organizational efficiency.",
        },
        {
          icon: "☁️",
          title: "SaaS Product Development",
          description:
            "End-to-end SaaS development including architecture, UI/UX, deployment, and ongoing optimization.",
        },
        {
          icon: "🔌",
          title: "API & System Integration",
          description:
            "Seamless integration of third-party services, payment gateways, CRMs, ERPs, and business tools.",
        },
        {
          icon: "🔄",
          title: "Legacy System Modernization",
          description:
            "Upgrade outdated systems with modern technologies while preserving core business operations.",
        },
      ],
      whyChooseUs: {
        subtitle:
          "We don't just build software—we build long-term digital success.",
        items: [
          "Expert team with proven industry experience",
          "Transparent communication and agile development approach",
          "Scalable and future-ready architecture",
          "Strong focus on quality, security, and performance",
          "On-time delivery with dedicated support",
          "Custom solutions tailored to business needs",
        ],
      },
      technologies: [
        { name: "JavaScript/TypeScript", icon: "⚡" },
        { name: "Node.js", icon: "🟢" },
        { name: ".NET", icon: "🔷" },
        { name: "React", icon: "⚛️" },
        { name: "Next.js", icon: "▲" },
        { name: "Angular", icon: "🅰️" },
        { name: "React Native", icon: "📱" },
        { name: "Flutter", icon: "🐦" },
        { name: "AWS", icon: "☁️" },
      ],
      process: [
        {
          number: "1",
          title: "Discovery & Requirement Analysis",
          description:
            "We understand your business goals, challenges, and project objectives to define a clear roadmap.",
        },
        {
          number: "2",
          title: "Planning & Architecture",
          description:
            "We design the system architecture, select the right tech stack, and plan development phases.",
        },
        {
          number: "3",
          title: "UI/UX Design",
          description:
            "Crafting intuitive, user-friendly, and engaging interfaces for an exceptional user experience.",
        },
        {
          number: "4",
          title: "Development",
          description:
            "Our engineers build secure, scalable, and high-performance software using best coding practices.",
        },
        {
          number: "5",
          title: "Testing & Quality Assurance",
          description:
            "Rigorous testing to ensure functionality, performance, and security.",
        },
        {
          number: "6",
          title: "Deployment & Launch",
          description:
            "Smooth deployment with full configuration, monitoring, and optimization.",
        },
        {
          number: "7",
          title: "Support & Maintenance",
          description:
            "Continuous support, updates, and enhancements to keep your software running efficiently.",
        },
      ],
      testimonials: [
        {
          quote:
            "An outstanding development partner! They delivered exactly what we needed with excellent communication and professionalism throughout the project. The custom software solution they built has streamlined our operations and increased productivity by 40%. Their attention to detail and commitment to quality is unmatched.",
          author: "John Miller",
          role: "CTO",
          company: "TechBridge Solutions",
        },
        {
          quote:
            "Our custom software development project transformed our operations. The team truly understood our business needs and delivered beyond expectations. They were responsive, proactive, and always available to address our concerns. The final product exceeded our requirements and was delivered on time and within budget.",
          author: "Sarah Thompson",
          role: "Operations Manager",
          company: "InnovateHub",
        },
        {
          quote:
            "Reliable, skilled, and highly committed. We continue to work with them for ongoing development needs. Their technical expertise and business acumen helped us build a scalable platform that has grown with our business. The post-launch support has been exceptional, and they're always quick to resolve any issues.",
          author: "David Wilson",
          role: "Founder",
          company: "CloudMatrix",
        },
        {
          quote:
            "Working with this team was a game-changer for our business. They took the time to understand our unique challenges and built a solution that perfectly fits our workflow. The software is intuitive, reliable, and has significantly improved our efficiency. I highly recommend them for any custom software development needs.",
          author: "Emily Chen",
          role: "VP of Technology",
          company: "Digital Innovations Inc.",
        },
        {
          quote:
            "The development process was smooth and transparent. They kept us informed at every stage and incorporated our feedback seamlessly. The end result is a robust, user-friendly application that our customers love. Their technical skills combined with excellent project management made this a successful partnership.",
          author: "Michael Rodriguez",
          role: "Product Director",
          company: "NextGen Solutions",
        },
      ],
      faq: [
        {
          question: "How long does custom software development take?",
          answer:
            "The timeline depends on project scope and complexity. On average, projects can take from a few weeks to several months. We provide a clear timeline after requirement analysis.",
        },
        {
          question: "Do you provide post-launch support?",
          answer:
            "Yes, we offer ongoing maintenance, upgrades, security monitoring, and performance optimization. Our support packages include bug fixes, feature enhancements, security patches, and 24/7 monitoring to ensure your software runs smoothly.",
        },
        {
          question: "What technologies do you work with?",
          answer:
            "We work with modern tech stacks including JavaScript/TypeScript, Node.js, .NET, PHP, React, Next.js, Angular, React Native, Flutter, AWS, and more depending on project needs. We stay current with the latest technologies and frameworks to deliver cutting-edge solutions.",
        },
        {
          question: "How do you ensure the software is scalable?",
          answer:
            "We design software with scalability in mind from the start. This includes using microservices architecture, cloud-native solutions, efficient database design, and implementing best practices for performance optimization. We plan for future growth and handle increased load seamlessly.",
        },
        {
          question: "What is your development methodology?",
          answer:
            "We follow Agile and Scrum methodologies, ensuring iterative development, regular client feedback, and transparent communication. We conduct daily standups, sprint planning, and regular demos to keep you informed throughout the development process.",
        },
        {
          question: "Can you integrate with our existing systems?",
          answer:
            "Absolutely! We specialize in system integration and can connect your new software with existing CRMs, ERPs, payment gateways, and other third-party services. We ensure seamless data flow and maintain compatibility with your current infrastructure.",
        },
      ],
      cta: {
        title: "Ready to Build Your Custom Software?",
        description:
          "Let's turn your idea into a powerful digital solution. Talk to our experts and start your project today.",
        buttonText: "Start Your Project",
      },
    },
    devops: {
      hero: {
        title: `${title} Services for Modern Businesses`,
        description:
          "Streamline your development lifecycle with expert DevOps solutions. We help you automate, deploy, and scale your infrastructure with CI/CD pipelines, containerization, and cloud-native architectures.",
        primaryButtonText: "Get a Free Consultation",
      },
      overview: {
        title: "Comprehensive DevOps Solutions",
        paragraphs: [
          "We provide end-to-end DevOps services to accelerate your software delivery, improve reliability, and reduce operational overhead. Our team specializes in automation, infrastructure as code, and cloud-native solutions.",
          "From setting up CI/CD pipelines to managing Kubernetes clusters, we help you achieve faster deployments, better collaboration, and scalable infrastructure that grows with your business.",
        ],
      },
      stats: [
        { icon: "⚡", value: "60+", label: "DevOps Engineers" },
        { icon: "🚀", value: "200+", label: "Deployments Automated" },
        { icon: "📅", value: "10+ Years", label: "DevOps Experience" },
        { icon: "⭐", value: "98%", label: "Uptime Guarantee" },
      ],
      subServices: [
        {
          icon: "🔄",
          title: "CI/CD Pipeline Setup",
          description:
            "Automate your build, test, and deployment processes with industry-leading tools and best practices.",
        },
        {
          icon: "🐳",
          title: "Containerization & Orchestration",
          description:
            "Docker and Kubernetes solutions for scalable, portable applications.",
        },
        {
          icon: "☁️",
          title: "Cloud Infrastructure",
          description:
            "AWS, Azure, and GCP infrastructure setup, migration, and optimization.",
        },
        {
          icon: "📊",
          title: "Monitoring & Logging",
          description:
            "Comprehensive monitoring solutions with real-time alerts and analytics.",
        },
        {
          icon: "🔒",
          title: "Infrastructure Security",
          description:
            "Secure your infrastructure with automated security scanning and compliance.",
        },
        {
          icon: "⚙️",
          title: "Infrastructure as Code",
          description:
            "Manage infrastructure with Terraform, Ansible, and CloudFormation.",
        },
      ],
      whyChooseUs: {
        subtitle:
          "We transform your development workflow for speed and reliability.",
        items: [
          "Certified DevOps engineers with cloud expertise",
          "Proven track record in automation and scaling",
          "24/7 monitoring and support",
          "Cost-effective infrastructure optimization",
          "Security-first approach",
          "Rapid deployment capabilities",
        ],
      },
      technologies: [
        { name: "Docker", icon: "🐳" },
        { name: "Kubernetes", icon: "☸️" },
        { name: "Jenkins", icon: "🔧" },
        { name: "GitLab CI", icon: "🦊" },
        { name: "GitHub Actions", icon: "⚡" },
        { name: "Terraform", icon: "🏗️" },
        { name: "Ansible", icon: "🔴" },
        { name: "AWS", icon: "☁️" },
        { name: "Azure", icon: "🔷" },
      ],
      process: [
        {
          number: "1",
          title: "Assessment & Planning",
          description:
            "Analyze your current infrastructure and define DevOps transformation roadmap.",
        },
        {
          number: "2",
          title: "Infrastructure Setup",
          description:
            "Design and implement cloud infrastructure with best practices.",
        },
        {
          number: "3",
          title: "CI/CD Implementation",
          description:
            "Build automated pipelines for continuous integration and deployment.",
        },
        {
          number: "4",
          title: "Containerization",
          description:
            "Containerize applications and set up orchestration platforms.",
        },
        {
          number: "5",
          title: "Monitoring & Security",
          description:
            "Implement monitoring, logging, and security best practices.",
        },
        {
          number: "6",
          title: "Training & Documentation",
          description:
            "Train your team and provide comprehensive documentation.",
        },
        {
          number: "7",
          title: "Ongoing Support",
          description: "Continuous optimization, updates, and 24/7 support.",
        },
      ],
      testimonials: [
        {
          quote:
            "Their DevOps implementation completely transformed our deployment process. We went from weekly deployments to multiple daily deployments with zero downtime. The CI/CD pipeline they set up is robust, and their 24/7 monitoring gives us peace of mind. Highly professional team with deep expertise in cloud infrastructure.",
          author: "Robert Kim",
          role: "Engineering Manager",
          company: "ScaleTech Systems",
        },
        {
          quote:
            "The DevOps team helped us migrate our entire infrastructure to AWS with minimal disruption. They automated everything, reduced our deployment time by 80%, and cut infrastructure costs by 30%. Their knowledge of containerization and Kubernetes is exceptional. We couldn't be happier with the results.",
          author: "Lisa Anderson",
          role: "CTO",
          company: "CloudVantage Inc.",
        },
        {
          quote:
            "Outstanding DevOps services! They set up our monitoring and alerting systems, and we've had 99.9% uptime since. Their proactive approach to infrastructure management and security has been invaluable. The team is always available when we need them, and their documentation is thorough.",
          author: "James Park",
          role: "DevOps Lead",
          company: "TechFlow Solutions",
        },
        {
          quote:
            "We needed to modernize our infrastructure quickly, and they delivered. The Terraform infrastructure as code they created is maintainable and scalable. Their expertise in automation and best practices has significantly improved our development workflow. Great partnership!",
          author: "Maria Garcia",
          role: "VP of Engineering",
          company: "InnovateCloud",
        },
        {
          quote:
            "The DevOps transformation they implemented has been a game-changer. Our developers can now deploy confidently, and our infrastructure scales automatically. Their support during the transition was excellent, and the training they provided helped our team become self-sufficient. Highly recommended!",
          author: "Thomas Brown",
          role: "Founder",
          company: "AgileDev Solutions",
        },
      ],
      faq: [
        {
          question: "What is DevOps and why do I need it?",
          answer:
            "DevOps combines development and operations to automate and streamline software delivery. It reduces deployment time, improves reliability, and enables faster innovation. DevOps practices help teams deploy code more frequently, catch bugs earlier, and recover from failures faster, ultimately improving your time-to-market and product quality.",
        },
        {
          question: "How long does DevOps implementation take?",
          answer:
            "Implementation time varies based on complexity. Simple CI/CD setups can take 2-4 weeks, while full infrastructure transformations may take 2-3 months. We'll provide a detailed timeline after assessing your current infrastructure and requirements during the initial consultation.",
        },
        {
          question: "Do you provide 24/7 support?",
          answer:
            "Yes, we offer 24/7 monitoring and support services to ensure your infrastructure runs smoothly around the clock. Our support includes proactive monitoring, automated alerts, incident response, and regular health checks to prevent issues before they impact your business.",
        },
        {
          question: "What cloud platforms do you work with?",
          answer:
            "We work with all major cloud platforms including AWS, Azure, Google Cloud Platform, and hybrid cloud solutions. We help you choose the best platform for your needs and can assist with migration, optimization, and multi-cloud strategies.",
        },
        {
          question: "Can you help migrate our existing infrastructure?",
          answer:
            "Absolutely! We specialize in infrastructure migration with minimal downtime. We assess your current setup, create a detailed migration plan, and execute the migration with comprehensive testing and rollback strategies to ensure a smooth transition.",
        },
        {
          question: "How do you ensure security in DevOps practices?",
          answer:
            "Security is integrated into every stage of our DevOps process through DevSecOps practices. We implement automated security scanning, vulnerability assessments, compliance checks, and follow security best practices like least privilege access, encrypted communications, and regular security audits.",
        },
      ],
      cta: {
        title: "Ready to Transform Your DevOps?",
        description:
          "Let's automate your workflows and scale your infrastructure. Contact us for a free consultation.",
        buttonText: "Start Your DevOps Journey",
      },
    },
    frontend: {
      hero: {
        title: `${title} Services That Deliver`,
        description:
          "Create stunning, responsive, and high-performance user interfaces that engage users and drive conversions. We build modern frontend applications using the latest frameworks and best practices.",
        primaryButtonText: "Get a Free Consultation",
      },
      overview: {
        title: "Expert Frontend Development Services",
        paragraphs: [
          "We specialize in building beautiful, fast, and user-friendly frontend applications. Our team creates responsive interfaces that work seamlessly across all devices and browsers, ensuring exceptional user experiences.",
          "From React and Next.js to Vue and Angular, we leverage modern frameworks and tools to deliver scalable frontend solutions that align with your business objectives and user needs.",
        ],
      },
      stats: [
        { icon: "👥", value: "40+", label: "Frontend Developers" },
        { icon: "✅", value: "150+", label: "Frontend Projects" },
        { icon: "📅", value: "7+ Years", label: "Frontend Experience" },
        { icon: "⭐", value: "4.9", label: "Client Rating" },
      ],
      subServices: [
        {
          icon: "⚛️",
          title: "React Development",
          description:
            "Build dynamic, interactive user interfaces with React and React ecosystem.",
        },
        {
          icon: "▲",
          title: "Next.js Development",
          description:
            "Server-side rendering and static site generation for optimal performance.",
        },
        {
          icon: "🅰️",
          title: "Angular Development",
          description: "Enterprise-grade applications with Angular framework.",
        },
        {
          icon: "💚",
          title: "Vue.js Development",
          description: "Progressive web applications with Vue.js.",
        },
        {
          icon: "📱",
          title: "Responsive Design",
          description:
            "Mobile-first, responsive designs that work on all devices.",
        },
        {
          icon: "🎨",
          title: "UI/UX Implementation",
          description:
            "Transform designs into pixel-perfect, interactive interfaces.",
        },
      ],
      whyChooseUs: {
        subtitle: "We create frontend experiences that users love.",
        items: [
          "Expert knowledge of modern frameworks",
          "Focus on performance and user experience",
          "Mobile-first responsive design",
          "Accessibility and SEO best practices",
          "Clean, maintainable code",
          "Fast turnaround times",
        ],
      },
      technologies: [
        { name: "React", icon: "⚛️" },
        { name: "Next.js", icon: "▲" },
        { name: "Angular", icon: "🅰️" },
        { name: "Vue.js", icon: "💚" },
        { name: "TypeScript", icon: "📘" },
        { name: "Tailwind CSS", icon: "🎨" },
        { name: "GraphQL", icon: "🔷" },
        { name: "Webpack", icon: "📦" },
      ],
      process: [
        {
          number: "1",
          title: "Design Review",
          description: "Review designs and create implementation plan.",
        },
        {
          number: "2",
          title: "Framework Selection",
          description: "Choose the best framework and tools for your project.",
        },
        {
          number: "3",
          title: "Component Development",
          description: "Build reusable, maintainable components.",
        },
        {
          number: "4",
          title: "Integration",
          description: "Integrate with APIs and backend services.",
        },
        {
          number: "5",
          title: "Testing & Optimization",
          description: "Test across devices and optimize performance.",
        },
        {
          number: "6",
          title: "Deployment",
          description: "Deploy to production with CI/CD pipelines.",
        },
        {
          number: "7",
          title: "Maintenance",
          description: "Ongoing updates, bug fixes, and improvements.",
        },
      ],
      testimonials: [
        {
          quote:
            "They built our frontend application with React and Next.js, and the results exceeded our expectations. The application is fast, responsive, and beautifully designed. Their attention to detail in implementing our designs was impressive, and they delivered pixel-perfect results. The code quality is excellent and maintainable.",
          author: "Jennifer Lee",
          role: "Product Manager",
          company: "DesignFirst Apps",
        },
        {
          quote:
            "Our frontend project was complex, but they handled it with expertise. They created a responsive, accessible application that works flawlessly across all devices. Their knowledge of modern frameworks and performance optimization helped us achieve excellent Core Web Vitals scores. Great team to work with!",
          author: "Alex Thompson",
          role: "Frontend Lead",
          company: "UserExperience Co.",
        },
        {
          quote:
            "The frontend developers delivered a stunning user interface that our customers love. They were proactive in suggesting improvements and implemented complex features with ease. The application loads quickly, is mobile-friendly, and provides an exceptional user experience. Highly skilled team!",
          author: "Rachel Martinez",
          role: "UX Director",
          company: "Digital Solutions Pro",
        },
        {
          quote:
            "Working with them on our frontend rebuild was seamless. They modernized our legacy application using Vue.js and improved both performance and user experience significantly. Their code is clean, well-documented, and follows best practices. The project was delivered on time and within budget.",
          author: "Daniel White",
          role: "Technical Director",
          company: "ModernWeb Inc.",
        },
        {
          quote:
            "They transformed our Angular application with excellent results. The new frontend is fast, accessible, and provides a much better user experience. Their expertise in frontend optimization and modern development practices is evident in the quality of their work. Excellent communication throughout the project.",
          author: "Sophie Johnson",
          role: "Engineering Manager",
          company: "EnterpriseFrontend Solutions",
        },
      ],
      faq: [
        {
          question: "Which frontend framework should I choose?",
          answer:
            "The choice depends on your project requirements. React is great for flexibility and large ecosystems, Next.js for SEO and performance with server-side rendering, Angular for enterprise apps requiring structure, and Vue.js for progressive enhancement. We'll analyze your needs and help you choose the best fit for your project.",
        },
        {
          question: "How do you ensure mobile responsiveness?",
          answer:
            "We use mobile-first design principles, test on real devices across different screen sizes, and leverage modern CSS frameworks like Tailwind CSS. We also perform cross-browser testing and use responsive design patterns to ensure perfect functionality on smartphones, tablets, and desktops.",
        },
        {
          question: "Do you provide design services?",
          answer:
            "We focus on frontend development and can work seamlessly with your design team or recommend trusted design partners. We excel at implementing designs with pixel-perfect accuracy, ensuring the final product matches your design specifications exactly.",
        },
        {
          question: "How do you optimize frontend performance?",
          answer:
            "We optimize performance through code splitting, lazy loading, image optimization, minification, caching strategies, and using modern build tools. We aim for fast load times, smooth animations, and optimal Core Web Vitals scores to improve user experience and SEO rankings.",
        },
        {
          question: "Can you integrate with existing backend APIs?",
          answer:
            "Yes, we're experienced in integrating with RESTful APIs, GraphQL endpoints, and various backend services. We handle authentication, error handling, data transformation, and state management to create seamless frontend-backend integration.",
        },
        {
          question: "Do you follow accessibility standards?",
          answer:
            "Absolutely! We follow WCAG 2.1 guidelines and implement accessibility best practices including semantic HTML, ARIA labels, keyboard navigation, screen reader compatibility, and proper color contrast. This ensures your application is usable by everyone.",
        },
      ],
      cta: {
        title: "Ready to Build Your Frontend?",
        description:
          "Let's create a stunning user interface that engages your audience. Get started today.",
        buttonText: "Start Your Project",
      },
    },
    backend: {
      hero: {
        title: `${title} Services for Scalable Applications`,
        description:
          "Build robust, secure, and scalable backend systems that power your applications. We develop high-performance APIs, microservices, and server infrastructure that handle growth and complexity.",
        primaryButtonText: "Get a Free Consultation",
      },
      overview: {
        title: "Expert Backend Development Services",
        paragraphs: [
          "We design and develop backend systems that are secure, scalable, and maintainable. Our team builds RESTful APIs, GraphQL endpoints, microservices architectures, and database solutions that support your application's needs.",
          "From Node.js and Python to .NET and Java, we use the right technology stack to deliver backend solutions that perform under load, integrate seamlessly, and scale with your business.",
        ],
      },
      stats: [
        { icon: "👥", value: "45+", label: "Backend Engineers" },
        { icon: "✅", value: "180+", label: "Backend Projects" },
        { icon: "📅", value: "9+ Years", label: "Backend Experience" },
        { icon: "⚡", value: "99.9%", label: "Uptime SLA" },
      ],
      subServices: [
        {
          icon: "🟢",
          title: "Node.js Development",
          description:
            "Fast, scalable backend services with Node.js and Express.",
        },
        {
          icon: "🐍",
          title: "Python Development",
          description:
            "Django and Flask applications for complex business logic.",
        },
        {
          icon: "🔷",
          title: ".NET Development",
          description: "Enterprise-grade backend solutions with .NET Core.",
        },
        {
          icon: "☕",
          title: "Java Development",
          description: "Robust Java-based backend systems and microservices.",
        },
        {
          icon: "🔌",
          title: "API Development",
          description:
            "RESTful and GraphQL APIs with comprehensive documentation.",
        },
        {
          icon: "🗄️",
          title: "Database Design",
          description:
            "Database architecture, optimization, and migration services.",
        },
      ],
      whyChooseUs: {
        subtitle: "We build backends that scale and perform.",
        items: [
          "Expert knowledge of multiple backend technologies",
          "Focus on security and performance",
          "Scalable architecture patterns",
          "Comprehensive API documentation",
          "Database optimization expertise",
          "24/7 monitoring and support",
        ],
      },
      technologies: [
        { name: "Node.js", icon: "🟢" },
        { name: "Python", icon: "🐍" },
        { name: ".NET", icon: "🔷" },
        { name: "Java", icon: "☕" },
        { name: "PostgreSQL", icon: "🐘" },
        { name: "MongoDB", icon: "🍃" },
        { name: "Redis", icon: "🔴" },
        { name: "GraphQL", icon: "🔷" },
      ],
      process: [
        {
          number: "1",
          title: "Architecture Design",
          description:
            "Design scalable backend architecture and API structure.",
        },
        {
          number: "2",
          title: "Technology Selection",
          description: "Choose the best tech stack for your requirements.",
        },
        {
          number: "3",
          title: "Database Design",
          description: "Design and optimize database schema and queries.",
        },
        {
          number: "4",
          title: "API Development",
          description: "Build RESTful or GraphQL APIs with authentication.",
        },
        {
          number: "5",
          title: "Testing & Security",
          description: "Comprehensive testing and security hardening.",
        },
        {
          number: "6",
          title: "Deployment & Scaling",
          description: "Deploy to cloud infrastructure with auto-scaling.",
        },
        {
          number: "7",
          title: "Monitoring & Maintenance",
          description: "Set up monitoring, logging, and ongoing maintenance.",
        },
      ],
      testimonials: [
        {
          quote:
            "They built our backend API with Node.js and it's been rock solid. The API is fast, well-documented, and handles our traffic spikes without issues. Their database optimization work improved our query performance by 60%. The team is knowledgeable, responsive, and always available when we need support.",
          author: "Mark Stevens",
          role: "Backend Architect",
          company: "APIPower Systems",
        },
        {
          quote:
            "Our backend infrastructure was a mess, and they completely rebuilt it using microservices architecture. The new system is scalable, maintainable, and performs exceptionally well. Their expertise in Python and Django helped us build complex business logic efficiently. Outstanding work!",
          author: "Patricia Davis",
          role: "CTO",
          company: "DataFlow Technologies",
        },
        {
          quote:
            "The .NET backend they developed for us is enterprise-grade. It's secure, scalable, and integrates seamlessly with our existing Microsoft ecosystem. Their attention to security best practices and API design is impressive. We've had zero downtime since launch, and the performance is excellent.",
          author: "Kevin Wilson",
          role: "VP of Engineering",
          company: "EnterpriseBackend Corp",
        },
        {
          quote:
            "They helped us migrate our legacy Java backend to a modern microservices architecture. The migration was smooth, and the new system is much more maintainable. Their database optimization work reduced our query times significantly. Great technical expertise and project management.",
          author: "Amanda Taylor",
          role: "Senior Developer",
          company: "JavaSolutions Ltd",
        },
        {
          quote:
            "Working with them on our GraphQL API was a great experience. They built a robust, well-documented API that our frontend team loves. The performance is excellent, and they implemented proper authentication and authorization. Their code quality and best practices are top-notch.",
          author: "Chris Moore",
          role: "Full Stack Lead",
          company: "GraphQL Innovations",
        },
      ],
      faq: [
        {
          question: "Which backend technology should I use?",
          answer:
            "Node.js is excellent for real-time applications and JavaScript-based stacks, Python for data-heavy apps and machine learning integration, .NET for enterprise solutions requiring Microsoft ecosystem integration, and Java for large-scale systems needing robust performance. We'll analyze your requirements and recommend the best fit based on your specific needs, team expertise, and long-term goals.",
        },
        {
          question: "How do you ensure backend security?",
          answer:
            "We implement comprehensive security measures including authentication (JWT, OAuth), authorization, input validation, SQL injection prevention, encryption at rest and in transit, rate limiting, and follow OWASP Top 10 security best practices. Regular security audits, penetration testing, and compliance checks are part of our standard process.",
        },
        {
          question: "Can you help with database optimization?",
          answer:
            "Yes, we specialize in database design, query optimization, indexing strategies, schema normalization, connection pooling, and migration services. We analyze slow queries, optimize database performance, and ensure your database can scale with your application's growth.",
        },
        {
          question: "How do you handle API documentation?",
          answer:
            "We provide comprehensive API documentation using tools like Swagger/OpenAPI, Postman collections, and interactive API explorers. Our documentation includes endpoints, request/response examples, authentication methods, error codes, and code samples in multiple languages to help frontend developers integrate quickly.",
        },
        {
          question: "Can you build microservices architecture?",
          answer:
            "Absolutely! We design and implement microservices architectures that are scalable, maintainable, and resilient. We handle service communication, API gateways, service discovery, load balancing, and containerization to create robust distributed systems that can scale independently.",
        },
        {
          question: "What about API versioning and backward compatibility?",
          answer:
            "We implement proper API versioning strategies to ensure backward compatibility while allowing for future enhancements. We use URL versioning, header-based versioning, or semantic versioning depending on your needs, and provide migration guides for API updates.",
        },
      ],
      cta: {
        title: "Ready to Build Your Backend?",
        description:
          "Let's create a robust backend system that powers your application. Get started today.",
        buttonText: "Start Your Project",
      },
    },
    generic: {
      hero: {
        title: `${title} Tailored to Your Business Needs`,
        description: `We provide comprehensive ${title.toLowerCase()} solutions tailored to your business needs. Our expert team delivers innovative solutions that drive growth and success.`,
        primaryButtonText: "Get a Free Consultation",
      },
      overview: {
        title: `End-to-End ${title} Services`,
        paragraphs: [
          `Our ${title.toLowerCase()} services are designed to help businesses achieve their goals through innovative solutions and expert guidance. We combine industry best practices with cutting-edge technology to deliver results that matter.`,
          `If you're looking for a ${title.toLowerCase()} development firm, we've got a team of experienced professionals that are well versed in cutting-edge technologies and methodologies to help you solve your business challenges.`,
        ],
      },
      stats: [
        { icon: "👥", value: "50+", label: "Skilled Professionals" },
        { icon: "✅", value: "120+", label: "Successful Projects" },
        { icon: "📅", value: "8+ Years", label: "Industry Experience" },
        { icon: "⭐", value: "95%", label: "Client Satisfaction Rate" },
      ],
      subServices: [
        {
          icon: "🚀",
          title: "Service 1",
          description: `Comprehensive ${title.toLowerCase()} service 1 tailored to your needs.`,
        },
        {
          icon: "⚡",
          title: "Service 2",
          description: `Expert ${title.toLowerCase()} service 2 with proven results.`,
        },
        {
          icon: "💡",
          title: "Service 3",
          description: `Innovative ${title.toLowerCase()} service 3 for modern businesses.`,
        },
      ],
      whyChooseUs: {
        subtitle: `Choose us for your ${title.toLowerCase()} needs. Here's why we stand out.`,
        items: [
          "Expert team with proven industry experience",
          "Transparent communication and agile approach",
          "Scalable and future-ready solutions",
          "Strong focus on quality and performance",
          "On-time delivery with dedicated support",
          "Custom solutions tailored to business needs",
        ],
      },
      technologies: [
        { name: "Cloud Computing", icon: "☁️" },
        { name: "AI/ML", icon: "🤖" },
        { name: "DevOps", icon: "⚙️" },
        { name: "Security", icon: "🔒" },
      ],
      process: [
        {
          number: "1",
          title: "Discovery & Analysis",
          description:
            "We understand your business goals and project requirements.",
        },
        {
          number: "2",
          title: "Planning & Design",
          description: "We create a customized plan tailored to your needs.",
        },
        {
          number: "3",
          title: "Development",
          description: "We implement the solution with precision and care.",
        },
        {
          number: "4",
          title: "Testing & Quality Assurance",
          description:
            "Rigorous testing to ensure functionality and performance.",
        },
        {
          number: "5",
          title: "Deployment",
          description:
            "Smooth deployment with full configuration and optimization.",
        },
        {
          number: "6",
          title: "Support & Maintenance",
          description: "Ongoing support to ensure your success.",
        },
      ],
      testimonials: [
        {
          quote:
            "Working with this team on our project was an excellent experience. They delivered exactly what we needed with professional communication throughout. The solution they built has significantly improved our operations and exceeded our expectations. Highly recommended!",
          author: "John Doe",
          role: "CEO",
          company: "Company Inc.",
        },
        {
          quote:
            "The services exceeded our expectations in every way. The team truly understood our business needs and delivered a solution that perfectly fits our workflow. Their technical expertise and attention to detail made this a successful partnership. We'll definitely work with them again.",
          author: "Jane Smith",
          role: "CTO",
          company: "Tech Corp",
        },
        {
          quote:
            "Professional, reliable, and results-driven. Our project was a complete success thanks to their expertise and dedication. They were responsive to our needs, provided excellent support, and delivered on time and within budget. Outstanding service quality!",
          author: "Mike Johnson",
          role: "Director",
          company: "Business Solutions",
        },
        {
          quote:
            "They transformed our business operations with their innovative solution. The team was knowledgeable, proactive, and always available to address our concerns. The final product is robust, user-friendly, and has delivered measurable results. Great partnership!",
          author: "Sarah Williams",
          role: "Operations Manager",
          company: "GrowthTech Solutions",
        },
        {
          quote:
            "Exceptional service from start to finish. They took the time to understand our unique challenges and built a solution that perfectly addresses them. The implementation was smooth, and the ongoing support has been excellent. I highly recommend their services.",
          author: "Robert Chen",
          role: "VP of Technology",
          company: "Innovation Labs",
        },
      ],
      faq: [
        {
          question: `What is ${title}?`,
          answer: `${title} is a comprehensive service that helps businesses achieve their goals through innovative solutions and expert guidance. We combine industry best practices with cutting-edge technology to deliver results that drive growth and success.`,
        },
        {
          question: "How long does it take?",
          answer:
            "The timeline depends on your specific requirements, project scope, and complexity. Simple projects may take a few weeks, while complex implementations can take several months. We'll provide a detailed timeline and milestone schedule during our initial consultation after understanding your needs.",
        },
        {
          question: "Do you provide ongoing support?",
          answer:
            "Yes, we offer comprehensive ongoing support including maintenance, updates, bug fixes, security patches, performance optimization, and feature enhancements. We provide various support packages tailored to your needs, from basic maintenance to 24/7 dedicated support.",
        },
        {
          question: "What is your pricing model?",
          answer:
            "We offer flexible pricing models including fixed-price projects, time and materials, and dedicated team models. Pricing depends on project scope, complexity, and duration. We provide transparent quotes with detailed breakdowns and no hidden costs. Contact us for a customized quote based on your requirements.",
        },
        {
          question: "How do you ensure quality?",
          answer:
            "We follow rigorous quality assurance processes including code reviews, automated testing, manual testing, performance testing, and security audits. We use industry-standard tools and methodologies to ensure high-quality deliverables that meet your specifications and exceed expectations.",
        },
        {
          question: "Can you work with our existing team?",
          answer:
            "Absolutely! We're experienced in collaborating with in-house teams, remote teams, and distributed teams. We use agile methodologies, regular communication, and collaborative tools to ensure seamless integration with your existing workflows and team members.",
        },
      ],
      cta: {
        title: "Ready to Get Started?",
        description: `Let's discuss how our ${title.toLowerCase()} services can help your business grow.`,
        buttonText: "Contact Us",
      },
    },
  };

  return templates[serviceType] || templates["generic"];
}

export function getDefaultServiceTemplateForTitle(
  title: string
): ServiceTemplateData {
  const serviceType = detectServiceType(title);
  const template = getServiceContentTemplate(serviceType, title);

  return {
    hero: {
      breadcrumbs: `Home > Services > ${title}`,
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
      image: "",
      isActive: true,
    },
    stats: {
      items: template.stats,
      isActive: true,
    },
    subServices: {
      title: `Our ${title} Services`,
      items: template.subServices,
      ctaButtonText: "Reach Out to Our Specialists",
      ctaButtonLink: "/contact",
      isActive: true,
    },
    whyChooseUs: {
      title: "Why Partner With Us?",
      subtitle: template.whyChooseUs.subtitle,
      items: template.whyChooseUs.items.map((text) => ({ text })),
      image: "",
      certifications: [],
      isActive: true,
    },
    technologies: {
      title: "Technologies & Tools",
      description: "Technologies we use to deliver results",
      items: template.technologies,
      isActive: true,
    },
    process: {
      title: "Our Development Process",
      description:
        "A structured approach to deliver reliable and impactful software.",
      steps: template.process,
      isActive: true,
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
      isActive: true,
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
      isActive: true,
    },
    cards: {
      title: "What Our Clients Say",
      description: "Testimonials from satisfied customers",
      showStars: true,
      items: template.testimonials,
      isActive: true,
    },
    faq: {
      title: "FAQs",
      items: template.faq,
      isActive: true,
    },
    cta: {
      title: template.cta.title,
      description: template.cta.description,
      buttonText: template.cta.buttonText,
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
}
