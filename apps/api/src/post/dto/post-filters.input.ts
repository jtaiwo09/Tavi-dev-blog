import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class PostFiltersInput {
  @IsOptional()
  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @IsOptional()
  @Field({ nullable: true })
  tag?: string;

  @IsOptional()
  @Field({ nullable: true })
  search?: string;
}
