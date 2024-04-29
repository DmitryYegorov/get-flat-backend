import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { RealtyModule } from './realty/realty.module';
import { BookingModule } from './booking/booking.module';
import { ChatGateway } from './websocket.gateway';
import { PrismaService } from './prisma/prisma.service';
import { BookingService } from './booking/booking.service';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    UsersModule,
    MailModule,
    RealtyModule,
    BookingModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegramModule,
  ],
  controllers: [],
  providers: [ChatGateway, PrismaService, BookingService],
})
export class AppModule {}
