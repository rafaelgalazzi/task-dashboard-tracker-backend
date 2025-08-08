import { Inject, Injectable } from '@nestjs/common';
import { HASH, IHash } from 'src/adapters/hash.module';

@Injectable()
export class UsersService {
  constructor(
    @Inject(HASH)
    private readonly hash: IHash,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<string> {
    const hashedPassword = await this.hash.hash(password);

    // Here you'd save name, email, and hashedPassword to DB...

    return `User ${name} with email ${email} created successfully with hashed password: ${hashedPassword}`;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
