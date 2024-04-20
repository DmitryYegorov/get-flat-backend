import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

console.log({
    user: process.env.MAIL_USER_NAME,
    pass: process.env.MAIL_PASSWORD,
  });

const path = `${__dirname.split('dist')[0]}/src/mail`;


@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        transport: {
          host: 'smtp.yandex.ru',
          port: 465,
          from: process.env.MAIL_USER_NAME,
          auth: {
            user: process.env.MAIL_USER_NAME,
            pass: process.env.MAIL_PASSWORD,
          },
          debug: true,
          logger: true,
          secure: true,
        },
        defaults: {
          from: `"HOME.GURU" <${process.env.MAIL_USER_NAME}>`,
        },
        template: {
          dir: join(path, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    ConfigModule.forRoot(),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
