import { Inject, Injectable } from '@nestjs/common';
import { DrizzleType } from 'src/adapter/database.module';
import { DRIZZLE } from 'src/adapter/database.module';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleType,
  ) {}

  // ... métodos do repositório
}
