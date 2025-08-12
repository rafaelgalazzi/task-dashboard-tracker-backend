import { Module } from '@nestjs/common';
import { EmailsService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: { from: '"My App" <no-reply@myapp.com>' },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  exports: [EmailsService],
  providers: [EmailsService],
})
export class EmailModule {}
