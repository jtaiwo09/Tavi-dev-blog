import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { UserStatus } from 'src/generated/prisma/enums';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Post } from 'src/post/entities/post.entity';

@ObjectType()
export class User {
  @Field(() => Int)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => [Post])
  posts?: Post[];

  @Field(() => [Like])
  likes?: Like[];

  @Field(() => [CommentEntity])
  comments?: CommentEntity[];

  @Field(() => UserStatus, { nullable: true })
  status?: UserStatus;

  @Field(() => Boolean)
  isEmailVerified!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
