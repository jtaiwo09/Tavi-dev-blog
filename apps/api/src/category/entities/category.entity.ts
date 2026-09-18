import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/post/entities/post.entity';

@ObjectType()
export class Category {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  slug!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [Post])
  posts!: Post[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
