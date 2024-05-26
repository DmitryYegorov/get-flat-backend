import { Module } from '@nestjs/common';
import { BookingContrller } from './booking.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingService } from './booking.service';
import { MailService } from 'src/mail/mail.service';
import { TelegramService } from 'src/telegram/telegram.services';
import { Telegraf } from 'telegraf';

@Module({
  controllers: [BookingContrller],
  providers: [
    PrismaService,
    MailService,
    BookingService,
    TelegramService,
    Telegraf,
  ],
  imports: [],
})
export class BookingModule {}
