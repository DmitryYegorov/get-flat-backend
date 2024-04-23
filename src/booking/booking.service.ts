import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async bookRealty(userId, data) {
    console.log({data});
    const booking = await this.prisma.bookings.create({
      data: {
        userId,
        realtyId: data.realtyId,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });

    return booking;
  }
}
