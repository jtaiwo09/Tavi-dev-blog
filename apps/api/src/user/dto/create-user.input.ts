import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password?: string;

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
