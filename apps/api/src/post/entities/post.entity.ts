import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { PostStatus } from 'src/generated/prisma/enums';
import { Category } from 'src/category/entities/category.entity';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Count {
  @Field(() => Int)
  likes!: number;

  @Field(() => Int)
  comments!: number;
}

@ObjectType()
export class Post {
  @Field(() => Int)
  id!: number;

  @Field()
  title!: string;

  @Field({ nullable: true })
  excerpt?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field()
  content!: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  publishedAt?: Date | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => [CommentEntity])
  comments!: CommentEntity[];

  @Field(() => [Tag])
  tags!: Tag[];

  @Field(() => User)
  author!: User;

  @Field(() => Category)
  category!: Category;

  @Field(() => Int)
  wordCount!: number;

  @Field(() => Int)
  readingTimeMinutes!: number;

  @Field(() => PostStatus)
  status!: PostStatus;

  @Field(() => Count)
  _count!: Count;
}
