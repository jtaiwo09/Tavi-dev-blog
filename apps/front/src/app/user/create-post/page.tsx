import { getCategories } from "@/lib/actions/category";
import CreatePostContainer from "./_components/CreatePostContainer";
import { getTags } from "@/lib/actions/tags";
import type { Category, Tag } from "@/lib/types/modelTypes";

const CreatePostPage = async () => {
  const categories: Category[] = await getCategories();
  const tags: Tag[] = await getTags();

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="content-container">
        <header className="border-b border-border py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-6 bg-brand" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                  Publishing
                </span>
              </div>

              <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[0.95] tracking-[-0.045em] text-foreground sm:text-6xl md:text-7xl">
                Create something
                <br />
                <span className="text-brand">worth reading.</span>
              </h1>
            </div>

            <p className="max-w-sm text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Turn your ideas into an article. Write clearly, shape the
              presentation, and publish when it is ready.
            </p>
          </div>
        </header>

        <CreatePostContainer categories={categories} tags={tags} />
      </div>
    </main>
  );
};

export default CreatePostPage;
