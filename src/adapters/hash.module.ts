import { Module, Provider } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const HASH = 'HASH';

export interface IHash {
  hash: (password: string) => Promise<string>;
  compare: (password: string, hash: string) => Promise<boolean>;
}

export const HashProvider: Provider = {
  provide: HASH,
  useValue: {
    hash: (password: string) => bcrypt.hash(password, 10),
    compare: (password: string, hash: string) => bcrypt.compare(password, hash),
  },
};

@Module({
  providers: [HashProvider],
  exports: [HashProvider],
})
export class HashModule {}
