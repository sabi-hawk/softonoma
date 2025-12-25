"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SectionRenderer from "@/components/sections/SectionRenderer";
import { ISection } from "@/models/Section";
import FileUpload from "@/components/admin/FileUpload";
import IconUpload from "@/components/admin/IconUpload";

interface Section {
  _id: string;
  pageId: string;
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
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    backgroundColor?: string;
    backgroundColorOpacity?: number;
    textColor?: string;
    buttonText?: string;
    buttonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    image?: string;
    services?: Array<{
      icon?: string;
      title: string;
      description: string;
    }>;
    cardBackgroundColor?: string;
    cardTextColor?: string;
    cardBorderColor?: string;
    stats?: Array<{
      number: string;
      title: string;
      description: string;
    }>;
    leftContent?: string;
    rightContent?: string;
    industries?: Array<{
      icon?: string;
      name: string;
    }>;
    aboutImage?: string;
    aboutText?: string;
    aboutLink?: string;
    aboutLinkText?: string;
    partnerships?: Array<{
      image?: string;
      title: string;
      description: string;
    }>;
    [key: string]: unknown;
  };
  order: number;
  isActive: boolean;
}

interface Page {
  _id: string;
  title: string;
  slug: string;
  content?: string;
}

export default function PageSectionsAdmin() {
  const params = useParams();
  const pageId = params.id as string;

  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showPagePreview, setShowPagePreview] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [sectionForm, setSectionForm] = useState({
    type: "hero" as Section["type"],
    content: {} as Section["content"],
    isActive: true,
  });

  const fetchData = useCallback(async () => {
    try {
      const pageRes = await fetch(`/api/pages/id/${pageId}`);
      const pageData = await pageRes.json();

      if (pageData.success) {
        setPage(pageData.data);

        // Fetch sections for all pages
        const sectionsRes = await fetch(`/api/sections?pageId=${pageId}`);
        const sectionsData = await sectionsRes.json();
        if (sectionsData.success) {
          setSections(sectionsData.data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-hide preview when section form is opened
  useEffect(() => {
    if (showSectionForm) {
      setShowPagePreview(false);
    }
  }, [showSectionForm]);

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSection
        ? `/api/sections/${editingSection._id}`
        : "/api/sections";
      const method = editingSection ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sectionForm,
          pageId,
          order: editingSection ? editingSection.order : sections.length,
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchData();
        setShowSectionForm(false);
        setEditingSection(null);
        resetForm();
      } else {
        alert(data.error || "Error saving section");
      }
    } catch (error) {
      console.error("Error saving section:", error);
      alert("Error saving section");
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    try {
      const res = await fetch(`/api/sections/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      } else {
        alert(data.error || "Error deleting section");
      }
    } catch (error) {
      console.error("Error deleting section:", error);
      alert("Error deleting section");
    }
  };

  const handleReorder = async (newSections: Section[]) => {
    try {
      const res = await fetch("/api/sections/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: newSections.map((section, index) => ({
            id: section._id,
            order: index,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSections(newSections);
      }
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSections.length) return;

    [newSections[index], newSections[newIndex]] = [
      newSections[newIndex],
      newSections[index],
    ];
    setSections(newSections);
    handleReorder(newSections);
  };

  const editSection = (section: Section) => {
    setEditingSection(section);
    setSectionForm({
      type: section.type,
      content: section.content ? { ...section.content } : {},
      isActive: section.isActive,
    });
    setShowSectionForm(true);
  };

  // Get default content based on section type - aligned with homepage theme
  const getDefaultContent = (type: Section["type"]): Section["content"] => {
    const defaults: Record<Section["type"], Section["content"]> = {
      hero: {
        title: "Welcome to Our Platform",
        subtitle: "Innovative Solutions for Modern Businesses",
        description:
          "Transform your business with cutting-edge technology solutions. We deliver excellence through innovation, expertise, and dedication.",
        // Colors are predefined by theme - automatically uses dark gradient
        buttonText: "Get Started",
        buttonLink: "/contact",
        secondaryButtonText: "Learn More",
        secondaryButtonLink: "/about",
      },
      services: {
        title: "Our Top-Class Services",
        description: "Discover our comprehensive range of services",
        // Colors and card styling are predefined by theme - matches homepage
        services: [
          {
            icon: "💻",
            title: "Web Development",
            description:
              "Custom web applications built with modern technologies and best practices.",
          },
          {
            icon: "📱",
            title: "Mobile Apps",
            description:
              "Native and cross-platform mobile applications for iOS and Android.",
          },
          {
            icon: "☁️",
            title: "Cloud Solutions",
            description:
              "Scalable cloud infrastructure and migration services for your business.",
          },
        ],
      },
      stats: {
        title: "Our Achievements",
        description: "Numbers that speak for themselves",
        // Colors are predefined by theme - automatically uses white background
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
            description: "Satisfied customers who trust us with their business",
          },
          {
            number: "10+",
            title: "Years Experience",
            description: "Years of expertise in delivering quality solutions",
          },
        ],
      },
      cta: {
        title: "Ready to Transform Your Business?",
        description: "Get started today and experience the difference",
        buttonText: "Get Started",
        buttonLink: "/contact",
      },
      footer: {
        companyName: "IT Solutions",
        companyDescription:
          "Leading IT solutions provider delivering innovative technology services to businesses worldwide.",
        email: "contact@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Tech Street, Silicon Valley, CA 94000",
        quickLinks: [
          { title: "Home", href: "/" },
          { title: "About Us", href: "/about" },
          { title: "Services", href: "/services" },
          { title: "Contact", href: "/contact" },
        ],
        footerServices: [
          { title: "Web Development", href: "/services/web-development" },
          { title: "Mobile Apps", href: "/services/mobile-apps" },
          { title: "Cloud Solutions", href: "/services/cloud" },
        ],
        newsletterText:
          "Subscribe to our newsletter for the latest updates and insights.",
        newsletterButtonText: "Subscribe",
      },
      features: {
        title: "Why Choose Us",
        description:
          "Discover what makes us different and why clients trust us",
        image: "",
        features: [
          {
            title: "Expert Team",
            description:
              "Our team consists of experienced professionals with years of industry expertise.",
          },
          {
            title: "Quality Assurance",
            description:
              "We maintain the highest standards in all our projects and deliverables.",
          },
          {
            title: "24/7 Support",
            description:
              "Round-the-clock customer support to assist you whenever you need help.",
          },
        ],
      },
      cards: {
        title: "What Our Clients Say",
        description: "Hear from our satisfied customers about their experience",
        showStars: true,
        items: [
          {
            quote:
              "Outstanding service and excellent support throughout the project. Highly recommended!",
            author: "John Doe",
            role: "CEO",
            company: "Tech Corp",
          },
          {
            quote:
              "The team delivered exactly what we needed on time and within budget. Great work!",
            author: "Jane Smith",
            role: "CTO",
            company: "Innovate Inc",
          },
          {
            quote:
              "Professional, reliable, and innovative solutions. We couldn't be happier!",
            author: "Mike Johnson",
            role: "Founder",
            company: "StartupXYZ",
          },
        ],
      },
      industries: {
        title: "Industries We Work With",
        description: "Serving diverse industries with tailored solutions",
        // Colors are predefined by theme - automatically uses light theme
        industries: [
          { icon: "💼", name: "Business" },
          { icon: "🏥", name: "Healthcare" },
          { icon: "🎓", name: "Education" },
          { icon: "🏦", name: "Finance" },
        ],
      },
      about: {
        title: "About Us",
        description: "Learn more about our company and our mission",
        // Colors are predefined by theme - automatically uses light theme
        aboutText:
          "We are a leading technology company dedicated to delivering innovative solutions that drive business growth. With years of experience and a team of skilled professionals, we help businesses transform their digital presence and achieve their goals. Our commitment to excellence and customer satisfaction sets us apart in the industry.",
        aboutImage: "",
        aboutLink: "/about",
        aboutLinkText: "Learn more about us",
      },
      partnerships: {
        title: "Our Partnerships",
        description: "Trusted by leading organizations worldwide",
        // Colors are predefined by theme - automatically uses dark gradient
        partnerships: [
          {
            image: "",
            title: "Strategic Technology Partner",
            description:
              "Collaborating with industry leaders to deliver cutting-edge solutions.",
          },
          {
            image: "",
            title: "Global Enterprise Alliance",
            description:
              "Working with Fortune 500 companies to transform their digital infrastructure.",
          },
          {
            image: "",
            title: "Innovation Hub Partnership",
            description:
              "Partnering with startups and innovation centers to drive technological advancement.",
          },
        ],
      },
      portfolio: {
        title: "Our Portfolio",
        description: "Explore our successful projects and case studies",
        projects: [
          {
            image: "",
            title: "E-Commerce Platform",
            description:
              "A modern e-commerce solution with advanced features and seamless user experience.",
            technologies: ["React", "Node.js", "MongoDB"],
            category: "Web Development",
            link: "/portfolio/ecommerce-platform",
          },
          {
            image: "",
            title: "Mobile Banking App",
            description:
              "Secure and user-friendly mobile banking application for iOS and Android.",
            technologies: ["React Native", "Firebase", "Stripe"],
            category: "Mobile Apps",
            link: "/portfolio/mobile-banking",
          },
          {
            image: "",
            title: "Cloud Migration Project",
            description:
              "Successfully migrated enterprise infrastructure to AWS cloud platform.",
            technologies: ["AWS", "Docker", "Kubernetes"],
            category: "Cloud Solutions",
            link: "/portfolio/cloud-migration",
          },
        ],
      },
      technologies: {
        title: "Technologies We Work With",
        description:
          "Cutting-edge tools and frameworks we use to build amazing solutions",
        technologies: [
          { name: "React", icon: "⚛️", category: "Frontend" },
          { name: "Node.js", icon: "🟢", category: "Backend" },
          { name: "TypeScript", icon: "📘", category: "Language" },
          { name: "AWS", icon: "☁️", category: "Cloud" },
          { name: "Docker", icon: "🐳", category: "DevOps" },
          { name: "MongoDB", icon: "🍃", category: "Database" },
        ],
      },
      blog: {
        title: "Latest Blog Posts",
        description:
          "Stay updated with our latest insights, tutorials, and industry news",
        posts: [
          {
            image: "",
            title: "10 Best Practices for Modern Web Development",
            excerpt:
              "Discover the essential best practices that every web developer should follow in 2024.",
            author: "John Doe",
            date: "March 15, 2024",
            category: "Development",
            link: "/blog/web-development-best-practices",
          },
          {
            image: "",
            title: "Cloud Migration: A Complete Guide",
            excerpt:
              "Learn how to successfully migrate your infrastructure to the cloud with our comprehensive guide.",
            author: "Jane Smith",
            date: "March 10, 2024",
            category: "Cloud",
            link: "/blog/cloud-migration-guide",
          },
          {
            image: "",
            title: "Mobile App Security: What You Need to Know",
            excerpt:
              "Essential security practices for mobile app development to protect user data.",
            author: "Mike Johnson",
            date: "March 5, 2024",
            category: "Security",
            link: "/blog/mobile-app-security",
          },
        ],
      },
      process: {
        title: "Our Development Process",
        description:
          "A proven methodology that ensures successful project delivery",
        steps: [
          {
            number: "1",
            icon: "🔍",
            title: "Discovery & Planning",
            description:
              "We start by understanding your business needs, goals, and requirements to create a comprehensive project plan.",
          },
          {
            number: "2",
            icon: "🎨",
            title: "Design & Prototyping",
            description:
              "Our design team creates intuitive user interfaces and prototypes to visualize the final product.",
          },
          {
            number: "3",
            icon: "💻",
            title: "Development",
            description:
              "Our developers build your solution using agile methodology with regular updates and feedback loops.",
          },
          {
            number: "4",
            icon: "🚀",
            title: "Testing & Launch",
            description:
              "Rigorous testing ensures quality, followed by deployment and ongoing support for your success.",
          },
        ],
      },
      faq: {
        title: "Frequently Asked Questions",
        description:
          "Find answers to common questions about our services and processes",
        faqs: [
          {
            question: "What services do you offer?",
            answer:
              "We offer a comprehensive range of IT services including web development, mobile app development, cloud solutions, UI/UX design, and technology consulting. Our team specializes in modern technologies and can help you with any digital transformation needs.",
          },
          {
            question: "How long does a typical project take?",
            answer:
              "Project timelines vary depending on the scope and complexity. A simple website might take 4-6 weeks, while a complex enterprise application could take 3-6 months. We provide detailed timelines during the discovery phase.",
          },
          {
            question: "Do you provide ongoing support?",
            answer:
              "Yes, we offer comprehensive support and maintenance packages. Our team is available 24/7 to ensure your systems run smoothly and to address any issues that may arise.",
          },
          {
            question: "What technologies do you work with?",
            answer:
              "We work with a wide range of modern technologies including React, Node.js, Python, AWS, Docker, Kubernetes, and many more. We choose the best technology stack based on your specific project requirements.",
          },
        ],
      },
      partners: {
        title: "Our Partners",
        description:
          "We work with trusted partners and brands worldwide to deliver exceptional results.",
        partners: [
          {
            logo: "https://via.placeholder.com/150x80?text=Partner+1",
            name: "Partner 1",
          },
          {
            logo: "https://via.placeholder.com/150x80?text=Partner+2",
            name: "Partner 2",
          },
          {
            logo: "https://via.placeholder.com/150x80?text=Partner+3",
            name: "Partner 3",
          },
        ],
      },
    };
    return defaults[type] || {};
  };

  const resetForm = () => {
    const defaultContent = getDefaultContent("hero");
    setSectionForm({
      type: "hero",
      content: defaultContent,
      isActive: true,
    });
  };

  const updateContentField = (
    field: string,
    value: string | string[] | unknown
  ) => {
    setSectionForm({
      ...sectionForm,
      content: {
        ...sectionForm.content,
        [field]: value,
      },
    });
  };

  // Services helpers
  const addService = () => {
    const services = Array.isArray(sectionForm.content.services)
      ? [...sectionForm.content.services]
      : [];
    services.push({ title: "", description: "", icon: "" });
    updateContentField("services", services);
  };

  const updateService = (index: number, field: string, value: string) => {
    const services = Array.isArray(sectionForm.content.services)
      ? [...sectionForm.content.services]
      : [];
    services[index] = { ...services[index], [field]: value };
    updateContentField("services", services);
  };

  const removeService = (index: number) => {
    const services = Array.isArray(sectionForm.content.services)
      ? [...sectionForm.content.services]
      : [];
    services.splice(index, 1);
    updateContentField("services", services);
  };

  // Stats helpers
  const addStat = () => {
    const stats = Array.isArray(sectionForm.content.stats)
      ? [...sectionForm.content.stats]
      : [];
    stats.push({ number: "", title: "", description: "" });
    updateContentField("stats", stats);
  };

  const updateStat = (index: number, field: string, value: string) => {
    const stats = Array.isArray(sectionForm.content.stats)
      ? [...sectionForm.content.stats]
      : [];
    stats[index] = { ...stats[index], [field]: value };
    updateContentField("stats", stats);
  };

  const removeStat = (index: number) => {
    const stats = Array.isArray(sectionForm.content.stats)
      ? [...sectionForm.content.stats]
      : [];
    stats.splice(index, 1);
    updateContentField("stats", stats);
  };

  // Industries helpers
  const addIndustry = () => {
    const industries = Array.isArray(sectionForm.content.industries)
      ? [...sectionForm.content.industries]
      : [];
    industries.push({ name: "", icon: "" });
    updateContentField("industries", industries);
  };

  const updateIndustry = (index: number, field: string, value: string) => {
    const industries = Array.isArray(sectionForm.content.industries)
      ? [...sectionForm.content.industries]
      : [];
    industries[index] = { ...industries[index], [field]: value };
    updateContentField("industries", industries);
  };

  const removeIndustry = (index: number) => {
    const industries = Array.isArray(sectionForm.content.industries)
      ? [...sectionForm.content.industries]
      : [];
    industries.splice(index, 1);
    updateContentField("industries", industries);
  };

  // Partnerships helpers
  const addPartnership = () => {
    const partnerships = Array.isArray(sectionForm.content.partnerships)
      ? [...sectionForm.content.partnerships]
      : [];
    partnerships.push({ title: "", description: "", image: "" });
    updateContentField("partnerships", partnerships);
  };

  const updatePartnership = (index: number, field: string, value: string) => {
    const partnerships = Array.isArray(sectionForm.content.partnerships)
      ? [...sectionForm.content.partnerships]
      : [];
    partnerships[index] = { ...partnerships[index], [field]: value };
    updateContentField("partnerships", partnerships);
  };

  const removePartnership = (index: number) => {
    const partnerships = Array.isArray(sectionForm.content.partnerships)
      ? [...sectionForm.content.partnerships]
      : [];
    partnerships.splice(index, 1);
    updateContentField("partnerships", partnerships);
  };

  // Portfolio helpers
  const addProject = () => {
    const projects = Array.isArray(sectionForm.content.projects)
      ? [...sectionForm.content.projects]
      : [];
    projects.push({
      image: "",
      title: "",
      description: "",
      technologies: [],
      category: "",
      link: "",
    });
    updateContentField("projects", projects);
  };

  const updateProject = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    const projects = Array.isArray(sectionForm.content.projects)
      ? [...sectionForm.content.projects]
      : [];
    projects[index] = { ...projects[index], [field]: value };
    updateContentField("projects", projects);
  };

  const removeProject = (index: number) => {
    const projects = Array.isArray(sectionForm.content.projects)
      ? [...sectionForm.content.projects]
      : [];
    projects.splice(index, 1);
    updateContentField("projects", projects);
  };

  // Technologies helpers
  const addTechnology = () => {
    const technologies = Array.isArray(sectionForm.content.technologies)
      ? [...sectionForm.content.technologies]
      : [];
    technologies.push({ icon: "" });
    updateContentField("technologies", technologies);
  };

  const updateTechnology = (index: number, value: string) => {
    const technologies = Array.isArray(sectionForm.content.technologies)
      ? [...sectionForm.content.technologies]
      : [];
    technologies[index] = { icon: value };
    updateContentField("technologies", technologies);
  };

  const removeTechnology = (index: number) => {
    const technologies = Array.isArray(sectionForm.content.technologies)
      ? [...sectionForm.content.technologies]
      : [];
    technologies.splice(index, 1);
    updateContentField("technologies", technologies);
  };

  // Partners helpers
  const addPartner = () => {
    const partners = Array.isArray(sectionForm.content.partners)
      ? [...sectionForm.content.partners]
      : [];
    partners.push({ logo: "", name: "" });
    updateContentField("partners", partners);
  };

  const updatePartner = (index: number, field: string, value: string) => {
    const partners = Array.isArray(sectionForm.content.partners)
      ? [...sectionForm.content.partners]
      : [];
    partners[index] = { ...partners[index], [field]: value };
    updateContentField("partners", partners);
  };

  const removePartner = (index: number) => {
    const partners = Array.isArray(sectionForm.content.partners)
      ? [...sectionForm.content.partners]
      : [];
    partners.splice(index, 1);
    updateContentField("partners", partners);
  };

  // Blog helpers
  const addPost = () => {
    const posts = Array.isArray(sectionForm.content.posts)
      ? [...sectionForm.content.posts]
      : [];
    posts.push({
      image: "",
      title: "",
      excerpt: "",
      author: "",
      date: "",
      category: "",
      link: "",
    });
    updateContentField("posts", posts);
  };

  const updatePost = (index: number, field: string, value: string) => {
    const posts = Array.isArray(sectionForm.content.posts)
      ? [...sectionForm.content.posts]
      : [];
    posts[index] = { ...posts[index], [field]: value };
    updateContentField("posts", posts);
  };

  const removePost = (index: number) => {
    const posts = Array.isArray(sectionForm.content.posts)
      ? [...sectionForm.content.posts]
      : [];
    posts.splice(index, 1);
    updateContentField("posts", posts);
  };

  // Process helpers
  const addStep = () => {
    const steps = Array.isArray(sectionForm.content.steps)
      ? [...sectionForm.content.steps]
      : [];
    steps.push({ number: "", icon: "", title: "", description: "" });
    updateContentField("steps", steps);
  };

  const updateStep = (index: number, field: string, value: string) => {
    const steps = Array.isArray(sectionForm.content.steps)
      ? [...sectionForm.content.steps]
      : [];
    steps[index] = { ...steps[index], [field]: value };
    updateContentField("steps", steps);
  };

  const removeStep = (index: number) => {
    const steps = Array.isArray(sectionForm.content.steps)
      ? [...sectionForm.content.steps]
      : [];
    steps.splice(index, 1);
    updateContentField("steps", steps);
  };

  // FAQ helpers
  const addFAQ = () => {
    const faqs = Array.isArray(sectionForm.content.faqs)
      ? [...sectionForm.content.faqs]
      : [];
    faqs.push({ question: "", answer: "" });
    updateContentField("faqs", faqs);
  };

  const updateFAQ = (index: number, field: string, value: string) => {
    const faqs = Array.isArray(sectionForm.content.faqs)
      ? [...sectionForm.content.faqs]
      : [];
    faqs[index] = { ...faqs[index], [field]: value };
    updateContentField("faqs", faqs);
  };

  const removeFAQ = (index: number) => {
    const faqs = Array.isArray(sectionForm.content.faqs)
      ? [...sectionForm.content.faqs]
      : [];
    faqs.splice(index, 1);
    updateContentField("faqs", faqs);
  };

  // Create preview section object
  const previewSection = {
    _id: editingSection?._id || "preview",
    pageId: pageId,
    type: sectionForm.type,
    content: sectionForm.content,
    order: 0,
    isActive: sectionForm.isActive,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as ISection;

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!page) {
    return (
      <div className="p-8">
        <p>Page not found</p>
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          ← Back to Admin
        </Link>
      </div>
    );
  }

  // All pages use sections approach
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            Sections for: {page.title}
          </h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Sections ({sections.length})
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPagePreview(!showPagePreview)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              {showPagePreview ? <>Hide Preview</> : <>Preview Page</>}
            </button>
            <button
              onClick={() => {
                setEditingSection(null);
                resetForm();
                setShowSectionForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              + Add Section
            </button>
          </div>
        </div>

        {showSectionForm && (
          <div className="mb-6 space-y-6">
            {/* Form Panel */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingSection ? "Edit" : "Add"} Section
                </h3>
                <button
                  onClick={() => {
                    setShowSectionForm(false);
                    setEditingSection(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSectionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={sectionForm.type}
                    onChange={(e) => {
                      const newType = e.target.value as Section["type"];
                      const defaultContent = getDefaultContent(newType);
                      setSectionForm({
                        ...sectionForm,
                        type: newType,
                        content: defaultContent,
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    required
                  >
                    <option value="hero">Hero</option>
                    <option value="services">Services</option>
                    <option value="stats">Stats/Numbers</option>
                    <option value="industries">Industries</option>
                    <option value="about">About Us</option>
                    <option value="partnerships">Partnerships</option>
                    <option value="cta">Call to Action (CTA)</option>
                    <option value="footer">Footer</option>
                    <option value="features">Features</option>
                    <option value="cards">Cards</option>
                    <option value="portfolio">Portfolio/Case Studies</option>
                    <option value="technologies">Technologies/Stack</option>
                    <option value="blog">Blog/Resources</option>
                    <option value="process">Process/Methodology</option>
                    <option value="faq">FAQ</option>
                    <option value="partners">Partners/Brands</option>
                  </select>
                </div>

                {/* Common Fields */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={sectionForm.content.title || ""}
                    onChange={(e) =>
                      updateContentField("title", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                {(sectionForm.type === "hero" ||
                  sectionForm.type === "services" ||
                  sectionForm.type === "stats" ||
                  sectionForm.type === "industries" ||
                  sectionForm.type === "about" ||
                  sectionForm.type === "partnerships" ||
                  sectionForm.type === "cta" ||
                  sectionForm.type === "features" ||
                  sectionForm.type === "cards" ||
                  sectionForm.type === "portfolio" ||
                  sectionForm.type === "technologies" ||
                  sectionForm.type === "blog" ||
                  sectionForm.type === "process" ||
                  sectionForm.type === "faq") && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      value={sectionForm.content.description || ""}
                      onChange={(e) =>
                        updateContentField("description", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                )}

                {/* Hero-specific fields */}
                {sectionForm.type === "hero" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={sectionForm.content.subtitle || ""}
                        onChange={(e) =>
                          updateContentField("subtitle", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <FileUpload
                      label="Background Image"
                      value={
                        (sectionForm.content.backgroundImage as string) || ""
                      }
                      onChange={(url) =>
                        updateContentField("backgroundImage", url)
                      }
                      type="image"
                      folder="hero-backgrounds"
                    />
                    <FileUpload
                      label="Background Video"
                      value={
                        (sectionForm.content.backgroundVideo as string) || ""
                      }
                      onChange={(url) =>
                        updateContentField("backgroundVideo", url)
                      }
                      type="video"
                      folder="hero-backgrounds"
                      accept="video/mp4,video/webm"
                    />
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Background Opacity (0-1)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        placeholder="0.3"
                        value={
                          (sectionForm.content.backgroundOpacity as number) ||
                          0.3
                        }
                        onChange={(e) =>
                          updateContentField(
                            "backgroundOpacity",
                            parseFloat(e.target.value) || 0.3
                          )
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Opacity for background image/video (0 = transparent, 1 =
                        fully opaque). Default: 0.3
                      </p>
                    </div>
                  </>
                )}

                {/* Services-specific fields */}
                {sectionForm.type === "services" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Services
                      </label>
                      <button
                        type="button"
                        onClick={addService}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        + Add Service
                      </button>
                    </div>
                    {Array.isArray(sectionForm.content.services) &&
                      sectionForm.content.services.map((service, index) => (
                        <div
                          key={index}
                          className="mb-4 p-3 border rounded-md dark:border-gray-600"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Service {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <IconUpload
                            label="Icon (Emoji, URL, or Image)"
                            value={service.icon || ""}
                            onChange={(value) =>
                              updateService(index, "icon", value)
                            }
                            folder="service-icons"
                            placeholder="📱 or https://example.com/icon.png or upload image"
                          />
                          <input
                            type="text"
                            placeholder="Title"
                            value={service.title}
                            onChange={(e) =>
                              updateService(index, "title", e.target.value)
                            }
                            className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            required
                          />
                          <textarea
                            placeholder="Description"
                            value={service.description}
                            onChange={(e) =>
                              updateService(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            rows={3}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            required
                          />
                        </div>
                      ))}
                  </div>
                )}

                {/* Stats-specific fields */}
                {sectionForm.type === "stats" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Statistics
                      </label>
                      <button
                        type="button"
                        onClick={addStat}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        + Add Stat
                      </button>
                    </div>
                    {Array.isArray(sectionForm.content.stats) &&
                      sectionForm.content.stats.map((stat, index) => (
                        <div
                          key={index}
                          className="mb-4 p-3 border rounded-md dark:border-gray-600"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Stat {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeStat(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Number (e.g., 250+)"
                            value={stat.number}
                            onChange={(e) =>
                              updateStat(index, "number", e.target.value)
                            }
                            className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Title"
                            value={stat.title}
                            onChange={(e) =>
                              updateStat(index, "title", e.target.value)
                            }
                            className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            required
                          />
                          <textarea
                            placeholder="Description"
                            value={stat.description}
                            onChange={(e) =>
                              updateStat(index, "description", e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            required
                          />
                        </div>
                      ))}
                  </div>
                )}

                {/* CTA-specific fields */}
                {sectionForm.type === "cta" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={sectionForm.content.buttonText || ""}
                        onChange={(e) =>
                          updateContentField("buttonText", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Get Started"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Button Link
                      </label>
                      <input
                        type="text"
                        value={sectionForm.content.buttonLink || ""}
                        onChange={(e) =>
                          updateContentField("buttonLink", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="/contact"
                      />
                    </div>
                  </>
                )}

                {/* Industries-specific fields */}
                {sectionForm.type === "industries" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Industries
                      </label>
                      <button
                        type="button"
                        onClick={addIndustry}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        + Add Industry
                      </button>
                    </div>
                    {Array.isArray(sectionForm.content.industries) &&
                      sectionForm.content.industries.map((industry, index) => (
                        <div
                          key={index}
                          className="mb-4 p-3 border rounded-md dark:border-gray-600"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Industry {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeIndustry(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <IconUpload
                            label="Icon (Emoji, URL, or Image)"
                            value={industry.icon || ""}
                            onChange={(value) =>
                              updateIndustry(index, "icon", value)
                            }
                            folder="industry-icons"
                            placeholder="🏠 or https://example.com/icon.png or upload image"
                          />
                          <input
                            type="text"
                            placeholder="Industry Name"
                            value={industry.name}
                            onChange={(e) =>
                              updateIndustry(index, "name", e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            required
                          />
                        </div>
                      ))}
                  </div>
                )}

                {/* About-specific fields */}
                {sectionForm.type === "about" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        About Text
                      </label>
                      <textarea
                        value={sectionForm.content.aboutText || ""}
                        onChange={(e) =>
                          updateContentField("aboutText", e.target.value)
                        }
                        rows={8}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="About us content (plain text only)"
                      />
                    </div>
                    <FileUpload
                      label="About Image"
                      value={(sectionForm.content.aboutImage as string) || ""}
                      onChange={(url) => updateContentField("aboutImage", url)}
                      type="image"
                      folder="about-images"
                    />
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Link Text
                      </label>
                      <input
                        type="text"
                        value={sectionForm.content.aboutLinkText || ""}
                        onChange={(e) =>
                          updateContentField("aboutLinkText", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Learn more about us"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Link URL
                      </label>
                      <input
                        type="text"
                        value={sectionForm.content.aboutLink || ""}
                        onChange={(e) =>
                          updateContentField("aboutLink", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="/about"
                      />
                    </div>
                  </>
                )}

                {/* Partnerships-specific fields */}
                {sectionForm.type === "partnerships" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Partnerships
                      </label>
                      <button
                        type="button"
                        onClick={addPartnership}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        + Add Partnership
                      </button>
                    </div>
                    {Array.isArray(sectionForm.content.partnerships) &&
                      sectionForm.content.partnerships.map(
                        (partnership, index) => (
                          <div
                            key={index}
                            className="mb-4 p-3 border rounded-md dark:border-gray-600"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">
                                Partnership {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removePartnership(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <FileUpload
                              label="Partnership Image"
                              value={partnership.image || ""}
                              onChange={(url) =>
                                updatePartnership(index, "image", url)
                              }
                              type="image"
                              folder="partnerships"
                              className="mb-2"
                            />
                            <input
                              type="text"
                              placeholder="Title"
                              value={partnership.title}
                              onChange={(e) =>
                                updatePartnership(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              required
                            />
                            <textarea
                              placeholder="Description"
                              value={partnership.description}
                              onChange={(e) =>
                                updatePartnership(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={4}
                              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              required
                            />
                          </div>
                        )
                      )}
                  </div>
                )}

                {/* Footer-specific fields */}
                {sectionForm.type === "footer" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={
                          (sectionForm.content.companyName as string) || ""
                        }
                        onChange={(e) =>
                          updateContentField("companyName", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Company Description
                      </label>
                      <textarea
                        value={
                          (sectionForm.content.companyDescription as string) ||
                          ""
                        }
                        onChange={(e) =>
                          updateContentField(
                            "companyDescription",
                            e.target.value
                          )
                        }
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={(sectionForm.content.email as string) || ""}
                          onChange={(e) =>
                            updateContentField("email", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={(sectionForm.content.phone as string) || ""}
                          onChange={(e) =>
                            updateContentField("phone", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={(sectionForm.content.address as string) || ""}
                        onChange={(e) =>
                          updateContentField("address", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Facebook URL
                        </label>
                        <input
                          type="url"
                          value={(sectionForm.content.facebook as string) || ""}
                          onChange={(e) =>
                            updateContentField("facebook", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Twitter URL
                        </label>
                        <input
                          type="url"
                          value={(sectionForm.content.twitter as string) || ""}
                          onChange={(e) =>
                            updateContentField("twitter", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          LinkedIn URL
                        </label>
                        <input
                          type="url"
                          value={(sectionForm.content.linkedin as string) || ""}
                          onChange={(e) =>
                            updateContentField("linkedin", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          value={(sectionForm.content.github as string) || ""}
                          onChange={(e) =>
                            updateContentField("github", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">
                          Quick Links
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const links = Array.isArray(
                              sectionForm.content.quickLinks
                            )
                              ? [...sectionForm.content.quickLinks]
                              : [];
                            links.push({ title: "", href: "" });
                            updateContentField("quickLinks", links);
                          }}
                          className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          + Add Link
                        </button>
                      </div>
                      {Array.isArray(sectionForm.content.quickLinks) &&
                        sectionForm.content.quickLinks.map(
                          (
                            link: { title: string; href: string },
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="mb-4 p-3 border rounded-md dark:border-gray-600"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">
                                  Link {index + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const links = Array.isArray(
                                      sectionForm.content.quickLinks
                                    )
                                      ? [...sectionForm.content.quickLinks]
                                      : [];
                                    links.splice(index, 1);
                                    updateContentField("quickLinks", links);
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                              <input
                                type="text"
                                placeholder="Link Title"
                                value={link.title || ""}
                                onChange={(e) => {
                                  const links = Array.isArray(
                                    sectionForm.content.quickLinks
                                  )
                                    ? [...sectionForm.content.quickLinks]
                                    : [];
                                  links[index] = {
                                    ...links[index],
                                    title: e.target.value,
                                  };
                                  updateContentField("quickLinks", links);
                                }}
                                className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                placeholder="Link URL"
                                value={link.href || ""}
                                onChange={(e) => {
                                  const links = Array.isArray(
                                    sectionForm.content.quickLinks
                                  )
                                    ? [...sectionForm.content.quickLinks]
                                    : [];
                                  links[index] = {
                                    ...links[index],
                                    href: e.target.value,
                                  };
                                  updateContentField("quickLinks", links);
                                }}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                            </div>
                          )
                        )}
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">
                          Services Links
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const services = Array.isArray(
                              sectionForm.content.footerServices
                            )
                              ? [...sectionForm.content.footerServices]
                              : [];
                            services.push({ title: "", href: "" });
                            updateContentField("footerServices", services);
                          }}
                          className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          + Add Service
                        </button>
                      </div>
                      {Array.isArray(sectionForm.content.footerServices) &&
                        sectionForm.content.footerServices.map(
                          (
                            service: { title: string; href: string },
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="mb-4 p-3 border rounded-md dark:border-gray-600"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">
                                  Service {index + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const services = Array.isArray(
                                      sectionForm.content.footerServices
                                    )
                                      ? [...sectionForm.content.footerServices]
                                      : [];
                                    services.splice(index, 1);
                                    updateContentField(
                                      "footerServices",
                                      services
                                    );
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                              <input
                                type="text"
                                placeholder="Service Title"
                                value={service.title || ""}
                                onChange={(e) => {
                                  const services = Array.isArray(
                                    sectionForm.content.footerServices
                                  )
                                    ? [...sectionForm.content.footerServices]
                                    : [];
                                  services[index] = {
                                    ...services[index],
                                    title: e.target.value,
                                  };
                                  updateContentField(
                                    "footerServices",
                                    services
                                  );
                                }}
                                className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                placeholder="Service URL"
                                value={service.href || ""}
                                onChange={(e) => {
                                  const services = Array.isArray(
                                    sectionForm.content.footerServices
                                  )
                                    ? [...sectionForm.content.footerServices]
                                    : [];
                                  services[index] = {
                                    ...services[index],
                                    href: e.target.value,
                                  };
                                  updateContentField(
                                    "footerServices",
                                    services
                                  );
                                }}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                            </div>
                          )
                        )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Newsletter Text
                      </label>
                      <textarea
                        value={
                          (sectionForm.content.newsletterText as string) || ""
                        }
                        onChange={(e) =>
                          updateContentField("newsletterText", e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Subscribe to our newsletter..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Newsletter Button Text
                      </label>
                      <input
                        type="text"
                        value={
                          (sectionForm.content
                            .newsletterButtonText as string) || ""
                        }
                        onChange={(e) =>
                          updateContentField(
                            "newsletterButtonText",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Subscribe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Copyright Text
                      </label>
                      <input
                        type="text"
                        value={
                          (sectionForm.content.copyrightText as string) || ""
                        }
                        onChange={(e) =>
                          updateContentField("copyrightText", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Leave empty for default"
                      />
                    </div>
                  </>
                )}

                {/* Features specific fields */}
                {sectionForm.type === "features" && (
                  <>
                    <FileUpload
                      label="Feature Image"
                      value={(sectionForm.content.image as string) || ""}
                      onChange={(url) => updateContentField("image", url)}
                      type="image"
                      folder="features"
                    />
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">
                          Features
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const features = Array.isArray(
                              sectionForm.content.features
                            )
                              ? [...sectionForm.content.features]
                              : [];
                            features.push({ title: "", description: "" });
                            updateContentField("features", features);
                          }}
                          className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          + Add Feature
                        </button>
                      </div>
                      {Array.isArray(sectionForm.content.features) &&
                        sectionForm.content.features.map(
                          (
                            feature: { title: string; description: string },
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="mb-4 p-3 border rounded-md dark:border-gray-600"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">
                                  Feature {index + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const features = Array.isArray(
                                      sectionForm.content.features
                                    )
                                      ? [...sectionForm.content.features]
                                      : [];
                                    features.splice(index, 1);
                                    updateContentField("features", features);
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                              <input
                                type="text"
                                placeholder="Feature Title"
                                value={feature.title || ""}
                                onChange={(e) => {
                                  const features = Array.isArray(
                                    sectionForm.content.features
                                  )
                                    ? [...sectionForm.content.features]
                                    : [];
                                  features[index] = {
                                    ...features[index],
                                    title: e.target.value,
                                  };
                                  updateContentField("features", features);
                                }}
                                className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                              <textarea
                                placeholder="Feature Description"
                                value={feature.description || ""}
                                onChange={(e) => {
                                  const features = Array.isArray(
                                    sectionForm.content.features
                                  )
                                    ? [...sectionForm.content.features]
                                    : [];
                                  features[index] = {
                                    ...features[index],
                                    description: e.target.value,
                                  };
                                  updateContentField("features", features);
                                }}
                                rows={3}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                            </div>
                          )
                        )}
                    </div>
                  </>
                )}

                {/* Cards specific fields */}
                {sectionForm.type === "cards" && (
                  <>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={sectionForm.content.showStars !== false}
                          onChange={(e) =>
                            updateContentField("showStars", e.target.checked)
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">Show Star Rating</span>
                      </label>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium">
                          Items
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const items = Array.isArray(
                              sectionForm.content.items
                            )
                              ? [...sectionForm.content.items]
                              : [];
                            items.push({
                              quote: "",
                              author: "",
                              role: "",
                              company: "",
                            });
                            updateContentField("items", items);
                          }}
                          className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          + Add Item
                        </button>
                      </div>
                      {Array.isArray(sectionForm.content.items) &&
                        sectionForm.content.items.map(
                          (
                            item: {
                              quote: string;
                              author: string;
                              role?: string;
                              company?: string;
                            },
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="mb-4 p-3 border rounded-md dark:border-gray-600"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">
                                  Item {index + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const items = Array.isArray(
                                      sectionForm.content.items
                                    )
                                      ? [...sectionForm.content.items]
                                      : [];
                                    items.splice(index, 1);
                                    updateContentField("items", items);
                                  }}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                              <textarea
                                placeholder="Quote/Content"
                                value={item.quote || ""}
                                onChange={(e) => {
                                  const items = Array.isArray(
                                    sectionForm.content.items
                                  )
                                    ? [...sectionForm.content.items]
                                    : [];
                                  items[index] = {
                                    ...items[index],
                                    quote: e.target.value,
                                  };
                                  updateContentField("items", items);
                                }}
                                rows={3}
                                className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                placeholder="Author Name"
                                value={item.author || ""}
                                onChange={(e) => {
                                  const items = Array.isArray(
                                    sectionForm.content.items
                                  )
                                    ? [...sectionForm.content.items]
                                    : [];
                                  items[index] = {
                                    ...items[index],
                                    author: e.target.value,
                                  };
                                  updateContentField("items", items);
                                }}
                                className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                placeholder="Role (Optional)"
                                value={item.role || ""}
                                onChange={(e) => {
                                  const items = Array.isArray(
                                    sectionForm.content.items
                                  )
                                    ? [...sectionForm.content.items]
                                    : [];
                                  items[index] = {
                                    ...items[index],
                                    role: e.target.value,
                                  };
                                  updateContentField("items", items);
                                }}
                                className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                placeholder="Company (Optional)"
                                value={item.company || ""}
                                onChange={(e) => {
                                  const items = Array.isArray(
                                    sectionForm.content.items
                                  )
                                    ? [...sectionForm.content.items]
                                    : [];
                                  items[index] = {
                                    ...items[index],
                                    company: e.target.value,
                                  };
                                  updateContentField("items", items);
                                }}
                                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                            </div>
                          )
                        )}
                    </div>
                  </>
                )}

                {/* Portfolio specific fields */}
                {sectionForm.type === "portfolio" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Projects
                      </label>
                      <button
                        type="button"
                        onClick={addProject}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        + Add Project
                      </button>
                    </div>
                    {Array.isArray(sectionForm.content.projects) &&
                      sectionForm.content.projects.map(
                        (
                          project: {
                            image?: string;
                            title?: string;
                            description?: string;
                            technologies?: string[];
                            category?: string;
                            link?: string;
                          },
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="mb-4 p-3 border rounded-md dark:border-gray-600"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">
                                Project {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeProject(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <FileUpload
                              label="Project Image"
                              value={project.image || ""}
                              onChange={(url) =>
                                updateProject(index, "image", url)
                              }
                              type="image"
                              folder="portfolio"
                              className="mb-2"
                            />
                            <input
                              type="text"
                              placeholder="Title"
                              value={project.title || ""}
                              onChange={(e) =>
                                updateProject(index, "title", e.target.value)
                              }
                              className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              required
                            />
                            <textarea
                              placeholder="Description"
                              value={project.description || ""}
                              onChange={(e) =>
                                updateProject(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={3}
                              className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Category (e.g., Web Development)"
                              value={project.category || ""}
                              onChange={(e) =>
                                updateProject(index, "category", e.target.value)
                              }
                              className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                            <input
                              type="text"
                              placeholder="Technologies (comma-separated, e.g., React, Node.js)"
                              value={
                                Array.isArray(project.technologies)
                                  ? project.technologies.join(", ")
                                  : ""
                              }
                              onChange={(e) =>
                                updateProject(
                                  index,
                                  "technologies",
                                  e.target.value
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter((t) => t)
                                )
                              }
                              className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                            <input
                              type="text"
                              placeholder="Link URL"
                              value={project.link || ""}
                              onChange={(e) =>
                                updateProject(index, "link", e.target.value)
                              }
                              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                          </div>
                        )
                      )}
                  </div>
                )}

                {/* Technologies specific fields */}
                {sectionForm.type === "technologies" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Technologies
                      </label>
                      <button
                        type="button"
                        onClick={addTechnology}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        + Add Technology
                      </button>
                    </div>
                    {Array.isArray(sectionForm.content.technologies) &&
                      sectionForm.content.technologies.map(
                        (
                          tech: {
                            icon?: string;
                          },
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="mb-4 p-3 border rounded-md dark:border-gray-600"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">
                                Technology {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeTechnology(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <IconUpload
                              label="Logo (Image URL, Emoji, or Upload)"
                              value={tech.icon || ""}
                              onChange={(value) =>
                                updateTechnology(index, value)
                              }
                              folder="technologies"
                              placeholder="🚀 or https://example.com/logo.png or upload image"
                            />
                          </div>
                        )
                      )}
                  </div>
                )}

                {/* Partners specific fields */}
                {sectionForm.type === "partners" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Partners
                      </label>
                      <button
                        type="button"
                        onClick={addPartner}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        + Add Partner
                      </button>
                    </div>
                    {Array.isArray(sectionForm.content.partners) &&
                      sectionForm.content.partners.map(
                        (
                          partner: {
                            logo?: string;
                            name?: string;
                          },
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="mb-4 p-3 border rounded-md dark:border-gray-600"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">
                                Partner {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removePartner(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <IconUpload
                              label="Logo (Image URL, Emoji, or Upload)"
                              value={partner.logo || ""}
                              onChange={(value) =>
                                updatePartner(index, "logo", value)
                              }
                              folder="partners"
                              placeholder="🚀 or https://example.com/logo.png or upload image"
                            />
                            <input
                              type="text"
                              placeholder="Partner Name (optional)"
                              value={partner.name || ""}
                              onChange={(e) =>
                                updatePartner(index, "name", e.target.value)
                              }
                              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                            />
                          </div>
                        )
                      )}
                  </div>
                )}

                {/* Blog specific fields */}
                {sectionForm.type === "blog" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Blog Posts
                      </label>
                      <button
                        type="button"
                        onClick={addPost}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        + Add Post
                      </button>
                    </div>
                    {Array.isArray(sectionForm.content.posts) &&
                      sectionForm.content.posts.map(
                        (
                          post: {
                            image?: string;
                            title?: string;
                            excerpt?: string;
                            author?: string;
                            date?: string;
                            category?: string;
                            link?: string;
                          },
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="mb-4 p-3 border rounded-md dark:border-gray-600"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">
                                Post {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removePost(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <FileUpload
                              label="Post Image"
                              value={post.image || ""}
                              onChange={(url) =>
                                updatePost(index, "image", url)
                              }
                              type="image"
                              folder="blog"
                              className="mb-2"
                            />
                            <input
                              type="text"
                              placeholder="Title"
                              value={post.title || ""}
                              onChange={(e) =>
                                updatePost(index, "title", e.target.value)
                              }
                              className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              required
                            />
                            <textarea
                              placeholder="Excerpt"
                              value={post.excerpt || ""}
                              onChange={(e) =>
                                updatePost(index, "excerpt", e.target.value)
                              }
                              rows={3}
                              className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              required
                            />
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Author"
                                value={post.author || ""}
                                onChange={(e) =>
                                  updatePost(index, "author", e.target.value)
                                }
                                className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                placeholder="Date (e.g., March 15, 2024)"
                                value={post.date || ""}
                                onChange={(e) =>
                                  updatePost(index, "date", e.target.value)
                                }
                                className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Category"
                                value={post.category || ""}
                                onChange={(e) =>
                                  updatePost(index, "category", e.target.value)
                                }
                                className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                              <input
                                type="text"
                                placeholder="Link URL"
                                value={post.link || ""}
                                onChange={(e) =>
                                  updatePost(index, "link", e.target.value)
                                }
                                className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                            </div>
                          </div>
                        )
                      )}
                  </div>
                )}

                {/* Process specific fields */}
                {sectionForm.type === "process" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Process Steps
                      </label>
                      <button
                        type="button"
                        onClick={addStep}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        + Add Step
                      </button>
                    </div>
                    {Array.isArray(sectionForm.content.steps) &&
                      sectionForm.content.steps.map(
                        (
                          step: {
                            number?: string;
                            icon?: string;
                            title?: string;
                            description?: string;
                          },
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="mb-4 p-3 border rounded-md dark:border-gray-600"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">
                                Step {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeStep(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Number (e.g., 1)"
                                value={step.number || ""}
                                onChange={(e) =>
                                  updateStep(index, "number", e.target.value)
                                }
                                className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              />
                              <div>
                                <IconUpload
                                  label="Icon (Emoji, URL, or Upload)"
                                  value={step.icon || ""}
                                  onChange={(value) =>
                                    updateStep(index, "icon", value)
                                  }
                                  folder="process-icons"
                                  placeholder="📋 or https://example.com/icon.png or upload image"
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <input
                              type="text"
                              placeholder="Title"
                              value={step.title || ""}
                              onChange={(e) =>
                                updateStep(index, "title", e.target.value)
                              }
                              className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              required
                            />
                            <textarea
                              placeholder="Description"
                              value={step.description || ""}
                              onChange={(e) =>
                                updateStep(index, "description", e.target.value)
                              }
                              rows={3}
                              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              required
                            />
                          </div>
                        )
                      )}
                  </div>
                )}

                {/* FAQ specific fields */}
                {sectionForm.type === "faq" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">FAQs</label>
                      <button
                        type="button"
                        onClick={addFAQ}
                        className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        + Add FAQ
                      </button>
                    </div>
                    {Array.isArray(sectionForm.content.faqs) &&
                      sectionForm.content.faqs.map(
                        (
                          faq: {
                            question?: string;
                            answer?: string;
                          },
                          index: number
                        ) => (
                          <div
                            key={index}
                            className="mb-4 p-3 border rounded-md dark:border-gray-600"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">
                                FAQ {index + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFAQ(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Question"
                              value={faq.question || ""}
                              onChange={(e) =>
                                updateFAQ(index, "question", e.target.value)
                              }
                              className="w-full mb-2 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              required
                            />
                            <textarea
                              placeholder="Answer"
                              value={faq.answer || ""}
                              onChange={(e) =>
                                updateFAQ(index, "answer", e.target.value)
                              }
                              rows={4}
                              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                              required
                            />
                          </div>
                        )
                      )}
                  </div>
                )}

                {/* Button fields for Hero */}
                {sectionForm.type === "hero" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Primary Button Text
                      </label>
                      <input
                        type="text"
                        value={sectionForm.content.buttonText || ""}
                        onChange={(e) =>
                          updateContentField("buttonText", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Primary Button Link
                      </label>
                      <input
                        type="text"
                        value={sectionForm.content.buttonLink || ""}
                        onChange={(e) =>
                          updateContentField("buttonLink", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Secondary Button Text
                      </label>
                      <input
                        type="text"
                        value={sectionForm.content.secondaryButtonText || ""}
                        onChange={(e) =>
                          updateContentField(
                            "secondaryButtonText",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Secondary Button Link
                      </label>
                      <input
                        type="text"
                        value={sectionForm.content.secondaryButtonLink || ""}
                        onChange={(e) =>
                          updateContentField(
                            "secondaryButtonLink",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </>
                )}

                {/* Note: Colors are predefined and match the homepage theme */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Theme:</strong> Section colors are automatically set
                    to match the homepage theme. Dark sections use the gradient
                    background, light sections use white background.
                  </p>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sectionForm.isActive}
                      onChange={(e) =>
                        setSectionForm({
                          ...sectionForm,
                          isActive: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Section is active</span>
                  </label>
                </div>

                <div className="flex space-x-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {editingSection ? "Update" : "Create"} Section
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSectionForm(false);
                      setEditingSection(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Panel - Moved to Bottom */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="min-h-[400px] max-h-[800px] overflow-y-auto bg-gray-50 dark:bg-gray-900">
                  <SectionRenderer section={previewSection} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sections List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sections.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No sections yet. Click &quot;Add Section&quot; to get
                    started.
                  </td>
                </tr>
              ) : (
                sections.map((section, index) => (
                  <tr key={section._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveSection(index, "up")}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {section.order}
                        </span>
                        <button
                          onClick={() => moveSection(index, "down")}
                          disabled={index === sections.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                      {section.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {section.content?.title || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          section.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {section.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => editSection(section)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Full Page Preview - At the very bottom */}
        {showPagePreview && (
          <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Full Page Preview
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
                  title="Reload preview to see latest changes"
                >
                  <span>🔄</span>
                  Reload
                </button>
                <button
                  onClick={() => setShowPagePreview(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div
                className="bg-gray-50 dark:bg-gray-900 overflow-y-auto"
                style={{ maxHeight: "80vh" }}
              >
                {sections.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No sections to preview. Add sections to see the full page
                      preview.
                    </p>
                  </div>
                ) : (
                  <div>
                    {sections
                      .filter((section) => section.isActive)
                      .sort((a, b) => a.order - b.order)
                      .map((section) => (
                        <SectionRenderer
                          key={section._id}
                          section={section as unknown as ISection}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
