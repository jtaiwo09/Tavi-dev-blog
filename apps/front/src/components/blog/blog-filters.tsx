"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import FormField from "@repo/ui/components/shared/form/form-field";
import FormInput from "@repo/ui/components/shared/form/form-input";
import FormSelect from "@repo/ui/components/shared/form/form-select";
import { Search, X } from "lucide-react";

import type { Category, Tag } from "@/lib/types/modelTypes";

type Props = {
  categories: Category[];
  tags: Tag[];
  search?: string;
  categorySlug?: string;
  tag?: string;
};

const BlogFilters = ({
  categories,
  tags,
  search = "",
  categorySlug = "",
  tag = "",
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = React.useState(search);

  const updateParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      params.delete("page");

      const queryString = params.toString();

      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  React.useEffect(() => {
    setSearchValue(search);
  }, [search]);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (searchValue.trim() === search.trim()) {
        return;
      }

      updateParams({
        search: searchValue.trim() || null,
      });
    }, 450);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchValue, search, updateParams]);

  const categoryOptions = [
    {
      value: "",
      label: "All categories",
    },
    ...categories.map((category) => ({
      value: category.slug,
      label: category.name,
    })),
  ];

  const tagOptions = [
    {
      value: "",
      label: "All tags",
    },
    ...tags.map((item) => ({
      value: item.slug,
      label: item.name,
    })),
  ];

  const hasFilters = Boolean(search) || Boolean(categorySlug) || Boolean(tag);

  const clearFilters = () => {
    setSearchValue("");

    router.push(pathname, {
      scroll: false,
    });
  };

  return (
    <div className="border-t border-border py-5">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_12rem_auto] md:items-end">
        <FormField id="blog-search" label="Search">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <FormInput
              id="blog-search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search articles..."
              className="pl-10"
              type="search"
              aria-label="Search articles"
            />
          </div>
        </FormField>

        <FormField id="blog-category" label="Category">
          <FormSelect
            id="blog-category"
            value={categorySlug}
            onValueChange={(value) =>
              updateParams({
                category: value || null,
              })
            }
            options={categoryOptions}
            placeholder="All categories"
          />
        </FormField>

        <FormField id="blog-tag" label="Tag">
          <FormSelect
            id="blog-tag"
            value={tag}
            onValueChange={(value) =>
              updateParams({
                tag: value || null,
              })
            }
            options={tagOptions}
            placeholder="All tags"
          />
        </FormField>

        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-foreground md:self-end"
          >
            <X className="size-4" />
            Clear
          </button>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>
    </div>
  );
};

export default BlogFilters;
