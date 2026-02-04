"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/admin/Loader";
import FileUpload from "@/components/admin/FileUpload";

interface PageData {
  _id?: string;
  title: string;
  slug: string;
  templateType: string;
  pageConfig: {
    hero?: {
      title?: string;
      description?: string;
      backgroundImage?: string;
      backgroundColor?: string;
      showHero?: boolean;
    };
    display?: {
      cardsPerRow?: number;
      cardStyle?: string;
      showDescriptions?: boolean;
      showIcons?: boolean;
    };
  };
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  metaHeaderTags?: string;
  allowIndexing?: boolean;
  isPublished?: boolean;
}

export default function ServicesListingEditor() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<PageData>({
    title: "Services",
    slug: "services",
    templateType: "services-listing",
    pageConfig: {
      hero: {
        title: "",
        description: "",
        backgroundImage: "",
        backgroundColor: "",
        showHero: true,
      },
      display: {
        cardsPerRow: 3,
        cardStyle: "elevated",
        showDescriptions: true,
        showIcons: true,
      },
    },
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    metaHeaderTags: "",
    allowIndexing: true,
    isPublished: true,
  });

  useEffect(() => {
    checkAuth();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check");
      const data = await res.json();
      if (!data.authenticated) {
        router.push("/admin/login");
      }
    } catch {
      router.push("/admin/login");
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/pages/services-listing");
      const data = await res.json();
      if (data.success && data.data) {
        setPageData({
          ...data.data,
          pageConfig: data.data.pageConfig || {
            hero: {
              title: "",
              description: "",
              backgroundImage: "",
              backgroundColor: "",
              showHero: true,
            },
            display: {
              cardsPerRow: 3,
              cardStyle: "elevated",
              showDescriptions: true,
              showIcons: true,
            },
          },
        });
      }
    } catch (error) {
      console.error("Error fetching page data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/pages/services-listing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });

      const data = await res.json();
      if (data.success) {
        alert("Services listing page saved successfully!");
        await fetchData();
      } else {
        alert(data.error || "Error saving page");
      }
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Error saving page");
    } finally {
      setSaving(false);
    }
  };

  const updatePageConfig = (path: string[], value: string | number | boolean) => {
    setPageData((prev) => {
      const newConfig = { ...prev.pageConfig };
      let current: Record<string, unknown> = newConfig;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]] as Record<string, unknown>;
      }
      current[path[path.length - 1]] = value;
      return { ...prev, pageConfig: newConfig };
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Edit Services Listing Page</h1>
          <p className="text-gray-400">Customize the services listing page design and content</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hero Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Show Hero Section</label>
                <input
                  type="checkbox"
                  checked={pageData.pageConfig.hero?.showHero !== false}
                  onChange={(e) => updatePageConfig(["hero", "showHero"], e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Title</label>
                <input
                  type="text"
                  value={pageData.pageConfig.hero?.title || ""}
                  onChange={(e) => updatePageConfig(["hero", "title"], e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="Enter hero title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Description</label>
                <textarea
                  value={pageData.pageConfig.hero?.description || ""}
                  onChange={(e) => updatePageConfig(["hero", "description"], e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  rows={3}
                  placeholder="Enter hero description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Background Image</label>
                <FileUpload
                  label=""
                  value={pageData.pageConfig.hero?.backgroundImage || ""}
                  onChange={(url) => updatePageConfig(["hero", "backgroundImage"], url)}
                  folder="hero-images"
                  type="image"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Background Color</label>
                <input
                  type="text"
                  value={pageData.pageConfig.hero?.backgroundColor || ""}
                  onChange={(e) => updatePageConfig(["hero", "backgroundColor"], e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="#000000 or transparent"
                />
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cards Per Row</label>
                <select
                  value={pageData.pageConfig.display?.cardsPerRow || 3}
                  onChange={(e) => updatePageConfig(["display", "cardsPerRow"], parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Card Style</label>
                <select
                  value={pageData.pageConfig.display?.cardStyle || "elevated"}
                  onChange={(e) => updatePageConfig(["display", "cardStyle"], e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="minimal">Minimal</option>
                  <option value="elevated">Elevated</option>
                  <option value="outlined">Outlined</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Show Descriptions</label>
                <input
                  type="checkbox"
                  checked={pageData.pageConfig.display?.showDescriptions !== false}
                  onChange={(e) => updatePageConfig(["display", "showDescriptions"], e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Show Icons</label>
                <input
                  type="checkbox"
                  checked={pageData.pageConfig.display?.showIcons !== false}
                  onChange={(e) => updatePageConfig(["display", "showIcons"], e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">SEO Title</label>
                <input
                  type="text"
                  value={pageData.seoTitle || ""}
                  onChange={(e) => setPageData({ ...pageData, seoTitle: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">SEO Description</label>
                <textarea
                  value={pageData.seoDescription || ""}
                  onChange={(e) => setPageData({ ...pageData, seoDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">SEO Keywords</label>
                <input
                  type="text"
                  value={pageData.seoKeywords || ""}
                  onChange={(e) => setPageData({ ...pageData, seoKeywords: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">OG Image</label>
                <FileUpload
                  label=""
                  value={pageData.ogImage || ""}
                  onChange={(url) => setPageData({ ...pageData, ogImage: url })}
                  folder="og-images"
                  type="image"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">OG Title</label>
                <input
                  type="text"
                  value={pageData.ogTitle || ""}
                  onChange={(e) => setPageData({ ...pageData, ogTitle: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">OG Description</label>
                <textarea
                  value={pageData.ogDescription || ""}
                  onChange={(e) => setPageData({ ...pageData, ogDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Meta Header Tags</label>
                <textarea
                  value={pageData.metaHeaderTags || ""}
                  onChange={(e) => setPageData({ ...pageData, metaHeaderTags: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
                  rows={4}
                  placeholder="<meta name='...' content='...' />"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Allow Indexing</label>
                <input
                  type="checkbox"
                  checked={pageData.allowIndexing !== false}
                  onChange={(e) => setPageData({ ...pageData, allowIndexing: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Published</label>
                <input
                  type="checkbox"
                  checked={pageData.isPublished !== false}
                  onChange={(e) => setPageData({ ...pageData, isPublished: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

