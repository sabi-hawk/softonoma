import { ServiceContentTemplate } from "./types";

export function getUIUXTemplate(title: string): ServiceContentTemplate {
  return {
    hero: {
      title: `${title} Services That Engage Users`,
      description:
        "Create beautiful, intuitive, and user-centered designs that drive engagement and conversions. We design digital experiences that users love and businesses rely on.",
      primaryButtonText: "Get a Free Consultation",
    },
    overview: {
      title: "Expert UI/UX Design Services",
      paragraphs: [
        "We create user-centered designs that combine aesthetics with functionality. Our UI/UX design services focus on understanding user needs, creating intuitive interfaces, and delivering exceptional digital experiences that drive business results.",
        "From user research and wireframing to high-fidelity designs and prototyping, we follow a comprehensive design process that ensures your product is not only beautiful but also usable, accessible, and effective.",
      ],
      image:
        "",
    },
    stats: [
      {
        icon: "https://saigontechnology.com/wp-content/uploads/users.svg",
        value: "25+",
        label: "UI/UX Designers",
      },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/folder-check-1.svg",
        value: "200+",
        label: "Design Projects",
      },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/calendar.svg",
        value: "7+ Years",
        label: "Design Experience",
      },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/yellow_stars_in_flat_outline_and_glyph.svg",
        value: "4.9",
        label: "Client Satisfaction",
      },
    ],
    subServices: [
      {
        icon: "🔍",
        title: "User Research & Analysis",
        description:
          "Understand your users through interviews, surveys, and data analysis to inform design decisions.",
      },
      {
        icon: "📐",
        title: "Wireframing & Prototyping",
        description:
          "Create low and high-fidelity wireframes and interactive prototypes to visualize and test designs.",
      },
      {
        icon: "🎨",
        title: "UI Design",
        description:
          "Design beautiful, modern interfaces that align with your brand and provide exceptional user experiences.",
      },
      {
        icon: "🧭",
        title: "UX Design",
        description:
          "Create intuitive user flows, information architecture, and interaction designs that guide users effectively.",
      },
      {
        icon: "📱",
        title: "Responsive Design",
        description:
          "Design interfaces that work seamlessly across all devices and screen sizes.",
      },
      {
        icon: "♿",
        title: "Accessibility Design",
        description:
          "Ensure your designs are accessible to all users, following WCAG guidelines and best practices.",
      },
    ],
    whyChooseUs: {
      subtitle: "We design experiences that users love and businesses trust.",
      items: [
        "User-centered design approach",
        "Expert knowledge of design tools and trends",
        "Focus on usability and accessibility",
        "Data-driven design decisions",
        "Collaborative design process",
        "Pixel-perfect design implementation",
      ],
      image:
        "",
    },
    technologies: [
      { name: "Figma", icon: "🎨" },
      { name: "Adobe XD", icon: "💜" },
      { name: "Sketch", icon: "✏️" },
      { name: "InVision", icon: "👁️" },
      { name: "Principle", icon: "⚡" },
      { name: "Framer", icon: "🚀" },
      { name: "Zeplin", icon: "📐" },
      { name: "Miro", icon: "🔄" },
    ],
    process: [
      {
        number: "1",
        title: "Discovery & Research",
        description:
          "Understand your business, users, and goals through research and stakeholder interviews.",
      },
      {
        number: "2",
        title: "User Personas & Journey Mapping",
        description:
          "Create user personas and map user journeys to identify pain points and opportunities.",
      },
      {
        number: "3",
        title: "Information Architecture",
        description:
          "Design the structure and organization of content and features for optimal usability.",
      },
      {
        number: "4",
        title: "Wireframing",
        description:
          "Create low-fidelity wireframes to establish layout and functionality.",
      },
      {
        number: "5",
        title: "Visual Design",
        description:
          "Develop high-fidelity designs with colors, typography, and visual elements.",
      },
      {
        number: "6",
        title: "Prototyping & Testing",
        description:
          "Build interactive prototypes and conduct user testing to validate designs.",
      },
      {
        number: "7",
        title: "Design Handoff",
        description:
          "Prepare design specifications and assets for development implementation.",
      },
    ],
    testimonials: [
      {
        quote:
          "Their UI/UX design work transformed our product. They conducted thorough user research, created beautiful designs, and the user feedback has been overwhelmingly positive. The design process was collaborative, and they incorporated our feedback seamlessly. The final designs exceeded our expectations.",
        author: "Lisa Anderson",
        role: "Product Director",
        company: "DesignFirst Apps",
      },
      {
        quote:
          "Working with their design team was exceptional. They understood our brand and created designs that perfectly represent our vision. The user experience they designed has significantly improved user engagement and conversion rates. Their attention to detail and design expertise is outstanding.",
        author: "Robert Martinez",
        role: "CEO",
        company: "UserExperience Co.",
      },
      {
        quote:
          "They redesigned our entire platform, and the results speak for themselves. User satisfaction increased by 40%, and we've seen a significant improvement in conversion rates. Their design process is thorough, and they truly care about creating the best user experience. Highly recommended!",
        author: "Jennifer Lee",
        role: "UX Manager",
        company: "Digital Solutions Pro",
      },
      {
        quote:
          "The UI/UX designs they created for our mobile app are beautiful and intuitive. They conducted user testing and iterated based on feedback, resulting in a design that our users love. Their expertise in design tools and best practices is evident in the quality of their work.",
        author: "Daniel White",
        role: "Founder",
        company: "ModernWeb Inc.",
      },
      {
        quote:
          "Outstanding design work! They took the time to understand our users and business goals, and created designs that perfectly balance aesthetics and functionality. The design system they built has made our development process much more efficient. Great partnership!",
        author: "Sophie Johnson",
        role: "Design Lead",
        company: "CreativeTech Solutions",
      },
    ],
    faq: [
      {
        question: "What's the difference between UI and UX design?",
        answer:
          "UI (User Interface) design focuses on the visual elements and aesthetics of a product—colors, typography, buttons, and layout. UX (User Experience) design focuses on the overall user journey, usability, and how users interact with the product. Both work together to create exceptional digital experiences.",
      },
      {
        question: "How long does a UI/UX design project take?",
        answer:
          "Design timelines vary based on project scope. Simple projects may take 2-4 weeks, while comprehensive redesigns can take 2-3 months. We provide detailed timelines after understanding your requirements during the initial consultation.",
      },
      {
        question: "Do you conduct user testing?",
        answer:
          "Yes, user testing is an integral part of our design process. We conduct usability testing, A/B testing, and gather user feedback at various stages to ensure our designs meet user needs and expectations. This helps us create designs that are both beautiful and functional.",
      },
      {
        question: "Can you work with our existing brand guidelines?",
        answer:
          "Absolutely! We work within your existing brand guidelines to ensure consistency across all touchpoints. We can also help evolve and refine your brand guidelines if needed to create a cohesive design system.",
      },
      {
        question: "Do you provide design systems?",
        answer:
          "Yes, we create comprehensive design systems including component libraries, style guides, and design tokens. This ensures consistency across your product and makes it easier for developers to implement designs accurately.",
      },
      {
        question: "How do you ensure accessibility in designs?",
        answer:
          "We follow WCAG 2.1 guidelines and accessibility best practices including proper color contrast, readable typography, clear navigation, and keyboard accessibility. We test designs for accessibility and ensure they're usable by everyone, including users with disabilities.",
      },
    ],
    cta: {
      title: "Ready to Design Your Product?",
      description:
        "Let's create beautiful, user-centered designs that drive engagement and business growth. Get started today.",
      buttonText: "Start Your Design Project",
    },
    partners: [
      {
        name: "Partner 1",
        logo: "",
      },
      {
        name: "Partner 2",
        logo: "",
      },
      {
        name: "Partner 3",
        logo: "",
      },
      {
        name: "Partner 4",
        logo: "",
      },
      {
        name: "Partner 5",
        logo: "",
      },
      {
        name: "Partner 6",
        logo: "",
      },
      {
        name: "Partner 7",
        logo: "",
      },
      {
        name: "Partner 8",
        logo: "",
      },
      {
        name: "Partner 9",
        logo: "",
      },
      {
        name: "Partner 10",
        logo: "",
      },
    ],
  };
}
