import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class PostFiltersInput {
  @IsOptional()
  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  categorySlug?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  tag?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  search?: string;
}
