import { Field, Int, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PostStatus } from 'generated/prisma/enums';

@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  excerpt?: string;

  @Field()
  @IsString()
  @MinLength(20)
  content!: string;

  @Field(() => Int)
  @IsInt()
  categoryId!: number;

  @Field(() => PostStatus, {
    defaultValue: PostStatus.DRAFT,
  })
  @IsEnum(PostStatus)
  status!: PostStatus;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  thumbnail?: string;
}
