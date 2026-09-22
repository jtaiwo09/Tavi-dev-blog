import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

type Props = {
  href: string;
  title: string;
  thumbnail?: string | null;
  children: ReactNode;
  thumbnailFooter?: ReactNode;
  showReadAction?: boolean;
};

const PostListLayout = ({
  href,
  title,
  thumbnail,
  children,
  thumbnailFooter,
  showReadAction = true,
}: Props) => {
  return (
    <article className="group border-b border-border">
      <div className="grid gap-6 py-8 sm:gap-8 sm:py-9 md:grid-cols-[minmax(0,1fr)_15rem] lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12 lg:py-10">
        {/* Content */}
        <div className="min-w-0">{children}</div>

        {/* Thumbnail + optional actions */}
        <div className="order-first flex flex-col gap-3 sm:order-last">
          <Link
            href={href}
            aria-label={`Read ${title}`}
            className="group/image relative block aspect-video w-full overflow-hidden bg-surface-subtle"
          >
            <Image
              src={thumbnail || "/no-image.jpeg"}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 288px"
              className="object-cover"
            />

            <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover/image:bg-black/4" />

            {showReadAction && (
              <span className="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-full bg-background/95 text-foreground opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover/image:opacity-100">
                <ArrowUpRightIcon className="size-4" />
              </span>
            )}
          </Link>

          {thumbnailFooter}
        </div>
      </div>
    </article>
  );
};

export default PostListLayout;
