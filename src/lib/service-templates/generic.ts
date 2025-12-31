import { ServiceContentTemplate } from "./types";

export function getGenericTemplate(title: string): ServiceContentTemplate {
  return {
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
      image: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/69521107000fadbdb2d0/view?project=694cc43b00225b94d30d",
    },
    stats: [
      { icon: "https://saigontechnology.com/wp-content/uploads/users.svg", value: "50+", label: "Skilled Professionals" },
      { icon: "https://saigontechnology.com/wp-content/uploads/folder-check-1.svg", value: "120+", label: "Successful Projects" },
      { icon: "https://saigontechnology.com/wp-content/uploads/calendar.svg", value: "8+ Years", label: "Industry Experience" },
      { icon: "https://saigontechnology.com/wp-content/uploads/yellow_stars_in_flat_outline_and_glyph.svg", value: "95%", label: "Client Satisfaction Rate" },
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
      image: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/694e63f9000de0525ddc/view?project=694cc43b00225b94d30d",
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

