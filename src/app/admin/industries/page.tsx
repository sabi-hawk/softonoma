"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Loader from "@/components/admin/Loader";
import IconUpload from "@/components/admin/IconUpload";
import FileUpload from "@/components/admin/FileUpload";

interface Industry {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  isPublished: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  metaHeaderTags?: string;
  allowIndexing?: boolean;
}

export default function IndustriesAdmin() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIndustryForm, setShowIndustryForm] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [industryForm, setIndustryForm] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "",
    isPublished: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    metaHeaderTags: "",
    allowIndexing: true,
  });

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      const res = await fetch("/api/industries");
      const data = await res.json();
      setIndustries(data.data || []);
    } catch (error) {
      console.error("Error fetching industries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIndustrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingIndustry
        ? `/api/industries/id/${editingIndustry._id}`
        : "/api/industries";
      const method = editingIndustry ? "PUT" : "POST";

      // Auto-populate OG Title and OG Description from Meta Title and Meta Description
      const submitData = {
        ...industryForm,
        ogTitle: industryForm.seoTitle || "",
        ogDescription: industryForm.seoDescription || "",
        order: editingIndustry ? editingIndustry.order : industries.length,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      if (data.success) {
        await fetchData();
        setShowIndustryForm(false);
        setEditingIndustry(null);
        setIndustryForm({
          title: "",
          slug: "",
          description: "",
          icon: "",
          isPublished: true,
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
          ogImage: "",
          ogTitle: "",
          ogDescription: "",
          metaHeaderTags: "",
          allowIndexing: true,
        });
      } else {
        alert(data.error || "Error saving industry");
      }
    } catch (error) {
      console.error("Error saving industry:", error);
      alert("Error saving industry");
    }
  };

  const handleDeleteIndustry = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this industry? This will also delete the associated industry page."
      )
    )
      return;

    try {
      const res = await fetch(`/api/industries/id/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      } else {
        alert(data.error || "Error deleting industry");
      }
    } catch (error) {
      console.error("Error deleting industry:", error);
      alert("Error deleting industry");
    }
  };

  const handleReorder = async (newIndustries: Industry[]) => {
    try {
      const res = await fetch("/api/industries/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industries: newIndustries.map((industry, index) => ({
            id: industry._id,
            order: index,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIndustries(newIndustries);
      }
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  const moveIndustry = (index: number, direction: "up" | "down") => {
    const newIndustries = [...industries];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newIndustries.length) return;

    [newIndustries[index], newIndustries[newIndex]] = [
      newIndustries[newIndex],
      newIndustries[index],
    ];
    setIndustries(newIndustries);
    handleReorder(newIndustries);
  };

  const editIndustry = (industry: Industry) => {
    setEditingIndustry(industry);
    setIndustryForm({
      title: industry.title,
      slug: industry.slug,
      description: industry.description || "",
      icon: industry.icon || "",
      isPublished: industry.isPublished,
      seoTitle: industry.seoTitle || "",
      seoDescription: industry.seoDescription || "",
      seoKeywords: industry.seoKeywords || "",
      ogImage: industry.ogImage || "",
      ogTitle: industry.ogTitle || "",
      ogDescription: industry.ogDescription || "",
      metaHeaderTags: industry.metaHeaderTags || "",
      allowIndexing: industry.allowIndexing !== undefined ? industry.allowIndexing : true,
    });
    setShowIndustryForm(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-20">
          <Link href="/admin" className="text-blue-400 hover:text-blue-300">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">
            Industries Management
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your industries. Each industry creates a pre-filled industry
            page that you can customize.
          </p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">
            Industries ({industries.length})
          </h2>
          <button
            onClick={() => {
              setEditingIndustry(null);
              setIndustryForm({
                title: "",
                slug: "",
                description: "",
                icon: "",
                isPublished: true,
                seoTitle: "",
                seoDescription: "",
                seoKeywords: "",
                ogImage: "",
                ogTitle: "",
                ogDescription: "",
                metaHeaderTags: "",
                allowIndexing: true,
              });
              setShowIndustryForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + Add Industry
          </button>
        </div>

        {showIndustryForm && (
          <div className="bg-gray-800 text-gray-300 p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingIndustry ? "Edit" : "Add"} Industry
            </h3>
            <form onSubmit={handleIndustrySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={industryForm.title}
                  onChange={(e) =>
                    setIndustryForm({ ...industryForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Industry name (e.g., &quot;Web Development&quot;)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={industryForm.slug}
                  onChange={(e) =>
                    setIndustryForm({
                      ...industryForm,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  URL-friendly identifier (e.g., &quot;web-development&quot; for
                  /industries/web-development)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={industryForm.description}
                  onChange={(e) =>
                    setIndustryForm({
                      ...industryForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Brief description of the industry"
                />
              </div>
              <div>
                <IconUpload
                  label="Icon (for dropdown menu)"
                  value={industryForm.icon}
                  onChange={(value) =>
                    setIndustryForm({
                      ...industryForm,
                      icon: value,
                    })
                  }
                  placeholder="📱 or https://example.com/icon.svg or upload image"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Icon displayed in the navigation dropdown menu. Can be an
                  emoji, URL, or uploaded image.
                </p>
              </div>
              <div className="border-t border-gray-700 pt-4 mt-4">
                <h4 className="text-md font-semibold mb-4 text-white">
                  SEO & Meta Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={industryForm.seoTitle}
                      onChange={(e) =>
                        setIndustryForm({
                          ...industryForm,
                          seoTitle: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      SEO Description
                    </label>
                    <textarea
                      value={industryForm.seoDescription}
                      onChange={(e) =>
                        setIndustryForm({
                          ...industryForm,
                          seoDescription: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      SEO Keywords
                    </label>
                    <input
                      type="text"
                      value={industryForm.seoKeywords}
                      onChange={(e) =>
                        setIndustryForm({
                          ...industryForm,
                          seoKeywords: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                  <div>
                    <FileUpload
                      label="OG Image"
                      value={industryForm.ogImage || ""}
                      onChange={(url) =>
                        setIndustryForm({
                          ...industryForm,
                          ogImage: url,
                        })
                      }
                      type="image"
                      folder="og-images"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Image shown when sharing on social media (1200x630px
                      recommended)
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Note: OG Title and OG Description are automatically set from Meta Title and Meta Description
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-md font-semibold mb-4 text-white">
                  Meta Header Tags
                </h4>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Custom Header Tags
                  </label>
                  <textarea
                    value={industryForm.metaHeaderTags || ""}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        metaHeaderTags: e.target.value,
                      })
                    }
                    rows={12}
                    className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 font-mono text-sm"
                    placeholder='<script type="application/ld+json">&#10;{&#10;  "@context": "https://schema.org",&#10;  "@type": "LocalBusiness",&#10;  "name": "Your Business Name"&#10;}&#10;</script>'
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Add custom HTML tags to be included in the &lt;head&gt; section (JSON-LD structured data, meta tags, scripts, links, etc.)
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={industryForm.isPublished}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        isPublished: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-300">Published</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={industryForm.allowIndexing}
                    onChange={(e) =>
                      setIndustryForm({
                        ...industryForm,
                        allowIndexing: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-300">
                    Allow Search Engine Indexing (uncheck to add noindex meta tag)
                  </span>
                </label>
              </div>
              <div className="flex space-x-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  {editingIndustry ? "Update" : "Create"} Industry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowIndustryForm(false);
                    setEditingIndustry(null);
                  }}
                  className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 text-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {industries.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No industries yet. Click &quot;Add Industry&quot; to get
                    started.
                  </td>
                </tr>
              ) : (
                industries.map((industry, index) => (
                  <tr key={industry._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveIndustry(index, "up")}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-gray-300 disabled:opacity-30"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <span className="text-sm text-white">
                          {industry.order}
                        </span>
                        <button
                          onClick={() => moveIndustry(index, "down")}
                          disabled={index === industries.length - 1}
                          className="text-gray-400 hover:text-gray-300 disabled:opacity-30"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {industry.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      /industries/{industry.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          industry.isPublished
                            ? "bg-green-900/50 text-green-300"
                            : "bg-gray-600 text-gray-300"
                        }`}
                      >
                        {industry.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/industries/${industry.slug}`}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/industries/${industry._id}`}
                        className="text-green-400 hover:text-green-300"
                      >
                        Edit Industry
                      </Link>
                      <button
                        onClick={() => editIndustry(industry)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteIndustry(industry._id)}
                        className="text-red-400 hover:text-red-300"
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
      </div>
    </div>
  );
}
