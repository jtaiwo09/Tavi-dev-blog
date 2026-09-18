import { Reflector } from '@nestjs/core';

export const IS_PUBLIC = 'isPublic';

export const Public = Reflector.createDecorator({ key: IS_PUBLIC });
