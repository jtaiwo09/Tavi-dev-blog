import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";

import "./globals.css";
import "highlight.js/styles/github-dark.css";

import Providers from "@/components/providers";
import NavbarContainer from "@/components/navbar-container";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { SidebarProvider } from "@/components/navigation/sidebar-context";

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
  title: {
    default: "Tavi",
    template: "%s | Tavi",
  },
  description:
    "Insights, tutorials, and stories for developers and curious minds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${newsreader.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <Providers>
          <SidebarProvider>
            <NavbarContainer />
          </SidebarProvider>

          <main className="pt-10 md:pt-18">{children}</main>

          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
