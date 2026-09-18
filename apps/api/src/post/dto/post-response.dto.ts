import { Int, Field, ObjectType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@ObjectType()
export class PostsResponse {
  @Field(() => [Post])
  posts!: Post[];

  @Field(() => Int)
  total!: number;
}
