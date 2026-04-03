import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Waffo.dev — Payments API for Developers",
    template: "%s | Waffo.dev",
  },
  description:
    "Guides, case studies, demos, and updates for developers building on the Waffo payments platform.",
  keywords: ["payments API", "payment developer", "payment integration", "waffo"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://waffo.dev",
    siteName: "Waffo.dev",
    title: "Waffo.dev — Payments API for Developers",
    description:
      "Guides, case studies, demos, and updates for developers building on the Waffo payments platform.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@waffo_dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
