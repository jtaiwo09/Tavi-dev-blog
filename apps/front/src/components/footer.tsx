"use client";
import Link from "next/link";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { Brand } from "./brand";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Writing", href: "#latest-posts" },
];

const topics = [
  { label: "Development", href: "/blog?category=development" },
  { label: "Design", href: "/blog?category=design" },
  { label: "Technology", href: "/blog?category=technology" },
  { label: "Ideas", href: "/blog?category=ideas" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="content-container">
        {/* Main footer */}
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.4fr_0.6fr_0.6fr] lg:gap-16 lg:py-20">
          {/* Brand / statement */}
          <div className="max-w-xl">
            <Brand />

            <h2 className="md:mt-7 max-w-lg text-balance font-serif text-3xl font-medium leading-[1.05] tracking-[-0.035em] text-foreground sm:text-4xl lg:text-5xl">
              Ideas for people who build.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              Software, design, technology, and thoughtful writing about the
              things we create and the ideas behind them.
            </p>

            <Link
              href="/blog"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-brand"
            >
              Explore the writing
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              Navigate
            </p>

            <nav aria-label="Footer navigation" className="mt-5">
              <ul className="space-y-3">
                {navigation.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Topics */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              Topics
            </p>

            <nav aria-label="Footer topics" className="mt-5">
              <ul className="space-y-3">
                {topics.map((topic) => (
                  <li key={topic.label}>
                    <Link
                      href={topic.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {topic.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-border py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <span>© {currentYear} Tavi</span>

            <span aria-hidden="true" className="text-border">
              /
            </span>

            <span>Developer & writer</span>
          </div>

          <Link
            href="#top"
            aria-label="Back to top"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="relative">Back to top</span>
            <ArrowUp className="size-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
