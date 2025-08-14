import { Module, Provider } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';

export const HASH = 'HASH';

export interface IHash {
  hash: (password: string) => Promise<string>;
  compare: (password: string, hash: string) => Promise<boolean>;
  generateRawToken: (bytes?: number) => string;
  generateTokenHash: (token: string) => string;
}

export const HashProvider: Provider = {
  provide: HASH,
  useValue: {
    hash: (password: string) => bcrypt.hash(password, 10),
    compare: (password: string, hash: string) => bcrypt.compare(password, hash),
    generateRawToken: (bytes = 32) => randomBytes(bytes).toString('base64url'),
    generateTokenHash: (token: string) => createHash('sha256').update(token).digest('base64url'),
  },
};

@Module({
  providers: [HashProvider],
  exports: [HashProvider],
})
export class HashModule {}
