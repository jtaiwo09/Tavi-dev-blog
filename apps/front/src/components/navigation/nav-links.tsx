import Link from "next/link";
import { BookOpen, Mail } from "lucide-react";

const links = [
  {
    href: "/",
    label: "Blog",
    icon: BookOpen,
  },
  {
    href: "#contact",
    label: "Contact",
    icon: Mail,
  },
];

type Props = {
  mobile?: boolean;
};

export const NavLinks = ({ mobile = false }: Props) => {
  return (
    <>
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`
            group flex min-h-11 items-center gap-3
            rounded-xl px-3
            text-sm font-medium
            text-nav-foreground
            transition-colors
            hover:bg-nav-hover hover:text-foreground
            ${mobile ? "" : "md:min-h-10"}
          `}
        >
          <span
            className={`
              flex size-8 shrink-0 items-center justify-center
              rounded-lg bg-brand-subtle text-brand
              ${mobile ? "" : "md:size-auto md:bg-transparent"}
            `}
          >
            <Icon className="size-4" />
          </span>

          <span>{label}</span>
        </Link>
      ))}
    </>
  );
};
