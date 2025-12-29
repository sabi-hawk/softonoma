// Industry-specific content templates
export interface IndustryContentTemplate {
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
  technologies: Array<{ name: string; icon: string }>;
  cards: Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
  }>;
  partners: Array<{
    name: string;
    logo: string;
  }>;
}

