import type { Metadata } from "next";
import { Inter, Figtree } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IT Solutions - Leading Technology Services Provider",
  description:
    "We provide cutting-edge IT solutions, software development, cloud services, and digital transformation services to help businesses thrive in the digital age.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${inter.variable} antialiased`}>
        <NavbarWrapper />
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}
