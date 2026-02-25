"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/admin/Loader";
import FileUpload from "@/components/admin/FileUpload";
import BlogTemplateEditor from "@/components/admin/BlogTemplateEditor";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  publishedAt?: string;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  allowIndexing?: boolean;
  metaHeaderTags?: string;
}

export default function AdminBlogEdit() {
  const params = useParams();
  const id = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingMeta, setSavingMeta] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    coverImage: "",
    author: "",
    publishedAt: "",
    isPublished: true,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    allowIndexing: true,
    metaHeaderTags: "",
  });

  // Slug: only lowercase letters, numbers, hyphens (matches Blog model)
  const slugRegex = /^[a-z0-9\-]+$/;
  const sanitizeSlug = (raw: string): string =>
    raw
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/blogs/id/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        const b = data.data;
        setBlog(b);
        setForm({
          title: b.title ?? "",
          slug: sanitizeSlug((b.slug ?? "").toString()),
          excerpt: b.excerpt ?? "",
          coverImage: b.coverImage ?? "",
          author: b.author ?? "",
          publishedAt: b.publishedAt ? new Date(b.publishedAt).toISOString().slice(0, 10) : "",
          isPublished: b.isPublished !== false,
          seoTitle: b.seoTitle ?? "",
          seoDescription: b.seoDescription ?? "",
          seoKeywords: b.seoKeywords ?? "",
          ogImage: b.ogImage ?? "",
          ogTitle: b.ogTitle ?? "",
          ogDescription: b.ogDescription ?? "",
          allowIndexing: b.allowIndexing !== false,
          metaHeaderTags: b.metaHeaderTags ?? "",
        });
      } else {
        setBlog(null);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveContent = useCallback(
    async (content: string) => {
      const res = await fetch(`/api/blogs/id/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to save");
      setBlog((prev) => (prev ? { ...prev, content } : null));
    },
    [id]
  );

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = sanitizeSlug(e.target.value);
    setForm((f) => ({ ...f, slug: next }));
  };

  const handleSaveMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug.trim();
    if (!slug) {
      alert("Slug is required.");
      return;
    }
    if (!slugRegex.test(slug)) {
      alert("Slug can only contain lowercase letters, numbers, and hyphens.");
      return;
    }
    setSavingMeta(true);
    try {
      const res = await fetch(`/api/blogs/id/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: slug,
          publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBlog(data.data);
        alert("Saved.");
      } else {
        alert(data.error || "Failed to save");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving");
    } finally {
      setSavingMeta(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-400 mb-4">Blog not found</p>
            <Link href="/admin/blog" className="text-blue-400 hover:text-blue-300">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Edit blog</h1>
            <p className="text-gray-400 mt-1">
              URL: /blog/{blog.slug}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/blog"
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              ← Back
            </Link>
            {blog.isPublished && (
              <Link
                href={`/blog/${blog.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View post
              </Link>
            )}
          </div>
        </div>

        {/* Meta form */}
        <form
          onSubmit={handleSaveMeta}
          className="bg-gray-800 rounded-lg shadow p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Post details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={handleSlugChange}
                className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white font-mono"
                pattern="^[a-z0-9\-]+$"
                title="Lowercase letters, numbers, and hyphens only"
                placeholder="e.g. my-post-title"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only lowercase letters (a–z), numbers (0–9), and hyphens (-). Spaces become hyphens.
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Excerpt
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Author
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="e.g. Jane Smith"
                className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Publish date
              </label>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">Displayed on the blog (e.g. March 10, 2024)</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isPublished: e.target.checked }))
                }
                className="rounded border-gray-600 bg-gray-700"
              />
              <label htmlFor="isPublished" className="text-gray-300">
                Published
              </label>
            </div>
            <div className="md:col-span-2">
              <FileUpload
                label="Cover image"
                value={form.coverImage}
                onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))}
                folder="blog"
              />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">SEO &amp; Meta</h3>
            <p className="text-sm text-gray-400 mb-4">
              Same options as normal pages: SEO fields, Open Graph, and additional header tags.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
                  placeholder="Defaults to post title if empty"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">SEO Description</label>
                <input
                  type="text"
                  value={form.seoDescription}
                  onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
                  placeholder="Short description for search results"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">SEO Keywords</label>
                <input
                  type="text"
                  value={form.seoKeywords}
                  onChange={(e) => setForm((f) => ({ ...f, seoKeywords: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">OG Image</label>
                <FileUpload
                  label=""
                  value={form.ogImage}
                  onChange={(url) => setForm((f) => ({ ...f, ogImage: url }))}
                  folder="og-images"
                  type="image"
                />
                <p className="text-xs text-gray-500 mt-1">Image for social sharing (e.g. Facebook, Twitter)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">OG Title</label>
                <input
                  type="text"
                  value={form.ogTitle}
                  onChange={(e) => setForm((f) => ({ ...f, ogTitle: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
                  placeholder="Defaults to SEO title if empty"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">OG Description</label>
                <input
                  type="text"
                  value={form.ogDescription}
                  onChange={(e) => setForm((f) => ({ ...f, ogDescription: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
                  placeholder="Defaults to SEO description if empty"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Meta Header Tags</label>
                <textarea
                  value={form.metaHeaderTags}
                  onChange={(e) => setForm((f) => ({ ...f, metaHeaderTags: e.target.value }))}
                  className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white font-mono text-sm"
                  rows={4}
                  placeholder={'<meta name="custom" content="value" />'}
                />
                <p className="text-xs text-gray-500 mt-1">Optional. Raw meta tags injected into the page head.</p>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allowIndexing"
                    checked={form.allowIndexing !== false}
                    onChange={(e) => setForm((f) => ({ ...f, allowIndexing: e.target.checked }))}
                    className="rounded border-gray-600 bg-gray-700"
                  />
                  <label htmlFor="allowIndexing" className="text-gray-300">
                    Allow search engines to index this post
                  </label>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={savingMeta}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            {savingMeta ? "Saving…" : "Save details"}
          </button>
        </form>

        {/* Rich text editor */}
        <div className="bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Content</h2>
          <BlogTemplateEditor
            initialContent={blog.content || ""}
            onSave={handleSaveContent}
          />
        </div>
      </div>
    </div>
  );
}
