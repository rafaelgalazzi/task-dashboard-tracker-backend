import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, RequestWithUser } from 'src/common/types/auth.types';

export const User = createParamDecorator<keyof JwtPayload | undefined>(
  (key: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    return key ? req.user?.[key] : req.user;
  },
);
