import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import { headers } from "next/headers";
import {
  getMetaHeaderTagsBySlug,
  getMetaHeaderTagsByService,
  getMetaHeaderTagsByIndustry,
  MetaHeaderTags,
} from "@/lib/meta-header-tags";

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

  if (!isAdminRoute) {
    try {
      if (currentPath.startsWith("/services/")) {
        const slug = currentPath.replace("/services/", "").split("/")[0];
        if (slug) metaHeaderTags = await getMetaHeaderTagsByService(slug);
      } else if (currentPath.startsWith("/industries/")) {
        const slug = currentPath.replace("/industries/", "").split("/")[0];
        if (slug) metaHeaderTags = await getMetaHeaderTagsByIndustry(slug);
      } else if (currentPath === "/") {
        metaHeaderTags = await getMetaHeaderTagsBySlug("home");
      } else if (currentPath && currentPath !== "/") {
        const slug = currentPath.replace(/^\//, "").split("/")[0];
        if (slug) metaHeaderTags = await getMetaHeaderTagsBySlug(slug);
      }
    } catch (error) {
      console.error("Error fetching meta header tags:", error);
    }
  }

  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4L918V4SS2"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4L918V4SS2');
            `,
          }}
        />
        {metaHeaderTags && <MetaHeaderTags html={metaHeaderTags} />}
      </head>
      <body className={`${sora.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
        <NavbarWrapper />
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}
