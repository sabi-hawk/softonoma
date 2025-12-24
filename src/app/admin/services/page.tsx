"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Service {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  isPublished: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
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
    isPublished: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
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

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...serviceForm,
          order: editingService ? editingService.order : services.length,
        }),
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
          isPublished: true,
          seoTitle: "",
          seoDescription: "",
          seoKeywords: "",
          ogImage: "",
          ogTitle: "",
          ogDescription: "",
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
      isPublished: service.isPublished,
      seoTitle: service.seoTitle || "",
      seoDescription: service.seoDescription || "",
      seoKeywords: service.seoKeywords || "",
      ogImage: service.ogImage || "",
      ogTitle: service.ogTitle || "",
      ogDescription: service.ogDescription || "",
    });
    setShowServiceForm(true);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            Services Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your services. Each service creates a pre-filled service page
            that you can customize.
          </p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Services ({services.length})
          </h2>
          <button
            onClick={() => {
              setEditingService(null);
              setServiceForm({
                title: "",
                slug: "",
                description: "",
                isPublished: true,
                seoTitle: "",
                seoDescription: "",
                seoKeywords: "",
                ogImage: "",
                ogTitle: "",
                ogDescription: "",
              });
              setShowServiceForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + Add Service
          </button>
        </div>

        {showServiceForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
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
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
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
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
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
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Brief description of the service"
                />
              </div>
              <div className="border-t pt-4 mt-4">
                <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
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
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
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
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
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
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      OG Image URL
                    </label>
                    <input
                      type="text"
                      value={serviceForm.ogImage}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          ogImage: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      OG Title
                    </label>
                    <input
                      type="text"
                      value={serviceForm.ogTitle}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          ogTitle: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      OG Description
                    </label>
                    <textarea
                      value={serviceForm.ogDescription}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          ogDescription: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
              <div>
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
                  <span className="text-sm">Published</span>
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
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Slug
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
              {services.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
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
                        <span className="text-sm text-gray-900 dark:text-white">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {service.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      /services/{service.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          service.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {service.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/services/${service.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-900"
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
                        className="text-blue-600 hover:text-blue-900"
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
