"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { IndustryTemplateData } from "@/lib/industry-template";
import IndustryTemplate from "@/components/IndustryTemplate";
import {
  defaultIndustryTemplateData,
  parseIndustryTemplateData,
} from "@/lib/industry-template";

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
    | "solutions"
    | "challenges"
    | "technologies"
    | "benefits"
    | "caseStudies"
    | "cta"
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
    setData((prev: IndustryTemplateData) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateArrayItem = (
    section: keyof IndustryTemplateData,
    index: number,
    field: string,
    value: string
  ) => {
    setData((prev: IndustryTemplateData) => {
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
        } as IndustryTemplateData[keyof IndustryTemplateData],
      };
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
          } as IndustryTemplateData[keyof IndustryTemplateData],
        };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          items: [...(sectionData.items || []), newItem],
        } as IndustryTemplateData[keyof IndustryTemplateData],
      };
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
          ...prev[section],
          items,
        } as IndustryTemplateData[keyof IndustryTemplateData],
      };
    });
  };

  const tabs = [
    { id: "hero", label: "Hero" },
    { id: "overview", label: "Overview" },
    { id: "solutions", label: "Solutions" },
    { id: "challenges", label: "Challenges" },
    { id: "technologies", label: "Technologies" },
    { id: "benefits", label: "Benefits" },
    { id: "caseStudies", label: "Case Studies" },
    { id: "cta", label: "CTA" },
  ];

  const updateNumberField = (
    section: keyof IndustryTemplateData,
    field: string,
    value: number
  ) => {
    setData((prev: IndustryTemplateData) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
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
                  Subtitle
                </label>
                <input
                  type="text"
                  value={data.hero.subtitle}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={data.hero.secondaryButtonText || ""}
                    onChange={(e) =>
                      updateField("hero", "secondaryButtonText", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={data.hero.secondaryButtonLink || ""}
                    onChange={(e) =>
                      updateField("hero", "secondaryButtonLink", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Background Image URL (optional)
                </label>
                <input
                  type="text"
                  value={data.hero.backgroundImage || ""}
                  onChange={(e) =>
                    updateField("hero", "backgroundImage", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Background Video URL (optional)
                </label>
                <input
                  type="text"
                  value={data.hero.backgroundVideo || ""}
                  onChange={(e) =>
                    updateField("hero", "backgroundVideo", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com/video.mp4"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Video will auto-play, loop, and be muted. Supports .mp4 and
                  .webm
                </p>
              </div>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Overview Section
              </h3>
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
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={data.overview.description}
                  onChange={(e) =>
                    updateField("overview", "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Image URL (optional)
                </label>
                <input
                  type="text"
                  value={data.overview.image || ""}
                  onChange={(e) =>
                    updateField("overview", "image", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          )}

          {activeTab === "solutions" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Solutions Section
                </h3>
                <button
                  onClick={() =>
                    addArrayItem("solutions", {
                      title: "",
                      description: "",
                      icon: "",
                    })
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Add Solution
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Section Title
                </label>
                <input
                  type="text"
                  value={data.solutions.title}
                  onChange={(e) =>
                    updateField("solutions", "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Section Description
                </label>
                <textarea
                  value={data.solutions.description}
                  onChange={(e) =>
                    updateField("solutions", "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={2}
                />
              </div>
              {data.solutions.items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Solution {index + 1}
                    </h4>
                    <button
                      onClick={() => removeArrayItem("solutions", index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Icon (emoji or URL)
                    </label>
                    <input
                      type="text"
                      value={item.icon || ""}
                      onChange={(e) =>
                        updateArrayItem(
                          "solutions",
                          index,
                          "icon",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="🚀 or https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateArrayItem(
                          "solutions",
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        updateArrayItem(
                          "solutions",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "challenges" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Challenges Section
                </h3>
                <button
                  onClick={() =>
                    addArrayItem("challenges", { title: "", description: "" })
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Add Challenge
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Section Title
                </label>
                <input
                  type="text"
                  value={data.challenges.title}
                  onChange={(e) =>
                    updateField("challenges", "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Section Description
                </label>
                <textarea
                  value={data.challenges.description}
                  onChange={(e) =>
                    updateField("challenges", "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={2}
                />
              </div>
              {data.challenges.items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Challenge {index + 1}
                    </h4>
                    <button
                      onClick={() => removeArrayItem("challenges", index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateArrayItem(
                          "challenges",
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        updateArrayItem(
                          "challenges",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "technologies" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Technologies Section
                </h3>
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
                          <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Logo Image URL or Emoji
                          </label>
                          <input
                            type="text"
                            value={item.icon || ""}
                            onChange={(e) =>
                              updateArrayItem(
                                "technologies",
                                index,
                                "icon",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            placeholder="https://example.com/logo.png or 🚀"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Use logo image URLs or emojis. Only the logo/emoji
                            will be displayed.
                          </p>
                          {item.icon &&
                            (item.icon.startsWith("http") ||
                              item.icon.startsWith("/")) && (
                              <div className="mt-2 relative h-12 border rounded p-2 bg-white">
                                <Image
                                  src={item.icon}
                                  alt="Logo"
                                  width={48}
                                  height={48}
                                  className="object-contain"
                                  unoptimized
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                          {item.icon &&
                            !item.icon.startsWith("http") &&
                            !item.icon.startsWith("/") && (
                              <div className="mt-2 p-2 border rounded bg-white text-center">
                                <span className="text-3xl">{item.icon}</span>
                              </div>
                            )}
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "benefits" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Benefits Section
                </h3>
                <button
                  onClick={() => {
                    if (!data.benefits) {
                      setData((prev) => ({
                        ...prev,
                        benefits: {
                          title: "",
                          description: "",
                          items: [{ title: "", description: "" }],
                        },
                      }));
                    } else {
                      addArrayItem("benefits", { title: "", description: "" });
                    }
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Add Benefit
                </button>
              </div>
              {data.benefits && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={data.benefits.title}
                      onChange={(e) =>
                        updateField("benefits", "title", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Section Description
                    </label>
                    <textarea
                      value={data.benefits.description}
                      onChange={(e) =>
                        updateField("benefits", "description", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={2}
                    />
                  </div>
                  {data.benefits.items.map(
                    (
                      item: { title: string; description: string },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Benefit {index + 1}
                          </h4>
                          <button
                            onClick={() => removeArrayItem("benefits", index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) =>
                              updateArrayItem(
                                "benefits",
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Description
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) =>
                              updateArrayItem(
                                "benefits",
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "caseStudies" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Case Studies Section
                </h3>
                <button
                  onClick={() =>
                    addArrayItem("caseStudies", {
                      title: "",
                      description: "",
                      result: "",
                    })
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Add Case Study
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Section Title
                </label>
                <input
                  type="text"
                  value={data.caseStudies.title}
                  onChange={(e) =>
                    updateField("caseStudies", "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Section Description
                </label>
                <textarea
                  value={data.caseStudies.description}
                  onChange={(e) =>
                    updateField("caseStudies", "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={2}
                />
              </div>
              {data.caseStudies.items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 dark:border-gray-600 rounded p-4 space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Case Study {index + 1}
                    </h4>
                    <button
                      onClick={() => removeArrayItem("caseStudies", index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateArrayItem(
                          "caseStudies",
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        updateArrayItem(
                          "caseStudies",
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Result (optional)
                    </label>
                    <input
                      type="text"
                      value={item.result || ""}
                      onChange={(e) =>
                        updateArrayItem(
                          "caseStudies",
                          index,
                          "result",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Result achieved"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "cta" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                CTA Section
              </h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={data.cta.title}
                  onChange={(e) => updateField("cta", "title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={data.cta.description}
                  onChange={(e) =>
                    updateField("cta", "description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={data.cta.buttonText}
                    onChange={(e) =>
                      updateField("cta", "buttonText", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={data.cta.buttonLink}
                    onChange={(e) =>
                      updateField("cta", "buttonLink", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
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
