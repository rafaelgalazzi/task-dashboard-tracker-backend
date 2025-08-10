import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HASH, IHash } from 'src/adapters/hash.module';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { UserWithoutPassword } from 'src/adapters/schema';
import { JwtPayload } from 'src/common/types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(HASH)
    private readonly hash: IHash,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly userRepository: UsersRepository,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getUser(payload: JwtPayload): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findByEmail(payload.email);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.authRepository.findByEmailWithPassword(email);

    if (!user) throw new NotFoundException(`Invalid login`);

    const isPasswordValid = await this.hash.compare(password, user.password);

    if (!isPasswordValid) throw new NotFoundException('Invalid login');

    const payload = { sub: user.id, email: user.email };

    const token = this.jwtService.sign(payload);

    return token;
  }
}
