"use client";

import Link from "next/link";
import { BookOpen, Mail } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import type { User } from "@/lib/types/modelTypes";
import ThemeToggle from "../theme-toggle";
import Profile from "../profile";
import SignInPanel from "../signIn-panel";

interface IProps {
  user: User | null;
}

const MobileNavLinks = ({ user }: IProps) => {
  const { closeSidebar } = useSidebar();

  return (
    <nav className="ml-auto flex flex-col gap-1 md:flex-row md:items-center md:gap-1">
      {/* Blog */}

      <Link
        href="/blog"
        onClick={closeSidebar}
        className="group flex min-h-11 items-center gap-3
            rounded-xs px-3
            text-sm font-medium
            text-nav-foreground
            transition-colors
            hover:bg-nav-hover hover:text-foreground
            md:min-h-10"
      >
        <span
          className="
              flex size-8 shrink-0 items-center justify-center
              rounded-lg bg-brand-subtle text-brand
              md:size-auto md:bg-transparent
            "
        >
          <BookOpen className="size-4" />
        </span>

        <span>Blog</span>
      </Link>

      {/* Contact */}
      <Link
        href="#contact"
        className="
            group flex min-h-11 items-center gap-3
            rounded-xs px-3
            text-sm font-medium
            text-nav-foreground
            transition-colors
            hover:bg-nav-hover hover:text-foreground
            md:min-h-10
          "
      >
        <span
          className="
              flex size-8 shrink-0 items-center justify-center
              rounded-lg bg-brand-subtle text-brand
              md:size-auto md:bg-transparent
            "
        >
          <Mail className="size-4" />
        </span>

        <span>Contact</span>
      </Link>

      {/* Divider */}
      <div
        aria-hidden="true"
        className="
            my-3 h-px bg-border
            md:mx-2 md:my-0 md:h-6 md:w-px
          "
      />

      {/* Theme */}
      <div
        className="
            flex items-center justify-between
            rounded-xl px-3 py-2
            md:px-1 md:py-0
          "
      >
        <span className="text-sm font-medium text-nav-foreground md:hidden">
          Appearance
        </span>

        <ThemeToggle />
      </div>

      {/* Account */}
      {user ? (
        <div
          className="
              mt-1 border-t border-border/70 pt-3
              md:ml-1 md:mt-0 md:border-0 md:pt-0
            "
        >
          <Profile user={user} />
        </div>
      ) : (
        <div
          className="
              mt-1 border-t border-border/70 pt-3
              md:ml-1 md:mt-0 md:border-0 md:pt-0
            "
        >
          <SignInPanel />
        </div>
      )}
    </nav>
  );
};

export default MobileNavLinks;
