import { Field, Int, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsArray,
  IsBase64,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PostStatus } from 'src/generated/prisma/enums';

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
  @IsBase64()
  content!: string;

  @Field(() => Int)
  @IsInt()
  categoryId!: number;

  @Field(() => PostStatus, {
    defaultValue: PostStatus.DRAFT,
  })
  @IsEnum(PostStatus)
  status!: PostStatus;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @IsInt({ each: true })
  tags?: number[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  thumbnail?: string;
}
