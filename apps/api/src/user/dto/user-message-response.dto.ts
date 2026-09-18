import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserMessageResponse {
  @Field()
  message!: string;
}
