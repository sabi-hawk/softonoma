"use client";

import { useState, useEffect } from "react";
import { IndustryTemplateData } from "@/lib/industry-template";
import IndustryTemplate from "@/components/IndustryTemplate";
import {
  defaultIndustryTemplateData,
  parseIndustryTemplateData,
} from "@/lib/industry-template";
import FileUpload from "@/components/admin/FileUpload";
import IconUpload from "@/components/admin/IconUpload";

interface IndustryTemplateEditorProps {
  initialContent: string;
  industryTitle: string;
  onSave: (content: string) => Promise<void>;
}

export default function IndustryTemplateEditor({
  initialContent,
  industryTitle,
  onSave,
}: IndustryTemplateEditorProps) {
  const [data, setData] = useState<IndustryTemplateData>(() => {
    return (
      parseIndustryTemplateData(initialContent) || defaultIndustryTemplateData
    );
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "hero"
    | "overview"
    | "stats"
    | "subServices"
    | "partners"
    | "cards"
    | "portfolio"
    | "technologies"
    | "sectionOrder"
  >("hero");

  // Update data when initialContent changes
  useEffect(() => {
    if (initialContent) {
      const parsed = parseIndustryTemplateData(initialContent);
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
      alert("Industry content saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving industry content");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (
    section: keyof IndustryTemplateData,
    field: string,
    value: string
  ) => {
    setData(
      (prev: IndustryTemplateData) =>
        ({
          ...prev,
          [section]: {
            ...(prev[section] as Record<string, unknown>),
            [field]: value,
          },
        } as IndustryTemplateData)
    );
  };

  const updateArrayItem = (
    section: keyof IndustryTemplateData,
    index: number,
    field: string,
    value: string
  ) => {
    setData((prev: IndustryTemplateData) => {
      const sectionData = prev[section] as {
        items?: unknown[];
        projects?: unknown[];
        partners?: unknown[];
        paragraphs?: unknown[];
      };

      // Handle different array field names
      let items: unknown[] = [];
      if (section === "portfolio" && sectionData.projects) {
        items = [...sectionData.projects];
      } else if (section === "partners" && sectionData.partners) {
        items = [...sectionData.partners];
      } else if (section === "overview" && sectionData.paragraphs) {
        items = [...sectionData.paragraphs];
      } else if (sectionData.items) {
        items = [...sectionData.items];
      }

      items[index] = {
        ...(items[index] as Record<string, unknown>),
        [field]: value,
      };

      if (section === "portfolio") {
        const portfolioData = prev.portfolio || { title: "", projects: [] };
        return {
          ...prev,
          portfolio: {
            title: portfolioData.title,
            description: portfolioData.description,
            isActive: portfolioData.isActive,
            projects: items as NonNullable<
              IndustryTemplateData["portfolio"]
            >["projects"],
          },
        } as IndustryTemplateData;
      } else if (section === "partners") {
        const partnersData = prev.partners || { title: "", partners: [] };
        return {
          ...prev,
          partners: {
            title: partnersData.title,
            description: partnersData.description,
            isActive: partnersData.isActive,
            partners: items as NonNullable<
              IndustryTemplateData["partners"]
            >["partners"],
          },
        } as IndustryTemplateData;
      } else if (section === "overview") {
        const overviewData = prev.overview;
        return {
          ...prev,
          overview: {
            ...overviewData,
            paragraphs: items as IndustryTemplateData["overview"]["paragraphs"],
          },
        } as IndustryTemplateData;
      }

      return {
        ...prev,
        [section]: {
          ...(prev[section] as { items?: unknown[] }),
          items,
        },
      } as IndustryTemplateData;
    });
  };

  const addArrayItem = (
    section: keyof IndustryTemplateData,
    newItem: Record<string, string>
  ) => {
    setData((prev: IndustryTemplateData) => {
      const sectionData = prev[section] as { items?: Record<string, string>[] };
      // Initialize section if it doesn't exist
      if (!prev[section]) {
        return {
          ...prev,
          [section]: {
            title: "",
            description: "",
            items: [newItem],
          },
        } as IndustryTemplateData;
      }
      return {
        ...prev,
        [section]: {
          ...(prev[section] as { items?: Record<string, string>[] }),
          items: [...(sectionData.items || []), newItem],
        },
      } as IndustryTemplateData;
    });
  };

  const removeArrayItem = (
    section: keyof IndustryTemplateData,
    index: number
  ) => {
    setData((prev: IndustryTemplateData) => {
      const sectionData = prev[section] as { items?: unknown[] };
      const items = [...(sectionData.items || [])];
      items.splice(index, 1);
      return {
        ...prev,
        [section]: {
          ...(prev[section] as { items?: unknown[] }),
          items,
        },
      } as IndustryTemplateData;
    });
  };

  const tabs = [
    { id: "hero", label: "Hero" },
    { id: "overview", label: "Overview" },
    { id: "stats", label: "Stats" },
    { id: "subServices", label: "Sub Services" },
    { id: "partners", label: "Partners" },
    { id: "cards", label: "Cards" },
    { id: "portfolio", label: "Portfolio" },
    { id: "technologies", label: "Technologies" },
    { id: "sectionOrder", label: "Section Order" },
  ];

  const updateNumberField = (
    section: keyof IndustryTemplateData,
    field: string,
    value: number
  ) => {
    setData(
      (prev: IndustryTemplateData) =>
        ({
          ...prev,
          [section]: {
            ...(prev[section] as Record<string, unknown>),
            [field]: value,
          },
        } as IndustryTemplateData)
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs - Scrollable */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <style jsx>{`
          nav {
            overflow-x: auto;
            scrollbar-width: thin;
            scrollbar-color: #475569 #1e293b;
          }
          nav::-webkit-scrollbar {
            height: 6px;
          }
          nav::-webkit-scrollbar-track {
            background: #1e293b;
          }
          nav::-webkit-scrollbar-thumb {
            background: #475569;
          }
          nav::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
        `}</style>
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`shrink-0 whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-6">
        {/* Editor Panel */}
        <div className=" dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          {activeTab === "hero" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Hero Section
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Note: Hero section is always active and cannot be disabled.
              </p>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={data.hero.title}
                  onChange={(e) => updateField("hero", "title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Breadcrumbs (optional)
                </label>
                <input
                  type="text"
                  value={data.hero.breadcrumbs || ""}
                  onChange={(e) =>
                    updateField("hero", "breadcrumbs", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Home / Industries / Industry Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Subtitle (optional)
                </label>
                <input
                  type="text"
                  value={data.hero.subtitle || ""}
                  onChange={(e) =>
                    updateField("hero", "subtitle", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={data.hero.description}
                  onChange={(e) =>
                    updateField("hero", "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={data.hero.primaryButtonText}
                    onChange={(e) =>
                      updateField("hero", "primaryButtonText", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={data.hero.primaryButtonLink}
                    onChange={(e) =>
                      updateField("hero", "primaryButtonLink", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <FileUpload
                label="Background Image (optional)"
                value={data.hero.backgroundImage || ""}
                onChange={(url) => updateField("hero", "backgroundImage", url)}
                type="image"
                folder="industry-hero-backgrounds"
              />
              <FileUpload
                label="Background Video (optional)"
                value={data.hero.backgroundVideo || ""}
                onChange={(url) => updateField("hero", "backgroundVideo", url)}
                type="video"
                folder="industry-hero-backgrounds"
                accept="video/mp4,video/webm"
              />
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Background Opacity (0-1)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={data.hero.backgroundOpacity ?? 0.3}
                  onChange={(e) =>
                    updateNumberField(
                      "hero",
                      "backgroundOpacity",
                      parseFloat(e.target.value) || 0.3
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Opacity for background image/video (0 = transparent, 1 = fully
                  opaque). Default: 0.3
                </p>
              </div>
            </div>
          )}

          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Overview Section
                </h3>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={data.overview.isActive !== false}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        overview: {
                          ...prev.overview,
                          isActive: e.target.checked,
                        },
                      }))
                    }
                    className="rounded"
                  />
                  Active
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={data.overview.title}
                  onChange={(e) =>
                    updateField("overview", "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Paragraphs (with checkmarks)
                  </label>
                  <button
                    onClick={() => {
                      setData((prev) => ({
                        ...prev,
                        overview: {
                          ...prev.overview,
                          paragraphs: [
                            ...prev.overview.paragraphs,
                            { text: "" },
                          ],
                        },
                      }));
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add Paragraph
                  </button>
                </div>
                {data.overview.paragraphs.map((para, index) => (
                  <div
                    key={index}
                    className="mb-3 p-3 border border-gray-300 dark:border-gray-600 rounded"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Paragraph {index + 1}
                      </span>
                      <button
                        onClick={() => {
                          setData((prev) => ({
                            ...prev,
                            overview: {
                              ...prev.overview,
                              paragraphs: prev.overview.paragraphs.filter(
                                (_, i) => i !== index
                              ),
                            },
                          }));
                        }}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={para.text}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          overview: {
                            ...prev.overview,
                            paragraphs: prev.overview.paragraphs.map((p, i) =>
                              i === index ? { text: e.target.value } : p
                            ),
                          },
                        }));
                      }}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      rows={3}
                    />
                  </div>
                ))}
              </div>
              <FileUpload
                label="Overview Image (optional)"
                value={data.overview.image || ""}
                onChange={(url) => updateField("overview", "image", url)}
                type="image"
                folder="industry-overview"
              />
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Stats Section
                </h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={data.stats?.isActive !== false}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          stats: {
                            ...(prev.stats || { items: [] }),
                            isActive: e.target.checked,
                          },
                        }))
                      }
                      className="rounded"
                    />
                    Active
                  </label>
                  <button
                    onClick={() => {
                      if (!data.stats) {
                        setData((prev) => ({
                          ...prev,
                          stats: { items: [] },
                        }));
                      }
                      setData((prev) => ({
                        ...prev,
                        stats: {
                          items: [
                            ...(prev.stats?.items || []),
                            { icon: "", value: "", label: "" },
                          ],
                        },
                      }));
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add Stat
                  </button>
                </div>
              </div>
              {data.stats?.items.map((stat, index) => (
                <div
                  key={index}
                  className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Stat {index + 1}
                    </h4>
                    <button
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          stats: {
                            items:
                              prev.stats?.items?.filter(
                                (_, i) => i !== index
                              ) || [],
                          },
                        }));
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div>
                    <IconUpload
                      label="Icon (emoji, URL, or upload image)"
                      value={stat.icon || ""}
                      onChange={(url) => {
                        setData((prev) => ({
                          ...prev,
                          stats: {
                            items:
                              prev.stats?.items?.map((s, i) =>
                                i === index ? { ...s, icon: url } : s
                              ) || [],
                          },
                        }));
                      }}
                      folder="industry-stats-icons"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Value
                    </label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          stats: {
                            items:
                              prev.stats?.items?.map((s, i) =>
                                i === index
                                  ? { ...s, value: e.target.value }
                                  : s
                              ) || [],
                          },
                        }));
                      }}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="400+"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Label
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        setData((prev) => ({
                          ...prev,
                          stats: {
                            items:
                              prev.stats?.items?.map((s, i) =>
                                i === index
                                  ? { ...s, label: e.target.value }
                                  : s
                              ) || [],
                          },
                        }));
                      }}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Software Developers"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "subServices" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sub Services Section
                </h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={data.subServices?.isActive !== false}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          subServices: {
                            ...(prev.subServices || { title: "", items: [] }),
                            isActive: e.target.checked,
                          },
                        }))
                      }
                      className="rounded"
                    />
                    Active
                  </label>
                  <button
                    onClick={() => {
                      if (!data.subServices) {
                        setData((prev) => ({
                          ...prev,
                          subServices: {
                            title: "",
                            items: [],
                          },
                        }));
                      }
                      setData((prev) => ({
                        ...prev,
                        subServices: {
                          ...prev.subServices!,
                          items: [
                            ...(prev.subServices?.items || []),
                            { icon: "", title: "", description: "" },
                          ],
                        },
                      }));
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add Service
                  </button>
                </div>
              </div>
              {data.subServices && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={data.subServices.title}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          subServices: {
                            ...prev.subServices!,
                            title: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Section Description (optional)
                    </label>
                    <textarea
                      value={data.subServices.description || ""}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          subServices: {
                            ...prev.subServices!,
                            description: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={2}
                    />
                  </div>
                  {data.subServices.items.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Service {index + 1}
                        </h4>
                        <button
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              subServices: {
                                ...prev.subServices!,
                                items:
                                  prev.subServices?.items?.filter(
                                    (_, i) => i !== index
                                  ) || [],
                              },
                            }));
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <IconUpload
                          label="Icon (emoji, URL, or upload image)"
                          value={item.icon || ""}
                          onChange={(url) => {
                            setData((prev) => ({
                              ...prev,
                              subServices: {
                                ...prev.subServices!,
                                items:
                                  prev.subServices?.items?.map((s, i) =>
                                    i === index ? { ...s, icon: url } : s
                                  ) || [],
                              },
                            }));
                          }}
                          folder="industry-subservices-icons"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              subServices: {
                                ...prev.subServices!,
                                items:
                                  prev.subServices?.items?.map((s, i) =>
                                    i === index
                                      ? { ...s, title: e.target.value }
                                      : s
                                  ) || [],
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              subServices: {
                                ...prev.subServices!,
                                items:
                                  prev.subServices?.items?.map((s, i) =>
                                    i === index
                                      ? { ...s, description: e.target.value }
                                      : s
                                  ) || [],
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        CTA Button Text (optional)
                      </label>
                      <input
                        type="text"
                        value={data.subServices.ctaButtonText || ""}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            subServices: {
                              ...prev.subServices!,
                              ctaButtonText: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        CTA Button Link (optional)
                      </label>
                      <input
                        type="text"
                        value={data.subServices.ctaButtonLink || ""}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            subServices: {
                              ...prev.subServices!,
                              ctaButtonLink: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "partners" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Partners Section
                </h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={data.partners?.isActive !== false}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          partners: {
                            ...(prev.partners || {
                              title: "",
                              partners: [],
                            }),
                            isActive: e.target.checked,
                          },
                        }))
                      }
                      className="rounded"
                    />
                    Active
                  </label>
                  <button
                    onClick={() => {
                      if (!data.partners) {
                        setData((prev) => ({
                          ...prev,
                          partners: {
                            title: "",
                            partners: [],
                          },
                        }));
                      }
                      setData((prev) => ({
                        ...prev,
                        partners: {
                          ...prev.partners!,
                          partners: [
                            ...(prev.partners?.partners || []),
                            { name: "", logo: "" },
                          ],
                        },
                      }));
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add Partner
                  </button>
                </div>
              </div>
              {data.partners && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={data.partners.title}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          partners: {
                            ...prev.partners!,
                            title: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Section Description (optional)
                    </label>
                    <textarea
                      value={data.partners.description || ""}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          partners: {
                            ...prev.partners!,
                            description: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={2}
                    />
                  </div>
                  {data.partners.partners.map((partner, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Partner {index + 1}
                        </h4>
                        <button
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              partners: {
                                ...prev.partners!,
                                partners:
                                  prev.partners?.partners?.filter(
                                    (_, i) => i !== index
                                  ) || [],
                              },
                            }));
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Name (optional)
                        </label>
                        <input
                          type="text"
                          value={partner.name || ""}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              partners: {
                                ...prev.partners!,
                                partners:
                                  prev.partners?.partners?.map((p, i) =>
                                    i === index
                                      ? { ...p, name: e.target.value }
                                      : p
                                  ) || [],
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <IconUpload
                          label="Logo (emoji, URL, or upload image)"
                          value={partner.logo || ""}
                          onChange={(url) => {
                            setData((prev) => ({
                              ...prev,
                              partners: {
                                ...prev.partners!,
                                partners:
                                  prev.partners?.partners?.map((p, i) =>
                                    i === index ? { ...p, logo: url } : p
                                  ) || [],
                              },
                            }));
                          }}
                          folder="industry-partners-logos"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === "cards" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cards Section
                </h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={data.cards?.isActive !== false}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          cards: {
                            ...(prev.cards || {
                              title: "",
                              items: [],
                            }),
                            isActive: e.target.checked,
                          },
                        }))
                      }
                      className="rounded"
                    />
                    Active
                  </label>
                  <button
                    onClick={() => {
                      if (!data.cards) {
                        setData((prev) => ({
                          ...prev,
                          cards: {
                            title: "",
                            items: [],
                          },
                        }));
                      }
                      setData((prev) => ({
                        ...prev,
                        cards: {
                          ...prev.cards!,
                          items: [
                            ...(prev.cards?.items || []),
                            {
                              quote: "",
                              author: "",
                              role: "",
                              company: "",
                            },
                          ],
                        },
                      }));
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add Card
                  </button>
                </div>
              </div>
              {data.cards && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={data.cards.title}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          cards: {
                            ...prev.cards!,
                            title: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Section Description (optional)
                    </label>
                    <textarea
                      value={data.cards.description || ""}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          cards: {
                            ...prev.cards!,
                            description: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={data.cards.showStars !== false}
                        onChange={(e) =>
                          setData((prev) => ({
                            ...prev,
                            cards: {
                              ...prev.cards!,
                              showStars: e.target.checked,
                            },
                          }))
                        }
                        className="rounded"
                      />
                      Show Star Ratings
                    </label>
                  </div>
                  {data.cards.items.map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Card {index + 1}
                        </h4>
                        <button
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              cards: {
                                ...prev.cards!,
                                items:
                                  prev.cards?.items?.filter(
                                    (_, i) => i !== index
                                  ) || [],
                              },
                            }));
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Quote
                        </label>
                        <textarea
                          value={item.quote || ""}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              cards: {
                                ...prev.cards!,
                                items:
                                  prev.cards?.items?.map((c, i) =>
                                    i === index
                                      ? { ...c, quote: e.target.value }
                                      : c
                                  ) || [],
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Author
                        </label>
                        <input
                          type="text"
                          value={item.author || ""}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              cards: {
                                ...prev.cards!,
                                items:
                                  prev.cards?.items?.map((c, i) =>
                                    i === index
                                      ? { ...c, author: e.target.value }
                                      : c
                                  ) || [],
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Role (optional)
                        </label>
                        <input
                          type="text"
                          value={item.role || ""}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              cards: {
                                ...prev.cards!,
                                items:
                                  prev.cards?.items?.map((c, i) =>
                                    i === index
                                      ? { ...c, role: e.target.value }
                                      : c
                                  ) || [],
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Company (optional)
                        </label>
                        <input
                          type="text"
                          value={item.company || ""}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              cards: {
                                ...prev.cards!,
                                items:
                                  prev.cards?.items?.map((c, i) =>
                                    i === index
                                      ? { ...c, company: e.target.value }
                                      : c
                                  ) || [],
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Portfolio Section
                </h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={data.portfolio?.isActive !== false}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          portfolio: {
                            ...(prev.portfolio || {
                              title: "",
                              projects: [],
                            }),
                            isActive: e.target.checked,
                          },
                        }))
                      }
                      className="rounded"
                    />
                    Active
                  </label>
                  <button
                    onClick={() => {
                      if (!data.portfolio) {
                        setData((prev) => ({
                          ...prev,
                          portfolio: {
                            title: "",
                            description: "",
                            projects: [
                              {
                                title: "",
                                description: "",
                                image: "",
                                category: "",
                                link: "",
                                technologies: [],
                              },
                            ],
                          },
                        }));
                      } else {
                        setData((prev) => ({
                          ...prev,
                          portfolio: {
                            ...prev.portfolio!,
                            projects: [
                              ...(prev.portfolio?.projects || []),
                              {
                                title: "",
                                description: "",
                                image: "",
                                category: "",
                                link: "",
                                technologies: [],
                              },
                            ],
                          },
                        }));
                      }
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add Project
                  </button>
                </div>
              </div>
              {data.portfolio && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={data.portfolio.title}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          portfolio: {
                            ...prev.portfolio!,
                            title: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Section Description (optional)
                    </label>
                    <textarea
                      value={data.portfolio.description || ""}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          portfolio: {
                            ...prev.portfolio!,
                            description: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={2}
                    />
                  </div>
                  {data.portfolio.projects.map((project, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Project {index + 1}
                        </h4>
                        <button
                          onClick={() => {
                            setData((prev) => ({
                              ...prev,
                              portfolio: {
                                ...prev.portfolio!,
                                projects:
                                  prev.portfolio?.projects?.filter(
                                    (_, i) => i !== index
                                  ) || [],
                              },
                            }));
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <FileUpload
                        label="Project Image (optional)"
                        value={project.image || ""}
                        onChange={(url) => {
                          setData((prev) => ({
                            ...prev,
                            portfolio: {
                              ...prev.portfolio!,
                              projects:
                                prev.portfolio?.projects?.map((p, i) =>
                                  i === index ? { ...p, image: url } : p
                                ) || [],
                            },
                          }));
                        }}
                        type="image"
                        folder="industry-portfolio"
                      />
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Category (optional)
                        </label>
                        <input
                          type="text"
                          value={project.category || ""}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              portfolio: {
                                ...prev.portfolio!,
                                projects:
                                  prev.portfolio?.projects?.map((p, i) =>
                                    i === index
                                      ? { ...p, category: e.target.value }
                                      : p
                                  ) || [],
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="Industry Solutions"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Title
                        </label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              portfolio: {
                                ...prev.portfolio!,
                                projects:
                                  prev.portfolio?.projects?.map((p, i) =>
                                    i === index
                                      ? { ...p, title: e.target.value }
                                      : p
                                  ) || [],
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          value={project.description}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              portfolio: {
                                ...prev.portfolio!,
                                projects:
                                  prev.portfolio?.projects?.map((p, i) =>
                                    i === index
                                      ? { ...p, description: e.target.value }
                                      : p
                                  ) || [],
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Link (optional)
                        </label>
                        <input
                          type="text"
                          value={project.link || ""}
                          onChange={(e) => {
                            setData((prev) => ({
                              ...prev,
                              portfolio: {
                                ...prev.portfolio!,
                                projects:
                                  prev.portfolio?.projects?.map((p, i) =>
                                    i === index
                                      ? { ...p, link: e.target.value }
                                      : p
                                  ) || [],
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="/project/1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                          Technologies (comma-separated, optional)
                        </label>
                        <input
                          type="text"
                          value={
                            Array.isArray(project.technologies)
                              ? project.technologies.join(", ")
                              : ""
                          }
                          onChange={(e) => {
                            const techs = e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter((t) => t);
                            setData((prev) => ({
                              ...prev,
                              portfolio: {
                                ...prev.portfolio!,
                                projects:
                                  prev.portfolio?.projects?.map((p, i) =>
                                    i === index
                                      ? { ...p, technologies: techs }
                                      : p
                                  ) || [],
                              },
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          placeholder="React, Node.js, TypeScript"
                        />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === "technologies" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Technologies Section
                </h3>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={data.technologies?.isActive !== false}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          technologies: {
                            ...(prev.technologies || {
                              title: "",
                              description: "",
                              items: [],
                            }),
                            isActive: e.target.checked,
                          },
                        }))
                      }
                      className="rounded"
                    />
                    Active
                  </label>
                  <button
                    onClick={() => {
                      if (!data.technologies) {
                        setData((prev) => ({
                          ...prev,
                          technologies: {
                            title: "",
                            description: "",
                            items: [{ name: "", icon: "" }],
                          },
                        }));
                      } else {
                        addArrayItem("technologies", { name: "", icon: "" });
                      }
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add Technology
                  </button>
                </div>
              </div>
              {data.technologies && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={data.technologies.title}
                      onChange={(e) =>
                        updateField("technologies", "title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Section Description
                    </label>
                    <textarea
                      value={data.technologies.description}
                      onChange={(e) =>
                        updateField(
                          "technologies",
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={2}
                    />
                  </div>
                  {data.technologies.items.map(
                    (item: { name: string; icon?: string }, index: number) => (
                      <div
                        key={index}
                        className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Technology {index + 1}
                          </h4>
                          <button
                            onClick={() =>
                              removeArrayItem("technologies", index)
                            }
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div>
                          <IconUpload
                            label="Logo Image (emoji, URL, or upload image)"
                            value={item.icon || ""}
                            onChange={(url) => {
                              setData((prev) => ({
                                ...prev,
                                technologies: {
                                  ...prev.technologies!,
                                  items:
                                    prev.technologies?.items?.map((t, i) =>
                                      i === index ? { ...t, icon: url } : t
                                    ) || [],
                                },
                              }));
                            }}
                            folder="industry-technologies-icons"
                            className="text-sm"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Use logo image URLs, emojis, or upload an image.
                            Only the logo/emoji will be displayed.
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "sectionOrder" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Section Order
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag and drop sections to reorder them, or use the up/down
                buttons.
              </p>

              <div className="space-y-2">
                {(
                  data.sectionOrder || [
                    "hero",
                    "overview",
                    "stats",
                    "subServices",
                    "partners",
                    "cards",
                    "portfolio",
                    "technologies",
                  ]
                ).map((sectionKey, index) => {
                  const sectionLabels: Record<string, string> = {
                    hero: "Hero",
                    overview: "Overview",
                    stats: "Stats",
                    subServices: "Sub Services",
                    partners: "Partners",
                    cards: "Cards",
                    portfolio: "Portfolio",
                    technologies: "Technologies",
                  };

                  const currentOrder = data.sectionOrder || [
                    "hero",
                    "overview",
                    "stats",
                    "subServices",
                    "partners",
                    "cards",
                    "portfolio",
                    "technologies",
                  ];

                  const moveSection = (fromIndex: number, toIndex: number) => {
                    const newOrder = [...currentOrder];
                    const [removed] = newOrder.splice(fromIndex, 1);
                    newOrder.splice(toIndex, 0, removed);
                    setData((prev) => ({
                      ...prev,
                      sectionOrder: newOrder,
                    }));
                  };

                  const handleDragStart = (
                    e: React.DragEvent<HTMLDivElement>,
                    index: number
                  ) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/html", String(index));
                  };

                  const handleDragOver = (
                    e: React.DragEvent<HTMLDivElement>
                  ) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  };

                  const handleDrop = (
                    e: React.DragEvent<HTMLDivElement>,
                    dropIndex: number
                  ) => {
                    e.preventDefault();
                    const dragIndex = parseInt(
                      e.dataTransfer.getData("text/html")
                    );
                    if (dragIndex !== dropIndex) {
                      moveSection(dragIndex, dropIndex);
                    }
                  };

                  return (
                    <div
                      key={sectionKey}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-move hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {/* Drag Handle */}
                      <div className="text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8h16M4 16h16"
                          />
                        </svg>
                      </div>

                      {/* Section Label */}
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {sectionLabels[sectionKey] || sectionKey}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          ({sectionKey})
                        </span>
                      </div>

                      {/* Up/Down Buttons */}
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (index > 0) {
                              moveSection(index, index - 1);
                            }
                          }}
                          disabled={index === 0}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Move up"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (index < currentOrder.length - 1) {
                              moveSection(index, index + 1);
                            }
                          }}
                          disabled={index === currentOrder.length - 1}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Move down"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Tip:</strong> Drag sections to reorder, or use the
                  up/down arrows. Sections will appear on the page in this
                  order.
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Preview Panel - At the bottom */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Preview
          </h3>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="max-h-[800px] overflow-y-auto">
              <IndustryTemplate data={data} industryTitle={industryTitle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
