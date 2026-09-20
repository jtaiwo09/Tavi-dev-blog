import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="group hidden items-center gap-3 md:flex">
      <span className="flex size-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground">
        T
      </span>

      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-foreground">
        Tavi / Dev
      </span>
    </Link>
  );
}
