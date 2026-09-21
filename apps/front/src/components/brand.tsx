import Link from "next/link";
import Image from "next/image";
import { cn } from "@repo/ui/lib/utils";

interface IProps {
  className?: string;
  onClick?: () => void;
}
export function Brand({ className, onClick }: IProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn("group hidden items-center gap-3 md:flex", className)}
    >
      <div className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand">
        <Image
          src="/brand.png"
          alt="Tavi / Dev logo"
          width={32}
          height={32}
          className="size-full object-cover"
          priority
        />
      </div>

      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-foreground">
        Tavi / Dev
      </span>
    </Link>
  );
}
