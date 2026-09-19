"use client";

import Link from "next/link";
import { ArrowRightFromLine, List, Pencil, User } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

import type { User as UserType } from "@/lib/types/modelTypes";
import { useSidebar } from "./navigation/sidebar-context";

type Props = {
  user: UserType;
};

const Profile = ({ user }: Props) => {
  const { toggle } = useSidebar();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open profile menu"
          className="rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="size-9 border border-border/80">
            <AvatarImage
              src={user.avatar || "/empty_profile.png"}
              alt={user.name}
            />

            <AvatarFallback className="bg-brand-subtle text-brand">
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-100 w-64 rounded-xl border-border/70 bg-popover p-1.5 shadow-lg"
      >
        {/* Account information */}
        <div className="mb-1 flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-3">
          <Avatar className="size-9 shrink-0">
            <AvatarImage
              src={user.avatar || "/empty_profile.png"}
              alt={user.name}
            />

            <AvatarFallback className="bg-brand-subtle text-brand">
              <User className="size-4" />
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.name}
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Author account
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Profile */}
        <DropdownMenuItem asChild onClick={toggle}>
          <Link href="/user/account">
            <User className="size-4 text-muted-foreground" />
            <span>My profile</span>
          </Link>
        </DropdownMenuItem>

        {/* Create post */}
        <DropdownMenuItem asChild onClick={toggle}>
          <Link href="/user/create-post">
            <Pencil className="size-4 text-muted-foreground" />
            <span>Create new post</span>
          </Link>
        </DropdownMenuItem>

        {/* My posts */}
        <DropdownMenuItem asChild onClick={toggle}>
          <Link href="/user/posts">
            <List className="size-4 text-muted-foreground" />
            <span>My posts</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <DropdownMenuItem asChild>
          <a
            href="/api/auth/signout"
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <ArrowRightFromLine className="size-4" />
            <span>Sign out</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
