"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ServiceTemplateEditor from "@/components/admin/ServiceTemplateEditor";
import Loader from "@/components/admin/Loader";

interface Service {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
}

export default function ServiceTemplateAdmin() {
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const serviceRes = await fetch(`/api/services/id/${serviceId}`);
      const serviceData = await serviceRes.json();

      if (serviceData.success) {
        setService(serviceData.data);
      }
    } catch (error) {
      console.error("Error fetching service:", error);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (content: string) => {
    try {
      console.log("Saving service content, length:", content.length);
      console.log("Content preview:", content.substring(0, 200));

      const res = await fetch(`/api/services/id/${serviceId}`, {
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
        setService((prev) => (prev ? { ...prev, content } : null));
        console.log(
          "Service state updated with content length:",
          content.length
        );
      } else {
        throw new Error(data.error || "Failed to save");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      throw error;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Service not found
            </p>
            <Link
              href="/admin/services"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to Services
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
              Edit Service: {service.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Service URL: /services/{service.slug}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/services"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              ← Back
            </Link>
            <Link
              href={`/services/${service.slug}`}
              target="_blank"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Service
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <ServiceTemplateEditor
            initialContent={service.content || ""}
            serviceTitle={service.title}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
