import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

type Props = {
  href: string;
  title: string;
  thumbnail?: string | null;
  children: ReactNode;
  footer?: ReactNode;
  showReadAction?: boolean;
};

const PostListLayout = ({
  href,
  title,
  thumbnail,
  children,
  footer,
  showReadAction = true,
}: Props) => {
  return (
    <article className="group border-b border-border last:border-b-0">
      <div className="grid gap-6 py-8 sm:gap-8 sm:py-9 md:grid-cols-[minmax(0,1fr)_15rem] lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12 lg:py-10">
        {/* Content */}
        <div className="min-w-0">
          {children}

          {/* Footer */}
          {footer && (
            <div className="mt-5 flex flex-wrap items-center gap-4">
              {footer}

              {showReadAction && (
                <Link
                  href={href}
                  className="ml-auto hidden items-center gap-1.5 text-xs font-medium text-foreground transition-colors hover:text-brand sm:inline-flex"
                >
                  Read
                  <ArrowUpRightIcon className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Thumbnail */}
        <Link
          href={href}
          aria-label={`Read ${title}`}
          className="group/image relative order-first block aspect-video w-full overflow-hidden bg-surface-subtle sm:order-last"
        >
          <Image
            src={thumbnail || "/no-image.jpeg"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 288px"
            className="object-cover"
          />

          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover/image:bg-black/[0.04]" />

          {showReadAction && (
            <span className="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-full bg-background/95 text-foreground opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover/image:opacity-100">
              <ArrowUpRightIcon className="size-4" />
            </span>
          )}
        </Link>
      </div>
    </article>
  );
};

export default PostListLayout;
