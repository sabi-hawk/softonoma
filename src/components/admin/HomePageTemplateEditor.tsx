"use client";

import { useState, useEffect } from "react";
import { defaultHomePageData, parseHomePageData } from "@/lib/homepage-data";
import HomePage from "@/components/HomePage";

// Define HomePageData type locally
interface HomePageData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    backgroundImage?: string;
  };
  services: {
    title: string;
    description: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  about: {
    title: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
    }>;
    image?: string;
  };
  stats: {
    title: string;
    items: Array<{
      number: string;
      label: string;
    }>;
  };
  industries: {
    title: string;
    description: string;
    items: Array<{
      icon: string;
      name: string;
    }>;
  };
  testimonials: {
    title: string;
    description: string;
    items: Array<{
      quote: string;
      author: string;
      company: string;
      role?: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

interface HomePageTemplateEditorProps {
  pageId: string;
  initialContent: string;
  onSave: (content: string) => Promise<void>;
}

export default function HomePageTemplateEditor({
  initialContent,
  onSave,
}: HomePageTemplateEditorProps) {
  const [data, setData] = useState<HomePageData>(() => {
    return parseHomePageData(initialContent) || defaultHomePageData;
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "hero"
    | "services"
    | "about"
    | "stats"
    | "industries"
    | "testimonials"
    | "cta"
  >("hero");

  // Update data when initialContent changes
  useEffect(() => {
    if (initialContent) {
      const parsed = parseHomePageData(initialContent);
      if (parsed) {
        setData(parsed);
      }
    }
  }, [initialContent]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const content = JSON.stringify(data);
      await onSave(content);
      alert("Homepage content saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving homepage content");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (
    section: keyof HomePageData,
    field: string,
    value: string
  ) => {
    setData((prev: HomePageData) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateArrayItem = (
    section: keyof HomePageData,
    index: number,
    field: string,
    value: string
  ) => {
    setData((prev: HomePageData) => {
      const sectionData = prev[section] as { items?: unknown[] };
      const items = [...(sectionData.items || [])];
      items[index] = {
        ...(items[index] as Record<string, unknown>),
        [field]: value,
      };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          items,
        } as HomePageData[keyof HomePageData],
      };
    });
  };

  const addArrayItem = (
    section: keyof HomePageData,
    newItem: Record<string, string>
  ) => {
    setData((prev: HomePageData) => {
      const sectionData = prev[section] as { items?: Record<string, string>[] };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          items: [...(sectionData.items || []), newItem],
        } as HomePageData[keyof HomePageData],
      };
    });
  };

  const removeArrayItem = (section: keyof HomePageData, index: number) => {
    setData((prev: HomePageData) => {
      const sectionData = prev[section] as { items?: unknown[] };
      const items = [...(sectionData.items || [])];
      items.splice(index, 1);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          items,
        } as HomePageData[keyof HomePageData],
      };
    });
  };

  const tabs = [
    { id: "hero", label: "Hero" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "stats", label: "Stats" },
    { id: "industries", label: "Industries" },
    { id: "testimonials", label: "Testimonials" },
    { id: "cta", label: "CTA" },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-6">
        {/* Editor Panel */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {activeTab === "hero" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Hero Section</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <textarea
                  value={data.hero.title}
                  onChange={(e) => updateField("hero", "title", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use \n for line breaks
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={data.hero.subtitle}
                  onChange={(e) =>
                    updateField("hero", "subtitle", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={data.hero.description}
                  onChange={(e) =>
                    updateField("hero", "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={data.hero.primaryButtonText}
                    onChange={(e) =>
                      updateField("hero", "primaryButtonText", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={data.hero.primaryButtonLink}
                    onChange={(e) =>
                      updateField("hero", "primaryButtonLink", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={data.hero.secondaryButtonText}
                    onChange={(e) =>
                      updateField("hero", "secondaryButtonText", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={data.hero.secondaryButtonLink}
                    onChange={(e) =>
                      updateField("hero", "secondaryButtonLink", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Services</h3>
                <button
                  onClick={() =>
                    addArrayItem("services", {
                      icon: "💼",
                      title: "New Service",
                      description: "Service description",
                    })
                  }
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  + Add Service
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={data.services.title}
                  onChange={(e) =>
                    updateField("services", "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Section Description
                </label>
                <textarea
                  value={data.services.description}
                  onChange={(e) =>
                    updateField("services", "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                {data.services.items.map(
                  (
                    service: {
                      icon: string;
                      title: string;
                      description: string;
                    },
                    index: number
                  ) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Service {index + 1}
                        </span>
                        <button
                          onClick={() => removeArrayItem("services", index)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Icon
                        </label>
                        <input
                          type="text"
                          value={service.icon}
                          onChange={(e) =>
                            updateArrayItem(
                              "services",
                              index,
                              "icon",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md mb-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) =>
                            updateArrayItem(
                              "services",
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md mb-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Description
                        </label>
                        <textarea
                          value={service.description}
                          onChange={(e) =>
                            updateArrayItem(
                              "services",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          rows={2}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About Section</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={data.about.title}
                  onChange={(e) =>
                    updateField("about", "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={data.about.description}
                  onChange={(e) =>
                    updateField("about", "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div className="space-y-4">
                {data.about.features.map(
                  (
                    feature: { title: string; description: string },
                    index: number
                  ) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Feature {index + 1}
                        </span>
                        <button
                          onClick={() => removeArrayItem("about", index)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) =>
                            updateArrayItem(
                              "about",
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md mb-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Description
                        </label>
                        <textarea
                          value={feature.description}
                          onChange={(e) =>
                            updateArrayItem(
                              "about",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          rows={2}
                        />
                      </div>
                    </div>
                  )
                )}
                <button
                  onClick={() =>
                    addArrayItem("about", {
                      title: "New Feature",
                      description: "Feature description",
                    })
                  }
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  + Add Feature
                </button>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stats Section</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={data.stats.title}
                  onChange={(e) =>
                    updateField("stats", "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-4">
                {data.stats.items.map(
                  (stat: { number: string; label: string }, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Stat {index + 1}
                        </span>
                        <button
                          onClick={() => removeArrayItem("stats", index)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Number
                        </label>
                        <input
                          type="text"
                          value={stat.number}
                          onChange={(e) =>
                            updateArrayItem(
                              "stats",
                              index,
                              "number",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md mb-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) =>
                            updateArrayItem(
                              "stats",
                              index,
                              "label",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                  )
                )}
                <button
                  onClick={() =>
                    addArrayItem("stats", {
                      number: "0+",
                      label: "New Stat",
                    })
                  }
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  + Add Stat
                </button>
              </div>
            </div>
          )}

          {activeTab === "industries" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Industries</h3>
                <button
                  onClick={() =>
                    addArrayItem("industries", {
                      icon: "🏢",
                      name: "New Industry",
                    })
                  }
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  + Add Industry
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={data.industries.title}
                  onChange={(e) =>
                    updateField("industries", "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Section Description
                </label>
                <textarea
                  value={data.industries.description}
                  onChange={(e) =>
                    updateField("industries", "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                {data.industries.items.map(
                  (industry: { icon: string; name: string }, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Industry {index + 1}
                        </span>
                        <button
                          onClick={() => removeArrayItem("industries", index)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Icon
                        </label>
                        <input
                          type="text"
                          value={industry.icon}
                          onChange={(e) =>
                            updateArrayItem(
                              "industries",
                              index,
                              "icon",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md mb-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={industry.name}
                          onChange={(e) =>
                            updateArrayItem(
                              "industries",
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === "testimonials" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Testimonials</h3>
                <button
                  onClick={() =>
                    addArrayItem("testimonials", {
                      quote: "Great service!",
                      author: "John Doe",
                      company: "Company Name",
                      role: "CEO",
                    })
                  }
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  + Add Testimonial
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={data.testimonials.title}
                  onChange={(e) =>
                    updateField("testimonials", "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Section Description
                </label>
                <textarea
                  value={data.testimonials.description}
                  onChange={(e) =>
                    updateField("testimonials", "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                />
              </div>
              <div className="space-y-4">
                {data.testimonials.items.map(
                  (
                    testimonial: {
                      quote: string;
                      author: string;
                      company: string;
                      role?: string;
                    },
                    index: number
                  ) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Testimonial {index + 1}
                        </span>
                        <button
                          onClick={() => removeArrayItem("testimonials", index)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Quote
                        </label>
                        <textarea
                          value={testimonial.quote}
                          onChange={(e) =>
                            updateArrayItem(
                              "testimonials",
                              index,
                              "quote",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md mb-2"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Author
                        </label>
                        <input
                          type="text"
                          value={testimonial.author}
                          onChange={(e) =>
                            updateArrayItem(
                              "testimonials",
                              index,
                              "author",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md mb-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          value={testimonial.company}
                          onChange={(e) =>
                            updateArrayItem(
                              "testimonials",
                              index,
                              "company",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md mb-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Role (Optional)
                        </label>
                        <input
                          type="text"
                          value={testimonial.role || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              "testimonials",
                              index,
                              "role",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === "cta" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">CTA Section</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={data.cta.title}
                  onChange={(e) => updateField("cta", "title", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={data.cta.description}
                  onChange={(e) =>
                    updateField("cta", "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={data.cta.buttonText}
                  onChange={(e) =>
                    updateField("cta", "buttonText", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Button Link
                </label>
                <input
                  type="text"
                  value={data.cta.buttonLink}
                  onChange={(e) =>
                    updateField("cta", "buttonLink", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Preview Panel - At the bottom */}
        <div className="bg-gray-50 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="max-h-[800px] overflow-y-auto">
              <HomePage data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
