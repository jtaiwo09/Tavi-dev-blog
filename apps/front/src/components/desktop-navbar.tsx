"use client";

import { cn } from "@repo/ui/lib/utils";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";

type Props = PropsWithChildren;

const DesktopNavbar = ({ children }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isHome = pathname === "/";

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 hidden border-b transition-all duration-300 md:block",
        scrolled || !isHome
          ? "border-border/80 bg-background/85 text-foreground shadow-xs backdrop-blur-xl"
          : "border-transparent bg-transparent text-foreground",
      )}
    >
      <div className="content-container flex min-h-18 items-center">
        {children}
      </div>
    </nav>
  );
};

export default DesktopNavbar;
