"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@repo/ui/components/shared/form";
import { toast } from "@repo/ui/components/ui/sonner";
import { Button } from "@repo/ui/components/ui/button";

import { PostFormState } from "@/lib/types/formState";
import PostEditor from "@/components/post-editor";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import { Label } from "@repo/ui/components/ui/label";
import { POST_STATUS } from "@/lib/types/post";
import { Switch } from "@repo/ui/components/ui/switch";

type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
};

type Props = {
  state: PostFormState;
  formAction: (payload: FormData) => void;
  categories: Category[];
};

const UpsertPostForm = ({ state, formAction, categories = [] }: Props) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isPublished, setIsPublished] = useState(
    state?.data?.status === POST_STATUS.PUBLISHED,
  );

  useEffect(() => {
    if (state?.message) {
      toast(state.message);
    }
  }, [state]);

  const previewUrl = imageUrl || state?.data?.previousThumbnailUrl;

  const formattedCategories = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  return (
    <form action={formAction} className="mx-auto w-full max-w-6xl">
      <input type="hidden" name="postId" defaultValue={state?.data?.postId} />

      {/* =========================================================
          Main writing area
      ========================================================= */}

      <section className="border-y border-border">
        <div className="px-1 py-10 sm:py-12 lg:py-16">
          <FormField
            id="title"
            label="Title"
            error={state?.errors?.title}
            required
          >
            <FormInput
              id="title"
              name="title"
              placeholder="Write a title..."
              defaultValue={state?.data?.title}
              className="
                h-auto
                border-0
                bg-transparent
                px-0
                py-3
                font-serif
                text-4xl
                font-medium
                leading-[1.05]
                tracking-[-0.04em]
                shadow-none
                placeholder:text-muted-foreground/30
                focus-visible:ring-0
                sm:text-5xl
                md:text-6xl
                lg:text-[4.5rem]
              "
            />
          </FormField>

          <div className="mt-10 border-t border-border/60 pt-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-5 bg-brand" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
                Article
              </span>
            </div>

            <input
              type="hidden"
              name="content"
              defaultValue={state?.data?.content}
            />

            <PostEditor
              name="content"
              defaultValue={state?.data?.content}
              error={state?.errors?.content}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="grid gap-10 py-10 sm:py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              Details
            </p>

            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-foreground">
              Shape the story
            </h2>

            <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
              Add the information readers need to discover and understand your
              article.
            </p>
          </div>

          <div className="space-y-8">
            {/* Tags */}

            <FormField
              id="tags"
              label="Tags"
              error={state?.errors?.tags}
              description="Use commas to separate topics."
            >
              <FormInput
                id="tags"
                name="tags"
                placeholder="react, typescript, nextjs"
                defaultValue={state?.data?.tags}
              />
            </FormField>

            {/* Category */}

            <FormField
              id="categoryId"
              label="Category"
              error={state?.errors?.categoryId}
              required
            >
              <FormSelect
                id="categoryId"
                name="categoryId"
                placeholder="Select a category"
                defaultValue={state?.data?.categoryId?.toString()}
                options={formattedCategories}
                required
              />
            </FormField>

            {/* Excerpt */}

            <FormField
              id="excerpt"
              label="Excerpt"
              description="A short summary used on cards, feeds, and search results."
              error={state?.errors?.excerpt}
            >
              <FormTextarea
                id="excerpt"
                name="excerpt"
                placeholder="Briefly describe what this article is about..."
                defaultValue={state?.data?.excerpt?.toString() ?? ""}
                maxLength={300}
                className="min-h-28 resize-y"
              />
            </FormField>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="grid gap-10 py-10 sm:py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              Presentation
            </p>

            <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-foreground">
              Featured image
            </h2>

            <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
              Give your article a visual identity for feeds, cards, and
              previews.
            </p>
          </div>

          <div>
            <FormField
              id="thumbnail"
              label="Thumbnail"
              error={state?.errors?.thumbnail}
            >
              <input
                id="thumbnail"
                type="file"
                name="thumbnail"
                accept="image/*"
                className="
                  block
                  w-full
                  cursor-pointer
                  rounded-xl
                  border
                  border-dashed
                  border-border
                  bg-surface-subtle
                  p-4
                  text-sm
                  text-muted-foreground
                  transition-colors
                  file:mr-3
                  file:rounded-lg
                  file:border-0
                  file:bg-brand-subtle
                  file:px-3
                  file:py-2
                  file:text-xs
                  file:font-medium
                  file:text-brand
                  hover:border-brand/50
                  hover:bg-surface-hover
                  focus-visible:outline-none
                "
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (!file) {
                    return;
                  }

                  const MAX_SIZE = 5 * 1024 * 1024;

                  if (file.size > MAX_SIZE) {
                    toast("Thumbnail must be 5 MB or smaller");
                    event.target.value = "";
                    setImageUrl("");
                    return;
                  }

                  setImageUrl(URL.createObjectURL(file));
                }}
              />
            </FormField>

            {previewUrl && (
              <div className="mt-5 max-w-2xl overflow-hidden rounded-2xl border border-border/70 bg-surface-subtle">
                <Image
                  src={previewUrl}
                  alt="Post thumbnail preview"
                  width={1200}
                  height={675}
                  className="aspect-video w-full object-cover"
                />

                <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
                  <p className="text-xs font-medium text-foreground">
                    Thumbnail preview
                  </p>

                  <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    16:9
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="flex flex-col gap-8 py-8 sm:py-10 md:flex-row md:items-center md:justify-between">
          <FormField id="status" error={state?.errors?.status}>
            <div className="flex items-center gap-3">
              <input
                type="hidden"
                name="status"
                value={isPublished ? POST_STATUS.PUBLISHED : POST_STATUS.DRAFT}
              />

              <Switch
                id="status"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />

              <div className="space-y-0.5">
                <Label htmlFor="status">
                  {isPublished ? "Publish post" : "Save as draft"}
                </Label>

                <p className="text-xs text-muted-foreground">
                  {isPublished
                    ? "This post will be visible to readers."
                    : "This post won't be visible to readers yet."}
                </p>
              </div>
            </div>
          </FormField>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button type="submit" className="h-11 px-7">
              Save post
            </Button>
          </div>
        </div>
      </section>
    </form>
  );
};

export default UpsertPostForm;
