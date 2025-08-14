import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
@Injectable()
export class EmailsService {
  constructor(@Inject(MailerService) private mailer: MailerService) {}

  async sendEmail(form: { to: string; subject: string; html: string; from?: string; text?: string }) {
    await this.mailer.sendMail({
      to: form.to,
      subject: form.subject,
      html: form.html,
      from: form.from,
      text: form.text,
    });
  }
}
