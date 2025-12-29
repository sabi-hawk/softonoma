import { ServiceContentTemplate } from "./types";

export function getDevOpsTemplate(title: string): ServiceContentTemplate {
  return {
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
      image:
        "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/69521107000fadbdb2d0/view?project=694cc43b00225b94d30d",
    },
    stats: [
      {
        icon: "https://saigontechnology.com/wp-content/uploads/users.svg",
        value: "60+",
        label: "DevOps Engineers",
      },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/folder-check-1.svg",
        value: "200+",
        label: "Deployments Automated",
      },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/calendar.svg",
        value: "10+ Years",
        label: "DevOps Experience",
      },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/yellow_stars_in_flat_outline_and_glyph.svg",
        value: "98%",
        label: "Uptime Guarantee",
      },
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
      image:
        "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/694e63f9000de0525ddc/view?project=694cc43b00225b94d30d",
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
        description: "Train your team and provide comprehensive documentation.",
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
    partners: [
      {
        name: "Partner 1",
        logo: "https://saigontechnology.com/wp-content/uploads/Partner-logo-1.png",
      },
      {
        name: "Partner 2",
        logo: "https://saigontechnology.com/wp-content/uploads/Partner-logo-2.png",
      },
      {
        name: "Partner 3",
        logo: "https://saigontechnology.com/wp-content/uploads/Partner-logo-3.png",
      },
      {
        name: "Partner 4",
        logo: "https://saigontechnology.com/wp-content/uploads/Partner-logo-4.png",
      },
      {
        name: "Partner 5",
        logo: "https://saigontechnology.com/wp-content/uploads/Partner-logo-5.png",
      },
      {
        name: "Partner 6",
        logo: "https://saigontechnology.com/wp-content/uploads/Partner-logo-6.png",
      },
      {
        name: "Partner 7",
        logo: "https://saigontechnology.com/wp-content/uploads/Partner-logo-8.png",
      },
      {
        name: "Partner 8",
        logo: "https://saigontechnology.com/wp-content/uploads/Partner-logo-9.png",
      },
    ],
  };
}
