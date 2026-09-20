import { getCategories } from "@/lib/actions/category";
import { fetchPostById } from "@/lib/actions/postActions";

import UpdatePostContainer from "./_components/UpdatePostContainer";
import { getTags } from "@/lib/actions/tags";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const UpdatePostPage = async ({ params }: Props) => {
  const { id } = await params;

  const post = await fetchPostById(Number(id));
  const categories = await getCategories();
  const tags = await getTags();

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="content-container">
        <header className="border-b border-border py-12 sm:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-6 bg-brand" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                  Publishing
                </span>
              </div>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[0.95] tracking-[-0.045em] text-foreground sm:text-6xl md:text-7xl">
                Refine your
                <br />
                <span className="text-brand">story.</span>
              </h1>
            </div>

            <div className="max-w-sm">
              <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Make thoughtful changes to your article, improve the
                presentation, and publish when everything feels ready.
              </p>

              <div className="mt-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-brand" />
                Editing
              </div>
            </div>
          </div>
        </header>

        <UpdatePostContainer post={post} categories={categories} tags={tags} />
      </div>
    </main>
  );
};

export default UpdatePostPage;
