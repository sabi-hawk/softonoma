export interface TemplateSection {
  type:
    | "hero"
    | "services"
    | "stats"
    | "industries"
    | "about"
    | "partnerships"
    | "cta"
    | "footer"
    | "features"
    | "cards"
    | "portfolio"
    | "technologies"
    | "blog"
    | "process"
    | "faq"
    | "partners";
  content: Record<string, unknown>;
  order: number;
  isActive: boolean;
}

export interface PageTemplate {
  name: string;
  description: string;
  sections: TemplateSection[];
}

/**
 * About Page Template
 * A comprehensive template for About Us pages with hero, about content, stats, values, process, and CTA sections
 */
export const aboutPageTemplate: PageTemplate = {
  name: "About Us",
  description:
    "A complete About Us page with company story, values, achievements, and process",
  sections: [
    {
      type: "hero",
      content: {
        title: "About Softonoma",
        subtitle: "Your Trusted Technology Partner",
        description:
          "We are a leading IT solutions provider dedicated to transforming businesses through innovative technology. With years of experience and a passion for excellence, we deliver cutting-edge solutions that drive growth and success.",
        buttonText: "Get Started",
        buttonLink: "/contact",
        secondaryButtonText: "Our Services",
        secondaryButtonLink: "/services",
        image: "",
        backgroundColor: "default",
      },
      order: 0,
      isActive: true,
    },
    {
      type: "about",
      content: {
        title: "Who We Are",
        description:
          "At Softonoma, we believe in the power of technology to transform businesses and create lasting impact. Our team of experienced professionals is committed to delivering exceptional solutions tailored to your unique needs.",
        aboutText:
          "Founded with a vision to bridge the gap between cutting-edge technology and business success, Softonoma has grown into a trusted partner for companies worldwide. We combine deep technical expertise with a customer-first approach to deliver solutions that not only meet but exceed expectations.",
        aboutImage:
          "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/69521107000fadbdb2d0/view?project=694cc43b00225b94d30d",
        aboutLink: "/services",
        aboutLinkText: "Explore Our Services",
        backgroundColor: "white",
      },
      order: 1,
      isActive: true,
    },
    {
      type: "stats",
      content: {
        title: "Our Achievements",
        description: "Numbers that speak for our commitment to excellence",
        stats: [
          {
            number: "500+",
            title: "Projects Completed",
            description:
              "Successfully delivered projects across various industries",
          },
          {
            number: "200+",
            title: "Happy Clients",
            description:
              "Trusted by businesses worldwide for their technology needs",
          },
          {
            number: "15+",
            title: "Years of Experience",
            description:
              "Years of expertise in delivering innovative IT solutions",
          },
          {
            number: "200+",
            title: "Team Members",
            description:
              "A dedicated team of experts committed to your success",
          },
        ],
        backgroundColor: "white",
      },
      order: 2,
      isActive: true,
    },
    {
      type: "features",
      content: {
        title: "Our Core Values",
        description:
          "The principles that guide everything we do and shape our commitment to excellence",
        features: [
          {
            title: "Innovation",
            description:
              "We stay ahead of the curve by embracing the latest technologies and methodologies to deliver cutting-edge solutions.",
          },
          {
            title: "Excellence",
            description:
              "Quality is at the heart of everything we do. We strive for perfection in every project and interaction.",
          },
          {
            title: "Integrity",
            description:
              "We build trust through transparency, honesty, and ethical practices in all our business relationships.",
          },
          {
            title: "Client-Centric",
            description:
              "Your success is our success. We prioritize your needs and work tirelessly to exceed your expectations.",
          },
        ],
        image:
          "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/694e63f9000de0525ddc/view?project=694cc43b00225b94d30d",
        backgroundColor: "theme-bg-white-green-gradient",
      },
      order: 3,
      isActive: true,
    },
    {
      type: "process",
      content: {
        title: "How We Work",
        description:
          "Our proven methodology ensures successful project delivery from concept to completion",
        steps: [
          {
            title: "Discovery",
            description:
              "We begin by understanding your business, goals, and challenges through in-depth consultation.",
            icon: "https://saigontechnology.com/wp-content/uploads/custom-software-development.svg",
          },
          {
            title: "Planning",
            description:
              "Our team creates a comprehensive strategy tailored to your specific needs and objectives.",
            icon: "https://saigontechnology.com/wp-content/uploads/web-application.svg",
          },
          {
            title: "Development",
            description:
              "We build your solution using best practices, agile methodologies, and continuous collaboration.",
            icon: "https://saigontechnology.com/wp-content/uploads/Software_4.svg",
          },
          {
            title: "Delivery",
            description:
              "We ensure smooth deployment, provide training, and offer ongoing support for your success.",
            icon: "https://saigontechnology.com/wp-content/uploads/Software-3.svg",
          },
        ],
        backgroundColor: "white",
      },
      order: 4,
      isActive: true,
    },
    {
      type: "technologies",
      content: {
        title: "Technologies We Master",
        description:
          "We work with cutting-edge technologies to deliver modern, scalable solutions",
        technologies: [
          {
            name: "Technology",
            icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695219a5003be273ee49/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Technology",
            icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6952695c003e40a1102c/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Technology",
            icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695219900007059ac2cb/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Technology",
            icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695219ab0019b9847999/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Technology",
            icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/69526962002d4cdff6c9/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Technology",
            icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695798080010b92e9830/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Technology",
            icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695269be003360bed809/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Technology",
            icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6952199a00375ca93a4b/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Technology",
            icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695219b20015c62ac492/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Technology",
            icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695219bd0033f3c61edc/view?project=694cc43b00225b94d30d",
          },
        ],
        backgroundColor: "theme-bg-white-green-gradient",
      },
      order: 5,
      isActive: true,
    },
    {
      type: "partners",
      content: {
        title: "Trusted By Industry Leaders",
        description:
          "We're proud to partner with leading companies across various sectors",
        partners: [
          {
            name: "Partner 1",
            logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba5d003008864d7b/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Partner 2",
            logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba62001457f024ef/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Partner 3",
            logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba6700016cac0e12/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Partner 4",
            logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba6b0032b310923f/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Partner 5",
            logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba7100113ef921e4/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Partner 6",
            logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba7c0012eee875af/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Partner 7",
            logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba760029ccc019e4/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Partner 8",
            logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba810038059a3274/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Partner 9",
            logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba900020801ed88d/view?project=694cc43b00225b94d30d",
          },
          {
            name: "Partner 10",
            logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba94003bdd021354/view?project=694cc43b00225b94d30d",
          },
        ],
        backgroundColor: "white",
      },
      order: 6,
      isActive: true,
    },
    {
      type: "cta",
      content: {
        title: "Ready to Work Together?",
        description:
          "Let's discuss how we can help transform your business with innovative technology solutions.",
        buttonText: "Get in Touch",
        buttonLink: "/contact",
        backgroundColor: "theme-bg-white-green-gradient",
      },
      order: 7,
      isActive: true,
    },
  ],
};

