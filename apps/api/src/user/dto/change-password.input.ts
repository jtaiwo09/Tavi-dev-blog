import { Field, InputType } from '@nestjs/graphql';
import { IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsString()
  @MinLength(1)
  currentPassword!: string;

  @Field()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  newPassword!: string;
}
