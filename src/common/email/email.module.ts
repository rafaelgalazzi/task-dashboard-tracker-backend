import { Module } from '@nestjs/common';
import { EmailsService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    //Load env vars in async why to ensure env vars are loaded
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SMTP_HOST'),
          port: config.get<number>('SMTP_PORT'),
          secure: false,
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASS'),
          },
        },
        defaults: { from: '"My App" <no-reply@myapp.com>' },
      }),
    }),
  ],
  exports: [EmailsService],
  providers: [EmailsService],
})
export class EmailModule {}
