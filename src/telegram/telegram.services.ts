import { Injectable } from "@nestjs/common";
import { BookingService } from "src/booking/booking.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TelegramService {
    constructor(private readonly prisma: PrismaService, private readonly bookingsService: BookingService) {}

    async getUserByTelegram(telegram: string) {
        const foundUser = await this.prisma.user.findFirst({
            where: {
                telegram
            }
        });

        if (!foundUser) {
            return null;
        }

        return foundUser;
    }

    async getMyBookingsList(userId: string) {
        const bookings = await this.bookingsService.getBookingsByUser(userId);

        return bookings;
    }
}