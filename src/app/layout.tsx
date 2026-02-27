import type { Metadata } from "next";
import { Suspense } from "react";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import { headers } from "next/headers";
import {
  getMetaHeaderTagsBySlug,
  getMetaHeaderTagsByService,
  getMetaHeaderTagsByIndustry,
  getMetaHeaderTagsByBlog,
  MetaHeaderTags,
} from "@/lib/meta-header-tags";
import { getHomeHeroImageUrl } from "@/lib/home-hero";
import { getSiteSettings } from "@/lib/get-site-settings";

function ShellFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center" aria-hidden="true">
      <div className="flex flex-col items-center justify-center">
        <svg
          className="animate-spin h-10 w-10 text-[#f3aa20]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    </div>
  );
}

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IT Solutions - Leading Technology Services Provider",
  description:
    "We provide cutting-edge IT solutions, software development, cloud services, and digital transformation services to help businesses thrive in the digital age.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const currentPath = headersList.get("x-pathname") || "";
  const isAdminRoute = currentPath.startsWith("/admin") || currentPath.startsWith("/api");

  let metaHeaderTags: string | null = null;
  let heroImageUrl: string | null = null;

  let gtmId: string | null = null;
  if (!isAdminRoute) {
    try {
      const [siteSettings] = await Promise.all([
        getSiteSettings(),
        (async () => {
          if (currentPath.startsWith("/services/")) {
            const slug = currentPath.replace("/services/", "").split("/")[0];
            if (slug) metaHeaderTags = await getMetaHeaderTagsByService(slug);
          } else if (currentPath.startsWith("/industries/")) {
            const slug = currentPath.replace("/industries/", "").split("/")[0];
            if (slug) metaHeaderTags = await getMetaHeaderTagsByIndustry(slug);
          } else if (currentPath.startsWith("/blog/")) {
            const slug = currentPath.replace("/blog/", "").split("/")[0];
            if (slug) metaHeaderTags = await getMetaHeaderTagsByBlog(slug);
          } else if (currentPath === "/") {
            const [meta, hero] = await Promise.all([
              getMetaHeaderTagsBySlug("home"),
              getHomeHeroImageUrl(),
            ]);
            metaHeaderTags = meta;
            heroImageUrl = hero;
          } else if (currentPath && currentPath !== "/") {
            const slug = currentPath.replace(/^\//, "").split("/")[0];
            if (slug) metaHeaderTags = await getMetaHeaderTagsBySlug(slug);
          }
        })(),
      ]);
      gtmId = siteSettings.gtmId;
    } catch (error) {
      console.error("Error fetching meta header tags or site settings:", error);
    }
  }

  return (
    <html lang="en">
      <head>
        {heroImageUrl && (
          <link
            rel="preload"
            href={`/_next/image?url=${encodeURIComponent(heroImageUrl)}&w=1920&q=85`}
            as="image"
            fetchPriority="high"
          />
        )}
        {/* Google Tag Manager: script + noscript (plain script so both appear in initial HTML) */}
        {gtmId && (
          <>
            {/* eslint-disable-next-line @next/next/next-script-for-ga */}
            <script
              id="gtm-script"
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId.replaceAll('"', '\\"')}');`,
              }}
            />
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
                title="Google Tag Manager"
              />
            </noscript>
          </>
        )}
        {metaHeaderTags && <MetaHeaderTags html={metaHeaderTags} />}
      </head>
      <body className={`${sora.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
        <Suspense fallback={<ShellFallback />}>
          <NavbarWrapper />
          {children}
          <FooterWrapper />
        </Suspense>
      </body>
    </html>
  );
}
