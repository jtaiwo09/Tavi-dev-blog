import { Skeleton } from "@repo/ui/components/ui/skeleton";

const CommentCardSkeleton = () => {
  return (
    <div className="border-b border-border py-7 sm:py-8">
      <div className="flex items-start gap-4">
        <Skeleton className="size-9 shrink-0 rounded-full" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-3/4 max-w-lg" />
        </div>
      </div>
    </div>
  );
};

export default CommentCardSkeleton;
