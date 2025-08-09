import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export type RequestWithUser = Request & { user?: JwtPayload };
