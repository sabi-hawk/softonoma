// Service-specific content templates
export interface ServiceContentTemplate {
  hero: {
    title: string;
    description: string;
    primaryButtonText: string;
  };
  overview: {
    title: string;
    paragraphs: string[];
    image: string;
  };
  stats: Array<{ icon: string; value: string; label: string }>;
  subServices: Array<{ icon: string; title: string; description: string }>;
  whyChooseUs: {
    subtitle: string;
    items: string[];
    image: string;
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
  partners: Array<{
    name: string;
    logo: string;
  }>;
}
