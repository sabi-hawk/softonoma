"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Loader from "@/components/admin/Loader";
import IconUpload from "@/components/admin/IconUpload";
import FileUpload from "@/components/admin/FileUpload";

interface Service {
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

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
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
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingService
        ? `/api/services/id/${editingService._id}`
        : "/api/services";
      const method = editingService ? "PUT" : "POST";

      // Auto-populate OG Title and OG Description from Meta Title and Meta Description
      const submitData = {
        ...serviceForm,
        ogTitle: serviceForm.seoTitle || "",
        ogDescription: serviceForm.seoDescription || "",
        order: editingService ? editingService.order : services.length,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      if (data.success) {
        await fetchData();
        setShowServiceForm(false);
        setEditingService(null);
        setServiceForm({
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
        alert(data.error || "Error saving service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this service? This will also delete the associated service page."
      )
    )
      return;

    try {
      const res = await fetch(`/api/services/id/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      } else {
        alert(data.error || "Error deleting service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service");
    }
  };

  const handleReorder = async (newServices: Service[]) => {
    try {
      const res = await fetch("/api/services/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: newServices.map((service, index) => ({
            id: service._id,
            order: index,
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setServices(newServices);
      }
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  const moveService = (index: number, direction: "up" | "down") => {
    const newServices = [...services];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newServices.length) return;

    [newServices[index], newServices[newIndex]] = [
      newServices[newIndex],
      newServices[index],
    ];
    setServices(newServices);
    handleReorder(newServices);
  };

  const editService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      slug: service.slug,
      description: service.description || "",
      icon: service.icon || "",
      isPublished: service.isPublished,
      seoTitle: service.seoTitle || "",
      seoDescription: service.seoDescription || "",
      seoKeywords: service.seoKeywords || "",
      ogImage: service.ogImage || "",
      ogTitle: service.ogTitle || "",
      ogDescription: service.ogDescription || "",
      metaHeaderTags: service.metaHeaderTags || "",
      allowIndexing: service.allowIndexing !== undefined ? service.allowIndexing : true,
    });
    setShowServiceForm(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 mt-20">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            ← Back to Admin
          </Link>
          <div className="mt-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Services Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage your services. Each service creates a pre-filled service page
                  that you can customize.
                </p>
              </div>
              <Link
                href="/admin/services/listing"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                ✏️ Edit Listing Page
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h2 className="text-2xl font-semibold text-white">
            Services ({services.length})
          </h2>
          <div className="flex gap-2">
            <Link
              href="/admin/services/listing"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              Edit Listing Page
            </Link>
            <button
            onClick={() => {
              setEditingService(null);
              setServiceForm({
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
              setShowServiceForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + Add Service
          </button>
          </div>
        </div>

        {showServiceForm && (
          <div className="bg-gray-800 text-gray-300 p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingService ? "Edit" : "Add"} Service
            </h3>
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={serviceForm.title}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Service name (e.g., &quot;Web Development&quot;)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={serviceForm.slug}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL-friendly identifier (e.g., &quot;web-development&quot; for
                  /services/web-development)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Brief description of the service"
                />
              </div>
              <div>
                <IconUpload
                  label="Icon (for dropdown menu)"
                  value={serviceForm.icon}
                  onChange={(value) =>
                    setServiceForm({
                      ...serviceForm,
                      icon: value,
                    })
                  }
                  placeholder="📱 or https://example.com/icon.svg or upload image"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Icon displayed in the navigation dropdown menu. Can be an
                  emoji, URL, or uploaded image.
                </p>
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="text-md font-semibold mb-4 text-white">
                  SEO & Meta Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={serviceForm.seoTitle}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          seoTitle: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      SEO Description
                    </label>
                    <textarea
                      value={serviceForm.seoDescription}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          seoDescription: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      SEO Keywords
                    </label>
                    <input
                      type="text"
                      value={serviceForm.seoKeywords}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
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
                      value={serviceForm.ogImage || ""}
                      onChange={(url) =>
                        setServiceForm({
                          ...serviceForm,
                          ogImage: url,
                        })
                      }
                      type="image"
                      folder="og-images"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Image shown when sharing on social media (1200x630px
                      recommended)
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
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
                    value={serviceForm.metaHeaderTags || ""}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                        metaHeaderTags: e.target.value,
                        })
                      }
                    rows={12}
                    className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600 text-white placeholder-gray-400 font-mono text-sm"
                    placeholder='<script type="application/ld+json">&#10;{&#10;  "@context": "https://schema.org",&#10;  "@type": "LocalBusiness",&#10;  "name": "Your Business Name"&#10;}&#10;</script>'
                    />
                  <p className="text-xs text-gray-500 mt-1">
                    Add custom HTML tags to be included in the &lt;head&gt; section (JSON-LD structured data, meta tags, scripts, links, etc.)
                  </p>
                  </div>
                </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={serviceForm.isPublished}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
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
                    checked={serviceForm.allowIndexing}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
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
                  {editingService ? "Update" : "Create"} Service
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingService(null);
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
              {services.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No services yet. Click &quot;Add Service&quot; to get
                    started.
                  </td>
                </tr>
              ) : (
                services.map((service, index) => (
                  <tr key={service._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => moveService(index, "up")}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <span className="text-sm text-white">
                          {service.order}
                        </span>
                        <button
                          onClick={() => moveService(index, "down")}
                          disabled={index === services.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Move down"
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {service.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      /services/{service.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          service.isPublished
                            ? "bg-green-900/50 text-green-300"
                            : "bg-gray-600 text-gray-300"
                        }`}
                      >
                        {service.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/services/${service.slug}`}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/services/${service._id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit Service
                      </Link>
                      <button
                        onClick={() => editService(service)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service._id)}
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
      </div>
    </div>
  );
}
