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

  async createUser(name: string, email: string, password: string): Promise<string> {
    const existingUser = await this.usersRepository.findByEmail(email);

    if (existingUser) throw new ConflictException('Email already in use');

    const hashedPassword = await this.hash.hash(password);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      isConfirmed: false,
    };

    const createdUser = await this.usersRepository.create(newUser);

    //Send confirmation email

    return `User created with ID: ${createdUser.id}, Confirmation email sent`;
  }
}
