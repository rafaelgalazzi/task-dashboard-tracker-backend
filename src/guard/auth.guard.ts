// auth/auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decoratos/public.decorator';
import { JwtPayload, RequestWithUser } from 'src/types/auth.types';

function hasAuthCookie(cookies: unknown): cookies is { auth_token: string } {
  return (
    typeof cookies === 'object' &&
    cookies !== null &&
    'auth_token' in cookies &&
    typeof (cookies as Record<string, unknown>).auth_token === 'string'
  );
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<RequestWithUser>();

    const cookies = req.cookies as unknown;
    if (!hasAuthCookie(cookies)) {
      throw new UnauthorizedException('No auth token');
    }

    const token = cookies.auth_token;
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET env var is not set');

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
