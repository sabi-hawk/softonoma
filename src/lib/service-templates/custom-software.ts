import { ServiceContentTemplate } from "./types";

export function getCustomSoftwareTemplate(
  title: string
): ServiceContentTemplate {
  return {
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
      image: "",
    },
    stats: [
      { icon: "https://saigontechnology.com/wp-content/uploads/users.svg", value: "50+", label: "Skilled Software Developers" },
      { icon: "https://saigontechnology.com/wp-content/uploads/folder-check-1.svg", value: "120+", label: "Successful Projects Delivered" },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/calendar.svg",
        value: "8+ Years",
        label: "Experience in Software Development",
      },
      { icon: "https://saigontechnology.com/wp-content/uploads/yellow_stars_in_flat_outline_and_glyph.svg", value: "95%", label: "Client Satisfaction Rate" },
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
      image: "",
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
    partners: [
      { name: "Partner 1", logo: "" },
      { name: "Partner 2", logo: "" },
      { name: "Partner 3", logo: "" },
      { name: "Partner 4", logo: "" },
      { name: "Partner 5", logo: "" },
      { name: "Partner 6", logo: "" },
      { name: "Partner 7", logo: "" },
      { name: "Partner 8", logo: "" },
      { name: "Partner 9", logo: "" },
      { name: "Partner 10", logo: "" },
    ],
  };
}

