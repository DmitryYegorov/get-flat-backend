import { Injectable, NotFoundException } from '@nestjs/common';
import { connect } from 'http2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async bookRealty(userId, data) {
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

  async getBookingsByUser(userId: string) {
    const bookings = await this.prisma.bookings.findMany({
      where: {
        userId,
      },
      include: {
        realty: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return bookings;
  }

  async getBookingById(id: string) {
    const booking = await this.prisma.bookings.findUnique({
      where: {
        id,
      },
      include: {
        realty: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Бронь не найдена');
    }

    return booking;
  }

  async getBookingChat(userId: string, bookingId: string) {
    const messages = await this.prisma.messages.findMany({
      where: {
        bookingId,
      },
      include: {
        fromUser: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map((message) => ({
      id: message.id,
      from: message.from,
      position: message.from !== userId ? 'right' : 'left',
      type: 'text',
      title: `${message.fromUser?.firstName} ${message.fromUser?.middleName} ${message.fromUser?.lastName}`,
      text: message.text,
      isRead: message.isRead,
    }));
  }

  async addMessage(bookingId: string, userId: string, message: string) {
    return await this.prisma.messages.create({
      data: {
        booking: { connect: { id: bookingId } },
        fromUser: { connect: { id: userId } },
        text: message,
      },
    });
  }

  async getBookingsForOwner(userId: string) {
    const bookings = await this.prisma.bookings.findMany({
      where: {
        realty: {
          ownerId: userId,
        },
      },
      include: {
        realty: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return bookings;
  }

  async allMessagesRead(bookingId: string) {
    await this.prisma.messages.updateMany({
      where: {
        id: bookingId,
      },
      data: {
        isRead: true,
      },
    });
  }
}
