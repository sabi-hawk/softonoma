import { ServiceContentTemplate } from "./types";

export function getSaaSTemplate(title: string): ServiceContentTemplate {
  return {
    hero: {
      title: `${title} - Build Scalable SaaS Solutions`,
      description:
        "Transform your business idea into a successful Software-as-a-Service platform. We build scalable, secure, and user-friendly SaaS applications with subscription management, multi-tenancy, and cloud infrastructure that grows with your business.",
      primaryButtonText: "Get a Free Consultation",
    },
    overview: {
      title: "End-to-End SaaS Development Services",
      paragraphs: [
        "We specialize in building comprehensive SaaS platforms from concept to launch. Our team designs and develops scalable SaaS applications with multi-tenant architecture, subscription billing, user management, and cloud infrastructure that can handle growth from startup to enterprise scale.",
        "From MVP development to full-featured SaaS platforms, we handle every aspect including architecture design, frontend and backend development, payment integration, analytics, security, and DevOps. We build SaaS solutions that are reliable, scalable, and optimized for user acquisition and retention.",
      ],
      image: "",
    },
    stats: [
      { icon: "https://saigontechnology.com/wp-content/uploads/users.svg", value: "40+", label: "SaaS Projects Delivered" },
      { icon: "https://saigontechnology.com/wp-content/uploads/folder-check-1.svg", value: "500K+", label: "Active SaaS Users" },
      { icon: "https://saigontechnology.com/wp-content/uploads/calendar.svg", value: "7+ Years", label: "SaaS Development Experience" },
      { icon: "https://saigontechnology.com/wp-content/uploads/yellow_stars_in_flat_outline_and_glyph.svg", value: "99.9%", label: "Uptime Guarantee" },
    ],
    subServices: [
      {
        icon: "🚀",
        title: "SaaS MVP Development",
        description:
          "Rapid MVP development to validate your SaaS idea and get to market quickly with core features.",
      },
      {
        icon: "🏢",
        title: "Multi-Tenant Architecture",
        description:
          "Scalable multi-tenant architecture that efficiently serves multiple customers from a single platform.",
      },
      {
        icon: "💳",
        title: "Subscription & Billing Management",
        description:
          "Complete subscription management with flexible pricing models, payment processing, and invoicing.",
      },
      {
        icon: "👥",
        title: "User Management & Authentication",
        description:
          "Secure user authentication, role-based access control, and comprehensive user management systems.",
      },
      {
        icon: "📊",
        title: "Analytics & Reporting",
        description:
          "Built-in analytics dashboards, usage tracking, and business intelligence for data-driven decisions.",
      },
      {
        icon: "🔒",
        title: "Security & Compliance",
        description:
          "Enterprise-grade security, data encryption, GDPR compliance, and SOC 2 readiness.",
      }
    ],
    whyChooseUs: {
      subtitle:
        "We build SaaS platforms that scale, perform, and drive recurring revenue.",
      items: [
        "Proven expertise in SaaS architecture and multi-tenancy",
        "Experience with subscription billing and payment systems",
        "Scalable cloud infrastructure and DevOps practices",
        "Focus on user experience and conversion optimization",
        "Security-first approach with compliance readiness",
        "Agile development with rapid iteration and deployment",
      ],
      image: "",
    },
    technologies: [
      {
        name: "Technology",
        icon: "",
      },
      {
        name: "Technology",
        icon: "",
      },
      {
        name: "Technology",
        icon: "",
      },
      {
        name: "Technology",
        icon: "",
      },
      {
        name: "Technology",
        icon: "" ,
      },
      {
        name: "Technology",
        icon: ""
      },
      {
        name: "Technology",
        icon: "",
      },
      {
        name: "Technology",
        icon: "",
      },
      {
        name: "Technology",
        icon: "",
      },
      {
        name: "Technology",
        icon: "",
      },
    ],
    process: [
      {
        number: "1",
        title: "Discovery & Strategy",
        description:
          "Understand your SaaS vision, target market, business model, and define the product roadmap.",
      },
      {
        number: "2",
        title: "Architecture Design",
        description:
          "Design scalable multi-tenant architecture, database schema, and system architecture for growth.",
      },
      {
        number: "3",
        title: "MVP Development",
        description:
          "Build and launch MVP with core features to validate market fit and gather user feedback.",
      },
      {
        number: "4",
        title: "Feature Development",
        description:
          "Develop advanced features including subscription management, analytics, integrations, and more.",
      },
      {
        number: "5",
        title: "Testing & Security",
        description:
          "Comprehensive testing, security audits, performance optimization, and compliance verification.",
      },
      {
        number: "6",
        title: "Launch & Deployment",
        description:
          "Deploy to production with monitoring, analytics, and infrastructure scaling capabilities.",
      },
      {
        number: "7",
        title: "Growth & Optimization",
        description:
          "Continuous improvement, feature enhancements, scaling infrastructure, and user growth support.",
      },
    ],
    testimonials: [
      {
        quote:
          "They built our SaaS platform from scratch, and it's been a game-changer for our business. The multi-tenant architecture scales beautifully, and the subscription management system works flawlessly. Their expertise in SaaS development and understanding of our business model made the entire process smooth. We've grown from 0 to 10,000+ users, and the platform handles it perfectly.",
        author: "David Chen",
        role: "Founder & CEO",
        company: "CloudSaaS Solutions",
      },
      {
        quote:
          "Our SaaS application project exceeded all expectations. They created a robust platform with excellent user experience, seamless payment integration, and powerful analytics. The application has significantly increased our recurring revenue, and their ongoing support has been exceptional. The team truly understands SaaS business models.",
        author: "Emily Rodriguez",
        role: "Product Director",
        company: "SaaS Innovations",
      },
      {
        quote:
          "Working with them on our SaaS platform was an excellent experience. They built a scalable multi-tenant system that handles thousands of customers efficiently. The subscription billing integration with Stripe works perfectly, and the analytics dashboard provides valuable insights. Great technical expertise and SaaS domain knowledge.",
        author: "Michael Park",
        role: "CTO",
        company: "TechSaaS Corp",
      },
      {
        quote:
          "They developed our SaaS MVP, and we were able to launch in just 3 months. The platform is user-friendly, performs excellently, and has all the core features we needed. Their understanding of SaaS best practices and rapid development approach helped us get to market quickly. Highly recommended!",
        author: "Sarah Johnson",
        role: "Co-Founder",
        company: "StartupSaaS",
      },
      {
        quote:
          "The SaaS platform they built has transformed our business operations and revenue model. It's secure, scalable, and provides an excellent user experience. Their post-launch support and feature development have been outstanding. The platform now serves thousands of users with 99.9% uptime. Excellent SaaS development team!",
        author: "James Wilson",
        role: "VP of Engineering",
        company: "EnterpriseSaaS",
      },
    ],
    faq: [
      {
        question: "What is SaaS development?",
        answer:
          "SaaS (Software-as-a-Service) development involves building cloud-based software applications that are delivered to customers via subscription. SaaS platforms typically feature multi-tenant architecture, subscription billing, user management, and are accessible through web browsers or mobile apps. We build end-to-end SaaS solutions from architecture to deployment.",
      },
      {
        question: "How long does it take to build a SaaS platform?",
        answer:
          "Timeline depends on complexity and scope. An MVP can take 2-4 months, while a full-featured SaaS platform typically takes 6-12 months. We follow an agile approach, launching MVP first to validate the market, then iterating based on user feedback. We provide detailed timelines after understanding your requirements.",
      },
      {
        question: "Do you handle subscription billing and payments?",
        answer:
          "Yes, we integrate with leading payment processors like Stripe, PayPal, and others. We build complete subscription management systems including pricing plans, billing cycles, upgrades/downgrades, invoicing, payment processing, and subscription analytics. We ensure secure and compliant payment handling.",
      },
      {
        question: "How do you ensure SaaS scalability?",
        answer:
          "We design scalable architecture from the start using microservices, cloud infrastructure, load balancing, database optimization, and caching strategies. We use cloud platforms like AWS, Azure, or GCP with auto-scaling capabilities. Our architecture can handle growth from hundreds to millions of users.",
      },
      {
        question: "What about multi-tenancy and data isolation?",
        answer:
          "We implement secure multi-tenant architecture with proper data isolation strategies. We use approaches like separate databases, shared database with tenant isolation, or hybrid models based on your needs. We ensure complete data security and isolation between tenants while maintaining scalability.",
      },
      {
        question: "Do you provide ongoing maintenance and support?",
        answer:
          "Yes, we offer comprehensive SaaS maintenance including bug fixes, security updates, feature enhancements, infrastructure monitoring, performance optimization, and 24/7 support options. We ensure your SaaS platform remains secure, performant, and up-to-date with the latest technologies.",
      },
      {
        question: "How do you ensure SaaS security and compliance?",
        answer:
          "We implement enterprise-grade security including data encryption, secure authentication, role-based access control, API security, regular security audits, and compliance with GDPR, SOC 2, and other regulations. We follow security best practices and ensure your SaaS platform meets industry standards.",
      },
      {
        question: "Can you help with SaaS marketing and analytics?",
        answer:
          "We build comprehensive analytics dashboards for user behavior, subscription metrics, revenue tracking, and business intelligence. We can integrate with marketing tools and analytics platforms. While we focus on development, we ensure your SaaS platform has the analytics foundation for data-driven decisions.",
      },
    ],
    cta: {
      title: "Ready to Build Your SaaS Platform?",
      description:
        "Let's transform your SaaS idea into a successful, scalable platform. Contact us to get started.",
      buttonText: "Start Your SaaS Project",
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

