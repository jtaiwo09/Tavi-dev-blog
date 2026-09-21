"use client";

import Link from "next/link";
import {
  ArrowRightFromLine,
  BookOpen,
  List,
  Mail,
  Pencil,
  User as UserIcon,
} from "lucide-react";
import { useSidebar } from "./sidebar-context";
import type { User } from "@/lib/types/modelTypes";
import ThemeToggle from "../theme-toggle";
import Profile from "../profile";
import SignInPanel from "../signIn-panel";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";

interface IProps {
  user: User | null;
}

const MobileNavLinks = ({ user }: IProps) => {
  const { closeSidebar } = useSidebar();

  return (
    <nav className="ml-auto flex flex-col gap-1 md:flex-row md:items-center md:gap-1">
      {/* Navigation Group Header */}
      <div className="px-3 pb-1 pt-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase md:hidden">
        Navigation
      </div>

      {/* Blog */}
      <Link
        href="/blog"
        onClick={closeSidebar}
        className="group flex min-h-11 items-center gap-3 rounded-xs px-3 text-sm font-medium text-nav-foreground transition-colors hover:bg-nav-hover hover:text-foreground md:min-h-10"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-subtle text-brand md:size-auto md:bg-transparent">
          <BookOpen className="size-4" />
        </span>
        <span>Blog</span>
      </Link>

      {/* Contact */}
      <Link
        href="#contact"
        onClick={closeSidebar}
        className="group flex min-h-11 items-center gap-3 rounded-xs px-3 text-sm font-medium text-nav-foreground transition-colors hover:bg-nav-hover hover:text-foreground md:min-h-10"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-subtle text-brand md:size-auto md:bg-transparent">
          <Mail className="size-4" />
        </span>
        <span>Contact</span>
      </Link>

      {/* Divider */}
      <div
        aria-hidden="true"
        className="my-3 h-px bg-border md:mx-2 md:my-0 md:h-6 md:w-px"
      />

      {/* Theme */}
      <div className="flex items-center justify-between rounded-xl px-3 py-1 md:px-1 md:py-0">
        <span className="text-sm font-medium text-nav-foreground md:hidden">
          Appearance
        </span>
        <ThemeToggle />
      </div>

      {/* Account Section */}
      {user ? (
        <>
          {/* Desktop Only: Unchanged Floating Dropdown */}
          <div className="hidden md:ml-1 md:block">
            <Profile user={user} />
          </div>

          {/* Mobile Only: Inline Account Navigation */}
          <div className="mt-2 border-t border-border/70 pt-3 md:hidden">
            {/* Account Card Header */}
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-surface-subtle p-2.5">
              <Avatar className="size-9 shrink-0 border border-border/80">
                <AvatarImage
                  src={user.avatar || "/empty_profile.png"}
                  alt={user.name}
                />
                <AvatarFallback className="bg-brand-subtle text-brand">
                  <UserIcon className="size-4" />
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">Author account</p>
              </div>
            </div>

            {/* Inline Action Links */}
            <div className="flex flex-col gap-0.5">
              <Link
                href="/user/account"
                onClick={closeSidebar}
                className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-nav-foreground hover:bg-nav-hover hover:text-foreground"
              >
                <UserIcon className="size-4 text-muted-foreground" />
                <span>My profile</span>
              </Link>

              <Link
                href="/user/create-post"
                onClick={closeSidebar}
                className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-nav-foreground hover:bg-nav-hover hover:text-foreground"
              >
                <Pencil className="size-4 text-muted-foreground" />
                <span>Create new post</span>
              </Link>

              <Link
                href="/user/posts"
                onClick={closeSidebar}
                className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-nav-foreground hover:bg-nav-hover hover:text-foreground"
              >
                <List className="size-4 text-muted-foreground" />
                <span>My posts</span>
              </Link>

              <a
                href="/api/auth/signout"
                className="mt-1 flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <ArrowRightFromLine className="size-4" />
                <span>Sign out</span>
              </a>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-1 border-t border-border/70 pt-3 md:ml-1 md:mt-0 md:border-0 md:pt-0">
          <SignInPanel />
        </div>
      )}
    </nav>
  );
};

export default MobileNavLinks;
