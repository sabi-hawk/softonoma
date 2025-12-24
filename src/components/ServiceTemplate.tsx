"use client";

import Link from "next/link";

export interface ServiceTemplateData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    backgroundOpacity?: number;
  };
  overview: {
    title: string;
    description: string;
    image?: string;
  };
  features: {
    title: string;
    description: string;
    items: Array<{
      icon?: string;
      title: string;
      description: string;
    }>;
  };
  process: {
    title: string;
    description: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
    }>;
  };
  benefits: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  useCases?: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  technologies?: {
    title: string;
    description: string;
    items: Array<{
      name: string;
      icon?: string;
    }>;
  };
  caseStudies?: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      result?: string;
    }>;
  };
  faq?: {
    title: string;
    description: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

interface ServiceTemplateProps {
  data: ServiceTemplateData;
  serviceTitle: string;
}

export default function ServiceTemplate({
  data,
  serviceTitle,
}: ServiceTemplateProps) {
  // Get background media and opacity from hero
  const backgroundImage = data.hero.backgroundImage;
  const backgroundVideo = data.hero.backgroundVideo;
  const backgroundOpacity = data.hero.backgroundOpacity ?? 0.3;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative theme-bg-black theme-text-white py-20 lg:py-32 overflow-hidden">
        {/* Background Image/Video */}
        {(backgroundImage || backgroundVideo) && (
          <div className="absolute inset-0">
            {backgroundVideo ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ opacity: backgroundOpacity }}
              >
                <source src={backgroundVideo} type="video/mp4" />
                <source src={backgroundVideo} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            ) : backgroundImage ? (
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                  opacity: backgroundOpacity,
                }}
              />
            ) : null}
          </div>
        )}

        {/* Dark overlay to ensure content readability */}
        {(backgroundImage || backgroundVideo) && (
          <div
            className="absolute inset-0 theme-bg-black"
            style={{ opacity: 0.5 }}
          ></div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 theme-text-white">
              {data.hero.title || serviceTitle}
            </h1>
            {data.hero.subtitle && (
              <p className="text-xl md:text-2xl theme-primary-end mb-4">
                {data.hero.subtitle}
              </p>
            )}
            {data.hero.description && (
              <p
                className="text-lg theme-text-white mb-8"
                style={{ opacity: 0.9 }}
              >
                {data.hero.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              {data.hero.primaryButtonText && (
                <Link
                  href={data.hero.primaryButtonLink || "#contact"}
                  className="px-6 py-3 theme-gradient theme-text-white rounded-lg font-semibold transition-all hover:shadow-lg"
                >
                  {data.hero.primaryButtonText}
                </Link>
              )}
              {data.hero.secondaryButtonText && (
                <Link
                  href={data.hero.secondaryButtonLink || "#overview"}
                  className="px-6 py-3 bg-transparent border-2 theme-text-white hover:bg-white/10 rounded-lg font-semibold transition-colors"
                  style={{ borderColor: "rgba(255, 255, 255, 0.3)" }}
                >
                  {data.hero.secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      {data.overview && (
        <section id="overview" className="py-16 lg:py-24 theme-bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {data.overview.image && (
                  <img
                    src={data.overview.image}
                    alt={data.overview.title}
                    className="rounded-lg shadow-lg"
                  />
                )}
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold theme-text-black mb-4">
                  {data.overview.title}
                </h2>
                <p
                  className="text-lg theme-text-black whitespace-pre-line"
                  style={{ opacity: 0.8 }}
                >
                  {data.overview.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {data.features &&
        data.features.items &&
        data.features.items.length > 0 && (
          <section className="py-16 lg:py-24 theme-bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold theme-text-white mb-4">
                  {data.features.title}
                </h2>
                {data.features.description && (
                  <p
                    className="text-lg theme-text-white max-w-2xl mx-auto"
                    style={{ opacity: 0.9 }}
                  >
                    {data.features.description}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.features.items.map((feature, index) => (
                  <div
                    key={index}
                    className="theme-bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-800"
                  >
                    {feature.icon && (
                      <div className="text-4xl mb-4">{feature.icon}</div>
                    )}
                    <h3 className="text-xl font-semibold theme-text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="theme-text-white" style={{ opacity: 0.8 }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Process Section */}
      {data.process && data.process.steps && data.process.steps.length > 0 && (
        <section className="py-16 lg:py-24 theme-bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold theme-text-black mb-4">
                {data.process.title}
              </h2>
              {data.process.description && (
                <p
                  className="text-lg theme-text-black max-w-2xl mx-auto"
                  style={{ opacity: 0.8 }}
                >
                  {data.process.description}
                </p>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.process.steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 theme-gradient theme-text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.number || index + 1}
                  </div>
                  <h3 className="text-xl font-semibold theme-text-black mb-2">
                    {step.title}
                  </h3>
                  <p className="theme-text-black" style={{ opacity: 0.8 }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {data.benefits &&
        data.benefits.items &&
        data.benefits.items.length > 0 && (
          <section className="py-16 lg:py-24 theme-bg-black-green-gradient">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold theme-text-white mb-4">
                  {data.benefits.title}
                </h2>
                {data.benefits.description && (
                  <p
                    className="text-lg theme-text-white max-w-2xl mx-auto"
                    style={{ opacity: 0.9 }}
                  >
                    {data.benefits.description}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {data.benefits.items.map((benefit, index) => (
                  <div
                    key={index}
                    className="theme-bg-black p-6 rounded-lg shadow-md border border-gray-800"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-8 h-8 theme-gradient rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 theme-text-white"
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
                        <h3 className="text-xl font-semibold theme-text-white mb-2">
                          {benefit.title}
                        </h3>
                        <p
                          className="theme-text-white"
                          style={{ opacity: 0.8 }}
                        >
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Use Cases Section */}
      {data.useCases &&
        data.useCases.items &&
        data.useCases.items.length > 0 && (
          <section className="py-16 lg:py-24 theme-bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold theme-text-black mb-4">
                  {data.useCases.title}
                </h2>
                {data.useCases.description && (
                  <p
                    className="text-lg theme-text-black max-w-2xl mx-auto"
                    style={{ opacity: 0.8 }}
                  >
                    {data.useCases.description}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.useCases.items.map((useCase, index) => (
                  <div
                    key={index}
                    className="theme-bg-white p-6 rounded-lg shadow-md border border-gray-200"
                  >
                    <h3 className="text-xl font-semibold theme-text-black mb-2">
                      {useCase.title}
                    </h3>
                    <p className="theme-text-black" style={{ opacity: 0.8 }}>
                      {useCase.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Technologies Section */}
      {data.technologies &&
        data.technologies.items &&
        data.technologies.items.length > 0 && (
          <section className="py-16 lg:py-24 theme-bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold theme-text-white mb-4">
                  {data.technologies.title}
                </h2>
                {data.technologies.description && (
                  <p
                    className="text-lg theme-text-white max-w-2xl mx-auto"
                    style={{ opacity: 0.9 }}
                  >
                    {data.technologies.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {data.technologies.items.map((tech, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center p-4 theme-bg-black rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    {tech.icon && (
                      <div className="text-4xl mb-2">{tech.icon}</div>
                    )}
                    {tech.name && (
                      <h4 className="text-sm font-semibold theme-text-white text-center">
                        {tech.name}
                      </h4>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* Case Studies Section */}
      {data.caseStudies &&
        data.caseStudies.items &&
        data.caseStudies.items.length > 0 && (
          <section className="py-16 lg:py-24 theme-bg-black-green-gradient">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold theme-text-white mb-4">
                  {data.caseStudies.title}
                </h2>
                {data.caseStudies.description && (
                  <p
                    className="text-lg theme-text-white max-w-2xl mx-auto"
                    style={{ opacity: 0.9 }}
                  >
                    {data.caseStudies.description}
                  </p>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {data.caseStudies.items.map((caseStudy, index) => (
                  <div
                    key={index}
                    className="theme-bg-black p-6 rounded-lg shadow-md border border-gray-800"
                  >
                    <h3 className="text-xl font-semibold theme-text-white mb-2">
                      {caseStudy.title}
                    </h3>
                    <p
                      className="theme-text-white mb-4"
                      style={{ opacity: 0.8 }}
                    >
                      {caseStudy.description}
                    </p>
                    {caseStudy.result && (
                      <div
                        className="mt-4 p-4 rounded-lg"
                        style={{ backgroundColor: "rgba(92, 140, 36, 0.1)" }}
                      >
                        <p className="text-sm font-semibold theme-primary-end">
                          Result: {caseStudy.result}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* FAQ Section */}
      {data.faq && data.faq.items && data.faq.items.length > 0 && (
        <section className="py-16 lg:py-24 theme-bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold theme-text-black mb-4">
                {data.faq.title}
              </h2>
              {data.faq.description && (
                <p
                  className="text-lg theme-text-black max-w-2xl mx-auto"
                  style={{ opacity: 0.8 }}
                >
                  {data.faq.description}
                </p>
              )}
            </div>
            <div className="space-y-4">
              {data.faq.items.map((faq, index) => (
                <div
                  key={index}
                  className="theme-bg-white p-6 rounded-lg shadow-md border border-gray-200"
                >
                  <h3 className="text-lg font-semibold theme-text-black mb-2">
                    {faq.question}
                  </h3>
                  <p className="theme-text-black" style={{ opacity: 0.8 }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {data.cta && (
        <section className="py-16 lg:py-24 theme-bg-black theme-text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 theme-text-white">
              {data.cta.title}
            </h2>
            {data.cta.description && (
              <p
                className="text-lg theme-text-white mb-8"
                style={{ opacity: 0.9 }}
              >
                {data.cta.description}
              </p>
            )}
            {data.cta.buttonText && (
              <Link
                href={data.cta.buttonLink || "#contact"}
                className="inline-block px-8 py-3 theme-gradient theme-text-white rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                {data.cta.buttonText}
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
