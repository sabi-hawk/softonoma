import { ServiceContentTemplate } from "./types";

export function getBackendTemplate(title: string): ServiceContentTemplate {
  return {
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
      image: "",
    },
    stats: [
      {
        icon: "https://saigontechnology.com/wp-content/uploads/users.svg",
        value: "45+",
        label: "Backend Engineers",
      },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/folder-check-1.svg",
        value: "180+",
        label: "Backend Projects",
      },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/calendar.svg",
        value: "9+ Years",
        label: "Backend Experience",
      },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/yellow_stars_in_flat_outline_and_glyph.svg",
        value: "99.9%",
        label: "Uptime SLA",
      },
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
      image:
        "",
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
        description: "Design scalable backend architecture and API structure.",
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
