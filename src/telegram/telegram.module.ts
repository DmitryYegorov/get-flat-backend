import { Module } from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import * as LocalSession from "telegraf-session-local";
import { TelegramController } from "./telegram.controller";
import { TelegramService } from "./telegram.services";
import { PrismaModule } from "src/prisma/prisma.module";
import { PrismaService } from "src/prisma/prisma.service";
import { BookingService } from "src/booking/booking.service";

const sessions = new LocalSession({
    database: 'session_db.json'
});

@Module({
    controllers: [],
    imports: [
        TelegrafModule.forRoot({
            token: '7117840684:AAGMXnodIULlZoeGqblM2itoDVlpE85xJVU',
            middlewares: [sessions.middleware()]
        }),
        PrismaModule,
    ],
    providers: [TelegramController, TelegramService, PrismaService, BookingService]
})
export class TelegramModule {}