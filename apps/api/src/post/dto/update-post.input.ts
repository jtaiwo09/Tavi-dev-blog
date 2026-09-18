import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreatePostInput } from './create-post.input';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field(() => Int)
  @IsInt()
  postId!: number;
}
