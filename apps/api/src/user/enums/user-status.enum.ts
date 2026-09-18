import { registerEnumType } from '@nestjs/graphql';
import { UserStatus } from 'generated/prisma/client';

registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: 'The current status of a user account.',
});

export { UserStatus };
