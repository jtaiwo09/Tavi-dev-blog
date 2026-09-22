import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

import Providers from "@/components/providers";
import NavbarContainer from "@/components/navbar-container";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { SidebarProvider } from "@/components/navigation/sidebar-context";
import Footer from "@/components/footer";
import { siteConfig } from "@/lib/site";
import { OrganizationSchema } from "@/components/seo/organization-schema";
import { WebsiteSchema } from "@/components/seo/website-schema";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  applicationName: siteConfig.name,

  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],

  creator: siteConfig.author.name,

  keywords: siteConfig.keywords,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.siteName,
    title: siteConfig.title,
    description: siteConfig.description,
    images: siteConfig.ogImages,
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: siteConfig.twitterImages,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-pt-18">
      <body
        id="top"
        className={`${inter.variable} ${newsreader.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <OrganizationSchema />
        <WebsiteSchema />
        <Providers>
          <SidebarProvider>
            <NavbarContainer />
          </SidebarProvider>

          <main className="pt-14 md:pt-18">{children}</main>
          <Footer />

          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
