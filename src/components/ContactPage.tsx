"use client";

import { useState } from "react";

interface ContactPageProps {
  title?: string;
  advantages?: string[];
}

export default function ContactPage({
  title = "Send Us a Message",
  advantages = [
    "Expert team with proven industry experience",
    "Transparent communication and agile approach",
    "Scalable and future-ready solutions",
    "Strong focus on quality and performance",
    "On-time delivery with dedicated support",
    "Custom solutions tailored to business needs",
  ],
}: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    businessPhone: "",
    companyName: "",
    email: "",
    message: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual form submission API call
      // const response = await fetch('/api/contact', { ... });
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({
        name: "",
        businessPhone: "",
        companyName: "",
        email: "",
        message: "",
      });
      setSelectedFiles([]);
      
      // Show success message (replace alert with proper notification system)
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg-white">
      {/* Professional Hero Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 theme-bg-white-green-gradient opacity-50"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold theme-primary-mid uppercase tracking-wider px-4 py-2 bg-white/80 rounded-full shadow-sm">
              Get in Touch
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold theme-text-black mb-6 leading-tight">
            {title.split(" ").map((word, index) =>
              word.toLowerCase() === "message" ? (
                <span key={index} className="theme-primary-mid">
                  {" "}
                  {word}
                </span>
              ) : (
                <span key={index}> {word}</span>
              )
            )}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can help transform your
            business with innovative technology solutions.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 rounded-lg theme-bg-primary-mid flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <a
                href="mailto:contact@softonoma.com"
                className="text-gray-600 hover:theme-primary-mid transition-colors"
              >
                contact@softonoma.com
              </a>
            </div>

            {/* Phone Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 rounded-lg theme-bg-primary-mid flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
              <a
                href="tel:+1234567890"
                className="text-gray-600 hover:theme-primary-mid transition-colors"
              >
                +1 (234) 567-890
              </a>
            </div>

            {/* Office Hours Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 rounded-lg theme-bg-primary-mid flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Office Hours
              </h3>
              <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Form and Advantages */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Side - Contact Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold theme-text-black mb-2">
                  Send us a message
                </h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#79b246] focus:ring-opacity-30 focus:border-[#79b246] transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Business Phone */}
                  <div>
                    <label
                      htmlFor="businessPhone"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Business Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="businessPhone"
                        name="businessPhone"
                        value={formData.businessPhone}
                        onChange={handleInputChange}
                        placeholder="+1 (234) 567-890"
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#79b246] focus:ring-opacity-30 focus:border-[#79b246] transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#79b246] focus:ring-opacity-30 focus:border-[#79b246] transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@company.com"
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#79b246] focus:ring-opacity-30 focus:border-[#79b246] transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Key in Your Message{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your project requirements..."
                      required
                      rows={6}
                        className="w-full px-4 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#79b246] focus:ring-opacity-30 focus:border-[#79b246] transition-all resize-y bg-gray-50 focus:bg-white"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <input
                      type="file"
                      id="fileInput"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="fileInput"
                      className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-lg border-2 border-gray-300 border-dashed text-gray-600 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all bg-gray-50"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="font-medium">Select Files</span>
                    </label>
                    {selectedFiles.length > 0 && (
                      <p className="mt-2 text-sm text-gray-500">
                        {selectedFiles.length} file(s) selected
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    style={{ backgroundColor: "#79b246" }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send message"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side - Advantages */}
            <div className="order-1 lg:order-2 flex flex-col justify-center">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-lg">
                <h2 className="text-2xl md:text-3xl font-bold theme-text-black mb-4">
                  Try Softonoma and enjoy our advantages:
                </h2>
                <p className="text-gray-600 mb-8">
                  Partner with us and experience the difference that expertise
                  and dedication make.
                </p>
                <ul className="space-y-5">
                  {advantages.map((advantage, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 group"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 bg-white border-2 border-gray-200 group-hover:border-opacity-100 group-hover:theme-bg-primary-mid transition-all duration-300 shadow-sm">
                        <svg
                          className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-base text-gray-700 leading-relaxed pt-1.5 group-hover:text-gray-900 transition-colors">
                        {advantage}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full theme-bg-primary-mid flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        24/7 Support Available
                      </p>
                      <p className="text-sm text-gray-600">
                        We're here to help whenever you need us
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
