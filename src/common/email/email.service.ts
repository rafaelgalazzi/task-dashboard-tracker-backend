import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
@Injectable()
export class EmailsService {
  constructor(@Inject(MailerService) private mailer: MailerService) {}

  async sendEmail(to: string, subject: string, template: string, from?: string, text?: string) {
    await this.mailer.sendMail({
      to,
      subject,
      text,
      from,
      template,
    });
  }
}
