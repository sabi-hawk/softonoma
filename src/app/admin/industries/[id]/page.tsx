"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import IndustryTemplateEditor from "@/components/admin/IndustryTemplateEditor";

interface Industry {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
}

export default function IndustryTemplateAdmin() {
  const params = useParams();
  const industryId = params.id as string;

  const [industry, setIndustry] = useState<Industry | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const industryRes = await fetch(`/api/industries/id/${industryId}`);
      const industryData = await industryRes.json();

      if (industryData.success) {
        setIndustry(industryData.data);
      }
    } catch (error) {
      console.error("Error fetching industry:", error);
    } finally {
      setLoading(false);
    }
  }, [industryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (content: string) => {
    try {
      console.log("Saving industry content, length:", content.length);
      console.log("Content preview:", content.substring(0, 200));

      const res = await fetch(`/api/industries/id/${industryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
        }),
      });

      const data = await res.json();
      console.log("Save response:", data);

      if (data.success) {
        // Update local state
        setIndustry((prev) => (prev ? { ...prev, content } : null));
        console.log("Industry state updated with content length:", content.length);
      } else {
        throw new Error(data.error || "Failed to save");
      }
    } catch (error) {
      console.error("Error saving industry:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!industry) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Industry not found
            </p>
            <Link
              href="/admin/industries"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to Industries
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Industry: {industry.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Industry URL: /industries/{industry.slug}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/industries"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              ← Back
            </Link>
            <Link
              href={`/industries/${industry.slug}`}
              target="_blank"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Industry
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <IndustryTemplateEditor
            initialContent={industry.content || ""}
            industryTitle={industry.title}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}


