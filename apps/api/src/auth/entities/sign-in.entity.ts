import { Field, ObjectType } from '@nestjs/graphql';

ObjectType();
export class SignInEntity {
  @Field()
  email!: string;

  @Field()
  password!: string;
}
