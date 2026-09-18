import { Int, Field, ObjectType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@ObjectType()
export class PostStats {
  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  published!: number;

  @Field(() => Int)
  drafts!: number;
}

@ObjectType()
export class UserPostsResponse {
  @Field(() => [Post])
  posts!: Post[];

  @Field(() => PostStats)
  stats!: PostStats;
}
