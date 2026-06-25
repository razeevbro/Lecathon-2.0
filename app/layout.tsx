import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ORGANIZER_NAME } from "@/app/constants";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://lecathon-2-0.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lecathon 2.0 — Hack. Build. Innovate.",
  description: `Join Lecathon 2.0, the flagship hackathon by ${ORGANIZER_NAME} at LEMSC. Build innovative solutions, win prizes, and launch your career.`,
  keywords: [
    "hackathon",
    "Lecathon",
    ORGANIZER_NAME,
    "LEMSC",
    "Nepal",
    "innovation",
  ],
  openGraph: {
    title: "Lecathon 2.0",
    description:
      "Learn, Build, Innovate — Join the most exciting hackathon of 2026.",
    type: "website",
    url: siteUrl,
    siteName: "Lecathon 2.0",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lecathon 2.0",
    description: `Flagship hackathon by ${ORGANIZER_NAME} at LEMSC.`,
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: "/icon.png",
  },
};

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
