import { Field, InputType } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  avatar?: string;
}
