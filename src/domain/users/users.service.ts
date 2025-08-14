import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { HASH, IHash } from 'src/adapters/hash.module';
import { UsersRepository } from './users.repository';
import { EmailsService } from 'src/common/email/email.service';
import { HBS, IHbs } from 'src/common/email/handlebars.module';

@Injectable()
export class UsersService {
  constructor(
    @Inject(HASH)
    private readonly hash: IHash,
    private readonly usersRepository: UsersRepository,
    private readonly emailsService: EmailsService,
    @Inject(HBS)
    private readonly hbs: IHbs,
  ) {}

  async createUser(form: { firstName: string; lastName: string; email: string; password: string }): Promise<string> {
    const existingUser = await this.usersRepository.findByEmail(form.email);

    if (existingUser) throw new ConflictException('Email already in use');

    const hashedPassword = await this.hash.hash(form.password);

    const newUser = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: hashedPassword,
    };

    const createdUser = await this.usersRepository.create(newUser);

    const token = this.hash.generateRawToken(64);
    const tokenHash = this.hash.generateTokenHash(token);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.usersRepository.createEmailVerificationToken({
      token: tokenHash,
      userId: createdUser.id,
      expiresAt, // 1 day
    });

    const generatedTemplate = this.hbs.generateHtml({
      templateName: 'EmailVerification',
      data: {
        user: {
          name: createdUser.firstName + ' ' + createdUser.lastName,
        },
        verificationUrl: `${process.env.APP_FRONT_URL}/account/confirm?token=${tokenHash}`,
        expiresAt,
      },
    });

    await this.emailsService.sendEmail({
      to: form.email,
      subject: 'Confirm your email',
      html: generatedTemplate,
    });

    return `User created with ID: ${createdUser.id}, Confirmation email sent`;
  }

  async confirmAccount(form: { token: string }) {
    const findUserByToken = await this.usersRepository.verifyConfirmUserToken(form);

    if (!findUserByToken) throw new Error('User not found');

    await this.usersRepository.update({ ...findUserByToken, isConfirmed: true });
  }
}
