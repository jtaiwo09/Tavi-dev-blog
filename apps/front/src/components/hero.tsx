import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const topics = ["Development", "Design", "Technology", "Ideas"];

const Hero = () => {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="content-container">
        {/* Intro */}
        <div className="grid gap-10 border-b border-border py-16 sm:py-20 md:py-24 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16 lg:py-28">
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-8 bg-brand" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Developer journal
              </span>
            </div>

            <h1 className="max-w-5xl text-balance font-serif text-[3.7rem] font-medium leading-[0.91] tracking-[-0.055em] text-foreground sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[7.5rem]">
              Ideas for people
              <br />
              <span className="text-brand">who build.</span>
            </h1>
          </div>

          <div className="max-w-sm lg:pb-1">
            <p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Software, design, technology, and thoughtful writing about the
              things we create and the ideas behind them.
            </p>

            <div className="mt-7 flex items-center gap-4">
              <Link
                href="#latest-posts"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                Start reading
                <ArrowDown className="size-4 transition-transform duration-200 group-hover:translate-y-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-col gap-4 border-b border-border py-5 sm:flex-row sm:items-center sm:gap-8">
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Explore
          </span>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {topics.map((topic) => (
              <Link
                key={topic}
                href={`/?topic=${topic.toLowerCase()}`}
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>

        {/* Publication introduction */}
        <div
          id="about"
          className="grid gap-8 py-14 sm:py-18 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-24"
        >
          {/* Editorial statement */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                  From the desk
                </span>

                <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Notes & ideas
                </span>
              </div>

              <div>
                <h2 className="mt-7 max-w-2xl text-balance font-serif text-4xl font-medium leading-[1.02] tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl">
                  Thinking clearly about the things we build.
                </h2>

                <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  Tavi / Dev is a space for exploring the craft behind software.
                  Practical lessons, technical deep dives, design decisions, and
                  ideas worth sitting with.
                </p>

                <Link
                  href="#latest-posts"
                  className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
                >
                  Explore the writing
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Publication identity */}
            <div className="mt-10 flex items-center gap-3 border-t border-border pt-5 lg:mt-16">
              <div className="flex size-8 items-center justify-center rounded-full bg-brand-subtle text-xs font-semibold text-brand">
                T
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">Tavi</p>
                <p className="text-xs text-muted-foreground">
                  Developer & writer
                </p>
              </div>
            </div>
          </div>

          {/* Editorial image */}
          <div className="relative overflow-hidden bg-surface-subtle">
            <div className="relative aspect-4/3 sm:aspect-16/10 lg:aspect-4/3">
              <Image
                src="/images/editorial.jpg"
                alt="A workspace for writing and building software"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 max-w-xs">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/75">
                  Build · Learn · Share
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
