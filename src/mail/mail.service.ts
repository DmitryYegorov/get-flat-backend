import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDataType } from './types/send-mail-data.type';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail<T>(data: SendMailDataType, context: T) {
    await this.mailerService.sendMail({
      to: data.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: data.subject,
      template: `./${data.templateId}`, // `.hbs` extension is appended automatically
      context,
    });
  }
}
