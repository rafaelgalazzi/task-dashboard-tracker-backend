import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { HASH, IHash } from 'src/adapters/hash.module';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(HASH)
    private readonly hash: IHash,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<string> {
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) throw new ConflictException('Email already in use');

    const hashedPassword = await this.hash.hash(password);

    // Here you'd save name, email, and hashedPassword to DB...
    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    const createdUser = await this.usersRepository.create(newUser);

    return `User created with ID: ${createdUser[0].id}`;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
