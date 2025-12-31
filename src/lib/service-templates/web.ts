import { ServiceContentTemplate } from "./types";

export function getWebTemplate(title: string): ServiceContentTemplate {
  return {
    hero: {
      title: `${title} Services for Modern Businesses`,
      description:
        "Build fast, responsive, and scalable web applications that engage users and drive business growth. We develop modern web solutions using cutting-edge technologies and best practices.",
      primaryButtonText: "Get a Free Consultation",
    },
    overview: {
      title: "Comprehensive Web Development Services",
      paragraphs: [
        "We create web applications that deliver exceptional user experiences and drive business results. Our team specializes in modern web technologies, responsive design, and scalable architectures that grow with your business.",
        "From simple websites to complex web applications, we handle every aspect of web development including design, frontend and backend development, API integration, deployment, and ongoing maintenance. We build web solutions that are fast, secure, and optimized for performance.",
      ],
      image: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/69521107000fadbdb2d0/view?project=694cc43b00225b94d30d",
    },
    stats: [
      { icon: "https://saigontechnology.com/wp-content/uploads/users.svg", value: "60+", label: "Web Developers" },
      { icon: "https://saigontechnology.com/wp-content/uploads/folder-check-1.svg", value: "250+", label: "Web Projects Delivered" },
      { icon: "https://saigontechnology.com/wp-content/uploads/calendar.svg", value: "10+ Years", label: "Web Development Experience" },
      { icon: "https://saigontechnology.com/wp-content/uploads/yellow_stars_in_flat_outline_and_glyph.svg", value: "4.9", label: "Client Rating" },
    ],
    subServices: [
      {
        icon: "🌐",
        title: "Website Development",
        description:
          "Custom websites built with modern technologies for optimal performance and user experience.",
      },
      {
        icon: "⚛️",
        title: "Web Application Development",
        description:
          "Complex web applications with dynamic features, user authentication, and real-time capabilities.",
      },
      {
        icon: "▲",
        title: "E-commerce Development",
        description:
          "Full-featured e-commerce platforms with payment integration, inventory management, and analytics.",
      },
      {
        icon: "📊",
        title: "CMS Development",
        description:
          "Custom content management systems for easy content updates and management.",
      },
      {
        icon: "🔄",
        title: "Web App Modernization",
        description:
          "Upgrade legacy web applications with modern technologies and improved user experiences.",
      },
      {
        icon: "🚀",
        title: "Progressive Web Apps",
        description:
          "PWAs that combine the best of web and mobile apps with offline capabilities and app-like experiences.",
      },
    ],
    whyChooseUs: {
      subtitle:
        "We build web solutions that perform, scale, and deliver results.",
      items: [
        "Expert knowledge of modern web technologies",
        "Focus on performance and SEO optimization",
        "Responsive and mobile-first design",
        "Scalable and maintainable architecture",
        "Comprehensive testing and quality assurance",
        "Ongoing support and maintenance",
      ],
      image: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/694e63f9000de0525ddc/view?project=694cc43b00225b94d30d",
    },
    technologies: [
      { name: "React", icon: "⚛️" },
      { name: "Next.js", icon: "▲" },
      { name: "Vue.js", icon: "💚" },
      { name: "Angular", icon: "🅰️" },
      { name: "Node.js", icon: "🟢" },
      { name: "TypeScript", icon: "📘" },
      { name: "PHP", icon: "🐘" },
      { name: "WordPress", icon: "📝" },
    ],
    process: [
      {
        number: "1",
        title: "Discovery & Planning",
        description:
          "Understand your business goals, target audience, and project requirements to create a strategic plan.",
      },
      {
        number: "2",
        title: "Design & Wireframing",
        description:
          "Create user-friendly designs and wireframes that align with your brand and user needs.",
      },
      {
        number: "3",
        title: "Technology Selection",
        description:
          "Choose the best tech stack and frameworks based on your project requirements and goals.",
      },
      {
        number: "4",
        title: "Development",
        description:
          "Build your web application using best practices, clean code, and modern development frameworks.",
      },
      {
        number: "5",
        title: "Testing & Optimization",
        description:
          "Comprehensive testing, performance optimization, and SEO implementation.",
      },
      {
        number: "6",
        title: "Deployment",
        description:
          "Deploy your web application to production with proper configuration and monitoring.",
      },
      {
        number: "7",
        title: "Launch & Support",
        description:
          "Launch your web application and provide ongoing maintenance, updates, and support.",
      },
    ],
    testimonials: [
      {
        quote:
          "They built our web application with Next.js, and it's been a huge success. The application is fast, responsive, and provides an excellent user experience. Their expertise in modern web technologies and attention to detail made the entire process smooth. The application has significantly improved our online presence and user engagement.",
        author: "Mark Thompson",
        role: "CTO",
        company: "WebSolutions Inc.",
      },
      {
        quote:
          "Our e-commerce website project exceeded all expectations. They created a beautiful, user-friendly platform with seamless payment integration and excellent performance. The website has increased our online sales by 60%, and their ongoing support has been exceptional. Highly recommended!",
        author: "Amanda Davis",
        role: "E-commerce Director",
        company: "RetailWeb Solutions",
      },
      {
        quote:
          "Working with them on our web application was a great experience. They modernized our legacy system using React and improved both performance and user experience significantly. The new application is fast, scalable, and has all the features we needed. Great technical expertise and project management.",
        author: "Chris Wilson",
        role: "VP of Technology",
        company: "ModernWeb Corp",
      },
      {
        quote:
          "They developed our company website, and the results are outstanding. The website is beautifully designed, loads quickly, and ranks well in search engines. Their SEO optimization work has significantly increased our organic traffic. The team was professional, responsive, and delivered on time.",
        author: "Jessica Brown",
        role: "Marketing Director",
        company: "BusinessWeb Solutions",
      },
      {
        quote:
          "The web application they built for us has transformed our business operations. It's user-friendly, performs excellently, and has improved our efficiency significantly. Their post-launch support has been exceptional, and they're always quick to address any issues. Excellent web development team!",
        author: "Ryan Miller",
        role: "Operations Manager",
        company: "TechWeb Innovations",
      },
    ],
    faq: [
      {
        question: "What technologies do you use for web development?",
        answer:
          "We work with modern web technologies including React, Next.js, Vue.js, Angular, Node.js, TypeScript, PHP, and WordPress. We choose the best technology stack based on your project requirements, scalability needs, and long-term goals to ensure optimal performance and maintainability.",
      },
      {
        question: "How long does web development take?",
        answer:
          "Development timelines vary based on project complexity. Simple websites may take 2-4 weeks, while complex web applications can take 3-6 months. We provide detailed timelines and milestone schedules after understanding your requirements during the initial consultation.",
      },
      {
        question: "Do you provide SEO optimization?",
        answer:
          "Yes, we implement SEO best practices including semantic HTML, meta tags, sitemaps, fast loading times, mobile optimization, and structured data. We ensure your web application is optimized for search engines to improve visibility and organic traffic.",
      },
      {
        question: "Can you integrate with third-party services?",
        answer:
          "Absolutely! We integrate with various third-party services including payment gateways, CRMs, email marketing tools, analytics platforms, and APIs. We ensure seamless integration and data flow between your web application and external services.",
      },
      {
        question: "How do you ensure web application security?",
        answer:
          "We implement comprehensive security measures including HTTPS, secure authentication, input validation, SQL injection prevention, XSS protection, CSRF tokens, and regular security audits. We follow OWASP security best practices to ensure your web application is secure.",
      },
      {
        question: "Do you provide hosting and deployment services?",
        answer:
          "Yes, we can help with hosting setup, deployment, and server configuration. We work with various hosting providers including AWS, Vercel, Netlify, and traditional hosting services. We ensure proper configuration, monitoring, and optimization for optimal performance.",
      },
    ],
    cta: {
      title: "Ready to Build Your Web Application?",
      description:
        "Let's create a web solution that engages users and drives business growth. Contact us today.",
      buttonText: "Start Your Web Project",
    },
    partners: [
      { name: "Partner 1", logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba5d003008864d7b/view?project=694cc43b00225b94d30d" },
      { name: "Partner 2", logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba62001457f024ef/view?project=694cc43b00225b94d30d" },
      { name: "Partner 3", logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba6700016cac0e12/view?project=694cc43b00225b94d30d" },
      { name: "Partner 4", logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba6b0032b310923f/view?project=694cc43b00225b94d30d" },
      { name: "Partner 5", logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba7100113ef921e4/view?project=694cc43b00225b94d30d" },
      { name: "Partner 6", logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba7c0012eee875af/view?project=694cc43b00225b94d30d" },
      { name: "Partner 7", logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba760029ccc019e4/view?project=694cc43b00225b94d30d" },
      { name: "Partner 8", logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba810038059a3274/view?project=694cc43b00225b94d30d" },
      { name: "Partner 9", logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba900020801ed88d/view?project=694cc43b00225b94d30d" },
      { name: "Partner 10", logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba94003bdd021354/view?project=694cc43b00225b94d30d" },
    ],
  };
}

