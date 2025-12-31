"use client";

import Link from "next/link";

export interface HomePageData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    backgroundImage?: string;
  };
  services: {
    title: string;
    description: string;
    items: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  about: {
    title: string;
    description: string;
    features: Array<{
      title: string;
      description: string;
    }>;
    image?: string;
  };
  stats: {
    title: string;
    items: Array<{
      number: string;
      label: string;
    }>;
  };
  industries: {
    title: string;
    description: string;
    items: Array<{
      icon: string;
      name: string;
    }>;
  };
  testimonials: {
    title: string;
    description: string;
    items: Array<{
      quote: string;
      author: string;
      company: string;
      role?: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

interface HomePageProps {
  data: HomePageData;
}

export default function HomePage({ data }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Compact with IT Theme */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* IT-Themed Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {/* Code-like grid pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          ></div>

          {/* Animated code snippets effect */}
          <div className="absolute top-20 right-10 text-blue-400/20 font-mono text-xs">
            <div className="animate-pulse">const innovation = {"{"}...</div>
            <div className="animate-pulse delay-75">
              {" "}
              technology: &apos;cutting-edge&apos;,
            </div>
            <div className="animate-pulse delay-150">
              {" "}
              solutions: &apos;transformative&apos;
            </div>
            <div className="animate-pulse delay-200">{"}"}</div>
          </div>

          {/* Geometric shapes */}
          <div className="absolute top-40 left-10 w-32 h-32 border border-blue-500/20 rotate-45"></div>
          <div className="absolute bottom-40 right-20 w-24 h-24 border border-purple-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-500/10 rounded-lg rotate-12"></div>

          {/* Floating tech elements */}
          <div className="absolute top-1/3 right-1/4 text-6xl opacity-5 animate-float">
            💻
          </div>
          <div className="absolute bottom-1/4 left-1/3 text-5xl opacity-5 animate-float-delayed">
            ⚡
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/50 to-slate-900"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {data.hero.subtitle && (
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <p className="text-sm md:text-base text-blue-300 font-medium tracking-wide">
                  {data.hero.subtitle}
                </p>
              </div>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                {data.hero.title.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < data.hero.title.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </span>
            </h1>

            {data.hero.description && (
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                {data.hero.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {data.hero.primaryButtonText && (
                <Link
                  href={data.hero.primaryButtonLink || "#"}
                  className="group relative px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-base hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 overflow-hidden"
                >
                  <span className="relative z-10">
                    {data.hero.primaryButtonText}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              )}
              {data.hero.secondaryButtonText && (
                <Link
                  href={data.hero.secondaryButtonLink || "#"}
                  className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-lg font-semibold text-base hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                >
                  {data.hero.secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {data.services.title}
            </h2>
            {data.services.description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {data.services.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.services.items.map((service, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-xl bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-all duration-300"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center text-3xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Why Choose Us Section */}
      <section
        className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-50`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {data.about.title}
              </h2>
              {data.about.description && (
                <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                  {data.about.description}
                </p>
              )}
              <div className="space-y-6">
                {data.about.features.map((feature, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-xl flex items-center justify-center mr-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {data.about.image ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl transform rotate-3 opacity-20"></div>
                <img
                  src={data.about.image}
                  alt="About us"
                  className="relative rounded-2xl shadow-2xl"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl transform rotate-3 opacity-20"></div>
                <div className="relative h-96 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                  {/* Tech pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                      linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                    `,
                      backgroundSize: "30px 30px",
                    }}
                  ></div>
                  <div className="relative text-white text-center z-10">
                    <div className="text-6xl mb-4 animate-float">💼</div>
                    <p className="text-xl font-semibold">
                      Your Success Partner
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {data.stats.title && (
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {data.stats.title}
              </h2>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {data.stats.items.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-base md:text-lg text-blue-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {data.industries.title}
            </h2>
            {data.industries.description && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {data.industries.description}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {data.industries.items.map((industry, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-purple-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 text-center cursor-pointer hover:shadow-lg hover:-translate-y-1"
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {industry.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {industry.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {data.testimonials.items.length > 0 && (
        <section
          className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {data.testimonials.title}
              </h2>
              {data.testimonials.description && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {data.testimonials.description}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {data.testimonials.items.map((testimonial, index) => (
                <div
                  key={index}
                  className="group p-8 bg-white rounded-xl border border-gray-200 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-yellow-400 mb-4 text-lg">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic text-sm">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="font-bold text-gray-900 mb-1">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-gray-600">
                      {testimonial.role && `${testimonial.role}, `}
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        className={`py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {data.cta.title}
          </h2>
          {data.cta.description && (
            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto">
              {data.cta.description}
            </p>
          )}
          <Link
            href={data.cta.buttonLink || "#"}
            className="group inline-flex items-center gap-2 bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            <span>{data.cta.buttonText}</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
