import { CommentEntity } from "@/lib/types/modelTypes";
import { formatDate } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/20/solid";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";

type Props = {
  comment: CommentEntity;
};

const CommentCard = ({ comment }: Props) => {
  return (
    <article className="border-b border-border py-7 sm:py-8">
      <div className="flex items-start gap-4">
        <Avatar className="size-9 shrink-0">
          <AvatarImage
            src={comment.author.avatar || "/empty_profile.png"}
            alt={comment.author.name}
          />

          <AvatarFallback className="bg-brand-subtle text-brand">
            <UserIcon className="size-4" />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <p className="text-sm font-semibold text-foreground">
              {comment.author.name}
            </p>

            <span aria-hidden="true" className="text-muted-foreground/40">
              ·
            </span>

            <time
              dateTime={new Date(comment.createdAt).toISOString()}
              className="text-xs text-muted-foreground"
            >
              {formatDate(comment.createdAt)}
            </time>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-prose">
            {comment.content}
          </p>
        </div>
      </div>
    </article>
  );
};

export default CommentCard;