/**
 * Get template by name
 */
export function getTemplate(templateName: string): PageTemplate | null {
  const templates: Record<string, PageTemplate> = {
    about: aboutPageTemplate,
    "about-us": aboutPageTemplate,
    "about us": aboutPageTemplate,
    contact: contactPageTemplate,
    "contact-us": contactPageTemplate,
    "contact us": contactPageTemplate,
    "get-in-touch": contactPageTemplate,
  };

  return templates[templateName.toLowerCase()] || null;
}

/**
 * Check if a page slug or title matches an About page pattern
 */
export function isAboutPage(slug: string, title: string): boolean {
  const aboutPatterns = ["about", "about-us", "aboutus", "about us"];
  const slugLower = slug.toLowerCase();
  const titleLower = title.toLowerCase();

  return (
    aboutPatterns.some((pattern) => slugLower.includes(pattern)) ||
    aboutPatterns.some((pattern) => titleLower.includes(pattern))
  );
}

/**
 * Contact Page Template
 * A custom contact page with hero, form, and advantages section
 */
export const contactPageTemplate: PageTemplate = {
  name: "Contact",
  description: "A custom contact page with form and company advantages",
  sections: [
    {
      type: "hero",
      content: {
        title: "Send Us a Message",
        subtitle: "Get in Touch",
        description:
          "Have a question or want to discuss your project? We'd love to hear from you.",
        buttonText: "",
        buttonLink: "",
        secondaryButtonText: "",
        secondaryButtonLink: "",
        image: "",
        backgroundColor: "white",
      },
      order: 0,
      isActive: true,
    },
  ],
};

/**
 * Check if a page slug or title matches a Contact page pattern
 */
export function isContactPage(slug: string, title: string): boolean {
  const contactPatterns = [
    "contact",
    "contact-us",
    "contactus",
    "get-in-touch",
  ];
  const slugLower = slug.toLowerCase();
  const titleLower = title.toLowerCase();

  return (
    contactPatterns.some((pattern) => slugLower.includes(pattern)) ||
    contactPatterns.some((pattern) => titleLower.includes(pattern))
  );
}

/**
 * Get all available templates
 */
export function getAllTemplates(): PageTemplate[] {
  return [aboutPageTemplate, contactPageTemplate];
}
