import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HASH, IHash } from 'src/adapters/hash.module';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(HASH)
    private readonly hash: IHash,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}
  getHello(): string {
    return 'Hello World!';
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
