import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { buildSiteMetadata } from "@/lib/seo";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = buildSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
