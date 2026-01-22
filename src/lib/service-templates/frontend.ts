import { ServiceContentTemplate } from "./types";

export function getFrontendTemplate(title: string): ServiceContentTemplate {
  return {
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
      image: "",
    },
    stats: [
      { icon: "https://saigontechnology.com/wp-content/uploads/users.svg", value: "40+", label: "Frontend Developers" },
      { icon: "https://saigontechnology.com/wp-content/uploads/folder-check-1.svg", value: "150+", label: "Frontend Projects" },
      { icon: "https://saigontechnology.com/wp-content/uploads/calendar.svg", value: "7+ Years", label: "Frontend Experience" },
      { icon: "https://saigontechnology.com/wp-content/uploads/yellow_stars_in_flat_outline_and_glyph.svg", value: "4.9", label: "Client Rating" },
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
      image: "",
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

