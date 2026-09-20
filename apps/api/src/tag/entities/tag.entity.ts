import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from 'src/post/entities/post.entity';

@ObjectType()
export class Tag {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  slug!: string;
}
