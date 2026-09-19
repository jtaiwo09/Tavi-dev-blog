import { registerEnumType } from '@nestjs/graphql';
import { PostStatus } from 'src/generated/prisma/enums';

registerEnumType(PostStatus, {
  name: 'PostStatus',
  description: 'The publication status of a post',
});

export { PostStatus };
