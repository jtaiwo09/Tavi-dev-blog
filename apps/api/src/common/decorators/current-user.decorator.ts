import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { AccessTokenPayload } from '../interfaces/jwt-payload';

export const CurrentUser = createParamDecorator(
  (data: keyof AccessTokenPayload | undefined, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    return data ? user?.[data] : user;
  },
);
