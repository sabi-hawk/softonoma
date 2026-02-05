"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Loader from "@/components/admin/Loader";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  updatedAt: string;
  createdAt: string;
}

export default function AdminBlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const slug = `untitled-${Date.now()}`;
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled",
          slug,
          content: "",
        }),
      });
      const data = await res.json();
      if (data.success && data.data?._id) {
        window.location.href = `/admin/blog/${data.data._id}`;
        return;
      }
      alert(data.error || "Failed to create blog");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Error creating blog");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/blogs/id/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Error deleting blog");
    }
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
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Blog</h1>
              <p className="text-gray-400 mt-2">
                Create and manage blog posts. Each post uses the rich text editor.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
            >
              {creating ? "Creating…" : "+ New blog"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 overflow-hidden">
          {blogs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No blog posts yet. Click &quot;New blog&quot; to create one.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="bg-gray-800 hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-white font-medium">
                      {blog.title || "Untitled"}
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-sm">
                      /blog/{blog.slug}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs rounded ${
                          blog.isPublished
                            ? "bg-green-900/50 text-green-300"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {blog.updatedAt
                        ? new Date(blog.updatedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/blog/${blog._id}`}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(blog._id, blog.title)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
