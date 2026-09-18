"use client";

import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { X } from "lucide-react";

type Props = PropsWithChildren<{
  triggerIcon: ReactNode;
  triggerClassName?: string;
}>;

const SideBar = ({ children, triggerIcon, triggerClassName }: Props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Mobile header */}
      <div
        className={cn(
          "fixed left-4 right-4 top-4 z-50",
          "flex h-14 items-center justify-between",
          "rounded-2xl border border-border/80",
          "bg-background/90 px-3 shadow-sm backdrop-blur-md",
          triggerClassName,
        )}
      >
        <Link
          href="/"
          onClick={close}
          className="group flex items-center gap-3"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground">
            T
          </span>

          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-foreground">
            Tavi / Dev
          </span>
        </Link>

        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
          className="
            flex size-9 items-center justify-center
            rounded-xl
            text-muted-foreground
            transition-colors
            hover:bg-surface-hover
            hover:text-brand
            active:scale-95
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
          "
        >
          {triggerIcon}
        </button>
      </div>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-[55] bg-black/20 backdrop-blur-[2px]",
          "transition-opacity duration-300",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />

      {/* Drawer */}
      <aside
        id="mobile-navigation"
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-[60]",
          "flex w-[min(21rem,88vw)] flex-col",
          "border-r border-border/70",
          "bg-background shadow-2xl",
          "transition-transform duration-300 ease-standard",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-border/70 px-5">
          <Link
            href="/"
            onClick={close}
            className="group flex items-center gap-3"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground">
              T
            </span>

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Tavi / Dev
            </span>
          </Link>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={close}
            className="
              flex size-9 items-center justify-center
              rounded-xl
              text-muted-foreground
              transition-colors
              hover:bg-surface-hover
              hover:text-foreground
            "
          >
            <X className="size-4.5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-5 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
              Navigation
            </p>
          </div>

          {children}
        </div>

        <div className="shrink-0 border-t border-border/70 px-5 py-4">
          <p className="text-xs leading-5 text-muted-foreground">
            Ideas for people who build.
          </p>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
