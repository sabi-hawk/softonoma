"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Loader from "@/components/admin/Loader";
import FileUpload from "@/components/admin/FileUpload";

interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
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

interface Service {
  _id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  navOrder?: number;
}

interface Industry {
  _id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  navOrder?: number;
}

type NavItem =
  | {
      type: "page";
      id: string;
      title: string;
      order: number;
      isPublished: boolean;
    }
  | { type: "services"; title: string; navOrder: number; hasItems: boolean }
  | { type: "industries"; title: string; navOrder: number; hasItems: boolean };

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<
    "pages" | "services" | "industries"
  >("pages");
  const [pages, setPages] = useState<Page[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPageForm, setShowPageForm] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [pageForm, setPageForm] = useState({
    title: "",
    slug: "",
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
    checkAuth();
    fetchData();
  }, []);


  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check");
      const data = await res.json();
      if (!data.authenticated) {
        window.location.href = "/admin/login";
      }
    } catch {
      window.location.href = "/admin/login";
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const fetchData = async () => {
    try {
      const [pagesRes, servicesRes, industriesRes] = await Promise.all([
        fetch("/api/pages"),
        fetch("/api/services"),
        fetch("/api/industries"),
      ]);

      const pagesData = await pagesRes.json();
      const servicesData = await servicesRes.json();
      const industriesData = await industriesRes.json();

      const fetchedPages = pagesData.data || [];
      const fetchedServices = servicesData.data || [];
      const fetchedIndustries = industriesData.data || [];

      setPages(fetchedPages);
      // Store services and industries for potential future use
      setServices(fetchedServices);
      setIndustries(fetchedIndustries);

      // Build unified navigation items
      const publishedPages = fetchedPages.filter((p: Page) => p.isPublished);
      const publishedServices = fetchedServices.filter(
        (s: Service) => s.isPublished
      );
      const publishedIndustries = fetchedIndustries.filter(
        (i: Industry) => i.isPublished
      );

      const items: NavItem[] = [
        ...publishedPages.map((p: Page) => ({
          type: "page" as const,
          id: p._id,
          title: p.title,
          order: p.order,
          isPublished: p.isPublished,
        })),
        ...(publishedServices.length > 0
          ? [
              {
                type: "services" as const,
                title: "Services",
                navOrder:
                  publishedServices[0]?.navOrder ??
                  publishedPages.length +
                    (publishedIndustries.length > 0 ? 0 : 1),
                hasItems: true,
              },
            ]
          : []),
        ...(publishedIndustries.length > 0
          ? [
              {
                type: "industries" as const,
                title: "Industries",
                navOrder:
                  publishedIndustries[0]?.navOrder ??
                  publishedPages.length +
                    (publishedServices.length > 0 ? 1 : 0) +
                    1,
                hasItems: true,
              },
            ]
          : []),
      ];

      // Sort by order/navOrder
      items.sort((a, b) => {
        const aOrder = a.type === "page" ? a.order : a.navOrder;
        const bOrder = b.type === "page" ? b.order : b.navOrder;
        return aOrder - bOrder;
      });

      setNavItems(items);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPage
        ? `/api/pages/id/${editingPage._id}`
        : "/api/pages";
      const method = editingPage ? "PUT" : "POST";

      // Auto-populate OG Title and OG Description from Meta Title and Meta Description
      const submitData = {
        ...pageForm,
        ogTitle: pageForm.seoTitle || "",
        ogDescription: pageForm.seoDescription || "",
        order: editingPage ? editingPage.order : pages.length,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();
      if (data.success) {
        await fetchData();
        setShowPageForm(false);
        setEditingPage(null);
        setPageForm({
          title: "",
          slug: "",
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
        // Show notification if template was auto-applied
        if (data.templateApplied) {
          alert(
            data.message ||
              "Page created successfully! About Us template has been automatically applied with pre-configured sections."
          );
        }
      } else {
        alert(data.error || "Error saving page");
      }
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Error saving page");
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const res = await fetch(`/api/pages/id/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      } else {
        alert(data.error || "Error deleting page");
      }
    } catch (error) {
      console.error("Error deleting page:", error);
      alert("Error deleting page");
    }
  };

  const handleNavReorder = async (newNavItems: NavItem[]) => {
    try {
      const items = newNavItems.map((item, index) => {
        if (item.type === "page") {
          return { type: "page" as const, id: item.id, navOrder: index };
        } else if (item.type === "services") {
          return { type: "services" as const, navOrder: index };
        } else {
          return { type: "industries" as const, navOrder: index };
        }
      });

      const res = await fetch("/api/navigation/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (data.success) {
        setNavItems(newNavItems);
        await fetchData(); // Refresh to get updated orders
      } else {
        alert(data.error || "Error reordering navigation");
      }
    } catch (error) {
      console.error("Error reordering navigation:", error);
      alert("Error reordering navigation");
    }
  };

  const moveNavItem = (index: number, direction: "up" | "down") => {
    const newNavItems = [...navItems];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newNavItems.length) return;

    [newNavItems[index], newNavItems[newIndex]] = [
      newNavItems[newIndex],
      newNavItems[index],
    ];
    setNavItems(newNavItems);
    handleNavReorder(newNavItems);
  };

  const editPage = (page: Page) => {
    setEditingPage(page);
    setPageForm({
      title: page.title,
      slug: page.slug,
      isPublished: page.isPublished,
      seoTitle: page.seoTitle || "",
      seoDescription: page.seoDescription || "",
      seoKeywords: page.seoKeywords || "",
      ogImage: page.ogImage || "",
      ogTitle: page.ogTitle || "",
      ogDescription: page.ogDescription || "",
      metaHeaderTags: page.metaHeaderTags || "",
      allowIndexing: page.allowIndexing !== undefined ? page.allowIndexing : true,
    });
    setShowPageForm(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Website
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
                Admin Panel
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your website content, pages, services, and industries.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("pages")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "pages"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Pages & Navigation
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "services"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab("industries")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "industries"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Industries
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "pages" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Pages
              </h2>
              <button
                onClick={() => {
                  setEditingPage(null);
                  setPageForm({
                    title: "",
                    slug: "",
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
                  setShowPageForm(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Page
              </button>
            </div>

            {showPageForm && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingPage ? "Edit" : "Add"} Page
                </h3>
                <form onSubmit={handlePageSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={pageForm.title}
                      onChange={(e) =>
                        setPageForm({ ...pageForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will be used as the navigation label
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={pageForm.slug}
                      onChange={(e) =>
                        setPageForm({
                          ...pageForm,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-"),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL-friendly identifier (e.g., &quot;about&quot; for
                      /about)
                    </p>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
                      SEO Settings
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          value={pageForm.seoTitle}
                          onChange={(e) =>
                            setPageForm({
                              ...pageForm,
                              seoTitle: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                          placeholder="SEO title for search engines"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 50-60 characters
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Meta Description
                        </label>
                        <textarea
                          value={pageForm.seoDescription}
                          onChange={(e) =>
                            setPageForm({
                              ...pageForm,
                              seoDescription: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                          placeholder="SEO description for search engines"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 150-160 characters
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Meta Keywords
                        </label>
                        <input
                          type="text"
                          value={pageForm.seoKeywords}
                          onChange={(e) =>
                            setPageForm({
                              ...pageForm,
                              seoKeywords: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                          placeholder="Comma-separated keywords"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Separate keywords with commas
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
                      Open Graph (Social Media) Settings
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <FileUpload
                          label="OG Image"
                          value={pageForm.ogImage || ""}
                          onChange={(url) =>
                            setPageForm({
                              ...pageForm,
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
                    <h4 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
                      Meta Header Tags
                    </h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Custom Header Tags
                      </label>
                      <textarea
                        value={pageForm.metaHeaderTags || ""}
                        onChange={(e) =>
                          setPageForm({
                            ...pageForm,
                            metaHeaderTags: e.target.value,
                          })
                        }
                        rows={12}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
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
                        checked={pageForm.isPublished}
                        onChange={(e) =>
                          setPageForm({
                            ...pageForm,
                            isPublished: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">
                        Published (appears in navigation when published)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pageForm.allowIndexing}
                        onChange={(e) =>
                          setPageForm({
                            ...pageForm,
                            allowIndexing: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">
                        Allow Search Engine Indexing (uncheck to add noindex meta tag)
                      </span>
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPageForm(false);
                        setEditingPage(null);
                        setPageForm({
                          title: "",
                          slug: "",
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
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
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
                  {pages.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No pages yet. Add one to get started.
                      </td>
                    </tr>
                  ) : (
                    pages.map((page) => (
                      <tr key={page._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {page.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {page.slug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              page.isPublished
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {page.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Link
                            href={`/${page.slug}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/pages/${page._id}`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Sections
                          </Link>
                          <button
                            onClick={() => editPage(page)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePage(page._id)}
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

            {/* Navigation Ordering Section */}
            <div className="mt-12">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Navigation Order
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Reorder items in the navigation bar. Pages, Services dropdown,
                  and Industries dropdown can be rearranged together.
                </p>
              </div>

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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {navItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No navigation items yet. Add pages or publish
                          services/industries to see them here.
                        </td>
                      </tr>
                    ) : (
                      navItems.map((item, index) => (
                        <tr
                          key={`${item.type}-${
                            item.type === "page" ? item.id : item.title
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => moveNavItem(index, "up")}
                                disabled={index === 0}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                title="Move up in navigation"
                              >
                                ↑
                              </button>
                              <span className="text-sm text-gray-900 dark:text-white">
                                {index + 1}
                              </span>
                              <button
                                onClick={() => moveNavItem(index, "down")}
                                disabled={index === navItems.length - 1}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                title="Move down in navigation"
                              >
                                ↓
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {item.type === "page"
                                ? "Page"
                                : item.type === "services"
                                ? "Services Dropdown"
                                : "Industries Dropdown"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {item.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {item.type === "page" ? (
                              <Link
                                href={`/admin/pages/${item.id}`}
                                className="text-green-600 hover:text-green-900"
                              >
                                Manage
                              </Link>
                            ) : item.type === "services" ? (
                              <Link
                                href="/admin/services"
                                className="text-green-600 hover:text-green-900"
                              >
                                Manage Services
                              </Link>
                            ) : (
                              <Link
                                href="/admin/industries"
                                className="text-green-600 hover:text-green-900"
                              >
                                Manage Industries
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "services" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Services Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your services. Published services appear in the Services
                dropdown menu.
              </p>
            </div>
            <div className="mb-4">
              <Link
                href="/admin/services"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Manage Services →
              </Link>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Services
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {services.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Published
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {services.filter((s) => s.isPublished).length}
                  </p>
                </div>
              </div>
            </div>
            {services.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Recent Services
                </h3>
                <div className="space-y-2">
                  {services.slice(0, 5).map((service) => (
                    <div
                      key={service._id}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {service.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          /{service.slug}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          service.isPublished
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                        }`}
                      >
                        {service.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "industries" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Industries Management
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your industries. Published industries appear in the
                Industries dropdown menu.
              </p>
            </div>
            <div className="mb-4">
              <Link
                href="/admin/industries"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Manage Industries →
              </Link>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Industries
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {industries.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Published
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {industries.filter((i) => i.isPublished).length}
                  </p>
                </div>
              </div>
            </div>
            {industries.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Recent Industries
                </h3>
                <div className="space-y-2">
                  {industries.slice(0, 5).map((industry) => (
                    <div
                      key={industry._id}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {industry.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          /{industry.slug}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          industry.isPublished
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                        }`}
                      >
                        {industry.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
